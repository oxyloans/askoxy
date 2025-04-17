import React, { useState, useEffect } from "react";
import UserPanelLayout from "./UserPanelLayout";
import BASE_URL from "../../Config";
import axios from "axios";
import {
  Card,
  Typography,
  Select,
  Button,
  Spin,
  Empty,
  Divider,
  DatePicker,
  Tabs,
  Badge,
  notification,
  Tag,
  Avatar,
  Collapse,
  Timeline,
} from "antd";
import {
  CalendarOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileSearchOutlined,
  UserOutlined,
  SearchOutlined,
  MessageOutlined,
  FileTextOutlined,
  DownOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;

interface UserQueryDocumentStatus {
  userDocumentId: string | null;
  userId: string | null;
  filePath: string | null;
  fileName: string | null;
  createdDate: string | null;
  adminDocumentId: string | null;
  adminUploadedFileName: string | null;
  adminUploadedFilePath: string | null;
  adminUploadCreatedDate: string | null;
  projectType: string | null;
}

interface PendingUserTaskResponse {
  taskId: string;
  pendingEod: string | null;
  createdAt: string | null;
  taskStatus: string;
  updateBy: string;
  planStat: string | null;
  userDocumentsId: string | null;
  userDocumentsCreatedAt: string | null;
  id: string;
  adminFilePath: string | null;
  adminFileName: string | null;
  adminFileCreatedDate: string | null;
  adminDocumentsId: string | null;
  adminDescription: string;
}

interface TaskData {
  userId: string;
  planOftheDay: string;
  planCreatedAt: string;
  planUpdatedAt: string | null;
  planStatus: string;
  updatedBy: string;
  taskStatus: string;
  taskAssignedBy: string;
  adminDocumentId: string | null;
  userDocumentCreatedAt: string | null;
  userDocumentId: string | null;
  adminDocumentUpdatedAt: string | null;
  adminComments: string | null;
  adminCommentsUpdatedBy: string | null;
  adminCommentsUpdatedAt: string | null;
  id: string;
  userQueryDocumentStatus: UserQueryDocumentStatus;
  pendingUserTaskResponse: PendingUserTaskResponse[];
  endOftheDay: string | null;
}

// Custom styles for consistent buttons
const buttonStyle = {
  width: "120px",
  height: "40px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const AllStatusPage: React.FC = () => {
  const [status, setStatus] = useState<string>("COMPLETED");
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [activeTab, setActiveTab] = useState<string>("general");
  const taskId = localStorage.getItem("taskId");

  useEffect(() => {
    // Get userId from localStorage
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const fetchAllTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/user-service/write/getAllTaskUpdates`,
        {
          taskStatus: status,
          userId: userId,
          id: taskId,
        },
        {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );

      setTasks(response.data);
      if (response.data.length === 0) {
        notification.info({
          message: "No Tasks Found",
          description: `No ${status.toLowerCase()} tasks found.`,
          placement: "topRight",
          icon: <FileSearchOutlined style={{ color: "#1890ff" }} />,
        });
      } else {
        notification.success({
          message: "Tasks Loaded",
          description: `Found ${
            response.data.length
          } ${status.toLowerCase()} tasks.`,
          placement: "topRight",
          duration: 3,
          icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        });
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      notification.error({
        message: "Error Fetching Tasks",
        description: "Failed to fetch tasks. Please try again later.",
        placement: "topRight",
        duration: 4,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTasksByDate = async () => {
    if (!selectedDate) {
      notification.warning({
        message: "Missing Date",
        description: "Please select a date.",
        placement: "topRight",
        duration: 3,
      });
      return;
    }

    setLoading(true);
    try {
      const formattedDate = selectedDate.format("YYYY-MM-DD");

      const response = await axios.post(
        `${BASE_URL}/user-service/write/get-task-by-date`,
        {
          taskStatus: status,
          specificDate: formattedDate,
          userId: userId,
        },
        {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );

      setTasks(response.data);
      if (response.data.length === 0) {
        notification.info({
          message: "No Tasks Found",
          description: `No ${status.toLowerCase()} tasks found for ${formattedDate}.`,
          placement: "topRight",
          duration: 3,
          icon: <FileSearchOutlined style={{ color: "#1890ff" }} />,
        });
      } else {
        notification.success({
          message: "Tasks Found",
          description: `Found ${response.data.length} tasks for ${formattedDate}.`,
          placement: "topRight",
          duration: 3,
          icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        });
      }
    } catch (error) {
      console.error("Error fetching tasks by date:", error);
      notification.error({
        message: "Fetch Failed",
        description: "Failed to fetch tasks. Please try again later.",
        placement: "topRight",
        duration: 4,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setSelectedDate(date);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setTasks([]); // Clear previous results when switching tabs
  };

  const renderPendingResponses = (responses: PendingUserTaskResponse[]) => {
    if (!responses || responses.length === 0) return null;

    // Sort responses by createdAt date in descending order (newest first)
    const sortedResponses = [...responses].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    return (
      <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => (
            <DownOutlined rotate={isActive ? 180 : 0} />
          )}
          className="bg-transparent"
          defaultActiveKey={["1"]}
        >
          <Panel
            header={
              <div className="flex items-center text-blue-600">
                <HistoryOutlined className="mr-2" />
                <Text strong>History & Updates ({sortedResponses.length})</Text>
              </div>
            }
            key="1"
            className="bg-white rounded-md mb-2 shadow-sm"
          >
            <Timeline>
              {sortedResponses.map((response, index) => (
                <Timeline.Item
                  key={response.id}
                  color={response.pendingEod ? "blue" : "gray"}
                >
                  <Card
                    className={`mb-3 border-l-4 ${
                      response.pendingEod
                        ? "border-l-blue-400"
                        : "border-l-gray-300"
                    }`}
                    size="small"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        {response.pendingEod && (
                          <>
                            <Text className="text-gray-600 block mb-1">
                              Response Update:
                            </Text>
                            <Text className="text-gray-800">
                              {response.pendingEod || "No update provided"}
                            </Text>
                          </>
                        )}

                        {response.adminDescription && (
                          <div
                            className={
                              response.pendingEod
                                ? "mt-3 pt-3 border-t border-gray-100"
                                : ""
                            }
                          >
                            <Text className="text-gray-600 block mb-1">
                              <InfoCircleOutlined className="mr-1" /> Admin
                              Description:
                            </Text>
                            <Paragraph
                              className="text-gray-800 bg-gray-50 p-2 rounded-md border border-gray-100"
                              ellipsis={{
                                rows: 3,
                                expandable: true,
                                symbol: "more",
                              }}
                            >
                              {response.adminDescription}
                            </Paragraph>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex flex-col justify-between h-full">
                          <div>
                            <Text className="text-gray-600 block mb-1">
                              Updated By:
                            </Text>
                            <Tag
                              color={
                                response.updateBy === "ADMIN"
                                  ? "purple"
                                  : "blue"
                              }
                            >
                              {response.updateBy || "N/A"}
                            </Tag>
                          </div>
                          <div className="mt-2">
                            <Text className="text-gray-600 block mb-1">
                              Created At:
                            </Text>
                            <Text className="text-gray-800">
                              {formatDate(response.createdAt)}
                            </Text>
                          </div>
                        </div>
                      </div>
                    </div>

                    {response.adminFilePath && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center">
                          <FileTextOutlined className="text-blue-500 mr-2" />
                          <a
                            href={response.adminFilePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            {response.adminFileName || "View Attachment"}
                          </a>
                          <Text className="text-xs text-gray-500 ml-3">
                            {response.adminFileCreatedDate
                              ? formatDate(response.adminFileCreatedDate)
                              : ""}
                          </Text>
                        </div>
                      </div>
                    )}
                  </Card>
                </Timeline.Item>
              ))}
            </Timeline>
          </Panel>
        </Collapse>
      </div>
    );
  };

  const renderTaskCard = (task: TaskData) => (
    <Card
      key={task.id}
      className="mb-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
      headStyle={{
        backgroundColor:
          task.taskStatus === "COMPLETED" ? "#f6ffed" : "#fff7e6",
        borderBottom: `1px solid ${
          task.taskStatus === "COMPLETED" ? "#b7eb8f" : "#ffe58f"
        }`,
        borderRadius: "8px 8px 0 0",
        padding: "12px 20px",
      }}
      bodyStyle={{ padding: "16px 20px" }}
      title={
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <Avatar
              icon={<UserOutlined />}
              style={{
                backgroundColor:
                  task.taskStatus === "COMPLETED" ? "#52c41a" : "#faad14",
                color: "white",
              }}
            />
            <div>
              <Text strong className="text-gray-800 text-lg">
                {task.taskAssignedBy}
              </Text>
              <Text className="text-gray-500 text-sm block sm:inline sm:ml-2">
                Updated by: {task.updatedBy}
              </Text>
            </div>
          </div>
          <Badge
            status={task.taskStatus === "COMPLETED" ? "success" : "warning"}
            text={
              <Tag
                color={task.taskStatus === "COMPLETED" ? "success" : "warning"}
                icon={
                  task.taskStatus === "COMPLETED" ? (
                    <CheckCircleOutlined />
                  ) : (
                    <ClockCircleOutlined />
                  )
                }
              >
                {task.taskStatus}
              </Tag>
            }
          />
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <Text className="text-gray-600 font-medium block mb-2">
            Plan of the Day:
          </Text>
          <div className="max-h-32 overflow-y-auto bg-white p-3 rounded-md border border-gray-100">
            <Text className="whitespace-pre-wrap text-gray-700">
              {task.planOftheDay || "No plan recorded"}
            </Text>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <Text className="text-gray-600 font-medium block mb-2">
            End of the Day:
          </Text>
          <div className="max-h-32 overflow-y-auto bg-white p-3 rounded-md border border-gray-100">
            <Text className="whitespace-pre-wrap text-gray-700">
              {task.endOftheDay || "No end-of-day report"}
            </Text>
          </div>
        </div>
      </div>

      {task.pendingUserTaskResponse &&
        task.pendingUserTaskResponse.length > 0 &&
        renderPendingResponses(task.pendingUserTaskResponse)}

      <Divider className="my-3" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-gray-500">
          <CalendarOutlined />
          <Text>Created: {formatDate(task.planCreatedAt)}</Text>
        </div>

        <div className="flex items-center gap-2 text-gray-500">
          <CalendarOutlined />
          <Text>
            Updated: {formatDate(task.planUpdatedAt || task.planCreatedAt)}
          </Text>
        </div>
      </div>
    </Card>
  );

  return (
    <UserPanelLayout>
      <div className="p-2 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
        <Card
          className="shadow-md rounded-lg overflow-hidden border-0"
          bodyStyle={{ padding: 0 }}
        >
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 text-black">
            <Title level={2} className="text-black mb-1">
              Task Status
            </Title>
          </div>

          <div className="p-2 sm:p-4">
            <Tabs activeKey={activeTab} onChange={handleTabChange} type="card">
              <TabPane
                tab={
                  <span>
                    <FileSearchOutlined className="mr-2" />
                    All Tasks
                  </span>
                }
                key="general"
              />
              <TabPane
                tab={
                  <span>
                    <CalendarOutlined className="mr-2" />
                    Tasks By Date
                  </span>
                }
                key="byDate"
              />
            </Tabs>

            <Card className="bg-gray-50 mb-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="flex-1 sm:max-w-xs">
                  <Text className="text-gray-600 block mb-1 font-medium">
                    <FilterOutlined className="mr-1" /> Status Filter
                  </Text>
                  <Select
                    value={status}
                    onChange={handleStatusChange}
                    className="w-full"
                    size="middle"
                    style={{ height: "40px" }}
                  >
                    <Option value="PENDING">
                      <div className="flex items-center">
                        <ClockCircleOutlined className="text-orange-500 mr-2" />
                        <span>PENDING</span>
                      </div>
                    </Option>
                    <Option value="COMPLETED">
                      <div className="flex items-center">
                        <CheckCircleOutlined className="text-green-500 mr-2" />
                        <span>COMPLETED</span>
                      </div>
                    </Option>
                  </Select>
                </div>

                {activeTab === "byDate" && (
                  <div className="flex-1 sm:max-w-xs">
                    <Text className="text-gray-600 block mb-1 font-medium">
                      <CalendarOutlined className="mr-1" /> Select Date
                    </Text>
                    <DatePicker
                      value={selectedDate}
                      onChange={handleDateChange}
                      className="w-full"
                      style={{ height: "40px" }}
                    />
                  </div>
                )}

                <div className="mt-2 sm:mt-0">
                  <Button
                    type="primary"
                    onClick={
                      activeTab === "general" ? fetchAllTasks : fetchTasksByDate
                    }
                    className="bg-[#008CBA] shadow-sm w-full sm:w-auto"
                    style={{ ...buttonStyle, width: "100%" }}
                    icon={<SearchOutlined />}
                  >
                    Search
                  </Button>
                </div>
              </div>
            </Card>

            {loading ? (
              <div className="flex flex-col items-center justify-center p-8 sm:p-16">
                <Spin size="large" />
                <Text className="mt-4 text-gray-500">Loading tasks...</Text>
              </div>
            ) : tasks.length > 0 ? (
              <div>{tasks.map(renderTaskCard)}</div>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="text-center">
                    <Text className="text-gray-500 block mb-2">
                      No tasks found
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      Use the filters above to search for tasks
                    </Text>
                  </div>
                }
                className="py-8 sm:py-16"
              />
            )}
          </div>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

export default AllStatusPage;
