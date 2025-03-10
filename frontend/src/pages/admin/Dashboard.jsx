import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar"; // Import your custom Sidebar
import Pagination from "../../components/common/Pagination";
import Header from "../../components/common/Header";
import Category from "../../components/admin/CategoryList";
import Customer from "../../components/admin/UserList";
import Products from "../../components/admin/Products";
import Coupons from "../../components/admin/Coupons";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(localStorage.getItem("activeTab"));
  useEffect(()=>{
    localStorage.setItem("activeTab",activeTab)

  },[activeTab])
  const[selectedTab,setSelectedTab]=useState("view")

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1">
          {activeTab === "customer" && <Customer />}
          {activeTab === "category" && <Category />}
          {activeTab === "products" && <Products />}
          {activeTab === "coupon" && <Coupons selectedTab={selectedTab} setSelectedTab={setSelectedTab} />}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
