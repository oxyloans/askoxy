import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Sidebar from "./SidebarMain";
import Header from "./HeaderMain";
import Tabview from "./Tabview";
import AIChatWindow from "./AIWindow";
import BASE_URL from "../Config";

const Content1: React.FC = () => {
  // Sidebar starts collapsed by default (desktop)
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  // AI Chat Window toggle state - closed by default on mobile
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const onCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  const handleSidebarMouseEnter = () => {
    if (window.innerWidth >= 768) {
      // Only on desktop
      setIsHovering(true);
    }
  };

  const handleSidebarMouseLeave = () => {
    if (window.innerWidth >= 768) {
      // Only on desktop
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
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        // On mobile: force expanded width so labels are visible
        setIsCollapsed(false);
        setIsHovering(false);
        if (isAiChatOpen) setIsAiChatOpen(false);
      } else {
        // On desktop: start collapsed (hover to expand)
        setIsCollapsed(true);
        setIsHovering(false);
        // keep AI chat closed by default as per current behavior
        setIsAiChatOpen(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const customerId = localStorage.getItem("userId") || "";
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    if (customerId) {
      fetchProfileData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const sendToAIChat = (message: string) => {
    setIsAiChatOpen(true);
    window.dispatchEvent(
      new CustomEvent("aiChatExternalRequest", {
        detail: { message },
      })
    );
  };

  // Function to handle external requests from other pages
  const handleExternalChatRequest = (message: string) => {
    setIsAiChatOpen(true);
    window.dispatchEvent(
      new CustomEvent("aiChatExternalRequest", {
        detail: { message },
      })
    );
  };

  // Register globals
  useEffect(() => {
    (window as any).openAiChat = handleExternalChatRequest;
    (window as any).sendToAIChat = sendToAIChat;

    return () => {
      delete (window as any).openAiChat;
      delete (window as any).sendToAIChat;
    };
  }, []);

  // Also expose (older path)
  useEffect(() => {
    (window as any).openAiChat = handleExternalChatRequest;
    return () => {
      delete (window as any).openAiChat;
    };
  }, []);

  // Decide width class: on mobile we always use w-64 so labels have space
  const widthClass = isMobile
    ? "w-64"
    : isCollapsed && !isHovering
    ? "w-20 overflow-visible"
    : "w-64 overflow-hidden";

  // Tell Sidebar when to show labels:
  // - Always on mobile
  // - On desktop when expanded (hovering or not collapsed)
  const showLabels = isMobile || !isCollapsed || isHovering;

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
          ${widthClass}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
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
            // NEW: ensure item labels are visible on mobile
            showLabels={showLabels}
            isMobile={isMobile}
          />
        </div>
      </aside>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* AI Chat Window */}
      {isAiChatOpen && (
        <div
          className={`fixed z-50 transition-all ${
            isMobile ? "bottom-20 right-2 left-2" : "top-20 bottom-2 right-2 w-[18rem]"
          }`}
        >
          <AIChatWindow
            isMobile={isMobile}
            onClose={() => setIsAiChatOpen(false)}
            onExternalRequest={(message) =>
              console.log("External request:", message)
            }
          />
        </div>
      )}

      <style>
        {`
    @keyframes glow {
      0%, 100% {
        box-shadow: 0 0 10px rgba(192,132,252,0.6), 0 0 20px rgba(192,132,252,0.4);
      }
      50% {
        box-shadow: 0 0 20px rgba(192,132,252,0.9), 0 0 30px rgba(192,132,252,0.7);
      }
    }
    .animate-glow {
      animation: glow 1.5s ease-in-out infinite;
    }
  `}
      </style>

      <button
        onClick={toggleAiChat}
        className={`fixed z-40 text-white transition-all duration-300 animate-glow
    ${
      isMobile
        ? "bottom-6 right-6 bg-purple-600 rounded-full w-14 h-14 flex items-center justify-center shadow-[0_0_15px_rgba(192,132,252,0.9)]"
        : isAiChatOpen
        ? "top-1/2 right-[18rem] -translate-y-1/2 bg-purple-600 p-2 rounded-l-lg shadow-[0_0_15px_rgba(192,132,252,0.9)]"
        : "top-1/2 right-0 -translate-y-1/2 bg-purple-600 p-2 rounded-l-lg shadow-[0_0_15px_rgba(192,132,252,0.9)]"
    }
  `}
        title={isAiChatOpen ? "Close ASKOXY.AI" : "Open ASKOXY.AI"}
      >
        <svg
  className={`${isMobile ? "w-7 h-7" : "w-4 h-4"} ${
    !isMobile && !isAiChatOpen ? "rotate-180" : ""
  } transition-transform`}
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              isMobile
                ? isAiChatOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                : "M9 5l7 7-7 7"
            }
          />
        </svg>
      </button>

      <div
        className={`transition-all duration-300
          pt-16 md:pt-20
          ${isMobile ? "pl-0" : isCollapsed && !isHovering ? "md:pl-20" : "md:pl-64"}
          ${isMobileOpen ? "pl-0" : "pl-0"}
          ${!isMobile && isAiChatOpen ? "pr-0 md:pr-[18rem]" : "pr-2"}`}
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
