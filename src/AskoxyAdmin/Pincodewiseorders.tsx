import React, { useState } from "react";
import {
  DatePicker,
  Input,
  Button,
  Table,
  Card,
  Typography,
  Space,
  Tag,
  message,
  Modal,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  CommentOutlined,
  DollarOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import BASE_URL from "../Config";
import HelpDeskCommentsModal from "./HelpDeskCommentsModal";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface OrderItem {
  itemId: string;
  itemName: string;
  categoriesId: string | null;
  itemBarCode: string | null;
  quantity: number;
  itemLogo: string | null;
  itemDeleteId: string | null;
  itemQty: number;
  itemUnit: string;
  itemDescription: string | null;
  tags: string | null;
  createdAt: string | null;
  itemprice: number;
  singleItemPrice: number;
  itemMrpPrice: number;
  price: number;
  itemUrl: string;
  weight: number;
  status: string | null;
  errorMessage: string | null;
}

interface Order {
  orderId: string;
  grandTotal: number;
  paymentType: number;
  orderStatus: string;
  orderedDate: string;
  deliveryDate: string;
  mobileNumber: string;
  whatsappNumber: string;
  userType: string;
  pinCode: string;
  address: string;
  flatNo: string;
  orderItems: OrderItem[];
  totalCount: number | null;
  customerName: string;
  userId: string | null | undefined;
}

const OrderSalesDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);
  const [pinCode, setPinCode] = useState("");
  const [weight, setWeight] = useState("");
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  const isAdmin =
    localStorage.getItem("admin_primaryType") === "HELPDESKSUPERADMIN";

  const fetchOrders = async () => {
    if (!dateRange || !dateRange[0] || !dateRange[1] || !pinCode || !weight) {
      message.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const startDate = dateRange[0]?.format("YYYY-MM-DD");
      const endDate = dateRange[1]?.format("YYYY-MM-DD");

      const response = await fetch(
        `${BASE_URL}/order-service/orderSalesExcleSheet?endDate=${endDate}&pinCode=${pinCode}&startDate=${startDate}&weight=${weight}`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data: Order[] = await response.json();
      setOrders(data || []);
      message.success(`${(data || []).length} orders fetched successfully`);
    } catch (error) {
      message.error("Error fetching orders: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "1":
        return "blue";
      case "2":
        return "orange";
      case "3":
        return "yellow";
      case "4":
        return "green";
      case "5":
        return "red";
      default:
        return "default";
    }
  };

  const getOrderStatusText = (status: string): string => {
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
      case "PickedUp":
        return "Picked Up";
      default:
        return status || "Unknown";
    }
  };

  const getPaymentTypeText = (type: number) => {
    return type === 2 ? "Online Payment" : "Cash on Delivery";
  };

  const calculateTotals = () => {
    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.grandTotal || 0),
      0
    );
    const codTotal = orders
      .filter((order) => order.paymentType === 1)
      .reduce((sum, order) => sum + (order.grandTotal || 0), 0);
    const onlineTotal = orders
      .filter((order) => order.paymentType === 2)
      .reduce((sum, order) => sum + (order.grandTotal || 0), 0);

    return { totalRevenue, codTotal, onlineTotal };
  };

  const { totalRevenue, codTotal, onlineTotal } = calculateTotals();

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Gradient colors for cards
  const lightColors = {
    total: "#e0f7fa",
    cod: "#f1f8e9",
    online: "#f3e5f5",
  };

  const stats = {
    totalRevenue,
    paymentRevenue: {
      COD: codTotal,
      Online: onlineTotal,
    },
  };

  const showCommentsModal = (record: Order) => {
    setSelectedUserId(record?.userId ?? "");
    setCommentsModalVisible(true);
  };

  const columns = [
    {
      title: "Details",
      key: "orderCustomer",
      render: (record: Order) => (
        <div className="space-y-2">
          <div className="space-y-1">
            <Text className="text-md">
              orderId:{" "}
              <Text strong className="text-lg">
                {record.orderId ? record.orderId.slice(-4) : "N/A"}
              </Text>
            </Text>

            <div className="flex items-center gap-1">
              <Text strong className="text-sm">
                {record.customerName || "N/A"}
              </Text>
            </div>
            <div className="flex items-center gap-1">
              <PhoneOutlined className="text-gray-500 text-xs" />
              <Text className="text-sm">{record.mobileNumber || "N/A"}</Text>
            </div>
            <Tag
              color={record.userType === "NEWUSER" ? "green" : "blue"}
              className="text-sm"
            >
              {record.userType || "UNKNOWN"}
            </Tag>
          </div>
        </div>
      ),
      width: 180,
    },
    {
      title: "Address",
      key: "address",
      render: (record: Order) => (
        <div className="space-y-1 max-w-48">
          <div className="flex items-start gap-1">
            <strong className="text-sm leading-relaxed">
              {record.address || "N/A"}
            </strong>
          </div>
          {record.flatNo && (
            <Text className="text-sm text-gray-500 block">
              Flat: {record.flatNo}
            </Text>
          )}
          <Text className="text-sm text-gray-500 block">
            PIN: {record.pinCode || "N/A"}
          </Text>

          <Button
            type="default"
            size="small"
            onClick={() => {
              showCommentsModal(record);
            }}
            className="w-full sm:w-auto whitespace-nowrap rounded-md border border-blue-400 text-blue-600 hover:bg-blue-50 hover:border-blue-500 transition-colors text-xs px-2 py-1"
          >
            Comments
          </Button>
        </div>
      ),
      width: 200,
    },
    {
      title: "Items",
      key: "items",
      render: (record: Order) => (
        <div className="max-h-40 overflow-y-auto space-y-2">
          <div className="text-left">
            <Text className="text-sm text-gray-600">Grand Total: </Text>
            <Text strong className="text-lg text-green-600">
              ₹{record.grandTotal || 0}
            </Text>
          </div>
          {record.orderItems && record.orderItems.length > 0 ? (
            record.orderItems.map((item, index) => (
              <div key={index} className="border rounded p-2 bg-gray-50">
                <div className="flex items-start gap-2">
                  {item.itemUrl && (
                    <img
                      src={item.itemUrl}
                      alt={item.itemName || "Item"}
                      className="w-12 h-12 object-cover rounded flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      <ShoppingCartOutlined className="text-blue-500 text-xs" />
                      <Text strong className="text-xs truncate">
                        {item.itemName || "Unknown Item"}
                      </Text>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <Text className="text-xs">Qty: {item.quantity || 0}</Text>
                      <Text className="text-xs">
                        Weight: {item.weight || 0} kg
                      </Text>
                      <Text className="text-xs">Price: ₹{item.price || 0}</Text>
                      {/* <Text className="text-xs">
                        MRP: ₹{item.itemMrpPrice || 0}
                      </Text> */}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Text className="text-xs text-gray-500">No items</Text>
          )}
        </div>
      ),
      width: 280,
    },
    {
      title: "Order Details",
      key: "orderDetails",
      render: (record: Order) => (
        <div className="space-y-3">
          <div className="text-left">
            <Tag
              color={getOrderStatusColor(record.orderStatus)}
              className="mt-1"
            >
              {getOrderStatusText(record.orderStatus)}
            </Tag>
          </div>

          <div className="text-left">
            <Tag
              color={record.paymentType === 2 ? "green" : "orange"}
              className="mt-1"
            >
              {getPaymentTypeText(record.paymentType)}
            </Tag>
          </div>

          {/* <div className="text-left">
            <Text className="text-sm text-gray-600">Ordered :</Text>
            <strong className="text-sm">
              {record.orderedDate
                ? dayjs(record.orderedDate).format("D MMMM YYYY")
                : "N/A"}
            </strong>
          </div> */}

          <div className="text-left">
            <Text className="text-sm text-gray-600">Delivery :</Text>
            <strong className="text-sm">
              {record.deliveryDate
                ? dayjs(record.deliveryDate).format("D MMMM YYYY")
                : "N/A"}
            </strong>
          </div>
        </div>
      ),
      width: 180,
    },
  ];

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Card className="mb-4">
        <Title level={2} className="mb-4 text-center">
          Order Sales Dashboard
        </Title>

        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} sm={12} md={6}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range *
              </label>
              <RangePicker
                className="w-full"
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
                format="DD-MM-YYYY"
                placeholder={["Start Date", "End Date"]}
                size="middle"
              />
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pin Code *
              </label>
              <Input
                placeholder="Enter pin code"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className="w-full"
                size="middle"
              />
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg) *
              </label>
              <Input
                placeholder="Enter weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                type="number"
                className="w-full"
                size="middle"
              />
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div className="flex items-end h-full">
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={fetchOrders}
                loading={loading}
                className="w-full"
                size="middle"
              >
                Get Data
              </Button>
            </div>
          </Col>
        </Row>

        {orders.length > 0 && (
          <div className="mb-4">
            {isAdmin && (
              <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={8}>
                  <Card
                    style={{ background: lightColors.total, border: "none" }}
                  >
                    <Statistic
                      title={
                        <span style={{ color: "#00796b", fontWeight: "bold" }}>
                          Total Revenue
                        </span>
                      }
                      value={Math.round(stats.totalRevenue)}
                      formatter={(value) => formatCurrency(Number(value))}
                      prefix={<DollarOutlined style={{ color: "#00796b" }} />}
                      valueStyle={{ color: "#00796b", fontWeight: "bold" }}
                    />
                  </Card>
                </Col>

                <Col xs={24} sm={8}>
                  <Card style={{ background: lightColors.cod, border: "none" }}>
                    <Statistic
                      title={
                        <span style={{ color: "#33691e", fontWeight: "bold" }}>
                          COD Revenue
                        </span>
                      }
                      value={Math.round(stats.paymentRevenue.COD)}
                      formatter={(value) => formatCurrency(Number(value))}
                      prefix={
                        <CreditCardOutlined style={{ color: "#33691e" }} />
                      }
                      valueStyle={{ color: "#33691e", fontWeight: "bold" }}
                    />
                  </Card>
                </Col>

                <Col xs={24} sm={8}>
                  <Card
                    style={{ background: lightColors.online, border: "none" }}
                  >
                    <Statistic
                      title={
                        <span style={{ color: "#880e4f", fontWeight: "bold" }}>
                          Online Revenue
                        </span>
                      }
                      value={Math.round(stats.paymentRevenue.Online)}
                      formatter={(value) => formatCurrency(Number(value))}
                      prefix={
                        <CreditCardOutlined style={{ color: "#880e4f" }} />
                      }
                      valueStyle={{ color: "#880e4f", fontWeight: "bold" }}
                    />
                  </Card>
                </Col>
              </Row>
            )}
          </div>
        )}
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="orderId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            responsive: true,
          }}
          scroll={{ x: 1000, y: 600 }}
          className="bg-white"
          size="small"
        />
      </Card>

      <HelpDeskCommentsModal
        open={commentsModalVisible}
        onClose={() => setCommentsModalVisible(false)}
        userId={selectedUserId}
        updatedBy={localStorage.getItem("admin_userName")?.toUpperCase() || ""}
        storedUniqueId={localStorage.getItem("admin_uniquId") || ""}
        record={""}
        BASE_URL={BASE_URL}
      />
    </div>
  );
};

export default OrderSalesDashboard;
