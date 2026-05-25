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
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";

const { Header, Sider, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;
const { useBreakpoint } = Grid;

const BASE_URL = "https://mailautomation-production.up.railway.app/api/v1";

const COLOR_PRIMARY = "#008cba";
const COLOR_SUCCESS = "#1ab394";

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
  }
> = {
  upload: {
    sidebarLabel: "Upload PDF",
    pageTitle: "Company PDF Upload",
    pageSubtitle:
      "Add your company brochure or profile PDF. Our AI will read and index it so future emails can mention your services accurately.",
    cardTitle: "Select & Upload PDF File",
  },
  campaign: {
    sidebarLabel: "Email Campaign",
    pageTitle: "Send Email Campaign",
    pageSubtitle:
      "Enter your client’s name and email. AI will draft a personalized outreach message and send it for your approval.",
    cardTitle: "Client Details for Campaign",
  },
};

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const btnPrimaryStyle: React.CSSProperties = {
  background: COLOR_PRIMARY,
  borderColor: COLOR_PRIMARY,
  color: "#ffffff",
  fontWeight: 600,
  height: 48,
  borderRadius: 8,
  letterSpacing: "0.02em",
};

const btnSuccessStyle: React.CSSProperties = {
  background: COLOR_SUCCESS,
  borderColor: COLOR_SUCCESS,
  color: "#ffffff",
  fontWeight: 600,
  height: 48,
  borderRadius: 8,
  letterSpacing: "0.02em",
};

const proCardStyles = {
  borderRadius: 12,
  boxShadow: "0 4px 20px rgba(15, 23, 42, 0.06)",
  border: "1px solid #e8ecf1",
};

const proCardHeadStyles = {
  borderBottom: "1px solid #eef2f6",
  background: "#fafbfc",
  minHeight: 52,
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

  const toggleCollapse = () => setCollapsed((prev) => !prev);

  const closeMobileSidebar = () => {
    if (isMobile && !collapsed) setCollapsed(true);
  };

  const onBreakpoint = (broken: boolean) => {
    if (broken) setCollapsed(true);
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
      setCampaignError("Please enter the client’s full name.");
      return;
    }

    if (!clientEmail.trim()) {
      setCampaignError("Please enter the client’s email address.");
      return;
    }

    if (!isValidEmail(clientEmail)) {
      setCampaignError(
        "Please enter a valid email address (e.g. name@company.com).",
      );
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
    padding: screens.xs ? "0 12px" : "0 24px",
    width: screens.xs ? "100%" : `calc(100% - ${effectiveSidebarWidth}px)`,
    marginLeft: screens.xs ? 0 : effectiveSidebarWidth,
    position: "fixed",
    top: 0,
    zIndex: 900,
    height: 64,
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #f0f0f0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    transition: "margin-left 0.25s ease-in-out, width 0.25s ease-in-out",
  };

  const contentStyles: React.CSSProperties = {
    padding: screens.xs ? 12 : screens.md ? 20 : 24,
    width: screens.xs ? "100%" : `calc(100% - ${effectiveSidebarWidth}px)`,
    marginLeft: screens.xs ? 0 : effectiveSidebarWidth,
    marginTop: 64,
    minHeight: "calc(100vh - 64px - 56px)",
    background: "#f5f7fb",
    transition: "margin-left 0.25s ease-in-out, width 0.25s ease-in-out",
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

  const meta = SECTION_META[activeSection];
  const isCampaignFormValid =
    clientName.trim().length > 0 &&
    clientEmail.trim().length > 0 &&
    isValidEmail(clientEmail);

  const renderPageHeading = () => (
    <div
      className="ec-page-heading"
      style={{ marginBottom: screens.xs ? 20 : 28 }}
    >
      <Title
        level={screens.xs ? 4 : 3}
        className="ec-page-title"
        style={{ marginBottom: 8, color: "#0f172a", fontWeight: 700 }}
      >
        {meta.pageTitle}
      </Title>
      <Paragraph
        className="ec-page-subtitle"
        style={{
          margin: 0,
          fontSize: screens.xs ? 14 : 15,
          color: "#64748b",
          lineHeight: 1.65,
          maxWidth: 640,
        }}
      >
        {meta.pageSubtitle}
      </Paragraph>
    </div>
  );

  const renderUploadPanel = () => (
    <Card
      className="ec-pro-form-card"
      title={
        <Text strong style={{ fontSize: 16, color: "#1a202c" }}>
          {SECTION_META.upload.cardTitle}
        </Text>
      }
      style={proCardStyles}
      styles={{
        header: proCardHeadStyles,
        body: { padding: "20px 24px 24px" },
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFileSelect(f);
        }}
      />

      <Form layout="vertical" requiredMark={false} className="ec-pro-form">
        <Form.Item
          className="ec-form-field"
          label={
            <span className="ec-form-label">
              PDF Document <span className="ec-required">*</span>
            </span>
          }
          extra={
            <span className="ec-form-hint">
              Drag and drop or browse — PDF format only, up to 10 MB
            </span>
          }
        >
          <Dragger
            className="ec-upload-dragger"
            accept=".pdf"
            multiple={false}
            fileList={uploadFileList}
            beforeUpload={(f) => {
              handleFileSelect(f);
              return false;
            }}
            onRemove={() => {
              setFile(null);
              setUploadResult(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          >
            <p className="ant-upload-drag-icon">
              <FilePdfOutlined style={{ color: COLOR_PRIMARY, fontSize: 48 }} />
            </p>
            <p className="ant-upload-text" style={{ fontWeight: 600 }}>
              Drop your PDF here
            </p>
            <p className="ant-upload-hint">or click to browse files</p>
          </Dragger>
        </Form.Item>
      </Form>

      {uploadResult && (
        <Alert
          type="success"
          showIcon
          icon={<CheckCircleOutlined />}
          message="Upload complete"
          description={`“${uploadResult.fileName}” is indexed (${uploadResult.chunksStored} chunk${uploadResult.chunksStored !== 1 ? "s" : ""}). You can upload another file anytime.`}
          style={{ marginBottom: 16 }}
        />
      )}

      {uploadError && (
        <Alert
          type="error"
          message={uploadError}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Button
        type="primary"
        size="large"
        block
        className="ec-btn-primary"
        icon={<UploadOutlined />}
        loading={uploadLoading}
        disabled={!file}
        onClick={handleUpload}
        style={btnPrimaryStyle}
      >
        Upload PDF to Server
      </Button>

      {uploadResult && (
        <Button
          block
          size="large"
          className="ec-btn-outline"
          onClick={resetUploadSection}
          style={{ marginTop: 12 }}
        >
          Upload Another PDF
        </Button>
      )}

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <Space
          split={<span style={{ color: "#d9d9d9" }}>·</span>}
          size="middle"
          wrap
        >
          <Text type="secondary" style={{ fontSize: 12 }}>
            Encrypted transfer
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            AI-ready indexing
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            PDF only
          </Text>
        </Space>
      </div>
    </Card>
  );

  const renderCampaignPanel = () => (
    <Card
      className="ec-pro-form-card"
      title={
        <Text strong style={{ fontSize: 16, color: "#1a202c" }}>
          {SECTION_META.campaign.cardTitle}
        </Text>
      }
      style={proCardStyles}
      styles={{
        header: proCardHeadStyles,
        body: { padding: "20px 24px 24px" },
      }}
    >
      {!campaignResult ? (
        <Form layout="vertical" requiredMark={false} className="ec-pro-form">
          <Form.Item
            className="ec-form-field"
            label={
              <span className="ec-form-label">
                Client Full Name <span className="ec-required">*</span>
              </span>
            }
            extra={
              <span className="ec-form-hint">
                The person you are reaching out to
              </span>
            }
          >
            <Input
              size="large"
              className="ec-form-input"
              prefix={<UserOutlined style={{ color: "#94a3b8" }} />}
              placeholder="e.g. John Smith"
              value={clientName}
              onChange={(e) => {
                setClientName(e.target.value);
                setCampaignError("");
              }}
            />
          </Form.Item>

          <Form.Item
            className="ec-form-field"
            label={
              <span className="ec-form-label">
                Client Email Address <span className="ec-required">*</span>
              </span>
            }
            extra={
              <span className="ec-form-hint">
                Where the campaign email will be addressed
              </span>
            }
          >
            <Input
              size="large"
              className="ec-form-input"
              type="email"
              prefix={<MailOutlined style={{ color: "#94a3b8" }} />}
              placeholder="e.g. john.smith@company.com"
              value={clientEmail}
              onChange={(e) => {
                setClientEmail(e.target.value);
                setCampaignError("");
              }}
            />
          </Form.Item>

          {campaignError && (
            <Alert
              type="error"
              message={campaignError}
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Button
            type="primary"
            size="large"
            block
            className="ec-btn-success"
            icon={<RocketOutlined />}
            loading={campaignLoading}
            disabled={!isCampaignFormValid}
            onClick={handleSendCampaign}
            style={btnSuccessStyle}
          >
      Send Campaign
          </Button>
        </Form>
      ) : (
        <>
          <Card
            style={{
              background: `linear-gradient(135deg, ${COLOR_PRIMARY}, ${COLOR_SUCCESS})`,
              border: "none",
              marginBottom: 16,
            }}
            styles={{ body: { padding: "16px 20px" } }}
          >
            <Space align="start" wrap>
              <CheckCircleOutlined style={{ fontSize: 28, color: "#fff" }} />
              <div>
                <Title level={5} style={{ color: "#fff", margin: 0 }}>
                  Campaign sent for approval
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.9)" }}>
                  {campaignResult.message}
                </Text>
              </div>
            </Space>
          </Card>

          <Card
            size="small"
            title={
              <Text strong style={{ color: COLOR_PRIMARY }}>
                Generated email preview
              </Text>
            }
            style={{ marginBottom: 16, background: "#f8fafc" }}
          >
            <Form.Item
              label={
                <Text
                  type="secondary"
                  style={{ fontSize: 12, fontWeight: 600 }}
                >
                  SUBJECT LINE
                </Text>
              }
              style={{ marginBottom: 16 }}
            >
              <Paragraph strong style={{ margin: 0, color: "#1a202c" }}>
                {campaignResult.generatedEmail.subject}
              </Paragraph>
            </Form.Item>

            <Form.Item
              label={
                <Text
                  type="secondary"
                  style={{ fontSize: 12, fontWeight: 600 }}
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
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: 14,
                  color: "#475569",
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
          className="ec-btn-primary"
          onClick={resetCampaignSection}
          style={{ ...btnPrimaryStyle, marginTop: 4 }}
        > Submit Campaign
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
        theme="dark"
        trigger={null}
        style={siderStyles}
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
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: 24,
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        )}

        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: collapsed && !isMobile ? 14 : 16,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            padding: "0 16px",
            gap: 8,
          }}
        >
          <ThunderboltOutlined style={{ color: COLOR_PRIMARY }} />
          {(!collapsed || isMobile) && <span>OxyMail AI</span>}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeSection]}
          items={menuItems}
          onClick={onMenuClick}
          style={{ borderRight: 0, marginTop: 8, background: "transparent" }}
        />
      </Sider>

      <Layout>
        <Header style={headerStyles}>
          <Space align="center" wrap>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleCollapse}
              aria-label={collapsed ? "Expand menu" : "Collapse menu"}
              style={{ fontSize: 18, color: COLOR_PRIMARY }}
            />
            <Text type="secondary" style={{ fontSize: 13 }}>
              OxyMail AI
            </Text>
          </Space>
          <Tag
            style={{
              color: COLOR_PRIMARY,
              borderColor: COLOR_PRIMARY,
              background: "rgba(0, 140, 186, 0.08)",
            }}
          >
            <ThunderboltOutlined /> {screens.xs ? "AI" : "AI Powered"}
          </Tag>
        </Header>

        <Content style={contentStyles}>
          <div style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}>
            {renderPageHeading()}

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
          <Text style={{ fontSize: 13, color: "#6b7280" }}>
            <strong style={{ color: COLOR_PRIMARY }}>OxyMail AI</strong> ©
            {new Date().getFullYear()} · Secure · Professional outreach
          </Text>
        </Footer>
      </Layout>

      <style>{`
        .ec-mail-layout .ant-layout-sider,
        .ec-mail-layout .ant-menu-dark,
        .ec-mail-layout .ant-menu-dark .ant-menu-sub {
          background: #1a202c !important;
        }

        .ec-mail-layout .ant-menu-dark .ant-menu-item,
        .ec-mail-layout .ant-menu-dark .ant-menu-submenu-title {
          color: #e2e8f0 !important;
        }

        .ec-mail-layout .ant-menu-dark .ant-menu-item:hover,
        .ec-mail-layout .ant-menu-dark .ant-menu-submenu-title:hover,
        .ec-mail-layout .ant-menu-dark .ant-menu-item-selected {
          background-color: #2d3748 !important;
          color: #ffffff !important;
        }

        .ec-mail-layout .ant-menu-dark .ant-menu-item-selected {
          border-right: 3px solid ${COLOR_PRIMARY} !important;
        }

        .ec-mail-layout .ant-menu-dark .ant-menu-item:hover span,
        .ec-mail-layout .ant-menu-dark .ant-menu-item-selected span,
        .ec-mail-layout .ant-menu-dark .ant-menu-submenu-title:hover span {
          color: #ffffff !important;
        }

        .ec-mail-layout .ec-form-label {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          display: block;
        }

        .ec-mail-layout .ec-required {
          color: #ef4444;
          margin-left: 2px;
        }

        .ec-mail-layout .ec-form-hint {
          font-size: 12px;
          color: #64748b;
          line-height: 1.5;
        }

        .ec-mail-layout .ec-pro-form .ec-form-field {
          margin-bottom: 20px;
        }

        .ec-mail-layout .ec-pro-form .ec-form-field .ant-form-item-label {
          padding-bottom: 6px;
        }

        .ec-mail-layout .ec-form-input,
        .ec-mail-layout .ec-form-input.ant-input-affix-wrapper {
          border-radius: 8px;
          border-color: #d1d9e0;
          min-height: 44px;
        }

        .ec-mail-layout .ec-form-input:hover,
        .ec-mail-layout .ec-form-input.ant-input-affix-wrapper:hover {
          border-color: ${COLOR_PRIMARY};
        }

        .ec-mail-layout .ec-upload-dragger.ant-upload-drag {
          border-radius: 10px;
          border-color: #d1d9e0;
          background: #f8fafc;
          padding: 20px 16px;
        }

        .ec-mail-layout .ec-upload-dragger .ant-upload-text {
          color: #334155;
          font-size: 15px;
        }

        .ec-mail-layout .ec-upload-dragger .ant-upload-hint {
          color: #64748b;
        }

        .ec-mail-layout .ec-btn-primary.ant-btn-primary,
        .ec-mail-layout .ec-btn-success.ant-btn-primary {
          color: #ffffff !important;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        }

        .ec-mail-layout .ec-btn-primary.ant-btn-primary:not(:disabled) {
          background: ${COLOR_PRIMARY} !important;
          border-color: ${COLOR_PRIMARY} !important;
        }

        .ec-mail-layout .ec-btn-success.ant-btn-primary:not(:disabled) {
          background: ${COLOR_SUCCESS} !important;
          border-color: ${COLOR_SUCCESS} !important;
        }

        .ec-mail-layout .ec-btn-primary.ant-btn-primary:not(:disabled):hover,
        .ec-mail-layout .ec-btn-success.ant-btn-primary:not(:disabled):hover {
          color: #ffffff !important;
          opacity: 0.92;
          filter: brightness(1.05);
        }

        .ec-mail-layout .ec-btn-primary.ant-btn-primary .anticon,
        .ec-mail-layout .ec-btn-success.ant-btn-primary .anticon,
        .ec-mail-layout .ec-btn-primary.ant-btn-primary span,
        .ec-mail-layout .ec-btn-success.ant-btn-primary span {
          color: #ffffff !important;
        }

        .ec-mail-layout .ec-btn-primary.ant-btn-primary:disabled,
        .ec-mail-layout .ec-btn-success.ant-btn-primary:disabled {
          color: rgba(255, 255, 255, 0.65) !important;
          background: #94a3b8 !important;
          border-color: #94a3b8 !important;
        }

        .ec-mail-layout .ec-btn-outline.ant-btn {
          height: 44px;
          border-radius: 8px;
          font-weight: 600;
          color: ${COLOR_PRIMARY};
          border-color: ${COLOR_PRIMARY};
          background: #fff;
        }

        .ec-mail-layout .ec-btn-outline.ant-btn:hover {
          color: #ffffff !important;
          background: ${COLOR_PRIMARY} !important;
          border-color: ${COLOR_PRIMARY} !important;
        }

        .ec-mail-layout .ant-upload-drag:hover,
        .ec-mail-layout .ec-upload-dragger.ant-upload-drag:hover {
          border-color: ${COLOR_PRIMARY} !important;
          background: rgba(0, 140, 186, 0.04) !important;
        }

        .ec-mail-layout .ec-form-input:focus,
        .ec-mail-layout .ec-form-input.ant-input-affix-wrapper-focused {
          border-color: ${COLOR_PRIMARY} !important;
          box-shadow: 0 0 0 2px rgba(0, 140, 186, 0.15) !important;
        }

        .ec-mail-layout .ant-layout-sider::-webkit-scrollbar {
          width: 6px;
        }
        .ec-mail-layout .ant-layout-sider::-webkit-scrollbar-track {
          background: #1a202c;
        }
        .ec-mail-layout .ant-layout-sider::-webkit-scrollbar-thumb {
          background-color: #4a5568;
          border-radius: 10px;
        }

        .ec-mail-layout .ant-layout-sider {
          scrollbar-width: thin;
          scrollbar-color: #4a5568 #1a202c;
        }
      `}</style>
    </Layout>
  );
};

export default EmailCampaign;
