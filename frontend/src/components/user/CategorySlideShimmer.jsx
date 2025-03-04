import React from "react";

const CategorySlideShimmer = () => {
  return (
  <>
    <div className="p-2">
      {/* Shimmer for the image */}
  <div className="flex gap-15">
    {[...Array(8)].map((_,indx)=>(
  <div key={indx} className="w-[137px] h-[205px] bg-gray-300 rounded-lg animate-pulse"></div>

    ))}
  </div>
      {/* Shimmer for the product name */}
      <div className="mt-2 h-4 bg-gray-300 rounded animate-pulse"></div>
    </div>
    
    
    </>
  );
};

export default CategorySlideShimmer;
