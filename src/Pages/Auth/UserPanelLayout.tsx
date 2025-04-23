import React, { useState, useEffect, ReactNode } from "react";
import { Layout, Menu, Row, Grid, Avatar, Tooltip } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { MdLogout, MdSubscriptions, MdInventory } from "react-icons/md";
import { FaClipboardCheck, FaExchangeAlt } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";
import {
  FaTachometerAlt,
  FaUsers,
  FaSlideshare,
  FaBoxOpen,
  FaStore,
  FaShoppingCart,
  FaHandsHelping,
  FaHistory,
  FaListAlt,
} from "react-icons/fa";
import { BiSolidCategory, BiSolidCoupon } from "react-icons/bi";

const { Header, Sider, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

interface SidebarItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  link: string;
  color?: string; // Optional color property
}

interface UserPanelLayoutProps {
  children: ReactNode;
}

const UserPanelLayout: React.FC<UserPanelLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const screens = useBreakpoint();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("User");
  const location = useLocation();

  useEffect(() => {
    const handleResize = (): void => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Get userName from local storage
    const storedUserName = localStorage.getItem("userName") || "User";
    setUserName(storedUserName);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screens.xs) {
      setCollapsed(true); // Always collapse on small screens
    } else if (screens.md) {
      setCollapsed(false); // Expand on larger screens
    }
  }, [screens]);

  const sidebarItems: SidebarItem[] = [
    {
      key: "plan-of-the-day",
      label: "Daily Plan Of The Day ",
      icon: <FaTachometerAlt className="text-blue-500" />,
      link: "/planoftheday",
    },
    {
      key: "end-of-the-day",
      label: "End Of The Day Summary",
      icon: <FaHistory className="text-green-500" />,
      link: "/taskupdated",
    },
    {
      key: "task-overview",
      label: "Daily Activity Status",
      icon: <FaSlideshare className="text-purple-500" />,
      link: "/all-statuses",
    },
    {
      key: "task-assignments",
      label: "Admin Assigned Task List",
      icon: <FaExchangeAlt className="text-orange-500" />,
      link: "/assigned-task",
    },
    {
      key: "user-assigned-tasks",
      label: "Tasks Received from Admin",
      icon: <FaUsers className="text-red-500" />,
      link: "/taskassigneduser",
    },
  ];

  const toggleCollapse = (): void => {
    setCollapsed((prev) => !prev);
  };

  const handleSignOut = (): void => {
    localStorage.clear(); // Clear all local storage items
    sessionStorage.clear(); // Clear all session storage items
    window.location.href = "/userlogin"; // Redirect to login
  };

  // Get user initials for avatar
  const getUserInitials = (): string => {
    if (!userName) return "U";
    const nameParts = userName.split(" ");
    if (nameParts.length === 1) return userName.charAt(0).toUpperCase();
    return (
      nameParts[0].charAt(0).toUpperCase() +
      (nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : "")
    );
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="md"
        width={screens.xs ? 200 : 250}
        collapsedWidth={screens.xs ? 0 : 80}
        className="bg-gray-800 fixed h-screen z-10 shadow-md"
        style={{
          left: collapsed ? (isMobile ? "-200px" : "-80px") : 0,
          transition: "left 0.3s ease-in-out",
        }}
      >
        <div className="text-center font-bold mt-4 mb-1 text-lg">
          <div className="text-white">{collapsed ? "A" : "ASKOXY.AI"}</div>
        </div>

        <div className="py-2 border-b border-gray-700">
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
          items={sidebarItems.map((item) => ({
            key: item.link,
            icon: item.icon,
            label: (
              <Link
                to={item.link}
                className="text-gray-300 hover:text-yellow-400 no-underline transition-colors duration-200"
              >
                {item.label}
              </Link>
            ),
          }))}
          style={{ borderRight: 0 }}
        />

        {/* User Profile at the bottom of sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="flex items-center justify-center">
            {!collapsed && (
              <div className="flex items-center justify-center space-x-2">
                <FaUserCircle className="text-yellow-400 text-2xl" />
                <span className="text-gray-300 font-medium">{userName}</span>
              </div>
            )}
            {collapsed && (
              <Tooltip title={userName} placement="right">
                <FaUserCircle className="text-yellow-400 text-2xl" />
              </Tooltip>
            )}
          </div>
        </div>
      </Sider>

      <Layout>
        <Header
          className="flex justify-between items-center bg-white shadow-sm"
          style={{
            padding: screens.xs ? "0 12px" : "0 18px",
            width: screens.xs
              ? "100%"
              : `calc(100% - ${collapsed ? "0px" : "250px"})`,
            marginLeft: screens.xs ? "0px" : collapsed ? "0px" : "250px",
            position: "fixed", // Make header fixed
            zIndex: 9, // Lower than sidebar but still above content
            height: "64px", // Explicit height
            transition: "margin-left 0.3s ease-in-out, width 0.3s ease-in-out",
          }}
        >
          <div className="flex items-center">
            <button
              onClick={toggleCollapse}
              className="bg-transparent border-none cursor-pointer text-lg text-blue-500 hover:text-blue-700 mr-2"
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
          </div>

          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <Avatar
                style={{ backgroundColor: "#1890ff", color: "white" }}
                size="small"
              >
                {getUserInitials()}
              </Avatar>
              <span className="ml-2 text-gray-700 hidden sm:inline">
                {userName}
              </span>
            </div>

            <div
              onClick={handleSignOut}
              className="flex items-center cursor-pointer hover:text-red-500 transition-colors duration-200"
            >
              <MdLogout className="mr-2 text-gray-500 text-lg hover:text-red-500" />
              <span className="text-gray-500 text-sm">Log out</span>
            </div>
          </div>
        </Header>

        <Content
          className="bg-gray-50"
          style={{
            padding: screens.xs ? "12px" : "24px",
            width: screens.xs
              ? "100%"
              : `calc(100% - ${collapsed ? "0px" : "250px"})`,
            marginLeft: screens.xs ? "0px" : collapsed ? "0px" : "250px",
            marginTop: "64px", // Match header height
            minHeight: "calc(100vh - 64px - 64px)", // viewport - header - footer
            transition: "margin-left 0.3s ease-in-out, width 0.3s ease-in-out",
          }}
        >
          <div className="bg-white p-4 rounded-lg shadow-sm">{children}</div>
        </Content>

        <Footer
          className="text-center bg-white shadow-inner text-gray-500 text-sm"
          style={{
            width: screens.xs
              ? "100%"
              : `calc(100% - ${collapsed ? "0px" : "250px"})`,
            marginLeft: screens.xs ? "0px" : collapsed ? "0px" : "250px",
            height: "64px", // Fixed footer height
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "margin-left 0.3s ease-in-out, width 0.3s ease-in-out",
          }}
        >
          <div className="flex flex-col items-center sm:flex-row sm:space-x-2">
            
            <div>
              <span className="font-medium mr-1">Task Management</span>
              ©2025 Created by ASKOXY.AI Company
            </div>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default UserPanelLayout;
