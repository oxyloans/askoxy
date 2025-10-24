import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  Table,
  TableProps,
  Input,
  Select,
  Tag,
  Button,
  Skeleton,
  Empty,
  Space,
  Grid,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  DownloadOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import BASE_URL from "../Config";
import "antd/dist/reset.css";

const { Search } = Input;
const { useBreakpoint } = Grid;

/** ================= Types ================== */
interface OfferDetails {
  userId: string | null;
  projectType: string;
  askOxyOfers: string;
  mobileNumber: string | null;
  registrationDate?: string | null;
  createdAt: string | number | null;
  _createdAtMs?: number;
}
interface User {
  deliveryType: string | null;
  whatsappNumber: string | null;
  firstName?: string;
  lastName?: string;
  email?: string | null;
  transportType?: string | null;
  scriptId?: string | null;
  familyCount?: number;
  createdAt: string | number | null;
  userId: string;
  _createdAtMs?: number;
}

/** ================= Helpers ================== */
const knownOfferTypes = [
  "WEAREHIRING",
  "ROTARIAN",
  "MY ROTARY",
  "LEGALSERVICES",
  "LEGAL SERVICE",
  "STUDYABROAD",
  "FREEAI",
  "FREESAMPLE",
  "FREERUDHRAKSHA",
  "FREERUDRAKSHA",
  "FREE RUDHRAKSHA",
];

const toMs = (val: string | number | null | undefined): number => {
  if (val == null) return 0;
  if (typeof val === "number") return val;
  const d1 = new Date(val);
  if (!isNaN(d1.getTime())) return d1.getTime();
  const d2 = dayjs(val);
  if (d2.isValid()) return d2.valueOf();
  const fixed = String(val).replace(" ", "T");
  const d3 = dayjs(fixed);
  return d3.isValid() ? d3.valueOf() : 0;
};
const fmt = (val: string | number | null | undefined): string => {
  const ms = toMs(val ?? null);
  return ms ? dayjs(ms).format("MMM DD, YYYY HH:mm") : "No date";
};
const tagColor = (offer: string | undefined) => {
  const v = (offer || "").toUpperCase();
  if (v.includes("RUDRAK")) return "orange";
  if (v.includes("SAMPLE")) return "green";
  if (v.includes("FREEAI") || v.includes("GEN")) return "geekblue";
  if (v.includes("STUDY")) return "purple";
  if (v.includes("LEGAL")) return "gold";
  if (v.includes("ROTARY")) return "magenta";
  if (v.includes("WEAREHIRING")) return "volcano";
  return "blue";
};

/** ================= Component ================== */
const Admin: React.FC = () => {
  const screens = useBreakpoint();
  // Consider < lg as mobile (covers small tablets)
  const isMobile = !screens.lg;

  const [rawOffers, setRawOffers] = useState<OfferDetails[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [searchText, setSearchText] = useState<string>("");
  const [debouncedTerm, setDebouncedTerm] = useState<string>("");
  const [serviceFilter, setServiceFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  // Mobile list ref + FAB visibility
  const listRef = useRef<HTMLDivElement | null>(null);
  const [showFab, setShowFab] = useState(false);

  // debounce search
  useEffect(() => {
    const t = setTimeout(
      () => setDebouncedTerm(searchText.trim().toLowerCase()),
      250
    );
    return () => clearTimeout(t);
  }, [searchText]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await Promise.allSettled([
        axios.get(`${BASE_URL}/auth-service/auth/usersOfferesDetails`),
        axios.get(`${BASE_URL}/auth-service/auth/AllusersAddress`),
        axios.get(
          `${BASE_URL}/marketing-service/campgin/getAllInterestedUsres`
        ),
        axios.get(`${BASE_URL}/marketing-service/campgin/AllusersAddress`),
      ]);

      const offers: OfferDetails[] = [];
      if (res[0].status === "fulfilled") {
        for (const o of (res[0].value.data || []) as OfferDetails[]) {
          offers.push({ ...o, _createdAtMs: toMs(o.createdAt) });
        }
      }
      if (res[2].status === "fulfilled") {
        for (const o of (res[2].value.data || []) as OfferDetails[]) {
          offers.push({ ...o, _createdAtMs: toMs(o.createdAt) });
        }
      }
      setRawOffers(offers);

      const usersCollector: User[] = [];
      if (res[1].status === "fulfilled") {
        for (const u of (res[1].value.data || []) as User[]) {
          usersCollector.push({ ...u, _createdAtMs: toMs(u.createdAt) });
        }
      }
      if (res[3].status === "fulfilled") {
        for (const u of (res[3].value.data || []) as User[]) {
          usersCollector.push({ ...u, _createdAtMs: toMs(u.createdAt) });
        }
      }
      setUsers(usersCollector);
    } catch (e: any) {
      console.error(e);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // dynamic labels from API (unknown types)
  const dynamicLabels = useMemo(() => {
    const set = new Set<string>();
    for (const o of rawOffers) {
      const label = (o.askOxyOfers || "").trim();
      if (label && !knownOfferTypes.includes(label.toUpperCase()))
        set.add(label);
    }
    return Array.from(set);
  }, [rawOffers]);

  // options: known + dynamic, unique
  const serviceOptions = useMemo(() => {
    const all = Array.from(
      new Set([...knownOfferTypes, ...dynamicLabels])
    ).filter(Boolean);
    return all.map((s) => ({ label: s, value: s }));
  }, [dynamicLabels]);

  // merged rows
  const mergedRows: OfferDetails[] = useMemo(() => {
    const syntheticFromUsers: OfferDetails[] = users.map((u, idx) => ({
      userId: u.userId || String(idx),
      projectType: "ASKOXY",
      mobileNumber: u.whatsappNumber ?? null,
      askOxyOfers: "FREE RUDHRAKSHA",
      registrationDate: null,
      createdAt: u.createdAt,
      _createdAtMs: u._createdAtMs,
    }));
    return [...rawOffers, ...syntheticFromUsers].sort(
      (a, b) => (b._createdAtMs || 0) - (a._createdAtMs || 0)
    );
  }, [rawOffers, users]);

  const filteredRows = useMemo(() => {
    return mergedRows.filter((o: any) => {
      // Filter WE ARE HIRING users
      if (serviceFilter.includes("WEAREHIRING") && o.userRole !== "EMPLOYEE") {
        return false;
      }
      if (serviceFilter.length > 0 && !serviceFilter.includes("WEAREHIRING")) {
        const val = (o.askOxyOfers || "").trim().toUpperCase();
        const matchesFilter = serviceFilter.some(
          (f) => val === f.toUpperCase()
        );
        if (!matchesFilter) return false;
      }
      if (debouncedTerm) {
        const service = (o.askOxyOfers || "").toLowerCase();
        const mobile = (o.mobileNumber || "").toLowerCase();
        if (!service.includes(debouncedTerm) && !mobile.includes(debouncedTerm))
          return false;
      }
      return true;
    });
  }, [mergedRows, serviceFilter, debouncedTerm]);

  /** ---------- CSV export (filtered view) ---------- */
  const toCSV = (rows: OfferDetails[]) => {
    if (!rows.length) return "";
    const headers = ["S.No", "Mobile Number", "Interested In", "Created At"];
    const csv = [headers.join(",")];
    rows.forEach((r, i) => {
      const row = [
        String(i + 1),
        r.mobileNumber || "N/A",
        r.askOxyOfers || "",
        fmt(r._createdAtMs || r.createdAt),
      ].map((cell) => {
        const s = String(cell);
        return s.includes(",") ? `"${s}"` : s;
      });
      csv.push(row.join(","));
    });
    return "\uFEFF" + csv.join("\n");
  };
  const handleDownload = () => {
    if (!filteredRows.length) return;
    const blob = new Blob([toCSV(filteredRows)], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const tag = serviceFilter.length
      ? serviceFilter.join("-").toLowerCase()
      : "all";
    a.download = `askoxy-interested-${tag}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /** ---------- Table columns (desktop/tablet) ---------- */
  const [sortOrder, setSortOrder] = useState<"ascend" | "descend" | null>(
    "descend"
  );
  const columns: TableProps<OfferDetails>["columns"] = [
    {
      title: "S.No",
      key: "index",
      align: "center",
      width: 80,
      render: (_: any, __: any, index: number) =>
        index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      align: "center",
      width: 190,
      render: (v: string | null) => v || "N/A",
    },
    {
      title: "Interested In",
      dataIndex: "askOxyOfers",
      key: "askOxyOfers",
      align: "center",
      width: 230,
      render: (v: string) => <Tag color={tagColor(v)}>{v || "N/A"}</Tag>,
    },
    {
      title: "Created At",
      dataIndex: "_createdAtMs",
      key: "_createdAtMs",
      align: "center",
      width: 220,
      render: (_: any, row: OfferDetails) =>
        fmt(row._createdAtMs || row.createdAt),
      sorter: (a, b) => (a._createdAtMs || 0) - (b._createdAtMs || 0),
      sortOrder: sortOrder as any,
      defaultSortOrder: "descend",
      sortDirections: ["descend", "ascend"],
      onHeaderCell: () => ({
        onClick: () =>
          setSortOrder((prev) => (prev === "descend" ? "ascend" : "descend")),
      }),
    },
  ];

  /** ---------- Header actions ---------- */
  const resetFilters = () => {
    setSearchText("");
    setServiceFilter([]);
    setCurrentPage(1);
  };

  // Mobile scroll listener to show FAB (based on listRef)
  useEffect(() => {
    if (!isMobile) return;
    const el = listRef.current;
    if (!el) return;
    const onScroll = () => setShowFab(el.scrollTop > 300);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [isMobile, listRef]);

  const quickFilters = [
    "All",
    "FREESAMPLE",
    "FREE RUDHRAKSHA",
    "FREEAI",
    "STUDYABROAD",
    "LEGAL SERVICE",
    "ROTARIAN",
  ];
  const toggleFilter = (filter: string) => {
    if (filter === "All") {
      setServiceFilter([]);
    } else {
      setServiceFilter((prev) =>
        prev.includes(filter)
          ? prev.filter((f) => f !== filter)
          : [...prev, filter]
      );
    }
    setCurrentPage(1);
    // When a filter is chosen from dock, jump list to top (mobile)
    if (listRef.current)
      listRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Calculate page range
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredRows.length);
  const currentPageData = filteredRows.slice(startIndex, endIndex);

  /** ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Controls (never sticky) */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3">
          {/* Title + Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
            <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
              Admin Dashboard
            </h1>
            <Space size="small" wrap className="w-full lg:w-auto">
              <Button
                block={isMobile}
                icon={<ReloadOutlined />}
                onClick={fetchAll}
              >
                Refresh
              </Button>

              <Button
                block={isMobile}
                icon={<FilterOutlined />}
                onClick={resetFilters}
              >
                Clear
              </Button>

              <Button
                block={isMobile}
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownload}
                disabled={!filteredRows.length}
              >
                Export
              </Button>

              {/* 💼 WE ARE HIRING Button (Purple + Highlighted on Active) */}
              <Button
                block={isMobile}
                style={{
                  fontWeight: 600,
                  borderColor: serviceFilter.includes("WEAREHIRING")
                    ? "#722ed1"
                    : "#b37feb",
                  color: serviceFilter.includes("WEAREHIRING")
                    ? "white"
                    : "#722ed1",
                  background: serviceFilter.includes("WEAREHIRING")
                    ? "linear-gradient(90deg, #722ed1 0%, #9254de 100%)"
                    : "transparent",
                  boxShadow: serviceFilter.includes("WEAREHIRING")
                    ? "0 0 10px rgba(114,46,209,0.5)"
                    : "none",
                  transition: "all 0.3s ease",
                }}
                onClick={() => {
                  setServiceFilter((prev) =>
                    prev.includes("WEAREHIRING") ? [] : ["WEAREHIRING"]
                  );
                  setCurrentPage(1);
                }}
              >
                WE ARE HIRING
              </Button>
            </Space>
          </div>

          {/* Search + Select (stacked on mobile) */}
          <div className="mt-2 space-y-3 sm:space-y-0">
            {/* Mobile-first stacked layout */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Search Input */}
              <div className="flex-1 min-w-0">
                <Search
                  allowClear
                  placeholder={
                    isMobile ? "Search..." : "Search by service or mobile…"
                  }
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={`w-full ${
                    isMobile ? "search-mobile" : "search-desktop"
                  }`}
                  size={isMobile ? "large" : "middle"} // Large on mobile for better touch targets
                  prefix={
                    <SearchOutlined
                      style={{
                        fontSize: isMobile ? 16 : 14,
                        color: "#8c8c8c",
                      }}
                    />
                  }
                  style={{
                    fontSize: isMobile ? "16px" : "14px", // Prevents zoom on iOS
                  }}
                />
              </div>

              {/* Service Filter Select */}
              <div
                className={`w-full sm:w-72 lg:w-80 ${
                  isMobile ? "max-w-[260px] self-start" : ""
                }`}
              >
                <Select
                  mode="multiple"
                  size={isMobile ? "middle" : "middle"} // smaller height on mobile
                  maxTagCount={isMobile ? 0 : 2}
                  maxTagTextLength={isMobile ? 8 : 12}
                  allowClear
                  showSearch
                  placeholder={isMobile ? "Filter" : "Filter Services"}
                  options={serviceOptions}
                  value={serviceFilter}
                  onChange={(vals) => {
                    setServiceFilter(vals || []);
                    setCurrentPage(1);
                  }}
                  className="w-full"
                  style={isMobile ? { height: 40 } : undefined} // keep control neat
                  dropdownMatchSelectWidth={true} // dropdown = control width (prevents overflow)
                  dropdownStyle={{
                    maxHeight: isMobile ? 300 : 320,
                    zIndex: 1050,
                  }}
                  filterOption={(input, option) =>
                    (option?.label as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  showArrow={!isMobile || serviceFilter.length === 0}
                  tagRender={
                    isMobile
                      ? undefined
                      : (props) => (
                          <span className="ant-select-selection-item">
                            {props.label}
                          </span>
                        )
                  }
                />
              </div>
            </div>
          </div>

          {/* Quick Filters (top row; non-sticky) */}
          <div
            className="mt-2 flex gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "thin", WebkitOverflowScrolling: "touch" }}
          >
            {quickFilters.map((filter) => {
              const selected =
                filter === "All"
                  ? serviceFilter.length === 0
                  : serviceFilter.includes(filter);
              return (
                <Button
                  key={filter}
                  type={selected ? "primary" : "default"}
                  size="small"
                  className="flex-shrink-0 text-xs px-3 h-8"
                  onClick={() => toggleFilter(filter)}
                >
                  {filter}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <StatCard title="Total" value={filteredRows.length} />
          <StatCard
            title="Samples"
            value={
              filteredRows.filter((o) =>
                (o.askOxyOfers || "").toUpperCase().includes("SAMPLE")
              ).length
            }
          />
          <StatCard
            title="Rudraksha"
            value={
              filteredRows.filter((o) =>
                (o.askOxyOfers || "").toUpperCase().includes("RUDRAK")
              ).length
            }
          />
          <StatCard
            title="Free AI"
            value={
              filteredRows.filter((o) =>
                (o.askOxyOfers || "").toUpperCase().includes("FREEAI")
              ).length
            }
          />
          <StatCard
            title="Study"
            value={
              filteredRows.filter((o) =>
                (o.askOxyOfers || "").toUpperCase().includes("STUDY")
              ).length
            }
          />
          <StatCard
            title="Legal"
            value={
              filteredRows.filter((o) =>
                (o.askOxyOfers || "").toUpperCase().includes("LEGAL")
              ).length
            }
          />
        </div>
      </div>

      {/* Content */}
      <div
        className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pb-6"
        // Reserve space for bottom dock on iOS/Android
        style={{
          paddingBottom: isMobile
            ? "calc(env(safe-area-inset-bottom, 0px) + 64px)"
            : undefined,
        }}
      >
        {loading ? (
          <div className="bg-white border rounded-xl p-4">
            <Skeleton active paragraph={{ rows: 6 }} />
          </div>
        ) : error ? (
          <div className="bg-white border rounded-xl p-6 text-center">
            <p className="text-red-600">{error}</p>
            <Button
              className="mt-3"
              onClick={fetchAll}
              icon={<ReloadOutlined />}
            >
              Retry
            </Button>
          </div>
        ) : !filteredRows.length ? (
          <div className="bg-white border rounded-xl p-8 text-center">
            <Empty description="No data found" />
          </div>
        ) : isMobile ? (
          /* --------- MOBILE CARD LIST --------- */
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden relative">
            {/* Top pager (simple, non-sticky) */}
            <div className="px-3 py-2 border-b bg-gray-50 text-sm text-gray-600 flex justify-between items-center">
              <span>
                {startIndex + 1}-{endIndex} of {filteredRows.length}
              </span>
              {filteredRows.length > pageSize && (
                <div className="flex items-center gap-1">
                  <Button
                    size="small"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="h-8"
                  >
                    ‹
                  </Button>
                  <span className="text-xs px-2 py-1">
                    {currentPage}/{Math.ceil(filteredRows.length / pageSize)}
                  </span>
                  <Button
                    size="small"
                    disabled={
                      currentPage >= Math.ceil(filteredRows.length / pageSize)
                    }
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="h-8"
                  >
                    ›
                  </Button>
                </div>
              )}
            </div>

            {/* Scrollable cards (ref for FAB + filter jump) */}
            <div
              ref={listRef}
              className="max-h-[66vh] overflow-y-auto"
              style={{
                WebkitOverflowScrolling: "touch",
                scrollBehavior: "smooth",
                scrollbarWidth: "thin",
                overscrollBehaviorY: "contain",
              }}
            >
              <div className="divide-y divide-gray-100">
                {currentPageData.map((o, i) => (
                  <div
                    key={`${o.userId ?? "x"}-${i}-${o._createdAtMs ?? 0}`}
                    className="p-3 active:bg-blue-50"
                    style={{ touchAction: "manipulation" }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="font-medium text-gray-900 text-[15px]">
                        {o.mobileNumber || "N/A"}
                      </div>
                      <div className="text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                        #{startIndex + i + 1}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <Tag
                        color={tagColor(o.askOxyOfers)}
                        className="text-[11px] px-2 py-0.5 rounded-md w-fit"
                      >
                        {(o.askOxyOfers || "N/A").length > 22
                          ? `${(o.askOxyOfers || "N/A").substring(0, 22)}…`
                          : o.askOxyOfers || "N/A"}
                      </Tag>
                      <div className="text-[11px] text-gray-500">
                        {fmt(o._createdAtMs || o.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* --------- DESKTOP / LARGE TABLE --------- */
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <Table
              dataSource={filteredRows.map((o, i) => ({
                ...o,
                key: `${o.userId ?? "x"}-${o.mobileNumber ?? "na"}-${i}-${
                  o._createdAtMs ?? 0
                }`,
              }))}
              columns={columns}
              pagination={{
                current: currentPage,
                pageSize,
                total: filteredRows.length,
                onChange: (p) => setCurrentPage(p),
                showSizeChanger: false,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
                size: "small",
              }}
              scroll={{ x: 720, y: 520, scrollToFirstRowOnChange: true }}
              size="small"
            />
          </div>
        )}
      </div>
    </div>
  );
};

/** ========= Compact stat card ========= */
const StatCard: React.FC<{ title: string; value: number }> = ({
  title,
  value,
}) => {
  return (
    <div className="rounded-lg border bg-white p-2 shadow-sm">
      <div className="text-[11px] sm:text-xs font-semibold text-gray-500 truncate">
        {title}
      </div>
      <div className="mt-0.5 text-sm sm:text-lg font-bold text-gray-800">
        {value}
      </div>
    </div>
  );
};

export default Admin;
