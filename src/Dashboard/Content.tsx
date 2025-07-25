import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Sidebar from "./SidebarMain";
import Header from "./HeaderMain";
import Tabview from "./Tabview";
import AIChatWindow from "./AIWindow";
import BASE_URL from "../Config";

const Content1: React.FC = () => {
  // Sidebar starts collapsed by default
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  // AI Chat Window toggle state
  const [isAiChatOpen, setIsAiChatOpen] = useState(true);

  const onCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  const handleSidebarMouseEnter = () => {
    if (window.innerWidth >= 768) { // Only on desktop
      setIsHovering(true);
    }
  };

  const handleSidebarMouseLeave = () => {
    if (window.innerWidth >= 768) { // Only on desktop
      setIsHovering(false);
    }
  };

  const handleSidebarItemClick = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  };

  // Toggle AI Chat Window
  const toggleAiChat = () => {
    setIsAiChatOpen(!isAiChatOpen);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsHovering(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        userFirstName: data.firstName || "",
        userLastName: data.lastName || "",
        customerEmail: data.email || "",
        alterMobileNumber: data.alterMobileNumber || "",
        customerId: customerId,
        whatsappNumber: data.whatsappNumber || "",
      };
      localStorage.setItem("profileData", JSON.stringify(profileData));
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-30 shadow-sm">
        <Header cartCount={0} IsMobile5={setIsMobileOpen} />
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] 
          transition-all duration-300 bg-white shadow-lg z-20 rounded-r-lg
          ${
            isCollapsed && !isHovering
              ? "w-20 overflow-visible"
              : "w-64 overflow-hidden"
          }
          ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0
          top-16 md:top-20`}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
      >
        <div className="h-full scrollbar-hide">
          <Sidebar
            onCollapse={onCollapse}
            onItemClick={handleSidebarItemClick}
            isCollapsed={isCollapsed}
            isHovering={isHovering}
          />
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <style>
        {`
  @keyframes glow {
    0%, 100% {
      box-shadow: 0 0 10px rgba(168, 85, 247, 0.6), 0 0 20px rgba(168, 85, 247, 0.4);
    }
    50% {
      box-shadow: 0 0 20px rgba(168, 85, 247, 0.9), 0 0 30px rgba(168, 85, 247, 0.6);
    }
  }
`}
      </style>

      <button
        onClick={toggleAiChat}
        className={`fixed top-1/2 -translate-y-1/2 z-40 p-2 rounded-l-lg shadow-xl transition-all duration-300
    ${isAiChatOpen ? "right-72" : "right-0"} 
    ${isAiChatOpen ? "md:right-72" : "md:right-0"} 
    bg-purple-600 hover:bg-purple-700 text-white 
    animate-glow focus:outline-none`}
         style={{
    position: 'fixed',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 40,
    padding: '0.5rem',
    borderTopLeftRadius: '0.375rem',
    borderBottomLeftRadius: '0.375rem',
    backgroundColor: '#9333ea', // purple-600
    color: 'white',
    boxShadow: '0 0 10px rgba(168, 85, 247, 0.6), 0 0 20px rgba(168, 85, 247, 0.4)',
    animation: 'glow 1.5s infinite ease-in-out',
    transition: 'all 0.3s ease-in-out',
    right: isAiChatOpen ? '18rem' : '0rem', // right-72 equivalent
  }}
        title={isAiChatOpen ? "Close AI Chat" : "Open AI Chat"}
      >
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${
            isAiChatOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* <button
        onClick={toggleAiChat}
        className={`fixed top-20 z-40 bg-green-600 hover:bg-green-700 
          text-white px-3 py-1 rounded-b-lg shadow-lg transition-all duration-300 text-xs
          ${isAiChatOpen ? 'right-72' : 'right-4'} 
          ${isAiChatOpen ? 'md:right-72' : 'md:right-4'}`}
        title={isAiChatOpen ? "Close AI Chat" : "Open AI Chat"}
      >
        {isAiChatOpen ? '✕ Close Chat' : '💬 Open Chat'}
      </button> */}

      {/* AI Chat Window - Conditionally rendered */}
      {isAiChatOpen && (
        <AIChatWindow
          onExternalRequest={(message) =>
            console.log("External request:", message)
          }
        />
      )}

      {/* Main Content Area - Reduced spacing */}
      <div
        className={`transition-all duration-300
          pt-16 md:pt-20
          ${isCollapsed && !isHovering ? "md:pl-20" : "md:pl-64"}
          ${isMobileOpen ? "pl-0" : "pl-0"}
          ${isAiChatOpen ? "pr-2 md:pr-72" : "pr-2"}`}
      >
        <Tabview />
        <main className="min-h-screen p-2 md:p-4 bg-white rounded-tl-lg shadow-sm">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Content1;