import React from "react";

const Saving = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-black mb-8">Big Saving Zone</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Hawaiian Shirts */}
        <div className="bg-gray-200 rounded-lg p-4 relative">
          <img
            src="https://placehold.co/400x400"
            alt="Man wearing a Hawaiian shirt with a blue background"
            className="rounded-lg"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
            <h2 className="text-2xl font-bold">Hawaiian Shirts</h2>
            <p className="mt-2">Dress up in summer vibe</p>
            <p className="mt-2 font-bold">UPTO 50% OFF</p>
            <button className="mt-4 px-4 py-2 border border-white rounded-full">SHOP NOW</button>
          </div>
        </div>
        {/* Printed T-Shirt */}
        <div className="bg-gray-200 rounded-lg p-4 relative">
          <img
            src="https://placehold.co/400x400"
            alt="Woman wearing a printed T-shirt with a pink background"
            className="rounded-lg"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
            <div className="bg-gray-800 text-white px-2 py-1 rounded-full mb-2">Limited Stock</div>
            <h2 className="text-2xl font-bold">Printed T-Shirt</h2>
            <p className="mt-2">New Designs Every Week</p>
            <p className="mt-2 font-bold">UPTO 40% OFF</p>
            <button className="mt-4 px-4 py-2 border border-white rounded-full">SHOP NOW</button>
          </div>
        </div>
        {/* Cargo Joggers */}
        <div className="bg-gray-200 rounded-lg p-4 relative">
          <img
            src="https://placehold.co/400x400"
            alt="Woman wearing cargo joggers with a gray background"
            className="rounded-lg"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 text-gray-800">
            <h2 className="text-2xl font-bold">Cargo Joggers</h2>
            <p className="mt-2">Move with style & comfort</p>
            <p className="mt-2 font-bold">UPTO 50% OFF</p>
            <button className="mt-4 px-4 py-2 border border-gray-800 rounded-full">SHOP NOW</button>
          </div>
        </div>
      </div>

      {/* Last Row - Two Full Width Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Urban Shirts */}
        <div className="bg-gray-300 rounded-lg p-4 relative">
          <img
            src="https://placehold.co/400x400"
            alt="Man wearing an urban shirt with a gray background"
            className="rounded-lg"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 text-gray-800">
            <h2 className="text-2xl font-bold">Urban Shirts</h2>
            <p className="mt-2">Live In Comfort</p>
            <p className="mt-2 font-bold">FLAT 60% OFF</p>
            <button className="mt-4 px-4 py-2 border border-gray-800 rounded-full">SHOP NOW</button>
          </div>
        </div>
        {/* Oversized T-Shirts */}
        <div className="bg-gray-200 rounded-lg p-4 relative">
          <img
            src="https://placehold.co/400x400"
            alt="Man wearing an oversized T-shirt with a blue background"
            className="rounded-lg"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 text-gray-800">
            <h2 className="text-2xl font-bold">Oversized T-Shirts</h2>
            <p className="mt-2">Street Style Icon</p>
            <p className="mt-2 font-bold">FLAT 60% OFF</p>
            <button className="mt-4 px-4 py-2 border border-gray-800 rounded-full">SHOP NOW</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Saving;
