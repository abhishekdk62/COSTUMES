import React from "react";
import ListProducts from "../../components/user/ListProducts";
import Header from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";

const ProductsView = () => {
  return (
    <div>
      <Header />
      <div className="px-6 md:px-12 lg:px-20 space-y-12">
        <ListProducts />
      </div>
      <Footer />
    </div>
  );
};

export default ProductsView;
