import React from 'react';

const CategoryWomen = () => {
  return (
    <div>
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4">Women's Top Picks</h2>
        <div className="flex space-x-4">
          <div className="w-1/4">
            <img
              src="https://placehold.co/200x200"
              alt="Summer Dresses"
              className="w-full h-full object-cover rounded-lg"
            />
            <p className="mt-2 text-center">Summer Dresses</p>
          </div>
          <div className="w-1/4">
            <img
              src="https://placehold.co/200x200"
              alt="Casual Tops"
              className="w-full h-full object-cover rounded-lg"
            />
            <p className="mt-2 text-center">Casual Tops</p>
          </div>
          <div className="w-1/4">
            <img
              src="https://placehold.co/200x200"
              alt="Formal Wear"
              className="w-full h-full object-cover rounded-lg"
            />
            <p className="mt-2 text-center">Formal Wear</p>
          </div>
          <div className="w-1/4">
            <img
              src="https://placehold.co/200x200"
              alt="Winter Coats"
              className="w-full h-full object-cover rounded-lg"
            />
            <p className="mt-2 text-center">Winter Coats</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryWomen;