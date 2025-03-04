import React from "react";
import ProductDetails from "../../components/user/ProductDetails";
import Footer from "../../components/user/Footer";
import Navbar from "../../components/user/Navbar";

const ProductView = () => {
  return (
    <div>
      <Navbar />
      <div className="px-6 md:px-12 lg:px-20 space-y-12">
        <ProductDetails />
      </div>
      <Footer />
    </div>
  );
};

export default ProductView;
