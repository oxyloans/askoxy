import React, { useState, useEffect } from "react";
import BASE_URL from "../../Config";
import {
  Button,
  notification,
  Spin,
  Typography,
  Select,
  Form,
  Input,
  Card,
  List,
  Tag,
  message,
  Progress,
  Timeline,
  Empty,
  Avatar,
  Badge,
  Divider,
  Tooltip,
} from "antd";

import {
  UploadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileOutlined,
  ArrowDownOutlined,
  CalendarOutlined,
  UserOutlined,
  FireOutlined,
  HistoryOutlined,
  CloudUploadOutlined,
  PaperClipOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import UserPanelLayout from "./UserPanelLayout";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { TextArea } = Input;
const { Text, Title, Paragraph } = Typography;
const { Option } = Select;

interface UserDocumentStatus {
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
  taskStatus: "PENDING" | "COMPLETED";
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

interface Task {
  id: string;
  userId: string;
  planOftheDay: string;
  planCreatedAt: string;
  planUpdatedAt: string | null;
  planStatus: string;
  updatedBy: string;
  taskStatus: "COMPLETED" | "PENDING";
  taskAssignedBy: string;
  adminDocumentId: string | null;
  userDocumentCreatedAt: string | null;
  userDocumentId: string | null;
  adminDocumentUpdatedAt: string | null;
  adminComments: string | null;
  adminCommentsUpdatedBy: string | null;
  adminCommentsUpdatedAt: string | null;
  userQueryDocumentStatus: UserDocumentStatus;
  pendingUserTaskResponse: PendingUserTaskResponse[];
  endOftheDay: string | null;
}

interface TaskFormValues {
  id: string;
  userId: string;
  taskStatus: "COMPLETED" | "PENDING";
  endOftheDay: string; // Used for both completed and pending
  pendingEod?: string;
  userDocumentId?: string | null;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  id?: string;
}

const TaskUpdate: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingTasks, setFetchingTasks] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>("");
  const [currentDate] = useState<dayjs.Dayjs>(dayjs());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "uploaded" | "failed"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [form] = Form.useForm<TaskFormValues>();
  const [fileInputKey, setFileInputKey] = useState<number>(Date.now()); // Key to reset file input

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchAllPendingTasks(storedUserId);
    }
  }, []);

  // Modified to fetch all pending tasks without date filter
  const fetchAllPendingTasks = async (userIdValue: string) => {
    setFetchingTasks(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/user-service/write/getAllTaskUpdates`,
        {
          taskStatus: "PENDING",
          userId: userIdValue,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setTasks(response.data);

      // If tasks are available, select the first one by default
      if (response.data && response.data.length > 0) {
        selectTask(response.data[0]);
      } else {
        setSelectedTask(null);
        form.resetFields();
        form.setFieldsValue({ userId: userIdValue });
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Failed to fetch tasks",
        placement: "topRight",
      });
      console.error("Error fetching tasks:", error);
    } finally {
      setFetchingTasks(false);
    }
  };

  const selectTask = (task: Task) => {
    setSelectedTask(task);
    resetUploadState();
    form.setFieldsValue({
      id: task.id,
      userId: task.userId,
      taskStatus: task.taskStatus,
      endOftheDay: task.endOftheDay || "",
      userDocumentId: task.userDocumentId,
    });
  };

  // Function to reset all upload state
  const resetUploadState = () => {
    setUploadStatus("idle");
    setFileName("");
    setDocumentId(null);
    setUploadProgress(0);
    setFileInputKey(Date.now()); // Change key to force input reset
  };

  const updateTask = async (values: TaskFormValues): Promise<void> => {
    setLoading(true);
    try {
      let payload: any;

      if (values.taskStatus === "COMPLETED") {
        payload = {
          endOftheDay: values.endOftheDay,
          id: values.id,
          taskStatus: values.taskStatus,
          userId: values.userId,
          userDocumentId: documentId || values.userDocumentId,
        };
      } else {
        // PENDING status
        payload = {
          id: values.id,
          pendingEod: values.endOftheDay, // Use endOftheDay field for pendingEod
          taskStatus: values.taskStatus,
          userId: values.userId,
        };
      }

      const response = await axios.patch<ApiResponse>(
        `${BASE_URL}/user-service/write/userTaskUpdate`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        notification.success({
          message: "Success",
          description: response.data.message || "Task updated successfully",
          placement: "topRight",
        });

        // Reset upload state after successful update
        resetUploadState();

        // Refresh tasks
        fetchAllPendingTasks(userId);
      } else {
        notification.warning({
          message: "Warning",
          description:
            response.data.message || "Task update completed with warnings",
          placement: "topRight",
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Failed to update task",
        placement: "topRight",
      });
      console.error("Error updating task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // First reset previous upload state
    resetUploadState();

    if (!e.target.files || e.target.files.length === 0) {
      message.warning("Please select a file to upload.");
      return;
    }

    const file = e.target.files[0];

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      message.error("File size should not exceed 10MB");
      return;
    }

    setFileName(file.name);
    setUploadStatus("uploading");
    setUploadProgress(0);

    // Prepare form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", "kyc");

    try {
      const response = await axios.post(
        `${BASE_URL}/user-service/write/uploadTaskScreenShot?userId=${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent: any) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      // Set document ID in state and save to local storage
      const docId = response.data.id;
      setDocumentId(docId);

      // Store in local storage with a timestamp
      localStorage.setItem("taskDocumentId", docId);
      localStorage.setItem("taskDocumentTimestamp", new Date().toISOString());
      localStorage.setItem("taskDocumentName", file.name);

      message.success("Document uploaded successfully!");
      setUploadStatus("uploaded");
    } catch (error: any) {
      console.error("Upload Error:", error);
      message.error(
        error.response?.data?.error || "An error occurred during upload"
      );

      setUploadStatus("failed");
      // Reset file input on error
      setFileInputKey(Date.now());
    }
  };

  // Function to delete the current upload
  const handleDeleteUpload = () => {
    resetUploadState();
    message.success("Upload cleared successfully");
  };

  const renderUploadStatus = () => {
    switch (uploadStatus) {
      case "uploading":
        return (
          <div className="w-full">
            <div className="flex items-center">
              <Spin size="small" className="mr-2" />
              <Text>{fileName}</Text>
            </div>
            <Progress
              percent={uploadProgress}
              size="small"
              status="active"
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
            />
          </div>
        );
      case "uploaded":
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <FileOutlined className="mr-2 text-green-500" />
              <Text className="mr-2">{fileName}</Text>
              <Tag color="success" icon={<CheckCircleOutlined />}>
                Uploaded Successfully
              </Tag>
            </div>
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={handleDeleteUpload}
              className="ml-2"
            >
              Clear
            </Button>
          </div>
        );
      case "failed":
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <FileOutlined className="mr-2 text-red-500" />
              <Text className="mr-2">{fileName}</Text>
              <Tag color="error">Upload Failed</Tag>
            </div>
            <Button
              icon={<DeleteOutlined />}
              size="small"
              onClick={handleDeleteUpload}
              className="ml-2"
            >
              Clear
            </Button>
          </div>
        );
      default:
        return (
          <Text type="secondary" className="flex items-center">
            <PaperClipOutlined className="mr-2" />
            No file selected
          </Text>
        );
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = dayjs(dateString);
    return {
      formatted: date.format("MMM DD, YYYY [at] HH:mm"),
      relative: date.fromNow(),
    };
  };

  // Render pending task response history
  const renderPendingResponses = () => {
    if (
      !selectedTask ||
      !selectedTask.pendingUserTaskResponse ||
      selectedTask.pendingUserTaskResponse.length === 0
    ) {
      return (
        <Empty
          description={
            <span className="text-gray-500">No previous updates found</span>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    // Get all responses, not just those with pendingEod
    const allResponses = selectedTask.pendingUserTaskResponse;

    if (allResponses.length === 0) {
      return (
        <Empty
          description={
            <span className="text-gray-500">No previous updates found</span>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    // Sort by createdAt date (newest first)
    const sortedResponses = [...allResponses].sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
      <Timeline
        items={sortedResponses.map((response, index) => {
          const dateInfo = formatDate(response.createdAt);
          const displayName =
            response.updateBy === "null" ? "You" : response.updateBy;
          const isAdmin = response.updateBy === "ADMIN";

          return {
            color: isAdmin ? "purple" : index === 0 ? "green" : "blue",
            dot: isAdmin ? (
              <UserOutlined />
            ) : index === 0 ? (
              <HistoryOutlined />
            ) : undefined,
            children: (
              <div className="mb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Avatar
                      size="small"
                      icon={<UserOutlined />}
                      style={{
                        backgroundColor: isAdmin ? "#722ed1" : "#1890ff",
                      }}
                      className="mr-2"
                    />
                    <Text strong>{displayName}</Text>
                    {isAdmin && (
                      <Tag color="purple" className="ml-2">
                        Admin
                      </Tag>
                    )}
                  </div>
                  <div className="text-right">
                    <Text type="secondary">
                      {typeof dateInfo === "object"
                        ? dateInfo.formatted
                        : dateInfo}
                    </Text>
                    <br />
                    <Text type="secondary" className="text-xs">
                      {typeof dateInfo === "object"
                        ? dateInfo.relative
                        : dateInfo}
                    </Text>
                  </div>
                </div>
                <Card
                  size="small"
                  className="mt-2"
                  style={{
                    backgroundColor: isAdmin
                      ? "#f9f0ff"
                      : index === 0
                      ? "#f6ffed"
                      : "#f0f5ff",
                    borderColor: isAdmin
                      ? "#d3adf7"
                      : index === 0
                      ? "#b7eb8f"
                      : "#bae0ff",
                  }}
                >
                  {/* Show either pendingEod or adminDescription based on what's available */}
                  {response.pendingEod ? (
                    <Paragraph className="mb-0">
                      {response.pendingEod}
                    </Paragraph>
                  ) : response.adminDescription ? (
                    <div>
                      <div className="flex items-center mb-1">
                        <InfoCircleOutlined className="mr-1 text-purple-600" />
                        <Text strong className="text-purple-800">
                          Admin Description:
                        </Text>
                      </div>
                      <Paragraph className="mb-0">
                        {response.adminDescription}
                      </Paragraph>
                    </div>
                  ) : (
                    <Paragraph className="mb-0 text-gray-500">
                      No description provided
                    </Paragraph>
                  )}
                </Card>
              </div>
            ),
          };
        })}
      />
    );
  };

  // Get task status color
  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "PENDING":
        return "warning";
      default:
        return "default";
    }
  };

  // Function to get task creation date
  const getTaskDate = (task: Task) => {
    if (task.planCreatedAt) {
      return dayjs(task.planCreatedAt).format("MMMM DD, YYYY");
    }
    return "Unknown Date";
  };

  return (
    <UserPanelLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card
          title={
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <CalendarOutlined className="mr-2 text-blue-500" />
                <span className="font-semibold text-lg">All Pending Tasks</span>
              </div>
              {fetchingTasks ? <Spin size="small" /> : null}
            </div>
          }
          className="mb-6 shadow-md rounded-lg"
          headStyle={{
            backgroundColor: "#f9f9f9",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          {fetchingTasks ? (
            <div className="flex justify-center items-center py-12">
              <Spin size="large" tip="Loading your tasks..." />
            </div>
          ) : tasks.length > 0 ? (
            <List
              itemLayout="vertical"
              dataSource={tasks}
              renderItem={(task) => {
                const pendingUpdatesCount =
                  task.pendingUserTaskResponse?.length || 0;

                const taskDate = getTaskDate(task);

                return (
                  <List.Item
                    className={`border rounded-lg p-4 mb-4 cursor-pointer transition-all duration-300 hover:shadow-md
                      ${
                        task.id === selectedTask?.id
                          ? "bg-blue-50 border-blue-300 shadow-md"
                          : "hover:bg-gray-50"
                      }`}
                    onClick={() => selectTask(task)}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start mb-2">
                      <div className="flex-1 w-full md:w-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                          <div className="flex flex-col sm:flex-row sm:items-center mb-2 sm:mb-0">
                            <Title level={5} className="ml-4 mb-0 font-bold">
                              Plan of the day
                            </Title>
                            <Tag color="blue" className="mt-1 sm:mt-0 sm:ml-3">
                              {taskDate}
                            </Tag>
                          </div>
                          <div className="flex items-center mt-2 sm:mt-0">
                            {task.taskAssignedBy && (
                              <Tooltip title="Assigned by">
                                <Tag color="cyan" className="mr-2">
                                  <UserOutlined className="mr-1" />
                                  {task.taskAssignedBy}
                                </Tag>
                              </Tooltip>
                            )}
                            <Tag
                              icon={
                                task.taskStatus === "COMPLETED" ? (
                                  <CheckCircleOutlined />
                                ) : (
                                  <ClockCircleOutlined />
                                )
                              }
                              color={getTaskStatusColor(task.taskStatus)}
                              className="text-sm"
                            >
                              {task.taskStatus}
                            </Tag>
                          </div>
                        </div>
                        <Paragraph className="ml-4 text-gray-700">
                          {task.planOftheDay}
                        </Paragraph>

                        {/* Show pending update count badge if there are any */}
                        {pendingUpdatesCount > 0 && (
                          <div className="mt-3 ml-4">
                            <Badge
                              count={pendingUpdatesCount}
                              overflowCount={99}
                            >
                              <Tag
                                color="blue"
                                className="flex items-center"
                                icon={<HistoryOutlined />}
                              >
                                Previous Updates
                              </Tag>
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </List.Item>
                );
              }}
            />
          ) : (
            <div className="text-center py-12">
              <Empty
                description={
                  <div>
                    <Title level={4} type="secondary">
                      No pending tasks
                    </Title>
                    <Paragraph type="secondary">
                      There are no pending tasks assigned to you at this time.
                    </Paragraph>
                  </div>
                }
              />
            </div>
          )}
        </Card>

        {selectedTask && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card
                  title={
                    <div className="flex items-center">
                      <CloudUploadOutlined className="mr-2 text-blue-500" />
                      <span className="font-semibold text-lg">
                        Update Task Status
                      </span>
                    </div>
                  }
                  className="shadow-md mb-6 rounded-lg"
                  headStyle={{
                    backgroundColor: "#f9f9f9",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <Form<TaskFormValues>
                    form={form}
                    layout="vertical"
                    onFinish={updateTask}
                    initialValues={{
                      id: selectedTask.id,
                      userId: selectedTask.userId,
                      taskStatus: selectedTask.taskStatus,
                      endOftheDay: selectedTask.endOftheDay || "",
                    }}
                    className="px-1"
                  >
                    <Form.Item name="id" hidden>
                      <Input />
                    </Form.Item>

                    <Form.Item name="userId" hidden>
                      <Input />
                    </Form.Item>

                    <Form.Item name="userDocumentId" hidden>
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label={<span className="font-medium">Task Status</span>}
                      name="taskStatus"
                      rules={[
                        {
                          required: true,
                          message: "Please select the task status",
                        },
                      ]}
                    >
                      <Select
                        onChange={(value) =>
                          value === "COMPLETED" &&
                          form.setFieldsValue({
                            endOftheDay:
                              form.getFieldValue("endOftheDay") || "",
                          })
                        }
                      >
                        <Option value="COMPLETED">
                          <div className="flex items-center">
                            <CheckCircleOutlined className="mr-2 text-green-500" />
                            COMPLETED
                          </div>
                        </Option>
                        <Option value="PENDING">
                          <div className="flex items-center">
                            <ClockCircleOutlined className="mr-2 text-yellow-500" />
                            PENDING
                          </div>
                        </Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label={
                        <span className="font-medium">End of Day Note</span>
                      }
                      name="endOftheDay"
                      rules={[
                        {
                          required: true,
                          message: "Please enter an end of day note",
                        },
                      ]}
                    >
                      <TextArea
                        placeholder="Summarize what you accomplished today or your progress on this task..."
                        rows={6}
                        className="border-gray-300 hover:border-blue-400 focus:border-blue-500"
                      />
                    </Form.Item>

                    <Form.Item
                      label={
                        <span className="font-medium">
                          Upload Screenshot (Optional)
                        </span>
                      }
                    >
                      <Card
                        className="mb-4 bg-gray-50 border border-dashed hover:border-blue-400 transition-colors"
                        size="small"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              onChange={handleFileChange}
                              className="hidden"
                              disabled={uploadStatus === "uploading"}
                              accept="image/*,.pdf,.doc,.docx"
                              key={fileInputKey} // Add key to force re-rendering
                            />
                            <Button
                              icon={<UploadOutlined />}
                              disabled={uploadStatus === "uploading"}
                              loading={uploadStatus === "uploading"}
                            >
                              {uploadStatus === "uploading"
                                ? "Uploading..."
                                : "Choose File"}
                            </Button>
                          </label>

                          <div className="flex-grow">
                            {renderUploadStatus()}
                          </div>
                        </div>
                      </Card>
                    </Form.Item>

                    <Divider />

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                        className="h-12 font-medium bg-[#008CBA]"
                        icon={<CloudUploadOutlined />}
                      >
                        {loading ? "Updating..." : "Update Task"}
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </div>

              <div className="lg:col-span-1">
                {/* Previous Updates Section */}
                <Card
                  title={
                    <div className="flex items-center">
                      <HistoryOutlined className="mr-2 text-blue-500" />
                      <span className="font-semibold text-lg">
                        Updates & Comments
                      </span>
                    </div>
                  }
                  className="shadow-md rounded-lg mb-6"
                  headStyle={{
                    backgroundColor: "#f9f9f9",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                  style={{ height: "100%" }}
                >
                  <div className="py-2 max-h-[500px] overflow-y-auto">
                    {renderPendingResponses()}
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </UserPanelLayout>
  );
};

export default TaskUpdate;
