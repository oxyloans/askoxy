import React, { useEffect, useMemo, useState } from "react";
import {
  Steps,
  Input,
  Select,
  Button,
  Card,
  Row,
  Col,
  Checkbox,
  Upload,
  Modal,
  Switch,
  message,
  Typography,
  Space,
  Tag,
  Divider,
  Rate,
} from "antd";
import {
  UserOutlined,
  SettingOutlined,
  BulbOutlined,
  RocketOutlined,
  UploadOutlined,
  SendOutlined,
  EyeOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import BASE_URL from "../Config";

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
};
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
    .replace(/^\uFEFF/, "") // strip BOM
    .replace(/```[\s\S]*?```/g, "") // drop fenced code blocks
    .replace(/^#+\s?/gm, "") // remove markdown headings
    .replace(/\*+/g, "") // remove asterisks
    .replace(/[ \t]+/g, " ") // collapse spaces/tabs
    .replace(/\r\n?/g, "\n") // normalize newlines
    .replace(/[ \t]*\n[ \t]*/g, "\n") // trim around newlines
    .replace(/\n{3,}/g, "\n\n") // max one blank line
    .trim();
  return t.slice(0, 7000); // hard cap
}

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

const AGE_LIMIT_OPTIONS = ["Below 18", "18-25", "26-40", "40-55", "55+"];

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

const CreateAgentWizard: React.FC = () => {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [loading, setLoading] = useState(false);

  // Step 1 - Profile
  const [acheivements, setAcheivements] = useState("");
  const [agentName, setAgentName] = useState("");
  const [userRole, setUserRole] = useState("Advocate");
  const [userExperienceSummary, setUserExperienceSummary] = useState("");
  const [description, setDescription] = useState("");
  const [strength, setStrength] = useState("");
  const [genderSelections, setGenderSelections] = useState<string[]>([]);
  const [language, setLanguage] = useState("English");
  // Step 4 fields
  const [rateThisPlatform, setRateThisPlatform] = useState<number>(0); // 0–5
  const [shareYourFeedback, setShareYourFeedback] = useState<string>(""); // free text
  const [successData, setSuccessData] = useState<AgentApiResponse | null>(null);

  // Step 2 - Business & Model & Target & Age
  const [business, setBusiness] = useState("");
  const [domain, setDomain] = useState("");
  const [subDomain, setSubDomain] = useState("");
  const [targetUser, setTargetUser] = useState("");
  const [targetUserOther, setTargetUserOther] = useState("");
  const [ageLimit, setAgeLimit] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");
  const [models, setModels] = useState<ModelInfo[]>([]);

  // Step 3 - Problem, Solution, Tone, Response Format, Capabilities, Instructions
  const [mainProblemSolved, setMainProblemSolved] = useState("");
  const [uniqueSolution, setUniqueSolution] = useState("");
  const [converstionTone, setConverstionTone] = useState(TONE_OPTIONS[0]);
  const [responseFormat, setResponseFormat] =
    useState<(typeof RESPONSE_FORMATS)[number]>("auto");
  const [capCodeInterpreter, setCapCodeInterpreter] = useState(false);
  const [capFileSearch, setCapFileSearch] = useState(false);
  const [fileSearchFiles, setFileSearchFiles] = useState<File[]>([]);
  const [instructions, setInstructions] = useState("");
  const [generated, setGenerated] = useState(false);
  const [isEditingInstructions, setIsEditingInstructions] = useState(false);
  const [tempInstructions, setTempInstructions] = useState("");
  const [agentId, setAgentId] = useState<string>("");

  // Step 4 - Contact, Starters, Usage Model & Publish
  const [contactDetails, setContactDetails] = useState("");
  const [conStarter1, setConStarter1] = useState("");
  const [conStarter2, setConStarter2] = useState("");
  const [conStarter3, setConStarter3] = useState("");
  const [conStarter4, setConStarter4] = useState("");
  const [activeStatus, setActiveStatus] = useState(true);
  const [voiceStatus, setVoiceStatus] = useState(true);
  const [assistantId, setAssistantId] = useState<string>("");

  // Preview modal
  const [showPreview, setShowPreview] = useState(false);
  const [storeBharat, setStoreBharat] = useState(false);
  const [storeOxy, setStoreOxy] = useState(false);
  const [previewChat, setPreviewChat] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);
  const [previewInput, setPreviewInput] = useState("");
  const userId = localStorage.getItem("userId") || "";

  // theme helpers
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

  const genderForText = useMemo(
    () => genderSelections.filter(Boolean).join(", "),
    [genderSelections]
  );
  // Concise context string the API can use to classify / generate instructions
  const classifyText = useMemo(() => {
    const tgt =
      targetUser === "Other" ? targetUserOther?.trim() || "Other" : targetUser;

    const parts = [
      description?.trim(),
      mainProblemSolved?.trim() && `Main Problem: ${mainProblemSolved.trim()}`,
      uniqueSolution?.trim() && `Solution: ${uniqueSolution.trim()}`,
      (domain?.trim() || subDomain?.trim()) &&
        `Domain: ${[domain?.trim(), subDomain?.trim()]
          .filter(Boolean)
          .join(" / ")}`,
      business?.trim() && `Business: ${business.trim()}`,
      tgt?.trim() && `Target: ${tgt.trim()}`,
      genderForText && `Gender: ${genderForText}`,
      converstionTone?.trim() && `Tone: ${converstionTone.trim()}`,
      responseFormat && `Response: ${responseFormat}`,
      selectedModelId?.trim() && `Model: ${selectedModelId.trim()}`,
      language?.trim() && `Language: ${language.trim()}`,
    ].filter(Boolean);

    return parts.join(" | ");
  }, [
    description,
    mainProblemSolved,
    uniqueSolution,
    domain,
    subDomain,
    business,
    targetUser,
    targetUserOther,
    genderForText,
    converstionTone,
    responseFormat,
    selectedModelId,
    language,
  ]);

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
    if (!userRole.trim()) missing.push("Professional Identity");
    if (!description.trim()) missing.push("Description");
    if (genderSelections.length === 0) missing.push("Gender");
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
    if (!targetUser.trim()) missing.push("Target User");
    if (targetUser === "Other" && !targetUserOther.trim())
      missing.push("Target User (Other)");
    if (!domain.trim()) missing.push("Domain");
    if (!subDomain.trim()) missing.push("Sub-Domain");
    if (!ageLimit.trim()) missing.push("Age Limit");
    if (!selectedModelId.trim()) missing.push("Model");

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
    if (!converstionTone.trim()) missing.push("Conversation Tone");
    if (!uniqueSolution.trim()) missing.push("Unique Solution");

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

  /** Generate Instructions with validation (API call + timeout + robust parsing) */
  const handleGenerate = async () => {
    // Validate: need either Description OR Unique Solution
    if (!description.trim() && !uniqueSolution.trim()) {
      message.error(
        "Please fill either ‘Problems Solved in the Past (Description)’ or ‘Unique Solution / Method’ before generating instructions."
      );
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

    try {
      setLoading(true);
      const desc = encodeURIComponent(
        classifyText || description || "Create helpful assistant instructions"
      );
      const url = `${BASE_URL}/ai-service/agent/classifyInstruct?description=${desc}`;

      const baseHeaders: Record<string, string> = {
        Authorization: `Bearer ${getAuth()}`,
      };

      // Try with JSON body first (extra context)
      let res = await fetch(url, {
        method: "POST",
        headers: { ...baseHeaders, "Content-Type": "application/json" },
        body: JSON.stringify(
          stripEmpty({
            description,
            domain,
            subDomain,
            targetUser: targetUser === "Other" ? targetUserOther : targetUser,
            language,
            model: selectedModelId,
            tone: converstionTone,
            format: responseFormat,
            capabilities: [
              capCodeInterpreter ? "code_interpreter" : null,
              capFileSearch ? "file_search" : null,
            ].filter(Boolean),
          })
        ),
        signal: controller.signal,
      });

      // Fallback: servers that don't accept JSON body
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
        // Some servers return plain text that *looks* like JSON or includes markdown headings
        // Try to parse; if it fails, continue with the raw text
        try {
          const maybe = JSON.parse(raw);
          raw =
            typeof maybe === "string"
              ? maybe
              : maybe.instructions || maybe.message || raw;
        } catch {
          // Strip obvious markdown headings like "# Instruct" before final clean
          raw = raw.replace(/^#{1,6}\s?.*$/gm, "").trim();
        }
      }

      // Clean only on generation (not on every keystroke)
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

      const payload = stripEmpty({
        acheivements,
        activeStatus,
        ageLimit,
        agentName,
        agentStatus: "CREATED",
        business,
        conStarter1,
        conStarter2,
        conStarter3,
        conStarter4,
        contactDetails,
        converstionTone,
        description,
        domain,
        gender: genderForText || genderSelections.join(",") || undefined,
        instructions: cleanInstructionText(instructions),
        language,
        mainProblemSolved,
        rateThisPlatform,
        responseFormat,
        shareYourFeedback,
        status: "REQUESTED",
        subDomain,
        targetUser: targetUser === "Other" ? targetUserOther : targetUser,
        uniqueSolution,

        // ✅ FIXES
        usageModel: selectedModelId,

        // keep types clean
        userExperience: Number(userExperienceSummary) || 0,
        userExperienceSummary,

        userId,
        userRole: userRole || "Developer",
        voiceStatus: voiceStatus ?? true,
      });

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
      setSuccessData(json as AgentApiResponse); // open success modal
      message.success("Agent published successfully!");

      setShowPreview(false);
      message.success("Agent published successfully!");
    } catch (e: any) {
      message.error(e?.message || "Failed to publish agent");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: "Profile", icon: <UserOutlined /> },
    { title: "Business & Model", icon: <SettingOutlined /> },
    { title: "Configuration", icon: <BulbOutlined /> },
    { title: "Publish", icon: <RocketOutlined /> },
  ];
  // 4) Add this helper UI component (below the main return, above export default is fine)
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
                  Agent Profile
                </Title>

                <Row gutter={[16, 12]}>
                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: "12px" }}>
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        Agent Name *
                      </Text>
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

                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: "12px" }}>
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        Professional Identity *
                      </Text>
                      <Select
                        value={userRole}
                        onChange={setUserRole}
                        style={{ width: "100%", ...compactInputStyle }}
                        placeholder="Select your role"
                      >
                        <Option value="Advocate">Advocate</Option>
                        <Option value="CA/CS">CA/CS</Option>
                        <Option value="Consultant">Consultant</Option>
                        <Option value="Teacher">Teacher</Option>
                        <Option value="Other">Other</Option>
                      </Select>
                    </div>
                  </Col>

                  <Col xs={24}>
                    <div style={{ marginBottom: "12px" }}>
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        Your Experience Summary
                      </Text>
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
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        Problems Solved in the Past (Description) *
                      </Text>
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
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        Your Strengths
                      </Text>
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
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        Language *
                      </Text>
                      <Select
                        value={language}
                        onChange={setLanguage}
                        style={{ width: "100%", ...compactInputStyle }}
                      >
                        <Option value="English">English</Option>
                        <Option value="తెలుగు">తెలుగు</Option>
                        <Option value="हिंदी">हिंदी</Option>
                      </Select>
                    </div>
                  </Col>

                  <Col xs={24}>
                    <div style={{ marginBottom: "12px" }}>
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        Gender (select at least one) *
                      </Text>
                      <Checkbox.Group
                        options={["Male", "Female", "Other"]}
                        value={genderSelections}
                        onChange={(vals) =>
                          setGenderSelections(vals as string[])
                        }
                      />
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
                  Business Context & Model
                </Title>

                <Row gutter={[16, 12]}>
                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: "12px" }}>
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        Business/Idea *
                      </Text>
                      <Input
                        value={business}
                        onChange={(e) => setBusiness(e.target.value)}
                        placeholder="Firm/brand/practice"
                        style={compactInputStyle}
                      />
                    </div>
                  </Col>

                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: "12px" }}>
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        Target User *
                      </Text>
                      <Select
                        value={targetUser}
                        onChange={setTargetUser}
                        placeholder="Select target audience"
                        style={{ width: "100%", ...compactInputStyle }}
                      >
                        {TARGET_USER_OPTIONS.map((option) => (
                          <Option key={option} value={option}>
                            {option}
                          </Option>
                        ))}
                      </Select>
                      {targetUser === "Other" && (
                        <Input
                          style={{ marginTop: "8px", ...compactInputStyle }}
                          placeholder="Specify your target user"
                          value={targetUserOther}
                          onChange={(e) => setTargetUserOther(e.target.value)}
                        />
                      )}
                    </div>
                  </Col>

                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: "12px" }}>
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        Domain *
                      </Text>
                      <Input
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="e.g., Law"
                        style={compactInputStyle}
                      />
                    </div>
                  </Col>

                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: "12px" }}>
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        Sub-Domain *
                      </Text>
                      <Input
                        value={subDomain}
                        onChange={(e) => setSubDomain(e.target.value)}
                        placeholder="e.g., Civil, Corporate"
                        style={compactInputStyle}
                      />
                    </div>
                  </Col>

                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: "12px" }}>
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        Age Limit *
                      </Text>
                      <Select
                        value={ageLimit}
                        onChange={setAgeLimit}
                        placeholder="Select age range"
                        style={{ width: "100%", ...compactInputStyle }}
                      >
                        {AGE_LIMIT_OPTIONS.map((option) => (
                          <Option key={option} value={option}>
                            {option}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </Col>

                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: "12px" }}>
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        Model *
                      </Text>
                      <Select
                        value={selectedModelId}
                        onChange={setSelectedModelId}
                        placeholder="Select AI model"
                        style={{ width: "100%", ...compactInputStyle }}
                        loading={loading}
                      >
                        {models.map((m) => (
                          <Option key={m.id} value={m.id}>
                            {m.id} {m.owned_by ? `· ${m.owned_by}` : ""}
                          </Option>
                        ))}
                      </Select>
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
                  Agent Configuration
                </Title>

                <Row gutter={[16, 12]}>
                  <Col xs={24}>
                    <div style={{ marginBottom: "12px" }}>
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        Main Problem to Solve
                      </Text>
                      <Input
                        value={mainProblemSolved}
                        onChange={(e) => setMainProblemSolved(e.target.value)}
                        placeholder="(optional)"
                        style={compactInputStyle}
                      />
                    </div>
                  </Col>

                  <Col xs={24}>
                    <div style={{ marginBottom: "12px" }}>
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        Unique Solution / Method *
                      </Text>
                      <TextArea
                        value={uniqueSolution}
                        onChange={(e) => setUniqueSolution(e.target.value)}
                        placeholder="Describe your unique approach"
                        rows={3}
                        style={compactInputStyle}
                      />
                    </div>
                  </Col>

                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: "12px" }}>
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        Conversation Tone *
                      </Text>
                      <Select
                        value={converstionTone}
                        onChange={setConverstionTone}
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
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        Response Format
                      </Text>
                      <Select
                        value={responseFormat}
                        onChange={setResponseFormat}
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

                  {/* Capabilities (unchanged) */}
                  <Col xs={24}>
                    <div style={{ marginBottom: "12px" }}>
                      <Text strong>Capabilities</Text>
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <Checkbox
                          checked={capCodeInterpreter}
                          onChange={(e) =>
                            setCapCodeInterpreter(e.target.checked)
                          }
                        >
                          Code Interpreter
                        </Checkbox>
                        <Checkbox
                          checked={capFileSearch}
                          onChange={(e) => setCapFileSearch(e.target.checked)}
                        >
                          File Search
                        </Checkbox>
                        {capFileSearch && (
                          <div>
                            <Upload
                              multiple
                              beforeUpload={(file) => {
                                setFileSearchFiles((prev) => [...prev, file]);
                                return false;
                              }}
                              fileList={[]}
                            >
                              <Button icon={<UploadOutlined />} size="small">
                                Upload Files
                              </Button>
                            </Upload>
                            {fileSearchFiles.length > 0 && (
                              <div style={{ marginTop: "8px" }}>
                                {fileSearchFiles.map((file, index) => (
                                  <Tag
                                    key={index}
                                    closable
                                    onClose={() =>
                                      setFileSearchFiles((prev) =>
                                        prev.filter((_, i) => i !== index)
                                      )
                                    }
                                  >
                                    {file.name}
                                  </Tag>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </Space>
                    </div>
                  </Col>

                  {/* Instructions (unchanged logic) */}
                  <Col xs={24}>
                    <div style={{ marginBottom: "12px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <Text strong>Instructions</Text>
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
                              onClick={handleEditInstructions}
                              disabled={isEditingInstructions}
                            >
                              Edit
                            </Button>
                          )}
                        </Space>
                      </div>

                      {!isEditingInstructions ? (
                        <div
                          style={{
                            minHeight: "120px",
                            padding: "12px",
                            border: "2px solid #f0f0f0",
                            borderRadius: "8px",
                            background: instructions ? "#fafafa" : "#f9f9f9",
                            whiteSpace: "pre-wrap",
                            fontSize: "14px",
                            lineHeight: "1.4",
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
                            rows={8}
                            maxLength={7000}
                            style={compactInputStyle}
                          />
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginTop: "8px",
                            }}
                          >
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              {tempInstructions.length}/7000
                            </Text>
                            <Space>
                              <Button
                                size="small"
                                onClick={() => {
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
                                onClick={handleSaveInstructions}
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

            {/* STEP 4 (unchanged UI) */}
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
                  Contact, Starters & Publish
                </Title>

                <Row gutter={[16, 12]}>
                  <Col xs={24}>
                    <div style={{ marginBottom: "12px" }}>
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        Contact Details (optional)
                      </Text>
                      <Input
                        value={contactDetails}
                        onChange={(e) => setContactDetails(e.target.value)}
                        placeholder="Email/Phone/Website"
                        style={compactInputStyle}
                      />
                    </div>
                  </Col>

                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: "12px" }}>
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        Conversation Starter 1
                      </Text>
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
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        Conversation Starter 2
                      </Text>
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
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        Conversation Starter 3
                      </Text>
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
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        Conversation Starter 4
                      </Text>
                      <Input
                        value={conStarter4}
                        onChange={(e) => setConStarter4(e.target.value)}
                        placeholder='e.g., "Prefer English/తెలుగు/हिंदी?"'
                        style={compactInputStyle}
                      />
                    </div>
                  </Col>

                  {/* Rate this Platform (0–5) */}
                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: "12px" }}>
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        Rate this Platform
                      </Text>
                      {/* Stars prevent invalid strings like "GOOD" */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Rate
                          value={rateThisPlatform}
                          onChange={(val) => setRateThisPlatform(val)}
                          allowClear
                        />
                        <Text type="secondary">{rateThisPlatform}/5</Text>
                      </div>
                    </div>
                  </Col>

                  {/* Share Your Feedback (string) */}
                  <Col xs={24}>
                    <div style={{ marginBottom: "12px" }}>
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        Share Your Feedback (optional)
                      </Text>
                      <TextArea
                        rows={3}
                        value={shareYourFeedback}
                        onChange={(e) => setShareYourFeedback(e.target.value)}
                        placeholder="Any suggestions, thoughts, or issues?"
                        style={compactInputStyle}
                        maxLength={1000}
                      />
                      <div style={{ textAlign: "right" }}>
                        <Text type="secondary">
                          {shareYourFeedback.length}/1000
                        </Text>
                      </div>
                    </div>
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ marginBottom: "12px" }}>
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "8px" }}
                      >
                        Active Status
                      </Text>
                      <Switch
                        checked={activeStatus}
                        onChange={setActiveStatus}
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                      />
                    </div>
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ marginBottom: "12px" }}>
                      <Text
                        strong
                        style={{ display: "block", marginBottom: "8px" }}
                      >
                        Voice Enabled
                      </Text>
                      <Switch
                        checked={voiceStatus}
                        onChange={setVoiceStatus}
                        checkedChildren="Enabled"
                        unCheckedChildren="Disabled"
                      />
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
            <Title level={4} style={{ color: "#722ed1", marginBottom: "8px" }}>
              {agentName || "Agent Name"}
            </Title>
            <Paragraph
              style={{ color: "#666", marginBottom: "12px", fontSize: "14px" }}
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
            title="Test Chat"
            size="small"
            style={{
              marginBottom: "16px",
              border: "1px solid #e6e6ff",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                height: "150px",
                overflowY: "auto",
                padding: "8px",
                background: "#fafafa",
                borderRadius: "6px",
                marginBottom: "8px",
              }}
            >
              {previewChat.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent:
                      m.role === "user" ? "flex-end" : "flex-start",
                    marginBottom: "6px",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "6px 10px",
                      borderRadius: "10px",
                      background: m.role === "user" ? "#722ed1" : "#f0f0f0",
                      color: m.role === "user" ? "white" : "#333",
                      fontSize: "13px",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "6px" }}>
              <Input
                size="small"
                value={previewInput}
                onChange={(e) => setPreviewInput(e.target.value)}
                placeholder="Ask a sample question..."
                onPressEnter={() => {
                  const q = previewInput.trim();
                  if (!q) return;
                  const mock = `(${
                    agentName || "Agent"
                  }) would respond based on your instructions. You asked: "${q}".`;
                  setPreviewChat((c) => [
                    ...c,
                    { role: "user", text: q },
                    { role: "assistant", text: mock },
                  ]);
                  setPreviewInput("");
                }}
              />
              <Button
                size="small"
                type="primary"
                icon={<SendOutlined />}
                onClick={() => {
                  const q = previewInput.trim();
                  if (!q) return;
                  const mock = `(${
                    agentName || "Agent"
                  }) would respond based on your instructions. You asked: "${q}".`;
                  setPreviewChat((c) => [
                    ...c,
                    { role: "user", text: q },
                    { role: "assistant", text: mock },
                  ]);
                  setPreviewInput("");
                }}
                style={purpleBtn}
              >
                Send
              </Button>
            </div>
          </Card>

          <Card
            title="Choose Stores"
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
                    <Text strong style={{ fontSize: "14px" }}>
                      OXY GPT Store
                    </Text>
                    <br />
                    <Text style={{ fontSize: "12px" }}>$19</Text>
                  </div>
                </Checkbox>
              </Col>
            </Row>
          </Card>

          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
          >
            <Button onClick={() => setShowPreview(false)}>Back to Edit</Button>
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
