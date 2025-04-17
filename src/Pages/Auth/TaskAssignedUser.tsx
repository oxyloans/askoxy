import React, { useState, useEffect } from "react";
import axios from "axios";
import UserPanelLayout from "./UserPanelLayout";
import BASE_URL from "../../Config";
import {
  Select,
  Button,
  Table,
  Spin,
  notification,
  Typography,
  Tag,
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
    "VINOD",
    "NAVEEN",
    "SAIGADI",
    "VIJAY",
    "SRIDHAR",
    "GUNNA",
    "MANEIAH",
    "HARIPRIYA",
    "NIHARIKA",
    "SUDHEESH",
    "DIVYA",
    "ANUSHA",
    "SAIKRISHNA",
    "SREEJA",
    "GUNNASANKAR",
    "HARIBABU",
    "UDYA",
    "GOPAL",
    "KARTHIK",
    "GHRISHMA",
    "VARALAKSHMI",
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

  // Task table columns based on the actual response structure
  const columns: TableProps<Task>["columns"] = [
    {
      title: "Task ID",
      dataIndex: "id",
      key: "id",
      width: 250,
      ellipsis: true,
      align: "center",
    },
    {
      title: "Task Content",
      dataIndex: "taskcontent",
      key: "taskcontent",
      width: 300,
      align: "center",
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
      width: 100,
      render: (status) => (
        <Tag color={status === 1 ? "green" : status === 0 ? "orange" : "blue"}>
          {status === 1 ? "Active" : status === 0 ? "Pending" : "Unknown"}
        </Tag>
      ),
    },
  ];

  return (
    <UserPanelLayout>
      <div className="p-4">
        <Title level={3}>Task Assignments by User</Title>

        <div className="mb-6 flex items-center gap-4">
          <Select
            placeholder="Select a user"
            style={{ width: 200 }}
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

          <Button
            type="primary"
            onClick={() => fetchUserTasks(selectedUser)}
            disabled={!selectedUser}
          >
            View Tasks
          </Button>

          {selectedUser && (
            <Button
              onClick={() => {
                setSelectedUser("");
                setDisplayUserList(userList);
                setTasks([]);
              }}
            >
              Clear Selection
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" tip="Loading tasks..." />
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
