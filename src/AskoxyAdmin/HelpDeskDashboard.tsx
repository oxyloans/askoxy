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
  Tag,
  DatePicker,
  Space,
} from "antd";
import {
  PhoneOutlined,
  UserOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import BASE_URL from "../Config";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";
import dayjs, { Dayjs } from "dayjs";

interface CallerItem {
  userId: string;
  helpAdminUserId: string;
  comments: string;
  createdDate: string;
  caller: string;
  id: string;
  isActive: boolean | null;
}

interface UserData {
  userId: string;
  fullName: string;
  mobileNumber: string;
  whatsappNumber: string; // <-- NEW
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
  const [comments, setComments] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userDetails, setUserDetails] = useState<{
    [key: string]: UserData | null;
  }>({});

  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchCallerData = async (
    start?: string,
    end?: string
  ): Promise<void> => {
    try {
      setLoading(true);
      let url = `${BASE_URL}/user-service/getCallersTotalDataBwRange`;

      if (!start || !end) {
        const currentDate = dayjs().format("YYYY-MM-DD");
        start = currentDate;
        end = currentDate;
      }

      url += `?startDate=${start}&endDate=${end}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          accept: "*/*",
        },
      });

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

  const handleDateFilter = () => {
    if (!startDate || !endDate) {
      message.error("Please select both start and end dates");
      return;
    }

    const startDateStr = startDate.format("YYYY-MM-DD");
    const endDateStr = endDate.format("YYYY-MM-DD");

    fetchCallerData(startDateStr, endDateStr);
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

  const buildAddress = (src: any) => {
    // supports both user & advocate shapes
    const parts = [
      src.flatNo,
      src.flatNumber,
      src.houseNo,
      src.addressLine1 || src.address,
      src.addressLine2,
      src.landMark || src.landmark,
      src.area,
      src.city,
      src.state,
      src.pincode,
    ]
      .filter((x) => x && String(x).trim())
      .join(", ");
    return parts || "No";
  };

  const pickPhone = (obj: any) =>
    (obj.mobileNumber && String(obj.mobileNumber).trim()) ||
    (obj.whastappNumber && String(obj.whastappNumber).trim()) ||
    (obj.whatsappNumber && String(obj.whatsappNumber).trim()) ||
    "";

  const normalizeFromListApi = (user: any): UserData => {
    const fullName = `${user.userName || user.firstName || ""} ${
      user.lastName || ""
    }`.trim();
    const mobile = pickPhone(user);
    const whatsapp =
      (user.whastappNumber && String(user.whastappNumber).trim()) ||
      (user.whatsappNumber && String(user.whatsappNumber).trim()) ||
      "";
    return {
      userId: user.userId,
      fullName: fullName || "—",
      mobileNumber: mobile || "—",
      whatsappNumber: whatsapp || "—",
      userType: user.userType || user.role || "N/A",
      address: buildAddress(user),
    };
  };

  const normalizeFromSingleApi = (user: any): UserData => {
    const fullName = `${user.firstName || user.userName || ""} ${
      user.lastName || ""
    }`.trim();
    const mobile = pickPhone(user);
    const whatsapp =
      (user.whastappNumber && String(user.whastappNumber).trim()) ||
      (user.whatsappNumber && String(user.whatsappNumber).trim()) ||
      "";
    return {
      userId: user.userId,
      fullName: fullName || "—",
      mobileNumber: mobile || "—",
      whatsappNumber: whatsapp || "—",
      userType: user.userType || user.role || "N/A",
      address: buildAddress(user),
    };
  };

  // Advocate API might have slightly different keys (e.g., advocateName)
  const normalizeFromAdvocateApi = (adv: any): UserData => {
    const nameGuess =
      adv.fullName ||
      adv.advocateName ||
      `${adv.firstName || adv.userName || ""} ${adv.lastName || ""}`.trim();
    const mobile = pickPhone(adv);
    const whatsapp =
      (adv.whastappNumber && String(adv.whastappNumber).trim()) ||
      (adv.whatsappNumber && String(adv.whatsappNumber).trim()) ||
      "";
    return {
      userId: adv.userId || adv.advocateUserId || adv.id || userId,
      fullName: (nameGuess && String(nameGuess).trim()) || "—",
      mobileNumber: mobile || "—",
      whatsappNumber: whatsapp || "—",
      userType: adv.userType || adv.role || "ADVOCATE",
      address: buildAddress(adv),
    };
  };

  try {
    // 1) PRIMARY: POST /getDataWithMobileOrWhatsappOrUserId
    const primary = await axios.post(
      `${BASE_URL}/user-service/getDataWithMobileOrWhatsappOrUserId`,
      { userId: userId || null },
      { headers: { "Content-Type": "application/json" } }
    );

    const list = primary?.data?.activeUsersResponse || [];
    if (primary.status === 200 && Array.isArray(list) && list.length > 0) {
      const transformed = normalizeFromListApi(list[0]);
      setUserDetails((prev) => ({ ...prev, [userId]: transformed }));
      return;
    }

    // 2) FALLBACK: GET /getDataWithMobileOrUserId?userId=...
    const fallback = await axios.get(
      `${BASE_URL}/user-service/getDataWithMobileOrUserId`,
      { params: { userId } }
    );

    if (fallback?.status === 200 && fallback?.data) {
      const transformed = normalizeFromSingleApi(fallback.data);
      setUserDetails((prev) => ({ ...prev, [userId]: transformed }));
      return;
    }

    // 3) FINAL FALLBACK (Kukatpally style):
    //    /getAdvocatesDataWithMobileOrUserId
    // Prefer GET with params; if API expects POST, we'll try that too.
    try {
      const advGet = await axios.get(
        `${BASE_URL}/user-service/getAdvocatesDataWithMobileOrUserId`,
        { params: { userId } }
      );
      if (advGet?.status === 200 && advGet?.data) {
        const data = Array.isArray(advGet.data) ? advGet.data[0] : advGet.data;
        const transformed = normalizeFromAdvocateApi(data);
        setUserDetails((prev) => ({ ...prev, [userId]: transformed }));
        return;
      }
    } catch {
      // If GET fails (or API expects body), try POST
      const advPost = await axios.post(
        `${BASE_URL}/user-service/getAdvocatesDataWithMobileOrUserId`,
        { userId },
        { headers: { "Content-Type": "application/json" } }
      );
      if (advPost?.status === 200 && advPost?.data) {
        const data = Array.isArray(advPost.data) ? advPost.data[0] : advPost.data;
        const transformed = normalizeFromAdvocateApi(data);
        setUserDetails((prev) => ({ ...prev, [userId]: transformed }));
        return;
      }
    }

    message.error("No user details found in all sources.");
  } catch (error) {
    // If primary threw an exception, still attempt the subsequent fallbacks:
    try {
      const fb = await axios.get(
        `${BASE_URL}/user-service/getDataWithMobileOrUserId`,
        { params: { userId } }
      );
      if (fb?.status === 200 && fb?.data) {
        const transformed = normalizeFromSingleApi(fb.data);
        setUserDetails((prev) => ({ ...prev, [userId]: transformed }));
        return;
      }
    } catch { /* swallow and continue */ }

    try {
      const advGet = await axios.get(
        `${BASE_URL}/user-service/getAdvocatesDataWithMobileOrUserId`,
        { params: { userId } }
      );
      if (advGet?.status === 200 && advGet?.data) {
        const data = Array.isArray(advGet.data) ? advGet.data[0] : advGet.data;
        const transformed = normalizeFromAdvocateApi(data);
        setUserDetails((prev) => ({ ...prev, [userId]: transformed }));
        return;
      }
    } catch {
      try {
        const advPost = await axios.post(
          `${BASE_URL}/user-service/getAdvocatesDataWithMobileOrUserId`,
          { userId },
          { headers: { "Content-Type": "application/json" } }
        );
        if (advPost?.status === 200 && advPost?.data) {
          const data = Array.isArray(advPost.data) ? advPost.data[0] : advPost.data;
          const transformed = normalizeFromAdvocateApi(data);
          setUserDetails((prev) => ({ ...prev, [userId]: transformed }));
          return;
        }
      } catch {
        message.error("Failed to fetch user/advocate details");
      }
    }
  } finally {
    setLoadingRows((prev) => ({ ...prev, [userId]: false }));
  }
};

  const handleCommentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    recordId: string
  ) => {
    setComments((prev) => ({
      ...prev,
      [recordId]: e.target.value,
    }));
  };

  const handleSubmit = async (record: CallerItem) => {
    const commentText = comments[record.id]?.trim();

    if (!commentText) {
      message.error("Please enter comments before submitting");
      return;
    }

    setIsSubmitting(true);
    const uniqueId = localStorage.getItem("admin_uniquId");

    const requestData = {
      adminCommentsId: record.id,
      superAdminComments: commentText,
      superAdminUserId: uniqueId,
    };

    try {
      const response = await fetch(
        `${BASE_URL}/user-service/adminRespondedComments`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        message.success("Comments submitted successfully");

        // Clear the submitted comment only
        setComments((prev) => ({
          ...prev,
          [record.id]: "",
        }));
      } else {
        message.error("Failed to submit comments");
      }
    } catch (error) {
      message.error("An error occurred while submitting comments");
      console.error("Error submitting comments:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExcelDownload = async () => {
    if (!startDate || !endDate) {
      message.error("Please select both start and end dates to download Excel");
      return;
    }

    const startDateStr = startDate.format("YYYY-MM-DD");
    const endDateStr = endDate.format("YYYY-MM-DD");

    setIsDownloading(true);

    try {
      const response = await fetch(
        `${BASE_URL}/user-service/dateRange-caller-comments-xl?startDate=${startDateStr}&endDate=${endDateStr}`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download Excel file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `caller-comments-${startDateStr}-to-${endDateStr}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success("Excel file downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      message.error("Failed to download Excel file");
    } finally {
      setIsDownloading(false);
    }
  };

  const emojiMap: Record<string, string> = {
    POLITE: "😊 Polite",
    FRIENDLY: "😎 Friendly",
    COOL: "😎 Cool",
    FRUSTRATED: "😤 Frustrated",
    DISAPPOINTED: "😞 Disappointed",
    RUDE: "😠 Rude",
    ANGRY: "😡 Angry",
    UNDERSTANDING: "🤝 Understanding",
    CONFUSED: "😕 Confused",
    BUSY: "📞 Busy",
    OUTOFSERVICE: "📴 Out of Service",
    NOTCONNECTED: "❌ Not Connected",
    DISCONNECTED: "🔌 Disconnected",
    CALLWAITING: "⏳ Call Waiting",
  };
  const behaviorColorMap: Record<string, string> = {
    POLITE: "green",
    FRIENDLY: "green",
    COOL: "cyan",
    UNDERSTANDING: "blue",
    CONFUSED: "geekblue",
    FRUSTRATED: "orange",
    DISAPPOINTED: "volcano",
    RUDE: "red",
    ANGRY: "red",
    BUSY: "gold",
    OUTOFSERVICE: "purple",
    NOTCONNECTED: "magenta",
    DISCONNECTED: "magenta",
    CALLWAITING: "lime",
  };

  const helpdeskColumns: ColumnsType<CallerItem> = [
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      width: 130,
      render: (userId: string) => {
        const isLoading = loadingRows[userId];
        const details = userDetails[userId];

        const onViewClick = () => {
          if (isLoading) return; // guard against double-click races
          if (details) {
            setUserDetails((prev) => ({ ...prev, [userId]: null }));
          } else {
            handleUserDetailsClick(userId);
          }
        };

        return (
          <div>
            <div className="flex items-center">
              <strong>{userId.slice(-4)}</strong>
              <Button
                size="small"
                className="bg-blue-500 ml-2 text-white text-xs px-1 py-0 rounded hover:bg-blue-600 h-5 leading-none"
                onClick={onViewClick}
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
                  <strong>WhatsApp:</strong> {details.whatsappNumber}
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
      width: 140,
      render: (_: string, record: any) => {
        const behavior = record.customerBehaviour;
        const emojiLabel = emojiMap[behavior] || behavior;
        const tagColor = behaviorColorMap[behavior] || "default";

        return (
          <div className="flex flex-col gap-1">
            <span>{record.caller}</span>

            {behavior && (
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">
                  Customer Behaviour:
                </span>
                <Tag color={tagColor} className="w-fit">
                  {emojiLabel}
                </Tag>
              </div>
            )}
            {record.isActive !== null && (
              <Tag
                className={`w-fit  rounded font-medium ${
                  record.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {record.isActive ? "Active" : "InActive"}
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      width: 220,
      render: (text: string) => (
        <div className="max-h-16 overflow-y-auto">
          <strong className="text-sm">{text}</strong>
        </div>
      ),
    },
    {
      title: "SuperAdmin Comments",
      dataIndex: "comments",
      key: "comments",
      width: 180,
      render: (text: string, record) => (
        <div className="w-full relative">
          <TextArea
            value={comments[record.id] || ""}
            onChange={(e) => handleCommentChange(e, record.id)}
            placeholder="Enter superAdmin comments here"
            className="w-full text-sm pr-10 p-1 h-14"
            rows={3}
            style={{ resize: "none" }}
          />
          <Button
            type="primary"
            onClick={() => handleSubmit(record)}
            loading={isSubmitting}
            className="absolute right-2 bottom-2 bg-blue-500 text-white hover:bg-blue-600"
            size="small"
          >
            Submit
          </Button>
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
          {new Date(text).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </span>
      ),
    },
  ];
  // if (loading)
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <Spin size="large" />
  //     </div>
  //   );
  // if (error)
  //   return <Alert message="Error" description={error} type="error" showIcon />;
  // if (!callerData)
  //   return <Alert message="No data available" type="info" showIcon />;

  const getCallerNames = (): string[] => {
    if (!callerData || !callerData.callerWiseCount) return [];
    return Object.keys(callerData.callerWiseCount);
  };

  const callerNames = getCallerNames();

  return (
    <div>
      <div className="px-1 sm:px-2 py-1">
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100 mb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-3 gap-3">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              Calling Report Dashboard
            </h1>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              loading={isDownloading}
              onClick={handleExcelDownload}
              className="bg-green-600 hover:bg-green-700 border-green-600 text-white font-semibold rounded-lg w-full sm:w-auto px-3 sm:px-4 py-2 text-sm"
            >
              <span className="hidden xs:inline">Download XLS</span>
            </Button>
          </div>

          {/* Date filters section */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            <div className="flex flex-col min-w-0 flex-1 sm:flex-initial">
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <DatePicker
                value={startDate}
                onChange={(date) => setStartDate(date)}
                format="DD-MM-YYYY"
                className="w-full sm:w-36 md:w-40 h-8 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Start date"
                size="middle"
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1 sm:flex-initial">
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <DatePicker
                value={endDate}
                onChange={(date) => setEndDate(date)}
                format="DD-MM-YYYY"
                className="w-full sm:w-36 md:w-40 h-8 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="End date"
                size="middle"
              />
            </div>
            <Button
              type="primary"
              onClick={handleDateFilter}
              className="bg-blue-600 hover:bg-blue-700 border-blue-600 text-white font-semibold rounded-lg w-full sm:w-auto h-8 px-3 sm:px-4 text-sm"
              size="middle"
            >
              Get Data
            </Button>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[12, 12]} className="p-2 bg-gray-100 rounded-lg">
            <Col xs={24} sm={24} md={24} lg={8} xl={6}>
              <div
                className="bg-white rounded-xl shadow-md border border-blue-300 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 h-full flex items-center justify-center cursor-pointer min-h-[120px] sm:min-h-[140px]"
                onClick={() => setSelectedCaller("All")}
              >
                <div className="flex flex-col justify-between text-center w-full h-full">
                  <p className="text-sm sm:text-lg lg:text-xl font-semibold text-blue-900 mb-3 sm:mb-6">
                    Today Total Calls
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center">
                      <PhoneOutlined className="text-xl sm:text-3xl text-blue-700" />
                    </div>
                    <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900">
                      {callerData?.totalCount || 0}
                    </p>
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={24} sm={24} md={24} lg={16} xl={18}>
              <Row gutter={[8, 8]} className="h-full">
                {callerNames.map((caller) => (
                  <Col
                    xs={12}
                    sm={8}
                    md={6}
                    lg={8}
                    xl={6}
                    xxl={4}
                    key={caller}
                    className="flex"
                  >
                    <div
                      className="bg-white rounded-xl shadow-md border border-blue-200 p-2 sm:p-3 hover:shadow-lg transition-all duration-300 cursor-pointer w-full flex items-center min-h-[80px] sm:min-h-[90px]"
                      onClick={() => setSelectedCaller(caller)}
                    >
                      <div className="flex items-center w-full">
                        <div className="bg-green-100 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                          <UserOutlined className="text-xs sm:text-sm text-green-600" />
                        </div>
                        <div className="overflow-hidden flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-green-800 mb-0 truncate w-full leading-tight">
                            {caller}
                          </p>
                          <p className="text-sm sm:text-lg font-bold text-gray-900 leading-tight">
                            {callerData?.callerWiseCount[caller] || 0}
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
        </>
      )}
    </div>
  );
};

export default HelpDeskDashboard;