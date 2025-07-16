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
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Row,
  Col,
  Upload,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import BASE_URL from "../Config";

const { Title, Text } = Typography;
const { confirm } = Modal;
const { Option } = Select;
const { TextArea } = Input;

interface Job {
  id: string;
  companyLogo?: string; // Made optional to handle null/undefined
  jobTitle?: string;
  jobDesignation?: string;
  companyName?: string;
  industry?: string;
  userId?: string;
  jobLocations?: string;
  jobType?: string;
  description?: string;
  benefits?: string;
  jobStatus?: boolean;
  skills?: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  qualifications?: string;
  applicationDeadLine?: number;
  experience?: string;
  createdAt?: number;
  updatedAt?: number;
  workMode?: string;
  contactNumber?: string;
  countryCode?: string;
  companyEmail?: string;
  jobSource?: string;
}

interface FormValues {
  jobTitle: string;
  jobDesignation: string;
  companyName: string;
  industry: string;
  jobLocations: string[];
  jobType: string;
  workMode: string;
  description: string;
  benefits?: string; // Made optional
  skills: string[];
  salaryMin?: number;
  salaryMax?: number;
  qualification: string;
  qualificationPercentage?: number;
  applicationDeadLine?: dayjs.Dayjs;
  experience: string;
  companyLogo?: string;
  companyEmail?: string;
  jobSource?: string;
}

const JobsAdminPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [form] = Form.useForm();
  const [isActive, setIsActive] = useState(true);
  const [countryCode, setCountryCode] = useState("+91");
  const [contactNumber, setContactNumber] = useState("");

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
      // Ensure data is an array; fallback to empty array if not
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      message.error("Failed to load jobs. Please try again.");
      setJobs([]); // Fallback to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (jobId: string, currentStatus?: boolean) => {
    confirm({
      title: "Confirm Status Change",
      icon: <ExclamationCircleOutlined />,
      content: ` FullyQualifiedName you sure you want to ${
        currentStatus ? "deactivate" : "activate"
      } this job?`,
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          setUpdateLoading(jobId);
          const response = await fetch(
            `${BASE_URL}/marketing-service/campgin/updatejobstatus`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: jobId,
                jobStatus: currentStatus !== undefined ? !currentStatus : true, // Default to true if undefined
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to update job status");
          }

          setJobs((prevJobs) =>
            prevJobs.map((job) =>
              job.id === jobId
                ? { ...job, jobStatus: currentStatus !== undefined ? !currentStatus : true }
                : job
            )
          );

          message.success(
            `Job ${currentStatus !== undefined && currentStatus ? "deactivated" : "activated"} successfully`
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
    setCurrentJob(job);

    // Parse qualifications safely
    let qualification = "";
    let qualificationPercentage = 0;

    if (job.qualifications && typeof job.qualifications === "string") {
      const qualMatch = job.qualifications.match(/^(.*?)\s+above\s+(\d+)%$/);
      if (qualMatch) {
        qualification = qualMatch[1] || "";
        qualificationPercentage = parseInt(qualMatch[2]) || 0;
      } else {
        qualification = job.qualifications;
      }
    }

    // Parse contact number safely
    setCountryCode(job.countryCode || "+91");
    setContactNumber(job.contactNumber || "");

    // Set form values with null checks
    form.setFieldsValue({
      jobTitle: job.jobTitle || "",
      jobDesignation: job.jobDesignation || "",
      companyName: job.companyName || "",
      industry: job.industry || "",
      jobLocations: job.jobLocations
        ? job.jobLocations.split(",").map((loc) => loc.trim()).filter(Boolean)
        : [],
      jobType: job.jobType || "",
      workMode: job.workMode || "",
      description: job.description || "",
      benefits: job.benefits || "",
      skills: job.skills
        ? job.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
        : [],
      salaryMin: job.salaryMin ?? undefined,
      salaryMax: job.salaryMax ?? undefined,
      qualification: qualification || "",
      qualificationPercentage: qualificationPercentage || undefined,
      applicationDeadLine: job.applicationDeadLine
        ? dayjs(job.applicationDeadLine)
        : undefined,
      experience: job.experience || "",
      companyLogo: job.companyLogo || "",
      companyEmail: job.companyEmail || "",
      jobSource: job.jobSource || "",
    });

    setIsActive(job.jobStatus ?? true); // Default to true if undefined
    setIsUpdateModalVisible(true);
  };

  const handleUpdateSubmit = async (formValues: FormValues) => {
    if (!currentJob) return;

    const userId = localStorage.getItem("admin_uniquId") || "";

    try {
      setUpdateLoading(currentJob.id);

      const payload = {
        id: currentJob.id,
        applicationDeadLine: formValues.applicationDeadLine?.toISOString() ?? undefined,
        jobTitle: formValues.jobTitle || "",
        jobDesignation: formValues.jobDesignation || "",
        companyName: formValues.companyName || "",
        industry: formValues.industry || "",
        userId: userId,
        jobLocations: formValues.jobLocations?.filter(Boolean).join(",") || "",
        jobType: formValues.jobType || "",
        workMode: formValues.workMode || "",
        description: formValues.description || "",
        benefits: formValues.benefits || "",
        jobStatus: isActive ?? true,
        skills: formValues.skills?.filter(Boolean).join(",") || "",
        salaryMin: formValues.salaryMin ?? undefined,
        salaryMax: formValues.salaryMax ?? undefined,
        qualifications: formValues.qualificationPercentage
          ? `${formValues.qualification || ""} above ${formValues.qualificationPercentage}%`
          : formValues.qualification || "",
        experience: Array.isArray(formValues.experience)
          ? formValues.experience.filter(Boolean).join(", ")
          : formValues.experience || "",
        contactNumber: contactNumber || "",
        countryCode: countryCode || "+91",
        companyLogo: formValues.companyLogo || "",
        companyEmail: formValues.companyEmail || "",
        jobSource: formValues.jobSource || "",
      };

      const response = await fetch(
        `${BASE_URL}/marketing-service/campgin/postajob`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        form.resetFields();
        setIsUpdateModalVisible(false);
        setCurrentJob(null);
        message.success("Job updated successfully!");
        fetchJobs();
      } else {
        throw new Error("Failed to update job");
      }
    } catch (error) {
      message.error("Failed to update job. Please try again.");
      console.error("Error updating job:", error);
    } finally {
      setUpdateLoading(null);
    }
  };

  const handleModalCancel = () => {
    setIsUpdateModalVisible(false);
    setCurrentJob(null);
    form.resetFields();
  };

  const formatSalary = (
    min: number | null | undefined,
    max: number | null | undefined
  ) => {
    if (min == null || max == null) {
      return "Salary not disclosed";
    }
    return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) {
      return "N/A"; // Fallback for undefined/null timestamp
    }
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
      width: 220,
      render: (logo: string | undefined, record: Job) => (
        <div className="flex items-center space-x-2">
          <Avatar
            src={logo || undefined}
            alt={record.companyName || "Unknown"}
            size={40}
            className="min-w-10"
          >
            {(record.companyName || "U")[0].toUpperCase()}
          </Avatar>
          <div className="hidden md:block">
            <div className="font-medium text-sm">{record.companyName || "N/A"}</div>
            <div className="text-sm text-gray-500">{record.industry || "N/A"}</div>
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
          <div className="font-medium text-sm mb-1">{record.jobTitle || "N/A"}</div>
          <div className="text-sm text-gray-600 mb-1">{record.jobDesignation || "N/A"}</div>
          <div className="flex flex-wrap gap-1">
            <Tag color="blue">{record.jobType || "N/A"}</Tag>
            <Tag color="green">{record.workMode || "N/A"}</Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Details",
      key: "details",
      width: 180,
      render: (_, record: Job) => (
        <div className="text-sm space-y-1 break-words whitespace-normal">
          <div>
            <strong>Location:</strong> {record.jobLocations || "N/A"}
          </div>
          <div>
            <strong>Salary:</strong>{" "}
            {formatSalary(record.salaryMin, record.salaryMax)}
          </div>
          <div>
            <strong>Experience:</strong> {record.experience || "N/A"}
          </div>
        </div>
      ),
    },
    {
      title: "Skills",
      dataIndex: "skills",
      key: "skills",
      width: 200,
      render: (skills: string | undefined) => (
        <div
          className="text-sm max-w-[200px] max-h-[100px] overflow-y-auto text-gray-700 p-2 bg-gray-50 rounded [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          title={skills || ""}
        >
          {skills || "N/A"}
        </div>
      ),
    },
    {
      title: "Company Details",
      key: "job_details",
      width: 240,
      render: (record: Job) => (
        <div className="text-sm flex flex-col space-y-1 text-gray-700">
          {record.applicationDeadLine && (
            <div>
              <span className="font-semibold text-gray-900">Deadline: </span>
              {formatDate(record.applicationDeadLine)}
            </div>
          )}
          {record.companyEmail && (
            <div>
              <span className="font-semibold text-gray-900">Email: </span>
              {record.companyEmail}
            </div>
          )}
          {record.jobSource && (
            <div>
              <span className="font-semibold text-gray-900">Source: </span>
              {record.jobSource}
            </div>
          )}
          {(record.countryCode || record.contactNumber) && (
            <div>
              <span className="font-semibold text-gray-900">Contact: </span>
              {record.countryCode || ""} {record.contactNumber || "N/A"}
            </div>
          )}
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
            loading={updateLoading === record.id}
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
    <div className="bg-gray-50 min-h-screen">
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
              pageSize: 50,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} jobs`,
            }}
            className="shadow-sm"
          />
        )}
      </Card>

      {/* Update Job Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ✏️ Update Job - {currentJob?.jobTitle || "N/A"}
            </span>
          </div>
        }
        open={isUpdateModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={900}
        className="max-h-[90vh] overflow-y-auto"
        style={{
          top: 20,
        }}
      >
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-lg p-6 -m-6 mb-4">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateSubmit}
            className="mt-4"
          >
            {/* Job Information Section */}
            <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                💼 Job Information
              </h3>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span className="text-gray-700 font-medium">
                        Job Title
                      </span>
                    }
                    name="jobTitle"
                    rules={[
                      { required: true, message: "Please enter job title" },
                    ]}
                  >
                    <Input
                      placeholder="Enter job title"
                      className="border-blue-200 focus:border-blue-400 hover:border-blue-300 transition-colors"
                      prefix={<span className="text-blue-400">📋</span>}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span className="text-gray-700 font-medium">
                        Job Designation
                      </span>
                    }
                    name="jobDesignation"
                    rules={[
                      {
                        required: true,
                        message: "Please enter job designation",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter job designation"
                      className="border-blue-200 focus:border-blue-400 hover:border-blue-300 transition-colors"
                      prefix={<span className="text-blue-400">🏷️</span>}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span className="text-gray-700 font-medium">
                        Job Type
                      </span>
                    }
                    name="jobType"
                    rules={[
                      { required: true, message: "Please select job type" },
                    ]}
                  >
                    <Select
                      placeholder="Select job type"
                      className="border-blue-200 focus:border-blue-400 hover:border-blue-300"
                    >
                      <Option value="Full-time">🕒 Full-time</Option>
                      <Option value="Part-time">⏰ Part-time</Option>
                      <Option value="Contract">📝 Contract</Option>
                      <Option value="Internship">🎓 Internship</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span className="text-gray-700 font-medium">
                        Work Mode
                      </span>
                    }
                    name="workMode"
                    rules={[
                      { required: true, message: "Please select work mode" },
                    ]}
                  >
                    <Select
                      placeholder="Select work mode"
                      className="border-blue-200 focus:border-blue-400 hover:border-blue-300"
                    >
                      <Option value="Remote">🏠 Remote</Option>
                      <Option value="On-site">🏢 On-site</Option>
                      <Option value="Hybrid">⚡ Hybrid</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">
                    Job Locations
                  </span>
                }
                name="jobLocations"
                rules={[
                  { required: true, message: "Please enter job locations" },
                ]}
              >
                <Select
                  mode="tags"
                  placeholder="🌍 Enter job locations"
                  style={{ width: "100%" }}
                  className="border-blue-200 focus:border-blue-400 hover:border-blue-300"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">
                    Skills Required
                  </span>
                }
                name="skills"
                rules={[
                  { required: true, message: "Please enter required skills" },
                ]}
              >
                <Select
                  mode="tags"
                  placeholder="🛠️ Enter required skills"
                  style={{ width: "100%" }}
                  className="border-blue-200 focus:border-blue-400 hover:border-blue-300"
                />
              </Form.Item>
            </div>

            {/* Company Information Section */}
            <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
                🏢 Company Information
              </h3>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span className="text-gray-700 font-medium">
                        Company Name
                      </span>
                    }
                    name="companyName"
                    rules={[
                      { required: true, message: "Please enter company name" },
                    ]}
                  >
                    <Input
                      placeholder="Enter company name"
                      className="border-purple-200 focus:border-purple-400 hover:border-purple-300 transition-colors"
                      prefix={<span className="text-purple-400">🏛️</span>}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span className="text-gray-700 font-medium">
                        Industry
                      </span>
                    }
                    name="industry"
                    rules={[
                      { required: true, message: "Please enter industry" },
                    ]}
                  >
                    <Input
                      placeholder="Enter industry"
                      className="border-purple-200 focus:border-purple-400 hover:border-purple-300 transition-colors"
                      prefix={<span className="text-purple-400">🏭</span>}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span className="text-gray-700 font-medium">
                        Company Logo URL
                      </span>
                    }
                    name="companyLogo"
                  >
                    <Input
                      placeholder="Enter company logo URL"
                      className="border-purple-200 focus:border-purple-400 hover:border-purple-300 transition-colors"
                      prefix={<span className="text-purple-400">🖼️</span>}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span className="text-gray-700 font-medium">
                        Company Email
                      </span>
                    }
                    name="companyEmail"
                    rules={[
                      { type: "email", message: "Please enter valid email" },
                    ]}
                  >
                    <Input
                      placeholder="Enter company email"
                      className="border-purple-200 focus:border-purple-400 hover:border-purple-300 transition-colors"
                      prefix={<span className="text-purple-400">📧</span>}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Compensation & Requirements Section */}
            <div className="bg-white rounded-lg shadow-sm border border-green-100 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
                💰 Compensation & Requirements
              </h3>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span className="text-gray-700 font-medium">
                        Minimum Salary
                      </span>
                    }
                    name="salaryMin"
                    rules={[
                      {
                        required: false,
                        message: "Please enter minimum salary",
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Enter minimum salary"
                      style={{ width: "100%" }}
                      className="border-green-200 focus:border-green-400 hover:border-green-300"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value!.replace(/₹\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span className="text-gray-700 font-medium">
                        Maximum Salary
                      </span>
                    }
                    name="salaryMax"
                    rules={[
                      {
                        required: false,
                        message: "Please enter maximum salary",
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Enter maximum salary"
                      style={{ width: "100%" }}
                      className="border-green-200 focus:border-green-400 hover:border-green-300"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value!.replace(/₹\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span className="text-gray-700 font-medium">
                        Qualification
                      </span>
                    }
                    name="qualification"
                    rules={[
                      { required: true, message: "Please enter qualification" },
                    ]}
                  >
                    <Input
                      placeholder="Enter qualification"
                      className="border-green-200 focus:border-green-400 hover:border-green-300 transition-colors"
                      prefix={<span className="text-green-400">🎓</span>}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span className="text-gray-700 font-medium">
                        Qualification Percentage
                      </span>
                    }
                    name="qualificationPercentage"
                  >
                    <InputNumber
                      placeholder="Enter percentage"
                      style={{ width: "100%" }}
                      min={0}
                      max={100}
                      className="border-green-200 focus:border-green-400 hover:border-green-300"
                      formatter={(value) => `${value}%`}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span className="text-gray-700 font-medium">
                        Experience Required
                      </span>
                    }
                    name="experience"
                    rules={[
                      {
                        required: true,
                        message: "Please enter experience required",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter experience required"
                      className="border-green-200 focus:border-green-400 hover:border-green-300 transition-colors"
                      prefix={<span className="text-green-400">💼</span>}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span className="text-gray-700 font-medium">
                        Application Deadline
                      </span>
                    }
                    name="applicationDeadLine"
                    rules={[
                      {
                        required: false,
                        message: "Please select application deadline",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      placeholder="Select deadline"
                      format="YYYY-MM-DD"
                      className="border-green-200 focus:border-green-400 hover:border-green-300"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Job Details Section */}
            <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                📝 Job Details
              </h3>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">
                    Job Description
                  </span>
                }
                name="description"
                rules={[
                  { required: true, message: "Please enter job description" },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="📄 Enter job description"
                  className="border-orange-200 focus:border-orange-400 hover:border-orange-300 transition-colors"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">Benefits</span>
                }
                name="benefits"
              >
                <TextArea
                  rows={3}
                  placeholder="🎁 Enter benefits"
                  className="border-orange-200 focus:border-orange-400 hover:border-orange-300 transition-colors"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">Job Source</span>
                }
                name="jobSource"
              >
                <Input
                  placeholder="Enter job source"
                  className="border-orange-200 focus:border-orange-400 hover:border-orange-300 transition-colors"
                  prefix={<span className="text-orange-400">🔗</span>}
                />
              </Form.Item>
            </div>

            {/* Contact Information Section */}
            <div className="bg-white rounded-lg shadow-sm border border-pink-100 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-pink-600 rounded-full"></div>
                📞 Contact Information
              </h3>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label={
                      <span className="text-gray-700 font-medium">
                        Country Code
                      </span>
                    }
                  >
                    <Select
                      value={countryCode}
                      onChange={setCountryCode}
                      style={{ width: "100%" }}
                      className="border-pink-200 focus:border-pink-400 hover:border-pink-300"
                    >
                      <Option value="+91">🇮🇳 +91</Option>
                      <Option value="+1">🇺🇸 +1</Option>
                      <Option value="+44">🇬🇧 +44</Option>
                      <Option value="+971">🇦🇪 +971</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    label={
                      <span className="text-gray-700 font-medium">
                        Contact Number
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please enter contact number",
                      },
                    ]}
                  >
                    <Input
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="Enter contact number"
                      className="border-pink-200 focus:border-pink-400 hover:border-pink-300 transition-colors"
                      prefix={<span className="text-pink-400">📱</span>}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Status Section */}
            <div className="bg-white rounded-lg shadow-sm border border-indigo-100 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full"></div>
                ⚡ Job Status
              </h3>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">Job Status</span>
                }
              >
                <div className="flex items-center gap-3">
                  <Switch
                    checked={isActive}
                    onChange={setIsActive}
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                    className="bg-gray-300"
                    style={{
                      backgroundColor: isActive ? "#10b981" : "#6b7280",
                    }}
                  />
                  <span
                    className={`text-sm font-medium ${
                      isActive ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {isActive ? "✅ Job is Active" : "❌ Job is Inactive"}
                  </span>
                </div>
              </Form.Item>
            </div>

            {/* Action Buttons */}
            <Form.Item className="mb-0">
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  onClick={handleModalCancel}
                  className="px-6 py-2 h-auto border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                >
                  ❌ Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={updateLoading === currentJob?.id}
                  className="px-6 py-2 h-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-none shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {updateLoading === currentJob?.id
                    ? "⏳ Updating..."
                    : "✅ Update Job"}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default JobsAdminPage;