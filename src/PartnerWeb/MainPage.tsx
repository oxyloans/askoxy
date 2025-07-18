import React, { useEffect, useState, useRef } from "react";
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
  CalendarOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Truck, ShoppingBag, ShoppingCart, Store, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import dayjs, { Dayjs } from "dayjs";
import {
  Order,
  ExchangeOrder,
  DeliveryBoy,
  fetchOrdersByStatus,
  fetchDeliveredOrders,
  fetchExchangeOrders,
  fetchDeliveryBoys,
  rejectOrder,
  assignOrderToDeliveryBoy,
} from "./partnerapi";

import ExchangeOrdersTable from "./ExchangeOrders";

type SummaryData = {
  name: string;
  count: number;
  status: string;
  amount: number;
};

const { Text } = Typography;
const { TextArea } = Input;

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [summaryData, setSummaryData] = useState<SummaryData[]>([]);
  const [orderDetails, setOrderDetails] = useState<Order[]>([]);
  const [exchangeOrders, setExchangeOrders] = useState<ExchangeOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [exchangeLoading, setExchangeLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 50 });
  const [searchValue, setSearchValue] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [rejectForm] = Form.useForm();
  const [selectedRecord, setSelectedRecord] = useState<Order | null>(null);
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [dbModalVisible, setDbModalVisible] = useState(false);
  const [isMobile] = useState<boolean>(window.innerWidth < 768);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] =
    useState<DeliveryBoy | null>(null);
  const [dbLoading, setDbLoading] = useState<boolean>(false);
  const [dbLoading1, setDbLoading1] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [filterDate, setfilterDate] = useState<Dayjs | null>(null);
  const tableRef = useRef<HTMLDivElement>(null); // Reference to the table container

  const handleDateChange = (date: Dayjs) => {
    setfilterDate(date);
  };
  const handleFilterByDate = () => {
    if (!filterDate) {
      message.warning("Please select a date first.");
      return;
    }

    const filtered = orderDetails.filter((order) =>
      dayjs(order.expectedDeliveryDate, "DD-MM-YYYY").isSame(filterDate, "day")
    );

    setFilteredOrders(filtered);
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const STATUS_COLORS = {
    "1": {
      gradient: "from-sky-300 to-sky-400",
      background: "linear-gradient(135deg, #7dd3fc 0%, #38bdf8 100%)",
      borderColor: "#38bdf8",
      icon: <ShoppingBag className="text-xl" style={{ color: "#38bdf8" }} />,
      label: "New Placed Orders",
    },
    "3": {
      gradient: "from-rose-200 to-rose-300",
      background: "linear-gradient(135deg, #fecdd3 0%, #fda4b8 100%)",
      borderColor: "#fda4b8",
      icon: <Truck className="text-xl" style={{ color: "#fda4b8" }} />,
      label: "Assigned Orders",
    },
    PickedUp: {
      gradient: "from-indigo-300 to-indigo-400",
      background: "linear-gradient(135deg, #a5b4fc 0%, #818cf8 100%)",
      borderColor: "#6366f1",
      icon: <Store className="text-xl" style={{ color: "#6366f1" }} />,
      label: "PickedUp Orders",
    },
    "4": {
      gradient: "from-green-300 to-green-400",
      background: "linear-gradient(135deg, #86efac 0%, #34d399 100%)",
      borderColor: "#34d399",
      icon: <ShoppingCart className="text-xl" style={{ color: "#34d399" }} />,
      label: "Delivered Orders",
    },
    Exchange: {
      gradient: "from-yellow-300 to-yellow-400",
      background: "linear-gradient(135deg, #fef08a 0%, #facc15 100%)",
      borderColor: "#eab308",
      icon: <Package className="text-xl" style={{ color: "#eab308" }} />,
      label: "Exchange Orders",
    },
  };

  const fetchData = async () => {
    setLoading(true);
    setExchangeLoading(true);
    try {
      const newOrders = await fetchOrdersByStatus("1");
      const assignedOrders = await fetchOrdersByStatus("3");
      const pickedUpOrders = await fetchOrdersByStatus("PickedUp");
      const today = dayjs();
      const startDate1 = today;
      const endDate1 = today;
      const deliveredOrders = await fetchDeliveredOrders(
        startDate1.format("YYYY-MM-DD"),
        endDate1.format("YYYY-MM-DD")
      );
      const exchangeOrdersData = await fetchExchangeOrders();

      const summaryData = [
        {
          name: "New Orders",
          count: newOrders.length,
          status: "1",
          amount: calculateOrdersTotal(newOrders),
        },
        {
          name: "Assigned Orders",
          count: assignedOrders.length,
          status: "3",
          amount: calculateOrdersTotal(assignedOrders),
        },
        {
          name: "PickedUp Orders",
          count: pickedUpOrders.length,
          status: "PickedUp",
          amount: calculateOrdersTotal(pickedUpOrders),
        },
        {
          name: "Exchange Orders",
          count: exchangeOrdersData.filter(
            (order) => order.status === "EXCHANGEREQUESTED"
          ).length,
          status: "Exchange",
          amount: 0, // Exchange orders might not have amounts or calculate differently
        },
        {
          name: "Delivered Orders",
          count: deliveredOrders.length,
          status: "4",
          amount: calculateOrdersTotal(deliveredOrders),
        },
      ];

      setSummaryData(summaryData);
      setOrderDetails([
        ...newOrders,
        ...assignedOrders,
        ...pickedUpOrders,
        ...deliveredOrders,
      ]);
      setFilteredOrders([
        ...newOrders,
        ...assignedOrders,
        ...pickedUpOrders,
        ...deliveredOrders,
      ]);
      setExchangeOrders(exchangeOrdersData);
    } catch (error: any) {
      message.error(error.message || "Failed to fetch orders.");
    } finally {
      setLoading(false);
      setExchangeLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
    handleLogin();
  }, []);

  // Restore scroll position after orders are loaded
  useEffect(() => {
    if (!loading && filteredOrders.length > 0) {
      const savedOrderId = localStorage.getItem("partner_orderId");
      if (savedOrderId) {
        const targetRow = document.querySelector(
          `[data-row-key="${savedOrderId}"]`
        );
        if (targetRow) {
          targetRow.scrollIntoView({ behavior: "smooth", block: "center" });
          localStorage.removeItem("partner_orderId");
        } else {
          // Check if the order exists in the full orderDetails (for pagination)
          const orderIndex = orderDetails.findIndex(
            (order) => order.orderId === savedOrderId
          );
          if (orderIndex !== -1) {
            // Calculate the page number (1-based indexing for Ant Design Table)
            const targetPage = Math.ceil(
              (orderIndex + 1) / pagination.pageSize
            );
            setPagination((prev) => ({ ...prev, current: targetPage }));
            // Wait for the table to update to the correct page
            setTimeout(() => {
              const updatedRow = document.querySelector(
                `[data-row-key="${savedOrderId}"]`
              );
              if (updatedRow) {
                updatedRow.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
              localStorage.removeItem("partner_orderId");
            }, 0);
          } else {
            message.info(
              "The previously viewed order is not visible in the current view."
            );
            localStorage.removeItem("partner_orderId");
          }
        }
      }
    }
  }, [loading, filteredOrders, orderDetails, pagination.pageSize]);

  const handleLogin = () => {
    const accessToken = localStorage.getItem("partner_Token");
    if (!accessToken) {
      navigate("/partnerLogin");
    }
  };

  const handleStatusFilter = (value: string | null) => {
    setSelectedStatus(value);
    if (value === null) {
      setFilteredOrders(orderDetails);
    } else if (value === "4" && startDate && endDate) {
      fetchDeliveredOrdersWithDates();
    } else if (value === "Exchange") {
      // Exchange orders are handled by ExchangeOrdersTable
    } else {
      const filtered = orderDetails.filter(
        (order) => order.orderStatus === value
      );
      setFilteredOrders(filtered);
    }
  };

  const calculateOrderTotal = (order: Order): number => {
    if (!order.orderItems || order.orderItems.length === 0) return 0;

    return order.orderItems.reduce((total, item) => {
      const price = parseFloat(item.price?.toString() || "0");
      const quantity = parseInt(item.quantity?.toString() || "1");
      return total + price * quantity;
    }, 0);
  };

  const calculateOrdersTotal = (orders: Order[]): number => {
    return orders.reduce(
      (total, order) => total + calculateOrderTotal(order),
      0
    );
  };

  const fetchDeliveredOrdersWithDates = async () => {
    if (!startDate || !endDate) {
      message.warning("Please select both start and end dates.");
      return;
    }
    setLoading(true);
    try {
      const deliveredOrders = await fetchDeliveredOrders(
        startDate.format("YYYY-MM-DD"),
        endDate.format("YYYY-MM-DD")
      );
      setFilteredOrders(deliveredOrders);
      setOrderDetails((prev) =>
        prev
          .filter((order) => order.orderStatus !== "4")
          .concat(deliveredOrders)
      );
      setSummaryData((prev) =>
        prev.map((item) =>
          item.status === "4"
            ? {
                ...item,
                count: deliveredOrders.length,
                amount: calculateOrdersTotal(deliveredOrders),
              }
            : item
        )
      );
    } catch (error: any) {
      message.error(error.message || "Failed to fetch delivered orders.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "1":
        return "processing";
      case "4":
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
        return "Placed";
      case "4":
        return "Delivered";
      case "3":
        return "Assigned";
      case "PickedUp":
        return "Picked Up";
      default:
        return "Unknown";
    }
  };

  const handleViewDetails = (order: Order) => {
    localStorage.setItem("partner_orderId", order.orderId);
    navigate(`/home/orderDetails`);
  };

  const showRejectConfirmation = (record: Order) => {
    Modal.confirm({
      title: "Are you sure you want to reject this order?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes, Reject",
      okButtonProps: { danger: true },
      cancelText: "No, Cancel",
      onOk() {
        setSelectedRecord(record);
        setIsModalVisible(true);
      },
    });
  };

  const handleFinalReject = async () => {
    try {
      await rejectForm.validateFields();
      const rejectReason = rejectForm.getFieldValue("rejectReason");
      setConfirmLoading(true);
      await rejectOrder(selectedRecord?.orderId || "", rejectReason);
      message.success("Order rejected successfully");
      setIsModalVisible(false);
      fetchData();
    } catch (error: any) {
      message.error(error.message || "Failed to reject order.");
    } finally {
      setConfirmLoading(false);
      setIsModalVisible(false);
      rejectForm.resetFields();
    }
  };

  const fetchDeliveryBoysList = async (record: Order) => {
    setSelectedRecord(record);
    setDbLoading1(true);
    try {
      const data = await fetchDeliveryBoys();
      setDeliveryBoys(data);
      setDbModalVisible(true);
    } catch (error: any) {
      message.error(error.message || "Failed to fetch delivery boys.");
    } finally {
      setDbLoading1(false);
    }
  };

  const handleAssign = async (orderId: string, orderStatus: string) => {
    if (!selectedDeliveryBoy) {
      message.warning("Please select a delivery boy.");
      return;
    }
    setDbLoading(true);
    try {
      await assignOrderToDeliveryBoy(
        orderId,
        selectedDeliveryBoy.userId,
        orderStatus
      );
      message.success("Order assigned successfully!");
      setDbModalVisible(false);
      fetchData();
    } catch (error: any) {
      message.error(error.message || "Failed to assign order.");
    } finally {
      setDbLoading(false);
      setDbModalVisible(false);
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
            { min: 6, message: "Reason must be at least 6 characters long" },
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

  const getActionButtons = (status: string, record: Order) => {
    const buttonClasses =
      "relative overflow-hidden transition-all duration-300 ease-in-out w-10 md:w-auto px-2 flex justify-center items-center";

    switch (status) {
      case "1":
        return (
          <div className="flex flex-col md:flex-row gap-2">
            <div className="group relative">
              <Button
                type="primary"
                className={`bg-blue-500 hover:bg-blue-600 ${buttonClasses}`}
                onClick={() => fetchDeliveryBoysList(record)}
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
                onClick={() => fetchDeliveryBoysList(record)}
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

  const columns: ColumnsType<Order> = [
    {
      title: "Order ID",
      dataIndex: "uniqueId",
      key: "uniqueId",
      width: 100,
      sorter: (a, b) => a.uniqueId.localeCompare(b.uniqueId),
      render: (text: string, record: Order) => (
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
          {record.userType && (
            <Tag color="purple" className="w-fit text-xs">
              {record.userType}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Order Address",
      key: "orderAddress",
      width: 250,
      sorter: (a, b) =>
        String(a.orderAddress?.pincode || "").localeCompare(
          String(b.orderAddress?.pincode || "")
        ),
      render: (_: any, record: Order) => {
        const address = record.orderAddress;
        return address ? (
          <div className="w-[240px] h-[120px] overflow-y-auto overflow-x-hidden scrollbar-hide text-sm flex flex-col gap-2">
            <div>
              {[
                address.flatNo,
                address.address,
                address.landMark,
                address.pincode,
              ]
                .filter(Boolean)
                .join(", ")}
            </div>
            {address.googleMapLink && (
              <a
                href={address.googleMapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Location
              </a>
            )}
          </div>
        ) : (
          <div className="text-gray-500">N/A</div>
        );
      },
    },
    {
      title: "Date & Items",
      key: "datetime",
      width: 90,
      sorter: (a, b) =>
        new Date(a.orderDate || "").getTime() -
        new Date(b.orderDate || "").getTime(),
      render: (record: Order) => (
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
            {record.expectedDeliveryDate && (
              <div>
                <strong>Expected date:</strong>{" "}
                {record.expectedDeliveryDate
                  ? dayjs(record.expectedDeliveryDate, "DD-MM-YYYY").format(
                      "MMM DD, YYYY"
                    )
                  : "Not provided"}
              </div>
            )}
            {record.deliveryDate && (
              <div>
                <strong>Delivered date:</strong>{" "}
                {dayjs(record.deliveryDate).format("MMM DD, YYYY")}
              </div>
            )}
          </Typography.Text>
          <div className="bg-blue-50 p-2 rounded-md max-h-[100px] overflow-y-auto scrollbar-hide w-[220px]">
            {record.orderItems && record.orderItems.length > 0 ? (
              <div className="space-y-2">
                {record.orderItems.map((item, index) => (
                  <div key={index} className="flex flex-col">
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
                      {item.weight && (
                        <span>
                          Weight: {item.weight} {item.itemUnit}
                        </span>
                      )}
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
      render: (text: string, record: Order) => {
        return (
          <div className="flex flex-col items-center gap-2">
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
                    <span className="hidden group-hover:block">
                      ViewDetails
                    </span>
                  </div>
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              {record.deliveryBoyName && (
                <div className="flex justify-between w-full gap-1 text-sm">
                  <strong>asgn : </strong> <span>{record.deliveryBoyName}</span>
                </div>
              )}
              {record.deliveryBoyMobile && (
                <div className="flex justify-between w-full text-sm">
                  <strong>mbl:</strong>
                  <span>{record.deliveryBoyMobile}</span>
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Distance",
      key: "distance",
      width: 100,
      render: (record: Order) => (
        <div className="flex flex-col space-y-0.5 text-sm text-gray-600">
          {record.deliveryFee && (
            <div className="flex justify-between">
              <strong>₹{Number(record.deliveryFee)} rupees</strong>
              <span>: deliveryFee</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Miyapur:</span>
            <span>{record.distancefromMiyapur}</span>
          </div>
          <div className="flex justify-between">
            <span>MythriNagar:</span>
            <span>{record.distancefromMythriNager}</span>
          </div>
          <div className="flex justify-between">
            <span>Selected:</span>
            <span className="text-green-500">{record.choosedLocations}</span>
          </div>
        </div>
      ),
      sorter: (a: Order, b: Order) => 0,
    },
  ];

  const handleCancelClick = () => {
    setDbModalVisible(false);
    setSelectedDeliveryBoy(null);
  };
  const todayOrdersCount = orderDetails.filter((item) =>
    dayjs(item.orderDate, ["DD-MM-YYYY", "YYYY-MM-DD"]).isSame(dayjs(), "day")
  );

  const scrollToTable = () => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="pt-2">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={24} lg={24} className="flex flex-col md:flex-row">
          <div className="w-full md:w-2/5 md:pr-4 mb-4 md:mb-0 flex flex-col gap-4">
            <div className="w-full">
              <Card
                bodyStyle={{
                  background: "white",
                  border: "1px solid #8b5cf640",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(139, 92, 246, 0.15)",
                }}
                className="h-full transform hover:scale-105 transition-all duration-300 cursor-pointer rounded-xl"
                onClick={() => {
                  setFilteredOrders(orderDetails);
                  setSelectedStatus(null);
                  setStartDate(null);
                  setEndDate(null);
                  scrollToTable();
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <Text
                      strong
                      className="text-lg tracking-wide"
                      style={{ color: "#6b7280" }}
                    >
                      Total Orders
                    </Text>
                    <div
                      className="text-3xl font-bold mt-2"
                      style={{ color: "#8b5cf6cc" }}
                    >
                      {summaryData.reduce((sum, item) => sum + item.count, 0)}
                    </div>
                    <div className="text-lg font-semibold mt-1 flex flex-wrap items-center">
                      <span>Amount :</span>
                      <span className="ml-1" style={{ color: "#059669" }}>
                        ₹
                        {summaryData
                          .reduce((sum, item) => sum + item.amount, 0)
                          .toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <ShoppingCartOutlined
                    className="text-4xl opacity-50 hover:opacity-80 transition-opacity duration-300"
                    style={{ color: "#8b5cf699" }}
                  />
                </div>
              </Card>
            </div>

            <div className="w-full">
              <Card
                bodyStyle={{
                  background: "white",
                  border: "1px solid #0ea5e940",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(14, 165, 233, 0.15)",
                }}
                className="h-full transform hover:scale-105 transition-all duration-300 cursor-pointer rounded-xl"
                onClick={() => {
                  setFilteredOrders(todayOrdersCount);
                  scrollToTable();
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <Text
                      strong
                      className="text-lg tracking-wide"
                      style={{ color: "#6b7280" }}
                    >
                      Today Orders
                    </Text>
                    <div
                      className="text-3xl font-bold mt-2"
                      style={{ color: "#0ea5e9cc" }}
                    >
                      {todayOrdersCount.length}
                    </div>
                    <div className="text-lg font-semibold mt-1 flex flex-wrap items-center">
                      <span>Amount :</span>
                      <span className="ml-1" style={{ color: "#059669" }}>
                        ₹
                        {calculateOrdersTotal(
                          todayOrdersCount
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <CalendarOutlined
                    className="text-4xl opacity-50 hover:opacity-80 transition-opacity duration-300"
                    style={{ color: "#0ea5e999" }}
                  />
                </div>
              </Card>
            </div>
          </div>
          <div className="w-full md:w-3/5">
            <Card title="Order Status Distribution">
              {loading || exchangeLoading ? (
                <div className="flex justify-center items-center h-52">
                  <Spin size="large" />
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
                onClick={() => {
                  handleStatusFilter(item.status);
                  scrollToTable();
                }}
              >
                <Card
                  bodyStyle={{
                    background: "white",
                    border: `1px solid ${statusConfig.borderColor}40`,
                    borderRadius: "12px",
                    boxShadow: `0 2px 8px ${statusConfig.borderColor}15`,
                  }}
                  className="h-full transform hover:scale-105 transition-all duration-300 rounded-xl"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <Text
                        strong
                        className="text-md tracking-wide"
                        style={{ color: "#6b7280" }}
                      >
                        {statusConfig.label}
                      </Text>
                      <div
                        className="text-2xl font-bold mt-1"
                        style={{ color: `${statusConfig.borderColor}cc` }}
                      >
                        {item.count}
                      </div>
                      <div className="text-lg font-semibold mt-1 flex flex-wrap items-center">
                        <span>Amount :</span>
                        <span className="ml-1" style={{ color: "#059669" }}>
                          ₹{Math.floor(item.amount).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="opacity-70 hover:opacity-100 transition-opacity duration-300 w-6 h-6">
                      {statusConfig.icon}
                    </div>
                  </div>  
                </Card>
              </div>
            );
          })}
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          {selectedStatus === "Exchange" ? (
            <ExchangeOrdersTable />
          ) : (
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
                {selectedStatus === "4" && (
                  <>
                    <DatePicker
                      format="YYYY-MM-DD"
                      onChange={(date) => setStartDate(date)}
                      placeholder="Select Start Date"
                      className="w-full sm:w-[200px]"
                    />
                    <DatePicker
                      format="YYYY-MM-DD"
                      onChange={(date) => setEndDate(date)}
                      placeholder="Select End Date"
                      className="w-full sm:w-[200px]"
                    />
                    <Button
                      style={{
                        backgroundColor: "rgb(0, 140, 186)",
                        borderColor: "rgb(0, 140, 186)",
                      }}
                      type="primary"
                      onClick={fetchDeliveredOrdersWithDates}
                      className="w-full sm:w-auto"
                    >
                      Get Data
                    </Button>
                  </>
                )}
                {selectedStatus !== "4" && selectedStatus !== "Exchange" && (
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 p-2 w-full">
                    <DatePicker
                      format="DD-MM-YYYY"
                      onChange={handleDateChange}
                      placeholder="Expected delivery date"
                      allowClear
                      className="!w-40 !text-sm !py-1"
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
                  </div>
                )}
              </div>
              <div ref={tableRef}>
                <Table
                  columns={columns}
                  className="p-2"
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
              </div>
            </Card>
          )}
        </Col>
      </Row>
      {isModalVisible && <RejectionReasonModal visible={isModalVisible} />}
      <Modal
        title="Select Delivery Boy"
        open={dbModalVisible}
        onCancel={handleCancelClick}
        footer={[
          <Button key="cancel" onClick={handleCancelClick}>
            Cancel
          </Button>,
          <Button
            key="assign"
            type="primary"
            loading={dbLoading}
            onClick={() =>
              handleAssign(
                selectedRecord?.orderId || "",
                selectedRecord?.orderStatus || ""
              )
            }
          >
            Assign
          </Button>,
        ]}
      >
        {dbLoading1 ? (
          <div className="flex justify-center items-center h-32">
            <Spin size="large" />
          </div>
        ) : deliveryBoys.length > 0 ? (
          <Radio.Group
            onChange={(e) => {
              const selectedBoy = deliveryBoys.find(
                (boy) => boy.userId === e.target.value
              );
              setSelectedDeliveryBoy(selectedBoy || null);
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
