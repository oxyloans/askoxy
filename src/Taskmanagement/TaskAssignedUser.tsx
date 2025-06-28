import React, { useState } from "react";
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

interface Task {
  taskcontent: string;
  createdby: string;
  taskassingnedby: string;
  admindocumentid: string;
  status: number;
  id: string;
  message: string;
}

const TaskAssignedUser: React.FC = () => {
  const userList = [
    "akhila u",
    "Anusha",
    "Anusha Kowthavarapu",
    "Arla Aruna Jyothi",
    "Bhargav.M",
    "Darelli nagarani",
    "Dasi srilekha",
    "Dharmapuri Sai Krishna",
    "Divya",
    "Divyajyothi",
    "GOPALA KRISHNA MALLEBOINA",
    "Grishma",
    "Gudelli Gunashekar",
    "Gudelli Jhansi Rani",
    "Gutti Sai Kumar",
    "g venkata karthik",
    "Haribabu",
    "Haripriya Yerreddula",
    "Hemalatha",
    "Kandhikatla Ram kumar",
    "Krovi vamsi",
    "Labhishetty Sreeja",
    "M Vinod",
    "Maneiah",
    "Manikanta",
    "Matta madhu venkata durga prasad",
    "Megha",
    "Mounika",
    "Narendra Kumar Balijepalli",
    "Nava Jyothi Pattedi",
    "Naveen Pairala",
    "Niharika Pokuri",
    "Pragada Satya Madhavi",
    "Prameela Kovvali",
    "Prathibha",
    "Raga Ramya",
    "Ramadevi",
    "Ramesh Reddy",
    "RANGASAI",
    "Ravikiran s",
    "Sagarla suresh",
    "Sai Kumar Gadi",
    "Saikarthik Rathod",
    "sandhya",
    "Satyasri",
    "Shanthi",
    "Siddu venkata shiva narayana reddy",
    "Srilekha Kailasapu",
    "sridhar",
    "SUBASH SURE",
    "sudheesh",
    "swathi",
    "thulasi",
    "thulasiboda",
    "T.Tejaswini Reddy",
    "Uday Reddy",
    "UMA MAHESH",
    "Vandanapu Indu",
    "varalakshmi",
    "Varre venkat",
    "vijay dasari",
    "Vishnu",
    "Vishwateja Dharmapuri",
    "Zubeidha Begum",
  ];

  const [selectedUser, setSelectedUser] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [displayUserList, setDisplayUserList] = useState<string[]>(userList);

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

  const handleUserChange = (value: string) => {
    setSelectedUser(value);
    setDisplayUserList([value]);
  };

  const handleDropdownOpen = (open: boolean) => {
    if (open) {
      setDisplayUserList(userList);
    } else if (selectedUser) {
      setDisplayUserList([selectedUser]);
    }
  };

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

  const getLastFourDigits = (id: string) => {
    if (!id) return "N/A";
    return id.length <= 4 ? id : id.slice(-4);
  };

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
        const shortId = getLastFourDigits(id);
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
              placeholder="Select your name"
              style={{ width: "100%" }}
              onChange={handleUserChange}
              value={selectedUser || undefined}
              showSearch
              optionLabelProp="value"
              onDropdownVisibleChange={handleDropdownOpen}
              filterOption={(input, option) =>
                (option?.value as string)
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
