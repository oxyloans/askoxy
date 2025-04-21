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
  Badge,
  notification,
  Tag,
  Avatar,
  Progress,
  Input,
  Drawer,
  Select,
  Space,
  Row,
  Col,
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
  FilterOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

interface AssignedTask {
  taskcontent: string;
  createdby: string;
  taskassingnedby: string;
  admindocumentid: string | null;
  id: string;
  message: string;
  priority: string;
  dueDate?: string;
  status: number; // 1: Created, 2: Accepted, 3: Pending, 4: Completed
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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {}
  );
  const [filterDrawerVisible, setFilterDrawerVisible] =
    useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Media query for responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

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
      filtered = filtered.filter(
        (task) => task.status === parseInt(filterStatus)
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, filterPriority, filterStatus]);

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

      // Enhance tasks with additional UI data, but keep the original priority
      const enhancedTasks = response.data.map(
        (task: AssignedTask, index: number) => {
          // Create realistic due dates (1-7 days from now)
          const daysToAdd = (index % 7) + 1;
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + daysToAdd);

          // Create a creation date (1-30 days ago)
          const creationDate = new Date();
          creationDate.setDate(creationDate.getDate() - (index % 30) - 1);

          return {
            ...task,
            // Use the priority from the API response, with a fallback if undefined
            priority: task.priority || "low", // Fallback to "low" if priority is missing
            dueDate: dueDate.toISOString().split("T")[0],
            createdAt: creationDate.toISOString().split("T")[0],
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

  const updateTaskStatus = async (taskId: string, newStatus: number) => {
    // Set the specific task to loading state
    setActionLoading((prev) => ({ ...prev, [taskId]: true }));

    // Convert number status to string action
    let action: string;
    switch (newStatus) {
      case 1:
        action = "create";
        break;
      case 2:
        action = "accept";
        break;
      case 3:
        action = "pending";
        break;
      case 4:
        action = "complete";
        break;
      default:
        action = "accept";
    }

    try {
      // Make the status update API call
      const response = await axios.post(
        `${BASE_URL}/user-service/write/tasks/${taskId}/status`,
        {}, // Empty body
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
          params: {
            action: action, // Send action as a URL parameter
          },
        }
      );

      // Handle success response
      if (response.data && response.data.message) {
        notification.success({
          message: "Status Updated",
          description: response.data.message,
          placement: "topRight",
          duration: 3,
        });

        // Temporarily update the local state for immediate feedback
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );

        // Then fetch the updated data from server
        setTimeout(() => {
          fetchAssignedTasks();
        }, 300); // Small delay to ensure server has processed the update
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      notification.error({
        message: "Update Failed",
        description: "Failed to update task status. Please try again.",
        placement: "topRight",
        duration: 4,
      });
    } finally {
      // Remove loading state for this task
      setActionLoading((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  const getNextStatus = (currentStatus: number) => {
    switch (currentStatus) {
      case 1: // Created
        return 2; // Next: Accepted
      case 2: // Accepted
        return 3; // Next: Pending
      case 3: // Pending
        return 4; // Next: Completed
      case 4: // Completed
        return 3; // Back to: Pending (if user wants to reopen)
      default:
        return 2;
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return "Created";
      case 2:
        return "Accepted";
      case 3:
        return "Pending";
      case 4:
        return "Completed";
      default:
        return "Unknown";
    }
  };

  const getActionButtonText = (status: number) => {
    switch (status) {
      case 1:
        return "Accept Task";
      case 2:
        return "Mark as Pending";
      case 3:
        return "Mark as Completed";
      case 4:
        return "Reopen Task";
      default:
        return "Update Status";
    }
  };

  const getActionButtonIcon = (status: number) => {
    switch (status) {
      case 1:
        return <CheckCircleOutlined />;
      case 2:
        return <ClockCircleOutlined />;
      case 3:
        return <CheckCircleOutlined />;
      case 4:
        return <ClockCircleOutlined />;
      default:
        return <CheckCircleOutlined />;
    }
  };

  const getActionButtonStyle = (status: number) => {
    switch (status) {
      case 1:
        return "bg- rgb(240, 247, 255) hover:bg-rgb(240, 247, 255) border-green-600";
      case 2:
        return "bg-blue-600 hover:bg-blue-700 border-blue-600";
      case 3:
        return "bg-green-600 hover:bg-green-700 border-green-600";
      case 4:
        return "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100";
      default:
        return "bg-blue-600 hover:bg-blue-700 border-blue-600";
    }
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

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return "blue";
      case 2:
        return "purple";
      case 3:
        return "orange";
      case 4:
        return "green";
      default:
        return "default";
    }
  };

  const getStatusBadge = (status: number) => {
    const statusName = getStatusText(status);

    return (
      <Badge
        status={
          status === 4
            ? "success"
            : status === 1
            ? "processing"
            : status === 2
            ? "processing"
            : "warning"
        }
        text={statusName}
        className={
          status === 4
            ? "text-green-600"
            : status === 3
            ? "text-orange-600"
            : status === 2
            ? "text-purple-600"
            : "text-blue-600"
        }
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
    const priorityColor = getPriorityColor(task.priority as "high" | "medium" | "low" | undefined);
    const daysRemaining = getDaysRemaining(task.dueDate);
    const isCompleted = task.status === 4;
    const nextStatus = getNextStatus(task.status);

    // Calculate urgency for progress bar
    let urgencyColor = "green";
    if (daysRemaining <= 1) urgencyColor = "red";
    else if (daysRemaining <= 3) urgencyColor = "orange";

    // Calculate progress percentage
    const urgencyPercent = isCompleted
      ? 100
      : Math.max(0, Math.min(100, (7 - daysRemaining) * 14));

    return (
      <Card
        key={task.id}
        className="mb-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
        headStyle={{
          backgroundColor: isCompleted
            ? "#f6ffed"
            : task.status === 3
            ? "#fff7e6"
            : task.status === 2
            ? "#f9f0ff"
            : "#f0f7ff",
          borderBottom: `1px solid ${
            isCompleted
              ? "#b7eb8f"
              : task.status === 3
              ? "#ffe7ba"
              : task.status === 2
              ? "#d3adf7"
              : "#bae0ff"
          }`,
          borderRadius: "8px 8px 0 0",
          padding: isMobile ? "12px 16px" : "16px 24px",
        }}
        bodyStyle={{
          padding: isMobile ? "16px" : "20px",
        }}
        title={
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <Avatar
                style={{
                  backgroundColor:
                    task.status === 4
                      ? "#52c41a"
                      : task.status === 3
                      ? "#fa8c16"
                      : task.status === 2
                      ? "#722ed1"
                      : "#1890ff",
                }}
                icon={
                  task.status === 4 ? (
                    <CheckCircleOutlined />
                  ) : (
                    <FileTextOutlined />
                  )
                }
              />
              <div>
                <Text
                  strong
                  className={`${
                    isMobile ? "text-base" : "text-lg"
                  } text-gray-800 block`}
                >
                  Task from {task.taskassingnedby}
                </Text>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Tag color="blue" icon={<UserOutlined />}>
                    {task.createdby}
                  </Tag>
                  <Tag
                    color={priorityColor}
                    icon={getPriorityIcon(task.priority as "high" | "medium" | "low" | undefined)}
                  >
                    {task.priority} Priority
                  </Tag>
                  <Tag color={getStatusColor(task.status)}>
                    {getStatusText(task.status)}
                  </Tag>
                </div>
              </div>
            </div>
            <div className="hidden sm:block">{getStatusBadge(task.status)}</div>
          </div>
        }
      >
        <div className="bg-gray-50 p-3 sm:p-5 rounded-lg border border-gray-100">
          <Text className="text-gray-700 font-medium block mb-3">
            <FileTextOutlined className="mr-2" />
            Task Details:
          </Text>
          <div className="bg-white p-3 sm:p-4 rounded-md border border-gray-100 shadow-inner">
            <Paragraph
              className="whitespace-pre-wrap text-gray-700 mb-0"
              ellipsis={{
                rows: isMobile ? 2 : 3,
                expandable: true,
                symbol: "Read more",
              }}
            >
              {task.taskcontent}
            </Paragraph>
          </div>
        </div>

        <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-2 text-gray-500">
            <div className="flex items-center gap-2">
              <CalendarOutlined />
              <Text className={isMobile ? "text-xs" : "text-sm"}>
                Created At: {formatDate(task.createdAt)}
              </Text>
            </div>
            <Text
              className={`${isMobile ? "text-xs" : "text-sm"} text-gray-400`}
            >
              Task ID: #{task.id.substring(0, 8)}
            </Text>
          </div>

          <Button
            type={task.status === 4 ? "default" : "primary"}
            style={buttonStyle}
            className={`${getActionButtonStyle(task.status)} shadow-sm ${
              isMobile ? "w-full mt-2" : ""
            }`}
            onClick={() => updateTaskStatus(task.id, nextStatus)}
            icon={getActionButtonIcon(task.status)}
            loading={actionLoading[task.id]}
            block={isMobile}
          >
            {getActionButtonText(task.status)}
          </Button>
        </div>
      </Card>
    );
  };

  // Calculate completion statistics
  const totalTasks = tasks.length;
  const completedTasksCount = tasks.filter((task) => task.status === 4).length;
  const pendingTasksCount = tasks.filter((task) => task.status === 3).length;
  const acceptedTasksCount = tasks.filter((task) => task.status === 2).length;
  const createdTasksCount = tasks.filter((task) => task.status === 1).length;
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  // Filter drawer for mobile
  const renderFilterDrawer = () => (
    <Drawer
      title="Filter Tasks"
      placement="right"
      onClose={() => setFilterDrawerVisible(false)}
      visible={filterDrawerVisible}
      width={isMobile ? "85%" : 320}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Text strong className="block mb-2">
            Priority
          </Text>
          <Select
            value={filterPriority}
            onChange={(value) => setFilterPriority(value)}
            style={{ width: "100%" }}
          >
            <Option value="all">All Priorities</Option>
            <Option value="high">High</Option>
            <Option value="medium">Medium</Option>
            <Option value="low">Low</Option>
          </Select>
        </div>

        <div>
          <Text strong className="block mb-2">
            Status
          </Text>
          <Select
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            style={{ width: "100%" }}
          >
            <Option value="all">All Statuses</Option>
            <Option value="1">Created</Option>
            <Option value="2">Accepted</Option>
            <Option value="3">Pending</Option>
            <Option value="4">Completed</Option>
          </Select>
        </div>

        <Button
          type="primary"
          onClick={() => {
            setFilterPriority("all");
            setFilterStatus("all");
            setSearchTerm("");
          }}
          block
        >
          Reset Filters
        </Button>
      </Space>
    </Drawer>
  );

  return (
    <UserPanelLayout>
      <div className="p-3 md:p-6 bg-gray-50 min-h-screen">
        <Card
          className="mb-6 shadow-md border-0 rounded-lg overflow-hidden"
          bodyStyle={{ padding: "0" }}
        >
          <div className="bg-gradient-to-r  p-4 md:p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <Title level={isMobile ? 3 : 2} className="text-white mb-1">
                  List of Tasks Assigned
                </Title>
                <Text className="text-blue-800">
                  View and manage your assigned tasks
                </Text>
              </div>

              <Button
                onClick={fetchAssignedTasks}
                icon={<ReloadOutlined />}
                style={buttonStyle}
                className="mt-4 md:mt-0 bg-white/20 text-black border-white/30 hover:bg-white/30 hover:border-white/40 backdrop-blur-sm"
              >
                Refresh Tasks
              </Button>
            </div>
          </div>

          {tasks.length > 0 && (
            <div
              className={`${
                isMobile ? "py-3 px-4" : "p-4"
              } bg-white border-b border-gray-200`}
            >
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={12} md={6}>
                  <Card className="h-full border-blue-100">
                    <Statistic
                      title="Total Tasks"
                      value={totalTasks}
                      prefix={<FileTextOutlined />}
                      className="text-blue-600"
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                  <Card className="h-full border-purple-100">
                    <Statistic
                      title="Created"
                      value={createdTasksCount}
                      prefix={<FileTextOutlined style={{ color: "#1890ff" }} />}
                      className="text-blue-600"
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                  <Card className="h-full border-orange-100">
                    <Statistic
                      title="Pending"
                      value={pendingTasksCount}
                      prefix={
                        <ClockCircleOutlined style={{ color: "#fa8c16" }} />
                      }
                      className="text-orange-600"
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                  <Card className="h-full border-green-100">
                    <Statistic
                      title="Completed"
                      value={completedTasksCount}
                      prefix={
                        <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      }
                      className="text-green-600"
                    />
                  </Card>
                </Col>
                <Col span={24}>
                  <Card className="border-blue-100">
                    <div>
                      <Text className="text-gray-500 block mb-2">
                        Completion Progress
                      </Text>
                      <Progress
                        percent={completionPercentage}
                        status={
                          completionPercentage === 100 ? "success" : "active"
                        }
                        strokeColor={{
                          from: "#108ee9",
                          to: "#52c41a",
                        }}
                      />
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          )}

          {tasks.length > 0 && (
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <Text className="text-gray-600 font-medium block mb-2">
                    <SearchOutlined className="mr-1" /> Search Tasks
                  </Text>
                  <div className="flex gap-2">
                    <Search
                      placeholder="Search by content, creator or assignee"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      allowClear
                      style={{ width: "100%" }}
                    />
                    {isMobile && (
                      <Button
                        icon={<FilterOutlined />}
                        onClick={() => setFilterDrawerVisible(true)}
                      />
                    )}
                  </div>
                </div>

                {!isMobile && (
                  <Space>
                    <Select
                      placeholder="Priority"
                      value={filterPriority}
                      onChange={(value) => setFilterPriority(value)}
                      style={{ width: 120 }}
                    >
                      <Option value="all">All Priorities</Option>
                      <Option value="high">High</Option>
                      <Option value="medium">Medium</Option>
                      <Option value="low">Low</Option>
                    </Select>

                    <Select
                      placeholder="Status"
                      value={filterStatus}
                      onChange={(value) => setFilterStatus(value)}
                      style={{ width: 120 }}
                    >
                      <Option value="all">All Statuses</Option>
                      <Option value="1">Created</Option>
                      <Option value="2">Accepted</Option>
                      <Option value="3">Pending</Option>
                      <Option value="4">Completed</Option>
                    </Select>

                    <Button
                      onClick={() => {
                        setFilterPriority("all");
                        setFilterStatus("all");
                        setSearchTerm("");
                      }}
                    >
                      Reset
                    </Button>
                  </Space>
                )}
              </div>
            </div>
          )}

          <div className="p-3 md:p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Spin size="small" />
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
      {renderFilterDrawer()}
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
