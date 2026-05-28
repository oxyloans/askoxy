import React, { useState, useRef, useEffect } from "react";
import {
  Layout,
  Menu,
  Typography,
  Card,
  Button,
  Input,
  Alert,
  Space,
  Tag,
  Spin,
  Upload,
  Grid,
  Form,
  Breadcrumb,
} from "antd";
import type { MenuProps } from "antd";
import {
  UploadOutlined,
  MailOutlined,
  FilePdfOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  HomeOutlined,
  RightOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";

const { Header, Sider, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;
const { useBreakpoint } = Grid;

const BASE_URL = "https://mailautomation-production.up.railway.app/api/v1";

const COLOR_PRIMARY = "#008cba";
const COLOR_PRIMARY_DARK = "#0079a3";
const COLOR_SUCCESS = "#1ab394";
const COLOR_TEXT = "#111827";
const COLOR_MUTED = "#6b7280";
const COLOR_BORDER = "#e5e7eb";
const COLOR_BG = "#ffffff";
const COLOR_SIDEBAR = "#ffffff";
const COLOR_MENU_SELECTED = "#f9fafb";

interface UploadResponse {
  success: boolean;
  message: string;
  fileId: string;
  fileName: string;
  chunksStored: number;
  totalChunks: number;
  status: string;
}

interface CampaignResponse {
  success: boolean;
  message: string;
  generatedEmail: { subject: string; body: string };
}

type SectionKey = "upload" | "campaign";

const SECTION_META: Record<
  SectionKey,
  {
    sidebarLabel: string;
    pageTitle: string;
    pageSubtitle: string;
    cardTitle: string;
    breadcrumb: string;
  }
> = {
  upload: {
    sidebarLabel: "Company Upload Files",
    pageTitle: "Company Upload Files",
    pageSubtitle: "Upload company files for AI email campaigns.",
    cardTitle: "Upload Company Document",
    breadcrumb: "PDF Upload",
  },
  campaign: {
    sidebarLabel: "Email Campaign",
    pageTitle: "Email Campaign",
    pageSubtitle: "Create AI outreach emails for clients.",
    cardTitle: "Client Campaign Details",
    breadcrumb: "Campaign",
  },
};

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const primaryButtonStyle: React.CSSProperties = {
  background: COLOR_PRIMARY,
  borderColor: COLOR_PRIMARY,
  color: "#ffffff",
  fontWeight: 700,
  height: 46,
  borderRadius: 10,
  boxShadow: "0 10px 20px rgba(0, 140, 186, 0.18)",
};

const successButtonStyle: React.CSSProperties = {
  background: COLOR_SUCCESS,
  borderColor: COLOR_SUCCESS,
  color: "#ffffff",
  fontWeight: 700,
  height: 46,
  borderRadius: 10,
  boxShadow: "0 10px 20px rgba(26, 179, 148, 0.18)",
};

const cardStyle: React.CSSProperties = {
  borderRadius: 18,
  border: `1px solid ${COLOR_BORDER}`,
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
  overflow: "hidden",
};

const EmailCampaign: React.FC = () => {
  const screens = useBreakpoint();
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [campaignResult, setCampaignResult] = useState<CampaignResponse | null>(
    null,
  );
  const [uploadLoading, setUploadLoading] = useState(false);
  const [campaignLoading, setCampaignLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [campaignError, setCampaignError] = useState("");
  const [activeSection, setActiveSection] = useState<SectionKey>("upload");
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const expandedWidth = 250;
  const collapsedWidth = isMobile ? 0 : 80;
  const effectiveSidebarWidth = screens.xs
    ? 0
    : collapsed
      ? collapsedWidth
      : expandedWidth;

  const meta = SECTION_META[activeSection];

  const isCampaignFormValid =
    clientName.trim().length > 0 &&
    clientEmail.trim().length > 0 &&
    isValidEmail(clientEmail);

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

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setUploadError("");
      return true;
    }

    setUploadError("Please choose a valid PDF file.");
    return false;
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError("Please select a PDF file before uploading.");
      return;
    }

    setUploadLoading(true);
    setUploadError("");

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(`${BASE_URL}/pdf/upload`, {
        method: "POST",
        body: fd,
      });

      const data: UploadResponse = await res.json();

      if (data.success) {
        setUploadResult(data);
      } else {
        setUploadError(data.message || "Upload failed. Please try again.");
      }
    } catch {
      setUploadError("Network error. Please check your connection and retry.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSendCampaign = async () => {
    if (!clientName.trim()) {
      setCampaignError("Please enter the client full name.");
      return;
    }

    if (!clientEmail.trim()) {
      setCampaignError("Please enter the client email address.");
      return;
    }

    if (!isValidEmail(clientEmail)) {
      setCampaignError("Please enter a valid email address.");
      return;
    }

    setCampaignLoading(true);
    setCampaignError("");

    try {
      const res = await fetch(`${BASE_URL}/email/send-campaign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim(),
        }),
      });

      const data: CampaignResponse = await res.json();

      if (data.success) {
        setCampaignResult(data);
      } else {
        setCampaignError(
          data.message || "Campaign could not be sent. Please try again.",
        );
      }
    } catch {
      setCampaignError(
        "Network error. Please check your connection and retry.",
      );
    } finally {
      setCampaignLoading(false);
    }
  };

  const resetUploadSection = () => {
    setFile(null);
    setUploadResult(null);
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetCampaignSection = () => {
    setClientName("");
    setClientEmail("");
    setCampaignResult(null);
    setCampaignError("");
  };

  const onMenuClick: MenuProps["onClick"] = ({ key }) => {
    setActiveSection(key as SectionKey);
    if (isMobile) setCollapsed(true);
  };

  const uploadFileList: UploadFile[] = file
    ? [
        {
          uid: "-1",
          name: file.name,
          status: "done",
          size: file.size,
        },
      ]
    : [];

  const sidebarStyles: React.CSSProperties = {
    position: "fixed",
    height: "100vh",
    zIndex: 1000,
    top: 0,
    left: isMobile && collapsed ? -expandedWidth : 0,
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

  const renderPageHeader = () => (
    <div
      className="ec-top-row"
      style={{
        display: "flex",
        alignItems: screens.xs ? "flex-start" : "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        marginBottom: screens.xs ? 18 : 24,
      }}
    >
      <div style={{ flex: 1, minWidth: 260 }}>
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
  );

  const renderUploadPanel = () => (
    <Card
      className="ec-pro-card"
      title={
        <Space>
          <FilePdfOutlined style={{ color: COLOR_PRIMARY }} />
          <Text strong style={{ fontSize: 16, color: COLOR_TEXT }}>
            {SECTION_META.upload.cardTitle}
          </Text>
        </Space>
      }
      style={cardStyle}
      styles={{
        header: {
          background: "#ffffff",
          borderBottom: `1px solid ${COLOR_BORDER}`,
          minHeight: 58,
        },
        body: { padding: screens.xs ? 16 : 24 },
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        style={{ display: "none" }}
        onChange={(event) => {
          const selectedFile = event.target.files?.[0];
          if (selectedFile) handleFileSelect(selectedFile);
        }}
      />

      <Form layout="vertical" requiredMark={false}>
        <Form.Item
          label={
            <span className="ec-form-label">
              PDF Document <span className="ec-required">*</span>
            </span>
          }
          extra={
            <span className="ec-form-hint">
              Upload only PDF files. Recommended file size: below 10 MB.
            </span>
          }
        >
          <Dragger
            className="ec-upload-dragger"
            accept=".pdf"
            multiple={false}
            fileList={uploadFileList}
            beforeUpload={(selectedFile) => {
              handleFileSelect(selectedFile);
              return false;
            }}
            onRemove={() => {
              setFile(null);
              setUploadResult(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          >
            <p className="ant-upload-drag-icon">
              <FilePdfOutlined style={{ color: COLOR_PRIMARY, fontSize: 44 }} />
            </p>
            <p className="ant-upload-text" style={{ fontWeight: 700 }}>
              Drop your PDF here
            </p>
            <p className="ant-upload-hint">
              or click to browse and select one file
            </p>
          </Dragger>
        </Form.Item>
      </Form>

      {uploadResult && (
        <Alert
          type="success"
          showIcon
          icon={<CheckCircleOutlined />}
          message="PDF uploaded successfully"
          description={`"${uploadResult.fileName}" is indexed with ${uploadResult.chunksStored} chunk${
            uploadResult.chunksStored !== 1 ? "s" : ""
          }.`}
          style={{ marginBottom: 16, borderRadius: 12 }}
        />
      )}

      {uploadError && (
        <Alert
          type="error"
          message={uploadError}
          showIcon
          style={{ marginBottom: 16, borderRadius: 12 }}
        />
      )}

      <Button
        type="primary"
        size="large"
        block
        className="ec-primary-btn"
        icon={<UploadOutlined />}
        loading={uploadLoading}
        disabled={!file}
        onClick={handleUpload}
        style={primaryButtonStyle}
      >
        Upload PDF
      </Button>

      {uploadResult && (
        <Button
          block
          size="large"
          className="ec-outline-btn"
          onClick={resetUploadSection}
          style={{ marginTop: 12 }}
        >
          Upload Another PDF
        </Button>
      )}

      
    </Card>
  );

  const renderCampaignPanel = () => (
    <Card
      className="ec-pro-card"
      title={
        <Space>
          <MailOutlined style={{ color: COLOR_PRIMARY }} />
          <Text strong style={{ fontSize: 16, color: COLOR_TEXT }}>
            {SECTION_META.campaign.cardTitle}
          </Text>
        </Space>
      }
      style={cardStyle}
      styles={{
        header: {
          background: "#ffffff",
          borderBottom: `1px solid ${COLOR_BORDER}`,
          minHeight: 58,
        },
        body: { padding: screens.xs ? 16 : 24 },
      }}
    >
      {!campaignResult ? (
        <Form layout="vertical" requiredMark={false}>
          <Form.Item
            label={
              <span className="ec-form-label">
                Client Full Name <span className="ec-required">*</span>
              </span>
            }
            extra={
              <span className="ec-form-hint">
                Enter the recipient name for personalization.
              </span>
            }
          >
            <Input
              size="large"
              className="ec-form-input"
              prefix={<UserOutlined style={{ color: "#9ca3af" }} />}
              placeholder="Example: John Smith"
              value={clientName}
              onChange={(event) => {
                setClientName(event.target.value);
                setCampaignError("");
              }}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="ec-form-label">
                Client Email Address <span className="ec-required">*</span>
              </span>
            }
            extra={
              <span className="ec-form-hint">
                The campaign email will be sent to this address.
              </span>
            }
          >
            <Input
              size="large"
              className="ec-form-input"
              type="email"
              prefix={<MailOutlined style={{ color: "#9ca3af" }} />}
              placeholder="Example: john@company.com"
              value={clientEmail}
              onChange={(event) => {
                setClientEmail(event.target.value);
                setCampaignError("");
              }}
            />
          </Form.Item>

          {campaignError && (
            <Alert
              type="error"
              message={campaignError}
              showIcon
              style={{ marginBottom: 16, borderRadius: 12 }}
            />
          )}

          <Button
            type="primary"
            size="large"
            block
            className="ec-success-btn"
            icon={<RocketOutlined />}
            loading={campaignLoading}
            disabled={!isCampaignFormValid}
            onClick={handleSendCampaign}
            style={successButtonStyle}
          >
            Send Campaign
          </Button>
        </Form>
      ) : (
        <>
          <Card
            className="ec-success-card"
            style={{
              border: "1px solid rgba(26, 179, 148, 0.24)",
              background: "rgba(26, 179, 148, 0.08)",
              marginBottom: 16,
              borderRadius: 14,
              boxShadow: "0 8px 20px rgba(26, 179, 148, 0.10)",
            }}
            styles={{ body: { padding: screens.xs ? 14 : 18 } }}
          >
            <Space align="start">
              <CheckCircleOutlined
                style={{ fontSize: 26, color: COLOR_SUCCESS }}
              />
              <div>
                <Title level={5} style={{ margin: 0, color: "#0f766e" }}>
                  Campaign sent for approval
                </Title>
                <Text style={{ color: "#0f766e" }}>
                  {campaignResult.message}
                </Text>
              </div>
            </Space>
          </Card>

          <Card
            size="small"
            title={
              <Text strong style={{ color: COLOR_PRIMARY }}>
                Generated Email Preview
              </Text>
            }
            style={{
              marginBottom: 16,
              background: "#ffffff",
              borderRadius: 14,
              border: `1px solid ${COLOR_BORDER}`,
              boxShadow: "0 8px 18px rgba(15, 23, 42, 0.05)",
            }}
          >
            <Form.Item
              label={
                <Text
                  type="secondary"
                  style={{ fontSize: 12, fontWeight: 700 }}
                >
                  SUBJECT
                </Text>
              }
              style={{ marginBottom: 16 }}
            >
              <Paragraph strong style={{ margin: 0, color: COLOR_TEXT }}>
                {campaignResult.generatedEmail.subject}
              </Paragraph>
            </Form.Item>

            <Form.Item
              label={
                <Text
                  type="secondary"
                  style={{ fontSize: 12, fontWeight: 700 }}
                >
                  EMAIL BODY
                </Text>
              }
              style={{ marginBottom: 0 }}
            >
              <Paragraph
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  maxHeight: 340,
                  overflow: "auto",
                  background: "#f9fafb",
                  border: `1px solid ${COLOR_BORDER}`,
                  borderRadius: 12,
                  padding: 14,
                  color: "#374151",
                  lineHeight: 1.7,
                }}
              >
                {campaignResult.generatedEmail.body}
              </Paragraph>
            </Form.Item>
          </Card>
        </>
      )}

      {campaignResult && (
        <Button
          block
          size="large"
          type="primary"
          className="ec-primary-btn"
          onClick={resetCampaignSection}
          style={primaryButtonStyle}
        >
          Create New Campaign
        </Button>
      )}
    </Card>
  );

  return (
    <Layout className="ec-mail-layout" style={{ minHeight: "100vh" }}>
      {isMobile && !collapsed && (
        <div
          onClick={closeMobileSidebar}
          role="presentation"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(17, 24, 39, 0.38)",
            zIndex: 950,
          }}
        />
      )}

      <Sider
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="md"
        onBreakpoint={(broken) => {
          if (broken) setCollapsed(true);
        }}
        width={expandedWidth}
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
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 20,
              background: "#f3f4f6",
              border: `1px solid ${COLOR_BORDER}`,
              color: COLOR_TEXT,
              width: 32,
              height: 32,
              borderRadius: 10,
              cursor: "pointer",
              lineHeight: 1,
              fontSize: 18,
            }}
          >
            ×
          </button>
        )}

        <div className="ec-sidebar-brand">
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
            {renderPageHeader()}

            <Spin
              spinning={
                activeSection === "upload" ? uploadLoading : campaignLoading
              }
            >
              {activeSection === "upload"
                ? renderUploadPanel()
                : renderCampaignPanel()}
            </Spin>
          </div>
        </Content>

        <Footer style={footerStyles}>
          <Text style={{ fontSize: 13, color: COLOR_MUTED }}>
            <strong style={{ color: COLOR_PRIMARY }}>OxyMail AI</strong> ©{" "}
            {new Date().getFullYear()} · Secure professional outreach
          </Text>
        </Footer>
      </Layout>

      <style>{`
        .ec-mail-layout,
        .ec-mail-layout .ant-layout,
        .ec-mail-layout .ant-layout-content {
          background: #ffffff !important;
        }

        .ec-page-container {
          width: 100%;
          max-width: 1152px;
          margin: 0 auto;
        }

        .ec-sidebar-brand {
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: ${collapsed && !isMobile ? "center" : "flex-start"};
          gap: 10px;
          padding: ${collapsed && !isMobile ? "0" : "0 18px"};
          border-bottom: 1px solid ${COLOR_BORDER};
          background: #ffffff;
        }

        .ec-brand-icon {
          width: 38px;
          height: 38px;
      
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: ${COLOR_PRIMARY};
         flex: 0 0 auto;
        }

        .ec-side-menu .ant-menu-item {
          height: 44px !important;
          line-height: 44px !important;
          border-radius: 12px !important;
          margin: 6px 0 !important;
          color: #4b5563 !important;
          font-weight: 600 !important;
        }

        .ec-side-menu .ant-menu-item .anticon {
          color: #6b7280 !important;
        }

        .ec-side-menu .ant-menu-item:hover {
          background: #f3f4f6 !important;
          color: #111827 !important;
        }

        .ec-side-menu .ant-menu-item:hover .anticon {
          color: ${COLOR_PRIMARY} !important;
        }

        .ec-side-menu .ant-menu-item-selected {
          background: ${COLOR_MENU_SELECTED} !important;
          color: #111827 !important;
         
        }

        .ec-side-menu .ant-menu-item-selected .anticon {
          color: ${COLOR_PRIMARY} !important;
        }

        .ec-menu-toggle {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          color: ${COLOR_PRIMARY} !important;
          background: rgba(0, 140, 186, 0.08) !important;
          border: 1px solid rgba(0, 140, 186, 0.18) !important;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .ec-form-label {
          font-size: 14px;
          font-weight: 700;
          color: ${COLOR_TEXT};
        }

        .ec-required {
          color: #ef4444;
          margin-left: 2px;
        }

        .ec-form-hint {
          font-size: 12px;
          color: ${COLOR_MUTED};
          line-height: 1.5;
        }

        .ec-form-input,
        .ec-form-input.ant-input-affix-wrapper {
          border-radius: 12px !important;
          border-color: #d1d5db !important;
          min-height: 46px;
          box-shadow: none !important;
        }

        .ec-form-input:hover,
        .ec-form-input.ant-input-affix-wrapper:hover {
          border-color: ${COLOR_PRIMARY} !important;
        }

        .ec-form-input:focus,
        .ec-form-input.ant-input-affix-wrapper-focused {
          border-color: ${COLOR_PRIMARY} !important;
          box-shadow: 0 0 0 3px rgba(0, 140, 186, 0.14) !important;
        }

        .ec-upload-dragger.ant-upload-drag {
          border-radius: 16px !important;
          border-color: #d1d5db !important;
          background: #f9fafb !important;
          padding: 22px 16px !important;
        }

        .ec-upload-dragger.ant-upload-drag:hover {
          border-color: ${COLOR_PRIMARY} !important;
          background: rgba(0, 140, 186, 0.08) !important;
        }

        .ec-upload-dragger .ant-upload-text {
          color: ${COLOR_TEXT};
          font-size: 15px;
        }

        .ec-upload-dragger .ant-upload-hint {
          color: ${COLOR_MUTED};
        }

        .ec-helper-row {
          margin-top: 18px;
          display: flex;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .ec-primary-btn.ant-btn-primary:not(:disabled) {
          background: ${COLOR_PRIMARY} !important;
          border-color: ${COLOR_PRIMARY} !important;
          color: #ffffff !important;
        }

        .ec-success-btn.ant-btn-primary:not(:disabled) {
          background: ${COLOR_SUCCESS} !important;
          border-color: ${COLOR_SUCCESS} !important;
          color: #ffffff !important;
        }

        .ec-primary-btn.ant-btn-primary:not(:disabled):hover {
          background: ${COLOR_PRIMARY_DARK} !important;
          border-color: ${COLOR_PRIMARY_DARK} !important;
          color: #ffffff !important;
        }

        .ec-success-btn.ant-btn-primary:not(:disabled):hover {
          background: #159b80 !important;
          border-color: #159b80 !important;
          color: #ffffff !important;
        }

        .ec-primary-btn.ant-btn-primary:disabled,
        .ec-success-btn.ant-btn-primary:disabled {
          color: rgba(255, 255, 255, 0.75) !important;
          background: #9ca3af !important;
          border-color: #9ca3af !important;
          box-shadow: none !important;
        }

        .ec-outline-btn.ant-btn {
          height: 44px;
          border-radius: 10px;
          font-weight: 700;
          color: ${COLOR_PRIMARY};
          border-color: rgba(0, 140, 186, 0.28);
          background: #ffffff;
        }

        .ec-outline-btn.ant-btn:hover {
          color: #ffffff !important;
          background: ${COLOR_PRIMARY} !important;
          border-color: ${COLOR_PRIMARY} !important;
        }

        .ec-pro-card .ant-card-head-title {
          padding: 16px 0;
        }

        .ec-mail-layout .ant-layout-sider::-webkit-scrollbar {
          width: 6px;
        }

        .ec-mail-layout .ant-layout-sider::-webkit-scrollbar-track {
          background: #ffffff;
        }

        .ec-mail-layout .ant-layout-sider::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 10px;
        }

        @media (max-width: 768px) {
          .ec-page-container {
            max-width: 100%;
          }

          .ec-top-row .ant-breadcrumb {
            width: 100%;
            overflow-x: auto;
          }

          .ec-sidebar-brand {
            justify-content: flex-start !important;
            padding: 0 18px !important;
          }

          .ec-pro-card {
            border-radius: 14px !important;
          }
        }

        @media (max-width: 480px) {
          .ec-mail-layout .ant-card-head {
            padding: 0 14px !important;
          }

          .ec-mail-layout .ant-card-body {
            padding: 14px !important;
          }

          .ec-upload-dragger.ant-upload-drag {
            padding: 16px 10px !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default EmailCampaign;
