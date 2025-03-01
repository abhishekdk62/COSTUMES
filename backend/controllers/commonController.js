const bcrypt = require("bcrypt");
const Admin = require("../models/adminSchema");
const User = require("../models/userSchema");
const generateToken = require("../utils/generateToken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email belongs to an Admin
    let user = await Admin.findOne({ email });
    let role = "admin";

    if (!user) {
      // If not found in Admin, check in Users
      user = await User.findOne({ email });
      role = "user";

      if (!user) {
        return res.status(400).json({ message: "Incorrect Email address" });
      }

      // ✅ Blocked User Check
      if (!user.status) {
        return res
          .status(403)
          .json({ message: "Your account is blocked. Contact support." });
      }
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    // Generate token with role
    const token = generateToken(user._id, role);

    // Send response with token and role
    res.status(200).json({ token, role, user });
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




module.exports = { login, updateProfile };
