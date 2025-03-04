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
  const navigate=useNavigate()

  const handleProductView = (product) => {
    localStorage.setItem("productInfo", JSON.stringify(product));
    navigate("/product")
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
    slidesToShow: 6, // Adjust the number of slides to show as needed
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-xl font-bold mb-4">New Arrivals</h2>
      {loading ? (
        <CategorySlideShimmer />
      ) : (
        <Slider {...sliderSettings}>
          {newArrivals.map((product) => (
            <div onClick={()=>handleProductView(product)} key={product._id} className="p-2">
              <img
                src={product.productImages[0]} // assuming the first image is the one to display
                alt={product.name}
                className="w-[137px] h-[205px] object-cover rounded-lg"
              />
              <p className="mt-2 text-center">{product.name}</p>
            </div>
          ))}
        </Slider>
      )}
    </section>
  );
};

export default NewArrivals;
