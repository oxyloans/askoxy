import React from "react";
import { WorkflowType, LANGS } from "../hooks/demoData";

type Props = {
  wf: WorkflowType;
  showDecision: boolean;
  isRunning: boolean;
  showCode: boolean;
  setShowCode: (v: boolean) => void;
  executionResult: boolean;
  setExecutionResult: (v: boolean) => void;
  isExecuting: boolean;
  onExecute: () => void;
  lang: string;
  setLang: (l: string) => void;
  typedCode: string;
  generatedCode: string;
};

const EXEC_RESULTS: Record<string, {
  title: string;
  subtitle: string;
  badge: string;
  color: string;
  icon: string;
  metrics: { label: string; value: string; highlight?: boolean }[];
  tags: string[];
}> = {
  onboarding: {
    title: "Customer Onboarded Successfully",
    subtitle: "Identity verified · AML cleared · Account activated",
    badge: "LIVE OUTPUT",
    color: "#00B894",
    icon: "👤",
    metrics: [
      { label: "Customer ID",    value: "CUS-10001",  highlight: true },
      { label: "KYC Status",     value: "VERIFIED",   highlight: true },
      { label: "AML Status",     value: "CLEARED",    highlight: true },
      { label: "Risk Level",     value: "LOW" },
      { label: "Account Status", value: "ACTIVE",     highlight: true },
      { label: "Confidence",     value: "96%" },
    ],
    tags: ["CBUAE Compliant", "KYC Passed", "AML Cleared", "Onboarding Complete"],
  },
  loan: {
    title: "Loan Eligibility Approved",
    subtitle: "Credit score qualified · DTI within policy · Offer generated",
    badge: "LIVE OUTPUT",
    color: "#00B894",
    icon: "🏦",
    metrics: [
      { label: "Decision",       value: "APPROVED",    highlight: true },
      { label: "Max Loan",       value: "AED 250,000", highlight: true },
      { label: "Interest Rate",  value: "3.75% p.a.",  highlight: true },
      { label: "Tenure",         value: "20 Years" },
      { label: "Monthly EMI",    value: "AED 1,485" },
      { label: "Confidence",     value: "92%" },
    ],
    tags: ["CBUAE Policy Met", "DTI: 28%", "Bureau Score: 720", "Pre-Approved"],
  },
  underwriting: {
    title: "Best Loan Product Matched",
    subtitle: "Right loan · Right customer · Right time",
    badge: "LIVE OUTPUT",
    color: "#E17055",
    icon: "🎯",
    metrics: [
      { label: "Decision",        value: "MATCHED",             highlight: true },
      { label: "Best Product",    value: "Home Loan – Prime",   highlight: true },
      { label: "Eligible Amount", value: "AED 420,000",         highlight: true },
      { label: "Rate",            value: "3.49% p.a." },
      { label: "DTI Ratio",       value: "28%" },
      { label: "Confidence",      value: "97%" },
    ],
    tags: ["Responsible Lending", "Behaviour Matched", "Credit Score: 740", "Pre-Approved"],
  },
};

export function OutputPanel({
  wf, showDecision, isRunning, showCode, setShowCode,
  executionResult, setExecutionResult, isExecuting, onExecute,
  lang, setLang, typedCode, generatedCode,
}: Props) {
  const d = wf.decision;
  const exec = EXEC_RESULTS[wf.id] || EXEC_RESULTS.onboarding;
  const stage = executionResult ? "exec" : showCode ? "code" : "decision";

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 16,
      backdropFilter: "blur(20px)",
      overflow: "hidden",
    }}>

      {/* ── Header */}
      <div style={{
        padding: "16px 22px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(0,0,0,0.25)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: showDecision ? 14 : 0 }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Output Panel</span>
          <span style={{
            padding: "5px 14px", borderRadius: 20, fontSize: 14, fontWeight: 700,
            background: isRunning ? "rgba(108,92,231,0.25)" : showDecision ? "rgba(0,184,148,0.2)" : "rgba(255,255,255,0.07)",
            border: `1px solid ${isRunning ? "rgba(108,92,231,0.6)" : showDecision ? "rgba(0,184,148,0.5)" : "rgba(255,255,255,0.12)"}`,
            color: isRunning ? "#a29bfe" : showDecision ? "#00cec9" : "rgba(255,255,255,0.5)",
          }}>
            {isRunning ? "● PROCESSING" : showDecision ? "● READY" : "○ STANDBY"}
          </span>
        </div>

        {showDecision && (
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { key: "decision", label: "① AI Decision" },
              { key: "code",     label: "② Generated Code" },
              { key: "exec",     label: "③ Live Output" },
            ].map(tab => {
              const active = tab.key === stage;
              const locked = tab.key === "exec" && !executionResult;
              return (
                <button key={tab.key}
                  onClick={() => {
                    if (locked) return;
                    if (tab.key === "decision") { setShowCode(false); setExecutionResult(false); }
                    if (tab.key === "code")     { setShowCode(true);  setExecutionResult(false); }
                    if (tab.key === "exec")     { setShowCode(true);  setExecutionResult(true);  }
                  }}
                  style={{
                    flex: 1, padding: "9px 6px", borderRadius: 9,
                    cursor: locked ? "default" : "pointer",
                    fontSize: 14, fontWeight: 700,
                    background: active ? `${wf.color}35` : "rgba(255,255,255,0.05)",
                    border: `1.5px solid ${active ? `${wf.color}80` : "rgba(255,255,255,0.1)"}`,
                    color: active ? "#fff" : locked ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.55)",
                    transition: "all 0.2s",
                  }}>
                  {tab.label}{locked ? " 🔒" : ""}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Body */}
      <div style={{ padding: 22 }}>

        {/* Standby */}
        {!showDecision && !isRunning && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 380, textAlign: "center" }}>
            <div style={{ fontSize: 56, opacity: 0.12, marginBottom: 18 }}>🧠</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Run the AI engine to see output</div>
            <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>Decision · Generated Code · Live Execution</div>
          </div>
        )}

        {/* Running */}
        {isRunning && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 240, gap: 18 }}>
            <div style={{ width: 52, height: 52, border: "3px solid rgba(108,92,231,0.2)", borderTopColor: "#6C5CE7", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <div style={{ color: "#fff", fontSize: 16, fontWeight: 600 }}>OXYBFSAI Engine Processing...</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Running 15-step discovery pipeline</div>
          </div>
        )}

        {/* ── STAGE 1: AI Decision */}
        {showDecision && stage === "decision" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{
              textAlign: "center", padding: "22px 20px", borderRadius: 14, marginBottom: 20,
              background: `${d.verdictColor}20`, border: `2px solid ${d.verdictColor}55`,
            }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
              <div style={{ color: d.verdictColor, fontSize: 26, fontWeight: 900, letterSpacing: "3px" }}>{d.verdict}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 6 }}>AI Decision Complete · {wf.label}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {d.fields.map((f, i) => (
                <div key={i} style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 600, marginBottom: 6, letterSpacing: "0.3px" }}>{f.label}</div>
                  <div style={{ color: "#fff", fontSize: 17, fontWeight: 800 }}>{f.value}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", marginBottom: 18 }}>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 700, marginBottom: 8, letterSpacing: "0.5px" }}>AI REASONING</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 1.7 }}>{d.reasoning}</div>
            </div>

            <button onClick={() => { setShowCode(true); setExecutionResult(false); }} style={{
              width: "100%", padding: "14px", borderRadius: 12,
              background: `linear-gradient(135deg, ${wf.color}, ${wf.color}bb)`,
              border: "none", color: "#fff", fontSize: 15, fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: `0 4px 24px ${wf.color}40`,
            }}>
              ② View Generated Code →
            </button>
          </div>
        )}

        {/* ── STAGE 2: Generated Code */}
        {showDecision && stage === "code" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            {/* Lang tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {LANGS.map(l => (
                <button key={l} onClick={() => setLang(l)} style={{
                  padding: "7px 18px", borderRadius: 9, cursor: "pointer", fontSize: 13, fontWeight: 700,
                  background: l === lang ? `${wf.color}30` : "rgba(255,255,255,0.06)",
                  border: `1.5px solid ${l === lang ? `${wf.color}80` : "rgba(255,255,255,0.12)"}`,
                  color: l === lang ? "#fff" : "rgba(255,255,255,0.55)",
                  transition: "all 0.2s",
                }}>{l}</button>
              ))}
            </div>

            {/* Code window */}
            <div style={{ borderRadius: 12, overflow: "hidden", border: `1.5px solid ${wf.color}40`, marginBottom: 16 }}>
              {/* Title bar */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 16px", background: "#0d1426",
                borderBottom: `1px solid ${wf.color}30`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["#ff5f57", "#ffbd2e", "#28ca41"].map(c => (
                      <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
                    ))}
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontFamily: "monospace", fontWeight: 500 }}>
                    oxybfsai_{wf.id}.{lang === "Python" ? "py" : lang === "Java" ? "java" : "js"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 14, fontWeight: 700, background: "rgba(0,184,148,0.2)", color: "#00cec9", border: "1px solid rgba(0,184,148,0.4)" }}>
                    GENERATED
                  </span>
                  <button onClick={() => navigator.clipboard?.writeText(generatedCode)} style={{
                    padding: "4px 12px", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 600,
                    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff",
                  }}>Copy</button>
                </div>
              </div>

              {/* Code body */}
              <pre style={{
                margin: 0, padding: "20px 22px",
                background: "#070e1c",
                overflow: "auto", maxHeight: 280,
                fontFamily: "'Fira Code', 'Cascadia Code', 'Courier New', monospace",
                fontSize: 13, lineHeight: 2, color: "#a8d8a8",
                whiteSpace: "pre",
              }}>
                {typedCode}
                <span style={{ animation: "blink 1s step-end infinite", color: "#a29bfe" }}>|</span>
              </pre>
            </div>

            {/* Execute button — the hero action */}
            <button onClick={onExecute} disabled={isExecuting} style={{
              width: "100%", padding: "16px", borderRadius: 12,
              background: isExecuting
                ? "rgba(243,156,18,0.15)"
                : "linear-gradient(135deg, #f39c12 0%, #E17055 100%)",
              border: `1.5px solid ${isExecuting ? "rgba(243,156,18,0.4)" : "transparent"}`,
              color: "#fff", fontSize: 16, fontWeight: 900,
              cursor: isExecuting ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              boxShadow: isExecuting ? "none" : "0 6px 36px rgba(243,156,18,0.45)",
              letterSpacing: "0.5px", transition: "all 0.2s",
            }}>
              {isExecuting ? (
                <>
                  <div style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  <span>Executing Code...</span>
                </>
              ) : (
                <span>▶&nbsp;&nbsp;Execute Generated Code</span>
              )}
            </button>
          </div>
        )}

        {/* ── STAGE 3: LIVE EXECUTION OUTPUT */}
        {executionResult && stage === "exec" && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>

            {/* Top badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: exec.color, boxShadow: `0 0 8px ${exec.color}`, animation: "pulse2 1.5s ease-in-out infinite" }} />
              <span style={{ color: exec.color, fontSize: 11, fontWeight: 800, letterSpacing: "2.5px" }}>{exec.badge}</span>
              <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>Execution Time: 1.8s</span>
            </div>

            {/* Hero success card */}
            <div style={{
              padding: "20px 22px", borderRadius: 16, marginBottom: 16,
              background: `linear-gradient(135deg, ${exec.color}22 0%, rgba(0,0,0,0.4) 100%)`,
              border: `2px solid ${exec.color}60`,
              boxShadow: `0 0 40px ${exec.color}18`,
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, flexShrink: 0,
                background: `${exec.color}25`, border: `1.5px solid ${exec.color}50`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
              }}>{exec.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ color: "#fff", fontSize: 17, fontWeight: 900 }}>{exec.title}</span>
                  <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 800, background: "rgba(0,184,148,0.2)", color: "#00B894", border: "1px solid rgba(0,184,148,0.4)" }}>✓ SUCCESS</span>
                </div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{exec.subtitle}</div>
              </div>
            </div>

            {/* Metrics grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              {exec.metrics.map((m, i) => (
                <div key={i} style={{
                  padding: m.highlight ? "14px 16px" : "10px 14px",
                  borderRadius: 12,
                  background: m.highlight ? `${exec.color}18` : "rgba(255,255,255,0.04)",
                  border: `${m.highlight ? 1.5 : 1}px solid ${m.highlight ? `${exec.color}50` : "rgba(255,255,255,0.08)"}`,
                }}>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 700, letterSpacing: "0.8px", marginBottom: 5, textTransform: "uppercase" }}>{m.label}</div>
                  <div style={{
                    color: m.highlight ? exec.color : "#fff",
                    fontSize: m.highlight ? 18 : 15,
                    fontWeight: 900,
                    letterSpacing: m.highlight ? "0.5px" : "0",
                  }}>{m.value}</div>
                </div>
              ))}
            </div>

            {/* Compliance tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {exec.tags.map((tag, i) => (
                <span key={i} style={{
                  padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.6)",
                }}>✓ {tag}</span>
              ))}
            </div>

            {/* Bottom status bar */}
            <div style={{
              padding: "12px 18px", borderRadius: 12, marginBottom: 14,
              background: "rgba(0,184,148,0.1)", border: "1px solid rgba(0,184,148,0.35)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00B894", boxShadow: "0 0 6px #00B894" }} />
                <span style={{ color: "#00B894", fontSize: 13, fontWeight: 800, letterSpacing: "1px" }}>EXECUTION COMPLETE</span>
              </div>
              <div style={{ display: "flex", gap: 18 }}>
                {[
                  { label: "AGENTS", value: `${wf.agents.length} / 4` },
                  { label: "STEPS", value: "15 / 15" },
                  { label: "SCORE", value: d.fields.find(f => f.label === "Confidence")?.value || "94%" },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, letterSpacing: "0.8px" }}>{s.label}</div>
                    <div style={{ color: "#fff", fontSize: 13, fontWeight: 900 }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => { setShowCode(true); setExecutionResult(false); }} style={{
              width: "100%", padding: "11px", borderRadius: 10,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>← Back to Code</button>
          </div>
        )}
      </div>
    </div>
  );
}
