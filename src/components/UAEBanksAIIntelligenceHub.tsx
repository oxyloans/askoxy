import React from "react";

const banks = [
  {
    name: "Abu Dhabi Commercial Bank",
    shortName: "ADCB",
    title: "Abu Dhabi Commercial Bank (ADCB) — AI Intelligence Report 2026",
    logo: "https://i.ibb.co/kdxgH2j/ADCB.png",
    path: "/radha/adcb-ai-intelligence",
    color: "#c8102e",
    accent: "#f5a623",
    desc: "Digital-first strategy · AI-powered retail banking · Hayyak onboarding",
    useCases: 20,
    maturityScore: "3.9",
  },
  {
    name: "Abu Dhabi Islamic Bank",
    shortName: "ADIB",
    title: "Abu Dhabi Islamic Bank (ADIB) — AI Intelligence Report 2026",
    logo: "https://i.ibb.co/gZ5tR6Dv/ADIB.png",
    path: "/radha/adib-ai-intelligence",
    color: "#006341",
    accent: "#f5a623",
    desc: "Islamic banking AI leader · Conversational banking · Shari'a AI",
    useCases: 20,
    maturityScore: "3.6",
  },
  {
    name: "Commercial Bank of Dubai",
    shortName: "CBD",
    title: "Commercial Bank of Dubai (CBD) — AI Intelligence Report 2026",
    logo: "https://i.ibb.co/JR1JTRmq/CBD.png",
    path: "/radha/cbd-ai-intelligence",
    color: "#0047AB",
    accent: "#f5a623",
    desc: "Digital transformation leader · AI credit scoring · SME focus",
    useCases: 25,
    maturityScore: "3.5",
  },
  {
    name: "Dubai Islamic Bank",
    shortName: "DIB",
    title: "Dubai Islamic Bank (DIB) — AI Intelligence Report 2026",
    logo: "https://i.ibb.co/KzNtQR53/DIB.png",
    path: "/radha/dib-ai-intelligence",
    color: "#8B0000",
    accent: "#c9a227",
    desc: "World's largest Islamic bank · AI-powered halal finance · Smart banking",
    useCases: 30,
    maturityScore: "3.8",
  },
  {
    name: "Emirates NBD",
    shortName: "ENBD",
    title: "Emirates NBD — AI Intelligence Report 2026",
    logo: "https://i.ibb.co/sJ63G71y/ENBD.png",
    path: "/radha/emirates-nbd-ai-intelligence",
    color: "#003366",
    accent: "#FFD700",
    desc: "MENA AI banking pioneer · EVA AI assistant · 28 AI use cases",
    useCases: 28,
    maturityScore: "3.9",
  },
  {
    name: "First Abu Dhabi Bank",
    shortName: "FAB",
    title: "First Abu Dhabi Bank (FAB) — AI Intelligence Report 2026",
    logo: "https://i.ibb.co/Xx9cf3SX/FAB.png",
    path: "/radha/fab-ai-intelligence",
    color: "#003366",
    accent: "#c9a227",
    desc: "UAE's largest bank · AED 1B+ AI investment · AI-first transformation",
    useCases: 30,
    maturityScore: "4.1",
  },
  {
    name: "Mashreq Bank",
    shortName: "MASHREQ",
    title: "Mashreq Bank — AI Intelligence Report 2026",
    logo: "https://i.ibb.co/M5nsrYdf/MASHREQ.png",
    path: "/radha/mashreq-ai-intelligence",
    color: "#e31837",
    accent: "#003366",
    desc: "NeoBiz digital bank · AI-first strategy · RegTech innovator",
    useCases: 28,
    maturityScore: "3.9",
  },
  {
    name: "National Bank of Fujairah",
    shortName: "NBF",
    title: "National Bank of Fujairah (NBF) — AI Intelligence Report 2026",
    logo: "https://i.ibb.co/S4WdfGkG/NBF.png",
    path: "/radha/nbf-ai-intelligence",
    color: "#1a4f8a",
    accent: "#c9a227",
    desc: "Trade finance AI leader · Corporate banking focus · UAE Northern Emirates",
    useCases: 20,
    maturityScore: "3.2",
  },
  {
    name: "RAKBANK",
    shortName: "RAKBANK",
    title: "RAKBANK (National Bank of Ras Al Khaimah) — AI Intelligence Report 2026",
    logo: "https://i.ibb.co/4gXyGdvF/RAKBANK.png",
    path: "/radha/rakbank-ai-intelligence",
    color: "#f26522",
    accent: "#003366",
    desc: "SME banking champion · AI underwriting · Digital-first UAE retail bank",
    useCases: 25,
    maturityScore: "3.5",
  },
  {
    name: "Sharjah Islamic Bank",
    shortName: "SIB",
    title: "Sharjah Islamic Bank (SIB) — AI Intelligence Report 2026",
    logo: "https://i.ibb.co/YF80ppyC/SIB.png",
    path: "/radha/sib-ai-intelligence",
    color: "#006400",
    accent: "#c9a227",
    desc: "Islamic digital banking · AI-driven compliance · Sharjah's flagship bank",
    useCases: 20,
    maturityScore: "2.8",
  },
];

const UAEBanksAIIntelligenceHub: React.FC = () => {
  const handleOpen = (path: string) => {
    window.location.href = path;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
        fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#003366",
          padding: "1.25rem 1.5rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: "clamp(16px,3vw,22px)",
            fontWeight: 700,
            margin: 0,
          }}
        >
          UAE Banks — AI Use Cases & Maturity Intelligence Hub 2026
        </h1>
        <p style={{ color: "#a8c4e0", fontSize: 13, margin: "6px 0 0", fontWeight: 400 }}>
          Explore AI adoption across 10 UAE banks · Use cases · Maturity scores
        </p>
      </div>

      {/* Cards Grid */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "2rem 1.5rem 3rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
            gap: "1.25rem",
          }}
        >
          {banks.map((bank) => (
            <button
              key={bank.shortName}
              onClick={() => handleOpen(bank.path)}
              style={{
                background: "#fff",
                border: "none",
                borderRadius: 16,
                overflow: "hidden",
                cursor: "pointer",
                textAlign: "left",
                padding: 0,
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                transition: "transform 0.18s ease, box-shadow 0.18s ease",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.13)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)";
              }}
              aria-label={`Open ${bank.title}`}
            >
              {/* Color top bar */}
              <div style={{ height: 5, background: bank.color, width: "100%" }} />

              {/* Card body */}
              <div
                className="uae-card-body"
                style={{
                  padding: "1.25rem 1.25rem 1rem",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  flex: 1,
                }}
              >
                {/* Logo */}
                <div
                  className="uae-logo-box"
                  style={{
                    width: 70,
                    height: 60,
                    borderRadius: 12,
                    border: "1px solid #e8e8e0",
                    background: "#fafaf8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    overflow: "hidden",
                    padding: 4,
                  }}
                >
                  <img
                    src={bank.logo}
                    alt={bank.shortName}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                      const parent = (e.currentTarget as HTMLImageElement).parentElement;
                      if (parent) {
                        parent.style.background = bank.color;
                        parent.innerHTML = `<span style="color:#fff;font-weight:700;font-size:13px;text-align:center;line-height:1.2;padding:4px">${bank.shortName}</span>`;
                      }
                    }}
                  />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        background: bank.color,
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 9px",
                        borderRadius: 20,
                        letterSpacing: 0.5,
                        flexShrink: 0,
                      }}
                    >
                      {bank.shortName}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: "#888",
                        background: "#f5f5f0",
                        padding: "2px 8px",
                        borderRadius: 20,
                        flexShrink: 0,
                      }}
                    >
                      AI Report 2026
                    </span>
                  </div>
                  <div
                    className="uae-bank-name"
                    style={{
                      fontSize: "clamp(13px,2vw,15px)",
                      fontWeight: 700,
                      color: "#1a1a1a",
                      lineHeight: 1.35,
                      marginBottom: 6,
                    }}
                  >
                    {bank.name}
                  </div>
                  <div className="uae-bank-desc" style={{ fontSize: 12, color: "#666", lineHeight: 1.5, marginBottom: 10 }}>
                    {bank.desc}
                  </div>

                  {/* AI Use Cases & Maturity Score FABs */}
                  <div className="uae-fabs-row" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
                    {/* AI Use Cases */}
                    <div
                      className="uae-fab"
                      style={{
                        display: "inline-flex",
                        flexDirection: "column",
                        alignItems: "center",
                        background: `linear-gradient(135deg, ${bank.color}18 0%, ${bank.color}08 100%)`,
                        border: `1.5px solid ${bank.color}44`,
                        borderRadius: 12,
                        padding: "8px 14px",
                        minWidth: 90,
                      }}
                    >
                      <span className="uae-fab-num" style={{ fontSize: 22, fontWeight: 800, color: bank.color, lineHeight: 1 }}>
                        {bank.useCases}
                      </span>
                      <span className="uae-fab-label" style={{ fontSize: 10, fontWeight: 600, color: bank.color, opacity: 0.8, marginTop: 3, letterSpacing: 0.3, textTransform: "uppercase" }}>
                        AI Use Cases
                      </span>
                    </div>
                    {/* Maturity Score */}
                    <div
                      className="uae-fab"
                      style={{
                        display: "inline-flex",
                        flexDirection: "column",
                        alignItems: "center",
                        background: "linear-gradient(135deg, #fff8ec 0%, #fff3dc 100%)",
                        border: "1.5px solid #f5a62355",
                        borderRadius: 12,
                        padding: "8px 14px",
                        minWidth: 90,
                      }}
                    >
                      <span className="uae-fab-num" style={{ fontSize: 22, fontWeight: 800, color: "#c47d00", lineHeight: 1 }}>
                        {bank.maturityScore}
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#c47d00" }}>/5</span>
                      </span>
                      <span className="uae-fab-label" style={{ fontSize: 10, fontWeight: 600, color: "#c47d00", opacity: 0.85, marginTop: 3, letterSpacing: 0.3, textTransform: "uppercase" }}>
                        ★ AI Maturity Score
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                className="uae-card-footer"
                style={{
                  borderTop: "1px solid #f0f0e8",
                  padding: "10px 1.25rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#fafaf8",
                }}
              >
                <span style={{ fontSize: 11, color: "#999" }}>Click to explore</span>
                <span
                  style={{
                    background: bank.color,
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "5px 14px",
                    borderRadius: 20,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  View Report
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M2 5h6M5 2l3 3-3 3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer note */}
        <style>{`
          @media (max-width: 480px) {
            .uae-card-body {
              padding: 0.85rem 0.85rem 0.75rem !important;
              gap: 10px !important;
            }
            .uae-logo-box {
              width: 52px !important;
              height: 46px !important;
            }
            .uae-bank-name {
              font-size: 13px !important;
            }
            .uae-bank-desc {
              font-size: 11px !important;
              margin-bottom: 8px !important;
            }
            .uae-fabs-row {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              gap: 8px !important;
              width: 100% !important;
            }
            .uae-fab {
              min-width: unset !important;
              width: 100% !important;
              padding: 7px 6px !important;
            }
            .uae-fab-num {
              font-size: 18px !important;
            }
            .uae-fab-label {
              font-size: 9px !important;
            }
            .uae-card-footer {
              padding: 8px 0.85rem !important;
            }
          }
        `}</style>
        <div
          style={{
            marginTop: "2.5rem",
            padding: "1.25rem 1.5rem",
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e8e8e0",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 12, color: "#888", margin: 0, lineHeight: 1.7 }}>
            All reports are synthesized from official bank sources including Annual Reports, Investor Presentations, ESG Reports and Press Releases. AI use cases and maturity scores are research-based assessments for 2026.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UAEBanksAIIntelligenceHub;
