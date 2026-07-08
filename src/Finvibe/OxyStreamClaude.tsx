import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type React from "react";
import BASE_URL from "../Config";
import { notification } from "antd";
import {
  AudioOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PauseOutlined,
  PlusOutlined,
} from "@ant-design/icons";

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
  fileNames?: string[];
  timestamp: Date;
}

interface AttachedFile {
  raw: File;
  name: string;
  size: number;
  isImage: boolean;
}

interface Session {
  id: number;
  userId: string;
  sessionId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastProvider: string;
  lastModel: string;
}

// Dedicated streaming backend — separate host from the standard Config BASE_URL.
const STREAM_API_BASE = "https://meta.oxyloans.com/api";
const SESSION_CHAT_STREAM_URL = `${STREAM_API_BASE}/vibecode-service/claude/session/chat/stream`;

const FILE_URL = `${BASE_URL}/vibecode-service/claude/chat/files`;
const SESSIONS_URL = (userId: string) =>
  `${STREAM_API_BASE}/vibecode-service/claude/sessions/${userId}`;
const HISTORY_URL = (sessionId: string) =>
  `${STREAM_API_BASE}/vibecode-service/claude/history/${sessionId}`;
const KNOWLEDGE_BASE_URL = `${BASE_URL}/ai-automation/add-to-clone`;

const CLAUDE_MODELS = [
  // ==========================
  // Anthropic Claude Models
  // ==========================
  {
    id: "claude-opus-4-6",
    label: "Claude Opus 4.6",
    desc: "Most capable",
    provider: "Claude",
    apiProvider: "CLAUDE",
  },
  {
    id: "claude-sonnet-4-6",
    label: "Claude Sonnet 4.6",
    desc: "Balanced",
    provider: "Claude",
    apiProvider: "CLAUDE",
  },
  {
    id: "claude-haiku-4-5",
    label: "Claude Haiku 4.5",
    desc: "Fast & low cost",
    provider: "Claude",
    apiProvider: "CLAUDE",
  },

  // ==========================
  // OpenAI Models
  // ==========================
  {
    id: "gpt-5.5",
    label: "GPT-5.5",
    desc: "Most capable",
    provider: "OpenAI",
    apiProvider: "OPENAI",
  },
  {
    id: "gpt-5.4-mini",
    label: "GPT-5.4 Mini",
    desc: "Fast streaming",
    provider: "OpenAI",
    apiProvider: "OPENAI",
  },
  {
    id: "gpt-5",
    label: "GPT-5",
    desc: "Advanced reasoning",
    provider: "OpenAI",
    apiProvider: "OPENAI",
  },
  {
    id: "gpt-5-mini",
    label: "GPT-5 Mini",
    desc: "Fast & smart",
    provider: "OpenAI",
    apiProvider: "OPENAI",
  },
  {
    id: "gpt-5-nano",
    label: "GPT-5 Nano",
    desc: "Lowest cost",
    provider: "OpenAI",
    apiProvider: "OPENAI",
  },
  {
    id: "gpt-4o",
    label: "GPT-4o",
    desc: "Multimodal flagship",
    provider: "OpenAI",
    apiProvider: "OPENAI",
  },
  {
    id: "gpt-4o-mini",
    label: "GPT-4o Mini",
    desc: "Fast & efficient",
    provider: "OpenAI",
    apiProvider: "OPENAI",
  },
];

const uid = () => Math.random().toString(36).slice(2, 9);
const fmtTime = (d: Date) =>
  d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
const fmtBytes = (b: number) =>
  b < 1024
    ? `${b} B`
    : b < 1048576
      ? `${(b / 1024).toFixed(1)} KB`
      : `${(b / 1048576).toFixed(1)} MB`;

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getUserId(): string {
  return localStorage.getItem("userId") ?? "";
}
function getDisplayName(): string {
  try {
    const raw = localStorage.getItem("profileData");
    if (!raw) return "Guest User";
    const profile = JSON.parse(raw);
    const first = profile.userFirstName ?? "";
    const last = profile.userLastName ?? "";
    const full = `${first} ${last}`.trim();
    return full || "Guest User";
  } catch {
    return "Guest User";
  }
}

// The backend streams one word/token per chunk with no spacing info at all,
// so the client has to re-insert it — but blindly adding a space between
// every chunk pads spaces around code punctuation ("main ( args )") and,
// worse, can split a "```" fence marker across chunks so the code-block
// detection in MarkdownContent never sees it. These chars glue directly to
// their neighbor instead of getting a forced space.
const GLUE_BEFORE = /^[)\]}.,;:!?'"`’”(\[*]/; // never a space before these
const GLUE_AFTER = /[([{'"`“‘*]/; // never a space after these

// A "```" fence toggles code mode on/off; inside it, dotted access
// (org.springframework.Foo) never gets a space, capitalized or not.
function isInsideCodeFence(text: string): boolean {
  const fences = text.match(/```/g);
  return !!fences && fences.length % 2 === 1;
}

function appendStreamChunk(existing: string, chunk: string): string {
  if (!chunk) return existing;
  if (!existing) return chunk;
  if (/\s$/.test(existing) || /^\s/.test(chunk)) return existing + chunk;

  const prevChar = existing[existing.length - 1];
  const nextChar = chunk[0];

  if (GLUE_BEFORE.test(nextChar)) return existing + chunk;
  if (GLUE_AFTER.test(prevChar)) return existing + chunk;
  if (prevChar === ".") {
    // "com.example" / "3.14" read as one token; "overview. Next" is a new
    // sentence — a lowercase/digit right after "." tells them apart outside
    // code, but inside a fence dotted access is always glued (Foo.Bar()).
    if (isInsideCodeFence(existing) || /^[a-z0-9]/.test(chunk)) {
      return existing + chunk;
    }
  }

  return `${existing} ${chunk}`;
}

function generateSessionId(userId: string): string {
  return `${userId || "guest"}-${Date.now().toString(36)}-${uid()}`;
}

interface StreamCallbacks {
  onChunk: (text: string) => void;
  onSessionId?: (sessionId: string) => void;
}

// Consumes the chat stream response body chunk-by-chunk. Handles both plain
// chunked text (append as-is) and text/event-stream framing ("data: ..." lines
// separated by a blank line), since the backend's exact framing isn't fixed.
async function streamSessionChat(
  userId: string,
  message: string,
  model: string,
  provider: string,
  sessionId: string,
  webSearch: boolean,
  signal: AbortSignal,
  { onChunk, onSessionId }: StreamCallbacks,
): Promise<void> {
  const res = await fetch(SESSION_CHAT_STREAM_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream, text/plain, */*",
    },
    body: JSON.stringify({ sessionId, userId, provider, model, message, webSearch }),
    signal,
  });

  if (!res.ok || !res.body) throw new Error(`Server error ${res.status}`);

  const headerSessionId =
    res.headers.get("x-session-id") || res.headers.get("X-Session-Id");
  if (headerSessionId) onSessionId?.(headerSessionId);

  const contentType = res.headers.get("content-type") || "";
  const isSSE = contentType.includes("text/event-stream");

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  const handleSSEFrame = (frame: string) => {
    const dataLines = frame
      .split("\n")
      .filter((l) => l.startsWith("data:"))
      .map((l) => {
        // Strip only the single mandatory SSE separator space after the
        // colon — a further leading space is part of the token itself
        // (e.g. word-piece streaming sends " pipeline", " combines", ...).
        const rest = l.slice(5);
        return rest.startsWith(" ") ? rest.slice(1) : rest;
      });
    if (dataLines.length === 0) return;
    const payload = dataLines.join("\n");
    if (!payload || payload === "[DONE]") return;

    try {
      const parsed = JSON.parse(payload);
      if (typeof parsed === "string") {
        onChunk(parsed);
      } else if (parsed && typeof parsed === "object") {
        if (typeof parsed.sessionId === "string") onSessionId?.(parsed.sessionId);
        const text =
          parsed.content ?? parsed.delta ?? parsed.token ?? parsed.text ?? "";
        if (text) onChunk(text);
      }
    } catch {
      onChunk(payload);
    }
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunkText = decoder.decode(value, { stream: true });

    if (!isSSE) {
      onChunk(chunkText);
      continue;
    }

    buffer += chunkText;
    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";
    frames.forEach(handleSSEFrame);
  }

  if (isSSE && buffer.trim()) handleSSEFrame(buffer);
}

async function callChatWithFiles(
  files: File[],
  message: string,
  model: string,
  provider: string,
  sessionId: string | null,
  userId: string,
  webSearch: boolean,
  signal: AbortSignal,
): Promise<{ sessionId: string; response: string }> {
  const accessToken = localStorage.getItem("accessToken") ?? "";
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  form.append("message", message);
  form.append("provider", provider);
  form.append("userId", userId);
  form.append("webSearch", String(webSearch));
  if (sessionId) form.append("sessionId", sessionId);

  const res = await fetch(`${FILE_URL}?model=${encodeURIComponent(model)}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: form,
    signal,
  });
  if (!res.ok) throw new Error(`Server error ${res.status}`);
  const json = await res.json();
  return { sessionId: json.sessionId, response: json.response ?? "" };
}

async function fetchSessions(userId: string): Promise<Session[]> {
  try {
    const res = await fetch(SESSIONS_URL(userId), {
      headers: { accept: "*/*" },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function fetchHistory(sessionId: string): Promise<Message[]> {
  try {
    const res = await fetch(HISTORY_URL(sessionId), {
      headers: { accept: "*/*" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.messages || []).map((m: any) => ({
      id: String(m.id),
      role: m.role as Role,
      content: m.content,
      timestamp: new Date(m.createdAt),
    }));
  } catch {
    return [];
  }
}

async function addToKnowledgeBase(
  content: string,
  messageId: string,
): Promise<boolean> {
  try {
    const accessToken = localStorage.getItem("accessToken") ?? "";
    const res = await fetch(KNOWLEDGE_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        entityId: messageId,
        entityType: "OXYGPT",
        editedContent: content,
        confirmed: true,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ── Loader ────────────────────────────────────────────────────────────────────
function ThinkingLoader() {
  return (
    <div className="flex gap-3 items-start max-w-3xl mx-auto w-full px-4">
      <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold bg-gradient-to-br from-violet-600 to-violet-800">
        AI
      </div>
      <div className="flex items-center gap-2 py-2">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full animate-bounce bg-violet-500"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <span className="text-xs text-violet-500">Thinking…</span>
      </div>
    </div>
  );
}

// ── Markdown ──────────────────────────────────────────────────────────────────
function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0,
    m: RegExpExecArray | null,
    key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const raw = m[0];
    if (raw.startsWith("`"))
      parts.push(
        <code
          key={key++}
          className="rounded px-1.5 py-0.5 text-[12px] font-mono bg-violet-100 text-violet-700 border border-violet-200"
        >
          {raw.slice(1, -1)}
        </code>,
      );
    else if (raw.startsWith("**"))
      parts.push(
        <strong key={key++} className="font-semibold text-slate-800">
          {raw.slice(2, -2)}
        </strong>,
      );
    else if (raw.startsWith("*"))
      parts.push(
        <em key={key++} className="italic text-slate-600">
          {raw.slice(1, -1)}
        </em>,
      );
    else if (raw.startsWith("["))
      parts.push(
        <a
          key={key++}
          href={m[3]}
          target="_blank"
          rel="noreferrer"
          className="underline text-violet-600 hover:text-violet-800 transition-colors"
        >
          {m[2]}
        </a>,
      );
    last = m.index + raw.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

// ── Table Markdown ────────────────────────────────────────────────────────────
function MarkdownTable({ rows }: { rows: string[] }) {
  if (rows.length < 2) return null;

  const parseRow = (row: string) =>
    row
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c !== "");

  const headerCells = parseRow(rows[0]);
  // rows[1] is the separator line (--- | --- | ---)
  const bodyRows = rows.slice(2).map(parseRow);

  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full text-[12.5px] border-collapse">
        <thead>
          <tr className="bg-violet-50">
            {headerCells.map((cell, i) => (
              <th
                key={i}
                className="px-4 py-2.5 text-left font-semibold text-violet-800 border-b border-violet-200 whitespace-nowrap"
              >
                {renderInline(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-slate-50"}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-4 py-2.5 text-slate-700 border-b border-slate-100 align-top"
                >
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CodeCopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(code).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className="text-violet-400 hover:text-violet-700 transition-colors normal-case tracking-normal font-sans"
    >
      {copied ? "✓ Copied!" : "Copy"}
    </button>
  );
}

function MarkdownContent({
  content,
  isUser = false,
}: {
  content: string;
  isUser?: boolean;
}) {
  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Blank line
    if (trimmed === "") {
      nodes.push(<div key={`bl-${i}`} className="h-2" />);
      i++;
      continue;
    }

    // Fenced code block
    if (trimmed.startsWith("```")) {
      const lang = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      nodes.push(
        <div
          key={`code-${i}`}
          className="my-4 rounded-xl overflow-hidden border border-violet-200 shadow-sm"
        >
          {lang && (
            <div className="px-4 py-1.5 text-[10px] border-b border-violet-200 bg-violet-50 text-violet-600 font-mono font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>{lang}</span>

              <CodeCopyButton code={codeLines.join("\n")} />
            </div>
          )}
          <pre className="text-[12px] font-mono p-4 overflow-x-auto leading-relaxed bg-slate-900 text-slate-100">
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>,
      );
      i++;
      continue;
    }

    // Table detection: line contains | and next line is separator
    if (
      trimmed.includes("|") &&
      i + 1 < lines.length &&
      /^\|?[\s\-:]+(\|[\s\-:]+)+\|?$/.test(lines[i + 1].trim())
    ) {
      const tableRows: string[] = [];
      while (i < lines.length && lines[i].trim().includes("|")) {
        tableRows.push(lines[i]);
        i++;
      }
      nodes.push(<MarkdownTable key={`tbl-${i}`} rows={tableRows} />);
      continue;
    }

    // Headings
    const hMatch = trimmed.match(/^(#{1,4})\s+(.+)/);
    if (hMatch) {
      const level = hMatch[1].length;
      const sizes = [
        "text-[18px]",
        "text-[16px]",
        "text-[14px]",
        "text-[13px]",
      ];
      nodes.push(
        <p
          key={`h-${i}`}
          className={`font-bold mt-4 mb-1 text-slate-800 ${sizes[level - 1]}`}
        >
          {renderInline(hMatch[2])}
        </p>,
      );
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
      nodes.push(<hr key={`hr-${i}`} className="my-3 border-slate-200" />);
      i++;
      continue;
    }

    // Unordered list
    if (/^[-*+]\s/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s/.test(lines[i].trim())) {
        items.push(lines[i].replace(/^[-*+]\s+/, ""));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} className="pl-1 space-y-1.5 my-2">
          {items.map((it, idx) => (
            <li
              key={idx}
              className="flex gap-2 text-[13.5px] text-slate-700 leading-relaxed"
            >
              <span className="text-violet-400 flex-shrink-0 mt-0.5">•</span>
              <span>{renderInline(it)}</span>
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(trimmed)) {
      const items: string[] = [];
      let startNum = parseInt(trimmed.match(/^(\d+)\./)?.[1] || "1", 10);
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      nodes.push(
        <ol key={`ol-${i}`} className="pl-1 space-y-1.5 my-2" start={startNum}>
          {items.map((it, idx) => (
            <li
              key={idx}
              className="flex gap-2 text-[13.5px] text-slate-700 leading-relaxed"
            >
              <span className="text-violet-500 font-semibold flex-shrink-0 min-w-[1.25rem]">
                {startNum + idx}.
              </span>
              <span>{renderInline(it)}</span>
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    // Blockquote
    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      nodes.push(
        <blockquote
          key={`bq-${i}`}
          className="my-3 pl-4 border-l-[3px] border-violet-300 bg-violet-50/50 py-2 pr-3 rounded-r-lg"
        >
          {quoteLines.map((ql, qi) => (
            <p
              key={qi}
              className="text-[13px] text-slate-600 italic leading-relaxed"
            >
              {renderInline(ql)}
            </p>
          ))}
        </blockquote>,
      );
      continue;
    }

    // Paragraph
    nodes.push(
      <p
        key={`p-${i}`}
        className="text-[13.5px] leading-relaxed text-slate-700"
      >
        {renderInline(trimmed)}
      </p>,
    );
    i++;
  }

  return <div className="space-y-1">{nodes}</div>;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 hover:bg-slate-200 hover:text-slate-800 transition-all"
    >
      {copied ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      )}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function KBButton({
  content,
  messageId,
}: {
  content: string;
  messageId: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const handle = async () => {
    setStatus("loading");
    const ok = await addToKnowledgeBase(content, messageId);
    if (ok) {
      setStatus("idle");
      notification.success({
        message: "Saved to RadhAI",
        description: "Response added to Radha-AI knowledge base successfully.",
        placement: "topRight",
        duration: 0,
      });
    } else {
      setStatus("error");
      notification.error({
        message: "Failed to Save",
        description:
          "Could not add to Radha-AI knowledge base. Please try again.",
        placement: "topRight",
        duration: 0,
      });
      setTimeout(() => setStatus("idle"), 2000);
    }
  };
  return (
    <button
      onClick={handle}
      disabled={status === "loading"}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all disabled:opacity-50 ${
        status === "error"
          ? "text-red-600 bg-red-50 border-red-200 hover:bg-red-100"
          : "text-violet-700 bg-violet-100 border-violet-300 hover:bg-violet-200"
      }`}
      title="Move to Radha Knowledge Base"
    >
      {status === "loading" ? (
        <svg
          className="animate-spin"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
          <path d="M12 2a10 10 0 0110 10" />
        </svg>
      ) : (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
          <line x1="12" y1="8" x2="12" y2="14" />
          <line x1="9" y1="11" x2="15" y2="11" />
        </svg>
      )}
      {status === "error" ? "Failed" : "Move to RadhAI"}
    </button>
  );
}

function MessageBubble({
  msg,
  isStreaming = false,
}: {
  msg: Message;
  isStreaming?: boolean;
}) {
  const isUser = msg.role === "user";
  return (
    <div
      className={`flex gap-3 group max-w-3xl mx-auto w-full px-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5 bg-gradient-to-br ${isUser ? "from-violet-600 to-violet-900" : "from-violet-500 to-violet-700"}`}
      >
        {isUser ? "U" : "AI"}
      </div>
      <div
        className={`flex flex-col gap-1 ${isUser ? "items-end max-w-[75%]" : "items-start flex-1 min-w-0"}`}
      >
        {msg.fileNames && msg.fileNames.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1">
            {msg.fileNames.map((name, i) => (
              <span
                key={i}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200"
              >
                📎 {name}
              </span>
            ))}
          </div>
        )}

        {isUser ? (
          /* User message: styled bubble */
          <div className="border border-violet-300 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-full bg-white">
            <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap break-words text-slate-800">
              {msg.content}
            </p>
          </div>
        ) : (
          /* Assistant message: full markdown */
          <div className="w-full min-w-0 overflow-x-hidden">
            <MarkdownContent content={msg.content} />
            {isStreaming && (
              <span className="inline-block w-[7px] h-[14px] ml-0.5 align-middle bg-violet-400 animate-pulse rounded-sm" />
            )}
          </div>
        )}

        <div
          className={`flex items-center gap-1 ${isUser ? "self-end" : "self-start"}`}
        >
          <span className="text-[10px] text-slate-400">
            {fmtTime(msg.timestamp)}
          </span>
          {!isStreaming && <CopyButton text={msg.content} />}
          {!isUser && !isStreaming && (
            <KBButton content={msg.content} messageId={msg.id} />
          )}
        </div>
      </div>
    </div>
  );
}

function FileChip({
  file,
  onRemove,
}: {
  file: AttachedFile;
  onRemove: () => void;
}) {
  const isImage = file.raw.type.startsWith("image/");
  const isExcel = file.name.endsWith(".xls") || file.name.endsWith(".xlsx");
  const isPdf = file.raw.type === "application/pdf";
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs max-w-[240px] bg-violet-100 border border-violet-200 text-violet-700">
      <span>{isImage ? "🖼️" : isExcel ? "📊" : isPdf ? "📄" : "📁"}</span>
      <span className="truncate font-medium">{file.name}</span>
      <span className="text-violet-400 flex-shrink-0">
        {fmtBytes(file.size)}
      </span>
      <button
        onClick={onRemove}
        className="ml-0.5 hover:text-red-500 text-violet-400"
      >
        ✕
      </button>
    </div>
  );
}

function useVoiceRecorder(onResult: (text: string) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const finalTextRef = useRef("");
  const shouldRestartRef = useRef(false);

  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    setIsSupported(!!SR);
  }, []);

  const createRecognition = useCallback(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) return null;
    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-IN"; // better match for Indian English accents than en-US
    r.maxAlternatives = 1;

    r.onresult = (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalTextRef.current += t + " ";
        else interim = t;
      }
      onResult((finalTextRef.current + interim).trimStart());
    };

    r.onerror = (e: any) => {
      // 'no-speech' and 'aborted' fire often on silence — don't treat as fatal
      if (e.error === "no-speech" || e.error === "aborted") return;
      shouldRestartRef.current = false;
      setIsRecording(false);
    };

    // Auto-restart on silence timeout (Chrome stops after ~5-10s of quiet)
    r.onend = () => {
      if (shouldRestartRef.current) {
        try {
          r.start();
        } catch {
          setIsRecording(false);
        }
      } else {
        setIsRecording(false);
      }
    };

    return r;
  }, [onResult]);

  const startRecording = useCallback(() => {
    finalTextRef.current = "";
    const r = createRecognition();
    if (!r) return;
    recognitionRef.current = r;
    shouldRestartRef.current = true;
    try {
      r.start();
      setIsRecording(true);
    } catch {
      setIsRecording(false);
    }
  }, [createRecognition]);

  const stopRecording = useCallback(() => {
    shouldRestartRef.current = false;
    recognitionRef.current?.stop();
    setIsRecording(false);
  }, []);

  return { isRecording, isSupported, startRecording, stopRecording };
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({
  sessions,
  activeSessionId,
  onNewChat,
  onSelectSession,
  isOpen,
  onToggle,
  userId,
}: {
  sessions: Session[];
  activeSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (s: Session) => void;
  isOpen: boolean;
  onToggle: () => void;
  userId: string;
}) {
  const lastFour = userId.slice(-4).toUpperCase();
  const displayName = getDisplayName();
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden bg-black/40"
          onClick={onToggle}
        />
      )}
      <aside
        className="fixed lg:static inset-y-0 left-0 z-40 flex flex-col h-full transition-all duration-300 bg-white border-r border-slate-200"
        style={{
          width: isOpen ? "256px" : "0px",
          minWidth: isOpen ? "256px" : "0px",
          overflow: "hidden",
        }}
      >
        <div
          style={{ width: "256px", minWidth: "256px" }}
          className="flex flex-col h-full"
        >
          {/* Header */}
          <div className="px-4 py-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-white text-[8px]">◈</span>
              </div>
              <div className="flex flex-col">
                <h2 className="text-[13px] font-semibold text-slate-800 leading-none">
                  OXY GPT
                </h2>
                <p className="mt-0.5 text-[11px] text-slate-500 leading-none">
                  GPT for Radha
                </p>
              </div>
            </div>
          </div>

          <div className="mx-4 mb-3 h-px bg-slate-100" />

          {/* New Chat */}
          <div className="px-3 pb-3 flex-shrink-0">
            <button
              onClick={onNewChat}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[12.5px] font-semibold text-violet-700 bg-violet-50 border border-violet-200 hover:bg-violet-100 transition-all"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              New chat
            </button>
          </div>

          <div className="mx-4 mb-2 h-px bg-slate-100" />

          {/* Recent label */}
          <div className="px-4 pb-1 flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Recent
            </span>
            {sessions.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-violet-100 text-violet-700">
                {sessions.length}
              </span>
            )}
          </div>

          {/* Sessions */}
          <div
            className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5"
            style={{ scrollbarWidth: "thin" }}
          >
            {sessions.length === 0 && (
              <div className="px-3 py-8 text-center">
                <p className="text-[12px] text-slate-400">
                  No conversations yet
                </p>
                <p className="text-[11px] mt-1 text-slate-300">
                  Start chatting to see history
                </p>
              </div>
            )}
            {sessions.map((s) => (
              <button
                key={s.sessionId}
                onClick={() => onSelectSession(s)}
                className={`w-full text-left px-3 py-2 rounded-xl transition-all ${
                  activeSessionId === s.sessionId
                    ? "bg-violet-100 border border-violet-200 text-violet-800"
                    : "border border-transparent text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[12px] font-medium leading-snug truncate flex-1 min-w-0">
                    {s.title || "Untitled"}
                  </p>
                  <p className="text-[10px] text-slate-400 flex-shrink-0">
                    {fmtDate(s.updatedAt)}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Bottom user info */}
          <div className="px-3 py-3 flex-shrink-0 border-t border-slate-100">
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 bg-gradient-to-br from-violet-600 to-violet-800">
                {displayName?.charAt(0).toUpperCase() || "G"}
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-slate-700 leading-none">
                  {displayName}
                </p>
                <p className="text-[10px] mt-0.5 text-slate-400">
                  ···{lastFour}
                </p>
              </div>
              <div className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0 bg-emerald-400" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// ── CEO Suggestion Cards ──────────────────────────────────────────────────────
const CEO_SUGGESTIONS = [
  {
    icon: "📊",
    title: "OxyLoans Portfolio Overview",
    prompt:
      "Give me a comprehensive overview of OxyLoans' current loan portfolio — AUM, active lenders, borrowers, and growth trends.",
  },
  {
    icon: "🤖",
    title: "AskOxy.ai Capabilities",
    prompt:
      "What are the key AI capabilities of AskOxy.ai and how can it improve lender and borrower experiences on the OxyLoans platform?",
  },
  {
    icon: "📈",
    title: "P2P Lending Market Trends",
    prompt:
      "What are the latest regulatory and market trends in India's P2P lending sector that OxyLoans should be aware of in 2025–2026?",
  },
  {
    icon: "⚙️",
    title: "Risk & Compliance Strategy",
    prompt:
      "Outline a risk assessment and compliance framework for OxyLoans to manage credit risk, RBI guidelines, and borrower defaults effectively.",
  },
];

// ── Main ──────────────────────────────────────────────────────────────────────
export default function OxyStreamClaude() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null,
  );
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState(
    CLAUDE_MODELS.find((m) => m.id === "gpt-5.4-mini")?.id ??
      CLAUDE_MODELS[0].id,
  );
  const [modelOpen, setModelOpen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const userScrolledUp = useRef(false);
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const { sessionId: urlSessionId } = useParams<{ sessionId?: string }>();
  const handleShare = () => {
    if (!currentSessionId) return;
    const url = `${window.location.origin}/oxygpt/share/${currentSessionId}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1500);
    });
  };

  const navigate = useNavigate();
  const userId = getUserId();

  useEffect(() => {
    if (!userId) {
      sessionStorage.setItem("redirectPath", window.location.pathname);
      navigate("/whatsapplogin");
    }
  }, [userId, navigate]);

  const { isRecording, isSupported, startRecording, stopRecording } =
    useVoiceRecorder((text) => setInput(text));

  useEffect(() => {
    fetchSessions(userId).then(setSessions);
  }, [userId]);

  useEffect(() => {
    if (!urlSessionId || !userId) return;
    (async () => {
      setHistoryLoading(true);
      setCurrentSessionId(urlSessionId);
      const history = await fetchHistory(urlSessionId);
      setMessages(history);
      setHistoryLoading(false);
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    })();
  }, [urlSessionId, userId]);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => {
      userScrolledUp.current =
        el.scrollHeight - el.scrollTop - el.clientHeight > 80;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!userScrolledUp.current)
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  useEffect(() => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      setError("File must be under 20 MB.");
      return;
    }
    setAttachedFiles((prev) => [
      ...prev,
      {
        raw: file,
        name: file.name,
        size: file.size,
        isImage: file.type.startsWith("image/"),
      },
    ]);
    setError(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      Array.from(e.dataTransfer.files).forEach(handleFile);
    },
    [handleFile],
  );

  const handleNewChat = () => {
    abortRef.current?.abort();
    setMessages([]);
    setInput("");
    setAttachedFiles([]);
    setError(null);
    setIsLoading(false);
    setStreamingMessageId(null);
    setCurrentSessionId(null);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const handleSelectSession = async (session: Session) => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
    setHistoryLoading(true);
    setError(null);
    setCurrentSessionId(session.sessionId);
    const matchedModel = CLAUDE_MODELS.find(
      (m) => m.id === session.lastModel && m.provider === session.lastProvider,
    );
    if (matchedModel) setSelectedModel(matchedModel.id);
    const history = await fetchHistory(session.sessionId);
    setMessages(history);
    setHistoryLoading(false);
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  const handleStop = () => {
    abortRef.current?.abort();
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text && attachedFiles.length === 0) return;
    if (isLoading) return;

    const userMsg: Message = {
      id: uid(),
      role: "user",
      content: text || "Please analyse this file.",
      fileNames:
        attachedFiles.length > 0 ? attachedFiles.map((f) => f.name) : undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setError(null);
    userScrolledUp.current = false;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    const filesSnap = attachedFiles;
    setAttachedFiles([]);
    const ac = new AbortController();
    abortRef.current = ac;
    const modelInfo = CLAUDE_MODELS.find((m) => m.id === selectedModel)!;

    try {
      if (filesSnap.length > 0) {
        const result = await callChatWithFiles(
          filesSnap.map((f) => f.raw),
          userMsg.content,
          selectedModel,
          modelInfo.provider,
          currentSessionId,
          userId,
          webSearchEnabled,
          ac.signal,
        );
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "assistant" as Role,
            content: result.response,
            timestamp: new Date(),
          },
        ]);
        if (!currentSessionId) {
          setCurrentSessionId(result.sessionId);
          fetchSessions(userId).then(setSessions);
        }
      } else {
        const sessionIdToUse = currentSessionId ?? generateSessionId(userId);
        let assistantId: string | null = null;

        await streamSessionChat(
          userId,
          userMsg.content,
          modelInfo.id,
          modelInfo.apiProvider,
          sessionIdToUse,
          webSearchEnabled,
          ac.signal,
          {
            onSessionId: (sid) => {
              if (sid) setCurrentSessionId(sid);
            },
            onChunk: (text) => {
              if (!assistantId) {
                assistantId = uid();
                setStreamingMessageId(assistantId);
                setMessages((prev) => [
                  ...prev,
                  {
                    id: assistantId!,
                    role: "assistant" as Role,
                    content: text,
                    timestamp: new Date(),
                  },
                ]);
              } else {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: appendStreamChunk(m.content, text) }
                      : m,
                  ),
                );
              }
            },
          },
        );

        if (!currentSessionId) {
          setCurrentSessionId(sessionIdToUse);
          fetchSessions(userId).then(setSessions);
        }
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        const msg = err instanceof Error ? err.message : "";
        setError(
          msg.includes("500")
            ? "Unable to get a response. Please try again or switch model."
            : msg || "Something went wrong.",
        );
      }
    } finally {
      setIsLoading(false);
      setStreamingMessageId(null);
      abortRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = messages.length === 0;
  const selectedModelInfo = CLAUDE_MODELS.find((m) => m.id === selectedModel)!;

  return (
    <div
      className="flex h-screen overflow-hidden bg-slate-50 text-slate-800"
      style={{ fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Subtle dot grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(99,102,241,0.06) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top accent bar */}
      <div className="fixed top-0 inset-x-0 h-[3px] pointer-events-none z-50 bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-400" />

      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={currentSessionId}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        userId={userId}
      />

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        <div className="flex-shrink-0 relative z-20 bg-slate-50/90 backdrop-blur-sm border-b border-slate-100 px-4 py-3 flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-800 hover:text-violet-900 hover:bg-violet-100 transition-all flex-shrink-0"
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <MenuFoldOutlined style={{ fontSize: 16 }} />
            ) : (
              <MenuUnfoldOutlined style={{ fontSize: 16 }} />
            )}
          </button>

          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded flex items-center justify-center text-white text-[10px] font-bold bg-gradient-to-br from-violet-600 to-violet-800">
              ◈
            </div>
            <span className="text-[14px] font-bold text-slate-800">
              OXY GPT
            </span>
          </div>

          {currentSessionId && (
            <button
              onClick={handleShare}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-violet-700 bg-violet-50 border border-violet-200 hover:bg-violet-100 transition-all"
              title="Share this conversation"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              {shareCopied ? "Link copied!" : "Share"}
            </button>
          )}
        </div>

        {/* Messages — scrolls independently below the sticky header */}
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto relative z-10 min-h-0"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(139,92,246,0.2) transparent",
          }}
        >
          <div className="py-6 flex flex-col gap-5">
            {isEmpty && !historyLoading && (
              <div className="flex flex-col items-center justify-center py-12 gap-8 text-center px-6">
                <div>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-violet-200 bg-gradient-to-br from-violet-600 to-violet-800 mx-auto mb-4">
                    ◈
                  </div>
                  <h2 className="text-[22px] font-bold text-slate-800 mb-1">
                    Good day. How can I assist?
                  </h2>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto">
                    Ask about OxyLoans, AskOxy.ai, market insights, or upload a
                    document for analysis.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                  {CEO_SUGGESTIONS.map((s) => (
                    <button
                      key={s.title}
                      onClick={() => setInput(s.prompt)}
                      className="group text-left px-4 py-3.5 rounded-2xl border border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50 hover:shadow-md transition-all duration-200 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl flex-shrink-0 mt-0.5">
                          {s.icon}
                        </span>
                        <div>
                          <p className="text-[12.5px] font-semibold text-slate-700 group-hover:text-violet-800 transition-colors leading-snug">
                            {s.title}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2">
                            {s.prompt}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {historyLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="flex gap-2 items-center text-sm text-violet-500">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full animate-bounce bg-violet-400"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                  Loading history…
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                isStreaming={msg.id === streamingMessageId}
              />
            ))}
            {isLoading && streamingMessageId === null && <ThinkingLoader />}
            <div ref={bottomRef} />
          </div>
        </main>

        {/* Drag overlay */}
        {dragOver && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/80 border-2 border-dashed border-violet-400">
            <div className="text-center">
              <div className="text-5xl mb-3">📂</div>
              <p className="text-lg font-bold text-violet-700">
                Drop your file here
              </p>
              <p className="text-sm mt-1 text-violet-400">
                Any file · max 20 MB
              </p>
            </div>
          </div>
        )}

        {/* Input footer */}
        <div className="flex-shrink-0 px-4 pb-3 pt-2 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
          <div className="max-w-3xl mx-auto flex flex-col gap-2">
            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs bg-red-50 border border-red-200 text-red-600">
                <span>⚠</span>
                <span className="flex-1">{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="hover:text-red-800 text-red-400"
                >
                  ✕
                </button>
              </div>
            )}

            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 px-1">
                {attachedFiles.map((file, index) => (
                  <FileChip
                    key={index}
                    file={file}
                    onRemove={() =>
                      setAttachedFiles((prev) =>
                        prev.filter((_, i) => i !== index),
                      )
                    }
                  />
                ))}
              </div>
            )}

            <div
              className={`flex items-center gap-2 rounded-2xl px-3 py-2.5 bg-white border shadow-sm transition-all ${dragOver ? "border-violet-400 shadow-violet-400" : "border-slate-400 shadow-slate-400 focus-within:border-violet-600 focus-within:shadow-violet-500"}`}
            >
              <div className="relative">
                <button
                  onClick={() => setPlusMenuOpen((v) => !v)}
                  title="Add"
                  className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    plusMenuOpen
                      ? "bg-violet-400 text-violet-700 border border-violet-300"
                      : "text-slate-600 hover:text-violet-600 hover:bg-violet-50"
                  }`}
                >
                  <PlusOutlined style={{ fontSize: 19 }} />
                </button>

                {plusMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setPlusMenuOpen(false)}
                    />
                    <div className="absolute bottom-10 left-0 w-52 rounded-2xl shadow-xl z-50 overflow-hidden bg-white border border-slate-200">
                      {/* Upload file */}
                      <button
                        onClick={() => {
                          fileRef.current?.click();
                          setPlusMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12.5px] text-slate-700 hover:bg-violet-50 transition-all"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Upload file
                      </button>

                      <div className="h-px bg-slate-100 mx-3" />

                      {/* Web search toggle */}
                      <button
                        onClick={() => setWebSearchEnabled((v) => !v)}
                        className="w-full flex items-center justify-between gap-2.5 px-3 py-2.5 text-[12.5px] text-slate-700 hover:bg-violet-50 transition-all"
                      >
                        <span className="flex items-center gap-2.5">
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <circle cx="11" cy="11" r="7" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                          Web search
                        </span>
                        <span
                          className={`w-8 h-4.5 rounded-full flex items-center px-0.5 transition-all ${
                            webSearchEnabled
                              ? "bg-violet-600 justify-end"
                              : "bg-slate-200 justify-start"
                          }`}
                          style={{ height: "18px" }}
                        >
                          <span className="w-3.5 h-3.5 rounded-full bg-white shadow" />
                        </span>
                      </button>
                    </div>
                  </>
                )}
              </div>
              {webSearchEnabled && (
                <span className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-violet-100 text-violet-700 border border-violet-200">
                  🔍 Web
                </span>
              )}
              <input
                ref={fileRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  Array.from(e.target.files || []).forEach(handleFile);
                  e.target.value = "";
                }}
              />

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isRecording
                    ? "Listening…"
                    : attachedFiles.length > 0
                      ? "Ask about this file…"
                      : "Message OXY GPT…"
                }
                rows={1}
                className="flex-1 bg-transparent resize-none outline-none text-[13.5px] leading-relaxed text-slate-800 placeholder:text-slate-400"
                style={{ minHeight: "22px", maxHeight: "120px" }}
              />

              {/* Mic */}
              {isSupported && (
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    isRecording
                      ? "bg-red-50 text-red-500 border border-red-200"
                      : "text-slate-400 hover:text-violet-600 hover:bg-violet-50"
                  }`}
                >
                  {isRecording ? (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full animate-pulse bg-red-500" />
                      <PauseOutlined style={{ fontSize: 13 }} />
                    </span>
                  ) : (
                    <AudioOutlined style={{ fontSize: 16 }} />
                  )}
                </button>
              )}

              {/* Model picker */}
              <div className="relative">
                <button
                  onClick={() => {
                    if (attachedFiles.length === 0) setModelOpen((v) => !v);
                  }}
                  disabled={attachedFiles.length > 0}
                  title={
                    attachedFiles.length > 0
                      ? "Locked to Claude Opus 4.6 for file uploads"
                      : undefined
                  }
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap border transition-all ${
                    attachedFiles.length > 0
                      ? "bg-violet-50 border-violet-200 text-violet-700 cursor-not-allowed opacity-80"
                      : "bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100"
                  }`}
                >
                  {selectedModelInfo.provider === "OpenAI" ? "🤖" : "✨"}{" "}
                  {selectedModelInfo.label.split(" ").slice(0, 2).join(" ")}
                  {attachedFiles.length === 0 && (
                    <svg
                      width="9"
                      height="9"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="ml-0.5"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  )}
                </button>
                {modelOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setModelOpen(false)}
                    />
                    <div className="absolute bottom-10 right-0 w-60 rounded-2xl shadow-xl z-50 overflow-hidden bg-white border border-slate-200">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-violet-600">
                          Claude
                        </p>
                      </div>
                      {CLAUDE_MODELS.filter((m) => m.provider === "Claude").map(
                        (m) => (
                          <button
                            key={m.id}
                            onClick={() => {
                              setSelectedModel(m.id);
                              setModelOpen(false);
                            }}
                            className={`w-full flex justify-between items-center px-3 py-2 text-[12.5px] transition-all hover:bg-violet-50 ${selectedModel === m.id ? "bg-violet-50 text-violet-800 font-semibold" : "text-slate-600"}`}
                          >
                            <span>{m.label}</span>
                            <span className="text-[10px] text-violet-400">
                              {m.desc}
                            </span>
                          </button>
                        ),
                      )}
                      <div className="px-3 py-2 border-t border-slate-100">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                          OpenAI
                        </p>
                      </div>
                      {CLAUDE_MODELS.filter((m) => m.provider === "OpenAI").map(
                        (m) => (
                          <button
                            key={m.id}
                            onClick={() => {
                              setSelectedModel(m.id);
                              setModelOpen(false);
                            }}
                            className={`w-full flex justify-between items-center px-3 py-2 text-[12.5px] transition-all hover:bg-emerald-50 ${selectedModel === m.id ? "bg-emerald-50 text-emerald-800 font-semibold" : "text-slate-600"}`}
                          >
                            <span>{m.label}</span>
                            <span className="text-[10px] text-emerald-500">
                              {m.desc}
                            </span>
                          </button>
                        ),
                      )}
                    </div>
                  </>
                )}
              </div>

              {isLoading ? (
                <button
                  onClick={handleStop}
                  title="Stop generating"
                  className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
                >
                  <svg
                    className="animate-spin w-4 h-4 text-violet-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0110 10" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!input.trim() && attachedFiles.length === 0}
                  className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 ${
                    !input.trim() && attachedFiles.length === 0
                      ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                      : "bg-gradient-to-br from-violet-600 to-violet-800 text-white shadow-md shadow-violet-200 hover:shadow-violet-300"
                  }`}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              )}
            </div>

            <p className="text-center text-[10.5px] text-slate-400 leading-relaxed">
              OXY GPT may produce mistakes. Please verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
