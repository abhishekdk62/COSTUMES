import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../../slices/authSlice"; // Redux action for login

const LoginForm = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) {
      setError(decodeURIComponent(oauthError));
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url);
    }
  }, [searchParams]);

  // Step 1: Send OTP using Name & Email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    
    // Email validation using regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!email) {
      alert("Error: Email address is required");
      return;
    }
    
    if (!emailRegex.test(email)) {
      alert("Error: Please enter a valid email address");
      return;
    }
    
    setLoading(true);
    
    try {
      // Call backend endpoint to send OTP to the provided email
      const res = await axios.post("http://localhost:5000/user/signupotp", { email });
      console.log("OTP sent:", res.data);
      setStep(2);
      alert("OTP has been sent to your email address");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
      alert(`Error: ${err.response?.data?.message || "Failed to send OTP"}`);
    } finally {
      setLoading(false);
    }
  };







  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/user/verifysignupotp", { email, otp });
      console.log("OTP verified:", res.data);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
      console.log(err.response.data)
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Complete Signup with Phone & Password
  const handleCompleteSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Call final signup endpoint that creates the user account
      const res = await axios.post(
        "http://localhost:5000/user/signup",
        {
          email,
          name,
          phone: `+${phone}`,
          password,
        },
        { withCredentials: true } // Ensures cookies are handled correctly
      );
      const { userId, role } = res.data; // Expecting userId and role from backend
      dispatch(login({ userId, role }));
      navigate(role === "admin" ? "/admin/dashboard" : "/user/home");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:5000/auth/google/signup";
  };

  return (
    <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg h-screen overflow-hidden">
      <div className="h-[90vh] md:w-1/2 relative">
        <img
          src="https://hips.hearstapps.com/hmg-prod/images/hbz090122newsopener-collage-1664051983.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*"
          alt="Three women wearing sunglasses and smiling"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Form Section */}
      <div className="md:w-1/2 p-8 flex flex-col justify-center overflow-y-auto">
        <div className="mb-6 flex justify-center">
          <div className="text-center font-bold text-black px-4 mt-3 rounded-md">
            <p>Welcome to Costumes!</p>
            <h1 className="text-3xl">Create an account</h1>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-red-500 text-center bg-red-50 border border-red-200 p-3 rounded-md">
            {error}
          </div>
        )}

        <form>
          {step === 1 && (
            <>
              {/* Step 1: Name & Email */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <button
                type="submit"
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full bg-purple-600 text-white rounded-lg py-2 hover:bg-purple-700 transition-colors"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              {/* Step 2: Enter OTP */}
              <div className="mb-4">
                <label htmlFor="otp" className="block text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  placeholder="Enter the OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <button
                type="submit"
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full bg-purple-600 text-white rounded-lg py-2 hover:bg-purple-700 transition-colors"
              >
                {loading ? "Verifying OTP..." : "Verify OTP"}
              </button>
            </>
          )}

          {step === 3 && (
            <>
              {/* Step 3: Phone & Password */}
              <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-700 mb-2">
                  Phone
                </label>
                <PhoneInput
                  country={"in"}
                  value={phone}
                  onChange={(value) => setPhone(value)}
                  inputProps={{
                    id: "phone",
                    className:
                      "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600",
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
                    paddingLeft: "48px",
                  }}
                />
              </div>
              <div className="mb-4 relative">
                <label htmlFor="password" className="block text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <span
                  className="absolute right-3 top-10 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              <button
                type="submit"
                onClick={handleCompleteSignup}
                disabled={loading}
                className="w-full bg-purple-600 text-white rounded-lg py-2 hover:bg-purple-700 transition-colors"
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </>
          )}
        </form>

        <p className="mt-6 text-center text-gray-500">
          Already have an account?{" "}
          <a
            onClick={() => navigate("/")}
            className="text-purple-600 hover:underline cursor-pointer"
          >
            Sign in
          </a>
        </p>
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-400">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <div className="mb-6">
          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-2 mb-4 hover:bg-gray-50 transition-colors"
          >
            <FaGoogle className="text-red-500 mr-2" />
            <span className="text-purple-600">Continue With Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
