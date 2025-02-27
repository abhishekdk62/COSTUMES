import React from "react";
import {
  FaTachometerAlt,
  FaLock,
  FaBoxOpen,
  FaChartLine,
  FaUsers,
  FaTags,
  FaThLarge,
  FaUndo,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = ({activeTab, setActiveTab }) => {
  return (
    <div className="w-64 bg-white h-screen shadow-md">
      <nav className="mt-10">
        <a
          onClick={() => setActiveTab("dashboard")}
          className={`cursor-pointer flex items-center p-2 ${activeTab=="dashboard"? "text-white bg-purple-600 rounded-md"  :"text-gray-700 hover:bg-gray-200"}`} 
         
        >
          <FaTachometerAlt className="w-6" />
          <span className="ml-3">Dashboard</span>
        </a>
        <a
          onClick={() => setActiveTab("order")}
          className={`cursor-pointer flex items-center p-2 ${activeTab=="order"? "text-white bg-purple-600 rounded-md"  :"text-gray-700 hover:bg-gray-200"}`} 
          
        >
          <FaLock className="w-6" />
          <span className="ml-3">Order</span>
        </a>
        <a
          onClick={() => setActiveTab("products")}
          className={`cursor-pointer flex items-center p-2 ${activeTab=="products"? "text-white bg-purple-600 rounded-md"  :"text-gray-700 hover:bg-gray-200"}`} 
       
        >
          <FaBoxOpen className="w-6" />
          <span className="ml-3">Products</span>
        </a>
        <a
          onClick={() => setActiveTab("sales")}
          className={`cursor-pointer flex items-center p-2 ${activeTab=="sales"? "text-white bg-purple-600 rounded-md"  :"text-gray-700 hover:bg-gray-200"}`} 
       
        >
          <FaChartLine className="w-6" />
          <span className="ml-3">Sales report</span>
        </a>
        <a
          onClick={() => setActiveTab("customer")}
          className={`cursor-pointer flex items-center p-2 ${activeTab=="customer"? "text-white bg-purple-600 rounded-md"  :"text-gray-700 hover:bg-gray-200"}`} 
        >
          {/*  */}
          <FaUsers className="w-6" />
          <span className="ml-3">Customer</span>
        </a>
        <a
          onClick={() => setActiveTab("coupon")}
          className={`cursor-pointer flex items-center p-2 ${activeTab=="coupon"? "text-white bg-purple-600 rounded-md"  :"text-gray-700 hover:bg-gray-200"}`} 
          
        >
          <FaTags className="w-6" />
          <span className="ml-3">Coupon</span>
        </a>
        <a
          onClick={() => setActiveTab("category")}
          className={`cursor-pointer flex items-center p-2 ${activeTab=="category"? "text-white bg-purple-600 rounded-md"  :"text-gray-700 hover:bg-gray-200"}`} 
        >
          <FaThLarge className="w-6" />
          <span className="ml-3">Category</span>
        </a>
        <a
          onClick={() => setActiveTab("refund")}
          className={`cursor-pointer flex items-center p-2 ${activeTab=="refund"? "text-white bg-purple-600 rounded-md"  :"text-gray-700 hover:bg-gray-200"}`} 
        >
          <FaUndo className="w-6" />
          <span className="ml-3">Refund</span>
        </a>
        
      </nav>
    </div>
  );
};

export default Sidebar;
