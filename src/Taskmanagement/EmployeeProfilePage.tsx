import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Grid,
  Input,
  Row,
  Select,
  Spin,
  Tag,
  Typography,
} from "antd";
import {
  CameraOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  CloseOutlined,
  BuildOutlined,
  RobotOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";

import { employeeApi } from "../utils/axiosInstances";
import BASE_URL from "../Config";
import UserPanelLayout from "./UserPanelLayout";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const PRIMARY = "#008cba";
const PRIMARY_DARK = "#006f94";
const SECONDARY = "#1ab394";

const PLATFORMS = [
  { value: "oxybricks", label: "Oxybricks", short: "OB" },
  { value: "oxyloans", label: "OxyLoans", short: "OL" },
  { value: "oxygold", label: "OxyGold", short: "OG" },
  { value: "oxyglobal", label: "OxyGlobal", short: "OX" },
  { value: "ai_agents", label: "AI Agents", short: "AI" },
  { value: "askoxy_ai", label: "Askoxy.ai", short: "AO" },
  { value: "study_abroad", label: "Study Abroad", short: "SA" },
];

const ROLE_OPTIONS = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "React Developer",
  "Angular Developer",
  "Node.js Developer",
  "Java Developer",
  "Python Developer",
  "Mobile App Developer",
  "Software Engineer",
  "Senior Software Engineer",
  "Technical Lead",
  "Team Lead",
  "Project Manager",
  "Product Manager",
  "Engineering Manager",
  "UI/UX Designer",
  "Graphic Designer",
  "Motion Graphic Designer",
  "Video Editor",
  "3D Designer",
  "QA Engineer",
  "QA Tester",
  "Automation Tester",
  "Manual Tester",
  "Test Engineer",
  "Business Analyst",
  "Senior Business Analyst",
  "Data Analyst",
  "AI Engineer",
  "Machine Learning Engineer",
  "Prompt Engineer",
  "HR Executive",
  "HR Recruiter",
  "Talent Acquisition Specialist",
  "HR Manager",
  "Human Resources Manager",
  "Sales Executive",
  "Sales Manager",
  "Business Development Executive",
  "Business Development Manager",
  "Marketing Executive",
  "Digital Marketing Executive",
  "Social Media Manager",
  "Operations Executive",
  "Operations Manager",
  "Customer Support Executive",
  "Telecalling Executive",
  "Accountant",
  "Finance Executive",
  "Consultant",
  "Trainer",
  "Mentor",
  "Freelancer",
  "Director",
  "Managing Director",
  "Chief Executive Officer (CEO)",
  "Chief Technology Officer (CTO)",
  "Chief Operating Officer (COO)",
  "Chief Marketing Officer (CMO)",
  "Chief Financial Officer (CFO)",
  "Founder",
  "Co-Founder",
];

type UsageLevel = "high" | "moderate" | "low";
type AiToolsByLevel = Record<UsageLevel, string>;

interface ToolUsageItem {
  usageLevel: string;
  tools: string[];
}

interface EmployeeProfileResponse {
  aboutMe?: string | null;
  dateOfJoining?: string | null;
  designation?: string | null;
  empNumber?: string | null;
  employeeId?: string | null;
  imageUrl?: string | null;
  location?: string | null;
  projectType?: string | null;
  skills?: string | null;
  toolUsage?: ToolUsageItem[];
}

const cleanText = (value: unknown) => String(value ?? "").trim();

const digits10 = (value: string) =>
  (value || "").replace(/\D/g, "").slice(0, 10);

const splitCommaValues = (value?: string | null) =>
  value
    ? value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
    : [];

const parseDesignations = (designation?: string | null) =>
  splitCommaValues(designation);

const parseToolUsage = (
  toolUsage?: ToolUsageItem[],
): AiToolsByLevel => {
  const result: AiToolsByLevel = {
    high: "",
    moderate: "",
    low: "",
  };

  if (!Array.isArray(toolUsage)) return result;

  toolUsage.forEach((item) => {
    const tools = Array.isArray(item.tools)
      ? item.tools.map((tool) => cleanText(tool)).filter(Boolean).join(", ")
      : "";

    const level = cleanText(item.usageLevel).toUpperCase();

    if (level === "HIGH") result.high = tools;
    if (level === "MODERATE") result.moderate = tools;
    if (level === "LOW") result.low = tools;
  });

  return result;
};

const buildToolUsageArray = (
  values: Partial<AiToolsByLevel>,
): ToolUsageItem[] => {
  const result: ToolUsageItem[] = [];

  const push = (level: UsageLevel, apiLevel: string) => {
    const raw = cleanText(values[level]);
    if (!raw) return;

    const tools = raw
      .split(",")
      .map((tool) => tool.trim())
      .filter(Boolean);

    if (tools.length) {
      result.push({
        usageLevel: apiLevel,
        tools,
      });
    }
  };

  push("high", "HIGH");
  push("moderate", "MODERATE");
  push("low", "LOW");

  return result;
};

const formatJoiningDate = (value?: string | null) => {
  if (!value) return "Not added";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const extractUploadedUrl = (data: any): string => {
  if (!data) return "";

  if (typeof data === "string") {
    return data.replace(/^"|"$/g, "").trim();
  }

  return (
    data.imageUrl ||
    data.url ||
    data.fileUrl ||
    data.documentUrl ||
    data.documentPath ||
    data?.data?.imageUrl ||
    data?.data?.url ||
    data?.data?.fileUrl ||
    data?.data?.documentUrl ||
    data?.data?.documentPath ||
    ""
  );
};

const EmployeeProfilePage: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = useMemo(() => !screens.md, [screens.md]);

  const [form] = Form.useForm();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasProfileData, setHasProfileData] = useState(false);
  const [mobErr, setMobErr] = useState("");
  const [profile, setProfile] = useState<EmployeeProfileResponse>({});

  const userId =
    sessionStorage.getItem("userId") ||
    localStorage.getItem("userId") ||
    "";

  const employeeName =
    sessionStorage.getItem("Name") ||
    sessionStorage.getItem("name") ||
    "Employee";

  const employeeEmail =
    sessionStorage.getItem("email") ||
    sessionStorage.getItem("Email") ||
    "";

  const designationValues = Form.useWatch("designation", form) as
    | string[]
    | undefined;

  const selectedPlatforms = Form.useWatch("projectType", form) as
    | string[]
    | undefined;

  const aiToolsHigh = Form.useWatch("aiToolsHigh", form) as
    | string
    | undefined;

  const aiToolsModerate = Form.useWatch("aiToolsModerate", form) as
    | string
    | undefined;

  const aiToolsLow = Form.useWatch("aiToolsLow", form) as
    | string
    | undefined;

  const watchedAboutMe = Form.useWatch("aboutMe", form) as
    | string
    | undefined;

  const watchedLocation = Form.useWatch("location", form) as
    | string
    | undefined;

  const getEmployeeSkills = async () => {
    if (!userId) {
      setPageLoading(false);
      setIsEditMode(true);
      return;
    }

    setPageLoading(true);

    try {
      const response = await employeeApi.get(
        `${BASE_URL}/user-service/write/getEmployeeSkills/${userId}`,
      );

      const data: EmployeeProfileResponse = response.data || {};
      const parsedTools = parseToolUsage(data.toolUsage);
      const projectTypes = splitCommaValues(data.projectType);
      const designations = parseDesignations(data.designation);

      setProfile(data);

      const hasData = Boolean(
        cleanText(data.skills) ||
        cleanText(data.projectType) ||
        cleanText(data.designation) ||
        cleanText(data.aboutMe) ||
        cleanText(data.location) ||
        cleanText(data.imageUrl) ||
        cleanText(data.dateOfJoining) ||
        cleanText(data.empNumber) ||
        parsedTools.high ||
        parsedTools.moderate ||
        parsedTools.low,
      );

      setHasProfileData(hasData);

      form.setFieldsValue({
        mobileNumber: digits10(data.empNumber || ""),
        skills: cleanText(data.skills),
        projectType: projectTypes,
        designation: designations,
        aiToolsHigh: parsedTools.high,
        aiToolsModerate: parsedTools.moderate,
        aiToolsLow: parsedTools.low,
        location: cleanText(data.location),
        aboutMe: cleanText(data.aboutMe),
        dateOfJoining: data.dateOfJoining
          ? String(data.dateOfJoining).slice(0, 10)
          : "",
        imageUrl: cleanText(data.imageUrl),
      });

      setIsEditMode(!hasData);
    } catch (error) {
      console.error("Failed to load employee profile:", error);

      setHasProfileData(false);
      setIsEditMode(true);

      form.setFieldsValue({
        mobileNumber: digits10(
          sessionStorage.getItem("mobileNumber") || "",
        ),
      });
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    getEmployeeSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const canUploadImage = Boolean(userId) && !uploadingImage;

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid image",
        text: "Please select a valid image file.",
        confirmButtonColor: PRIMARY,
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      await Swal.fire({
        icon: "warning",
        title: "Image too large",
        text: "Please upload an image smaller than 5 MB.",
        confirmButtonColor: PRIMARY,
      });
      return;
    }

    if (!userId) {
      await Swal.fire({
        icon: "error",
        title: "User not found",
        text: "Please log in again before uploading a profile image.",
        confirmButtonColor: PRIMARY,
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploadingImage(true);

    try {
      const response = await employeeApi.patch(
        `${BASE_URL}/user-service/write/profileUpload`,
        formData,
        {
          params: {
            fileType: "image",
            id: userId,
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const uploadedUrl = extractUploadedUrl(response.data);

      if (!uploadedUrl) {
        throw new Error(
          "Image uploaded, but the API did not return an image URL.",
        );
      }

      form.setFieldsValue({ imageUrl: uploadedUrl });

      setProfile((prev) => ({
        ...prev,
        imageUrl: uploadedUrl,
      }));

      await Swal.fire({
        icon: "success",
        title: "Profile image updated",
        text: "Your profile image has been uploaded successfully.",
        confirmButtonColor: PRIMARY,
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to upload the profile image.";

      await Swal.fire({
        icon: "error",
        title: "Upload failed",
        text: message,
        confirmButtonColor: PRIMARY,
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setMobErr("");

    try {
      await form.validateFields();
    } catch {
      return;
    }

    const values = form.getFieldsValue(true);

    const mobile = digits10(values.mobileNumber || "");
    const skills = cleanText(values.skills);
    const projectType: string[] = values.projectType || [];
    const designations: string[] = values.designation || [];

    if (!mobile || mobile.length !== 10) {
      setMobErr("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (/^(\d)\1{9}$/.test(mobile)) {
      setMobErr(
        "Mobile number cannot contain the same digit repeatedly.",
      );
      return;
    }

    if (!/^[6-9]/.test(mobile)) {
      setMobErr("Mobile number must start with 6, 7, 8, or 9.");
      return;
    }

    if (!userId) {
      setMobErr("User details not found. Please log in again.");
      return;
    }

    const toolUsage = buildToolUsageArray({
      high: values.aiToolsHigh,
      moderate: values.aiToolsModerate,
      low: values.aiToolsLow,
    });

    const payload = {
      aboutMe: cleanText(values.aboutMe) || null,
      dateOfJoining: values.dateOfJoining
        ? new Date(`${values.dateOfJoining}T00:00:00`).toISOString()
        : null,
      designation: designations.join(", "),
      empNumber: mobile,
      employeeId: userId,
      imageUrl: cleanText(values.imageUrl) || null,
      location: cleanText(values.location) || null,
      projectType: projectType.join(", "),
      skills,
      toolUsage,
    };

    setSaving(true);

    try {
      await employeeApi.patch(
        `${BASE_URL}/user-service/write/updateEmployeeSkills`,
        payload,
      );

      // Keep the existing mobile endpoint integration as well.
      await employeeApi.patch(
        `${BASE_URL}/user-service/users/${userId}/empMobile`,
        null,
        {
          params: {
            mobileNumber: mobile,
          },
        },
      );

      sessionStorage.setItem("mobileNumber", mobile);

      setIsEditMode(false);
      setHasProfileData(true);

      await Swal.fire({
        icon: "success",
        title: "Profile updated",
        text: "Your employee profile has been updated successfully.",
        confirmButtonColor: PRIMARY,
      });

      await getEmployeeSkills();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Unable to update employee profile. Please try again.";

      setMobErr(message);

      await Swal.fire({
        icon: "error",
        title: "Update failed",
        text: message,
        confirmButtonColor: PRIMARY,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    setMobErr("");
    setIsEditMode(false);
    await getEmployeeSkills();

    Swal.fire({
      icon: "info",
      title: "Edit cancelled",
      text: "Your saved profile information has been restored.",
      confirmButtonColor: PRIMARY,
    });
  };

  const profileImage =
    cleanText(form.getFieldValue("imageUrl")) ||
    cleanText(profile.imageUrl);

  const roles =
    designationValues?.length
      ? designationValues
      : parseDesignations(profile.designation);

  const platforms =
    selectedPlatforms?.length
      ? selectedPlatforms
      : splitCommaValues(profile.projectType);

  const aboutMe =
    cleanText(watchedAboutMe) ||
    cleanText(profile.aboutMe) ||
    "Add a short introduction about your experience, strengths, and the work you do.";

  const location =
    cleanText(watchedLocation) ||
    cleanText(profile.location) ||
    "Location not added";

  const primaryDesignation =
    roles?.[0] || "Employee";

  const mobileNumber =
    digits10(form.getFieldValue("mobileNumber") || profile.empNumber || "");

  const toolChipData = [
    {
      title: "High Usage",
      level: "high",
      value:
        cleanText(aiToolsHigh) ||
        parseToolUsage(profile.toolUsage).high,
      className: "tool-chip tool-chip--high",
    },
    {
      title: "Moderate Usage",
      level: "moderate",
      value:
        cleanText(aiToolsModerate) ||
        parseToolUsage(profile.toolUsage).moderate,
      className: "tool-chip tool-chip--moderate",
    },
    {
      title: "Low Usage",
      level: "low",
      value:
        cleanText(aiToolsLow) ||
        parseToolUsage(profile.toolUsage).low,
      className: "tool-chip tool-chip--low",
    },
  ];

  const renderOverview = () => (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card className="profile-section-card" bordered={false}>
            <div className="section-title">
              <BuildOutlined />
              <span>Platforms Access</span>
            </div>

            {platforms.length ? (
              <div className="platform-grid">
                {platforms.map((platform) => {
                  const item = PLATFORMS.find(
                    (option) => option.value === platform,
                  );

                  return (
                    <div className="platform-tile" key={platform}>
                      <div className="platform-icon">
                        {item?.short || platform.slice(0, 2).toUpperCase()}
                      </div>
                      <span>{item?.label || platform}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-copy">
                No working platforms added yet.
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="profile-section-card" bordered={false}>
            <div className="section-title">
              <RobotOutlined />
              <span>AI Tools Usage</span>
            </div>

            <div className="tool-groups">
              {toolChipData.map((group) => {
                const tools = splitCommaValues(group.value);

                return (
                  <div className="tool-group" key={group.level}>
                    <div
                      className={`tool-group-title tool-group-title--${group.level}`}
                    >
                      {group.title}
                    </div>

                    {tools.length ? (
                      <div className="tool-chip-wrap">
                        {tools.map((tool) => (
                          <span
                            className={group.className}
                            key={`${group.level}-${tool}`}
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="tool-empty">No tools added</span>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="profile-section-card" bordered={false}>
            <div className="section-title">
              <TeamOutlined />
              <span>Roles / Designations</span>
            </div>

            {roles?.length ? (
              <div className="roles-wrap">
                {roles.map((role) => (
                  <Tag
                    key={role}
                    className="role-tag"
                    closable={false}
                  >
                    {role}
                  </Tag>
                ))}
              </div>
            ) : (
              <div className="empty-copy">
                No roles or designations added yet.
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Card
        className="profile-about-card"
        bordered={false}
        style={{ marginTop: 16 }}
      >
        <div className="about-icon">
          <UserOutlined />
        </div>

        <div className="about-copy">
          <div className="section-title section-title--compact">
            <span>About Me</span>
          </div>
          <Paragraph style={{ marginBottom: 0, color: "#475569" }}>
            {aboutMe}
          </Paragraph>
        </div>
      </Card>
    </>
  );

  const fieldDisabled =
    saving || pageLoading || (!isEditMode && hasProfileData);

  const renderEditForm = () => (
    <Card className="edit-card" bordered={false}>
      <Spin
        spinning={saving}
        tip="Updating employee profile..."
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark
          validateTrigger={["onChange", "onBlur"]}
        >
          {mobErr && (
            <Alert
              type="error"
              showIcon
              message={mobErr}
              style={{ marginBottom: 18, borderRadius: 10 }}
            />
          )}

          <div className="form-section-title">Personal Information</div>
          <Divider style={{ margin: "8px 0 20px" }} />

          <Row gutter={[18, 8]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Employee Mobile Number"
                name="mobileNumber"
                rules={[
                  {
                    required: true,
                    message: "Employee mobile number is required.",
                  },
                ]}
              >
                <Input
                  size="large"
                  addonBefore="+91"
                  maxLength={10}
                  inputMode="numeric"
                  disabled={fieldDisabled}
                  placeholder="Enter 10-digit mobile number"
                  onChange={(event) => {
                    form.setFieldsValue({
                      mobileNumber: digits10(event.target.value),
                    });
                    if (mobErr) setMobErr("");
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Work Location"
                name="location"
                rules={[
                  {
                    required: true,
                    message: "Work location is required.",
                  },
                ]}
              >
                <Input
                  size="large"
                  disabled={fieldDisabled}
                  placeholder="Enter work location, e.g. Hyderabad, Telangana"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Employee Joining Date"
                name="dateOfJoining"
                rules={[
                  {
                    required: true,
                    message: "Employee joining date is required.",
                  },
                ]}
              >
                <Input
                  type="date"
                  size="large"
                  disabled={fieldDisabled}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Employee Skills"
                name="skills"
              >
                <Input
                  size="large"
                  disabled={fieldDisabled}
                  placeholder="React Js, TypeScript, Git, Ant Design..."
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Professional Summary"
                name="aboutMe"
                rules={[
                  {
                    required: true,
                    message: "Professional summary is required.",
                  },
                  {
                    min: 20,
                    message: "Please enter at least 20 characters.",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  maxLength={600}
                  showCount
                  disabled={fieldDisabled}
                  placeholder="Briefly describe your experience, responsibilities, and strengths..."
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="form-section-title">Work Information</div>
          <Divider style={{ margin: "8px 0 20px" }} />

          <Row gutter={[18, 8]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Employee Working Platforms"
                name="projectType"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one working platform.",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  size="large"
                  allowClear
                  maxTagCount="responsive"
                  disabled={fieldDisabled}
                  placeholder="Select platforms"
                  options={PLATFORMS.map((item) => ({
                    label: item.label,
                    value: item.value,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Employee Roles / Designations"
                name="designation"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one employee role.",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  size="large"
                  allowClear
                  maxTagCount="responsive"
                  disabled={fieldDisabled}
                  showSearch
                  optionFilterProp="label"
                  placeholder="Search and select roles"
                  options={ROLE_OPTIONS.map((role) => ({
                    label: role,
                    value: role,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="form-section-title">
            AI Tools & Usage Levels
          </div>
          <Divider style={{ margin: "8px 0 20px" }} />

          <Row gutter={[18, 8]}>
            <Col xs={24} md={8}>
              <Form.Item
                label={<Tag color="green">High Usage</Tag>}
                name="aiToolsHigh"
              >
                <Input.TextArea
                  rows={3}
                  disabled={fieldDisabled}
                  placeholder="ChatGPT, Claude, Gemini AI"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label={<Tag color="gold">Moderate Usage</Tag>}
                name="aiToolsModerate"
              >
                <Input.TextArea
                  rows={3}
                  disabled={fieldDisabled}
                  placeholder="Copilot, Cursor AI..."
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label={<Tag color="blue">Low Usage</Tag>}
                name="aiToolsLow"
              >
                <Input.TextArea
                  rows={3}
                  disabled={fieldDisabled}
                  placeholder="Other AI tools..."
                />
              </Form.Item>
            </Col>
          </Row>

          {isEditMode && (
            <div className="form-actions">
              <Button
                type="primary"
                size="large"
                loading={saving}
                onClick={handleSave}
                style={{
                  background: PRIMARY,
                  borderColor: PRIMARY,
                  minWidth: 150,
                  fontWeight: 700,
                }}
              >
                {hasProfileData ? "Update Profile" : "Save Profile"}
              </Button>

              {hasProfileData && (
                <Button
                  size="large"
                  icon={<CloseOutlined />}
                  disabled={saving}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              )}
            </div>
          )}
        </Form>
      </Spin>
    </Card>
  );

  return (
    <UserPanelLayout>
      <div className="profile-page">
        <Spin
          spinning={pageLoading}
          tip="Loading employee profile..."
          size="large"
        >
          <div className="page-heading">
            <div>
              <Title
                level={isMobile ? 4 : 3}
                style={{ margin: 0, color: "#0f172a" }}
              >
                My Profile
              </Title>
              <div className="heading-line" />
            </div>
          </div>

          <Card
            className="profile-hero"
            bordered={false}
          >
            <div className="hero-content">
              <div className="hero-avatar-area">
                <div className="avatar-wrap">
                  <Avatar
                    size={isMobile ? 104 : 128}
                    src={profileImage || undefined}
                    icon={!profileImage ? <UserOutlined /> : undefined}
                    style={{
                      background: "#dbeafe",
                      color: PRIMARY,
                      border: "4px solid rgba(255,255,255,.95)",
                      boxShadow: "0 8px 24px rgba(15,23,42,.12)",
                    }}
                  />

                  <button
                    type="button"
                    className="camera-button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!canUploadImage}
                    aria-label="Upload profile image"
                  >
                    {uploadingImage ? (
                      <span className="camera-spinner" />
                    ) : (
                      <CameraOutlined />
                    )}
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              <div className="hero-main">
                <div className="hero-title-row">
                  <Title
                    level={2}
                    style={{
                      margin: 0,
                      fontSize: isMobile ? 24 : 30,
                      color: "#0f172a",
                    }}
                  >
                    {employeeName}
                  </Title>
                  <Tag color="green" className="active-tag">
                    Active
                  </Tag>
                </div>

                <Text className="designation-text">
                  {primaryDesignation}
                </Text>

                <div className="contact-row">
                  {employeeEmail && (
                    <span className="contact-item">
                      <MailOutlined />
                      {employeeEmail}
                    </span>
                  )}

                  {mobileNumber && (
                    <span className="contact-item">
                      <PhoneOutlined />
                      +91 {mobileNumber}
                    </span>
                  )}
                </div>

                <div className="location-row">
                  <EnvironmentOutlined />
                  <span>{location}</span>
                </div>
              </div>

              <div className="hero-side">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setIsEditMode(true);
                  }}
                  disabled={pageLoading || saving}
                  style={{
                    background: PRIMARY,
                    borderColor: PRIMARY,
                    fontWeight: 700,
                    height: 42,
                    borderRadius: 9,
                  }}
                >
                  Edit Profile
                </Button>

                <div className="side-meta">
                  <div className="side-meta-item">
                    <CalendarOutlined />
                    <div>
                      <span className="side-label">Joined On</span>
                      <strong>
                        {formatJoiningDate(profile.dateOfJoining)}
                      </strong>
                    </div>
                  </div>

                  <div className="side-meta-item">
                    <BuildOutlined />
                    <div>
                      <span className="side-label">Designation</span>
                      <strong>{primaryDesignation}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="profile-content profile-content--no-tabs">
            {!isEditMode ? renderOverview() : renderEditForm()}
          </div>
        </Spin>
      </div>

      <style>{`
        .profile-page {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px 14px 32px;
          background: #fff;
        }

        .page-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .heading-line {
          width: 34px;
          height: 3px;
          margin-top: 7px;
          border-radius: 999px;
          background: ${PRIMARY};
        }

        .profile-hero {
          overflow: hidden;
          border: 1px solid #dbeafe !important;
          border-radius: 16px !important;
          background:
            radial-gradient(circle at 90% 0%, rgba(34, 211, 238, .15), transparent 30%),
            linear-gradient(135deg, #ffffff 0%, #f0fbff 54%, #dff8fb 100%) !important;
          box-shadow: 0 6px 20px rgba(15, 23, 42, .05);
        }

        .profile-hero .ant-card-body {
          padding: 28px 32px;
        }

        .hero-content {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 28px;
        }

        .avatar-wrap {
          position: relative;
          display: inline-flex;
        }

        .camera-button {
          position: absolute;
          right: -2px;
          bottom: 2px;
          width: 38px;
          height: 38px;
          border: 1px solid #dbe3ed;
          border-radius: 50%;
          background: #fff;
          color: #0f172a;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(15, 23, 42, .12);
        }

        .camera-button:disabled {
          opacity: .65;
          cursor: not-allowed;
        }

        .camera-spinner {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          border: 2px solid #dbeafe;
          border-top-color: ${PRIMARY};
          animation: cameraSpin .7s linear infinite;
        }

        @keyframes cameraSpin {
          to { transform: rotate(360deg); }
        }

        .hero-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .active-tag {
          border-radius: 999px !important;
          font-weight: 600;
          padding-inline: 10px !important;
        }

        .designation-text {
          display: block;
          margin-top: 5px;
          color: #334155;
          font-size: 16px;
          font-weight: 600;
        }

        .contact-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px 20px;
          margin-top: 16px;
        }

        .contact-item,
        .location-row {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #334155;
          font-size: 14px;
        }

        .contact-item .anticon,
        .location-row .anticon {
          color: ${PRIMARY};
        }

        .location-row {
          margin-top: 12px;
        }

        .hero-side {
          min-width: 190px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 18px;
        }

        .side-meta {
          width: 100%;
          display: grid;
          gap: 13px;
        }

        .side-meta-item {
          display: grid;
          grid-template-columns: 24px minmax(0, 1fr);
          gap: 10px;
          align-items: start;
          color: #334155;
        }

        .side-meta-item > .anticon {
          margin-top: 3px;
          color: #0f172a;
          font-size: 17px;
        }

        .side-meta-item strong,
        .side-label {
          display: block;
        }

        .side-label {
          margin-bottom: 2px;
          color: #64748b;
          font-size: 12px;
        }

        .side-meta-item strong {
          color: #0f172a;
          font-size: 13px;
        }

        .profile-content {
          margin-top: 18px;
        }

        .profile-content--no-tabs {
          margin-top: 18px;
        }

        .edit-card .ant-form-item-label > label {
          color: #1e293b;
          font-size: 13px;
          font-weight: 700;
        }

        .edit-card .ant-form-item-required::before {
          margin-inline-end: 5px !important;
        }

        .edit-card .ant-form-item {
          margin-bottom: 18px;
        }

        .profile-section-card {
          height: 100%;
          min-height: 310px;
          border: 1px solid #e2e8f0 !important;
          border-radius: 14px !important;
          box-shadow: 0 4px 16px rgba(15, 23, 42, .035);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          color: #0f172a;
          font-weight: 800;
          font-size: 15px;
        }

        .section-title .anticon {
          color: ${PRIMARY};
        }

        .section-title--compact {
          margin-bottom: 6px;
        }

        .platform-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .platform-tile {
          min-height: 88px;
          padding: 10px 7px;
          border: 1px solid #e2e8f0;
          border-radius: 11px;
          background: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #334155;
          text-align: center;
          font-size: 12px;
          font-weight: 600;
        }

        .platform-icon {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #dff7fa, #e0f2fe);
          color: ${PRIMARY_DARK};
          font-size: 11px;
          font-weight: 800;
        }

        .tool-groups {
          display: grid;
          gap: 18px;
        }

        .tool-group-title {
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 800;
        }

        .tool-group-title--high { color: #15803d; }
        .tool-group-title--moderate { color: #c2410c; }
        .tool-group-title--low { color: #0369a1; }

        .tool-chip-wrap,
        .roles-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .tool-chip {
          display: inline-flex;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
        }

        .tool-chip--high {
          color: #166534;
          background: #ecfdf3;
        }

        .tool-chip--moderate {
          color: #c2410c;
          background: #fff7ed;
        }

        .tool-chip--low {
          color: #075985;
          background: #eff6ff;
        }

        .tool-empty,
        .empty-copy {
          color: #94a3b8;
          font-size: 12px;
        }

        .role-tag {
          margin: 0 !important;
          padding: 6px 10px !important;
          border: 0 !important;
          border-radius: 8px !important;
          color: #075985 !important;
          background: #eff6ff !important;
          font-size: 12px !important;
          font-weight: 600;
        }

        .profile-about-card {
          border: 1px solid #e2e8f0 !important;
          border-radius: 14px !important;
          box-shadow: 0 4px 16px rgba(15, 23, 42, .03);
        }

        .profile-about-card .ant-card-body {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .about-icon {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: #fff;
          background: linear-gradient(135deg, ${PRIMARY}, #34d399);
        }

        .about-copy {
          min-width: 0;
          flex: 1;
        }

        .edit-card {
          border: 1px solid #e2e8f0 !important;
          border-radius: 14px !important;
          box-shadow: 0 4px 16px rgba(15, 23, 42, .035);
        }

        .edit-card .ant-input,
        .edit-card .ant-input-affix-wrapper,
        .edit-card .ant-select-selector {
          border-radius: 9px !important;
        }

        .form-section-title {
          margin-top: 2px;
          color: ${PRIMARY_DARK};
          font-size: 14px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .04em;
        }

        .form-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 14px;
          padding-top: 18px;
          border-top: 1px solid #e2e8f0;
        }

        @media (max-width: 991px) {
          .hero-content {
            grid-template-columns: auto minmax(0, 1fr);
          }

          .hero-side {
            grid-column: 1 / -1;
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .side-meta {
            width: auto;
            grid-template-columns: repeat(2, minmax(140px, 1fr));
          }

          .profile-section-card {
            min-height: auto;
          }
        }

        @media (max-width: 767px) {
          .profile-page {
            padding: 12px 4px 24px;
          }

          .profile-hero .ant-card-body {
            padding: 20px 16px;
          }

          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 18px;
          }

          .hero-avatar-area {
            display: flex;
            justify-content: center;
          }

          .hero-main {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .hero-title-row,
          .contact-row,
          .location-row {
            justify-content: center;
          }

          .hero-side {
            flex-direction: column;
            align-items: stretch;
          }

          .side-meta {
            width: 100%;
            grid-template-columns: 1fr 1fr;
            text-align: left;
          }

          .platform-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .profile-about-card .ant-card-body {
            padding: 16px;
          }

          .edit-card .ant-card-body {
            padding: 18px 14px;
          }

          .form-actions .ant-btn {
            flex: 1 1 100%;
          }
        }

        @media (max-width: 480px) {
          .side-meta {
            grid-template-columns: 1fr;
          }

          .platform-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </UserPanelLayout>
  );
};

export default EmployeeProfilePage;
