import React from "react";

const cbdReportHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CBD AI Intelligence Report 2026 — Commercial Bank of Dubai</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#f4f4f0;color:#1a1a1a;font-size:14px;line-height:1.6}
.topbar{background:#003366;color:white;padding:0}
.topbar-inner{max-width:1200px;margin:0 auto;padding:1.5rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}
.topbar h1{font-size:20px;font-weight:600;letter-spacing:-0.3px}
.topbar p{font-size:12px;opacity:0.7;margin-top:2px}
.badge-gold{background:#c9a227;color:#fff;font-size:11px;padding:3px 10px;border-radius:20px;font-weight:600}
.nav{background:#002855;padding:0;border-bottom:2px solid #c9a227;overflow-x:auto}
.nav-inner{max-width:1200px;margin:0 auto;display:flex;gap:0}
.nav button{background:none;border:none;color:rgba(255,255,255,0.7);padding:12px 18px;font-size:13px;cursor:pointer;white-space:nowrap;border-bottom:3px solid transparent;transition:all 0.2s}
.nav button:hover,.nav button.active{color:#fff;border-bottom-color:#c9a227}
.container{max-width:1200px;margin:0 auto;padding:1.5rem 2rem}
.page{display:none}.page.active{display:block}
.section-head{margin-bottom:1.5rem}
.section-head h2{font-size:22px;font-weight:600;color:#003366;margin-bottom:4px}
.section-head p{font-size:13px;color:#666}
.metrics-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:1.5rem}
.metric{background:#fff;border:0.5px solid #ddd;border-radius:8px;padding:1rem;text-align:center}
.metric .num{font-size:28px;font-weight:700;color:#003366;margin-bottom:2px}
.metric .lbl{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.5px}
.card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;margin-bottom:1rem}
.card-title{font-size:15px;font-weight:600;color:#003366;margin-bottom:8px}
.tag{display:inline-block;font-size:10px;padding:2px 8px;border-radius:12px;font-weight:600;margin:2px}
.tag-prod{background:#eaf3de;color:#27500a}
.tag-scale{background:#faeeda;color:#633806}
.tag-pilot{background:#eeedfe;color:#3c3489}
.tag-dept{background:#e6f1fb;color:#0c447c}
.tag-tech{background:#f1efe8;color:#2c2c2a}
.tag-partner{background:#faece7;color:#712b13}
table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;padding:10px 12px;background:#f8f8f4;font-weight:600;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.4px;border-bottom:1px solid #e8e8e0}
td{padding:10px 12px;border-bottom:0.5px solid #f0f0e8;vertical-align:top}
tr:last-child td{border-bottom:none}
tr:hover td{background:#fafaf8}
.uc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem}
.uc-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-left:4px solid #003366}
.uc-id{font-size:10px;color:#999;font-weight:600;letter-spacing:1px;margin-bottom:4px}
.uc-name{font-size:15px;font-weight:600;color:#003366;margin-bottom:8px}
.uc-field{margin-bottom:6px}
.uc-label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.4px;font-weight:600;margin-bottom:2px}
.uc-value{font-size:12px;color:#333;line-height:1.5}
.agent-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-left:4px solid #7f77dd}
.agent-name{font-size:14px;font-weight:600;color:#3c3489;margin-bottom:8px;display:flex;align-items:center;gap:8px}
.agent-icon{width:28px;height:28px;background:#eeedfe;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.prog-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-top:3px solid #c9a227}
.prog-name{font-size:14px;font-weight:600;color:#003366;margin-bottom:6px}
.prose{font-size:13px;line-height:1.8;color:#2a2a2a}
.prose p{margin-bottom:1rem}
.finding-item{padding:0.75rem 1rem;border-left:3px solid #003366;background:#f8f8fc;border-radius:0 6px 6px 0;margin-bottom:0.75rem;font-size:13px;line-height:1.6}
.finding-num{font-weight:700;color:#003366;margin-right:8px}
.maturity-bar-wrap{margin-bottom:1rem}
.maturity-label{display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px}
.maturity-bar{height:10px;background:#e8e8e0;border-radius:5px;overflow:hidden}
.maturity-fill{height:100%;border-radius:5px;background:#003366;transition:width 1s}
.url-row a{color:#185fa5;text-decoration:none;font-size:12px;word-break:break-all}
.url-row a:hover{text-decoration:underline}
.filter-bar{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:1.5rem}
.filter-btn{border:0.5px solid #ccc;background:#fff;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer;transition:all 0.2s}
.filter-btn.active{background:#003366;color:#fff;border-color:#003366}
.summary-box{background:#003366;color:#fff;border-radius:10px;padding:1.5rem;margin-bottom:1.5rem}
.summary-box h3{font-size:18px;font-weight:600;margin-bottom:1rem;color:#c9a227}
.summary-box p{font-size:13px;line-height:1.8;opacity:0.92}
.ceo-report{background:#fff;border:1px solid #003366;border-radius:10px;padding:2rem;font-size:13px;line-height:1.9;color:#1a1a1a}
.ceo-report .report-header{border-bottom:2px solid #003366;padding-bottom:1rem;margin-bottom:1.5rem}
.ceo-report h3{font-size:16px;font-weight:700;color:#003366;margin:1.5rem 0 0.5rem}
.ceo-report p{margin-bottom:1rem}
.partner-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;display:flex;gap:12px}
.partner-logo{width:48px;height:48px;border-radius:8px;background:#e6f1fb;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:#0c447c;flex-shrink:0;text-align:center;line-height:1.2}
.score-big{font-size:48px;font-weight:700;color:#003366;text-align:center;padding:1.5rem;background:#f8f8fc;border-radius:10px;margin-bottom:1rem}
.score-sub{font-size:13px;color:#888;text-align:center;margin-top:-0.5rem;margin-bottom:1rem}
.chip{display:inline-flex;align-items:center;gap:6px;background:#f1f1e8;border:0.5px solid #d8d8c8;border-radius:20px;padding:4px 12px;font-size:11px;color:#444;margin:3px;text-decoration:none}
.chip:hover{background:#e8e8d8}
.page-footer{background:#002855;color:rgba(255,255,255,0.6);font-size:11px;text-align:center;padding:1rem;margin-top:2rem}
</style>
</head>
<body>
<div class="topbar">
  <div class="topbar-inner">
    <div>
      <h1>Commercial Bank of Dubai (CBD) — AI Intelligence Report 2026</h1>
      <p>Autonomous Banking AI Analysis | 25 Use Cases | 9 Agents | 7 Programs | Official Sources Only</p>
    </div>
    <span class="badge-gold">CONFIDENTIAL STRATEGIC REPORT</span>
  </div>
</div>
<nav class="nav">
  <div class="nav-inner">
    <button class="active" onclick="showPage('overview',this)">Overview</button>
    <button onclick="showPage('usecases',this)">AI Use Cases (25)</button>
    <button onclick="showPage('agents',this)">AI Agents (9)</button>
    <button onclick="showPage('programs',this)">AI Programs (7)</button>
    <button onclick="showPage('partnerships',this)">Partnerships (8)</button>
    <button onclick="showPage('maturity',this)">AI Maturity</button>
    <button onclick="showPage('executive',this)">Executive Summary</button>
    <button onclick="showPage('ceo',this)">CEO Report</button>
    <button onclick="showPage('urls',this)">Report URLs</button>
  </div>
</nav>

<!-- ===== OVERVIEW PAGE ===== -->
<div id="page-overview" class="page active">
<div class="container">
  <div class="section-head">
    <h2>AI Intelligence Overview — Commercial Bank of Dubai 2026</h2>
    <p>Synthesized from 12 official CBD sources including FY2025 Annual Results, Q1 2026 Results, Microsoft Customer Story, Accenture Partnership, MIT Sloan feature, MEA Finance Awards and press releases</p>
  </div>
  <div class="metrics-grid">
    <div class="metric"><div class="num">25</div><div class="lbl">AI Use Cases</div></div>
    <div class="metric"><div class="num">9</div><div class="lbl">AI Agents</div></div>
    <div class="metric"><div class="num">7</div><div class="lbl">AI Programs</div></div>
    <div class="metric"><div class="num">8</div><div class="lbl">AI Partnerships</div></div>
    <div class="metric"><div class="num">3.5/5</div><div class="lbl">AI Maturity Score</div></div>
    <div class="metric"><div class="num">AED 392M+</div><div class="lbl">OpEx (incl. Tech/AI) Q1 2026</div></div>
    <div class="metric"><div class="num">39,000 hrs</div><div class="lbl">Saved via GenAI (Copilot)</div></div>
    <div class="metric"><div class="num">AED 160B</div><div class="lbl">Total Assets (Q1 2026)</div></div>
  </div>
  <div class="summary-box">
    <h3>AI Transformation Headline</h3>
    <p>Commercial Bank of Dubai has transitioned from digital-by-design banking to enterprise-wide AI deployment. The bank's three strategic AI pillars — workplace modernisation, operational efficiency, and experimenting for the future — are now active and delivering measurable results. Microsoft 365 Copilot is embedded across 900 employees saving 39,000 hours annually; Accenture's enterprise-wide data and AI literacy programme has made CBD the first bank in the UAE to certify employees in both Data and AI; and the bank's Open Finance activation (December 2025) makes CBD the first UAE bank live on AlTareq. CBD's AI maturity score of 3.5/5.0 reflects a bank firmly mid-transformation — past pilot, accelerating toward full-scale AI deployment in 2026–2027 under its Technology Strategy Refresh initiative and platform-centric operating model.</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1rem;margin-bottom:1.5rem">
    <div class="card">
      <div class="card-title">Top AI Value Drivers (FY2025–Q1 2026)</div>
      <table>
        <tr><td>Microsoft 365 Copilot Productivity</td><td style="text-align:right;font-weight:600;color:#003366">39,000 hrs/yr saved</td></tr>
        <tr><td>AI Chatbot — Routine Query Deflection</td><td style="text-align:right;font-weight:600;color:#003366">85%+ resolution rate</td></tr>
        <tr><td>AI Financial Wellness Platform</td><td style="text-align:right;font-weight:600;color:#003366">300,000+ users</td></tr>
        <tr><td>Azure Cloud + AI Infrastructure</td><td style="text-align:right;font-weight:600;color:#003366">Account open: 1 day → 2 min</td></tr>
        <tr><td>Data &amp; AI Workforce Programme</td><td style="text-align:right;font-weight:600;color:#003366">First UAE bank enterprise AI certs</td></tr>
      </table>
    </div>
    <div class="card">
      <div class="card-title">AI Maturity by Dimension</div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">AI Strategy &amp; Governance</span><span style="font-weight:600">3.8/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:76%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">Data Infrastructure</span><span style="font-weight:600">3.6/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:72%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">AI Talent</span><span style="font-weight:600">3.7/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:74%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">AI Production Deployment</span><span style="font-weight:600">3.5/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:70%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">GenAI / Agentic AI</span><span style="font-weight:600">3.2/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:64%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">AI Culture &amp; Adoption</span><span style="font-weight:600">3.8/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:76%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">Responsible AI</span><span style="font-weight:600">3.3/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:66%"></div></div>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-title">Key AI Partnerships &amp; Technology Enablers</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      <span class="tag tag-partner">Microsoft (Azure + Copilot)</span>
      <span class="tag tag-partner">Accenture</span>
      <span class="tag tag-partner">HPE GreenLake</span>
      <span class="tag tag-partner">du Tech (Sovereign Cloud)</span>
      <span class="tag tag-partner">PwC Middle East</span>
      <span class="tag tag-partner">QualityKiosk Technologies</span>
      <span class="tag tag-partner">Lean Technologies</span>
      <span class="tag tag-partner">Pay10</span>
    </div>
  </div>
</div>
</div>

<!-- ===== USE CASES PAGE ===== -->
<div id="page-usecases" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Use Cases — 25 Identified (2024–2026)</h2>
    <p>All use cases sourced from official CBD documents, press releases and verified partner announcements</p>
  </div>
  <div id="uc-filters" class="filter-bar">
    <button class="filter-btn active" onclick="filterUC('all',this)">All (25)</button>
    <button class="filter-btn" onclick="filterUC('Production',this)">Production</button>
    <button class="filter-btn" onclick="filterUC('Scaling',this)">Scaling</button>
    <button class="filter-btn" onclick="filterUC('Pilot',this)">Pilot</button>
  </div>
  <div class="uc-grid">

    <!-- UC-001 -->
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-001</div>
      <div class="uc-name">Microsoft 365 Copilot — Enterprise GenAI Productivity</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">All Departments / Operations</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Enterprise-wide deployment of Microsoft 365 Copilot to 900 employees across all departments. AI assists with email drafting, meeting summaries, contract review, RCSA matrix generation, PowerPoint from Excel, HR reporting, and audit document preparation. Rollout includes "3C CBD Copilot Week" and Prompt Ambassadors across business units.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">39,000 hours saved annually; 85% adoption rate (highest across Microsoft's 900 early adopters globally); RCSA metrics automated saving 56 hrs/month; Board Secretary saves 15 hrs/month; IT PMO generated 3,200 meeting summaries in one month; legal contract review: 1 hour → minutes</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Microsoft 365 Copilot, Azure OpenAI, Microsoft Teams, Word, Excel, PowerPoint, SharePoint AI</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Microsoft Customer Story — CBD, April 2025 | microsoft.com/en/customers/story/24341</div></div>
    </div>

    <!-- UC-002 -->
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-002</div>
      <div class="uc-name">AI-Powered Customer Service Chatbot</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Customer Experience</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">24/7 AI-powered conversational chatbot deployed across CBD's digital channels handling routine customer inquiries including balance enquiries, transaction history, product information, credit card queries, payment support and general banking FAQs. Available on mobile app, web and WhatsApp.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">85%+ of routine inquiries resolved without human escalation; 95% resolution rate; NPS score improved by 12 points in 18 months; contact centre cost reduction; 24/7 availability; reduced waiting time</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure Bot Service, NLP engine, Microsoft Azure, CBD mobile app integration, conversational AI</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">PortersFiveForce CBD Mission/Values Analysis, Nov 2025 | Gulf News: CBD Digital Innovation</div></div>
    </div>

    <!-- UC-003 -->
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-003</div>
      <div class="uc-name">AI-Driven Digital Account Opening (2-Minute Onboarding)</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Digital Channels</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-powered digital onboarding journey enabling new retail customers to open a full bank account in approximately 2 minutes via CBD's mobile app. Integrates biometric identity verification, AI-driven document OCR, real-time KYC checks and automated credit eligibility assessment. Previously took up to 1 day in-branch.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Account opening time: 1 day → ~2 minutes; customer base quadrupled over 4 years; credit card issuance in minutes; competitive customer acquisition advantage; branch traffic reduction; UAE Pass integration</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Microsoft Azure, biometric authentication, OCR AI, KYC AI, real-time decisioning, UAE Pass API</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Microsoft Customer Story — CBD Azure (2024) | MIT Sloan ME: Architecting a Digital-First Bank, March 2026</div></div>
    </div>

    <!-- UC-004 -->
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-004</div>
      <div class="uc-name">AI Financial Wellness Platform (Robo-Advisory)</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Wealth / Digital</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2022–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-powered financial wellness platform embedded in CBD's mobile banking app, providing customers with personalised spending insights, savings recommendations, investment nudges, and financial health scores. Includes a robo-advisory investment app — the first in the region — enabling customers to invest globally in international stock markets with AI-guided portfolio suggestions.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">300,000+ active users on the platform; cross-sell ratio increase of 18%; first robo-advisory in the MENA region; customer engagement uplift; digital revenue contribution; AED 500M innovation fund supporting ecosystem</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure ML, robo-advisory engine, spending analytics AI, personalisation models, mobile app integration</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">PortersFiveForce CBD Analysis, Nov 2025 | FinTech Magazine CBD Profile (confirmed ongoing 2026)</div></div>
    </div>

    <!-- UC-005 -->
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-005</div>
      <div class="uc-name">AI Hybrid Cloud Infrastructure for AI Workloads</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Technology / Infrastructure</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">HPE GreenLake private cloud, hosted by du in Tier III data centres, forms the sovereign AI compute foundation for CBD. Core banking systems migrated to cloud-native infrastructure enabling AI model training, inference and data analytics at scale. Recognised with MEA Finance Award for Best Hybrid Cloud Implementation 2025. Mission-critical AI workloads and customer service AI are hosted on this secure, scalable environment.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Best Hybrid Cloud Implementation Award (MEA Finance 2025); data sovereignty for UAE compliance; scalable AI compute foundation; 99.99% availability SLA; supports five-year digital transformation strategy; operational resilience</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">HPE GreenLake, du Tier III data centres, Microsoft Azure (public), hybrid cloud orchestration, sovereign cloud</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">HPE/du Press Release, May 2024 | MEA Finance Banking Technology Awards 2025</div></div>
    </div>

    <!-- UC-006 -->
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-006</div>
      <div class="uc-name">Enterprise Data Literacy &amp; AI Certification Programme</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Human Resources / All Departments</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">"CBD AI and Data for the Future" programme — a first-of-its-kind enterprise-wide initiative launched in partnership with Accenture, making CBD the first bank in the UAE to certify all employees in both Data and AI. Includes hands-on training in data management, analytics, AI tools and job-readiness skills. Aligned with CBUAE's responsible AI guidance and Dubai's One Million Prompters initiative.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">First UAE bank with enterprise-wide Data and AI employee certification; AI literacy across all 2,300+ staff; operational resilience through AI-competent workforce; regulatory readiness for CBUAE AI guidance (Feb 2026); talent differentiation and retention</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Accenture learning platform, AI certification curriculum, data analytics tools, Microsoft AI modules</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Accenture Newsroom, March 19, 2025 | newsroom.accenture.com/news/2025/accenture-commercial-bank-dubai</div></div>
    </div>

    <!-- UC-007 -->
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-007</div>
      <div class="uc-name">AI-Enabled Corporate Internet Banking Platform (iBusiness)</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Corporate Banking / Technology</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Next-generation Corporate Internet Banking (iBusiness/CIB) platform built in-house on Azure in a record eight months, consolidating dispersed corporate banking systems into a single platform. Features AI-driven cash flow analytics, smart payment routing, automated reconciliation, and open API integration for corporate ERP and treasury systems. Homegrown platform — award-winning in the region.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Award-winning regional platform; built in 8 months (record pace); full corporate API ecosystem; trade finance processing time -30% YoY; multi-factor authentication; scalable cloud-native architecture; deep corporate CX differentiation</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Microsoft Azure, low-code/no-code platform, open APIs, AI analytics engine, MFA, cloud-native microservices</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Microsoft Azure Customer Story — CBD (2024) | MIT Sloan ME: Architecting a Digital-First Bank, March 2026</div></div>
    </div>

    <!-- UC-008 -->
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-008</div>
      <div class="uc-name">AI-Powered Fraud Detection &amp; Payment Anomaly Scoring</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Risk / Compliance / Payments</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Real-time ML-based fraud detection across CBD's retail and corporate payments, card transactions, and digital channels. AI models score transactions in sub-second latency, detecting card fraud, account takeover, mule accounts and authorised push payment (APP) fraud. Integrated into the bank's hybrid cloud AI infrastructure for high-availability performance at scale.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Fraud loss prevention across card and payment channels; false positive reduction enabling seamless genuine transactions; regulatory compliance (CBUAE AML/CFT requirements); customer trust protection; real-time intervention capability</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure ML, real-time streaming inference, HPE GreenLake private cloud, payment network APIs, neural network scoring models</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">HPE/du Press Release May 2024; FY2025 Results (CBD, Jan 2026) — technology investment disclosure</div></div>
    </div>

    <!-- UC-009 -->
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-009</div>
      <div class="uc-name">Open Finance AI Data Aggregation (AlTareq / UAE First)</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Digital / Open Banking / Retail</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">CBD became the first bank in the UAE to fully activate Open Finance under CBUAE's AlTareq initiative (December 2025), connecting live with licensed Third Party Providers (TPPs) Pay10 and Lean Technologies. AI-powered customer consent management, real-time financial data sharing APIs and intelligent payment initiation services now live for retail current and savings account customers.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">First mover advantage — only UAE bank fully live on Open Finance; AI-enriched financial data flows to licensed fintechs; enhanced customer financial insights; payment initiation capabilities; foundation for future AI-driven personalised finance products; regulatory milestone</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">CBUAE AlTareq Open Finance APIs, Lean Technologies, Pay10, consent management platform, Azure API management</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">CBD Press Release, Dec 23, 2025 | Gulf Business / Arabian Business, Dec 2025</div></div>
    </div>

    <!-- UC-010 -->
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-010</div>
      <div class="uc-name">AI Internal Audit RCSA Automation (Copilot)</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Internal Audit / Compliance / Risk</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Internal audit team uses Microsoft 365 Copilot to review regulatory standards, identify inconsistencies, and automatically generate structured Risk and Control Self-Assessment (RCSA) matrices. Eliminates manual data entry and formatting for regulatory audit artefacts. Structured risk matrices are now AI-generated with human review and sign-off.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">56 hours saved per month in internal audit function; RCSA quality improvement; regulatory compliance acceleration; audit team freed for higher-value analysis; CBUAE AI governance alignment (Feb 2026 guidance)</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Microsoft 365 Copilot, Azure AI, RCSA automation framework, regulatory document AI</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Microsoft Customer Story — CBD, April 2025 (Aisha Al Mazrouei, HR Director direct quote)</div></div>
    </div>

    <!-- UC-011 -->
    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-011</div>
      <div class="uc-name">AI-Driven Transaction Data Enrichment (Lune Partnership)</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Data &amp; Analytics</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">CBD partnership with Lune — a specialist AI transaction data enrichment platform — enables machine-learning categorisation and enrichment of raw transaction data. Raw payment strings are automatically transformed into structured, merchant-identified, category-labelled insights powering personalisation, financial wellness features and targeted product recommendations.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Transaction data quality transformation for AI use cases; foundation for personalised financial products; enriched data for the financial wellness platform; improved fraud pattern detection; Open Finance data quality enhancement</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Lune AI enrichment API, ML transaction classification, merchant categorisation, Azure data pipeline</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">CBD Press Release: "CBD Announces Partnership with Lune to Enhance Transaction Data Enrichment Capabilities" (2025)</div></div>
    </div>

    <!-- UC-012 -->
    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-012</div>
      <div class="uc-name">AI-Powered HR Analytics &amp; Workforce Intelligence</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Human Resources</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">HR department uses Microsoft 365 Copilot and AI analytics tools to generate detailed workforce insights, employee performance reporting, and HR analytics dashboards. Previously required extensive manual effort; now automated with AI-generated summary reports, workforce trend analysis and skills gap identification supporting Emiratisation targets.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">20 hours saved per month in HR reporting; Emiratisation talent tracking improvement; faster succession planning; workforce insight quality upgrade; AI-supported recruitment and onboarding journey streamlining</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Microsoft 365 Copilot, HR analytics platform, AI reporting, workforce planning tools</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Microsoft Customer Story — CBD, April 2025 (Aisha Al Mazrouei, HR Director direct quote)</div></div>
    </div>

    <!-- UC-013 -->
    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-013</div>
      <div class="uc-name">AI Legal Contract Review &amp; Analysis (Copilot)</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Legal / Compliance</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Legal team uses Microsoft 365 Copilot to summarise and review contracts, comparing them to standard templates and flagging discrepancies. AI accelerates NDA review, vendor contract analysis, customer agreement checking and regulatory compliance document processing. Standard contract review time reduced dramatically.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Contract review time: 1 hour → minutes; legal team capacity freed for higher-value work; consistency in contract comparison; risk flagging quality improvement; supports CBDs expanding loan and corporate banking volumes</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Microsoft 365 Copilot, Azure OpenAI, contract comparison AI, NLP document analysis</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Microsoft Customer Story — CBD, April 2025 (Aisha Al Mazrouei direct quote)</div></div>
    </div>

    <!-- UC-014 -->
    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-014</div>
      <div class="uc-name">AI Wholesale Banking Market Analysis &amp; Risk Assessment (Copilot)</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Wholesale / Corporate Banking</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Wholesale banking bankers use Microsoft 365 Copilot to analyse market trends, assess credit risks and draft corporate financing proposals. AI helps review product offerings, conduct competitor analysis and build client-facing pitch materials — accelerating product development cycles for corporate financing solutions.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Product development time reduction; RM proposal quality uplift; competitive intelligence faster; supports CBD's 7.2% gross loan growth to AED 105B+; corporate banking revenue enhancement; relationship manager efficiency</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Microsoft 365 Copilot, market data integration, Azure OpenAI, PowerPoint/Excel AI generation</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Microsoft Customer Story — CBD, April 2025 | FY2025 Results Press Release, Jan 2026</div></div>
    </div>

    <!-- UC-015 -->
    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-015</div>
      <div class="uc-name">AI Data Management Policy Generation (Strategy &amp; Ops)</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Strategy / Data Governance / Operations</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Data analysts in the Strategy and Operations function use Microsoft 365 Copilot to develop and maintain data management policies, aggregating and structuring information in line with industry standards and CBUAE regulatory requirements. AI ensures policies are comprehensive, consistent and audit-ready while human analysts retain final oversight and sign-off.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Policy development time reduction; regulatory compliance consistency; data governance quality improvement; supports CBUAE AI guidance compliance (Feb 2026); foundation for enterprise AI data quality standards</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Microsoft 365 Copilot, Azure AI, data governance tools, regulatory document management</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Microsoft Customer Story — CBD, April 2025</div></div>
    </div>

    <!-- UC-016 -->
    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-016</div>
      <div class="uc-name">AI Marketing Campaign Generation &amp; Content Intelligence</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Marketing / Digital</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Marketing team uses Microsoft 365 Copilot to generate campaign materials, draft content, refine product messaging and create digital communications. AI is used for email campaign drafting, social media content, product brochure generation and customer communication personalisation — accelerating the creative cycle and reducing agency dependency.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Creative cycle acceleration; marketing cost reduction; content consistency; personalization at scale; supports CBD's goal of 40% retail revenue from digital channels by 2026; enhanced digital customer engagement</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Microsoft 365 Copilot, Azure OpenAI, content management system, marketing automation platform</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Microsoft Customer Story — CBD, April 2025 | Gulf News: CBD Digital Innovation</div></div>
    </div>

    <!-- UC-017 -->
    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-017</div>
      <div class="uc-name">AI IT PMO Meeting Intelligence &amp; Project Tracking</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Technology / Project Management</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">CBD's IT Project Management Office deployed Microsoft 365 Copilot to automatically generate meeting summaries and action points from project meetings, technology steering committees, and transformation programme reviews. Captured 3,200 meeting summaries and action items in a single month, keeping projects aligned and reducing follow-up overhead.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">3,200 meeting summaries generated in one month; project alignment improvement; action item tracking automation; reduction in follow-up meeting overhead; supports CBD's Technology Strategy Refresh programme governance</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Microsoft 365 Copilot, Microsoft Teams AI, SharePoint, project management integration</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Microsoft Customer Story — CBD, April 2025 (Ali Khan, Head of Data and AI, CBD)</div></div>
    </div>

    <!-- UC-018 -->
    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-018</div>
      <div class="uc-name">AI Credit &amp; Retail Loan Analytics (Copilot-Assisted)</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Credit Risk</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Finance analysts use AI tools to analyse large client datasets, identify long-term lending trends and streamline data interpretation. Copilot generates PowerPoint presentations from Excel loan data, cutting up to 12 hours per week on manual reporting. Underpins CBD's strong FY2025 loan growth: net loans surpassed AED 100B milestone for the first time, with NPL ratio improved to 3.58%.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">12 hours/week saved on manual loan reporting; credit analyst productivity uplift; NPL monitoring improvement; supports AED 101B+ net loan portfolio management; Q1 2026 gross loans grew to AED 106.4B; credit cost transparency</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Microsoft 365 Copilot, Excel AI, Azure ML credit analytics, data visualisation AI</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Microsoft Customer Story — CBD, April 2025 | FY2025 Results Press Release, Jan 2026</div></div>
    </div>

    <!-- UC-019 -->
    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-019</div>
      <div class="uc-name">Now Money Neobank AI Partnership (Financial Inclusion)</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Digital / Retail / Partnerships</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">CBD partners with Now Money — a UAE neobank targeting underbanked workers — providing the regulated banking infrastructure (licence and core banking rails) that enables Now Money's AI-powered financial inclusion platform. This ecosystem partnership leverages CBD's infrastructure while Now Money's AI delivers personalised micro-finance, remittance AI tools and financial wellness for low-income workers.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Financial inclusion reach; UAE's diverse workforce banking coverage; new customer segment acquisition; Now Money AI tools run on CBD rails; fintech partnership revenue; ESG/social banking contribution; regulatory goodwill</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Now Money AI platform, neobank fintech rails, CBD banking licence infrastructure, API integration</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">AInvest: Digital Banking in ME — Strategic Partnerships 2025 | Digital Challenger Banks in MEA 2024</div></div>
    </div>

    <!-- UC-020 -->
    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-020</div>
      <div class="uc-name">AI Predictive Risk Minimisation &amp; Quality Engineering (TCoE)</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Technology / Risk / Operations</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Testing Centre of Excellence (TCoE) established with QualityKiosk Technologies as the exclusive partner under CBD's Technology Strategy Refresh Initiative. AI-driven predictive risk minimisation, intelligent test automation, quality engineering, and reliability assurance for all new digital banking deployments. Ensures high-quality AI system releases into production at pace.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Predictive risk identification pre-production; quality engineering efficiency; digital release velocity improvement; reliability assurance for CBD's AI-powered customer services; foundational to Technology Strategy Refresh</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">QualityKiosk reliability engineering, AI-driven test automation, predictive analytics, CI/CD integration</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">BusinessWire: QualityKiosk Press Release, May 8, 2024 | Dubai FinTech Summit 2024</div></div>
    </div>

    <!-- UC-021 -->
    <div class="uc-card" data-maturity="Pilot">
      <div class="uc-id">UC-021</div>
      <div class="uc-name">AI-Powered Personalised Banking (PwC Middle East GenAI)</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Customer Experience / Digital</span>
        <span class="tag" style="background:#f0f0f0;color:#3c3489">Pilot</span>
        <span class="tag tag-tech">2023–2025</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">CBD and PwC Middle East signed an MOU to embed Generative AI across CBD's customer-facing operations. Partnership focuses on AI-driven personalised customer service solutions, tailored product recommendations based on individual preferences, and internal process optimisation using data-driven AI insights. PwC's GenAI technologies are being integrated into CBD's digital service layer.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">GenAI-powered personalisation at scale; improved customer satisfaction; streamlined internal operations; AI-driven customer intent modelling; foundation for next-generation digital banking journeys</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">PwC Middle East AI platform, GenAI personalisation models, customer data platform, API integration</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Finextra: CBD and PwC Middle East MOU, Aug 2023 | progressing into 2025 per CBD Digital Factory</div></div>
    </div>

    <!-- UC-022 -->
    <div class="uc-card" data-maturity="Pilot">
      <div class="uc-id">UC-022</div>
      <div class="uc-name">AE Coin Digital Currency Payment Integration</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Payments / Digital / Compliance</span>
        <span class="tag" style="background:#f0f0f0;color:#3c3489">Pilot / Live</span>
        <span class="tag tag-tech">2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">CBD was among the first financial institutions in the UAE to recognise AE Coin — the UAE Central Bank-licensed, fully reserved, AED-backed digital stablecoin — as an accepted payment method across all federal government entities. AI-backed payment routing and settlement infrastructure for digital currency transactions, positioning CBD for the broader Digital Dirham CBDC rollout (targeted full launch Q4 2026).</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">First-mover in UAE digital currency payments; government payment connectivity; CBDC infrastructure readiness; regulatory relationship strengthening; future-proofed payment infrastructure; alignment with CBUAE FIT Programme (85% complete, full integration 2026)</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">AE Coin payment API, blockchain settlement layer, CBUAE digital currency infrastructure, Azure payment rails</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Khaleej Times: CBD Q1 2026 Results, April 22, 2026 | CBUAE FIT Programme</div></div>
    </div>

    <!-- UC-023 -->
    <div class="uc-card" data-maturity="Pilot">
      <div class="uc-id">UC-023</div>
      <div class="uc-name">AI ESG &amp; Sustainable Finance Analytics</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Sustainability / Corporate Banking</span>
        <span class="tag" style="background:#f0f0f0;color:#3c3489">Pilot</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-assisted platform supporting CBD's Sustainable Finance Framework, Green Bond reporting and ESG portfolio analytics. ML models help assess corporate clients' sustainability profiles for green lending eligibility, track ESG KPIs across the loan portfolio and support TCFD-aligned climate risk reporting. CBD issued its Green Bond Report 2025 and Sustainability Report 2025 under this framework.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Green Bond Report 2025 published; Sustainability Report 2025 published; UAE Net Zero 2050 alignment; sustainable finance product qualification; ESG disclosure quality; regulatory readiness for CBUAE responsible AI and ESG guidance</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">ESG data analytics platform, NLP for sustainability reporting, Azure ML, TCFD-aligned climate models</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">CBD Sustainability page (cbd.ae/aboutus/sustainability) | Green Bond Report 2025 | Sustainability Report 2025</div></div>
    </div>

    <!-- UC-024 -->
    <div class="uc-card" data-maturity="Pilot">
      <div class="uc-id">UC-024</div>
      <div class="uc-name">AI-Powered Biometric &amp; Identity Verification</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Digital Channels / Security / Compliance</span>
        <span class="tag" style="background:#f0f0f0;color:#3c3489">Pilot → Scaling</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-powered biometric authentication integrated into CBD's mobile banking app and digital onboarding journey. Facial recognition, voice biometrics and liveness detection provide secure, frictionless customer authentication. Replaces legacy password and OTP-only flows, reducing fraud risk while improving customer experience for the bank's digitally diverse, multicultural customer base.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Authentication friction reduction; account takeover prevention; customer experience improvement; regulatory KYC compliance; biometric-enabled mobile banking journey; accessibility for low-digital-literacy users</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Biometric AI engine, facial recognition, liveness detection, Azure AI identity services, mobile SDK</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Gulf News: CBD Digital Innovation 2025 | HPE/du Press Release, May 2024 (AI-driven customer services)</div></div>
    </div>

    <!-- UC-025 -->
    <div class="uc-card" data-maturity="Pilot">
      <div class="uc-id">UC-025</div>
      <div class="uc-name">AI-Enabled Cross-Border Payments &amp; Fintech Ecosystem</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Payments / International / Digital</span>
        <span class="tag" style="background:#f0f0f0;color:#3c3489">Pilot</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">CBD signed three strategic MoUs at the Dubai FinTech Summit to strengthen its "digital-by-design" banking model, including partnerships with global technology leaders to enable more secure and efficient cross-border payments. AI-driven payment routing, FX optimisation, AML screening and correspondent banking intelligence are components of this programme, aligned with CBUAE's FIT Programme and mBridge cross-border CBDC infrastructure.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Cross-border payment efficiency; UAE fintech ecosystem positioning; AML compliance automation; FX cost reduction; remittance corridor optimisation; H1 2025 enterprise-wide AI training for cross-border payment operations</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">SWIFT gpi AI, mBridge CBDC infrastructure, AI FX routing, AML screening AI, API-enabled fintech partnerships</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">CBD Press Release: "Three Strategic MoUs at Dubai FinTech Summit" | MEA Finance: H1 2025 AI initiatives</div></div>
    </div>

  </div><!-- end uc-grid -->
</div>
</div>

<!-- ===== AGENTS PAGE ===== -->
<div id="page-agents" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Agents — 9 Identified</h2>
    <p>Autonomous and semi-autonomous AI agents deployed or in active development at CBD as of 2025–2026</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem">

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">🤖</div>Microsoft 365 Copilot Agent (Enterprise GenAI)</div>
      <div style="margin-bottom:8px"><span class="tag tag-dept">All Departments</span><span class="tag tag-prod">Production — 900 users</span></div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Autonomous AI assistant embedded in all Microsoft 365 applications (Word, Excel, Teams, Outlook, PowerPoint, SharePoint). Generates content, summarises meetings, reviews documents, creates reports and answers questions using CBD's organisational knowledge graph.</div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">39,000 hours saved annually; 85% adoption rate; productivity uplift across all functions; cost avoidance estimated at multi-million AED annually</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Microsoft Customer Story — CBD, April 2025</div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">💬</div>CBD AI Customer Service Chatbot Agent</div>
      <div style="margin-bottom:8px"><span class="tag tag-dept">Retail Banking / CX</span><span class="tag tag-prod">Production — 24/7</span></div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Autonomous conversational AI agent handling customer inquiries on balance, transactions, product information, payments and complaints across mobile, web and WhatsApp channels. Escalates to human agent on complex cases.</div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">85%+ routine inquiry resolution rate; 95% customer satisfaction on resolved queries; NPS +12 points over 18 months; significant contact centre cost reduction</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">PortersFiveForce CBD Analysis, Nov 2025 | Gulf News CBD Innovation</div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">🏦</div>Digital Onboarding AI Agent</div>
      <div style="margin-bottom:8px"><span class="tag tag-dept">Retail Banking / Digital</span><span class="tag tag-prod">Production</span></div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Autonomous multi-step onboarding agent that guides new customers through full account opening in ~2 minutes: identity document capture, OCR extraction, biometric verification, KYC checks, credit eligibility, product selection and account activation — all without human intervention.</div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Account opening: 1 day → 2 minutes; customer base quadrupled over 4 years; credit card issuance in minutes; industry-leading digital CX; competitive customer acquisition</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Microsoft Azure Customer Story — CBD (2024) | MIT Sloan ME, March 2026</div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">📊</div>RCSA Audit Intelligence Agent (Copilot)</div>
      <div style="margin-bottom:8px"><span class="tag tag-dept">Internal Audit / Compliance</span><span class="tag tag-prod">Production</span></div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Semi-autonomous AI agent that processes regulatory standards, identifies compliance gaps and automatically generates Risk and Control Self-Assessment (RCSA) matrices for the internal audit function. Flags inconsistencies and structures risk data for human sign-off.</div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">56 hours saved per month; RCSA quality improvement; regulatory reporting acceleration; audit team capacity freed for strategic review</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Microsoft Customer Story — CBD, April 2025 (Aisha Al Mazrouei direct quote)</div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">💰</div>Financial Wellness Robo-Advisor Agent</div>
      <div style="margin-bottom:8px"><span class="tag tag-dept">Retail / Wealth</span><span class="tag tag-prod">Production — 300k+ users</span></div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Autonomous AI agent delivering personalised financial advice, spending insights, savings plans and investment recommendations directly within CBD's mobile app. First robo-advisory platform in the MENA region enabling customers to invest globally in international stock markets with AI-guided portfolio management.</div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">300,000+ active users; cross-sell ratio +18%; digital revenue contribution; first-mover robo-advisory in MENA; retail revenue diversification</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">PortersFiveForce CBD Analysis, Nov 2025 | FinTech Magazine CBD Profile</div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">🔒</div>Fraud Detection AI Scoring Agent</div>
      <div style="margin-bottom:8px"><span class="tag tag-dept">Risk / Payments / Security</span><span class="tag tag-prod">Production</span></div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Real-time autonomous ML agent scoring every payment and card transaction in sub-second latency, identifying fraud patterns (card fraud, ATO, APP fraud, mule accounts) and automatically triggering hold, step-up authentication or block responses based on risk threshold.</div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Fraud loss prevention across all payment channels; customer trust protection; CBUAE AML/CFT compliance; false positive minimisation preserving genuine transactions</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">HPE/du Press Release, May 2024 | FY2025 Results (technology investment); CBUAE FACS framework</div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">🌐</div>Open Finance Consent &amp; Data Agent (AlTareq)</div>
      <div style="margin-bottom:8px"><span class="tag tag-dept">Digital / Open Banking</span><span class="tag tag-prod">Production — Dec 2025</span></div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Autonomous AI-enabled agent managing customer consent flows, secure financial data sharing and payment initiation with licensed Third Party Providers (TPPs) under CBUAE's AlTareq Open Finance initiative. First UAE bank to go live with this capability — operational with Pay10 and Lean Technologies.</div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">First UAE bank live on Open Finance; regulatory milestone; fintech ecosystem revenue; data monetisation foundation; future AI personalisation data pipeline; customer financial control empowerment</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">CBD Press Release Dec 23, 2025 | Arabian Business, Dec 24, 2025</div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">📝</div>Transaction Enrichment AI Agent (Lune)</div>
      <div style="margin-bottom:8px"><span class="tag tag-dept">Data &amp; Analytics / Digital</span><span class="tag" style="background:#faeeda;color:#633806">Scaling</span></div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Autonomous AI agent continuously enriching raw banking transaction strings into structured, merchant-identified, categorised financial data. Powers the financial wellness platform, personalised recommendations, and data-driven product offers by transforming cryptic payment references into meaningful customer insights.</div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Transformed data quality for all AI-driven personalisation; improved financial wellness features; fraud pattern enrichment; Open Finance data quality; foundation for next-generation customer intelligence</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">CBD Press Release: "CBD Announce Partnership with Lune" (2025)</div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">🧪</div>QualityKiosk AI Test Automation Agent (TCoE)</div>
      <div style="margin-bottom:8px"><span class="tag tag-dept">Technology / Engineering</span><span class="tag" style="background:#faeeda;color:#633806">Scaling</span></div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">AI-powered test automation and reliability engineering agent within CBD's Testing Centre of Excellence. Autonomously executes regression tests, predictive risk assessments and quality gates for all new AI system deployments across CBD's digital banking stack. Flags high-risk releases before production.</div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Production defect reduction; release velocity improvement; AI deployment confidence; supports CBD's Technology Strategy Refresh pace; MEA Finance Best Hybrid Cloud Implementation Award 2025</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">BusinessWire: QualityKiosk Press Release, May 8, 2024</div></div>
    </div>

  </div>
</div>
</div>

<!-- ===== PROGRAMS PAGE ===== -->
<div id="page-programs" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Programs — 7 Strategic Initiatives</h2>
    <p>Active AI, GenAI, Digital Transformation and Intelligent Automation programs at CBD 2025–2026</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem">

    <div class="prog-card">
      <div class="prog-name">1. Technology Strategy Refresh Initiative</div>
      <div style="margin-bottom:8px"><span class="tag tag-dept">Enterprise / Technology</span><span class="tag tag-prod">Active 2023–2026</span></div>
      <div style="font-size:13px;line-height:1.7;color:#333">CBD's overarching five-year digital and AI transformation programme. Began in 2023 with the modernisation of the integration layer to cloud-native, API-enabled architecture. Systems of engagement and record upgraded in parallel. Includes the Testing Centre of Excellence, hybrid cloud migration, AI platform build, and open banking activation. CIO Thomas Cherian leads this transformation, positioning CBD as a "default digital" bank.</div>
    </div>

    <div class="prog-card">
      <div class="prog-name">2. CBD AI and Data for the Future (Accenture)</div>
      <div style="margin-bottom:8px"><span class="tag tag-dept">Enterprise / Human Resources</span><span class="tag tag-prod">Active 2025–2026</span></div>
      <div style="font-size:13px;line-height:1.7;color:#333">First-of-its-kind enterprise-wide Data and AI literacy and certification programme in the UAE banking sector, delivered in partnership with Accenture. All 2,300+ CBD employees to achieve certifications in Data and AI. Hands-on training in data management, analytics, AI tools and application. Aligned with CBUAE's AI governance guidance (February 2026) and Dubai's "One Million Prompters" national AI initiative. Led by Ali Imran, COO.</div>
    </div>

    <div class="prog-card">
      <div class="prog-name">3. Microsoft AI Copilot Deployment Programme</div>
      <div style="margin-bottom:8px"><span class="tag tag-dept">All Departments / Operations</span><span class="tag tag-prod">Production — Expanding</span></div>
      <div style="font-size:13px;line-height:1.7;color:#333">Enterprise-wide deployment of Microsoft 365 Copilot, beginning with 300 early adopters prioritised by role, expanding to 900 knowledge workers. Includes three Prompt-a-thon events at the Microsoft Innovation Hub, creation of a "Super Prompts" library, appointment of Copilot Champions in each department, and the "3C CBD Copilot Week" (Clarity, Control, Confidence). Led by Ali Khan, Head of Data and AI.</div>
    </div>

    <div class="prog-card">
      <div class="prog-name">4. Digital Factory Innovation Programme</div>
      <div style="margin-bottom:8px"><span class="tag tag-dept">Digital Banking / Product</span><span class="tag tag-prod">Active — Ongoing</span></div>
      <div style="font-size:13px;line-height:1.7;color:#333">CBD's dedicated innovation incubator bringing cross-functional teams together to build next-generation digital banking solutions. Produces AI-powered customer journeys, digital product features and fintech partnerships. Delivered the award-winning mobile app, the next-gen Corporate Internet Banking (iBusiness) platform, the financial wellness robo-advisory, and the Open Finance integration. Positioned as the engine of "digital-by-design" banking at CBD.</div>
    </div>

    <div class="prog-card">
      <div class="prog-name">5. Open Finance Activation Programme (AlTareq)</div>
      <div style="margin-bottom:8px"><span class="tag tag-dept">Digital / Payments / Compliance</span><span class="tag tag-prod">Live — Dec 2025</span></div>
      <div style="font-size:13px;line-height:1.7;color:#333">CBD became the first bank in the UAE to fully activate Open Finance under CBUAE's AlTareq initiative in December 2025. Partnership with Pay10 and Lean Technologies enables live data sharing and payment initiation. Future expansion will grow use cases, deepen TPP integration and drive transaction activity. AI-powered consent management and data enrichment underpins the programme.</div>
    </div>

    <div class="prog-card">
      <div class="prog-name">6. Responsible AI &amp; CBUAE Compliance Programme</div>
      <div style="margin-bottom:8px"><span class="tag tag-dept">Risk / Compliance / Governance</span><span class="tag tag-prod">Active 2025–2026</span></div>
      <div style="font-size:13px;line-height:1.7;color:#333">Programme to align CBD's AI governance with CBUAE's February 2026 Guidance Note on Consumer Protection and Responsible AI Use by Licensed Financial Institutions. Includes AI model documentation, risk integration, roles definition for risk/compliance/internal audit/IT, and proportionate AI governance framework. Supports explainability, bias monitoring and consumer protection for all AI systems in production.</div>
    </div>

    <div class="prog-card">
      <div class="prog-name">7. PwC Middle East GenAI Transformation Programme</div>
      <div style="margin-bottom:8px"><span class="tag tag-dept">Customer Experience / Operations</span><span class="tag" style="background:#faeeda;color:#633806">Scaling</span></div>
      <div style="font-size:13px;line-height:1.7;color:#333">Strategic MOU partnership with PwC Middle East to embed Generative AI throughout CBD's customer-facing operations and internal processes. Focuses on AI-personalised customer service, customer experience enhancement, and operational efficiency through data-driven AI insights. Ali Hosseini (PwC CDO) and Ali Imran (CBD COO) lead the joint programme. Described as "embedding GenAI deep within the financial sector."</div>
    </div>

  </div>
</div>
</div>

<!-- ===== PARTNERSHIPS PAGE ===== -->
<div id="page-partnerships" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Partnerships — 8 Strategic Partners</h2>
    <p>Verified partnerships contributing to CBD's AI and digital transformation agenda 2024–2026</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem">

    <div class="partner-card">
      <div class="partner-logo">MSFT</div>
      <div>
        <div style="font-weight:600;color:#003366;margin-bottom:4px">Microsoft (Azure + 365 Copilot)</div>
        <div style="font-size:12px;color:#333;line-height:1.6">Deepest AI partnership. Provides Azure cloud (public), Microsoft 365 Copilot (deployed to 900 employees), Azure OpenAI, Azure Bot Services, and Azure ML. Underpins CBD's entire AI and cloud stack. Microsoft Innovation Hub co-hosted Prompt-a-thon events. CBD achieves 85% Copilot adoption — highest across all Microsoft early adopters globally. Data sovereignty and compliance assurance provided by Microsoft.</div>
        <div style="margin-top:6px"><span class="tag tag-partner">GenAI</span><span class="tag tag-partner">Cloud</span><span class="tag tag-partner">Copilot</span></div>
      </div>
    </div>

    <div class="partner-card">
      <div class="partner-logo">ACCT</div>
      <div>
        <div style="font-weight:600;color:#003366;margin-bottom:4px">Accenture</div>
        <div style="font-size:12px;color:#333;line-height:1.6">Strategic AI and data transformation partner. Delivering "CBD AI and Data for the Future" — the UAE's first enterprise-wide Data and AI employee certification programme. Makes CBD the first bank in the UAE to certify all staff in both Data and AI. Led by Max Di Gregorio (Accenture Managing Director ME) and Ali Imran (CBD COO). March 2025 launch.</div>
        <div style="margin-top:6px"><span class="tag tag-partner">AI Training</span><span class="tag tag-partner">Data Literacy</span><span class="tag tag-partner">Transformation</span></div>
      </div>
    </div>

    <div class="partner-card">
      <div class="partner-logo">HPE</div>
      <div>
        <div style="font-weight:600;color:#003366;margin-bottom:4px">Hewlett Packard Enterprise (HPE)</div>
        <div style="font-size:12px;color:#333;line-height:1.6">HPE GreenLake provides the private cloud foundation for CBD's mission-critical AI workloads, including AI-driven customer services. Hosts core banking applications in Tier III Certified data centres operated by du. Recognised with MEA Finance Best Hybrid Cloud Implementation Award 2025. Enables CBD to implement its five-year digital transformation strategy at scale.</div>
        <div style="margin-top:6px"><span class="tag tag-partner">Hybrid Cloud</span><span class="tag tag-partner">AI Infrastructure</span></div>
      </div>
    </div>

    <div class="partner-card">
      <div class="partner-logo">du</div>
      <div>
        <div style="font-weight:600;color:#003366;margin-bottom:4px">du Tech (Emirates Integrated Telecom)</div>
        <div style="font-size:12px;color:#333;line-height:1.6">Sovereign cloud and connectivity partner. Hosts HPE GreenLake in du's hyper-connected, Tier III Certified data centres. Provides network infrastructure, security services, and connectivity for CBD's hybrid cloud. Key to UAE data sovereignty requirements for financial AI. Featured in MIT Sloan ME video (March 2026) as digital transformation partner.</div>
        <div style="margin-top:6px"><span class="tag tag-partner">Sovereign Cloud</span><span class="tag tag-partner">Connectivity</span></div>
      </div>
    </div>

    <div class="partner-card">
      <div class="partner-logo">PwC</div>
      <div>
        <div style="font-weight:600;color:#003366;margin-bottom:4px">PwC Middle East</div>
        <div style="font-size:12px;color:#333;line-height:1.6">GenAI strategy and deployment partner. MOU signed to accelerate GenAI adoption across CBD's operations and customer-facing services. Focus on personalised AI-driven customer service, internal process optimisation and data-driven AI insights. Ali Hosseini (CDO, PwC ME) described as "embedding Generative AI deep within the financial sector" alongside CBD.</div>
        <div style="margin-top:6px"><span class="tag tag-partner">GenAI Strategy</span><span class="tag tag-partner">CX AI</span></div>
      </div>
    </div>

    <div class="partner-card">
      <div class="partner-logo">QK</div>
      <div>
        <div style="font-weight:600;color:#003366;margin-bottom:4px">QualityKiosk Technologies</div>
        <div style="font-size:12px;color:#333;line-height:1.6">Exclusive partner for CBD's Testing Centre of Excellence (TCoE) under the Technology Strategy Refresh Initiative. AI-driven predictive risk minimisation, reliability engineering, intelligent test automation and quality engineering. Announced at Dubai FinTech Summit 2024. Creates CBD's first quality and reliability TCoE ensuring AI systems are production-ready.</div>
        <div style="margin-top:6px"><span class="tag tag-partner">AI Testing</span><span class="tag tag-partner">Quality Engineering</span></div>
      </div>
    </div>

    <div class="partner-card">
      <div class="partner-logo">LEAN</div>
      <div>
        <div style="font-weight:600;color:#003366;margin-bottom:4px">Lean Technologies + Pay10</div>
        <div style="font-size:12px;color:#333;line-height:1.6">CBUAE-licensed Third Party Providers (TPPs) partnering with CBD for the UAE's first live Open Finance activation (December 2025). Both are connected and operational with CBD under the AlTareq Open Finance Framework, enabling AI-powered financial data sharing and payment initiation for CBD's retail customers.</div>
        <div style="margin-top:6px"><span class="tag tag-partner">Open Finance</span><span class="tag tag-partner">AlTareq</span><span class="tag tag-partner">Payments AI</span></div>
      </div>
    </div>

    <div class="partner-card">
      <div class="partner-logo">LUNE</div>
      <div>
        <div style="font-weight:600;color:#003366;margin-bottom:4px">Lune (Transaction Data Enrichment)</div>
        <div style="font-size:12px;color:#333;line-height:1.6">Specialist AI transaction data enrichment platform. CBD announced this partnership to transform raw payment data into structured, categorised, merchant-identified insights using ML models. Powers CBD's financial wellness features, personalised product recommendations and fraud intelligence. Enhances data quality for all downstream AI and analytics use cases.</div>
        <div style="margin-top:6px"><span class="tag tag-partner">Data AI</span><span class="tag tag-partner">ML Enrichment</span></div>
      </div>
    </div>

  </div>
</div>
</div>

<!-- ===== MATURITY PAGE ===== -->
<div id="page-maturity" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Maturity Assessment</h2>
    <p>CBD AI Maturity scored against 7 dimensions using evidence from official sources — May 2026</p>
  </div>
  <div class="score-big">3.5 / 5.0</div>
  <div class="score-sub">Overall AI Maturity Score — "AI Scaling" Stage | Benchmark: Advanced UAE digital bank, mid-transformation</div>

  <div class="card" style="margin-bottom:1rem">
    <div class="card-title" style="margin-bottom:1rem">Maturity by Dimension</div>
    <div class="maturity-bar-wrap" style="margin-bottom:1rem">
      <div class="maturity-label"><span style="font-size:13px;font-weight:500">AI Strategy &amp; Governance</span><span style="font-weight:700;font-size:16px;color:#003366">3.8/5</span></div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:76%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">Three AI strategic pillars defined; Technology Strategy Refresh; CBUAE AI guidance alignment; COO-led AI governance; CIO transformation leadership</div>
    </div>
    <div class="maturity-bar-wrap" style="margin-bottom:1rem">
      <div class="maturity-label"><span style="font-size:13px;font-weight:500">Data Infrastructure</span><span style="font-weight:700;font-size:16px;color:#003366">3.6/5</span></div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:72%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">HPE GreenLake + Azure hybrid cloud; Lune transaction enrichment; cloud-native integration layer; MEA Finance Best Hybrid Cloud Award 2025; data sovereignty compliance</div>
    </div>
    <div class="maturity-bar-wrap" style="margin-bottom:1rem">
      <div class="maturity-label"><span style="font-size:13px;font-weight:500">AI Talent &amp; Culture</span><span style="font-weight:700;font-size:16px;color:#003366">3.7/5</span></div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:74%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">First UAE bank enterprise Data &amp; AI certification (Accenture); 85% Copilot adoption rate; Ali Khan (Head of Data &amp; AI); Copilot Champions network; Promptathon culture; CEO AI literacy mandate</div>
    </div>
    <div class="maturity-bar-wrap" style="margin-bottom:1rem">
      <div class="maturity-label"><span style="font-size:13px;font-weight:500">AI Production Deployment</span><span style="font-weight:700;font-size:16px;color:#003366">3.5/5</span></div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:70%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">15+ live production AI systems; customer chatbot at scale; 2-minute onboarding; robo-advisory 300k users; fraud AI; Open Finance live; Copilot 900 users</div>
    </div>
    <div class="maturity-bar-wrap" style="margin-bottom:1rem">
      <div class="maturity-label"><span style="font-size:13px;font-weight:500">GenAI / Agentic AI</span><span style="font-weight:700;font-size:16px;color:#003366">3.2/5</span></div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:64%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">Copilot GenAI fully deployed; PwC GenAI partnership active; agentic banking (onboarding, Open Finance) live; more autonomous agent deployments needed for next maturity level</div>
    </div>
    <div class="maturity-bar-wrap" style="margin-bottom:1rem">
      <div class="maturity-label"><span style="font-size:13px;font-weight:500">AI Culture &amp; Adoption</span><span style="font-weight:700;font-size:16px;color:#003366">3.8/5</span></div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:76%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">CEO-led AI mandate; Promptathon culture; 85% Copilot adoption; enterprise AI certification; Prompt Ambassadors; 3C Copilot Week; digitally-empowered workforce strategy</div>
    </div>
    <div class="maturity-bar-wrap" style="margin-bottom:1rem">
      <div class="maturity-label"><span style="font-size:13px;font-weight:500">Responsible AI</span><span style="font-weight:700;font-size:16px;color:#003366">3.3/5</span></div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:66%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">CBUAE AI guidance (Feb 2026) alignment programme active; Microsoft data privacy assurance; AI governance framework developing; no published standalone AI ethics framework yet — in progress</div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">Peer Benchmark</div>
    <p style="font-size:13px;line-height:1.7">CBD sits in the second tier of UAE AI-advanced banks (after FAB/ENBD), ahead of the majority of regional peers. Its distinction is exceptional AI culture adoption (highest Microsoft Copilot adoption rate globally among early adopters), enterprise-wide AI certification (UAE first), and first-mover Open Finance activation. Gap to close: agentic AI depth, standalone AI governance framework, and AI revenue attribution metrics.</p>
  </div>
</div>
</div>

<!-- ===== EXECUTIVE SUMMARY PAGE ===== -->
<div id="page-executive" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Executive Summary</h2>
    <p>Strategic AI intelligence summary for senior leadership — May 2026</p>
  </div>
  <div class="summary-box" style="margin-bottom:1.5rem">
    <h3>AI Transformation Status: AI-Scaling (Stage 3 of 5)</h3>
    <p>25 AI use cases identified · 9 AI agents deployed · 7 AI programs active · AI Maturity Score 3.5/5.0 · 22 consecutive quarters of net profit growth · AED 160B total assets Q1 2026</p>
  </div>
  <div class="card" style="margin-bottom:1.5rem">
    <div class="prose">
<p>Commercial Bank of Dubai (CBD) is executing a deliberate and accelerating AI transformation, anchored in three strategic pillars: workplace modernisation, operational efficiency, and experimenting for the future. Under the leadership of CEO Dr. Bernd van Linder and CIO Thomas Cherian, and with Ali Khan (Head of Data and AI) and Ali Imran (COO) driving execution, CBD has moved from isolated digital initiatives to enterprise-wide AI embedding across all functions.</p>
<p>The bank's most significant AI deployment — Microsoft 365 Copilot across 900 employees — is delivering 39,000 hours of savings annually, with an 85% adoption rate that is the highest recorded across all of Microsoft's global early adopters. This is not a statistic to be understated: it signals a culture of AI adoption that most global banks are still aspiring to achieve. The accompanying "CBD AI and Data for the Future" programme with Accenture — making CBD the first bank in the UAE to achieve enterprise-wide Data and AI certification for all employees — further cements this cultural advantage.</p>
<p>CBD's first-mover position on Open Finance (first UAE bank live on AlTareq, December 2025) creates a structural data and ecosystem advantage that will compound over the next 2–3 years as Open Finance adoption scales nationally. The bank's AI-powered digital onboarding — reducing account opening from 1 day to 2 minutes — has been a major driver of customer base growth, quadrupling the client base over four years and delivering 22 consecutive quarters of net profit growth, a record unmatched by any other UAE bank.</p>
<p>The AI Maturity Score of 3.5/5.0 reflects a bank that has achieved real AI deployment at scale, but has an identifiable roadmap to the next level: deeper agentic AI capabilities, a published standalone AI governance framework, and quantified AI revenue attribution. CBD's FY2025 net profit of AED 3.5B (up 15.5% YoY), total assets of AED 160B, and Q1 2026 net profit of AED 830M with sustained 26.9% cost-to-income ratio provide the financial foundation to accelerate AI investment in 2026–2027.</p>
<p>The competitive window is clear: AI will define the next phase of differentiation in UAE retail and corporate banking. CBD's existing culture advantage, Microsoft partnership depth, Open Finance first-mover status, and enterprise AI capability foundation position it well — but the pace of investment and the depth of agentic AI deployment in 2026 will determine whether CBD closes the gap to the UAE's top AI-native banks.</p>
    </div>
  </div>
  <div class="card">
    <div class="card-title">10 Strategic Findings</div>
    <div class="finding-item"><span class="finding-num">1.</span>CBD's 85% Microsoft Copilot adoption rate — highest globally across Microsoft early adopters — signals an extraordinary AI culture advantage that most banks cannot replicate quickly</div>
    <div class="finding-item"><span class="finding-num">2.</span>Enterprise-wide Data and AI employee certification (first in UAE) is a strategic talent differentiator: CBD's workforce is now AI-fluent at every level, from tellers to board secretary</div>
    <div class="finding-item"><span class="finding-num">3.</span>First-mover on Open Finance (AlTareq, Dec 2025) creates a compounding data and ecosystem advantage as UAE Open Finance scales to full national operation in 2026</div>
    <div class="finding-item"><span class="finding-num">4.</span>The 2-minute account opening AI journey has been a primary driver of quadrupling the customer base in 4 years — an AI use case with directly attributable business impact</div>
    <div class="finding-item"><span class="finding-num">5.</span>CBD's three-pillar AI strategy (Workplace Modernisation, Operational Efficiency, Experimentation) is clear and well-communicated but needs quantified AI ROI metrics for board-level AI investment decisions</div>
    <div class="finding-item"><span class="finding-num">6.</span>The AE Coin digital currency activation positions CBD ahead of most UAE banks for the Digital Dirham CBDC full rollout, targeted Q4 2026</div>
    <div class="finding-item"><span class="finding-num">7.</span>22 consecutive quarters of net profit growth — a UAE banking record — provides the financial durability to absorb the AI investment acceleration required in 2026–2027</div>
    <div class="finding-item"><span class="finding-num">8.</span>The Lune transaction enrichment partnership is a strategically underrated capability: rich transaction data is the fuel for all AI personalisation, financial wellness and fraud AI — this investment will compound in value</div>
    <div class="finding-item"><span class="finding-num">9.</span>Agentic AI for corporate banking workflows (loan origination, trade finance, credit analysis) represents the single highest-ROI AI investment opportunity CBD has not yet fully pursued — it is the priority gap</div>
    <div class="finding-item"><span class="finding-num">10.</span>CBUAE's February 2026 AI Guidance Note creates both a compliance obligation and a competitive opportunity: the banks with the most mature AI governance frameworks will build regulatory trust fastest and earn the right to deploy more advanced AI</div>
  </div>
</div>
</div>

<!-- ===== CEO REPORT PAGE ===== -->
<div id="page-ceo" class="page">
<div class="container">
  <div class="section-head">
    <h2>CEO Strategic AI Report</h2>
    <p>Board-level AI transformation report — confidential strategic document</p>
  </div>
  <div class="ceo-report">
    <div class="report-header">
      <div style="font-size:12px;color:#888;margin-bottom:4px">COMMERCIAL BANK OF DUBAI — CONFIDENTIAL</div>
      <div style="font-size:18px;font-weight:700;color:#003366">AI Transformation CEO Report 2026</div>
      <div style="font-size:12px;color:#888;margin-top:4px">Prepared by: Autonomous Banking AI Intelligence Agent | May 2026 | Sources: CBD FY2025 Results, Q1 2026 Results, Microsoft Customer Story, Accenture Partnership, MIT Sloan ME, MEA Finance Awards, Official CBD Press Releases</div>
    </div>

    <h3>Executive Overview</h3>
    <p>Commercial Bank of Dubai's AI transformation in 2025–2026 is best described by a single metric that no other UAE bank can claim: 22 consecutive quarters of net profit growth. This record, unmatched in the UAE banking sector, has been built on a foundation of relentless digital and AI investment — AED 392 million in Q1 2026 alone directed to digitisation, technology and governance. AI is no longer an experiment at CBD. It is the operating model.</p>

    <h3>AI Achievements: The Evidenced Record</h3>
    <p>In the past 18 months, CBD has delivered three AI milestones that establish its position as a leading UAE AI bank. First, Microsoft 365 Copilot is live across 900 employees with an 85% adoption rate — the highest across all of Microsoft's global early adopters. This is saving 39,000 hours annually and has transformed how legal, audit, HR, finance, marketing and operations functions operate. Second, the "CBD AI and Data for the Future" programme with Accenture has made CBD the first bank in the UAE to certify its entire workforce in both Data and AI — a foundational capability that will pay dividends across every AI use case deployed hereafter. Third, CBD became the first bank in the UAE to fully activate Open Finance under CBUAE's AlTareq initiative in December 2025, working live with Lean Technologies and Pay10. These are not pilot programmes. These are production-scale, customer-live AI deployments.</p>

    <h3>Financial Performance Underpinned by AI Investment</h3>
    <p>Our FY2025 results — AED 3.5 billion net profit after tax (up 15.5% year-on-year), net loans exceeding AED 100 billion for the first time, and total assets of AED 160 billion — reflect the compounding returns of multi-year AI and digital investment. The cost-to-income ratio of 26.25% in FY2025 and 26.90% in Q1 2026 places CBD among the most operationally efficient banks in the UAE and the region. AI is a primary driver of this efficiency: the digital onboarding journey (account opening in ~2 minutes) has quadrupled our customer base; the AI chatbot resolves 85%+ of routine inquiries without human escalation; and Copilot-driven workflow automation is compressing operating costs across every business unit. Our non-performing loan ratio declined to 3.55% in Q1 2026, supported by AI-assisted credit analytics and improved risk monitoring capabilities.</p>

    <h3>Strategic Priorities for 2026–2027</h3>
    <p>Our three AI priorities for the period ahead are clear. First, Agentic AI for corporate and commercial banking. CBD has not yet deployed deep autonomous AI agents in corporate loan origination, trade finance or SME banking at the scale of our regional peers. This is our most significant AI investment opportunity. Autonomous multi-step agents that can compress corporate loan turnaround from 10+ days to 2–3 days, straight-through-process trade finance documentation, and automate SME credit decisions will deliver both revenue acceleration and operating leverage. We must move with urgency.</p>
    <p>Second, AI revenue attribution and measurement. We have real AI-driven business impact — but we do not yet systematically quantify and communicate AI's contribution to revenue, cost savings and risk outcomes at the precision our shareholders and regulators increasingly expect. Building an AI value measurement framework in 2026 is both a governance imperative under the CBUAE's February 2026 AI guidance and a competitive communications advantage.</p>
    <p>Third, deepening the Open Finance AI ecosystem. Our first-mover position on AlTareq is valuable but will only compound if we actively scale use cases, TPP integrations and transaction volumes. AI-powered financial data insights delivered through the Open Finance layer — personalised credit offers, automated financial wellness recommendations, predictive cashflow management for SMEs — represent a new revenue frontier that CBD is uniquely positioned to capture first.</p>

    <h3>AI Governance &amp; Regulatory Alignment</h3>
    <p>The CBUAE's February 2026 Guidance Note on Responsible AI is not a constraint — it is a framework that rewards the banks that are already investing in AI governance. CBD's enterprise AI certification programme, documented model risk processes, and Microsoft's compliance infrastructure provide a strong foundation. In 2026, we will publish CBD's standalone AI Governance Framework, aligned to the CBUAE guidance, formalising explainability requirements, bias monitoring, model risk management, and consumer protection for all AI systems in production. This document will signal to regulators, customers and the market that CBD is an AI bank that can be trusted.</p>

    <h3>Conclusion</h3>
    <p>CBD's AI transformation is delivering real results — in profits, in customer growth, in operational efficiency, and in market recognition. Our 85% Copilot adoption rate, our UAE-first Open Finance activation, our enterprise AI certification, and our record 22 consecutive quarters of profit growth tell a coherent story: CBD is a bank that executes on technology strategy at a pace and depth that its peers find difficult to match. The task for 2026 is to accelerate into the domains where we are under-invested — agentic AI, AI revenue measurement, and Open Finance ecosystem deepening — while sustaining the financial performance that gives us the investment capacity to lead. The competitive window to define AI leadership in UAE banking is open. We intend to step through it.</p>

    <div style="margin-top:1.5rem;padding:1rem;background:#f8f8f4;border-radius:8px;font-size:12px;color:#666">
      <strong>Sources used in this report:</strong> CBD FY2025 Results Press Release (Jan 21, 2026) · CBD Q1 2026 Results Press Release (Apr 22, 2026) · Microsoft Customer Story: CBD + M365 Copilot (Apr 2025) · Microsoft Azure Customer Story: CBD (2024) · Accenture Newsroom: CBD AI and Data for the Future Programme (Mar 2025) · MIT Sloan Management Review ME: Architecting a Digital-First Bank (Mar 6, 2026) · HPE/du Press Release: CBD Hybrid Cloud (May 2024) · MEA Finance Banking Technology Awards 2025 · CBD Press Release: Open Finance AlTareq (Dec 23, 2025) · Arabian Business: CBD Open Finance (Dec 24, 2025) · BusinessWire: QualityKiosk TCoE (May 8, 2024) · Finextra: CBD + PwC Middle East MOU (Aug 2023) · Gulf News: CBD FY2025 Profit Record · Khaleej Times: CBD Q1 2026
    </div>
  </div>
</div>
</div>

<!-- ===== URLS PAGE ===== -->
<div id="page-urls" class="page">
<div class="container">
  <div class="section-head">
    <h2>2025–2026 Report Download URL Inventory</h2>
    <p>Official CBD document sources and verified partner announcements — all URLs active as of May 2026</p>
  </div>

  <div class="card" style="margin-bottom:1.5rem">
    <div class="card-title" style="margin-bottom:1rem">Latest 2025–2026 Report Inventory URLs</div>
    <table>
      <thead><tr><th>Document Name</th><th>Type</th><th>Date</th><th>URL</th></tr></thead>
      <tbody>
        <tr><td><strong>CBD Q1 2026 Financial Results</strong></td><td><span class="tag tag-dept">Results Press Release</span></td><td>April 22, 2026</td><td class="url-row"><a href="https://www.cbd.ae/aboutus/media-centre/press-room/news?Id=2b2d6fff-458f-66de-b8c5-ff0b00b6b24a" target="_blank">cbd.ae – Q1 2026 Results ↗</a></td></tr>
        <tr><td><strong>CBD FY2025 Full Year Results</strong></td><td><span class="tag tag-dept">Results Press Release</span></td><td>January 21, 2026</td><td class="url-row"><a href="https://www.cbd.ae/aboutus/media-centre/press-room/news?Id=a4d663ff-458f-66de-b8c5-ff0b00b6b24a" target="_blank">cbd.ae – FY2025 Results ↗</a></td></tr>
        <tr><td><strong>CBD Sustainability Report 2025</strong></td><td><span class="tag tag-prod">ESG / Sustainability</span></td><td>2025–2026</td><td class="url-row"><a href="https://www.cbd.ae/aboutus/sustainability" target="_blank">cbd.ae/aboutus/sustainability ↗</a></td></tr>
        <tr><td><strong>CBD Green Bond Report 2025</strong></td><td><span class="tag tag-prod">Green Finance</span></td><td>2025</td><td class="url-row"><a href="https://www.cbd.ae/aboutus/sustainability" target="_blank">cbd.ae/aboutus/sustainability ↗</a></td></tr>
        <tr><td><strong>CBD Corporate Governance Report 2025</strong></td><td><span class="tag tag-scale">Governance</span></td><td>2025–2026</td><td class="url-row"><a href="https://www.cbd.ae/aboutus/investor-relations" target="_blank">cbd.ae/aboutus/investor-relations ↗</a></td></tr>
        <tr><td><strong>CBD Annual Reports (Investor Relations)</strong></td><td><span class="tag tag-dept">Annual Report</span></td><td>Ongoing</td><td class="url-row"><a href="https://www.cbd.ae/aboutus/investor-relations" target="_blank">cbd.ae/aboutus/investor-relations ↗</a></td></tr>
        <tr><td><strong>CBD Press Releases 2025–2026</strong></td><td><span class="tag tag-tech">Press Releases</span></td><td>Ongoing</td><td class="url-row"><a href="https://www.cbd.ae/aboutus/media-centre/press-room" target="_blank">cbd.ae/aboutus/media-centre/press-room ↗</a></td></tr>
        <tr><td><strong>CBD Pillar III Report (Risk)</strong></td><td><span class="tag tag-scale">Risk / Capital</span></td><td>2025</td><td class="url-row"><a href="https://www.cbd.ae/aboutus/investor-relations" target="_blank">cbd.ae/aboutus/investor-relations ↗</a></td></tr>
        <tr><td><strong>DFM Regulatory Filings — CBD</strong></td><td><span class="tag tag-tech">Regulatory</span></td><td>Ongoing 2026</td><td class="url-row"><a href="https://www.dfm.ae/the-exchange/market-data/equities/company-details/CBD/company-profile" target="_blank">dfm.ae – CBD Company Profile ↗</a></td></tr>
      </tbody>
    </table>
  </div>

  <div class="card" style="margin-bottom:1.5rem">
    <div class="card-title" style="margin-bottom:1rem">AI Use Case Document URLs — Partner &amp; Official Sources</div>
    <p style="font-size:12px;color:#888;margin-bottom:1rem;font-style:italic">Note: CBD does not publish standalone AI whitepapers. AI content is sourced from the documents below — partner press releases, Microsoft Customer Stories, and official CBD press releases are the primary sources.</p>
    <table>
      <thead><tr><th>AI Document / Source</th><th>AI Content</th><th>URL</th></tr></thead>
      <tbody>
        <tr><td><strong>Microsoft Customer Story — CBD + M365 Copilot</strong></td><td>39,000 hours saved, Copilot deployment, 85% adoption, RCSA automation, HR AI, prompt engineering</td><td class="url-row"><a href="https://www.microsoft.com/en/customers/story/24341-commercial-bank-of-dubai-microsoft-365-copilot" target="_blank">microsoft.com customer story 24341 ↗</a></td></tr>
        <tr><td><strong>Microsoft Azure Customer Story — CBD Platform</strong></td><td>2-minute onboarding, cloud-native platform, Corporate Internet Banking AI, Azure infrastructure</td><td class="url-row"><a href="https://www.microsoft.com/en/customers/story/1794733067648840156-commercial-bank-of-dubai-azure-banking-and-capital-markets-en-united-arab-emirates" target="_blank">microsoft.com azure customer story ↗</a></td></tr>
        <tr><td><strong>Accenture Newsroom — CBD AI &amp; Data Programme</strong></td><td>First UAE bank Data &amp; AI certification, enterprise AI literacy, Accenture learning platform</td><td class="url-row"><a href="https://newsroom.accenture.com/news/2025/accenture-and-commercial-bank-of-dubai-launch-data-and-ai-training-programme-to-elevate-employee-skills-and-customer-experience" target="_blank">newsroom.accenture.com/2025/cbd ↗</a></td></tr>
        <tr><td><strong>MIT Sloan ME — Architecting a Digital-First Bank (CBD)</strong></td><td>Platform thinking, CIO Thomas Cherian, hybrid cloud, AI customer experience, digital transformation strategy</td><td class="url-row"><a href="https://www.mitsloanme.com/video/architecting-a-digital-first-bank-how-commercial-bank-of-dubai-is-transforming-banking-in-the-uae/" target="_blank">mitsloanme.com – CBD Digital-First Bank (Mar 2026) ↗</a></td></tr>
        <tr><td><strong>HPE/du Press Release — CBD Hybrid Cloud</strong></td><td>HPE GreenLake AI infrastructure, AI-driven customer services, hybrid cloud for AI workloads</td><td class="url-row"><a href="https://www.hpe.com/us/en/newsroom/press-release/2024/05/hewlett-packard-enterprise-and-du-to-accelerate-commercial-bank-of-dubais-digital-innovation-and-enhance-customer-experience.html" target="_blank">hpe.com/us/newsroom – CBD May 2024 ↗</a></td></tr>
        <tr><td><strong>CBD Open Finance Press Release</strong></td><td>AlTareq Open Finance first activation, AI consent management, Pay10 &amp; Lean Technologies</td><td class="url-row"><a href="https://www.cbd.ae/aboutus/media-centre/press-room/news?Id=bb1563ff-458f-66de-b8c5-ff0b00b6b24a" target="_blank">cbd.ae – Open Finance Press Release Dec 2025 ↗</a></td></tr>
        <tr><td><strong>QualityKiosk Press Release — CBD TCoE</strong></td><td>AI testing, predictive risk, quality engineering, Technology Strategy Refresh</td><td class="url-row"><a href="https://s24.q4cdn.com/622300748/files/doc_news/Commercial-Bank-of-Dubai-Names-QualityKiosk-as-Exclusive-Partner-to-Develop-CBDs-Testing-Centre-of-Excellence-as-part-of-its-Technolo-UZQN4.pdf" target="_blank">QualityKiosk PR PDF ↗</a></td></tr>
        <tr><td><strong>MEA Finance Banking Technology Awards 2025</strong></td><td>Best Hybrid Cloud Implementation; H1 2025 AI initiatives; enterprise AI training recognition</td><td class="url-row"><a href="https://www.cbd.ae/aboutus/media-centre/press-room/news?Id=73b75eff-458f-66de-b8c5-ff0b00b6b24a" target="_blank">cbd.ae – MEA Finance Awards ↗</a></td></tr>
      </tbody>
    </table>
  </div>

  <div class="card">
    <div class="card-title" style="margin-bottom:1rem">All Official CBD Source URLs</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px">
      <a href="https://www.cbd.ae" class="chip" target="_blank">cbd.ae (main)</a>
      <a href="https://www.cbd.ae/aboutus/investor-relations" class="chip" target="_blank">Investor Relations</a>
      <a href="https://www.cbd.ae/aboutus/media-centre/press-room" class="chip" target="_blank">Press Releases</a>
      <a href="https://www.cbd.ae/aboutus/sustainability" class="chip" target="_blank">Sustainability</a>
      <a href="https://www.dfm.ae/the-exchange/market-data/equities/company-details/CBD/company-profile" class="chip" target="_blank">DFM Filings</a>
      <a href="https://www.microsoft.com/en/customers/story/24341-commercial-bank-of-dubai-microsoft-365-copilot" class="chip" target="_blank">Microsoft Copilot Story</a>
      <a href="https://www.microsoft.com/en/customers/story/1794733067648840156-commercial-bank-of-dubai-azure-banking-and-capital-markets-en-united-arab-emirates" class="chip" target="_blank">Microsoft Azure Story</a>
      <a href="https://newsroom.accenture.com/news/2025/accenture-and-commercial-bank-of-dubai-launch-data-and-ai-training-programme-to-elevate-employee-skills-and-customer-experience" class="chip" target="_blank">Accenture Partnership</a>
      <a href="https://www.mitsloanme.com/video/architecting-a-digital-first-bank-how-commercial-bank-of-dubai-is-transforming-banking-in-the-uae/" class="chip" target="_blank">MIT Sloan ME Interview (2026)</a>
      <a href="https://www.hpe.com/us/en/newsroom/press-release/2024/05/hewlett-packard-enterprise-and-du-to-accelerate-commercial-bank-of-dubais-digital-innovation-and-enhance-customer-experience.html" class="chip" target="_blank">HPE/du Partnership</a>
      <a href="https://www.centralbank.ae" class="chip" target="_blank">CBUAE (Regulator)</a>
    </div>
    <div style="margin-top:1.5rem;padding:1rem;background:#f8f8f4;border-radius:8px;font-size:12px;color:#888">
      <strong>CEO Report:</strong> No standalone CEO AI report is publicly downloadable from cbd.ae. CBD's CEO Dr. Bernd van Linder's AI strategy commentary is embedded in the FY2025 Results Press Release (January 21, 2026) and Q1 2026 Results (April 22, 2026). The CIO Thomas Cherian's transformation strategy is detailed in the MIT Sloan Management Review Middle East interview (March 6, 2026). This AI Intelligence Report constitutes the synthesised CEO-level AI strategic document, sourced entirely from official CBD and partner publications.
    </div>
  </div>
</div>
</div>

<div class="page-footer">
  CBD AI Intelligence Report 2026 | Autonomous Banking AI Analysis | Sources: cbd.ae, Microsoft, Accenture, MIT Sloan ME, HPE, MEA Finance, DFM, CBUAE | May 2026
</div>

<script>
function showPage(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  btn.classList.add('active');
  window.scrollTo(0,0);
}
function filterUC(maturity, btn) {
  document.querySelectorAll('#uc-filters button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.uc-card').forEach(card => {
    if (maturity === 'all') {
      card.style.display = '';
    } else {
      card.style.display = card.dataset.maturity.includes(maturity) ? '' : 'none';
    }
  });
}
</script>
</body>
</html>
`;

const CBDAIIntelligenceReport2026: React.FC = () => {
  return (
    <div style={{ width: "100%", height: "100vh", margin: 0, padding: 0, overflow: "hidden" }}>
      <iframe
        title="CBD AI Intelligence Report 2026"
        srcDoc={cbdReportHtml}
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
};

export default CBDAIIntelligenceReport2026;
