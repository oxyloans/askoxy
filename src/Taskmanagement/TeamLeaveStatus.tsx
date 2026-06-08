import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Spin,
  Alert,
  Empty,
  Tooltip,
  Typography,
  Select,
  Button,
} from "antd";
import { employeeApi } from "../utils/axiosInstances";
import dayjs from "dayjs";
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

const LeaveStatus: React.FC = () => {
  const [leaveData, setLeaveData] = useState<LeaveData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        if (!userId) throw new Error("User ID not found.");
        const response = await employeeApi.get<LeaveData[]>(
          `${BASE_URL}/user-service/write/leaves/${userId}`,
        );
        setLeaveData(response.data.reverse());
      } catch (err) {
        console.error(err);
        setError("Failed to fetch leave data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveData();
  }, [userId]);

  const renderAdminStatusTag = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Tag color="warning">Pending</Tag>;
      case "APPROVED":
        return <Tag color="success">Approved</Tag>;
      case "REJECTED":
        return <Tag color="error">Rejected</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const filterOptions = [
    { label: "ALL", value: "ALL" },
    { label: "APPROVED", value: "APPROVED" },
    { label: "PENDING", value: "PENDING" },
    { label: "REJECTED", value: "REJECTED" },
  ];

  const filteredLeaveData =
    filterStatus === "ALL"
      ? leaveData
      : leaveData.filter((item) => item.adminStatus === filterStatus);

  const columns = [
    {
      title: "S.No",
      key: "serialNumber",
      align: "center" as const,
      width: 80,
      render: (_: any, __: LeaveData, index: number) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center" as const,
      width: 150,
      render: (text: string) => <Text strong>{text || "-"}</Text>,
    },
    {
      title: "From Date",
      dataIndex: "fromDate",
      key: "fromDate",
      align: "center" as const,
      width: 120,
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "To Date",
      dataIndex: "endDate",
      key: "endDate",
      align: "center" as const,
      width: 120,
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      width: 100,
      render: (status: string) => <Tag>{status}</Tag>,
    },
    {
      title: "Admin Status",
      dataIndex: "adminStatus",
      key: "adminStatus",
      align: "center" as const,
      width: 120,
      render: (status: string) => renderAdminStatusTag(status),
    },
    {
      title: "Summary",
      dataIndex: "requestSummary",
      key: "requestSummary",
      align: "center" as const,
      width: 200,
      render: (text: string) => (
        <Tooltip title={<pre style={{ whiteSpace: "pre-wrap" }}>{text}</pre>}>
          <div
            style={{
              maxWidth: 180,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Admin Comments",
      dataIndex: "adminComments",
      key: "adminComments",
      align: "center" as const,
      width: 150,
      render: (text: string | null) =>
        text ? (
          <Tooltip title={text}>
            <div
              style={{
                maxWidth: 130,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {text}
            </div>
          </Tooltip>
        ) : (
          "-"
        ),
    },
  ];

  return (
    <UserPanelLayout>
      <div className="min-h-screen  py-6">
        <div className="shadow-sm rounded-md p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-start text-xl font-semibold">
              My Leave Status
            </h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Select
                value={filterStatus}
                options={filterOptions}
                onChange={(value) => setFilterStatus(value as string)}
                style={{ minWidth: 160 }}
              />
              <Button
                type="primary"
                style={{backgroundColor: "#008cba", borderColor: "#008cba" ,color:"white"}}
                onClick={() => {
                  window.location.href = "/leaveapproval";
                }}
              >
                Apply for Leave
              </Button>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <Spin tip="Loading leave status..." />
            </div>
          ) : error ? (
            <Alert message={error} type="error" showIcon className="m-4" />
          ) : leaveData.length === 0 ? (
            <Empty description="No leave records found." className="py-8" />
          ) : (
            <div className="overflow-x-auto pt-4">
              <Table
                dataSource={filteredLeaveData}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                bordered
                scroll={{ x: true }}
                className="rounded-md"
                rowClassName="hover:bg-gray-50 transition-colors"
              />
            </div>
          )}
        </div>
      </div>
    </UserPanelLayout>
  );
};

// Add custom styles
// const styles = `
// .ant-table-thead > tr > th {
//   background-color: #f9fafb;
//   font-weight: 600;
// }

// .ant-table-row:hover {
//   background-color: #f5f5f5;
// }

// .overflow-x-auto::-webkit-scrollbar {
//   height: 8px;
// }

// .overflow-x-auto::-webkit-scrollbar-thumb {
//   background-color: #d1d5db;
//   border-radius: 4px;
// }

// .overflow-x-auto::-webkit-scrollbar-track {
//   background-color: #f3f4f6;
// }

// @media (max-width: 640px) {
//   .ant-card {
//     margin: 10px;
//   }

//   .ant-table-thead > tr > th,
//   .ant-table-tbody > tr > td {
//     padding: 8px;
//     font-size: 12px;
//   }

//   .ant-card-title {
//     font-size: 16px;
//   }
// }
// `;

export default LeaveStatus;
