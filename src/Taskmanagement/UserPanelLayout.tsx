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
  FaListAlt
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

  useEffect(() => {
    const handleResize = (): void => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Get userName from local storage
    const storedUserName = sessionStorage.getItem("Name") || "";
    setUserName(storedUserName);

    
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
    if (screens.xs) {
      setCollapsed(true); // Always collapse on small screens
    }
  }, [screens]);

    const getMenuItems = (): MenuItem[] => {
      return [
        {
          key: "/planoftheday",
          label: <Link to="/planoftheday">Daily Plan</Link>,
          icon: (
            <FaTachometerAlt
              className="text-blue-600"
              style={{ fontSize: "16px" }}
            />
          ),
        },
        {
          key: "/taskupdated",
          label: <Link to="/taskupdated">End of Day Report</Link>,
          icon: (
            <FaClipboard
              className="text-green-600"
              style={{ fontSize: "16px" }}
            />
          ),
        },
        {
          key: "/assigned-task",
          label: <Link to="/assigned-task">WhatsApp Tasks</Link>,
          icon: (
            <FaWhatsapp
              className="text-green-500"
              style={{ fontSize: "16px" }}
            />
          ),
        },
        {
          key: "leave-management",
          label: "Leave Management",
          icon: (
            <FaCalendar
              className="text-purple-600"
              style={{ fontSize: "16px" }}
            />
          ),
          children: [
            {
              key: "/leaveapproval",
              label: <Link to="/leaveapproval">Request Leave</Link>,
              icon: (
                <FaEdit
                  className="text-purple-500"
                  style={{ fontSize: "14px" }}
                />
              ),
            },
            {
              key: "/leavestatus",
              label: <Link to="/leavestatus">Leave Status</Link>,
              icon: (
                <FaListAlt
                  className="text-purple-500"
                  style={{ fontSize: "14px" }}
                />
              ),
            },
          ],
        },
        {
          key: "/all-statuses",
          label: <Link to="/all-statuses">Daily Activity</Link>,
          icon: (
            <FaSlideshare
              className="text-indigo-600"
              style={{ fontSize: "16px" }}
            />
          ),
        },
        {
          key: "/usermobilenumberupdate",
          label: <Link to="/usermobilenumberupdate">Mobile Number</Link>,
          icon: (
            <FaMobileAlt
              className="text-orange-600"
              style={{ fontSize: "16px" }}
            />
          ),
        },
      ];
    };
  const navigate = useNavigate();

  useEffect(() => {
    const primaryType = sessionStorage.getItem("primaryType");

    if (
      !primaryType ||
      primaryType === undefined || primaryType === null || (primaryType !== "EMPLOYEE" && primaryType !== "SELLER" && primaryType !== "HELPDESKADMIN")
    ) {
      message.info("Your not Supposed to Login to the Task Management System");
      navigate("/userlogin");
      return;
    }

    // Define or implement setUserRole if needed
    console.warn("setUserRole is not defined. Please implement it if required.");
  }, [navigate]);

  const toggleCollapse = (): void => {
    setCollapsed((prev) => !prev);
  };

  const handleSignOut = (): void => {
  
    sessionStorage.clear();
    window.location.href = "/userlogin";
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

  // Handle open change for submenu
  const onOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  // Calculate dynamic styles
  const siderStyles = {
    position: "fixed" as const,
    height: "100vh",
    zIndex: 10,
    left: collapsed && isMobile ? "-80px" : 0,
    transition: "left 0.3s ease-in-out",
  };

  const contentStyles = {
    padding: screens.xs ? "12px" : "24px",
    width: screens.xs ? "100%" : `calc(100% - ${collapsed ? "80px" : "250px"})`,
    marginLeft: screens.xs ? "0px" : collapsed ? "80px" : "250px",
    marginTop: "64px",
    minHeight: "calc(100vh - 64px - 64px)",
    transition: "margin-left 0.3s ease-in-out, width 0.3s ease-in-out",
  };

  const headerStyles = {
    padding: screens.xs ? "0 12px" : "0 18px",
    width: screens.xs ? "100%" : `calc(100% - ${collapsed ? "80px" : "250px"})`,
    marginLeft: screens.xs ? "0px" : collapsed ? "80px" : "250px",
    position: "fixed" as const,
    zIndex: 9,
    height: "54px",
    transition: "margin-left 0.3s ease-in-out, width 0.3s ease-in-out",
  };

  const footerStyles = {
    width: screens.xs ? "100%" : `calc(100% - ${collapsed ? "80px" : "250px"})`,
    marginLeft: screens.xs ? "0px" : collapsed ? "80px" : "250px",
    height: "56px",
    transition: "margin-left 0.3s ease-in-out, width 0.3s ease-in-out",
  };

  const onBreakpoint = (broken: boolean) => {
    if (broken) {
      setCollapsed(true);
    }
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="md"
        onBreakpoint={onBreakpoint}
        width={250}
        collapsedWidth={isMobile ? 0 : 80}
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
        {/* <div className="text-center font-bold mt-4 mb-1 text-lg">
          <div className="text-white">{collapsed ? "A" : "ASKOXY.AI"}</div>
        </div> */}

        <div className="mt-2 py-2  border-b border-gray-700">
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
          <div className="">{children}</div>
        </Content>

        <Footer
          style={{
            ...footerStyles, // ✅ important: makes footer move with sider
            background: "#fafafa",
            borderTop: "1px solid #e5e7eb",
            textAlign: "center",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 13, color: "#6b7280" }}>
            <strong>Task Management</strong> ©2025 Created by{" "}
            <span style={{ fontWeight: 600 }}>ASKOXY.AI</span>
          </Text>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default UserPanelLayout;
