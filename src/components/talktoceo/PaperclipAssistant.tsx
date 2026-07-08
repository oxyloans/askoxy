import React, { useEffect, useRef, useState } from "react";
import {
  X,
  Send,
  Globe,
  Loader2,
  Sparkles,
  ExternalLink,
  Bot,
  User,
  FileText,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  History,
  Copy,
  Check,
  Plus,
} from "lucide-react";
import BASE_URL from "../../Config";
import type {
  ISpeechRecognition,
  ISpeechRecognitionEvent,
  ISpeechRecognitionErrorEvent,
} from "../../types/speech-recognition";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  sources?: string[];
  isError?: boolean;
  // When set, the message renderer looks for this exact substring inside
  // `text` and wraps it in a bold, colored chip instead of plain text — used
  // for the article name so it stands out from the surrounding sentence.
  highlightText?: string;
};

// Shape returned by GET /paperclip/{id}/chat/history — mirrors
// ContentService.PaperclipChatHistoryEntry on the backend.
type ChatHistoryEntry = {
  role: "user" | "assistant";
  text: string;
  sources?: string[];
  timestamp: number;
};

// Loose shape for the extra context the parent page (PaperClippingPage.tsx)
// still passes in. NOTE: the backend (ContentService.askPaperclip) no longer
// uses this — it loads the article, analysis, and images itself from the DB
// via paperclipId, so the chat payload never needs to include it. It's kept
// here purely so TypeScript accepts the prop from the parent; if the parent
// is ever updated to stop passing it, this can be removed too.
type ArticleContext = {
  fileName?: string | null;
  shortSummary?: string | null;
  detailedSummary?: string | null;
  imageUrls?: string[];
  [key: string]: unknown;
};

type Props = {
  paperclipId: string;
  articleTitle?: string;
  articleContext?: ArticleContext;
  onClose: () => void;
};

// Languages offered for both mic input and read-aloud — matches the
// language set already used elsewhere across OxyGlobal's voice work
// (Telugu / Hindi / English).
const VOICE_LANGUAGES: { code: string; label: string }[] = [
  { code: "en-US", label: "EN" },
  { code: "hi-IN", label: "HI" },
  { code: "te-IN", label: "TE" },
];

const CHAT_API = (id: string) => `${BASE_URL}/ai-automation/paperclip/${id}/chat`;
const CHAT_HISTORY_API = (id: string) =>
  `${BASE_URL}/ai-automation/paperclip/${id}/chat/history`;

// Phrases that auto-enable web search even if the toggle is off — covers
// common ways people ask for current/updated info without remembering to
// tap the globe button first.
const WEB_SEARCH_TRIGGERS = [
  "related news",
  "latest",
  "current status",
  "recent update",
  "as of today",
  "right now",
];

const QUICK_QUESTIONS = [
  { label: "Explain this article", emoji: "📰" },
  { label: "Key takeaways", emoji: "🔑" },
  { label: "Business opportunities", emoji: "💡" },
  { label: "Who's involved?", emoji: "👥" },
  { label: "Related news", emoji: "🌍" },
  { label: "Latest updates", emoji: "🌍" },
];

function sourceLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function willUseWebSearch(question: string) {
  const q = question.toLowerCase();
  return WEB_SEARCH_TRIGGERS.some((t) => q.includes(t));
}

// Strips markdown syntax before handing text to the speech synthesizer, so
// it doesn't read out "asterisk asterisk" or raw URLs — plain, natural
// sentences only.
function stripMarkdownForSpeech(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/https?:\/\/[^\s)]+/g, "")
    .replace(/[•#>`]/g, "")
    .trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Builds a standalone, styled HTML transcript page for the "open history in
// a new tab" action. Kept dependency-free (no React) since it's written
// straight into a new window/document rather than rendered by this app.
function buildHistoryHtmlPage(entries: ChatHistoryEntry[], articleTitle: string): string {
  const rows = entries
    .map((e) => {
      const isUser = e.role === "user";
      const when = e.timestamp
        ? new Date(e.timestamp).toLocaleString()
        : "";
      const sourcesHtml =
        e.sources && e.sources.length > 0
          ? `<div class="sources">${e.sources
              .map(
                (s) =>
                  `<a href="${escapeHtml(s)}" target="_blank" rel="noreferrer">${escapeHtml(
                    (() => {
                      try {
                        return new URL(s).hostname.replace(/^www\./, "");
                      } catch {
                        return s;
                      }
                    })()
                  )}</a>`
              )
              .join(" ")}</div>`
          : "";
      return `
        <div class="row ${isUser ? "user" : "assistant"}">
          <div class="bubble">
            <div class="role">${isUser ? "You" : "Assistant"}${when ? ` · ${escapeHtml(when)}` : ""}</div>
            <div class="text">${escapeHtml(e.text).replace(/\n/g, "<br/>")}</div>
            ${sourcesHtml}
          </div>
        </div>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Conversation History — ${escapeHtml(articleTitle)}</title>
<style>
  body { margin:0; padding:32px; background:linear-gradient(180deg,#f5f3ff,#ffffff); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color:#1f2937; }
  .header { max-width:760px; margin:0 auto 24px; }
  .header h1 { font-size:20px; font-weight:800; color:#6d28d9; margin:0 0 4px; }
  .header p { font-size:13px; color:#6b7280; margin:0; }
  .thread { max-width:760px; margin:0 auto; display:flex; flex-direction:column; gap:16px; }
  .row { display:flex; }
  .row.user { justify-content:flex-end; }
  .row.assistant { justify-content:flex-start; }
  .bubble { max-width:75%; padding:12px 16px; border-radius:16px; font-size:14px; line-height:1.6; box-shadow:0 1px 2px rgba(0,0,0,0.06); }
  .row.user .bubble { background:linear-gradient(135deg,#8b5cf6,#d946ef); color:#fff; border-bottom-right-radius:4px; }
  .row.assistant .bubble { background:#fff; border:1px solid #ede9fe; border-bottom-left-radius:4px; }
  .role { font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; opacity:0.7; margin-bottom:4px; }
  .sources { margin-top:8px; padding-top:8px; border-top:1px solid rgba(0,0,0,0.08); display:flex; flex-wrap:wrap; gap:6px; }
  .sources a { font-size:11px; font-weight:700; color:#7c3aed; text-decoration:none; background:#f5f3ff; border:1px solid #ddd6fe; padding:3px 8px; border-radius:999px; }
  .empty { max-width:760px; margin:60px auto; text-align:center; color:#9ca3af; font-size:14px; }
</style>
</head>
<body>
  <div class="header">
    <h1>Ask this Article — Conversation History</h1>
    <p>${escapeHtml(articleTitle)}</p>
  </div>
  <div class="thread">
    ${entries.length > 0 ? rows : ""}
  </div>
  ${entries.length === 0 ? `<div class="empty">No conversation yet for this article.</div>` : ""}
</body>
</html>`;
}

// Matches, in priority order: markdown links [text](url), **bold** spans,
// and bare http(s) URLs that weren't already part of a markdown link. Used
// to turn the model's markdown-flavored replies into actual clickable links
// and colored emphasis instead of showing literal "**" and "[]()" characters.
const RICH_TEXT_PATTERN =
  /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\*\*([^*]+)\*\*|(https?:\/\/[^\s)]+)/g;

// Renders one plain-text chunk (no markdown links/bold left to parse) with
// line breaks preserved as <br/>, since the outer container's
// whitespace-pre-wrap won't apply once we're returning an array of nodes.
function renderPlainSegment(text: string, key: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => (
    <React.Fragment key={`${key}-l${i}`}>
      {i > 0 && <br />}
      {line}
    </React.Fragment>
  ));
}

function renderRichText(text: string, isUser: boolean) {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  const linkClass = isUser
    ? "font-bold text-white underline decoration-white/70 underline-offset-2 hover:decoration-white"
    : "font-semibold text-violet-600 underline decoration-violet-300 underline-offset-2 hover:text-violet-700 hover:decoration-violet-500";

  const boldClass = isUser
    ? "font-extrabold text-white"
    : "font-extrabold text-violet-700";

  RICH_TEXT_PATTERN.lastIndex = 0;
  while ((match = RICH_TEXT_PATTERN.exec(text)) !== null) {
    const [full, linkText, linkUrl, boldText, bareUrl] = match;

    if (match.index > lastIndex) {
      nodes.push(...renderPlainSegment(text.slice(lastIndex, match.index), `t${i}`));
    }

    if (linkText && linkUrl) {
      nodes.push(
        <a
          key={`a${i}`}
          href={linkUrl}
          target="_blank"
          rel="noreferrer"
          className={`${linkClass} inline-flex items-center gap-0.5`}
        >
          {linkText}
          <ExternalLink size={11} className="shrink-0 opacity-70" />
        </a>
      );
    } else if (boldText) {
      nodes.push(
        <span key={`b${i}`} className={boldClass}>
          {boldText}
        </span>
      );
    } else if (bareUrl) {
      nodes.push(
        <a
          key={`u${i}`}
          href={bareUrl}
          target="_blank"
          rel="noreferrer"
          className={`${linkClass} inline-flex items-center gap-0.5 break-all`}
        >
          {sourceLabel(bareUrl)}
          <ExternalLink size={11} className="shrink-0 opacity-70" />
        </a>
      );
    }

    lastIndex = match.index + full.length;
    i++;
  }

  if (lastIndex < text.length) {
    nodes.push(...renderPlainSegment(text.slice(lastIndex), `tail`));
  }

  return nodes;
}

function renderMessageText(m: ChatMessage) {
  const isUser = m.role === "user";

  if (m.highlightText) {
    const idx = m.text.indexOf(m.highlightText);
    if (idx !== -1) {
      const before = m.text.slice(0, idx);
      const after = m.text.slice(idx + m.highlightText.length);
      return (
        <>
          {renderRichText(before, isUser)}
          <span
            className={
              isUser
                ? "font-extrabold text-white underline decoration-white/60 underline-offset-2"
                : "rounded-md bg-violet-100 px-1.5 py-0.5 font-extrabold text-violet-700"
            }
          >
            {m.highlightText}
          </span>
          {renderRichText(after, isUser)}
        </>
      );
    }
  }

  return renderRichText(m.text, isUser);
}

// Cleans up a raw article title for display. Handles the common case where
// the title is a comma-separated list of filenames for multiple pages of the
// same clipping (e.g. "Article-1.png, Article -2.jpeg") — strips extensions
// and page-number suffixes, then collapses them into one readable label
// instead of a long truncated filename string.
function formatArticleTitle(raw?: string): string {
  if (!raw) return "Paper Clip";

  const parts = raw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length === 0) return "Paper Clip";

  const stripExt = (s: string) => s.replace(/\.(png|jpe?g|pdf|docx?|webp|gif|heic)$/i, "").trim();
  const stripPageSuffix = (s: string) => s.replace(/[\s\-_]*\d+\s*$/, "").trim();

  const cleaned = parts.map(stripExt);
  const bases = cleaned.map(stripPageSuffix);
  const allSameBase = bases.length > 1 && bases.every((b) => b && b === bases[0]);

  if (allSameBase) {
    return `${bases[0]} (${parts.length} pages)`;
  }

  return cleaned.join(" • ");
}

export default function PaperclipAssistant({ paperclipId, articleTitle, onClose }: Props) {
  const introTitle = formatArticleTitle(articleTitle);

  // Kept as a stable object (not re-created each render) so it can be
  // reused both as the initial state and as the prefix when history is
  // restored, without upsetting effect dependency arrays.
  const greetingMessageRef = useRef<ChatMessage>({
    role: "assistant",
    text: `Ask me anything about "${introTitle}" — I'll answer from the article, or from the web if you turn that on.`,
    highlightText: introTitle,
  });

  const [messages, setMessages] = useState<ChatMessage[]>([greetingMessageRef.current]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyOpening, setHistoryOpening] = useState(false);
  const [input, setInput] = useState("");
  const [webSearch, setWebSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchingWeb, setSearchingWeb] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Stable conversation ID for this assistant session — still sent with
  // every message for backward compatibility with the backend's
  // askPaperclip signature, but the backend no longer relies on it: the
  // paperclipId itself is now the conversation key (see lastResponseId /
  // chatHistoryJson on PaperclipItem), which is what makes it possible to
  // restore history below across page refreshes and remounts.
  const conversationIdRef = useRef(crypto.randomUUID());

  // ── Voice: shared language for both mic input and read-aloud ──────────
  const [voiceLang, setVoiceLang] = useState("en-US");

  // ── Voice input (speech-to-text) ───────────────────────────────────────
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceInputSupported, setVoiceInputSupported] = useState(true);
  const baseInputBeforeListeningRef = useRef(""); // text already typed before mic was tapped

  // ── Voice output (text-to-speech) ──────────────────────────────────────
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [ttsSupported, setTtsSupported] = useState(true);

  // ── Copy-to-clipboard on assistant replies ─────────────────────────────
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const SpeechRecognitionCtor =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : undefined;
    setVoiceInputSupported(!!SpeechRecognitionCtor);
    setTtsSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  // Restore any persisted conversation for this paperclip so reopening the
  // panel (or a page refresh) doesn't lose prior turns. Falls back to just
  // the greeting if the paperclip has no chat history yet.
  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      setHistoryLoading(true);
      try {
        const token = sessionStorage.getItem("accessToken") || "";
        const res = await fetch(CHAT_HISTORY_API(paperclipId), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (cancelled) return;

        // Adjust this unwrap if your ApiResponse<T> wrapper differs —
        // assumes { success, data } like the rest of the app's endpoints.
        const entries: ChatHistoryEntry[] = data?.data ?? [];

        if (Array.isArray(entries) && entries.length > 0) {
          const restored: ChatMessage[] = entries.map((e) => ({
            role: e.role,
            text: e.text,
            sources: e.sources && e.sources.length > 0 ? e.sources : undefined,
          }));
          setMessages([greetingMessageRef.current, ...restored]);
        } else {
          setMessages([greetingMessageRef.current]);
        }
      } catch {
        // No history available (or request failed) — keep just the greeting.
        if (!cancelled) setMessages([greetingMessageRef.current]);
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    }

    loadHistory();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paperclipId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, historyLoading]);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 250);
    return () => clearTimeout(t);
  }, []);

  // Stop any mic/speech activity if the panel unmounts (closed) mid-use.
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // ── Voice input handlers ────────────────────────────────────────────────

  function startListening() {
    if (loading || historyLoading) return;
    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setVoiceInputSupported(false);
      return;
    }

    // Pause any playback so the mic isn't fighting the speaker.
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
    }

    baseInputBeforeListeningRef.current = input ? input.trim() + " " : "";

    // Cast through unknown since the native/global SpeechRecognition
    // constructor type (from window.SpeechRecognition /
    // webkitSpeechRecognition, typically pulled from lib.dom typings)
    // doesn't structurally match our own ISpeechRecognition interface
    // (e.g. it's missing `abort` in some environments) — but the actual
    // runtime object returned does implement everything we need.
    const recognition = new SpeechRecognitionCtor() as unknown as ISpeechRecognition;
    recognition.lang = voiceLang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: ISpeechRecognitionEvent) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalText += result[0].transcript;
        else interimText += result[0].transcript;
      }
      if (finalText) baseInputBeforeListeningRef.current += finalText + " ";
      setInput((baseInputBeforeListeningRef.current + interimText).trim());
    };

    recognition.onerror = (_event: ISpeechRecognitionErrorEvent) => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  function toggleListening() {
    if (isListening) stopListening();
    else startListening();
  }

  // ── Voice output (TTS) handlers ─────────────────────────────────────────

  function pickVoiceForLang(lang: string): SpeechSynthesisVoice | undefined {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => v.lang === lang) ||
      voices.find((v) => v.lang.startsWith(lang.split("-")[0]))
    );
  }

  function speakMessage(text: string, index: number) {
    if (!ttsSupported) return;
    const synth = window.speechSynthesis;
    synth.cancel(); // stop anything currently playing

    const utterance = new SpeechSynthesisUtterance(stripMarkdownForSpeech(text));
    utterance.lang = voiceLang;
    const voice = pickVoiceForLang(voiceLang);
    if (voice) utterance.voice = voice;
    utterance.rate = 1;

    utterance.onend = () => setSpeakingIndex((cur) => (cur === index ? null : cur));
    utterance.onerror = () => setSpeakingIndex((cur) => (cur === index ? null : cur));

    setSpeakingIndex(index);
    synth.speak(utterance);
  }

  function toggleSpeakMessage(text: string, index: number) {
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
    } else {
      speakMessage(text, index);
    }
  }

  // ── Copy-to-clipboard ────────────────────────────────────────────────────
  async function copyMessage(text: string, index: number) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older/insecure contexts without Clipboard API access.
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex((cur) => (cur === index ? null : cur)), 1600);
    } catch {
      // Clipboard write failed (permissions) — silently ignore, no need to
      // interrupt the user's flow over a copy button.
    }
  }

  // ── History-in-new-tab ──────────────────────────────────────────────────
  // Opens a plain, standalone HTML transcript in a new browser tab. The tab
  // is opened synchronously (before the fetch) so browsers don't treat it
  // as a blocked popup; it's then filled in once the data arrives.
  async function openHistoryInNewTab() {
    const newTab = window.open("", "_blank");
    if (!newTab) {
      // Popup blocked — nothing more we can do without a user gesture retry.
      return;
    }
    newTab.document.write(
      `<!DOCTYPE html><html><head><title>Loading…</title></head>
       <body style="font-family:sans-serif;padding:40px;color:#6b7280;">Loading conversation history…</body></html>`
    );

    setHistoryOpening(true);
    try {
      const token = sessionStorage.getItem("accessToken") || "";
      const res = await fetch(CHAT_HISTORY_API(paperclipId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const entries: ChatHistoryEntry[] = data?.data ?? [];

      const html = buildHistoryHtmlPage(entries, introTitle);
      newTab.document.open();
      newTab.document.write(html);
      newTab.document.close();
    } catch {
      newTab.document.open();
      newTab.document.write(
        `<!DOCTYPE html><html><head><title>Error</title></head>
         <body style="font-family:sans-serif;padding:40px;color:#dc2626;">Couldn't load conversation history. Please try again.</body></html>`
      );
      newTab.document.close();
    } finally {
      setHistoryOpening(false);
    }
  }

  // ── New chat ─────────────────────────────────────────────────────────────
  // Starts a fresh conversation thread inside this same assistant panel:
  // stops any active mic/speech, clears the transcript back to just the
  // greeting, and rolls a new conversationId so the backend treats
  // subsequent messages as a new thread rather than continuing the old one.
  function startNewChat() {
    if (loading || historyLoading) return;
    if (isListening) stopListening();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingIndex(null);
    setCopiedIndex(null);
    setInput("");
    conversationIdRef.current = crypto.randomUUID();
    setMessages([greetingMessageRef.current]);
    setTimeout(() => inputRef.current?.focus(), 150);
  }

  async function sendMessage(text?: string) {
    const question = (text ?? input).trim();
    if (!question || loading || historyLoading) return;

    // Any in-progress mic capture is done once a message is sent.
    if (isListening) stopListening();

    const useWebSearch = webSearch || willUseWebSearch(question);

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    setSearchingWeb(useWebSearch);

    try {
      const token = sessionStorage.getItem("accessToken") || "";

      // Minimal payload — the backend loads the article, analysis, and
      // images itself from the DB via paperclipId, and continues the
      // OpenAI thread using the paperclip's persisted lastResponseId. No
      // article data is sent from the frontend.
      const payload = {
        message: question,
        webSearch: useWebSearch,
        conversationId: conversationIdRef.current,
      };

      const res = await fetch(CHAT_API(paperclipId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) throw new Error(data?.message || "Request failed");

      const answerText: string = data.answer;
      const newIndex = messages.length + 1; // position this reply will land at

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: answerText, sources: data.sources || [] },
      ]);

      if (autoSpeak && ttsSupported) {
        // Fire after the message is in state so the speaker icon reflects
        // the right index; slight defer avoids racing the state update.
        setTimeout(() => speakMessage(answerText, newIndex), 50);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I couldn't get an answer just now. Please try again.", isError: true },
      ]);
    } finally {
      setLoading(false);
      setSearchingWeb(false);
    }
  }

  // Quick questions should only nudge a genuinely fresh conversation — once
  // history is restored (or the user has sent anything), hide them.
  const showQuickQuestions = !historyLoading && messages.length <= 1;

  return (
    <div
      className="fixed inset-0 z-[9998] bg-slate-900/40 backdrop-blur-[2px] animate-[fadeIn_0.15s_ease-out]"
      onClick={onClose}
    >
      {/* Panel — offset below the fixed app header (top-14 = 56px) so the
          assistant's own title bar is never hidden underneath the navbar.
          Full-width on mobile, wider on tablet/desktop. */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed right-0 top-14 bottom-0 z-[9999] flex w-full max-w-md flex-col overflow-hidden border-l border-white/40 bg-white/95 shadow-[-8px_0_40px_rgba(76,29,149,0.18)] backdrop-blur-xl animate-[slideIn_0.25s_cubic-bezier(0.16,1,0.3,1)] sm:max-w-lg lg:max-w-2xl"
      >
        {/* Header */}
        <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-400 px-5 pt-4 pb-3.5">
          <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -left-6 bottom-0 h-20 w-20 rounded-full bg-white/10 blur-xl" />
          <div className="relative flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white/20 shadow-inner ring-1 ring-white/30">
                <Sparkles size={16} className="text-white" />
              </div>
              <p className="text-[15px] font-black leading-tight text-white">Ask this Article</p>
            </div>

            <button
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition hover:rotate-90 hover:bg-white/30"
            >
              <X size={15} />
            </button>
          </div>

          {/* Controls row — language selector, new chat, history, auto-speak.
              Given solid white/near-white backgrounds (not low-opacity tints)
              so they read clearly against the gradient header. */}
          <div className="relative mt-3 flex flex-wrap items-center gap-2">
            {/* Voice language selector — shared by mic input & read-aloud */}
            {(voiceInputSupported || ttsSupported) && (
              <div className="flex items-center gap-0.5 rounded-full bg-white p-1 shadow-sm">
                {VOICE_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setVoiceLang(l.code)}
                    title={`Voice language: ${l.label}`}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-black transition ${
                      voiceLang === l.code
                        ? "bg-violet-600 text-white shadow"
                        : "text-violet-500 hover:bg-violet-100"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}

            {/* Auto-speak toggle — reads every new reply aloud as it arrives */}
            {ttsSupported && (
              <button
                onClick={() => {
                  setAutoSpeak((v) => {
                    if (v) {
                      window.speechSynthesis.cancel();
                      setSpeakingIndex(null);
                    }
                    return !v;
                  });
                }}
                title={autoSpeak ? "Auto read-aloud: ON" : "Auto read-aloud: OFF"}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm transition ${
                  autoSpeak ? "bg-violet-900 text-white" : "bg-white text-violet-500 hover:bg-violet-50"
                }`}
              >
                {autoSpeak ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>
            )}

            {/* New Chat — resets this panel to a fresh conversation thread */}
            <button
              onClick={startNewChat}
              disabled={loading || historyLoading}
              title="Start a new chat"
              className="flex h-8 items-center gap-1.5 rounded-full bg-white px-3 text-[11px] font-black text-violet-600 shadow-sm transition hover:bg-violet-50 disabled:opacity-60"
            >
              <Plus size={13} />
              New Chat
            </button>

            {/* History — opens the full persisted transcript in a new tab */}
            <button
              onClick={openHistoryInNewTab}
              disabled={historyOpening}
              title="Open conversation history in a new tab"
              className="flex h-8 items-center gap-1.5 rounded-full bg-white px-3 text-[11px] font-black text-violet-600 shadow-sm transition hover:bg-violet-50 disabled:opacity-60"
            >
              {historyOpening ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <History size={13} />
              )}
              History
            </button>
          </div>

          {/* Article title — its own row so it's never squeezed or hard to
              read against the gradient. Wraps up to 2 lines instead of
              truncating, since multi-page titles can get long. */}
          <div className="relative mt-3 flex items-start gap-2 rounded-xl bg-white/15 px-3 py-2 ring-1 ring-white/25">
            <FileText size={13} className="mt-0.5 shrink-0 text-white/90" />
            <p
              className="line-clamp-2 text-[12.5px] font-bold leading-snug text-white"
              title={articleTitle || "Paper Clip"}
            >
              {formatArticleTitle(articleTitle)}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-violet-50/40 to-white px-4 py-5">
          {historyLoading && (
            <div className="flex items-center justify-center gap-2 py-8">
              <Loader2 size={16} className="animate-spin text-violet-400" />
              <span className="text-[11px] font-semibold text-violet-400">
                Loading conversation…
              </span>
            </div>
          )}

          {!historyLoading &&
            messages.map((m, i) => (
              <div
                key={i}
                className={`flex items-end gap-2 ${m.role === "user" ? "flex-row-reverse" : "flex-row"} animate-[fadeIn_0.2s_ease-out]`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    m.role === "user"
                      ? "bg-gradient-to-br from-violet-500 to-fuchsia-500"
                      : m.isError
                      ? "bg-red-100"
                      : "bg-white shadow-sm ring-1 ring-violet-100"
                  }`}
                >
                  {m.role === "user" ? (
                    <User size={13} className="text-white" />
                  ) : (
                    <Bot size={13} className={m.isError ? "text-red-500" : "text-violet-600"} />
                  )}
                </div>
                <div
                  className={`group relative max-w-[80%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-wrap shadow-sm ${
                    m.role === "user"
                      ? "rounded-br-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white"
                      : m.isError
                      ? "rounded-bl-md border border-red-100 bg-red-50 text-red-600"
                      : "rounded-bl-md border border-violet-100/70 bg-white text-gray-800"
                  }`}
                >
                  {renderMessageText(m)}

                  {/* Action row: read-aloud + copy — assistant messages only */}
                  {m.role === "assistant" && !m.isError && (
                    <div className="mt-1.5 flex items-center gap-1">
                      {ttsSupported && (
                        <button
                          onClick={() => toggleSpeakMessage(m.text, i)}
                          title={speakingIndex === i ? "Stop reading" : "Read aloud"}
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide transition ${
                            speakingIndex === i
                              ? "border-violet-300 bg-violet-100 text-violet-700"
                              : "border-transparent text-violet-400 opacity-0 group-hover:opacity-100 hover:border-violet-200 hover:bg-violet-50"
                          }`}
                        >
                          {speakingIndex === i ? (
                            <>
                              <VolumeX size={10} /> Stop
                            </>
                          ) : (
                            <>
                              <Volume2 size={10} /> Listen
                            </>
                          )}
                        </button>
                      )}

                      <button
                        onClick={() => copyMessage(m.text, i)}
                        title={copiedIndex === i ? "Copied!" : "Copy response"}
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide transition ${
                          copiedIndex === i
                            ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                            : "border-transparent text-violet-400 opacity-0 group-hover:opacity-100 hover:border-violet-200 hover:bg-violet-50"
                        }`}
                      >
                        {copiedIndex === i ? (
                          <>
                            <Check size={10} /> Copied
                          </>
                        ) : (
                          <>
                            <Copy size={10} /> Copy
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2.5 border-t border-gray-100 pt-2.5">
                      <p className="mb-1.5 flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-violet-500">
                        <Globe size={9} /> Sources
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {m.sources.map((url, si) => (
                          <a
                            key={si}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex max-w-[160px] items-center gap-1 truncate rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-700 transition hover:bg-violet-100 hover:border-violet-300"
                            title={url}
                          >
                            <ExternalLink size={9} /> {sourceLabel(url)}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

          {loading && (
            <div className="flex items-end gap-2 animate-[fadeIn_0.2s_ease-out]">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-violet-100">
                <Bot size={13} className="text-violet-600" />
              </div>
              <div className="rounded-2xl rounded-bl-md border border-violet-100/70 bg-white px-4 py-2.5 text-[13px] shadow-sm">
                {searchingWeb ? (
                  <span className="flex items-center gap-1.5 font-bold text-violet-600">
                    <Globe size={13} className="animate-spin [animation-duration:2s]" />
                    Searching the web…
                  </span>
                ) : (
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:300ms]" />
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick questions (only before first user message, and only once
            history has finished loading so we don't flash them before a
            restored conversation replaces the lone greeting) */}
        {showQuickQuestions && (
          <div className="shrink-0 border-t border-violet-100 bg-white/80 px-4 py-3.5 backdrop-blur">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-violet-500">
              Quick Questions
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q.label}
                  onClick={() => sendMessage(q.label)}
                  className="flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50/70 px-3 py-2 text-left text-[11.5px] font-bold text-violet-700 transition hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-100 hover:shadow-sm"
                >
                  <span className="text-[13px] leading-none">{q.emoji}</span>
                  <span className="truncate">{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input bar */}
        <div className="shrink-0 border-t border-violet-100 bg-white px-3 py-3">
          {isListening && (
            <div className="mb-2 flex items-center gap-1.5 pl-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">
                Listening…
              </span>
            </div>
          )}

          {/* Order: Web Search (far left) → input → Mic → Send (mic sits
              beside Send, on the opposite side from Web Search). */}
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 pl-1.5 pr-1.5 py-1.5 transition focus-within:border-violet-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-100">
            {/* Web search toggle — solid, colored even when off so it reads
                as a real button rather than a faint icon. */}
            <button
              onClick={() => setWebSearch((v) => !v)}
              title={webSearch ? "Web search: ON" : "Web search: OFF"}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition ${
                webSearch
                  ? "border-transparent bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-sm"
                  : "border-violet-200 bg-violet-50 text-violet-600 hover:border-violet-300 hover:bg-violet-100"
              }`}
            >
              <Globe size={16} />
            </button>

            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={
                historyLoading
                  ? "Loading conversation…"
                  : isListening
                  ? "Speak now…"
                  : "Ask anything about this article..."
              }
              disabled={loading || historyLoading}
              className="h-9 flex-1 bg-transparent text-[13px] font-medium text-gray-800 outline-none placeholder:text-gray-400"
            />

            {/* Mic toggle — now sits right next to Send, opposite side from
                Web Search; solid red while actively listening. */}
            {voiceInputSupported && (
              <button
                onClick={toggleListening}
                disabled={loading || historyLoading}
                title={isListening ? "Stop listening" : "Ask with your voice"}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition disabled:opacity-40 ${
                  isListening
                    ? "border-transparent bg-red-500 text-white shadow-sm animate-pulse"
                    : "border-violet-200 bg-violet-50 text-violet-600 hover:border-violet-300 hover:bg-violet-100"
                }`}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            )}

            <button
              onClick={() => sendMessage()}
              disabled={loading || historyLoading || !input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-sm transition hover:scale-105 hover:brightness-110 disabled:scale-100 disabled:opacity-40"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 pl-2">
            {webSearch && (
              <p className="flex items-center gap-1 text-[10px] font-semibold text-violet-500">
                <Globe size={9} /> Web search is on — answers still stay grounded in the article
              </p>
            )}
            {!voiceInputSupported && (
              <p className="text-[10px] font-semibold text-gray-400">
                Voice input isn't supported in this browser
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { transform: translateX(24px); opacity: 0.6; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  );
}