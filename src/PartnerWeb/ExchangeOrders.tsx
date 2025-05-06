import { useState, useEffect } from "react";
import { Table, Tag, Input, Space, Typography, Spin, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Search, RefreshCw } from "lucide-react";
import BASE_URL from "../Config";

// Define the type for exchange order data
interface ExchangeOrder {
  orderId: string;
  userId: string | null;
  itemId: string | null;
  itemName: string;
  itemPrice: number;
  userName: string;
  orderType: string | null;
  reason: string;
  exchangeRequestDate: string;
  daysDifference: number;
  mobileNumber: string;
}

const { Title } = Typography;

const ExchangeOrdersPage = () => {
  const [exchangeOrders, setExchangeOrders] = useState<ExchangeOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");

  const fetchExchangeOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/order-service/getAllExchangeOrder`
      );
      const data = await response.json();
      setExchangeOrders(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching exchange orders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeOrders();
  }, []);

  // Handle search functionality
  const filteredOrders = exchangeOrders.filter(
    (order) =>
      order.orderId.toLowerCase().includes(searchText.toLowerCase()) ||
      order.itemName.toLowerCase().includes(searchText.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchText.toLowerCase()) ||
      order.mobileNumber.includes(searchText)
  );

  const columns: ColumnsType<ExchangeOrder> = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      width: "12%",
      render: (orderId: string) => <span className="font-bold">{orderId}</span>,
    },
    {
      title: "Item Details",
      key: "itemDetails",
      width: "22%",
      render: (_, record) => (
        <div className="flex flex-col">
          <strong className="text-sm">{record.itemName}</strong>
          <span className="text-xs text-red-600">₹{record.itemPrice}</span>
        </div>
      ),
    },
    {
      title: "Customer Info",
      key: "customerInfo",
      width: "18%",
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="text-sm">{record.userName}</span>
          <Tag color="blue" className="w-fit">
            {record.mobileNumber}
          </Tag>
        </div>
      ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      width: "30%",
    },
    {
      title: "Request Date",
      dataIndex: "exchangeRequestDate",
      key: "exchangeRequestDate",
      width: "18%",
      render: (date: string, record) => {
        const parsedDate = new Date(date);
        const formattedDate = `${parsedDate.toLocaleString("en-US", {
          month: "short",
        })} ${parsedDate.getDate()}, ${parsedDate.getFullYear()}`;
        return (
          <div className="flex flex-col">
            <span>{formattedDate}</span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <Title level={4} className="mb-4 md:mb-0">
              Exchange Orders
            </Title>
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
              <div className="relative w-full sm:w-64">
                <Input
                  placeholder="Search orders..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  prefix={<Search className="text-gray-400" size={16} />}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center my-12">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table
                  dataSource={filteredOrders}
                  columns={columns}
                  rowKey="orderId"
                  pagination={{
                    pageSize: 10,
                    responsive: true,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} orders`,
                  }}
                  className="min-w-full"
                  scroll={{ x: "max-content" }}
                  bordered
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExchangeOrdersPage;
