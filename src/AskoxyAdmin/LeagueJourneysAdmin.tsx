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
  Select,
  Spin,
  message,
} from "antd";
import { SearchOutlined, DownloadOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import BASE_URL from "../Config";
import "antd/dist/reset.css";
import HelpDeskCommentsModal from "./HelpDeskCommentsModal";

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
interface AdminComment {
  adminComments: string;
  commentsCreatedDate: string;
  commentsUpdateBy: string;
  adminUserId: string;
  customerBehaviour: string | null;
  isActive: boolean | null;
  customerExpectedOrderDate: string | null;
  callingType?: string | null;
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
  return ms ? dayjs(ms).format("MMM DD, YYYY") : "No date";
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
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<OfferDetails | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, AdminComment | null | "loading" | "error">>({});
  const updatedBy = localStorage.getItem("admin_userName")?.toUpperCase();
  const storedUniqueId = localStorage.getItem("admin_uniquId");

  const showCommentsModal = (record: OfferDetails) => {
    if (!record.userId) return message.warning("User ID is unavailable.");
    setSelectedRecord(record);
    setCommentsModalVisible(true);
  };

  const loadComment = async (userId: string) => {
    setCommentsMap((prev) => ({ ...prev, [userId]: "loading" }));
    try {
      const res = await axios.post<AdminComment[]>(`${BASE_URL}/user-service/fetchAdminComments`, { userId });
      setCommentsMap((prev) => ({ ...prev, [userId]: Array.isArray(res.data) && res.data.length ? res.data[0] : null }));
    } catch {
      setCommentsMap((prev) => ({ ...prev, [userId]: "error" }));
    }
  };

  const handleQuickActiveChange = async (userId: string, value: "true" | "false") => {
    const commentsUpdateBy = localStorage.getItem("admin_primaryType") === "HELPDESKSUPERADMIN" ? "ADMIN" : updatedBy || "ADMIN";
    try {
      await axios.patch(`${BASE_URL}/user-service/adminUpdateComments`, {
        adminComments: "Updated user active status via League Journeys page",
        adminUserId: storedUniqueId,
        commentsUpdateBy,
        userId,
        isActive: value === "true",
        customerBehaviour: "UNDERSTANDING",
      });
      message.success("User active status updated");
      await loadComment(userId);
    } catch {
      message.error("Failed to update status");
    }
  };

  const formatWhen = (raw?: string) => raw?.match(/\d{2}:\d{2}/)?.[0] || "";
  const commentColors = ["magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple"];
  const getColorForName = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return commentColors[Math.abs(hash) % commentColors.length];
  };

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

  useEffect(() => {
    filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize).forEach((row) => {
      if (row.userId && commentsMap[row.userId] === undefined) loadComment(row.userId);
    });
  }, [filteredRows, currentPage]);

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
     
   
      render: (v: string) => (
        <Tag
          color="cyan"
          style={{
            maxWidth: 250,
            height: "auto",
            lineHeight: "20px",
            padding: "3px 8px",
            whiteSpace: "normal",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {v || "N/A"}
        </Tag>
      ),
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
    {
      title: "Action",
      key: "actions",
     
      render: (_: unknown, record: OfferDetails) => (
        <Button size="small" disabled={!record.userId} onClick={() => showCommentsModal(record)}>Comments</Button>
      ),
    },
    {
      title: "Updated comments",
      key: "updatedComments",
     width:400,
      render: (_: unknown, record: OfferDetails) => {
        if (!record.userId) return <Tag>—</Tag>;
        const info = commentsMap[record.userId];
        if (info === "loading" || info === undefined) return <Spin size="small" />;
        if (info === "error" || info === null) return <span className="text-gray-500 text-sm"><Tag>—</Tag> No recent comments</span>;
        const needsDecision = info.isActive === null || info.isActive === undefined;
        const name = info.commentsUpdateBy || "—";
        const callingType = (info.callingType ?? "").trim();
        return (
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              {needsDecision ? (
                <Select style={{ width: 160 }} value="true" options={[{ label: "Yes", value: "true" }, { label: "No", value: "false" }]} onChange={(value: string) => handleQuickActiveChange(record.userId!, value as "true" | "false")} />
              ) : <Tag color={info.isActive ? "green" : "red"}>{info.isActive ? "ACTIVE" : "INACTIVE"}</Tag>}
              <Button type="link" size="small" className="p-0" onClick={() => showCommentsModal(record)}>Change</Button>
              <span className="max-w-[360px] truncate" title={info.adminComments || ""}>{info.adminComments || "—"}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <Tag color={getColorForName(name.toUpperCase())}><strong>{name}</strong></Tag>
              <span>at {formatWhen(info.commentsCreatedDate) || "—"}</span>
              {info.customerBehaviour && <span>• {info.customerBehaviour}</span>}
              {callingType && <span>• CallingType: {callingType}</span>}
            </div>
          </div>
        );
      },
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
                    <Button className="mt-2" size="small" disabled={!o.userId} onClick={() => showCommentsModal(o)}>Comments</Button>
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
      <HelpDeskCommentsModal
        open={commentsModalVisible}
        onClose={() => { setCommentsModalVisible(false); if (selectedRecord?.userId) loadComment(selectedRecord.userId); }}
        userId={selectedRecord?.userId || undefined}
        updatedBy={updatedBy}
        storedUniqueId={storedUniqueId}
        record={selectedRecord}
        BASE_URL={BASE_URL}
        initialIsActive={selectedRecord?.userId ? (commentsMap[selectedRecord.userId] as AdminComment | null)?.isActive : null}
      />
    </div>
  );
};

export default LeagueJourneysAdmin;
