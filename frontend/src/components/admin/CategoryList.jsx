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

const CategoryList = ({ setShowAddCategory }) => {
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
      {/* Search Bar Section */}
      <div className="container mx-auto p-6">
        <div className="relative w-full flex items-center">
          {/* Search Input */}
          <div className="relative flex-grow">
            <input
              className="w-[90%] p-2 pr-10 border rounded-md"
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
            className="bg-blue-600 cursor-pointer text-white w-[140px] h-[40px] rounded-md flex justify-center items-center"
          >
            <Search size={18} className="mr-2" /> Search
          </button>
        </div>

        {/* Categories Section */}
        <div className="mt-6">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold mb-6">Categories</h1>
            <button
              onClick={() => setShowAddCategory(true)}
              className="bg-green-500 cursor-pointer text-white w-[140px] h-[40px] rounded-md"
            >
              Add Category
            </button>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading
              ? [...Array(8)].map((_, index) => (
                  <CategoryCardShimmer key={index} />
                ))
              : categorieList.map((category) => (
                  <CategoryCard
                    key={category._id}
                    name={category.name}
                    image={category.image}
                  />
                ))}
          </div>
        </div>
      </div>
    </>
  );
};
const AddCategory = ({ setShowAddCategory }) => {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [visibilityStatus, setVisibilityStatus] = useState("Active");
  const [discount, setDiscount] = useState("10");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/admin/addcategorys",
        {
          categoryName,
          description,
          discount,
        }
      );

      alert("Category added successfully!");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="w-full mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-6">Add new Category</h1>
       
      </div>
      <form onSubmit={handleSubmit}>
        {/* Category Name */}
        <div className="flex justify-around">
          <div>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="category-name"
              >
                Category Name
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                id="category-name"
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>

            {/* Include Products */}
            <div className="mb-4">
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="include-products"
              >
                Include products
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md flex flex-wrap gap-2">
                <span className="bg-gray-200 px-2 py-1 rounded-full">
                  Kids products <i className="fas fa-times ml-1"></i>
                </span>
                <span className="bg-gray-200 px-2 py-1 rounded-full">
                  Kids Style <i className="fas fa-times ml-1"></i>
                </span>
                <span className="bg-gray-200 px-2 py-1 rounded-full">
                  Styling <i className="fas fa-times ml-1"></i>
                </span>
              </div>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="thumbnail"
            >
              Thumbnail
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex items-center justify-center">
              <div className="text-center">
                <img
                  src="https://placehold.co/50x50"
                  alt="Placeholder image for thumbnail"
                  className="mx-auto mb-2"
                />
                <button className="bg-gray-200 px-4 py-2 rounded-md">
                  Add Image
                </button>
                <p className="text-gray-500 mt-2">
                  Drag and drop your image or add using the button
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Description */}
        <div className="flex justify-center mb-4">
          <div className="w-[90%]">
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="category-description"
            >
              Category Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              id="category-description"
              placeholder="Write your description here..."
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Visibility Status and Discounts/Offers */}
        <div className="flex justify-center mb-4">
          <div className="w-[90%] flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="visibility-status"
              >
                Visibility Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                id="visibility-status"
                value={visibilityStatus}
                onChange={(e) => setVisibilityStatus(e.target.value)}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="w-full md:w-1/2 px-2">
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="discounts-offers"
              >
                Discounts/Offers
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                id="discounts-offers"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              >
                <option>10</option>
                <option>20</option>
                <option>30</option>
              </select>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md text-gray-700"
            type="button"
          onClick={() => setShowAddCategory(false)}

          >
            Cancel
          </button>
          <button
            className="px-4 cursor-pointer py-2 bg-purple-600 text-white rounded-md"
            type="submit"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};
const Category = () => {
  const [showAddCategory, setShowAddCategory] = useState(false);

  return showAddCategory ? (
    <AddCategory setShowAddCategory={setShowAddCategory} />
  ) : (
    <CategoryList setShowAddCategory={setShowAddCategory} />
  );
};

export default Category;
