import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Button, DatePicker, message, Select, Table, Typography } from "antd";
import {
  ShoppingBag,
  ClipboardList,
  CheckCircle,
  Truck,
  PackageCheck,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  ArrowUpDown,
  Download,
} from "lucide-react";
import BASE_URL from "../Config";
import dayjs, { Dayjs } from "dayjs";

interface OrderCountData {
  orderPlacedCount: number;
  orderPickedUpCount: number;
  orderAssignedCount: number;
  orderAcceptedCount: number;
  orderDeliveredCount: number;
}

interface OrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  itemQty: number;
  price: number;
  weight: number;
}

interface WeeklyDeliveryItem {
  orderId: string;
  paymentType: number;
  orderStatus: string;
  grandTotal: number;
  customerName: string;
  mobileNumber: string;
  whatsappNumber: string;
  orderItems: OrderItem[];
  deliveryDate: string;
}

interface MonthlySalesItem {
  itemName: string;
  itemId: string;
  totalItemQuantity: number;
  weigth: number;
  totalItemsCount: number;
  grandTotal: number;
}
const { Option } = Select;

const OrderReport: React.FC = () => {
  const [orderData, setOrderData] = useState<OrderCountData | null>(null);
  const [weeklyDeliveryData, setWeeklyDeliveryData] = useState<
    WeeklyDeliveryItem[]
  >([]);
  const [monthlySalesData, setMonthlySalesData] = useState<MonthlySalesItem[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [weeklyLoading, setWeeklyLoading] = useState<boolean>(true);
  const [monthlyLoading, setMonthlyLoading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [weightFilter, setWeightFilter] = useState("all");
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs());
  const [weeklyStartDate, setWeeklyStartDate] = useState(
    dayjs().subtract(7, "day")
  );
  const [csvLoader, setCsvLoader] = useState<boolean>(false);
  const [weeklyEndDate, setWeeklyEndDate] = useState(dayjs());
  const [paymentType, setPaymentType] = useState<number | "All">("All");
  const [filteredSales, setFilteredSales] =
    useState<WeeklyDeliveryItem[]>(weeklyDeliveryData);

  const fetchOrderData = async () => {
    setLoading(true);
    try {
      const response = await axios.get<OrderCountData>(
        `${BASE_URL}/order-service/ordersCount`,
        {
          headers: {
            Accept: "*/*",
          },
        }
      );
      setOrderData(response.data);
    } catch (error) {
      console.error("Error fetching order data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyDeliveryData = async () => {
    try {
      setWeeklyLoading(true);
      const formattedStartDate = weeklyStartDate.format("YYYY-MM-DD");
      const formattedEndDate = weeklyEndDate.format("YYYY-MM-DD");
      const response = await axios.get(
        `${BASE_URL}/order-service/notification_to_dev_team_weekly?endDate=${formattedEndDate}&startDate=${formattedStartDate}`
      );
      setWeeklyDeliveryData(response.data);
    } catch (err) {
      console.error("Error fetching weekly data:", err);
      message.error("Failed to load weekly delivery data.");
      setWeeklyDeliveryData([]);
    } finally {
      setWeeklyLoading(false);
    }
  };

  const fetchMonthlySalesData = async () => {
    const formattedStartDate = startDate.format("YYYY-MM-DD");
    const formattedEndDate = endDate.format("YYYY-MM-DD");
    try {
      setMonthlyLoading(true);
      const response = await axios.get(
        `${BASE_URL}/order-service/notification_to_dev_team_monthly?endDate=${formattedEndDate}&startDate=${formattedStartDate}`
      );
      const filteredData = response.data.filter(
        (item: MonthlySalesItem) => item.weigth !== 35 && item.weigth !== 20
      );

      setMonthlySalesData(filteredData);
    } catch (err) {
      console.error("Error fetching monthly data:", err);
      message.error("Failed to load monthly sales data.");
      setMonthlySalesData([]);
    } finally {
      setMonthlyLoading(false);
    }
  };

  useEffect(() => {
    // console.log(paymentType);

    if (paymentType === "All") {
      setFilteredSales(weeklyDeliveryData);
    } else {
      const filtered = weeklyDeliveryData.filter(
        (item) => item.paymentType === paymentType
      );
      setFilteredSales(filtered);
    }
  }, [paymentType, weeklyDeliveryData]);

  useEffect(() => {
    fetchOrderData();
    fetchWeeklyDeliveryData();
    fetchMonthlySalesData();
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const currentMonth = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleWeightFilterChange = (value: string) => {
    setWeightFilter(value);
  };

  const filteredSalesData = useMemo(() => {
    return monthlySalesData.filter((item) => {
      if (weightFilter === "all") return true;
      return item.weigth === Number(weightFilter);
    });
  }, [monthlySalesData, weightFilter]);

  const sortedFilteredData = useMemo(() => {
    return [...filteredSalesData].sort((a, b) => {
      if (sortOrder === "desc") {
        return b.totalItemQuantity - a.totalItemQuantity;
      } else {
        return a.totalItemQuantity - b.totalItemQuantity;
      }
    });
  }, [filteredSalesData, sortOrder]);

  const columns = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      render: (_: any, record: MonthlySalesItem, index: number) => (
        <div className="text-sm font-medium text-gray-900">
          {index + 1}
          {index === 0 && sortOrder === "desc" && (
            <TrendingUp className="inline ml-1 w-4 h-4 text-green-600" />
          )}
          {index === sortedFilteredData.length - 1 && sortOrder === "desc" && (
            <TrendingDown className="inline ml-1 w-4 h-4 text-red-600" />
          )}
          {index === 0 && sortOrder === "asc" && (
            <TrendingDown className="inline ml-1 w-4 h-4 text-red-600" />
          )}
          {index === sortedFilteredData.length - 1 && sortOrder === "asc" && (
            <TrendingUp className="inline ml-1 w-4 h-4 text-green-600" />
          )}
        </div>
      ),
    },
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
      render: (text: string) => (
        <span className="text-sm text-gray-900">{text}</span>
      ),
    },
    {
      title: "Weight (kg)",
      dataIndex: "weigth",
      key: "weigth",
      render: (text: number) => (
        <span className="text-sm text-gray-900">{text} kg</span>
      ),
    },
    {
      title: (
        <div className="flex items-center">
          Quantity Sold
          {sortOrder === "desc" ? (
            <TrendingDown className="ml-1 w-4 h-4 text-green-600" />
          ) : (
            <TrendingUp className="ml-1 w-4 h-4 text-green-600" />
          )}
        </div>
      ),
      dataIndex: "totalItemQuantity",
      key: "totalItemQuantity",
      render: (text: number, record: MonthlySalesItem, index: number) => (
        <span
          className={`px-2 py-1 rounded-full ${
            index === 0 && sortOrder === "desc"
              ? "bg-green-100 text-green-800"
              : index === sortedFilteredData.length - 1 && sortOrder === "desc"
              ? "bg-red-100 text-red-800"
              : index === 0 && sortOrder === "asc"
              ? "bg-red-100 text-red-800"
              : index === sortedFilteredData.length - 1 && sortOrder === "asc"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "grandTotal",
      key: "grandTotal",
      render: (text: number) => (
        <span className="text-sm font-bold text-gray-900 flex items-center gap-1">
          ₹ {Math.ceil(text)}
        </span>
      ),
    },
  ];
  const weeklyColumns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      width: 120,
      render: (text: string, record: WeeklyDeliveryItem) => (
        <div className="flex flex-col">
          <span className="text-base font-medium text-gray-900">
            #{text.slice(-4)}
          </span>
          <span
            className={` w-fit text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
              record.paymentType === 1
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {record.paymentType === 2 ? "Online" : "COD"}
          </span>
        </div>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
      width: 180, // Fixed width for laptop view
      render: (name: string, record: WeeklyDeliveryItem) => (
        <div className="text-sm">
          <div
            className={`font-medium ${
              name.trim() ? "text-gray-900" : "text-gray-400"
            }`}
          >
            {name.trim() || "No name"}
          </div>

          <div className="text-gray-500">
            {record.mobileNumber || record.whatsappNumber || "No phone"}
          </div>
        </div>
      ),
    },
    {
      title: "Order Items",
      dataIndex: "orderItems",
      key: "orderItems",
      width: 300, // Fixed width for laptop view
      render: (items: OrderItem[]) => (
        <div>
          {items.map((item, index) => (
            <div key={index} className="flex flex-col mb-2 last:mb-0">
              <span
                className="text-green-700 font-semibold text-sm truncate max-w-xs"
                title={item.itemName}
              >
                {item.itemName || "Unnamed Item"}
              </span>
              <div className="flex gap-2 text-xs text-gray-700">
                {item.price && (
                  <span className="text-red-600 font-medium">
                    ₹{item.price}
                  </span>
                )}
                {item.quantity && <span>Qty: {item.quantity}</span>}
                {item.weight && <span>Weight: {item.weight}kgs</span>}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Total",
      dataIndex: "grandTotal",
      key: "grandTotal",
      width: 100, // Fixed width for laptop view
      render: (total: number) => (
        <span className="text-base font-bold text-gray-900">
          ₹{Math.ceil(total)}
        </span>
      ),
    },
    {
      title: "Delivery Date",
      dataIndex: "deliveryDate",
      key: "deliveryDate",
      width: 140, // Fixed width for laptop view
      render: (date: string) => {
        const formattedDate = new Date(date).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        return (
          <span className="text-sm font-medium text-indigo-700 bg-indigo-50 px-2 py-1 rounded">
            {formattedDate}
          </span>
        );
      },
    },
  ];

  if (loading && !orderData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    {
      label: "Orders Placed",
      value: orderData?.orderPlacedCount || 0,
      icon: <ShoppingBag className="w-8 h-8 text-teal-600" />,
      color: "bg-teal-100",
      textColor: "text-teal-800",
      borderColor: "border-teal-200",
    },
    {
      label: "Orders Accepted",
      value: orderData?.orderAcceptedCount || 0,
      icon: <CheckCircle className="w-4 h-4 text-green-600" />,
      color: "bg-green-100",
      textColor: "text-green-800",
      borderColor: "border-green-200",
    },
    {
      label: "Orders Assigned",
      value: orderData?.orderAssignedCount || 0,
      icon: <ClipboardList className="w-8 h-8 text-yellow-600" />,
      color: "bg-yellow-100",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-200",
    },
    {
      label: "Orders Picked Up",
      value: orderData?.orderPickedUpCount || 0,
      icon: <Truck className="w-8 h-8 text-purple-600" />,
      color: "bg-purple-100",
      textColor: "text-purple-800",
      borderColor: "border-purple-200",
    },
    {
      label: "Orders Delivered",
      value: orderData?.orderDeliveredCount || 0,
      icon: <PackageCheck className="w-8 h-8 text-blue-600" />,
      color: "bg-blue-100",
      textColor: "text-blue-800",
      borderColor: "border-blue-200",
    },
  ];

  const downloadMonthlyCSV = (): void => {
    if (!sortedFilteredData || sortedFilteredData.length === 0) return;

    const header = ["Rank", "Item Name", "Weight (kg)", "Quantity Sold"];
    const rows = sortedFilteredData.map((item, index) => {
      const rank = index + 1;
      const itemName = item.itemName;
      const weight = `${item.weigth} kg`;
      const quantitySold = item.totalItemQuantity;

      return [rank, itemName, weight, quantitySold];
    });

    const csvContent = [header, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Monthly_Sales_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadWeeklyCSV = async (): Promise<void> => {
    setCsvLoader(true);
    try {
      const startDate = weeklyStartDate.format("YYYY-MM-DD");
      const endDate = weeklyEndDate.format("YYYY-MM-DD");
      const response = await fetch(
        `${BASE_URL}/order-service/download_orderDetails_in_range?endingDate=${endDate}&startingDate=${startDate}`,
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-full mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Today Orders Report
          </h1>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-gray-600">{today}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-md border ${stat.borderColor} p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center`}
            >
              <div
                className={`${stat.color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}
              >
                {stat.icon}
              </div>
              <p className={`text-lg font-medium ${stat.textColor} mb-1`}>
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Delivered Orders Report
            </h2>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-gray-600">Delivered Orders</span>
            </div>
          </div>

          {/* Weekly Report Date Range Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
            {/* Start Date */}
            <DatePicker
              value={weeklyStartDate}
              format="DD/MM/YYYY"
              onChange={(date) => setWeeklyStartDate(date)}
              allowClear={false}
              placeholder="Start Date"
              className="w-full sm:w-auto"
            />

            {/* End Date */}
            <DatePicker
              value={weeklyEndDate}
              format="DD/MM/YYYY"
              onChange={(date) => setWeeklyEndDate(date)}
              allowClear={false}
              placeholder="End Date"
              className="w-full sm:w-auto"
            />

            {/* Get Data Button */}
            <button
              onClick={fetchWeeklyDeliveryData}
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Get Data
            </button>

            <div className="mb-4 flex items-center gap-4">
              <Select
                value={paymentType}
                onChange={(val) => setPaymentType(val)}
                style={{ width: 160 }}
                options={[
                  { value: "All", label: "All" },
                  { value: 2, label: "Online" },
                  { value: 1, label: "COD" },
                ]}
              />
            </div>

            <div className="flex-grow flex justify-end">
              <Button
                icon={<Download size={16} />}
                loading={csvLoader}
                disabled={weeklyDeliveryData.length === 0}
                onClick={downloadWeeklyCSV}
                className={`
                    flex items-center
                  bg-green-600 text-white
                  hover:bg-green-700
                  disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed
                    border-none
                    px-4 py-2 rounded-md transition
                  `}
              >
                Download CSV
              </Button>
            </div>
          </div>

          {weeklyLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-600"></div>
            </div>
          ) : weeklyDeliveryData.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md border border-blue-200 overflow-x-auto">
              <div className="p-4 bg-blue-50 border-t border-blue-100 flex justify-between items-center">
                {/* Left: COD and ONLINE totals */}
                <div className="text-sm text-green-800 flex gap-4">
                  {/* COD Total */}
                  <div>
                    COD:{" "}
                    <span className="text-lg font-bold">
                      ₹
                      {Math.ceil(
                        weeklyDeliveryData
                          .filter((order) => order.paymentType === 1)
                          .reduce((sum, order) => sum + order.grandTotal, 0)
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* ONLINE Total */}
                  <div>
                    Online:{" "}
                    <span className="text-lg font-bold">
                      ₹
                      {Math.ceil(
                        weeklyDeliveryData
                          .filter((order) => order.paymentType === 2)
                          .reduce((sum, order) => sum + order.grandTotal, 0)
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Right: Total Amount */}
                <div className="text-sm text-green-800">
                  Total:{" "}
                  <span className="text-lg font-bold">
                    ₹
                    {Math.ceil(
                      weeklyDeliveryData.reduce(
                        (sum, order) => sum + order.grandTotal,
                        0
                      )
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <Table
                dataSource={filteredSales}
                columns={weeklyColumns}
                pagination={{ pageSize: 50, showSizeChanger: false }}
                className="w-full"
               rowKey={(record, index) => `${record.orderId}-${index}`}
                scroll={{ x: "max-content" }}
              />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md border border-blue-200 p-12 text-center">
              <PackageCheck className="w-16 h-16 text-blue-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No delivery data available for the selected date range.
              </p>
              <p className="text-gray-400">
                Try selecting a different date range or check back later.
              </p>
            </div>
          )}
        </div>

        {/* Monthly Sales Report */}
        <div className="mb-8">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
                Monthly Sales Report
              </h2>

              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Current Month Display */}
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <span className="text-gray-600">{currentMonth}</span>
                </div>

                {/* Sort Button and Filter */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleSortOrder}
                    className="flex items-center space-x-1 py-2 px-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <ArrowUpDown className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">
                      {sortOrder === "desc"
                        ? "Highest to Lowest"
                        : "Lowest to Highest"}
                    </span>
                  </button>

                  <Select
                    defaultValue="all"
                    style={{ width: 120 }}
                    onChange={handleWeightFilterChange}
                    className="ml-2"
                  >
                    <Option value="all">All Weights</Option>
                    <Option value="1">1 kg</Option>
                    <Option value="5">5 kg</Option>
                    <Option value="10">10 kg</Option>
                    <Option value="26">26 kg</Option>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-2">
            {/* Start Date */}
            <DatePicker
              value={startDate}
              format="DD/MM/YYYY"
              onChange={(date) => setStartDate(date)}
              allowClear={false}
              placeholder="Start Date"
              className="w-full sm:w-auto"
            />

            {/* End Date */}
            <DatePicker
              value={endDate}
              format="DD/MM/YYYY"
              onChange={(date) => setEndDate(date)}
              allowClear={false}
              placeholder="End Date"
              className="w-full sm:w-auto"
            />

            {/* Get Data Button */}
            <button
              onClick={fetchMonthlySalesData}
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Get Data
            </button>

            {/* Push Download CSV to far right */}
            <div className="flex-grow flex justify-end">
              <button
                onClick={downloadMonthlyCSV}
                className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </button>
            </div>
          </div>

          {monthlyLoading ? (
            <div className="flex items-center justify-center p-12 bg-white rounded-xl shadow-md">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 ">
              <div className="p-4 bg-blue-50 border-t border-blue-100 flex justify-end items-center">
                <div className="text-sm text-green-800">
                  Grand Total:{" "}
                  <span className="text-lg font-bold">
                    ₹
                    {Math.ceil(
                      monthlySalesData.reduce(
                        (sum, order) => sum + order.grandTotal,
                        0
                      )
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <Table
                dataSource={sortedFilteredData}
                columns={columns}
                pagination={false}
                
                className="w-full"
                scroll={{ x: "max-content" }}
                rowClassName={(record, index) => {
                  if (index === 0 && sortOrder === "desc")
                    return "bg-green-50 hover:bg-green-100";
                  if (
                    index === sortedFilteredData.length - 1 &&
                    sortOrder === "desc"
                  )
                    return "bg-red-50 hover:bg-red-100";
                  if (index === 0 && sortOrder === "asc")
                    return "bg-red-50 hover:bg-red-100";
                  if (
                    index === sortedFilteredData.length - 1 &&
                    sortOrder === "asc"
                  )
                    return "bg-green-50 hover:bg-green-100";
                  return "hover:bg-gray-50";
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderReport;
