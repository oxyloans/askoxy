import { useState, useEffect } from "react";

const BASE = `http://localhost:9876/api/vibecode-service`;

const STEP_META: { key: string; label: string; icon: string; color: string }[] = [
  { key: "planning",     label: "Planning",          icon: "🔍", color: "#3B6FFF" },
  { key: "clarification",label: "Clarification",     icon: "💬", color: "#0EA5E9" },
  { key: "techstack",    label: "Tech Stack",         icon: "🛠️", color: "#7C3AED" },
  { key: "usecases",     label: "Use Cases",          icon: "📋", color: "#0EA5E9" },
  { key: "compliance",   label: "Compliance",         icon: "📜", color: "#D97706" },
  { key: "systemdesign", label: "System Design",      icon: "🏗️", color: "#059669" },
  { key: "structure",    label: "Folder Structure",   icon: "📁", color: "#0891B2" },
  { key: "prompt",       label: "Prompt Builder",     icon: "✍️", color: "#9333EA" },
  { key: "backend",      label: "Backend",            icon: "⚙️", color: "#DC2626" },
  { key: "frontend",     label: "Frontend",           icon: "🎨", color: "#EA580C" },
  { key: "database",     label: "Database",           icon: "🗄️", color: "#16A34A" },
  { key: "testcases",    label: "Test Cases & Data",  icon: "🧪", color: "#475569" },
];

interface HistoryItem {
  id: number;
  userId: string;
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

interface HistoryPanelProps {
  mode: "banking" | "insurance";
}

export function HistoryPanel({ mode }: HistoryPanelProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<HistoryItem | null>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const accentColor = mode === "insurance" ? "#7C3AED" : "#3B6FFF";

  useEffect(() => {
    if (!open) return;
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    setLoading(true);
    fetch(`${BASE}/getHistoryByUserId/${userId}`)
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data.reverse() : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    setExpandedStep(null);
  };

  return (
    <>
      {/* Trigger button — top right */}
      <button
        onClick={() => setOpen(true)}
        title="View History"
        style={{
          position: "fixed",
          top: 14,
          right: 20,
          zIndex: 1100,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 14px",
          borderRadius: 20,
          background: "#fff",
          border: `1px solid ${accentColor}30`,
          color: accentColor,
          fontSize: 11,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 2px 10px rgba(0,0,0,.08)",
          letterSpacing: ".04em",
        }}
      >
        🕐 History
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={handleClose}
          style={{
            position: "fixed", inset: 0, zIndex: 1200,
            background: "rgba(0,0,0,.35)", backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 1300,
          width: selected ? 680 : 360,
          background: "#fff",
          boxShadow: "-4px 0 32px rgba(0,0,0,.12)",
          display: "flex", flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform .28s cubic-bezier(.4,0,.2,1), width .22s ease",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "16px 20px", borderBottom: "1px solid #EAECF2",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {selected && (
              <button
                onClick={() => { setSelected(null); setExpandedStep(null); }}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#6B7A99", padding: "0 4px 0 0" }}
              >
                ←
              </button>
            )}
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0D1117" }}>
              {selected ? "Session Detail" : "Generation History"}
            </span>
            {!selected && items.length > 0 && (
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                background: `${accentColor}15`, color: accentColor,
              }}>
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#6B7A99", lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
          {!selected ? (
            /* ── List view ── */
            loading ? (
              <div style={{ padding: 32, textAlign: "center", color: "#A0AABF", fontSize: 13 }}>
                Loading…
              </div>
            ) : items.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
                <p style={{ fontSize: 13, color: "#A0AABF", fontWeight: 500 }}>No history yet</p>
              </div>
            ) : (
              <div style={{ padding: "8px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
                {items.map((item) => {
                  const completedSteps = STEP_META.filter((s) => (item as any)[s.key] !== null).length;
                  const pct = Math.round((completedSteps / STEP_META.length) * 100);
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelected(item)}
                      style={{
                        padding: "12px 14px", borderRadius: 12, cursor: "pointer",
                        border: "1px solid #EAECF2", background: "#FAFBFD",
                        transition: "all .15s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = `${accentColor}40`;
                        (e.currentTarget as HTMLElement).style.background = `${accentColor}06`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "#EAECF2";
                        (e.currentTarget as HTMLElement).style.background = "#FAFBFD";
                      }}
                    >
                      <p style={{
                        fontSize: 12, fontWeight: 600, color: "#0D1117", margin: "0 0 5px",
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                      }}>
                        {item.userPrompt}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                        <span style={{ fontSize: 10, color: "#A0AABF" }}>{formatDate(item.createdAt)}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {/* Progress bar */}
                          <div style={{ width: 60, height: 4, borderRadius: 2, background: "#EAECF2", overflow: "hidden" }}>
                            <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? "#10B981" : accentColor, borderRadius: 2 }} />
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 600, color: pct === 100 ? "#10B981" : accentColor }}>
                            {completedSteps}/{STEP_META.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* ── Detail view ── */
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              {/* Prompt */}
              <div style={{
                padding: "12px 14px", borderRadius: 12,
                background: `${accentColor}08`, border: `1px solid ${accentColor}20`,
              }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: accentColor, letterSpacing: ".1em", textTransform: "uppercase", margin: "0 0 5px" }}>
                  User Prompt
                </p>
                <p style={{ fontSize: 12.5, color: "#0D1117", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                  {selected.userPrompt}
                </p>
                <p style={{ fontSize: 10, color: "#A0AABF", margin: "6px 0 0" }}>
                  {formatDate(selected.createdAt)} · Session: {selected.sessionId.slice(0, 8)}…
                </p>
              </div>

              {/* Steps */}
              {STEP_META.map((s) => {
                const raw = (selected as any)[s.key];
                const hasData = raw !== null && raw !== undefined;
                const isExpanded = expandedStep === s.key;
                let content = "";
                if (hasData) {
                  try { content = typeof raw === "string" ? raw : JSON.stringify(raw, null, 2); }
                  catch { content = String(raw); }
                }
                return (
                  <div
                    key={s.key}
                    style={{
                      borderRadius: 10, border: `1px solid ${hasData ? s.color + "30" : "#EAECF2"}`,
                      background: hasData ? `${s.color}06` : "#FAFBFD",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      onClick={() => hasData && setExpandedStep(isExpanded ? null : s.key)}
                      style={{
                        padding: "10px 14px", display: "flex", alignItems: "center",
                        justifyContent: "space-between", cursor: hasData ? "pointer" : "default",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 14 }}>{s.icon}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: hasData ? "#0D1117" : "#C4CBDA" }}>
                          {s.label}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{
                          fontSize: 9.5, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                          background: hasData ? `${s.color}18` : "#F0F2F8",
                          color: hasData ? s.color : "#C4CBDA",
                        }}>
                          {hasData ? "✓ Done" : "Pending"}
                        </span>
                        {hasData && (
                          <span style={{ fontSize: 11, color: "#A0AABF" }}>{isExpanded ? "▲" : "▼"}</span>
                        )}
                      </div>
                    </div>
                    {isExpanded && hasData && (
                      <div style={{ borderTop: `1px solid ${s.color}20`, padding: "10px 14px" }}>
                        <pre style={{
                          fontSize: 11, lineHeight: 1.65, color: "#1A2035",
                          whiteSpace: "pre-wrap", wordBreak: "break-word",
                          margin: 0, maxHeight: 320, overflowY: "auto",
                          fontFamily: "'Fira Code','Cascadia Code',monospace",
                          scrollbarWidth: "thin",
                        }}>
                          {content}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
