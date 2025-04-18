import React, { useState, useEffect, useRef } from "react";
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
  alternativeNumber: string;
  flatNo: string | null;
  landMark: string | null;
  pinCode: string | null;
  address: string | null;
  addressType: string | null;
  registerFrom: string;
  userType: string;
}
interface ReportData {
  totalCount: string;
  dayCount: string;
  response: [];
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
  const updatedBy = localStorage.getItem("userName")?.toUpperCase();
  // const [updatedBy, setUpdatedBy] = useState<string>("admin");
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [submittingComment, setSubmittingComment] = useState<boolean>(false);
  const [record, setRecord] = useState<UserData | null>(null);
  const [orderId, setOrderId] = useState<string | null>("");
  const [mobileNumber1, setMobileNumber1] = useState("");
  const [whatsappNumber1, setWhatsappNumber1] = useState("");
  const [userId1, setUserId1] = useState("");
  const userType = localStorage.getItem("primaryType");
  const [storedUniqueId, setStoredUniqueId] = useState<string | null>("");
  const [selectedTimeFrame, setSelectedTimeFrame] =
    useState<string>("thisWeek");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 10,
    showSizeChanger: false,
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
    const { startDate, endDate } = getDateRange(selectedTimeFrame);
    try {
      const response = await axios.get<ApiResponse>(
        `${BASE_URL}/user-service/date-rangeuserdetails?endDate=${endDate}&page=${
          pagination.current - 1
        }&size=${10}&startDate=${startDate}`
      );

      setUserData(response.data.content);
      setFilteredUserData(response.data.content);
      setPagination({
        ...pagination,
        total: response.data.totalElements,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
      setFilteredUserData([]);
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
    const storedUniqueId = localStorage.getItem("uniquId");
    setStoredUniqueId(storedUniqueId);
    fetchCounts();
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [selectedTimeFrame, pagination.current]);

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
      width: 150,
      // align: "center" as const,
      render: (_: string, record: UserData) => {
        const mobile = record.mobileNumber;
        const whatsapp = record.whatsappNumber;

        const tagStyle = {
          fontSize: "14px",
          width: "120px",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
        };

        return (
          <Space direction="vertical" size="small">
            <Text>{record.fullName || "No name provided"}</Text>
            <Text type="secondary">{record.email || "No email provided"}</Text>

            {/* Case 1: mobile === whatsapp */}
            {whatsapp && mobile && whatsapp === mobile && (
              <>
                <Tag color="green" style={tagStyle}>
                  <WhatsAppOutlined className="mr-1" />
                  {mobile}{" "}
                </Tag>
                {record.alternativeNumber && (
                  <Tag color="purple" style={tagStyle}>
                    <PhoneOutlined className="mr-1" />
                    {record.alternativeNumber}{" "}
                  </Tag>
                )}
              </>
            )}

            {/* Case 2: mobile !== whatsapp and both exist */}
            {whatsapp && mobile && whatsapp !== mobile && (
              <>
                <Tag color="green" style={tagStyle}>
                  <WhatsAppOutlined className="mr-1" />
                  {whatsapp}
                </Tag>
                <Tag color="purple" style={tagStyle}>
                  <PhoneOutlined className="mr-1" />
                  {mobile}
                </Tag>
              </>
            )}

            {/* Case 3: Only mobile */}
            {!whatsapp && mobile && (
              <Tag color="purple" style={tagStyle}>
                <PhoneOutlined className="mr-1" />
                {mobile}
              </Tag>
            )}

            {/* Case 4: Only WhatsApp */}
            {whatsapp && !mobile && (
              <Tag color="green" style={tagStyle}>
                <WhatsAppOutlined className="mr-1" />
                {whatsapp}
              </Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: "Registered From",
      dataIndex: "userType",
      key: "userType",
      width: 80,
      render: (_: string, record: UserData) => (
        <>
          <Tag className="mb-1" color="green">
            {record.userType === "NEW USER" ? "ASKOXY" : "ERICE"}
          </Tag>
          <Tag color="geekblue">{record.registerFrom}</Tag>
        </>
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
              {fullAddress.length > 0 ? fullAddress : "No Address provided"}
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
            className="w-full rounded-md bg-purple-400 hover:bg-purple-500 border-purple-500"
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
              showCommentsModal(record);
            }}
            className="w-full rounded-md text-white bg-blue-600 hover:bg-blue-200 border-blue-600 text-blue-700"
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
    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: "center" as const,
      render: (record: OrderData) => (
        <Space direction="vertical" size="small">
          <Button
            type="default"
            size="small"
            onClick={() => {
              setRecord(selectedUser);
              showCommentsModal(selectedUser);
              setOrderId(record.orderId);
            }}
            className="w-full rounded-md bg-purple-100 hover:bg-purple-200 border-purple-300 text-purple-700"
          >
            Comments
          </Button>
        </Space>
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

  const showCommentsModal = async (record: UserData | null): Promise<void> => {
    setCommentsModalVisible(true);
    await fetchComments(record);
  };

  const fetchComments = async (record: UserData | null): Promise<void> => {
    if (!record || !record.id) return;

    setLoadingComments(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/user-service/fetchAdminComments`,
        { userId: record.id },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data && typeof response.data === "object") {
        setComments(response.data);
      } else {
        setComments([]);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 500) {
        message.info("No comments found");
      } else {
        message.error(
          "Failed to load comments...please try again after some time."
        );
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
    setOrderId("");

    let update = updatedBy;
    const type = localStorage.getItem("primaryType");
    if (type === "SELLER") {
      update = "ADMIN";
    }

    let comment = newComment;

    if (orderId) {
      comment = `Regarding order Id ${orderId} ${newComment}`;
    }
    setSubmittingComment(true);
    try {
      await axios.patch(
        `${BASE_URL}/user-service/adminUpdateComments`,
        {
          adminComments: comment,
          adminUserId: storedUniqueId,
          commentsUpdateBy: update,
          userId: record?.id,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      message.success("Comment added successfully");
      setNewComment("");
      await fetchComments(record);
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
          <div className="flex flex-wrap gap-2">
            <Input
              type="date"
              value={startDate1}
              onChange={(e) => setStartDate1(e.target.value)}
              placeholder="Start Date"
              className="w-[150px]"
            />
            <Input
              type="date"
              value={endDate1}
              onChange={(e) => setEndDate1(e.target.value)}
              placeholder="End Date"
              className="w-[150px]"
            />
            <Button
              type="primary"
              className="bg-[rgb(0,_140,_186)] w-[90px] text-white"
              onClick={() => handleTimeFrameChange("custom")}
              loading={loading}
            >
              Get Data
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: "user",
      label: "Search by Mobile Number",
      children: (
        <div className="mt-4">
          <div className="flex gap-2">
            <Input
              placeholder="Mobile Number"
              value={mobileNumber1}
              onChange={(e) => setMobileNumber1(e.target.value)}
              prefix={<PhoneOutlined />}
              allowClear
              className="w-[160px] m-0" // Added m-0 to remove margin
            />
            <Input
              placeholder="WhatsApp Number"
              value={whatsappNumber1}
              onChange={(e) => setWhatsappNumber1(e.target.value)}
              prefix={<WhatsAppOutlined style={{ color: "#25D366" }} />}
              allowClear
              className="w-[180px] m-0" // Added m-0 to remove margin
            />
            <Input
              placeholder="User ID"
              value={userId1}
              onChange={(e) => setUserId1(e.target.value)}
              prefix={<UserOutlined />}
              allowClear
              className="w-[150px] m-0" // Added m-0 to remove margin
            />
            <Button
              type="primary"
              className="bg-[rgb(0,_140,_186)] w-[90px] text-white m-0" // Added m-0 to remove margin
              onClick={handleUserSearch}
              loading={loading}
              disabled={!mobileNumber1 && !whatsappNumber1 && !userId1}
              icon={<SearchOutlined />}
            >
              Search
            </Button>
          </div>
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

    const hash = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4">
        <Title level={2} className="m-0">
          Registered Users
        </Title>

        {userType === "SELLER" && (
          <Button
            type="primary"
            icon={<Pencil size={16} className="mr-1" />}
            onClick={showModal}
          >
            Update User
          </Button>
        )}
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
                <div style={{ height: 200, width: "100%", overflow: "hidden" }}>
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

      <Modal
        zIndex={100}
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
            onClick={() => {
              setOrderDetailsVisible(false);
              setSelectedUser(null);
            }}
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
                    <Table
                      dataSource={userOrders}
                      columns={orderColumns}
                      rowKey="orderId"
                      pagination={false}
                      size="small"
                      scroll={{ x: "max-content" }}
                      rowClassName={(_, index) =>
                        index % 2 === 0 ? "table-row-light" : "table-row-dark"
                      }
                      locale={{
                        emptyText: (
                          <span className="text-gray-500">
                            No orders found for this user.
                          </span>
                        ),
                      }}
                    />
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
        zIndex={150}
        title="HelpDesk Comments"
        open={commentsModalVisible}
        onCancel={() => {
          setCommentsModalVisible(false);
          setComments([]);
          setOrderId("");
        }}
        footer={null}
        width={550}
      >
        <div className="flex flex-col">
          {/* Comments Section */}
          <div className="mb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-3">
              Recent Comments
            </h3>

            {loadingComments ? (
              <div className="flex items-center justify-center py-6">
                <Spin size="default" />
                <span className="ml-3 text-gray-500">Loading comments...</span>
              </div>
            ) : comments && comments.length > 0 ? (
              <div className="w-full max-w-xl max-h-80 overflow-y-auto border border-gray-200 rounded-lg shadow-sm bg-white">
                {comments.map((comment, index) => {
                  const initials = (comment.commentsUpdateBy || "Unknown")
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase();

                  const colorOptions = [
                    "bg-green-100 text-green-700",
                    "bg-purple-100 text-purple-700",
                    "bg-amber-100 text-amber-700",
                    "bg-teal-100 text-teal-700",
                    "bg-rose-100 text-rose-700",
                    "bg-indigo-100 text-indigo-700",
                  ];

                  const colorIndex =
                    comment.commentsUpdateBy?.length % colorOptions.length || 0;
                  const avatarColor = colorOptions[colorIndex];

                  return (
                    <div
                      key={index}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <div className="px-3 py-1.5 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center mb-0.5">
                          <div
                            className={`w-6 h-6 rounded-full ${avatarColor} flex items-center justify-center text-[10px] font-semibold mr-2`}
                          >
                            {initials}
                          </div>
                          <span className="font-medium text-sm text-gray-800">
                            {comment.commentsUpdateBy || "Unknown"}
                          </span>
                          <span className="text-[10px] text-gray-400 ml-auto">
                            {
                              formatDate(comment.commentsCreatedDate).split(
                                ","
                              )[0]
                            }
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 pl-8 mt-0.5 leading-snug">
                          {comment.adminComments}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 border border-gray-200 rounded-lg bg-gray-50">
                <svg
                  className="w-6 h-6 text-gray-400 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-sm text-gray-500">No comments available</p>
              </div>
            )}
          </div>

          {/* Add Comment Section */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-3">
              {/* <div className="flex items-center justify-between">
                <Text strong className="text-sm text-gray-800">
                  Add Comment
                </Text>
                <Select
                  value={updatedBy}
                  onChange={(value) => setUpdatedBy(value)}
                  className="w-44"
                  size="middle"
                  placeholder="Select user"
                  style={{ borderRadius: "6px" }}
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
              </div> */}

              <TextArea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Type your comment here..."
                autoSize={{ minRows: 3, maxRows: 5 }}
                className="text-sm rounded-lg border-gray-300"
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  size="middle"
                  onClick={() => {
                    setCommentsModalVisible(false);
                    setComments([]);
                  }}
                  className="hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  size="middle"
                  onClick={handleSubmitComment}
                  loading={submittingComment}
                  className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RegisteredUser;
