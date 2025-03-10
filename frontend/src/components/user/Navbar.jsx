import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react"; 
import { FaHeart, FaUser, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../../../slices/authSlice";
import { setSearchTerm } from "../../../slices/searchSlice";
const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
  };
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user/check", {
          withCredentials: true, // Ensure cookies are sent
        });
        console.log(res);
        

        const { userId, role } = res.data;
        dispatch(login({ userId, role }));
      } catch (err) {
        console.log("Authentication failed", err);
      }
    };

    verifyUser();
  }, [dispatch]);
  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white  relative">
      {/* Header Section */}
      <nav className="flex items-center justify-between p-4 relative">
        {/* Left Section */}
        <div className="flex items-center">
          <div
            className="text-2xl font-serif cursor-pointer"
            onClick={() => navigate("/user/home")}
          >
            COSTUMES
          </div>
        </div>

        {/* Search Bar - Centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-[320px]">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                dispatch(setSearchTerm(e.target.value));
                navigate("/products");
              }}
              placeholder="Search costumes..."
              // Increase right padding so the clear button doesn't overlap
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
            />
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {/* Clear Button */}
            <button
              type="button"
              onClick={() => dispatch(setSearchTerm(""))}
              className="absolute right-3 top-1/2 transform cursor-pointer -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              &#x2715;
            </button>
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
          <div className="relative" ref={dropdownRef}>
            <button
              className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition"
              onClick={() => setOpen(!open)}
            >
              <FaUser />
            </button>

            {open &&
              (isAuthenticated ? (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
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
          <button
            onClick={() => navigate("/products")}
            className="text-gray-600 cursor-pointer hover:text-black transition"
          >
            Shop
          </button>
          <button className="text-gray-600 cursor-pointer hover:text-black transition">
            Men
          </button>
          <button className="text-gray-600 hover:text-black cursor-pointer transition">
            Women
          </button>
          <button className="text-gray-600 hover:text-black cursor-pointer transition">
            Combos
          </button>
          <button className="text-gray-600 hover:text-black cursor-pointer transition">
            Kids
          </button>
        </div>
      </nav>

      {/* Horizontal Line */}
      <hr className="border-gray-300" />
    </div>
  );
};

export default Header;
