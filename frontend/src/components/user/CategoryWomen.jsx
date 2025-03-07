import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CategorySlideShimmer from "./CategorySlideShimmer";
import { useNavigate } from "react-router-dom";

const CategoryWomen = () => {
  const [women, setWomen] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleProductView = (product) => {
    localStorage.setItem("productInfo", JSON.stringify(product));
    navigate("/product");
  };

  useEffect(() => {
    const fetchWomenProducts = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/user/categoryWiseProducs",
          { catName: "Women" }
        );
        setWomen(response.data.data || []);
      } catch (error) {
        console.error("Error fetching Women products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWomenProducts();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5, // Same as NewArrivals
    slidesToScroll: 1,
    draggable: true,      // Enables mouse/touch dragging
    swipeToSlide: true,   // Allows swiping directly to a slide
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          draggable: true,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          draggable: true,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          draggable: true,
          swipeToSlide: true,
        },
      },
    ],
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center my-4">
        <div className="flex mb-8 items-center w-full max-w-6xl">
          <div className="flex-grow border-t-2 border-gray-300"></div>
          <h1
            style={{ fontFamily: "'Cambay', sans-serif" }}
            className="text-2xl mx-6 text-gray-600 whitespace-nowrap"
          >
            Women Top Picks
          </h1>
          <div className="flex-grow border-t-2 border-gray-300"></div>
        </div>
      </div>

      {loading ? (
        <CategorySlideShimmer />
      ) : (

        
        <Slider {...sliderSettings}>
          {women.map((product) => (
            <div
              onClick={() => handleProductView(product)}
              key={product._id}
              className="p-2 group cursor-pointer"
            >
              <div className="flex items-center justify-center">
                <div className="w-100 h-100">
                  <img
                    src={product.productImages?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover  transition duration-300 ease-in-out group-hover:brightness-75"
                  />
                </div>
              </div>
              <p
                style={{ fontFamily: "'Cambay', sans-serif" }}
                className="mt-2 text-center text-gray-700 text-xl"
              >
                {product.name}
              </p>
            </div>
          ))}
        </Slider>
      )}
    </section>
  );
};

export default CategoryWomen;
