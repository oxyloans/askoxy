import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Table,
  Spin,
  Alert,
  Input,
  Button,
  message,
  Modal,
} from "antd";
import { PhoneOutlined, UserOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import BASE_URL from "../Config";
import axios from "axios";

interface CallerItem {
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

interface CallerWiseCount {
  [key: string]: number;
}

interface CallerData {
  totalCount: string;
  dayCount: string | null;
  response: CallerItem[];
  callerWiseCount: CallerWiseCount;
}

const HelpDeskDashboard: React.FC = () => {
  const [callerData, setCallerData] = useState<CallerData | null>(null);
  const [selectedCaller, setSelectedCaller] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<CallerItem[]>([]);
  const [searchUserId, setSearchUserId] = useState<string>("");

  const [loadingRows, setLoadingRows] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [userDetails, setUserDetails] = useState<{
    [key: string]: UserData | null;
  }>({});

  const fetchCallerData = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/user-service/getCallersTotalData`,
        {
          method: "POST",
          headers: {
            accept: "*/*",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data: CallerData = await response.json();
      setCallerData(data);
      setLoading(false);
    } catch (err: any) {
      setError("Error fetching data: " + err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCallerData();
  }, []);

  useEffect(() => {
    if (!callerData) return;

    let result = callerData.response;

    if (selectedCaller !== "All") {
      result = result.filter((item) => item.caller === selectedCaller);
    }

    if (searchUserId.trim() !== "") {
      result = result.filter((item) =>
        item.userId.slice(-4).toLowerCase().includes(searchUserId.toLowerCase())
      );
    }

    setFilteredData(result);
  }, [callerData, selectedCaller, searchUserId]);

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
  const helpdeskColumns: ColumnsType<CallerItem> = [
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
      title: "Caller Name",
      dataIndex: "caller",
      key: "caller",
      width: 150,
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      width: 300,
      render: (text: string) => (
        <div className="max-h-16 overflow-y-auto">
          <strong className="text-sm">{text}</strong>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdDate",
      key: "createdDate",
      width: 120,
      render: (text: string) => (
        <span>
          {new Date(text).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          })}
        </span>
      ),
    },
  ];
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  if (error)
    return <Alert message="Error" description={error} type="error" showIcon />;
  if (!callerData)
    return <Alert message="No data available" type="info" showIcon />;

  const getCallerNames = (): string[] => {
    if (!callerData || !callerData.callerWiseCount) return [];
    return Object.keys(callerData.callerWiseCount);
  };

  const callerNames = getCallerNames();

  return (
    <div>
      <h1 className="text-3xl font-bold text-left px-4 w-full">
        HelpDesk Dashboard
      </h1>

      <Row gutter={[16, 16]} className="p-2 bg-gray-100 rounded-lg">
        <Col xs={24} md={8} lg={6}>
          <div
            className="bg-white rounded-xl shadow-md border border-blue-300 p-6 hover:shadow-xl transition-all duration-300 h-full flex items-center justify-center cursor-pointer"
            onClick={() => setSelectedCaller("All")}
          >
            <div className="flex flex-col justify-between text-center w-full h-full">
              <p className="text-xl font-semibold text-blue-900 mb-6">
                Today Total Calls
              </p>
              <div className="flex flex-row items-center justify-center space-x-4">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center">
                  <PhoneOutlined className="text-3xl text-blue-700" />
                </div>
                <p className="text-5xl font-extrabold text-gray-900">
                  {callerData.totalCount || 0}
                </p>
              </div>
            </div>
          </div>
        </Col>

        <Col xs={24} md={16} lg={18}>
          <Row gutter={[12, 12]}>
            {callerNames.map((caller) => (
              <Col xs={12} sm={8} md={6} lg={6} key={caller}>
                <div
                  className="bg-white rounded-xl shadow-md border border-blue-200 p-3 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedCaller(caller)}
                >
                  <div className="flex items-center">
                    <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-2">
                      <UserOutlined className="text-sm text-green-600" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-green-800 mb-0 truncate w-full">
                        {caller}
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {callerData.callerWiseCount[caller] || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      <div className="mt-4 px-4">
        <Row justify="space-between" align="middle" className="mb-4">
          <Col>
            <h2 className="text-lg font-semibold">Calling Report</h2>
          </Col>
          <Col>
            <Input.Search
              placeholder="Search by User ID"
              allowClear
              enterButton
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
              className="w-full sm:w-48 md:w-64 lg:w-72"
            />
          </Col>
        </Row>

        <Table
          columns={helpdeskColumns}
          dataSource={filteredData}
          rowKey={(record) => record.userId + record.createdDate}
          pagination={{ pageSize: 50 }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
};

export default HelpDeskDashboard;
