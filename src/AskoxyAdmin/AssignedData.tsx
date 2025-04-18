import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Spin,
  Input,
  Pagination,
  message,
  Tooltip,
  Card,
  Tag,
  Empty,
  Modal,
  Typography,
  Select,
  Row,
  Col,
  Space,
} from "antd";
import {
  CommentOutlined,
  SearchOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  CalendarOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import axios from "axios";
import BASE_URL from "../Config";
import { ColumnsType } from "antd/es/table";

const { TextArea } = Input;
const { Text } = Typography;
const { Option } = Select;

interface UserData {
  userId: string;
  id: string; // Added for comment functionality
  userType: string;
  userName: string;
  mobileNumber: string;
  whastappNumber: string | null;
  countryCode: string | null;
  whatsappVerified: boolean;
  mobileVerified: boolean;
  registeredFrom: string | null;
  ericeCustomerId: number;
  alterNativeMobileNumber: string | null;
  firstName: string | null;
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
  gender: string | null;
  assignCoins: string;
  mutliChainCreatedAt: string | null;
  multiChainAddress: string | null;
  assignedTo: string;
}

interface OrderData {
  orderId: string;
  orderStatus: string;
  newOrderId: string;
  customerId: string;
  subTotal: number;
  grandTotal: number;
  deliveryFee: number;
  paymentType: number;
  orderDate: string;
  timeSlot: string;
  dayOfWeek: string;
  expectedDeliveryDate: string;
  orderItems: any[] | null;
}

interface Comment {
  adminComments: string;
  commentsUpdateBy: string;
  commentsCreatedDate?: string;
  userId?: string;
}

interface ApiResponse {
  totalCount: number;
  activeUsersResponse: UserData[];
}

const AssignedDataPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(100);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [uniqueId, setUniqueId] = useState<string>("");
  //orderModal
  const [loader, setLoader] = useState<boolean>(false);
  const [orderDetailsVisible, setOrderDetailsVisible] =
    useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userOrders, setUserOrders] = useState<OrderData[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Comments state
  const [commentsModalVisible, setCommentsModalVisible] =
    useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>("");
  const [submittingComment, setSubmittingComment] = useState<boolean>(false);
  const [record, setRecord] = useState<UserData | null>(null);
  const updatedBy = localStorage.getItem("userName")?.toUpperCase();
  const [orderId, setOrderId] = useState<string>("");
  const storedUniqueId = localStorage.getItem("uniquId");

  useEffect(() => {
    const storedUniqueId = localStorage.getItem("uniquId");
    if (storedUniqueId) {
      setUniqueId(storedUniqueId);
    } else {
      message.error("User ID not found. Please login again.");
    }

    fetchData();
  }, [currentPage, pageSize]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // We need to fetch all data first to filter it by assignedTo
      const response = await axios.post<ApiResponse>(
        `${BASE_URL}/user-service/allOxyUsersAssignedBasedOnId?helpdeskUserId=${storedUniqueId}`,
        {
          pageNo: currentPage,
          pageSize: pageSize,
        },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );

      const filteredUsers = response.data.activeUsersResponse.filter(
        (user) => user.assignedTo === storedUniqueId
      );

      setUserData(filteredUsers);

      setTotalCount(response.data.totalCount);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch assigned user data");
      setLoading(false);
    }
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };

  const showCommentsModal = async (record: UserData | null) => {
    setCommentsModalVisible(true);
    await fetchComments(record);
  };

  const fetchComments = async (record: UserData | null): Promise<void> => {
    console.log(record);

    if (!record || !record.userId) return;

    setLoadingComments(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/user-service/fetchAdminComments`,
        { userId: record.userId },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data && typeof response.data === "object") {
        setComments(response.data);
      } else {
        setComments([]);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 500) {
        message.info("No comments found");
      } else {
        message.error(
          "Failed to load comments...please try again after some time."
        );
      }
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const fetchOrderDetails = async (userId: string) => {
    setLoader(true);
    try {
      const response = await axios.post(
        BASE_URL + "/order-service/getAllOrders_customerId",
        { userId },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );

      setUserOrders(response.data);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching order details:", error);
      message.error("Failed to load order details");
      setLoader(false);
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
      case "4":
        return "Delivered";
      case "5":
        return "Rejected";
      case "6":
        return "cancelled";
      case "PickedUp":
        return "pickedUp";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "1":
        return "blue";
      case "2":
        return "processing";
      case "3":
        return "purple";
      case "4":
        return "success";
      case "5":
        return "error";
      case "6":
        return "error";
      case "PickedUp":
        return "orange";
      default:
        return "default";
    }
  };
  const getPaymentTypeText = (type: number) => {
    switch (type) {
      case 1:
        return "Online";
      case 2:
        return "Cash on Delivery";
      default:
        return "Unknown";
    }
  };

  const handleSubmitComment = async (): Promise<void> => {
    if (!newComment.trim()) {
      message.warning("Please enter a comment");
      return;
    }
    setOrderId("");

    let update = updatedBy;
    const type = localStorage.getItem("primaryType");
    if (type === "SELLER") {
      update = "ADMIN";
    }

    let comment = newComment;

    if (orderId) {
      comment = `Regarding order Id ${orderId} ${newComment}`;
    }
    setSubmittingComment(true);
    try {
      await axios.patch(
        `${BASE_URL}/user-service/adminUpdateComments`,
        {
          adminComments: comment,
          commentsUpdateBy: update,
          adminUserId: storedUniqueId,
          userId: record?.userId,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      message.success("Comment added successfully");
      setNewComment("");
      await fetchComments(record);
    } catch (error) {
      console.error("Error submitting comment:", error);
      message.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const orderColumns = [
    {
      title: "Order ID",
      dataIndex: "newOrderId",
      key: "newOrderId",
      render: (text: string, record: OrderData) => <p>{text}</p>,
    },
    {
      title: "Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (text: string) => {
        return new Date(text).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        });
      },
    },
    {
      title: "Amount",
      dataIndex: "grandTotal",
      key: "grandTotal",
      render: (text: number) => `₹${text.toFixed(2)}`,
    },
    {
      title: "Expected Delivery",
      dataIndex: "expectedDeliveryDate",
      key: "expectedDeliveryDate",
      render: (expectedDeliveryDate: string, record: OrderData) => (
        <div>
          <p>{new Date(expectedDeliveryDate).toLocaleDateString()}</p>
          <p>{record.timeSlot}</p>
          <p>{record.dayOfWeek}</p>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (text: string) => (
        <Tag color={getStatusColor(text)}>{getStatusText(text)}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: "center" as const,
      render: (record: OrderData) => (
        <Space direction="vertical" size="small">
          <Button
            type="default"
            size="small"
            onClick={() => {
              setRecord(selectedUser);
              showCommentsModal(selectedUser);
              setOrderId(record.orderId);
            }}
            className="w-full rounded-md bg-purple-100 hover:bg-purple-200 border-purple-300 text-purple-700"
          >
            Comments
          </Button>
        </Space>
      ),
    },
  ];

  const viewOrderDetails = (record: UserData) => {
    setSelectedUser(record);
    setOrderDetailsVisible(true);
    fetchOrderDetails(record.userId);
  };

  // Filter data if search term exists
  const filteredData = searchTerm
    ? userData.filter(
        (user) =>
          user.mobileNumber?.includes(searchTerm) ||
          user.lastFourDigitsUserId?.includes(searchTerm) ||
          (user.firstName &&
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          String(user.ericeCustomerId).includes(searchTerm)
      )
    : userData;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns: ColumnsType<UserData> = [
    {
      title: "User ID",
      dataIndex: "lastFourDigitsUserId",
      key: "lastFourDigitsUserId",
      width: 50,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Mobile",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      width: 160,
      render: (_: string, record: UserData) => {
        const mobile = record.mobileNumber;
        const whatsapp = record.whastappNumber;
        const alterNativeMobileNumber = record.alterNativeMobileNumber;

        const tagStyle = {
          fontSize: "14px",
          width: "120px",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
        };

        const tags = [];

        if (mobile) {
          tags.push(
            <Tag color="purple" style={tagStyle} key="mobile">
              <PhoneOutlined className="mr-1" />
              {mobile}
            </Tag>
          );
        }

        if (whatsapp && whatsapp !== mobile) {
          tags.push(
            <Tag color="green" style={tagStyle} key="whatsapp">
              <WhatsAppOutlined className="mr-1" />
              {whatsapp}
            </Tag>
          );
        }

        if (
          alterNativeMobileNumber &&
          alterNativeMobileNumber !== mobile &&
          alterNativeMobileNumber !== whatsapp
        ) {
          tags.push(
            <Tag color="blue" style={tagStyle} key="alt">
              <PhoneOutlined className="mr-1" />
              {alterNativeMobileNumber}
            </Tag>
          );
        }

        return tags.length > 0 ? (
          <div className="flex flex-col gap-1">{tags}</div>
        ) : null;
      },
    },
    {
      title: "Name",
      dataIndex: "firstName",
      key: "name",
      width: 90,
      render: (_text, record) => {
        const fullName = `${record.firstName || ""} ${
          record.lastName || ""
        }`.trim();
        return (
          <Tooltip title={fullName || "No Name Provided"}>
            <span className="flex items-center">
              {/* <UserOutlined className="mr-2 text-gray-500" /> */}
              {fullName ? (
                fullName
              ) : (
                <span className="text-gray-400">No Name</span>
              )}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 120,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text || "No Email"}>
          <span className="flex items-center">
            {/* <MailOutlined className="mr-2 text-gray-500" /> */}
            {text ? (
              text.length > 25 ? (
                `${text.substring(0, 25)}...`
              ) : (
                text
              )
            ) : (
              <span className="text-gray-400">No Email</span>
            )}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Registration Date",
      dataIndex: "userRegisterCreatedDate",
      key: "userRegisterCreatedDate",
      width: 90,
      render: (date: string) => (
        <span className="flex items-center">
          {/* <CalendarOutlined className="mr-2 text-gray-500" /> */}
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      title: "Registered From",
      dataIndex: "userType",
      key: "userType",
      width: 80,
      render: (_: string, record: UserData) => (
        <>
          <Tag className="mb-1" color="green">
            {record.userType}
          </Tag>
          <Tag color="geekblue">{record.registeredFrom}</Tag>
        </>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 120,
      ellipsis: true,
      render: (text: string | null) => (
        <Tooltip title={text || "No Address Provided"}>
          <span className="flex items-center">
            {/* <HomeOutlined className="mr-2 text-gray-500" /> */}
            {text ? (
              text.length > 15 ? (
                `${text.substring(0, 15)}...`
              ) : (
                text
              )
            ) : (
              <span className="text-gray-400">No Address</span>
            )}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 140, // increased to accommodate both buttons with space
      render: (_text, record) => (
        <div className="flex gap-2">
          <Button
            type="default"
            size="small"
            onClick={() => {
              setRecord(record);
              showCommentsModal(record);
            }}
            className="rounded-md border border-blue-400 text-blue-600 hover:bg-blue-100"
          >
            Comments
          </Button>
          <Button
            type="default"
            size="small"
            onClick={() => viewOrderDetails(record)}
            className="rounded-md border border-green-400 text-green-600 hover:bg-green-100"
          >
            Orders
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card className="shadow-lg rounded-lg border-0">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Assigned Users
          {/* <Tag color="green" className="ml-3">
              {filteredData.length} Users
            </Tag> */}
        </h1>
        <div className="w-64">
          <Input
            placeholder="Search by mobile, ID or name"
            prefix={<SearchOutlined className="text-gray-400" />}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
            className="rounded-md"
          />
        </div>
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4"></div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Loading your assigned users..." />
        </div>
      ) : filteredData.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="userId"
              pagination={false}
              className="border border-gray-200 rounded-lg"
              scroll={{ x: 1200 }}
              size="middle"
              rowClassName={(record, index) =>
                index % 2 === 0 ? "bg-gray-50" : ""
              }
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalCount}
              onChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              // showTotal={(total) => `Total ${total} items`}
            />
          </div>
        </>
      ) : (
        <Empty
          description="No assigned users found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="my-12"
        />
      )}

      {/* Comments Modal */}
      <Modal
        zIndex={150}
        title="HelpDesk Comments"
        open={commentsModalVisible}
        onCancel={() => {
          setCommentsModalVisible(false);
          setComments([]);
          setOrderId("");
        }}
        footer={null}
        width={550}
      >
        <div className="flex flex-col">
          {/* Comments Section */}
          <div className="mb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-3">
              Recent Comments
            </h3>

            {loadingComments ? (
              <div className="flex items-center justify-center py-6">
                <Spin size="default" />
                <span className="ml-3 text-gray-500">Loading comments...</span>
              </div>
            ) : comments && comments.length > 0 ? (
              <div className="w-full max-w-xl max-h-80 overflow-y-auto border border-gray-200 rounded-lg shadow-sm bg-white">
                {comments.map((comment, index) => {
                  const initials = (comment.commentsUpdateBy || "Unknown")
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase();

                  const colorOptions = [
                    "bg-green-100 text-green-700",
                    "bg-purple-100 text-purple-700",
                    "bg-amber-100 text-amber-700",
                    "bg-teal-100 text-teal-700",
                    "bg-rose-100 text-rose-700",
                    "bg-indigo-100 text-indigo-700",
                  ];

                  const colorIndex =
                    comment.commentsUpdateBy?.length % colorOptions.length || 0;
                  const avatarColor = colorOptions[colorIndex];

                  return (
                    <div
                      key={index}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <div className="px-3 py-1.5 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center mb-0.5">
                          <div
                            className={`w-6 h-6 rounded-full ${avatarColor} flex items-center justify-center text-[10px] font-semibold mr-2`}
                          >
                            {initials}
                          </div>
                          <span className="font-medium text-sm text-gray-800">
                            {comment.commentsUpdateBy || "Unknown"}
                          </span>
                          <span className="text-[10px] text-gray-400 ml-auto">
                            {
                              formatDate(comment.commentsCreatedDate).split(
                                ","
                              )[0]
                            }
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 pl-8 mt-0.5 leading-snug">
                          {comment.adminComments}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 border border-gray-200 rounded-lg bg-gray-50">
                <svg
                  className="w-6 h-6 text-gray-400 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-sm text-gray-500">No comments available</p>
              </div>
            )}
          </div>

          {/* Add Comment Section */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-3">
              <TextArea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Type your comment here..."
                autoSize={{ minRows: 3, maxRows: 5 }}
                className="text-sm rounded-lg border-gray-300"
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  size="middle"
                  onClick={() => {
                    setCommentsModalVisible(false);
                    setComments([]);
                  }}
                  className="hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  size="middle"
                  onClick={handleSubmitComment}
                  loading={submittingComment}
                  className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        zIndex={100}
        title={
          <span style={{ color: "#1890ff", fontSize: "20px" }}>
            Order Details
          </span>
        }
        open={orderDetailsVisible}
        onCancel={() => {
          setOrderDetailsVisible(false);
          setSelectedUser(null);
          setUserOrders([]);
          setSelectedOrderId(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setOrderDetailsVisible(false);
              setSelectedUser(null);
            }}
            style={{
              backgroundColor: "#ff4d4f",
              color: "white",
              border: "none",
            }}
          >
            Close
          </Button>,
        ]}
        width={800}
        style={{ borderRadius: "8px", overflow: "hidden" }}
      >
        {loader ? (
          <div
            style={{
              textAlign: "center",
              padding: "30px",
              background: "#f0f2f5",
              borderRadius: "8px",
            }}
          >
            <Spin size="large" style={{ color: "#1890ff" }} />
            <p style={{ color: "#595959", marginTop: "10px" }}>
              Loading order details...
            </p>
          </div>
        ) : (
          <>
            {selectedUser && (
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card
                    title={
                      <span style={{ color: "#2f54eb" }}>
                        Customer Information
                      </span>
                    }
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      background: "linear-gradient(to right, #fff, #f9faff)",
                    }}
                  >
                    <p style={{ color: "#595959" }}>
                      <strong style={{ color: "#1d39c4" }}>Name:</strong>
                      {""}
                      {selectedUser.userName || "N/A"}
                    </p>
                    <p style={{ color: "#595959" }}>
                      <strong style={{ color: "#1d39c4" }}>Email: </strong>{" "}
                      {selectedUser.email || "N/A"}
                    </p>
                    <p style={{ color: "#595959" }}>
                      <strong style={{ color: "#1d39c4" }}>Phone: </strong>{" "}
                      {selectedUser.whastappNumber ||
                        selectedUser.mobileNumber ||
                        "N/A"}
                    </p>
                    <p style={{ color: "#595959" }}>
                      <strong style={{ color: "#1d39c4" }}>User ID: </strong>{" "}
                      {selectedUser.id || "N/A"}
                    </p>
                    <p style={{ color: "#595959" }}>
                      <strong style={{ color: "#1d39c4" }}>Address: </strong>{" "}
                      {selectedUser.address || "N/A"}
                    </p>
                  </Card>
                </Col>

                <Col span={24}>
                  <Card
                    title={
                      <span style={{ color: "#2f54eb" }}>Orders History</span>
                    }
                    extra={
                      <Text type="secondary" style={{ color: "#722ed1" }}>
                        {userOrders.length} orders found
                      </Text>
                    }
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      background: "linear-gradient(to right, #fff, #f9faff)",
                    }}
                  >
                    <Table
                      dataSource={userOrders}
                      columns={orderColumns}
                      rowKey="orderId"
                      pagination={false}
                      size="small"
                      scroll={{ x: "max-content" }}
                      rowClassName={(_, index) =>
                        index % 2 === 0 ? "table-row-light" : "table-row-dark"
                      }
                      locale={{
                        emptyText: (
                          <span className="text-gray-500">
                            No orders found for this user.
                          </span>
                        ),
                      }}
                    />
                  </Card>
                </Col>
              </Row>
            )}
          </>
        )}
      </Modal>
    </Card>
  );
};

export default AssignedDataPage;
