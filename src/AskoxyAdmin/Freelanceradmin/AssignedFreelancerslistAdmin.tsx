import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Card,
  Typography,
  Tag,
  Space,
  message,
  Tooltip,
  Empty,
  Spin,
  Row,
  Col,
} from "antd";
import {
  EyeOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { getEmployeeAccessToken } from "../../utils/cookieUtils";
import BASE_URL, { uploadurlwithId } from "../../Config";


const { Title, Text } = Typography;

interface AssignedFreelancerAdmin {
  budget: number;
  companyId: string;
  companyName: string;
  experience: string;
  freelacerId: string;
  freelacerName: string;
  freelacerResume: string;
  positions: number;
  requirementId: string;
  skillsName: string;
  status: string;
  titleName: string;
}

interface AssignedFreelancersProps {
  companyId: string;
  isMobileScreen: boolean;
}

const AssignedFreelancerAdmin: React.FC<AssignedFreelancersProps> = ({
  companyId,
  isMobileScreen,
}) => {
  const [assignedFreelancers, setAssignedFreelancers] = useState<
    AssignedFreelancerAdmin[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAssignedFreelancers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${BASE_URL}/user-service/getPartnerAssignedInformation?companyId=${companyId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200 && Array.isArray(response.data)) {
        setAssignedFreelancers(response.data);
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to load assigned freelancers.";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchAssignedFreelancers();
    }
  }, [companyId]);

  const handleDownloadResume = (resumeUrl: string) => {
    if (!resumeUrl) {
      message.warning("Resume not available.");
      return;
    }
    const fullUrl = `${uploadurlwithId}${resumeUrl}`;
    window.open(fullUrl, "_blank");
  };

  const getStatusColor = (status: string) => {
    const statusUpper = status?.toUpperCase() || "";
    if (statusUpper === "OPEN")
      return { color: "#52c41a", bg: "#f6ffed", border: "#b7eb8f" };
    if (statusUpper === "CLOSED")
      return { color: "#ff4d4f", bg: "#fff2f0", border: "#ffccc7" };
    if (statusUpper === "ON_HOLD")
      return { color: "#faad14", bg: "#fffbe6", border: "#ffe58f" };
    return { color: "#1890ff", bg: "#e6f7ff", border: "#91d5ff" };
  };

  const columns = [
    {
      title: "S.No",
      key: "sno",
      width: 60,
      align: "center" as const,
      render: (_: any, __: any, index: number) => (
        <Text style={{ color: "#888" }}>{index + 1}</Text>
      ),
    },
    {
      title: "Job Title",
      dataIndex: "titleName",
      key: "titleName",
      align: "center" as const,
      render: (text: string) => (
        <Text strong style={{ color: "#1a1d2e" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Freelancer",
      dataIndex: "freelacerName",
      key: "freelacerName",
      align: "center" as const,
      render: (text: string) => (
        <Text style={{ color: "#667eea", fontWeight: 600 }}>{text}</Text>
      ),
    },
    {
      title: "Skills",
      dataIndex: "skillsName",
      key: "skillsName",
      align: "center" as const,
      render: (text: string) => <Text style={{ color: "#666" }}>{text}</Text>,
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
        const colors = getStatusColor(status);
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
      width: 80,
      render: (record: AssignedFreelancerAdmin) => (
        <Tooltip title="Download Resume">
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => handleDownloadResume(record.freelacerResume)}
            style={{
              background: "#008cba",
              border: "none",
              boxShadow: "0 2px 8px rgba(0, 140, 186, 0.25)",
              borderRadius: 8,
              height: 40,
              width: 40,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          />
        </Tooltip>
      ),
    },
  ];

  if (assignedFreelancers.length === 0 && !loading) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "24px",
          boxShadow: "0 10px 30px -5px rgba(0,0,0,0.05)",
          border: "1px solid #f0f0f0",
          overflow: "hidden",
          marginTop: 32,
          textAlign: "center",
        }}
      >
        <Text style={{ fontSize: 16, color: "#999" }}>
          No assigned freelancers found for this company.
        </Text>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: "24px",
        boxShadow: "0 10px 30px -5px rgba(0,0,0,0.05)",
        border: "1px solid #f0f0f0",
        overflow: "hidden",
        marginTop: 32,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <Title
            level={4}
            style={{ margin: 0, fontWeight: 700, color: "#1a1d2e" }}
          >
            Assigned Freelancers
          </Title>
          <Text style={{ color: "#8c8c8c", fontSize: 12 }}>
            View all assigned freelancers for this company
          </Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchAssignedFreelancers}
          loading={loading}
          style={{
            borderRadius: 8,
            height: 40,
            fontWeight: 600,
            color: "#008cba",
            border: "1px solid #d4e8f0",
            background: "#f0f8fb",
          }}
        >
          {!isMobileScreen && "Refresh"}
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={assignedFreelancers}
          rowKey="freelacerId"
          loading={loading}
          scroll={{ x: 1200 }}
          bordered
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} assigned freelancers`,
            style: { marginTop: 16 },
          }}
          locale={{
            emptyText: (
              <div style={{ padding: "60px 20px", textAlign: "center" }}>
                <EyeOutlined
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
                  No Assigned Freelancers
                </p>
                <p style={{ fontSize: 13, color: "#999" }}>
                  No freelancers have been assigned to this company yet.
                </p>
              </div>
            ),
          }}
        />
      </Spin>

      <style>
        {`
          .ant-table-thead > tr > th {
            background: #fcfdff !important;
            color: #1a1d2e !important;
            font-weight: 700 !important;
            font-size: 12px !important;
            border-bottom: 2px solid #f0f2f5 !important;
          }
          .ant-table-row:hover {
            background-color: #fafbff !important;
          }
        `}
      </style>
    </div>
  );
};

export default AssignedFreelancerAdmin;
