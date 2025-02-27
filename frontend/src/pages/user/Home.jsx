import React from "react";
import Header from "../../components/common/Header";
import Navbar from "../../components/user/Navbar";
import Hero from "../../components/user/Hero";
import Promotions from "../../components/user/Promotions";
import NewArivals from "../../components/user/NewArivals";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Promotions />
      <NewArivals />
    </div>
  );
};

export default Home;
