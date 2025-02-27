import React from "react";

const Promotions = () => {
  return (
    <div>
      <section className="container mx-auto px-4 py-8">
        <div className="flex space-x-4">
          <div className="w-1/2 bg-yellow-400 text-white p-8 rounded-lg">
            <h3 className="text-sm">Low Price</h3>
            <h2 className="text-2xl font-bold">High Coziness</h2>
            <p className="mt-2">UPTO 50% OFF</p>
            <button className="mt-4 bg-white text-black px-4 py-2 rounded-full">
              Explore Items
            </button>
          </div>
          <div className="w-1/2 bg-purple-600 text-white p-8 rounded-lg">
            <h3 className="text-sm">Beyoung Presents</h3>
            <h2 className="text-2xl font-bold">Breezy Summer Style</h2>
            <p className="mt-2">UPTO 50% OFF</p>
            <button className="mt-4 bg-white text-black px-4 py-2 rounded-full">
              Explore Items
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Promotions;
