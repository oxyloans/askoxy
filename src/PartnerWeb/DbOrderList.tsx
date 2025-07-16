import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Tabs,
  Spin,
  Empty,
  Badge,
  Card,
  Table,
  Tag,
  List,
  Typography,
  Button,
  notification,
  Avatar,
  Row,
  Col,
  Divider,
  message,
  DatePicker,
  Space,
  Input,
} from "antd";
import {
  LoadingOutlined,
  CheckCircleOutlined,
  CarOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ShoppingOutlined,
  CalendarOutlined,
  DollarOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { TabsProps } from "antd";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Config";
import { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Interface for assigned and delivered orders
interface OrderAddress {
  flatNo: string;
  landMark: string;
  address: string;
  pincode: number;
}

interface OrderItem {
  itemId: string;
  itemName: string | null;
  itemBarCode: string | null;
  price: number | null;
}

interface AssignedOrder {
  orderId: string;
  uniqueId: string;
  orderStatus: string;
  grandTotal: number | null;
  subTotal: number | null;
  orderDate: string;
  deliveryBoyName: string | null;
  orderItems: OrderItem[];
  orderAddress?: OrderAddress;
}

interface PickedUpOrder {
  orderId: string;
  orderDate: string;
  orderStatus: string;
  totalAmount: number;
  deliveryBoyId: string;
  orderItems: OrderItem[];
  orderAddress?: OrderAddress;
}

// New interface for delivered orders from the new API
interface DeliveredOrderResponse {
  orderId: string;
  paymentType?: number;
  uniqueId: string;
  orderStatus: string;
  grandTotal: number | null;
  subTotal: number | null;
  orderDate: string;
  deliveryBoyName: string | null;
  orderItems: OrderItem[];
  orderAddress?: OrderAddress;
  deliveryTime?: string;
}

type Order = AssignedOrder | PickedUpOrder;

const DeliveryBoyOrders: React.FC = () => {
  const navigate = useNavigate();
  const [assignedOrders, setAssignedOrders] = useState<AssignedOrder[]>([]);
  const [pickedUpOrders, setPickedUpOrders] = useState<PickedUpOrder[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<
    DeliveredOrderResponse[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [deliveredLoading, setDeliveredLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("assigned");
  const [deliveryBoyName, setDeliveryBoyName] = useState<string>("Loading...");
  const [deliveryBoyId, setdeliveryBoyId] = useState<string>("");
  const [messages, setMessage] = useState<string | null>("");
  // Date picker states
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [orderIdSearch, setOrderIdSearch] = useState<string>("");
  const [filteredDeliveredOrders, setFilteredDeliveredOrders] = useState<
    typeof deliveredOrders
  >([]);

  const fetchOrders = async (deliveryBoyId: string) => {
    setdeliveryBoyId(deliveryBoyId);
    console.log(deliveryBoyId);
    setLoading(true);

    let assignedData: any[] = [];
    let pickedUpData: any[] = [];

    try {
      // Assigned Orders
      try {
        const assignedResponse = await axios.post(
          `${BASE_URL}/order-service/getAssignedOrdersToDeliveryBoy`,
          { deliveryBoyId, orderStatus: 3 }
        );
        assignedData = assignedResponse.data || [];
      } catch (err: any) {
        if (err.response?.status === 404) {
          message.success("No assigned orders found.");
        } else {
          message.warning("Failed to fetch assigned orders.");
        }
      }

      try {
        const pickedUpResponse = await axios.get(
          `${BASE_URL}/order-service/getPickupDataBasedOnIdList?deliveryBoyId=${deliveryBoyId}`
        );
        pickedUpData = pickedUpResponse.data || [];
      } catch (err) {
        message.success("Failed to fetch picked up orders.");
      }

      // Set state
      setAssignedOrders(assignedData);
      setPickedUpOrders(pickedUpData);

      // Set delivery boy name from any available order
      const name =
        assignedData[0]?.deliveryBoyName ||
        localStorage.getItem("partner_dbName") ||
        "Delivery Partner";

      setDeliveryBoyName(name);

      // Fetch delivered orders with today's date initially
      await fetchDeliveredOrders(
        deliveryBoyId,
        dayjs().format("YYYY-MM-DD"),
        dayjs().format("YYYY-MM-DD")
      );
    } catch (err) {
      message.error("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveredOrders = async (
    deliveryBoyId: string,
    startDate: string,
    endDate: string
  ) => {
    setDeliveredLoading(true);
    try {
      const deliveredResponse = await axios.get(
        `${BASE_URL}/order-service/get_DeliverdDetails_By_DeliveryBoyId?deliveryBoyId=${deliveryBoyId}&EndData=${endDate}&StartDate=${startDate}`
      );

      const deliveredData = deliveredResponse.data?.orderResponseList || [];
      setMessage(deliveredResponse.data?.message);
      // Enrich delivered data with delivery time
      const enrichedDeliveredData = await Promise.all(
        deliveredData.map(async (order: any) => {
          try {
            const res = await axios.get(
              `${BASE_URL}/order-service/getAllOrdersDelivered?orderId=${order.orderId}`
            );
            return {
              ...order,
              deliveryTime: res.data?.deliveryTime || "N/A",
            };
          } catch {
            return {
              ...order,
              deliveryTime: "N/A",
            };
          }
        })
      );

      // Sort by order date (newest first)
      const sortedDeliveredData = enrichedDeliveredData.sort(
        (a: any, b: any) => {
          const dateA = new Date(a.orderDate).getTime();
          const dateB = new Date(b.orderDate).getTime();
          return dateB - dateA;
        }
      );

      setDeliveredOrders(sortedDeliveredData);

      if (deliveredData.length === 0) {
        message.info("No delivered orders found for the selected date range.");
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        message.info("No delivered orders found for the selected date range.");
        setDeliveredOrders([]);
      } else {
        message.error("Failed to fetch delivered orders.");
      }
    } finally {
      setDeliveredLoading(false);
    }
  };

  const handleGetDeliveredData = () => {
    if (!startDate || !endDate) {
      message.error("Please select both start date and end date.");
      return;
    }

    if (startDate.isAfter(endDate)) {
      message.error("Start date cannot be after end date.");
      return;
    }

    const deliveryBoyId = localStorage.getItem("partner_dbId");
    if (deliveryBoyId) {
      fetchDeliveredOrders(
        deliveryBoyId,
        startDate.format("YYYY-MM-DD"),
        endDate.format("YYYY-MM-DD")
      );
    }
  };

  const handleOrderDetails = (order: Order | DeliveredOrderResponse) => {
    localStorage.setItem("partner_orderId", order.orderId);
    navigate(`/home/orderDetails`);
  };
  const handleSearchOrderId = (value: string) => {
    setOrderIdSearch(value);
    if (!value.trim()) {
      setFilteredDeliveredOrders(deliveredOrders);
      return;
    }

    const filtered = deliveredOrders.filter((order) =>
      order.orderId?.slice(-4).toString().includes(value)
    );
    setFilteredDeliveredOrders(filtered);
  };
  useEffect(() => {
    setFilteredDeliveredOrders(deliveredOrders);
  }, [deliveredOrders]);

  useEffect(() => {
    const deliveryBoyId = localStorage.getItem("partner_dbId");

    if (deliveryBoyId) {
      fetchOrders(deliveryBoyId);
    }
  }, []);

  // 👇 Move this outside your column definition, in the component file
  const formatDeliveryTime = (timeStr: string) => {
    if (!timeStr) return "N/A";

    const [days = 0, hours = 0, minutes = 0] = timeStr.split(":").map(Number);

    const parts: React.ReactNode[] = [];

    if (days > 0) {
      parts.push(
        <React.Fragment key="days">
          <span className="text-green-600 font-semibold">{days}</span> day
          {days > 1 ? "s" : ""}
        </React.Fragment>
      );
    }

    if (hours > 0) {
      parts.push(
        <React.Fragment key="hours">
          <span className="text-green-600 font-semibold">{hours}</span> hr
          {hours > 1 ? "s" : ""}
        </React.Fragment>
      );
    }

    if (minutes > 0) {
      parts.push(
        <React.Fragment key="minutes">
          <span className="text-green-600 font-semibold">{minutes}</span> min
          {minutes > 1 ? "s" : ""}
        </React.Fragment>
      );
    }

    if (parts.length === 0) {
      return (
        <>
          <span className="text-green-600 font-semibold">0</span> min
        </>
      );
    }

    return (
      <>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {index > 0 && " "}
            {part}
          </React.Fragment>
        ))}
      </>
    );
  };

  const isPickedUpOrder = (order: Order): order is PickedUpOrder => {
    return "totalAmount" in order && order.orderStatus === "PickedUp";
  };

  const renderOrderTable = (
    orders: Order[] | DeliveredOrderResponse[],
    type: string
  ) => {
    if (orders.length === 0) {
      return <Empty description="No orders found" />;
    }

    const sortedOrders = [...orders].sort(
      (a, b) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );

    const columns: ColumnsType<any> = [
      {
        title: (
          <span className="font-bold text-black text-[1.05em]">Order ID</span>
        ),
        dataIndex: "orderId",
        key: "orderId",
        width: 90,
        ellipsis: true,
        render: (_: any, order: any) => (
          <div className="flex flex-col">
            <Typography.Text
              strong
              className="text-blue-600 text-lg cursor-pointer hover:underline"
              onClick={() => handleOrderDetails(order)}
            >
              #{order.uniqueId || order.orderId.slice(-4)}
            </Typography.Text>
            <Tag color="blue" className="mt-1 w-fit rounded-full">
              {type === "assigned"
                ? "placed"
                : type === "picked"
                ? "Picked Up"
                : "Delivered"}
            </Tag>
            <Tag color="green" className="mt-1 w-fit rounded-full">
              {order?.paymentType === 1
                ? "COD"
                : order?.paymentType === 2
                ? "Online"
                : "COD"}
            </Tag>
          </div>
        ),
      },
      {
        title: (
          <span className="font-bold text-black text-[1.05em]">Items</span>
        ),
        key: "items",
        width: 200,
        render: (_: any, order: any) => (
          <div className="space-y-1">
            {order.orderItems && order.orderItems.length > 0 ? (
              <>
                {order.orderItems.map((item: any, index: number) => (
                  <Typography.Text key={index} className="block text-gray-800">
                    {item.itemName || item.itemBarCode || "Unnamed Item"}
                    {item.price && (
                      <span className="text-gray-500 ml-2">₹{item.price}</span>
                    )}
                  </Typography.Text>
                ))}
                {order.orderItems.length > 2 && (
                  <Typography.Text className="text-gray-500 text-sm">
                    +{order.orderItems.length - 2} more
                  </Typography.Text>
                )}
              </>
            ) : (
              <Typography.Text className="text-gray-400">
                No items
              </Typography.Text>
            )}
            <Typography.Text
              strong
              className="text-green-600 whitespace-nowrap"
            >
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
              }).format(
                isPickedUpOrder(order)
                  ? order.totalAmount || 0
                  : order.subTotal || order.grandTotal || 0
              )}
            </Typography.Text>
          </div>
        ),
      },
      {
        title: (
          <span className="font-bold text-black text-[1.05em]">
            Date & Time
          </span>
        ),
        dataIndex: "orderDate",
        key: "orderDate",
        width: 140,
        ellipsis: true,
        render: (_: string, record: any) => {
          return (
            <div className="text-gray-800">
              {/* Formatted Date */}
              <div className="text-gray-700">
                {new Date(record.orderDate).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>

              {/* Delivery Time (if applicable) */}
              {type === "delivered" && record.deliveryTime?.trim() && (
                <div className="text-sm text-gray-500 mt-1 leading-tight">
                  Delivered in
                  <div className="font-medium text-gray-700">
                    {formatDeliveryTime(record.deliveryTime)}
                  </div>
                </div>
              )}
            </div>
          );
        },
      },
      {
        title: (
          <span className="font-bold text-black text-[1.05em]">Address</span>
        ),
        key: "address",
        width: 250,
        render: (_: any, order: any) =>
          order.orderAddress ? (
            <div
              className="max-h-[60px] overflow-y-auto"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style>
                {`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}
              </style>
              <Typography.Text className="block text-gray-800">
                {order.orderAddress.flatNo
                  ? `${order.orderAddress.flatNo}, `
                  : ""}
                {order.orderAddress.address || ""}
              </Typography.Text>
              {order.orderAddress.landMark && (
                <Typography.Text className="block text-gray-800">
                  {order.orderAddress.landMark}
                </Typography.Text>
              )}
              {order.orderAddress.pincode && (
                <Typography.Text className="block text-gray-800">
                  {order.orderAddress.pincode}
                </Typography.Text>
              )}
            </div>
          ) : (
            <Typography.Text className="text-gray-400">N/A</Typography.Text>
          ),
      },
      {
        title: (
          <span className="font-bold text-black text-[1.05em]">Action</span>
        ),
        key: "action",
        width: 100,
        ellipsis: true,
        render: (_: any, order: any) => (
          <Button
            type="primary"
            size="small"
            className="bg-purple-500 hover:bg-purple-600"
            onClick={() => handleOrderDetails(order)}
          >
            View
          </Button>
        ),
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={sortedOrders}
        rowKey="orderId"
        pagination={{
          pageSize: 50,
          showSizeChanger: false,
        }}
        className="w-full shadow-sm rounded-lg"
        rowClassName="hover:bg-gray-50"
        bordered
        scroll={{ x: "max-content" }}
        loading={type === "delivered" ? deliveredLoading : false}
      />
    );
  };

  const renderDeliveredOrdersWithFilters = () => {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 gap-3">
            {/* Start Date */}
            <div className="flex flex-col">
              <Typography.Text className="text-sm text-gray-700">
                Start Date
              </Typography.Text>
              <DatePicker
                className="w-[150px] text-sm"
                value={startDate}
                onChange={(date) => setStartDate(date)}
                placeholder="Select Start Date"
                disabledDate={(current) => current && current > dayjs()}
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col">
              <Typography.Text className="text-sm text-gray-700">
                End Date
              </Typography.Text>
              <DatePicker
                className="w-[150px] text-sm"
                value={endDate}
                onChange={(date) => setEndDate(date)}
                placeholder="Select End Date"
              />
            </div>

            {/* Button */}
            <div className="sm:pt-[22px]">
              <Button
                type="primary"
                onClick={handleGetDeliveredData}
                loading={deliveredLoading}
                className="h-[32px] px-4 text-sm bg-[rgb(0,_140,_186)] w-full sm:w-auto"
              >
                Get Data
              </Button>
            </div>
          </div>

          {/* Search Input on top right */}
          <div className="sm:pt-[22px] w-[200px]">
            <Input
              className="h-[32px] text-sm"
              placeholder="Search by Order ID"
              value={orderIdSearch}
              onChange={(e) => handleSearchOrderId(e.target.value)}
              allowClear
            />
          </div>
        </div>

        {messages && (
          <div className="flex flex-wrap gap-4 mb-4">
            {/* COD Summary */}
            <div className="flex-1 min-w-[250px] p-3 bg-blue-50 border border-blue-200 rounded-lg shadow-sm text-sm text-gray-800">
              {messages
                .split("\n\n")[1]
                ?.split("\n")
                .map((line, idx) => (
                  <div key={idx} className="mb-1">
                    {line.split(/(₹[\d.]+|\b\d+\b)/g).map((part, i) =>
                      /₹[\d.]+|\b\d+\b/.test(part) ? (
                        <span
                          key={i}
                          className="text-lg font-bold text-blue-700"
                        >
                          {part}
                        </span>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </div>
                ))}
            </div>

            {/* Online Summary */}
            <div className="flex-1 min-w-[250px] p-3 bg-green-50 border border-green-200 rounded-lg shadow-sm text-sm text-gray-800">
              {messages
                .split("\n\n")[2]
                ?.split("\n")
                .map((line, idx) => (
                  <div key={idx} className="mb-1">
                    {line.split(/(₹[\d.]+|\b\d+\b)/g).map((part, i) =>
                      /₹[\d.]+|\b\d+\b/.test(part) ? (
                        <span
                          key={i}
                          className="text-lg font-bold text-green-700"
                        >
                          {part}
                        </span>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {renderOrderTable(filteredDeliveredOrders, "delivered")}
      </div>
    );
  };

  const items: TabsProps["items"] = [
    {
      key: "assigned",
      label: (
        <div className="flex items-center">
          <ShoppingCartOutlined className="mr-2" />
          Assigned {assignedOrders.length > 0 && `(${assignedOrders.length})`}
        </div>
      ),
      children: renderOrderTable(assignedOrders, "assigned"),
    },
    {
      key: "picked",
      label: (
        <div className="flex items-center">
          <CarOutlined className="mr-2" />
          Picked Up {pickedUpOrders.length > 0 && `(${pickedUpOrders.length})`}
        </div>
      ),
      children: renderOrderTable(pickedUpOrders, "picked"),
    },
    {
      key: "delivered",
      label: (
        <div className="flex items-center">
          <CheckCircleOutlined className="mr-2" />
          Delivered{" "}
          {deliveredOrders.length > 0 && `(${deliveredOrders.length})`}
        </div>
      ),
      children: renderDeliveredOrdersWithFilters(),
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Delivery Boy Profile Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <Avatar size={64} icon={<UserOutlined />} className="bg-blue-500" />
            <div className="ml-4">
              <Typography.Text type="secondary">PILOT NAME</Typography.Text>
              <Title level={3} className="m-0">
                {deliveryBoyName}
              </Title>
              <div className="mt-1">
                <Tag color="blue" className="text-s">
                  ID: {deliveryBoyId.slice(-4)}
                </Tag>
              </div>
            </div>
          </div>
        </div>
        <Title level={2} className="text-center mb-6">
          Orders Details
        </Title>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 bg-white rounded-lg shadow-md">
            <Spin size="large" />
            <Typography.Text className="mt-4 text-gray-500">
              Loading orders...
            </Typography.Text>
          </div>
        ) : (
          <Tabs
            items={items}
            activeKey={activeTab}
            onChange={setActiveTab}
            className="bg-white p-4 rounded-lg shadow-md w-full"
          />
        )}
      </div>
    </div>
  );
};

export default DeliveryBoyOrders;
