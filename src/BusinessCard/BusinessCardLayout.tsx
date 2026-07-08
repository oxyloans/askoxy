import React, { useEffect, useState, ReactNode } from "react";
import { Layout, Menu, Button, Avatar, Grid, Drawer } from "antd";
import {
  MenuUnfoldOutlined,
  UploadOutlined,
  UnorderedListOutlined,
  TeamOutlined,
  CreditCardOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { setIntendedRoute } from "../utils/taskTokenManager";
import {
  getBusinessCardAccessToken,
  removeBusinessCardAccessToken,
  removeBusinessCardRefreshToken,
} from "../utils/cookieUtils";
import { BC_BTN_GHOST, PAGE_BOTTOM_PADDING } from "./businessCardUi";
import BusinessCardThemeProvider from "./BusinessCardThemeProvider";
import { COLOR_PRIMARY } from "./businessCardTheme";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

interface BusinessCardLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  {
    path: "/business-card/ceo-details",
    label: "User Details",
    shortLabel: "User",
    icon: UserOutlined,
    key: "ceo-details",
  },
  {
    path: "/business-card/process",
    label: "Process Card",
    shortLabel: "Upload",
    icon: UploadOutlined,
    key: "process",
  },
  {
    path: "/business-card/upload-details",
    label: "Upload Details",
    shortLabel: "Cards",
    icon: UnorderedListOutlined,
    key: "upload-details",
  },
  {
    path: "/business-card/ceo-details-list",
    label: "User Details List",
    shortLabel: "Users",
    icon: TeamOutlined,
    key: "ceo-details-list",
  },
];

const BusinessCardLayout: React.FC<BusinessCardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const location = useLocation();
  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  useEffect(() => {
    setUserName(sessionStorage.getItem("Name") || "");
  }, []);

  useEffect(() => {
    const token = getBusinessCardAccessToken();
    const primaryType = sessionStorage.getItem("primaryType");
    if (!token || primaryType !== "BUSINESSCARD") {
      window.location.replace("/business-card/login");
    }
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const selectedKey =
    NAV_ITEMS.find((item) => item.path === location.pathname)?.key || "ceo-details";

  const handleSignOut = () => {
    Swal.fire({
      title: "Sign out?",
      text: "You will need to sign in again to access Business Card.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: COLOR_PRIMARY,
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sign out",
    }).then((result) => {
      if (!result.isConfirmed) return;

      if (
        location.pathname !== "/business-card/login" &&
        location.pathname !== "/business-card/register"
      ) {
        setIntendedRoute(location.pathname);
      }

      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("Name");
      sessionStorage.removeItem("primaryType");
      removeBusinessCardAccessToken();
      removeBusinessCardRefreshToken();
      window.location.replace("/business-card/login");
    });
  };

  const initials = userName
    ? userName
        .trim()
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const menuItems = NAV_ITEMS.map((item) => ({
    key: item.key,
    icon: React.createElement(item.icon, { className: "text-[13px]" }),
    label: (
      <Link to={item.path} className="text-[13px] text-slate-700">
        {item.label}
      </Link>
    ),
  }));

  const brandBlock = (compact?: boolean) => (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-50">
        <CreditCardOutlined className="text-base text-cyan-600" />
      </div>
      {!compact && (
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">AskOxy</p>
          <p className="truncate text-[13px] font-semibold text-slate-800">Business Card</p>
        </div>
      )}
    </div>
  );

  const sidebarUserBlock = () => (
    <div className="flex min-w-0 items-center gap-2.5">
      <Avatar size={32} className="!bg-cyan-600 !text-xs !font-semibold shrink-0">
        {initials}
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-medium text-slate-800">{userName || "Employee"}</p>
        <p className="text-[11px] text-slate-400">Employee portal</p>
      </div>
    </div>
  );

  const sideMenu = (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-100 px-3 py-3">{brandBlock(collapsed && !isMobile)}</div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        className="flex-1 !border-e-0 !px-1 !py-2 [&_.ant-menu-item]:!mx-1 [&_.ant-menu-item]:!rounded-md [&_.ant-menu-item]:!px-3 [&_.ant-menu-item-selected]:!font-semibold"
      />
      <div className="border-t border-slate-100 px-3 py-3">
        {(!collapsed || isMobile) && sidebarUserBlock()}
      </div>
    </div>
  );

  return (
    <BusinessCardThemeProvider>
      <Layout className="min-h-screen bg-slate-100">
        {!isMobile && (
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            width={240}
            collapsedWidth={64}
            theme="light"
            className="!sticky !top-0 !h-screen !overflow-auto !border-r !border-slate-200 !bg-white"
          >
            {sideMenu}
          </Sider>
        )}

        <Layout className="min-h-screen bg-slate-100">
          <Header className="sticky top-0 z-30 !flex !h-12 !items-center !border-b !border-slate-200 !bg-white/95 !px-3 !py-0 !leading-none backdrop-blur-sm sm:!h-14 sm:!px-5">
            {isMobile && (
              <Button
                type="text"
                size="small"
                icon={<MenuUnfoldOutlined className="text-slate-600" />}
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
                className="!mr-1 !flex !h-8 !w-8 !items-center !justify-center"
              />
            )}
            {!isMobile && (
              <p className="text-xs font-medium text-slate-500 sm:text-[13px]">Business Card Portal</p>
            )}
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-2 sm:flex">
                <Avatar size={28} className="!bg-cyan-600 !text-[10px] !font-semibold">
                  {initials}
                </Avatar>
                <span className="max-w-[140px] truncate text-[13px] font-medium text-slate-700 md:max-w-[180px]">
                  {userName || "Employee"}
                </span>
              </div>
              <Button
                type="default"
                size="small"
                icon={<LogoutOutlined />}
                onClick={handleSignOut}
                className={BC_BTN_GHOST}
              >
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </Header>

          <Content className="px-3 py-3 sm:px-5 sm:py-4 lg:px-6" style={PAGE_BOTTOM_PADDING}>
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </Content>
        </Layout>

        {isMobile && (
          <>
            <Drawer
              title={<span className="text-sm font-semibold">Business Card</span>}
              placement="left"
              onClose={() => setDrawerOpen(false)}
              open={drawerOpen}
              width={256}
              className="[&_.ant-drawer-body]:!p-0 [&_.ant-drawer-header]:!py-3"
            >
              {sideMenu}
            </Drawer>
            <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-1px_8px_rgba(15,23,42,0.06)]">
              <div className="grid grid-cols-4">
                {NAV_ITEMS.map((item) => {
                  const active = selectedKey === item.key;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.key}
                      to={item.path}
                      className={[
                        "flex flex-col items-center gap-0.5 px-1 py-2 text-center transition-colors",
                        active ? "text-cyan-600" : "text-slate-400 hover:text-slate-600",
                      ].join(" ")}
                    >
                      <Icon className="text-base" />
                      <span className="text-[10px] font-medium leading-none">{item.shortLabel}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </>
        )}
      </Layout>
    </BusinessCardThemeProvider>
  );
};

export default BusinessCardLayout;
