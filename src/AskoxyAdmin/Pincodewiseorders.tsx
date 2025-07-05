import React, { useState, useEffect } from "react";
import {
  Card,
  DatePicker,
  Button,
  Spin,
  Alert,
  Row,
  Col,
  Typography,
  Table,
  Tag,
  Select,
  Modal,
  Descriptions,
  List,
  Divider,
  message,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import BASE_URL from "../Config";
import HelpDeskCommentsModal from "./HelpDeskCommentsModal";

const { Title, Text } = Typography;
const { Option } = Select;

interface OrderDetail {
  orderId: string;
  userId: string;
  grandTotal: number;
  status: string;
  date: string;
  payment: number;
  userMobile: string;
}

interface PinCodeData {
  count: number;
  details: string[];
}

interface ApiResponse {
  [pinCode: string]: PinCodeData;
}

interface OrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  itemUnit: string;
  itemprice: number;
  price: number;
  weight: number;
}

interface OrderAddress {
  customerName: string;
  customerMobile: string;
  flatNo: string;
  landMark: string;
  pincode: number;
  address: string;
  latitude: number;
  longitude: number;
}

type OrderTimeline = {
  placedDate: string | null;
  acceptedDate: string | null;
  assignedDate: string | null;
  deliveredDate: string | null;
  canceledDate: string | null;
  rejectedDate: string | null;
  pickUpDate: string | null;
};

interface OrderHistoryResponse {
  orderId: string;
  placedDate: string | null;
  acceptedDate: string | null;
  assignedDate: string | null;
  deliveredDate: string | null;
  canceledDate: string | null;
  rejectedDate: string | null;
  pickUpDate: string | null;
}

interface OrderDetailsResponse {
  orderId: string;
  orderStatus: string;
  uniqueId: string;
  mobileNumber: string;
  customerMobile: string;
  customerId: string;
  subTotal: number;
  grandTotal: number;
  deliveryFee: number;
  paymentType: number;
  orderDate: string;
  customerName: string;
  orderAddress: OrderAddress;
  orderHistoryResponse: OrderHistoryResponse[];
  gstAmount: number;
  discountAmount: number;
  deliveryBoyId: string;
  deliveryBoyMobile: string;
  deliveryBoyName: string;
  orderItems: OrderItem[];
  timeSlot: string;
  dayOfWeek: string;
  expectedDeliveryDate: string;
}

const OrdersByPincode: React.FC = () => {
  const [data, setData] = useState<ApiResponse>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());
  const [selectedPincode, setSelectedPincode] = useState<string>("all");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [commentsModalVisible, setCommentsModalVisible] =
    useState<boolean>(false);

  // Order Details Modal State
  const [orderDetailsModalVisible, setOrderDetailsModalVisible] =
    useState<boolean>(false);
  const [orderDetailsLoading, setOrderDetailsLoading] =
    useState<boolean>(false);
  const [loadingOrderId, setLoadingOrderId] = useState<string>("");
  const [orderDetails, setOrderDetails] = useState<OrderDetailsResponse | null>(
    null
  );

  const parseOrderDetail = (detail: string): OrderDetail => {
    const parts = detail.split(", ");
    const orderId = parts[0]?.replace("Order ID: ", "") || "";
    const userId = parts[1]?.replace("User ID: ", "") || "";
    const grandTotal = parseFloat(
      parts[2]?.replace("Grand Total: ", "") || "0"
    );
    const status = parts[3]?.replace("Status: ", "") || "";
    const date = parts[4]?.replace("Date: ", "") || "";
    const payment = parseInt(parts[5]?.replace("Payment: ", "") || "0");
    const userMobile = parts[6]?.replace("User Mobile: ", "") || "";

    return { orderId, userId, grandTotal, status, date, payment, userMobile };
  };

  const getStatusText = (status: string): string => {
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
        return status;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "1":
        return "blue";
      case "2":
        return "orange";
      case "3":
        return "purple";
      case "4":
        return "green";
      case "5":
        return "red";
      case "PickedUp":
        return "cyan";
      default:
        return "default";
    }
  };

  const roundAmount = (amount: number): number => {
    const decimal = amount - Math.floor(amount);
    if (decimal > 0.5) {
      return Math.ceil(amount);
    }
    return Math.floor(amount);
  };

  const fetchOrderDetails = async (orderId: string, orderStatus: string) => {
    setOrderDetailsLoading(true);
    setLoadingOrderId(orderId);

    try {
      const response = await fetch(`${BASE_URL}/order-service/assignedOrders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderId,
          orderStatus: orderStatus,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Assuming the API returns an array and we need the first item
      if (Array.isArray(result) && result.length > 0) {
        setOrderDetails(result[0]);
      } else {
        setOrderDetails(result);
      }

      setOrderDetailsModalVisible(true);
    } catch (err) {
      message.error(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching order details"
      );
    } finally {
      setOrderDetailsLoading(false);
      setLoadingOrderId("");
    }
  };

  const fetchData = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    setError(null);

    try {
      const startDateStr = startDate.format("YYYY-MM-DD");
      const endDateStr = endDate.format("YYYY-MM-DD");

      const response = await fetch(
        `${BASE_URL}/order-service/report_all_pinCode_data?startDate=${startDateStr}&endDate=${endDateStr}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawResult: ApiResponse = await response.json();

      const filteredResult: ApiResponse = Object.entries(rawResult).reduce(
        (acc, [pincode, value]) => {
          const filteredDetails = value.details.filter(
            (detail) => !detail.includes("Status: 5")
          );

          if (filteredDetails.length > 0) {
            acc[pincode] = {
              count: filteredDetails.length,
              details: filteredDetails,
            };
          }

          return acc;
        },
        {} as ApiResponse
      );

      setData(filteredResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching data"
      );
    } finally {
      setLoading(false);
    }
  };
  const extractOrderTimeline = (
    orderHistoryResponse: OrderHistoryResponse[]
  ): OrderTimeline => {
    const timeline: OrderTimeline = {
      placedDate: null,
      acceptedDate: null,
      assignedDate: null,
      deliveredDate: null,
      canceledDate: null,
      rejectedDate: null,
      pickUpDate: null,
    };

    if (!orderHistoryResponse || orderHistoryResponse.length === 0) {
      return timeline; // Return full object with nulls
    }

    orderHistoryResponse.forEach((history) => {
      if (history.placedDate && !timeline.placedDate) {
        timeline.placedDate = history.placedDate;
      }
      if (history.acceptedDate && !timeline.acceptedDate) {
        timeline.acceptedDate = history.acceptedDate;
      }
      if (history.assignedDate && !timeline.assignedDate) {
        timeline.assignedDate = history.assignedDate;
      }
      if (history.deliveredDate && !timeline.deliveredDate) {
        timeline.deliveredDate = history.deliveredDate;
      }
      if (history.canceledDate && !timeline.canceledDate) {
        timeline.canceledDate = history.canceledDate;
      }
      if (history.rejectedDate && !timeline.rejectedDate) {
        timeline.rejectedDate = history.rejectedDate;
      }
      if (history.pickUpDate && !timeline.pickUpDate) {
        timeline.pickUpDate = history.pickUpDate;
      }
    });

    return timeline;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sortedPincodes = Object.keys(data).sort((a, b) => a.localeCompare(b));

  const allOrders = Object.entries(data)
    .filter(
      ([pinCode]) => selectedPincode === "all" || pinCode === selectedPincode
    )
    .flatMap(([pinCode, pinData]) =>
      pinData.details.map((detail, index) => ({
        key: `${pinCode}-${index}`,
        pinCode,
        ...parseOrderDetail(detail),
      }))
    );

  const columns = [
    {
      title: "PIN Code",
      dataIndex: "pinCode",
      key: "pinCode",
      width: 100,
      sorter: (a: any, b: any) => a.pinCode.localeCompare(b.pinCode),
      render: (pinCode: string) => <Text strong>{pinCode}</Text>,
    },
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      width: 150,
      render: (orderId: string, record: any) => (
        <div className="flex items-center gap-3">
          <Text className="font-mono text-lg font-bold">
            {orderId?.slice(-4)}
          </Text>
          <Button
            type="primary"
            size="small"
            className="bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600 text-white font-medium px-4 py-1 rounded-md shadow-sm"
            loading={orderDetailsLoading && loadingOrderId === orderId}
            onClick={() => fetchOrderDetails(orderId, record.status)}
          >
            Orders
          </Button>
        </div>
      ),
    },
    {
      title: "Mobile",
      dataIndex: "userMobile",
      key: "userMobile",
      width: 120,
      render: (mobile: string) => mobile || "-",
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (record: OrderDetail) => (
        <div className="flex gap-2">
          <Button
            type="default"
            size="small"
            onClick={() => {
              setSelectedUserId(record.userId);
              setCommentsModalVisible(true);
            }}
            className="rounded-md border border-blue-400 text-blue-600 hover:bg-blue-100"
          >
            Comments
          </Button>
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "grandTotal",
      key: "grandTotal",
      width: 100,
      align: "right" as const,
      sorter: (a: any, b: any) => a.grandTotal - b.grandTotal,
      render: (amount: number) => <Text strong>₹{roundAmount(amount)}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center" as const,
      filters: [
        { text: "Placed", value: "1" },
        { text: "Accepted", value: "2" },
        { text: "Assigned", value: "3" },
        { text: "Delivered", value: "4" },
        { text: "Rejected", value: "5" },
        { text: "Picked Up", value: "PickedUp" },
      ],
      onFilter: (value: any, record: any) => record.status === value,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Payment",
      dataIndex: "payment",
      key: "payment",
      width: 100,
      align: "center" as const,
      filters: [
        { text: "COD", value: 1 },
        { text: "Online", value: 2 },
      ],
      onFilter: (value: any, record: any) => record.payment === value,
      render: (payment: number) => (
        <Tag color={payment === 2 ? "green" : "orange"}>
          {payment === 2 ? "Online" : payment === 1 ? "COD" : "Unknown"}
        </Tag>
      ),
    },
    {
      title: "Order Date",
      dataIndex: "date",
      key: "date",
      width: 150,
      sorter: (a: any, b: any) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      render: (date: string) => (
        <span className="text-sm">{dayjs(date).format("MMM DD YYYY")}</span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-full mx-auto p-3 sm:p-6">
        <Title
          level={2}
          className="text-gray-800 mb-4 sm:mb-6 text-xl sm:text-2xl"
        >
          Orders by Pincode
        </Title>

        {/* Date Selection and Pincode Filter */}
        <Card className="mb-4 sm:mb-6">
          <div className="space-y-4">
            {/* Date Controls Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-1">
                  <Text strong className="text-sm">
                    Start Date:
                  </Text>
                  <DatePicker
                    value={startDate}
                    onChange={(date) => date && setStartDate(date)}
                    format="DD-MM-YYYY"
                    size="small"
                    style={{ width: "auto" }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Text strong className="text-sm">
                    End Date:
                  </Text>
                  <DatePicker
                    value={endDate}
                    onChange={(date) => date && setEndDate(date)}
                    format="DD-MM-YYYY"
                    size="small"
                    style={{ width: "auto" }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Text strong className="text-sm opacity-0 select-none">
                  Action:
                </Text>
                <Button
                  type="primary"
                  onClick={fetchData}
                  loading={loading}
                  size="small"
                  className="w-full sm:w-auto rounded-lg sm:min-w-[120px]"
                >
                  Get Orders
                </Button>
              </div>
            </div>

            {/* Pincode Filter Row */}
            <div className="flex flex-col gap-1">
              <Text strong className="text-sm">
                Select Pincode:
              </Text>
              <div className="inline-block">
                <Select
                  value={selectedPincode}
                  onChange={setSelectedPincode}
                  placeholder="Select Pincode"
                  size="small"
                  style={{ width: "auto", minWidth: "150px" }}
                >
                  <Option value="all">All Pincodes</Option>
                  {sortedPincodes.map((pincode) => (
                    <Option key={pincode} value={pincode}>
                      <span className="block sm:inline">
                        {pincode} ({data[pincode]?.count || 0} orders)
                      </span>
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            className="mb-4 sm:mb-6"
            onClose={() => setError(null)}
          />
        )}

        <Card>
          <Spin spinning={loading}>
            <div className="overflow-x-auto">
              <Table
                columns={columns}
                dataSource={allOrders}
                pagination={{
                  pageSize: 50,
                  showSizeChanger: false,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} orders`,
                  size: "small",
                  responsive: true,
                }}
                scroll={{
                  x: "max-content",
                  scrollToFirstRowOnChange: true,
                }}
                size="small"
                className="min-w-0"
              />
            </div>
          </Spin>
        </Card>

        {allOrders.length === 0 && !loading && (
          <Card className="text-center py-6 sm:py-8">
            <Text className="text-gray-500 text-sm sm:text-base">
              No orders found for the selected date range
            </Text>
          </Card>
        )}
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-50 to-green-50 p-3 sm:p-4 -m-4 sm:-m-6 mb-3 sm:mb-4">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
            <Text className="text-base sm:text-lg font-bold text-gray-800">
              Order Details - #{orderDetails?.uniqueId || ""}
            </Text>
          </div>
        }
        open={orderDetailsModalVisible}
        onCancel={() => setOrderDetailsModalVisible(false)}
        footer={null}
        width="90vw"
        className="custom-modal max-w-4xl"
        style={{ top: 10 }}
        bodyStyle={{ maxHeight: "80vh", overflowY: "auto", padding: "16px" }}
      >
        {orderDetails && (
          <div className="space-y-4 sm:space-y-6">
            {/* Customer & Order Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-lg border border-blue-200">
              <Title
                level={5}
                className="text-blue-800 mb-2 sm:mb-3 text-sm sm:text-base"
              >
                Customer & Order Information
              </Title>
              <Descriptions
                bordered
                size="small"
                column={{ xs: 1, sm: 2 }}
                className="bg-white text-xs sm:text-sm"
              >
                <Descriptions.Item
                  label={
                    <Text strong className="text-blue-700">
                      Order ID
                    </Text>
                  }
                  span={2}
                >
                  <Text className="font-bold text-gray-800">
                    {orderDetails.orderId.slice(-4)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Text strong className="text-blue-700">
                      Customer Name
                    </Text>
                  }
                >
                  <Text className="text-green-700 font-medium">
                    {orderDetails.customerName}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Text strong className="text-blue-700">
                      Mobile
                    </Text>
                  }
                >
                  <Text className="text-gray-700">
                    {orderDetails.customerMobile}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Text strong className="text-blue-700">
                      Order Status
                    </Text>
                  }
                >
                  <Tag
                    color={getStatusColor(orderDetails.orderStatus)}
                    className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium"
                  >
                    {getStatusText(orderDetails.orderStatus)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Text strong className="text-blue-700">
                      Payment Type
                    </Text>
                  }
                >
                  <Tag
                    color={orderDetails.paymentType === 2 ? "green" : "orange"}
                    className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium"
                  >
                    {orderDetails.paymentType === 2
                      ? "Online Payment"
                      : "Cash on Delivery"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Text strong className="text-blue-700">
                      Order Date
                    </Text>
                  }
                >
                  <Text className="text-gray-700">
                    {dayjs(orderDetails.orderDate).format(
                      "DD MMM YYYY, hh:mm A"
                    )}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Text strong className="text-blue-700">
                      Expected Delivery
                    </Text>
                  }
                >
                  <Text className="text-orange-600 font-medium">
                    {orderDetails.expectedDeliveryDate}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Text strong className="text-blue-700">
                      Time Slot
                    </Text>
                  }
                >
                  <Text className="text-gray-700">{orderDetails.timeSlot}</Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Text strong className="text-blue-700">
                      Day
                    </Text>
                  }
                >
                  <Text className="text-gray-700">
                    {orderDetails.dayOfWeek}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* Financial Details */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 sm:p-4 rounded-lg border border-green-200">
              <Title
                level={5}
                className="text-green-800 mb-2 sm:mb-3 text-sm sm:text-base"
              >
                Financial Summary
              </Title>
              <Descriptions
                bordered
                size="small"
                column={{ xs: 1, sm: 2 }}
                className="bg-white text-xs sm:text-sm"
              >
                <Descriptions.Item
                  label={
                    <Text strong className="text-green-700">
                      Sub Total
                    </Text>
                  }
                >
                  <Text className="text-gray-700">
                    ₹{roundAmount(orderDetails.subTotal)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Text strong className="text-green-700">
                      Delivery Fee
                    </Text>
                  }
                >
                  <Text className="text-gray-700">
                    ₹{roundAmount(orderDetails.deliveryFee)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Text strong className="text-green-700">
                      Discount
                    </Text>
                  }
                >
                  <Text className="text-red-600 font-medium">
                    -₹{roundAmount(orderDetails.discountAmount)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Text strong className="text-green-700">
                      Grand Total
                    </Text>
                  }
                >
                  <Text className="text-base sm:text-lg font-bold text-green-600">
                    ₹{roundAmount(orderDetails.grandTotal)}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* Delivery Address */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 sm:p-4 rounded-lg border border-purple-200">
              <Title
                level={5}
                className="text-purple-800 mb-2 sm:mb-3 text-sm sm:text-base"
              >
                Delivery Address
              </Title>
              <Descriptions
                bordered
                size="small"
                column={1}
                className="bg-white text-xs sm:text-sm"
              >
                <Descriptions.Item
                  label={
                    <Text strong className="text-purple-700">
                      Address
                    </Text>
                  }
                >
                  <Text className="text-gray-700">
                    {orderDetails.orderAddress?.flatNo &&
                      `${orderDetails.orderAddress.flatNo}, `}
                    {orderDetails.orderAddress?.address}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Text strong className="text-purple-700">
                      Landmark
                    </Text>
                  }
                >
                  <Text className="text-gray-700">
                    {orderDetails.orderAddress?.landMark || "-"}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Text strong className="text-purple-700">
                      Pincode
                    </Text>
                  }
                >
                  <Text className="text-gray-700 font-medium">
                    {orderDetails.orderAddress?.pincode}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* Delivery Boy Details */}
            {orderDetails.deliveryBoyName && (
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-3 sm:p-4 rounded-lg border border-cyan-200">
                <Title
                  level={5}
                  className="text-cyan-800 mb-2 sm:mb-3 text-sm sm:text-base"
                >
                  Delivery Executive
                </Title>
                <Descriptions
                  bordered
                  size="small"
                  column={{ xs: 1, sm: 2 }}
                  className="bg-white text-xs sm:text-sm"
                >
                  <Descriptions.Item
                    label={
                      <Text strong className="text-cyan-700">
                        Name
                      </Text>
                    }
                  >
                    <Text className="text-gray-700 font-medium">
                      {orderDetails.deliveryBoyName}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <Text strong className="text-cyan-700">
                        Mobile
                      </Text>
                    }
                  >
                    <Text className="text-gray-700">
                      {orderDetails.deliveryBoyMobile}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 sm:p-4 rounded-lg border border-amber-200">
              <Title
                level={5}
                className="text-amber-800 mb-2 sm:mb-3 text-sm sm:text-base"
              >
                Order Items
              </Title>
              <List
                bordered
                className="bg-white"
                dataSource={orderDetails.orderItems || []}
                renderItem={(item: OrderItem, index: number) => (
                  <List.Item
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <div className="w-full">
                      <Row
                        justify="space-between"
                        align="middle"
                        className="flex-col sm:flex-row"
                      >
                        <Col xs={24} sm={12}>
                          <Text strong className="text-gray-800">
                            {item.itemName}
                          </Text>
                          <br />
                          <Text type="secondary" className="text-xs sm:text-sm">
                            Weight: {item.weight} {item.itemUnit}
                          </Text>
                        </Col>
                        <Col
                          xs={24}
                          sm={4}
                          className="text-center mt-2 sm:mt-0"
                        >
                          <div className="bg-blue-100 px-2 py-1 rounded">
                            <Text className="text-blue-700 font-medium text-xs sm:text-sm">
                              Qty: {item.quantity}
                            </Text>
                          </div>
                        </Col>
                        <Col
                          xs={24}
                          sm={4}
                          className="text-center mt-2 sm:mt-0"
                        >
                          <Text className="text-gray-600 text-xs sm:text-sm">
                            ₹{roundAmount(item.itemprice)}
                          </Text>
                        </Col>
                        <Col xs={24} sm={4} className="text-right mt-2 sm:mt-0">
                          <Text className="text-green-600 font-bold text-base sm:text-lg">
                            ₹{roundAmount(item.price)}
                          </Text>
                        </Col>
                      </Row>
                    </div>
                  </List.Item>
                )}
              />
            </div>

            {/* Order History */}
            {orderDetails.orderHistoryResponse &&
              orderDetails.orderHistoryResponse.length > 0 && (
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                  <Title
                    level={5}
                    className="text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base"
                  >
                    Order Timeline
                  </Title>
                  <Descriptions
                    bordered
                    size="small"
                    column={1}
                    className="bg-white text-xs sm:text-sm"
                  >
                    {(() => {
                      const timeline = extractOrderTimeline(
                        orderDetails.orderHistoryResponse
                      );
                      return (
                        <>
                          {timeline?.placedDate && (
                            <Descriptions.Item
                              label={
                                <Text strong className="text-blue-700">
                                  Placed Date
                                </Text>
                              }
                            >
                              <Text className="text-gray-700">
                                {dayjs(timeline.placedDate).format(
                                  "DD MMM YYYY, hh:mm A"
                                )}
                              </Text>
                            </Descriptions.Item>
                          )}
                          {timeline?.acceptedDate && (
                            <Descriptions.Item
                              label={
                                <Text strong className="text-orange-700">
                                  Accepted Date
                                </Text>
                              }
                            >
                              <Text className="text-gray-700">
                                {dayjs(timeline.acceptedDate).format(
                                  "DD MMM YYYY, hh:mm A"
                                )}
                              </Text>
                            </Descriptions.Item>
                          )}
                          {timeline?.assignedDate && (
                            <Descriptions.Item
                              label={
                                <Text strong className="text-purple-700">
                                  Assigned Date
                                </Text>
                              }
                            >
                              <Text className="text-gray-700">
                                {dayjs(timeline.assignedDate).format(
                                  "DD MMM YYYY, hh:mm A"
                                )}
                              </Text>
                            </Descriptions.Item>
                          )}
                          {timeline?.pickUpDate && (
                            <Descriptions.Item
                              label={
                                <Text strong className="text-cyan-700">
                                  Picked Up Date
                                </Text>
                              }
                            >
                              <Text className="text-gray-700">
                                {dayjs(timeline.pickUpDate).format(
                                  "DD MMM YYYY, hh:mm A"
                                )}
                              </Text>
                            </Descriptions.Item>
                          )}
                          {timeline?.deliveredDate && (
                            <Descriptions.Item
                              label={
                                <Text strong className="text-green-700">
                                  Delivered Date
                                </Text>
                              }
                            >
                              <Text className="text-gray-700">
                                {dayjs(timeline.deliveredDate).format(
                                  "DD MMM YYYY, hh:mm A"
                                )}
                              </Text>
                            </Descriptions.Item>
                          )}
                          {timeline?.canceledDate && (
                            <Descriptions.Item
                              label={
                                <Text strong className="text-red-700">
                                  Canceled Date
                                </Text>
                              }
                            >
                              <Text className="text-gray-700">
                                {dayjs(timeline.canceledDate).format(
                                  "DD MMM YYYY, hh:mm A"
                                )}
                              </Text>
                            </Descriptions.Item>
                          )}
                          {timeline?.rejectedDate && (
                            <Descriptions.Item
                              label={
                                <Text strong className="text-red-700">
                                  Rejected Date
                                </Text>
                              }
                            >
                              <Text className="text-gray-700">
                                {dayjs(timeline.rejectedDate).format(
                                  "DD MMM YYYY, hh:mm A"
                                )}
                              </Text>
                            </Descriptions.Item>
                          )}
                        </>
                      );
                    })()}
                  </Descriptions>
                </div>
              )}
          </div>
        )}
      </Modal>

      <HelpDeskCommentsModal
        open={commentsModalVisible}
        onClose={() => setCommentsModalVisible(false)}
        userId={selectedUserId}
        updatedBy={localStorage.getItem("userName")?.toUpperCase()}
        storedUniqueId={localStorage.getItem("uniquId")}
        record={""}
        BASE_URL={BASE_URL}
      />
    </div>
  );
};

export default OrdersByPincode;
