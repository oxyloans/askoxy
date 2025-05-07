import React, { useState, useEffect } from "react";
import axios from "axios";
import UserPanelLayout from "./UserPanelLayout";
import BASE_URL from "../Config";
import {
  Select,
  Button,
  Table,
  Spin,
  notification,
  Typography,
  Tag,
  Tooltip,
  Row,
  Col,
} from "antd";
import type { TableProps } from "antd";

const { Option } = Select;
const { Title } = Typography;

// Define the Task interface based on your actual API response structure
interface Task {
  taskcontent: string;
  createdby: string;
  taskassingnedby: string;
  admindocumentid: string;
  status: number;
  id: string;
  message: string;
}

interface TaskAssignedUserProps {
  // Add any props if needed
}

const TaskAssignedUser: React.FC<TaskAssignedUserProps> = () => {
  // List of users from your input
  const userList = [
    "GRISHMA",
    "GUNA",
    "GUNASHEKAR",
    "SAIKUMAR",
    "SREEJA",
    "GADISAI",
    "GUTTISAI",
    "NARENDRA",
    "MANEIAH",
    "VARALAKSHMI",
    "VIJAY",
    "NIHARIKA",
    "HARIPRIYA",
    "VINODH",
    "NAVEEN",
    "SRIDHAR",
    "SUBBU",
    "UDAY",
    "HARIBABU",
    "SUDHEESH",
    "ANUSHA",
    "DIVYA",
    "KARTHIK",
    "RAMADEVI",
    "BHARGAV",
    "PRATHIBHA",
    "JYOTHI",
    "HEMA",
    "RAMYAHR",
    "SURESH",
    "SUCHITHRA",
    "ARUNA",
    "VENKATESH",
    "RAKESH",
    "JHON",
    "MOUNIKA",
    "VANDANA",
    "GOPAL",
    "ANUSHAACCOUNT",
    "RADHAKRISHNA",
    "MADHU",
    "RAVI",
    "SAMPATH",
    "CHANDU",
    "SWATHI",
    "SHANTHI",
    "VISWA"
  ];

  const [selectedUser, setSelectedUser] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [displayUserList, setDisplayUserList] = useState<string[]>(userList);

  // Function to fetch tasks for a selected user
  const fetchUserTasks = async (userName: string) => {
    if (!userName) {
      notification.warning({
        message: "No User Selected",
        description: "Please select a user to view their tasks.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(
        `${BASE_URL}/user-service/write/gettask/${userName}`
      );

      if (response.data && Array.isArray(response.data)) {
        setTasks(response.data);
        if (response.data.length === 0) {
          notification.info({
            message: "No Tasks Found",
            description: `No tasks are assigned to ${userName}.`,
          });
        }
      } else {
        setTasks([]);
        notification.warning({
          message: "Unexpected Response Format",
          description: "The API response was not in the expected format.",
        });
      }
    } catch (error: any) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
      notification.error({
        message: "Error Fetching Tasks",
        description:
          error.response?.data?.message ||
          "Failed to load tasks for this user.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle user selection change
  const handleUserChange = (value: string) => {
    setSelectedUser(value);
    // When a user is selected, filter the displayUserList to only show that user
    if (value) {
      setDisplayUserList([value]);
    } else {
      // If selection is cleared, show all users again
      setDisplayUserList(userList);
    }
  };

  // Handle when dropdown opens
  const handleDropdownOpen = (open: boolean) => {
    if (open) {
      // When dropdown opens, show all users
      setDisplayUserList(userList);
    } else if (selectedUser) {
      // When dropdown closes and there's a selection, filter to just that user
      setDisplayUserList([selectedUser]);
    }
  };

  // Get status text and color based on status number
  const getStatusInfo = (status: number) => {
    switch (status) {
      case 1:
        return { text: "CREATED", color: "blue" };
      case 2:
        return { text: "ACCEPTED", color: "green" };
      case 3:
        return { text: "PENDING", color: "orange" };
      case 4:
        return { text: "COMPLETED", color: "purple" };
      default:
        return { text: "UNKNOWN", color: "gray" };
    }
  };

  // Function to get the last 4 digits of task ID
  const getLastFourDigits = (id: string) => {
    if (!id) return "N/A";

    // If id is less than 4 characters, return the whole string
    if (id.length <= 4) return id;

    // Otherwise return the last 4 characters
    return id.slice(-4);
  };

  // Task table columns based on the actual response structure
  const columns: TableProps<Task>["columns"] = [
    {
      title: "S.No",
      key: "serialNumber",
      width: 80,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Task ID",
      dataIndex: "id",
      key: "id",
      width: 120,
      ellipsis: true,
      align: "center",
      render: (id) => {
        // Show only last 4 digits of the task ID
        const shortId = getLastFourDigits(id);

        // Add tooltip showing full ID on hover
        return (
          <Tooltip title={`Full ID: ${id}`}>
            <span>#{shortId}</span>
          </Tooltip>
        );
      },
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Task Content",
      dataIndex: "taskcontent",
      key: "taskcontent",
      width: 300,
      align: "center",
      sorter: (a, b) => a.taskcontent.localeCompare(b.taskcontent),
    },
    {
      title: "Created By",
      dataIndex: "createdby",
      key: "createdby",
      width: 120,
      align: "center",
    },
    {
      title: "Assigned To",
      dataIndex: "taskassingnedby",
      key: "taskassingnedby",
      width: 120,
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 120,
      render: (status) => {
        const statusInfo = getStatusInfo(status);
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
  ];

  return (
    <UserPanelLayout>
      <div className="p-4">
        <Title level={3}>List of Tasks Assigned by Admin</Title>

        <Row gutter={16} className="mb-6">
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Select a your name"
              style={{ width: "100%" }}
              onChange={handleUserChange}
              value={selectedUser || undefined}
              showSearch
              onDropdownVisibleChange={handleDropdownOpen}
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {displayUserList.map((user) => (
                <Option key={user} value={user}>
                  {user}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Button
              type="primary"
              onClick={() => fetchUserTasks(selectedUser)}
              disabled={!selectedUser}
              block
            >
              View Tasks
            </Button>
          </Col>
        </Row>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="small" tip="Loading tasks..." />
          </div>
        ) : (
          <>
            {selectedUser && tasks.length > 0 && (
              <div className="mb-4">
                <Title level={4}>
                  Tasks for {selectedUser}: {tasks.length} found
                </Title>
              </div>
            )}

            <Table
              columns={columns}
              dataSource={tasks}
              rowKey="id"
              bordered
              scroll={{ x: "max-content" }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50"],
              }}
              locale={{
                emptyText: selectedUser
                  ? "No tasks found for this user"
                  : "Select a user to view tasks",
              }}
            />
          </>
        )}
      </div>
    </UserPanelLayout>
  );
};

export default TaskAssignedUser;
