import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { DatePicker, message, Select, Table } from "antd";
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
} from "lucide-react";
import BASE_URL from "../Config";
import dayjs from "dayjs";

interface OrderCountData {
  orderPlacedCount: number;
  orderPickedUpCount: number;
  orderAssignedCount: number;
  orderAcceptedCount: number;
  orderDeliveredCount: number;
}

interface WeeklyDeliveryData {
  orderDeliveredCount: number;
}

interface MonthlySalesItem {
  itemName: string;
  itemId: string;
  totalItemQuantity: number;
  weigth: number;
  totalItemsCount: number;
}
const { Option } = Select;

const OrderReport: React.FC = () => {
  const [orderData, setOrderData] = useState<OrderCountData | null>(null);
  const [weeklyDeliveryData, setWeeklyDeliveryData] =
    useState<WeeklyDeliveryData | null>(null);
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
      const response = await axios.get(
        `${BASE_URL}/order-service/notification_to_dev_team_weekly`
      );
      setWeeklyDeliveryData(response.data);
    } catch (err) {
      console.error("Error fetching weekly data:", err);
      message.error("Failed to load weekly delivery data.");
      setWeeklyDeliveryData(null);
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
      setMonthlySalesData(response.data);
    } catch (err) {
      console.error("Error fetching monthly data:", err);
      message.error("Failed to load monthly sales data.");
      setMonthlySalesData([]);
    } finally {
      setMonthlyLoading(false);
    }
  };

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

  // Filter by weight first
  const filteredSalesData = useMemo(() => {
    return monthlySalesData.filter((item) => {
      if (weightFilter === "all") return true;
      return item.weigth === Number(weightFilter);
    });
  }, [monthlySalesData, weightFilter]);

  // Then sort the filtered data
  const sortedFilteredData = useMemo(() => {
    return [...filteredSalesData].sort((a, b) => {
      if (sortOrder === "desc") {
        return b.totalItemQuantity - a.totalItemQuantity;
      } else {
        return a.totalItemQuantity - b.totalItemQuantity;
      }
    });
  }, [filteredSalesData, sortOrder]);

  // Define columns separately
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
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Today Orders Report
          </h1>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-gray-600">{today}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-md border ${stat.borderColor} p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col`}
            >
              <div
                className={`${stat.color} w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto`}
              >
                {stat.icon}
              </div>
              <div className="flex flex-col justify-between flex-grow text-center">
                <div className="h-12 flex items-center justify-center">
                  <p className={`text-lg font-medium ${stat.textColor}`}>
                    {stat.label}
                  </p>
                </div>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Weekly Delivery Report
            </h2>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-gray-600">Last 7 days</span>
            </div>
          </div>

          {weeklyLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md border border-blue-200 p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mr-6">
                  <PackageCheck className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-blue-800 mb-1">
                    Total Weekly Deliveries
                  </p>
                  <p className="text-4xl font-bold text-gray-900">
                    {weeklyDeliveryData?.orderDeliveredCount || 0}
                  </p>
                </div>
              </div>
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
          </div>

          {monthlyLoading ? (
            <div className="flex items-center justify-center p-12 bg-white rounded-xl shadow-md">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 ">
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
