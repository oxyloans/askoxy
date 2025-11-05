import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AgentEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -15px, 0); }
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { overflow-x: hidden; }

        .agent-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f3ff 0%, #ffffff 50%, #faf8ff 100%);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding: 20px; position: relative; overflow: hidden;
        }

        .bg-orb {
          position: absolute; border-radius: 50%; filter: blur(120px);
          pointer-events: none; will-change: transform;
        }
        .bg-orb-1 { width: 600px; height: 600px; background: #9b87f5; top: -200px; right: -200px; opacity: 0.15; animation: float 12s ease-in-out infinite; }
        .bg-orb-2 { width: 500px; height: 500px; background: #7c6bdf; bottom: -150px; left: -150px; opacity: 0.12; animation: float 15s ease-in-out infinite 3s; }

        @media (max-width: 768px) {
          .bg-orb-1 { width: 350px; height: 350px; top: -100px; right: -100px; }
          .bg-orb-2 { width: 300px; height: 300px; bottom: -100px; left: -100px; }
        }

        .agent-wrap {
          width: 100%; max-width: 920px; position: relative; z-index: 1;
          opacity: 0; transition: opacity 0.5s ease-out;
        }
        .agent-wrap.mounted { opacity: 1; }

        .agent-header { text-align: center; margin-bottom: 44px; }
        .agent-title {
          font-size: clamp(26px, 4.2vw, 40px);
          font-weight: 800;
          background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          margin-bottom: 10px; letter-spacing: -1.5px; line-height: 1.08;
        }
        .agent-subtitle { font-size: clamp(15px, 2.2vw, 18px); color: #667085; }

        .agent-grid { display: grid; grid-template-columns: 1fr; gap: 22px; }
        @media (min-width: 680px) { .agent-grid { grid-template-columns: repeat(2, 1fr); gap: 26px; } }

        .agent-card {
          display: flex; flex-direction: column; align-items: flex-start; gap: 16px;
          padding: 30px 26px; /* tighter */
          border: 1.5px solid #eadffd; background: #ffffff; border-radius: 22px;
          cursor: pointer; text-align: left; position: relative; overflow: hidden;
          min-height: 210px; transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          box-shadow: 0 3px 16px rgba(124, 58, 237, 0.07);
        }
        .agent-card::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(167, 139, 250, 0.06), rgba(124, 58, 237, 0.06));
          opacity: 0; transition: opacity 0.25s ease; border-radius: 22px;
        }
        .agent-card:hover { border-color: #d9c8ff; transform: translateY(-4px); box-shadow: 0 10px 28px rgba(124, 58, 237, 0.15); }
        .agent-card:hover::before { opacity: 1; }
        .agent-card:active { transform: translateY(-2px); }

        /* ICON SIZE (kept ~35% reduction) */
        .agent-icon {
          width: 52px; height: 52px; border-radius: 13px;
          background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 24px rgba(124, 58, 237, 0.2);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          flex-shrink: 0;
        }
        .agent-icon svg { width: 23px; height: 23px; }
        .agent-card:hover .agent-icon { transform: translateY(-3px) scale(1.04); box-shadow: 0 12px 30px rgba(124, 58, 237, 0.26); }

        .agent-content { flex: 1; width: 100%; display: flex; flex-direction: column; gap: 10px; }
        .agent-name { font-size: 24px; font-weight: 700; color: #1f2937; letter-spacing: -0.4px; line-height: 1.18; }
        .agent-note { font-size: 15px; color: #667085; line-height: 1.55; }
        .agent-badge {
          display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px;
          background: linear-gradient(135deg, #f3f0ff, #ece7ff);
          border-radius: 11px; font-size: 12.5px; font-weight: 700; color: #6d28d9;
          margin-top: 4px; width: fit-content; border: 1px solid #e8ddff;
          text-transform: uppercase; letter-spacing: 0.4px;
        }

        /* Arrow button smaller & cleaner */
        .agent-arrow {
          position: absolute; right: 22px; bottom: 22px; width: 38px; height: 38px;
          display: flex; align-items: center; justify-content: center; border-radius: 50%;
          background: #f4f1ff; transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
          box-shadow: inset 0 0 0 1px #e9ddff;
        }
        .agent-card:hover .agent-arrow {
          background: linear-gradient(135deg, #a78bfa, #7c3aed);
          transform: translateX(6px);
          box-shadow: 0 4px 14px rgba(124, 58, 237, 0.22);
        }
        .agent-card:hover .agent-arrow svg { stroke: #ffffff; }
        .agent-arrow svg { width: 20px; height: 20px; }

        @media (max-width: 680px) {
          .agent-card { padding: 24px 20px; min-height: 196px; }
          .agent-title { letter-spacing: -1.1px; }
          .agent-icon { width: 47px; height: 47px; border-radius: 12px; }
          .agent-icon svg { width: 21px; height: 21px; }
          .agent-name { font-size: 22px; }
          .agent-note { font-size: 14.5px; }
          .agent-arrow { right: 18px; bottom: 18px; width: 34px; height: 34px; }
          .agent-arrow svg { width: 18px; height: 18px; }
          .agent-grid { gap: 18px; }
          .agent-header { margin-bottom: 34px; }
        }

        html { scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="agent-page">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />

        <div className={`agent-wrap ${mounted ? "mounted" : ""}`} role="region" aria-label="Choose agent creation mode">
          <div className="agent-header">
            <h1 className="agent-title">Create your AI Agent</h1>
            {/* <p className="agent-subtitle">Choose your preferred creation method</p> */}
          </div>

          <div className="agent-grid">
            {/* Steps-based */}
            <button
              className="agent-card"
              onClick={() => navigate("/main/agentcreate")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate("/main/agentcreate"); }
              }}
              aria-label="Build with Steps (4-Tab Modal)"
            >
              <div className="agent-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 4h6a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1V6a2 2 0 0 1 2-2z" />
                  <path d="M9 6h6" />
                  <path d="m8.5 13.5 2 2 5-5" />
                </svg>
              </div>
              <div className="agent-content">
                <p className="agent-name">Build with Steps</p>
                <p className="agent-note">Guided 4-tab setup for clean, structured agent creation with full control</p>
                <span className="agent-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  Recommended Agent Creation Flow
                </span>
              </div>
              <div className="agent-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Chat-based */}
            <button
              className="agent-card"
              onClick={() => navigate("/main/chatbasedagent")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate("/main/chatbasedagent"); }
              }}
              aria-label="Chat-based Agent"
            >
              <div className="agent-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <path d="M8 10h.01M12 10h.01M16 10h.01" />
                </svg>
              </div>
              <div className="agent-content">
                <p className="agent-name">Chat-based Agent</p>
                <p className="agent-note">Describe your idea in plain language—AI configures the agent for you</p>
                <span className="agent-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="2"/>
                    <path d="M12 2v4m0 12v4m8.66-14.66l-2.83 2.83m-11.66 11.66L3.34 19.66m16.32 0l-2.83-2.83M6.17 6.17L3.34 3.34"/>
                  </svg>
                   AI-Powered Agent Creation Flow
                </span>
              </div>
              <div className="agent-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgentEntryPage;