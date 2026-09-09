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
  Input,
  Dropdown,
  Badge,
  AutoComplete,
} from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  CalendarOutlined,
  FileTextOutlined,
  BarChartOutlined,
  MessageOutlined,
  UnorderedListOutlined,
  FormOutlined,
  UserOutlined,
  SearchOutlined,
  BellOutlined,
  DownOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import Swal from "sweetalert2";
import { removeEmployeeAccessToken, removeEmployeeRefreshToken } from "../utils/cookieUtils";

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
  const [searchValue, setSearchValue] = useState<string>("");

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

    if (
      pathParts.includes("assigned-task-status") ||
      (pathParts.includes("taskmanagement") && pathParts.includes("assignedtasks"))
    ) {
      setOpenKeys(["whatsapp-tasks"]);
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
    Swal.fire({
      title: "Sign Out",
      html: `
    <div style="font-size:15px;color:#374151;line-height:1.6">
      Are you sure you want to sign out?
      <br/>
      <span style="color:#6b7280;font-size:13px;">
        You will need to sign in again to access your account.
      </span>
    </div>
  `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Sign Out",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
    }).then((result) => {
      if (!result.isConfirmed) return;

      const currentPath = location.pathname;
      if (currentPath !== "/userlogin" && currentPath !== "/userregister") {
        localStorage.setItem("intendedRoute", currentPath);
      }

      const mobileNumber = sessionStorage.getItem("mobileNumber");
      const podDraft = sessionStorage.getItem("pod_draft");
      const eodDraft = sessionStorage.getItem("eod_draft");

      removeEmployeeAccessToken();
      removeEmployeeRefreshToken();
      sessionStorage.clear();

      if (mobileNumber) sessionStorage.setItem("mobileNumber", mobileNumber);
      if (podDraft) sessionStorage.setItem("pod_draft", podDraft);
      if (eodDraft) sessionStorage.setItem("eod_draft", eodDraft);

      window.history.replaceState(null, "", "/userlogin");
      window.location.replace("/userlogin");
    });
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

  type SearchPage = {
    label: string;
    path: string;
    keywords: string[];
    category: string;
    icon: React.ReactNode;
  };

  const searchablePages: SearchPage[] = [
    {
      label: "Dashboard Overview",
      path: "/taskmanagement/dashboard",
      keywords: ["dashboard", "home", "overview"],
      category: "Dashboard",
      icon: <HomeOutlined />,
    },
    {
      label: "Plan of the Day Report",
      path: "/planoftheday",
      keywords: ["pod", "plan", "plan of the day", "today", "daily plan"],
      category: "Reports",
      icon: <CalendarOutlined />,
    },
    {
      label: "End of the Day Report",
      path: "/taskupdated",
      keywords: ["eod", "end of day", "report", "update", "daily update"],
      category: "Reports",
      icon: <FileTextOutlined />,
    },
    {
      label: "My Profile",
      path: "/employeeprofile",
      keywords: ["profile", "account", "employee", "user"],
      category: "Account",
      icon: <UserOutlined />,
    },
    {
      label: "Daily Work Activity",
      path: "/all-statuses",
      keywords: ["activity", "daily work", "status", "work activity"],
      category: "Activity",
      icon: <BarChartOutlined />,
    },
    {
      label: "My WhatsApp Tasks",
      path: "/taskmanagement/assignedtasks",
      keywords: ["whatsapp", "task", "my tasks", "assigned tasks"],
      category: "Tasks",
      icon: <MessageOutlined />,
    },
    {
      label: "All WhatsApp Tasks",
      path: "/assigned-task-status",
      keywords: ["assigned whatsapp", "assigned task", "task status", "whatsapp status"],
      category: "Tasks",
      icon: <UnorderedListOutlined />,
    },
    {
      label: "Apply for Leave",
      path: "/leaveapproval",
      keywords: ["leave", "apply", "leave application", "request leave"],
      category: "Leave",
      icon: <FormOutlined />,
    },
    {
      label: "Leave Request Status",
      path: "/leavestatus",
      keywords: ["leave status", "request status", "leave request", "approval status"],
      category: "Leave",
      icon: <CalendarOutlined />,
    },
  ];

  const normalizedSearch = searchValue.trim().toLowerCase();

  const filteredSearchPages = normalizedSearch
    ? searchablePages.filter((item) => {
      const labelMatch = item.label.toLowerCase().includes(normalizedSearch);
      const keywordMatch = item.keywords.some((keyword) =>
        keyword.toLowerCase().includes(normalizedSearch),
      );
      return labelMatch || keywordMatch;
    })
    : [];

  const searchOptions =
    normalizedSearch.length >= 2
      ? filteredSearchPages.length > 0
        ? filteredSearchPages.map((item) => ({
          value: item.path,
          label: (
            <div className="flex items-center gap-3 py-1.5">
              <div className="search-result-icon">{item.icon}</div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-slate-700">
                  {item.label}
                </div>
                <div className="mt-0.5 truncate text-[11px] text-slate-400">
                  {item.category}
                </div>
              </div>
            </div>
          ),
        }))
        : [
          {
            value: "__no_results__",
            disabled: true,
            label: (
              <div className="py-3 text-center">
                <div className="text-sm font-medium text-slate-600">
                  No matching page found
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  Try dashboard, POD, EOD, tasks, profile, or leave
                </div>
              </div>
            ),
          },
        ]
      : [];

  const handleSearchSelect = (path: string): void => {
    if (!path || path === "__no_results__") return;

    setSearchValue("");
    navigate(path);

    if (isMobile) {
      setCollapsed(true);
    }
  };

  const profileMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "My Profile",
      onClick: () => navigate("/employeeprofile"),
    },
    { type: "divider" as const },
    {
      key: "logout",
      icon: <MdLogout style={{ color: "#dc2626" }} />,
      label: <span style={{ color: "#dc2626", fontWeight: 600 }}>Log out</span>,
      onClick: handleSignOut,
    },
  ];

  const getMenuItems = (): MenuItem[] => {
    return [

      {
        key: "/taskmanagement/dashboard",
        label: <Link to="/taskmanagement/dashboard">Dashboard Overview</Link>,
        icon: (
          <HomeOutlined className="text-slate-300" style={{ fontSize: 16 }} />
        ),
      },
      {
        key: "/planoftheday",
        label: <Link to="/planoftheday">Plan of the Day Report</Link>,
        icon: (
          <CalendarOutlined className="text-slate-300" style={{ fontSize: 16 }} />
        ),
      },
      {
        key: "/taskupdated",
        label: <Link to="/taskupdated">End of the Day Report</Link>,
        icon: (
          <FileTextOutlined className="text-slate-300" style={{ fontSize: 16 }} />
        ),
      },
      {
        key: "/employeeprofile",
        label: <Link to="/employeeprofile">My Profile</Link>,
        icon: (
          <UserOutlined className="text-slate-300" style={{ fontSize: 16 }} />
        ),
      },
      {
        key: "/all-statuses",
        label: <Link to="/all-statuses">Daily Work Activity</Link>,
        icon: (
          <BarChartOutlined className="text-slate-300" style={{ fontSize: 16 }} />
        ),
      },

      // {
      //   key: "/assigned-task",
      //   label: <Link to="/assigned-task">Assigned WhatsApp Tasks</Link>,
      //   icon: (
      //     <FaWhatsapp className="text-green-500" style={{ fontSize: 16 }} />
      //   ),
      // },
      {
        key: "whatsapp-tasks",
        label: "WhatsApp Tasks",
        icon: (
          <MessageOutlined className="text-slate-300" style={{ fontSize: 16 }} />
        ),
        children: [
          {
            key: "/taskmanagement/assignedtasks",
            label: <Link to="/taskmanagement/assignedtasks">My WhatsApp Tasks</Link>,
            icon: (
              <UnorderedListOutlined className="text-slate-300" style={{ fontSize: 16 }} />
            ),
          },
          {
            key: "/assigned-task-status",
            label: <Link to="/assigned-task-status">All WhatsApp Tasks</Link>,
            icon: (
              <FileTextOutlined className="text-slate-300" style={{ fontSize: 16 }} />
            ),
          },

        ],
      },


      {
        key: "leave-management",
        label: "Leave Management",
        icon: (
          <CalendarOutlined className="text-slate-300" style={{ fontSize: 16 }} />
        ),
        children: [
          {
            key: "/leaveapproval",
            label: <Link to="/leaveapproval">Apply for Leave</Link>,
            icon: (
              <FormOutlined className="text-slate-300" style={{ fontSize: 14 }} />
            ),
          },
          {
            key: "/leavestatus",
            label: <Link to="/leavestatus">Leave Request Status</Link>,
            icon: (
              <UnorderedListOutlined className="text-slate-300" style={{ fontSize: 14 }} />
            ),
          },
        ],
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
    boxSizing: "border-box",
    minWidth: 0,
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
        {/* Mobile-only close button */}
        {isMobile && !collapsed && (
          <button
            type="button"
            onClick={closeMobileSidebar}
            className="mobile-sidebar-close-btn"
            aria-label="Close sidebar"
            title="Close menu"
          >
            &times;
          </button>
        )}

        <div className="mt-2  px-3 py-3">
          <Row justify="center" align="middle">
            <div
              className={`flex items-center ${collapsed ? "justify-center" : "justify-start"} gap-3 w-full`}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#008cba] text-white shadow-sm"
                aria-label="Task Management"
              >
                <TeamOutlined style={{ fontSize: 21 }} />
              </div>

              {!collapsed && (
                <div className="min-w-0 leading-tight">
                  <div className="truncate text-[16px] tracking-wide">
                    <span
                      className="text-[#22D3EE]"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                      }}
                    >
                      OXY
                    </span>{" "}
                    <span
                      className="text-white"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 600,
                        letterSpacing: "0.03em",
                      }}
                    >
                      EMPLOYEE
                    </span>
                  </div>

                  <div
                    className="mt-0.5 truncate text-[10px] uppercase text-slate-400"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      letterSpacing: "0.18em",
                    }}
                  >
                    Panel
                  </div>
                </div>
              )}
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

        {/* User + logout actions fixed at the bottom of the sidebar */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-700 bg-gray-800 p-3">
          {!collapsed ? (
            <>


              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                aria-label="Log out"
              >
                <MdLogout className="text-lg" />
                Log out
              </button>
            </>
          ) : (
            <Tooltip title="Log out" placement="right">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex h-10 w-full items-center justify-center rounded-lg  bg-red-500 text-white transition hover:bg-red-600"
                aria-label="Log out"
              >
                <MdLogout className="text-xl" />
              </button>
            </Tooltip>
          )}
        </div>
      </Sider>

      <Layout>
        <Header
          className="flex justify-between items-center"
          style={headerStyles}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
            <button
              onClick={toggleCollapse}
              className="mr-1 shrink-0 cursor-pointer border-none bg-transparent text-lg text-[#008cba] transition hover:text-[#005f8a] focus:outline-none"
              aria-label={collapsed ? "Expand menu" : "Collapse menu"}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>

            {!isMobile && (
              <div className="header-search-container">
                <AutoComplete
                  value={searchValue}
                  options={searchOptions}
                  onSearch={(value) => setSearchValue(value)}
                  onSelect={handleSearchSelect}
                  filterOption={false}
                  popupClassName="header-search-popup"
                  style={{ width: "80%" }}
                >
                  <Input
                    prefix={
                      <SearchOutlined
                        style={{
                          color: normalizedSearch ? "#2563eb" : "#94a3b8",
                        }}
                      />
                    }
                    placeholder="Search pages, tasks, reports, leave..."
                    allowClear
                    aria-label="Search Task Management"
                  />
                </AutoComplete>
              </div>
            )}
          </div>

          <div className="ml-2 flex shrink-0 items-center gap-1 sm:gap-2">
            <Tooltip title="Notifications">
              <button
                type="button"
                onClick={() => message.info("You have no new notifications")}
                className="header-icon-btn"
                aria-label="Notifications"
              >
                <Badge dot offset={[-2, 2]}>
                  <BellOutlined style={{ fontSize: 18, color: "#475569" }} />
                </Badge>
              </button>
            </Tooltip>

            <Dropdown
              menu={{ items: profileMenuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <button
                type="button"
                className="profile-trigger"
                aria-label="Open profile menu"
              >
                <Avatar
                  style={{ backgroundColor: "#008cba", color: "white", fontWeight: 700 }}
                  size={32}
                >
                  {getUserInitials()}
                </Avatar>
                <span className="hidden max-w-[130px] truncate text-sm font-medium text-gray-700 md:inline">
                  {userName || "User"}
                </span>
                <DownOutlined className="hidden text-[10px] text-gray-400 sm:inline" />
              </button>
            </Dropdown>
          </div>
        </Header>

        <Content className="min-w-0" style={contentStyles}>
          <div className="min-w-0">{children}</div>
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

        .header-search-container {
          width: min(380px, 100%);
          min-width: 0;
        }

        .header-search-container .ant-select {
          width: 100%;
        }

        .header-search-container .ant-input-affix-wrapper {
          min-height: 40px;
          border-radius: 12px !important;
          border-color: #e2e8f0;
          background: #f8fafc;
          box-shadow: none;
          transition: all 0.2s ease;
        }

        .header-search-container .ant-input-affix-wrapper:hover {
          border-color: #94a3b8;
          background: #ffffff;
        }

        .header-search-container .ant-input-affix-wrapper:focus,
        .header-search-container .ant-input-affix-wrapper-focused {
          border-color: #2563eb !important;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08) !important;
        }

        .header-search-container input {
          font-size: 13px;
        }

        .header-search-popup .ant-select-item {
          border-radius: 10px;
          margin: 3px 5px;
          padding: 7px 9px;
        }

        .header-search-popup .ant-select-item-option-active:not(.ant-select-item-option-disabled),
        .header-search-popup .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
          background: #eff6ff !important;
        }

        .search-result-icon {
          width: 34px;
          height: 34px;
          flex: 0 0 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 15px;
        }

        .header-icon-btn,
        .profile-trigger {
          border: 0;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          transition: background 0.2s ease;
        }

        .header-icon-btn {
          width: 38px;
          height: 38px;
        }

        .header-icon-btn:hover,
        .profile-trigger:hover {
          background: #f1f5f9;
        }

        .profile-trigger {
          gap: 8px;
          padding: 3px 6px;
          min-height: 40px;
        }

        .mobile-sidebar-close-btn {
          position: absolute;
          top: 14px;
          right: 12px;
          z-index: 30;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          
          
          color: #ffffff;
          font-size: 28px;
       
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease;
        }

        .mobile-sidebar-close-btn:hover {
          background: rgba(255,255,255,0.16);
          border-color: rgba(255,255,255,0.28);
        }

        @media (max-width: 768px) {
          .header-search-container {
            display: none !important;
          }
        }

        @media (min-width: 769px) {
          .mobile-sidebar-close-btn {
            display: none !important;
          }
        }

        @media (max-width: 575px) {
          .profile-trigger {
            padding: 3px 4px;
          }
        }

        @media (min-width: 576px) and (max-width: 1024px) {
          .header-search-container {
            width: min(300px, 100%);
          }
        }

        @media (min-width: 1025px) {
          .header-search-container {
            width: min(380px, 100%);
          }
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
