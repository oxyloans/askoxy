import React, { useState, useEffect } from "react";
import UserPanelLayout from "./UserPanelLayout";
import BASE_URL from "../Config";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Typography,
  Divider,
  Avatar,
  Tag,
  notification,
  message,
  Skeleton,
  Tooltip,
  Badge,
  Result,
  Spin,
  Space,
} from "antd";
import {
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  SendOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const TEAM_OPTIONS: string[] = [
  "TECHTEAM",
  "ADMINTEAM",
  "HRTEAM",
  "TELECALLINGTEAM",
  "ACCOUNTINGTEAM",
  "SALESTEAM",
  "MANAGEMENTTEAM",
];

const TEAM_COLORS: Record<string, string> = {
  TECHTEAM: "blue",
  ADMINTEAM: "purple",
  HRTEAM: "pink",
  TELECALLINGTEAM: "orange",
  ACCOUNTINGTEAM: "green",
  SALESTEAM: "red",
  MANAGEMENTTEAM: "gold",
};

interface TaskFormValues {
  planOftheDay: string;
  taskTeam: string;
}

interface TaskResponse {
  success: boolean;
  id: string;
}

interface Task {
  id: string;
  userId: string;
  planOftheDay: string;
  taskTeam: string;
  taskStatus: string;
  planCreatedAt: string;
  lastFourDigitsUserId: string;
}

const PlanOfTheDay: React.FC = () => {
  const [form] = Form.useForm<TaskFormValues>();
  const [loading, setLoading] = useState(false);
  const [fetchingStatus, setFetchingStatus] = useState(true);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [todayTask, setTodayTask] = useState<Task | null>(null);
  const [errorState, setErrorState] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [isSubmissionWindowOpen, setIsSubmissionWindowOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(today.toLocaleDateString("en-US", options));

    const storedUserId = sessionStorage.getItem("userId") || "";
    setUserId(storedUserId);

    const storedUserName = sessionStorage.getItem("Name") || "";
    setUserName(storedUserName);

    checkPendingTasksForToday(storedUserId);

    const checkSubmissionWindow = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentTimeInMinutes = hours * 60 + minutes;
      const openTimeInMinutes = 7 * 60 + 0;
      const closeTimeInMinutes = 11 * 60 + 25;
      setIsSubmissionWindowOpen(
        currentTimeInMinutes >= openTimeInMinutes &&
          currentTimeInMinutes < closeTimeInMinutes
      );
    };

    checkSubmissionWindow();

    const intervalId = setInterval(checkSubmissionWindow, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (isEditing && todayTask) {
      form.setFieldsValue({
        planOftheDay: todayTask.planOftheDay,
        taskTeam: todayTask.taskTeam,
      });
    }
  }, [isEditing, todayTask, form]);

  const checkPendingTasksForToday = async (userIdValue: string) => {
    setFetchingStatus(true);
    setErrorState(false);
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

      const tasks: Task[] = response.data;

      const today = new Date();
      const todayStr =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0");

      const foundTodayTask = tasks.find((task) => {
        const taskDateStr = task.planCreatedAt.split(" ")[0];
        return taskDateStr === todayStr;
      });

      if (foundTodayTask) {
        setIsSubmitted(true);
        setTodayTask(foundTodayTask);
      } else {
        setIsSubmitted(false);
        setTodayTask(null);
      }
    } catch (error: any) {
      console.error("Error checking pending tasks:", error);
      setErrorState(true);
      notification.error({
        message: "Error",
        description:
          error.response?.data?.message || "Failed to check task status",
        placement: "topRight",
      });
    } finally {
      setFetchingStatus(false);
    }
  };

  const onFinish = async (values: TaskFormValues) => {
    setLoading(true);
    try {
      if (!userName) {
        message.warning("User name not found. Please login again.");
        setLoading(false);
        return;
      }

      let payload;
      const isEditMode = isEditing && todayTask;
      if (isEditMode) {
        payload = {
          id: todayTask.id,
          planOftheDay: values.planOftheDay,
          taskStatus: "PENDING",
          userId: userId,
        };
      } else {
        payload = {
          planOftheDay: values.planOftheDay,
          taskAssinedBy: sessionStorage.getItem("Name"),
          taskTeam: values.taskTeam,
          userId: userId,
        };
      }

      const response = await axios.patch<TaskResponse>(
        `${BASE_URL}/user-service/write/userTaskUpdate`,
        payload
      );
      if (response.data.success) {
        if (!isEditMode) {
          sessionStorage.setItem("taskId", response.data.id);
        }

        setSubmissionSuccess(true);

        const action = isEditMode ? "updated" : "submitted";
        notification.success({
          message: "Success",
          description: `Your daily plan has been ${action} successfully.`,
          placement: "topRight",
        });

        setTimeout(() => {
          checkPendingTasksForToday(userId);
          setSubmissionSuccess(false);
          if (isEditMode) {
            setIsEditing(false);
          }
        }, 1000);

        form.resetFields();
      } else {
        message.error("Failed to update task.");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      notification.error({
        message: "Error",
        description: "An error occurred while updating the task.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateTimeString: string): string => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatTeamName = (teamName: string): string => {
    return teamName?.replace("TEAM", "TEAM") || "";
  };

  const handleRetry = () => {
    checkPendingTasksForToday(userId);
  };

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center py-10">
      <Spin size="large" />
      <Text className="text-gray-600 mt-4">Checking your task status...</Text>
    </div>
  );

  const renderErrorState = () => (
    <Result
      status="warning"
      title="Something went wrong"
      subTitle="We couldn't load your task status. Please try again."
      extra={
        <Button
          type="primary"
          onClick={handleRetry}
          icon={<ReloadOutlined />}
          className="bg-blue-600 hover:bg-blue-700 transition-all"
        >
          Try Again
        </Button>
      }
    />
  );

  const renderSubmittedState = () => (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="bg-green-50 rounded-full">
        <CheckCircleOutlined className="text-green-500 text-4xl" />
      </div>
      <Title level={4} className="text-gray-800 mb-2">
        Daily Plan Submitted!
      </Title>
      <Paragraph className="text-gray-600 mb-6 text-center">
        Your plan for today has already been submitted. Please return tomorrow
        to submit a new plan
      </Paragraph>

      {todayTask && (
        <Card
          className="w-full mt-2 bg-white border border-gray-200 shadow-sm rounded-xl text-left hover:shadow-md transition-all"
          style={
            {
              // borderLeftColor: `var(--ant-${
              //   TEAM_COLORS[todayTask.taskTeam] || "blue"
              // }-color)`,
            }
          }
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2 sm:mb-4">
            {/* Team Tag and Title */}
            <div className="flex items-center gap-2">
              <Text strong className="text-base sm:text-lg text-gray-800">
                Today Plan Of The Day
              </Text>
            </div>

            {/* Time Tag and Edit Button */}
            <div className="flex items-center gap-2">
              {/* Show Tooltip only on non-touch devices */}
              <Tooltip
                title={`Submitted at ${formatTime(todayTask.planCreatedAt)}`}
                placement="top"
                overlayClassName="hidden sm:block"
              >
                <Tag
                  icon={<ClockCircleOutlined />}
                  color="default"
                  className="text-xs sm:text-sm px-2 py-1 cursor-pointer"
                >
                  {formatTime(todayTask.planCreatedAt)}
                </Tag>
              </Tooltip>
              {/* Show plain text on mobile for touch devices */}
              <span className="block sm:hidden text-xs text-gray-600 ml-2">
                Submitted at {formatTime(todayTask.planCreatedAt)}
              </span>
           
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => setIsEditing(true)}
                  style={{ color: "#f7f7f7",backgroundColor:"#008cba" ,border:"#008cba"}}
                  size="small"
                >
                  Edit
                </Button>
          
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <Paragraph className="whitespace-pre-line text-gray-700 mb-0">
              {todayTask.planOftheDay}
            </Paragraph>
          </div>

         
        </Card>
      )}
    </div>
  );

  const renderClosedState = () => (
    <Result
      status="info"
      title="⏰ Submission Window Closed"
      subTitle={
        <span>
          You can submit your <strong>Plan of the Day</strong> only between
          <br />
          <strong>7:00 AM to 10:30 AM</strong> (daily).
          <br />
          Please come back during this window tomorrow.
        </span>
      }
      icon={<ClockCircleOutlined style={{ color: "#1890ff", fontSize: 50 }} />}
      extra={
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 transition-all px-6 py-2 text-base"
        >
          Refresh Page
        </Button>
      }
      style={{
        backgroundColor: "#f0f5ff",
        borderRadius: 12,
        padding: "2rem",
      }}
    />
  );

  const renderSubmitButtons = () => {
    const isEditMode = isEditing && todayTask;
    const buttonText = submissionSuccess
      ? isEditMode
        ? "Plan Updated!"
        : "Plan Submitted!"
      : loading
      ? isEditMode
        ? "Updating..."
        : "Submitting..."
      : isEditMode
      ? "Update Daily Plan"
      : "Submit Daily Plan";
    const icon = submissionSuccess ? <CheckCircleOutlined /> : <SendOutlined />;
    const buttonClass = `h-8 rounded-md shadow-md hover:shadow-lg font-medium text-base transition-all ${
      submissionSuccess
        ? "bg-green-500 hover:bg-green-600 border-none"
        : "bg-gradient-to-r from-blue-[#008cba] to-blue-[#008cba] border-none"
    }`;

    if (isEditMode) {
      return (
        <Space style={{ display: "flex", gap: 8, width: "100%" }}>
          <Button
            block
            onClick={() => {
              form.resetFields();
              setIsEditing(false);
            }}
            className="flex-1 h-8 rounded-md"
          >
            Cancel
          </Button>
          <Button
            style={{
              color: "#f7f7f7",
              backgroundColor: "#008cba",
              border: "#008cba",
            }}
            htmlType="submit"
            loading={loading}
            block
          
            className={`flex-1 ${buttonClass}`}
          >
            {buttonText}
          </Button>
        </Space>
      );
    }

    return (
      <Button
        style={{
          color: "#f7f7f7",
          backgroundColor: "#008cba",
          border: "#008cba",
        }}
        htmlType="submit"
        loading={loading}
        block
        icon={icon}
        className={buttonClass}
      >
        {buttonText}
      </Button>
    );
  };

  const renderFormState = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="space-y-5"
      size="large"
    >
      <Form.Item
        name="planOftheDay"
        label={
          <span className="text-gray-700 font-medium text-sm sm:text-base flex items-center">
            {isEditing
              ? "Edit your plan for today?"
              : "What's your plan for today?"}
          </span>
        }
        rules={[
          {
            required: true,
            message: "Please enter your plan for the day!",
          },
          {
            min: 30,
            message: "Your plan should be at least 30 characters",
          },
        ]}
      >
        <TextArea
          rows={4}
          placeholder="Describe your tasks and goals for today..."
          maxLength={8000}
          showCount
          className="border-gray-300 rounded-lg text-sm focus:border-blue-500 hover:border-blue-400 transition-all"
        />
      </Form.Item>

      <Form.Item
        name="taskTeam"
        label={
          <span className="text-gray-700 font-medium text-sm sm:text-base flex items-center">
            Select Team
          </span>
        }
        rules={
          isEditing
            ? []
            : [{ required: true, message: "Please select a team!" }]
        }
      >
        <Select
          placeholder="Select your team"
          className="rounded-lg"
          size="large"
          optionLabelProp="label"
          showSearch
          disabled={isEditing}
          filterOption={(input, option) =>
            (typeof option?.label === "string" &&
              option.label.toLowerCase().includes(input.toLowerCase())) ??
            false
          }
        >
          {TEAM_OPTIONS.map((team) => (
            <Option key={team} value={team} label={formatTeamName(team)}>
              <div className="flex items-center py-1">
                <Tag color={TEAM_COLORS[team] || "default"} className="mr-2">
                  {team.charAt(0)}
                </Tag>
                <span>{formatTeamName(team)}</span>
              </div>
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Divider className="my-6" />

      <Form.Item className="mb-0">{renderSubmitButtons()}</Form.Item>
    </Form>
  );

  return (
    <UserPanelLayout>
      <div className="sm:p-2 md:p-4 lg:p-6 min-h-screen">
        <Card
          className="max-w-xl mx-auto shadow-lg rounded-xl overflow-hidden border-0 transition-all duration-300 hover:shadow-xl"
          bodyStyle={{ padding: 0 }}
        >
          <div className="bg-gradient-to-r p-5 md:p-6 text-black">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Title
                  level={4}
                  className="text-white mb-1 text-xl sm:text-2xl md:text-3xl font-bold"
                >
                  Daily Plan Of The Day
                </Title>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Text className="text-black text-xs sm:text-sm flex items-center opacity-90">
                    <CalendarOutlined className="mr-1" />
                    {currentDate}
                  </Text>
                  {userName && (
                    <Tag
                      icon={<UserOutlined />}
                      color="blue"
                      className="ml-0 sm:ml-2 bg-blue-800 border-blue-700"
                    >
                      {userName}
                    </Tag>
                  )}
                </div>
              </div>
              <Tooltip title="Daily Planning">
                <Avatar
                  size={{ xs: 48, sm: 56, md: 64 }}
                  icon={<CalendarOutlined />}
                  className="bg-white text-blue-700 shadow-md hover:scale-105 transition-transform"
                />
              </Tooltip>
            </div>
          </div>

          <div className="p-5 md:p-6 lg:p-8">
            {fetchingStatus
              ? renderLoadingState()
              : errorState
              ? renderErrorState()
              : isSubmitted
              ? isEditing
                ? renderFormState()
                : renderSubmittedState()
              : isSubmissionWindowOpen
              ? renderFormState()
              : renderClosedState()}
          </div>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

export default PlanOfTheDay;
