import React, { useState } from "react";
import Sidebar1 from "./Sidebar1";
import Footer from "./Footer";
import MainSection from "./MainSection";
import { Outlet } from "react-router-dom";
import Header1 from "./Header1";

const Normal = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mainContent, setMainContent] = useState(
    "This is the main content area."
  );

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSidebarSelect = (content) => {
    setMainContent(content);
    setIsSidebarOpen(false); // Close the sidebar on mobile after selecting
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50">
        <Header1 toggleSidebar={toggleSidebar} />
      </header>
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden pt-16">
        {" "}
        {/* Add padding-top to prevent content overlap with fixed header */}
        {/* Sidebar */}
        <Sidebar1
          isOpen={isSidebarOpen}
          onSelect={handleSidebarSelect}
          toggleSidebar={toggleSidebar}
        />
        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="inset-0 bg-black bg-opacity-50 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
        {/* Main Section */}
        <div className="flex-1 overflow-y-auto p-2 ">
          <MainSection content={<Outlet />} />
        </div>
      </div>

      {/* <footer className="text-white fixed  bottom-0 left-0 w-full z-50  text-center">
        <Footer />
      </footer> */}
    </div>
  );
};

export default Normal;
