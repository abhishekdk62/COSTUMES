import React, { useCallback, useEffect, useState } from "react";
import { X, Search, Edit, Trash2, CheckCircle } from "lucide-react";
import axios from "axios";
import Cropper from "react-easy-crop";


// Predefined options
const colorOptions = ["Black", "Blue", "Red"];
const sizeOptions = ["XL", "L", "SM", "M"];



const AddProduct = ({ setShowAddProduct }) => {
  // Main Product States
  const [name, setName] = useState("Mens Formals");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [productImages, setProductImages] = useState([""]); // Main product images
  const [basePrice, setBasePrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategory, setSubCategory] = useState("");
  const [owner, setOwner] = useState("");

  // Crop state for product images
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [tempImageSrc, setTempImageSrc] = useState(null);

  // Variant States
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]); // Array of { size, stock, basePrice, discountPrice, discountPercentage }
  const [variants, setVariants] = useState([]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/searchcategories?q=");
        setCategories(res.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // ----- MAIN PRODUCT IMAGE HANDLERS -----
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
      const res = await fetch("https://api.cloudinary.com/v1_1/dv8xenucq/image/upload", {
        method: "POST",
        body: formData,
      });
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

  const removeProductImage = (index) => {
    setProductImages((prev) => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const addProductImageField = () => {
    setProductImages([...productImages, ""]);
  };

  // ----- VARIANT IMAGE HANDLERS -----




  // ----- VARIANT SIZE HANDLERS -----
  const toggleSize = (size) => {
    const exists = selectedSizes.find((item) => item.size === size);
    if (exists) {
      setSelectedSizes(selectedSizes.filter((item) => item.size !== size));
    } else {
      setSelectedSizes([
        ...selectedSizes,
        { size, stock: "", basePrice: "", discountPrice: "", discountPercentage: "" },
      ]);
    }
  };

  const updateSizeField = (size, field, value) => {
    setSelectedSizes(
      selectedSizes.map((item) => (item.size === size ? { ...item, [field]: value } : item))
    );
  };

  // ----- ADD VARIANT -----
  const addVariant = () => {
    if (selectedColor && selectedSizes.length > 0) {
      const newVariant = {
        color: selectedColor,
        sizes: selectedSizes,
      };
      setVariants([...variants, newVariant]);
      // Reset variant fields for next entry
      setSelectedColor("");
      setSelectedSizes([]);
    }
  };

  // ----- FORM SUBMISSION -----
  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      name,
      description,
      brand,
      productImages,
      base_price: basePrice,
      discount_price: discountPrice,
      discount_percentage: discountPercentage,
      stock,
      category,
      subCategory,
      owner,
      variants,
    };
    try {
      const res = await axios.post("http://localhost:5000/admin/addProduct", productData);
      alert(res.data.message);
      // Optionally reset states here
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const selectedCategory = categories.find((cat) => cat._id === category);

  return (
    <div className="w-full mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Product Details */}
        <div className="space-y-2">
          <input
            className="w-full px-3 py-2 border rounded-lg"
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Product Description"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="w-full px-3 py-2 border rounded-lg"
            type="text"
            placeholder="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>

        {/* Main Product Images */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Add Product Images</label>
          <div className="flex space-x-4">
            {productImages.map((img, index) => (
              <div key={index} className="relative">
                {img ? (
                  <>
                    <img src={img} alt={`Product ${index}`} className="w-32 h-32 object-cover rounded-md" />
                    <button
                      type="button"
                      onClick={() => removeProductImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    >
                      X
                    </button>
                  </>
                ) : (
                  <div className="w-32 h-32 border border-dashed flex items-center justify-center">
                    <input
                      id={`fileInput${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(index, e)}
                    />
                    <button type="button" onClick={() => openFileDialog(index)} className="text-gray-600">
                      Add Image
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addProductImageField} className="mt-2 text-blue-500">
            + Add Another Product Image
          </button>
        </div>

        {/* Pricing & Details */}
        <div className="grid grid-cols-2 gap-4">
          <input
            className="w-full px-3 py-2 border rounded-lg"
            type="text"
            placeholder="Base Price"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
          />
          <input
            className="w-full px-3 py-2 border rounded-lg"
            type="text"
            placeholder="Discount Price"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
          />
          <input
            className="w-full px-3 py-2 border rounded-lg"
            type="text"
            placeholder="Discount Percentage"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
          />
          <input
            className="w-full px-3 py-2 border rounded-lg"
            type="text"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select
            className="w-full px-3 py-2 border rounded-lg"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setSubCategory(""); }}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {selectedCategory && (
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
            >
              <option value="">Select Subcategory</option>
              {selectedCategory.subCategories.map((subCat, index) => (
                <option key={index} value={subCat}>
                  {subCat}
                </option>
              ))}
            </select>
          )}
        </div>
        <input
          className="w-full px-3 py-2 border rounded-lg"
          type="text"
          placeholder="Owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />

        {/* Variants Section */}
        <div className="border-t pt-4">
          <h2 className="text-xl font-bold mb-4">Variants</h2>
          {/* Variant Color */}
          <select
            className="w-full px-3 py-2 border rounded-lg mb-4"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
          >
            <option value="">Select Variant Color</option>
            {colorOptions.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
          {/* Variant Images */}
       
          {/* Variant Sizes */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Select Sizes</label>
            <div className="flex space-x-4">
              {sizeOptions.map((s) => (
                <label key={s} className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={selectedSizes.some((item) => item.size === s)}
                    onChange={() => toggleSize(s)}
                    className="form-checkbox"
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Inputs for each selected size */}
          {selectedSizes.map((item) => (
            <div key={item.size} className="grid grid-cols-5 gap-4 mb-2 items-center">
              <div className="font-semibold">{item.size}</div>
              <input
                type="number"
                placeholder="Stock"
                value={item.stock}
                onChange={(e) => updateSizeField(item.size, "stock", e.target.value)}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Base Price"
                value={item.basePrice}
                onChange={(e) => updateSizeField(item.size, "basePrice", e.target.value)}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Discount Price"
                value={item.discountPrice}
                onChange={(e) => updateSizeField(item.size, "discountPrice", e.target.value)}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Discount %"
                value={item.discountPercentage}
                onChange={(e) => updateSizeField(item.size, "discountPercentage", e.target.value)}
                className="px-3 py-2 border rounded-lg"
              />
            </div>
          ))}
          <button type="button" onClick={addVariant} className="bg-green-500 text-white px-4 py-2 rounded-lg">
            Add Variant
          </button>
        </div>

        {/* Final Submit */}
        <div className="flex justify-end mt-6 space-x-4">
          <button type="button" onClick={() => setShowAddProduct(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">
            Cancel
          </button>
          <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-lg">
            Save Product
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
                  className={`border-b ${index % 2 === 0 ? "bg-gray-50" : ""}`}
                >
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4 text-blue-600">{product._id}</td>
                  <td className="py-3 px-4">{product.discount_price}</td>
                  <td className="py-3 px-4">{product.color}</td>
                  <td className="py-3 px-4">{product.size}</td>
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

  // State variables
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [productImages, setProductImages] = useState(["", "", ""]);
  const [basePrice, setBasePrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [owner, setOwner] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategory, setSubCategory] = useState("");

  // Fetch product details on mount
  useEffect(() => {
    const id = localStorage.getItem("productId");
    const fetchProduct = async () => {
      try {
        const response = await axios.post(
          `http://localhost:5000/admin/getproduct/${id}`
        );
        setProductDetails(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProduct();
  }, []);
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

  // Initialize state after fetching productDetails
  useEffect(() => {
    if (productDetails) {
      setName(productDetails.name || "");
      setDescription(productDetails.description || "");
      setBrand(productDetails.brand || "");
      setBasePrice(productDetails.base_price || "");
      setDiscountPrice(productDetails.discount_price || "");
      setDiscountPercentage(productDetails.discount_percentage || "");
      setStock(productDetails.stock || "");
      setOwner(productDetails.owner || "");
      setColor(productDetails.color || "");
      setSize(productDetails.size || "");
      setCategory(productDetails.category || "");
      setProductImages(productDetails.productImages || ["", "", ""]);
    }
  }, [productDetails]);

  // Handle image upload to Cloudinary for a specific image slot
  const handleImageUpload = async (index, event) => {
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
      // Update the specific image slot with the secure URL from Cloudinary
      const newProductImages = [...productImages];
      newProductImages[index] = data.secure_url;
      setProductImages(newProductImages);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/admin/editproduct/${productDetails._id}`,
        {
          name,
          description,
          brand,
          productImages,
          base_price: basePrice,
          subCategory,  
          discount_price: discountPrice,
          discount_percentage: discountPercentage,
          stock,
          category: category,
          owner,
          color,
          size,
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
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
              <div
                key={index}
                className="w-1/3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-4"
              >
                <div className="text-center">
                  {img ? (
                    <img
                      src={img}
                      alt={`Uploaded ${index}`}
                      className="mx-auto mb-2"
                      height="100"
                      width="100"
                    />
                  ) : (
                    <img
                      alt="Placeholder"
                      src="https://placehold.co/100x100"
                      className="mx-auto mb-2"
                      height="100"
                      width="100"
                    />
                  )}
                  {/* Hidden file input for image upload */}
                  <input
                    id={`fileInput${index}`}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageUpload(index, e)}
                  />
                  <label
                    htmlFor={`fileInput${index}`}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer"
                  >
                    {img ? "Change Image" : "Add Image"}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Pricing, Stock, and Other Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Base Price
            </label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              type="text"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Discount Price
            </label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              type="text"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Discount Percentage
            </label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              type="text"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Stock</label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              type="text"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
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
         <div>
  <label className="block text-gray-700 font-bold mb-2">Subcategory</label>
  <select
    className="w-full px-3 py-2 border rounded-lg"
    value={subCategory}
    onChange={(e) => setSubCategory(e.target.value)}
  >
    <option value="">Select Subcategory</option>
    {categories.find(cat => cat._id === category)?.subCategories.map((subCat, index) => (
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
          <div>
            <label className="block text-gray-700 font-bold mb-2">Color</label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Size</label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              setShowEditProduct(false);
              localStorage.removeItem("productId");
            }}
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
