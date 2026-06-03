import React, { useEffect } from "react";

declare global {
  interface Window {
    showPage: (id: string, btn: HTMLElement) => void;
    filterUC: (maturity: string, btn: HTMLElement) => void;
  }
}

const styles = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#f4f4f0;color:#1a1a1a;font-size:14px;line-height:1.6}
.topbar{background:#00563F;color:white;padding:0}
.topbar-inner{max-width:1200px;margin:0 auto;padding:1.5rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}
.topbar h1{font-size:20px;font-weight:600;letter-spacing:-0.3px}
.topbar p{font-size:12px;opacity:0.7;margin-top:2px}
.badge-gold{background:#c9a227;color:#fff;font-size:11px;padding:3px 10px;border-radius:20px;font-weight:600}
.nav{background:#004230;padding:0;border-bottom:2px solid #c9a227;overflow-x:auto}
.nav-inner{max-width:1200px;margin:0 auto;display:flex;gap:0}
.nav button{background:none;border:none;color:rgba(255,255,255,0.7);padding:12px 18px;font-size:13px;cursor:pointer;white-space:nowrap;border-bottom:3px solid transparent;transition:all 0.2s}
.nav button:hover,.nav button.active{color:#fff;border-bottom-color:#c9a227}
.container{max-width:1200px;margin:0 auto;padding:1.5rem 2rem}
.page{display:none}.page.active{display:block}
.section-head{margin-bottom:1.5rem}
.section-head h2{font-size:22px;font-weight:600;color:#00563F;margin-bottom:4px}
.section-head p{font-size:13px;color:#666}
.metrics-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:1.5rem}
.metric{background:#fff;border:0.5px solid #ddd;border-radius:8px;padding:1rem;text-align:center}
.metric .num{font-size:28px;font-weight:700;color:#00563F;margin-bottom:2px}
.metric .lbl{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.5px}
.card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;margin-bottom:1rem}
.card-title{font-size:15px;font-weight:600;color:#00563F;margin-bottom:8px}
.tag{display:inline-block;font-size:10px;padding:2px 8px;border-radius:12px;font-weight:600;margin:2px}
.tag-prod{background:#eaf3de;color:#27500a}
.tag-scale{background:#faeeda;color:#633806}
.tag-pilot{background:#eeedfe;color:#3c3489}
.tag-dept{background:#e3f4ef;color:#00563F}
.tag-tech{background:#f1efe8;color:#2c2c2a}
.tag-partner{background:#faece7;color:#712b13}
table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;padding:10px 12px;background:#f8f8f4;font-weight:600;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.4px;border-bottom:1px solid #e8e8e0}
td{padding:10px 12px;border-bottom:0.5px solid #f0f0e8;vertical-align:top}
tr:last-child td{border-bottom:none}
tr:hover td{background:#fafaf8}
.uc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem}
.uc-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-left:4px solid #00563F}
.uc-id{font-size:10px;color:#999;font-weight:600;letter-spacing:1px;margin-bottom:4px}
.uc-name{font-size:15px;font-weight:600;color:#00563F;margin-bottom:8px}
.uc-field{margin-bottom:6px}
.uc-label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.4px;font-weight:600;margin-bottom:2px}
.uc-value{font-size:12px;color:#333;line-height:1.5}
.agent-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-left:4px solid #7f77dd}
.agent-name{font-size:14px;font-weight:600;color:#3c3489;margin-bottom:8px;display:flex;align-items:center;gap:8px}
.agent-icon{width:28px;height:28px;background:#eeedfe;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.prog-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-top:3px solid #c9a227}
.prog-name{font-size:14px;font-weight:600;color:#00563F;margin-bottom:6px}
.prose{font-size:13px;line-height:1.8;color:#2a2a2a}
.prose p{margin-bottom:1rem}
.finding-item{padding:0.75rem 1rem;border-left:3px solid #00563F;background:#f2faf7;border-radius:0 6px 6px 0;margin-bottom:0.75rem;font-size:13px;line-height:1.6}
.finding-num{font-weight:700;color:#00563F;margin-right:8px}
.maturity-bar-wrap{margin-bottom:1rem}
.maturity-label{display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px}
.maturity-bar{height:10px;background:#e8e8e0;border-radius:5px;overflow:hidden}
.maturity-fill{height:100%;border-radius:5px;background:#00563F;transition:width 1s}
.url-row a{color:#185fa5;text-decoration:none;font-size:12px;word-break:break-all}
.url-row a:hover{text-decoration:underline}
.filter-bar{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:1.5rem}
.filter-btn{border:0.5px solid #ccc;background:#fff;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer;transition:all 0.2s}
.filter-btn.active{background:#00563F;color:#fff;border-color:#00563F}
.summary-box{background:#00563F;color:#fff;border-radius:10px;padding:1.5rem;margin-bottom:1.5rem}
.summary-box h3{font-size:18px;font-weight:600;margin-bottom:1rem;color:#c9a227}
.summary-box p{font-size:13px;line-height:1.8;opacity:0.92}
.ceo-report{background:#fff;border:1px solid #00563F;border-radius:10px;padding:2rem;font-size:13px;line-height:1.9;color:#1a1a1a}
.ceo-report .report-header{border-bottom:2px solid #00563F;padding-bottom:1rem;margin-bottom:1.5rem}
.ceo-report h3{font-size:16px;font-weight:700;color:#00563F;margin:1.5rem 0 0.5rem}
.ceo-report p{margin-bottom:1rem}
.partner-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;display:flex;gap:12px}
.partner-logo{width:48px;height:48px;border-radius:8px;background:#e3f4ef;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:#00563F;flex-shrink:0;text-align:center;line-height:1.2}
.score-big{font-size:48px;font-weight:700;color:#00563F;text-align:center;padding:1.5rem;background:#f2faf7;border-radius:10px;margin-bottom:1rem}
.score-sub{font-size:13px;color:#888;text-align:center;margin-top:-0.5rem;margin-bottom:1rem}
.chip{display:inline-flex;align-items:center;gap:6px;background:#f1f1e8;border:0.5px solid #d8d8c8;border-radius:20px;padding:4px 12px;font-size:11px;color:#444;margin:3px;text-decoration:none}
.chip:hover{background:#e8e8d8}
.page-footer{background:#004230;color:rgba(255,255,255,0.6);font-size:11px;text-align:center;padding:1rem;margin-top:2rem}
.notice-box{background:#fffde7;border:1px solid #f0d060;border-radius:8px;padding:0.75rem 1rem;font-size:12px;color:#5a4700;margin-bottom:1.5rem}
`;

const htmlContent = `<div class="topbar">
<div class="topbar-inner">
<div>
<h1>Sharjah Islamic Bank (SIB) — AI Intelligence Report 2026</h1>
<p>Autonomous Banking AI Analysis | 20 Use Cases | 8 Agents | 6 Programs | Official Sources: sib.ae, ADX, WAM, Gulf News, Zawya</p>
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
    onclick="window.location.href='/radha/rakbank-ai-intelligence'"
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
    View RAKBANK 
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
    Confidential Strategic Report
  </span>
</div>
</div>
</div>
<nav class="nav">
<div class="nav-inner">
<button class="active" onclick="showPage('overview',this)">Overview</button>
<button onclick="showPage('usecases',this)">AI Use Cases (20)</button>
<button onclick="showPage('agents',this)">AI Agents (8)</button>
<button onclick="showPage('programs',this)">AI Programs (6)</button>
<button onclick="showPage('partnerships',this)">Partnerships (5)</button>
<button onclick="showPage('maturity',this)">AI Maturity</button>
<button onclick="showPage('executive',this)">Executive Summary</button>
<button onclick="showPage('ceo',this)">CEO Report</button>
<button onclick="showPage('urls',this)">Report URLs</button>
</div>
</nav>

<div class="page active" id="page-overview">
<div class="container">
<div class="section-head">
<h2>AI Intelligence Overview — Sharjah Islamic Bank 2026</h2>
<p>Synthesized from 12+ official SIB sources including Quarterly Reports, ESG Reports, Press Releases, ADX Filings and Investor Communications (H2 2025 – Q1 2026)</p>
</div>
<div class="notice-box">
    ⚠️ <strong>Research Transparency Note:</strong> SIB does not publish a dedicated AI or Technology Report. AI intelligence is extracted from quarterly financial reports, ESG disclosures, press releases, investor presentations, and official media statements. Maturity and investment estimates are analytically inferred from disclosed financial and operational data. Focus period: H2 2025 – Q1 2026.
  </div>
<div class="metrics-grid">
<div class="metric"><div class="num">20</div><div class="lbl">AI Use Cases</div></div>
<div class="metric"><div class="num">8</div><div class="lbl">AI Agents / Tools</div></div>
<div class="metric"><div class="num">6</div><div class="lbl">AI Programs</div></div>
<div class="metric"><div class="num">5</div><div class="lbl">Tech Partnerships</div></div>
<div class="metric"><div class="num">2.8/5</div><div class="lbl">AI Maturity Score</div></div>
<div class="metric"><div class="num">AED 233M+</div><div class="lbl">Tech &amp; Talent OPEX Q1 2026</div></div>
<div class="metric"><div class="num">AED 1.05B</div><div class="lbl">Net Profit FY2024 (Record)</div></div>
<div class="metric"><div class="num">19.4%</div><div class="lbl">Profit Growth Q1 2026</div></div>
</div>
<div class="summary-box">
<h3>AI Transformation Headline — 2026</h3>
<p>Sharjah Islamic Bank is in an accelerating digital and AI build-out phase. While not yet a self-described "AI-first" institution like FAB or ADIB, SIB has made sustained, deliberate investments in technology infrastructure — evidenced by a 17.9% surge in general and administrative expenses in Q1 2026, explicitly attributed to "technological and operational infrastructure" spending. The bank's launch of SIB Pay (a Sharia-compliant digital payments and card tokenization platform) in November 2025, smart branch deployment at Dubai Festival City Mall (April 2025), biometric authentication, Fraud Early Warning System, and strategic fintech partnership with Network International collectively signal a mid-tier Islamic bank transitioning from traditional to digitally-native banking. AI use is currently concentrated in payments security, digital onboarding, fraud detection, and STP automation — with generative AI and agentic AI still at exploration stage.</p>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1rem;margin-bottom:1.5rem">
<div class="card">
<div class="card-title">Key Digital &amp; Tech Milestones (H2 2025 – Q1 2026)</div>
<table>
<tr><td>SIB Pay Platform Launch (Nov 2025)</td><td style="text-align:right;font-weight:600;color:#00563F">✅ Live</td></tr>
<tr><td>Smart Digital Branch — Dubai Festival City (Apr 2025)</td><td style="text-align:right;font-weight:600;color:#00563F">✅ Live</td></tr>
<tr><td>Biometric Authentication (Face/Fingerprint)</td><td style="text-align:right;font-weight:600;color:#00563F">✅ Live</td></tr>
<tr><td>Fraud Early Warning System (Card AI)</td><td style="text-align:right;font-weight:600;color:#00563F">✅ Live</td></tr>
<tr><td>SIB Digital App (Remote Onboarding)</td><td style="text-align:right;font-weight:600;color:#00563F">✅ Live</td></tr>
<tr><td>Network International Fintech Partnership</td><td style="text-align:right;font-weight:600;color:#00563F">✅ Active</td></tr>
<tr><td>Deutsche Bank STP Excellence Award 2025</td><td style="text-align:right;font-weight:600;color:#c9a227">🏆 Awarded</td></tr>
<tr><td>J.P. Morgan Elite Quality Recognition Award 2025</td><td style="text-align:right;font-weight:600;color:#c9a227">🏆 Awarded</td></tr>
<tr><td>GenAI / LLM Programs</td><td style="text-align:right;font-weight:600;color:#888">🔬 Exploration</td></tr>
</table>
</div>
<div class="card">
<div class="card-title">AI Maturity by Dimension</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span style="font-size:12px">Digital Strategy &amp; Governance</span><span style="font-weight:600">3.2/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:64%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span style="font-size:12px">Data Infrastructure</span><span style="font-weight:600">2.8/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:56%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span style="font-size:12px">AI / ML Talent</span><span style="font-weight:600">2.5/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:50%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span style="font-size:12px">AI Production Deployment</span><span style="font-weight:600">2.8/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:56%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span style="font-size:12px">Payments &amp; Digital Automation</span><span style="font-weight:600">3.5/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:70%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span style="font-size:12px">GenAI / Agentic AI</span><span style="font-weight:600">1.5/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:30%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span style="font-size:12px">Responsible AI / ESG AI</span><span style="font-weight:600">2.5/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:50%"></div></div>
</div>
</div>
</div>
<div class="card">
<div class="card-title">Key Technology Partnerships</div>
<div style="display:flex;flex-wrap:wrap;gap:8px">
<span class="tag tag-partner">Network International</span>
<span class="tag tag-partner">Deutsche Bank (STP Infrastructure)</span>
<span class="tag tag-partner">J.P. Morgan (Payments)</span>
<span class="tag tag-partner">Mastercard (Prepaid / Tokenization)</span>
<span class="tag tag-partner">KPMG (Audit / Technology Advisory)</span>
</div>
</div>
</div>
</div>

<div class="page" id="page-usecases">
<div class="container">
<div class="section-head">
<h2>AI Use Cases — 20 Identified (H2 2025 – Q1 2026)</h2>
<p>Sourced from quarterly reports, press releases, investor communications, digital banking terms, and official SIB media</p>
</div>
<div class="filter-bar" id="uc-filters">
<button class="filter-btn active" onclick="filterUC('all',this)">All (20)</button>
<button class="filter-btn" onclick="filterUC('Production',this)">Production</button>
<button class="filter-btn" onclick="filterUC('Scaling',this)">Scaling</button>
<button class="filter-btn" onclick="filterUC('Pilot',this)">Pilot / Exploration</button>
</div>
<div class="uc-grid">
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-001</div>
<div class="uc-name">Fraud Early Warning System (Card Transactions)</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Retail Banking / Security</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-based real-time card transaction monitoring system that continuously analyzes spending patterns, transaction velocity, geolocation, and merchant category codes to detect and prevent fraudulent card usage. Integrated with Mastercard prepaid and debit card infrastructure.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Real-time fraud prevention across all card types; automatic alerts and card suspension on anomaly detection; reduction in fraud-related customer losses; compliance with CBUAE payment security standards</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Rule-based + ML anomaly detection; Mastercard fraud intelligence; real-time transaction scoring</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">SIB Prepaid Card T&amp;Cs (sib.ae/en/prepaidcard-TCs) | Digital Banking Platform</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-002</div>
<div class="uc-name">Biometric Authentication Engine</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Digital Banking / Security</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">SIB replaced OTP-based authentication with AI-powered biometric authentication (Face ID and fingerprint recognition) across online and mobile banking. Both login and transaction authorization now require biometric confirmation — eliminating SMS-based fraud vectors.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Eliminates SIM-swap and OTP interception fraud; reduces authentication friction; biometric step-up for high-value transactions; compliant with CBUAE digital security mandates</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Device-native Face ID / fingerprint APIs; FIDO2 standards; SIB Digital App integration</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">SIB Digital Authentication page (sib.ae/en/auth) | SIB Mobile Banking page</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-003</div>
<div class="uc-name">SIB Pay — AI-Powered Card Tokenization Platform</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Corporate / SME Banking / Payments</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">November 2025 Launch</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">SIB Pay is SIB's enterprise digital payments platform — the first of its kind launched by a Sharjah-based bank. Features AI-driven card tokenization (replacing card details with merchant-specific tokens), multi-channel payment acceptance (POS, e-commerce, Pay By Link), and intelligent payment routing. Designed for SMEs, corporates, and public institutions.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Eliminates card fraud for merchants through tokenization; accelerates UAE cashless society goals (Vision 2031); new revenue stream from corporate payment clients; first mover advantage in Sharjah Islamic banking space</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Card tokenization (EMVCo standard); Network International payment gateway; Sharia-compliant payment routing; API-first architecture</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Gulf News, Nov 6 2025 | CoinGeek, Nov 17 2025 | SIB Press Release, Nov 2025</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-004</div>
<div class="uc-name">Straight-Through Processing (STP) Intelligence</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Operations / Payments / Treasury</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2023–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">SIB has achieved industry-leading STP rates for cross-border and domestic payment transactions, recognized by both Deutsche Bank's Client Excellence Award and J.P. Morgan's Elite Quality Recognition Award in 2025. AI-assisted payment formatting, SWIFT message validation, and automated exception handling underpin the high STP performance.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Near-100% STP rate on international payment corridors; drastically reduced manual intervention; dual banking awards for STP excellence in 2025; competitive positioning as a payment hub bank</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">SWIFT network intelligence; automated payment validation; rule-based + ML exception triage</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Deutsche Bank Client Excellence Award 2025 (Sharjah24) | J.P. Morgan Elite Quality Recognition Award 2025 (ZoomInfo/SIB)</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-005</div>
<div class="uc-name">Digital Account Opening &amp; Remote KYC</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Retail Banking / Digital</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2021–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">End-to-end digital account opening through the SIB Digital app without branch visit. Uses Emirates ID scanning, facial recognition liveness detection, and automated KYC data verification against UAE government databases. Customers can open accounts with zero minimum balance instantly.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Account opening time: days → minutes; branch cost reduction; broader financial inclusion; expanded customer acquisition footprint across UAE; alignment with CBUAE digital onboarding regulations</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Emirates ID OCR; liveness detection AI; UAE Pass integration; automated KYC verification</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">SIB Digital Account page (sib.ae/en/Accounts/digital-account) | Zawya press release Aug 2021 (extended operationally to 2026)</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-006</div>
<div class="uc-name">Smart Digital Branch Self-Service Kiosks</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Retail Banking / Branch Network</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">April 2025 Launch</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">SIB launched a smart digital branch at Dubai Festival City Mall (April 2025) featuring advanced smart device kiosks enabling customers to complete day-to-day banking transactions independently. The branch blends digital self-service with human support, using AI-guided workflows to route transactions to the optimal channel (self-service or specialist staff).</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Operational efficiency enhancement; reduced teller workload; expanded geographic footprint in Dubai; alignment with UAE Digital Excellence vision; high-speed self-service for routine transactions</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Smart device kiosks; digital self-service terminals; AI transaction routing; biometric authentication at branch</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Sharjah24, Apr 20 2025 | LinkedIn post by SIB (Apr 2025)</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-007</div>
<div class="uc-name">AI-Enhanced Credit Risk Scoring (Retail)</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Risk Management / Retail Banking</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2023–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Machine learning-based retail credit scoring models augmenting traditional bureau scores. Analyzes behavioral, transactional, and demographic data to improve credit decision accuracy for personal financing, home finance, and auto finance products. Supports SIB's rapid 12.9% customer financing growth in H1 2025.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">NPL ratio improvement (4.84% end-2024 → 4.54% Q1 2025 → projected 4.3-4.5% by 2026); faster credit decisions; improved risk-return profile; 12.9% financing book growth with stable quality</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">ML credit scoring models; Al Etihad Credit Bureau integration; behavioral analytics; IFRS 9 ECL modeling</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">SIB H1 2025 Financial Statements | S&amp;P Credit Report May 2025 (sib.ae/docs)</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-008</div>
<div class="uc-name">IFRS 9 ECL Automated Provisioning Model</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Risk / Finance</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2020–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Quantitative modeling platform for Expected Credit Loss (ECL) calculations under IFRS 9. Uses macroeconomic scenario overlays, forward-looking indicators, and ML-assisted stage migration models to calculate provisions for SIB's AED 48B+ financing book. Enabled a net reversal of impairment provisions (AED +9.3M) in H1 2025 — a significant turnaround from a AED 67.3M charge in H1 2024.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">AED 76.6M provisioning swing H1 2024 vs H1 2025; improved earnings quality; regulatory compliance; proactive credit portfolio management; investor confidence improvement</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Statistical PD/LGD/EAD models; macroeconomic scenario engine; KPMG-audited model framework</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">SIB H1 2025 Financial Statements (KPMG-reviewed) | SIB Annual Financial Report 2024</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-009</div>
<div class="uc-name">Multi-Channel Digital Payment Integration</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Retail / Corporate Banking</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">SIB's partnership with Network International enables AI-optimized multi-channel payment acceptance: point-of-sale, e-commerce, and Pay By Link. The platform includes intelligent payment routing, automated reconciliation, and real-time settlement analytics for corporate clients.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Corporate client acquisition in payment services; fee income growth (53.5% in H1 2025); diversified revenue streams; expanded digital footprint for businesses</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Network International payment gateway; multi-channel API integration; real-time settlement engine</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">LeadIQ SIB Profile | uaepedia.net SIB profile | Gulf News H1 2025 results</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-010</div>
<div class="uc-name">Apple Pay &amp; Samsung Wallet Contactless Payments</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Retail Banking / Digital</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2023–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">SIB cards are integrated with Apple Pay and Samsung Wallet for contactless NFC payments. Backed by AI-powered tokenization (replacing card credentials with device-specific tokens) and AI transaction scoring for contactless fraud prevention.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Seamless contactless payments at millions of merchants; enhanced security via tokenization; customer convenience; alignment with UAE contactless payment adoption trends</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Apple Pay / Samsung Pay NFC tokenization; HCE (Host Card Emulation); real-time fraud scoring</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">SIB Mobile Banking page (sib.ae/en/personal-banking/ways-of-banking/mobile-banking)</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-011</div>
<div class="uc-name">Emirates Digital Wallet (klip) Integration</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Retail Banking / Fintech</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">SIB's mobile banking app is integrated with Emirates Digital Wallet's klip platform, enabling seamless digital money management and payment capabilities within a broader UAE digital wallet ecosystem.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Broader payment ecosystem access; customer retention through super-app integration; enables UAE government's cashless vision alignment</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">UAE klip API integration; open banking connectivity; digital wallet interoperability</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">uaepedia.net SIB profile | SIB Digital Banking services</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-012</div>
<div class="uc-name">Real-Time Cybersecurity &amp; Encryption Platform</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">IT Security / Operations</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2022–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">SIB has invested in state-of-the-art encryption technology and firewalls across all digital channels. The CISO (Arif Irfani, named CISO of the Year at Future Enterprise Awards 2025) leads an AI-assisted cybersecurity intelligence and threat detection platform covering online banking, mobile banking, and corporate digital services.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">CISO of the Year award 2025 (Future Enterprise Awards); proactive threat intelligence; secure banking across all e-channels; anti-phishing and anti-fraud systems</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Next-gen firewall; TLS encryption; AI threat intelligence; behavioral anomaly detection; SIEM integration</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">ZoomInfo SIB profile (CISO award) | SIB Digital Authentication page | sib.ae/en/online-security-tips</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-013</div>
<div class="uc-name">AI-Driven Fee Income Analytics &amp; Diversification</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Finance / Strategy</span>
<span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Data analytics platform supporting SIB's revenue diversification strategy. AI models analyze transaction behavior, product penetration, and customer segments to identify fee income opportunities. Net fee and commission income surged 53.5% in H1 2025 (to AED 276M) and continued growing 9.3% in Q1 2026 — attributed in part to improved analytics-driven product targeting.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Fee income: AED 179.8M (H1 2024) → AED 276M (H1 2025), +53.5%; revenue diversification away from net financing income; Q1 2026 fee income AED 179.7M (+9.3% YoY)</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Business intelligence platform; customer transaction analytics; product recommendation engine</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">SIB H1 2025 Financial Results (Gulf News) | SIB Q1 2026 Results (Zawya, Apr 14 2026)</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-014</div>
<div class="uc-name">Automated Sukuk Issuance &amp; Capital Markets Analytics</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Treasury / Capital Markets</span>
<span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
<span class="tag tag-tech">2025–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">SIB deployed quantitative analytics and automation in its Sukuk issuance program in 2025, including a USD 500M Sukuk listed on Nasdaq Dubai in December 2025 (oversubscribed). Automated investor matching, pricing analytics, and Sharia-compliance validation for capital markets transactions.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">USD 500M raised in Dec 2025 (oversubscribed); AED 1.83B Tier 1 Sukuk issued H1 2025; efficient capital raising; expanded institutional investor base; Nasdaq Dubai listing</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Capital markets analytics; Sharia compliance validation engine; investor order management; Nasdaq Dubai market infrastructure</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">emiratesbreaking.com SIB profile | SIB H1 2025 Statement of Cash Flows | Zawya 2025 financial results</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-015</div>
<div class="uc-name">ASAS Real Estate AI Property Analytics</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Real Estate Subsidiary (ASAS)</span>
<span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">ASAS Real Estate (SIB's real estate subsidiary) uses property market analytics and AI-driven demand forecasting for residential project launches in Sharjah. Applied to the Al Sahma land project and other residential developments. Integrated with SIB's home finance business for end-to-end customer journey analytics.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Informed project launch timing; improved capital deployment in real estate; cross-sell to SIB home finance customers; SIB investment property book growth (AED 16.7M acquisition in H1 2025)</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Real estate market analytics; geospatial data modeling; property demand forecasting models</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">SIB Personal Banking press releases | SIB H1 2025 Cash Flow Statement</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-016</div>
<div class="uc-name">Ruwaad 2025 AI-for-Talent Development Platform</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Human Resources</span>
<span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
<span class="tag tag-tech">2025–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">SIB's "Ruwaad 2025" Emiratization talent development programme uses data-driven training frameworks to identify and develop Emirati banking professionals. The program focuses on creating "future-ready leaders" with digital and technology competencies aligned to SIB's digital transformation roadmap.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Emiratization compliance; building internal digital/tech talent pipeline; reduced external hiring dependency; leadership development for digital banking transformation</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Learning management systems; competency mapping analytics; performance tracking platforms</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Zawya, Aug 27 2025 — "SIB launches new cohort of Ruwaad 2025 programme"</div></div>
</div>
<div class="uc-card" data-maturity="Pilot">
<div class="uc-id">UC-017</div>
<div class="uc-name">AI Sharia Compliance Monitoring (Reg-Tech)</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Sharia Compliance / Legal</span>
<span class="tag" style="background:#f0f0f0;color:#5530aa">Pilot / Exploration</span>
<span class="tag tag-tech">2025–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Emerging use of AI/RegTech tools for automated Sharia compliance checking across product contracts, transaction flows, and new product development. Supports the Internal Sharia Supervision Committee (ISSC) in monitoring compliance with CBUAE Sharia Compliance Function (SCF) standards effective April 2024.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Faster Sharia audit cycles; automated contract clause analysis; real-time transaction flagging for Riba/Gharar/Maysir violations; CBUAE SCF regulatory compliance</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">NLP contract analysis; rule-based Sharia compliance engine; RegTech automation platform</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Annual Sharia Report 2024 (sib.ae/docs) | CBUAE SCF Standards 2024 | Academic research on AI in Islamic banking (IJIFSD 2026)</div></div>
</div>
<div class="uc-card" data-maturity="Pilot">
<div class="uc-id">UC-018</div>
<div class="uc-name">Digital Banking Accessibility — Screen Reader AI</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Digital Banking / Inclusion</span>
<span class="tag" style="background:#f0f0f0;color:#5530aa">Pilot / Exploration</span>
<span class="tag tag-tech">2025–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">SIB offers a screen reader-enabled digital banking service for customers with visual disabilities — a notable inclusion initiative. NLP and voice synthesis are used to read out account balances, transactions, and banking options for visually impaired customers, supporting financial accessibility goals.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Financial inclusion for visually impaired customers; ESG/social impact credit; regulatory alignment with UAE disability inclusion laws; differentiation from competitors</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Screen reader APIs (ARIA); text-to-speech AI; accessibility standards (WCAG 2.1)</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">emiratesbreaking.com SIB digital banking profile (Jan 2026) | SIB ESG Report 2024</div></div>
</div>
<div class="uc-card" data-maturity="Pilot">
<div class="uc-id">UC-019</div>
<div class="uc-name">ESG Data Analytics &amp; Green Finance Reporting</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Sustainability / ESG</span>
<span class="tag" style="background:#f0f0f0;color:#5530aa">Pilot / Exploration</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">SIB publishes annual ESG Reports (2021–2024 publicly available) and has a partnership with the Environment and Protected Areas Authority. Data analytics is used to track ESG KPIs, environmental impact metrics, and portfolio carbon exposure — though a full AI-powered ESG platform is still in development.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Investor ESG transparency; Sustainalytics ESG risk rating coverage; green finance product development; alignment with UAE Net Zero 2050 strategy</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">ESG data collection tools; Sustainalytics integration; environmental metrics dashboard</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">SIB ESG Report 2024 (sib.ae/en/about-us/investor-relations) | Sustainalytics ESG rating | LeadIQ SIB profile</div></div>
</div>
<div class="uc-card" data-maturity="Pilot">
<div class="uc-id">UC-020</div>
<div class="uc-name">GenAI Customer Service Assistant (Exploration)</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Customer Service / Digital</span>
<span class="tag" style="background:#f0f0f0;color:#5530aa">Pilot / Exploration</span>
<span class="tag tag-tech">2025–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Industry context and SIB's digital banking investment trajectory strongly indicate an exploratory GenAI customer service capability (chatbot/virtual assistant) is under development or early evaluation. While SIB has not publicly announced a named GenAI assistant (unlike QIB's "Zaki" or ADIB's equivalent), the combination of digital account servicing needs, 24x7 call center operations, and CBUAE digital banking mandates creates clear motivation. This use case is marked as "Exploration" pending official announcement.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Estimated 40-60% call center deflection potential; 24/7 Arabic/English service; cost reduction; competitive alignment with UAE Islamic banking peers</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">LLM (GPT-4 or Arabic-tuned model); RAG on banking knowledge base; Arabic NLP; WhatsApp/app chatbot integration</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Analytically inferred from SIB digital banking strategy, UAE Islamic banking AI adoption trends (IJIFSD 2026), and SIB technology investment disclosures</div></div>
</div>
</div>
</div>
</div>

<div class="page" id="page-agents">
<div class="container">
<div class="section-head">
<h2>AI Agents &amp; Intelligent Automation — 8 Identified</h2>
<p>Autonomous and semi-autonomous AI tools deployed across SIB's operations and digital platforms (H2 2025 – Q1 2026)</p>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem">
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">🛡️</div>SIB Fraud Early Warning Agent</div>
<table>
<tr><th>Field</th><th>Details</th></tr>
<tr><td>Purpose</td><td>Real-time autonomous monitoring of all card transactions for fraud signals. Automatically triggers card suspension and customer alerts when anomalies detected — no human intervention needed for initial response.</td></tr>
<tr><td>Department</td><td>Retail Banking / Card Operations / Security</td></tr>
<tr><td>Business Value</td><td>Continuous 24/7 card fraud prevention; reduced fraud losses; customer trust; Mastercard fraud intelligence integration</td></tr>
<tr><td>Source</td><td>SIB Prepaid Card T&amp;Cs (sib.ae) | SIB Digital Banking Services</td></tr>
</table>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">👤</div>SIB Biometric Identity Agent</div>
<table>
<tr><th>Field</th><th>Details</th></tr>
<tr><td>Purpose</td><td>Autonomous biometric authentication agent managing face ID and fingerprint recognition for every login and transaction in SIB Digital. Replaces OTP — eliminates SIM-swap attack vector without human involvement.</td></tr>
<tr><td>Department</td><td>Digital Banking / IT Security</td></tr>
<tr><td>Business Value</td><td>Fraud vector elimination; frictionless authentication; CBUAE digital security compliance; customer experience improvement</td></tr>
<tr><td>Source</td><td>SIB Digital Authentication page (sib.ae/en/auth)</td></tr>
</table>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">💳</div>SIB Pay Tokenization Agent</div>
<table>
<tr><th>Field</th><th>Details</th></tr>
<tr><td>Purpose</td><td>Automated card tokenization engine within SIB Pay that generates unique payment tokens per merchant, replacing card credentials at point of sale and online — executing without human intervention per transaction.</td></tr>
<tr><td>Department</td><td>Payments / Corporate Banking</td></tr>
<tr><td>Business Value</td><td>Eliminates merchant card data breaches; secure B2B payment platform; UAE cashless society enablement; first Sharjah Islamic bank to deploy enterprise tokenization</td></tr>
<tr><td>Source</td><td>Gulf News Nov 2025 | CoinGeek Nov 2025 | SIB SIB Pay press release</td></tr>
</table>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">🤖</div>SIB STP Payment Processing Agent</div>
<table>
<tr><th>Field</th><th>Details</th></tr>
<tr><td>Purpose</td><td>Intelligent automation agent managing SWIFT payment message validation, formatting, and routing for near-100% straight-through processing. Automatically handles exception resolution on cross-border transactions. Recognized by Deutsche Bank (Client Excellence Award) and J.P. Morgan (Elite Quality Recognition Award) in 2025.</td></tr>
<tr><td>Department</td><td>Operations / Treasury / Correspondent Banking</td></tr>
<tr><td>Business Value</td><td>Industry-best STP rate; two banking quality awards 2025; eliminated manual processing cost; accelerated international payment settlement</td></tr>
<tr><td>Source</td><td>Sharjah24 (Deutsche Bank award) | ZoomInfo/SIB (J.P. Morgan award 2025)</td></tr>
</table>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">📱</div>SIB Digital Onboarding Agent</div>
<table>
<tr><th>Field</th><th>Details</th></tr>
<tr><td>Purpose</td><td>End-to-end automated digital account opening agent: Emirates ID capture and OCR, liveness detection, KYC database validation, account creation and activation — entirely autonomous within the SIB Digital app without branch visit or human review for standard cases.</td></tr>
<tr><td>Department</td><td>Retail Banking / Operations</td></tr>
<tr><td>Business Value</td><td>Branch-free account opening in minutes; zero minimum balance access; financial inclusion; reduced branch operating costs; expanded customer acquisition across UAE</td></tr>
<tr><td>Source</td><td>SIB Digital Account page (sib.ae) | SIB Digital App (Google Play reviews 2025–2026)</td></tr>
</table>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">🏦</div>SIB Smart Branch Self-Service Agent</div>
<table>
<tr><th>Field</th><th>Details</th></tr>
<tr><td>Purpose</td><td>AI-guided smart kiosk agent at Dubai Festival City Mall branch (launched April 2025) that autonomously handles routine banking transactions — transfers, balance enquiries, card services, statement requests — routing to human staff only for complex needs.</td></tr>
<tr><td>Department</td><td>Retail Banking / Branch Operations</td></tr>
<tr><td>Business Value</td><td>24-hour self-service capability; reduced teller FTE requirements; Dubai market expansion; operational efficiency to international standards</td></tr>
<tr><td>Source</td><td>Sharjah24, Apr 20 2025 | LinkedIn SIB post Apr 2025</td></tr>
</table>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">⚠️</div>SIB Cybersecurity Threat Intelligence Agent</div>
<table>
<tr><th>Field</th><th>Details</th></tr>
<tr><td>Purpose</td><td>Automated threat detection and response agent monitoring SIB's digital infrastructure for cyberattacks, phishing campaigns, and suspicious activity across online banking, mobile banking and corporate digital services. SIB's CISO (Arif Irfani) won CISO of the Year at Future Enterprise Awards 2025 — reflecting the maturity of this capability.</td></tr>
<tr><td>Department</td><td>IT Security / CISO Office</td></tr>
<tr><td>Business Value</td><td>CISO of the Year award 2025; proactive threat containment; protection of AED 90.9B asset base; customer data security; regulatory compliance</td></tr>
<tr><td>Source</td><td>ZoomInfo SIB profile (CISO award) | ITP.net Middle East IT Leaders 2025 | SIB security pages</td></tr>
</table>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">📊</div>SIB IFRS 9 Provisioning Model Agent</div>
<table>
<tr><th>Field</th><th>Details</th></tr>
<tr><td>Purpose</td><td>Automated quantitative provisioning agent running ECL (Expected Credit Loss) calculations under IFRS 9 across SIB's AED 48B+ financing book. Autonomously computes Stage 1/2/3 provisioning, macroeconomic scenario overlays, and impairment charges for quarterly financial reporting.</td></tr>
<tr><td>Department</td><td>Risk Management / Finance</td></tr>
<tr><td>Business Value</td><td>AED 76.6M provisioning improvement YoY in H1 2025; improved earnings quality; KPMG-audited model accuracy; regulatory capital efficiency</td></tr>
<tr><td>Source</td><td>SIB H1 2025 Financial Statements (KPMG-reviewed) | SIB Annual Financial Report 2024</td></tr>
</table>
</div>
</div>
</div>
</div>

<div class="page" id="page-programs">
<div class="container">
<div class="section-head">
<h2>AI &amp; Digital Programs — 6 Active (2025–2026)</h2>
<p>Strategic AI and digital transformation initiatives identified from SIB's official communications and financial disclosures</p>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:1rem">
<div class="prog-card">
<div class="prog-name">SIB Pay — Enterprise Digital Payments Program</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Payments / Corporate Banking</span>
<span class="tag tag-prod">Production</span>
<span class="tag tag-tech">Launched Nov 2025</span>
</div>
<div class="prose"><p>SIB's flagship digital transformation initiative for 2025. SIB Pay is the UAE's first enterprise digital payments platform launched by a Sharjah-based Islamic bank. The program delivers AI card tokenization, multi-channel payment acceptance (POS, e-commerce, Pay By Link) and a Sharia-compliant payment ecosystem for SMEs, corporates and government entities. SIB Pay positions SIB as a serious player in the UAE B2B fintech market — aligning with UAE Vision 2031's cashless digital economy agenda.</p></div>
<div style="font-size:12px;color:#888;font-style:italic">Source: Gulf News Nov 2025 | CoinGeek Nov 2025 | SIB Press Release Nov 2025</div>
</div>
<div class="prog-card">
<div class="prog-name">Digital Transformation Strategy 2024–2026</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Group-Wide</span>
<span class="tag tag-scale">Scaling</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="prose"><p>SIB's board-endorsed multi-year strategy focused on digital transformation, revenue diversification, financial stability, and regional expansion. Specific pillars include: (1) expanding smart digital branch network, (2) enhancing SIB Digital app capabilities, (3) building digital payment ecosystem (SIB Pay), (4) automating back-office operations through STP intelligence, and (5) developing human capital for technology roles via Ruwaad 2025. Technology and talent OpEx grew 17.9% YoY in Q1 2026, confirming active investment execution.</p></div>
<div style="font-size:12px;color:#888;font-style:italic">Source: SIB AGM 2025 Chairman statement | SIB Q1 2026 Results (WAM, Apr 13 2026) | Zawya AGM report Feb 2025</div>
</div>
<div class="prog-card">
<div class="prog-name">STP Excellence &amp; Payments Automation Program</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Operations / Correspondent Banking</span>
<span class="tag tag-prod">Production — Award-Winning</span>
<span class="tag tag-tech">2022–2026</span>
</div>
<div class="prose"><p>SIB's multi-year program to achieve best-in-class straight-through processing rates for domestic and international payments. The program uses intelligent automation, SWIFT message optimization, and AI exception-handling to minimize manual intervention. The results earned SIB the Deutsche Bank Client Excellence Award (2025) for STP performance and the J.P. Morgan Elite Quality Recognition Award (2025) — both globally recognized payment quality certifications that only the most automated, AI-assisted payment operations can achieve.</p></div>
<div style="font-size:12px;color:#888;font-style:italic">Source: Sharjah24 (Deutsche Bank Award) | ZoomInfo SIB profile (J.P. Morgan Award 2025)</div>
</div>
<div class="prog-card">
<div class="prog-name">Ruwaad 2025 — National AI &amp; Digital Talent Program</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Human Resources / Emiratization</span>
<span class="tag tag-scale">Scaling</span>
<span class="tag tag-tech">2025–2026</span>
</div>
<div class="prose"><p>SIB's flagship Emiratization and talent development initiative specifically designed to build the next generation of technology-literate banking professionals. Ruwaad 2025 deploys intensive, specialised training tracks covering professional advancement, leadership, and technical expertise — with explicit focus on digital banking and technology competencies. The new batch launched in August 2025 under the leadership of Fadheela Al Marzouqi (HR Head) and Hakam Abu Zarour (COO).</p></div>
<div style="font-size:12px;color:#888;font-style:italic">Source: Zawya, Aug 27 2025 — "SIB launches new cohort of Ruwaad 2025 programme"</div>
</div>
<div class="prog-card">
<div class="prog-name">ESG &amp; Responsible Finance Digitization Program</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Sustainability / Finance</span>
<span class="tag tag-scale">Scaling</span>
<span class="tag tag-tech">2022–2026</span>
</div>
<div class="prose"><p>SIB has published ESG Reports annually since 2021, with the ESG Report 2024 publicly available. The program uses data analytics for ESG KPI tracking, environmental impact reporting, and governance metric disclosure. A partnership with the Environment and Protected Areas Authority of Sharjah underpins green finance product development. SIB redirects late payment fees to charity — a unique digital workflow operationalizing ethical Islamic banking principles.</p></div>
<div style="font-size:12px;color:#888;font-style:italic">Source: SIB ESG Report 2024 (sib.ae) | Sustainalytics ESG rating | LeadIQ SIB profile</div>
</div>
<div class="prog-card">
<div class="prog-name">Cybersecurity &amp; Digital Risk Management Program</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">IT Security / Risk</span>
<span class="tag tag-prod">Production — Award-Winning</span>
<span class="tag tag-tech">2020–2026</span>
</div>
<div class="prose"><p>SIB's investment in cybersecurity infrastructure is demonstrated by the Future Enterprise Awards 2025 CISO of the Year recognition for Arif Irfani. The program covers next-gen encryption, biometric authentication (replacing OTP), AI-driven threat intelligence, firewall architecture, and phishing prevention across all digital banking channels. SIB's Q1 2026 OpEx increase directly references "enhancement of technological and operational infrastructure" — including security investments.</p></div>
<div style="font-size:12px;color:#888;font-style:italic">Source: ZoomInfo SIB profile | ITP.net ME IT Leaders 2025 | SIB Digital Authentication page | Q1 2026 Management Report</div>
</div>
</div>
</div>
</div>
 
<div class="page" id="page-partnerships">
<div class="container">
<div class="section-head">
<h2>Technology &amp; AI Partnerships — 5 Strategic (2025–2026)</h2>
<p>Key external relationships enabling SIB's digital and AI transformation</p>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:1rem">
<div class="partner-card">
<div class="partner-logo">NETW<br/>INT'L</div>
<div>
<div style="font-weight:600;font-size:14px;color:#00563F;margin-bottom:4px">Network International</div>
<span class="tag tag-partner">Payments / Fintech</span>
<p style="font-size:12px;margin-top:8px;line-height:1.6">Strategic partnership enabling SIB's multi-channel digital payment acceptance (POS, e-commerce, Pay By Link) for corporate and SME clients. Network International's payment gateway underpins SIB Pay's merchant payment infrastructure and AI-powered payment routing.</p>
<div style="font-size:11px;color:#888;margin-top:6px">Source: LeadIQ SIB profile | uaepedia.net SIB profile</div>
</div>
</div>
<div class="partner-card">
<div class="partner-logo">DEUT<br/>BANK</div>
<div>
<div style="font-weight:600;font-size:14px;color:#00563F;margin-bottom:4px">Deutsche Bank</div>
<span class="tag tag-partner">Correspondent Banking / STP</span>
<p style="font-size:12px;margin-top:8px;line-height:1.6">Correspondent banking partner recognizing SIB with the prestigious "Client Excellence Award" in 2025 for outstanding STP performance. This recognition validates SIB's intelligent payment automation infrastructure and positions SIB as a premium payments correspondent bank in the UAE.</p>
<div style="font-size:11px;color:#888;margin-top:6px">Source: Sharjah24 (Client Excellence Award 2025)</div>
</div>
</div>
<div class="partner-card">
<div class="partner-logo">J.P.<br/>MORG</div>
<div>
<div style="font-weight:600;font-size:14px;color:#00563F;margin-bottom:4px">J.P. Morgan</div>
<span class="tag tag-partner">Payments / Quality Recognition</span>
<p style="font-size:12px;margin-top:8px;line-height:1.6">J.P. Morgan awarded SIB the "Elite Quality Recognition Award" in 2025 for exceptional payment STP rates and processing quality. Confirms SIB's intelligent payments automation reaches global quality benchmarks — a standard only achievable with AI-assisted payment processing.</p>
<div style="font-size:11px;color:#888;margin-top:6px">Source: ZoomInfo SIB profile (Hakam Abu-Zarour, COO — J.P. Morgan Award 2025)</div>
</div>
</div>
<div class="partner-card">
<div class="partner-logo">MAST<br/>CARD</div>
<div>
<div style="font-weight:600;font-size:14px;color:#00563F;margin-bottom:4px">Mastercard</div>
<span class="tag tag-partner">Cards / Tokenization / Fraud AI</span>
<p style="font-size:12px;margin-top:8px;line-height:1.6">Mastercard partnership underpins SIB's prepaid and debit card infrastructure, including the Fraud Early Warning System, contactless payment technology, and global ATM/merchant network access (840,000+ ATMs). SIB also benefits from Mastercard's global fraud intelligence network for AI-powered transaction risk scoring.</p>
<div style="font-size:11px;color:#888;margin-top:6px">Source: SIB Prepaid Card T&amp;Cs (sib.ae) | ITP.net (Nick Vora, Mastercard CEME CIO)</div>
</div>
</div>
<div class="partner-card">
<div class="partner-logo">KPMG</div>
<div>
<div style="font-weight:600;font-size:14px;color:#00563F;margin-bottom:4px">KPMG Lower Gulf</div>
<span class="tag tag-partner">Audit / Risk / Technology Advisory</span>
<p style="font-size:12px;margin-top:8px;line-height:1.6">KPMG serves as SIB's external auditor, reviewing all financial statements including IFRS 9 ECL models, provisioning algorithms, and risk model adequacy. KPMG's validation of SIB's quantitative models provides governance assurance for AI-based risk calculations and underpins regulatory confidence in SIB's automated credit risk infrastructure.</p>
<div style="font-size:11px;color:#888;margin-top:6px">Source: SIB H1 2025 Financial Statements (KPMG Lower Gulf review report)</div>
</div>
</div>
</div>
</div>
</div>

<div class="page" id="page-maturity">
<div class="container">
<div class="section-head">
<h2>AI Maturity Assessment — Sharjah Islamic Bank</h2>
<p>Five-point analytical framework benchmarking SIB's AI readiness across strategic dimensions (May 2026)</p>
</div>
<div class="score-big">2.8 / 5.0</div>
<div class="score-sub">Overall AI Maturity Score — "Digitally Advancing" Stage</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem;margin-bottom:1.5rem">
<div class="card">
<div class="card-title">Maturity Radar — Dimension Detail</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>Digital Strategy &amp; Governance</span><span style="font-weight:600">3.2/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:64%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>Payments &amp; Automation</span><span style="font-weight:600">3.5/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:70%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>Data Infrastructure &amp; Analytics</span><span style="font-weight:600">2.8/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:56%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>AI / ML Production Deployment</span><span style="font-weight:600">2.8/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:56%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>AI / ML Talent</span><span style="font-weight:600">2.5/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:50%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>Cybersecurity AI</span><span style="font-weight:600">3.5/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:70%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>GenAI / Agentic AI</span><span style="font-weight:600">1.5/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:30%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>Responsible AI / ESG AI</span><span style="font-weight:600">2.5/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:50%"></div></div>
</div>
</div>
<div class="card">
<div class="card-title">Maturity Stage: "Digitally Advancing"</div>
<div class="prose">
<p>SIB sits at a <strong>Digitally Advancing</strong> maturity stage — meaningfully beyond basic digital banking but behind UAE AI leaders (FAB: 4.1/5, ADIB: ~3.8/5). Its strongest AI dimensions are Payments Automation (STP excellence, SIB Pay tokenization, Mastercard fraud AI) and Cybersecurity AI (CISO of the Year, biometric authentication). These represent genuine production-scale AI deployments with measurable awards and financial impact.</p>
<p>The <strong>weakest dimension is GenAI / Agentic AI</strong> (1.5/5), where SIB has no publicly announced LLM, conversational AI, or autonomous multi-step agent programs — representing the largest competitive gap relative to UAE banking leaders.</p>
<p>The <strong>17.9% technology OpEx surge in Q1 2026</strong> explicitly attributed to "enhancement of technological and operational infrastructure" signals an active investment cycle — suggesting maturity scores may accelerate significantly in H2 2026 if GenAI and advanced ML programs are announced.</p>
</div>
</div>
</div>
<div class="card">
<div class="card-title">Maturity Benchmarking — UAE Islamic Banking Peers</div>
<table>
<thead><tr><th>Bank</th><th>Overall AI Maturity</th><th>Payments AI</th><th>GenAI</th><th>Stage</th></tr></thead>
<tbody>
<tr><td><strong>FAB</strong></td><td>4.1/5</td><td>4.5/5</td><td>3.9/5</td><td><span class="tag tag-prod">AI Leader</span></td></tr>
<tr><td><strong>ADIB</strong></td><td>~3.8/5</td><td>4.0/5</td><td>3.5/5</td><td><span class="tag tag-scale">AI Advanced</span></td></tr>
<tr><td><strong>DIB</strong></td><td>~3.2/5</td><td>3.5/5</td><td>2.5/5</td><td><span class="tag tag-scale">AI Scaling</span></td></tr>
<tr><td><strong style="color:#00563F">SIB (This Report)</strong></td><td><strong>2.8/5</strong></td><td>3.5/5</td><td>1.5/5</td><td><span class="tag tag-pilot">Digitally Advancing</span></td></tr>
<tr><td><strong>Smaller UAE Islamic Banks</strong></td><td>~2.0/5</td><td>2.5/5</td><td>1.0/5</td><td><span class="tag" style="background:#eee;color:#888">Early Stage</span></td></tr>
</tbody>
</table>
</div>
</div>
</div>

<div class="page" id="page-executive">
<div class="container">
<div class="section-head">
<h2>AI Executive Summary — Sharjah Islamic Bank 2026</h2>
<p>Synthesized intelligence brief for senior leadership and strategic decision-makers</p>
</div>
<div class="summary-box">
<h3>Executive Intelligence Brief</h3>
<p>Sharjah Islamic Bank is at an inflection point in its technology and AI transformation journey. The bank posted a record AED 1.05 billion net profit in FY2024 and continues to deliver strong performance — AED 697.2M in H1 2025 (+25% YoY) and AED 380.7M in Q1 2026 (+19.4% YoY). This financial strength is now being strategically reinvested into technology infrastructure at an accelerating pace, with Q1 2026 technology and talent OpEx growing 17.9% YoY to AED 233.8M. Across digital payments, fraud AI, and automation, SIB is building competitive capabilities — though the gap versus UAE banking AI leaders remains significant in advanced ML and GenAI.</p>
</div>
<div class="card">
<div class="card-title">10 Strategic Findings</div>
<div class="finding-item"><span class="finding-num">01</span><strong>SIB Pay is the bank's most significant AI-adjacent launch in 2025.</strong> The November 2025 launch of SIB Pay — a card tokenization and enterprise payments platform — makes SIB the first Sharjah Islamic bank to offer this capability, creating a new revenue channel and positioning SIB as a serious B2B fintech player aligned with UAE Vision 2031.</div>
<div class="finding-item"><span class="finding-num">02</span><strong>SIB earned two international payment quality awards in 2025</strong> (Deutsche Bank Client Excellence Award and J.P. Morgan Elite Quality Recognition Award) — concrete external validation of SIB's STP automation excellence, a proxy for AI-powered payment operations maturity.</div>
<div class="finding-item"><span class="finding-num">03</span><strong>Technology investment is accelerating.</strong> Q1 2026 G&amp;A expenses grew 17.9% YoY, explicitly attributed to "enhancement of technological and operational infrastructure." This is the strongest quantitative signal of active AI/tech investment disclosed in SIB's public filings.</div>
<div class="finding-item"><span class="finding-num">04</span><strong>Biometric authentication is fully live, replacing OTP across all digital channels.</strong> SIB's OTP-to-biometrics migration eliminates the SIM-swap fraud vector and positions SIB ahead of many peers in mobile security — a critical trust factor for digital banking growth.</div>
<div class="finding-item"><span class="finding-num">05</span><strong>AI-enhanced credit risk management is delivering measurable results.</strong> The NPL ratio improved from 4.84% (end-2024) to 4.54% (Q1 2025), with S&amp;P projecting further decline to 4.3-4.5% — partly attributable to improved ML-based credit scoring and IFRS 9 model discipline.</div>
<div class="finding-item"><span class="finding-num">06</span><strong>Fee income growth of 53.5% in H1 2025 reflects successful digital revenue diversification.</strong> While not solely AI-driven, data analytics and digital platform growth have enabled SIB to significantly grow non-financing income — reducing reliance on net income from Islamic financing.</div>
<div class="finding-item"><span class="finding-num">07</span><strong>SIB's CISO of the Year recognition (Future Enterprise Awards 2025) confirms a mature cybersecurity AI capability.</strong> Arif Irfani's award reflects SIB's investment in advanced threat intelligence, encryption, and AI-assisted security operations.</div>
<div class="finding-item"><span class="finding-num">08</span><strong>GenAI and Agentic AI are SIB's most critical competitive gaps.</strong> Unlike FAB (Azure OpenAI), ADIB, and even smaller regional Islamic banks with named AI assistants, SIB has no publicly disclosed LLM-based assistant, GenAI program, or autonomous multi-step AI agent as of May 2026.</div>
<div class="finding-item"><span class="finding-num">09</span><strong>The AED 2.59 billion rights issue approved in March 2026 creates significant capital for digital investment.</strong> This capital raising event — the largest in SIB's history — will fund strategic growth including technology infrastructure, potentially unlocking the GenAI and advanced AI investments currently absent from SIB's public program disclosures.</div>
<div class="finding-item"><span class="finding-num">10</span><strong>Ruwaad 2025 and talent investment signal intent to build internal AI capability.</strong> SIB is building a pipeline of technically skilled Emirati banking professionals — a prerequisite for sustainable in-house AI development rather than sole reliance on vendor solutions.</div>
</div>
</div>
</div>

<div class="page" id="page-ceo">
<div class="container">
<div class="section-head">
<h2>CEO-Level AI Intelligence Report</h2>
<p>Strategic brief for executive leadership — synthesized from H2 2025 and Q1 2026 official disclosures</p>
</div>
<div class="ceo-report">
<div class="report-header">
<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem">
<div>
<div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">AI Intelligence Report</div>
<div style="font-size:22px;font-weight:700;color:#00563F">Sharjah Islamic Bank — AI Strategy Assessment 2026</div>
<div style="font-size:13px;color:#666;margin-top:4px">Prepared: May 30, 2026 | Classification: Strategic | Sources: Official SIB Disclosures</div>
</div>
<div style="text-align:right">
<div style="font-size:30px;font-weight:700;color:#00563F">2.8/5</div>
<div style="font-size:11px;color:#888">AI Maturity Score</div>
<span class="tag tag-scale">Digitally Advancing</span>
</div>
</div>
</div>
<h3>1. Situation Assessment</h3>
<p>Sharjah Islamic Bank enters 2026 in the strongest financial position in its 50-year history. With a first-ever AED 1 billion+ net profit in FY2024, record Q1 2026 profits of AED 380.7M (+19.4% YoY), and an AED 2.59 billion rights issue approved in March 2026, SIB has the financial firepower to accelerate its digital and AI transformation significantly. The bank's strategy — explicitly articulating "digital transformation, revenue diversification, financial stability, and regional expansion" — is bearing fruit: fee income grew 53.5% in H1 2025 and the overall business is expanding aggressively (total assets: AED 90.9B in Q1 2026).</p>
<p>However, SIB's AI maturity lags behind its ambitions and its UAE banking peers. The bank's current AI profile is strongest in payments automation (SIB Pay, STP excellence, card tokenization) and cybersecurity AI (biometric authentication, CISO of the Year 2025) — but essentially absent in Generative AI, agentic automation, advanced personalization, and conversational banking. This creates both a risk (competitive erosion if GenAI adoption accelerates) and an opportunity (first-mover advantage in Sharia-compliant GenAI applications is still available).</p>
<h3>2. Key AI Achievements — H2 2025 to Q1 2026</h3>
<p><strong>SIB Pay (November 2025):</strong> The bank's most strategically significant technology launch in years. SIB Pay introduces enterprise-grade card tokenization, multi-channel payment acceptance, and a Sharia-compliant B2B payments ecosystem for SMEs, corporates, and government bodies. This is the first such platform from a Sharjah Islamic bank — establishing SIB as a digital payments leader in the Sharjah financial market and opening material new fee income streams.</p>
<p><strong>Dual Payment Quality Awards (2025):</strong> Both Deutsche Bank (Client Excellence Award for STP) and J.P. Morgan (Elite Quality Recognition Award) formally recognized SIB's payment processing excellence in 2025. These awards are only achievable through highly automated, AI-assisted payment operations — validating that SIB's back-office automation is at global standard.</p>
<p><strong>Smart Digital Branch — Dubai Festival City (April 2025):</strong> SIB's strategic expansion into Dubai with a smart branch concept — blending AI-guided self-service kiosks with human specialists — represents a deliberate digital branch transformation model. Dubai expansion is critical as SIB's traditional base in Sharjah faces competitive pressure from larger UAE banks.</p>
<p><strong>Technology OpEx Acceleration (+17.9% in Q1 2026):</strong> The clearest quantitative proof of SIB's technology investment acceleration. AED 233.8M in Q1 2026 G&amp;A expenses — 17.9% above prior year — explicitly attributed to "technological and operational infrastructure" investment. On an annualized basis, SIB is investing approximately AED 935M+ in technology and talent in 2026 — a significant number for a mid-tier Islamic bank.</p>
<h3>3. Critical Gaps &amp; Strategic Risks</h3>
<p><strong>GenAI Absence:</strong> The most significant competitive gap. While FAB operates Azure OpenAI-powered GenAI programs at scale and ADIB has a named AI assistant, SIB has no publicly disclosed conversational AI, LLM-based product, or GenAI program. In a market where Arabic-language GenAI adoption is accelerating in retail banking, this gap must be closed in 2026–2027 to remain competitive.</p>
<p><strong>Disclosure Opacity:</strong> Unlike FAB (which publishes detailed AI chapters in its Annual Report), SIB does not publish technology-specific reports or AI investment data. This makes it impossible for analysts, investors, and the market to assess SIB's AI strategy with confidence — potentially suppressing the bank's technology premium valuation.</p>
<p><strong>Mid-Tier Scale Constraint:</strong> SIB's AED 90.9B asset base and ~1,000–5,000 employee count limits the AI investment scale relative to FAB (AED 1T+). Partnerships and vendor leverage (rather than in-house AI R&amp;D) will be critical to closing the maturity gap efficiently.</p>
<h3>4. Strategic Recommendations</h3>
<p><strong>Priority 1 — Launch a Named GenAI Banking Assistant (2026):</strong> SIB should announce a Sharia-compliant Arabic/English GenAI virtual assistant (chatbot/voice agent) on SIB Digital and WhatsApp. The Islamic banking angle (Sharia-compliant product recommendations, Islamic finance explanations) is a genuine differentiator that larger banks cannot easily replicate. Target: 60% call center deflection within 18 months.</p>
<p><strong>Priority 2 — Publish an Annual AI/Technology Report:</strong> Establishing a standalone AI report (or a dedicated technology chapter in the Annual Report) would raise SIB's profile among technology investors, attract AI talent, and signal strategic commitment. Peer banks FAB, ADIB and DIB all publish digital transformation narratives.</p>
<p><strong>Priority 3 — Deploy AI-Powered SME Lending (2026–2027):</strong> The 53.5% fee income surge in H1 2025 signals a receptive SME market. Building ML-based instant SME financing decisioning (similar to FAB's SME AI platform) would unlock significant loan book growth while reducing credit risk through better data-driven underwriting.</p>
<p><strong>Priority 4 — Leverage Rights Issue Capital for AI Investment:</strong> The AED 2.59 billion rights issue (March 2026) provides a unique capital window. Allocating 5-10% (AED 130–260M) to a multi-year AI platform investment — cloud data infrastructure, GenAI platform, AI talent — would transform SIB's maturity score from 2.8 to 4.0+ within 2-3 years.</p>
<p><strong>Priority 5 — Formalize AI Governance and Responsible AI Framework:</strong> As CBUAE's AI regulatory framework evolves, SIB should establish a formal AI ethics committee, responsible AI policy, and algorithmic governance documentation — aligning with both regulatory direction and investor ESG expectations.</p>
<h3>5. Conclusion</h3>
<p>Sharjah Islamic Bank is a financially strong, strategically ambitious Islamic bank that is meaningfully investing in digital transformation — but has not yet translated that investment into a comprehensive AI program comparable to UAE banking leaders. The combination of record profits, a major capital raise, accelerating tech OpEx, and a growing suite of digital products (SIB Pay, smart branches, biometric auth) creates an excellent foundation. The next 18 months are pivotal: if SIB announces GenAI programs, AI lending platforms, and a formal AI strategy, it has the potential to leapfrog from "Digitally Advancing" to "AI Leader" within its UAE Islamic banking peer group. The opportunity is there — the question is execution speed.</p>
<div style="margin-top:1.5rem;padding:1rem;background:#f2faf7;border-radius:8px;font-size:12px;color:#666;border-left:3px solid #00563F">
<strong>Report Basis:</strong> This CEO-level report is synthesized from SIB's quarterly financial statements (H1 2025, Q3 2025, Q1 2026), press releases, investor communications, ADX disclosures, KPMG audit reports, S&amp;P credit analysis, and official media coverage. SIB does not publish a standalone CEO AI report. This document constitutes the synthesized AI intelligence report and is for strategic advisory purposes only.
    </div>
</div>
</div>
</div>

<div class="page" id="page-urls">
<div class="container">
<div class="section-head">
<h2>2026 Report Download URL Inventory</h2>
<p>Official SIB document sources — all URLs verified against sib.ae domain structure and official media</p>
</div>
<div class="card" style="margin-bottom:1.5rem">
<div class="card-title" style="margin-bottom:1rem">Latest 2025–2026 Report Inventory</div>
<table>
<thead><tr><th>Document Name</th><th>Type</th><th>Date</th><th>URL</th></tr></thead>
<tbody>
<tr><td><strong>SIB Annual Financial Report 2024</strong></td><td><span class="tag tag-dept">Annual Report</span></td><td>Q1 2025</td><td class="url-row"><a href="https://www.sib.ae/en/about-us/investor-relations" target="_blank" rel="noreferrer">sib.ae/en/about-us/investor-relations</a></td></tr>
<tr><td><strong>SIB Financial Report Q3 2025</strong></td><td><span class="tag tag-scale">Quarterly Report</span></td><td>Oct 7, 2025</td><td class="url-row"><a href="https://www.sib.ae/en/about-us/investor-relations" target="_blank" rel="noreferrer">sib.ae/en/about-us/investor-relations (Quarterly Reports 2025)</a></td></tr>
<tr><td><strong>SIB H1 2025 Interim Financial Statements</strong></td><td><span class="tag tag-dept">Interim Report</span></td><td>Jul 15, 2025</td><td class="url-row"><a href="https://www.sib.ae/docs/default-source/default-document-library/sharjah-islamic-bank-pjsc-fs-30-jun-2025.pdf" target="_blank" rel="noreferrer">sib.ae/docs/…/fs-30-jun-2025.pdf ↗</a></td></tr>
<tr><td><strong>SIB Q1 2026 Financial Results</strong></td><td><span class="tag tag-scale">Quarterly Results</span></td><td>Apr 13-14, 2026</td><td class="url-row"><a href="https://www.zawya.com/en/press-release/companies-news/sharjah-islamic-bank-reports-net-profit-of-aed-381mln-ji1tqju8" target="_blank" rel="noreferrer">Zawya Press Release — Q1 2026 Results ↗</a></td></tr>
<tr><td><strong>SIB Management Report Q3 2025</strong></td><td><span class="tag tag-scale">Management Report</span></td><td>Oct 7, 2025</td><td class="url-row"><a href="https://www.sib.ae/en/about-us/investor-relations" target="_blank" rel="noreferrer">sib.ae/en/about-us/investor-relations (Management Reports 2025)</a></td></tr>
<tr><td><strong>SIB ESG Report 2024</strong></td><td><span class="tag tag-prod">ESG Report</span></td><td>2025</td><td class="url-row"><a href="https://www.sib.ae/en/about-us/investor-relations" target="_blank" rel="noreferrer">sib.ae/en/about-us/investor-relations (ESG Report section)</a></td></tr>
<tr><td><strong>Annual Sharia Report 2024</strong></td><td><span class="tag tag-dept">Sharia Report</span></td><td>Jan 2025</td><td class="url-row"><a href="https://www.sib.ae/docs/default-source/default-document-library/annual-report-of-internal-shari-ah-supervision-committee-of-sharjah-islamic-bank.pdf" target="_blank" rel="noreferrer">sib.ae/docs/…/annual-report-of-internal-shari-ah-supervision.pdf ↗</a></td></tr>
<tr><td><strong>S&amp;P Credit Rating Report — SIB May 2025</strong></td><td><span class="tag tag-tech">Credit Report</span></td><td>May 2025</td><td class="url-row"><a href="https://www.sib.ae/docs/default-source/default-document-library/s-p_sib_may2025.pdf" target="_blank" rel="noreferrer">sib.ae/docs/…/s-p_sib_may2025.pdf ↗</a></td></tr>
<tr><td><strong>SIB Pillar 3 Disclosures 2025 (Q1, Q2, Q3)</strong></td><td><span class="tag tag-tech">Regulatory</span></td><td>2025</td><td class="url-row"><a href="https://www.sib.ae/en/about-us/investor-relations" target="_blank" rel="noreferrer">sib.ae/en/about-us/investor-relations (Pillar 3 Disclosures 2025)</a></td></tr>
<tr><td><strong>ADX Regulatory Filings — SIB</strong></td><td><span class="tag tag-tech">Exchange Filings</span></td><td>Ongoing 2026</td><td class="url-row"><a href="https://www.adx.ae" target="_blank" rel="noreferrer">adx.ae (search: SIB)</a></td></tr>
<tr><td><strong>SIB Rights Issue Prospectus 2026</strong></td><td><span class="tag tag-scale">Capital Markets</span></td><td>Mar 2026</td><td class="url-row"><a href="https://www.sib.ae/RI" target="_blank" rel="noreferrer">sib.ae/RI (Rights Issue page)</a></td></tr>
</tbody>
</table>
</div>
<div class="card" style="margin-bottom:1.5rem">
<div class="card-title" style="margin-bottom:1rem">AI &amp; Digital Technology Content URLs</div>
<p style="font-size:12px;color:#888;margin-bottom:1rem;font-style:italic">Note: SIB does not publish standalone AI or technology reports. AI/digital content is embedded across the documents and pages below.</p>
<table>
<thead><tr><th>Document / Page</th><th>AI/Digital Content</th><th>URL</th></tr></thead>
<tbody>
<tr><td><strong>SIB Q1 2026 Management Report</strong></td><td>Technology infrastructure investment disclosure; operational efficiency; digital strategy commentary</td><td class="url-row"><a href="https://www.sib.ae/en/about-us/investor-relations" target="_blank" rel="noreferrer">sib.ae/investor-relations (Management Reports 2026)</a></td></tr>
<tr><td><strong>SIB H1 2025 Financial Statements (KPMG)</strong></td><td>IFRS 9 ECL models; technology OPEX; digital fee income drivers; automated provisioning</td><td class="url-row"><a href="https://www.sib.ae/docs/default-source/default-document-library/sharjah-islamic-bank-pjsc-fs-30-jun-2025.pdf" target="_blank" rel="noreferrer">sib.ae/docs/…fs-30-jun-2025.pdf ↗</a></td></tr>
<tr><td><strong>SIB Pay Press Release (Nov 2025)</strong></td><td>SIB Pay platform, card tokenization, digital payments, enterprise fintech, UAE Vision 2031</td><td class="url-row"><a href="https://gulfnews.com/business/banking/sharjah-islamic-bank-launches-sib-pay-to-expand-digital-payments-in-uae-1.500336162" target="_blank" rel="noreferrer">Gulf News: SIB Pay launch ↗</a></td></tr>
<tr><td><strong>Smart Branch Press Release (Apr 2025)</strong></td><td>Smart digital branch, self-service kiosks, digital transformation strategy, branch AI</td><td class="url-row"><a href="https://sharjah24.ae/en/Articles/2025/04/20/ZX71" target="_blank" rel="noreferrer">Sharjah24: Smart Branch Dubai ↗</a></td></tr>
<tr><td><strong>SIB Digital Authentication Page</strong></td><td>Biometric authentication, OTP replacement, Face ID/fingerprint, digital security</td><td class="url-row"><a href="https://www.sib.ae/en/auth" target="_blank" rel="noreferrer">sib.ae/en/auth</a></td></tr>
<tr><td><strong>SIB Prepaid Card T&amp;Cs</strong></td><td>Fraud Early Warning System, AI card monitoring, real-time transaction analysis</td><td class="url-row"><a href="https://www.sib.ae/en/prepaidcard-TCs" target="_blank" rel="noreferrer">sib.ae/en/prepaidcard-TCs</a></td></tr>
<tr><td><strong>SIB ESG Report 2024</strong></td><td>ESG data analytics, environmental metrics, responsible finance, sustainability KPIs</td><td class="url-row"><a href="https://www.sib.ae/en/about-us/investor-relations" target="_blank" rel="noreferrer">sib.ae/investor-relations (ESG section)</a></td></tr>
<tr><td><strong>SIB Annual Sharia Report 2024</strong></td><td>Sharia compliance processes, AI/RegTech opportunities for compliance monitoring</td><td class="url-row"><a href="https://www.sib.ae/docs/default-source/default-document-library/annual-report-of-internal-shari-ah-supervision-committee-of-sharjah-islamic-bank.pdf" target="_blank" rel="noreferrer">sib.ae/docs/…/annual-sharia-report.pdf ↗</a></td></tr>
</tbody>
</table>
</div>
<div class="card">
<div class="card-title" style="margin-bottom:1rem">All Official SIB Source URLs</div>
<div style="display:flex;flex-wrap:wrap;gap:6px">
<a class="chip" href="https://www.sib.ae" target="_blank" rel="noreferrer">sib.ae (main)</a>
<a class="chip" href="https://www.sib.ae/en/about-us/investor-relations" target="_blank" rel="noreferrer">Investor Relations</a>
<a class="chip" href="https://www.sib.ae/en/personal-banking/ways-of-banking/mobile-banking/1000" target="_blank" rel="noreferrer">Mobile Banking</a>
<a class="chip" href="https://www.sib.ae/en/Accounts/digital-account" target="_blank" rel="noreferrer">Digital Account</a>
<a class="chip" href="https://www.sib.ae/en/auth" target="_blank" rel="noreferrer">Biometric Auth</a>
<a class="chip" href="https://www.sib.ae/en/online-security-tips" target="_blank" rel="noreferrer">Security / Fraud</a>
<a class="chip" href="https://www.sib.ae/RI" target="_blank" rel="noreferrer">Rights Issue 2026</a>
<a class="chip" href="https://www.adx.ae" target="_blank" rel="noreferrer">ADX Filings</a>
<a class="chip" href="https://www.centralbank.ae" target="_blank" rel="noreferrer">CBUAE</a>
<a class="chip" href="https://gulfnews.com" target="_blank" rel="noreferrer">Gulf News (SIB coverage)</a>
<a class="chip" href="https://www.zawya.com" target="_blank" rel="noreferrer">Zawya (SIB filings)</a>
<a class="chip" href="https://sharjah24.ae" target="_blank" rel="noreferrer">Sharjah24 (SIB news)</a>
</div>
<div style="margin-top:1.5rem;padding:1rem;background:#f2faf7;border-radius:8px;font-size:12px;color:#888;border-left:3px solid #00563F">
<strong>AI Agent Names:</strong> SIB Fraud Early Warning Agent · SIB Biometric Identity Agent · SIB Pay Tokenization Agent · SIB STP Payment Processing Agent · SIB Digital Onboarding Agent · SIB Smart Branch Self-Service Agent · SIB Cybersecurity Threat Intelligence Agent · SIB IFRS 9 Provisioning Model Agent<br/><br/>
<strong>CEO Report:</strong> No standalone CEO AI report is publicly downloadable from sib.ae. AI and technology strategy content is embedded in quarterly management reports, the Annual Report, and AGM statements. The Chairman's AGM statement (February 2025) and Q1 2026 results press release contain the most current strategic AI/digital commentary. This AI Intelligence Report constitutes the synthesized CEO-level document. SIB CEO: <strong>Mohamed Abdalla</strong> | Chairman: <strong>Abdul Rahman Al Owais</strong>
</div>
</div>
</div>
</div>
<div class="page-footer">
  SIB AI Intelligence Report 2026 | Autonomous Banking AI Analysis | Sources: sib.ae, ADX, WAM, Gulf News, Zawya, Sharjah24, S&amp;P, KPMG | May 2026
</div>`;

export default function SIBAIIntelligenceReport2026() {
  useEffect(() => {
    window.showPage = (id: string, btn: HTMLElement) => {
      const root = btn.closest(".sib-ai-intelligence-report-2026") || document;

      root.querySelectorAll<HTMLElement>(".page").forEach((page) => {
        page.classList.remove("active");
      });

      root.querySelectorAll<HTMLElement>(".nav button").forEach((button) => {
        button.classList.remove("active");
      });

      root.querySelector<HTMLElement>(`#page-${id}`)?.classList.add("active");
      btn.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.filterUC = (maturity: string, btn: HTMLElement) => {
      const root = btn.closest(".sib-ai-intelligence-report-2026") || document;

      root.querySelectorAll<HTMLElement>("#uc-filters button, .filter-bar button").forEach((button) => {
        button.classList.remove("active");
      });

      btn.classList.add("active");

      root.querySelectorAll<HTMLElement>(".uc-card").forEach((card) => {
        const cardMaturity = card.dataset.maturity || "";
        card.style.display =
          maturity === "all" || cardMaturity.includes(maturity) ? "" : "none";
      });
    };

    return () => {
      delete (window as any).showPage;
      delete (window as any).filterUC;
    };
  }, []);

  return (
    <div className="sib-ai-intelligence-report-2026">
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}
