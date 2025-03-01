import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaTwitter, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { login } from "../../../slices/authSlice"; // Ensure this is imported correctly

const LoginForm = ({setForgotPassword}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Use one instance only
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/user/login", {
        email,
        password,
      });

      const { token, role, user } = res.data;

      // Store token, role, and user in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(user));

      // Dispatch login action to update Redux state immediately
      dispatch(login({ token, role, user }));

      // Redirect based on role (only once)
      if (role === "admin") {
        navigate("/admin/users");
      } else {
        navigate("/user/home");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg">
      {/* Image Section */}
      <div className="h-[90vh] md:w-auto relative">
        <img
          src="https://storage.googleapis.com/a1aa/image/k_dyGhw9ews3CGPOuNvnM-5QivQD-9LPLXsWf7aKUko.jpg"
          alt="Three women wearing sunglasses and smiling"
          className="w-full h-full object-cover"
        />
        <div className="text-center absolute top-5 left-1/2 transform -translate-x-1/2 font-bold text-black bg-opacity-50 px-4 py-2 rounded-md">
          <p>Welcome back</p>
          <h2 className="text-3xl">Sign In</h2>
        </div>
      </div>

      {/* Form Section */}
      <div className="md:w-1/2 p-8">
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
        {error && (
          <div className="justify-center text-center">
            <p className="text-red-500 text-sm mb-4">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email address
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

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
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-500 cursor-pointer"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-between items-center mb-6">
            <a onClick={()=>setForgotPassword(true)} className="text-sm cursor-pointer text-gray-500 hover:text-purple-600">
              Forgot your password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white rounded-lg py-2 hover:bg-purple-700 transition-colors disabled:opacity-50"
            disabled={loading} // Disable button when loading
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-gray-500">
          Don't have an account?{" "}
          <a
            onClick={() => navigate("/signup")}
            className="text-purple-600 hover:underline"
            href="#"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
