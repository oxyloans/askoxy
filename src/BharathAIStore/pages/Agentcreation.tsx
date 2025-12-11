// src/BharathAIStore/pages/Agentcreation.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Drawer,
  Modal,
  Tooltip,
  message,
  Tag,
  Spin,
  notification,
  Button,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  BulbOutlined,
  UserOutlined,
  AimOutlined,
  RocketOutlined,
  GlobalOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import BASE_URL from "../../Config";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import VendorCreationModal from "../components/VendorCreationModal";
import SRJImage from "../../assets/img/SRJ1.jpg";
import CardBased from "../../assets/img/BS.jpg";

/* =========================================================
 * Theme (WHITE + subtle 3D) & Limits
 * ======================================================= */
const BORDER = "#E7E6F3";
const TEXT_MUTED = "#64748B";
const SOFT_PLACEHOLDER = "#94A3B8";

// Brighter, high-contrast gradients
const GRADIENTS = [
  "linear-gradient(135deg, #7C3AED 0%, #FF1CF7 55%, #FFA800 120%)", // purple → neon pink → amber
  "linear-gradient(135deg, #2563EB 0%, #341539 55%, #FF1CF7 120%)", // blue → cyan → green
  "linear-gradient(135deg, #FF1F6D 0%, #8B5CF6 55%, #22D3EE 120%)", // hot pink → violet → cyan
  "linear-gradient(135deg, #06B6D4 0%, #FF1CF7 55%, #6366F1 120%)", // teal → green → indigo
];

// Optional: vivid border glow for components
const BRIGHT_BORDER_GRAD =
  "linear-gradient(180deg, #FFFFFF, #FFFFFF) padding-box, linear-gradient(135deg, #7C3AED, #FF1CF7, #00E5FF) border-box";

type ViewType = "Public" | "Private";

// Role string is dynamic (e.g., "WorkingProfessional") — no enum
type AddFileType = string;

type ProfileErrors = { name?: string; email?: string };

interface Option {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

/* =========================================================
 * Small Utilities
 * ======================================================= */
const getCookie = (name: string) => {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : "";
};
const readToken = (): string | null => {
  const keys = [
    "token",
    "accessToken",
    "authToken",
    "jwt",
    "jwtToken",
    "bearerToken",
  ];
  for (const k of keys) {
    const v =
      localStorage.getItem(k) || sessionStorage.getItem(k) || getCookie(k);
    if (v) return v;
  }
  return null;
};
const getAuthHeader = (): HeadersInit => {
  const t = readToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

const cleanForTransport = (s: string) =>
  (s || "")
    .trim()
    .replace(/\u2014|\u2013/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, " ")
    .replace(/^"+|"+$|^'+|'+$/g, "")
    .slice(0, 7000);

const cleanInstructionText = (txt: string) =>
  (txt || "")
    .replace(/^\uFEFF/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/^#{1,6}\s?/gm, "")
    .replace(/\*+/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const parseStartersFromText = (raw: string) => {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-*•\d.)]+\s*/, "").trim())
    .filter(Boolean);
  const uniq: string[] = [];
  for (const l of lines) {
    if (uniq.length >= 8) break;
    if (!uniq.includes(l)) uniq.push(l);
  }
  return uniq.slice(0, 4);
};

function useDebounced<T>(value: T, delay = 600): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const CompactSelect: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder: string;
  loading?: boolean;
}> = ({ value, onChange, options, placeholder, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (!isOpen) return;
      const el = containerRef.current;
      if (el && !el.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("click", handleOutside);
    document.addEventListener("touchstart", handleOutside, { passive: true });
    return () => {
      document.removeEventListener("click", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        zIndex: isOpen ? 5000 : "auto",
      }}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: 14,
          border: "1.5px solid transparent",
          backgroundImage: `linear-gradient(#fff, #fff), linear-gradient(135deg, #7C3AED, #FF1CF7, #00E5FF)`,
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          textAlign: "left",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 15,
          color: value ? "#0F172A" : SOFT_PLACEHOLDER,
          boxShadow:
            "0 6px 16px rgba(124,58,237,0.18), 0 2px 8px rgba(2,8,23,0.06), inset 0 1px 0 rgba(255,255,255,0.5)",
          transition: "transform .08s ease, box-shadow .2s ease",
          willChange: "transform",
        }}
        onMouseDown={(e) =>
          (e.currentTarget.style.transform = "translateY(1px) scale(0.995)")
        }
        onMouseUp={(e) =>
          (e.currentTarget.style.transform = "translateY(0) scale(1)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "translateY(0) scale(1)")
        }
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            overflow: "hidden",
          }}
        >
          {loading ? <Spin size="small" /> : selectedOption?.icon}
          <span
            style={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <span
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            color: SOFT_PLACEHOLDER,
            fontSize: 12,
          }}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            background: "#fff",
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            boxShadow: "0 6px 14px rgba(2,8,23,0.08)", // softer and smaller shadow
            maxHeight: 260,
            overflowY: "auto",
            zIndex: 5001,
            minWidth: "100%",
            maxWidth: "min(360px, 92vw)",
          }}
        >
          {options.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={value === option.value}
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              style={{
                width: "100%",
                padding: "11px 14px",
                textAlign: "left",
                background:
                  value === option.value
                    ? "linear-gradient(90deg, #6D28D9, #A78BFA, #F59E0B)"
                    : "#fff",
                color: value === option.value ? "#fff" : "#111827",
                fontWeight: value === option.value ? 700 : 500,

                border: "none",
                borderBottom: `1px solid ${BORDER}`,
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ROLE_OPTS: Option[] = [
  { label: "Student", value: "Student", icon: <UserOutlined /> },
  { label: "Fresher", value: "Fresher", icon: <UserOutlined /> },
  { label: "Recruiter", value: "Recruiter", icon: <UserOutlined /> },
  { label: "Job Seeker", value: "JobSeeker", icon: <UserOutlined /> },
  {
    label: "Working Professional",
    value: "WorkingProfessional",
    icon: <UserOutlined />,
  },
  { label: "HR Recruiter", value: "HR Recruiter", icon: <UserOutlined /> },
  { label: "Hiring Manager", value: "Hiring Manager", icon: <UserOutlined /> },
  {
    label: "Experienced Person",
    value: "Experienced Person",
    icon: <UserOutlined />,
  },
  { label: "Job Consultant", value: "Job Consultant", icon: <UserOutlined /> },
  { label: "Team Leader", value: "Team Leader", icon: <UserOutlined /> },
  {
    label: "Project Manager",
    value: "Project Manager",
    icon: <UserOutlined />,
  },
  { label: "Career Coach", value: "Career Coach", icon: <UserOutlined /> },
  { label: "Intern", value: "Intern", icon: <UserOutlined /> },
  {
    label: "Founder / Startup",
    value: "FounderStartup",
    icon: <UserOutlined />,
  },
  { label: "CEO", value: "CEO", icon: <UserOutlined /> },
  { label: "Business Owner", value: "BusinessOwner", icon: <UserOutlined /> },
  { label: "Salesperson", value: "Salesperson", icon: <UserOutlined /> },
  { label: "Market", value: "Market", icon: <UserOutlined /> },
  { label: "Doctor", value: "Doctor", icon: <UserOutlined /> },
  {
    label: "Chartered Accountant",
    value: "CharteredAccountant",
    icon: <UserOutlined />,
  },
  {
    label: "Company Secretary",
    value: "CompanySecretary",
    icon: <UserOutlined />,
  },
  { label: "Lawyer", value: "Lawyer", icon: <UserOutlined /> },
  { label: "Real Estate", value: "RealEstate", icon: <UserOutlined /> },
  { label: "Consultant", value: "Consultant", icon: <UserOutlined /> },
  { label: "Developer", value: "Developer", icon: <UserOutlined /> },
  { label: "Tester", value: "Tester", icon: <UserOutlined /> },
  { label: "Manager", value: "Manager", icon: <UserOutlined /> },
  { label: "Customer", value: "Customer", icon: <UserOutlined /> },
  { label: "Other", value: "Other", icon: <UserOutlined /> },
];

const mergedSentence = (
  desc: string,
  role?: string,
  purpose?: string,
  goal?: string
) => {
  const base = cleanForTransport(desc);
  const tail = [
    role && `for ${role}`,
    purpose && `to ${purpose}`,
    goal && `aimed at ${goal}`,
  ]
    .filter(Boolean)
    .join(", ");
  return [base, tail && `— ${tail}.`].filter(Boolean).join(" ");
};

const card3D: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1.5px solid transparent",
  borderRadius: 16,
  boxShadow: "0 14px 40px rgba(2,8,23,0.10)",
  overflow: "visible",
  backgroundImage: BRIGHT_BORDER_GRAD, // ← adds neon ring
};

const sectionHeader = (i = 0): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "12px 14px",
  borderBottom: `1px solid ${BORDER}`,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  background: "linear-gradient(180deg, #FFFFFF 0%, #FBFBFF 100%)",
});

const headingText = (i = 0): React.CSSProperties => ({
  fontSize: 16,
  fontWeight: 900,
  margin: 0,
  letterSpacing: 0.2,
  backgroundImage: GRADIENTS[i % GRADIENTS.length],
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
});

const bodyPad: React.CSSProperties = { padding: 14 };

const Agentcreation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Core form (selects)
  // Core form (selects)
  const [roleSelect, setRoleSelect] = useState<string>("");
  const [goalSelect, setGoalSelect] = useState<string>("");
  const [purposeSelect, setPurposeSelect] = useState<string>("");

  // Dynamic options from backend
  const [goalOptions, setGoalOptions] = useState<Option[]>([]);
  const [purposeOptions, setPurposeOptions] = useState<Option[]>([]);

  const [goalLoading, setGoalLoading] = useState(false);
  const [purposeLoading, setPurposeLoading] = useState(false);

  // "Other" custom inputs
  const [roleOther, setRoleOther] = useState("");
  const [goalOther, setGoalOther] = useState("");
  const [purposeOther, setPurposeOther] = useState("");

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrolledOnceRef = useRef(false);
  // Business card upload states
  const [businessCardFile, setBusinessCardFile] = useState<File | null>(null);
  const [businessCardUploading, setBusinessCardUploading] = useState(false);
  const [businessCardPreview, setBusinessCardPreview] = useState<string>("");
  const [isBusinessCardUsed, setIsBusinessCardUsed] = useState(false);
  const [cardDataId, setCardDataId] = useState<string | null>(() =>
    localStorage.getItem("businessCardId")
  );

  // Resolved values (if "Other", use custom text)
  const roleResolved = roleSelect === "Other" ? roleOther.trim() : roleSelect;
  const goalResolved = goalSelect === "Other" ? goalOther.trim() : goalSelect;
  const purposeResolved =
    purposeSelect === "Other" ? purposeOther.trim() : purposeSelect;

  // 🔹 When Role changes → load GOALS for that Role (dynamic)
  useEffect(() => {
    const effectiveRole = (
      roleSelect === "Other" ? roleOther : roleSelect
    ).trim();

    if (!effectiveRole) {
      setGoalOptions([]);
      setGoalSelect("");
      setPurposeSelect("");
      setPurposeOptions([]);
      setGoalLoading(false);
      return;
    }

    let cancelled = false;

    const fetchGoals = async () => {
      try {
        setGoalLoading(true);
        setGoalSelect("");
        setPurposeSelect("");
        setPurposeOptions([]);

        const authHeaderObj = (getAuthHeader() || {}) as Record<string, string>;

        const res = await axios.post(
          `${BASE_URL}/ai-service/agent/getGoalsByRole`,
          {},
          {
            params: { role: effectiveRole },
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              ...authHeaderObj,
            },
          }
        );

        if (cancelled) return;

        const data = res.data;
        console.log("getGoalsByRole raw response:", data);

        let raw: string[] = [];

        if (Array.isArray(data)) {
          // Case 1: ["Learn","Study",...,"Other"]
          raw = data.filter((v) => typeof v === "string");
        } else if (typeof data === "string") {
          // Case 2: "Learn\nStudy\nRead\n... \nOther" OR "Learn,Study,Read,...,Other"
          raw = data
            .split(/[\n,]+/)
            .map((s) => s.trim())
            .filter(Boolean);
        } else if (data && typeof data === "object") {
          // Case 3: { data: ["Learn", ...] } or { goals: ["Learn", ...] } or similar
          const arr = Object.values(data).find((v) => Array.isArray(v)) as
            | any[]
            | undefined;
          if (Array.isArray(arr)) {
            raw = arr.filter((v) => typeof v === "string");
          }
        }

        const mapped: Option[] = raw.map((g) => ({
          label: g,
          value: g,
          icon: <AimOutlined />,
        }));

        if (!mapped.length) {
          setGoalOptions([]);
          return;
        }

        const hasOther = mapped.some(
          (opt) => opt.value.trim().toLowerCase() === "other"
        );
        const optionsWithOther = hasOther
          ? mapped
          : [
              ...mapped,
              { label: "Other", value: "Other", icon: <AimOutlined /> },
            ];

        setGoalOptions(optionsWithOther);
      } catch (e) {
        if (!cancelled) {
          console.error(e);
          message.error(
            "Unable to load goals for this role. Please try again."
          );
          setGoalOptions([]);
        }
      } finally {
        if (!cancelled) setGoalLoading(false);
      }
    };

    fetchGoals();

    return () => {
      cancelled = true;
    };
  }, [roleSelect, roleOther]);

  // 🔹 When Role + Goal selected → load PURPOSE list (dynamic)
  useEffect(() => {
    const effectiveRole = (
      roleSelect === "Other" ? roleOther : roleSelect
    ).trim();
    const effectiveGoal = (
      goalSelect === "Other" ? goalOther : goalSelect
    ).trim();

    if (!effectiveRole || !effectiveGoal) {
      setPurposeOptions([]);
      setPurposeSelect("");
      setPurposeLoading(false);
      return;
    }

    let cancelled = false;

    const fetchPurposes = async () => {
      try {
        setPurposeLoading(true);

        const authHeaderObj = (getAuthHeader() || {}) as Record<string, string>;

        const res = await axios.post(
          `${BASE_URL}/ai-service/agent/getPurposeByRoleAndGoals`,
          {},
          {
            params: { role: effectiveRole, goal: effectiveGoal },
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              ...authHeaderObj,
            },
          }
        );

        if (cancelled) return;

        const data = res.data;
        console.log("getPurposeByRoleAndGoals raw response:", data);

        let raw: string[] = [];

        if (Array.isArray(data)) {
          // Case 1: ["Learn","Study",...,"Other"]
          raw = data.filter((v) => typeof v === "string");
        } else if (typeof data === "string") {
          // Case 2: "Learn\nStudy\nRead\n... \nOther" OR "Learn,Study,Read,...,Other"
          raw = data
            .split(/[\n,]+/)
            .map((s) => s.trim())
            .filter(Boolean);
        } else if (data && typeof data === "object") {
          // Case 3: { data: ["Learn", ...] } or { purposes: ["Learn", ...] } etc.
          const arr = Object.values(data).find((v) => Array.isArray(v)) as
            | any[]
            | undefined;
          if (Array.isArray(arr)) {
            raw = arr.filter((v) => typeof v === "string");
          }
        }

        const mapped: Option[] = raw.map((p) => ({
          label: p,
          value: p,
          icon: <RocketOutlined />,
        }));

        if (!mapped.length) {
          setPurposeOptions([]);
          return;
        }

        const hasOther = mapped.some(
          (opt) => opt.value.trim().toLowerCase() === "other"
        );
        const optionsWithOther = hasOther
          ? mapped
          : [
              ...mapped,
              { label: "Other", value: "Other", icon: <RocketOutlined /> },
            ];

        setPurposeOptions(optionsWithOther);
      } catch (e) {
        if (!cancelled) {
          console.error(e);
          message.error(
            "Unable to load purposes for this Role & Goal. Please try again."
          );
          setPurposeOptions([]);
        }
      } finally {
        if (!cancelled) setPurposeLoading(false);
      }
    };

    fetchPurposes();

    return () => {
      cancelled = true;
    };
  }, [roleSelect, roleOther, goalSelect, goalOther]);

  // Debounced resolved values (prevents multi API calls while typing)
  const roleDeb = useDebounced(roleResolved, 700);
  const goalDeb = useDebounced(goalResolved, 700);
  const purposeDeb = useDebounced(purposeResolved, 700);
  const [activeTab, setActiveTab] = useState<
    "BusinessCard" | "IDCard" | "EmployeeCard" | "GovtID"
  >("BusinessCard");
  const [creationMode, setCreationMode] = useState<
    "Professional" | "CardBased" | null
  >(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("India");
  // Business card data modal states
  const [cardDataModalOpen, setCardDataModalOpen] = useState(false);
  const [cardData, setCardData] = useState<{
    fullName: string;
    jobTitle: string;
    companyName: string;
    email: string;
    mobileNumber: string;
    website: string;
    address: string;
    userId: string;
    id?: string;
  } | null>(null);
  const [isEditingCardData, setIsEditingCardData] = useState(false);
  const [cardDataForm, setCardDataForm] = useState({
    fullName: "",
    jobTitle: "",
    companyName: "",
    email: "",
    mobileNumber: "",
    website: "",
    address: "",
    userId: localStorage.getItem("userId") || "",
    id: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    companyName: "",
    mobileNumber: "",
    address: "",
  });

  const validateField = (fieldName: keyof typeof errors, value: string) => {
    if (!value || value.trim() === "") {
      const errorMessages = {
        fullName: "Full Name is required",
        companyName: "Company Name is required",
        mobileNumber: "Phone number is required",
        address: "Address is required",
      };
      return errorMessages[fieldName] || "";
    }
    return "";
  };

  const handleFieldChange = (
    fieldName: keyof typeof cardDataForm,
    value: string
  ) => {
    setCardDataForm((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear error when user starts typing (only for fields that have errors)
    if (fieldName in errors && errors[fieldName as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  // NEW: store the saved id (and restore from localStorage if present)
  // const [cardDataId, setCardDataId] = useState<string | null>(
  //   () => localStorage.getItem("businessCardId")
  // );
  const [cardDataSaving, setCardDataSaving] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [view, setView] = useState<ViewType>("Private");
  const [description, setDescription] = useState("");
  const [classifyText] = useState<string>("");
  const [agentId] = useState<string>("");

  const [descTouched, setDescTouched] = useState(false);
  const descCount = (description || "").trim().length;
  const MIN_DESC = 25; // if not already defined
  const MAX_DESC = 350; // if not already defined

  // Collapsible Instructions in preview
  const [instrCollapsed, setInstrCollapsed] = useState(false);

  // Loaders
  const [nameLoading, setNameLoading] = useState(false);
  const [descSuggestLoading, setDescSuggestLoading] = useState(false);

  // Instructions
  const [instructions, setInstructions] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editDraft, setEditDraft] = useState("");

  // Conversation starters (kept 2 as in your recent build)
  const [conStarter1, setConStarter1] = useState("");
  const [conStarter2, setConStarter2] = useState("");
  const [startersLoading, setStartersLoading] = useState(false);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadRole, setUploadRole] = useState<string>("");
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false); // 🔹 NEW
  const uploadResolveRef = useRef<null | ((ok: boolean) => void)>(null);

  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");

  const [showWhatsappVerificationModal, setShowWhatsappVerificationModal] =
    useState(false);
  const [agentUserName, setAgentUserName] = useState("");
  const [isWhatsappVerified, setIsWhatsappVerified] = useState(false);

  const [whatsappVerificationCode, setWhatsappVerificationCode] = useState("");
  const [whatsappOtpSession, setWhatsappOtpSession] = useState("");
  const [salt, setSalt] = useState("");

  const token = readToken() || "";
  const [errorMsg, setErrorMsg] = useState("");

  // === Auto Blog (separate flow) ===
  const BLOG_NAME_MAX = 80;
  const BLOG_DESC_MAX = 350;
  const BLOG_CAPTION_MAX = 50;

  const [blogName, setBlogName] = useState("");
  const [blogDesc, setBlogDesc] = useState("");
  const [blogCaption, setBlogCaption] = useState("");

  const [blogImageUrl, setBlogImageUrl] = useState<string | null>(null);
  const [blogBusy, setBlogBusy] = useState(false);

  // === Auto Blog visibility + preview modal ===
  const [autoBlogVisible, setAutoBlogVisible] = useState<"Yes" | "No">("No");
  const [blogPreviewOpen, setBlogPreviewOpen] = useState(false);

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isMandatoryGate, setIsMandatoryGate] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(""); // optional (can hide UI if not needed)
  const [email, setEmail] = useState("");

  const [initialFirstName, setInitialFirstName] = useState("");
  const [initialLastName, setInitialLastName] = useState("");
  const [initialEmail, setInitialEmail] = useState("");

  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({});

  // 👇 Add with other imports at top if not already present
  // import React, { useState, useEffect, useRef, useCallback } from "react";

  // 👇 Inside component (with other hooks)
  const creatorNameRef = useRef<HTMLInputElement | null>(null);
  const [creatorNameNudge, setCreatorNameNudge] = useState(false);

  // Update Creator Name from profile data
  useEffect(() => {
    const fullName = `${firstName || ""} ${lastName || ""}`.trim();
    if (fullName) {
      setAgentUserName(fullName);
    }
  }, [firstName, lastName]);

  // When 3 are selected but Creator Name empty → highlight + focus + message
  useEffect(() => {
    if (!roleResolved || !goalResolved || !purposeResolved) return;
    if (agentUserName.trim()) return;
    if (creatorNameNudge) return; // already nudged recently

    setCreatorNameNudge(true);

    Modal.info({
      title: "Creator Name Needed",
      content: (
        <div style={{ fontSize: 15, textAlign: "center", padding: "10px 0" }}>
          Now add your <b>Creator Name</b> (max 25 characters)
          <br />
          so we can personalize your AI Agent Name.
        </div>
      ),
      centered: true,
      okText: "Okay",
    });

    // Scroll + focus the Creator Name input
    if (creatorNameRef.current) {
      try {
        creatorNameRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } catch {
        // ignore scroll errors
      }
      creatorNameRef.current.focus();
    }

    const timer = setTimeout(() => setCreatorNameNudge(false), 60000); // allow nudge again after 60s
    return () => clearTimeout(timer);
  }, [
    roleResolved,
    goalResolved,
    purposeResolved,
    agentUserName,
    creatorNameNudge,
  ]);

  // You already have these in your file in some form; keep one version only.
  const getAuthHeaders = () =>
    (getAuthHeader() as Record<string, string>) || {};
  const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  // small safe-pick across variant keys
  function pick<T extends object>(obj: any, ...keys: string[]): string {
    if (!obj || typeof obj !== "object") return "";
    for (const k of keys) {
      const v = obj?.[k];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
    return "";
  }

  const customerId =
    (typeof window !== "undefined" &&
      (localStorage.getItem("customerId") ||
        localStorage.getItem("userId") ||
        sessionStorage.getItem("customerId") ||
        sessionStorage.getItem("userId"))) ||
    "";

  const showAutoBlogCard =
    (agentName || "").trim().length >= 3 &&
    (description || "").trim().length >= MIN_DESC;

  const userIdLS =
    (typeof window !== "undefined" && localStorage.getItem("userId")) || "";
  const profileNameLS =
    (typeof window !== "undefined" &&
      (localStorage.getItem("profileName") ||
        localStorage.getItem("name") ||
        localStorage.getItem("username"))) ||
    "User";

  // UI state
  const [loading, setLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Responsive (page width locked to mobile feel)
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < 768 : true
  );

  // Who added this blog? Prefer profile First + Last, then stored profileName, then "User"
  const campaignTypeAddByName = React.useMemo(() => {
    const fn = (firstName || "").trim();
    const ln = (lastName || "").trim();
    const full = [fn, ln].filter(Boolean).join(" ").trim();
    return full || profileNameLS || "User";
  }, [firstName, lastName, profileNameLS]);

  const postAgentBlogbyToggleOn = useCallback(
    async (opts: {
      agentName: string;
      creatorName: string;
      description: string;
      userId: string;
      profileName?: string;
      campaignTypeOverride?: string;
      socialMediaCaption?: string;
      images?: string[];
    }) => {
      const auth = getAuthHeader();
      if (!(auth as any)?.Authorization) {
        message.error("You’re not signed in. Please log in and try again.");
        return;
      }

      const disclaimerText = `

### ✅ **Blog Disclaimer**
*This blog is AI-assisted and based on public data. We aim to inform, not infringe. Contact us for edits or collaborations: [support@askoxy.ai]`;

      const finalCampaignDescription =
        (opts.description || "") + disclaimerText;
      const socialMediaCaption = (
        opts.socialMediaCaption || "#ASKOXY.AI #BharatAIStore #CreateAIAgent"
      ).trim();

      const campaignType = (
        opts.campaignTypeOverride ||
        opts.agentName ||
        "Blog"
      ).trim();

      const imagesArr = (opts.images || []).map((u) => ({
        imageUrl: u,
        status: true,
      }));

      const requestPayload = {
        askOxyCampaignDto: [
          {
            campaignDescription: finalCampaignDescription,
            campaignType,
            socialMediaCaption,
            campaignTypeAddBy: campaignTypeAddByName, // 👈 use First + Last
            images: imagesArr,
            campainInputType: "BLOG",
          },
        ],
      };

      await axios.patch(
        `${BASE_URL}/marketing-service/campgin/addCampaignTypes`,
        requestPayload,
        {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
            ...(auth as any),
          },
        }
      );

      message.success(
        "Your blog was added successfully. Thank you for sharing your thoughts!"
      );
    },
    [campaignTypeAddByName] // 👈 add dependency
  );

  // === BLOG IMAGE: generate image for blog preview ===
  const generateAgentImage = useCallback(
    async (params: {
      agentName: string;
      description: string;
      userId: string;
    }): Promise<string | null> => {
      const auth = getAuthHeader();
      if (!(auth as any)?.Authorization) {
        message.error("You’re not signed in. Please log in and try again.");
        return null;
      }
      try {
        const res = await fetch(
          `${BASE_URL}/ai-service/agent/generateProfilePic`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json", ...(auth as any) },
            body: JSON.stringify({
              agentName: params.agentName || "AI Agent",
              description: params.description || "",
              userId: params.userId,
            }),
          }
        );

        const txt = await res.text().catch(() => "");
        if (!res.ok) {
          let msg = `Generate failed (${res.status})`;
          if (txt) msg += `: ${txt}`;
          throw new Error(msg);
        }
        const json = txt ? JSON.parse(txt) : {};
        const url: string | null = json?.imageUrl || null;
        if (!url) throw new Error("No imageUrl in response.");
        return url as string;
      } catch (e: any) {
        message.error(e?.message || "Failed to generate profile image.");
        return null;
      }
    },
    []
  );

  useEffect(() => {
    if (!showAutoBlogCard || autoBlogVisible !== "Yes") return;

    const safeName = (agentName || "My AI Agent").trim();
    const baseDesc = (
      description ||
      "This AI Agent helps you get work done faster with guidance, tools, and automation."
    ).trim();

    setBlogName(`${safeName}`);
    setBlogDesc(baseDesc);
    setBlogCaption("#ASKOXY.AI #BharatAIStore #CreateAIAgent");

    // optional image generation for preview
    (async () => {
      setBlogBusy(true);
      try {
        const img = await generateAgentImage({
          agentName: safeName,
          description: baseDesc,
          userId: userIdLS,
        });
        if (img) setBlogImageUrl(img);
      } finally {
        setBlogBusy(false);
      }
    })();
  }, [
    showAutoBlogCard,
    autoBlogVisible,
    agentName,
    description,
    userIdLS,
    generateAgentImage,
  ]);

  useEffect(() => {
    const run = async () => {
      if (!customerId) {
        // No ID yet → force the mandatory gate so the user enters First Name + Email
        setIsMandatoryGate(true);
        setProfileModalOpen(true);
        setConfirmOpen(false);
        return;
      }

      try {
        setProfileLoading(true);

        // ✅ Fetch existing profile
        const response = await axios.get(
          `${BASE_URL}/user-service/customerProfileDetails`,
          {
            params: { customerId },
            headers: { ...getAuthHeaders() },
          }
        );

        const data = response?.data || {};

        const profileData = {
          userFirstName: pick(data, "firstName", "userFirstName"),
          userLastName: pick(data, "lastName", "userLastName"),
          customerEmail: pick(data, "email", "customerEmail"),
          alterMobileNumber: pick(data, "alterMobileNumber"),
          whatsappNumber: pick(data, "whatsappNumber"),
          mobileNumber: pick(data, "mobileNumber"),
          customerId: customerId || "",
        };

        setFirstName(profileData.userFirstName);
        setLastName(profileData.userLastName);
        setAgentUserName(
          `${profileData.userFirstName || ""} ${
            profileData.userLastName || ""
          }`.trim()
        );
        setEmail(profileData.customerEmail);

        setInitialFirstName(profileData.userFirstName);
        setInitialLastName(profileData.userLastName);
        setInitialEmail(profileData.customerEmail);
        // ✅ pull numbers from server
        setWhatsappNumber(profileData.whatsappNumber || "");
        setMobileNumber(profileData.mobileNumber || "");

        // ✅ only prompt if WhatsApp missing; otherwise mark verified and don't ask
        if (!profileData.whatsappNumber) {
          // optional nudge to add WhatsApp, but do NOT block
          Modal.confirm({
            title: "Add your WhatsApp number?",
            content: "We’ll use it to send OTP and verify.",
            okText: "Add",
            cancelText: "Later",
            onOk: () => setShowWhatsappVerificationModal(true),
          });
        } else {
          setIsWhatsappVerified(true);
        }
        // Required: firstName + email
        const missing =
          !profileData.userFirstName || !profileData.customerEmail;

        setIsMandatoryGate(missing);
        setProfileModalOpen(missing); // open edit if missing
        setConfirmOpen(!missing); // else confirm dialog
      } catch (e: any) {
        // If fetch fails, allow user to continue but let them edit
        setIsMandatoryGate(true);
        setProfileModalOpen(true);
        setConfirmOpen(false);
      } finally {
        setProfileLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  const isDirty =
    firstName.trim() !== initialFirstName.trim() ||
    lastName.trim() !== initialLastName.trim() ||
    email.trim() !== initialEmail.trim();

  // ✅ WhatsApp Verification (sends OTP + verifies, updates profile if needed)
  const handleWhatsappVerification = async () => {
    try {
      setLoading(true); // use existing loading flag

      // prefer explicit WhatsApp; fallback to mobile (minus country code)
      const chatId = (whatsappNumber || mobileNumber || "")
        .replace(countryCode, "")
        .replace(/^\+/, "")
        .trim();

      if (!chatId) {
        setErrorMsg("Please enter your WhatsApp number to continue.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/user-service/sendWhatsappOtpqAndVerify`,
        {
          chatId,
          countryCode,
          id: customerId,
          whatsappOtp: whatsappVerificationCode,
          whatsappOtpSession,
          salt,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        setIsWhatsappVerified(true);
        setShowWhatsappVerificationModal(false);
        message.success("WhatsApp number verified successfully!");

        // if WhatsApp was empty, persist it now
        if (
          !whatsappNumber &&
          mobileNumber &&
          mobileNumber !== whatsappNumber
        ) {
          // you’re already validating firstName/email in handleSaveOrUpdateProfile
          await handleSaveOrUpdateProfile();
        }
      } else {
        setErrorMsg("Invalid verification code");
      }
    } catch {
      setErrorMsg("Failed to verify WhatsApp number");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOrUpdateProfile = async () => {
    // validations
    const nextErrors: ProfileErrors = {};
    if (!firstName.trim()) nextErrors.name = "First name is required";
    if (!email.trim()) nextErrors.email = "Email is required";
    else if (!emailOk(email)) nextErrors.email = "Enter a valid email";
    setProfileErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setProfileLoading(true);

      const payload = {
        userFirstName: firstName.trim(),
        userLastName: (lastName || "").trim() || null,
        customerEmail: email.trim(),
        customerId,
      };

      // Only PATCH if mandatory or user changed something
      if (isMandatoryGate || isDirty) {
        await axios.patch(`${BASE_URL}/user-service/profileUpdate`, payload, {
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        });
        message.success(
          isMandatoryGate ? "Profile saved!" : "Profile updated!"
        );
        setInitialFirstName(payload.userFirstName);
        setInitialLastName(payload.userLastName || "");
        setInitialEmail(payload.customerEmail);

        // (Optional) keep in localStorage for future
        try {
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "profileName",
              `${payload.userFirstName || ""} ${
                payload.userLastName || ""
              }`.trim()
            );
          }
        } catch {}
      }

      setIsMandatoryGate(false);
      setProfileModalOpen(false);
      setConfirmOpen(false);
    } catch (e: any) {
      message.error(
        e?.response?.data?.message ||
          e?.message ||
          "Error updating profile. Please try again."
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handleBusinessCardUpload = async () => {
    if (!businessCardFile) {
      notification.error({
        message: "No File Selected",
        description: "Please select a business card image first.",
      });
      return;
    }

    const userId = localStorage.getItem("userId") || "";
    if (!userId) {
      notification.error({
        message: "User Not Found",
        description: "User ID is missing. Please log in again.",
      });
      return;
    }

    const auth = getAuthHeader();
    const formData = new FormData();
    formData.append("file", businessCardFile);

    setBusinessCardUploading(true);

    try {
      const res = await fetch(
        `${BASE_URL}/ai-service/agent/uploadBusinessCard?fileType=kyc&userId=${encodeURIComponent(
          userId
        )}`,
        {
          method: "POST",
          headers: { ...auth },
          body: formData,
        }
      );

      const data = await res.json();

      // ❌ Backend returned error
      if (data.status === "FAILED" || data.message) {
        notification.error({
          message: "Processing Failed",
          description: data.message || "Failed to process business card.",
        });
        return;
      }

      // ❌ Network / server-level error
      if (!res.ok) {
        notification.error({
          message: "Upload Error",
          description:
            data.message || `Upload failed with status ${res.status}`,
        });
        return;
      }

      const aiData = data.aiData;
      const receivedCardData = data.cardData;

      if (!aiData) {
        notification.error({
          message: "AI Processing Error",
          description: "No AI data received from the business card.",
        });
        return;
      }

      // ✅ Store card data and show modal
      if (receivedCardData) {
        setCardData(receivedCardData);
        setCardDataForm({
          fullName: receivedCardData.fullName || "",
          jobTitle: receivedCardData.jobTitle || "",
          companyName: receivedCardData.companyName || "",
          email: receivedCardData.email || "",
          mobileNumber: receivedCardData.phone || "",
          website: receivedCardData.website || "",
          address: receivedCardData.address || "",
          userId: localStorage.getItem("userId") || "",
          id: "",
        });
        setCardDataModalOpen(true);
        setIsEditingCardData(false);
      }

      // ================================
      // ✅ Set basic fields
      // ================================
      setAgentName(aiData.agentName || "");
      setDescription(aiData.description || "");
      setInstructions(aiData.instructions || "");
      setDescTouched(false);

      // ================================
      // ✅ Set role
      // ================================
      const roleMatch = ROLE_OPTS.find(
        (opt) => opt.value.toLowerCase() === (aiData.role || "").toLowerCase()
      );

      if (roleMatch) {
        setRoleSelect(roleMatch.value);
      } else if (aiData.role) {
        setRoleSelect("Other");
        setRoleOther(aiData.role);
      }

      // ================================
      // ✅ Goal & Purpose handling
      // ================================
      const pendingGoal = aiData.goals;
      const pendingPurpose = aiData.purpose;

      let attempts = 0;
      const maxAttempts = 20;

      // Goal polling
      const setGoalWhenReady = setInterval(() => {
        attempts++;

        if (goalOptions.length > 0 && pendingGoal) {
          const match = goalOptions.find(
            (opt) => opt.value.toLowerCase() === pendingGoal.toLowerCase()
          );

          if (match) {
            setGoalSelect(match.value);
          } else {
            setGoalSelect("Other");
            setGoalOther(pendingGoal);
          }

          clearInterval(setGoalWhenReady);
        }

        if (attempts >= maxAttempts) {
          if (pendingGoal) {
            setGoalSelect("Other");
            setGoalOther(pendingGoal);
          }
          clearInterval(setGoalWhenReady);
        }
      }, 200);

      // Purpose polling
      const setPurposeWhenReady = setInterval(() => {
        if (purposeOptions.length > 0 && pendingPurpose) {
          const match = purposeOptions.find(
            (opt) => opt.value.toLowerCase() === pendingPurpose.toLowerCase()
          );

          if (match) {
            setPurposeSelect(match.value);
          } else {
            setPurposeSelect("Other");
            setPurposeOther(pendingPurpose);
          }

          clearInterval(setPurposeWhenReady);
        }

        if (attempts >= maxAttempts) {
          if (pendingPurpose) {
            setPurposeSelect("Other");
            setPurposeOther(pendingPurpose);
          }
          clearInterval(setPurposeWhenReady);
        }
      }, 200);

      // ✅ Success Notification
      notification.success({
        message: "Business Card Processed",
        description: "All fields were successfully extracted and populated.",
      });
      setIsBusinessCardUsed(true);
      // Reset file & preview
      // setBusinessCardFile(null);
      // setBusinessCardPreview("");

      // Scroll to fields
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 300);
    } catch (e: any) {
      notification.error({
        message: "Unexpected Error",
        description:
          e?.message ||
          "Something went wrong while processing the business card.",
      });
    } finally {
      setBusinessCardUploading(false);
    }
  };

  const handleBusinessCardFileSelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,.pdf";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Validate file type
        const validTypes = /\.(jpg|jpeg|png|pdf)$/i;
        if (!validTypes.test(file.name)) {
          message.error("Please upload JPG, PNG, or PDF only");
          return;
        }
        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          message.error("File size must be less than 5MB");
          return;
        }

        setBusinessCardFile(file);

        // Create preview for images
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setBusinessCardPreview(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        } else {
          setBusinessCardPreview("");
        }
      }
    };
    input.click();
  };

  const handleCardDataUpdate = async () => {
    // Validate required fields first
    const newErrors = {
      fullName: validateField("fullName", cardDataForm.fullName),
      companyName: validateField("companyName", cardDataForm.companyName),
      mobileNumber: validateField("mobileNumber", cardDataForm.mobileNumber),
      address: validateField("address", cardDataForm.address),
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (hasErrors) {
      message.error("Please fill in all required fields");
      return;
    }

    // Proceed with API call
    const userId = localStorage.getItem("userId") || "";
    if (!userId) {
      notification.error({
        message: "User Not Found",
        description: "User ID is missing. Please log in again.",
      });
      return;
    }

    const auth = getAuthHeader();
    setCardDataSaving(true);
    console.log("Updating card data with:", cardDataForm);
    try {
      const res = await fetch(
        `${BASE_URL}/ai-service/agent/updateBusinessCardData`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...auth,
          },
          body: JSON.stringify(cardDataForm),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || `Update failed with status ${res.status}`
        );
      }

      // const data: BusinessCardData = await res.json();

      // Save id from response
      if (data.id) {
        setCardDataId(data.id);
        localStorage.setItem("businessCardId", data.id);
      }

      setCardData(data);
      setCardDataForm({
        ...data,
        userId,
      });

      notification.success({
        message: "Card Data Updated",
        description:
          "Success! Your business card details have been updated successfully."

      });

      // Populate form fields with the saved/edited data
      setAgentUserName(data.fullName || cardDataForm.fullName || "");
      setIsEditingCardData(false);
      setCardDataModalOpen(false);
      suggestAgentName()

      // Reset file & preview after successful update
      // setBusinessCardFile(null);
      // setBusinessCardPreview("");
    } catch (e: any) {
      notification.error({
        message: "Update Failed",
        description:
          e?.message || "Failed to update card data. Please try again.",
      });
    } finally {
      setCardDataSaving(false);
    }
  };
  const handleCancelProfile = () => {
    if (isMandatoryGate) {
      message.warning("Please enter First Name and Email to continue.");
      return; // 🔒 block closing while mandatory
    }
    setProfileModalOpen(false);
  };

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // was: addFileType: AddFileType,
  async function uploadMandatoryDocOnceMulti(
    assistanceId: string,
    files: File[],
    addFileType: string,
    userId: string,
    auth: HeadersInit
  ) {
    for (const file of files) {
      // STEP 1: Upload to META upload-service
      const uploadForm = new FormData();
      uploadForm.append("file", file);

      const uploadUrl =
        "https://meta.oxyloans.com/api/upload-service/upload?id=45880e62-acaf-4645-a83e-d1c8498e923e&fileType=aadhar";

      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        headers: { ...auth },
        body: uploadForm,
      });

      const uploadData = await uploadRes.json();
      const documentPath = uploadData?.documentPath;

      if (!documentPath) {
        throw new Error("No documentPath returned from upload-service");
      }

      // STEP 2: Upload same file + documentPath to addAgentFiles API
      const agentForm = new FormData();
      agentForm.append("file", file); // The SAME file goes again

      const finalUrl = `${BASE_URL}/ai-service/agent/${encodeURIComponent(
        assistanceId
      )}/addAgentFiles?addFileType=${encodeURIComponent(
        addFileType
      )}&userId=${encodeURIComponent(userId)}&url=${encodeURIComponent(
        documentPath
      )}`;

      const agentRes = await fetch(finalUrl, {
        method: "POST",
        headers: { ...auth },
        body: agentForm,
      });

      if (!agentRes.ok) {
        const txt = await agentRes.text().catch(() => "");
        throw new Error(
          `addAgentFiles failed → ${agentRes.status} ${
            txt || agentRes.statusText
          }`
        );
      }
    }
  }

  // keep the context we need while the modal is open
  const pendingUploadRef = useRef<{
    assistanceId: string;
    userId: string;
    auth: HeadersInit;
    roleForUpload?: string; // ← new
  } | null>(null);

  // include roleForUpload
  function promptUpload(
    assistanceId: string,
    userId: string,
    auth: HeadersInit,
    roleForUpload?: string
  ) {
    return new Promise<boolean>((resolve) => {
      uploadResolveRef.current = resolve;
      localStorage.setItem(
        "awaitingUpload",
        JSON.stringify({ assistanceId, userId })
      );
      setUploadFiles([]);
      setUploadRole(roleForUpload || ""); // ← seed UI with non-editable role
      pendingUploadRef.current = { assistanceId, userId, auth, roleForUpload };
      setUploadOpen(true);
    });
  }

  // Re-prompt on refresh should also remember the role if we saved it locally;
  // if not available, it will just show blank read-only (that’s okay).
  useEffect(() => {
    const raw = localStorage.getItem("awaitingUpload");
    if (!raw) return;
    try {
      const { assistanceId, userId } = JSON.parse(raw || "{}");
      if (assistanceId && userId) {
        const auth = getAuthHeader();
        setUploadFiles([]);
        // we may not have the role offline; still open the modal
        setUploadRole(
          (pendingUploadRef.current?.roleForUpload as string) || ""
        );
        pendingUploadRef.current = { assistanceId, userId, auth };
        setUploadOpen(true);
      }
    } catch {}
  }, []);

  async function handleUploadConfirm() {
    const ctx = pendingUploadRef.current;
    if (!ctx || uploading) return; // 🔒 prevent double-clicks

    // no user choice anymore; role is read-only from API/publish flow
    const finalRole = (uploadRole || "").trim(); // may be "", still allowed

    if (!uploadFiles.length) {
      message.error("Please attach at least one file.");
      return;
    }

    for (const f of uploadFiles) {
      const okType = /\.(pdf|jpe?g|png|docx?)$/i.test(f.name);
      const okSize = f.size <= 5 * 1024 * 1024;
      if (!okType) return message.error(`Unsupported file: ${f.name}`);
      if (!okSize) return message.error(`File too large (5MB max): ${f.name}`);
    }

    try {
      setUploading(true); // 🔹 start loader

      await uploadMandatoryDocOnceMulti(
        ctx.assistanceId,
        uploadFiles,
        finalRole, // ← pass string
        ctx.userId,
        ctx.auth
      );

      localStorage.removeItem("awaitingUpload");
      setUploadOpen(false);
      uploadResolveRef.current?.(true);
      uploadResolveRef.current = null;

      message.success(
        "Congratulations! File(s) uploaded. Your agent is queued for approval."
      );

      // clear form (optional, as you had before)
      setAgentName("");
      setDescription("");
      setInstructions("");
      setConStarter1("");
      setConStarter2("");
      setRoleSelect("");
      setGoalSelect("");
      setPurposeSelect("");
      setRoleOther("");
      setGoalOther("");
      setPurposeOther("");

      // ⚠️ IMPORTANT:
      // Do NOT navigate here.
      // publishNow() will resume after this Promise resolves
      // and will handle:
      //  - jobContext → /main/jobdetails + openApplyModal
      //  - default → /main/bharath-aistore/agents
    } catch (e: any) {
      message.error(e?.message || "Upload failed.");
    } finally {
      setUploading(false); // 🔹 stop loader
    }
  }

  function handleUploadFilesPick() {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx";
    input.onchange = () => {
      const list = Array.from(input.files || []);
      if (list.length) setUploadFiles(list);
    };
    input.click();
  }

  // Re-prompt on refresh using the controlled modal only (no confirm modal)
  useEffect(() => {
    const raw = localStorage.getItem("awaitingUpload");
    if (!raw) return;
    try {
      const { assistanceId, userId } = JSON.parse(raw || "{}");
      if (assistanceId && userId) {
        const auth = getAuthHeader();
        // seed context and open the controlled modal
        setUploadRole("");
        setUploadFiles([]);
        pendingUploadRef.current = { assistanceId, userId, auth };
        setUploadOpen(true);
      }
    } catch {}
  }, []);

  const [startersEdit, setStartersEdit] = useState(false);
  const [cs1Draft, setCs1Draft] = useState("");
  const [cs2Draft, setCs2Draft] = useState("");

  const startEditStarters = () => {
    setCs1Draft(conStarter1);
    setCs2Draft(conStarter2);
    setStartersEdit(true);
  };
  const saveStarters = () => {
    const s1 = (cs1Draft || "").substring(0, 150); // allow special chars fully
    const s2 = (cs2Draft || "").substring(0, 150);

    setConStarter1(s1);
    setConStarter2(s2);

    setStartersEdit(false);
    message.success("Conversation starters saved!");
  };
  const closeStarters = () => {
    // discard changes
    setStartersEdit(false);
  };

  const nameCount = agentName.trim().length;

  const canPreview =
    nameCount >= 3 &&
    !!roleResolved &&
    !!goalResolved &&
    !!purposeResolved &&
    descCount >= MIN_DESC &&
    descCount <= MAX_DESC;

  const canPublish = canPreview && instructions.trim().length > 0;

  const previewDescription = useMemo(
    () =>
      mergedSentence(
        description,
        roleResolved || "",
        purposeResolved || "",
        goalResolved || ""
      ),
    [description, roleResolved, purposeResolved, goalResolved]
  );

  const sanitizeName = (s: string) => {
    const raw = (s || "")
      .replace(/^[\s?:\-]*generated\s*agent\s*name\s*:*/i, "")
      .replace(/[,|]+/g, " ")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .trim();
    const tokens = raw.match(/[A-Za-z][A-Za-z0-9.&_-]{1,79}/g) || [];
    const picked = tokens.length ? tokens[tokens.length - 1] : raw;
    return picked.replace(/\s+/g, " ").trim().slice(0, 80);
  };

  const previewSessionIdRef = useRef(0);
  const startersInFlightRef = useRef(false);
  const startersSuccessOnceRef = useRef(false);

  // 350-char popup (gentle; not blocking typing)
  const descMaxAlertedRef = useRef(false);
  useEffect(() => {
    if (descCount === MAX_DESC && !descMaxAlertedRef.current) {
      descMaxAlertedRef.current = true;
      message.error(
        "Description reached 350 characters. Please shorten or refine."
      );
      setTimeout(() => (descMaxAlertedRef.current = false), 800);
    }
  }, [descCount]);

  const suggestAgentName = useCallback(async () => {
    // 🔒 1) Block if Creator Name is empty
    if (!agentUserName?.trim()) {
      message.error(
        "Please enter your Creator Name and save it in your profile before generating an Agent Name."
      );

      // Open profile modal & mark as mandatory
      setIsMandatoryGate(true);
      setProfileModalOpen(true);

      return; // ⛔ stop here → do NOT hit API
    }

    const auth = getAuthHeader() as Record<string, string>;
    if (!auth || !auth.Authorization) {
      message.error("You're not signed in. Please log in and try again.");
      return;
    }

    // Use resolved values here
    if (!roleResolved || !goalResolved || !purposeResolved) {
      message.warning("Pick Role, Goal, and Purpose first.");
      return;
    }

    const baseUrl = `${BASE_URL}/ai-service/agent/getAgentName`;
    const qs = (o: Record<string, string>) => new URLSearchParams(o).toString();

    // 🔹 Always send trimmed Creator Name
    const displayName = (agentUserName || "").trim() || "User";

    const ctrl = new AbortController();
    const timeoutId = setTimeout(() => ctrl.abort(), 15000);

    // Helpers
    const extractName = (raw: any): string => {
      try {
        if (typeof raw === "object" && raw) {
          const candidate =
            raw.name ??
            raw.agentName ??
            raw.suggestion ??
            raw.data ??
            raw.result ??
            raw.output;
          if (typeof candidate === "string") return candidate;
        }
        if (typeof raw === "string") return raw;
      } catch {}
      return "";
    };

    const parseFlexible = async (res: Response) => {
      const ct = (res.headers.get("content-type") || "").toLowerCase();
      if (ct.includes("application/json")) {
        try {
          return await res.json();
        } catch {}
      }
      const t = await res.text();
      try {
        return JSON.parse(t);
      } catch {
        return t;
      }
    };

    const okOrRetry5xx = async (
      res: Response | undefined,
      again: () => Promise<Response>
    ) => {
      if (!res) return undefined;
      if (res.ok) return res;
      if ([500, 502, 503, 504].includes(res.status)) {
        await new Promise((r) => setTimeout(r, 500));
        return again();
      }
      return res;
    };

    setNameLoading(true);
    try {
      let res: Response | undefined;

      // Common query params object
      const queryParams = {
        role: roleResolved,
        goal: goalResolved,
        purpose: purposeResolved,
        name: displayName,
      };

      // ✅ Preferred: POST with query params (no body, like your curl)
      try {
        res = await fetch(`${baseUrl}?${qs(queryParams)}`, {
          method: "POST",
          headers: { ...auth },
          mode: "cors",
          signal: ctrl.signal,
        });
      } catch {
        res = undefined;
      }

      // Retry 5xx with SAME params (including name)
      res = await okOrRetry5xx(res, () =>
        fetch(`${baseUrl}?${qs(queryParams)}`, {
          method: "POST",
          headers: { ...auth },
          mode: "cors",
          signal: ctrl.signal,
        })
      );

      // ✅ Fallback: POST x-www-form-urlencoded with name
      if (!res || !res.ok) {
        try {
          const form = new URLSearchParams(queryParams);
          res = await fetch(baseUrl, {
            method: "POST",
            headers: {
              Accept: "application/json, text/plain;q=0.9, */*;q=0.8",
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
              ...auth,
            },
            body: form.toString(),
            mode: "cors",
            signal: ctrl.signal,
          });
        } catch {
          res = undefined;
        }
      }

      if (!res) {
        message.warning(
          "Name suggestion failed: Network/CORS. Ensure this route allows Authorization and required methods."
        );
        return;
      }
      if (res.status === 204) {
        message.warning("No content returned from server.");
        return;
      }
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        message.warning(
          `Name suggestion failed: ${res.status} ${txt || ""}`.trim()
        );
        return;
      }

      const data = await parseFlexible(res);
      const suggestion = sanitizeName(extractName(data));
      if (!suggestion) {
        message.warning("No valid name returned. Please try again.");
        return;
      }

      Modal.confirm({
        title: "Use this Agent Name?",
        content: (
          <div>
            We suggest: <b style={{ color: "#5A00A6" }}>{suggestion}</b>
            {!!agentName.trim() && (
              <div style={{ color: TEXT_MUTED, marginTop: 6 }}>
                This will replace your current name "{agentName.trim()}".
              </div>
            )}
          </div>
        ),
        okText: "Use",
        cancelText: "Cancel",
        styles: {
          footer: {
            display: "flex",
            flexWrap: "nowrap",
            gap: 8,
            justifyContent: "flex-end",
            overflowX: "auto",
            paddingBottom: 4,
            whiteSpace: "nowrap",
          },
        },
        okButtonProps: {
          style: {
            flex: "0 0 auto",
            border: "none",
            borderRadius: 999,
            padding: "8px 16px",
            fontWeight: 900,
            color: "#fff",
            background:
              "linear-gradient(90deg, #6D28D9 0%, #2563EB 50%, #FF00FF 100%)",
          },
        },
        cancelButtonProps: {
          style: {
            flex: "0 0 auto",
            borderRadius: 999,
            border: `1px solid ${BORDER}`,
            background: "#fff",
            color: "#475569",
            fontWeight: 800,
            padding: "8px 14px",
          },
        },
        onOk: () => setAgentName(suggestion),
        onCancel: () => setAgentName(""),
      });
    } catch (e: any) {
      message.error(
        e?.name === "AbortError"
          ? "Name suggestion timed out. Try again."
          : e?.message || "Name suggestion failed."
      );
    } finally {
      clearTimeout(timeoutId);
      setNameLoading(false);
    }
  }, [
    agentName,
    agentUserName,
    roleResolved,
    goalResolved,
    purposeResolved,
    setIsMandatoryGate,
    setProfileModalOpen,
  ]);

  // One-per-combo guard + DEBOUNCED trigger (fixes multi-calls while typing "Other")
  const lastComboRef = useRef<string>("");
  const nameSuggestInFlightRef = useRef(false);

  useEffect(() => {
    if (!roleDeb || !goalDeb || !purposeDeb) return;
    if (!agentUserName.trim()) return; //  ⛔ no auto hit if Creator Name empty
    if (creationMode === "CardBased") return; // ⛔ no auto suggestion for card based mode

    const combo = `${roleDeb}__${goalDeb}__${purposeDeb}`;
    if (combo === lastComboRef.current) return; // same combo → ignore
    if (nameSuggestInFlightRef.current) return; // a call is already starting

    lastComboRef.current = combo;
    nameSuggestInFlightRef.current = true;
    (async () => {
      try {
        await suggestAgentName();
      } finally {
        nameSuggestInFlightRef.current = false;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleDeb, goalDeb, purposeDeb, isBusinessCardUsed, creationMode]); // use ONLY debounced deps

  const parseSmart = async (res: Response) => {
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (ct.includes("application/json")) {
      const data = await res.json();
      return typeof data === "string"
        ? data
        : (data as any).name ||
            (data as any).instructions ||
            (data as any).message ||
            JSON.stringify(data);
    }
    let raw = await res.text();
    try {
      const maybe = JSON.parse(raw);
      return typeof maybe === "string"
        ? maybe
        : (maybe as any).name ||
            (maybe as any).instructions ||
            (maybe as any).message ||
            raw;
    } catch {
      return raw.replace(/^#{1,6}\s?.*$/gm, "").trim();
    }
  };

  const suggestAgentDescription = useCallback(async () => {
    const auth = getAuthHeader() as Record<string, string>;
    if (!auth || !auth.Authorization) {
      message.error("You're not signed in. Please log in and try again.");
      return;
    }
    if (!roleResolved || !goalResolved || !purposeResolved) {
      message.warning("Pick Role, Goal, and Purpose first.");
      return;
    }

    const baseUrl = `${BASE_URL}/ai-service/agent/getAgentDescription`;
    const qs = new URLSearchParams({
      role: roleResolved,
      goal: goalResolved,
      purpose: purposeResolved,
    });

    setDescSuggestLoading(true);
    try {
      let res: Response | undefined;

      // POST with query
      if (!res || !res.ok) {
        try {
          res = await fetch(`${baseUrl}?${qs.toString()}`, {
            method: "POST",
            headers: { ...auth },
          });
        } catch {}
      }

      if (!res || !res.ok) {
        const status = res?.status ?? "network";
        const txt = res
          ? await res.text().catch(() => "")
          : "Network / CORS error";
        message.warning(`Description suggestion failed: ${status} ${txt}`);
        return;
      }

      const raw = (await parseSmart(res))?.toString() ?? "";
      const proposed = cleanForTransport(raw).slice(0, MAX_DESC);

      Modal.confirm({
        title: "Use this Description?",
        content: <div style={{ whiteSpace: "pre-wrap" }}>{proposed}</div>,
        okText: "Use",
        cancelText: "Cancel",
        styles: {
          footer: {
            display: "flex",
            flexWrap: "nowrap", // 🔒 single row
            gap: 8,
            justifyContent: "flex-end",
            overflowX: "auto",
            paddingBottom: 4,
            whiteSpace: "nowrap",
          },
        },
        okButtonProps: {
          style: {
            flex: "0 0 auto",
            border: "none",
            borderRadius: 999,
            padding: "8px 16px",
            fontWeight: 900,
            color: "#fff",
            background:
              "linear-gradient(90deg, #6D28D9 0%, #2563EB 50%, #FF00FF 100%)",
          },
        },
        cancelButtonProps: {
          style: {
            flex: "0 0 auto",
            borderRadius: 999,
            border: `1px solid ${BORDER}`,
            background: "#fff",
            color: "#475569",
            fontWeight: 800,
            padding: "8px 14px",
          },
        },
        onOk: () => setDescription(proposed),
      });
    } finally {
      setDescSuggestLoading(false);
    }
  }, [roleResolved, goalResolved, purposeResolved]);

  const requestAndOpenEditor = useCallback(async () => {
    const baseErr = `Please enter a Description (${MIN_DESC}–${MAX_DESC} characters) to generate instructions.`;
    if (!description.trim() || description.trim().length < MIN_DESC) {
      message.error(baseErr);
      return;
    }
    const auth = getAuthHeader() as Record<string, string>;
    if (!auth || !auth.Authorization) {
      message.error("You're not signed in. Please log in and try again.");
      return;
    }
    const baseUrl = `${BASE_URL}/ai-service/agent/classifyInstruct`;
    const descClean = cleanForTransport(description);

    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 20000);
    const qs = new URLSearchParams({ description: descClean });

    try {
      setGenLoading(true);
      let res: Response | undefined;

      // POST ?query
      if (!res || !res.ok) {
        try {
          res = await fetch(`${baseUrl}?${qs.toString()}`, {
            method: "POST",
            headers: { ...auth },
            signal: ctrl.signal,
          });
        } catch {}
      }

      if (!res || !res.ok) {
        const status = res?.status ?? "network";
        const txt = res
          ? await res.text().catch(() => "")
          : "Network / CORS error";
        throw new Error();
      }

      const raw = await parseSmart(res);
      const cleaned = cleanInstructionText(raw);
      const seed =
        cleaned ||
        `Write precise, actionable instructions for an agent called "${
          agentName || "Untitled Agent"
        }".`;

      setInstructions(seed);
      setEditDraft(seed);
    } catch (e: any) {
      const msg =
        e?.name === "AbortError"
          ? "Request timed out. Please try again."
          : e?.message || "Failed to generate instructions";
      message.error(msg);
    } finally {
      clearTimeout(timeout);
      setGenLoading(false);
    }
  }, [description, agentName]);

  const suggestStartersFromAPI = useCallback(async () => {
    const rawAuth = getAuthHeader() as Record<string, string> | undefined;
    const token = (rawAuth as any)?.Authorization;
    if (!token) {
      message.error("You’re not signed in. Please log in and try again.");
      return;
    }
    const authHeaders = new Headers({ Authorization: token });

    const baseDesc = (description || classifyText || "").trim();
    if (!baseDesc) {
      message.error("Please enter a Description first (Step-1).");
      return;
    }
    const descClean = cleanForTransport(baseDesc);
    const urlBase = `${BASE_URL}/ai-service/agent/classifyStartConversation`;

    setStartersLoading(true);
    const ctrl = new AbortController();
    const timeoutId = setTimeout(() => ctrl.abort(), 20000);

    const qs = (obj: Record<string, string | undefined>) => {
      const p = new URLSearchParams();
      for (const [k, v] of Object.entries(obj)) {
        if (typeof v === "string" && v.trim()) p.set(k, v);
      }
      return p.toString();
    };

    const parseFlexible = async (res: Response) => {
      const ct = (res.headers.get("content-type") || "").toLowerCase();
      if (ct.includes("application/json")) {
        const data = await res.json();
        if (Array.isArray(data)) return data.join("\n");
        if (data && typeof data === "object") {
          return (
            (data as any).questions ||
            (data as any).message ||
            (data as any).result ||
            (data as any).text ||
            JSON.stringify(data)
          );
        }
        return String(data ?? "");
      }
      let txt = await res.text();
      try {
        const maybe = JSON.parse(txt);
        if (Array.isArray(maybe)) return maybe.join("\n");
        if (maybe && typeof maybe === "object") {
          return (
            (maybe as any).questions ||
            (maybe as any).message ||
            (maybe as any).result ||
            txt
          );
        }
        return String(maybe ?? txt);
      } catch {
        return txt;
      }
    };

    const applyPrompts = (raw: string) => {
      const prompts = parseStartersFromText(raw) || [];
      if (!prompts.length) {
        message.warning(
          "No suggestions returned. Please tweak your Description and try again."
        );
        return false;
      }

      // If we already have both, don't re-apply or re-toast
      const alreadyHave =
        !!(conStarter1 || "").trim() && !!(conStarter2 || "").trim();

      setConStarter1(prompts[0] || "");
      setConStarter2(prompts[1] || "");

      // Show success only once per preview session
      if (!alreadyHave && !startersSuccessOnceRef.current) {
        startersSuccessOnceRef.current = true;
        message.success({
          content: `Added ${Math.min(
            prompts.length,
            2
          )} conversation starters.`,
          key: "startersSuccess",
          duration: 2,
        });
      }
      return true;
    };

    try {
      let res: Response | undefined;

      // Retry: POST with query
      if (!res || (!res.ok && (res.status === 400 || res.status === 415))) {
        try {
          const url = `${urlBase}?${qs({
            description: descClean,
            agentId: agentId || undefined,
          })}`;
          res = await fetch(url, {
            method: "POST",
            headers: authHeaders,
            signal: ctrl.signal,
          });
        } catch {
          res = undefined;
        }
      }

      if (!res) {
        throw new Error(
          "Network/CORS error calling starters API. Ensure POST is allowed and CORS is enabled."
        );
      }

      // One retry for transient 5xx
      if (!res.ok && [500, 502, 503, 504].includes(res.status)) {
        await new Promise((r) => setTimeout(r, 500));
        const url = `${urlBase}?${qs({
          description: descClean,
          agentId: agentId || undefined,
        })}`;
        res = await fetch(url, {
          method: "POST",
          headers: authHeaders,
          signal: ctrl.signal,
        });
      }

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(
          `classifyStartConversation failed: ${res.status} ${txt}`
        );
      }

      if (res.status === 204) {
        message.warning("No content returned from server.");
        return;
      }

      const raw = await parseFlexible(res);
      if (!applyPrompts(raw)) return;
    } catch (e: any) {
      message.error(
        e?.name === "AbortError"
          ? "Starter suggestion timed out. Try again."
          : e?.message || "Failed to fetch conversation starters."
      );
    } finally {
      clearTimeout(timeoutId);
      setStartersLoading(false);
    }
  }, [description, classifyText, agentId]);

  // Generate ONLY missing instructions while preview is open (debounced).
  const regenTimerRef = useRef<number | null>(null);
  useEffect(() => {
    if (!previewOpen) return;
    if (!description.trim()) return;

    if (regenTimerRef.current) {
      window.clearTimeout(regenTimerRef.current);
    }

    regenTimerRef.current = window.setTimeout(async () => {
      const needInstr = !instructions.trim();
      if (!needInstr) return;

      try {
        setGenLoading(true);
        await requestAndOpenEditor();
      } finally {
        setGenLoading(false);
      }
    }, 600);

    return () => {
      if (regenTimerRef.current) {
        window.clearTimeout(regenTimerRef.current);
        regenTimerRef.current = null;
      }
    };
  }, [previewOpen, description, instructions, requestAndOpenEditor]);

  const publishNow = useCallback(async () => {
    const userId = localStorage.getItem("userId") || "";
    const auth = getAuthHeader();

    // 🔹 Decide jobStatus based on JobDetails → Agentcreation flow
    // If agentJobContext exists (coming from a Job), send "JOBAPPLYING"
    // If not from job, send null
    let jobStatus: string | null = null;
    try {
      const rawCtx = localStorage.getItem("agentJobContext");
      if (rawCtx) {
        const ctx = JSON.parse(rawCtx || "{}");
        if (ctx && ctx.fromJobId) {
          jobStatus = "JOBAPPLYING";
        }
      }
    } catch {
      jobStatus = null;
    }

    const body = {
      agentName: (agentName || "").trim(),
      description: previewDescription,
      creatorName: agentUserName,
      roleUser: roleSelect === "Other" ? "Other" : roleSelect,
      purpose: purposeSelect === "Other" ? "Other" : purposeSelect,
      goals: goalSelect === "Other" ? "Other" : goalSelect,
      optionalRole: roleSelect === "Other" ? roleOther.trim() : "",
      optionalPurpose: purposeSelect === "Other" ? purposeOther.trim() : "",
      optionalGoal: goalSelect === "Other" ? goalOther.trim() : "",
      instructions: (instructions || "").slice(0, 7000),

      userId,
      view,
      conStarter1: (conStarter1 || "").trim(),
      conStarter2: (conStarter2 || "").trim(),
      conStarter3: "",
      conStarter4: "",

      // ✅ New field for backend:
      jobStatus, // "JOBAPPLYING" if from Job, otherwise null
      ...(isBusinessCardUsed && { interactionMode: "BusinessCard" }),
    };

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/ai-service/agent/newAgentPublish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(
          `Publish failed: ${res.status} ${res.statusText} ${
            txt ? "— " + txt : ""
          }`.trim()
        );
      }

      const data = await res.json().catch(() => ({} as any));
      const assistanceId =
        data.assistanceId || data.assistantId || data.id || "";

      const apiRoleUser = (data?.roleUser || "").trim();
      const apiOptionalRole = (data?.optionalRole || "").trim();
      const roleForUpload =
        apiOptionalRole ||
        apiRoleUser ||
        body.optionalRole ||
        body.roleUser ||
        "";

      message.success("Congratulations! Your agent is published successfully.");

      if (assistanceId) {
        localStorage.setItem(
          "awaitingUpload",
          JSON.stringify({ assistanceId, userId })
        );
        await promptUpload(assistanceId, userId, auth || {}, roleForUpload);
      }

      // Generic “has any Agent” flag (doesn't affect JOB flow logic now)
      try {
        localStorage.setItem("hasAiAgent", "true");
      } catch {
        // ignore
      }

      setPreviewOpen(false);
      message.success("All set! Files uploaded and agent queued for approval.");
      setIsBusinessCardUsed(false);
      setBusinessCardFile(null);
      setBusinessCardPreview("");
      setCardData(null);

      // 🔹 Check if we have a pending JobDetails context in localStorage
      let jobContext: {
        fromJobId: string;
        jobDesignation?: string;
        companyName?: string;
      } | null = null;

      try {
        const rawCtx = localStorage.getItem("agentJobContext");
        if (rawCtx) {
          jobContext = JSON.parse(rawCtx);
        }
      } catch {
        jobContext = null;
      }

      if (jobContext?.fromJobId) {
        // ✅ Clear context so next time is normal Agent flow
        try {
          localStorage.removeItem("agentJobContext");
        } catch {
          // ignore
        }

        // ⬅️ Go back to JobDetails and auto-open apply modal ONCE
        navigate("/main/jobdetails", {
          state: {
            id: jobContext.fromJobId,
            openApplyModal: true,
            jobDesignation: jobContext.jobDesignation,
            companyName: jobContext.companyName,
          },
        });
        return;
      }

      // 🧭 Default navigation (no job context → normal agent creation flow)
      navigate("/main/bharath-aistore/agents");
      
      // Don't throw error here, let the success modal handle the flow
    } catch (e: any) {
      console.error(e);
      throw e; // Re-throw to be caught by handlePublishConfirm
    }
  }, [
    agentName,
    previewDescription,
    roleSelect,
    purposeSelect,
    goalSelect,
    roleOther,
    purposeOther,
    goalOther,
    instructions,
    view,
    conStarter1,
    conStarter2,
    navigate,
  ]);

  const confirmPublish = useCallback(() => {
    if (description.trim().length < MIN_DESC) {
      Modal.error({
        title: "Description too short",
        content: `Please enter ${MIN_DESC}–${MAX_DESC} characters.`,
        okText: "OK",
      });
      return;
    }
    if (description.trim().length > MAX_DESC) {
      Modal.error({
        title: "Description too long",
        content: `Please keep it within ${MAX_DESC} characters.`,
        okText: "OK",
      });
      return;
    }

    if (!instructions.trim()) {
      message.error(
        "Please add instructions (Preview → Generate Instructions)."
      );
      return;
    }

    setPublishModalOpen(true);
  }, [
    description,
    instructions,
  ]);

  const handlePublishConfirm = async () => {
    setPublishModalOpen(false);
    setLoading(true);
    
    try {
      await publishNow();
      setLoading(false)
      setSuccessModalOpen(true);
    } catch (error: any) {
      setErrorMessage(error?.message || "Failed to publish agent. Please try again.");
      setErrorModalOpen(true);
      setLoading(false)
    } finally {
      setLoading(false);
    }
  };

  const handlePublishCancel = () => {
    setPublishModalOpen(false);
    setLoading(false);
  };

  const handleSuccessOk = () => {
    setSuccessModalOpen(false);
    // Clear all fields
    setAgentName("");
    setDescription("");
    setInstructions("");
    setConStarter1("");
    setConStarter2("");
    setRoleSelect("");
    setGoalSelect("");
    setPurposeSelect("");
    setRoleOther("");
    setGoalOther("");
    setPurposeOther("");
    setView("Private");
    setDescTouched(false);
    // Reload window
    window.location.reload();
  };

  const handleErrorOk = () => {
    setErrorModalOpen(false);
    setErrorMessage("");
  };

  const handleInstrCancel = () => {
    setEditModalOpen(false);
    // optional: reset the draft to the last saved version
    setEditDraft(instructions);
  };

  const handleInstrSave = () => {
    setInstructions(editDraft);
    setEditModalOpen(false);
    message.success("Instructions saved successfully.");
  };

  const openPreviewAndAutogen = useCallback(async () => {
    // start a new preview session
    previewSessionIdRef.current += 1;
    const sessionId = previewSessionIdRef.current;
    startersInFlightRef.current = false;
    startersSuccessOnceRef.current = false;

    setPreviewOpen(true);

    const needInstr = !instructions.trim();
    const needStarters = ![conStarter1, conStarter2].some((s) =>
      (s || "").trim()
    );

    if (!needInstr && !needStarters) return;

    setGenLoading(true);
    try {
      const tasks: Promise<any>[] = [];

      if (needInstr) {
        tasks.push(requestAndOpenEditor());
      }

      if (needStarters && !startersInFlightRef.current) {
        startersInFlightRef.current = true;
        tasks.push(
          (async () => {
            // if session changed meanwhile, abort silently
            const current = previewSessionIdRef.current;
            if (current !== sessionId) return;
            await suggestStartersFromAPI();
            startersInFlightRef.current = false;
          })()
        );
      }

      await Promise.allSettled(tasks);
    } finally {
      setGenLoading(false);
    }
  }, [
    instructions,
    conStarter1,
    conStarter2,
    requestAndOpenEditor,
    suggestStartersFromAPI,
  ]);

  const handlePublishClick = useCallback(() => {
    if (!canPreview) {
      message.error("Please complete all fields before publishing.");
      return;
    }
    openPreviewAndAutogen();
  }, [canPreview, openPreviewAndAutogen]);

  const gradientText = (text: string, i = 0) => (
    <span
      style={{
        fontSize: 18,
        fontWeight: 900,
        lineHeight: 1.5,
        backgroundImage: GRADIENTS[i % GRADIENTS.length],
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
        letterSpacing: -0.4,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );

  const labelColStyle: React.CSSProperties = {
    width: 110,
    flex: "0 0 110px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  };

  const otherInput = (
    value: string,
    onChange: (v: string) => void,
    placeholder: string
  ) => (
    <input
      value={value}
      onChange={(e) => {
        const v = e.target.value || "";
        if (v.length > 60) {
          message.error("Max 60 characters.");
          onChange(v.slice(0, 60));
        } else {
          if (v.length === 60)
            message.error("Please enter below 60 characters.");
          onChange(v);
        }
      }}
      placeholder={placeholder}
      maxLength={60}
      style={{
        marginTop: 8,
        width: "100%",
        height: 40,
        padding: "8px 12px",
        borderRadius: 10,
        border: `1px solid ${BORDER}`,
        outline: "none",
        background: "#FFF",
        fontSize: 14,
        boxShadow: "inset 0 1px 0 rgba(2,8,23,0.04)",
      }}
    />
  );

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh" }}>
      {!creationMode ? (
        <h3
          style={{
            margin: 0,
            padding: "20px",
            fontSize: 24,
            fontWeight: 900,
            color: "#0F172A",
            textAlign: "center",
          }}
        >
          Create Your AI Agent
        </h3>
      ) : (
        <div
          style={{
            width: "calc(100% - 40px)",
            maxWidth: 480,
            margin: "20px auto 14px",
            padding: "20px 24px",
            borderRadius: 20,
            background:
              "linear-gradient(180deg, #FFFFFF 0%, #F8F8FF 50%, #FAF5FF 100%)",
            boxShadow:
              "0 6px 18px rgba(109,40,217,0.08), 0 2px 8px rgba(17,24,39,0.04)",
            border: "1px solid #E7E6F3",
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                flexShrink: 0,
                boxShadow: "0 4px 10px rgba(109,40,217,0.25)",
              }}
            >
              {creationMode === "Professional" ? "👤" : "💼"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2
                style={{
                  margin: "0 0 6px 0",
                  fontSize: 20,
                  fontWeight: 900,
                  color: "#0F172A",
                  lineHeight: 1.2,
                }}
              >
                {creationMode === "Professional"
                  ? "Role-based AI Agent"
                  : "Card-based AI Agent"}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#64748B",
                  lineHeight: 1.5,
                }}
              >
                {creationMode === "Professional"
                  ? "Choose a role (Student, CEO, Lawyer, etc.). We auto-apply tone, goals, and defaults for that persona."
                  : "Upload your business card. AI extracts details and creates your agent instantly."}
              </p>
            </div>
          </div>

          {/* Footer Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 10,
              paddingTop: 12,
              borderTop: "1px solid #E7E6F3",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #6D28D9, #A78BFA, #F59E0B)",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 999,
                  boxShadow: "0 2px 6px rgba(109,40,217,0.25)",
                }}
              >
                AI Powered
              </span>
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #FCD34D 0%, #FBBF24 100%)",
                  color: "#3B0764",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 999,
                  boxShadow: "0 2px 6px rgba(192,132,252,0.25)",
                }}
              >
                Fastest
              </span>
            </div>
            <span
              onClick={() =>
                setCreationMode(
                  creationMode === "Professional" ? "CardBased" : "Professional"
                )
              }
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#6D28D9",
                cursor: "pointer",
                textDecoration: "underline",
                whiteSpace: "nowrap",
              }}
            >
              Switch to{" "}
              {creationMode === "Professional" ? "Card Based" : "Role Based"}
            </span>
          </div>
        </div>
      )}

      {/* Two Card Selection */}
      {!creationMode && (
        <div
          style={{
            width: "calc(100% - 40px)",
            maxWidth: 700,
            margin: "0 auto",
            padding: "0 20px 40px",
          }}
        >
          <p
            style={{
              fontSize: 16,
              color: "#475569",
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            Choose how to create your agent:
          </p>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}
          >
            <div
              onClick={() => setCreationMode("Professional")}
              style={{
                padding: "32px 24px",
                borderRadius: 16,
                border: "2px solid #E7E6F3",
                background: "linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(109,40,217,0.15)";
                e.currentTarget.style.borderColor = "#6D28D9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
                e.currentTarget.style.borderColor = "#E7E6F3";
              }}
            >
              <img
                src={SRJImage}
                alt="Role Based"
                style={{
                  width: "100%",
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 12,
                  marginBottom: 16,
                }}
              />
              <h3
                style={{
                  margin: "0 0 8px 0",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#0F172A",
                  textAlign: "center",
                }}
              >
                Role Based
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: "#64748B",
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                Select your role and create a customized AI agent
              </p>
            </div>
            <div
              onClick={() => setCreationMode("CardBased")}
              style={{
                padding: "32px 24px",
                borderRadius: 16,
                border: "2px solid #E7E6F3",
                background: "linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(109,40,217,0.15)";
                e.currentTarget.style.borderColor = "#6D28D9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
                e.currentTarget.style.borderColor = "#E7E6F3";
              }}
            >
              <img
                src={CardBased}
                alt="Card Based"
                style={{
                  width: "100%",
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 12,
                  marginBottom: 16,
                }}
              />
              <h3
                style={{
                  margin: "0 0 8px 0",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#0F172A",
                  textAlign: "center",
                }}
              >
                Card Based
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: "#64748B",
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                Upload your business card and let AI do the work
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form sections */}
      {(creationMode === "Professional" || creationMode === "CardBased") && (
        <div
          style={{
            width: "calc(100% - 40px)",
            maxWidth: 480,
            margin: "0 auto",
            padding: "0 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 20,
              alignItems: "flex-start",
              flexWrap: isMobile ? "wrap" : "nowrap",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                flex: 1,
                maxWidth: 900,
                margin: "0 auto",
                paddingBottom: 20,
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {/* <div style={{ padding: 16, borderRadius: 16, background: "#FFFFFF", boxShadow: "0 6px 18px rgba(109,40,217,0.08)", border: `1px solid ${BORDER}` }}>
        <div style={{ marginBottom: 10 }}>
          <h3 style={{ margin: "0 0 6px 0", fontSize: 15, fontWeight: 800, color: "#0F172A" }}>🌍 Select Your Country</h3>
          <p style={{ margin: 0, fontSize: 12, color: TEXT_MUTED }}>Select your country to personalise your AI Agent.</p>
        </div>
        <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${BORDER}`, background: "#FFF", fontSize: 14, fontWeight: 600, color: "#0F172A", cursor: "pointer", outline: "none" }}>
          <option value="India">India</option>
          <option value="United States">United States</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Canada">Canada</option>
          <option value="Australia">Australia</option>
          <option value="Germany">Germany</option>
          <option value="France">France</option>
          <option value="Japan">Japan</option>
          <option value="China">China</option>
          <option value="Brazil">Brazil</option>
          <option value="South Africa">South Africa</option>
          <option value="Singapore">Singapore</option>
          <option value="UAE">UAE</option>
          <option value="Other">Other</option>
        </select>
      </div> */}

                {creationMode === "CardBased" && (
                  <div
                    style={{
                      padding: 0,
                      borderRadius: 24,
                      background:
                        "linear-gradient(145deg, #FFFFFF 0%, #FFF9F0 100%)",
                      boxShadow:
                        "0 20px 50px rgba(245,158,11,0.15), 0 10px 30px rgba(0,0,0,0.08)",
                      border: "2px solid #FFE4B5",
                      overflow: "hidden",
                    }}
                  >
                    {/* HEADER WITH GRADIENT */}
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #F59E0B 0%, #FCD34D 50%, #FBBF24 100%)",
                        padding: "18px 16px",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {/* Decorative Background Pattern */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          opacity: 0.1,
                          background:
                            "radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 50%, white 0%, transparent 50%)",
                        }}
                      />

                      {/* Title Section */}
                      <div style={{ position: "relative", zIndex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            marginBottom: 16,
                          }}
                        >
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 16,
                              background: "rgba(255, 255, 255, 0.3)",
                              backdropFilter: "blur(10px)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 20,
                              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                            }}
                          >
                            💼
                          </div>

                          <div>
                            <h5
                              style={{
                                margin: 0,
                                fontSize: 20,
                                fontWeight: 900,
                                color: "#78350F",
                                lineHeight: 1.2,
                                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                              }}
                            >
                              Business Card Upload
                            </h5>
                            <p
                              style={{
                                margin: "4px 0 0 0",
                                fontSize: 13,
                                color: "#92400E",
                                fontWeight: 600,
                              }}
                            >
                              AI-Powered Agent Creation
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CONTENT SECTION */}
                    <div style={{ padding: "20px 17px" }}>
                      {/* Description Text */}
                      <p
                        style={{
                          margin: "0 0 15px 0",
                          fontSize: 15,
                          color: "#57534E",
                          lineHeight: 1.4,
                          textAlign: "center",
                          fontWeight: 500,
                        }}
                      >
                        Upload your{" "}
                        <strong style={{ color: "#EA580C", fontWeight: 700 }}>
                          Business Card
                        </strong>{" "}
                        and let AI extract all details to create your
                        personalized agent instantly.{" "}
                        <strong style={{ color: "#DC2626" }}>
                          Upload is mandatory to proceed.
                        </strong>
                      </p>

                      {/* Upload Area */}
                      <div style={{ padding: "14px" }}>
                        <div
                          onClick={handleBusinessCardFileSelect}
                          style={{
                            border: businessCardFile
                              ? "2px solid #10B981"
                              : "2px dashed #FCD34D",
                            borderRadius: 12,
                            padding: businessCardFile ? "12px" : "16px",
                            textAlign: "center",
                            cursor: "pointer",
                            background: businessCardFile
                              ? "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)"
                              : "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
                            transition: "all 0.3s ease",
                          }}
                        >
                          {businessCardFile ? (
                            <div>
                              {businessCardPreview && (
                                <img
                                  src={businessCardPreview}
                                  alt="Preview"
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: 120,
                                    borderRadius: 8,
                                    objectFit: "contain",
                                    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                                    marginBottom: 8,
                                  }}
                                />
                              )}
                              <div
                                style={{
                                  fontWeight: 700,
                                  color: "#10B981",
                                  fontSize: 12,
                                  marginBottom: 3,
                                }}
                              >
                                ✓ {businessCardFile.name.slice(0, 20)}...
                              </div>
                              <div style={{ fontSize: 10, color: "#059669" }}>
                                Click to change
                              </div>
                            </div>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "12px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 36,
                                  filter:
                                    "drop-shadow(0 2px 4px rgba(245,158,11,0.25))",
                                }}
                              >
                                📤
                              </div>
                              <div style={{ textAlign: "left" }}>
                                <div
                                  style={{
                                    fontWeight: 800,
                                    color: "#92400E",
                                    fontSize: 14,
                                    marginBottom: 4,
                                  }}
                                >
                                  Upload Card
                                </div>
                                <div
                                  style={{
                                    fontSize: 10,
                                    color: "#78350F",
                                    background: "rgba(255,255,255,0.7)",
                                    padding: "3px 10px",
                                    borderRadius: 16,
                                    display: "inline-block",
                                  }}
                                >
                                  JPG, PNG, PDF
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        {businessCardFile && (
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              marginTop: 10,
                            }}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setBusinessCardFile(null);
                                setBusinessCardPreview("");
                              }}
                              style={{
                                flex: 1,
                                padding: "8px",
                                borderRadius: 8,
                                border: "2px solid #FCA5A5",
                                background: "#fff",
                                color: "#DC2626",
                                fontWeight: 700,
                                fontSize: 11,
                                cursor: "pointer",
                              }}
                            >
                              ✕ Remove
                            </button>

                            <button
                              onClick={handleBusinessCardUpload}
                              disabled={businessCardUploading}
                              style={{
                                flex: 3,
                                padding: "8px",
                                borderRadius: 8,
                                border: "none",
                                background:
                                  "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
                                color: "#78350F",
                                fontWeight: 800,
                                fontSize: 11,
                                cursor: businessCardUploading
                                  ? "not-allowed"
                                  : "pointer",
                                opacity: businessCardUploading ? 0.7 : 1,
                                boxShadow: "0 3px 12px rgba(245,158,11,0.3)",
                              }}
                            >
                              {businessCardUploading
                                ? "⏳ Processing..."
                                : "⚡ Extract & Create Agent"}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Info Badge */}
                      <div
                        style={{
                          marginTop: 10,
                          textAlign: "center",
                          fontSize: 13,
                          color: "#78350F",
                        }}
                      >
                        <strong style={{ fontWeight: 700 }}>💡 Pro Tip:</strong>{" "}
                        Use a clear, well-lit image for best results
                      </div>
                    </div>

                    {/* FOOTER BADGES */}
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
                        padding: "16px 20px",
                        borderTop: "2px solid #FDE68A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          background:
                            "linear-gradient(135deg, #F59E0B, #FBBF24)",
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: 800,
                          padding: "6px 16px",
                          borderRadius: 999,
                          boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        🤖 AI Powered
                      </span>
                      <span
                        style={{
                          background:
                            "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: 800,
                          padding: "6px 16px",
                          borderRadius: 999,
                          boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        ⚡ Instant
                      </span>
                      <span
                        style={{
                          background:
                            "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: 800,
                          padding: "6px 16px",
                          borderRadius: 999,
                          boxShadow: "0 4px 12px rgba(139,92,246,0.3)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        🎯 Accurate
                      </span>
                    </div>
                  </div>
                )}

                <div style={{ ...card3D, padding: 12 }}>
                  <div style={{ display: "grid", gap: 10 }}>
                    {/* Row 1 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        minHeight: 44,
                      }}
                    >
                      <div style={labelColStyle}>{gradientText("I am", 0)}</div>
                      <div style={{ flex: 1 }}>
                        <CompactSelect
                          value={roleSelect}
                          onChange={setRoleSelect}
                          options={ROLE_OPTS}
                          placeholder="Select your role"
                          loading={nameLoading}
                        />
                        {roleSelect === "Other" &&
                          otherInput(
                            roleOther,
                            setRoleOther,
                            "Type your role…"
                          )}
                      </div>
                      <Tooltip title="Examples: Student, Founder, Developer, Marketer, Lawyer">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          focusable="false"
                          style={{ cursor: "pointer", verticalAlign: "middle" }}
                        >
                          <defs>
                            <linearGradient
                              id="grad-info"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#6D28D9" />
                              <stop offset="50%" stopColor="#A78BFA" />
                              <stop offset="100%" stopColor="#F59E0B" />
                            </linearGradient>
                          </defs>

                          <circle
                            cx="12"
                            cy="12"
                            r="11"
                            stroke="url(#grad-info)"
                            strokeWidth="2"
                            fill="none"
                          />
                          <circle
                            cx="12"
                            cy="8"
                            r="1.2"
                            fill="url(#grad-info)"
                          />
                          <rect
                            x="11"
                            y="10"
                            width="2"
                            height="8"
                            rx="1"
                            fill="url(#grad-info)"
                          />
                        </svg>
                      </Tooltip>
                    </div>

                    {/* Row 2 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        minHeight: 44,
                      }}
                    >
                      <div style={labelColStyle}>
                        {gradientText("Looking for", 1)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          onClick={() => {
                            if (!roleSelect.trim()) {
                              message.error("Please select Role first.");
                            }
                          }}
                        >
                          <CompactSelect
                            value={goalSelect}
                            onChange={setGoalSelect}
                            options={goalOptions}
                            placeholder="Select Goal"
                            loading={goalLoading}
                          />
                        </div>
                        {goalSelect === "Other" &&
                          otherInput(
                            goalOther,
                            setGoalOther,
                            "Type your goal…"
                          )}
                      </div>
                      <Tooltip title="Learn skills, Raise funding, Get a job, Grow sales, Legal help">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          focusable="false"
                          style={{ cursor: "pointer", verticalAlign: "middle" }}
                        >
                          <defs>
                            <linearGradient
                              id="grad-info"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#6D28D9" />
                              <stop offset="50%" stopColor="#A78BFA" />
                              <stop offset="100%" stopColor="#F59E0B" />
                            </linearGradient>
                          </defs>

                          <circle
                            cx="12"
                            cy="12"
                            r="11"
                            stroke="url(#grad-info)"
                            strokeWidth="2"
                            fill="none"
                          />
                          <circle
                            cx="12"
                            cy="8"
                            r="1.2"
                            fill="url(#grad-info)"
                          />
                          <rect
                            x="11"
                            y="10"
                            width="2"
                            height="8"
                            rx="1"
                            fill="url(#grad-info)"
                          />
                        </svg>
                      </Tooltip>
                    </div>

                    {/* Row 3 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        minHeight: 44,
                      }}
                    >
                      <div style={labelColStyle}>{gradientText("To", 2)}</div>
                      <div style={{ flex: 1 }}>
                        <div
                          onClick={() => {
                            if (!roleSelect.trim()) {
                              message.error("Please select Role first.");
                            } else if (!goalSelect.trim()) {
                              message.error("Please select Goal first.");
                            }
                          }}
                        >
                          <CompactSelect
                            value={purposeSelect}
                            onChange={setPurposeSelect}
                            options={purposeOptions}
                            placeholder="Select Purpose"
                            loading={purposeLoading}
                          />
                        </div>

                        {purposeSelect === "Other" &&
                          otherInput(
                            purposeOther,
                            setPurposeOther,
                            "Type your purpose…"
                          )}
                      </div>
                      <Tooltip title="Build agent, automate support, file a case, launch MVP">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          focusable="false"
                          style={{ cursor: "pointer", verticalAlign: "middle" }}
                        >
                          <defs>
                            <linearGradient
                              id="grad-info"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#6D28D9" />
                              <stop offset="50%" stopColor="#A78BFA" />
                              <stop offset="100%" stopColor="#F59E0B" />
                            </linearGradient>
                          </defs>

                          <circle
                            cx="12"
                            cy="12"
                            r="11"
                            stroke="url(#grad-info)"
                            strokeWidth="2"
                            fill="none"
                          />
                          <circle
                            cx="12"
                            cy="8"
                            r="1.2"
                            fill="url(#grad-info)"
                          />
                          <rect
                            x="11"
                            y="10"
                            width="2"
                            height="8"
                            rx="1"
                            fill="url(#grad-info)"
                          />
                        </svg>
                      </Tooltip>
                    </div>
                  </div>
                </div>

                {/* ======= Creator Name (same style as Agent Name) ======= */}
                <div style={{ marginTop: 14, ...card3D }}>
                  <div style={sectionHeader(0)}>
                    <h3 style={headingText(0)}>Creator Name</h3>
                    <div
                      style={{
                        fontSize: 12,
                        color: TEXT_MUTED,
                        marginTop: 4,
                      }}
                    >
                      Max <b>25 characters</b>.
                    </div>
                  </div>

                  <div style={bodyPad}>
                    <input
                      ref={creatorNameRef}
                      type="text"
                      value={agentUserName}
                      onChange={(e) => {
                        let v = e.target.value;

                        // ❌ Remove special characters (letters + spaces only)
                        v = v.replace(/[^A-Za-z ]+/g, "");

                        // ❌ Limit to 25 chars
                        v = v.slice(0, 25);

                        setAgentUserName(v);
                      }}
                      placeholder="Enter your full name (Creator Name)"
                      maxLength={25}
                      style={{
                        width: "100%",
                        height: 42,
                        padding: "10px 12px",
                        borderRadius: 12,
                        border: `1px solid ${
                          !agentUserName.trim() && creatorNameNudge
                            ? "#F97316"
                            : BORDER
                        }`,
                        background: "#FFF",
                        fontSize: 14,
                        fontWeight: 600,
                        boxShadow:
                          !agentUserName.trim() && creatorNameNudge
                            ? "0 0 0 1px rgba(249,115,22,0.35)"
                            : "inset 0 1px 0 rgba(2,8,23,0.04)",
                        transition:
                          "box-shadow 0.2s ease, border-color 0.2s ease",
                      }}
                    />

                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 11,
                        color: TEXT_MUTED,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {/* <span>
                        Creator Name will be used in AI suggested Agent Name.
                      </span> */}
                      <span>{agentUserName.length}/25</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 14, ...card3D }}>
                  <div style={sectionHeader(0)}>
                    <h3 style={headingText(0)}>Agent Name</h3>
                    <div
                      style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 6 }}
                    >
                      Min 3 – 80 characters
                    </div>
                    <button
                      onClick={suggestAgentName}
                      disabled={
                        nameLoading ||
                        !roleResolved ||
                        !goalResolved ||
                        !purposeResolved ||
                        !agentUserName.trim()
                      }
                      style={{
                        width: 140,
                        padding: isMobile ? "6px 10px" : "8px 12px",
                        borderRadius: 999,
                        border: `1px solid ${BORDER}`,
                        background: "#fff",
                        color: "#0F172A",
                        fontWeight: 800,
                        fontSize: isMobile ? 11 : 12,
                        cursor:
                          nameLoading ||
                          !roleResolved ||
                          !goalResolved ||
                          !purposeResolved
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          nameLoading ||
                          !roleResolved ||
                          !goalResolved ||
                          !purposeResolved
                            ? 0.6
                            : 1,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        whiteSpace: "nowrap",
                      }}
                      title={
                        !agentUserName.trim()
                          ? "Add your Creator Name and save profile first"
                          : !roleResolved || !goalResolved || !purposeResolved
                          ? "Pick Role, Goal & Purpose first"
                          : undefined
                      }
                    >
                      {nameLoading ? <Spin size="small" /> : <BulbOutlined />}
                      <span>AI Suggested</span>
                    </button>
                  </div>
                  <div style={bodyPad}>
                    <input
                      value={agentName}
                      onChange={(e) => {
                        const v = e.target.value || "";
                        if (v.length === 80) {
                          Modal.warning({
                            title: "Limit reached",
                            content:
                              "Please enter the agent name within 80 characters.",
                            okText: "OK",
                          });
                        }
                        setAgentName(v);
                      }}
                      maxLength={80}
                      placeholder={
                        nameLoading && !agentName
                          ? "Generating agent name…"
                          : "Enter Your Agent Name"
                      }
                      style={{
                        width: "100%",
                        height: 44,
                        padding: "10px 12px",
                        borderRadius: 12,
                        border: `1px solid ${
                          (agentName?.length || 0) >= 80 ? "#DC2626" : BORDER
                        }`,
                        outline: "none",
                        background: "#FFF",
                        fontSize: 15,
                        fontWeight: 600,
                        lineHeight: "22px",
                        boxShadow: "inset 0 1px 0 rgba(2,8,23,0.04)",
                      }}
                    />
                  </div>
                </div>

                <div ref={scrollRef}></div>

                <div style={{ marginTop: 14, ...card3D }}>
                  <div style={sectionHeader(1)}>
                    <h3 style={headingText(1)}>Agent Description</h3>
                    <button
                      onClick={suggestAgentDescription}
                      disabled={
                        descSuggestLoading ||
                        !roleResolved ||
                        !goalResolved ||
                        !purposeResolved
                      }
                      style={{
                        width: 140,
                        padding: isMobile ? "6px 10px" : "8px 12px",
                        borderRadius: 999,
                        border: `1px solid ${BORDER}`,
                        background: "#fff",
                        color: "#0F172A",
                        fontWeight: 800,
                        fontSize: isMobile ? 11 : 12,
                        cursor:
                          descSuggestLoading ||
                          !roleResolved ||
                          !goalResolved ||
                          !purposeResolved
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          descSuggestLoading ||
                          !roleResolved ||
                          !goalResolved ||
                          !purposeResolved
                            ? 0.7
                            : 1,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {descSuggestLoading ? (
                        <Spin size="small" />
                      ) : (
                        <BulbOutlined />
                      )}
                      <span>AI Suggested</span>
                    </button>
                  </div>
                  <div style={bodyPad}>
                    <textarea
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        // as user types, keep the field "touched" once they've left it once
                        if (
                          descTouched &&
                          e.target.value.trim().length >= MIN_DESC
                        ) {
                          // clear any inline error automatically when they fix it
                          // (no extra state needed; the condition below will stop rendering the error)
                        }
                      }}
                      onBlur={() => {
                        setDescTouched(true);
                        if (descCount < MIN_DESC) {
                          message.error(
                            `Description must be at least ${MIN_DESC} characters.`
                          );
                        }
                      }}
                      maxLength={MAX_DESC}
                      placeholder="Tell what this agent does in your own words…"
                      style={{
                        width: "100%",
                        minHeight: 120,
                        padding: 12,
                        borderRadius: 12,
                        border: `1px solid ${
                          descTouched && descCount < MIN_DESC
                            ? "#DC2626"
                            : BORDER
                        }`,
                        outline: "none",
                        background: "#FFF",
                        fontSize: 14,
                        lineHeight: 1.5,
                        resize: "vertical",
                        fontFamily: "inherit",
                        boxShadow: "inset 0 1px 0 rgba(2,8,23,0.04)",
                      }}
                    />

                    {/* Inline helper + counter */}
                    <div
                      style={{
                        fontSize: 12,
                        marginTop: 6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          color:
                            descTouched && descCount < MIN_DESC
                              ? "#DC2626"
                              : TEXT_MUTED,
                        }}
                      >
                        {descTouched && descCount < MIN_DESC
                          ? `Minimum ${MIN_DESC} characters required.`
                          : `Keep it between ${MIN_DESC}–${MAX_DESC} characters.`}
                      </span>
                      <span
                        style={{
                          fontWeight: 800,
                          color:
                            descTouched && descCount < MIN_DESC
                              ? "#DC2626" // red when invalid
                              : descCount > MAX_DESC - 20
                              ? "#F59E0B" // warm warning near max
                              : "#0EA5E9", // normal
                        }}
                      >
                        {descCount}/{MAX_DESC}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 14, ...card3D, padding: "10px 16px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <h3
                      style={{
                        ...headingText(2),
                        fontSize: 16,
                        margin: 0,
                        whiteSpace: "nowrap",
                        paddingBottom: 4,
                      }}
                    >
                      Visibility
                    </h3>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: 10,
                        flexWrap: "wrap",
                        flex: "1 1 260px",
                        minWidth: 220,
                      }}
                    >
                      <button
                        onClick={() => setView("Private")}
                        style={{
                          flex: "1 1 130px",
                          minWidth: 120,
                          padding: "10px 18px",
                          borderRadius: 999,
                          border:
                            view === "Private"
                              ? "2px solid transparent"
                              : `1px solid ${BORDER}`,
                          background:
                            view === "Private"
                              ? "linear-gradient(white, white), linear-gradient(135deg, #6D28D9 0%, #A78BFA 60%, #F59E0B 120%)"
                              : "#FFFFFF",
                          backgroundOrigin:
                            view === "Private" ? "border-box" : undefined,
                          backgroundClip:
                            view === "Private"
                              ? "padding-box, border-box"
                              : undefined,
                          color: view === "Private" ? "#0F172A" : "#111827",
                          fontWeight: 800,
                          fontSize: 14,
                          lineHeight: 1.4,
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                          transition: "all 0.25s ease",
                          boxShadow:
                            view === "Private"
                              ? "0 0 12px rgba(109,40,217,0.18)"
                              : "0 0 4px rgba(0,0,0,0.04)",
                        }}
                      >
                        Personal
                      </button>

                      <button
                        onClick={() => setView("Public")}
                        style={{
                          flex: "1 1 130px",
                          minWidth: 120,
                          padding: "10px 18px",
                          borderRadius: 999,
                          border:
                            view === "Public"
                              ? "2px solid transparent"
                              : `1px solid ${BORDER}`,
                          background:
                            view === "Public"
                              ? "linear-gradient(white, white), linear-gradient(135deg, #6D28D9 0%, #A78BFA 60%, #F59E0B 120%)"
                              : "#FFFFFF",
                          backgroundOrigin:
                            view === "Public" ? "border-box" : undefined,
                          backgroundClip:
                            view === "Public"
                              ? "padding-box, border-box"
                              : undefined,
                          color: view === "Public" ? "#0F172A" : "#111827",
                          fontWeight: 800,
                          fontSize: 14,
                          lineHeight: 1.4,
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                          transition: "all 0.25s ease",
                          boxShadow:
                            view === "Public"
                              ? "0 0 12px rgba(109,40,217,0.18)"
                              : "0 0 4px rgba(0,0,0,0.04)",
                        }}
                      >
                        Public
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 20,
                    flexWrap: "nowrap",
                    overflow: "visible",
                    padding: "10px 2px 20px",
                  }}
                >
                  {/* Preview Button */}
                  <button
                    onClick={openPreviewAndAutogen}
                    disabled={!canPreview}
                    style={{
                      padding: "10px 24px",
                      borderRadius: 999,
                      border: `1px solid ${BORDER}`,
                      background: "#FFFFFF",
                      color: "#475569",
                      fontWeight: 800,
                      fontSize: 15,
                      cursor: canPreview ? "pointer" : "not-allowed",
                      opacity: canPreview ? 1 : 0.6,
                      whiteSpace: "nowrap",
                      boxShadow:
                        "0 2px 6px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.06)",
                      transition: "transform .12s ease, box-shadow .2s ease",
                    }}
                    onMouseDown={(e) =>
                      (e.currentTarget.style.transform = "scale(0.97)")
                    }
                    onMouseUp={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    Preview
                  </button>

                  {/* Publish Button */}
                  <button
                    onClick={handlePublishClick}
                    disabled={loading}
                    style={{
                      padding: "10px 28px",
                      borderRadius: 999,
                      border: "none",
                      background:
                        "linear-gradient(90deg, #6D28D9 0%, #2563EB 50%, #FF00FF 100%)",
                      color: "#FFFFFF",
                      fontWeight: 900,
                      fontSize: 15,
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.85 : 1,
                      whiteSpace: "nowrap",
                      // softer, evenly spread glow that won't be cut off
                      boxShadow:
                        "0 4px 12px rgba(109,40,217,0.25), 0 10px 28px rgba(37,99,235,0.25)",
                      transition: "transform .1s ease, box-shadow .15s ease",
                    }}
                    onMouseDown={(e) =>
                      (e.currentTarget.style.transform = "scale(0.96)")
                    }
                    onMouseUp={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    {loading ? "Publishing…" : "Publish"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Drawer
        placement={isMobile ? "bottom" : "right"}
        width={isMobile ? undefined : Math.min(560, window.innerWidth * 0.9)}
        height={isMobile ? Math.min(0.96 * window.innerHeight, 720) : undefined}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <EyeOutlined />
            Agent Preview
          </div>
        }
        onClose={() => setPreviewOpen(false)}
        open={previewOpen}
        destroyOnClose={false}
        styles={{
          body: { padding: "20px 24px" },
          header: {
            borderBottom: `1px solid ${BORDER}`,
            padding: "16px 24px",
          },
          footer: { overflow: "visible" },
        }}
        extra={
          <button
            onClick={() => setEditModalOpen(true)}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: `1px solid ${BORDER}`,
              background: "#fff",
              color: "#0F172A",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
            }}
          >
            <EditOutlined />
            Edit Instructions
          </button>
        }
        footer={
          <div
            style={{
              // grid makes 2 neat rows on mobile, single row on desktop
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
              alignItems: "center",
              gap: 10,
              overflow: "visible", // ensures glow not clipped
              paddingBottom: 4,
            }}
          >
            <div
              style={{
                color: TEXT_MUTED,
                fontSize: 13,
              }}
            >
              Review your agent details before publishing
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                width: isMobile ? "100%" : undefined,
                justifyContent: isMobile ? "space-between" : "flex-end",
              }}
            >
              {/* Close Preview Button */}
              <button
                onClick={() => setPreviewOpen(false)}
                style={{
                  flex: isMobile ? "1 1 calc(50% - 6px)" : "0 0 auto",
                  padding: "10px 18px",
                  borderRadius: 999,
                  border: `1px solid ${BORDER}`,
                  background: "#FFFFFF",
                  color: "#475569",
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  boxShadow:
                    "0 2px 6px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.06)",
                  transition: "transform .12s ease, box-shadow .15s ease",
                }}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.97)")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                Close Preview
              </button>

              {/* Publish Button (Updated gradient + glow) */}
              <button
                onClick={confirmPublish}
                disabled={!canPublish || loading}
                style={{
                  flex: isMobile ? "1 1 calc(50% - 6px)" : "0 0 auto",
                  padding: "10px 22px",
                  borderRadius: 999,
                  border: "none",
                  background:
                    "linear-gradient(90deg, #6D28D9 0%, #2563EB 50%, #FF00FF 100%)",
                  color: "#FFFFFF",
                  fontWeight: 900,
                  fontSize: 15,
                  cursor: canPublish ? "pointer" : "not-allowed",
                  opacity: canPublish ? (loading ? 0.85 : 1) : 0.6,
                  whiteSpace: "nowrap",
                  boxShadow:
                    "0 4px 12px rgba(37,99,235,0.35), 0 8px 25px rgba(109,40,217,0.3)",
                  transition: "transform .1s ease, box-shadow .15s ease",
                }}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.96)")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {loading ? (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Spin size="small" />
                    Publishing…
                  </div>
                ) : (
                  "Publish"
                )}
              </button>
            </div>
          </div>
        }
      >
        {/* Preview content */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#111827",
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              {agentName || "Untitled Agent"}
            </h2>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Tag
                color="blue"
                icon={<UserOutlined />}
                style={{ borderRadius: 6, fontWeight: 500 }}
              >
                {roleResolved || "—"}
              </Tag>
              <Tag
                color="purple"
                icon={<AimOutlined />}
                style={{ borderRadius: 6, fontWeight: 500 }}
              >
                {goalResolved || "—"}
              </Tag>
              <Tag
                color="green"
                icon={<RocketOutlined />}
                style={{ borderRadius: 6, fontWeight: 500 }}
              >
                {purposeResolved || "—"}
              </Tag>
              <Tag
                color={view === "Public" ? "geekblue" : "default"}
                icon={view === "Public" ? <GlobalOutlined /> : <LockOutlined />}
                style={{ borderRadius: 6, fontWeight: 500 }}
              >
                {view === "Public" ? "Public" : "Private"}
              </Tag>
            </div>
          </div>

          <div
            style={{
              background: "#F8FAFC",
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              padding: 14,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                marginBottom: 6,
                color: "#0F172A",
                fontSize: 14,
              }}
            >
              Description
            </div>
            <div style={{ color: "#334155", lineHeight: 1.6, fontSize: 15 }}>
              {previewDescription}
            </div>
          </div>
        </div>

        {/* ======= Conversation Starters ======= */}
        <div
          style={{
            marginBottom: 20,
            background: "#fff",
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            padding: 14,
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            <h3
              style={{
                margin: 0,
                color: "#0F172A",
                fontSize: 18,
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              Conversation Starters
            </h3>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {!startersEdit ? (
                <>
                  <button
                    onClick={startEditStarters}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: `1px solid ${BORDER}`,
                      background: "#fff",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={suggestStartersFromAPI}
                    disabled={startersLoading}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 999,
                      border: "2px solid transparent",
                      background:
                        "linear-gradient(white, white), linear-gradient(135deg, #6D28D9 0%, #A78BFA 60%, #F59E0B 120%)",
                      backgroundOrigin: "border-box",
                      backgroundClip: "padding-box, border-box",
                      color: "#0F172A",
                      fontWeight: 800,
                      fontSize: 13,
                      cursor: startersLoading ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      whiteSpace: "nowrap",
                      boxShadow: "0 0 10px rgba(109,40,217,0.20)",
                      opacity: startersLoading ? 0.7 : 1,
                    }}
                    title="Regenerate starters with AI"
                  >
                    {startersLoading ? "Generating…" : "Regenerate"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={saveStarters}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: `1px solid ${BORDER}`,
                      background: "#fff",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={closeStarters}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: `1px solid ${BORDER}`,
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Body */}
          {!startersEdit ? (
            // View mode
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                gap: 12,
              }}
            >
              {[1, 2].map((i) => {
                const val = i === 1 ? conStarter1 : conStarter2;
                return (
                  <div
                    key={i}
                    style={{
                      background: "#F8FAFC",
                      border: `1px solid ${BORDER}`,
                      borderRadius: 10,
                      padding: "10px 12px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#0F172A",
                        marginBottom: 6,
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Starter {i}</span>
                      <Tooltip title="These are the conversations auto-generated for users to start with. You can edit them anytime.">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          focusable="false"
                          style={{
                            cursor: "default",
                            verticalAlign: "middle",
                          }}
                        >
                          <defs>
                            <linearGradient
                              id="grad-info"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#6D28D9" />
                              <stop offset="50%" stopColor="#A78BFA" />
                              <stop offset="100%" stopColor="#F59E0B" />
                            </linearGradient>
                          </defs>
                          <circle
                            cx="12"
                            cy="12"
                            r="11"
                            stroke="url(#grad-info)"
                            strokeWidth="2"
                            fill="none"
                          />
                          <circle
                            cx="12"
                            cy="8"
                            r="1.2"
                            fill="url(#grad-info)"
                          />
                          <rect
                            x="11"
                            y="10"
                            width="2"
                            height="8"
                            rx="1"
                            fill="url(#grad-info)"
                          />
                        </svg>
                      </Tooltip>
                    </div>

                    <div style={{ color: "#0F172A" }}>
                      {val || <i style={{ color: TEXT_MUTED }}>Starter {i}</i>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Edit mode
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                gap: 12,
              }}
            >
              {[1, 2].map((i) => {
                const draft = i === 1 ? cs1Draft : cs2Draft;
                const setDraft = i === 1 ? setCs1Draft : setCs2Draft;
                const count = (draft || "").length;
                return (
                  <div
                    key={i}
                    style={{
                      background: "#F8FAFC",
                      border: `1px solid ${BORDER}`,
                      borderRadius: 10,
                      padding: "10px 12px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#0F172A",
                        marginBottom: 6,
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Starter {i}</span>
                      <span
                        style={{
                          fontSize: 12,
                          color: count > 150 ? "#DC2626" : "#64748B",
                        }}
                      >
                        {count}/150
                      </span>
                    </div>

                    <input
                      type="text"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value.slice(0, 150))}
                      maxLength={150}
                      placeholder='e.g., "How can I assist you today?"'
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: `1px solid ${BORDER}`,
                        outline: "none",
                        fontSize: 14,
                        background: "#fff",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ======= Instructions ======= */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h3
                style={{
                  margin: 0,
                  color: "#0F172A",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                Instructions
              </h3>
              <Tooltip title="We auto-generate instructions based on your description. You can edit them to refine behavior.">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                  style={{ cursor: "pointer", verticalAlign: "middle" }}
                >
                  <defs>
                    <linearGradient
                      id="grad-info"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#6D28D9" />
                      <stop offset="50%" stopColor="#A78BFA" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                  </defs>

                  <circle
                    cx="12"
                    cy="12"
                    r="11"
                    stroke="url(#grad-info)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="12" cy="8" r="1.2" fill="url(#grad-info)" />
                  <rect
                    x="11"
                    y="10"
                    width="2"
                    height="8"
                    rx="1"
                    fill="url(#grad-info)"
                  />
                </svg>
              </Tooltip>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                background:
                  "linear-gradient(90deg, #f8f8f8 0%, #ffffff 50%, #f8f8f8 100%)",
                border: "1px solid #E5E7EB",
                boxShadow: "inset 0 0 6px rgba(0,0,0,0.05)",
                padding: 6,
                borderRadius: 12,
                flex: "1 1 100%",
                maxWidth: 500,
              }}
            >
              <button
                onClick={() => setInstrCollapsed((v) => !v)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #D1D5DB",
                  background:
                    "linear-gradient(180deg, #FFFFFF 0%, #F3F4F6 100%)",
                  color: "#111827",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                {instrCollapsed ? "Show Full" : "Hide"}
              </button>

              <button
                onClick={() => setEditModalOpen(true)}
                disabled={!instructions.trim()}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: instructions.trim()
                    ? "linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)"
                    : "#E5E7EB",
                  color: instructions.trim() ? "#fff" : "#9CA3AF",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: instructions.trim() ? "pointer" : "not-allowed",
                  transition: "0.3s",
                }}
              >
                Edit
              </button>

              <button
                onClick={requestAndOpenEditor}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "none",
                  background:
                    "linear-gradient(90deg, #F59E0B 0%, #FACC15 100%)",
                  color: "#111827",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "0.3s",
                  boxShadow: "0 0 10px rgba(245,158,11,0.25)",
                }}
              >
                Generate
              </button>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              background: "#fff",
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              padding: 14,
            }}
          >
            {genLoading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255,255,255,0.9)",
                  borderRadius: 12,
                  zIndex: 2,
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <Spin size="large" />
                <div
                  style={{ color: "#0F172A", fontWeight: 800, fontSize: 15 }}
                >
                  Generating instructions…
                </div>
              </div>
            )}

            <div
              style={{
                whiteSpace: "pre-wrap",
                color: instructions ? "#111827" : TEXT_MUTED,
                lineHeight: 1.6,
                maxHeight: instrCollapsed ? 120 : 380,
                overflow: "auto",
              }}
            >
              {instructions ||
                "Instructions will appear here after generation."}
            </div>
          </div>
        </div>
      </Drawer>

      <Modal
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontWeight: 800,
              letterSpacing: 0.2,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: 999,
                background:
                  "linear-gradient(135deg, #6D28D9 0%, #A78BFA 60%, #F59E0B 120%)",
                boxShadow: "0 0 0 3px rgba(109,40,217,0.10)",
              }}
            />
            Edit Instructions
          </div>
        }
        open={editModalOpen}
        onCancel={handleInstrCancel} // X icon & Cancel = discard (as requested)
        footer={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            {/* live character counter */}
            <div
              style={{
                marginRight: "auto",
                fontSize: 12,
                color: "#64748B",
                whiteSpace: "nowrap",
              }}
            >
              {editDraft?.length ?? 0}/7000
            </div>

            <button
              key="close"
              onClick={handleInstrCancel}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #E7E6F3",
                background: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Close
            </button>

            <button
              key="save"
              onClick={handleInstrSave}
              style={{
                padding: "10px 18px",
                borderRadius: 999,
                border: "2px solid transparent",
                background:
                  "linear-gradient(white, white), linear-gradient(135deg, #6D28D9 0%, #A78BFA 60%, #F59E0B 120%)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
                color: "#0F172A",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 0 10px rgba(109,40,217,0.20)",
              }}
            >
              Save
            </button>
          </div>
        }
        closable
        maskClosable={false}
        destroyOnClose
        width={720}
      >
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ fontSize: 12, color: "#64748B" }}>
            Add clear, step-by-step guidance for how this agent should behave.
            (Max 7000 characters)
          </div>

          <textarea
            value={editDraft}
            onChange={(e) => {
              const v = e.target.value?.slice(0, 7000) || "";
              setEditDraft(v);
            }}
            maxLength={7000}
            spellCheck={true}
            placeholder="Type or paste your instructions here…"
            style={{
              width: "100%",
              minHeight: 320,
              padding: 14,
              borderRadius: 12,
              border: "1px solid #E7E6F3",
              outline: "none",
              background: "#FFF",
              fontSize: 14,
              lineHeight: 1.6,
              resize: "vertical",
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              boxShadow: "inset 0 1px 0 rgba(2,8,23,0.04)",
            }}
          />
        </div>
      </Modal>

      <Modal
        open={showWhatsappVerificationModal}
        onCancel={() => setShowWhatsappVerificationModal(false)}
        footer={null}
        centered
        title="Verify your WhatsApp"
      >
        <div style={{ display: "grid", gap: 10 }}>
          {!!errorMsg && (
            <div style={{ color: "#b91c1c", fontSize: 12 }}>{errorMsg}</div>
          )}

          <label style={{ fontSize: 12, color: "#475569" }}>Country Code</label>
          <input
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            style={{
              height: 38,
              border: "1px solid #E7E6F3",
              borderRadius: 10,
              padding: "0 10px",
            }}
          />

          <label style={{ fontSize: 12, color: "#475569" }}>
            WhatsApp Number
          </label>
          <input
            value={whatsappNumber || mobileNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="Enter WhatsApp number"
            style={{
              height: 38,
              border: "1px solid #E7E6F3",
              borderRadius: 10,
              padding: "0 10px",
            }}
          />

          <label style={{ fontSize: 12, color: "#475569" }}>OTP Code</label>
          <input
            value={whatsappVerificationCode}
            onChange={(e) => setWhatsappVerificationCode(e.target.value)}
            placeholder="Enter OTP"
            style={{
              height: 38,
              border: "1px solid #E7E6F3",
              borderRadius: 10,
              padding: "0 10px",
            }}
          />

          <button
            onClick={handleWhatsappVerification}
            disabled={loading}
            style={{
              height: 40,
              borderRadius: 999,
              border: "none",
              fontWeight: 900,
              color: "#fff",
              background:
                "linear-gradient(90deg, #6D28D9 0%, #2563EB 50%, #FF00FF 100%)",
              boxShadow:
                "0 6px 16px rgba(124,58,237,0.18), 0 2px 8px rgba(2,8,23,0.06)",
              cursor: "pointer",
            }}
          >
            {loading ? "Verifying..." : "Verify & Save"}
          </button>
        </div>
      </Modal>

      <Modal
        open={uploadOpen}
        title="Upload supporting files"
        // ⛔ prevent closing by X, mask, or Esc
        closable={false}
        maskClosable={false}
        keyboard={false}
        // keep onCancel defensive (won’t be triggered with closable=false, but safe)
        onCancel={() => {
          message.warning("Please complete the upload to continue.");
          setUploadOpen(true); // re-assert open
        }}
        // Only your action button in content — no default footer buttons
        footer={null}
      >
        <div style={{ display: "grid", gap: 12 }}>
          {/* Read-only role from publish response */}
          <div>
            <div style={{ fontSize: 12, color: "#64748B", marginBottom: 6 }}>
              Role of user
            </div>
            <input
              value={uploadRole || "—"}
              disabled
              style={{
                width: "100%",
                height: 40,
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid #E7E6F3",
                background: "#F8FAFC",
                color: "#0F172A",
                fontWeight: 600,
                cursor: "not-allowed",
              }}
            />
            <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 6 }}>
              Sourced from publish response (<code>roleUser</code> or{" "}
              <code>optionalRole</code>).
            </div>
          </div>

          {/* File picker */}
          <div>
            <div style={{ fontSize: 12, color: "#64748B", marginBottom: 6 }}>
              Attach files (PDF/JPG/PNG/DOC, up to 5MB each)
            </div>
            <button
              type="button"
              onClick={handleUploadFilesPick}
              style={{
                border: "none",
                borderRadius: 10,
                padding: "10px 14px",
                fontWeight: 800,
                color: "#fff",
                background:
                  "linear-gradient(90deg, #6D28D9 0%, #2563EB 50%, #FF00FF 100%)",
              }}
            >
              Choose files
            </button>
            {!!uploadFiles.length && (
              <div style={{ marginTop: 8, fontSize: 12, color: "#0F172A" }}>
                {uploadFiles.map((f) => (
                  <div key={f.name} style={{ marginTop: 4 }}>
                    • {f.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 16,
            }}
          >
            <button
              type="button"
              onClick={() => setUploadOpen(false)}
              style={{
                padding: "10px 18px",
                borderRadius: 999,
                fontWeight: 700,
                background: "#E2E8F0",
                color: "#0F172A",
                border: "none",
                cursor: "pointer",
              }}
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleUploadConfirm}
              disabled={uploading}
              style={{
                border: "none",
                borderRadius: 999,
                padding: "10px 18px",
                fontWeight: 900,
                color: "#fff",
                background:
                  "linear-gradient(90deg, #6D28D9 0%, #2563EB 50%, #FF00FF 100%)",
                opacity: uploading ? 0.7 : 1,
                cursor: uploading ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {uploading ? (
                <>
                  <Spin size="small" /> {/* from antd, already imported */}
                  Uploading...
                </>
              ) : (
                "Upload & Continue"
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* ===== Profile Edit (Mandatory Gate) ===== */}
      <Modal
        open={profileModalOpen}
        onCancel={() => {
          message.warning("Please complete your profile before continuing.");
          setProfileModalOpen(true); // keep it open
        }}
        footer={null}
        title="Complete Your Profile"
        // 🔒 fully locked modal
        closable={false}
        maskClosable={false}
        keyboard={false}
        destroyOnClose={false}
      >
        <div style={{ display: "grid", gap: 12 }}>
          {/* First Name - REQUIRED */}
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                marginBottom: 6,
                color: "#0F172A",
              }}
            >
              First Name <span style={{ color: "#DC2626" }}>*</span>
            </div>
            <input
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                if (profileErrors.name)
                  setProfileErrors((p) => ({ ...p, name: undefined }));
              }}
              placeholder="Enter your first name"
              maxLength={80}
              style={{
                width: "100%",
                height: 42,
                padding: "10px 12px",
                borderRadius: 12,
                border: `1px solid ${profileErrors.name ? "#DC2626" : BORDER}`,
                background: "#FFF",
                fontSize: 14,
                fontWeight: 600,
                boxShadow: "inset 0 1px 0 rgba(2,8,23,0.04)",
              }}
            />
            {profileErrors.name && (
              <div style={{ color: "#DC2626", fontSize: 12, marginTop: 6 }}>
                {profileErrors.name}
              </div>
            )}
          </div>

          {/* Email - REQUIRED */}
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                marginBottom: 6,
                color: "#0F172A",
              }}
            >
              Email <span style={{ color: "#DC2626" }}>*</span>
            </div>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (profileErrors.email)
                  setProfileErrors((p) => ({ ...p, email: undefined }));
              }}
              placeholder="name@example.com"
              maxLength={120}
              style={{
                width: "100%",
                height: 42,
                padding: "10px 12px",
                borderRadius: 12,
                border: `1px solid ${profileErrors.email ? "#DC2626" : BORDER}`,
                background: "#FFF",
                fontSize: 14,
                fontWeight: 600,
                boxShadow: "inset 0 1px 0 rgba(2,8,23,0.04)",
              }}
            />
            {profileErrors.email && (
              <div style={{ color: "#DC2626", fontSize: 12, marginTop: 6 }}>
                {profileErrors.email}
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button
              type="button"
              onClick={handleSaveOrUpdateProfile}
              disabled={profileLoading}
              style={{
                padding: "10px 16px",
                borderRadius: 999,
                border: "none",
                fontWeight: 900,
                color: "#fff",
                background:
                  "linear-gradient(90deg, #6D28D9 0%, #2563EB 50%, #FF00FF 100%)",
                cursor: profileLoading ? "not-allowed" : "pointer",
                opacity: profileLoading ? 0.7 : 1,
              }}
            >
              {profileLoading ? "Saving…" : "Save & Continue"}
            </button>
          </div>
        </div>
      </Modal>

      {/* ===== Business Card Data Modal ===== */}
      <Modal
        open={cardDataModalOpen}
        onCancel={() => {
          message.warning("Please save or cancel your edits first.");
        }}
        footer={null}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>💼</span>
            <span style={{ fontWeight: 800 }}>Business Card Details</span>
          </div>
        }
        width={700}
        closable={false}
        maskClosable={false}
      >
        <p
          style={{
            background: "#FFF7E6",
            borderLeft: "4px solid #FAAD14",
            padding: "6px 10px",
            borderRadius: 6,
            fontSize: 12,
            color: "#663C00",
            marginTop: 8,
          }}
        >
          <strong>Note:</strong> Please review the details and make any
          necessary changes.
        </p>
        <div style={{ display: "grid", gap: 14 }}>
          {/* Row 1: Full Name & Job Title */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom: 6,
                  color: "#0F172A",
                }}
              >
                Full Name <span style={{ color: "#EF4444" }}>*</span>
              </div>
              <input
                value={cardDataForm.fullName}
                onChange={(e) => handleFieldChange("fullName", e.target.value)}
                placeholder="Enter full name"
                style={{
                  width: "100%",
                  height: 40,
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: `1px solid ${errors.fullName ? "#EF4444" : BORDER}`,
                  background: "#FFF",
                  fontSize: 14,
                  fontWeight: 500,
                  outline: "none",
                }}
              />
              {errors.fullName && (
                <div
                  style={{
                    color: "#EF4444",
                    fontSize: 12,
                    marginTop: 4,
                    fontWeight: 500,
                  }}
                >
                  {errors.fullName}
                </div>
              )}
            </div>

            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom: 6,
                  color: "#0F172A",
                }}
              >
                Job Title
              </div>
              <input
                value={cardDataForm.jobTitle}
                onChange={(e) => handleFieldChange("jobTitle", e.target.value)}
                placeholder="Enter job title"
                style={{
                  width: "100%",
                  height: 40,
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: `1px solid ${BORDER}`,
                  background: "#FFF",
                  fontSize: 14,
                  fontWeight: 500,
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Row 2: Company Name & Email */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom: 6,
                  color: "#0F172A",
                }}
              >
                Company Name <span style={{ color: "#EF4444" }}>*</span>
              </div>
              <input
                value={cardDataForm.companyName}
                onChange={(e) =>
                  handleFieldChange("companyName", e.target.value)
                }
                placeholder="Enter company name"
                style={{
                  width: "100%",
                  height: 40,
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: `1px solid ${
                    errors.companyName ? "#EF4444" : BORDER
                  }`,
                  background: "#FFF",
                  fontSize: 14,
                  fontWeight: 500,
                  outline: "none",
                }}
              />
              {errors.companyName && (
                <div
                  style={{
                    color: "#EF4444",
                    fontSize: 12,
                    marginTop: 4,
                    fontWeight: 500,
                  }}
                >
                  {errors.companyName}
                </div>
              )}
            </div>

            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom: 6,
                  color: "#0F172A",
                }}
              >
                Email
              </div>
              <input
                value={cardDataForm.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                type="email"
                placeholder="Enter email"
                style={{
                  width: "100%",
                  height: 40,
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: `1px solid ${BORDER}`,
                  background: "#FFF",
                  fontSize: 14,
                  fontWeight: 500,
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Row 3: Phone & Website */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom: 6,
                  color: "#0F172A",
                }}
              >
                Phone <span style={{ color: "#EF4444" }}>*</span>
              </div>
              <input
                value={cardDataForm.mobileNumber}
                onChange={(e) =>
                  handleFieldChange("mobileNumber", e.target.value)
                }
                placeholder="Enter phone number"
                style={{
                  width: "100%",
                  height: 40,
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: `1px solid ${
                    errors.mobileNumber ? "#EF4444" : BORDER
                  }`,
                  background: "#FFF",
                  fontSize: 14,
                  fontWeight: 500,
                  outline: "none",
                }}
              />
              {errors.mobileNumber && (
                <div
                  style={{
                    color: "#EF4444",
                    fontSize: 12,
                    marginTop: 4,
                    fontWeight: 500,
                  }}
                >
                  {errors.mobileNumber}
                </div>
              )}
            </div>

            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom: 6,
                  color: "#0F172A",
                }}
              >
                Website
              </div>
              <input
                value={cardDataForm.website}
                onChange={(e) => handleFieldChange("website", e.target.value)}
                placeholder="Enter website"
                style={{
                  width: "100%",
                  height: 40,
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: `1px solid ${BORDER}`,
                  background: "#FFF",
                  fontSize: 14,
                  fontWeight: 500,
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Row 4: Address (Full Width) */}
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                marginBottom: 6,
                color: "#0F172A",
              }}
            >
              Address <span style={{ color: "#EF4444" }}>*</span>
            </div>
            <textarea
              value={cardDataForm.address}
              onChange={(e) => handleFieldChange("address", e.target.value)}
              placeholder="Enter address"
              rows={2}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 10,
                border: `1px solid ${errors.address ? "#EF4444" : BORDER}`,
                background: "#FFF",
                fontSize: 14,
                fontWeight: 500,
                resize: "vertical",
                fontFamily: "inherit",
                outline: "none",
              }}
            />
            {errors.address && (
              <div
                style={{
                  color: "#EF4444",
                  fontSize: 12,
                  marginTop: 4,
                  fontWeight: 500,
                }}
              >
                {errors.address}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 4,
              paddingTop: 12,
              borderTop: `1px solid ${BORDER}`,
            }}
          >
            <button
              onClick={() => {
                setCardDataModalOpen(false);
                setIsEditingCardData(false);
                setErrors({
                  fullName: "",
                  companyName: "",
                  mobileNumber: "",
                  address: "",
                });
              }}
              disabled={cardDataSaving}
              style={{
                padding: "9px 20px",
                borderRadius: 999,
                border: `1px solid ${BORDER}`,
                background: "#fff",
                color: "#0F172A",
                fontWeight: 800,
                fontSize: 14,
                cursor: cardDataSaving ? "not-allowed" : "pointer",
                opacity: cardDataSaving ? 0.6 : 1,
                transition: "all 0.2s ease",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleCardDataUpdate}
              disabled={cardDataSaving}
              style={{
                padding: "9px 24px",
                borderRadius: 999,
                border: "none",
                background:
                  "linear-gradient(90deg, #6D28D9 0%, #2563EB 50%, #FF00FF 100%)",
                color: "#fff",
                fontWeight: 900,
                fontSize: 14,
                cursor: cardDataSaving ? "not-allowed" : "pointer",
                opacity: cardDataSaving ? 0.7 : 1,
                boxShadow:
                  "0 4px 12px rgba(109,40,217,0.25), 0 10px 28px rgba(37,99,235,0.25)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s ease",
              }}
            >
              {cardDataSaving ? (
                <>
                  <Spin size="small" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Publish Confirmation Modal */}
      <Modal
        open={publishModalOpen}
        onCancel={handlePublishCancel}
        footer={null}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>🚀</span>
            <span style={{ fontWeight: 800 }}>Publish this Agent</span>
          </div>
        }
        centered
        closable={false}
        maskClosable={false}
      >
        <div style={{ padding: "10px 0" }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8, fontSize: 16, fontWeight: 600 }}>
              <b>{agentName || "Untitled Agent"}</b>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
              <Tag color="blue">{roleResolved || "—"}</Tag>
              <Tag color="purple">{goalResolved || "—"}</Tag>
              <Tag color="green">{purposeResolved || "—"}</Tag>
              <Tag color={view === "Public" ? "geekblue" : "default"}>
                {view === "Public" ? "Public use" : "Personal use"}
              </Tag>
            </div>
            <div style={{ color: "#64748B", lineHeight: 1.5 }}>{previewDescription}</div>
          </div>
          
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <p style={{ margin: 0, fontSize: 15, color: "#374151" }}>
              Are you sure you want to publish this agent?
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              onClick={handlePublishCancel}
              style={{
                padding: "10px 24px",
                borderRadius: 999,
                border: `1px solid ${BORDER}`,
                background: "#FFFFFF",
                color: "#475569",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                minWidth: 100,
              }}
            >
              No
            </button>
            <button
              onClick={handlePublishConfirm}
              disabled={loading}
              style={{
                padding: "10px 24px",
                borderRadius: 999,
                border: "none",
                background: "linear-gradient(90deg, #6D28D9 0%, #2563EB 50%, #FF00FF 100%)",
                color: "#FFFFFF",
                fontWeight: 900,
                fontSize: 15,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.85 : 1,
                minWidth: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <Spin size="small" />
                  Publishing…
                </>
              ) : (
                "Yes, Publish"
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        open={successModalOpen}
        onCancel={handleSuccessOk}
        footer={null}
        title={null}
        centered
        closable={false}
        maskClosable={false}
      >
        <div style={{ textAlign: "center", padding: "20px 10px" }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
          <h3 style={{ margin: "0 0 12px 0", fontSize: 20, fontWeight: 800, color: "#059669" }}>
            Agent Created Successfully!
          </h3>
          <p style={{ margin: "0 0 24px 0", color: "#64748B", lineHeight: 1.5 }}>
            Your AI agent has been published and is ready to use.
          </p>
          <button
            onClick={handleSuccessOk}
            style={{
              padding: "12px 32px",
              borderRadius: 999,
              border: "none",
              background: "linear-gradient(90deg, #059669 0%, #10B981 100%)",
              color: "#FFFFFF",
              fontWeight: 900,
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(5,150,105,0.3)",
            }}
          >
            OK
          </button>
        </div>
      </Modal>

      {/* Error Modal */}
      <Modal
        open={errorModalOpen}
        onCancel={handleErrorOk}
        footer={null}
        title={null}
        centered
        closable={false}
        maskClosable={false}
      >
        <div style={{ textAlign: "center", padding: "20px 10px" }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>❌</div>
          <h3 style={{ margin: "0 0 12px 0", fontSize: 20, fontWeight: 800, color: "#DC2626" }}>
            Publishing Failed
          </h3>
          <p style={{ margin: "0 0 24px 0", color: "#64748B", lineHeight: 1.5 }}>
            {errorMessage || "Something went wrong while publishing your agent. Please try again."}
          </p>
          <button
            onClick={handleErrorOk}
            style={{
              padding: "12px 32px",
              borderRadius: 999,
              border: "none",
              background: "linear-gradient(90deg, #DC2626 0%, #EF4444 100%)",
              color: "#FFFFFF",
              fontWeight: 900,
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(220,38,38,0.3)",
            }}
          >
            OK
          </button>
        </div>
      </Modal>

      {/* </div> */}
    </div>
  );
};

export default Agentcreation;
