import React, { useState, useEffect, useRef } from "react";
import { Layout, Menu, Avatar, Dropdown, Button } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  TeamOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { Outlet } from "react-router-dom";
import { useOxyNavigate } from "../utils/navigation";

const { Header, Sider, Content, Footer } = Layout;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { navigate, base, pathname } = useOxyNavigate();
  const primaryType = localStorage.getItem("primaryType") || localStorage.getItem("admin_primaryType");
  const pType = (primaryType || "").toUpperCase().trim();
  const isAdmin = pType === "HELPDESKADMIN" || pType === "HELPDESKSUPERADMIN";
  const siderRef = useRef(null);
 
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && !collapsed && siderRef.current && !siderRef.current.contains(event.target)) {
        const toggleButton = event.target.closest('button');
        if (toggleButton && toggleButton.querySelector('.anticon-menu-unfold, .anticon-menu-fold')) {
          return;
        }
        setCollapsed(true);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, collapsed]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("refreshToken");
    localStorage.removeItem("primaryType");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/oxyvisit");
  };

  const userMenu = {
    items: [
     
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Logout",
        onClick: handleLogout,
      },
    ],
  };

  const getMenuItems = () => {
    if (isAdmin) {
      return [
        {
          key: "/oxyvisit/dashboard/categories",
          icon: <AppstoreOutlined />,
          label: "Categories",
        },
        {
          key: "/oxyvisit/dashboard/visits",
          icon: <FileTextOutlined />,
          label: "Visits",
        },
      ];
    }

    return [
      {
        key: "/oxyvisit/dashboard",
        icon: <DashboardOutlined />,
        label: "Dashboard",
      },
      {
        key: "/oxyvisit/dashboard/user-categories",
        icon: <AppstoreOutlined />,
        label: "My Categories",
      },
      {
        key: "/oxyvisit/dashboard/user-all-visits",
        icon: <FileTextOutlined />,
        label: "My Visits",
      },
    ];
  };

  const getSelectedKey = () => {
    if (pathname.includes("/dashboard/user-visits") || pathname.includes("/dashboard/user-categories")) {
      return ["/oxyvisit/dashboard/user-categories"];
    }
    if (pathname.includes("/dashboard/visits")) {
      return ["/oxyvisit/dashboard/visits"];
    }
    if (pathname.includes("/dashboard/categories")) {
      return ["/oxyvisit/dashboard/categories"];
    }
    if (pathname.includes("/dashboard/user-all-visits")) {
      return ["/oxyvisit/dashboard/user-all-visits"];
    }
    if (pathname === "/oxyvisit/dashboard" || pathname === "/oxyvisit/dashboard/") {
      return ["/oxyvisit/dashboard"];
    }
    return [pathname];
  };

  return (
    <Layout
      style={{
        height: "100vh",
        maxHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-[1000] transition-opacity"
          onClick={() => setCollapsed(true)}
        />
      )}
      <Sider
        ref={siderRef}
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
        width={240}
        style={{
          background: "#1a202c",
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
          flexShrink: 0,
          ...(isMobile
            ? {
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 1001,
                boxShadow: collapsed ? "none" : "4px 0 16px rgba(0,0,0,0.4)",
              }
            : {
                position: "relative",
                zIndex: 10,
              }),
        }}
      >
        <div
          className="flex items-center justify-between h-16 px-4"
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          <div
            className="flex items-center cursor-pointer select-none"
            onClick={() => {
              if (isAdmin) {
                navigate("/oxyvisit/dashboard/categories");
              } else {
                navigate("/oxyvisit/dashboard");
              }
              if (isMobile) setCollapsed(true);
            }}
            title="Go to Dashboard"
          >
            <h1 className="text-white font-bold text-lg mb-0" style={{ cursor: "pointer" }}>
              {collapsed ? (
                <span style={{ color: '#fbbf24' }}>OXY</span>
              ) : (
                <>
                  <span style={{ color: '#fbbf24' }}>OXY</span>
                  <span style={{ color: '#ffffff' }}>VISITS</span>
                </>
              )}
            </h1>
          </div>
          {!collapsed && (
            <Button
              icon={<LeftOutlined />}
              onClick={() => setCollapsed(true)}
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px'
              }}
            />
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKey()}
          onClick={({ key }) => {
            navigate(key);
            if (isMobile) setCollapsed(true);
          }}
          items={getMenuItems()}
          style={{ background: "#1a202c", borderRight: 0 }}
          className="custom-menu"
        />
      </Sider>
      <Layout
        style={{
          height: "100vh",
          maxHeight: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          background: "#f0f2f5",
          minWidth: 0,
        }}
      >
        <Header
          style={{
            padding: 0,
            background: "#fff",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            height: 64,
            lineHeight: "64px",
            flexShrink: 0,
            zIndex: 100,
            position: "relative",
            width: "100%",
          }}
        >
          <div className="flex justify-between items-center px-4 md:px-6 h-full">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: "16px", width: 64, height: 64 }}
            />
            <div className="flex items-center gap-2 md:gap-4">
              <span className="text-xs md:text-sm text-gray-600 hidden sm:inline font-medium">
                {isAdmin
                  ? "Admin Panel"
                  : localStorage.getItem('userName') || "User Panel"}
              </span>
              <Dropdown menu={userMenu} placement="bottomRight">
                <Avatar
                  style={{ backgroundColor: "#008cba", cursor: "pointer" }}
                  icon={<UserOutlined />}
                />
              </Dropdown>
            </div>
          </div>
        </Header>
        <div
          className="dashboard-content-scroll"
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Content
            style={{
              margin: "16px",
              padding: "16px",
              background: "#fff",
              minHeight: 280,
              borderRadius: "8px",
              flex: "1 0 auto",
            }}
            className="md:m-6 md:p-6"
          >
            <Outlet />
          </Content>
          <Footer
            style={{
              textAlign: "center",
              background: "#f9fafb",
              padding: "16px",
              flexShrink: 0,
            }}
          >
            <div className="text-gray-600 text-xs md:text-sm">
              © {new Date().getFullYear()} <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>OXY</span><span style={{ color: '#1f2937', fontWeight: 'bold' }}>VISITS</span>. All rights reserved.
            </div>
          </Footer>
        </div>
      </Layout>
      <style>{`
        .dashboard-content-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .dashboard-content-scroll::-webkit-scrollbar-track { background: #f0f2f5; }
        .dashboard-content-scroll::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 8px; }
        .dashboard-content-scroll::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
        .dashboard-content-scroll { scrollbar-width: thin; scrollbar-color: #cbd5e1 #f0f2f5; }

        .ant-menu::-webkit-scrollbar { width: 5px; }
        .ant-menu::-webkit-scrollbar-track { background: #1a202c; }
        .ant-menu::-webkit-scrollbar-thumb { background-color: #4a5568; border-radius: 10px; }
        .ant-menu { scrollbar-width: thin; scrollbar-color: #4a5568 #1a202c; }

        .ant-layout-sider::-webkit-scrollbar { width: 5px; }
        .ant-layout-sider::-webkit-scrollbar-track { background: #1a202c; }
        .ant-layout-sider::-webkit-scrollbar-thumb { background-color: #4a5568; border-radius: 10px; }
        .ant-layout-sider { scrollbar-width: thin; scrollbar-color: #4a5568 #1a202c; }

        .ant-menu-dark,
        .ant-menu-dark .ant-menu-sub,
        .ant-layout-sider .ant-menu {
          background: #1a202c;
          color: #e2e8f0;
        }

        .ant-layout-sider .ant-menu-item,
        .ant-layout-sider .ant-menu-submenu-title {
          color: #e2e8f0;
        }

        .ant-layout-sider .ant-menu-item a,
        .ant-layout-sider .ant-menu-submenu-title span {
          color: #e2e8f0;
        }

        .ant-layout-sider .ant-menu-item:hover,
        .ant-layout-sider .ant-menu-item-active,
        .ant-layout-sider .ant-menu-submenu-title:hover,
        .ant-layout-sider .ant-menu-submenu-open,
        .ant-layout-sider .ant-menu-item-selected {
          background-color: #2d3748 !important;
          color: #ffffff !important;
        }

        .ant-layout-sider .ant-menu-item:hover a,
        .ant-layout-sider .ant-menu-item-active a,
        .ant-layout-sider .ant-menu-item-selected a,
        .ant-layout-sider .ant-menu-submenu-title:hover span {
          color: #ffffff !important;
        }

        .custom-menu .ant-menu-item:hover {
          background-color: #374151 !important;
        }
        .custom-menu .ant-menu-item-selected {
          background-color: #374151 !important;
        }
        @media (max-width: 768px) {
          .ant-layout-sider {
            position: fixed !important;
            left: 0;
            top: 0;
            bottom: 0;
            z-index: 1001 !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default DashboardLayout;
