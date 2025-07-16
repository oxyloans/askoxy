import React, { useState, useEffect } from "react";
import { Table, Button, message, Card, Tag, Typography } from "antd";
import {
  EyeOutlined,
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import BASE_URL from "../Config";

const { Title, Text } = Typography;

interface AppliedJob {
  id: string;
  userId: string;
  jobId: string;
  coverLetter: string | null;
  noticePeriod: string | null;
  applicationStatus: string | null;
  resumeUrl: string | null;
  mobileNumber: string | null;
  userName: string | null;
  appliedAt: number;
  updatedAt: number;
  message: string | null;
  status: boolean;
}

const AppliedJobsDashboard: React.FC = () => {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingResumes, setDownloadingResumes] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/marketing-service/campgin/getuserandllusersappliedjobs`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch applied jobs");
      }

      const data = await response.json();

      // Add null check for data
      if (Array.isArray(data)) {
        setAppliedJobs(data);
      } else {
        setAppliedJobs([]);
        message.warning("No applied jobs data received");
      }
    } catch (error) {
      message.error("Failed to load applied jobs");
      console.error("Error fetching applied jobs:", error);
      setAppliedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const isValidUrl = (url: string | null): boolean => {
    if (!url || typeof url !== "string") return false;

    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  const handleViewResume = (resumeUrl: string | null) => {
    if (!resumeUrl) {
      message.warning("Resume not available");
      return;
    }

    window.open(resumeUrl, "_blank");
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp || isNaN(timestamp)) {
      return "Invalid date";
    }

    try {
      return new Date(timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getStatusColor = (status: boolean) => {
    return status ? "green" : "red";
  };

  const getStatusText = (status: boolean) => {
    return status ? "Active" : "Inactive";
  };

  const columns = [
    {
      title: "User Info",
      key: "userInfo",
      render: (record: AppliedJob) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <UserOutlined className="text-blue-500" />
            <Text strong>{record.userName || "N/A"}</Text>
          </div>
          <div className="text-sm text-gray-500">
            User ID: <Text strong>{record.userId?.slice(-4) || "N/A"}</Text>
          </div>
          <div className="text-sm text-gray-500">
            Mobile: {record.mobileNumber || "N/A"}
          </div>
        </div>
      ),
      width: 200,
    },
    {
      title: "Job Details",
      key: "jobDetails",
      render: (record: AppliedJob) => (
        <div className="space-y-1">
          <div className="text-sm">
            <Text strong>Job ID:</Text>{" "}
            <strong>{record.jobId?.slice(-4) || "N/A"}</strong>
          </div>
          <div className="text-sm">
            <Text strong>Notice Period:</Text> {record.noticePeriod || "N/A"}
          </div>
          <div className="text-sm">
            <Text strong>Application Status:</Text>{" "}
            {record.applicationStatus ? (
              <Tag color="blue">{record.applicationStatus}</Tag>
            ) : (
              <Tag color="default">Pending</Tag>
            )}
          </div>
        </div>
      ),
      width: 220,
    },
    {
      title: "Cover Letter",
      dataIndex: "coverLetter",
      key: "coverLetter",
      render: (coverLetter: string | null) => (
        <div className="max-w-xs">
          {coverLetter && coverLetter.trim() !== "" ? (
            <Text ellipsis={{ tooltip: coverLetter }} className="text-sm">
              {coverLetter}
            </Text>
          ) : (
            <Text className="text-gray-400 text-sm">No cover letter</Text>
          )}
        </div>
      ),
      width: 200,
    },
    {
      title: "Applied Date",
      key: "appliedAt",
      render: (record: AppliedJob) => (
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-green-500" />
          <Text className="text-sm">{formatDate(record.appliedAt)}</Text>
        </div>
      ),
      width: 180,
    },
    {
      title: "Resume",
      key: "resume",
      render: (record: AppliedJob) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewResume(record.resumeUrl)}
          disabled={!record.resumeUrl || record.resumeUrl.trim() === ""}
          loading={downloadingResumes.has(record.jobId)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          View Resume
        </Button>
      ),
      width: 130,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (message: string | null) => (
        <div className="max-w-xs">
          {message && message.trim() !== "" ? (
            <Text ellipsis={{ tooltip: message }} className="text-sm">
              {message}
            </Text>
          ) : (
            <Text className="text-gray-400 text-sm">No message</Text>
          )}
        </div>
      ),
      width: 150,
    },
  ];

  return (
    <Card className="shadow-lg">
      <Title level={2} className="text-gray-800 mb-2">
        <FileTextOutlined className="mr-3 text-blue-500" />
        Applied Jobs by Users
      </Title>
      <Table
        columns={columns}
        dataSource={appliedJobs}
        rowKey={(record) => record.id || Math.random().toString()}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} applications`,
        }}
        scroll={{ x: 1200 }}
        className="bg-white"
        rowClassName="hover:bg-gray-50"
      />
    </Card>
  );
};

export default AppliedJobsDashboard;
