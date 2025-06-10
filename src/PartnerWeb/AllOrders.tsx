import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  message,
  Spin,
  Card,
  Button,
  Empty,
  Input,
  DatePicker,
  Select,
} from "antd";
import {
  EyeOutlined,
  FileSearchOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Config";
import dayjs, { Dayjs } from "dayjs";

interface Order {
  orderId: string;
  username: string;
  mobilenumber: string;
  orderStatus: string | null;
  orderDate: string;
  grandTotal: number;
  address?: string;
  testUser: boolean;
  createdAt: string;
}

const getStatusText = (status: string | null) => {
  switch (status) {
    case "1":
      return "Placed";
    case "2":
      return "Accepted";
    case "3":
      return "Assigned";
    case "4":
      return "Delivered";
    case "5":
      return "Rejected";
    case "6":
      return "Cancelled";
    case "PickedUp":
      return "PickedUp";
    default:
      return "Unknown";
  }
};

const getStatusColor = (status: string | null) => {
  switch (status) {
    case "1":
      return "text-blue-600";
    case "2":
      return "text-yellow-600";
    case "3":
      return "text-purple-600";
    case "4":
      return "text-green-600";
    case "5":
      return "text-red-600";
    case "6":
      return "text-gray-600";
    default:
      return "text-gray-500";
  }
};

const AllOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isDataFetched, setIsDataFetched] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedParams = localStorage.getItem("orderparams");

    if (storedParams) {
      const parsedParams = new URLSearchParams(storedParams);
      const start = parsedParams.get("startDate");
      const end = parsedParams.get("endDate");
      const status = parsedParams.get("status") || "All";

      if (start && end) {
        const startD = dayjs(start);
        const endD = dayjs(end);

        setStartDate(startD);
        setEndDate(endD);
        setSelectedStatus(status);

        fetchOrders(startD, endD, status);
      }
    }
  }, []);

  const fetchOrders = async (
    startD?: dayjs.Dayjs,
    endD?: dayjs.Dayjs,
    status?: string
  ) => {
    const start = startD || startDate;
    const end = endD || endDate;
    const currentStatus = status ?? selectedStatus;

    if (!start || !end) {
      message.warning("Please select both start and end dates");
      return;
    }

    if (end.isBefore(start)) {
      message.error("End date cannot be earlier than start date");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const params = new URLSearchParams({
        startDate: start.format("YYYY-MM-DD"),
        endDate: end.format("YYYY-MM-DD"),
      });

      if (currentStatus && currentStatus !== "All") {
        params.append("status", currentStatus);
      }

      localStorage.setItem("orderparams", params.toString());

      const response = await axios.get<Order[]>(
        `${BASE_URL}/order-service/date-range?${params.toString()}`
      );

      const filteredOrders = response.data.filter((order) => !order.testUser);

      setOrders(filteredOrders);
      setFilteredOrders(filteredOrders);
      setIsDataFetched(true);

      if (filteredOrders.length === 0) {
        message.info("No orders found in the selected date range");
      }
    } catch (err) {
      message.error("Unable to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (!isDataFetched) return;

    const filtered = orders.filter((order) =>
      order.orderId.slice(-4).includes(value)
    );

    setFilteredOrders(filtered);

    if (filtered.length === 0) {
      message.info("No orders match your search criteria");
    }
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  const handleOrderDetails = (order: Order) => {
    localStorage.setItem("orderId", order.orderId);
    navigate(`/home/orderDetails`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <Typography.Title level={2} className="mb-0 mr-4">
          All Orders
        </Typography.Title>
        {isDataFetched && orders.length > 0 && (
          <Typography.Text type="secondary" className="text-right">
            Total: {orders.length} orders
          </Typography.Text>
        )}
      </div>

      <div className="flex flex-wrap gap-4 mb-4 sm:flex-row flex-col">
        <div className="flex flex-col">
          <Typography.Text>Start Date</Typography.Text>
          <DatePicker
            className="w-[150px]"
            value={startDate}
            onChange={(date) => setStartDate(date)}
            placeholder="Select Start Date"
            disabledDate={(current) => current && current > dayjs()}
          />
        </div>

        <div className="flex flex-col">
          <Typography.Text>End Date</Typography.Text>
          <DatePicker
            className="w-[150px]"
            value={endDate}
            onChange={(date) => setEndDate(date)}
            placeholder="Select End Date"
          />
        </div>

        <div className="flex flex-col">
          <Typography.Text>Status</Typography.Text>
          <Select
            className="w-[150px]"
            placeholder="Select Status"
            value={selectedStatus || "All"}
            onChange={handleStatusChange}
          >
            <Select.Option value="All">All Orders</Select.Option>
            <Select.Option value="1">Placed</Select.Option>
            <Select.Option value="2">Accepted</Select.Option>
            <Select.Option value="3">Assigned</Select.Option>
            <Select.Option value="4">Delivered</Select.Option>
            <Select.Option value="5">Rejected</Select.Option>
            {/* <Select.Option value="6">Cancelled</Select.Option> */}
            <Select.Option value="PickedUp">Picked Up</Select.Option>
          </Select>
        </div>

        <div className="flex flex-col justify-end">
          <Button
            type="primary"
            onClick={() => fetchOrders()}
            disabled={!startDate || !endDate}
            className="bg-[rgb(0,_140,_186)] w-[90px] text-white"
          >
            Get Orders
          </Button>
        </div>
      </div>

      {orders.length > 0 && (
        <div className="mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
          <Input
            placeholder="Search by Order ID"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin size="large" tip="Loading orders..." />
        </div>
      ) : !isDataFetched ? (
        <div className="flex-col items-center justify-center p-4 h-screen">
          <Empty
            image={<FileSearchOutlined className="text-6xl text-gray-400" />}
            description={
              <Typography.Text type="secondary">
                Select Date Range to View Orders
              </Typography.Text>
            }
          />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-4">
          <Empty
            image={<FileSearchOutlined className="text-6xl text-gray-400" />}
            description={
              <Typography.Text type="secondary">
                No Orders Found
              </Typography.Text>
            }
          />
        </div>
      ) : (
        <>
          {filteredOrders.length !== 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order, index) => (
                <Card
                  key={`${order.orderId}-${index}`}
                  className="border-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
                  bordered={false}
                >
                  <div className="flex flex-col space-y-4">
                    {/* Order ID and Status Section */}
                    <div className="flex justify-between items-center">
                      <Typography.Text strong>
                        Order ID :{" "}
                        <span className="text-lg text-purple-800">
                          #{order.orderId.slice(-4)}
                        </span>
                      </Typography.Text>
                      <Typography.Text
                        className={`font-semibold ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {getStatusText(order.orderStatus)}
                      </Typography.Text>
                    </div>

                    {/* Customer Name Section */}
                    <div className="flex justify-between items-center">
                      <Typography.Text type="secondary">
                        Customer
                      </Typography.Text>
                      <Typography.Text>
                        {order.username || "N/A"}
                      </Typography.Text>
                    </div>

                    <div className="flex justify-between items-center">
                      <Typography.Text type="secondary">Date</Typography.Text>
                      <Typography.Text>
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                        {/* {order.orderDate} */}
                      </Typography.Text>
                    </div>

                    {/* Mobile Number Section */}
                    <div className="flex justify-between items-center">
                      <Typography.Text type="secondary">Mobile</Typography.Text>
                      <Typography.Text>{order.mobilenumber}</Typography.Text>
                    </div>

                    {/* Amount Section */}
                    <div className="flex justify-between items-center">
                      <Typography.Text strong>Amount</Typography.Text>
                      <Typography.Text strong type="success">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                        }).format(order.grandTotal)}
                      </Typography.Text>
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
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllOrders;
