import React, { useState, useEffect } from "react";
import { ENGINE_STEPS, PHASE_COLORS } from "../hooks/demoData";

type Agent = { name: string; status: string };

export function AgentPanel({ agents, color, running, showDone }: {
  agents: Agent[]; color: string; running: boolean; showDone: boolean;
}) {
  const [activeIdx, setActiveIdx] = useState(-1);
  const [doneIdx, setDoneIdx]     = useState(-1);

  useEffect(() => {
    setActiveIdx(-1);
    setDoneIdx(-1);
    if (!running) {
      if (showDone) { setDoneIdx(agents.length - 1); }
      return;
    }
    // Each agent: 800ms running, then marked done before next starts
    const STEP = 800;
    let idx = 0;
    setActiveIdx(0);
    const iv = setInterval(() => {
      setDoneIdx(idx);        // mark current as done
      idx++;
      if (idx >= agents.length) { clearInterval(iv); setActiveIdx(-1); return; }
      setActiveIdx(idx);      // start next
    }, STEP);
    return () => clearInterval(iv);
  }, [running, agents.length, showDone]);

  const statusOf = (i: number) => {
    if (!running && doneIdx === agents.length - 1) return "done";
    if (!running && activeIdx === -1 && doneIdx === -1) return "pending";
    if (i <= doneIdx) return "done";
    if (i === activeIdx) return "running";
    return "pending";
  };

  return (
    <div>
      {/* 15-step mini bar */}
      {(running || showDone) && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, letterSpacing: "0.5px", marginBottom: 8, fontWeight: 600 }}>
            15-STEP ENGINE PROGRESS
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {ENGINE_STEPS.map(s => {
              const filled = showDone
                ? true
                : running && doneIdx >= 0
                ? s.id <= Math.round((doneIdx / (agents.length - 1)) * 15)
                : false;
              return (
                <div key={s.id} style={{
                  width: 26, height: 5, borderRadius: 3,
                  background: filled ? PHASE_COLORS[s.phase] : "rgba(255,255,255,0.08)",
                  transition: "background 0.4s ease",
                }} title={s.label} />
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>Step 1</span>
            <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>Step 15</span>
          </div>
        </div>
      )}

      {/* Agents */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {agents.map((agent, i) => {
          const s = statusOf(i);
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 10,
              background: s === "done" ? "rgba(0,184,148,0.09)" : s === "running" ? `${color}12` : "rgba(255,255,255,0.04)",
              border: `1px solid ${s === "done" ? "rgba(0,184,148,0.3)" : s === "running" ? `${color}45` : "rgba(255,255,255,0.08)"}`,
              transition: "all 0.4s ease",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                background: s === "done" ? "rgba(0,184,148,0.2)" : s === "running" ? `${color}30` : "rgba(255,255,255,0.05)",
                border: `1.5px solid ${s === "done" ? "#00B894" : s === "running" ? color : "rgba(255,255,255,0.12)"}`,
              }}>
                {s === "done"
                  ? <span style={{ color: "#00B894", fontSize: 13 }}>✓</span>
                  : s === "running"
                  ? <div style={{ width: 12, height: 12, border: `2px solid ${color}40`, borderTopColor: color, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  : <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>○</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: s === "pending" ? "rgba(255,255,255,0.5)" : "#fff", fontSize: 14, fontWeight: 500 }}>
                  {agent.name}
                </div>
                <div style={{ fontSize: 13, marginTop: 2, color: s === "done" ? "#00B894" : s === "running" ? color : "rgba(255,255,255,0.38)" }}>
                  {s === "done" ? "Completed" : s === "running" ? "Processing..." : "Waiting"}
                </div>
              </div>
              <div style={{
                padding: "3px 10px", borderRadius: 6, fontSize: 13, fontWeight: 700,
                background: s === "done" ? "rgba(0,184,148,0.15)" : s === "running" ? `${color}22` : "rgba(255,255,255,0.05)",
                color: s === "done" ? "#00B894" : s === "running" ? color : "rgba(255,255,255,0.38)",
              }}>
                {s === "done" ? "DONE" : s === "running" ? "LIVE" : "QUEUE"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}