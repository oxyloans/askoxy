import React, { useState, useEffect, ReactNode } from "react";
import {
  Layout,
  Menu,
  Row,
  Grid,
  Avatar,
  Tooltip,
  message,
  Typography,
} from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";

import { FaUserCircle, FaWhatsapp } from "react-icons/fa";
import {
  FaTachometerAlt,
  FaSlideshare,
  FaMobileAlt,
  FaCalendar,
  FaClipboard,
  FaEdit,
  FaListAlt,
} from "react-icons/fa";

const { Header, Sider, Content, Footer } = Layout;
const { useBreakpoint } = Grid;
const { Text } = Typography;

type MenuItem = {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: MenuItem[];
  popupClassName?: string;
};

interface UserPanelLayoutProps {
  children: ReactNode;
}

const UserPanelLayout: React.FC<UserPanelLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const screens = useBreakpoint();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = (): void => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Get userName from session storage
    const storedUserName = sessionStorage.getItem("Name") || "";
    setUserName(storedUserName);

    // Auto-open submenu based on route
    const pathParts = location.pathname.split("/");
    if (
      pathParts.includes("leaveapproval") ||
      pathParts.includes("leavestatus")
    ) {
      setOpenKeys(["leave-management"]);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [location.pathname]);

  useEffect(() => {
    if (screens.xs) setCollapsed(true);
  }, [screens.xs]);

  useEffect(() => {
    const primaryType = sessionStorage.getItem("primaryType");

    if (
      !primaryType ||
      primaryType === undefined ||
      primaryType === null ||
      (primaryType !== "EMPLOYEE" &&
        primaryType !== "SELLER" &&
        primaryType !== "HELPDESKADMIN")
    ) {
      message.info("Your not Supposed to Login to the Task Management System");
      navigate("/userlogin");
      return;
    }

    console.warn(
      "setUserRole is not defined. Please implement it if required.",
    );
  }, [navigate]);

  const toggleCollapse = (): void => setCollapsed((prev) => !prev);

  const handleSignOut = (): void => {
    sessionStorage.clear();
    window.location.href = "/userlogin";
  };

  const getUserInitials = (): string => {
    if (!userName) return "U";
    const nameParts = userName.trim().split(" ");
    if (nameParts.length === 1) return userName.charAt(0).toUpperCase();
    return (
      nameParts[0].charAt(0).toUpperCase() +
      (nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : "")
    );
  };

  const onOpenChange = (keys: string[]) => setOpenKeys(keys);

  const getMenuItems = (): MenuItem[] => {
    return [
      {
        key: "/planoftheday",
        label: <Link to="/planoftheday">Plan of the Day</Link>,
        icon: (
          <FaTachometerAlt className="text-blue-600" style={{ fontSize: 16 }} />
        ),
      },
      {
        key: "/taskupdated",
        label: <Link to="/taskupdated">End-of-Day Report</Link>,
        icon: (
          <FaClipboard className="text-green-600" style={{ fontSize: 16 }} />
        ),
      },
      {
        key: "/assigned-task",
        label: <Link to="/assigned-task">Assigned WhatsApp Tasks</Link>,
        icon: (
          <FaWhatsapp className="text-green-500" style={{ fontSize: 16 }} />
        ),
      },
      {
        key: "leave-management",
        label: "Leave Management",
        icon: (
          <FaCalendar className="text-purple-600" style={{ fontSize: 16 }} />
        ),
        children: [
          {
            key: "/leaveapproval",
            label: <Link to="/leaveapproval">Apply for Leave</Link>,
            icon: (
              <FaEdit className="text-purple-500" style={{ fontSize: 14 }} />
            ),
          },
          {
            key: "/leavestatus",
            label: <Link to="/leavestatus">Leave Request Status</Link>,
            icon: (
              <FaListAlt className="text-purple-500" style={{ fontSize: 14 }} />
            ),
          },
        ],
      },
      {
        key: "/all-statuses",
        label: <Link to="/all-statuses">Daily Work Activity</Link>,
        icon: (
          <FaSlideshare className="text-indigo-600" style={{ fontSize: 16 }} />
        ),
      },
      {
        key: "/usermobilenumberupdate",
        label: <Link to="/usermobilenumberupdate">Update Mobile Number</Link>,
        icon: (
          <FaMobileAlt className="text-orange-600" style={{ fontSize: 16 }} />
        ),
      },
    ];
  };

  // Width constants (kept same behavior)
  const expandedWidth = 250;
  const collapsedWidth = isMobile ? 0 : 80;
  const effectiveSidebarWidth = screens.xs
    ? 0
    : collapsed
      ? collapsedWidth
      : expandedWidth;

  // ✅ FIX: Mobile slide-out (instead of -80px)
  const siderStyles: React.CSSProperties = {
    position: "fixed",
    height: "100vh",
    zIndex: 1000,
    top: 0,
    left: isMobile && collapsed ? -expandedWidth : 0,
    transition: "left 0.25s ease-in-out",
    overflowY: "auto",
    background: "#1A202C",
  };

  const headerStyles: React.CSSProperties = {
    padding: screens.xs ? "0 12px" : "0 18px",
    width: screens.xs ? "100%" : `calc(100% - ${effectiveSidebarWidth}px)`,
    marginLeft: screens.xs ? 0 : effectiveSidebarWidth,
    position: "fixed",
    top: 0,
    zIndex: 900,
    height: 54,
    background: "#fff",
    transition: "margin-left 0.25s ease-in-out, width 0.25s ease-in-out",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  };

  const contentStyles: React.CSSProperties = {
    padding: screens.xs ? 12 : 24,
    width: screens.xs ? "100%" : `calc(100% - ${effectiveSidebarWidth}px)`,
    marginLeft: screens.xs ? 0 : effectiveSidebarWidth,
    marginTop: 64,
    minHeight: "calc(100vh - 64px - 64px)",
    transition: "margin-left 0.25s ease-in-out, width 0.25s ease-in-out",
    background: "#fff",
  };

  const footerStyles: React.CSSProperties = {
    width: screens.xs ? "100%" : `calc(100% - ${effectiveSidebarWidth}px)`,
    marginLeft: screens.xs ? 0 : effectiveSidebarWidth,
    height: 56,
    transition: "margin-left 0.25s ease-in-out, width 0.25s ease-in-out",
    background: "#f7f7f7",
    borderTop: "1px solid #e5e7eb",
    textAlign: "center",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const onBreakpoint = (broken: boolean) => {
    if (broken) setCollapsed(true);
  };

  // Close sidebar when tapping overlay (mobile)
  const closeMobileSidebar = () => {
    if (isMobile && !collapsed) setCollapsed(true);
  };

  return (
    <Layout className="min-h-screen">
      {/* ✅ Mobile overlay for better UX */}
      {isMobile && !collapsed && (
        <div
          onClick={closeMobileSidebar}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            zIndex: 950,
          }}
        />
      )}

      <Sider
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="md"
        onBreakpoint={onBreakpoint}
        width={expandedWidth}
        collapsedWidth={collapsedWidth}
        className="bg-gray-800 shadow-md"
        style={siderStyles}
      >
        {/* Close Button for Mobile */}
        {isMobile && !collapsed && (
          <button
            onClick={toggleCollapse}
            className="absolute top-4 right-4 z-20 text-white text-2xl"
            aria-label="Close sidebar"
          >
            &times;
          </button>
        )}

        <div className="mt-2 py-2 border-b border-gray-700">
          <Row justify="center" align="middle">
            <div className="text-center font-bold my-0 text-xl">
              <span className="text-green-500">{collapsed ? "T" : "TASK"}</span>{" "}
              <span className="text-yellow-500">
                {collapsed ? "" : "MANAGEMENT"}
              </span>
            </div>
          </Row>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          className="bg-gray-800 mt-4"
          selectedKeys={[location.pathname]}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          items={getMenuItems()}
          style={{ borderRight: 0 }}
          triggerSubMenuAction="click"
        />

        {/* User Profile at the bottom of sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="flex items-center justify-center">
            {!collapsed ? (
              <div className="flex items-center justify-center space-x-2">
                <FaUserCircle className="text-yellow-400 text-2xl" />
                <span className="text-gray-300 font-medium">{userName}</span>
              </div>
            ) : (
              <Tooltip title={userName} placement="right">
                <FaUserCircle className="text-yellow-400 text-2xl" />
              </Tooltip>
            )}
          </div>
        </div>
      </Sider>

      <Layout>
        <Header
          className="flex justify-between items-center"
          style={headerStyles}
        >
          <div className="flex items-center">
            <button
              onClick={toggleCollapse}
              className="bg-transparent border-none cursor-pointer text-lg text-blue-500 hover:text-blue-700 mr-2"
              aria-label={collapsed ? "Expand menu" : "Collapse menu"}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
          </div>

          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <Avatar
                style={{ backgroundColor: "#008cba", color: "white" }}
                size="small"
              >
                {getUserInitials()}
              </Avatar>
              <span className="ml-2 text-gray-700 hidden sm:inline">
                {userName}
              </span>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center cursor-pointer hover:text-red-500 transition-colors duration-200 bg-transparent border-none"
              aria-label="Log out"
            >
              <MdLogout className="mr-2 text-gray-500 text-lg hover:text-red-500" />
              <span className="text-gray-500 text-sm">Log out</span>
            </button>
          </div>
        </Header>

        <Content className="bg-white" style={contentStyles}>
          <div>{children}</div>
        </Content>

        <Footer style={footerStyles}>
          <Text style={{ fontSize: 13, color: "#6b7280" }}>
            <strong>Task Management</strong> ©2025 Created by{" "}
            <span style={{ fontWeight: 600 }}>ASKOXY.AI</span>
          </Text>
        </Footer>
      </Layout>

      {/* ✅ Professional hover/selected colors + scrollbars */}
      <style>{`
        /* Sidebar & menu background */
        .ant-layout-sider,
        .ant-menu-dark,
        .ant-menu-dark .ant-menu-sub {
          background: #1a202c !important;
        }

        /* Keep menu text readable */
        .ant-menu-dark .ant-menu-item,
        .ant-menu-dark .ant-menu-submenu-title {
          color: #e2e8f0 !important;
        }

        /* Hover / active / selected */
        .ant-menu-dark .ant-menu-item:hover,
        .ant-menu-dark .ant-menu-submenu-title:hover,
        .ant-menu-dark .ant-menu-item-selected {
          background-color: #2d3748 !important;
          color: #ffffff !important;
        }

        .ant-menu-dark .ant-menu-item:hover a,
        .ant-menu-dark .ant-menu-item-selected a,
        .ant-menu-dark .ant-menu-submenu-title:hover span {
          color: #ffffff !important;
        }

        /* Custom scrollbar for sider */
        .ant-layout-sider::-webkit-scrollbar {
          width: 6px;
        }
        .ant-layout-sider::-webkit-scrollbar-track {
          background: #1a202c;
        }
        .ant-layout-sider::-webkit-scrollbar-thumb {
          background-color: #4a5568;
          border-radius: 10px;
        }

        /* Firefox */
        .ant-layout-sider {
          scrollbar-width: thin;
          scrollbar-color: #4a5568 #1a202c;
        }
      `}</style>
    </Layout>
  );
};

export default UserPanelLayout;
