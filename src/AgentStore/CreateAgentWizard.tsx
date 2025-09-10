// /src/AgentStore/CreateAgentWizard.tsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  SaveOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  AudioOutlined,
  AudioMutedOutlined,
} from "@ant-design/icons";
import BASE_URL from "../Config";
import AppShell from "../BharathAIStore/components/AppShell";

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

type ModelInfo = {
  id: string;
  object?: string;
  created?: number;
  owned_by?: string;
};

type AgentApiResponse = {
  id: string | null;
  userId: string | null;
  agentName: string;
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
  // backend may ignore these if unknown — included for convenience
  creatorName?: string | null;
};

const DOMAIN_OPTIONS = [
  "Law",
  "Finance",
  "Healthcare",
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
  "Taxation",
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

// ✅ Added "Other"
const AGE_LIMIT_OPTIONS = [
  "Below 18",
  "18-25",
  "26-40",
  "40-55",
  "55+",
  "Other",
];
const allAgeValues = [...AGE_LIMIT_OPTIONS];
const TONE_OPTIONS = [
  "Helpful, Professional",
  "Friendly, Supportive",
  "Formal, Concise",
  "Expert, Analytical",
  "Casual, Empathetic",
];

const RESPONSE_FORMATS = ["auto", "json_object"] as const;

const FALLBACK_MODELS: ModelInfo[] = [
  { id: "gpt-4-0613", owned_by: "openai" },
  { id: "gpt-4", owned_by: "openai" },
  { id: "gpt-3.5-turbo", owned_by: "openai" },
  { id: "gpt-4o", owned_by: "openai" },
  { id: "gpt-4o-mini", owned_by: "openai" },
];

/** Read auth token safely */
function getAuth(): string {
  try {
    return localStorage.getItem("auth_token") || "";
  } catch {
    return "";
  }
}

/** Strip empty/undefined/blank values so PATCH/POST stays clean */
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

/** Clean instruction text (only on generation/publish, not while typing) */
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
  const [agentName, setAgentName] = useState("");
  const [userRole, setUserRole] = useState("Advocate");
  const [userRoleOther, setUserRoleOther] = useState("");
  const [userExperienceSummary, setUserExperienceSummary] = useState("");
  const [description, setDescription] = useState("");
  const [strength, setStrength] = useState("");
  const [language, setLanguage] = useState("English");
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

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
  // Unique Solution is always visible (per requirement)
  const [uniqueSolution, setUniqueSolution] = useState("");

  const location = useLocation() as any;

  const [headerTitle, setHeaderTitle] = useState<string>(
    location?.state?.headerTitle === "AI Enabler" ? "AI Enabler" : "AI Twin"
  );
  const [headerStatus, setHeaderStatus] = useState<boolean>(
    typeof location?.state?.headerStatus === "boolean"
      ? Boolean(location.state.headerStatus)
      : false // per requirement: send false
  );

  // Step 3 - Audience + Config (UPDATED: multi-select targetUsers & ageLimits)
  const [targetUsers, setTargetUsers] = useState<string[]>([]);
  const [targetUserOther, setTargetUserOther] = useState("");
  const [genderSelections, setGenderSelections] = useState<string[]>([]);
  const [ageLimits, setAgeLimits] = useState<string[]>([]);
  // ✅ New: custom age when "Other" is selected
  const [ageOther, setAgeOther] = useState<string>("");

  const [converstionTone, setConverstionTone] = useState<string | undefined>(
    undefined
  );
  const [responseFormat, setResponseFormat] = useState<
    (typeof RESPONSE_FORMATS)[number] | undefined
  >(undefined);

  const [instructions, setInstructions] = useState("");
  const [generated, setGenerated] = useState(false);
  const [isEditingInstructions, setIsEditingInstructions] = useState(false);
  const [tempInstructions, setTempInstructions] = useState("");

  // Mic (speech recognition) while editing
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  // IDs & flags
  const [agentId, setAgentId] = useState<string>("");
  const [assistantId, setAssistantId] = useState<string>("");

  // Step 4 - Contact, Starters, Status
  const [shareContact, setShareContact] = useState<"YES" | "NO">("NO");
  const [contactDetails, setContactDetails] = useState("");
  const [conStarter1, setConStarter1] = useState("");
  const [conStarter2, setConStarter2] = useState("");
  const [conStarter3, setConStarter3] = useState("");
  const [conStarter4, setConStarter4] = useState("");
  const [activeStatus, setActiveStatus] = useState(true);

  // Voice: default inactive, no edit
  const [voiceStatus] = useState<boolean>(false);

  // Static channel: Text Chat active (no edit)
  const textChatActive = true;

  // Preview modal
  const [showPreview, setShowPreview] = useState(false);
  const [storeBharat, setStoreBharat] = useState(false);
  const [storeOxy, setStoreOxy] = useState(false);

  const userId = localStorage.getItem("userId") || "";
  const navigate = useNavigate();
  const bharatAgentsStoreRef = useRef<HTMLDivElement>(null);
  const aiResourcesRef = useRef<HTMLDivElement>(null);
  const freeAIBookRef = useRef<HTMLDivElement>(null);
  const isEditMode = location?.state?.mode === "edit";
  const editSeed:
    | (Partial<AgentApiResponse & Record<string, any>> | undefined)
    | undefined = location?.state?.seed;

  const purpleBtn = {
    background: "linear-gradient(135deg, #722ed1 0%, #fa8c16 100%)",
    border: "none",
    borderRadius: "8px",
  } as React.CSSProperties;

  const compactInputStyle: React.CSSProperties = {
    borderRadius: "8px",
    border: "2px solid #f0f0f0",
    transition: "all 0.3s ease",
  };

  const focusStyle = {
    borderColor: "#722ed1",
    boxShadow: "0 0 0 2px rgba(114, 46, 209, 0.1)",
  };

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

  // ✅ Replace "Other" with the custom age, if provided
  const resolvedAgeLimitsString = useMemo(() => {
    return ageLimits
      .map((a) => (a === "Other" ? ageOther.trim() || "Other" : a))
      .filter(Boolean)
      .join(", ");
  }, [ageLimits, ageOther]);

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

  // Prefill all steps when in edit mode
  useEffect(() => {
    if (!isEditMode || !editSeed) return;

    if (typeof editSeed.headerStatus === "boolean") {
      setHeaderStatus(Boolean(editSeed.headerStatus));
    }
    if (
      typeof editSeed.headerTitle === "string" &&
      editSeed.headerTitle.length
    ) {
      setHeaderTitle(
        editSeed.headerTitle === "AI Enabler" ? "AI Enabler" : "AI Twin"
      );
    }

    // IDs
    setAgentId(String(editSeed.id || editSeed.agentId || ""));
    setAssistantId(String(editSeed.assistantId || ""));
    setCreatorName(String(editSeed.creatorName || ""));

    // Step 1 – Profile
    setAgentName(editSeed.agentName || editSeed.name || "");
    setDescription(editSeed.description || "");
    setLanguage(editSeed.language || "English");
    setUserExperienceSummary(editSeed.userExperienceSummary || "");
    setUserRole(editSeed.userRole || "Advocate");

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

    // Step 3 – Audience + Config
    const priorTarget = String(editSeed.targetUser || "").trim();
    if (priorTarget) {
      const arr = priorTarget
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      setTargetUsers(arr);
    }

    // ✅ Parse age: if not in known options, set as custom "Other"
    const priorAge = String(editSeed.ageLimit || "").trim();
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
          // treat as custom
          customFound = t;
          nextAges.push("Other");
        }
      });

      setAgeLimits(Array.from(new Set(nextAges)));
      if (customFound) setAgeOther(customFound);
    }

    if (editSeed?.gender) {
      setGenderSelections(
        String(editSeed.gender)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      );
    }
    setConverstionTone(editSeed.converstionTone || undefined);
    setResponseFormat((editSeed.responseFormat as any) || undefined);
    setInstructions(editSeed.instructions || "");

    // Step 4 – Contact etc.
    const cd = String(editSeed.contactDetails || "");
    if (cd) {
      setShareContact("YES");
      setContactDetails(cd);
    } else {
      setShareContact("NO");
      setContactDetails("");
    }
    setConStarter1(editSeed.conStarter1 || "");
    setConStarter2(editSeed.conStarter2 || "");
    setConStarter3(editSeed.conStarter3 || "");
    setConStarter4(editSeed.conStarter4 || "");
    setActiveStatus(Boolean(editSeed.activeStatus));

    setStep(0);
  }, [isEditMode, editSeed]);

  /** Load Models on Step 2 (index 1); fallback if API returns nothing */
  useEffect(() => {
    if (step !== 1) return;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/ai-service/agent/models`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuth()}`,
          },
        });
        if (!res.ok) throw new Error(`Models failed: ${res.status}`);

        const data = await res.json();
        const arr = Array.isArray(data?.data) ? data.data : [];
        setModels(arr.length ? arr : FALLBACK_MODELS);
        if (!arr.length) {
          message.warning("Models API returned empty list. Using defaults.");
        }
      } catch (err: any) {
        setModels(FALLBACK_MODELS);
        message.warning(
          err?.message || "Failed to load models — using defaults."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [step]);

  const toggleGender = (g: string) => {
    setGenderSelections((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };

  // ====== VALIDATION PER STEP (MANDATORY FIELDS) ======
  const validateStep0 = (): boolean => {
    const missing: string[] = [];
    if (!agentName.trim()) missing.push("Agent Name");
    if (!creatorName.trim()) missing.push("Creator Name");
    if (!(effectiveUserRole || "").trim())
      missing.push("Professional Identity");
    if (!description.trim()) missing.push("Description");
    if (!language.trim()) missing.push("Language");

    if (missing.length) {
      message.error({
        content: `Please fill the following before Continue: ${missing.join(
          ", "
        )}`,
        style: { color: "#722ed1" },
      });
      return false;
    }
    return true;
  };

  const validateStep1 = (): boolean => {
    const missing: string[] = [];
    if (!business.trim()) missing.push("Business/Idea");
    if (!(resolvedDomain || "").trim()) missing.push("Domain/Sector");
    if (!(resolvedSubDomain || "").trim()) missing.push("Sub-Domain/Subsector");
    if (!selectedModelId?.trim()) missing.push("GPT Model");
    if (!solveProblem) missing.push("Are you solving a problem?");

    if (solveProblem === "YES") {
      if (!mainProblemText.trim()) missing.push("Main Problem to Solve");
      if (!uniqueSolution.trim()) missing.push("Unique Solution Method");
      if (mainProblemText.length > 100) {
        message.error("Main Problem to Solve must be 100 characters or less.");
        return false;
      }
      if (uniqueSolution.length > 100) {
        message.error("Unique Solution Method must be 100 characters or less.");
        return false;
      }
    }

    if (missing.length) {
      message.error({
        content: `Please fill the following before Continue: ${missing.join(
          ", "
        )}`,
        style: { color: "#722ed1" },
      });
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    const missing: string[] = [];
    if (!targetUsers.length) missing.push("Target Customers");
    if (targetUsers.includes("Other") && !targetUserOther.trim())
      missing.push("Target Customers (Other)");
    if (genderSelections.length === 0) missing.push("Target Audience Gender");
    if (!ageLimits.length) missing.push("Target Age Limit(s)");
    // ✅ Require custom age when "Other" is chosen
    if (ageLimits.includes("Other") && !ageOther.trim())
      missing.push("Custom Age Limit (Other)");
    if (!converstionTone?.trim()) missing.push("Conversation Tone");

    if (missing.length) {
      message.error({
        content: `Please fill the following before Continue: ${missing.join(
          ", "
        )}`,
        style: { color: "#722ed1" },
      });
      return false;
    }
    return true;
  };

  const next = () => {
    if (step === 0 && !validateStep0()) return;
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step < 3) setStep((step + 1) as any);
  };

  const prev = () => {
    if (step > 0) setStep((step - 1) as any);
  };

  /** Generate Instructions */
  const handleGenerate = async () => {
    if (
      !description.trim() &&
      !(solveProblem === "YES" && uniqueSolution.trim())
    ) {
      message.error(
        "Please fill either ‘Problems Solved in the Past (Description)’ or ‘Unique Solution / Method’ before generating instructions."
      );
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      setLoading(true);
      const desc = encodeURIComponent(
        classifyText || description || "Create helpful assistant instructions"
      );
      const url = `${BASE_URL}/ai-service/agent/classifyInstruct?description=${desc}`;

      const baseHeaders: Record<string, string> = {
        Authorization: `Bearer ${getAuth()}`,
      };

      let res = await fetch(url, {
        method: "POST",
        headers: { ...baseHeaders, "Content-Type": "application/json" },
        body: JSON.stringify(
          stripEmpty({
            description,
            domain: resolvedDomain,
            subDomain: resolvedSubDomain,
            targetUser: resolvedTargetUsersString,
            language,
            model: selectedModelId,
            tone: converstionTone,
            format: responseFormat,
            capabilities: [],
          })
        ),
        signal: controller.signal,
      });

      if (!res.ok && (res.status === 400 || res.status === 415)) {
        res = await fetch(url, {
          method: "POST",
          headers: baseHeaders,
          signal: controller.signal,
        });
      }
      if (!res.ok) throw new Error(`classifyInstruct failed: ${res.status}`);

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

      const cleaned = cleanInstructionText(raw);
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
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const handleEditInstructions = () => {
    setTempInstructions(instructions);
    setIsEditingInstructions(true);
  };

  const handleSaveInstructions = () => {
    setInstructions(tempInstructions);
    setIsEditingInstructions(false);
    message.success("Instructions updated!");
  };

  // Mic controls
  const startRecording = () => {
    const SR =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    if (!SR) {
      message.error("Speech recognition is not supported in this browser.");
      return;
    }
    const recog = new SR();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = "en-US";
    recog.onresult = (e: any) => {
      let transcript = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      setTempInstructions((prev) =>
        prev ? prev + " " + transcript : transcript
      );
    };
    recog.onend = () => setIsRecording(false);
    recognitionRef.current = recog;
    try {
      recog.start();
      setIsRecording(true);
    } catch {
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    try {
      recognitionRef.current?.stop?.();
    } catch {}
    setIsRecording(false);
  };

  const handleOpenPreview = () => {
    if (!agentName.trim()) {
      message.error("Please add an Agent Name before preview.");
      return;
    }
    setShowPreview(true);
  };

  /** Confirm publish from preview modal (real API) */
  const handleConfirmPublish = async () => {
    try {
      setLoading(true);

      // Build final strings for target users and age limits
      const finalTargetUsers = resolvedTargetUsersString || undefined;
      const finalAgeLimits = resolvedAgeLimitsString || undefined;

      const basePayload = stripEmpty({
        creatorName,
        acheivements,
        activeStatus,
        ageLimit: finalAgeLimits,
        agentName,
        agentStatus: "CREATED",
        business,
        conStarter1,
        conStarter2,
        conStarter3,
        conStarter4,
        contactDetails: shareContact === "YES" ? contactDetails : undefined,
        converstionTone,
        description,
        domain: resolvedDomain,
        gender: genderForText || genderSelections.join(",") || undefined,
        instructions: cleanInstructionText(instructions),
        language,
        mainProblemSolved: solveProblem === "YES" ? mainProblemText : undefined,
        uniqueSolution: solveProblem === "YES" ? uniqueSolution : undefined,
        rateThisPlatform,
        responseFormat,
        shareYourFeedback,
        status: "REQUESTED",
        subDomain: resolvedSubDomain,
        targetUser: finalTargetUsers,
        usageModel: selectedModelId,
        userExperience: Number(userExperienceSummary) || 0,
        userExperienceSummary,
        userId,
        userRole: effectiveUserRole || "Developer",
        voiceStatus: false,

        // NEW FIELDS
        headerTitle, // "AI Twin" | "AI Enabler"
        headerStatus: false, // per requirement, always send false now
      });

      // IDs only when editing (safe to always include if set)
      const idPayload = stripEmpty({
        agentId: agentId || undefined,
        assistantId: assistantId || undefined,
      });

      const payload = { ...basePayload, ...idPayload };

      const res = await fetch(`${BASE_URL}/ai-service/agent/agentCreation`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuth()}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`Publish failed: ${res.status} ${t}`);
      }
      const json = await res.json().catch(() => null);
      setShowPreview(false);
      setSuccessData(json as AgentApiResponse);
      message.success("Agent published successfully!");

      navigate("/bharath-aistore/agents", { replace: true });
    } catch (e: any) {
      message.error(e?.message || "Failed to publish agent");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: "Profile", icon: <UserOutlined /> },
    { title: "Business & GPT Model", icon: <SettingOutlined /> },
    { title: "Audience & Configuration", icon: <BulbOutlined /> },
    { title: "Publish", icon: <RocketOutlined /> },
  ];

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
            <span style={{ fontWeight: 600 }}>Agent Created</span>
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
              {((data.agentName || "AG")[0] || "A").toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>
                {data.agentName || "—"}
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
    <AppShell
      allAgentsHref="/bharath-aistore/agents"
      createAgentHref="/create-aiagent"
    >
      <div
        style={{ minHeight: "100vh", background: "#f8f9fa", padding: "16px" }}
      >
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
            style={{
              marginBottom: "16px",
              borderRadius: "12px",
              padding: "8px",
            }}
          >
            <Steps current={step} items={steps} size="small" />
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
                      marginBottom: "20px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <UserOutlined style={{ marginRight: "8px" }} />
                    Agent Creator Profile
                  </Title>

                  <Row gutter={[16, 12]}>
                    <Col xs={24} md={12}>
                      <div style={{ marginBottom: "12px" }}>
                        {labelWithInfo(
                          "AI Agent Name *",
                          "Example: 'TaxBuddy Pro', 'Visa Mentor', 'HealthCare FAQ Bot'"
                        )}
                        <Input
                          value={agentName}
                          onChange={(e) => setAgentName(e.target.value)}
                          placeholder="Enter agent name"
                          style={compactInputStyle}
                          onFocus={(e) =>
                            Object.assign(e.target.style, focusStyle)
                          }
                          onBlur={(e) =>
                            Object.assign(e.target.style, {
                              borderColor: "#f0f0f0",
                              boxShadow: "none",
                            })
                          }
                        />
                      </div>
                    </Col>

                    {/* Creator Name */}
                    <Col xs={24} md={12}>
                      <div style={{ marginBottom: "12px" }}>
                        {labelWithInfo(
                          "Creator Name *",
                          "Your full name or brand representative name."
                        )}
                        <Input
                          value={creatorName}
                          onChange={(e) => setCreatorName(e.target.value)}
                          placeholder="Enter creator name"
                          style={compactInputStyle}
                        />
                      </div>
                    </Col>

                    <Col xs={24} md={12}>
                      <div style={{ marginBottom: "12px" }}>
                        {labelWithInfo(
                          "Professional Identity of the Creator *",
                          "Select your profession. Choose 'Other' to type a custom title. Example: 'Startup Consultant', 'Legal Researcher'."
                        )}
                        <Select
                          value={userRole}
                          onChange={setUserRole}
                          placeholder="Select your role"
                          allowClear
                          style={{ width: "100%", ...compactInputStyle }}
                        >
                          <Option value="Advocate">Advocate</Option>
                          <Option value="CA">CA</Option>
                          <Option value="CS">CS</Option>
                          <Option value="Consultant">Consultant</Option>
                          <Option value="Teacher">Teacher</Option>
                          <Option value="Other">Other</Option>
                        </Select>
                        {userRole === "Other" && (
                          <Input
                            value={userRoleOther}
                            onChange={(e) => setUserRoleOther(e.target.value)}
                            placeholder="Enter your profession"
                            style={{ marginTop: 8, ...compactInputStyle }}
                          />
                        )}
                      </div>
                    </Col>

                    <Col xs={24}>
                      <div style={{ marginBottom: "12px" }}>
                        {labelWithInfo(
                          "Creator Experience Overview",
                          "Optional 1–2 lines. Example: '8+ years in corporate law, 200+ cases handled.'"
                        )}
                        <Input
                          value={userExperienceSummary}
                          onChange={(e) =>
                            setUserExperienceSummary(e.target.value)
                          }
                          placeholder="Brief summary (optional)"
                          maxLength={120}
                          style={compactInputStyle}
                          suffix={
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              {userExperienceSummary.length}/120
                            </Text>
                          }
                        />
                      </div>
                    </Col>

                    <Col xs={24}>
                      <div style={{ marginBottom: "12px" }}>
                        {labelWithInfo(
                          "Problems Solved in the Past (Description) *",
                          "Give 2–3 representative cases. Example: 'Helped startups register within 3 days', 'Drafted 100+ GST filings monthly'."
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
                          style={{
                            fontSize: "12px",
                            float: "right",
                            marginTop: "2px",
                          }}
                        >
                          {description.length}/250
                        </Text>
                      </div>
                    </Col>

                    <Col xs={24} md={12}>
                      <div style={{ marginBottom: "12px" }}>
                        {labelWithInfo(
                          "Your Strengths in the Field",
                          "Optional. Example: 'Contract drafting', 'Appeals', 'Financial modeling'."
                        )}
                        <Input
                          value={strength}
                          onChange={(e) => setStrength(e.target.value)}
                          placeholder="(optional)"
                          maxLength={100}
                          style={compactInputStyle}
                          suffix={
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              {strength.length}/100
                            </Text>
                          }
                        />
                      </div>
                    </Col>

                    <Col xs={24} md={12}>
                      <div style={{ marginBottom: "12px" }}>
                        {labelWithInfo(
                          "Preferred Language *",
                          "The language you prefer for conversations and output."
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
                      marginBottom: "20px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <SettingOutlined style={{ marginRight: "8px" }} />
                    Business Context & GPT Model
                  </Title>

                  <Row gutter={[16, 12]}>
                    <Col xs={24} md={12}>
                      <div style={{ marginBottom: "12px" }}>
                        {labelWithInfo(
                          "Business/Idea *",
                          "Your brand, firm or practice. Example: 'ABC Legal', 'FinTax Advisors'."
                        )}
                        <Input
                          value={business}
                          onChange={(e) => setBusiness(e.target.value)}
                          placeholder="Firm/brand/practice"
                          style={compactInputStyle}
                        />
                      </div>
                    </Col>

                    {/* Domain dropdown + 'Other' text */}
                    <Col xs={24} md={12}>
                      <div style={{ marginBottom: "12px" }}>
                        {labelWithInfo(
                          "Domain/Sector *",
                          "Pick from common domains or choose 'Other' to type your own."
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
                          />
                        )}
                      </div>
                    </Col>

                    {/* SubDomain dropdown + 'Other' text */}
                    <Col xs={24} md={12}>
                      <div style={{ marginBottom: "12px" }}>
                        {labelWithInfo(
                          "Sub-Domain/Subsector *",
                          "Pick from common subsectors or choose 'Other' to type your own."
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
                          />
                        )}
                      </div>
                    </Col>

                    {/* GPT Model */}
                    <Col xs={24} md={12}>
                      <div style={{ marginBottom: "12px" }}>
                        {labelWithInfo(
                          "GPT Model *",
                          "Example: gpt-4o, gpt-4. Pick a capable model for better reasoning."
                        )}
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
                              {m.id} {m.owned_by ? `· ${m.owned_by}` : ""}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    </Col>

                    {/* Are you solving a problem? */}
                    <Col xs={24} md={12}>
                      <div style={{ marginBottom: 12 }}>
                        {labelWithInfo(
                          "Are you solving a problem? *",
                          "If Yes, specify the problem and (also) your unique solution."
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

                    {/* Main Problem only when YES */}
                    {solveProblem === "YES" && (
                      <Col xs={24}>
                        <div style={{ marginBottom: 12 }}>
                          {labelWithInfo(
                            "Main Problem to Solve * (max 100 chars)",
                            "What exact user problem are you solving?"
                          )}
                          <TextArea
                            value={mainProblemText}
                            onChange={(e) => setMainProblemText(e.target.value)}
                            placeholder="e.g., 'Early-stage startups struggle to choose the right company structure and miss compliance deadlines.'"
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

                    {/* Unique Solution ALWAYS visible */}
                    <Col xs={24}>
                      <div style={{ marginBottom: 12 }}>
                        {labelWithInfo(
                          "Unique Solution Method (max 100 chars)",
                          "How is your approach different/better?"
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

              {/* STEP 3 */}
              {step === 2 && (
                <div>
                  <Title
                    level={4}
                    style={{
                      color: "#722ed1",
                      marginBottom: "20px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <BulbOutlined style={{ marginRight: "8px" }} />
                    Audience & Configuration
                  </Title>

                  <Row gutter={[16, 12]}>
                    {/* Target audience (UPDATED: multiple) */}
                    <Col xs={24} md={12}>
                      <div style={{ marginBottom: "12px" }}>
                        {labelWithInfo(
                          "Target Customers *",
                          "You can select multiple. Example: 'Startups', 'SMBs', 'Students'."
                        )}
                        <Select
                          mode="multiple"
                          value={targetUsers}
                          onChange={setTargetUsers}
                          placeholder="Select target audience"
                          allowClear
                          style={{ width: "100%", ...compactInputStyle }}
                        >
                          {TARGET_USER_OPTIONS.map((option) => (
                            <Option key={option} value={option}>
                              {option}
                            </Option>
                          ))}
                        </Select>
                        {targetUsers.includes("Other") && (
                          <Input
                            style={{ marginTop: "8px", ...compactInputStyle }}
                            placeholder="Specify your target user(s)"
                            value={targetUserOther}
                            onChange={(e) => setTargetUserOther(e.target.value)}
                          />
                        )}
                      </div>
                    </Col>

                    {/* Gender */}
                    <Col xs={24} md={12}>
                      <div style={{ marginBottom: "12px" }}>
                        {labelWithInfo(
                          "Target Audience Gender *",
                          "Pick one or more if your audience is specific."
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

                    {/* Age limits (with "Select All" option in the list) */}
                    <Col xs={24} md={12}>
                      <div style={{ marginBottom: "12px" }}>
                        {labelWithInfo(
                          "Target Audience Age Limit *",
                          "Select one or more relevant age ranges. Choose 'Select All' to pick everything."
                        )}
                        <Select
                          mode="multiple"
                          value={ageLimits}
                          onChange={(vals) => {
                            if (vals.includes("Select All")) {
                              // If "Select All" picked, replace with all options
                              setAgeLimits(AGE_LIMIT_OPTIONS);
                              // clear custom age only if "Other" not included
                              if (!AGE_LIMIT_OPTIONS.includes("Other"))
                                setAgeOther("");
                            } else {
                              setAgeLimits(vals);
                              if (!vals.includes("Other")) setAgeOther("");
                            }
                          }}
                          placeholder="Select age range(s)"
                          allowClear
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
                            style={{ marginTop: "8px", ...compactInputStyle }}
                            placeholder="Enter custom age (e.g., 21-30 or 16+)"
                            value={ageOther}
                            onChange={(e) => setAgeOther(e.target.value)}
                            maxLength={20}
                          />
                        )}
                      </div>
                    </Col>

                    {/* Tone & Response Format */}
                    <Col xs={24} md={12}>
                      <div style={{ marginBottom: "12px" }}>
                        {labelWithInfo(
                          "Conversation Tone *",
                          "Example: Helpful & Professional for legal/finance agents."
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

                    <Col xs={24} md={12}>
                      <div style={{ marginBottom: "12px" }}>
                        {labelWithInfo(
                          "Response Format",
                          "auto (natural text) or json_object (structured output)."
                        )}
                        <Select
                          value={responseFormat}
                          onChange={setResponseFormat}
                          placeholder="Select response format"
                          allowClear
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

                    {/* Instructions (with Mic while editing) */}
                    <Col xs={24}>
                      <div style={{ marginBottom: "12px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                            gap: 8,
                          }}
                        >
                          {labelWithInfo(
                            "Instructions",
                            "Click Generate to auto-create; you can then Edit. Keep it concise and actionable."
                          )}
                          <Space>
                            <Button
                              type="primary"
                              size="small"
                              onClick={handleGenerate}
                              loading={loading}
                              style={purpleBtn}
                            >
                              Generate
                            </Button>
                            {instructions && (
                              <Button
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => {
                                  setTempInstructions(instructions);
                                  setShowInstructionsModal(true);
                                }}
                              >
                                Edit
                              </Button>
                            )}
                          </Space>
                        </div>

                        {!isEditingInstructions ? (
                          <div
                            style={{
                              minHeight: 140,
                              maxHeight: 240,
                              padding: "12px",
                              border: "2px solid #f0f0f0",
                              borderRadius: "8px",
                              background: instructions ? "#fafafa" : "#f9f9f9",
                              whiteSpace: "pre-wrap",
                              fontSize: "14px",
                              lineHeight: 1.4,
                              overflowY: "auto",
                            }}
                          >
                            {instructions ||
                              "Click 'Generate' to create instructions automatically, then use 'Edit' to customize them."}
                          </div>
                        ) : (
                          <div>
                            <TextArea
                              value={tempInstructions}
                              onChange={(e) =>
                                setTempInstructions(e.target.value)
                              }
                              rows={10}
                              maxLength={7000}
                              style={{ ...compactInputStyle, maxHeight: 320 }}
                            />
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginTop: "8px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <Text
                                  type="secondary"
                                  style={{ fontSize: "12px" }}
                                >
                                  {tempInstructions.length}/7000
                                </Text>
                                <Tooltip
                                  title={
                                    isRecording
                                      ? "Stop mic"
                                      : "Use mic to dictate"
                                  }
                                >
                                  <Button
                                    size="small"
                                    icon={
                                      isRecording ? (
                                        <AudioMutedOutlined />
                                      ) : (
                                        <AudioOutlined />
                                      )
                                    }
                                    onClick={
                                      isRecording
                                        ? stopRecording
                                        : startRecording
                                    }
                                  >
                                    {isRecording ? "Stop" : "Mic"}
                                  </Button>
                                </Tooltip>
                              </div>
                              <Space>
                                <Button
                                  size="small"
                                  onClick={() => {
                                    stopRecording();
                                    setTempInstructions("");
                                    setIsEditingInstructions(false);
                                  }}
                                  icon={<CloseOutlined />}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="primary"
                                  size="small"
                                  onClick={() => {
                                    stopRecording();
                                    handleSaveInstructions();
                                  }}
                                  icon={<SaveOutlined />}
                                  style={purpleBtn}
                                >
                                  Save
                                </Button>
                              </Space>
                            </div>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>
              )}

              {/* STEP 4 */}
              {step === 3 && (
                <div>
                  <Title
                    level={4}
                    style={{
                      color: "#722ed1",
                      marginBottom: "20px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <RocketOutlined style={{ marginRight: "8px" }} />
                    Contact, Conversations & Publish
                  </Title>

                  <Row gutter={[16, 12]}>
                    {/* Share contact? */}
                    <Col xs={24} md={12}>
                      <div style={{ marginBottom: "12px" }}>
                        {labelWithInfo(
                          "Do you want to share Contact Details? *",
                          "Choose Yes to display your contact on the agent card."
                        )}
                        <Radio.Group
                          value={shareContact}
                          onChange={(e) => setShareContact(e.target.value)}
                        >
                          <Radio value="YES">Yes</Radio>
                          <Radio value="NO">No</Radio>
                        </Radio.Group>
                      </div>
                    </Col>

                    {/* Contact field only when YES */}
                    {shareContact === "YES" && (
                      <Col xs={24}>
                        <div style={{ marginBottom: "12px" }}>
                          {labelWithInfo(
                            "Contact Details",
                            "Email / Phone / Website for users to reach you."
                          )}
                          <Input
                            value={contactDetails}
                            onChange={(e) => setContactDetails(e.target.value)}
                            placeholder="Email/Phone/Website"
                            style={compactInputStyle}
                          />
                        </div>
                      </Col>
                    )}

                    <Col xs={24} md={12}>
                      <div style={{ marginBottom: "12px" }}>
                        {labelWithInfo(
                          "Conversation Starter 1",
                          'Example: "What service do you need help with today?"'
                        )}
                        <Input
                          value={conStarter1}
                          onChange={(e) => setConStarter1(e.target.value)}
                          placeholder='e.g., "What service do you need help with today?"'
                          style={compactInputStyle}
                        />
                      </div>
                    </Col>

                    <Col xs={24} md={12}>
                      <div style={{ marginBottom: "12px" }}>
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
                      <div style={{ marginBottom: "12px" }}>
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
                      <div style={{ marginBottom: "12px" }}>
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
                      <div style={{ marginBottom: "12px" }}>
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

                    {/* Channels (static) */}
                    <Col xs={24} md={8}>
                      <div style={{ marginBottom: "12px" }}>
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
                      <div style={{ marginBottom: "12px" }}>
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
                  style={{ minWidth: "100px" }}
                >
                  Previous
                </Button>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  {loading && <Text type="secondary">Working...</Text>}

                  {step < 3 ? (
                    <Button
                      type="primary"
                      size="large"
                      onClick={next}
                      loading={loading}
                      style={{ minWidth: "120px", ...purpleBtn }}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleOpenPreview}
                      loading={loading}
                      icon={<EyeOutlined />}
                      style={{ minWidth: "140px", ...purpleBtn }}
                    >
                      Preview & Publish
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* PREVIEW MODAL */}
        <Modal
          title={
            <div style={{ textAlign: "center", padding: "8px" }}>
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
                marginBottom: "16px",
                border: "1px solid #e6e6ff",
                borderRadius: "8px",
              }}
            >
              <Title
                level={4}
                style={{ color: "#722ed1", marginBottom: "8px" }}
              >
                {agentName || "Agent Name"}
              </Title>
              <Paragraph
                style={{
                  color: "#666",
                  marginBottom: "12px",
                  fontSize: "14px",
                }}
              >
                {description || uniqueSolution || "No description provided."}
              </Paragraph>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {[conStarter1, conStarter2, conStarter3, conStarter4]
                  .filter(Boolean)
                  .map((starter, index) => (
                    <Tag
                      key={index}
                      color="gold"
                      style={{
                        padding: "2px 8px",
                        borderRadius: "12px",
                        border: "1px solid #fa8c16",
                        fontSize: "12px",
                      }}
                    >
                      {starter}
                    </Tag>
                  ))}
              </div>
            </Card>

            <Card
              title={
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Text strong>Choose Stores</Text>
                  <Tooltip title="It may launch soon and price is applicable.">
                    <InfoCircleOutlined style={{ color: "#8c8c8c" }} />
                  </Tooltip>
                </div>
              }
              size="small"
              style={{
                marginBottom: "16px",
                border: "1px solid #e6e6ff",
                borderRadius: "8px",
              }}
            >
              <Row gutter={[12, 12]}>
                <Col xs={24} md={12}>
                  <Checkbox
                    checked={storeBharat}
                    onChange={(e) => setStoreBharat(e.target.checked)}
                  >
                    <div>
                      <Text strong style={{ fontSize: "14px" }}>
                        Bharat AI Store
                      </Text>
                      <br />
                      <Text type="success" style={{ fontSize: "12px" }}>
                        Free
                      </Text>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {" "}
                        (Label: INR 1000)
                      </Text>
                    </div>
                  </Checkbox>
                </Col>

                <Col xs={24} md={12}>
                  <Checkbox
                    checked={storeOxy}
                    onChange={(e) => setStoreOxy(e.target.checked)}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Text strong style={{ fontSize: "14px" }}>
                          OXY GPT Store
                        </Text>
                        <Tooltip title="It may launch soon and price is applicable.">
                          <InfoCircleOutlined style={{ color: "#8c8c8c" }} />
                        </Tooltip>
                      </div>
                      <Text style={{ fontSize: "12px" }}>$19</Text>{" "}
                      <Tag
                        color="blue"
                        style={{ borderRadius: 6, marginLeft: 4 }}
                      >
                        Free for now
                      </Tag>
                    </div>
                  </Checkbox>
                </Col>
              </Row>
            </Card>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <Button onClick={() => setShowPreview(false)}>
                Back to Edit
              </Button>
              <Button
                type="primary"
                onClick={handleConfirmPublish}
                loading={loading}
                style={purpleBtn}
              >
                Confirm & Publish
              </Button>
            </div>
          </div>
        </Modal>

        {/* Fullscreen Instructions Modal */}
        <Modal
          open={showInstructionsModal}
          onCancel={() => {
            stopRecording();
            setShowInstructionsModal(false);
          }}
          width="90%"
          style={{ top: 20 }}
          bodyStyle={{ height: "80vh", padding: 0 }}
          footer={null}
        >
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            {/* Header */}
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid #f0f0f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text strong>Edit Instructions</Text>
              <Space>
                {/* Mic button */}
                <Tooltip
                  title={isRecording ? "Stop Mic" : "Use mic to dictate"}
                >
                  <Button
                    size="small"
                    icon={
                      isRecording ? <AudioMutedOutlined /> : <AudioOutlined />
                    }
                    onClick={isRecording ? stopRecording : startRecording}
                  >
                    {isRecording ? "Stop" : "Mic"}
                  </Button>
                </Tooltip>

                <Button
                  onClick={() => {
                    stopRecording();
                    setShowInstructionsModal(false);
                  }}
                  icon={<CloseOutlined />}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={() => {
                    stopRecording();
                    setInstructions(tempInstructions);
                    setShowInstructionsModal(false);
                    message.success("Instructions updated!");
                  }}
                  style={purpleBtn}
                >
                  Save
                </Button>
              </Space>
            </div>

            {/* Textarea */}
            <TextArea
              value={tempInstructions}
              onChange={(e) => setTempInstructions(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                borderRadius: 0,
                padding: 16,
                fontSize: 15,
                lineHeight: 1.5,
              }}
              autoSize={{ minRows: 20 }}
            />
          </div>
        </Modal>

        {successData && (
          <SuccessAgentCard
            data={successData}
            onClose={() => setSuccessData(null)}
          />
        )}
      </div>
    </AppShell>
  );
};

export default CreateAgentWizard;
