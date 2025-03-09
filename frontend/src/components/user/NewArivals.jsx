import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CategorySlideShimmer from "./CategorySlideShimmer";
import { useNavigate } from "react-router-dom";

const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleProductView = (product) => {
   navigate(`/product/${product._id}`);
  };
  useEffect(() => { 
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/user/new-arrivals"
        );
        // Adjust based on your response structure
        setNewArrivals(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5, // Adjust the number of slides as needed
    slidesToScroll: 1,
    draggable: true, // Allows mouse dragging
    swipeToSlide: true, // Lets the swipe gesture directly change slides
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
        <div className="flex  mb-8 items-center w-full max-w-6xl">
          <div className="flex-grow border-t-2 border-gray-300"></div>
          <h1
            style={{ fontFamily: "'Cambay', sans-serif" }}
            className="text-2xl mx-6  text-gray-600  whitespace-nowrap"
          >
            New Arrivals
          </h1>
          <div className="flex-grow border-t-2 border-gray-300"></div>
        </div>
      </div>

      {loading ? (
        <CategorySlideShimmer />
      ) : (
        <Slider {...sliderSettings}>
          {newArrivals.map((product) => (
            <div
              onClick={() => handleProductView(product)}
              key={product._id}
              className="p-2 group cursor-pointer"
            >
              <div className="flex items-center justify-center">
                <div className="w-100 h-100">
                  <img
                    src={product.variants[0].productImages?.[0]}
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

export default NewArrivals;
