import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Spin,
  Typography,
  Input,
  Tag,
  Space,
  Select,
  Tooltip,
  Empty,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ReloadOutlined,
  SearchOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  LockOutlined,
  UnlockOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

// ─── Types ────────────────────────────────────────────────────────────────────

type CandidateStatus = "ALL" | "ACTIVE" | "INACTIVE" | "COMPLETED";

interface Candidate {
  interested: boolean;
  locked: boolean;
  message: string;
  status: string;
  userId: string;
  enrollmentId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  createdAt: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE =
  "http://65.0.147.157:9229/api/marketing-service/campgin/job-program/interested-candidates";

const STATUS_OPTIONS: { label: string; value: CandidateStatus }[] = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Completed", value: "COMPLETED" },
];

const STATUS_TAG_COLORS: Record<string, string> = {
  ACTIVE: "green",
  INACTIVE: "orange",
  COMPLETED: "blue",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (ms: number): string => {
  if (!ms) return "—";
  return dayjs(ms).format("DD MMM YYYY, hh:mm A");
};

const hasValue = (val: string | null | undefined): boolean => {
  const s = String(val ?? "").trim();
  return s !== "" && s !== "-" && s.toLowerCase() !== "null";
};

// ─── Component ────────────────────────────────────────────────────────────────

const InterestedCandidates: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<CandidateStatus>("ALL");
  const [searchText, setSearchText] = useState("");

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<Candidate[]>(API_BASE, {
        params: { status },
      });
      setCandidates(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch candidates:", err);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const filtered = useMemo(() => {
    if (!searchText.trim()) return candidates;
    const q = searchText.toLowerCase();
    return candidates.filter(
      (c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.mobileNumber?.toLowerCase().includes(q) ||
        c.userId?.toLowerCase().includes(q) ||
        c.enrollmentId?.toLowerCase().includes(q)
    );
  }, [candidates, searchText]);

  const stats = useMemo(
    () => ({
      total: candidates.length,
      active: candidates.filter((c) => c.status === "ACTIVE").length,
      inactive: candidates.filter((c) => c.status === "INACTIVE").length,
      completed: candidates.filter((c) => c.status === "COMPLETED").length,
      interested: candidates.filter((c) => c.interested).length,
      locked: candidates.filter((c) => c.locked).length,
    }),
    [candidates]
  );

  const columns: ColumnsType<Candidate> = [
    {
      title: "S.No",
      key: "sno",
      width: 65,
     align:"center",
      render: (_: unknown, __: Candidate, idx: number) => (
        <Text type="secondary" style={{ fontSize: 13 }}>
          {idx + 1}
        </Text>
      ),
    },
    {
      title: "Candidate",
      key: "name",
      sorter: (a, b) =>
        `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`
        ),
      render: (_: unknown, rec: Candidate) => (
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>
            {rec.firstName || "—"} {rec.lastName || ""}
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
            #{rec.userId.slice(-4)}
          </div>
        </div>
      ),
    },
    {
      title: "Contact",
      key: "contact",
      render: (_: unknown, rec: Candidate) => (
        <div>
          {hasValue(rec.email) && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
              <MailOutlined style={{ color: "#6366f1", fontSize: 12 }} />
              <Text style={{ fontSize: 12 }}>{rec.email}</Text>
            </div>
          )}
          {hasValue(rec.mobileNumber) && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <PhoneOutlined style={{ color: "#10b981", fontSize: 12 }} />
              <Text style={{ fontSize: 12 }}>{rec.mobileNumber.trim()}</Text>
            </div>
          )}
          {!hasValue(rec.email) && !hasValue(rec.mobileNumber) && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              —
            </Text>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      filters: [
        { text: "Active", value: "ACTIVE" },
        { text: "Inactive", value: "INACTIVE" },
        { text: "Completed", value: "COMPLETED" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (val: string) => (
        <Tag color={STATUS_TAG_COLORS[val] ?? "default"}>{val}</Tag>
      ),
    },
    {
      title: "Interested",
      dataIndex: "interested",
      key: "interested",
      align: "center",
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => record.interested === value,
      render: (val: boolean) =>
        val ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Yes
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="error">
            No
          </Tag>
        ),
    },
    {
      title: "Locked",
      dataIndex: "locked",
      key: "locked",
      align: "center",
      filters: [
        { text: "Locked", value: true },
        { text: "Unlocked", value: false },
      ],
      onFilter: (value, record) => record.locked === value,
      render: (val: boolean) =>
        val ? (
          <Tag icon={<LockOutlined />} color="red">
            Locked
          </Tag>
        ) : (
          <Tag icon={<UnlockOutlined />} color="default">
            Open
          </Tag>
        ),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (val: string) => (
        <Tooltip title={val}>
          <Text style={{ fontSize: 13 }}>{val || "—"}</Text>
        </Tooltip>
      ),
    },
    {
      title: "Enrollment ID",
      dataIndex: "enrollmentId",
      key: "enrollmentId",
      align:"center",
      render: (val: string) =>
        hasValue(val) ? (
          <Text style={{ fontSize: 11, fontFamily: "monospace" }}>#{val.slice(-4)}</Text>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: "Registered On",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => (a.createdAt || 0) - (b.createdAt || 0),
      defaultSortOrder: "descend",
      align: "center",
      render: (val: number) => (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Text style={{ fontSize: 12 }}>{formatDate(val)}</Text>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <Title level={3} style={{ margin: 0, color: "#1e293b" }}>
          Job Program — Interested Candidates
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>
          Manage candidates who expressed interest in the job program
        </Text>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          { title: "Total", value: stats.total, icon: <TeamOutlined />, color: "#6366f1" },
          { title: "Active", value: stats.active, icon: <CheckCircleOutlined />, color: "#10b981" },
          { title: "Inactive", value: stats.inactive, icon: <CloseCircleOutlined />, color: "#f59e0b" },
          { title: "Completed", value: stats.completed, icon: <ClockCircleOutlined />, color: "#3b82f6" },
          { title: "Interested", value: stats.interested, icon: <UserOutlined />, color: "#8b5cf6" },
          { title: "Locked", value: stats.locked, icon: <LockOutlined />, color: "#ef4444" },
        ].map((s) => (
          <div
            key={s.title}
            style={{
              flex: "1 1 130px",
              minWidth: 120,
              padding: "12px 16px",
              borderRadius: 10,
              border: `1px solid ${s.color}33`,
              background: `${s.color}0d`,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 22, color: s.color }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>
                {s.title}
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1.2 }}>
                {s.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: "14px 18px",
          marginBottom: 16,
          border: "1px solid #e2e8f0",
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "flex-end",
        }}
      >
        <div style={{ minWidth: 160 }}>
          
          <Select
            value={status}
            onChange={(val: CandidateStatus) => setStatus(val)}
            style={{ width: "100%" }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </div>

        <div style={{ width: 250 }}>
        
          <Search
            placeholder="Name, email, mobile, ID…"
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>


      </div>

      {/* Table */} 
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        <Spin spinning={loading} tip="Loading…">
          {!loading && filtered.length === 0 ? (
            <Empty
              description={
                <Text type="secondary">
                  {searchText
                    ? `No results for "${searchText}"`
                    : "No candidates found"}
                </Text>
              }
              style={{ padding: "48px 0" }}
            />
          ) : (
            <Table<Candidate>
              rowKey={(r) => r.enrollmentId || r.userId}
              dataSource={filtered}
              columns={columns}
              scroll={{ x: "true" }}
              size="middle"
              loading={loading}
              pagination={{
                pageSize: 50,
                showSizeChanger: true,
                pageSizeOptions: ["20", "50", "100", "200"],
                showTotal: (total, range) =>
                  `${range[0]}–${range[1]} of ${total} candidates`,
                style: { padding: "12px 20px" },
              }}
            />
          )}
        </Spin>
      </div>
    </div>
  );
};

export default InterestedCandidates;
