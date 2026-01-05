import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Spin,
  Input,
  Pagination,
  Tag,
  Card,
  Empty,
  Tooltip,
  Typography,
  message,
  Space,
  Row,
  Col,
  Select,
  SelectProps,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
  CommentOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import BASE_URL from "../Config";
import HelpDeskCommentsModal from "./HelpDeskCommentsModal";
const { TextArea } = Input;
const { Text } = Typography;
const emojiOptions: SelectProps["options"] = [
  { label: "😊 Polite", value: "POLITE" },
  { label: "😎 Friendly", value: "FRIENDLY" },
  { label: "😎 Cool", value: "COOL" },
  { label: "😤 Frustrated", value: "FRUSTRATED" },
  { label: "😞 Disappointed", value: "DISAPPOINTED" },
  { label: "😠 Rude", value: "RUDE" },
  { label: "😡 Angry", value: "ANGRY" },
  { label: "🤝 Understanding", value: "UNDERSTANDING" },
  { label: "😕 Confused", value: "CONFUSED" },
  { label: "📞 Busy", value: "BUSY" },
  { label: "📴 Out of Service", value: "OUTOFSERVICE" },
  { label: "❌ Not Connected", value: "NOTCONNECTED" },
  { label: "🔌 Disconnected", value: "DISCONNECTED" },
  { label: "⏳ Call Waiting", value: "CALLWAITING" },
];

interface ReferralData {
  id: string | null;
  referenceStatus: string;
  email: string | null;
  whatsappnumber: string;
  firstName: string | null;
  lastName: string | null;
  userName: string;
  dob: string | null;
  address: string | null;
  errorMessage: string | null;
  status: boolean;
  created_at: number[] | null;
  referee: string | null;
  referrer: string;
}

interface Comment {
  adminComments: string;
  commentsUpdateBy: string;
  commentsCreatedDate?: string;
  userId?: string;
  customerBehaviour?: string;
}

const ReferredData: React.FC = () => {
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [uniqueReferrers, setUniqueReferrers] = useState<ReferralData[]>([]);
  const [details, setDetails] = useState<ReferralData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingButtonId, setLoadingButtonId] = useState<string | null>(null);

  // Comments related states
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [userResponse, setUserResponse] = useState<string | undefined>();

  const [selectedRecord, setSelectedRecord] = useState<ReferralData | null>(
    null
  );
  const updatedBy = localStorage.getItem("admin_userName")?.toUpperCase() || "ADMIN";

  useEffect(() => {
    fetchReferrals();
  }, []);

  // for getting user response
  const handleUserResponseChange = (value: string) => {
    console.log("User Response:", value);
    setUserResponse(value);
  };

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const response = await axios.get<ReferralData[]>(
        `${BASE_URL}/reference-service/getallreferaldata`,
        {
          headers: { accept: "*/*" },
        }
      );
      setReferrals(response.data);
      const unique = Array.from(
        new Map(
          response.data.map((item: ReferralData) => [item.referrer, item])
        ).values()
      );
      setUniqueReferrers(unique);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      message.error("Failed to fetch referral data");
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async (referrerId: string) => {
    // First show the modal
    setIsModalVisible(true);
    // Then start loading details inside the modal
    setDetailsLoading(true);
    setLoadingButtonId(referrerId);

    try {
      const response = await axios.get<ReferralData[]>(
        `${BASE_URL}/reference-service/getreferencedetails/${referrerId}`
      );
      setDetails(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
      message.error("Failed to fetch reference details");
    } finally {
      setDetailsLoading(false);
      setLoadingButtonId(null);
    }
  };

  const showCommentsModal = async (record: ReferralData) => {
    setSelectedRecord(record);
    setCommentsModalVisible(true);
    // await fetchComments(record);
  };

  // const fetchComments = async (record: ReferralData): Promise<void> => {
  //   if (!record || !record.referrer) return;

  //   setLoadingComments(true);
  //   try {
  //     const response = await axios.post(
  //       `${BASE_URL}/user-service/fetchAdminComments`,
  //       { userId: record.referrer },
  //       { headers: { "Content-Type": "application/json" } }
  //     );

  //     if (response.data && typeof response.data === "object") {
  //       setComments(response.data);
  //     } else {
  //       setComments([]);
  //     }
  //   } catch (error: any) {
  //     if (error.response && error.response.status === 500) {
  //       message.info("No comments found");
  //     } else {
  //       message.error(
  //         "Failed to load comments... please try again after some time."
  //       );
  //     }
  //     setComments([]);
  //   } finally {
  //     setLoadingComments(false);
  //   }
  // };

  const handleSubmitComment = async (): Promise<void> => {
    if (!userResponse?.trim()) {
      message.warning("Please enter customer behaviour");
      return;
    }
    if (!newComment.trim()) {
      message.warning("Please enter a comment");
      return;
    }

    setSubmittingComment(true);
    try {
      await axios.patch(
        `${BASE_URL}/user-service/adminUpdateCommen`,
        {
          adminComments: newComment,
          commentsUpdateBy: updatedBy,
          adminUserId: localStorage.getItem("admin_uniquId"),
          userId: selectedRecord?.referrer,
          customerBehaviour: userResponse,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      message.success("Comment added successfully");
      setNewComment("");
      setUserResponse(undefined);
      // await fetchComments(selectedRecord as ReferralData);
    } catch (error) {
      console.error("Error submitting comment:", error);
      message.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
      setNewComment("");
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };

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

  // Format created_at date from number array with first 3 digits of month
  const formatCreatedDate = (dateArray: number[] | null) => {
    if (!dateArray || dateArray.length < 6) return "";
    const [year, month, day] = dateArray;
    const date = new Date(year, month - 1, day,);

    // Format to show first 3 letters of month
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[date.getMonth()]} ${day}, ${year} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  // Filter data if search term exists
  const filteredData = searchTerm
    ? uniqueReferrers.filter(
        (user) =>
          user.whatsappnumber?.includes(searchTerm) ||
          (user.firstName &&
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.lastName &&
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          user.referrer?.includes(searchTerm)
      )
    : uniqueReferrers;

  // Pagination for table data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Get status tag color based on reference status
  const getStatusTagColor = (status: string): string => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("register")) return "green";
    if (statusLower.includes("order")) return "blue";
    if (statusLower.includes("pend")) return "orange";
    if (statusLower.includes("reject")) return "red";
    if (statusLower.includes("invite")) return "purple";
    if (statusLower.includes("active")) return "cyan";
    if (statusLower.includes("complete")) return "geekblue";
    return "default";
  };

  const columns = [
    {
      title: "Referrer ID",
      dataIndex: "referrer",
      key: "referrer",
      width: 120,
      render: (text: string) => {
        const lastFourDigits = text.slice(-4);
        return <Tag color="blue">{lastFourDigits}</Tag>;
      },
    },
    {
      title: "Name",
      key: "name",
      width: 150,
      render: (record: ReferralData) => {
        const fullName = `${record.firstName || ""} ${
          record.lastName || ""
        }`.trim();
        return (
          <Tooltip title={fullName || "No Name Provided"}>
            <span className="flex items-center">
              {fullName ? (
                <span className="text-gray-700">{fullName}</span>
              ) : (
                <span className="text-gray-400">No Name</span>
              )}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: "Contact",
      key: "contact",
      width: 160,
      render: (record: ReferralData) => {
        const tagStyle = {
          fontSize: "14px",
          width: "120px",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
        };

        const tags = [];

        if (record.whatsappnumber) {
          tags.push(
            <Tag color="green" style={tagStyle} key="whatsapp">
              <WhatsAppOutlined className="mr-1" />
              {record.whatsappnumber}
            </Tag>
          );
        }

        if (record.email) {
          tags.push(
            <Tooltip title={record.email} key="email">
              <Tag color="blue" style={{ ...tagStyle, marginTop: "5px" }}>
                {record.email.length > 12
                  ? `${record.email.substring(0, 12)}...`
                  : record.email}
              </Tag>
            </Tooltip>
          );
        }

        return tags.length > 0 ? (
          <div className="flex flex-col gap-1">{tags}</div>
        ) : (
          <span className="text-gray-400">No Contact</span>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (record: ReferralData) => (
        <div className="flex gap-2">
          <Button
            type="default"
            size="small"
            onClick={() => showCommentsModal(record)}
            icon={<CommentOutlined />}
            className="rounded-md border border-purple-400 text-purple-600 hover:bg-purple-50"
          >
            Comments
          </Button>
          <Button
            type="default"
            size="small"
            onClick={() => fetchDetails(record.referrer)}
            loading={loadingButtonId === record.referrer}
            icon={<EyeOutlined />}
            className="rounded-md border border-cyan-400 text-cyan-600 hover:bg-cyan-50"
          >
            Details
          </Button>
        </div>
      ),
    },
  ];

  const detailsColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text: string | null) => (
        <span className="text-xs sm:text-sm break-all">
          {text ? text.slice(-4) : "N/A"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "referenceStatus",
      key: "referenceStatus",
      render: (text: string) => {
        const color = getStatusTagColor(text);
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "WhatsApp",
      dataIndex: "whatsappnumber",
      key: "whatsappnumber",
      render: (text: string) => (
        <Tag
          color="green"
          icon={<WhatsAppOutlined />}
          className="text-xs sm:text-sm"
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Registration Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: number[] | null) => (
        <span className="text-xs sm:text-sm">
          {formatCreatedDate(created_at)}
        </span>
      ),
    },
  ];

  return (
    <Card className="shadow-lg rounded-lg border-0">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Referred Data
          {/* <Tag color="green" className="ml-3">
            {filteredData.length} Referrers
          </Tag> */}
        </h1>
        <div className="w-64">
          <Input
            placeholder="Search by name, ID or number"
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
          <Spin size="large" tip="Loading referral data..." />
        </div>
      ) : paginatedData.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={paginatedData}
              rowKey="referrer"
              pagination={false}
              className="border border-gray-200 rounded-lg"
              scroll={{ x: 800 }}
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
              total={filteredData.length}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={["10", "20", "50", "100"]}
            />
          </div>
        </>
      ) : (
        <Empty
          description="No referral data found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="my-12"
        />
      )}

      {/* Details Modal */}
      <Modal
        title={
          <span className="text-lg sm:text-xl text-blue-600">
            Referral Details
          </span>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button
            key="close"
            onClick={() => setIsModalVisible(false)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Close
          </Button>,
        ]}
        width="90%"
        className="max-w-4xl"
        bodyStyle={{ padding: "16px" }}
      >
        {detailsLoading ? (
          <div className="flex justify-center items-center py-16">
            <Spin size="large" tip="Loading details..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table
              columns={detailsColumns}
              dataSource={details}
              rowKey="id"
              pagination={false}
              className="mt-4"
              scroll={{ x: "max-content" }}
              rowClassName={(_, index) => (index % 2 === 0 ? "bg-gray-50" : "")}
              locale={{
                emptyText: (
                  <Empty
                    description="No referral details found"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ),
              }}
            />
          </div>
        )}
      </Modal>

      {/* Comments Modal */}
      {/* <Modal
        zIndex={150}
        title={
          <span className="text-lg font-medium text-purple-700">
            HelpDesk Comments
          </span>
        }
        open={commentsModalVisible}
        onCancel={() => {
          setCommentsModalVisible(false);
          setComments([]);
          setNewComment("");
          setUserResponse(undefined);
        }}
        footer={null}
        width={550}
      >
        <div className="flex flex-col">
        
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
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            User Response
          </h3>
          <Select
            style={{ width: "100%" }}
            placeholder="Select a response"
            options={emojiOptions}
            value={userResponse}
            onChange={handleUserResponseChange}
          />
        
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
                    setUserResponse(undefined);
                    setNewComment("");
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
                  className="bg-purple-600 hover:bg-purple-700 border-purple-600"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
        </Modal> */}
      <HelpDeskCommentsModal
        open={commentsModalVisible}
        onClose={() => setCommentsModalVisible(false)}
        userId={selectedRecord?.referrer}
        updatedBy={updatedBy}
        storedUniqueId={localStorage.getItem("admin_uniquId")}
        record={selectedRecord}
        BASE_URL={BASE_URL}
      />
    </Card>
  );
};

export default ReferredData;
