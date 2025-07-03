import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Spin,
  Alert,
  Empty,
  Tooltip,
  Typography,
} from "antd";
import axios from "axios";
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

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await axios.get<LeaveData[]>(
          `${BASE_URL}/user-service/write/leaves/${userId}`
        );
        setLeaveData(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch leave data.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchLeaveData();
    } else {
      setLoading(false);
      setError("User ID not found.");
    }
  }, [userId]);

  const renderAdminStatusTag = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Tag color="orange">Pending</Tag>;
      case "APPROVED":
        return <Tag color="green">Approved</Tag>;
      case "REJECTED":
        return <Tag color="red">Rejected</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "From Date",
      dataIndex: "fromDate",
      key: "fromDate",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "To Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag>{status}</Tag>,
    },
    {
      title: "Admin Status",
      dataIndex: "adminStatus",
      key: "adminStatus",
      render: (status: string) => renderAdminStatusTag(status),
    },
    {
      title: "Summary",
      dataIndex: "requestSummary",
      key: "requestSummary",
      render: (text: string) => (
        <Tooltip title={<pre style={{ whiteSpace: "pre-wrap" }}>{text}</pre>}>
          <div
            style={{
              maxWidth: 200,
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
      render: (text: string | null) =>
        text ? (
          <Tooltip title={text}>
            <div
              style={{
                maxWidth: 150,
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
      <Card title="My Leave Status" bordered style={{ margin: 20 }}>
        {loading ? (
          <Spin tip="Loading leave status..." />
        ) : error ? (
          <Alert message={error} type="error" />
        ) : leaveData.length === 0 ? (
          <Empty description="No leave records found." />
        ) : (
          <Table
            dataSource={leaveData}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            bordered
          />
        )}
      </Card>
    </UserPanelLayout>
  );
};

export default LeaveStatus;
