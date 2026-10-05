// src/components/AdvocatesData.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  Spin,
  Pagination,
  Button,
  Tag,
  Input,
  Empty,
  Row,
  Col,
  Tooltip,
  Modal,
  Typography,
} from "antd";
import {
  ReloadOutlined,
  SearchOutlined,
  EditOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CommentOutlined,
  PhoneOutlined,
  UserOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import BASE_URL from "../Config";
import { adminApi as axios } from "../utils/axiosInstances";
import HelpDeskCommentsModal from "./HelpDeskCommentsModal";

const { Text, Title } = Typography;
const { TextArea, Search } = Input;

interface AdvocateUser {
  id: string;
  name1: string;
  name2: string;
  mobileNumber: string;
  createdAt: string;
  houseNumber: string;
  comments?: string | null;
}

interface ApiResponse {
  totalCount: number;
  activeUsersResponse: AdvocateUser[];
}

interface AdminCommentRecord {
  adminComments?: string | null;
  commentsUpdateBy?: string | null;
  commentsCreatedDate?: string | null;
  customerBehaviour?: string | null;
  callingType?: string | null;
  dataType?: string | null;
}

type VHState = "idle" | "loading" | "ready" | "error";

const DEFAULT_PAGE_SIZE = 50;
const MAX_COMMENT_LENGTH = 1000;
const COMMENT_TRUNCATE_LENGTH = 60;

const PRIMARY_COLOR = "#008cba";
const SUCCESS_COLOR = "#1ab394";
const PENDING_COLOR = "#f5a623";

const AdvocatesDataPage: React.FC = () => {
  const [data, setData] = useState<AdvocateUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [activeTab, setActiveTab] = useState<"all" | "updated" | "pending">(
    "all",
  );
  const [filterSearchText, setFilterSearchText] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AdvocateUser | null>(
    null,
  );
  const [commentsMap, setCommentsMap] = useState<
    Record<string, AdminCommentRecord | null | "loading">
  >({});
  const [commentValue, setCommentValue] = useState("");
  const [commentError, setCommentError] = useState("");
  const [saving, setSaving] = useState(false);

  // Search by mobile or user id
  const [searchInput, setSearchInput] = useState("");
  const [searchState, setSearchState] = useState<VHState>("idle");
  const [searchResult, setSearchResult] = useState<any>(null);

  const isValidComment = (value: string | null | undefined) => {
    if (value === null || value === undefined) return false;
    const text = String(value).trim();
    return text !== "" && text.toLowerCase() !== "null";
  };

  const validateComment = (value: string) => {
    const cleanValue = value.trim();

    if (!cleanValue) return "Please enter a comment.";
    if (cleanValue.length < 3)
      return "Comment must contain at least 3 characters.";
    if (cleanValue.length > MAX_COMMENT_LENGTH) {
      return `Comment must not exceed ${MAX_COMMENT_LENGTH} characters.`;
    }

    return "";
  };

  const openCommentModal = (record: AdvocateUser) => {
    setSelectedRecord(record);
    setCommentValue(
      isValidComment(record.comments) ? record.comments || "" : "",
    );
    setCommentError("");
    setModalOpen(true);
  };

  const closeCommentModal = () => {
    if (saving) return;
    setModalOpen(false);
    setSelectedRecord(null);
    setCommentValue("");
    setCommentError("");
  };

  const updateComments = async () => {
    if (!selectedRecord) return;

    const cleanComment = commentValue.trim();
    const validationError = validateComment(cleanComment);

    if (validationError) {
      setCommentError(validationError);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: validationError,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    setSaving(true);

    try {
      const updatedBy = localStorage.getItem("admin_userName")?.toUpperCase();
      const storedUniqueId = localStorage.getItem("admin_uniquId");
      const commentsUpdateBy =
        localStorage.getItem("admin_primaryType") === "HELPDESKSUPERADMIN"
          ? "ADMIN"
          : updatedBy || "ADMIN";

      await axios.patch(
        `${BASE_URL}/user-service/adminUpdateComments`,
        {
          adminComments: cleanComment,
          adminUserId: storedUniqueId,
          commentsUpdateBy,
          userId: selectedRecord.id,
          isActive: true,
          customerBehaviour: "UNDERSTANDING",
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      setData((prev) =>
        prev.map((item) =>
          item.id === selectedRecord.id
            ? { ...item, comments: cleanComment }
            : item,
        ),
      );

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Comment updated successfully.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      closeCommentModal();
    } catch (error) {
      console.error(error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Unable to update comment. Please try again.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const fetchCommentsForRows = useCallback((rows: AdvocateUser[]) => {
    rows.forEach(async (u) => {
      if (!u.id) return;
      setCommentsMap((prev) => ({ ...prev, [u.id]: "loading" }));
      try {
        const res = await axios.post(
          `${BASE_URL}/user-service/fetchAdminComments`,
          { userId: u.id },
          { headers: { "Content-Type": "application/json" } }
        );
        const list = Array.isArray(res.data) ? res.data : [];
        const latest = list.length > 0 ? list[0] : null;
        setCommentsMap((prev) => ({ ...prev, [u.id]: latest }));
      } catch {
        setCommentsMap((prev) => ({ ...prev, [u.id]: null }));
      }
    });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>(
        `${BASE_URL}/user-service/getAllAdvocatesData`,
        {
          params: { pageNo: currentPage, pageSize },
          headers: { "Content-Type": "application/json", accept: "*/*" },
        },
      );

      const rows = response.data?.activeUsersResponse || [];
      setData(rows);
      setTotalCount(response.data?.totalCount || 0);
      fetchCommentsForRows(rows);
    } catch (error) {
      console.error(error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to fetch Advocates data",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, fetchCommentsForRows]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };

  const doSearch = async () => {
    const q = (searchInput || "").trim();
    if (!q) {
      setSearchResult(null);
      setSearchState("idle");
      return;
    }
    try {
      setSearchState("loading");
      const isMobileNum = /^\d{8,}$/.test(q);
      const params = isMobileNum ? { mobileNumber: q } : { userId: q };
      const res = await axios.get(
        `${BASE_URL}/user-service/getAdvocatesDataWithMobileOrUserId`,
        { params },
      );
      setSearchResult(res.data || null);
      setSearchState("ready");
      if (!res.data) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "info",
          title: "No user found for the given input",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    } catch {
      setSearchState("error");
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchResult(null);
    setSearchState("idle");
  };

  const filteredRecords = useMemo(() => {
    let list = [...data];

    if (activeTab === "updated") {
      list = list.filter((item) => isValidComment(item.comments));
    }

    if (activeTab === "pending") {
      list = list.filter((item) => !isValidComment(item.comments));
    }

    if (filterSearchText.trim()) {
      const search = filterSearchText.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.name1?.toLowerCase().includes(search) ||
          item.name2?.toLowerCase().includes(search) ||
          item.mobileNumber?.toLowerCase().includes(search) ||
          item.houseNumber?.toLowerCase().includes(search) ||
          item.id?.toLowerCase().includes(search),
      );
    }

    return list;
  }, [data, activeTab, filterSearchText]);

  const updatedCount = data.filter((item) =>
    isValidComment(item.comments),
  ).length;
  const pendingCount = data.filter(
    (item) => !isValidComment(item.comments),
  ).length;

  const handleTabChange = (tab: "all" | "updated" | "pending") => {
    setActiveTab(tab);
    setFilterSearchText("");
  };

  const columns = [
    {
      title: <div style={{ textAlign: "center" }}>S.No</div>,
      key: "serialNumber",
      align: "center" as const,
      width: 70,
      render: (_value: any, _record: any, index: number) => (
        <Text strong style={{ color: "#6b7280" }}>
          {(currentPage - 1) * pageSize + index + 1}
        </Text>
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <UserOutlined style={{ marginRight: 6 }} />
          Advocate Name
        </div>
      ),
      dataIndex: "name1",
      key: "name1",
      align: "center" as const,
      width: 180,
      render: (text: string, record: AdvocateUser) => (
        <Text strong style={{ color: "#1f2937" }}>
          {text || record.name2 || "-"}
        </Text>
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <PhoneOutlined style={{ marginRight: 6 }} />
          Mobile Number
        </div>
      ),
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      align: "center" as const,
      width: 160,
      render: (text: string) =>
        text ? (
          <a
            href={`tel:${text}`}
            style={{
              color: PRIMARY_COLOR,
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            {text}
          </a>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <HomeOutlined style={{ marginRight: 6 }} />
          House / Address
        </div>
      ),
      dataIndex: "houseNumber",
      key: "houseNumber",
      align: "center" as const,
      width: 160,
      render: (text: string) => <Text>{text || "-"}</Text>,
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <CommentOutlined style={{ marginRight: 6 }} />
          Admin Comments
        </div>
      ),
      key: "comments",
      width: 270,
      render: (_: any, record: AdvocateUser) => {
        const commentInfo = commentsMap[record.id];

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
              <PlusOutlined style={{ marginRight: 4 }} /> Add Comment
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
      title: <div style={{ textAlign: "center" }}>Action</div>,
      key: "action",
      align: "center" as const,
      width: 120,
      render: (_: any, record: AdvocateUser) => {
        const commentInfo = commentsMap[record.id];
        const commentText =
          commentInfo && commentInfo !== "loading"
            ? commentInfo.adminComments
            : record.comments;
        const hasComment = isValidComment(commentText);

        return (
          <Button
            type="primary"
            icon={hasComment ? <EditOutlined /> : <PlusOutlined />}
            onClick={() => openCommentModal(record)}
            style={{
              background: hasComment ? SUCCESS_COLOR : PRIMARY_COLOR,
              borderColor: hasComment ? SUCCESS_COLOR : PRIMARY_COLOR,
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 12,
            }}
            size="small"
          >
            {hasComment ? "Edit" : "Add"}
          </Button>
        );
      },
    },
  ];

  // Stat card data
  const statCards = [
    {
      label: "Total Advocates",
      count: data.length,
      color: PRIMARY_COLOR,
      bgColor: "#e6f7ff",
      icon: <TeamOutlined style={{ fontSize: 22, color: PRIMARY_COLOR }} />,
    },
    {
      label: "Comments Updated",
      count: updatedCount,
      color: SUCCESS_COLOR,
      bgColor: "#e8faf5",
      icon: (
        <CheckCircleOutlined style={{ fontSize: 22, color: SUCCESS_COLOR }} />
      ),
    },
    {
      label: "Comments Pending",
      count: pendingCount,
      color: PENDING_COLOR,
      bgColor: "#fef9e7",
      icon: (
        <ClockCircleOutlined style={{ fontSize: 22, color: PENDING_COLOR }} />
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "16px",
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div>
          <Title
            level={4}
            style={{ margin: 0, color: "#1f2937", fontWeight: 700 }}
          >
            Advocate Data
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Manage Advocate records and comments
          </Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchData}
          loading={loading}
          style={{
            borderRadius: 8,
            fontWeight: 600,
            borderColor: PRIMARY_COLOR,
            color: PRIMARY_COLOR,
          }}
        >
          Refresh
        </Button>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 14,
          marginBottom: 18,
        }}
      >
        {statCards.map((card, idx) => (
          <div
            key={idx}
            style={{
              background: "#ffffff",
              borderRadius: 12,
              padding: "16px 20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              borderLeft: `4px solid ${card.color}`,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: card.bgColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {card.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: card.color,
                  lineHeight: 1.2,
                }}
              >
                {card.count}
              </div>
              <div
                style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}
              >
                {card.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Header Search by mobile or user id */}
      <div style={{ marginBottom: 16 }}>
        <Row gutter={[12, 12]} align="middle" justify="space-between">
          <Col flex="360px">
            <div style={{ display: "flex", gap: 8 }}>
              <Search
                placeholder="Search Advocate by Mobile or User ID"
                allowClear
                enterButton="Search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onSearch={doSearch}
              />
              {searchState === "ready" && (
                <Button onClick={clearSearch}>Clear</Button>
              )}
            </div>
          </Col>
        </Row>
      </div>

      {/* Search Result Card */}
      {searchState !== "idle" && (
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              background: "#ffffff",
              padding: 16,
              borderRadius: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            {searchState === "loading" && (
              <div style={{ padding: 12 }}>
                <Spin size="small" /> Searching…
              </div>
            )}
            {searchState === "error" && <Empty description="Search failed" />}
            {searchState === "ready" && searchResult && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 12,
                  fontSize: 14,
                }}
              >
                <div>
                  <div style={{ color: "#6b7280", fontSize: 12 }}>Name</div>
                  <div style={{ fontWeight: 600 }}>
                    {searchResult.userName || searchResult.name1 || "—"}
                  </div>
                </div>
                <div>
                  <div style={{ color: "#6b7280", fontSize: 12 }}>Mobile</div>
                  <div style={{ fontWeight: 600 }}>
                    {searchResult.mobileNumber || "—"}
                  </div>
                </div>
                <div>
                  <div style={{ color: "#6b7280", fontSize: 12 }}>Whatsapp</div>
                  <div style={{ fontWeight: 600 }}>
                    {searchResult.whastappNumber ||
                      searchResult.whatsappNumber ||
                      "—"}
                  </div>
                </div>
                <div>
                  <div style={{ color: "#6b7280", fontSize: 12 }}>Address</div>
                  <div style={{ fontWeight: 600 }}>
                    {searchResult.address || "—"}
                  </div>
                </div>
              </div>
            )}
            {searchState === "ready" && !searchResult && (
              <Empty description="No user found" />
            )}
          </div>
        </div>
      )}

      <div>
        {/* Tabs & Search Filter Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button
              type={activeTab === "all" ? "primary" : "default"}
              onClick={() => handleTabChange("all")}
              style={{
                borderRadius: 8,
                fontWeight: 600,
                background: activeTab === "all" ? PRIMARY_COLOR : "#ffffff",
                borderColor: activeTab === "all" ? PRIMARY_COLOR : "#d9d9d9",
              }}
            >
              All Records ({data.length})
            </Button>
            <Button
              type={activeTab === "updated" ? "primary" : "default"}
              onClick={() => handleTabChange("updated")}
              style={{
                borderRadius: 8,
                fontWeight: 600,
                background: activeTab === "updated" ? SUCCESS_COLOR : "#ffffff",
                borderColor:
                  activeTab === "updated" ? SUCCESS_COLOR : "#d9d9d9",
                color: activeTab === "updated" ? "#fff" : undefined,
              }}
            >
              Comments Updated ({updatedCount})
            </Button>
            <Button
              type={activeTab === "pending" ? "primary" : "default"}
              onClick={() => handleTabChange("pending")}
              style={{
                borderRadius: 8,
                fontWeight: 600,
                background: activeTab === "pending" ? PENDING_COLOR : "#ffffff",
                borderColor:
                  activeTab === "pending" ? PENDING_COLOR : "#d9d9d9",
                color: activeTab === "pending" ? "#fff" : undefined,
              }}
            >
              Comments Pending ({pendingCount})
            </Button>
          </div>

          {/* Table local search */}
          <Search
            allowClear
            placeholder="Filter by name, mobile, house or ID"
            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            value={filterSearchText}
            onChange={(e) => setFilterSearchText(e.target.value)}
            style={{
              maxWidth: 320,
              width: "100%",
              borderRadius: 8,
            }}
          />
        </div>

        {/* Table or Loading */}
        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 60,
              gap: 12,
            }}
          >
            <Spin size="large" />
            <Text type="secondary">Loading Advocates...</Text>
          </div>
        ) : (
          <>
            <Table
              rowKey="id"
              dataSource={filteredRecords}
              columns={columns as any}
              pagination={false}
              bordered
              size="middle"
              scroll={{ x: true }}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <span style={{ color: "#9ca3af" }}>
                        {filterSearchText
                          ? `No results found for "${filterSearchText}"`
                          : activeTab === "updated"
                            ? "No records with comments found"
                            : activeTab === "pending"
                              ? "No pending records found"
                              : "No records found"}
                      </span>
                    }
                  />
                ),
              }}
            />

            {/* Pagination */}
            <div
              style={{
                marginTop: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <Text type="secondary" style={{ fontSize: 13 }}>
                Showing <strong>{filteredRecords.length}</strong> of{" "}
                <strong>{data.length}</strong> records on this page
                {activeTab !== "all" && <> (filtered by {activeTab})</>}
              </Text>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalCount}
                showSizeChanger
                pageSizeOptions={["50", "100", "200", "300"]}
                showTotal={(totalRecords, range) =>
                  `${range[0]}-${range[1]} of ${totalRecords} advocates`
                }
                onChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>

      {/* Comment Modal */}
      <HelpDeskCommentsModal
        open={modalOpen}
        onClose={closeCommentModal}
        onSuccess={(newComment) => {
          if (selectedRecord) {
            setData((prev: AdvocateUser[]) =>
              prev.map((item: AdvocateUser) =>
                item.id === selectedRecord.id
                  ? { ...item, comments: newComment }
                  : item
              )
            );
            setCommentsMap((prev) => ({
              ...prev,
              [selectedRecord.id]: {
                ...(prev[selectedRecord.id] && prev[selectedRecord.id] !== "loading"
                  ? (prev[selectedRecord.id] as any)
                  : {}),
                adminComments: newComment,
                commentsUpdateBy: "You",
              },
            }));
          }
        }}
        userId={selectedRecord?.id}
        record={selectedRecord}
        dataType="ADVOCATE_DATA"
        BASE_URL={BASE_URL}
      />
    </div>
  );
};

export default AdvocatesDataPage;
