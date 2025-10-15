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
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import UserPanelLayout from "./UserPanelLayout";
import BASE_URL from "../Config";

const { Text } = Typography;
const { Search } = Input;

// Define Task type
interface Task {
  taskAssignBy: string;
  taskAssignTo: string[];
  taskName: string;
  status: string;
  image?: string | null;
}

const AdminTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const accessToken = localStorage.getItem("token");

  // Fetch API data
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Task[]>(
        `${BASE_URL}/ai-service/agent/getAllMessagesFromGroup`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const reversedTasks = response.data.slice().reverse();
      setTasks(reversedTasks);
      setFilteredTasks(reversedTasks);
    } catch (error) {
      message.error("Failed to fetch tasks");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Search function
  const handleSearch = (value: string) => {
    if (!value) {
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

  // Table columns
  const columns = [
    {
      title: "S.No",
      key: "serial",
      align: "center" as const,
      width: 60,
      render: (_text: any, _record: Task, index: number) => index + 1,
    },
    {
      title: "Assigned By",
      dataIndex: "taskAssignBy",
      key: "taskAssignBy",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Assigned To",
      dataIndex: "taskAssignTo",
      key: "taskAssignTo",
      align: "center" as const,
      width: 180,
      render: (assigned: string[]) => assigned?.join(", ") || "-",
    },
    {
      title: "Task Name",
      dataIndex: "taskName",
      key: "taskName",
      align: "center" as const,
      width: 250,
    
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      width: 120,
      render: (status: string) => {
        let color = "orange";
        if (status === "assigned") color = "#008cba";
        else if (status === "completed") color = "green";

        return (
          <Text style={{ color, fontWeight: 500, textTransform: "capitalize" }}>
            {status}
          </Text>
        );
      },
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      align: "center" as const,
      width: 120,
      render: (url?: string | null) =>
        url ? (
          <Image
            width={80}
            src={url}
            style={{ cursor: "pointer" }}
            preview={{
              mask: <Text style={{ color: "#fff" }}>Click to Preview</Text>,
            }}
          />
        ) : (
          "-"
        ),
    },
  ];

  return (
    <UserPanelLayout>
      <div style={{ padding: 20 }}>
        {/* Header with left text and right search */}
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 20 }}
        >
          <Col xs={24} sm={12} md={12} lg={12}>
            <Text strong style={{ fontSize: 18 }}>
              Assigned Tasks WhatsApp
            </Text>
          </Col>
          <Col
            xs={24}
            sm={12}
            md={12}
            lg={12}
            style={{ textAlign: "right", marginTop: 10 }}
          >
            <Search
              placeholder="Search tasks or assignees..."
              allowClear
              enterButton={
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#008cba",
                    borderColor: "#008cba",
                    color: "#fff",
                  }}
                >
                  <SearchOutlined style={{ color: "#fff" }} /> Search
                </Button>
              }
              size="middle"
              onSearch={handleSearch}
              onChange={(e) => {
                if (!e.target.value) handleSearch("");
              }}
              style={{ maxWidth: 300 }}
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
              minHeight: "300px", // adjust as needed
            }}
          >
            <Spin tip="Loading tasks..." size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredTasks}
            rowKey={(_record, index) =>
              index !== undefined ? index.toString() : ""
            }
            pagination={{ pageSize: 100 }}
            bordered
            scroll={{ x: true }}
          />
        )}
      </div>
    </UserPanelLayout>
  );
};

export default AdminTasks;
