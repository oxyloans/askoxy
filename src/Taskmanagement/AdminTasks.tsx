// /src/AdminTasks.tsx
import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  Image,
  Typography,
  Input,
  message,
  Button,
  Popconfirm,
  Tag,
  Modal,
  Space,
  Empty,
  Select,
} from "antd";
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { employeeApi } from "../utils/axiosInstances";
import UserPanelLayout from "./UserPanelLayout";
import BASE_URL from "../Config";

const { Text, Paragraph } = Typography;
const { Option } = Select;

interface CommentType {
  commentsBy: string;
  comments: string;
  status?: string;
}

interface Task {
  id: string;
  image?: string | null;
  status: string;
  taskAssignBy: string;
  taskAssignTo: string[] | string;
  taskName: string;
  taskAssignedDate: string;
  taskCompleteDate: string;
  tastCreatedDate?: string;
}

type StatusFilter = "ALL" | "ASSIGNED" | "COMPLETED" | "REJECTED" | "DELETED";

const STATUS_CONFIG: Record<
  StatusFilter,
  { color: string; bg: string; border: string; label: string }
> = {
  ALL: { color: "#444", bg: "#f5f5f5", border: "#d9d9d9", label: "All" },
  ASSIGNED: {
    color: "#008cba",
    bg: "#e8f6fb",
    border: "#008cba",
    label: "Assigned",
  },
  COMPLETED: {
    color: "#1ab394",
    bg: "#e8f8f5",
    border: "#1ab394",
    label: "Completed",
  },
  REJECTED: {
    color: "#e74c3c",
    bg: "#fdf0ef",
    border: "#e74c3c",
    label: "Rejected",
  },
  DELETED: {
    color: "#95a5a6",
    bg: "#f4f4f4",
    border: "#95a5a6",
    label: "Deleted",
  },
};

const AdminTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [commentsData, setCommentsData] = useState<CommentType[]>([]);
  const [comments, setComments] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [assignedCount, setAssignedCount] = useState<number>(0);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date as any)) return dateString;
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        weekday: "short",
      });
    } catch {
      return dateString;
    }
  };

  const fetchTasks = useCallback(
    async (
      page: number = currentPage,
      size: number = pageSize,
      status: string = statusFilter,
      search: string = searchText,
    ) => {
      setLoading(true);
      try {
        const params: any = { page: page - 1, size };

        const response = await employeeApi.get(
          `${BASE_URL}/ai-service/agent/getAllMessagesFromGroup`,
          { params },
        );

        const data = response.data;
        const allContent: Task[] = (data.content || []).filter((task: any) => {
          const assigned = task.taskAssignTo;
          const hasValidAssignee = Array.isArray(assigned)
            ? assigned.some((a: string) => a && a.trim() !== "")
            : typeof assigned === "string" && assigned.trim() !== "";
          const hasValidTaskName =
            typeof task.taskName === "string" && task.taskName.trim() !== "";

          const matchesSearch =
            !search.trim() ||
            task.taskName?.toLowerCase().includes(search.toLowerCase()) ||
            task.taskAssignBy?.toLowerCase().includes(search.toLowerCase()) ||
            (Array.isArray(task.taskAssignTo)
              ? task.taskAssignTo.some((name: string) =>
                  name?.toLowerCase().includes(search.toLowerCase()),
                )
              : task.taskAssignTo
                  ?.toLowerCase()
                  .includes(search.toLowerCase()));

          return hasValidAssignee && hasValidTaskName && matchesSearch;
        });

        const assignedTasks = allContent.filter(
          (task: any) => task.status?.toUpperCase() === "ASSIGNED",
        );
        const completedTasks = allContent.filter(
          (task: any) => task.status?.toUpperCase() === "COMPLETED",
        );

        setAssignedCount(assignedTasks.length);
        setCompletedCount(completedTasks.length);

        const filteredContent =
          status.toUpperCase() === "ALL"
            ? allContent
            : allContent.filter(
                (task: any) =>
                  task.status?.toUpperCase() === status.toUpperCase(),
              );

        setTasks(filteredContent);
        setTotalElements(data.totalElements || 0);
      } catch (error) {
        message.error("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, pageSize, statusFilter, searchText],
  );

  useEffect(() => {
    const timer = setTimeout(() => setSearchText(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchTasks(currentPage, pageSize, statusFilter, searchText);
  }, [currentPage, pageSize, statusFilter, searchText, fetchTasks]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchText]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await employeeApi.patch(
        `${BASE_URL}/ai-service/agent/taskUpdate?id=${id}&status=${newStatus}`,
        {},
      );
      message.success(`Task marked as ${newStatus.toLowerCase()}`);
      await fetchTasks(currentPage, pageSize, statusFilter, searchText);
    } catch {
      message.error("Failed to update task status");
    }
  };

  const handleCommentsUpdate = async () => {
    if (!comments.trim()) {
      message.warning("Please enter a comment before submitting.");
      return;
    }
    try {
      await employeeApi.post(
        `${BASE_URL}/ai-service/agent/userAndRadhaSirComments`,
        {
          taskId: selectedTask?.id,
          comments,
          commentsBy: "EMPLOYEE",
        },
      );
      message.success("Comment added successfully!");
      setCommentsModalVisible(false);
      setComments("");
      fetchTasks(currentPage, pageSize, statusFilter, searchText);
      if (selectedTask) handleViewComments(selectedTask);
    } catch {
      message.error("Failed to add comment");
    }
  };

  const handleViewComments = async (task: Task) => {
    try {
      setLoading(true);
      setSelectedTask(task);
      const response = await employeeApi.get(
        `${BASE_URL}/ai-service/agent/taskedIdBasedOnComments`,
        { params: { taskId: task.id } },
      );
      setCommentsData(response.data || []);
      setViewModalVisible(true);
    } catch {
      message.error("Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  };

  const getAssignedToText = (taskAssignTo: string[] | string) => {
    if (Array.isArray(taskAssignTo))
      return taskAssignTo.filter(Boolean).join(", ");
    return taskAssignTo || "";
  };

  const renderFileCell = (url?: string | null) => {
    if (!url)
      return <span style={{ color: "#bbb", fontSize: 12 }}>No File</span>;

    const lower = url.toLowerCase();
    const isImage = /\.(jpg|jpeg|png|webp|gif)$/.test(lower);
    const isPdf = lower.endsWith(".pdf");
    const isExcel = /\.(xls|xlsx)$/.test(lower);

    if (isImage) {
      return (
        <Image
          width={72}
          height={72}
          src={url}
          preview
          style={{ borderRadius: 8, objectFit: "cover" }}
        />
      );
    }
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: 12, color: "#008cba", fontWeight: 600 }}
      >
        {isPdf ? "View PDF" : isExcel ? "View Excel" : "View File"}
      </a>
    );
  };

  const columns = [
    {
      title: "#",
      key: "serial",
      width: 55,
      align: "center" as const,
      render: (_: any, __: Task, index: number) => (
        <span style={{ fontWeight: 600, color: "#888", fontSize: 13 }}>
          {index + 1 + (currentPage - 1) * pageSize}
        </span>
      ),
    },
    {
      title: "Task Details",
      key: "task_info",
      width: 200,
      render: (_: any, record: Task) => {
        const assignedTo = getAssignedToText(record.taskAssignTo);
        return (
          <div style={{ minWidth: 200, maxHeight: 150, overflowY: "auto" }}>
            <div style={{ marginBottom: 4 }}>
              <Tag
                color="geekblue"
                style={{ fontSize: 11, margin: 0, borderRadius: 4 }}
              >
                #{record.id.slice(-6).toUpperCase()}
              </Tag>
            </div>
            <div style={{ marginBottom: 3 }}>
              <span style={{ fontSize: 11, color: "#999" }}>By: </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#351664" }}>
                {record.taskAssignBy}
              </span>
            </div>
            <div>
              <span style={{ fontSize: 11, color: "#999" }}>To: </span>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#008cba" }}>
                {assignedTo}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Task Description",
      dataIndex: "taskName",
      key: "taskName",
      width: 400,
      render: (text: string) => (
        <div style={{ maxHeight: 150, overflowY: "auto", paddingRight: 8 }}>
          <Paragraph
            style={{
              margin: 0,
              fontSize: 13,
              color: "#333",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {text}
          </Paragraph>
        </div>
      ),
    },
    {
      title: "Date & Status",
      key: "timeline",
      width: 170,
      render: (_: any, record: Task) => (
        <div>
          <div style={{ marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "#555" }}>
              {record.taskAssignedDate
                ? formatDate(record.taskAssignedDate)
                : "—"}
            </span>
          </div>
          {record.tastCreatedDate && (
            <div style={{ fontSize: 11, color: "#aaa", marginBottom: 6 }}>
              {record.tastCreatedDate}
            </div>
          )}
          <Tag
            style={{
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 20,
              padding: "2px 10px",
              border: `1px solid ${STATUS_CONFIG[record.status?.toUpperCase() as StatusFilter]?.border || "#d9d9d9"}`,
              background:
                STATUS_CONFIG[record.status?.toUpperCase() as StatusFilter]
                  ?.bg || "#f5f5f5",
              color:
                STATUS_CONFIG[record.status?.toUpperCase() as StatusFilter]
                  ?.color || "#666",
            }}
          >
            {STATUS_CONFIG[record.status?.toUpperCase() as StatusFilter]
              ?.label || record.status}
          </Tag>
        </div>
      ),
    },
    {
      title: "Attachment",
      dataIndex: "image",
      key: "image",
      width: 100,
      align: "center" as const,
      render: (url?: string | null) => renderFileCell(url),
    },
    {
      title: "Actions",
      key: "actions",
      width: 160,
      align: "center" as const,
      render: (_: any, record: Task) => (
        <Space direction="vertical" size={6} style={{ width: "100%" }}>
          {record.status?.toLowerCase() !== "completed" && (
            <Popconfirm
              title="Mark this task as completed?"
              onConfirm={() => handleStatusUpdate(record.id, "COMPLETED")}
              okText="Yes"
              cancelText="No"
              okButtonProps={{
                style: { background: "#1ab394", borderColor: "#1ab394" },
              }}
            >
              <Button
                size="small"
                block
                style={{
                  background: "#1ab394",
                  borderColor: "#1ab394",
                  color: "#fff",
                  borderRadius: 6,
                  fontWeight: 500,
                }}
              >
                Complete
              </Button>
            </Popconfirm>
          )}
          <Button
            size="small"
            block
            style={{
              background: "#008cba",
              borderColor: "#008cba",
              color: "#fff",
              borderRadius: 6,
              fontWeight: 500,
            }}
            onClick={() => {
              setSelectedTask(record);
              setCommentsModalVisible(true);
            }}
          >
            Add Comment
          </Button>
          <Button
            size="small"
            block
            style={{
              background: "#351664",
              borderColor: "#351664",
              color: "#fff",
              borderRadius: 6,
              fontWeight: 500,
            }}
            onClick={() => handleViewComments(record)}
          >
            View Comments
          </Button>
        </Space>
      ),
    },
  ];

  const cfg = STATUS_CONFIG[statusFilter];

  return (
    <UserPanelLayout>
      <div style={{ padding: "20px 16px", minHeight: "100vh" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div>
            <div
              style={{
                color: "#351664",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 0.3,
              }}
            >
              WhatsApp Task Manager
            </div>
            <div style={{ color: "#888", fontSize: 13, marginTop: 2 }}>
              Manage and track all assigned tasks
            </div>
          </div>
          {/* <Badge
            count={totalElements}
            overflowCount={9999}
            style={{ backgroundColor: cfg.color, fontSize: 13, fontWeight: 700, padding: "0 10px", height: 26, lineHeight: "26px", borderRadius: 13 }}
          >
            <div style={{ background: cfg.bg, borderRadius: 8, padding: "6px 14px", color: cfg.color, fontSize: 13, fontWeight: 600 }}>
              {cfg.label} Tasks
            </div>
          </Badge> */}
        </div>

        {/* Filters Row */}
        <div
          style={{
            padding: "14px 0",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <Space align="center" size={12} wrap>
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as StatusFilter)}
              style={{ width: 220, minWidth: 180, borderRadius: 20 }}
              dropdownMatchSelectWidth={false}
            >
              <Option value="ALL">All</Option>
              <Option value="ASSIGNED">Assigned</Option>
              <Option value="COMPLETED">Completed</Option>
            </Select>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: 13, color: "#555" }}>
                Assigned: <strong>{assignedCount}</strong>
              </span>
              <span style={{ fontSize: 13, color: "#555" }}>
                Completed: <strong>{completedCount}</strong>
              </span>
            </div>
          </Space>

          {/* Search */}
          <Input
            prefix={<SearchOutlined style={{ color: "#bbb" }} />}
            suffix={
              searchInput ? (
                <CloseCircleOutlined
                  style={{ color: "#bbb", cursor: "pointer" }}
                  onClick={() => {
                    setSearchInput("");
                  }}
                />
              ) : null
            }
            placeholder="Search by name, task..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              width: 260,
              borderRadius: 20,
              border: "1.5px solid #e0e0e0",
            }}
            allowClear={false}
          />
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={tasks}
          rowKey={(r) => r.id}
          loading={loading}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span style={{ color: "#aaa", fontSize: 14 }}>
                    {searchText
                      ? `No tasks found for "${searchText}"`
                      : `No ${cfg.label.toLowerCase()} tasks`}
                  </span>
                }
              />
            ),
          }}
          pagination={{
            current: currentPage,
            pageSize,
            total: totalElements,
            showSizeChanger: true,
            pageSizeOptions: ["50", "100", "200", "300"],
            showTotal: (total, range) => (
              <span style={{ fontSize: 13, color: "#666" }}>
                {range[0]}–{range[1]} of <strong>{total}</strong> tasks
              </span>
            ),
            onChange: (page, size) => {
              setCurrentPage(page);
              if (size !== pageSize) {
                setPageSize(size);
                setCurrentPage(1);
              }
            },
            style: { padding: "12px 16px" },
          }}
          bordered={false}
          showHeader
          scroll={{ x: 900 }}
          style={{ fontSize: 13 }}
        />
      </div>

      {/* View Comments Modal */}
      <Modal
        title="Comments"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={
          <Button
            onClick={() => {
              setViewModalVisible(false);
              setSelectedTask(selectedTask);
              setCommentsModalVisible(true);
            }}
            style={{
              background: "#008cba",
              borderColor: "#008cba",
              color: "#fff",
              borderRadius: 6,
            }}
          >
            Add Comment
          </Button>
        }
        width={580}
        styles={{
          body: { maxHeight: 420, overflowY: "auto", padding: "16px 20px" },
        }}
      >
        {commentsData.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {commentsData.map((comment, index) => (
              <div
                key={index}
                style={{
                  background: "#f8faff",
                  border: "1px solid #e3eaf5",
                  borderLeft: "4px solid #008cba",
                  borderRadius: 8,
                  padding: "12px 14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "#351664",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {(comment.commentsBy || "?")[0].toUpperCase()}
                    </div>
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: "#351664",
                      }}
                    >
                      {comment.commentsBy}
                    </span>
                  </div>
                  {comment.status && (
                    <Tag
                      color={
                        comment.status.toLowerCase() === "completed"
                          ? "success"
                          : comment.status.toLowerCase() === "rejected"
                            ? "error"
                            : "processing"
                      }
                      style={{ borderRadius: 10, fontSize: 11 }}
                    >
                      {comment.status}
                    </Tag>
                  )}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "#444",
                    lineHeight: 1.6,
                  }}
                >
                  {comment.comments}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No comments yet for this task."
          />
        )}
      </Modal>

      {/* Add Comment Modal */}
      <Modal
        title="Add Comment"
        open={commentsModalVisible}
        onCancel={() => {
          setCommentsModalVisible(false);
          setComments("");
        }}
        onOk={handleCommentsUpdate}
        okText="Submit"
        cancelText="Cancel"
        okButtonProps={{
          style: {
            background: "#008cba",
            borderColor: "#008cba",
            borderRadius: 6,
            fontWeight: 600,
          },
        }}
        cancelButtonProps={{ style: { borderRadius: 6 } }}
        width={500}
      >
        <div style={{ marginBottom: 8 }}>
          <Text style={{ fontSize: 13, color: "#555" }}>
            Task:{" "}
            <strong style={{ color: "#351664" }}>
              {selectedTask?.taskName?.slice(0, 60)}
              {(selectedTask?.taskName?.length || 0) > 60 ? "…" : ""}
            </strong>
          </Text>
        </div>
        <Input.TextArea
          rows={4}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Write your comment here..."
          style={{ borderRadius: 8, fontSize: 13, resize: "none" }}
          maxLength={500}
          showCount
        />
      </Modal>
    </UserPanelLayout>
  );
};

export default AdminTasks;
