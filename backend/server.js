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
const User = require("./models/userSchema"); // Import User model
const generateToken = require("./utils/generateToken"); // <-- Import your generateToken function

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

// Google OAuth Strategy with User Creation
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // Create a new user if not found
          user = new User({
            email: profile.emails[0].value,
            firstname: profile.displayName,
            googleId: profile.id,
            profileImage: profile.photos[0].value,
            phone: "0000000000", // Default phone number
            password: "", // No password required for Google login
          });
          await user.save();
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

// Google Auth Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Modified callback route to generate a token and pass it to the frontend
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Generate a token for the authenticated user
    const token = generateToken(req.user._id);
    // Redirect to the frontend with the token as a query parameter
    res.redirect(`http://localhost:5173/user/home?token=${token}`);
  }
);

app.get("/auth/logout", (req, res) => {
  req.logout(() => {
    res.redirect("http://localhost:5173/");
  });
});

app.get("/auth/user", (req, res) => {
  res.json(req.user || null);
});

app.use("/user", commonRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);

const PORT = process.env.PORT || 5000;
connectDB();

app.listen(PORT, () =>
  console.log(`Server started listening on http://localhost:${PORT}`)
);
