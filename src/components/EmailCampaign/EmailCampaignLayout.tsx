import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Typography,
  Button,
  Space,
  Divider,
  Grid,
} from "antd";
import type { MenuProps } from "antd";
import {
  UploadOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FilePdfOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import EmailCampaignStyles from "./EmailCampaignStyles";
import {
  COLOR_BG,
  COLOR_BORDER,
  COLOR_MUTED,
  COLOR_PRIMARY,
  COLOR_SIDEBAR,
  COLOR_TEXT,
  EXPANDED_SIDEBAR_WIDTH,
  SECTION_META,
} from "./constants";

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const PAGE_TITLES: Record<string, string> = {
  upload:       "Upload Document",
  campaign:     "Send Campaign",
  allpdfs:      "All Documents",
  allcampaigns: "Campaign Manager",
};

const ROUTE_MAP: Record<string, string> = {
  upload:       "/email-campaign/upload",
  campaign:     "/email-campaign/send-campaign",
  allpdfs:      "/email-campaign/all-documents",
  allcampaigns: "/email-campaign/all-campaigns",
};

const PATH_TO_KEY: Record<string, string> = {
  "/email-campaign/upload":          "upload",
  "/email-campaign/send-campaign":   "campaign",
  "/email-campaign/all-documents":   "allpdfs",
  "/email-campaign/all-campaigns":   "allcampaigns",
  "/email-campaign/scorecard":       "allcampaigns",
  "/email-campaign/conversations":   "allcampaigns",
};

function getActiveKey(pathname: string): string {
  if (pathname.startsWith("/email-campaign/scorecard"))    return "allcampaigns";
  if (pathname.startsWith("/email-campaign/conversations")) return "allcampaigns";
  return PATH_TO_KEY[pathname] ?? "upload";
}

interface EmailCampaignLayoutProps {
  children: React.ReactNode;
}

const EmailCampaignLayout: React.FC<EmailCampaignLayoutProps> = ({ children }) => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const screens    = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile,  setIsMobile]  = useState(false);

  const activeKey  = getActiveKey(location.pathname);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screens.xs) setCollapsed(true);
  }, [screens.xs]);

  const collapsedWidth        = isMobile ? 0 : 80;
  const effectiveSidebarWidth = screens.xs ? 0 : collapsed ? collapsedWidth : EXPANDED_SIDEBAR_WIDTH;

  const menuItems: MenuProps["items"] = [
    { key: "upload",       icon: <UploadOutlined />,    label: SECTION_META.upload.sidebarLabel },
    { key: "campaign",     icon: <MailOutlined />,      label: SECTION_META.campaign.sidebarLabel },
    { key: "allpdfs",      icon: <FilePdfOutlined />,   label: SECTION_META.allpdfs.sidebarLabel },
    { key: "allcampaigns", icon: <AppstoreOutlined />,  label: SECTION_META.allcampaigns.sidebarLabel },
  ];

  const onMenuClick: MenuProps["onClick"] = ({ key }) => {
    const route = ROUTE_MAP[key];
    if (route) navigate(route);
    if (isMobile) setCollapsed(true);
  };

  const sidebarStyles: React.CSSProperties = {
    position: "fixed", height: "100vh", zIndex: 1000, top: 0,
    left: isMobile && collapsed ? -EXPANDED_SIDEBAR_WIDTH : 0,
    overflowY: "auto", background: COLOR_SIDEBAR,
    borderRight: `1px solid ${COLOR_BORDER}`,
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
    transition: "left 0.25s ease-in-out",
  };

  const headerStyles: React.CSSProperties = {
    padding: screens.xs ? "0 14px" : "0 24px",
    width: screens.xs ? "100%" : `calc(100% - ${effectiveSidebarWidth}px)`,
    marginLeft: screens.xs ? 0 : effectiveSidebarWidth,
    position: "fixed", top: 0, zIndex: 900, height: 72,
    background: "#ffffff", display: "flex", alignItems: "center",
    justifyContent: "space-between",
    borderBottom: `1px solid ${COLOR_BORDER}`,
    boxShadow: "0 4px 18px rgba(15, 23, 42, 0.05)",
    transition: "margin-left 0.25s ease-in-out, width 0.25s ease-in-out",
  };

  const contentStyles: React.CSSProperties = {
    padding: screens.xs ? "18px 14px" : screens.md ? "26px 24px" : "32px 28px",
    width: screens.xs ? "100%" : `calc(100% - ${effectiveSidebarWidth}px)`,
    marginLeft: screens.xs ? 0 : effectiveSidebarWidth,
    marginTop: 72,
    minHeight: "calc(100vh - 72px - 56px)",
    background: COLOR_BG,
    transition: "margin-left 0.25s ease-in-out, width 0.25s ease-in-out",
  };

  const footerStyles: React.CSSProperties = {
    width: screens.xs ? "100%" : `calc(100% - ${effectiveSidebarWidth}px)`,
    marginLeft: screens.xs ? 0 : effectiveSidebarWidth,
    height: 56, background: "#ffffff",
    borderTop: `1px solid ${COLOR_BORDER}`,
    textAlign: "center", padding: "12px 16px",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "margin-left 0.25s ease-in-out, width 0.25s ease-in-out",
  };

  return (
    <Layout className="ec-mail-layout" style={{ minHeight: "100vh" }}>
      {isMobile && !collapsed && (
        <div
          onClick={() => setCollapsed(true)}
          role="presentation"
          className="ec-mobile-overlay"
        />
      )}

      <Sider
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="md"
        onBreakpoint={(broken) => { if (broken) setCollapsed(true); }}
        width={EXPANDED_SIDEBAR_WIDTH}
        collapsedWidth={collapsedWidth}
        theme="light"
        trigger={null}
        style={sidebarStyles}
      >
        {isMobile && !collapsed && (
          <button type="button" onClick={() => setCollapsed(true)}
            aria-label="Close sidebar" className="ec-sidebar-close-btn">×</button>
        )}

        <div className={`ec-sidebar-brand${collapsed && !isMobile ? " ec-sidebar-brand-collapsed" : ""}`}
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          {(!collapsed || isMobile) && (
            <Text strong style={{
              color: COLOR_PRIMARY,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: "0.02em",
              textAlign: "center",
              display: "block",
            }}>ASKOXY.AI</Text>
          )}
        </div>

        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[activeKey]}
          items={menuItems}
          onClick={onMenuClick}
          className="ec-side-menu"
          style={{ borderRight: 0, background: "transparent", padding: "8px" }}
        />
      </Sider>

      <Layout style={{ background: COLOR_BG }}>
        <Header style={headerStyles}>
          <Space align="center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed((p) => !p)}
              aria-label={collapsed ? "Expand menu" : "Collapse menu"}
              className="ec-menu-toggle"
            />
          </Space>
          <Text style={{ fontSize: 13, color: COLOR_MUTED }}>
            AI-Powered Email Campaign Platform
          </Text>
        </Header>

        <Content style={contentStyles}>
          <div className="ec-page-container">
            {children}
          </div>
        </Content>

        <Footer style={footerStyles}>
          <Space split={<Divider type="vertical" />} style={{ flexWrap: "wrap", justifyContent: "center" }}>
            {/* <Text strong style={{ color: COLOR_PRIMARY, fontSize: 13 }}>ASKOXY.AI</Text> */}
            <Text style={{ fontSize: 13, color: COLOR_MUTED }}>© {new Date().getFullYear()} OxyGlobal Technologies</Text>
            <Text style={{ fontSize: 13, color: COLOR_MUTED }}>AI-Powered Email Campaigns</Text>
          </Space>
        </Footer>
      </Layout>

      <EmailCampaignStyles />
    </Layout>
  );
};

export default EmailCampaignLayout;
