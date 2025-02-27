import React from "react";

const Pagination = () => {
  return (
    <div>
      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center space-x-2">
          <span>Show result:</span>
          <select className="border p-2 rounded-md">
            <option>2</option>
            <option>5</option>
            <option>10</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <i className="fas fa-chevron-left text-gray-600 cursor-pointer"></i>
          <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
            1
          </span>
          <span className="bg-purple-600 text-white px-3 py-1 rounded-full">
            2
          </span>
          <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
            3
          </span>
          <span className="text-gray-600">...</span>
          <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
            20
          </span>
          <i className="fas fa-chevron-right text-gray-600 cursor-pointer"></i>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
