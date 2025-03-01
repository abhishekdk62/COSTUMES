import React, { useEffect, useState } from "react";
import { X, Search, Edit, Trash2, LocateFixed } from "lucide-react";
import axios from "axios";

const AddProduct = ({ setShowAddProduct }) => {
  const [name, setName] = useState("Mens Formals");
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
  const [quantity, setQuantity] = useState("");
  const [size, setSize] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/admin/addProduct",
        {
          name,
          description,
          brand,
          productImages,
          base_price: basePrice,
          discount_price: discountPrice,
          discount_percentage: discountPercentage,
          stock,
          color,
          quantity,
          size,
        }
      );
      alert(response.data.message);
      setName("");
      setDescription("");
      setBrand("");
      setProductImages(["", "", ""]);
      setBasePrice("");
      setDiscountPrice("");
      setDiscountPercentage("");
      setStock("");
      setColor("");
      setOwner("");
      setQuantity("");
      setSize("");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="w-full mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit}>
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
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Brand</label>
          <input
            className="w-full px-3 py-2 border rounded-lg"
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Add Photos
          </label>
          <div className="flex space-x-4">
            {productImages.map((_, index) => (
              <div
                key={index}
                className="w-1/3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-4"
              >
                <div className="text-center">
                  <img
                    alt="Placeholder"
                    className="mx-auto mb-2"
                    height="100"
                    src="https://placehold.co/100x100"
                    width="100"
                  />
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">
                    Add Image
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
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
            <input
              className="w-full px-3 py-2 border rounded-lg"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
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
            <label className="block text-gray-700 font-bold mb-2">
              Quantity
            </label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
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

//! Products list component

const ProductsList = ({ setShowAddProduct, setShowEditProduct }) => {
  const [searchInput, setSearchInput] = useState("");

  const [productsList, setProductsList] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (query) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/admin/searchproducts?q=${query}`
      );
      setProductsList(response.data);
    } catch (error) {
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts("");
  }, []);

  const handleSearch = () => {
    fetchProducts(searchInput);
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
          await fetchProducts(""); // Ensure the product list updates
        } else {
          alert("Failed to delete product.");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert(error?.response?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Products Management</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-grow">
          <input
            className="w-[95%] p-2 pr-10 border rounded-md"
            placeholder="Search products"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button
              className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setSearchInput("");
              }}
            >
              <X size={25} />
            </button>
          )}
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleSearch}
            className="bg-blue-600 cursor-pointer text-white ml-4 px-4 py-2 rounded-md flex items-center"
          >
            <Search size={18} className="mr-2" /> Search
          </button>
          <button
            onClick={() => setShowAddProduct(true)}
            className="bg-purple-600 cursor-pointer text-white px-4 py-2 rounded-lg flex items-center"
          >
            <i className="fas fa-plus mr-2"></i> New
          </button>
        </div>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-4 rounded-md text-center mx-auto w-[95%]">
          {error}
        </div>
      )}

      <table className="min-w-full bg-white rounded-lg overflow-hidden">
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
          {loading
            ? [...Array(5)].map((_, index) => (
                <tr key={index} className="border-b animate-pulse">
                  {Array(6)
                    .fill("")
                    .map((_, colIndex) => (
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
            : productsList.map((product, index) => (
                <tr
                  key={index}
                  className={`border-b ${index % 2 === 0 ? "bg-gray-50" : ""}`}
                >
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4 text-blue-600">{product._id}</td>
                  <td className="py-3 px-4">{product.discount_price}</td>
                  <td className="py-3 px-4">{product.color}</td>
                  <td className="py-3 px-4">{product.quantity}</td>
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
              ))}
        </tbody>
      </table>
    </div>
  );
};

//!edit products

const EditProduct = ({ setShowEditProduct }) => {
  const [productDetails, setProductDetails] = useState();
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
      setQuantity(productDetails.quantity || "");
      setSize(productDetails.size || "");
    }
  }, [productDetails]);

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
  const [quantity, setQuantity] = useState("");
  const [size, setSize] = useState("");

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
          discount_price: discountPrice,
          discount_percentage: discountPercentage,
          stock,
          color,
          quantity,
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
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Brand</label>
          <input
            className="w-full px-3 py-2 border rounded-lg"
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Add Photos
          </label>
          <div className="flex space-x-4">
            {productImages.map((_, index) => (
              <div
                key={index}
                className="w-1/3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-4"
              >
                <div className="text-center">
                  <img
                    alt="Placeholder"
                    className="mx-auto mb-2"
                    height="100"
                    src="https://placehold.co/100x100"
                    width="100"
                  />
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">
                    Add Image
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
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
            <input
              className="w-full px-3 py-2 border rounded-lg"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
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
            <label className="block text-gray-700 font-bold mb-2">
              Quantity
            </label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
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

//! Products component
const Products = () => {
  const [showAddProduct, setShowAddProduct] = useState(
    localStorage.getItem("showAddProduct") === "true"
  );
  useEffect(() => {
    localStorage.setItem("showAddProduct", showAddProduct);
  }, [showAddProduct]);

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
  ) : (
    <ProductsList
      setShowEditProduct={setShowEditProduct}
      setShowAddProduct={setShowAddProduct}
    />
  );
};

export default Products;
