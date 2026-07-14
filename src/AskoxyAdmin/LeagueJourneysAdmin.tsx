import React, { useEffect, useMemo, useRef, useState } from "react";
import { adminApi as axios } from "../utils/axiosInstances";
import {
  Table,
  TableProps,
  Input,
  Tag,
  Button,
  Skeleton,
  Empty,
  Grid,
} from "antd";
import { SearchOutlined, DownloadOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import BASE_URL from "../Config";
import "antd/dist/reset.css";

const { Search } = Input;
const { useBreakpoint } = Grid;

interface OfferDetails {
  userId: string | null;
  projectType: string;
  askOxyOfers: string;
  userRole?: string | null;
  mobileNumber: string | null;
  registrationDate?: string | null;
  createdAt: string | number | null;
  _createdAtMs?: number;
}

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

const LeagueJourneysAdmin: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  const [rows, setRows] = useState<OfferDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"ascend" | "descend" | null>("descend");
  const pageSize = 50;
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedTerm(searchText.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [searchText]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await Promise.allSettled([
        axios.get(`${BASE_URL}/auth-service/auth/usersOfferesDetails`),
        axios.get(`${BASE_URL}/marketing-service/campgin/getAllInterestedUsres`),
      ]);

      const collected: OfferDetails[] = [];
      for (const r of res) {
        if (r.status === "fulfilled") {
          for (const o of (r.value.data || []) as OfferDetails[]) {
            const role = (o.userRole || "").toUpperCase().replace(/[\s_-]+/g, "");
            if (role === "LEAGUEJOURNEYS") {
              collected.push({ ...o, _createdAtMs: toMs(o.createdAt) });
            }
          }
        }
      }

      collected.sort((a, b) => (b._createdAtMs || 0) - (a._createdAtMs || 0));
      setRows(collected);
    } catch {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const filteredRows = useMemo(() => {
    if (!debouncedTerm) return rows;
    return rows.filter((o) => {
      const mobile = (o.mobileNumber || "").toLowerCase();
      return mobile.includes(debouncedTerm);
    });
  }, [rows, debouncedTerm]);

  const toCSV = (data: OfferDetails[]) => {
    if (!data.length) return "";
    const headers = ["S.No", "Mobile Number", "Interested In", "Created At"];
    const csv = [headers.join(",")];
    data.forEach((r, i) => {
      const row = [
        String(i + 1),
        r.mobileNumber || "N/A",
        r.askOxyOfers || "",
        fmt(r._createdAtMs || r.createdAt),
      ].map((cell) => (String(cell).includes(",") ? `"${cell}"` : cell));
      csv.push(row.join(","));
    });
    return "\uFEFF" + csv.join("\n");
  };

  const handleDownload = () => {
    if (!filteredRows.length) return;
    const blob = new Blob([toCSV(filteredRows)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "league-journeys-users.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const columns: TableProps<OfferDetails>["columns"] = [
    {
      title: "S.No",
      key: "index",
      align: "center",
     
      render: (_: any, __: any, index: number) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      align: "center",
     
      render: (v: string | null) => v || "N/A",
    },
    {
      title: "Interested In",
      dataIndex: "askOxyOfers",
      key: "askOxyOfers",
      align: "center",
   
      render: (v: string) => <Tag color="cyan">{v || "N/A"}</Tag>,
    },
    {
      title: "Created At",
      dataIndex: "_createdAtMs",
      key: "_createdAtMs",
      align: "center",
    
      render: (_: any, row: OfferDetails) => fmt(row._createdAtMs || row.createdAt),
      sorter: (a, b) => (a._createdAtMs || 0) - (b._createdAtMs || 0),
      sortOrder: sortOrder as any,
      defaultSortOrder: "descend",
      sortDirections: ["descend", "ascend"],
      onHeaderCell: () => ({
        onClick: () => setSortOrder((prev) => (prev === "descend" ? "ascend" : "descend")),
      }),
    },
  ];

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredRows.length);
  const currentPageData = filteredRows.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50">
     
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
            <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
              League Journeys Users
            </h1>
           
          

          <div className="mt-2 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 min-w-0">
              <Search
                allowClear
                placeholder="Search by mobile number…"
                value={searchText}
                onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
                size={isMobile ? "large" : "middle"}
                prefix={<SearchOutlined style={{ fontSize: isMobile ? 16 : 14, color: "#8c8c8c" }} />}
                style={{ fontSize: isMobile ? "16px" : "14px" }}
              />
            </div>
          </div>
        </div>
      </div>

     
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <div className="rounded-lg border bg-white p-2 shadow-sm">
            <div className="text-[11px] sm:text-xs font-semibold text-gray-500">Total</div>
            <div className="mt-0.5 text-sm sm:text-lg font-bold text-gray-800">{filteredRows.length}</div>
          </div>
          <div className="rounded-lg border bg-white p-2 shadow-sm">
            <div className="text-[11px] sm:text-xs font-semibold text-gray-500">League Journeys</div>
            <div className="mt-0.5 text-sm sm:text-lg font-bold text-cyan-600">{rows.length}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pb-6"
        style={{ paddingBottom: isMobile ? "calc(env(safe-area-inset-bottom, 0px) + 64px)" : undefined }}
      >
        {loading ? (
          <div className="bg-white border rounded-xl p-4">
            <Skeleton active paragraph={{ rows: 6 }} />
          </div>
        ) : error ? (
          <div className="bg-white border rounded-xl p-6 text-center">
            <p className="text-red-600">{error}</p>
            <Button className="mt-3" onClick={fetchAll} icon={<ReloadOutlined />}>Retry</Button>
          </div>
        ) : !filteredRows.length ? (
          <div className="bg-white border rounded-xl p-8 text-center">
            <Empty description="No League Journey users found" />
          </div>
        ) : isMobile ? (
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="px-3 py-2 border-b bg-gray-50 text-sm text-gray-600 flex justify-between items-center">
              <span>{startIndex + 1}-{endIndex} of {filteredRows.length}</span>
              {filteredRows.length > pageSize && (
                <div className="flex items-center gap-1">
                  <Button size="small" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>‹</Button>
                  <span className="text-xs px-2">{currentPage}/{Math.ceil(filteredRows.length / pageSize)}</span>
                  <Button size="small" disabled={currentPage >= Math.ceil(filteredRows.length / pageSize)} onClick={() => setCurrentPage((p) => p + 1)}>›</Button>
                </div>
              )}
            </div>
            <div ref={listRef} className="max-h-[66vh] overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
              <div className="divide-y divide-gray-100">
                {currentPageData.map((o, i) => (
                  <div key={`${o.userId ?? "x"}-${i}`} className="p-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="font-medium text-gray-900 text-[15px]">{o.mobileNumber }</div>
                      <div className="text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">#{startIndex + i + 1}</div>
                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <Tag color="cyan" className="text-[11px] w-fit">{o.askOxyOfers }</Tag>
                      <div className="text-[11px] text-gray-500">{fmt(o._createdAtMs || o.createdAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden">
            <Table
              dataSource={filteredRows.map((o, i) => ({ ...o, key: `${o.userId ?? "x"}-${i}-${o._createdAtMs ?? 0}` }))}
              columns={columns}
              pagination={{
                current: currentPage,
                pageSize,
                total: filteredRows.length,
                onChange: (p) => setCurrentPage(p),
                showSizeChanger: false,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                size: "small",
              }}
              scroll={{ x:true ,scrollToFirstRowOnChange: true }}
              size="small"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LeagueJourneysAdmin;
