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
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ReloadOutlined,
  FilePdfOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const PRIMARY = "#008cba";

const userId = localStorage.getItem("userId");
const API_URL = `${BASE_URL}/ai-service/agent/getFreeLancersData/${userId}`;

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

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get<Freelancer[]>(API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (e: any) {
      setError(
        e?.response?.data?.message || e?.message || "Failed to load freelancers"
      );
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
      render: (_, __, index) =>
        (currentPage - 1) * pageSize + index + 1,
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
          <div><Text type="secondary">₹/Hour</Text><br/><b>{formatMoney(r.perHour)}</b></div>
          <div><Text type="secondary">₹/Day</Text><br/><b>{formatMoney(r.perDay)}</b></div>
          <div><Text type="secondary">₹/Week</Text><br/><b>{formatMoney(r.perWeek)}</b></div>
          <div><Text type="secondary">₹/Month</Text><br/><b>{formatMoney(r.perMonth)}</b></div>
          <div style={{ gridColumn: "span 2" }}>
            <Text type="secondary">₹/Year</Text><br/>
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
            if (r.resumeUrl)
              window.open(r.resumeUrl, "_blank");
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
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
              >
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
    <Spin size="large" />
  </div>
) 
 : error ? (
        <Alert type="error" message={error} />
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
            scroll={{x:"100%"}}
            pagination={{
              pageSize,
              onChange: (page) => setCurrentPage(page),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FreelancersByUserId;
