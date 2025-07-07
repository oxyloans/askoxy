import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Avatar,
  Modal,
  message,
  Switch,
  Typography,
  Card,
  Spin,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import BASE_URL from "../Config";

const { Title, Text } = Typography;
const { confirm } = Modal;

interface Job {
  id: string;
  companyLogo: string;
  jobTitle: string;
  jobDesignation: string;
  companyName: string;
  industry: string;
  userId: string;
  jobLocations: string;
  jobType: string;
  description: string;
  benefits: string;
  jobStatus: boolean;
  skills: string;
  salaryMin: number;
  salaryMax: number;
  qualifications: number;
  applicationDeadLine: number;
  experience: string;
  createdAt: number;
  updatedAt: number;
  workMode: string;
  contactNumber: string;
  countryCode: string;
}

const JobsAdminPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/marketing-service/campgin/getalljobsbyuserid`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      message.error("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (jobId: string, currentStatus: boolean) => {
    confirm({
      title: "Confirm Status Change",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to ${
        currentStatus ? "deactivate" : "activate"
      } this job?`,
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          setUpdateLoading(jobId);
          // Replace with your actual update API endpoint
          const response = await fetch(
            `${BASE_URL}/marketing-service/campgin/updatejobstatus`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: jobId,
                jobStatus: !currentStatus,
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to update job status");
          }

          // Update local state
          setJobs((prevJobs) =>
            prevJobs.map((job) =>
              job.id === jobId ? { ...job, jobStatus: !currentStatus } : job
            )
          );

          message.success(
            `Job ${!currentStatus ? "activated" : "deactivated"} successfully`
          );
        } catch (error) {
          console.error("Error updating job status:", error);
          message.error("Failed to update job status. Please try again.");
        } finally {
          setUpdateLoading(null);
        }
      },
    });
  };

  const handleUpdate = (job: Job) => {
    // You can implement your update logic here
    // For now, just show a message
    message.info(`Update functionality for job: ${job.jobTitle}`);
    console.log("Update job:", job);
  };

  const formatSalary = (min: number, max: number) => {
    return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columns: ColumnsType<Job> = [
    {
      title: "Company",
      dataIndex: "companyLogo",
      key: "company",
      width: 220, // Increased to accommodate company name and industry
      render: (logo: string, record: Job) => (
        <div className="flex items-center space-x-2">
          <Avatar
            src={logo}
            alt={record.companyName}
            size={40}
            className="min-w-10"
          >
            {record.companyName.charAt(0).toUpperCase()}
          </Avatar>
          <div className="hidden md:block">
            <div className="font-medium text-sm">{record.companyName}</div>
            <div className="text-xs text-gray-500">{record.industry}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Position",
      key: "position",
      width: 200,
      render: (_, record: Job) => (
        <div>
          <div className="font-medium text-sm mb-1">{record.jobTitle}</div>
          <div className="text-xs text-gray-600 mb-1">
            {record.jobDesignation}
          </div>
          <div className="flex flex-wrap gap-1">
            <Tag color="blue">{record.jobType}</Tag>
            <Tag color="green">{record.workMode}</Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Details",
      key: "details",
      width: 200, // Adjusted for better content fit
      render: (_, record: Job) => (
        <div className="text-sm space-y-1">
          <div>
            <strong>Location:</strong> {record.jobLocations}
          </div>
          <div>
            <strong>Salary:</strong>{" "}
            {formatSalary(record.salaryMin, record.salaryMax)}
          </div>
          <div>
            <strong>Experience:</strong> {record.experience}
          </div>
        </div>
      ),
    },
    {
      title: "Skills",
      dataIndex: "skills",
      key: "skills",
      width: 200,
      render: (skills: string) => (
        <div
          className="text-xs max-w-[200px] max-h-[100px] overflow-y-auto text-gray-700 p-2 bg-gray-50 rounded [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          title={skills}
        >
          {skills}
        </div>
      ),
    },
    {
      title: "Deadline & Contact",
      key: "deadline_contact",
      width: 200,
      render: (record: Job) => (
        <div className="text-sm flex flex-col space-y-1 text-gray-700">
          <div>
            <span className="font-semibold text-gray-900">Deadline: </span>
            {formatDate(record.applicationDeadLine)}
          </div>
          <div>
            <span className="font-semibold text-gray-900">Contact: </span>
            {record.countryCode} {record.contactNumber}
          </div>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120, 
      render: (_, record: Job) => (
        <div className="flex flex-col gap-2">
          <Button
            type="primary"
            size="small"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
            icon={<EditOutlined />}
            onClick={() => handleUpdate(record)}
          >
            Update
          </Button>
          <Button
            size="small"
            className={`rounded-full text-white ${
              record.jobStatus
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
            loading={updateLoading === record.id}
            onClick={() => handleStatusToggle(record.id, record.jobStatus)}
          >
            {record.jobStatus ? "Active" : "Inactive"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card>
        <div className="mb-6">
          <Title level={2} className="mb-2">
            Jobs Management
          </Title>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={jobs}
            rowKey="id"
            scroll={{ x: 1200 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} jobs`,
            }}
            className="shadow-sm"
          />
        )}
      </Card>
    </div>
  );
};

export default JobsAdminPage;
