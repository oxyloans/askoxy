import React from "react";
import { useNavigate } from "react-router-dom";

const AgentEntryPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* Page */
        .page {
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding: 24px;
          overflow: hidden;
          position: relative;
        }

        /* Animated background orbs */
        .page::before,
        .page::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
          animation: float 8s ease-in-out infinite;
        }

        .page::before {
          width: 400px;
          height: 400px;
          background: #ff6b9d;
          top: -100px;
          left: -100px;
          animation-delay: 0s;
        }

        .page::after {
          width: 350px;
          height: 350px;
          background: #feca57;
          bottom: -80px;
          right: -80px;
          animation-delay: 2s;
        }

        /* Glass container */
        .wrap {
          width: min(850px, 96vw);
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 32px;
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37),
                      inset 0 1px 0 rgba(255, 255, 255, 0.4);
          padding: 48px 40px;
          position: relative;
          z-index: 1;
          animation: fadeInUp 0.8s ease-out;
        }

        /* Header */
        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .title {
          font-size: 42px;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff 0%, #f0e7ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 12px;
          letter-spacing: -1px;
        }

        .subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          font-weight: 400;
          letter-spacing: 0.3px;
        }

        /* Options grid */
        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }
        
        @media (min-width: 680px) {
          .grid { 
            grid-template-columns: 1fr 1fr; 
          }
        }

        /* Card option */
        .option {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 32px 28px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          text-align: left;
          position: relative;
          overflow: hidden;
        }

        .option::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transition: left 0.5s;
        }

        .option:hover::before {
          left: 100%;
        }

        .option:hover {
          border-color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .option:focus-visible {
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.4);
          border-color: rgba(255, 255, 255, 0.6);
        }

        .option:active {
          transform: translateY(-4px);
        }

        /* Icon container */
        .icon {
          width: 64px; 
          height: 64px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
          display: flex; 
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .option:hover .icon {
          transform: scale(1.1) rotate(5deg);
        }

        /* Content */
        .content {
          flex: 1;
        }

        .name {
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
          letter-spacing: -0.3px;
        }

        .note {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.5;
        }

        /* Arrow indicator */
        .arrow {
          position: absolute;
          right: 24px;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .option:hover .arrow {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-50%) translateX(4px);
        }

        /* Footer hint */
        .hint {
          text-align: center;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          animation: fadeInUp 1s ease-out 0.3s both;
        }
      `}</style>

      <div className="page">
        <div className="wrap" role="region" aria-label="Choose agent creation mode">
          {/* <div className="header">
            <h1 className="title">Create Your AI Agent</h1>
          </div> */}

          <div className="grid">
            {/* Steps-based flow */}
            <button
              className="option"
              onClick={() => navigate("/main/bharat-expert")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate("/main/bharat-expert");
                }
              }}
              aria-label="Build with Steps (4-Tab Modal)"
            >
              <div className="icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 4h6a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1V6a2 2 0 0 1 2-2z"/>
                  <path d="M9 6h6"/>
                  <path d="m8.5 13.5 2 2 5-5"/>
                </svg>
              </div>
              <div className="content">
                <p className="name">Build with Steps</p>
                <p className="note">Guided 4-tab setup for clean, structured agent creation</p>
              </div>
              <div className="arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </button>

            {/* Chat-based flow */}
            <button
              className="option"
              onClick={() => navigate("/main/chatbasedagent")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate("/main/chatbasedagent");
                }
              }}
              aria-label="Chat-based Agent"
            >
              <div className="icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a7 7 0 0 1-7 7H8l-4 3v-5a7 7 0 0 1 0-10 7 7 0 0 1 5-2h5a7 7 0 0 1 7 7z"/>
                  <circle cx="9" cy="12" r="1"/>
                  <circle cx="15" cy="12" r="1"/>
                  <circle cx="12" cy="12" r="1"/>
                </svg>
              </div>
              <div className="content">
                <p className="name">Chat-based Agent</p>
                <p className="note">Conversational setup—just talk and we'll handle the rest</p>
              </div>
              <div className="arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
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