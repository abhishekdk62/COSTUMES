import React, { useState } from "react";
import axios from "axios";
import { FaGoogle, FaTwitter, FaEye, FaEyeSlash } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../../slices/authSlice"; // Import the login action

const LoginForm = () => {
  // State for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); // For error messages
  const [loading, setLoading] = useState(false); // For loading state during API call
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Hook to dispatch Redux actions

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors
  
    // Prepare the data for the API request
    const userData = {
      email,
      name,
      phone: `+${phone}`, // Add the "+" prefix for the phone number
      password,
    };
  
    try {
      // Make a POST request to the backend
      const response = await axios.post(
        "http://localhost:5000/user/signup",
        userData
      );
      console.log("Signup successful:", response.data);
  
      // Assuming the backend returns `user`, `token`, and `role` in the response
      const { user, token, role } = response.data;
  
      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(user)); // Store user object as a string
      localStorage.setItem("token", token); // Store token
      localStorage.setItem("role", role); // Store role
  
      // Dispatch the login action to update Redux state
      dispatch(
        login({
          user, // Store user details
          token, // Save JWT token
          role, // Save role ('admin' or 'user')
        })
      );
  
      // Redirect to the home page or dashboard after successful signup
      navigate(role === "admin" ? "/admin/dashboard" : "/user/home");
    } catch (err) {
      // Handle errors
      console.error("Signup failed:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "An error occurred during signup."
      );
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg h-screen overflow-hidden">
      {/* Image Section */}
      <div className="h-[90vh] md:w-1/2 relative">
        <img
          src="https://storage.googleapis.com/a1aa/image/k_dyGhw9ews3CGPOuNvnM-5QivQD-9LPLXsWf7aKUko.jpg"
          alt="Three women wearing sunglasses and smiling"
          className="w-full h-full object-cover"
        />
        <div className="text-center absolute top-5 left-1/2 transform -translate-x-1/2 font-bold text-black bg-opacity-50 px-4 py-2 rounded-md">
          <p>Looks like you're new here!</p>
          <h1 className="text-3xl">Sign Up</h1>
        </div>
      </div>

      {/* Form Section */}
      <div className="md:w-1/2 p-8 flex flex-col justify-center overflow-y-auto">
        {/* Social Login Buttons */}
        <button className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-2 mb-4 hover:bg-gray-50 transition-colors">
          <FaGoogle className="text-red-500 mr-2" />
          <span className="text-purple-600">Continue With Google</span>
        </button>
        <button className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-2 mb-4 hover:bg-gray-50 transition-colors">
          <FaTwitter className="text-blue-500 mr-2" />
          <span className="text-purple-600">Continue With Twitter</span>
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-400">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Error Message */}
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Phone Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="phone">
              Phone
            </label>
            <PhoneInput
              country={"in"} // Default country India (+91)
              value={phone}
              onChange={(value) => setPhone(value)}
              inputProps={{
                id: "phone",
                className:
                  "w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600",
              }}
              containerClass="w-full"
              buttonStyle={{
                backgroundColor: "transparent",
                border: "none",
                padding: "0 8px",
              }}
              dropdownClass="bg-white shadow-lg rounded-lg"
              inputStyle={{
                width: "100%",
                height: "100%",
                paddingLeft: "48px", // Adjust padding to align text
              }}
            />
          </div>

          {/* Password Field */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-10 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white rounded-lg py-2 hover:bg-purple-700 transition-colors"
            disabled={loading} // Disable button during loading
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Sign In Link */}
        <p className="mt-6 text-center text-gray-500">
          Already have an account?{" "}
          <a
            onClick={() => navigate("/")}
            className="text-purple-600 hover:underline cursor-pointer"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;