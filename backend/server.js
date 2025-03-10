const { config } = require("dotenv");
const express = require("express");
const connectDB = require("./config/db");
const adminRouter = require("./routes/adminRoutes");
const userRouter = require("./routes/userRoutes");
const commonRouter = require("./routes/commonRoutes");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/userSchema");
const generateToken = require("./utils/generateToken");

const app = express();
config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy with proper flow handling
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Store the auth type (signup or login) in the session
        const authType = req.query.type || req.session.authType;
        if (authType) {
          req.session.authType = authType;
        }

        // Find existing user
        let user = await User.findOne({ email: profile.emails[0].value });
        
        // Handle signup flow
        if (authType === "signup") {
          if (user) {
            // User already exists
            return done(null, false, { message: "User already exists. Please login instead." });
          }
          
          // Create new user
          user = new User({
            email: profile.emails[0].value,
            firstname: profile.displayName,
            googleId: profile.id,
            profileImage: profile.photos[0].value,
            phone: "0000000000",
            password: "",
          });
          await user.save();
          return done(null, user);
        } 
        
        // Handle login flow
        else if (authType === "login") {
          if (!user) {
            // User doesn't exist
            return done(null, false, { message: "No account found. Please signup first." });
          }
          return done(null, user);
        }
        
        // Default case (no auth type specified)
        else {
          return done(null, false, { message: "Invalid authentication flow" });
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize & Deserialize User
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Signup Endpoint
app.get("/auth/google/signup", (req, res, next) => {
  req.session.authType = "signup";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "signup"
  })(req, res, next);
});

// Login Endpoint
app.get("/auth/google/login", (req, res, next) => {
  req.session.authType = "login";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "login"
  })(req, res, next);
});

// Google Auth Callback
app.get(
  "/auth/google/callback",
  (req, res, next) => {
    passport.authenticate("google", {
      failureRedirect: "/auth/failure",
      failureMessage: true
    })(req, res, next);
  },
  (req, res) => {
    // Generate JWT token for authentication
    const token = generateToken(req.user._id);
    
    // Clear auth type from session after successful auth
    delete req.session.authType;
    
    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/user/home?token=${token}`);
  }
);



app.get("/auth/failure", (req, res) => {
  const errorMessage = req.session.messages ? 
    req.session.messages[req.session.messages.length - 1] : 
    "Authentication failed";
  
  // Determine which page to redirect to based on the auth type
  const redirectPage = req.session.authType === "signup" ? "signup" : "/";
  
  // Redirect with the error message
  res.redirect(`http://localhost:5173/${redirectPage}?error=${encodeURIComponent(errorMessage)}`);
  
  // Clear messages after use
  if (req.session.messages) {
    req.session.messages = [];
  }
});


// Logout Route
app.get("/auth/logout", (req, res) => {
  req.logout(() => {
    res.redirect("http://localhost:5173/");
  });
});

// Check Authenticated User
app.get("/auth/user", (req, res) => {
  res.json(req.user || null);
});

// Routers
app.use("/user", commonRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);

const PORT = process.env.PORT || 5000;
connectDB();

app.listen(PORT, () =>
  console.log(`Server started listening on http://localhost:${PORT}`)
);