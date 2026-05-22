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
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import BASE_URL from "../Config";

const { Text, Title } = Typography;
const { TextArea, Search } = Input;

interface SudheerVakkalagaddaItem {
  id: string;
  name: string;
  mobileNumber: string;
  comments: string | null;
}

const DEFAULT_PAGE_SIZE = 50;
const MAX_COMMENT_LENGTH = 1000;
const COMMENT_TRUNCATE_LENGTH = 60;

const PRIMARY_COLOR = "#008cba";
const SUCCESS_COLOR = "#1ab394";
const PENDING_COLOR = "#f5a623";

const SudheerVakkalagadda: React.FC = () => {
  const [records, setRecords] = useState<SudheerVakkalagaddaItem[]>([]);
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
    useState<SudheerVakkalagaddaItem | null>(null);
  const [commentValue, setCommentValue] = useState("");
  const [commentError, setCommentError] = useState("");
  const [saving, setSaving] = useState(false);

  const isValidComment = (value: string | null | undefined) => {
    if (value === null || value === undefined) return false;
    const text = String(value).trim();
    return text !== "" && text.toLowerCase() !== "null";
  };

  const fetchRecords = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${BASE_URL}/ai-service/agent/sudheerVakkalagadda`,
        {
          params: { page, size },
        },
      );

      const content = response.data?.content || [];
      setRecords(content);
      setTotal(response.data?.totalElements ?? content.length);
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
  }, [page, size]);

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

  const openCommentModal = (record: SudheerVakkalagaddaItem) => {
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
      await axios.patch(`${BASE_URL}/ai-service/agent/commentsUpdationVakkalagadd`, null, {
        params: {
          id: selectedRecord.id,
          comments: cleanComment,
        },
      });

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
          item.name?.toLowerCase().includes(search) ||
          item.mobileNumber?.toLowerCase().includes(search),
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

  const columns: ColumnsType<SudheerVakkalagaddaItem> = [
    {
      title: <div style={{ textAlign: "center" }}>S.No</div>,
      key: "serialNumber",
     
      align: "center",
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
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (value: string) => (
        <Text strong style={{ color: "#1f2937" }}>
          {value || "-"}
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
      align: "center",
      render: (value: string) =>
        value ? (
          <a
            href={`tel:${value}`}
            style={{
              color: PRIMARY_COLOR,
              fontWeight: 500,
              textDecoration: "none",
            }}
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
          <CommentOutlined style={{ marginRight: 6 }} />
          Comments
        </div>
      ),
      dataIndex: "comments",
      key: "comments",
      align: "center",
      render: (value: string | null) => {
        if (!isValidComment(value)) {
          return (
            <Tag
              color="default"
              style={{
                borderStyle: "dashed",
                color: "#9ca3af",
                fontSize: 12,
              }}
            >
              No comments added
            </Tag>
          );
        }

        const displayText = value || "";
        const isTruncated = displayText.length > COMMENT_TRUNCATE_LENGTH;

        return isTruncated ? (
          <Tooltip title={displayText} placement="topLeft" overlayStyle={{ maxWidth: 400 }}>
            <Text
              style={{
                cursor: "pointer",
                maxWidth: 250,
                display: "inline-block",
              }}
              ellipsis
            >
              {displayText}
            </Text>
          </Tooltip>
        ) : (
          <Text>{displayText}</Text>
        );
      },
    },
    {
      title: <div style={{ textAlign: "center" }}>Action</div>,
      key: "action",
      align: "center",
     
      render: (_value, record: SudheerVakkalagaddaItem) => {
        const hasComment = isValidComment(record.comments);

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
            Sudheer Vakkalagadda Data
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Manage data records and comments
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
        {statCards.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "#ffffff",
              borderRadius: 12,
              padding: "16px 20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              borderLeft: `4px solid ${stat.color}`,
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
                background: stat.bgColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {stat.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: stat.color,
                  lineHeight: 1.2,
                }}
              >
                {stat.count}
              </div>
              <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

     
      <div
       
      >
        {/* Tabs & Search */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 16,
            alignItems: "center",
          }}
        >
          <Space wrap>
            {(
              [
                {
                  key: "all" as const,
                  label: "All",
                  count: records.length,
                  color: PRIMARY_COLOR,
                },
                {
                  key: "updated" as const,
                  label: "Updated",
                  count: updatedCount,
                  color: SUCCESS_COLOR,
                },
                {
                  key: "pending" as const,
                  label: "Pending",
                  count: pendingCount,
                  color: PENDING_COLOR,
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
                    : {
                        borderRadius: 8,
                        fontWeight: 500,
                      }
                }
              >
                {tab.label} ({tab.count})
              </Button>
            ))}
          </Space>

          <Search
            allowClear
            placeholder="Search by name or mobile number"
            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              maxWidth: 300,
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
            <Table
              rowKey="id"
              dataSource={filteredRecords}
              columns={columns}
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
                        {searchText
                          ? `No results found for "${searchText}"`
                          : activeTab === "updated"
                            ? "No updated comments yet"
                            : activeTab === "pending"
                              ? "All comments are up to date!"
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
              <Text
                type="secondary"
                style={{ fontSize: 13 }}
              >
                Showing{" "}
                <strong>{filteredRecords.length}</strong> of{" "}
                <strong>{records.length}</strong> records
                {activeTab !== "all" && (
                  <> (filtered by {activeTab})</>
                )}
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
      <Modal
        title={
          <div style={{ paddingBottom: 4 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: isValidComment(selectedRecord?.comments)
                    ? "#e8faf5"
                    : "#e6f7ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isValidComment(selectedRecord?.comments) ? (
                  <EditOutlined style={{ color: SUCCESS_COLOR, fontSize: 16 }} />
                ) : (
                  <PlusOutlined style={{ color: PRIMARY_COLOR, fontSize: 16 }} />
                )}
              </div>
              <Text strong style={{ fontSize: 16 }}>
                {isValidComment(selectedRecord?.comments)
                  ? "Edit Comment"
                  : "Add Comment"}
              </Text>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                paddingLeft: isMobile ? 8 : 40,
              }}
            >
              <UserOutlined
                style={{ fontSize: 12, color: "#9ca3af" }}
              />
              <Text type="secondary" style={{ fontSize: 13 }}>
                {selectedRecord?.name || "-"}
              </Text>
              {selectedRecord?.mobileNumber && (
                <>
                  <span style={{ color: "#d1d5db" }}>|</span>
                  <PhoneOutlined
                    style={{ fontSize: 12, color: "#9ca3af" }}
                  />
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {selectedRecord.mobileNumber}
                  </Text>
                </>
              )}
            </div>
          </div>
        }
        open={modalOpen}
        onCancel={closeCommentModal}
        centered
        width={isMobile ? "95%" : 520}
        destroyOnClose
        footer={[
          <Button
            key="cancel"
            onClick={closeCommentModal}
            disabled={saving}
            style={{ borderRadius: 8 }}
          >
            Cancel
          </Button>,
          <Button
            key="update"
            type="primary"
            loading={saving}
            onClick={updateComments}
            disabled={!commentValue.trim()}
            style={{
              background:
                !commentValue.trim() ? undefined : SUCCESS_COLOR,
              borderColor:
                !commentValue.trim() ? undefined : SUCCESS_COLOR,
              fontWeight: 600,
              borderRadius: 8,
            }}
          >
            {isValidComment(selectedRecord?.comments)
              ? "Update Comment"
              : "Save Comment"}
          </Button>,
        ]}
      >
        <div style={{ marginBottom: 8 }}>
          <Text
            type="secondary"
            style={{ fontSize: 13 }}
          >
            Enter your comment below ({MAX_COMMENT_LENGTH} characters max)
          </Text>
        </div>

        <TextArea
          value={commentValue}
          onChange={(e) => {
            setCommentValue(e.target.value);
            if (commentError) {
              setCommentError(validateComment(e.target.value));
            }
          }}
          placeholder="Enter comment, e.g. line busy, not reachable, interested..."
          autoSize={{ minRows: 4, maxRows: 6 }}
         
          status={commentError ? "error" : ""}
          style={{ borderRadius: 8 }}
        />

        {commentError && (
          <div style={{ marginTop: 6 }}>
            <Text type="danger" style={{ fontSize: 13 }}>
              {commentError}
            </Text>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SudheerVakkalagadda;
