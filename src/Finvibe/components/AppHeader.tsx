import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { notification } from "antd";
import { useEngineStore } from "../hooks/engineStore";
import { engineApi } from "../hooks/engineApi";
import type { GenerationSession } from "../hooks/engineApi";
import type { Stage1Data } from "../hooks/engineStore";

const FRAMEWORKS = [
  {
    key: "CBUAE",
    label: "CBUAE",
    full: "Central Bank of UAE",
    color: "#1E6FD9",
    flag: "🇦🇪",
    desc: "UAE Banking Regulations",
    badgeClass: "text-[#1E6FD9] bg-[#1E6FD9]/[0.08] border-[#1E6FD9]/25",
  },
  {
    key: "RBI",
    label: "RBI",
    full: "Reserve Bank of India",
    color: "#E85D00",
    flag: "🇮🇳",
    desc: "India Banking Regulations",
    badgeClass: "text-[#E85D00] bg-[#E85D00]/[0.08] border-[#E85D00]/25",
  },
  {
    key: "SAMA",
    label: "SAMA",
    full: "Saudi Central Bank",
    color: "#00875A",
    flag: "🇸🇦",
    desc: "Saudi Arabia Regulations",
    badgeClass: "text-[#00875A] bg-[#00875A]/[0.08] border-[#00875A]/25",
  },
];

const STATUS_COLOR: Record<string, string> = {
  COMPLETED: "#00E676",
  RUNNING: "#00D4FF",
  PAUSED: "#FFB700",
  AWAITING_USER_INPUT: "#FFB700",
  FAILED: "#FF1744",
};

const FW_COLOR: Record<string, string> = {
  CBUAE: "#1E6FD9",
  RBI: "#E85D00",
  SAMA: "#00875A",
};

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { reset, setStage1Data, setSessionId, setStage2Questions } =
    useEngineStore();

  const [historyOpen, setHistoryOpen] = useState(false);
  const [fwOpen, setFwOpen] = useState(false);
  const [sessions, setSessions] = useState<GenerationSession[]>([]);
  const [loading, setLoading] = useState(false);
  const fwRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = historyOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [historyOpen]);

  useEffect(() => {
    if (!fwOpen) return;
    const handler = (e: MouseEvent) => {
      if (fwRef.current && !fwRef.current.contains(e.target as Node))
        setFwOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [fwOpen]);

  useEffect(() => {
    if (!historyOpen) return;
    setLoading(true);
    engineApi
      .getSessions()
      .then((res) => {
        const sorted = (res.data || []).sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
        setSessions(sorted);
      })
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, [historyOpen]);

  const closeHistory = () => setHistoryOpen(false);
  const handleNewGeneration = () => {
    reset();
    navigate("/generate");
  };

  const handleResumeSession = async (
    session: GenerationSession,
    targetPath: string,
  ) => {
    closeHistory();
    setSessionId(session.sessionId);
    try {
      if (session.status !== "AWAITING_USER_INPUT") {
        try {
          await engineApi.resumeSession(session.sessionId);
        } catch (err: any) {
          console.error(err);
          notification.error({
            message: "Failed to Resume",
            description: err?.message || "Failed to resume session. Initial setup was not completed successfully.",
            placement: "topRight",
            duration: 5,
          });
          return;
        }
      }
      const { data } = await engineApi.getSession(session.sessionId);
      const raw = data as any;
      let ctx: any = {};
      if (raw?.contextJson) {
        try {
          ctx = JSON.parse(raw.contextJson);
        } catch {}
      }
      const bp = raw?.bankProfile ?? ctx?.bankProfile;
      if (bp) {
        setStage1Data({
          selectedUseCase:
            bp.selectedUseCase ?? bp.useCaseId ?? session.useCaseId ?? "",
          regulatoryFramework:
            bp.regulatoryFramework ?? session.regulatoryFramework ?? "",
          bankName: bp.bankName ?? session.bankName ?? "",
          backendStack: bp.backendStack ?? "",
          frontendStack: bp.frontendStack ?? "",
          databaseType: bp.databaseType ?? "",
          aiProvider: bp.aiProvider ?? "",
          aiModelId: bp.aiModelId ?? "",
          existingServices: bp.existingServices ?? [],
        } as Stage1Data);
      }
      if (session.status === "AWAITING_USER_INPUT") {
        const reqs = raw?.dynamicRequirements ?? ctx?.dynamicRequirements;
        const questions = reqs?.questions ?? reqs?.configurationQuestions ?? [];
        const documents = reqs?.documents ?? reqs?.requiredDocuments ?? [];
        if (questions.length) setStage2Questions(questions, documents);
      }
    } catch {}
    navigate(targetPath);
  };

  const navItems = [
    { path: "/oxybfsai-engine", label: "Home" },
    { path: "/generate", label: "Generate" },
  ];

  return (
    <>
      {/* ─────────────────────────── HEADER ─────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-[1000] bg-[#0A0E1A]/95 backdrop-blur-xl border-b border-[#00D4FF]/10">
        {/* ── Row 1 (mobile): Logo + Generate button ── */}
        <div className="w-full max-w-[1280px] mx-auto px-3 sm:px-6">
          {/* MOBILE LAYOUT: 2 rows */}
          <div className="flex sm:hidden items-center justify-between h-12">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 no-underline shrink-0"
            >
              <svg width="24" height="28" viewBox="0 0 40 44" fill="none">
                <path
                  d="M20 1L38 11V33L20 43L2 33V11L20 1Z"
                  fill="rgba(0,212,255,0.1)"
                  stroke="#00D4FF"
                  strokeWidth="1.5"
                />
                <path
                  d="M22 10L15 23H21L18 34L25 21H19L22 10Z"
                  fill="#00D4FF"
                />
              </svg>
              <div>
                <div className="text-[13px] font-extrabold tracking-wider text-[#F0F4FF] leading-none">
                  OXY <span className="text-[#00D4FF]">BFSAI</span>
                </div>
                <div className="text-[8px] font-bold text-[#acb0c1] tracking-widest uppercase leading-none mt-[3px]">
                  USECASE ENGINE
                </div>
              </div>
            </Link>

            {/* Right side: FW dropdown + Generate */}
            <div className="flex items-center gap-1.5">
              {/* Framework dropdown */}
              <div className="relative" ref={fwRef}>
                <button
                  type="button"
                  onClick={() => setFwOpen((v) => !v)}
                  aria-label="Supported frameworks"
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-full text-[10px] font-bold border transition-all duration-200 cursor-pointer ${
                    fwOpen
                      ? "text-black bg-gradient-to-r from-[#00D4FF] to-[#0099BB] border-transparent"
                      : "text-[#00D4FF] border-[#00D4FF]/25 bg-[#00D4FF]/[0.07]"
                  }`}
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
                  </svg>
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    style={{
                      transform: fwOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {fwOpen && (
                  <div
                    className="absolute right-0 top-[calc(100%+6px)] z-[2000] rounded-xl overflow-hidden"
                    style={{
                      width: 240,
                      background: "#0D1120",
                      border: "1px solid rgba(0,212,255,0.15)",
                      boxShadow: "0 16px 48px rgba(0,0,0,0.8)",
                    }}
                  >
                    <div
                      className="px-3.5 py-2.5 flex items-center gap-2"
                      style={{ borderBottom: "1px solid rgba(0,212,255,0.08)" }}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#00D4FF"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
                      </svg>
                      <span className="text-[11px] font-bold text-[#F0F4FF]">
                        Supported Frameworks
                      </span>
                    </div>
                    <div className="py-1">
                      {FRAMEWORKS.map((fw) => (
                        <div
                          key={fw.key}
                          className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-white/[0.03] transition-colors"
                        >
                          <span className="text-base leading-none">
                            {fw.flag}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span
                                className="text-[10px] font-extrabold tracking-wider px-1.5 py-[2px] rounded"
                                style={{
                                  color: fw.color,
                                  background: `${fw.color}18`,
                                  border: `1px solid ${fw.color}30`,
                                }}
                              >
                                {fw.label}
                              </span>
                              <span className="text-[10px] font-semibold text-[#F0F4FF] truncate">
                                {fw.full}
                              </span>
                            </div>
                            <p className="text-[10px] text-[#4A5580]">
                              {fw.desc}
                            </p>
                          </div>
                          <div
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{
                              background: fw.color,
                              boxShadow: `0 0 5px ${fw.color}`,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div
                      className="px-3.5 py-2 flex items-center gap-1.5"
                      style={{
                        borderTop: "1px solid rgba(0,212,255,0.08)",
                        background: "rgba(0,0,0,0.2)",
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full bg-[#00E676]"
                        style={{ boxShadow: "0 0 5px #00E676" }}
                      />
                      <span className="text-[10px] text-[#4A5580]">
                        All frameworks active & compliant
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Generate button */}
              <button
                onClick={handleNewGeneration}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold cursor-pointer border-none bg-gradient-to-r from-[#00D4FF] to-[#0099BB] text-black shadow-[0_4px_16px_rgba(0,212,255,0.25)]"
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                Generate
              </button>
            </div>
          </div>

          {/* MOBILE Row 2: Nav links */}
          <div className="flex sm:hidden items-center gap-1 pb-2 border-t border-[#00D4FF]/[0.06] pt-1.5">
            {[
              { path: "/oxybfsai-engine", label: "Home" },
              { path: "/generate", label: "Generate" },
            ].map(({ path, label }) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium no-underline transition-all duration-200 ${
                    active
                      ? "text-black bg-gradient-to-r from-[#00D4FF] to-[#0099BB]"
                      : "text-[#8B9CC8] border border-[#00D4FF]/10 hover:text-[#F0F4FF]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => setHistoryOpen(true)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer ${
                historyOpen
                  ? "text-black bg-gradient-to-r from-[#00D4FF] to-[#0099BB]"
                  : "text-[#8B9CC8] border border-[#00D4FF]/10 hover:text-[#F0F4FF]"
              }`}
            >
              History
            </button>
          </div>

          {/* DESKTOP LAYOUT: single row (sm and above) */}
          <div className="hidden sm:flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 no-underline shrink-0"
            >
              <svg width="36" height="40" viewBox="0 0 40 44" fill="none">
                <path
                  d="M20 1L38 11V33L20 43L2 33V11L20 1Z"
                  fill="rgba(0,212,255,0.1)"
                  stroke="#00D4FF"
                  strokeWidth="1.5"
                />
                <path
                  d="M22 10L15 23H21L18 34L25 21H19L22 10Z"
                  fill="#00D4FF"
                />
              </svg>
              <div>
                <div className="text-[15px] font-extrabold tracking-wider text-[#F0F4FF] leading-none">
                  OXY <span className="text-[#00D4FF]">BFSAI</span>
                </div>
                <div className="text-[9px] font-bold text-[#acb0c1] tracking-widest uppercase leading-none mt-1">
                  USECASE ENGINE
                </div>
              </div>
            </Link>

            {/* Nav */}
            <nav className="flex items-center gap-1">
              {[
                { path: "/oxybfsai-engine", label: "Home" },
                { path: "/generate", label: "Generate" },
              ].map(({ path, label }) => {
                const active = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`px-4 py-1.5 rounded-full text-[13px] font-medium no-underline transition-all duration-200 ${
                      active
                        ? "text-black bg-gradient-to-r from-[#00D4FF] to-[#0099BB] shadow-[0_2px_10px_rgba(0,212,255,0.3)]"
                        : "text-[#8B9CC8] border border-[#00D4FF]/10 hover:text-[#F0F4FF] hover:border-[#00D4FF]/30 hover:bg-white/5"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={() => setHistoryOpen(true)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                  historyOpen
                    ? "text-black bg-gradient-to-r from-[#00D4FF] to-[#0099BB] shadow-[0_2px_10px_rgba(0,212,255,0.3)]"
                    : "text-[#8B9CC8] border border-[#00D4FF]/10 hover:text-[#F0F4FF] hover:border-[#00D4FF]/30 hover:bg-white/5"
                }`}
              >
                History
              </button>
            </nav>

            {/* Right: framework badges + generate */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Desktop inline badges */}
              <div className="hidden lg:flex gap-1.5 items-center">
                {FRAMEWORKS.map((fw) => (
                  <span
                    key={fw.key}
                    className={`text-[9px] font-bold px-2 py-[3px] rounded border tracking-wider ${fw.badgeClass}`}
                  >
                    {fw.label}
                  </span>
                ))}
              </div>
              {/* sm–lg: framework dropdown */}
              <div className="relative lg:hidden" ref={fwRef}>
                <button
                  type="button"
                  onClick={() => setFwOpen((v) => !v)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[12px] font-bold border transition-all duration-200 cursor-pointer ${
                    fwOpen
                      ? "text-black bg-gradient-to-r from-[#00D4FF] to-[#0099BB] border-transparent"
                      : "text-[#00D4FF] border-[#00D4FF]/25 bg-[#00D4FF]/[0.07]"
                  }`}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
                  </svg>
                  FW
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    style={{
                      transform: fwOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {fwOpen && (
                  <div
                    className="absolute right-0 top-[calc(100%+8px)] z-[2000] rounded-xl overflow-hidden"
                    style={{
                      width: 248,
                      background: "#0D1120",
                      border: "1px solid rgba(0,212,255,0.15)",
                      boxShadow: "0 16px 48px rgba(0,0,0,0.8)",
                    }}
                  >
                    <div
                      className="px-3.5 py-2.5 flex items-center gap-2"
                      style={{ borderBottom: "1px solid rgba(0,212,255,0.08)" }}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#00D4FF"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
                      </svg>
                      <span className="text-[11px] font-bold text-[#F0F4FF]">
                        Supported Frameworks
                      </span>
                    </div>
                    <div className="py-1">
                      {FRAMEWORKS.map((fw) => (
                        <div
                          key={fw.key}
                          className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-white/[0.03] transition-colors"
                        >
                          <span className="text-base leading-none">
                            {fw.flag}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span
                                className="text-[10px] font-extrabold tracking-wider px-1.5 py-[2px] rounded"
                                style={{
                                  color: fw.color,
                                  background: `${fw.color}18`,
                                  border: `1px solid ${fw.color}30`,
                                }}
                              >
                                {fw.label}
                              </span>
                              <span className="text-[10px] font-semibold text-[#F0F4FF] truncate">
                                {fw.full}
                              </span>
                            </div>
                            <p className="text-[10px] text-[#4A5580]">
                              {fw.desc}
                            </p>
                          </div>
                          <div
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{
                              background: fw.color,
                              boxShadow: `0 0 5px ${fw.color}`,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div
                      className="px-3.5 py-2 flex items-center gap-1.5"
                      style={{
                        borderTop: "1px solid rgba(0,212,255,0.08)",
                        background: "rgba(0,0,0,0.2)",
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full bg-[#00E676]"
                        style={{ boxShadow: "0 0 5px #00E676" }}
                      />
                      <span className="text-[10px] text-[#4A5580]">
                        All frameworks active & compliant
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="hidden lg:block w-[1px] h-5 bg-[#00D4FF]/15" />
              <button
                onClick={handleNewGeneration}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-bold cursor-pointer border-none transition-all duration-200 bg-gradient-to-r from-[#00D4FF] to-[#0099BB] text-black shadow-[0_4px_16px_rgba(0,212,255,0.25)] hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(0,212,255,0.45)] active:translate-y-0 whitespace-nowrap"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                Start Generation
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─────────────────────── HISTORY BACKDROP ───────────────────── */}
      {historyOpen && (
        <div
          onClick={closeHistory}
          className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm"
        />
      )}

      {/* ─────────────────────── HISTORY DRAWER ─────────────────────── */}
      <div
        className="fixed top-0 right-0 bottom-0 z-[1200] flex flex-col"
        style={{
          width: "min(420px, 100vw)",
          background: "#0B0F1E",
          borderLeft: "1px solid rgba(0,212,255,0.1)",
          boxShadow: "-12px 0 40px rgba(0,0,0,0.7)",
          transform: historyOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Drawer Header */}
        <div
          className="shrink-0 flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5"
          style={{ borderBottom: "1px solid rgba(0,212,255,0.08)" }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#00D4FF"
              strokeWidth="2"
              strokeLinecap="round"
              className="shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span className="text-[13px] sm:text-[14px] font-bold text-[#F0F4FF] truncate">
              Generation History
            </span>
            {sessions.length > 0 && (
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
                style={{ background: "rgba(0,212,255,0.1)", color: "#00D4FF" }}
              >
                {sessions.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <span
              className="hidden sm:inline text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider"
              style={{
                background: "rgba(255,183,0,0.1)",
                color: "#FFB700",
                border: "1px solid rgba(255,183,0,0.2)",
              }}
            >
              PREMIUM
            </span>
            <button
              type="button"
              onClick={closeHistory}
              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              aria-label="Close"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8B9CC8"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div
          className="flex-1 overflow-y-auto px-2.5 sm:px-3 py-2.5 sm:py-3"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0,212,255,0.12) transparent",
          }}
        >
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div
                className="w-7 h-7 rounded-full border-2"
                style={{
                  borderColor: "rgba(0,212,255,0.15)",
                  borderTopColor: "#00D4FF",
                  animation: "finvibe-spin 0.8s linear infinite",
                }}
              />
              <p className="text-[12px] text-[#4A5580]">Loading sessions...</p>
            </div>
          )}
          {!loading && sessions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(0,212,255,0.05)",
                  border: "1px solid rgba(0,212,255,0.1)",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4A5580"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <p className="text-[13px] font-semibold text-[#8B9CC8]">
                No history yet
              </p>
              <p className="text-[12px] text-[#4A5580]">
                Start a generation to see it here
              </p>
            </div>
          )}
          {!loading && sessions.length > 0 && (
            <div className="flex flex-col gap-2">
              {sessions.map((session) => {
                const statusColor = STATUS_COLOR[session.status] ?? "#8B9CC8";
                const fwColor =
                  FW_COLOR[session.regulatoryFramework] ?? "#00D4FF";
                const pct = Math.min(
                  Math.round((session.currentStep / 12) * 100),
                  100,
                );
                const isCompleted = session.status === "COMPLETED";
                const isAwaiting = session.status === "AWAITING_USER_INPUT";
                const isPaused = session.status === "PAUSED";
                const isRunning = session.status === "RUNNING";
                const isFailed = session.status === "FAILED";
                return (
                  <div
                    key={session.sessionId}
                    className="rounded-xl overflow-hidden"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      style={{
                        height: 2,
                        background: `linear-gradient(90deg,${statusColor}99,transparent)`,
                      }}
                    />
                    <div className="p-3 sm:p-3.5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] sm:text-[14px] font-bold text-[#F0F4FF] capitalize truncate leading-tight">
                            {session.bankName || "Unknown Bank"}
                          </p>
                          <p className="text-[10px] text-[#4A5580] font-mono mt-0.5 truncate">
                            {session.useCaseId} ·{" "}
                            {session.sessionId.slice(0, 8)}…
                          </p>
                        </div>
                        <div
                          className="flex items-center gap-1 shrink-0 px-1.5 py-1 rounded-full"
                          style={{
                            background: `${statusColor}15`,
                            border: `1px solid ${statusColor}30`,
                          }}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              background: statusColor,
                              animation: isRunning
                                ? "finvibe-pulse 1.5s infinite"
                                : "none",
                            }}
                          />
                          <span
                            className="text-[9px] font-bold uppercase tracking-wide"
                            style={{ color: statusColor }}
                          >
                            {session.status.replace(/_/g, " ")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center flex-wrap gap-1.5 mb-2.5">
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{
                            color: fwColor,
                            background: `${fwColor}12`,
                            border: `1px solid ${fwColor}25`,
                          }}
                        >
                          {session.regulatoryFramework}
                        </span>
                        <span className="text-[10px] text-[#8B9CC8]">
                          Step{" "}
                          <span className="font-bold text-[#F0F4FF]">
                            {session.currentStep}
                          </span>
                          /12
                        </span>
                        <span className="ml-auto text-[9px] text-[#4A5580] whitespace-nowrap">
                          {new Date(session.updatedAt).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="flex-1 h-1.5 rounded-full overflow-hidden"
                          style={{ background: "rgba(255,255,255,0.06)" }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              background: isCompleted
                                ? "#00E676"
                                : isFailed
                                  ? "#FF1744"
                                  : "#00D4FF",
                            }}
                          />
                        </div>
                        <span
                          className="text-[10px] font-bold shrink-0"
                          style={{ color: isCompleted ? "#00E676" : "#4A5580" }}
                        >
                          {pct}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isCompleted && (
                          <a
                            href={engineApi.getDownloadUrl(session.sessionId)}
                            download
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold no-underline"
                            style={{ background: "#00E676", color: "#000" }}
                          >
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                            >
                              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                            </svg>
                            Download
                          </a>
                        )}
                        {(isAwaiting || isPaused || isFailed || isRunning) && (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold cursor-pointer border-none"
                            style={{ background: "#7C3AED", color: "#fff" }}
                            onClick={() =>
                              handleResumeSession(
                                session,
                                isAwaiting
                                  ? `/stage2/${session.sessionId}`
                                  : `/generating/${session.sessionId}`,
                              )
                            }
                          >
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M8 5v14l11-7L8 5z" />
                            </svg>
                            Resume
                          </button>
                        )}
                        {!isCompleted && (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold cursor-pointer"
                            style={{
                              background: "rgba(0,212,255,0.08)",
                              color: "#00D4FF",
                              border: "1px solid rgba(0,212,255,0.18)",
                            }}
                            onClick={() =>
                              handleResumeSession(
                                session,
                                `/generating/${session.sessionId}`,
                              )
                            }
                          >
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            Inspect
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div
          className="shrink-0 flex items-center justify-between px-4 sm:px-5 py-3"
          style={{
            borderTop: "1px solid rgba(0,212,255,0.08)",
            background: "rgba(0,0,0,0.15)",
          }}
        >
          <span className="text-[11px] text-[#4A5580]">
            {sessions.length} session{sessions.length !== 1 ? "s" : ""}
          </span>
          <button
            type="button"
            onClick={() => {
              closeHistory();
              handleNewGeneration();
            }}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg text-[11px] font-semibold cursor-pointer border-none"
            style={{ background: "#00D4FF", color: "#000" }}
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Generation
          </button>
        </div>
      </div>
    </>
  );
}
