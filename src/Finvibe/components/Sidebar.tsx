import { useState, useEffect } from "react";
import { GenerationResult } from "../type/types";

interface HistoryItem {
  id: number;
  sessionId: string;
  userPrompt: string;
  createdAt: number[];
  planning: string | null;
  clarification: string | null;
  techstack: string | null;
  usecases: string | null;
  compliance: string | null;
  systemdesign: string | null;
  structure: string | null;
  prompt: string | null;
  backend: string | null;
  frontend: string | null;
  database: string | null;
  testcases: string | null;
}

function formatDate(arr: number[]) {
  if (!arr || arr.length < 3) return "";
  const [y, m, d, h = 0, min = 0] = arr;
  return `${d.toString().padStart(2, "0")}/${m.toString().padStart(2, "0")}/${y} ${h.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
}

const BANKING_CAPABILITIES = [
  { icon: "🏦", label: "Local Area Banks", sub: "Regional banking services" },
  { icon: "🏛️", label: "All India Financial Institutions", sub: "National financial institutions" },
  { icon: "💳", label: "Payments Banks", sub: "Digital payments · Deposits" },
  { icon: "🌾", label: "Regional Rural Banks", sub: "Rural banking services" },
  { icon: "🏙️", label: "Urban Co-operative Banks", sub: "City-based cooperative banking" },
  { icon: "🏠", label: "Non-Banking Financial Companies", sub: "Loans · Finance services" },
  { icon: "🔄", label: "Asset Reconstruction Companies", sub: "Bad asset recovery · NPA management" },
  { icon: "🏦", label: "Small Finance Banks", sub: "Financial inclusion · Micro loans" },
  { icon: "📊", label: "Credit Information Companies", sub: "Credit scores · Reports" },
  { icon: "🏛️", label: "Commercial Banks", sub: "Retail · Corporate banking" },
  { icon: "🌱", label: "Rural Co-operative Banks", sub: "Agricultural finance · Rural credit" },
];

const INSURANCE_CAPABILITIES = [
  { icon: "🛡️", label: "Life Insurance", sub: "Term · ULIP · Endowment · Pension" },
  { icon: "🔒", label: "General Insurance", sub: "Health · Motor · Property · Travel" },
];

interface SidebarProps {
  running: boolean;
  result: GenerationResult | null;
  codeViewResult: GenerationResult | null;
  selectedBank: string | null;
  onSelectBank: (label: string) => void;
  mode: "banking" | "insurance";
  onLoadHistory: (item: HistoryItem) => void;
  fetchHistory: () => Promise<any[]>;
  onNewChat: () => void;
}

export type { HistoryItem };

export function Sidebar({ running, result, codeViewResult, selectedBank, onSelectBank, mode, onLoadHistory, fetchHistory, onNewChat }: SidebarProps) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (!historyOpen) return;
    setHistoryLoading(true);
    fetchHistory()
      .then(setHistoryItems)
      .finally(() => setHistoryLoading(false));
  }, [historyOpen, fetchHistory]);
  const isInsurance = mode === "insurance";
  const capabilities = isInsurance ? INSURANCE_CAPABILITIES : BANKING_CAPABILITIES;

  const accentColor = isInsurance ? "#7C3AED" : "#3B6FFF";
  const accentBg = isInsurance ? "#F3EEFF" : "#EEF3FF";
  const accentBorder = isInsurance ? "#DDD6FE" : "#C7D8FF";
  const activeBg = isInsurance ? "#F3EEFF" : "#EEF3FF";
  const hoverBg = isInsurance ? "#FAF5FF" : "#F4F6FF";
  const logoGradient = isInsurance
    ? "linear-gradient(135deg, #7C3AED 0%, #a855f7 100%)"
    : "linear-gradient(135deg, #3B6FFF 0%, #7C3AED 100%)";
  const logoLetter = isInsurance ? "I" : "F";
  const brandName = isInsurance ? "INSURVIBE" : "FINVIBE";

  return (
    <aside
      className="w-[280px] shrink-0 flex flex-col overflow-hidden"
      style={{ background: "#FFFFFF", borderRight: "1px solid #EAECF2", boxShadow: "1px 0 0 0 #F0F2F8", position: "relative" }}
    >
      {/* Logo — compact */}
      <div className="px-4 pt-3 pb-3 flex items-center gap-2.5 shrink-0" style={{ borderBottom: "1px solid #F0F2F8" }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-white shrink-0"
          style={{ background: logoGradient, boxShadow: `0 3px 8px ${accentColor}40` }}
        >
          {logoLetter}
        </div>
        <div>
          <p className="text-[14px] font-bold leading-none tracking-tight" style={{ color: "#0D1117" }}>
            {brandName}
          </p>
          <p className="text-[9px] mt-0.5 uppercase tracking-[0.16em] font-semibold" style={{ color: "#A0AABF" }}>
            App Builder
          </p>
        </div>
      </div>

      {/* History + New Chat — inline row */}
      <div className="px-4 pt-2.5 pb-2 shrink-0 flex items-center gap-2">
        <button
          onClick={() => setHistoryOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150"
          style={{ background: `${accentColor}12`, border: `1px solid ${accentColor}30`, cursor: "pointer", flex: 1 }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${accentColor}22`; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${accentColor}12`; }}
        >
          <span style={{ fontSize: 12 }}>🕐</span>
          <span className="text-[11px] font-semibold" style={{ color: accentColor }}>History</span>
        </button>
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150"
          style={{ background: "#F0F2F8", border: "1px solid #D8DCE8", cursor: "pointer", flex: 1 }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#E4E8F4"; (e.currentTarget as HTMLElement).style.borderColor = `${accentColor}40`; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#F0F2F8"; (e.currentTarget as HTMLElement).style.borderColor = "#D8DCE8"; }}
        >
          <span style={{ fontSize: 12 }}>✏️</span>
          <span className="text-[11px] font-semibold" style={{ color: "#6B7A99" }}>New Chat</span>
        </button>
      </div>

      {/* Section label */}
      <div className="px-5 pt-3 pb-2 shrink-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: accentColor }}>
          {isInsurance ? "Insurance Types" : "Capabilities"}
        </p>
      </div>

      {/* Capability list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 flex flex-col gap-0.5" style={{ scrollbarWidth: "none" }}>
        {capabilities.map((cap) => (
          <div
            key={cap.label}
            className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 cursor-pointer"
            style={{
              color: "#0D1117",
              background: selectedBank === cap.label ? activeBg : "transparent",
              borderLeft: selectedBank === cap.label ? `2.5px solid ${accentColor}` : "2.5px solid transparent",
            }}
            onClick={() => onSelectBank(cap.label)}
            onMouseEnter={(e) => {
              if (selectedBank !== cap.label)
                (e.currentTarget as HTMLElement).style.background = hoverBg;
            }}
            onMouseLeave={(e) => {
              if (selectedBank !== cap.label)
                (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <span className="text-sm leading-none shrink-0">{cap.icon}</span>
            <div className="min-w-0">
              <p className="text-[11.5px] font-semibold leading-none truncate" style={{ color: "#1A2035" }}>
                {cap.label}
              </p>
              <p className="text-[10px] mt-0.5 truncate" style={{ color: "#8A96AD" }}>
                {cap.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* History overlay — slides in from left */}
      <div
        style={{
          position: "absolute", top: 0, left: 0, bottom: 0, zIndex: 50,
          width: "100%",
          background: "#fff",
          display: "flex", flexDirection: "column",
          borderRight: "1px solid #EAECF2",
          transform: historyOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
          pointerEvents: historyOpen ? "auto" : "none",
        }}
      >
          {/* Header */}
          <div style={{ padding: "14px 16px 12px", borderBottom: `2px solid ${accentColor}22`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: `linear-gradient(135deg,${accentColor}10,${accentColor}04)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg,${accentColor},${accentColor}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🕐</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: accentColor, margin: 0, letterSpacing: "-.01em" }}>History</p>
                <p style={{ fontSize: 9.5, color: "#A0AABF", margin: 0 }}>Click to load a session</p>
              </div>
            </div>
            <button onClick={() => setHistoryOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#6B7A99", lineHeight: 1, padding: "2px 4px" }}>×</button>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "8px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
            {historyLoading ? (
              <p style={{ fontSize: 11, color: "#A0AABF", textAlign: "center", padding: 20 }}>Loading…</p>
            ) : historyItems.length === 0 ? (
              <div style={{ textAlign: "center", padding: 24 }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>📭</div>
                <p style={{ fontSize: 11, color: "#A0AABF" }}>No history yet</p>
              </div>
            ) : historyItems.map((item) => {
              const completedCount = ["planning","clarification","techstack","usecases","compliance","systemdesign","structure","prompt","backend","frontend","database","testcases"]
                .filter((k) => (item as any)[k] !== null).length;
              const pct = Math.round((completedCount / 12) * 100);
              return (
                <div
                  key={item.id}
                  onClick={() => { onLoadHistory(item); setHistoryOpen(false); }}
                  style={{ padding: "11px 12px", borderRadius: 12, cursor: "pointer", border: "1px solid #EAECF2", background: "#FAFBFD", transition: "all .15s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${accentColor}40`; (e.currentTarget as HTMLElement).style.background = `${accentColor}06`; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#EAECF2"; (e.currentTarget as HTMLElement).style.background = "#FAFBFD"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                >
                  <p style={{ fontSize: 11.5, fontWeight: 600, color: "#0D1117", margin: "0 0 6px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden", lineHeight: 1.45 }}>
                    {item.userPrompt}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 9.5, color: "#A0AABF" }}>{formatDate(item.createdAt)}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 48, height: 3, borderRadius: 2, background: "#EAECF2", overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? "#10B981" : accentColor, borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 9.5, fontWeight: 600, color: pct === 100 ? "#10B981" : accentColor }}>{completedCount}/12</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
      </div>

      {/* Status pill */}
      <div className="px-4 pb-5 shrink-0">
        <div
          className="rounded-xl px-3.5 py-2.5 flex items-center justify-between"
          style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
        >
          <p className="text-[10px] uppercase tracking-[0.14em] font-bold" style={{ color: "#8A96AD" }}>
            Status
          </p>
          <div className="flex items-center gap-1.5">
            {codeViewResult ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                <span className="text-[11px] font-semibold text-violet-600">Code View</span>
              </>
            ) : running ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
                <span className="text-[11px] font-semibold text-blue-600">Building…</span>
              </>
            ) : result ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-[11px] font-semibold text-emerald-600">Complete</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#C5CDDF" }} />
                <span className="text-[11px] font-semibold" style={{ color: "#8A96AD" }}>Ready</span>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
