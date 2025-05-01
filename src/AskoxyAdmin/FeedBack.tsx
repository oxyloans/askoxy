import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Statistic,
  Row,
  Col,
  Typography,
  Space,
  Input,
  Spin,
  Alert,
  Empty,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ClockCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import BASE_URL from "../Config";

const { Title, Text } = Typography;
const { Search } = Input;

// Define the feedback interface
interface Feedback {
  feedback_user_id: string;
  email: string;
  submittedAt: string;
  feedbackStatus: string | null;
  orderid: string;
  comments: string;
}

// Define the user data interface based on the actual API response
interface UserResponse {
  totalCount: null;
  activeUsersResponse: UserData[];
}

interface UserData {
  userId: string;
  userType: string;
  userName: string;
  mobileNumber: string;
  whastappNumber: string;
  countryCode: string;
  email: string;
  flatNo: string | null;
  landMark: string | null;
  pincode: string | null;
  addressType: string | null;
  address: string | null;
  firstName: string;
  lastName: string;
  assignedTo: string;
}

// Combined interface for feedback with user details
interface FeedbackWithUser extends Feedback {
  userData: UserData | null;
}

// Main component
const FeedbackDashboard: React.FC = () => {
  const [feedbackData, setFeedbackData] = useState<FeedbackWithUser[]>([]);
  const [filteredData, setFilteredData] = useState<FeedbackWithUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  // Fetch user details based on userId
  const fetchUserDetails = async (userId: string): Promise<UserData | null> => {
    try {
      const response = await fetch(
        `${BASE_URL}/user-service/getDataWithMobileOrWhatsappOrUserId`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
          body: JSON.stringify({
            number: null,
            userId: userId || null,
          }),
        }
      );

      if (!response.ok) {
        console.error(`Failed to fetch user details for userId: ${userId}`);
        return null;
      }

      const userData: UserResponse = await response.json();
      // Return the first user from activeUsersResponse array if it exists
      return userData.activeUsersResponse &&
        userData.activeUsersResponse.length > 0
        ? userData.activeUsersResponse[0]
        : null;
    } catch (error) {
      console.error(`Error fetching user details for userId: ${userId}`, error);
      return null;
    }
  };

  // Fetch feedback data from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Make the API call to get all feedback
        const feedbackResponse = await fetch(
          `${BASE_URL}/order-service/getAllfeedback`,
          {
            method: "GET",
            headers: {
              accept: "*/*",
            },
          }
        );

        if (!feedbackResponse.ok) {
          throw new Error(`HTTP error! Status: ${feedbackResponse.status}`);
        }
        const feedbackItems: Feedback[] = await feedbackResponse.json();

        const filteredFeedbackItems = feedbackItems.filter(
          (item) => item.comments !== null
        );

        const feedbackWithUserDetails = await Promise.all(
          filteredFeedbackItems.map(async (item) => {
            const userData = await fetchUserDetails(item.feedback_user_id);
            return { ...item, userData };
          })
        );

        setFeedbackData(feedbackWithUserDetails);
        setFilteredData(feedbackWithUserDetails);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching feedback data:", err);
        setError(`Failed to load feedback data: ${err.message}`);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on search text
  useEffect(() => {
    if (searchText) {
      const filtered = feedbackData.filter(
        (item) =>
          (item.email &&
            item.email.toLowerCase().includes(searchText.toLowerCase())) ||
          (item.comments &&
            item.comments.toLowerCase().includes(searchText.toLowerCase())) ||
          (item.orderid &&
            item.orderid.toLowerCase().includes(searchText.toLowerCase())) ||
          (item.userData?.userName &&
            item.userData.userName
              .toLowerCase()
              .includes(searchText.toLowerCase())) ||
          (item.userData?.mobileNumber &&
            item.userData.mobileNumber.includes(searchText))
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(feedbackData);
    }
  }, [searchText, feedbackData]);

  // Format date for display - only showing the date part
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const columns: ColumnsType<FeedbackWithUser & { key: string }> = [
    {
      title: "S.No",
      key: "serialNumber",
      width: 70,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Date",
      dataIndex: "submittedAt",
      key: "submittedAt",
      width: 100,
      render: (text: string) => formatDate(text),
    },
    {
      title: "User Details",
      key: "userDetails",
      width: 250,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <UserOutlined />
            <Text strong type="success">
              {record.userData?.userName || "Unknown User"}
            </Text>
          </Space>
          <Space>
            <MailOutlined />
            <Text type="secondary">
              {record.userData?.email || record.email || "No Email"}
            </Text>
          </Space>
          <Space>
            <PhoneOutlined />
            <Text className="text-gray-900">
              {record.userData?.mobileNumber || "No Phone"}
            </Text>
          </Space>
        </Space>
      ),
    },
    {
      title: "Order ID",
      dataIndex: "orderid",
      key: "orderid",
      width: 100,
      render: (text: string) => <Text>{text?.slice(-4) || "----"}</Text>,
    },
    {
      title: "Feedback",
      dataIndex: "comments",
      key: "comments",
      width: 200,

      render: (text: string) => (
        <span className={text ? "text-gray-950" : "text-gray-500"}>
          {text || "No comments"}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" tip="Loading feedback data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Title level={2} className="mb-2">
            Customer Feedback
          </Title>
        </div>

        <div className="w-full bg-white rounded-xl shadow-md border border-blue-200 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mr-6">
              <ClockCircleOutlined className="text-blue-600 text-2xl" />
            </div>
            <div>
              <p className="text-lg font-medium text-blue-800 mb-1">
                Total Feedbacks
              </p>
              <p className="text-4xl font-bold text-gray-900">
                {feedbackData.length}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 flex justify-end">
          <div style={{ width: 400 }}>
            <Search
              placeholder="Search by order ID"
              allowClear
              enterButton
              size="middle"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>

        <Card className="shadow-sm">
          {filteredData.length > 0 ? (
            <Table
              columns={columns}
              dataSource={filteredData.map((item, index) => ({
                ...item,
                key: `${item.feedback_user_id}-${index}`,
              }))}
              pagination={{ pageSize: 50 }}
              scroll={{ x: "100%" }}
              className="overflow-x-auto"
              rowClassName="align-top"
            />
          ) : (
            <Empty description="No feedback data found" />
          )}
        </Card>
      </div>
    </div>
  );
};

export default FeedbackDashboard;
