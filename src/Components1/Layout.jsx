import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Swal from "sweetalert2";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import MainSection from "./MainSection";
import Header from "./Header";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("user") || "{}");

  //   if (!user?.profileCompleted) {
  //     Swal.fire({
  //       title: "Complete Your Profile",
  //       text: "Please fill your profile details before proceeding!",
  //       icon: "warning",
  //       confirmButtonText: "Go to Profile",
  //       allowOutsideClick: false,
  //     }).then(() => {
  //       navigate("/dashboard/user-profile"); // Redirect to profile page
  //     });
  //   }
  // }, [navigate]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50">
        <Header toggleSidebar={toggleSidebar} />
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden pt-[80px]">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="inset-0 bg-black bg-opacity-50 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Section */}
        <div className="flex-1 overflow-y-auto">
          <MainSection content={<Outlet />} />
        </div>
      </div>

      {/* <footer className="text-white fixed bottom-0 left-0 w-full z-50 text-center">
        <Footer />
      </footer> */}
    </div>
  );
};

export default Layout;
