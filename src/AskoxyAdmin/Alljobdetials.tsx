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
      width: 100,
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
      title: "Job Details",
      key: "jobDetails",
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
      title: "Location",
      dataIndex: "jobLocations",
      key: "location",
      width: 120,
      render: (locations: string) => <div className="text-sm">{locations}</div>,
    },
    {
      title: "Salary",
      key: "salary",
      width: 120,
      render: (_, record: Job) => (
        <div className="text-sm font-medium">
          {formatSalary(record.salaryMin, record.salaryMax)}
        </div>
      ),
    },
    {
      title: "Experience",
      dataIndex: "experience",
      key: "experience",
      width: 100,
      render: (experience: string) => (
        <div className="text-sm">{experience}</div>
      ),
    },
    {
      title: "Skills",
      dataIndex: "skills",
      key: "skills",
      width: 150,
      render: (skills: string) => (
        <div className="text-xs">
          {skills
            .split(",")
            .slice(0, 3)
            .map((skill, index) => (
              <Tag key={index} className="mb-1 text-xs">
                {skill.trim()}
              </Tag>
            ))}
          {skills.split(",").length > 3 && (
            <Tag className="mb-1 text-xs">
              +{skills.split(",").length - 3} more
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Deadline",
      dataIndex: "applicationDeadLine",
      key: "deadline",
      width: 100,
      render: (deadline: number) => (
        <div className="text-sm">{formatDate(deadline)}</div>
      ),
    },
    {
      title: "Contact",
      key: "contact",
      width: 120,
      render: (_, record: Job) => (
        <div className="text-sm">
          {record.countryCode} {record.contactNumber}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record: Job) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleUpdate(record)}
          >
            Update
          </Button>
          <Switch
            size="small"
            checked={record.jobStatus}
            loading={updateLoading === record.id}
            // onChange={() => handleStatusToggle(record.id, record.jobStatus)}
          />
        </Space>
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
