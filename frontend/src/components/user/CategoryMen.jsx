import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CategorySlideShimmer from "./CategorySlideShimmer";
import { useNavigate } from "react-router-dom";


const CategoryMen = () => {
  const [mens, setMens] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate()
  const handleProductView = (product) => {
    localStorage.setItem("productInfo", JSON.stringify(product));
    navigate("/product")
  };
  
  useEffect(() => {
    (async () => { // IIFE to call async inside useEffect
      try {
        const response = await axios.post(
          "http://localhost:5000/user/categoryWiseProducs",
          { catName: "Men" }
        );
        setMens(response.data.data || []); // Ensure it's an array
      } catch (error) {
        console.error("Error fetching Mens only collections:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-xl font-bold mb-4">Mens Top Picks</h2>
      {loading ? (
        <CategorySlideShimmer />
      ) : (
        <Slider {...sliderSettings}>
          {mens.length > 0 ? (
            mens.map((product) => (
              <div
              onClick={() => handleProductView(product)}
              key={product._id}
              className=" p-2"
            >
              <div className="flex items-center justify-center">
              <img
                src={product.productImages?.[0]} // Optional chaining to avoid errors
                alt={product.name}
                className="w-[137px] h-[205px] object-cover rounded-lg"
              />
              </div>
              <p className="mt-2 text-center">{product.name}</p>
            </div>
            ))
          ) : (
            <p>No products available</p>
          )}
        </Slider>
      )}
    </section>
  );
};

export default CategoryMen;
