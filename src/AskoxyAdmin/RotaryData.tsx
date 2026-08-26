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
  DatePicker,
  Modal,
  Tabs,
  Descriptions,
  Image,
  Badge,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  UserOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import BASE_URL from "../Config";

const { Title, Text } = Typography;
const { Search } = Input;

/* ---------- Types ---------- */
export interface RotaryProductService {
  id: string;
  memberId: string;
  name: string;
  membersType: "PRODUCT" | "SERVICE";
  category: string;
  subCategory?: string | null;
  description?: string | null;
  keyFeatures?: string | null;
  price?: number | null;
  priceType?: "FIXED" | "HOURLY" | "NEGOTIABLE" | "PER_SESSION" | string | null;
  mrp?: number | null;
  brand?: string | null;
  variant?: string | null;
  color?: string | null;
  quantity?: number | null;
  quantityUnit?: string | null;
  stockQuantity?: number | null;
  productCondition?: "NEW" | "REFURBISHED" | "USED" | string | null;
  availability?: string | null;
  deliveryTime?: string | null;
  returnAvailable?: boolean | null;
  returnDays?: number | null;
  warrantyAvailable?: boolean | null;
  warrantyPeriod?: string | null;
  imageUrl?: string | null;
  brochureUrl?: string | null;
  providerName?: string | null;
  businessName?: string | null;
  serviceMode?: "ONLINE" | "OFFLINE" | "HYBRID" | string | null;
  serviceLocation?: string | null;
  serviceDuration?: string | null;
  bookingRequired?: boolean | null;
  targetCustomers?: string | null;
  cancellationPolicy?: string | null;
  refundPolicy?: string | null;
  paymentModes?: string | null;
  createdAt?: number | string | null;
  updatedAt?: number | string | null;
}

export interface RotaryApiMember {
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
  anniversary: string | number | null;
  gstNumber?: string | null;
  gstDocumentUrl?: string | null;
  createdAt?: string | number | null;
  updatedAt?: string | number | null;
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

interface RotaryReportResponse {
  status: boolean;
  startDate: string;
  endDate: string;
  districtId: number | null;
  totalCreated?: number;
  totalUpdated?: number;
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  members: RotaryApiMember[];
}

interface RotaryDistrictResponse {
  message: string;
  data: number[];
  status: boolean;
}

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
  "gstNumber",
];

const isFilled = (v: unknown) =>
  v !== null && v !== undefined && String(v).trim() !== "";

const getCompletion = (m: RotaryApiMember) => {
  const filled = COMPLETION_FIELDS.filter((k) => isFilled(m[k])).length;
  const total = COMPLETION_FIELDS.length;
  return { filled, total, pct: Math.round((filled / total) * 100) };
};

const formatAnniversary = (v: string | number | null | undefined) => {
  if (!v) return "-";
  if (typeof v === "number" || (/^\d+$/.test(String(v)) && String(v).length > 8)) {
    const d = dayjs(Number(v));
    if (d.isValid()) return d.format("DD MMM YYYY");
  }
  return String(v);
};

const formatDate = (v: string | number | null | undefined) => {
  if (!v) return "-";
  if (typeof v === "number" || (/^\d+$/.test(String(v)) && String(v).length > 8)) {
    const d = dayjs(Number(v));
    if (d.isValid()) return d.format("DD MMM YYYY, hh:mm A");
  }
  const d = dayjs(v);
  if (d.isValid()) return d.format("DD MMM YYYY, hh:mm A");
  return String(v);
};

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
const TABLE_SCROLL_WIDTH = 3450;
const DEFAULT_DISTRICT_ID = 3150;

const RotaryDataAdmin: React.FC = () => {
  const [rows, setRows] = useState<RotaryApiMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0); // 0-indexed, matches API
  const [totalElements, setTotalElements] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchMode, setSearchMode] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "all" | "complete" | "incomplete" | "created" | "updated"
  >("all");
  const [createdRows, setCreatedRows] = useState<RotaryApiMember[]>([]);
  const [createdPage, setCreatedPage] = useState(0);
  const [createdTotal, setCreatedTotal] = useState(0);

  const [updatedRows, setUpdatedRows] = useState<RotaryApiMember[]>([]);
  const [updatedPage, setUpdatedPage] = useState(0);
  const [updatedTotal, setUpdatedTotal] = useState(0);

  const [reportLoading, setReportLoading] = useState(false);
  const DEFAULT_REPORT_START = dayjs("2026-08-13");
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>([
    DEFAULT_REPORT_START,
    dayjs(),
  ]);

  const [districtOptions, setDistrictOptions] = useState<number[]>([]);
  const [selectedDistrictId, setSelectedDistrictId] =
    useState<number>(DEFAULT_DISTRICT_ID);
  const [districtLoading, setDistrictLoading] = useState(false);

  // 360 Profile Modal State
  const [selectedMember, setSelectedMember] = useState<RotaryApiMember | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const fetchSingleReport = async (
    type: "created" | "updated",
    pageNumber: number,
    startDate: string,
    endDate: string,
  ): Promise<RotaryReportResponse> => {
    const res = await fetch(
      `${BASE_URL}/marketing-service/campgin/report-rotary-data/${type}?page=${pageNumber}&size=${PAGE_SIZE}`,
      {
        method: "POST",
        headers: { accept: "*/*", "Content-Type": "application/json" },
        body: JSON.stringify({ startDate, endDate }),
      },
    );
    if (!res.ok) throw new Error(`Failed with status ${res.status}`);
    return res.json();
  };

  const fetchBothReports = async (startDate: string, endDate: string) => {
    setReportLoading(true);
    try {
      const [createdJson, updatedJson] = await Promise.all([
        fetchSingleReport("created", 0, startDate, endDate),
        fetchSingleReport("updated", 0, startDate, endDate),
      ]);
      setCreatedRows(createdJson.members ?? []);
      setCreatedTotal(
        createdJson.totalCreated ?? createdJson.pagination?.totalElements ?? 0,
      );
      setCreatedPage(createdJson.pagination?.page ?? 0);

      setUpdatedRows(updatedJson.members ?? []);
      setUpdatedTotal(
        updatedJson.totalUpdated ?? updatedJson.pagination?.totalElements ?? 0,
      );
      setUpdatedPage(updatedJson.pagination?.page ?? 0);
    } catch {
      message.error(
        "Could not load created/updated members. Please try again.",
      );
    } finally {
      setReportLoading(false);
    }
  };

  /* ---- Used only when paginating within Created or Updated tab ---- */
  const fetchReportPage = async (
    type: "created" | "updated",
    pageNumber: number,
  ) => {
    if (!dateRange) return;
    setReportLoading(true);
    try {
      const start = dateRange[0].format("YYYY-MM-DD");
      const end = dateRange[1].format("YYYY-MM-DD");
      const json = await fetchSingleReport(type, pageNumber, start, end);
      if (type === "created") {
        setCreatedRows(json.members ?? []);
        setCreatedTotal(
          json.totalCreated ?? json.pagination?.totalElements ?? 0,
        );
        setCreatedPage(json.pagination?.page ?? pageNumber);
      } else {
        setUpdatedRows(json.members ?? []);
        setUpdatedTotal(
          json.totalUpdated ?? json.pagination?.totalElements ?? 0,
        );
        setUpdatedPage(json.pagination?.page ?? pageNumber);
      }
    } catch {
      message.error(`Could not load ${type} members. Please try again.`);
    } finally {
      setReportLoading(false);
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
      fetchBothReports(
        DEFAULT_REPORT_START.format("YYYY-MM-DD"),
        dayjs().format("YYYY-MM-DD"),
      );
    })();
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

  const openMemberModal = (member: RotaryApiMember) => {
    setSelectedMember(member);
    setModalVisible(true);
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

  const createdProductsCount = useMemo(
    () => createdRows.reduce((sum, m) => sum + (m.products?.length ?? 0), 0),
    [createdRows],
  );
  const createdServicesCount = useMemo(
    () => createdRows.reduce((sum, m) => sum + (m.services?.length ?? 0), 0),
    [createdRows],
  );
  const updatedProductsCount = useMemo(
    () => updatedRows.reduce((sum, m) => sum + (m.products?.length ?? 0), 0),
    [updatedRows],
  );
  const updatedServicesCount = useMemo(
    () => updatedRows.reduce((sum, m) => sum + (m.services?.length ?? 0), 0),
    [updatedRows],
  );

  const visibleRows = useMemo(() => {
    if (activeTab === "created") return createdRows;
    if (activeTab === "updated") return updatedRows;
    if (activeTab === "complete") {
      return rows.filter((r) => getCompletion(r).pct === 100);
    }
    if (activeTab === "incomplete") {
      return rows.filter((r) => getCompletion(r).pct < 100);
    }
    return rows;
  }, [rows, createdRows, updatedRows, activeTab]);

  const handleTabChange = (
    tab: "all" | "complete" | "incomplete" | "created" | "updated",
  ) => {
    setActiveTab(tab);
  };

  /* ---- Table columns ---- */
  const columns: ColumnsType<RotaryApiMember> = [
    {
      title: <div style={{ textAlign: "center" }}>S.No</div>,
      key: "serialNumber",
      align: "center",
      width: 70,
      render: (_v, _r, index) => {
        const currentPage =
          activeTab === "created"
            ? createdPage
            : activeTab === "updated"
              ? updatedPage
              : page;
        return (
          <Text strong style={{ color: "#6b7280" }}>
            {currentPage * PAGE_SIZE + index + 1}
          </Text>
        );
      },
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
      render: (v: string | null, r) =>
        v ? (
          <Tooltip title="Click to view complete 360° profile">
            <Typography.Link
              strong
              onClick={() => openMemberModal(r)}
              style={{ color: "#0E6B4F", display: "block" }}
            >
              {v}
            </Typography.Link>
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
          <Text strong ellipsis style={{ display: "block" }}>
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
      title: <div style={{ textAlign: "center" }}>GST Details</div>,
      key: "gstDetails",
      align: "center",
      width: 180,
      render: (_: unknown, r: RotaryApiMember) => {
        if (!r.gstNumber && !r.gstDocumentUrl) {
          return <Text type="secondary">-</Text>;
        }
        return (
          <div className="flex flex-col items-center gap-1">
            {r.gstNumber && (
              <Tag color="cyan" style={{ fontWeight: 600, margin: 0 }}>
                {r.gstNumber}
              </Tag>
            )}
            {r.gstDocumentUrl && (
              <a
                href={r.gstDocumentUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[12px] text-[#0E6B4F] hover:underline inline-flex items-center gap-1 font-medium"
              >
                <FileTextOutlined /> View Doc
              </a>
            )}
          </div>
        );
      },
    },
    {
      title: <div style={{ textAlign: "center" }}>Anniversary</div>,
      dataIndex: "anniversary",
      key: "anniversary",
      align: "center",
      width: 140,
      render: (v: string | number | null) =>
        v ? <Text>{formatAnniversary(v)}</Text> : <Text type="secondary">-</Text>,
    },
    {
      title: <div style={{ textAlign: "center" }}>Products</div>,
      key: "products",
      align: "center",
      width: 140,
      render: (_: unknown, r: RotaryApiMember) => {
        const prodList = r.products || [];
        if (prodList.length === 0) return <Text type="secondary">-</Text>;
        return (
          <Popover
            trigger="click"
            placement="left"
            title={
              <div className="flex items-center justify-between border-b pb-2 pt-1 font-bold text-[#0E6B4F]">
                <span>📦 Products Catalog ({prodList.length})</span>
                <Button
                  type="link"
                  size="small"
                  onClick={() => openMemberModal(r)}
                  style={{ padding: 0, height: "auto" }}
                >
                  View 360°
                </Button>
              </div>
            }
            content={
              <div
                style={{
                  maxWidth: 440,
                  maxHeight: 400,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  padding: "4px 2px",
                }}
              >
                {prodList.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    style={{
                      padding: 10,
                      borderRadius: 8,
                      background: "#F5F8F6",
                      border: "1px solid #CDE2D8",
                      fontSize: 13,
                      lineHeight: "1.4",
                    }}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: 6,
                            border: "1px solid #e5e7eb",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 6,
                            background: "#E8F2EC",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#0E6B4F",
                          }}
                        >
                          <ShoppingOutlined style={{ fontSize: 22 }} />
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div className="font-bold text-[#1F2937] text-[14px]">
                          {p.name || "Untitled Product"}
                        </div>
                        <div className="text-gray-500 text-[12px]">
                          {p.category} {p.subCategory ? `• ${p.subCategory}` : ""}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-bold text-[#0E6B4F] text-[14px]">
                            ₹{p.price ?? 0}
                          </span>
                          {p.mrp && p.mrp > (p.price ?? 0) && (
                            <span className="line-through text-gray-400 text-[12px]">
                              ₹{p.mrp}
                            </span>
                          )}
                          {p.priceType && (
                            <Tag color="green" style={{ fontSize: 11, margin: 0 }}>
                              {p.priceType}
                            </Tag>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[12px] bg-white p-2 rounded border border-gray-100 mb-2">
                      {p.brand && (
                        <div>
                          <strong>Brand:</strong> {p.brand}
                        </div>
                      )}
                      {p.stockQuantity !== null && p.stockQuantity !== undefined && (
                        <div>
                          <strong>Stock:</strong> {p.stockQuantity} {p.quantityUnit || "units"}
                        </div>
                      )}
                      {p.quantity && (
                        <div>
                          <strong>Pack:</strong> {p.quantity} {p.quantityUnit || ""}
                        </div>
                      )}
                      {p.productCondition && (
                        <div>
                          <strong>Condition:</strong>{" "}
                          <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>
                            {p.productCondition}
                          </Tag>
                        </div>
                      )}
                      {p.returnAvailable !== null && (
                        <div>
                          <strong>Return:</strong>{" "}
                          {p.returnAvailable
                            ? `${p.returnDays ? `${p.returnDays} Days` : "Yes"}`
                            : "No"}
                        </div>
                      )}
                      {p.warrantyAvailable !== null && (
                        <div>
                          <strong>Warranty:</strong>{" "}
                          {p.warrantyAvailable
                            ? p.warrantyPeriod || "Yes"
                            : "No"}
                        </div>
                      )}
                      {p.deliveryTime && (
                        <div>
                          <strong>Delivery:</strong> {p.deliveryTime}
                        </div>
                      )}
                    </div>

                    {p.keyFeatures && (
                      <div className="text-[12px] mb-1">
                        <strong>Features:</strong> {p.keyFeatures}
                      </div>
                    )}
                    {p.description && (
                      <div className="text-[12px] text-gray-600">
                        <strong>Desc:</strong> {p.description}
                      </div>
                    )}
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
      width: 140,
      render: (_: unknown, r: RotaryApiMember) => {
        const servList = r.services || [];
        if (servList.length === 0) return <Text type="secondary">-</Text>;
        return (
          <Popover
            trigger="click"
            placement="left"
            title={
              <div className="flex items-center justify-between border-b pb-2 pt-1 font-bold text-[#A06C1E]">
                <span>💼 Services Portfolio ({servList.length})</span>
                <Button
                  type="link"
                  size="small"
                  onClick={() => openMemberModal(r)}
                  style={{ padding: 0, height: "auto" }}
                >
                  View 360°
                </Button>
              </div>
            }
            content={
              <div
                style={{
                  maxWidth: 440,
                  maxHeight: 400,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  padding: "4px 2px",
                }}
              >
                {servList.map((s, idx) => (
                  <div
                    key={s.id || idx}
                    style={{
                      padding: 10,
                      borderRadius: 8,
                      background: "#FAF6EE",
                      border: "1px solid #EEE4D1",
                      fontSize: 13,
                      lineHeight: "1.4",
                    }}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      {s.imageUrl ? (
                        <img
                          src={s.imageUrl}
                          alt={s.name}
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: 6,
                            border: "1px solid #e5e7eb",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 6,
                            background: "#F4EBD7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#A06C1E",
                          }}
                        >
                          <AppstoreOutlined style={{ fontSize: 22 }} />
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div className="font-bold text-[#1F2937] text-[14px]">
                          {s.name || "Untitled Service"}
                        </div>
                        <div className="text-gray-500 text-[12px]">
                          {s.category} {s.subCategory ? `• ${s.subCategory}` : ""}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-bold text-[#A06C1E] text-[14px]">
                            ₹{s.price ?? 0}
                          </span>
                          {s.priceType && (
                            <Tag color="gold" style={{ fontSize: 11, margin: 0 }}>
                              {s.priceType}
                            </Tag>
                          )}
                          {s.serviceMode && (
                            <Tag color="purple" style={{ fontSize: 11, margin: 0 }}>
                              {s.serviceMode}
                            </Tag>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[12px] bg-white p-2 rounded border border-gray-100 mb-2">
                      {s.providerName && (
                        <div>
                          <strong>Provider:</strong> {s.providerName}
                        </div>
                      )}
                      {s.businessName && (
                        <div>
                          <strong>Firm:</strong> {s.businessName}
                        </div>
                      )}
                      {s.serviceDuration && (
                        <div>
                          <strong>Duration:</strong> {s.serviceDuration} mins
                        </div>
                      )}
                      {s.serviceLocation && (
                        <div>
                          <strong>Location:</strong> {s.serviceLocation}
                        </div>
                      )}
                      {s.bookingRequired !== null && (
                        <div>
                          <strong>Booking Req:</strong>{" "}
                          {s.bookingRequired ? "Yes" : "No"}
                        </div>
                      )}
                      {s.targetCustomers && (
                        <div>
                          <strong>Audience:</strong> {s.targetCustomers}
                        </div>
                      )}
                    </div>

                    {s.brochureUrl && (
                      <div className="mb-1">
                        <a
                          href={s.brochureUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[12px] text-[#A06C1E] hover:underline inline-flex items-center gap-1 font-medium"
                        >
                          <FileTextOutlined /> View Brochure / Portfolio
                        </a>
                      </div>
                    )}
                    {s.keyFeatures && (
                      <div className="text-[12px] mb-1">
                        <strong>Features:</strong> {s.keyFeatures}
                      </div>
                    )}
                    {s.description && (
                      <div className="text-[12px] text-gray-600">
                        <strong>Desc:</strong> {s.description}
                      </div>
                    )}
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
    // {
    //   title: <div style={{ textAlign: "center" }}>Profile Completion</div>,
    //   key: "completion",
    //   align: "center",
    //   width: 190,
    //   sorter: (a, b) => getCompletion(a).pct - getCompletion(b).pct,
    //   render: (_: unknown, r: RotaryApiMember) => {
    //     const { filled, total, pct } = getCompletion(r);
    //     const strokeColor =
    //       pct === 100 ? "#0E6B4F" : pct >= 50 ? "#C9932B" : "#A32642";
    //     return (
    //       <Tooltip title={`${filled} of ${total} fields filled`}>
    //         <Space direction="vertical" size={2} style={{ width: 160 }}>
    //           <Progress
    //             percent={pct}
    //             size="small"
    //             strokeColor={strokeColor}
    //             format={(p) => `${p}%`}
    //           />
    //           <Text style={{ fontSize: 12, color: "#6B5D4F" }}>
    //             {filled}/{total} fields
    //           </Text>
    //         </Space>
    //       </Tooltip>
    //     );
    //   },
    // },
    {
      title: <div style={{ textAlign: "center" }}>Actions</div>,
      key: "actions",
      align: "center",
      width: 120,
      render: (_: unknown, r: RotaryApiMember) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => openMemberModal(r)}
          style={{
            background: "#0E6B4F",
            borderColor: "#0E6B4F",
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          Inspect
        </Button>
      ),
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
                Admin view — track and inspect member profiles, business listings, products catalog, and services portfolio.
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
              onClick={() => handleTabChange("created")}
              style={{
                background: activeTab === "created" ? "#EFF6FF" : "#ffffff",
                border:
                  activeTab === "created"
                    ? "1px solid #2563EB"
                    : "1px solid #eee",
                borderLeft: "4px solid #2563EB",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                cursor: "pointer",
              }}
              styles={{ body: { padding: "10px 18px" } }}
            >
              <Text
                className="block text-[14px]"
                type="secondary"
                style={{ fontWeight: 700 }}
              >
                Newly Created
              </Text>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  marginTop: 2,
                }}
              >
                <Text
                  strong
                  className="text-[18px]"
                  style={{ color: "#2563EB" }}
                >
                  {createdTotal.toLocaleString()}
                </Text>
                <Text style={{ fontSize: 14, color: "#6b7280" }}>
                  <Text strong style={{ fontSize: 14, color: "#16A34A" }}>
                    {createdProductsCount}
                  </Text>{" "}
                  products ·{" "}
                  <Text strong style={{ fontSize: 14, color: "#C9932B" }}>
                    {createdServicesCount}
                  </Text>{" "}
                  services
                </Text>
              </div>
            </Card>
            <Card
              className="rounded-xl"
              onClick={() => handleTabChange("updated")}
              style={{
                background: activeTab === "updated" ? "#FFF9EE" : "#ffffff",
                border:
                  activeTab === "updated"
                    ? "1px solid #C9932B"
                    : "1px solid #eee",
                borderLeft: "4px solid #C9932B",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                cursor: "pointer",
              }}
              styles={{ body: { padding: "10px 18px" } }}
            >
              <Text
                className="block text-[14px]"
                type="secondary"
                style={{ fontWeight: 700 }}
              >
                Updated
              </Text>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  marginTop: 2,
                }}
              >
                <Text
                  strong
                  className="text-[18px]"
                  style={{ color: "#C9932B" }}
                >
                  {updatedTotal.toLocaleString()}
                </Text>
                <Text style={{ fontSize: 14, color: "#6b7280" }}>
                  <Text strong style={{ fontSize: 14, color: "#16A34A" }}>
                    {updatedProductsCount}
                  </Text>{" "}
                  products ·{" "}
                  <Text strong style={{ fontSize: 14, color: "#C9932B" }}>
                    {updatedServicesCount}
                  </Text>{" "}
                  services
                </Text>
              </div>
            </Card>
          </div>

          {(activeTab === "created" || activeTab === "updated") && (
            <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
              {/* Left side - Date filters */}
              <Space wrap>
                <DatePicker.RangePicker
                  value={dateRange}
                  onChange={(dates) =>
                    setDateRange(dates as [Dayjs, Dayjs] | null)
                  }
                  format="DD-MM-YYYY"
                  allowClear={false}
                />

                <Button
                  type="primary"
                  loading={reportLoading}
                  onClick={() => {
                    if (!dateRange) {
                      message.warning("Please select a start and end date");
                      return;
                    }

                    const start = dateRange[0].format("YYYY-MM-DD");
                    const end = dateRange[1].format("YYYY-MM-DD");

                    fetchBothReports(start, end);
                  }}
                >
                  Apply
                </Button>
              </Space>

              {/* Right side - Back button */}
              <Button
                onClick={() => handleTabChange("all")}
                style={{
                  borderRadius: 8,
                  fontWeight: 600,
                  border: "1px solid #0E6B4F",
                  color: "#0E6B4F",
                }}
              >
                ← Back to Members List
              </Button>
            </div>
          )}

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
                loading={
                  activeTab === "created" || activeTab === "updated"
                    ? reportLoading
                    : loading
                }
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
                    : activeTab === "created"
                      ? {
                          current: createdPage + 1,
                          pageSize: PAGE_SIZE,
                          total: createdTotal,
                          showSizeChanger: false,
                          onChange: (p) => fetchReportPage("created", p - 1),
                        }
                      : activeTab === "updated"
                        ? {
                            current: updatedPage + 1,
                            pageSize: PAGE_SIZE,
                            total: updatedTotal,
                            showSizeChanger: false,
                            onChange: (p) => fetchReportPage("updated", p - 1),
                          }
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

      {/* 360° Member Profile Inspection Modal */}
      <Modal
        title={
          <div className="flex items-center justify-between pr-6">
            <div className="flex items-center gap-2">
              <UserOutlined className="text-[#0E6B4F] text-lg" />
              <span className="text-[18px] font-bold text-[#1F2937]">
                {selectedMember?.name || "Member Profile"}
              </span>
              {selectedMember?.rotaryId && (
                <Tag color="cyan" className="font-semibold">
                  ID: {selectedMember.rotaryId}
                </Tag>
              )}
            </div>
            {selectedMember && (
              <Badge
                count={`${getCompletion(selectedMember).pct}% Complete`}
                style={{
                  backgroundColor:
                    getCompletion(selectedMember).pct === 100
                      ? "#0E6B4F"
                      : getCompletion(selectedMember).pct >= 50
                        ? "#C9932B"
                        : "#A32642",
                }}
              />
            )}
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={950}
        styles={{ body: { maxHeight: "75vh", overflowY: "auto", padding: "16px 24px" } }}
      >
        {selectedMember && (
          <Tabs
            defaultActiveKey="personal"
            items={[
              {
                key: "personal",
                label: (
                  <span className="font-semibold">
                    <UserOutlined /> Personal & Contact
                  </span>
                ),
                children: (
                  <div className="py-2">
                    <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
                      <Descriptions.Item label="Full Name">
                        <Text strong>{selectedMember.name || "-"}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Rotary ID">
                        {selectedMember.rotaryId || "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Primary Mobile">
                        {selectedMember.mobileNumbers ? (
                          <a href={`tel:${selectedMember.mobileNumbers.split(",")[0]}`}>
                            {selectedMember.mobileNumbers}
                          </a>
                        ) : (
                          "-"
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Secondary Mobile">
                        {selectedMember.secondaryMobile ? (
                          <a href={`tel:${selectedMember.secondaryMobile.split(",")[0]}`}>
                            {selectedMember.secondaryMobile}
                          </a>
                        ) : (
                          "-"
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Email Address">
                        {selectedMember.emails ? (
                          <a href={`mailto:${selectedMember.emails.split(",")[0]}`}>
                            {selectedMember.emails}
                          </a>
                        ) : (
                          "-"
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Blood Group">
                        {selectedMember.bloodGroup ? (
                          <Tag color="red" className="font-bold">
                            {selectedMember.bloodGroup}
                          </Tag>
                        ) : (
                          "-"
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Rotary Club">
                        {selectedMember.clubName || "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="District ID">
                        {selectedMember.districtId || "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="City & State">
                        {[selectedMember.city, selectedMember.state].filter(Boolean).join(", ") || "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Anniversary">
                        {formatAnniversary(selectedMember.anniversary)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Residential Address" span={2}>
                        {selectedMember.address || "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Profile Created">
                        {formatDate(selectedMember.createdAt)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Last Updated">
                        {formatDate(selectedMember.updatedAt)}
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                ),
              },
              {
                key: "business",
                label: (
                  <span className="font-semibold">
                    <ShopOutlined /> Business & GST
                  </span>
                ),
                children: (
                  <div className="py-2">
                    <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
                      <Descriptions.Item label="Business Name">
                        <Text strong>{selectedMember.businessName || "-"}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Classification">
                        {selectedMember.classification ? (
                          <Tag color="blue">{selectedMember.classification}</Tag>
                        ) : (
                          "-"
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Business Phone">
                        {selectedMember.businessPhone ? (
                          <a href={`tel:${selectedMember.businessPhone}`}>
                            {selectedMember.businessPhone}
                          </a>
                        ) : (
                          "-"
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Business Email">
                        {selectedMember.businessEmail ? (
                          <a href={`mailto:${selectedMember.businessEmail}`}>
                            {selectedMember.businessEmail}
                          </a>
                        ) : (
                          "-"
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="GST Number (GSTIN)">
                        {selectedMember.gstNumber ? (
                          <Tag color="cyan" className="font-semibold text-[13px]">
                            {selectedMember.gstNumber}
                          </Tag>
                        ) : (
                          "-"
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="GST Certificate / Doc">
                        {selectedMember.gstDocumentUrl ? (
                          <a
                            href={selectedMember.gstDocumentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-[#0E6B4F]"
                          >
                            <FileTextOutlined /> View GST Certificate
                          </a>
                        ) : (
                          <Text type="secondary">No document uploaded</Text>
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Business Address" span={2}>
                        {selectedMember.businessAddress || "-"}
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                ),
              },
              {
                key: "products",
                label: (
                  <span className="font-semibold">
                    <ShoppingOutlined /> Products ({selectedMember.products?.length || 0})
                  </span>
                ),
                children: (
                  <div className="py-2">
                    {(!selectedMember.products || selectedMember.products.length === 0) ? (
                      <Empty description="No products added by this member." />
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedMember.products.map((p, idx) => (
                          <Card
                            key={p.id || idx}
                            size="small"
                            className="rounded-xl border border-gray-200 shadow-sm"
                            styles={{ body: { padding: 14 } }}
                          >
                            <div className="flex gap-3 mb-3">
                              {p.imageUrl ? (
                                <Image
                                  src={p.imageUrl}
                                  alt={p.name}
                                  width={75}
                                  height={75}
                                  style={{ objectFit: "cover", borderRadius: 8 }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: 75,
                                    height: 75,
                                    borderRadius: 8,
                                    background: "#E8F2EC",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#0E6B4F",
                                  }}
                                >
                                  <ShoppingOutlined style={{ fontSize: 30 }} />
                                </div>
                              )}
                              <div style={{ flex: 1 }}>
                                <div className="font-bold text-[15px] text-[#1F2937]">
                                  {p.name}
                                </div>
                                <div className="text-gray-500 text-[13px] mb-1">
                                  {p.category} {p.subCategory ? `• ${p.subCategory}` : ""}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[16px] font-extrabold text-[#0E6B4F]">
                                    ₹{p.price ?? 0}
                                  </span>
                                  {p.mrp && p.mrp > (p.price ?? 0) && (
                                    <span className="line-through text-gray-400 text-[13px]">
                                      ₹{p.mrp}
                                    </span>
                                  )}
                                  {p.priceType && (
                                    <Tag color="green">{p.priceType}</Tag>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="bg-gray-50 p-2.5 rounded-lg text-[13px] grid grid-cols-2 gap-2 mb-2">
                              <div>
                                <span className="text-gray-500">Brand:</span>{" "}
                                <strong>{p.brand || "-"}</strong>
                              </div>
                              <div>
                                <span className="text-gray-500">Stock:</span>{" "}
                                <strong>{p.stockQuantity ?? "-"} {p.quantityUnit || ""}</strong>
                              </div>
                              <div>
                                <span className="text-gray-500">Pack:</span>{" "}
                                <strong>{p.quantity ?? "-"} {p.quantityUnit || ""}</strong>
                              </div>
                              <div>
                                <span className="text-gray-500">Condition:</span>{" "}
                                {p.productCondition ? (
                                  <Tag color="blue">{p.productCondition}</Tag>
                                ) : (
                                  "-"
                                )}
                              </div>
                              <div>
                                <span className="text-gray-500">Return:</span>{" "}
                                <strong>
                                  {p.returnAvailable
                                    ? `${p.returnDays ? `${p.returnDays} Days` : "Yes"}`
                                    : "No"}
                                </strong>
                              </div>
                              <div>
                                <span className="text-gray-500">Warranty:</span>{" "}
                                <strong>
                                  {p.warrantyAvailable
                                    ? p.warrantyPeriod || "Yes"
                                    : "No"}
                                </strong>
                              </div>
                              <div className="col-span-2">
                                <span className="text-gray-500">Delivery:</span>{" "}
                                <strong>{p.deliveryTime || "-"}</strong>
                              </div>
                            </div>

                            {p.keyFeatures && (
                              <div className="text-[13px] mb-1">
                                <span className="text-gray-500">Features:</span> {p.keyFeatures}
                              </div>
                            )}
                            {p.description && (
                              <div className="text-[13px] text-gray-600">
                                <span className="text-gray-500">Description:</span> {p.description}
                              </div>
                            )}
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: "services",
                label: (
                  <span className="font-semibold">
                    <AppstoreOutlined /> Services ({selectedMember.services?.length || 0})
                  </span>
                ),
                children: (
                  <div className="py-2">
                    {(!selectedMember.services || selectedMember.services.length === 0) ? (
                      <Empty description="No services added by this member." />
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedMember.services.map((s, idx) => (
                          <Card
                            key={s.id || idx}
                            size="small"
                            className="rounded-xl border border-gray-200 shadow-sm"
                            styles={{ body: { padding: 14 } }}
                          >
                            <div className="flex gap-3 mb-3">
                              {s.imageUrl ? (
                                <Image
                                  src={s.imageUrl}
                                  alt={s.name}
                                  width={75}
                                  height={75}
                                  style={{ objectFit: "cover", borderRadius: 8 }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: 75,
                                    height: 75,
                                    borderRadius: 8,
                                    background: "#F4EBD7",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#A06C1E",
                                  }}
                                >
                                  <AppstoreOutlined style={{ fontSize: 30 }} />
                                </div>
                              )}
                              <div style={{ flex: 1 }}>
                                <div className="font-bold text-[15px] text-[#1F2937]">
                                  {s.name}
                                </div>
                                <div className="text-gray-500 text-[13px] mb-1">
                                  {s.category} {s.subCategory ? `• ${s.subCategory}` : ""}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[16px] font-extrabold text-[#A06C1E]">
                                    ₹{s.price ?? 0}
                                  </span>
                                  {s.priceType && (
                                    <Tag color="gold">{s.priceType}</Tag>
                                  )}
                                  {s.serviceMode && (
                                    <Tag color="purple">{s.serviceMode}</Tag>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="bg-amber-50/50 p-2.5 rounded-lg text-[13px] grid grid-cols-2 gap-2 mb-2">
                              <div>
                                <span className="text-gray-500">Provider:</span>{" "}
                                <strong>{s.providerName || "-"}</strong>
                              </div>
                              <div>
                                <span className="text-gray-500">Business / Clinic:</span>{" "}
                                <strong>{s.businessName || "-"}</strong>
                              </div>
                              <div>
                                <span className="text-gray-500">Duration:</span>{" "}
                                <strong>{s.serviceDuration ? `${s.serviceDuration} mins` : "-"}</strong>
                              </div>
                              <div>
                                <span className="text-gray-500">Location:</span>{" "}
                                <strong>{s.serviceLocation || "-"}</strong>
                              </div>
                              <div>
                                <span className="text-gray-500">Booking Req:</span>{" "}
                                <strong>{s.bookingRequired ? "Yes" : "No"}</strong>
                              </div>
                              <div>
                                <span className="text-gray-500">Target Audience:</span>{" "}
                                <strong>{s.targetCustomers || "-"}</strong>
                              </div>
                              {s.cancellationPolicy && (
                                <div className="col-span-2">
                                  <span className="text-gray-500">Cancellation:</span>{" "}
                                  <strong>{s.cancellationPolicy}</strong>
                                </div>
                              )}
                              {s.refundPolicy && (
                                <div className="col-span-2">
                                  <span className="text-gray-500">Refund:</span>{" "}
                                  <strong>{s.refundPolicy}</strong>
                                </div>
                              )}
                            </div>

                            {s.brochureUrl && (
                              <div className="mb-2">
                                <a
                                  href={s.brochureUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 font-semibold text-[#A06C1E] text-[13px]"
                                >
                                  <FileTextOutlined /> View Brochure / Portfolio
                                </a>
                              </div>
                            )}
                            {s.keyFeatures && (
                              <div className="text-[13px] mb-1">
                                <span className="text-gray-500">Features:</span> {s.keyFeatures}
                              </div>
                            )}
                            {s.description && (
                              <div className="text-[13px] text-gray-600">
                                <span className="text-gray-500">Description:</span> {s.description}
                              </div>
                            )}
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                ),
              },
            ]}
          />
        )}
      </Modal>
    </ConfigProvider>
  );
};

export default RotaryDataAdmin;
