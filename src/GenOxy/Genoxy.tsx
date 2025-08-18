import React, { useRef, useState, KeyboardEvent } from "react";
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

/* ================================
 * Assistants (no roles in API)
 * ================================ */

interface AssistantOption {
  id: string;
  name: string;
  description?: string;
}

const ASSISTANTS: AssistantOption[] = [
  { id: "asst_5g20JJbZ88NvcSgNYLMeQTm2", name: "Tie Hyd" },
  { id: "asst_PGnuKq3mSvx96598PTed2XGy", name: "IRDAI" },
  { id: "asst_XYsY8abeIoMWvsD394DW2N5A", name: "KLM Fashions" },
];

const ASK_ENDPOINT = `${(BASE_URL || "").replace(
  /\/$/,
  ""
)}/student-service/user/askquestion`;

/** TiE starter prompts */
const TIE_PROMPTS: string[] = [
  "Show me real estate founders in TIE Hyderabad",
  "Who are the active FinTech advisors I can connect with?",
  "List VC fund managers from the TIE network",
  "Find women entrepreneurs building tech startups",
  "Which members support early-stage startups?",
  "Who regularly speaks at startup events or conferences?",
];

/** KLM roles + prompts */
type KlmRole = "CXO" | "Operations" | "Management" | "IT" | "Sales";
const KLM_ROLES: { key: KlmRole; label: string; icon: string }[] = [
  { key: "CXO", label: "CXO", icon: "👔" },
  { key: "Operations", label: "Operations", icon: "🏭" },
  { key: "Management", label: "Management", icon: "👨‍💼" },
  { key: "IT", label: "IT", icon: "💻" },
  { key: "Sales", label: "Sales", icon: "📈" },
];

const KLM_PROMPTS: Record<KlmRole, string[]> = {
  CXO: [
    "View Profitability Summary",
    "Forecast Next Quarter Growth",
    "Top 3 Risks Affecting Margins",
    "Cash Burn vs Revenue",
  ],
  Operations: [
    "Inventory Status of Fast-Moving SKUs",
    "Shipment Delays and Reasons",
    "Supply Chain Cost Breakdown",
    "SKU Return & Quality Issues",
  ],
  Management: [
    "Department-wise Target Achievement",
    "Underperforming Product Lines",
    "Cost-Benchmark Analysis",
    "90-Day Performance Summary",
  ],
  IT: [
    "IT Infra Cost Overview",
    "Recent Downtime or Security Issues",
    "License Renewals Due",
    "Helpdesk Ticket Trends",
  ],
  Sales: [
    "Daily Sales vs Last Week",
    "Top Performing Products",
    "Conversion Rates by Region",
    "Sales Impact of Recent Campaign",
  ],
};

/* ================================
 * IRDAI options (dependent dropdowns)
 * ================================ */

type IrdaLicenseType =
  | "Life Insurance Companies"
  | "Non-life/General Insurance Companies"
  | "Reinsurers";

const IRDAI_LICENSE_TYPES: IrdaLicenseType[] = [
  "Life Insurance Companies",
  "Non-life/General Insurance Companies",
  "Reinsurers",
];

const IRDAI_ENTITIES: Record<IrdaLicenseType, string[]> = {
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

const IRDAI_FIXED_QUESTIONS = [
  "Generate Compliance Scorecard",
  "Assess Clarity & Correctness of Rule Implementation",
  "Highlight Deviations from IRDA Guidelines",
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

  // IRDAI form state
  const [irdaLicense, setIrdaLicense] = useState<IrdaLicenseType | "">("");
  const [irdaEntity, setIrdaEntity] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { darkMode } = useDarkMode();
  const location = useLocation();
  const navigate = useNavigate();
  const isChatRoute = location.pathname === "/genoxy/chat";

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

  /* Helpers */
  function resetChatForNewAssistant() {
    setChatHistory((prev) =>
      messages.length ? [...prev, [...messages]] : prev
    );
    setMessages([]);
    setInput("");
    setEditingMessageId(null);
    setSelectedFile(null);
    setThreadId(null);
    setRemainingPrompts(null);
    setKlmRole(null);
    // reset IRDAI form
    setIrdaLicense("");
    setIrdaEntity("");
    navigate("/genoxy/chat");
  }

  async function askAssistant(
    assistantId: string | null | undefined,
    userMessage: { role: "user"; content: string }
  ) {
    if (!assistantId) {
      antdMessage.error("Pick an assistant first.");
      return;
    }

    const url =
      `${ASK_ENDPOINT}` +
      `?assistantId=${encodeURIComponent(assistantId)}` +
      `&instruction=`; // empty instruction

    const payload = [{ role: userMessage.role, content: userMessage.content }];

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "*/*" },
        body: JSON.stringify(payload),
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

  /* UI Events */
  const handlePickAssistant = (assistant: AssistantOption) => {
    if (!activeAssistant || activeAssistant.id !== assistant.id) {
      resetChatForNewAssistant();
    }
    setActiveAssistant(assistant);
  };

  const handleAssistantSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) {
      antdMessage.error("Please enter a message.");
      return;
    }
    if (!activeAssistant) {
      await handleSend();
      return;
    }

    // If IRDAI is active, add context
    let finalContent = trimmed;
    if (activeAssistant.name.toLowerCase().includes("irdai")) {
      if (!irdaLicense || !irdaEntity) {
        antdMessage.error("Please select license type and regulated entity.");
        return;
      }
      finalContent = `[License Type: ${irdaLicense}; Entity: ${irdaEntity}] ${trimmed}`;
    }

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

    await askAssistant(activeAssistant.id, {
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
    if (messages.length > 0) setChatHistory((prev) => [...prev, [...messages]]);
    setSelectedFile(null);
    setThreadId(null);
    setRemainingPrompts(null);
    setMessages([]);
    setIsSidebarOpen(false);
    setEditingMessageId(null);
    setKlmRole(null);
    setActiveAssistant(null);
    setIrdaLicense("");
    setIrdaEntity("");
    navigate("/genoxy");
  };

  const loadChat = (chat: Message[]) => {
    setMessages(chat);
    setIsSidebarOpen(false);
    setEditingMessageId(null);
    navigate("/genoxy/chat");
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
    <div className="w-full bg-white">
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="rounded-2xl bg-[#6b4cd6] text-white p-6 sm:p-8 shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold">
              TiE Hyderabad Assistant
            </h2>
            <div className="text-sm opacity-90 font-semibold">
              TiE HYDERABAD
            </div>
          </div>
          <p className="mt-2 text-white/90">
            Ask anything about TiE Hyderabad founders, mentors, investors &
            domain experts. Let the Assistant guide you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
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
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow transition text-left"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-sm font-medium text-gray-800">{q}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  /* KLM: Stage 1 (Role select) */
  const isKlm = activeAssistant?.name?.toLowerCase().includes("klm");
  const showKlmRoleStage =
    isKlm && klmRole === null && messages.length === 0 && isChatRoute;

  const KlmRoleSelect: React.FC = () => (
    <div className="w-full">
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="rounded-2xl bg-gradient-to-b from-white to-gray-50 border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            KLM Fashions – Role-Based Assistant
          </h2>
          <p className="mt-2 text-gray-600">
            Choose your role to get relevant insights and start your
            conversation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
            {KLM_ROLES.map((r) => (
              <button
                key={r.key}
                onClick={() => setKlmRole(r.key)}
                className="group rounded-2xl border border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md px-4 py-6 text-left transition flex flex-col items-start"
              >
                <div className="text-2xl mb-3">{r.icon}</div>
                <div className="font-semibold text-gray-900">{r.label}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Click to explore
                </div>
              </button>
            ))}
          </div>

          <div className="mt-5 text-xs text-gray-500">
            You can change role anytime from the menu.
          </div>
        </div>
      </div>
    </div>
  );

  /* KLM: Stage 2 (Role prompts) */
  const showKlmPromptStage =
    isKlm && klmRole !== null && messages.length === 0 && isChatRoute;

  const KlmRoleStarter: React.FC = () => {
    if (!klmRole) return null;
    const prompts = KLM_PROMPTS[klmRole];
    const headerStyles: Record<
      KlmRole,
      { bg: string; accent: string; sub: string }
    > = {
      CXO: { bg: "bg-[#0b2a5b]", accent: "text-white", sub: "text-white/80" },
      Operations: {
        bg: "bg-[#1f3d2c]",
        accent: "text-white",
        sub: "text-white/80",
      },
      Management: {
        bg: "bg-[#0f2f36]",
        accent: "text-white",
        sub: "text-white/80",
      },
      IT: { bg: "bg-[#132b3a]", accent: "text-white", sub: "text-white/80" },
      Sales: { bg: "bg-[#1c2c5e]", accent: "text-white", sub: "text-white/80" },
    };

    const roleHeader: Record<KlmRole, { title: string; sub: string }> = {
      CXO: {
        title: "Welcome CXO – Strategic Insights at a Glance",
        sub: "Start your conversation below or type your own.",
      },
      Operations: {
        title: "Welcome Operations Team – Stay on Top of Execution",
        sub: "Pick a topic to begin or type your query.",
      },
      Management: {
        title: "Welcome Management – Insights for Team Performance",
        sub: "Choose a report or ask a question below.",
      },
      IT: {
        title:
          "Welcome IT Team – Infrastructure & Compliance at Your Fingertips",
        sub: "Select a topic or initiate a custom query.",
      },
      Sales: {
        title: "Welcome Sales Team – Drive Revenue with Insights",
        sub: "Click below or ask your own sales question.",
      },
    };

    const h = headerStyles[klmRole];
    const copy = roleHeader[klmRole];

    return (
      <div className="w-full">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
          <div
            className={`rounded-2xl ${h.bg} ${h.accent} p-6 sm:p-8 shadow-md`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">{copy.title}</h2>
                <p className={`mt-2 ${h.sub}`}>{copy.sub}</p>
              </div>
              <button
                onClick={() => setKlmRole(null)}
                className="text-xs underline decoration-dotted opacity-90 hover:opacity-100"
                title="Change role"
              >
                Change role
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
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
                  await askAssistant(activeAssistant!.id, {
                    role: "user",
                    content: q,
                  });
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-200 hover:border-indigo-300 hover:shadow transition text-left"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-sm font-medium text-gray-800">{q}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* IRDAI Starter Panel (dropdowns + fixed questions) */
  const isIrdai =
    activeAssistant?.name?.toLowerCase().includes("irdai") &&
    messages.length === 0 &&
    isChatRoute;

  const IrdaiStarter: React.FC = () => {
    const entities = irdaLicense ? IRDAI_ENTITIES[irdaLicense] : [];

    const sendWithContext = async (text: string) => {
      if (!irdaLicense || !irdaEntity) {
        antdMessage.error("Please select license type and regulated entity.");
        return;
      }
      const content = `[License Type: ${irdaLicense}; Entity: ${irdaEntity}] ${text}`;
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
              Insurance Companies LLM Assistant
            </h2>

            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              <div className="rounded-xl border border-gray-200 bg-white p-3">
                <label className="text-xs font-medium text-gray-600">
                  Select License Type
                </label>
                <select
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={irdaLicense}
                  onChange={(e) => {
                    const val = e.target.value as IrdaLicenseType | "";
                    setIrdaLicense(val);
                    setIrdaEntity("");
                  }}
                >
                  <option value="">Choose…</option>
                  {IRDAI_LICENSE_TYPES.map((t) => (
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
                  value={irdaEntity}
                  onChange={(e) => setIrdaEntity(e.target.value)}
                  disabled={!irdaLicense}
                >
                  <option value="">
                    {irdaLicense ? "Choose…" : "Select license type first"}
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
              {IRDAI_FIXED_QUESTIONS.map((q) => (
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
          className={`fixed inset-y-0 left-0 z-30 transform bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } w-64 sm:w-64 md:w-68 lg:w-72 sm:relative sm:translate-x-0 sm:flex sm:flex-col`}
        >
          <Sidebar
            chatHistory={chatHistory}
            loadChat={loadChat}
            clearHistory={() => setChatHistory([])}
            toggleSidebar={() => setIsSidebarOpen(false)}
            clearChat={clearChat}
            assistants={ASSISTANTS}
            activeAssistantId={activeAssistant?.id ?? null}
            onPickAssistant={handlePickAssistant}
          />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        {!showCenteredLayout && (
          <Header
            clearChat={clearChat}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
            messages={messages}
            activeAssistantName={activeAssistant?.name}
          />
        )}

        {showCenteredLayout ? (
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
        ) : (
          <div className="flex-1 flex flex-col min-h-0 relative">
            {/* Starters shown only when chat is empty */}
            {showTieStarter && <TieStarter />}
            {isKlm && showKlmRoleStage && <KlmRoleSelect />}
            {isKlm && showKlmPromptStage && <KlmRoleStarter />}
            {isIrdai && <IrdaiStarter />}

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
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenOxy;
