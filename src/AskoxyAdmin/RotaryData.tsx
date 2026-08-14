import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Input,
  Button,
  Card,
  Typography,
  Space,
  Tag,
  ConfigProvider,
  Progress,
  Tooltip,
  Empty,
  message,
  Select,
  Popover,
} from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import BASE_URL from "../Config";

const { Title, Text } = Typography;
const { Search } = Input;

/* ---------- Types ---------- */
interface RotaryProductService {
  id: string;
  memberId: string;
  name: string;
  membersType: "PRODUCT" | "SERVICE";
  category: string;
  price: number;
  description: string;
  availability?: string;
  createdAt: number;
  updatedAt: number;
}

interface RotaryApiMember {
  id: string;
  rotaryId: string | null;
  name: string | null;
  clubName: string | null;
  districtId: number | null;
  emails: string | null;
  mobileNumbers: string | null;
  city: string | null;
  address: string | null;
  state: string | null;
  classification: string | null;
  bloodGroup: string | null;
  secondaryMobile: string | null;
  businessName: string | null;
  businessEmail: string | null;
  businessPhone: string | null;
  businessAddress: string | null;
  anniversary: string | null;
  products?: RotaryProductService[] | null;
  services?: RotaryProductService[] | null;
}

interface RotaryListResponse {
  content: RotaryApiMember[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page (0-indexed)
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

interface RotarySearchResponse {
  data: RotaryApiMember[];
  message: string;
  status: boolean;
}

interface RotaryDistrictResponse {
  message: string;
  data: number[];
  status: boolean;
}

/* ---------- Completion calculation ---------- */
const COMPLETION_FIELDS: (keyof RotaryApiMember)[] = [
  "rotaryId",
  "name",
  "clubName",
  "districtId",
  "emails",
  "mobileNumbers",
  "secondaryMobile",
  "city",
  "address",
  "state",
  "classification",
  "bloodGroup",
  "businessName",
  "businessEmail",
  "businessPhone",
  "businessAddress",
  "anniversary",
];

const isFilled = (v: unknown) =>
  v !== null && v !== undefined && String(v).trim() !== "";

const getCompletion = (m: RotaryApiMember) => {
  const filled = COMPLETION_FIELDS.filter((k) => isFilled(m[k])).length;
  const total = COMPLETION_FIELDS.length;
  return { filled, total, pct: Math.round((filled / total) * 100) };
};

/* ---------- Theme ---------- */
const theme = {
  token: {
    colorPrimary: "#0E6B4F",
    colorSuccess: "#0E6B4F",
    colorWarning: "#C9932B",
    colorError: "#A32642",
    colorInfo: "#0E6B4F",
    borderRadius: 12,
    fontFamily: "'Manrope', 'Segoe UI', sans-serif",
    fontSize: 15,
    colorBorder: "#D9D9D9",
    colorBorderSecondary: "#D9D9D9",
  },
  components: {
    Table: {
      headerBg: "#F5F7FB",
      headerColor: "#374151",
      borderColor: "#EDEFF3",
      rowHoverBg: "#F5FAF8",
      cellPaddingBlock: 14,
      cellPaddingInline: 14,
    },
  },
};

const PAGE_SIZE = 20;
const TABLE_SCROLL_WIDTH = 3160;
const DEFAULT_DISTRICT_ID = 3150;

const RotaryDataAdmin: React.FC = () => {
  const [rows, setRows] = useState<RotaryApiMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0); // 0-indexed, matches API
  const [totalElements, setTotalElements] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchMode, setSearchMode] = useState(false);

  const [activeTab, setActiveTab] = useState<"all" | "complete" | "incomplete">(
    "all",
  );

  const [districtOptions, setDistrictOptions] = useState<number[]>([]);
  const [selectedDistrictId, setSelectedDistrictId] =
    useState<number>(DEFAULT_DISTRICT_ID);
  const [districtLoading, setDistrictLoading] = useState(false);

  /* ---- Fetch available district IDs ---- */
  const fetchDistricts = async () => {
    setDistrictLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/marketing-service/campgin/rotary-different-district`,
        { headers: { accept: "*/*" } },
      );
      if (!res.ok) throw new Error(`Failed with status ${res.status}`);
      const json: RotaryDistrictResponse = await res.json();
      const districts = json.status && json.data ? json.data : [];
      setDistrictOptions(districts);
      return districts.length > 0 ? districts[0] : DEFAULT_DISTRICT_ID;
    } catch {
      message.error("Could not load district list. Using default district.");
      return DEFAULT_DISTRICT_ID;
    } finally {
      setDistrictLoading(false);
    }
  };

  /* ---- Fetch paginated list ---- */
  const fetchList = async (pageNumber: number, districtId?: number) => {
    setLoading(true);
    try {
      const effectiveDistrictId = districtId ?? selectedDistrictId;
      const res = await fetch(
        `${BASE_URL}/marketing-service/campgin/rotary-data?districtId=${effectiveDistrictId}&page=${pageNumber}&size=${PAGE_SIZE}`,
        { headers: { accept: "*/*" } },
      );
      if (!res.ok) throw new Error(`Failed with status ${res.status}`);
      const json: RotaryListResponse = await res.json();
      setRows(json.content ?? []);
      setTotalElements(json.totalElements ?? 0);
      setPage(json.number ?? pageNumber);
    } catch {
      message.error("Could not load Rotary data. Please try again.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---- Fetch a specific search (mobile / Rotary ID / name) ---- */
  const fetchSearch = async (term: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/marketing-service/campgin/rotary-data-search?search=${encodeURIComponent(term)}`,
        { headers: { accept: "*/*" } },
      );
      if (!res.ok && res.status !== 404) {
        throw new Error(`Search failed with status ${res.status}`);
      }
      const json: RotarySearchResponse = await res.json();
      setRows(json.status && json.data ? json.data : []);
      setTotalElements(json.status && json.data ? json.data.length : 0);
    } catch {
      message.error("Search failed. Please try again.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchDistricts();
      setSelectedDistrictId(DEFAULT_DISTRICT_ID);
      fetchList(0, DEFAULT_DISTRICT_ID);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDistrictChange = (districtId: number) => {
    setSelectedDistrictId(districtId);
    setSearchInput("");
    setSearchTerm("");
    setSearchMode(false);
    fetchList(0, districtId);
  };

  const handleSearch = (value?: string) => {
    const trimmed = (value ?? searchInput).trim();
    if (!trimmed) {
      setSearchMode(false);
      setSearchTerm("");
      fetchList(0);
      return;
    }
    setSearchMode(true);
    setSearchTerm(trimmed);
    fetchSearch(trimmed);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setSearchMode(false);
    fetchList(0);
  };

  const handleRefresh = () => {
    if (searchMode && searchTerm) fetchSearch(searchTerm);
    else fetchList(page);
  };

  /* ---- Summary stats for the current page ---- */
  const pageStats = useMemo(() => {
    if (rows.length === 0) return { avgPct: 0, fullyFilled: 0, incomplete: 0 };
    const pcts = rows.map((r) => getCompletion(r).pct);
    const avgPct = Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
    const fullyFilled = pcts.filter((p) => p === 100).length;
    const incomplete = pcts.filter((p) => p < 100).length;
    return { avgPct, fullyFilled, incomplete };
  }, [rows]);

  /* ---- Tab-filtered rows ---- */
  const visibleRows = useMemo(() => {
    if (activeTab === "complete") {
      return rows.filter((r) => getCompletion(r).pct === 100);
    }
    if (activeTab === "incomplete") {
      return rows.filter((r) => getCompletion(r).pct < 100);
    }
    return rows;
  }, [rows, activeTab]);

  const handleTabChange = (tab: "all" | "complete" | "incomplete") => {
    setActiveTab(tab);
  };

  /* ---- Table columns ---- */
  const columns: ColumnsType<RotaryApiMember> = [
    {
      title: <div style={{ textAlign: "center" }}>S.No</div>,
      key: "serialNumber",
      align: "center",
      width: 70,
      render: (_v, _r, index) => (
        <Text strong style={{ color: "#6b7280" }}>
          {page * PAGE_SIZE + index + 1}
        </Text>
      ),
    },
    {
      title: <div style={{ textAlign: "center" }}>Rotary ID</div>,
      dataIndex: "rotaryId",
      key: "rotaryId",
      align: "center",
      width: 130,
      render: (v: string | null) =>
        v ? <Text strong>{v}</Text> : <Text type="secondary">-</Text>,
    },
    {
      title: <div style={{ textAlign: "center" }}>Name</div>,
      dataIndex: "name",
      key: "name",
      align: "center",
      width: 190,
      render: (v: string | null) =>
        v ? (
          <Tooltip title={v}>
            <Text strong ellipsis style={{ display: "block" }}>
              {v}
            </Text>
          </Tooltip>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: <div style={{ textAlign: "center" }}>Mobile</div>,
      dataIndex: "mobileNumbers",
      key: "mobileNumbers",
      align: "center",
      width: 150,
      render: (v: string | null) =>
        v ? (
          <a
            href={`tel:${v.split(",")[0]}`}
            style={{ color: "#0E6B4F", whiteSpace: "nowrap" }}
          >
            {v.split(",")[0]}
          </a>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: <div style={{ textAlign: "center" }}>Email</div>,
      dataIndex: "emails",
      key: "emails",
      align: "center",
      width: 220,
      render: (v: string | null) =>
        v ? (
          <Tooltip title={v}>
            <Text ellipsis style={{ display: "block" }}>
              {v.split(",")[0]}
            </Text>
          </Tooltip>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: <div style={{ textAlign: "center" }}>Club</div>,
      dataIndex: "clubName",
      key: "clubName",
      align: "center",
      width: 160,
      render: (v: string | null) =>
        v ? (
          <Text ellipsis style={{ display: "block" }}>
            {v}
          </Text>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: <div style={{ textAlign: "center" }}>District ID</div>,
      dataIndex: "districtId",
      key: "districtId",
      align: "center",
      width: 110,
      render: (v: number | null) =>
        isFilled(v) ? <Text>{v}</Text> : <Text type="secondary">-</Text>,
    },
    {
      title: <div style={{ textAlign: "center" }}>Secondary Mobile</div>,
      dataIndex: "secondaryMobile",
      key: "secondaryMobile",
      align: "center",
      width: 150,
      render: (v: string | null) =>
        v ? (
          <a
            href={`tel:${v.split(",")[0]}`}
            style={{ color: "#0E6B4F", whiteSpace: "nowrap" }}
          >
            {v.split(",")[0]}
          </a>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: <div style={{ textAlign: "center" }}>City / State</div>,
      key: "location",
      align: "center",
      width: 170,
      render: (_: unknown, r: RotaryApiMember) => {
        const loc = [r.city, r.state].filter(isFilled).join(", ");
        return loc ? (
          <Text ellipsis style={{ display: "block" }}>
            {loc}
          </Text>
        ) : (
          <Text type="secondary">-</Text>
        );
      },
    },
    {
      title: <div style={{ textAlign: "center" }}>Address</div>,
      dataIndex: "address",
      key: "address",
      align: "center",
      width: 200,
      render: (v: string | null) =>
        v ? (
          <Tooltip title={v}>
            <Text ellipsis style={{ display: "block" }}>
              {v}
            </Text>
          </Tooltip>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: <div style={{ textAlign: "center" }}>Blood Group</div>,
      dataIndex: "bloodGroup",
      key: "bloodGroup",
      align: "center",
      width: 110,
      render: (v: string | null) =>
        v ? (
          <Tag color="red" style={{ fontWeight: 600 }}>
            {v}
          </Tag>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: <div style={{ textAlign: "center" }}>Classification</div>,
      dataIndex: "classification",
      key: "classification",
      align: "center",
      width: 170,
      render: (v: string | null) =>
        v ? (
          <Text ellipsis style={{ display: "block" }}>
            {v}
          </Text>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: <div style={{ textAlign: "center" }}>Business Name</div>,
      dataIndex: "businessName",
      key: "businessName",
      align: "center",
      width: 180,
      render: (v: string | null) =>
        v ? (
          <Text ellipsis style={{ display: "block" }}>
            {v}
          </Text>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: <div style={{ textAlign: "center" }}>Business Email</div>,
      dataIndex: "businessEmail",
      key: "businessEmail",
      align: "center",
      width: 200,
      render: (v: string | null) =>
        v ? (
          <Tooltip title={v}>
            <Text ellipsis style={{ display: "block" }}>
              {v}
            </Text>
          </Tooltip>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: <div style={{ textAlign: "center" }}>Business Phone</div>,
      dataIndex: "businessPhone",
      key: "businessPhone",
      align: "center",
      width: 150,
      render: (v: string | null) =>
        v ? (
          <a
            href={`tel:${v.split(",")[0]}`}
            style={{ color: "#0E6B4F", whiteSpace: "nowrap" }}
          >
            {v.split(",")[0]}
          </a>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: <div style={{ textAlign: "center" }}>Business Address</div>,
      dataIndex: "businessAddress",
      key: "businessAddress",
      align: "center",
      width: 200,
      render: (v: string | null) =>
        v ? (
          <Tooltip title={v}>
            <Text ellipsis style={{ display: "block" }}>
              {v}
            </Text>
          </Tooltip>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: <div style={{ textAlign: "center" }}>Anniversary</div>,
      dataIndex: "anniversary",
      key: "anniversary",
      align: "center",
      width: 130,
      render: (v: string | null) =>
        v ? <Text>{v}</Text> : <Text type="secondary">-</Text>,
    },
    {
      title: <div style={{ textAlign: "center" }}>Products</div>,
      key: "products",
      align: "center",
      width: 130,
      render: (_: unknown, r: RotaryApiMember) => {
        const prodList = r.products || [];
        if (prodList.length === 0) return <Text type="secondary">-</Text>;
        return (
          <Popover
            trigger="click"
            placement="left"
            title={`Products (${prodList.length})`}
            content={
              <div
                style={{
                  maxWidth: 320,
                  maxHeight: 320,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {prodList.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    style={{
                      padding: 8,
                      borderRadius: 6,
                      background: "#F5F7FB",
                      border: "1px solid #E5E7EB",
                      fontSize: 13,
                      lineHeight: "1.4",
                    }}
                  >
                    <div style={{ marginBottom: 2 }}>
                      <strong>Name:</strong> {p.name || "-"}
                    </div>
                    <div style={{ marginBottom: 2 }}>
                      <strong>Category:</strong> {p.category || "-"}
                    </div>
                    <div style={{ marginBottom: 2 }}>
                      <strong>Price:</strong> {p.price ? `₹${p.price}` : "-"}
                    </div>
                    <div>
                      <strong>Desc:</strong> {p.description || "-"}
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            <Tag color="green" style={{ cursor: "pointer", fontWeight: 600 }}>
              {prodList.length} Product{prodList.length > 1 ? "s" : ""}
            </Tag>
          </Popover>
        );
      },
    },
    {
      title: <div style={{ textAlign: "center" }}>Services</div>,
      key: "services",
      align: "center",
      width: 130,
      render: (_: unknown, r: RotaryApiMember) => {
        const servList = r.services || [];
        if (servList.length === 0) return <Text type="secondary">-</Text>;
        return (
          <Popover
            trigger="click"
            placement="left"
            title={`Services (${servList.length})`}
            content={
              <div
                style={{
                  maxWidth: 320,
                  maxHeight: 320,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {servList.map((s, idx) => (
                  <div
                    key={s.id || idx}
                    style={{
                      padding: 8,
                      borderRadius: 6,
                      background: "#FAF6EE",
                      border: "1px solid #EEE4D1",
                      fontSize: 13,
                      lineHeight: "1.4",
                    }}
                  >
                    <div style={{ marginBottom: 2 }}>
                      <strong>Name:</strong> {s.name || "-"}
                    </div>
                    <div style={{ marginBottom: 2 }}>
                      <strong>Category:</strong> {s.category || "-"}
                    </div>
                    <div style={{ marginBottom: 2 }}>
                      <strong>Price:</strong> {s.price ? `₹${s.price}` : "-"}
                    </div>
                    <div style={{ marginBottom: 2 }}>
                      <strong>Availability:</strong> {s.availability || "-"}
                    </div>
                    <div>
                      <strong>Desc:</strong> {s.description || "-"}
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            <Tag color="gold" style={{ cursor: "pointer", fontWeight: 600 }}>
              {servList.length} Service{servList.length > 1 ? "s" : ""}
            </Tag>
          </Popover>
        );
      },
    },
    {
      title: <div style={{ textAlign: "center" }}>Profile Completion</div>,
      key: "completion",
      align: "center",
      width: 190,
      sorter: (a, b) => getCompletion(a).pct - getCompletion(b).pct,
      render: (_: unknown, r: RotaryApiMember) => {
        const { filled, total, pct } = getCompletion(r);
        const strokeColor =
          pct === 100 ? "#0E6B4F" : pct >= 50 ? "#C9932B" : "#A32642";
        return (
          <Tooltip title={`${filled} of ${total} fields filled`}>
            <Space direction="vertical" size={2} style={{ width: 160 }}>
              <Progress
                percent={pct}
                size="small"
                strokeColor={strokeColor}
                format={(p) => `${p}%`}
              />
              <Text style={{ fontSize: 12, color: "#6B5D4F" }}>
                {filled}/{total} fields
              </Text>
            </Space>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <ConfigProvider theme={theme}>
      <style>{`
        .rotary-row-alt > td {
          background: #FAFBFC;
        }
        .rotary-row-alt:hover > td {
          background: #F5FAF8 !important;
        }
      `}</style>
      <div
        className="min-h-screen py-10 px-4"
        style={{ background: "#F5F7FB" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-start sm:items-center justify-between flex-wrap gap-3 mb-5">
            <div>
              <Title
                level={3}
                className="!mb-1"
                style={{ color: "#1f2937", fontWeight: 700 }}
              >
                Rotary {selectedDistrictId} Members
              </Title>
              <Text type="secondary" className="text-[14px]">
                Admin view — track how completely each member's profile has been
                filled.
              </Text>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <Text
                  className="text-[18px]"
                  style={{
                    color: "#6b7280",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  Select District
                </Text>
                <Select<number>
                  value={selectedDistrictId}
                  onChange={handleDistrictChange}
                  loading={districtLoading}
                  size="large"
                  style={{ minWidth: 180 }}
                  dropdownStyle={{ zIndex: 1050 }}
                  popupMatchSelectWidth={false}
                  options={districtOptions.map((d) => ({
                    value: d,
                    label: `District ${d}`,
                  }))}
                  placeholder="Select District"
                />
              </div>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
                className="w-full sm:w-auto"
                style={{
                  borderRadius: 8,
                  fontWeight: 600,
                  borderColor: "#0E6B4F",
                  color: "#0E6B4F",
                }}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Stat Cards */}
          <div
            className="grid gap-3 mb-5"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            }}
          >
            <Card
              className="rounded-xl"
              style={{
                background: "#ffffff",
                border: "1px solid #eee",
                borderLeft: "4px solid #0E6B4F",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
              styles={{ body: { padding: "10px 18px" } }}
            >
              <Text
                className="block text-[14px]"
                type="secondary"
                style={{ fontWeight: 700 }}
              >
                Total Members
              </Text>
              <Text strong className="text-[18px]" style={{ color: "#0E6B4F" }}>
                {totalElements.toLocaleString()}
              </Text>
            </Card>
            <Card
              className="rounded-xl"
              style={{
                background: "#ffffff",
                border: "1px solid #eee",
                borderLeft: "4px solid #C9932B",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
              styles={{ body: { padding: "10px 18px" } }}
            >
              <Text
                className="block text-[14px]"
                type="secondary"
                style={{ fontWeight: 700 }}
              >
                Avg. Completion (this page)
              </Text>
              <Text strong className="text-[18px]" style={{ color: "#C9932B" }}>
                {pageStats.avgPct}%
              </Text>
            </Card>
            <Card
              className="rounded-xl"
              style={{
                background: "#ffffff",
                border: "1px solid #eee",
                borderLeft: "4px solid #2563EB",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
              styles={{ body: { padding: "10px 18px" } }}
            >
              <Text
                className="block text-[14px]"
                type="secondary"
                style={{ fontWeight: 700 }}
              >
                Fully Filled (this page)
              </Text>
              <Text strong className="text-[18px]" style={{ color: "#0E6B4F" }}>
                {pageStats.fullyFilled}/{rows.length}
              </Text>
            </Card>
            <Card
              className="rounded-xl"
              style={{
                background: "#ffffff",
                border: "1px solid #eee",
                borderLeft: "4px solid #A32642",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
              styles={{ body: { padding: "10px 18px" } }}
            >
              <Text
                className="block text-[14px]"
                type="secondary"
                style={{ fontWeight: 700 }}
              >
                Incomplete (this page)
              </Text>
              <Text strong className="text-[18px]" style={{ color: "#A32642" }}>
                {pageStats.incomplete}/{rows.length}
              </Text>
            </Card>
          </div>

          {/* Table */}
          <Card
            className="rounded-2xl"
            style={{
              background: "#ffffff",
              border: "1px solid #eee",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
            styles={{ body: { padding: 12 } }}
          >
            <div
              className="flex items-center justify-between flex-wrap gap-3"
              style={{ padding: "4px 8px 16px" }}
            >
              <Space wrap>
                {(
                  [
                    {
                      key: "all" as const,
                      label: "All",
                      count: rows.length,
                      color: "#0E6B4F",
                    },
                    {
                      key: "complete" as const,
                      label: "Complete",
                      count: pageStats.fullyFilled,
                      color: "#0E6B4F",
                    },
                    {
                      key: "incomplete" as const,
                      label: "Incomplete",
                      count: pageStats.incomplete,
                      color: "#A32642",
                    },
                  ] as const
                ).map((tab) => (
                  <Button
                    key={tab.key}
                    type={activeTab === tab.key ? "primary" : "default"}
                    onClick={() => handleTabChange(tab.key)}
                    style={
                      activeTab === tab.key
                        ? {
                            background: tab.color,
                            borderColor: tab.color,
                            borderRadius: 8,
                            fontWeight: 600,
                          }
                        : { borderRadius: 8, fontWeight: 500 }
                    }
                  >
                    {tab.label} ({tab.count})
                  </Button>
                ))}
              </Space>

              <Search
                allowClear
                placeholder="Search by mobile number or Rotary ID"
                prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onSearch={handleSearch}
                onClear={handleClearSearch}
                loading={loading}
                style={{ maxWidth: 300, width: "100%", borderRadius: 8 }}
              />
            </div>
            {searchMode && (
              <Text
                className="block text-[13px]"
                type="secondary"
                style={{ padding: "0 8px 12px" }}
              >
                Showing results for "{searchTerm}".{" "}
                <Typography.Link onClick={handleClearSearch}>
                  Clear search
                </Typography.Link>{" "}
                to see the full list.
              </Text>
            )}
            <div style={{ width: "100%", overflowX: "auto" }}>
              <Table<RotaryApiMember>
                rowKey="id"
                columns={columns}
                dataSource={visibleRows}
                loading={loading}
                size="middle"
                rowClassName={(_r, index) =>
                  index % 2 === 1 ? "rotary-row-alt" : ""
                }
                scroll={{ x: TABLE_SCROLL_WIDTH }}
                locale={{
                  emptyText: (
                    <Empty
                      description={
                        activeTab === "complete"
                          ? "No fully filled profiles on this page."
                          : activeTab === "incomplete"
                            ? "All profiles on this page are fully filled!"
                            : "No records found."
                      }
                    />
                  ),
                }}
                pagination={
                  searchMode
                    ? false
                    : {
                        current: page + 1,
                        pageSize: PAGE_SIZE,
                        total: totalElements,
                        showSizeChanger: false,
                        onChange: (p) => fetchList(p - 1),
                      }
                }
              />
            </div>
          </Card>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default RotaryDataAdmin;
