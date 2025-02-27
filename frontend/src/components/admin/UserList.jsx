import axios from "axios";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react"; // Import 
import { Search } from "lucide-react";

const Customer = () => {
  const [userList, setUserList] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(false); // For loading state during API call
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers("");
  }, []);

  const fetchUsers = async (searchQuery = "") => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/admin/searchusers${searchQuery ? `?q=${searchQuery}` : ""}`
      );
      setUserList(data);
      setError(""); // Reset error on success
    } catch (error) {
      if (error.response) {
        // Server responded with an error status
        if (error.response.status === 404) {
          setError("No users found");
          setUserList(data)
        } else {
          setError(error.response.data.message || "Server error");
        }
      } else if (error.request) {
        // Request was made but no response received
        setError("No response from server");
      } else {
        // Something else happened
        setError("Error fetching users");
      }
      console.log("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleSearch = () => {
    fetchUsers(searchInput.trim()); // Call the same API with a search term
  };

  const updateStatus = async (id, status) => {
    try {
      const { data } = await axios.post("http://localhost:5000/user/update", {
        _id: id,
        status,
      });

      setUserList((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, status: data.updatedUser.status } : user
        )
      );
    } catch (error) {
      console.error(
        "Error updating status:",
        error.response?.data?.message || error.message
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "green";
      case "Blocked":
        return "red";
      case "Inactive":
        return "yellow";
      default:
        return "gray";
    }
  };

  return (
    <div className="container mx-auto p-6">
    <div className="relative w-full flex items-center">
      {/* Search Input */}
      <div className="relative flex-grow">
        <input
          className="w-full p-2 pr-10 border rounded-md"
          placeholder="Search users"
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        {searchInput && (
          <button 
            className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => {
              fetchUsers("");
              setSearchInput("");
            }}
          >
            <X size={25} />
          </button>
        )}
      </div>
  
      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="bg-blue-600 cursor-pointer text-white ml-4 px-4 py-2 rounded-md flex items-center"
      >
        <Search size={18} className="mr-2" /> Search
      </button>
    </div>
  
      <div className="flex justify-center">{error && <p className="text-red-500">{error}</p>}</div>
      <h2 className="text-2xl font-bold mb-4">Customer</h2>

      {/* Table Section */}
      {loading ? (
        // Shimmer UI while loading
        <table className="w-full bg-white shadow-md rounded-md">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Customer ID</th>
              <th className="p-3 text-left">Orders</th>
              <th className="p-3 text-left">Balance</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 3 }).map((_, index) => (
              <tr
                key={index}
                className={`border-b ${index % 2 === 0 ? "bg-gray-50" : ""}`}
              >
                <td className="p-3 flex items-center">
                  <div className="w-10 h-10 rounded-full mr-3 bg-gray-200 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </td>
                <td className="p-3">
                  <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                </td>
                <td className="p-3 flex space-x-2">
                  <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        // Actual Table when data is loaded
        <table className="w-full bg-white shadow-md rounded-md">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Customer ID</th>
              <th className="p-3 text-left">Orders</th>
              <th className="p-3 text-left">Balance</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userList.length > 0 ? (
              userList.map((customer, index) => (
                <tr
                  className={`border-b ${index % 2 === 0 ? "bg-gray-50" : ""}`}
                  key={customer._id}
                >
                  <td className="p-3 flex items-center">
                    <img
                      alt="Customer avatar"
                      className="w-10 h-10 rounded-full mr-3"
                      src="https://placehold.co/40x40"
                    />
                    {customer.firstname}
                  </td>
                  <td className="p-3">{customer._id}</td>
                  <td className="p-3">{customer.orders || 0}</td>
                  <td className="p-3">{customer.balance || 0}</td>
                  <td className="p-3">
                    <span
                      className={`bg-${getStatusColor(
                        customer.status
                      )}-100 text-${getStatusColor(
                        customer.status
                      )}-600 px-2 py-1 rounded-full`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        const confirmChange = window.confirm(
                          `Are you sure want to ${
                            customer.status === "Active" ? "Block" : "Unblock"
                          } ${customer.firstname}?`
                        );
                        if (confirmChange) {
                          updateStatus(
                            customer._id,
                            customer.status === "Active" ? "Blocked" : "Active"
                          );
                        }
                      }}
                      className={`px-5 py-1 min-w-[100px]  rounded-md cursor-pointer text-white text-sm font-medium transition ${
                        customer.status === "Active"
                          ? "bg-red-400 hover:bg-red-500"
                          : "bg-green-400 hover:bg-green-500"
                      }`}
                    >
                      {customer.status === "Active" ? "Block" : "Unblock"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 text-center" colSpan="6">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Customer;
