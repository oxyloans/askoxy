import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { WORKFLOWS, SYSTEMS } from "./components/demoData";
import { AgentPanel } from "./components/AgentPanel";
import { OutputPanel } from "./components/OutputPanel";

const panel: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 16,
  backdropFilter: "blur(20px)",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 10, color: "#fff",
  fontSize: 15, outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

function GlobalStyles() {
  return (
    <style>{`
      @keyframes fadeIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      @keyframes slideIn { from{opacity:0;transform:translateX(18px)} to{opacity:1;transform:translateX(0)} }
      @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      @keyframes spin { to{transform:rotate(360deg)} }
      @keyframes pulse2 { 0%,100%{opacity:1} 50%{opacity:0.4} }
    `}</style>
  );
}

function StepDots({ step, total, color }: { step: number; total: number; color: string }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {[...Array(total)].map((_, i) => (
        <div key={i} style={{
          width: i === step ? 24 : 8, height: 8, borderRadius: 4,
          background: i === step ? color : i < step ? "#00B894" : "rgba(255,255,255,0.2)",
          transition: "all 0.3s ease",
        }} />
      ))}
    </div>
  );
}

export default function LiveAIDemo() {
  const navigate = useNavigate();
  const [activeWf, setActiveWf]               = useState(0);
  const [step, setStep]                       = useState(0);
  const [lang, setLang]                       = useState("Node.js");
  const [formData, setFormData]               = useState<Record<string, string>>({});
  const [uploadedDocs, setUploadedDocs]       = useState<string[]>([]);
  const [isRunning, setIsRunning]             = useState(false);
  const [showDecision, setShowDecision]       = useState(false);
  const [showCode, setShowCode]               = useState(false);
  const [executionResult, setExecutionResult] = useState(false);
  const [isExecuting, setIsExecuting]         = useState(false);
  const [generatedCode, setGeneratedCode]     = useState("");
  const [typedCode, setTypedCode]             = useState("");
  const fileRef  = useRef<HTMLInputElement>(null);
  const row2Ref  = useRef<HTMLDivElement>(null);

  const wf = WORKFLOWS[activeWf];

  useEffect(() => {
    const defaults: Record<string, string> = {};
    wf.fields.forEach(f => { defaults[f.key] = f.demo; });
    setFormData(defaults);
    setUploadedDocs([]);
    setShowDecision(false); setShowCode(false);
    setIsRunning(false); setIsExecuting(false);
    setExecutionResult(false);
    setGeneratedCode(""); setTypedCode(""); setStep(0);
  }, [activeWf]);

  useEffect(() => {
    if (!generatedCode) return;
    setTypedCode("");
    let i = 0;
    const iv = setInterval(() => {
      i += 4;
      setTypedCode(generatedCode.slice(0, i));
      if (i >= generatedCode.length) clearInterval(iv);
    }, 12);
    return () => clearInterval(iv);
  }, [generatedCode]);

  useEffect(() => {
    if (!showDecision) return;
    const tmpl = wf.codeTemplate(lang, formData);
    setGeneratedCode(tmpl[lang.toLowerCase().replace(".", "")] || tmpl["nodejs"]);
  }, [lang]);

  const handleRunEngine = () => {
    setIsRunning(true);
    setShowDecision(false); setShowCode(false);
    setIsExecuting(false); setExecutionResult(false);
    setStep(3);
    setTimeout(() => {
      row2Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    setTimeout(() => {
      const tmpl = wf.codeTemplate(lang, formData);
      setGeneratedCode(tmpl[lang.toLowerCase().replace(".", "")] || tmpl["nodejs"]);
      setShowDecision(true);
      setShowCode(true);
      setIsRunning(false);
    }, 3200);
  };

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => { setIsExecuting(false); setExecutionResult(true); }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    setUploadedDocs(prev => [...prev, ...files.map(f => f.name)]);
  };

  const btnPrimary = (color: string): React.CSSProperties => ({
    padding: "13px 24px", borderRadius: 10,
    background: color, border: "none",
    color: "#fff", fontSize: 16, fontWeight: 700,
    cursor: "pointer", transition: "opacity 0.2s",
  });

  const btnSecondary: React.CSSProperties = {
    padding: "12px 20px", borderRadius: 10,
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.18)",
    color: "rgba(255,255,255,0.85)", fontSize: 15,
    cursor: "pointer",
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", position: "relative", background: "#030712" }}>
      <GlobalStyles />

      {/* Background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-15%", left: "-8%", width: "45%", height: "45%", borderRadius: "50%", background: "radial-gradient(circle, rgba(108,92,231,0.07) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "-15%", right: "-8%", width: "45%", height: "45%", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,184,148,0.06) 0%, transparent 70%)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* HEADER */}
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", background: "rgba(3,7,18,0.92)", backdropFilter: "blur(20px)", padding: "0 32px", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 66 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)", fontSize: 14, cursor: "pointer", fontWeight: 500 }}>← Back</button>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #6C5CE7, #00B894)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff" }}>OB</div>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 17, letterSpacing: "0.5px" }}>OXY BFSAI</div>
                <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, letterSpacing: "1px" }}>AI DISCOVERY & DECISION PLATFORM</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {["AE", "SA", "IN", "SG"].map(c => (
                <span key={c} style={{ padding: "4px 12px", borderRadius: 6, fontSize: 13, fontWeight: 600, background: "rgba(108,92,231,0.18)", color: "#c4b5fd", border: "1px solid rgba(108,92,231,0.35)" }}>{c}</span>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#00cec9", fontSize: 14, marginLeft: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00cec9", animation: "pulse2 2s ease-in-out infinite" }} />
                LIVE
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "44px 24px" }}>

          {/* HERO */}
          <div style={{ textAlign: "center", marginBottom: 48, animation: "fadeIn 0.6s ease" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: 100, background: "rgba(108,92,231,0.15)", border: "1px solid rgba(108,92,231,0.35)", color: "#c4b5fd", fontSize: 14, fontWeight: 600, letterSpacing: "1px", marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c4b5fd", display: "inline-block", animation: "pulse2 2s ease-in-out infinite" }} />
              OXY BFSAI · LIVE AI DEMO
            </div>
            <h1 style={{ color: "#fff", fontSize: 46, fontWeight: 800, margin: "0 0 16px", letterSpacing: "-0.5px", lineHeight: 1.15 }}>
              Transform Manual Operations into<br />
              <span style={{ background: "linear-gradient(90deg, #6C5CE7, #00B894)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                AI-Powered Decisions &amp; Automation
              </span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 18, margin: "0 auto", maxWidth: 640, lineHeight: 1.7 }}>
              OXYBFSAI doesn't just recommend — it generates executable code and delivers measurable business outcomes.
            </p>

            {/* Flow strip */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginTop: 28, flexWrap: "wrap" }}>
              {[
                { label: "Manual Process",   color: 0 },
                { label: "AI Discovery",     color: 1 },
                { label: "AI Decision",      color: 1 },
                { label: "Generated Code",   color: 2 },
                { label: "Execute Code",     color: 3 },
                { label: "Live Output",      color: 3 },
                { label: "Business Outcome", color: 3 },
              ].map((s, i, arr) => (
                <React.Fragment key={s.label}>
                  <div style={{
                    padding: "8px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600,
                    background: s.color === 0 ? "rgba(255,255,255,0.07)" : s.color === 3 ? "rgba(0,184,148,0.16)" : s.color === 2 ? "rgba(225,112,85,0.14)" : "rgba(108,92,231,0.16)",
                    border: `1px solid ${s.color === 0 ? "rgba(255,255,255,0.14)" : s.color === 3 ? "rgba(0,184,148,0.35)" : s.color === 2 ? "rgba(225,112,85,0.3)" : "rgba(108,92,231,0.3)"}`,
                    color: s.color === 0 ? "rgba(255,255,255,0.65)" : s.color === 3 ? "#00cec9" : s.color === 2 ? "#E17055" : "#c4b5fd",
                  }}>{s.label}</div>
                  {i < arr.length - 1 && <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, margin: "0 4px" }}>→</div>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* WORKFLOW TABS */}
          <div style={{ display: "flex", gap: 12, marginBottom: 32, justifyContent: "center", flexWrap: "wrap" }}>
            {WORKFLOWS.map((w, i) => (
              <button key={w.id} onClick={() => setActiveWf(i)} style={{
                padding: "14px 30px", borderRadius: 14, cursor: "pointer",
                border: `1px solid ${i === activeWf ? w.color : "rgba(255,255,255,0.1)"}`,
                background: i === activeWf ? `${w.color}20` : "rgba(255,255,255,0.04)",
                color: i === activeWf ? "#fff" : "rgba(255,255,255,0.72)",
                fontSize: 16, fontWeight: i === activeWf ? 700 : 500,
                transition: "all 0.25s", outline: "none",
                boxShadow: i === activeWf ? `0 0 24px ${w.color}28` : "none",
              }}>
                <span style={{ marginRight: 8, fontSize: 18 }}>{w.icon}</span>{w.label}
              </button>
            ))}
          </div>

          {/* LAYOUT: Row 1 full-width input, Row 2 side-by-side */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* ROW 1: Input Form — full width */}
            <div style={{ ...panel, padding: 26, animation: "fadeIn 0.5s ease" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: `${wf.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{wf.icon}</div>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 17 }}>{wf.label}</div>
                    <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 2 }}>{wf.subtitle}</div>
                  </div>
                </div>
                <StepDots step={step < 3 ? step : 2} total={3} color={wf.color} />
              </div>

              {step < 3 && (
                <>
                  {/* Step indicator */}
                  <div style={{ display: "flex", marginBottom: 20 }}>
                    {["Parameters", "Documents", "Review"].map((s, i) => (
                      <div key={s} style={{ flex: 1, textAlign: "center" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {i > 0 && <div style={{ flex: 1, height: 1, background: i <= step ? wf.color : "rgba(255,255,255,0.1)" }} />}
                          <div style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: i < step ? wf.color : i === step ? `${wf.color}30` : "rgba(255,255,255,0.07)", border: `1.5px solid ${i <= step ? wf.color : "rgba(255,255,255,0.14)"}`, color: i <= step ? "#fff" : "rgba(255,255,255,0.45)", fontSize: 12, fontWeight: 700 }}>{i < step ? "✓" : i + 1}</div>
                          {i < 2 && <div style={{ flex: 1, height: 1, background: i < step ? wf.color : "rgba(255,255,255,0.1)" }} />}
                        </div>
                        <div style={{ color: i === step ? "#fff" : "rgba(255,255,255,0.55)", fontSize: 14, marginTop: 6, fontWeight: i === step ? 600 : 400 }}>{s}</div>
                      </div>
                    ))}
                  </div>

                  {/* Step 0: Parameters */}
                  {step === 0 && (
                    <div style={{ animation: "fadeIn 0.3s ease" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 18 }}>
                        {wf.fields.map(f => (
                          <div key={f.key}>
                            <label style={{ display: "block", color: "rgba(255,255,255,0.85)", fontSize: 14, marginBottom: 6, fontWeight: 600 }}>{f.label}</label>
                            <input type={f.type} value={formData[f.key] || ""} onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} />
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setStep(1)} style={{ ...btnPrimary(wf.color), width: "100%" }}>Next: Documents →</button>
                    </div>
                  )}

                  {/* Step 1: Documents */}
                  {step === 1 && (
                    <div style={{ animation: "fadeIn 0.3s ease" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                        {wf.documents.map((doc, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 10, background: uploadedDocs[i] ? "rgba(0,184,148,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${uploadedDocs[i] ? "rgba(0,184,148,0.35)" : "rgba(255,255,255,0.1)"}` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ fontSize: 18 }}>{uploadedDocs[i] ? "✅" : "📄"}</span>
                              <div>
                                <div style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>{doc}</div>
                                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>{uploadedDocs[i] || "PDF, JPG up to 10MB"}</div>
                              </div>
                            </div>
                            <button onClick={() => fileRef.current?.click()} style={{ ...btnSecondary, padding: "5px 14px", fontSize: 13 }}>Upload</button>
                          </div>
                        ))}
                        <input ref={fileRef} type="file" multiple style={{ display: "none" }} onChange={handleFileChange} />
                      </div>
                      <div style={{ padding: "10px 14px", borderRadius: 9, background: "rgba(225,112,85,0.1)", border: "1px solid rgba(225,112,85,0.25)", color: "rgba(255,255,255,0.8)", fontSize: 14, marginBottom: 14 }}>
                        📌 Demo mode — documents optional for AI engine execution.
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={() => setStep(0)} style={btnSecondary}>← Back</button>
                        <button onClick={() => setStep(2)} style={{ ...btnPrimary(wf.color), flex: 1 }}>Review →</button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Review */}
                  {step === 2 && (
                    <div style={{ animation: "fadeIn 0.3s ease" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                        {wf.fields.map((f, i) => (
                          <div key={f.key} style={{ display: "flex", justifyContent: "space-between", padding: "11px 16px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 14 }}>{f.label}</span>
                            <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{formData[f.key] || "—"}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, letterSpacing: "0.5px", marginBottom: 8, fontWeight: 600 }}>DEPENDENCY CHAIN</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {wf.dependencies.map((d, i) => (
                            <span key={i} style={{ padding: "5px 13px", borderRadius: 20, fontSize: 13, background: "rgba(108,92,231,0.15)", border: "1px solid rgba(108,92,231,0.3)", color: "#c4b5fd" }}>{d}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={() => setStep(1)} style={btnSecondary}>← Back</button>
                        <button onClick={handleRunEngine} style={{ ...btnPrimary(wf.color), flex: 1 }}>🚀 Run AI Engine</button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {step === 3 && (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  <div style={{ padding: "13px 16px", borderRadius: 10, marginBottom: 16, background: "rgba(0,184,148,0.1)", border: "1px solid rgba(0,184,148,0.3)", color: "#00cec9", fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{isRunning ? "⚙️" : "✅"}</span>
                    {isRunning ? "OXYBFSAI Engine Processing..." : `Decision ready · ${wf.fields.length} params · ${wf.agents.length} agents`}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                    {wf.fields.slice(0, 4).map(f => (
                      <div key={f.key} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderRadius: 8, background: "rgba(255,255,255,0.05)" }}>
                        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>{f.label}</span>
                        <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{formData[f.key]}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { setStep(0); setShowDecision(false); setShowCode(false); setIsRunning(false); setExecutionResult(false); }} style={{ ...btnSecondary, width: "100%" }}>← New Request</button>
                </div>
              )}
            </div>

            {/* ROW 2: AI Execution (left) + Output Panel (right) */}
            <div ref={row2Ref} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start", scrollMarginTop: 80 }}>

              {/* LEFT: AI Agent Execution */}
              <div style={{ ...panel, padding: 26, animation: "slideIn 0.5s ease" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 17 }}>AI Agent Execution</div>
                    <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 3 }}>Live processing view</div>
                  </div>
                  <div style={{ padding: "5px 14px", borderRadius: 20, fontSize: 14, fontWeight: 700, background: isRunning ? "rgba(108,92,231,0.2)" : showDecision ? "rgba(0,184,148,0.15)" : "rgba(255,255,255,0.07)", border: `1px solid ${isRunning ? "rgba(108,92,231,0.45)" : showDecision ? "rgba(0,184,148,0.35)" : "rgba(255,255,255,0.12)"}`, color: isRunning ? "#c4b5fd" : showDecision ? "#00cec9" : "rgba(255,255,255,0.55)" }}>
                    {isRunning ? "RUNNING" : showDecision ? "COMPLETE" : "STANDBY"}
                  </div>
                </div>

                <AgentPanel agents={wf.agents} color={wf.color} running={isRunning} showDone={showDecision} />

                <div style={{ marginTop: 20, padding: "14px 16px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}>
                  <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, letterSpacing: "0.5px", marginBottom: 10, fontWeight: 600 }}>REGULATORY COMPLIANCE</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["CBUAE", "RBI", "SAMA", "MAS"].map(r => (
                      <span key={r} style={{ padding: "5px 14px", borderRadius: 6, fontSize: 14, fontWeight: 600, background: "rgba(108,92,231,0.15)", color: "#c4b5fd", border: "1px solid rgba(108,92,231,0.25)" }}>{r}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: Output Panel */}
              <OutputPanel
                wf={wf}
                showDecision={showDecision}
                isRunning={isRunning}
                showCode={showCode}
                setShowCode={setShowCode}
                executionResult={executionResult}
                setExecutionResult={setExecutionResult}
                isExecuting={isExecuting}
                onExecute={handleExecute}
                lang={lang}
                setLang={setLang}
                typedCode={typedCode}
                generatedCode={generatedCode}
              />

            </div>{/* end ROW 2 */}
          </div>{/* end flex column */}

          {/* STATS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginTop: 32 }}>
            {[
              { label: "AI Use Cases",  value: "30+", icon: "🧠" },
              { label: "Engine Steps",  value: "15",  icon: "⚙️" },
              { label: "AI Agents",     value: "50",  icon: "🤖" },
              { label: "Countries",     value: "4",   icon: "🌍" },
              { label: "Decision Time", value: "<2s", icon: "⚡" },
              { label: "Accuracy",      value: "96%", icon: "🎯" },
            ].map(s => (
              <div key={s.label} style={{ ...panel, padding: "20px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>{s.value}</div>
                <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 14, marginTop: 5 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* SYSTEM INTEGRATION */}
          <div style={{ ...panel, padding: 32, marginTop: 20 }}>
            <div style={{ textAlign: "center", marginBottom: 26 }}>
              <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, letterSpacing: "1px", marginBottom: 8, fontWeight: 600 }}>SYSTEM INTEGRATION ARCHITECTURE</div>
              <div style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>OXYBFSAI enhances your existing systems — never replaces them</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {SYSTEMS.map(s => (
                  <div key={s} style={{ padding: "9px 20px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", fontSize: 15, textAlign: "center" }}>{s}</div>
                ))}
              </div>
              <div style={{ margin: "0 24px", textAlign: "center" }}>
                <div style={{ width: 56, height: 2, background: "linear-gradient(90deg, rgba(255,255,255,0.1), #6C5CE7)" }} />
                <div style={{ color: "#6C5CE7", fontSize: 22, margin: "4px 0" }}>→</div>
              </div>
              <div style={{ padding: "26px 30px", borderRadius: 16, textAlign: "center", background: "linear-gradient(135deg, rgba(108,92,231,0.2), rgba(0,184,148,0.1))", border: "1px solid rgba(108,92,231,0.45)", boxShadow: "0 0 40px rgba(108,92,231,0.15)" }}>
                <div style={{ fontSize: 30, marginBottom: 8 }}>🧠</div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>OXY BFSAI</div>
                <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 14, marginTop: 4 }}>AI Decision Engine</div>
                <div style={{ display: "flex", gap: 6, marginTop: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  {["50 Agents", "15 Steps", "AI Decisions"].map(t => (
                    <span key={t} style={{ padding: "4px 11px", borderRadius: 6, fontSize: 13, fontWeight: 600, background: "rgba(108,92,231,0.25)", color: "#c4b5fd" }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ margin: "0 24px", textAlign: "center" }}>
                <div style={{ width: 56, height: 2, background: "linear-gradient(90deg, #00B894, rgba(255,255,255,0.1))" }} />
                <div style={{ color: "#00B894", fontSize: 22, margin: "4px 0" }}>→</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["AI Decisions", "Risk Scores", "Compliance Reports", "Audit Trails", "Code Generation", "Business Insights"].map(o => (
                  <div key={o} style={{ padding: "9px 20px", borderRadius: 8, background: "rgba(0,184,148,0.1)", border: "1px solid rgba(0,184,148,0.25)", color: "#00cec9", fontSize: 15, textAlign: "center" }}>{o}</div>
                ))}
              </div>
            </div>
          </div>

          {/* BUSINESS VALUE */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginTop: 20 }}>
            {[
              { icon: "⚡", label: "Accelerate Decisions",  desc: "From days to seconds" },
              { icon: "🎯", label: "Improve Accuracy",      desc: "AI-driven precision" },
              { icon: "🔄", label: "Automate Operations",   desc: "End-to-end workflows" },
              { icon: "📉", label: "Reduce Manual Work",    desc: "90% effort reduction" },
              { icon: "📈", label: "Increase Productivity", desc: "Scale without headcount" },
            ].map(v => (
              <div key={v.label} style={{ ...panel, padding: "22px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{v.icon}</div>
                <div style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{v.label}</div>
                <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 14 }}>{v.desc}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
