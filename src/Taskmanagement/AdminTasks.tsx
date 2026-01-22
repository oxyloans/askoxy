// /src/AdminTasks.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Spin,
  Image,
  Typography,
  Input,
  message,
  Button,
  Row,
  Col,
  Segmented,
  Popconfirm,
  Tag,
  Modal,
  Space,
} from "antd";
import {
  SearchOutlined,
  CheckOutlined,
  CommentOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import UserPanelLayout from "./UserPanelLayout";
import BASE_URL from "../Config";

const { Text } = Typography;
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
  tastCreatedDate: string;
  taskCompleteDate: string;
}
type StatusFilter = "ALL" | "ASSIGNED" | "COMPLETED" | "REJECTED" | "DELETED";
const AdminTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const accessToken = sessionStorage.getItem("accessToken");

  const userId = sessionStorage.getItem("userId") || "";
  const [searchText, setSearchText] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [commentsData, setCommentsData] = useState<CommentType[]>([]);
  const [comments, setComments] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const normalizeStatus = (s?: string): StatusFilter => {
    const v = (s || "").trim().toUpperCase();
    if (v === "ASSIGNED") return "ASSIGNED";
    if (v === "COMPLETED") return "COMPLETED";

    return "ASSIGNED";
  };
  const statusCounts = useMemo(() => {
    // Filter by search text first
    const q = searchText.trim().toLowerCase();
    let searchFiltered = tasks;

    if (q) {
      searchFiltered = tasks.filter((task) => {
        const taskName = (task.taskName || "").toLowerCase();
        const taskAssignBy = (task.taskAssignBy || "").toLowerCase();
        let assignToArr: string[] = [];
        if (Array.isArray(task.taskAssignTo)) {
          assignToArr = task.taskAssignTo.map((a) => (a || "").toLowerCase());
        } else if (typeof task.taskAssignTo === "string") {
          assignToArr = [task.taskAssignTo.toLowerCase()];
        }

        return (
          taskName.includes(q) ||
          taskAssignBy.includes(q) ||
          assignToArr.some((name) => name.includes(q))
        );
      });
    }

    const counts: Record<StatusFilter, number> = {
      ALL: searchFiltered.length,
      ASSIGNED: 0,
      COMPLETED: 0,
      REJECTED: 0,
      DELETED: 0,
    };

    searchFiltered.forEach((t) => {
      const ns = normalizeStatus(t.status);
      counts[ns] += 1;
    });

    return counts;
  }, [tasks, searchText]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      if (isNaN(date as any)) return dateString;

      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        weekday: "short",
      };

      return date.toLocaleDateString("en-IN", options);
    } catch (error) {
      return dateString;
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/ai-service/agent/getAllMessagesFromGroup`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const reversedTasks = response.data.slice().reverse();

      // ✅ Filter out invalid rows
      const validTasks = reversedTasks.filter((task: any) => {
        const assigned = task.taskAssignTo;
        const taskName = task.taskName;

        // Check for valid taskAssignTo
        const hasValidAssignee = (() => {
          if (!assigned) return false;
          if (Array.isArray(assigned))
            return assigned.some((a) => a && a.trim() !== "");
          if (typeof assigned === "string") return assigned.trim() !== "";
          return false;
        })();

        // Check for valid taskName
        const hasValidTaskName =
          typeof taskName === "string" && taskName.trim() !== "";

        // ✅ Keep only rows that have both valid taskAssignTo AND valid taskName
        return hasValidAssignee && hasValidTaskName;
      });
      validTasks.sort((a: Task, b: Task): number => {
        const dateA: Date = new Date(a.tastCreatedDate || 0);
        const dateB: Date = new Date(b.tastCreatedDate || 0);
        return dateB.getTime() - dateA.getTime();
      });

      setTasks(validTasks);
      setFilteredTasks(validTasks);
      // ✅ Reset pagination to first page on initial load
      setCurrentPage(1);
      setPageSize(100);
    } catch (error) {
      message.error("Failed to fetch tasks");
      console.error("Task Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);
  const getTaskAssignToText = (taskAssignTo: string | string[] | undefined) => {
    if (!taskAssignTo) return "";
    if (Array.isArray(taskAssignTo)) {
      return taskAssignTo.filter(Boolean).join(", ");
    }
    return taskAssignTo;
  };

  // Filtering logic with useMemo at component level
  const filtered = useMemo(() => {
    const statusFiltered =
      statusFilter === "ALL"
        ? tasks
        : tasks.filter((t) => normalizeStatus(t.status) === statusFilter);

    const q = searchText.trim().toLowerCase();
    if (!q) return statusFiltered;

    return statusFiltered.filter((task) => {
      const taskName = (task.taskName || "").toLowerCase();
      const taskAssignBy = (task.taskAssignBy || "").toLowerCase();
      let assignToArr: string[] = [];
      if (Array.isArray(task.taskAssignTo)) {
        assignToArr = task.taskAssignTo.map((a) => (a || "").toLowerCase());
      } else if (typeof task.taskAssignTo === "string") {
        assignToArr = [task.taskAssignTo.toLowerCase()];
      }

      return (
        taskName.includes(q) ||
        taskAssignBy.includes(q) ||
        assignToArr.some((name) => name.includes(q))
      );
    });
  }, [tasks, searchText, statusFilter]);

  useEffect(() => {
    setFilteredTasks(filtered);
  }, [filtered]);

  // Reset to page 1 whenever search text changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  // Clamp current page if data length changes and current page becomes invalid
  useEffect(() => {
    const totalPages = Math.ceil(filteredTasks.length / pageSize) || 1;
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredTasks.length, pageSize]);

  // Simplified search handler
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setLoading(true);
    try {
      await axios.patch(
        `${BASE_URL}/ai-service/agent/taskUpdate?id=${id}&status=${newStatus}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      message.success(`Task marked as ${newStatus}`);
      fetchTasks();
    } catch (error) {
      console.error(error);
      message.error("Failed to update task status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    let color: string;
    let text: string;

    switch (status?.toLowerCase()) {
      case "assigned":
        color = "blue";
        text = "Assigned";
        break;
      case "completed":
        color = "green";
        text = "Completed";
        break;
      case "rejected":
        color = "red";
        text = "Rejected";
        break;
      case "deleted":
        color = "gray";
        text = "Deleted";
        break;
      default:
        color = "gold";
        text = "Pending";
    }
    return (
      <Tag
        color={color}
        style={{
          fontSize: 13,
          fontWeight: 500,
          textTransform: "capitalize",
          borderRadius: 8,
          padding: "3px 10px",
        }}
      >
        {text}
      </Tag>
    );
  };

  const handleCommentsAdd = (task: Task) => {
    setSelectedTask(task);
    setCommentsModalVisible(true);
  };

  const handleCommentsUpdate = async () => {
    if (!comments.trim()) {
      message.warning("Please enter a comment before submitting.");
      return;
    }
    try {
      await axios.post(
        `${BASE_URL}/ai-service/agent/userAndRadhaSirComments`,
        {
          taskId: selectedTask?.id,
          comments,
          commentsBy: "EMPLOYEE",
        },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      message.success("Comments added successfully!");
      setCommentsModalVisible(false);
      setComments("");
      fetchTasks();

      // Automatically open view modal with refreshed comments
      if (selectedTask) {
        handleViewComments(selectedTask);
      }
    } catch (error) {
      console.error("Update Error:", error);
      message.error("Failed to add comment");
    }
  };

  const handleViewComments = async (task: Task) => {
    try {
      setLoading(true);
      setSelectedTask(task);
      const response = await axios.get(
        `${BASE_URL}/ai-service/agent/taskedIdBasedOnComments`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { taskId: task.id },
        },
      );
      setCommentsData(response.data || []);
      setViewModalVisible(true);
    } catch (error) {
      console.error("View Comments Error:", error);
      message.error("Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "S.No",
      key: "serial",
      align: "center" as const,
      render: (_: any, __: Task, index: number) =>
        index + 1 + (currentPage - 1) * pageSize,
    },

    {
      title: "Task Information",
      key: "task_info",
      align: "center" as const,
      render: (_: any, record: any) => {
        const hasValidAssignee =
          Array.isArray(record.taskAssignTo) &&
          record.taskAssignTo.length > 0 &&
          record.taskAssignTo.some((a: any) => a && a.trim() !== "");

        const assignedToText = hasValidAssignee
          ? Array.isArray(record.taskAssignTo)
            ? record.taskAssignTo.join(", ")
            : record.taskAssignTo
          : "";

        return (
          <div
            style={{
              padding: "8px 12px",
              textAlign: "left",
              display: "inline-block",
              minWidth: 180,
            }}
          >
            <div style={{ fontWeight: 600, color: "#351664", fontSize: 15 }}>
              Task ID:{" "}
              <span style={{ color: "rgb(0, 140, 186)" }}>
                {record.id ? `#${record.id.slice(-4)}` : ""}
              </span>
            </div>
            <div style={{ color: "#555", fontSize: 13 }}>
              Assigned By:{" "}
              <span style={{ fontWeight: 500, color: "#1ab394" }}>
                {record.taskAssignBy || ""}
              </span>
            </div>
            <div style={{ color: "#555", fontSize: 13 }}>
              Assigned To:{" "}
              <span style={{ fontWeight: 500, color: "#008cba" }}>
                {assignedToText}
              </span>
            </div>
          </div>
        );
      },
    },

    {
      title: "Task Name",
      dataIndex: "taskName",
      key: "taskName",
      align: "center" as const,
      render: (text: any) => (
        <div
          style={{
            width: "300px",
            maxWidth: "300px",
            WebkitBoxOrient: "vertical",
            display: "-webkit-box",
            textAlign: "center",
            margin: "0 auto",
            maxHeight: "11em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineClamp: 3,
          }}
          title={text}
        >
          {text}
        </div>
      ),
    },

    {
      title: "Task Timeline",
      key: "task_timeline",
      align: "center" as const,
      render: (_: any, record: any) => {
        const { tastCreatedDate, status } = record;

        return (
          <div
            style={{
              padding: "8px 12px",
              textAlign: "left",
              display: "inline-block",
              minWidth: 170,
            }}
          >
            <div style={{ color: "#555", fontSize: 13 }}>
              Assigned Date:{" "}
              <span style={{ color: "#008cba", fontWeight: 500 }}>
                {tastCreatedDate ? formatDate(tastCreatedDate) : ""}
              </span>
            </div>

            <div style={{ color: "#555", fontSize: 13, marginTop: 4 }}>
              Status: {getStatusTag(status)}
            </div>
          </div>
        );
      },
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      align: "center" as const,
      render: (url: any) =>
        url ? (
          <Image
            width={80}
            height={80}
            src={url}
            style={{
              borderRadius: "4px",
              objectFit: "cover",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          />
        ) : (
          <Text type="secondary">No Image</Text>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center" as const,
      width: 260,
      render: (_: any, record: Task) => (
        <Space wrap style={{ justifyContent: "center" }}>
          {record.status?.toLowerCase() !== "completed" && (
            <Popconfirm
              title="Mark this task as completed?"
              onConfirm={() => handleStatusUpdate(record.id, "COMPLETED")}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                icon={<CheckOutlined />}
                style={{
                  backgroundColor: "#008cba",
                  borderColor: "#008cba",
                  borderRadius: 6,
                }}
                size="small"
              >
                Complete
              </Button>
            </Popconfirm>
          )}

          <Button
            icon={<CommentOutlined />}
            style={{
              background: "#1ab394",
              color: "white",
              borderColor: "#1ab394",
              borderRadius: 6,
            }}
            size="small"
            onClick={() => handleCommentsAdd(record)}
          >
            Add Comments
          </Button>

          <Button
            icon={<EyeOutlined />}
            style={{
              background: "#351664",
              color: "white",
              borderColor: "#351664",
              borderRadius: 6,
            }}
            size="small"
            onClick={() => handleViewComments(record)}
          >
            View Comments
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <UserPanelLayout>
      <div style={{ padding: 20 }}>
        <Row
          justify="space-between"
          align="middle"
          gutter={[16, 16]}
          style={{ marginBottom: 20 }}
        >
          <Col xs={24} sm={12}>
            <Text strong style={{ fontSize: 20, color: "#008cba" }}>
              Assigned Tasks Whatsapp
            </Text>
          </Col>

          <Col xs={24} sm={8}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search names,tasks..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
        </Row>
        <Segmented
          block
          value={statusFilter}
          onChange={(val: any) => setStatusFilter(val as StatusFilter)}
          options={[
            { label: `All (${statusCounts.ALL})`, value: "ALL" },
            { label: `Assigned (${statusCounts.ASSIGNED})`, value: "ASSIGNED" },
            {
              label: `Completed (${statusCounts.COMPLETED})`,
              value: "COMPLETED",
            },
            // { label: `Rejected (${statusCounts.REJECTED})`, value: "REJECTED" },
            // { label: `Deleted (${statusCounts.DELETED})`, value: "DELETED" },
          ]}
        />

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 300,
            }}
          >
            <Spin tip="Loading tasks..." size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredTasks}
            rowKey={(record) => record.id}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              responsive: true,
              showSizeChanger: true,
              pageSizeOptions: ["20", "30", "40", "50"],
              size: "small",
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} tasks`,
              onChange: (page, size) => {
                setCurrentPage(page);
                if (size && size !== pageSize) setPageSize(size);
              },
              onShowSizeChange: (_page, size) => {
                setCurrentPage(1);
                setPageSize(size);
              },
            }}
            bordered
            scroll={{ x: true, y: 600 }}
            style={{ width: "100%" }}
          />
        )}
      </div>

      {/* View Comments Modal */}
      <Modal
        title={`Task Comments - ${
          selectedTask ? `#${selectedTask.id.slice(-4)}` : ""
        }`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={600}
      >
        {commentsData.length > 0 ? (
          commentsData.map((comment, index) => (
            <div
              key={index}
              style={{
                background: "#f9f9f9",
                borderLeft: "4px solid #008cba",
                borderRadius: 6,
                padding: "10px 12px",
                marginBottom: 10,
              }}
            >
              <p style={{ margin: 0, fontWeight: 500, color: "#351664" }}>
                Comment By:{" "}
                <span style={{ color: "#1ab394" }}>{comment.commentsBy}</span>
              </p>
              <p style={{ margin: "4px 0", color: "#333" }}>
                {comment.comments}
              </p>
              <Tag
                color={
                  comment.status?.toLowerCase() === "completed"
                    ? "green"
                    : comment.status?.toLowerCase() === "rejected"
                      ? "red"
                      : "blue"
                }
              >
                {comment.status || ""}
              </Tag>
            </div>
          ))
        ) : (
          <Text type="secondary">No comments found for this task.</Text>
        )}
      </Modal>

      {/* Add Comments Modal */}
      <Modal
        title={`Add Comments for Task ${
          selectedTask ? `#${selectedTask.id.slice(-4)}` : ""
        }`}
        open={commentsModalVisible}
        onCancel={() => setCommentsModalVisible(false)}
        onOk={handleCommentsUpdate}
        okText="Add Comments"
        okButtonProps={{
          style: {
            backgroundColor: "#008cba",
            color: "white",
            border: "none",
            fontWeight: 500,
          },
        }}
      >
        <p style={{ marginBottom: 8, fontWeight: 500 }}>Enter Comments:</p>
        <Input.TextArea
          rows={3}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Enter your comments"
        />
      </Modal>
    </UserPanelLayout>
  );
};

export default AdminTasks;
