import React, { useCallback, useEffect, useMemo, useState } from "react";
import { adminApi as axios } from "../utils/axiosInstances";
import {
  Table,
  Button,
  Spin,
  Pagination,
  Space,
  Typography,
  Modal,
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
  TeamOutlined,
  CommentOutlined,
  MailOutlined,
  BankOutlined,
  IdcardOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import BASE_URL from "../Config";
import HelpDeskCommentsModal from "./HelpDeskCommentsModal";

const { Text, Title } = Typography;
const { TextArea, Search } = Input;

interface RadhaLinkedinItem {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string | null;
  company: string;
  jobTitle: string;
  comments?: string | null;
}

interface AdminCommentRecord {
  adminComments?: string | null;
  commentsUpdateBy?: string | null;
  commentsCreatedDate?: string | null;
  customerBehaviour?: string | null;
  callingType?: string | null;
  dataType?: string | null;
}

const DEFAULT_PAGE_SIZE = 100;
const MAX_COMMENT_LENGTH = 1000;
const COMMENT_TRUNCATE_LENGTH = 60;

const PRIMARY_COLOR = "#008cba";
const SUCCESS_COLOR = "#1ab394";
const PENDING_COLOR = "#f5a623";

const RadhaLinkedin: React.FC = () => {
  const [records, setRecords] = useState<RadhaLinkedinItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [size] = useState(DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState(0);

  const [activeTab, setActiveTab] = useState<"all" | "updated" | "pending">(
    "all",
  );
  const [searchText, setSearchText] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<RadhaLinkedinItem | null>(null);
  const [commentsMap, setCommentsMap] = useState<
    Record<string, AdminCommentRecord | null | "loading">
  >({});
  const [commentValue, setCommentValue] = useState("");
  const [commentError, setCommentError] = useState("");
  const [saving, setSaving] = useState(false);

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

  const fetchCommentsForRows = useCallback((rows: RadhaLinkedinItem[]) => {
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

  const fetchRecords = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${BASE_URL}/ai-service/entity-records/radha-linkedin`,
        {
          params: { page, size },
        },
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
        title: "Unable to load records. Please try again.",
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

  const openCommentModal = (record: RadhaLinkedinItem) => {
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

      setRecords((prev) =>
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

  const [isMobile, setIsMobile] = useState(window.innerWidth < 576);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 576);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredRecords = useMemo(() => {
    let data = [...records];

    if (activeTab === "updated") {
      data = data.filter((item) => isValidComment(item.comments));
    }

    if (activeTab === "pending") {
      data = data.filter((item) => !isValidComment(item.comments));
    }

    if (searchText.trim()) {
      const search = searchText.toLowerCase().trim();

      data = data.filter(
        (item) =>
          item.firstName?.toLowerCase().includes(search) ||
          item.lastName?.toLowerCase().includes(search) ||
          item.emailAddress?.toLowerCase().includes(search) ||
          item.company?.toLowerCase().includes(search) ||
          item.jobTitle?.toLowerCase().includes(search),
      );
    }

    return data;
  }, [records, activeTab, searchText]);

  const updatedCount = records.filter((item) =>
    isValidComment(item.comments),
  ).length;
  const pendingCount = records.filter(
    (item) => !isValidComment(item.comments),
  ).length;

  const handleTabChange = (tab: "all" | "updated" | "pending") => {
    setActiveTab(tab);
    setSearchText("");
  };

  const columns: ColumnsType<RadhaLinkedinItem> = [
    {
      title: <div style={{ textAlign: "center" }}>S.No</div>,
      key: "serialNumber",
      align: "center",
      width: 70,
      render: (_value, _record, index) => (
        <Text strong style={{ color: "#6b7280" }}>
          {page * size + index + 1}
        </Text>
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <UserOutlined style={{ marginRight: 6 }} />
          Name
        </div>
      ),
      key: "name",
      align: "center",
      render: (_value, record: RadhaLinkedinItem) => {
        const fullName = [record.firstName, record.lastName]
          .filter((part) => hasValue(part))
          .join(" ");

        return (
          <Text strong style={{ color: "#1f2937" }}>
            {fullName || "-"}
          </Text>
        );
      },
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <MailOutlined style={{ marginRight: 6 }} />
          Email
        </div>
      ),
      dataIndex: "emailAddress",
      key: "emailAddress",
      align: "center",
      render: (value: string | null) =>
        hasValue(value) ? (
          <a
            href={`mailto:${value}`}
            style={{ color: PRIMARY_COLOR, textDecoration: "none" }}
          >
            {value}
          </a>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <BankOutlined style={{ marginRight: 6 }} />
          Company
        </div>
      ),
      dataIndex: "company",
      key: "company",
      align: "center",
      render: (value: string) => <Text>{hasValue(value) ? value : "-"}</Text>,
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <IdcardOutlined style={{ marginRight: 6 }} />
          Job Title
        </div>
      ),
      dataIndex: "jobTitle",
      key: "jobTitle",
      align: "center",
      render: (value: string) => <Text>{hasValue(value) ? value : "-"}</Text>,
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
      render: (_value: any, record: RadhaLinkedinItem) => {
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
      title: <div style={{ textAlign: "center" }}>Action</div>,
      key: "action",
      align: "center",
      width: 120,
      render: (_value, record: RadhaLinkedinItem) => {
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
              fontSize: 13,
            }}
            size="middle"
          >
            {hasComment ? "Edit" : "Add Comment"}
          </Button>
        );
      },
    },
  ];

  // Stat card data
  const statCards = [
    {
      label: "Total Data",
      count: records.length,
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
            Radha LinkedIn
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            View LinkedIn contact records and comments
          </Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchRecords}
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
              All Records ({records.length})
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

          {/* Search */}
          <Search
            allowClear
            placeholder="Search records..."
            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
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
            <Text type="secondary">Loading records...</Text>
          </div>
        ) : (
          <>
            <div style={{ width: "100%", overflowX: "auto" }}>
              <Table
                rowKey="id"
                dataSource={filteredRecords}
                columns={columns}
                pagination={false}
                bordered
                size="middle"
                scroll={{ x: 1000 }}
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <span style={{ color: "#9ca3af" }}>
                          {searchText
                            ? `No results found for "${searchText}"`
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
            </div>

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
                <strong>{records.length}</strong> records on this page
                {activeTab !== "all" && <> (filtered by {activeTab})</>}
              </Text>
              <Pagination
                current={page + 1}
                pageSize={size}
                total={total}
                showSizeChanger={false}
                showTotal={(totalRecords) => `Total ${totalRecords} records`}
                onChange={(pageNumber) => setPage(pageNumber - 1)}
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
            setRecords((prev: RadhaLinkedinItem[]) =>
              prev.map((item: RadhaLinkedinItem) =>
                item.id === selectedRecord.id
                  ? { ...item, comments: newComment }
                  : item
              )
            );
            setCommentsMap((prev) => ({
              ...prev,
              [selectedRecord.id]: {
                adminComments: newComment,
                commentsUpdateBy:
                  localStorage.getItem("admin_userName")?.toUpperCase() || "ADMIN",
                commentsCreatedDate: new Date().toISOString(),
              },
            }));
          }
        }}
        userId={selectedRecord?.id}
        record={selectedRecord}
        dataType="RADHA_LINKEDIN"
        BASE_URL={BASE_URL}
      />
    </div>
  );
};

export default RadhaLinkedin;