import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, message, Spin, Card, Button, Empty, Input } from "antd";
import {
  EyeOutlined,
  FileSearchOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Config";

interface Order {
  orderId: string;
  uniqueId: string;
  orderDate: string;
  subTotal: number;
  testUser: boolean;
  orderStatus: string;
  orderAddress?: Address;
}
interface Address {
  flatNo?: string;
  address?: string;
  landMark?: string;
  pincode?: string;
}

const NewOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Order[]>(
          `${BASE_URL}/order-service/getAllOrdersBasedOnStatus?orderStatus=1`
        );

        const filteredOrders = response.data.filter((order) => !order.testUser);

        setOrders(filteredOrders);
        setFilteredOrders(filteredOrders);
        setLoading(false);

        if (filteredOrders.length === 0) {
          message.info("No new orders found");
        }
      } catch (err) {
        setLoading(false);
        message.error("Unable to load orders. Please try again later.");
      }
    };

    fetchOrders();
  }, []);

  // Search handler
  const handleSearch = (value: string) => {
    setSearchTerm(value);

    // Filter orders based on search term (case-insensitive)
    const filtered = orders.filter((order) =>
      order.uniqueId.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredOrders(filtered);

    // Show message if no orders match the search
    if (filtered.length === 0) {
      message.info("No orders match your search");
    }
  };

  const handleOrderDetails = (order: Order) => {
    localStorage.setItem("orderId", order.orderId);
    navigate(`/home/orderDetails`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading orders..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-100">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <Typography.Title level={2} className="mb-0">
            New Orders
          </Typography.Title>

          {/* Conditional and Responsive Search Input */}
          {orders.length > 0 && (
            <div className="flex items-center space-x-2">
              <Typography.Text type="secondary" className="hidden sm:inline">
                Total: {filteredOrders.length} orders
              </Typography.Text>
              <Input
                placeholder="Search Order ID"
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-48 sm:w-64"
              />
            </div>
          )}

          {orders.length > 0 && (
            <Typography.Text type="secondary" className="sm:hidden">
              Total: {filteredOrders.length} orders
            </Typography.Text>
          )}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-screen p-4">
          <Empty
            image={<FileSearchOutlined className="text-6xl text-gray-400" />}
            description={
              <Typography.Text type="secondary">
                {searchTerm ? "No Orders Found" : "No Assigned Orders Found"}
              </Typography.Text>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => {
            return (
              <Card
                key={order.orderId}
                className="w-full border-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
                bordered={false}
              >
                <div className="flex flex-col space-y-4">
                  {/* Order ID Section */}
                  <div className="flex justify-between items-center">
                    <Typography.Text strong>
                      OrderId : #
                      <span className="text-purple-900 text-xl">
                        {order.uniqueId}
                      </span>
                    </Typography.Text>
                  </div>

                  {/* Date Section */}
                  <div className="flex justify-between items-center">
                    <Typography.Text type="secondary">Date</Typography.Text>
                    <Typography.Text>
                      {new Date(order.orderDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography.Text>
                  </div>

                  {/* Amount Section */}
                  <div className="flex justify-between items-center">
                    <Typography.Text strong>Amount</Typography.Text>
                    <Typography.Text strong type="success">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(order.subTotal)}
                    </Typography.Text>
                  </div>

                  {/* Delivery Address */}
                  <div className="flex flex-col space-y-2">
                    <Typography.Text strong>Delivery Address</Typography.Text>
                    <div className="bg-gray-50 p-3 rounded-md h-[90px] overflow-y-auto break-words scrollbar-none">
                      <Typography.Text className="block leading-tight">
                        {`${order.orderAddress?.flatNo || "N/A"}, `}
                        {order.orderAddress?.address || "N/A"}
                        {order.orderAddress?.landMark || "N/A"}
                        {order.orderAddress?.pincode || "N/A"}
                      </Typography.Text>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="mt-auto">
                    <Button
                      type="primary"
                      icon={<EyeOutlined />}
                      className="w-full"
                      onClick={() => handleOrderDetails(order)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NewOrders;
