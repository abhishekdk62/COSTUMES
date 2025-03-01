import React from 'react';

const Trending = () => {
  return (
    <div>
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4">Trending Now</h2>
        <div className="flex space-x-4">
          <div className="w-1/4">
            <img
              src="https://placehold.co/200x200"
              alt="Trendy Sneakers"
              className="w-full h-full object-cover rounded-lg"
            />
            <p className="mt-2 text-center">Trendy Sneakers</p>
          </div>
          <div className="w-1/4">
            <img
              src="https://placehold.co/200x200"
              alt="Chic Handbags"
              className="w-full h-full object-cover rounded-lg"
            />
            <p className="mt-2 text-center">Chic Handbags</p>
          </div>
          <div className="w-1/4">
            <img
              src="https://placehold.co/200x200"
              alt="Stylish Jackets"
              className="w-full h-full object-cover rounded-lg"
            />
            <p className="mt-2 text-center">Stylish Jackets</p>
          </div>
          <div className="w-1/4">
            <img
              src="https://placehold.co/200x200"
              alt="Fashionable Sunglasses"
              className="w-full h-full object-cover rounded-lg"
            />
            <p className="mt-2 text-center">Fashionable Sunglasses</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Trending;