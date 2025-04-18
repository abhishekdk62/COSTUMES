import React, { use, useDebugValue, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import ReactImageMagnify from "react-image-magnify";
import { Star } from "lucide-react";
import { useSelector } from "react-redux";
import AlertDialog from "./Popup";

const ProductDetails = () => {
  const [productDetails, setProductDetails] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Description");
  const [userInfo, setUserInfo] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState();
  const [catDetails, setCatDetails] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [stockMessage, setStockMessage] = useState("");
  const [stockMessageColor, setStockMessageColor] = useState("");
  const [loading, setLoding] = useState(false);
  // State for the selected variant (if needed)
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [reviews, setReviews] = useState([
    { id: 1, name: "John Doe", rating: 4, text: "Great product!" },
  ]);
  const [newReview, setNewReview] = useState({ rating: 5, text: "" });

  const navigate = useNavigate();

  const { id } = useParams();

  const prodById = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/admin/getproduct/${id}`
      );
      setProductDetails(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      prodById(id);
    }
  }, [id]);

  const fetchReviews = async () => {
    try {
      const response = await axios.post("http://localhost:5000/user/reviews", {
        productId: productDetails._id,
      });
      setReviews(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = useSelector((state) => state.auth.userId);

  const handleAddReview = async () => {
    if (productDetails && userId) {
      try {
        if (!newReview.text || !newReview.rating) {
          alert("Please enter Rating and the details");
          return;
        }

        const response = await axios.post("http://localhost:5000/user/review", {
          newReview,
          productId: productDetails?._id,
          userId: userId,
        });
        if (response.status == 200) {
          alert("Review Added");
        }
        fetchReviews();
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    if (!productDetails?.category) return; // Prevents the request when _id is missing
    const getCatName = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/user/getcategoryname",
          {
            id: productDetails?.category,
          }
        );
        setCatDetails(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getCatName();
  }, [productDetails]);

  useEffect(() => {
    if (productDetails && productDetails._id) {
      fetchReviews();
    }
  }, [productDetails]);

  const handleProductView = (product) => {
    prodById(product._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (!productDetails) return; // Wait until productDetails is available

    setLoding(true);

    // Retrieve user info as before
    const user = localStorage.getItem("user");
    const parsedUser = JSON.parse(user);
    setUserInfo(parsedUser);

    // Fetch similar products based on the product's category
    const getSimilarProducts = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/user/getsimilarproducts",
          {
            categoryId: productDetails.category._id,
          }
        );
        setSimilarProducts(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoding(false);
      }
    };

    getSimilarProducts();
  }, [productDetails]);

  const [rating, setRating] = useState([
    { _id: 0, averageRating: 0, totalReviews: 0 },
  ]);

  useEffect(() => {
    const getRating = async () => {
      try {
        const response = await axios.post("http://localhost:5000/user/rating", {
          id: productDetails._id,
        });
        setRating(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (productDetails) {
      getRating();
    }
  }, []);

  useEffect(() => {
    if (productDetails) {
      const stockNumber = selectedVariant?.stock;

      if (stockNumber === 0) {
        // Check for 0 first
        setStockMessage("Out of Stock");
        setStockMessageColor("red");
      } else if (stockNumber < 5) {
        setStockMessage("Only a few left, hurry up!");
        setStockMessageColor("orange");
      } else {
        setStockMessage("In Stock");
        setStockMessageColor("green");
      }
    }
  }, [productDetails, selectedVariant]); // Add dependency array

  const variantsByColor = useMemo(() => {
    return (
      productDetails?.variants.reduce((acc, variant) => {
        if (!acc[variant.color]) {
          acc[variant.color] = [];
        }
        acc[variant.color].push(variant);
        return acc;
      }, {}) || {}
    );
  }, [productDetails]);

  // Once productDetails and variantsByColor are available, set the initial selected color.
  useEffect(() => {
    if (productDetails && Object.keys(variantsByColor).length > 0) {
      const initialColor = Object.keys(variantsByColor)[0];
      setSelectedColor(initialColor);
      const uniqueSizes = [
        ...new Set(variantsByColor[initialColor].map((v) => v.size)),
      ];
      if (uniqueSizes.length > 0) {
        setSelectedSize(uniqueSizes[0]);
      }
    }
  }, [productDetails, variantsByColor]);
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmitReview = () => {
    if (isAuthenticated) {
      handleAddReview();
    } else {
      setShowAlert(true);
    }
  };

  useEffect(() => {
    if (selectedColor && selectedSize && variantsByColor[selectedColor]) {
      const variant = variantsByColor[selectedColor].find(
        (v) => v.size === selectedSize
      );
      setSelectedVariant(variant);
    }
  }, [selectedColor, selectedSize, variantsByColor]);

  if (!productDetails) {
    return <div>Loading...</div>;
  }
  // Return a loading state until productDetails is available
  if (!productDetails) {
    return <ProductDetailShimmer />;
  }

  const stockColors = {
    green: "text-green-500",
    orange: "text-orange-500",
    red: "text-red-500",
  };
  const rat =
    rating.length > 0 && rating[0]?.averageRating
      ? rating[0].averageRating.toFixed(1)
      : "N/A";

  const handleCrumbsByCat = () => {
    navigate(`/products?category=${encodeURIComponent(catDetails._id)}`);
  };

  return (
    <div className="container mx-auto p-4">
      <nav className="text-gray-600 text-sm mb-4">
        <a
          onClick={() => navigate("/products")}
          className="cursor-pointer hover:underline"
        >
          Shop
        </a>
        &gt;
        <a
          onClick={handleCrumbsByCat}
          className="cursor-pointer hover:underline"
        >
          {catDetails?.name}
        </a>
        &gt;
        <a className="cursor-pointer hover:underline">
          {productDetails?.subCategory}
        </a>
      </nav>
      {/* Product Section */}
      <div className="flex flex-col lg:flex-row bg-white p-6 rounded-lg shadow-md">
        {/* Product Images */}
        <div className="flex flex-col gap-3 items-center lg:w-1/2">
          <div className="h-100 w-95 relative">
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: "Main product image",
                  height: 400,
                  width: 280,

                  src:
                    selectedImage ||
                    productDetails?.variants[0]?.productImages[0],
                },
                largeImage: {
                  src:
                    selectedImage ||
                    productDetails?.variants[0]?.productImages[0],
                  width: 1200, // Higher resolution for zoomed view
                  height: 1200,
                },
                enlargedImageContainerDimensions: {
                  width: "270%",
                  height: "150%",
                },
                lensStyle: { backgroundColor: "rgba(0,0,0,0.2)" },
              }}
            />
          </div>{" "}
          <div className="flex gap-5">
            {selectedVariant?.productImages?.map((productImage, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(productImage)}
                className="flex"
              >
                <img
                  alt="Thumbnail 1"
                  className="w-20 rounded-lg"
                  height="100"
                  src={productImage}
                  width="100"
                />
              </div>
            ))}
          </div>
        </div>
        {/* Product Details */}
        <div className="lg:w-1/2 lg:pl-8">
          <h1 className="text-2xl font-bold mb-2">{productDetails?.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => {
                if (i < Math.floor(rat)) {
                  return <i key={i} className="fas fa-star"></i>; // Full star
                } else if (i === Math.floor(rat) && rat % 1 !== 0) {
                  return <i key={i} className="fas fa-star-half-alt"></i>; // Half star
                } else {
                  return <i key={i} className="far fa-star"></i>; // Empty star
                }
              })}
            </div>

            <span className="ml-2 text-gray-600"> {rat}</span>
            <span className="ml-2 text-gray-600">
              {rating[0]?.totalReviews} Reviews
            </span>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Select Size</h2>
            <div className="flex space-x-2">
              {selectedColor && (
                <div className="mb-4">
                  <div className="flex space-x-2">
                    {[
                      ...new Set(
                        variantsByColor[selectedColor]?.map((v) => v.size)
                      ),
                    ].map((size, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedSize(size);
                        }}
                        className={`px-4 py-2 border rounded-lg ${
                          selectedSize === size
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-600"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Colours Available</h2>
            <div className="flex space-x-2">
              {Object.keys(variantsByColor).map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColor(color);
                    const defaultImage =
                      variantsByColor[color][0]?.productImages[0];
                    setSelectedImage(defaultImage);

                    const uniqueSizes = [
                      ...new Set(variantsByColor[color].map((v) => v.size)),
                    ];
                    if (uniqueSizes.length > 0) {
                      setSelectedSize(uniqueSizes[0]);
                    }
                  }}
                  className={`w-8 cursor-pointer h-8 rounded-full border border-gray-300 ${
                    selectedColor === color ? "ring-2 ring-purple-600" : ""
                  }`}
                  style={{ backgroundColor: color }}
                ></button>
              ))}
            </div>
          </div>
          <div className="flex items-center mb-4">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg mr-4">
              Add to cart
            </button>
            <div className="flex gap-3">
              <span className="text-2xl font-bold">
                ${selectedVariant?.discount_price}
              </span>
              <span className="text-2xl text-red-500 line-through font-bold ml-2">
                ${selectedVariant?.base_price}
              </span>
            </div>
          </div>
          <h1 className={`font-bold text-xl ${stockColors[stockMessageColor]}`}>
            {stockMessage}
          </h1>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <i className="fas fa-shield-alt text-gray-600 mr-2"></i>
              <span className="text-gray-600">Secure payment</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-ruler-combined text-gray-600 mr-2"></i>
              <span className="text-gray-600">Size &amp; Fit</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-truck text-gray-600 mr-2"></i>
              <span className="text-gray-600">Free shipping</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-undo text-gray-600 mr-2"></i>
              <span className="text-gray-600">Free Shipping &amp; Returns</span>
            </div>
          </div>
        </div>
      </div>
      {/* Product Description */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-bold mb-4">Product Description</h2>
        <div className="flex space-x-4 mb-4">
          {["Description", "Reviews", "Question&Answer"].map((tab, indx) => (
            <button
              key={indx}
              onClick={() => setSelectedTab(tab)}
              className={`pb-2  ${
                tab === selectedTab
                  ? "text-purple-600 border-purple-600 border-b-2"
                  : "text-gray-600 border-gray-600"
              }`}
            >
              {tab} {/* ✅ Move this inside the button */}
            </button>
          ))}
        </div>
        {selectedTab == "Description" && (
          <p className="text-gray-600 mb-4">{productDetails.description}</p>
        )}
        {selectedTab == "Reviews" && (
          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>

            {/* Existing Reviews */}
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex items-start space-x-4 mb-4 p-4 border rounded"
              >
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>{" "}
                {/* Profile Placeholder */}
                <div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < review.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mt-1">{review.comment}</p>
                  <div className="flex justify-between">
                    <p className="text-gray-600 mt-1 text-xs">
                      {review.userId.email}
                    </p>

                    <p className="text-gray-600 mt-1 text-xs">
                      {review.updatedAt.split("T")[0]}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Review */}
            <div className="mt-6 p-4 border rounded">
              <h3 className="text-lg font-semibold mb-2">Add a Review</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>{" "}
                {/* Profile Placeholder */}
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        setNewReview({ ...newReview, rating: i + 1 })
                      }
                    >
                      <Star
                        size={20}
                        className={
                          i < newReview.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                className="w-full mt-2 p-2 border rounded"
                placeholder="Write your review..."
                value={newReview.text}
                onChange={(e) =>
                  setNewReview({ ...newReview, text: e.target.value })
                }
              ></textarea>
              <button
                className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                onClick={handleSubmitReview}
              >
                Submit Review
              </button>

              {/* Conditionally render the AlertDialog when showAlert is true */}
              {showAlert && (
                <AlertDialog
                  title="Notification"
                  message="Please login to continue"
                  onClose={() => setShowAlert(false)}
                />
              )}
            </div>
          </div>
        )}
        {selectedTab == "Question&Answer" && (
          <p className="text-gray-600 mb-4">QA</p>
        )}
        <table className="w-full text-left text-gray-600">
          <tbody>
            <tr>
              <th className="py-2">Fabric</th>
              <td className="py-2">Bio-washed Cotton</td>
              <th className="py-2">Pattern</th>
              <td className="py-2">Printed</td>
              <th className="py-2">Fit</th>
              <td className="py-2">Regular-fit</td>
            </tr>
            <tr>
              <th className="py-2">Neck</th>
              <td className="py-2">Round Neck</td>
              <th className="py-2">Sleeve</th>
              <td className="py-2">Half-sleeves</td>
              <th className="py-2">Style</th>
              <td className="py-2">Casual Wear</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Similar Products */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-bold mb-4">Similar Products</h2>
        {loading ? (
          <SimilarProductsShimmer />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similarProducts.map((product, index) => (
              <div
                key={index}
                onClick={() => handleProductView(product)}
                className="bg-white p-4 rounded-lg shadow-md"
              >
                <img
                  alt={product?.name}
                  className="w-full rounded-lg mb-4"
                  height="400"
                  src={product?.variants[0]?.productImages[0]}
                  width="300"
                />
                <h3 className="text-lg font-semibold">{product?.name}</h3>
                <p className="text-gray-600">{product?.brand}</p>
                <p className="text-lg font-bold">
                  ${product?.variants[0]?.discount_price}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;

const ProductDetailShimmer = () => {
  return (
    <div className="container mx-auto p-4">
      {/* Breadcrumb */}
      <nav className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
      </nav>
      <div className="flex flex-col lg:flex-row bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col items-center lg:w-1/2">
          <div className="w-full h-64 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
          <div className="flex space-x-2">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"
                ></div>
              ))}
          </div>
        </div>
        {/* Product Details */}
        <div className="lg:w-1/2 lg:pl-8">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
          <div className="flex items-center mb-4 space-x-2">
            <div className="flex space-x-1">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"
                  ></div>
                ))}
            </div>
            <div className="h-4 bg-gray-200 rounded w-10 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
          <div className="mb-4">
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
            <div className="flex space-x-2">
              {["XS", "S", "M", "L", "XL"].map((_, index) => (
                <div
                  key={index}
                  className="h-8 w-8 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
            <div className="flex space-x-2">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"
                  ></div>
                ))}
            </div>
          </div>
          <div className="flex items-center mb-4">
            <div className="bg-gray-200 rounded px-6 py-2 mr-4 animate-pulse w-32"></div>
            <div className="flex flex-col space-y-2">
              <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            {[
              "Secure payment",
              "Size & Fit",
              "Free shipping",
              "Free Shipping & Returns",
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse mr-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Product Description */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="flex space-x-4 mb-4">
          {["Description", "Reviews", "Question & Answer"].map((tab, index) => (
            <div
              key={index}
              className="h-4 bg-gray-200 rounded w-20 animate-pulse"
            ></div>
          ))}
        </div>
        <div className="h-20 bg-gray-200 rounded mb-4 animate-pulse"></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <tbody>
              <tr>
                <td className="py-2">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </td>
                <td className="py-2">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </td>
                <td className="py-2">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </td>
                <td className="py-2">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </td>
                <td className="py-2">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </td>
                <td className="py-2">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </td>
              </tr>
              <tr>
                <td className="py-2">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </td>
                <td className="py-2">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </td>
                <td className="py-2">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </td>
                <td className="py-2">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </td>
                <td className="py-2">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </td>
                <td className="py-2">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SimilarProductsShimmer = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      {/* Shimmer for section title */}
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              {/* Shimmer for product image */}
              <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
              {/* Shimmer for product title */}
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
              {/* Shimmer for product brand */}
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
              {/* Shimmer for product price */}
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            </div>
          ))}
      </div>
    </div>
  );
};
