import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Tag,
  Modal,
  message,
  Switch,
  Typography,
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { adminApi as axios } from "../utils/axiosInstances";
import BASE_URL from "../Config";

const { Title } = Typography;
const { confirm } = Modal;
const { Option } = Select;
const { TextArea } = Input;

interface Job {
  id: string;
  companyLogo?: string;
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

  const [distinctCompanies, setDistinctCompanies] = useState<
    Record<string, string>
  >({});
  const [selectedCompany, setSelectedCompany] = useState<string>("ALL");
  const [searchText, setSearchText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [totalElements, setTotalElements] = useState<number>(0);

  useEffect(() => {
    fetchDistinctCompanies();
    fetchJobs(1, 50, "ALL");
  }, []);

  const fetchDistinctCompanies = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/marketing-service/campgin/distinct-company-names`,
      );
      const data =
        response.data?.data || response.data?.response || response.data;
      if (Array.isArray(data)) {
        const compMap: Record<string, string> = {};
        data.forEach((item: any) => {
          if (typeof item === "string") {
            compMap[item] = item;
          } else if (item && typeof item === "object") {
            const key = item.companyName || item.name || String(item);
            compMap[key] = key;
          }
        });
        setDistinctCompanies(compMap);
      } else if (data && typeof data === "object") {
        setDistinctCompanies(data);
      }
    } catch (error) {
      console.error("Error fetching distinct companies:", error);
    }
  };

  const fetchJobs = async (
    page: number = currentPage,
    size: number = pageSize,
    company: string = selectedCompany,
  ) => {
    try {
      setLoading(true);
      if (company && company !== "ALL") {
        const response = await axios.get(
          `${BASE_URL}/marketing-service/campgin/all-jobs-by-name?companyName=${encodeURIComponent(company)}`,
        );
        const data =
          response.data?.data || response.data?.response || response.data;
        const jobList = Array.isArray(data)
          ? data
          : Array.isArray(response.data)
            ? response.data
            : [];
        setJobs(jobList);
        setTotalElements(jobList.length);
        setCurrentPage(page);
      } else {
        const apiPage = Math.max(0, page - 1);
        const response = await axios.get(
          `${BASE_URL}/marketing-service/campgin/getalljobsbypagenation?page=${apiPage}&size=${size}`,
        );
        const data =
          response.data?.data || response.data?.response || response.data;
        const jobList = Array.isArray(data?.content)
          ? data.content
          : Array.isArray(response.data?.content)
            ? response.data.content
            : Array.isArray(data)
              ? data
              : [];
        const total =
          typeof data?.totalElements === "number"
            ? data.totalElements
            : typeof response.data?.totalElements === "number"
              ? response.data.totalElements
              : jobList.length;

        setJobs(jobList);
        setTotalElements(total);
        setCurrentPage(page);
        setPageSize(size);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      message.error("Failed to load jobs. Please try again.");
      setJobs([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyChange = (company: string) => {
    setSelectedCompany(company);
    setCurrentPage(1);
    fetchJobs(1, pageSize, company);
  };

  const handleTableChange = (pagination: any) => {
    const newPage = pagination.current || 1;
    const newPageSize = pagination.pageSize || pageSize;
    if (selectedCompany === "ALL") {
      fetchJobs(newPage, newPageSize, "ALL");
    } else {
      setCurrentPage(newPage);
      setPageSize(newPageSize);
    }
  };

  const handleStatusToggle = async (jobId: string, currentStatus?: boolean) => {
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
          await axios.post(
            `${BASE_URL}/marketing-service/campgin/updatejobstatus`,
            {
              id: jobId,
              jobStatus: currentStatus !== undefined ? !currentStatus : true,
            },
          );

          setJobs((prevJobs) =>
            prevJobs.map((job) =>
              job.id === jobId
                ? {
                    ...job,
                    jobStatus:
                      currentStatus !== undefined ? !currentStatus : true,
                  }
                : job,
            ),
          );

          message.success(
            `Job ${currentStatus !== undefined && currentStatus ? "deactivated" : "activated"} successfully`,
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
    const rawQual = job.qualifications || (job as any).qualification || "";

    if (rawQual && typeof rawQual === "string") {
      const qualMatch = rawQual.match(/^(.*?)\s+above\s+(\d+)%$/);
      if (qualMatch) {
        qualification = qualMatch[1] || "";
        qualificationPercentage = parseInt(qualMatch[2]) || 0;
      } else {
        qualification = rawQual;
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
        ? job.jobLocations
            .split(",")
            .map((loc) => loc.trim())
            .filter(Boolean)
        : [],
      jobType: job.jobType || "",
      workMode: job.workMode || "",
      description: job.description || "",
      benefits: job.benefits || "",
      skills: job.skills
        ? job.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
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

    if (!contactNumber.trim()) {
      message.error("Please enter a valid contact number.");
      return;
    }

    const userId = localStorage.getItem("admin_uniquId") || "";

    try {
      setUpdateLoading(currentJob.id);

      const locationsFormatted = Array.isArray(formValues.jobLocations)
        ? formValues.jobLocations.filter(Boolean).join(",")
        : formValues.jobLocations || "";

      const skillsFormatted = Array.isArray(formValues.skills)
        ? formValues.skills.filter(Boolean).join(",")
        : formValues.skills || "";

      const payload = {
        id: currentJob.id,
        applicationDeadLine:
          formValues.applicationDeadLine?.toISOString() ?? undefined,
        jobTitle: formValues.jobTitle || "",
        jobDesignation: formValues.jobDesignation || "",
        companyName: formValues.companyName || "",
        industry: formValues.industry || "",
        userId: userId,
        jobLocations: locationsFormatted,
        jobType: formValues.jobType || "",
        workMode: formValues.workMode || "",
        description: formValues.description || "",
        benefits: formValues.benefits || "",
        jobStatus: isActive ?? true,
        skills: skillsFormatted,
        salaryMin: formValues.salaryMin ?? undefined,
        salaryMax: formValues.salaryMax ?? undefined,
        qualifications: formValues.qualificationPercentage
          ? `${formValues.qualification || ""} above ${formValues.qualificationPercentage}%`
          : formValues.qualification || "",
        experience: Array.isArray(formValues.experience)
          ? formValues.experience.filter(Boolean).join(", ")
          : formValues.experience || "",
        contactNumber: contactNumber.trim(),
        countryCode: countryCode || "+91",
        companyLogo: formValues.companyLogo || "",
        companyEmail: formValues.companyEmail || "",
        jobSource: formValues.jobSource || "",
      };

      await axios.post(
        `${BASE_URL}/marketing-service/campgin/postajob`,
        payload,
      );

      form.resetFields();
      setIsUpdateModalVisible(false);
      setCurrentJob(null);
      message.success("Job updated successfully!");
      fetchJobs(currentPage, pageSize, selectedCompany);
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
    max: number | null | undefined,
  ) => {
    const minVal = min != null ? Number(min) : NaN;
    const maxVal = max != null ? Number(max) : NaN;
    const hasMin = !isNaN(minVal) && minVal > 0;
    const hasMax = !isNaN(maxVal) && maxVal > 0;

    if (!hasMin && !hasMax) {
      return "Salary not disclosed";
    }
    if (hasMin && hasMax) {
      return `₹${minVal.toLocaleString("en-IN")} - ₹${maxVal.toLocaleString("en-IN")}`;
    }
    if (hasMin) {
      return `₹${minVal.toLocaleString("en-IN")}+`;
    }
    return `Up to ₹${maxVal.toLocaleString("en-IN")}`;
  };

  const formatDate = (timestamp?: number | string) => {
    if (!timestamp) {
      return "N/A";
    }
    const num = Number(timestamp);
    let date: Date;
    if (!isNaN(num) && num > 0) {
      // 10-digit unix seconds vs 13-digit milliseconds
      const timeMs = num < 10000000000 ? num * 1000 : num;
      date = new Date(timeMs);
    } else {
      date = new Date(timestamp);
    }
    if (isNaN(date.getTime())) {
      return "N/A";
    }
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const pagination = { current: currentPage, pageSize };

  const columns: ColumnsType<Job> = [
    {
      title: "S.NO",
      key: "serial",
      align: "center",

      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Company",
      key: "company",
     
      render: (_, record: Job) => (
        <div>
          <div
            className="font-semibold text-sm text-gray-900"
            title={record.companyName }
          >
            {record.companyName }
          </div>
          <div
            className="text-xs text-gray-500"
            title={record.industry || "N/A"}
          >
            {record.industry || "N/A"}
          </div>
        </div>
      ),
    },
    {
      title: "Position",
      key: "position",
      width: 280,
      render: (_, record) => (
        <div>
          <div className="font-medium text-sm mb-1">{record.jobTitle}</div>
          <div className="text-sm text-gray-600 mb-1">
            {record.jobDesignation}
          </div>
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
      width: 280,
      render: (_, record) => (
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
      width: 240,
      render: (skills: string | string[] | undefined) => {
        if (!skills) return <span className="text-gray-400">N/A</span>;
        const skillList = Array.isArray(skills)
          ? skills
          : typeof skills === "string"
            ? skills
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [];
        if (skillList.length === 0)
          return <span className="text-gray-400">N/A</span>;
        return (
          <div className="flex flex-wrap gap-1 max-w-[220px] max-h-[90px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {skillList.map((skill, idx) => (
              <Tag key={idx} color="geekblue" className="text-xs mr-0 mb-1">
                {skill}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: "Company Details",
      key: "job_details",
      width: 240,
      render: (record) => (
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
      title: "Posted Date",
      key: "posted_date",
      width: 160,
      render: (_, record: Job) => (
        <div className="text-xs space-y-1">
          <div>
            <span className="text-gray-500 font-medium">Created: </span>
            <span className="text-gray-800 font-semibold block">
              {formatDate(record.createdAt)}
            </span>
          </div>
          {record.updatedAt && record.updatedAt !== record.createdAt && (
            <div>
              <span className="text-gray-400">Updated: </span>
              <span className="text-gray-600 block">
                {formatDate(record.updatedAt)}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions", 
    
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

  const filteredJobs = jobs.filter((job) => {
    if (!searchText.trim()) return true;
    const query = searchText.toLowerCase().trim();
    return (
      (job.jobTitle && job.jobTitle.toLowerCase().includes(query)) ||
      (job.jobDesignation && job.jobDesignation.toLowerCase().includes(query)) ||
      (job.companyName && job.companyName.toLowerCase().includes(query)) ||
      (job.skills && job.skills.toLowerCase().includes(query)) ||
      (job.jobLocations && job.jobLocations.toLowerCase().includes(query))
    );
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <Card>
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Title level={2} className="!mb-1">
              Jobs Management
            </Title>
            <div className="text-sm text-gray-500">
              Total Jobs:{" "}
              <span className="font-semibold text-purple-700">
                {totalElements}
              </span>
              {searchText.trim() && (
                <span className="ml-2 text-blue-600">
                  (Showing {filteredJobs.length} filtered)
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Input.Search
              placeholder="Search title, designation, skills..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={(value) => setSearchText(value)}
              allowClear
              style={{ width: 260 }}
            />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Company:
              </span>
              <Select
                value={selectedCompany}
                onChange={handleCompanyChange}
                style={{ minWidth: 200 }}
                placeholder="Select Company"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  { label: "All Companies", value: "ALL" },
                  ...Object.entries(distinctCompanies).map(([label, val]) => ({
                    label: label,
                    value: val,
                  })),
                ]}
              />
            </div>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => fetchJobs(currentPage, pageSize, selectedCompany)}
              loading={loading}
              title="Refresh jobs"
            >
              Refresh
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredJobs}
          rowKey="id"
          scroll={{ x: true }}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: searchText.trim() ? filteredJobs.length : totalElements,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} jobs`,
          }}
          onChange={handleTableChange}
          className="shadow-sm"
        />
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
        style={{
          top: 20,
        }}
        bodyStyle={{
          maxHeight: "calc(90vh - 120px)",
          overflowY: "auto",
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
                      parser={(value) =>
                        (value ? value.replace(/₹\s?|(,*)/g, "") : "") as any
                      }
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
                      parser={(value) =>
                        (value ? value.replace(/₹\s?|(,*)/g, "") : "") as any
                      }
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
                      placeholder="Enter percentage (e.g. 70)"
                      style={{ width: "100%" }}
                      min={0}
                      max={100}
                      addonAfter="%"
                      className="border-green-200 focus:border-green-400 hover:border-green-300"
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
