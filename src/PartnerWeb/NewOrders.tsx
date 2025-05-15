import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  message,
  Spin,
  Card,
  Button,
  Empty,
  Input,
  Tag,
  Modal,
  Form,
  Radio,
  Space,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FileSearchOutlined,
  ReloadOutlined,
  SearchOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../Config";
import TextArea from "antd/es/input/TextArea";

interface Order {
  orderId: string;
  uniqueId: string;
  orderDate: string;
  subTotal: number;
  grandTotal: number;
  testUser: boolean;
  orderStatus: string;
  orderAddress?: Address;
  userType: string;
  orderItems: OrderItems[];
}
type OrderItems = {
  itemName: string;
  quantity: string;
  singleItemPrice: number;
  itemMrpPrice: number;
  price: number;
  weight: string;
};
interface Address {
  flatNo?: string;
  address?: string;
  landMark?: string;
  pincode?: string;
  googleMapLink: string;
}
type DeliveryBoy = {
  userId: string;
  firstName: string;
  lastName: string;
  whatsappNumber: string;
  isActive: string;
  testUser: boolean;
};

type DbDetails = {
  deliveryBoyId: string;
  deliveryBoyMobile: string;
  deliveryBoyName: string;
  deliveryBoyAddress: string;
  // orderAssignedDate: string;
};

const NewOrders: React.FC = () => {
  const { status } = useParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();
  const [dbLoading, setdbLoading] = useState<boolean>(false);
  const [dbLoading1, setdbLoading1] = useState<boolean>(false);
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [dbModalVisible, setdbModalVisible] = useState(false);
  const [dbDetails, setDbDetials] = useState<DbDetails>();
  const accessToken = JSON.parse(localStorage.getItem("Token") || "{}");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [rejectForm] = Form.useForm();
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] =
    useState<DeliveryBoy | null>();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Order[]>(
          `${BASE_URL}/order-service/getAllOrdersBasedOnStatus?orderStatus=${status}`
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
  }, [status]);

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

  const RejectionReasonModal = ({ visible }: { visible: boolean }) => (
    <Modal
      title="Provide Rejection Reason"
      open={visible}
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

  const fetchDeliveryBoys = async (order: Order) => {
    setSelectedOrder(order);
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

  const showRejectConfirmation = (order: Order) => {
    setSelectedOrder(order);
    Modal.confirm({
      title: "Are you sure you want to reject this order?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes, Reject",
      okButtonProps: { danger: true },
      cancelText: "No, Cancel",
      onOk() {
        setIsModalVisible(true);
      },
    });
  };

  const handleFinalReject = async () => {
    try {
      await rejectForm.validateFields();
      const rejectReason = rejectForm.getFieldValue("rejectReason");
      setConfirmLoading(true);
      const response = await axios.post(
        `${BASE_URL}/order-service/reject_orders`,
        {
          orderId: selectedOrder?.orderId,
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
  const handleCancelCLick = () => {
    setdbModalVisible(false);
    setSelectedDeliveryBoy(null);
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-100">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <Typography.Title level={2} className="mb-0">
            {status === "1" && <p>New Orders</p>}
            {status === "2" && <p>Accepted Orders</p>}
            {status === "3" && <p>Assigned Orders</p>}
          </Typography.Title>

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
                  <div className="flex justify-between items-start">
                    {/* Left side: Order ID and User Type */}
                    <div>
                      <Typography.Text strong>
                        OrderId : #
                        <span className="text-purple-900 text-xl">
                          {order.uniqueId}
                        </span>
                        <Tag color="blue" className="w-fit ml-2 text-xs">
                          {order.userType}
                        </Tag>
                      </Typography.Text>
                    </div>

                    {/* Right side: Location button */}
                    {order?.orderAddress?.googleMapLink && (
                      <a
                        href={order.orderAddress.googleMapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200"
                        title="View Location"
                      >
                        <EnvironmentOutlined style={{ fontSize: "20px" }} />
                      </a>
                    )}
                  </div>

                  <div className="flex flex-row justify-between">
                    {(status === "1" || status === "2") && (
                      <button
                        onClick={() => fetchDeliveryBoys(order)}
                        className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition flex items-center text-xs font-medium w-auto h-8"
                      >
                        <CheckCircleOutlined className="mr-1 text-sm" />
                        Assign
                      </button>
                    )}

                    {(status === "3" || status === "PickedUp") && (
                      <button
                        onClick={() => fetchDeliveryBoys(order)}
                        className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center text-xs font-medium w-auto h-8"
                      >
                        <ReloadOutlined className="mr-1 text-sm" />
                        Re-Assign
                      </button>
                    )}

                    {(status === "1" || status === "2" || status === "3") && (
                      <button
                        onClick={() => showRejectConfirmation(order)}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition flex items-center text-xs font-medium w-auto h-8"
                      >
                        <CloseCircleOutlined className="mr-1 text-sm" />
                        Reject
                      </button>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <Typography.Text>Date</Typography.Text>
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
                      }).format(order.grandTotal)}
                    </Typography.Text>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Typography.Text strong>Delivery Address</Typography.Text>
                    <div className="bg-gray-50 p-3 rounded-md h-[90px] overflow-y-auto break-words scrollbar-hide">
                      <Typography.Text className="block leading-tight">
                        {`${order.orderAddress?.flatNo || "N/A"} `}
                        {", "}
                        {order.orderAddress?.address || "N/A"}
                        {", "}
                        {order.orderAddress?.landMark || "N/A"}
                        {", "}

                        {order.orderAddress?.pincode || "N/A"}
                      </Typography.Text>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <ShoppingOutlined className="mr-2 text-blue-500" />
                      <Typography.Text strong>Items</Typography.Text>
                      <Typography.Text type="secondary" className="ml-2">
                        ({order.orderItems?.length || 0})
                      </Typography.Text>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-md max-h-[80px] overflow-y-auto scrollbar-hide">
                      {order.orderItems && order.orderItems.length > 0 ? (
                        <div className="space-y-2">
                          {order.orderItems.map((item: OrderItems, index) => (
                            <div key={index} className="flex flex-col">
                              <Typography.Text
                                ellipsis={{ tooltip: item.itemName }}
                                className="text-green-700 font-semibold text-sm"
                              >
                                {item.itemName || "Unnamed Item"}
                              </Typography.Text>
                              <div className="flex gap-2 text-xs text-gray-700">
                                {item.price && (
                                  <Typography.Text className="text-red-600 font-medium text-xs">
                                    ₹{item.price}
                                  </Typography.Text>
                                )}

                                {item.quantity && (
                                  <span>Qty: {item.quantity}</span>
                                )}
                                {item.weight && (
                                  <span>Weight: {item.weight}kgs</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Typography.Text type="secondary">
                          No items
                        </Typography.Text>
                      )}
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
      <Modal
        title="Select Delivery Boy"
        open={dbModalVisible}
        onCancel={handleCancelCLick}
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
              handleAssign(selectedOrder?.orderId ?? "", status ?? "")
            }
          >
            Assign
          </Button>,
        ]}
      >
        {dbLoading1 ? (
          <div className="flex justify-center items-center h-32">
            <Spin size="large" />
          </div>
        ) : deliveryBoys.length > 0 ? (
          <Radio.Group
            onChange={(e) => {
              const selectedBoy = deliveryBoys.find(
                (boy) => boy.userId === e.target.value
              );
              setSelectedDeliveryBoy(selectedBoy);
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
      {isModalVisible && <RejectionReasonModal visible={isModalVisible} />}
    </div>
  );
};

export default NewOrders;
