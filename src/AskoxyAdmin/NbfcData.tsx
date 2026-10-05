import React, { useCallback, useEffect, useMemo, useState } from "react";
import { adminApi as axios } from "../utils/axiosInstances";
import {
  Table,
  Button,
  Spin,
  Pagination,
  Space,
  Typography,
  Input,
  Tooltip,
  Tag,
  Empty,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ReloadOutlined,
  SearchOutlined,
  EditOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BankOutlined,
  CommentOutlined,
  EnvironmentOutlined,
  MailOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import BASE_URL from "../Config";
import HelpDeskCommentsModal from "./HelpDeskCommentsModal";

const { Text, Title } = Typography;
const { Search } = Input;

export interface NbfcDataItem {
  id?: string;
  name: string;
  officeAddress: string;
  email: string | null;
  comments?: string | null;
}

export interface AdminCommentRecord {
  adminComments?: string | null;
  commentsUpdateBy?: string | null;
  commentsCreatedDate?: string | null;
  customerBehaviour?: string | null;
  callingType?: string | null;
  dataType?: string | null;
}

const DEFAULT_PAGE_SIZE = 100;
const COMMENT_TRUNCATE_LENGTH = 60;

const PRIMARY_COLOR = "#008cba";
const SUCCESS_COLOR = "#1ab394";
const PENDING_COLOR = "#f5a623";

const NbfcData: React.FC = () => {
  const [records, setRecords] = useState<NbfcDataItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [size] = useState(DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState(0);

  const [activeTab, setActiveTab] = useState<"all" | "updated" | "pending">(
    "all"
  );
  const [searchText, setSearchText] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<NbfcDataItem | null>(
    null
  );
  const [commentsMap, setCommentsMap] = useState<
    Record<string, AdminCommentRecord | null | "loading">
  >({});

  const hasValue = (value: string | null | undefined) => {
    if (value === null || value === undefined) return false;
    const text = String(value).trim();
    return text !== "" && text !== "-" && text.toLowerCase() !== "null";
  };

  const isValidComment = (value: string | null | undefined) => {
    if (value === null || value === undefined) return false;
    const text = String(value).trim();
    return text !== "" && text.toLowerCase() !== "null";
  };

  const fetchCommentsForRows = useCallback((rows: NbfcDataItem[]) => {
    rows.forEach(async (u) => {
      const id = u.id || u.name;
      if (!id) return;
      setCommentsMap((prev) => ({ ...prev, [id]: "loading" }));
      try {
        const res = await axios.post(
          `${BASE_URL}/user-service/fetchAdminComments`,
          { userId: id },
          { headers: { "Content-Type": "application/json" } }
        );
        const list = Array.isArray(res.data) ? res.data : [];
        const latest = list.length > 0 ? list[0] : null;
        setCommentsMap((prev) => ({ ...prev, [id]: latest }));
      } catch {
        setCommentsMap((prev) => ({ ...prev, [id]: null }));
      }
    });
  }, []);

  const fetchRecords = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${BASE_URL}/ai-service/entity-records/nbfc-data`,
        {
          params: { page, size },
        }
      );

      const content = response.data?.content || [];
      setRecords(content);
      setTotal(response.data?.totalElements ?? content.length);
      fetchCommentsForRows(content);
    } catch (error) {
      console.error(error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Unable to load NBFC records. Please try again.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      setRecords([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, size, fetchCommentsForRows]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const openCommentModal = (record: NbfcDataItem) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const closeCommentModal = () => {
    setModalOpen(false);
    setSelectedRecord(null);
  };

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  const counts = useMemo(() => {
    const updated = records.filter((r) => isValidComment(r.comments)).length;
    const pending = records.filter((r) => !isValidComment(r.comments)).length;
    return { all: records.length, updated, pending };
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      if (activeTab === "updated" && !isValidComment(record.comments)) {
        return false;
      }
      if (activeTab === "pending" && isValidComment(record.comments)) {
        return false;
      }

      if (!searchText.trim()) return true;
      const query = searchText.toLowerCase().trim();

      return (
        record.name?.toLowerCase().includes(query) ||
        record.officeAddress?.toLowerCase().includes(query) ||
        record.email?.toLowerCase().includes(query) ||
        record.comments?.toLowerCase().includes(query)
      );
    });
  }, [records, activeTab, searchText]);

  const columns: ColumnsType<NbfcDataItem> = [
    {
      title: "S.No",
      key: "sno",
      width: 65,
      align: "center",
      render: (_value, _record, index) => (
        <span style={{ fontWeight: 600, color: "#6b7280", fontSize: 13 }}>
          {page * size + index + 1}
        </span>
      ),
    },
    {
      title: "NBFC / Company Name",
      dataIndex: "name",
      key: "name",
      width: 280,
      render: (name: string, record: NbfcDataItem) => (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 600,
              color: "#111827",
            }}
          >
            <BankOutlined style={{ color: PRIMARY_COLOR, fontSize: 14 }} />
            <span>{hasValue(name) ? name : "-"}</span>
          </div>
          {record.id && (
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2, paddingLeft: 22 }}>
              ID: {record.id}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Office Address",
      dataIndex: "officeAddress",
      key: "officeAddress",
      width: 320,
      render: (address: string) => {
        if (!hasValue(address)) {
          return <span style={{ color: "#9ca3af" }}>-</span>;
        }
        return (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
            <EnvironmentOutlined
              style={{ color: "#ef4444", fontSize: 13, marginTop: 3, flexShrink: 0 }}
            />
            <span style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.4 }}>
              {address}
            </span>
          </div>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
      render: (email: string | null) => {
        if (!hasValue(email)) {
          return <span style={{ color: "#9ca3af" }}>-</span>;
        }
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <MailOutlined style={{ color: "#10b981", fontSize: 13 }} />
            <a
              href={`mailto:${email}`}
              style={{ color: PRIMARY_COLOR, fontSize: 13 }}
            >
              {email}
            </a>
          </div>
        );
      },
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      width: 270,
      render: (_comments: string | null | undefined, record: NbfcDataItem) => {
        const id = record.id || record.name;
        const commentInfo = id ? commentsMap[id] : null;

        if (commentInfo === "loading") {
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#9ca3af", fontSize: 12 }}>
              <Spin size="small" /> <span>Loading...</span>
            </div>
          );
        }

        const commentText = commentInfo
          ? commentInfo.adminComments
          : record.comments;
        const hasComment = isValidComment(commentText);

        if (!hasComment) {
          return (
            <Tag
              color="default"
              style={{
                borderRadius: 12,
                fontSize: 11,
                padding: "2px 8px",
                cursor: "pointer",
                color: "#6b7280",
                background: "#f3f4f6",
                border: "1px solid #e5e7eb",
              }}
              onClick={() => openCommentModal(record)}
            >
              <PlusOutlined style={{ marginRight: 4 }} /> No Comment
            </Tag>
          );
        }

        const text = String(commentText);
        const truncated =
          text.length > COMMENT_TRUNCATE_LENGTH
            ? text.slice(0, COMMENT_TRUNCATE_LENGTH) + "..."
            : text;

        return (
          <div
            style={{ cursor: "pointer", display: "flex", flexDirection: "column", gap: 2 }}
            onClick={() => openCommentModal(record)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
              <Tag color="success" style={{ margin: 0, borderRadius: 10, fontSize: 10, padding: "0 5px" }}>
                <CommentOutlined style={{ marginRight: 2 }} /> Comment
              </Tag>
              {commentInfo?.customerBehaviour && (
                <span style={{ fontSize: 10, background: "#eff6ff", color: "#1d4ed8", padding: "0 4px", borderRadius: 6, border: "1px solid #dbeafe" }}>
                  {commentInfo.customerBehaviour}
                </span>
              )}
              {commentInfo?.callingType && (
                <span style={{ fontSize: 10, background: "#fef3c7", color: "#92400e", padding: "0 4px", borderRadius: 6, border: "1px solid #fde68a" }}>
                  {commentInfo.callingType}
                </span>
              )}
            </div>
            <Tooltip title={text} placement="topLeft" overlayStyle={{ maxWidth: 400 }}>
              <div
                style={{
                  fontSize: 12,
                  color: "#1f2937",
                  fontWeight: 500,
                  maxWidth: 250,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {truncated}
              </div>
            </Tooltip>
            {commentInfo && (
              <div style={{ fontSize: 10, color: "#9ca3af", display: "flex", gap: 4 }}>
                {commentInfo.commentsUpdateBy && <span>By: {commentInfo.commentsUpdateBy}</span>}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: 110,
      align: "center",
      render: (_value, record: NbfcDataItem) => {
        const hasComment = isValidComment(record.comments);
        return (
          <Button
            size="small"
            type={hasComment ? "default" : "primary"}
            icon={hasComment ? <EditOutlined /> : <PlusOutlined />}
            onClick={() => openCommentModal(record)}
            style={{
              borderRadius: 6,
              fontSize: 12,
              borderColor: hasComment ? SUCCESS_COLOR : PRIMARY_COLOR,
              color: hasComment ? SUCCESS_COLOR : "#fff",
              background: hasComment ? "#fff" : PRIMARY_COLOR,
            }}
          >
            {hasComment ? "Edit" : "Add"}
          </Button>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "16px 24px", minHeight: "100vh", background: "#f9fafb" }}>
      {/* Header Banner */}
      <div
        style={{
          background: "#fff",
          padding: "16px 20px",
          borderRadius: 8,
          marginBottom: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0, color: "#111827" }}>
            NBFC Data
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Manage and view NBFC entity records and update comments
          </Text>
        </div>

        <Space wrap>
          <Search
            placeholder="Search name, address, email..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: isMobile ? "100%" : 280 }}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchRecords}
            loading={loading}
          >
            Refresh
          </Button>
        </Space>
      </div>

      {/* Summary Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div
          onClick={() => setActiveTab("all")}
          style={{
            background: "#fff",
            padding: "12px 16px",
            borderRadius: 8,
            border: `2px solid ${activeTab === "all" ? PRIMARY_COLOR : "transparent"}`,
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            cursor: "pointer",
          }}
        >
          <div style={{ fontSize: 12, color: "#6b7280" }}>Total Records</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: PRIMARY_COLOR }}>
            {total.toLocaleString()}
          </div>
        </div>

        <div
          onClick={() => setActiveTab("all")}
          style={{
            background: "#fff",
            padding: "12px 16px",
            borderRadius: 8,
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ fontSize: 12, color: "#6b7280" }}>Current Page Loaded</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>
            {counts.all}
          </div>
        </div>

        <div
          onClick={() => setActiveTab("updated")}
          style={{
            background: "#fff",
            padding: "12px 16px",
            borderRadius: 8,
            border: `2px solid ${activeTab === "updated" ? SUCCESS_COLOR : "transparent"}`,
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            cursor: "pointer",
          }}
        >
          <div style={{ fontSize: 12, color: "#6b7280", display: "flex", alignItems: "center", gap: 4 }}>
            <CheckCircleOutlined style={{ color: SUCCESS_COLOR }} /> Comments Updated
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: SUCCESS_COLOR }}>
            {counts.updated}
          </div>
        </div>

        <div
          onClick={() => setActiveTab("pending")}
          style={{
            background: "#fff",
            padding: "12px 16px",
            borderRadius: 8,
            border: `2px solid ${activeTab === "pending" ? PENDING_COLOR : "transparent"}`,
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            cursor: "pointer",
          }}
        >
          <div style={{ fontSize: 12, color: "#6b7280", display: "flex", alignItems: "center", gap: 4 }}>
            <ClockCircleOutlined style={{ color: PENDING_COLOR }} /> Pending Comments
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: PENDING_COLOR }}>
            {counts.pending}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <Spin size="large" />
            <div style={{ marginTop: 12, color: "#6b7280", fontSize: 14 }}>
              Loading NBFC records...
            </div>
          </div>
        ) : filteredRecords.length === 0 ? (
          <Empty
            style={{ padding: "60px 0" }}
            description="No NBFC records found"
          />
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={filteredRecords.map((item, idx) => ({
                ...item,
                key: item.id || `${item.name}-${idx}`,
              }))}
              pagination={false}
              size="middle"
              scroll={{ x: 980 }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                borderTop: "1px solid #f3f4f6",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <Text type="secondary" style={{ fontSize: 13 }}>
                Showing {page * size + 1} -{" "}
                {Math.min((page + 1) * size, total)} of {total.toLocaleString()}{" "}
                records
              </Text>
              <Pagination
                current={page + 1}
                pageSize={size}
                total={total}
                showSizeChanger={false}
                showQuickJumper
                onChange={(p) => setPage(p - 1)}
              />
            </div>
          </>
        )}
      </div>

      {/* Comments Modal */}
      <HelpDeskCommentsModal
        open={modalOpen}
        onClose={closeCommentModal}
        onSuccess={(newComment) => {
          if (selectedRecord) {
            const recIdentifier = selectedRecord.id || selectedRecord.name;
            setRecords((prev: NbfcDataItem[]) =>
              prev.map((item: NbfcDataItem) =>
                (item.id && item.id === selectedRecord.id) ||
                item.name === selectedRecord.name
                  ? { ...item, comments: newComment }
                  : item
              )
            );
            if (recIdentifier) {
              setCommentsMap((prev) => ({
                ...prev,
                [recIdentifier]: {
                  ...(prev[recIdentifier] && prev[recIdentifier] !== "loading"
                    ? (prev[recIdentifier] as AdminCommentRecord)
                    : {}),
                  adminComments: newComment,
                  commentsUpdateBy: "You",
                },
              }));
            }
          }
        }}
        userId={selectedRecord?.id || selectedRecord?.name}
        record={selectedRecord}
        dataType="NBFC_DATA"
        BASE_URL={BASE_URL}
      />
    </div>
  );
};

export default NbfcData;
