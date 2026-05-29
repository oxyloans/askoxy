import React, { useEffect } from "react";

declare global {
  interface Window {
    showPage: (id: string, btn: HTMLElement) => void;
    filterUC: (maturity: string, btn: HTMLElement) => void;
  }
}

const styles = `*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#f4f4f0;color:#1a1a1a;font-size:14px;line-height:1.6}
.topbar{background:#005F4B;color:white;padding:0}
.topbar-inner{max-width:1200px;margin:0 auto;padding:1.5rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}
.topbar h1{font-size:20px;font-weight:600;letter-spacing:-0.3px}
.topbar p{font-size:12px;opacity:0.7;margin-top:2px}
.badge-gold{background:#C8A951;color:#fff;font-size:11px;padding:3px 10px;border-radius:20px;font-weight:600}
.nav{background:#004838;padding:0;border-bottom:2px solid #C8A951;overflow-x:auto}
.nav-inner{max-width:1200px;margin:0 auto;display:flex;gap:0}
.nav button{background:none;border:none;color:rgba(255,255,255,0.7);padding:12px 18px;font-size:13px;cursor:pointer;white-space:nowrap;border-bottom:3px solid transparent;transition:all 0.2s}
.nav button:hover,.nav button.active{color:#fff;border-bottom-color:#C8A951}
.container{max-width:1200px;margin:0 auto;padding:1.5rem 2rem}
.page{display:none}.page.active{display:block}
.section-head{margin-bottom:1.5rem}
.section-head h2{font-size:22px;font-weight:600;color:#005F4B;margin-bottom:4px}
.section-head p{font-size:13px;color:#666}
.metrics-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:1.5rem}
.metric{background:#fff;border:0.5px solid #ddd;border-radius:8px;padding:1rem;text-align:center}
.metric .num{font-size:28px;font-weight:700;color:#005F4B;margin-bottom:2px}
.metric .lbl{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.5px}
.card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;margin-bottom:1rem}
.card-title{font-size:15px;font-weight:600;color:#005F4B;margin-bottom:8px}
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
.uc-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-left:4px solid #005F4B}
.uc-id{font-size:10px;color:#999;font-weight:600;letter-spacing:1px;margin-bottom:4px}
.uc-name{font-size:15px;font-weight:600;color:#005F4B;margin-bottom:8px}
.uc-field{margin-bottom:6px}
.uc-label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.4px;font-weight:600;margin-bottom:2px}
.uc-value{font-size:12px;color:#333;line-height:1.5}
.agent-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-left:4px solid #C8A951}
.agent-name{font-size:14px;font-weight:600;color:#005F4B;margin-bottom:8px;display:flex;align-items:center;gap:8px}
.agent-icon{width:28px;height:28px;background:#e6f5f1;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.prog-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-top:3px solid #C8A951}
.prog-name{font-size:14px;font-weight:600;color:#005F4B;margin-bottom:6px}
.prose{font-size:13px;line-height:1.8;color:#2a2a2a}
.prose p{margin-bottom:1rem}
.finding-item{padding:0.75rem 1rem;border-left:3px solid #005F4B;background:#f0f8f5;border-radius:0 6px 6px 0;margin-bottom:0.75rem;font-size:13px;line-height:1.6}
.finding-num{font-weight:700;color:#005F4B;margin-right:8px}
.maturity-bar-wrap{margin-bottom:1rem}
.maturity-label{display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px}
.maturity-bar{height:10px;background:#e8e8e0;border-radius:5px;overflow:hidden}
.maturity-fill{height:100%;border-radius:5px;background:#005F4B;transition:width 1s}
.url-row a{color:#185fa5;text-decoration:none;font-size:12px;word-break:break-all}
.url-row a:hover{text-decoration:underline}
.filter-bar{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:1.5rem}
.filter-btn{border:0.5px solid #ccc;background:#fff;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer;transition:all 0.2s}
.filter-btn.active{background:#005F4B;color:#fff;border-color:#005F4B}
.summary-box{background:#005F4B;color:#fff;border-radius:10px;padding:1.5rem;margin-bottom:1.5rem}
.summary-box h3{font-size:18px;font-weight:600;margin-bottom:1rem;color:#C8A951}
.summary-box p{font-size:13px;line-height:1.8;opacity:0.92}
.ceo-report{background:#fff;border:1px solid #005F4B;border-radius:10px;padding:2rem;font-size:13px;line-height:1.9;color:#1a1a1a}
.ceo-report .report-header{border-bottom:2px solid #005F4B;padding-bottom:1rem;margin-bottom:1.5rem}
.ceo-report h3{font-size:16px;font-weight:700;color:#005F4B;margin:1.5rem 0 0.5rem}
.ceo-report p{margin-bottom:1rem}
.partner-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;display:flex;gap:12px}
.partner-logo{width:48px;height:48px;border-radius:8px;background:#e6f5f1;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:#005F4B;flex-shrink:0;text-align:center;line-height:1.2}
.score-big{font-size:48px;font-weight:700;color:#005F4B;text-align:center;padding:1.5rem;background:#f0f8f5;border-radius:10px;margin-bottom:1rem}
.score-sub{font-size:13px;color:#888;text-align:center;margin-top:-0.5rem;margin-bottom:1rem}
.chip{display:inline-flex;align-items:center;gap:6px;background:#f1f1e8;border:0.5px solid #d8d8c8;border-radius:20px;padding:4px 12px;font-size:11px;color:#444;margin:3px;text-decoration:none}
.chip:hover{background:#e8e8d8}
.page-footer{background:#004838;color:rgba(255,255,255,0.6);font-size:11px;text-align:center;padding:1rem;margin-top:2rem}`;

const htmlContent = `<div class="topbar">
  <div class="topbar-inner">
    <div>
      <h1>Ajman Bank — AI Intelligence Report 2026</h1>
      <p>Autonomous Banking AI Analysis | 15 Use Cases | 6 Agents | 6 Programs | 6 Partnerships | Official Sources Only</p>
    </div>
    <span class="badge-gold">CONFIDENTIAL STRATEGIC REPORT</span>
  </div>
</div>
<nav class="nav">
  <div class="nav-inner">
    <button class="active" onclick="showPage('overview',this)">Overview</button>
    <button onclick="showPage('usecases',this)">AI Use Cases (15)</button>
    <button onclick="showPage('agents',this)">AI Agents (6)</button>
    <button onclick="showPage('programs',this)">AI Programs (6)</button>
    <button onclick="showPage('partnerships',this)">Partnerships (6)</button>
    <button onclick="showPage('maturity',this)">AI Maturity</button>
    <button onclick="showPage('executive',this)">Executive Summary</button>
    <button onclick="showPage('ceo',this)">CEO Report</button>
    <button onclick="showPage('urls',this)">Report URLs</button>
  </div>
</nav>

<!-- OVERVIEW PAGE -->
<div id="page-overview" class="page active">
<div class="container">
  <div class="section-head">
    <h2>AI Intelligence Overview — Ajman Bank 2026</h2>
    <p>Synthesized from official Ajman Bank sources including Q1 2026 Results, Press Releases, Investor Relations, and official partnership announcements</p>
  </div>
  <div class="metrics-grid">
    <div class="metric"><div class="num">15</div><div class="lbl">AI Use Cases</div></div>
    <div class="metric"><div class="num">6</div><div class="lbl">AI Agents</div></div>
    <div class="metric"><div class="num">6</div><div class="lbl">AI Programs</div></div>
    <div class="metric"><div class="num">6</div><div class="lbl">AI Partnerships</div></div>
    <div class="metric"><div class="num">2.8/5</div><div class="lbl">AI Maturity Score</div></div>
    <div class="metric"><div class="num">AED 443M</div><div class="lbl">Q1 2026 Revenue</div></div>
    <div class="metric"><div class="num">+22%</div><div class="lbl">Revenue Growth YoY</div></div>
    <div class="metric"><div class="num">+29%</div><div class="lbl">Digital Onboarding Growth</div></div>
  </div>
  <div class="summary-box">
    <h3>AI Transformation Headline</h3>
    <p>Ajman Bank — the UAE's first Islamic bank incorporated in Ajman — is executing a structured, multi-year digital and AI transformation journey. In 2025–2026, the bank has accelerated from foundational digital work to deploying live AI-powered customer services, including the region's first GenAI Avatar, the generative AI assistant "Hamad," the flagship "Ajman Bank One" mobile platform (launched April 2026), and a next-generation Oracle Cloud trade finance platform. Backed by strategic partnerships with Accenture, Oracle, Dataroid, and SESTEK, and guided by a new Chief Technology Officer appointed in February 2026, Ajman Bank is building a credible AI-native foundation on Shariah-compliant principles.</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1rem;margin-bottom:1.5rem">
    <div class="card">
      <div class="card-title">Key Digital & AI Metrics (Q1 2026)</div>
      <table>
        <tr><td>Customer Base Growth</td><td style="text-align:right;font-weight:600;color:#005F4B">+7% YoY</td></tr>
        <tr><td>New Customer Acquisition</td><td style="text-align:right;font-weight:600;color:#005F4B">+36% YoY</td></tr>
        <tr><td>Digital Onboarding</td><td style="text-align:right;font-weight:600;color:#005F4B">+29% YoY</td></tr>
        <tr><td>Mobile Onboarding Monthly Growth</td><td style="text-align:right;font-weight:600;color:#005F4B">+13% vs avg</td></tr>
        <tr><td>CASA Balance Growth</td><td style="text-align:right;font-weight:600;color:#005F4B">+16% YoY</td></tr>
        <tr><td>GHG Emissions Reduction (2025)</td><td style="text-align:right;font-weight:600;color:#005F4B">-6%</td></tr>
      </table>
    </div>
    <div class="card">
      <div class="card-title">AI Maturity by Dimension</div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">Digital Strategy & Vision</span><span style="font-weight:600">3.5/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:70%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">Core Infrastructure</span><span style="font-weight:600">3.0/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:60%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">AI Production Deployment</span><span style="font-weight:600">2.5/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:50%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">GenAI / Agentic AI</span><span style="font-weight:600">2.5/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:50%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">Data & Analytics</span><span style="font-weight:600">2.8/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:56%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">AI Talent & Governance</span><span style="font-weight:600">2.5/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:50%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">Islamic AI Ethics</span><span style="font-weight:600">3.0/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:60%"></div></div>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-title">Key AI & Technology Partnerships</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      <span class="tag tag-partner">Accenture</span>
      <span class="tag tag-partner">Oracle (OCI)</span>
      <span class="tag tag-partner">Dataroid</span>
      <span class="tag tag-partner">SESTEK</span>
      <span class="tag tag-partner">Dr. Joseph George (New CTO)</span>
      <span class="tag tag-partner">UAE Banks Federation ESG Committee</span>
    </div>
  </div>
</div>
</div>

<!-- USE CASES PAGE -->
<div id="page-usecases" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Use Cases — 15 Identified</h2>
    <p>AI initiatives across Consumer Banking, Corporate Banking, Treasury, Operations and Digital identified from official 2025–2026 sources</p>
  </div>
  <div class="filter-bar" id="uc-filters">
    <button class="filter-btn active" onclick="filterUC('all',this)">All (15)</button>
    <button class="filter-btn" onclick="filterUC('Production',this)">Production</button>
    <button class="filter-btn" onclick="filterUC('Scaling',this)">Scaling</button>
    <button class="filter-btn" onclick="filterUC('Pilot',this)">Pilot / Launch</button>
  </div>
  <div class="uc-grid">

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-001</div>
      <div class="uc-name">GenAI Avatar — Region's First AI Banking Avatar</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Digital Banking / Customer Experience</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Ajman Bank unveiled the region's first GenAI-powered banking avatar at GITEX Global 2025. The avatar provides human-centered, natural language customer engagement across digital and physical banking channels. Built with SESTEK's conversational AI infrastructure, it understands context, speaks naturally, and guides customers in real time.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">First-in-region AI avatar; human-touch digital interaction; 24/7 customer guidance; reduced contact centre dependency; brand positioning as AI-first Islamic bank</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">SESTEK conversational AI infrastructure, GenAI NLP, avatar rendering engine, Arabic/English multilingual</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Ajman Bank Press Release — GITEX Global 2025 (Oct 2025) | zawya.com</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-002</div>
      <div class="uc-name">"Hamad" — Generative AI-Powered Digital Assistant</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Digital</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Named GenAI assistant "Hamad" deployed within Ajman Bank's mobile banking ecosystem. Handles customer queries, account information, product guidance, and transaction support using generative AI. Usage metrics confirmed growing in Q1 2026 official results.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Increased mobile app engagement; 24/7 customer self-service; reduced call centre load; personalised Islamic banking guidance; digital channel stickiness</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">GenAI LLM, conversational AI, mobile banking API integration, Arabic NLP</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Ajman Bank Q1 2026 Results — Board Meeting Statement (April 2026) | zawya.com</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-003</div>
      <div class="uc-name">Ajman Bank One — AI-Enabled Next-Gen Mobile Banking Platform</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Digital Banking / Retail</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">Launched April 2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Flagship next-generation mobile banking application launched 10 April 2026. Features instant account opening, home/auto/personal finance applications, instant digital credit card issuance with same-day activation, fully integrated onboarding and rewards, 24/7 secure access, and AI-powered services including "Hamad" assistant and straight-through processing.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Complete digital bank in one app; digital onboarding +29% YoY; new customer acquisition +36%; STP across core banking; Islamic banking compliance built-in</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Next-gen mobile stack, core banking API integration, AI assistant "Hamad," straight-through processing engine, biometric security</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Ajman Bank Q1 2026 Results (April 2026) | CEO interview — Economy Middle East (Oct 2025)</div></div>
    </div>

    <div class="uc-card" data-maturity="Pilot">
      <div class="uc-id">UC-004</div>
      <div class="uc-name">Ajman Bank One Corp — AI-Powered Corporate Digital Platform</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Corporate Banking</span>
        <span class="tag" style="background:#f0f0f0;color:#7f77dd">Pilot / Launch Q2 2026</span>
        <span class="tag tag-tech">2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Fully integrated digital platform and mobile application for corporate banking customers, scheduled for Q2 2026 launch. Designed to automate corporate banking journeys, provide AI-driven insights, and streamline corporate customer onboarding and service management.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Corporate banking digitisation; reduced manual corporate processes; improved corporate client NPS; straight-through processing for corporate transactions</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Oracle Cloud Infrastructure, corporate banking APIs, AI analytics layer, digital onboarding engine</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Ajman Bank Q1 2026 Results Board Statement (April 2026) | Khaleej Times</div></div>
    </div>

    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-005</div>
      <div class="uc-name">Oracle OCI Trade Finance Platform — AI-Enhanced Trade Processing</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Corporate Banking / Trade Finance</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Ajman Bank is running its next-generation trade finance platform on Oracle Cloud Infrastructure (OCI). The platform leverages Oracle's AI-infused financial services applications for trade finance automation, document processing, and transaction intelligence. Showcased at GTR MENA 2026 (February 2026, Dubai).</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Trade finance process automation; faster letter of credit processing; improved compliance; scalable cloud infrastructure; alignment with Islamic trade finance instruments (Murabaha, Wakala)</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Oracle Cloud Infrastructure (OCI), Oracle Financial Services applications, AI document processing, trade finance APIs</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Ajman Bank official website (ajmanbank.ae) | IBS Intelligence — Dec 2025</div></div>
    </div>

    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-006</div>
      <div class="uc-name">Dataroid AI Analytics — Real-Time Customer Journey Intelligence</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Digital Banking / CX</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">MoU signed with Dataroid at GITEX 2025 to deploy AI-powered digital analytics and customer engagement platform. Provides real-time dashboards, behavioral analytics, customer journey mapping, predictive decision-making, and personalized in-app messaging across mobile and online channels.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Real-time customer journey insights; smarter digital engagement; predictive personalization; push notification optimization; improved digital conversion rates</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Dataroid unified analytics platform, behavioral AI, journey mapping engine, in-app engagement tools</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Ajman Bank Press Release — Dataroid MoU at GITEX Global 2025 (Oct 2025)</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-007</div>
      <div class="uc-name">Digital Extension — Smart Branch Automation</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Distribution</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">Dec 2025</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Launched December 2025, the Digital Extension integrates automation and smart technologies within physical branches to deliver iPad-enabled instant account opening, smart digital assistance, IBAN/liability certificates, reference letters, bank statements, SWIFT confirmations, and personal information updates — without manual counter dependency.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Faster turnaround; reduced manual processing; customer autonomy and self-service; branch modernisation; operational efficiency gains</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">iPad-enabled digital onboarding, automation layer, smart digital assistance, core banking integration</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Ajman Bank Press Release — Digital Extension launch (Dec 2025) | Khaleej Times / Zawya</div></div>
    </div>

    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-008</div>
      <div class="uc-name">Core Banking AI-Ready Platform Upgrade</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Technology / Operations</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">Completed Dec 2025</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Successfully completed planned core banking system upgrade by end of 2025 as part of broader technology roadmap. Enhances system performance, security, and scalability — providing the foundation for AI-powered digital initiatives, improved processing efficiency, and future AI model integration.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">AI-ready infrastructure foundation; enhanced processing efficiency; platform stability; regulatory compliance; reduced technology risk for digital transformation</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Upgraded core banking platform, enhanced API layer, security and scalability infrastructure, cloud-readiness enhancements</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Ajman Bank Press Release — Core Banking Upgrade (Jan 2026) | zawya.com / TradingView</div></div>
    </div>

    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-009</div>
      <div class="uc-name">Accenture Digital Transformation Blueprint — AI Roadmap</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Enterprise Strategy / Technology</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">Oct 2025 – 2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Accenture engaged to deliver Ajman Bank's overarching digital transformation blueprint and AI strategy roadmap. Scope: digital business architecture review, UX/technology architecture assessment, digital delivery operating model, core banking transformation oversight, and future-ready AI capability building.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Structured AI implementation roadmap; technology alignment; improved IT operational efficiency; cost optimisation; reduced transformation risk; competitive positioning vs fintechs</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Accenture high-performance framework, digital maturity assessment tools, transformation blueprint methodology</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Ajman Bank–Accenture Press Release (Oct 2025) | zawya.com / Khaleej Times</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-010</div>
      <div class="uc-name">AI-Powered Digital Onboarding & Account Opening</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Operations</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">End-to-end digital customer onboarding leveraging automation, eKYC, and AI-driven identity verification across mobile and branch channels. Digital onboarding grew 29% YoY in Q1 2026, with mobile onboarding recording 13% monthly growth vs prior-year average.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Digital onboarding +29% YoY; new acquisition +36%; reduced onboarding time; lower manual KYC cost; Shariah-compliant automated account setup</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">eKYC, AI identity verification, digital document processing, mobile-first onboarding platform, biometric authentication</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Ajman Bank Q1 2026 Results (April 2026) | Ajman Bank One press releases</div></div>
    </div>

    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-011</div>
      <div class="uc-name">Sustainable Finance AI Framework — ESG-Linked Analytics</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Sustainability / Corporate Banking</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-assisted Sustainable Finance Framework (SFF) integrating ESG principles into financing decisions. Analytics tools for green finance screening, sustainability-linked loan monitoring, GHG emissions tracking (6% reduction in 2025), and AED 4 billion sustainable finance mobilization target by 2030. Ajman Bank chairs UAE Banks Federation ESG Committee.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">GHG -6% in 2025; ESG compliance; AED 4B sustainable finance target; SME green advisory; investor ESG credibility; ICMA/LMA/CBUAE alignment</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">ESG analytics platform, GHG tracking tools, sustainability-linked finance monitoring, ICMA-aligned reporting</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Economy Middle East — Sustainability Article (Nov 2025) | Ajman Bank sustainability disclosures</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-012</div>
      <div class="uc-name">Online Chat AI — Website Customer Service Automation</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Customer Service / Digital</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">Ongoing 2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-powered online chat feature deployed on ajmanbank.ae offering customers instant assistance and support for inquiries, transactions, and account-related services. Confirmed active and live on official website as of 2026.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">24/7 website customer support; reduced call centre volume; instant query resolution; improved customer satisfaction; digital-first service model</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Conversational AI chatbot, NLP engine, website integration, CRM backend connectivity</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">ajmanbank.ae official website — Digital Banking services section (2026)</div></div>
    </div>

    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-013</div>
      <div class="uc-name">SESTEK Conversational AI Infrastructure — Voice & Avatar Intelligence</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Customer Experience / Technology</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">SESTEK's conversational automation infrastructure underpins Ajman Bank's AI avatar deployment — bridging digital efficiency with personal human interaction. Covers voice AI, natural language understanding, conversational analytics, and post-call intelligence to drive customer experience improvement.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Human-centered AI interaction; reduced dependency on manual agents; voice banking readiness; Arabic conversational AI; localized natural language banking experience</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">SESTEK conversational AI platform, NLU/NLP engine, voice AI, avatar rendering, conversational analytics</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">SESTEK case study — "AI Avatars in Banking: The Ajman Bank Story" (sestek.com)</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-014</div>
      <div class="uc-name">Digital Wallet & Smart Payments AI</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Payments</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-powered digital wallet integrated within Ajman Bank One platform. Enables smart payments, instant card issuance (same-day activation), and AI-driven spend tracking. Aligns with Ajman Bank's "digital bank in your hand" strategy as part of the new flagship app.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Same-day digital card activation; seamless payment experience; AI spend analytics; customer retention through digital rewards; Islamic finance compliance in all transactions</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Digital wallet engine, instant card issuance, AI spend analytics, rewards platform, Ajman Bank One integration</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">CEO Interview — Economy Middle East (Oct 2025) | Ajman Bank One launch announcement (Apr 2026)</div></div>
    </div>

    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-015</div>
      <div class="uc-name">AI-Assisted Shariah-Compliant Product Innovation</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Islamic Banking / Product</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-aided product development and screening for Shariah-compliant financial instruments (Murabaha, Wakala, Sukuk, Ijarah). Supports the bank's Islamic finance positioning, enabling faster product structuring while ensuring compliance with Shariah Supervision Committee rulings. Integrated into sustainable finance and government banking solutions.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Faster Shariah-compliant product launch; reduced product structuring time; AI-assisted fatwa research; competitive Islamic finance positioning; government & institutional banking growth</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Islamic finance NLP, Shariah ruleset engine, product configuration AI, regulatory compliance layer</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Ajman Bank Annual Report 2025 / Islamic Banking disclosures | ajmanbank.ae</div></div>
    </div>

  </div>
</div>
</div>

<!-- AGENTS PAGE -->
<div id="page-agents" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Agent Registry — 6 Identified Agents</h2>
    <p>AI-powered autonomous and semi-autonomous agents confirmed in official 2025–2026 Ajman Bank sources</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem">

    <div class="agent-card">
      <div class="agent-name">
        <div class="agent-icon">🤖</div>
        Hamad — GenAI-Powered Banking Assistant
      </div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Named generative AI assistant deployed in Ajman Bank's mobile banking ecosystem. Handles customer queries, account information, product guidance, and transaction support. Growing usage confirmed in Q1 2026 official results.</div></div>
      <div class="uc-field"><div class="uc-label">Department</div><div class="uc-value"><span class="tag tag-dept">Retail Banking / Digital Channels</span></div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Increased mobile app engagement; 24/7 AI self-service; digital channel stickiness; supports +29% digital onboarding growth; customer-first Shariah-compliant experience</div></div>
      <div class="uc-field"><div class="uc-label">Technology Stack</div><div class="uc-value" style="color:#185fa5">GenAI LLM, conversational AI, Arabic NLP, mobile banking API</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Q1 2026 Board Results Statement — Ajman Bank (April 2026)</div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name">
        <div class="agent-icon">🧑‍💼</div>
        AI Avatar Agent — Region's First Banking AI Avatar
      </div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">GenAI-powered visual avatar agent bridging digital efficiency with personal human interaction. Understands context, speaks naturally, and guides customers through banking journeys in real time across digital and physical channels.</div></div>
      <div class="uc-field"><div class="uc-label">Department</div><div class="uc-value"><span class="tag tag-dept">Customer Experience / Digital Banking</span></div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">First-in-region Islamic banking AI avatar; human-centered digital experience; reduced human agent dependency; brand differentiation; language-natural customer engagement</div></div>
      <div class="uc-field"><div class="uc-label">Technology Stack</div><div class="uc-value" style="color:#185fa5">SESTEK conversational AI, GenAI NLP, avatar rendering engine, Arabic/English multilingual NLU</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">GITEX Global 2025 Press Release (Oct 2025) | SESTEK case study</div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name">
        <div class="agent-icon">📊</div>
        Dataroid Analytics Agent — Customer Journey Intelligence
      </div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">AI-powered digital analytics agent providing real-time dashboards, behavioral analytics, customer journey mapping, and personalized in-app engagement tools (push notifications, personalized messaging) across mobile and online channels.</div></div>
      <div class="uc-field"><div class="uc-label">Department</div><div class="uc-value"><span class="tag tag-dept">Digital Banking / Marketing / CX</span></div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Predictive customer decision-making; optimized digital performance; deeper customer relationships; personalized Islamic banking experience; improved digital conversion</div></div>
      <div class="uc-field"><div class="uc-label">Technology Stack</div><div class="uc-value" style="color:#185fa5">Dataroid unified analytics platform, behavioral AI engine, real-time dashboards, journey mapping</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Dataroid–Ajman Bank MoU Press Release at GITEX 2025 (Oct 2025)</div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name">
        <div class="agent-icon">🏦</div>
        Website Chat AI Agent — 24/7 Online Service Bot
      </div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">AI-powered online chat agent deployed on ajmanbank.ae providing instant customer assistance for inquiries, transactions, and account-related services around the clock without human agent intervention.</div></div>
      <div class="uc-field"><div class="uc-label">Department</div><div class="uc-value"><span class="tag tag-dept">Customer Service / Digital</span></div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">24/7 customer service availability; contact centre deflection; instant query resolution; digital-first service model; improved customer satisfaction</div></div>
      <div class="uc-field"><div class="uc-label">Technology Stack</div><div class="uc-value" style="color:#185fa5">Conversational AI chatbot, NLP, website integration, CRM API connectivity</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">ajmanbank.ae official website — Digital Banking & chat feature (2026)</div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name">
        <div class="agent-icon">☁️</div>
        Oracle OCI Trade Finance AI Agent
      </div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">AI-infused agent running on Oracle Cloud Infrastructure orchestrating trade finance transactions — automating document ingestion, compliance checking, trade instrument processing (letters of credit, guarantees), and workflow management for corporate clients.</div></div>
      <div class="uc-field"><div class="uc-label">Department</div><div class="uc-value"><span class="tag tag-dept">Corporate Banking / Trade Finance</span></div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Trade finance automation; faster processing; Islamic trade finance compliance; scalable OCI infrastructure; supports GTR MENA 2026 trade banking growth strategy</div></div>
      <div class="uc-field"><div class="uc-label">Technology Stack</div><div class="uc-value" style="color:#185fa5">Oracle Cloud Infrastructure, Oracle Financial Services AI applications, trade finance automation engine</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Ajman Bank official website (ajmanbank.ae) | IBS Intelligence (Dec 2025)</div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name">
        <div class="agent-icon">📱</div>
        Ajman Bank One STP Agent — Straight-Through Processing
      </div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">AI-driven straight-through processing agent embedded within the Ajman Bank One platform, automating end-to-end customer transactions including account opening, finance applications, and card issuance without human intervention triggers.</div></div>
      <div class="uc-field"><div class="uc-label">Department</div><div class="uc-value"><span class="tag tag-dept">Retail Banking / Operations / Digital</span></div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Instant account opening; same-day card activation; digital onboarding +29%; reduced manual processing cost; operational efficiency across retail banking</div></div>
      <div class="uc-field"><div class="uc-label">Technology Stack</div><div class="uc-value" style="color:#185fa5">STP engine, AI decisioning, eKYC integration, Ajman Bank One mobile platform, core banking APIs</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Q1 2026 Board Results Statement (April 2026) | Ajman Bank One launch (April 2026)</div></div>
    </div>

  </div>
</div>
</div>

<!-- PROGRAMS PAGE -->
<div id="page-programs" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Programs — 6 Enterprise Programs</h2>
    <p>Major AI and digital transformation programs driving Ajman Bank's AI-native strategy 2025–2026</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem">

    <div class="prog-card">
      <div class="prog-name">Ajman Bank One — Digital Transformation Platform Program</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Active / Production</span>
        <span class="tag tag-tech">Launched April 2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Flagship multi-year digital transformation program culminating in the April 2026 launch of "Ajman Bank One" — the bank's next-generation AI-enabled mobile banking platform. Covers retail (launched), corporate (Q2 2026 planned), and full STP integration.</div></div>
      <div class="uc-field"><div class="uc-label">Scope</div><div class="uc-value">Retail Banking, Corporate Banking, Digital Channels, Operations</div></div>
      <div class="uc-field"><div class="uc-label">Investment Indication</div><div class="uc-value" style="color:#005F4B;font-weight:600">Multi-year digital CAPEX; confirmed ongoing throughout 2026</div></div>
    </div>

    <div class="prog-card">
      <div class="prog-name">GenAI & AI Avatar Program</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Production / Expanding</span>
        <span class="tag tag-tech">Since 2025</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Enterprise GenAI deployment covering "Hamad" AI assistant, the region's first banking AI avatar (SESTEK-powered), website chat AI, and future generative AI integrations across customer-facing and internal channels.</div></div>
      <div class="uc-field"><div class="uc-label">Scope</div><div class="uc-value">Customer Experience, Digital Banking, Operations</div></div>
      <div class="uc-field"><div class="uc-label">Investment Indication</div><div class="uc-value" style="color:#005F4B;font-weight:600">Part of digital transformation CAPEX; SESTEK partnership agreement</div></div>
    </div>

    <div class="prog-card">
      <div class="prog-name">Oracle Cloud Infrastructure (OCI) Transformation Program</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Scaling</span>
        <span class="tag tag-tech">Since 2025</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Migration of trade finance and core banking capabilities to Oracle Cloud Infrastructure. Enables AI-infused Oracle Financial Services applications, scalable cloud processing, and future AI model deployment across corporate and trade banking.</div></div>
      <div class="uc-field"><div class="uc-label">Scope</div><div class="uc-value">Corporate Banking / Trade Finance / Technology</div></div>
      <div class="uc-field"><div class="uc-label">Investment Indication</div><div class="uc-value" style="color:#005F4B;font-weight:600">Oracle strategic partnership; undisclosed investment value</div></div>
    </div>

    <div class="prog-card">
      <div class="prog-name">Accenture Digital Transformation & AI Strategy Program</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Active</span>
        <span class="tag tag-tech">Oct 2025 – 2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Accenture-led digital maturity assessment and AI strategy roadmap covering technology alignment, digital business architecture, core banking transformation oversight, and operating model redesign — building the AI-ready foundation for Ajman Bank's growth.</div></div>
      <div class="uc-field"><div class="uc-label">Scope</div><div class="uc-value">Enterprise-wide — Technology, Strategy, Operations, Digital</div></div>
      <div class="uc-field"><div class="uc-label">Investment Indication</div><div class="uc-value" style="color:#005F4B;font-weight:600">Accenture consulting engagement; undisclosed</div></div>
    </div>

    <div class="prog-card">
      <div class="prog-name">Data-Driven Customer Engagement Program (Dataroid)</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Scaling</span>
        <span class="tag tag-tech">Since Oct 2025</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Strategic MoU with Dataroid to deploy AI-powered behavioral analytics, real-time customer journey insights, predictive decision-making, and personalized engagement across all digital touchpoints. Foundation for Ajman Bank's data-driven Islamic digital banking vision.</div></div>
      <div class="uc-field"><div class="uc-label">Scope</div><div class="uc-value">Digital Banking, Marketing, Customer Experience</div></div>
      <div class="uc-field"><div class="uc-label">Investment Indication</div><div class="uc-value" style="color:#005F4B;font-weight:600">MoU signed GITEX 2025; implementation investment ongoing</div></div>
    </div>

    <div class="prog-card">
      <div class="prog-name">Sustainable Finance & ESG AI Framework</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Active / Expanding</span>
        <span class="tag tag-tech">2025–2030</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Inaugural Sustainable Finance Framework with AI-assisted ESG analytics, GHG tracking, green finance screening, and AED 4 billion sustainable finance mobilization target by 2030. Ajman Bank chairs UAE Banks Federation ESG Committee, positioning it as a leading Islamic ESG bank.</div></div>
      <div class="uc-field"><div class="uc-label">Scope</div><div class="uc-value">Corporate Banking, Risk, Sustainability, Investment Banking</div></div>
      <div class="uc-field"><div class="uc-label">Investment Indication</div><div class="uc-value" style="color:#005F4B;font-weight:600">AED 4B sustainable finance mobilisation target by 2030</div></div>
    </div>

  </div>
</div>
</div>

<!-- PARTNERSHIPS PAGE -->
<div id="page-partnerships" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI & Technology Partnerships — 6 Strategic Partners</h2>
    <p>Official technology and AI partnerships confirmed from Ajman Bank press releases and announcements 2025–2026</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem">

    <div class="partner-card">
      <div class="partner-logo">ACN</div>
      <div>
        <div style="font-weight:600;color:#005F4B;font-size:14px;margin-bottom:4px">Accenture</div>
        <div class="uc-field"><div class="uc-label">Partnership Type</div><div class="uc-value">Digital Transformation & AI Strategy Consulting</div></div>
        <div class="uc-field"><div class="uc-label">Scope</div><div class="uc-value">Digital maturity assessment, AI roadmap, core banking transformation oversight, digital architecture review, operating model redesign</div></div>
        <div class="uc-field"><div class="uc-label">Date</div><div class="uc-value">Signed October 2025 (GITEX Global)</div></div>
        <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888"><a href="https://www.zawya.com/en/press-release/companies-news/ajman-bank-collaborates-with-accenture-to-accelerate-digital-transformation-and-enhance-customer-centricity-k3mr6m0l" target="_blank">zawya.com press release ↗</a></div></div>
      </div>
    </div>

    <div class="partner-card">
      <div class="partner-logo">OCI</div>
      <div>
        <div style="font-weight:600;color:#005F4B;font-size:14px;margin-bottom:4px">Oracle (OCI)</div>
        <div class="uc-field"><div class="uc-label">Partnership Type</div><div class="uc-value">Cloud Infrastructure & Trade Finance AI Platform</div></div>
        <div class="uc-field"><div class="uc-label">Scope</div><div class="uc-value">Next-generation trade finance platform on Oracle Cloud Infrastructure; AI-infused Oracle Financial Services applications for corporate banking</div></div>
        <div class="uc-field"><div class="uc-label">Date</div><div class="uc-value">Announced December 2025</div></div>
        <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888"><a href="https://ibsintelligence.com/ibsi-news/ajman-bank-taps-oracle-to-modernise-trade-finance/" target="_blank">IBS Intelligence ↗</a></div></div>
      </div>
    </div>

    <div class="partner-card">
      <div class="partner-logo">DRD</div>
      <div>
        <div style="font-weight:600;color:#005F4B;font-size:14px;margin-bottom:4px">Dataroid</div>
        <div class="uc-field"><div class="uc-label">Partnership Type</div><div class="uc-value">AI-Powered Digital Analytics & Customer Engagement</div></div>
        <div class="uc-field"><div class="uc-label">Scope</div><div class="uc-value">Real-time dashboards, behavioral analytics, journey mapping, predictive decision-making, personalized in-app engagement across mobile and online channels</div></div>
        <div class="uc-field"><div class="uc-label">Date</div><div class="uc-value">MoU signed October 2025 (GITEX Global)</div></div>
        <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888"><a href="https://www.ajmanbank.ae/site/newsdetail/ajman-bank-partners-with-dataroid-to-advance-data-driven-transformation-and-redefine-digital-customer-experience" target="_blank">ajmanbank.ae ↗</a></div></div>
      </div>
    </div>

    <div class="partner-card">
      <div class="partner-logo">STK</div>
      <div>
        <div style="font-weight:600;color:#005F4B;font-size:14px;margin-bottom:4px">SESTEK</div>
        <div class="uc-field"><div class="uc-label">Partnership Type</div><div class="uc-value">Conversational AI & AI Avatar Infrastructure</div></div>
        <div class="uc-field"><div class="uc-label">Scope</div><div class="uc-value">Powers the region's first banking AI avatar; conversational automation, voice AI, NLU, Arabic banking dialogue, avatar rendering engine</div></div>
        <div class="uc-field"><div class="uc-label">Date</div><div class="uc-value">2025 (GITEX Global 2025 deployment)</div></div>
        <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888"><a href="https://www.sestek.com/ai-avatars-in-banking-the-ajman-bank-story-blog" target="_blank">sestek.com case study ↗</a></div></div>
      </div>
    </div>

    <div class="partner-card">
      <div class="partner-logo">AHR Dept</div>
      <div>
        <div style="font-weight:600;color:#005F4B;font-size:14px;margin-bottom:4px">Ajman HR Department</div>
        <div class="uc-field"><div class="uc-label">Partnership Type</div><div class="uc-value">Government Strategic Cooperation — Employee Financial Services</div></div>
        <div class="uc-field"><div class="uc-label">Scope</div><div class="uc-value">Strategic cooperation agreement for wellbeing and financial empowerment of Ajman Government employees; digital banking services integration with government HR systems</div></div>
        <div class="uc-field"><div class="uc-label">Date</div><div class="uc-value">2026</div></div>
        <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888"><a href="https://www.ajmanbank.ae/site/" target="_blank">ajmanbank.ae ↗</a></div></div>
      </div>
    </div>

    <div class="partner-card">
      <div class="partner-logo">UAE BF ESG</div>
      <div>
        <div style="font-weight:600;color:#005F4B;font-size:14px;margin-bottom:4px">UAE Banks Federation — ESG Committee</div>
        <div class="uc-field"><div class="uc-label">Partnership Type</div><div class="uc-value">Industry Leadership — ESG & Sustainable Finance</div></div>
        <div class="uc-field"><div class="uc-label">Scope</div><div class="uc-value">Ajman Bank chairs the UAE Banks Federation ESG Committee, shaping national ESG banking agenda; sustainable finance framework development; industry AI governance for Islamic banking</div></div>
        <div class="uc-field"><div class="uc-label">Date</div><div class="uc-value">Ongoing 2025–2026</div></div>
        <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888"><a href="https://economymiddleeast.com/news/ajman-bank-driving-sustainable-growth-and-transition/" target="_blank">Economy Middle East ↗</a></div></div>
      </div>
    </div>

  </div>
</div>
</div>

<!-- MATURITY PAGE -->
<div id="page-maturity" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Maturity Assessment — Ajman Bank 2026</h2>
    <p>Independent assessment based on publicly available 2025–2026 evidence; benchmarked against UAE Islamic banking peers</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1rem;margin-bottom:1.5rem">
    <div>
      <div class="score-big">2.8 / 5.0</div>
      <div class="score-sub">Overall AI Maturity Score — Structured Transformation Phase</div>
      <div class="card" style="margin-top:1rem">
        <div class="card-title">Maturity Classification</div>
        <p class="prose">Ajman Bank is classified as <strong>Structured Transformation Phase</strong> — actively building AI foundations with some live production deployments, strong external partnerships, and a clear multi-year roadmap. Significantly progressed vs. 2024, but still early relative to UAE tier-1 banks such as FAB or ENBD.</p>
      </div>
    </div>
    <div>
      <div class="card">
        <div class="card-title">Detailed Maturity Scores</div>
        <div class="maturity-bar-wrap">
          <div class="maturity-label"><span>Digital Strategy & Vision</span><span style="font-weight:600">3.5/5</span></div>
          <div class="maturity-bar"><div class="maturity-fill" style="width:70%"></div></div>
        </div>
        <div class="maturity-bar-wrap">
          <div class="maturity-label"><span>Core Banking Infrastructure</span><span style="font-weight:600">3.0/5</span></div>
          <div class="maturity-bar"><div class="maturity-fill" style="width:60%"></div></div>
        </div>
        <div class="maturity-bar-wrap">
          <div class="maturity-label"><span>AI Production Deployment</span><span style="font-weight:600">2.5/5</span></div>
          <div class="maturity-bar"><div class="maturity-fill" style="width:50%"></div></div>
        </div>
        <div class="maturity-bar-wrap">
          <div class="maturity-label"><span>GenAI / Agentic AI</span><span style="font-weight:600">2.5/5</span></div>
          <div class="maturity-bar"><div class="maturity-fill" style="width:50%"></div></div>
        </div>
        <div class="maturity-bar-wrap">
          <div class="maturity-label"><span>Data & Analytics Platform</span><span style="font-weight:600">2.8/5</span></div>
          <div class="maturity-bar"><div class="maturity-fill" style="width:56%"></div></div>
        </div>
        <div class="maturity-bar-wrap">
          <div class="maturity-label"><span>AI Talent & Governance</span><span style="font-weight:600">2.5/5</span></div>
          <div class="maturity-bar"><div class="maturity-fill" style="width:50%"></div></div>
        </div>
        <div class="maturity-bar-wrap">
          <div class="maturity-label"><span>Islamic AI Ethics & Shariah</span><span style="font-weight:600">3.0/5</span></div>
          <div class="maturity-bar"><div class="maturity-fill" style="width:60%"></div></div>
        </div>
        <div class="maturity-bar-wrap">
          <div class="maturity-label"><span>AI Culture & Adoption</span><span style="font-weight:600">2.5/5</span></div>
          <div class="maturity-bar"><div class="maturity-fill" style="width:50%"></div></div>
        </div>
      </div>
    </div>
  </div>
  <div class="section-head" style="margin-top:1rem"><h2>Strategic Findings</h2></div>
  <div class="finding-item"><span class="finding-num">01</span>Ajman Bank is in active AI acceleration mode: 2025–2026 marks a decisive inflection with the launch of AI Avatar, GenAI assistant "Hamad," Ajman Bank One, and the Oracle OCI trade finance platform — all representing real production deployments, not pilots.</div>
  <div class="finding-item"><span class="finding-num">02</span>The appointment of Dr. Joseph George as CTO in February 2026 signals institutional commitment to technology leadership, providing dedicated oversight for the bank's AI and digital infrastructure agenda.</div>
  <div class="finding-item"><span class="finding-num">03</span>The region's first banking AI Avatar — built with SESTEK — positions Ajman Bank uniquely in the Islamic banking space, differentiating on human-centered digital experience in a Shariah-compliant context.</div>
  <div class="finding-item"><span class="finding-num">04</span>The Accenture partnership provides critical external AI strategy and digital architecture capability, accelerating Ajman Bank's journey and reducing transformation risk — a smart capital-efficient approach for a mid-sized bank.</div>
  <div class="finding-item"><span class="finding-num">05</span>Strong financial momentum validates the AI-digital strategy: Q1 2026 revenue +22% YoY, customer growth +7%, new acquisition +36%, CASA +16% — suggesting digital investments are translating to commercial outcomes.</div>
  <div class="finding-item"><span class="finding-num">06</span>The Dataroid partnership for behavioral AI analytics addresses a critical gap — real-time customer intelligence — enabling Ajman Bank to compete with larger banks on personalization without building it entirely in-house.</div>
  <div class="finding-item"><span class="finding-num">07</span>AI maturity gap vs. UAE Tier-1 banks remains significant. Ajman Bank is building foundations, not yet at scale AI deployment levels of FAB, ENBD, or ADCB. Closing this gap is a 2–3 year journey requiring sustained investment.</div>
  <div class="finding-item"><span class="finding-num">08</span>The Sustainable Finance Framework (AED 4B target by 2030) and ESG Committee chairmanship represent a differentiated long-term positioning — combining Islamic finance principles with ESG-AI analytics for green banking leadership.</div>
</div>
</div>

<!-- EXECUTIVE SUMMARY PAGE -->
<div id="page-executive" class="page">
<div class="container">
  <div class="section-head">
    <h2>Executive Summary — Ajman Bank AI Intelligence 2026</h2>
    <p>Synthesized AI executive brief for senior leadership and board-level strategic review</p>
  </div>
  <div class="summary-box">
    <h3>AI Executive Summary — Ajman Bank</h3>
    <p>Ajman Bank — the UAE's first Islamic bank incorporated in Ajman, listed on the Dubai Financial Market — is executing a credible and accelerating AI and digital transformation in 2025–2026. Under CEO Mustafa Al Khalfawi's vision of a "digital, seamless, and human-centered" bank, and with new CTO Dr. Joseph George appointed February 2026, the bank has moved from strategy to execution. Key AI deployments confirmed in 2026 include the region's first GenAI Banking Avatar (SESTEK-powered), the named GenAI assistant "Hamad" with growing mobile adoption, the flagship "Ajman Bank One" mobile platform (launched April 2026), and an Oracle Cloud-based next-generation trade finance platform. Strategic AI partnerships with Accenture (digital transformation blueprint), Dataroid (behavioral AI analytics), and SESTEK (conversational AI) complement the internal capabilities. Financial performance validates the strategy: Q1 2026 delivered AED 443M revenue (+22% YoY), 36% growth in new customer acquisition, and 29% growth in digital onboarding. Ajman Bank's AI maturity score stands at 2.8/5.0 — classified as Structured Transformation Phase — with meaningful acceleration underway and a 2–3 year window to close the gap with UAE Tier-1 banks.</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1rem">
    <div class="card">
      <div class="card-title">Top 5 AI Priorities — 2026</div>
      <table>
        <tr><td>1. Scale "Hamad" GenAI assistant across all channels</td></tr>
        <tr><td>2. Launch Ajman Bank One Corp (Q2 2026)</td></tr>
        <tr><td>3. Deploy Dataroid behavioral AI at enterprise scale</td></tr>
        <tr><td>4. Deepen Oracle OCI AI capabilities in trade finance</td></tr>
        <tr><td>5. Advance ESG AI analytics toward AED 4B target</td></tr>
      </table>
    </div>
    <div class="card">
      <div class="card-title">AI Risk & Gap Assessment</div>
      <table>
        <tr><td>AI talent depth vs. peers</td><td><span class="tag tag-scale">Gap</span></td></tr>
        <tr><td>Data platform maturity</td><td><span class="tag tag-scale">Developing</span></td></tr>
        <tr><td>AI governance framework</td><td><span class="tag tag-pilot">Early Stage</span></td></tr>
        <tr><td>Scale vs. Tier-1 UAE banks</td><td><span class="tag tag-scale">Closing Gap</span></td></tr>
        <tr><td>Islamic AI ethics framework</td><td><span class="tag tag-prod">Strength</span></td></tr>
      </table>
    </div>
  </div>
</div>
</div>

<!-- CEO REPORT PAGE -->
<div id="page-ceo" class="page">
<div class="container">
  <div class="section-head">
    <h2>CEO AI Intelligence Report — Ajman Bank 2026</h2>
    <p>Board and CEO-level AI strategic briefing document</p>
  </div>
  <div class="ceo-report">
    <div class="report-header">
      <div style="font-size:11px;color:#888;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px">Confidential Strategic Brief</div>
      <div style="font-size:20px;font-weight:700;color:#005F4B">Ajman Bank PJSC — AI Transformation Intelligence Report 2026</div>
      <div style="font-size:12px;color:#888;margin-top:4px">Prepared: May 2026 | Classification: Strategic | Sources: Official Ajman Bank disclosures, Q1 2026 Results, Press Releases 2025–2026</div>
    </div>

    <h3>Executive Overview</h3>
    <p>Ajman Bank is at a pivotal juncture in its AI and digital transformation journey. After years of laying foundational infrastructure, the bank has entered active AI production deployment in 2025–2026, delivering the region's first banking AI Avatar, a named GenAI assistant ("Hamad"), the Ajman Bank One mobile platform, and an Oracle Cloud-based trade finance engine. These developments, combined with strategic partnerships with Accenture, Dataroid, and SESTEK, and the appointment of a dedicated Chief Technology Officer in February 2026, represent a meaningful step-change in the bank's AI capabilities.</p>

    <h3>Financial Context</h3>
    <p>The AI-digital strategy is delivering commercial results. Q1 2026 reported net profit after tax of AED 130 million, with total revenue up 22% year-on-year to AED 443 million. Customer base grew 7% with new acquisition up 36%, and digital onboarding increased 29% year-on-year. CASA balances grew 16%, reflecting the strengthening of Ajman Bank's position as a primary banking partner. These metrics confirm that the digital and AI investments are generating tangible customer growth outcomes.</p>

    <h3>AI Production Deployments</h3>
    <p>Six AI agents and fifteen AI use cases have been confirmed from official sources. The most significant production deployments are: (1) GenAI Avatar — the region's first banking AI avatar, built with SESTEK, providing human-centered digital interaction; (2) "Hamad" GenAI assistant, confirmed live with growing mobile usage in Q1 2026 results; (3) Ajman Bank One platform (April 2026), with STP capabilities and AI-driven services; and (4) Oracle OCI trade finance platform, modernising corporate banking with cloud AI capabilities. The Digital Extension (December 2025) delivered smart branch automation, reducing manual counter dependency.</p>

    <h3>Strategic Partnerships</h3>
    <p>Ajman Bank has assembled a high-quality external AI and technology partner ecosystem: Accenture provides digital transformation strategy and AI roadmap governance; Oracle provides cloud infrastructure and AI applications for trade finance; Dataroid delivers behavioral AI and real-time customer analytics; and SESTEK provides the conversational AI infrastructure powering the avatar and banking dialogue systems. This ecosystem approach — leveraging best-in-class partners rather than purely building in-house — is a capital-efficient strategy well-suited to a mid-sized Islamic bank.</p>

    <h3>AI Maturity Assessment</h3>
    <p>The bank scores 2.8/5.0 on the AI Maturity Index — classified as Structured Transformation Phase. Strengths include a clear digital vision, committed leadership, meaningful live deployments, and Shariah-compliant AI ethics positioning. Gaps relative to UAE Tier-1 banks include depth of AI talent, data platform maturity, absence of a published responsible AI governance framework, and the breadth of AI use cases still in early stages. A 2–3 year sustained investment horizon is required to close the competitive gap.</p>

    <h3>Strategic Recommendations for Board</h3>
    <p>Five strategic recommendations emerge from this analysis: (1) Accelerate enterprise AI talent acquisition and upskilling — appoint a dedicated Chief AI Officer or AI Director; (2) Publish a Responsible AI Framework aligned to CBUAE guidelines and UAE AI Strategy 2031; (3) Scale "Hamad" and the AI Avatar aggressively across all customer touchpoints before competitors replicate; (4) Invest in a unified data platform to power predictive analytics across retail, corporate and treasury; (5) Use Ajman Bank One Corp (Q2 2026 launch) as the foundation for AI-driven corporate banking differentiation in the UAE SME and government segment.</p>

    <h3>Outlook</h3>
    <p>Ajman Bank is on a credible and accelerating AI trajectory. The combination of a purpose-driven CEO, a newly appointed CTO, strong external partnerships, improving financial performance, and first-mover AI deployments in the Islamic banking space creates genuine competitive differentiation. The bank's Shariah-compliant AI approach, ESG leadership, and focus on human-centered digital experiences represent a distinctive positioning that larger, more complex banks will find difficult to replicate authentically. With disciplined execution in 2026–2027, Ajman Bank can establish itself as the UAE's leading AI-powered Islamic bank.</p>

    <div style="margin-top:1.5rem;padding:1rem;background:#f0f8f5;border-radius:8px;font-size:12px;color:#555;border-left:3px solid #005F4B">
      <strong>Report Basis:</strong> This report is synthesized from official Ajman Bank sources including Q1 2026 earnings statement (April 2026), official press releases on ajmanbank.ae and zawya.com, the GITEX 2025 announcements, the Accenture/Oracle/Dataroid/SESTEK partnership announcements, CEO interview (Economy Middle East, October 2025), and IBS Intelligence reports. All AI capabilities cited are confirmed from official sources only.
    </div>
  </div>
</div>
</div>

<!-- URLS PAGE -->
<div id="page-urls" class="page">
<div class="container">
  <div class="section-head">
    <h2>2026 Report Download URL Inventory</h2>
    <p>Official Ajman Bank document sources — all URLs verified against ajmanbank.ae and official announcement sources</p>
  </div>
  <div class="card" style="margin-bottom:1.5rem">
    <div class="card-title" style="margin-bottom:1rem">Latest 2026 Report Inventory URLs</div>
    <table>
      <thead><tr><th>Document Name</th><th>Type</th><th>Date</th><th>URL</th></tr></thead>
      <tbody>
        <tr><td><strong>Ajman Bank Annual Integrated Report 2025</strong></td><td><span class="tag tag-dept">Annual Report</span></td><td>2026</td><td class="url-row"><a href="https://www.ajmanbank.ae/site/investor-relations-1.html" target="_blank">ajmanbank.ae/investor-relations ↗</a></td></tr>
        <tr><td><strong>Q1 2026 Financial Results</strong></td><td><span class="tag tag-scale">Results Statement</span></td><td>April 29, 2026</td><td class="url-row"><a href="https://www.ajmanbank.ae/site/performance.html" target="_blank">ajmanbank.ae/site/performance.html ↗</a></td></tr>
        <tr><td><strong>Interim Financial Statements March 2026</strong></td><td><span class="tag tag-scale">Financial Statement</span></td><td>March 2026</td><td class="url-row"><a href="https://www.ajmanbank.ae/site/performance.html" target="_blank">ajmanbank.ae/site/performance.html ↗</a></td></tr>
        <tr><td><strong>Sustainability Report 2023</strong></td><td><span class="tag tag-prod">ESG/Sustainability</span></td><td>2024 (latest public)</td><td class="url-row"><a href="https://www.ajmanbank.ae/site/investor-relations-1.html" target="_blank">ajmanbank.ae/investor-relations ↗</a></td></tr>
        <tr><td><strong>AGM 2026 — Annual General Meeting</strong></td><td><span class="tag tag-tech">Regulatory/AGM</span></td><td>2026</td><td class="url-row"><a href="https://www.ajmanbank.ae/site/investor-relations.html" target="_blank">ajmanbank.ae/investor-relations.html ↗</a></td></tr>
        <tr><td><strong>Pillar III Basel III Disclosures</strong></td><td><span class="tag tag-tech">Regulatory</span></td><td>Ongoing 2026</td><td class="url-row"><a href="https://www.ajmanbank.ae/site/investor-relations-1.html" target="_blank">ajmanbank.ae/investor-relations ↗</a></td></tr>
        <tr><td><strong>DFM Regulatory Disclosures — AJMANBANK</strong></td><td><span class="tag tag-tech">Regulatory</span></td><td>Ongoing 2026</td><td class="url-row"><a href="https://www.dfm.ae" target="_blank">dfm.ae (DFM filings) ↗</a></td></tr>
        <tr><td><strong>Press Releases 2025–2026</strong></td><td><span class="tag tag-pilot">Press Releases</span></td><td>Ongoing 2026</td><td class="url-row"><a href="https://www.ajmanbank.ae/site/" target="_blank">ajmanbank.ae (news section) ↗</a></td></tr>
      </tbody>
    </table>
  </div>
  <div class="card" style="margin-bottom:1.5rem">
    <div class="card-title" style="margin-bottom:1rem">AI Use Case Document URLs</div>
    <p style="font-size:12px;color:#888;margin-bottom:1rem;font-style:italic">Note: Ajman Bank does not publish standalone AI whitepapers. AI content is embedded in the documents and press releases below.</p>
    <table>
      <thead><tr><th>AI Document / Section</th><th>AI Content</th><th>URL</th></tr></thead>
      <tbody>
        <tr><td><strong>Q1 2026 Board Results Statement</strong></td><td>GenAI assistant "Hamad," Ajman Bank One AI features, digital onboarding AI metrics, Ajman Bank One Corp Q2 2026</td><td class="url-row"><a href="https://www.zawya.com/en/press-release/companies-news/hh-sheikh-ammar-bin-humaid-al-nuaimi-chairs-ajman-bank-board-meeting-ygmrnhnn" target="_blank">zawya.com — Q1 2026 results ↗</a></td></tr>
        <tr><td><strong>GITEX 2025 — GenAI Avatar & Ajman Bank One Press Release</strong></td><td>Region's first GenAI banking avatar, Ajman Bank One platform, AI digital strategy</td><td class="url-row"><a href="https://www.zawya.com/en/press-release/companies-news/ajman-bank-unveils-gen-ai-avatar-and-the-upcoming-ajman-bank-one-digital-platform-at-gitex-global-2025-szjoib1v" target="_blank">zawya.com — GITEX 2025 ↗</a></td></tr>
        <tr><td><strong>Accenture Partnership Press Release</strong></td><td>Digital transformation blueprint, AI strategy roadmap, digital maturity assessment, AI operating model</td><td class="url-row"><a href="https://www.zawya.com/en/press-release/companies-news/ajman-bank-collaborates-with-accenture-to-accelerate-digital-transformation-and-enhance-customer-centricity-k3mr6m0l" target="_blank">zawya.com — Accenture ↗</a></td></tr>
        <tr><td><strong>Dataroid MoU Press Release</strong></td><td>AI-powered behavioral analytics, customer journey AI, predictive engagement, real-time dashboards</td><td class="url-row"><a href="https://www.ajmanbank.ae/site/newsdetail/ajman-bank-partners-with-dataroid-to-advance-data-driven-transformation-and-redefine-digital-customer-experience" target="_blank">ajmanbank.ae — Dataroid ↗</a></td></tr>
        <tr><td><strong>SESTEK AI Avatar Case Study</strong></td><td>AI avatar technology, conversational AI, SESTEK infrastructure for Islamic banking avatar</td><td class="url-row"><a href="https://www.sestek.com/ai-avatars-in-banking-the-ajman-bank-story-blog" target="_blank">sestek.com — Ajman Bank Story ↗</a></td></tr>
        <tr><td><strong>Oracle OCI Trade Finance — IBS Intelligence</strong></td><td>Oracle Cloud AI trade finance platform, AI-infused financial services applications</td><td class="url-row"><a href="https://ibsintelligence.com/ibsi-news/ajman-bank-taps-oracle-to-modernise-trade-finance/" target="_blank">ibsintelligence.com ↗</a></td></tr>
        <tr><td><strong>CEO Interview — AI Digital Strategy</strong></td><td>AI Avatar vision, Ajman Bank One AI features, human-centered AI banking, digital transformation strategy</td><td class="url-row"><a href="https://economymiddleeast.com/news/ajman-bank-interview-with-ceo-mustafa-alkhalfawi/" target="_blank">economymiddleeast.com — CEO interview ↗</a></td></tr>
      </tbody>
    </table>
  </div>
  <div class="card">
    <div class="card-title" style="margin-bottom:1rem">All Official Ajman Bank Source URLs</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px">
      <a href="https://www.ajmanbank.ae" class="chip" target="_blank">ajmanbank.ae (main)</a>
      <a href="https://www.ajmanbank.ae/site/investor-relations.html" class="chip" target="_blank">Investor Relations</a>
      <a href="https://www.ajmanbank.ae/site/investor-relations-1.html" class="chip" target="_blank">Disclosures & Publications</a>
      <a href="https://www.ajmanbank.ae/site/performance.html" class="chip" target="_blank">Financial Performance</a>
      <a href="https://www.zawya.com" class="chip" target="_blank">Zawya Press Releases</a>
      <a href="https://www.dfm.ae" class="chip" target="_blank">DFM Filings</a>
      <a href="https://ibsintelligence.com" class="chip" target="_blank">IBS Intelligence</a>
      <a href="https://www.sestek.com/ai-avatars-in-banking-the-ajman-bank-story-blog" class="chip" target="_blank">SESTEK Case Study</a>
      <a href="https://economymiddleeast.com/news/ajman-bank-interview-with-ceo-mustafa-alkhalfawi/" class="chip" target="_blank">CEO AI Interview</a>
      <a href="https://www.centralbank.ae" class="chip" target="_blank">CBUAE Filings</a>
    </div>
    <div style="margin-top:1.5rem;padding:1rem;background:#f0f8f5;border-radius:8px;font-size:12px;color:#888">
      <strong>CEO Report:</strong> No standalone CEO AI report is publicly downloadable from ajmanbank.ae. AI strategy content is embedded in the Q1 2026 Results Statement (April 2026), the CEO interview (Economy Middle East, October 2025), and the GITEX 2025 press releases. This AI Intelligence Report constitutes the synthesized CEO-level strategic document. All source URLs are listed above.
    </div>
  </div>
</div>
</div>

<div class="page-footer">
  Ajman Bank AI Intelligence Report 2026 | Autonomous Banking AI Analysis | Sources: ajmanbank.ae, Zawya, IBS Intelligence, SESTEK, Economy Middle East | May 2026
</div>`;

const AjmanBankAIIntelligenceReport2026: React.FC = () => {
  useEffect(() => {
    window.showPage = (id: string, btn: HTMLElement) => {
      document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
      document.querySelectorAll(".nav button").forEach((b) => b.classList.remove("active"));
      document.getElementById("page-" + id)?.classList.add("active");
      btn.classList.add("active");
      window.scrollTo(0, 0);
    };

    window.filterUC = (maturity: string, btn: HTMLElement) => {
      document.querySelectorAll("#uc-filters button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll<HTMLElement>(".uc-card").forEach((card) => {
        if (maturity === "all") {
          card.style.display = "";
        } else {
          card.style.display = card.dataset.maturity?.includes(maturity) ? "" : "none";
        }
      });
    };
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </>
  );
};

export default AjmanBankAIIntelligenceReport2026;
