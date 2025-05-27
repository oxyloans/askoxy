import React, { useState, useEffect, useRef } from "react";
import { Layout } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./PartnerSidebar";
import Header from "./HeaderPartner";
import Footer from "../components/Footer";

const { Content, Sider, Footer: AntFooter } = Layout;

const PartnerHome: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);

  const onCollapse = () => {
    if (isMobile) {
      setIsSidebarVisible(!isSidebarVisible);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/partnerLogin");
  };

  const handleSidebarItemClick = () => {
    if (isMobile) {
      setIsSidebarVisible(false);
    }
  };

  useEffect(() => {
    const tokenString = localStorage.getItem("Token");
    if (!tokenString) {
      navigate("/partnerLogin");
      return;
    }
    const tokenObj = JSON.parse(tokenString);
    if (!tokenObj || tokenObj.primaryType !== "SELLER") {
      navigate("/partnerLogin");
      localStorage.clear();
    }
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }

    window.scrollTo(0, 0);
  }, [location.pathname]);

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
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-40">
        <Header
          onSidebarToggle={onCollapse}
          isMobile={isMobile}
          isCollapsed={isCollapsed}
          onLogout={handleLogout}
          sidebarWidth={isMobile ? 0 : isCollapsed ? 20 : 64}
        />
      </div>

      {/* Overlay - Lower z-index than sidebar */}
      {isMobile && isSidebarVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarVisible(false)}
        />
      )}

      {/* Sidebar - Higher z-index than overlay */}
      <Sider
        collapsed={isMobile ? !isSidebarVisible : isCollapsed}
        trigger={null}
        width={250}
        style={{
          overflow: "hidden",
          zIndex: 35,
          height: "calc(100vh - 64px)",
          position: "fixed",
          left: 0,
          top: 64,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
        }}
        collapsedWidth={isMobile ? 0 : 80}
        className={`
          bg-white shadow-lg transition-all p-2
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
        ref={contentRef}
        className={`flex-1 transition-all pt-16 overflow-auto ${
          isMobile ? "ml-0" : isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* Scrollable Content */}
        <Content className="p-4 min-h-[calc(100vh-4rem-64px)]">
          <Outlet />
        </Content>

        {/* Footer */}
        <AntFooter className="text-center bg-white border-t border-gray-200 p-4">
          <Footer />
        </AntFooter>
      </div>
    </div>
  );
};

export default PartnerHome;
