import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Row, Col } from "antd";
import {
  Card,
  Descriptions,
  Tag,
  Timeline,
  Typography,
  Spin,
  Alert,
  Button,
  Modal,
  message,
  Tooltip,
  Divider,
  Form,
  Space,
  Radio,
  Input,
  Select,
  Empty,
  Avatar,
  Badge,
} from "antd";

import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  ExclamationCircleOutlined,
  CarOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  NumberOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import {
  User,
  Phone,
  Smartphone,
  Calendar,
  MapPin,
  FileText,
  Info,
  Truck,
  Barcode,
  Scale,
  Package,
  Package2,
  BadgePercent,
  Percent,
  ShoppingCart,
} from "lucide-react";

import BASE_URL from "../Config";
import ProductModal from "./AllItemsModal";

const { Title, Text } = Typography;

// Type Definitions
interface OrderAddress {
  customerId: string | null;
  orderId: string | null;
  customerName: string | null;
  customerMobile: string | null;
  customerEmail: string | null;
  flatNo: string;
  landMark: string;
  pincode: number;
  address: string;
  addressType: string | null;
  message: string | null;
  dob: string | null;
  latitude: string | null;
  longitude: string | null;
  addressId: string | null;
}

interface OrderHistoryResponse {
  createdDate: string | null;
  orderId: string;
  pickUpDate: string | null;
  placedDate: string | null;
  acceptedDate: string | null;
  assignedDate: string | null;
  deliveredDate: string | null;
  canceledDate: string | null;
  rejectedDate: string | null;
}

interface OrderItem {
  itemId: string;
  itemName: string;
  categoriesId: string | null;
  itemBarCode: string;
  quantity: number;
  itemLogo: string | null;
  itemDeleteId: string | null;
  itemQty: number;
  itemUnit: string | null;
  itemDescription: string | null;
  tags: string | null;
  createdAt: string | null;
  itemprice: number;
  singleItemPrice: string | null;
  itemMrpPrice: string | null;
  price: number;
  itemUrl: string | null;
  weight: number;
  status: string | null;
  errorMessage: string | null;
  tableId: string;
}

interface Order {
  orderId: string;
  orderStatus: string;
  uniqueId: string;
  newOrderId: string | null;
  mobileNumber: string;
  customerMobile: string;
  testUser: boolean;
  customerId: string;
  subTotal: number;
  grandTotal: number;
  deliveryFee: number;
  paymentStatus: string | null;
  paymentType: number;
  orderDate: string;
  alternativeMobileNumber: string;
  subscriptionAmount: number | null;
  walletAmount: number | null;
  createdAt: string | null;
  customerName: string;
  orders: string | null;
  orderHistory: string | null;
  orderAddress: OrderAddress;
  orderHistoryResponse: OrderHistoryResponse[];
  gstAmount: number;
  discountAmount: number | null;
  sellerId: string | null;
  deliveryBoyId: string;
  deliveryBoyMobile: string | null;
  deliveryBoyName: string | null;
  deliveryBoyAddress: string | null;
  orderAssignedDate: string | null;
  orderItems: OrderItem[];
  orderCanceledDate: string | null;
  message: string | null;
  reason: string | null;
  invoiceUrl: string | null;
  timeSlot: string;
  dayOfWeek: string;
  expectedDeliveryDate: string;
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

const { TextArea } = Input;

const OrderDetailsPage: React.FC = () => {
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const accessToken = JSON.parse(localStorage.getItem("partner_Token") || "{}");
  // const { orderId, orderStatus } = useParams<{
  //   orderId: string;
  //   orderStatus: string;
  // }>();
  const orderId = localStorage.getItem("partner_orderId");
  const [orderStatus, setOrderStatus] = useState<string>();
  const [rejectForm] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [dbLoading, setdbLoading] = useState<boolean>(false);
  const [dbLoading1, setdbLoading1] = useState<boolean>(false);
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [dbModalVisible, setdbModalVisible] = useState(false);
  const [dbDetails, setDbDetials] = useState<DbDetails>();
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] =
    useState<DeliveryBoy | null>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("Adding");
  const [tableId, setTableId] = useState("");
  const [buttonLabel, setButtonLabel] = useState<string>("");
  const [showButton, setShowButton] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [preference, setPreference] = useState<string | null>();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressForm] = Form.useForm();
  const [latLong, setLatLong] = useState({ lat: 0, lng: 0 });

  const fetchContainerStatus = (ordersData: Order) => {
    axios
      .get(
        `${BASE_URL}/cart-service/cart/ContainerInterested/${ordersData?.customerId}`
      )
      .then((response) => {
        const status = response.data?.freeContainerStatus;
        setPreference(status);
        const steelContainerItem = ordersData.orderItems?.find((item) =>
          item.itemName?.toLowerCase().includes("steel")
        );

        const eligibleItem = ordersData.orderItems?.find(
          (item) => item.weight === 10 || item.weight === 26
        );

        if (status === null) {
          if (steelContainerItem) {
            setButtonLabel("Remove");
            setShowButton(true);
            setSelectedItem(steelContainerItem);
          } else if (eligibleItem) {
            setButtonLabel("Add");
            setShowButton(true);
            setSelectedItem(eligibleItem);
          } else {
            setShowButton(false);
          }
        } else {
          if (steelContainerItem) {
            setButtonLabel("Remove");
            setShowButton(true);
            setSelectedItem(steelContainerItem);
          } else {
            setShowButton(false);
          }
        }
      })
      .catch((error) => {
        console.log("Error fetching container status:", error);
        setShowButton(false);
      });
  };

  const handleAddorRemoveContainer = () => {
    if (!selectedItem) {
      message.error("No item selected");
      return;
    }

    const isAdd = buttonLabel === "Add";

    if (isAdd) {
      let itemName = "";

      if (selectedItem.weight === 10) {
        itemName = "Stainless Steel Rice Vault - 20Kg+";
      } else if (selectedItem.weight === 26) {
        itemName = "Premium Steel Rice Storage - 35kg+";
      } else {
        message.error("Invalid item weight for adding a container");
        return;
      }

      Modal.confirm({
        title: `Are you sure you want to add the ${itemName}?`,
        onOk: () => proceedWithContainerAction(true),
      });
    } else {
      Modal.confirm({
        title: "Are you sure you want to remove the container?",
        onOk: () => proceedWithContainerAction(false),
      });
    }
  };

  const proceedWithContainerAction = async (isAdd: boolean) => {
    let payload;

    if (isAdd) {
      let itemId = "";
      let itemName = "";

      if (selectedItem.weight === 10) {
        itemId = "53d7f68c-f770-4a70-ad67-ee2726a1f8f3";
        itemName = "Stainless Steel Rice Vault - 20Kg+";
      } else if (selectedItem.weight === 26) {
        itemId = "53d7f68c-f770-4a70-ad67-ee2726a1f8f3";
        itemName = "Stainless Steel Rice Vault - 20Kg+";
      } else {
        message.error("Invalid item weight for adding a container");
        return;
      }

      payload = {
        itemId,
        itemName,
        orderId: orderId,
        status: "ADD",
      };
    } else {
      payload = {
        itemId: selectedItem.itemId,
        orderId: orderId,
        status: "REMOVE",
      };
    }

    try {
      await axios.patch(
        `${BASE_URL}/order-service/containerAddForStore`,
        payload
      );

      message.success(
        isAdd
          ? "Container added successfully"
          : "Container removed successfully"
      );

      fetchOrderDetails(orderStatus);
    } catch (error) {
      console.log("Error in containerAddForStore:", error);
      message.error("Something went wrong, please try again");
    }
  };

  const getStatusText = (status: string) => {
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
        return "Picked Up";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "1":
        return "bg-yellow-100 text-yellow-800";
      case "2":
        return "bg-blue-100 text-blue-800";
      case "3":
        return "bg-green-100 text-green-800";
      case "4":
        return "bg-green-100 text-green-800";
      case "5":
        return "bg-red-100 text-red-800";
      case "6":
        return "bg-red-100 text-red-800";
      case "PickedUp":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentType = (type: number) => {
    switch (type) {
      case 1:
        return "Cash on Delivery";
      case 2:
        return "Online Payment";
      default:
        return "Online Payment";
    }
  };

  const orderService = {
    async getOrderDetails(
      orderId: string,
      orderStatus: string
    ): Promise<Order[]> {
      try {
        const response = await axios.post<Order[]>(
          `${BASE_URL}/order-service/assignedOrders`,
          { orderId, orderStatus },
          {
            headers: {
              accept: "*/*",
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching order details:", error);
        throw error;
      }
    },
  };

  const getDeliveryDetials = async (status: string) => {
    if (status === "3" || status === "4" || status === "PickedUp") {
      try {
        const response = await axios.post(
          `${BASE_URL}/order-service/deliveryBoyAssigneData`,
          {
            orderId: orderId,
            orderStatus: status || "3",
          }
        );
        if (response.status === 200) {
          const deliveryData = response.data[0];
          setDbDetials({
            deliveryBoyId: deliveryData?.deliveryBoyId || "",
            deliveryBoyMobile: deliveryData?.deliveryBoyMobile || "N/A",
            deliveryBoyName: deliveryData?.deliveryBoyName || "N/A",
            deliveryBoyAddress: deliveryData?.deliveryBoyAddress || "N/A",
            // orderAssignedDate:
            //   deliveryData?.orderHistoryResponse?.find((h) => h.assignedDate)
            //     ?.assignedDate || "N/A",
          });
        }
      } catch {
        message.error("unable to find deliveryboy");
      }
    }
  };

  const findOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/order-service/getOrdersByOrderId/${orderId}`,
        {
          method: "GET",
          headers: {
            Accept: "*/*",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.length > 0) {
        let status = data[0].orderStatus;
        setOrderStatus(status);
        getDeliveryDetials(status);
        fetchOrderDetails(status);
      } else {
        console.log("No order details found.");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const fetchOrderDetails = async (status: string | undefined) => {
    try {
      if (orderId && status) {
        const details = await orderService.getOrderDetails(orderId, status);
        setOrderDetails(details[0]);
        fetchContainerStatus(details[0]);
      }
    } catch (err) {
      setError("Failed to fetch order details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    findOrderDetails();
  }, []);

  const getMobileNumber = () => {
    if (orderDetails) {
      return (
        orderDetails.alternativeMobileNumber || orderDetails.customerMobile
      );
    }
    return "N/A";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getOrderTrackingDates = () => {
    const defaultDates = {
      orderDate: "Not Available",
      acceptedDate: "Not Processed",
      assignedDate: "Not Assigned",
      pickUpDate: "Not pickedUp",
      deliveredDate: "Not delivered",
    };

    if (orderDetails && Array.isArray(orderDetails.orderHistoryResponse)) {
      const dates = { ...defaultDates };

      orderDetails.orderHistoryResponse.forEach((entry) => {
        if (entry.placedDate) {
          dates.orderDate = formatDate(entry.placedDate);
        }
        if (entry.acceptedDate) {
          dates.acceptedDate = formatDate(entry.acceptedDate);
        }
        if (entry.assignedDate) {
          dates.assignedDate = formatDate(entry.assignedDate);
        }
        if (entry.pickUpDate) {
          dates.pickUpDate = formatDate(entry.pickUpDate);
        }
        if (entry.deliveredDate) {
          dates.deliveredDate = formatDate(entry.deliveredDate);
        }
      });

      return dates;
    }

    return defaultDates;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="p-6">
        <Alert
          message="Error"
          description={error || "No order details found"}
          type="error"
        />
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

  const fetchDeliveryBoys = async () => {
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

  const showRejectConfirmation = () => {
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
          orderId: orderId,
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
        findOrderDetails();
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
        findOrderDetails();
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
    <div>
      {orderDetails ? (
        <div className="max-w-full mx-auto bg-white shadow-sm rounded-xl border border-gray-200 z-10">
          <div className="px-6 py-4 rounded-t-xl flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <ShoppingCartOutlined className="text-3xl font-semibold text-blue-700 w-fit h-auto" />
                <h1 className="text-xl font-semibold text-gray-700 w-fit h-auto">
                  Order Details
                  <span className="text-xl text-purple-700 ml-2">
                    (#{orderDetails.uniqueId || "N/A"})
                  </span>
                </h1>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                {preference === null ? (
                  <span className="text-blue-950 bg-blue-200 rounded-lg px-2 py-1 text-center">
                    Container not given
                  </span>
                ) : (
                  <span className="text-blue-950 bg-blue-200 rounded-lg px-2 py-1 text-center">
                    Container given
                  </span>
                )}
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider text-center
          ${getStatusColor(orderDetails.orderStatus)}`}
                >
                  {getStatusText(orderDetails.orderStatus)}
                </div>
                <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium uppercase tracking-wider text-center">
                  {getPaymentType(orderDetails.paymentType)}
                </div>
              </div>
            </div>
          </div>

          {(orderStatus === "1" ||
            orderStatus === "2" ||
            orderStatus === "3" ||
            orderStatus === "PickedUp") && (
            <div className="px-4 py-4 bg-gray-50 flex flex-row flex-wrap space-x-2 sm:justify-end sm:space-x-3 border-b items-end">
              {showButton && (
                <Button
                  type="default"
                  style={{
                    backgroundColor:
                      buttonLabel === "Add" ? "rgb(0, 140, 186)" : "#fff",
                    color: buttonLabel === "Remove" ? "red" : "#fff",
                    border: buttonLabel === "Remove" ? "1px solid red" : "none",
                    height: "32px",
                    fontSize: "0.75rem",
                    padding: "0 12px",
                  }}
                  className="w-auto"
                  onClick={handleAddorRemoveContainer}
                >
                  {buttonLabel}
                </Button>
              )}

              {(orderStatus === "1" || orderStatus === "2") && (
                <button
                  onClick={fetchDeliveryBoys}
                  className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition flex items-center text-xs font-medium w-auto h-8"
                >
                  <CheckCircleOutlined className="mr-1 text-sm" />
                  Assign
                </button>
              )}

              {(orderStatus === "3" || orderStatus === "PickedUp") && (
                <>
                  <button
                    onClick={fetchDeliveryBoys}
                    className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center text-xs font-medium w-auto h-8"
                  >
                    <ReloadOutlined className="mr-1 text-sm" />
                    Re-Assign
                  </button>
                </>
              )}

              {(orderStatus === "1" ||
                orderStatus === "2" ||
                orderStatus === "3" ||
                orderStatus === "PickedUp") && (
                <button
                  onClick={() => showRejectConfirmation()}
                  className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition flex items-center text-xs font-medium w-auto h-8"
                >
                  <CloseCircleOutlined className="mr-1 text-sm" />
                  Reject
                </button>
              )}
            </div>
          )}
          {orderDetails.orderStatus === "5" && (
            <div className="mx-4 p-4 bg-gray-200 rounded-md shadow-sm">
              <p className="font-semibold flex flex-wrap">
                <span className="mr-2">Rejected Reason:</span>
                <span className="text-red-600">
                  {orderDetails.reason
                    ? orderDetails.reason
                    : "No reason is available"}
                </span>
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <Card
              title={
                <span className="text-blue-600">
                  <UserOutlined className="mr-2" />
                  Customer Details
                </span>
              }
              className="shadow-md hover:shadow-lg transition-shadow border-t-4 border-t-blue-500"
              bordered={false}
              headStyle={{ backgroundColor: "rgba(239, 246, 255, 0.7)" }}
              bodyStyle={{ backgroundColor: "white" }}
            >
              <div className="flex items-center mb-4">
                <Avatar
                  size={64}
                  icon={<UserOutlined />}
                  className="bg-blue-500"
                />
                <div className="ml-4">
                  <Title level={4} className="mb-0">
                    {orderDetails.customerName || "N/A"}
                  </Title>
                  <div className="mt-1">
                    <Tag className="text-purple-500 font-bold text-base">
                      Order #{orderDetails.orderId.slice(-4)}
                    </Tag>
                  </div>
                </div>
              </div>
              <Divider />
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <PhoneOutlined className="mr-2 text-green-500" />
                  <Text className="text-base">
                    {orderDetails.mobileNumber || ""}
                  </Text>
                </div>
                <Badge status="success" text="Primary" />
              </div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <PhoneOutlined className="mr-2 text-purple-500" />
                  <Text className="text-base">{getMobileNumber()}</Text>
                </div>
                <Badge status="processing" text="Alternative" />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CalendarOutlined className="mr-2 text-orange-500" />
                  <Text>{formatDate(orderDetails.orderDate) || ""}</Text>
                </div>
                <Text type="secondary">Order Date</Text>
              </div>
            </Card>

            {/* Delivery Address Card */}
            <Card
              title={
                <div className="flex justify-between items-center">
                  <span className="text-green-600 flex items-center">
                    <HomeOutlined className="mr-2" />
                    Delivery Address
                  </span>
                  {(orderDetails.orderStatus === "3" ||
                    orderDetails.orderStatus === "PickedUp") && (
                    <button
                      onClick={() => setIsAddressModalOpen(true)}
                      className="px-3 py-1.5 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition flex items-center text-xs font-medium h-8"
                    >
                      <HomeOutlined className="mr-1 text-sm" />
                      Update Address
                    </button>
                  )}
                </div>
              }
              className="shadow-md hover:shadow-lg transition-shadow border-t-4 border-t-green-500"
              bordered={false}
              headStyle={{ backgroundColor: "rgba(240, 253, 244, 0.7)" }}
              bodyStyle={{ backgroundColor: "white" }}
            >
              <div className="mb-4">
                <Text strong className="block mb-1">
                  Address :
                </Text>
              </div>
              <Text className="block mb-4">
                {orderDetails.orderAddress?.flatNo || ""},{" "}
                {orderDetails.orderAddress?.address || ""},{" "}
                {orderDetails.orderAddress?.landMark || ""},{" "}
                {orderDetails.orderAddress?.pincode || ""}
              </Text>
              <Divider />
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <HomeOutlined className="mr-2 text-blue-500" />
                  <Text>Flat No:</Text>
                </div>
                <Text>{orderDetails.orderAddress?.flatNo || ""}</Text>
              </div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <EnvironmentOutlined className="mr-2 text-purple-500" />
                  <Text>Landmark:</Text>
                </div>
                <Text>{orderDetails.orderAddress?.landMark || ""}</Text>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <NumberOutlined className="mr-2 text-red-500" />
                  <Text>Pincode:</Text>
                </div>
                <Text>{orderDetails.orderAddress?.pincode || ""}</Text>
              </div>
            </Card>
          </div>

          <div className="p-3 sm:p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 border-t border-gray-200">
            {/* Header Section */}
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg mr-3">
                    <ShoppingCart className="text-white" size={20} />
                  </div>
                  <span className="mr-3">Order Items</span>
                  <span className="bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    {orderDetails.orderItems.length} items
                  </span>
                </h2>

                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setIsProductModalOpen(true);
                    setModalMessage("Adding");
                  }}
                  size="small"
                  className="self-start sm:self-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 border-0 shadow-md"
                >
                  Add Items
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-2 sm:p-3">
              <div className="space-y-3">
                {orderDetails.orderItems.map((item, index) => (
                  <div
                    key={item.itemId}
                    className="bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-100 p-3"
                  >
                    {/* Item Header with Number and Name */}
                    <div className="flex items-start gap-2 mb-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-2 py-1 rounded text-white font-bold text-xs flex-shrink-0 mt-0.5">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="flex-1 min-w-0 pr-2">
                        <h3 className="text-gray-900 font-bold text-base sm:text-lg leading-tight break-words">
                          {item.itemName || "Unnamed Item"}
                        </h3>
                      </div>
                    </div>

                    {/* Item Details - Horizontal Layout */}
                    <div className="flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-1 text-xs ml-8 mb-3 sm:mb-0">
                      <div className="flex items-center whitespace-nowrap">
                        <span className="text-gray-500 mr-1">Price:</span>
                        <span className="font-semibold text-emerald-700">
                          ₹{(item.itemprice || 0).toFixed(0)}
                        </span>
                      </div>

                      <div className="flex items-center whitespace-nowrap">
                        <span className="text-gray-500 mr-1">Qty:</span>
                        <span className="font-semibold text-blue-700">
                          {item.quantity || 0}
                        </span>
                      </div>

                      <div className="flex items-center whitespace-nowrap">
                        <span className="text-gray-500 mr-1">Weight:</span>
                        <span className="font-semibold text-orange-700">
                          {item.weight || "N/A"} {item.itemUnit}
                        </span>
                      </div>

                      {item.itemBarCode && (
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-1">Code:</span>
                          <span className="bg-gray-800 text-white px-2 py-0.5 rounded text-xs font-mono">
                            {item.itemBarCode}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Change Button - Visible only on mobile at bottom */}
                    <div className="sm:hidden flex justify-end mt-2">
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                          setIsProductModalOpen(true);
                          setModalMessage("Change");
                          setTableId(item.tableId);
                        }}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-orange-700 border-0 shadow-md text-xs px-3"
                      >
                        Change Item
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t">
            <h2 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
              <Info className="mr-3 text-blue-600" />
              Delivery Information
            </h2>

            <div className="bg-white rounded-lg p-5 border space-y-3">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Expected Delivery Date</span>
                <span className="font-medium">
                  {orderDetails.expectedDeliveryDate || ""}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Time Slot</span>
                <span className="font-medium">
                  {orderDetails.timeSlot || ""}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t">
            <h2 className="text-lg font-semibold text-purple-800 mb-4 flex items-center space-x-2">
              <Truck className="mr-3 text-blue-600" />
              Order Tracking
            </h2>

            <div className="bg-white rounded-lg p-5 border space-y-3">
              {(() => {
                const trackingDates = getOrderTrackingDates();
                return (
                  <>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span className="font-medium">Order Date</span>
                      <span>{trackingDates?.orderDate || ""}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span className="font-medium">Accepted Date</span>
                      <span>{trackingDates.acceptedDate || ""}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span className="font-medium">Assigned Date</span>
                      <span>{trackingDates.assignedDate || ""}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span className="font-medium">PickUp Date</span>
                      <span>{trackingDates.pickUpDate || ""}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span className="font-medium">delivered Date</span>
                      <span>{trackingDates.deliveredDate || ""}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {(orderStatus === "3" ||
            orderStatus === "4" ||
            orderStatus === "PickedUp") && (
            <>
              <div className="p-6 bg-gray-50 border-t">
                <h2 className="text-lg font-semibold text-purple-800 mb-4 flex items-center space-x-2">
                  <CarOutlined className="mr-3 text-blue-600" />
                  Order Assigned To
                </h2>

                <div className="bg-white rounded-lg p-5 border space-y-3">
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>DeliveryBoy name</span>
                    <span className="font-medium">
                      {dbDetails?.deliveryBoyName || ""}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>DeliveryBoy Mobile</span>
                    <span className="font-medium">
                      {dbDetails?.deliveryBoyMobile || ""}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="p-6">
            <h2 className="text-lg font-semibold text-purple-800 mb-4 flex items-center space-x-2">
              <FileText className="mr-3 text-blue-600" />
              Order Summary
            </h2>

            <div className="bg-gray-50 rounded-lg p-5 border space-y-3">
              <div className="flex justify-between text-sm text-gray-700">
                <span>SubTotal</span>
                <span className="font-medium">
                  ₹{(orderDetails.subTotal || 0).toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Delivery Fee</span>
                <span className="font-medium">
                  ₹{(orderDetails.deliveryFee || 0).toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>GST</span>
                <span className="font-medium">
                  ₹{(orderDetails.gstAmount || 0).toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Discount</span>
                <span className="font-medium">
                  ₹{(orderDetails.discountAmount || 0).toFixed(0)}
                </span>
              </div>
              {orderDetails.walletAmount && (
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Wallet Amount</span>
                  <span className="font-medium">
                    - ₹{(orderDetails.walletAmount || 0).toFixed(0)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-blue-600 pt-3 border-t">
                <span>Total Amount</span>
                <span>₹{(orderDetails.grandTotal || 0).toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-pulse bg-gray-300 w-16 h-16 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      )}
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
            onClick={() => handleAssign(orderId ?? "", orderStatus ?? "")}
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
      <ProductModal
        visible={isProductModalOpen}
        orderId={orderDetails.orderId}
        id={tableId}
        modalMessage={modalMessage}
        onClose={() => setIsProductModalOpen(false)}
        onSuccess={() => {
          setIsProductModalOpen(false); // close modal
          findOrderDetails(); // refresh the page with updated order data
        }}
      />
      <Modal
        title="Update Delivery Address"
        open={isAddressModalOpen}
        onCancel={() => setIsAddressModalOpen(false)}
        okText="Update"
        onOk={async () => {
          try {
            const values = await addressForm.validateFields();

            // Validate Pincode
            const pinResp = await axios.get(
              `https://api.postalpincode.in/pincode/${values.pincode}`
            );
            if (
              !pinResp.data ||
              pinResp.data[0].Status !== "Success" ||
              !pinResp.data[0].PostOffice
            ) {
              message.error("Invalid pincode. Please enter a valid pincode.");
              return;
            }

            // Build full address
            const fullAddress = `${values.flatNo}, ${values.address}, ${values.landMark}, ${values.pincode}`;

            // Get Coordinates from Google Maps
            const API_KEY = "AIzaSyAM29otTWBIAefQe6mb7f617BbnXTHtN0M";
            const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              fullAddress
            )}&key=${API_KEY}`;

            const geoResp = await axios.get(geocodeUrl);
            const location = geoResp.data?.results?.[0]?.geometry?.location;

            if (!location) {
              message.error("Failed to get coordinates from Google Maps.");
              return;
            }

            const payload = {
              ...values,
              latitude: location.lat,
              longitude: location.lng,
              orderId: orderDetails?.orderId,
            };

            await axios.patch(
              `${BASE_URL}/order-service/orderAddressUpdate`,
              payload
            );

            message.success("Address updated successfully!");
            setIsAddressModalOpen(false);
            findOrderDetails(); // Refresh
          } catch (error) {
            console.error("Update error:", error);
            message.error("Failed to update address.");
          }
        }}
        width={700}
      >
        <Form
          layout="vertical"
          form={addressForm}
          initialValues={{ addressType: "HOME" }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="flatNo"
                label="Flat Number"
                rules={[{ required: true }]}
              >
                <Input placeholder="e.g. 402-B" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="area" label="Area" rules={[{ required: true }]}>
                <Input placeholder="e.g. Madhapur" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={2} placeholder="Full address" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="landMark"
                label="Landmark"
                rules={[{ required: true }]}
              >
                <Input placeholder="Near XYZ Park" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="pincode"
                label="Pincode"
                rules={[{ required: true }]}
              >
                <Input type="number" placeholder="6-digit code" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="addressType"
                label="Address Type"
                rules={[{ required: true }]}
              >
                <Radio.Group>
                  <Radio value="HOME">Home</Radio>
                  <Radio value="WORK">Work</Radio>
                  <Radio value="OTHER">Other</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="houseType"
                label="House Type"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select house type"
                  onChange={() => {
                    addressForm.setFieldValue("residenceName", "");
                  }}
                >
                  <Select.Option value="Apartment">Apartment</Select.Option>
                  <Select.Option value="Villa">Villa</Select.Option>
                  <Select.Option value="Pg">PG</Select.Option>
                  <Select.Option value="GatedCommunity">
                    Gated Community
                  </Select.Option>
                  <Select.Option value="IndividualHouse">
                    Individual House
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            shouldUpdate={(prev, curr) => prev.houseType !== curr.houseType}
          >
            {() => {
              const houseType = addressForm.getFieldValue("houseType");
              const labelMap = {
                Apartment: "Apartment Name",
                Villa: "Villa Name",
                Pg: "PG Name",
                GatedCommunity: "Community Name",
                IndividualHouse: "House Name",
              };
              return (
                <Form.Item
                  shouldUpdate={(prev, curr) =>
                    prev.houseType !== curr.houseType
                  }
                >
                  {() => {
                    const houseType = addressForm.getFieldValue(
                      "houseType"
                    ) as keyof typeof labelMap;
                    const labelMap = {
                      Apartment: "Apartment Name",
                      Villa: "Villa Name",
                      Pg: "PG Name",
                      GatedCommunity: "Community Name",
                      IndividualHouse: "House Name",
                    };

                    const label = labelMap[houseType] || "Residence Name";

                    return (
                      <Form.Item
                        name="residenceName"
                        label={label}
                        rules={[{ required: true }]}
                      >
                        <Input placeholder={`Enter ${label}`} />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
              );
            }}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderDetailsPage;
