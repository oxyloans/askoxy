import React, { useState, useEffect } from "react";
import UserPanelLayout from "./UserPanelLayout";
import BASE_URL from "../Config";
import { employeeApi } from "../utils/axiosInstances";
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
  Tag,
  Avatar,
  Collapse,
  Input,
  Space,
  Radio,
  Form,
} from "antd";
import Swal from "sweetalert2";
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

interface PlanVideoData {
  planOfTheDay: string | null;
  endOfTheDay: string | null;
  userId: string;
  name: string | null;
  date: string;
}

interface EditFormValues {
  planOftheDay?: string;
  endOftheDay?: string;
}

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
  const [status, setStatus] = useState<string>("PENDING");
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
  const [planVideos, setPlanVideos] = useState<PlanVideoData[]>([]);
  const [loadingVideos, setLoadingVideos] = useState<boolean>(false);
  const [videoPageNo] = useState<number>(1);
  const [videoPageSize] = useState<number>(100);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");

    if (storedUserId) {
      setUserId(storedUserId);

      employeeApi
        .get(`${BASE_URL}/ai-service/agent/employeUserIdSaving`)
        .catch((error) =>
          console.error("Error calling employeUserIdSaving:", error),
        );
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchPlanVideos();
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    if (activeTab === "general") {
      fetchAllTasks();
    } else if (activeTab === "byDate" && selectedDate) {
      fetchTasksByDate();
    }
  }, [userId, status, activeTab, selectedDate]);

  useEffect(() => {
    if (tasks.length > 0) {
      const filtered = tasks.filter((task) => {
        const searchLower = searchText.toLowerCase();

        return (
          task.planOftheDay?.toLowerCase().includes(searchLower) ||
          task.endOftheDay?.toLowerCase().includes(searchLower) ||
          task.taskAssignedBy?.toLowerCase().includes(searchLower) ||
          task.updatedBy?.toLowerCase().includes(searchLower)
        );
      });

      setFilteredTasks(sortTasks(filtered, sortOrder));
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

  const handleUpdate = async (values: EditFormValues) => {
    if (!editingTaskId || !editingField) return;

    const field = editingField === "plan" ? "planOftheDay" : "endOftheDay";
    const rawValue = values[field as keyof EditFormValues]?.trim();

    if (!rawValue) {
      Swal.fire({ toast: true, position: "top-end", icon: "warning", title: "Empty spaces are not allowed. Please enter valid text.", showConfirmButton: false, timer: 3000, timerProgressBar: true });
      return;
    }

    const userName = sessionStorage.getItem("Name") || "";
    const value =
      editingField === "plan" && userName
        ? `${rawValue} - Plan by ${userName}`
        : rawValue;

    const currentTask = tasks.find((t) => t.id === editingTaskId);

    const payload = {
      id: editingTaskId,
      [field]: value,
      taskStatus: currentTask?.taskStatus || status,
      userId,
    };

    try {
      const response = await employeeApi.patch(
        `${BASE_URL}/user-service/write/userTaskUpdate`,
        payload,
      );

      if (response.data.success) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === editingTaskId
              ? {
                  ...task,
                  [field]: value,
                  taskStatus: currentTask?.taskStatus || status,
                }
              : task,
          ),
        );

        setFilteredTasks((prev) =>
          prev.map((task) =>
            task.id === editingTaskId
              ? {
                  ...task,
                  [field]: value,
                  taskStatus: currentTask?.taskStatus || status,
                }
              : task,
          ),
        );

        Swal.fire({ toast: true, position: "top-end", icon: "success", title: `${editingField === "plan" ? "Plan of the Day" : "End of the Day"} updated successfully.`, showConfirmButton: false, timer: 3000, timerProgressBar: true });

        setEditingTaskId(null);
        setEditingField(null);
        editForm.resetFields();
      } else {
        Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Failed to update task.", showConfirmButton: false, timer: 3000, timerProgressBar: true });
      }
    } catch (error) {
      console.error("Error updating task:", error);

      Swal.fire({ toast: true, position: "top-end", icon: "error", title: "An error occurred while updating the task.", showConfirmButton: false, timer: 3000, timerProgressBar: true });
    }
  };

  const handleEditPlan = (task: TaskData) => {
    const originalPlan = (task.planOftheDay || "").replace(
      /\s*-\s*Plan by\s+.*$/,
      "",
    );

    setEditingTaskId(task.id);
    setEditingField("plan");
    editForm.setFieldsValue({ planOftheDay: originalPlan });
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

  const fetchPlanVideos = async () => {
    setLoadingVideos(true);

    try {
      const response = await employeeApi.post(
        `${BASE_URL}/ai-service/agent/planOfTheDayBasedOnUserId`,
        {
          pageNo: videoPageNo,
          pageSize: videoPageSize,
          userId,
        },
      );

      if (response.data && response.data.length > 0) {
        setPlanVideos(response.data[0].list || []);
      } else {
        setPlanVideos([]);
      }
    } catch (error) {
      console.error("Error fetching plan videos:", error);
    } finally {
      setLoadingVideos(false);
    }
  };

  const isEditingPlan = (taskId: string) =>
    editingTaskId === taskId && editingField === "plan";

  const isEditingEod = (taskId: string) =>
    editingTaskId === taskId && editingField === "eod";

  const getVideoForDate = (date: string, type: "plan" | "eod") => {
    const video = planVideos.find((v) => v.date === date);

    if (!video) return null;

    return type === "plan" ? video.planOfTheDay : video.endOfTheDay;
  };

  const normalizeTaskList = (data: unknown): TaskData[] => {
    if (Array.isArray(data)) return data;

    if (data && typeof data === "object") {
      const payload = data as Record<string, unknown>;

      if (Array.isArray(payload.data)) return payload.data as TaskData[];
      if (Array.isArray(payload.list)) return payload.list as TaskData[];
      if (Array.isArray(payload.content)) return payload.content as TaskData[];
    }

    return [];
  };

  const getTaskDateKey = (planCreatedAt: string) =>
    dayjs(planCreatedAt).format("YYYY-MM-DD");

  const isMediaUrl = (value: string | null | undefined) => {
    if (!value?.trim()) return false;

    const trimmed = value.trim();
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi"];

    return (
      /^https?:\/\//i.test(trimmed) ||
      trimmed.includes("s3.") ||
      videoExtensions.some((ext) => trimmed.toLowerCase().includes(ext))
    );
  };

  const getPlanDisplay = (task: TaskData) => {
    const dateKey = getTaskDateKey(task.planCreatedAt);
    const videoFromApi = getVideoForDate(dateKey, "plan");

    if (isMediaUrl(task.planOftheDay)) {
      return { text: null, video: task.planOftheDay };
    }

    return { text: task.planOftheDay, video: videoFromApi };
  };

  const getEodDisplay = (task: TaskData) => {
    const dateKey = getTaskDateKey(task.planCreatedAt);
    const videoFromApi = getVideoForDate(dateKey, "eod");

    if (isMediaUrl(task.endOftheDay)) {
      return { text: null, video: task.endOftheDay };
    }

    return { text: task.endOftheDay, video: videoFromApi };
  };

  const canEditPlan = (task: TaskData) => {
    const { text } = getPlanDisplay(task);
    return !!text?.trim();
  };

  const canEditEod = (task: TaskData) => {
    const { text } = getEodDisplay(task);
    return !!text?.trim();
  };

  const renderMediaContent = (
    content: string | null,
    videoUrl: string | null,
    label: string,
  ) => {
    const hasVideo = isMediaUrl(videoUrl);
    const displayText =
      content?.trim() && !isMediaUrl(content) ? content.trim() : null;

    return (
      <div className="flex h-full flex-col gap-3">
        {displayText && (
          <div
            className={`overflow-y-auto rounded-lg border border-gray-200 bg-white p-3 ${
              hasVideo
                ? "h-[170px] sm:h-[185px] md:h-[200px]"
                : "min-h-[260px] flex-1"
            }`}
          >
            <Text className="whitespace-pre-wrap break-words text-[13px] leading-6 text-gray-700 sm:text-sm">
              {displayText}
            </Text>
          </div>
        )}

        {hasVideo && videoUrl && (
          <div className="rounded-lg border border-gray-200 bg-white p-2">
            <video
              controls
              playsInline
              preload="metadata"
              className="h-[180px] w-full rounded-md bg-black object-contain sm:h-[220px] md:h-[240px]"
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {!displayText && !hasVideo && (
          <div className="min-h-[260px] flex-1 overflow-y-auto rounded-lg border border-gray-200 bg-white p-3">
            <Text className="whitespace-pre-wrap break-words text-[13px] leading-6 text-gray-700 sm:text-sm">
              {`No ${label.toLowerCase()} recorded`}
            </Text>
          </div>
        )}
      </div>
    );
  };

  const fetchAllTasks = async () => {
    setLoading(true);

    try {
      const response = await employeeApi.post(
        `${BASE_URL}/user-service/write/getAllTaskUpdates`,
        {
          taskStatus: status,
          userId,
        },
      );

      const taskList = normalizeTaskList(response.data);
      const sortedTasks = sortTasks(taskList, sortOrder);

      setTasks(sortedTasks);
      setFilteredTasks(sortedTasks);

      if (taskList.length === 0) {
        Swal.fire({ toast: true, position: "top-end", icon: "info", title: `No ${status.toLowerCase()} tasks found.`, showConfirmButton: false, timer: 3000, timerProgressBar: true });
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);

      Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Failed to fetch tasks. Please try again later.", showConfirmButton: false, timer: 3000, timerProgressBar: true });
    } finally {
      setLoading(false);
    }
  };

  const fetchTasksByDate = async () => {
    if (!selectedDate) {
      Swal.fire({ toast: true, position: "top-end", icon: "warning", title: "Please select a date.", showConfirmButton: false, timer: 3000, timerProgressBar: true });
      return;
    }

    setLoading(true);

    try {
      const formattedDate = selectedDate.format("YYYY-MM-DD");

      const response = await employeeApi.post(
        `${BASE_URL}/user-service/write/get-task-by-date`,
        {
          taskStatus: status,
          specificDate: formattedDate,
          userId,
        },
      );

      const taskList = normalizeTaskList(response.data);
      const sortedTasks = sortTasks(taskList, sortOrder);

      setTasks(sortedTasks);
      setFilteredTasks(sortedTasks);

      if (taskList.length === 0) {
        Swal.fire({ toast: true, position: "top-end", icon: "info", title: `No ${status.toLowerCase()} tasks found for ${formattedDate}.`, showConfirmButton: false, timer: 3000, timerProgressBar: true });
      }
    } catch (error) {
      console.error("Error fetching tasks by date:", error);

      Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Failed to fetch tasks. Please try again later.", showConfirmButton: false, timer: 3000, timerProgressBar: true });
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
    setSearchText(value.trim());
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";

    try {
      return new Date(dateString).toLocaleString();
    } catch {
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

    const sortedResponses = [...responses].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

      return dateB - dateA;
    });

    return (
      <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => (
            <DownOutlined rotate={isActive ? 180 : 0} />
          )}
          className="bg-transparent"
        >
          <Panel
            header={
              <div className="flex items-center text-blue-600">
                <HistoryOutlined className="mr-2" />
                <Text strong>History & Updates ({sortedResponses.length})</Text>
              </div>
            }
            key="1"
            className="rounded-lg bg-white"
          >
            {sortedResponses.map((response) => (
              <div
                key={response.id}
                className="mb-3 border-b border-gray-100 pb-3 last:mb-0 last:border-b-0 last:pb-0"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Tag
                    color={response.updateBy === "ADMIN" ? "purple" : "blue"}
                  >
                    {response.updateBy === "ADMIN" ? "ADMIN" : "YOU"}
                  </Tag>

                  {response.adminFilePath && (
                    <div className="ml-auto flex items-center">
                      <FileTextOutlined className="mr-1 text-blue-500" />
                      <a
                        href={response.adminFilePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:text-blue-700"
                      >
                        {response.adminFileName || "View Attachment"}
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {response.pendingEod && (
                    <div className="rounded-lg border border-gray-100 bg-white p-3">
                      <Text className="mb-1 block text-xs text-gray-600">
                        Employee Description:
                      </Text>
                      <Text className="text-sm text-gray-800">
                        {response.pendingEod}
                      </Text>
                    </div>
                  )}

                  {response.adminDescription && (
                    <div className="rounded-lg border border-gray-100 bg-white p-3">
                      <Text className="mb-1 block text-xs text-gray-600">
                        <InfoCircleOutlined className="mr-1" />
                        Admin Description:
                      </Text>
                      <Paragraph
                        className="mb-0 text-sm text-gray-800"
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

  const renderTaskCard = (task: TaskData) => {
    const planDisplay = getPlanDisplay(task);
    const eodDisplay = getEodDisplay(task);

    return (
    <Card
      key={task.id}
      className="mb-4 overflow-hidden rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md"
      headStyle={{
        backgroundColor:
          task.taskStatus === "COMPLETED" ? "#f6ffed" : "#fff7e6",
        borderBottom: `1px solid ${
          task.taskStatus === "COMPLETED" ? "#b7eb8f" : "#ffe58f"
        }`,
        padding: "12px 16px",
      }}
      bodyStyle={{ padding: "14px" }}
      title={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar
              icon={<UserOutlined />}
              style={{
                backgroundColor:
                  task.taskStatus === "COMPLETED" ? "#52c41a" : "#faad14",
                color: "white",
                flexShrink: 0,
              }}
            />

            <div className="min-w-0">
              <Text strong className="block truncate text-base text-gray-800">
                {task.taskAssignedBy || "Task"}
              </Text>
              <Text className="block text-xs text-gray-500 sm:text-sm">
                Updated by: {task.updatedBy || "N/A"}
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
      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
        <div className="flex h-full min-h-[320px] flex-col rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Text className="font-medium text-gray-700">
              📋 Plan of the Day
            </Text>

            <div className="flex flex-wrap items-center gap-2">
              <Text className="text-xs text-gray-500">
                📅 {dayjs(task.planCreatedAt).format("DD-MM-YYYY")}
              </Text>

              {!isEditingPlan(task.id) && canEditPlan(task) && (
                <Button
                  onClick={() => handleEditPlan(task)}
                  style={editButtonStyle}
                  size="small"
                  icon={<EditOutlined />}
                >
                  <span className="hidden sm:inline">Edit Plan</span>
                </Button>
              )}
            </div>
          </div>

          {isEditingPlan(task.id) ? (
            <Form form={editForm} onFinish={handleUpdate} layout="vertical">
              <Form.Item
                name="planOftheDay"
                rules={[
                  { required: true, message: "Please enter your plan!" },
                  {
                    validator: (_, value) => {
                      if (!value || value.trim().length === 0) {
                        return Promise.reject("Empty spaces are not allowed.");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input.TextArea
                  rows={6}
                  placeholder="Enter plan of the day..."
                  maxLength={8000}
                  showCount
                />
              </Form.Item>

              <Space wrap>
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
            renderMediaContent(
              planDisplay.text,
              planDisplay.video,
              "Plan of the Day",
            )
          )}
        </div>

        <div className="flex h-full min-h-[320px] flex-col rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Text className="font-medium text-gray-700">✅ End of the Day</Text>

            <div className="flex flex-wrap items-center gap-2">
              <Text className="text-xs text-gray-500">
                📅 {dayjs(task.planCreatedAt).format("DD-MM-YYYY")}
              </Text>

              {!isEditingEod(task.id) && canEditEod(task) && (
                <Button
                  onClick={() => handleEditEod(task)}
                  style={editButtonStyle}
                  size="small"
                  icon={<EditOutlined />}
                >
                  <span className="hidden sm:inline">Edit EOD</span>
                </Button>
              )}
            </div>
          </div>

          {isEditingEod(task.id) ? (
            <Form form={editForm} onFinish={handleUpdate} layout="vertical">
              <Form.Item
                name="endOftheDay"
                rules={[
                  {
                    required: true,
                    message: "Please enter end of day report!",
                  },
                  {
                    validator: (_, value) => {
                      if (!value || value.trim().length === 0) {
                        return Promise.reject("Empty spaces are not allowed.");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input.TextArea
                  rows={6}
                  placeholder="Enter end of the day report..."
                  maxLength={8000}
                  showCount
                />
              </Form.Item>

              <Space wrap>
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
            renderMediaContent(
              eodDisplay.text,
              eodDisplay.video,
              "End of the Day",
            )
          )}
        </div>
      </div>

      {task.pendingUserTaskResponse?.length > 0 &&
        renderPendingResponses(task.pendingUserTaskResponse)}

      <Divider className="my-4" />

      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div className="flex items-start gap-2 text-gray-500">
          <CalendarOutlined className="mt-1" />
          <Text>Created: {formatDate(task.planCreatedAt)}</Text>
        </div>

        <div className="flex items-start gap-2 text-gray-500">
          <CalendarOutlined className="mt-1" />
          <Text>Updated: {formatDate(task.planUpdatedAt)}</Text>
        </div>
      </div>
    </Card>
    );
  };

  return (
    <UserPanelLayout>
      <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
        <Card
          className="overflow-hidden rounded-xl border-0 shadow-md"
          bodyStyle={{ padding: 0 }}
        >
          <div className="bg-gradient-to-r from-white to-blue-50 p-4 sm:p-5">
            <Title level={4} className="mb-1 text-gray-900">
              Daily Activity Status
            </Title>
            <Text className="text-sm text-gray-500">
              View your Plan of the Day and End of the Day updates.
            </Text>
          </div>

          <div className="p-3 sm:p-4">
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              type="card"
              className="responsive-tabs"
            >
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

            <Card className="mb-4 rounded-xl border border-gray-200 bg-gray-50">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Text className="mb-1 block font-medium text-gray-600">
                    <FilterOutlined className="mr-1" />
                    Status Filter
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
                        <ClockCircleOutlined className="mr-2 text-orange-500" />
                        <span>PENDING</span>
                      </div>
                    </Option>

                    <Option value="COMPLETED">
                      <div className="flex items-center">
                        <CheckCircleOutlined className="mr-2 text-green-500" />
                        <span>COMPLETED</span>
                      </div>
                    </Option>
                  </Select>
                </div>

                {activeTab === "byDate" && (
                  <div>
                    <Text className="mb-1 block font-medium text-gray-600">
                      <CalendarOutlined className="mr-1" />
                      Select Date
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
                    className="w-full bg-[#008CBA] shadow-sm sm:w-auto"
                    style={buttonStyle}
                    icon={<SearchOutlined />}
                  >
                    Search
                  </Button>
                </div>
              </div>
            </Card>

            {(tasks.length > 0 || searchText) && (
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <Search
                  placeholder="Search in tasks..."
                  allowClear
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value.trimStart())}
                  onSearch={handleSearch}
                  className="w-full md:max-w-sm"
                />

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Text className="text-gray-600">Sort by date:</Text>

                  <Radio.Group
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
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
              <div className="flex flex-col items-center justify-center p-10 sm:p-16">
                <Spin size="large" />
                <Text className="mt-4 text-gray-500">Loading tasks...</Text>
              </div>
            ) : filteredTasks.length > 0 ? (
              <div>{filteredTasks.map(renderTaskCard)}</div>
            ) : tasks.length > 0 && searchText ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="text-center">
                    <Text className="mb-2 block text-gray-500">
                      No matching tasks found
                    </Text>
                    <Text className="text-sm text-gray-400">
                      Try changing your search criteria
                    </Text>
                  </div>
                }
                className="py-10 sm:py-16"
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="text-center">
                    <Text className="mb-2 block text-gray-500">
                      No tasks found
                    </Text>
                    <Text className="text-sm text-gray-400">
                      Use the filters above to search for tasks
                    </Text>
                  </div>
                }
                className="py-10 sm:py-16"
              />
            )}
          </div>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

export default AllStatusPage;
