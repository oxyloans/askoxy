import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Avatar,
  Button,
  Col,
  DatePicker,
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
import dayjs from "dayjs";

import { employeeApi } from "../utils/axiosInstances";
import BASE_URL from "../Config";
import UserPanelLayout from "./UserPanelLayout";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const PRIMARY = "#008cba";

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

  const getEmployeeSkills = async (options?: {
    silentLoading?: boolean;
    preserveEditMode?: boolean;
  }) => {
    const silentLoading = Boolean(options?.silentLoading);
    const preserveEditMode = Boolean(options?.preserveEditMode);

    if (!userId) {
      if (!silentLoading) setPageLoading(false);
      if (!preserveEditMode) setIsEditMode(true);
      return false;
    }

    if (!silentLoading) setPageLoading(true);

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
          ? dayjs(data.dateOfJoining)
          : null,
        imageUrl: cleanText(data.imageUrl),
      });

      if (!preserveEditMode) setIsEditMode(!hasData);
      return true;
    } catch (error) {
      console.error("Failed to load employee profile:", error);

      if (!preserveEditMode) {
        setHasProfileData(false);
        setIsEditMode(true);

        form.setFieldsValue({
          mobileNumber: digits10(
            sessionStorage.getItem("mobileNumber") || "",
          ),
        });
      }

      return false;
    } finally {
      if (!silentLoading) setPageLoading(false);
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

    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedImageTypes.includes(file.type)) {
      await Swal.fire({
        icon: "warning",
        title: "Unsupported image",
        text: "Please upload a JPG, JPEG, PNG, or WebP image.",
        confirmButtonColor: PRIMARY,
      });
      return;
    }

    if (file.size <= 0) {
      await Swal.fire({
        icon: "warning",
        title: "Empty image file",
        text: "Please choose a valid image file and try again.",
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

      // Re-fetch the saved profile immediately after upload so the UI always
      // reflects the backend response. Keep the refresh silent and preserve
      // the user's current edit mode for a smoother experience.
      await getEmployeeSkills({
        silentLoading: true,
        preserveEditMode: true,
      });

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
        ? values.dateOfJoining.startOf("day").toISOString()
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
      chipClass:
        "inline-flex rounded-lg border border-green-200 bg-white px-2.5 py-1 text-xs font-semibold text-green-800",
      titleClass: "text-green-700",
    },
    {
      title: "Moderate Usage",
      level: "moderate",
      value:
        cleanText(aiToolsModerate) ||
        parseToolUsage(profile.toolUsage).moderate,
      chipClass:
        "inline-flex rounded-lg border border-orange-200 bg-white px-2.5 py-1 text-xs font-semibold text-orange-700",
      titleClass: "text-orange-700",
    },
    {
      title: "Low Usage",
      level: "low",
      value:
        cleanText(aiToolsLow) ||
        parseToolUsage(profile.toolUsage).low,
      chipClass:
        "inline-flex rounded-lg border border-blue-200 bg-white px-2.5 py-1 text-xs font-semibold text-sky-800",
      titleClass: "text-sky-700",
    },
  ];

  const renderOverview = () => (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)] sm:p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
            <BuildOutlined className="text-[#008cba]" />
            <span>Platforms Access</span>
          </div>

          {platforms.length ? (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {platforms.map((platform) => {
                const item = PLATFORMS.find((option) => option.value === platform);

                return (
                  <div
                    key={platform}
                    className="flex min-h-[76px] min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2 py-2.5 text-center text-xs font-semibold text-slate-700"
                  >
                    <div className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-[11px] font-extrabold text-[#006f94]">
                      {item?.short || platform.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="max-w-full break-words">
                      {item?.label || platform}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="m-0 text-xs text-slate-400">
              No working platforms added yet.
            </p>
          )}
        </section>

        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)] sm:p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
            <RobotOutlined className="text-[#008cba]" />
            <span>AI Tools Usage</span>
          </div>

          <div className="grid gap-3">
            {toolChipData.map((group) => {
              const tools = splitCommaValues(group.value);

              return (
                <div key={group.level}>
                  <div className={`mb-1.5 text-xs font-bold ${group.titleClass}`}>
                    {group.title}
                  </div>

                  {tools.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {tools.map((tool) => (
                        <span
                          key={`${group.level}-${tool}`}
                          className={group.chipClass}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">No tools added</span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)] sm:p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
            <TeamOutlined className="text-[#008cba]" />
            <span>Roles / Designations</span>
          </div>

          {roles?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {roles.map((role) => (
                <span
                  key={role}
                  className="rounded-lg border border-blue-200 bg-white px-2.5 py-1 text-xs font-semibold text-sky-800"
                >
                  {role}
                </span>
              ))}
            </div>
          ) : (
            <p className="m-0 text-xs text-slate-400">
              No roles or designations added yet.
            </p>
          )}
        </section>
      </div>

      <section className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)] sm:p-5">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-[#008cba]">
          <UserOutlined />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-sm font-bold text-slate-900">About Me</div>
          <p className="m-0 break-words text-sm leading-7 text-slate-600">
            {aboutMe}
          </p>
        </div>
      </section>
    </>
  );

  const fieldDisabled =
    saving || pageLoading || (!isEditMode && hasProfileData);

  const fieldClass =
    "!rounded-xl !border-slate-300 hover:!border-slate-400 focus:!border-[#008cba] focus:!shadow-[0_0_0_3px_rgba(0,140,186,0.08)]";

  const selectClass =
    "w-full [&_.ant-select-selector]:!min-h-[38px] [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border-slate-300 [&_.ant-select-selector]:!shadow-none hover:[&_.ant-select-selector]:!border-slate-400 [&.ant-select-focused_.ant-select-selector]:!border-[#008cba] [&.ant-select-focused_.ant-select-selector]:!shadow-[0_0_0_3px_rgba(0,140,186,0.08)] max-md:[&_.ant-select-selector]:!min-h-[42px]";

  const sectionClass =
    "mb-3 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4";

  const sectionHeadingClass =
    "mb-3 border-b border-slate-100 pb-2.5 sm:mb-4";

  const renderEditForm = () => (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_2px_10px_rgba(15,23,42,0.04)] sm:p-4">
      <Spin spinning={saving} tip="Updating employee profile...">
        <Form
          form={form}
          layout="vertical"
          requiredMark
          validateTrigger={["onChange", "onBlur"]}
          scrollToFirstError={{ behavior: "smooth", block: "center" }}
          className="[&_.ant-form-item]:!mb-4 [&_.ant-form-item-label>label]:!h-auto [&_.ant-form-item-label>label]:!text-[13px] [&_.ant-form-item-label>label]:!font-semibold [&_.ant-form-item-label>label]:!text-slate-700 [&_.ant-form-item-explain-error]:!mt-1 [&_.ant-form-item-explain-error]:!text-xs"
        >
          {mobErr && (
            <Alert
              type="error"
              showIcon
              message={mobErr}
              className="!mb-4 !rounded-xl"
            />
          )}

          <section className={sectionClass} aria-labelledby="personal-information-title">
            <div className={sectionHeadingClass}>
              <div
                id="personal-information-title"
                className="text-sm font-bold text-slate-900"
              >
                Personal Information
              </div>
              <p className="mb-0 mt-1 text-xs leading-5 text-slate-500">
                Keep your core employee details accurate and up to date.
              </p>
            </div>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Employee Mobile Number"
                  name="mobileNumber"
                  rules={[
                    { required: true, message: "Employee mobile number is required." },
                    {
                      pattern: /^[6-9]\d{9}$/,
                      message: "Enter a valid 10-digit Indian mobile number.",
                    },
                    {
                      validator: (_, value) =>
                        /^(\d)\1{9}$/.test(String(value || ""))
                          ? Promise.reject(
                            new Error(
                              "Mobile number cannot contain the same digit repeatedly.",
                            ),
                          )
                          : Promise.resolve(),
                    },
                  ]}
                >
                  <Input
                    size="middle"
                    addonBefore="+91"
                    prefix={<PhoneOutlined className="text-slate-400" />}
                    maxLength={10}
                    inputMode="numeric"
                    autoComplete="tel"
                    disabled={fieldDisabled}
                    placeholder="Enter 10-digit mobile number"
                    className={fieldClass}
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
                    { required: true, message: "Work location is required." },
                    { whitespace: true, message: "Work location cannot be blank." },
                    { min: 2, message: "Work location must be at least 2 characters." },
                    { max: 100, message: "Work location cannot exceed 100 characters." },
                  ]}
                >
                  <Input
                    size="middle"
                    prefix={<EnvironmentOutlined className="text-slate-400" />}
                    autoComplete="organization-locality"
                    disabled={fieldDisabled}
                    placeholder="e.g. Hyderabad, Telangana"
                    className={fieldClass}
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
                  <DatePicker
                    size="middle"
                    format="DD MMM YYYY"
                    disabledDate={(current) =>
                      Boolean(
                        current &&
                        current.startOf("day").isAfter(dayjs().startOf("day")),
                      )
                    }
                    placeholder="Select joining date"
                    suffixIcon={<CalendarOutlined />}
                    disabled={fieldDisabled}
                    className={`w-full max-md:!min-h-[42px] ${fieldClass}`}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Employee Skills"
                  name="skills"
                  rules={[
                    { required: true, message: "Employee skills are required." },
                    { whitespace: true, message: "Employee skills cannot be blank." },
                    { min: 2, message: "Please enter at least one valid skill." },
                    { max: 300, message: "Employee skills cannot exceed 300 characters." },
                  ]}
                >
                  <Input
                    size="middle"
                    prefix={<BuildOutlined className="text-slate-400" />}
                    disabled={fieldDisabled}
                    placeholder="React, TypeScript, Git, Ant Design..."
                    className={fieldClass}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label="Professional Summary"
                  name="aboutMe"
                  rules={[
                    { required: true, message: "Professional summary is required." },
                    { whitespace: true, message: "Professional summary cannot be blank." },
                    { min: 20, message: "Please enter at least 20 characters." },
                    { max: 600, message: "Professional summary cannot exceed 600 characters." },
                  ]}
                >
                  <Input.TextArea
                    autoSize={{ minRows: 4, maxRows: 7 }}
                    maxLength={600}
                    showCount
                    disabled={fieldDisabled}
                    placeholder="Briefly describe your experience, responsibilities, strengths, and current focus..."
                    className={`${fieldClass} !leading-6`}
                  />
                </Form.Item>
              </Col>
            </Row>
          </section>

          <section className={sectionClass} aria-labelledby="work-information-title">
            <div className={sectionHeadingClass}>
              <div
                id="work-information-title"
                className="text-sm font-bold text-slate-900"
              >
                Work Information
              </div>
              <p className="mb-0 mt-1 text-xs leading-5 text-slate-500">
                Choose the platforms and roles that best describe your current work.
              </p>
            </div>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Employee Working Platforms"
                  name="projectType"
                  rules={[
                    {
                      required: true,
                      type: "array",
                      min: 1,
                      message: "Please select at least one working platform.",
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    size="middle"
                    allowClear
                    maxTagCount="responsive"
                    disabled={fieldDisabled}
                    showSearch
                    optionFilterProp="label"
                    placeholder="Search and select platforms"
                    suffixIcon={<BuildOutlined />}
                    className={selectClass}
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
                      type: "array",
                      min: 1,
                      message: "Please select at least one employee role.",
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    size="middle"
                    allowClear
                    maxTagCount="responsive"
                    disabled={fieldDisabled}
                    showSearch
                    optionFilterProp="label"
                    placeholder="Search and select roles"
                    suffixIcon={<TeamOutlined />}
                    className={selectClass}
                    options={ROLE_OPTIONS.map((role) => ({
                      label: role,
                      value: role,
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>
          </section>

          <section className={sectionClass} aria-labelledby="ai-tools-title">
            <div className={sectionHeadingClass}>
              <div id="ai-tools-title" className="text-sm font-bold text-slate-900">
                AI Tools &amp; Usage Levels
              </div>
              <p className="mb-0 mt-1 text-xs leading-5 text-slate-500">
                Add comma-separated tools based on how frequently you use them.
              </p>
            </div>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={8}>
                <Form.Item
                  label={<span className="font-semibold text-green-700">High Usage</span>}
                  name="aiToolsHigh"
                >
                  <Input.TextArea
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    maxLength={300}
                    showCount
                    disabled={fieldDisabled}
                    placeholder="ChatGPT, Claude, Gemini AI"
                    className={`${fieldClass} !leading-6`}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  label={<span className="font-semibold text-orange-700">Moderate Usage</span>}
                  name="aiToolsModerate"
                >
                  <Input.TextArea
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    maxLength={300}
                    showCount
                    disabled={fieldDisabled}
                    placeholder="Copilot, Cursor AI..."
                    className={`${fieldClass} !leading-6`}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  label={<span className="font-semibold text-sky-700">Low Usage</span>}
                  name="aiToolsLow"
                >
                  <Input.TextArea
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    maxLength={300}
                    showCount
                    disabled={fieldDisabled}
                    placeholder="Other AI tools..."
                    className={`${fieldClass} !leading-6`}
                  />
                </Form.Item>
              </Col>
            </Row>
          </section>

          {isEditMode && (
            <div className="sticky bottom-0 z-10 -mx-3 -mb-3 mt-2 flex flex-wrap gap-2.5 border-t border-slate-200 bg-white/95 px-3 py-3 backdrop-blur-sm sm:static sm:mx-0 sm:mb-0 sm:mt-3 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-4 sm:backdrop-blur-none">
              <Button
                type="primary"
                size="middle"
                loading={saving}
                onClick={handleSave}
                className="!h-10 !min-w-[150px] !rounded-xl !border-[#008cba] !bg-[#008cba] !font-bold hover:!border-[#007da6] hover:!bg-[#007da6] max-sm:!w-full"
              >
                {hasProfileData ? "Update Profile" : "Save Profile"}
              </Button>

              {hasProfileData && (
                <Button
                  size="middle"
                  icon={<CloseOutlined />}
                  disabled={saving}
                  onClick={handleCancel}
                  className="!h-10 !rounded-xl max-sm:!w-full"
                >
                  Cancel
                </Button>
              )}
            </div>
          )}
        </Form>
      </Spin>
    </div>
  );

  return (
    <UserPanelLayout>
      <div className="mx-auto w-full max-w-[1400px] bg-white px-2 pb-6 pt-2 sm:px-3 sm:pt-3 lg:px-4">
        <Spin spinning={pageLoading} tip="Loading employee profile..." size="large">
          <header className="mb-3 flex items-center justify-between">
            <div>
              <Title
                level={isMobile ? 4 : 3}
                className="!m-0 !text-slate-950"
              >
                My Profile
              </Title>
              <div className="mt-1.5 h-[3px] w-9 rounded-full bg-[#008cba]" />
            </div>
          </header>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)] sm:p-5 lg:p-6">
            <div className="grid grid-cols-1 items-center gap-4 text-center md:grid-cols-[auto_minmax(0,1fr)] md:text-left lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-5">
              <div className="flex justify-center md:justify-start">
                <div className="relative inline-flex">
                  <Avatar
                    size={isMobile ? 104 : 128}
                    src={profileImage || undefined}
                    icon={!profileImage ? <UserOutlined /> : undefined}
                    className="!border-4 !border-white !bg-blue-100 !text-[#008cba] !shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!canUploadImage}
                    aria-label="Upload profile image"
                    className="absolute -right-0.5 bottom-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-md transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {uploadingImage ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-100 border-t-[#008cba]" />
                    ) : (
                      <CameraOutlined />
                    )}
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                    hidden
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              <div className="min-w-0 md:text-left">
                <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                  <Title
                    level={2}
                    className="!m-0 !text-2xl !text-slate-950 sm:!text-[30px]"
                  >
                    {employeeName}
                  </Title>
                  <Tag
                    color="green"
                    className="!m-0 !rounded-full !px-2.5 !font-semibold"
                  >
                    Active
                  </Tag>
                </div>

                <Text className="!mt-1 block !text-base !font-semibold !text-slate-700">
                  {primaryDesignation}
                </Text>

                <div className="mt-2.5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-slate-700 md:justify-start">
                  {employeeEmail && (
                    <span className="inline-flex min-w-0 items-center gap-2 break-all">
                      <MailOutlined className="shrink-0 text-[#008cba]" />
                      {employeeEmail}
                    </span>
                  )}

                  {mobileNumber && (
                    <span className="inline-flex items-center gap-2">
                      <PhoneOutlined className="text-[#008cba]" />
                      +91 {mobileNumber}
                    </span>
                  )}
                </div>

                <div className="mt-2 inline-flex items-start gap-2 text-sm text-slate-700">
                  <EnvironmentOutlined className="mt-0.5 shrink-0 text-[#008cba]" />
                  <span className="break-words">{location}</span>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 md:col-span-2 md:flex-row md:items-center md:justify-between lg:col-span-1 lg:w-auto lg:min-w-[190px] lg:flex-col lg:items-stretch">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setIsEditMode(true)}
                  disabled={pageLoading || saving}
                  className="!h-10 !rounded-xl !border-[#008cba] !bg-[#008cba] !font-bold hover:!border-[#007da6] hover:!bg-[#007da6]"
                >
                  Edit Profile
                </Button>

                <div className="grid w-full grid-cols-1 gap-2.5 text-left sm:grid-cols-2 md:w-auto lg:w-full lg:grid-cols-1">
                  <div className="grid grid-cols-[24px_minmax(0,1fr)] items-start gap-2 text-slate-700">
                    <CalendarOutlined className="mt-0.5 text-base text-slate-900" />
                    <div className="min-w-0">
                      <span className="block text-xs text-slate-500">Joined On</span>
                      <strong className="block break-words text-[13px] text-slate-900">
                        {formatJoiningDate(profile.dateOfJoining)}
                      </strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-[24px_minmax(0,1fr)] items-start gap-2 text-slate-700">
                    <BuildOutlined className="mt-0.5 text-base text-slate-900" />
                    <div className="min-w-0">
                      <span className="block text-xs text-slate-500">Designation</span>
                      <strong className="block break-words text-[13px] text-slate-900">
                        {primaryDesignation}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <main className="mt-3">
            {!isEditMode ? renderOverview() : renderEditForm()}
          </main>
        </Spin>
      </div>
    </UserPanelLayout>
  );
};

export default EmployeeProfilePage;
