import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Card,
  Typography,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Space,
  message,
  Tooltip,
  Result,
} from "antd";
import {
  EditOutlined,
  ShopOutlined,
  ReloadOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import axios from "axios";
import EmployeeLayout from "./EmployeeLayout";
import { getEmployeeAccessToken } from "../utils/cookieUtils";
import BASE_URL from "../Config";
import { useNavigate } from "react-router-dom";
import { freelanceApi } from "../utils/axiosInstances";
import { encryptParam } from "../utils/urlEncryption";

const { Title, Text } = Typography;
const { Option } = Select;

interface Requirement {
  id: string;
  companyId: string | null;
  title: string;
  skillName: string;
  experience: string;
  budget: number;
  status: string;
  positions: number;
  companyName: string;
}

const RequirementList: React.FC = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingRequirement, setEditingRequirement] =
    useState<Requirement | null>(null);
  const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth < 768);
  const [form] = Form.useForm();
  const userId = sessionStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobileScreen(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchRequirements = async () => {
    try {
      setLoading(true);

      const response = await freelanceApi.get(
        `${BASE_URL}/user-service/showingCompanyRequirementBasedOnUserId?userId=${userId}`
      );

      if (response.status === 200) {
        const flattenedData = response.data.flatMap((company: any) =>
          (company.list || []).map((req: any) => ({
            ...req,
            companyName: company.companyName,
          })),
        );
        setRequirements(flattenedData);
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch requirements. Please try again.";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  const openEditModal = (requirement: Requirement) => {
    setEditingRequirement(requirement);
    form.setFieldsValue({
      ...requirement,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRequirement(null);
    form.resetFields();
  };

  const handleUpdate = async (values: any) => {
    try {
      setSubmitting(true);

      if (!editingRequirement?.id) {
        message.error("Requirement ID not found.");
        return;
      }

      const payload = {
        id: editingRequirement.id,
        budget: Number(values.budget),
        experience: values.experience,
        positions: Number(values.positions),
        skillName: values.skillName,
        status: values.status,
        title: values.title,
      };

      const response = await freelanceApi.patch(
        `${BASE_URL}/user-service/companyRequirement`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        message.success("Requirement updated successfully!");
        closeModal();
        fetchRequirements();
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update requirement.";
      message.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewFreelancers = (requirement: Requirement) => {
    const encryptedCompanyId = encryptParam(requirement.companyId || '');
    const encryptedRequirementId = encryptParam(requirement.id);
    navigate(`/employee-freelancers/${encryptedCompanyId}/${encryptedRequirementId}`);
  };

  const columns = [
    {
      title: "S.No",
      key: "sno",
      width: 65,
      align: "center" as const,
      render: (_: any, __: any, index: number) => (
        <Text style={{ color: "#888" }}>{index + 1}</Text>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center" as const,
      render: (text: string) => (
        <Text strong style={{ color: "#1a1d2e" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Company",
      dataIndex: "companyName",
      key: "companyName",
      align: "center" as const,
      render: (text: string) => (
        <Text style={{ color: "#667eea", fontWeight: 600 }}>{text}</Text>
      ),
    },
    {
      title: "Required Skills",
      dataIndex: "skillName",
      key: "skillName",
      align: "center" as const,
      render: (text: string) => (
        <Space size={[0, 4]} wrap style={{ justifyContent: "center" }}>
          {(text || "").split(",").map((skill) => (
            <Tag color="blue" key={skill.trim()} style={{ borderRadius: 6 }}>
              {skill.trim()}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Experience",
      dataIndex: "experience",
      key: "experience",
      align: "center" as const,
    },
    {
      title: "Budget",
      dataIndex: "budget",
      key: "budget",
      align: "center" as const,
      render: (val: number) => `₹${(val || 0).toLocaleString()}`,
    },
    {
      title: "Positions",
      dataIndex: "positions",
      key: "positions",
      align: "center" as const,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (status: string) => {
        let colors = { color: "#52c41a", bg: "#f6ffed", border: "#b7eb8f" };
        if (status === "CLOSED")
          colors = { color: "#ff4d4f", bg: "#fff2f0", border: "#ffccc7" };
        if (status === "ON_HOLD")
          colors = { color: "#faad14", bg: "#fffbe6", border: "#ffe58f" };

        return (
          <Tag
            style={{
              borderRadius: 6,
              padding: "4px 12px",
              fontWeight: 700,
              fontSize: 11,
              color: colors.color,
              background: colors.bg,
              border: `1px solid ${colors.border}`,
              textTransform: "uppercase",
            }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      width: 120,
      render: (record: Requirement) => (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "nowrap" }}>
          <Tooltip title="Edit Requirement">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
              style={{
                background: "#008cba",
                border: "none",
                boxShadow: "0 2px 8px rgba(0, 140, 186, 0.25)",
                borderRadius: 8,
               
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                flexShrink: 0,
              }}
            />
          </Tooltip>
          <Tooltip title="View Freelancers">
            <Button
              type="primary"
              icon={<ShopOutlined />}
              onClick={() => handleViewFreelancers(record)}
              style={{
                background: "#1ab394",
                border: "none",
                boxShadow: "0 2px 8px rgba(26, 179, 148, 0.25)",
                borderRadius: 8,
               
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                flexShrink: 0,
              }}
            />
          </Tooltip>
        </div>
      ),
    }
  ];

  return (
    <EmployeeLayout>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 30,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <Title
              level={3}
              style={{ margin: 0, fontWeight: 700, color: "#1a1d2e" }}
            >
              Manage Requirements
            </Title>
            <Text
              style={{
                color: "#8c8c8c",
                fontSize: 13,
                display: "block",
                marginTop: 4,
              }}
            >
              Track and manage your hiring requirements across all companies.
            </Text>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchRequirements}
              size="large"
              style={{
                borderRadius: 12,
                height: 48,
                padding: isMobileScreen ? "0 12px" : "0 24px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontWeight: 600,
                color: "#008cba",
                border: "1px solid #d4e8f0",
                background: "#f0f8fb",
              }}
            >
              {!isMobileScreen && "Refresh Requirements"}
            </Button>
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "24px",
            boxShadow: "0 10px 30px -5px rgba(0,0,0,0.05)",
            border: "1px solid #f0f0f0",
            overflow: "hidden",
          }}
        >
          <Table
            columns={columns}
            dataSource={requirements}
            rowKey="id"
            loading={loading}
            scroll={{ x: 1100 }}
            bordered
            pagination={{
              pageSize: 8,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} requirements`,
              style: { marginTop: 24 },
            }}
            style={{
              overflow: "hidden",
            }}
            locale={{
              emptyText: (
                <div style={{ padding: "60px 20px", textAlign: "center" }}>
                  <InboxOutlined
                    style={{
                      fontSize: 56,
                      color: "#bfbfbf",
                      marginBottom: 20,
                      display: "block",
                    }}
                  />
                  <p
                    style={{
                      fontSize: 18,
                      color: "#333",
                      marginBottom: 8,
                      fontWeight: 600,
                    }}
                  >
                    No Requirements Found
                  </p>
                  <p style={{ fontSize: 13, color: "#999", marginBottom: 20 }}>
                    You haven't created any requirements yet.
                  </p>
                  <Text style={{ fontSize: 12, color: "#666" }}>
                    Go to Dashboard to create your first requirement
                  </Text>
                </div>
              ),
            }}
          />
        </div>
      </div>

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div>
              <Text strong style={{ fontSize: 17 }}>
                Modify Requirement
              </Text>
              <br />
              <Text style={{ fontSize: 12, color: "#999" }}>
                Company:{" "}
                <span style={{ color: "#667eea", fontWeight: 600 }}>
                  {editingRequirement?.companyName}
                </span>
              </Text>
            </div>
          </div>
        }
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        centered
        width={560}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
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

          <Form.Item
            label={<span style={{ fontWeight: 600 }}>Lifecycle Status</span>}
            name="status"
            rules={[{ required: true, message: "Status must be selected" }]}
          >
            <Select style={{ borderRadius: 10 }}>
              <Option value="OPEN">OPEN - Accepting Applications</Option>
              <Option value="CLOSED">CLOSED - Position Filled</Option>
              <Option value="ON_HOLD">ON HOLD - Temporarily Paused</Option>
            </Select>
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
              size="large"
              loading={submitting}
              block
              style={{
                borderRadius: 10,
                height: 50,
                fontWeight: 700,
                background: "#008cba",
                border: "none",
                boxShadow: "0 4px 15px rgba(0, 140, 186, 0.25)",
              }}
            >
              Update Requirement
            </Button>
            <Button
              onClick={closeModal}
              size="large"
              style={{ borderRadius: 10, height: 50, width: 130 }}
            >
              Discard
            </Button>
          </div>
        </Form>
      </Modal>

      <style>
        {`
          .ant-table-thead > tr > th {
            background: #fcfdff !important;
            color: #1a1d2e !important;
            font-weight: 700 !important;
            font-size: 13px !important;
            border-bottom: 2px solid #f0f2f5 !important;
          }
          .ant-table-row:hover {
            background-color: #fafbff !important;
          }
          .ant-table {
            border-radius: 12px;
          }
          .ant-form-item-label label {
            font-size: 13px;
          }
        `}
      </style>
    </EmployeeLayout>
  );
};

export default RequirementList;
