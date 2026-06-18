import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { notification } from "antd";
import { useEngineStore } from "../hooks/engineStore";
import { engineApi } from "../hooks/engineApi";
import { createSSEConnection } from "../hooks/sseClient";
import AgentPipeline from "./AgentPipeline";
import AgentLogPanel from "./AgentLogPanel";
import PackageSummary from "./PackageSummary";
import ContextInspector from "./ContextInspector";
import { USE_CASE_REGISTRY } from "../hooks/useCaseRegistry";

const FRAMEWORK_BADGE_CLASSES: Record<string, string> = {
  CBUAE: "text-[#1E6FD9] bg-[#1E6FD9]/10 border border-[#1E6FD9]/20",
  RBI: "text-[#E85D00] bg-[#E85D00]/10 border border-[#E85D00]/20",
  SAMA: "text-[#00875A] bg-[#00875A]/10 border border-[#00875A]/20",
};

type RightTab = "logs" | "context" | "package";

export default function GenerationPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const {
    stage1Data,
    runStatus,
    processSSEEvent,
    agentStatuses,
    downloadUrl,
    addLog,
    setSessionId,
    syncFromSession,
  } = useEngineStore();

  const [rightTab, setRightTab] = useState<RightTab>("logs");
  const [sseConnected, setSseConnected] = useState(false);
  const [sseError, setSseError] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  const selectedUC = USE_CASE_REGISTRY.find(
    (uc) => uc.id === stage1Data?.selectedUseCase,
  );

  // Connect SSE on mount
  useEffect(() => {
    if (!sessionId) return;
    setSessionId(sessionId);

    addLog(
      "System",
      `🔌 Connecting to generation session ${sessionId}`,
      "info",
    );

    const cleanup = createSSEConnection(
      sessionId,
      (event) => {
        processSSEEvent(event);
      },
      (error) => {
        console.error("SSE error:", error);
        setSseError(true);
        addLog(
          "System",
          "⚠ SSE connection error — real-time updates may be delayed",
          "warn",
        );
      },
      () => {
        setSseConnected(true);
        addLog("System", "✓ Connected to generation pipeline", "success");
      },
      (session) => {
        syncFromSession(session);
      },
    );

    cleanupRef.current = cleanup;

    return () => {
      cleanup();
      cleanupRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Switch to context tab when completed
  useEffect(() => {
    if (runStatus === "completed") {
      setRightTab("package"); // was 'logs', now 'package'
    }
  }, [runStatus]);

  const completedCount = agentStatuses.filter(
    (a) => a.status === "completed",
  ).length;
  const totalCount = agentStatuses.length;

  const handleStopSession = async () => {
    if (!sessionId) return;
    try {
      addLog("System", "⏸ Pausing generation pipeline...", "info");
      await engineApi.stopSession(sessionId);
      const { data: sessionData } = await engineApi.getSession(sessionId);
      syncFromSession(sessionData);
      addLog("System", "⏸ Generation pipeline paused by user request", "warn");
    } catch (err) {
      console.error("Failed to stop session:", err);
      addLog("System", "❌ Failed to pause generation pipeline", "error");
    }
  };

  const handleResumeSession = async () => {
    if (!sessionId) return;
    try {
      addLog("System", "⚙ Resuming generation pipeline...", "info");
      await engineApi.resumeSession(sessionId);
      const { data: sessionData } = await engineApi.getSession(sessionId);
      syncFromSession(sessionData);
    } catch (err: any) {
      console.error("Failed to resume session:", err);
      const errMsg = err?.message || "Failed to resume generation pipeline";
      addLog("System", `❌ ${errMsg}`, "error");
      notification.error({
        message: "Failed to Resume",
        description: errMsg,
        placement: "topRight",
        duration: 5,
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col animate-fade-in overflow-hidden">
      {/* Top bar */}
      <div className="p-3 px-6 bg-[#0F1525]/95 border-b border-[#00D4FF]/10 flex items-center gap-4 flex-wrap shrink-0">
        {/* Session indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full shrink-0 ${
              sseError
                ? "bg-[#FF1744]"
                : runStatus === "completed"
                  ? "bg-[#00E676]"
                  : "bg-[#00D4FF]"
            }`}
            style={{
              animation:
                runStatus === "running" && !sseError
                  ? "pulse 1.5s ease-in-out infinite"
                  : "none",
            }}
          />
          <span className="font-mono text-[11.5px] text-[#4A5580]">
            {sessionId}
          </span>
        </div>

        <div className="w-[1px] h-5 bg-[#00D4FF]/15" />

        {/* Bank + Use case info */}
        <div className="flex items-center gap-2 flex-wrap">
          {stage1Data?.bankName && (
            <span className="text-[14.5px] font-semibold text-[#F0F4FF]">
              {stage1Data.bankName}
            </span>
          )}
          {selectedUC && (
            <>
              <span className="text-[#4A5580]">·</span>
              <span className="text-xs text-[#8B9CC8]">{selectedUC.name}</span>
            </>
          )}
          {stage1Data?.regulatoryFramework && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-semibold tracking-wider uppercase ${FRAMEWORK_BADGE_CLASSES[stage1Data.regulatoryFramework] ?? "bg-white/5 border border-[#00D4FF]/10 text-[#8B9CC8]"}`}
            >
              {stage1Data.regulatoryFramework}
            </span>
          )}
        </div>

        {/* Right side: progress indicator */}
        <div className="ml-auto flex items-center gap-3">
          {runStatus === "running" && (
            <>
              <span className="flex items-center gap-1.5 text-xs text-[#00D4FF]">
                <span className="w-3.5 h-3.5 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin shrink-0" />
                {completedCount}/{totalCount} agents complete
              </span>
              <button
                type="button"
                onClick={handleStopSession}
                className="px-3 py-1 rounded-lg text-xs font-bold bg-[#FF1744] hover:bg-[#FF1744]/90 text-white cursor-pointer transition-all duration-200 border-none shrink-0"
              >
                ⏸ Pause
              </button>
            </>
          )}
          {runStatus === "idle" && (
            <>
              <span className="flex items-center gap-1.5 text-xs text-[#FFB700]">
                {completedCount}/{totalCount} agents complete (Paused)
              </span>
              <button
                type="button"
                onClick={handleResumeSession}
                className="px-3 py-1 rounded-lg text-xs font-bold bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white cursor-pointer transition-all duration-200 border-none shrink-0"
              >
                ▶ Resume
              </button>
            </>
          )}
          {runStatus === "failed" && (
            <span className="text-xs text-[#FF1744] font-semibold">
              ✗ Generation Failed
            </span>
          )}
          {sseError && (
            <span className="text-[11px] text-[#FF9800] bg-[#FF9800]/10 border border-[#FF9800]/30 rounded px-2 py-0.5">
              ⚠ SSE Error
            </span>
          )}
        </div>
      </div>

      {runStatus === "awaiting_input" && (
        <div
          className="px-6 py-4 bg-[#FFB700]/15 border-b-2 border-[#FFB700] flex items-center gap-4 animate-pulse-slow"
          style={{ boxShadow: "0 0 24px rgba(255,183,0,0.25)" }}
        >
          <div className="w-10 h-10 rounded-full bg-[#FFB700] flex items-center justify-center shrink-0 animate-bounce">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                fill="#000"
              />
              <line
                x1="12"
                y1="9"
                x2="12"
                y2="13"
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="12"
                y1="17"
                x2="12.01"
                y2="17"
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-bold text-[#FFB700] text-[15px] mb-0.5">
              ⏸ ACTION REQUIRED — Stage 2 Configuration
            </div>
            <div className="text-xs text-[#C8A84B] leading-relaxed">
              Generation is{" "}
              <span className="text-white font-semibold">paused</span>. Answer a
              few questions to continue code generation.
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-lg font-sans text-sm font-bold cursor-pointer border-2 border-[#FFB700] transition-all duration-200 whitespace-nowrap text-black shrink-0"
            style={{
              background: "linear-gradient(135deg, #FFD700, #FF8C00)",
              boxShadow: "0 0 20px rgba(255,183,0,0.6)",
            }}
            onClick={() => navigate(`/stage2/${sessionId}`)}
          >
            ✏ Answer Questions →
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-0 overflow-hidden min-h-0">
        {/* Left: Agent Pipeline */}
        <div className="p-6 overflow-y-auto border-r border-[#00D4FF]/10 h-full">
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="#00D4FF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <h3 className="text-[15px] font-semibold text-[#F0F4FF]">
                Generation Pipeline
              </h3>
            </div>
            <p className="text-xs text-[#8B9CC8]">
              13 specialized AI agents working in sequence to generate your
              complete banking service
            </p>
          </div>
          <AgentPipeline />
        </div>

        {/* Right: Logs + Context */}
        <div className="flex flex-col overflow-hidden h-full">
          {/* Tab navigation */}
          <div className="p-3 px-4 border-b border-[#00D4FF]/10 flex gap-1 shrink-0">
            {(
              [
                { key: "package" as RightTab, label: "📦 Package" },
                { key: "logs" as RightTab, label: "📋 Logs" },
                { key: "context" as RightTab, label: "🔍 Context" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setRightTab(tab.key)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 border ${
                  rightTab === tab.key
                    ? "bg-[#00D4FF]/10 border-[#00D4FF]/30 text-[#00D4FF]"
                    : "bg-transparent border-transparent text-[#8B9CC8] hover:text-[#F0F4FF]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-hidden min-h-0">
            {rightTab === "logs" ? (
              <AgentLogPanel />
            ) : rightTab === "package" ? (
              <div className="p-4">
                <PackageSummary />
              </div>
            ) : (
              <ContextInspector />
            )}
          </div>
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="p-2 px-6 bg-[#0A0E1A]/95 border-t border-[#00D4FF]/8 flex items-center gap-4 text-[11.5px] text-[#4A5580] shrink-0">
        <span>
          <span
            className={
              sseConnected && !sseError ? "text-[#00E676]" : "text-[#FF9800]"
            }
          >
            ●
          </span>{" "}
          {sseConnected && !sseError ? "SSE Connected" : "SSE Disconnected"}
        </span>
        <span className="text-[#4A5580]">·</span>
        <span>
          {stage1Data?.aiProvider} / {stage1Data?.aiModelId}
        </span>
        <span className="text-[#4A5580]">·</span>
        <span>
          {stage1Data?.backendStack} · {stage1Data?.databaseType}
        </span>
        {downloadUrl && (
          <>
            <span className="text-[#4A5580]">·</span>
            <button
              type="button"
              onClick={async () => {
                try {
                  const res = await fetch(downloadUrl);
                  if (!res.ok) throw new Error(`${res.status}`);
                  let filename = "generated-package.zip";
                  const cd = res.headers.get("content-disposition");
                  if (cd) {
                    const m =
                      cd.match(/filename\*=UTF-8''([^;\s]+)/i) ||
                      cd.match(/filename="?([^"]+)"?/i);
                    if (m) filename = decodeURIComponent(m[1]);
                  }
                  if (!filename.endsWith(".zip")) filename += ".zip";
                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = filename;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                } catch {
                  /* ignore */
                }
              }}
              className="text-[#00E676] hover:underline bg-transparent border-none cursor-pointer text-[11.5px] p-0"
            >
              ⬇ Download Ready
            </button>
          </>
        )}
      </div>
    </div>
  );
}
