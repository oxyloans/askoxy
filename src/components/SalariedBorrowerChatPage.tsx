import React, { useState, useRef, useEffect } from "react";
import BASE_URL from "../Config";

const BORROWER_PORTAL_URL = "https://oxyloans.com";

interface ChatMessage {
  role: "USER" | "ASSISTANT";
  text: string;
}

interface ChatResponseDTO {
  bfSessionId: string;
  bfReply: string;
  bfStage: string;
}

type Language = "EN" | "TE";

const WELCOME_MESSAGE =
  "Welcome! I'm OxyLoans' AI assistant, and I'm glad you're here. We encourage every borrower to borrow only based on genuine need — please enter the loan amount you'd like to borrow, and I'll help you through the rest.";

const STAGES = [
  { key: "LOAN_AMOUNT", label: "Loan Amount", note: "How much you need" },
  { key: "LOAN_PURPOSE", label: "Purpose", note: "What it's for" },
  { key: "LOGIN_MOBILE", label: "Mobile Number", note: "Get logged in" },
  { key: "BORROWER_TYPE", label: "Profile", note: "Salaried, student, business…" },
  { key: "AWAITING_PAN", label: "PAN Card", note: "Identity proof" },
  { key: "AWAITING_AADHAAR", label: "Aadhaar Card", note: "Identity proof" },
  { key: "AWAITING_INCOME_PROOF", label: "Payslip", note: "Salaried borrowers only" },
  { key: "AWAITING_BANK_STATEMENT", label: "Bank Statement", note: "Recent statement" },
  { key: "OFFER_CONSENT", label: "Risk Review & Offer", note: "Review and accept" },
  { key: "SUBMITTED", label: "Login & Complete", note: "eSign & eNACH on portal" },
] as const;

const CLOSED_STAGES = ["DECLINED"];

const UI_TEXT: Record<
  Language,
  {
    placeholder: string;
    closedPlaceholder: string;
    disclaimer: string;
    loginTitle: string;
    loginBody: string;
    loginButton: string;
    closedTitle: string;
    closedBody: string;
    newApplication: string;
  }
> = {
  EN: {
    placeholder: "Type your reply…",
    closedPlaceholder: "This application is closed.",
    disclaimer: "Responses may contain mistakes. Please verify important financial information.",
    loginTitle: "Application registered",
    loginBody:
      "Log in to the OxyLoans borrower portal with your registered mobile number to complete eSign & eNACH and track your application.",
    loginButton: "Login to OxyLoans",
    closedTitle: "Application closed",
    closedBody: "This application won't continue. You can start a new one anytime.",
    newApplication: "Start new application",
  },
  TE: {
    placeholder: "మీ సమాధానం టైప్ చేయండి…",
    closedPlaceholder: "ఈ దరఖాస్తు మూసివేయబడింది.",
    disclaimer: "ప్రతిస్పందనలలో పొరపాట్లు ఉండవచ్చు. ముఖ్యమైన ఆర్థిక సమాచారాన్ని దయచేసి ధృవీకరించండి.",
    loginTitle: "దరఖాస్తు నమోదైంది",
    loginBody:
      "eSign & eNACH పూర్తి చేయడానికి మరియు మీ దరఖాస్తు స్థితిని చూడటానికి మీ నమోదిత మొబైల్ నంబర్‌తో OxyLoans బారోవర్ పోర్టల్‌లో లాగిన్ అవ్వండి.",
    loginButton: "OxyLoans లో లాగిన్ అవ్వండి",
    closedTitle: "దరఖాస్తు మూసివేయబడింది",
    closedBody: "ఈ దరఖాస్తు కొనసాగదు. మీరు ఎప్పుడైనా కొత్త దరఖాస్తు ప్రారంభించవచ్చు.",
    newApplication: "కొత్త దరఖాస్తు ప్రారంభించండి",
  },
};

function stageIndex(stage: string): number {
  const i = STAGES.findIndex((s) => s.key === stage);
  return i === -1 ? STAGES.length : i; // unknown stage -> treat as "past the tracked list"
}

/** Turns URLs and "oxyloans.com" in assistant replies into clickable links. */
function renderWithLinks(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+|oxyloans\.com)/gi);
  return parts.map((part, i) => {
    if (/^https?:\/\//i.test(part) || /^oxyloans\.com$/i.test(part)) {
      const href = /^https?:\/\//i.test(part) ? part : BORROWER_PORTAL_URL;
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-medium"
          style={{ color: "#a9824f" }}
        >
          {part}
        </a>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

async function callApi<T>(url: string, options: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers: { Accept: "application/json", ...(options.headers || {}) },
    });
  } catch (err) {
    console.error("Network/CORS error calling", url, err);
    throw new Error(
      "We are experiencing a temporary network issue. Please check your internet connection or try again shortly.",
    );
  }

  const raw = await res.text();

  if (!res.ok) {
    console.error(`API ${url} returned ${res.status}:`, raw);
    if (res.status === 401 || res.status === 403) {
      throw new Error("Session validation failed. Please refresh the page to start a new chat.");
    } else if (res.status === 404) {
      throw new Error("The requested chat service could not be found. Please try again later.");
    } else {
      throw new Error("We are currently facing an issue processing your request. Please try again in a few moments.");
    }
  }
  if (!raw) throw new Error("The server responded with an empty response.");

  try {
    return JSON.parse(raw) as T;
  } catch {
    console.error(`API ${url} returned non-JSON body:`, raw);
    throw new Error("Received an invalid response from the server. Please try again shortly.");
  }
}

function FilePreviewThumbnail({ file }: { file: File }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  if (previewUrl) {
    return (
      <img
        src={previewUrl}
        alt={file.name}
        className="w-10 h-10 object-cover rounded border border-[#ddd2b8] shrink-0"
      />
    );
  }

  const isPdf = file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
  const isDoc = file.name.toLowerCase().endsWith(".doc") || file.name.toLowerCase().endsWith(".docx");

  return (
    <div
      className="w-10 h-10 rounded flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-wider shrink-0"
      style={{ background: isPdf ? "#e1523f" : isDoc ? "#4682b4" : "#a9824f" }}
    >
      {isPdf ? "PDF" : isDoc ? "DOC" : "FILE"}
    </div>
  );
}

export default function BorrowerChatPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [stage, setStage] = useState<string>("LOAN_AMOUNT");
  const [language, setLanguage] = useState<Language>("EN");
  // Static welcome shown on page load — no API call. The session is only created
  // (via /start) when the user sends their first input.
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "ASSISTANT", text: WELCOME_MESSAGE }]);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  // Tracks whether the payslip step was skipped (non-salaried borrowers jump Aadhaar -> Bank Statement)
  const [payslipSkipped, setPayslipSkipped] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Session is created lazily — only when the user sends their first input.
  const sessionIdRef = useRef<string | null>(null);
  const startPromiseRef = useRef<Promise<string> | null>(null);

  const ensureSession = async (): Promise<string> => {
    if (sessionIdRef.current) return sessionIdRef.current;

    if (!startPromiseRef.current) {
      startPromiseRef.current = callApi<ChatResponseDTO>(`${BASE_URL}/vibecode-service/borrower/start`, {
        method: "POST",
      })
        .then((data) => {
          sessionIdRef.current = data.bfSessionId;
          setSessionId(data.bfSessionId);
          updateStage(data.bfStage);
          return data.bfSessionId;
        })
        .catch((err) => {
          startPromiseRef.current = null; // allow retry on next send
          throw err;
        });
    }
    return startPromiseRef.current;
  };

  const updateStage = (next: string) => {
    setStage((prev) => {
      if (prev === "AWAITING_AADHAAR" && next === "AWAITING_BANK_STATEMENT") setPayslipSkipped(true);
      return next;
    });
  };

  const resetChat = () => {
    sessionIdRef.current = null;
    startPromiseRef.current = null;
    setSessionId(null);
    setStage("LOAN_AMOUNT");
    setPayslipSkipped(false);
    setMessages([{ role: "ASSISTANT", text: WELCOME_MESSAGE }]);
    setInputValue("");
    setPendingFiles([]);
    setConnectionError(null);
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-IN";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue((prev) => (prev ? prev + " " + transcript : transcript));
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    if (isListening) recognitionRef.current.stop();
    else recognitionRef.current.start();
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, stage]);

  const isClosed = CLOSED_STAGES.includes(stage);
  const isSubmitted = stage === "SUBMITTED";

  const handleSend = async () => {
    const text = inputValue.trim();
    if ((!text && pendingFiles.length === 0) || sending || uploading || isClosed) return;

    const filesToSend = [...pendingFiles];

    setMessages((prev) => [
      ...prev,
      ...filesToSend.map((file) => ({ role: "USER" as const, text: `Attached: ${file.name}` })),
      ...(text ? [{ role: "USER" as const, text }] : []),
    ]);

    setInputValue("");
    setPendingFiles([]);
    resetTextareaHeight();
    setConnectionError(null);

    const isUpload = filesToSend.length > 0;
    isUpload ? setUploading(true) : setSending(true);

    try {
      const sid = await ensureSession();

      const formData = new FormData();
      if (text) formData.append("bfMessage", text);
      filesToSend.forEach((file) => formData.append("files", file));

      const data = await callApi<ChatResponseDTO>(
        `${BASE_URL}/vibecode-service/borrower/chat?bfSessionId=${encodeURIComponent(sid)}`,
        { method: "POST", body: formData },
      );

      updateStage(data.bfStage);
      setMessages((prev) => [...prev, { role: "ASSISTANT", text: data.bfReply }]);
    } catch (err) {
      const errMsg =
        (err as Error).message || "We are currently facing an issue processing your request. Please try again.";
      setConnectionError(errMsg);
      setMessages((prev) => [...prev, { role: "ASSISTANT", text: errMsg }]);
    } finally {
      setSending(false);
      setUploading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    const filesArray = Array.from(selectedFiles);
    setPendingFiles((prev) => [...prev, ...filesArray]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const resetTextareaHeight = () => {
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const currentStageIndex = stageIndex(stage);
  const knownStage = STAGES.find((s) => s.key === stage);
  const ui = UI_TEXT[language];
  const inputDisabled = sending || uploading || isClosed;

  // Per-step display state: done / active / skipped / pending
  const stepState = (key: string, i: number) => {
    if (key === "AWAITING_INCOME_PROOF" && payslipSkipped) return "skipped";
    if (key === "SUBMITTED" && isSubmitted) return "done";
    if (i < currentStageIndex) return "done";
    if (i === currentStageIndex) return "active";
    return "pending";
  };

  const headerLabel = connectionError
    ? "Connection issue"
    : isClosed
      ? ui.closedTitle
      : knownStage?.label ?? stage;

  return (
    <div className="flex h-screen w-full" style={{ background: "#f4f5f7", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .bf-serif { font-family: 'Fraunces', serif; }
        .bf-label { font-family: 'Inter', sans-serif; letter-spacing: 0.05em; text-transform: uppercase; }
        .bf-mono { font-family: 'JetBrains Mono', monospace; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      {/* Sidebar */}
      <div
        className="hidden md:flex md:flex-col w-[280px] shrink-0 p-6 text-white justify-between"
        style={{ background: "#1b2a41" }}
      >
        <div className="flex flex-col gap-6 min-h-0">
          <div className="flex flex-col">
            <span className="bf-serif text-[24px] font-semibold text-[#e7d3ae]">OxyLoans</span>
            <span className="bf-label text-[10px] tracking-[0.2em] font-semibold mt-1" style={{ color: "#a39a86" }}>
              AI Chat Loan
            </span>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto">
            {STAGES.map((s, i) => {
              const state = stepState(s.key, i);
              const done = state === "done";
              const active = state === "active";
              const skipped = state === "skipped";

              return (
                <div
                  key={s.key}
                  className="relative px-3 py-2.5 transition-all"
                  style={{
                    background: active ? "#eef1f5" : "rgba(255,255,255,0.04)",
                    borderRadius: "3px 10px 10px 3px",
                    transform: active ? "translateX(6px)" : "none",
                    borderLeft: `3px solid ${done || active ? "#a9824f" : "#33415c"}`,
                    opacity: skipped ? 0.5 : 1,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="bf-label text-[10px] font-semibold min-w-[24px]"
                      style={{ color: active ? "#a9824f" : done ? "#c9a06a" : "#5f6d88" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="flex-1">
                      <div
                        className="flex items-center gap-2 bf-serif text-[14px] font-medium"
                        style={{
                          color: active ? "#1b2a41" : done ? "#e7d3ae" : "#8391aa",
                          textDecoration: skipped ? "line-through" : "none",
                        }}
                      >
                        {done && <span style={{ color: "#3f7a5c", fontSize: "10px" }}>●</span>}
                        {s.label}
                      </div>
                      <div className="text-[11px] mt-0.5" style={{ color: active ? "#6b6455" : "#5f6d88" }}>
                        {skipped ? "Not required for your profile" : s.note}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {isClosed && (
              <div
                className="relative px-3 py-2.5"
                style={{ background: "#f6e4de", borderRadius: "3px 10px 10px 3px", borderLeft: "3px solid #a3452f" }}
              >
                <div className="bf-serif text-[14px] font-medium" style={{ color: "#a3452f" }}>
                  {ui.closedTitle}
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: "#6b6455" }}>
                  {ui.closedBody}
                </div>
              </div>
            )}
          </div>
        </div>

        {sessionId && (
          <div className="mt-auto pt-6" style={{ borderTop: "1px solid #33415c" }}>
            <div className="bf-label text-[9px] mb-1" style={{ color: "#5f6d88" }}>
              Case reference
            </div>
            <div className="bf-mono text-[11.5px]" style={{ color: "#d8cba3" }}>
              {sessionId.slice(0, 13)}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        {/* Letterhead bar */}
        <div
          className="h-[56px] md:h-[64px] min-h-[56px] md:min-h-[64px] flex items-center justify-between px-4 md:px-7"
          style={{ background: "#ffffff", borderBottom: "1px solid #e4e7eb" }}
        >
          <div className="flex items-center gap-3">
            <div className="bf-serif text-[16px] font-medium md:hidden" style={{ color: "#1b2a41" }}>
              OxyLoans
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block w-[6px] h-[6px] rounded-full"
                style={{ background: connectionError || isClosed ? "#a3452f" : "#3f7a5c" }}
              />
              <span className="text-[12px]" style={{ color: "#6b6455" }}>
                {headerLabel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSubmitted && (
              <a
                href={BORROWER_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex px-3 py-1 rounded-lg text-[12px] font-semibold text-white"
                style={{ background: "#a9824f" }}
              >
                {ui.loginButton}
              </a>
            )}
            <div className="flex items-center rounded-lg overflow-hidden shrink-0" style={{ border: "1px solid #ddd2b8" }}>
              <button
                onClick={() => setLanguage("EN")}
                className="px-2.5 py-1 text-[12px] font-semibold transition-colors"
                style={{
                  background: language === "EN" ? "#1b2a41" : "#ffffff",
                  color: language === "EN" ? "#ffffff" : "#6b6455",
                }}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("TE")}
                className="px-2.5 py-1 text-[12px] font-semibold transition-colors"
                style={{
                  background: language === "TE" ? "#1b2a41" : "#ffffff",
                  color: language === "TE" ? "#ffffff" : "#6b6455",
                }}
              >
                తెలుగు
              </button>
            </div>
          </div>
        </div>

        {/* Mobile stage strip */}
        <div className="md:hidden overflow-x-auto flex items-center gap-0 bg-[#1b2a41] px-3 py-1.5 shrink-0">
          {STAGES.map((s, i) => {
            const state = stepState(s.key, i);
            const done = state === "done";
            const active = state === "active";
            const skipped = state === "skipped";
            return (
              <div
                key={s.key}
                className="flex items-center shrink-0 pr-4"
                style={{ opacity: active ? 1 : done ? 0.7 : skipped ? 0.3 : 0.4 }}
              >
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold mr-1.5"
                  style={{
                    background: done ? "#a9824f" : active ? "#e7d3ae" : "#33415c",
                    color: done || active ? "#1b2a41" : "#8391aa",
                  }}
                >
                  {i + 1}
                </div>
                <div
                  className="text-[12px] font-medium bf-serif"
                  style={{
                    color: active ? "#ffffff" : done ? "#e7d3ae" : "#8391aa",
                    textDecoration: skipped ? "line-through" : "none",
                  }}
                >
                  {s.label}
                </div>
                {i < STAGES.length - 1 && <span className="text-[#33415c] text-[10px] mx-0.5">›</span>}
              </div>
            );
          })}
        </div>

        {connectionError && (
          <div
            className="px-4 md:px-7 py-3 text-[13px] flex items-center justify-between"
            style={{ background: "#f6e4de", borderBottom: "1px solid #e3bfae", color: "#a3452f" }}
          >
            <span>{connectionError}</span>
            <button
              onClick={() => setConnectionError(null)}
              className="ml-4 flex-none text-[12px] font-semibold underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Transcript */}
        <div className="flex-1 overflow-y-auto py-5 md:py-8" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className="w-full max-w-[700px] mx-auto mb-4 md:mb-5 px-4 md:px-7">
              {m.role === "ASSISTANT" ? (
                <div
                  className="pl-3 md:pl-4 pr-3 md:pr-4 py-3 rounded-r-lg"
                  style={{ borderLeft: "3px solid #a9824f", background: "#fafafa" }}
                >
                  <div className="bf-label text-[10px] mb-1.5 font-semibold" style={{ color: "#a9824f" }}>
                    Assistant note
                  </div>
                  <div
                    className="text-[14px] md:text-[14.5px] leading-relaxed whitespace-pre-wrap"
                    style={{ color: "#1f2430" }}
                  >
                    {renderWithLinks(m.text)}
                  </div>
                </div>
              ) : (
                <div className="flex justify-end">
                  <div
                    className="px-3.5 py-2.5 text-[14px] md:text-[14.5px] leading-relaxed max-w-[85%] md:max-w-[480px] whitespace-pre-wrap text-white"
                    style={{ background: "#1b2a41", borderRadius: "8px 8px 2px 8px" }}
                  >
                    {m.text}
                  </div>
                </div>
              )}
            </div>
          ))}

          {(sending || uploading) && (
            <div className="w-full max-w-[700px] mx-auto mb-5 px-4 md:px-7">
              <div className="pl-3 md:pl-4" style={{ borderLeft: "2.5px solid #ddd2b8" }}>
                <div className="bf-label text-[9.5px] mb-1" style={{ color: "#a39a86" }}>
                  Assistant note
                </div>
                <div className="text-[14px]" style={{ color: "#8c8474" }}>
                  {uploading ? "Verifying documents…" : "Processing your input…"}
                </div>
              </div>
            </div>
          )}

          {/* Final step: login to borrower portal */}
          {isSubmitted && !sending && !uploading && (
            <div className="w-full max-w-[700px] mx-auto mb-5 px-4 md:px-7">
              <div
                className="p-4 md:p-5 rounded-xl flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5"
                style={{ background: "#1b2a41", color: "#ffffff" }}
              >
                <div className="flex-1">
                  <div className="bf-serif text-[16px] font-medium text-[#e7d3ae]">{ui.loginTitle}</div>
                  <div className="text-[13px] mt-1 leading-relaxed" style={{ color: "#c9cfdb" }}>
                    {ui.loginBody}
                  </div>
                </div>
                <a
                  href={BORROWER_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-center px-4 py-2 rounded-lg text-[13px] font-semibold"
                  style={{ background: "#a9824f", color: "#ffffff" }}
                >
                  {ui.loginButton}
                </a>
              </div>
            </div>
          )}

          {/* Declined / closed */}
          {isClosed && !sending && !uploading && (
            <div className="w-full max-w-[700px] mx-auto mb-5 px-4 md:px-7">
              <div
                className="p-4 md:p-5 rounded-xl flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5"
                style={{ background: "#f6e4de", border: "1px solid #e3bfae" }}
              >
                <div className="flex-1">
                  <div className="bf-serif text-[16px] font-medium" style={{ color: "#a3452f" }}>
                    {ui.closedTitle}
                  </div>
                  <div className="text-[13px] mt-1" style={{ color: "#6b6455" }}>
                    {ui.closedBody}
                  </div>
                </div>
                <button
                  onClick={resetChat}
                  className="shrink-0 px-4 py-2 rounded-lg text-[13px] font-semibold text-white"
                  style={{ background: "#1b2a41" }}
                >
                  {ui.newApplication}
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          className="px-4 md:px-7 pb-4 md:pb-6 pt-3 md:pt-4"
          style={{ background: "#ffffff", borderTop: "1px solid #e4e7eb" }}
        >
          <div className="w-full max-w-[700px] mx-auto">
            {pendingFiles.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {pendingFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[12.5px]"
                    style={{ background: "#fafafa", border: "1px solid #ddd2b8", color: "#1b2a41" }}
                  >
                    <FilePreviewThumbnail file={file} />
                    <span className="max-w-[160px] truncate font-medium">{file.name}</span>
                    <button
                      onClick={() => removePendingFile(index)}
                      className="flex-none w-4 h-4 rounded-full flex items-center justify-center hover:bg-[#f0ece0]"
                      style={{ color: "#a3452f" }}
                      title="Remove"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              className="flex items-end gap-2.5 px-3 py-2 rounded-xl transition-shadow"
              style={{
                border: "1.5px solid #d9c9a8",
                background: isClosed ? "#f1f1f1" : "#fafafa",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <button
                onClick={handleFileClick}
                disabled={inputDisabled || isSubmitted}
                title="Attach a document"
                className="flex-none w-8 h-8 rounded flex items-center justify-center bg-white transition-colors disabled:opacity-50"
                style={{ border: "1px solid #ddd2b8", color: "#6b6455" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path
                    d="M21.44 11.05l-9.19 9.19a5 5 0 0 1-7.07-7.07l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,application/pdf,.doc,.docx"
                multiple
                onChange={handleFileChange}
              />

              <textarea
                ref={textareaRef}
                rows={1}
                disabled={isClosed}
                placeholder={isClosed ? ui.closedPlaceholder : ui.placeholder}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  const el = e.target;
                  el.style.height = "auto";
                  el.style.height = Math.min(el.scrollHeight, 160) + "px";
                }}
                onKeyDown={handleKeyDown}
                className="flex-1 resize-none border-none outline-none py-1 text-[14.5px] bg-transparent placeholder:text-[#a3a9b3] disabled:text-[#c2c6cc] overflow-y-auto"
                style={{ maxHeight: "160px", minHeight: "24px" }}
              />

              <button
                onClick={toggleListening}
                disabled={inputDisabled}
                title={isListening ? "Stop listening" : "Voice input"}
                className={`flex-none w-8 h-8 rounded flex items-center justify-center transition-all ${isListening ? "animate-pulse" : "bg-white"} disabled:opacity-50`}
                style={{
                  border: isListening ? "1px solid #ef4444" : "1px solid #ddd2b8",
                  background: isListening ? "#ef4444" : "#ffffff",
                  color: isListening ? "#ffffff" : "#6b6455",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="12" y1="19" x2="12" y2="23" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="8" y1="23" x2="16" y2="23" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <button
                onClick={handleSend}
                disabled={(!inputValue.trim() && pendingFiles.length === 0) || inputDisabled}
                className="flex-none w-8 h-8 rounded flex items-center justify-center text-white transition-colors disabled:opacity-30"
                style={{ background: "#1b2a41" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" strokeLinecap="round" strokeLinejoin="round" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="text-center text-[11px] mt-4 leading-relaxed" style={{ color: "#9aa0aa" }}>
              {ui.disclaimer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}