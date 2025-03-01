import React from "react";
import Header from "../../components/common/Header";
import Navbar from "../../components/user/Navbar";
import Hero from "../../components/user/Hero";
import Promotions from "../../components/user/Promotions";
import NewArivals from "../../components/user/NewArivals";
import Banner from "../../components/user/Banner";
import Footer from "../../components/user/Footer";
import CategoryMen from "../../components/user/CategoryMen";
import CategoryWomen from "../../components/user/CategoryWomen";
import Saving from "../../components/user/Saving";
import Brands from "../../components/user/Brands";
import Trending from "../../components/user/Trending";

const Home = () => {
  return (
    <div> {/* Adds padding to the left and right */}
      <Navbar />
      <Banner />
      <div className="px-6 md:px-12 lg:px-20 space-y-12"> {/* Adds vertical spacing between sections */}
        <NewArivals />
        <Promotions />
        <CategoryMen />
        <Brands />
        <CategoryWomen />
        <Saving />
        <Trending />
      </div>
      <Footer />
    </div>
  );
};


export default Home;
