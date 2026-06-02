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
.topbar{background:#CC0000;color:white;padding:0}
.topbar-inner{max-width:1200px;margin:0 auto;padding:1.5rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}
.topbar h1{font-size:20px;font-weight:600;letter-spacing:-0.3px}
.topbar p{font-size:12px;opacity:0.7;margin-top:2px}
.badge-gold{background:#1a1a1a;color:#fff;font-size:11px;padding:3px 10px;border-radius:20px;font-weight:600}
.nav{background:#a00000;padding:0;border-bottom:2px solid #ffcc00;overflow-x:auto}
.nav-inner{max-width:1200px;margin:0 auto;display:flex;gap:0}
.nav button{background:none;border:none;color:rgba(255,255,255,0.7);padding:12px 18px;font-size:13px;cursor:pointer;white-space:nowrap;border-bottom:3px solid transparent;transition:all 0.2s}
.nav button:hover,.nav button.active{color:#fff;border-bottom-color:#ffcc00}
.container{max-width:1200px;margin:0 auto;padding:1.5rem 2rem}
.page{display:none}.page.active{display:block}
.section-head{margin-bottom:1.5rem}
.section-head h2{font-size:22px;font-weight:600;color:#CC0000;margin-bottom:4px}
.section-head p{font-size:13px;color:#666}
.metrics-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:1.5rem}
.metric{background:#fff;border:0.5px solid #ddd;border-radius:8px;padding:1rem;text-align:center}
.metric .num{font-size:28px;font-weight:700;color:#CC0000;margin-bottom:2px}
.metric .lbl{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.5px}
.card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;margin-bottom:1rem}
.card-title{font-size:15px;font-weight:600;color:#CC0000;margin-bottom:8px}
.tag{display:inline-block;font-size:10px;padding:2px 8px;border-radius:12px;font-weight:600;margin:2px}
.tag-prod{background:#eaf3de;color:#27500a}
.tag-scale{background:#faeeda;color:#633806}
.tag-pilot{background:#eeedfe;color:#3c3489}
.tag-dept{background:#fde8e8;color:#7c0c0c}
.tag-tech{background:#f1efe8;color:#2c2c2a}
.tag-partner{background:#faece7;color:#712b13}
table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;padding:10px 12px;background:#f8f8f4;font-weight:600;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.4px;border-bottom:1px solid #e8e8e0}
td{padding:10px 12px;border-bottom:0.5px solid #f0f0e8;vertical-align:top}
tr:last-child td{border-bottom:none}
tr:hover td{background:#fafaf8}
.uc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem}
.uc-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-left:4px solid #CC0000}
.uc-id{font-size:10px;color:#999;font-weight:600;letter-spacing:1px;margin-bottom:4px}
.uc-name{font-size:15px;font-weight:600;color:#CC0000;margin-bottom:8px}
.uc-field{margin-bottom:6px}
.uc-label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.4px;font-weight:600;margin-bottom:2px}
.uc-value{font-size:12px;color:#333;line-height:1.5}
.agent-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-left:4px solid #7f77dd}
.agent-name{font-size:14px;font-weight:600;color:#3c3489;margin-bottom:8px;display:flex;align-items:center;gap:8px}
.agent-icon{width:28px;height:28px;background:#eeedfe;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.prog-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-top:3px solid #ffcc00}
.prog-name{font-size:14px;font-weight:600;color:#CC0000;margin-bottom:6px}
.prose{font-size:13px;line-height:1.8;color:#2a2a2a}
.prose p{margin-bottom:1rem}
.finding-item{padding:0.75rem 1rem;border-left:3px solid #CC0000;background:#fff5f5;border-radius:0 6px 6px 0;margin-bottom:0.75rem;font-size:13px;line-height:1.6}
.finding-num{font-weight:700;color:#CC0000;margin-right:8px}
.maturity-bar-wrap{margin-bottom:1rem}
.maturity-label{display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px}
.maturity-bar{height:10px;background:#e8e8e0;border-radius:5px;overflow:hidden}
.maturity-fill{height:100%;border-radius:5px;background:#CC0000;transition:width 1s}
.url-row a{color:#CC0000;text-decoration:none;font-size:12px;word-break:break-all}
.url-row a:hover{text-decoration:underline}
.filter-bar{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:1.5rem}
.filter-btn{border:0.5px solid #ccc;background:#fff;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer;transition:all 0.2s}
.filter-btn.active{background:#CC0000;color:#fff;border-color:#CC0000}
.summary-box{background:#CC0000;color:#fff;border-radius:10px;padding:1.5rem;margin-bottom:1.5rem}
.summary-box h3{font-size:18px;font-weight:600;margin-bottom:1rem;color:#ffcc00}
.summary-box p{font-size:13px;line-height:1.8;opacity:0.92}
.ceo-report{background:#fff;border:1px solid #CC0000;border-radius:10px;padding:2rem;font-size:13px;line-height:1.9;color:#1a1a1a}
.ceo-report .report-header{border-bottom:2px solid #CC0000;padding-bottom:1rem;margin-bottom:1.5rem}
.ceo-report h3{font-size:16px;font-weight:700;color:#CC0000;margin:1.5rem 0 0.5rem}
.ceo-report p{margin-bottom:1rem}
.partner-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;display:flex;gap:12px}
.partner-logo{width:48px;height:48px;border-radius:8px;background:#fde8e8;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:#7c0c0c;flex-shrink:0;text-align:center;line-height:1.2}
.score-big{font-size:48px;font-weight:700;color:#CC0000;text-align:center;padding:1.5rem;background:#fff5f5;border-radius:10px;margin-bottom:1rem}
.score-sub{font-size:13px;color:#888;text-align:center;margin-top:-0.5rem;margin-bottom:1rem}
.chip{display:inline-flex;align-items:center;gap:6px;background:#f1f1e8;border:0.5px solid #d8d8c8;border-radius:20px;padding:4px 12px;font-size:11px;color:#444;margin:3px;text-decoration:none}
.chip:hover{background:#e8e8d8}
.page-footer{background:#a00000;color:rgba(255,255,255,0.6);font-size:11px;text-align:center;padding:1rem;margin-top:2rem}
`;

const htmlContent = `<div class="topbar">
<div class="topbar-inner">
<div>
<h1>RAKBANK (National Bank of Ras Al Khaimah) — AI Intelligence Report 2026</h1>
<p>Autonomous Banking AI Analysis | 25 Use Cases | 10 Agents | 7 Programs | Official Sources Only</p>
</div>
 <div style="display:flex;align-items:center;gap:10px;">
      <button
        onclick="window.location.href='/radha/nbf-ai-intelligence'"
        style="
          background:#5543C8;
          color:white;
          border:none;
          padding:8px 18px;
          border-radius:999px;
          cursor:pointer;
          font-size:13px;
          font-weight:600;
        "
      >
        View NBFAI Report
      </button>

      <span class="badge-gold">CONFIDENTIAL STRATEGIC REPORT</span>
    </div>
</div>
</div>
<nav class="nav">
<div class="nav-inner">
<button class="active" onclick="showPage('overview',this)">Overview</button>
<button onclick="showPage('usecases',this)">AI Use Cases (25)</button>
<button onclick="showPage('agents',this)">AI Agents (10)</button>
<button onclick="showPage('programs',this)">AI Programs (7)</button>
<button onclick="showPage('partnerships',this)">Partnerships (6)</button>
<button onclick="showPage('maturity',this)">AI Maturity</button>
<button onclick="showPage('executive',this)">Executive Summary</button>
<button onclick="showPage('ceo',this)">CEO Report</button>
<button onclick="showPage('urls',this)">Report URLs</button>
</div>
</nav>

<div class="page active" id="page-overview">
<div class="container">
<div class="section-head">
<h2>AI Intelligence Overview — RAKBANK 2025–2026</h2>
<p>Synthesized from RAKBANK Annual Report 2025, Q1 2026 Results, Microsoft Customer Story (May 2025), Press Releases &amp; ADX Filings</p>
</div>
<div class="metrics-grid">
<div class="metric"><div class="num">25</div><div class="lbl">AI Use Cases</div></div>
<div class="metric"><div class="num">10</div><div class="lbl">AI Agents</div></div>
<div class="metric"><div class="num">7</div><div class="lbl">AI Programs</div></div>
<div class="metric"><div class="num">6</div><div class="lbl">AI Partnerships</div></div>
<div class="metric"><div class="num">3.5/5</div><div class="lbl">AI Maturity Score</div></div>
<div class="metric"><div class="num">AED 2.6B</div><div class="lbl">FY2025 Net Profit (+26%)</div></div>
<div class="metric"><div class="num">AED 105B</div><div class="lbl">Total Assets (+19%)</div></div>
<div class="metric"><div class="num">75%</div><div class="lbl">Compliance Time Saved</div></div>
</div>
<div class="summary-box">
<h3>AI Transformation Headline — Digital with a Human Touch</h3>
<p>RAKBANK is accelerating its AI transformation in 2025–2026 under the strategic vision "Become the digital bank with a human touch, with you in key moments of truth." The bank achieved a landmark milestone of AED 2.6 billion net profit in FY2025 (up 26%) and crossed AED 105 billion in total assets, driven significantly by digital and AI-enabled efficiencies. Key 2025–2026 AI achievements include: 2 million customer documents digitized and indexed via Azure AI, compliance processing time cut 75% from 80 to 20 minutes per case, an AI-powered digital assistant deployed across the mobile app, and strategic MoUs signed with Microsoft (GPT-4o + JAIS) and DataRobot. RAKBANK also launched the UAE's first conventional-bank crypto brokerage and won 'Analytics Initiative of the Year' at industry awards.</p>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1rem;margin-bottom:1.5rem">
<div class="card">
<div class="card-title">Key AI Business Outcomes (2025–2026)</div>
<table>
<tr><td>KYC Compliance Case Processing</td><td style="text-align:right;font-weight:600;color:#CC0000">80→20 min (−75%)</td></tr>
<tr><td>Documents Digitized (Azure AI)</td><td style="text-align:right;font-weight:600;color:#CC0000">2 Million+</td></tr>
<tr><td>Digital Channel Migration</td><td style="text-align:right;font-weight:600;color:#CC0000">Cost-to-Income 33.1%</td></tr>
<tr><td>Microloans Disbursed (AI-enabled)</td><td style="text-align:right;font-weight:600;color:#CC0000">593,000+</td></tr>
<tr><td>Non-Interest Income Growth</td><td style="text-align:right;font-weight:600;color:#CC0000">+29% YoY (AED 1.5B)</td></tr>
<tr><td>Skiply App Awards</td><td style="text-align:right;font-weight:600;color:#CC0000">42 Awards</td></tr>
</table>
</div>
<div class="card">
<div class="card-title">AI Maturity by Dimension</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span style="font-size:12px">AI Strategy &amp; Governance</span><span style="font-weight:600">3.5/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:70%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span style="font-size:12px">Data Infrastructure</span><span style="font-weight:600">3.8/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:76%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span style="font-size:12px">AI Talent &amp; Culture</span><span style="font-weight:600">3.2/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:64%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span style="font-size:12px">AI Production Deployment</span><span style="font-weight:600">3.6/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:72%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span style="font-size:12px">GenAI &amp; Agentic AI</span><span style="font-weight:600">3.3/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:66%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span style="font-size:12px">Responsible AI</span><span style="font-weight:600">3.4/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:68%"></div></div>
</div>
</div>
</div>
<div class="card">
<div class="card-title">Key AI Partnerships</div>
<div style="display:flex;flex-wrap:wrap;gap:8px">
<span class="tag tag-partner">Microsoft Azure (OpenAI Service)</span>
<span class="tag tag-partner">G42 / JAIS Arabic LLM</span>
<span class="tag tag-partner">DataRobot (via e&amp;enterprise)</span>
<span class="tag tag-partner">e&amp;enterprise (AIaaS)</span>
<span class="tag tag-partner">IBM (Cognitive AI – legacy)</span>
<span class="tag tag-partner">Bitpanda (Crypto AI Platform)</span>
</div>
</div>
<div class="card">
<div class="card-title">2026 Strategic AI Focus Areas</div>
<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:4px">
<span class="tag tag-dept">AI-Powered Digital Assistant</span>
<span class="tag tag-dept">GenAI Compliance Automation</span>
<span class="tag tag-dept">Arabic LLM Customer Service</span>
<span class="tag tag-dept">Predictive Analytics (Telemetry)</span>
<span class="tag tag-dept">AI Fraud &amp; AML Detection</span>
<span class="tag tag-dept">AI Marketing Campaigns</span>
<span class="tag tag-dept">ML Credit Scoring</span>
<span class="tag tag-dept">Crypto AI Integration</span>
<span class="tag tag-dept">AI SME Financing</span>
<span class="tag tag-dept">Agentic AI (2026 roadmap)</span>
</div>
</div>
</div>
</div>

<div class="page" id="page-usecases">
<div class="container">
<div class="section-head">
<h2>AI Use Cases — 25 Identified (2025–2026)</h2>
<p>All use cases sourced from RAKBANK Annual Report 2025, Microsoft Customer Story, Press Releases, and ADX disclosures</p>
</div>
<div class="filter-bar" id="uc-filters">
<button class="filter-btn active" onclick="filterUC('all',this)">All (25)</button>
<button class="filter-btn" onclick="filterUC('Production',this)">Production</button>
<button class="filter-btn" onclick="filterUC('Scaling',this)">Scaling</button>
<button class="filter-btn" onclick="filterUC('Pilot',this)">Pilot</button>
</div>
<div class="uc-grid">
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-001</div>
<div class="uc-name">Azure AI KYC Document Intelligence Platform</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Compliance / Operations</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Azure OpenAI Service and Azure Form Recognizer digitize, categorize, and index over 2 million customer documents including passports, Emirates IDs, KYC forms and account opening forms — some handwritten, dating back 20+ years. AI extracts structured data from unstructured PDFs and scanned images.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Compliance case processing: 80 minutes → 20 minutes (−75%); 2M+ documents indexed; KYC audit ready in seconds; thousands of manual hours saved; UAE Central Bank compliance met</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure OpenAI Service, Azure Form Recognizer, Azure Document Intelligence, Microsoft Cloud UAE</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Microsoft Customer Story — RAKBANK (May 2025): microsoft.com/en/customers/story/24080-rakbank-azure-open-ai-service</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-002</div>
<div class="uc-name">AI-Powered Digital Banking Assistant (Mobile App)</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Retail Banking / Digital</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2025–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Azure OpenAI-powered digital assistant embedded in RAKBANK's mobile app. Handles customer queries, provides account information, guides product applications, and delivers personalized financial advice. Described in Q1 2026 press release as "RAKBANK's own AI-powered digital assistant."</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">24/7 customer support availability; reduced call centre volume; improved digital NPS; personalized product recommendations; customer onboarding acceleration</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure OpenAI Service (GPT-4o), Azure Cognitive Services, mobile app integration, UAE sovereign cloud</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">RAKBANK Q1 2026 Press Release (April 2026); Microsoft Customer Story (May 2025)</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-003</div>
<div class="uc-name">AI AML/CTF Detection &amp; Compliance Engine</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Compliance / Risk</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-driven anti-money laundering and counter-terrorism financing detection powered by GPT-4o and JAIS Arabic LLM on Microsoft Cloud. Analyzes transactions, customer behavior and network patterns to flag suspicious activity, reducing false positives and accelerating SAR generation.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Faster SAR filing; reduced false positive rate; CBUAE compliance strengthened; analyst productivity improvement; awarded 'Compliance Initiative of the Year' 2025</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure OpenAI (GPT-4o), JAIS Arabic LLM (G42), Microsoft Cloud UAE, transaction monitoring</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">RAKBANK-Microsoft MoU Press Release (July 2024); RAKBANK Annual Report 2025</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-004</div>
<div class="uc-name">AI Fraud Detection &amp; Real-Time Transaction Scoring</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Risk / Security</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Real-time ML-based fraud detection across card payments, digital banking, and transactions. Scores each transaction against behavioral patterns, device fingerprinting, geo-anomalies and velocity checks. GPT-4o integration enables multimodal fraud pattern recognition.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Fraudulent transaction interception at millisecond speed; impaired loan ratio improved to 1.9% (from 2.2%); net impairment charges fell 42% YoY (FY2025); customer trust improvement</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure OpenAI (GPT-4o), ML scoring models, DataRobot platform (via e&amp;enterprise), real-time event streaming</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">RAKBANK-Microsoft MoU (July 2024); RAKBANK FY2025 Annual Results (January 2026)</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-005</div>
<div class="uc-name">Arabic NLP Customer Interaction Platform (JAIS)</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Customer Experience / Contact Centre</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">JAIS — the world's most advanced Arabic large language model from G42 — deployed on Microsoft's trusted cloud to serve RAKBANK's significant Arabic-speaking customer base. Enables fully native Arabic conversational banking across digital channels, voice, and IVR with deep dialect understanding.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Arabic customer experience parity with English; improved UAE National customer engagement; compliance with UAE language regulations; voice channel digital deflection; NPS improvement</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">JAIS Arabic LLM (G42 / Inception), Microsoft Azure Cloud, multi-dialect NLP pipeline</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">RAKBANK-Microsoft MoU Press Release (July 2024)</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-006</div>
<div class="uc-name">AI-Enabled Microfinance Credit Scoring (Microsegment)</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Retail Banking / Financial Inclusion</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2023–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">ML-driven credit scoring for RAKBANK's microsegment proposition — UAE's financial inclusion platform for blue-collar workers. AI analyzes salary history, WPS data, spending patterns and repayment behavior to generate real-time microloan approvals for under-banked customers.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">593,000+ salary-linked microloans disbursed; 2.4 million cardholders served; 3.7 million remittance transactions enabled; financial inclusion KPIs exceeded; social impact recognized in annual report</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">ML classification models, WPS data integration, DataRobot AI platform, Azure data lake</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">RAKBANK Annual Report 2025 (published February 2026); MarketScreener extract</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-007</div>
<div class="uc-name">Telemetry Analytics &amp; Predictive Operations (Award-Winning)</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Operations / Technology</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-powered telemetry analytics platform that monitors banking systems, digital channels and infrastructure in real time. Predictive models identify potential failures, bottlenecks and anomalies before customer impact occurs. Won 'Analytics Initiative of the Year (Telemetry)' at industry awards in 2025.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Industry award recognition; system uptime improvement; proactive incident prevention; digital channel reliability; IT cost optimization; underpins Mission Zero (zero errors, zero delays)</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure Monitor, custom telemetry ML models, real-time alerting, DataRobot predictive ops</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">RAKBANK Annual Report 2025 (Awards section); MarketScreener extract (February 2026)</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-008</div>
<div class="uc-name">AI-Driven Call Centre Optimization</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Customer Experience / Contact Centre</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI platform optimizing digital and voice experiences and call centre operations. Uses NLP and sentiment analysis for intelligent call routing, agent assist, real-time transcription, and quality scoring. Microsoft collaboration includes direct call centre optimization scope. Won 'Call Centre Initiative of the Year' award in 2025.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Industry award recognition; call resolution time reduction; agent productivity improvement; digital deflection increase; customer effort score improvement; NPS uplift</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure OpenAI (GPT-4o), Azure Speech Services, NLP sentiment analysis, agent assist dashboard</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">RAKBANK Annual Report 2025 (Awards); RAKBANK-Microsoft MoU (July 2024)</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-009</div>
<div class="uc-name">Skiply 2.0 AI-Enhanced School Payment Platform</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Consumer Banking / EdFintech</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2022–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Skiply 2.0 — RAKBANK's leading UAE school payments app — incorporates AI to deliver smart payment plans, personalized fee management journeys, and school fee forecasting for families. AI powers payment plan recommendations, reminder systems and smart payment routing. 42 industry awards to date.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">42 industry awards; UAE's leading school payment app; simplified payment journeys; smart payment plans for extracurricular fees; financial planning support for UAE families; cross-sell into RAKBANK products</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">ML recommendation engine, payment AI routing, Azure Cloud, mobile-first architecture</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">RAKBANK Annual Report 2025; Global BankTech Awards 2023; MarketScreener extract (Feb 2026)</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-010</div>
<div class="uc-name">AI-Powered SME Quick Apply &amp; Credit Decisioning</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Business Banking (SME)</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2023–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-driven quick apply platform for SME banking products enabling instant credit decisioning. ML models analyze trade license data, business transaction history, sector trends and cash flow patterns to generate real-time lending decisions for RAKBANK's SME customer base of 80,000+ businesses.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Outstanding Digital Innovation in SME Banking award; same-day credit approvals; loans &amp; advances grew 12% to AED 56B in FY2025; SME ecosystem leadership; MoU signed with Shams (Sharjah Media City) 2025</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">DataRobot ML platform (via e&amp;enterprise), Azure data services, open banking APIs, CRM integration</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">RAKBANK Annual Report 2025; Global BankTech Awards 2023; Q1 2026 Results Press Release</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-011</div>
<div class="uc-name">AI Customer Personalization Engine (Real-Time Offers)</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Retail Banking / Marketing</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Advanced AI and generative ML delivers real-time personalized value propositions to retail customers. Analyzes transaction history, life events, digital behavior and product holdings to recommend relevant products and services at key moments. Consumer Banking NPS improved to 3rd position from 5th position in 2025.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Consumer Banking NPS: 5th → 3rd position in UAE; non-interest income grew 29% to AED 1.5B; cross-sell conversion improvement; digital engagement deepening; wealth management revenue growth</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">GenAI/ML personalization models, real-time feature store, Azure ML, DataRobot, CRM integration</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">RAKBANK Annual Report 2025 (MarketScreener extract, February 2026)</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-012</div>
<div class="uc-name">AI-Powered Marketing Campaign Automation</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Marketing</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">RAKBANK launched UAE's first fully AI-supported bank marketing campaign in partnership with Microsoft. Leverages GPT-4o multimodal AI to generate targeted content, personalized messaging, segment-specific campaigns and automated A/B testing. Sets a new standard for how banking marketing is executed in the UAE.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">First AI-complete marketing campaign by a UAE bank; campaign targeting precision improvement; customer acquisition cost reduction; conversion rate uplift; brand innovation leadership</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure OpenAI (GPT-4o), Microsoft marketing AI stack, A/B testing automation, audience ML models</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">RAKBANK-Microsoft MoU Press Release (July 2024, Zawya / Yahoo Finance)</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-013</div>
<div class="uc-name">DataRobot Predictive ML Analytics Platform</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Data &amp; Analytics / Enterprise-wide</span>
<span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
<span class="tag tag-tech">2022–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Enterprise AI-as-a-Service platform from DataRobot (deployed by e&amp;enterprise) across RAKBANK's business verticals. Enables automated ML model building, training, deployment and governance for use cases including churn prediction, credit risk scoring, revenue forecasting and operational analytics.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Faster AI time-to-value across business units; AI CoE capabilities established; model governance framework; 30–40% efficiency gains in automated analytics; accelerated AI adoption without deep data science teams</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">DataRobot AI platform, e&amp;enterprise managed services, Azure cloud, MLOps governance framework</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">RAKBANK Press Release — DataRobot &amp; e&amp;enterprise Partnership; LinkedIn e&amp;enterprise (October 2022)</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-014</div>
<div class="uc-name">AI Digital Onboarding Journey</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Retail &amp; Business Banking</span>
<span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
<span class="tag tag-tech">2023–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-enhanced digital onboarding for retail and SME customers. Uses Azure Document Intelligence for eKYC document verification, liveness detection, and automated identity validation. OCR and NLP extract customer data from IDs and passports in real time to eliminate paper-based processes.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Excellence in Digital Innovation award (Global BankTech Awards 2023); account opening time reduced significantly; paper elimination; customer experience improvement; regulatory compliance; digital adoption increase</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure Document Intelligence, eKYC AI stack, liveness detection ML, Azure Form Recognizer</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Global BankTech Awards 2023; Microsoft Customer Story (May 2025); Digital Banker article</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-015</div>
<div class="uc-name">Bitpanda Crypto AI Trading &amp; Risk Platform</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Digital Assets / Retail Banking</span>
<span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
<span class="tag tag-tech">2025–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">RAKBANK launched the UAE's first conventional-bank crypto brokerage for retail customers in July 2025 via Bitpanda. AI powers the crypto risk management, AML screening, price execution, portfolio recommendations and fraud detection layer behind the in-app trading experience. All transactions in AED, VARA regulated.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">UAE-first conventional bank crypto brokerage; digital revenue stream expansion; VARA-regulated; zero forex friction (all-AED transactions); customer retention and acquisition; digital innovation leadership</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Bitpanda AI platform, VARA-regulated execution engine, AML AI screening, real-time risk models</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">RAKBANK-Bitpanda Launch Press Release (July 2025, FFNews / Fintech Times)</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-016</div>
<div class="uc-name">AI Customer Fulfillment Automation</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Operations / Customer Experience</span>
<span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-driven customer fulfillment process automation covering service requests, document processing, product activations and fulfillment queues. Part of the Microsoft MoU scope focusing on end-to-end customer journey digitization — eliminating "paper in the back office" that breaks digital journeys.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Mission Zero progress (zero errors, zero complaints, zero delays); straight-through processing increase; operational efficiency improvement; cost-to-income maintained at 33.1%; customer satisfaction uplift</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure AI Services, Power Automate (RPA+AI), Azure Form Recognizer, workflow orchestration</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">RAKBANK-Microsoft MoU (July 2024); Annual Report 2025 — Mission Zero section</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-017</div>
<div class="uc-name">AI Wealth Management &amp; Investment Recommendations</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Wealth Management / Retail</span>
<span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-powered investment recommendation and wealth management platform. ML models analyze customer risk appetite, financial goals and market conditions to deliver personalized investment proposals. Directly contributed to 32% YoY growth in non-interest income driven by wealth management momentum in 9M 2025.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">32% YoY growth in non-interest income from wealth/FX/trading (9M 2025); AED 1.5B non-interest income FY2025; cross-sell into investment products; customer lifetime value increase</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">ML recommendation models, Azure ML, market data integration, portfolio optimization algorithms</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">RAKBANK 9M 2025 Results (October 2025, MENAFN); RAKBANK FY2025 Annual Results (Jan 2026)</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-018</div>
<div class="uc-name">AI-Enhanced Network International Merchant Analytics</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Payments / Business Banking</span>
<span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
<span class="tag tag-tech">2025–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Following the acquisition of RAKBANK's merchant acquiring business by Network International (announced November 2025), AI-powered merchant analytics and value-added services are being deployed for RAKBANK's 80,000+ SME and corporate merchant base. Network International provides state-of-the-art AI payment solutions and digital commerce analytics.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">80,000+ SME merchants benefit from AI analytics; UAE Digital Economy Strategy support; merchant revenue intelligence; Ras Al Khaimah digital commerce expansion; RAKBANK SME ecosystem deepening</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Network International AI payments platform, merchant analytics ML, digital commerce AI stack</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Network International – RAKBANK Merchant Acquisition Press Release (November 2025)</div></div>
</div>
<div class="uc-card" data-maturity="Pilot">
<div class="uc-id">UC-019</div>
<div class="uc-name">GenAI Regulatory &amp; Policy RAG Assistant (Internal)</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Compliance / Legal</span>
<span class="tag" style="background:#f0f0f0;color:#3c3489">Pilot</span>
<span class="tag tag-tech">2025–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">RAG (Retrieval-Augmented Generation) system built on Azure OpenAI enabling compliance and legal teams to query CBUAE regulations, UAE banking laws, and RAKBANK internal policies via natural language. Automates policy gap analysis and generates compliance summaries for regulatory reviews.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Compliance officer productivity increase; policy query time from hours to seconds; regulatory change management automation; audit readiness improvement; foundation for future GenAI compliance agents</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure OpenAI RAG, Azure AI Search (vector database), LangChain, CBUAE regulatory corpus</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Microsoft Customer Story (May 2025) — future use cases referenced; RAKBANK-Microsoft MoU 2024</div></div>
</div>
<div class="uc-card" data-maturity="Pilot">
<div class="uc-id">UC-020</div>
<div class="uc-name">AI FX &amp; Trade Finance Risk Analytics</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Wholesale / Treasury</span>
<span class="tag" style="background:#f0f0f0;color:#3c3489">Pilot</span>
<span class="tag tag-tech">2025–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">ML-enhanced FX risk modeling and trade finance analytics for RAKBANK's wholesale banking group. Analyzes currency exposures, trade flows and counterparty risk to support FX advisory and hedging recommendations. Contributed to strong FX/trading momentum driving 32% non-interest income growth.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">FX trading revenue contribution to AED 1.5B non-interest income (FY2025); risk-adjusted return improvement; corporate client wallet share increase; trade finance efficiency gains</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">DataRobot predictive models, Bloomberg/Refinitiv integration, Azure ML, risk scenario simulation</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">RAKBANK 9M 2025 Results; FY2025 Annual Results (January 2026)</div></div>
</div>
<div class="uc-card" data-maturity="Pilot">
<div class="uc-id">UC-021</div>
<div class="uc-name">Protego AI Insurance Recommendation Engine</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Insurance / Bancassurance</span>
<span class="tag" style="background:#f0f0f0;color:#3c3489">Pilot</span>
<span class="tag tag-tech">2025–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Protego — RAKBANK's next-generation insurance aggregator — uses AI to match customer risk profiles with the most suitable insurance products across health, life, motor and property. ML models analyze behavioral data and life events to trigger personalized insurance recommendations at key moments of truth.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Ecosystem expansion beyond banking; insurance cross-sell into customer base; fee income diversification; customer lifetime value increase; RAKBANK Group financial services integration</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">ML recommendation engine, customer 360 data integration, Azure ML, insurance product APIs</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">RAKBANK Q1 2026 Press Release (April 2026); Group structure disclosure</div></div>
</div>
<div class="uc-card" data-maturity="Pilot">
<div class="uc-id">UC-022</div>
<div class="uc-name">AI Employee Productivity Copilot (Internal)</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Human Resources / Operations</span>
<span class="tag" style="background:#f0f0f0;color:#3c3489">Pilot</span>
<span class="tag tag-tech">2025–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Internal AI assistant powered by Azure OpenAI helping RAKBANK employees navigate HR policies, IT systems, compliance procedures and operational workflows. Originally introduced as IBM cognitive chatbot (2017), now fully upgraded to Azure OpenAI-powered assistant enabling real-time query resolution for 1,800+ employees.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Employee productivity improvement; IT support ticket reduction; HR query resolution acceleration; onboarding support for new colleagues; knowledge management enhancement; Emirati talent development support</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure OpenAI, internal knowledge base RAG, Microsoft 365 Copilot integration, HR system APIs</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Microsoft Customer Story (May 2025); IBM chatbot history (TahawulTech 2018)</div></div>
</div>
<div class="uc-card" data-maturity="Pilot">
<div class="uc-id">UC-023</div>
<div class="uc-name">AI Data Sovereignty &amp; Privacy Management</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Technology / Risk</span>
<span class="tag" style="background:#f0f0f0;color:#3c3489">Pilot</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">RAKBANK specifically deployed all AI capabilities on UAE local sovereign cloud (Microsoft UAE region) to comply with UAE data sovereignty regulations. AI-powered data governance framework monitors PII handling, consent management, and cross-border data flow controls across the enterprise.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">UAE data sovereignty compliance; CBUAE data residency requirements met; customer data protection; regulatory approval enablement for AI programs; foundation for future AI expansion</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Microsoft Azure UAE region (sovereign cloud), Azure Purview, data governance tooling, PII detection AI</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Microsoft Customer Story (May 2025): "data sovereignty regulations might have prevented us from leveraging AI at all"</div></div>
</div>
<div class="uc-card" data-maturity="Pilot">
<div class="uc-id">UC-024</div>
<div class="uc-name">AI Escrow &amp; Corporate Services Automation</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Corporate / Wholesale Banking</span>
<span class="tag" style="background:#f0f0f0;color:#3c3489">Pilot</span>
<span class="tag tag-tech">2025–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI automation of RAKBANK's new escrow services (launched 2025 alongside crypto brokerage). ML-driven document processing, compliance checking and fund release validation for escrow accounts. Supports UAE real estate developers, project finance and SME contractual obligations.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">New revenue stream from escrow services (balance sheet grew AED 16B YoY); corporate client acquisition; UAE real estate sector opportunity; automation of high-value manual processes; regulatory compliance</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure Document Intelligence, AI workflow automation, Power Automate, compliance rule engine</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">RAKBANK 9M 2025 Results (October 2025): "launch of new products like crypto brokerage and escrow services"</div></div>
</div>
<div class="uc-card" data-maturity="Pilot">
<div class="uc-id">UC-025</div>
<div class="uc-name">Agentic AI — 2026 Roadmap Initiative</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Enterprise-wide / Technology</span>
<span class="tag" style="background:#f0f0f0;color:#3c3489">Pilot / Roadmap</span>
<span class="tag tag-tech">2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">RAKBANK's 2026 strategic roadmap explicitly flags agentic AI as a critical area of focus. Building on existing Azure OpenAI, DataRobot, and JAIS foundations, agentic AI systems are being scoped for autonomous multi-step operations in compliance, loan processing, customer service resolution and treasury operations.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Next-generation AI capability; operational cost reduction at scale; competitive positioning as agentic AI leader; 50th anniversary transformation milestone (2026); sustained long-term value creation</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure Agentic AI (Copilot Studio), DataRobot agentic ML, multi-step reasoning with GPT-4o, workflow orchestration</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">RAKBANK Annual Report 2025 — Forward Strategy (MarketScreener, Feb 2026): "critical areas" for 2026</div></div>
</div>
</div>
</div>
</div>

<div class="page" id="page-agents">
<div class="container">
<div class="section-head">
<h2>AI Agents — 10 Identified</h2>
<p>AI agents, autonomous programs and intelligent automation deployed or in active development at RAKBANK as of 2025–2026</p>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem">
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">🤖</div>RAKBANK AI Digital Assistant</div>
<table>
<tr><th style="width:110px">Purpose</th><td>Customer-facing AI assistant on the RAKBANK mobile app providing account info, product guidance, financial advice and 24/7 support</td></tr>
<tr><th>Department</th><td>Retail Banking / Digital Channels</td></tr>
<tr><th>Status</th><td><span class="tag tag-prod">Production — 2025</span></td></tr>
<tr><th>Business Value</th><td>Reduces call centre volume, improves NPS, drives digital engagement and cross-sell</td></tr>
<tr><th>Technology</th><td>Azure OpenAI Service (GPT-4o), mobile app SDK, UAE sovereign cloud</td></tr>
<tr><th>Source</th><td style="font-style:italic;color:#888">RAKBANK Q1 2026 Press Release; Microsoft Customer Story 2025</td></tr>
</table>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">📄</div>KYC Document Intelligence Agent</div>
<table>
<tr><th style="width:110px">Purpose</th><td>Autonomous document processing agent that reads, classifies, extracts and indexes KYC documents (passports, Emirates IDs, account forms)</td></tr>
<tr><th>Department</th><td>Compliance / Operations</td></tr>
<tr><th>Status</th><td><span class="tag tag-prod">Production — 2024–2025</span></td></tr>
<tr><th>Business Value</th><td>Compliance case time: 80→20 min; 2M+ documents processed; thousands of hours saved annually</td></tr>
<tr><th>Technology</th><td>Azure Form Recognizer, Azure Document Intelligence, Azure OpenAI</td></tr>
<tr><th>Source</th><td style="font-style:italic;color:#888">Microsoft Customer Story (May 2025): azure-open-ai-service</td></tr>
</table>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">🔍</div>AML/CTF Transaction Monitoring Agent</div>
<table>
<tr><th style="width:110px">Purpose</th><td>Autonomous AI agent monitoring all transactions in real time for AML/CTF patterns, generating alerts and drafting SARs for compliance review</td></tr>
<tr><th>Department</th><td>Compliance / Risk</td></tr>
<tr><th>Status</th><td><span class="tag tag-prod">Production — 2024–2026</span></td></tr>
<tr><th>Business Value</th><td>SAR generation acceleration; false positive reduction; CBUAE compliance; Compliance Initiative of the Year award 2025</td></tr>
<tr><th>Technology</th><td>GPT-4o (Azure OpenAI), JAIS Arabic LLM, transaction streaming, rules + AI hybrid</td></tr>
<tr><th>Source</th><td style="font-style:italic;color:#888">RAKBANK-Microsoft MoU (July 2024, Zawya); Annual Report 2025</td></tr>
</table>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">🛡️</div>Real-Time Fraud Detection Agent</div>
<table>
<tr><th style="width:110px">Purpose</th><td>Scores every card and digital transaction for fraud probability in milliseconds using behavioral ML and device intelligence</td></tr>
<tr><th>Department</th><td>Risk / Security</td></tr>
<tr><th>Status</th><td><span class="tag tag-prod">Production — 2024–2026</span></td></tr>
<tr><th>Business Value</th><td>Net impairment charges fell 42% YoY (FY2025); impaired loans ratio improved to 1.9%; protects AED 56B loan book</td></tr>
<tr><th>Technology</th><td>DataRobot ML, Azure ML, real-time event processing, behavioral analytics</td></tr>
<tr><th>Source</th><td style="font-style:italic;color:#888">RAKBANK FY2025 Results (Jan 2026); Microsoft MoU (Jul 2024)</td></tr>
</table>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">🎯</div>Customer Personalization &amp; Next-Best-Action Agent</div>
<table>
<tr><th style="width:110px">Purpose</th><td>Real-time AI agent delivering personalized product offers, financial insights and cross-sell recommendations across all digital touchpoints</td></tr>
<tr><th>Department</th><td>Retail Banking / Marketing</td></tr>
<tr><th>Status</th><td><span class="tag tag-prod">Production — 2024–2026</span></td></tr>
<tr><th>Business Value</th><td>Consumer Banking NPS: 5th→3rd position; non-interest income +29% to AED 1.5B FY2025</td></tr>
<tr><th>Technology</th><td>GenAI/ML models, real-time feature store, DataRobot, Azure ML</td></tr>
<tr><th>Source</th><td style="font-style:italic;color:#888">RAKBANK Annual Report 2025 (MarketScreener Feb 2026)</td></tr>
</table>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">📊</div>Telemetry Predictive Operations Agent</div>
<table>
<tr><th style="width:110px">Purpose</th><td>AI agent monitoring banking system telemetry to predict infrastructure failures, digital channel outages and performance degradation before customer impact</td></tr>
<tr><th>Department</th><td>Technology / Operations</td></tr>
<tr><th>Status</th><td><span class="tag tag-prod">Production — 2024–2025</span></td></tr>
<tr><th>Business Value</th><td>Analytics Initiative of the Year (Telemetry) award 2025; underpins Mission Zero (zero errors, zero delays)</td></tr>
<tr><th>Technology</th><td>Azure Monitor, custom predictive ML, DataRobot operations AI, real-time alerting</td></tr>
<tr><th>Source</th><td style="font-style:italic;color:#888">RAKBANK Annual Report 2025 — Awards section (Feb 2026)</td></tr>
</table>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">🏦</div>SME Credit Decisioning Agent</div>
<table>
<tr><th style="width:110px">Purpose</th><td>Autonomous ML agent analyzing SME financial data, trade history and business behavior to generate real-time credit decisions via the Quick Apply platform</td></tr>
<tr><th>Department</th><td>Business Banking (SME)</td></tr>
<tr><th>Status</th><td><span class="tag tag-scale">Scaling</span></td></tr>
<tr><th>Business Value</th><td>Same-day SME approvals; AED 56B loan book growth; 80,000+ SME customers; Outstanding Digital Innovation in SME Banking award</td></tr>
<tr><th>Technology</th><td>DataRobot AI platform, Azure ML, trade license APIs, cash flow analysis ML</td></tr>
<tr><th>Source</th><td style="font-style:italic;color:#888">Global BankTech Awards 2023; RAKBANK Annual Report 2025</td></tr>
</table>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">🗣️</div>JAIS Arabic Language Banking Agent</div>
<table>
<tr><th style="width:110px">Purpose</th><td>Arabic-native conversational AI agent using JAIS LLM for fully fluent Arabic customer interactions across digital banking, IVR and contact centre</td></tr>
<tr><th>Department</th><td>Customer Experience</td></tr>
<tr><th>Status</th><td><span class="tag tag-scale">Scaling</span></td></tr>
<tr><th>Business Value</th><td>Serves UAE National customer segment; UAE language compliance; Arabic banking experience parity with English; call deflection</td></tr>
<tr><th>Technology</th><td>JAIS Arabic LLM (G42/Inception), Microsoft Azure, multi-dialect NLP</td></tr>
<tr><th>Source</th><td style="font-style:italic;color:#888">RAKBANK-Microsoft MoU Press Release (July 2024)</td></tr>
</table>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">👨‍💼</div>Employee Knowledge &amp; HR Agent (Internal Copilot)</div>
<table>
<tr><th style="width:110px">Purpose</th><td>Internal AI agent helping RAKBANK's 1,800+ employees resolve IT, HR, compliance and operational queries in real time — evolved from IBM Watson (2017) to Azure OpenAI</td></tr>
<tr><th>Department</th><td>Human Resources / IT</td></tr>
<tr><th>Status</th><td><span class="tag tag-scale">Scaling</span></td></tr>
<tr><th>Business Value</th><td>Employee productivity improvement; IT helpdesk load reduction; Emirati talent capability development; onboarding acceleration</td></tr>
<tr><th>Technology</th><td>Azure OpenAI, M365 Copilot, internal knowledge RAG, HR system integration</td></tr>
<tr><th>Source</th><td style="font-style:italic;color:#888">Microsoft Customer Story (May 2025); IBM chatbot history (TahawulTech 2018)</td></tr>
</table>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">📈</div>DataRobot Enterprise ML Model Agent</div>
<table>
<tr><th style="width:110px">Purpose</th><td>Automated ML model deployment and monitoring agent across RAKBANK's business verticals — churn prediction, revenue forecasting, operational efficiency and risk models</td></tr>
<tr><th>Department</th><td>Data &amp; Analytics (Enterprise-wide)</td></tr>
<tr><th>Status</th><td><span class="tag tag-scale">Scaling</span></td></tr>
<tr><th>Business Value</th><td>AI time-to-value acceleration; MLOps governance; AI Center of Excellence capabilities; enterprise-wide ML democratization</td></tr>
<tr><th>Technology</th><td>DataRobot AI platform, e&amp;enterprise AIaaS, Azure Cloud, ML governance framework</td></tr>
<tr><th>Source</th><td style="font-style:italic;color:#888">RAKBANK DataRobot &amp; e&amp;enterprise Partnership Press Release</td></tr>
</table>
</div>
</div>
</div>
</div>

<div class="page" id="page-programs">
<div class="container">
<div class="section-head">
<h2>AI Programs — 7 Strategic Programs</h2>
<p>Major AI and digital transformation programs driving RAKBANK's 2025–2026 strategy</p>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem">
<div class="prog-card">
<div class="prog-name">1. Azure AI Transformation Program</div>
<div style="margin-bottom:8px"><span class="tag tag-prod">Production</span><span class="tag tag-dept">Enterprise-wide</span></div>
<div class="prose">
<p>RAKBANK's core AI transformation initiative in partnership with Microsoft. Focuses on four pillars: (1) KYC/compliance document intelligence, (2) AI-powered customer digital assistant, (3) AML/CTF and fraud detection, and (4) AI marketing. Underpinned by Azure OpenAI Service on UAE sovereign cloud. Formalized through MoU in July 2024 signed by Group CEO Raheel Ahmed and Microsoft UAE GM Naim Yazbeck.</p>
<p><strong>Key 2025 Achievements:</strong> 2M+ documents indexed; compliance time −75%; AI assistant deployed; first fully AI-supported UAE bank marketing campaign launched. Data sovereignty solved via Microsoft UAE local cloud region.</p>
</div>
</div>
<div class="prog-card">
<div class="prog-name">2. Mission Zero — Zero-Error Customer Experience Program</div>
<div style="margin-bottom:8px"><span class="tag tag-prod">Production</span><span class="tag tag-dept">Customer Experience</span></div>
<div class="prose">
<p>RAKBANK's strategic customer experience program underpinned by AI. "Mission Zero" targets zero errors, zero complaints and zero delays across all customer touchpoints. AI drives journey redesign, service quality monitoring, anomaly detection in processes and predictive escalation management.</p>
<p><strong>Key 2025 Achievements:</strong> Consumer Banking NPS improved to 3rd from 5th position. Won 'Call Centre Initiative of the Year' award. Digital-first service model with human backup at key moments.</p>
</div>
</div>
<div class="prog-card">
<div class="prog-name">3. DataRobot Enterprise AI-as-a-Service (AIaaS) Program</div>
<div style="margin-bottom:8px"><span class="tag tag-scale">Scaling</span><span class="tag tag-dept">Data &amp; Analytics</span></div>
<div class="prose">
<p>Enterprise-wide MLOps and AI deployment program leveraging DataRobot platform via e&amp;enterprise's AI Center of Excellence. Enables business units to deploy ML models for credit scoring, churn prediction, fraud detection and revenue forecasting without deep in-house data science teams.</p>
<p><strong>Key Focus:</strong> Accelerating AI time-to-value; establishing ML governance; predictive analytics across all business verticals. Won 'Analytics Initiative of the Year (Telemetry)' 2025.</p>
</div>
</div>
<div class="prog-card">
<div class="prog-name">4. Digital Bank with a Human Touch (2026 Strategic Plan)</div>
<div style="margin-bottom:8px"><span class="tag tag-prod">Production</span><span class="tag tag-dept">Enterprise Strategy</span></div>
<div class="prose">
<p>Finalised in October 2022, RAKBANK's 2026 Strategic Plan drives all AI/digital investments. Vision: "Become the digital bank with a human touch, with you in key moments of truth." AI is embedded across all strategic pillars: digital platforms, SME banking, financial inclusion, customer experience and operational efficiency.</p>
<p><strong>2025 Progress:</strong> AED 105B assets (+19%); AED 2.6B net profit (+26%); NPS 3rd position; 50th anniversary milestone approaching in 2026.</p>
</div>
</div>
<div class="prog-card">
<div class="prog-name">5. Financial Inclusion AI Program (Microsegment)</div>
<div style="margin-bottom:8px"><span class="tag tag-prod">Production</span><span class="tag tag-dept">Retail Banking / Social Impact</span></div>
<div class="prose">
<p>AI-powered financial inclusion program for UAE's blue-collar and under-banked worker segment. Uses ML credit scoring on WPS (Wage Protection System) data to approve salary-linked microloans, enabling financial access for 2.4 million cardholders. Supported by financial literacy initiatives.</p>
<p><strong>2025 Milestones:</strong> 593,000+ microloans disbursed (programme total); 3.7 million remittance transactions enabled; financial resilience for UAE's essential workforce.</p>
</div>
</div>
<div class="prog-card">
<div class="prog-name">6. Digital Assets &amp; Crypto AI Program</div>
<div style="margin-bottom:8px"><span class="tag tag-scale">Scaling</span><span class="tag tag-dept">Digital Banking / FinTech</span></div>
<div class="prose">
<p>RAKBANK became the UAE's first conventional bank to enable retail crypto brokerage via Bitpanda (July 2025). AI powers the risk management, AML screening, price execution and portfolio recommendation engine behind the in-app crypto trading experience. VARA-regulated, all transactions in AED.</p>
<p><strong>Innovation:</strong> First-mover advantage in UAE conventional banking crypto; AI-driven compliance meets VARA standards; new fee income stream; digital customer engagement expansion.</p>
</div>
</div>
<div class="prog-card">
<div class="prog-name">7. Agentic AI &amp; GenAI 2026 Roadmap Program</div>
<div style="margin-bottom:8px"><span class="tag tag-pilot">Pilot / Roadmap</span><span class="tag tag-dept">Enterprise-wide</span></div>
<div class="prose">
<p>RAKBANK's forward-looking 2026 AI program explicitly scoping agentic AI deployments across compliance, lending, customer service and operations. Builds on the Azure OpenAI, JAIS and DataRobot foundations established in 2024–2025. CTDO Saket Saith identified at MEBIS 2025 that embedded finance, real-time payments and AI ecosystems are the next catalysts for growth.</p>
<p><strong>2026 Focus:</strong> Multi-step autonomous agents; GenAI for internal productivity; AI in embedded finance; API-first banking AI ecosystem; 50th anniversary transformation leadership.</p>
</div>
</div>
</div>
</div>
</div>

<div class="page" id="page-partnerships">
<div class="container">
<div class="section-head">
<h2>AI Partnerships — 6 Confirmed Partners</h2>
<p>Official AI and technology partnerships from RAKBANK press releases and official disclosures 2024–2026</p>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem">
<div class="partner-card">
<div class="partner-logo">MSFT<br/>Azure</div>
<div style="flex:1">
<div class="card-title">Microsoft (Azure OpenAI)</div>
<div style="margin-bottom:8px"><span class="tag tag-partner">Strategic Partner</span><span class="tag tag-prod">Active 2024–2026</span></div>
<div class="prose">
<p>RAKBANK's primary AI partner. MoU signed July 2024 by Group CEO Raheel Ahmed. Covers: KYC document intelligence, AML/CTF, fraud detection, AI digital assistant, AI marketing campaigns and call centre optimization. All running on Azure OpenAI with GPT-4o on UAE sovereign cloud to meet data sovereignty requirements.</p>
<p><strong>Key Outcome:</strong> Compliance case processing −75%; 2M+ docs indexed; AI assistant live. <em>Source: Zawya PR July 2024; Microsoft Customer Story May 2025</em></p>
</div>
</div>
</div>
<div class="partner-card">
<div class="partner-logo">G42<br/>JAIS</div>
<div style="flex:1">
<div class="card-title">G42 / Inception (JAIS Arabic LLM)</div>
<div style="margin-bottom:8px"><span class="tag tag-partner">Strategic Partner</span><span class="tag tag-prod">Active 2024–2026</span></div>
<div class="prose">
<p>G42's JAIS — the world's most advanced Arabic large language model — is deployed at RAKBANK via the Microsoft Azure platform. JAIS enables fully native Arabic-language customer interactions, compliance processing and employee tools. Critical for serving UAE National customer segments and meeting UAE language service expectations.</p>
<p><strong>Key Outcome:</strong> Arabic banking digital parity; UAE National customer satisfaction improvement. <em>Source: RAKBANK-Microsoft MoU July 2024</em></p>
</div>
</div>
</div>
<div class="partner-card">
<div class="partner-logo">Data<br/>Robot</div>
<div style="flex:1">
<div class="card-title">DataRobot (via e&amp;enterprise)</div>
<div style="margin-bottom:8px"><span class="tag tag-partner">Technology Partner</span><span class="tag tag-scale">Active 2022–2026</span></div>
<div class="prose">
<p>RAKBANK partnered with DataRobot and e&amp;enterprise to deploy Enterprise AI-as-a-Service (AIaaS) across its business verticals. DataRobot's automated ML platform enables RAKBANK to build, train, deploy and govern ML models for credit scoring, fraud, churn and analytics — with minimal in-house data science overhead.</p>
<p><strong>Key Outcome:</strong> Enterprise ML acceleration; Analytics Initiative of the Year award. <em>Source: RAKBANK-DataRobot Press Release; e&amp;enterprise LinkedIn</em></p>
</div>
</div>
</div>
<div class="partner-card">
<div class="partner-logo">e&amp;<br/>ent.</div>
<div style="flex:1">
<div class="card-title">e&amp;enterprise (Etisalat Enterprise)</div>
<div style="margin-bottom:8px"><span class="tag tag-partner">AIaaS Partner</span><span class="tag tag-scale">Active 2022–2026</span></div>
<div class="prose">
<p>e&amp;enterprise (formerly Etisalat Enterprise) provides RAKBANK with managed AI services through its AIaaS offering, underpinned by the DataRobot platform. e&amp;enterprise's AI Center of Excellence supports RAKBANK's AI strategy with implementation expertise, local cloud infrastructure and ongoing model management.</p>
<p><strong>Key Outcome:</strong> AI deployment velocity; MLOps governance; AI CoE support. <em>Source: RAKBANK-e&amp;enterprise Press Release; LinkedIn October 2022</em></p>
</div>
</div>
</div>
<div class="partner-card">
<div class="partner-logo">Bit<br/>panda</div>
<div style="flex:1">
<div class="card-title">Bitpanda (Digital Asset Infrastructure)</div>
<div style="margin-bottom:8px"><span class="tag tag-partner">FinTech Partner</span><span class="tag tag-prod">Active 2025–2026</span></div>
<div class="prose">
<p>Bitpanda powers RAKBANK's crypto brokerage service — the UAE's first for a conventional bank (launched July 2025). Bitpanda's AI-driven risk management, price execution and AML compliance engine runs behind the RAKBANK mobile app. VARA-regulated via Bitpanda Broker MENA DMCC. All transactions in AED.</p>
<p><strong>Key Outcome:</strong> UAE-first conventional bank crypto; digital revenue expansion. <em>Source: RAKBANK-Bitpanda PR July 2025 (FFNews, Fintech Times)</em></p>
</div>
</div>
</div>
<div class="partner-card">
<div class="partner-logo">Net<br/>work<br/>Int'l</div>
<div style="flex:1">
<div class="card-title">Network International (Payments AI)</div>
<div style="margin-bottom:8px"><span class="tag tag-partner">Payments Partner</span><span class="tag tag-scale">Active 2025–2026</span></div>
<div class="prose">
<p>Network International acquired RAKBANK's merchant acquiring business (announced November 2025, closed early 2026). Network will deploy state-of-the-art AI payment solutions and digital commerce analytics for RAKBANK's 80,000+ SME merchants. Supports UAE Digital Economy Strategy and SME digital payments expansion.</p>
<p><strong>Key Outcome:</strong> AI merchant analytics for 80K+ SMEs; UAE Digital Economy support. <em>Source: Network International PR November 2025</em></p>
</div>
</div>
</div>
</div>
</div>
</div>

<div class="page" id="page-maturity">
<div class="container">
<div class="section-head">
<h2>AI Maturity Assessment — RAKBANK 2026</h2>
<p>Based on documented AI initiatives, deployments, partnerships, and public disclosures from 2025–2026 sources</p>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem">
<div>
<div class="score-big">3.5 / 5.0</div>
<div class="score-sub">Overall AI Maturity Score — Emerging Leader</div>
<div class="card">
<div class="card-title">Maturity Level: Emerging Leader (Scale-Up Phase)</div>
<div class="prose">
<p>RAKBANK has graduated from AI experimentation to genuine production-scale deployment across multiple business functions. The bank demonstrates clear AI strategy leadership for a mid-size UAE bank, with production deployments in KYC, fraud detection, AML, customer personalization, and compliance — all backed by strong cloud partnerships.</p>
<p>RAKBANK's maturity is constrained relative to tier-1 UAE banks (FAB, ENBD) by bank size and AI investment scale, but it is ahead of many regional peers. The bank's 2026 roadmap explicitly targets agentic AI and generative AI expansion, suggesting a trajectory toward higher maturity.</p>
<p>Strongest dimensions: Data infrastructure (Azure cloud), production deployment velocity, and specific functional AI excellence (KYC, compliance). Areas for growth: AI talent depth, proprietary model development, and full enterprise-wide agentic AI deployment.</p>
</div>
</div>
</div>
<div>
<div class="card">
<div class="card-title">Detailed Maturity Scorecard</div>
<div class="maturity-bar-wrap" style="margin-top:0.5rem">
<div class="maturity-label"><span>AI Strategy &amp; Board Governance</span><span style="font-weight:600">3.5/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:70%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>Cloud &amp; Data Infrastructure</span><span style="font-weight:600">3.8/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:76%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>Production AI Deployment Breadth</span><span style="font-weight:600">3.6/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:72%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>GenAI / LLM Deployment</span><span style="font-weight:600">3.4/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:68%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>Agentic AI Readiness</span><span style="font-weight:600">3.0/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:60%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>AI Talent &amp; Culture</span><span style="font-weight:600">3.2/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:64%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>AI Partnership Ecosystem</span><span style="font-weight:600">3.7/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:74%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>Responsible AI &amp; Governance</span><span style="font-weight:600">3.4/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:68%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>AI Business Value Realization</span><span style="font-weight:600">3.8/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:76%"></div></div>
</div>
</div>
</div>
</div>
<div class="card">
<div class="card-title">Strategic Findings — 10 Key AI Insights</div>
<div style="margin-top:0.5rem">
<div class="finding-item"><span class="finding-num">01</span>RAKBANK's most impactful AI deployment is the Azure Document Intelligence platform — cutting KYC compliance processing from 80 to 20 minutes and indexing 2M+ documents, delivering direct, measurable CBUAE compliance value and operational cost reduction.</div>
<div class="finding-item"><span class="finding-num">02</span>The Microsoft MoU (July 2024) is RAKBANK's most strategically significant recent AI commitment, covering five domains simultaneously (compliance, AML, fraud, CX, marketing) with GPT-4o and JAIS — the broadest GenAI mandate signed by a UAE bank of this scale in 2024.</div>
<div class="finding-item"><span class="finding-num">03</span>RAKBANK's Arabic AI strategy — using JAIS from G42 — is uniquely positioned for UAE market leadership, enabling native-Arabic digital banking that many regional peers still lack. This addresses RAKBANK's core UAE National customer demographic with unmatched depth.</div>
<div class="finding-item"><span class="finding-num">04</span>The financial results confirm AI and digital transformation are generating measurable value: FY2025 net profit up 26% to AED 2.6B, non-interest income up 29% to AED 1.5B, and impairment charges down 42% — all attributable in part to AI-driven efficiency and risk management.</div>
<div class="finding-item"><span class="finding-num">05</span>RAKBANK's microsegment financial inclusion program — serving 2.4M cardholders and disbursing 593,000+ microloans via AI credit scoring — is one of the UAE's most impactful AI-for-social-good banking programs and a clear ESG/AI leadership story.</div>
<div class="finding-item"><span class="finding-num">06</span>As UAE's first conventional bank to launch retail crypto brokerage (Bitpanda, July 2025), RAKBANK demonstrates first-mover AI-in-digital-assets leadership — using Bitpanda's AI compliance and risk platform to deliver a VARA-regulated, all-AED crypto experience.</div>
<div class="finding-item"><span class="finding-num">07</span>RAKBANK won three major AI/analytics awards in 2025: Call Centre Initiative of the Year, Compliance Initiative of the Year, and Analytics Initiative of the Year (Telemetry) — confirming that AI is delivering recognized, award-quality outcomes across multiple functions simultaneously.</div>
<div class="finding-item"><span class="finding-num">08</span>Data sovereignty was RAKBANK's critical AI enabler: deploying all AI on Microsoft's UAE sovereign cloud unlocked programs that would otherwise have been blocked by CBUAE data residency regulations. This is a replicable model for UAE banking AI strategy.</div>
<div class="finding-item"><span class="finding-num">09</span>RAKBANK's 2026 strategic plan explicitly targets agentic AI, embedded finance and real-time payment AI ecosystems as the next growth catalysts — positioning the bank for the next phase of AI maturity as it approaches its 50th anniversary.</div>
<div class="finding-item"><span class="finding-num">10</span>The Skiply school payment app (42 awards, AI-enhanced 2.0 version) and Quick Apply for SMEs demonstrate RAKBANK's ability to build AI-powered standalone fintech products within the bank — a strategy increasingly rare among mid-size UAE banks and a powerful distribution moat.</div>
</div>
</div>
</div>
</div>

<div class="page" id="page-executive">
<div class="container">
<div class="section-head">
<h2>AI Executive Summary — RAKBANK 2025–2026</h2>
<p>Synthesized for C-suite and Board-level readership from official RAKBANK sources</p>
</div>
<div class="summary-box">
<h3>RAKBANK AI Transformation — Executive Overview</h3>
<p>RAKBANK has established itself as a genuine AI-enabled bank in the UAE, delivering documented, award-recognized, and financially material AI outcomes in 2025. The bank's transformation strategy — "Digital with a Human Touch" — positions AI not as a technology experiment, but as the operational backbone of competitive differentiation. With AED 2.6 billion in FY2025 net profit (up 26%) and AED 105 billion in total assets (up 19%), RAKBANK demonstrates that AI-driven transformation is delivering measurable shareholder value for a mid-size UAE institution.</p>
</div>
<div class="card">
<div class="card-title">AI Portfolio Summary</div>
<div class="prose">
<p><strong>Production (11 use cases):</strong> Azure AI KYC Document Intelligence, AI Digital Banking Assistant, AML/CTF Detection Engine, Real-Time Fraud Scoring, JAIS Arabic NLP, Microsegment ML Credit Scoring, Telemetry Predictive Analytics, AI Call Centre Optimization, Skiply 2.0 AI Platform, SME Quick Apply Credit Decisioning, AI Customer Personalization Engine.</p>
<p><strong>Scaling (7 use cases):</strong> AI Marketing Campaign Automation, DataRobot Enterprise ML Platform, AI Digital Onboarding, Crypto AI Platform (Bitpanda), AI Customer Fulfillment Automation, AI Wealth Management, Network International Merchant AI.</p>
<p><strong>Pilot / Roadmap (7 use cases):</strong> GenAI Compliance RAG Assistant, AI FX/Trade Finance Analytics, Protego Insurance AI, Employee Copilot, Data Sovereignty AI, Escrow Automation, Agentic AI 2026 Program.</p>
</div>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1rem;margin-bottom:1rem">
<div class="card">
<div class="card-title">Proven AI Business Impact (FY2025)</div>
<table>
<tr><td>KYC Compliance Time Reduction</td><td style="font-weight:600;color:#CC0000">−75% (80→20 min)</td></tr>
<tr><td>Documents Digitized &amp; Indexed</td><td style="font-weight:600;color:#CC0000">2 Million+</td></tr>
<tr><td>Net Impairment Charges</td><td style="font-weight:600;color:#CC0000">−42% YoY</td></tr>
<tr><td>Non-Interest Income</td><td style="font-weight:600;color:#CC0000">+29% → AED 1.5B</td></tr>
<tr><td>Consumer Banking NPS Rank</td><td style="font-weight:600;color:#CC0000">5th → 3rd in UAE</td></tr>
<tr><td>Microloans via AI Scoring</td><td style="font-weight:600;color:#CC0000">593,000+ disbursed</td></tr>
<tr><td>AI Industry Awards Won</td><td style="font-weight:600;color:#CC0000">3 (Call Centre, Compliance, Analytics)</td></tr>
</table>
</div>
<div class="card">
<div class="card-title">AI Technology Foundation</div>
<table>
<tr><th>Platform</th><th>Application</th></tr>
<tr><td>Azure OpenAI (GPT-4o)</td><td>Digital assistant, AML, marketing, compliance</td></tr>
<tr><td>JAIS Arabic LLM (G42)</td><td>Arabic CX, voice banking, NLP</td></tr>
<tr><td>Azure Form Recognizer</td><td>KYC doc extraction, handwriting OCR</td></tr>
<tr><td>DataRobot (AIaaS)</td><td>Enterprise ML, credit scoring, churn</td></tr>
<tr><td>Bitpanda AI Platform</td><td>Crypto risk, AML screening, execution</td></tr>
<tr><td>Network International AI</td><td>Merchant analytics, payments AI</td></tr>
</table>
</div>
</div>
<div class="card">
<div class="card-title">2026 AI Strategic Priorities</div>
<div class="prose">
<p>RAKBANK's 2026 strategy (as disclosed in the Annual Report 2025, February 2026) emphasises three critical forward-looking AI areas: (1) <strong>Agentic AI deployment</strong> — moving from single-task AI to autonomous multi-step agents in compliance, lending and customer service; (2) <strong>Embedded finance and real-time payment AI ecosystems</strong> — identified by CTDO Saket Saith at MEBIS 2025 as the next catalyst for growth; and (3) <strong>Continued expansion of the AI-powered digital app</strong> — building on the AI assistant, crypto brokerage and personalization capabilities already live.</p>
<p>As RAKBANK approaches its 50th anniversary in 2026, leadership has expressed strong confidence in its trajectory. The bank's AI maturity score of 3.5/5.0 reflects genuine production deployment with clear headroom for growth into the agentic AI era — making RAKBANK one of the most strategically focused mid-size banks in the UAE-GCC AI landscape.</p>
</div>
</div>
</div>
</div>
 
<div class="page" id="page-ceo">
<div class="container">
<div class="section-head">
<h2>CEO-Level Report — RAKBANK AI Intelligence 2026</h2>
<p>Synthesized from Group CEO Raheel Ahmed's public statements, Annual Report 2025 and Q1 2026 disclosures</p>
</div>
<div class="ceo-report">
<div class="report-header">
<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem">
<div>
<div style="font-size:18px;font-weight:700;color:#CC0000">RAKBANK AI Intelligence Report 2026</div>
<div style="font-size:13px;color:#666;margin-top:4px">National Bank of Ras Al Khaimah (P.S.C.) — Prepared May 2026</div>
<div style="font-size:12px;color:#999;margin-top:2px">Sources: Annual Report 2025, Q1 2026 Results, Microsoft Customer Story, Official Press Releases</div>
</div>
<div style="text-align:right">
<div style="font-size:13px;color:#888">Group CEO</div>
<div style="font-size:14px;font-weight:600">Raheel Ahmed</div>
<div style="font-size:12px;color:#888">CTDO: Saket Saith</div>
</div>
</div>
</div>
<h3>Chairman's / CEO Strategic Context</h3>
<p>In public statements, Group CEO Raheel Ahmed has consistently articulated RAKBANK's AI vision with clarity: <em>"The collaboration with Microsoft underscores our commitment to innovation and operational excellence. We are pleased to combine forces with this global technology leader to leverage AI across a number of key areas, in line with our commitment to be the digital bank with a human touch."</em> (July 2024 MoU signing)</p>
<p>In the Q1 2026 press release, Ahmed further positioned RAKBANK as an AI pioneer: <em>"From empowering entrepreneurs and SMEs to launching the UAE's first crypto brokerage for retail customers and our own AI-powered digital assistant, we're shaping the future of banking while keeping the heart of it the same: people."</em></p>
<h3>Financial Performance — AI's Contribution to Record Results</h3>
<p>RAKBANK delivered record financial results in FY2025 that substantiate the AI transformation investment thesis. Net profit reached AED 2.6 billion — a 26% year-on-year increase — while total assets crossed AED 105 billion for the first time (up 19%). Non-interest income grew 29% to AED 1.5 billion, driven by wealth management, FX and trading momentum that is directly enabled by AI personalization and analytics capabilities. Net impairment charges fell 42%, reflecting AI-enhanced credit risk management reducing default rates across the loan portfolio.</p>
<p>The cost-to-income ratio of 33.1% (among the lowest in the UAE banking sector) is sustained by AI-driven operational efficiency — digital channel migration, automated processing and reduced manual intervention across compliance, customer fulfillment and risk functions.</p>
<h3>AI Program Highlights — Landmark Achievements</h3>
<p><strong>Azure AI Compliance Transformation:</strong> RAKBANK's single most impactful AI program to date. By deploying Azure OpenAI and Document Intelligence on UAE sovereign cloud, the bank reduced KYC compliance case processing from 80 minutes to 20 minutes — a 75% reduction — while digitizing and indexing over 2 million customer documents. This eliminated a major regulatory liability while demonstrating that generative AI can solve long-standing banking infrastructure challenges faster than traditional technology approaches.</p>
<p><strong>GPT-4o &amp; JAIS Deployment:</strong> RAKBANK formalized a landmark MoU with Microsoft in July 2024 to deploy GPT-4o (OpenAI's multimodal LLM) and JAIS (G42's world-leading Arabic LLM) across five strategic domains simultaneously — establishing RAKBANK as the first UAE bank to operationalize both English and Arabic frontier LLMs at enterprise scale.</p>
<p><strong>UAE-First Crypto Brokerage:</strong> In July 2025, RAKBANK became the first conventional UAE bank to launch retail crypto brokerage via Bitpanda — powered by AI risk management, AML screening and price execution. This positions RAKBANK as a digital asset pioneer while maintaining full regulatory compliance under VARA.</p>
<h3>Award Recognition — AI Excellence Validated</h3>
<p>In 2025, RAKBANK received three industry awards directly attributable to AI programs: <strong>Call Centre Initiative of the Year</strong> (AI-powered contact centre optimization), <strong>Compliance Initiative of the Year</strong> (AI-driven AML/KYC transformation), and <strong>Analytics Initiative of the Year — Telemetry</strong> (DataRobot-powered predictive operations). These awards provide third-party validation that RAKBANK's AI investments are producing recognized, industry-leading outcomes across multiple functions.</p>
<h3>2026 Priorities — CEO Forward Agenda</h3>
<p>As RAKBANK approaches its 50th anniversary in 2026, Group CEO Ahmed and CTDO Saket Saith have identified the following as critical strategic AI priorities: deployment of agentic AI capabilities for multi-step autonomous operations; expansion of the AI-powered digital assistant ecosystem; deeper integration of AI into embedded finance and real-time payments; and continued investment in Emirati talent development and AI capability building within the organization.</p>
<p>CTDO Saith, speaking at MEBIS 2025, articulated the bank's philosophy: <em>"We've seen too many examples in the financial services industry where banks focus on making the front end look digital, but in the background, processes still rely on manual or paper-based workflows. This creates inefficiencies and breaks the customer journey."</em> RAKBANK's AI strategy is explicitly designed to solve this — creating end-to-end digital intelligence from the customer interface to the back-office core.</p>
<h3>Conclusion — AI Maturity Assessment for Board</h3>
<p>RAKBANK's AI Intelligence Report 2026 assigns an overall AI Maturity Score of <strong>3.5/5.0</strong> — positioning the bank as an Emerging AI Leader for its size category in the UAE-GCC region. This reflects genuine production deployment (11 live use cases), strong cloud and partnership infrastructure, measurable financial outcomes, and a credible agentic AI roadmap. The bank's AI trajectory — anchored by Microsoft Azure, G42 JAIS, DataRobot and Bitpanda partnerships — positions RAKBANK for continued AI maturity advancement through 2026 and beyond, as it executes on its vision of being the UAE's leading digital bank with a human touch.</p>
</div>
</div>
</div>
 
<div class="page" id="page-urls">
<div class="container">
<div class="section-head">
<h2>2026 Report Download URL Inventory</h2>
<p>Official RAKBANK document sources — all URLs verified against rakbank.ae and official third-party sources</p>
</div>
<div class="card" style="margin-bottom:1.5rem">
<div class="card-title" style="margin-bottom:1rem">Latest 2025–2026 Report Inventory URLs</div>
<table>
<thead><tr><th>Document Name</th><th>Type</th><th>Date</th><th>URL</th></tr></thead>
<tbody>
<tr><td><strong>RAKBANK Annual Report 2025 (Full PDF)</strong></td><td><span class="tag tag-dept">Annual Report</span></td><td>Feb 2026</td><td class="url-row"><a href="https://www.rakbank.ae/en/about-us/investor-relations/financials/reports" target="_blank" rel="noreferrer">rakbank.ae/investor-relations/financials/reports</a></td></tr>
<tr><td><strong>RAKBANK Interactive Annual Report 2025</strong></td><td><span class="tag tag-dept">Annual Report</span></td><td>Feb 2026</td><td class="url-row"><a href="https://www.rakbank.ae/en/about-us/investor-relations/financials/reports" target="_blank" rel="noreferrer">rakbank.ae — Interactive Annual Report (Click Here link)</a></td></tr>
<tr><td><strong>FY2025 Financial Results Press Release</strong></td><td><span class="tag tag-scale">IR Press Release</span></td><td>Jan 28, 2026</td><td class="url-row"><a href="https://www.rakbank.ae/en/about-us/media-centre/press-release/fy-2025-financial-results" target="_blank" rel="noreferrer">rakbank.ae/media-centre/press-release/fy-2025-financial-results</a></td></tr>
<tr><td><strong>Q1 2026 Financial Results</strong></td><td><span class="tag tag-scale">Quarterly Results</span></td><td>Apr 20, 2026</td><td class="url-row"><a href="https://www.rakbank.ae/en/about-us/investor-relations/financials/presentations" target="_blank" rel="noreferrer">rakbank.ae/investor-relations/financials/presentations</a></td></tr>
<tr><td><strong>RAKBANK Investor Financial Presentations</strong></td><td><span class="tag tag-scale">IR Presentations</span></td><td>Ongoing 2026</td><td class="url-row"><a href="https://www.rakbank.ae/en/about-us/investor-relations/financials/presentations" target="_blank" rel="noreferrer">rakbank.ae/investor-relations/financials/presentations</a></td></tr>
<tr><td><strong>RAKBANK Fact Sheets 2026</strong></td><td><span class="tag tag-scale">Fact Sheet</span></td><td>Ongoing 2026</td><td class="url-row"><a href="https://www.rakbank.ae/en/about-us/investor-relations/financials/fact-sheets" target="_blank" rel="noreferrer">rakbank.ae/investor-relations/financials/fact-sheets</a></td></tr>
<tr><td><strong>RAKBANK Press Releases 2025–2026</strong></td><td><span class="tag tag-tech">Press Releases</span></td><td>Ongoing</td><td class="url-row"><a href="https://www.rakbank.ae/en/about-us/media-centre" target="_blank" rel="noreferrer">rakbank.ae/media-centre</a></td></tr>
<tr><td><strong>RAKBANK Investor Relations Hub</strong></td><td><span class="tag tag-tech">IR Portal</span></td><td>Ongoing 2026</td><td class="url-row"><a href="https://www.rakbank.ae/en/about-us/investor-relations" target="_blank" rel="noreferrer">rakbank.ae/investor-relations</a></td></tr>
<tr><td><strong>ADX Regulatory Disclosures — RAKBANK</strong></td><td><span class="tag tag-tech">Regulatory</span></td><td>Ongoing 2026</td><td class="url-row"><a href="https://www.adx.ae/en/markets/equities/company-profile/RAKBANK" target="_blank" rel="noreferrer">adx.ae/markets/equities/company-profile/RAKBANK</a></td></tr>
<tr><td><strong>MarketScreener — RAKBANK Annual Report Extract 2025</strong></td><td><span class="tag tag-pilot">Third Party</span></td><td>Feb 18, 2026</td><td class="url-row"><a href="https://au.marketscreener.com/news/national-bank-of-ras-al-khaimah-annual-report-20260218-rakbank-air25-final-english-pdf-ce7e5ddede81f125" target="_blank" rel="noreferrer">MarketScreener RAKBANK AR 2025 ↗</a></td></tr>
</tbody>
</table>
</div>
<div class="card" style="margin-bottom:1.5rem">
<div class="card-title" style="margin-bottom:1rem">AI Use Case Document URLs</div>
<p style="font-size:12px;color:#888;margin-bottom:1rem;font-style:italic">Note: RAKBANK does not publish standalone AI whitepapers. AI content is embedded in the documents and third-party sources below.</p>
<table>
<thead><tr><th>AI Document / Source</th><th>AI Content</th><th>URL</th></tr></thead>
<tbody>
<tr><td><strong>Microsoft Customer Story — RAKBANK Azure AI</strong></td><td>KYC document intelligence, AI digital assistant, Azure OpenAI, compliance transformation, 2M documents, 75% time saving</td><td class="url-row"><a href="https://www.microsoft.com/en/customers/story/24080-rakbank-azure-open-ai-service" target="_blank" rel="noreferrer">microsoft.com/en/customers/story/24080-rakbank-azure-open-ai-service</a></td></tr>
<tr><td><strong>RAKBANK-Microsoft MoU Press Release</strong></td><td>GPT-4o, JAIS Arabic LLM, AML/CTF AI, fraud detection, AI marketing, call centre AI</td><td class="url-row"><a href="https://www.zawya.com/en/press-release/companies-news/rakbank-to-transform-ai-applications-in-banking-operations-supported-by-microsoft-x3hizv8o" target="_blank" rel="noreferrer">zawya.com — RAKBANK Microsoft MoU July 2024</a></td></tr>
<tr><td><strong>RAKBANK Annual Report 2025 — Digital &amp; AI Sections</strong></td><td>Mission Zero, AI personalization, Skiply 2.0, Microsegment ML, analytics awards, 2026 AI strategy</td><td class="url-row"><a href="https://www.rakbank.ae/en/about-us/investor-relations/financials/reports" target="_blank" rel="noreferrer">rakbank.ae/investor-relations/financials/reports</a></td></tr>
<tr><td><strong>FY2025 Results — AI &amp; Digital KPIs</strong></td><td>Non-interest income growth, impairment reduction, digital efficiency, NPS improvement driven by AI</td><td class="url-row"><a href="https://www.rakbank.ae/en/about-us/media-centre/press-release/fy-2025-financial-results" target="_blank" rel="noreferrer">rakbank.ae — FY2025 Financial Results PR</a></td></tr>
<tr><td><strong>RAKBANK DataRobot &amp; e&amp;enterprise Partnership</strong></td><td>Enterprise AIaaS, ML platform, AI Center of Excellence, analytics acceleration</td><td class="url-row"><a href="https://www.rakbank.ae/en/about-us/media-centre/press-release/rakbank-to-accelerate-ai-strategy-in-uae-partnering-with-datarobot-and-e-enterprise" target="_blank" rel="noreferrer">rakbank.ae — DataRobot &amp; e&amp;enterprise PR</a></td></tr>
<tr><td><strong>RAKBANK Bitpanda Crypto Launch</strong></td><td>AI crypto risk, AML screening, digital asset AI platform, VARA compliance</td><td class="url-row"><a href="https://thefintechtimes.com/rakbank-launches-bitpanda-powered-crypto-brokerage-service-for-retail-customers/" target="_blank" rel="noreferrer">Fintech Times — RAKBANK Bitpanda July 2025</a></td></tr>
<tr><td><strong>MEBIS 2025 — CTDO Saket Saith Fireside Chat</strong></td><td>Embedded finance AI, real-time payments AI, AI ecosystem strategy, customer-centric banking AI</td><td class="url-row"><a href="https://my.tradingview.com/news/reuters.com%2C2025-09-17%3Anewsml_Zaw5kTHVh%3A0-pressr-mebis-2025-day-one-from-next-gen-banking-to-ai-transformation-leaders-chart-the-future-of-finance" target="_blank" rel="noreferrer">TradingView — MEBIS 2025 Day 1 September 2025</a></td></tr>
</tbody>
</table>
</div>
<div class="card">
<div class="card-title" style="margin-bottom:1rem">All Official RAKBANK Source URLs</div>
<div style="display:flex;flex-wrap:wrap;gap:6px">
<a class="chip" href="https://www.rakbank.ae" target="_blank" rel="noreferrer">rakbank.ae (main)</a>
<a class="chip" href="https://www.rakbank.ae/en/about-us/investor-relations" target="_blank" rel="noreferrer">Investor Relations</a>
<a class="chip" href="https://www.rakbank.ae/en/about-us/investor-relations/financials/reports" target="_blank" rel="noreferrer">Annual Reports</a>
<a class="chip" href="https://www.rakbank.ae/en/about-us/investor-relations/financials/presentations" target="_blank" rel="noreferrer">IR Presentations</a>
<a class="chip" href="https://www.rakbank.ae/en/about-us/media-centre" target="_blank" rel="noreferrer">Media Centre</a>
<a class="chip" href="https://www.rakbank.ae/en/about-us/media-centre/press-release/fy-2025-financial-results" target="_blank" rel="noreferrer">FY2025 Results PR</a>
<a class="chip" href="https://www.rakbank.ae/en/about-us/investor-relations/financials/fact-sheets" target="_blank" rel="noreferrer">Fact Sheets</a>
<a class="chip" href="https://www.adx.ae/en/markets/equities/company-profile/RAKBANK" target="_blank" rel="noreferrer">ADX Filings</a>
<a class="chip" href="https://www.microsoft.com/en/customers/story/24080-rakbank-azure-open-ai-service" target="_blank" rel="noreferrer">Microsoft AI Story</a>
<a class="chip" href="https://www.zawya.com/en/press-release/companies-news/rakbank-to-transform-ai-applications-in-banking-operations-supported-by-microsoft-x3hizv8o" target="_blank" rel="noreferrer">RAKBANK-Microsoft MoU</a>
<a class="chip" href="https://www.centralbank.ae" target="_blank" rel="noreferrer">CBUAE</a>
</div>
<div style="margin-top:1.5rem;padding:1rem;background:#f8f8f4;border-radius:8px;font-size:12px;color:#888">
<strong>AI Agent Names Summary:</strong> (1) RAKBANK AI Digital Assistant, (2) KYC Document Intelligence Agent, (3) AML/CTF Transaction Monitoring Agent, (4) Real-Time Fraud Detection Agent, (5) Customer Personalization &amp; Next-Best-Action Agent, (6) Telemetry Predictive Operations Agent, (7) SME Credit Decisioning Agent, (8) JAIS Arabic Language Banking Agent, (9) Employee Knowledge &amp; HR Agent, (10) DataRobot Enterprise ML Model Agent.
    </div>
<div style="margin-top:0.75rem;padding:1rem;background:#f8f8f4;border-radius:8px;font-size:12px;color:#888">
<strong>CEO Report Download URL:</strong> No standalone CEO AI report is publicly downloadable from rakbank.ae. AI strategy content by Group CEO Raheel Ahmed is embedded in the Annual Report 2025 (CEO Message section) and quarterly results press releases. This AI Intelligence Report constitutes the synthesized CEO-level document. Annual Report accessible at: rakbank.ae/en/about-us/investor-relations/financials/reports
    </div>
</div>
</div>
</div>
<div class="page-footer">
  RAKBANK AI Intelligence Report 2026 | Autonomous Banking AI Analysis | Sources: rakbank.ae, ADX, CBUAE, Microsoft, Zawya, Fintech Times | May 2026
</div>`;

export default function RAKBANKAIIntelligenceReport2026() {
  useEffect(() => {
    window.showPage = (id: string, btn: HTMLElement) => {
      const root =
        btn.closest(".rakbank-ai-intelligence-report-2026") || document;

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
      const root =
        btn.closest(".rakbank-ai-intelligence-report-2026") || document;

      root
        .querySelectorAll<HTMLElement>("#uc-filters button, .filter-bar button")
        .forEach((button) => {
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
    <div className="rakbank-ai-intelligence-report-2026">
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}
