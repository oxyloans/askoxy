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
  id: string;
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

interface HelpDeskUser {
  mail: string;
  userId: string;
  createdAt: string;
  emailVerified: string;
  name: string;
  lastFourDigitsUserId: string;
}

const DataAssigned: React.FC = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(100);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [uniqueId, setUniqueId] = useState<string>("");
  const [helpDeskUsers, setHelpDeskUsers] = useState<HelpDeskUser[]>([]);

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
    if (storedUniqueId) {
      setUniqueId(storedUniqueId);
    } else {
      message.error("User ID not found. Please login again.");
    }

    fetchData();
    fetchHelpDeskUsers();
  }, [currentPage, pageSize]);

  const fetchHelpDeskUsers = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user-service/getAllHelpDeskUsers`,
        {
          headers: {
            accept: "*/*",
          },
        }
      );
      setHelpDeskUsers(response.data);
    } catch (error) {
      console.error("Error fetching helpdesk users:", error);
      message.error("Failed to fetch helpdesk users");
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const storedUniqueId = localStorage.getItem("uniquId");

      const response = await axios.post<ApiResponse>(
        `${BASE_URL}/user-service/allOxyUsersAssignedToHelpDesk`,
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

      setUserData(response.data.activeUsersResponse);
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

  const showCommentsModal = async (record: UserData) => {
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

  const filteredData = searchTerm
    ? userData.filter(
        (user) =>
          user.mobileNumber?.includes(searchTerm) ||
          user.lastFourDigitsUserId?.includes(searchTerm) ||
          user.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const getHelpDeskName = (assignedToId: string): string => {
    const helpDeskUser = helpDeskUsers.find(
      (user) => user.userId === assignedToId
    );
    return helpDeskUser ? helpDeskUser.name : "Unknown";
  };

  const columns: ColumnsType<UserData> = [
    {
      title: "User ID",
      dataIndex: "lastFourDigitsUserId",
      key: "lastFourDigitsUserId",
      width: 50,
      render: (text: string) => (
        <Tag color="blue" className="font-normal text-sm">
          #{text}
        </Tag>
      ),
    },
    {
      title: "Mobile",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      width: 90,
      render: (_: string, record: UserData) => {
        const mobile = record.mobileNumber;
        const whatsapp = record.whastappNumber;

        const tagStyle = {
          fontSize: "14px",
          width: "120px",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
        };

        if (mobile) {
          return (
            <Tag color="purple" style={tagStyle}>
              <PhoneOutlined className="mr-1" />
              {mobile}
            </Tag>
          );
        }
        if (whatsapp) {
          return (
            <Tag color="green" style={tagStyle}>
              <WhatsAppOutlined className="mr-1" />
              {whatsapp}
            </Tag>
          );
        } else {
          return null;
        }
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
      title: "Assigned To",
      dataIndex: "assignedTo",
      key: "assignedTo",
      width: 90,
      render: (assignedTo: string) => {
        const helpDeskName = getHelpDeskName(assignedTo);
        return (
          <Tag color="cyan" className="capitalize">
            <UserOutlined className="mr-1" />
            {helpDeskName}
          </Tag>
        );
      },
    },
    {
      title: "Registration Date",
      dataIndex: "userRegisterCreatedDate",
      key: "userRegisterCreatedDate",
      width: 90,
      render: (date: string) => (
        <span className="flex items-center">
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
      width: 80,
      render: (_text, record) => (
        <Button
          type="default"
          size="small"
          onClick={() => {
            setRecord(record);
            showCommentsModal(record);
          }}
          className="w-full rounded-md bg-purple-100 hover:bg-purple-200 border-purple-300 text-purple-700"
        >
          Comments
        </Button>
      ),
    },
  ];

  return (
    <Card className="shadow-lg rounded-lg border-0">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Assigned Users To Team
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
    </Card>
  );
};

export default DataAssigned;
