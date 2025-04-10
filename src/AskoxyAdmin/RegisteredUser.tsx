import React, { useState, useEffect } from "react";
import Sidebar from "./Sider";
import axios from "axios";
import {
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Select,
  Input,
  Table,
  Tag,
  Button,
  Space,
  Spin,
  Modal,
  message,
  List,
  Divider,
  Tabs,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  FileTextOutlined,
  SwapOutlined,
  BarChartOutlined,
  DeleteOutlined,
  LoadingOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import BASE_URL from "../Config";
import { Pencil, Trash } from "lucide-react";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface UserData {
  id: string;
  email: string;
  fullName: string;
  mobileNumber: string;
  whatsappNumber: string;
  created_at: string | null;
  testuser: boolean;
  flatNo: string | null;
  landMark: string | null;
  pinCode: string | null;
  address: string | null;
  addressType: string | null;
}

interface ApiResponse {
  content: UserData[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

interface OrderData {
  orderId: string;
  orderStatus: string;
  newOrderId: string;
  customerId: string;
  subTotal: number;
  grandTotal: number;
  deliveryFee: number;
  paymentType: number;
  orderDate: string;
  timeSlot: string;
  dayOfWeek: string;
  expectedDeliveryDate: string;
  orderItems: any[] | null;
}
interface Comment {
  adminComments: string;
  commentsUpdateBy: string;
  commentsCreatedDate?: string;
  userId?: string;
}
const timeOptions = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "thisWeek", label: "This Week" },
  { value: "thisMonth", label: "This Month" },
  { value: "custom", label: "Custom Dates" },
];

const RegisteredUser: React.FC = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userOrders, setUserOrders] = useState<OrderData[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<string | null>(null);
  const [startDate1, setStartDate1] = useState<string>("");
  const [endDate1, setEndDate1] = useState<string>("");
  const [isCustomDate, setIsCustomDate] = useState<boolean>(false);
  const [filteredUserData, setFilteredUserData] = useState<UserData[]>([]);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [primaryType, setPrimaryType] = useState("");
  const [userId, setUserId] = useState("");
  const [commentsModalVisible, setCommentsModalVisible] =
    useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [updatedBy, setUpdatedBy] = useState<string>("admin");
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [submittingComment, setSubmittingComment] = useState<boolean>(false);
  const [record, setRecord] = useState<UserData | null>(null);

  const [mobileNumber1, setMobileNumber1] = useState("");
  const [whatsappNumber1, setWhatsappNumber1] = useState("");
  const [userId1, setUserId1] = useState("");

  const [selectedTimeFrame, setSelectedTimeFrame] =
    useState<string>("thisWeek");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0,
  });
  const [orderDetailsVisible, setOrderDetailsVisible] =
    useState<boolean>(false);
  const [staticMetrics, setStaticMetrics] = useState({
    totalUsers: 0,
    today: 0,
    yesterday: 0,
    thisWeek: 0,
    thisMonth: 0,
  });
  const [barChartData, setBarChartData] = useState([
    { period: "Today", value: 0, color: "#1890ff" },
    { period: "Yesterday", value: 0, color: "#52c41a" },
    { period: "This Week", value: 0, color: "#faad14" },
    { period: "This Month", value: 0, color: "#f5222d" },
  ]);

  // Calculate date ranges
  const getDateRange = (timeFrame: string) => {
    let today = new Date();
    let startDate = new Date();

    switch (timeFrame) {
      case "today":
        break;
      case "yesterday":
        startDate.setDate(today.getDate() - 1);
        today.setDate(today.getDate() - 1);
        break;
      case "thisWeek":
        const dayOfWeek = today.getDay();
        const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startDate.setDate(today.getDate() - daysSinceMonday);
        break;

      case "thisMonth":
        startDate = new Date(today.getFullYear(), today.getMonth(), 2);
        break;
      case "custom":
        startDate = new Date(startDate1);
        today = new Date(endDate1);
        break;
    }
    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: today.toISOString().split("T")[0],
    };
  };

  const fetchUserData = async () => {
    setLoading(true);
    // console.log("Selected Time Frame:", selectedTimeFrame);
    // console.log(startDate1, endDate1);

    const { startDate, endDate } = getDateRange(selectedTimeFrame);

    try {
      const response = await axios.get<ApiResponse>(
        `${BASE_URL}/user-service/date-rangeuserdetails?endDate=${endDate}&page=${
          pagination.current - 1
        }&size=${1000}&startDate=${startDate}`
      );

      setUserData(response.data.content);
      setFilteredUserData(response.data.content);
      setPagination({
        ...pagination,
        total: response.data.content.length,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  const handleTimeFrameChange = (value: string) => {
    setIsCustomDate(value === "custom");
    setSelectedTimeFrame(value);
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filteredData = userData.filter(
      (user) =>
        user.fullName?.toLowerCase().includes(value) ||
        user.mobileNumber?.includes(value) ||
        user.whatsappNumber?.includes(value)
    );

    setFilteredUserData(filteredData);
    setPagination({
      ...pagination,
      current: 1,
      total: filteredData.length,
    });
  };

  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination);
  };

  // View order details
  const fetchOrderDetails = async (userId: string) => {
    setLoader(true);
    try {
      const response = await axios.post(
        BASE_URL + "/order-service/getAllOrders_customerId",
        { userId },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );

      setUserOrders(response.data);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching order details:", error);
      message.error("Failed to load order details");
      setLoader(false);
    }
  };
  const viewSpecificOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "1":
        return "placed";
      case "2":
        return "Accepted";
      case "3":
        return "assigned";
      case "4":
        return "Delivered";
      case "5":
        return "Rejected";
      case "6":
        return "cancelled";
      case "PickedUp":
        return "pickedUp";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "1":
        return "blue";
      case "2":
        return "processing";
      case "3":
        return "purple";
      case "4":
        return "success";
      case "5":
        return "error";
      case "6":
        return "error";
      case "PickedUp":
        return "orange";
      default:
        return "default";
    }
  };
  const getPaymentTypeText = (type: number) => {
    switch (type) {
      case 1:
        return "Online";
      case 2:
        return "Cash on Delivery";
      default:
        return "Unknown";
    }
  };

  // Function called when the "Order Details" button is clicked
  const viewOrderDetails = (record: UserData) => {
    setSelectedUser(record);
    setOrderDetailsVisible(true);
    fetchOrderDetails(record.id);
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [selectedTimeFrame]);

  useEffect(() => {
    if (record) {
      fetchComments();
    }
  }, [record]);

  const fetchCounts = async () => {
    try {
      const response = await axios.get(BASE_URL + "/user-service/counts");
      if (response.status === 200) {
        const data = response.data;
        setStaticMetrics({
          totalUsers: data.totalUsers,
          today: data.todayUsers,
          yesterday: data.yesterdayUsers,
          thisWeek: data.thisWeekUsers,
          thisMonth: data.thisMonthUsers,
        });
        setBarChartData([
          { period: "Today", value: data.todayUsers, color: "#1890ff" },
          { period: "Yesterday", value: data.yesterdayUsers, color: "#52c41a" },
          { period: "This Week", value: data.thisWeekUsers, color: "#faad14" },
          {
            period: "This Month",
            value: data.thisMonthUsers,
            color: "#f5222d",
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const columns = [
    {
      title: "S No.",
      key: "index",
      width: 50,
      align: "center" as const,
      render: (_: any, __: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "User ID",
      key: "id",
      width: 60,
      align: "center" as const,
      render: (record: UserData) => (
        <Text strong style={{ color: "#67297c" }}>
          #{record.id.slice(-4)}
        </Text>
      ),
    },
    {
      title: <div className="text-center">User Details</div>,
      key: "userDetails",
      width: 200,
      // align: "center" as const,
      render: (record: UserData) => (
        <Space direction="vertical" size="small">
          <Text>Name: {record.fullName || "N/A"}</Text>
          <Text type="secondary">Email: {record.email || "N/A"}</Text>
          {record.whatsappNumber && (
  <div className="inline-flex items-center text-[13px] bg-green-50 text-green-700 rounded px-2 py-1 mr-2">
    <WhatsAppOutlined style={{ fontSize: "13px", color: "#25D366" }} />
    <strong className="ml-2 font-semibold">
      {record.whatsappNumber}
    </strong>
  </div>
)}

{record.mobileNumber && (
  <div className="inline-flex items-center text-[13px] bg-purple-50 text-purple-700 rounded px-2 py-1">
    <PhoneOutlined style={{ fontSize: "13px", color: "#722ED1" }} />
    <strong className="ml-2 font-semibold">
      {record.mobileNumber}
    </strong>
  </div>
)}

        </Space>
      ),
    },
    {
      title: "Registration Date",
      key: "createdAt",
      width: 90,
      align: "center" as const,
      render: (record: UserData) => (
        <Text strong>
          {/* {record.created_at} */}
          {formatDate(record.created_at)}
        </Text>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 150,
      align: "center" as const,
      render: (text: string, record: UserData) => {
        if (!record) return "N/A";

        const fullAddress = `${record.flatNo || ""} ${record.landMark || ""} ${
          record.address || ""
        } ${record.pinCode || ""}`.trim();

        return (
          <div
            style={{
              maxWidth: "150px",
              padding: "4px",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                wordWrap: "break-word",
                whiteSpace: "normal",
                display: "block",
                lineHeight: "1.4",
              }}
            >
              {fullAddress.length > 0 ? fullAddress : "N/A"}
            </Text>
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: "center" as const,
      render: (record: UserData) => (
        <Space direction="vertical" size="small">
          <Button
            type="primary"
            size="small"
            onClick={() => viewOrderDetails(record)}
            className="w-full rounded-md bg-blue-400 hover:bg-blue-500 border-blue-300"
          >
            Order Details
          </Button>

          <Button
            size="small"
            onClick={() => handleToggleTestUser(record)}
            loading={loading}
            className={`w-full rounded-md ${
              record.testuser
                ? "bg-green-400 hover:bg-green-500 border-green-300 text-white"
                : "bg-white hover:bg-red-50 border-red-300 text-red-400 hover:text-red-500"
            }`}
          >
            {record.testuser ? "Convert Live" : "Convert Test"}
          </Button>

          <Button
            type="default"
            size="small"
            onClick={() => {
              setRecord(record);
              showCommentsModal();
            }}
            className="w-full rounded-md bg-purple-100 hover:bg-purple-200 border-purple-300 text-purple-700"
          >
            Comments
          </Button>
        </Space>
      ),
    },
  ];

  const barConfig = {
    data: barChartData,
    xField: "period",
    yField: "value",
    seriesField: "period",
    height: 200,
    label: false,
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };

  const orderColumns = [
    {
      title: "Order ID",
      dataIndex: "newOrderId",
      key: "newOrderId",
      render: (text: string, record: OrderData) => (
        <a onClick={() => viewSpecificOrder(record.orderId)}>{text}</a>
      ),
    },

    {
      title: "Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (text: string) => {
        return new Date(text).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        });
      },
    },
    {
      title: "Amount",
      dataIndex: "grandTotal",
      key: "grandTotal",
      render: (text: number) => `₹${text.toFixed(2)}`,
    },
    {
      title: "Expected Delivery",
      dataIndex: "expectedDeliveryDate",
      key: "expectedDeliveryDate",
      render: (expectedDeliveryDate: string, record: OrderData) => (
        <div>
          <p>{new Date(expectedDeliveryDate).toLocaleDateString()}</p>
          <p>{record.timeSlot}</p>
          <p>{record.dayOfWeek}</p>
        </div>
      ),
    },

    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (text: string) => (
        <Tag color={getStatusColor(text)}>{getStatusText(text)}</Tag>
      ),
    },
  ];

  const handleToggleTestUser = async (record: UserData) => {
    setLoading(true);
    const payload = {
      id: record.id,
      testUser: !record.testuser,
    };
    // console.log(payload);
    try {
      const response = await axios.patch(
        `${BASE_URL}/user-service/updateTestUsers`,
        payload
      );
      if (response.status === 200) {
        message.success("User status updated successfully");
      } else {
        message.error("Failed to update user status");
      }
    } catch {
      message.error("Failed to update user status");
    } finally {
      setLoading(false);
      fetchUserData();
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setMobileNumber("");
    setWhatsappNumber("");
    setUserId("");
    setPrimaryType("");
  };

  const handleRemoveUser = async () => {
    setRemoveLoading(true);
    if (mobileNumber === "") {
      message.error("Please enter mobile number.");
      setRemoveLoading(false);
      return;
    }

    try {
      const response = await axios.patch(
        `${BASE_URL}/user-service/updateMobileNumber`,
        {
          mobileNumber: mobileNumber,
          whatsappNumber: whatsappNumber,
          primaryType: primaryType,
          id: userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );

      if (response.status === 200) {
        message.success("User updated successfully!");
        handleCancel();
      }
    } catch (error) {
      message.error("Failed to update user. Please try again.");
      handleCancel();
    } finally {
      setRemoveLoading(false);
      setIsModalOpen(false);
    }
  };

  const showCommentsModal = async (): Promise<void> => {
    setCommentsModalVisible(true);
    // await fetchComments();
  };

  const fetchComments = async (): Promise<void> => {
    if (!record || !record.id) return;

    setLoadingComments(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/user-service/fetchComments`,
        { userId: record.id },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data && typeof response.data === "object") {
        setComments([response.data]);
      } else {
        setComments([]);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 500) {
        message.info("No comments found");
      } else {
        message.error("Failed to load comments");
      }
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  // Submit new comment
  const handleSubmitComment = async (): Promise<void> => {
    if (!newComment.trim()) {
      message.warning("Please enter a comment");
      return;
    }

    setSubmittingComment(true);
    try {
      await axios.patch(
        `${BASE_URL}/user-service/adminComments`,
        {
          adminComments: newComment,
          commentsUpdateBy: updatedBy,
          userId: record?.id,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      message.success("Comment added successfully");
      setNewComment(""); // Clear comment input
      await fetchComments(); // Refresh comments
    } catch (error) {
      console.error("Error submitting comment:", error);
      message.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const handleUserSearch = async () => {
    if (!mobileNumber1 && !whatsappNumber1 && !userId1) {
      message.warning("Please enter at least one search field.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/user-service/getDataWithMobileOrWhatsappOrUserId`,
        {
          mobileNumber: mobileNumber1 || null,
          whatsappNumber: whatsappNumber1 || null,
          userId: userId1 || null,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data?.activeUsersResponse || [];

      const transformed: UserData[] = data.map((user: any) => ({
        id: user.userId,
        email: user.email,
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        mobileNumber: user.mobileNumber || "",
        whatsappNumber: user.whastappNumber || "",
        created_at: user.userRegisterCreatedDate || null,
        testuser: false,
        flatNo: user.flatNo || null,
        landMark: user.landMark || null,
        pinCode: user.pincode || null,
        address: user.address || null,
        addressType: user.addressType || null,
      }));

      setFilteredUserData(transformed);
    } catch (error) {
      console.error("API call failed:", error);
      message.error("Failed to fetch user data");
    } finally {
      setLoading(false);
      setMobileNumber1("");
      setWhatsappNumber1("");
      setUserId1("");
    }
  };

  const items = [
    {
      key: "date",
      label: "Search by Date",
      children: (
        <div className="mt-4">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Input
                type="date"
                value={startDate1}
                onChange={(e) => setStartDate1(e.target.value)}
                placeholder="Start Date"
                className="w-full"
              />
            </Col>
            <Col xs={24} md={8}>
              <Input
                type="date"
                value={endDate1}
                onChange={(e) => setEndDate1(e.target.value)}
                placeholder="End Date"
                className="w-full"
              />
            </Col>
            <Col xs={24} md={8}>
              <Button
                type="primary"
                className="bg-blue-500 w-full"
                onClick={() => handleTimeFrameChange("custom")}
                loading={loading}
              >
                Get Data
              </Button>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: "user",
      label: "Search by Mobile Number",
      children: (
        <div className="mt-4">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={6} lg={6}>
              <Input
                placeholder="Mobile Number"
                value={mobileNumber1}
                onChange={(e) => setMobileNumber1(e.target.value)}
                prefix={<PhoneOutlined />}
                allowClear
                className="w-full"
              />
            </Col>
            <Col xs={24} sm={24} md={6} lg={6}>
              <Input
                placeholder="WhatsApp Number"
                value={whatsappNumber1}
                onChange={(e) => setWhatsappNumber1(e.target.value)}
                prefix={<WhatsAppOutlined style={{ color: "#25D366" }} />}
                allowClear
                className="w-full"
              />
            </Col>

            <Col xs={24} sm={24} md={6} lg={6}>
              <Input
                placeholder="User ID"
                value={userId1}
                onChange={(e) => setUserId1(e.target.value)}
                prefix={<UserOutlined />}
                allowClear
                className="w-full"
              />
            </Col>
            <Col xs={24} sm={24} md={6} lg={6}>
              <Button
                type="primary"
                className="bg-blue-500 w-full"
                onClick={handleUserSearch}
                loading={loading}
                disabled={!mobileNumber1 && !whatsappNumber1 && !userId1}
                icon={<SearchOutlined />}
              >
                Search
              </Button>
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-red-200 text-red-800",
      "bg-green-200 text-green-800",
      "bg-blue-200 text-blue-800",
      "bg-yellow-200 text-yellow-800",
      "bg-purple-200 text-purple-800",
      "bg-pink-200 text-pink-800",
    ];

    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4">
          <Title level={2} className="m-0">
            Registered Users
          </Title>

          <Button
            type="primary"
            icon={<Pencil size={16} className="mr-1" />}
            onClick={showModal}
          >
            Update User
          </Button>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <Card
                  className="bg-gray-100/90 backdrop-blur-lg rounded-2xl border border-gray-200/30 shadow-lg hover:shadow-xl transition-all duration-300 min-h-[100px] p-2"
                  hoverable
                >
                  <div className="flex flex-col">
                    <div className="flex items-center mb-0.5">
                      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-2 shadow-purple-400/30 shadow-lg">
                        <UserOutlined className="text-xl text-white" />
                      </div>
                      <Text
                        strong
                        className="text-xl ml-2 bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent font-extrabold"
                      >
                        Total Users
                      </Text>
                    </div>
                    <Statistic
                      value={staticMetrics.totalUsers}
                      className="mt-0"
                      valueStyle={{
                        fontSize: 32,
                        fontWeight: "bold",
                        color: "#7e22ce",
                        textAlign: "center",
                      }}
                    />
                  </div>
                </Card>
              </Col>

              {/* Graph Card - Full width on small screens, takes remaining space on tablet and larger screens */}
              <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                <Card
                  title="User Registration by Period"
                  extra={<BarChartOutlined />}
                  className="w-full"
                >
                  <div
                    style={{ height: 200, width: "100%", overflow: "hidden" }}
                  >
                    <Column {...barConfig} />
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={12} sm={12} md={6}>
            <Card
              onClick={() => handleTimeFrameChange("today")}
              className="cursor-pointer"
              bodyStyle={{
                background: "linear-gradient(135deg, #c4b5fd 0%, #93c5fd 100%)",
                borderLeft: "4px solid #93c5fd",
                color: "#333",
              }}
            >
              <Statistic
                title={
                  <Text
                    strong
                    className="text-lg font-extrabold tracking-wide"
                    style={{
                      color: "#1e1b4b",
                      textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                  >
                    Today
                  </Text>
                }
                value={staticMetrics.today}
                valueStyle={{ color: "#333" }}
              />
            </Card>
          </Col>

          <Col xs={12} sm={12} md={6}>
            <Card
              onClick={() => handleTimeFrameChange("yesterday")}
              className="cursor-pointer"
              bodyStyle={{
                background: "linear-gradient(135deg, #a5d6a7 0%, #81c784 100%)", // Light Green to Soft Green
                borderLeft: "4px solid #81c784",
                color: "#333",
              }}
            >
              <Statistic
                title={
                  <Text
                    strong
                    className="text-lg font-extrabold tracking-wide"
                    style={{
                      color: "#1e1b4b",
                      textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                  >
                    Yesterday
                  </Text>
                }
                value={staticMetrics.yesterday}
                valueStyle={{ color: "#333" }}
              />
            </Card>
          </Col>

          <Col xs={12} sm={12} md={6}>
            <Card
              onClick={() => handleTimeFrameChange("thisWeek")}
              className="cursor-pointer"
              bodyStyle={{
                background: "linear-gradient(135deg, #ffcc80 0%, #ffb74d 100%)", // Light Orange to Soft Orange
                borderLeft: "4px solid #ffb74d",
                color: "#333",
              }}
            >
              <Statistic
                title={
                  <Text
                    strong
                    className="text-lg font-extrabold tracking-wide"
                    style={{
                      color: "#1e1b4b",
                      textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                  >
                    This Week
                  </Text>
                }
                value={staticMetrics.thisWeek}
                valueStyle={{ color: "#333" }}
              />
            </Card>
          </Col>

          <Col xs={12} sm={12} md={6}>
            <Card
              onClick={() => handleTimeFrameChange("thisMonth")}
              className="cursor-pointer"
              bodyStyle={{
                background: "linear-gradient(135deg, #b2ebf2 0%, #80deea 100%)", // Light Cyan to Soft Cyan
                borderLeft: "4px solid #80deea",
                color: "#333",
              }}
            >
              <Statistic
                title={
                  <Text
                    strong
                    className="text-lg font-extrabold tracking-wide"
                    style={{
                      color: "#1e1b4b",
                      textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                  >
                    This Month
                  </Text>
                }
                value={staticMetrics.thisMonth}
                valueStyle={{ color: "#333" }}
              />
            </Card>
          </Col>
        </Row>

        <div className="p-4 my-6 border rounded-lg bg-white">
          <Tabs
            defaultActiveKey="date"
            items={items}
            onChange={setSearchType}
            className="search-tabs"
          />
        </div>

        <div style={{ overflowX: "auto", maxWidth: "100%" }}>
          <Table
            key={filteredUserData.length}
            columns={columns}
            dataSource={filteredUserData}
            rowKey="id"
            pagination={pagination}
            onChange={handleTableChange}
            loading={loading}
            scroll={{ x: "max-content" }}
          />
        </div>
      </div>

      <Modal
        title={
          <span style={{ color: "#1890ff", fontSize: "20px" }}>
            Order Details
          </span>
        }
        open={orderDetailsVisible}
        onCancel={() => {
          setOrderDetailsVisible(false);
          setSelectedUser(null);
          setUserOrders([]);
          setSelectedOrderId(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => setOrderDetailsVisible(false)}
            style={{
              backgroundColor: "#ff4d4f",
              color: "white",
              border: "none",
            }}
          >
            Close
          </Button>,
        ]}
        width={800}
        style={{ borderRadius: "8px", overflow: "hidden" }}
      >
        {loader ? (
          <div
            style={{
              textAlign: "center",
              padding: "30px",
              background: "#f0f2f5",
              borderRadius: "8px",
            }}
          >
            <Spin size="large" style={{ color: "#1890ff" }} />
            <p style={{ color: "#595959", marginTop: "10px" }}>
              Loading order details...
            </p>
          </div>
        ) : (
          <>
            {selectedUser && (
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card
                    title={
                      <span style={{ color: "#2f54eb" }}>
                        Customer Information
                      </span>
                    }
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      background: "linear-gradient(to right, #fff, #f9faff)",
                    }}
                  >
                    <p style={{ color: "#595959" }}>
                      <strong style={{ color: "#1d39c4" }}>Name:</strong>
                      {""}
                      {selectedUser.fullName || "N/A"}
                    </p>
                    <p style={{ color: "#595959" }}>
                      <strong style={{ color: "#1d39c4" }}>Email: </strong>{" "}
                      {selectedUser.email || "N/A"}
                    </p>
                    <p style={{ color: "#595959" }}>
                      <strong style={{ color: "#1d39c4" }}>Phone: </strong>{" "}
                      {selectedUser.whatsappNumber ||
                        selectedUser.mobileNumber ||
                        "N/A"}
                    </p>
                    <p style={{ color: "#595959" }}>
                      <strong style={{ color: "#1d39c4" }}>User ID: </strong>{" "}
                      {selectedUser.id || "N/A"}
                    </p>
                    <p style={{ color: "#595959" }}>
                      <strong style={{ color: "#1d39c4" }}>Address: </strong>{" "}
                      {selectedUser.address || "N/A"}
                    </p>
                  </Card>
                </Col>

                <Col span={24}>
                  <Card
                    title={
                      <span style={{ color: "#2f54eb" }}>Orders History</span>
                    }
                    extra={
                      <Text type="secondary" style={{ color: "#722ed1" }}>
                        {userOrders.length} orders found
                      </Text>
                    }
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      background: "linear-gradient(to right, #fff, #f9faff)",
                    }}
                  >
                    {userOrders.length > 0 ? (
                      <Table
                        dataSource={userOrders}
                        columns={orderColumns}
                        rowKey="orderId"
                        pagination={false}
                        size="small"
                        rowClassName={(record, index) =>
                          index % 2 === 0 ? "table-row-light" : "table-row-dark"
                        }
                        scroll={{ x: "max-content" }}
                      />
                    ) : (
                      <Text type="secondary" style={{ color: "#ff4d4f" }}>
                        No orders found for this user.
                      </Text>
                    )}
                  </Card>
                </Col>

                {selectedOrderId && (
                  <Col span={24}>
                    <Card
                      title={
                        <span style={{ color: "#2f54eb" }}>Order Details</span>
                      }
                      style={{
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        background: "linear-gradient(to right, #fff, #f9faff)",
                      }}
                    >
                      {userOrders
                        .filter((order) => order.orderId === selectedOrderId)
                        .map((order) => (
                          <div key={order.orderId}>
                            <p style={{ color: "#595959" }}>
                              <strong style={{ color: "#1d39c4" }}>
                                Order ID:
                              </strong>{" "}
                              {order.newOrderId}
                            </p>
                            <p style={{ color: "#595959" }}>
                              <strong style={{ color: "#1d39c4" }}>
                                Order Date:
                              </strong>{" "}
                              {formatDate(order.orderDate)}
                            </p>
                            <p style={{ color: "#595959" }}>
                              <strong style={{ color: "#1d39c4" }}>
                                Status:
                              </strong>{" "}
                              <Tag color={getStatusColor(order.orderStatus)}>
                                {getStatusText(order.orderStatus)}
                              </Tag>
                            </p>
                            <p style={{ color: "#595959" }}>
                              <strong style={{ color: "#1d39c4" }}>
                                Payment Method:
                              </strong>{" "}
                              {getPaymentTypeText(order.paymentType)}
                            </p>
                            <p style={{ color: "#595959" }}>
                              <strong style={{ color: "#1d39c4" }}>
                                Subtotal:
                              </strong>{" "}
                              ₹{order.subTotal.toFixed(2)}
                            </p>
                            <p style={{ color: "#595959" }}>
                              <strong style={{ color: "#1d39c4" }}>
                                Delivery Fee:
                              </strong>{" "}
                              ₹{order.deliveryFee.toFixed(2)}
                            </p>
                            <p style={{ color: "#595959" }}>
                              <strong style={{ color: "#1d39c4" }}>
                                Total Amount:
                              </strong>{" "}
                              <span
                                style={{ fontWeight: "bold", color: "#52c41a" }}
                              >
                                ₹{order.grandTotal.toFixed(2)}
                              </span>
                            </p>
                          </div>
                        ))}
                    </Card>
                  </Col>
                )}
              </Row>
            )}
          </>
        )}
      </Modal>

      <Modal
        title="Update User"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Enter User Id"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <Input
            placeholder="Enter Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
          <Input
            placeholder="Enter WhatsApp Number"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
          />
          <Select
            placeholder="Select User Type"
            onChange={(value) => setPrimaryType(value)}
            options={[
              { value: "CUSTOMER", label: "Customer" },
              { value: "PARTNER", label: "Partner" },
            ]}
          />
          <Button
            type="primary"
            // danger
            onClick={handleRemoveUser}
            disabled={removeLoading}
          >
            {removeLoading ? <LoadingOutlined spin /> : "Update"}
          </Button>
        </div>
      </Modal>

      <Modal
        title="User Comments"
        open={commentsModalVisible}
        onCancel={() => {
          setCommentsModalVisible(false);
          setComments([]);
        }}
        footer={null}
        width={600}
      >
        <div className="bg-slate-100 rounded-xl shadow-lg p-5 mb-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 m-0">Comments</h2>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg shadow-sm p-1">
            {loadingComments ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Spin size="large" />
                <span className="mt-4 text-slate-500">Loading comments...</span>
              </div>
            ) : comments.length > 0 ? (
              <div className="max-h-96 overflow-auto">
                {comments.map((comment, index) => {
                  const avatarColorClass = getAvatarColor(
                    comment.commentsUpdateBy
                  );
                  const initials = comment.commentsUpdateBy
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase();

                  return (
                    <div
                      key={index}
                      className={`p-4 ${
                        index !== comments.length - 1
                          ? "border-b border-slate-200"
                          : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${avatarColorClass}`}
                        >
                          {initials}
                        </div>

                        <div className="flex-grow">
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="font-medium text-slate-800 m-0">
                              {comment.commentsUpdateBy || "Unknown"}
                            </h3>
                            <Tooltip
                              title={formatDate(comment.commentsCreatedDate)}
                            >
                              <span className="text-xs text-slate-500">
                                {
                                  formatDate(comment.commentsCreatedDate).split(
                                    ","
                                  )[0]
                                }
                              </span>
                            </Tooltip>
                          </div>

                          <div className="mt-2 text-slate-600 bg-slate-50 p-3 rounded-lg relative">
                            {comment.adminComments}
                            <div className="absolute -top-2 -left-2 w-4 h-4 bg-slate-100 rounded-full border-2 border-white"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 px-3 text-center">
                <div className="bg-slate-100 p-3 rounded-full mb-3">
                  <svg
                    className="w-8 h-8 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-700">
                  No Comments Yet
                </h3>
              </div>
            )}
          </div>
        </div>

        {/* Add New Comment */}
        <div>
          <Text strong>Add Comment</Text>
          <TextArea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Enter your comment here..."
            autoSize={{ minRows: 3, maxRows: 6 }}
            className="mt-2 mb-4 rounded-md"
          />

          <div className="mb-4">
            <Text>Updated By:</Text>
            <Select
              value={updatedBy}
              onChange={(value: string) => setUpdatedBy(value)}
              className="w-full mt-1 rounded-md"
              dropdownStyle={{ borderRadius: "8px" }}
            >
              <Option value="Admin">Admin</Option>
              <Option value="Shanthi">Shanthi</Option>
              <Option value="Ramya">Ramya</Option>
              <Option value="Swathi">Swathi</Option>
              <Option value="Aruna">Aruna</Option>
              <Option value="Divya">Divya</Option>
              <Option value="Suchitra">Suchitra</Option>
              <Option value="Thulasi">Thulasi</Option>
              <Option value="Nagarani">Nagarani</Option>
              <Option value="Sandhya">Sandhya</Option>
              <Option value="Srilekha">Srilekha</Option>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                setCommentsModalVisible(false);
                setComments([]);
              }}
              className="rounded-md border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleSubmitComment}
              loading={submittingComment}
              className="rounded-md bg-blue-400 hover:bg-blue-500 border-blue-300"
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RegisteredUser;
