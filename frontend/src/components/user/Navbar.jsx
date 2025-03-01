import React, { useState } from "react";
import { Search } from "lucide-react";
import { FaHeart, FaUser, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../slices/authSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="bg-white shadow-md relative">
      {/* Header Section */}
      <nav className="flex items-center justify-between p-4 relative">
        {/* Left Section */}
        <div className="flex items-center">
          <div
            className="text-2xl font-serif cursor-pointer"
            onClick={() => navigate("/")}
          >
            COSTUMES
          </div>
        </div>

        {/* Search Bar - Centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-[320px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search costumes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
            />
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <select className="bg-white text-black border-none focus:outline-none">
            <option>English (United States)</option>
          </select>

          {/* Icons */}
          <a
            href="#"
            className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition"
          >
            <FaHeart />
          </a>

          {/* User Dropdown */}
          <div className="relative">
            <button
              className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition"
              onClick={() => setOpen(!open)}
            >
              <FaUser />
            </button>

            {open &&
              (token ? (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg">
                  <a
                    href="/"
                    className="block px-4 py-2 text-black hover:bg-gray-100"
                  >
                    Log In
                  </a>
                  <a
                    href="/signup"
                    className="block px-4 py-2 text-black hover:bg-gray-100"
                  >
                    Sign Up
                  </a>
                </div>
              ))}
          </div>

          <a
            href="#"
            className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition"
          >
            <FaShoppingCart />
          </a>
        </div>
      </nav>

      {/* Navbar Section */}
      <nav className="flex items-center justify-center p-4 bg-white text-black">
        <div className="flex items-center space-x-6">
          <a href="#" className="text-gray-600 hover:text-black transition">
            Shop
          </a>
          <a href="#" className="text-gray-600 hover:text-black transition">
            Men
          </a>
          <a href="#" className="text-gray-600 hover:text-black transition">
            Women
          </a>
          <a href="#" className="text-gray-600 hover:text-black transition">
            Combos
          </a>
          <a href="#" className="text-gray-600 hover:text-black transition">
            Joggers
          </a>
        </div>
      </nav>

      {/* Horizontal Line */}
      <hr className="border-gray-300" />
    </div>
  );
};

export default Header;
