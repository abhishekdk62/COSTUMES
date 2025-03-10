import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../../../slices/authSlice"; // Import the logout action
import axios from 'axios'
const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/user/logout", {}, { withCredentials: true });
      dispatch(logout()); 
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <div>
      <nav className="flex items-center justify-between p-4 bg-white text-black">
        {/* Logo */}
        <div className="text-2xl font-serif cursor-pointer" onClick={() => navigate("/")}>
          COSTUMES
        </div>

        {/* Search Bar and Buttons */}
        <div className="flex items-center space-x-4">
        

          {/* Language Selector */}
          <div className="relative">
            <select className="bg-white text-black border-none focus:outline-none">
              <option>English (United States)</option>
              {/* Add other languages as needed */}
            </select>
          </div>

          {/* Conditional Rendering */}
          {isAuthenticated ? (
            // If the user is logged in, show the Logout button
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-black rounded-full hover:bg-gray-100 transition-colors"
            >
              Logout
            </button>
          ) : (
            // If the user is not logged in, show the Log In and Sign Up buttons
            <>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 border border-black rounded-full hover:bg-gray-100 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate("/user/home")}
                className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              >
                Guest
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Horizontal Rule */}
      <hr className="border-gray-300" />
    </div>
  );
};

export default Header;