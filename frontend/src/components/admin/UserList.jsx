import axios from "axios";
import React, { useEffect, useState } from "react";
import { X, Search } from "lucide-react";

const Customer = () => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers("", 1);
  }, []);

  const fetchUsers = async (searchQuery = "", page = 1) => {
    setLoading(true);
    try {
      const queryString = searchQuery
        ? `?q=${searchQuery}&page=${page}&limit=10`
        : `?page=${page}&limit=6`;
      const { data } = await axios.get(
        `http://localhost:5000/admin/searchusers${queryString}`,
        { withCredentials: true }
      );
      // Expecting backend to return { users, page, totalPages, ... }
      setUserList(data.users);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
      setError("");
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          setError("No users found");
          setUserList([]);
        } else {
          setError(err.response.data.message || "Server error");
        }
      } else if (err.request) {
        setError("No response from server");
      } else {
        setError("Error fetching users");
      }
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchUsers(searchInput.trim(), 1);
  };

  const updateStatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/user/update",
        {
          _id: id,
          status,
        },
        { withCredentials: true }
      );
      setUserList((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, status: data.updatedUser.status } : user
        )
      );
    } catch (err) {
      console.error(
        "Error updating status:",
        err.response?.data?.message || err.message
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
    <div className="max-w-7xl mx-auto p-6 pb-20">
      {/* Header with Title and Search Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users"
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput("");
                  fetchUsers("", 1);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <X size={25} />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
          >
            <Search size={18} className="mr-2" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="mb-4 text-center text-red-500">{error}</div>}

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
                  key={customer._id}
                  className={`border-b ${index % 2 === 0 ? "bg-gray-50" : ""}`}
                >
                  <td className="p-3 flex items-center">
                    <img
                      alt="Customer avatar"
                      src="https://placehold.co/40x40"
                      className="w-10 h-10 rounded-full mr-3"
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
                  <td className="p-3">
                    <button
                      onClick={() => {
                        const confirmChange = window.confirm(
                          `Are you sure you want to ${
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
                      className={`px-5 py-1 min-w-[100px] rounded-md cursor-pointer text-white text-sm font-medium transition ${
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

      {/* Fixed Pagination UI at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-2 bg-background bg-gray-100 shadow-sm border-t border-border">
        <div className="flex justify-center items-center space-x-1 max-w-xs mx-auto">
          <button
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
              }
            }}
            disabled={currentPage <= 1}
            className="h-8 w-8 flex items-center justify-center rounded-md bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 transition-colors"
            aria-label="Previous page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
              }
            }}
            disabled={currentPage >= totalPages}
            className="h-8 w-8 flex items-center justify-center rounded-md bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 transition-colors"
            aria-label="Next page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Customer;
