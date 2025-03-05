import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactSlider from "react-slider";


const ListProducts = () => {
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [minPrice, setMinPrice] = useState(200);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch products from backend with pagination
  const getProducts = async () => {
    try {
      setLoading(true);

      const requestBody = {
        searchTerm, // from redux
        category: selectedCategory,
        minPrice,
        maxPrice,
        sortBy,
        page: currentPage,
        limit: 10,
      };

      const response = await axios.post(
        "http://localhost:5000/user/products",
        requestBody
      );

      // Expected response format: { products, page, totalPages }
      setProducts(response.data.products);
      setCurrentPage(response.data.page);
      setTotalPages(response.data.totalPages);
      setError("");
    } catch (error) {
      console.log(error);
      setError(error.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  // When filters change, reset page to 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, minPrice, maxPrice, sortBy, selectedCategory]);

  // Fetch products when currentPage or any filter changes
  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, minPrice, maxPrice, sortBy, selectedCategory]);

  // Fetch categories for filter sidebar
  const fetchCategories = async (query) => {
    try {
      const response = await axios.get(
                `http://localhost:5000/user/searchcategoriestofilter?q=${query}`

      );
      setCategoryList(response.data);
    } catch (error) {
      console.log("Failed to fetch categories. Please try again", error);
    }
  };

  useEffect(() => {
    fetchCategories("");
  }, []);

  // Handle viewing a product
  const handleProductView = (product) => {
    localStorage.setItem("productInfo", JSON.stringify(product));
    navigate("/product");
  };

  return (
    <div className="container mx-auto p-4 pb-20">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Filter</h2>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Categories</h3>
            <ul>
              {categoryList.map((category, indx) => (
                <li
                  key={indx}
                  onClick={() => setSelectedCategory(category._id)}
                  className="mb-2 cursor-pointer"
                >
                  <span className="text-gray-700">{category.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Price</h3>
            <div className="flex items-center justify-between">
              <span>${minPrice}</span>
              <span>${maxPrice}</span>
            </div>
            <ReactSlider
              value={[minPrice, maxPrice]}
              min={200}
              max={50000}
              onChange={(values) => {
                setMinPrice(values[0]);
                setMaxPrice(values[1]);
              }}
              className="w-full mt-2"
              thumbClassName="h-4 w-4 bg-black rounded-full cursor-pointer"
              trackClassName="h-2 rounded bg-gray-300"
              pearling
              minDistance={10}
            />
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Colors</h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                "purple-500",
                "black",
                "red-500",
                "orange-500",
                "blue-500",
                "green-500",
                "yellow-500",
                "gray-500",
                "pink-500",
                "white",
              ].map((color) => (
                <div
                  key={color}
                  className={`w-6 h-6 bg-${color} rounded-full`}
                ></div>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Size</h3>
            <div className="grid grid-cols-3 gap-2">
              {["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"].map(
                (size) => (
                  <button
                    key={size}
                    className="border border-gray-300 rounded-lg py-1"
                  >
                    {size}
                  </button>
                )
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Dress Style</h3>
            <ul>
              {[
                "Classic",
                "Casual",
                "Business",
                "Sport",
                "Elegant",
                "Formal (evening)",
              ].map((style) => (
                <li key={style} className="mb-2">
                  <a className="text-gray-700" href="#">
                    {style}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4 p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Explore Collections</h1>
            <div>
              {error && (
                <p className="text-red-500 text-center my-4">{error}</p>
              )}
              <select onChange={(e) => setSortBy(e.target.value)}>
                <option value="">Sort By</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="nameAsc">A-Z</option>
                <option value="nameDesc">Z-A</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <ProductListShimmer />
            ) : (
              products.map((product) => (
                <div
                  key={product.name}
                  onClick={() => handleProductView(product)}
                  className="bg-white cursor-pointer rounded-lg shadow-md p-4"
                >
                  <img
                    src={product.productImages[0]}
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">
                      {product.title}
                    </h2>
                    <button className="text-gray-400">
                      <i className="far fa-heart"></i>
                    </button>
                  </div>
                  <p className="text-lg font-bold">{product.name}</p>
                  <p className="text-gray-500 mb-2">{product.brand}</p>
                  <p className="text-lg font-bold">
                    {product.discount_price}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Fixed Pagination UI at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow">
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
              }
            }}
            disabled={currentPage <= 1}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
              }
            }}
            disabled={currentPage >= totalPages}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};



const ProductListShimmer = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Image placeholder */}
      <div className="w-full h-48 bg-gray-300 rounded-lg mb-4 animate-pulse"></div>
      {/* Title and heart icon row placeholder */}
      <div className="flex justify-between items-center mb-2">
        <div className="h-6 w-1/2 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-6 w-6 bg-gray-300 rounded-full animate-pulse"></div>
      </div>
      {/* Brand placeholder */}
      <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
      {/* Price placeholder */}
      <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
    </div>
  );
};

export default ListProducts;
