import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Empty,
  Input,
  Select,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  ReloadOutlined,
  SearchOutlined,
  CalendarOutlined,
  UserOutlined,
  RightOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { employeeApi } from "../utils/axiosInstances";
import BASE_URL from "../Config";
import UserPanelLayout from "./UserPanelLayout";

const { Text } = Typography;

interface LeaveData {
  id: string;
  userId: string;
  name: string | null;
  createdAt: string;
  status: string;
  endDate: string;
  fromDate: string;
  adminStatus: string;
  adminComments: string | null;
  leaveApprovedDate: string | null;
  requestSummary: string;
}

type StatusKey = "ALL" | "APPROVED" | "PENDING" | "REJECTED";

const LeaveStatus: React.FC = () => {
  const [leaveData, setLeaveData] = useState<LeaveData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<StatusKey>("ALL");
  const [searchText, setSearchText] = useState("");
  const userId = sessionStorage.getItem("userId");

  const fetchLeaveData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!userId) throw new Error("User ID not found.");

      const response = await employeeApi.get<LeaveData[]>(
        `${BASE_URL}/user-service/write/leaves/${userId}`,
      );

      setLeaveData([...response.data].reverse());
    } catch (err) {
      console.error(err);
      setError("Failed to fetch leave data.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchLeaveData();
  }, [fetchLeaveData]);

  const counts = useMemo(
    () => ({
      total: leaveData.length,
      approved: leaveData.filter((item) => item.adminStatus === "APPROVED").length,
      pending: leaveData.filter((item) => item.adminStatus === "PENDING").length,
      rejected: leaveData.filter((item) => item.adminStatus === "REJECTED").length,
    }),
    [leaveData],
  );

  const filteredLeaveData = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return leaveData.filter((item) => {
      const matchesStatus =
        filterStatus === "ALL" || item.adminStatus === filterStatus;

      const matchesSearch =
        !query ||
        item.name?.toLowerCase().includes(query) ||
        item.requestSummary?.toLowerCase().includes(query) ||
        item.adminComments?.toLowerCase().includes(query) ||
        item.status?.toLowerCase().includes(query) ||
        item.adminStatus?.toLowerCase().includes(query);

      return matchesStatus && Boolean(matchesSearch);
    });
  }, [leaveData, filterStatus, searchText]);

  const renderAdminStatusTag = (status: string) => {
    const baseStyle: React.CSSProperties = {
      border: "none",
      borderRadius: 999,
      padding: "3px 10px",
      fontWeight: 600,
      marginInlineEnd: 0,
    };

    switch (status) {
      case "APPROVED":
        return (
          <Tag color="success" style={baseStyle}>
            Approved
          </Tag>
        );
      case "PENDING":
        return (
          <Tag color="warning" style={baseStyle}>
            Pending
          </Tag>
        );
      case "REJECTED":
        return (
          <Tag color="error" style={baseStyle}>
            Rejected
          </Tag>
        );
      default:
        return <Tag style={baseStyle}>{status || "-"}</Tag>;
    }
  };

  const renderLeaveStatusTag = (status: string) => (
    <Tag
      color="blue"
      style={{
        border: "none",
        borderRadius: 6,
        fontWeight: 600,
        marginInlineEnd: 0,
        textTransform: "uppercase",
      }}
    >
      {status || "-"}
    </Tag>
  );

  const columns: ColumnsType<LeaveData> = [
    {
      title: "S.No",
      key: "serialNumber",
      width: 50,
      align: "center",
      render: (_value, _record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    width:150,
      render: (name: string | null) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <UserOutlined />
          </div>
          <Text strong>{name || "-"}</Text>
        </div>
      ),
    },
    {
      title: "From Date",
      dataIndex: "fromDate",
      key: "fromDate",
      width:125,
    
      render: (date: string) => dayjs(date).format("DD MMM YYYY"),
    },
    {
      title: "To Date",
      dataIndex: "endDate",
      key: "endDate",
     width:125,
      render: (date: string) => dayjs(date).format("DD MMM YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
     
      render: renderLeaveStatusTag,
    },
    {
      title: "Admin Status",
      dataIndex: "adminStatus",
      key: "adminStatus",
    
      render: renderAdminStatusTag,
    },
    {
      title: "Summary",
      dataIndex: "requestSummary",
      key: "requestSummary",
      width: 220,
      render: (text: string) => (
        <Tooltip title={text || "-"}>
          <div className="max-w-[200px] truncate text-slate-700">{text || "-"}</div>
        </Tooltip>
      ),
    },
    {
      title: "Admin Comments",
      dataIndex: "adminComments",
      key: "adminComments",
      width: 210,
      render: (text: string | null) => (
        <Tooltip title={text || "-"}>
          <div className="max-w-[190px] truncate text-slate-600">{text || "-"}</div>
        </Tooltip>
      ),
    },
    {
      title: "Applied On",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date: string) => (
        <div className="leading-tight">
          <div className="font-medium text-slate-700">
            {dayjs(date).isValid() ? dayjs(date).format("DD MMM YYYY") : "-"}
          </div>
          {dayjs(date).isValid() && (
            <div className="mt-1 text-xs text-slate-400">{dayjs(date).format("hh:mm A")}</div>
          )}
        </div>
      ),
    },
  ];

  const filterOptions = [
    { label: "ALL", value: "ALL" },
    { label: "APPROVED", value: "APPROVED" },
    { label: "PENDING", value: "PENDING" },
    { label: "REJECTED", value: "REJECTED" },
  ];

  const summaryCards = [
    {
      label: "Total Requests",
      helper: "All time requests",
      value: counts.total,
      icon: <FileTextOutlined />,
      iconClass: "bg-blue-100 text-blue-600",
    },
    {
      label: "Approved",
      helper: "Approved leaves",
      value: counts.approved,
      icon: <CheckCircleOutlined />,
      iconClass: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Pending",
      helper: "Awaiting approval",
      value: counts.pending,
      icon: <ClockCircleOutlined />,
      iconClass: "bg-orange-100 text-orange-500",
    },
    {
      label: "Rejected",
      helper: "Declined requests",
      value: counts.rejected,
      icon: <CloseCircleOutlined />,
      iconClass: "bg-red-100 text-red-500",
    },
  ];

  return (
    <UserPanelLayout>
      <div className="min-h-screen bg-white px-3 py-4 sm:px-4 lg:px-6 lg:py-6">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-5">
            <h1 className="m-0 text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
              Leave Status
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track and view your leave request status
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {summaryCards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.05)] sm:p-5"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl sm:h-12 sm:w-12 ${card.iconClass}`}
                  >
                    {card.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl font-bold text-slate-900 sm:text-2xl">
                      {card.value}
                    </div>
                    <div className="truncate text-sm font-semibold text-slate-800">
                      {card.label}
                    </div>
                    <div className="mt-0.5 hidden text-xs text-slate-400 sm:block">
                      {card.helper}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.05)]">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
              <Input
                allowClear
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                prefix={<SearchOutlined className="text-slate-400" />}
                placeholder="Search by name or reason..."
                className="h-10 w-full rounded-xl lg:max-w-[430px]"
              />

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <span className="text-sm font-medium text-slate-600">Filter by Status:</span>
                <Select
                  value={filterStatus}
                  options={filterOptions}
                  onChange={(value) => setFilterStatus(value as StatusKey)}
                  className="w-full sm:w-[165px]"
                  size="large"
                />
                <Button
                  type="primary"
                  size="large"
                  icon={<ReloadOutlined />}
                  onClick={fetchLeaveData}
                  loading={loading}
                  className="rounded-lg bg-[#3157d5] px-5 shadow-none"
                >
                  Refresh
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[320px] items-center justify-center">
                <Spin size="large" tip="Loading leave status..." />
              </div>
            ) : error ? (
              <div className="p-4 sm:p-6">
                <Alert
                  message={error}
                  description="Please refresh and try again."
                  type="error"
                  showIcon
                />
              </div>
            ) : leaveData.length === 0 ? (
              <Empty description="No leave records found." className="py-16" />
            ) : filteredLeaveData.length === 0 ? (
              <Empty description="No matching leave records found." className="py-16" />
            ) : (
              <>
                <div className="hidden md:block">
                  <Table<LeaveData>
                    dataSource={filteredLeaveData}
                    columns={columns}
                    rowKey="id"
                    pagination={{
                      pageSize: 5,
                      showSizeChanger: false,
                      showTotal: (total, range) =>
                        `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                    }}
                    scroll={{ x: true }}
                    className="leave-status-table"
                  />
                </div>

                <div className="space-y-3 p-3 md:hidden">
                  {filteredLeaveData.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.06)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <UserOutlined />
                          </div>
                          <div className="min-w-0">
                            <div className="truncate font-semibold text-slate-900">
                              {item.name || "-"}
                            </div>
                            <div className="mt-0.5 text-xs text-slate-400">
                              {item.status || "Leave Request"}
                            </div>
                          </div>
                        </div>
                        {renderAdminStatusTag(item.adminStatus)}
                      </div>

                      <div className="mt-4 space-y-2.5 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <CalendarOutlined className="text-slate-400" />
                          <span>
                            {dayjs(item.fromDate).format("DD MMM YYYY")} - {dayjs(item.endDate).format("DD MMM YYYY")}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-slate-600">
                          <FileTextOutlined className="mt-0.5 text-slate-400" />
                          <span className="line-clamp-2 flex-1">{item.requestSummary || "-"}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-xs text-slate-400">
                            {dayjs(item.createdAt).isValid()
                              ? dayjs(item.createdAt).format("DD MMM YYYY, hh:mm A")
                              : "-"}
                          </div>
                          <RightOutlined className="text-slate-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <style>{`
          .leave-status-table .ant-table {
            border-radius: 0;
          }
          .leave-status-table .ant-table-thead > tr > th {
            background: #f8fafc !important;
            color: #334155;
            font-weight: 700;
            font-size: 13px;
            padding-top: 15px;
            padding-bottom: 15px;
            white-space: nowrap;
          }
          .leave-status-table .ant-table-tbody > tr > td {
            padding-top: 14px;
            padding-bottom: 14px;
            border-color: #f1f5f9;
          }
          .leave-status-table .ant-table-tbody > tr:hover > td {
            background: #f8fbff !important;
          }
          .leave-status-table .ant-pagination {
            margin: 16px 20px !important;
          }
          .leave-status-table .ant-pagination-total-text {
            margin-right: auto;
            color: #64748b;
          }
          @media (max-width: 767px) {
            .ant-select-selector,
            .ant-input-affix-wrapper,
            .ant-btn {
              border-radius: 10px !important;
            }
          }
        `}</style>
      </div>
    </UserPanelLayout>
  );
};

export default LeaveStatus;