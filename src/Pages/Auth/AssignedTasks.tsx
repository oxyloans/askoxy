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
  message,
  notification,
  Tag,
  Avatar,
  Progress,
  Timeline,
} from "antd";
import {
  ReloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

interface AssignedTask {
  taskcontent: string;
  createdby: string;
  taskassingnedby: string;
  admindocumentid: string | null;
  id: string;
  message: string;
  // Added for UI enhancement
  priority?: "high" | "medium" | "low";
  dueDate?: string;
}

const AssignedTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<AssignedTask[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchAssignedTasks();
  }, []);

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

      // Adding mock data for UI enhancement
      const enhancedTasks = response.data.map((task: AssignedTask) => ({
        ...task,
        priority: ["high", "medium", "low"][Math.floor(Math.random() * 3)] as
          | "high"
          | "medium"
          | "low",
        dueDate: new Date(
          Date.now() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
        )
          .toISOString()
          .split("T")[0],
      }));

      setTasks(enhancedTasks);

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

  const renderTaskCard = (task: AssignedTask) => {
    const isCompleted = completedTasks.includes(task.id);
    const priorityColor = getPriorityColor(task.priority);

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
                <div className="flex gap-2 mt-1">
                  <Tag color="blue" icon={<UserOutlined />}>
                    {task.createdby}
                  </Tag>
                  {/* <Tag color={priorityColor} className="capitalize">
                    {task.priority} Priority
                  </Tag> */}
                </div>
              </div>
            </div>
            <Badge
              status={isCompleted ? "success" : "processing"}
              text={isCompleted ? "COMPLETED" : "PENDING"}
              className={isCompleted ? "text-green-600" : "text-blue-600"}
            />
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

        <div className="mt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-2 text-gray-500">
            <div className="flex items-center gap-2">
              <CalendarOutlined />
              <Text className="text-sm">Due: {task.dueDate}</Text>
            </div>
            <Text className="text-xs text-gray-400">
              Task ID: {task.id.substring(0, 8)}...
            </Text>
          </div>

          {isCompleted ? (
            <Button
              type="default"
              className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
              icon={<CheckCircleOutlined />}
              disabled
            >
              Completed
            </Button>
          ) : (
            <Button
              type="primary"
              className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 shadow-sm"
              onClick={() => handleMarkComplete(task.id)}
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
                  Assigned Tasks
                </Title>
                <Text className="text-blue-800 opacity-90">
                  View and manage your assigned tasks
                </Text>
              </div>

              <Button
                onClick={fetchAssignedTasks}
                icon={<ReloadOutlined />}
                className="mt-4 md:mt-0 bg-white/20 text-white border-white/30 hover:bg-white/30 hover:border-white/40 backdrop-blur-sm"
              >
                Refresh Tasks
              </Button>
            </div>
          </div>

          {tasks.length > 0 && (
            <div className="flex flex-wrap gap-6 px-6 py-4 bg-white border-b border-gray-200">
              <Card className="flex-1 min-w-[200px] border-blue-100">
                <Statistic
                  title="Total Tasks"
                  value={totalTasks}
                  prefix={<FileTextOutlined />}
                  className="text-blue-600"
                />
              </Card>
              <Card className="flex-1 min-w-[200px] border-green-100">
                <Statistic
                  title="Completed"
                  value={completedTasksCount}
                  prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                  className="text-green-600"
                />
              </Card>
              <Card className="flex-1 min-w-[200px] border-orange-100">
                <div>
                  <Text className="text-gray-500 block mb-2">Completion</Text>
                  <Progress
                    percent={completionPercentage}
                    status={completionPercentage === 100 ? "success" : "active"}
                  />
                </div>
              </Card>
            </div>
          )}

          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Spin size="small" />
                <Text className="mt-4 text-gray-500">
                  Loading your tasks...
                </Text>
              </div>
            ) : tasks.length > 0 ? (
              <div className="space-y-6">{tasks.map(renderTaskCard)}</div>
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

// Create a custom Statistic component since we're adding it
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
