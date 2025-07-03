import React, { useState, useCallback } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  DatePicker,
  Switch,
  Card,
  Row,
  Col,
  message,
  Modal,
} from "antd";
import {
  Briefcase,
  Building,
  MapPin,
  DollarSign,
  Clock,
  GraduationCap,
  FileText,
  Gift,
  Zap,
  Send,
} from "lucide-react";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { SelectProps } from "antd";
import BASE_URL from "../Config";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { parsePhoneNumber } from "react-phone-number-input";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { TextArea } = Input;

interface JobFormData {
  applicationDeadLine?: Dayjs;
  jobTitle?: string;
  jobDesignation?: string; // NEW
  companyName?: string;
  industry?: string;
  jobLocations?: string[];
  jobType?: string;
  workMode?: string; // NEW
  description?: string;
  benefits?: string;
  jobStatus?: boolean;
  skills?: string[];
  salaryMin?: number;
  salaryMax?: number;
  qualification?: string;
  qualificationPercentage?: number;
  experience?: string;
  contactNumber?: string;
  countryCode?: string;
  companyLogo?: string;
  logoUploadType?: "upload" | "url";
}

const industries = [
  "Technology",
  "E-commerce",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Marketing",
  "Consulting",
  "Real Estate",
  "Media & Entertainment",
  "Transportation",
  "Construction",
  "Agriculture",
  "Government",
  "Non-profit",
];

const jobTypes = [
  { value: "fulltime", label: "Full Time" },
  { value: "parttime", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "temporary", label: "Temporary" },
  { value: "internship", label: "Internship" },
];

const workModes = [
  { value: "REMOTE", label: "Remote" },
  { value: "ONSITE", label: "On-site" },
  { value: "HYBRID", label: "Hybrid" },
   { value: "FLEXBLE", label: "Flexble" },
];

const qualifications = [
  "High School",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Professional Certification",
  "Trade Certificate",
  "Associate Degree",
  "Other",
];
const experience = [
  "Fresher",
  "Less than 1 year",
  "1-2 years",
  "2-5 years",
  "5-10 years",
  "10+ years",
  "Not Required",
];

const AddJob: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValues, setFormValues] = useState<JobFormData | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [logoUploadType, setLogoUploadType] = useState<"upload" | "url">(
    "upload"
  );
  const navigate = useNavigate();
  const [fullPhone, setFullPhone] = useState<string | undefined>();
  const [countryCode, setCountryCode] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>("");

  const onFinish = useCallback(async (values: JobFormData) => {
    setFormValues(values);
    setIsModalVisible(true);
  }, []);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const accessToken = localStorage.getItem("accessToken"); // Adjust based on your token storage
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch(
        "https://meta.oxyloans.com/api/upload-service/upload?id=45880e62-acaf-4645-a83e-d1c8498e923e&fileType=aadhar",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: uploadFormData,
        }
      );

      const data = await response.json();
      if (data.uploadStatus === "UPLOADED") {
        setLogoUrl(data.documentPath);
        form.setFieldsValue({ companyLogo: data.documentPath });
        message.success("Logo uploaded successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      message.error("Failed to upload logo. Please try again.");
      console.error("Error uploading logo:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleConfirm = useCallback(async () => {
    if (!formValues) return;
    setLoading(true);
    const userId = localStorage.getItem("uniquId");
    try {
      const payload = {
        applicationDeadLine: formValues.applicationDeadLine?.toISOString(),
        jobTitle: formValues.jobTitle,
        jobDesignation: formValues.jobDesignation, // NEW
        companyName: formValues.companyName,
        industry: formValues.industry,
        userId: userId,
        jobLocations: formValues.jobLocations?.join(","),
        jobType: formValues.jobType,
        workMode: formValues.workMode, // NEW
        description: formValues.description,
        benefits: formValues.benefits,
        jobStatus: isActive,
        skills: formValues.skills?.join(","),
        salaryMin: formValues.salaryMin,
        salaryMax: formValues.salaryMax,
        qualifications: formValues.qualificationPercentage
          ? `${formValues.qualification} above ${formValues.qualificationPercentage}%`
          : formValues.qualification,
        experience: Array.isArray(formValues.experience)
          ? formValues.experience.join(", ")
          : formValues.experience,
        contactNumber: contactNumber,
        countryCode: countryCode,
        companyLogo: formValues.companyLogo,
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
        setIsModalVisible(false);
        message.success("Job posted successfully!");
      } else {
        throw new Error("Failed to post job");
      }
      navigate("/admn/alljobdetails");
    } catch (error) {
      message.error("Failed to post job. Please try again.");
      console.error("Error posting job:", error);
    } finally {
      setLoading(false);
    }
  }, [formValues, form]);

  const handleEdit = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const handlePhoneChange = (value: string | undefined) => {
    setFullPhone(value);

    if (value) {
      try {
        const parsed = parsePhoneNumber(value);

        if (parsed) {
          setCountryCode("+" + parsed.countryCallingCode);
          setContactNumber(parsed.nationalNumber);
        } else {
          setCountryCode("");
          setContactNumber("");
        }
      } catch (e) {
        setCountryCode("");
        setContactNumber("");
      }
    } else {
      setCountryCode("");
      setContactNumber("");
    }
  };

  const disabledDate = (current: Dayjs) =>
    current && current < dayjs().endOf("day");

  // Fix TypeScript error by using SelectProps['options']
  const locationFilterOption: SelectProps["filterOption"] = (input, option) =>
    (option?.children as string | undefined)
      ?.toLowerCase()
      .includes(input.toLowerCase()) ?? false;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Post a Job</h1>
      </div>

      <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden bg-white/95">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 -m-6 mb-8">
          <div className="flex items-center text-white">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Job Details</h1>
            </div>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            jobStatus: true,
            jobType: "fulltime",
            workMode: "HYBRID",
            countryCode: "+91",
            applicationDeadLine: dayjs().add(30, "day"),
          }}
          className="space-y-8"
        >
          {/* Basic Information */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-3xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Building className="w-6 h-6 mr-3 text-blue-600" />
              Basic Information
            </h3>
            <Row gutter={[32, 24]}>
              <Col xs={24} lg={12}>
                <Form.Item
                  label={
                    <span className="flex items-center font-semibold text-gray-700">
                      <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
                      Job Title
                    </span>
                  }
                  name="jobTitle"
                  rules={[
                    { required: true, message: "Please enter job title" },
                  ]}
                >
                  <Input
                    placeholder="e.g., Digital Marketing Specialist"
                    className="h-12 rounded-xl"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  label={
                    <span className="flex items-center font-semibold text-gray-700">
                      <Building className="w-5 h-5 mr-2 text-indigo-500" />
                      Company Name
                    </span>
                  }
                  name="companyName"
                  rules={[
                    { required: true, message: "Please enter company name" },
                  ]}
                >
                  <Input
                    placeholder="e.g., ASKOXY.AI"
                    className="h-12 rounded-xl"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  label={
                    <span className="flex items-center font-semibold text-gray-700">
                      <Building className="w-5 h-5 mr-2 text-purple-500" />
                      Industry
                    </span>
                  }
                  name="industry"
                  rules={[
                    { required: true, message: "Please select industry" },
                  ]}
                >
                  <Select
                    placeholder="Select industry"
                    size="large"
                    className="h-12 rounded-xl"
                  >
                    {industries.map((industry) => (
                      <Option key={industry} value={industry}>
                        {industry}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  label={
                    <span className="flex items-center font-semibold text-gray-700">
                      <Clock className="w-5 h-5 mr-2 text-green-500" />
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
                    size="large"
                    className="h-12 rounded-xl"
                  >
                    {jobTypes.map((type) => (
                      <Option key={type.value} value={type.value}>
                        {type.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-3xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Building className="w-6 h-6 mr-3 text-orange-600" />
              Company Details
            </h3>
            <Row gutter={[32, 24]}>
              <Col xs={24} lg={12}>
                <Form.Item
                  label={
                    <span className="flex items-center font-semibold text-gray-700">
                      <Briefcase className="w-5 h-5 mr-2 text-orange-500" />
                      Job Designation
                    </span>
                  }
                  name="jobDesignation"
                  rules={[
                    { required: true, message: "Please enter job designation" },
                  ]}
                >
                  <Input
                    placeholder="e.g., Senior Software Engineer"
                    className="h-12 rounded-xl"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  label={
                    <span className="flex items-center font-semibold text-gray-700">
                      <MapPin className="w-5 h-5 mr-2 text-red-500" />
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
                    size="large"
                    className="h-12 rounded-xl"
                  >
                    {workModes.map((mode) => (
                      <Option key={mode.value} value={mode.value}>
                        {mode.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label={
                    <span className="flex items-center font-semibold text-gray-700">
                      <Building className="w-5 h-5 mr-2 text-blue-500" />
                      Contact Number
                    </span>
                  }
                  name="fullPhone"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a valid phone number",
                    },
                  ]}
                  className="w-full max-w-sm sm:max-w-md md:max-w-lg"
                >
                  <PhoneInput
                    international
                    defaultCountry="IN"
                    value={fullPhone}
                    onChange={handlePhoneChange}
                    className="h-12 rounded-xl border border-gray-300 px-3 py-1 text-base w-full"
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label={
                    <span className="flex items-center font-semibold text-gray-700">
                      <Building className="w-5 h-5 mr-2 text-purple-500" />
                      Company Logo
                    </span>
                  }
                  name="companyLogo"
                >
                  <div className="space-y-4">
                    <div className="flex gap-4 mb-4">
                      <Button
                        type={
                          logoUploadType === "upload" ? "primary" : "default"
                        }
                        onClick={() => setLogoUploadType("upload")}
                        className="rounded-xl"
                      >
                        Upload Image
                      </Button>
                      <Button
                        type={logoUploadType === "url" ? "primary" : "default"}
                        onClick={() => setLogoUploadType("url")}
                        className="rounded-xl"
                      >
                        Enter URL
                      </Button>
                    </div>

                    {logoUploadType === "upload" ? (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file);
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {uploading && (
                          <p className="text-blue-600 mt-2">Uploading...</p>
                        )}
                        {logoUrl && (
                          <div className="mt-4">
                            <img
                              src={logoUrl}
                              alt="Company Logo"
                              className="h-20 w-20 object-cover rounded-xl border"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <Input
                        placeholder="Enter company logo URL"
                        className="h-12 rounded-xl"
                        size="large"
                        onChange={(e) => {
                          setLogoUrl(e.target.value);
                          form.setFieldsValue({ companyLogo: e.target.value });
                        }}
                      />
                    )}

                    {logoUploadType === "url" && logoUrl && (
                      <div className="mt-4">
                        <img
                          src={logoUrl}
                          alt="Company Logo"
                          className="h-20 w-20 object-cover rounded-xl border"
                        />
                      </div>
                    )}
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Location & Timeline */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 p-8 rounded-3xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <MapPin className="w-6 h-6 mr-3 text-green-600" />
              Location & Timeline
            </h3>
            <Row gutter={[32, 24]}>
              <Col xs={24} lg={12}>
                <Form.Item
                  label="Job Locations"
                  name="jobLocations"
                  rules={[
                    { required: true, message: "Please enter job locations" },
                  ]}
                >
                  <Select
                    mode="tags"
                    placeholder="Enter locations (e.g., New York, London, Remote)"
                    size="large"
                    className="rounded-lg"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  label={
                    <span className="flex items-center font-semibold text-gray-700">
                      <Clock className="w-5 h-5 mr-2 text-orange-500" />
                      Application Deadline
                    </span>
                  }
                  name="applicationDeadLine"
                  rules={[
                    {
                      required: true,
                      message: "Please select application deadline",
                    },
                  ]}
                >
                  <DatePicker
                    showTime
                    size="large"
                    placeholder="Select deadline"
                    className="h-12 rounded-xl"
                    disabledDate={disabledDate}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Requirements & Qualifications */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-3xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <GraduationCap className="w-6 h-6 mr-3 text-purple-600" />
              Requirements & Qualifications
            </h3>
            <Row gutter={[32, 24]}>
              <Col xs={24} lg={8}>
                <Form.Item
                  label="Minimum Qualification"
                  name="qualification"
                  rules={[
                    {
                      required: true,
                      message: "Please enter minimum qualification",
                    },
                  ]}
                >
                  <Select
                    mode="tags"
                    placeholder="Enter qualification or select from options"
                    size="large"
                    className="rounded-lg"
                  >
                    {qualifications.map((qual) => (
                      <Option key={qual} value={qual}>
                        {qual}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <span className="flex items-center font-semibold text-gray-700">
                      <GraduationCap className="w-5 h-5 mr-2 text-indigo-500" />
                      Minimum Percentage
                    </span>
                  }
                  name="qualificationPercentage"
                >
                  <InputNumber
                    placeholder="e.g., 70"
                    min={0}
                    max={100}
                    size="large"
                    className="w-full h-12 rounded-xl"
                    formatter={(value) => `${value}%`}
                    parser={(value) => value?.replace("%", "") as any}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item
                  label="Experience"
                  name="experience"
                  rules={[
                    {
                      required: true,
                      message: "Please enter experience required",
                    },
                  ]}
                >
                  <Select
                    mode="tags"
                    placeholder="Enter experience or select from options"
                    size="large"
                    className="rounded-lg"
                  >
                    {experience.map((exp) => (
                      <Option key={exp} value={exp}>
                        {exp}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  label={
                    <span className="flex items-center font-semibold text-gray-700">
                      <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                      Required Skills
                    </span>
                  }
                  name="skills"
                >
                  <Select
                    mode="tags"
                    placeholder="Enter skills (e.g., SEO, SEM, Google Ads)"
                    size="large"
                    className="h-12 rounded-xl"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Compensation & Benefits */}
          <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 p-8 rounded-3xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <DollarSign className="w-6 h-6 mr-3 text-emerald-600" />
              Compensation & Benefits
            </h3>
            <Row gutter={[32, 24]}>
              <Col xs={24} lg={12}>
                <Form.Item
                  label={
                    <span className="flex items-center font-semibold text-gray-700">
                      <DollarSign className="w-5 h-5 mr-2 text-emerald-500" />
                      Minimum Salary (₹)
                    </span>
                  }
                  name="salaryMin"
                  rules={[
                    { required: true, message: "Please enter minimum salary" },
                  ]}
                >
                  <InputNumber
                    placeholder="e.g., 500000"
                    min={0}
                    size="large"
                    className="w-full h-12 rounded-xl"
                    formatter={(value) =>
                      `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  label={
                    <span className="flex items-center font-semibold text-gray-700">
                      <DollarSign className="w-5 h-5 mr-2 text-cyan-500" />
                      Maximum Salary (₹)
                    </span>
                  }
                  name="salaryMax"
                  rules={[
                    { required: true, message: "Please enter maximum salary" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("salaryMin") <= value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "Maximum salary must be greater than minimum salary"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <InputNumber
                    placeholder="e.g., 800000"
                    min={0}
                    size="large"
                    className="w-full h-12 rounded-xl"
                    formatter={(value) =>
                      `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label={
                    <span className="flex items-center font-semibold text-gray-700">
                      <Gift className="w-5 h-5 mr-2 text-pink-500" />
                      Benefits & Perks
                    </span>
                  }
                  name="benefits"
                  rules={[
                    { required: false, message: "Please enter job benefits" },
                  ]}  
                >
                  <TextArea
                    placeholder="e.g., Flexible hours, Health insurance, Work from home"
                    rows={4}
                    className="rounded-xl"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Job Description */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-3xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-amber-600" />
              About Job
            </h3>
            <Row gutter={[32, 24]}>
              <Col xs={24}>
                <Form.Item
                  label={
                    <span className="flex items-center font-semibold text-gray-700">
                      <FileText className="w-5 h-5 mr-2 text-amber-500" />
                      Job Description
                    </span>
                  }
                  name="description"
                  rules={[
                    { required: true, message: "Please enter job description" },
                  ]}
                >
                  <TextArea
                    placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                    rows={5}
                    className="rounded-xl"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  label={
                    <span className="flex items-center font-semibold text-gray-700 text-sm sm:text-base">
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-green-500" />
                      <span className="truncate">Job Status</span>
                    </span>
                  }
                  name="jobStatus"
                  valuePropName="checked"
                  className="mb-4 sm:mb-6"
                >
                  <div className="flex items-center justify-start mt-1 sm:mt-0">
                    <Switch
                      checkedChildren={
                        <span className="text-xs sm:text-sm">Active</span>
                      }
                      unCheckedChildren={
                        <span className="text-xs sm:text-sm">Draft</span>
                      }
                      onChange={setIsActive}
                      size="default"
                    />
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              className="h-16 px-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 border-0 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Send className="w-6 h-6 mr-3" />
              Preview Job
            </Button>
          </div>
        </Form>
      </Card>
      <Modal
        title={
          <div className="flex items-center">
            <FileText className="w-6 h-6 mr-2 text-blue-600" />
            <span>Job Posting Preview</span>
          </div>
        }
        open={isModalVisible}
        onCancel={handleEdit}
        footer={[
          <Button key="edit" onClick={handleEdit} className="h-10 rounded-xl">
            Edit
          </Button>,
          <Button
            key="confirm"
            type="primary"
            loading={loading}
            onClick={handleConfirm}
            className="h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 border-0"
          >
            Confirm & Post
          </Button>,
        ]}
        width={800}
        className="rounded-xl"
      >
        {formValues && (
          <div className="space-y-6 p-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
              Job Details
            </h3>
            <p>
              <strong>Job Title:</strong> {formValues.jobTitle || "N/A"}
            </p>
            <p>
              <strong>Company Name:</strong> {formValues.companyName || "N/A"}
            </p>
            <p>
              <strong>Industry:</strong> {formValues.industry || "N/A"}
            </p>
            <p>
              <strong>Job Type:</strong>{" "}
              {jobTypes.find((type) => type.value === formValues.jobType)
                ?.label || "N/A"}
            </p>
            <p>
              <strong>Job Locations:</strong>{" "}
              {formValues.jobLocations?.join(", ") || "N/A"}
            </p>
            <p>
              <strong>Application Deadline:</strong>{" "}
              {formValues.applicationDeadLine?.format("MMMM D, YYYY HH:mm") ||
                "N/A"}
            </p>

            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
              Requirements
            </h3>
            <p>
              <strong>Experience:</strong> {formValues.experience || "N/A"}
            </p>
            <p>
              <strong>Qualification:</strong>{" "}
              {formValues.qualification || "N/A"}
            </p>
            <p>
              <strong>Skills:</strong> {formValues.skills?.join(", ") || "N/A"}
            </p>

            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-emerald-600" />
              Compensation
            </h3>
            <p>
              <strong>Salary Range:</strong> ₹
              {formValues.salaryMin?.toLocaleString() || "N/A"} - ₹
              {formValues.salaryMax?.toLocaleString() || "N/A"}
            </p>
            <p>
              <strong>Benefits:</strong> {formValues.benefits || "N/A"}
            </p>

            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-amber-600" />
              Description
            </h3>
            <p>{formValues.description || "N/A"}</p>

            <p>
              <strong>Job Status:</strong> {isActive ? "Active" : "Draft"}
            </p>
            <p>
              <strong>Job Designation:</strong>{" "}
              {formValues.jobDesignation || "N/A"}
            </p>
            <p>
              <strong>Work Mode:</strong>
              {workModes.find((mode) => mode.value === formValues.workMode)
                ?.label || "N/A"}
            </p>
            <p>
              <strong>Contact:</strong> {formValues.countryCode}{" "}
              {formValues.contactNumber || "N/A"}
            </p>
            {formValues.companyLogo && (
              <div>
                <strong>Company Logo:</strong>
                <div className="mt-2">
                  <img
                    src={formValues.companyLogo}
                    alt="Company Logo"
                    className="h-16 w-16 object-cover rounded-xl border"
                  />
                </div>
              </div>
            )}

            {/* Update the qualification line in Requirements section */}
            <p>
              <strong>Qualification:</strong>
              {formValues.qualification}
              {formValues.qualificationPercentage &&
                `  ${formValues.qualificationPercentage}%`}
              {!formValues.qualification && "N/A"}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AddJob;
