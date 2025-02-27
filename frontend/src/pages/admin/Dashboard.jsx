import React, { useState } from "react";
import Sidebar from "../../components/admin/Sidebar"; // Import your custom Sidebar
import Pagination from "../../components/common/Pagination";
import Customer from "../../components/admin/Customer";
import Header from "../../components/common/Header";
import CategoryList from "../../components/admin/CategoryList";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1">
          {activeTab === "customer" && <Customer />}
          {activeTab === "category" && <CategoryList />}
          <Pagination />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
