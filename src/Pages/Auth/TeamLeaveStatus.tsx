import React, { useState, useEffect } from "react";
import { DatePicker, Button, Spin, Alert, Tag, Tooltip, Badge } from "antd";
import {
  CalendarOutlined,
  SearchOutlined,
  ReloadOutlined,
  ScheduleOutlined,
  UserOutlined,
  FieldTimeOutlined,
  TagOutlined,
  HistoryOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import BASE_URL from "../../Config";
import UserPanelLayout from "./UserPanelLayout";

// Interface for leave data
interface LeaveData {
  id: string;
  userId: string;
  name: string | null;
  status: string;
  fromDate: string;
  endDate: string;
  requestSummary: string;
}

const LeaveStatus: React.FC = () => {
  const [leaveData, setLeaveData] = useState<LeaveData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const userId = localStorage.getItem("userId") || "";
  const username = localStorage.getItem("username") || "User";

  // Fetch leave status for a specific date
  const fetchLeaveStatus = async (date: dayjs.Dayjs) => {
    setLoading(true);
    setError(null);

    try {
      if (!userId) throw new Error("User ID not found. Please login again.");

      const formattedDate = date.format("YYYY-MM-DD");
      const response = await axios.get(
        `${BASE_URL}/user-service/write/leaves/today/${userId}`,
        { params: { specificDate: formattedDate } }
      );

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        setLeaveData(response.data[0]);
      } else {
        setLeaveData(null);
      }
    } catch (err) {
      console.error("Error fetching leave status:", err);
      setError("Failed to fetch leave information. Please try again.");
      setLeaveData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchLeaveStatus(selectedDate);
  }, [userId]);

  // Handle date change
  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
      fetchLeaveStatus(date);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchLeaveStatus(selectedDate);
  };

  // Format date
  const formatDate = (date: string): string => {
    return dayjs(date).format("MMMM D, YYYY");
  };

  // Calculate leave duration
  const calculateDuration = (fromDate: string, endDate: string): number => {
    return dayjs(endDate).diff(dayjs(fromDate), "day") + 1;
  };

  // Get status details
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "LEAVE":
        return {
          color: "success",
          label: "Approved",
          icon: <CheckCircleOutlined />,
          bgClass: "bg-green-50",
          textClass: "text-green-800"
        };
      case "PENDING":
        return {
          color: "warning",
          label: "Pending",
          icon: <ClockCircleOutlined />,
          bgClass: "bg-yellow-50",
          textClass: "text-yellow-800"
        };
      case "REJECTED":
        return {
          color: "error",
          label: "Rejected",
          icon: <CloseCircleOutlined />,
          bgClass: "bg-red-50",
          textClass: "text-red-800"
        };
      default:
        return {
          color: "default",
          label: status,
          icon: <InfoCircleOutlined />,
          bgClass: "bg-gray-50",
          textClass: "text-gray-800"
        };
    }
  };

  // Render leave status information
  const renderLeaveInfo = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-16">
          <Spin size="large" />
        </div>
      );
    }

    if (error) {
      return (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="mb-4"
          action={
            <Button
              size="small"
              type="primary"
              onClick={() => fetchLeaveStatus(selectedDate)}
            >
              Retry
            </Button>
          }
        />
      );
    }

    if (!leaveData) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-gray-100">
          <div className="text-gray-300 mb-6">
            <CalendarOutlined className="text-6xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Leave Scheduled
          </h3>
          <p className="text-gray-500 mb-6 text-center">
            No leave request was found for {selectedDate.format("MMMM D, YYYY")}
          </p>
          <Button
            type="primary"
            href="/leaveapproval"
            size="large"
            icon={<ScheduleOutlined />}
            className="hover:scale-105 transition-transform"
          >
            Request Leave
          </Button>
        </div>
      );
    }

    const statusDetails = getStatusDetails(leaveData.status);
    const displayName = leaveData.name || username;
    const duration = calculateDuration(leaveData.fromDate, leaveData.endDate);
    const shortId = leaveData.id.substring(0, 4);

    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between bg-gray-50">
          <div className="flex items-center mb-2 md:mb-0">
            <Tag 
              icon={statusDetails.icon} 
              color={statusDetails.color}
              className="px-3 py-1 text-sm font-medium flex items-center"
            >
              {statusDetails.label}
            </Tag>
          </div>
          <div className="text-sm text-gray-500">
            <Tooltip title={`Full ID: ${leaveData.id}`}>
              <span className="font-medium">Request ID:</span> #{shortId}
            </Tooltip>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-500 mr-4 transition-all duration-300 hover:bg-blue-100`}>
                <UserOutlined />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Employee</p>
                <p className="text-base font-medium">{displayName}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-purple-50 text-purple-500 mr-4 transition-all duration-300 hover:bg-purple-100`}>
                <FieldTimeOutlined />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Duration</p>
                <p className="text-base font-medium">
                  {duration} day{duration !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-green-50 text-green-500 mr-4 transition-all duration-300 hover:bg-green-100`}>
                <CalendarOutlined />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">From Date</p>
                <p className="text-base font-medium">
                  {formatDate(leaveData.fromDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-red-50 text-red-500 mr-4 transition-all duration-300 hover:bg-red-100`}>
                <CalendarOutlined />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">To Date</p>
                <p className="text-base font-medium">
                  {formatDate(leaveData.endDate)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-start mb-2">
              <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 mr-4 transition-all duration-300 hover:bg-gray-100`}>
                <TagOutlined />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Reason</p>
              </div>
            </div>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg text-gray-700 transition-all duration-300 hover:bg-gray-100">
              {leaveData.requestSummary}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Get today's date
  const today = dayjs();
  
  // Determine if selected date is today
  const isToday = selectedDate.format('YYYY-MM-DD') === today.format('YYYY-MM-DD');

  return (
    <UserPanelLayout>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-semibold text-gray-800 mb-1 flex items-center">
                <CalendarOutlined className="mr-2" /> Leave Status
              </h2>
              <p className="text-gray-500">
                View and manage your leave requests
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <DatePicker
                value={selectedDate}
                onChange={handleDateChange}
                format="YYYY-MM-DD"
                allowClear={false}
                className="w-full sm:w-auto"
                disabledDate={(current) => {
                  // Can't select days beyond today + 1 year
                  return current && current > today.add(1, 'year');
                }}
              />
              <div className="flex space-x-2 w-full sm:w-auto">
                <Tooltip title="Check leave status">
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={() => fetchLeaveStatus(selectedDate)}
                    className="flex-grow sm:flex-grow-0"
                  >
                    Check
                  </Button>
                </Tooltip>
                {!isToday && (
                  <Tooltip title="View today's leave status">
                    <Button 
                      onClick={() => handleDateChange(today)}
                      className="flex-grow sm:flex-grow-0"
                    >
                      Today
                    </Button>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {renderLeaveInfo()}

        
        </div>
      </div>
    </UserPanelLayout>
  );
};

export default LeaveStatus;