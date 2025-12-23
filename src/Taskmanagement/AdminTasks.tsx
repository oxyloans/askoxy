// /src/AdminTasks.tsx
import React, { useEffect, useState } from "react";
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
  Popconfirm,
  Tag,
  Modal,
 
  Space,
} from "antd";
import {
  SearchOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
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
  taskAssignTo: string[];
  taskName: string;
  taskAssignedDate: string;
  taskCompleteDate: string;
}

const AdminTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const accessToken = sessionStorage.getItem("accessToken");
  const userId = sessionStorage.getItem("userId") || "";
  const [searchText, setSearchText] = useState(""); // ✅ added missing state
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [commentsModalVisible, setCommentsModalVisible] = useState(false);
    const [commentsData, setCommentsData] = useState<CommentType[]>([]);
    const [comments, setComments] = useState("");
  // ✅ Fetch tasks
  
const formatDate = (dateString:string) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    if (isNaN(date as any)) return dateString; // if not a valid date

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
      `${BASE_URL}/ai-service/agent/showingTaskBasedOnUserId?userId=${userId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    console.log("API Response:", response.data);

    // normalize response
    const tasksArray = Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data.data)
      ? response.data.data
      : [];

    const reversedTasks = tasksArray.slice().reverse();

    const validTasks = reversedTasks.filter((task: any) => {
      const assignedArray = Array.isArray(task.taskAssignTo)
        ? task.taskAssignTo
        : task.taskAssignTo
        ? [task.taskAssignTo]
        : [];
      const hasValidAssignee = assignedArray.length > 0;
      const hasValidTaskName = task.taskName && task.taskName.trim() !== "";
      return hasValidAssignee && hasValidTaskName;
    });

    setTasks(validTasks);
    setFilteredTasks(validTasks);
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

  // ✅ Search tasks
  const handleSearch = (value: string) => {
    setSearchText(value);
    if (!value.trim()) {
      setFilteredTasks(tasks);
      return;
    }

    const filtered = tasks.filter(
      (task) =>
        task.taskAssignBy?.toLowerCase().includes(value.toLowerCase()) ||
        task.taskAssignTo?.some((t) =>
          t.toLowerCase().includes(value.toLowerCase())
        ) ||
        task.taskName?.toLowerCase().includes(value.toLowerCase()) ||
        task.status?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredTasks(filtered);
  };

  // ✅ Update task status
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setLoading(true);
    try {
      await axios.patch(
        `${BASE_URL}/ai-service/agent/taskUpdate?id=${id}&status=${newStatus}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
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

  // ✅ Status Tag
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
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    message.success("Comments added successfully!");
    setCommentsModalVisible(false);
    setComments("");
    fetchTasks();
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
      }
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

  // ✅ Table columns
  const columns = [
    {
      title: "S.No",
      key: "serial",
      align: "center" as const,

      render: (_: any, __: Task, index: number) => index + 1,
    },

    {
      title: "Task Information",
      key: "task_info",
      align: "center" as const,
      render: (_: any, record: any) => {
        // Handle assignedTo array
        

       

        return (
          <div
            style={{
              backgroundColor: "#f9f9f9",

              borderRadius: 8,
              padding: "8px 12px",
              textAlign: "left",
              display: "inline-block",
              minWidth: 200,
            }}
          >
            <div style={{ fontWeight: 600, color: "#351664", fontSize: 15 }}>
              Task ID:{" "}
              <span style={{ color: "#008cba" }}>
                {record.id ? `#${record.id.slice(-4)}` : "N/A"}
              </span>
            </div>
            <div style={{ color: "#555", fontSize: 13 }}>
              Assigned By:{" "}
              <span style={{ fontWeight: 500, color: "#1ab394" }}>
                {record.taskAssignBy || "N/A"}
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
            width: "320px", // enforce width
            maxWidth: "320px",

            WebkitBoxOrient: "vertical",
            display: "-webkit-box",
            textAlign: "center",
            margin: "0 auto",
            maxHeight: " 11em", // approx 3 lines
            overflowX: "auto", // horizontal scroll
          }}
          title={text} // show full text on hover
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
        const { taskAssignedDate, taskCompleteDate, status } = record;

        return (
          <div
            style={{
              backgroundColor: "#f9f9f9",

              borderRadius: 8,
              padding: "8px 12px",
              textAlign: "left",
              display: "inline-block",
              minWidth: 170,
            }}
          >
            <div style={{ fontWeight: 600, color: "#351664", fontSize: 15 }}>
              Task Timeline
            </div>

            <div style={{ color: "#555", fontSize: 13 }}>
              Assigned Date:{" "}
              <span style={{ color: "#008cba", fontWeight: 500 }}>
                {taskAssignedDate ? formatDate(taskAssignedDate) : "N/A"}
              </span>
            </div>

            <div style={{ color: "#555", fontSize: 13 }}>
              Completed Date:{" "}
              <span
                style={{
                  color: taskCompleteDate ? "#1ab394" : "#faad14",
                  fontWeight: 500,
                }}
              >
                {taskCompleteDate ? formatDate(taskCompleteDate) : "N/A"}
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
          {record.status !== "completed" && (
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

          {record.status !== "rejected" && (
            <Popconfirm
              title="Reject this task?"
              onConfirm={() => handleStatusUpdate(record.id, "REJECTED")}
              okText="Yes"
              cancelText="No"
            >
              <Button
                danger
                icon={<CloseOutlined />}
                style={{ borderRadius: 6 }}
                size="small"
              >
                Reject
              </Button>
            </Popconfirm>
          )}

          <Popconfirm
            title="Are you sure you want to delete this task?"
            onConfirm={() => handleStatusUpdate(record.id, "DELETED")}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              style={{
                backgroundColor: "#6b7280",
                color: "#fff",
                borderRadius: 6,
              }}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>

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
            Add
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
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <UserPanelLayout>
      <div style={{ padding: 20 }}>
        {/* Header */}
        <Row
          justify="space-between"
          align="middle"
          gutter={[16, 16]}
          style={{ marginBottom: 20 }}
        >
          <Col xs={24} sm={12}>
            <Text strong style={{ fontSize: 20, color: "#1e3a8a" }}>
              Assigned Tasks Management
            </Text>
          </Col>

          <Col xs={24} sm={8}>
            <Input
              prefix={<SearchOutlined />} // icon color white
              placeholder="Search tasks..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
        </Row>

        {/* Table */}
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
              pageSize: 10,
              responsive: true,
            }}
            bordered
            scroll={{ x: "true" }}
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
                {comment.status || "N/A"}
              </Tag>
            </div>
          ))
        ) : (
          <Text type="secondary">No comments found for this task.</Text>
        )}
      </Modal>

      {/* Add Comments Modal */}
      <Modal
        title="Add Comments"
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
