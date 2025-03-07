import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Sidebar from "./SidebarMain";
import Header from "./HeaderMain";
import Tabview from "./Tabview";
import  BASE_URL  from "../Config";

const Content1: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const onCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  // New function to handle sidebar item clicks on mobile
  const handleSidebarItemClick = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  };


  const customerId = localStorage.getItem("userId") || "";
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    if (customerId) {
      fetchProfileData();
    }
  }, [customerId]);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user-service/customerProfileDetails`,
        {
          params: { customerId },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = response.data;
      const profileData = {
        userFirstName: data.firstName || '',
        userLastName: data.lastName || '',
        customerEmail: data.email || '',
        alterMobileNumber: data.alterMobileNumber || '',
        customerId: customerId,
        whatsappNumber: data.whatsappNumber || '',
      };
      localStorage.setItem('profileData', JSON.stringify(profileData));
    } catch (error) {
    } finally {
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 bg-white z-30 shadow-sm">
        <Header cartCount={0} IsMobile5={setIsMobileOpen} />
      </div>

      <aside
        className={`fixed left-0 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] 
          transition-all duration-300 bg-white shadow-lg z-20 rounded-lg 
          ${isCollapsed ? "w-[5rem] overflow-visible" : "w-64 overflow-hidden"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          top-16 md:top-20`}
      >
        <div className="h-full scrollbar-hide p-2">
          <Sidebar onCollapse={onCollapse} onItemClick={handleSidebarItemClick} />
        </div>
      </aside>

      <div
        className={`transition-all duration-300
          pt-16 md:pt-20
          ${isCollapsed ? "md:pl-28" : "md:pl-[18rem]"}
          ${isMobileOpen ? "pl-0" : "pl-0"}`}
      >
        <Tabview />
        <main className="min-h-screen p-2 md:p-4 bg-white ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Content1;