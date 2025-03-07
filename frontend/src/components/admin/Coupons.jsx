import React, { useState } from "react";
import Header from "../common/Header";

const Coupons = () => {

  // Toggle the view to show the AddCoupon component


  return (
    <div>
     <Coupon />
    </div>
  );
};

export default Coupons;

const Coupon = ({ onNewCoupon }) => {
  const coupons = [
    {
      name: "Free Delivery",
      code: "BS6FXB5E",
      discount: "₹ 299",
      activeFrom: "01-02-2025",
      activeTo: "01-04-2025",
      limit: 40,
      used: 12,
    },
    {
      name: "Upto 50% off on all",
      code: "BS6FXB5E",
      discount: "₹ 199",
      activeFrom: "10-02-2025",
      activeTo: "01-04-2025",
      limit: 40,
      used: 14,
    },
    {
      name: "No platform fee",
      code: "BS6FXB5E",
      discount: "₹ 499",
      activeFrom: "01-02-2025",
      activeTo: "01-04-2025",
      limit: 40,
      used: 15,
    },
    {
      name: "Discount price",
      code: "BS6FXB5E",
      discount: "₹ 99",
      activeFrom: "01-02-2025",
      activeTo: "01-04-2025",
      limit: 40,
      used: 0,
    },
    {
      name: "Total Discount",
      code: "BS6FXB5E",
      discount: "₹ 49",
      activeFrom: "01-02-2025",
      activeTo: "01-04-2025",
      limit: 40,
      used: 36,
    },
    {
      name: "Free Delivery",
      code: "BS6FXB5E",
      discount: "₹ 49",
      activeFrom: "01-02-2035",
      activeTo: "01-04-2035",
      limit: 40,
      used: 33,
    },
    {
      name: "Offer on jersey",
      code: "BS6FXB5E",
      discount: "₹ 399",
      activeFrom: "01-02-2035",
      activeTo: "01-04-2035",
      limit: 40,
      used: 22,
    },
    {
      name: "Offer on dumbbell",
      code: "BS6FXB5E",
      discount: "₹ 29",
      activeFrom: "01-03-2025",
      activeTo: "01-05-2025",
      limit: 40,
      used: 27,
    },
    {
      name: "Free Delivery",
      code: "BS6FXB5E",
      discount: "₹ 69",
      activeFrom: "01-02-2025",
      activeTo: "01-04-2025",
      limit: 40,
      used: 11,
    },
  ];
  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Coupon management</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search here"
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          <button
            onClick={onNewCoupon}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <i className="fas fa-plus"></i>
            <span>New</span>
          </button>
          <button className="border px-4 py-2 rounded-lg flex items-center space-x-2">
            <i className="fas fa-sliders-h"></i>
            <span>Filters</span>
          </button>
        </div>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-purple-600 text-white">
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Coupon Code</th>
            <th className="py-3 px-4">Discount</th>
            <th className="py-3 px-4">Active from</th>
            <th className="py-3 px-4">Active to</th>
            <th className="py-3 px-4">Limit</th>
            <th className="py-3 px-4">Used</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {coupons.map((coupon, index) => (
            <tr key={index} className="border-b">
              <td className="py-3 px-4">{coupon.name}</td>
              <td className="py-3 px-4">
                <span className="bg-green-200 text-green-800 px-2 py-1 rounded-lg">
                  {coupon.code}
                </span>
              </td>
              <td className="py-3 px-4">{coupon.discount}</td>
              <td className="py-3 px-4">{coupon.activeFrom}</td>
              <td className="py-3 px-4">{coupon.activeTo}</td>
              <td className="py-3 px-4">{coupon.limit}</td>
              <td className="py-3 px-4">{coupon.used}</td>
              <td className="py-3 px-4 flex space-x-2">
                <i className="fas fa-pen text-gray-600 cursor-pointer"></i>
                <i className="fas fa-trash text-gray-600 cursor-pointer"></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AddCoupon = () => {
  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Add Coupon</h1>
      {/* Form elements go here */}
      <p>This is the add coupon form.</p>
    </div>
  );
};
