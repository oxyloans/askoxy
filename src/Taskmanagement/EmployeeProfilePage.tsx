import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Avatar,
  Button,
  Col,
  DatePicker,
  Form,
  Grid,
  Image,
  Input,
  Row,
  Select,
  Spin,
  Tag,
  Tabs,
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
  IdcardOutlined,
  HomeOutlined,
  BookOutlined,
  FileProtectOutlined,
  LinkOutlined,
  BankOutlined,
  UploadOutlined,
  InfoCircleOutlined,
  ProfileOutlined,
  ReadOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
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

const WORKING_STATUS_OPTIONS = [
  { value: "FULLTIME", label: "Full Time" },
  { value: "PARTTIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "FREELANCER", label: "Freelancer" },
  { value: "INTERN", label: "Intern" },
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

interface EmployeeInfoResponse {
  aadharNumber?: string | null;
  aadharUrl?: string | null;
  bloodGroup?: string | null;
  contactNumber?: string | null;
  diploma?: string | null;
  email?: string | null;
  employeeIdNumber?: string | null;
  employeeWorkingStatus?: string | null;
  graduation?: string | null;
  graduationCollegeAddress?: string | null;
  graduationCollegeWebsiteUrl?: string | null;
  graduationCourse?: string | null;
  graduationPassOutYear?: string | null;
  homeAddress?: string | null;
  intermediate?: string | null;
  linkdinUrl?: string | null;
  panNumber?: string | null;
  panUrl?: string | null;
  ssc?: string | null;
  userId?: string | null;
}

const cleanText = (value: unknown) => String(value ?? "").trim();

const digits10 = (value: string) =>
  (value || "").replace(/\D/g, "").slice(0, 10);

const digits12 = (value: string) =>
  (value || "").replace(/\D/g, "").slice(0, 12);

const normalizePan = (value: string) =>
  cleanText(value).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);

const maskAadhar = (value?: string | null) => {
  const digits = digits12(value || "");
  return digits.length === 12 ? `XXXX XXXX ${digits.slice(-4)}` : cleanText(value) || "Not added";
};

const maskPan = (value?: string | null) => {
  const pan = normalizePan(value || "");
  return pan.length === 10 ? `${pan.slice(0, 2)}***${pan.slice(5, 9)}*` : cleanText(value) || "Not added";
};

const formatEnumLabel = (value?: string | null) => {
  const raw = cleanText(value);
  if (!raw) return "Not added";

  return raw
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const validExternalUrl = (value?: string | null) => {
  const url = cleanText(value);
  return /^https?:\/\//i.test(url) ? url : "";
};

const validateHttpsUrl = (_: unknown, value?: string) => {
  const url = cleanText(value);
  if (!url) return Promise.resolve();

  return /^https:\/\/\S+$/i.test(url)
    ? Promise.resolve()
    : Promise.reject(new Error("Only secure HTTPS URLs are allowed."));
};

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
  const documentFileInputRef = useRef<HTMLInputElement>(null);

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState<"aadhar" | "pan" | null>(null);
  const [documentUploadType, setDocumentUploadType] = useState<"aadhar" | "pan" | null>(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [hasSkillsProfileData, setHasSkillsProfileData] = useState(false);
  const [hasEmployeeInfoData, setHasEmployeeInfoData] = useState(false);
  const [mobErr, setMobErr] = useState("");
  const [profile, setProfile] = useState<EmployeeProfileResponse>({});
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfoResponse>({});
  const [activeSection, setActiveSection] = useState("about");

  const hasProfileData = hasSkillsProfileData || hasEmployeeInfoData;

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

  const watchedAadharUrl = Form.useWatch("aadharUrl", form) as
    | string
    | undefined;

  const watchedPanUrl = Form.useWatch("panUrl", form) as
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

      setHasSkillsProfileData(hasData);

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

      if (!preserveEditMode) setIsEditMode(true);
      return hasData;
    } catch (error) {
      console.error("Failed to load employee profile:", error);

      if (!preserveEditMode) {
        setHasSkillsProfileData(false);
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

  const getEmployeeInfo = async () => {
    if (!userId) {
      setHasEmployeeInfoData(false);
      return false;
    }

    try {
      const response = await employeeApi.get(
        `${BASE_URL}/user-service/write/employee-info/${userId}`,
      );

      const data: EmployeeInfoResponse = response.data?.data || response.data || {};
      setEmployeeInfo(data);

      const hasData = Boolean(
        cleanText(data.employeeIdNumber) ||
        cleanText(data.employeeWorkingStatus) ||
        cleanText(data.contactNumber) ||
        cleanText(data.email) ||
        cleanText(data.bloodGroup) ||
        cleanText(data.homeAddress) ||
        cleanText(data.linkdinUrl) ||
        cleanText(data.ssc) ||
        cleanText(data.intermediate) ||
        cleanText(data.diploma) ||
        cleanText(data.graduation) ||
        cleanText(data.graduationCourse) ||
        cleanText(data.graduationPassOutYear) ||
        cleanText(data.graduationCollegeAddress) ||
        cleanText(data.graduationCollegeWebsiteUrl) ||
        cleanText(data.aadharNumber) ||
        cleanText(data.aadharUrl) ||
        cleanText(data.panNumber) ||
        cleanText(data.panUrl),
      );

      setHasEmployeeInfoData(hasData);

      const currentMobile = digits10(form.getFieldValue("mobileNumber") || "");

      form.setFieldsValue({
        mobileNumber: currentMobile || digits10(data.contactNumber || ""),
        email: cleanText(data.email) || employeeEmail,
        employeeIdNumber: cleanText(data.employeeIdNumber),
        employeeWorkingStatus: cleanText(data.employeeWorkingStatus),
        bloodGroup: cleanText(data.bloodGroup),
        homeAddress: cleanText(data.homeAddress),
        linkdinUrl: cleanText(data.linkdinUrl),
        ssc: cleanText(data.ssc),
        intermediate: cleanText(data.intermediate),
        diploma: cleanText(data.diploma),
        graduation: cleanText(data.graduation),
        graduationCourse: cleanText(data.graduationCourse),
        graduationPassOutYear: cleanText(data.graduationPassOutYear),
        graduationCollegeAddress: cleanText(data.graduationCollegeAddress),
        graduationCollegeWebsiteUrl: cleanText(data.graduationCollegeWebsiteUrl),
        aadharNumber: digits12(data.aadharNumber || ""),
        aadharUrl: cleanText(data.aadharUrl),
        panNumber: normalizePan(data.panNumber || ""),
        panUrl: cleanText(data.panUrl),
      });

      return hasData;
    } catch (error: any) {
      if (error?.response?.status !== 404) {
        console.error("Failed to load employee information:", error);
      }

      setEmployeeInfo({});
      setHasEmployeeInfoData(false);
      form.setFieldsValue({
        email: employeeEmail,
      });
      return false;
    }
  };

  const loadEmployeeProfile = async (options?: {
    silentLoading?: boolean;
    preserveEditMode?: boolean;
  }) => {
    const silentLoading = Boolean(options?.silentLoading);
    const preserveEditMode = Boolean(options?.preserveEditMode);

    if (!silentLoading) setPageLoading(true);

    try {
      const skillsHasData = await getEmployeeSkills({
        silentLoading: true,
        preserveEditMode: true,
      });
      const employeeHasData = await getEmployeeInfo();
      const hasAnyData = Boolean(skillsHasData || employeeHasData);

      if (!preserveEditMode) setIsEditMode(true);
      return hasAnyData;
    } finally {
      if (!silentLoading) setPageLoading(false);
    }
  };

  useEffect(() => {
    loadEmployeeProfile();
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

      await loadEmployeeProfile({
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

  const openDocumentPicker = (type: "aadhar" | "pan") => {
    setDocumentUploadType(type);
    documentFileInputRef.current?.click();
  };

  const handleDocumentUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    const fileType = documentUploadType;
    if (!file || !fileType) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      await Swal.fire({
        icon: "warning",
        title: "Unsupported document",
        text: "Please upload a PDF, JPG, JPEG, PNG, or WebP document.",
        confirmButtonColor: PRIMARY,
      });
      return;
    }

    if (file.size <= 0 || file.size > 10 * 1024 * 1024) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid document",
        text: "Please upload a valid document smaller than 10 MB.",
        confirmButtonColor: PRIMARY,
      });
      return;
    }

    if (!userId) {
      await Swal.fire({
        icon: "error",
        title: "User not found",
        text: "Please log in again before uploading a document.",
        confirmButtonColor: PRIMARY,
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setUploadingDocument(fileType);

    try {
      const response = await employeeApi.patch(
        `${BASE_URL}/user-service/write/profileUpload`,
        formData,
        {
          params: {
            fileType,
            id: userId,
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const uploadedUrl = extractUploadedUrl(response.data);
      const fieldName = fileType === "aadhar" ? "aadharUrl" : "panUrl";

      if (uploadedUrl && /^https?:\/\//i.test(uploadedUrl)) {
        form.setFieldsValue({ [fieldName]: uploadedUrl });
        setEmployeeInfo((prev) => ({ ...prev, [fieldName]: uploadedUrl }));
      }

      // Immediately fetch latest employee info so uploaded document (S3 URL) is loaded and displayed directly
      await getEmployeeInfo();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to upload the document.";

      await Swal.fire({
        icon: "error",
        title: "Upload failed",
        text: message,
        confirmButtonColor: PRIMARY,
      });
    } finally {
      setUploadingDocument(null);
      setDocumentUploadType(null);
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

    const employeeInfoPayload = {
      aadharNumber: digits12(values.aadharNumber || ""),
      aadharUrl: cleanText(values.aadharUrl),
      bloodGroup: cleanText(values.bloodGroup),
      contactNumber: mobile,
      diploma: cleanText(values.diploma),
      email: cleanText(values.email) || employeeEmail,
      employeeIdNumber: cleanText(values.employeeIdNumber),
      employeeWorkingStatus: cleanText(values.employeeWorkingStatus).toUpperCase(),
      graduation: cleanText(values.graduation),
      graduationCollegeAddress: cleanText(values.graduationCollegeAddress),
      graduationCollegeWebsiteUrl: cleanText(values.graduationCollegeWebsiteUrl),
      graduationCourse: cleanText(values.graduationCourse),
      graduationPassOutYear: cleanText(values.graduationPassOutYear),
      homeAddress: cleanText(values.homeAddress),
      intermediate: cleanText(values.intermediate),
      linkdinUrl: cleanText(values.linkdinUrl),
      panNumber: normalizePan(values.panNumber || ""),
      panUrl: cleanText(values.panUrl),
      ssc: cleanText(values.ssc),
      userId,
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

      // New employee information API. This is intentionally added alongside
      // the existing skills and mobile APIs; nothing above is removed.
      await employeeApi.post(
        `${BASE_URL}/user-service/write/employeeInfo`,
        employeeInfoPayload,
      );

      sessionStorage.setItem("mobileNumber", mobile);

      setIsEditMode(true);
      setHasSkillsProfileData(true);
      setHasEmployeeInfoData(true);

      // Silently refresh profile data before closing loading state
      await loadEmployeeProfile({
        silentLoading: true,
        preserveEditMode: true,
      });

      setSaving(false);

      await Swal.fire({
        icon: "success",
        title: "Profile updated",
        text: "Your employee profile has been updated successfully.",
        confirmButtonColor: PRIMARY,
      });
    } catch (error: any) {
      setSaving(false);
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
    setIsEditMode(true);
    await loadEmployeeProfile({
      silentLoading: true,
      preserveEditMode: true,
    });

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
    digits10(
      form.getFieldValue("mobileNumber") ||
      profile.empNumber ||
      employeeInfo.contactNumber ||
      "",
    );

  const displayEmail =
    cleanText(form.getFieldValue("email")) ||
    cleanText(employeeInfo.email) ||
    employeeEmail;

  const documentAadharUrl =
    validExternalUrl(watchedAadharUrl) ||
    validExternalUrl(form.getFieldValue("aadharUrl")) ||
    validExternalUrl(employeeInfo.aadharUrl);

  const documentPanUrl =
    validExternalUrl(watchedPanUrl) ||
    validExternalUrl(form.getFieldValue("panUrl")) ||
    validExternalUrl(employeeInfo.panUrl);

  const linkedInUrl = validExternalUrl(employeeInfo.linkdinUrl);
  const collegeWebsiteUrl = validExternalUrl(employeeInfo.graduationCollegeWebsiteUrl);

  const toolChipData = [
    {
      title: "High Usage",
      level: "high",
      value:
        cleanText(aiToolsHigh) ||
        parseToolUsage(profile.toolUsage).high,
      chipClass:
        "inline-flex rounded-sm border border-green-200 bg-white px-2.5 py-1 text-xs font-semibold text-green-800",
      titleClass: "text-green-700",
    },
    {
      title: "Moderate Usage",
      level: "moderate",
      value:
        cleanText(aiToolsModerate) ||
        parseToolUsage(profile.toolUsage).moderate,
      chipClass:
        "inline-flex rounded-sm border border-orange-200 bg-white px-2.5 py-1 text-xs font-semibold text-orange-700",
      titleClass: "text-orange-700",
    },
    {
      title: "Low Usage",
      level: "low",
      value:
        cleanText(aiToolsLow) ||
        parseToolUsage(profile.toolUsage).low,
      chipClass:
        "inline-flex rounded-sm border border-blue-200 bg-white px-2.5 py-1 text-xs font-semibold text-sky-800",
      titleClass: "text-sky-700",
    },
  ];

  const fieldDisabled = saving || pageLoading;

  const fieldClass =
    "!rounded-md !border-slate-300 !bg-white hover:!border-slate-400 focus:!border-[#008cba] focus:!shadow-[0_0_0_2px_rgba(0,140,186,0.08)]";

  const selectClass =
    "w-full [&_.ant-select-selector]:!min-h-[40px] [&_.ant-select-selector]:!rounded-md [&_.ant-select-selector]:!border-slate-300 [&_.ant-select-selector]:!bg-white [&_.ant-select-selector]:!shadow-none hover:[&_.ant-select-selector]:!border-slate-400 [&.ant-select-focused_.ant-select-selector]:!border-[#008cba] [&.ant-select-focused_.ant-select-selector]:!shadow-[0_0_0_2px_rgba(0,140,186,0.08)]";

  const sectionClass =
    "mb-3 rounded-sm border border-slate-200 bg-white p-4 sm:p-5";

  const sectionHeadingClass =
    "mb-4 border-b border-slate-100 pb-3";

  const renderProfileContent = () => (
    <div className="overflow-hidden rounded-md bg-white p-4  border border-slate-200 shadow-md">
      <Spin spinning={saving} tip="Updating profile...">
        <Form
          form={form}
          layout="vertical"
          size="large"
          requiredMark
          validateTrigger={["onChange", "onBlur"]}
          scrollToFirstError={{ behavior: "smooth", block: "center" }}
          className="[&_.ant-form-item]:!mb-4 [&_.ant-form-item-label]:!pb-1.5 [&_.ant-form-item-label>label]:!h-auto [&_.ant-form-item-label>label]:!text-xs sm:[&_.ant-form-item-label>label]:!text-[13px] [&_.ant-form-item-label>label]:!font-semibold [&_.ant-form-item-label>label]:!text-slate-700 [&_.ant-form-item-explain-error]:!mt-1 [&_.ant-form-item-explain-error]:!text-xs [&_.ant-input]:!rounded-md [&_.ant-input-affix-wrapper]:!rounded-md [&_.ant-picker]:!rounded-md"
        >
          {mobErr && (
            <div className="px-3 pt-3 sm:px-5 sm:pt-5">
              <Alert type="error" showIcon message={mobErr} className="!rounded-sm" />
            </div>
          )}

          <Tabs
            activeKey={activeSection}
            onChange={setActiveSection}
            className="[&_.ant-tabs-nav]:!mb-0 [&_.ant-tabs-nav]:!border-none [&_.ant-tabs-nav::before]:!border-none [&_.ant-tabs-nav::before]:!hidden [&_.ant-tabs-nav]:!px-2 sm:[&_.ant-tabs-nav]:!px-4 [&_.ant-tabs-nav-wrap]:overflow-x-auto [&_.ant-tabs-tab]:!border-0 [&_.ant-tabs-tab]:!border-none [&_.ant-tabs-tab]:!shadow-none [&_.ant-tabs-tab]:!outline-none [&_.ant-tabs-tab:focus]:!outline-none [&_.ant-tabs-tab:focus-visible]:!outline-none [&_.ant-tabs-tab:focus]:!shadow-none [&_.ant-tabs-tab-btn]:!border-0 [&_.ant-tabs-tab-btn]:!border-none [&_.ant-tabs-tab-btn]:!shadow-none [&_.ant-tabs-tab-btn]:!outline-none [&_.ant-tabs-tab-btn:focus]:!outline-none [&_.ant-tabs-tab-btn:focus-visible]:!outline-none [&_.ant-tabs-tab-btn:focus]:!shadow-none [&_.ant-tabs-tab-active]:!border-0 [&_.ant-tabs-tab-active]:!border-none [&_.ant-tabs-tab-active]:!shadow-none [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!outline-none [&_.ant-tabs-tab]:!px-2 sm:[&_.ant-tabs-tab]:!px-3 [&_.ant-tabs-tab]:!py-3.5 [&_.ant-tabs-tab-btn]:!font-semibold [&_.ant-tabs-ink-bar]:!bg-[#008cba] [&_.ant-tabs-content-holder]:!border-0 [&_.ant-tabs-content-holder]:!border-none [&_.ant-tabs-content]:!border-0 [&_.ant-tabs-content]:!border-none"
            items={[
              {
                key: "about",
                label: (
                  <span className="inline-flex items-center gap-2 whitespace-nowrap">
                    <ProfileOutlined />
                    About
                  </span>
                ),
                children: (
                  <div className="bg-white p-3 sm:p-5">
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                      {/* Left Side: Read-only Profile Information */}
                      <div className="space-y-4 lg:col-span-7 xl:col-span-8">
                        <section className="rounded-sm border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
                          <div className="mb-3.5 flex items-center justify-between border-b border-slate-200 pb-3">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                              <ProfileOutlined className="text-[#008cba]" />
                              <span>Basic Information</span>
                            </div>
                            <Tag
                              color={cleanText(employeeInfo.employeeWorkingStatus) ? "blue" : "default"}
                              className="!m-0 !rounded-sm !px-2.5 !font-semibold"
                            >
                              {formatEnumLabel(employeeInfo.employeeWorkingStatus)}
                            </Tag>
                          </div>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {[
                              ["Employee Name", employeeName],
                              ["Employee ID", cleanText(employeeInfo.employeeIdNumber) || "Not added"],
                              ["Designation", primaryDesignation],
                              ["Official Email", displayEmail || "Not added"],
                              ["Mobile Number", mobileNumber ? `+91 ${mobileNumber}` : "Not added"],
                              ["Date of Joining", formatJoiningDate(profile.dateOfJoining)],
                              ["Work Location", location],
                              ["Blood Group", cleanText(employeeInfo.bloodGroup) || "Not added"],
                            ].map(([label, value]) => (
                              <div key={label} className="min-w-0 rounded-sm border border-slate-200/80 bg-white px-3.5 py-2.5">
                                <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-slate-400">
                                  {label}
                                </div>
                                <div className="mt-1 break-words text-sm font-semibold text-slate-800">
                                  {value}
                                </div>
                              </div>
                            ))}
                          </div>

                          {aboutMe && (
                            <div className="mt-3.5 rounded-sm border border-slate-200/80 bg-white px-3.5 py-2.5">
                              <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-slate-400">
                                Professional Summary / About
                              </div>
                              <p className="mb-0 mt-1 text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                                {aboutMe}
                              </p>
                            </div>
                          )}

                          {cleanText(employeeInfo.homeAddress) && (
                            <div className="mt-3 rounded-sm border border-slate-200/80 bg-white px-3.5 py-2.5">
                              <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-slate-400">
                                Home Address
                              </div>
                              <div className="mt-1 break-words text-sm font-medium leading-6 text-slate-700">
                                {cleanText(employeeInfo.homeAddress)}
                              </div>
                            </div>
                          )}

                          {linkedInUrl && (
                            <a
                              href={linkedInUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-3.5 inline-flex items-center gap-2 text-sm font-bold text-[#008cba] hover:underline"
                            >
                              <LinkOutlined />
                              View LinkedIn Profile
                            </a>
                          )}
                        </section>
                      </div>

                      {/* Right Side: Section Navigation Cards with Edit Buttons */}
                      <div className="space-y-3 lg:col-span-5 xl:col-span-4">
                        <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#008cba]/50 hover:shadow">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-sky-50 text-[#008cba]">
                                <IdcardOutlined className="text-lg" />
                              </div>
                              <div>
                                <h4 className="m-0 text-sm font-bold text-slate-900">Personal &amp; Employment</h4>
                                <p className="m-0 text-xs text-slate-500">Contact, designation &amp; status</p>
                              </div>
                            </div>
                            <Button
                              type="primary"
                              ghost
                              size="small"
                              icon={<EditOutlined />}
                              onClick={() => setActiveSection("personal")}
                              className="!rounded-sm !border-[#008cba] !font-semibold !text-[#008cba] hover:!bg-sky-50"
                            >
                              Edit
                            </Button>
                          </div>
                        </div>

                        <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#008cba]/50 hover:shadow">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-indigo-50 text-indigo-600">
                                <ReadOutlined className="text-lg" />
                              </div>
                              <div>
                                <h4 className="m-0 text-sm font-bold text-slate-900">Education Details</h4>
                                <p className="m-0 text-xs text-slate-500">Degree, college &amp; passout</p>
                              </div>
                            </div>
                            <Button
                              type="primary"
                              ghost
                              size="small"
                              icon={<EditOutlined />}
                              onClick={() => setActiveSection("education")}
                              className="!rounded-sm !border-[#008cba] !font-semibold !text-[#008cba] hover:!bg-sky-50"
                            >
                              Edit
                            </Button>
                          </div>
                        </div>

                        <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#008cba]/50 hover:shadow">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-emerald-50 text-emerald-600">
                                <SafetyCertificateOutlined className="text-lg" />
                              </div>
                              <div>
                                <h4 className="m-0 text-sm font-bold text-slate-900">Identity &amp; Documents</h4>
                                <p className="m-0 text-xs text-slate-500">Aadhaar, PAN &amp; verification files</p>
                              </div>
                            </div>
                            <Button
                              type="primary"
                              ghost
                              size="small"
                              icon={<EditOutlined />}
                              onClick={() => setActiveSection("documents")}
                              className="!rounded-sm !border-[#008cba] !font-semibold !text-[#008cba] hover:!bg-sky-50"
                            >
                              Edit
                            </Button>
                          </div>
                        </div>

                        <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#008cba]/50 hover:shadow">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-purple-50 text-purple-600">
                                <ThunderboltOutlined className="text-lg" />
                              </div>
                              <div>
                                <h4 className="m-0 text-sm font-bold text-slate-900">Skills &amp; AI Tools</h4>
                                <p className="m-0 text-xs text-slate-500">Platforms, tech stack &amp; AI tools</p>
                              </div>
                            </div>
                            <Button
                              type="primary"
                              ghost
                              size="small"
                              icon={<EditOutlined />}
                              onClick={() => setActiveSection("skills")}
                              className="!rounded-sm !border-[#008cba] !font-semibold !text-[#008cba] hover:!bg-sky-50"
                            >
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                key: "personal",
                forceRender: true,
                label: (
                  <span className="inline-flex items-center gap-2 whitespace-nowrap">
                    <IdcardOutlined />
                    Personal &amp; Employment
                  </span>
                ),
                children: (
                  <div className="grid gap-4 bg-white p-3 sm:p-5">
                    <section className={`${sectionClass} !mb-0`} aria-labelledby="personal-information-title">
                      <div className={sectionHeadingClass}>
                        <div id="personal-information-title" className="flex items-center gap-2 text-sm font-bold text-slate-900">
                          <IdcardOutlined className="text-[#008cba]" />
                          <span>Personal Information</span>
                        </div>
                      </div>

                      <Row gutter={[16, 0]}>
                        <Col xs={24} sm={12} xl={8} xxl={8}>
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
                              size="large"
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

                        <Col xs={24} sm={12} xl={8} xxl={8}>
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
                              size="large"
                              prefix={<EnvironmentOutlined className="text-slate-400" />}
                              autoComplete="organization-locality"
                              disabled={fieldDisabled}
                              placeholder="e.g. Hyderabad, Telangana"
                              className={fieldClass}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8} xxl={8}>
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
                              size="large"
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
                              className={`w-full ${fieldClass}`}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8} xxl={8}>
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
                              size="large"
                              prefix={<BuildOutlined className="text-slate-400" />}
                              disabled={fieldDisabled}
                              placeholder="React, TypeScript, Git, Ant Design..."
                              className={fieldClass}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} xl={24} xxl={24}>
                          <Form.Item
                            label="Professional Summary"
                            name="aboutMe"
                            rules={[
                              { required: true, message: "Professional summary is required." },
                              { whitespace: true, message: "Professional summary cannot be blank." },
                              { min: 20, message: "Please enter at least 20 characters." },
                              { max: 450, message: "Professional summary cannot exceed 450 characters." },
                            ]}
                          >
                            <Input.TextArea
                              autoSize={{ minRows: 4, maxRows: 7 }}
                              maxLength={450}
                              showCount
                              disabled={fieldDisabled}
                              placeholder="Briefly describe your experience, responsibilities, strengths, and current focus..."
                              className={`${fieldClass} !leading-6`}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </section>

                    <section className={`${sectionClass} !mb-0`} aria-labelledby="employment-details-title">
                      <div className={sectionHeadingClass}>
                        <div id="employment-details-title" className="flex items-center gap-2 text-sm font-bold text-slate-900">
                          <IdcardOutlined className="text-[#008cba]" />
                          <span>Employment Details</span>
                        </div>
                      </div>

                      <Row gutter={[16, 0]}>
                        <Col xs={24} sm={12} xl={8} xxl={8}>
                          <Form.Item
                            label="Employee ID Number"
                            name="employeeIdNumber"
                            rules={[
                              { required: true, message: "Employee ID number is required." },
                              { whitespace: true, message: "Employee ID number cannot be blank." },
                              { max: 50, message: "Employee ID number cannot exceed 50 characters." },
                            ]}
                          >
                            <Input
                              disabled={fieldDisabled}
                              prefix={<IdcardOutlined className="text-slate-400" />}
                              placeholder="e.g. OXY-EMP-1024"
                              className={fieldClass}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8} xxl={8}>
                          <Form.Item
                            label="Employee Working Status"
                            name="employeeWorkingStatus"
                            rules={[
                              { required: true, message: "Employee working status is required." },
                            ]}
                          >
                            <Select
                              size="large"
                              allowClear
                              disabled={fieldDisabled}
                              placeholder="Select working status"
                              className={selectClass}
                              options={WORKING_STATUS_OPTIONS}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8} xxl={8}>
                          <Form.Item
                            label="Official / Contact Email"
                            name="email"
                            rules={[
                              { required: true, message: "Email is required." },
                              { type: "email", message: "Enter a valid email address." },
                            ]}
                          >
                            <Input
                              disabled={fieldDisabled}
                              prefix={<MailOutlined className="text-slate-400" />}
                              placeholder="name@company.com"
                              className={fieldClass}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8} xxl={8}>
                          <Form.Item
                            label="Blood Group"
                            name="bloodGroup"
                            rules={[
                              { max: 10, message: "Blood group cannot exceed 10 characters." },
                              { pattern: /^(A|B|AB|O)[+-]$/i, message: "Enter a valid blood group (e.g. A+, B+, O+, AB+, O-)." },
                            ]}
                          >
                            <Input
                              disabled={fieldDisabled}
                              placeholder="e.g. O+, A+, B+"
                              className={fieldClass}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8} xxl={8}>
                          <Form.Item
                            label="Home Address"
                            name="homeAddress"
                            rules={[{ max: 300, message: "Home address cannot exceed 300 characters." }]}
                          >
                            <Input.TextArea
                              size="large"
                              autoSize={{ minRows: 2, maxRows: 4 }}
                              disabled={fieldDisabled}
                              placeholder="Current residential address"
                              className={`${fieldClass} !leading-6`}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8} xxl={8}>
                          <Form.Item
                            label="LinkedIn Profile URL"
                            name="linkdinUrl"
                            rules={[{ validator: validateHttpsUrl }]}
                          >
                            <Input
                              disabled={fieldDisabled}
                              prefix={<LinkOutlined className="text-slate-400" />}
                              placeholder="https://linkedin.com/in/username"
                              className={fieldClass}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </section>
                  </div>
                ),
              },
              {
                key: "education",
                forceRender: true,
                label: (
                  <span className="inline-flex items-center gap-2 whitespace-nowrap">
                    <ReadOutlined />
                    Education Details
                  </span>
                ),
                children: (
                  <div className="bg-white p-3 sm:p-5">
                    <section className={`${sectionClass} !mb-0`} aria-labelledby="education-details-title">
                      <div className={sectionHeadingClass}>
                        <div id="education-details-title" className="flex items-center gap-2 text-sm font-bold text-slate-900">
                          <ReadOutlined className="text-[#008cba]" />
                          <span>Education Details</span>
                        </div>
                      </div>

                      <Row gutter={[16, 0]}>
                        <Col xs={24} sm={12} xl={8} xxl={8}>
                          <Form.Item
                            label="10th / SSC Education Details"
                            name="ssc"
                            rules={[
                              {
                                max: 150,
                                message: "10th / SSC details cannot exceed 150 characters.",
                              },
                            ]}
                          >
                            <Input
                              disabled={fieldDisabled}
                              placeholder="Enter school name, board and year of completion"
                              className={fieldClass}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8} xxl={8}>
                          <Form.Item
                            label="12th / Intermediate Education Details"
                            name="intermediate"
                            rules={[
                              {
                                max: 150,
                                message: "12th / Intermediate details cannot exceed 150 characters.",
                              },
                            ]}
                          >
                            <Input
                              disabled={fieldDisabled}
                              placeholder="Enter college name, board/group and year of completion"
                              className={fieldClass}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8} xxl={8}>
                          <Form.Item
                            label="Diploma Details"
                            name="diploma"
                            rules={[
                              {
                                max: 150,
                                message: "Diploma details cannot exceed 150 characters.",
                              },
                            ]}
                          >
                            <Input
                              disabled={fieldDisabled}
                              placeholder="Enter diploma course, institute and completion year"
                              className={fieldClass}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8} xxl={8}>
                          <Form.Item
                            label="Graduation Degree"
                            name="graduation"
                            rules={[
                              {
                                max: 150,
                                message: "Graduation degree cannot exceed 150 characters.",
                              },
                            ]}
                          >
                            <Input
                              disabled={fieldDisabled}
                              placeholder="Enter your degree, e.g. B.Tech, B.Com, B.Sc"
                              className={fieldClass}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8} xxl={8}>
                          <Form.Item
                            label="Graduation Specialization"
                            name="graduationCourse"
                            rules={[
                              {
                                max: 100,
                                message: "Graduation specialization cannot exceed 100 characters.",
                              },
                            ]}
                          >
                            <Input
                              disabled={fieldDisabled}
                              placeholder="Enter specialization, e.g. Computer Science"
                              className={fieldClass}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8} xxl={8}>
                          <Form.Item
                            label="Graduation Completion Year"
                            name="graduationPassOutYear"
                            rules={[
                              {
                                pattern: /^(19|20)\d{2}$/,
                                message: "Enter a valid 4-digit year, e.g. 2024.",
                              },
                            ]}
                          >
                            <Input
                              disabled={fieldDisabled}
                              inputMode="numeric"
                              maxLength={4}
                              placeholder="Enter completion year, e.g. 2024"
                              className={fieldClass}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8} xxl={8}>
                          <Form.Item
                            label="College / University Address"
                            name="graduationCollegeAddress"
                            rules={[
                              {
                                max: 300,
                                message: "College / university address cannot exceed 300 characters.",
                              },
                            ]}
                          >
                            <Input.TextArea
                              size="large"
                              autoSize={{ minRows: 2, maxRows: 4 }}
                              disabled={fieldDisabled}
                              placeholder="Enter college / university name and complete address"
                              className={`${fieldClass} !leading-6`}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8} xxl={8}>
                          <Form.Item
                            label="College / University Website"
                            name="graduationCollegeWebsiteUrl"
                            rules={[{ validator: validateHttpsUrl }]}
                          >
                            <Input
                              disabled={fieldDisabled}
                              prefix={<LinkOutlined className="text-slate-400" />}
                              placeholder="Enter official website, e.g. https://www.college.edu"
                              className={fieldClass}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </section>
                  </div>
                ),
              },
              {
                key: "documents",
                forceRender: true,
                label: (
                  <span className="inline-flex items-center gap-2 whitespace-nowrap">
                    <SafetyCertificateOutlined />
                    Identity &amp; Documents
                  </span>
                ),
                children: (
                  <div className="bg-white p-3 sm:p-5">
                    <section className={`${sectionClass} !mb-0`} aria-labelledby="identity-documents-title">
                      <div className={sectionHeadingClass}>
                        <div id="identity-documents-title" className="flex items-center gap-2 text-sm font-bold text-slate-900">
                          <SafetyCertificateOutlined className="text-[#008cba]" />
                          <span>Identity &amp; Documents</span>
                        </div>
                      </div>

                      <Row gutter={[16, 0]}>
                        <Col xs={24} sm={12} xl={8} xxl={8}>
                          <Form.Item
                            label="Aadhaar Number"
                            name="aadharNumber"
                            rules={[
                              { pattern: /^\d{12}$/, message: "Enter a valid 12-digit Aadhaar number." },
                              {
                                validator: (_, value) =>
                                  /^(\d)\1{11}$/.test(String(value || ""))
                                    ? Promise.reject(new Error("Aadhaar number cannot contain the same digit repeatedly."))
                                    : Promise.resolve(),
                              },
                            ]}
                          >
                            <Input
                              disabled={fieldDisabled}
                              maxLength={12}
                              inputMode="numeric"
                              placeholder="12-digit Aadhaar number"
                              className={fieldClass}
                              onChange={(event) => form.setFieldsValue({ aadharNumber: digits12(event.target.value) })}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8} xxl={8}>
                          <Form.Item
                            label="Aadhaar Document Upload"
                            className="!mb-4"
                          >
                            <Form.Item name="aadharUrl" hidden>
                              <Input />
                            </Form.Item>
                            {!documentAadharUrl ? (
                              <Button
                                size="large"
                                icon={<UploadOutlined />}
                                loading={uploadingDocument === "aadhar"}
                                disabled={fieldDisabled || Boolean(uploadingDocument)}
                                onClick={() => openDocumentPicker("aadhar")}
                                className="flex h-10 w-full items-center justify-center gap-2 !rounded-md !border-dashed !border-slate-300 !bg-slate-50/50 !font-semibold !text-[#008cba] hover:!border-[#008cba] hover:!bg-sky-50"
                              >
                                Upload Aadhaar
                              </Button>
                            ) : (
                              <div className="flex h-10 items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50/80 px-2.5 py-1">
                                <div className="flex min-w-0 items-center gap-2.5">
                                  <Image
                                    src={documentAadharUrl}
                                    alt="Aadhaar Document Preview"
                                    width={44}
                                    height={30}
                                    className="!rounded-sm !object-cover border border-slate-200 bg-white"
                                    fallback="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='44' height='30' viewBox='0 0 44 30'><rect width='44' height='30' fill='%23f1f5f9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='9' font-family='sans-serif'>DOC</text></svg>"
                                  />
                                  <div className="min-w-0">
                                    <span className="block truncate text-xs font-semibold text-slate-800">Aadhaar Uploaded</span>
                                  </div>
                                </div>
                                <Button
                                  type="link"
                                  size="small"
                                  icon={<UploadOutlined />}
                                  loading={uploadingDocument === "aadhar"}
                                  disabled={fieldDisabled || Boolean(uploadingDocument)}
                                  onClick={() => openDocumentPicker("aadhar")}
                                  className="!h-auto !p-0 !text-xs !font-semibold !text-[#008cba] hover:!text-[#007da6]"
                                >
                                  Change
                                </Button>
                              </div>
                            )}
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8} xxl={8}>
                          <Form.Item
                            label="PAN Number"
                            name="panNumber"
                            rules={[{ pattern: /^[A-Z]{5}[0-9]{4}[A-Z]$/, message: "Enter a valid 10-character PAN number (e.g. ABCDE1234F)." }]}
                          >
                            <Input
                              disabled={fieldDisabled}
                              maxLength={10}
                              placeholder="ABCDE1234F"
                              className={fieldClass}
                              onChange={(event) => form.setFieldsValue({ panNumber: normalizePan(event.target.value) })}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} xl={8} xxl={8}>
                          <Form.Item
                            label="Pan Document Upload"
                            className="!mb-4"
                          >
                            <Form.Item name="panUrl" hidden>
                              <Input />
                            </Form.Item>
                            {!documentPanUrl ? (
                              <Button
                                size="large"
                                icon={<UploadOutlined />}
                                loading={uploadingDocument === "pan"}
                                disabled={fieldDisabled || Boolean(uploadingDocument)}
                                onClick={() => openDocumentPicker("pan")}
                                className="flex h-10 w-full items-center justify-center gap-2 !rounded-md !border-dashed !border-slate-300 !bg-slate-50/50 !font-semibold !text-[#008cba] hover:!border-[#008cba] hover:!bg-sky-50"
                              >
                                Upload Pan
                              </Button>
                            ) : (
                              <div className="flex h-10 items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50/80 px-2.5 py-1">
                                <div className="flex min-w-0 items-center gap-2.5">
                                  <Image
                                    src={documentPanUrl}
                                    alt="PAN Document Preview"
                                    width={44}
                                    height={30}
                                    className="!rounded-sm !object-cover border border-slate-200 bg-white"
                                    fallback="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='44' height='30' viewBox='0 0 44 30'><rect width='44' height='30' fill='%23f1f5f9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='9' font-family='sans-serif'>DOC</text></svg>"
                                  />
                                  <div className="min-w-0">
                                    <span className="block truncate text-xs font-semibold text-slate-800">PAN Uploaded</span>
                                  </div>
                                </div>
                                <Button
                                  type="link"
                                  size="small"
                                  icon={<UploadOutlined />}
                                  loading={uploadingDocument === "pan"}
                                  disabled={fieldDisabled || Boolean(uploadingDocument)}
                                  onClick={() => openDocumentPicker("pan")}
                                  className="!h-auto !p-0 !text-xs !font-semibold !text-[#008cba] hover:!text-[#007da6]"
                                >
                                  Change
                                </Button>
                              </div>
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <input
                        ref={documentFileInputRef}
                        type="file"
                        accept="application/pdf,image/jpeg,image/png,image/webp,.pdf,.jpg,.jpeg,.png,.webp"
                        style={{ display: "none" }}
                        onChange={handleDocumentUpload}
                      />
                    </section>
                  </div>
                ),
              },
              {
                key: "skills",
                forceRender: true,
                label: (
                  <span className="inline-flex items-center gap-2 whitespace-nowrap">
                    <ThunderboltOutlined />
                    Skills &amp; AI Tools
                  </span>
                ),
                children: (
                  <div className="grid gap-4 bg-white p-3 sm:p-5">
                    <section className={`${sectionClass} !mb-0`} aria-labelledby="work-information-title">
                      <div className={sectionHeadingClass}>
                        <div id="work-information-title" className="flex items-center gap-2 text-sm font-bold text-slate-900">
                          <ThunderboltOutlined className="text-[#008cba]" />
                          <span>Work &amp; Skills Information</span>
                        </div>
                      </div>

                      <Row gutter={[16, 0]}>
                        <Col xs={24} sm={12} xl={8} xxl={8}>
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
                              size="large"
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

                        <Col xs={24} sm={12} xl={8} xxl={8}>
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
                              size="large"
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

                    <section className={`${sectionClass} !mb-0`} aria-labelledby="ai-tools-title">
                      <div className={sectionHeadingClass}>
                        <div id="ai-tools-title" className="text-sm font-bold text-slate-900">
                          AI Tools &amp; Usage Levels
                        </div>
                      </div>

                      <Row gutter={[16, 0]}>
                        <Col xs={24} md={8} xxl={8}>
                          <Form.Item
                            label={<span className="font-semibold text-green-700">High Usage</span>}
                            name="aiToolsHigh"
                            rules={[{ max: 300, message: "High usage tools description cannot exceed 300 characters." }]}
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

                        <Col xs={24} md={8} xxl={8}>
                          <Form.Item
                            label={<span className="font-semibold text-orange-700">Moderate Usage</span>}
                            name="aiToolsModerate"
                            rules={[{ max: 300, message: "Moderate usage tools description cannot exceed 300 characters." }]}
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

                        <Col xs={24} md={8} xxl={8}>
                          <Form.Item
                            label={<span className="font-semibold text-sky-700">Low Usage</span>}
                            name="aiToolsLow"
                            rules={[{ max: 300, message: "Low usage tools description cannot exceed 300 characters." }]}
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
                  </div>
                ),
              },
            ]}
          />

          {activeSection !== "about" && (
            <div className="sticky bottom-0 z-20 flex justify-end gap-2 border-t border-slate-200 bg-white/95 px-3 py-3 backdrop-blur-sm sm:px-5">
              <Button
                type="primary"
                size="middle"
                loading={saving}
                onClick={handleSave}
                className="!h-9 !rounded-sm !border-[#008cba] !bg-[#008cba] !font-semibold hover:!border-[#007da6] hover:!bg-[#007da6] sm:!min-w-[140px]"
              >
                {hasProfileData ? "Save Changes" : "Save Profile"}
              </Button>
            </div>
          )}
        </Form>
      </Spin>
    </div>
  );

  return (
    <UserPanelLayout>
      <div className="mx-auto w-full max-w-7xl px-2 pb-8 pt-2 sm:px-3 sm:pt-3 lg:px-4">
        <Spin spinning={pageLoading} tip="Loading employee profile..." size="large">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Title level={isMobile ? 2 : 2} className="!m-0 !font-extrabold !tracking-tight !text-slate-950">
                Profile
              </Title>
            </div>
          </div>

          <section className="overflow-hidden rounded-md border border-slate-200 bg-white p-4 shadow-md sm:p-5 lg:p-6">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[auto_minmax(0,1fr)_minmax(250px,0.55fr)] lg:items-center">
              <div className="flex justify-center lg:justify-start">
                <div className="relative inline-flex">
                  <Avatar
                    size={isMobile ? 104 : 124}
                    src={profileImage || undefined}
                    icon={!profileImage ? <UserOutlined /> : undefined}
                    className="!border-4 !border-white !bg-blue-100 !text-[#008cba] !shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!canUploadImage}
                    aria-label="Upload profile image"
                    className="absolute -right-0.5 bottom-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#008cba] text-white shadow-md transition hover:bg-[#007da6] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {uploadingImage ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    ) : (
                      <CameraOutlined />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              <div className="min-w-0 text-center lg:text-left">
                <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                  <Title level={2} className="!m-0 !text-2xl !font-extrabold !text-slate-950 sm:!text-[28px]">
                    {employeeName}
                  </Title>
                </div>

                <div className="mt-1 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                  <Text className="!text-base !font-semibold !text-slate-700">{primaryDesignation}</Text>
                  {cleanText(employeeInfo.employeeIdNumber) && (
                    <span className="rounded-sm bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
                      {cleanText(employeeInfo.employeeIdNumber)}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-slate-600 lg:justify-start">
                  {displayEmail && (
                    <span className="inline-flex min-w-0 items-center gap-2 break-all">
                      <MailOutlined className="shrink-0 text-[#008cba]" />
                      {displayEmail}
                    </span>
                  )}
                  {mobileNumber && (
                    <span className="inline-flex items-center gap-2">
                      <PhoneOutlined className="text-[#008cba]" />
                      +91 {mobileNumber}
                    </span>
                  )}
                  <span className="inline-flex items-start gap-2">
                    <EnvironmentOutlined className="mt-0.5 shrink-0 text-[#008cba]" />
                    <span className="break-words">{location}</span>
                  </span>
                </div>

                {splitCommaValues(profile.skills).length > 0 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5 lg:justify-start">
                    {splitCommaValues(profile.skills).slice(0, 5).map((skill) => (
                      <span key={skill} className="rounded-sm border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-sky-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center pt-4 lg:items-start lg:pl-6 lg:pt-0">
                <div className="mb-3 w-full text-center lg:text-left">
                  <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-slate-400">Joined On</div>
                  <div className="mt-1 flex items-center justify-center gap-2 text-sm font-semibold text-slate-800 lg:justify-start">
                    <CalendarOutlined className="text-[#008cba]" />
                    {formatJoiningDate(profile.dateOfJoining)}
                  </div>
                </div>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setActiveSection("personal");
                  }}
                  disabled={pageLoading || saving}
                  className="!h-9 !w-auto !rounded-md !border-[#008cba] !bg-[#008cba] !px-4 !font-semibold hover:!border-[#007da6] hover:!bg-[#007da6]"
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </section>

          <main className="mt-4">
            {renderProfileContent()}
          </main>
        </Spin>
      </div>
    </UserPanelLayout>
  );
};

export default EmployeeProfilePage;
