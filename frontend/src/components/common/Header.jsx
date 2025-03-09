import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../slices/authSlice"; // Import the logout action

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get the token from the Redux store
  const token = useSelector((state) => state.auth.token);

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/admin/logout", {}, { withCredentials: true });
      dispatch(logout()); // Dispatch the logout action
      navigate("/"); // Redirect to the home page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  



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
          {token ? (
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