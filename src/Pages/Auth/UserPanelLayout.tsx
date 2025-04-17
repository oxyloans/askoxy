import React, { useState, useEffect, ReactNode } from "react";
import { Layout, Menu, Row, Grid } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
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
}

interface UserPanelLayoutProps {
  children: ReactNode;
}

const UserPanelLayout: React.FC<UserPanelLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const screens = useBreakpoint();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = (): void => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
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
      label: "Plan of the Day",
      icon: <FaTachometerAlt />,
      link: "/planoftheday",
    },
    {
      key: "end-of-the-day",
      label: "End of the Day Summary",
      icon: <FaClipboardCheck />,
      link: "/taskupdated",
    },
    {
      key: "task-overview",
      label: "Task Overview",
      icon: <FaSlideshare />,
      link: "/all-statuses",
    },
    {
      key: "task-assignments",
      label: "Assigned Tasks List",
      icon: <FaExchangeAlt />,
      link: "/assigned-task",
    },
    {
      key: "user-assigned-tasks",
      label: "Tasks Assigned by User",
      icon: <FaUsers />,
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

  return (
    <Layout className="min-h-screen">
      <Sider
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="md"
        width={screens.xs ? 200 : 240}
        collapsedWidth={screens.xs ? 0 : 80}
        className="bg-gray-800 fixed h-screen z-10"
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
            <div className="text-center font-bold my-0 text-2xl">
           
                <span className="text-green-500">
                  {collapsed ? "T" : "TASK"}
                </span>{" "}
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
          items={sidebarItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: (
              <Link
                to={item.link}
                className="text-gray-300 hover:text-white no-underline"
              >
                {item.label}
              </Link>
            ),
          }))}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout>
        <Header
          className="flex justify-between items-center bg-white shadow-sm"
          style={{
            padding: screens.xs ? "0 12px" : "0 18px",
            width: screens.xs
              ? "100%"
              : `calc(100% - ${collapsed ? "0px" : "240px"})`,
            marginLeft: screens.xs ? "0px" : collapsed ? "0px" : "240px",
            position: "relative",
          }}
        >
          <button
            onClick={toggleCollapse}
            className="bg-transparent border-none cursor-pointer text-lg text-teal-500 hover:text-teal-700"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>

          <div
            onClick={handleSignOut}
            className="flex items-center cursor-pointer hover:text-red-500 transition-colors duration-200"
          >
            <MdLogout className="mr-2 text-gray-500 text-sm" />
            <span className="text-gray-500 text-sm">Log out</span>
          </div>
        </Header>
        <Content
          className="m-4 p-6 bg-white"
          style={{
            padding: screens.xs ? 12 : 24,
            width: screens.xs
              ? "100%"
              : `calc(100% - ${collapsed ? "0px" : "240px"})`,
            marginLeft: screens.xs ? "0px" : collapsed ? "0px" : "240px",
            position: "relative",
          }}
        >
          {children}
        </Content>
        <Footer
          className="text-center bg-white"
          style={{
            width: screens.xs
              ? "100%"
              : `calc(100% - ${collapsed ? "0px" : "240px"})`,
            marginLeft: screens.xs ? "0px" : collapsed ? "0px" : "240px",
            position: "relative",
            bottom: 0,
          }}
        >
          Task Management Admin ©2025 Created by ASKOXY.AI Company
        </Footer>
      </Layout>
    </Layout>
  );
};

export default UserPanelLayout;
