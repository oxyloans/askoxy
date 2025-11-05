// src/BharathAIStore/pages/Agentcreation.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Drawer, Modal, Tooltip, message, Tag, Spin } from "antd";
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
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../Config";

/* =========================================================
 * Theme (WHITE + subtle 3D) & Limits
 * ======================================================= */
const BORDER = "#E7E6F3";
const TEXT_MUTED = "#64748B";
const SOFT_PLACEHOLDER = "#94A3B8";

/** Gradients for headings — rotates per section */
const GRADIENTS = [
  "linear-gradient(135deg, #6D28D9 0%, #A78BFA 60%, #F59E0B 120%)",
  "linear-gradient(135deg, #2563EB 0%, #22D3EE 60%, #22C55E 120%)",
  "linear-gradient(135deg, #06bd67 0%, #A78bf6 60%, #8B5CF6 120%)",
  "linear-gradient(135deg, #06B6D4 0%, #10B981 60%, #6366F1 120%)",
];

type ViewType = "Public" | "Private";

type AddFileType = "STUDENT" | "EMPLOYEE" | "BUSINESS" | "OTHER";

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

/* =========================================================
 * Debounce hook (prevents multi-calls while typing "Other")
 * ======================================================= */
function useDebounced<T>(value: T, delay = 600): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/* =========================================================
 * CompactSelect — fixed interaction + 3D pop + anti-overlap
 * ======================================================= */
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
          padding: "10px 14px",
          borderRadius: 12,
          border: "1px solid transparent",
          backgroundImage: `linear-gradient(white, white), linear-gradient(135deg, #6D28D9 0%, #A78BFA 60%, #ff00ff 120%)`,
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          textAlign: "left",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 15,
          color: value ? "#111827" : SOFT_PLACEHOLDER,
          boxShadow: "0 6px 18px rgba(2,8,23,0.06)",
          transition: "transform .12s ease",
        }}
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
            boxShadow: "0 16px 36px rgba(2,8,23,0.12)",
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

/* =========================================================
 * Options
 * ======================================================= */
const ROLE_OPTS: Option[] = [
  { label: "Student", value: "Student", icon: <UserOutlined /> },
  { label: "Fresher", value: "Fresher", icon: <UserOutlined /> },
  { label: "Job Seeker", value: "JobSeeker", icon: <UserOutlined /> },
  {
    label: "Working Professional",
    value: "WorkingProfessional",
    icon: <UserOutlined />,
  },
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
const GOAL_OPTS: Option[] = [
  { label: "Job / Internship", value: "JobInternship", icon: <AimOutlined /> },
  { label: "Upskilling", value: "Upskilling", icon: <AimOutlined /> },
  { label: "Clients", value: "Clients", icon: <AimOutlined /> },
  { label: "Leads", value: "Leads", icon: <AimOutlined /> },
  { label: "Investors", value: "Investors", icon: <AimOutlined /> },
  { label: "Funding", value: "Funding", icon: <AimOutlined /> },
  { label: "Recruiting", value: "Recruiting", icon: <AimOutlined /> },
  { label: "Hiring", value: "Hiring", icon: <AimOutlined /> },
  { label: "Sales", value: "Sales", icon: <AimOutlined /> },
  { label: "Revenue", value: "Revenue", icon: <AimOutlined /> },
  {
    label: "Brand Visibility",
    value: "BrandVisibility",
    icon: <AimOutlined />,
  },
  { label: "Growth", value: "Growth", icon: <AimOutlined /> },
  {
    label: "Community Network",
    value: "CommunityNetwork",
    icon: <AimOutlined />,
  },
  { label: "Automation", value: "Automation", icon: <AimOutlined /> },
  { label: "AI Tools", value: "AITools", icon: <AimOutlined /> },
  { label: "Projects", value: "Projects", icon: <AimOutlined /> },
  { label: "Collaboration", value: "Collaboration", icon: <AimOutlined /> },
  { label: "Support", value: "Support", icon: <AimOutlined /> },
  { label: "Helpdesk", value: "Helpdesk", icon: <AimOutlined /> },
  { label: "Other", value: "Other", icon: <AimOutlined /> },
];
const PURPOSE_OPTS: Option[] = [
  { label: "Learn", value: "Learn", icon: <RocketOutlined /> },
  { label: "Build", value: "Build", icon: <RocketOutlined /> },
  { label: "Offer", value: "Offer", icon: <RocketOutlined /> },
  { label: "Earn", value: "Earn", icon: <RocketOutlined /> },
  { label: "Hire", value: "Hire", icon: <RocketOutlined /> },
  { label: "Automate", value: "Automate", icon: <RocketOutlined /> },
  { label: "Market", value: "Market", icon: <RocketOutlined /> },
  { label: "Support", value: "Support", icon: <RocketOutlined /> },
  { label: "Legal Help", value: "LegalHelp", icon: <RocketOutlined /> },
  { label: "Medical Help", value: "MedicalHelp", icon: <RocketOutlined /> },
  { label: "Company Setup", value: "CompanySetup", icon: <RocketOutlined /> },
  { label: "Company Audit", value: "CompanyAudit", icon: <RocketOutlined /> },
  { label: "Other", value: "Other", icon: <RocketOutlined /> },
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

/* =========================================================
 * Block UI helpers (white theme + gradient headers)
 * ======================================================= */
const card3D: React.CSSProperties = {
  background: "#FFFFFF",
  border: `1px solid ${BORDER}`,
  borderRadius: 16,
  boxShadow: "0 14px 40px rgba(2,8,23,0.08)",
  overflow: "visible",
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

/* =========================================================
 * Main Component
 * ======================================================= */
const Agentcreation: React.FC = () => {
  const navigate = useNavigate();

  // Core form (selects)
  const [roleSelect, setRoleSelect] = useState<string>("");
  const [goalSelect, setGoalSelect] = useState<string>("");
  const [purposeSelect, setPurposeSelect] = useState<string>("");

  // "Other" custom inputs
  const [roleOther, setRoleOther] = useState("");
  const [goalOther, setGoalOther] = useState("");
  const [purposeOther, setPurposeOther] = useState("");

  // Resolved values (if "Other", use custom text)
  const roleResolved = roleSelect === "Other" ? roleOther.trim() : roleSelect;
  const goalResolved = goalSelect === "Other" ? goalOther.trim() : goalSelect;
  const purposeResolved =
    purposeSelect === "Other" ? purposeOther.trim() : purposeSelect;

  // Debounced resolved values (prevents multi API calls while typing)
  const roleDeb = useDebounced(roleResolved, 700);
  const goalDeb = useDebounced(goalResolved, 700);
  const purposeDeb = useDebounced(purposeResolved, 700);

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
  const [uploadRole, setUploadRole] = useState<AddFileType | "">("");
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const uploadResolveRef = useRef<null | ((ok: boolean) => void)>(null);
  const awaitingOnceRef = useRef(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Responsive (page width locked to mobile feel)
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < 768 : true
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Replace old uploadMandatoryDocOnce
  async function uploadMandatoryDocOnceMulti(
    assistanceId: string,
    files: File[],
    addFileType: AddFileType,
    userId: string,
    auth: HeadersInit
  ) {
    for (const file of files) {
      const form = new FormData();
      form.append("file", file);

      const url = `${BASE_URL}/ai-service/agent/${encodeURIComponent(
        assistanceId
      )}/addAgentFiles?addFileType=${encodeURIComponent(
        addFileType
      )}&userId=${encodeURIComponent(userId)}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { ...auth }, // browser sets multipart boundary
        body: form,
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(
          `Upload failed: ${res.status} ${txt || res.statusText}`
        );
      }
    }
  }

  // keep the context we need while the modal is open
  const pendingUploadRef = useRef<{
    assistanceId: string;
    userId: string;
    auth: HeadersInit;
  } | null>(null);

  async function handleUploadConfirm() {
    const ctx = pendingUploadRef.current;
    if (!ctx) return;

    if (!uploadRole) {
      message.error("Please choose the Role of user.");
      return;
    }
    if (!uploadFiles.length) {
      message.error("Please attach at least one file.");
      return;
    }

    // Validate once
    for (const f of uploadFiles) {
      const okType = /\.(pdf|jpe?g|png|docx?)$/i.test(f.name);
      const okSize = f.size <= 5 * 1024 * 1024;
      if (!okType) return message.error(`Unsupported file: ${f.name}`);
      if (!okSize) return message.error(`File too large (5MB max): ${f.name}`);
    }

    try {
      await uploadMandatoryDocOnceMulti(
        ctx.assistanceId,
        uploadFiles,
        uploadRole as AddFileType,
        ctx.userId,
        ctx.auth
      );

      localStorage.removeItem("awaitingUpload");

      // close modal + resolve any awaiting promise
      setUploadOpen(false);
      uploadResolveRef.current?.(true);
      uploadResolveRef.current = null;

      message.success(
        "Congratulations! File(s) uploaded. Your agent is queued for approval."
      );

      // clear page form to avoid flicker of old data
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

      // now navigate
      navigate("/main/bharath-aistore/agents");
    } catch (e: any) {
      message.error(e?.message || "Upload failed.");
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

  function promptUpload(
    assistanceId: string,
    userId: string,
    auth: HeadersInit
  ) {
    return new Promise<boolean>((resolve) => {
      uploadResolveRef.current = resolve;
      localStorage.setItem(
        "awaitingUpload",
        JSON.stringify({ assistanceId, userId })
      );
      setUploadRole("");
      setUploadFiles([]);
      pendingUploadRef.current = { assistanceId, userId, auth };
      setUploadOpen(true);
    });
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
    const s1 = (cs1Draft || "").slice(0, 150);
    const s2 = (cs2Draft || "").slice(0, 150);
    setConStarter1(s1);
    setConStarter2(s2);
    setStartersEdit(false);
    message.success("Starters saved (max 150 chars each).");
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

      // Preferred: POST with query params (no content-type)
      try {
        res = await fetch(
          `${baseUrl}?${qs({
            role: roleResolved,
            goal: goalResolved,
            purpose: purposeResolved,
          })}`,
          {
            method: "POST",
            headers: { ...auth },
            mode: "cors",
            signal: ctrl.signal,
          }
        );
      } catch {
        res = undefined;
      }
      res = await okOrRetry5xx(res, () =>
        fetch(
          `${baseUrl}?${qs({
            role: roleResolved,
            goal: goalResolved,
            purpose: purposeResolved,
          })}`,
          {
            method: "POST",
            headers: { ...auth },
            mode: "cors",
            signal: ctrl.signal,
          }
        )
      );

      // Fallback: POST x-www-form-urlencoded
      if (!res || !res.ok) {
        try {
          const form = new URLSearchParams({
            role: roleResolved,
            goal: goalResolved,
            purpose: purposeResolved,
          });
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
            flexWrap: "nowrap", // 🔒 single row
            gap: 8,
            justifyContent: "flex-end",
            overflowX: "auto", // allow scroll if tiny width
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
  }, [agentName, roleResolved, goalResolved, purposeResolved]);

  // One-per-combo guard + DEBOUNCED trigger (fixes multi-calls while typing "Other")
  const lastComboRef = useRef<string>("");
  const nameSuggestInFlightRef = useRef(false);
  useEffect(() => {
    // Only run when all debounced resolved values exist
    if (!roleDeb || !goalDeb || !purposeDeb) return;

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
  }, [roleDeb, goalDeb, purposeDeb]); // use ONLY debounced deps

  /* =========================================================
   * API — Agent Description (unchanged behavior)
   * ======================================================= */
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

  /* =========================================================
   * PREVIEW + PUBLISH
   * ======================================================= */
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

    const body = {
      agentName: (agentName || "").trim(),
      description: previewDescription,

      // If "Other" selected, enum key → "Other"; free text → optional*
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
    };

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/ai-service/agent/newAgentPublish`, {
        method: "PATCH", // ← you asked to keep PATCH
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        // Show clearer 500 info
        throw new Error(
          `Publish failed: ${res.status} ${res.statusText} ${
            txt ? "— " + txt : ""
          }`.trim()
        );
      }

      // Try to parse the response to get assistanceId
      const data = await res.json().catch(() => ({} as any));
      const assistanceId =
        data.assistanceId || data.assistantId || data.id || "";
      // inside publishNow after successful PATCH + parsing assistanceId
      message.success("Congratulations! Your agent is published successfully.");

      if (assistanceId) {
        localStorage.setItem(
          "awaitingUpload",
          JSON.stringify({ assistanceId, userId })
        );
        await promptUpload(assistanceId, userId, auth || {});
      }

      setPreviewOpen(false);
      message.success("All set! Files uploaded and agent queued for approval.");
      navigate("/main/bharath-aistore/agents");
    } catch (e: any) {
      message.error(e?.message || "Publish failed");
    } finally {
      setLoading(false);
    }
  }, [
    agentName,
    previewDescription,
    instructions,
    roleSelect,
    purposeSelect,
    goalSelect,
    roleOther,
    purposeOther,
    goalOther,
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

    Modal.confirm({
      title: "Publish this Agent?",
      content: (
        <div>
          <div style={{ marginBottom: 8 }}>
            <b>{agentName || "Untitled Agent"}</b>
          </div>
          <div>
            <Tag color="blue">{roleResolved || "—"}</Tag>
            <Tag color="purple">{goalResolved || "—"}</Tag>
            <Tag color="green">{purposeResolved || "—"}</Tag>
            <Tag color={view === "Public" ? "geekblue" : "default"}>
              {view === "Public" ? "Public use" : "Personal use"}
            </Tag>
          </div>
          <div style={{ marginTop: 8 }}>{previewDescription}</div>
          <div style={{ marginTop: 10, color: "#64748B", fontSize: 12 }}>
            (Description must be {MIN_DESC}–{MAX_DESC} characters.)
          </div>
        </div>
      ),
      okText: "Yes, Publish",
      cancelText: "No",
      onOk: async () => {
        Modal.destroyAll(); // close the "Publish this Agent?" modal immediately
        await publishNow(); // then run the publish + upload flow
      },
    });
  }, [
    description,
    canPreview,
    instructions,
    agentName,
    roleResolved,
    goalResolved,
    purposeResolved,
    view,
    previewDescription,
    publishNow,
  ]);

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

  /* =========================================================
   * RENDER
   * ======================================================= */
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
    <div style={{ background: "#FFFFFF" }}>
      {/* ======= Role-based Agent Header (Aligned + Drop Shadow) ======= */}
      <div
        style={{
          maxWidth: 480, // 🔹 now matches the form container width
          margin: "20px auto 14px",
          padding: "18px 20px",
          borderRadius: 20,
          background:
            "linear-gradient(180deg, #FFFFFF 0%, #F8F8FF 50%, #FAF5FF 100%)",
          boxShadow:
            "0 6px 18px rgba(109,40,217,0.08), 0 2px 8px rgba(17,24,39,0.04)", // 🔹 soft 3D drop shadow
          position: "relative",
          border: "1px solid #E7E6F3",
        }}
      >
        {/* Top Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background:
                  "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 22,
                boxShadow: "0 4px 10px rgba(109,40,217,0.25)", // 🔹 subtle glow
              }}
            >
              💼
            </div>

            {/* Text Content */}
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 900,
                  color: "#0F172A",
                  lineHeight: 1.3,
                }}
              >
                Role-based Agent
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: "#64748B",
                  lineHeight: 1.45,
                  maxWidth: 340,
                }}
              >
                Choose a role (Student, CEO, Lawyer, etc.). We auto-apply tone,
                goals, and defaults for that persona.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 10,
          }}
        >
          <span
            style={{
              background: "linear-gradient(90deg, #6D28D9, #A78BFA, #F59E0B)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              padding: "5px 12px",
              borderRadius: 999,
              boxShadow: "0 2px 6px rgba(109,40,217,0.25)", // 🔹 light purple shadow
            }}
          >
            AI Powered
          </span>
          <span
            style={{
              background: "linear-gradient(90deg, #FCD34D 0%, #FBBF24 100%)",
              color: "#3B0764",
              fontSize: 12,
              fontWeight: 700,
              padding: "5px 12px",
              borderRadius: 999,
              boxShadow: "0 2px 6px rgba(192,132,252,0.25)", // 🔹 soft violet shadow
            }}
          >
            Fastest
          </span>
        </div>
      </div>

      {/* ======= Role-based Agent Header ======= */}

      <div
        style={{
          maxWidth: 480,
          margin: "14px auto",
          padding: "0 12px",
          width: "100%",
        }}
      >
        {/* ======= Top block: stacked rows, uniform label column ======= */}
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
                  otherInput(roleOther, setRoleOther, "Type your role…")}
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

            {/* Row 2 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                minHeight: 44,
              }}
            >
              <div style={labelColStyle}>{gradientText("Looking for", 1)}</div>
              <div style={{ flex: 1 }}>
                <CompactSelect
                  value={goalSelect}
                  onChange={setGoalSelect}
                  options={GOAL_OPTS}
                  placeholder="Select your goal"
                  loading={nameLoading}
                />
                {goalSelect === "Other" &&
                  otherInput(goalOther, setGoalOther, "Type your goal…")}
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
                <CompactSelect
                  value={purposeSelect}
                  onChange={setPurposeSelect}
                  options={PURPOSE_OPTS}
                  placeholder="Select purpose"
                  loading={nameLoading}
                />
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
          </div>
        </div>

        {/* ======= Agent Name (gradient header) ======= */}
        <div style={{ marginTop: 14, ...card3D }}>
          <div style={sectionHeader(0)}>
            <h3 style={headingText(0)}>Agent Name</h3>
            <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 6 }}>
              Min 3 – 80 characters
            </div>
            <button
              onClick={suggestAgentName}
              disabled={
                nameLoading ||
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
                !roleResolved || !goalResolved || !purposeResolved
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

        {/* ======= Agent Description (gradient header) ======= */}
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
              {descSuggestLoading ? <Spin size="small" /> : <BulbOutlined />}
              <span>AI Suggested</span>
            </button>
          </div>
          <div style={bodyPad}>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                // as user types, keep the field "touched" once they've left it once
                if (descTouched && e.target.value.trim().length >= MIN_DESC) {
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
                  descTouched && descCount < MIN_DESC ? "#DC2626" : BORDER
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

        {/* ======= Visibility (responsive) ======= */}
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
              Visibility:
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
                    view === "Private" ? "padding-box, border-box" : undefined,
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
                    view === "Public" ? "padding-box, border-box" : undefined,
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

        {/* ======= Actions (3-color gradient with smooth glow, balanced spacing) ======= */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
            marginTop: 20,
            flexWrap: "nowrap",
            overflow: "visible", // ensures shadows not clipped
            padding: "10px 2px 20px", // add bottom space for glow
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
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {loading ? "Publishing…" : "Publish"}
          </button>
        </div>

        {/* =========================
         * PREVIEW DRAWER
         * ======================= */}
        <Drawer
          placement={isMobile ? "bottom" : "right"}
          width={isMobile ? undefined : Math.min(560, window.innerWidth * 0.9)}
          height={
            isMobile ? Math.min(0.96 * window.innerHeight, 720) : undefined
          }
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
                  icon={
                    view === "Public" ? <GlobalOutlined /> : <LockOutlined />
                  }
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
                        {val || (
                          <i style={{ color: TEXT_MUTED }}>Starter {i}</i>
                        )}
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
          open={uploadOpen}
          onCancel={() => {
            message.warning("Upload is required to approve this Agent.");
          }}
          closable={false}
          maskClosable={false}
          destroyOnClose={false}
          title="Upload required to approve this Agent"
          footer={null} // ✅ removes Cancel / OK buttons
        >
          <div
            style={{
              display: "grid",
              gap: 14,
              // prevent overlap by ensuring children can grow and wrap
              gridAutoRows: "minmax(min-content, max-content)",
            }}
          >
            {/* Role select row */}
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontWeight: 800 }}>Role of user</label>
              <div style={{ position: "relative", zIndex: 2 }}>
                <CompactSelect
                  value={uploadRole}
                  onChange={(v) => setUploadRole(v as AddFileType)}
                  options={[
                    { label: "STUDENT", value: "STUDENT" },
                    { label: "EMPLOYEE", value: "EMPLOYEE" },
                    { label: "BUSINESS", value: "BUSINESS" },
                    { label: "OTHER", value: "OTHER" },
                  ]}
                  placeholder="Choose role…"
                />
              </div>
            </div>

            {/* Files row */}
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontWeight: 800 }}>Attachments (multiple)</label>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={handleUploadFilesPick}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #E7E6F3",
                    background: "#fff",
                    fontWeight: 600,
                    cursor: "pointer",
                    flex: "0 0 auto",
                    whiteSpace: "nowrap",
                  }}
                >
                  {uploadFiles.length ? "Add / Change" : "Choose Files…"}
                </button>

                {!!uploadFiles.length && (
                  <button
                    type="button"
                    onClick={() => setUploadFiles([])}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1px solid #FCA5A5",
                      background: "#fff",
                      color: "#B91C1C",
                      fontWeight: 700,
                      cursor: "pointer",
                      flex: "0 0 auto",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Remove all
                  </button>
                )}
              </div>

              {!!uploadFiles.length && (
                <div
                  style={{
                    display: "grid",
                    gap: 8,
                    border: "1px solid #E7E6F3",
                    borderRadius: 10,
                    padding: "10px 12px",
                    background: "#fff",
                    maxHeight: 220,
                    overflowY: "auto",
                  }}
                >
                  {uploadFiles.map((f) => (
                    <div
                      key={f.name}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 10px",
                        borderRadius: 999,
                        border: "1px solid #E7E6F3",
                        background: "#F8FAFC",
                        fontSize: 12,
                        maxWidth: "100%",
                      }}
                      title={f.name}
                    >
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: 260,
                          color: "#0F172A",
                          fontWeight: 600,
                        }}
                      >
                        {f.name}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setUploadFiles((prev) =>
                            prev.filter((x) => x.name !== f.name)
                          )
                        }
                        style={{
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          fontWeight: 900,
                        }}
                        aria-label={`Remove ${f.name}`}
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ fontSize: 12, color: "#64748B" }}>
                Allowed: PDF, JPG, PNG, DOC, DOCX — <b>Max 5 MB each</b>
              </div>
            </div>

            {/* Footer row (single line, never overlaps) */}
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "flex-end",
                flexWrap: "nowrap",
                whiteSpace: "nowrap",
                marginTop: 4,
              }}
            >
              <button
                type="button"
                onClick={handleUploadConfirm}
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
                  flex: "0 0 auto",
                }}
              >
                Upload
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Agentcreation;