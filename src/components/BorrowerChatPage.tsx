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

const STAGES = [
  { key: "FRESH", label: "Details", note: "Name · phone · amount" },
  {
    key: "AWAITING_INCOME_PROOF",
    label: "Income proof",
    note: "Payslip / ITR / GST",
  },
  {
    key: "AWAITING_BANK_STATEMENT",
    label: "Bank statement",
    note: "Account activity",
  },
  { key: "AWAITING_ID_PROOF", label: "Identity proof", note: "Aadhar · PAN" },
  { key: "PROCESSED", label: "Assessment", note: "Risk decision" },
] as const;

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

function toMessages(admin: AdminMessage[]): ChatMessage[] {
  const dbMessages = admin
    .filter((m) => m.bfRole !== "SYSTEM")
    .map((m) => ({
      role: m.bfRole as "USER" | "ASSISTANT",
      text: m.bfContent,
    }));
  return [
    {
      role: "ASSISTANT",
      text: "Welcome to OxyLoans Chat AI! How can I help you with your loan application today?",
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

export default function BorrowerChatPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [stage, setStage] = useState<string>("FRESH");
  // Hardcoded welcome message — no backend call on load, session created on first user message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ASSISTANT",
      text: "Welcome to OxyLoans Chat AI! How can I help you with your loan application today?",
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
          formData.append("files", file); // Param name matches backend 'files'
        });
        // bfMessage is optional on the backend — only append it if the user actually typed something.
        if (text) {
          formData.append("bfMessage", text);
        }

        data = await callApi<ChatResponseDTO>(
          `${BASE_URL}/vibecode-service/borrower/chat/upload?bfSessionId=${encodeURIComponent(sessionId!)}`,
          { method: "POST", body: formData },
        );
      } else {
        setSending(true);
        // If no sessionId yet (first ever message), omit bfSessionId — backend creates a new session.
        const chatUrl = sessionId
          ? `${BASE_URL}/vibecode-service/borrower/loan-chat?bfSessionId=${encodeURIComponent(sessionId)}`
          : `${BASE_URL}/vibecode-service/borrower/loan-chat`;
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
          setMessages(toMessages(admin));
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
        .bf-serif { font-family: 'Fraunces', Georgia, serif; }
        .bf-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .bf-label { font-family: 'JetBrains Mono', ui-monospace, monospace; letter-spacing: 0.09em; text-transform: uppercase; }
      `}</style>

      {/* Case-file tab rail */}
      <div
        className="hidden md:flex flex-col w-[236px] flex-none py-8 px-5"
        style={{ background: "#1b2a41" }}
      >
        <div className="bf-serif text-white text-[19px] font-medium mb-0.5">
          OxyLoans
        </div>
        <div
          className="bf-label text-[9.5px] mb-8"
          style={{ color: "#7d8aa3" }}
        >
          Application case file
        </div>

        <div className="flex flex-col gap-1.5">
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
                      color: active ? "#a9824f" : done ? "#c9a06a" : "#5f6d88",
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
        </div>

        {/* Mobile-only horizontal stage progress strip */}
        <div className="md:hidden overflow-x-auto flex items-center gap-0 bg-[#1b2a41] px-3 py-1.5 shrink-0">
          {STAGES.map((s, i) => {
            const done = i < currentStageIndex || isClosed;
            const active = i === currentStageIndex && !isClosed;
            return (
              <div key={s.key} className="flex items-center">
                <div
                  className={`flex flex-col items-center px-2 py-0.5 rounded ${
                    active ? "bg-white/10" : ""
                  }`}
                >
                  <span
                    className={`text-[9px] font-bold ${
                      done
                        ? "text-[#c9a06a]"
                        : active
                          ? "text-white"
                          : "text-[#5f6d88]"
                    }`}
                  >
                    {done ? "✓" : String(i + 1)}
                  </span>
                  <span
                    className={`text-[8.5px] whitespace-nowrap ${
                      active
                        ? "text-white"
                        : done
                          ? "text-[#c9a06a]"
                          : "text-[#5f6d88]"
                    }`}
                  >
                    {s.label}
                  </span>
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
                Let's open your application
              </div>
              <div
                className="text-[13.5px] md:text-[14px] max-w-[420px] leading-relaxed"
                style={{ color: "#6b7280" }}
              >
                Share your details, then your payslip and bank statement, and
                we'll assess your loan. If you've applied before, just give the
                same phone number and we'll pick up where you left off.
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
                  {uploading ? "Reading your document…" : "Preparing a reply…"}
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
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12.5px]"
                    style={{
                      background: "#fafafa",
                      border: "1px solid #ddd2b8",
                      color: "#1b2a41",
                    }}
                  >
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
                onClick={handleSend}
                disabled={
                  (!inputValue.trim() && pendingFiles.length === 0) ||
                  sending ||
                  uploading ||
                  !sessionId ||
                  isClosed
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
                  <path
                    d="M22 2 11 13"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 2 15 22 11 13 2 9 22 2Z"
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
