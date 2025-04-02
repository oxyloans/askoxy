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
} from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import BASE_URL from "../Config";

const { Title, Text } = Typography;
const { Option } = Select;

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
        const daysSinceSunday = dayOfWeek === 0 ? 0 : dayOfWeek;
        startDate.setDate(today.getDate() - daysSinceSunday);
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

      setUserData(response.data.content); // Store all data
      setFilteredUserData(response.data.content); // Initially show all data
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

  // Handle search
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
        return "picked up";
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
      case "picked up":
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
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Function called when the "Order Details" button is clicked
  const viewOrderDetails = (record: UserData) => {
    setSelectedUser(record);
    setOrderDetailsVisible(true);
    fetchOrderDetails(record.id);
  };

  useEffect(() => {
    if (selectedTimeFrame !== "custom") {
      fetchUserData();
    }
  }, [selectedTimeFrame]);

  useEffect(() => {
    fetchCounts();
  }, []);

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
      width: 150,
      align: "center" as const,
      render: (record: UserData) => (
        <Text strong style={{ color: "#67297c" }}>
          {record.id}
        </Text>
      ),
    },
    {
      title: "User Details",
      key: "userDetails",
      width: 200,
      // align: "center" as const,
      render: (record: UserData) => (
        <Space direction="vertical" size="small">
          <Text>Name: {record.fullName || "N/A"}</Text>
          <Text type="secondary">Email: {record.email || "N/A"}</Text>
          <Tag
            icon={<WhatsAppOutlined style={{ color: "#25D366" }} />}
            color="#E6F4EA"
            style={{ padding: "2px 4px", borderRadius: 12 }}
          >
            <Text strong>{record.whatsappNumber || "N/A"}</Text>
          </Tag>
          <Tag
            icon={<PhoneOutlined style={{ color: "#722ED1" }} />}
            color="#F9F0FF"
            style={{ padding: "2px 4px", borderRadius: 12 }}
          >
            <Text strong>{record.mobileNumber || "N/A"}</Text>
          </Tag>
        </Space>
      ),
    },
    {
      title: "Registration Date",
      key: "createdAt",
      width: 90,
      align: "center" as const,
      render: (record: UserData) => (
        <Text strong style={{ color: "#0d9488" }}>
          {record.created_at}
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
            icon={<FileTextOutlined />}
            onClick={() => viewOrderDetails(record)}
            style={{ width: "100%" }}
          >
            Order Details
          </Button>
          <Button
            size="small"
            icon={<SwapOutlined />}
            onClick={() => handleToggleTestUser(record)}
            loading={loading}
            type={record.testuser ? "primary" : undefined} // Only primary when test user
            style={{
              width: "100%",
              backgroundColor: record.testuser ? "#22c55e" : "#ffffff",
              borderColor: record.testuser ? "#16a34a" : "#ef4444",
              color: record.testuser ? "#ffffff" : "#ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            }}
            className="hover:opacity-90 transition-all duration-300"
          >
            {record.testuser ? "Convert Live" : "Convert Test"}
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
      render: (text: string) => formatDate(text),
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
          <p>{expectedDeliveryDate}</p>
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto bg-gray-50">
        <div className="flex justify-between items-center p-4">
          <Title level={2}>Registered Users</Title>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={showModal}
          >
            Remove User
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

        {/* Filters */}
        <Card className="mt-4 p-4">
          <Row gutter={[16, 16]} align="middle">
            {/* Time Period Section */}
            <Col
              xs={isCustomDate ? 24 : 12}
              sm={isCustomDate ? 8 : 8}
              md={isCustomDate ? 6 : 6}
            >
              <Text strong>Time Period:</Text>
              <Select
                className="w-full mt-2"
                value={selectedTimeFrame}
                onChange={handleTimeFrameChange}
              >
                {timeOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Col>

            {/* Custom Date Controls - Only shown when isCustomDate is true */}
            {isCustomDate && (
              <>
                <Col xs={12} sm={8} md={6}>
                  <Text strong>Start Date:</Text>
                  <Input
                    type="date"
                    value={startDate1}
                    onChange={(e) => setStartDate1(e.target.value)}
                    className="w-full mt-2"
                  />
                </Col>

                <Col xs={12} sm={8} md={6}>
                  <Text strong>End Date:</Text>
                  <Input
                    type="date"
                    value={endDate1}
                    onChange={(e) => setEndDate1(e.target.value)}
                    className="w-full mt-2"
                  />
                </Col>

                <Col xs={24} sm={8} md={6}>
                  <Button
                    type="primary"
                    className="w-full mt-6"
                    onClick={fetchUserData}
                    loading={loading}
                  >
                    Get Data
                  </Button>
                </Col>
              </>
            )}

            {/* Search Controls */}
            <Col
              xs={isCustomDate ? 12 : 12}
              sm={isCustomDate ? 12 : 8}
              md={isCustomDate ? 6 : 6}
              className={isCustomDate ? "mt-4 sm:mt-0" : ""}
            >
              <Text strong>Search By:</Text>
              <Select
                className="w-full mt-2"
                placeholder="Select Search Type"
                onChange={(value) => setSearchType(value)}
                options={[
                  { label: "Name", value: "name" },
                  { label: "Mobile", value: "mobile" },
                ]}
                allowClear
              />
            </Col>

            {searchType && (
              <Col
                xs={isCustomDate ? 12 : 12}
                sm={isCustomDate ? 12 : 8}
                md={isCustomDate ? 6 : 6}
                className={isCustomDate ? "mt-4 sm:mt-0" : ""}
              >
                <Text strong>Enter {searchType}:</Text>
                <Input
                  placeholder={
                    searchType === "name"
                      ? "Search by Name..."
                      : "Search by Mobile..."
                  }
                  value={searchText}
                  onChange={handleSearch}
                  className="w-full mt-2"
                  prefix={<SearchOutlined />}
                  allowClear
                />
              </Col>
            )}
          </Row>
        </Card>

        <div style={{ overflowX: "auto", maxWidth: "100%" }}>
          <Table
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
        title="Remove User"
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
            danger
            onClick={handleRemoveUser}
            disabled={removeLoading}
          >
            {removeLoading ? <LoadingOutlined spin /> : "Remove"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default RegisteredUser;
