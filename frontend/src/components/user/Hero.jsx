import React from "react";

const Hero = () => {
  return (
    <section className="relative bg-blue-500 text-white">
      <div className="container mx-auto px-4 py-16 flex items-center">
        <div className="w-1/2">
          <h2 className="text-lg">T-Shirt / Tops</h2>
          <h1 className="text-4xl font-bold">Summer Value Pack</h1>
          <p className="mt-2">cool / colorful / comfy</p>
          <button className="mt-4 bg-white text-black px-6 py-2 rounded-full">
            Shop Now
          </button>
        </div>
        <div className="w-1/2">
          <img
            src="https://placehold.co/400x600"
            alt="Woman holding shopping bags"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <div className="w-2 h-2 bg-white rounded-full"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
      </div>
    </section>
  );
};

export default Hero;
