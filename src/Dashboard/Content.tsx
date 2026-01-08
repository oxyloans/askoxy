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
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isAiChatAnimating, setIsAiChatAnimating] = useState(false);

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

  const toggleAiChat = () => {
    if (!isAiChatOpen) {
      setIsAiChatOpen(true);
      // Small delay to ensure DOM is ready before animating
      setTimeout(() => {
        setIsAiChatAnimating(true);
      }, 10);
    } else {
      setIsAiChatAnimating(false);
      // Wait for animation to complete before unmounting
      setTimeout(() => setIsAiChatOpen(false), 300);
    }
  };

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

  const handleExternalChatRequest = (message?: string) => {
    if (isAiChatOpen) {
      setIsAiChatAnimating(false);
      setTimeout(() => setIsAiChatOpen(false), 300);
      return;
    }

    // Clear chat messages when opening AI chat
    setChatMessages([]);

    setIsAiChatOpen(true);
    setTimeout(() => {
      setIsAiChatAnimating(true);
    }, 10);

    if (message) {
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("aiChatExternalRequest", {
            detail: { message },
          })
        );
      }, 100);
    }
  };
  // Register globals
  useEffect(() => {
    (window as any).openAiChat = handleExternalChatRequest;
    (window as any).sendToAIChat = sendToAIChat;

    return () => {
      delete (window as any).openAiChat;
      delete (window as any).sendToAIChat;
    };
  }, [isAiChatOpen]);

  // Also expose (older path)
  useEffect(() => {
    (window as any).openAiChat = handleExternalChatRequest;
    return () => {
      delete (window as any).openAiChat;
    };
  }, []);

  const widthClass = isMobile
    ? "w-64"
    : isCollapsed && !isHovering
    ? "w-20 overflow-visible"
    : "w-64 overflow-hidden";

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

      {isAiChatOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ease-in-out ${
            isMobile
              ? "bottom-24 right-2 left-2 h-[60vh]"
              : `top-20 bottom-0 right-0 ${
                  isAiChatAnimating
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
                }`
          }`}
          style={
            !isMobile
              ? {
                  width: "52rem",
                  transformOrigin: "right center",
                }
              : undefined
          }
        >
          <AIChatWindow
            isMobile={isMobile}
            onClose={() => {
              setIsAiChatAnimating(false);
              setTimeout(() => setIsAiChatOpen(false), 300);
            }}
            onExternalRequest={(message) =>
              console.log("External request:", message)
            }
            persistedMessages={chatMessages}
            onMessagesChange={setChatMessages}
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
    
    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    .animate-spin-slow {
      animation: rotate 8s linear infinite;
    }
  `}
      </style>

      <button
        onClick={toggleAiChat}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 text-white rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 animate-glow"
        title={isAiChatOpen ? "Close ASKOXY.AI" : "Open ASKOXY.AI"}
      >
        {isAiChatOpen ? (
          <svg
            className="w-6 h-6 md:w-7 md:h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-8 h-8 md:w-9 md:h-9"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <rect
              x="6"
              y="8"
              width="12"
              height="10"
              rx="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="9.5" cy="11.5" r="0.5" fill="currentColor" />
            <circle cx="14.5" cy="11.5" r="0.5" fill="currentColor" />
            <path strokeLinecap="round" d="M9 15c.5.5 1.5 1 3 1s2.5-.5 3-1" />
            <line x1="12" y1="8" x2="12" y2="5" strokeLinecap="round" />
            <circle cx="12" cy="4" r="1" fill="currentColor" />
            <line x1="6" y1="12" x2="4" y2="12" strokeLinecap="round" />
            <line x1="18" y1="12" x2="20" y2="12" strokeLinecap="round" />
          </svg>
        )}
      </button>

      <div
        className={`transition-all duration-300
          pt-16 md:pt-20
          ${
            isMobile
              ? "pl-0"
              : isCollapsed && !isHovering
              ? "md:pl-20"
              : "md:pl-64"
          }
          ${isMobileOpen ? "pl-0" : "pl-0"}
          pr-2`}
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
