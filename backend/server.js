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

// Google OAuth Strategy with Separate Signup/Login Handling
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true, // Allows passing request object
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        const type = req.query.type; // Capture type from query params

        if (!user && type === "signup") {
          // Create a new user ONLY if request is from signup
          user = new User({
            email: profile.emails[0].value,
            firstname: profile.displayName,
            googleId: profile.id,
            profileImage: profile.photos[0].value,
            phone: "0000000000",
            password: "",
          });
          await user.save();
        } else if (!user) {
          // If user not found in login flow, return failure
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize & Deserialize User
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Separate Signup & Login Endpoints
app.get("/auth/google/signup", (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"], session: false })(req, res, next);
});
app.get("/auth/google/login", (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"], session: false })(req, res, next);
});

// Google Auth Callback
app.get(
  "/auth/google/callback",
  (req, res, next) => {
    passport.authenticate("google", { failureRedirect: "/auth/failure" })(req, res, next);
  },
  (req, res) => {
    const token = generateToken(req.user._id);
    res.redirect(`http://localhost:5173/user/home?token=${token}`);
  }
);

// Handle login failure
app.get("/auth/failure", (req, res) => {
  res.redirect("http://localhost:5173/login?error=User not registered");
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
