import React, { useState, useEffect } from "react";
import UserPanelLayout from "./UserPanelLayout";
import BASE_URL from "../Config";
import axios from "axios";
import {
  Card,
  Typography,
  Button,
  Spin,
  Empty,
  Badge,
  message,
  Tag,
  Avatar,
  Input,
  Drawer,
  Select,
  Space,
  Row,
  Col,
  Tooltip,
  Modal,
  Form,
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
  SortAscendingOutlined,
  LinkOutlined,
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

// Consistent button style
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
  const [sortBy, setSortBy] = useState<string>("dueDate");
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {}
  );
  const [filterDrawerVisible, setFilterDrawerVisible] =
    useState<boolean>(false);
  const [screenSize, setScreenSize] = useState<string>("desktop");
  const [commentModalVisible, setCommentModalVisible] =
    useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [commentForm] = Form.useForm();

  // Responsive design media query
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 576) setScreenSize("xs");
      else if (width < 768) setScreenSize("sm");
      else if (width < 992) setScreenSize("md");
      else if (width < 1200) setScreenSize("lg");
      else setScreenSize("xl");
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const isMobile = screenSize === "xs";
  const isTablet = screenSize === "sm" || screenSize === "md";
  const isDesktop = screenSize === "lg" || screenSize === "xl";

  // Fetch tasks on mount
  useEffect(() => {
    fetchAssignedTasks();
  }, []);

  // Filter and sort tasks
  useEffect(() => {
    let filtered = [...tasks];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.taskcontent.toLowerCase().includes(term) ||
          task.taskassingnedby.toLowerCase().includes(term) ||
          task.createdby.toLowerCase().includes(term)
      );
    }

    if (filterPriority !== "all") {
      filtered = filtered.filter((task) => task.priority === filterPriority);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (task) => task.status === parseInt(filterStatus)
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return (
            new Date(a.dueDate || "").getTime() -
            new Date(b.dueDate || "").getTime()
          );
        case "priority":
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          return (
            priorityOrder[a.priority as keyof typeof priorityOrder] -
            priorityOrder[b.priority as keyof typeof priorityOrder]
          );
        case "status":
          return a.status - b.status;
        case "createdAt":
          return (
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
          );
        default:
          return 0;
      }
    });

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, filterPriority, filterStatus, sortBy]);

  // Fetch tasks from API
  const fetchAssignedTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/user-service/write/getTaskData`,
        { headers: { accept: "*/*" } }
      );

      const enhancedTasks = response.data.map(
        (task: AssignedTask, index: number) => {
          const daysToAdd = (index % 7) + 1;
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + daysToAdd);

          const creationDate = new Date();
          creationDate.setDate(creationDate.getDate() - (index % 30) - 1);

          return {
            ...task,
            priority: task.priority || "low",
            dueDate: dueDate.toISOString().split("T")[0],
            createdAt: creationDate.toISOString().split("T")[0],
          };
        }
      );

      setTasks(enhancedTasks);
      setFilteredTasks(enhancedTasks);

      message.info({
        content:
          enhancedTasks.length === 0
            ? "No assigned tasks at the moment."
            : `${enhancedTasks.length} tasks retrieved.`,
        key: "tasksLoaded",
        duration: 3,
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      message.error({
        content: "Failed to fetch tasks. Please try again.",
        key: "fetchError",
        duration: 4,
      });
    } finally {
      setLoading(false);
    }
  };

  // Update task status
  const updateTaskStatus = async (
    taskId: string,
    newStatus: number,
    commentData?: { comment: string; link?: string }
  ) => {
    if (newStatus === 4 && !commentData) {
      // Show comment modal for completed tasks
      setSelectedTaskId(taskId);
      setCommentModalVisible(true);
      return;
    }

    message.loading({
      content: "Updating task status...",
      key: taskId,
      duration: 0,
    });
    setActionLoading((prev) => ({ ...prev, [taskId]: true }));

    const action =
      { 1: "create", 2: "accept", 3: "pending", 4: "complete" }[newStatus] ||
      "accept";

    try {
      // Update task status
      const response = await axios.post(
        `${BASE_URL}/user-service/write/tasks/${taskId}/status`,
        {},
        {
          headers: { "Content-Type": "application/json", accept: "*/*" },
          params: { action },
        }
      );

      // Submit comment and link if task is completed
      if (newStatus === 4 && commentData) {
        await axios.post(
          `${BASE_URL}/user-service/write/comments/${taskId}`,
          {
            comment: commentData.comment,
            link: commentData.link || "",
          },
          {
            headers: { "Content-Type": "application/json", accept: "*/*" },
          }
        );
        message.success({
          content: "Task completed and comment submitted!",
          key: taskId,
          duration: 3,
        });
      } else {
        message.success({
          content: response.data.message || "Task status updated!",
          key: taskId,
          duration: 3,
        });
      }

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      setTimeout(fetchAssignedTasks, 300);
    } catch (error) {
      console.error("Error updating task status or submitting comment:", error);
      message.error({
        content: "Failed to update task status or submit comment.",
        key: taskId,
        duration: 4,
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [taskId]: false }));
      if (newStatus === 4) {
        setCommentModalVisible(false);
        setSelectedTaskId(null);
        commentForm.resetFields();
      }
    }
  };

  // Handle comment form submission
  const handleCommentSubmit = async () => {
    if (!selectedTaskId) return;

    try {
      const values = await commentForm.validateFields();
      await updateTaskStatus(selectedTaskId, 4, values);
    } catch (error) {
      message.error({
        content: "Please provide a valid comment.",
        key: "commentError",
        duration: 4,
      });
    }
  };

  // Modified to remove the ability to reopen completed tasks
  const getNextStatus = (currentStatus: number) => {
    return { 1: 2, 2: 3, 3: 4 }[currentStatus] || currentStatus;
  };

  const getStatusText = (status: number) => {
    return (
      { 1: "Created", 2: "Accepted", 3: "Pending", 4: "Completed" }[status] ||
      "Unknown"
    );
  };

  // Modified to remove "Reopen Task" text for completed tasks
  const getActionButtonText = (status: number) => {
    return (
      {
        1: "Accept Task",
        2: "Mark as Pending",
        3: "Mark as Completed",
      }[status] || "Completed"
    );
  };

  const getActionButtonIcon = (status: number) => {
    return status === 1 || status === 3 ? (
      <CheckCircleOutlined />
    ) : (
      <ClockCircleOutlined />
    );
  };

  // Modified button style for completed tasks to be disabled
  const getActionButtonStyle = (status: number) => {
    return (
      {
        1: "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200",
        2: "bg-blue-600 hover:bg-blue-700 border-blue-600 text-white",
        3: "bg-green-600 hover:bg-green-700 border-green-600 text-white",
        4: "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed",
      }[status] || "bg-blue-600 hover:bg-blue-700 border-blue-600"
    );
  };

  const getPriorityColor = (priority?: string) => {
    return (
      { high: "red", medium: "orange", low: "green" }[priority || "low"] ||
      "blue"
    );
  };

  const getPriorityIcon = (priority?: string) => {
    return priority === "high" ? (
      <ExclamationCircleOutlined style={{ color: "#f5222d" }} />
    ) : (
      <FlagOutlined
        style={{ color: priority === "medium" ? "#fa8c16" : "#52c41a" }}
      />
    );
  };

  const getStatusColor = (status: number) => {
    return (
      { 1: "blue", 2: "purple", 3: "orange", 4: "green" }[status] || "default"
    );
  };

  const getStatusBadge = (status: number) => {
    const statusName = getStatusText(status);
    return (
      <Badge
        status={
          status === 4
            ? "success"
            : status === 1 || status === 2
            ? "processing"
            : "warning"
        }
        text={statusName}
        className={
          {
            4: "text-green-600",
            3: "text-orange-600",
            2: "text-purple-600",
            1: "text-blue-600",
          }[status] || "text-blue-600"
        }
      />
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Render task card
  const renderTaskCard = (task: AssignedTask) => {
    const priorityColor = getPriorityColor(task.priority);
    const isCompleted = task.status === 4;
    const nextStatus = getNextStatus(task.status);

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
          padding: isMobile
            ? "12px 16px"
            : isTablet
            ? "14px 20px"
            : "16px 24px",
        }}
        bodyStyle={{ padding: isMobile ? "16px" : isTablet ? "18px" : "20px" }}
        title={
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-full">
                <Text
                  strong
                  className={`${
                    isMobile ? "text-sm" : isTablet ? "text-base" : "text-lg"
                  } text-gray-800 block`}
                >
                  Task from {task.taskassingnedby}
                </Text>
                <div
                  className={`mt-2 ${
                    isMobile
                      ? "overflow-x-auto whitespace-nowrap"
                      : "flex flex-wrap"
                  } gap-2`}
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  <Tag
                    color="blue"
                    icon={<UserOutlined />}
                    className={isMobile ? "text-xs inline-block" : "text-sm"}
                  >
                    {task.createdby}
                  </Tag>
                  <Tag
                    color={priorityColor}
                    icon={getPriorityIcon(task.priority)}
                    className={isMobile ? "text-xs inline-block" : "text-sm"}
                  >
                    {task.priority.charAt(0).toUpperCase() +
                      task.priority.slice(1)}{" "}
                    Priority
                  </Tag>
                  <Tag
                    color={getStatusColor(task.status)}
                    className={isMobile ? "text-xs inline-block" : "text-sm"}
                  >
                    {getStatusText(task.status)}
                  </Tag>
                </div>
              </div>
            </div>
            <div className="hidden sm:block">{getStatusBadge(task.status)}</div>
          </div>
        }
      >
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <Text
            className={`text-gray-700 font-medium block mb-3 ${
              isMobile ? "text-sm" : "text-base"
            }`}
          >
            <FileTextOutlined className="mr-2" />
            Task Details:
          </Text>
          <div className="bg-white p-4 rounded-md border border-gray-100 shadow-inner">
            <Paragraph
              className={`whitespace-pre-wrap text-gray-700 mb-0 ${
                isMobile ? "text-sm" : "text-base"
              }`}
              ellipsis={{
                rows: isMobile ? 2 : isTablet ? 3 : 4,
                expandable: true,
                symbol: "Read more",
              }}
            >
              {task.taskcontent}
            </Paragraph>
          </div>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-2 text-gray-500">
            <div className="flex items-center gap-2">
              <CalendarOutlined />
              <Text
                className={
                  isMobile ? "text-xs" : isTablet ? "text-sm" : "text-base"
                }
              >
                Created: {formatDate(task.createdAt)}
              </Text>
            </div>
            <Text
              className={`${
                isMobile ? "text-xs" : isTablet ? "text-sm" : "text-base"
              } text-gray-400`}
            >
              Task ID: #{task.id.substring(0, 4)}
            </Text>
          </div>
          {/* Modified action button for completed tasks */}
          {isCompleted ? (
            <Button
              type="default"
              style={buttonStyle}
              className={`${getActionButtonStyle(
                task.status
              )} shadow-sm transition-colors duration-200 ${
                isMobile ? "w-full mt-2" : ""
              }`}
              icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              disabled={true}
              block={isMobile}
              size={isMobile ? "small" : "middle"}
            >
              Completed
            </Button>
          ) : (
            <Tooltip
              title={`Status will change to: ${getStatusText(nextStatus)}`}
            >
              <Button
                type={task.status === 4 ? "default" : "primary"}
                style={buttonStyle}
                className={`${getActionButtonStyle(
                  task.status
                )} shadow-sm transition-colors duration-200 ${
                  isMobile ? "w-full mt-2" : ""
                }`}
                onClick={() => updateTaskStatus(task.id, nextStatus)}
                icon={getActionButtonIcon(task.status)}
                loading={actionLoading[task.id]}
                block={isMobile}
                size={isMobile ? "small" : "middle"}
              >
                {getActionButtonText(task.status)}
              </Button>
            </Tooltip>
          )}
        </div>
      </Card>
    );
  };

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasksCount = tasks.filter((task) => task.status === 4).length;
  const pendingTasksCount = tasks.filter((task) => task.status === 3).length;
  const createdTasksCount = tasks.filter((task) => task.status === 1).length;

  // Render comment modal
  const renderCommentModal = () => (
    <Modal
      title="Complete Task"
      open={commentModalVisible}
      onOk={handleCommentSubmit}
      onCancel={() => {
        setCommentModalVisible(false);
        setSelectedTaskId(null);
        commentForm.resetFields();
      }}
      okText="Submit"
      cancelText="Cancel"
      width={isMobile ? "90%" : isTablet ? "70%" : 520}
      okButtonProps={{ loading: actionLoading[selectedTaskId || ""] }}
    >
      <Form form={commentForm} layout="vertical">
        <Form.Item
          name="comment"
          label="Comment"
          rules={[{ required: true, message: "Please enter a comment" }]}
        >
          <Input.TextArea rows={4} placeholder="Enter your comment here..." />
        </Form.Item>
        <Form.Item
          name="link"
          label="Link (Optional)"
          rules={[
            {
              type: "url",
              message: "Please enter a valid URL",
              warningOnly: true,
            },
          ]}
        >
          <Input prefix={<LinkOutlined />} placeholder="https://example.com" />
        </Form.Item>
      </Form>
    </Modal>
  );

  // Render filter drawer
  const renderFilterDrawer = () => (
    <Drawer
      title={
        <div className="flex items-center">
          <FilterOutlined className="mr-2" />
          <span>Filter & Sort Tasks</span>
        </div>
      }
      placement="right"
      onClose={() => setFilterDrawerVisible(false)}
      open={filterDrawerVisible}
      width={isMobile ? "85%" : isTablet ? "60%" : "30%"}
      footer={
        <Button
          type="primary"
          onClick={() => {
            setFilterPriority("all");
            setFilterStatus("all");
            setSortBy("dueDate");
            setSearchTerm("");
            setFilterDrawerVisible(false);
          }}
          block
        >
          Reset All Filters
        </Button>
      }
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Text strong className="block mb-2 flex items-center text-base">
            <SortAscendingOutlined className="mr-2" /> Sort By
          </Text>
          <Select
            value={sortBy}
            onChange={(value) => setSortBy(value)}
            style={{ width: "100%" }}
            size={isMobile ? "middle" : "large"}
          >
            <Option value="dueDate">Due Date (Closest First)</Option>
            <Option value="priority">Priority (High to Low)</Option>
            <Option value="status">Status</Option>
            <Option value="createdAt">Created Date (Newest First)</Option>
          </Select>
        </div>
        <div>
          <Text strong className="block mb-2 flex items-center text-base">
            <FlagOutlined className="mr-2" /> Priority
          </Text>
          <Select
            value={filterPriority}
            onChange={(value) => setFilterPriority(value)}
            style={{ width: "100%" }}
            size={isMobile ? "middle" : "large"}
          >
            <Option value="all">All Priorities</Option>
            <Option value="high">
              <Tag color="red" className="mr-2">
                High
              </Tag>
              High Priority
            </Option>
            <Option value="medium">
              <Tag color="orange" className="mr-2">
                Medium
              </Tag>
              Medium Priority
            </Option>
            <Option value="low">
              <Tag color="green" className="mr-2">
                Low
              </Tag>
              Low Priority
            </Option>
          </Select>
        </div>
        <div>
          <Text strong className="block mb-2 flex items-center text-base">
            <ClockCircleOutlined className="mr-2" /> Status
          </Text>
          <Select
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            style={{ width: "100%" }}
            size={isMobile ? "middle" : "large"}
          >
            <Option value="all">All Statuses</Option>
            <Option value="1">
              <Badge status="processing" color="blue" text="Created" />
            </Option>
            <Option value="2">
              <Badge status="processing" color="purple" text="Accepted" />
            </Option>
            <Option value="3">
              <Badge status="warning" text="Pending" />
            </Option>
            <Option value="4">
              <Badge status="success" text="Completed" />
            </Option>
          </Select>
        </div>
      </Space>
    </Drawer>
  );

  return (
    <UserPanelLayout>
      <div className="p-2 sm:p-4 md:p-6 min-h-screen bg-gray-50">
        <Card
          className="mb-6 shadow-lg border-0 rounded-xl overflow-hidden"
          bodyStyle={{ padding: "0" }}
        >
          <div className="bg-gradient-to-r p-4 sm:p-6 md:p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <Title
                  level={isMobile ? 4 : isTablet ? 3 : 2}
                  className="text-white mb-1"
                >
                  Assigned Tasks Dashboard
                </Title>
                <Text className="text-blue-800 text-sm sm:text-base">
                  Manage and track all your assigned tasks
                </Text>
              </div>
              <Button
                onClick={fetchAssignedTasks}
                icon={<ReloadOutlined />}
                style={{
                  ...buttonStyle,
                  height: isMobile ? "32px" : "38px",
                  padding: isMobile ? "0 12px" : "0 16px",
                }}
                size={isMobile ? "small" : "middle"}
                className="mt-4 md:mt-0 bg-white/20 text-white border-white/30 hover:bg-white/30 hover:border-white/40 backdrop-blur-sm transition-colors duration-200"
              >
                Refresh Tasks
              </Button>
            </div>
          </div>

          {tasks.length > 0 && (
            <div
              className={`${
                isMobile ? "py-3 px-4" : "p-6"
              } bg-white border-b border-gray-200`}
            >
              <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]}>
                <Col xs={12} sm={12} md={6}>
                  <Card className="h-full border-blue-100 hover:shadow-md transition-shadow rounded-lg">
                    <div className="text-blue-600">
                      <div className="text-gray-500 text-sm mb-2">
                        Total Tasks
                      </div>
                      <div className="flex items-center gap-2">
                        <FileTextOutlined className="text-xl" />
                        <span className="text-2xl font-semibold">
                          {totalTasks}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                  <Card className="h-full border-blue-100 hover:shadow-md transition-shadow rounded-lg">
                    <div className="text-blue-600">
                      <div className="text-gray-500 text-sm mb-2">Created</div>
                      <div className="flex items-center gap-2">
                        <FileTextOutlined
                          style={{ color: "#1890ff" }}
                          className="text-xl"
                        />
                        <span className="text-2xl font-semibold">
                          {createdTasksCount}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                  <Card className="h-full border-orange-100 hover:shadow-md transition-shadow rounded-lg">
                    <div className="text-orange-600">
                      <div className="text-gray-500 text-sm mb-2">Pending</div>
                      <div className="flex items-center gap-2">
                        <ClockCircleOutlined
                          style={{ color: "#fa8c16" }}
                          className="text-xl"
                        />
                        <span className="text-2xl font-semibold">
                          {pendingTasksCount}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                  <Card className="h-full border-green-100 hover:shadow-md transition-shadow rounded-lg">
                    <div className="text-green-600">
                      <div className="text-gray-500 text-sm mb-2">
                        Completed
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircleOutlined
                          style={{ color: "#52c41a" }}
                          className="text-xl"
                        />
                        <span className="text-2xl font-semibold">
                          {completedTasksCount}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          )}

          {tasks.length > 0 && (
            <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-200">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <Text
                    className={`text-gray-600 font-medium block mb-2 ${
                      isMobile ? "text-sm" : "text-base"
                    }`}
                  >
                    <SearchOutlined className="mr-2" /> Search Tasks
                  </Text>
                  <div className="flex gap-2">
                    <Search
                      placeholder="Search by content, creator, or assignee..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      allowClear
                      style={{ width: "100%" }}
                      size={isMobile ? "middle" : "large"}
                      className="rounded-md"
                    />
                    {(isMobile || isTablet) && (
                      <Button
                        icon={<FilterOutlined />}
                        onClick={() => setFilterDrawerVisible(true)}
                        className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 transition-colors duration-200"
                        size={isMobile ? "middle" : "large"}
                      >
                        Filter
                      </Button>
                    )}
                  </div>
                </div>
                {isDesktop && (
                  <Space
                    wrap={isMobile || isTablet}
                    size={isMobile ? "small" : "middle"}
                  >
                    <Select
                      value={sortBy}
                      onChange={(value) => setSortBy(value)}
                      style={{ width: 160 }}
                      size={isMobile ? "middle" : "large"}
                      className="rounded-md"
                    >
                      <Option value="dueDate">Due Date</Option>
                      <Option value="priority">Priority</Option>
                      <Option value="status">Status</Option>
                      <Option value="createdAt">Created Date</Option>
                    </Select>
                    <Select
                      value={filterPriority}
                      onChange={(value) => setFilterPriority(value)}
                      style={{ width: 120 }}
                      size={isMobile ? "middle" : "large"}
                      className="rounded-md"
                    >
                      <Option value="all">All Priorities</Option>
                      <Option value="high">High</Option>
                      <Option value="medium">Medium</Option>
                      <Option value="low">Low</Option>
                    </Select>
                    <Select
                      value={filterStatus}
                      onChange={(value) => setFilterStatus(value)}
                      style={{ width: 120 }}
                      size={isMobile ? "middle" : "large"}
                      className="rounded-md"
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
                        setSortBy("dueDate");
                        setSearchTerm("");
                      }}
                      icon={<ReloadOutlined />}
                      size={isMobile ? "middle" : "large"}
                      className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 transition-colors duration-200"
                    >
                      Reset
                    </Button>
                  </Space>
                )}
              </div>
            </div>
          )}

          <div className="p-4 md:p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Spin size="large" />
                <Text className="mt-4 text-gray-500 text-lg">
                  Loading your tasks...
                </Text>
              </div>
            ) : filteredTasks.length > 0 ? (
              <div className="space-y-6">
                {filteredTasks.map(renderTaskCard)}
                {filteredTasks.length < tasks.length && (
                  <div className="text-center py-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <Text className="text-gray-500 text-base">
                      Showing {filteredTasks.length} of {tasks.length} tasks
                    </Text>
                    <div className="mt-3">
                      <Button
                        type="link"
                        onClick={() => {
                          setFilterPriority("all");
                          setFilterStatus("all");
                          setSearchTerm("");
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Clear filters to see all
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : tasks.length > 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="text-center">
                    <Text className="text-gray-500 block mb-2 text-lg">
                      No matching tasks found
                    </Text>
                    <Text className="text-gray-400 text-base">
                      Try adjusting your search or filters
                    </Text>
                    <div className="mt-4">
                      <Button
                        type="primary"
                        onClick={() => {
                          setFilterPriority("all");
                          setFilterStatus("all");
                          setSearchTerm("");
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Show All Tasks
                      </Button>
                    </div>
                  </div>
                }
                className="py-16"
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="text-center">
                    <Text className="text-gray-500 block mb-2 text-lg">
                      No assigned tasks found
                    </Text>
                    <Text className="text-gray-400 text-base">
                      New tasks will appear here when assigned
                    </Text>
                    <div className="mt-4">
                      <Button
                        type="primary"
                        onClick={fetchAssignedTasks}
                        icon={<ReloadOutlined />}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Refresh Tasks
                      </Button>
                    </div>
                  </div>
                }
                className="py-16"
              />
            )}
          </div>
        </Card>
      </div>
      {renderCommentModal()}
      {renderFilterDrawer()}
    </UserPanelLayout>
  );
};

export default AssignedTasksPage;
