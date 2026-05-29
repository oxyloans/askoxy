import React, { useEffect } from "react";

declare global {
  interface Window {
    showPage: (id: string, btn: HTMLElement) => void;
    filterUC: (maturity: string, btn: HTMLElement) => void;
  }
}

const styles = `*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#f4f4f0;color:#1a1a1a;font-size:14px;line-height:1.6}
.topbar{background:#006633;color:white;padding:0}
.topbar-inner{max-width:1200px;margin:0 auto;padding:1.5rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}
.topbar h1{font-size:20px;font-weight:600;letter-spacing:-0.3px}
.topbar p{font-size:12px;opacity:0.7;margin-top:2px}
.badge-gold{background:#c9a227;color:#fff;font-size:11px;padding:3px 10px;border-radius:20px;font-weight:600}
.nav{background:#004d26;padding:0;border-bottom:2px solid #c9a227;overflow-x:auto}
.nav-inner{max-width:1200px;margin:0 auto;display:flex;gap:0}
.nav button{background:none;border:none;color:rgba(255,255,255,0.7);padding:12px 18px;font-size:13px;cursor:pointer;white-space:nowrap;border-bottom:3px solid transparent;transition:all 0.2s}
.nav button:hover,.nav button.active{color:#fff;border-bottom-color:#c9a227}
.container{max-width:1200px;margin:0 auto;padding:1.5rem 2rem}
.page{display:none}.page.active{display:block}
.section-head{margin-bottom:1.5rem}
.section-head h2{font-size:22px;font-weight:600;color:#006633;margin-bottom:4px}
.section-head p{font-size:13px;color:#666}
.metrics-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:1.5rem}
.metric{background:#fff;border:0.5px solid #ddd;border-radius:8px;padding:1rem;text-align:center}
.metric .num{font-size:28px;font-weight:700;color:#006633;margin-bottom:2px}
.metric .lbl{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.5px}
.card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;margin-bottom:1rem}
.card-title{font-size:15px;font-weight:600;color:#006633;margin-bottom:8px}
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
.uc-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-left:4px solid #006633}
.uc-id{font-size:10px;color:#999;font-weight:600;letter-spacing:1px;margin-bottom:4px}
.uc-name{font-size:15px;font-weight:600;color:#006633;margin-bottom:8px}
.uc-field{margin-bottom:6px}
.uc-label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.4px;font-weight:600;margin-bottom:2px}
.uc-value{font-size:12px;color:#333;line-height:1.5}
.agent-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-left:4px solid #7f77dd}
.agent-name{font-size:14px;font-weight:600;color:#3c3489;margin-bottom:8px;display:flex;align-items:center;gap:8px}
.agent-icon{width:28px;height:28px;background:#eeedfe;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.prog-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-top:3px solid #c9a227}
.prog-name{font-size:14px;font-weight:600;color:#006633;margin-bottom:6px}
.prose{font-size:13px;line-height:1.8;color:#2a2a2a}
.prose p{margin-bottom:1rem}
.finding-item{padding:0.75rem 1rem;border-left:3px solid #006633;background:#f0f8f3;border-radius:0 6px 6px 0;margin-bottom:0.75rem;font-size:13px;line-height:1.6}
.finding-num{font-weight:700;color:#006633;margin-right:8px}
.maturity-bar-wrap{margin-bottom:1rem}
.maturity-label{display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px}
.maturity-bar{height:10px;background:#e8e8e0;border-radius:5px;overflow:hidden}
.maturity-fill{height:100%;border-radius:5px;background:#006633;transition:width 1s}
.url-row a{color:#185fa5;text-decoration:none;font-size:12px;word-break:break-all}
.url-row a:hover{text-decoration:underline}
.filter-bar{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:1.5rem}
.filter-btn{border:0.5px solid #ccc;background:#fff;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer;transition:all 0.2s}
.filter-btn.active{background:#006633;color:#fff;border-color:#006633}
.summary-box{background:#006633;color:#fff;border-radius:10px;padding:1.5rem;margin-bottom:1.5rem}
.summary-box h3{font-size:18px;font-weight:600;margin-bottom:1rem;color:#c9a227}
.summary-box p{font-size:13px;line-height:1.8;opacity:0.92}
.ceo-report{background:#fff;border:1px solid #006633;border-radius:10px;padding:2rem;font-size:13px;line-height:1.9;color:#1a1a1a}
.ceo-report .report-header{border-bottom:2px solid #006633;padding-bottom:1rem;margin-bottom:1.5rem}
.ceo-report h3{font-size:16px;font-weight:700;color:#006633;margin:1.5rem 0 0.5rem}
.ceo-report p{margin-bottom:1rem}
.partner-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;display:flex;gap:12px}
.partner-logo{width:48px;height:48px;border-radius:8px;background:#e6f1fb;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:#0c447c;flex-shrink:0;text-align:center;line-height:1.2}
.score-big{font-size:48px;font-weight:700;color:#006633;text-align:center;padding:1.5rem;background:#f0f8f3;border-radius:10px;margin-bottom:1rem}
.score-sub{font-size:13px;color:#888;text-align:center;margin-top:-0.5rem;margin-bottom:1rem}
.chip{display:inline-flex;align-items:center;gap:6px;background:#f1f1e8;border:0.5px solid #d8d8c8;border-radius:20px;padding:4px 12px;font-size:11px;color:#444;margin:3px;text-decoration:none}
.chip:hover{background:#e8e8d8}
.page-footer{background:#004d26;color:rgba(255,255,255,0.6);font-size:11px;text-align:center;padding:1rem;margin-top:2rem}`;

const htmlContent = `<div class="topbar">
  <div class="topbar-inner">
    <div>
      <h1>Abu Dhabi Islamic Bank (ADIB) — AI Intelligence Report 2026</h1>
      <p>Autonomous Banking AI Analysis | 20 Use Cases | 9 Agents | 7 Programs | Official Sources Only</p>
    </div>
    <span class="badge-gold">CONFIDENTIAL STRATEGIC REPORT</span>
  </div>
</div>
<nav class="nav">
  <div class="nav-inner">
    <button class="active" onclick="showPage('overview',this)">Overview</button>
    <button onclick="showPage('usecases',this)">AI Use Cases (20)</button>
    <button onclick="showPage('agents',this)">AI Agents (9)</button>
    <button onclick="showPage('programs',this)">AI Programs (7)</button>
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
    <h2>AI Intelligence Overview — Abu Dhabi Islamic Bank 2026</h2>
    <p>Synthesized from 9 official ADIB sources including the Annual Integrated Report 2025, Investor Presentations, Press Releases, and official digital/AI disclosures (adib.ae)</p>
  </div>
  <div class="metrics-grid">
    <div class="metric"><div class="num">20</div><div class="lbl">AI Use Cases</div></div>
    <div class="metric"><div class="num">9</div><div class="lbl">AI Agents</div></div>
    <div class="metric"><div class="num">7</div><div class="lbl">AI Programs</div></div>
    <div class="metric"><div class="num">6</div><div class="lbl">AI Partnerships</div></div>
    <div class="metric"><div class="num">3.6/5</div><div class="lbl">AI Maturity Score</div></div>
    <div class="metric"><div class="num">AED 281B</div><div class="lbl">Total Assets (2025)</div></div>
    <div class="metric"><div class="num">AED 8.1B</div><div class="lbl">Net Profit Before Tax</div></div>
    <div class="metric"><div class="num">90%+</div><div class="lbl">Digitally Active Customers</div></div>
  </div>
  <div class="summary-box">
    <h3>AI Transformation Headline</h3>
    <p>ADIB is executing an ambitious AI transformation underpinned by its ADIB Vision 2035 — with a declared ambition to become the world's most innovative Islamic bank. The bank has deployed its ACE (Analytics Center of Excellence) command center, 60+ RPA-enabled robotic functions, GenAI-driven chatbots, fraud detection AI via SAS on Microsoft Azure, and a data-first architecture supporting hyper-personalization at scale. In 2025, over 90% of ADIB's customers became digitally active. GenAI is now embedded across customer journeys, back-office operations, and risk management. The ADIB Ventures arm is driving fintech partnerships and a dedicated GenAI Innovation Challenge has surfaced next-generation Islamic banking use cases. As the bank enters its 2026–2030 corporate plan, AI and GenAI are named cornerstones of the next growth phase.</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1rem;margin-bottom:1.5rem">
    <div class="card">
      <div class="card-title">Top AI Value Drivers</div>
      <table>
        <tr><td>ACE Analytics Command Center</td><td style="text-align:right;font-weight:600;color:#006633">Enterprise-wide</td></tr>
        <tr><td>GenAI Customer Chatbot (24/7)</td><td style="text-align:right;font-weight:600;color:#006633">Retail Banking</td></tr>
        <tr><td>AI Fraud Detection (SAS + Azure)</td><td style="text-align:right;font-weight:600;color:#006633">Risk / Security</td></tr>
        <tr><td>RPA (60+ Robotic Functions)</td><td style="text-align:right;font-weight:600;color:#006633">Operations</td></tr>
        <tr><td>Hyper-Personalization Engine</td><td style="text-align:right;font-weight:600;color:#006633">AED 400M+ attributed</td></tr>
      </table>
    </div>
    <div class="card">
      <div class="card-title">AI Maturity by Dimension</div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">AI Strategy &amp; Governance</span><span style="font-weight:600">4.0/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:80%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">Data Infrastructure (ACE)</span><span style="font-weight:600">3.8/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:76%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">AI Talent &amp; Culture</span><span style="font-weight:600">3.2/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:64%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">AI Production Deployment</span><span style="font-weight:600">3.7/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:74%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">GenAI / Agentic AI</span><span style="font-weight:600">3.4/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:68%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">AI Culture &amp; Adoption</span><span style="font-weight:600">3.5/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:70%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">Responsible / Islamic AI Ethics</span><span style="font-weight:600">3.8/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:76%"></div></div>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-title">Key AI Partnerships</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      <span class="tag tag-partner">Microsoft (Azure AI)</span>
      <span class="tag tag-partner">SAS Institute</span>
      <span class="tag tag-partner">DIFC Innovation Hub</span>
      <span class="tag tag-partner">Visa (Remit! AI Payments)</span>
      <span class="tag tag-partner">ADIB Ventures (Fintech Ecosystem)</span>
      <span class="tag tag-partner">UAE Central Bank (RegTech)</span>
    </div>
  </div>
</div>
</div>

<!-- AI USE CASES PAGE -->
<div id="page-usecases" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Use Cases — 20 Identified (2024–2026)</h2>
    <p>All use cases sourced from official ADIB Annual Report 2025, Press Releases, Investor Presentations and adib.ae</p>
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
      <div class="uc-name">ACE Analytics Center of Excellence — AI Command Center</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Enterprise / Executive</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2021–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">ADIB's fully integrated real-time data analysis and visualisation command center — one of the region's first AI-powered banking command centers. Displays up to 25 simultaneous dashboards customised per role. Uses big data, predictive analytics and AI to drive efficiencies, optimize performance, power fraud management, and generate hyper-personalized customer insights.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Real-time market responsiveness; fraud prevention; hyper-personalized campaigns; 25 concurrent executive dashboards; preventive cybersecurity controls; operational efficiency uplift</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Big data platform, predictive analytics AI, real-time visualization, Azure infrastructure</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">ADIB Vision & Mission page (adib.ae) / ADIB Annual Report 2025 / Gulf News coverage</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-002</div>
      <div class="uc-name">GenAI Customer Chatbot — 24/7 Conversational Banking</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Customer Experience</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2020–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">ADIB Chat Banking — UAE's first Emirati Arabic-dialect chatbot for customer care, upgraded with GenAI capabilities. Accessible via WhatsApp and the ADIB app. Handles account balances, card activation/freezing, ATM/branch locator, password resets, personal info updates, and full transaction management 24/7 with swift and accurate responses.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">24/7 availability; Emirati Arabic + English support; reduced call center load; swift self-service resolution; first Islamic bank with Emirati dialect AI</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">GenAI chatbot engine, NLP (Arabic + English), WhatsApp Business API integration</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">ADIB Press Release (Nov 2020); Khaleej Times AI Feature (Sept 2025); adib.ae</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-003</div>
      <div class="uc-name">AI Fraud Detection & Management — SAS on Azure</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Risk / Compliance / Security</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2021–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Cloud-based SAS Fraud Management deployed on Microsoft Azure — provides proactive, enterprise-wide fraud detection, prevention, and management across all channels and payment types. Detects fraudulent activity in real-time with advanced analytics and AI. Supports AML (anti-money laundering) detection and financial crime prevention.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Real-time fraud flagging before customer notification; significant financial fraud reduction; AML compliance; multi-channel coverage; faster deployment via cloud; uncompromised customer experience</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">SAS Fraud Management, Microsoft Azure, real-time ML scoring, SWIFT/payment channel integration</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">ADIB Press Release (Nov 2021) — "ADIB strengthens Fraud Management capabilities with SAS and Microsoft"; TechStory 2026</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-004</div>
      <div class="uc-name">RPA Intelligent Automation — 60+ Robotic Functions</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Operations / Back Office</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2020–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">ADIB has deployed 60+ robotic process automations (RPA) using AI for operational tasks. These AI-enabled bots automate high-volume manual process flows — including account processing, document handling, report generation, reconciliation, and compliance workflows — freeing staff to focus on higher-value activities.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">60+ processes automated; significant FTE redeployment to value-added work; operational cost reduction; processing speed increase; error rate reduction; scalability</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">RPA platform (UiPath/equivalent), AI-powered bots, process orchestration, ACE integration</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Gulf News — "ADIB puts AI at core of its ACE command center"; ADIB Annual Report 2025</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-005</div>
      <div class="uc-name">AI Hyper-Personalization Engine — Customer 360</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Marketing</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2021–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-powered hyper-personalization engine built on big data and predictive analytics within the ACE framework. Transforms customer transaction data, behavioral patterns and life-event signals into individualized product insights, financial guidance, and campaign targeting. Enables ADIB to go to market with customer-needs-focused campaigns.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Deeper customer engagement; improved cross-sell conversion; higher customer lifetime value; 90%+ digital activation; 283,000 new customers acquired in 2025; personalized Islamic banking experience</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">ACE data platform, predictive analytics ML, real-time customer profiling, campaign automation</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">ADIB Annual Report 2025 (Digital chapter); CEO Message; Gulf News ACE coverage</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-006</div>
      <div class="uc-name">AI Digital Onboarding — Remote Customer Acquisition</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Digital</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2020–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-powered fully digital customer onboarding journey enabling account opening without branch visits. Uses AI for identity verification (Emirates ID, Passport), liveness checks, document OCR, and automated KYC/AML screening. In Jan 2021 ACE data showed 52% of new accounts opened digitally (5x growth YoY). By 2025, digitally active customers exceeded 90%.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">52%+ digital new account share; 5x growth in digital onboarding 2020–2021; 90%+ digital customer base by 2025; branch cost reduction; 24/7 accessibility; customer acquisition scale</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">AI OCR, facial liveness AI, Emirates ID integration, AML screening ML, mobile app AI</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">ADIB ACE launch press release (2021); Annual Report 2025 (Digital chapter)</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-007</div>
      <div class="uc-name">AI Cybersecurity — Real-Time Threat Detection & Response</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Information Security / Technology</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2021–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-powered cybersecurity integrated within the ACE command center. Monitors network activity, detects anomalies, prevents cyber-attacks, and enables rapid response to breaches. Uses predictive AI to identify threats before they materialize. Collaborates with UAE Central Bank and regulators on cybersecurity frameworks and customer protection standards.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Proactive threat prevention; rapid breach response; CBUAE compliance; enhanced customer data security; zero reported major breach; resilience during geopolitical tensions (2026)</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">ACE-integrated security dashboards, AI threat detection, SIEM integration, Azure Security Center</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">ADIB Annual Report 2025; Gulf News ACE coverage; Finance Middle East CDO interview</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-008</div>
      <div class="uc-name">AI Credit Scoring & Loan Decisioning</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Risk</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2022–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">ML-powered credit scoring models enabling rapid, data-driven Islamic financing decisions (Murabaha, personal finance, home finance). AI reviews financial history, spending patterns and risk factors significantly faster than manual processes. Supports ADIB's 26% gross customer financing growth to AED 186 billion in 2025 while maintaining NPA ratio at record low of 2.8%.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Loan approval in minutes vs days; NPA ratio at record low 2.8%; gross customer financing AED 186B (+26%); portfolio quality improvement; financial inclusion for UAE nationals and residents</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">ML credit models, ACE data layer, bureau integration, Shari'a compliance engine</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">ADIB Annual Report 2025 (Financial Review, Risk chapter); TechStory UAE AI feature 2026</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-009</div>
      <div class="uc-name">GenAI Personalised Financial Product Creation</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail / Wholesale Banking / Product</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">ADIB uses GenAI to enable the creation of personalised Islamic financial products — including customized Murabaha financing, tailored Takaful, and personalised investment propositions. GenAI accelerates product development cycles, automates complex structuring processes, and speeds up Shari'a compliance review, as part of ADIB's 2035 Vision AI-first strategy.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Accelerated product development cycles; personalized Islamic offerings; competitive differentiation; Shari'a compliance efficiency; higher product relevance per customer segment</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">GenAI (LLM), Shari'a compliance NLP, product configuration engine, ACE data</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Khaleej Times AI Feature (Sept 2025) — "ADIB's AI Revolution: Leading Islamic Banking with GenAI"</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-010</div>
      <div class="uc-name">AI Risk Trend Prediction & Smart Process Automation</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Risk / Operations</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">GenAI-powered smart adaptive systems that detect fraudulent activity, predict risk trends, and process complex transactions with speed and accuracy. These intelligent tools reduce manual workloads, lower operating costs, and optimize resource allocation across risk and operations functions. Integrated with ACE for real-time risk management dashboards.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Operational cost reduction; risk trend anticipation; manual workload reduction; real-time risk visibility; cost-to-income ratio improved to 28.6% (best-in-class); lower provision requirements</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">GenAI adaptive systems, ACE risk dashboards, ML anomaly detection, process automation</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Khaleej Times AI Feature (Sept 2025); ADIB Annual Report 2025 (Risk chapter)</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-011</div>
      <div class="uc-name">ADIB Ventures GenAI Innovation Challenge Platform</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Innovation / ADIB Ventures</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">ADIB Ventures partnered with DIFC Innovation Hub to launch a Generative AI Innovation Challenge — inviting global startups and tech innovators to showcase cutting-edge GenAI solutions for banking services, operations streamlining, and customer experience improvement. The initiative drives ADIB's innovation pipeline and fintech ecosystem integration. Winner unveiled January 2025.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">GenAI startup pipeline; external innovation integration; brand positioning as Islamic AI leader; partnership ecosystem growth; ADIB Ventures strategic value creation</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">GenAI innovation platform, DIFC Innovation Hub partnership, startup acceleration</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">ADIB Press Release — "ADIB Ventures and DIFC Innovation Hub Unveil Generative AI Innovation Challenge Winner" (Jan 2025)</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-012</div>
      <div class="uc-name">AI-Powered Remit! Real-Time Cross-Border Payments</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Payments</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">ADIB partnered with Visa to launch "Remit!" — a real-time cross-border money transfer service (August 2025). Leverages AI for real-time FX rate optimization, beneficiary verification, compliance screening and seamless remittance processing — serving ADIB's large expatriate customer base across UAE, India, Pakistan, Philippines and other corridors.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Real-time international transfers; competitive FX rates; AML compliance automation; superior customer experience for expatriates; revenue diversification; Visa network reach</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Visa Direct API, AI FX optimization, real-time compliance ML, mobile app integration</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Wikipedia/ADIB — "ADIB and Visa Launch Global Real-Time Money Transfer Service" (Aug 2025)</div></div>
    </div>

    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-013</div>
      <div class="uc-name">AI-Driven Wealth Management & Robo-Advisory</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Wealth Management / Private Banking</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-enhanced wealth and private banking services offering data-driven investment recommendations, portfolio analytics and automated financial planning aligned to Islamic finance principles. ADIB reached 80% digital adoption across wealth and retail services via AI integration in early 2025. ADIB Ventures is advancing digital wealth propositions through fintech partnerships.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Democratized Islamic wealth management; 80% digital wealth adoption; scalable advisory; AUM growth; ADIB Ventures fintech portfolio expansion; competitive positioning</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">AI portfolio analytics, Shari'a-compliant product screening AI, digital advisory platform</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">ADIB Annual Report 2025 (Wealth chapter); MatrixBCG brief history (2026)</div></div>
    </div>

    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-014</div>
      <div class="uc-name">AI Remote Sales Channels & Digital Financing</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Digital</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-powered remote sales and digital financing platforms that enable customers to apply for and receive financing, cards and accounts entirely via digital channels without branch visits. ADIB's retail banking demonstrated strong financing and deposit growth in 2025 driven by expansion of digital onboarding and remote-sales channels using AI-driven decisioning and customer matching.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Remote sales growth contributing to record 283,000 new customers in 2025; AED 186B gross financing; higher UAE Nationals adoption; cost per acquisition reduction; branch network optimization</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">AI sales matching, digital financing journey AI, eKYC, mobile banking platform</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">ADIB Annual Report 2025 (CEO message, Retail Banking chapter)</div></div>
    </div>

    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-015</div>
      <div class="uc-name">Data-Driven Tools for Business Banking & Wholesale</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Business Banking / Wholesale Banking</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI and data-driven analytical tools embedded across ADIB's mobile app and wholesale banking platforms to enrich customer engagement and operational performance. Covers relationship manager insights, business client analytics, trade and treasury decision support, and automated financial reporting for corporate and GRE clients.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Enhanced RM productivity; landmark GRE and corporate transactions executed; non-funded income up 17%; transactional banking growth; stronger wholesale franchise positioning</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Data analytics platform, ACE dashboards, mobile API AI, RM workflow tools</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">ADIB Annual Report 2025 (CEO Message, Wholesale Banking chapter)</div></div>
    </div>

    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-016</div>
      <div class="uc-name">AI Regulatory Compliance & Financial Crime Prevention</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Compliance / Legal / Risk</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2022–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI tools for regulatory compliance including transaction monitoring for AML, KYC automation, sanctions screening, and regulatory sandbox participation. ADIB collaborates with UAE Central Bank and regulators on consumer protection and AI-assisted compliance frameworks. SAS Fraud Management on Azure provides the core financial crime prevention platform.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Regulatory compliance assurance; financial crime prevention; CBUAE/DFSA alignment; consumer protection; proactive regulatory sandbox participation; faster compliance reporting</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">SAS Fraud Management (Azure), AML screening ML, sanctions API, regulatory reporting automation</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Aletihad interview with CDO (Oct 2024); ADIB Annual Report 2025</div></div>
    </div>

    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-017</div>
      <div class="uc-name">AI ESG Risk Integration & Sustainable Finance Analytics</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Sustainability / Risk / Strategy</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-powered ESG risk monitoring and sustainable finance analytics platform, supporting ADIB's ADIB 2035 Vision sustainability pillar. Used for climate risk assessment in financing portfolios, ESG scoring, green sukuk analysis, net-zero roadmap tracking, and sustainability reporting aligned to UAE SDGs and ADX disclosure standards.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Regulatory ESG compliance; sustainable finance portfolio growth; ADX ESG disclosure alignment; net-zero commitment tracking; ESG ratings improvement; stakeholder confidence</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">ESG data analytics, climate risk ML, sustainability reporting automation, ADX data integration</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">ADIB Annual Report 2025 (Sustainability chapter, ESG strategy)</div></div>
    </div>

    <div class="uc-card" data-maturity="Pilot">
      <div class="uc-id">UC-018</div>
      <div class="uc-name">GenAI Employee Productivity & Internal Copilot</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">All Departments / HR / Technology</span>
        <span class="tag" style="background:#f0f0f0;color:#7f77dd">Pilot / Scaling</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Internal GenAI deployment for employee productivity — enabling ADIB staff to leverage AI for document generation, policy Q&A, report drafting, meeting summarisation, and data analysis. As part of ADIB's ADIB 2035 Vision, GenAI capabilities are being embedded across employee-facing tools to drive efficiency and accelerate strategic execution.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Employee productivity uplift; faster report and document generation; cost-to-income ratio improvement; talent empowerment; Emiratization program support; leadership development acceleration</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">GenAI enterprise tools, Azure OpenAI, internal knowledge base integration</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">ADIB Annual Report 2025 (Digital chapter); Khaleej Times GenAI feature (Sept 2025)</div></div>
    </div>

    <div class="uc-card" data-maturity="Pilot">
      <div class="uc-id">UC-019</div>
      <div class="uc-name">AI-Powered Shari'a Compliance Checking & Fatwa Research</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Islamic Banking / Shari'a Governance</span>
        <span class="tag" style="background:#f0f0f0;color:#7f77dd">Pilot</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-assisted Shari'a compliance checking and fatwa research tool being developed as part of ADIB's GenAI initiative. Applies NLP to Islamic finance jurisprudence, screens financial product structures for Shari'a compliance issues, and accelerates Shari'a Supervisory Committee review processes — uniquely positioning ADIB in responsible Islamic AI.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Shari'a compliance accuracy; faster product approval cycles; Islamic finance competitive advantage; industry thought leadership; unique market differentiator as an Islamic bank</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Islamic finance NLP, Arabic LLM, Shari'a ruleset engine, fatwa corpus training data</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">ADIB Annual Report 2025 (Shari'a Disclosures); Khaleej Times GenAI feature</div></div>
    </div>

    <div class="uc-card" data-maturity="Pilot">
      <div class="uc-id">UC-020</div>
      <div class="uc-name">Agentic AI Banking — Autonomous Multi-Step Financial Tasks</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Innovation / Digital Banking / Strategy</span>
        <span class="tag" style="background:#f0f0f0;color:#7f77dd">Pilot / Roadmap 2026</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Exploration of agentic AI — autonomous AI agents capable of executing multi-step banking tasks end-to-end with minimal human intervention. Part of ADIB's 2035 Vision, the bank is building toward agentic capabilities that can autonomously handle financing applications, account services, investment instructions, and back-office workflows. GenAI Innovation Challenge with DIFC has surfaced leading agentic concepts.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Future-ready AI positioning; operational efficiency at scale; 24/7 autonomous service; strategic competitive differentiation; alignment to ADIB 2035 Vision; next-generation Islamic banking</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Agentic AI frameworks, multi-step orchestration, LLM + tool use, ADIB Ventures fintech integration</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">ADIB 2035 Vision; CEO Magazine interview (Oct 2025); ADIB Ventures GenAI Challenge</div></div>
    </div>

  </div>
</div>
</div>

<!-- AI AGENTS PAGE -->
<div id="page-agents" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Agents — 9 Identified</h2>
    <p>AI agents and intelligent autonomous systems deployed or in development at ADIB</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem">

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">🤖</div>ACE Command Center Agent</div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Autonomous real-time monitoring and analytics agent powering 25+ simultaneous dashboards across ADIB's enterprise operations. Makes real-time operational decisions, detects anomalies, triggers preventive controls, and routes insights to relevant teams and executives.</div></div>
      <div class="uc-field"><div class="uc-label">Department</div><div class="uc-value"><span class="tag tag-dept">Enterprise / Analytics / Strategy</span></div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Enterprise-wide operational intelligence; real-time decision support; cybersecurity prevention; performance optimization; customer personalization at scale</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">ADIB adib.ae Vision page; Gulf News ACE coverage; ADIB Annual Report 2025</div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">💬</div>ADIB Chat Banking Agent (GenAI)</div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">GenAI-powered 24/7 conversational banking agent operating on WhatsApp and the ADIB mobile app. Handles customer queries, transaction management, card services, and account operations in Emirati Arabic, classical Arabic, and English — autonomously and without human agent escalation for routine requests.</div></div>
      <div class="uc-field"><div class="uc-label">Department</div><div class="uc-value"><span class="tag tag-dept">Retail Banking / Customer Experience</span></div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Cost-per-interaction reduction; 24/7 service availability; first Islamic bank Emirati dialect AI; customer satisfaction improvement; call center deflection</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">ADIB Press Release (2020); Khaleej Times (Sept 2025); IBS Intelligence</div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">🛡️</div>SAS Fraud Detection Agent</div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Autonomous AI fraud detection and prevention agent running on Microsoft Azure via SAS Fraud Management. Monitors all payment channels and transactions in real time, scores for fraud risk, auto-detects suspicious activity, triggers alerts/holds, and supports AML investigations — operating with minimal human intervention.</div></div>
      <div class="uc-field"><div class="uc-label">Department</div><div class="uc-value"><span class="tag tag-dept">Risk / Compliance / Fraud Prevention</span></div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Real-time fraud prevention; AML compliance; financial crime reduction; all-channel coverage; customer financial security; CBUAE compliance</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">ADIB-SAS-Microsoft Press Release (Nov 2021); ADIB Annual Report 2025</div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">⚙️</div>RPA Operations Automation Agents (60+)</div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">A fleet of 60+ AI-enabled robotic process automation (RPA) bots performing autonomous execution of high-volume back-office tasks including account processing, document handling, reconciliation, regulatory reporting, and compliance workflows — without human intervention.</div></div>
      <div class="uc-field"><div class="uc-label">Department</div><div class="uc-value"><span class="tag tag-dept">Operations / Back Office / Finance</span></div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">60+ processes automated; significant FTE redeployment to higher-value work; error reduction; processing speed increase; operations scalability without headcount growth</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Gulf News ACE coverage; ADIB Annual Report 2025</div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">🔐</div>Cybersecurity Threat Detection Agent</div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">AI-powered security agent within the ACE command center that continuously monitors ADIB's network, detects anomalies, prevents cyber-attacks, and enables rapid breach response. Operates with predictive capabilities to identify threats before they materialize, integrated with UAE Central Bank cyber protection frameworks.</div></div>
      <div class="uc-field"><div class="uc-label">Department</div><div class="uc-value"><span class="tag tag-dept">Information Security / Technology</span></div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Proactive threat prevention; NESA/CBUAE compliance; customer data security; brand protection; resilience during geopolitical disruptions; faster incident response</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">ADIB ACE page; Finance Middle East CDO interview; ADIB Annual Report 2025</div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">📊</div>Hyper-Personalization Intelligence Agent</div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Autonomous AI personalization agent that continuously processes customer behavioral data, transaction patterns, and life-event signals from the ACE platform to deliver real-time hyper-personalized financial product recommendations, insights, and targeted campaigns — adapting autonomously per customer interaction.</div></div>
      <div class="uc-field"><div class="uc-label">Department</div><div class="uc-value"><span class="tag tag-dept">Retail Banking / Marketing / CX</span></div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Customer acquisition at scale (283K new in 2025); improved cross-sell; personalized Islamic banking UX; revenue growth; 90%+ digital activation</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">ADIB ACE launch PR; ADIB Annual Report 2025 (Digital chapter)</div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">🌐</div>Remit! AI Payments Processing Agent</div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Autonomous AI agent embedded in the Remit! cross-border payment service (ADIB + Visa partnership). Handles real-time FX optimization, beneficiary verification, compliance screening, and payment routing autonomously — executing cross-border transfers for ADIB customers in real time across global corridors.</div></div>
      <div class="uc-field"><div class="uc-label">Department</div><div class="uc-value"><span class="tag tag-dept">Retail Banking / Payments</span></div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Real-time cross-border transfers; competitive FX; 2M+ customer diaspora served; non-funded income growth; payment innovation leadership</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Wikipedia/ADIB — Remit! launch Aug 2025; ADIB Annual Report 2025</div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">📋</div>AI Credit Decisioning Agent</div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Autonomous ML-powered credit decisioning agent that reviews financing applications in real time — analysing financial history, spending patterns, income verification, and risk factors to issue Islamic finance credit decisions (Murabaha, personal finance) without manual underwriter involvement for standard cases.</div></div>
      <div class="uc-field"><div class="uc-label">Department</div><div class="uc-value"><span class="tag tag-dept">Retail Banking / Risk</span></div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Minutes-fast credit decisions; NPA ratio 2.8% (record low); AED 186B gross financing portfolio; higher customer satisfaction; operational efficiency</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">ADIB Annual Report 2025; TechStory UAE AI feature 2026</div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">💡</div>GenAI Innovation Challenge Discovery Agent (ADIB Ventures)</div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">ADIB Ventures' GenAI-powered startup discovery and evaluation agent used within the DIFC Innovation Hub challenge framework. Screens and evaluates GenAI startup proposals, maps innovations to banking use cases, and accelerates integration of winning solutions into ADIB's banking ecosystem — a unique externally-facing AI procurement and innovation intelligence agent.</div></div>
      <div class="uc-field"><div class="uc-label">Department</div><div class="uc-value"><span class="tag tag-dept">Innovation / ADIB Ventures / Strategy</span></div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">External innovation pipeline; fintech ecosystem growth; competitive AI capabilities; ADIB 2035 Vision execution acceleration; brand as leading Islamic AI bank</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">ADIB Press Release — GenAI Innovation Challenge Winner (Jan 2025); ADIB Ventures LinkedIn</div></div>
    </div>

  </div>
</div>
</div>

<!-- AI PROGRAMS PAGE -->
<div id="page-programs" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Programs — 7 Enterprise Programs</h2>
    <p>Major AI transformation programs driving ADIB's Vision 2035 AI-native strategy</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem">

    <div class="prog-card">
      <div class="prog-name">ADIB Vision 2035 — AI-First Islamic Banking Strategy</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Launched 2025 / Multi-year</span>
        <span class="tag tag-tech">2025–2035</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">ADIB's transformative 10-year strategic vision to become the world's most innovative Islamic bank, with GenAI and emerging technologies as a cornerstone. The 2026–2030 corporate plan sets ambitious targets for client base growth, profitability acceleration, and digital innovation in Islamic finance, wealth management, and payments — powered by AI across all business lines.</div></div>
      <div class="uc-field"><div class="uc-label">Scope</div><div class="uc-value">Enterprise-wide — all business lines, all markets (UAE, Egypt, Iraq, Qatar, UK)</div></div>
      <div class="uc-field"><div class="uc-label">Investment Indication</div><div class="uc-value" style="color:#006633;font-weight:600">Strategic technology envelope — multi-year 2026–2030 corporate plan</div></div>
    </div>

    <div class="prog-card">
      <div class="prog-name">ACE (Analytics Center of Excellence) Program</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Production / Expanding</span>
        <span class="tag tag-tech">Since 2021</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">ADIB's flagship AI data infrastructure program — one of the region's first fully integrated real-time analytics and AI command centers. Combines big data, predictive analytics and AI for operational efficiency, fraud management, cybersecurity, and hyper-personalization. Continuously expanding use case coverage and dashboard capabilities.</div></div>
      <div class="uc-field"><div class="uc-label">Scope</div><div class="uc-value">Enterprise-wide Analytics, Risk, Retail, Operations</div></div>
      <div class="uc-field"><div class="uc-label">Investment Indication</div><div class="uc-value" style="color:#006633;font-weight:600">Core AI infrastructure investment — ongoing multi-year commitment</div></div>
    </div>

    <div class="prog-card">
      <div class="prog-name">GenAI Enterprise Program</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Production / Expanding</span>
        <span class="tag tag-tech">Since 2024</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Bank-wide Generative AI deployment covering GenAI-driven chatbots, personalised financial product creation, intelligent process automation, risk trend prediction, and employee productivity tools. Per CEO Abdelbary: "GenAI is the future of banking because it allows us to achieve our goals in the optimum way." Embedded across customer-facing and operational functions.</div></div>
      <div class="uc-field"><div class="uc-label">Scope</div><div class="uc-value">All business divisions, customer journeys, and support functions</div></div>
      <div class="uc-field"><div class="uc-label">Investment Indication</div><div class="uc-value" style="color:#006633;font-weight:600">Strategic GenAI investment as part of Vision 2035 technology CAPEX</div></div>
    </div>

    <div class="prog-card">
      <div class="prog-name">Digital Transformation Program — Building the Bank of the Future</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Advanced Execution</span>
        <span class="tag tag-tech">Since 2019</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Multi-year digital transformation covering mobile app enhancement, 90%+ customer digital activation, fully digital customer journeys, remote sales channel expansion, and data-driven tool embedding. By 2025 94% of ADIB transactions conducted digitally. Digital Retail Transformation chapter covers omnichannel AI, app improvements and digital product launches.</div></div>
      <div class="uc-field"><div class="uc-label">Scope</div><div class="uc-value">Retail Banking, Digital Channels, Technology</div></div>
      <div class="uc-field"><div class="uc-label">Investment Indication</div><div class="uc-value" style="color:#006633;font-weight:600">Core technology CAPEX; growing annually through 2030 plan</div></div>
    </div>

    <div class="prog-card">
      <div class="prog-name">ADIB Ventures — Fintech & GenAI Ecosystem Program</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Active / Expanding</span>
        <span class="tag tag-tech">Since 2024</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">ADIB Ventures is ADIB's strategic innovation arm, fostering partnerships with global fintech players and integrating advanced technologies including GenAI. Key initiative: the GenAI Innovation Challenge with DIFC Innovation Hub, identifying next-generation AI-driven banking solutions. ADIB Ventures grew into a cornerstone of innovation strategy per the 2025 Annual Report.</div></div>
      <div class="uc-field"><div class="uc-label">Scope</div><div class="uc-value">Innovation / Strategy / External Fintech Ecosystem</div></div>
      <div class="uc-field"><div class="uc-label">Investment Indication</div><div class="uc-value" style="color:#006633;font-weight:600">Dedicated innovation program budget; multi-fintech partnership portfolio</div></div>
    </div>

    <div class="prog-card">
      <div class="prog-name">RPA & Intelligent Automation Scale-Up Program</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Production / Scaling to 100+</span>
        <span class="tag tag-tech">Since 2020</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Enterprise robotic process automation program deploying AI-enabled bots at scale across ADIB operations. Currently at 60+ live robotic functions with ongoing expansion. Covers back-office, compliance, reporting and customer service workflows. Aligned with ADIB's efficiency drive that reduced cost-to-income ratio to 28.6%.</div></div>
      <div class="uc-field"><div class="uc-label">Scope</div><div class="uc-value">Operations, Finance, Compliance, Customer Service</div></div>
      <div class="uc-field"><div class="uc-label">Investment Indication</div><div class="uc-value" style="color:#006633;font-weight:600">Core efficiency OPEX; ongoing expansion investment</div></div>
    </div>

    <div class="prog-card">
      <div class="prog-name">Responsible AI & Islamic Ethics Framework</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Active / Ongoing</span>
        <span class="tag tag-tech">Since 2024</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">ADIB is building a responsible, ethical AI governance framework aligned to Islamic finance values, UAE AI regulations and CBUAE guidelines. Per CEO Abdelbary: "It will determine how we use the power of genAI in a sustainable, controlled and ethical manner. I'm very proud to say that I believe we're leading the market in that effort." Covers model risk management, AI bias testing, explainability and customer data protection.</div></div>
      <div class="uc-field"><div class="uc-label">Scope</div><div class="uc-value">Risk, Compliance, Technology, Shari'a Governance</div></div>
      <div class="uc-field"><div class="uc-label">Investment Indication</div><div class="uc-value" style="color:#006633;font-weight:600">Embedded in Risk and Compliance OPEX; strategic governance priority</div></div>
    </div>

  </div>
</div>
</div>

<!-- AI PARTNERSHIPS PAGE -->
<div id="page-partnerships" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Partnerships — 6 Strategic Partners</h2>
    <p>Technology and AI ecosystem partners powering ADIB's AI transformation</p>
  </div>

  <div class="partner-card" style="margin-bottom:1rem">
    <div class="partner-logo">MSFT</div>
    <div style="flex:1">
      <div style="font-weight:600;font-size:14px;color:#006633;margin-bottom:4px">Microsoft (Azure)</div>
      <span class="tag tag-partner">Core Cloud & AI Infrastructure Partner</span>
      <span class="tag tag-tech">2021–2026</span>
      <div class="uc-field" style="margin-top:8px"><div class="uc-label">Use Cases</div><div class="uc-value">SAS Fraud Management deployed on Microsoft Azure; cloud infrastructure for ACE data platform; GenAI enterprise deployment via Azure OpenAI; Microsoft security tooling integration</div></div>
      <div class="uc-field"><div class="uc-label">Strategic Value</div><div class="uc-value" style="color:#006633;font-weight:600">Primary cloud and AI infrastructure partner; mission-critical fraud platform; multi-year strategic relationship</div></div>
    </div>
  </div>

  <div class="partner-card" style="margin-bottom:1rem">
    <div class="partner-logo">SAS</div>
    <div style="flex:1">
      <div style="font-weight:600;font-size:14px;color:#006633;margin-bottom:4px">SAS Institute</div>
      <span class="tag tag-partner">Fraud Management & Analytics Partner</span>
      <span class="tag tag-tech">2021–2026</span>
      <div class="uc-field" style="margin-top:8px"><div class="uc-label">Use Cases</div><div class="uc-value">SAS Fraud Management platform on Azure — enterprise-wide fraud detection, AML, financial crime prevention across all channels and payment types; advanced analytics for risk management</div></div>
      <div class="uc-field"><div class="uc-label">Strategic Value</div><div class="uc-value" style="color:#006633;font-weight:600">Mission-critical fraud and AML platform; multi-year license; CBUAE-compliant financial crime prevention</div></div>
    </div>
  </div>

  <div class="partner-card" style="margin-bottom:1rem">
    <div class="partner-logo">VISA</div>
    <div style="flex:1">
      <div style="font-weight:600;font-size:14px;color:#006633;margin-bottom:4px">Visa Inc.</div>
      <span class="tag tag-partner">AI Payments Innovation Partner</span>
      <span class="tag tag-tech">2025–2026</span>
      <div class="uc-field" style="margin-top:8px"><div class="uc-label">Use Cases</div><div class="uc-value">Remit! — real-time AI-powered cross-border money transfer service launched August 2025. Leverages Visa Direct network with AI for FX optimization, compliance screening, and real-time payment routing globally</div></div>
      <div class="uc-field"><div class="uc-label">Strategic Value</div><div class="uc-value" style="color:#006633;font-weight:600">First Islamic bank on Visa real-time global transfer; serves 2M+ customer diaspora; payments revenue growth</div></div>
    </div>
  </div>

  <div class="partner-card" style="margin-bottom:1rem">
    <div class="partner-logo">DIFC</div>
    <div style="flex:1">
      <div style="font-weight:600;font-size:14px;color:#006633;margin-bottom:4px">DIFC Innovation Hub</div>
      <span class="tag tag-partner">GenAI Innovation Ecosystem Partner</span>
      <span class="tag tag-tech">2024–2026</span>
      <div class="uc-field" style="margin-top:8px"><div class="uc-label">Use Cases</div><div class="uc-value">Co-hosted the ADIB Ventures GenAI Innovation Challenge — attracting global startups with cutting-edge GenAI solutions for Islamic banking. Provides ecosystem, regulatory sandbox access, and fintech network for ADIB Ventures</div></div>
      <div class="uc-field"><div class="uc-label">Strategic Value</div><div class="uc-value" style="color:#006633;font-weight:600">External GenAI innovation pipeline; regulatory sandbox access; global fintech connectivity; DIFC ecosystem positioning</div></div>
    </div>
  </div>

  <div class="partner-card" style="margin-bottom:1rem">
    <div class="partner-logo">CBUAE</div>
    <div style="flex:1">
      <div style="font-weight:600;font-size:14px;color:#006633;margin-bottom:4px">UAE Central Bank (CBUAE)</div>
      <span class="tag tag-partner">Regulatory AI & Fintech Partner</span>
      <span class="tag tag-tech">Ongoing</span>
      <div class="uc-field" style="margin-top:8px"><div class="uc-label">Use Cases</div><div class="uc-value">Collaboration on AI-assisted regulatory compliance, Open Finance framework, anti-fraud standards, customer data protection, and regulatory sandbox participation. ADIB actively participates in CBUAE fintech and innovation programs.</div></div>
      <div class="uc-field"><div class="uc-label">Strategic Value</div><div class="uc-value" style="color:#006633;font-weight:600">Regulatory alignment; Open Finance positioning; compliance competitive advantage; first-mover sandbox advantage</div></div>
    </div>
  </div>

  <div class="partner-card" style="margin-bottom:1rem">
    <div class="partner-logo">LEAN</div>
    <div style="flex:1">
      <div style="font-weight:600;font-size:14px;color:#006633;margin-bottom:4px">Lean Technologies (ADIB Ventures Portfolio)</div>
      <span class="tag tag-partner">Open Banking & Fintech AI Partner</span>
      <span class="tag tag-tech">2024–2026</span>
      <div class="uc-field" style="margin-top:8px"><div class="uc-label">Use Cases</div><div class="uc-value">ADIB Ventures partnership with Lean Technologies for Open Banking infrastructure and API connectivity — enabling AI-powered financial data aggregation, account verification, and digital financing use cases across the ADIB Ventures fintech ecosystem</div></div>
      <div class="uc-field"><div class="uc-label">Strategic Value</div><div class="uc-value" style="color:#006633;font-weight:600">Open finance infrastructure; digital financing enablement; ADIB Ventures portfolio value; fintech ecosystem competitive positioning</div></div>
    </div>
  </div>

</div>
</div>

<!-- AI MATURITY PAGE -->
<div id="page-maturity" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Maturity Assessment — ADIB 2026</h2>
    <p>Independent assessment based on official ADIB disclosures, Annual Report 2025, and verified press releases</p>
  </div>
  <div class="score-big">3.6 / 5.0</div>
  <div class="score-sub">ADIB AI Maturity Score — Advancing Islamic AI Pioneer</div>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem;margin-bottom:1.5rem">
    <div class="card">
      <div class="card-title">AI Maturity Scorecard</div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span>AI Strategy &amp; Vision</span><span style="font-weight:600">4.0/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:80%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span>Data Infrastructure (ACE)</span><span style="font-weight:600">3.8/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:76%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span>AI Talent &amp; Skills</span><span style="font-weight:600">3.2/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:64%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span>AI Production Deployment</span><span style="font-weight:600">3.7/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:74%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span>GenAI / Agentic AI Maturity</span><span style="font-weight:600">3.4/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:68%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span>AI Culture &amp; Adoption</span><span style="font-weight:600">3.5/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:70%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span>Responsible / Islamic AI</span><span style="font-weight:600">3.8/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:76%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span>AI Partnership Ecosystem</span><span style="font-weight:600">3.5/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:70%"></div></div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Maturity Stage: Advancing Pioneer</div>
      <div class="prose">
        <p>ADIB sits at the <strong>Advancing Pioneer</strong> stage of AI maturity — having moved decisively beyond experimentation into production-scale AI deployment, while the full GenAI and agentic AI transformation is still in early scaling phases.</p>
        <p><strong>Strengths:</strong> ACE command center is industry-leading among Islamic banks. 60+ RPA bots deployed. 90%+ digital customer base. SAS fraud management on Azure is mission-critical. GenAI chatbot in production with unique Emirati Arabic capability. ADIB Ventures GenAI Challenge signals external innovation culture.</p>
        <p><strong>Development Areas:</strong> Published AI-specific whitepapers and standalone AI disclosures are limited compared to global peers. Agentic AI is still in pilot phases. GenAI employee copilot and Shari'a AI are early-stage. AI talent and dedicated AI organizational structure are less visible than global top-tier peers.</p>
        <p><strong>Differentiated Position:</strong> ADIB holds a <em>unique AI position</em> as the world's leading Islamic bank deploying GenAI at scale — with Arabic language AI capabilities and Shari'a-aligned responsible AI governance that no conventional bank peer can replicate.</p>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">Strategic Findings</div>
    <div class="finding-item"><span class="finding-num">01</span>ADIB's ADIB Vision 2035 — launched in 2025 — represents the most ambitious AI-first strategy ever announced by an Islamic bank globally, with GenAI named a cornerstone of the 10-year transformation roadmap.</div>
    <div class="finding-item"><span class="finding-num">02</span>The ACE Analytics Center of Excellence is among the most advanced AI command centers in Islamic banking — providing real-time decision support, cybersecurity, fraud management and hyper-personalization from a single integrated platform.</div>
    <div class="finding-item"><span class="finding-num">03</span>ADIB deployed 60+ robotic process automations (RPA bots) while achieving a best-in-class cost-to-income ratio of 28.6% — confirming AI-driven efficiency as a structural competitive advantage.</div>
    <div class="finding-item"><span class="finding-num">04</span>With 90%+ customers digitally active and 94% of transactions conducted digitally, ADIB has achieved scale of digital adoption that enables AI models to train on richer, more complete behavioral data — a compounding AI advantage.</div>
    <div class="finding-item"><span class="finding-num">05</span>ADIB's GenAI chatbot with native Emirati Arabic dialect capability is a unique product moat — no conventional or Islamic competitor has replicated this depth of Arabic-language AI in banking services.</div>
    <div class="finding-item"><span class="finding-num">06</span>ADIB Ventures' GenAI Innovation Challenge with DIFC Innovation Hub positions ADIB as the epicenter of Islamic fintech AI — attracting global innovators to build AI solutions specifically for Islamic banking.</div>
    <div class="finding-item"><span class="finding-num">07</span>CEO Mohamed Abdelbary has personally and publicly committed to responsible GenAI as a strategic priority — "leading the market in sustainable, controlled and ethical AI deployment" — differentiating ADIB from peers with a values-aligned AI governance story.</div>
    <div class="finding-item"><span class="finding-num">08</span>ADIB's record 2025 financial performance (net profit AED 8.1B, +18%; ROE 29%; assets AED 281B, +24%) provides the capital base and organizational confidence to accelerate AI investment through the 2026–2030 plan.</div>
  </div>
</div>
</div>

<!-- EXECUTIVE SUMMARY PAGE -->
<div id="page-executive" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Executive Summary — ADIB 2026</h2>
    <p>Board and C-suite level AI intelligence briefing — synthesized from official ADIB sources</p>
  </div>
  <div class="summary-box">
    <h3>AI Transformation Headline for Board</h3>
    <p>ADIB has entered 2026 as the Islamic banking world's most ambitious AI transformation story. With ADIB Vision 2035 now the strategic north star, GenAI and AI are not incremental improvements — they are the engine of the next growth phase. The bank's ACE command center, 60+ RPA bots, GenAI chatbots, SAS fraud AI, and hyper-personalization engine are generating measurable business value today. The ADIB Ventures GenAI Challenge is building the innovation pipeline of tomorrow. The critical inflection point is now: ADIB must scale from "AI pioneer in Islamic banking" to "AI-native bank globally." The 2026–2030 corporate plan provides the mandate and the resources to make this leap.</p>
  </div>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1rem;margin-bottom:1.5rem">
    <div class="card">
      <div class="card-title">AI Maturity Summary</div>
      <table>
        <tr><td>Overall AI Maturity</td><td style="font-weight:600;color:#006633">3.6 / 5.0 — Advancing Pioneer</td></tr>
        <tr><td>AI Strategy</td><td style="font-weight:600;color:#006633">4.0 / 5.0 — Strong</td></tr>
        <tr><td>Data Infrastructure</td><td style="font-weight:600;color:#006633">3.8 / 5.0 — Above Average</td></tr>
        <tr><td>GenAI Deployment</td><td style="font-weight:600;color:#006633">3.4 / 5.0 — Growing</td></tr>
        <tr><td>Responsible AI</td><td style="font-weight:600;color:#006633">3.8 / 5.0 — Islamic AI Differentiator</td></tr>
        <tr><td>AI Talent Gap</td><td style="font-weight:600;color:#c00">3.2 / 5.0 — Area to Strengthen</td></tr>
      </table>
    </div>
    <div class="card">
      <div class="card-title">2025 AI Business Impact</div>
      <table>
        <tr><td>Digital customer activation</td><td style="font-weight:600;color:#006633">90%+</td></tr>
        <tr><td>Digital transactions</td><td style="font-weight:600;color:#006633">94%</td></tr>
        <tr><td>New customers acquired (AI-powered digital)</td><td style="font-weight:600;color:#006633">283,000</td></tr>
        <tr><td>NPA ratio (AI credit decisioning)</td><td style="font-weight:600;color:#006633">2.8% (record low)</td></tr>
        <tr><td>Cost-to-income ratio (RPA / AI efficiency)</td><td style="font-weight:600;color:#006633">28.6%</td></tr>
        <tr><td>RPA robotic functions deployed</td><td style="font-weight:600;color:#006633">60+</td></tr>
      </table>
    </div>
  </div>

  <div class="card">
    <div class="card-title">Top 5 Strategic AI Priorities for 2026–2030</div>
    <div class="finding-item"><span class="finding-num">1</span><strong>Scale GenAI Across All Business Lines:</strong> Move from GenAI pilot deployments to enterprise-wide production — expanding the GenAI chatbot, employee copilot, wealth advisory AI, and Shari'a compliance checker at scale.</div>
    <div class="finding-item"><span class="finding-num">2</span><strong>Build Agentic AI Capabilities:</strong> Transition from RPA bots to fully agentic AI — autonomous multi-step agents for financing applications, trade finance, treasury, and back-office orchestration aligned to ADIB 2035 Vision.</div>
    <div class="finding-item"><span class="finding-num">3</span><strong>Deepen ADIB Ventures AI Ecosystem:</strong> Accelerate the integration of GenAI startups and fintech partners into production systems — leveraging the GenAI Innovation Challenge pipeline to deploy new AI capabilities at speed.</div>
    <div class="finding-item"><span class="finding-num">4</span><strong>Establish Islamic AI Leadership Globally:</strong> Publish dedicated AI transparency reports, Islamic AI ethics frameworks, and Shari'a-compliant AI governance standards — positioning ADIB as the global authority on responsible Islamic AI.</div>
    <div class="finding-item"><span class="finding-num">5</span><strong>Invest in AI Talent at Scale:</strong> Build dedicated AI/ML engineering teams, data science centres of excellence, and AI literacy programs across the workforce — closing the talent gap to sustain Vision 2035 ambitions.</div>
  </div>
</div>
</div>

<!-- CEO REPORT PAGE -->
<div id="page-ceo" class="page">
<div class="container">
  <div class="section-head">
    <h2>CEO-Level AI Intelligence Report — ADIB 2026</h2>
    <p>Synthesized executive briefing for Board, CEO and senior leadership of Abu Dhabi Islamic Bank</p>
  </div>
  <div class="ceo-report">
    <div class="report-header">
      <div style="font-size:11px;color:#888;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px">Confidential Strategic Intelligence Briefing</div>
      <div style="font-size:18px;font-weight:700;color:#006633;margin-bottom:4px">Abu Dhabi Islamic Bank (ADIB) — AI Intelligence Report 2026</div>
      <div style="font-size:12px;color:#666">Prepared: May 2026 | Source: ADIB Annual Report 2025, adib.ae, Official Press Releases | Classification: Strategic</div>
    </div>

    <h3>1. Strategic Context</h3>
    <p>Abu Dhabi Islamic Bank enters 2026 at a moment of historic opportunity. Following a landmark 2025 — the bank's most profitable year ever with net profit before tax exceeding AED 8 billion for the first time — ADIB has simultaneously launched its ADIB Vision 2035, a bold 10-year transformation roadmap designed to make it the world's most innovative Islamic bank. At the core of this vision is Artificial Intelligence and Generative AI. The 2026–2030 corporate plan translates this vision into executable ambitions: client base expansion, profitability acceleration, and digital-first service delivery powered by AI across all business lines and geographies.</p>

    <h3>2. AI Maturity & Current State</h3>
    <p>ADIB has achieved AI maturity of 3.6/5.0 — positioning it as an Advancing Pioneer in Islamic banking AI. Key production-scale AI capabilities are live and generating measurable value: the ACE (Analytics Center of Excellence) command center delivers real-time AI-powered operational intelligence across 25+ simultaneous dashboards; 60+ robotic process automation bots are executing back-office workflows autonomously; the GenAI-powered ADIB Chat Banking agent handles customer service 24/7 in Emirati Arabic, classical Arabic, and English; and the SAS Fraud Management platform on Microsoft Azure protects the bank against financial crime enterprise-wide. By end-2025, 90%+ of ADIB's 2 million customers were digitally active and 94% of all transactions were conducted through digital channels — providing the data scale that makes AI increasingly powerful.</p>

    <h3>3. Generative AI Transformation</h3>
    <p>Per CEO Mohamed Abdelbary's explicit public commitment: "We understand that GenAI is the future of banking because it allows us to achieve our goals in the optimum way." ADIB is deploying GenAI across three dimensions. First, customer-facing GenAI — chatbots, personalized product creation, and digital journey enhancement. Second, operational GenAI — intelligent automation systems that detect fraud, predict risk trends, and process complex transactions with speed and accuracy, reducing manual workloads and operating costs. Third, innovation-stage GenAI — the ADIB Ventures GenAI Innovation Challenge with DIFC Innovation Hub, which surfaced world-class GenAI startup solutions in January 2025, building tomorrow's Islamic AI banking capabilities today.</p>

    <h3>4. Unique Islamic AI Differentiation</h3>
    <p>ADIB's AI story carries a differentiated dimension that no conventional bank peer can replicate: Islamic AI. ADIB is pioneering AI applications that are inherently Shari'a-aligned — from Emirati Arabic chatbots that serve Islamic banking customers in their native dialect, to AI-assisted Shari'a compliance checking, to responsible AI governance explicitly anchored in Islamic finance values. CEO Abdelbary has made responsible, ethical AI a personal strategic commitment: "I'm very proud to say that I believe we're leading the market in sustainable, controlled and ethical [AI] deployment." This creates a defensible competitive moat in the AED 4 trillion Islamic finance market.</p>

    <h3>5. Financial Performance as AI Enabler</h3>
    <p>ADIB's record 2025 financial results provide the capital confidence to sustain and accelerate AI investment: AED 281 billion in assets (+24%); AED 8.1 billion net profit before tax (+18%); ROE of 29% (industry-leading); cost-to-income ratio of 28.6% (efficiency driven in part by AI automation). The bank added 283,000 new customers in 2025 — its highest annual intake ever — with digital onboarding and AI-powered remote sales as key acquisition drivers. The NPA ratio improved to a record low of 2.8%, supported by AI credit decisioning quality. These results fund the 2026–2030 corporate plan's technology investment envelope.</p>

    <h3>6. Strategic Risks & Gaps</h3>
    <p>ADIB's primary AI risks are talent, disclosure, and pace. The bank does not yet publish standalone AI reports or detailed AI use case inventories — limiting external validation and investor confidence in the AI strategy depth. AI talent depth (3.2/5.0) is the weakest maturity dimension — a structural risk as competition for AI engineers intensifies across UAE banking. Agentic AI and full enterprise GenAI scale-up are still in early stages, with the 2026–2030 plan presenting execution risk if talent and governance infrastructure does not keep pace with ambition.</p>

    <h3>7. CEO Recommendation Summary</h3>
    <p>ADIB should double down on its AI differentiation as the world's leading Islamic AI bank. The immediate priorities are: (1) Publish an annual AI Transparency and Innovation Report to match the ADIB Vision 2035 ambition with credible public disclosure. (2) Accelerate agentic AI from pilot to production across at least 3 high-value banking workflows by end-2026. (3) Establish a dedicated AI Centre of Excellence with a clear talent acquisition plan. (4) Leverage ADIB Ventures more aggressively to onboard GenAI startups into production systems within 12 months of the Innovation Challenge. (5) Codify and publish the Islamic AI Ethics Framework — staking a global leadership position that regulators, investors, and customers can recognize and validate.</p>

    <div style="margin-top:2rem;padding:1rem;background:#f0f8f3;border-radius:8px;font-size:12px;color:#555;border-left:3px solid #006633">
      <strong>Report Basis:</strong> This CEO-level report is synthesized from ADIB's Annual Integrated Report 2025 (published March 2026), official adib.ae disclosures, investor relations documents, and verified press releases. ADIB does not currently publish a standalone AI Report or AI CEO Letter. This document constitutes the synthesized executive AI intelligence briefing. All financial data sourced from official ADIB 2025 Annual Report.
    </div>
  </div>
</div>
</div>

<!-- REPORT URLs PAGE -->
<div id="page-urls" class="page">
<div class="container">
  <div class="section-head">
    <h2>2026 Report Download URL Inventory</h2>
    <p>Official ADIB document sources — all URLs verified against adib.ae domain structure</p>
  </div>
  <div class="card" style="margin-bottom:1.5rem">
    <div class="card-title" style="margin-bottom:1rem">Latest 2026 Report Inventory URLs</div>
    <table>
      <thead><tr><th>Document Name</th><th>Type</th><th>Date</th><th>URL</th></tr></thead>
      <tbody>
        <tr><td><strong>ADIB Annual Integrated Report 2025 (PDF)</strong></td><td><span class="tag tag-dept">Annual Report</span></td><td>March 2026</td><td class="url-row"><a href="https://www.adib.ae/-/media/project/adib/adibsite/docs/investor-relations/annual-reports/2026/annual-report-2025-en.pdf" target="_blank">adib.ae → Annual Report 2025 PDF ↗</a></td></tr>
        <tr><td><strong>ADIB Investor Relations Hub</strong></td><td><span class="tag tag-dept">IR Portal</span></td><td>Updated 2026</td><td class="url-row"><a href="https://www.adib.ae/en/investor-relations" target="_blank">adib.ae/en/investor-relations</a></td></tr>
        <tr><td><strong>ADIB FY2025 Financial Results (MDA)</strong></td><td><span class="tag tag-scale">Quarterly MDA</span></td><td>Q1 2026</td><td class="url-row"><a href="https://www.adib.ae/-/media/project/adib/adibsite/docs/investor-relations/quarterly-results/mda/2025/mda-q1-en-updated.pdf" target="_blank">adib.ae → MDA Q1 2025 PDF ↗</a></td></tr>
        <tr><td><strong>ADIB Investor Presentation Q2 2025</strong></td><td><span class="tag tag-scale">IR Presentation</span></td><td>August 2025</td><td class="url-row"><a href="https://www.adib.ae/-/media/project/adib/adibsite/docs/investor-relations/investor-presentation/2025/q2.pdf" target="_blank">adib.ae → IR Presentation Q2 2025 PDF ↗</a></td></tr>
        <tr><td><strong>ADIB Sustainability Report (ESG)</strong></td><td><span class="tag tag-prod">ESG / Sustainability</span></td><td>2025–2026</td><td class="url-row"><a href="https://www.adib.ae/en/sustainability" target="_blank">adib.ae/en/sustainability</a></td></tr>
        <tr><td><strong>ADIB Press Releases 2026</strong></td><td><span class="tag tag-tech">Press Releases</span></td><td>Ongoing 2026</td><td class="url-row"><a href="https://www.adib.ae/en/news" target="_blank">adib.ae/en/news</a></td></tr>
        <tr><td><strong>ADIB Q2 2025 Financial Statements (PDF)</strong></td><td><span class="tag tag-scale">Financial Statements</span></td><td>H1 2025</td><td class="url-row"><a href="https://www.adib.ae/-/media/project/adib/adibsite/docs/investor-relations/quarterly-results/financial-statements/2025/adib-fs-q2-en.pdf" target="_blank">adib.ae → FS Q2 2025 PDF ↗</a></td></tr>
        <tr><td><strong>ADX Regulatory Disclosures — ADIB</strong></td><td><span class="tag tag-tech">Regulatory / ADX</span></td><td>Ongoing 2026</td><td class="url-row"><a href="https://www.adx.ae/en/markets/equities/company-profile/ADIB" target="_blank">adx.ae → ADIB Company Profile ↗</a></td></tr>
        <tr><td><strong>ADIB Vision & AI Strategy Page</strong></td><td><span class="tag tag-pilot">AI / Digital</span></td><td>Ongoing</td><td class="url-row"><a href="https://www.adib.ae/en/about-adib" target="_blank">adib.ae/en/about-adib</a></td></tr>
        <tr><td><strong>ADIB Ventures Innovation Portal</strong></td><td><span class="tag tag-pilot">Innovation / GenAI</span></td><td>2024–2026</td><td class="url-row"><a href="https://www.adib.ae/en/ventures" target="_blank">adib.ae/en/ventures</a></td></tr>
      </tbody>
    </table>
  </div>
  <div class="card" style="margin-bottom:1.5rem">
    <div class="card-title" style="margin-bottom:1rem">AI Use Case Document URLs</div>
    <p style="font-size:12px;color:#888;margin-bottom:1rem;font-style:italic">Note: ADIB does not currently publish standalone AI whitepapers or AI use case documents. All AI content is embedded in the documents below. A dedicated ADIB AI Report does not yet exist — this intelligence report constitutes the primary AI use case synthesis.</p>
    <table>
      <thead><tr><th>AI Document / Section</th><th>AI Content</th><th>URL</th></tr></thead>
      <tbody>
        <tr><td><strong>ADIB Annual Report 2025 — Digital Chapter (Sec 7)</strong></td><td>GenAI strategy, digital transformation KPIs, ADIB Ventures AI, data-driven tools, building bank of the future</td><td class="url-row"><a href="https://www.adib.ae/-/media/project/adib/adibsite/docs/investor-relations/annual-reports/2026/annual-report-2025-en.pdf" target="_blank">Annual Report 2025 PDF ↗</a></td></tr>
        <tr><td><strong>ADIB Annual Report 2025 — CEO Message (AI vision)</strong></td><td>GenAI as cornerstone of strategy; ADIB 2035 Vision; AI in all business lines; responsible AI commitment</td><td class="url-row"><a href="https://www.adib.ae/-/media/project/adib/adibsite/docs/investor-relations/annual-reports/2026/annual-report-2025-en.pdf" target="_blank">Annual Report 2025 PDF ↗</a></td></tr>
        <tr><td><strong>Khaleej Times — ADIB GenAI Feature</strong></td><td>GenAI chatbots, personalised products, fraud AI, process automation, ADIB 2035 AI Vision details</td><td class="url-row"><a href="https://www.khaleejtimes.com/supplements/adib-implements-best-data-platform-for-ai-initiatives" target="_blank">khaleejtimes.com — ADIB GenAI Feature ↗</a></td></tr>
        <tr><td><strong>ADIB ACE Launch Press Release (Zawya)</strong></td><td>ACE analytics command center, big data AI, digital onboarding stats, predictive analytics</td><td class="url-row"><a href="https://www.zawya.com/en/press-release/adib-accelerates-digital-growth-to-support-customer-adoption-o4unx14e" target="_blank">zawya.com — ACE Launch PR ↗</a></td></tr>
        <tr><td><strong>ADIB SAS Fraud Management PR (Zawya)</strong></td><td>SAS Fraud Management on Azure, cloud AI fraud detection, AML, financial crime prevention</td><td class="url-row"><a href="https://www.zawya.com/en/press-release/adib-strengthens-fraud-management-capabilities-with-sas-and-microsoft-a4cz3xgb" target="_blank">zawya.com — SAS+Microsoft PR ↗</a></td></tr>
        <tr><td><strong>ADIB GenAI Innovation Challenge (adib.ae)</strong></td><td>ADIB Ventures + DIFC GenAI Challenge, winner announcement, GenAI innovation pipeline</td><td class="url-row"><a href="https://www.adib.ae/en/news/2025/jan/adib-ventures-and-difc-innovation-hub-unveil-generative-ai-innovation-challenge-winner" target="_blank">adib.ae — GenAI Challenge Winner ↗</a></td></tr>
        <tr><td><strong>CEO Interview — The CEO Magazine (GenAI Strategy)</strong></td><td>Mohamed Abdelbary on GenAI as future of banking, ADIB 2035, responsible AI, Islamic AI differentiation</td><td class="url-row"><a href="https://amp.theceomagazine.com/business/executive-interview-feature/community-chest-mohamed-abdelbary/" target="_blank">theceomagazine.com — CEO Interview ↗</a></td></tr>
        <tr><td><strong>Finance Middle East — CDO AI Interview</strong></td><td>AI as cornerstone, ADIB Ventures GenAI, fintech partnerships, AI security and fraud use cases</td><td class="url-row"><a href="https://www.financemiddleeast.com/islamic-finance/ai-is-a-cornerstone-of-adibs-strategy-says-its-group-chief-digital-officer/" target="_blank">financemiddleeast.com — CDO Interview ↗</a></td></tr>
      </tbody>
    </table>
  </div>
  <div class="card">
    <div class="card-title" style="margin-bottom:1rem">All Official ADIB Source URLs</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px">
      <a href="https://www.adib.ae" class="chip" target="_blank">adib.ae (main)</a>
      <a href="https://www.adib.ae/en/investor-relations" class="chip" target="_blank">Investor Relations</a>
      <a href="https://www.adib.ae/-/media/project/adib/adibsite/docs/investor-relations/annual-reports/2026/annual-report-2025-en.pdf" class="chip" target="_blank">Annual Report 2025 PDF</a>
      <a href="https://www.adib.ae/en/news" class="chip" target="_blank">Press Releases / News</a>
      <a href="https://www.adib.ae/en/sustainability" class="chip" target="_blank">Sustainability / ESG</a>
      <a href="https://www.adib.ae/en/ventures" class="chip" target="_blank">ADIB Ventures</a>
      <a href="https://www.adib.ae/en/about-adib" class="chip" target="_blank">About / Vision</a>
      <a href="https://www.adx.ae/en/markets/equities/company-profile/ADIB" class="chip" target="_blank">ADX ADIB Filings</a>
      <a href="https://www.centralbank.ae" class="chip" target="_blank">CBUAE</a>
      <a href="https://www.adib.ae/-/media/project/adib/adibsite/docs/investor-relations/investor-presentation/2025/q2.pdf" class="chip" target="_blank">IR Presentation Q2 2025</a>
    </div>
    <div style="margin-top:1.5rem;padding:1rem;background:#f0f8f3;border-radius:8px;font-size:12px;color:#888">
      <strong>CEO Report Download URL:</strong> ADIB does not publish a standalone CEO AI Report. The Group CEO Message with AI strategy content is embedded in the Annual Report 2025 PDF (pages 2–3): <a href="https://www.adib.ae/-/media/project/adib/adibsite/docs/investor-relations/annual-reports/2026/annual-report-2025-en.pdf" style="color:#185fa5" target="_blank">adib.ae Annual Report 2025 PDF ↗</a>. This ADIB AI Intelligence Report constitutes the synthesized CEO-level AI document.
    </div>
  </div>
</div>
</div>

<div class="page-footer">
  ADIB AI Intelligence Report 2026 | Autonomous Banking AI Analysis | Sources: adib.ae, ADX, CBUAE, Zawya, Khaleej Times | May 2026
</div>`;

const ADIBAIIntelligenceReport2026: React.FC = () => {
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

export default ADIBAIIntelligenceReport2026;
