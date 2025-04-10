import React from "react";
import { Layout } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/img/logo.png";

const { Header } = Layout;

interface HeaderProps {
  onSidebarToggle: () => void;
  isMobile: boolean;
  isCollapsed: boolean;
  onLogout: () => void;
  sidebarWidth?: number;
}

const PartnerHeader: React.FC<HeaderProps> = ({
  onSidebarToggle,
  isMobile,
  isCollapsed,
  onLogout,
  sidebarWidth = 0,
}) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.clear();
    navigate("/partnerLogin");
  };

  return (
    <Header
      className="bg-white  w- full shadow-sm flex items-center justify-between px-4"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%", // Always full width
        maxWidth: isMobile ? "100%" : `calc(100% - ${sidebarWidth}px)`, // Adjust max-width based on sidebar
        height: "5rem", // Increased height
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px", // Consistent padding
        marginLeft: isMobile ? 0 : sidebarWidth, // Align with content
      }}
    >
      {/* Mobile Sidebar Toggle and Logo */}
      <div className="flex items-center space-x-4">
        {isMobile && (
          <div
            onClick={onSidebarToggle}
            className="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
          >
            {isCollapsed ? (
              <MenuUnfoldOutlined className="text-xl" />
            ) : (
              <MenuFoldOutlined className="text-xl" />
            )}
          </div>
        )}
        <img src={Logo} alt="ASK OXY AI" className="h-16 w-auto" />
      </div>

      <div
        onClick={() => {
          handleLogout();
        }}
        className="p-2 rounded-md hover:bg-gray-100 cursor-pointer flex items-center"
      >
        <LogoutOutlined className="text-xl mr-2" />
        {!isMobile && <span>Logout</span>}
      </div>
    </Header>
  );
};

export default PartnerHeader;
