import React, { useState, useEffect } from "react";
import UserPanelLayout from "./UserPanelLayout";
import BASE_URL from "../Config";
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
  Input,
  Space,
  Radio,
  Form,
} from "antd";
import {
  CalendarOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileSearchOutlined,
  UserOutlined,
  SearchOutlined,
  FileTextOutlined,
  DownOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Search } = Input;

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
  endOftheDay: string | null;
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

interface EditFormValues {
  planOftheDay?: string;
  endOftheDay?: string;
}

// Consistent styles for all buttons
const buttonStyle = {
  width: "120px",
  height: "40px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const editButtonStyle = {
  backgroundColor: "#008cba",
  color: "white",
  borderColor: "#008cba",
};

const AllStatusPage: React.FC = () => {
  const [editForm] = Form.useForm<EditFormValues>();
  const [status, setStatus] = useState<string>("PENDING"); // Default status changed to PENDING
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [activeTab, setActiveTab] = useState<string>("general");
  const [searchText, setSearchText] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<"plan" | "eod" | null>(null);
  const taskId = sessionStorage.getItem("taskId");

  useEffect(() => {
    // Get userId from localStorage
    const storedUserId = sessionStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // Effect for filtering tasks based on search text
  useEffect(() => {
    if (tasks.length > 0) {
      const filtered = tasks.filter((task) => {
        const searchLower = searchText.toLowerCase();
        return (
          (task.planOftheDay &&
            task.planOftheDay.toLowerCase().includes(searchLower)) ||
          (task.endOftheDay &&
            task.endOftheDay.toLowerCase().includes(searchLower)) ||
          (task.taskAssignedBy &&
            task.taskAssignedBy.toLowerCase().includes(searchLower)) ||
          (task.updatedBy && task.updatedBy.toLowerCase().includes(searchLower))
        );
      });

      // Apply sorting
      const sorted = sortTasks(filtered, sortOrder);
      setFilteredTasks(sorted);
    } else {
      setFilteredTasks([]);
    }
  }, [searchText, tasks, sortOrder]);

  const sortTasks = (tasksToSort: TaskData[], order: "asc" | "desc") => {
    return [...tasksToSort].sort((a, b) => {
      const dateA = new Date(a.planCreatedAt).getTime();
      const dateB = new Date(b.planCreatedAt).getTime();
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  const handleSortOrderChange = (order: "asc" | "desc") => {
    setSortOrder(order);
  };

  const handleUpdate = async (values: EditFormValues) => {
    if (!editingTaskId || !editingField) return;

    const field = editingField === "plan" ? "planOftheDay" : "endOftheDay";
    const payload = {
      id: editingTaskId,
      [field]: values[field as keyof EditFormValues] || "",
      taskStatus: "PENDING",
      userId: userId,
    };

    try {
      const response = await axios.patch(
        `${BASE_URL}/user-service/write/userTaskUpdate`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === editingTaskId
              ? {
                  ...task,
                  [field]: values[field as keyof EditFormValues] || "",
                }
              : task
          )
        );
        setFilteredTasks((prev) =>
          prev.map((task) =>
            task.id === editingTaskId
              ? {
                  ...task,
                  [field]: values[field as keyof EditFormValues] || "",
                }
              : task
          )
        );
        notification.success({
          message: "Success",
          description: `${
            editingField === "plan" ? "Plan of the Day" : "End of the Day"
          } updated successfully.`,
          placement: "topRight",
        });
        setEditingTaskId(null);
        setEditingField(null);
        editForm.resetFields();
      } else {
        notification.error({
          message: "Error",
          description: "Failed to update task.",
          placement: "topRight",
        });
      }
    } catch (error) {
      console.error("Error updating task:", error);
      notification.error({
        message: "Error",
        description: "An error occurred while updating the task.",
        placement: "topRight",
      });
    }
  };

  const handleEditPlan = (task: TaskData) => {
    setEditingTaskId(task.id);
    setEditingField("plan");
    editForm.setFieldsValue({ planOftheDay: task.planOftheDay });
  };

  const handleEditEod = (task: TaskData) => {
    setEditingTaskId(task.id);
    setEditingField("eod");
    editForm.setFieldsValue({ endOftheDay: task.endOftheDay ?? undefined });
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingField(null);
    editForm.resetFields();
  };

  const isEditingPlan = (taskId: string) =>
    editingTaskId === taskId && editingField === "plan";
  const isEditingEod = (taskId: string) =>
    editingTaskId === taskId && editingField === "eod";

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

      const sortedTasks = sortTasks(response.data, sortOrder);
      setTasks(sortedTasks);
      setFilteredTasks(sortedTasks);

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

      const sortedTasks = sortTasks(response.data, sortOrder);
      setTasks(sortedTasks);
      setFilteredTasks(sortedTasks);

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

  const handleSearch = (value: string) => {
    setSearchText(value);
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
    setTasks([]);
    setFilteredTasks([]);
    setSearchText("");
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
            {sortedResponses.map((response, index) => (
              <div
                key={response.id}
                className="mb-3 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Tag
                    color={response.updateBy === "ADMIN" ? "purple" : "blue"}
                  >
                    {response.updateBy === "ADMIN" ? "ADMIN" : "YOU"}
                  </Tag>
                

                  {response.adminFilePath && (
                    <div className="flex items-center ml-auto">
                      <FileTextOutlined className="text-blue-500 mr-1" />
                      <a
                        href={response.adminFilePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        {response.adminFileName || "View Attachment"}
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {response.pendingEod && (
                    <div className="bg-white p-2 rounded-md border border-gray-100">
                      <Text className="text-gray-600 text-xs block mb-1">
                        Employee Description:
                      </Text>
                      <Text className="text-gray-800 text-sm">
                        {response.pendingEod}
                      </Text>
                    </div>
                  )}

                  {response.adminDescription && (
                    <div className="bg-white p-2 rounded-md border border-gray-100">
                      <Text className="text-gray-600 text-xs block mb-1">
                        <InfoCircleOutlined className="mr-1" /> Admin
                        Description:
                      </Text>
                      <Paragraph
                        className="text-gray-800 text-sm"
                        ellipsis={{
                          rows: 2,
                          expandable: true,
                          symbol: "more",
                        }}
                      >
                        {response.adminDescription}
                      </Paragraph>
                    </div>
                  )}
                </div>
              </div>
            ))}
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
          {isEditingPlan(task.id) ? (
            <Form form={editForm} onFinish={handleUpdate} layout="vertical">
              <Form.Item
                name="planOftheDay"
                rules={[{ required: true, message: "Please enter your plan!" }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Enter plan of the day..."
                  maxLength={8000}
                  showCount
                />
              </Form.Item>
              <Space style={{ display: "flex", gap: 8 }}>
                <Button
                  htmlType="submit"
                  type="primary"
                  style={editButtonStyle}
                  icon={<EditOutlined />}
                >
                  Save Changes
                </Button>
                <Button onClick={handleCancelEdit}>Cancel</Button>
              </Space>
            </Form>
          ) : (
            <div className="max-h-32 overflow-y-auto bg-white p-3 rounded-md border border-gray-100">
              <Text className="whitespace-pre-wrap text-gray-700">
                {task.planOftheDay || "No plan recorded"}
              </Text>
            </div>
          )}
          {task.taskStatus === "PENDING" && !isEditingPlan(task.id) && (
            <Button
              onClick={() => handleEditPlan(task)}
              style={editButtonStyle}
              size="small"
              className="mt-2"
              icon={<EditOutlined />}
            >
              Edit Plan
            </Button>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <Text className="text-gray-600 font-medium block mb-2">
            End of the Day:
          </Text>
          {isEditingEod(task.id) ? (
            <Form form={editForm} onFinish={handleUpdate} layout="vertical">
              <Form.Item
                name="endOftheDay"
                rules={[
                  {
                    required: true,
                    message: "Please enter end of day report!",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Enter end of the day report..."
                  maxLength={8000}
                  showCount
                />
              </Form.Item>
              <Space style={{ display: "flex", gap: 8 }}>
                <Button
                  htmlType="submit"
                  type="primary"
                  style={editButtonStyle}
                  icon={<EditOutlined />}
                >
                  Save Changes
                </Button>
                <Button onClick={handleCancelEdit}>Cancel</Button>
              </Space>
            </Form>
          ) : (
            <div className="max-h-32 overflow-y-auto bg-white p-3 rounded-md border border-gray-100">
              <Text className="whitespace-pre-wrap text-gray-700">
                {task.endOftheDay || "No end-of-day report"}
              </Text>
            </div>
          )}
          {task.taskStatus === "PENDING" && !isEditingEod(task.id) && (
            <Button
              onClick={() => handleEditEod(task)}
              style={editButtonStyle}
              size="small"
              className="mt-2"
              icon={<EditOutlined />}
            >
              Edit EOD
            </Button>
          )}
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
          <Text>Updated: {formatDate(task.planUpdatedAt)}</Text>
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
            <Title level={4} className="text-black mb-1">
              Daily Activity Status
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

            <Card className="bg-gray-50 mb-4 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
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
                  <div>
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

                <div className="flex items-end">
                  <Button
                    type="primary"
                    onClick={
                      activeTab === "general" ? fetchAllTasks : fetchTasksByDate
                    }
                    className="bg-[#008CBA] shadow-sm mr-2"
                    style={buttonStyle}
                    icon={<SearchOutlined />}
                  >
                    Search
                  </Button>
                </div>
              </div>
            </Card>

            {/* Search and Sort Bar */}
            {(tasks.length > 0 || searchText) && (
              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <div className="mb-3 md:mb-0 w-full md:w-auto">
                  <Search
                    placeholder="Search in tasks..."
                    allowClear
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onSearch={handleSearch}
                    style={{ width: "100%", minWidth: "250px" }}
                  />
                </div>

                <div className="flex items-center">
                  <Text className="mr-2 text-gray-600">Sort by date:</Text>
                  <Radio.Group
                    value={sortOrder}
                    onChange={(e) => handleSortOrderChange(e.target.value)}
                    buttonStyle="solid"
                  >
                    <Radio.Button value="desc">
                      <Space>
                        <SortDescendingOutlined />
                        Newest
                      </Space>
                    </Radio.Button>
                    <Radio.Button value="asc">
                      <Space>
                        <SortAscendingOutlined />
                        Oldest
                      </Space>
                    </Radio.Button>
                  </Radio.Group>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center p-8 sm:p-16">
                <Spin size="small" />
                <Text className="mt-4 text-gray-500">Loading tasks...</Text>
              </div>
            ) : filteredTasks.length > 0 ? (
              <div>{filteredTasks.map(renderTaskCard)}</div>
            ) : tasks.length > 0 && searchText ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="text-center">
                    <Text className="text-gray-500 block mb-2">
                      No matching tasks found
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      Try changing your search criteria
                    </Text>
                  </div>
                }
                className="py-8 sm:py-16"
              />
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
