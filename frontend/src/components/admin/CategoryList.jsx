import axios from "axios";
import React, { useEffect, useState } from "react";
import { X, Search } from "lucide-react";
import { Trash2, Edit, CheckCircle } from "lucide-react";

//!  Category card
const CategoryCard = ({
  id,
  name,
  thumbnail,
  fetchCategories,
  setEditCategory,
  showRemovedCategory,
}) => {
  const restoreCategory = async () => {
    try {
      const response = await axios.put(
        "http://localhost:5000/admin/restorecat",
        {
          id: id,
        },  { withCredentials: true }

      );
      if (response.status == 200) {
        alert("Category restored");
      }
      fetchCategories();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCategory = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (confirmDelete) {
      try {
        const response = await axios.put(
          `http://localhost:5000/admin/softdelete/${id}`,
          { isDeleted: true },  { withCredentials: true }

        );
        fetchCategories(""); // Ensure correct fetching
        alert(response.data.message);
      } catch (error) {
        alert(error?.response?.data?.message || "Something went wrong");
      }
    }
  };

  const handleEdit = () => {
    localStorage.setItem("categoryId", id);
    setEditCategory(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center relative">
      {showRemovedCategory ? (
        <div
          onClick={restoreCategory}
          className="cursor-pointer absolute top-2 right-2 text-green-500 hover:text-green-700"
        >
          <CheckCircle size={20} />
        </div>
      ) : (
        <div
          onClick={deleteCategory}
          className="cursor-pointer absolute top-2 right-2 text-gray-500 hover:text-red-500"
        >
          <Trash2 size={20} />
        </div>
      )}
      <div
        onClick={handleEdit}
        className="cursor-pointer absolute top-2 right-8 text-gray-500 hover:text-blue-500"
      >
        <Edit size={20} />
      </div>
      <img
        src={thumbnail}
        alt={`${name} category`}
        className="w-24 h-24 mb-4 rounded-full"
      />
      <h3 className="text-lg font-bold">{name}</h3>
    </div>
  );
};

//!  Shimmer card

const CategoryCardShimmer = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center animate-pulse">
      <div className="w-24 h-24 mb-4 rounded-full bg-gray-300"></div>
      <div className="w-32 h-6 bg-gray-300 rounded"></div>
    </div>
  );
};

//!  Category List
const CategoryList = ({
  setShowAddCategory,
  setEditCategory,
  setShowRemovedCategory,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [categorieList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch categories with optional search query and page number.
  const fetchCategories = async (query = "", page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:5000/admin/searchcategories?q=${query}&page=${page}&limit=10`, 

      );
      // Assuming the backend response structure:
      // { categories, total, page, totalPages }
      setCategoryList(response.data.categories);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.page);
    } catch (err) {
      setError("Failed to fetch categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Run fetchCategories on component mount.
  useEffect(() => {
    fetchCategories("");
  }, []);

  // Handle search button click.
  const handleSearch = () => {
    if (searchInput.trim() !== "") {
      // Reset to page 1 when performing a search.
      fetchCategories(searchInput, 1);
    }
  };
  useEffect(() => {
    fetchCategories(searchInput.trim(), currentPage);
  }, [currentPage]);

  return (
    <div className="container mx-auto p-6">
      {/* Categories Section */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Categories</h1>
          <div className="flex space-x-4">
            <div className="relative w-full flex items-center space-x-4">
              {/* Search Input */}
              <div className="relative flex-grow">
                <input
                  className="w-full p-2 pr-10 border rounded-md"
                  placeholder="Search categories"
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                {searchInput && (
                  <button
                    className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      setSearchInput("");
                      fetchCategories("");
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
            <button
              onClick={() => setShowAddCategory(true)}
              className="bg-purple-600 cursor-pointer text-white w-[140px] h-[40px] rounded-md flex justify-center items-center"
            >
              <i className="fas fa-plus mr-2"></i>
              Add
            </button>
            <button
              onClick={() => setShowRemovedCategory(true)}
              className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <i className="fa-solid fa-trash mr-2"></i>
              <span>Removed</span>
            </button>
          </div>
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
                  id={category._id}
                  name={category.name}
                  thumbnail={category.thumbnail}
                  fetchCategories={fetchCategories}
                  setEditCategory={setEditCategory}
                />
              ))}
        </div>

        {/* Pagination Controls */}
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
    </div>
  );
};

//!  Add Category

const AddCategory = ({ setShowAddCategory }) => {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [visibilityStatus, setVisibilityStatus] = useState("Active");
  const [discount, setDiscount] = useState("10");
  const [thumbnail, setThumbnail] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [subCategoryInput, setSubCategoryInput] = useState(""); // Holds input field value

  // Function to handle thumbnail upload to Cloudinary
  const handleThumbnailUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "COSTUMES"); // your upload preset

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dv8xenucq/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      setThumbnail(data.secure_url);
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
    }
  };
  const handleAddSubCategory = () => {
    if (
      subCategoryInput.trim() !== "" &&
      !subCategories.includes(subCategoryInput.trim())
    ) {
      setSubCategories([...subCategories, subCategoryInput.trim()]);
      setSubCategoryInput(""); // Clear input field
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!categoryName || !description || !subCategories || !discount || !thumbnail) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/admin/addcategorys",
        {
          categoryName,
          description,
          subCategories,
          discount,
          thumbnail, // sending the thumbnail URL to the backend
        },  
        { withCredentials: true }
      );
      alert("Category added successfully!");
      setCategoryName("");
      setSubCategoryInput("");
      setDescription("");
      setThumbnail("");
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  const handleRemoveSubCategory = (index) => {
    const updatedSubCategories = subCategories.filter((_, i) => i !== index);
    setSubCategories(updatedSubCategories);
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
            <div className="mb-4">
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="category-name"
              >
                Sub Categories
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                id="category-name"
                type="text"
                value={subCategoryInput}
                onChange={(e) => setSubCategoryInput(e.target.value)}
              />
              <button
                type="button"
                className="bg-blue-500 py-2 px-3 m-2 rounded-xl cursor-pointer font-bold text-white"
                onClick={handleAddSubCategory}
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap">
              <div className="mt-2 flex flex-wrap">
                {subCategories.map((sub, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 px-3 py-1 m-1 rounded-md text-sm flex items-center"
                  >
                    {sub}
                    <button
                      type="button"
                      className="ml-2 cursor-pointer text-gray-500 font-bold"
                      onClick={() => handleRemoveSubCategory(index)}
                    >
                      ✖
                    </button>
                  </span>
                ))}
              </div>
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
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt="Thumbnail"
                    className="mx-auto mb-2"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <img
                    src="https://placehold.co/50x50"
                    alt="Placeholder image for thumbnail"
                    className="mx-auto mb-2"
                  />
                )}
                {/* Hidden file input */}
                <input
                  id="thumbnailInput"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleThumbnailUpload}
                />
                <label
                  htmlFor="thumbnailInput"
                  className="bg-gray-200 px-4 py-2 rounded-md cursor-pointer"
                >
                  Add Image
                </label>
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
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                id="discounts-offers"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
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

//!  Edit category

const EditCategory = ({ setEditCategory }) => {
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [visibilityStatus, setVisibilityStatus] = useState("Active");
  const [discount, setDiscount] = useState();
  const [thumbnail, setThumbnail] = useState("");
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const getCategory = async () => {
      const id = localStorage.getItem("categoryId"); // Get inside useEffect
      setCategoryId(id);
      if (!id) return; // Prevent request if id is missing

      try {
        const response = await axios.post(
          `http://localhost:5000/admin/getcategory/${id}`,  

        );
        const category = response.data.data;
        setCategoryName(category.name);
        setDescription(category.description);
        setSubCategories(category?.subCategories);
        setDiscount(category.discount);

        setThumbnail(category.thumbnail || ""); // Set thumbnail if exists
      } catch (error) {
        console.log(error.message);
      }
    };

    getCategory();
  }, []);

  // Handle thumbnail upload to Cloudinary
  const handleThumbnailUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "COSTUMES"); // Use your upload preset

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dv8xenucq/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      setThumbnail(data.secure_url);
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!categoryId || !categoryName || !description || !subCategories || !discount || !visibilityStatus || !thumbnail) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/admin/editcategories",
        {
          id: categoryId,
          name: categoryName,
          description: description,
          subCategories: subCategories,
          discount: discount,
          visibilityStatus: visibilityStatus,
          thumbnail: thumbnail, // Send the thumbnail URL to the backend
        },  
        { withCredentials: true }
      );
      alert(response.data.message);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };
  const handleSubCatDelete = (ind) => {
    const result = window.confirm("Do you want to remove this subcategory?");
    if (result) {
      console.log("deleted");
      const filteredCategory = subCategories.filter((cat, id) => id != ind);
      setSubCategories(filteredCategory);
    }
  };
  const [newSubCategory, setNewSubCategory] = useState("");

  return (
    <div className="w-full mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
      </div>
      <form onSubmit={handleSubmit}>
        {/* Category Name & Included Products */}
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

            {/* Include Products (Static for now) */}
            <div className="mb-4">
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="include-products"
              >
                Subcategories
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md flex flex-wrap gap-2">
                {subCategories.map((subcat, ind) => (
                  <div
                    className="flex justify-center content-center text-center"
                    key={ind}
                  >
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      id="category-name"
                      type="text"
                      value={subcat}
                      onChange={(e) => {
                        const newSubCategories = [...subCategories];
                        newSubCategories[ind] = e.target.value;
                        setSubCategories(newSubCategories);
                      }}
                    />
                    <i
                      onClick={() => handleSubCatDelete(ind)}
                      className="fas text-2xl cursor-pointer text-red-600 fa-times ml-1"
                    ></i>
                  </div>
                ))}
                <input
                  type="text"
                  placeholder="Enter new subcategory"
                  value={newSubCategory}
                  onChange={(e) => setNewSubCategory(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (
                      newSubCategory.trim() &&
                      !subCategories.includes(newSubCategory.trim)
                    ) {
                      setSubCategories([
                        ...subCategories,
                        newSubCategory.trim(),
                      ]);
                      setNewSubCategory(""); // Clear input after adding
                    }
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="thumbnail"
            >
              Thumbnail
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex items-center justify-center">
              <div className="text-center">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt="Thumbnail"
                    className="mx-auto mb-2"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <img
                    src="https://placehold.co/50x50"
                    alt="Placeholder image for thumbnail"
                    className="mx-auto mb-2"
                  />
                )}
                {/* Hidden file input */}
                <input
                  id="thumbnailInput"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleThumbnailUpload}
                />
                <label
                  htmlFor="thumbnailInput"
                  className="bg-gray-200 px-4 py-2 rounded-md cursor-pointer"
                >
                  {thumbnail ? "Change Image" : "Add Image"}
                </label>
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
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                id="discounts-offers"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md text-gray-700"
            type="button"
            onClick={() => {
              localStorage.removeItem("categoryId");
              setEditCategory(false);
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 cursor-pointer py-2 bg-purple-600 text-white rounded-md"
            type="submit"
          >
            Edit
          </button>
        </div>
      </form>
    </div>
  );
};
const RemovedCategory = ({ setShowRemovedCategory, showRemovedCategory }) => {
  const [loading, setLoading] = useState(true);
  const [categorieList, setCategoryList] = useState([]);
  const [editCategory, setEditCategory] = useState(null);

  // Define fetchCategories outside useEffect so it can be used by child components
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/admin/searchdeletedcat",
        { withCredentials: true }
      );
      setCategoryList(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto p-6">
      {/* Header Section */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Removed Categories</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowRemovedCategory(false)}
              className="bg-purple-600 text-white w-[140px] h-[40px] rounded-md flex justify-center items-center"
            >
              <i className="fas fa-plus mr-2"></i>
              Add
            </button>
            <button
              onClick={() => setShowRemovedCategory(false)}
              className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <i className="fa-solid fa-user mr-2"></i>
              <span>Active</span>
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading
            ? [...Array(8)].map((_, index) => (
                <CategoryCardShimmer key={index} />
              ))
            : categorieList.map((category) => (
                <CategoryCard
                  key={category._id}
                  id={category._id}
                  name={category.name}
                  thumbnail={category.thumbnail}
                  fetchCategories={fetchCategories}
                  setEditCategory={setEditCategory}
                  showRemovedCategory={showRemovedCategory}
                />
              ))}
        </div>
      </div>
    </div>
  );
};
//!  Category
const Category = () => {
  const [showAddCategory, setShowAddCategory] = useState(
    localStorage.getItem("showAddCategory") === "true"
  );
  const [editCategory, setEditCategory] = useState(
    localStorage.getItem("editCategory") === "true"
  ); // Track the category being edited
  const [showRemovedCategory, setShowRemovedCategory] = useState(
    localStorage.getItem("showRemovedCategory") === "true"
  ); // Track the category being edited

  useEffect(() => {
    localStorage.setItem("showAddCategory", showAddCategory);
    localStorage.setItem("editCategory", editCategory);
    localStorage.setItem("showRemovedCategory", showRemovedCategory);
  }, [showAddCategory, editCategory]);

  return editCategory ? (
    <EditCategory setEditCategory={setEditCategory} />
  ) : showAddCategory ? (
    <AddCategory setShowAddCategory={setShowAddCategory} />
  ) : showRemovedCategory ? (
    <RemovedCategory
      setShowRemovedCategory={setShowRemovedCategory}
      showRemovedCategory={showRemovedCategory}
    />
  ) : (
    <CategoryList
      setEditCategory={setEditCategory}
      setShowAddCategory={setShowAddCategory}
      setShowRemovedCategory={setShowRemovedCategory}
    />
  );
};

export default Category;
