import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactSlider from "react-slider";
import { ChevronLeft, Star, ChevronRight } from "lucide-react";

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
  const [ratings, setRatings] = useState([]);

  // Fetch products from backend with pagination
  const getProducts = async () => {
    try { 
      setLoading(true);
      const params = new URLSearchParams(location.search);
      const categoryFromURL = params.get("category");

      const requestBody = {
        searchTerm, // from redux
        category: categoryFromURL || selectedCategory,
        minPrice,
        maxPrice,
        sortBy,
        page: currentPage,
        limit: 10,
      };

      const response = await axios.post(
        "http://localhost:5000/user/products",
        requestBody
      );    // Expected response format: { products, page, totalPages }
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

  useEffect(() => {
    const getRatings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user/ratings");
        setRatings(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getRatings();
  }, []);
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
    navigate(`/product/${product._id}`);

  };

  return (
    <div className="container mx-auto p-4 pb-20">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 p-6 bg-white rounded-lg shadow-md sticky top-4 h-fit">
          <h2 className="text-xl font-bold mb-6 border-b pb-3">Filters</h2>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Categories</h3>
            <ul className="space-y-2">
              {categoryList.map((category, indx) => (
                <li
                  key={indx}
                  onClick={() => setSelectedCategory(category._id)}
                  className={`py-1.5 px-2 rounded-md cursor-pointer transition-colors hover:bg-gray-100 ${
                    category._id === selectedCategory
                      ? "bg-gray-100 font-medium"
                      : ""
                  }`}
                >
                  <span className="text-gray-700">{category.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Price Range</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">${minPrice}</span>
              <span className="font-medium">${maxPrice}</span>
            </div>
            <ReactSlider
              value={[minPrice, maxPrice]}
              min={200}
              step={1000}
              max={50000}
              onChange={(values) => {
                setMinPrice(values[0]);
                setMaxPrice(values[1]);
              }}
              className="w-full mt-2"
              thumbClassName="h-5 w-5 bg-gray-400 border-2 border-white shadow-md rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
              trackClassName="h-2 rounded-full bg-gray-400"
              pearling
              minDistance={10}
            />
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Colors</h3>
            <div className="grid grid-cols-5 gap-3">
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
                  className={`w-7 h-7 bg-${color} rounded-full cursor-pointer border border-gray-200 hover:scale-110 transition-transform shadow-sm`}
                ></div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Size</h3>
            <div className="grid grid-cols-3 gap-2">
              {["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"].map(
                (size) => (
                  <button
                    key={size}
                    className="border border-gray-300 rounded-lg py-1.5 hover:bg-gray-100 transition-colors font-medium"
                  >
                    {size}
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Dress Style</h3>
            <ul className="space-y-2">
              {[
                "Classic",
                "Casual",
                "Business",
                "Sport",
                "Elegant",
                "Formal (evening)",
              ].map((style) => (
                <li
                  key={style}
                  className="py-1.5 px-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <a className="text-gray-700 block w-full" href="#">
                    {style}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl ">Explore Collections</h1>
            <div className="flex items-center gap-4">
              {error && (
                <p className="text-red-500 text-sm font-medium">{error}</p>
              )}
              <select
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg py-2 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
              >
                <option value="">Sort By</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="nameAsc">A-Z</option>
                <option value="nameDesc">Z-A</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <ProductListShimmer />
            ) : (
              products.map((product) => {
                const ratingData = ratings.find(
                  (rating) => rating._id === product._id
                );
                const averageRating = ratingData
                  ? ratingData.averageRating.toFixed(1)
                  : "";
                const ratingDisplay = ratingData ? (
                  <div className="bg-[#0b5c10] space-x-2 text-white px-2 py-0.5 rounded flex justify-center content-center items-center">
                    <span className="text-xs  mr-1">{averageRating}</span>
                    <Star className="h-2 w-2 fill-white stroke-white" />
                  </div>
                ) : null;

                return (
                  <div key={product._id}>
                    <div
                      onClick={() => handleProductView(product)}
                      className="p-0 group cursor-pointer"
                    >
                      <div className="flex items-center justify-center">
                        <div className="w-100 h-100">
                          <div className="absolute ml-60 mt-2">
                            {ratingDisplay}
                          </div>
                          <img
                            src={product.variants[0].productImages?.[0]}
                            alt={product.name}
                            className="w-full h-full object-cover  transition duration-300 ease-in-out group-hover:brightness-75"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col mt-2 items-center">
                      <p
                        style={{ fontFamily: "'Cambay', sans-serif" }}
                        className="text-center text-gray-700 text-s"
                      >
                        {product.name} - {product.brand}
                      </p>
                      <div className="flex items-center justify-center space-x-2 mt-0">
                        <div className="text-black font-medium text-s">
                          Rs.{product.variants[0].discount_price}.00
                        </div>
                        <div className="text-gray-700 text-s line-through">
                          Rs.{product.variants[0].base_price}.00
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Fixed Pagination UI at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white shadow-md border-t border-gray-200 z-10">
        <div className="flex justify-center items-center space-x-4 max-w-xs mx-auto">
          <button
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
              }
            }}
            disabled={currentPage <= 1}
            className="h-10 w-10 flex items-center justify-center rounded-md bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 transition-colors"
            aria-label="Previous page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
            className="h-10 w-10 flex items-center justify-center rounded-md bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 transition-colors"
            aria-label="Next page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
