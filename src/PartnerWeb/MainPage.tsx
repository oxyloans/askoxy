import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  Select,
  Table,
  Typography,
  Tag,
  Row,
  Col,
  Form,
  Spin,
  Button,
  Input,
  Modal,
  message,
  Radio,
  Space,
  Empty,
  DatePicker,
} from "antd";
import { ColumnsType } from "antd/es/table";
import {
  EnvironmentOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  LoadingOutlined,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Truck, ShoppingBag, ShoppingCart, Store } from "lucide-react";
import BASE_URL from "../Config";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Dayjs } from "dayjs";

type OrderData = {
  orderId: string;
  uniqueId: string;
  orderStatus: string;
  orderDate: string;
  timeSlot: string;
  expectedDeliveryDate: string;
  orderAddress: Address;
  testUser: boolean;
  address?: string;
  clusterId: string;
  distance: string;
  distancefromMiyapur: string;
  distancefromMythriNager: string;
  choosedLocations: string;
  orderItems: OrderItems[];
  orderFrom: string;
  userType: string;
};

type OrderItems = {
  itemName: string;
  quantity: string;
  singleItemPrice: number;
  itemMrpPrice: number;
  price: number;
  weight: string;
};

type DeliveryBoy = {
  userId: string;
  firstName: string;
  lastName: string;
  whatsappNumber: string;
  isActive: string;
  testUser: boolean;
};

type Address = {
  flatNo: string;
  address: string;
  landMark: string;
  pincode: number;
  customerId: string;
  googleMapLink?: string;
};

type SummaryData = {
  name: string;
  count: number;
  status: string;
};

const { Text } = Typography;
const { TextArea } = Input;

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [summaryData, setSummaryData] = useState<SummaryData[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderData[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 50 });
  const [searchValue, setSearchValue] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [rejectForm] = Form.useForm();
  const accessToken = JSON.parse(localStorage.getItem("Token") || "{}");
  const [selectedRecord, setSelectedRecord] = useState<OrderData | null>(null);
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [dbModalVisible, setdbModalVisible] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] =
    useState<DeliveryBoy | null>();
  const [dbLoading, setdbLoading] = useState<boolean>(false);
  const [dbLoading1, setdbLoading1] = useState<boolean>(false);
  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleFilterByDate = () => {
    if (!selectedDate) {
      return;
    }

    const filtered = orderDetails.filter((order) => {
      return order.expectedDeliveryDate === selectedDate;
    });

    setFilteredOrders(filtered.length > 0 ? filtered : filteredOrders);
  };

  const STATUS_COLORS = {
    "1": {
      gradient: "from-sky-300 to-sky-400",
      background: "linear-gradient(135deg, #7dd3fc 0%, #38bdf8 100%)",
      borderColor: "#38bdf8",
      icon: <ShoppingBag className="text-xl text-white" />,
      label: "New Orders",
    },
    "2": {
      gradient: "from-green-300 to-green-400",
      background: "linear-gradient(135deg, #86efac 0%, #34d399 100%)",
      borderColor: "#34d399",
      icon: <ShoppingCart className="text-xl text-white" />,
      label: "Accepted Orders",
    },
    "3": {
      gradient: "from-rose-200 to-rose-300",
      background: "linear-gradient(135deg, #fecdd3 0%, #fda4b8 100%)",
      borderColor: "#fda4b8",
      icon: <Truck className="text-xl text-white" />,
      label: "Assigned Orders",
    },
    PickedUp: {
      gradient: "from-indigo-300 to-indigo-400",
      background: "linear-gradient(135deg, #a5b4fc 0%, #818cf8 100%)",
      borderColor: "#6366f1",
      icon: <Store className="text-xl text-white" />,
      label: "PickedUp Orders",
    },
  };

  const fetchOrders = async (status: string): Promise<OrderData[]> => {
    try {
      const response = await axios.get<OrderData[]>(
        `${BASE_URL}/order-service/getAllOrdersBasedOnStatus?orderStatus=${status}`
      );
      return response.data
        .filter((order) => !order.testUser)
        .map((order) => ({
          ...order,
          address: order.orderAddress
            ? `${order.orderAddress.flatNo}, ${order.orderAddress.address}, ${order.orderAddress.landMark}, ${order.orderAddress.pincode}`
            : "No Address Available",
        }));
    } catch (error) {
      console.error(`Error fetching orders with status ${status}:`, error);
      return [];
    }
  };
  const fetchData = async () => {
    setLoading(true);
    const newOrders = await fetchOrders("1");
    const acceptedOrders = await fetchOrders("2");
    const assignedOrders = await fetchOrders("3");
    const pickedUpOrders = await fetchOrders("PickedUp");
    const summaryData = [
      { name: "New Orders", count: newOrders.length, status: "1" },
      { name: "Accepted Orders", count: acceptedOrders.length, status: "2" },
      { name: "Assigned Orders", count: assignedOrders.length, status: "3" },
      {
        name: "PickedUp Orders",
        count: pickedUpOrders.length,
        status: "PickedUp",
      },
    ];

    setSummaryData(summaryData);
    setOrderDetails([
      ...newOrders,
      ...acceptedOrders,
      ...assignedOrders,
      ...pickedUpOrders,
    ]);
    setFilteredOrders([
      ...newOrders,
      ...acceptedOrders,
      ...assignedOrders,
      ...pickedUpOrders,
    ]);
    setLoading(false);
  };
  // Data Fetching Effect
  useEffect(() => {
    fetchData();
    handleLogin();
  }, []);

  const handleLogin = () => {
    const accessToken = localStorage.getItem("Token");
    if (!accessToken) {
      navigate("/partnerLogin");
    }
  };

  const handleStatusFilter = (value: string | null) => {
    setSelectedStatus(value);
    if (value === null) {
      setFilteredOrders(orderDetails);
    } else {
      const filtered = orderDetails.filter(
        (order) => order.orderStatus === value
      );
      setFilteredOrders(filtered);
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "1":
        return "processing";
      case "2":
        return "green";
      case "3":
        return "purple";
      case "PickedUp":
        return "orange";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "1":
        return "placed";
      case "2":
        return "Accepted";
      case "3":
        return "assigned";
      case "PickedUp":
        return "Picked Up";
      default:
        return "Unknown";
    }
  };

  const handleViewDetails = (order: OrderData) => {
    localStorage.setItem("orderId", order.orderId);
    navigate(`/home/orderDetails`);
  };

  const showRejectConfirmation = (record: OrderData) => {
    Modal.confirm({
      title: "Are you sure you want to reject this order?",
      icon: <ExclamationCircleOutlined />,
      // content: "This action cannot be undone.",
      okText: "Yes, Reject",
      okButtonProps: { danger: true },
      cancelText: "No, Cancel",
      onOk() {
        setSelectedRecord(record);
        setIsModalVisible(true);
      },
    });
  };

  // Handle final rejection submission
  const handleFinalReject = async () => {
    try {
      await rejectForm.validateFields();
      const rejectReason = rejectForm.getFieldValue("rejectReason");
      const userId = selectedRecord?.orderAddress?.customerId;
      setConfirmLoading(true);
      const response = await axios.post(
        `${BASE_URL}/order-service/reject_orders`,
        {
          orderId: selectedRecord?.orderId,
          cancelReason: rejectReason,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken.token}`,
          },
        }
      );

      if (response.data.status) {
        message.success("Order rejected successfully");
        setIsModalVisible(false);
        fetchData();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      // Handle API or validation errors
      console.error("Rejection error:", error);
      message.error("Failed to reject order. Please try again.");
    } finally {
      setConfirmLoading(false);
      setIsModalVisible(false);
      rejectForm.resetFields();
    }
  };

  const handleAssign = async (orderId: string, orderStatus: string) => {
    if (!selectedDeliveryBoy) {
      message.warning("Please select a delivery boy.");
      return;
    }
    setdbLoading(true);
    let data =
      orderStatus === "2" || orderStatus === "1"
        ? { orderId: orderId, deliveryBoyId: selectedDeliveryBoy.userId }
        : { orderId: orderId, deliverBoyId: selectedDeliveryBoy.userId };

    let apiUrl =
      orderStatus === "2" || orderStatus === "1"
        ? `${BASE_URL}/order-service/orderIdAndDbId`
        : `${BASE_URL}/order-service/reassignOrderToDb`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        message.error("Failed to assign to delveryboy");
      } else {
        message.success("Order assigned successfully!");
        setdbModalVisible(false);
        fetchData();
      }
    } catch (error) {
      // console.error("Error assigning order:", error);
      message.error("Failed to assign order.");
    } finally {
      setdbLoading(false);
      setdbModalVisible(false);
      setSelectedDeliveryBoy(null);
    }
  };

  const RejectionReasonModal = ({ visible }: { visible: boolean }) => (
    <Modal
      title="Provide Rejection Reason"
      visible={visible}
      onOk={() => handleFinalReject()}
      onCancel={() => setIsModalVisible(false)}
      confirmLoading={confirmLoading}
    >
      <Form form={rejectForm} layout="vertical">
        <Form.Item
          name="rejectReason"
          label="Rejection Reason"
          rules={[
            {
              required: true,
              message: "Please provide a reason for rejection",
            },
            {
              min: 6,
              message: "Reason must be at least 6 characters long",
            },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Please provide a detailed reason for rejecting this order"
          />
        </Form.Item>
      </Form>
    </Modal>
  );

  const fetchDeliveryBoys = async (record: OrderData) => {
    setSelectedRecord(record);
    setdbLoading1(true);
    try {
      const url = `${BASE_URL}/user-service/deliveryBoyList`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        message.error(
          "Failed to get DilveryBoy list please try after sometime."
        );
      }
      const data = await response.json();
      setDeliveryBoys(data);
      setdbModalVisible(true);
    } catch (error) {
      message.warning(
        "Failed to get DilveryBoy list please try after sometime."
      );
    } finally {
      setdbLoading1(false);
    }
  };

  const getActionButtons = (status: string, record: OrderData) => {
    const buttonClasses =
      "relative overflow-hidden transition-all duration-300 ease-in-out w-10 md:w-auto px-2 flex justify-center items-center";

    switch (status) {
      case "1":
      case "2":
        return (
          <div className="flex flex-col md:flex-row gap-2">
            <div className="group relative">
              <Button
                type="primary"
                className={`bg-blue-500 hover:bg-blue-600 ${buttonClasses}`}
                onClick={() => fetchDeliveryBoys(record)}
              >
                <div className="flex items-center">
                  <span className="group-hover:hidden">A</span>
                  <span className="hidden group-hover:block">Assign</span>
                </div>
              </Button>
            </div>

            <div className="group relative">
              <Button
                danger
                className={`hover:bg-red-600 ${buttonClasses}`}
                onClick={() => showRejectConfirmation(record)}
              >
                <div className="flex items-center">
                  <span className="group-hover:hidden">R</span>
                  <span className="hidden group-hover:block">Reject</span>
                </div>
              </Button>
            </div>
          </div>
        );

      case "3":
      case "PickedUp":
        return (
          <div className="flex flex-col md:flex-row gap-2">
            <div className="group relative">
              <Button
                type="primary"
                className={`bg-green-500 hover:bg-green-600 ${buttonClasses}`}
                onClick={() => fetchDeliveryBoys(record)}
              >
                <div className="flex items-center">
                  <span className="group-hover:hidden">RA</span>
                  <span className="hidden group-hover:block">Re-assign</span>
                </div>
              </Button>
            </div>

            <div className="group relative">
              <Button
                danger
                className={`hover:bg-red-600 ${buttonClasses}`}
                onClick={() => showRejectConfirmation(record)}
              >
                <div className="flex items-center">
                  <span className="group-hover:hidden">R</span>
                  <span className="hidden group-hover:block">Reject</span>
                </div>
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const columns: ColumnsType<OrderData> = [
    {
      title: "Order ID",
      dataIndex: "uniqueId",
      key: "uniqueId",
      width: 100,
      sorter: (a, b) => a.uniqueId.localeCompare(b.uniqueId),
      render: (text: string, record: OrderData) => (
        <div className="flex flex-col gap-1">
          <Typography.Text
            className="text-xl font-bold cursor-pointer hover:text-blue-500"
            onClick={() => handleViewDetails(record)}
          >
            #{text}
          </Typography.Text>
          <Tag
            color={getStatusColor(record.orderStatus)}
            className="w-fit text-xs"
          >
            {getStatusText(record.orderStatus)}
          </Tag>
          {record.orderFrom && (
            <Tag color="green" className="w-fit text-xs">
              {record.orderFrom}
            </Tag>
          )}
          <Tag color="purple" className="w-fit text-xs">
            {record.userType}
          </Tag>
        </div>
      ),
    },
    {
      title: "Order Address",
      dataIndex: "orderAddress",
      key: "orderAddress",
      width: 190,
      sorter: (a, b) =>
        (a.orderAddress?.address || "").localeCompare(
          b.orderAddress?.address || ""
        ),
      render: (_: any, record: any) => {
        return (
          <div className="w-[200px] h-[120px] overflow-y-auto overflow-x-hidden scrollbar-hide">
            {record.orderAddress
              ? `${record.orderAddress.flatNo}, ${record.orderAddress.address}, ${record.orderAddress.landMark}, ${record.orderAddress.pincode}`
              : "No Address Available"}
          </div>
        );
      },
    },
    {
      title: "Order Pincode",
      key: "orderPincode",
      width: 80,
      sorter: (a, b) =>
        (a.orderAddress?.pincode || 0) - (b.orderAddress?.pincode || 0),
      render: (record: OrderData) => (
        <div className="flex items-center gap-2 mt-1 flex-col ">
          {record.orderAddress?.pincode ? (
            <Typography.Text className="text-sm">
              {record.orderAddress.pincode}
            </Typography.Text>
          ) : (
            <Typography.Text className="text-gray-500">
              Not provided
            </Typography.Text>
          )}
          {record.orderAddress?.googleMapLink && (
            <a
              href={record.orderAddress?.googleMapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-7 h-7 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200"
            >
              <EnvironmentOutlined style={{ fontSize: "20px" }} />
            </a>
          )}
        </div>
      ),
    },
    {
      title: "Date & Items",
      key: "datetime",
      width: 90,
      sorter: (a: OrderData, b: OrderData) =>
        new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(),
      render: (record: OrderData) => (
        <div className="whitespace-nowrap">
          <Typography.Text>
            <div>
              <strong>Order:</strong>{" "}
              {record.orderDate
                ? new Date(record.orderDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })
                : "Not provided"}
            </div>
            <div>
              <strong>Expected:</strong>{" "}
              {record.expectedDeliveryDate
                ? (() => {
                    const [day, month, year] =
                      record.expectedDeliveryDate.split("-");
                    const correctedDate = new Date(`${month}-${day}-${year}`);
                    return correctedDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    });
                  })()
                : "Not provided"}
            </div>
          </Typography.Text>
          <div className="bg-blue-50 p-2 rounded-md max-h-[100px] overflow-y-auto scrollbar-hide w-[220px]">
            {record.orderItems && record.orderItems.length > 0 ? (
              <div className="space-y-2">
                {record.orderItems.map((item, index) => (
                  <div key={index} className="flex flex-col">
                    {/* Item Name */}
                    <Typography.Text
                      strong
                      className="text-green-700 font-semibold text-sm"
                      ellipsis={{ tooltip: item.itemName }}
                    >
                      {item.itemName || "Unnamed Item"}
                    </Typography.Text>

                    <div className="flex gap-2 text-xs text-gray-700">
                      {item.price && (
                        <Typography.Text className="text-red-600 font-medium text-xs">
                          ₹{item.price}
                        </Typography.Text>
                      )}

                      {item.quantity && <span>Qty: {item.quantity}</span>}
                      {item.weight && <span>Weight: {item.weight}kgs</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Typography.Text type="secondary" className="text-xs">
                No items
              </Typography.Text>
            )}
          </div>
        </div>
      ),
    },

    {
      title: "Actions",
      dataIndex: "orderStatus",
      key: "orderStatus",
      width: 160,
      sorter: (a, b) => a.orderStatus.localeCompare(b.orderStatus),
      render: (text: string, record: OrderData) => {
        return (
          <div className="flex flex-col md:flex-row items-center gap-2">
            {getActionButtons(text, record)}

            <div className="group relative">
              <Button
                type="primary"
                className="w-full md:w-auto px-2 bg-purple-500 hover:bg-gray-700 transition-all duration-300 flex items-center justify-center"
                onClick={() => handleViewDetails(record)}
              >
                <div className="flex items-center">
                  <span className="group-hover:hidden">View</span>
                  <span className="hidden group-hover:block">ViewDetails</span>
                </div>
              </Button>
            </div>
          </div>
        );
      },
    },
    {
      title: "Distance",
      key: "distance",
      width: 100,
      render: (record: OrderData) => (
        <div className="flex flex-col space-y-0.5 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Miyapur:</span>
            <span>{record.distancefromMiyapur || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span>MythriNagar:</span>
            <span>{record.distancefromMythriNager || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span>Selected:</span>
            <span className="text-green-500">
              {record.choosedLocations || "N/A"}
            </span>
          </div>
        </div>
      ),
      sorter: (a: OrderData, b: OrderData) => {
        const getNumericDistance = (distance: string) => {
          if (!distance) return 0;
          const numVal = parseFloat(distance.replace(/[^\d.]/g, ""));
          return isNaN(numVal) ? 0 : numVal;
        };

        const distA = getNumericDistance(a.distancefromMiyapur);
        const distB = getNumericDistance(b.distancefromMiyapur);
        return distA - distB;
      },
    },
  ];

  const handleCancelCLick = () => {
    setdbModalVisible(false);
    setSelectedDeliveryBoy(null);
  };

  const handleDateChange = (date: any, dateString: string | string[]) => {
    if (Array.isArray(dateString)) {
      setSelectedDate(dateString[0] || null);
    } else {
      setSelectedDate(dateString);
    }
  };

  return (
    <div className="pt-4">
      <Row gutter={[16, 16]}>
        {/* Total Orders and Pie Chart Section */}
        <Col xs={24} md={24} lg={24} className="flex flex-col md:flex-row">
          {/* Total Orders Card */}
          <div className="w-full md:w-2/5 md:pr-4 mb-4 md:mb-0">
            <Card
              bodyStyle={{
                background: "linear-gradient(135deg, #67297c 0%, #0d9488 100%)",
                borderLeft: "3px solid #6366f1",
                color: "white",
              }}
              className="h-full"
            >
              <div className="flex justify-between items-center">
                <div>
                  <Text
                    strong
                    className="text-lg tracking-wide"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    Total Orders(Pending)
                  </Text>
                  <div
                    className="text-3xl font-bold"
                    style={{ color: "white" }}
                  >
                    {summaryData.reduce((sum, item) => sum + item.count, 0)}
                  </div>
                </div>
                <FileTextOutlined className="text-3xl text-white opacity-50" />
              </div>
            </Card>
          </div>
          <div className="w-full md:w-3/5">
            <Card title="Order Status Distribution">
              {loading ? (
                <div className="flex justify-center items-center h-52">
                  <Spin size="large" />
                  {/* <Spin
                    indicator={<SyncOutlined style={{ fontSize: 24 }} spin />}
                  /> */}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={summaryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {summaryData.map((entry, index) => {
                        const statusConfig =
                          STATUS_COLORS[
                            entry.status as keyof typeof STATUS_COLORS
                          ];
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={statusConfig.borderColor}
                          />
                        );
                      })}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>
        </Col>

        <Col
          xs={24}
          md={24}
          lg={24}
          className="flex flex-col md:flex-row gap-4"
        >
          {summaryData.map((item) => {
            const statusConfig =
              STATUS_COLORS[item.status as keyof typeof STATUS_COLORS];
            return (
              <div
                key={item.status}
                className="w-full md:w-1/3 mb-4 md:mb-0 cursor-pointer"
                role="button"
                onClick={() => handleStatusFilter(item.status)}
              >
                <Card
                  bodyStyle={{
                    background: statusConfig.background,
                    borderLeft: `3px solid ${statusConfig.borderColor}`,
                    color: "white",
                  }}
                  className="h-full hover:brightness-110 transition duration-200"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <Text
                        strong
                        className="text-md tracking-wide"
                        style={{ color: "black" }}
                      >
                        {statusConfig.label}
                      </Text>
                      <div
                        className="text-2xl font-bold"
                        style={{ color: "white" }}
                      >
                        {item.count}
                      </div>
                    </div>
                    {statusConfig.icon}
                  </div>
                </Card>
              </div>
            );
          })}
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Card
            extra={
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-2xl font-bold text-purple-600 mb-2 sm:mb-0 sm:absolute sm:top-2 sm:left-2">
                  Order Details
                </h1>
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search by Order ID"
                  allowClear
                  value={searchValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchValue(value);
                    if (value) {
                      const filtered = orderDetails.filter((order) =>
                        order.uniqueId
                          .toLowerCase()
                          .includes(value.toLowerCase())
                      );
                      setFilteredOrders(filtered);
                    } else {
                      if (selectedStatus) {
                        const filtered = orderDetails.filter(
                          (order) => order.orderStatus === selectedStatus
                        );
                        setFilteredOrders(filtered);
                      } else {
                        setFilteredOrders(orderDetails);
                      }
                    }
                  }}
                  className="w-full sm:max-w-[250px]"
                />
              </div>
            }
            bodyStyle={{ padding: 0 }}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 p-2 w-full">
              <DatePicker
                format="DD-MM-YYYY"
                onChange={handleDateChange}
                placeholder="Select Expected delivery date"
                allowClear
                className="w-full sm:w-[320px]"
              />
              <Button
                style={{
                  backgroundColor: "rgb(0, 140, 186)",
                  borderColor: "rgb(0, 140, 186)",
                }}
                type="primary"
                onClick={handleFilterByDate}
                className="w-full sm:w-auto"
              >
                Get Data
              </Button>

              <div className="flex justify-end w-full p-2">
                <Button
                  onClick={() => {
                    setFilteredOrders(orderDetails);
                    setSelectedDate(null);
                  }}
                  className="bg-blue-400 sm:w-auto"
                >
                  Get All Orders
                </Button>
              </div>
            </div>

            <Table
              columns={columns}
              className="p-4"
              dataSource={filteredOrders}
              rowKey="orderId"
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                responsive: true,
                showSizeChanger: false,
                onChange: (page, pageSize) =>
                  setPagination({ current: page, pageSize }),
              }}
              loading={loading}
              onChange={handleTableChange}
              scroll={{ x: "max-content" }}
              size={isMobile ? "small" : "middle"}
            />
          </Card>
        </Col>
      </Row>
      {isModalVisible && <RejectionReasonModal visible={isModalVisible} />}
      <Modal
        title="Select Delivery Boy"
        open={dbModalVisible}
        onCancel={() => setdbModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              handleCancelCLick();
            }}
          >
            Cancel
          </Button>,
          <Button
            key="assign"
            type="primary"
            loading={dbLoading}
            onClick={() =>
              handleAssign(
                selectedRecord?.orderId ?? "",
                selectedRecord?.orderStatus ?? ""
              )
            }
          >
            Assign
          </Button>,
        ]}
      >
        {dbLoading1 ? ( // Show loader when data is fetching
          <div className="flex justify-center items-center h-32">
            <Spin size="large" />
          </div>
        ) : deliveryBoys.length > 0 ? (
          <Radio.Group
            onChange={(e) => {
              const selectedBoy = deliveryBoys.find(
                (boy) => boy.userId === e.target.value
              );
              setSelectedDeliveryBoy(selectedBoy); // Store the entire object
            }}
            value={selectedDeliveryBoy?.userId}
          >
            <Space direction="vertical">
              {deliveryBoys
                .filter((boy: DeliveryBoy) => boy.isActive === "true")
                .map((boy: DeliveryBoy) => (
                  <Radio
                    key={boy.userId}
                    value={boy.userId}
                    className="block mb-2"
                  >
                    {`${boy.firstName} ${boy.lastName} (${boy.whatsappNumber})`}
                  </Radio>
                ))}
            </Space>
          </Radio.Group>
        ) : (
          <Empty description="No delivery boys available" />
        )}
      </Modal>
    </div>
  );
};

export default MainPage;
