// /src/Genoxy.tsx
import React, { useRef, useState, useEffect, KeyboardEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { message as antdMessage, message } from "antd";

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
  "Disclaimer :- The information shown is processed from open sources and may be outdated, incomplete, or contain errors (e.g., gender mix-ups, resigned members, or stale data). Please use this only as a knowledge aid, not an official or verified record.";

const KLM_DISCLAIMER =
  "Disclaimer :- This content is auto-processed to provide helpful insights, but roles, timelines, or designations may sometimes be mismatched or outdated. Please treat it as guidance, not absolute truth.";

const ASSISTANTS: AssistantOption[] = [
  { id: "asst_r72ouwQLn406qEjw9ftYjc85", name: "TiE AI LLM", slug: "tie-llm" },
  {
    id: "", // keep empty; actual ID for Insurance is chosen per type
    name: "Insurance AI LLM",
    slug: "insurance-llm",
  },
  {
    id: "asst_XYsY8abeIoMWvsD394DW2N5A",
    name: "KLM Fashions AI LLM",
    slug: "klm-fashions LLM",
  },
];

const KLM_ROLE_ASSISTANT_ID = "asst_6Yq2RvPL50n7n7qF9Vnp5uof";

// ====== Insurance: per-type Assistant IDs (UPDATED) ======
const LIFE_ASSISTANT_ID = "asst_G2jtvsfDcWulax5QDcyWhFX1";
const GENERAL_ASSISTANT_ID = "asst_bRxg1cfAfcQ05O3UGUjcAwwC";

type InsuranceType = "Life Insurance" | "General Insurance";
const INSURANCE_TYPE_TO_ID: Record<InsuranceType, string> = {
  "Life Insurance": LIFE_ASSISTANT_ID,
  "General Insurance": GENERAL_ASSISTANT_ID,
};

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
  return null; // Insurance: no disclaimer text by default
}

const ASK_ENDPOINT = `${(BASE_URL || "").replace(
  /\/$/,
  ""
)}/student-service/user/askquestion`;

/** TiE starter prompts — reduced to 4 for cleaner mobile UX */
const TIE_PROMPTS: string[] = [
  "Show me real estate founders in TIE Hyderabad",
  "Who are the active FinTech advisors I can connect with?",
  "List VC fund managers from the TIE network",
  "Which members support early-stage startups?",
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

/** KLM Role-based prompts — trimmed to 4 each */
const KLM_PROMPTS: Record<KlmRole, string[]> = {
  Management: [
    "Give me a snapshot of quarterly performance within this financial year",
    "Which business risks are flagged in this year’s disclosures?",
    "Highlight key governance updates reported this year",
    "Summarize media mentions and newspaper clippings relevant to this year",
  ],
  Operations: [
    "Show me employee attrition rates for this year.",
    "Highlight shrinkage risks or operational inefficiencies reported this year.",
    "What safety or SOP updates were introduced in operations this year?",
    "Give me a breakdown of store/warehouse expansions in this year.",
  ],
  Infrastructure: [
    "Summarize health & safety incidents reported this year.",
    "What energy and water usage has been disclosed for this year?",
    "What major CAPEX or infra upgrades were reported this year?",
    "Show me waste management or recycling disclosures from this year.",
  ],
  IT: [
    "List IT/cybersecurity risks mentioned in this year’s reports.",
    "What compliance or audit references involve IT this year?",
    "Highlight system or data security disclosures in this year.",
    "What digital upgrades were announced or completed this year?",
  ],
  "Finance & Accounts": [
    "Summarize quarterly financial results disclosed this year.",
    "Highlight key revenue and expense drivers from this year.",
    "What litigation items have financial impact this year?",
    "Summarize credit rating or auditor comments given this year.",
  ],
  HR: [
    "Give me employee count and gender diversity for this year.",
    "What are attrition and retention rates disclosed this year?",
    "What grievance or POSH cases were reported this year?",
    "Highlight policies related to employee well-being this year.",
  ],
  "Legal & Compliance": [
    "Summarize litigation updates disclosed this year.",
    "What SEBI/ROC filings are noted this year?",
    "Highlight whistleblower or anti-bribery disclosures this year.",
    "List statutory notices or regulatory correspondence this year.",
  ],
  "CSR/Sustainability": [
    "Summarize CSR initiatives undertaken this year.",
    "What ESG risks and opportunities are highlighted this year?",
    "Which SDG-linked activities are reported this year?",
    "Summarize this year’s energy, water, and waste management data.",
  ],
};

/** KLM generic quick-start questions — reduced to 4 */
const KLM_GENERIC_QUESTIONS: string[] = [
  "Which business risks are flagged in this year’s disclosures?",
  "Show me employee attrition rates for this year.",
  "List IT/cybersecurity risks mentioned in this year’s reports.",
  "Summarize this year’s energy, water, and waste management data.",
];

/* ================================
 * INSURANCE (UPDATED)
 * ================================ */

// Landing: multi-language strip
const BIMA_STRIP =
  "বিমা (Bimā) |  বীমা (Bimā) | વીમા (Vīmā) | ವಿಮೆ (Vime) |  بیمه (Bīma) | बीमा (Bīma) |  ബീമ (Bīma) | विमा (Vimā) | बीमा (Bīma) |  ବୀମା (Bimā) | ਬੀਮਾ (Bīma) | बीम (Bīma) | காப்பீடு (Kāppīṭu) | బీమా (Bīma) |  بیمه (Bīma)";

// Life: 8 questions (updated with detailed prompts + emojis)
const LIFE_QUESTIONS: string[] = [
  "👨‍👩‍👧 Can you help me find the right life insurance plan for my family of four?",
  "👵👶 Suggest a suitable life policy for my parents, kids, and myself together.",
  "📋 Please explain in simple words what a life insurance policy usually covers.",
  "🚫 Can you also tell me clearly what life insurance does not cover?",
  "💰 I want a premium estimate — what details should I share to get it?",
  "🏥 Show me hospitals nearby where my family can use cashless facilities linked to this policy.",
  "📄 How do I file a life insurance claim step by step if something happens?",
  "❓ I am confused about life insurance. Can you first explain the basics and then guide me with a few questions to ask?",
];

// General: 10 categories → 4 conversations each (with subcategories)
type GeneralCategoryKey =
  | "Health"
  | "Motor"
  | "Travel"
  | "Property"
  | "Fire"
  | "Marine"
  | "Crop"
  | "Commercial"
  | "Liability"
  | "Misc";

const GENERAL_CATEGORIES: {
  key: GeneralCategoryKey;
  icon: string;
  title: string;
  subcategories: string[];
  prompts: string[];
}[] = [
  {
    key: "Health",
    icon: "🏥",
    title: "Health Insurance",
    subcategories: [
      "Individual",
      "Family Floater",
      "Critical Illness",
      "Senior Citizen",
      "Personal Accident",
    ],
    prompts: [
      "Recommend the best health policy for my family.",
      "What illnesses are covered under critical illness?",
      "Is maternity covered in family floater plans?",
      "What is the waiting period for pre-existing diseases?",
    ],
  },
  {
    key: "Motor",
    icon: "🚗",
    title: "Motor Insurance",
    subcategories: [
      "Car",
      "Two-Wheeler",
      "Commercial Vehicle",
      "Third Party",
      "Comprehensive",
    ],
    prompts: [
      "What is the difference between third-party and comprehensive?",
      "Give me premium estimate for my car.",
      "How do I renew my bike insurance?",
      "What documents are needed for motor claims?",
    ],
  },
  {
    key: "Travel",
    icon: "✈️",
    title: "Travel Insurance",
    subcategories: [
      "Domestic",
      "International",
      "Student",
      "Senior Citizen",
      "Multi-trip",
    ],
    prompts: [
      "Do I need travel insurance for a Schengen visa?",
      "What is covered under student travel policies?",
      "Does travel insurance cover flight cancellation?",
      "Is COVID covered in international travel insurance?",
    ],
  },
  {
    key: "Property",
    icon: "🏠",
    title: "Property & Home Insurance",
    subcategories: [
      "Home Building",
      "Home Contents",
      "Office/Shop",
      "Comprehensive Home",
    ],
    prompts: [
      "What does home insurance cover in India?",
      "Are natural disasters covered?",
      "How is premium calculated for property insurance?",
      "Does it cover rented apartments?",
    ],
  },
  {
    key: "Fire",
    icon: "🔥",
    title: "Fire Insurance",
    subcategories: [
      "Standard Fire & Special Perils",
      "Industrial Fire",
      "Fire Loss of Profits",
    ],
    prompts: [
      "What is covered under Standard Fire Policy?",
      "Are riots and strikes included in fire insurance?",
      "How do industries insure against fire loss?",
      "What is Fire Loss of Profits policy?",
    ],
  },
  {
    key: "Marine",
    icon: "🚢",
    title: "Marine Insurance",
    subcategories: ["Marine Cargo", "Marine Hull", "Inland Transit"],
    prompts: [
      "What does marine cargo insurance cover?",
      "Is inland transit covered under marine policy?",
      "Explain marine hull insurance.",
      "Are piracy and theft covered in marine policies?",
    ],
  },
  {
    key: "Crop",
    icon: "🌾",
    title: "Crop & Agriculture Insurance",
    subcategories: [
      "PM Fasal Bima Yojana",
      "Weather-Based Crop Insurance",
      "State Crop Schemes",
    ],
    prompts: [
      "What crops are covered under PMFBY?",
      "How do farmers register for crop insurance?",
      "Does crop insurance cover drought?",
      "What weather events are covered under WBCIS?",
    ],
  },
  {
    key: "Commercial",
    icon: "🏭",
    title: "Commercial / Industrial Insurance",
    subcategories: [
      "Engineering",
      "Aviation",
      "Energy",
      "Machinery Breakdown",
      "Contractor’s All Risk",
    ],
    prompts: [
      "What is Contractor’s All Risk Insurance?",
      "How does machinery breakdown insurance work?",
      "Are airports covered under aviation insurance?",
      "Explain energy sector insurance.",
    ],
  },
  {
    key: "Liability",
    icon: "🛡️",
    title: "Liability Insurance",
    subcategories: [
      "Public Liability",
      "Product Liability",
      "Professional Indemnity",
      "D&O",
      "Cyber Liability",
    ],
    prompts: [
      "What is public liability insurance?",
      "How does product liability protect manufacturers?",
      "Is cyber liability useful for SMEs?",
      "What is covered under professional indemnity?",
    ],
  },
  {
    key: "Misc",
    icon: "📦",
    title: "Miscellaneous Covers",
    subcategories: [
      "Burglary",
      "Pet",
      "Event",
      "Mobile/Device",
      "Fidelity Guarantee",
    ],
    prompts: [
      "How does burglary insurance work?",
      "Can I insure my pet dog?",
      "What is event insurance for weddings?",
      "Is mobile insurance worth buying?",
    ],
  },
];

/* ================================
 * Component
 * ================================ */

const GenOxy: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<Message[][]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [activeAssistant, setActiveAssistant] =
    useState<AssistantOption | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [remainingPrompts, setRemainingPrompts] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  // KLM stage state
  const [klmRole, setKlmRole] = useState<KlmRole | null>(null);
  const [klmMode, setKlmMode] = useState<"role" | "generic" | null>(null);

  // Insurance: landing + current type + effective assistant ID
  const [insuranceLanding, setInsuranceLanding] = useState<boolean>(true);
  const [insuranceType, setInsuranceType] = useState<InsuranceType | null>(
    null
  );
  const [insuranceAssistantId, setInsuranceAssistantId] = useState<string>("");
  const [generalCategory, setGeneralCategory] =
    useState<GeneralCategoryKey | null>(null);

  const [questionCount, setQuestionCount] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

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
      setKlmMode(null);

      // reset insurance stage
      setInsuranceLanding(true);
      setInsuranceType(null);
      setInsuranceAssistantId("");
      setGeneralCategory(null);

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
      setKlmMode(null);
      setInsuranceLanding(true);
      setInsuranceType(null);
      setInsuranceAssistantId("");
      setGeneralCategory(null);
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
    questionCount,
    setQuestionCount,
    setShowModal,
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
    setKlmMode(null);

    // Insurance
    setInsuranceLanding(true);
    setInsuranceType(null);
    setInsuranceAssistantId("");
    setGeneralCategory(null);

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
      if (!res.ok)
        throw new Error(`HTTP ${res.status} – ${text || "Request failed"}`);

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
    if (current !== want) navigate(want);

    // Special routing for Insurance: require type + valid assistant ID
    if (activeAssistant.name.toLowerCase().includes("insurance")) {
      if (!insuranceType) {
        antdMessage.error("Please choose Life or General first.");
        return;
      }
      const effectiveId =
        insuranceAssistantId || INSURANCE_TYPE_TO_ID[insuranceType];
      if (!effectiveId || effectiveId.includes("replace_me")) {
        antdMessage.error("Assistant ID not set for selected insurance type.");
        return;
      }
      // const finalContent = `[Insurance Type: ${insuranceType}] ${trimmed}`;
      const finalContent = trimmed;

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

      await askAssistant(effectiveId, { role: "user", content: finalContent });
      return;
    }

    // KLM / others
    const isKlm = activeAssistant.name.toLowerCase().includes("klm");
    const effectiveAssistantId =
      isKlm && klmRole ? KLM_ROLE_ASSISTANT_ID : activeAssistant.id;

    setMessages((prev) => [
      ...prev,
      {
        id: `m_${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: new Date().toISOString(),
      },
    ]);
    setInput("");

    await askAssistant(effectiveAssistantId, {
      role: "user",
      content: trimmed,
    });
  };

  const handleKeyPress = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    console.log("file length" + selectedFiles.length);

    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      const trimmedInput = input.trim();

      if (!trimmedInput && selectedFiles.length === 0) {
        antdMessage.error("Please enter a message or upload files.");
        return;
      }

      // ✅ Continue file thread if active and prompts remain
      if (threadId && remainingPrompts && Number(remainingPrompts) > 0) {
        await handleFileUpload(null, trimmedInput);
        setSelectedFiles([]);

        setInput("");
        return;
      }

      // ✅ Handle file upload (fresh)
      if (selectedFiles.length > 0) {
        if (!trimmedInput) {
          antdMessage.error("Please add a short instruction for the files.");
        } else {
          await handleFileUpload(selectedFiles, trimmedInput);
          setInput("");
          setSelectedFiles([]);
        }
        return;
      }

      // ✅ Editing existing message
      if (editingMessageId && trimmedInput) {
        await handleEdit(editingMessageId, trimmedInput);
        setEditingMessageId(null);
        return;
      }

      // ✅ Normal assistant / default chat path
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

    // ✅ clear file/thread context
    setSelectedFiles([]);
    setThreadId(null);
    setRemainingPrompts(null);

    setMessages([]);
    setIsSidebarOpen(false);
    setEditingMessageId(null);
    setKlmRole(null);
    setKlmMode(null);
    setActiveAssistant(null);

    // Insurance reset
    setInsuranceLanding(true);
    setInsuranceType(null);
    setInsuranceAssistantId("");
    setGeneralCategory(null);

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
    (
      document.querySelector("textarea") as HTMLTextAreaElement | null
    )?.focus?.();
  };

  const showCenteredLayout = messages.length === 0 && !loading && !isChatRoute;

  /* Derived Send Handler */
  const resolvedSendHandler =
    selectedFiles.length > 0
      ? async () => {
          if (!input.trim()) {
            antdMessage.error("Please add a short instruction for the files.");
            return;
          }
          await handleFileUpload(selectedFiles, input);
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
      <div className="max-w-4xl mx-auto w-full px-3 sm:px-4 md:px-6 py-5 md:py-7">
        <div
          className="  p-5 sm:p-6 md:p-7  text-center  bg-white 
                   dark:bg-gray-800 text-purple-700 hover:text-purple-800 dark:text-white dark:hover:text-purple-200"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
            TiE Hyderabad Conversations
          </h2>
          <p className="mt-1  text-xs sm:text-sm max-w-xl text-purple-700 hover:text-purple-800 dark:text-white dark:hover:text-purple-200 mx-auto leading-snug">
            Ask anything about TiE Hyderabad chapter members, investors &
            experts. Let the Assistant guide you.
          </p>
        </div>

        <div className="mt-4 md:mt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white 
                   dark:bg-gray-800 border border-gray-200 dark:border-gray-600 
                   hover:border-purple-300 dark:hover:border-purple-500 
                   hover:shadow-sm transition text-left"
                aria-label={`Ask: ${q}`}
              >
                <span className="text-sm md:text-[13px] font-medium text-purple-700 hover:text-purple-800 dark:text-white dark:hover:text-purple-200">
                  {q}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /* KLM: mode / role / prompts / generic */
  const isKlm = activeAssistant?.name?.toLowerCase().includes("klm");
  const showKlmModeStage =
    isKlm && klmMode === null && messages.length === 0 && isChatRoute;

  const KlmModeSelect: React.FC = () => {
    return (
      <div className="w-full">
        <div className="max-w-4xl mx-auto px-3 sm:px-5 lg:px-6 py-6 md:py-8">
          <div className="rounded-2xl bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 p-5 sm:p-6 shadow text-center">
            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              KLM Fashions AI LLM
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
              Choose how you want to begin.
            </p>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {/* Role-based */}
              <button
                onClick={() => setKlmMode("role")}
                className="group flex flex-col items-center justify-center rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-lg px-6 py-6 transition text-center"
              >
                <div className="text-2xl">🧑‍💼</div>
                <div className="mt-2 font-semibold text-purple-700 dark:text-purple-200 text-sm sm:text-base">
                  Role-based Conversations
                </div>
                <div className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  Pick a role (CXO, HR, IT, etc.)
                </div>
              </button>

              {/* Generic */}
              <button
                onClick={() => setKlmMode("generic")}
                className="group flex flex-col items-center justify-center rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-lg px-6 py-6 transition text-center"
              >
                <div className="text-2xl">💬</div>
                <div className="mt-2 font-semibold text-purple-700 dark:text-purple-200 text-sm sm:text-base">
                  Generic Conversations
                </div>
                <div className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  Start with quick questions
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const showKlmRoleStage =
    isKlm &&
    klmMode === "role" &&
    klmRole === null &&
    messages.length === 0 &&
    isChatRoute;

  const KlmRoleSelect: React.FC = () => {
    return (
      <div className="w-full">
        <div className="max-w-4xl mx-auto px-3 sm:px-5 lg:px-6 py-5 md:py-6">
          <div className="rounded-2xl bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 p-5 sm:p-6 shadow text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-900 dark:text-white">
              KLM Fashions – Role-Based Conversations
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-300 text-xs sm:text-sm max-w-xl mx-auto">
              Choose your role to get relevant insights.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 place-items-center pb-20 sm:pb-10">
              {KLM_ROLES.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setKlmRole(r.key)}
                  className="group rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow px-3 py-4 transition flex flex-col items-center text-center w-full"
                >
                  <div className="text-xl mb-1">{r.icon}</div>
                  <div className="font-medium text-purple-600 hover:text-purple-800 dark:text-white dark:hover:text-purple-200 text-xs sm:text-sm">
                    {r.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const showKlmPromptStage =
    isKlm &&
    klmMode === "role" &&
    klmRole !== null &&
    messages.length === 0 &&
    isChatRoute;

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
          <div
            className={`rounded-2xl ${h.bg} ${h.accent} p-6 sm:p-8 shadow-md text-center`}
          >
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 place-items-center pb-20 sm:pb-10">
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
                  await askAssistant(KLM_ROLE_ASSISTANT_ID, {
                    role: "user",
                    content: q,
                  });
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white 
                 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 
                 hover:border-purple-300 dark:hover:border-purple-500 
                 hover:shadow transition text-left max-w-sm w-full"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-sm font-medium text-purple-600 hover:text-purple-800 dark:text-white dark:hover:text-purple-200">
                  {q}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 place-items-center pb-20 sm:pb-10">
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
                  await askAssistant(activeAssistant!.id, {
                    role: "user",
                    content: q,
                  });
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white 
                 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 
                 hover:border-purple-300 dark:hover:border-purple-500 
                 hover:shadow transition text-left max-w-sm w-full"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-sm font-medium text-purple-600 hover:text-purple-800 dark:text-white dark:hover:text-purple-200">
                  {q}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* Insurance LLM Starter (Landing -> 2 types -> Features/Categories) */
  const isInsurance =
    activeAssistant?.name?.toLowerCase().includes("insurance") &&
    messages.length === 0 &&
    isChatRoute;
  // Hide input until an insurance type is chosen
  const isInsuranceAssistant = !!activeAssistant?.name
    ?.toLowerCase()
    .includes("insurance");
  const hideInputBar = isChatRoute && isInsuranceAssistant && !insuranceType;

  const InsuranceStarter: React.FC = () => {
    const pickType = (t: InsuranceType) => {
      setInsuranceType(t);
      const id = INSURANCE_TYPE_TO_ID[t];
      setInsuranceAssistantId(id);
      setGeneralCategory(null);
    };

    const sendText = async (text: string) => {
      if (!insuranceType) {
        antdMessage.error("Please select Life or General first.");
        return;
      }
      const effId = insuranceAssistantId || INSURANCE_TYPE_TO_ID[insuranceType];
      if (!effId || effId.includes("replace_me")) {
        antdMessage.error("Assistant ID not set for selected insurance type.");
        return;
      }
      // const content = `[Insurance Type: ${insuranceType}] ${text}`;
      const content = text;

      setMessages((prev) => [
        ...prev,
        {
          id: `m_${Date.now()}`,
          role: "user",
          content,
          timestamp: new Date().toISOString(),
        },
      ]);
      await askAssistant(effId, { role: "user", content });
    };

    const lifeStage = insuranceType === "Life Insurance";
    const generalStage = insuranceType === "General Insurance";

    return (
      <div className="w-full">
        {/* ===== Insurance AI LLM – Polished, Mobile-First UI (drop-in) ===== */}
        <div className="max-w-6xl mx-auto w-full px-3 sm:px-5 py-5">
          <div
            className="rounded-2xl  bg-white 
                   dark:bg-gray-800 text-purple-700 hover:text-purple-800 dark:text-white dark:hover:text-purple-200 p-3 sm:p-7 "
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <h2
                className="text-lg sm:text-2xl font-bold  bg-white 
                   dark:bg-gray-800 text-purple-700 hover:text-purple-800 dark:text-white dark:hover:text-purple-200"
              >
                Insurance AI LLM
              </h2>

              {/* Subtle pill for current step/type on larger screens */}
              {!!insuranceType && (
                <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs border border-indigo-100">
                  <span className="text-sm">
                    {insuranceType === "Life Insurance" ? "🫶" : "🛡️"}
                  </span>
                  <span className="font-medium">{insuranceType}</span>
                </span>
              )}
            </div>

            {/* Step 0: Landing */}
            {insuranceLanding && (
              <div className="mt-4">
                <div
                  className="rounded-xl border border-gray-200  bg-white  
                   dark:bg-gray-800 text-purple-700 hover:text-purple-800 dark:text-white dark:hover:text-purple-200 p-3 sm:p-4 shadow-xs"
                >
                  <div
                    className="text-[11px] sm:text-sm  bg-white 
                   dark:bg-gray-800 text-purple-700 hover:text-purple-800 dark:text-white dark:hover:text-purple-200"
                  >
                    {BIMA_STRIP}
                  </div>
                </div>

                <div
                  className="mt-3 text-xs sm:text-sm leading-relaxed  bg-white 
                   dark:bg-gray-800 text-purple-700 hover:text-purple-800 dark:text-white dark:hover:text-purple-200"
                >
                  <p>
                    In India, insurance is commonly called{" "}
                    <strong>Bīma (बीमा / బీమా)</strong> across most languages.
                  </p>
                  <p className="mt-2">
                    The Insurance Regulatory and Development Authority of India
                    (IRDAI) has approved <strong>61 companies</strong>:
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>26 Life Insurance Companies</li>
                    <li>33 General Insurance Companies</li>
                    <li>2 Reinsurance Companies</li>
                  </ul>
                  <p className="mt-2">
                    Citizens buy policies directly from{" "}
                    <strong>59 companies</strong>, covering life, motor, health,
                    and more.
                  </p>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setInsuranceLanding(false)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[.99] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Let’s Explore Life &amp; General Insurance →
                  </button>
                  <button
                    onClick={() => {
                      navigate("/insurancevoice");
                    }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 active:scale-[.99] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Let's explore Voice Agent
                  </button>
                  {/* New Buttons */}
                  <button
                    onClick={() => navigate("/genoxy/llm-faqs")}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 active:scale-[.99] focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    Insurance AI LLM 100 FAQs
                  </button>

                  <button
                    onClick={() => navigate("/genoxy/faqslide")}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 active:scale-[.99] focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    FAQ Slide
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Type cards */}
            {!insuranceLanding && !insuranceType && (
              <div className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Life Insurance */}
                  <button
                    onClick={() => pickType("Life Insurance")}
                    className="group w-full rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 
               hover:border-indigo-400 hover:shadow-md transition 
               active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 shrink-0">
                        <span className="text-2xl sm:text-3xl">🫶</span>
                      </div>

                      {/* Text */}
                      <div className="flex flex-col justify-center">
                        <div className="font-semibold text-indigo-700 text-base sm:text-lg">
                          Life Insurance
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 mt-1 leading-snug">
                          Term, savings/ULIP, riders, claims &amp; more.
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* General Insurance */}
                  <button
                    onClick={() => pickType("General Insurance")}
                    className="group w-full rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 
               hover:border-indigo-400 hover:shadow-md transition 
               active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 shrink-0">
                        <span className="text-2xl sm:text-3xl">🛡️</span>
                      </div>

                      {/* Text */}
                      <div className="flex flex-col justify-center">
                        <div className="font-semibold text-indigo-700 text-base sm:text-lg">
                          General Insurance
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 mt-1 leading-snug">
                          Motor, health, home, travel, SME, cyber &amp; more.
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2A: Life → 8 questions */}
            {lifeStage && (
              <>
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">
                  <div className="text-xs sm:text-sm">
                    <span className="font-semibold text-indigo-700">
                      Life Insurance
                    </span>{" "}
                    — Quick conversations
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setInsuranceType(null);
                        setInsuranceAssistantId("");
                      }}
                      className="text-[11px] sm:text-xs underline decoration-dotted hover:text-indigo-700 transition"
                    >
                      ← Change type
                    </button>
                  </div>
                </div>

                {/* Intro Card */}
                <div className="mt-2 rounded-lg bg-indigo-50 border border-indigo-100 p-3 sm:p-4 text-[13px] sm:text-sm text-indigo-800 shadow-sm">
                  🛡{" "}
                  <span className="font-semibold">
                    Life Insurance — Welcome!
                  </span>
                  I can guide you through life insurance, explain benefits,
                  compare policies, estimate premiums, highlight exclusions, and
                  simplify claim processes.
                </div>

                {/* Questions Area */}
                <div
                  className="
        mt-3
        max-h-[calc(100dvh-220px)]
        overflow-y-auto pr-1 pb-[88px]
        sm:max-h-none sm:overflow-visible sm:pb-0
      "
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {LIFE_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendText(q)}
                        className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 text-left active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <span className="mt-1 inline-block w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                        <span className="text-[14px] sm:text-sm font-medium text-gray-800">
                          {q}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 2B: General → categories OR prompts */}
            {generalStage && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">
                  <div className="text-xs sm:text-sm">
                    <span className="font-semibold text-indigo-700">
                      General Insurance
                    </span>{" "}
                    — pick a category
                  </div>
                  <div className="flex items-center gap-3">
                    {generalCategory && (
                      <button
                        onClick={() => setGeneralCategory(null)}
                        className="text-[11px] sm:text-xs underline decoration-dotted"
                      >
                        ← All categories
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setInsuranceType(null);
                        setInsuranceAssistantId("");
                        setGeneralCategory(null);
                      }}
                      className="text-[11px] sm:text-xs underline decoration-dotted"
                    >
                      ← Change type
                    </button>
                  </div>
                </div>
                {/* General Insurance Intro */}
                <div className="mt-2 rounded-lg bg-purple-50 border border-purple-100 p-3 sm:p-4 text-[13px] sm:text-sm text-purple-800">
                  🌍 General Insurance — Welcome! I can help you explore health,
                  motor, travel, property, and other general insurances,
                  understand coverage, compare options, and guide claims.
                </div>

                {/* Categories grid */}
                {!generalCategory && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mt-3">
                    {GENERAL_CATEGORIES.map((c) => (
                      <button
                        key={c.key}
                        onClick={() => setGeneralCategory(c.key)}
                        className="w-full rounded-xl border border-gray-200 bg-white p-3 hover:border-indigo-300 hover:shadow transition text-left active:scale-[.99] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <div className="text-xl">{c.icon}</div>
                        <div className="mt-1 font-semibold text-indigo-700 text-[12px] sm:text-sm">
                          {c.title}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Prompts inside a category */}
                {generalCategory && (
                  <div
                    className="
              mt-3
              max-h-[calc(100dvh-220px)]
              overflow-y-auto pr-1 pb-[88px]
              sm:max-h-none sm:overflow-visible sm:pb-0
            "
                  >
                    <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
                      <div className="text-sm font-semibold text-indigo-700">
                        {
                          GENERAL_CATEGORIES.find(
                            (x) => x.key === generalCategory
                          )?.title
                        }
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                        {GENERAL_CATEGORIES.find(
                          (x) => x.key === generalCategory
                        )!
                          .prompts.slice(0, 4)
                          .map((q) => (
                            <button
                              key={q}
                              onClick={() =>
                                sendText(`[${generalCategory}] ${q}`)
                              }
                              className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white border border-gray-200 
                   hover:border-indigo-400 hover:shadow-md transition 
                   text-left active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <span className="inline-block w-3 h-3 rounded-full bg-indigo-500 flex-shrink-0" />
                              <span className="text-sm sm:text-base font-medium text-gray-800 leading-snug">
                                {q}
                              </span>
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* Chat start picker (no assistant yet on /genoxy/chat) */
  const showChatStartPicker =
    isChatRoute && !activeAssistant && messages.length === 0;

  const ChatStartPicker: React.FC = () => {
    return (
      <div className="w-full px-3 sm:px-4 py-6">
        <div className="max-w-3xl mx-auto rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-4 sm:p-6 shadow text-center flex flex-col">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Choose an AI LLM
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
            Start a conversation directly in the chat.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 flex-grow">
            {ASSISTANTS.map(({ id, ...a }) => (
              <button
                key={a.slug}
                onClick={() =>
                  handlePickAssistant({ name: a.name, slug: a.slug })
                }
                className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow px-4 py-4 text-left transition"
              >
                <div className="text-base font-semibold text-purple-700 dark:text-purple-200">
                  {a.name}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                  Tap to open {a.name}.
                </div>
              </button>
            ))}
          </div>

          <div className="text-center text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-4 py-1">
            Powered by{" "}
            <a
              href="https://www.askoxy.ai/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-purple-700 dark:text-purple-300 hover:underline"
            >
              ASKOXY.AI
            </a>{" "}
            &nbsp;|&nbsp;
            <a
              href="https://oxyloans.com/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-purple-700 dark:text-purple-300 hover:underline"
            >
              OxyLoans
            </a>
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
          style={{ paddingBottom: "var(--inputbar-height, 80px)" }}
        >
          <Sidebar
            chatHistory={chatHistory}
            loadChat={loadChat}
            clearHistory={() => setChatHistory([])}
            toggleSidebar={() => setIsSidebarOpen(false)}
            clearChat={clearChat}
            assistants={ASSISTANTS}
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
              selectedFile={selectedFiles}
              setSelectedFile={setSelectedFiles}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 relative pt-4 sm:pt-0">
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
              {!hideInputBar && (
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
                  uploadedFile={selectedFiles}
                  setUploadedFile={setSelectedFiles}
                  disclaimerText={
                    isChatRoute && activeAssistant
                      ? disclaimerForAssistant(activeAssistant.name)
                      : null
                  }
                  questionCount={questionCount}
                  showModal={showModal}
                  setShowModal={setShowModal}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenOxy;
