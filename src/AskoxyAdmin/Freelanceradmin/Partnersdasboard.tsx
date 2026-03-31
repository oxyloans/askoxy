import React, { useState, useEffect } from "react";
import {
  Table,
  Space,
  Button,
  message,
  Typography,
  Spin,
  Row,
  Col,
  Tag,
  Avatar,
  Empty,
  Tooltip,
} from "antd";
import BASE_URL from "../../Config";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  ShopOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { adminApi } from "../../utils/axiosInstances";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

interface CompanyProfile {
  id: string;
  userId: string | null;
  companyName: string;
  companyLocation: string;
  companyLogo?: string | null;
  companyStatus?: string;
}

const statusConfig: Record<
  string,
  { color: string; icon: React.ReactNode; bg: string; border: string }
> = {
  APPROVED: {
    color: "success",
    icon: <CheckCircleOutlined />,
    bg: "#f6ffed",
    border: "#b7eb8f",
  },
  PENDING: {
    color: "warning",
    icon: <ClockCircleOutlined />,
    bg: "#fffbe6",
    border: "#ffe58f",
  },
  REJECTED: {
    color: "error",
    icon: <ExclamationCircleOutlined />,
    bg: "#fff2f0",
    border: "#ffccc7",
  },
};

const Partnersdasboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [profiles, setProfiles] = useState<CompanyProfile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanyProfiles();
  }, []);

  const fetchCompanyProfiles = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminApi.get<CompanyProfile[]>(
        `${BASE_URL}/user-service/getCompanyProfile`,
        {
          timeout: 15000,
        },
      );

      if (response.data && response.data.length > 0) {
        setProfiles(response.data);
      } else {
        setProfiles([]);
      }
    } catch (err: any) {
      let errorMessage = "Failed to load company profiles.";
      if (err.response?.status === 404) {
        errorMessage = "No profiles found.";
      } else {
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

  const handleApprove = async (id: string) => {
    try {
      setApprovingId(id);
      const payload = {
        adminName: "ADMIN",
        companyStatus: "APPROVED",
        id: id,
      };

      const response = await adminApi.post(
        `${BASE_URL}/user-service/companyApprove`,
        payload,
      );

      if (response.status === 200 || response.status === 201) {
        message.success("Company approved successfully!");
        fetchCompanyProfiles();
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to approve company.";
      message.error(errorMsg);
    } finally {
      setApprovingId(null);
    }
  };

  const getStatus = (status?: string) => {
    const s = status?.toUpperCase() || "";
    return statusConfig[s] || statusConfig.PENDING;
  };

  if (loading && profiles.length === 0) {
    return (
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
    );
  }

  return (
    <div style={{ padding: "0 24px" }}>
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
            Partners Dashboard
          </Title>
          <Text style={{ color: "#888", fontSize: 13 }}>
            Review and approve freelancer company profiles
          </Text>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <Tooltip title="Refresh">
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchCompanyProfiles}
              loading={loading}
              style={{ borderRadius: 10, height: 40 }}
            />
          </Tooltip>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ marginBottom: 32 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <div
              style={{
                borderRadius: 16,
                border: "none",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                background: "#fff",
                padding: "24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "#e8ecff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ShopOutlined style={{ color: "#667eea", fontSize: 20 }} />
                </div>
                <div>
                  <Text
                    style={{
                      color: "#888",
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    Total Companies
                  </Text>
                  <Title level={4} style={{ margin: 0, fontWeight: 800 }}>
                    {profiles.length}
                  </Title>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div
              style={{
                borderRadius: 16,
                border: "none",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                background: "#fff",
                padding: "24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "#f6ffed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircleOutlined
                    style={{ color: "#52c41a", fontSize: 20 }}
                  />
                </div>
                <div>
                  <Text
                    style={{
                      color: "#888",
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    Approved
                  </Text>
                  <Title level={4} style={{ margin: 0, fontWeight: 800 }}>
                    {
                      profiles.filter((p) => p.companyStatus === "APPROVED")
                        .length
                    }
                  </Title>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div
              style={{
                borderRadius: 16,
                border: "none",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                background: "#fff",
                padding: "24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "#fffbe6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ClockCircleOutlined
                    style={{ color: "#faad14", fontSize: 20 }}
                  />
                </div>
                <div>
                  <Text
                    style={{
                      color: "#888",
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    Pending
                  </Text>
                  <Title level={4} style={{ margin: 0, fontWeight: 800 }}>
                    {
                      profiles.filter(
                        (p) =>
                          p.companyStatus === "PENDING" || !p.companyStatus,
                      ).length
                    }
                  </Title>
                </div>
              </div>
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
      <div>
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
                <Space size="middle">
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
                </Space>
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
                    color={st.color as any}
                    style={{
                      borderRadius: 20,
                      padding: "2px 10px",
                      fontSize: 11,
                      fontWeight: 700,
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
                <Space>
                  {record.companyStatus !== "APPROVED" && (
                    <Button
                      type="primary"
                      size="small"
                      loading={approvingId === record.id}
                      onClick={() => handleApprove(record.id)}
                      style={{
                        background:
                          "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
                        border: "none",
                        borderRadius: 6,
                        fontWeight: 600,
                      }}
                    >
                      Approve
                    </Button>
                  )}
                  {record.companyStatus === "APPROVED" && (
                    <Tag color="success">Approved</Tag>
                  )}
                  <Tooltip title="View Assigned Freelancers">
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<ShopOutlined />}
                      onClick={() =>
                        navigate(`/admin/assigned-freelancers/${record.id}`)
                      }
                      style={{
                        background: "#008cba",
                        border: "none",
                        boxShadow: "0 2px 8px rgba(0, 140, 186, 0.25)",
                      }}
                    />
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
              />
            ),
          }}
        />
      </div>
    </div>
  );
};

export default Partnersdasboard;
