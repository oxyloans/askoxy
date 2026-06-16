import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Typography,
  Button,
  Space,
  Tag,
  Breadcrumb,
  Grid,
} from "antd";
import type { MenuProps } from "antd";
import {
  UploadOutlined,
  MailOutlined,
  ThunderboltOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  RightOutlined,
} from "@ant-design/icons";
import EmailCampaignStyles from "./EmailCampaignStyles";
import {
  COLOR_BG,
  COLOR_BORDER,
  COLOR_MUTED,
  COLOR_PRIMARY_DARK,
  COLOR_SIDEBAR,
  COLOR_TEXT,
  EXPANDED_SIDEBAR_WIDTH,
  SECTION_META,
  type SectionKey,
} from "./constants";

const { Header, Sider, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;
const { useBreakpoint } = Grid;

interface EmailCampaignLayoutProps {
  activeSection: SectionKey;
  onSectionChange: (section: SectionKey) => void;
  children: React.ReactNode;
}

const EmailCampaignLayout: React.FC<EmailCampaignLayoutProps> = ({
  activeSection,
  onSectionChange,
  children,
}) => {
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  const collapsedWidth = isMobile ? 0 : 80;
  const effectiveSidebarWidth = screens.xs
    ? 0
    : collapsed
      ? collapsedWidth
      : EXPANDED_SIDEBAR_WIDTH;

  const meta = SECTION_META[activeSection];

  const menuItems: MenuProps["items"] = [
    {
      key: "upload",
      icon: <UploadOutlined />,
      label: SECTION_META.upload.sidebarLabel,
    },
    {
      key: "campaign",
      icon: <MailOutlined />,
      label: SECTION_META.campaign.sidebarLabel,
    },
  ];

  const toggleCollapse = () => setCollapsed((prev) => !prev);

  const closeMobileSidebar = () => {
    if (isMobile && !collapsed) setCollapsed(true);
  };

  const onMenuClick: MenuProps["onClick"] = ({ key }) => {
    onSectionChange(key as SectionKey);
    if (isMobile) setCollapsed(true);
  };

  const sidebarStyles: React.CSSProperties = {
    position: "fixed",
    height: "100vh",
    zIndex: 1000,
    top: 0,
    left: isMobile && collapsed ? -EXPANDED_SIDEBAR_WIDTH : 0,
    overflowY: "auto",
    background: COLOR_SIDEBAR,
    borderRight: `1px solid ${COLOR_BORDER}`,
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
    transition: "left 0.25s ease-in-out",
  };

  const headerStyles: React.CSSProperties = {
    padding: screens.xs ? "0 14px" : "0 24px",
    width: screens.xs ? "100%" : `calc(100% - ${effectiveSidebarWidth}px)`,
    marginLeft: screens.xs ? 0 : effectiveSidebarWidth,
    position: "fixed",
    top: 0,
    zIndex: 900,
    height: 72,
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
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
    height: 56,
    background: "#ffffff",
    borderTop: `1px solid ${COLOR_BORDER}`,
    textAlign: "center",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "margin-left 0.25s ease-in-out, width 0.25s ease-in-out",
  };

  return (
    <Layout className="ec-mail-layout" style={{ minHeight: "100vh" }}>
      {isMobile && !collapsed && (
        <div
          onClick={closeMobileSidebar}
          role="presentation"
          className="ec-mobile-overlay"
        />
      )}

      <Sider
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="md"
        onBreakpoint={(broken) => {
          if (broken) setCollapsed(true);
        }}
        width={EXPANDED_SIDEBAR_WIDTH}
        collapsedWidth={collapsedWidth}
        theme="light"
        trigger={null}
        style={sidebarStyles}
      >
        {isMobile && !collapsed && (
          <button
            type="button"
            onClick={toggleCollapse}
            aria-label="Close sidebar"
            className="ec-sidebar-close-btn"
          >
            ×
          </button>
        )}

        <div
          className={`ec-sidebar-brand${
            collapsed && !isMobile ? " ec-sidebar-brand-collapsed" : ""
          }`}
        >
          <div className="ec-brand-icon">
            <ThunderboltOutlined />
          </div>
          {(!collapsed || isMobile) && (
            <div>
              <Text strong style={{ color: COLOR_TEXT, fontSize: 15 }}>
                OxyMail AI
              </Text>
            </div>
          )}
        </div>

        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[activeSection]}
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
              onClick={toggleCollapse}
              aria-label={collapsed ? "Expand menu" : "Collapse menu"}
              className="ec-menu-toggle"
            />
          </Space>

          <Tag
            style={{
              color: COLOR_PRIMARY_DARK,
              borderColor: "rgba(0, 140, 186, 0.18)",
              background: "rgba(0, 140, 186, 0.08)",
              borderRadius: 999,
              padding: "4px 10px",
              fontWeight: 700,
            }}
          >
            <ThunderboltOutlined /> {screens.xs ? "AI" : "AI Powered"}
          </Tag>
        </Header>

        <Content style={contentStyles}>
          <div className="ec-page-container">
            <div
              className={
                screens.xs ? "ec-top-row ec-top-row-mobile" : "ec-top-row"
              }
            >
              <div className="ec-top-row-content">
                <Title
                  level={screens.xs ? 4 : 3}
                  style={{
                    margin: 0,
                    color: COLOR_TEXT,
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {meta.pageTitle}
                </Title>
                <Paragraph
                  style={{
                    margin: "8px 0 0",
                    maxWidth: 720,
                    color: COLOR_MUTED,
                    fontSize: screens.xs ? 13 : 15,
                    lineHeight: 1.65,
                  }}
                >
                  {meta.pageSubtitle}
                </Paragraph>
              </div>

              <Breadcrumb
                separator={<RightOutlined style={{ fontSize: 10 }} />}
                items={[
                  {
                    title: (
                      <span>
                        <HomeOutlined /> OxyMail AI
                      </span>
                    ),
                  },
                  { title: meta.breadcrumb },
                ]}
                style={{
                  background: "transparent",
                  border: "none",
                  borderRadius: 0,
                  padding: 0,
                  boxShadow: "none",
                  whiteSpace: "nowrap",
                  color: COLOR_MUTED,
                }}
              />
            </div>

            {children}
          </div>
        </Content>

        <Footer style={footerStyles}>
          <Text style={{ fontSize: 13, color: COLOR_MUTED }}>
            <strong className="ec-footer-brand">OxyMail AI</strong> ©{" "}
            {new Date().getFullYear()} · Secure professional outreach
          </Text>
        </Footer>
      </Layout>

      <EmailCampaignStyles />
    </Layout>
  );
};

export default EmailCampaignLayout;
