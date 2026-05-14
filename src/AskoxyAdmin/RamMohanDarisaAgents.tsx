import React, { useCallback, useEffect, useMemo, useState } from "react";
import { adminApi as axios } from "../utils/axiosInstances";
import {
  message,
  Table,
  Button,
  Spin,
  Pagination,
  Space,
  Typography,
  Modal,
  Input,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import BASE_URL from "../Config";

const { Text } = Typography;
const { TextArea, Search } = Input;

interface RamMohanDarisaItem {
  id: string;
  name: string;
  mobileNumber: string;
  comments: string | null;
}

const DEFAULT_PAGE_SIZE = 50;
const MAX_COMMENT_LENGTH = 1000;

const PRIMARY_COLOR = "#008cba";
const SUCCESS_COLOR = "#1ab394";

const RamMohanDarisaAgents: React.FC = () => {
  const [records, setRecords] = useState<RamMohanDarisaItem[]>([]);
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
    useState<RamMohanDarisaItem | null>(null);
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
        `${BASE_URL}/ai-service/agent/getAllRamMohanDarisa`,
        {
          params: { page, size },
        },
      );

      const content = response.data?.content || [];
      setRecords(content);
      setTotal(response.data?.totalElements ?? content.length);
    } catch (error) {
      console.error(error);
      message.error("Unable to load records. Please try again.");
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

  const openCommentModal = (record: RamMohanDarisaItem) => {
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
      message.warning(validationError);
      return;
    }

    setSaving(true);

    try {
      await axios.patch(`${BASE_URL}/ai-service/agent/commentsUpdation`, null, {
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

      message.success("Comment updated successfully.");
      closeCommentModal();
    } catch (error) {
      console.error(error);
      message.error("Unable to update comment. Please try again.");
    } finally {
      setSaving(false);
    }
  };

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

  const columns: ColumnsType<RamMohanDarisaItem> = [
    {
      title: <div style={{ textAlign: "center" }}>S.No</div>,
      key: "serialNumber",
      width: 80,
      align: "center",
      render: (_value, _record, index) => page * size + index + 1,
    },
    {
      title: <div style={{ textAlign: "center" }}>Name</div>,
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (value: string) => <Text strong>{value || "-"}</Text>,
    },
    {
      title: <div style={{ textAlign: "center" }}>Mobile Number</div>,
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      align: "center",
      render: (value: string) => value || "-",
    },
    {
      title: <div style={{ textAlign: "center" }}>Comments</div>,
      dataIndex: "comments",
      key: "comments",
      align: "center",
      render: (value: string | null) =>
        isValidComment(value) ? (
          <Text>{value}</Text>
        ) : (
          <Text type="secondary">No comments added</Text>
        ),
    },
    {
      title: <div style={{ textAlign: "center" }}>Action</div>,
      key: "action",
      align: "center",
      fixed: "right",
      render: (_value, record: RamMohanDarisaItem) => {
        const hasComment = isValidComment(record.comments);

        return (
          <Button
            type="primary"
            onClick={() => openCommentModal(record)}
            style={{
              background: hasComment ? SUCCESS_COLOR : PRIMARY_COLOR,
              borderColor: hasComment ? SUCCESS_COLOR : PRIMARY_COLOR,
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            {hasComment ? "Edit Comment" : "Add Comment"}
          </Button>
        );
      },
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
      <div
        style={{
          background: "#ffffff",
          borderRadius: 14,
          padding: 16,
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <Space wrap>
            <Button
              type={activeTab === "all" ? "primary" : "default"}
              onClick={() => handleTabChange("all")}
              style={
                activeTab === "all"
                  ? { background: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }
                  : {}
              }
            >
              All ({records.length})
            </Button>

            <Button
              type={activeTab === "updated" ? "primary" : "default"}
              onClick={() => handleTabChange("updated")}
              style={
                activeTab === "updated"
                  ? { background: SUCCESS_COLOR, borderColor: SUCCESS_COLOR }
                  : {}
              }
            >
              Comments Updated ({updatedCount})
            </Button>

            <Button
              type={activeTab === "pending" ? "primary" : "default"}
              onClick={() => handleTabChange("pending")}
              style={
                activeTab === "pending"
                  ? { background: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }
                  : {}
              }
            >
              Comments Pending ({pendingCount})
            </Button>
          </Space>

          <Search
            allowClear
            placeholder="Search by name or mobile number"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              maxWidth: 300,
              width: "100%",
            }}
          />
        </div>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 60,
            }}
          >
            <Spin tip="Loading records..." size="large" />
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
                emptyText:
                  searchText || activeTab !== "all"
                    ? "No matching records found."
                    : "No records found.",
              }}
            />

            <div
              style={{
                marginTop: 16,
                display: "flex",
                justifyContent: "flex-end",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
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

      <Modal
        title={
          <div>
            <Text strong style={{ fontSize: 16 }}>
              {isValidComment(selectedRecord?.comments)
                ? "Edit Comment"
                : "Add Comment"}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: 13 }}>
              {selectedRecord?.name || "-"}
              {selectedRecord?.mobileNumber
                ? ` | ${selectedRecord.mobileNumber}`
                : ""}
            </Text>
          </div>
        }
        open={modalOpen}
        onCancel={closeCommentModal}
        centered
        width={520}
        destroyOnClose
        footer={[
          <Button key="cancel" onClick={closeCommentModal} disabled={saving}>
            Cancel
          </Button>,
          <Button
            key="update"
            type="primary"
            loading={saving}
            onClick={updateComments}
            style={{
              background: SUCCESS_COLOR,
              borderColor: SUCCESS_COLOR,
              fontWeight: 600,
            }}
          >
            Update
          </Button>,
        ]}
      >
        <TextArea
          value={commentValue}
          onChange={(e) => {
            setCommentValue(e.target.value);
            if (commentError) {
              setCommentError(validateComment(e.target.value));
            }
          }}
          placeholder="Enter comment, e.g. line busy"
          autoSize={{ minRows: 4, maxRows: 6 }}
          maxLength={MAX_COMMENT_LENGTH}
          showCount
          status={commentError ? "error" : ""}
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

export default RamMohanDarisaAgents;
