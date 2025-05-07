import React, { useState, useEffect } from "react";
import { DatePicker, Button, Spin, Alert, Tag, Tooltip, Empty } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import BASE_URL from "../Config";
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
  createdAt?: string;
  message?: string;
}

const LeaveStatus: React.FC = () => {
  const [leaveDataList, setLeaveDataList] = useState<LeaveData[]>([]);
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

      if (response.data && Array.isArray(response.data)) {
        setLeaveDataList(response.data);
      } else {
        setLeaveDataList([]);
      }
    } catch (err) {
      console.error("Error fetching leave status:", err);
      setError("Failed to fetch leave information. Please try again.");
      setLeaveDataList([]);
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

  // Format date range
  const formatDateRange = (fromDate: string, endDate: string): string => {
    return `${dayjs(fromDate).format("YYYY-MM-DD")} to ${dayjs(endDate).format(
      "YYYY-MM-DD"
    )}`;
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
          label: "LEAVE",
          bgClass: "bg-green-100",
          textClass: "text-green-800",
          dotClass: "bg-green-600",
        };
      // case "PENDING":
      //   return {
      //     color: "warning",
      //     label: "Pending",
      //     bgClass: "bg-yellow-100",
      //     textClass: "text-yellow-800",
      //     dotClass: "bg-yellow-600",
      //   };
      // case "REJECTED":
      //   return {
      //     color: "error",
      //     label: "Rejected",
      //     bgClass: "bg-red-100",
      //     textClass: "text-red-800",
      //     dotClass: "bg-red-600",
      //   };
      default:
        return {
          color: "default",
          label: status,
          bgClass: "bg-gray-100",
          textClass: "text-gray-800",
          dotClass: "bg-gray-600",
        };
    }
  };

  // Render a single leave card
  const renderLeaveCard = (leaveData: LeaveData) => {
    const statusDetails = getStatusDetails(leaveData.status);
    const displayName = leaveData.name || username;
    const duration = calculateDuration(leaveData.fromDate, leaveData.endDate);
    const shortId = leaveData.id.substring(0, 4);
    const createdDate = leaveData.createdAt
      ? dayjs(leaveData.createdAt).format("MMM D, YYYY [at] h:mm A")
      : "Unknown date";

    return (
      <div
        key={leaveData.id}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg mb-6 animate-fade-in"
      >
        <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between bg-gray-50 rounded-t-2xl">
          <div className="flex items-center mb-2 sm:mb-0">
            <div
              className={`px-3 py-1 rounded-full flex items-center ${statusDetails.bgClass} ${statusDetails.textClass}`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-2 ${statusDetails.dotClass}`}
              ></span>
              {statusDetails.label}
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <Tooltip title={`Full ID: ${leaveData.id}`}>
              <span className="font-medium">Request ID:</span> #{shortId}
            </Tooltip>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-bold mb-1">
                Employee Name
              </span>
              <span className="text-sm text-gray-800">{displayName}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-bold mb-1">
                Duration
              </span>
              <span className="text-sm text-gray-800">
                {duration} day{duration !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex flex-col sm:col-span-2">
              <span className="text-sm text-gray-500 font-bold mb-1">
                Date Range
              </span>
              <span className="text-sm text-gray-800">
                {formatDateRange(leaveData.fromDate, leaveData.endDate)}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <span className="text-sm text-gray-500 font-bold mb-1 block">
              Reason
            </span>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg text-gray-700 text-sm leading-relaxed transition-all duration-300 hover:bg-gray-100">
              {leaveData.requestSummary}
            </div>
          </div>

          {leaveData.createdAt && (
            <div className="mt-4 text-right text-xs text-gray-500">
              Request created: {createdDate}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render leave status information
  const renderLeaveInfo = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-16 bg-gray-50 rounded-lg">
          <Spin size="large" tip="Loading leave requests..." />
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
          className="mb-6 rounded-lg shadow-sm"
          action={
            <Button
              size="small"
              type="primary"
              onClick={() => fetchLeaveStatus(selectedDate)}
              className="rounded-md"
            >
              Retry
            </Button>
          }
        />
      );
    }

    if (!leaveDataList.length) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-gray-100">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-gray-600 text-base">
                No leave requests found for{" "}
                {selectedDate.format("MMMM D, YYYY")}
              </span>
            }
          />
          <Button
            type="primary"
            href="/leaveapproval"
            size="large"
            className="mt-6 rounded-md hover:scale-105 transition-transform duration-200"
          >
            Request Leave
          </Button>
        </div>
      );
    }

    return (
      <div>
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {leaveDataList.length} Leave Request
            {leaveDataList.length !== 1 ? "s" : ""} Found
          </h3>
          <Button
            onClick={handleRefresh}
            loading={refreshing}
            className="w-full sm:w-auto rounded-md border-gray-300 hover:bg-gray-100 transition-colors"
          >
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {leaveDataList.map((leaveData) => renderLeaveCard(leaveData))}
        </div>
      </div>
    );
  };

  // Get today's date
  const today = dayjs();

  // Determine if selected date is today
  const isToday =
    selectedDate.format("YYYY-MM-DD") === today.format("YYYY-MM-DD");

  return (
    <UserPanelLayout>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg overflow-hidden">
            <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 flex items-center">
                   
                   My Leave Requests
                  </h2>
                  <p className="text-sm text-gray-600">
                    Track and manage your leave requests with ease
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <DatePicker
                    value={selectedDate}
                    onChange={handleDateChange}
                    format="YYYY-MM-DD"
                    allowClear={false}
                    className="w-full sm:w-48 rounded-md border-gray-300 focus:border-blue-500 transition-colors"
                    disabledDate={(current) => {
                      return current && current > today.add(1, "year");
                    }}
                  />
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Tooltip title="Check leave status">
                      <Button
                        type="primary"
                        onClick={() => fetchLeaveStatus(selectedDate)}
                        className="w-full sm:w-auto rounded-md bg-blue-600 hover:bg-blue-700 transition-colors"
                      >
                        Check
                      </Button>
                    </Tooltip>
                    {!isToday && (
                      <Tooltip title="View today's leave status">
                        <Button
                          onClick={() => handleDateChange(today)}
                          className="w-full sm:w-auto rounded-md border-gray-300 hover:bg-gray-100 transition-colors"
                        >
                          Today
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">{renderLeaveInfo()}</div>
          </div>
        </div>
      </div>
    </UserPanelLayout>
  );
};

// Add custom animation styles
const styles = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Additional responsive styles */
@media (max-width: 640px) {
  .ant-btn {
    padding: 6px 10px;
    font-size: 14px;
  }
  
  .ant-picker {
    padding: 6px;
    font-size: 14px;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  h3 {
    font-size: 1.25rem;
  }
  
  .text-sm {
    font-size: 0.8125rem;
  }
  
  .p-4 {
    padding: 0.75rem;
  }
  
  .gap-4 {
    gap: 0.75rem;
  }
}

/* Tablet optimizations */
@media (min-width: 641px) and (max-width: 1024px) {
  .max-w-7xl {
    max-width: 95%;
  }
  
  .grid-cols-1 {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

/* Better touch targets for mobile */
@media (max-width: 767px) {
  .ant-btn, .ant-picker, .ant-tag {
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
`;

export default LeaveStatus;
