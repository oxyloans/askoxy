import {
  Layout,
  Menu,
  Button,
  Typography,
  Avatar,
  Drawer,
  Breadcrumb,
  message,
} from "antd";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getEmployeeAccessToken,
  removeEmployeeAccessToken,
  removeEmployeeRefreshToken,
} from "../utils/cookieUtils";
import { setEmployeePreviousPath, clearEmployeeSession } from "../utils/employeeTokenManager";
import { LogoutOutlined, MenuFoldOutlined, MenuOutlined, MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";

interface EmployeeLayoutProps {
  children: React.ReactNode;
}
const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

const EmployeeLayout: React.FC<EmployeeLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const companyName = sessionStorage.getItem("Name") || "Company";

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/employee-')) {
      setEmployeePreviousPath(location.pathname + location.search);
    }
  }, [location]);

  const isRestrictedEmployeeRoute = () => {
    const currentPath = location.pathname;
    return (
      currentPath === "/employee-login" ||
      currentPath === "/employee-register"
    );
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Sign Out",
      text: "Are you sure you want to sign out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Sign Out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Save current path before clearing
        setEmployeePreviousPath(location.pathname + location.search);
        
        removeEmployeeAccessToken();
        removeEmployeeRefreshToken();
        clearEmployeeSession();
        message.success("Signed out successfully!");
        setTimeout(() => navigate("/employee-login", { replace: true }), 300);
      }
    });
  };

  const menuItems = [
    {
      key: "/employee-dashboard",
      icon:
        collapsed && !isMobile ? (
          <span style={{ fontWeight: 700, fontSize: 16, color: "inherit" }}>
            D
          </span>
        ) : undefined,
      label: <span style={{ fontWeight: 500 }}>Dashboard Overview</span>,
    },
    {
      key: "/employee-requirement-list",
      icon:
        collapsed && !isMobile ? (
          <span style={{ fontWeight: 700, fontSize: 16, color: "inherit" }}>
            R
          </span>
        ) : undefined,
      label: <span style={{ fontWeight: 500 }}>Manage Requirements</span>,
    },
  ];

  const handleMenuClick = (e: any) => {
    navigate(e.key);
    if (isMobile) setMobileDrawerOpen(false);
  };

  const siderContent = (
    <>
      {/* Brand Logo */}
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          gap: 10,
          overflow: "hidden",
          transition: "all 0.2s",
        }}
      >
        {collapsed && !isMobile ? (
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              color: "#fff",
              fontSize: 18,
            }}
          >
            E
          </div>
        ) : (
          (!collapsed || isMobile) && (
            <div style={{ overflow: "hidden", textAlign: "center" }}>
              <Text
                strong
                style={{
                  color: "#fff",
                  fontSize: 18,
                  display: "block",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.5px",
                  lineHeight: 1.2,
                }}
              >
                Freelance Hub
              </Text>
              <Text
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  whiteSpace: "nowrap",
                }}
              >
                Employer Portal
              </Text>
            </div>
          )
        )}
      </div>

      {/* Navigation Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          background: "transparent",
          border: "none",
          marginTop: 24,
          padding: "0 12px",
        }}
      />

      {/* Bottom Logout */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px 20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          type="text"
          icon={<LogoutOutlined style={{ fontSize: 18 }} />}
          onClick={handleLogout}
          style={{
            color: "rgba(255,255,255,0.75)",
            textAlign: "center",
            height: 44,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s",
            width: collapsed && !isMobile ? 44 : "100%",
          }}
          className="logout-btn"
        >
          {(!collapsed || isMobile) && (
            <span style={{ marginLeft: 12, fontWeight: 500 }}>Logout</span>
          )}
        </Button>
      </div>
    </>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Desktop Sider - Hidden on restricted routes */}
      {!isMobile && !isRestrictedEmployeeRoute() && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          trigger={null}
          width={240}
          collapsedWidth={72}
          style={{
            background: "#1a202c",
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 100,
            boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          {siderContent}
        </Sider>
      )}

      {/* Mobile Drawer - Hidden on restricted routes */}
      {isMobile && !isRestrictedEmployeeRoute() && (
        <Drawer
          placement="left"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          width={260}
          styles={{
            body: {
              padding: 0,
              background: "#1a202c",
              position: "relative",
              height: "100%",
            },
            header: { display: "none" },
          }}
        >
          {siderContent}
        </Drawer>
      )}

      <Layout
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 72 : 240,
          transition: "margin-left 0.2s",
          background: "#f5f6fa",
        }}
      >
        {/* Top Header */}
        <Header
          style={{
            background: "#fff",
            padding: "0 16px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Button
              type="text"
              icon={
                isMobile ? (
                  <MenuOutlined />
                ) : collapsed ? (
                  <MenuUnfoldOutlined />
                ) : (
                  <MenuFoldOutlined />
                )
              }
              onClick={() =>
                isMobile ? setMobileDrawerOpen(true) : setCollapsed(!collapsed)
              }
              style={{ fontSize: 18, width: 40, height: 40 }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#f8f9ff",
                padding: "6px 14px",
                borderRadius: 10,
                cursor: "default",
              }}
            >
              <Avatar
                size={32}
                icon={<UserOutlined />}
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  boxShadow: "0 2px 8px rgba(102, 126, 234, 0.2)",
                  color: "#fff",
                  fontSize: 16,
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  lineHeight: 1.2,
                }}
              >
                <Text
                  strong
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1a1d2e",
                    maxWidth: 120,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {companyName}
                </Text>
                <Text style={{ fontSize: 11, color: "#999" }}>Employer</Text>
              </div>
            </div>
          </div>
        </Header>

        {/* Main Content */}
        <Content
          style={{
            padding: isMobile ? "16px 12px" : "24px",
            minHeight: "calc(100vh - 64px - 48px)",
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <Breadcrumb
              separator="/"
              items={[
                {
                  title: (
                    <span style={{ color: "#999", fontSize: 13 }}>Panel</span>
                  ),
                },
                {
                  title: (
                    <span
                      style={{
                        fontWeight: 600,
                        color: "#667eea",
                        fontSize: 14,
                      }}
                    >
                      {location.pathname === "/employee-dashboard"
                        ? "Dashboard"
                        : location.pathname === "/employee-requirement-list"
                        ? "Requirements"
                        : "Freelancers"}
                    </span>
                  ),
                },
              ]}
            />
          </div>
          {children}
        </Content>

        {/* Footer */}
        <Footer
          style={{
            textAlign: "center",
            background: "#fff",
            padding: "12px 16px",
            borderTop: "1px solid #f0f0f0",
            fontSize: 12,
            color: "#999",
          }}
        >
          © {new Date().getFullYear()} Freelance Marketplace · Powered by
          OxyLoans
        </Footer>
      </Layout>

      <style>
        {`
          .ant-layout-sider,
          .ant-menu-dark,
          .ant-menu-dark .ant-menu-sub {
            background: #1a202c !important;
          }

          .ant-menu-dark .ant-menu-item,
          .ant-menu-dark .ant-menu-submenu-title {
            color: #e2e8f0 !important;
          }

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

          .ant-layout-sider {
            scrollbar-width: thin;
            scrollbar-color: #4a5568 #1a202c;
          }

          .logout-btn:hover {
            color: #fff !important;
            background: rgba(255, 255, 255, 0.08) !important;
          }
          .logout-btn span {
            transition: all 0.3s;
          }
          .ant-layout-sider-trigger {
            background: #1a202c !important;
            border-top: 1px solid rgba(255,255,255,0.06);
          }
        `}
      </style>
    </Layout>
  );
};

export default EmployeeLayout;
