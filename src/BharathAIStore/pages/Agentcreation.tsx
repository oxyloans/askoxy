// src/BharathAIStore/pages/Agentcreation.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Drawer, Modal, Tooltip, message, Divider, Tag, Spin } from "antd";
import {
  InfoCircleOutlined,
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
 * Theme, Limits & Types
 * ======================================================= */
const PRIMARY = "#6C4CF4";
const PRIMARY_LIGHT = "#F3F0FF";
const BORDER = "#E9E6F8";
const TEXT_MUTED = "#8A88A6";
const SUCCESS = "#10B981";
const ERROR = "#EF4444";

const MIN_DESC = 25;
const MAX_DESC = 350;

type ViewType = "Public" | "Private";
interface Option {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

const InfoLabel: React.FC<{
  title: string;
  info: string;
  required?: boolean;
  extra?: React.ReactNode;
}> = ({ title, info, required, extra }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      lineHeight: 1,
      justifyContent: "space-between",
      flexWrap: "wrap",
    }}
  >
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontWeight: 600, color: "#1F2937", fontSize: 14 }}>
        {title} {required && <span style={{ color: ERROR }}>*</span>}
      </label>
      <Tooltip title={info} placement="right">
        <InfoCircleOutlined
          aria-label={`${title} info`}
          style={{ color: TEXT_MUTED, fontSize: 14, cursor: "help" }}
        />
      </Tooltip>
    </div>
    {extra}
  </div>
);

// === RoleUser ===
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

// === Goals ===
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

// === Purpose ===
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

/* =========================================================
 * Helpers
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

const parseSmart = async (res: Response) => {
  const ct = (res.headers.get("content-type") || "").toLowerCase();
  if (ct.includes("application/json")) {
    const data = await res.json();
    return typeof data === "string"
      ? data
      : data.name || data.instructions || data.message || JSON.stringify(data);
  }
  let raw = await res.text();
  try {
    const maybe = JSON.parse(raw);
    return typeof maybe === "string"
      ? maybe
      : maybe.name || maybe.instructions || maybe.message || raw;
  } catch {
    return raw.replace(/^#{1,6}\s?.*$/gm, "").trim();
  }
};

const labelOf = (arr: Option[], val: string) =>
  arr.find((o) => o.value === val)?.label || val;

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

const stripEmpty = (obj: Record<string, any>) => {
  const o: Record<string, any> = {};
  Object.keys(obj).forEach((k) => {
    const v = obj[k];
    if (v !== undefined && v !== null && `${v}`.trim() !== "") o[k] = v;
  });
  return o;
};

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

const CompactSelect: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder: string;
  loading?: boolean;
}> = ({ value, onChange, options, placeholder, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click/tap (instead of onBlur)
  useEffect(() => {
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (!isOpen) return;
      const el = containerRef.current;
      if (el && !el.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="compact-select"
      style={{ position: "relative", width: "100%", maxWidth: 280 }}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        // Use mousedown so the menu opens before any blur happens
        onMouseDown={(e) => {
          e.preventDefault();              // keep focus, avoid premature blur
          setIsOpen((v) => !v);
        }}
        style={{
          width: "100%",
          padding: "9px 12px",
          borderRadius: 10,
          border: `1px solid ${BORDER}`,
          background: "#fff",
          textAlign: "left",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 14,
          color: value ? "#1F2937" : TEXT_MUTED,
          transition: "all 0.2s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
          {loading ? <Spin size="small" /> : selectedOption?.icon}
          <span style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <span
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            color: TEXT_MUTED,
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
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: `1px solid ${BORDER}`,
            borderRadius: 10,
            marginTop: 4,
            maxHeight: 220,
            overflowY: "auto",
            zIndex: 1000,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          {options.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={value === option.value}
              key={option.value}
              onMouseDown={(e) => e.preventDefault()} // keep focus stable
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              style={{
                width: "100%",
                padding: "9px 12px",
                textAlign: "left",
                background: value === option.value ? PRIMARY_LIGHT : "#fff",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
                color: value === option.value ? PRIMARY : "#1F2937",
                borderBottom: `1px solid ${BORDER}`,
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
 * Main Component
 * ======================================================= */
const Agentcreation: React.FC = () => {
  const navigate = useNavigate();

  // Core form
  const [agentName, setAgentName] = useState("");
  const [roleUser, setRoleUser] = useState<string>("");
  const [goals, setGoals] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("");
  const [view, setView] = useState<ViewType>("Private");
  const [description, setDescription] = useState("");

  // Optional fallbacks for starters
  const [classifyText] = useState<string>("");
  const [agentId] = useState<string>("");

  // Loaders
  const [nameLoading, setNameLoading] = useState(false);
  const [descSuggestLoading, setDescSuggestLoading] = useState(false);

  // Instructions
  const [instructions, setInstructions] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editDraft, setEditDraft] = useState("");
  const [showInstr, setShowInstr] = useState(false);

  // Conversation starters
  const [conStarter1, setConStarter1] = useState("");
  const [conStarter2, setConStarter2] = useState("");
  const [conStarter3, setConStarter3] = useState("");
  const [conStarter4, setConStarter4] = useState("");
  const [startersLoading, setStartersLoading] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Trackers
  const lastComboRef = useRef<string>("");
  const previewAutoGenDoneRef = useRef(false);
  const startersAutoGenDoneRef = useRef(false);

  // Refs
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descMaxAlertedRef = useRef(false);

  // Derived
  const nameCount = agentName.trim().length;
  const descCount = description.trim().length;
  const canPreview =
    nameCount >= 3 &&
    !!roleUser &&
    !!goals &&
    !!purpose &&
    descCount >= MIN_DESC &&
    descCount <= MAX_DESC;

  const canPublish = canPreview && instructions.trim().length > 0;

  const previewDescription = useMemo(
    () =>
      mergedSentence(
        description,
        labelOf(ROLE_OPTS, roleUser),
        labelOf(PURPOSE_OPTS, purpose),
        labelOf(GOAL_OPTS, goals)
      ),
    [description, roleUser, purpose, goals]
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

  // 200-char error popup
  useEffect(() => {
    if (descCount === MAX_DESC && !descMaxAlertedRef.current) {
      descMaxAlertedRef.current = true;
      message.error(
        "Description reached 350 characters. Please shorten or refine."
      );
      setTimeout(() => {
        descMaxAlertedRef.current = false;
      }, 800);
    }
  }, [descCount]);

  // Suggest Agent Name (auto when role/goal/purpose all chosen)
  const suggestAgentName = useCallback(async () => {
    const auth = getAuthHeader() as Record<string, string>;
    if (!auth || !auth.Authorization) return;

    const baseUrl = `${BASE_URL}/ai-service/agent/getAgentName`;
    const qs = new URLSearchParams({ role: roleUser, goal: goals, purpose });

    setNameLoading(true);
    try {
      let res: Response | undefined;

      // POST with query params
      try {
        res = await fetch(`${baseUrl}?${qs.toString()}`, {
          method: "POST",
          headers: { ...auth },
        });
      } catch {}

      // POST JSON
      if (!res || !res.ok) {
        try {
          res = await fetch(baseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...auth },
            body: JSON.stringify({ role: roleUser, goal: goals, purpose }),
          });
        } catch {}
      }

      // GET with query
      if (!res || !res.ok) {
        try {
          res = await fetch(`${baseUrl}?${qs.toString()}`, {
            method: "GET",
            headers: { ...auth },
          });
        } catch {}
      }

      if (!res || !res.ok) {
        const status = res?.status ?? "network";
        const txt = res
          ? await res.text().catch(() => "")
          : "Network / CORS error";
        message.warning(`Name suggestion failed: ${status} ${txt}`);
        return;
      }

      const raw = (await parseSmart(res))?.toString() ?? "";
      const suggestion = sanitizeName(raw);
      if (!suggestion) return;

      Modal.confirm({
        title: "Use this Agent Name?",
        content: (
          <div>
            We suggest: <b style={{ color: PRIMARY }}>{suggestion}</b>
            {!!agentName.trim() && (
              <div style={{ color: TEXT_MUTED, marginTop: 6 }}>
                This will replace your current name "{agentName.trim()}".
              </div>
            )}
          </div>
        ),
        okText: "Yes, use it",
        cancelText: "No, I'll type my own",
        onOk: () => setAgentName(suggestion),
        onCancel: () => nameInputRef.current?.focus(),
      });
    } finally {
      setNameLoading(false);
    }
  }, [agentName, roleUser, goals, purpose]);

  useEffect(() => {
    if (!roleUser || !goals || !purpose) return;
    const combo = `${roleUser}__${goals}__${purpose}`;
    if (combo === lastComboRef.current) return;
    lastComboRef.current = combo;
    suggestAgentName();
  }, [roleUser, goals, purpose, suggestAgentName]);

  // Suggest Description (same payload as name)
  const suggestAgentDescription = useCallback(async () => {
    const auth = getAuthHeader() as Record<string, string>;
    if (!auth || !auth.Authorization) {
      message.error("You're not signed in. Please log in and try again.");
      return;
    }
    if (!roleUser || !goals || !purpose) {
      message.warning("Pick Role, Goal, and Purpose first.");
      return;
    }

    const baseUrl = `${BASE_URL}/ai-service/agent/getAgentDescription`;
    const qs = new URLSearchParams({ role: roleUser, goal: goals, purpose });

    setDescSuggestLoading(true);
    try {
      let res: Response | undefined;

      // POST with query params
      try {
        res = await fetch(`${baseUrl}?${qs.toString()}`, {
          method: "POST",
          headers: { ...auth },
        });
      } catch {}

      // POST JSON body
      if (!res || !res.ok) {
        try {
          res = await fetch(baseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...auth },
            body: JSON.stringify({ role: roleUser, goal: goals, purpose }),
          });
        } catch {}
      }

      // GET with query
      if (!res || !res.ok) {
        try {
          res = await fetch(`${baseUrl}?${qs.toString()}`, {
            method: "GET",
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
        onOk: () => setDescription(proposed),
      });
    } finally {
      setDescSuggestLoading(false);
    }
  }, [roleUser, goals, purpose]);

  // Generate Instructions (unchanged)
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

      // POST JSON
      try {
        res = await fetch(baseUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...auth },
          body: JSON.stringify({ description: descClean }),
          signal: ctrl.signal,
        });
      } catch {}

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

      // GET ?query
      if (!res || !res.ok) {
        try {
          res = await fetch(`${baseUrl}?${qs.toString()}`, {
            method: "GET",
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
        throw new Error(`classifyInstruct failed: ${status} ${txt}`);
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
      setShowInstr(false);
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

  /* =========================================================
   * ---- Starters: POST-only version (your code, integrated) ----
   * ======================================================= */
  const suggestStartersFromAPI = useCallback(async () => {
    // 1) Auth
    const rawAuth = getAuthHeader() as Record<string, string> | undefined;
    const token = (rawAuth as any)?.Authorization;
    if (!token) {
      message.error("You’re not signed in. Please log in and try again.");
      return;
    }
    const authHeaders = new Headers({ Authorization: token });

    // 2) Input
    const baseDesc = (description || classifyText || "").trim();
    if (!baseDesc) {
      message.error("Please enter a Description first (Step-1).");
      return;
    }

    // 3) Clean
    const descClean = cleanForTransport(
      baseDesc
        .replace(
          /[,’”“]/g,
          (s) => (({ "’": "'", "”": '"', "“": '"', "，": "," } as any)[s] || s)
        )
        .replace(/,+\s*$/g, "")
        .slice(0, 7000)
    );

    const urlBase = `${BASE_URL}/ai-service/agent/classifyStartConversation`;

    setStartersLoading(true);
    const ctrl = new AbortController();
    const timeoutId = setTimeout(() => ctrl.abort(), 20_000);

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
      setConStarter1(prompts[0] || "");
      setConStarter2(prompts[1] || "");
      setConStarter3(prompts[2] || "");
      setConStarter4(prompts[3] || "");
      message.success(
        `Added ${Math.min(prompts.length, 4)} conversation starters.`
      );
      return true;
    };

    try {
      let res: Response | undefined;

      // --- POST #1: JSON body (preferred) ---
      try {
        const h = new Headers(authHeaders);
        h.set("Content-Type", "application/json");
        res = await fetch(urlBase, {
          method: "POST",
          headers: h,
          body: JSON.stringify(
            stripEmpty({
              agentId: agentId || undefined,
              description: descClean,
            })
          ),
          signal: ctrl.signal,
        });
      } catch {
        res = undefined;
      }

      // If server rejects JSON (400/415) or request failed -> POST with query (no body)
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
          "Network/CORS error calling starters API. Ensure POST is allowed on this route and CORS is enabled."
        );
      }

      // Retry once for transient 5xx
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

  // Auto-generate on Preview open (instructions + starters)
  useEffect(() => {
    if (previewOpen && canPreview) {
      if (
        !previewAutoGenDoneRef.current &&
        !instructions.trim() &&
        !genLoading
      ) {
        previewAutoGenDoneRef.current = true;
        requestAndOpenEditor();
      }
      if (!startersAutoGenDoneRef.current && !startersLoading) {
        startersAutoGenDoneRef.current = true;
        suggestStartersFromAPI();
      }
    }
    if (!previewOpen) {
      previewAutoGenDoneRef.current = false;
      startersAutoGenDoneRef.current = false;
    }
  }, [
    previewOpen,
    canPreview,
    instructions,
    genLoading,
    startersLoading,
    requestAndOpenEditor,
    suggestStartersFromAPI,
  ]);

/* =========================
 * Publish (PATCH with fallback) – with conversation starters
 * ======================= */
const publishNow = useCallback(async () => {
  const userId = localStorage.getItem("userId") || "";
  const auth = getAuthHeader();

  // include starters in payload (trim to be safe; empty string if not set)
  const body = {
    agentName: (agentName || "").trim(),
    description: previewDescription,
    goals,
    instructions: (instructions || "").slice(0, 7000),
    purpose,
    roleUser,
    userId,
    view,
    conStarter1: (conStarter1 || "").trim(),
    conStarter2: (conStarter2 || "").trim(),
    conStarter3: (conStarter3 || "").trim(),
    conStarter4: (conStarter4 || "").trim(),
  };

  setLoading(true);
  try {
    // Primary: PATCH newAgentPublish
    let res = await fetch(`${BASE_URL}/ai-service/agent/newAgentPublish`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...auth },
      body: JSON.stringify(body),
    });

    // Fallback: POST confirmagentPublish
    if (!res.ok) {
      res = await fetch(`${BASE_URL}/ai-service/agent/confirmagentPublish`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify(body),
      });
    }

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Publish failed: ${res.status} ${txt}`);
    }

    message.success("Agent published successfully!");
    setPreviewOpen(false);
    navigate("/main/bharath-aistore/agents");
  } catch (e: any) {
    message.error(e?.message || "Publish failed");
  } finally {
    setLoading(false);
  }
}, [
  agentName,
  previewDescription,
  goals,
  instructions,
  purpose,
  roleUser,
  view,
  conStarter1,
  conStarter2,
  conStarter3,
  conStarter4,
  navigate,
]);


  const confirmPublish = useCallback(() => {
    if (!canPreview) {
      message.error("Please complete all fields before publishing.");
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
            <Tag color="blue">{labelOf(ROLE_OPTS, roleUser)}</Tag>
            <Tag color="purple">{labelOf(GOAL_OPTS, goals)}</Tag>
            <Tag color="green">{labelOf(PURPOSE_OPTS, purpose)}</Tag>
            <Tag color={view === "Public" ? "geekblue" : "default"}>
              {view === "Public" ? "Public use" : "Personal use"}
            </Tag>
          </div>
          <div style={{ marginTop: 8 }}>{previewDescription}</div>
        </div>
      ),
      okText: "Yes, Publish",
      cancelText: "No",
      okButtonProps: { style: { background: SUCCESS } },
      onOk: publishNow,
    });
  }, [
    canPreview,
    instructions,
    agentName,
    roleUser,
    goals,
    purpose,
    view,
    previewDescription,
    publishNow,
  ]);

  const handlePublishClick = useCallback(() => {
    if (!canPreview) {
      message.error("Please complete all fields before publishing.");
      return;
    }
    setPreviewOpen(true);
    message.info("Please review your agent before publishing.");
  }, [canPreview]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px 12px",
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 20,
          padding: "28px 20px",
          border: `1px solid ${BORDER}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1
            style={{
              margin: 0,
              color: "#1F2937",
              fontSize: 26,
              fontWeight: 700,
              background: "linear-gradient(135deg, #6C4CF4, #8B5CF6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Create Your AI Agent
          </h1>
          <p style={{ margin: "8px 0 0 0", color: TEXT_MUTED, fontSize: 15 }}>
            Build a custom AI assistant tailored to your needs
          </p>
        </div>

        {/* ===== Setup Card ===== */}
        <div
          style={{
            background: "#fff",
            border: `1px solid ${BORDER}`,
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <div className="setup-grid" style={{ display: "grid", gap: 14 }}>
            {/* I AM + LOOKING FOR row */}
            <div className="row-2" style={{ display: "grid", gap: 14 }}>
              <div>
                <InfoLabel
                  title="I AM"
                  info="Select the primary persona this agent is for."
                  required
                />
                <CompactSelect
                  value={roleUser}
                  onChange={setRoleUser}
                  options={ROLE_OPTS}
                  placeholder="Select role"
                  loading={nameLoading}
                />
              </div>
              <div>
                <InfoLabel
                  title="LOOKING FOR"
                  info="Pick the outcome you're targeting."
                  required
                />
                <CompactSelect
                  value={goals}
                  onChange={setGoals}
                  options={GOAL_OPTS}
                  placeholder="Select goal"
                  loading={nameLoading}
                />
              </div>
            </div>

            {/* Purpose */}
            <div>
              <InfoLabel
                title="TO"
                info="What will you mainly do with this agent?"
                required
              />
              <CompactSelect
                value={purpose}
                onChange={setPurpose}
                options={PURPOSE_OPTS}
                placeholder="Select purpose"
                loading={nameLoading}
              />
            </div>
          </div>
        </div>

        {/* ===== Agent Name ===== */}
        <div style={{ marginBottom: 18 }}>
          <InfoLabel
            title="Agent Name"
            required
            info="Short, memorable public name (3–80 chars)."
          />
          <div style={{ position: "relative", marginTop: 6, maxWidth: 520 }}>
            <input
              ref={nameInputRef}
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              maxLength={80}
              placeholder={
                nameLoading && !agentName
                  ? "Generating agent name…"
                  : "e.g., Career Coach AI"
              }
              style={{
                width: "100%",
                padding: "12px 44px 12px 12px",
                borderRadius: 10,
                border: `2px solid ${nameLoading ? PRIMARY : BORDER}`,
                outline: "none",
                background: nameLoading ? "#fbfaff" : "#fff",
                transition: "all 0.2s ease",
                fontSize: 15,
                fontWeight: 500,
              }}
            />
            {nameLoading && (
              <div
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: `2px solid ${BORDER}`,
                  borderTopColor: PRIMARY,
                  animation: "spin 0.9s linear infinite",
                }}
              />
            )}
          </div>
          <div
            style={{
              fontSize: 13,
              color: nameLoading ? PRIMARY : TEXT_MUTED,
              marginTop: 6,
              minHeight: 18,
            }}
          >
            {nameLoading
              ? "Finding a perfect name for your agent…"
              : !agentName
              ? "We'll suggest a name after you pick Role, Goal & Purpose"
              : `${nameCount}/80 characters`}
          </div>
        </div>

        {/* ===== Agent Description ===== */}
        <div style={{ marginBottom: 20 }}>
          <InfoLabel
            title="AGENT DESCRIPTION"
            required
            info="One short paragraph on who this helps and what it does."
            extra={
              <button
                onClick={suggestAgentDescription}
                disabled={descSuggestLoading}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: `1px solid ${PRIMARY}`,
                  background: "#fff",
                  color: PRIMARY,
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: descSuggestLoading ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {descSuggestLoading ? <Spin size="small" /> : <BulbOutlined />}
                Suggest Description
              </button>
            }
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={MAX_DESC}
            placeholder="Briefly describe who this helps and what it does…"
            style={{
              width: "100%",
              minHeight: 110,
              padding: 12,
              borderRadius: 10,
              border: `2px solid ${
                descCount >= MAX_DESC
                  ? ERROR
                  : descCount >= MIN_DESC
                  ? SUCCESS
                  : BORDER
              }`,
              marginTop: 6,
              outline: "none",
              fontSize: 15,
              resize: "vertical",
              fontFamily: "inherit",
              transition: "border-color 0.2s ease",
            }}
          />
          <div
            style={{
              fontSize: 13,
              color:
                descCount >= MAX_DESC
                  ? ERROR
                  : descCount >= MIN_DESC
                  ? SUCCESS
                  : TEXT_MUTED,
              textAlign: "right",
              marginTop: 6,
            }}
          >
            {descCount} / {MAX_DESC} characters
            {descCount < MIN_DESC && ` (minimum ${MIN_DESC})`}
          </div>
        </div>

        {/* ===== Visibility ===== */}
        <div style={{ marginBottom: 24 }}>
          <InfoLabel
            title="Visibility"
            info="Private: only you. Public: listed in Bharat AI Store."
          />
          <div
            style={{ display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap" }}
          >
            <button
              onClick={() => setView("Private")}
              style={{
                minWidth: 110,
                padding: "9px 12px",
                borderRadius: 10,
                border: `2px solid ${view === "Private" ? PRIMARY : BORDER}`,
                background: view === "Private" ? PRIMARY_LIGHT : "#fff",
                color: "#1F2937",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                transition: "all 0.2s ease",
              }}
            >
              <LockOutlined />
              Personal
            </button>
            <button
              onClick={() => setView("Public")}
              style={{
                minWidth: 110,
                padding: "9px 12px",
                borderRadius: 10,
                border: `2px solid ${view === "Public" ? PRIMARY : BORDER}`,
                background: view === "Public" ? PRIMARY_LIGHT : "#fff",
                color: "#1F2937",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                transition: "all 0.2s ease",
              }}
            >
              <GlobalOutlined />
              Public
            </button>
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => setPreviewOpen(true)}
            disabled={!canPreview}
            style={{
              minWidth: 120,
              padding: "9px 12px",
              borderRadius: 10,
              border: `2px solid ${PRIMARY}`,
              background: "#fff",
              color: PRIMARY,
              cursor: canPreview ? "pointer" : "not-allowed",
              fontWeight: 700,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 6,
              opacity: canPreview ? 1 : 0.6,
              transition: "all 0.2s ease",
            }}
          >
            <EyeOutlined />
            Preview
          </button>

          <button
            onClick={handlePublishClick}
            disabled={loading}
            style={{
              minWidth: 130,
              padding: "9px 12px",
              borderRadius: 10,
              border: "none",
              background: SUCCESS,
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
            }}
          >
            <BulbOutlined />
            {loading ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>

      {/* =========================
       * PREVIEW DRAWER
       * ======================= */}
      <Drawer
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <EyeOutlined />
            Agent Preview
          </div>
        }
        placement="right"
        width={Math.min(900, window.innerWidth * 0.9)}
        onClose={() => setPreviewOpen(false)}
        open={previewOpen}
        destroyOnClose={false}
        styles={{
          body: { padding: "20px 24px" },
          header: { borderBottom: `1px solid ${BORDER}`, padding: "16px 24px" },
          footer: { borderTop: `1px solid ${BORDER}`, padding: "16px 24px" },
        }}
        extra={
          <button
            onClick={() => setEditModalOpen(true)}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: `1px solid ${PRIMARY}`,
              background: PRIMARY,
              color: "#fff",
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
              display: "flex",
              gap: 10,
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ color: TEXT_MUTED, fontSize: 13, flex: 1 }}>
              Review your agent details before publishing
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={() => setPreviewOpen(false)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: `1px solid ${BORDER}`,
                  background: "#fff",
                  fontWeight: 700,
                  color: "#1F2937",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Close Preview
              </button>
              <button
                onClick={confirmPublish}
                disabled={!canPublish || loading}
                style={{
                  padding: "8px 14px",
                  borderRadius: 10,
                  border: "none",
                  background: canPublish ? SUCCESS : BORDER,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: canPublish ? "pointer" : "not-allowed",
                  opacity: canPublish ? 1 : 0.6,
                }}
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
        {/* Agent Summary */}
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
                color: "#1F2937",
                fontSize: 22,
                fontWeight: 700,
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
                {roleUser ? labelOf(ROLE_OPTS, roleUser) : "—"}
              </Tag>
              <Tag
                color="purple"
                icon={<AimOutlined />}
                style={{ borderRadius: 6, fontWeight: 500 }}
              >
                {goals ? labelOf(GOAL_OPTS, goals) : "—"}
              </Tag>
              <Tag
                color="green"
                icon={<RocketOutlined />}
                style={{ borderRadius: 6, fontWeight: 500 }}
              >
                {purpose ? labelOf(PURPOSE_OPTS, purpose) : "—"}
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
              background: "#F9FAFB",
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              padding: 14,
            }}
          >
            <div
              style={{
                fontWeight: 600,
                marginBottom: 6,
                color: "#374151",
                fontSize: 14,
              }}
            >
              Description
            </div>
            <div style={{ color: "#4B5563", lineHeight: 1.6, fontSize: 15 }}>
              {previewDescription}
            </div>
          </div>
        </div>

        {/* Conversation Starters */}
        <div
          style={{
            marginBottom: 20,
            background: "#fff",
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            padding: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <h3
              style={{
                margin: 0,
                color: "#1F2937",
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              Conversation Starters
            </h3>
            {startersLoading && <Spin size="small" />}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 16,
              marginTop: 8,
            }}
          >
            {[1, 2, 3, 4].map((i) => {
              const val =
                i === 1
                  ? conStarter1
                  : i === 2
                  ? conStarter2
                  : i === 3
                  ? conStarter3
                  : conStarter4;
              const setter =
                i === 1
                  ? setConStarter1
                  : i === 2
                  ? setConStarter2
                  : i === 3
                  ? setConStarter3
                  : setConStarter4;

              return (
                <div
                  key={i}
                  style={{
                    background: "#F9FAFB",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 10,
                    padding: "10px 12px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      color: "#1F2937",
                      marginBottom: 6,
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Conversation Starter {i}</span>
                    <Tooltip title="You can type manually or use the generated one.">
                      <InfoCircleOutlined style={{ color: TEXT_MUTED }} />
                    </Tooltip>
                  </div>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={`e.g., "Do you want a document template?"`}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: `1px solid ${BORDER}`,
                      outline: "none",
                      fontSize: 14,
                      color: "#374151",
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 10 }}>
            <button
              onClick={suggestStartersFromAPI}
              disabled={startersLoading}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: `1px solid ${PRIMARY}`,
                background: "#fff",
                color: PRIMARY,
                fontWeight: 600,
                fontSize: 13,
                cursor: startersLoading ? "not-allowed" : "pointer",
              }}
            >
              {startersLoading ? "Generating…" : "Regenerate Starters"}
            </button>
          </div>
        </div>

        <Divider style={{ margin: "20px 0" }} />

        {/* Instructions */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h3
                style={{
                  margin: 0,
                  color: "#1F2937",
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                Instructions
              </h3>
              <Tooltip title="We auto-generate instructions based on your description. You can edit them to refine behavior.">
                <InfoCircleOutlined
                  style={{ color: TEXT_MUTED, fontSize: 16 }}
                />
              </Tooltip>
            </div>

            {!!instructions.trim() && !genLoading && (
              <button
                onClick={() => setShowInstr((v) => !v)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: `1px solid ${PRIMARY}`,
                  background: showInstr ? PRIMARY : "#fff",
                  color: showInstr ? "#fff" : PRIMARY,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {showInstr ? "Hide Instructions" : "View Instructions"}
              </button>
            )}
          </div>

          {!!instructions.trim() && !genLoading && !showInstr && (
            <div
              style={{
                marginBottom: 12,
                fontSize: 14,
                color: "#4B5563",
                background: "#F3F4F6",
                border: `1px solid ${BORDER}`,
                borderRadius: 8,
                padding: "10px 12px",
                lineHeight: 1.5,
              }}
            >
              <div
                style={{ fontWeight: 600, marginBottom: 4, color: "#374151" }}
              >
                Instructions Ready
              </div>
              {instructions.slice(0, 150)}
              {instructions.length > 150 ? "…" : ""}
            </div>
          )}

          <div
            style={{
              position: "relative",
              whiteSpace: "pre-wrap",
              background: "#fff",
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              padding: 14,
              minHeight: 180,
              color: instructions && showInstr ? "#374151" : TEXT_MUTED,
              lineHeight: 1.6,
              fontSize: 14,
              display:
                genLoading || (!instructions.trim() && !genLoading) || showInstr
                  ? "block"
                  : "none",
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
                <div style={{ color: PRIMARY, fontWeight: 700, fontSize: 15 }}>
                  Generating instructions…
                </div>
              </div>
            )}
            {instructions
              ? instructions
              : "No instructions yet. Click 'Generate Instructions' to create AI-powered instructions for your agent."}
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 12,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setEditModalOpen(true)}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: `1px solid ${PRIMARY}`,
                background: PRIMARY,
                color: "#fff",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <EditOutlined />
              {instructions ? "Edit Instructions" : "Generate Instructions"}
            </button>

            {!!instructions.trim() && !showInstr && (
              <button
                onClick={() => setShowInstr(true)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: `1px solid ${BORDER}`,
                  background: "#fff",
                  color: "#374151",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                View Full Instructions
              </button>
            )}
          </div>
        </div>
      </Drawer>

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <EditOutlined />
            Instructions Editor
          </div>
        }
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
        width={800}
        styles={{
          body: { padding: "24px 0" },
          header: { borderBottom: `1px solid ${BORDER}`, padding: "16px 24px" },
        }}
        destroyOnClose={false}
      >
        <div style={{ padding: "0 24px" }}>
          <div
            style={{
              marginBottom: 12,
              color: TEXT_MUTED,
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            Auto-generate instructions first, then refine manually. Keep clear
            steps, tone, and examples.
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={requestAndOpenEditor}
              disabled={genLoading}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: `1px solid ${PRIMARY}`,
                background: PRIMARY,
                color: "#fff",
                fontWeight: 600,
                fontSize: 13,
                cursor: genLoading ? "not-allowed" : "pointer",
                opacity: genLoading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {genLoading ? (
                <>
                  <Spin size="small" /> Generating…
                </>
              ) : (
                <>
                  <BulbOutlined /> Generate Instructions
                </>
              )}
            </button>
          </div>

          <textarea
            value={editDraft}
            onChange={(e) => setEditDraft(e.target.value)}
            placeholder="Write or paste instructions here…"
            maxLength={7000}
            style={{
              width: "100%",
              minHeight: 280,
              padding: 12,
              borderRadius: 8,
              border: `1px solid ${BORDER}`,
              background: "#fff",
              outline: "none",
              fontSize: 14,
              lineHeight: 1.5,
              resize: "vertical",
              fontFamily: "inherit",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 12,
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div style={{ color: TEXT_MUTED, fontSize: 13 }}>
              {editDraft.length} / 7000 characters
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={() => setEditModalOpen(false)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: `1px solid ${BORDER}`,
                  background: "#fff",
                  fontWeight: 600,
                  color: "#374151",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const val = (editDraft || "").trim();
                  if (!val) {
                    message.warning("Please add instructions before saving.");
                    return;
                  }
                  setInstructions(val);
                  setShowInstr(false);
                  message.success("Instructions saved successfully!");
                  setEditModalOpen(false);
                }}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: PRIMARY,
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Save Instructions
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Responsive: two fields on a row for md+ screens */
        .setup-grid .row-2 { grid-template-columns: 1fr; }
        @media (min-width: 768px) {
          .setup-grid .row-2 { grid-template-columns: 1fr 1fr; }
        }

        /* Make selects compact on wide screens too */
        .compact-select { width: 100%; max-width: 280px; }

        @media (max-width: 768px) {
          .ant-drawer-content-wrapper { width: 100% !important; }
          .compact-select { max-width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Agentcreation;
