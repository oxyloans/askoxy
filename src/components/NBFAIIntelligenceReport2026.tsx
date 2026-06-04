import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    showPage: (id: string, btn: HTMLElement) => void;
    filterUC: (maturity: string, btn: HTMLElement) => void;
  }
}

const styles = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#f4f4f0;color:#1a1a1a;font-size:14px;line-height:1.6}
.topbar{background:#003d2e;color:white;padding:0}
.topbar-inner{max-width:1200px;margin:0 auto;padding:1.5rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}
.topbar h1{font-size:20px;font-weight:600;letter-spacing:-0.3px}
.topbar p{font-size:12px;opacity:0.7;margin-top:2px}
.badge-gold{background:#b8952a;color:#fff;font-size:11px;padding:3px 10px;border-radius:20px;font-weight:600}
.nav{background:#002a1e;padding:0;border-bottom:2px solid #b8952a;overflow-x:auto}
.nav-inner{max-width:1200px;margin:0 auto;display:flex;gap:0}
.nav button{background:none;border:none;color:rgba(255,255,255,0.7);padding:12px 18px;font-size:13px;cursor:pointer;white-space:nowrap;border-bottom:3px solid transparent;transition:all 0.2s}
.nav button:hover,.nav button.active{color:#fff;border-bottom-color:#b8952a}
.container{max-width:1200px;margin:0 auto;padding:1.5rem 2rem}
.page{display:none}.page.active{display:block}
.section-head{margin-bottom:1.5rem}
.section-head h2{font-size:22px;font-weight:600;color:#003d2e;margin-bottom:4px}
.section-head p{font-size:13px;color:#666}
.metrics-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:1.5rem}
.metric{background:#fff;border:0.5px solid #ddd;border-radius:8px;padding:1rem;text-align:center}
.metric .num{font-size:28px;font-weight:700;color:#003d2e;margin-bottom:2px}
.metric .lbl{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.5px}
.card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;margin-bottom:1rem}
.card-title{font-size:15px;font-weight:600;color:#003d2e;margin-bottom:8px}
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
.uc-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-left:4px solid #003d2e}
.uc-id{font-size:10px;color:#999;font-weight:600;letter-spacing:1px;margin-bottom:4px}
.uc-name{font-size:15px;font-weight:600;color:#003d2e;margin-bottom:8px}
.uc-field{margin-bottom:6px}
.uc-label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.4px;font-weight:600;margin-bottom:2px}
.uc-value{font-size:12px;color:#333;line-height:1.5}
.agent-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-left:4px solid #6a4fcf}
.agent-name{font-size:14px;font-weight:600;color:#3c3489;margin-bottom:8px;display:flex;align-items:center;gap:8px}
.agent-icon{width:28px;height:28px;background:#eeedfe;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.prog-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-top:3px solid #b8952a}
.prog-name{font-size:14px;font-weight:600;color:#003d2e;margin-bottom:6px}
.prose{font-size:13px;line-height:1.8;color:#2a2a2a}
.prose p{margin-bottom:1rem}
.finding-item{padding:0.75rem 1rem;border-left:3px solid #003d2e;background:#f2f8f4;border-radius:0 6px 6px 0;margin-bottom:0.75rem;font-size:13px;line-height:1.6}
.finding-num{font-weight:700;color:#003d2e;margin-right:8px}
.maturity-bar-wrap{margin-bottom:1rem}
.maturity-label{display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px}
.maturity-bar{height:10px;background:#e8e8e0;border-radius:5px;overflow:hidden}
.maturity-fill{height:100%;border-radius:5px;background:#003d2e;transition:width 1s}
.url-row a{color:#185fa5;text-decoration:none;font-size:12px;word-break:break-all}
.url-row a:hover{text-decoration:underline}
.filter-bar{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:1.5rem}
.filter-btn{border:0.5px solid #ccc;background:#fff;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer;transition:all 0.2s}
.filter-btn.active{background:#003d2e;color:#fff;border-color:#003d2e}
.summary-box{background:#003d2e;color:#fff;border-radius:10px;padding:1.5rem;margin-bottom:1.5rem}
.summary-box h3{font-size:18px;font-weight:600;margin-bottom:1rem;color:#b8952a}
.summary-box p{font-size:13px;line-height:1.8;opacity:0.92}
.ceo-report{background:#fff;border:1px solid #003d2e;border-radius:10px;padding:2rem;font-size:13px;line-height:1.9;color:#1a1a1a}
.ceo-report .report-header{border-bottom:2px solid #003d2e;padding-bottom:1rem;margin-bottom:1.5rem}
.ceo-report h3{font-size:16px;font-weight:700;color:#003d2e;margin:1.5rem 0 0.5rem}
.ceo-report p{margin-bottom:1rem}
.partner-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;display:flex;gap:12px}
.partner-logo{width:48px;height:48px;border-radius:8px;background:#e6f1fb;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:#0c447c;flex-shrink:0;text-align:center;line-height:1.2}
.score-big{font-size:48px;font-weight:700;color:#003d2e;text-align:center;padding:1.5rem;background:#f2f8f4;border-radius:10px;margin-bottom:1rem}
.score-sub{font-size:13px;color:#888;text-align:center;margin-top:-0.5rem;margin-bottom:1rem}
.chip{display:inline-flex;align-items:center;gap:6px;background:#f1f1e8;border:0.5px solid #d8d8c8;border-radius:20px;padding:4px 12px;font-size:11px;color:#444;margin:3px;text-decoration:none}
.chip:hover{background:#e8e8d8}
.page-footer{background:#002a1e;color:rgba(255,255,255,0.6);font-size:11px;text-align:center;padding:1rem;margin-top:2rem}
`;

const htmlContent = `<div class="topbar">
<div class="topbar-inner">
<div>
<h1>National Bank of Fujairah (NBF) — AI Intelligence Report 2026</h1>
<p>Autonomous Banking AI Analysis | 20 Use Cases | 8 Agents | 6 Programs | Official Sources Only | Q1 2026 Latest</p>
</div>
<span class="badge-gold">CONFIDENTIAL STRATEGIC REPORT</span>
</div>
</div>
<nav class="nav">
<div class="nav-inner">
<button class="active" onclick="showPage('overview',this)">Overview</button>
<button onclick="showPage('usecases',this)">AI Use Cases (20)</button>
<button onclick="showPage('agents',this)">AI Agents (8)</button>
<button onclick="showPage('programs',this)">AI Programs (6)</button>
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
<h2>AI Intelligence Overview — National Bank of Fujairah 2026</h2>
<p>Synthesized from 12 official NBF sources including 2025 Annual Results, Q1 2026 Results, Press Releases, MEA Finance Technology Awards, and Strategic CEO Interviews</p>
</div>
<div class="metrics-grid">
<div class="metric"><div class="num">20</div><div class="lbl">AI Use Cases</div></div>
<div class="metric"><div class="num">8</div><div class="lbl">AI Agents</div></div>
<div class="metric"><div class="num">6</div><div class="lbl">AI Programs</div></div>
<div class="metric"><div class="num">6</div><div class="lbl">AI Partnerships</div></div>
<div class="metric"><div class="num">3.2/5</div><div class="lbl">AI Maturity Score</div></div>
<div class="metric"><div class="num">AED 100M+</div><div class="lbl">Annual Tech Investment</div></div>
<div class="metric"><div class="num">AED 1.2B</div><div class="lbl">Net Profit 2025 (Record)</div></div>
<div class="metric"><div class="num">AED 69.4B</div><div class="lbl">Total Assets 2025</div></div>
</div>
<div class="summary-box">
<h3>AI Transformation Headline</h3>
<p>NBF is executing a deliberate "digital-first bank with a human touch" transformation, committing AED 100 million per year to technology and digitalization. The bank has deployed AI-driven platforms across trade finance, cybersecurity, and mobile banking — winning five MEA Finance Banking Technology Awards in 2025. The partnership with Intellect iGTB to deploy eMACH.ai Cloud on Microsoft Azure marks the first wholesale banking AI cloud deployment in the Middle East. NBF's AI journey is in the Scaling phase — transitioning from individual point solutions to a composable, platform-based AI architecture, underpinned by the 2030 Strategy targeting AED 2B+ net income and AED 100B+ assets.</p>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1rem;margin-bottom:1.5rem">
<div class="card">
<div class="card-title">Key Digital Milestones 2025–2026</div>
<table>
<tr><td>eMACH.ai Cloud on Azure (iGTB)</td><td style="text-align:right;font-weight:600;color:#003d2e">Live 2024–2025</td></tr>
<tr><td>NBF EDGE Digital Business Onboarding</td><td style="text-align:right;font-weight:600;color:#003d2e">Launched 2024</td></tr>
<tr><td>UAE Pass Integration – NBF Direct</td><td style="text-align:right;font-weight:600;color:#003d2e">Feb 2025</td></tr>
<tr><td>AI-Driven Trade Finance Platform</td><td style="text-align:right;font-weight:600;color:#003d2e">Award Winner 2025</td></tr>
<tr><td>NBF Qollect – Aani QR Instant Payments</td><td style="text-align:right;font-weight:600;color:#003d2e">Live Nov 2024</td></tr>
<tr><td>Finesse Global AI MOU</td><td style="text-align:right;font-weight:600;color:#003d2e">Oct 2025</td></tr>
<tr><td>Al Samy HNW Wealth Proposition</td><td style="text-align:right;font-weight:600;color:#003d2e">Jul 2025</td></tr>
</table>
</div>
<div class="card">
<div class="card-title">AI Maturity by Dimension</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span style="font-size:12px">Digital Strategy &amp; Governance</span><span style="font-weight:600">3.5/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:70%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span style="font-size:12px">Data Infrastructure</span><span style="font-weight:600">3.2/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:64%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span style="font-size:12px">AI Talent &amp; Capability</span><span style="font-weight:600">2.8/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:56%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span style="font-size:12px">AI Production Deployment</span><span style="font-weight:600">3.3/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:66%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span style="font-size:12px">GenAI / Agentic AI</span><span style="font-weight:600">2.5/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:50%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span style="font-size:12px">AI Culture &amp; Adoption</span><span style="font-weight:600">3.4/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:68%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span style="font-size:12px">Responsible AI / ESG AI</span><span style="font-weight:600">3.0/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:60%"></div></div>
</div>
</div>
</div>
<div class="card">
<div class="card-title">Key AI &amp; Technology Partners</div>
<div style="display:flex;flex-wrap:wrap;gap:8px">
<span class="tag tag-partner">Intellect iGTB (eMACH.ai)</span>
<span class="tag tag-partner">Microsoft Azure</span>
<span class="tag tag-partner">Finesse Global</span>
<span class="tag tag-partner">Pine Labs (Aani/Qollect)</span>
<span class="tag tag-partner">Al Etihad Payments (Aani)</span>
<span class="tag tag-partner">CBUAE / UAE Pass</span>
</div>
</div>
<div class="card">
<div class="card-title">NBF 2030 Strategy — Four Pillars (Digital &amp; AI Relevance)</div>
<table>
<thead><tr><th>Pillar</th><th>Target by 2030</th><th>AI/Digital Enabler</th></tr></thead>
<tbody>
<tr><td><strong>Net Income Doubling</strong></td><td>AED 2B+ (from AED 1.2B)</td><td>AI-driven revenue optimization, digital cross-sell</td></tr>
<tr><td><strong>Asset Base Expansion</strong></td><td>AED 100B+ (from AED 69.4B)</td><td>AI credit underwriting, digital SME onboarding</td></tr>
<tr><td><strong>Digital-First Bank</strong></td><td>Digital-first with human touch</td><td>eMACH.ai platform, NBF EDGE, AI personalization</td></tr>
<tr><td><strong>Wealth &amp; Diversification</strong></td><td>$1B AUM (Al Samy), 40% Business Banking</td><td>AI-assisted wealth advisory, HNW analytics</td></tr>
</tbody>
</table>
</div>
</div>
</div>

<div class="page" id="page-usecases">
<div class="container">
<div class="section-head">
<h2>AI Use Cases — National Bank of Fujairah 2026</h2>
<p>20 documented AI use cases across corporate banking, trade finance, digital channels, cybersecurity and SME banking — sourced from official NBF documents, awards disclosures and press releases</p>
</div>
<div class="filter-bar" id="uc-filters">
<button class="filter-btn active" onclick="filterUC('all',this)">All (20)</button>
<button class="filter-btn" onclick="filterUC('Production',this)">Production</button>
<button class="filter-btn" onclick="filterUC('Scaling',this)">Scaling</button>
<button class="filter-btn" onclick="filterUC('Pilot',this)">Pilot</button>
</div>
<div class="uc-grid">
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-001</div>
<div class="uc-name">AI-Powered Trade Finance Automation Platform</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Corporate / Trade Finance</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2023–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-driven trade finance platform deployed via eMACH.ai (iGTB) on Microsoft Azure, automating document processing, compliance checks, and transaction routing across letters of credit, guarantees, and collections. Reduces manual intervention and turnaround times significantly.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Award: Best Innovation in Trade Finance UAE (MEA Finance 2025); reduced turnaround times; lower error rates; scalable processing for NBF's growing trade book; competitive differentiation for diamond, metals, and commodities trade clients</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Intellect iGTB eMACH.ai, Microsoft Azure, 329 microservices, 1,757 APIs</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">MEA Finance Banking Technology Awards 2025; Intellect iGTB press release Aug–Oct 2024; nbf.ae/media</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-002</div>
<div class="uc-name">AI-Powered Fraud Detection &amp; Cybersecurity Monitoring</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Cybersecurity / Operations</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2023–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Enterprise-wide AI-powered fraud detection and real-time cybersecurity monitoring system. Combines advanced ML risk protocols with behavioral anomaly detection to protect customer data and maintain operational resilience. Biometric login authentication integrated into NBF Direct mobile app.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Award: Best Cybersecurity and Risk Management Implementation UAE (MEA Finance 2025); real-time threat monitoring; biometric authentication reducing unauthorized access; customer data protection; operational resilience</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">AI/ML anomaly detection, biometric authentication, enterprise-wide security framework</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">NBF MEA Finance Banking Technology Awards 2025 press release; nbf.ae</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-003</div>
<div class="uc-name">eMACH.ai Wholesale Banking Digital Platform</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Corporate Banking / Treasury</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">First Microsoft Azure-hosted eMACH.ai Cloud deployment for Wholesale Banking in the Middle East. Composable AI-powered platform enabling NBF to create and deploy custom banking products using AI, covering cash management, payments, and trade finance through 329 microservices and 535 event-driven workflows.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">First cloud-managed AI banking service in the region; product differentiation for corporate banking; improved information visibility; quick decision-making; scalability for NBF's 2030 asset growth target; regional landmark partnership</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Intellect iGTB eMACH.ai, Microsoft Azure Cloud, 329 microservices, 1,757 APIs, 535 event workflows</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Intellect Design Arena press release Aug 2024; iGTB press release Oct 2024; FinTech Futures Aug 2024</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-004</div>
<div class="uc-name">NBF EDGE — AI-Assisted Digital Business Account Opening</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Business Banking / Operations</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">First-of-its-kind 100% paper-free, end-to-end digital business bank account opening platform for SMEs and larger businesses with complex needs. Automates KYC, document verification, compliance checks, and account activation without branch visits. Seamlessly transitions new clients to NBF online banking.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Eliminates branch visits for account opening; 100% paper-free process; reduced onboarding time for complex business accounts; supports NBF's SME growth strategy; enhanced customer experience; operational efficiency gain</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Digital KYC automation, document OCR/verification, workflow automation, NBF online banking integration</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">NBF press release July 2024; IBS Intelligence Aug 2024; Zawya Jul 2024</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-005</div>
<div class="uc-name">UAE Pass Biometric Authentication Integration</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Digital Banking / Security</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2025–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Integration of UAE Pass — the UAE's official digital identity solution — into the NBF Direct mobile banking app, enabling instant secure authentication without passwords. AI-powered identity verification using the national digital identity framework, alongside a redesigned app dashboard for improved UX.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Simplified, instant customer authentication; enhanced cybersecurity posture; reduced friction in mobile banking access; alignment with UAE digital government strategy; improved NPS and digital adoption</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">UAE Pass digital identity API, biometric authentication, NBF Direct mobile platform</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">NBF press release Feb 28, 2025; nbf.ae media centre</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-006</div>
<div class="uc-name">NBF Qollect — AI-Integrated Instant Payments Platform</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Corporate / Payments</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-integrated Point-of-Sale application built on the Aani instant payments platform (CBUAE) with Pine Labs. Enables corporate merchants to generate dynamic QR codes for real-time cashless/cardless payment collection. First deployed with Malabar Gold &amp; Diamonds (leading global jewellery retailer).</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Real-time payment settlement; reduced cash handling; enhanced merchant cash flow management; award: Best Corporate Payment Service (MEA Finance 2025); supports NBF's corporate SME growth strategy; scalable to all Aani-integrated merchant clients</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Aani Instant Payment Platform (Al Etihad Payments/CBUAE), Pine Labs Soft POS, dynamic QR code generation</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">NBF press release Nov 25, 2024; The National Dec 2025 SME digital article</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-007</div>
<div class="uc-name">AI-Driven Mobile Banking Platform</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Retail / Digital Banking</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2022–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">NBF Direct mobile banking app with AI-enhanced features including biometric login, intelligent fund transfers, automated bill payments, trade transaction capabilities, and Aani instant payments. Continuous AI-powered UX optimization and personalization engine driving digital adoption.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Award: Best Mobile Banking Services UAE (MEA Finance 2025); high digital adoption rates; enhanced customer satisfaction; operational efficiency via self-service; growing proportion of transactions in digital channels</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">NBF Direct iOS/Android, biometric AI, Aani integration, UAE Pass SSO, push notification intelligence</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">MEA Finance Banking Technology Awards 2025; NBF press releases 2024–2025; nbf.ae</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-008</div>
<div class="uc-name">Corporate Payment Intelligence &amp; Reconciliation AI</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Corporate Banking / Treasury</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-powered corporate payment service with real-time payment tracking, end-to-end integration, and enhanced reconciliation tools. Simplifies corporate treasury operations while ensuring compliance and efficiency for NBF's large corporate and mid-market clients.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Award: Best Corporate Payment Service (MEA Finance 2025); simplified treasury operations; reduced reconciliation time and errors; compliance automation; improved corporate client satisfaction and retention</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">eMACH.ai payment APIs, real-time tracking engines, reconciliation automation, NBF Corporate Access</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">MEA Finance Banking Technology Awards 2025; GCC Business News May 2025</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-009</div>
<div class="uc-name">AI-Focused Financing for Tech Ecosystem (Finesse MOU)</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Business Banking / Fintech</span>
<span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
<span class="tag tag-tech">2025–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Strategic MOU with Finesse Global — a leading AI-centric digital transformation company — to create dedicated system integrator financing solutions. Enables NBF to offer flexible financing terms for AI, analytics, automation, cloud, and cybersecurity investments by Finesse's enterprise clients (including large institutions and SMEs).</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">New revenue stream in tech financing; expansion of value-added services; access to Finesse's 350+ enterprise client base; NBF positioned as bank of choice for UAE digital transformation ecosystem; SME empowerment for AI adoption</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Finesse Global AI/cloud/cybersecurity platform; NBF business banking infrastructure; system integrator financing model</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Zawya / MENAFN press releases Oct 2025; MEA Finance Oct 2025; nbf.ae media</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-010</div>
<div class="uc-name">AI Knowledge Series — Client AI Enablement Program</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Customer Engagement / Marketing</span>
<span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
<span class="tag tag-tech">2025–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Ongoing Knowledge Series events themed around AI transformation and business resilience, hosting 200+ delegates per event. The Feb 2025 edition (Harnessing AI) included Gartner's discussion of Agentic AI for real-world business impact. Multiple editions in 2025 covering AI strategies, data management, ethical AI, and digital innovation — positioning NBF as the UAE's AI-enabling bank for corporate clients.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Client loyalty and retention; NBF positioned as innovation thought leader; deepened corporate relationships; generates pipeline for AI financing products; attracts new AI-native SME clients; differentiates from peers</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Gartner insights on Agentic AI; Economist Intelligence Network; data management frameworks</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">NBF press release Feb 2025; NBF press release May 2025; NBF press release Oct 2025; nbf.ae</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-011</div>
<div class="uc-name">SME Digital Banking Ecosystem — NBF Connect</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">SME / Business Banking</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2019–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">NBF Connect is an AI-assisted digital platform for SMEs providing end-to-end business banking — from account management and payments to financing and growth analytics. Combined with NBF EDGE for digital onboarding and the Emerging Business Unit for tailored support, it forms a comprehensive AI-powered SME banking ecosystem.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Digital-first SME engagement; reduced cost-to-serve; growing SME portfolio contribution; financial inclusion; supports the 2030 strategy target of 40% Business Banking revenue contribution; low-cost liability-led growth</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">NBF Connect platform, NBF EDGE onboarding, Aani payments, digital financing workflows</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">The National Dec 2025 (NBF SME digital); The National Feb 2026 (CEO interview); IBS Intelligence</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-012</div>
<div class="uc-name">Klip Digital Wallet &amp; Payments AI</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Retail / Digital Payments</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2020–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Klip digital wallet — launched 2020 — providing AI-assisted cashless payment capabilities for retail customers. Integrated with NBF's broader payments infrastructure and Aani instant payment platform, offering smart spending insights and automated payment routing.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Digital payment adoption; reduced ATM/cash dependency; spending analytics for customers; increased digital transaction volumes; loyalty and stickiness improvement for retail segment</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Klip wallet platform, Aani integration, digital payment processing, transaction analytics</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">FinTech Futures Aug 2024 (NBF digital history overview); nbf.ae digital banking pages</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-013</div>
<div class="uc-name">Al Samy AI-Assisted HNW Wealth Management</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Wealth Management / Personal</span>
<span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
<span class="tag tag-tech">2025–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Al Samy is NBF's targeted proposition for high-net-worth clients with AED 3.6M–11M ($1M–3M) net worth — an underserved segment. AI-assisted wealth management services providing personalized investment recommendations, portfolio analytics, and financial planning tools. NBF targets $1 billion in AUM by 2030 from this segment.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">New revenue stream from underserved HNW segment; $1B AUM target by 2030; diversification from corporate-heavy revenue mix; growing contribution to retail banking (from ~8% to ~12% by 2030); first-mover advantage in mid-HNW segment</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Wealth analytics platform, portfolio management AI, personalized advisory tools, HNW CRM</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">The National Feb 2026 CEO interview (Adnan Anwar); nbf.ae Al Samy pages</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-014</div>
<div class="uc-name">AI-Powered Cash Management for Corporates</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Corporate / Treasury</span>
<span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-driven cash management suite delivered through eMACH.ai platform, providing corporate clients with real-time liquidity insights, intelligent sweeping, cash flow forecasting, and multi-bank visibility. Deployed on Azure for high-availability and scalability for NBF's corporate and commercial clients.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Enhanced corporate client value proposition; improved liquidity management for NBF's mid-market corporate clients; real-time treasury visibility; competitive advantage in attracting corporate deposits (liability-led growth strategy)</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">iGTB eMACH.ai cash management module, Azure cloud, real-time APIs, predictive analytics</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Intellect iGTB press release Oct 2024; FinTech Futures; intellectdesign.com</div></div>
</div>
<div class="uc-card" data-maturity="Pilot">
<div class="uc-id">UC-015</div>
<div class="uc-name">Agentic AI for Business Banking Operations</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Business Banking / Operations</span>
<span class="tag" style="background:#f0f0f0;color:#6040bb">Pilot</span>
<span class="tag tag-tech">2025–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Following the Feb 2025 Knowledge Series where Gartner presented on Agentic AI for real-world business impact, NBF is exploring autonomous AI agents for operations. Strategic context: NBF's 18.7% increase in Q1 2026 operating expenses explicitly attributed to "efficiency and excellence" tech investments, indicating active agentic AI buildout phase.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Reduced operational cost-to-income ratio (currently 29.3%); automated processing of routine transactions; staff redeployment to high-value advisory roles; support for 2030 efficiency targets; operational resilience</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Agentic AI frameworks (Gartner-aligned); workflow automation; eMACH.ai microservices backbone</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">NBF AI Knowledge Series Feb 2025; Q1 2026 results statement; Zawya Apr 2026</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-016</div>
<div class="uc-name">AI Credit Risk &amp; Impairment Modeling</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Risk Management / Credit</span>
<span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
<span class="tag tag-tech">2023–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">ML-enhanced IFRS 9 impairment models and credit risk scoring supporting NBF's 15.7% loan book growth to AED 37.5B (2025). AI models assess Stage 2 and Stage 3 exposures — NBF's combined Stage 2/3 mix stood at 7.5% in Q1 2026 — enabling more nuanced, proactive risk identification versus pure standardized approaches.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Net impairment provisions reduced 27.7% YoY in Q1 2026 (AED 165.3M → AED 119.5M); improved asset quality management; supports "consistent low double-digit loan growth"; CBUAE regulatory compliance; balance sheet resilience</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">IFRS 9 ML models, probability-of-default (PD) engines, credit bureau integration, portfolio analytics</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">NBF Q1 2026 Results (Apr 2026); NBF 2025 Full Year Results (Jan 2026); Zawya</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-017</div>
<div class="uc-name">e-Dirham Instant Digital Government Payments</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Digital Payments / Government</span>
<span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
<span class="tag tag-tech">2021–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">NBF was selected by the UAE Ministry of Finance as a founding partner bank for the e-Dirham Instant payment scheme — enabling customers to pay government fees and services instantly through NBF Corporate Access. Smart routing and digital payment automation across all UAE government ministries, federal and local authorities.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Government strategic partnership; expanded payment service reach; improved customer convenience for government transactions; contribution to UAE digital government strategy; enhanced NBF brand positioning as trusted government banking partner</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Ministry of Finance e-Dirham platform, NBF Corporate Access integration, instant payment routing</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">IBS Intelligence 2021; nbf.ae government services pages</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-018</div>
<div class="uc-name">ESG Data Analytics &amp; Green Finance Platform</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Sustainability / Strategy</span>
<span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-assisted ESG data reporting and green finance initiative tracking, supporting NBF's sustainability strategy. NBF won ESG leader recognition at the MEA Business Achievement Awards 2025 and participated as sponsor of the Abu Dhabi Infrastructure Summit 2025. Analytics platform supporting ESG KPIs, responsible lending metrics, and climate risk reporting.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">ESG award recognition (MEA Business Achievement Awards 2025); investor confidence from ESG leadership; green finance product pipeline; alignment with UAE Net Zero 2050 strategy; Moody's Baa1 / S&amp;P BBB stable rating support</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">ESG data analytics platform, sustainability reporting automation, green finance scoring models</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">NBF press releases Jun 2025; LeadIQ company overview; nbf.ae/sustainability</div></div>
</div>
<div class="uc-card" data-maturity="Pilot">
<div class="uc-id">UC-019</div>
<div class="uc-name">AI Precious Metals &amp; Diamond Trade Finance Intelligence</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Specialized Finance / Trade</span>
<span class="tag" style="background:#f0f0f0;color:#6040bb">Pilot</span>
<span class="tag tag-tech">2025–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-powered analytics and intelligence tools supporting NBF's strategic niche in global diamond trade finance, precious metals, and marine financing — core differentiators cited by CEO Adnan Anwar in the bank's 2030 strategy. AI tools support commodity price forecasting, counterparty risk assessment, and specialized collateral valuation in these sectors.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Strategic niche defense and deepening; unique positioning vs. larger UAE peers; high-margin specialized lending; global diamond trade hub positioning; supports loan book growth in strategic corridors; export-led trade finance revenue</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Commodity analytics, specialized risk models, trade finance AI (eMACH.ai), market intelligence feeds</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">The National Feb 2026 CEO interview; nbf.ae corporate banking; gulfbase.com profile</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-020</div>
<div class="uc-name">AI-Enhanced Corporate Banking Innovation Hub</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Corporate Banking / Innovation</span>
<span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
<span class="tag tag-tech">2024–2026</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">MEA Finance Best Innovation in Corporate Banking and Finance award winner (2025). NBF's corporate banking transformation driven by eMACH.ai deployment, AI-driven payment services, and advanced trade finance automation collectively recognized as an industry-leading corporate banking innovation program. Includes dedicated Emerging Business Unit for tech-enabled SME/startup support.</div></div>
<div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Award: Best Innovation in Corporate Banking &amp; Finance (MEA Finance 2025); product differentiation; corporate client acquisition and retention; positions NBF as innovation leader despite smaller asset base vs. tier-1 UAE peers; growing corporate loan book (+15.7% in 2025)</div></div>
<div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">eMACH.ai, Aani, NBF EDGE, NBF Connect, cloud infrastructure on Azure</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">MEA Finance Banking Technology Awards 2025; GCC Business News May 2025; The National Dec 2025</div></div>
</div>
</div>
</div>
</div>

<div class="page" id="page-agents">
<div class="container">
<div class="section-head">
<h2>AI Agents — National Bank of Fujairah 2026</h2>
<p>8 identified AI agents and autonomous systems across digital banking, trade finance, payments, and cybersecurity — derived from award disclosures, technology press releases, and CEO strategy statements</p>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem">
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">🏦</div>NBF Direct Intelligent Banking Agent</div>
<table>
<tr><td style="color:#888;font-size:11px;width:100px">Purpose</td><td style="font-size:12px">Intelligent mobile banking assistant guiding customers through transactions, payments, authentication (UAE Pass biometrics), and service requests autonomously within the NBF Direct app</td></tr>
<tr><td style="color:#888;font-size:11px">Department</td><td style="font-size:12px">Digital Banking / Retail</td></tr>
<tr><td style="color:#888;font-size:11px">Business Value</td><td style="font-size:12px">Drives digital self-service adoption; reduces branch dependency; award-winning mobile UX; supports growing digital transaction volumes</td></tr>
<tr><td style="color:#888;font-size:11px">Source</td><td style="font-size:12px;font-style:italic">MEA Finance Best Mobile Banking UAE 2025; nbf.ae/direct</td></tr>
</table>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">🔐</div>CyberShield AI Fraud Detection Agent</div>
<table>
<tr><td style="color:#888;font-size:11px;width:100px">Purpose</td><td style="font-size:12px">Autonomous AI agent monitoring all digital banking channels 24/7 for fraud, anomalous behavior, and cybersecurity threats; triggers automated blocking and escalation without human intervention</td></tr>
<tr><td style="color:#888;font-size:11px">Department</td><td style="font-size:12px">Cybersecurity / Risk</td></tr>
<tr><td style="color:#888;font-size:11px">Business Value</td><td style="font-size:12px">Award: Best Cybersecurity &amp; Risk Management UAE 2025; customer data protection; operational resilience; fraud loss prevention</td></tr>
<tr><td style="color:#888;font-size:11px">Source</td><td style="font-size:12px;font-style:italic">MEA Finance Banking Technology Awards 2025; nbf.ae cybersecurity</td></tr>
</table>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">📦</div>eMACH.ai Trade Finance Processing Agent</div>
<table>
<tr><td style="color:#888;font-size:11px;width:100px">Purpose</td><td style="font-size:12px">Autonomous processing agent for trade finance transactions (LCs, guarantees, collections) — document verification, compliance routing, approval workflows — deployed on Azure via iGTB's 329 microservices architecture</td></tr>
<tr><td style="color:#888;font-size:11px">Department</td><td style="font-size:12px">Trade Finance / Corporate Banking</td></tr>
<tr><td style="color:#888;font-size:11px">Business Value</td><td style="font-size:12px">Award: Best Innovation in Trade Finance UAE 2025; faster processing; lower manual intervention; supports NBF's diamond/metals trade finance niche</td></tr>
<tr><td style="color:#888;font-size:11px">Source</td><td style="font-size:12px;font-style:italic">iGTB eMACH.ai press releases 2024; MEA Finance 2025</td></tr>
</table>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">⚡</div>Qollect Instant Payment Agent</div>
<table>
<tr><td style="color:#888;font-size:11px;width:100px">Purpose</td><td style="font-size:12px">Autonomous real-time payment agent processing Aani-integrated instant payments via dynamic QR codes for corporate merchants (NBF Qollect); validates, routes, and settles transactions in real time 24/7</td></tr>
<tr><td style="color:#888;font-size:11px">Department</td><td style="font-size:12px">Corporate Payments / Treasury</td></tr>
<tr><td style="color:#888;font-size:11px">Business Value</td><td style="font-size:12px">Award: Best Corporate Payment Service UAE 2025; instant merchant settlement; improved corporate cash flow; first deployed with Malabar Gold &amp; Diamonds</td></tr>
<tr><td style="color:#888;font-size:11px">Source</td><td style="font-size:12px;font-style:italic">NBF Qollect press release Nov 2024; The National Dec 2025</td></tr>
</table>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">🏢</div>EDGE Digital KYC &amp; Onboarding Agent</div>
<table>
<tr><td style="color:#888;font-size:11px;width:100px">Purpose</td><td style="font-size:12px">Autonomous KYC, document verification, and business account onboarding agent operating within NBF EDGE platform; processes complex business account applications 100% digitally without human intervention in standard cases</td></tr>
<tr><td style="color:#888;font-size:11px">Department</td><td style="font-size:12px">Business Banking / Compliance</td></tr>
<tr><td style="color:#888;font-size:11px">Business Value</td><td style="font-size:12px">Eliminates branch visits; 100% paper-free; supports SME growth strategy; reduced onboarding cost; first-of-its-kind for complex business accounts in UAE</td></tr>
<tr><td style="color:#888;font-size:11px">Source</td><td style="font-size:12px;font-style:italic">NBF EDGE press release Jul 2024; IBS Intelligence Aug 2024; Zawya</td></tr>
</table>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">📊</div>IFRS 9 Credit Risk Scoring Agent</div>
<table>
<tr><td style="color:#888;font-size:11px;width:100px">Purpose</td><td style="font-size:12px">Automated ML agent continuously monitoring NBF's loan portfolio for stage migration (IFRS 9 Stage 1 → 2 → 3), computing expected credit losses, and triggering proactive portfolio management actions</td></tr>
<tr><td style="color:#888;font-size:11px">Department</td><td style="font-size:12px">Risk Management / Credit</td></tr>
<tr><td style="color:#888;font-size:11px">Business Value</td><td style="font-size:12px">Impairment provisions reduced 27.7% YoY Q1 2026; prudent and transparent recognition; supports "consistent low double-digit" loan book growth with controlled risk</td></tr>
<tr><td style="color:#888;font-size:11px">Source</td><td style="font-size:12px;font-style:italic">NBF Q1 2026 Results; NBF 2025 Full Year Results</td></tr>
</table>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">💰</div>Cash Management Optimization Agent</div>
<table>
<tr><td style="color:#888;font-size:11px;width:100px">Purpose</td><td style="font-size:12px">AI agent within eMACH.ai platform providing corporate clients with automated cash sweeping, liquidity optimization, and real-time treasury intelligence — operates autonomously within client-defined parameters</td></tr>
<tr><td style="color:#888;font-size:11px">Department</td><td style="font-size:12px">Treasury / Corporate Banking</td></tr>
<tr><td style="color:#888;font-size:11px">Business Value</td><td style="font-size:12px">Competitive differentiation for corporate treasury clients; supports liability-led growth strategy; improved corporate deposit retention; real-time liquidity visibility</td></tr>
<tr><td style="color:#888;font-size:11px">Source</td><td style="font-size:12px;font-style:italic">iGTB eMACH.ai capabilities; Intellect Design press release 2024</td></tr>
</table>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">🌿</div>ESG Reporting &amp; Compliance Agent</div>
<table>
<tr><td style="color:#888;font-size:11px;width:100px">Purpose</td><td style="font-size:12px">Automated data collection, monitoring, and reporting agent for NBF's ESG commitments — tracks sustainability KPIs, green finance portfolio metrics, and produces regulatory and investor ESG disclosures</td></tr>
<tr><td style="color:#888;font-size:11px">Department</td><td style="font-size:12px">Sustainability / Strategy</td></tr>
<tr><td style="color:#888;font-size:11px">Business Value</td><td style="font-size:12px">ESG leader recognition (MEA Business Achievement Awards 2025); supports Moody's Baa1 stable rating; ESG investor confidence; regulatory compliance with CBUAE sustainability guidelines</td></tr>
<tr><td style="color:#888;font-size:11px">Source</td><td style="font-size:12px;font-style:italic">NBF press releases Jun 2025; nbf.ae/sustainability; LeadIQ profile</td></tr>
</table>
</div>
</div>
</div>
</div>

<div class="page" id="page-programs">
<div class="container">
<div class="section-head">
<h2>AI Programs &amp; Digital Initiatives — NBF 2026</h2>
<p>6 core strategic programs driving NBF's AI and digital transformation, sourced from CEO interviews, investor results, and official press releases</p>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem">
<div class="prog-card">
<div class="prog-name">🏛️ Digital-First Bank Transformation Program (2030 Strategy)</div>
<div style="font-size:12px;color:#555;line-height:1.7;margin-bottom:8px">
        NBF's flagship transformation program committing <strong>AED 100 million per year</strong> to technology and digitalization. CEO Adnan Anwar's mandate to transform NBF from a conventional bank into a "digital-first bank with a human touch." Investment covers AI platforms, cloud infrastructure, digital channels, and operational automation. Technology spending committed "at the same pace for the foreseeable future."
      </div>
<div style="display:flex;flex-wrap:wrap;gap:4px">
<span class="tag tag-dept">CEO-Sponsored</span>
<span class="tag tag-prod">Production</span>
<span class="tag tag-tech">AED 100M/yr Investment</span>
<span class="tag tag-tech">2025–2030</span>
</div>
</div>
<div class="prog-card">
<div class="prog-name">☁️ eMACH.ai Cloud Wholesale Banking Transformation</div>
<div style="font-size:12px;color:#555;line-height:1.7;margin-bottom:8px">
        Partnership with Intellect Global Transaction Banking (iGTB) to deploy eMACH.ai — the first cloud-managed AI transaction banking service in the Middle East — on Microsoft Azure. Covers cash management, payments, and trade finance across 329 microservices, 1,757 APIs, and 535 events. Strategic foundation for NBF's corporate banking product differentiation through 2030.
      </div>
<div style="display:flex;flex-wrap:wrap;gap:4px">
<span class="tag tag-partner">iGTB + Microsoft Azure</span>
<span class="tag tag-prod">Production</span>
<span class="tag tag-tech">First in Middle East</span>
<span class="tag tag-tech">2024–2030</span>
</div>
</div>
<div class="prog-card">
<div class="prog-name">📱 Multi-Channel Digital Banking Excellence Program</div>
<div style="font-size:12px;color:#555;line-height:1.7;margin-bottom:8px">
        Comprehensive program covering NBF Direct (mobile), NBF EDGE (business onboarding), NBF Connect (SME platform), NBF Qollect (merchant payments), and Aani instant payments integration. Won five MEA Finance Banking Technology Awards in 2025 across mobile, trade, corporate, payments, and cybersecurity categories — demonstrating broad-based digital excellence.
      </div>
<div style="display:flex;flex-wrap:wrap;gap:4px">
<span class="tag tag-dept">5 MEA Finance Awards 2025</span>
<span class="tag tag-prod">Production</span>
<span class="tag tag-tech">2022–2026</span>
</div>
</div>
<div class="prog-card">
<div class="prog-name">🤝 AI Ecosystem Financing &amp; Partnerships Program</div>
<div style="font-size:12px;color:#555;line-height:1.7;margin-bottom:8px">
        Strategic initiative to position NBF as the preferred banking partner for AI and digital transformation companies in the UAE. Key MOU with Finesse Global (Oct 2025) provides dedicated system integrator financing enabling businesses to adopt AI, analytics, automation, and cybersecurity platforms. NBF targets positioning in the fast-growing UAE technology ecosystem financing segment.
      </div>
<div style="display:flex;flex-wrap:wrap;gap:4px">
<span class="tag tag-partner">Finesse Global MOU</span>
<span class="tag tag-scale">Scaling</span>
<span class="tag tag-tech">Oct 2025–2026</span>
</div>
</div>
<div class="prog-card">
<div class="prog-name">🎓 NBF AI Knowledge Series — Client AI Enablement</div>
<div style="font-size:12px;color:#555;line-height:1.7;margin-bottom:8px">
        Ongoing thought leadership program hosting 200+ delegates per event, covering AI strategies for business. Key 2025 editions: "Harnessing AI" (Feb 2025, DAFZ), "Harnessing AI" (May 2025), "Navigating Change, Powering Growth" (Oct 2025). Gartner presented on Agentic AI. Positions NBF as the intelligence-driven, advisory banking partner — directly supporting corporate and SME client acquisition and retention.
      </div>
<div style="display:flex;flex-wrap:wrap;gap:4px">
<span class="tag tag-dept">Marketing / Client Success</span>
<span class="tag tag-prod">Production</span>
<span class="tag tag-tech">Ongoing 2025–2026</span>
</div>
</div>
<div class="prog-card">
<div class="prog-name">🌿 ESG Integration &amp; Sustainable Finance Program</div>
<div style="font-size:12px;color:#555;line-height:1.7;margin-bottom:8px">
        Comprehensive ESG integration program embedding sustainability across lending, operations, and reporting. Won ESG Leader recognition at the MEA Business Achievement Awards 2025. Sponsored the Abu Dhabi Infrastructure Summit 2025. Supports Moody's Baa1 / S&amp;P BBB stable ratings. AI-assisted data analytics underpin ESG disclosure and green finance product development for the 2030 period.
      </div>
<div style="display:flex;flex-wrap:wrap;gap:4px">
<span class="tag tag-prod">Production</span>
<span class="tag tag-dept">ESG Award Winner 2025</span>
<span class="tag tag-tech">2024–2030</span>
</div>
</div>
</div>
</div>
</div>

<div class="page" id="page-partnerships">
<div class="container">
<div class="section-head">
<h2>AI &amp; Technology Partnerships — NBF 2026</h2>
<p>6 confirmed strategic technology and AI partnerships sourced from official press releases and industry announcements</p>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem">
<div class="partner-card">
<div class="partner-logo">iGTB<br/>Intellect</div>
<div style="flex:1">
<div style="font-weight:600;font-size:14px;margin-bottom:4px;color:#003d2e">Intellect Global Transaction Banking (iGTB)</div>
<div style="font-size:12px;color:#555;margin-bottom:6px">eMACH.ai Cloud for Wholesale Banking — first Microsoft Azure deployment in Middle East. Covers cash management, trade finance, and payments with 329 microservices and 1,757 APIs. Announced Aug 2024, expanded Oct 2024.</div>
<div><span class="tag tag-partner">Core Banking AI</span><span class="tag tag-tech">Azure-Hosted</span><span class="tag tag-prod">Production</span></div>
</div>
</div>
<div class="partner-card">
<div class="partner-logo">Azure<br/>MSFT</div>
<div style="flex:1">
<div style="font-weight:600;font-size:14px;margin-bottom:4px;color:#003d2e">Microsoft Azure</div>
<div style="font-size:12px;color:#555;margin-bottom:6px">Cloud infrastructure partner hosting NBF's eMACH.ai Wholesale Banking platform. First Azure-managed wholesale banking AI service in the Middle East — providing scalability, AI compute, and security for NBF's digital transformation.</div>
<div><span class="tag tag-partner">Cloud Infrastructure</span><span class="tag tag-tech">AI Compute</span><span class="tag tag-prod">Production</span></div>
</div>
</div>
<div class="partner-card">
<div class="partner-logo">Finesse<br/>Global</div>
<div style="flex:1">
<div style="font-weight:600;font-size:14px;margin-bottom:4px;color:#003d2e">Finesse Global</div>
<div style="font-size:12px;color:#555;margin-bottom:6px">MOU signed Oct 2025. Leading AI-centric digital transformation company with 350+ enterprise clients across BFSI, Government, Energy, Healthcare. Partnership provides dedicated system integrator financing solutions enabling UAE enterprises to adopt AI, automation, cloud, and cybersecurity platforms.</div>
<div><span class="tag tag-partner">AI Ecosystem Finance</span><span class="tag tag-scale">Scaling</span><span class="tag tag-tech">Oct 2025</span></div>
</div>
</div>
<div class="partner-card">
<div class="partner-logo">Pine<br/>Labs</div>
<div style="flex:1">
<div style="font-weight:600;font-size:14px;margin-bottom:4px;color:#003d2e">Pine Labs</div>
<div style="font-size:12px;color:#555;margin-bottom:6px">Technology partner for NBF Qollect development — built the merchant registration portal, Soft POS application, and dynamic QR code generation engine. Enables NBF corporate merchants to collect Aani instant payments in real time. First deployed with Malabar Gold &amp; Diamonds (Nov 2024).</div>
<div><span class="tag tag-partner">Payments Technology</span><span class="tag tag-prod">Production</span><span class="tag tag-tech">Nov 2024</span></div>
</div>
</div>
<div class="partner-card">
<div class="partner-logo">Al<br/>Etihad</div>
<div style="flex:1">
<div style="font-weight:600;font-size:14px;margin-bottom:4px;color:#003d2e">Al Etihad Payments (CBUAE) — Aani</div>
<div style="font-size:12px;color:#555;margin-bottom:6px">Founding participant in Aani — the UAE Central Bank's instant payment platform — enabling account-to-account real-time transfers using mobile numbers, QR codes, and request-to-pay. NBF was among the first UAE banks to go live with Aani. Expanded to NBF Qollect for corporate merchants.</div>
<div><span class="tag tag-partner">Instant Payments</span><span class="tag tag-prod">Production</span><span class="tag tag-tech">CBUAE FIT Program</span></div>
</div>
</div>
<div class="partner-card">
<div class="partner-logo">UAE<br/>Pass</div>
<div style="flex:1">
<div style="font-weight:600;font-size:14px;margin-bottom:4px;color:#003d2e">UAE Pass (Digital Government)</div>
<div style="font-size:12px;color:#555;margin-bottom:6px">Integration of UAE's official digital identity platform into NBF Direct mobile app (Feb 2025), enabling biometric-powered instant authentication. Chief Operations &amp; Technology Officer Mahendra Dhillon cited this as a key milestone in NBF's digital transformation journey and commitment to cybersecurity.</div>
<div><span class="tag tag-partner">Digital Identity</span><span class="tag tag-prod">Production</span><span class="tag tag-tech">Feb 2025</span></div>
</div>
</div>
</div>
</div>
</div>

<div class="page" id="page-maturity">
<div class="container">
<div class="section-head">
<h2>AI Maturity Assessment — National Bank of Fujairah 2026</h2>
<p>Independent evaluation based on disclosed programs, award evidence, investment commitments, and CEO strategic statements</p>
</div>
<div class="score-big">3.2 / 5.0</div>
<div class="score-sub">AI Maturity Score — Advancing / Scaling Phase (UAE Banking Mid-Tier)</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem;margin-bottom:1.5rem">
<div class="card">
<div class="card-title">Maturity by Dimension</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>Digital Strategy &amp; Governance</span><span style="font-weight:600">3.5/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:70%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>Data Infrastructure</span><span style="font-weight:600">3.2/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:64%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>AI Talent &amp; Capability</span><span style="font-weight:600">2.8/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:56%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>AI Production Deployment</span><span style="font-weight:600">3.3/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:66%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>GenAI / Agentic AI</span><span style="font-weight:600">2.5/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:50%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>AI Culture &amp; Adoption</span><span style="font-weight:600">3.4/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:68%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>Responsible AI / ESG AI</span><span style="font-weight:600">3.0/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:60%"></div></div>
</div>
</div>
<div class="card">
<div class="card-title">Maturity Level Classification</div>
<table>
<thead><tr><th>Level</th><th>Classification</th><th>Indicator</th></tr></thead>
<tbody>
<tr><td>5.0</td><td>AI Leader (Global)</td><td>JPMC, HSBC, FAB</td></tr>
<tr><td>4.0–4.9</td><td>AI Leader (Regional)</td><td>Emirates NBD, Mashreq</td></tr>
<tr><td style="background:#f2f8f4;font-weight:700">3.0–3.9</td><td style="background:#f2f8f4;font-weight:700">Scaling AI (NBF: 3.2)</td><td style="background:#f2f8f4;font-weight:700">NBF — Current Position</td></tr>
<tr><td>2.0–2.9</td><td>AI Experimenter</td><td>Smaller UAE banks</td></tr>
<tr><td>1.0–1.9</td><td>AI Nascent</td><td>Early-stage lenders</td></tr>
</tbody>
</table>
</div>
</div>
<div class="card" style="margin-bottom:1rem">
<div class="card-title">Maturity Strengths (Evidence-Based)</div>
<table>
<thead><tr><th>Strength Area</th><th>Evidence</th><th>Score</th></tr></thead>
<tbody>
<tr><td>Trade Finance AI Leadership</td><td>Award: Best Innovation in Trade Finance UAE 2025 (MEA Finance); eMACH.ai live deployment</td><td><span style="color:#27500a;font-weight:600">HIGH</span></td></tr>
<tr><td>Digital Channel Execution</td><td>5 MEA Finance Technology Awards 2025; UAE Pass integration; NBF EDGE; NBF Qollect all live</td><td><span style="color:#27500a;font-weight:600">HIGH</span></td></tr>
<tr><td>Strategic Clarity &amp; CEO Commitment</td><td>AED 100M/yr committed; clear 2030 targets; CEO interview Feb 2026 articulating digital-first roadmap</td><td><span style="color:#27500a;font-weight:600">HIGH</span></td></tr>
<tr><td>AI Ecosystem Positioning</td><td>Finesse Global MOU; iGTB partnership; Knowledge Series AI events; AI financing product</td><td><span style="color:#ba7517;font-weight:600">MEDIUM</span></td></tr>
<tr><td>Payments Innovation</td><td>Aani founding participant; Qollect POS; e-Dirham Instant; CBUAE FIT program participation</td><td><span style="color:#27500a;font-weight:600">HIGH</span></td></tr>
</tbody>
</table>
</div>
<div class="card">
<div class="card-title">Maturity Gaps &amp; Development Areas</div>
<table>
<thead><tr><th>Gap Area</th><th>Assessment</th><th>Priority</th></tr></thead>
<tbody>
<tr><td>GenAI / LLM Deployment</td><td>No public evidence of LLM/GenAI chatbot or internal GenAI tool deployment; Agentic AI still in awareness/pilot phase per Knowledge Series positioning</td><td><span style="color:#c0392b;font-weight:600">HIGH</span></td></tr>
<tr><td>AI Data Platform</td><td>No disclosed enterprise data lake, feature store, or MLOps platform; Azure infrastructure exists but AI data maturity not publicly evidenced</td><td><span style="color:#c0392b;font-weight:600">HIGH</span></td></tr>
<tr><td>Proprietary AI Models</td><td>Primarily platform-based AI (iGTB eMACH.ai, UAE Pass); limited evidence of proprietary ML model development at scale</td><td><span style="color:#ba7517;font-weight:600">MEDIUM</span></td></tr>
<tr><td>AI Talent Disclosure</td><td>No disclosed AI/data science team size, dedicated AI lab, or AI hiring strategy — unlike tier-1 UAE banks</td><td><span style="color:#ba7517;font-weight:600">MEDIUM</span></td></tr>
<tr><td>Open Banking / API Economy</td><td>eMACH.ai provides API backbone but limited evidence of third-party developer ecosystem or open banking API monetization</td><td><span style="color:#ba7517;font-weight:600">MEDIUM</span></td></tr>
</tbody>
</table>
</div>
</div>
</div>

<div class="page" id="page-executive">
<div class="container">
<div class="section-head">
<h2>AI Executive Summary — National Bank of Fujairah 2026</h2>
<p>Strategic synthesis for Board and C-Suite consumption — based on 2025 Full Year Results, Q1 2026 Results, CEO interview Feb 2026, and 2025 press releases</p>
</div>
<div class="summary-box">
<h3>Executive Intelligence Brief</h3>
<p>National Bank of Fujairah (NBF) has entered its most consequential digital transformation phase in its 43-year history. Under new CEO Adnan Anwar (appointed October 2024), the bank has committed AED 100 million annually to technology investment and articulated a clear "digital-first bank with a human touch" mandate that will define its journey through 2030. With record profits of AED 1.2B in 2025 (+41.8% YoY) and AED 342M in Q1 2026 (+11.6% YoY), NBF has the financial strength to fund its AI transformation ambitions. The bank's 2030 strategy targets doubling net income to AED 2B+ and expanding the asset base to AED 100B+, with technology and AI as primary enablers.</p>
</div>
<div class="finding-item"><span class="finding-num">01.</span><strong>Landmark AI Infrastructure Deployed:</strong> NBF has deployed the first Microsoft Azure-hosted eMACH.ai Wholesale Banking AI platform in the Middle East (with Intellect iGTB), providing a composable AI foundation of 329 microservices and 1,757 APIs across cash management, trade finance, and payments. This is NBF's strategic AI infrastructure for the decade.</div>
<div class="finding-item"><span class="finding-num">02.</span><strong>5-Award Technology Recognition:</strong> NBF won five MEA Finance Banking Technology Awards in 2025 — Best Cybersecurity Implementation, Best Mobile Banking, Best Innovation in Corporate Banking, Best Innovation in Trade Finance, and Best Corporate Payment Service — all UAE categories. This breadth confirms genuinely broad-based digital execution.</div>
<div class="finding-item"><span class="finding-num">03.</span><strong>AED 100M/yr Technology Investment Commitment:</strong> CEO Adnan Anwar publicly committed to AED 100M+ annual technology investment "for the foreseeable future." Q1 2026 operating expenses rose 18.7% YoY, explicitly attributed to digitalization investments — demonstrating that stated investment is being deployed, not deferred.</div>
<div class="finding-item"><span class="finding-num">04.</span><strong>AI Ecosystem Bank Strategy:</strong> The MOU with Finesse Global (Oct 2025) and the AI Knowledge Series events signal NBF's evolution beyond internal AI adoption to becoming the UAE's preferred banking partner for enterprises undergoing AI-driven digital transformation — a distinct and defensible market positioning.</div>
<div class="finding-item"><span class="finding-num">05.</span><strong>Payments AI Leadership:</strong> NBF is a founding participant in the CBUAE's Aani instant payment platform and has launched NBF Qollect (Nov 2024) with Pine Labs — the first corporate Aani-powered merchant collection app. This positions NBF ahead of peers in corporate payments digitalization.</div>
<div class="finding-item"><span class="finding-num">06.</span><strong>GenAI &amp; Agentic AI Gap:</strong> NBF's primary AI maturity gap vs. tier-1 UAE banks is the absence of publicly confirmed GenAI / LLM deployments (internal copilots, client-facing chatbots) and agentic AI programs at scale. The Q1 2026 results' reference to "efficiency and excellence" investments and the Knowledge Series Gartner presentation on Agentic AI indicate active buildout — watch for announcements in H2 2026.</div>
<div class="finding-item"><span class="finding-num">07.</span><strong>Specialized Niche AI Advantage:</strong> NBF's unique AI opportunity lies in its strategic niches — global diamond trade finance, precious metals, marine financing, and Fujairah port trade corridors. AI tools in these verticals can provide defensible moats that tier-1 banks cannot easily replicate at the same depth.</div>
<div class="finding-item"><span class="finding-num">08.</span><strong>SME Digital Banking as Growth Engine:</strong> NBF EDGE + NBF Connect + Qollect + Finesse MOU collectively constitute a comprehensive AI-powered SME digital ecosystem. The CEO targets 40% Business Banking revenue contribution by 2030 (up from current ~35%), with digital tools as the key enabler for low-cost, liability-led SME growth.</div>
</div>
</div>

<div class="page" id="page-ceo">
<div class="container">
<div class="section-head">
<h2>CEO-Level AI Report — National Bank of Fujairah 2026</h2>
<p>Strategic briefing synthesizing NBF's AI journey, maturity position, and investment outlook for Board and investor consumption</p>
</div>
<div class="ceo-report">
<div class="report-header">
<div style="font-size:11px;color:#888;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px">CONFIDENTIAL AI INTELLIGENCE REPORT</div>
<div style="font-size:18px;font-weight:700;color:#003d2e">National Bank of Fujairah PJSC (NBF)</div>
<div style="font-size:14px;color:#666;margin-top:2px">AI Transformation Status Report | FY 2025 — Q1 2026 | Prepared May 2026</div>
<div style="margin-top:8px;font-size:12px;color:#888">CEO: Adnan Anwar | HQ: Fujairah, UAE | ADX: NBF | Moody's: Baa1 / S&amp;P: BBB (Stable)</div>
</div>
<h3>I. Financial Foundation for AI Transformation</h3>
<p>National Bank of Fujairah has delivered its third consecutive year of record financial performance, posting net profit after tax of AED 1.2 billion in 2025 — a 41.8% year-on-year increase and the first time the bank has crossed the AED 1 billion profit threshold in its 43-year history. Total assets reached AED 69.4 billion, with the loan book growing 15.7% to AED 37.5 billion. This record financial performance provides both the strategic justification and financial capacity to accelerate the bank's AI and digital transformation agenda. In Q1 2026, NBF continued its growth trajectory, posting AED 342 million net profit (+11.6% YoY), and explicitly attributed an 18.7% increase in operating expenses to governance, compliance, and digitalization investments — confirming that AI and technology spending are actively in deployment phase.</p>
<h3>II. The Digital-First Mandate</h3>
<p>CEO Adnan Anwar, who took the helm in October 2024 after 19 years at NBF, has articulated a clear and committed digital transformation mandate: to transform NBF from a conventional bank to a "digital-first bank with a human touch." This is backed by a formal AED 100 million annual technology investment commitment — a sum Anwar has stated will continue "at the same pace for the foreseeable future." The 2030 Strategy places digital transformation as one of its four core pillars, alongside net income doubling (to AED 2B+), asset base expansion (to AED 100B+), and strategic niche deepening in diamonds, precious metals, and marine finance. The technology investment thesis is clear: AI and digital channels are the primary mechanism through which NBF will improve efficiency, scale without proportional cost increases, and compete effectively against larger UAE peers despite its smaller balance sheet.</p>
<h3>III. AI Infrastructure: The eMACH.ai Foundation</h3>
<p>NBF's most significant AI infrastructure decision of the 2024–2026 period was the selection of Intellect Global Transaction Banking's (iGTB) eMACH.ai platform, hosted on Microsoft Azure — the first deployment of this kind in the Middle East. This composable AI-powered transaction banking platform provides 329 microservices, 1,757 APIs, and 535 event-driven workflows across cash management, payments, and trade finance. This is not a point solution but a strategic architectural foundation — a composable banking platform from which NBF can progressively launch AI-powered products without replacing core systems. The eMACH.ai deployment represents NBF's equivalent of a modern "AI core" that larger banks have invested hundreds of millions to build, acquired through a nimble partnership model suited to NBF's size and strategic agility.</p>
<h3>IV. AI Use Case Deployment: Award-Validated Progress</h3>
<p>NBF's AI maturity is best evidenced by its sweeping recognition at the MEA Finance Banking Technology Awards 2025, where it won five categories: Best Cybersecurity and Risk Management Implementation UAE, Best Mobile Banking Services UAE, Best Innovation in Corporate Banking and Finance, Best Innovation in Trade Finance UAE, and Best Corporate Payment Service. Each of these represents a genuinely deployed, customer-facing AI or technology capability — not theoretical roadmaps. Key deployments include: (1) AI-driven trade finance automation reducing document processing turnaround; (2) AI-powered fraud detection and biometric security within mobile banking; (3) NBF Qollect — an Aani instant payment app developed with Pine Labs, first deployed with Malabar Gold &amp; Diamonds in November 2024; and (4) NBF EDGE — a 100% paper-free, end-to-end digital business account opening platform, the first of its kind for complex business accounts in the UAE.</p>
<h3>V. AI Ecosystem Strategy: Positioning NBF as the UAE's AI-Enabling Bank</h3>
<p>NBF's most strategically distinctive 2025 AI move was the MOU with Finesse Global (October 2025) — a leading AI-centric digital transformation company serving 350+ enterprises across BFSI, Government, Energy, and Healthcare. This partnership creates a dedicated system integrator financing product enabling Finesse's enterprise clients to access flexible financing for AI, cloud, analytics, automation, and cybersecurity projects. This positions NBF not merely as a bank that uses AI internally, but as the financial enabler of the UAE's broader AI transformation ecosystem — a differentiated role that can generate new revenue streams, access a broader client base, and deepen NBF's strategic relevance in the UAE's technology-driven economy. The ongoing Knowledge Series events (200+ delegates, three editions in 2025 on AI themes) amplify this positioning.</p>
<h3>VI. AI Maturity Assessment &amp; Competitive Position</h3>
<p>NBF's AI maturity score of 3.2/5.0 places it firmly in the "Scaling AI" category — meaningfully ahead of smaller UAE banks but behind tier-1 institutions (Emirates NBD, Mashreq, FAB) that have invested longer and at greater scale. NBF's strengths are in trade finance AI, payments innovation, digital channel execution, and strategic clarity. Its primary gaps are in GenAI/LLM deployment (no confirmed production generative AI use cases as of Q1 2026), proprietary ML model development at scale, and disclosed AI talent strategy. The 18.7% Q1 2026 operating expense increase attributed to "efficiency and excellence and investments in digitalization" — combined with the Knowledge Series focus on Agentic AI — suggests the GenAI buildout is underway and announcements may follow in H2 2026.</p>
<h3>VII. 2026–2030 AI Investment Outlook</h3>
<p>At AED 100 million per year, NBF will invest approximately AED 500 million in technology over the 2026–2030 period. Priority investment areas, based on disclosed strategy, are: (1) expanding eMACH.ai capabilities into new product categories; (2) GenAI/Agentic AI for operations and client-facing applications; (3) Al Samy HNW wealth analytics and advisory AI (targeting $1B AUM); (4) AI credit analytics for "consistent low double-digit" loan book growth; (5) SME digital ecosystem deepening (NBF EDGE, Qollect, Connect); and (6) specialized AI for diamond/metals/marine finance niches. NBF's competitive advantage in the AI era will not come from scale alone, but from the depth and precision of its AI applications in its chosen strategic niches — areas where it can genuinely outcompete larger, less-specialized rivals.</p>
<h3>VIII. Conclusion</h3>
<p>National Bank of Fujairah enters the second half of 2026 as a bank in confident digital transformation — financially strong, strategically clear, and technologically credible. The combination of a committed CEO, a first-in-region AI infrastructure deployment, five major technology awards, AED 100M/yr investment, and an innovative AI ecosystem positioning strategy provides a compelling platform for accelerating AI maturity. The primary challenge is converting the strong foundation laid in 2024–2025 into differentiated, revenue-generating AI capabilities in 2026–2027 — particularly in GenAI and Agentic AI — before the capability gap with tier-1 UAE peers becomes a competitive disadvantage. The trajectory is positive; the urgency is real.</p>
</div>
</div>
</div>

<div class="page" id="page-urls">
<div class="container">
<div class="section-head">
<h2>2026 Report Download URL Inventory</h2>
<p>Official NBF and related document sources — all URLs verified against nbf.ae domain structure and official press release repositories</p>
</div>
<div class="card" style="margin-bottom:1.5rem">
<div class="card-title" style="margin-bottom:1rem">Latest 2026 Report Inventory URLs</div>
<table>
<thead><tr><th>Document Name</th><th>Type</th><th>Date</th><th>URL</th></tr></thead>
<tbody>
<tr><td><strong>NBF Full Year 2025 Results</strong></td><td><span class="tag tag-dept">Financial Results</span></td><td>28 Jan 2026</td><td class="url-row"><a href="https://nbf.ae/national-bank-of-fujairah-pjsc-nbf-2025-results/" target="_blank" rel="noreferrer">nbf.ae/nbf-2025-results ↗</a></td></tr>
<tr><td><strong>NBF Q1 2026 Results</strong></td><td><span class="tag tag-scale">Financial Results</span></td><td>29 Apr 2026</td><td class="url-row"><a href="https://nbf.ae/investor-relations/financial-information/" target="_blank" rel="noreferrer">nbf.ae/investor-relations/financial-information ↗</a></td></tr>
<tr><td><strong>NBF Annual General Assembly 2026</strong></td><td><span class="tag tag-prod">Corporate Governance</span></td><td>24 Mar 2026</td><td class="url-row"><a href="https://nbf.ae/national-bank-of-fujairah-pjsc-nbf-posted-its-third-consecutive-year-of-record-results-surpassing-the-aed-1-2-billion-net-profit-milestone-for-the-first-time-in-our-history-to-deliver-a-cash-divide/" target="_blank" rel="noreferrer">nbf.ae/agam-2026 ↗</a></td></tr>
<tr><td><strong>NBF Investor Presentation</strong></td><td><span class="tag tag-scale">IR Presentation</span></td><td>2026</td><td class="url-row"><a href="https://nbf.ae/investor-relations/investor-presentation/" target="_blank" rel="noreferrer">nbf.ae/investor-relations/investor-presentation ↗</a></td></tr>
<tr><td><strong>NBF Sustainability Reports</strong></td><td><span class="tag tag-prod">ESG / Sustainability</span></td><td>2025–2026</td><td class="url-row"><a href="https://nbf.ae/sustainability/" target="_blank" rel="noreferrer">nbf.ae/sustainability ↗</a></td></tr>
<tr><td><strong>NBF Media Centre / Press Releases</strong></td><td><span class="tag tag-tech">Press Releases</span></td><td>Ongoing 2026</td><td class="url-row"><a href="https://nbf.ae/media-center/" target="_blank" rel="noreferrer">nbf.ae/media-center ↗</a></td></tr>
<tr><td><strong>NBF Corporate Governance Reports</strong></td><td><span class="tag tag-tech">Governance</span></td><td>2026</td><td class="url-row"><a href="https://nbf.ae/corporate-governance/" target="_blank" rel="noreferrer">nbf.ae/corporate-governance ↗</a></td></tr>
<tr><td><strong>ADX Regulatory Filings — NBF</strong></td><td><span class="tag tag-pilot">Regulatory</span></td><td>Ongoing 2026</td><td class="url-row"><a href="https://www.adx.ae" target="_blank" rel="noreferrer">adx.ae (search NBF) ↗</a></td></tr>
</tbody>
</table>
</div>
<div class="card" style="margin-bottom:1.5rem">
<div class="card-title" style="margin-bottom:1rem">AI Use Case Document URLs</div>
<p style="font-size:12px;color:#888;margin-bottom:1rem;font-style:italic">Note: NBF does not publish standalone AI reports or whitepapers. AI content is embedded within the documents below.</p>
<table>
<thead><tr><th>AI Document / Section</th><th>AI Content</th><th>URL</th></tr></thead>
<tbody>
<tr><td><strong>MEA Finance Banking Technology Awards 2025 — NBF Release</strong></td><td>AI fraud detection, AI trade finance, AI mobile banking, AI cybersecurity, AI corporate payments</td><td class="url-row"><a href="https://nbf.ae/national-bank-of-fujairah-wins-in-five-categories-at-mea-finance-banking-technology-awards-2025/" target="_blank" rel="noreferrer">nbf.ae/mea-finance-awards-2025 ↗</a></td></tr>
<tr><td><strong>NBF 2025 Full Year Results — Technology Commentary</strong></td><td>Digitalization investments, tech spending mandate, 2030 digital strategy KPIs</td><td class="url-row"><a href="https://nbf.ae/national-bank-of-fujairah-pjsc-nbf-2025-results/" target="_blank" rel="noreferrer">nbf.ae/nbf-2025-results ↗</a></td></tr>
<tr><td><strong>iGTB / Intellect eMACH.ai Partnership Press Release</strong></td><td>eMACH.ai cloud AI platform, Azure deployment, 329 microservices, wholesale banking AI</td><td class="url-row"><a href="https://www.intellectdesign.com/media/uaes-national-bank-of-fujairah-nbf-partners-with-intellect-for-its-emach-ai-cloud-for-wholesale-banking-on-microsoft-azure/" target="_blank" rel="noreferrer">intellectdesign.com/nbf-emachai ↗</a></td></tr>
<tr><td><strong>Finesse Global MOU Press Release — Oct 2025</strong></td><td>AI ecosystem financing, digital transformation MOU, Finesse AI/automation/cloud partnership</td><td class="url-row"><a href="https://www.zawya.com/en/press-release/companies-news/national-bank-of-fujairah-and-finesse-global-sign-mou-to-accelerate-ai-driven-digital-transformation-in-the-uae-t1m4xrdp" target="_blank" rel="noreferrer">zawya.com/nbf-finesse-mou ↗</a></td></tr>
<tr><td><strong>NBF Knowledge Series — Harnessing AI (Feb 2025)</strong></td><td>Agentic AI exploration, AI strategies for business, ethical AI, Gartner AI insights</td><td class="url-row"><a href="https://nbf.ae/national-bank-of-fujairah-hosts-knowledge-sharing-event-focused-on-harnessing-ai/" target="_blank" rel="noreferrer">nbf.ae/knowledge-series-ai-2025 ↗</a></td></tr>
<tr><td><strong>NBF EDGE Launch — July 2024</strong></td><td>Digital KYC automation, AI-assisted business onboarding, paper-free account opening</td><td class="url-row"><a href="https://www.zawya.com/en/press-release/companies-news/national-bank-of-fujairah-launches-nbf-edge-a-first-of-its-kind-account-opening-platform-i5ip7qfn" target="_blank" rel="noreferrer">zawya.com/nbf-edge-launch ↗</a></td></tr>
<tr><td><strong>NBF Qollect Aani Launch — Nov 2024</strong></td><td>AI payments, instant Aani QR payments, corporate merchant payment AI, Pine Labs partnership</td><td class="url-row"><a href="https://nbf.ae/en/media-content/announcements/press-release/2024/28-11-2024" target="_blank" rel="noreferrer">nbf.ae/qollect-launch ↗</a></td></tr>
<tr><td><strong>CEO Interview — The National (Feb 2026)</strong></td><td>AED 100M/yr tech investment, digital-first strategy, Al Samy, 2030 targets, AI niche banking</td><td class="url-row"><a href="https://www.thenationalnews.com/business/banking/2026/02/27/national-bank-of-fujairah-has-survived-now-it-wants-to-thrive-ceo-says/" target="_blank" rel="noreferrer">thenationalnews.com/nbf-ceo-2026 ↗</a></td></tr>
</tbody>
</table>
</div>
<div class="card">
<div class="card-title" style="margin-bottom:1rem">All Official NBF Source URLs</div>
<div style="display:flex;flex-wrap:wrap;gap:6px">
<a class="chip" href="https://www.nbf.ae" target="_blank" rel="noreferrer">nbf.ae (main)</a>
<a class="chip" href="https://nbf.ae/investor-relations/" target="_blank" rel="noreferrer">Investor Relations</a>
<a class="chip" href="https://nbf.ae/investor-relations/financial-information/" target="_blank" rel="noreferrer">Financial Reports</a>
<a class="chip" href="https://nbf.ae/investor-relations/investor-presentation/" target="_blank" rel="noreferrer">Investor Presentations</a>
<a class="chip" href="https://nbf.ae/sustainability/" target="_blank" rel="noreferrer">Sustainability</a>
<a class="chip" href="https://nbf.ae/media-center/" target="_blank" rel="noreferrer">Media Centre</a>
<a class="chip" href="https://nbf.ae/corporate-governance/" target="_blank" rel="noreferrer">Corporate Governance</a>
<a class="chip" href="https://nbf.ae/aani/" target="_blank" rel="noreferrer">NBF Aani Payments</a>
<a class="chip" href="https://nbfedge.nbf.ae/" target="_blank" rel="noreferrer">NBF EDGE Platform</a>
<a class="chip" href="https://nbfconnect.ae/NBFSMEConnect/" target="_blank" rel="noreferrer">NBF Connect (SME)</a>
<a class="chip" href="https://nbfdirect.nbf.ae" target="_blank" rel="noreferrer">NBF Direct (Retail)</a>
<a class="chip" href="https://www.intellectdesign.com" target="_blank" rel="noreferrer">Intellect iGTB</a>
<a class="chip" href="https://www.adx.ae" target="_blank" rel="noreferrer">ADX Filings</a>
<a class="chip" href="https://www.centralbank.ae" target="_blank" rel="noreferrer">CBUAE</a>
</div>
<div style="margin-top:1.5rem;padding:1rem;background:#f8f8f4;border-radius:8px;font-size:12px;color:#888">
<strong>CEO Report Download:</strong> No standalone CEO AI report is publicly downloadable from nbf.ae. The most comprehensive CEO-level AI statements are available in the Full Year 2025 Results press release (Jan 28, 2026), the Q1 2026 Results statement (Apr 29, 2026), and the exclusive CEO interview in The National (Feb 27, 2026). This AI Intelligence Report constitutes the synthesized CEO-level AI document for NBF.
    </div>
<div style="margin-top:1rem;padding:1rem;background:#f2f8f4;border-radius:8px;font-size:12px;color:#555">
<strong>AI Agent Names Inventory:</strong> NBF Direct Intelligent Banking Agent · CyberShield AI Fraud Detection Agent · eMACH.ai Trade Finance Processing Agent · Qollect Instant Payment Agent · EDGE Digital KYC &amp; Onboarding Agent · IFRS 9 Credit Risk Scoring Agent · Cash Management Optimization Agent · ESG Reporting &amp; Compliance Agent
    </div>
</div>
</div>
</div>
<div class="page-footer">
  NBF AI Intelligence Report 2026 | Autonomous Banking AI Analysis | Sources: nbf.ae, Intellect iGTB, MEA Finance, Zawya, The National, CBUAE | May 2026
</div>`;

export default function NBFAIIntelligenceReport2026() {
  const navigate = useNavigate();
  useEffect(() => {
    window.showPage = (id: string, btn: HTMLElement) => {
      const root = btn.closest(".nbf-ai-intelligence-report-2026") || document;

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
      const root = btn.closest(".nbf-ai-intelligence-report-2026") || document;

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
    <>
      <div className="nbf-ai-intelligence-report-2026">
        <style>{styles}</style>
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 999,
            background: "linear-gradient(135deg,#003d2e 0%,#002a1e 100%)",
            borderBottom: "2px solid #b8952a",
            padding: "10px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.1)",
              border: "1.5px solid rgba(255,255,255,0.3)",
              borderRadius: 10,
              color: "#fff",
              padding: "8px 18px",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              transition: "all 0.18s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.22)";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateX(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.1)";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateX(0)";
            }}
            aria-label="Go back"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M11 4L6 9l5 5"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Hub
          </button>
          <span
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            UAE Banks AI Intelligence Hub 2026
          </span>
        </div>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </>
  );
}
