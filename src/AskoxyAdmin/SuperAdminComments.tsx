import { useState, useEffect } from "react";
import { Table, Card, Typography, Tag, Spin, message } from "antd";
import axios from "axios";
import BASE_URL from "../Config";

const { Title, Text } = Typography;

// Define TypeScript interfaces
interface SuperAdminComment {
  userId: string;
  adminComments: string;
  commentsCreatedDate: string;
  commentsUpdateBy: string;
  adminUserId: string;
  superAdminCommentsUpdatedDate: string;
  superAdminComments: string;
  superAdminUserId: string;
  primaryTableId: string;
  userDetails?: UserDetail;
}

interface UserDetail {
  userId: string;
  userType: string;
  userName: string;
  mobileNumber: string;
  whastappNumber: string | null;
  email: string;
  lastFourDigitsUserId: string;
  userRegisterCreatedDate: string;
}

const SuperAdminComments = () => {
  const [comments, setComments] = useState<SuperAdminComment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    fetchSuperAdminComments();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchSuperAdminComments = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        BASE_URL + "/user-service/fetchSuperAdminComments",
        "",
        {
          params: {
            superAdminCommentsId: "91d2f250-20d0-44a5-9b4e-2acb73118b98",
          },
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        const commentsWithUserDetails = await Promise.all(
          response.data.map(async (comment) => {
            const userDetails = await fetchUserDetails(comment.userId);
            return {
              ...comment,
              userDetails,
            };
          })
        );

        setComments(commentsWithUserDetails);
      } else {
        message.warning("Received unexpected response format from the API");
        setComments([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching super admin comments:", error);
      message.error("Failed to fetch comments data");
      setLoading(false);
    }
  };

  const fetchUserDetails = async (
    userId: string
  ): Promise<UserDetail | undefined> => {
    try {
      const response = await axios.post(
        BASE_URL +"/user-service/getDataWithMobileOrWhatsappOrUserId",
        { userId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (
        response.data &&
        response.data.activeUsersResponse &&
        Array.isArray(response.data.activeUsersResponse) &&
        response.data.activeUsersResponse.length > 0
      ) {
        return response.data.activeUsersResponse[0];
      } else {
        console.warn(`No user details found for userId: ${userId}`);
        return undefined;
      }
    } catch (error) {
      console.error(`Error fetching user details for userId ${userId}:`, error);
      return undefined;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString.split(" ")[0];
    }
  };

  const columns = [
    {
      title: "User Details",
      key: "userDetails",
      render: (text: string, record: SuperAdminComment) => (
        <div>
          <div className="mb-1">
            <Text>
              {record.userDetails?.mobileNumber ||
                record.userDetails?.whastappNumber ||
                "No contact info"}
            </Text>
          </div>
          <div>
            <Tag color="blue" className="rounded-full">{record.userDetails?.userType || "Unknown"}</Tag>
          </div>
          <div className="mt-1">
            <Tag color="purple" className="rounded-full">
              {record.userDetails?.lastFourDigitsUserId || "Unknown"}
            </Tag>
          </div>
        </div>
      ),
    },
   {
  title: "Helpdesk Comments",
  dataIndex: "adminComments",
  key: "adminComments",
  width: 180,
  render: (_: string, record: any) => (
    <div className="max-h-24 overflow-auto whitespace-pre-wrap break-words rounded space-y-1">
      {/* Admin Comments */}
      {record.adminComments && (
        <div>
          {record.adminComments}
        </div>
      )}

      {/* Calling Type */}
      {record.callingType && (
        <div className="text-xs text-gray-500">
          Calling Type: {record.callingType}
        </div>
      )}

      {/* Fallback */}
      {!record.adminComments && !record.callingType && (
        <span>-</span>
      )}
    </div>
  ),
},

    {
      title: "Updated By",
      dataIndex: "commentsUpdateBy",
      key: "commentsUpdateBy",
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Comments Date",
      dataIndex: "commentsCreatedDate",
      key: "commentsCreatedDate",
      render: (text: string) => formatDate(text),
    },
    {
      title: "Super Admin Comments",
      dataIndex: "superAdminComments",
      key: "superAdminComments",
      width: 200,
      render: (text: string) => (
        <div className="max-h-24 overflow-auto whitespace-pre-wrap break-words rounded">
          <Text strong>{text}</Text>
        </div>
      ),
    },
    {
      title: "Super Admin Update Date",
      dataIndex: "superAdminCommentsUpdatedDate",
      key: "superAdminCommentsUpdatedDate",
      render: (text: string) => formatDate(text),
    },
  ];

  return (
    <Card className="p-2 md:p-2 bg-gray-50 min-h-screen shadow-md">
      <Title level={3} className="mb-6 text-blue-700">
        SuperAdmin Comments
      </Title>
      {loading ? (
        <div className="flex justify-center p-8">
          <Spin size="large" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center p-8">
          <Text>No comments found</Text>
        </div>
      ) : (
        <div className="w-full">
          <Table
            dataSource={comments}
            columns={columns}
            rowKey="primaryTableId"
            pagination={{ pageSize: 10 }}
            className="border border-gray-200 rounded-md"
            scroll={isMobile ? { x: "max-content" } : undefined}
          />
        </div>
      )}
    </Card>
  );
};

export default SuperAdminComments;
