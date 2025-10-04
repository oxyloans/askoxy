// /src/AgentStore/CreateAgentWizard.tsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  Steps,
  Input,
  Select,
  Button,
  Card,
  Row,
  Col,
  Checkbox,
  Modal,
  Switch,
  message,
  Typography,
  Space,
  Tag,
  Divider,
  Tooltip,
  Radio,
} from "antd";
import {
  UserOutlined,
  SettingOutlined,
  BulbOutlined,
  RocketOutlined,
  EyeOutlined,
  EditOutlined,
  InfoCircleOutlined,
  AudioOutlined,
  AudioMutedOutlined,
} from "@ant-design/icons";
import BASE_URL from "../Config";
import axios from "axios";

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

type ModelInfo = {
  id: string;
  object?: string;
  created?: number;
  owned_by?: string;
};

type AgentApiResponse = {
  id: string | null;
  userId: string | null;
  name: string;
  voiceStatus: boolean | null;
  activeStatus: boolean;
  userRole: string | null;
  userExperience: number | null;
  domain: string | null;
  subDomain: string | null;
  targetUser: string | null;
  mainProblemSolved: string | null;
  description: string | null;
  acheivements: string | null;
  instructions: string | null;
  usageModel: string | null;
  language: string | null;
  business: string | null;
  responseFormat: "auto" | "json_object" | string;
  agentId: string | null;
  assistantId: string | null;
  message: string | null;
  creatorName?: string | null;
};

const DOMAIN_OPTIONS = [
  "Law",
  "Finance",
  "Healthcare",
  "Taxation",
  "Education",
  "Technology",
  "Marketing",
  "Human Resources",
  "Operations",
  "Manufacturing",
  "Retail",
  "Other",
];

const SUBDOMAIN_OPTIONS = [
  "Civil Law",
  "Corporate Law",
  "GST",
  "Personal Finance",
  "Data Analytics",
  "Software Development",
  "Digital Marketing",
  "Recruitment",
  "Supply Chain",
  "Customer Support",
  "Other",
];

const TARGET_USER_OPTIONS = [
  "IT Professionals",
  "Doctors",
  "Students",
  "Lawyers",
  "Entrepreneurs",
  "Startups",
  "SMBs",
  "Enterprises",
  "Marketers",
  "Sales Teams",
  "HR/Recruiters",
  "Teachers",
  "Researchers",
  "Designers",
  "Product Managers",
  "Developers",
  "Accountants",
  "CXOs",
  "Support Teams",
  "Operations",
  "Manufacturing",
  "Bankers",
  "Investors",
  "Freelancers",
  "Consultants",
  "Other",
];

const LIMITS = {
  nameMin: 3,
  nameMax: 50,
  creatorMin: 3,
  creatorMax: 50,
  roleOtherMin: 2,
  roleOtherMax: 50,
  expMax: 120,
  achievementsMax: 150,
  descMin: 10,
  descMax: 250,

  businessMin: 3,
  businessMax: 100,
  domainOtherMin: 2,
  domainOtherMax: 60,
  subDomainOtherMin: 2,
  subDomainOtherMax: 60,

  problemMax: 250,
  solutionMax: 250,

  targetOtherMin: 2,
  targetOtherMax: 60,
  ageOtherMin: 2,
  ageOtherMax: 20,

  contactMin: 5,
  contactMax: 100,

  starterMin: 5,
  starterMax: 150,

  instructionsMax: 7000, // you already slice to 7000 in cleanInstructionText
};

const AGE_LIMIT_OPTIONS = [
  "Below 18",
  "18-25",
  "26-40",
  "40-55",
  "55+",
  "Other",
];
const TONE_OPTIONS = [
  "Helpful, Professional",
  "Friendly, Supportive",
  "Formal, Concise",
  "Expert, Analytical",
  "Casual, Empathetic",
];
const RESPONSE_FORMATS = ["auto", "json_object"] as const;

function getAuthToken(): string {
  try {
    return (
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("id_token") ||
      localStorage.getItem("auth_token") ||
      ""
    ).trim();
  } catch {
    return "";
  }
}
function coerceStepFromScreenStatus(s?: string | null): 0 | 1 | 2 | 3 {
  switch (s) {
    case "STAGE2":
      return 1;
    case "STAGE3":
      return 2;
    case "STAGE4":
      return 3;
    case "STAGE1":
    default:
      return 0;
  }
}

function getAuthHeader(): Record<string, string> {
  const t = getAuthToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

function stripEmpty<T extends object>(obj: T): Partial<T> {
  const out = {} as Partial<T>;
  (Object.keys(obj) as (keyof T)[]).forEach((k) => {
    const v = obj[k];
    if (
      v !== undefined &&
      v !== null &&
      v !== "" &&
      !(Array.isArray(v) && v.length === 0)
    ) {
      out[k] = v;
    }
  });
  return out;
}

function cleanInstructionText(txt: string): string {
  if (!txt) return "";
  let t = txt
    .replace(/^\uFEFF/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/^#+\s?/gm, "")
    .replace(/\*+/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return t.slice(0, 7000);
}

const CreateAgentWizard: React.FC = () => {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [loading, setLoading] = useState(false);

  // Step 1 - Profile
  const [creatorName, setCreatorName] = useState("");
  const [acheivements, setAcheivements] = useState("");
  const [name, setName] = useState("");
  const [userRole, setUserRole] = useState("Advocate");
  const [userRoleOther, setUserRoleOther] = useState("");
  const [userExperienceSummary, setUserExperienceSummary] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("English");

  // Step 4 fields
  const [rateThisPlatform, setRateThisPlatform] = useState<number>(0);
  const [shareYourFeedback, setShareYourFeedback] = useState<string>("");
  const [successData, setSuccessData] = useState<AgentApiResponse | null>(null);

  // Step 2 - Business & Model & Problem
  const [business, setBusiness] = useState("");
  const [domain, setDomain] = useState<string | undefined>(undefined);
  const [domainOther, setDomainOther] = useState("");
  const [subDomain, setSubDomain] = useState<string | undefined>(undefined);
  const [subDomainOther, setSubDomainOther] = useState("");
  const [selectedModelId, setSelectedModelId] = useState<string | undefined>(
    undefined
  );
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [solveProblem, setSolveProblem] = useState<"YES" | "NO" | "">("");
  const [mainProblemText, setMainProblemText] = useState("");
  const [uniqueSolution, setUniqueSolution] = useState("");

  const [showViewInstructions, setShowViewInstructions] = useState(false);
  const [isViewEditing, setIsViewEditing] = useState(false);

  const location = useLocation() as any;
  const [search] = useSearchParams();

  // ===== Speech Recognition Helpers =====
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Map UI language -> BCP-47 for SpeechRecognition
  function languageToBCP47(uiLang?: string) {
    const v = (uiLang || "").toLowerCase();
    if (v.includes("telugu") || v.includes("తెలుగు")) return "te-IN";
    if (v.includes("hindi") || v.includes("हिंदी")) return "hi-IN";
    return "en-US"; // default English
  }

  // Secure context check (required by Chrome)
  function isSecureContextOk() {
    return window.isSecureContext || window.location.hostname === "localhost";
  }

  function startListening({ toModal }: { toModal: boolean }) {
    try {
      if (!isSecureContextOk()) {
        message.error("Voice input requires HTTPS (or localhost).");
        return;
      }
      const SR: any =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (!SR) {
        message.error("Speech recognition is not supported in this browser.");
        return;
      }
      const recog = new SR();
      recognitionRef.current = recog;
      recog.lang = languageToBCP47(language);
      recog.interimResults = false;
      recog.maxAlternatives = 1;

      recog.onstart = () => setIsListening(true);

      recog.onresult = (evt: any) => {
        const transcript = evt?.results?.[0]?.[0]?.transcript || "";
        if (!transcript) return;
        if (toModal) {
          setTempInstructions((prev) =>
            prev ? prev + "\n" + transcript : transcript
          );
        } else {
          setInstructions((prev) =>
            prev ? prev + "\n" + transcript : transcript
          );
        }
        message.success("Voice captured.");
      };

      recog.onerror = (e: any) => {
        // Typical errors: "no-speech", "audio-capture", "not-allowed"
        const code = e?.error || "";
        if (code === "not-allowed") {
          message.error(
            "Microphone permission denied. Please allow mic access."
          );
        } else if (code === "no-speech") {
          message.warning("No speech detected. Try again closer to the mic.");
        } else if (code === "audio-capture") {
          message.error("No microphone found. Check your device.");
        } else {
          message.error("Could not capture voice. Please try again.");
        }
      };

      recog.onend = () => setIsListening(false);

      recog.start(); // must be called from a user gesture (button click)
    } catch {
      setIsListening(false);
      message.error("Could not start voice capture. Please try again.");
    }
  }

  function stopListening() {
    try {
      recognitionRef.current?.stop?.();
    } catch {}
  }

  // Allowed header titles
  const HEADER_TITLES = [
    "AI Twin",
    "AI Enabler",
    "AI Discovery",
    "AI Companion",
    "AI Executor",
    "AI Validator",
  ] as const;
  type HeaderTitle = (typeof HEADER_TITLES)[number];

  function normalizeHeaderTitle(s?: string): HeaderTitle {
    const v = (s || "").trim();
    return (HEADER_TITLES as readonly string[]).includes(v)
      ? (v as HeaderTitle)
      : "AI Twin";
  }

  const [headerTitle, setHeaderTitle] = useState<HeaderTitle>(
    normalizeHeaderTitle((location as any)?.state?.headerTitle)
  );
  const [headerStatus] = useState<boolean>(false); // always send false per requirement

  // Step 3 - Audience + Config (+ Contact moved ABOVE Instructions)
  const [targetUsers, setTargetUsers] = useState<string[]>([]);
  const [targetUserOther, setTargetUserOther] = useState("");
  const [genderSelections, setGenderSelections] = useState<string[]>([]);
  const [ageLimits, setAgeLimits] = useState<string[]>([]);
  const [ageOther, setAgeOther] = useState<string>("");

  const [converstionTone, setConverstionTone] = useState<string | undefined>(
    undefined
  );
  const [responseFormat, setResponseFormat] =
    useState<(typeof RESPONSE_FORMATS)[number]>("auto");

  const [instructions, setInstructions] = useState("");
  const [generated, setGenerated] = useState(false);
  const [tempInstructions, setTempInstructions] = useState("");

  // IDs
  const [agentId, setAgentId] = useState<string>("");
  const [assistantId, setAssistantId] = useState<string>("");

  // Contact (Step 3 — placed BEFORE Instructions now)
  const [shareContact, setShareContact] = useState<"YES" | "NO">("NO");
  const [contactDetails, setContactDetails] = useState("");

  // Step 4 – Starters & Status (min 2 required)
  const [conStarter1, setConStarter1] = useState("");
  const [conStarter2, setConStarter2] = useState("");
  const [conStarter3, setConStarter3] = useState("");
  const [conStarter4, setConStarter4] = useState("");
  const [activeStatus, setActiveStatus] = useState(true);

  // Voice: default inactive
  const [voiceStatus] = useState<boolean>(false);

  // profile cache (for Share Contact flow)
  const profileRef = useRef<{
    firstName?: string;
    lastName?: string;
    email?: string;
    mobileNumber?: string;
    whatsappNumber?: string;
  } | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);

  // Preview modal + Store choices
  const [showPreview, setShowPreview] = useState(false);
  const [storeBharat, setStoreBharat] = useState(false);
  const [storeOxy, setStoreOxy] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);

  // simple styles
  const purpleBtn: React.CSSProperties = {
    background: "linear-gradient(135deg, #722ed1 0%, #fa8c16 100%)",
    border: "none",
    borderRadius: "8px",
  };
  const compactInputStyle: React.CSSProperties = {
    borderRadius: "8px",
    border: "2px solid #f0f0f0",
    transition: "all 0.3s ease",
  };

  const userId = localStorage.getItem("userId") || "";
  const navigate = useNavigate();
  const isEditMode =
    location?.state?.mode === "edit" || search.get("mode") === "edit";
  const editSeed:
    | (Partial<AgentApiResponse & Record<string, any>> | undefined)
    | undefined = location?.state?.seed;

  // --- ID hydration: URL params -> state; fallback to sessionStorage ---
  useEffect(() => {
    const fromUrlAgent = (search.get("agentId") || "").trim();
    const fromUrlAsst = (search.get("assistantId") || "").trim();

    if (fromUrlAgent && !agentId) setAgentId(fromUrlAgent);
    if (fromUrlAsst && !assistantId) setAssistantId(fromUrlAsst);

    if (!fromUrlAgent && !agentId) {
      const ssAgent = sessionStorage.getItem("edit_agentId") || "";
      if (ssAgent) setAgentId(ssAgent);
    }
    if (!fromUrlAsst && !assistantId) {
      const ssAsst = sessionStorage.getItem("edit_assistantId") || "";
      if (ssAsst) setAssistantId(ssAsst);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const effectiveUserRole = useMemo(() => {
    return userRole === "Other" ? userRoleOther.trim() || "Other" : userRole;
  }, [userRole, userRoleOther]);

  const genderForText = useMemo(
    () => genderSelections.filter(Boolean).join(", "),
    [genderSelections]
  );

  const resolvedDomain = useMemo(() => {
    return domain === "Other" ? domainOther.trim() || "Other" : domain || "";
  }, [domain, domainOther]);

  const resolvedSubDomain = useMemo(() => {
    return subDomain === "Other"
      ? subDomainOther.trim() || "Other"
      : subDomain || "";
  }, [subDomain, subDomainOther]);

  const resolvedTargetUsersString = useMemo(() => {
    const hasOther = targetUsers.includes("Other");
    const list = targetUsers
      .map((u) =>
        u === "Other" && targetUserOther.trim() ? targetUserOther.trim() : u
      )
      .filter(Boolean);
    return list.join(", ");
  }, [targetUsers, targetUserOther]);

  const resolvedAgeLimitsString = useMemo(() => {
    return ageLimits
      .map((a) => (a === "Other" ? ageOther.trim() || "Other" : a))
      .filter(Boolean)
      .join(", ");
  }, [ageLimits, ageOther]);

  function getUiToken(): string {
    return (
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("id_token") ||
      localStorage.getItem("auth_token") ||
      ""
    );
  }
  const uiToken = getUiToken();

  const customerIdFromStorage =
    localStorage.getItem("customerId") || userId || "";

  const fetchProfileData = async () => {
    try {
      setIsLoadingProfile(true);
      const response = await axios.get(
        `${BASE_URL}/user-service/customerProfileDetails`,
        {
          params: { customerId: customerIdFromStorage },
          headers: { Authorization: `Bearer ${uiToken}` },
        }
      );
      const data = response?.data || {};
      profileRef.current = {
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        mobileNumber: data.mobileNumber || "",
        whatsappNumber: data.whatsappNumber || "",
      };

      // Prefill Creator Name if empty
      const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();
      if (fullName) setCreatorName(fullName);

      if (shareContact === "YES" && !contactDetails) {
        const best =
          data.mobileNumber || data.whatsappNumber || data.email || "";
        if (best) setContactDetails(best);
      }
    } catch {
      // optionally: message.warning("Could not fetch profile");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (uiToken && customerIdFromStorage) {
      fetchProfileData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerIdFromStorage, uiToken]);

  // ====== NEW: fetch previous agent drafts if user returns (not edit mode) ======
  useEffect(() => {
    const preloadFromAllAgents = async () => {
      try {
        if (isEditMode) return;
        if (!userId) return;
        if (agentId || assistantId || editSeed) return;

        const url = `${BASE_URL}/ai-service/agent/allAgentDataList?userId=${encodeURIComponent(
          userId
        )}`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        const list: any[] = Array.isArray(data?.assistants)
          ? data.assistants
          : [];
        if (!list.length) return;

        // pick the most recent by created_at
        list.sort((a, b) => {
          const ta = new Date(a.created_at || 0).getTime();
          const tb = new Date(b.created_at || 0).getTime();
          return tb - ta;
        });
        const seed = list[0];

        // IDs
        setAgentId(String(seed.id || seed.agentId || ""));
        setAssistantId(String(seed.assistantId || ""));

        // Step 1 – Profile
        setName(seed.Name || seed.name || "");
        setDescription(seed.description || "");
        setLanguage(seed.language || "English");
        setUserExperienceSummary(seed.userExperienceSummary || "");
        setUserRole(seed.userRole || "Advocate");
        setCreatorName(String(seed.creatorName || ""));
        setAcheivements(String(seed.acheivements || ""));

        // Step 2 – Business/model/problem
        const d = seed.domain || "";
        setDomain(DOMAIN_OPTIONS.includes(d) ? d : d ? "Other" : undefined);
        setDomainOther(!DOMAIN_OPTIONS.includes(d) ? d : "");

        const sd = seed.subDomain || "";
        setSubDomain(
          SUBDOMAIN_OPTIONS.includes(sd) ? sd : sd ? "Other" : undefined
        );
        setSubDomainOther(!SUBDOMAIN_OPTIONS.includes(sd) ? sd : "");

        setBusiness(seed.business || "");
        setSelectedModelId(seed.usageModel || undefined);

        const priorProblem = String(seed.mainProblemSolved || "").trim();
        const priorSolution = String(seed.uniqueSolution || "").trim();
        setMainProblemText(priorProblem);
        setUniqueSolution(priorSolution);
        setSolveProblem(priorProblem ? "YES" : "");

        // Step 3 – audience/config/contact
        const priorTarget = String(seed.targetUser || "").trim();
        if (priorTarget) {
          const arr = priorTarget
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean);
          setTargetUsers(arr);
        }
        const priorAge = String(seed.ageLimit || "").trim();
        if (priorAge) {
          const tokens = priorAge
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean);
          const known = new Set(AGE_LIMIT_OPTIONS);
          const nextAges: string[] = [];
          let customFound = "";
          tokens.forEach((t) => {
            if (known.has(t) && t !== "Other") {
              nextAges.push(t);
            } else {
              customFound = t;
              nextAges.push("Other");
            }
          });
          setAgeLimits(Array.from(new Set(nextAges)));
          if (customFound) setAgeOther(customFound);
        }
        if (seed.gender) {
          setGenderSelections(
            String(seed.gender)
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          );
        }
        setConverstionTone(seed.converstionTone || undefined);
        setResponseFormat(seed.responseFormat || undefined);
        setInstructions(seed.instructions || "");

        const cd = String(seed.contactDetails || "");
        if (cd) {
          setShareContact("YES");
          setContactDetails(cd);
        } else {
          setShareContact("NO");
          setContactDetails("");
        }

        // Step 4 – starters/status
        setConStarter1(seed.conStarter1 || "");
        setConStarter2(seed.conStarter2 || "");
        setConStarter3(seed.conStarter3 || "");
        setConStarter4(seed.conStarter4 || "");
        setActiveStatus(Boolean(seed.activeStatus));
      } catch {
        // silent
      }
    };
    preloadFromAllAgents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, userId, agentId, assistantId, editSeed]);

  const classifyText = useMemo(() => {
    const parts = [
      description?.trim(),
      solveProblem && `Solving Problem: ${solveProblem}`,
      uniqueSolution?.trim() && `Solution: ${uniqueSolution.trim()}`,
      (resolvedDomain?.trim() || resolvedSubDomain?.trim()) &&
        `Domain: ${[resolvedDomain?.trim(), resolvedSubDomain?.trim()]
          .filter(Boolean)
          .join(" / ")}`,
      business?.trim() && `Business: ${business.trim()}`,
      resolvedTargetUsersString && `Target: ${resolvedTargetUsersString}`,
      genderForText && `Gender: ${genderForText}`,
      resolvedAgeLimitsString && `Age: ${resolvedAgeLimitsString}`,
      converstionTone?.trim() && `Tone: ${converstionTone.trim()}`,
      responseFormat && `Response: ${responseFormat}`,
      selectedModelId?.trim() && `Model: ${selectedModelId.trim()}`,
      language?.trim() && `Language: ${language.trim()}`,
    ].filter(Boolean);
    return parts.join(" | ");
  }, [
    description,
    solveProblem,
    uniqueSolution,
    resolvedDomain,
    resolvedSubDomain,
    business,
    resolvedTargetUsersString,
    genderForText,
    resolvedAgeLimitsString,
    converstionTone,
    responseFormat,
    selectedModelId,
    language,
  ]);

  const resetWizard = () => {
    // Clear any edit IDs
    sessionStorage.removeItem("edit_agentId");
    sessionStorage.removeItem("edit_assistantId");

    // Step + UI
    setStep(0);
    setShowPreview(false);
    setSuccessData(null);
    setLoading(false);

    // IDs
    setAgentId("");
    setAssistantId("");

    // Step 1 – Profile
    const fullName = `${profileRef.current?.firstName || ""} ${
      profileRef.current?.lastName || ""
    }`.trim();
    setCreatorName(fullName || ""); // prefill from profile again
    setAcheivements("");
    setName("");
    setUserRole("Advocate");
    setUserRoleOther("");
    setUserExperienceSummary("");
    setDescription("");
    setLanguage("English");

    // Step 2 – Business & Model & Problem
    setBusiness("");
    setDomain(undefined);
    setDomainOther("");
    setSubDomain(undefined);
    setSubDomainOther("");
    setSelectedModelId(undefined);
    setSolveProblem("");
    setMainProblemText("");
    setUniqueSolution("");
    setResponseFormat("auto");

    // Step 3 – Audience + Config + Contact
    setTargetUsers([]);
    setTargetUserOther("");
    setGenderSelections([]);
    setAgeLimits([]);
    setAgeOther("");
    setConverstionTone(undefined);
    setShareContact("NO");
    setContactDetails("");
    setInstructions("");
    setGenerated(false);
    setTempInstructions("");

    // Step 4 – Starters & Status
    setConStarter1("");
    setConStarter2("");
    setConStarter3("");
    setConStarter4("");
    setActiveStatus(true);

    // Optional: refresh profile to ensure creator name stays synced
    try {
      fetchProfileData();
    } catch {}
  };

  // ===== Allowed Models =====
  const ALLOWED_MODELS = ["gpt-4o", "dall-e-3", "dall-e-2"];
  const FALLBACK_MODELS_ALLOWED: ModelInfo[] = ALLOWED_MODELS.map((id) => ({
    id,
    owned_by: "openai",
  }));

  useEffect(() => {
    if (step !== 1) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/ai-service/agent/models`, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
        });

        if (!res.ok) throw new Error(`Models failed: ${res.status}`);
        const data = await res.json();
        const arr = Array.isArray(data?.data) ? data.data : [];
        const filtered = arr.filter((m: any) => ALLOWED_MODELS.includes(m.id));
        setModels(filtered.length ? filtered : FALLBACK_MODELS_ALLOWED);
        if (!filtered.length) {
          message.warning(
            "Models API returned empty/unsupported list. Using defaults."
          );
        }
      } catch (err: any) {
        setModels(FALLBACK_MODELS_ALLOWED);
        message.warning(
          err?.message || "Failed to load models — using defaults."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [step]);

  const within = (v: string, min: number, max: number) =>
    v.trim().length >= min && v.trim().length <= max;

  const validateStep0 = (): boolean => {
    const missing: string[] = [];

    if (!name.trim()) {
      missing.push("Agent Name");
    } else if (!within(name, LIMITS.nameMin, LIMITS.nameMax)) {
      message.error(
        `Agent Name must be ${LIMITS.nameMin}–${LIMITS.nameMax} characters.`
      );
      return false;
    }

    if (!creatorName.trim()) {
      missing.push("Creator Name");
    } else if (!within(creatorName, LIMITS.creatorMin, LIMITS.creatorMax)) {
      message.error(
        `Creator Name must be ${LIMITS.creatorMin}–${LIMITS.creatorMax} characters.`
      );
      return false;
    }

    if (!(effectiveUserRole || "").trim()) {
      missing.push("Professional Identity");
    } else if (userRole === "Other") {
      if (!within(userRoleOther, LIMITS.roleOtherMin, LIMITS.roleOtherMax)) {
        message.error(
          `Please describe your profession in ${LIMITS.roleOtherMin}–${LIMITS.roleOtherMax} characters.`
        );
        return false;
      }
    }

    if (!description.trim()) {
      missing.push("Description");
    } else if (!within(description, LIMITS.descMin, LIMITS.descMax)) {
      message.error(
        `Description must be ${LIMITS.descMin}–${LIMITS.descMax} characters.`
      );
      return false;
    }

    if (!language.trim()) {
      missing.push("Language");
    }

    // soft caps already on inputs:
    if (userExperienceSummary.length > LIMITS.expMax) {
      message.error(
        `Creator Experience must be ≤ ${LIMITS.expMax} characters.`
      );
      return false;
    }
    if (acheivements.length > LIMITS.achievementsMax) {
      message.error(
        `Strengths must be ≤ ${LIMITS.achievementsMax} characters.`
      );
      return false;
    }

    if (missing.length) {
      message.error(
        `Please fill the following before Continue: ${missing.join(", ")}`
      );
      return false;
    }
    return true;
  };

  const validateStep1 = (): boolean => {
    const missing: string[] = [];

    // Business/Idea
    if (!business.trim()) {
      missing.push("Business/Idea");
    } else if (!within(business, LIMITS.businessMin, LIMITS.businessMax)) {
      message.error(
        `Business/Idea must be ${LIMITS.businessMin}–${LIMITS.businessMax} characters.`
      );
      return false;
    }

    // Domain
    if (!(resolvedDomain || "").trim()) {
      missing.push("Domain/Sector");
    } else if (domain === "Other") {
      if (!within(domainOther, LIMITS.domainOtherMin, LIMITS.domainOtherMax)) {
        message.error(
          `Custom Domain must be ${LIMITS.domainOtherMin}–${LIMITS.domainOtherMax} characters.`
        );
        return false;
      }
    }

    // Sub-domain
    if (!(resolvedSubDomain || "").trim()) {
      missing.push("Sub-Domain/Subsector");
    } else if (subDomain === "Other") {
      if (
        !within(
          subDomainOther,
          LIMITS.subDomainOtherMin,
          LIMITS.subDomainOtherMax
        )
      ) {
        message.error(
          `Custom Sub-domain must be ${LIMITS.subDomainOtherMin}–${LIMITS.subDomainOtherMax} characters.`
        );
        return false;
      }
    }

    // Model
    if (!selectedModelId?.trim()) {
      missing.push("GPT Model");
    }

    // Problem/Solution
    if (!solveProblem) missing.push("Are you solving a problem?");
    if (solveProblem === "YES") {
      if (!mainProblemText.trim()) missing.push("Main Problem to Solve");
      if (!uniqueSolution.trim()) missing.push("Unique Solution Method");
      if (mainProblemText.length > LIMITS.problemMax) {
        message.error(
          `Main Problem to Solve must be ≤ ${LIMITS.problemMax} characters.`
        );
        return false;
      }
      if (uniqueSolution.length > LIMITS.solutionMax) {
        message.error(
          `Unique Solution Method must be ≤ ${LIMITS.solutionMax} characters.`
        );
        return false;
      }
    }

    if (missing.length) {
      message.error(
        `Please fill the following before Continue: ${missing.join(", ")}`
      );
      return false;
    }
    return true;
  };

  const isAllSelected = (selected: string[], allOptions: string[]) =>
    allOptions.every((opt) => selected.includes(opt));

  const validateStep2 = (): boolean => {
    const missing: string[] = [];

    // Target Customers
    const allCustomersSelected = isAllSelected(
      targetUsers,
      TARGET_USER_OPTIONS
    );
    if (!targetUsers.length) missing.push("Target Customers");
    if (!converstionTone?.trim()) missing.push("Conversation Tone");
    if (
      targetUsers.includes("Other") &&
      !allCustomersSelected &&
      !targetUserOther.trim()
    ) {
      missing.push("Target Customers (Other)");
    } else if (targetUsers.includes("Other") && targetUserOther.trim()) {
      if (
        !within(targetUserOther, LIMITS.targetOtherMin, LIMITS.targetOtherMax)
      ) {
        message.error(
          `Custom Target must be ${LIMITS.targetOtherMin}–${LIMITS.targetOtherMax} characters.`
        );
        return false;
      }
    }

    // Gender
    if (genderSelections.length === 0) missing.push("Target Audience Gender");

    // Age
    const allAgesSelected = isAllSelected(ageLimits, AGE_LIMIT_OPTIONS);
    if (!ageLimits.length) missing.push("Target Age Limit(s)");
    if (ageLimits.includes("Other") && !allAgesSelected) {
      if (!within(ageOther, LIMITS.ageOtherMin, LIMITS.ageOtherMax)) {
        message.error(
          `Custom Age must be ${LIMITS.ageOtherMin}–${LIMITS.ageOtherMax} characters.`
        );
        return false;
      }
    }

    // Contact
    if (shareContact === "YES") {
      if (!contactDetails.trim()) {
        missing.push("Contact Details (since you chose to share)");
      } else if (
        !within(contactDetails, LIMITS.contactMin, LIMITS.contactMax)
      ) {
        message.error(
          `Contact Details must be ${LIMITS.contactMin}–${LIMITS.contactMax} characters.`
        );
        return false;
      }
    }

    // Instructions
    if (!instructions.trim()) {
      missing.push("Instructions (Generate or Write your own)");
    } else if (instructions.length > LIMITS.instructionsMax) {
      message.error(
        `Instructions must be ≤ ${LIMITS.instructionsMax} characters.`
      );
      return false;
    }

    if (missing.length) {
      message.error(
        `Please fill the following before Continue: ${missing.join(", ")}`
      );
      return false;
    }
    return true;
  };

  function startersOk() {
    const starters = [conStarter1, conStarter2, conStarter3, conStarter4]
      .map((s) => (s || "").trim())
      .filter(Boolean);

    if (starters.length < 2) return false;

    // every provided starter must be within limits
    for (const s of starters) {
      if (!within(s, LIMITS.starterMin, LIMITS.starterMax)) return false;
    }
    return true;
  }

  function startersError() {
    message.error(
      `Please add at least 2 conversation starters and keep each ${LIMITS.starterMin}–${LIMITS.starterMax} characters.`
    );
  }

  // ===== PATCH helper =====
  async function doPatch(path: string, payload: Record<string, any>) {
    const auth = getAuthHeader();
    if (!auth.Authorization) {
      message.error("You’re not signed in. Please log in and try again.");
      throw new Error("Missing token");
    }
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...auth },
      body: JSON.stringify(stripEmpty(payload)),
    });
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (!res.ok) {
      const errTxt = await res.text().catch(() => "");
      throw new Error(`${res.status} ${errTxt}`);
    }
    return ct.includes("application/json") ? res.json() : res.text();
  }

  // Step 1 save
  const saveStep0 = async () => {
    if (isEditMode && !agentId) {
      message.error(
        "Missing agentId in edit mode. Please reopen from All Agents."
      );
      return;
    }
    if (!validateStep0()) return false;

    setLoading(true);
    try {
      const payload = {
        // IDs
        agentId: agentId || undefined,
        assistantId: assistantId || undefined,
        userId,

        // Header
        headerTitle,
        headerStatus: false,

        // Profile
        name: creatorName,
        userRole: effectiveUserRole || "Developer",

        userExperienceSummary,
        userExperience: undefined,

        acheivements,
        description, // keep only 'description' (removed misspelled 'discription')
        language,
        voiceStatus: false,
        agentName: name, // legacy field, same as 'name'
      };
      const data = await doPatch("/ai-service/agent/agentScreen1", payload);
      const aId = (data as any)?.agentId || (data as any)?.id || "";
      const asstId = (data as any)?.assistantId || "";
      if (aId) setAgentId(String(aId));
      if (asstId) setAssistantId(String(asstId));
      message.success("Saved step 1");
      return true;
    } catch (e: any) {
      message.error(e?.message || "Failed to save step 1");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Step 2 save
  const saveStep1 = async () => {
    if (isEditMode && !agentId) {
      message.error(
        "Missing agentId in edit mode. Please reopen from All Agents."
      );
      return false;
    }
    if (!validateStep1()) return false;

    setLoading(true);
    try {
      const payload = {
        agentId: agentId || undefined,
        assistantId: assistantId || undefined,
        userId,
        business,
        domain: resolvedDomain,
        subDomain: resolvedSubDomain,
        usageModel: selectedModelId,
        solveProblem,
        mainProblemSolved: solveProblem === "YES" ? mainProblemText : undefined, // keep this exact key
        uniqueSolution,
        responseFormat: responseFormat || "auto",
      };
      const data = await doPatch("/ai-service/agent/agentScreen2", payload);
      const aId = (data as any)?.agentId || (data as any)?.id || "";
      const asstId = (data as any)?.assistantId || "";
      if (aId) setAgentId(String(aId));
      if (asstId) setAssistantId(String(asstId));
      message.success("Saved step 2");
      return true;
    } catch (e: any) {
      message.error(e?.message || "Failed to save step 2");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Step 3 save (Audience + Config + Contact is BEFORE Instructions in UI, but payload unchanged)
  const saveStep2 = async () => {
    if (isEditMode && !agentId) {
      message.error(
        "Missing agentId in edit mode. Please reopen from All Agents."
      );
      return false;
    }
    if (!validateStep2()) return false;

    setLoading(true);
    try {
      const finalTargetUsers = resolvedTargetUsersString || undefined;
      const finalAgeLimits = resolvedAgeLimitsString || undefined;

      const payload = {
        agentId: agentId || undefined,
        assistantId: assistantId || undefined,
        userId,
        targetUser: finalTargetUsers,
        gender: genderForText || genderSelections.join(",") || undefined,
        ageLimit: finalAgeLimits,
        converstionTone,
        instructions,
        // contact moved in UI but stays in this screen's payload
        contactDetails: shareContact === "YES" ? contactDetails : undefined,
        shareContact: shareContact,
      };
      const data = await doPatch("/ai-service/agent/agentScreen3", payload);
      const aId = (data as any)?.agentId || (data as any)?.id || "";
      const asstId = (data as any)?.assistantId || "";
      if (aId) setAgentId(String(aId));
      if (asstId) setAssistantId(String(asstId));
      message.success("Saved step 3");
      return true;
    } catch (e: any) {
      message.error(e?.message || "Failed to save step 3");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const next = async () => {
    if (step === 0) {
      const ok = await saveStep0();
      if (!ok) return;
      setStep(1);
    } else if (step === 1) {
      const ok = await saveStep1();
      if (!ok) return;
      setStep(2);
    } else if (step === 2) {
      const ok = await saveStep2();
      if (!ok) return;
      setStep(3);
    }
  };

  const prev = () => {
    if (step > 0) setStep((step - 1) as any);
  };

  // Add these 2 small helpers near your other helpers (above handleGenerate)
  function cleanForTransport(s: string): string {
    if (!s) return "";
    // Remove accidental wrapped quotes and any injected JSON fragments
    let t = s.trim();
    // collapse repeated quotes and trailing commas often caused by copy/paste
    t = t.replace(/^"+|"+$/g, ""); // strip leading/trailing double-quotes
    t = t.replace(/^'+|'+$/g, ""); // strip leading/trailing single-quotes
    t = t.replace(/\s+,/g, ","); // remove space before commas
    t = t.replace(/,{2,}$/g, ""); // strip trailing commas
    // extremely defensive: kill attempts to stuff JSON keys inside description
    t = t.replace(/"\s*,\s*"agentId"\s*:\s*".*?"\s*$/i, "");
    return t;
  }

  async function postJson(url: string, body: any, signal?: AbortSignal) {
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(stripEmpty(body)),
      signal,
    });
  }

  // ===== Generate Instructions (appends contact line if shared) =====
  const handleGenerate = async () => {
    const baseErr =
      "Please fill either ‘Description’ or ‘Unique Solution’ before generating instructions.";
    if (
      !description.trim() &&
      !(solveProblem === "YES" && uniqueSolution.trim())
    ) {
      message.error(baseErr);
      return;
    }

    // Build a rich classification text (you already do this)
    const sourceText =
      classifyText || description || "Create helpful assistant instructions";

    // Clean description for transport (avoid %22 and embedded JSON)
    const descClean = cleanForTransport(sourceText);

    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 20000);

    const baseUrl = `${BASE_URL}/ai-service/agent/classifyInstruct`;
    const auth = getAuthHeader();
    if (!auth.Authorization) {
      message.error("You’re not signed in. Please log in and try again.");
      return;
    }

    try {
      setLoading(true);

      // --- Primary: POST JSON (preferred) ---
      let res = await postJson(
        baseUrl,
        { description: descClean, agentId: agentId || undefined },
        ctrl.signal
      );

      // --- Fallback 1: POST with no JSON body, pass via query ---
      if (!res.ok && (res.status === 400 || res.status === 415)) {
        const q = new URLSearchParams({
          description: descClean,
          ...(agentId ? { agentId } : {}),
        });
        res = await fetch(`${baseUrl}?${q.toString()}`, {
          method: "POST",
          headers: { ...auth }, // no Content-Type and no body
          signal: ctrl.signal,
        });
      }

      // --- Fallback 2: GET with query ---
      if (!res.ok && (res.status === 400 || res.status === 415)) {
        const q2 = new URLSearchParams({
          description: descClean,
          ...(agentId ? { agentId } : {}),
        });
        res = await fetch(`${baseUrl}?${q2.toString()}`, {
          headers: { ...auth },
          signal: ctrl.signal,
        });
      }

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`classifyInstruct failed: ${res.status} ${txt}`);
      }

      // Parse text or JSON softly
      const ct = (res.headers.get("content-type") || "").toLowerCase();
      let raw: string;
      if (ct.includes("application/json")) {
        const data = await res.json();
        raw =
          typeof data === "string"
            ? data
            : data.instructions || data.message || JSON.stringify(data);
      } else {
        raw = await res.text();
        try {
          const maybe = JSON.parse(raw);
          raw =
            typeof maybe === "string"
              ? maybe
              : maybe.instructions || maybe.message || raw;
        } catch {
          raw = raw.replace(/^#{1,6}\s?.*$/gm, "").trim();
        }
      }

      // Clean and append contact if chosen
      let cleaned = cleanInstructionText(raw);
      if (shareContact === "YES" && contactDetails.trim()) {
        cleaned =
          `${cleaned}\n\nContact: ${contactDetails.trim()}.\nIf you have any queries, feel free to reach out.`.trim();
      }

      setInstructions(cleaned);
      setGenerated(true);
      message.success(
        "Instructions generated and inserted. You can edit them before publishing."
      );
    } catch (e: any) {
      message.error(
        e?.name === "AbortError"
          ? "Request timed out. Please try again."
          : e?.message || "Failed to generate instructions"
      );
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  // Instructions edit modal
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  // replace the old handler
  const handleSaveInstructions = (opts?: { close?: boolean }) => {
    setInstructions(tempInstructions);
    message.success("Instructions saved!");
    if (opts?.close) setShowInstructionsModal(false);
  };

  // Require at least 2 conversation starters (before preview/publish)
  function hasMinStarters() {
    const starters = [
      conStarter1,
      conStarter2,
      conStarter3,
      conStarter4,
    ].filter((s) => (s || "").trim().length > 0);
    return starters.length >= 2;
  }

  const handleOpenPreview = async () => {
    if (!(await saveStep2())) return;
    if (!startersOk()) {
      startersError();
      return;
    }
    if (!name.trim()) {
      message.error("Please add an Agent Name before preview.");
      return;
    }
    setShowPreview(true);
  };

  // ====== PUBLISH / UPDATE ======
  const handleConfirmPublish = async () => {
    if (isEditMode && !agentId) {
      message.error(
        "Missing agentId in edit mode. Please reopen from All Agents."
      );
      return;
    }
    if (!startersOk()) {
      startersError();
      return;
    }
    try {
      setLoading(true);
      // NEW: require user to choose at least one store
      if (!storeBharat && !storeOxy) {
        setLoading(false);
        message.error("Please choose at least one store to publish.");
        setShowStoreModal(true);
        return;
      }
      const chooseStore = "BharatAIStore";

      const basePayload: any = {
        agentId: agentId || undefined,
        assistantId: assistantId || undefined,
        userId,

        // publish page fields
        conStarter1,
        conStarter2,
        conStarter3,
        conStarter4,
        activeStatus,
        rateThisPlatform,
        shareYourFeedback,

        // store selection
        chooseStore: chooseStore || undefined,
      };

      // Only include creation-status flags for NEW publish (not edit)
      const payload = isEditMode
        ? basePayload
        : {
            ...basePayload,
            agentStatus: "CREATED", // backend expects this only during first publish
            status: "REQUESTED",
          };

      const data = await doPatch("/ai-service/agent/agentPublish", payload);
      setShowPreview(false);
      setSuccessData(data as AgentApiResponse);
      message.success(
        isEditMode
          ? "Agent updated successfully!"
          : "Agent published successfully!"
      );
      resetWizard();
      navigate("/main/bharath-aistore/agents", { replace: true });
    } catch (e: any) {
      message.error(
        e?.message ||
          (isEditMode ? "Failed to update agent" : "Failed to publish agent")
      );
    } finally {
      setLoading(false);
    }
  };

  // Persist ids in edit mode
  useEffect(() => {
    if (isEditMode && agentId) sessionStorage.setItem("edit_agentId", agentId);
    if (isEditMode && assistantId)
      sessionStorage.setItem("edit_assistantId", assistantId);
  }, [isEditMode, agentId, assistantId]);

  // Prefill in edit mode
  useEffect(() => {
    if (!isEditMode || !editSeed) return;

    if (
      typeof editSeed.headerTitle === "string" &&
      editSeed.headerTitle.length
    ) {
      setHeaderTitle(normalizeHeaderTitle(editSeed.headerTitle));
    }

    setAgentId(String(editSeed.id || editSeed.agentId || ""));
    setAssistantId(String(editSeed.assistantId || ""));

    // Step 1 – Profile
    setName(editSeed.Name || (editSeed as any).name || "");
    setDescription(editSeed.description || "");
    setLanguage(editSeed.language || "English");
    setUserExperienceSummary((editSeed as any).userExperienceSummary || "");
    setUserRole(editSeed.userRole || "Advocate");
    setCreatorName(String(editSeed.creatorName || ""));
    setAcheivements(String(editSeed.acheivements || ""));

    // Step 2 – Business & Model & Problem
    const d = editSeed.domain || "";
    setDomain(DOMAIN_OPTIONS.includes(d) ? d : d ? "Other" : undefined);
    setDomainOther(!DOMAIN_OPTIONS.includes(d) ? d : "");

    const sd = editSeed.subDomain || "";
    setSubDomain(
      SUBDOMAIN_OPTIONS.includes(sd) ? sd : sd ? "Other" : undefined
    );
    setSubDomainOther(!SUBDOMAIN_OPTIONS.includes(sd) ? sd : "");

    setBusiness(editSeed.business || "");
    setSelectedModelId(editSeed.usageModel || undefined);

    const priorProblem = String(editSeed.mainProblemSolved || "").trim();
    const priorSolution = String(editSeed.uniqueSolution || "").trim();
    setMainProblemText(priorProblem);
    setUniqueSolution(priorSolution);
    setSolveProblem(priorProblem ? "YES" : "");

    // Step 3 – Audience + Config + Contact
    const priorTarget = String(editSeed.targetUser || "").trim();
    if (priorTarget) {
      const arr = priorTarget
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      setTargetUsers(arr);
    }

    const priorAge = String((editSeed as any).ageLimit || "").trim();
    if (priorAge) {
      const tokens = priorAge
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const known = new Set(AGE_LIMIT_OPTIONS);
      const nextAges: string[] = [];
      let customFound = "";
      tokens.forEach((t) => {
        if (known.has(t) && t !== "Other") {
          nextAges.push(t);
        } else {
          customFound = t;
          nextAges.push("Other");
        }
      });
      setAgeLimits(Array.from(new Set(nextAges)));
      if (customFound) setAgeOther(customFound);
    }

    if ((editSeed as any)?.gender) {
      setGenderSelections(
        String((editSeed as any).gender)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      );
    }
    setConverstionTone((editSeed as any).converstionTone || undefined);
    setResponseFormat((editSeed.responseFormat as any) || undefined);
    setInstructions(editSeed.instructions || "");

    // Contact
    const cd = String((editSeed as any).contactDetails || "");
    if (cd) {
      setShareContact("YES");
      setContactDetails(cd);
    } else {
      setShareContact("NO");
      setContactDetails("");
    }

    // Step 4 – Conversation starters & status
    setConStarter1((editSeed as any).conStarter1 || "");
    setConStarter2((editSeed as any).conStarter2 || "");
    setConStarter3((editSeed as any).conStarter3 || "");
    setConStarter4((editSeed as any).conStarter4 || "");
    setActiveStatus(Boolean(editSeed.activeStatus));

    // Decide where to land the wizard in edit mode
    const jumpFromState =
      (location?.state?.jumpToStep as 0 | 1 | 2 | 3 | undefined) ?? undefined;

    const jumpFromScreen = coerceStepFromScreenStatus(
      (editSeed as any)?.screenStatus ?? null
    );

    const jumpFromSession = (() => {
      const v = sessionStorage.getItem("edit_jumpStep");
      return v === "1" || v === "2" || v === "3" ? (Number(v) as 1 | 2 | 3) : 0;
    })();

    // Priority: explicit state > screenStatus on seed > sessionStorage > 0
    const initialStep = jumpFromState ?? jumpFromScreen ?? jumpFromSession ?? 0;

    setStep(initialStep as 0 | 1 | 2 | 3);
  }, [isEditMode, editSeed]);

  // UI helpers
  const labelWithInfo = (label: string, tip: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <Text strong>{label}</Text>
      <Tooltip title={tip}>
        <InfoCircleOutlined style={{ color: "#8c8c8c" }} />
      </Tooltip>
    </div>
  );

  const SuccessAgentCard: React.FC<{
    data: AgentApiResponse;
    onClose: () => void;
  }> = ({ data, onClose }) => {
    const label = (t: string) => <span style={{ color: "#8c8c8c" }}>{t}</span>;
    const chip = (v?: string | null) =>
      v ? (
        <span
          style={{
            display: "inline-block",
            padding: "2px 8px",
            borderRadius: 12,
            border: "1px solid #e6e6ff",
            background: "#fafaff",
            fontSize: 12,
            marginRight: 6,
            marginBottom: 6,
          }}
        >
          {v}
        </span>
      ) : null;
    return (
      <Modal
        open
        onCancel={onClose}
        footer={null}
        width={620}
        title={
          <div style={{ textAlign: "center", padding: 6, color: "white" }}>
            <span style={{ fontWeight: 600 }}>
              {isEditMode ? "Agent Updated" : "Agent Created"}
            </span>
          </div>
        }
        styles={{
          header: {
            background: "linear-gradient(135deg, #52c41a 0%, #13c2c2 100%)",
            borderRadius: "8px 8px 0 0",
          },
        }}
      >
        <Card
          bordered
          style={{ borderRadius: 12, border: "1px solid #e6f7ff" }}
          bodyStyle={{ padding: 16 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "linear-gradient(135deg, #722ed1 0%, #fa8c16 100%)",
                display: "grid",
                placeItems: "center",
                color: "white",
                fontWeight: 700,
              }}
            >
              {((data.name || "AG")[0] || "A").toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>
                {data.name || "—"}
              </div>
              <div style={{ color: "#52c41a", fontSize: 13 }}>
                {data.message || "Success"}
              </div>
            </div>
            <div>
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: 12,
                  background: data.activeStatus ? "#f6ffed" : "#fff1f0",
                  border: `1px solid ${
                    data.activeStatus ? "#b7eb8f" : "#ffa39e"
                  }`,
                  color: data.activeStatus ? "#389e0d" : "#cf1322",
                  fontSize: 12,
                }}
              >
                {data.activeStatus ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <div>{label("Agent ID")}</div>
              <div style={{ fontFamily: "monospace", fontSize: 13 }}>
                {data.agentId || "—"}
              </div>
            </div>
            <div>
              <div>{label("Assistant ID")}</div>
              <div style={{ fontFamily: "monospace", fontSize: 13 }}>
                {data.assistantId || "—"}
              </div>
            </div>
            <div>
              <div>{label("User ID")}</div>
              <div style={{ fontFamily: "monospace", fontSize: 13 }}>
                {data.userId || "—"}
              </div>
            </div>
            <div>
              <div>{label("Usage Model")}</div>
              <div>{data.usageModel || "—"}</div>
            </div>
            <div>
              <div>{label("Response Format")}</div>
              <div>{data.responseFormat || "—"}</div>
            </div>
            <div>
              <div>{label("Voice")}</div>
              <div>{data.voiceStatus ? "Enabled" : "Disabled"}</div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ marginBottom: 6 }}>{label("Business / Domain")}</div>
            <div>
              {chip(data.business)}
              {chip(data.domain)}
              {chip(data.subDomain)}
              {chip(data.targetUser)}
              {chip(data.language)}
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ marginBottom: 6 }}>{label("Description")}</div>
            <div
              style={{
                background: "#fafafa",
                border: "1px solid #f0f0f0",
                borderRadius: 8,
                padding: 10,
                whiteSpace: "pre-wrap",
                fontSize: 13,
              }}
            >
              {data.description || "—"}
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ marginBottom: 6 }}>{label("Instructions")}</div>
            <div
              style={{
                background: "#fff",
                border: "1px dashed #e6e6e6",
                borderRadius: 8,
                padding: 10,
                maxHeight: 160,
                overflow: "auto",
                whiteSpace: "pre-wrap",
                fontSize: 13,
              }}
            >
              {data.instructions || "—"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 16,
            }}
          >
            <button
              onClick={() => {
                navigator.clipboard
                  ?.writeText(JSON.stringify(data, null, 2))
                  .catch(() => {});
              }}
              style={{
                border: "1px solid #e6f7ff",
                background: "#f0f5ff",
                borderRadius: 8,
                padding: "6px 10px",
                fontSize: 13,
              }}
            >
              Copy JSON
            </button>
            <button
              onClick={onClose}
              style={{
                background: "linear-gradient(135deg, #722ed1 0%, #fa8c16 100%)",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "6px 12px",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              Done
            </button>
          </div>
        </Card>
      </Modal>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", padding: "16px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #722ed1 0%, #fa8c16 100%)",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          <Title
            level={3}
            style={{ color: "white", margin: 0, fontWeight: 600 }}
          >
            Create Your AI Agent
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.9)" }}>
            Build intelligent agents tailored to your expertise
          </Text>
        </div>

        <Card
          style={{ marginBottom: "16px", borderRadius: "12px", padding: "8px" }}
        >
          <Steps
            current={step}
            items={[
              { title: "Profile", icon: <UserOutlined /> },
              { title: "Business & GPT Model", icon: <SettingOutlined /> },
              { title: "Audience & Configuration", icon: <BulbOutlined /> },
              { title: "Publish", icon: <RocketOutlined /> },
            ]}
            size="small"
          />
        </Card>

        <Card style={{ borderRadius: "12px", minHeight: "400px" }}>
          <div style={{ padding: "20px" }}>
            {/* STEP 1 */}
            {step === 0 && (
              <div>
                <Title
                  level={4}
                  style={{
                    color: "#722ed1",
                    marginBottom: 20,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <UserOutlined style={{ marginRight: 8 }} />
                  Agent Creator Profile
                </Title>

                <Row gutter={[16, 12]}>
                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: 12 }}>
                      {labelWithInfo(
                        "AI Agent Name *",
                        "Example: 'TaxBuddy Pro', 'Visa Mentor', 'HealthCare FAQ Bot'"
                      )}
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter agent name"
                        maxLength={LIMITS.nameMax}
                        style={compactInputStyle}
                        suffix={
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {name.length}/{LIMITS.nameMax}
                          </Text>
                        }
                      />
                    </div>
                  </Col>

                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: 12 }}>
                      {labelWithInfo(
                        "Creator Name *",
                        "Your full name or brand representative name."
                      )}
                      <Input
                        value={creatorName}
                        onChange={(e) => setCreatorName(e.target.value)}
                        placeholder="Enter creator name"
                        maxLength={LIMITS.creatorMax}
                        style={compactInputStyle}
                        suffix={
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {creatorName.length}/{LIMITS.creatorMax}
                          </Text>
                        }
                      />
                    </div>
                  </Col>

                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: 12 }}>
                      {labelWithInfo(
                        "Professional Identity of the Creator *",
                        "Select your profession."
                      )}
                      <Select
                        value={userRole}
                        onChange={setUserRole}
                        placeholder="Select your role"
                        allowClear
                        style={{ width: "100%", ...compactInputStyle }}
                      >
                        <Option value="Advocate">Advocate</Option>
                        <Option value="CA">Chartered Accountant (CA)</Option>
                        <Option value="CS">Company Secretary (CS)</Option>
                        <Option value="Consultant">Consultant</Option>
                        <Option value="Teacher">Teacher</Option>
                        <Option value="Doctor">Doctor</Option>
                        <Option value="Engineer">Engineer</Option>
                        <Option value="Lawyer">Lawyer</Option>
                        <Option value="Startup Founder">Startup Founder</Option>
                        <Option value="Entrepreneur">Entrepreneur</Option>
                        <Option value="Investor">Investor</Option>
                        <Option value="Banker">Banker</Option>
                        <Option value="Software Developer">
                          Software Developer
                        </Option>
                        <Option value="Data Scientist">Data Scientist</Option>
                        <Option value="AI/ML Expert">AI / ML Expert</Option>
                        <Option value="Researcher">Researcher</Option>
                        <Option value="Designer">Designer</Option>
                        <Option value="Marketing Specialist">
                          Marketing Specialist
                        </Option>
                        <Option value="HR Professional">HR Professional</Option>
                        <Option value="Operations Manager">
                          Operations Manager
                        </Option>
                        <Option value="Sales Executive">Sales Executive</Option>
                        <Option value="Product Manager">Product Manager</Option>
                        <Option value="CXO">CXO (CEO / CTO / CFO etc.)</Option>
                        <Option value="Freelancer">Freelancer</Option>
                        <Option value="Consultant">Business Consultant</Option>
                        <Option value="Other">Other</Option>
                      </Select>
                      {userRole === "Other" && (
                        <Input
                          value={userRoleOther}
                          onChange={(e) => setUserRoleOther(e.target.value)}
                          placeholder="Enter your profession"
                          maxLength={LIMITS.roleOtherMax}
                          style={{ marginTop: 8, ...compactInputStyle }}
                          suffix={
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {userRoleOther.length}/{LIMITS.roleOtherMax}
                            </Text>
                          }
                        />
                      )}
                    </div>
                  </Col>

                  <Col xs={24}>
                    <div style={{ marginBottom: 12 }}>
                      {labelWithInfo(
                        "Creator Experience Overview",
                        "Optional 1–2 lines."
                      )}
                      <Input
                        value={userExperienceSummary}
                        onChange={(e) =>
                          setUserExperienceSummary(e.target.value)
                        }
                        placeholder="Brief summary (optional)"
                        maxLength={LIMITS.expMax}
                        style={compactInputStyle}
                        suffix={
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {userExperienceSummary.length}/{LIMITS.expMax}
                          </Text>
                        }
                      />
                    </div>
                  </Col>

                  <Col xs={24}>
                    <div style={{ marginBottom: 12 }}>
                      {labelWithInfo(
                        "Problems Solved in the Past (Description) *",
                        "Give 2–3 representative cases."
                      )}
                      <TextArea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="2–3 representative cases…"
                        maxLength={250}
                        rows={3}
                        style={compactInputStyle}
                      />
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, float: "right", marginTop: 2 }}
                      >
                        {description.length}/250
                      </Text>
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: 12 }}>
                      {labelWithInfo(
                        "Strengths",
                        "Optional — awards, milestones, notable cases."
                      )}
                      <Input
                        value={acheivements}
                        onChange={(e) => setAcheivements(e.target.value)}
                        placeholder="(optional)"
                        maxLength={150}
                        style={compactInputStyle}
                        suffix={
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {acheivements.length}/150
                          </Text>
                        }
                      />
                    </div>
                  </Col>

                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: 12 }}>
                      {labelWithInfo(
                        "Preferred Language *",
                        "The language for conversations and output."
                      )}
                      <Select
                        value={language}
                        onChange={setLanguage}
                        placeholder="Choose preferred language"
                        allowClear
                        style={{ width: "100%", ...compactInputStyle }}
                      >
                        <Option value="English">English</Option>
                        <Option value="తెలుగు">తెలుగు</Option>
                        <Option value="हिंदी">हिंदी</Option>
                      </Select>
                    </div>
                  </Col>
                </Row>
              </div>
            )}

            {/* STEP 2 */}
            {step === 1 && (
              <div>
                <Title
                  level={4}
                  style={{
                    color: "#722ed1",
                    marginBottom: 20,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <SettingOutlined style={{ marginRight: 8 }} />
                  Business Context & GPT Model
                </Title>

                <Row gutter={[16, 12]}>
                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: 12 }}>
                      {labelWithInfo(
                        "Business/Idea *",
                        "Your brand, firm or practice."
                      )}
                      <Input
                        value={business}
                        onChange={(e) => setBusiness(e.target.value)}
                        placeholder="Firm/brand/practice"
                        maxLength={LIMITS.businessMax}
                        style={compactInputStyle}
                        suffix={
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {business.length}/{LIMITS.businessMax}
                          </Text>
                        }
                      />
                    </div>
                  </Col>

                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: 12 }}>
                      {labelWithInfo(
                        "Domain/Sector *",
                        "Pick from common domains or choose 'Other'."
                      )}
                      <Select
                        value={domain}
                        onChange={setDomain}
                        placeholder="Select a domain"
                        allowClear
                        style={{ width: "100%", ...compactInputStyle }}
                      >
                        {DOMAIN_OPTIONS.map((d) => (
                          <Option key={d} value={d}>
                            {d}
                          </Option>
                        ))}
                      </Select>
                      {domain === "Other" && (
                        <Input
                          style={{ marginTop: 8, ...compactInputStyle }}
                          placeholder="Enter custom domain/sector"
                          value={domainOther}
                          onChange={(e) => setDomainOther(e.target.value)}
                          maxLength={LIMITS.domainOtherMax}
                          suffix={
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {domainOther.length}/{LIMITS.domainOtherMax}
                            </Text>
                          }
                        />
                      )}
                    </div>
                  </Col>

                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: 12 }}>
                      {labelWithInfo(
                        "Sub-Domain/Subsector *",
                        "Pick from common subsectors or choose 'Other'."
                      )}
                      <Select
                        value={subDomain}
                        onChange={setSubDomain}
                        placeholder="Select a sub-domain"
                        allowClear
                        style={{ width: "100%", ...compactInputStyle }}
                      >
                        {SUBDOMAIN_OPTIONS.map((d) => (
                          <Option key={d} value={d}>
                            {d}
                          </Option>
                        ))}
                      </Select>
                      {subDomain === "Other" && (
                        <Input
                          style={{ marginTop: 8, ...compactInputStyle }}
                          placeholder="Enter custom sub-domain/subsector"
                          value={subDomainOther}
                          onChange={(e) => setSubDomainOther(e.target.value)}
                          maxLength={LIMITS.subDomainOtherMax}
                          suffix={
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {subDomainOther.length}/{LIMITS.subDomainOtherMax}
                            </Text>
                          }
                        />
                      )}
                    </div>
                  </Col>

                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: 12 }}>
                      {labelWithInfo("GPT Model *", "Example: gpt-4o.")}
                      <Select
                        value={selectedModelId}
                        onChange={setSelectedModelId}
                        placeholder="Select GPT model"
                        style={{ width: "100%", ...compactInputStyle }}
                        loading={loading}
                        allowClear
                      >
                        {models.map((m) => (
                          <Option key={m.id} value={m.id}>
                            {m.id}
                            {m.owned_by ? ` · ${m.owned_by}` : ""}
                          </Option>
                        ))}
                        
                      </Select>
                    </div>
                  </Col>

                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: 12 }}>
                      {labelWithInfo(
                        "Response Format *",
                        "auto (natural text) or json_object (structured)."
                      )}
                      <Select
                        value={responseFormat || "auto"}
                        onChange={setResponseFormat}
                        allowClear={false}
                        style={{ width: "100%", ...compactInputStyle }}
                      >
                        {RESPONSE_FORMATS.map((f) => (
                          <Option key={f} value={f}>
                            {f}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </Col>

                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: 12 }}>
                      {labelWithInfo(
                        "Are you solving a problem? *",
                        "If Yes, specify the problem and your solution."
                      )}
                      <Radio.Group
                        value={solveProblem}
                        onChange={(e) => setSolveProblem(e.target.value)}
                      >
                        <Radio value="YES">Yes</Radio>
                        <Radio value="NO">No</Radio>
                      </Radio.Group>
                    </div>
                  </Col>

                  {solveProblem === "YES" && (
                    <Col xs={24}>
                      <div style={{ marginBottom: 12 }}>
                        {labelWithInfo(
                          "Main Problem to Solve * (max 250 chars)",
                          "What exact user problem?"
                        )}
                        <TextArea
                          value={mainProblemText}
                          onChange={(e) => setMainProblemText(e.target.value)}
                          placeholder="e.g., 'Early-stage startups struggle to choose the right structure and miss deadlines.'"
                          rows={2}
                          maxLength={100}
                          style={compactInputStyle}
                        />
                        <Text
                          type="secondary"
                          style={{ fontSize: 12, float: "right" }}
                        >
                          {mainProblemText.length}/100
                        </Text>
                      </div>
                    </Col>
                  )}

                  <Col xs={24}>
                    <div style={{ marginBottom: 12 }}>
                      {labelWithInfo(
                        "Unique Solution Method (max 250 chars)",
                        "How is your approach different?"
                      )}
                      <TextArea
                        value={uniqueSolution}
                        onChange={(e) => setUniqueSolution(e.target.value)}
                        placeholder="e.g., 'Fast triage + templates + compliance checklist with reminders.'"
                        rows={2}
                        maxLength={100}
                        style={compactInputStyle}
                      />
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, float: "right" }}
                      >
                        {uniqueSolution.length}/100
                      </Text>
                    </div>
                  </Col>
                </Row>
              </div>
            )}

            {/* STEP 3 (Audience, Contact BEFORE Instructions) */}
            {step === 2 && (
              <div>
                <Title
                  level={4}
                  style={{
                    color: "#722ed1",
                    marginBottom: 20,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <BulbOutlined style={{ marginRight: 8 }} />
                  Audience & Configuration
                </Title>

                <Row gutter={[16, 12]}>
                  {/* Target audience */}
                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: 12 }}>
                      {labelWithInfo(
                        "Target Customers *",
                        "You can select multiple."
                      )}
                      <Select
                        mode="multiple"
                        value={targetUsers}
                        onChange={(vals) => {
                          if (vals.includes("Select All")) {
                            setTargetUsers(TARGET_USER_OPTIONS);
                          } else {
                            setTargetUsers(vals);
                          }
                        }}
                        placeholder="Select target audience"
                        allowClear
                        maxTagCount="responsive"
                        style={{ width: "100%", ...compactInputStyle }}
                      >
                        <Option key="Select All" value="Select All">
                          Select All
                        </Option>
                        {TARGET_USER_OPTIONS.map((option) => (
                          <Option key={option} value={option}>
                            {option}
                          </Option>
                        ))}
                      </Select>

                      {targetUsers.includes("Other") && (
                        <Input
                          style={{ marginTop: 8, ...compactInputStyle }}
                          placeholder="Specify your target user(s)"
                          value={targetUserOther}
                          onChange={(e) => setTargetUserOther(e.target.value)}
                          maxLength={LIMITS.targetOtherMax}
                          suffix={
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {targetUserOther.length}/{LIMITS.targetOtherMax}
                            </Text>
                          }
                        />
                      )}
                    </div>
                  </Col>

                  {/* Gender */}
                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: 12 }}>
                      {labelWithInfo(
                        "Target Audience Gender *",
                        "Pick one or more if specific."
                      )}
                      <Checkbox.Group
                        options={["Male", "Female", "Other"]}
                        value={genderSelections}
                        onChange={(vals) =>
                          setGenderSelections(vals as string[])
                        }
                      />
                    </div>
                  </Col>

                  {/* Age limits */}
                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: 12 }}>
                      {labelWithInfo(
                        "Target Audience Age Limit *",
                        "Select one or more relevant age ranges."
                      )}
                      <Select
                        mode="multiple"
                        value={ageLimits}
                        onChange={(vals) => {
                          if (vals.includes("Select All")) {
                            setAgeLimits(AGE_LIMIT_OPTIONS);
                            if (!AGE_LIMIT_OPTIONS.includes("Other"))
                              setAgeOther("");
                          } else {
                            setAgeLimits(vals);
                            if (!vals.includes("Other")) setAgeOther("");
                          }
                        }}
                        placeholder="Select age range(s)"
                        allowClear
                        maxTagCount="responsive"
                        style={{ width: "100%", ...compactInputStyle }}
                      >
                        <Option key="Select All" value="Select All">
                          Select All
                        </Option>
                        {AGE_LIMIT_OPTIONS.map((option) => (
                          <Option key={option} value={option}>
                            {option}
                          </Option>
                        ))}
                      </Select>

                      {ageLimits.includes("Other") && (
                        <Input
                          style={{ marginTop: 8, ...compactInputStyle }}
                          placeholder="Enter custom age (e.g., 21-30 or 16+)"
                          value={ageOther}
                          onChange={(e) => setAgeOther(e.target.value)}
                          maxLength={20}
                        />
                      )}
                    </div>
                  </Col>

                  {/* Tone */}
                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: 12 }}>
                      {labelWithInfo(
                        "Conversation Tone *",
                        "Example: Helpful & Professional."
                      )}
                      <Select
                        value={converstionTone}
                        onChange={setConverstionTone}
                        placeholder="Select a conversation tone"
                        allowClear
                        style={{ width: "100%", ...compactInputStyle }}
                      >
                        {TONE_OPTIONS.map((t) => (
                          <Option key={t} value={t}>
                            {t}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </Col>

                  {/* Share contact (BEFORE Instructions now) */}
                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: 12 }}>
                      {labelWithInfo(
                        "Do you want to share Contact Details? *",
                        "Choose Yes to show your contact."
                      )}
                      <Radio.Group
                        value={shareContact}
                        onChange={(e) => {
                          const val = e.target.value as "YES" | "NO";
                          setShareContact(val);
                          if (val === "YES") {
                            const p = profileRef.current || {};
                            if (!contactDetails) {
                              const best =
                                p.mobileNumber ||
                                p.whatsappNumber ||
                                p.email ||
                                "";
                              if (best) setContactDetails(best);
                            }
                            setOpenProfileModal(true);
                          }
                        }}
                      >
                        <Radio value="YES">Yes</Radio>
                        <Radio value="NO">No</Radio>
                      </Radio.Group>
                      {shareContact === "YES" && (
                        <Input
                          value={contactDetails}
                          onChange={(e) => setContactDetails(e.target.value)}
                          placeholder="Your best contact (email/phone)"
                          maxLength={LIMITS.contactMax}
                          style={compactInputStyle}
                          suffix={
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {contactDetails.length}/{LIMITS.contactMax}
                            </Text>
                          }
                        />
                      )}
                    </div>
                  </Col>
                  <Row gutter={[16, 12]}>
                    {/* Box 1 – Generate */}
                    <Col xs={24} md={12}>
                      <Card
                        style={{
                          minHeight: 160,
                          border: "2px dashed #d9d9d9",
                          borderRadius: 8,
                          textAlign: "center",
                          position: "relative",
                          zIndex: 1, // keeps on top
                          background: "#fff", // prevents bleed
                        }}
                      >
                        <Button
                          onClick={handleGenerate}
                          type="primary"
                          style={{ ...purpleBtn, marginBottom: 8 }} // ✅ spread fix
                          loading={loading}
                        >
                          Generate Instructions
                        </Button>
                        <div style={{ fontSize: 12, color: "#8c8c8c" }}>
                          Auto-create based on your context
                        </div>
                      </Card>
                    </Col>

                    {/* Box 2 – Write */}
                    <Col xs={24} md={12}>
                      <Card
                        style={{
                          minHeight: 160,
                          border: "2px dashed #d9d9d9",
                          borderRadius: 8,
                          textAlign: "center",
                          position: "relative",
                          zIndex: 1, // keeps on top
                          background: "#fff", // prevents bleed
                        }}
                      >
                        <Space
                          direction="vertical"
                          align="center"
                          style={{ width: "100%" }}
                        >
                          <Button
                            onClick={() => {
                              setTempInstructions(instructions);
                              setShowInstructionsModal(true);
                            }}
                            type="default"
                            style={{ marginBottom: 8 }}
                            icon={null}
                          >
                            Write Instructions
                          </Button>

                          <Space>
                            <Button
                              size="small"
                              icon={<EyeOutlined />}
                              onClick={() => setShowViewInstructions(true)}
                            >
                              View
                            </Button>
                          </Space>

                          <div style={{ fontSize: 12, color: "#8c8c8c" }}>
                            Type your own
                          </div>
                        </Space>
                      </Card>
                    </Col>
                  </Row>
                </Row>
              </div>
            )}

            {/* STEP 4 (Publish only) */}
            {step === 3 && (
              <div>
                <Title
                  level={4}
                  style={{
                    color: "#722ed1",
                    marginBottom: 20,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <RocketOutlined style={{ marginRight: 8 }} />
                  Conversations & Publish
                </Title>

                <Row gutter={[16, 12]}>
                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: 12 }}>
                      {labelWithInfo(
                        "Conversation Starter 1",
                        'Example: "What service do you need help with today?"'
                      )}
                      <Input
                        value={conStarter1}
                        onChange={(e) => setConStarter1(e.target.value)}
                        placeholder="Starter 1"
                        maxLength={LIMITS.starterMax}
                        style={compactInputStyle}
                        suffix={
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {conStarter1.trim().length}/{LIMITS.starterMax}
                          </Text>
                        }
                      />
                    </div>
                  </Col>

                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: 12 }}>
                      {labelWithInfo(
                        "Conversation Starter 2",
                        'Example: "Share your case details..."'
                      )}
                      <Input
                        value={conStarter2}
                        onChange={(e) => setConStarter2(e.target.value)}
                        placeholder='e.g., "Share your case details..."'
                        style={compactInputStyle}
                      />
                    </div>
                  </Col>

                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: 12 }}>
                      {labelWithInfo(
                        "Conversation Starter 3",
                        'Example: "Do you want a document template?"'
                      )}
                      <Input
                        value={conStarter3}
                        onChange={(e) => setConStarter3(e.target.value)}
                        placeholder='e.g., "Do you want a document template?"'
                        style={compactInputStyle}
                      />
                    </div>
                  </Col>

                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: 12 }}>
                      {labelWithInfo(
                        "Conversation Starter 4",
                        'Example: "Prefer English/తెలుగు/हिंदी?"'
                      )}
                      <Input
                        value={conStarter4}
                        onChange={(e) => setConStarter4(e.target.value)}
                        placeholder='e.g., "Prefer English/తెలుగు/हिंदी?"'
                        style={compactInputStyle}
                      />
                    </div>
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ marginBottom: 12 }}>
                      {labelWithInfo(
                        "Active Status",
                        "Toggle whether this agent is visible/usable."
                      )}
                      <Switch
                        checked={activeStatus}
                        onChange={setActiveStatus}
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                      />
                    </div>
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ marginBottom: 12 }}>
                      {labelWithInfo(
                        "Text Chat",
                        "Enabled by default and always available."
                      )}
                      <Tag color="green" style={{ borderRadius: 6 }}>
                        Active (default)
                      </Tag>
                    </div>
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ marginBottom: 12 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Text strong>Voice</Text>
                        <Tooltip title="It may launch soon and price is applicable.">
                          <InfoCircleOutlined style={{ color: "#8c8c8c" }} />
                        </Tooltip>
                      </div>
                      <Tag color="default" style={{ borderRadius: 6 }}>
                        Disabled
                      </Tag>
                    </div>
                  </Col>
                </Row>
              </div>
            )}

            <Divider style={{ margin: "20px 0" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                size="large"
                onClick={prev}
                disabled={step === 0}
                style={{ minWidth: 100 }}
              >
                Previous
              </Button>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {loading && <Text type="secondary">Working...</Text>}
                {step < 3 ? (
                  <Button
                    type="primary"
                    size="large"
                    onClick={next}
                    loading={loading}
                    style={{ minWidth: 120, ...purpleBtn }}
                  >
                    Save & Continue
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleOpenPreview}
                    loading={loading}
                    icon={<EyeOutlined />}
                    style={{ minWidth: 160, ...purpleBtn }}
                  >
                    {isEditMode ? "Preview & Update" : "Preview & Publish"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* PROFILE PREVIEW & AUTOFILL MODAL */}
      <Modal
        open={openProfileModal}
        onCancel={() => setOpenProfileModal(false)}
        footer={null}
        title="Profile Details"
      >
        <div style={{ lineHeight: 1.8 }}>
          <div>
            <b>Name:</b>{" "}
            {`${profileRef.current?.firstName || ""} ${
              profileRef.current?.lastName || ""
            }`.trim() || "—"}
          </div>
          <div>
            <b>Mobile:</b> {profileRef.current?.mobileNumber || "—"}{" "}
            {profileRef.current?.mobileNumber && (
              <Button
                size="small"
                style={{ marginLeft: 8 }}
                onClick={() => {
                  setContactDetails(profileRef.current?.mobileNumber || "");
                  message.success("Contact filled from Mobile Number");
                  setOpenProfileModal(false);
                }}
              >
                Use this
              </Button>
            )}
          </div>
          <div>
            <b>WhatsApp:</b> {profileRef.current?.whatsappNumber || "—"}{" "}
            {profileRef.current?.whatsappNumber && (
              <Button
                size="small"
                style={{ marginLeft: 8 }}
                onClick={() => {
                  setContactDetails(profileRef.current?.whatsappNumber || "");
                  message.success("Contact filled from WhatsApp Number");
                  setOpenProfileModal(false);
                }}
              >
                Use this
              </Button>
            )}
          </div>
          <div>
            <b>Email:</b> {profileRef.current?.email || "—"}{" "}
            {profileRef.current?.email && (
              <Button
                size="small"
                style={{ marginLeft: 8 }}
                onClick={() => {
                  setContactDetails(profileRef.current?.email || "");
                  message.success("Contact filled from Email");
                  setOpenProfileModal(false);
                }}
              >
                Use this
              </Button>
            )}
          </div>
        </div>
      </Modal>

      {/* PREVIEW MODAL */}
      <Modal
        title={
          <div style={{ textAlign: "center", padding: 8 }}>
            <Title level={4} style={{ color: "white", margin: 0 }}>
              Preview & Final Checks
            </Title>
          </div>
        }
        open={showPreview}
        onCancel={() => setShowPreview(false)}
        width={700}
        footer={null}
        styles={{
          header: {
            background: "linear-gradient(135deg, #722ed1 0%, #fa8c16 100%)",
            borderRadius: "8px 8px 0 0",
          },
        }}
      >
        <div style={{ padding: "16px 0" }}>
          <Card
            style={{
              marginBottom: 16,
              border: "1px solid #e6e6ff",
              borderRadius: 8,
            }}
          >
            <Title level={4} style={{ color: "#722ed1", margin: 0 }}>
              {name || "—"}
            </Title>
            <div style={{ marginTop: 8, color: "#8c8c8c" }}>
              <div>
                <b>Domain:</b> {resolvedDomain || "—"} / <b>Sub-domain:</b>{" "}
                {resolvedSubDomain || "—"}
              </div>
              <div>
                <b>Target:</b> {resolvedTargetUsersString || "—"} |{" "}
                <b>Gender:</b> {genderForText || "—"} | <b>Age:</b>{" "}
                {resolvedAgeLimitsString || "—"}
              </div>
              <div>
                <b>Model:</b> {selectedModelId || "—"} | <b>Response:</b>{" "}
                {responseFormat || "auto"} | <b>Tone:</b>{" "}
                {converstionTone || "—"}
              </div>
              {shareContact === "YES" && contactDetails && (
                <div>
                  <b>Contact:</b> {contactDetails}
                </div>
              )}
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ marginBottom: 6, color: "#8c8c8c" }}>
                Instructions
              </div>
              <div
                style={{
                  background: "#fff",
                  border: "1px dashed #e6e6e6",
                  borderRadius: 8,
                  padding: 10,
                  maxHeight: 220,
                  overflow: "auto",
                  whiteSpace: "pre-wrap",
                  fontSize: 13,
                }}
              >
                {instructions || "—"}
              </div>
            </div>

            {/* NEW: show conversation starters in preview (at least conStarter1) */}
            <div style={{ marginTop: 12 }}>
              <div style={{ marginBottom: 6, color: "#8c8c8c" }}>
                Conversation Starters
              </div>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {[conStarter1, conStarter2, conStarter3, conStarter4]
                  .filter((s) => (s || "").trim())
                  .map((s, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>
                      {s}
                    </li>
                  ))}
              </ul>
              {!hasMinStarters() && (
                <div style={{ color: "#cf1322", marginTop: 6, fontSize: 12 }}>
                  Please add at least 2 starters.
                </div>
              )}
            </div>
          </Card>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={() => setShowPreview(false)}>Back</Button>
            <Button
              type="primary"
              // OLD: onClick={handleConfirmPublish}
              onClick={() => setShowStoreModal(true)} // NEW: open store modal first
              loading={loading}
              style={purpleBtn}
            >
              {isEditMode ? "Update Agent" : "Publish"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* STORE SELECTION MODAL */}
      <Modal
        title="Choose Store to list your Agent"
        open={showStoreModal}
        onCancel={() => setShowStoreModal(false)}
        onOk={() => {
          // allow publish only if at least one is selected
          if (!storeBharat && !storeOxy) {
            message.error("Please select at least one store.");
            return;
          }
          setShowStoreModal(false);
          handleConfirmPublish();
        }}
        okText={isEditMode ? "Update" : "Publish"}
      >
        <div style={{ marginBottom: 8, color: "#595959" }}>
          Select where this agent should appear:
        </div>

        <div
          style={{
            display: "grid",
            gap: 10,
            gridTemplateColumns: "1fr",
            marginTop: 4,
          }}
        >
          <label style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Checkbox
              checked={storeBharat}
              onChange={(e) => setStoreBharat(e.target.checked)}
            />
            <div>
              <div style={{ fontWeight: 600 }}>Bharat AI Store</div>
              <div style={{ color: "#8c8c8c", fontSize: 12 }}>
                Public marketplace listing inside Bharat AI Store.
              </div>
            </div>
          </label>
        </div>

        <div style={{ marginTop: 12, fontSize: 12, color: "#8c8c8c" }}>
          You can list in one or both stores. This can be changed later by
          editing the agent.
        </div>
      </Modal>

      <Modal
        open={showInstructionsModal}
        onCancel={() => {
          stopListening();
          setShowInstructionsModal(false);
        }}
        footer={null}
        title="Write Instructions"
      >
        <TextArea
          value={tempInstructions}
          onChange={(e) => setTempInstructions(e.target.value)}
          rows={8}
          style={{ borderRadius: 8 }}
          placeholder="Type or speak your instructions here…"
        />

        <div
          style={{
            marginTop: 12,
            display: "flex",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <Button
            onClick={() =>
              isListening ? stopListening() : startListening({ toModal: true })
            }
            icon={isListening ? <AudioMutedOutlined /> : <AudioOutlined />}
            danger={isListening}
          >
            {isListening ? "Stop" : "Speak"}
          </Button>

          <div>
            <Button
              onClick={() => {
                stopListening();
                setShowInstructionsModal(false);
              }}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>

            <Button
              onClick={() => {
                stopListening();
                handleSaveInstructions(); // ✅ stays open
              }}
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={showViewInstructions}
        onCancel={() => {
          setIsViewEditing(false);
          setShowViewInstructions(false);
        }}
        footer={null}
        title="Instructions"
        width={720}
        maskClosable={false} // ✅ don't close on outside click
        keyboard={false} // ✅ don't close on Esc
        destroyOnClose={false} // ✅ preserve state
      >
        {!isViewEditing ? (
          <>
            <div
              style={{
                whiteSpace: "pre-wrap",
                border: "1px dashed #e6e6e6",
                borderRadius: 8,
                padding: 12,
                maxHeight: 360,
                overflow: "auto",
                background: "#fff",
              }}
            >
              {instructions || "— No instructions yet —"}
            </div>
            <div
              style={{
                marginTop: 12,
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <Button onClick={() => setShowViewInstructions(false)}>
                Close
              </Button>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setTempInstructions(instructions);
                  setIsViewEditing(true);
                }}
              >
                Edit
              </Button>
            </div>
          </>
        ) : (
          <>
            <TextArea
              value={tempInstructions}
              onChange={(e) => setTempInstructions(e.target.value)}
              rows={10}
              style={{ borderRadius: 8 }}
            />

            <div
              style={{
                marginTop: 12,
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <Button
                onClick={() =>
                  isListening
                    ? stopListening()
                    : startListening({ toModal: true })
                }
                icon={isListening ? <AudioMutedOutlined /> : <AudioOutlined />}
                danger={isListening}
              >
                {isListening ? "Stop" : "Speak"}
              </Button>
              <div>
                <Button
                  onClick={() => {
                    stopListening();
                    setIsViewEditing(false);
                  }}
                  style={{ marginRight: 8 }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    stopListening();
                    setInstructions(tempInstructions);
                    setIsViewEditing(false);
                    setShowViewInstructions(true);
                    message.success("Instructions updated!");
                    setShowViewInstructions(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </>
        )}
      </Modal>

      {/* SUCCESS CARD */}
      {successData && (
        <SuccessAgentCard
          data={successData}
          onClose={() => setSuccessData(null)}
        />
      )}
    </div>
  );
};

export default CreateAgentWizard;
