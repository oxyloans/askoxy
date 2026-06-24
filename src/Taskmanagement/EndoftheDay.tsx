import React, { useState, useEffect, useRef, useCallback } from "react";
import BASE_URL from "../Config";
import {
  Button,
  Spin,
  Typography,
  Select,
  Form,
  Input,
  Card,
  List,
  Tag,
  Progress,
  Timeline,
  Empty,
  Avatar,
  Divider,
  Tooltip,
} from "antd";
import Swal from "sweetalert2";

import {
  UploadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  UserOutlined,
  HistoryOutlined,
  CloudUploadOutlined,
  PaperClipOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  AudioOutlined,
  AudioMutedOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import UserPanelLayout from "./UserPanelLayout";
import { employeeApi } from "../utils/axiosInstances";
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "uploaded" | "failed"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [form] = Form.useForm<TaskFormValues>();
  const [tasksCollapsed, setTasksCollapsed] = useState<boolean>(false);

  const handleTaskItemClick = (task: Task) => {
    selectTask(task);
  };

  const fetchAllPendingTasks = useCallback(
    async (userIdValue: string) => {
      setFetchingTasks(true);
      try {
        const response = await employeeApi.post(
          `${BASE_URL}/user-service/write/getAllTaskUpdates`,
          {
            taskStatus: "PENDING",
            userId: userIdValue,
          },
        );
        setTasks(response.data);

        // Prefer selecting a pending task from the current month and year
        const now = dayjs();
        const currentMonthPending = response.data.filter((t: Task) => {
          if (!t.planCreatedAt) return false;
          return (
            t.taskStatus === "PENDING" &&
            dayjs(t.planCreatedAt).isSame(now, "month")
          );
        });

        if (currentMonthPending && currentMonthPending.length > 0) {
          selectTask(currentMonthPending[0]);
        } else if (response.data && response.data.length > 0) {
          selectTask(response.data[0]);
        } else {
          setSelectedTask(null);
          form.setFieldsValue({
            userId: userIdValue,
            taskStatus: "COMPLETED",
            endOftheDay: sessionStorage.getItem("eod_draft") || "",
          });
          setIsFormVisible(false);
        }
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Unable to Load Tasks",
          text:
            error.response?.data?.message ||
            "We could not fetch your pending tasks right now. Please refresh the page or try again after some time.",
          confirmButtonText: "OK",
        });
        console.error("Error fetching tasks:", error);
      } finally {
        setFetchingTasks(false);
      }
    },
    [form],
  );

  const [isEodListening, setIsEodListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);
  const shouldKeepListeningRef = useRef<boolean>(false);
  const baseTextRef = useRef<string>("");
  const finalTranscriptRef = useRef<string>("");

  const cleanVoiceText = (text: string) => {
    return text
      .replace(/\s+/g, " ")
      .replace(/\s+([,.!?])/g, "$1")
      .replace(/\bi\b/g, "I")
      .trim();
  };

  const updateEodVoiceText = (interimText: string = "") => {
    const parts = [
      baseTextRef.current,
      finalTranscriptRef.current,
      interimText,
    ].filter((part) => part && part.trim());

    const updated = cleanVoiceText(parts.join(" "));
    form.setFieldsValue({ endOftheDay: updated });
    sessionStorage.setItem("eod_draft", updated);
  };

  const stopEodVoice = () => {
    shouldKeepListeningRef.current = false;
    setIsEodListening(false);

    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  const startEodVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      Swal.fire({
        icon: "warning",
        title: "Voice Not Supported",
        text: "Your browser does not support voice typing. Please use Chrome or Edge.",
        confirmButtonText: "OK",
      });
      return;
    }

    stopEodVoice();

    baseTextRef.current = cleanVoiceText(form.getFieldValue("endOftheDay") || "");
    finalTranscriptRef.current = "";
    shouldKeepListeningRef.current = true;
    setIsEodListening(true);

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event: any) => {
      let interimText = "";
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0]?.transcript || "";

        if (event.results[i].isFinal) {
          finalText += ` ${transcript}`;
        } else {
          interimText += ` ${transcript}`;
        }
      }

      if (finalText.trim()) {
        finalTranscriptRef.current = cleanVoiceText(
          `${finalTranscriptRef.current} ${finalText}`,
        );
      }

      updateEodVoiceText(cleanVoiceText(interimText));
    };

    recognition.onerror = (event: any) => {
      if (event?.error === "not-allowed" || event?.error === "service-not-allowed") {
        stopEodVoice();
        Swal.fire({
          icon: "warning",
          title: "Microphone Permission Needed",
          text: "Please allow microphone access and try again.",
          confirmButtonText: "OK",
        });
      }
    };

    recognition.onend = () => {
      if (!shouldKeepListeningRef.current) return;

      try {
        recognition.start();
      } catch {
        setTimeout(() => {
          if (shouldKeepListeningRef.current) {
            try {
              recognition.start();
            } catch {
              // Browser may still be stopping; user can press Speak again if needed.
            }
          }
        }, 300);
      }
    };

    try {
      recognition.start();
    } catch {
      setIsEodListening(false);
      shouldKeepListeningRef.current = false;
    }
  };

  const toggleEodVoice = () => {
    if (isEodListening) {
      stopEodVoice();
      return;
    }

    startEodVoice();
  };

  useEffect(() => {
    return () => {
      stopEodVoice();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add state to track if form fields should be visible
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  // Ref to scroll to the details section
  const detailsSectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchAllPendingTasks(storedUserId);
    }
    // Restore EOD draft on mount
    const eodDraft = sessionStorage.getItem("eod_draft");
    if (eodDraft) {
      form.setFieldsValue({ endOftheDay: eodDraft });
    }
  }, [fetchAllPendingTasks, form]);
  // Check if task can be updated based on date and time
  const canUpdateTask = (task: Task): boolean => {
    const currentTime = dayjs();
    const taskDate = dayjs(task.planCreatedAt);
    const isSameDay = currentTime.isSame(taskDate, "day");

    const isBeforeNinePM =
      currentTime.hour() < 21 ||
      (currentTime.hour() === 21 && currentTime.minute() === 0);

    return isSameDay && isBeforeNinePM;
  };

  const selectTask = (task: Task) => {
    setSelectedTask(task);
    resetUploadState();
    const canUpdate = canUpdateTask(task);
    setIsFormVisible(canUpdate);
    // Prefer saved draft over task's existing value
    const savedDraft = sessionStorage.getItem("eod_draft");
    form.setFieldsValue({
      id: task.id,
      userId: task.userId,
      taskStatus: "COMPLETED",
      endOftheDay: savedDraft || task.endOftheDay || "",
      userDocumentId: task.userDocumentId,
    });
    setTimeout(() => {
      detailsSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  };

  // Function to reset all upload state
  const resetUploadState = () => {
    setUploadStatus("idle");
    setFileName("");
    setDocumentId(null);
    setUploadProgress(0);
  };

  const updateTask = async (values: TaskFormValues): Promise<void> => {
    if (!selectedTask || !canUpdateTask(selectedTask)) {
      Swal.fire({
        icon: "warning",
        title: "Update Window Closed",
        text: "This task can be updated only on the same day before 9:00 PM IST. Please contact your admin if you need any changes.",
        confirmButtonText: "OK",
      });
      return;
    }
    setLoading(true);
    try {
      let payload: any;

      if (values.taskStatus === "COMPLETED") {
        payload = {
          endOftheDay: values.endOftheDay.trim(),
          id: values.id,
          taskStatus: values.taskStatus,
          userId: values.userId,
          userDocumentId: documentId || values.userDocumentId,
        };
      } else {
        // PENDING status
        payload = {
          id: values.id,
          pendingEod: values.endOftheDay.trim(), // Use endOftheDay field for pendingEod
          taskStatus: values.taskStatus,
          userId: values.userId,
        };
      }

      const response = await employeeApi.patch<ApiResponse>(
        `${BASE_URL}/user-service/write/userTaskUpdate`,
        payload,
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Task Updated Successfully",
          text:
            response.data.message ||
            "Your End of Day update has been submitted successfully.",
          confirmButtonText: "OK",
        });
        sessionStorage.removeItem("eod_draft");
        resetUploadState();
        fetchAllPendingTasks(userId);
      } else {
        Swal.fire({
          icon: "warning",
          title: "Update Completed With Notice",
          text:
            response.data.message ||
            "Your task update was processed, but there may be additional information to review.",
          confirmButtonText: "OK",
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Task Update Failed",
        text:
          error.response?.data?.message ||
          "We could not update your task at this time. Please check your details and try again.",
        confirmButtonText: "OK",
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
      Swal.fire({
        icon: "warning",
        title: "No File Selected",
        text: "Please choose a file before uploading.",
        confirmButtonText: "OK",
      });
      return;
    }

    const file = e.target.files[0];

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File Size Too Large",
        text: "The selected file is larger than 10 MB. Please upload a smaller file.",
        confirmButtonText: "OK",
      });
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
      const response = await employeeApi.post(
        `${BASE_URL}/user-service/write/uploadTaskScreenShot?userId=${userId}`,
        formData,
        {
          headers: { "Content-Type": undefined },
          onUploadProgress: (progressEvent: any) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(percentCompleted);
          },
        },
      );

      // Set document ID in state and save to local storage
      const docId = response.data.id;
      setDocumentId(docId);

      // Store in session storage with a timestamp
      sessionStorage.setItem("taskDocumentId", docId);
      sessionStorage.setItem("taskDocumentTimestamp", new Date().toISOString());
      sessionStorage.setItem("taskDocumentName", file.name);

      Swal.fire({
        icon: "success",
        title: "Document Uploaded Successfully",
        text: "Your supporting document has been uploaded and attached to this task.",
        confirmButtonText: "OK",
      });
      setUploadStatus("uploaded");
    } catch (error: any) {
      console.error("Upload Error:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text:
          error.response?.data?.error ||
          "We could not upload your document. Please check the file and try again.",
        confirmButtonText: "OK",
      });

      setUploadStatus("failed");
      // Reset file input on error
    }
  };

  // Function to delete the current upload
  const handleDeleteUpload = () => {
    resetUploadState();
    Swal.fire({
      icon: "success",
      title: "Upload Removed",
      text: "The selected upload has been cleared successfully.",
      confirmButtonText: "OK",
    });
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
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
                      {typeof dateInfo === "object" ? dateInfo.formatted : ""}
                    </Text>
                    <br />
                    <Text type="secondary" className="text-xs">
                      {typeof dateInfo === "object" ? dateInfo.relative : ""}
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

  // Filter tasks to only those pending in the current month and year
  const currentMonthPendingTasks = tasks.filter((t) => {
    if (!t.planCreatedAt) return false;
    return (
      t.taskStatus === "PENDING" &&
      dayjs(t.planCreatedAt).isSame(dayjs(), "month")
    );
  });

  return (
    <UserPanelLayout>
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6">
        <Card
          title={
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CalendarOutlined className="text-blue-500" />
                <span className="font-semibold text-lg">All Pending Tasks</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {currentMonthPendingTasks.length} pending task
                  {currentMonthPendingTasks.length === 1 ? "" : "s"}
                </span>
                <Button
                  type="text"
                  size="small"
                  icon={
                    tasksCollapsed ? (
                      <UpOutlined className="text-blue-500" />
                    ) : (
                      <DownOutlined className="text-blue-500" />
                    )
                  }
                  onClick={() => setTasksCollapsed((prev) => !prev)}
                >
                  {tasksCollapsed ? "Show" : "Hide"}
                </Button>
              </div>
            </div>
          }
          className="mb-4 sm:mb-6 shadow-md rounded-lg"
          headStyle={{
            backgroundColor: "#f9f9f9",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          {fetchingTasks ? (
            <div className="flex justify-center items-center py-8 sm:py-12">
              <Spin size="large" tip="Loading your tasks..." />
            </div>
          ) : currentMonthPendingTasks.length > 0 ? (
            !tasksCollapsed ? (
              <List
                itemLayout="vertical"
                dataSource={currentMonthPendingTasks}
                renderItem={(task) => {
                  const taskDate = getTaskDate(task);

                  return (
                    <List.Item
                      className={`border rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 cursor-pointer transition-all duration-300 hover:shadow-md ${
                        task.id === selectedTask?.id
                          ? "bg-blue-50 border-blue-300 shadow-md"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleTaskItemClick(task)}
                    >
                      <div className="w-full" style={{ padding: "4px 8px" }}>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Title
                              level={5}
                              className="mb-0 font-bold"
                              style={{ marginBottom: 0, paddingLeft: "6px" }}
                            >
                              Plan of the day
                            </Title>
                            <Tag color="blue">{taskDate}</Tag>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {task.taskAssignedBy && (
                              <Tooltip title="Assigned by">
                                <Tag color="cyan">
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
                        <div className="px-2 py-3 border-t border-gray-200 mt-1">
                          <Paragraph
                            className="text-gray-700 mb-0"
                            style={{
                              wordBreak: "break-word",
                              paddingLeft: "6px",
                            }}
                          >
                            {task.planOftheDay}
                          </Paragraph>
                        </div>
                      </div>
                    </List.Item>
                  );
                }}
              />
            ) : (
              <div className="text-center py-8 sm:py-12">
                <Text type="secondary">
                  Task list is collapsed. Expand to view pending tasks.
                </Text>
              </div>
            )
          ) : (
            <div className="text-center py-8 sm:py-12">
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
            <div
              className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch"
              ref={detailsSectionRef}
            >
              <div className="lg:col-span-2 flex flex-col">
                <Card
                  title={
                    <div className="flex items-center">
                      <CloudUploadOutlined className="mr-2 text-blue-500" />
                      <span className="font-semibold text-lg">
                        Update Task Status
                      </span>
                    </div>
                  }
                  className="shadow-md rounded-lg flex-1"
                  headStyle={{
                    backgroundColor: "#f9f9f9",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                  style={{ display: "flex", flexDirection: "column" }}
                  bodyStyle={{ flex: 1 }}
                >
                  {isFormVisible ? (
                    <Form<TaskFormValues>
                      form={form}
                      layout="vertical"
                      onFinish={updateTask}
                      initialValues={{
                        id: selectedTask.id,
                        userId: selectedTask.userId,
                        taskStatus: "COMPLETED",
                        endOftheDay: selectedTask.endOftheDay || "",
                      }}
                      className="px-1"
                      onValuesChange={(changedValues) => {
                        if (changedValues.endOftheDay !== undefined) {
                          sessionStorage.setItem(
                            "eod_draft",
                            changedValues.endOftheDay || "",
                          );
                        }
                      }}
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
                          dropdownStyle={{ zIndex: 1051 }} // Higher z-index for mobile
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
                        validateFirst
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "End of day note is required.",
                          },
                          {
                            min: 50,
                            message:
                              "End of day note must be at least 50 characters long.",
                          },
                        ]}
                      >
                        <TextArea
                          placeholder="Summarize what you accomplished today or your progress on this task..."
                          rows={6}
                          className="border-gray-300 hover:border-blue-400 focus:border-blue-500"
                        />
                      </Form.Item>
                      {/* {userId === "591e704d-e831-491f-807c-9dc04cb1b35c" && ( */}
                      <div className="-mt-4 mb-3 flex justify-end">
                        <Button
                          type={isEodListening ? "primary" : "default"}
                          shape="round"
                          size="small"
                          icon={
                            isEodListening ? (
                              <AudioMutedOutlined />
                            ) : (
                              <AudioOutlined />
                            )
                          }
                          onClick={toggleEodVoice}
                          danger={isEodListening}
                          style={
                            isEodListening
                              ? {}
                              : { borderColor: "#008cba", color: "#008cba" }
                          }
                        >
                          {isEodListening ? "Stop" : "Speak"}
                        </Button>
                      </div>
                      {/* )} */}

                      <Form.Item
                        label={
                          <span className="font-medium flex items-center">
                            <PaperClipOutlined className="mr-2" />
                            Attach Screenshot (Optional)
                          </span>
                        }
                      >
                        <Card
                          className="mb-4 bg-gradient-to-br from-blue-50 to-gray-50 border-2 border-dashed border-blue-300 hover:border-blue-500 transition-all duration-300 hover:shadow-md"
                          size="small"
                        >
                          {uploadStatus === "idle" ? (
                            <div className="text-center py-3">
                              <CloudUploadOutlined className="text-3xl text-blue-500 mb-2" />
                              <div className="mb-1">
                                <Button
                                  type="primary"
                                  icon={<UploadOutlined />}
                                  className="bg-[#008CBA]"
                                  onClick={() => {
                                    const input =
                                      document.createElement("input");
                                    input.type = "file";
                                    input.accept = "image/*,.pdf,.doc,.docx";
                                    input.onchange = (e: any) =>
                                      handleFileChange(e);
                                    input.click();
                                  }}
                                >
                                  Select File to Upload
                                </Button>
                              </div>
                              <Text type="secondary" className="text-xs block">
                                Supported: Images, PDF, DOC (Max 10MB)
                              </Text>
                            </div>
                          ) : uploadStatus === "uploading" ? (
                            <div className="py-3">
                              <div className="flex items-center justify-center mb-2">
                                <Spin />
                                <Text className="ml-2 text-sm">
                                  Uploading {fileName}...
                                </Text>
                              </div>
                              <Progress
                                percent={uploadProgress}
                                status="active"
                                strokeColor={{
                                  "0%": "#108ee9",
                                  "100%": "#87d068",
                                }}
                                size="small"
                              />
                            </div>
                          ) : uploadStatus === "uploaded" ? (
                            <div className="py-3">
                              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                                <div className="flex items-center flex-1">
                                  <CheckCircleOutlined className="text-xl text-green-500 mr-2" />
                                  <div className="flex-1">
                                    <Text strong className="block text-sm">
                                      {fileName}
                                    </Text>
                                    <Tag color="success" className="mt-1">
                                      Upload Successful
                                    </Tag>
                                  </div>
                                </div>
                                <Button
                                  danger
                                  size="small"
                                  icon={<DeleteOutlined />}
                                  onClick={handleDeleteUpload}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="py-3">
                              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                                <div className="flex items-center flex-1">
                                  <InfoCircleOutlined className="text-xl text-red-500 mr-2" />
                                  <div className="flex-1">
                                    <Text
                                      strong
                                      className="block text-sm text-red-600"
                                    >
                                      {fileName}
                                    </Text>
                                    <Tag color="error" className="mt-1">
                                      Upload Failed
                                    </Tag>
                                  </div>
                                </div>
                                <Button
                                  size="small"
                                  icon={<DeleteOutlined />}
                                  onClick={handleDeleteUpload}
                                >
                                  Clear
                                </Button>
                              </div>
                            </div>
                          )}
                        </Card>
                      </Form.Item>

                      <Divider />

                      <Form.Item>
                        <Button
                          htmlType="submit"
                          loading={loading}
                          block
                          style={{
                            height: "40px",
                            borderRadius: "8px",
                            background: "#008cba",
                            color: "white",
                            boxShadow: "0 2px 8px rgba(0, 140, 186, 0.2)",
                          }}
                          icon={<CloudUploadOutlined />}
                        >
                          {loading ? "Updating..." : "Update Task"}
                        </Button>
                      </Form.Item>
                    </Form>
                  ) : (
                    <Empty
                      description={
                        <div>
                          <Title level={4} type="secondary">
                            Task Update Unavailable
                          </Title>
                          <Paragraph type="secondary">
                            This task cannot be updated because it is either
                            from a different day or the update window (before
                            9:00 PM IST) has passed.
                          </Paragraph>
                        </div>
                      }
                    />
                  )}
                </Card>
              </div>

              <div className="lg:col-span-1 flex flex-col">
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
                  className="shadow-md rounded-lg flex-1"
                  headStyle={{
                    backgroundColor: "#f9f9f9",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                  style={{ display: "flex", flexDirection: "column" }}
                  bodyStyle={{
                    flex: 1,
                    overflowY: "auto",
                  }}
                >
                  {renderPendingResponses()}
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
