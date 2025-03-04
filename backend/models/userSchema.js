const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { 
      type: String, 
      required: function () {
        return !this.googleId; // Password is required only if googleId is not set
      } 
    },
    phone: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    status: { type: String, default: "Active" },
    balance: { type: Number, default: 0 },
    profileImage: { type: String, default: "" },
    dateOfBirth: { type: Date },
    googleId: { type: String, unique: true }, // Google ID to track users

    otp: { type: String },  // Field for storing OTP
    otpExpiry: { type: Number }, // Field for OTP expiry time
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
