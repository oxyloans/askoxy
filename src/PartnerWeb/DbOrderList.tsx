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
} from "@ant-design/icons";
import type { TabsProps } from "antd";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Config";

const { Title, Text } = Typography;

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

type Order = AssignedOrder | PickedUpOrder;

const DeliveryBoyOrders: React.FC = () => {
  const navigate = useNavigate();
  const [assignedOrders, setAssignedOrders] = useState<AssignedOrder[]>([]);
  const [pickedUpOrders, setPickedUpOrders] = useState<PickedUpOrder[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<AssignedOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("assigned");
  const [deliveryBoyName, setDeliveryBoyName] = useState<string>("Loading...");
  const [deliveryBoyId, setdeliveryBoyId] = useState<string>("");

  // const deliveryBoyId = localStorage.getItem("dbId") || "";

  const fetchOrders = async (deliveryBoyId: string) => {
    setdeliveryBoyId(deliveryBoyId);
    console.log(deliveryBoyId);
    setLoading(true);

    let assignedData: any[] = [];
    let deliveredData: any[] = [];
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
        const deliveredResponse = await axios.post(
          `${BASE_URL}/order-service/getAssignedOrdersToDeliveryBoy`,
          { deliveryBoyId, orderStatus: 4 }
        );
        deliveredData = deliveredResponse.data || [];
      } catch (err: any) {
        if (err.response?.status === 404) {
          message.success("No delivered orders found.");
        } else {
          message.warning("Failed to fetch assigned orders.");
        }
      }

      // Picked Up Orders
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
      setDeliveredOrders(deliveredData);
      setPickedUpOrders(pickedUpData);

      // Set delivery boy name from any available order
      const name =
        assignedData[0]?.deliveryBoyName ||
        deliveredData[0]?.deliveryBoyName ||
        localStorage.getItem("dbName") ||
        "Delivery Partner";

      setDeliveryBoyName(name);
    } catch (err) {
      message.error("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderDetails = (order: Order) => {
    // notification.info({
    //   message: "Order Details",
    //   description: `Viewing details for order ${
    //     "uniqueId" in order ? order.uniqueId : order.orderId.slice(-4)
    //   }`,
    // });

    localStorage.setItem("orderId", order.orderId);
    navigate(`/home/orderDetails`);
  };

  useEffect(() => {
    const deliveryBoyId = localStorage.getItem("dbId");

    if (deliveryBoyId) {
      fetchOrders(deliveryBoyId);
    }
  }, []);

  // Function to determine if order is from PickedUp response
  const isPickedUpOrder = (order: Order): order is PickedUpOrder => {
    return "totalAmount" in order && order.orderStatus === "PickedUp";
  };

  const renderOrderTable = (orders: Order[], type: string) => {
    if (orders.length === 0) {
      return <Empty description="No orders found" />;
    }

    // Sort orders by orderDate (latest first)
    const sortedOrders = [...orders].sort(
      (a, b) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );

    const columns = [
      {
        title: (
          <span className="font-bold text-black text-[1.05em]">Order ID</span>
        ),
        dataIndex: "orderId",
        key: "orderId",
        width: 120,
        render: (_: any, order: Order) => (
          <div className="flex flex-col">
            <Typography.Text
              strong
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => handleOrderDetails(order)}
            >
              #{"uniqueId" in order ? order.uniqueId : order.orderId.slice(-4)}
            </Typography.Text>
            <Tag color="blue" className="mt-1 w-fit">
              {type === "assigned"
                ? "placed"
                : type === "picked"
                ? "Picked Up"
                : "Delivered"}
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
        render: (_: any, order: Order) => (
          <div className="space-y-1">
            {order.orderItems && order.orderItems.length > 0 ? (
              <>
                {order.orderItems.slice(0, 2).map((item, index) => (
                  <Typography.Text
                    key={index}
                    className="block text-gray-800"
                    ellipsis={{
                      tooltip:
                        item.itemName || item.itemBarCode || "Unnamed Item",
                    }}
                  >
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
          </div>
        ),
      },
      {
        title: (
          <span className="font-bold text-black text-[1.05em]">Amount</span>
        ),
        key: "amount",
        width: 120,
        render: (_: any, order: Order) => (
          <Typography.Text strong className="text-green-600 whitespace-nowrap">
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
        ),
      },
      {
        title: <span className="font-bold text-black text-[1.05em]">Date</span>,
        dataIndex: "orderDate",
        key: "orderDate",
        width: 120,
        render: (date: string) => (
          <Typography.Text className="text-gray-800 whitespace-nowrap">
            {new Date(date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}
          </Typography.Text>
        ),
      },
      {
        title: (
          <span className="font-bold text-black text-[1.05em]">Address</span>
        ),
        key: "address",
        width: 250,
        render: (_: any, order: Order) =>
          order.orderAddress ? (
            <div
              className="max-h-[60px] overflow-y-auto"
              style={{
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE and Edge
              }}
            >
              <style>
                {`
                  div::-webkit-scrollbar {
                    display: none; // Chrome, Safari, and Opera
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
        width: 120,
        render: (_: any, order: Order) => (
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
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
        }}
        className="w-full shadow-sm rounded-lg"
        rowClassName="hover:bg-gray-50"
        bordered
        scroll={{ x: 1000 }}
      />
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
      children: renderOrderTable(deliveredOrders, "delivered"),
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
                {/* <Tag color="green">Online</Tag> */}
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
