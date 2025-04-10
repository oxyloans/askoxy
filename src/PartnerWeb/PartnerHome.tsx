import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./PartnerSidebar";
import Header from "./HeaderPartner";
import Footer from "../components/Footer";

const { Content, Sider, Footer: AntFooter } = Layout;

const PartnerHome: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const navigate = useNavigate();

  const onCollapse = () => {
    if (isMobile) {
      setIsSidebarVisible(!isSidebarVisible);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleSidebarItemClick = () => {
    if (isMobile) {
      setIsSidebarVisible(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      if (mobile) {
        setIsCollapsed(true);
        setIsSidebarVisible(false);
      } else {
        setIsCollapsed(false);
        setIsSidebarVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Full-Width Header */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Header
          onSidebarToggle={onCollapse}
          isMobile={isMobile}
          isCollapsed={isCollapsed}
          onLogout={handleLogout}
          sidebarWidth={isMobile ? 0 : isCollapsed ? 20 : 64}
        />
      </div>

      <Sider
        collapsible
        collapsed={isMobile ? !isSidebarVisible : isCollapsed}
        onCollapse={onCollapse}
        width={250}
        collapsedWidth={isMobile ? 0 : 80}
        className={`fixed left-0 top-20 bottom-0 bg-white shadow-lg transition-all z-40 overflow-auto
          ${
            isMobile && !isSidebarVisible
              ? "-translate-x-full"
              : "translate-x-0"
          }
        `}
      >
        <Sidebar
          isCollapsed={isMobile ? !isSidebarVisible : isCollapsed}
          onCollapse={onCollapse}
          onItemClick={handleSidebarItemClick}
          isMobile={isMobile}
        />
      </Sider>

      <div
        className={`flex-1 transition-all pt-16 overflow-auto ${
          isMobile ? "ml-0" : isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* Scrollable Content */}
        <Content className="p-4 min-h-[calc(100vh-4rem)] overflow">
          <Outlet />
          {/* </div> */}
        </Content>

        {/* Footer */}
        <AntFooter className="text-center bg-white border-t border-gray-200 p-4">
          <Footer />
        </AntFooter>
      </div>

      {/* Mobile Overlay */}
      {isMobile && isSidebarVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarVisible(false)}
        />
      )}
    </div>
  );
};

export default PartnerHome;
