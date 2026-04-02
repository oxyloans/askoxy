import React, { useState, useEffect } from "react";
import { Table, Button, Typography, Tag, Space, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { adminApi as axios } from "../../utils/axiosInstances";
import BASE_URL from "../../Config";

const { Title, Text } = Typography;

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

const AdminRequirementList: React.FC = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRequirements = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/user-service/getAllCompanyRequirement`,
      );
      if (response.status === 200) {
        setRequirements(response.data);
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
          {(text || "").split(",").map((skill: string) => (
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
        const color =
          status === "OPEN" ? "green" : status === "CLOSED" ? "red" : "orange";
        return (
          <Tag color={color} style={{ borderRadius: 6, fontWeight: 600 }}>
            {status}
          </Tag>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "24px", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
              padding: "0 4px",
            }}
          >
            <div>
              <Title
                level={3}
                style={{ margin: 0, fontWeight: 700, color: "#1a1d2e" }}
              >
                Freelance Requirements
              </Title>
              <Text style={{ color: "#888", fontSize: 13 }}>
                View all company hiring requirements across the platform
              </Text>
            </div>
            <Button
              icon={<SearchOutlined />}
              onClick={fetchRequirements}
              style={{ borderRadius: 10 }}
            >
              Refresh
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={requirements}
            rowKey="id"
            loading={loading}
            bordered
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} requirements`,
              style: { marginTop: 24 },
            }}
            style={{
              borderRadius: 16,
              overflow: "hidden",
            }}
          />
        </div>
      </div>

      <style>
        {`
          .ant-table-thead > tr > th {
            background: #f8f9ff !important;
            color: #1a1d2e !important;
            font-weight: 700 !important;
          }
          .ant-table-row:hover {
            background-color: #fcfdff !important;
          }
        `}
      </style>
    </div>
  );
};

export default AdminRequirementList;
