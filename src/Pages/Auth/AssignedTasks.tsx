import React, { useState, useEffect } from "react";
import UserPanelLayout from "./UserPanelLayout";
import BASE_URL from "../../Config";
import axios from "axios";
import {
  Card,
  Typography,
  Button,
  Spin,
  Empty,
  Divider,
  Badge,
  notification,
  Tag,
  Avatar,
  Progress,
  Timeline,
  Tooltip,
  Select,
  Space,
  Input,
} from "antd";
import {
  ReloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  FlagOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
  BarsOutlined,
  FilterOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;

interface AssignedTask {
  taskcontent: string;
  createdby: string;
  taskassingnedby: string;
  admindocumentid: string | null;
  id: string;
  message: string;
  priority?: "high" | "medium" | "low";
  dueDate?: string;
  status?: "pending" | "completed";
  createdAt?: string;
}

// Consistent button style with fixed dimensions
const buttonStyle = {
  height: "38px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 16px",
};

const AssignedTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<AssignedTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<AssignedTask[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchAssignedTasks();
  }, []);

  // Filter tasks based on search and filters
  useEffect(() => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.taskcontent.toLowerCase().includes(term) ||
          task.taskassingnedby.toLowerCase().includes(term) ||
          task.createdby.toLowerCase().includes(term)
      );
    }

    // Apply priority filter
    if (filterPriority !== "all") {
      filtered = filtered.filter((task) => task.priority === filterPriority);
    }

    // Apply status filter
    if (filterStatus !== "all") {
      const isCompleted = filterStatus === "completed";
      filtered = filtered.filter((task) =>
        isCompleted
          ? completedTasks.includes(task.id)
          : !completedTasks.includes(task.id)
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, filterPriority, filterStatus, completedTasks]);

  const fetchAssignedTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/user-service/write/getTaskData`,
        {
          headers: {
            accept: "*/*",
          },
        }
      );

      // Enhance tasks with additional UI data
      const enhancedTasks = response.data.map(
        (task: AssignedTask, index: number) => {
          // Create deterministic priorities based on index for demo
          const priorities = ["high", "medium", "low"];
          const priority = priorities[index % 3] as "high" | "medium" | "low";

          // Create realistic due dates (1-7 days from now)
          const daysToAdd = (index % 7) + 1;
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + daysToAdd);

          // Create a creation date (1-30 days ago)
          const creationDate = new Date();
          creationDate.setDate(creationDate.getDate() - (index % 30) - 1);

          return {
            ...task,
            priority,
            dueDate: dueDate.toISOString().split("T")[0],
            createdAt: creationDate.toISOString().split("T")[0],
            status: "pending",
          };
        }
      );

      setTasks(enhancedTasks);
      setFilteredTasks(enhancedTasks);

      if (enhancedTasks.length === 0) {
        notification.info({
          message: "No Tasks Found",
          description: "You don't have any assigned tasks at the moment.",
          placement: "topRight",
          duration: 4,
        });
      } else {
        notification.success({
          message: "Tasks Loaded",
          description: `${enhancedTasks.length} tasks retrieved successfully.`,
          placement: "topRight",
          duration: 3,
        });
      }
    } catch (error) {
      console.error("Error fetching assigned tasks:", error);
      notification.error({
        message: "Error Loading Tasks",
        description: "Failed to fetch assigned tasks. Please try again.",
        placement: "topRight",
        duration: 4,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = (taskId: string) => {
    setCompletedTasks([...completedTasks, taskId]);

    notification.success({
      message: "Task Completed",
      description: "The task has been marked as complete.",
      placement: "topRight",
      duration: 3,
      icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
    });
  };

  const handleUnmarkComplete = (taskId: string) => {
    setCompletedTasks(completedTasks.filter((id) => id !== taskId));

    notification.info({
      message: "Task Reopened",
      description: "The task has been marked as pending.",
      placement: "topRight",
      duration: 3,
      icon: <ClockCircleOutlined style={{ color: "#1890ff" }} />,
    });
  };

  const getPriorityColor = (priority?: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "blue";
    }
  };

  const getPriorityIcon = (priority?: "high" | "medium" | "low") => {
    return priority === "high" ? (
      <ExclamationCircleOutlined style={{ color: "#f5222d" }} />
    ) : (
      <FlagOutlined
        style={{ color: priority === "medium" ? "#fa8c16" : "#52c41a" }}
      />
    );
  };

  const getDaysRemaining = (dueDate?: string) => {
    if (!dueDate) return 0;

    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderTaskCard = (task: AssignedTask) => {
    const isCompleted = completedTasks.includes(task.id);
    const priorityColor = getPriorityColor(task.priority);
    const daysRemaining = getDaysRemaining(task.dueDate);

    // Calculate urgency for progress bar
    let urgencyColor = "green";
    if (daysRemaining <= 1) urgencyColor = "red";
    else if (daysRemaining <= 3) urgencyColor = "orange";

    // Calculate progress percentage (inverse of days remaining)
    const urgencyPercent = isCompleted
      ? 100
      : Math.max(0, Math.min(100, (7 - daysRemaining) * 14));

    return (
      <Card
        key={task.id}
        className="mb-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
        headStyle={{
          backgroundColor: isCompleted ? "#f6ffed" : "#f0f7ff",
          borderBottom: `1px solid ${isCompleted ? "#b7eb8f" : "#bae0ff"}`,
          borderRadius: "8px 8px 0 0",
          padding: "16px 24px",
        }}
        bodyStyle={{
          padding: "20px",
        }}
        title={
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar
                style={{ backgroundColor: isCompleted ? "#52c41a" : "#1890ff" }}
                icon={
                  isCompleted ? <CheckCircleOutlined /> : <FileTextOutlined />
                }
              />
              <div>
                <Text strong className="text-lg text-gray-800 block">
                  Task from {task.taskassingnedby}
                </Text>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Tag color="blue" icon={<UserOutlined />}>
                    {task.createdby}
                  </Tag>
                  <Tag
                    color={priorityColor}
                    icon={getPriorityIcon(task.priority)}
                  >
                    {task.priority} Priority
                  </Tag>
                  <Tag color={isCompleted ? "success" : "processing"}>
                    {isCompleted ? "COMPLETED" : "PENDING"}
                  </Tag>
                </div>
              </div>
            </div>
            <div className="hidden sm:block">
              <Badge
                status={isCompleted ? "success" : "processing"}
                text={isCompleted ? "COMPLETED" : "PENDING"}
                className={isCompleted ? "text-green-600" : "text-blue-600"}
              />
            </div>
          </div>
        }
      >
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
          <Text className="text-gray-700 font-medium block mb-3">
            <FileTextOutlined className="mr-2" />
            Task Details:
          </Text>
          <div className="bg-white p-4 rounded-md border border-gray-100 shadow-inner">
            <Paragraph
              className="whitespace-pre-wrap text-gray-700 mb-0"
              ellipsis={{ rows: 3, expandable: true, symbol: "Read more" }}
            >
              {task.taskcontent}
            </Paragraph>
          </div>
        </div>

        {/* <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <Text className="text-gray-600 text-sm">
              {isCompleted ? "Completed" : "Due in"}{" "}
              {isCompleted ? "" : `${daysRemaining} days`}
            </Text>
            <Text className="text-right text-gray-600 text-sm">
              {isCompleted ? "100%" : `${urgencyPercent}%`}
            </Text>
          </div>
          <Progress
            percent={urgencyPercent}
            status={
              isCompleted
                ? "success"
                : urgencyColor === "red"
                ? "exception"
                : "active"
            }
            showInfo={false}
            strokeColor={
              isCompleted
                ? "#52c41a"
                : urgencyColor === "orange"
                ? "#fa8c16"
                : undefined
            }
            size="small"
          />
        </div> */}

        <div className="mt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-2 text-gray-500">
            <div className="flex items-center gap-2">
              <CalendarOutlined />
              <Text className="text-sm">
                Created At: {formatDate(task.createdAt)}
              </Text>
            </div>
            {/* <div className="flex items-center gap-2">
              <CalendarOutlined />
              <Text className="text-sm">Due: {formatDate(task.dueDate)}</Text>
            </div> */}
            <Text className="text-xs text-gray-400">
              Task ID: #{task.id.substring(0, 4)}
            </Text>
          </div>

          {isCompleted ? (
            <Button
              style={buttonStyle}
              onClick={() => handleUnmarkComplete(task.id)}
              icon={<ClockCircleOutlined />}
              className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
            >
              Mark as Pending
            </Button>
          ) : (
            <Button
              type="primary"
              style={buttonStyle}
              className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 shadow-sm"
              onClick={() => handleMarkComplete(task.id)}
              icon={<CheckCircleOutlined />}
            >
              Mark as Complete
            </Button>
          )}
        </div>
      </Card>
    );
  };

  // Calculate completion statistics
  const totalTasks = tasks.length;
  const completedTasksCount = completedTasks.length;
  const pendingTasksCount = totalTasks - completedTasksCount;
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  return (
    <UserPanelLayout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <Card
          className="mb-6 shadow-md border-0 rounded-lg overflow-hidden"
          bodyStyle={{ padding: "0" }}
        >
          <div className="bg-gradient-to-r  p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <Title level={2} className="text-white mb-1">
                  List of Tasks Assigned by Admin
                </Title>
                <Text className="text-blue-800">
                  View and manage your assigned tasks
                </Text>
              </div>

              <Button
                onClick={fetchAssignedTasks}
                icon={<ReloadOutlined />}
                style={buttonStyle}
                className="mt-4 md:mt-0 bg-white/20 text-white border-white/30 hover:bg-white/30 hover:border-white/40 backdrop-blur-sm"
              >
                Refresh Tasks
              </Button>
            </div>
          </div>

          {tasks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white border-b border-gray-200">
              <Card className="flex-1 border-blue-100">
                <Statistic
                  title="Total Tasks"
                  value={totalTasks}
                  prefix={<FileTextOutlined />}
                  className="text-blue-600"
                />
              </Card>
              <Card className="flex-1 border-green-100">
                <Statistic
                  title="Completed"
                  value={completedTasksCount}
                  prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                  className="text-green-600"
                />
              </Card>
              <Card className="flex-1 border-orange-100">
                <div>
                  <Text className="text-gray-500 block mb-2">
                    Completion Progress
                  </Text>
                  <Progress
                    percent={completionPercentage}
                    status={completionPercentage === 100 ? "success" : "active"}
                    strokeColor={{
                      from: "#108ee9",
                      to: "#52c41a",
                    }}
                  />
                </div>
              </Card>
            </div>
          )}

          {tasks.length > 0 && (
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <Text className="text-gray-600 font-medium block mb-2">
                    <SearchOutlined className="mr-1" /> Search Tasks
                  </Text>
                  <Search
                    placeholder="Search by task content, creator or assignee"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    allowClear
                    style={{ width: "100%" }}
                  />
                </div>
               
              </div>
            </div>
          )}

          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Spin size="large" />
                <Text className="mt-4 text-gray-500">
                  Loading your tasks...
                </Text>
              </div>
            ) : filteredTasks.length > 0 ? (
              <div className="space-y-6">
                {filteredTasks.map(renderTaskCard)}
              </div>
            ) : tasks.length > 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="text-center">
                    <Text className="text-gray-500 block mb-2">
                      No matching tasks found
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      Try adjusting your search criteria or filters
                    </Text>
                  </div>
                }
                className="py-16"
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="text-center">
                    <Text className="text-gray-500 block mb-2">
                      No assigned tasks found
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      When tasks are assigned to you, they will appear here
                    </Text>
                  </div>
                }
                className="py-16"
              />
            )}
          </div>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

// Custom Statistic component for the dashboard
const Statistic: React.FC<{
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  className?: string;
}> = ({ title, value, prefix, className }) => {
  return (
    <div className={`${className || ""}`}>
      <div className="text-gray-500 text-sm mb-1">{title}</div>
      <div className="flex items-center gap-2">
        {prefix && <span className="text-xl">{prefix}</span>}
        <span className="text-2xl font-semibold">{value}</span>
      </div>
    </div>
  );
};

export default AssignedTasksPage;
