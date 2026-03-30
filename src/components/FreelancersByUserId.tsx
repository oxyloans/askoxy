import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../Config";
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  Grid,
  Modal,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ReloadOutlined,
  FilePdfOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import customerApi from "../utils/axiosInstances";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const PRIMARY = "#008cba";

type Freelancer = {
  id: string;
  email: string;
  userId: string;
  perHour: number | null;
  perDay: number | null;
  perWeek: number | null;
  perMonth: number | null;
  perYear: number | null;
  openForFreeLancing: "YES" | "NO" | string;
  amountNegotiable: "YES" | "NO" | string;
  resumeUrl: string | null;
};

function formatMoney(n: number | null | undefined) {
  if (n === null || n === undefined) return "-";
  return n.toLocaleString("en-IN");
}

const FreelancersByUserId: React.FC = () => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [data, setData] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [currentResumeUrl, setCurrentResumeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getAccessToken = (): string | null => {
    return localStorage.getItem("accessToken");
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    let userId = localStorage.getItem("userId");
    let token = getAccessToken();

    // ─── Fix for race condition after login redirect ───
    if (!token || !userId) {
      console.log("No token/userId found initially → waiting briefly...");
      await new Promise((resolve) => setTimeout(resolve, 400));
      token = getAccessToken();
      userId = localStorage.getItem("userId");

      if (!token) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }
      if (!userId) {
        setError("User ID not found. Please login again.");
        setLoading(false);
        return;
      }
    }
   

    const API_URL = `${BASE_URL}/ai-service/agent/getFreeLancersData/${userId}`;
    console.log("Using token:", token.substring(0, 10) + "...");

    try {
      const res = await customerApi.get<Freelancer[]>(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = Array.isArray(res.data) ? res.data : [];
      setData(result);
      console.log(`Loaded ${result.length} freelancers`);
    } catch (e: any) {
      const errMsg =
        e?.response?.data?.message ||
        e?.response?.statusText ||
        e?.message ||
        "Failed to load freelancers";

      console.error("Fetch error:", e);
      setError(errMsg);

      // Optional: auto-logout on 401
      if (e?.response?.status === 401) {
        setError("Session expired or unauthorized. Please login again.");
        // localStorage.removeItem("accessToken"); // uncomment if you want auto-logout
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: ColumnsType<Freelancer> = [
    {
      title: "S.No",
      key: "serial",
      align: "center",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
      render: (v: string) => (
        <Text style={{ fontWeight: 700 }}>{v || "-"}</Text>
      ),
    },
    {
      title: "Rates",
      key: "rates",
      align: "center",
      render: (_, r) => (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 6,
          }}
        >
          <div>
            <Text type="secondary">₹/Hour</Text>
            <br />
            <b>{formatMoney(r.perHour)}</b>
          </div>
          <div>
            <Text type="secondary">₹/Day</Text>
            <br />
            <b>{formatMoney(r.perDay)}</b>
          </div>
          <div>
            <Text type="secondary">₹/Week</Text>
            <br />
            <b>{formatMoney(r.perWeek)}</b>
          </div>
          <div>
            <Text type="secondary">₹/Month</Text>
            <br />
            <b>{formatMoney(r.perMonth)}</b>
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <Text type="secondary">₹/Year</Text>
            <br />
            <b>{formatMoney(r.perYear)}</b>
          </div>
        </div>
      ),
    },
    {
      title: "Available",
      dataIndex: "openForFreeLancing",
      key: "openForFreeLancing",
      align: "center",
      render: (v: string) => (
        <Tag color={v === "YES" ? "green" : "red"}>{v || "-"}</Tag>
      ),
    },
    {
      title: "Negotiable",
      dataIndex: "amountNegotiable",
      key: "amountNegotiable",
      align: "center",
      render: (v: string) => (
        <Tag color={v === "YES" ? "geekblue" : "default"}>{v || "-"}</Tag>
      ),
    },
    {
      title: "Resume",
      key: "resume",
      align: "center",
      render: (_, r) => (
        <Button
          icon={<FilePdfOutlined />}
          disabled={!r.resumeUrl}
          onClick={() => {
            if (!r.resumeUrl) {
              alert("Resume file is invalid or not available.");
              return;
            }
            const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
              r.resumeUrl,
            )}&embedded=true`;
            setCurrentResumeUrl(viewerUrl);
            setShowResumeModal(true);
            setIsLoading(true);
          }}
          style={{
            background: PRIMARY,
            borderColor: PRIMARY,
            color: "#fff",
            fontWeight: 700,
            borderRadius: 8,
          }}
        >
          View Resume
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 20, background: "#f6f8fb", minHeight: "100vh" }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 18,
          border: "1px solid #e5e7eb",
          boxShadow: "0 8px 22px rgba(0,0,0,0.05)",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              Freelancer Applied List
            </Title>
          </Col>
          <Col>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchData}
                style={{ color: PRIMARY, borderColor: PRIMARY }}
              >
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      <div style={{ height: 16 }} />

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
          }}
        >
          <Spin size="large" tip="Loading freelancers..." />
        </div>
      ) : error ? (
        <Alert
          type="error"
          message="Error"
          description={error}
          showIcon
          action={
            <Button size="middle" type="primary" onClick={fetchData}>
              Try Again
            </Button>
          }
        />
      ) : data.length === 0 ? (
        <Alert
          type="info"
          message="No freelancers found"
          description="No one has applied yet or the list is empty."
          showIcon
        />
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #e5e7eb",
            padding: 10,
          }}
        >
          <Table
            rowKey="id"
            columns={columns}
            dataSource={data}
            bordered
            scroll={{ x: "100%" }}
            pagination={{
              pageSize,
              onChange: (page) => setCurrentPage(page),
            }}
          />
        </div>
      )}

      {/* Ant Design Modal */}
      <Modal
        title="Resume Viewer"
        open={showResumeModal}
        onCancel={() => {
          setShowResumeModal(false);
          setIsLoading(true);
        }}
        footer={null}
        width="70%"
        style={{ top: 20 }}
        bodyStyle={{ height: '80vh', padding: 0 }}
        maskClosable={true}
        keyboard={true}
      >
        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Spin size="large" tip="Loading resume..." />
          </div>
        )}
        <iframe
          src={currentResumeUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Resume Viewer"
          onLoad={() => setIsLoading(false)}
        />
      </Modal>
    </div>
  );
};

export default FreelancersByUserId;
