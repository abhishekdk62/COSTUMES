import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaGoogle, FaTwitter, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../../slices/authSlice";

const LoginForm = ({ setForgotPassword }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const[isAuthtenticated,setIsAuthenticated]=useState()
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  // Check for OAuth error parameters on component mount
  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) {
      setError(decodeURIComponent(oauthError));
      
      // Optional: Remove the error from URL without page refresh
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url);
    }
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/user/login", {
        email,
        password,
      },
    {withCredentials:true});
    
  console.log(res.data);
  
      const { userId, role } = res.data; // Expecting backend to send userId and role
      dispatch(login({ userId, role })); // Dispatch to Redux, which sets isAuthenticated
      navigate(role === "admin" ? "/admin/users" : "/user/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google/login";
  };

  return (
    <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg h-screen overflow-hidden">
      {/* Image Section */}
      <div className="h-[90vh] md:w-1/2 relative">
        <img
          src="https://hips.hearstapps.com/hmg-prod/images/hbz090122newsopener-collage-1664051983.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*"
          alt="Three women wearing sunglasses and smiling"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Form Section with consistent spacing */}
      <div className="md:w-1/2 p-8 flex flex-col justify-center space-y-6">
        {/* Centered Welcome Text */}
        <div className="flex justify-center">
          <div className="text-center font-bold text-black px-6 py-4 rounded-md">
            <p className="text-lg">Welcome Back</p>
            <h1 className="text-3xl">Sign In</h1>
          </div>
        </div>

        {/* Error display - unified error handling */}
        {error && (
          <div className="text-center text-red-500 bg-red-50 border border-red-200 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div className="relative">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-10 text-gray-500 cursor-pointer"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span
              onClick={() => setForgotPassword(true)}
              className="text-sm cursor-pointer text-gray-500 hover:text-purple-600"
            >
              Forgot your password?
            </span>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white rounded-lg py-3 hover:bg-purple-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        {/* Sign Up Link */}
        <p className="mt-6 text-center text-gray-500">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-purple-600 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-400">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition-colors"
          >
            <FaGoogle className="text-red-500 mr-2 text-xl" />
            <span className="text-purple-600 font-medium">
              Continue With Google
            </span>
          </button>
          <button className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition-colors">
            <FaTwitter className="text-blue-500 mr-2 text-xl" />
            <span className="text-purple-600 font-medium">
              Continue With Twitter
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;