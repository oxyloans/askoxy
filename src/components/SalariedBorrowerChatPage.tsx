import React, { useState, useRef, useEffect } from "react";
import BASE_URL from "../Config";

interface ChatMessage {
  role: "USER" | "ASSISTANT";
  text: string;
}

interface ChatResponseDTO {
  bfSessionId: string;
  bfReply: string;
  bfStage: string;
}

interface AdminMessage {
  bfRole: "USER" | "ASSISTANT" | "SYSTEM";
  bfContent: string;
}

type Language = "EN" | "TE";

const STAGES = [
  {
    key: "BASIC_DETAILS",
    label: "Details",
    note: "Name · company · salary · bank",
  },
  { key: "PAYSLIP", label: "Payslip", note: "Latest payslip" },
  { key: "BANK_STATEMENT", label: "Bank statement", note: "Recent 3 months" },
  { key: "PAN", label: "PAN Card", note: "Identity card" },
  { key: "AADHAAR", label: "Aadhaar Card", note: "Identity proof" },
  { key: "PRE_APPROVAL", label: "Assessment", note: "Eligibility decision" },
] as const;

const WELCOME_TEXT: Record<Language, string> = {
  EN: `Welcome to OxyLoans Conversation AI. I am here to help you get a loan.

Here is how the loan terms work:
• I can offer a loan of 10 - 20% of your monthly salary.
• Loans are disbursed from the 7th to the 28th of the month.
• Repayment is due on the 30th or 1st of the month (for example, if you take a loan on the 28th, you must repay it on the 30th or 1st).

At the end of our conversation, I will provide a pre-approval and submit your application to my lenders. If you agree, I am happy to help. Let's start by entering your mobile number.`,
  TE: `ఆక్సీలోన్స్ కన్వర్సేషన్ AI‌కి స్వాగతం. మీకు లోన్ పొందడంలో సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను.

లోన్ నిబంధనలు ఎలా పని చేస్తాయో ఇక్కడ ఉంది:
• నేను మీ నెలవారీ జీతంలో 10 - 20% లోన్ అందించగలను.
• లోన్‌లు నెలలో 7వ తేదీ నుండి 28వ తేదీ వరకు మంజూరు చేయబడతాయి.
• తిరిగి చెల్లింపు నెలలో 30వ లేదా 1వ తేదీన చేయాలి (ఉదాహరణకు, మీరు 28వ తేదీన లోన్ తీసుకుంటే, మీరు 30వ లేదా 1వ తేదీన తిరిగి చెల్లించాలి).

మా సంభాషణ చివరిలో, నేను ముందస్తు ఆమోదం అందించి, మీ దరఖాస్తును నా రుణదాతలకు సమర్పిస్తాను. మీరు అంగీకరిస్తే, నేను సహాయం చేయడానికి సంతోషిస్తాను. మీ మొబైల్ నంబర్‌ను నమోదు చేయడం ద్వారా ప్రారంభిద్దాం.`,
};

function stageIndex(stage: string): number {
  const i = STAGES.findIndex((s) => s.key === stage);
  return i === -1 ? (stage === "CLOSED" ? STAGES.length : 0) : i;
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
      throw new Error(
        "Session validation failed. Please refresh the page to start a new chat.",
      );
    } else if (res.status === 404) {
      throw new Error(
        "The requested chat service could not be found. Please try again later.",
      );
    } else {
      throw new Error(
        "We are currently facing an issue processing your request. Please try again in a few moments.",
      );
    }
  }
  if (!raw) throw new Error("The server responded with an empty response.");

  try {
    return JSON.parse(raw) as T;
  } catch {
    console.error(`API ${url} returned non-JSON body:`, raw);
    throw new Error(
      "Received an invalid response from the server. Please try again shortly.",
    );
  }
}

function toMessages(admin: AdminMessage[], language: Language): ChatMessage[] {
  const dbMessages = admin
    .filter((m) => m.bfRole !== "SYSTEM")
    .map((m) => ({
      role: m.bfRole as "USER" | "ASSISTANT",
      text: m.bfContent,
    }));
  return [
    {
      role: "ASSISTANT",
      text: WELCOME_TEXT[language],
    },
    ...dbMessages,
  ];
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

  const isPdf =
    file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
  const isDoc =
    file.name.toLowerCase().endsWith(".doc") ||
    file.name.toLowerCase().endsWith(".docx");

  return (
    <div
      className="w-10 h-10 rounded flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-wider shrink-0"
      style={{
        background: isPdf ? "#e1523f" : isDoc ? "#4682b4" : "#a9824f",
      }}
    >
      {isPdf ? "PDF" : isDoc ? "DOC" : "FILE"}
    </div>
  );
}

export default function SalariedBorrowerChatPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [stage, setStage] = useState<string>("BASIC_DETAILS");
  const [language, setLanguage] = useState<Language>("EN");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ASSISTANT",
      text: WELCOME_TEXT.EN,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Keep the welcome/start message in sync with the selected language.
  // Only the first message (the assistant's opening greeting) is translated;
  // subsequent conversation turns are left as returned by the backend.
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 0 || prev[0].role !== "ASSISTANT") return prev;
      const isWelcomeMessage =
        prev[0].text === WELCOME_TEXT.EN || prev[0].text === WELCOME_TEXT.TE;
      if (!isWelcomeMessage) return prev;
      const updated = [...prev];
      updated[0] = { role: "ASSISTANT", text: WELCOME_TEXT[language] };
      return updated;
    });
  }, [language]);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

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
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    const text = inputValue.trim();

    if ((!text && pendingFiles.length === 0) || sending || uploading) return;
    if (pendingFiles.length > 0 && !sessionId) {
      setConnectionError(
        "Please send a text message first before uploading a file.",
      );
      return;
    }

    const filesToSend = [...pendingFiles];

    setMessages((prev) => [
      ...prev,
      ...filesToSend.map((file) => ({
        role: "USER" as const,
        text: `Attached: ${file.name}`,
      })),
      ...(text ? [{ role: "USER" as const, text }] : []),
    ]);

    setInputValue("");
    setPendingFiles([]);
    resetTextareaHeight();
    setConnectionError(null);

    try {
      let data: ChatResponseDTO;

      if (filesToSend.length > 0) {
        setUploading(true);
        const formData = new FormData();
        filesToSend.forEach((file) => {
          formData.append("files", file);
        });
        if (text) {
          formData.append("bfMessage", text);
        }

        data = await callApi<ChatResponseDTO>(
          `${BASE_URL}/vibecode-service/borrower/chat/upload?bfSessionId=${encodeURIComponent(sessionId!)}`,
          { method: "POST", body: formData },
        );
      } else {
        setSending(true);
        const chatUrl = sessionId
          ? `${BASE_URL}/vibecode-service/borrower/loan-chat?bfSessionId=${encodeURIComponent(sessionId)}&chatType=SALARIED`
          : `${BASE_URL}/vibecode-service/borrower/loan-chat?chatType=SALARIED`;
        data = await callApi<ChatResponseDTO>(chatUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bfMessage: text }),
        });
      }

      setStage(data.bfStage);

      if (data.bfSessionId !== sessionId) {
        setSessionId(data.bfSessionId);
        try {
          const admin = await callApi<AdminMessage[]>(
            `${BASE_URL}/vibecode-service/borrower/admin/sessions/${data.bfSessionId}/messages`,
          );
          setMessages(toMessages(admin, language));
        } catch {
          setMessages((prev) => [
            ...prev,
            { role: "ASSISTANT", text: data.bfReply },
          ]);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "ASSISTANT", text: data.bfReply },
        ]);
      }
    } catch (err) {
      const errMsg =
        (err as Error).message ||
        "We are currently facing an issue processing your request. Please try again.";
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

    const filesArray = Array.from(selectedFiles); // snapshot NOW, while the FileList is still live

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
  const isClosed = stage === "CLOSED";

  return (
    <div
      className="flex h-screen w-full"
      style={{
        background: "#f4f5f7",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
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

      {/* Sidebar: hidden on mobile, 280px on desktop */}
      <div
        className="hidden md:flex md:flex-col w-[280px] shrink-0 p-6 text-white justify-between"
        style={{ background: "#1b2a41" }}
      >
        <div className="flex flex-col gap-6 min-h-0">
          <div className="flex flex-col">
            <span className="bf-serif text-[24px] font-semibold text-[#e7d3ae]">
              OxyLoans
            </span>
            <span
              className="bf-label text-[10px] tracking-[0.2em] font-semibold mt-1"
              style={{ color: "#a39a86" }}
            >
              Salaried Flow
            </span>
          </div>

          {/* Progress strip */}
          <div className="flex flex-col gap-2 overflow-y-auto">
            {STAGES.map((s, i) => {
              const done = i < currentStageIndex || isClosed;
              const active = i === currentStageIndex && !isClosed;

              return (
                <div
                  key={s.key}
                  className="relative px-3 py-2.5 transition-all"
                  style={{
                    background: active ? "#eef1f5" : "rgba(255,255,255,0.04)",
                    borderRadius: "3px 10px 10px 3px",
                    transform: active ? "translateX(6px)" : "none",
                    borderLeft: `3px solid ${
                      done ? "#a9824f" : active ? "#a9824f" : "#33415c"
                    }`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Number */}
                    <div
                      className="bf-label text-[10px] font-semibold min-w-[24px]"
                      style={{
                        color: active
                          ? "#a9824f"
                          : done
                            ? "#c9a06a"
                            : "#5f6d88",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                      <div
                        className="flex items-center gap-2 bf-serif text-[14px] font-medium"
                        style={{
                          color: active
                            ? "#1b2a41"
                            : done
                              ? "#e7d3ae"
                              : "#8391aa",
                        }}
                      >
                        {done && (
                          <span style={{ color: "#3f7a5c", fontSize: "10px" }}>
                            ●
                          </span>
                        )}
                        {s.label}
                      </div>

                      <div
                        className="text-[11px] mt-0.5"
                        style={{
                          color: active ? "#6b6455" : "#5f6d88",
                        }}
                      >
                        {s.note}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {sessionId && (
          <div
            className="mt-auto pt-6"
            style={{ borderTop: "1px solid #33415c" }}
          >
            <div
              className="bf-label text-[9px] mb-1"
              style={{ color: "#5f6d88" }}
            >
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
            <div
              className="bf-serif text-[16px] font-medium md:hidden"
              style={{ color: "#1b2a41" }}
            >
              OxyLoans
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block w-[6px] h-[6px] rounded-full"
                style={{ background: connectionError ? "#a3452f" : "#3f7a5c" }}
              />
              <span className="text-[12px]" style={{ color: "#6b6455" }}>
                {connectionError
                  ? "Connection issue"
                  : (STAGES.find((s) => s.key === stage)?.label ??
                    (isClosed ? "Closed" : stage))}
              </span>
            </div>
          </div>

          {/* Language toggle */}
          <div
            className="flex items-center rounded-lg overflow-hidden shrink-0"
            style={{ border: "1px solid #ddd2b8" }}
          >
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

        {/* Mobile-only horizontal stage progress strip */}
        <div className="md:hidden overflow-x-auto flex items-center gap-0 bg-[#1b2a41] px-3 py-1.5 shrink-0">
          {STAGES.map((s, i) => {
            const done = i < currentStageIndex || isClosed;
            const active = i === currentStageIndex && !isClosed;

            return (
              <div
                key={s.key}
                className="flex items-center shrink-0 pr-4"
                style={{ opacity: active ? 1 : done ? 0.7 : 0.4 }}
              >
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold mr-1.5"
                  style={{
                    background: done
                      ? "#a9824f"
                      : active
                        ? "#e7d3ae"
                        : "#33415c",
                    color: done || active ? "#1b2a41" : "#8391aa",
                  }}
                >
                  {i + 1}
                </div>
                <div
                  className="text-[12px] font-medium bf-serif"
                  style={{
                    color: active ? "#ffffff" : done ? "#e7d3ae" : "#8391aa",
                  }}
                >
                  {s.label}
                </div>
                {i < STAGES.length - 1 && (
                  <span className="text-[#33415c] text-[10px] mx-0.5">›</span>
                )}
              </div>
            );
          })}
        </div>

        {connectionError && (
          <div
            className="px-4 md:px-7 py-3 text-[13px] flex items-center justify-between"
            style={{
              background: "#f6e4de",
              borderBottom: "1px solid #e3bfae",
              color: "#a3452f",
            }}
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
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 px-4 md:px-6 text-center">
              <div
                className="bf-serif text-[20px] md:text-[22px] font-medium"
                style={{ color: "#1b2a41" }}
              >
                Salaried Loan Application
              </div>
              <div
                className="text-[13.5px] md:text-[14px] max-w-[420px] leading-relaxed"
                style={{ color: "#6b7280" }}
              >
                Read and accept terms, enter basic details, then upload your
                payslip, statement, and identity cards to verify.
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className="w-full max-w-[700px] mx-auto mb-4 md:mb-5 px-4 md:px-7"
              >
                {m.role === "ASSISTANT" ? (
                  <div
                    className="pl-3 md:pl-4 pr-3 md:pr-4 py-3 rounded-r-lg"
                    style={{
                      borderLeft: "3px solid #a9824f",
                      background: "#fafafa",
                    }}
                  >
                    <div
                      className="bf-label text-[10px] mb-1.5 font-semibold"
                      style={{ color: "#a9824f" }}
                    >
                      Assistant note
                    </div>
                    <div
                      className="text-[14px] md:text-[14.5px] leading-relaxed whitespace-pre-wrap"
                      style={{ color: "#1f2430" }}
                    >
                      {m.text}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <div
                      className="px-3.5 py-2.5 text-[14px] md:text-[14.5px] leading-relaxed max-w-[85%] md:max-w-[480px] whitespace-pre-wrap text-white"
                      style={{
                        background: "#1b2a41",
                        borderRadius: "8px 8px 2px 8px",
                      }}
                    >
                      {m.text}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          {(sending || uploading) && (
            <div className="w-full max-w-[700px] mx-auto mb-5 px-4 md:px-7">
              <div
                className="pl-3 md:pl-4"
                style={{ borderLeft: "2.5px solid #ddd2b8" }}
              >
                <div
                  className="bf-label text-[9.5px] mb-1"
                  style={{ color: "#a39a86" }}
                >
                  Assistant note
                </div>
                <div className="text-[14px]" style={{ color: "#8c8474" }}>
                  {uploading
                    ? "Verifying documents…"
                    : "Processing your input…"}
                </div>
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
                    style={{
                      background: "#fafafa",
                      border: "1px solid #ddd2b8",
                      color: "#1b2a41",
                    }}
                  >
                    <FilePreviewThumbnail file={file} />
                    <span className="max-w-[160px] truncate font-medium">
                      {file.name}
                    </span>
                    <button
                      onClick={() => removePendingFile(index)}
                      className="flex-none w-4 h-4 rounded-full flex items-center justify-center hover:bg-[#f0ece0]"
                      style={{ color: "#a3452f" }}
                      title="Remove"
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path
                          d="M18 6 6 18M6 6l12 12"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              className="flex items-end gap-2.5 px-3 py-2 rounded-xl transition-shadow"
              style={{
                border: `1.5px solid ${isClosed ? "#e4e7eb" : "#d9c9a8"}`,
                background: "#fafafa",
                boxShadow: isClosed ? "none" : "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <button
                onClick={handleFileClick}
                disabled={sending || uploading || !sessionId || isClosed}
                title="Attach a document"
                className="flex-none w-8 h-8 rounded flex items-center justify-center bg-white transition-colors disabled:opacity-50"
                style={{ border: "1px solid #ddd2b8", color: "#6b6455" }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
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
                placeholder={
                  isClosed ? "This application is closed." : "Type your reply…"
                }
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  const el = e.target;
                  el.style.height = "auto";
                  el.style.height = Math.min(el.scrollHeight, 160) + "px";
                }}
                onKeyDown={handleKeyDown}
                disabled={isClosed}
                className="flex-1 resize-none border-none outline-none py-1 text-[14.5px] bg-transparent placeholder:text-[#a3a9b3] disabled:text-[#c2c6cc] overflow-y-auto"
                style={{ maxHeight: "160px", minHeight: "24px" }}
              />

              <button
                onClick={toggleListening}
                disabled={sending || uploading || isClosed}
                title={isListening ? "Stop listening" : "Voice input"}
                className={`flex-none w-8 h-8 rounded flex items-center justify-center transition-all ${
                  isListening ? "animate-pulse" : "bg-white"
                } disabled:opacity-50`}
                style={{
                  border: isListening ? "1px solid #ef4444" : "1px solid #ddd2b8",
                  background: isListening ? "#ef4444" : "#ffffff",
                  color: isListening ? "#ffffff" : "#6b6455",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 10v2a7 7 0 0 1-14 0v-2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line x1="12" y1="19" x2="12" y2="23" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="8" y1="23" x2="16" y2="23" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <button
                onClick={handleSend}
                disabled={
                  (!inputValue.trim() && pendingFiles.length === 0) ||
                  sending ||
                  uploading 
                }
                className="flex-none w-8 h-8 rounded flex items-center justify-center text-white transition-colors disabled:opacity-30"
                style={{ background: "#1b2a41" }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line
                    x1="22"
                    y1="2"
                    x2="11"
                    y2="13"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polygon
                    points="22 2 15 22 11 13 2 9 22 2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div
              className="text-center text-[11px] mt-4 leading-relaxed"
              style={{ color: "#9aa0aa" }}
            >
              Responses may contain mistakes. Please verify important financial
              information.
              <br />
              Loan requests up to ₹10L are processed directly by OxyLoans.
              Requests above ₹10L are shared with our lending partners, who will
              review and take the final decision.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}