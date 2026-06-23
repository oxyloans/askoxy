import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  MessageSquare, Search, ChevronRight, ChevronLeft, User, Clock,
  Mic, Globe, RefreshCw, X, AlertCircle, Inbox, Users, Volume2, MessageCircle,
} from "lucide-react";

const RADHAI_IMAGE = "https://i.ibb.co/RpvNHZCj/ceoai.png";
const RAILWAY_BASE = "https://meta.oxyloans.com/api";

type Conversation = {
  id: number;
  userId: string;
  userName?: string;
  mobileNumber?: string;
  email?: string;
  title: string;
  mode: "VOICE" | "PUBLIC" | string;
  lastMessageAt: string;
  createdAt: string;
};

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

type Tab = "all" | "mine";

const fmtDate = (iso: string) => {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
};

const fmtShort = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso), now = new Date();
  const diffH = (now.getTime() - d.getTime()) / 3_600_000;
  if (diffH < 1) return `${Math.round(diffH * 60)}m ago`;
  if (diffH < 24) return `${Math.floor(diffH)}h ago`;
  if (diffH < 48) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

const resolveIsAdmin = (): boolean =>
  sessionStorage.getItem("radhAIAdminLogin") === "true" ||
  sessionStorage.getItem("primaryType") === "SALESSUPPERADMIN" ||
  localStorage.getItem("primaryType") === "SALESSUPPERADMIN";

const resolveUserId = (): string =>
  sessionStorage.getItem("userId") || localStorage.getItem("userId") || "";

const resolveToken = (): string =>
  sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken") || "";

export default function RadhAIHistoryPage() {
  const isAdmin = resolveIsAdmin();
  const currentUserId = resolveUserId();

  const [tab, setTab] = useState<Tab>("mine");
  const [filterInput, setFilterInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [myConversations, setMyConversations] = useState<Conversation[]>([]);
  const [allConversations, setAllConversations] = useState<Conversation[]>([]);
  const [filteredAll, setFilteredAll] = useState<Conversation[]>([]);
  const [convLoading, setConvLoading] = useState(false);
  const [convError, setConvError] = useState("");
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [msgError, setMsgError] = useState("");
  // Mobile: "list" shows conversation list, "messages" shows message detail
  const [mobileView, setMobileView] = useState<"list" | "messages">("list");
  const [speakingMsgId, setSpeakingMsgId] = useState<number | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  const handleSpeak = (msg: Message) => {
    if (!("speechSynthesis" in window)) return;
    if (speakingMsgId === msg.id) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(msg.content);
    utt.lang = "en-US"; utt.rate = 0.95;
    utt.onend = () => setSpeakingMsgId(null);
    utt.onerror = () => setSpeakingMsgId(null);
    setSpeakingMsgId(msg.id);
    window.speechSynthesis.speak(utt);
  };

  useEffect(() => {
    if (!currentUserId) { setConvError("No user ID found. Please log in again."); return; }
    if (isAdmin) loadMyConversations(currentUserId);
    else loadUserConversations(currentUserId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (chatBottomRef.current) chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setActiveConv(null); setMessages([]); setConvError("");
    setSearchInput(""); setFilterInput(""); setMobileView("list");
    if (!currentUserId) { setConvError("No user ID found. Please log in again."); return; }
    if (tab === "mine") {
      if (isAdmin) loadMyConversations(currentUserId);
      else loadUserConversations(currentUserId);
    } else {
      loadAllConversations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const loadUserConversations = async (uid: string) => {
    const resolvedUid = uid?.trim() || resolveUserId();
    if (!resolvedUid) { setConvError("No user ID found. Please log in again."); return; }
    const token = resolveToken();
    setConvLoading(true); setConvError("");
    setMyConversations([]); setActiveConv(null); setMessages([]);
    try {
      const res = await fetch(`${RAILWAY_BASE}/ai-automation/conversations/${resolvedUid}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list: Conversation[] = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      const userOnly = list.filter((c) => {
        const mode = (c.mode || "").toUpperCase();
        return mode === "PUBLIC" || mode === "VOICE" || mode === "";
      });
      setMyConversations(userOnly);
      if (userOnly.length === 0) setConvError("No conversations found yet. Start a chat first.");
    } catch { setConvError("Failed to load. Check backend connection."); }
    finally { setConvLoading(false); }
  };

  const loadMyConversations = async (uid: string) => {
    const resolvedUid = uid?.trim() || resolveUserId();
    if (!resolvedUid) { setConvError("No user ID found. Please log in again."); return; }
    const token = resolveToken();
    setConvLoading(true); setConvError("");
    setMyConversations([]); setActiveConv(null); setMessages([]);
    try {
      const res = await fetch(`${RAILWAY_BASE}/ai-automation/conversations/${resolvedUid}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list: Conversation[] = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      const adminConvs = list.filter((c) => ["OWNER", "VOICE"].includes((c.mode || "").toUpperCase()));
      setMyConversations(adminConvs);
      if (adminConvs.length === 0) setConvError("No conversations found yet. Start a voice or text session first.");
    } catch { setConvError("Failed to load. Check backend connection."); }
    finally { setConvLoading(false); }
  };

  const loadAllConversations = async () => {
    setConvLoading(true); setConvError("");
    setAllConversations([]); setFilteredAll([]);
    setActiveConv(null); setMessages([]);
    const token = resolveToken();
    try {
      const res = await fetch(`${RAILWAY_BASE}/ai-automation/history/conversations/all`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list: Conversation[] = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      const publicOnly = list.filter(
        (c) => (c.mode || "").toUpperCase() !== "OWNER" && c.userId !== currentUserId
      );
      setAllConversations(publicOnly);
      setFilteredAll(publicOnly);
      if (publicOnly.length === 0) setConvError("No user conversations found.");
    } catch (e: any) { setConvError(e?.message || "Failed to load. Check backend connection."); }
    finally { setConvLoading(false); }
  };

  const handleFilterChange = (value: string) => {
    setFilterInput(value); setActiveConv(null); setMessages([]);
    if (!value.trim()) { setFilteredAll(allConversations); return; }
    const q = value.toLowerCase();
    setFilteredAll(allConversations.filter(
      (c) =>
        c.userId?.toLowerCase().includes(q) ||
        c.userName?.toLowerCase().includes(q) ||
        c.mobileNumber?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.title?.toLowerCase().includes(q) ||
        c.mode?.toLowerCase().includes(q)
    ));
  };

  const loadMessages = async (conv: Conversation) => {
    setActiveConv(conv); setMessages([]); setMsgError(""); setMsgLoading(true);
    setMobileView("messages");
    const token = resolveToken();
    try {
      const res = await fetch(`${RAILWAY_BASE}/ai-automation/conversation/${conv.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      const list: Message[] = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      setMessages(list);
      if (list.length === 0) setMsgError("No messages in this conversation.");
    } catch { setMsgError("Failed to load messages."); }
    finally { setMsgLoading(false); }
  };

  const handleBack = () => {
    setActiveConv(null);
    setMessages([]);
    setMobileView("list");
  };

  const displayMine = myConversations.filter((c) =>
    searchInput
      ? (c.title || "").toLowerCase().includes(searchInput.toLowerCase()) ||
        (c.mode || "").toLowerCase().includes(searchInput.toLowerCase())
      : true
  );
  const displayList = tab === "mine" ? displayMine : filteredAll;

  const handleRetry = () => {
    if (!currentUserId) return;
    if (tab === "all") loadAllConversations();
    else if (isAdmin) loadMyConversations(currentUserId);
    else loadUserConversations(currentUserId);
  };

  // Heights: mobile topbar = 56px (h-14), desktop header = 52px
  const pageHeight = "h-[calc(100vh-56px)] lg:h-[calc(100vh-52px)]";

  const modeColors = (mode: string) =>
    (mode || "").toUpperCase() === "VOICE"
      ? "bg-emerald-100 text-emerald-600"
      : "bg-blue-100 text-blue-600";

  const modeBadgeColors = (mode: string) =>
    (mode || "").toUpperCase() === "VOICE"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-blue-100 text-blue-700";

  const modeIcon = (mode: string, size: number) =>
    (mode || "").toUpperCase() === "VOICE"
      ? <Mic size={size} />
      : <MessageCircle size={size} />;

  return (
    <div className={`flex ${pageHeight} overflow-hidden bg-slate-50`}>

      {/* ── CONVERSATION LIST PANEL ── */}
      {/* On mobile: full width, hidden when mobileView=messages */}
      {/* On desktop: fixed 320px sidebar */}
      <aside className={`
        flex flex-col border-r border-slate-200 bg-white shadow-sm
        w-full lg:w-[320px] lg:shrink-0
        ${mobileView === "messages" ? "hidden lg:flex" : "flex"}
      `}>

        {/* Header */}
       <div className="border-b border-slate-200 bg-white px-3 py-3 sm:px-4 sm:py-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white sm:h-8 sm:w-8">
              <MessageSquare size={14} />
            </div>
            <div>
              <p className="text-[12px] font-black text-slate-800 sm:text-[13px]">Conversation History</p>
              <p className="text-[9px] text-slate-500 sm:text-[10px]">radhAI · Sessions</p>
            </div>
          </div>

          {isAdmin ? (
         <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
  <button onClick={() => setTab("mine")}
    className={`flex flex-1 items-center justify-center gap-1 rounded-md py-1.5 text-[10px] font-black transition sm:gap-1.5 sm:text-[11px] ${
      tab === "mine" ? "bg-indigo-600 text-white shadow" : "text-slate-500 hover:text-slate-800"
    }`}>
    <User size={10} /> Admin History
  </button>
  <button onClick={() => setTab("all")}
    className={`flex flex-1 items-center justify-center gap-1 rounded-md py-1.5 text-[10px] font-black transition sm:gap-1.5 sm:text-[11px] ${
      tab === "all" ? "bg-indigo-600 text-white shadow" : "text-slate-500 hover:text-slate-800"
    }`}>
    <Users size={10} /> All Users
  </button>
</div>
          ) : (
            <div className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-center">
              <p className="text-[11px] font-black text-slate-300">My Conversations</p>
            </div>
          )}
        </div>

        {/* All tab filter */}
        {tab === "all" && isAdmin && (
          <div className="border-b border-slate-100 bg-slate-50 px-3 py-2">
            <p className="mb-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400">
              Filter by Name / Mobile / Email
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5">
              <Search size={12} className="shrink-0 text-slate-400" />
              <input value={filterInput} onChange={(e) => handleFilterChange(e.target.value)}
                placeholder="Search users..."
                className="min-w-0 flex-1 bg-transparent text-[12px] text-slate-700 outline-none placeholder:text-slate-400" />
              {filterInput && (
                <button onClick={() => handleFilterChange("")}><X size={12} className="text-slate-400" /></button>
              )}
            </div>
            {!convLoading && (
              <p className="mt-1 text-[9px] text-slate-400">
                {filteredAll.length} of {allConversations.length} conversations
              </p>
            )}
          </div>
        )}

        {/* Mine tab search */}
        {tab === "mine" && myConversations.length > 0 && (
          <div className="border-b border-slate-100 px-3 py-2">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5">
              <Search size={12} className="text-slate-400" />
              <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search conversations..."
                className="min-w-0 flex-1 bg-transparent text-[12px] text-slate-700 outline-none placeholder:text-slate-400" />
              {searchInput && (
                <button onClick={() => setSearchInput("")}><X size={12} className="text-slate-400" /></button>
              )}
            </div>
          </div>
        )}

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto [scrollbar-width:thin]">
          {convLoading && (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <RefreshCw size={20} className="animate-spin text-indigo-500" />
              <p className="text-[11px] text-slate-400">
                {tab === "all" ? "Loading all conversations..." : "Loading your sessions..."}
              </p>
            </div>
          )}

          {convError && !convLoading && (
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
              <AlertCircle size={20} className="text-red-400" />
              <p className="text-[11px] text-slate-500">{convError}</p>
              <button onClick={handleRetry}
                className="mt-2 flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-[11px] font-black text-indigo-600">
                <RefreshCw size={10} /> Retry
              </button>
            </div>
          )}

          {!convLoading && displayList.length === 0 && !convError &&
            (tab === "mine" ? myConversations.length > 0 : allConversations.length > 0) && (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <Inbox size={20} className="text-slate-300" />
              <p className="text-[11px] text-slate-400">No matches</p>
            </div>
          )}

          <AnimatePresence>
            {displayList.map((conv) => (
              <motion.button key={conv.id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                onClick={() => loadMessages(conv)}
                className={`w-full border-b border-slate-100 px-3 py-2.5 text-left transition hover:bg-slate-50 sm:px-4 sm:py-3 ${
                  activeConv?.id === conv.id ? "bg-indigo-50 border-l-[3px] border-l-indigo-500" : ""
                }`}>
                <div className="flex items-start gap-2.5">
                  <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${modeColors(conv.mode)} sm:h-8 sm:w-8`}>
                    {modeIcon(conv.mode, 13)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold text-slate-800 sm:text-[13px]">
                      {conv.title || "Untitled"}
                    </p>
                    {tab === "all" && (conv.userName || conv.mobileNumber || conv.email) && (
                      <p className="truncate text-[10px] font-semibold text-slate-600 mt-0.5">
                        {conv.userName || conv.mobileNumber || conv.email}
                      </p>
                    )}
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide sm:text-[9px] ${modeBadgeColors(conv.mode)}`}>
                        {(conv.mode || "").toUpperCase() === "VOICE" ? "Voice" : "Text"}
                      </span>
                      <span className="flex items-center gap-0.5 text-[9px] text-slate-400 sm:text-[10px]">
                        <Clock size={8} /> {fmtShort(conv.lastMessageAt || conv.createdAt)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={13} className={`mt-1 shrink-0 ${activeConv?.id === conv.id ? "text-indigo-500" : "text-slate-300"}`} />
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {(tab === "mine" ? myConversations.length : allConversations.length) > 0 && (
          <div className="border-t border-slate-100 bg-slate-50 px-3 py-2 flex items-center justify-between">
            <p className="text-[10px] text-slate-400">
              {displayList.length} of {tab === "mine" ? myConversations.length : allConversations.length} conv.
            </p>
            <button onClick={handleRetry} disabled={convLoading}
              className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 disabled:opacity-40">
              <RefreshCw size={9} className={convLoading ? "animate-spin" : ""} /> Refresh
            </button>
          </div>
        )}
      </aside>

      {/* ── MESSAGE PANEL ── */}
      <main className={`
        flex min-w-0 flex-1 flex-col bg-slate-50
        overflow-y-auto lg:overflow-hidden
        ${mobileView === "list" ? "hidden lg:flex" : "flex"}
      `}>

        {/* Compact inline conversation bar — docked just below the real topbar.
            IMPORTANT: scrolling on mobile actually happens at the page/window level here,
            not inside this component's own box. That means `position: sticky` measures
            its offset from the top of the *viewport*, which is exactly where the real
            header also lives. `top-0` would pin this bar to that same y=0 spot, and the
            header (painted on top) would hide it as soon as you scroll — which is the
            "disappears under the header" bug. Offsetting by the header's real height
            (56px = h-14, matching the topbar) makes it dock right under the header
            instead of fighting it for the same pixel row. `backdrop-blur` (no shadow)
            keeps it reading as part of the same surface rather than a second header. */}
        {activeConv && (
          <div className="sticky top-14 lg:static z-20 flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white/95 backdrop-blur-sm px-3 py-2">
            <button
              onClick={handleBack}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 active:bg-slate-200 lg:hidden"
            >
              <ChevronLeft size={16} />
            </button>
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] ${modeColors(activeConv.mode)}`}>
              {modeIcon(activeConv.mode, 12)}
            </span>
            <p className="min-w-0 flex-1 truncate text-[12px] font-semibold text-slate-700">
              {activeConv.title || "Untitled"}
              <span className="ml-2 text-[10px] font-normal text-slate-400">
                · {fmtShort(activeConv.lastMessageAt || activeConv.createdAt)}
              </span>
            </p>
            {messages.length > 0 && (
              <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-500">
                {messages.length} msg{messages.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}

        {/* Messages area — starts immediately below the compact bar */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 lg:p-6 [scrollbar-width:thin]">
          {!activeConv && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
                <MessageSquare size={24} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-[14px] font-black text-slate-600">No conversation selected</p>
                <p className="mt-1 text-[11px] text-slate-400">
                  {tab === "mine"
                    ? isAdmin ? "Pick one of your owner sessions" : "Pick a conversation from the list"
                    : "Pick a user session"}
                </p>
              </div>
            </div>
          )}

          {msgLoading && (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <RefreshCw size={20} className="animate-spin text-indigo-500" />
              <p className="text-[11px] text-slate-400">Loading messages...</p>
            </div>
          )}

          {msgError && !msgLoading && (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <AlertCircle size={20} className="text-red-400" />
              <p className="text-[11px] text-slate-500">{msgError}</p>
            </div>
          )}

          {!msgLoading && messages.length > 0 && (
            <div className="mx-auto max-w-3xl space-y-3 sm:space-y-4">
              {messages.map((msg, i) => (
                <motion.div key={msg.id ?? i}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className={`flex items-end gap-2 sm:gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  {msg.role === "assistant" ? (
                    <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-cyan-400/40 bg-slate-800 shadow sm:h-9 sm:w-9">
                      <img src={RADHAI_IMAGE} alt="radhAI" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-indigo-400/50 bg-indigo-600 text-white shadow sm:h-9 sm:w-9">
                      <User size={13} />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2.5 shadow-sm sm:max-w-[75%] sm:px-4 sm:py-3 ${
                    msg.role === "user"
                      ? "rounded-tr-sm bg-indigo-600 text-white"
                      : "rounded-tl-sm border border-slate-200 bg-white text-slate-800"
                  }`}>
                    {msg.role === "assistant" && (
                      <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-cyan-600 sm:text-[10px]">radhAI</p>
                    )}
                    <p className="whitespace-pre-wrap text-[12.5px] leading-5 sm:text-[13.5px] sm:leading-6">{msg.content}</p>
                    <div className={`mt-1.5 flex items-center gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <span className={`text-[9px] sm:text-[10px] ${msg.role === "user" ? "text-indigo-200" : "text-slate-400"}`}>
                        {fmtDate(msg.createdAt)}
                      </span>
                      {msg.role === "assistant" && (
                        <button
                          title={speakingMsgId === msg.id ? "Stop" : "Play aloud"}
                          onClick={() => handleSpeak(msg)}
                          className={`flex h-5 w-5 items-center justify-center rounded-full transition ${
                            speakingMsgId === msg.id
                              ? "bg-red-100 text-red-500 animate-pulse"
                              : "bg-cyan-50 text-cyan-600 hover:bg-cyan-100"
                          }`}>
                          {speakingMsgId === msg.id ? <X size={9} /> : <Volume2 size={9} />}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={chatBottomRef} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}