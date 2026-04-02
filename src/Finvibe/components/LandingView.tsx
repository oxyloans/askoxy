import { PromptInput } from "./PromptInput";

const SUGGESTIONS = [
  {
    icon: "🔄", tag: "P2P Platform",
    text: "Build a peer-to-peer lending platform with lender module, borrower module, admin dashboard, wallet system, escrow management, credit scoring APIs, KYC/AML verification, secure payment flows, repayment tracking, and scalable architecture following RBI guidelines",
    color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", dot: "#3B82F6",
  },
  {
    icon: "🛍️", tag: "E-Commerce",
    text: "Build a multi-vendor marketplace with buyer and seller modules, product catalog, cart and order management, seller onboarding and KYC verification, payment integration, order tracking, admin dashboard, and scalable architecture with secure transactions",
    color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", dot: "#10B981",
  },
  {
    icon: "🎮", tag: "Gaming Wallet",
    text: "Build a gaming wallet system with user onboarding, wallet balance and ledger tracking, in-app purchases, tournament entry and prize distribution, transaction history, admin controls, and secure payment and payout handling",
    color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", dot: "#8B5CF6",
  },
  {
    icon: "🏥", tag: "HealthTech",
    text: "Build a health insurance claims platform with user and admin modules, policy management, document upload, OCR-based data extraction, claim submission and approval workflow, fraud checks, payout processing, and secure scalable architecture",
    color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", dot: "#F59E0B",
  },
];

interface LandingViewProps {
  running: boolean;
  onRun: (prompt: string) => void;
  onViewRoadmap: () => void;
}

export function LandingView({ running, onRun, onViewRoadmap }: LandingViewProps) {
  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      background: "#F8F9FC",
    }}>

      {/* ── Scrollable body ── */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 32px 16px",
        scrollbarWidth: "none",
      }}>

        {/* ──── Hero ──── */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "6px 16px", borderRadius: "100px", marginBottom: "14px",
            background: "linear-gradient(135deg,#EEF3FF 0%,#F3EEFF 100%)",
            border: "1px solid #C7D8FF",
            boxShadow: "0 2px 12px rgba(59,111,255,.1)",
          }}>
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%", background: "#3B6FFF",
              display: "inline-block",
              animation: "fv-pulse 1.6s ease-in-out infinite",
            }}/>
            <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#3B6FFF", letterSpacing: ".12em", textTransform: "uppercase" as const }}>
              AI · Powered Code Generator
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(26px,3.6vw,38px)",
            fontWeight: 900, letterSpacing: "-.04em", lineHeight: 1.1,
            color: "#0A0E1A", margin: "0 0 8px",
          }}>
            Build your application with{" "}
            <span style={{
              display: "inline-block",
              background: "linear-gradient(90deg,#3B6FFF 0%,#7C3AED 55%,#06B6D4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-.03em",
            }}>FINVIBE</span>
          </h1>

          <p style={{
            fontSize: "13.5px", color: "#6B7A99", lineHeight: 1.6,
            margin: "0 auto 14px", maxWidth: "400px", fontWeight: 500,
          }}>
            Describe your app — FINVIBE architects, designs, and generates
            production-ready code in seconds.
          </p>

          {/* ── Inline "How it works" link ── */}
          <button
            onClick={onViewRoadmap}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "none", border: "none", cursor: "pointer",
              padding: "0",
            }}
          >
            <span style={{ fontSize: "13px", color: "#3B6FFF", fontWeight: 600, textDecoration: "underline", textDecorationColor: "#3B6FFF66", textUnderlineOffset: "3px" }}>
              See how it works
            </span>
            <span style={{
              fontSize: "9.5px", fontWeight: 700, color: "#FFFFFF",
              background: "linear-gradient(135deg, #3B6FFF, #7C3AED)",
              padding: "2px 7px", borderRadius: "20px", letterSpacing: ".04em",
            }}>11 steps</span>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M3.5 2l4 3.5-4 3.5" stroke="#3B6FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* ──── Suggestion cards ──── */}
        <div style={{
          width: "100%", maxWidth: "660px",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "8px", marginBottom: "14px",
        }}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s.tag}
              onClick={() => onRun(s.text)}
              disabled={running}
              style={{
                textAlign: "left", padding: "13px 14px",
                borderRadius: "14px", background: "#FFFFFF",
                border: "1px solid #E8ECF4",
                boxShadow: "0 1px 3px rgba(13,17,23,.05)",
                cursor: running ? "not-allowed" : "pointer",
                opacity: running ? .45 : 1,
                transition: "all .18s ease",
              }}
              onMouseEnter={e => {
                if (running) return;
                const el = e.currentTarget as HTMLElement;
                el.style.background = s.bg; el.style.borderColor = s.border;
                el.style.boxShadow = `0 5px 18px ${s.dot}22`;
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "#FFFFFF"; el.style.borderColor = "#E8ECF4";
                el.style.boxShadow = "0 1px 3px rgba(13,17,23,.05)";
                el.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "6px" }}>
                <span style={{ fontSize: "15px" }}>{s.icon}</span>
                <span style={{
                  fontSize: "9.5px", fontWeight: 700, letterSpacing: ".1em",
                  textTransform: "uppercase" as const, padding: "2px 8px", borderRadius: "6px",
                  background: s.bg, color: s.color, border: `1px solid ${s.border}`,
                }}>{s.tag}</span>
              </div>
              <p style={{
                fontSize: "11px", lineHeight: 1.55, color: "#6B7A99", margin: 0,
                display: "-webkit-box", WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical" as const, overflow: "hidden",
              }}>{s.text}</p>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: "100%", maxWidth: "660px", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ flex: 1, height: "1px", background: "#E8ECF4" }}/>
          <span style={{ fontSize: "10px", fontWeight: 600, color: "#C4CBDA", letterSpacing: ".1em", textTransform: "uppercase" as const, whiteSpace: "nowrap" }}>
            or describe your own
          </span>
          <div style={{ flex: 1, height: "1px", background: "#E8ECF4" }}/>
        </div>
      </div>

      {/* ── Sticky prompt bar ── */}
      <div style={{
        flexShrink: 0,
        padding: "12px 32px 16px",
        borderTop: "1px solid #EAECF2",
        background: "#FFFFFF",
        boxShadow: "0 -2px 14px rgba(13,17,40,.06)",
      }}>
        <div style={{ maxWidth: "660px", margin: "0 auto" }}>
          <PromptInput onSubmit={onRun} disabled={running} />
        </div>
      </div>

      <style>{`
        @keyframes fv-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
      `}</style>
    </div>
  );
}