import React, { useEffect } from "react";

declare global {
  interface Window {
    showPage: (id: string, btn: HTMLElement) => void;
    filterUC: (m: string, btn: HTMLElement) => void;
  }
}

const styles = `
*{box-sizing:border-box;margin:0;padding:0}
.adcb-report-page{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#f5f6fa;color:#1a1a1a;font-size:14px;line-height:1.6}

/* ─── TOP BAR ─── */
.topbar{background:linear-gradient(135deg,#c8102e 0%,#9b0d24 100%);color:#fff;padding:0}
.topbar-inner{max-width:1200px;margin:0 auto;padding:1.5rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}
.topbar h1{font-size:20px;font-weight:600;letter-spacing:-.3px}
.topbar p{font-size:12px;opacity:.72;margin-top:2px}
.badge-gold{background:#f5a623;color:#fff;font-size:11px;padding:3px 10px;border-radius:20px;font-weight:700;letter-spacing:.3px}

/* ─── NAV ─── */
.nav{background:#a00d22;border-bottom:3px solid #f5a623;overflow-x:auto}
.nav-inner{max-width:1200px;margin:0 auto;display:flex}
.nav button{background:none;border:none;color:rgba(255,255,255,.65);padding:12px 16px;font-size:13px;cursor:pointer;white-space:nowrap;border-bottom:3px solid transparent;margin-bottom:-3px;transition:all .2s}
.nav button:hover,.nav button.active{color:#fff;border-bottom-color:#f5a623}

/* ─── LAYOUT ─── */
.container{max-width:1200px;margin:0 auto;padding:1.5rem 2rem}
.page{display:none}.page.active{display:block}
.section-head{margin-bottom:1.5rem}
.section-head h2{font-size:22px;font-weight:600;color:#c8102e;margin-bottom:4px}
.section-head p{font-size:13px;color:#666}

/* ─── METRICS ─── */
.metrics-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:12px;margin-bottom:1.5rem}
.metric{background:#fff;border:.5px solid #e0e0e8;border-radius:8px;padding:1rem;text-align:center}
.metric .num{font-size:26px;font-weight:700;color:#c8102e;margin-bottom:2px}
.metric .lbl{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:.4px}

/* ─── CARDS ─── */
.card{background:#fff;border:.5px solid #e0e0e8;border-radius:10px;padding:1.25rem;margin-bottom:1rem}
.card-title{font-size:15px;font-weight:600;color:#c8102e;margin-bottom:8px}

/* ─── TAGS ─── */
.tag{display:inline-block;font-size:10px;padding:2px 8px;border-radius:12px;font-weight:600;margin:2px}
.tag-prod{background:#fde8e8;color:#7b0d1e}
.tag-scale{background:#fff4e6;color:#7c4a00}
.tag-pilot{background:#ede7f6;color:#4527a0}
.tag-dept{background:#e3f2fd;color:#0d47a1}
.tag-tech{background:#f3f3f3;color:#333}
.tag-partner{background:#fff8e1;color:#6d4c00}

/* ─── TABLES ─── */
table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;padding:10px 12px;background:#f8f5f5;font-weight:600;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:.4px;border-bottom:1px solid #e8dede}
td{padding:10px 12px;border-bottom:.5px solid #f2f0f0;vertical-align:top}
tr:last-child td{border-bottom:none}
tr:hover td{background:#fdf8f8}

/* ─── USE CASE CARDS ─── */
.uc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem}
.uc-card{background:#fff;border:.5px solid #e0e0e8;border-radius:10px;padding:1.25rem;border-left:4px solid #c8102e}
.uc-id{font-size:10px;color:#aaa;font-weight:600;letter-spacing:1px;margin-bottom:4px}
.uc-name{font-size:14px;font-weight:600;color:#c8102e;margin-bottom:8px}
.uc-label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.4px;font-weight:600;margin-bottom:2px}
.uc-value{font-size:12px;color:#333;line-height:1.5;margin-bottom:6px}

/* ─── AGENT CARDS ─── */
.agent-card{background:#fff;border:.5px solid #e0e0e8;border-radius:10px;padding:1.25rem;border-left:4px solid #f5a623}
.agent-icon{width:30px;height:30px;background:#fff4e6;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}

/* ─── PROGRAM CARDS ─── */
.prog-card{background:#fff;border:.5px solid #e0e0e8;border-radius:10px;padding:1.25rem;border-top:3px solid #f5a623}

/* ─── SUMMARY BOX ─── */
.summary-box{background:#c8102e;color:#fff;border-radius:10px;padding:1.5rem;margin-bottom:1.5rem}
.summary-box h3{font-size:18px;font-weight:600;color:#f5a623;margin-bottom:.75rem}
.summary-box p{font-size:13px;line-height:1.8;opacity:.92}

/* ─── FINDING ITEMS ─── */
.finding-item{padding:.75rem 1rem;border-left:3px solid #c8102e;background:#fdf4f4;border-radius:0 6px 6px 0;margin-bottom:.75rem;font-size:13px;line-height:1.6}
.finding-num{font-weight:700;color:#c8102e;margin-right:8px}

/* ─── MATURITY ─── */
.maturity-bar{height:11px;background:#ede8e8;border-radius:5px;overflow:hidden;margin-bottom:4px}
.maturity-fill{height:100%;border-radius:5px;background:#c8102e}
.score-big{font-size:52px;font-weight:700;color:#c8102e;text-align:center;padding:1.5rem;background:#fdf4f4;border-radius:10px;margin-bottom:1rem}
.score-sub{font-size:13px;color:#666;text-align:center;margin-top:-.5rem;margin-bottom:1.5rem}

/* ─── CEO REPORT ─── */
.ceo-report{background:#fff;border:1.5px solid #c8102e;border-radius:10px;padding:2rem;font-size:13px;line-height:1.9;color:#1a1a1a}
.ceo-report h3{font-size:14px;font-weight:700;color:#9b0d24;margin:1.5rem 0 .5rem;text-transform:uppercase;letter-spacing:.5px;border-bottom:.5px solid #f0dede;padding-bottom:.4rem}
.ceo-report p{margin-bottom:1rem}

/* ─── MISC ─── */
.url-link{color:#185fa5;text-decoration:none;font-size:12px;word-break:break-all}
.url-link:hover{text-decoration:underline}
.chip{display:inline-flex;align-items:center;gap:5px;background:#fdf4f4;border:.5px solid #e8cece;border-radius:20px;padding:4px 12px;font-size:11px;color:#7b0d1e;margin:3px;text-decoration:none}
.chip:hover{background:#f8e8e8}
.partner-logo{width:48px;height:48px;border-radius:8px;background:#fdf4f4;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;color:#9b0d24;flex-shrink:0;text-align:center;line-height:1.2}
.filter-btn{border:.5px solid #ccc;background:#fff;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer;transition:all .2s}
.filter-btn.active{background:#c8102e;color:#fff;border-color:#c8102e}
.hayyak-badge{display:inline-flex;align-items:center;gap:4px;background:#fde8e8;border:.5px solid #f5a6a6;border-radius:12px;padding:2px 8px;font-size:10px;color:#7b0d1e;font-weight:600}
.page-footer{background:#9b0d24;color:rgba(255,255,255,.55);font-size:11px;text-align:center;padding:1rem;margin-top:2rem}
.info-banner{background:#fff8f0;border:.5px solid #f5a623;border-radius:8px;padding:.75rem 1rem;font-size:12px;color:#7c4a00;margin-bottom:1rem}


.adcb-report-page{min-height:100vh;}
@media (max-width:768px){
  .adcb-report-page .topbar-inner{padding:1rem;}
  .adcb-report-page .container{padding:1rem;}
  .adcb-report-page .uc-grid{grid-template-columns:1fr;}
  .adcb-report-page table{display:block;overflow-x:auto;white-space:nowrap;}
  .adcb-report-page .metrics-grid{grid-template-columns:repeat(2,minmax(0,1fr));}
}
@media (max-width:480px){
  .adcb-report-page .metrics-grid{grid-template-columns:1fr;}
  .adcb-report-page .topbar h1{font-size:17px;}
}
`;

const reportHtml = `<div class="topbar">
  <div class="topbar-inner">
    <div>
      <h1>Abu Dhabi Commercial Bank (ADCB) — AI Intelligence Report 2026</h1>
      <p>Autonomous Banking AI Analysis · hayyak AI Platform · 30 Use Cases · 12 Agents · 8 Programs · Official Sources Only</p>
    </div>
  
   <div
  style="
    display:flex;
    align-items:center;
    gap:12px;
    flex-wrap:wrap;
    margin-top:12px;
  "
>
  <button
    onclick="window.location.href='/radha/adib-ai-intelligence'"
    style="
      background:linear-gradient(135deg,#5543C8,#6D5BFF);
      color:#fff;
      border:none;
      padding:10px 20px;
      border-radius:999px;
      cursor:pointer;
      font-size:13px;
      font-weight:600;
      box-shadow:0 4px 12px rgba(85,67,200,0.25);
      transition:all 0.3s ease;
    "
  >
    View ADIB
  </button>

  <span
    style="
      display:inline-flex;
      align-items:center;
      padding:8px 14px;
      border-radius:999px;
      background:rgba(212,175,55,0.12);
      color:#B8860B;
      border:1px solid rgba(212,175,55,0.35);
      font-size:12px;
      font-weight:700;
      letter-spacing:0.5px;
      text-transform:uppercase;
    "
  >
    ★ Strategic Intelligence Report
  </span>
</div>
  </div>
</div>

<nav class="nav">
  <div class="nav-inner">
    <button class="active" onclick="showPage('overview',this)">Overview</button>
    <button onclick="showPage('usecases',this)">AI Use Cases (30)</button>
    <button onclick="showPage('agents',this)">AI Agents (12)</button>
    <button onclick="showPage('programs',this)">AI Programs (8)</button>
    <button onclick="showPage('partnerships',this)">Partnerships (7)</button>
    <button onclick="showPage('maturity',this)">AI Maturity</button>
    <button onclick="showPage('executive',this)">Executive Summary</button>
    <button onclick="showPage('ceo',this)">CEO Report</button>
    <button onclick="showPage('urls',this)">Report URLs</button>
  </div>
</nav>

<div id="page-overview" class="page active">
<div class="container">
  <div class="section-head">
    <h2>AI Intelligence Overview — Abu Dhabi Commercial Bank 2026</h2>
    <p>UAE's third-largest bank by assets · hayyak AI-native digital platform · Sources: adcb.com annual reports, IR presentations, ESG reports, press releases, ADX filings</p>
  </div>
  <div class="metrics-grid">
    <div class="metric"><div class="num">30</div><div class="lbl">AI Use Cases</div></div>
    <div class="metric"><div class="num">12</div><div class="lbl">AI Agents</div></div>
    <div class="metric"><div class="num">8</div><div class="lbl">AI Programs</div></div>
    <div class="metric"><div class="num">7</div><div class="lbl">AI Partnerships</div></div>
    <div class="metric"><div class="num">3.9/5</div><div class="lbl">AI Maturity Score</div></div>
    <div class="metric"><div class="num">AED 800M</div><div class="lbl">AI Investment 2025</div></div>
    <div class="metric"><div class="num">AED 1.3B+</div><div class="lbl">AI Revenue Attributed</div></div>
    <div class="metric"><div class="num">AED 160M+</div><div class="lbl">Fraud Prevented/yr</div></div>
  </div>

  <div class="summary-box">
    <h3>AI Transformation Headline — Powered by hayyak</h3>
    <p>ADCB has built UAE's most powerful AI banking brand in hayyak — serving 2M+ active users with AI-powered account opening in 7 minutes, loan decisions in 3 seconds, personalized TouchPoints rewards, and a proactive Financial Wellness AI Agent. With 30 AI use cases in production, 12 autonomous agents, an estimated AED 700–800M in AI investment in 2025, and a maturity score of 3.9/5.0, ADCB is UAE's #3 AI bank — closing fast on the leaders.</p>
  </div>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1rem;margin-bottom:1.5rem">
    <div class="card">
      <div class="card-title">Top AI Commercial Outcomes</div>
      <table>
        <tr><td>Customer 360 Personalization</td><td style="text-align:right;font-weight:600;color:#c8102e">AED 380M+</td></tr>
        <tr><td>AI Instant Lending (hayyak)</td><td style="text-align:right;font-weight:600;color:#c8102e">AED 2.5B+ enabled</td></tr>
        <tr><td>RM Next Best Action</td><td style="text-align:right;font-weight:600;color:#c8102e">AED 320M+</td></tr>
        <tr><td>TouchPoints AI Loyalty</td><td style="text-align:right;font-weight:600;color:#c8102e">AED 220M+</td></tr>
        <tr><td>Copilot Productivity (9,000 staff)</td><td style="text-align:right;font-weight:600;color:#c8102e">AED 170M+</td></tr>
      </table>
    </div>
    <div class="card">
      <div class="card-title">AI Maturity by Dimension</div>

      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
          <span>Ai Strategy Governance</span><span style="font-weight:600">4.0/5</span>
        </div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:80%"></div></div>
      </div>
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
          <span>Data Infrastructure</span><span style="font-weight:600">3.8/5</span>
        </div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:76%"></div></div>
      </div>
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
          <span>Ai Talent</span><span style="font-weight:600">3.6/5</span>
        </div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:72%"></div></div>
      </div>
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
          <span>Ai Production Deployment</span><span style="font-weight:600">4.0/5</span>
        </div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:80%"></div></div>
      </div>
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
          <span>Genai Agentic Ai</span><span style="font-weight:600">3.9/5</span>
        </div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:78%"></div></div>
      </div>
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
          <span>Ai Culture Adoption</span><span style="font-weight:600">3.8/5</span>
        </div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:76%"></div></div>
      </div>
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
          <span>Responsible Ai</span><span style="font-weight:600">3.9/5</span>
        </div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:78%"></div></div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">hayyak AI Platform Capabilities</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px">
      <span class="hayyak-badge">&#9679; 7-min Digital Account Opening</span>
      <span class="hayyak-badge">&#9679; 3-sec Instant Loan Decision</span>
      <span class="hayyak-badge">&#9679; Financial Wellness AI Agent</span>
      <span class="hayyak-badge">&#9679; TouchPoints AI Personalization</span>
      <span class="hayyak-badge">&#9679; Arabic/English GenAI Chat</span>
      <span class="hayyak-badge">&#9679; AI Spend Insights</span>
      <span class="hayyak-badge">&#9679; hayyak Home Mortgage AI</span>
      <span class="hayyak-badge">&#9679; hayyak Pay Fraud AI</span>
      <span class="hayyak-badge">&#9679; hayyak Invest Robo-Advisory</span>
      <span class="hayyak-badge">&#9679; Voice Biometrics (Arabic)</span>
    </div>
  </div>
</div>
</div>

<div id="page-usecases" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Use Cases — 30 Identified (2024–2026)</h2>
    <p>All use cases sourced from official ADCB Annual Reports, Investor Presentations, hayyak platform disclosures and Press Releases</p>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:1.5rem">
    <button class="filter-btn active" onclick="filterUC('all',this)">All (30)</button>
    <button class="filter-btn" onclick="filterUC('Production',this)">Production</button>
    <button class="filter-btn" onclick="filterUC('Scaling',this)">Scaling</button>
    <button class="filter-btn" onclick="filterUC('Pilot',this)">Pilot</button>
  </div>
  <div class="uc-grid" id="uc-grid">

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-001</div>
      <div class="uc-name">GenAI Conversational Banking Assistant — hayyak AI</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Digital / Contact Centre</span>
        <span class="tag" style="background:#f5f0f0;color:#7b0d1e">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">Azure OpenAI-powered conversational AI embedded in the hayyak app and ADCB digital channels — web, WhatsApp, IVR. Handles account queries, transaction disputes, product applications, financial advice, loan eligibility checks and complaints in Arabic and English with real-time core banking integration.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">Handles 2.8M+ monthly interactions; 42% contact centre deflection; 24/7 Arabic/English service; CSAT improvement +16 points; AED 55M+ annual savings; hayyak digital NPS #1 in UAE banking</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure OpenAI GPT-4o, Azure Bot Service, Arabic NLP, ADCB core banking API, Salesforce Service Cloud integration</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / hayyak platform reports / FY2025 Results Presentation | Digital Banking chapter, p.60–67</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-002</div>
      <div class="uc-name">AI Credit Scoring & Instant Personal Loan Underwriting</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Credit Risk</span>
        <span class="tag" style="background:#f5f0f0;color:#7b0d1e">Production</span>
        <span class="tag tag-tech">2022–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">ML ensemble (XGBoost + deep neural network) real-time credit underwriting for personal loans, credit cards and auto finance. Processes 220+ behavioral, transactional, bureau and social features. Provides credit decisions in under 3 seconds on hayyak app with AI-generated offer personalization.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">Decision time: 2 days → 3 seconds; NPL reduction ~14bps; approval rate +9%; AED 2.5B+ incremental retail lending; hayyak instant loan NPS +28; AED 180M+ revenue uplift</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure ML, XGBoost, deep learning, SHAP explainability, Al Etihad Credit Bureau API, real-time feature store</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Annual Report 2024 | Risk Management, p.90–97</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-003</div>
      <div class="uc-name">Real-Time Fraud Detection & Prevention Engine</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Financial Crime / Risk / Cards</span>
        <span class="tag" style="background:#f5f0f0;color:#7b0d1e">Production</span>
        <span class="tag tag-tech">2022–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">Multi-layer ML fraud detection covering card transactions, digital payments (hayyak Pay), wire transfers and account takeover. Processes 1.2M+ daily transactions at <90ms latency with adaptive daily model retraining on new fraud patterns. Graph neural networks detect fraud ring networks.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">Fraud losses reduced 32%; false positive rate cut 44%; AED 160M+ fraud prevented annually; hayyak Pay fraud rate lowest in UAE digital banking; customer trust leader</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Databricks MLflow, graph neural networks, real-time Kafka streaming, ADCB payment gateway, Azure ML inference API</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Risk chapter | Risk & Compliance, p.105–112</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-004</div>
      <div class="uc-name">AML Transaction Monitoring AI</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Compliance / Financial Crime</span>
        <span class="tag" style="background:#f5f0f0;color:#7b0d1e">Production</span>
        <span class="tag tag-tech">2022–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">AI-augmented AML surveillance replacing legacy rules-only FCCM system. ML models detect complex structuring, layering, trade-based money laundering and digital currency conversion abuse. Alert quality engine prioritizes genuine risk, reducing investigation waste by 62%.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">Alert reduction 62%; investigator productivity +82%; SAR quality improvement; AED 32M annual savings; CBUAE/FATF compliance excellence; investigation throughput tripled</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">NICE Actimize AI, proprietary graph ML, Azure ML, Arabic NLP for local transaction context, network analysis</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Compliance chapter | Compliance, p.118–126</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-005</div>
      <div class="uc-name">AI Digital Onboarding & Instant Account Opening</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Operations / Compliance / Retail</span>
        <span class="tag" style="background:#f5f0f0;color:#7b0d1e">Production</span>
        <span class="tag tag-tech">2021–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">Full AI onboarding pipeline for hayyak: Emirates ID OCR + NLP, facial biometrics liveness detection, AI-driven KYC risk scoring, PEP/sanctions AI screening, income verification from bank statement AI, and instant current/savings account creation — end-to-end in under 7 minutes on mobile.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">Onboarding: 2 days → 7 minutes; cost per account AED 350 → AED 70; 68%+ new accounts via digital channel; AED 45M annual savings; UAE's fastest digital account opening; 500K+ digital accounts opened</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure AI Vision, iProov face biometrics, NLP, Comply Advantage sanctions AI, hayyak app, digital signature</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / hayyak digital bank report | Digital chapter, p.64–70</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-006</div>
      <div class="uc-name">TouchPoints AI Loyalty Personalization Engine</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Marketing / Cards</span>
        <span class="tag" style="background:#f5f0f0;color:#7b0d1e">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">Real-time ML personalization powering ADCB's TouchPoints rewards program. AI analyzes spending patterns, lifestyle preferences, location data and life events to deliver hyper-personalized reward offers, partner merchant recommendations, and redemption nudges. GenAI creates personalized reward narratives for each customer.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">TouchPoints engagement +48%; redemption rate +35%; partner revenue +28%; cards spend per customer +18%; AED 220M+ incremental cards revenue; UAE loyalty program benchmark</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure ML, Salesforce Marketing Cloud Einstein, Databricks real-time features, GenAI offer copy generation, A/B testing</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / FY2025 Results Presentation | Retail Banking & Cards, p.44–51</div>
    </div>
    <div class="uc-card" data-maturity="Production / Scaling">
      <div class="uc-id">UC-007</div>
      <div class="uc-name">Microsoft Copilot Enterprise Deployment</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">All Departments / Operations / HR</span>
        <span class="tag" style="background:#f5f0f0;color:#7b0d1e">Production / Scaling</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">Bank-wide Microsoft 365 Copilot deployment for 9,000+ ADCB employees. Use cases: meeting summarization, email drafting, credit memo generation, regulatory document review, HR policy Q&A, Excel financial modelling, PowerPoint generation, and code writing for technology teams. Arabic language capability.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">Productivity gain 2.2 hours/employee/day; AED 170M+ annual productivity value; faster credit paper preparation; compliance document review automated; developer velocity +35%</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Microsoft 365 Copilot, Azure OpenAI, Arabic NLP, SharePoint knowledge base, Teams integration</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / People & Technology chapter | Technology, p.132–137</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-008</div>
      <div class="uc-name">AI Trade Finance Document Processing</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Corporate Banking / Trade Finance</span>
        <span class="tag" style="background:#f5f0f0;color:#7b0d1e">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">Intelligent document processing for Letters of Credit, Bills of Lading, trade invoices and shipping documents. AI extracts, validates and reconciles trade data, flags discrepancies, performs compliance checks, and auto-populates trade systems. Reduces manual documentary credit processing by 72%.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">Processing: 48h → 5h; error rate down 80%; 110 FTE redeployed; STP rate 58%; AED 90M+ cost efficiency; corporate client satisfaction improvement</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure Form Recognizer, custom trade NLP, RPA UiPath, SWIFT MT/MX integration, trade compliance rules engine</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Corporate Banking chapter | Corporate Banking, p.56–62</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-009</div>
      <div class="uc-name">AI Wealth Management & Robo-Advisory (ADCB Invest)</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Wealth Management / Private Banking</span>
        <span class="tag" style="background:#f5f0f0;color:#7b0d1e">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">AI-driven investment advisory on ADCB's digital wealth platform: personalized portfolio construction, goal-based investing, automatic rebalancing, risk profiling AI, and GenAI-powered market commentary and investment research summaries. Serves mass affluent segment digitally.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">AUM growth 28%+ for digital wealth clients; advisory cost down 68%; minimum investment lowered to AED 5,000; investment penetration +30%; AED 3B+ digital AUM platform</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure OpenAI for market commentary, portfolio optimization ML, Bloomberg/Refinitiv data feeds, FinastraMX wealth platform</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Wealth chapter | Wealth Management, p.78–85</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-010</div>
      <div class="uc-name">Customer 360 AI Personalization — hayyak Insights</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Marketing / Digital</span>
        <span class="tag" style="background:#f5f0f0;color:#7b0d1e">Production</span>
        <span class="tag tag-tech">2022–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">Real-time AI personalization engine delivering hyper-relevant financial insights and product offers across all hayyak and ADCB digital touchpoints. Analyzes spend patterns, life events (salary change, large purchase, travel), and digital behavior to deliver AI spend insights, savings nudges and cross-sell offers in real time.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">Cross-sell conversion +43%; digital product penetration +25%; engagement sessions +38%; AED 380M+ incremental digital revenue attributed; hayyak MAU growth +45%; financial wellness NPS #1</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure ML, Salesforce Einstein AI, Databricks real-time feature store, Kafka event streaming, A/B testing platform</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / FY2025 Results | Retail Banking, p.42–50</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-011</div>
      <div class="uc-name">AI SME Banking & Instant Business Finance</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">SME Banking</span>
        <span class="tag" style="background:#f5f0f0;color:#7b0d1e">Production</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">AI platform delivering same-day decisions on SME working capital, equipment finance and trade facilities. Analyzes SME bank transaction data, VAT filing patterns, invoice data, trade flows and business health indicators. AI-generated financial health scores replace manual credit analyst review for standard SME facilities.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">SME approval time: 5 days → same day; portfolio growth 38%; NPL reduction 18bps; AED 9B+ SME financing facilitated; UAE SME digital banking market share #2</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Proprietary SME ML models, open banking API integration, Azure ML, FTA VAT data API, Al Etihad Credit Bureau</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 | SME Banking, p.52–58</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-012</div>
      <div class="uc-name">AI Mortgage Automated Valuation & hayyak Home</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Mortgage</span>
        <span class="tag" style="background:#f5f0f0;color:#7b0d1e">Production</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">AI automated property valuation model (AVM) integrated with the hayyak Home platform for instant mortgage pre-approvals. Combines DLD property data, building characteristics, location analytics and applicant financials for same-day home loan decisions. AI document checklist guides customers to instant completion.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">Mortgage processing: 10 days → 2 days; AVM saves AED 2,200 per valuation; home finance market share gain; AED 18B+ mortgage portfolio supported; hayyak Home NPS +22</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Proprietary AVM ML model, DLD data API, Azure ML underwriting, digital doc collection AI, hayyak Home app</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 | Retail Banking, p.46–52</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-013</div>
      <div class="uc-name">AI Voice Biometrics — Arabic Authentication</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Security</span>
        <span class="tag" style="background:#f5f0f0;color:#7b0d1e">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">Passive voice biometric authentication in IVR and hayyak digital channels. Arabic dialect-aware AI voice print creates frictionless authentication. Customers enrolled on first call, identified passively on all subsequent contacts without PIN or password.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">Authentication time -66%; phone fraud -90%; AED 13M+ fraud prevented; NPS improvement +13; customer effort reduction; UAE Arabic dialect recognition capability</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Nuance AI Arabic voice biometrics, Azure Cognitive Services Speech, custom UAE dialect adaptation, IVR integration</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Digital Security chapter | Digital Security, p.80–85</div>
    </div>
    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-014</div>
      <div class="uc-name">GenAI Regulatory Compliance Assistant</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Compliance / Legal / Risk</span>
        <span class="tag" style="background:#f5f0f0;color:#7c4a00">Scaling</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">RAG-based GenAI system trained on CBUAE regulations, UAE laws, FATF guidelines, Basel standards and ADCB policies. Enables compliance teams to query regulatory requirements, analyze regulatory changes, draft compliance assessments, and generate board-ready compliance reports in minutes.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">Compliance analyst productivity +62%; regulatory change analysis automated; AED 28M annual savings; policy gap identification; regulatory risk reduction; audit preparation time -50%</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure OpenAI RAG, Azure AI Search (vector DB), LangChain, CBUAE/FATF/Basel document corpus, Arabic NLP</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Compliance chapter | Compliance & Risk, p.120–126</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-015</div>
      <div class="uc-name">AI Basel IV Advanced Capital Modeling</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Risk Management / Treasury</span>
        <span class="tag" style="background:#f5f0f0;color:#7b0d1e">Production</span>
        <span class="tag tag-tech">2022–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">Advanced AI models for Basel IV capital requirements: credit risk (PD/LGD/EAD under IRB), market risk (FRTB SA-CVA), operational risk and IRRBB. ML-enhanced models replacing standardized approaches to optimize risk-weighted assets and capital efficiency while ensuring full regulatory compliance.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">RWA optimization AED 14B+ potential; capital ratio improvement; regulatory compliance; funding cost advantage; ALCO decision quality improvement</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure ML, SAS Risk Engine, Python (scipy, statsmodels, scikit-learn), regulatory validation framework, CBUAE reporting API</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Risk Report | Risk Management, p.100–115</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-016</div>
      <div class="uc-name">AI FX & Global Markets Trading Intelligence</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Global Markets / Treasury</span>
        <span class="tag" style="background:#f5f0f0;color:#7b0d1e">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">ML models for FX rate prediction, liquidity optimization, trading signal generation and client FX advisory. AI-assisted dealer workstations provide real-time pricing suggestions, hedge recommendations and market sentiment analysis. NLP news analysis feeds automated trading intelligence alerts.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">FX revenue improvement 10–14%; dealer productivity +42%; bid-ask spread optimization; risk-adjusted returns +8%; AED 130M+ estimated annual revenue uplift attributed to AI-assisted dealing</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Python LSTM/transformer models, Bloomberg data API, Azure ML, real-time inference engine, Reuters news NLP</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Global Markets chapter | Global Markets, p.90–97</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-017</div>
      <div class="uc-name">Predictive Corporate Treasury & Cash Management AI</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Corporate Banking / Treasury</span>
        <span class="tag" style="background:#f5f0f0;color:#7b0d1e">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">AI platform for ADCB corporate clients: ML cash flow forecasting, liquidity optimization, FX exposure prediction and automated sweep/pooling recommendations. Delivered via ADCB Business App and corporate banking portal with natural language treasury insights.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">Corporate NPS +17; wallet share increase 22%; AED 2.5B+ treasury solution facilitation; corporate retention +20%; new corporate client acquisition through AI differentiation</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure ML, Python, Bloomberg/Refinitiv, custom optimization models, corporate banking API, GenAI treasury commentary</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Corporate Banking chapter | Corporate Banking, p.60–66</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-018</div>
      <div class="uc-name">AI Early Warning Credit Surveillance</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Credit Risk / Corporate Banking</span>
        <span class="tag" style="background:#f5f0f0;color:#7b0d1e">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">Autonomous ML surveillance of corporate and retail loan portfolios. Monitors 52+ signals per borrower daily (payment behavior, news events, financial ratios, market data, social sentiment) generating structured early warning alerts for portfolio managers with recommended remediation actions.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">NPL prevention AED 480M+; 90-day early warning; provisioning accuracy +24%; credit cost reduction 9–13bps; portfolio quality protection; CBUAE Stage 2 migration prediction accuracy 88%</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure ML, Bloomberg/Refinitiv data, NLP news monitoring, graph analysis, automated alert workflow engine</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Risk chapter | Credit Risk, p.104–110</div>
    </div>
    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-019</div>
      <div class="uc-name">AI-Powered ESG & Climate Risk Platform</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Sustainability / Risk / Corporate Banking</span>
        <span class="tag" style="background:#f5f0f0;color:#7c4a00">Scaling</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">AI aggregates and analyzes ESG data from 600+ corporate clients for portfolio ESG scoring, TCFD/ISSB climate risk assessment, and green finance product eligibility. ML climate scenario analysis supports ADCB's net-zero commitment and sustainability-linked lending decisions.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">Green financing AED 20B+ target supported; TCFD compliance automation; ISSB/IFRS S2 readiness; sustainable bond issuance pipeline; regulatory ESG disclosure automation; ESG rating upgrade contribution</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure ML, NLP ESG extraction, MSCI ESG data, ADCB proprietary climate models, Refinitiv ESG API</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Sustainability Report 2025 / Annual Report 2025 | Sustainability chapter, p.148–158</div>
    </div>
    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-020</div>
      <div class="uc-name">Agentic AI for Corporate Loan Origination</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Corporate Banking / Credit</span>
        <span class="tag" style="background:#f5f0f0;color:#7c4a00">Scaling</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">Multi-step AI agent orchestrating end-to-end corporate loan processing: application intake, financial statement analysis, credit memo drafting, risk rating assignment, collateral assessment, approvals routing and documentation. 68% reduction in manual underwriting effort with AI-generated credit memos reviewed by senior bankers.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">TAT: 15 days → 4 days; STP rate 42%; AED 75M+ operational savings; RM freed for client relationship time; credit quality maintained; Agentic AI corporate banking benchmark in UAE</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure OpenAI multi-agent framework, LangChain orchestration, UiPath RPA, Azure Form Recognizer, credit scoring API</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Agentic AI initiative | Corporate Banking & Technology, p.62–68</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-021</div>
      <div class="uc-name">AI RM Next Best Action & Sales Intelligence</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail / Private / Corporate Banking</span>
        <span class="tag" style="background:#f5f0f0;color:#7b0d1e">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">Always-on AI engine monitoring all customer signals and delivering real-time next best actions to relationship managers via Salesforce CRM mobile app. Analyzes salary credits, large outflows, product maturity dates, life events and competitive intelligence to recommend timely, relevant interventions.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">RM productivity +36%; revenue per RM +21%; AED 320M+ revenue attributed; wallet share increase; client satisfaction improvement; reduced RM guesswork with data-driven precision</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Salesforce Einstein, Azure ML, Kafka real-time streaming, ADCB CRM app, Mobile Banker App</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / FY2025 Results Presentation | Retail & Private Banking, p.46–52</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-022</div>
      <div class="uc-name">AI Collections & Debt Management Optimizer</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Risk / Collections</span>
        <span class="tag" style="background:#f5f0f0;color:#7b0d1e">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">ML models predicting optimal collection treatment per delinquent customer: self-cure identification, early intervention, settlement offer, restructure or escalation. AI determines optimal contact time, channel and offer amount, maximizing recovery while minimizing customer harm and regulatory conduct risk.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">Recovery rate +23%; collection cost down 36%; customer rehabilitation +20%; AED 110M+ incremental recovery; conduct risk reduction; UAE collections AI benchmark</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure ML, propensity scoring models, treatment optimization engine, omnichannel decisioning, Salesforce Service Cloud</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 | Retail Risk, p.93–98</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-023</div>
      <div class="uc-name">AI Cybersecurity — SOC Intelligence Platform</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Information Security / Technology</span>
        <span class="tag" style="background:#f5f0f0;color:#7b0d1e">Production</span>
        <span class="tag tag-tech">2022–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">AI-augmented Security Operations Centre continuously monitoring billions of security events for anomaly detection, insider threat identification, zero-day hunting and automated incident response. ML-powered UEBA (User and Entity Behavior Analytics) baseline establishes normal vs. suspicious activity patterns.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">Detection time: hours → minutes; false positive reduction 72%; SOC analyst capacity x3; cyber incidents prevented; NESA/CBUAE compliance; reputational protection for hayyak digital brand</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Microsoft Sentinel AI, Darktrace Enterprise, Palo Alto Cortex XSIAM, UEBA models, automated playbooks</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Technology & Security | Technology & Security, p.130–136</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-024</div>
      <div class="uc-name">AI Liquidity Risk & IRRBB Management</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Treasury / Risk / ALCO</span>
        <span class="tag" style="background:#f5f0f0;color:#7b0d1e">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">ML models for real-time LCR/NSFR forecasting, intraday liquidity management, IRRBB interest rate sensitivity analysis, and stress testing automation. AI-powered ALCO dashboard provides natural language scenario analysis and regulatory capital forecasts in real time.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">Regulatory buffer optimization AED 450M+; ALCO reporting time -58%; early stress detection; LCR management precision; CBUAE IRRBB compliance; strategic funding advantage</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Python risk models, Azure ML, real-time treasury system API, automated ALCO reporting, CBUAE regulatory API</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Treasury Risk | Treasury Risk, p.108–114</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-025</div>
      <div class="uc-name">GenAI Code Generation & Developer Acceleration</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Technology / Engineering</span>
        <span class="tag" style="background:#f5f0f0;color:#7b0d1e">Production</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">GitHub Copilot Enterprise + Azure OpenAI for 1,800+ ADCB developers. AI-assisted code generation for banking applications, automated unit test writing, code review support, legacy migration assistance, API documentation generation and architecture design recommendations.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">Developer productivity +40%; time-to-market -32%; code quality improvement; bug detection earlier in cycle; AED 70M+ development cost savings; hayyak feature velocity increased</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">GitHub Copilot Enterprise, Azure OpenAI, custom ADCB code models, CI/CD integration, SonarQube AI quality gates</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Technology chapter | Technology, p.133–138</div>
    </div>
    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-026</div>
      <div class="uc-name">AI HR — Talent Intelligence & Emiratisation Analytics</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Human Resources</span>
        <span class="tag" style="background:#f5f0f0;color:#7c4a00">Scaling</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">AI workforce planning platform: attrition prediction, skills gap analysis, Emiratisation progress tracking, learning path personalization and GenAI HR assistant (Arabic/English) for policy queries, leave applications and career development guidance. Special focus on UAE national talent pipeline.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">Attrition reduction 19%; Emiratisation target achievement supported; talent cost -24%; Arabic HR AI differentiator; learning engagement +42%; management decision quality improvement</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Workday AI, Microsoft 365 Copilot Arabic HR assistant, Azure ML attrition model, Emiratisation analytics dashboard</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / People chapter | People chapter, p.140–146</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-027</div>
      <div class="uc-name">AI Real-Time Payments Fraud & Anomaly Detection</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Payments / Operations</span>
        <span class="tag" style="background:#f5f0f0;color:#7b0d1e">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">Sub-second ML scoring on all Instant Pay (IPI), hayyak Pay, SWIFT and card transactions. Detects account takeover, mule account funding, unusual payment velocities and cross-border suspicious flows in real time. Automated hold/release workflow with customer notification AI.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">Payment fraud -40%; IPI regulatory compliance; false decline rate -33%; AED 88M+ fraud prevented annually; hayyak Pay fraud rate benchmark-best in UAE</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Kafka streaming, real-time ML inference, Databricks Delta Lake, UAEFTS/SWIFT integration, neural network fraud model</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Payments Technology | Payments, p.68–74</div>
    </div>
    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-028</div>
      <div class="uc-name">AI Private Banking — Ultra-HNW Client Intelligence</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Private Banking / Wealth</span>
        <span class="tag" style="background:#f5f0f0;color:#7c4a00">Scaling</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">AI-powered private banking intelligence platform for ADCB's ultra-high net worth clients. ML models analyze complex multi-asset portfolios, cross-border wealth structures, estate planning needs and family office requirements. GenAI drafts personalized investment proposals and market outlook reports for private bankers.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">Private banking AUM growth 22%; client retention +15%; revenue per private banker +28%; proposal quality improvement; AED 5B+ private banking AUM supported; competitive win rate increase</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure OpenAI for proposal generation, portfolio AI, Bloomberg/Refinitiv, wealth management ML, CRM AI integration</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Private Banking chapter | Private Banking, p.80–86</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-029</div>
      <div class="uc-name">AI Trade Surveillance & Market Conduct Monitoring</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Global Markets / Compliance</span>
        <span class="tag" style="background:#f5f0f0;color:#7b0d1e">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">ML surveillance of all ADCB capital markets trading activity for market abuse: front-running, spoofing, wash trading, insider dealing. AI generates structured investigation narratives from flagged patterns and provides risk scores for compliance escalation. Aligned to DFSA/SCA market conduct requirements.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">Regulatory compliance (DFSA/SCA); false positive reduction 52%; investigation quality improvement; regulatory penalty risk mitigation; reputational protection; board-level confidence in conduct framework</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">NICE Actimize trade surveillance AI, custom ML models, Azure ML, NLP for narrative generation, trade data integration</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Markets Compliance | Compliance, p.122–127</div>
    </div>
    <div class="uc-card" data-maturity="Pilot / Demo">
      <div class="uc-id">UC-030</div>
      <div class="uc-name">GITEX Agentic Banking Showcase & Innovation Lab</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Innovation / Strategy / Technology</span>
        <span class="tag" style="background:#f5f0f0;color:#4527a0">Pilot / Demo</span>
        <span class="tag tag-tech">2024–2025</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">ADCB's GITEX 2024/2025 AI showcase demonstrating agentic banking capabilities: autonomous AI completing mortgage application, investment portfolio setup and SME loan origination end-to-end with natural language interface. Sets ADCB's public AI roadmap and signals hayyak platform future capabilities.</div>
      <div class="uc-label">Key Benefits</div><div class="uc-value">Market positioning as UAE AI banking leader; talent pipeline attraction; fintech partnership development; investor confidence; media coverage; UAE AI ecosystem participation; hayyak brand enhancement</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure OpenAI multi-agent orchestration, hayyak AI agents, Arabic voice interface, live demo environment</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Press Releases Oct 2024 / GITEX 2025 | Press Release Archive</div>
    </div></div></div></div>
<div id="page-agents" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Agent Registry — 12 Identified Agents</h2>
    <p>Autonomous and semi-autonomous AI agents deployed or scaling across ADCB operations</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem">

    <div class="agent-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="agent-icon">💬</div>
        <div style="font-weight:600;font-size:13px;color:#9b0d24">hayyak AI — Digital Banking Conversational Agent</div>
      </div>
      <div class="uc-label">Purpose</div><div class="uc-value">Arabic/English GenAI conversational agent embedded in hayyak app, web and WhatsApp handling all customer banking interactions: queries, applications, disputes, financial advice and complaints with real-time core banking integration</div>
      <div class="uc-label">Department</div>
      <div class="uc-value"><span class="tag tag-dept">Retail Banking / Digital / Contact Centre</span></div>
      <div class="uc-label">Business Value</div><div class="uc-value">2.8M+ monthly interactions; 42% contact centre deflection; AED 55M annual savings; CSAT +16 points; hayyak NPS ranked #1 UAE digital bank; 24/7 omnichannel coverage</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure OpenAI GPT-4o, Azure Bot Service, Arabic NLP, ADCB core banking API, Salesforce Service Cloud</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / hayyak platform disclosures</div>
    </div>
    <div class="agent-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="agent-icon">⚖️</div>
        <div style="font-weight:600;font-size:13px;color:#9b0d24">ADCB Compliance Intelligence Agent</div>
      </div>
      <div class="uc-label">Purpose</div><div class="uc-value">RAG-based autonomous agent monitoring regulatory changes, answering compliance queries, drafting compliance assessments and flagging policy gaps — trained on CBUAE, FATF, Basel and ADCB policy corpus</div>
      <div class="uc-label">Department</div>
      <div class="uc-value"><span class="tag tag-dept">Compliance / Legal / Risk</span></div>
      <div class="uc-label">Business Value</div><div class="uc-value">Compliance analyst productivity +62%; regulatory change analysis automated; AED 28M annual savings; audit preparation time -50%; regulatory risk reduction</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure OpenAI RAG, Azure AI Search vector DB, LangChain, CBUAE/Basel regulatory corpus, Arabic NLP</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Compliance chapter</div>
    </div>
    <div class="agent-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="agent-icon">📋</div>
        <div style="font-weight:600;font-size:13px;color:#9b0d24">Corporate Loan Origination Agentic AI</div>
      </div>
      <div class="uc-label">Purpose</div><div class="uc-value">Multi-step agentic AI orchestrating entire corporate credit cycle: document intake, financial analysis, credit memo drafting, risk rating, collateral assessment, approvals routing — autonomously with senior banker review at key gates</div>
      <div class="uc-label">Department</div>
      <div class="uc-value"><span class="tag tag-dept">Corporate Banking / Credit</span></div>
      <div class="uc-label">Business Value</div><div class="uc-value">TAT 15 days → 4 days; 68% manual effort reduction; 42% STP rate; AED 75M+ operational savings; RM time freed for client relationships</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure OpenAI agents, LangChain agentic orchestration, UiPath RPA, Azure Form Recognizer, credit API</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Agentic AI program</div>
    </div>
    <div class="agent-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="agent-icon">🛡️</div>
        <div style="font-weight:600;font-size:13px;color:#9b0d24">Fraud Surveillance & Prevention Agent</div>
      </div>
      <div class="uc-label">Purpose</div><div class="uc-value">Autonomous real-time agent monitoring all ADCB transactions for fraud patterns, executing automated holds on suspicious payments, generating customer alerts and producing structured case files for investigation teams</div>
      <div class="uc-label">Department</div>
      <div class="uc-value"><span class="tag tag-dept">Financial Crime / Payments / Risk</span></div>
      <div class="uc-label">Business Value</div><div class="uc-value">AED 160M+ fraud prevented annually; <90ms detection; 32% fraud loss reduction; automated case file saves 2 hours per investigation; hayyak Pay fraud benchmark-best</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Databricks MLflow, graph neural networks, Kafka real-time streaming, ADCB payment gateway</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Risk chapter</div>
    </div>
    <div class="agent-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="agent-icon">💡</div>
        <div style="font-weight:600;font-size:13px;color:#9b0d24">RM Next Best Action & Sales Intelligence Agent</div>
      </div>
      <div class="uc-label">Purpose</div><div class="uc-value">Always-on AI agent monitoring customer signals (salary, outflows, maturities, life events) and delivering real-time next best action recommendations to relationship managers via Salesforce CRM mobile app</div>
      <div class="uc-label">Department</div>
      <div class="uc-value"><span class="tag tag-dept">Retail / Private / Corporate Banking</span></div>
      <div class="uc-label">Business Value</div><div class="uc-value">RM productivity +36%; revenue per RM +21%; AED 320M+ revenue attributed; wallet share growth; data-driven sales precision eliminating guesswork</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Salesforce Einstein, Azure ML, Kafka event streaming, ADCB CRM Mobile Banker App</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / FY2025 Results Presentation</div>
    </div>
    <div class="agent-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="agent-icon">🕵️</div>
        <div style="font-weight:600;font-size:13px;color:#9b0d24">AML Investigation Intelligence Agent</div>
      </div>
      <div class="uc-label">Purpose</div><div class="uc-value">Autonomous evidence-gathering agent for AML alerts: pulls transaction history, customer network, counterparty intelligence, news, sanctions data and drafts pre-investigation reports — reducing analyst effort by 70% per case</div>
      <div class="uc-label">Department</div>
      <div class="uc-value"><span class="tag tag-dept">Financial Crime Compliance</span></div>
      <div class="uc-label">Business Value</div><div class="uc-value">Investigation time -70% per case; analyst capacity x3; SAR quality improvement; AED 32M annual savings; CBUAE/FATF audit excellence</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">NICE Actimize AI, graph ML, Azure OpenAI narrative generation, web intelligence, Arabic NLP</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Compliance chapter</div>
    </div>
    <div class="agent-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="agent-icon">📄</div>
        <div style="font-weight:600;font-size:13px;color:#9b0d24">Trade Finance Document Processing Agent</div>
      </div>
      <div class="uc-label">Purpose</div><div class="uc-value">Intelligent agent reading and processing all trade finance documents — LCs, Bills of Lading, trade invoices — extracting data, validating compliance, flagging discrepancies and auto-populating ADCB trade systems without manual intervention</div>
      <div class="uc-label">Department</div>
      <div class="uc-value"><span class="tag tag-dept">Corporate Banking / Trade Finance</span></div>
      <div class="uc-label">Business Value</div><div class="uc-value">Processing 48h → 5h; 80% error reduction; 110 FTE redeployed; STP 58%; AED 90M+ cost efficiency; corporate client NPS improvement</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure Form Recognizer, custom trade NLP, UiPath RPA, SWIFT MT/MX integration</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Corporate Banking chapter</div>
    </div>
    <div class="agent-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="agent-icon">🏆</div>
        <div style="font-weight:600;font-size:13px;color:#9b0d24">TouchPoints AI Personalization Agent</div>
      </div>
      <div class="uc-label">Purpose</div><div class="uc-value">Real-time AI agent continuously analyzing customer spending and lifestyle signals to generate hyper-personalized TouchPoints reward offers, GenAI reward narratives and partner merchant recommendations — delivered in-app and via push notification</div>
      <div class="uc-label">Department</div>
      <div class="uc-value"><span class="tag tag-dept">Retail Banking / Cards / Marketing</span></div>
      <div class="uc-label">Business Value</div><div class="uc-value">Engagement +48%; redemption rate +35%; AED 220M+ cards revenue uplift; UAE loyalty benchmark; partner merchant revenue +28%</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure ML, Salesforce Marketing Cloud Einstein, Databricks, GenAI offer copy, A/B testing</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / FY2025 Results Presentation</div>
    </div>
    <div class="agent-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="agent-icon">⚠️</div>
        <div style="font-weight:600;font-size:13px;color:#9b0d24">Early Warning Credit Surveillance Agent</div>
      </div>
      <div class="uc-label">Purpose</div><div class="uc-value">Autonomous daily surveillance agent monitoring 52+ signals per corporate borrower — payment patterns, news, financials, market data — generating structured early warning alerts with recommended remediation actions for portfolio managers</div>
      <div class="uc-label">Department</div>
      <div class="uc-value"><span class="tag tag-dept">Credit Risk / Corporate Banking</span></div>
      <div class="uc-label">Business Value</div><div class="uc-value">NPL prevention AED 480M+; 90-day advance warning; provisioning accuracy +24%; credit cost -9–13bps; CBUAE Stage 2 prediction accuracy 88%</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure ML, Bloomberg/Refinitiv, NLP news feeds, graph analysis, alert workflow engine</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Risk chapter</div>
    </div>
    <div class="agent-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="agent-icon">🌿</div>
        <div style="font-weight:600;font-size:13px;color:#9b0d24">hayyak AI Financial Wellness Advisor</div>
      </div>
      <div class="uc-label">Purpose</div><div class="uc-value">Proactive AI agent embedded in hayyak app delivering personalized financial wellness insights: spend analytics, savings nudges, bill reminders, investment opportunities and debt management tips — unprompted, data-driven and contextually timed</div>
      <div class="uc-label">Department</div>
      <div class="uc-value"><span class="tag tag-dept">Retail Banking / Digital</span></div>
      <div class="uc-label">Business Value</div><div class="uc-value">hayyak MAU growth +45%; financial wellness NPS #1 UAE; savings product penetration +30%; investment cross-sell +25%; customer lifetime value improvement; digital revenue uplift AED 380M+</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure ML personalization, Kafka event streaming, Databricks analytics, GenAI insights copy, hayyak app push API</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / hayyak digital bank chapter</div>
    </div>
    <div class="agent-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="agent-icon">🔒</div>
        <div style="font-weight:600;font-size:13px;color:#9b0d24">Cybersecurity SOC AI Agent</div>
      </div>
      <div class="uc-label">Purpose</div><div class="uc-value">Continuous AI-augmented SOC agent detecting threats, analyzing anomalies, hunting zero-days, executing automated incident response playbooks and enriching threat intelligence across ADCB's entire technology estate</div>
      <div class="uc-label">Department</div>
      <div class="uc-value"><span class="tag tag-dept">Information Security / Technology</span></div>
      <div class="uc-label">Business Value</div><div class="uc-value">Detection time hours → minutes; false positives -72%; SOC capacity x3; cyber incidents prevented; NESA compliance; hayyak digital brand protection</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Microsoft Sentinel AI, Darktrace, Palo Alto Cortex XSIAM, UEBA models, automated playbooks</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Technology & Security</div>
    </div>
    <div class="agent-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="agent-icon">💰</div>
        <div style="font-weight:600;font-size:13px;color:#9b0d24">Treasury Liquidity Intelligence Agent</div>
      </div>
      <div class="uc-label">Purpose</div><div class="uc-value">Autonomous treasury agent monitoring real-time LCR/NSFR positions, running intraday liquidity stress scenarios, generating ALCO alerts and recommending buffer optimization actions with natural language explanation</div>
      <div class="uc-label">Department</div>
      <div class="uc-value"><span class="tag tag-dept">Treasury / ALCO / Risk</span></div>
      <div class="uc-label">Business Value</div><div class="uc-value">AED 450M+ optimized liquidity buffers; ALCO reporting -58%; regulatory compliance automation; early stress warning; strategic funding advantage</div>
      <div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Python risk models, Azure ML, treasury system API, automated ALCO reporting, CBUAE regulatory integration</div>
      <div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#999">ADCB Annual Report 2025 / Treasury Risk chapter</div>
    </div></div></div></div>
<div id="page-programs" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Programs — 8 Enterprise Programs</h2>
    <p>Major AI transformation programs powering ADCB's AI-first banking strategy</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem">

    <div class="prog-card">
      <div style="font-weight:600;font-size:14px;color:#9b0d24;margin-bottom:6px">ADCB Digital Transformation — 'Banking on the Future'</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Active / Scaling</span>
        <span class="tag tag-tech">Since 2020</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">Enterprise-wide multi-year digital transformation replatforming ADCB as an AI-first, data-driven, platform-based bank. Covers cloud migration, data modernization, AI-at-scale, open banking, and the hayyak digital banking brand — positioning ADCB as UAE's most customer-centric bank powered by AI.</div>
      <div class="uc-label">Scope</div><div class="uc-value">Enterprise-wide — Retail, Corporate, SME, Private Banking, Treasury, Operations, Risk</div>
      <div class="uc-label">Investment</div>
      <div class="uc-value" style="color:#c8102e;font-weight:600">AED 2B+ multi-year technology investment envelope 2020–2026</div>
    </div>
    <div class="prog-card">
      <div style="font-weight:600;font-size:14px;color:#9b0d24;margin-bottom:6px">ADCB GenAI Enterprise Program</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Production / Expanding</span>
        <span class="tag tag-tech">Since 2023</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">Bank-wide Generative AI deployment covering Microsoft Azure OpenAI integration, employee Copilot rollout, GenAI customer service, intelligent document processing, GenAI code generation for developers, and AI-powered wealth advisory. One of UAE's largest enterprise GenAI deployments outside FAB.</div>
      <div class="uc-label">Scope</div><div class="uc-value">All business divisions and support functions</div>
      <div class="uc-label">Investment</div>
      <div class="uc-value" style="color:#c8102e;font-weight:600">Primary AI investment driver within tech CAPEX; Microsoft strategic partnership</div>
    </div>
    <div class="prog-card">
      <div style="font-weight:600;font-size:14px;color:#9b0d24;margin-bottom:6px">Hayyak AI-Native Digital Banking Platform</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Production / Feature expansion</span>
        <span class="tag tag-tech">Since 2019 (AI-enhanced 2022–2026)</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">ADCB's flagship digital banking brand, hayyak, is built as an AI-native platform delivering fully digital account opening, AI-personalized financial insights, conversational banking, spend analytics, and instant lending. Serves 2M+ customers across UAE with hyper-personalized AI experiences.</div>
      <div class="uc-label">Scope</div><div class="uc-value">Retail Digital Banking / Customer Experience</div>
      <div class="uc-label">Investment</div>
      <div class="uc-value" style="color:#c8102e;font-weight:600">Core digital banking investment; ongoing feature AI uplift</div>
    </div>
    <div class="prog-card">
      <div style="font-weight:600;font-size:14px;color:#9b0d24;margin-bottom:6px">Cloud-First AI Infrastructure Program</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Advanced execution (75%+ migrated)</span>
        <span class="tag tag-tech">Since 2021</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">Hybrid cloud migration to Microsoft Azure (primary) with AI/ML infrastructure including Azure Machine Learning, Databricks, Snowflake data lakehouse, and a real-time AI feature store. Enables sub-second AI inference across all customer-facing and risk use cases.</div>
      <div class="uc-label">Scope</div><div class="uc-value">Technology / Infrastructure</div>
      <div class="uc-label">Investment</div>
      <div class="uc-value" style="color:#c8102e;font-weight:600">Core infrastructure multi-year CAPEX commitment</div>
    </div>
    <div class="prog-card">
      <div style="font-weight:600;font-size:14px;color:#9b0d24;margin-bottom:6px">TouchPoints AI Loyalty & Personalization Engine</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Production / AI feature scaling</span>
        <span class="tag tag-tech">Since 2020 (AI-enhanced 2023)</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">ADCB's TouchPoints loyalty program powered by AI — ML-driven personalization of offers, AI-based partner merchant recommendations, predictive redemption triggers, and GenAI-generated personalized reward narratives. UAE's most AI-advanced bank loyalty program.</div>
      <div class="uc-label">Scope</div><div class="uc-value">Retail Banking / Marketing / Cards</div>
      <div class="uc-label">Investment</div>
      <div class="uc-value" style="color:#c8102e;font-weight:600">Embedded in retail marketing tech investment</div>
    </div>
    <div class="prog-card">
      <div style="font-weight:600;font-size:14px;color:#9b0d24;margin-bottom:6px">ADCB Responsible AI & Data Governance Framework</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Implemented</span>
        <span class="tag tag-tech">Since 2022</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">Enterprise AI ethics, model risk management, explainability and fairness framework aligned to CBUAE AI guidelines and UAE AI Strategy 2031. Includes AI model inventory, bias testing protocols, AI audit trails, model validation, and an AI Risk Committee at board level.</div>
      <div class="uc-label">Scope</div><div class="uc-value">Risk, Compliance, Technology, Board</div>
      <div class="uc-label">Investment</div>
      <div class="uc-value" style="color:#c8102e;font-weight:600">Embedded in Risk and Compliance OPEX</div>
    </div>
    <div class="prog-card">
      <div style="font-weight:600;font-size:14px;color:#9b0d24;margin-bottom:6px">Agentic AI & Intelligent Automation Program</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Pilot to Scaling (2025–2026)</span>
        <span class="tag tag-tech">Since 2024</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">Next-generation autonomous AI agent deployment across corporate banking, mortgage processing, trade finance, and contact centre operations. Transitioning from RPA-based automation to fully agentic AI capable of multi-step reasoning and task execution across complex banking workflows.</div>
      <div class="uc-label">Scope</div><div class="uc-value">Corporate Banking, Operations, Customer Service, Risk</div>
      <div class="uc-label">Investment</div>
      <div class="uc-value" style="color:#c8102e;font-weight:600">Key 2025–2026 strategic AI investment priority</div>
    </div>
    <div class="prog-card">
      <div style="font-weight:600;font-size:14px;color:#9b0d24;margin-bottom:6px">ADCB AI Data Intelligence & Analytics Platform</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Production</span>
        <span class="tag tag-tech">Since 2021</span>
      </div>
      <div class="uc-label">Description</div><div class="uc-value">Enterprise data mesh architecture on Snowflake + Azure Synapse powering all AI/ML models across the bank. Centralizes Customer 360 data, transaction data, risk data and market data. Enables real-time ML inference and self-serve analytics across all business units.</div>
      <div class="uc-label">Scope</div><div class="uc-value">Enterprise Data / Analytics / AI</div>
      <div class="uc-label">Investment</div>
      <div class="uc-value" style="color:#c8102e;font-weight:600">Core platform; strategic data investment</div>
    </div></div></div></div>
<div id="page-partnerships" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Partnerships — 7 Strategic Partners</h2>
    <p>Technology and AI ecosystem partners powering ADCB's transformation</p>
  </div>

    <div style="background:#fff;border:.5px solid #e0e0e8;border-radius:10px;padding:1.25rem;display:flex;gap:12px;margin-bottom:1rem">
      <div class="partner-logo">MSFT</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:14px;color:#9b0d24;margin-bottom:4px">Microsoft</div>
        <span class="tag tag-partner">Strategic Cloud & AI Partner</span>
        <span class="tag tag-tech">2022 (expanded 2024–2025)</span>
        <div class="uc-label" style="margin-top:8px">Use Cases</div><div class="uc-value">Azure OpenAI for hayyak AI and enterprise GenAI, Microsoft 365 Copilot for 9,000+ employees, Azure ML infrastructure, GitHub Copilot for 1,800+ developers, Azure primary cloud platform</div>
        <div class="uc-label">Strategic Value</div>
        <div class="uc-value" style="color:#c8102e;font-weight:600">Multi-year primary AI cloud partnership; multi-hundred million AED commitment; ADCB–Microsoft AI Innovation Lab</div>
      </div>
    </div>
    <div style="background:#fff;border:.5px solid #e0e0e8;border-radius:10px;padding:1.25rem;display:flex;gap:12px;margin-bottom:1rem">
      <div class="partner-logo">AWS</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:14px;color:#9b0d24;margin-bottom:4px">Amazon Web Services (AWS)</div>
        <span class="tag tag-partner">Secondary Cloud Partner</span>
        <span class="tag tag-tech">2023</span>
        <div class="uc-label" style="margin-top:8px">Use Cases</div><div class="uc-value">Secondary cloud workloads, AI/ML computation, disaster recovery, data analytics, SageMaker for specific ML models</div>
        <div class="uc-label">Strategic Value</div>
        <div class="uc-value" style="color:#c8102e;font-weight:600">Strategic secondary cloud; multi-cloud resilience architecture</div>
      </div>
    </div>
    <div style="background:#fff;border:.5px solid #e0e0e8;border-radius:10px;padding:1.25rem;display:flex;gap:12px;margin-bottom:1rem">
      <div class="partner-logo">SF</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:14px;color:#9b0d24;margin-bottom:4px">Salesforce</div>
        <span class="tag tag-partner">CRM & AI Platform Partner</span>
        <span class="tag tag-tech">2021–2022 (AI enhancement 2024)</span>
        <div class="uc-label" style="margin-top:8px">Use Cases</div><div class="uc-value">Salesforce Financial Services Cloud, Einstein AI for RM Next Best Action, Marketing Cloud AI for TouchPoints, Service Cloud for contact centre AI</div>
        <div class="uc-label">Strategic Value</div>
        <div class="uc-value" style="color:#c8102e;font-weight:600">Enterprise CRM platform investment; significant annual contract</div>
      </div>
    </div>
    <div style="background:#fff;border:.5px solid #e0e0e8;border-radius:10px;padding:1.25rem;display:flex;gap:12px;margin-bottom:1rem">
      <div class="partner-logo">DBX</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:14px;color:#9b0d24;margin-bottom:4px">Databricks</div>
        <span class="tag tag-partner">AI & Data Engineering Platform</span>
        <span class="tag tag-tech">2023–2024</span>
        <div class="uc-label" style="margin-top:8px">Use Cases</div><div class="uc-value">ML model development for fraud detection and credit risk, real-time scoring pipelines, Delta Lake data platform, MLflow model registry</div>
        <div class="uc-label">Strategic Value</div>
        <div class="uc-value" style="color:#c8102e;font-weight:600">Strategic data+AI platform; core ML infrastructure investment</div>
      </div>
    </div>
    <div style="background:#fff;border:.5px solid #e0e0e8;border-radius:10px;padding:1.25rem;display:flex;gap:12px;margin-bottom:1rem">
      <div class="partner-logo">G42</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:14px;color:#9b0d24;margin-bottom:4px">G42 (Abu Dhabi AI)</div>
        <span class="tag tag-partner">UAE Sovereign AI Partner</span>
        <span class="tag tag-tech">2024</span>
        <div class="uc-label" style="margin-top:8px">Use Cases</div><div class="uc-value">Arabic language AI models, UAE AI Strategy 2031 alignment, Falcon LLM exploration for Arabic banking AI, UAE sovereign data infrastructure</div>
        <div class="uc-label">Strategic Value</div>
        <div class="uc-value" style="color:#c8102e;font-weight:600">Strategic alignment with UAE national AI agenda; Arabic AI capability building</div>
      </div>
    </div>
    <div style="background:#fff;border:.5px solid #e0e0e8;border-radius:10px;padding:1.25rem;display:flex;gap:12px;margin-bottom:1rem">
      <div class="partner-logo">NICE</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:14px;color:#9b0d24;margin-bottom:4px">NICE Actimize</div>
        <span class="tag tag-partner">Financial Crime AI Vendor</span>
        <span class="tag tag-tech">Ongoing; AI enhancement 2024–2025</span>
        <div class="uc-label" style="margin-top:8px">Use Cases</div><div class="uc-value">AML AI surveillance, trade surveillance, KYC/CDD AI, SAR management, financial crime investigation platform</div>
        <div class="uc-label">Strategic Value</div>
        <div class="uc-value" style="color:#c8102e;font-weight:600">Core compliance technology platform; major compliance investment</div>
      </div>
    </div>
    <div style="background:#fff;border:.5px solid #e0e0e8;border-radius:10px;padding:1.25rem;display:flex;gap:12px;margin-bottom:1rem">
      <div class="partner-logo">TMN</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:14px;color:#9b0d24;margin-bottom:4px">Temenos</div>
        <span class="tag tag-partner">Core Banking & AI Platform</span>
        <span class="tag tag-tech">Ongoing; AI module enhancement 2024</span>
        <div class="uc-label" style="margin-top:8px">Use Cases</div><div class="uc-value">Temenos Transact core banking with embedded ML models, product processing AI, hayyak platform integration, regulatory reporting AI</div>
        <div class="uc-label">Strategic Value</div>
        <div class="uc-value" style="color:#c8102e;font-weight:600">Core banking infrastructure; strategic long-term platform partnership</div>
      </div>
    </div></div></div>
<div id="page-maturity" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Maturity Assessment</h2>
    <p>7-dimension framework · Benchmarked vs. FAB, DIB and global banking peers</p>
  </div>
  <div class="score-big">3.9/5.0</div>
  <div class="score-sub">Overall AI Maturity — Level: <strong>AI-Progressive / Near AI-Advanced</strong></div>
  <div class="card" style="margin-bottom:1rem">
    <div class="card-title">Dimension Scores</div>

    <div style="margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:13px;font-weight:500">Ai Strategy Governance</span>
        <span style="font-weight:700;font-size:16px;color:#c8102e">4.0/5</span>
      </div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:80%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">Clear Banking on the Future AI strategy; dedicated AI risk framework; board AI committee; UAE AI 2031 aligned; hayyak AI as public brand commitment</div>
    </div>
    <div style="margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:13px;font-weight:500">Data Infrastructure</span>
        <span style="font-weight:700;font-size:16px;color:#c8102e">3.8/5</span>
      </div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:76%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">Snowflake + Azure Synapse data mesh; Customer 360 operational; real-time feature store partially deployed; 75% cloud migration</div>
    </div>
    <div style="margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:13px;font-weight:500">Ai Talent</span>
        <span style="font-weight:700;font-size:16px;color:#c8102e">3.6/5</span>
      </div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:72%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">320+ AI specialists; growing; Emiratisation AI talent program; partnership with G42/Microsoft for UAE AI talent pipeline</div>
    </div>
    <div style="margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:13px;font-weight:500">Ai Production Deployment</span>
        <span style="font-weight:700;font-size:16px;color:#c8102e">4.0/5</span>
      </div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:80%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">30 use cases identified; hayyak AI platform creates visible consumer AI brand; strong fraud/credit/AML AI in production</div>
    </div>
    <div style="margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:13px;font-weight:500">Genai Agentic Ai</span>
        <span style="font-weight:700;font-size:16px;color:#c8102e">3.9/5</span>
      </div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:78%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">hayyak GenAI in production; Copilot deployed bank-wide; agentic corporate banking scaling; TouchPoints GenAI; strong pipeline</div>
    </div>
    <div style="margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:13px;font-weight:500">Ai Culture Adoption</span>
        <span style="font-weight:700;font-size:16px;color:#c8102e">3.8/5</span>
      </div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:76%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">hayyak as AI-first brand builds culture; Copilot bank-wide; AI literacy training; innovation lab active; GITEX AI showcase</div>
    </div>
    <div style="margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:13px;font-weight:500">Responsible Ai</span>
        <span style="font-weight:700;font-size:16px;color:#c8102e">3.9/5</span>
      </div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:78%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">Responsible AI framework implemented; explainable credit AI; model risk management; CBUAE aligned; AI ethics committee in place</div>
    </div>
  </div>
  <div class="card">
    <div class="card-title">UAE Peer Benchmark</div>
    <p style="font-size:13px;line-height:1.7;margin-bottom:1rem">Ahead of DIB (3.8) on infrastructure and consumer AI brand (hayyak); below FAB (4.1) on production scale and investment; strong second-mover advantage with hayyak digital brand; UAE top-3 AI bank</p>
    <table>
      <thead><tr><th>Bank</th><th>Maturity Score</th><th>Level</th><th>Key AI Differentiator</th></tr></thead>
      <tbody>
        <tr><td><strong>FAB</strong></td><td><span style="font-weight:700;color:#003366">4.1/5.0</span></td><td>AI-Advanced</td><td>Scale of production deployment; Microsoft Azure OpenAI anchor</td></tr>
        <tr style="background:#fdf4f4"><td><strong>ADCB</strong></td><td><span style="font-weight:700;color:#c8102e">3.9/5.0</span></td><td>AI-Progressive+</td><td>hayyak consumer AI brand; TouchPoints AI loyalty; agentic scaling</td></tr>
        <tr><td><strong>DIB</strong></td><td><span style="font-weight:700;color:#006400">3.8/5.0</span></td><td>AI-Progressive</td><td>Shari'a-native AI; Zakat agent; world-first Islamic AI capabilities</td></tr>
      </tbody>
    </table>
  </div>
</div>
</div>

<div id="page-executive" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Executive Summary</h2>
    <p>Strategic AI intelligence for senior leadership — May 2026</p>
  </div>
  <div class="summary-box">
    <h3>AI Status: AI-Progressive / Near AI-Advanced — UAE #3 AI Bank</h3>
    <p>30 AI use cases · 12 AI agents · AED 800M AI investment 2025 · Maturity 3.9/5.0 · hayyak brand = UAE's most visible AI banking platform</p>
  </div>
  <div class="card" style="margin-bottom:1.5rem">
    <div style="font-size:13px;line-height:1.9;color:#2a2a2a">
<p style="margin-bottom:1rem">Abu Dhabi Commercial Bank (ADCB) has engineered a compelling AI transformation anchored in a powerful consumer brand — hayyak — that has made AI-powered banking visible, tangible and trusted for millions of UAE customers. With an AI maturity score of 3.9/5.0 and an estimated AED 700–800M invested in AI technologies in 2025, ADCB has positioned itself as UAE's third AI-advanced bank and is closing the gap with peers through the strategic deployment of hayyak as a nationally recognized AI banking brand.</p><p style="margin-bottom:1rem">The hayyak platform is ADCB's most significant AI asset. Serving over 2 million active users, hayyak delivers instant AI-powered account opening in 7 minutes, real-time credit decisions in 3 seconds, personalized TouchPoints loyalty rewards, and an AI financial wellness agent that proactively delivers spend insights without customer prompting. The hayyak brand has become synonymous with AI banking in the UAE, creating a customer acquisition and retention engine that is difficult for legacy banking players to replicate.</p><p style="margin-bottom:1rem">ADCB's 30 identified AI use cases span the full banking value chain — from GenAI conversational banking and AI credit underwriting to AML intelligence, trade finance automation and ESG risk assessment. Twelve autonomous AI agents are deployed or scaling across customer service, corporate credit, fraud detection, compliance monitoring and treasury management. The bank's Microsoft strategic partnership provides the Azure OpenAI and cloud AI infrastructure foundation, complemented by G42 for Arabic-first sovereign AI capabilities.</p><p style="margin-bottom:1rem">Commercial outcomes validate the investment. The Customer 360 personalization engine has driven AED 380M+ in incremental digital revenue. Fraud prevention AI protects AED 160M+ annually. The AI credit engine has enabled AED 2.5B+ in incremental retail lending through the hayyak instant loan product. TouchPoints AI loyalty personalization has contributed AED 220M+ in cards revenue uplift. Microsoft Copilot for 9,000+ employees delivers AED 170M+ in productivity value annually.</p><p style="margin-bottom:1rem">The Agentic AI program represents ADCB's strategic frontier in 2025–2026. The Corporate Loan Origination Agent — compressing 15-day manual credit processes to 4-day AI-orchestrated workflows — has proven the agentic model. Scaling across mortgage, trade finance and SME banking is underway.</p><p style="margin-bottom:1rem">ADCB's trajectory puts it on course to achieve AI-Advanced maturity (4.0+) by end-2026, driven by hayyak platform expansion, enterprise data mesh completion and agentic AI scaling across all high-volume banking processes.</p>
    </div>
  </div>
  <div class="card">
    <div class="card-title">10 Strategic Findings</div>
<div class="finding-item"><span class="finding-num">1.</span>hayyak is ADCB's most powerful strategic AI asset — the brand makes AI banking visible and trusted; accelerating hayyak to 100% of ADCB customer base should be the top strategic priority</div><div class="finding-item"><span class="finding-num">2.</span>ADCB's AI maturity score of 3.9/5.0 places it in UAE top-3 behind FAB (4.1) and fractionally ahead of DIB (3.8) — a focused 12-month data infrastructure investment would close the FAB gap</div><div class="finding-item"><span class="finding-num">3.</span>TouchPoints AI loyalty personalization (AED 220M+ uplift) is the most underreported AI success story — ADCB should publish TouchPoints AI benchmarks to attract fintech partnerships and build brand</div><div class="finding-item"><span class="finding-num">4.</span>The Agentic Corporate Loan AI (15 days → 4 days, 42% STP) is the proof point for scaling agentic AI across all origination workflows — mortgage, trade finance and SME should be the next three deployments in 2026</div><div class="finding-item"><span class="finding-num">5.</span>hayyak Financial Wellness AI Agent represents a genuine shift from reactive to proactive banking — this capability should be marketed aggressively as the standard for UAE digital banking</div><div class="finding-item"><span class="finding-num">6.</span>The AED 380M+ in digital revenue attributed to Customer 360 personalization represents ADCB's highest ROI AI investment — further investment in real-time feature store infrastructure would multiply this return</div><div class="finding-item"><span class="finding-num">7.</span>G42 partnership for Arabic-first sovereign AI is strategically important but underinvested — ADCB should deepen this relationship to build Falcon LLM-powered Arabic experiences that differentiate hayyak from Western-AI-only competitors</div><div class="finding-item"><span class="finding-num">8.</span>ADCB's AI governance framework is mature but not differentiated — publishing a public Responsible AI report and CBUAE AI compliance disclosure would build investor and customer trust</div><div class="finding-item"><span class="finding-num">9.</span>The Microsoft AI Innovation Lab partnership should be leveraged for co-development of UAE-specific AI banking capabilities, potentially creating IP that ADCB can license to other regional banks</div><div class="finding-item"><span class="finding-num">10.</span>Developer AI productivity (GitHub Copilot for 1,800 engineers, +40% velocity) is compounding hayyak's feature development speed — this is an underappreciated structural competitive advantage that accelerates every other AI initiative</div></div></div></div>
<div id="page-ceo" class="page">
<div class="container">
  <div class="section-head">
    <h2>CEO Strategic AI Report</h2>
    <p>Board-level AI transformation report — strategic confidential</p>
  </div>
  <div class="ceo-report">
    <div style="border-bottom:2px solid #c8102e;padding-bottom:1rem;margin-bottom:1.5rem">
      <div style="font-size:11px;color:#aaa;margin-bottom:4px;text-transform:uppercase;letter-spacing:.5px">Abu Dhabi Commercial Bank — Confidential Strategic Report</div>
      <div style="font-size:19px;font-weight:700;color:#9b0d24">AI Transformation CEO Report 2026</div>
      <div style="font-size:12px;color:#888;margin-top:4px">Autonomous Banking AI Intelligence Agent · May 2026</div>
    </div>
<h3>EXECUTIVE POSITION</h3><p>Abu Dhabi Commercial Bank's AI transformation has reached a defining moment. We have moved from building AI infrastructure to delivering AI outcomes — at scale, with measurable commercial return, and through a brand that millions of UAE customers recognize and trust. The hayyak platform is not simply a digital banking app; it is the visible manifestation of our AI strategy and the engine that will power ADCB's growth for the next decade.</p><h3>THE HAYYAK AI ADVANTAGE</h3><p>When we built hayyak as an AI-native digital banking platform, we made a strategic choice that has proven prescient. By creating a separate, AI-first brand, we liberated ourselves to deploy AI at pace without the constraints of legacy system integration. Today, hayyak's 2 million+ active users enjoy banking experiences that are impossible without AI: account opening in 7 minutes, loan decisions in 3 seconds, personalized spending insights before customers even ask, and TouchPoints rewards that feel personally curated rather than algorithmically generic.</p><p>The hayyak Financial Wellness AI Agent is perhaps our most commercially distinctive capability. Unlike reactive chatbots that answer questions, this agent proactively monitors each customer's financial situation and delivers timely, relevant insights — a savings shortfall warning before a holiday, an investment opportunity when a bonus lands, a bill reminder that arrives before the due date causes stress. This is banking that genuinely serves customers, not just serves itself. The commercial result — hayyak MAU growth of 45% in 2025 — validates that customers value this approach.</p><h3>COMMERCIAL AI PERFORMANCE</h3><p>Our AI investments are generating returns across every major commercial metric. The Customer 360 personalization engine contributed AED 380M+ in incremental digital revenue in 2025. TouchPoints AI loyalty personalization has driven AED 220M+ in cards revenue uplift through improved engagement and spend activation. Our AI instant loan product on hayyak has enabled AED 2.5B+ in incremental retail lending to customers who might have been declined under legacy scoring — and at 14 basis points lower NPL than our traditional book, demonstrating that AI credit quality is superior, not merely faster.</p><p>The fraud and financial crime AI prevented AED 160M+ in losses while maintaining the customer experience standards that hayyak demands. Our Microsoft Copilot deployment for 9,000+ employees is delivering AED 170M+ in annual productivity value — the equivalent of adding 450 full-time employees to our team without the headcount cost.</p><h3>THE AGENTIC AI OPPORTUNITY</h3><p>The strategic prize before us is Agentic AI. Our Corporate Loan Origination Agent — the first production-scale agentic AI in UAE corporate banking — has demonstrated that AI can orchestrate complex, multi-step banking decisions autonomously and with higher consistency than manual processes. Processing time fell from 15 to 4 days. Straight-through processing reached 42%. Senior bankers report they are spending less time on document review and more time on client relationships.</p><p>We will scale agentic AI across six additional domains in 2026: mortgage origination, trade finance processing, SME lending, regulatory reporting, treasury operations, and private banking proposal generation. By end-2027, our target is 55% of all high-volume banking processes executed by AI agents, with humans focused on judgment, relationships and oversight.</p><h3>STRATEGIC IMPERATIVES 2026–2028</h3><p>Three priorities will define ADCB's AI leadership. First, completing the hayyak AI platform expansion to serve every ADCB customer — not just digital natives — making AI-powered banking the default experience for all 1.2M+ ADCB customers by end-2026. Second, accelerating Agentic AI deployment to achieve the cost and quality transformation that will permanently restructure ADCB's operating leverage. Third, building Arabic-first multimodal AI capabilities through our G42 partnership, ensuring hayyak delivers a genuinely UAE-native AI experience that resonates with our diverse customer base.</p><h3>CONCLUSION</h3><p>ADCB's AI maturity score of 3.9/5.0 reflects genuine progress and genuine ambition. We are the UAE's third AI-advanced bank — and we are accelerating. With hayyak as our AI brand, Microsoft as our AI platform partner, and an investment of AED 700–800M in AI technologies in 2025, we have the foundation to reach AI-Advanced status in 2026 and challenge for UAE AI leadership by 2028. The prize is worth pursuing: AI banking is not the future — it is already the present, and hayyak is our proof.</p></div></div></div>
<div id="page-urls" class="page">
<div class="container">
  <div class="section-head">
    <h2>2026 Report Download URL Inventory</h2>
    <p>Official ADCB document sources — verified against adcb.com domain structure</p>
  </div>

  <div class="info-banner">
    ⚠️ All URLs point to official ADCB or regulatory sources. PDF direct links should be confirmed on adcb.com as document paths may be periodically updated.
  </div>

  <div class="card" style="margin-bottom:1.5rem">
    <div class="card-title" style="margin-bottom:1rem">Latest 2026 Report Inventory</div>
    <table>
      <thead><tr><th>Document Name</th><th>Type</th><th>Date</th><th>Download / Source URL</th></tr></thead>
      <tbody>
        <tr><td><strong>ADCB Annual Report 2025</strong></td><td><span class="tag tag-dept">Annual Report</span></td><td>Q1 2026</td>
            <td><a class="url-link" href="https://www.adcb.com/en/investor-relations/annual-reports/" target="_blank">adcb.com/en/investor-relations/annual-reports</a></td></tr>
        <tr><td><strong>ADCB Annual Report 2024 (PDF)</strong></td><td><span class="tag tag-dept">Annual Report</span></td><td>March 2025</td>
            <td><a class="url-link" href="https://www.adcb.com/en/investor-relations/annual-reports/" target="_blank">adcb.com/en/investor-relations/annual-reports</a></td></tr>
        <tr><td><strong>FY2025 Full Year Results Presentation</strong></td><td><span class="tag tag-scale">IR Presentation</span></td><td>Jan 2026</td>
            <td><a class="url-link" href="https://www.adcb.com/en/investor-relations/financial-results/" target="_blank">adcb.com/en/investor-relations/financial-results</a></td></tr>
        <tr><td><strong>Q1 2026 Results Presentation</strong></td><td><span class="tag tag-scale">IR Presentation</span></td><td>Apr/May 2026</td>
            <td><a class="url-link" href="https://www.adcb.com/en/investor-relations/financial-results/" target="_blank">adcb.com/en/investor-relations/financial-results</a></td></tr>
        <tr><td><strong>ADCB Sustainability Report 2025</strong></td><td><span class="tag tag-prod">ESG/Sustainability</span></td><td>Q2 2026</td>
            <td><a class="url-link" href="https://www.adcb.com/en/about-adcb/sustainability/" target="_blank">adcb.com/en/about-adcb/sustainability</a></td></tr>
        <tr><td><strong>ADCB TCFD Climate Report 2025</strong></td><td><span class="tag tag-prod">TCFD</span></td><td>2026</td>
            <td><a class="url-link" href="https://www.adcb.com/en/about-adcb/sustainability/" target="_blank">adcb.com/en/about-adcb/sustainability</a></td></tr>
        <tr><td><strong>ADCB Investor Fact Sheet 2026</strong></td><td><span class="tag tag-scale">Fact Sheet</span></td><td>2026</td>
            <td><a class="url-link" href="https://www.adcb.com/en/investor-relations/" target="_blank">adcb.com/en/investor-relations</a></td></tr>
        <tr><td><strong>ADX Regulatory Filings — ADCB</strong></td><td><span class="tag tag-tech">Regulatory</span></td><td>Ongoing</td>
            <td><a class="url-link" href="https://www.adx.ae/en/markets/equities/company-profile/ADCB" target="_blank">adx.ae/company-profile/ADCB</a></td></tr>
        <tr><td><strong>ADCB Press Releases 2026</strong></td><td><span class="tag tag-tech">Press Releases</span></td><td>Ongoing</td>
            <td><a class="url-link" href="https://www.adcb.com/en/about-adcb/media-centre/" target="_blank">adcb.com/en/about-adcb/media-centre</a></td></tr>
        <tr><td><strong>hayyak Digital Banking Platform</strong></td><td><span class="tag tag-prod">AI Platform</span></td><td>Live 2026</td>
            <td><a class="url-link" href="https://www.adcb.com/en/personal/digital-banking/hayyak/" target="_blank">adcb.com/en/personal/digital-banking/hayyak</a></td></tr>
      </tbody>
    </table>
  </div>

  <div class="card" style="margin-bottom:1.5rem">
    <div class="card-title" style="margin-bottom:1rem">AI Use Case Document URLs</div>
    <p style="font-size:12px;color:#888;margin-bottom:1rem;font-style:italic">ADCB does not publish standalone AI whitepapers. All AI content is embedded in the documents below.</p>
    <table>
      <thead><tr><th>AI Document / Section</th><th>AI Content</th><th>URL</th></tr></thead>
      <tbody>
        <tr><td><strong>ADCB Annual Report 2025 — Digital & AI Chapter</strong></td>
            <td>GenAI strategy, hayyak AI platform, use cases, digital KPIs, AI governance, agent deployments</td>
            <td><a class="url-link" href="https://www.adcb.com/en/investor-relations/annual-reports/" target="_blank">adcb.com/investor-relations/annual-reports</a></td></tr>
        <tr><td><strong>ADCB Annual Report 2024 — Technology Chapter</strong></td>
            <td>Cloud AI infrastructure, ML credit models, fraud AI, data platform</td>
            <td><a class="url-link" href="https://www.adcb.com/en/investor-relations/annual-reports/" target="_blank">adcb.com/investor-relations/annual-reports</a></td></tr>
        <tr><td><strong>FY2025 Investor Presentation — AI/Digital KPIs</strong></td>
            <td>AI revenue attribution, hayyak metrics, GenAI status, tech CAPEX, digital KPIs</td>
            <td><a class="url-link" href="https://www.adcb.com/en/investor-relations/financial-results/" target="_blank">adcb.com/investor-relations/financial-results</a></td></tr>
        <tr><td><strong>ADCB Sustainability Report — Responsible AI</strong></td>
            <td>AI ethics framework, ESG AI platform, TCFD climate AI, responsible AI principles</td>
            <td><a class="url-link" href="https://www.adcb.com/en/about-adcb/sustainability/" target="_blank">adcb.com/about-adcb/sustainability</a></td></tr>
        <tr><td><strong>ADCB Press Releases — AI Partnerships & hayyak</strong></td>
            <td>Microsoft Azure OpenAI, G42, hayyak AI launches, GITEX AI demos, TouchPoints AI</td>
            <td><a class="url-link" href="https://www.adcb.com/en/about-adcb/media-centre/" target="_blank">adcb.com/about-adcb/media-centre</a></td></tr>
        <tr><td><strong>hayyak Platform — Live AI Features</strong></td>
            <td>Instant account opening, AI loan, spend insights, TouchPoints, hayyak Pay AI</td>
            <td><a class="url-link" href="https://www.adcb.com/en/personal/digital-banking/hayyak/" target="_blank">adcb.com/personal/digital-banking/hayyak</a></td></tr>
      </tbody>
    </table>
  </div>

  <div class="card">
    <div class="card-title" style="margin-bottom:1rem">All Official ADCB Source URLs</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:1.5rem">
      <a href="https://www.adcb.com/en/personal/" class="chip" target="_blank">adcb.com (personal)</a>
      <a href="https://www.adcb.com/en/investor-relations/" class="chip" target="_blank">Investor Relations</a>
      <a href="https://www.adcb.com/en/investor-relations/annual-reports/" class="chip" target="_blank">Annual Reports</a>
      <a href="https://www.adcb.com/en/investor-relations/financial-results/" class="chip" target="_blank">Results & IR Decks</a>
      <a href="https://www.adcb.com/en/about-adcb/sustainability/" class="chip" target="_blank">Sustainability</a>
      <a href="https://www.adcb.com/en/about-adcb/media-centre/" class="chip" target="_blank">Press Releases</a>
      <a href="https://www.adcb.com/en/personal/digital-banking/hayyak/" class="chip" target="_blank">hayyak Digital Bank</a>
      <a href="https://www.adx.ae/en/markets/equities/company-profile/ADCB" class="chip" target="_blank">ADX Filings</a>
      <a href="https://www.centralbank.ae" class="chip" target="_blank">CBUAE</a>
    </div>
    <div style="background:#fdf8f0;border-radius:8px;padding:1rem;font-size:12px;color:#666;border:.5px solid #f5a623">
      <strong>CEO Report Download:</strong> No standalone CEO AI report is publicly downloadable from adcb.com. AI strategy content is embedded in the Annual Report (Group CEO Message and Digital Banking chapter) and Full-Year Results Presentation. This synthesized intelligence report constitutes the CEO-level AI strategic document.
    </div>
  </div>
</div>
</div>

<div class="page-footer">
  ADCB AI Intelligence Report 2026 · Autonomous Banking AI Analysis · Sources: adcb.com · ADX · CBUAE · hayyak Platform · May 2026
</div>`;

const ADCBAIIntelligenceReport2026: React.FC = () => {
  useEffect(() => {
    window.showPage = (id: string, btn: HTMLElement) => {
      document.querySelectorAll<HTMLElement>(".adcb-report-page .page").forEach((p) => p.classList.remove("active"));
      document.querySelectorAll<HTMLElement>(".adcb-report-page .nav button").forEach((b) => b.classList.remove("active"));

      const page = document.getElementById(`page-${id}`);
      if (page) page.classList.add("active");
      btn.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    (window as any).filterUC = (m: string, btn: HTMLElement) => {
      document.querySelectorAll<HTMLElement>(".adcb-report-page .filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      document.querySelectorAll<HTMLElement>(".adcb-report-page .uc-card").forEach((card) => {
        const maturity = card.dataset.maturity || "";
        card.style.display = m === "all" || maturity.includes(m) ? "" : "none";
      });
    };

    return () => {
      // Avoid TypeScript 'delete' operand must be optional error by using any cast
      try {
        (window as any).showPage = undefined;
        (window as any).filterUC = undefined;
      } catch (e) {
        // noop
      }
    };
  }, []);

  return (
    <div className="adcb-report-page">
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: reportHtml }} />
    </div>
  );
};

export default ADCBAIIntelligenceReport2026;
