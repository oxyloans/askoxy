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
import moment from "moment";

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
  helpdeskuserId: string | null;
  address: string | null;
  addressType: string | null;
  registerFrom: string;
  userType: string;
  assignedTo: string | null;
}

interface ApiResponse {
  content: UserData[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

interface OrderHistory {
  createdDate: string | null;
  orderId: string;
  pickUpDate: string | null;
  placedDate: string | null;
  acceptedDate: string | null;
  assignedDate: string | null;
  deliveredDate: string | null;
  canceledDate: string | null;
  rejectedDate: string | null;
  status: string;
}

interface OrderItem {
  itemId: string;
  productName: string;
  quantity: number;
  price: number;
  orderId: string;
  containerStatus: string | null;
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
  customerMobile?: string | null;
  testUser?: boolean;
  paymentStatus?: string | null;
  alternativeMobileNumber?: string | null;
  customerName?: string | null;
  orderHistory?: OrderHistory[] | null;
  orderAddress?: string | null;
  sellerId?: string | null;
  deliveryBoyId?: string | null;
  deliveryBoyMobile?: string | null;
  deliveryBoyName?: string | null;
  orderAssignedDate?: string | null;
  orderCanceledDate?: string | null;
  distance?: number | null;
  choosedLocations?: string[] | null;
  orderItem?: OrderItem[] | null;
}

interface Comment {
  adminComments: string;
  commentsUpdateBy: string;
  commentsCreatedDate?: string;
  userId?: string;
}
interface HelpDeskUser {
  mail: string;
  userId: string;
  createdAt: string;
  emailVerified: string;
  name: string;
  lastFourDigitsUserId: string;
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
  const [helpDeskUsers, setHelpDeskUsers] = useState<HelpDeskUser[]>([]);
  const [selectedTimeFrame, setSelectedTimeFrame] =
    useState<string>("thisWeek");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
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
  const deliveredOrdersCount = userOrders.filter(
    (order) => order.orderStatus === "4"
  ).length;
  const hasOrders = userOrders.length > 0;
  const userStatus = hasOrders
    ? "Logged in, placed order"
    : "Not logged in, not placed order";
  const currentDate = moment();
  const sixMonthsAgo = moment().subtract(6, "months");
  const latestOrder =
    userOrders.length > 0
      ? userOrders.reduce((latest, order) =>
          moment(order.orderDate).isAfter(moment(latest.orderDate))
            ? order
            : latest
        )
      : null;
  const isActiveUser =
    latestOrder && moment(latestOrder.orderDate).isAfter(sixMonthsAgo);
  const activityStatus = isActiveUser ? "Active" : "Inactive";
  const activityMessage = latestOrder
    ? isActiveUser
      ? "User placed order within last six months"
      : "User has not placed order in last six months"
    : "User not placed any order";

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
        }&size=${50}&startDate=${startDate}`
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
        BASE_URL + "/order-service/getAllOrders_customerId1",
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
      case 2:
        return "Online";
      case 1:
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
    fetchHelpDeskUsers();
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
  const fetchHelpDeskUsers = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user-service/getAllHelpDeskUsers`,
        {
          headers: {
            accept: "*/*",
          },
        }
      );
      setHelpDeskUsers(response.data);
    } catch (error) {
      console.error("Error fetching helpdesk users:", error);
      message.error("Failed to fetch helpdesk users");
    }
  };

  const getHelpDeskName = (assignedToId: string | null): string => {
    const helpDeskUser = helpDeskUsers.find(
      (user) => user.userId === assignedToId
    );
    return helpDeskUser ? helpDeskUser.name : "Unknown";
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
            <Text className={record.fullName ? "text-black" : "text-gray-500"}>
              {record.fullName || "No name"}
            </Text>

            <Text type="secondary">{record.email || "No email"}</Text>

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
            {record.userType }
          </Tag>
          {record.registerFrom && (
            <Tag color="geekblue">{record.registerFrom}</Tag>
          )}
        </>
      ),
    },
    {
      title: "Registration Date",
      key: "createdAt",
      width: 90,
      align: "center" as const,
      render: (record: UserData) => {
        const helpDeskName = getHelpDeskName(record.helpdeskuserId || record.assignedTo);
        return (
          <div className="flex flex-col items-center justify-center text-center">
            <span className=" font-bold">{formatDate(record.created_at)}</span>

            {(record.helpdeskuserId || record.assignedTo ) && (
              <div className="flex flex-row items-center justify-center mt-2">
                <span className="mr-2 text-gray-400">to:</span>
                <Tag
                  color="cyan"
                  className="w-fit flex items-center justify-center"
                >
                  <UserOutlined className="mr-1" />
                  {helpDeskName}  
                </Tag>
              </div>
            )}
          </div>
        );
      },
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

        const isAddressPresent = fullAddress.length > 0;

        return (
          <div className="max-w-full max-h-[80px] p-1 text-center overflow-auto scrollbar-hide">
            <Text
              className={`whitespace-normal break-words block overflow-auto leading-6 ${
                isAddressPresent ? "text-inherit" : "text-gray-500 italic"
              }`}
            >
              {isAddressPresent ? fullAddress : "No Address"}
            </Text>
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_text: any, record: UserData) => (
        <div className="flex flex-col gap-2 w-fit">
          <Button
            type="default"
            size="small"
            onClick={() => viewOrderDetails(record)}
            className="rounded-md border border-purple-400 text-purple-600 hover:bg-purple-100 px-3 "
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
            className="rounded-md border border-blue-400 text-blue-600 hover:bg-blue-100 px-3"
          >
            Comments
          </Button>
        </div>
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

  const getColumnsForAllOrders = (orders: OrderData[]) => {
    const columns = [
      {
        title: "Order ID",
        dataIndex: "newOrderId",
        key: "newOrderId",
        render: (text: string, record: OrderData) => (
          <strong className="text-bold">{record.newOrderId}</strong>
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
        title: "Order Items",
        dataIndex: "orderItem",
        key: "orderItems",
        width: 150,
        render: (_text: any, record: OrderData) => {
          const items = record.orderItem || [];
          return (
            <div className="text-xs">
              {items.map((item, index) => (
                <div
                  key={item.itemId}
                  className={index !== 0 ? "mt-2 pt-2 border-t" : ""}
                >
                  <p>
                    <strong>{item.productName}</strong>
                  </p>
                  {item.containerStatus && (
                    <p className="text-green-500 text-bold text-sm ">
                      <strong>{item.containerStatus}</strong>
                    </p>
                  )}
                </div>
              ))}
            </div>
          );
        },
      },
      {
        title: "Amount",
        dataIndex: "grandTotal",
        key: "grandTotal",
        render: (text: number) => `₹${text.toFixed(2)}`,
      },
      // {
      //   title: "Expected Delivery",
      //   dataIndex: "expectedDeliveryDate",
      //   key: "expectedDeliveryDate",
      //   render: (expectedDeliveryDate: string, record: OrderData) => (
      //     <div>
      //       <p>{expectedDeliveryDate}</p>
      //       <p>{record.timeSlot}</p>
      //       <p>{record.dayOfWeek}</p>
      //     </div>
      //   ),
      // },
      {
        title: "Status",
        dataIndex: "orderStatus",
        key: "orderStatus",
        render: (_text: any, record: OrderData) => (
          <div className="flex flex-col gap-2 items-center">
            <Tag color={getStatusColor(record.orderStatus)}>
              {getStatusText(record.orderStatus)}
            </Tag>
            <Tag color="green">{getPaymentTypeText(record.paymentType)}</Tag>
          </div>
        ),
      },
      {
        title: "Actions",
        key: "orderId",
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

    if (["1", "2", "3","PickedUp"].includes(userOrders[0]?.orderStatus)) {
      columns.splice(3, 0, {
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
      });
    }

    // if (["3", "PickedUp"].includes(userOrders[0]?.orderStatus)) {
    //   columns.splice(columns.length - 1, 0, {
    //     title: "Delivery Boy Details",
    //     dataIndex: "deliveryBoyName", // Add dataIndex to fix type error
    //     key: "deliveryBoyDetails",
    //     render: (text: string, record: OrderData) => (
    //       <div>
    //         <p>
    //           <strong>Name:</strong> {record.deliveryBoyName || "N/A"}
    //         </p>
    //         <p>
    //           <strong>Mobile:</strong> {record.deliveryBoyMobile || "N/A"}
    //         </p>
    //       </div>
    //     ),
    //   });
    // }

    if (
      ["1", "2", "3", "4", "PickedUp"].includes(userOrders[0]?.orderStatus) &&
      userOrders[0]?.orderHistory?.length
    ) {
      columns.splice(columns.length - 1, 0, {
        title: "Order Timeline",
        dataIndex: "orderHistory", // Add dataIndex to fix type error
        key: "orderTimeline",
        width: 130,
        render: (_text: any, record: OrderData) => {
          const history = record.orderHistory || [];

          // Find the relevant dates from order history
          const findDate = (status: string) => {
            const entry = history.find((h) => h.status === status);
            if (!entry) return null;

            // Determine which date field to use based on status
            if (status === "1") return entry.placedDate;
            if (status === "2") return entry.acceptedDate;
            if (status === "3") return entry.assignedDate;
            if (status === "PickedUp") return entry.pickUpDate;
            if (status === "4") return entry.deliveredDate;
            return null;
          };

          // Format date to show only time if it's today
          const formatDate = (dateStr: string | null) => {
            if (!dateStr) return "N/A";
            const date = new Date(dateStr);
            return date.toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            });
          };

          return (
            <div className="text-xs">
              {findDate("1") && (
                <p>
                  <strong>Placed:</strong> {formatDate(findDate("1"))}
                </p>
              )}
              {findDate("2") && (
                <p>
                  <strong>Accepted:</strong> {formatDate(findDate("2"))}
                </p>
              )}
              {findDate("3") && (
                <p>
                  <strong>Assigned:</strong> {formatDate(findDate("3"))}
                </p>
              )}
              {findDate("PickedUp") && (
                <p>
                  <strong>Picked Up:</strong> {formatDate(findDate("PickedUp"))}
                </p>
              )}
              {findDate("4") && record.orderStatus === "4" && (
                <p>
                  <strong>Delivered:</strong> {formatDate(findDate("4"))}
                </p>
              )}
            </div>
          );
        },
      });
    }

    return columns;
  };

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
          number: mobileNumber1 || null,
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
        userType: user.userType || null,
        registerFrom: user.registeredFrom || null,
        assignedTo:user.assignedTo || null
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
              placeholder="Enter mobile/whatsapp Number"
              value={mobileNumber1}
              onChange={(e) => setMobileNumber1(e.target.value)}
              prefix={<PhoneOutlined />}
              allowClear
              className="w-[220px] m-0" // Added m-0 to remove margin
            />
            {/* <Input
              placeholder="WhatsApp Number"
              value={whatsappNumber1}
              onChange={(e) => setWhatsappNumber1(e.target.value)}
              prefix={<WhatsAppOutlined style={{ color: "#25D366" }} />}
              allowClear
              className="w-[180px] m-0"
            /> */}
            <Input
              placeholder="User ID"
              value={userId1}
              onChange={(e) => setUserId1(e.target.value)}
              prefix={<UserOutlined />}
              allowClear
              className="w-[150px] m-0"
            />
            <Button
              type="primary"
              className="bg-[rgb(0,_140,_186)] w-[90px] text-white m-0"
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
                title="User Registration by Dates"
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
          size="small"
          rowClassName={(_, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
          locale={{
            emptyText: (
              <span className="text-gray-500">No registered users found.</span>
            ),
          }}
        />
      </div>

      <Modal
        zIndex={100}
        title={
          <span className="text-blue-500 text-xl font-semibold">
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
            className="bg-red-500 text-white border-none hover:bg-red-600"
          >
            Close
          </Button>,
        ]}
        width={800}
        className="rounded-lg overflow-hidden"
      >
        {loader ? (
          <div className="text-center p-8 bg-gray-100 rounded-lg">
            <Spin size="large" className="text-blue-500" />
            <p className="text-gray-600 mt-2">Loading order details...</p>
          </div>
        ) : (
          <>
            {selectedUser && (
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card
                    title={
                      <span className="text-coldblue font-semibold">
                        Customer Information
                      </span>
                    }
                    className="rounded-lg shadow-md bg-white"
                  >
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <p className="text-gray-600">
                          <strong className="text-indigo-700">Name:</strong>{" "}
                          {selectedUser.fullName || "N/A"}
                        </p>
                        <p className="text-gray-600">
                          <strong className="text-indigo-700">Email:</strong>{" "}
                          {selectedUser.email || "N/A"}
                        </p>
                        <p className="text-gray-600">
                          <strong className="text-indigo-700">Phone:</strong>{" "}
                          {selectedUser.whatsappNumber ||
                            selectedUser.mobileNumber ||
                            "N/A"}
                        </p>
                        <p className="text-gray-600">
                          <strong className="text-indigo-700">User ID:</strong>{" "}
                          {selectedUser.id || "N/A"}
                        </p>
                        <p className="text-gray-600">
                          <strong className="text-indigo-700">Address:</strong>{" "}
                          {selectedUser.address || "N/A"}
                        </p>
                      </Col>
                      <Col span={12}>
                        <div className="bg-blue-50 p-4 rounded-lg h-full flex flex-col justify-center">
                          <p className="text-gray-600 mb-3">
                            <strong className="text-indigo-700">
                              User Status:
                            </strong>{" "}
                            <span
                              className={`font-bold ${
                                hasOrders ? "text-green-500" : "text-red-500"
                              }`}
                            >
                              {userStatus}
                            </span>
                          </p>
                          <p className="text-gray-600 mb-3">
                            <strong className="text-indigo-700">
                              Total Orders:
                            </strong>{" "}
                            <span className="font-bold text-blue-600">
                              {userOrders.length}
                            </span>
                          </p>
                          <p className="text-gray-600 mb-3">
                            <strong className="text-indigo-700">
                              Delivered Orders:
                            </strong>{" "}
                            <span className="font-bold text-blue-600">
                              {deliveredOrdersCount}
                            </span>
                          </p>
                          <p className="text-gray-600 mb-3">
                            <strong className="text-indigo-700">
                              User Type:
                            </strong>{" "}
                            <span className="font-bold text-blue-600">
                              {selectedUser.userType || "N/A"}
                            </span>
                          </p>
                          <p className="text-gray-600 mb-2">
                            <strong className="text-indigo-700">
                              Activity Status:
                            </strong>{" "}
                            <span
                              className={`font-bold ${
                                isActiveUser ? "text-green-500" : "text-red-500"
                              }`}
                            >
                              {activityStatus}
                            </span>
                          </p>
                          <p
                            className={`text-xs ${
                              activityMessage ===
                              "User placed order within last six months"
                                ? "text-gray-500"
                                : "text-red-500"
                            }`}
                          >
                            {activityMessage}
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>

                <Col span={24}>
                  <Card
                    title={
                      <span className="text-blue-600 font-semibold">
                        Orders History
                      </span>
                    }
                    extra={
                      <Text type="secondary" className="text-purple-500">
                        {userOrders.length} orders found
                      </Text>
                    }
                    className="rounded-lg shadow-md bg-white"
                  >
                    <Table
                      dataSource={userOrders}
                      columns={getColumnsForAllOrders(userOrders)}
                      rowKey="orderId"
                      pagination={false}
                      size="small"
                      scroll={{ x: "max-content" }}
                      rowClassName={(_, index) =>
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
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
