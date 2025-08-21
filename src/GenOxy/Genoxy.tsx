import React, { useRef, useState, useEffect, KeyboardEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { message as antdMessage } from "antd";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import WelcomeScreen from "./components/WelcomeScreen";
import ChatMessages from "./components/ChatMessages";
import InputBar from "./components/InputBar";

import { useMessages } from "./hooks/useMessages";
import { useDarkMode } from "./hooks/useDarkMode";

import BASE_URL from "../Config";
import { Message } from "./types/types";

import "./styles/OpenAi.css";

type AssistantPublic = {
  name: string;
  slug: string;
  description?: string;
};

interface AssistantOption {
  id: string; // internal only
  name: string; // shown
  slug: string; // shown in URL, friendly
  description?: string;
}

const TIE_DISCLAIMER =
  "TiE Disclaimer :- The information shown is processed from open sources and may be outdated, incomplete, or contain errors (e.g., gender mix-ups, resigned members, or stale data). Please use this only as a knowledge aid, not an official or verified record.";

const KLM_DISCLAIMER =
  "KLM Disclaimer :- This content is auto-processed to provide helpful insights, but roles, timelines, or designations may sometimes be mismatched or outdated. Please treat it as guidance, not absolute truth.";

const ASSISTANTS: AssistantOption[] = [
  { id: "asst_5g20JJbZ88NvcSgNYLMeQTm2", name: "TiE AI LLM", slug: "tie-llm" },
  {
    id: "asst_XYsY8abeIoMWvsD394DW2N5A",
    name: "KLM Fashions AI LLM",
    slug: "klm-fashions LLM",
  },
];
const KLM_ROLE_ASSISTANT_ID = "asst_6Yq2RvPL50n7n7qF9Vnp5uof";

function findAssistantBySlug(slug: string | null) {
  if (!slug) return null;
  return ASSISTANTS.find((a) => a.slug === slug) ?? null;
}

// Stable, clean URL for a given assistant slug
function assistantUrl(slug: string) {
  const qs = new URLSearchParams({ a: slug });
  return `/genoxy/chat?${qs.toString()}`;
}
function disclaimerForAssistant(name?: string | null) {
  if (!name) return null;
  const n = name.toLowerCase();
  if (n.includes("tie")) return TIE_DISCLAIMER;
  if (n.includes("klm")) return KLM_DISCLAIMER;
  return null;
}

const ASK_ENDPOINT = `${(BASE_URL || "").replace(/\/$/, "")}/student-service/user/askquestion`;

/** TiE starter prompts */
const TIE_PROMPTS: string[] = [
  "Show me real estate founders in TIE Hyderabad",
  "Who are the active FinTech advisors I can connect with?",
  "List VC fund managers from the TIE network",
  "Find women entrepreneurs building tech startups",
  "Which members support early-stage startups?",
  "Who regularly speaks at startup events or conferences?",
];

/** Defining KLM roles and associated prompts for role-based interactions */
type KlmRole =
  | "Management"
  | "Operations"
  | "Infrastructure"
  | "IT"
  | "Finance & Accounts"
  | "HR"
  | "Legal & Compliance"
  | "CSR/Sustainability";

// Defining KLM roles with labels and icons for display
const KLM_ROLES: { key: KlmRole; label: string; icon: string }[] = [
  { key: "Management", label: "Management / CXO", icon: "👔" },
  { key: "Operations", label: "Operations", icon: "🏭" },
  { key: "Infrastructure", label: "Infrastructure", icon: "🏗️" },
  { key: "IT", label: "Information Technology", icon: "💻" },
  { key: "Finance & Accounts", label: "Finance & Accounts", icon: "💰" },
  { key: "HR", label: "Human Resources", icon: "🧑‍🤝‍🧑" },
  { key: "Legal & Compliance", label: "Legal & Compliance", icon: "⚖️" },
  { key: "CSR/Sustainability", label: "CSR / Sustainability", icon: "🌱" },
];

// Mapping KLM roles to their respective prompt options for quick access
const KLM_PROMPTS: Record<KlmRole, string[]> = {
  Management: [
    "Give me a snapshot of quarterly performance within this financial year",
    "Which business risks are flagged in this year’s disclosures?",
    "Summarize the investor-related updates or IPO communications this year.",
    "Highlight key governance updates reported this year",
    "What are the compliance issues raised or addressed in this year’s filings?",
    "Summarize media mentions and newspaper clippings relevant to this year",
  ],
  Operations: [
    "Show me employee attrition rates for this year.",
    "Summarize this year’s training programs and skill development initiatives.",
    "What grievance cases from employees/customers are recorded this year?",
    "Highlight shrinkage risks or operational inefficiencies reported this year.",
    "What safety or SOP updates were introduced in operations this year?",
    "Give me a breakdown of store/warehouse expansions in this year.",
  ],
  Infrastructure: [
    "Summarize health & safety incidents reported this year.",
    "What energy and water usage has been disclosed for this year?",
    "Are offices and stores compliant with accessibility standards this year?",
    "Highlight infra-related sustainability initiatives in this year’s disclosures.",
    "What major CAPEX or infra upgrades were reported this year?",
    "Show me waste management or recycling disclosures from this year.",
  ],
  IT: [
    "List IT/cybersecurity risks mentioned in this year’s reports.",
    "What technology initiatives were introduced for customers this year?",
    "Summarize IT’s role in grievance redressal this year.",
    "What compliance or audit references involve IT this year?",
    "Highlight system or data security disclosures in this year.",
    "What digital upgrades were announced or completed this year?",
  ],
  "Finance & Accounts": [
    "Summarize quarterly financial results disclosed this year.",
    "Highlight key revenue and expense drivers from this year.",
    "What CSR spends were made this year under Section 135?",
    "Summarize any tax notices or compliance matters this year.",
    "What litigation items have financial impact this year?",
    "Summarize credit rating or auditor comments given this year.",
  ],
  HR: [
    "Give me employee count and gender diversity for this year.",
    "What are attrition and retention rates disclosed this year?",
    "Summarize employee training and development programs this year.",
    "List differently abled employee statistics for this year.",
    "What grievance or POSH cases were reported this year?",
    "Highlight policies related to employee well-being this year.",
  ],
  "Legal & Compliance": [
    "Summarize litigation updates disclosed this year.",
    "What SEBI/ROC filings are noted this year?",
    "Highlight whistleblower or anti-bribery disclosures this year.",
    "What compliance frameworks are referenced this year?",
    "Summarize environmental or social compliance requirements this year.",
    "List statutory notices or regulatory correspondence this year.",
  ],
  "CSR/Sustainability": [
    "Summarize CSR initiatives undertaken this year.",
    "What ESG risks and opportunities are highlighted this year?",
    "Which SDG-linked activities are reported this year?",
    "Give me employee inclusion/diversity updates this year.",
    "Summarize this year’s energy, water, and waste management data.",
    "What stakeholder engagement activities were reported this year?",
  ],
};

/** KLM generic quick-start questions (your 6) */
const KLM_GENERIC_QUESTIONS: string[] = [
  "Which business risks are flagged in this year’s disclosures?",
  "Show me employee attrition rates for this year.",
  "What energy and water usage has been disclosed for this year?",
  "List IT/cybersecurity risks mentioned in this year’s reports.",
  "What CSR spends were made this year under Section 135?",
  "Summarize this year’s energy, water, and waste management data.",
];

/* ================================
 * Insurance LLM options (dependent dropdowns)
 * ================================ */

type InsuranceLicenseType =
  | "Life Insurance Companies"
  | "Non-life/General Insurance Companies"
  | "Reinsurers";

const INSURANCE_LICENSE_TYPES: InsuranceLicenseType[] = [
  "Life Insurance Companies",
  "Non-life/General Insurance Companies",
  "Reinsurers",
];

const INSURANCE_ENTITIES: Record<InsuranceLicenseType, string[]> = {
  "Life Insurance Companies": [
    "Life Insurance Corporation of India (LIC)",
    "HDFC Life Insurance Co. Ltd.",
    "Axis Max Life Insurance Co. Ltd.",
    "ICICI Prudential Life Insurance Co. Ltd.",
    "Kotak Life Insurance Co. Ltd.",
    "Aditya Birla Sun Life Insurance Co. Ltd.",
    "TATA AIA Life Insurance Co. Ltd.",
    "SBI Life Insurance Co. Ltd.",
    "Bajaj Allianz Life Insurance Co. Ltd.",
    "PNB MetLife India Insurance Co. Ltd.",
    "Reliance Nippon Life Insurance Company",
    "Aviva Life Insurance Company India Ltd.",
    "Sahara India Life Insurance Co. Ltd.",
    "Shriram Life Insurance Co. Ltd.",
    "Bharti AXA Life Insurance Co. Ltd.",
    "Future Generali India Life Insurance Co. Ltd.",
    "Ageas Federal Life Insurance Co. Ltd.",
    "Canara HSBC Life Insurance Co. Ltd.",
    "Bandhan Life Insurance Co. Ltd.",
    "Pramerica Life Insurance Co. Ltd.",
    "Star Union Dai-ichi Life Insurance",
    "IndiaFirst Life Insurance Co. Ltd.",
    "Edelweiss Life Insurance Co. Ltd.",
    "Credit Access Life Insurance Ltd.",
    "Acko Life Insurance Ltd.",
    "Go Digit Life Insurance Ltd.",
  ],
  "Non-life/General Insurance Companies": [
    "Acko General Insurance",
    "Aditya Birla Health Insurance",
    "Agriculture Insurance Company of India",
    "Bajaj Allianz General Insurance",
    "Cholamandalam MS General Insurance",
    "Manipal Cigna Health Insurance",
    "Navi General Insurance",
    "Go Digit Insurance",
    "Zuno General Insurance",
    "ECGC Ltd.",
    "Future Generali India Insurance",
    "HDFC ERGO General Insurance",
    "ICICI Lombard General Insurance",
    "IFFCO-TOKIO General Insurance",
    "Zurich Kotak General Insurance",
    "Liberty General Insurance",
    "Magma HDI General Insurance",
    "Niva Bupa Health Insurance",
    "National Insurance Company",
    "New India Assurance",
    "Raheja QBE General Insurance",
    "Reliance General Insurance",
    "Care Health Insurance Ltd.",
    "Royal Sundaram General Insurance",
    "SBI General Insurance",
    "Shriram General Insurance",
    "Star Health & Allied Insurance",
    "Tata AIG General Insurance",
    "The Oriental Insurance Company",
    "United India Insurance Company",
    "Universal Sompo General Insurance",
    "Kshema General Insurance Ltd.",
    "Galaxy Health Insurance Co. Ltd.",
  ],
  Reinsurers: [
    "General Insurance Corporation of India (GIC Re)",
    "Valueattics Reinsurance Limited",
  ],
};

const INSURANCE_FIXED_QUESTIONS = [
  "Generate Compliance Scorecard",
  "Assess Clarity & Correctness of Rule Implementation",
  "Highlight Deviations from Insurance Guidelines",
  "Suggest Steps for 100% Compliance",
];

/* ================================
 * Component
 * ================================ */

const GenOxy: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<Message[][]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [activeAssistant, setActiveAssistant] =
    useState<AssistantOption | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [remainingPrompts, setRemainingPrompts] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  // KLM stage state
  const [klmRole, setKlmRole] = useState<KlmRole | null>(null);
  const [klmMode, setKlmMode] = useState<"role" | "generic" | null>(null); // NEW

  // Insurance LLM form state
  const [insuranceLicense, setInsuranceLicense] = useState<
    InsuranceLicenseType | ""
  >("");
  const [insuranceEntity, setInsuranceEntity] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { darkMode } = useDarkMode();
  const location = useLocation();
  const navigate = useNavigate();
  const isChatRoute = location.pathname === "/genoxy/chat";
  // Cache chat per assistant so history navigation restores the right state
  const chatCache = useRef<Record<string, Message[]>>({});

  // Always-read latest messages without adding it as a dependency everywhere
  const messagesRef = useRef<Message[]>([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  /**
   * Sync assistant and messages from URL on any navigation (Back/Forward included).
   * - Saves current messages into a cache under the current assistant's slug.
   * - Restores cached messages for the assistant in the URL (or clears if none).
   */
  useEffect(() => {
    const qs = new URLSearchParams(location.search);
    const slug = qs.get("a");
    const nextAssistant = findAssistantBySlug(slug);

    if (nextAssistant?.slug !== activeAssistant?.slug) {
      // save current messages for the previous assistant
      if (activeAssistant?.slug) {
        chatCache.current[activeAssistant.slug] = messagesRef.current;
      }

      // switch assistant to match URL
      setActiveAssistant(nextAssistant ?? null);
      setKlmRole(null);
      setKlmMode(null); // NEW

      // restore messages for the new assistant (or empty if none)
      const restored = nextAssistant?.slug
        ? chatCache.current[nextAssistant.slug] ?? []
        : [];
      setMessages(restored);
    }

    if (!slug && activeAssistant) {
      chatCache.current[activeAssistant.slug] = messagesRef.current;
      setActiveAssistant(null);
      setKlmRole(null);
      setKlmMode(null); // NEW
      setMessages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  const { handleSend, handleEdit, handleFileUpload } = useMessages({
    messages,
    setMessages,
    input,
    setInput,
    setLoading,
    threadId,
    setThreadId,
    messagesEndRef,
    abortControllerRef,
    remainingPrompts,
    setRemainingPrompts,
  });

  function resetChatForNewAssistant(nextAssistantSlug?: string | null) {
    // archive current session in visible history
    setChatHistory((prev) =>
      messagesRef.current.length ? [...prev, [...messagesRef.current]] : prev
    );

    // save current messages per assistant slug if we have one
    if (activeAssistant?.slug) {
      chatCache.current[activeAssistant.slug] = messagesRef.current;
    }

    // clear current editing/UI state
    setMessages([]);
    setInput("");
    setEditingMessageId(null);
    setSelectedFile(null);
    setThreadId(null);
    setRemainingPrompts(null);
    setKlmRole(null);
    setKlmMode(null); // NEW

    // Insurance LLM fields
    setInsuranceLicense?.("");
    setInsuranceEntity?.("");

    const target = nextAssistantSlug
      ? assistantUrl(nextAssistantSlug)
      : "/genoxy/chat";

    if (location.pathname + location.search !== target) {
      navigate(target);
    }
  }

  async function askAssistant(
    assistantId: string | null | undefined,
    userMessage: { role: "user"; content: string }
  ) {
    if (!assistantId) {
      antdMessage.error("Pick an assistant first.");
      return;
    }

    // 🔹 Build instruction if KLM + role selected
    let instruction = "";
    if (activeAssistant?.name.toLowerCase().includes("klm") && klmRole) {
      instruction = `Your helpful assistant. Your role is ${klmRole}. Answer based on this role only.`;
    }

    const url =
      `${ASK_ENDPOINT}` +
      `?assistantId=${encodeURIComponent(assistantId)}` +
      `&instruction=${encodeURIComponent(instruction)}`;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    try {
      const historyForServer = [
        ...messagesRef.current.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        { role: userMessage.role, content: userMessage.content },
      ];

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "*/*" },
        body: JSON.stringify(historyForServer),
        signal: controller.signal,
      });

      const text = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status} – ${text || "Request failed"}`);

      let serverMsgs: { role: "user" | "assistant"; content: string }[] | null =
        null;

      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          serverMsgs = parsed.map((m: any) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: String(m.content ?? ""),
          }));
        }
      } catch {}
      const toAppend = serverMsgs ?? [{ role: "assistant", content: text }];

      setMessages((prev) => [
        ...prev,
        ...toAppend.map((m, i) => ({
          id: `m_${Date.now()}_${i}`,
          role: m.role,
          content: m.content,
          timestamp: new Date().toISOString(),
        })),
      ]);
    } catch (e: any) {
      antdMessage.error(e?.message || "Request failed");
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }

  const handlePickAssistant = (assistant: AssistantPublic) => {
    const full = ASSISTANTS.find((a) => a.slug === assistant.slug);
    if (full) setActiveAssistant(full);
    resetChatForNewAssistant(assistant.slug);
  };

  /** Ensure the URL has the assistant slug when sending, then call API with id */
  const handleAssistantSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) {
      antdMessage?.error?.("Please enter a message.");
      return;
    }
    if (!activeAssistant) {
      await handleSend();
      return;
    }

    // Keep URL pinned to the active assistant
    const want = assistantUrl(activeAssistant.slug);
    const current = location.pathname + location.search;
    if (current !== want) {
      navigate(want);
    }

    // If Insurance LLM is active, add context
    let finalContent = trimmed;
    if (activeAssistant.name.toLowerCase().includes("insurance")) {
      if (!insuranceLicense || !insuranceEntity) {
        antdMessage.error("Please select license type and regulated entity.");
        return;
      }
      finalContent = `[License Type: ${insuranceLicense}; Entity: ${insuranceEntity}] ${trimmed}`;
    }

    // Choose which assistant ID to use:
    // If user is in KLM assistant and has selected a role, use role-based ID
    const isKlm = activeAssistant.name.toLowerCase().includes("klm");
    const effectiveAssistantId =
      isKlm && klmRole ? KLM_ROLE_ASSISTANT_ID : activeAssistant.id;

    setMessages((prev) => [
      ...prev,
      {
        id: `m_${Date.now()}`,
        role: "user",
        content: finalContent,
        timestamp: new Date().toISOString(),
      },
    ]);
    setInput("");

    await askAssistant(effectiveAssistantId, {
      role: "user",
      content: finalContent,
    });
  };

  const handleKeyPress = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      const trimmedInput = input.trim();

      if (!trimmedInput && !selectedFile) {
        antdMessage.error("Please enter a message or upload a file.");
        return;
      }

      if (editingMessageId && selectedFile && trimmedInput) {
        await handleFileUpload(selectedFile, trimmedInput);
        setEditingMessageId(null);
        setSelectedFile(null);
        return;
      }
      if (editingMessageId && trimmedInput) {
        await handleEdit(editingMessageId, trimmedInput);
        setEditingMessageId(null);
        return;
      }
      if (selectedFile) {
        if (!trimmedInput) {
          antdMessage.error("Please add a short instruction for the file.");
          return;
        }
        await handleFileUpload(selectedFile, trimmedInput);
        setInput("");
        return;
      }

      if (activeAssistant) {
        await handleAssistantSend();
        return;
      }

      await handleSend();
      if (messages.length > 0) {
        setChatHistory((prev) => [...prev, [...messages]]);
      }
    }
  };

  const clearChat = () => {
    if (messagesRef.current.length > 0) {
      setChatHistory((prev) => [...prev, [...messagesRef.current]]);
    }

    if (activeAssistant?.slug) {
      chatCache.current[activeAssistant.slug] = messagesRef.current;
    }

    setSelectedFile(null);
    setThreadId(null);
    setRemainingPrompts(null);
    setMessages([]);
    setIsSidebarOpen(false);
    setEditingMessageId(null);
    setKlmRole(null);
    setKlmMode(null); // NEW
    setActiveAssistant(null);

    // Insurance LLM fields
    setInsuranceLicense?.("");
    setInsuranceEntity?.("");

    navigate("/genoxy");
  };

  const loadChat = (chat: Message[]) => {
    setMessages(chat);
    setIsSidebarOpen(false);
    setEditingMessageId(null);

    const slug = activeAssistant?.slug;
    const target = slug
      ? `/genoxy/chat?a=${encodeURIComponent(slug)}`
      : "/genoxy/chat";
    if (location.pathname + location.search !== target) {
      navigate(target);
    }
  };

  const editMessage = (messageId: string, content: string) => {
    setInput(content);
    setEditingMessageId(messageId);
    (document.querySelector("textarea") as HTMLTextAreaElement | null)?.focus?.();
  };

  const showCenteredLayout = messages.length === 0 && !loading && !isChatRoute;

  /* Derived Send Handler */
  const resolvedSendHandler = selectedFile
    ? async () => {
        if (!input.trim()) {
          antdMessage.error("Please add a short instruction for the file.");
          return;
        }
        await handleFileUpload(selectedFile, input);
      }
    : editingMessageId
    ? () => handleEdit(editingMessageId, input)
    : activeAssistant
    ? handleAssistantSend
    : handleSend;

  /* TiE Starter Panel */
  const showTieStarter =
    activeAssistant?.name?.toLowerCase().includes("tie") &&
    messages.length === 0 &&
    isChatRoute;

  const TieStarter: React.FC = () => (
    <div className="w-full">
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12">
        {/* Top Section */}
        <div className="rounded-2xl bg-[#6b4cd6] dark:bg-[#6b4cd6]/80 text-white p-6 sm:p-8 md:p-10 shadow-md text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            TiE Hyderabad Conversations
          </h2>

          <p className="mt-3 text-white/90 text-sm md:text-base max-w-2xl mx-auto">
            Ask anything about TiE Hyderabad chapter members, investors & domain
            experts. Let the Assistant guide you
          </p>
        </div>

        {/* Prompt Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-6 md:mt-8">
          {TIE_PROMPTS.map((q) => (
            <button
              key={q}
              onClick={async () => {
                setMessages((prev) => [
                  ...prev,
                  {
                    id: `m_${Date.now()}`,
                    role: "user",
                    content: q,
                    timestamp: new Date().toISOString(),
                  },
                ]);
                await askAssistant(activeAssistant!.id, {
                  role: "user",
                  content: q,
                });
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white 
                       dark:bg-gray-800 border border-gray-200 dark:border-gray-600 
                       hover:border-purple-300 dark:hover:border-purple-500 
                       hover:shadow transition text-left"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-sm md:text-base font-medium text-purple-600 hover:text-purple-800 dark:text-white dark:hover:text-purple-200">
                {q}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  /* KLM: Stage 0 (Mode select) — NEW */
  const isKlm = activeAssistant?.name?.toLowerCase().includes("klm");
  const showKlmModeStage = isKlm && klmMode === null && messages.length === 0 && isChatRoute;

  const KlmModeSelect: React.FC = () => {
    return (
      <div className="w-full">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="rounded-2xl bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 p-6 sm:p-8 shadow-sm text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              KLM Fashions AI LLM
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
              Choose how you want to begin.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 place-items-stretch">
              <button
                onClick={() => setKlmMode("role")}
                className="group rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-md px-4 py-6 transition text-left"
              >
                <div className="text-xl">🧑‍💼</div>
                <div className="mt-2 font-semibold text-purple-700 dark:text-purple-200">
                  Role-based Conversations
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Pick a role (CXO, HR, IT, etc.) for focused prompts.
                </div>
              </button>

              <button
                onClick={() => setKlmMode("generic")}
                className="group rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-md px-4 py-6 transition text-left"
              >
                <div className="text-xl">💬</div>
                <div className="mt-2 font-semibold text-purple-700 dark:text-purple-200">
                  Generic Conversations
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Start with quick common questions for this year.
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* KLM: Stage 1 (Role select) */
  const showKlmRoleStage =
    isKlm && klmMode === "role" && klmRole === null && messages.length === 0 && isChatRoute;

  const KlmRoleSelect: React.FC = () => {
    return (
      <div className="w-full">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="rounded-2xl bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 p-4 sm:p-6 shadow-sm md:shadow-md text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-900 dark:text-white">
              KLM Fashions – Role-Based Conversations
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-300 text-xs sm:text-sm max-w-2xl mx-auto">
              Choose your role to get relevant insights.
            </p>

            {/* All Roles - Same Size */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 place-items-center">
              {KLM_ROLES.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setKlmRole(r.key)}
                  className="group rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-sm px-2 py-3 transition flex flex-col items-center text-center w-full"
                >
                  <div className="text-xl sm:text-2xl mb-1">{r.icon}</div>
                  <div className="font-medium text-purple-600 hover:text-purple-800 dark:text-white dark:hover:text-purple-200 text-xs sm:text-sm">
                    {r.label}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              <button
                onClick={() => {
                  setKlmRole(null);
                  setKlmMode(null);
                }}
                className="underline decoration-dotted"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* KLM: Stage 2 (Role prompts) */
  const showKlmPromptStage =
    isKlm && klmMode === "role" && klmRole !== null && messages.length === 0 && isChatRoute;

  const KlmRoleStarter: React.FC = () => {
    if (!klmRole) return null;
    const prompts = KLM_PROMPTS[klmRole];
    const headerStyles: Record<
      KlmRole,
      { bg: string; accent: string; sub: string }
    > = {
      Management: {
        bg: "bg-[#0b2a5b] dark:bg-[#0b2a5b]/80",
        accent: "text-white",
        sub: "text-white/80",
      },
      Operations: {
        bg: "bg-[#1f3d2c] dark:bg-[#1f3d2c]/80",
        accent: "text-white",
        sub: "text-white/80",
      },
      Infrastructure: {
        bg: "bg-[#0f2f36] dark:bg-[#0f2f36]/80",
        accent: "text-white",
        sub: "text-white/80",
      },
      IT: {
        bg: "bg-[#132b3a] dark:bg-[#132b3a]/80",
        accent: "text-white",
        sub: "text-white/80",
      },
      "Finance & Accounts": {
        bg: "bg-[#1c2c5e] dark:bg-[#1c2c5e]/80",
        accent: "text-white",
        sub: "text-white/80",
      },
      HR: {
        bg: "bg-[#3b2b5e] dark:bg-[#3b2b5e]/80",
        accent: "text-white",
        sub: "text-white/80",
      },
      "Legal & Compliance": {
        bg: "bg-[#2b3a5e] dark:bg-[#2b3a5e]/80",
        accent: "text-white",
        sub: "text-white/80",
      },
      "CSR/Sustainability": {
        bg: "bg-[#2b5e3b] dark:bg-[#2b5e3b]/80",
        accent: "text-white",
        sub: "text-white/80",
      },
    };

    const roleHeader: Record<KlmRole, { title: string; sub: string }> = {
      Management: {
        title: "Welcome Management – Strategic Insights at a Glance",
        sub: "Choose a report or ask a question below.",
      },
      Operations: {
        title: "Welcome Operations Team – Stay on Top of Execution",
        sub: "Pick a topic to begin or type your query.",
      },
      Infrastructure: {
        title: "Welcome Infrastructure Team – Optimize Supply Chain",
        sub: "Select a topic or initiate a custom query.",
      },
      IT: {
        title:
          "Welcome IT Team – Infrastructure & Compliance at Your Fingertips",
        sub: "Select a topic or initiate a custom query.",
      },
      "Finance & Accounts": {
        title: "Welcome Finance Team – Financial Insights and Control",
        sub: "Click below or ask your own finance question.",
      },
      HR: {
        title: "Welcome HR Team – Empower Your Workforce",
        sub: "Select a topic or ask about employee management.",
      },
      "Legal & Compliance": {
        title: "Welcome Legal Team – Stay Compliant and Informed",
        sub: "Choose a report or ask a compliance question.",
      },
      "CSR/Sustainability": {
        title: "Welcome CSR Team – Drive Sustainable Impact",
        sub: "Select a topic or ask about sustainability initiatives.",
      },
    };

    const h = headerStyles[klmRole];
    const copy = roleHeader[klmRole];

    return (
      <div className="w-full">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className={`rounded-2xl ${h.bg} ${h.accent} p-6 sm:p-8 shadow-md text-center`}>
            <h2 className="text-2xl sm:text-3xl font-bold">{copy.title}</h2>
            <p className={`mt-2 ${h.sub} max-w-2xl mx-auto`}>{copy.sub}</p>
            <div className="mt-3 text-sm">
              <button
                onClick={() => setKlmRole(null)}
                className="underline decoration-dotted opacity-90 hover:opacity-100 dark:hover:text-purple-200"
                title="Change role"
              >
                ← Change role
              </button>
            </div>
          </div>

          {/* Centered Prompt Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 place-items-center">
            {prompts.map((q) => (
              <button
                key={q}
                onClick={async () => {
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: `m_${Date.now()}`,
                      role: "user",
                      content: q,
                      timestamp: new Date().toISOString(),
                    },
                  ]);
                  // Force role-based ID for KLM when a role is selected
                  await askAssistant(KLM_ROLE_ASSISTANT_ID, {
                    role: "user",
                    content: q,
                  });
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white 
                 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 
                 hover:border-purple-300 dark:hover:border-purple-500 
                 hover:shadow transition text-left max-w-sm w-full"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-xs md:text-sm font-medium text-purple-600 hover:text-purple-800 dark:text-white dark:hover:text-purple-200">
                  {q}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* KLM: Generic Starter — NEW */
  const showKlmGenericStage =
    isKlm && klmMode === "generic" && messages.length === 0 && isChatRoute;

  const KlmGenericStarter: React.FC = () => {
    return (
      <div className="w-full">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="rounded-2xl bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 p-6 sm:p-8 shadow-sm text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              KLM Fashions AI LLM — Generic Conversations
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
              Start with a quick question for this year.
            </p>
            <div className="mt-3 text-sm">
              <button
                onClick={() => setKlmMode(null)}
                className="underline decoration-dotted"
              >
                ← Back
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 place-items-center">
            {KLM_GENERIC_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={async () => {
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: `m_${Date.now()}`,
                      role: "user",
                      content: q,
                      timestamp: new Date().toISOString(),
                    },
                  ]);
                  // Use the normal KLM assistant for generic mode
                  await askAssistant(activeAssistant!.id, {
                    role: "user",
                    content: q,
                  });
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white 
                 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 
                 hover:border-purple-300 dark:hover:border-purple-500 
                 hover:shadow transition text-left max-w-sm w-full"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-xs md:text-sm font-medium text-purple-600 hover:text-purple-800 dark:text-white dark:hover:text-purple-200">
                  {q}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* Insurance LLM Starter Panel (dropdowns + fixed questions) */
  const isInsurance =
    activeAssistant?.name?.toLowerCase().includes("insurance") &&
    messages.length === 0 &&
    isChatRoute;

  const InsuranceStarter: React.FC = () => {
    const entities = insuranceLicense
      ? INSURANCE_ENTITIES[insuranceLicense]
      : [];

    const sendWithContext = async (text: string) => {
      if (!insuranceLicense || !insuranceEntity) {
        antdMessage.error("Please select license type and regulated entity.");
        return;
      }
      const content = `[License Type: ${insuranceLicense}; Entity: ${insuranceEntity}] ${text}`;
      setMessages((prev) => [
        ...prev,
        {
          id: `m_${Date.now()}`,
          role: "user",
          content,
          timestamp: new Date().toISOString(),
        },
      ]);
      await askAssistant(activeAssistant!.id, { role: "user", content });
    };

    return (
      <div className="w-full">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
          <div className="rounded-2xl bg-gradient-to-b from-white to-gray-50 border border-gray-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Insurance LLM Assistant
            </h2>

            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              <div className="rounded-xl border border-gray-200 bg-white p-3">
                <label className="text-xs font-medium text-gray-600">
                  Select License Type
                </label>
                <select
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={insuranceLicense}
                  onChange={(e) => {
                    const val = e.target.value as InsuranceLicenseType | "";
                    setInsuranceLicense(val);
                    setInsuranceEntity("");
                  }}
                >
                  <option value="">Choose license type</option>
                  {INSURANCE_LICENSE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-3">
                <label className="text-xs font-medium text-gray-600">
                  Select Regulated Entity
                </label>
                <select
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={insuranceEntity}
                  onChange={(e) => setInsuranceEntity(e.target.value)}
                  disabled={!insuranceLicense}
                >
                  <option value="">
                    {insuranceLicense ? "Choose…" : "Select license type first"}
                  </option>
                  {entities.map((ent) => (
                    <option key={ent} value={ent}>
                      {ent}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {INSURANCE_FIXED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendWithContext(q)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-indigo-300 hover:shadow transition text-left"
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-sm font-medium text-gray-800">{q}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* Chat start picker (no assistant yet on /genoxy/chat) — NEW */
  const showChatStartPicker =
    isChatRoute && !activeAssistant && messages.length === 0;

  const ChatStartPicker: React.FC = () => {
    return (
      <div className="w-full">
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
          <div className="rounded-2xl bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 p-6 sm:p-8 shadow-sm text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Choose an AI LLM to Begin
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
              Start a conversation directly from the chat window.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {ASSISTANTS.map(({ id, ...a }) => (
                <button
                  key={a.slug}
                  onClick={() =>
                    handlePickAssistant({ name: a.name, slug: a.slug })
                  }
                  className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow px-5 py-5 text-left"
                >
                  <div className="text-lg font-semibold text-purple-700 dark:text-purple-200">
                    {a.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Tap to open {a.name} in this chat.
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* Render */
  return (
    <div
      className={`h-screen flex flex-row bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300 ${
        darkMode ? "dark" : ""
      }`}
    >
      {/* Sidebar */}
      {!showCenteredLayout && (
        <div
          className={`fixed left-0 z-40 transform bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      top-14 bottom-0 h-[calc(100vh-3.5rem)]
      w-64 sm:w-64 md:w-68 lg:w-72
      sm:relative sm:translate-x-0 sm:flex sm:flex-col sm:top-0 sm:bottom-auto sm:h-auto`}
        >
          <Sidebar
            chatHistory={chatHistory}
            loadChat={loadChat}
            clearHistory={() => setChatHistory([])}
            toggleSidebar={() => setIsSidebarOpen(false)}
            clearChat={clearChat}
            assistants={ASSISTANTS.map(({ id, ...rest }) => rest)}
            activeAssistantSlug={activeAssistant?.slug ?? null}
            onPickAssistant={handlePickAssistant}
          />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-0 relative pt-16 sm:pt-0">
        {!showCenteredLayout && (
          <Header
            clearChat={clearChat}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
            messages={messages}
            activeAssistantName={activeAssistant?.name}
            // “LLMs” picker in header
            assistants={ASSISTANTS.map(({ id, ...rest }) => rest)}
            activeAssistantSlug={activeAssistant?.slug ?? null}
            onPickAssistant={handlePickAssistant}
          />
        )}

        {/* Add top padding under fixed header on mobile */}
        {showCenteredLayout ? (
          <div className="pt-14 sm:pt-0">
            <WelcomeScreen
              input={input}
              setInput={setInput}
              handleSend={resolvedSendHandler}
              handleKeyPress={handleKeyPress}
              loading={loading}
              textareaRef={textareaRef}
              handleFileUpload={handleFileUpload}
              remainingPrompts={remainingPrompts}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 relative pt-14 sm:pt-0">
            {/* NEW: chat start picker */}
            {showChatStartPicker && <ChatStartPicker />}

            {/* Starters shown only when chat is empty */}
            {showTieStarter && <TieStarter />}
            {isKlm && showKlmModeStage && <KlmModeSelect />}
            {isKlm && showKlmRoleStage && <KlmRoleSelect />}
            {isKlm && showKlmPromptStage && <KlmRoleStarter />}
            {isKlm && showKlmGenericStage && <KlmGenericStarter />}
            {isInsurance && <InsuranceStarter />}

            {/* Chat stream */}
            <div className="flex-1 flex flex-col min-h-0 relative">
              <ChatMessages
                messages={messages}
                messagesEndRef={messagesEndRef}
                loading={loading}
                onEditMessage={editMessage}
              />
            </div>

            {/* Input */}
            <div className="shrink-0">
              <InputBar
                input={input}
                setInput={setInput}
                handleSend={resolvedSendHandler}
                handleKeyPress={handleKeyPress}
                loading={loading}
                textareaRef={textareaRef}
                stopGeneration={() => {
                  if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                    abortControllerRef.current = null;
                  }
                  setLoading(false);
                  setEditingMessageId(null);
                }}
                isEditing={!!editingMessageId}
                handleFileUpload={handleFileUpload}
                remainingPrompts={remainingPrompts}
                uploadedFile={selectedFile}
                setUploadedFile={setSelectedFile}
                /* Show disclaimer only on chat route with an active assistant */
                disclaimerText={
                  isChatRoute && activeAssistant
                    ? disclaimerForAssistant(activeAssistant.name)
                    : null
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenOxy;
