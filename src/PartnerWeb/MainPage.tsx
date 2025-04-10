import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  Select,
  Table,
  Typography,
  Tag,
  Row,
  Col,
  Form,
  Spin,
  Button,
  Input,
  Modal,
  message,
  Radio,
  Space,
  Empty,
} from "antd";
import { ColumnsType } from "antd/es/table";
import {
  ExclamationCircleOutlined,
  FileTextOutlined,
  LoadingOutlined,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { CircleAlert, CheckCircle2, Truck } from "lucide-react";
import BASE_URL from "../Config";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

type OrderData = {
  orderId: string;
  uniqueId: string;
  orderStatus: string;
  orderDate: string;
  timeSlot: string;
  expectedDeliveryDate: string;
  orderAddress: Address;
  testUser: boolean;
  address?: string;
  clusterId: string;
  distance: string;
};

type DeliveryBoy = {
  userId: string;
  firstName: string;
  lastName: string;
  whatsappNumber: string;
  isActive: string;
  testUser: boolean;
};

type Address = {
  flatNo: string;
  address: string;
  landMark: string;
  pincode: number;
  customerId: string;
};

type SummaryData = {
  name: string;
  count: number;
  status: string;
};

const { Text } = Typography;
const { TextArea } = Input;

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [summaryData, setSummaryData] = useState<SummaryData[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderData[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 50 });
  const [searchValue, setSearchValue] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [rejectForm] = Form.useForm();
  const accessToken = JSON.parse(localStorage.getItem("Token") || "{}");
  const [selectedRecord, setSelectedRecord] = useState<OrderData | null>(null);
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [dbModalVisible, setdbModalVisible] = useState(false);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] =
    useState<DeliveryBoy | null>();
  const [dbLoading, setdbLoading] = useState<boolean>(false);
  const [dbLoading1, setdbLoading1] = useState<boolean>(false);
  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const STATUS_COLORS = {
    "1": {
      gradient: "from-blue-400 to-blue-500",
      background: "linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%)",
      borderColor: "#3b82f6",
      icon: <CircleAlert className="text-xl text-white" />,
      label: "New Orders",
    },
    "2": {
      gradient: "from-green-400 to-green-500",
      background: "linear-gradient(135deg, #6ee7b7 0%, #60a5fa 100%)",
      borderColor: "#10b981",
      icon: <CheckCircle2 className="text-xl text-white" />,
      label: "Accepted Orders",
    },
    "3": {
      gradient: "from-orange-400 to-orange-500",
      background: "linear-gradient(135deg, #a855f7    0%, #d946ef        80%)",
      borderColor: "#a855f7",
      icon: <Truck className="text-xl text-white" />,
      label: "Assigned Orders",
    },
  };

  const fetchOrders = async (status: string): Promise<OrderData[]> => {
    try {
      const response = await axios.get<OrderData[]>(
        `${BASE_URL}/order-service/getAllOrdersBasedOnStatus?orderStatus=${status}`
      );
      return (
        response.data
          // .filter((order) => !order.testUser)
          .map((order) => ({
            ...order,
            address: order.orderAddress
              ? `${order.orderAddress.flatNo}, ${order.orderAddress.address}, ${order.orderAddress.landMark}, ${order.orderAddress.pincode}`
              : "No Address Available",
          }))
      );
    } catch (error) {
      console.error(`Error fetching orders with status ${status}:`, error);
      return [];
    }
  };
  const fetchData = async () => {
    setLoading(true);
    const newOrders = await fetchOrders("1");
    const acceptedOrders = await fetchOrders("2");
    const assignedOrders = await fetchOrders("3");

    const summaryData = [
      { name: "New Orders", count: newOrders.length, status: "1" },
      { name: "Accepted Orders", count: acceptedOrders.length, status: "2" },
      { name: "Assigned Orders", count: assignedOrders.length, status: "3" },
    ];

    setSummaryData(summaryData);
    setOrderDetails([...newOrders, ...acceptedOrders, ...assignedOrders]);
    setFilteredOrders([...newOrders, ...acceptedOrders, ...assignedOrders]);
    setLoading(false);
  };
  // Data Fetching Effect
  useEffect(() => {
    fetchData();
    handleLogin();
  }, []);

  const handleLogin = () => {
    const accessToken = localStorage.getItem("Token");
    if (!accessToken) {
      navigate("/partnerLogin");
    }
  };

  const handleStatusFilter = (value: string | null) => {
    setSelectedStatus(value);
    if (value === null) {
      setFilteredOrders(orderDetails);
    } else {
      const filtered = orderDetails.filter(
        (order) => order.orderStatus === value
      );
      setFilteredOrders(filtered);
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "1":
        return "processing";
      case "2":
        return "green";
      case "3":
        return "purple";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "1":
        return "placed";
      case "2":
        return "Accepted";
      case "3":
        return "assigned";
      default:
        return "Unknown";
    }
  };

  const handleViewDetails = (order: OrderData) => {
    localStorage.setItem("orderId", order.orderId);
    navigate(`/home/orderDetails`);
  };

  const showRejectConfirmation = (record: OrderData) => {
    Modal.confirm({
      title: "Are you sure you want to reject this order?",
      icon: <ExclamationCircleOutlined />,
      // content: "This action cannot be undone.",
      okText: "Yes, Reject",
      okButtonProps: { danger: true },
      cancelText: "No, Cancel",
      onOk() {
        setSelectedRecord(record);
        setIsModalVisible(true);
      },
    });
  };

  // Handle final rejection submission
  const handleFinalReject = async () => {
    try {
      await rejectForm.validateFields();
      const rejectReason = rejectForm.getFieldValue("rejectReason");
      const userId = selectedRecord?.orderAddress?.customerId;
      setConfirmLoading(true);
      const response = await axios.post(
        `${BASE_URL}/order-service/reject_orders`,
        {
          orderId: selectedRecord?.orderId,
          cancelReason: rejectReason,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken.token}`,
          },
        }
      );

      if (response.data.status) {
        message.success("Order rejected successfully");
        setIsModalVisible(false);
        fetchData();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      // Handle API or validation errors
      console.error("Rejection error:", error);
      message.error("Failed to reject order. Please try again.");
    } finally {
      setConfirmLoading(false);
      setIsModalVisible(false);
      rejectForm.resetFields();
    }
  };

  const handleAssign = async (orderId: string, orderStatus: string) => {
    if (!selectedDeliveryBoy) {
      message.warning("Please select a delivery boy.");
      return;
    }
    setdbLoading(true);
    let data =
      orderStatus === "2" || orderStatus === "1"
        ? { orderId: orderId, deliveryBoyId: selectedDeliveryBoy.userId }
        : { orderId: orderId, deliverBoyId: selectedDeliveryBoy.userId };

    let apiUrl =
      orderStatus === "2" || orderStatus === "1"
        ? `${BASE_URL}/order-service/orderIdAndDbId`
        : `${BASE_URL}/order-service/reassignOrderToDb`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        message.error("Failed to assign to delveryboy");
      } else {
        message.success("Order assigned successfully!");
        setdbModalVisible(false);
        fetchData();
      }
    } catch (error) {
      // console.error("Error assigning order:", error);
      message.error("Failed to assign order.");
    } finally {
      setdbLoading(false);
      setdbModalVisible(false);
      setSelectedDeliveryBoy(null);
    }
  };

  const RejectionReasonModal = ({ visible }: { visible: boolean }) => (
    <Modal
      title="Provide Rejection Reason"
      visible={visible}
      onOk={() => handleFinalReject()}
      onCancel={() => setIsModalVisible(false)}
      confirmLoading={confirmLoading}
    >
      <Form form={rejectForm} layout="vertical">
        <Form.Item
          name="rejectReason"
          label="Rejection Reason"
          rules={[
            {
              required: true,
              message: "Please provide a reason for rejection",
            },
            {
              min: 6,
              message: "Reason must be at least 6 characters long",
            },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Please provide a detailed reason for rejecting this order"
          />
        </Form.Item>
      </Form>
    </Modal>
  );

  const fetchDeliveryBoys = async (record: OrderData) => {
    setSelectedRecord(record);
    setdbLoading1(true);
    try {
      const url = `${BASE_URL}/user-service/deliveryBoyList`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        message.error(
          "Failed to get DilveryBoy list please try after sometime."
        );
      }
      const data = await response.json();
      setDeliveryBoys(data);
      setdbModalVisible(true);
    } catch (error) {
      message.warning(
        "Failed to get DilveryBoy list please try after sometime."
      );
    } finally {
      setdbLoading1(false);
    }
  };

  const getButtonClasses = () =>
    "relative overflow-hidden transition-all duration-300 ease-in-out w-10 md:w-auto px-2 flex justify-center items-center";

  const getActionButtons = (status: string, record: OrderData) => {
    const buttonClasses =
      "relative overflow-hidden transition-all duration-300 ease-in-out w-10 md:w-auto px-2 flex justify-center items-center";

    switch (status) {
      case "1":
      case "2":
        return (
          <>
            <div className="group relative">
              <Button
                type="primary"
                className={`bg-blue-500 hover:bg-blue-600 ${buttonClasses}`}
                onClick={() => fetchDeliveryBoys(record)}
              >
                <div className="flex items-center">
                  <span className="group-hover:hidden">A</span>
                  <span className="hidden group-hover:block">Assign</span>
                </div>
              </Button>
            </div>

            <div className="group relative">
              <Button
                danger
                className={`hover:bg-red-600 ${buttonClasses}`}
                onClick={() => showRejectConfirmation(record)}
              >
                <div className="flex items-center">
                  <span className="group-hover:hidden">R</span>
                  <span className="hidden group-hover:block">Reject</span>
                </div>
              </Button>
            </div>
          </>
        );

      case "3":
        return (
          <>
            <div className="group relative">
              <Button
                type="primary"
                className={`bg-green-500 hover:bg-green-600 ${buttonClasses}`}
                onClick={() => fetchDeliveryBoys(record)}
              >
                <div className="flex items-center">
                  <span className="group-hover:hidden">RA</span>
                  <span className="hidden group-hover:block">Re-assign</span>
                </div>
              </Button>
            </div>

            <div className="group relative">
              <Button
                danger
                className={`hover:bg-red-600 ${buttonClasses}`}
                onClick={() => showRejectConfirmation(record)}
              >
                <div className="flex items-center">
                  <span className="group-hover:hidden">R</span>
                  <span className="hidden group-hover:block">Reject</span>
                </div>
              </Button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const columns: ColumnsType<OrderData> = [
    {
      title: "S.No",
      dataIndex: "index",
      key: "index",
      // width: 50,
      sorter: (a, b) => a.orderId.localeCompare(b.orderId), // Sorting based on orderId
      render: (_text, _record, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Order ID",
      dataIndex: "uniqueId",
      key: "uniqueId",
      // width: 100,
      sorter: (a, b) => a.uniqueId.localeCompare(b.uniqueId), // Sorting by Order ID
      render: (text: string, record: OrderData) => (
        <div>
          <Typography.Text className="text-lg font-semibold">
            #{text}
          </Typography.Text>
          <div className="flex items-center gap-2 mt-1">
            <Tag color={getStatusColor(record.orderStatus)}>
              {getStatusText(record.orderStatus)}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Order Address",
      dataIndex: "orderAddress",
      key: "orderAddress",
      // width: 180,
      sorter: (a, b) =>
        (a.orderAddress?.address || "").localeCompare(
          b.orderAddress?.address || ""
        ),
      render: (_text, record: OrderData) => (
        <Typography.Text>
          {record.orderAddress?.address || "N/A"}
        </Typography.Text>
      ),
    },
    {
      title: "Order Pincode",
      key: "orderPincode",
      // width: 100,
      sorter: (a, b) =>
        (a.orderAddress?.pincode || 0) - (b.orderAddress?.pincode || 0),
      render: (record: OrderData) => (
        <div className="flex items-center gap-2 mt-1">
          {record.orderAddress?.pincode ? (
            <Typography.Text>{record.orderAddress.pincode}</Typography.Text>
          ) : (
            <Typography.Text className="text-gray-500">N/A</Typography.Text>
          )}
        </div>
      ),
    },
    {
      title: "Order Date",
      key: "datetime",
      // width: 90,
      sorter: (a: OrderData, b: OrderData) =>
        new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(),
      render: (record: OrderData) => (
        <div className="whitespace-nowrap">
          <Typography.Text>
            {record.orderDate
              ? new Date(record.orderDate).toLocaleDateString()
              : "N/A"}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Expected Delivery",
      dataIndex: "expectedDeliveryDate",
      key: "expectedDeliveryDate",
      render: (_: string, record: OrderData) => {
        if (!record.expectedDeliveryDate || !record.timeSlot) {
          return "N/A";
        }
        return `${record.expectedDeliveryDate} (${record.timeSlot})`;
      },
      sorter: (a: OrderData, b: OrderData) =>
        new Date(a.expectedDeliveryDate || "").getTime() -
        new Date(b.expectedDeliveryDate || "").getTime(),
    },
    {
      title: "clusterId distance",
      key: "clusterId",
      // width: 100,
      sorter: (a, b) =>
        (a.orderAddress?.pincode || 0) - (b.orderAddress?.pincode || 0),
      render: (record: OrderData) => (
        <div className="flex items-center gap-2 mt-1">
          {record.clusterId ? (
            <>
              <Typography.Text>{record.clusterId}</Typography.Text>
              {/* <br /> */}
              <Typography.Text>{record.distance}</Typography.Text>
            </>
          ) : (
            <Typography.Text className="text-gray-500">N/A</Typography.Text>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "orderStatus",
      key: "orderStatus",
      width: 180,
      sorter: (a, b) => a.orderStatus.localeCompare(b.orderStatus),
      render: (text: string, record: OrderData) => {
        return (
          <div className="flex items-center gap-2">
            {getActionButtons(text, record)}

            <div className="group relative">
              <Button
                type="primary"
                className="w-16 md:w-auto px-2 bg-purple-500 hover:bg-gray-700 transition-all duration-300 flex items-center"
                onClick={() => handleViewDetails(record)}
              >
                <div className="flex items-center">
                  <span className="group-hover:hidden">View</span>
                  <span className="hidden group-hover:block">ViewDetails</span>
                </div>
              </Button>
            </div>
          </div>
        );
      },
    },
  ];

  const handleCancelCLick = () => {
    setdbModalVisible(false);
    setSelectedDeliveryBoy(null);
  };

  return (
    <div className="pt-4">
      <Row gutter={[16, 16]}>
        {/* Total Orders and Pie Chart Section */}
        <Col xs={24} md={24} lg={24} className="flex flex-col md:flex-row">
          {/* Total Orders Card */}
          <div className="w-full md:w-2/5 md:pr-4 mb-4 md:mb-0">
            <Card
              bodyStyle={{
                background: "linear-gradient(135deg, #67297c 0%, #0d9488 100%)",
                borderLeft: "3px solid #6366f1",
                color: "white",
              }}
              className="h-full"
            >
              <div className="flex justify-between items-center">
                <div>
                  <Text
                    strong
                    className="text-lg tracking-wide"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    Total Orders
                  </Text>
                  <div
                    className="text-3xl font-bold"
                    style={{ color: "white" }}
                  >
                    {summaryData.reduce((sum, item) => sum + item.count, 0)}
                  </div>
                </div>
                <FileTextOutlined className="text-3xl text-white opacity-50" />
              </div>
            </Card>
          </div>
          <div className="w-full md:w-3/5">
            <Card title="Order Status Distribution">
              {loading ? (
                <div className="flex justify-center items-center h-52">
                  <Spin size="large" />
                  {/* <Spin
                    indicator={<SyncOutlined style={{ fontSize: 24 }} spin />}
                  /> */}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={summaryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {summaryData.map((entry, index) => {
                        const statusConfig =
                          STATUS_COLORS[
                            entry.status as keyof typeof STATUS_COLORS
                          ];
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={statusConfig.borderColor}
                          />
                        );
                      })}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>
        </Col>

        <Col
          xs={24}
          md={24}
          lg={24}
          className="flex flex-col md:flex-row gap-4"
        >
          {summaryData.map((item) => {
            const statusConfig =
              STATUS_COLORS[item.status as keyof typeof STATUS_COLORS];
            return (
              <div
                key={item.status}
                className="w-full md:w-1/3 mb-4 md:mb-0 cursor-pointer"
                role="button"
                onClick={() => handleStatusFilter(item.status)}
              >
                <Card
                  bodyStyle={{
                    background: statusConfig.background,
                    borderLeft: `3px solid ${statusConfig.borderColor}`,
                    color: "white",
                  }}
                  className="h-full hover:brightness-110 transition duration-200"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <Text
                        strong
                        className="text-md tracking-wide"
                        style={{ color: "rgba(255,255,255,0.8)" }}
                      >
                        {statusConfig.label}
                      </Text>
                      <div
                        className="text-2xl font-bold"
                        style={{ color: "white" }}
                      >
                        {item.count}
                      </div>
                    </div>
                    {statusConfig.icon}
                  </div>
                </Card>
              </div>
            );
          })}
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Card
            extra={
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-2xl font-bold text-purple-600 mb-2 sm:mb-0 sm:absolute sm:top-2 sm:left-2">
                  Order Details
                </h1>
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search by Order ID"
                  allowClear
                  value={searchValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchValue(value);
                    if (value) {
                      const filtered = orderDetails.filter((order) =>
                        order.uniqueId
                          .toLowerCase()
                          .includes(value.toLowerCase())
                      );
                      setFilteredOrders(filtered);
                    } else {
                      if (selectedStatus) {
                        const filtered = orderDetails.filter(
                          (order) => order.orderStatus === selectedStatus
                        );
                        setFilteredOrders(filtered);
                      } else {
                        setFilteredOrders(orderDetails);
                      }
                    }
                  }}
                  className="w-full sm:max-w-[250px]"
                />
                {/* <Select
                  className="w-full sm:max-w-[250px]"
                  placeholder="Filter by Order Status"
                  allowClear
                  value={selectedStatus}
                  onChange={handleStatusFilter}
                >
                  <Select.Option value="1">New Orders</Select.Option>
                  <Select.Option value="2">Accepted Orders</Select.Option>
                  <Select.Option value="3">Assigned Orders</Select.Option>
                </Select> */}
              </div>
            }
            bodyStyle={{ padding: 0 }}
          >
            <Table
              columns={columns}
              className="p-4"
              dataSource={filteredOrders}
              rowKey="orderId"
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                responsive: true,
                showSizeChanger: false,
                onChange: (page, pageSize) =>
                  setPagination({ current: page, pageSize }),
              }}
              loading={loading}
              onChange={handleTableChange}
              scroll={{ x: true }}
            />
          </Card>
        </Col>
      </Row>
      {isModalVisible && <RejectionReasonModal visible={isModalVisible} />}
      <Modal
        title="Select Delivery Boy"
        open={dbModalVisible}
        onCancel={() => setdbModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              handleCancelCLick();
            }}
          >
            Cancel
          </Button>,
          <Button
            key="assign"
            type="primary"
            loading={dbLoading}
            onClick={() =>
              handleAssign(
                selectedRecord?.orderId ?? "",
                selectedRecord?.orderStatus ?? ""
              )
            }
          >
            Assign
          </Button>,
        ]}
      >
        {dbLoading1 ? ( // Show loader when data is fetching
          <div className="flex justify-center items-center h-32">
            <Spin size="large" />
          </div>
        ) : deliveryBoys.length > 0 ? (
          <Radio.Group
            onChange={(e) => {
              const selectedBoy = deliveryBoys.find(
                (boy) => boy.userId === e.target.value
              );
              setSelectedDeliveryBoy(selectedBoy); // Store the entire object
            }}
            value={selectedDeliveryBoy?.userId}
          >
            <Space direction="vertical">
              {deliveryBoys
                .filter((boy: DeliveryBoy) => boy.isActive === "true")
                .map((boy: DeliveryBoy) => (
                  <Radio
                    key={boy.userId}
                    value={boy.userId}
                    className="block mb-2"
                  >
                    {`${boy.firstName} ${boy.lastName} (${boy.whatsappNumber})`}
                  </Radio>
                ))}
            </Space>
          </Radio.Group>
        ) : (
          <Empty description="No delivery boys available" />
        )}
      </Modal>
    </div>
  );
};

export default MainPage;
