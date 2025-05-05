import React, { useEffect, useState } from "react";
import {
  DatePicker,
  Button,
  Table,
  Spin,
  Card,
  Typography,
  Col,
  Row,
  message,
} from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import axios from "axios";
import moment, { Moment } from "moment";
import BASE_URL from "../Config";

const { Title } = Typography;

interface CallRecord {
  userId: string;
  helpAdminUserId: string;
  comments: string;
  createdDate: string;
  caller: string;
}
interface UserData {
  userId: string;
  fullName: string;
  mobileNumber: string;
  userType: string;
  address: string;
}

interface ApiResponse {
  totalCount: string;
  dayCount: string;
  response: CallRecord[];
  callerWiseCount: null | any;
}

const CallerHistoryPage: React.FC = () => {
  const [reportData, setReportData] = useState<ApiResponse>({
    totalCount: "0",
    dayCount: "0",
    response: [],
    callerWiseCount: null,
  });
  const [reportLoading, setReportLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Moment | null>(moment());
  const [loadingRows, setLoadingRows] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [userDetails, setUserDetails] = useState<{
    [key: string]: UserData | null;
  }>({});

  const fetchReportData = async (date: Moment | null) => {
    setReportLoading(true);
    try {
      const userId = localStorage.getItem("uniquId");
      if (!userId) {
        message.error("Unable to find userId, please re-login");
        throw new Error("User ID not found in localStorage");
      }
      const formattedDate = date
        ? date.format("YYYY-MM-DD") + "T00:00:00.000Z"
        : moment().format("YYYY-MM-DD") + "T00:00:00.000Z";
      const response = await axios.post(
        `${BASE_URL}/user-service/getCallersCallingDataAndCount`,
        {
          helpAdminUserId: userId,
          specificDate: formattedDate,
        },
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching report:", error);
      setReportData({
        totalCount: "0",
        dayCount: "0",
        response: [],
        callerWiseCount: null,
      });
    } finally {
      setReportLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData(selectedDate);
  }, []);

  const handleFetchData = () => {
    fetchReportData(selectedDate);
  };

  const handleUserDetailsClick = async (userId: string) => {
    setLoadingRows((prev) => ({ ...prev, [userId]: true }));

    try {
      const response = await axios.post(
        `${BASE_URL}/user-service/getDataWithMobileOrWhatsappOrUserId`,
        {
          userId: userId || null,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (
        response.status === 200 &&
        response.data.activeUsersResponse.length > 0
      ) {
        const user = response.data.activeUsersResponse[0];
        const fullAddress = `${user.flatNo || ""}, ${user.landMark || ""}, ${
          user.address || ""
        } ${user.pincode || ""}`.trim();

        const transformed: UserData = {
          userId: user.userId,
          fullName: `${user.userName || ""} ${user.lastName || ""}`.trim(),
          mobileNumber: user.mobileNumber || "",
          userType: user.userType || "N/A",
          address: fullAddress === ", ," ? "No" : fullAddress,
        };

        setUserDetails((prev) => ({ ...prev, [userId]: transformed }));
      } else {
        message.error("Failed to fetch user details");
      }
    } catch (error) {
      message.error("Failed to fetch user details");
    } finally {
      setLoadingRows((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const columns = [
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      width: 140,
      render: (userId: string) => {
        const isLoading = loadingRows[userId];
        const details = userDetails[userId];

        return (
          <div>
            <div className="flex items-center">
              <strong>{userId.slice(-4)}</strong>
              <Button
                size="small"
                className="bg-blue-500 ml-2 text-white text-xs px-1 py-0 rounded hover:bg-blue-600 h-5 leading-none"
                onClick={() => {
                  if (details) {
                    setUserDetails((prev) => ({ ...prev, [userId]: null }));
                  } else {
                    // Show details logic
                    handleUserDetailsClick(userId);
                  }
                }}
              >
                {isLoading ? <Spin size="small" /> : details ? "Hide" : "View"}
              </Button>
            </div>

            {details && (
              <div className="mt-1 text-xs">
                <p>
                  <strong>Name:</strong> {details.fullName}
                </p>
                <p>
                  <strong>Mobile:</strong> {details.mobileNumber}
                </p>
                <p>
                  <strong>Type:</strong> {details.userType}
                </p>
                <p>
                  <strong>Address:</strong> {details.address}
                </p>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Caller",
      dataIndex: "caller",
      key: "caller",
      width: "20%",
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      width: "35%",
      render: (text: string) => (
        <span className="block truncate" title={text}>
          {text}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdDate",
      key: "createdDate",
      width: "20%",
      render: (text: string) => moment(text).format("MMM D YYYY"),
    },
  ];

  return (
    <Card className="min-h-screen bg-white p-2 sm:p-4 w-full rounded-lg shadow-lg">
      <Title level={3} className="text-left  text-lg">
        Calling History
      </Title>
      <Row gutter={[16, 16]} className="mb-4 sm:mb-6">
        <Col xs={24} sm={12} lg={6}>
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center cursor-pointer">
            <p className="text-lg font-semibold mb-4">Overall Total Calls</p>
            <div className="flex flex-row items-center justify-center space-x-4">
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center">
                <PhoneOutlined className="text-2xl text-blue-700" />
              </div>
              <p className="text-4xl font-extrabold">
                {reportData.totalCount || 0}
              </p>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center cursor-pointer">
            <p className="text-lg font-semibold mb-4">Today Total Calls</p>
            <div className="flex flex-row items-center justify-center space-x-4">
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center">
                <PhoneOutlined className="text-2xl text-green-700" />
              </div>
              <p className="text-4xl font-extrabold">
                {reportData.dayCount || 0}
              </p>
            </div>
          </div>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="mb-4 sm:mb-6">
        <Col xs={24}>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <DatePicker
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              format="YYYY-MM-DD"
              className="w-full sm:w-40 rounded-md"
            />
            <Button
              type="primary"
              onClick={handleFetchData}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 rounded-md h-10 mt-2 sm:mt-0"
            >
              Get Report
            </Button>
          </div>
        </Col>
      </Row>
      <Spin spinning={reportLoading} tip="Loading...">
        <Table
          dataSource={reportData.response}
          columns={columns}
          rowKey="userId"
          pagination={{ pageSize: 50, responsive: true }}
          className="rounded-lg overflow-hidden mb-4"
          scroll={{ x: true }}
        />
      </Spin>
    </Card>
  );
};

export default CallerHistoryPage;
