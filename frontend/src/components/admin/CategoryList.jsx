import axios from "axios";
import React, { useEffect, useState } from "react";
import { X, Search } from "lucide-react";

const CategoryCard = ({ name, image }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
      <img
        src={image}
        alt={`${name} category`}
        className="w-24 h-24 mb-4 rounded-full"
      />
      <h3 className="text-lg font-bold">{name}</h3>
    </div>
  );
};

const CategoryCardShimmer = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center animate-pulse">
      <div className="w-24 h-24 mb-4 rounded-full bg-gray-300"></div>
      <div className="w-32 h-6 bg-gray-300 rounded"></div>
    </div>
  );
};

function CategoryList() {
  const [searchInput, setSearchInput] = useState("");
  const [categorieList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories("");
  }, []);

  const fetchCategories = async (query) => {
    if (!query.trim() && categorieList.length > 0) return; // Avoid redundant calls
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:5000/admin/searchcategories?q=${query}`
      );
      setCategoryList(response.data);
    } catch (err) {
      setError("Failed to fetch categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchInput.trim() !== "") fetchCategories(searchInput);
  };

  return (
    <>
      {/* Search Input */}
      <div className="relative w-full">
        <input
          className="w-full ml-4 p-2 pr-10 border rounded-md"
          placeholder="Search categories"
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        {searchInput && (
          <button
            className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => {
              fetchCategories("");
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
        className="bg-blue-600 cursor-pointer text-white mx-4 px-4 py-2 rounded-md flex items-center"
      >
        <Search size={18} className="mr-2" /> Search
      </button>

      {/* Categories Section */}
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Categories</h1>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading
            ? [...Array(8)].map((_, index) => <CategoryCardShimmer key={index} />)
            : categorieList.map((category) => (
                <CategoryCard key={category._id} name={category.name} />
              ))}
        </div>
      </div>
    </>
  );
}

export default CategoryList;
