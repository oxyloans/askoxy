import React, { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import {
  Table,
  message,
  Spin,
  Card,
  Statistic,
  Row,
  Col,
  Pagination,
  Modal,
  Button,
  Descriptions,
  Tag,
  Divider,
  List,
  Typography,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { AiOutlinePrinter } from "react-icons/ai";
import BASE_URL from "../Config";
import dayjs from "dayjs";

interface UserData {
  userId: string;
  userType: string;
  userName: string;
  mobileNumber: string | null;
  whastappNumber: string;
  countryCode: string;
  whatsappVerified: boolean;
  mobileVerified: boolean;
  registeredFrom: string;
  ericeCustomerId: string;
  alterNativeMobileNumber: string | null;
  firstName: string;
  lastName: string | null;
  email: string;
  longitude: string | null;
  latitude: string | null;
  pincode: string | null;
  flatNo: string | null;
  landMark: string | null;
  addressType: string | null;
  address: string | null;
  panNumber: string | null;
  lastFourDigitsUserId: string;
  userRegisterDate: number;
  userRegisterCreatedDate: string;
  aadharNumber: string | null;
  gender: string;
  assignCoins: string;
  mutliChainCreatedAt: number;
  multiChainAddress: string | null;
  assignedTo: string;
  isActive: boolean | null;
  familyMemberName: string | null;
  houseNumber: string | null;
}

interface OrderData {
  orderId: string;
  orderStatus: string;
  orderDate: string;
  testUser: boolean;
  customerId: string | null;
  subTotal: number;
  grandTotal: number;
  deliveryFee: number;
  paymentStatus: string | null;
  paymentType: string | null;
  alternativeMobileNumber: string | null;
  subscriptionAmount: string | null;
  walletAmount: string | null;
  createdAt: string | null;
  customerName: string | null;
  gstAmount: string | null;
  discountAmount: string | null;
  sellerId: string | null;
  deliveryBoyId: string | null;
  deliveryBoyMobile: string | null;
  deliveryBoyName: string | null;
  deliveryBoyAddress: string | null;
  orderAssignedDate: string | null;
  orderCanceledDate: string | null;
  message: string | null;
  reason: string | null;
  invoiceUrl: string | null;
  timeSlot: string | null;
  dayOfWeek: string | null;
  expectedDeliveryDate: string | null;
  clusterId: string | null;
  distance: string | null;
  distancefromMiyapur: string | null;
  distancefromMythriNager: string | null;
  choosedLocations: string | null;
  orderItem: string | null;
  orderFrom: string | null;
  userType: string | null;
  uniqueId: string | null;
  newOrderId: string | null;
  mobileNumber: string | null;
  couponCode: string | null;
  customerMobile: string | null;
  orders: string | null;
  orderHistory: string | null;
  orderAddress: string | null;
  orderHistoryResponse: string | null;
  orderItems: string | null;
}

interface MatchedUserOrder {
  user: UserData;
  order: OrderData;
}

interface OrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  singleItemPrice: number;
  itemMrpPrice: number;
  price: number;
  itemUrl: string;
  weight: number;
}

interface OrderHistory {
  createdDate: string | null;
  orderId: string;
  pickUpDate: string | null;
  placedDate: string | null;
  acceptedDate: string | null;
  assignedDate: string | null;
  deliveredDate: string | null;
  canceledDate: string | null;
  rejectedDate: string | null;
  status: string | null;
}

interface OrderAddress {
  flatNo: string;
  landMark: string;
  pincode: number;
  address: string;
  latitude: number;
  longitude: number;
}

interface DetailedOrderData {
  orderId: string;
  orderStatus: number;
  orderDate: string;
  customerId: string;
  customerName: string;
  mobileNumber: string;
  customerMobile: string | null;
  alternativeMobileNumber: string;
  subTotal: number;
  grandTotal: number;
  deliveryFee: number;
  gstAmount: number;
  discountAmount: number | null;
  paymentType: number;
  paymentStatus: string | null;
  walletAmount: number;
  subscriptionAmount: number;
  referralAmountUsed: number;
  timeSlot: string;
  dayOfWeek: string;
  expectedDeliveryDate: string;
  orderItems: OrderItem[];
  orderHistory: OrderHistory[];
  orderAddress: OrderAddress;
  invoiceUrl: string;
}

const DEFAULT_PAGE_SIZE = 1500;

// Order status mapping
const orderStatusMap: { [key: number]: string } = {
  1: "Pending",
  2: "Confirmed",
  3: "Preparing",
  4: "Delivered",
  5: "Cancelled",
  6: "Rejected",
  7: "Out for Delivery",
};

// Payment type mapping
const paymentTypeMap: { [key: number]: string } = {
  1: "Cash on Delivery",
  2: "Online Payment",
  3: "Wallet",
  4: "Card",
};

const UserOrdersIntegration: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [matchedData, setMatchedData] = useState<MatchedUserOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [totalUsersCount, setTotalUsersCount] = useState<number>(0);

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<DetailedOrderData | null>(
    null
  );
  const [orderDetailsLoading, setOrderDetailsLoading] =
    useState<boolean>(false);

  // ✅ Fetch Users
  const fetchUsers = useCallback(async () => {
    const userId = localStorage.getItem("admin_uniquId");
    if (!userId) {
      message.error("Admin ID not found. Please login again.");
      setUsers([]);
      setTotalUsersCount(0);
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/user-service/assigned-users/${userId}`,
        { pageNo: currentPage, pageSize },
        { headers: { "Content-Type": "application/json" } }
      );

      setUsers(response.data?.activeUsersResponse || []);
      setTotalUsersCount(response.data?.totalCount || 0);
    } catch (error) {
      message.error("Failed to fetch users data");
      setUsers([]);
      setTotalUsersCount(0);
    }
  }, [currentPage, pageSize]);

  // ✅ Fetch Orders
  const fetchOrders = useCallback(async () => {
    try {
      const url = `${BASE_URL}/order-service/cancelled-incomplete?page=${
        currentPage - 1
      }&size=${pageSize}`;

      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });

      setOrders(response.data?.content || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Failed to fetch orders data");
      setOrders([]);
    }
  }, [currentPage, pageSize]);

  // ✅ Fetch Order Details by Order ID
  const fetchOrderDetails = useCallback(async (orderId: string) => {
    setOrderDetailsLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/order-service/getOrdersByOrderId/${orderId}`,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data && response.data.length > 0) {
        setSelectedOrder(response.data[0]);
        setIsModalVisible(true);
      } else {
        message.error("Order details not found");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      message.error("Failed to fetch order details");
    } finally {
      setOrderDetailsLoading(false);
    }
  }, []);

  // ✅ Match users with orders (fast + stable)
  const matchUsersWithOrders = useCallback(
    (usersList: UserData[], ordersList: OrderData[]) => {
      const userMap = new Map<string, UserData>();
      usersList.forEach((u) => userMap.set(u.userId, u));

      const matched: MatchedUserOrder[] = [];
      ordersList.forEach((order) => {
        if (!order.customerId) return;
        const u = userMap.get(order.customerId);
        if (u) matched.push({ user: u, order });
      });

      setMatchedData(matched);
    },
    []
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // ✅ get both responses first, then set state once
      const userId = localStorage.getItem("admin_uniquId");
      if (!userId) {
        message.error("Admin ID not found. Please login again.");
        setMatchedData([]);
        return;
      }

      const usersReq = axios.post(
        `${BASE_URL}/user-service/assigned-users/${userId}`,
        { pageNo: currentPage, pageSize },
        { headers: { "Content-Type": "application/json" } }
      );

      const ordersReq = axios.get(
        `${BASE_URL}/order-service/cancelled-incomplete?page=${
          currentPage - 1
        }&size=${pageSize}`,
        { headers: { "Content-Type": "application/json" } }
      );

      const [usersRes, ordersRes] = await Promise.all([usersReq, ordersReq]);

      const usersList: UserData[] = usersRes.data?.activeUsersResponse || [];
      const totalCount: number = usersRes.data?.totalCount || 0;
      const ordersList: OrderData[] = ordersRes.data?.content || [];

      setUsers(usersList);
      setTotalUsersCount(totalCount);
      setOrders(ordersList);

      // ✅ match directly using fresh data (no setTimeout needed)
      matchUsersWithOrders(usersList, ordersList);
    } catch (error) {
      console.error("Error loading data:", error);
      message.error("Failed to load data");
      setUsers([]);
      setOrders([]);
      setMatchedData([]);
      setTotalUsersCount(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, matchUsersWithOrders]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };

  const columns = useMemo(
    () => [
      {
        title: "User ID",
        dataIndex: ["user", "userId"],
        key: "userId",
        width: 110,
        align: "center" as const,
        render: (text: string) => (text ? text.slice(-4) : "-"),
      },
      {
        title: "WhatsApp Number",
        dataIndex: ["user", "whastappNumber"],
        key: "whastappNumber",
        width: 160,
        align: "center" as const,
        render: (value: string) => value || "-",
      },
      {
        title: "Order ID",
        dataIndex: ["order", "orderId"],
        key: "orderId",
        width: 110,
        align: "center" as const,
        render: (text: string) => (text ? text.slice(-4) : "-"),
      },
      {
        title: "Grand Total",
        dataIndex: ["order", "grandTotal"],
        key: "grandTotal",
        width: 140,
        align: "center" as const,
        render: (value: number) =>
          `₹${Number(value || 0).toLocaleString("en-IN")}`,
      },
      {
        title: "Order Date",
        dataIndex: ["order", "orderDate"],
        key: "orderDate",
        width: 200,
        align: "center" as const,
        render: (value: string) =>
          value ? dayjs(value).format("DD-MM-YYYY HH:mm:ss") : "-",
      },
      {
        title: "Actions",
        key: "actions",
        width: 100,
        align: "center" as const,
        render: (_: any, record: MatchedUserOrder) => (
          <Button
            type="primary"
            size="small"
            style={{
              backgroundColor: "#008cba",
              color: "white",
              border: "#008cba",
            }}
            icon={<EyeOutlined />}
            onClick={() => fetchOrderDetails(record.order.orderId)}
            loading={
              orderDetailsLoading &&
              selectedOrder?.orderId === record.order.orderId
            }
          >
            View
          </Button>
        ),
      },
    ],
    [fetchOrderDetails, orderDetailsLoading, selectedOrder]
  );

  const totalRevenue = useMemo(
    () =>
      matchedData.reduce(
        (sum, item) => sum + Number(item.order.grandTotal || 0),
        0
      ),
    [matchedData]
  );

  const totalOrders = matchedData.length;

  const uniqueUsers = useMemo(
    () => new Set(matchedData.map((item) => item.user.userId)).size,
    [matchedData]
  );

  // Modal handlers
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        padding: 16,
        maxWidth: 1400,
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>
          Users Recent Orders
        </div>
      </div>

      {/* Stats */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic
              title="Total Orders"
              value={totalOrders}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic
              title="Unique Users"
              value={uniqueUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>

       
      </Row>

      {/* Table */}
      {loading ? (
        <div style={{ height: 260, display: "grid", placeItems: "center" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Card style={{ borderRadius: 12 }}>
          <Table
            columns={columns as any}
            dataSource={matchedData}
            rowKey={(record) => `${record.user.userId}-${record.order.orderId}`}
            bordered
            size="middle"
            pagination={false}
            // ✅ Responsive table scrolling for all viewports
            scroll={{
              x: 720, // ensures horizontal scroll only on smaller devices
              y: 520,
            }}
          />
        </Card>
      )}

      {/* Pagination */}
      <div
        style={{
          marginTop: 14,
          display: "flex",
          justifyContent: "flex-end",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalUsersCount}
          onChange={handlePageChange}
          showSizeChanger
          pageSizeOptions={["1500", "2000", "3000", "4000"]}
          showTotal={(total) => `Total ${total} users`}
          responsive
        />
      </div>

      {/* Order Details Modal */}
      <Modal
        title={
          <div className="text-lg font-bold text-gray-800">Order Details</div>
        }
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button
            key="print"
            type="primary"
            onClick={handlePrint}
            icon={<AiOutlinePrinter />}
          >
            Print
          </Button>,
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spin size="large" />
          </div>
        ) : selectedOrder ? (
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="bg-gray-100 p-3 rounded-lg mb-4">
              <h3 className="text-md font-semibold text-gray-700 mb-2">
                Order Information
              </h3>
              <table className="w-full border-collapse border border-gray-300 bg-white">
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium bg-gray-50 w-1/3">
                      Order ID
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <span className="font-mono">
                        {selectedOrder?.orderId}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium bg-gray-50">
                      Order Date
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      {selectedOrder?.orderDate}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium bg-gray-50">
                      Order Status
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <Tag
                        color={
                          selectedOrder?.orderStatus === 4
                            ? "green"
                            : selectedOrder?.orderStatus === 6
                            ? "red"
                            : "orange"
                        }
                      >
                        {selectedOrder?.orderStatus
                          ? orderStatusMap[selectedOrder.orderStatus]
                          : "N/A"}
                      </Tag>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium bg-gray-50">
                      Payment Type
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <Tag
                        color={
                          selectedOrder?.paymentType === 1 ? "green" : "blue"
                        }
                      >
                        {selectedOrder?.paymentType
                          ? paymentTypeMap[selectedOrder.paymentType] || "Other"
                          : "N/A"}
                      </Tag>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-gray-100 p-3 rounded-lg mb-4">
              <h3 className="text-md font-semibold text-gray-700 mb-2">
                Customer Information
              </h3>
              <table className="w-full border-collapse border border-gray-300 bg-white">
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium bg-gray-50 w-1/3">
                      Customer Name
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      {selectedOrder?.customerName || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium bg-gray-50">
                      Customer Mobile
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      {(selectedOrder?.customerMobile &&
                      selectedOrder?.customerMobile.trim() !== ""
                        ? selectedOrder.customerMobile
                        : selectedOrder?.mobileNumber) || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium bg-gray-50">
                      Delivery Address
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <div>
                        {selectedOrder?.orderAddress?.flatNo && (
                          <span>
                            <strong>Flat No:</strong>{" "}
                            {selectedOrder.orderAddress.flatNo}
                          </span>
                        )}
                        {selectedOrder?.orderAddress?.landMark && (
                          <div>
                            <strong>Land Mark:</strong>{" "}
                            {selectedOrder.orderAddress.landMark}
                          </div>
                        )}
                        {selectedOrder?.orderAddress?.address && (
                          <div>
                            <strong>Location:</strong>{" "}
                            {selectedOrder.orderAddress.address}
                          </div>
                        )}
                        {selectedOrder?.orderAddress?.pincode && (
                          <div>
                            <strong>Pincode:</strong>{" "}
                            {selectedOrder.orderAddress.pincode}
                          </div>
                        )}
                        {!selectedOrder?.orderAddress && (
                          <span>No address available</span>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-gray-100 p-3 rounded-lg mb-4">
              <h3 className="text-md font-semibold text-gray-700 mb-2">
                Order Items
              </h3>
              <Table
                columns={[
                  {
                    title: "Item Name",
                    dataIndex: "itemName",
                    key: "itemName",
                    align: "left",
                  },
                  {
                    title: "Quantity",
                    dataIndex: "quantity",
                    key: "quantity",
                    align: "center",
                    width: 100,
                  },
                  {
                    title: "Weight",
                    dataIndex: "weight",
                    key: "weight",
                    align: "center",
                    width: 100,
                  },
                  {
                    title: "Price",
                    dataIndex: "price",
                    key: "price",
                    align: "right",
                    render: (text) => `₹${Number(text).toFixed(2) || "0.00"}`,
                    width: 100,
                  },
                ]}
                dataSource={selectedOrder?.orderItems || []}
                rowKey={(record) => record.itemId}
                pagination={false}
                scroll={{ x: 500 }}
                size="small"
                className="bg-white"
              />
            </div>

            <div className="bg-gray-100 p-3 rounded-lg">
              <h3 className="text-md font-semibold text-gray-700 mb-2">
                Payment Details
              </h3>
              <table className="w-full border-collapse border border-gray-300 bg-white">
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium bg-gray-50 w-2/3">
                      Sub Total
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      ₹{Number(selectedOrder?.subTotal).toFixed(2) || "0.00"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium bg-gray-50">
                      Delivery Fee
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      ₹{Number(selectedOrder?.deliveryFee).toFixed(2) || "0.00"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium bg-gray-50">
                      Coupon Amount Used
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      ₹
                      {Number(selectedOrder?.discountAmount).toFixed(2) ||
                        "0.00"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium bg-gray-50">
                      Subscription Amount Used
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      ₹
                      {Number(selectedOrder?.subscriptionAmount).toFixed(2) ||
                        "0.00"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium bg-gray-50">
                      Wallet Amount Used
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      ₹
                      {Number(selectedOrder?.walletAmount).toFixed(2) || "0.00"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium bg-gray-50">
                      Referral Amount Used
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      ₹
                      {Number(selectedOrder?.referralAmountUsed).toFixed(2) ||
                        "0.00"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium bg-gray-50">
                      GST Amount
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      ₹{Number(selectedOrder?.gstAmount).toFixed(2) || "0.00"}
                    </td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="border border-gray-300 px-3 py-2 font-semibold bg-gray-50">
                      Grand Total
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right font-semibold">
                      ₹{Number(selectedOrder?.grandTotal).toFixed(2) || "0.00"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p>No order details available.</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserOrdersIntegration;
