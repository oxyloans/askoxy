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
  Card,
 
  Space,
} from "antd";
import {
  SearchOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import UserPanelLayout from "./UserPanelLayout";
import BASE_URL from "../Config";

const { Text } = Typography;


interface Task {
  id: string;
  image?: string | null;
  status: string;
  taskAssignBy: string;
  taskAssignTo: string[];
  taskName: string;
}

const AdminTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const accessToken = sessionStorage.getItem("accessToken");
  const userId = sessionStorage.getItem("userId") || "";
  const [searchText, setSearchText] = useState(""); // ✅ added missing state
  // ✅ Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Task[]>(
        `${BASE_URL}/ai-service/agent/showingTaskBasedOnUserId?userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const reversedTasks = response.data.slice().reverse();
      setTasks(reversedTasks);
      setFilteredTasks(reversedTasks);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch tasks");
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

    switch (status.toLowerCase()) {
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
        color = "blue";
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

  // ✅ Table columns
  const columns = [
    {
      title: "S.No",
      key: "serial",
      align: "center" as const,
      width: 80,
      render: (_: any, __: Task, index: number) => index + 1,
    },
    {
      title: "Assigned By",
      dataIndex: "taskAssignBy",
      key: "taskAssignBy",
      align: "center" as const,
      render: (text: any) => (
        <Text style={{ display: "block", textAlign: "center" }} strong>
          {" "}
          {text}{" "}
        </Text>
      ),
    },
    {
      title: "Assigned To",
      dataIndex: "taskAssignTo",
      key: "taskAssignTo",
      align: "center" as const,
      render: (assignees: string[]) => (
        <div style={{ textAlign: "center" }}>
          {" "}
          {assignees && assignees.length > 0
            ? assignees.map((a, i) => (
                <Tag color="geekblue" key={i}>
                  {" "}
                  {a}{" "}
                </Tag>
              ))
            : "—"}{" "}
        </div>
      ),
    },
    {
      title: "Task Name",
      dataIndex: "taskName",
      key: "taskName",
      align: "center" as const,
      render: (text: any) => (
        <Text style={{ display: "block", textAlign: "center" }}>{text}</Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (status: string) => getStatusTag(status),
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
            >
              Delete
            </Button>
          </Popconfirm>
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
              prefix={<SearchOutlined  />} // icon color white
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
            <Spin tip="Loading tasks..." size="small" />
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
          />
        )}
      </div>
    </UserPanelLayout>
  );
};

export default AdminTasks;
