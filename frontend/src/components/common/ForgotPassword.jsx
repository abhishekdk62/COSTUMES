import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ForgotPassword = ({ setForgotPassword }) => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const handleSendOTP = async () => { 
    try {
      await axios.post("http://localhost:5000/user/send-otp", { email });
      setOtpSent(true);
      setMessage("OTP sent successfully. Check your email.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending OTP");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post("http://localhost:5000/user/verify-otp", { email, otp });
      if (response.data.success) {
        setOtpVerified(true);
        setMessage("OTP verified successfully.");
      } else {
        setMessage("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Error verifying OTP");
    }
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/user/update-password", {
        email,
        password,
      });
      setMessage(response.data.message);
      setTimeout(() => {
        setForgotPassword(false)
        
      }, 2000);

    } catch (error) {
      setMessage(error.response?.data?.message || "Error updating password");
    }
  };
  


  return (
    <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg">
      <div className="h-[90vh] md:w-1/2 relative">
        <img
          src="https://storage.googleapis.com/a1aa/image/k_dyGhw9ews3CGPOuNvnM-5QivQD-9LPLXsWf7aKUko.jpg"
          alt="Three women wearing sunglasses and smiling"
          className="w-full h-[90vh] object-cover"
        />
      </div>
      <div className="md:w-1/2 p-8">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
        {message && <p className="text-red-500 text-center mb-2">{message}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email Address</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button onClick={handleSendOTP} className="w-full bg-purple-600 text-white py-2 rounded-lg">Send OTP</button>
        {otpSent && (
          <>
            <div className="mt-4">
              <label className="block text-gray-700 mb-2">Enter OTP</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button onClick={handleVerifyOTP} className="w-full bg-blue-500 text-white py-2 rounded-lg mt-2">
              Verify OTP
            </button>
            {!otpVerified && <p className="text-gray-500 text-sm mt-2">Verify OTP to enable password reset</p>}
          </>
        )}
        {otpVerified && (
          <>
            <div className="mt-4 relative">
              <label className="block text-gray-700 mb-2">New Password</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-10 cursor-pointer">
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            <div className="mt-4 relative">
              <label className="block text-gray-700 mb-2">Confirm Password</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-10 cursor-pointer"
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            <button onClick={handleResetPassword} className="w-full bg-purple-600 text-white py-2 rounded-lg mt-4">
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
