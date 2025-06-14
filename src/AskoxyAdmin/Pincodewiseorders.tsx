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

const OrdersByPincode: React.FC = () => {
  const [data, setData] = useState<ApiResponse>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().subtract(3, "day"));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());
  const [selectedPincode, setSelectedPincode] = useState<string>("all");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [commentsModalVisible, setCommentsModalVisible] =
    useState<boolean>(false);

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
      render: (id: string) => (
        <Text className="font-mono text-lg font-bold">{id.slice(-4)}</Text>
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
          {/* <Button
            type="default"
            size="small"
            onClick={() => viewOrderDetails(record)}
            className="rounded-md border border-green-400 text-green-600 hover:bg-green-100"
          >
            Orders
          </Button> */}
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
      <div className="max-w-full mx-auto p-6">
        <Title level={2} className="text-gray-800 mb-6">
          Orders by Pincode
        </Title>

        {/* Date Selection and Pincode Filter */}
        <Card className="mb-6">
          <Row gutter={16} align="middle" justify="space-between">
            <Col>
              <Row gutter={16} align="middle">
                <Col>
                  <Text strong>Start Date:</Text>
                </Col>
                <Col>
                  <DatePicker
                    value={startDate}
                    onChange={(date) => date && setStartDate(date)}
                    format="YYYY-MM-DD"
                  />
                </Col>
                <Col>
                  <Text strong>End Date:</Text>
                </Col>
                <Col>
                  <DatePicker
                    value={endDate}
                    onChange={(date) => date && setEndDate(date)}
                    format="YYYY-MM-DD"
                  />
                </Col>
                <Col>
                  <Button type="primary" onClick={fetchData} loading={loading}>
                    Get Orders
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col>
              <Select
                value={selectedPincode}
                onChange={setSelectedPincode}
                style={{ width: 200 }}
                placeholder="Select Pincode"
              >
                <Option value="all">All Pincodes</Option>
                {sortedPincodes.map((pincode) => (
                  <Option key={pincode} value={pincode}>
                    {pincode} ({data[pincode]?.count || 0} orders)
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            className="mb-6"
            onClose={() => setError(null)}
          />
        )}

        {/* Orders Table */}
        <Card>
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={allOrders}
              pagination={{
                pageSize: 50,
                showSizeChanger: false,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} orders`,
              }}
              scroll={{ x: 1000 }}
              size="small"
            />
          </Spin>
        </Card>

        {allOrders.length === 0 && !loading && (
          <Card className="text-center py-8">
            <Text className="text-gray-500">
              No orders found for the selected date range
            </Text>
          </Card>
        )}
      </div>

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
