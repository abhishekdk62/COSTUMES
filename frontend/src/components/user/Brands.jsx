import React from "react";

const Brands = () => {
  return (
    <div className="bg-gray-800 text-white rounded-lg p-8 w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-2">Top Brands Deal</h2>
      <p className="text-center text-gray-300 mb-6">
        Up To <span className="text-yellow-400 font-bold">60%</span> off on brands
      </p>
      <div className="flex justify-center space-x-4">
        <div className="bg-white cursor-pointer p-4 rounded-lg">
          <img
            src="https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png"
            alt="Nike logo"
            className="h-12 w-24 object-contain"
          />
        </div>
        <div className="bg-white p-4 cursor-pointer rounded-lg"> <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg" alt="H&M logo" className="h-12 w-24 object-contain" /> </div>
        <div className="bg-white p-4 cursor-pointer rounded-lg">
          <img
            src="https://www.svgrepo.com/show/303398/levis-logo.svg"
            alt="Levi's logo"
            className="h-12 w-24 object-cover"
          />
        </div>
        <div className="bg-white p-4 cursor-pointer rounded-lg">
          <img
            src="https://assets.simon.com/tenantlogos/16392.png"
            alt="U.S. Polo Assn. logo"
            className="h-12 w-24 object-cover"
          />
        </div>
        <div className="bg-white p-4 cursor-pointer rounded-lg">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/d/da/Puma_complete_logo.svg"
            alt="Puma logo"
            className="h-12 w-24 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Brands;