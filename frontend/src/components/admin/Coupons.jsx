import axios from "axios";
import React, { useEffect, useState } from "react";

const Coupons = ({ selectedTab, setSelectedTab }) => {
  return (
    <div>
      {selectedTab === "add" ? (
        <AddCoupon setSelectedTab={setSelectedTab} />
      ) : selectedTab === "edit" ? (
        <EditCoupon setSelectedTab={setSelectedTab} />
      ) :selectedTab === "removed"?(<RemovedCoupons setSelectedTab={setSelectedTab} />):selectedTab === "view"? (
        <Coupon setSelectedTab={setSelectedTab} />):(null)
      }
    </div>
  );
};

export default Coupons;


const Coupon = ({ setSelectedTab }) => {
  const [coupons, setCoupons] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCoupon = async (searchquery, page = 1) => {
    try {
      const limit = 10;
      const response = await axios.get(
        `http://localhost:5000/admin/searchcoupons/?q=${searchquery}&page=${page}&limit=${limit}`,{withCredentials:true}
      );
      setCoupons(response.data.coupon); 
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCoupon("");
  }, []);

  const handleDelete=async(id)=>{
    const del=window.confirm("Do you want to delete this coupon?")
if(del)
{


  try {
    const response=await axios.put(`http://localhost:5000/admin/softdeletecoupon/${id}`)
    console.log(response.data);
    fetchCoupon("")
    
  } catch (error) {
    console.log(error.response.data);   
  }
}  }


  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Coupon Management</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search here"
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          <button
            onClick={() => {
              setCurrentPage(1);
              fetchCoupon(search.trim(), 1);
            }}
            className="border px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <i className="fas fa-search"></i>
            <span>Search</span>
          </button>
          <button
            onClick={() => setSelectedTab("add")}
            className="bg-purple-600 text-white px-4 cursor-pointer py-2 rounded-lg flex items-center space-x-2"
          >
            <i className="fas fa-plus"></i>
            <span>New</span>
          </button>
          <button className="border px-4 py-2 rounded-lg flex items-center space-x-2">
            <i className="fas fa-sliders-h"></i>
            <span>Filters</span>
          </button>
         
          <button
            onClick={()=>setSelectedTab("removed")}
            className="border bg-red-500 px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <i className="fas fa-search"></i>
            <span>Removed</span>
          </button>
        </div>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-purple-600 text-white">
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Coupon Code</th>
            <th className="py-3 px-4"> Type</th>
            <th className="py-3 px-4">Value</th>
            <th className="py-3 px-4">Active to</th>
            <th className="py-3 px-4">Limit</th>
            <th className="py-3 px-4">Used</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {coupons?.map((coupon, index) => (
            <tr key={index} className="border-b">
              <td className="py-3 px-4">{coupon.couponName}</td>
              <td className="py-3 px-4">
                <span className="bg-green-200 text-green-800 px-2 py-1 rounded-lg">
                  {coupon.code}
                </span>
              </td>
              <td className="py-3 px-4">{coupon.discountType}</td>
              <td className="py-3 px-4">{coupon.discountValue}</td>
              <td className="py-3 px-4">{coupon.expiryDate}</td>
              <td className="py-3 px-4">{coupon.usageLimit}</td>
              <td className="py-3 px-4">{coupon.usedCount}</td>
              <td className="py-3 px-4 flex space-x-2">
                <i
                  onClick={() => {
                    localStorage.setItem("coupon",JSON.stringify(coupon))
                    setSelectedTab("edit")}}
                  className="fas fa-pen text-gray-600 cursor-pointer hover:text-blue-600"
                ></i>
                <i onClick={()=>handleDelete(coupon._id)} className="fas fa-trash text-gray-600 cursor-pointer hover:text-red-600"></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="fixed bottom-0 left-0 right-0 p-2 bg-background bg-gray-100 shadow-sm border-t border-border">
        <div className="flex justify-center items-center space-x-1 max-w-xs mx-auto">
          <button
            onClick={() => {
              if (currentPage > 1) {
                const newPage = currentPage - 1;
                setCurrentPage(newPage);
                fetchCoupon(search.trim(), newPage);
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
                const newPage = currentPage + 1;
                setCurrentPage(newPage);
                fetchCoupon(search.trim(), newPage);
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



const AddCoupon = ({ setSelectedTab }) => {
  // State for coupon fields
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [name,setName]=useState()
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!code || !discountValue || !expiryDate || !usageLimit) {
        setError("Please fill in all fields.");
        return;
      }
      const couponData = {
        code,
        name,
        discountType,
        discountValue: Number(discountValue),
        expiryDate,
        usageLimit: Number(usageLimit),
      };
      
      const response = await axios.post(
        "http://localhost:5000/admin/addcoupon",
        
          couponData,
        
        { withCredentials: true }
      );
      alert("coupon added")
      setCode("")
      setDiscountType("")
      setDiscountValue("")
      setError("")
      setExpiryDate("")
      setUsageLimit("")
      setName("")
      
    } catch (error) {
      setError(error.response.data)
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Add Coupon</h1>
      {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Coupon Code */}
        <div>
          <label className="block text-gray-700 mb-1" htmlFor="code">
            Coupon Code
          </label>
          <input
            id="code"
            type="text"
            placeholder="Enter coupon code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1" htmlFor="name">
            Coupon Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        {/* Discount Type */}
        <div>
          <label className="block text-gray-700 mb-1" htmlFor="discountType">
            Discount Type
          </label>
          <select
            id="discountType"
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>
        </div>
        {/* Discount Value */}
        <div>
          <label className="block text-gray-700 mb-1" htmlFor="discountValue">
            Discount Value {discountType === "percentage" ? "(%)" : "(₹)"}
          </label>
          <input
            id="discountValue"
            type="number"
            placeholder="Enter discount value"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        {/* Expiry Date */}
        <div>
          <label className="block text-gray-700 mb-1" htmlFor="expiryDate">
            Expiry Date
          </label>
          <input
            id="expiryDate"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        {/* Usage Limit */}
        <div>
          <label className="block text-gray-700 mb-1" htmlFor="usageLimit">
            Usage Limit
          </label>
          <input
            id="usageLimit"
            type="number"
            placeholder="Enter usage limit"
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={() => setSelectedTab("view")}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Save Coupon
          </button>
        </div>
      </form>
    </div>
  );
};



const EditCoupon = ({ setSelectedTab }) => {
  // Initialize form state with the coupon data passed as props
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [error, setError] = useState("");
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    const val = localStorage.getItem("coupon");
    const parsedVal = JSON.parse(val);
    if (parsedVal) {
      setCoupon(parsedVal);
      setCode(parsedVal.code || "");
      setName(parsedVal.couponName || "");
      setDiscountType(parsedVal.discountType || "percentage");
      setDiscountValue(parsedVal.discountValue || "");
      setUsageLimit(parsedVal.usageLimit || "");
      setExpiryDate(new Date(parsedVal.expiryDate).toISOString().split("T")[0]);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (!code || !discountValue || !expiryDate || !usageLimit) {
        setError("Please fill in all fields.");
        return;
      }

      const updateData = {
        code,
        couponName:name,
        discountType,
        discountValue: Number(discountValue),
        expiryDate,
        usageLimit: Number(usageLimit),
      };

      const response = await axios.post(
        `http://localhost:5000/admin/editcoupon/${coupon._id}`,
        updateData
      );
      console.log(response.data);
      alert("Coupon updated Succesfully")
      setSelectedTab("view")
    } catch (error) {
      console.log(error.response?.data);
      setError("An error occurred while updating the coupon.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Edit Coupon</h1>
      {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Coupon Code */}
        <div>
          <label className="block text-gray-700 mb-1" htmlFor="code">
            Coupon Code
          </label>
          <input
            id="code"
            type="text"
            placeholder="Enter coupon code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        {/* Coupon Name */}
        <div>
          <label className="block text-gray-700 mb-1" htmlFor="name">
            Coupon Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter coupon name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        {/* Discount Type */}
        <div>
          <label className="block text-gray-700 mb-1" htmlFor="discountType">
            Discount Type
          </label>
          <select
            id="discountType"
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>
        </div>
        {/* Discount Value */}
        <div>
          <label className="block text-gray-700 mb-1" htmlFor="discountValue">
            Discount Value {discountType === "percentage" ? "(%)" : "(₹)"}
          </label>
          <input
            id="discountValue"
            type="number"
            placeholder="Enter discount value"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        {/* Expiry Date */}
        <div>
          <label className="block text-gray-700 mb-1" htmlFor="expiryDate">
            Expiry Date
          </label>
          <input
            id="expiryDate"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        {/* Usage Limit */}
        <div>
          <label className="block text-gray-700 mb-1" htmlFor="usageLimit">
            Usage Limit
          </label>
          <input
            id="usageLimit"
            type="number"
            placeholder="Enter usage limit"
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={() => setSelectedTab("view")}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};



const RemovedCoupons = ({ setSelectedTab }) => {
  const [coupons, setCoupons] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCoupon = async (searchquery, page = 1) => {
    try {
      const limit = 10;
      const response = await axios.get(
        
        `http://localhost:5000/admin/searchdeletedcoupons/?q=${searchquery}&page=${page}&limit=${limit}`,{withCredentials:true}
        
      );
      
      setCoupons(response.data); 
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCoupon("");
  }, []);

  const handleRestore=async(id)=>{
    const res=window.confirm("Do you want to Restore this coupon?")
if(res)
{
  try {
    const response=await axios.put(`http://localhost:5000/admin/restorecoupon/${id}`)
    console.log(response.data);
    fetchCoupon("")
    
  } catch (error) {
    console.log(error.response.data);   
  }
}  }





  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Coupon Management</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search here"
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          <button
            onClick={() => {
              setCurrentPage(1);
              fetchCoupon(search.trim(), 1);
            }}
            className="border px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <i className="fas fa-search"></i>
            <span>Search</span>
          </button>
          <button
            onClick={() => setSelectedTab("add")}
            className="bg-purple-600 text-white px-4 cursor-pointer py-2 rounded-lg flex items-center space-x-2"
          >
            <i className="fas fa-plus"></i>
            <span>New</span>
          </button>
          <button className="border px-4 py-2 rounded-lg flex items-center space-x-2">
            <i className="fas fa-sliders-h"></i>
            <span>Filters</span>
          </button>
         
          <button
            onClick={()=>setSelectedTab("view")}
            className="border bg-green-500 px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <i className="fas fa-search"></i>
            <span>Active</span>
          </button>
        </div>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-purple-600 text-white">
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Coupon Code</th>
            <th className="py-3 px-4"> Type</th>
            <th className="py-3 px-4">Value</th>
            <th className="py-3 px-4">Active to</th>
            <th className="py-3 px-4">Limit</th>
            <th className="py-3 px-4">Used</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {coupons?.map((coupon, index) => (
            <tr key={index} className="border-b">
              <td className="py-3 px-4">{coupon.couponName}</td>
              <td className="py-3 px-4">
                <span className="bg-green-200 text-green-800 px-2 py-1 rounded-lg">
                  {coupon.code}
                </span>
              </td>
              <td className="py-3 px-4">{coupon.discountType}</td>
              <td className="py-3 px-4">{coupon.discountValue}</td>
              <td className="py-3 px-4">{coupon.expiryDate}</td>
              <td className="py-3 px-4">{coupon.usageLimit}</td>
              <td className="py-3 px-4">{coupon.usedCount}</td>
              <td className="py-3 px-4 flex space-x-2">
                <i
                  onClick={() => setSelectedTab("edit")}
                  className="fas fa-pen text-gray-600 cursor-pointer hover:text-blue-600"
                ></i>
                <i onClick={()=>handleRestore(coupon._id)} className="fas fa-trash text-gray-600 cursor-pointer hover:text-green-600"></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="fixed bottom-0 left-0 right-0 p-2 bg-background bg-gray-100 shadow-sm border-t border-border">
        <div className="flex justify-center items-center space-x-1 max-w-xs mx-auto">
          <button
            onClick={() => {
              if (currentPage > 1) {
                const newPage = currentPage - 1;
                setCurrentPage(newPage);
                fetchCoupon(search.trim(), newPage);
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
                const newPage = currentPage + 1;
                setCurrentPage(newPage);
                fetchCoupon(search.trim(), newPage);
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
