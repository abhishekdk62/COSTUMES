const bcrypt = require("bcrypt");
const Admin = require("../models/adminSchema");
const User = require("../models/userSchema");
const generateToken = require("../utils/generateToken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user (Admin first, then User)
    let user = await Admin.findOne({ email });
    let role = user ? "admin" : "user";
    if (!user) {
      user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "Incorrect Email address" });
      }
      if (!user.status) {
        return res.status(403).json({ message: "Your account is blocked. Contact support." });
      }
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password" });
    }
    const token = generateToken(user._id, role);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    res.status(200).json({ message: "Login successful", role, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { _id, status } = req.body;

    // Find user
    const user = await User.findById(_id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Update user status and return the updated document
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { status },
      { new: true } // This ensures you get the updated user back
    );

    res.json({ message: "Status updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0), // Expire the cookie immediately
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};





module.exports = { login,logout, updateProfile };
