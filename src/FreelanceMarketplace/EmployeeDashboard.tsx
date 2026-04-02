import React, { useState, useEffect } from "react";
import {
  Table,
  Space,
  Form,
  Input,
  Button,
  message,
  Typography,
  Spin,
  Row,
  Col,
  Tag,
  Modal,
  Avatar,
  Empty,
  Tooltip,
  Card,
} from "antd";
import axios from "axios";
import BASE_URL from "../Config";
import { useNavigate } from "react-router-dom";
import {
  EditOutlined,
  SaveOutlined,
  EnvironmentOutlined,
  ShopOutlined,
  PlusOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { freelanceApi } from "../utils/axiosInstances";
import EmployeeLayout from "./EmployeeLayout";

const { Title, Text } = Typography;

interface CompanyProfile {
  id: string;
  userId: string | null;
  companyName: string;
  companyLocation: string;
  companyLogo?: string | null;
  companyStatus?: string;
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode; bg: string; border: string }> = {
  APPROVED: {
    color: "#52c41a",
    icon: <CheckCircleOutlined />,
    bg: "#f6ffed",
    border: "#b7eb8f",
  },
  PENDING: {
    color: "#faad14",
    icon: <ClockCircleOutlined />,
    bg: "#fffbe6",
    border: "#ffe58f",
  },
  REJECTED: {
    color: "#ff4d4f",
    icon: <ExclamationCircleOutlined />,
    bg: "#fff2f0",
    border: "#ffccc7",
  },
};

const EmployeeDashboard: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [profiles, setProfiles] = useState<CompanyProfile[]>([]);
  const [editingProfile, setEditingProfile] = useState<CompanyProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isRequirementModalOpen, setIsRequirementModalOpen] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [requirementForm] = Form.useForm();
  const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobileScreen(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchCompanyProfiles();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);
const userId = sessionStorage.getItem("userId");



  const fetchCompanyProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
     

      const response = await freelanceApi.get<CompanyProfile[]>(
        `${BASE_URL}/user-service/showingCompanyDetailsBasedOnUserId?userId=${userId}`
      );

      if (response.data && response.data.length > 0) {
        setProfiles(response.data);
      } else {
        setProfiles([]);
      }
    } catch (err: any) {
      let errorMessage = "Failed to load company profiles.";
      if (axios.isAxiosError(err)) {
        errorMessage = 
          err.response?.data?.message || 
          err.response?.data?.error || 
          err.message || 
          "Failed to load profiles.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (profile: CompanyProfile) => {
    setEditingProfile(profile);
    setIsCreating(false);
    form.setFieldsValue({
      companyName: profile.companyName,
      companyLocation: profile.companyLocation,
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingProfile(null);
    setIsCreating(true);
    form.resetFields();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProfile(null);
    setIsCreating(false);
    form.resetFields();
  };

  const openRequirementModal = (profile: CompanyProfile) => {
    setEditingProfile(profile);
    requirementForm.resetFields();
    setIsRequirementModalOpen(true);
  };

  const closeRequirementModal = () => {
    setIsRequirementModalOpen(false);
    setEditingProfile(null);
    requirementForm.resetFields();
  };

  const handleSaveOrUpdate = async (values: any) => {
    try {
      setSubmitting(true);
     
      const userId = sessionStorage.getItem("userId");


      const payload: any = {
        companyName: values.companyName.trim(),
        companyLocation: values.companyLocation.trim(),
        userId: userId,
      };

      if (editingProfile?.id) {
        payload.id = editingProfile.id;
      }

      const response = await freelanceApi.patch(
        `${BASE_URL}/user-service/companyProfile`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        message.success(
          editingProfile?.id
            ? "Profile updated successfully"
            : "Company profile created successfully"
        );
        closeModal();
        fetchCompanyProfiles();
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        "An error occurred while saving.";
      message.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddRequirement = async (values: any) => {
    try {
      setSubmitting(true);
   
      const userId = sessionStorage.getItem("userId");

      if (!userId) {
        message.error("Session expired. Please login again.");
        return;
      }

      if (!editingProfile?.id) {
        message.error("Please select a company first.");
        return;
      }

      const payload = {
        budget: Number(values.budget),
        experience: values.experience.trim(),
        positions: Number(values.positions),
        title: values.title.trim(),
        skillName: values.skillName.trim(),
        companyId: editingProfile.id,
      };

      const response = await freelanceApi.patch(
        `${BASE_URL}/user-service/companyRequirement`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        message.success("Requirement published successfully");
        closeRequirementModal();
        fetchCompanyProfiles();
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        "Failed to add requirement.";
      message.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };
  const getStatus = (status?: string) => {
    const s = status?.toUpperCase() || "";
    return statusConfig[s] || statusConfig.PENDING;
  };

  if (loading) {
    return (
      <EmployeeLayout>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
          }}
        >
          <Spin size="large" tip="Loading profiles..." />
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <Title
            level={3}
            style={{ margin: 0, fontWeight: 700, color: "#1a1d2e" }}
          >
            Company Profiles
          </Title>
          <Text style={{ color: "#888", fontSize: 13 }}>
            Manage your company profiles and information
          </Text>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {/* <Tooltip title="Refresh">
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchCompanyProfiles}
              style={{ borderRadius: 10, height: 40, color: "#008cba", border: "1px solid #d4e8f0", background: "#f0f8fb" }}
            />
          </Tooltip> */}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
            style={{
              borderRadius: 10,
              height: 40,
              fontWeight: 600,
              background: "#008cba",
              border: "none",
              boxShadow: "0 4px 14px rgba(0, 140, 186, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!isMobileScreen && "Add Company"}
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ marginBottom: 32 }}>
        <Row gutter={[20, 20]}>
          <Col xs={24} sm={8}>
            <div
              style={{
                borderRadius: 20,
                padding: "24px",
                background: "#fff",
                boxShadow:
                  "0 10px 25px -5px rgba(0,0,0,0.04), 0 8px 10px -6px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                gap: 20,
                border: "1px solid #f0f0f0",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 14,
                  background:
                    "linear-gradient(135deg, #e8ecff 0%, #f0f3ff 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "inset 0 0 0 1px rgba(102, 126, 234, 0.1)",
                }}
              >
                <ShopOutlined style={{ color: "#667eea", fontSize: 24 }} />
              </div>
              <div style={{ zIndex: 1 }}>
                <Text
                  style={{
                    color: "#8c8c8c",
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  Total Companies
                </Text>
                <Title
                  level={3}
                  style={{ margin: 0, fontWeight: 800, color: "#1a1d2e" }}
                >
                  {profiles.length}
                </Title>
              </div>
              {/* <div style={{ position: "absolute", right: -15, bottom: -15, opacity: 0.03, fontSize: 80 }}>
                <ShopOutlined />
              </div> */}
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div
              style={{
                borderRadius: 20,
                padding: "24px",
                background: "#fff",
                boxShadow:
                  "0 10px 25px -5px rgba(0,0,0,0.04), 0 8px 10px -6px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                gap: 20,
                border: "1px solid #f0f0f0",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 14,
                  background:
                    "linear-gradient(135deg, #f6ffed 0%, #f9fff0 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "inset 0 0 0 1px rgba(82, 196, 26, 0.1)",
                }}
              >
                <CheckCircleOutlined
                  style={{ color: "#52c41a", fontSize: 24 }}
                />
              </div>
              <div style={{ zIndex: 1 }}>
                <Text
                  style={{
                    color: "#8c8c8c",
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  Approved
                </Text>
                <Title
                  level={3}
                  style={{ margin: 0, fontWeight: 800, color: "#1a1d2e" }}
                >
                  {
                    profiles.filter((p) => p.companyStatus === "APPROVED")
                      .length
                  }
                </Title>
              </div>
              {/* <div style={{ position: "absolute", right: -15, bottom: -15, opacity: 0.03, fontSize: 80 }}>
                <CheckCircleOutlined />
              </div> */}
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div
              style={{
                borderRadius: 20,
                padding: "24px",
                background: "#fff",
                boxShadow:
                  "0 10px 25px -5px rgba(0,0,0,0.04), 0 8px 10px -6px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                gap: 20,
                border: "1px solid #f0f0f0",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 14,
                  background:
                    "linear-gradient(135deg, #fffbe6 0%, #fffef0 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "inset 0 0 0 1px rgba(250, 173, 20, 0.1)",
                }}
              >
                <ClockCircleOutlined
                  style={{ color: "#faad14", fontSize: 24 }}
                />
              </div>
              <div style={{ zIndex: 1 }}>
                <Text
                  style={{
                    color: "#8c8c8c",
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  Pending
                </Text>
                <Title
                  level={3}
                  style={{ margin: 0, fontWeight: 800, color: "#1a1d2e" }}
                >
                  {
                    profiles.filter(
                      (p) => p.companyStatus === "PENDING" || !p.companyStatus,
                    ).length
                  }
                </Title>
              </div>
              {/* <div style={{ position: "absolute", right: -15, bottom: -15, opacity: 0.03, fontSize: 80 }}>
                <ClockCircleOutlined />
              </div> */}
            </div>
          </Col>
        </Row>
      </div>
      {/* Error Banner */}
      {error && (
        <div
          style={{
            background: "#fff2f0",
            border: "1px solid #ffccc7",
            borderRadius: 12,
            padding: "12px 16px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <ExclamationCircleOutlined
            style={{ color: "#ff4d4f", fontSize: 18 }}
          />
          <Text style={{ color: "#cf1322", flex: 1 }}>{error}</Text>
        </div>
      )}

      {/* Profiles Table */}
      <div
        style={{
          borderRadius: 16,
          background: "#fff",
          boxShadow: "0 10px 30px -5px rgba(0,0,0,0.05)",
          padding: "24px",
          border: "1px solid #f0f0f0",
          overflow: "hidden",
        }}
      >
        <Table
          dataSource={profiles}
          rowKey="id"
          bordered
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} companies`,
            style: { padding: "16px 20px" },
          }}
          columns={[
            {
              title: "S.No",
              key: "sno",
              width: 70,
              align: "center",
              render: (_: any, __: any, index: number) => (
                <Text style={{ fontWeight: 600, color: "#999" }}>
                  {index + 1}
                </Text>
              ),
            },
            {
              title: "Company",
              key: "company",
              align: "center",
              render: (record: CompanyProfile) => (
                <div>
                  <Text
                    strong
                    style={{
                      fontSize: 14,
                      display: "block",
                      color: "#1a1d2e",
                    }}
                  >
                    {record.companyName}
                  </Text>
                </div>
              ),
            },
            {
              title: "Location",
              dataIndex: "companyLocation",
              align: "center",
              key: "location",
              render: (text: string) => (
                <Space>
                  <EnvironmentOutlined style={{ color: "#888" }} />
                  <Text style={{ color: "#444" }}>{text}</Text>
                </Space>
              ),
            },
            {
              title: "Status",
              align: "center",
              dataIndex: "companyStatus",
              key: "status",

              render: (status?: string) => {
                const st = getStatus(status);
                return (
                  <Tag
                    icon={st.icon}
                    style={{
                      borderRadius: 6,
                      padding: "4px 12px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: st.color,
                      background: st.bg,
                      border: `1px solid ${st.border}`,
                      textTransform: "uppercase",
                    }}
                  >
                    {status || "PENDING"}
                  </Tag>
                );
              },
            },
            {
              title: "Code Name",
              align: "center",
              key: "codeName",
              render: (record: CompanyProfile) => (
                <div
                  style={{
                    background: "#f8f9ff",
                    borderRadius: 8,
                    padding: "4px 10px",
                    border: "1px solid #e8ecff",
                    display: "inline-block",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontWeight: 700,
                      color: "#667eea",
                      fontSize: 12,
                    }}
                  >
                    {(record.companyName || "")
                      .toUpperCase()
                      .replace(/\s+/g, "_")}
                  </Text>
                </div>
              ),
            },
            {
              title: "Action",
              key: "action",
              align: "center",
              render: (record: CompanyProfile) => (
                <Space size="middle">
                  <Tooltip title="Edit Profile">
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<EditOutlined />}
                      onClick={() => openEditModal(record)}
                      style={{
                        background: "#008cba",
                        border: "none",
                        boxShadow: "0 2px 8px rgba(0, 140, 186, 0.25)",
                      }}
                    >
                      {/* Edit Profile */}
                    </Button>
                  </Tooltip>
                  <Tooltip
                    title={
                      record.companyStatus === "APPROVED"
                        ? "Add Requirement"
                        : "Company must be APPROVED to add requirements"
                    }
                  >
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<PlusOutlined />}
                      onClick={() => openRequirementModal(record)}
                      disabled={record.companyStatus !== "APPROVED"}
                      style={{
                        background:
                          record.companyStatus === "APPROVED"
                            ? "#1ab394"
                            : "#f5f5f5",
                        border: "none",
                        boxShadow:
                          record.companyStatus === "APPROVED"
                            ? "0 2px 8px rgba(26, 179, 148, 0.25)"
                            : "none",
                      }}
                    >
                      {/* Add Requirement */}
                    </Button>
                  </Tooltip>
                  <Tooltip title="View Assigned Freelancers">
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<ShopOutlined />}
                      onClick={() =>
                        navigate(`/employee-assigned-freelancers/${record.id}`)
                      }
                      style={{
                        background: "#008cba",
                        border: "none",
                        boxShadow: "0 2px 8px rgba(0, 140, 186, 0.25)",
                      }}
                    >
                      {/* View Freelancers */}
                    </Button>
                  </Tooltip>
                </Space>
              ),
            },
          ]}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No company profiles found"
              >
                <Button type="primary" onClick={openCreateModal}>
                  Create Profile
                </Button>
              </Empty>
            ),
          }}
        />
      </div>

      <style>
        {`
          .ant-table-thead > tr > th {
            background: #fafbff !important;
            color: #1a1d2e !important;
            font-weight: 700 !important;
            text-transform: uppercase !important;
            font-size: 11px !important;
            letter-spacing: 0.5px !important;
            padding: 16px !important;
            border-bottom: 2px solid #f0f2f5 !important;
          }
          .ant-table-tbody > tr > td {
            padding: 16px !important;
          }
          .ant-table-row:hover {
            background-color: #fcfdff !important;
          }
        `}
      </style>

      {/* Edit / Create Modal */}
      <Modal
        title={isCreating ? "Create Company Profile" : "Edit Company Profile"}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        centered
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveOrUpdate}
          autoComplete="off"
          // requiredMark={false}
          size="large"
          style={{ marginTop: 8 }}
        >
          <Form.Item
            required
            label={
              <span style={{ fontWeight: 600, color: "#333" }}>
                Company Name
              </span>
            }
            name="companyName"
            rules={[
              {
                required: true,
                message: "Please enter the legal name of your company",
              },
              { min: 3, message: "Name must be at least 3 characters long" },
              { max: 100, message: "Name cannot exceed 100 characters" },
              {
                pattern: /^[a-zA-Z0-9\s&'-]+$/,
                message: "Only letters, numbers, and (&, ', -) are allowed",
              },
            ]}
          >
            <Input
              placeholder="e.g. Acme Corporation Pvt Ltd"
              style={{ borderRadius: 10, height: 44 }}
            />
          </Form.Item>

          <Form.Item
            required
            label={
              <span style={{ fontWeight: 600, color: "#333" }}>
                Headquarters Location
              </span>
            }
            name="companyLocation"
            rules={[
              {
                required: true,
                message: "Please provide the headquarters location",
              },
              { min: 2, message: "Location name is too short" },
              { max: 150, message: "Location name is too long" },
            ]}
          >
            <Input
              placeholder="e.g. Hyderabad, India"
              style={{ borderRadius: 10, height: 44 }}
            />
          </Form.Item>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 32,
              paddingTop: 20,
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              block
              size="large"
              style={{
                borderRadius: 10,
                background: "#008cba",
                border: "none",
                boxShadow: "0 4px 12px rgba(0, 140, 186, 0.25)",
              }}
            >
              {submitting
                ? "Saving..."
                : isCreating
                  ? "Create Business Profile"
                  : "Save Changes"}
            </Button>

            <Button
              size="large"
              onClick={closeModal}
              style={{ borderRadius: 10 }}
            >
              Discard
            </Button>
          </div>
        </Form>
      </Modal>
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div>
              <Text strong style={{ fontSize: 17 }}>
                Post New Requirement
              </Text>
              <br />
              <Text style={{ fontSize: 12, color: "#999" }}>
                Company:{" "}
                <span style={{ color: "#667eea", fontWeight: 600 }}>
                  {editingProfile?.companyName}
                </span>
              </Text>
            </div>
          </div>
        }
        open={isRequirementModalOpen}
        onCancel={closeRequirementModal}
        footer={null}
        centered
        width={560}
      >
        <Form
          form={requirementForm}
          layout="vertical"
          onFinish={handleAddRequirement}
          autoComplete="off"
          // requiredMark="optional"
          size="large"
          style={{ marginTop: 16 }}
        >
          <Form.Item
            label={<span style={{ fontWeight: 600 }}>Job Title / Role</span>}
            name="title"
            rules={[
              { required: true, message: "Please enter the job title" },
              { min: 5, message: "Title should be descriptive (min 5 chars)" },
            ]}
          >
            <Input
              placeholder="e.g. Lead Product Designer"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600 }}>Required Skills</span>}
                name="skillName"
                rules={[{ required: true, message: "Skills are mandatory" }]}
              >
                <Input
                  placeholder="e.g. React, Figma, Tailwind"
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600 }}>Experience</span>}
                name="experience"
                rules={[
                  { required: true, message: "Experience level is required" },
                ]}
              >
                <Input
                  placeholder="e.g. 4+ Years"
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                label={
                  <span style={{ fontWeight: 600 }}>Annual Budget (₹)</span>
                }
                name="budget"
                rules={[
                  { required: true, message: "Budget is required" },
                  { pattern: /^[1-9]\d*$/, message: "Invalid budget amount" },
                ]}
              >
                <Input type="number" prefix="₹" style={{ borderRadius: 10 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600 }}>Open Positions</span>}
                name="positions"
                rules={[
                  { required: true, message: "Position count is required" },
                  { pattern: /^[1-9]\d*$/, message: "Minimum 1 position" },
                ]}
              >
                <Input type="number" style={{ borderRadius: 10 }} />
              </Form.Item>
            </Col>
          </Row>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 32,
              paddingTop: 24,
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              size="large"
              style={{
                borderRadius: 8,
                fontWeight: 600,
                background: "#1ab394",
                border: "none",
                boxShadow: "0 4px 15px rgba(26, 179, 148, 0.3)",
                flex: 1,
                height: 48,
              }}
            >
              Post Requirement
            </Button>

            <Button
              onClick={closeRequirementModal}
              size="large"
              style={{ borderRadius: 8, width: 120, height: 48 }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Card hover animation */}
      <style>
        {`
          .ant-card-hoverable:hover {
            transform: translateY(-4px) !important;
            box-shadow: 0 12px 40px rgba(102, 126, 234, 0.15) !important;
          }
          .ant-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          .ant-modal .ant-input:focus,
          .ant-modal .ant-input-focused {
            border-color: #667eea !important;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1) !important;
          }
          .ant-btn-primary:not(.ant-btn-dangerous):hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
          }
        `}
      </style>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;
