import { useState, useEffect } from "react";
import { usePipeline } from "./hooks/usePipeline";
import { Sidebar } from "./components/Sidebar";
import { LandingView } from "./components/LandingView";
import { CodeView } from "./components/CodeView";
import { PipelineView } from "./components/PipelineView";
import { GenerationResult } from "./type/types";

/* ═══════════════════════════════════════════════════
   ROADMAP DATA
═══════════════════════════════════════════════════ */
const ROADMAP_STEPS = [
  { num: "01", icon: "🔍", title: "Planning",        desc: "Defines domain, actors, and core objectives from your prompt.",     color: "#3B6FFF", bg: "#EEF3FF", border: "#C7D8FF", tag: "Analysis" },
  { num: "02", icon: "🛠️", title: "Tech Stack",      desc: "Picks optimal backend, frontend, database, and infra layers.",      color: "#7C3AED", bg: "#F3EEFF", border: "#DDD6FE", tag: "Architecture" },
  { num: "03", icon: "📋", title: "Use Cases",        desc: "Enumerates every user story and functional flow.",                  color: "#0EA5E9", bg: "#EDF7FF", border: "#BAE6FD", tag: "Requirements" },
  { num: "04", icon: "📜", title: "Compliance",       desc: "Applies RBI, KYC/AML, GDPR, PCI-DSS rules automatically.",        color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", tag: "Regulatory" },
  { num: "05", icon: "🏗️", title: "System Design",   desc: "Architects modules, APIs, and service boundaries at scale.",       color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", tag: "Design" },
  { num: "06", icon: "📁", title: "Folder Structure", desc: "Generates a production-grade directory and file layout.",          color: "#0891B2", bg: "#ECFEFF", border: "#A5F3FC", tag: "Scaffolding" },
  { num: "07", icon: "✍️", title: "Prompt Builder",  desc: "Compiles a precise generation prompt from all prior context.",     color: "#9333EA", bg: "#FDF4FF", border: "#E9D5FF", tag: "Synthesis" },
  { num: "08", icon: "⚙️", title: "Backend",         desc: "Generates controllers, services, models, routes, middleware.",     color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", tag: "Code Gen" },
  { num: "09", icon: "🎨", title: "Frontend",         desc: "Builds UI components, pages, state, and API hooks.",              color: "#EA580C", bg: "#FFF7ED", border: "#FED7AA", tag: "Code Gen" },
  { num: "10", icon: "🗄️", title: "Database",        desc: "Writes schemas, migrations, seed data, and query optimisations.", color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0", tag: "Code Gen" },
  { num: "11", icon: "🔬", title: "Validation",       desc: "Audits the full output for errors, gaps, and security issues.",   color: "#475569", bg: "#F4F6FA", border: "#D1D9E8", tag: "Quality" },
];

/* ═══════════════════════════════════════════════════
   ROADMAP MODAL
═══════════════════════════════════════════════════ */
function RoadmapModal({ onClose }: { onClose: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const close = () => { setVisible(false); setTimeout(onClose, 220); };

  const leftSteps  = ROADMAP_STEPS.slice(0, 6);
  const rightSteps = ROADMAP_STEPS.slice(6);

  const StepCard = ({ s }: { s: typeof ROADMAP_STEPS[0] }) => (
    <div style={{
      background: s.bg,
      border: `1px solid ${s.border}`,
      borderRadius: "14px",
      padding: "12px 14px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Step number — large faded watermark at bottom-right */}
      <span style={{
        position: "absolute", bottom: "-6px", right: "8px",
        fontSize: "48px", fontWeight: 900, color: s.color,
        opacity: 0.09, letterSpacing: "-0.06em",
        fontFamily: "monospace", userSelect: "none", lineHeight: 1,
        pointerEvents: "none",
      }}>{s.num}</span>

      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", position: "relative", zIndex: 1 }}>

        {/* Only the emoji icon on the left */}
        <div style={{
          width: "32px", height: "32px", borderRadius: "9px",
          background: "#FFFFFF", border: `1.5px solid ${s.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "15px", flexShrink: 0,
          boxShadow: `0 2px 6px ${s.color}18`,
        }}>{s.icon}</div>

        {/* Title + tag + desc */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "5px", flexWrap: "wrap" as const }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: s.color, letterSpacing: "-0.02em", lineHeight: 1 }}>
              {s.title}
            </span>
            <span style={{
              fontSize: "8.5px", fontWeight: 700, letterSpacing: ".1em",
              textTransform: "uppercase" as const, padding: "2px 6px", borderRadius: "4px",
              background: "#FFFFFF", color: s.color, border: `1px solid ${s.border}`,
            }}>{s.tag}</span>
          </div>
          <p style={{ fontSize: "11.5px", color: "#596280", lineHeight: 1.6, margin: 0 }}>
            {s.desc}
          </p>
        </div>
      </div>
    </div>
  );

  const DownArrow = ({ fromColor, toColor }: { fromColor: string; toColor: string }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "26px" }}>
      <div style={{
        width: "2px", height: "16px", borderRadius: "1px",
        background: `linear-gradient(to bottom, ${fromColor}88, ${toColor}88)`,
      }} />
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
        <path d="M1 1l4 4 4-4" stroke={toColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes fv-pulse { 0%,100%{opacity:1} 50%{opacity:.25} }
        @keyframes fv-appear { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .finish-badge { animation: fv-appear .4s ease both; animation-delay: .1s; }
      `}</style>

      <div onClick={close} style={{
        position: "fixed", inset: 0, zIndex: 998,
        background: "rgba(8,10,20,0.6)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        transition: "opacity .22s", opacity: visible ? 1 : 0,
      }} />

      <div style={{
        position: "fixed", inset: 0, zIndex: 999,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px", pointerEvents: "none",
      }}>
        <div style={{
          pointerEvents: "all",
          background: "#FFFFFF",
          borderRadius: "24px",
          border: "1px solid #E2E8F4",
          boxShadow: "0 40px 100px rgba(10,14,40,.22), 0 8px 32px rgba(10,14,40,.1)",
          width: "100%", maxWidth: "940px", maxHeight: "92vh",
          display: "flex", flexDirection: "column", overflow: "hidden",
          transition: "opacity .22s, transform .22s",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(22px) scale(.97)",
        }}>

          {/* Header */}
          <div style={{
            padding: "22px 28px 18px",
            borderBottom: "1px solid #F0F2F8",
            display: "flex", alignItems: "flex-start", justifyContent: "space-between",
            background: "linear-gradient(180deg,#FAFBFF 0%,#FFFFFF 100%)",
            flexShrink: 0,
          }}>
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: "#EEF3FF", border: "1px solid #C7D8FF",
                borderRadius: "100px", padding: "3px 12px", marginBottom: "10px",
              }}>
                <span style={{
                  width: "6px", height: "6px", borderRadius: "50%", background: "#3B6FFF",
                  display: "inline-block", animation: "fv-pulse 1.6s ease-in-out infinite",
                }}/>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase" as const, color: "#3B6FFF" }}>
                  AI Generation Pipeline
                </span>
              </div>
              <h2 style={{ fontSize: "21px", fontWeight: 900, color: "#0A0E1A", letterSpacing: "-.04em", margin: "0 0 4px", lineHeight: 1.15 }}>
                How{" "}
                <span style={{ background: "linear-gradient(90deg,#3B6FFF,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  FINVIBE
                </span>{" "}
                builds your app — step by step
              </h2>
              <p style={{ fontSize: "13px", color: "#6B7A99", margin: 0, lineHeight: 1.5 }}>
                11 sequential AI stages · Each feeds its output directly into the next · Done in under 180 seconds
              </p>
            </div>
            <button onClick={close} style={{
              width: "32px", height: "32px", borderRadius: "9px",
              border: "1px solid #E4E8F4", background: "#F8F9FC",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              color: "#8A96AD", fontSize: "14px", flexShrink: 0, marginTop: "2px",
              transition: "background .15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#EEF0F8"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#F8F9FC"; }}
            >✕</button>
          </div>

          {/* Body */}
          <div style={{ overflowY: "auto", padding: "22px 28px 26px", scrollbarWidth: "thin", scrollbarColor: "#E4E8F4 transparent" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>

              {/* LEFT: steps 1–6 */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {leftSteps.map((s, i) => {
                  const isLast = i === leftSteps.length - 1;
                  return (
                    <div key={s.num}>
                      <StepCard s={s} />
                      {!isLast && <DownArrow fromColor={s.color} toColor={leftSteps[i + 1].color} />}
                    </div>
                  );
                })}
              </div>

              {/* Divider */}
              <div style={{
                width: "1px", alignSelf: "stretch", flexShrink: 0,
                background: "linear-gradient(to bottom, transparent, #E2E8F4 20%, #E2E8F4 80%, transparent)",
              }} />

              {/* RIGHT: steps 7–11 */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {rightSteps.map((s, i) => {
                  const isLast = i === rightSteps.length - 1;
                  return (
                    <div key={s.num}>
                      <StepCard s={s} />
                      {!isLast && <DownArrow fromColor={s.color} toColor={rightSteps[i + 1].color} />}
                    </div>
                  );
                })}

                {/* Finish badge */}
                <div style={{ marginTop: "6px" }}>
                  <DownArrow fromColor="#475569" toColor="#3B6FFF" />
                  <div className="finish-badge" style={{
                    background: "linear-gradient(135deg, #EEF3FF, #F0EEFF)",
                    border: "1.5px solid #C7D0FF",
                    borderRadius: "14px",
                    padding: "14px 18px",
                    display: "flex", alignItems: "center", gap: "12px",
                    boxShadow: "0 4px 20px rgba(59,111,255,.12)",
                  }}>
                    <div style={{
                      width: "38px", height: "38px", borderRadius: "10px", flexShrink: 0,
                      background: "linear-gradient(135deg,#3B6FFF,#7C3AED)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "18px", boxShadow: "0 4px 14px rgba(59,111,255,.3)",
                    }}>🚀</div>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 800, color: "#1A1F4B", margin: "0 0 2px", letterSpacing: "-.02em" }}>
                        Your app is ready!
                      </p>
                      <p style={{ fontSize: "11px", color: "#6B7A99", margin: 0 }}>
                        Full backend, frontend & database — production-ready in &lt;60s.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Speed strip — light blue/purple theme (no dark bg) ── */}
            <div style={{
              marginTop: "20px",
              padding: "14px 18px",
              background: "linear-gradient(135deg, #EEF3FF, #F3EEFF)",
              border: "1px solid #C7D0FF",
              borderRadius: "14px",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px",
              flexWrap: "wrap" as const,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>⚡</span>
                <div>
                  <p style={{ fontSize: "12.5px", fontWeight: 700, color: "#1A1F4B", margin: "0 0 1px", letterSpacing: "-.02em" }}>
                    All 11 stages complete in under 60 seconds
                  </p>
                  <p style={{ fontSize: "11px", color: "#6B7A99", margin: 0 }}>
                    Every stage streams live — watch your app materialise token by token.
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", flexShrink: 0, flexWrap: "wrap" as const }}>
                {(["Analysis", "Architecture", "Code Gen", "Quality"] as const).map((tag, i) => (
                  <span key={tag} style={{
                    fontSize: "9.5px", fontWeight: 700, letterSpacing: ".1em",
                    textTransform: "uppercase" as const, padding: "3px 9px", borderRadius: "6px",
                    background: ["#EEF3FF", "#F3EEFF", "#FEF2F2", "#F4F6FA"][i],
                    color: ["#3B6FFF", "#7C3AED", "#DC2626", "#475569"][i],
                    border: `1px solid ${["#C7D8FF", "#DDD6FE", "#FECACA", "#D1D9E8"][i]}`,
                  }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: "14px 28px", borderTop: "1px solid #F0F2F8",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#FAFBFF", flexShrink: 0,
          }}>
            <span style={{ fontSize: "11.5px", color: "#9AAABE" }}>
              Left col (Steps 1–6) → Right col (Steps 7–11)
            </span>
            <button onClick={close} style={{
              padding: "9px 26px", borderRadius: "10px", border: "none",
              background: "linear-gradient(135deg,#3B6FFF,#7C3AED)",
              color: "#FFF", fontSize: "13px", fontWeight: 700, cursor: "pointer",
              letterSpacing: "-.01em", boxShadow: "0 4px 16px rgba(59,111,255,.32)",
              transition: "box-shadow .2s, transform .2s", whiteSpace: "nowrap" as const,
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(59,111,255,.46)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(59,111,255,.32)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              Got it — let's build ⚡
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════ */
export default function Landing() {
  const {
    steps, result, partialResult, chatMessage, running, paused, error,
    stepTokens, prompt, clarificationQuestion, run, answerQuestion,
  } = usePipeline();

  const hasStarted = steps.some((s) => s.status !== "idle");
  const [codeViewResult, setCodeViewResult] = useState<GenerationResult | null>(null);
  const [showRoadmap, setShowRoadmap] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("fv_seen")) {
      const t = setTimeout(() => {
        setShowRoadmap(true);
        sessionStorage.setItem("fv_seen", "1");
      }, 500);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{ background: "#F8F9FC", fontFamily: "'DM Sans','Helvetica Neue',system-ui,sans-serif" }}
    >
      {showRoadmap && <RoadmapModal onClose={() => setShowRoadmap(false)} />}

      <Sidebar running={running} result={result} codeViewResult={codeViewResult} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {codeViewResult ? (
          <CodeView result={codeViewResult} onBack={() => setCodeViewResult(null)} />
        ) : !hasStarted ? (
          <LandingView
            running={running}
            onRun={run}
            onViewRoadmap={() => setShowRoadmap(true)}
          />
        ) : (
          <PipelineView
            steps={steps}
            stepTokens={stepTokens}
            result={result}
            partialResult={partialResult}
            running={running}
            paused={paused}
            error={error}
            chatMessage={chatMessage}
            prompt={prompt}
            clarificationQuestion={clarificationQuestion}
            onRun={run}
            onAnswer={answerQuestion}
            onViewCode={setCodeViewResult}
          />
        )}
      </main>
    </div>
  );
}