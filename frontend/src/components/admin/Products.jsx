import React, { useCallback, useEffect, useState } from "react";
import { X, Search, Edit, Trash2, CheckCircle } from "lucide-react";
import axios from "axios";
import Cropper from "react-easy-crop";

const AddProduct = ({ setShowAddProduct }) => {
  const [name, setName] = useState("Mens Formals");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [productImages, setProductImages] = useState([""]); // Start with one input field
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [variantImages, setVariantImages] = useState([""]);

  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [owner, setOwner] = useState("");

  const [subCategory, setSubCategory] = useState(""); // stores selected subcategory

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/searchcategories?q="
        );
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [tempImageSrc, setTempImageSrc] = useState(null);

  const openFileDialog = (index) => {
    document.getElementById(`fileInput${index}`).click();
  };

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setTempImageSrc(reader.result);
      setCurrentImageIndex(index);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = async (croppedBlob) => {
    const formData = new FormData();
    formData.append("file", croppedBlob, "cropped.jpg");
    formData.append("upload_preset", "COSTUMES");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dv8xenucq/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      const newImages = [...productImages];
      newImages[currentImageIndex] = data.secure_url;
      setProductImages(newImages);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setCropModalOpen(false);
      setTempImageSrc(null);
      setCurrentImageIndex(null);
    }
  };

  // Remove an image when the X button is clicked
  const removeImage = (index) => {
    setProductImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1); // Remove the image from the array
      return newImages;
    });
  };

  // Add a new image field (for multiple uploads)
  const addImageField = () => {
    setProductImages([...productImages, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/admin/addProduct",
        {
          name,
          description,
          brand,
          category,
          subCategory,
          owner,
          variants, // Include your variants array
        }
      );

      alert(response.data.message);
      // Reset the form fields
      setName("");
      setDescription("");
      setBrand("");
      setProductImages([""]);
      setBasePrice("");
      setDiscountPrice("");
      setDiscountPercentage("");
      setStock("");
      setCategory("");
      setColor("");
      setOwner("");
      setSize("");
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  const selectedCategory = categories.find((cat) => cat._id === category);
  const sizes = ["SM", "M", "L", "XL"];
  const colors = [
    "red",
    "blue",
    "white",
    "black",
    "green",
    "yellow",
    "purple",
    "orange",
    "gray"
  ];
  const removeVariant = (index) => {
    const updatedVariants = [...variants];
    updatedVariants.splice(index, 1);
    setVariants(updatedVariants);
  };
  // State variables for the current variant input
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");

  // Array state to store all variants
  const [variants, setVariants] = useState([]);

  const addVariant = () => {
    if (selectedColor && selectedSize && basePrice && discountPrice && stock) {
      const newVariant = {
        color: selectedColor,
        size: selectedSize,
        base_price: Number(basePrice),
        discount_price: Number(discountPrice),
        stock: Number(stock),
        productImages: productImages, // Correct: using variantImages
      };

      setVariants([...variants, newVariant]);
      // Clear the inputs for next entry
      setSelectedColor("");
      setSelectedSize("");
      setBasePrice("");
      setDiscountPrice("");
      setStock("");
      setProductImages([""]); // Reset variantImages state
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <div className="w-full mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Product Name
          </label>
          <input
            className="w-full px-3 py-2 border rounded-lg"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {/* Product Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Product Description
          </label>
          <textarea
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Write your description here..."
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        {/* Brand */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Brand</label>
          <input
            className="w-full px-3 py-2 border rounded-lg"
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
        {/* Add Photos */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Add Photos
          </label>
          <div className="flex space-x-4">
            {productImages.map((img, index) => (
              <div key={index} className="relative text-center">
                {img ? (
                  <>
                    <img
                      src={img}
                      alt={`Uploaded ${index}`}
                      className="mx-auto mb-2"
                      height="400"
                      width="309"
                    />
                    {/* X button to remove the image */}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute cursor-pointer top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      X
                    </button>
                  </>
                ) : (
                  <>
                    <img
                      alt="Placeholder"
                      className="mx-auto mb-2"
                      height="100"
                      src="https://placehold.co/100x100"
                      width="100"
                    />
                    <input
                      id={`fileInput${index}`}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleFileChange(index, e)}
                    />
                    <label
                      onClick={() => openFileDialog(index)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer"
                    >
                      Add Image
                    </label>
                  </>
                )}
              </div>
            ))}
            {cropModalOpen && tempImageSrc && (
              <CropModal
                imageSrc={tempImageSrc}
                onCrop={handleCrop}
                onClose={() => setCropModalOpen(false)}
                aspect={309 / 400}
              />
            )}
          </div>
          <button
            type="button" // Avoid form submission
            onClick={addImageField}
            className="bg-blue-500 cursor-pointer text-white mx-auto my-3 px-4 py-2 rounded-lg"
          >
            + Add Another Image
          </button>
        </div>
        {/* Pricing, Stock, and Category */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-4">
            {/* Color Dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Select Color
              </label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select Color</option>
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            {/* Size Dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Select Size
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select Size</option>
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Base Price Field */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Base Price
              </label>
              <input
                type="number"
                placeholder="Enter base price"
                className="w-full px-3 py-2 border rounded-lg"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
              />
            </div>

            {/* Discount Price Field */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Discount Price
              </label>
              <input
                type="number"
                placeholder="Enter discount price"
                className="w-full px-3 py-2 border rounded-lg"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
              />
            </div>

            {/* Stock Field */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Stock
              </label>
              <input
                type="number"
                placeholder="Enter stock"
                className="w-full px-3 py-2 border rounded-lg"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            {/* Add Variant Button */}
            <button
              type="button"
              onClick={addVariant}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Add Variant
            </button>

            {/* Display Added Variants */}
            <div>
              <h3 className="font-bold mb-2">Variants:</h3>
              <ul>
                {variants.map((variant, index) => (
                  <li key={index} className="mb-1">
                    Color: {variant.color}, Size: {variant.size}, Base Price:{" "}
                    {variant.base_price}, Discount Price:{" "}
                    {variant.discount_price}, Stock: {variant.stock}
                    <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Remove Variant
                    </button>
                  </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Final Submit Button */}
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Category
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubCategory("");
              }}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 font-bold mb-2">
              Subcategory
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
            >
              <option value="">Select Subcategory</option>
              {selectedCategory &&
                selectedCategory.subCategories.map((subCat, index) => (
                  <option key={index} value={subCat}>
                    {subCat}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Owner</label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            />
          </div>
        </div>
        {/* Form Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowAddProduct(false)}
            type="button"
            className="bg-gray-200 cursor-pointer text-gray-700 px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-purple-600 cursor-pointer text-white px-4 py-2 rounded-lg flex items-center"
          >
            <i className="fas fa-save mr-2"></i> Save
          </button>
        </div>
      </form>
    </div>
  );
};

//!croping comppo
const getCroppedImg = (imageSrc, croppedAreaPixels) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const outputWidth = 309;
      const outputHeight = 400;
      const canvas = document.createElement("canvas");
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        outputWidth,
        outputHeight
      );
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Canvas is empty"));
        resolve(blob);
      }, "image/jpeg");
    };
    image.onerror = () => reject(new Error("Image load failed"));
  });

// Crop Modal Component
const CropModal = ({ imageSrc, onCrop, onClose, aspect = 1 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCrop(croppedBlob);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4">
        {/* Container with fixed size */}
        <div className="relative w-[309px] h-[400px]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            cropShape="rect"
            showGrid={false}
            style={{
              containerStyle: {
                width: "309px",

                height: "400px",
              },
              cropAreaStyle: {
                border: "2px dashed #fff",
                background: "rgba(0, 0, 0, 0.5)",
                width: "309px",
                height: "400px",
              },
            }}
          />
        </div>
        <div className="mt-2 flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleCrop}
            className="bg-blue-500 text-white px-4 py-2"
          >
            Crop
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

//! Products list component
const ProductsList = ({
  setShowAddProduct,
  setShowEditProduct,
  setShowRemoved,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [productsList, setProductsList] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (query = "", page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/admin/searchproducts?q=${query}&page=${page}&limit=10`
      );
      // Assuming the backend response is structured as:
      // { products: [...], page: number, totalPages: number }
      setProductsList(response.data.products);
      setCurrentPage(response.data.page);
      setTotalPages(response.data.totalPages);
      console.log(response.data.products);
      
      setError("");
    } catch (err) {
      setError("Failed to fetch products. Please try again.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts("", 1);
  }, []);

  const handleSearch = () => {
    fetchProducts(searchInput.trim(), 1);
  };

  const softDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      try {
        const response = await axios.put(
          `http://localhost:5000/admin/softdeleteproduct/${id}`
        );
        if (response.status === 200) {
          alert("Product deleted successfully!");
          await fetchProducts(searchInput.trim(), currentPage);
        } else {
          alert("Failed to delete product.");
        }
      } catch (err) {
        console.error("Error deleting product:", err);
        alert(err?.response?.data?.message || "Something went wrong");
      }
    }
  };
  useEffect(() => {
    fetchProducts(searchInput.trim(), currentPage);
  }, [currentPage]);

  return (
    // Added pb-20 to ensure content doesn't get hidden behind the fixed pagination
    <div className="max-w-7xl mx-auto p-6 pb-20">
      {/* Header with Title and Actions */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products Management</h1>
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products"
              className="w-full p-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput("");
                  fetchProducts("", 1);
                }}
                className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <X size={25} />
              </button>
            )}
          </div>
          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
          >
            <Search size={18} />
            <span>Search</span>
          </button>
          {/* Add New Product Button */}
          <button
            onClick={() => setShowAddProduct(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <i className="fas fa-plus mr-2"></i>
            <span>New</span>
          </button>
          <button
            onClick={() => setShowRemoved(true)}
            className="bg-red-600 text-white px-4 py-2 cursor-pointer rounded-lg flex items-center space-x-2"
          >
            <i className="fa-solid fa-trash mr-2"></i>
            <span>Removed</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-4 rounded-md text-center mb-4">
          {error}
        </div>
      )}

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-left">Product ID</th>
              <th className="py-3 px-4 text-left">owner</th>
              <th className="py-3 px-4 text-left">Brand</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {loading ? (
              // Shimmer Effect While Loading
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b animate-pulse">
                  {Array.from({ length: 6 }).map((_, colIndex) => (
                    <td key={colIndex} className="py-3 px-4">
                      <div className="h-4 bg-gray-300 rounded w-24"></div>
                    </td>
                  ))}
                  <td className="py-3 px-4 flex space-x-4">
                    <div className="h-5 w-5 bg-gray-300 rounded"></div>
                    <div className="h-5 w-5 bg-gray-300 rounded"></div>
                  </td>
                </tr>
              ))
            ) : productsList.length > 0 ? (
              productsList.map((product, index) => (
                <tr
                  key={product._id}
                  className={`border-b ${index % 2 === 0 ? "bg-gray-50" : ""}`}
                >
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4 text-blue-600">{product._id}</td>
                  <td className="py-3 px-4">{product.owner}</td>
                  <td className="py-3 px-4">{product.brand}</td>
                  <td className="py-3 px-4 flex space-x-4">
                    {/* Edit Button */}
                    <button
                      onClick={() => {
                        setShowEditProduct(true);
                        localStorage.setItem("productId", product._id);
                      }}
                      className="text-gray-600 cursor-pointer hover:text-blue-500"
                    >
                      <Edit size={20} />
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => softDelete(product._id)}
                      className="text-gray-600 cursor-pointer hover:text-red-500"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 text-center" colSpan="7">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Fixed Pagination UI at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-2 bg-background bg-gray-100 shadow-sm border-t border-border">
        <div className="flex justify-center items-center space-x-1 max-w-xs mx-auto">
          <button
            onClick={() => {
              if (currentPage > 1) {
                fetchProducts(searchInput.trim(), currentPage - 1);
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

//!edit products


const EditProduct = ({ setShowEditProduct }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // Basic product info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [owner, setOwner] = useState("");
  
  // Product images - store only URLs
  const [productImages, setProductImages] = useState([]);
  
  // Categories data
  const [categories, setCategories] = useState([]);
  
  // Variant-related state
  const [variants, setVariants] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  
  // New state for variant images
  const [variantImages, setVariantImages] = useState([""]);
  
  // Constants
  const sizes = ["SM", "M", "L", "XL"];
  const colors = [
    "red", "blue", "white", "black", 
    "green", "yellow", "purple", "orange","gray"
  ];

  // Fetch product details on mount
  useEffect(() => {
    const id = localStorage.getItem("productId");
    const fetchProduct = async () => {
      try {
        const response = await axios.post(
          `http://localhost:5000/admin/getproduct/${id}`
        );
        setProductDetails(response.data.data);
        console.log("Product data:", response.data.data);
      } catch (error) {
        console.log("Error fetching product:", error);
      }
    };
    fetchProduct();
    
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/searchcategories?q="
        );
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Initialize state after fetching productDetails
  useEffect(() => {
    if (productDetails) {
      setName(productDetails.name || "");
      setDescription(productDetails.description || "");
      setBrand(productDetails.brand || "");
      setCategory(productDetails.category || "");
      setSubCategory(productDetails.subCategory || "");
      setOwner(productDetails.owner || "");
      
      // Set product images - ensure we're working only with URLs
      if (productDetails.productImages && productDetails.productImages.length > 0) {
        setProductImages(
          productDetails.productImages
            .filter(img => img && (img.startsWith('http') || img.startsWith('https')))
        );
      } else {
        setProductImages([]);
      }
      
      // Set variants if they exist
      if (productDetails.variants && productDetails.variants.length > 0) {
        setVariants(productDetails.variants.map(variant => ({
          ...variant,
          productImages: variant.productImages || [] // Ensure each variant has a productImages array
        })));
      }
    }
  }, [productDetails]);

  // Handle image upload to Cloudinary
  const handleImageUpload = async (file) => {
    if (!file) return null;
    
    setLoading(true);
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
      setLoading(false);
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);
      return null;
    }
  };

  // Add image to product
  const addProductImage = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const imageUrl = await handleImageUpload(file);
    if (imageUrl) {
      setProductImages([...productImages, imageUrl]);
    }
  };

  // Add image to variant
  const handleVariantImageUpload = async (variantIndex, file) => {
    if (!file) return null;
    
    setLoading(true);
    try {
      const imageUrl = await handleImageUpload(file);
      if (imageUrl) {
        const updatedVariants = [...variants];
        if (!updatedVariants[variantIndex].productImages) {
          updatedVariants[variantIndex].productImages = [];
        }
        updatedVariants[variantIndex].productImages = [
          ...updatedVariants[variantIndex].productImages,
          imageUrl
        ];
        setVariants(updatedVariants);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error uploading variant image:", error);
      setLoading(false);
    }
  };

  // Add image to specific variant
  const addVariantImage = async (variantIndex, event) => {
    const file = event.target.files[0];
    if (!file) return;
    await handleVariantImageUpload(variantIndex, file);
  };

  // Handle variant images for new variant
  const handleProductImageChange = (index, event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      const newImages = [...variantImages];
      newImages[index] = reader.result;
      setVariantImages(newImages);
      
      // If the last field is now filled, add another empty field
      if (index === newImages.length - 1) {
        setVariantImages([...newImages, ""]);
      }
    };
    reader.readAsDataURL(file);
  };

  // Process variantImages to upload to Cloudinary before adding a new variant
  const uploadVariantImages = async () => {
    const uploadedUrls = [];
    
    // Filter out empty strings
    const filledImages = variantImages.filter(img => img && img !== "");
    
    if (filledImages.length === 0) return [];
    
    setLoading(true);
    
    for (const imageData of filledImages) {
      // Skip if already a URL
      if (imageData.startsWith('http')) {
        uploadedUrls.push(imageData);
        continue;
      }
      
      // Convert base64 to file
      const file = await dataURLtoFile(imageData, "variant-image.jpg");
      const uploadedUrl = await handleImageUpload(file);
      if (uploadedUrl) {
        uploadedUrls.push(uploadedUrl);
      }
    }
    
    setLoading(false);
    return uploadedUrls;
  };
  
  // Utility function to convert dataURL to File
  const dataURLtoFile = (dataurl, filename) => {
    return new Promise((resolve) => {
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      
      resolve(new File([u8arr], filename, { type: mime }));
    });
  };

  // Remove image from product
  const removeProductImage = (index) => {
    const newImages = [...productImages];
    newImages.splice(index, 1);
    setProductImages(newImages);
  };

  // Remove variant image
  const removeVariantImage = (variantIndex, imageIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].productImages.splice(imageIndex, 1);
    setVariants(updatedVariants);
  };

  // Remove new variant image
  const removeNewVariantImage = (index) => {
    const newImages = [...variantImages];
    newImages.splice(index, 1);
    setVariantImages(newImages);
  };

  // Variant functions
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setVariants(updatedVariants);
  };

  const addVariant = async () => {
    if (selectedColor && selectedSize && basePrice && discountPrice && stock) {
      setLoading(true);
      
      // Upload variant images first
      const uploadedImages = await uploadVariantImages();
      
      const newVariant = {
        color: selectedColor,
        size: selectedSize,
        base_price: Number(basePrice),
        discount_price: Number(discountPrice),
        stock: Number(stock),
        productImages: uploadedImages // Using uploaded images for this variant
      };
      
      setVariants([...variants, newVariant]);
      
      // Clear inputs for next variant
      setSelectedColor("");
      setSelectedSize("");
      setBasePrice("");
      setDiscountPrice("");
      setStock("");
      setVariantImages([""]);
      
      setLoading(false);
    } else {
      alert("Please fill in all variant fields");
    }
  };

  const removeVariant = (index) => {
    const updatedVariants = [...variants];
    updatedVariants.splice(index, 1);
    setVariants(updatedVariants);
  };

  // Form submission - only send necessary data
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) {
      alert("Please wait for images to finish uploading");
      return;
    }
    
    try {
      // Prepare payload with only necessary data
      const payload = {
        name,
        description,
        brand,
        category,
        subCategory,
        owner,
        variants: variants.map(variant => ({
          color: variant.color,
          size: variant.size,
          base_price: variant.base_price,
          discount_price: variant.discount_price,
          stock: variant.stock,
          productImages: variant.productImages || [] // Include variant-specific images
        }))
      };
      
      const response = await axios.put(
        `http://localhost:5000/admin/editproduct/${productDetails._id}`,
        payload
      );
      
      alert(response.data.message);
      setShowEditProduct(false);
      localStorage.removeItem("productId");
    } catch (error) {
      console.log("Error updating product:", error);
      alert(`Error updating product: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="w-full mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      
      {loading && (
        <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded">
          Uploading images... Please wait.
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Basic Product Information */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Product Name
            </label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Product Description
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Brand</label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>
        </div>
        
    
        {/* Category Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Category
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubCategory("");
              }}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Subcategory
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
            >
              <option value="">Select Subcategory</option>
              {categories
                .find((cat) => cat._id === category)
                ?.subCategories.map((subCat, index) => (
                  <option key={index} value={subCat}>
                    {subCat}
                  </option>
                ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 font-bold mb-2">Owner</label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            />
          </div>
        </div>
        
        {/* Current Variants Section */}
        {variants.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-xl mb-4">Current Variants</h3>
            <div className="space-y-8">
              {variants.map((variant, variantIndex) => (
                <div key={variantIndex} className="border border-gray-300 rounded-lg p-4">
                  <div className="grid grid-cols-5 gap-4 mb-4">
                    <div>
                      <label className="block font-bold mb-1">Color</label>
                      <select
                        value={variant.color}
                        onChange={(e) => handleVariantChange(variantIndex, "color", e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                      >
                        <option value="">Select Color</option>
                        {colors.map((col) => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block font-bold mb-1">Size</label>
                      <select
                        value={variant.size}
                        onChange={(e) => handleVariantChange(variantIndex, "size", e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                      >
                        <option value="">Select Size</option>
                        {sizes.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block font-bold mb-1">Base Price</label>
                      <input
                        type="number"
                        value={variant.base_price}
                        onChange={(e) => handleVariantChange(variantIndex, "base_price", e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    
                    <div>
                      <label className="block font-bold mb-1">Discount Price</label>
                      <input
                        type="number"
                        value={variant.discount_price}
                        onChange={(e) => handleVariantChange(variantIndex, "discount_price", e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    
                    <div>
                      <label className="block font-bold mb-1">Stock</label>
                      <input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(variantIndex, "stock", e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                  </div>
                  
                  {/* Variant Images */}
                  <div className="mb-4">
                    <label className="block font-bold mb-2">Variant Images</label>
                    <div className="flex flex-wrap gap-4 mb-2">
                      {variant.productImages && variant.productImages.map((img, imgIndex) => (
                        <div key={imgIndex} className="relative">
                          <img
                            src={img}
                            alt={`Variant ${variantIndex}-${imgIndex}`}
                            className="w-32 h-32 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeVariantImage(variantIndex, imgIndex)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      
                      {/* Add Variant Image Button */}
                      <div className="w-32 h-32 border border-dashed border-gray-300 rounded-md flex items-center justify-center">
                        <input
                          id={`addVariantImage-${variantIndex}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => addVariantImage(variantIndex, e)}
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById(`addVariantImage-${variantIndex}`).click()}
                          className="text-gray-600"
                          disabled={loading}
                        >
                          {loading ? "Uploading..." : "Add Image"}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeVariant(variantIndex)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Remove Variant
                    </button>
                  </div>


                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Add New Variant Section */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4">Add New Variant</h3>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="mb-2">
                <label className="block font-bold mb-1">Color</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select Color</option>
                  {colors.map((col) => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-2">
                <label className="block font-bold mb-1">Size</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select Size</option>
                  {sizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-2">
                <label className="block font-bold mb-1">Base Price</label>
                <input
                  type="number"
                  placeholder="Enter base price"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              
              <div className="mb-2">
                <label className="block font-bold mb-1">Discount Price</label>
                <input
                  type="number"
                  placeholder="Enter discount price"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              
              <div className="mb-2">
                <label className="block font-bold mb-1">Stock</label>
                <input
                  type="number"
                  placeholder="Enter stock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            
            {/* New Variant Images */}
            <div className="mb-4">
              <label className="block font-bold mb-2">Variant Images</label>
              <div className="flex flex-wrap gap-4 mb-2">
                {variantImages.map((img, index) => (
                  <div key={index} className="relative">
                    {img ? (
                      <>
                        <img
                          src={img}
                          alt={`New Variant ${index}`}
                          className="w-32 h-32 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewVariantImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <div className="w-32 h-32 border border-dashed border-gray-300 rounded-md flex items-center justify-center">
                        <input
                          id={`newVariantImage-${index}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleProductImageChange(index, e)}
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById(`newVariantImage-${index}`).click()}
                          className="text-gray-600"
                          disabled={loading}
                        >
                          {loading ? "Uploading..." : "Add Image"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={addVariant}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                disabled={loading}
              >
                Add Variant
              </button>
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => {
              setShowEditProduct(false);
              localStorage.removeItem("productId");
            }}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg"
            disabled={loading}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded-lg flex items-center"
            disabled={loading}
          >
            <span className="mr-2">💾</span> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};




const RemovedProducts = ({ setShowRemoved }) => {
  const [loading, setLoading] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/admin/searchdeletedproducts"
      );

      setProductsList(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async (id) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/admin/restoreprod",
        { id: id }
      );
      if (response.status == 200) {
        alert("Product Activated Succesfully");
      }
      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with Title and Actions */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Products Management</h1>
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products"
                className="w-full p-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            {/* Search Button */}
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2">
              <Search size={18} />
              <span>Search</span>
            </button>
            {/* Add New Product Button */}

            <button
              onClick={() => setShowRemoved(false)}
              className="bg-green-600 text-white cursor-pointer px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <i className="fa-solid  fa-user mr-2"></i>
              <span>Active</span>
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Product</th>
                <th className="py-3 px-4 text-left">Product ID</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Stock</th>
                <th className="py-3 px-4 text-left">Added on</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {loading ? (
                // Shimmer Effect While Loading
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b animate-pulse">
                    {Array.from({ length: 6 }).map((_, colIndex) => (
                      <td key={colIndex} className="py-3 px-4">
                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                      </td>
                    ))}
                    <td className="py-3 px-4 flex space-x-4">
                      <div className="h-5 w-5 bg-gray-300 rounded"></div>
                      <div className="h-5 w-5 bg-gray-300 rounded"></div>
                    </td>
                  </tr>
                ))
              ) : productsList.length > 0 ? (
                productsList.map((product, index) => (
                  <tr
                    key={product._id}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-gray-50" : ""
                    }`}
                  >
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4 text-blue-600">{product._id}</td>
                    <td className="py-3 px-4">{product.discount_price}</td>
                    <td className="py-3 px-4">{product.color}</td>
                    <td className="py-3 px-4">{product.size}</td>
                    <td className="py-3 px-4 flex space-x-4">
                      {/* Edit Button */}

                      {/* Delete Button */}

                      <button
                        onClick={() => handleClick(product._id)}
                        className="text-gray-600 cursor-pointer hover:text-green-500"
                      >
                        <CheckCircle size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3 text-center" colSpan="7">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

//! Products component
const Products = () => {
  const [showAddProduct, setShowAddProduct] = useState(
    localStorage.getItem("showAddProduct") === "true"
  );
  const [showRemoved, setShowRemoved] = useState(
    localStorage.getItem("showRemoved") === "true"
  );
  useEffect(() => {
    localStorage.setItem("showAddProduct", showAddProduct);
  }, [showAddProduct]);

  useEffect(() => {
    localStorage.setItem("showRemoved", showRemoved);
  }, [showRemoved]);
  const [showEditPRoduct, setShowEditProduct] = useState(
    localStorage.getItem("showEditPRoduct") === "true"
  );

  useEffect(() => {
    localStorage.setItem("showEditPRoduct", showEditPRoduct);
  }, [showEditPRoduct]);

  return showEditPRoduct ? (
    <EditProduct setShowEditProduct={setShowEditProduct} />
  ) : showAddProduct ? (
    <AddProduct setShowAddProduct={setShowAddProduct} />
  ) : showRemoved ? (
    <RemovedProducts setShowRemoved={setShowRemoved} />
  ) : (
    <ProductsList
      setShowEditProduct={setShowEditProduct}
      setShowAddProduct={setShowAddProduct}
      setShowRemoved={setShowRemoved}
    />
  );
};

export default Products;
