import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Select,
  DatePicker,
  Spin,
  message,
  Typography,
  Space,
  Button,
} from "antd";
import {
  ShoppingCartOutlined,
  DollarOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import dayjs, { Dayjs } from "dayjs";
import BASE_URL from "../Config";
import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Text } = Typography;
const { Option } = Select;

// TypeScript interfaces
interface OrderItem {
  itemId: string;
  itemName: string;
  quantity: number | null;
  itemQty: number;
  price: number;
  weight: number;
  itemBuyingPrice: number;
  profit: string;
  loss: string;
}

interface Order {
  orderId: string;
  paymentType: number;
  orderStatus: string;
  orderPlacedDate: string | null;
  grandTotal: number;
  customerName: string;
  mobileNumber: string;
  whatsappNumber: string;
  pincode: number;
  orderItems: OrderItem[];
  testUser: string;
  deliveryDate: string;
}

interface ApiResponse extends Array<Order> {}

interface StatusInfo {
  label: string;
  color: string;
  bgColor: string;
}

interface PincodeStats {
  orders: number;
  revenue: number;
  items: Record<
    string,
    {
      quantity: number;
      revenue: number;
    }
  >;
}

interface AmountApiResponse {
  totalAmountInMonth: number;
  totalAmountInOnline: number;
  totalAmountInCod: number;
  totalSalesInMonth: number;
}

const Stats: React.FC = () => {
  const [orderData, setOrderData] = useState<Order[]>([]);
  const [filteredOrderData, setFilteredOrderData] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("3days");
  const [selectedStatus, setSelectedStatus] = useState<string>("1");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const navigate = useNavigate();
  const [csvLoader, setCsvLoader] = useState<boolean>(false);
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());
  const [amount, setAmount] = useState<AmountApiResponse>({
    totalAmountInMonth: 0,
    totalAmountInOnline: 0,
    totalAmountInCod: 0,
    totalSalesInMonth: 0,
  });
  const [useSalesData, setUseSalesData] = useState<boolean>(false);

  const fetchAmountData = async () => {
    try {
      const response = await axios.get<AmountApiResponse>(
        `${BASE_URL}/order-service/orderSaleData`,
        {
          params: {
            startDate: startDate.format("YYYY-MM-DD"),
            endDate: endDate.format("YYYY-MM-DD"),
          },
          headers: { accept: "*/*" },
        }
      );

      setAmount(response.data);
    } catch (error) {
      console.error("Error fetching amount data:", error);
    }
  };

  const statusMap: Record<string, StatusInfo> = {
    "1": { label: "Placed", color: "#2563eb", bgColor: "#dbeafe" },
    "3": { label: "Assigned", color: "#ea580c", bgColor: "#fed7aa" },
    "4": { label: "Delivered", color: "#0891b2", bgColor: "#cffafe" },
    "5": { label: "Rejected", color: "#dc2626", bgColor: "#fecaca" },
    PickedUp: { label: "Picked Up", color: "#7c3aed", bgColor: "#e9d5ff" },
  };

  const paymentTypeMap: Record<number, string> = {
    1: "COD",
    2: "Online",
  };

  // Lighter gradient colors
  const gradientColors = {
    total: "linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 100%)",
    cod: "linear-gradient(135deg, #f9a8d4 0%, #f472b6 100%)",
    online: "linear-gradient(135deg, #60a5fa 0%, #38bdf8 100%)",
  };

  const chartColors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#6ee7b7",
    "#facc15",
  ];

  // Filter out items with 35kg and 20kg weight
  const filterOrderItems = (orders: Order[]): Order[] => {
    const sample = orders.map((order) => ({
      ...order,
      orderItems: order.orderItems.filter(
        (item) => item.weight !== 35 && item.weight !== 20
      ),
    }));
    return sample.filter((order) => order.testUser === "false");
  };

  const fetchOrderData = async (startDate1: Dayjs, endDate1: Dayjs) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/order-service/notification_to_dev_team_weekly?endDate=${endDate1.format(
          "YYYY-MM-DD"
        )}&startDate=${startDate1.format(
          "YYYY-MM-DD"
        )}&status=${selectedStatus}`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      const filteredData = filterOrderItems(data);

      setOrderData(filteredData);
      setFilteredOrderData(filteredData);
      message.success(`Loaded ${filteredData.length} orders successfully`);
    } catch (error) {
      console.error("Error fetching order data:", error);
      message.error("Failed to fetch order data. Please try again.");
      setOrderData([]);
      setFilteredOrderData([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders by payment type
  useEffect(() => {
    if (paymentFilter === "all") {
      setFilteredOrderData(orderData);
    } else {
      const paymentTypeNum = paymentFilter === "cod" ? 1 : 2;
      setFilteredOrderData(
        orderData.filter((order) => order.paymentType === paymentTypeNum)
      );
    }
  }, [paymentFilter, orderData]);

  // Initial data load on component mount
  useEffect(() => {
    fetchOrderData(startDate, endDate);
    // fetchAmountData();
  }, []);

  const handleStatusChange = (status: string): void => {
    setSelectedStatus(status);
  };

  const handleDateChange = (
    date: Dayjs | null,
    type: "start" | "end"
  ): void => {
    if (date) {
      if (type === "start") {
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalRevenue = filteredOrderData.reduce(
      (sum, order) => sum + order.grandTotal,
      0
    );

    const statusDistribution: Record<string, number> = {};
    filteredOrderData.forEach((order) => {
      const status = statusMap[order.orderStatus]?.label || "Unknown";
      statusDistribution[status] = (statusDistribution[status] || 0) + 1;
    });

    const paymentDistribution = { COD: 0, Online: 0 };
    const paymentRevenue = { COD: 0, Online: 0 };
    filteredOrderData.forEach((order) => {
      const paymentType = paymentTypeMap[order.paymentType] || "Unknown";
      if (paymentType !== "Unknown") {
        paymentDistribution[paymentType as keyof typeof paymentDistribution]++;
        paymentRevenue[paymentType as keyof typeof paymentRevenue] +=
          order.grandTotal;
      }
    });

    const pincodeStats: Record<string, PincodeStats> = {};
    filteredOrderData.forEach((order) => {
      const pincode =
        order.pincode != null ? order.pincode.toString() : "Unknown";
      if (!pincodeStats[pincode]) {
        pincodeStats[pincode] = {
          orders: 0,
          revenue: 0,
          items: {},
        };
      }
      pincodeStats[pincode].orders++;
      pincodeStats[pincode].revenue += order.grandTotal;

      order.orderItems.forEach((item) => {
        if (!pincodeStats[pincode].items[item.itemName]) {
          pincodeStats[pincode].items[item.itemName] = {
            quantity: 0,
            revenue: 0,
          };
        }
        pincodeStats[pincode].items[item.itemName].quantity += item.itemQty;
        pincodeStats[pincode].items[item.itemName].revenue += item.price;
      });
    });

    const itemStats: Record<
      string,
      { quantity: number; revenue: number; orders: number }
    > = {};
    filteredOrderData.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (!itemStats[item.itemName]) {
          itemStats[item.itemName] = { quantity: 0, revenue: 0, orders: 0 };
        }
        itemStats[item.itemName].quantity += item.itemQty;
        itemStats[item.itemName].revenue += item.price;
        itemStats[item.itemName].orders++;
      });
    });

    // Calculate daily payment amounts for line chart
    const dailyPayments: Record<
      string,
      { date: string; COD: number; Online: number }
    > = {};
    filteredOrderData.forEach((order) => {
      const date = dayjs(order.deliveryDate).format("YYYY-MM-DD");
      if (!dailyPayments[date]) {
        dailyPayments[date] = { date, COD: 0, Online: 0 };
      }
      const paymentType = paymentTypeMap[order.paymentType] || "Unknown";
      if (paymentType === "COD") {
        dailyPayments[date].COD += order.grandTotal;
      } else if (paymentType === "Online") {
        dailyPayments[date].Online += order.grandTotal;
      }
    });

    const dailyPaymentData = Object.values(dailyPayments).sort(
      (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix()
    );

    return {
      totalRevenue,
      statusDistribution,
      paymentDistribution,
      paymentRevenue,
      pincodeStats,
      itemStats,
      dailyPaymentData,
    };
  }, [filteredOrderData]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Chart data
  const statusChartData = Object.entries(stats.statusDistribution).map(
    ([status, count], index) => ({
      name: status,
      value: count,
      fill: chartColors[index % chartColors.length],
    })
  );
  const handleViewDetails = (order: Order) => {
    const userType = localStorage.getItem("admin_primaryType");
    if (userType === "HELPDESKSUPERADMIN") {
      message.info("please login into partner for watch order details");
      return;
    }
    localStorage.setItem("partner_orderId", order.orderId);
    navigate(`/home/orderDetails`);
  };

  const topPincodes = Object.entries(stats.pincodeStats)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 10)
    .map(([pincode, data]) => ({
      pincode,
      revenue: data.revenue,
      orders: data.orders,
    }));

  const topItems = Object.entries(stats.itemStats)
    .sort((a, b) => b[1].quantity - a[1].quantity)
    .slice(0, 10)
    .map(([itemName, data]) => ({
      itemName,
      quantity: data.quantity,
      revenue: data.revenue,
    }));

  const pincodeItemAnalysis = Object.entries(stats.pincodeStats)
    .map(([pincode, data]) => {
      const totalItems = Object.values(data.items).reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const itemEntries = Object.entries(data.items).sort(
        (a, b) => b[1].quantity - a[1].quantity
      );
      const topItems = itemEntries.slice(0, 3);
      const lowItems = itemEntries.slice(-3).reverse();

      return {
        key: pincode,
        pincode,
        totalItems,
        totalRevenue: data.revenue,
        totalOrders: data.orders,
        topItems: topItems.map(([name, stats]) => ({
          name,
          quantity: stats.quantity,
          revenue: stats.revenue,
        })),
        lowItems: lowItems.map(([name, stats]) => ({
          name,
          quantity: stats.quantity,
          revenue: stats.revenue,
        })),
      };
    })
    .sort((a, b) => b.totalItems - a.totalItems);

  const pincodeAnalysisColumns = [
    {
      title: "Pincode",
      dataIndex: "pincode",
      key: "pincode",
      render: (pincode: string) => (
        <Tag
          color="blue"
          icon={<EnvironmentOutlined />}
          className="rounded-lg px-2 py-1"
        >
          {pincode}
        </Tag>
      ),
      width: 120,
      sorter: (a: any, b: any) => Number(a.pincode) - Number(b.pincode),
    },
    {
      title: "Summary",
      key: "summary",
      render: (record: any) => (
        <div className="space-y-1 text-sm">
          <div>
            <strong>{record.totalOrders}</strong> Orders
          </div>
          <div>
            <strong>{record.totalItems}</strong> Items
          </div>
          <div className="text-green-600 font-semibold">
            {formatCurrency(record.totalRevenue)}
          </div>
        </div>
      ),
      width: 180,
    },
    {
      title: "Top 3 Items",
      key: "topItems",
      width: 280,
      render: (record: any) => (
        <div className="h-32 overflow-y-scroll scrollbar-none">
          <div className="space-y-2">
            {record.topItems.map((item: any, index: number) => (
              <div key={index} className="text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-green-700 truncate flex-1">
                    {item.name}
                  </span>
                  <Tag color="green" className="ml-2">
                    Top {index + 1}
                  </Tag>
                </div>
                <div className="text-gray-500">
                  Qty: {item.quantity} | {formatCurrency(item.revenue)}
                </div>
              </div>
            ))}
            {record.topItems.length === 0 && (
              <Text type="secondary" className="text-xs">
                No items
              </Text>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Low 3 Items",
      key: "lowItems",
      width: 280,
      render: (record: any) => (
        <div className="h-32 overflow-y-scroll scrollbar-none">
          <div className="space-y-2">
            {record.lowItems.map((item: any, index: number) => (
              <div key={index} className="text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-orange-700 truncate flex-1">
                    {item.name}
                  </span>
                  <Tag color="orange" className="ml-2">
                    Low
                  </Tag>
                </div>
                <div className="text-gray-500">
                  Qty: {item.quantity} | {formatCurrency(item.revenue)}
                </div>
              </div>
            ))}
            {record.lowItems.length === 0 && (
              <Text type="secondary" className="text-xs">
                No items
              </Text>
            )}
          </div>
        </div>
      ),
    },
  ];

  const orderColumns = [
    {
      title: "Order Details",
      key: "orderDetails",
      render: (record: Order) => (
        <div>
          <div
            className="font-mono text-lg font-medium cursor-pointer hover:text-blue-600"
            onClick={() => handleViewDetails(record)}
          >
            #{record.orderId.slice(-4)}
          </div>
          <Tag
            color={statusMap[record.orderStatus]?.color || "default"}
            style={{ borderRadius: "8px", padding: "2px 8px" }}
          >
            {statusMap[record.orderStatus]?.label || "Unknown"}
          </Tag>
        </div>
      ),
      width: 140,
    },
    {
      title: "Customer",
      key: "customer",
      render: (record: Order) => (
        <div>
          <div className="font-medium">{record.customerName}</div>
          <Text type="secondary" className="text-xs">
            {record.mobileNumber}
          </Text>
        </div>
      ),
      width: 180,
    },
    {
      title: "Payment",
      dataIndex: "paymentType",
      key: "paymentType",
      render: (type: number) => (
        <Tag
          color={type === 1 ? "orange" : "green"}
          icon={<CreditCardOutlined />}
          style={{ borderRadius: "8px", padding: "2px 8px" }}
        >
          {paymentTypeMap[type] || "Unknown"}
        </Tag>
      ),
      width: 120,
    },
    {
      title: "Amount",
      dataIndex: "grandTotal",
      key: "grandTotal",
      render: (amount: number) => (
        <Text strong className="text-green-600">
          {formatCurrency(amount)}
        </Text>
      ),
      width: 140,
      sorter: (a: Order, b: Order) => a.grandTotal - b.grandTotal,
    },
    {
      title: "Pincode",
      dataIndex: "pincode",
      key: "pincode",
      render: (pincode: number) => (
        <Tag
          icon={<EnvironmentOutlined />}
          style={{ borderRadius: "8px", padding: "2px 8px" }}
        >
          {pincode}
        </Tag>
      ),
      width: 120,
      sorter: (a: Order, b: Order) => a.pincode - b.pincode,
    },
    {
      title: "Date",
      dataIndex: "deliveryDate",
      key: "deliveryDate",
      render: (date: string) => dayjs(date).format("MMM D, YYYY"),
      width: 140,
      sorter: (a: Order, b: Order) =>
        dayjs(a.deliveryDate).unix() - dayjs(b.deliveryDate).unix(),
    },
  ];

  const downloaCSV = async (): Promise<void> => {
    setCsvLoader(true);
    try {
      const startDate1 = startDate.format("YYYY-MM-DD");
      const endDate1 = endDate.format("YYYY-MM-DD");
      const response = await fetch(
        `${BASE_URL}/order-service/download_orderDetails_in_range?endingDate=${endDate1}&startingDate=${startDate1}`,
        {
          method: "GET",
          headers: {
            Accept: "*/*",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download CSV");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "orders_report.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    } finally {
      setCsvLoader(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Controls */}
        <div className="mb-6">
          <Title level={2} className="mb-4">
            <ShoppingCartOutlined className="mr-3" />
            Orders Stats
          </Title>

          <Card>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} md={6} lg={4}>
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Text strong>Start Date</Text>
                  <DatePicker
                    value={startDate}
                    onChange={(date) => handleDateChange(date, "start")}
                    format="DD-MM-YYYY"
                    placeholder="Start Date"
                    style={{ width: "100%" }}
                  />
                </Space>
              </Col>
              <Col xs={24} sm={12} md={6} lg={4}>
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Text strong>End Date</Text>
                  <DatePicker
                    value={endDate}
                    onChange={(date) => handleDateChange(date, "end")}
                    format="DD-MM-YYYY"
                    placeholder="End Date"
                    style={{ width: "100%" }}
                  />
                </Space>
              </Col>
              <Col xs={24} sm={12} md={6} lg={4}>
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Text strong>Order Status</Text>
                  <Select
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    style={{ width: "100%" }}
                    placeholder="Order Status"
                  >
                    {Object.entries(statusMap).map(([key, value]) => (
                      <Option key={key} value={key}>
                        {value.label}
                      </Option>
                    ))}
                  </Select>
                </Space>
              </Col>
              <Col xs={24} md={8} lg={8}>
                <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      fetchOrderData(startDate, endDate);
                      // Set useSalesData based on current selected status
                      if (selectedStatus === "4") {
                        fetchAmountData();
                        setUseSalesData(true);
                      } else {
                        setUseSalesData(false);
                      }
                    }}
                    loading={loading}
                    icon={<ReloadOutlined />}
                    className="bg-[rgb(0,_140,_186)] w-[90px] text-white"
                  >
                    Get Data
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        </div>

        {/* Content section with conditional loading */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Spin size="large" tip="Loading order data..." />
          </div>
        ) : (
          <>
            <Row gutter={[16, 16]} className="mb-6">
              <Col xs={24} sm={8}>
                <Card
                  style={{ background: gradientColors.total, border: "none" }}
                >
                  <Statistic
                    title={
                      <span style={{ color: "white", fontWeight: "bold" }}>
                        Total Revenue
                      </span>
                    }
                    value={
                      useSalesData
                        ? Math.round(amount.totalAmountInMonth)
                        : Math.round(stats.totalRevenue)
                    }
                    formatter={(value) => formatCurrency(Number(value))}
                    prefix={<DollarOutlined style={{ color: "white" }} />}
                    valueStyle={{ color: "white", fontWeight: "bold" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card
                  style={{ background: gradientColors.cod, border: "none" }}
                >
                  <Statistic
                    title={
                      <span style={{ color: "white", fontWeight: "bold" }}>
                        COD Revenue
                      </span>
                    }
                    value={
                      useSalesData
                        ? Math.round(amount.totalAmountInCod)
                        : Math.round(stats.paymentRevenue.COD)
                    }
                    formatter={(value) => formatCurrency(Number(value))}
                    prefix={<CreditCardOutlined style={{ color: "white" }} />}
                    valueStyle={{ color: "white", fontWeight: "bold" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card
                  style={{ background: gradientColors.online, border: "none" }}
                >
                  <Statistic
                    title={
                      <span style={{ color: "white", fontWeight: "bold" }}>
                        Online Revenue
                      </span>
                    }
                    value={
                      useSalesData
                        ? Math.round(amount.totalAmountInOnline)
                        : Math.round(stats.paymentRevenue.Online)
                    }
                    formatter={(value) => formatCurrency(Number(value))}
                    prefix={<CreditCardOutlined style={{ color: "white" }} />}
                    valueStyle={{ color: "white", fontWeight: "bold" }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="mb-6">
              <Col xs={24}>
                <Card title="Daily Payment Trends">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={stats.dailyPaymentData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => dayjs(date).format("MMM D")}
                      />
                      <YAxis
                        tickFormatter={(value) =>
                          `₹${(value / 1000).toFixed(0)}K`
                        }
                      />
                      <Tooltip
                        content={(props) => {
                          const { active, payload, label } = props;
                          if (active && payload && payload.length) {
                            const codAmount =
                              payload.find((p) => p.dataKey === "COD")?.value ||
                              0;
                            const onlineAmount =
                              payload.find((p) => p.dataKey === "Online")
                                ?.value || 0;
                            const total =
                              Number(codAmount) + Number(onlineAmount);

                            return (
                              <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                                <p className="font-medium mb-2">
                                  {dayjs(label).format("MMMM D, YYYY")}
                                </p>
                                <p className="text-sm mb-1">
                                  <span
                                    className="inline-block w-3 h-3 mr-2 rounded-full"
                                    style={{ backgroundColor: chartColors[0] }}
                                  ></span>
                                  COD: {formatCurrency(Number(codAmount))}
                                </p>
                                <p className="text-sm mb-1">
                                  <span
                                    className="inline-block w-3 h-3 mr-2 rounded-full"
                                    style={{ backgroundColor: chartColors[1] }}
                                  ></span>
                                  Online: {formatCurrency(Number(onlineAmount))}
                                </p>
                                <hr className="my-2" />
                                <p className="text-sm font-medium">
                                  Total: {formatCurrency(total)}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="COD"
                        stroke={chartColors[0]}
                        name="COD"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Online"
                        stroke={chartColors[1]}
                        name="Online"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>

            {/* Other Charts */}
            <Row gutter={[16, 16]} className="mb-6">
              <Col xs={24} lg={12}>
                <Card title="Top Performing Pincodes">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={topPincodes}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="pincode" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        formatter={(value: any, name: string) => [
                          name === "revenue"
                            ? formatCurrency(Number(value))
                            : value,
                          name === "revenue" ? "Revenue" : "Orders",
                        ]}
                      />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="orders"
                        fill={chartColors[0]}
                        name="Orders"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="revenue"
                        fill={chartColors[1]}
                        name="Revenue"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="Top Selling Items">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={topItems}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="itemName"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        formatter={(value: any, name: string) => [
                          name === "revenue"
                            ? formatCurrency(Number(value))
                            : value,
                          name === "revenue" ? "Revenue" : "Quantity",
                        ]}
                      />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="quantity"
                        fill={chartColors[4]}
                        name="Quantity"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="revenue"
                        fill={chartColors[7]}
                        name="Revenue"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>

            <Card
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Recent Orders ({filteredOrderData.length})</span>
                  <div className="flex-grow flex justify-end gap-3">
                    <Select
                      value={paymentFilter}
                      onChange={setPaymentFilter}
                      style={{ width: 120 }}
                      placeholder="Payment Type"
                    >
                      <Option value="all">All</Option>
                      <Option value="cod">COD</Option>
                      <Option value="online">Online</Option>
                    </Select>
                    <Button
                      icon={<Download className="w-4 h-4 mr-2" />}
                      loading={csvLoader}
                      onClick={downloaCSV}
                      className={`
                        flex items-center
                        py-2 px-4
                        bg-green-600 text-white
                        hover:bg-green-700
                        disabled:bg-gray-500 disabled:text-gray-500 disabled:cursor-not-allowed
                        border-none rounded-md transition
                      `}
                    >
                      Download CSV
                    </Button>
                  </div>
                </div>
              }
            >
              <Table
                columns={orderColumns}
                dataSource={filteredOrderData}
                rowKey="orderId"
                pagination={{
                  pageSize: 50,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} orders`,
                  pageSizeOptions: ["25", "50", "100"],
                }}
                scroll={{ x: 1000 }}
                size="middle"
              />
            </Card>

            {/* Pincode Item Performance Analysis */}
            <Card title="Pincode Item Performance Analysis" className="mb-6">
              <Table
                columns={pincodeAnalysisColumns}
                dataSource={pincodeItemAnalysis}
                pagination={{
                  pageSize: 50,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} pincodes`,
                }}
                scroll={{ x: 900 }}
                size="middle"
              />
            </Card>
          </>
        )}
      </div>

      <style>{`
        .scrollbar-none {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Stats;
