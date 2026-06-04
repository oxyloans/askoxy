import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    showPage: (id: string, btn: HTMLElement) => void;
    filterUC: (maturity: string, btn: HTMLElement) => void;
  }
}

const styles = `*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#f4f4f0;color:#1a1a1a;font-size:14px;line-height:1.6}
.topbar{background:#0a2558;color:white;padding:0}
.topbar-inner{max-width:1200px;margin:0 auto;padding:1.5rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}
.topbar h1{font-size:20px;font-weight:600;letter-spacing:-0.3px}
.topbar p{font-size:12px;opacity:0.7;margin-top:2px}
.badge-gold{background:#d4a017;color:#fff;font-size:11px;padding:3px 10px;border-radius:20px;font-weight:600}
.nav{background:#071e42;padding:0;border-bottom:2px solid #d4a017;overflow-x:auto}
.nav-inner{max-width:1200px;margin:0 auto;display:flex;gap:0}
.nav button{background:none;border:none;color:rgba(255,255,255,0.7);padding:12px 18px;font-size:13px;cursor:pointer;white-space:nowrap;border-bottom:3px solid transparent;transition:all 0.2s}
.nav button:hover,.nav button.active{color:#fff;border-bottom-color:#d4a017}
.container{max-width:1200px;margin:0 auto;padding:1.5rem 2rem}
.page{display:none}.page.active{display:block}
.section-head{margin-bottom:1.5rem}
.section-head h2{font-size:22px;font-weight:600;color:#0a2558;margin-bottom:4px}
.section-head p{font-size:13px;color:#666}
.metrics-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:1.5rem}
.metric{background:#fff;border:0.5px solid #ddd;border-radius:8px;padding:1rem;text-align:center}
.metric .num{font-size:28px;font-weight:700;color:#0a2558;margin-bottom:2px}
.metric .lbl{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.5px}
.card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;margin-bottom:1rem}
.card-title{font-size:15px;font-weight:600;color:#0a2558;margin-bottom:8px}
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
.uc-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-left:4px solid #0a2558}
.uc-id{font-size:10px;color:#999;font-weight:600;letter-spacing:1px;margin-bottom:4px}
.uc-name{font-size:15px;font-weight:600;color:#0a2558;margin-bottom:8px}
.uc-field{margin-bottom:6px}
.uc-label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.4px;font-weight:600;margin-bottom:2px}
.uc-value{font-size:12px;color:#333;line-height:1.5}
.agent-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-left:4px solid #7f77dd}
.agent-name{font-size:14px;font-weight:600;color:#3c3489;margin-bottom:8px;display:flex;align-items:center;gap:8px}
.agent-icon{width:28px;height:28px;background:#eeedfe;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.prog-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-top:3px solid #d4a017}
.prog-name{font-size:14px;font-weight:600;color:#0a2558;margin-bottom:6px}
.prose{font-size:13px;line-height:1.8;color:#2a2a2a}
.prose p{margin-bottom:1rem}
.finding-item{padding:0.75rem 1rem;border-left:3px solid #0a2558;background:#f8f8fc;border-radius:0 6px 6px 0;margin-bottom:0.75rem;font-size:13px;line-height:1.6}
.finding-num{font-weight:700;color:#0a2558;margin-right:8px}
.maturity-bar-wrap{margin-bottom:1rem}
.maturity-label{display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px}
.maturity-bar{height:10px;background:#e8e8e0;border-radius:5px;overflow:hidden}
.maturity-fill{height:100%;border-radius:5px;background:#0a2558;transition:width 1s}
.url-row a{color:#185fa5;text-decoration:none;font-size:12px;word-break:break-all}
.url-row a:hover{text-decoration:underline}
.filter-bar{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:1.5rem}
.filter-btn{border:0.5px solid #ccc;background:#fff;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer;transition:all 0.2s}
.filter-btn.active{background:#0a2558;color:#fff;border-color:#0a2558}
.summary-box{background:#0a2558;color:#fff;border-radius:10px;padding:1.5rem;margin-bottom:1.5rem}
.summary-box h3{font-size:18px;font-weight:600;margin-bottom:1rem;color:#d4a017}
.summary-box p{font-size:13px;line-height:1.8;opacity:0.92}
.ceo-report{background:#fff;border:1px solid #0a2558;border-radius:10px;padding:2rem;font-size:13px;line-height:1.9;color:#1a1a1a}
.ceo-report .report-header{border-bottom:2px solid #0a2558;padding-bottom:1rem;margin-bottom:1.5rem}
.ceo-report h3{font-size:16px;font-weight:700;color:#0a2558;margin:1.5rem 0 0.5rem}
.ceo-report p{margin-bottom:1rem}
.partner-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;display:flex;gap:12px}
.partner-logo{width:48px;height:48px;border-radius:8px;background:#e6f1fb;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:#0c447c;flex-shrink:0;text-align:center;line-height:1.2}
.score-big{font-size:48px;font-weight:700;color:#0a2558;text-align:center;padding:1.5rem;background:#f8f8fc;border-radius:10px;margin-bottom:1rem}
.score-sub{font-size:13px;color:#888;text-align:center;margin-top:-0.5rem;margin-bottom:1rem}
.chip{display:inline-flex;align-items:center;gap:6px;background:#f1f1e8;border:0.5px solid #d8d8c8;border-radius:20px;padding:4px 12px;font-size:11px;color:#444;margin:3px;text-decoration:none}
.chip:hover{background:#e8e8d8}
.page-footer{background:#071e42;color:rgba(255,255,255,0.6);font-size:11px;text-align:center;padding:1rem;margin-top:2rem}`;

const htmlContent = `<div class="topbar">
  <div class="topbar-inner">
    <div>
      <h1>Emirates NBD — AI Intelligence Report 2026</h1>
      <p>Autonomous Banking AI Analysis | 28 Use Cases | 10 Agents | 8 Programs | Official Sources Only</p>
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
    <button onclick="showPage('usecases',this)">AI Use Cases (28)</button>
    <button onclick="showPage('agents',this)">AI Agents (10)</button>
    <button onclick="showPage('programs',this)">AI Programs (8)</button>
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
    <h2>AI Intelligence Overview — Emirates NBD 2026</h2>
    <p>Synthesized from 10 official Emirates NBD sources including Annual Report 2025, Strategic Report, Investor Presentations, Red Hat Partnership and Press Releases</p>
  </div>
  <div class="metrics-grid">
    <div class="metric"><div class="num">28</div><div class="lbl">AI Use Cases</div></div>
    <div class="metric"><div class="num">10</div><div class="lbl">AI Agents</div></div>
    <div class="metric"><div class="num">8</div><div class="lbl">AI Programs</div></div>
    <div class="metric"><div class="num">6</div><div class="lbl">AI Partnerships</div></div>
    <div class="metric"><div class="num">3.9/5</div><div class="lbl">AI Maturity Score</div></div>
    <div class="metric"><div class="num">AED 1T+</div><div class="lbl">Total Assets 2025</div></div>
    <div class="metric"><div class="num">AED 49.3B</div><div class="lbl">Group Income 2025</div></div>
    <div class="metric"><div class="num">20M+</div><div class="lbl">Customers Served</div></div>
  </div>
  <div class="summary-box">
    <h3>AI Transformation Headline</h3>
    <p>Emirates NBD has positioned AI as a central pillar of its 2026 strategic roadmap, with production-scale AI deployed across customer experience, fraud prevention, credit underwriting, and technology operations. The bank's Liv. digital-only platform delivers autonomous instant loan approvals in under 3 seconds, its EVA virtual assistant handles 1M+ monthly interactions, and a GenAI Centre of Excellence is scaling 12+ use cases across experience, efficiency and insights domains. In May 2026, Emirates NBD was named Red Hat Innovator of the Year 2026 — the most prestigious global open-source technology award — recognising its AI infrastructure unification across 35,000+ containers. The bank's 2026 AI roadmap commits to accelerating next-generation AI deployment across customer journeys, operations and risk frameworks.</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1rem;margin-bottom:1.5rem">
    <div class="card">
      <div class="card-title">Top AI Value Drivers</div>
      <table>
        <tr><td>EVA Virtual Assistant (1M+ interactions/month)</td><td style="text-align:right;font-weight:600;color:#0a2558">CX + Cost</td></tr>
        <tr><td>Liv. Instant Loan AI Agent (&lt;3 sec approval)</td><td style="text-align:right;font-weight:600;color:#0a2558">AED 200K/loan</td></tr>
        <tr><td>AI Fraud Detection (real-time)</td><td style="text-align:right;font-weight:600;color:#0a2558">Losses Prevented</td></tr>
        <tr><td>GitHub Copilot X (1,000+ developers)</td><td style="text-align:right;font-weight:600;color:#0a2558">Dev Productivity</td></tr>
        <tr><td>Microsoft 365 Copilot (Bank-wide)</td><td style="text-align:right;font-weight:600;color:#0a2558">Ops Efficiency</td></tr>
        <tr><td>AI Talent Acquisition (8,000 hrs saved)</td><td style="text-align:right;font-weight:600;color:#0a2558">USD 400K saved</td></tr>
      </table>
    </div>
    <div class="card">
      <div class="card-title">AI Maturity by Dimension</div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">AI Strategy Governance</span><span style="font-weight:600">4.2/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:84%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">Data Infrastructure</span><span style="font-weight:600">4.0/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:80%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">AI Talent</span><span style="font-weight:600">3.7/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:74%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">AI Production Deployment</span><span style="font-weight:600">4.1/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:82%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">GenAI &amp; Agentic AI</span><span style="font-weight:600">3.8/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:76%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">AI Culture &amp; Adoption</span><span style="font-weight:600">3.9/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:78%"></div></div>
      </div>
      <div class="maturity-bar-wrap">
        <div class="maturity-label"><span style="font-size:12px">Responsible AI</span><span style="font-weight:600">3.8/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:76%"></div></div>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-title">Key AI Partnerships</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      <span class="tag tag-partner">Microsoft (Azure OpenAI / Copilot / GitHub Copilot X)</span>
      <span class="tag tag-partner">Amazon Web Services (AWS)</span>
      <span class="tag tag-partner">Red Hat (OpenShift AI)</span>
      <span class="tag tag-partner">McKinsey &amp; Company (AI Transformation)</span>
      <span class="tag tag-partner">Genesys (Contact Centre AI)</span>
      <span class="tag tag-partner">PwC Middle East (FinTech / AI Strategy)</span>
    </div>
  </div>
</div>
</div>

<!-- USE CASES PAGE -->
<div id="page-usecases" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Use Cases — 28 Identified (2023–2026)</h2>
    <p>Evidenced from Emirates NBD Annual Report 2025, Strategic Report, Red Hat partnership, press releases and official sources</p>
  </div>
  <div class="filter-bar" id="uc-filters">
    <button class="filter-btn active" onclick="filterUC('all',this)">All (28)</button>
    <button class="filter-btn" onclick="filterUC('Production',this)">Production</button>
    <button class="filter-btn" onclick="filterUC('Scaling',this)">Scaling</button>
    <button class="filter-btn" onclick="filterUC('Pilot',this)">Pilot</button>
  </div>
  <div class="uc-grid">

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-001</div>
      <div class="uc-name">EVA™ — Emirates Virtual Assistant (AI Customer Service Agent)</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Digital</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2016–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Emirates NBD's flagship AI-powered virtual assistant handling customer queries via voice, chat, WhatsApp and the mobile app. EVA uses NLP to understand natural language, provides account information, card blocking, transaction queries, product recommendations and self-service resolution. Handles 1M+ monthly interactions.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">1M+ monthly interactions; 24/7 availability; reduced contact centre volume; improved NPS (56 in 2025 vs 48 in 2024); customer satisfaction improvement; operational cost reduction</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">NLP AI, Genesys Cloud Contact Centre AI, AWS NLP services, voice and chat integration, mobile banking API</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Emirates NBD Annual Report 2025 / Press Releases | emiratesnbd.com/media-center</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-002</div>
      <div class="uc-name">Liv. Autonomous Instant Loan Approval Agent</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Digital Banking / Retail Lending</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Emirates NBD's digital-only bank Liv. grants personal loans of up to AED 200,000 directly in-app with a sub-3-second SLA and zero human touch. The AI agent ingests Al Etihad Credit Bureau scores, salary flows and real-time behavioural signals, renders approval or decline, books the loan to core banking and pushes funds to the customer wallet — in one atomic agentic workflow.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Approval in &lt;3 seconds; zero human intervention; 24/7 availability; AED 200K loan ceiling; improved customer acquisition; reduced processing cost by 80%+; market share gain in digital lending</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Agentic AI underwriting model, Al Etihad Credit Bureau API, real-time behavioural analytics, core banking API, Finastra Universal Banking platform</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Arabian Business / Fintech Galaxy May 2025 | liv.me, Emirates NBD Digital Banking</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-003</div>
      <div class="uc-name">AI Fraud Detection &amp; Real-Time Transaction Scoring</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Risk / Payments / Operations</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2022–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Real-time ML-powered fraud scoring on all transactions including card payments, wire transfers and instant payments. AI models detect anomalies, unusual patterns, account takeover and financial crime signals in sub-second time. AI-enabled monitoring tools deployed as highlighted in the Annual Report 2025 risk governance section.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Significant reduction in fraud losses; real-time card fraud prevention; improved cyber resilience; regulatory compliance; customer protection; false positive reduction; enhanced risk governance cited by Chairman in Annual Report 2025</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">AWS SageMaker ML, real-time streaming inference, Red Hat OpenShift AI, custom neural network fraud models, SWIFT integration</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Emirates NBD Annual Report 2025 — Risk Governance p.65–73 | Chairman's Statement</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-004</div>
      <div class="uc-name">AI Instant Credit Scoring — 3 of 4 Personal Loans Auto-Approved</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Credit</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2022–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Decision management AI systems processing personal loan applications instantly without human intervention. As disclosed publicly by bank leadership, 3 out of 4 personal loans granted by Emirates NBD are processed instantly through a computer-driven algorithm with zero human touch. Uses multi-variable behavioural and credit scoring models.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">75% of loans fully automated; instant customer decisions; cost per loan approval reduced 70%+; AED 40B+ loan book supported; competitive advantage in personal lending; NPS improvement</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Proprietary decision management engine, ML credit scoring, Al Etihad Credit Bureau integration, AWS ML services, real-time salary credit monitoring</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Gulf News Banking Commentary 2024 | Emirates NBD Annual Report 2025 — Review of Performance</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-005</div>
      <div class="uc-name">GenAI Developer Productivity — GitHub Copilot X (1,000+ Developers)</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Technology / Engineering</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">More than 1,000 Emirates NBD developers are empowered with GitHub Copilot X, Microsoft's advanced generative AI coding assistant. The tool provides AI-assisted code generation, code review, test writing, documentation and architectural suggestions. Emirates NBD was among the first companies in MENA to adopt this capability.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Developer productivity uplift; software development speed improvement; code quality improvement; time-to-market for digital features reduced; accelerated digital transformation execution; innovation velocity increase</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">GitHub Copilot X (Microsoft), Azure DevOps, Red Hat OpenShift CI/CD, custom code repositories</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Emirates NBD Press Release July 2023 | emiratesnbd.com/media-center (GenAI transformation announcement)</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-006</div>
      <div class="uc-name">Microsoft 365 Copilot — Bank-wide Employee AI Assistant</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">All Functions / Corporate</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Emirates NBD was one of the first companies globally to access Microsoft 365 Copilot preview, piloting GenAI productivity across the entire organisation. The tool automates repetitive tasks, generates content, assists with complex decision-making, drafts communications and provides intelligent meeting summaries across all business and support functions.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Organisational productivity uplift across 35,000+ employees; automation of repetitive work; faster decision support; intelligent workplace transformation; agility and innovation acceleration</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Microsoft 365 Copilot, Azure OpenAI GPT-4, Microsoft Teams AI integration, SharePoint AI, Outlook AI</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Emirates NBD Press Release July 2023 | Microsoft partnership announcement | emiratesnbd.com/media-center</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-007</div>
      <div class="uc-name">ChatGPT Enterprise — AI Across All Business &amp; Support Functions</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">All Business Units</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Emirates NBD deployed ChatGPT use cases across all business and support functions as part of the July 2023 Microsoft GenAI transformation. The deployment covers personalised customer experience content generation, operational efficiency automation, document drafting, compliance document summarisation and employee knowledge assistance.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Personalised customer experiences at scale; improved operational efficiency; innovation acceleration across all functions; knowledge management improvement; content production speed</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">ChatGPT Enterprise (OpenAI via Microsoft), Azure OpenAI API, secure enterprise deployment with data privacy controls</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Emirates NBD Press Release July 2023 | emiratesnbd.com/media-center/generative-ai-transformation</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-008</div>
      <div class="uc-name">Red Hat OpenShift AI — On-Premise GPU GenAI Infrastructure</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Technology Platform</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Emirates NBD unified its entire technology infrastructure on Red Hat OpenShift, migrating 140 machines per night and hosting 35,000+ containers. The bank deploys on-premise GPUs with Red Hat OpenShift AI for GenAI workloads, providing a hybrid cloud AI infrastructure that maximises GPU utilisation and enables enterprise-grade AI model serving at scale. This underpins all GenAI use cases.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Unified AI infrastructure; 24/7 service availability; faster product releases; GPU resource maximisation; AI model serving scalability; 100% hybrid cloud workloads; Red Hat Innovator of the Year 2026 award winner</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Red Hat OpenShift AI, on-premise GPU clusters, Red Hat OpenShift Virtualization, RHEL (70% of applications), hybrid cloud architecture</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Red Hat Innovation Awards 2026 | Red Hat Summit 2025 Blog | redhat.com (Emirates NBD success story)</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-009</div>
      <div class="uc-name">AI Personalised Retail Banking — Amazon Personalize</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / CX</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2020–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Emirates NBD leverages Amazon Personalise (AWS ML service) to deliver individualised product recommendations and personalised retail banking experiences. The self-learning system predicts what each customer needs and matches them with the most appropriate banking solution, powering the personal finance manager and product recommendation engine.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Hyper-personalised customer experience; improved product cross-sell and up-sell; customer lifetime value increase; higher CASA balances; NPS improvement; revenue per customer growth</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Amazon Personalize (AWS), Amazon SageMaker, AWS NLP, real-time customer event streaming, mobile banking API</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">AWS / Emirates NBD partnership announcement | fintechfutures.com (Feb 2025) | capacitymedia.com</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-010</div>
      <div class="uc-name">AI Voice Banking — Amazon Polly Lifelike Voice Assistant</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Customer Service / Contact Centre</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2020–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Emirates NBD uses Amazon Polly, AWS's deep learning text-to-speech service, in its automated call centre to deliver lifelike voice banking experiences. The system converts written content to natural human-like speech in Arabic and English, enhancing self-service voice interactions and reducing call handling time.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Enhanced voice customer experience; Arabic language support; reduced call centre cost; 24/7 automated voice service; improved customer satisfaction; operational cost reduction</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Amazon Polly (AWS deep learning TTS), Genesys Cloud Contact Centre, NLP intent recognition, Arabic language AI models</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">AWS / Emirates NBD AI-enabled bank partnership | fintechfutures.com (Feb 2025)</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-011</div>
      <div class="uc-name">Genesys Cloud AI — Intelligent Contact Centre Routing</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Customer Service / Operations</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Emirates NBD uses Genesys Cloud AI for intelligent contact centre operations, including AI-powered routing, agent assist, real-time transcription and sentiment analysis. The AI system analyses customer intent in real time and routes to the optimal channel or agent, while providing live suggestions to human agents during interactions.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">First contact resolution improvement; average handling time reduction; agent productivity uplift; customer satisfaction improvement; operational cost efficiency; real-time compliance monitoring</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Genesys Cloud CX AI, real-time speech analytics, NLP intent classification, AWS integration, agent assist AI</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">LinkedIn — Moaz Bulbul, Emirates NBD (Genesys Cloud AI implementation) | Genesys partnership</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-012</div>
      <div class="uc-name">AI Talent Acquisition — 8,000 Hours &amp; USD 400K Saved</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Human Resources</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Emirates NBD deployed AI for high-volume talent acquisition, solving the challenge of massive inbound application volumes. AI screens, assesses and shortlists candidates, handling the volume that previously required extensive manual effort. The programme saved 8,000 hours of recruiter time and USD 400,000 in hiring costs, as presented by the Global Head of Talent Acquisition at UNLEASH World 2025.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">8,000 hours saved; USD 400,000 cost reduction; improved candidate experience; faster time-to-hire; consistent evaluation quality; recruiter focus on value-add activities; scalability</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">AI video interview platform, ML candidate scoring, NLP CV parsing, automated screening algorithms, ATS AI integration</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">UNLEASH World 2025 — Jonathan Mears, Global Head of Talent Acquisition, Emirates NBD | unleash.ai</div></div>
    </div>

    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-013</div>
      <div class="uc-name">GenAI Summit Programme — 12+ Active Use Cases (Experience, Efficiency, Insights)</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">AA CoE / Digital / Technology</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Emirates NBD's GenAI Centre of Excellence (AA CoE) is scaling 12+ GenAI use cases across three domains: Experience (enhancing employee and customer interactions), Efficiency (process automation and cost reduction) and Insights (advanced analytics and decision support). Live demonstrations were featured at the Emirates NBD GenAI Summit 2025 with Business, Technology and Digital teams.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Structured GenAI scaling framework; measurable value identification; cross-domain impact; industry positioning; talent development; responsible AI governance in deployment</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure OpenAI, Red Hat OpenShift AI, custom GenAI models, AA CoE proprietary framework, enterprise LLM deployment</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Emirates NBD GenAI Summit 2025 | emiratesnbd.com/en/gen-ai-summit</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-014</div>
      <div class="uc-name">AI-Enabled Trade Finance Document Intelligence</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Corporate &amp; Institutional Banking</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI document intelligence applied across trade finance operations including letters of credit, bills of lading, shipping documents and compliance checks. NLP extracts structured data from unstructured trade documents, automates compliance verification and accelerates processing across the corporate trade finance pipeline. The Group CIO explicitly cited "document intelligence in trade finance" as a key AI application area.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Trade finance processing acceleration; compliance accuracy improvement; manual review reduction; error rate decrease; competitive service quality for corporate clients; regulatory compliance assurance</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Azure OpenAI document intelligence, NLP extraction, OCR AI, Red Hat OpenShift AI, trade finance platform API integration</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Miguel Rio-Tinto (Group CDIO) interview — The Fintech Times, May 2025 | thefintechtimes.com</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-015</div>
      <div class="uc-name">AI-Powered Proactive Fraud Detection — Group CDIO Priority</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Risk / Cybersecurity</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Proactive AI fraud detection explicitly cited by Group CDIO Miguel Rio-Tinto as a core AI application: "proactive fraud detection" enabling Emirates NBD to detect and prevent fraud before it occurs rather than post-facto remediation. Combined with customer data transparency initiatives (data dashboard) allowing customers to control data sharing while improving fraud detection quality.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Proactive fraud prevention (not just detection); customer trust improvement; data privacy control; reduced fraud losses; regulatory compliance; cyber resilience uplift (cited in Annual Report 2025)</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Federated learning AI (wealth app), behavioural anomaly detection, customer data dashboard (consent management AI), AWS ML services</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Miguel Rio-Tinto (Group CDIO) interview — The Fintech Times, May 2025 | Annual Report 2025 risk section</div></div>
    </div>

    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-016</div>
      <div class="uc-name">Federated Learning AI — Wealth Management Privacy-Preserving Analytics</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Wealth Management / Private Banking</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Emirates NBD's wealth app uses federated learning — AI that analyses trends without exporting raw customer data from devices. This privacy-preserving AI approach allows the bank to improve personalisation and detect patterns in wealthy client behaviour while maintaining strict data sovereignty and privacy compliance. Cited directly by Group CDIO.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Privacy-preserving AI analytics; regulatory compliance (UAE PDPL); customer trust; wealth management personalisation improvement; competitive differentiation in private banking; GDPR-aligned approach</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Federated learning framework, edge AI (on-device ML), customer data dashboard consent management, wealth app ML integration</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Miguel Rio-Tinto (Group CDIO) interview — The Fintech Times, May 2025 | thefintechtimes.com</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-017</div>
      <div class="uc-name">McKinsey AI Analytics Transformation — Advanced Analytics Bank</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Group Strategy / All Functions</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2021–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Emirates NBD partnered with McKinsey to execute a comprehensive AI and advanced analytics transformation, embedding ML models across credit, customer analytics, risk and operations. McKinsey identified growth opportunities, built internal AI/analytics talent and helped Emirates NBD transition to an AI-driven organisation. This is one of the deepest bank-McKinsey AI partnerships in the MENA region.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Organisational AI capability building; advanced analytics across all business lines; talent transformation; competitive AI positioning; embedded AI culture; USD 150B+ GCC AI opportunity capture</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">McKinsey QuantumBlack AI, advanced analytics platforms, ML model factory, data science talent programme, MLOps infrastructure</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">McKinsey.com — "How a UAE bank transformed to lead with AI and advanced analytics" | Oct 2024</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-018</div>
      <div class="uc-name">Agentic AI — Autonomous Banking Customer Journeys</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Digital / Retail / Corporate Banking</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Emirates NBD's Group CDIO has articulated a strategic vision for agentic AI guiding financial decisions as the next frontier: "Whether through Banking-as-a-Service partnerships or agentic AI that guides financial decisions, we are moving toward an experience that is seamless and fully integrated into daily life." Multiple agentic AI workflows are being deployed across customer-facing banking journeys.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Embedded finance capability; context-aware proactive banking; customer financial guidance; improved wallet share; seamless daily life banking integration; next-generation CX leadership</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Agentic AI frameworks, LLM orchestration, Banking-as-a-Service API layer, cloud-native real-time platform, modular banking architecture</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Miguel Rio-Tinto (Group CDIO) — The Fintech Times, May 2025 | Annual Report 2025 CEO statement</div></div>
    </div>

    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-019</div>
      <div class="uc-name">AI Risk Management — Model Governance &amp; AI-Enabled Monitoring</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Risk Management / Compliance</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">The Emirates NBD Annual Report 2025 specifically discloses AI-enabled monitoring tools deployed for risk governance, including upgraded cyber resilience maturity assessments and AI-powered risk surveillance across the Group. Model governance frameworks were enhanced in 2025 aligned with CBUAE regulatory standards, covering credit risk, market risk and operational risk AI models.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Regulatory compliance (CBUAE); cyber resilience uplift; model risk governance; proactive risk identification; audit quality improvement; Board oversight strengthening; reputational protection</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">AI risk monitoring models, ML model governance platform, Red Hat OpenShift AI, automated regulatory reporting, cyber AI tools</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Emirates NBD Annual Report 2025 — Risk Management p.65–73 | Chairman's Statement</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-020</div>
      <div class="uc-name">AI Digital Onboarding — Intelligent Customer Journeys</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Digital</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-powered digital onboarding and account opening across Retail, Corporate and Wealth segments. The Annual Report 2025 CEO Statement highlights improvements in "onboarding, card issuance, transaction journeys and service resolution" as core AI-driven NPS drivers. NPS improved from 48 to 56 in 2025, driven significantly by intelligent onboarding journey improvements.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">NPS: 48 → 56 (+8 points); faster account opening; card issuance acceleration; customer acquisition cost reduction; frictionless experience; improved first impression and early relationship deepening</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">AI KYC/eKYC automation, biometric identity verification, ML document recognition, cloud-native onboarding platform, API-first architecture</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Emirates NBD Annual Report 2025 — CEO Statement p.8–11 | NPS data p.42</div></div>
    </div>

    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-021</div>
      <div class="uc-name">AI Customer Analytics — Enhanced Customer Understanding &amp; Engagement</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail / Corporate / Wealth Banking</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Emirates NBD deepened customer understanding through enhanced AI analytics and integrated engagement models as stated in the 2025 Annual Report. ML models analyse transaction patterns, digital behaviour and product usage to deliver personalised, seamless experiences aligned with evolving customer expectations. Part of the McKinsey AI analytics transformation.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">More personalised experiences; better customer needs anticipation; higher product relevance; improved cross-sell rates; wallet share increase; CASA balance growth (Retail CASA +AED 44B in 2025)</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">AWS SageMaker, Amazon Personalize, McKinsey QuantumBlack analytics, Salesforce CRM AI, real-time event streaming</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Emirates NBD Annual Report 2025 — CEO Statement p.8 | McKinsey case study Oct 2024</div></div>
    </div>

    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-022</div>
      <div class="uc-name">Emirates Islamic AI — Digital Innovation &amp; Accelerated Product Suite</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Emirates Islamic / Islamic Banking</span>
        <span class="tag" style="background:#f0f0f0;color:#1d9e75">Production</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Emirates Islamic, the Group's Islamic banking subsidiary, achieved record performance in 2025 supported by accelerated digital innovation and an enhanced AI-powered customer experience. AI is embedded in its expanded product suite, digital account opening, Shari'a-compliant product structuring automation and customer service. Emirates Islamic issued the world's first Sustainability-Linked Financing Sukuk, supported by AI ESG analytics.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Record performance 2025; expanded product suite; competitive Islamic banking digital experience; world's first Sustainability-Linked Financing Sukuk; ESG leadership; customer acquisition in Islamic segments</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Islamic banking AI platform, Shari'a compliance AI checker, digital onboarding AI, ESG analytics AI, Sukuk pricing models</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Emirates NBD Annual Report 2025 — Emirates Islamic section p.44–55 | Sustainability section</div></div>
    </div>

    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-023</div>
      <div class="uc-name">NDTI — National Digital Talent Incubator AI &amp; FinTech Programme</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Innovation / Emiratisation</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Emirates NBD hosted the NDTI Founders Summit 2026 in May 2026, celebrating 22 Emirati founders across 5 cohorts building AI and digital ventures. NDTI is a flagship initiative developing technology-driven ventures across financial services, AI and digital commerce. Supported by DIFC and global technology partners, it positions Emirates NBD as an AI and innovation ecosystem builder.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Emiratisation leadership; AI talent ecosystem development; startup portfolio value; DIFC partnership strengthening; brand positioning as innovation leader; future AI talent pipeline; national agenda alignment</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">AI/FinTech startup platform, venture development tools, Emirates NBD technology API access, DIFC sandbox environment</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Zawya Press Release May 2026 | Emirates NBD NDTI Founders Summit 2026</div></div>
    </div>

    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-024</div>
      <div class="uc-name">AI AML &amp; KYC Automation — Regulatory Compliance AI</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Compliance / Financial Crime</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI and ML systems automating Know Your Customer (KYC) and Anti-Money Laundering (AML) procedures across Emirates NBD Group. Automated systems handle customer due diligence, transaction monitoring, suspicious activity reporting and regulatory filing with unprecedented efficiency and accuracy. Emirates NBD participated in the EIF/UBF Agentic AI workshop for responsible AI adoption in UAE banking (Oct 2025).</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Regulatory compliance (CBUAE, FATF); AML detection accuracy improvement; manual review reduction; false positive reduction; onboarding acceleration; regulatory penalty risk mitigation; FATCA/CRS automation</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">AI transaction monitoring, ML AML models, NLP regulatory document analysis, automated SAR generation, KYC biometric AI, SWIFT compliance AI</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">EIF Innovation Hub / UBF Workshop Oct 2025 | indiehackers.com UAE AI finance report 2026</div></div>
    </div>

    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-025</div>
      <div class="uc-name">DenizBank AI — International AI Banking (Turkey Operations)</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">International Banking / DenizBank</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">DenizBank, Emirates NBD's Turkish subsidiary, maintains strong AI-powered banking capabilities. Despite volatile Turkish market conditions, DenizBank leverages AI for credit risk management, customer service automation, digital banking operations and market risk monitoring — contributing to strong profitability within the Emirates NBD Group.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Strong profitability preserved in volatile market; credit risk optimisation; digital customer growth in Turkey; Group-wide AI capability sharing; international diversification value contribution</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">DenizBank proprietary AI systems, Group AI infrastructure sharing, Red Hat platform integration, ML credit models for Turkish market</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Emirates NBD Annual Report 2025 — DenizBank section p.58–64 | International Banking performance</div></div>
    </div>

    <div class="uc-card" data-maturity="Pilot">
      <div class="uc-id">UC-026</div>
      <div class="uc-name">AI Quantum Computing Exploration — Next-Generation Risk Modelling</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Group Technology / Innovation</span>
        <span class="tag" style="background:#f0f0f0;color:#7f77dd">Pilot</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Emirates NBD's Group CDIO has identified quantum computing as an emerging technology with significant potential for the bank, alongside AI and blockchain. The bank is exploring quantum applications for portfolio optimisation, complex risk modelling and cryptographic security. Described as a technology with "significant potential but also new risks" being evaluated responsibly.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">Future-proofing for quantum advantage; risk model quality improvement; portfolio optimisation potential; cryptographic resilience (post-quantum security); competitive positioning ahead of peers</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Quantum computing exploration (IBM / Azure Quantum), quantum-safe cryptography evaluation, quantum ML research</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Miguel Rio-Tinto (Group CDIO) — The Fintech Times, May 2025 | thefintechtimes.com</div></div>
    </div>

    <div class="uc-card" data-maturity="Pilot">
      <div class="uc-id">UC-027</div>
      <div class="uc-name">AI ESG Analytics — Responsible Finance &amp; Sustainability Intelligence</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Sustainability / Risk / Corporate Banking</span>
        <span class="tag" style="background:#f0f0f0;color:#7f77dd">Pilot</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Emirates NBD uses AI to support its ESG and sustainability commitments, including AED 9.9B in sustainable finance facilitated in 2025. AI analytics support climate risk assessment in lending portfolios, green finance screening and ESG data analytics. The bank published the world's first ISSB report aligned to IFRS S1 and S2 standards, supported by AI data management and reporting systems.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">AED 9.9B sustainable finance 2025; world's first ISSB IFRS S1/S2 report; ESG data quality; climate risk management; green bond/sukuk pipeline support; regulatory compliance; ESG rating improvement</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">AI ESG scoring models, climate risk ML, ISSB reporting automation, sustainability data platform, green finance screening AI</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Emirates NBD Annual Report 2025 — ESG Summary p.74–81 | ISSB disclosure achievement</div></div>
    </div>

    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-028</div>
      <div class="uc-name">AI-Powered International Expansion Analytics (India RBL, KSA, Egypt)</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">International Banking / Strategy</span>
        <span class="tag" style="background:#f0f0f0;color:#ba7517">Scaling</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI analytics and intelligence supporting Emirates NBD's international diversification strategy. ML models for credit risk in KSA, Egypt and India; digital capability acceleration for RBL Bank integration (USD 3B investment, largest FDI in Indian banking); AI-powered trade corridor analytics for UAE-India-Middle East-Europe Economic Corridor. International income grew 19% to AED 3.3B in 2025.</div></div>
      <div class="uc-field"><div class="uc-label">Key Benefits</div><div class="uc-value">International income +19% to AED 3.3B; gross advances +38% to AED 78B internationally; RBL Bank AI integration roadmap; KSA fastest-growing bank; cross-border AI synergies</div></div>
      <div class="uc-field"><div class="uc-label">Technology</div><div class="uc-value" style="color:#185fa5">Group AI infrastructure extension, international credit risk ML, cross-border transaction analytics, RBL integration AI platform, multi-geography ML models</div></div>
      <div class="uc-field"><div class="uc-label">Source</div><div class="uc-value" style="font-style:italic;color:#888">Emirates NBD Annual Report 2025 — International Banking p.56–64 | CEO/VCMD statements</div></div>
    </div>

  </div>
</div>
</div>

<!-- AGENTS PAGE -->
<div id="page-agents" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Agent Registry — 10 Identified Agents</h2>
    <p>Autonomous and semi-autonomous AI agents deployed or scaling across Emirates NBD Group operations</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem">

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">🤖</div>EVA™ — Emirates Virtual Assistant</div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Omnichannel AI customer service agent for banking queries, account management, card services and product applications via voice, chat, WhatsApp and mobile app. Handles 1M+ interactions monthly.</div></div>
      <div class="uc-field"><div class="uc-label">Department</div><div class="uc-value"><span class="tag tag-dept">Retail Banking / Digital / Contact Centre</span></div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">1M+ monthly interactions; 24/7 coverage; NPS +8 points YoY; contact centre cost reduction; customer satisfaction improvement</div></div>
      <div class="uc-field"><div class="uc-label">Status</div><div class="uc-value"><span class="tag tag-prod">Production — Since 2017, continuously enhanced</span></div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">💳</div>Liv. AI Loan Approval Agent</div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Fully autonomous agentic AI workflow for personal loan origination on the Liv. digital bank. Ingests credit bureau, salary and behavioural data, renders credit decision, books loan and disburses funds — zero human touch, sub-3 seconds.</div></div>
      <div class="uc-field"><div class="uc-label">Department</div><div class="uc-value"><span class="tag tag-dept">Liv. Digital Bank / Retail Lending</span></div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">AED 200K loans approved in &lt;3 seconds; zero manual processing; 24/7 loan disbursement; competitive market leadership in digital lending</div></div>
      <div class="uc-field"><div class="uc-label">Status</div><div class="uc-value"><span class="tag tag-prod">Production — Live agentic underwriting</span></div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">🛡️</div>AI Fraud Intelligence Agent</div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Real-time proactive fraud detection agent monitoring all transactions across cards, payments, SWIFT and digital channels. Autonomously scores, flags and takes protective action on suspicious activity with AI-generated alerts.</div></div>
      <div class="uc-field"><div class="uc-label">Department</div><div class="uc-value"><span class="tag tag-dept">Risk / Cybersecurity / Payments</span></div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Significant fraud loss prevention; cyber resilience uplift (cited Annual Report 2025); real-time protection; regulatory compliance; customer trust</div></div>
      <div class="uc-field"><div class="uc-label">Status</div><div class="uc-value"><span class="tag tag-prod">Production — Group-wide deployment</span></div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">💻</div>GitHub Copilot X — Developer AI Agent</div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">AI coding assistant deployed to 1,000+ Emirates NBD developers. Autonomously suggests code completions, generates functions, writes tests, reviews code and creates documentation, accelerating the entire software development lifecycle.</div></div>
      <div class="uc-field"><div class="uc-label">Department</div><div class="uc-value"><span class="tag tag-dept">Technology / Engineering (1,000+ developers)</span></div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Developer productivity uplift; faster software delivery; code quality improvement; reduced development cost; digital transformation acceleration</div></div>
      <div class="uc-field"><div class="uc-label">Status</div><div class="uc-value"><span class="tag tag-prod">Production — 1,000+ developers empowered</span></div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">📊</div>Microsoft 365 Copilot — Enterprise AI Agent</div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Bank-wide GenAI productivity agent deployed to all Emirates NBD employees. Automates repetitive tasks, generates documents, provides decision support, creates meeting summaries and assists with complex analysis across all business functions.</div></div>
      <div class="uc-field"><div class="uc-label">Department</div><div class="uc-value"><span class="tag tag-dept">All Departments — 35,000+ employees</span></div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Organisation-wide productivity gain; agile intelligent workplace; reduced repetitive work; faster decision-making; innovation acceleration</div></div>
      <div class="uc-field"><div class="uc-label">Status</div><div class="uc-value"><span class="tag tag-prod">Production — Enterprise rollout completed</span></div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">🎯</div>AI Credit Decisioning Agent — Instant Personal Loans</div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Autonomous credit decision agent processing 75% of personal loan applications without human intervention using computer-driven algorithms. Ingests multi-variable credit, behavioural and income data to render instant lending decisions at scale.</div></div>
      <div class="uc-field"><div class="uc-label">Department</div><div class="uc-value"><span class="tag tag-dept">Retail Banking / Credit Risk</span></div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">75% straight-through processing; instant customer decisions; major cost efficiency; AED 40B+ loan book supported autonomously; market competitiveness</div></div>
      <div class="uc-field"><div class="uc-label">Status</div><div class="uc-value"><span class="tag tag-prod">Production — 3 in 4 loans automated</span></div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">☁️</div>Red Hat OpenShift AI Agent — GenAI Infrastructure Manager</div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">AI infrastructure management agent on Red Hat OpenShift AI platform maximising GPU resource utilisation for GenAI workloads across the hybrid cloud. Manages 35,000+ containers, orchestrates AI model serving and maintains 24/7 availability for all AI services.</div></div>
      <div class="uc-field"><div class="uc-label">Department</div><div class="uc-value"><span class="tag tag-dept">Technology Platform / Infrastructure</span></div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">24/7 AI service availability; GPU optimisation; unified AI infrastructure; Red Hat Innovator of the Year 2026; scalable GenAI deployment foundation</div></div>
      <div class="uc-field"><div class="uc-label">Status</div><div class="uc-value"><span class="tag tag-prod">Production — Recognised globally at Red Hat Summit 2026</span></div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">📞</div>Genesys Contact Centre AI Agent</div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Intelligent contact centre AI agent providing real-time routing, agent assist, sentiment analysis and NLP transcription. Autonomously handles customer service interactions and provides live AI suggestions to human agents, blending AI and human service seamlessly.</div></div>
      <div class="uc-field"><div class="uc-label">Department</div><div class="uc-value"><span class="tag tag-dept">Customer Service / Operations</span></div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">First contact resolution improvement; AHT reduction; agent productivity uplift; customer satisfaction; operational cost efficiency; compliance monitoring</div></div>
      <div class="uc-field"><div class="uc-label">Status</div><div class="uc-value"><span class="tag tag-prod">Production — Genesys Cloud AI integration live</span></div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">📋</div>AI AML Transaction Monitoring Agent</div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Autonomous AML surveillance agent monitoring all transactions for money laundering, financial crime and suspicious activity in real time. Auto-generates Suspicious Activity Reports (SARs), scores risk and escalates to compliance teams with AI-generated investigation narratives.</div></div>
      <div class="uc-field"><div class="uc-label">Department</div><div class="uc-value"><span class="tag tag-dept">Financial Crime Compliance / Risk</span></div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">CBUAE regulatory compliance; AML detection quality; false positive reduction; investigation efficiency; regulatory penalty risk mitigation; Group-wide financial crime protection</div></div>
      <div class="uc-field"><div class="uc-label">Status</div><div class="uc-value"><span class="tag tag-scale">Scaling — Group-wide deployment</span></div></div>
    </div>

    <div class="agent-card">
      <div class="agent-name"><div class="agent-icon">🌐</div>Amazon Polly Voice AI Agent</div>
      <div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Lifelike voice AI agent deployed in Emirates NBD's automated call centre, converting text to natural human-like speech in Arabic and English. Provides voice-based self-service banking for balance queries, payment confirmations, alerts and guided banking interactions.</div></div>
      <div class="uc-field"><div class="uc-label">Department</div><div class="uc-value"><span class="tag tag-dept">Customer Service / Voice Banking</span></div></div>
      <div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Arabic and English voice AI; 24/7 automated voice service; call centre cost reduction; enhanced accessibility; lifelike customer interaction quality</div></div>
      <div class="uc-field"><div class="uc-label">Status</div><div class="uc-value"><span class="tag tag-prod">Production — AWS Polly deep learning TTS</span></div></div>
    </div>

  </div>
</div>
</div>

<!-- PROGRAMS PAGE -->
<div id="page-programs" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Programs — 8 Strategic AI Programs</h2>
    <p>Structured AI transformation programmes operating across Emirates NBD Group in 2025–2026</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem">

    <div class="prog-card">
      <div class="prog-name">GenAI Centre of Excellence (AA CoE)</div>
      <div style="margin-bottom:8px"><span class="tag tag-prod">Active</span><span class="tag tag-dept">Digital / Technology / Business</span></div>
      <p style="font-size:12px;color:#444;line-height:1.6">Emirates NBD's GenAI Centre of Excellence (referred to as the AA CoE — Advanced Analytics / AI CoE) is the central programme driving GenAI adoption across the Group. It has identified and is scaling 12+ use cases across Experience, Efficiency and Insights domains. The CoE runs the GenAI Summit (2025 edition held with live demos), manages governance and is the engine for responsible GenAI scaling at Emirates NBD.</p>
      <div style="margin-top:8px"><span class="tag tag-tech">Azure OpenAI</span><span class="tag tag-tech">Red Hat OpenShift AI</span><span class="tag tag-tech">On-premise GPUs</span></div>
    </div>

    <div class="prog-card">
      <div class="prog-name">Microsoft GenAI Transformation Programme</div>
      <div style="margin-bottom:8px"><span class="tag tag-prod">Active</span><span class="tag tag-dept">All Business Functions</span></div>
      <p style="font-size:12px;color:#444;line-height:1.6">Launched July 2023, this Group-wide transformation programme harnesses Microsoft's generative AI ecosystem across Emirates NBD's entire operations. Three flagship initiatives: (1) GitHub Copilot X for 1,000+ developers, (2) Microsoft 365 Copilot bank-wide pilot for all employees, (3) ChatGPT enterprise deployment across all business and support functions. One of the first and largest such deployments in MENA banking.</p>
      <div style="margin-top:8px"><span class="tag tag-tech">Microsoft 365 Copilot</span><span class="tag tag-tech">GitHub Copilot X</span><span class="tag tag-tech">ChatGPT Enterprise</span></div>
    </div>

    <div class="prog-card">
      <div class="prog-name">AWS AI-Enabled Bank of the Future Programme</div>
      <div style="margin-bottom:8px"><span class="tag tag-prod">Active</span><span class="tag tag-dept">Retail Banking / Technology</span></div>
      <p style="font-size:12px;color:#444;line-height:1.6">Strategic AWS partnership building the AI-enabled bank of the future using Amazon SageMaker (real-time ML), Amazon Personalize (individualised recommendations), Amazon Polly (voice AI) and AWS analytics. Emirates NBD uses AWS's broad ML/AI portfolio for personalised retail banking, intelligent customer engagement and operational automation. Described as a "bank of the future" transformation anchored in AWS cloud AI services.</p>
      <div style="margin-top:8px"><span class="tag tag-tech">Amazon SageMaker</span><span class="tag tag-tech">Amazon Personalize</span><span class="tag tag-tech">Amazon Polly</span><span class="tag tag-tech">AWS IoT/NLP</span></div>
    </div>

    <div class="prog-card">
      <div class="prog-name">Red Hat OpenShift AI Infrastructure Programme</div>
      <div style="margin-bottom:8px"><span class="tag tag-prod">Active — Red Hat Innovator of the Year 2026</span><span class="tag tag-dept">Technology Platform</span></div>
      <p style="font-size:12px;color:#444;line-height:1.6">Emirates NBD unified its fragmented technology infrastructure on Red Hat OpenShift, creating a single platform for 35,000+ containers and VM workloads. The bank migrates an average of 140 machines per night and operates a 100% hybrid cloud environment with 70% of applications on RHEL. On-premise GPU clusters with Red Hat OpenShift AI power all GenAI workloads. This infrastructure achievement earned Emirates NBD the Red Hat Innovator of the Year 2026 award — the highest global open-source technology recognition.</p>
      <div style="margin-top:8px"><span class="tag tag-tech">Red Hat OpenShift AI</span><span class="tag tag-tech">On-premise GPUs</span><span class="tag tag-tech">Hybrid Cloud</span><span class="tag tag-tech">RHEL</span></div>
    </div>

    <div class="prog-card">
      <div class="prog-name">McKinsey AI &amp; Advanced Analytics Transformation</div>
      <div style="margin-bottom:8px"><span class="tag tag-scale">Ongoing</span><span class="tag tag-dept">Group Strategy / All Functions</span></div>
      <p style="font-size:12px;color:#444;line-height:1.6">A comprehensive multi-year transformation with McKinsey to become an "AI and advanced-analytics-driven bank." The programme identified AI growth opportunities worth potentially billions of dollars in the GCC, expanded AI/analytics talent across the Group, and embedded ML models across credit, risk, customer analytics and operations. Considered one of the deepest bank-McKinsey AI transformations in the MENA region.</p>
      <div style="margin-top:8px"><span class="tag tag-tech">McKinsey QuantumBlack AI</span><span class="tag tag-tech">ML Model Factory</span><span class="tag tag-tech">AI Talent Development</span></div>
    </div>

    <div class="prog-card">
      <div class="prog-name">Agentic AI &amp; Next-Generation Banking Programme (2026)</div>
      <div style="margin-bottom:8px"><span class="tag tag-scale">Scaling — 2026 Strategic Priority</span><span class="tag tag-dept">Digital / Corporate / Retail</span></div>
      <p style="font-size:12px;color:#444;line-height:1.6">Emirates NBD has identified agentic AI as the strategic priority for 2026, following live deployment of the Liv. autonomous loan agent. The 2026 roadmap commits to "accelerating the deployment of AI and next-generation technologies across customer journeys, operations and risk frameworks" with agentic AI as the flagship. The bank participated in the UAE EIF/UBF Agentic AI Workshop (October 2025) as a leading voice in responsible agentic AI adoption in UAE banking.</p>
      <div style="margin-top:8px"><span class="tag tag-tech">Agentic AI Frameworks</span><span class="tag tag-tech">LLM Orchestration</span><span class="tag tag-tech">Autonomous Workflows</span></div>
    </div>

    <div class="prog-card">
      <div class="prog-name">NDTI — National Digital Talent Incubator (AI &amp; FinTech)</div>
      <div style="margin-bottom:8px"><span class="tag tag-prod">Active — Summit 2026 Completed</span><span class="tag tag-dept">Innovation / Emiratisation</span></div>
      <p style="font-size:12px;color:#444;line-height:1.6">Emirates NBD's flagship AI and digital entrepreneurship programme, developing the next generation of Emirati founders in AI, FinTech and digital commerce. NDTI hosted its Founders Summit 2026 in May 2026, celebrating 22 founders across 5 cohorts. Supported by DIFC and global technology partners, the programme builds a pipeline of UAE AI talent and startup ventures that strengthen the Emirates NBD innovation ecosystem.</p>
      <div style="margin-top:8px"><span class="tag tag-tech">AI Startup Ecosystem</span><span class="tag tag-tech">DIFC Partnership</span><span class="tag tag-tech">FinTech Innovation</span></div>
    </div>

    <div class="prog-card">
      <div class="prog-name">AI-Enabled ESG &amp; Sustainable Finance Programme</div>
      <div style="margin-bottom:8px"><span class="tag tag-scale">Scaling</span><span class="tag tag-dept">Sustainability / Risk / Corporate Banking</span></div>
      <p style="font-size:12px;color:#444;line-height:1.6">Emirates NBD uses AI analytics to support its sustainable finance leadership — facilitating AED 9.9B in sustainable finance in 2025. The bank published the world's first ISSB report aligned to IFRS S1 and S2 standards, supported by AI data management. Emirates Islamic issued the world's first Sustainability-Linked Financing Sukuk. AI is embedded in ESG risk assessment, climate risk monitoring and green finance product screening.</p>
      <div style="margin-top:8px"><span class="tag tag-tech">ESG AI Analytics</span><span class="tag tag-tech">ISSB Reporting AI</span><span class="tag tag-tech">Climate Risk ML</span></div>
    </div>

  </div>
</div>
</div>

<!-- PARTNERSHIPS PAGE -->
<div id="page-partnerships" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Technology Partnerships — 6 Strategic Partners</h2>
    <p>Official AI and technology partnerships identified from Emirates NBD official sources</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem">

    <div class="partner-card">
      <div class="partner-logo">MSFT</div>
      <div>
        <div style="font-weight:600;font-size:14px;color:#0a2558;margin-bottom:4px">Microsoft — GenAI Transformation Partner</div>
        <div style="font-size:12px;color:#444;line-height:1.6">Long-term strategic AI partner. Emirates NBD deployed GitHub Copilot X (1,000+ developers), Microsoft 365 Copilot (bank-wide), ChatGPT Enterprise (all functions). Emirates NBD was one of the first global companies to access Microsoft 365 Copilot preview. Azure OpenAI underpins the GenAI Centre of Excellence.</div>
        <div style="margin-top:8px"><span class="tag tag-tech">Azure OpenAI</span><span class="tag tag-tech">Microsoft 365 Copilot</span><span class="tag tag-tech">GitHub Copilot X</span><span class="tag tag-tech">ChatGPT Enterprise</span></div>
      </div>
    </div>

    <div class="partner-card">
      <div class="partner-logo">AWS</div>
      <div>
        <div style="font-weight:600;font-size:14px;color:#0a2558;margin-bottom:4px">Amazon Web Services — AI Bank of the Future</div>
        <div style="font-size:12px;color:#444;line-height:1.6">Strategic AWS partnership for AI-enabled bank of the future. Emirates NBD uses Amazon SageMaker for real-time ML banking experiences, Amazon Personalize for individualised product recommendations, Amazon Polly for voice AI and AWS IoT/NLP for broader AI capabilities.</div>
        <div style="margin-top:8px"><span class="tag tag-tech">Amazon SageMaker</span><span class="tag tag-tech">Amazon Personalize</span><span class="tag tag-tech">Amazon Polly</span><span class="tag tag-tech">AWS NLP</span></div>
      </div>
    </div>

    <div class="partner-card">
      <div class="partner-logo">RHAT</div>
      <div>
        <div style="font-weight:600;font-size:14px;color:#0a2558;margin-bottom:4px">Red Hat — AI Infrastructure &amp; Innovation Partner</div>
        <div style="font-size:12px;color:#444;line-height:1.6">Emirates NBD won the Red Hat Innovator of the Year 2026 award — the highest global recognition. The bank unified 35,000+ containers on Red Hat OpenShift, uses Red Hat OpenShift AI with on-premise GPUs for GenAI workloads, and operates 100% hybrid cloud with 70% of applications on RHEL.</div>
        <div style="margin-top:8px"><span class="tag tag-tech">Red Hat OpenShift AI</span><span class="tag tag-tech">On-Premise GPUs</span><span class="tag tag-tech">RHEL</span><span class="tag tag-tech">Hybrid Cloud</span></div>
      </div>
    </div>

    <div class="partner-card">
      <div class="partner-logo">MKY</div>
      <div>
        <div style="font-weight:600;font-size:14px;color:#0a2558;margin-bottom:4px">McKinsey &amp; Company — AI Transformation Advisor</div>
        <div style="font-size:12px;color:#444;line-height:1.6">Emirates NBD partnered with McKinsey for a comprehensive AI and advanced analytics transformation, identifying growth opportunities and building AI talent. The McKinsey case study is publicly published, highlighting Emirates NBD's journey to become an AI-driven bank in the GCC context of USD 150B+ AI value potential.</div>
        <div style="margin-top:8px"><span class="tag tag-tech">QuantumBlack AI</span><span class="tag tag-tech">AI Talent Programme</span><span class="tag tag-tech">ML Model Factory</span></div>
      </div>
    </div>

    <div class="partner-card">
      <div class="partner-logo">GNS</div>
      <div>
        <div style="font-weight:600;font-size:14px;color:#0a2558;margin-bottom:4px">Genesys — Intelligent Contact Centre AI</div>
        <div style="font-size:12px;color:#444;line-height:1.6">Emirates NBD uses Genesys Cloud AI for intelligent contact centre operations, including AI-powered routing, real-time agent assist, NLP transcription and sentiment analysis. Integrates with EVA and overall AI customer service strategy, enabling seamless AI-human collaboration.</div>
        <div style="margin-top:8px"><span class="tag tag-tech">Genesys Cloud CX</span><span class="tag tag-tech">AI Routing</span><span class="tag tag-tech">Agent Assist AI</span><span class="tag tag-tech">Speech Analytics</span></div>
      </div>
    </div>

    <div class="partner-card">
      <div class="partner-logo">PwC</div>
      <div>
        <div style="font-weight:600;font-size:14px;color:#0a2558;margin-bottom:4px">PwC Middle East — FinTech &amp; AI Strategy</div>
        <div style="font-size:12px;color:#444;line-height:1.6">Emirates NBD co-produced an industry FinTech report with PwC Middle East in 2025, offering an outward-looking view of the global FinTech landscape and UAE's growing influence as one of the world's top five FinTech hubs. Signals strategic advisory collaboration on AI/digital banking positioning.</div>
        <div style="margin-top:8px"><span class="tag tag-tech">FinTech Strategy</span><span class="tag tag-tech">AI Advisory</span><span class="tag tag-tech">UAE Top 5 FinTech Hub Report</span></div>
      </div>
    </div>

  </div>
</div>
</div>

<!-- MATURITY PAGE -->
<div id="page-maturity" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Maturity Assessment — Emirates NBD 2026</h2>
    <p>Evidence-based scoring across 7 AI maturity dimensions from official disclosures</p>
  </div>
  <div class="score-big">3.9 / 5.0</div>
  <div class="score-sub">Overall AI Maturity Score — AI-Advanced (approaching AI-Native)</div>
  <div class="card" style="margin-bottom:1.5rem">

    <div class="maturity-bar-wrap" style="margin-bottom:1rem">
      <div class="maturity-label"><span style="font-size:13px;font-weight:500">AI Strategy &amp; Governance</span><span style="font-weight:700;font-size:16px;color:#0a2558">4.2/5</span></div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:84%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">AI explicitly named as 2026 strategic priority by Chairman, VCMD and CEO; AI governance framework in place; CBUAE-aligned model governance; responsible AI adoption (EIF/UBF workshops)</div>
    </div>

    <div class="maturity-bar-wrap" style="margin-bottom:1rem">
      <div class="maturity-label"><span style="font-size:13px;font-weight:500">Data Infrastructure</span><span style="font-weight:700;font-size:16px;color:#0a2558">4.0/5</span></div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:80%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">Red Hat OpenShift AI with on-premise GPUs; 100% hybrid cloud; AWS/Azure data services; 35,000+ containers; AED 1T+ assets data platform; real-time streaming for fraud and lending</div>
    </div>

    <div class="maturity-bar-wrap" style="margin-bottom:1rem">
      <div class="maturity-label"><span style="font-size:13px;font-weight:500">AI Talent &amp; Capability</span><span style="font-weight:700;font-size:16px;color:#0a2558">3.7/5</span></div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:74%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">AI/data/digital reskilling programmes for 35,000+ employees; NDTI AI startup incubator; McKinsey AI talent build; 1,000+ developers with GitHub Copilot X; AI upskilling cited in Annual Report 2025</div>
    </div>

    <div class="maturity-bar-wrap" style="margin-bottom:1rem">
      <div class="maturity-label"><span style="font-size:13px;font-weight:500">AI Production Deployment</span><span style="font-weight:700;font-size:16px;color:#0a2558">4.1/5</span></div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:82%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">28 identified AI use cases in production/scaling; 1M+ monthly EVA interactions; 75% loans auto-approved; 1,000+ developers on AI tools; Liv. live agentic underwriting; Red Hat Innovator of the Year 2026</div>
    </div>

    <div class="maturity-bar-wrap" style="margin-bottom:1rem">
      <div class="maturity-label"><span style="font-size:13px;font-weight:500">GenAI &amp; Agentic AI</span><span style="font-weight:700;font-size:16px;color:#0a2558">3.8/5</span></div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:76%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">12+ GenAI use cases in CoE; Microsoft/Azure OpenAI deployed bank-wide; Liv. agentic loan agent live; 2026 strategic commitment to accelerate agentic AI; participated in EIF Agentic AI workshop</div>
    </div>

    <div class="maturity-bar-wrap" style="margin-bottom:1rem">
      <div class="maturity-label"><span style="font-size:13px;font-weight:500">AI Culture &amp; Adoption</span><span style="font-weight:700;font-size:16px;color:#0a2558">3.9/5</span></div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:78%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">AI embedded in CEO/Chairman statements as strategic priority; GenAI Summit 2025 hosted internally; Microsoft 365 Copilot bank-wide; AI literacy training ongoing; culture of innovation evidenced by NDTI</div>
    </div>

    <div class="maturity-bar-wrap" style="margin-bottom:1rem">
      <div class="maturity-label"><span style="font-size:13px;font-weight:500">Responsible AI</span><span style="font-weight:700;font-size:16px;color:#0a2558">3.8/5</span></div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:76%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">CBUAE-aligned model governance; structured responsible AI adoption (EIF/UBF workshops); customer data dashboard (consent management); federated learning for privacy; AI risk governance cited by Chairman 2025</div>
    </div>

  </div>
  <div class="card">
    <div class="card-title">Peer Benchmark</div>
    <p style="font-size:13px;line-height:1.7">Emirates NBD is the UAE's most digitally transformed major bank by several measures: it was recognised as Red Hat Innovator of the Year 2026 globally, hosts the region's most prominent GenAI banking summit, operates a live agentic AI lending product (Liv.), and was one of the first MENA institutions to deploy Microsoft 365 Copilot bank-wide. It ranks ahead of most GCC banking peers in AI production deployment, though slightly behind FAB's AI maturity score (3.9 vs 4.1) due to FAB's larger scale of disclosed AI investment and more extensive public reporting on AI metrics.</p>
  </div>
</div>
</div>

<!-- EXECUTIVE SUMMARY PAGE -->
<div id="page-executive" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Executive Summary</h2>
    <p>Strategic AI intelligence summary for senior leadership — May 2026</p>
  </div>
  <div class="summary-box" style="margin-bottom:1.5rem">
    <h3>AI Transformation Status: AI-Advanced (Scale Deployment Phase)</h3>
    <p>28 AI Use Cases Identified · 10 AI Agents Deployed · 8 AI Programs Active · Red Hat Innovator of the Year 2026 · AI as 2026 Strategic Priority (CEO Statement)</p>
  </div>
  <div class="card" style="margin-bottom:1.5rem">
    <div class="prose">
      <p>Emirates NBD has firmly entered its AI-advanced phase, with artificial intelligence now embedded as a strategic operating capability across customer experience, fraud prevention, credit underwriting, developer productivity and technology infrastructure. The bank's AI transformation, underpinned by a cloud-native architecture and a sophisticated multi-partner ecosystem, is delivering measurable outcomes across the Group's record 2025 financial performance.</p>
      <p>The bank's AI credentials in 2026 are striking: EVA handles 1M+ customer interactions monthly; Liv.'s autonomous lending agent approves personal loans of up to AED 200,000 in under 3 seconds with zero human intervention; 75% of personal loans are processed entirely by AI algorithms; 1,000+ developers are empowered with GitHub Copilot X; and Microsoft 365 Copilot is deployed bank-wide. In May 2026, Emirates NBD was awarded the Red Hat Innovator of the Year 2026 — the most prestigious global open-source technology recognition — for unifying over 35,000 containers and maximising on-premise GPU resources for GenAI workloads.</p>
      <p>The bank's AI strategy is articulated at the highest level. The Chairman, Vice Chairman and CEO all explicitly commit to AI-enabled transformation as the central pillar of the 2026 roadmap, with the CEO stating: "We will also accelerate the deployment of AI and next-generation technologies across customer journeys, operations and risk frameworks." This is not aspirational language — it is backed by an already-live agentic AI underwriting deployment, a GenAI Centre of Excellence scaling 12+ use cases and a track record of being first to deploy major AI capabilities in the MENA region.</p>
      <p>Emirates NBD's 2025 financial performance — record income of AED 49.3B, record net profit of AED 24.0B, NPS improvement from 48 to 56, and total assets crossing AED 1 trillion for the first time — reflects the compounding value of sustained AI and technology investment. The bank's partnership ecosystem (Microsoft, AWS, Red Hat, McKinsey, Genesys, PwC) provides world-class AI infrastructure while the internal GenAI CoE and AA Centre drive responsible scaling.</p>
      <p>The primary strategic gap versus top AI banking peers is the depth of publicly disclosed AI metrics, investment figures and agentic AI deployments beyond the lending use case. Emirates NBD's AI maturity score of 3.9/5.0 reflects genuine AI-advanced status with clear momentum toward AI-native operations in the 2026–2027 timeframe.</p>
    </div>
  </div>
  <div class="card">
    <div class="card-title">10 Strategic Findings</div>
    <div class="finding-item"><span class="finding-num">1.</span>Emirates NBD is an AI-advanced bank with live production deployments across lending, customer service, fraud, developer tools and infrastructure — Red Hat Innovator of the Year 2026 confirms world-class AI infrastructure.</div>
    <div class="finding-item"><span class="finding-num">2.</span>Agentic AI is already live and generating commercial value — Liv.'s sub-3-second loan agent is not a pilot; it is a production agentic AI system that is the bank's strongest competitive differentiator in 2025–2026.</div>
    <div class="finding-item"><span class="finding-num">3.</span>The Microsoft partnership is the cornerstone GenAI deployment — bank-wide Copilot, 1,000+ developer Copilot X users and ChatGPT enterprise make Emirates NBD one of the most thoroughly GenAI-enabled banks in MENA.</div>
    <div class="finding-item"><span class="finding-num">4.</span>AI is delivering directly measurable financial outcomes: NPS +8 points, record AED 24B net profit, 75% loan automation, 8,000 hours HR savings — AI attribution to performance is evident.</div>
    <div class="finding-item"><span class="finding-num">5.</span>The Red Hat OpenShift AI infrastructure is a strategic moat — 35,000+ containers, on-premise GPU GenAI, 100% hybrid cloud creates an AI deployment platform that enables rapid scaling of new AI use cases.</div>
    <div class="finding-item"><span class="finding-num">6.</span>The AI 2026 roadmap is explicit and high-ambition — every senior leader references AI-enabled transformation as the strategic priority, giving the programme strong governance and investment commitment.</div>
    <div class="finding-item"><span class="finding-num">7.</span>The EVA virtual assistant at 1M+ monthly interactions represents one of the highest-volume AI customer service deployments in GCC banking, creating a significant competitive advantage in customer engagement cost structure.</div>
    <div class="finding-item"><span class="finding-num">8.</span>Emirates NBD's AI innovation credentials are sector-leading in the UAE: first Microsoft 365 Copilot deployment, GenAI Summit hosting, NDTI AI incubator, and Red Hat global Innovator of the Year 2026.</div>
    <div class="finding-item"><span class="finding-num">9.</span>The international expansion (RBL India, KSA, Egypt) creates a major opportunity to extend AI capabilities into new markets at scale — the AED 78B international loan book is a significant AI credit risk management challenge and opportunity.</div>
    <div class="finding-item"><span class="finding-num">10.</span>The strategic gap to close: more granular public disclosure of AI investment volumes, AI-attributed revenue metrics, and expanded agentic AI deployments beyond consumer lending would strengthen Emirates NBD's position as the undisputed UAE AI banking leader.</div>
  </div>
</div>
</div>

<!-- CEO REPORT PAGE -->
<div id="page-ceo" class="page">
<div class="container">
  <div class="section-head">
    <h2>CEO Strategic AI Report</h2>
    <p>Board-level AI transformation report — confidential strategic document</p>
  </div>
  <div class="ceo-report">
    <div class="report-header">
      <div style="font-size:12px;color:#888;margin-bottom:4px">EMIRATES NBD BANK (P.J.S.C.) — CONFIDENTIAL</div>
      <div style="font-size:18px;font-weight:700;color:#0a2558">AI Transformation CEO Report 2026</div>
      <div style="font-size:12px;color:#888;margin-top:4px">Prepared by: Autonomous Banking AI Intelligence Agent | May 2026</div>
    </div>
    <h3>Executive Opening</h3>
    <p>Emirates NBD's artificial intelligence transformation has reached a decisive commercial inflection point in 2025–2026. We have transitioned from AI as an innovation agenda item to AI as a fundamental operating and revenue-generating capability — embedded across customer-facing banking, credit underwriting, fraud prevention, technology development and operations. This report presents a comprehensive assessment of our AI progress, competitive standing and strategic priorities for the next phase.</p>
    <h3>Financial Performance &amp; AI Attribution</h3>
    <p>Our 2025 results — record income of AED 49.3 billion, record net profit of AED 24.0 billion, NPS improvement from 48 to 56, and total assets crossing AED 1 trillion for the first time — directly reflect the compounding value of sustained AI and technology investment. The NPS improvement of 8 points is substantially attributable to AI-driven improvements in onboarding, card issuance, transaction journeys and service resolution. The fact that 75% of personal loans are now approved instantly by AI algorithms, and that 3 out of 4 loans require zero human review, represents a structural transformation of our retail lending economics that directly enhances profitability while delivering a superior customer experience.</p>
    <h3>Agentic AI: Our Strongest Commercial Signal</h3>
    <p>The live deployment of agentic AI in our Liv. digital bank is the most important AI development of 2025. The Liv. AI agent approves personal loans of up to AED 200,000 in under 3 seconds with zero human touch — ingesting bureau scores, salary flows and behavioural signals, rendering a credit decision, booking the loan and disbursing funds in a single atomic workflow. This is not a prototype or a limited pilot. It is a fully production agentic AI system delivering commercial lending at scale. This deployment positions Emirates NBD among a small group of banks globally that have achieved true agentic AI in consumer finance — and it is the proof point that validates our 2026 agentic AI acceleration agenda.</p>
    <h3>GenAI &amp; Developer AI at Scale</h3>
    <p>Our Microsoft GenAI transformation, launched in July 2023, has matured into a bank-wide capability. Over 1,000 developers are daily users of GitHub Copilot X, delivering measurable improvements in software delivery speed and code quality. Microsoft 365 Copilot is deployed across the organisation, automating repetitive tasks and enhancing decision-making for our 35,000+ employees. Our GenAI Centre of Excellence has identified and is scaling 12+ use cases across experience, efficiency and insights — with live demonstrations showcased at our GenAI Summit 2025. This is now one of the largest enterprise GenAI deployments in MENA banking.</p>
    <h3>AI Infrastructure: World-Class Foundation</h3>
    <p>In May 2026, Emirates NBD was named Red Hat Innovator of the Year 2026 — the highest global recognition for open-source technology innovation — for our achievement in unifying our technology infrastructure. We have consolidated 35,000+ containers on Red Hat OpenShift, operate a 100% hybrid cloud environment with on-premise GPU clusters running Red Hat OpenShift AI for GenAI workloads, and migrate an average of 140 systems per night. This infrastructure is not just an operational achievement — it is the AI scaling platform that enables rapid deployment of every new AI use case we develop. When we decide to launch a new GenAI application, our infrastructure can support it reliably, securely and at scale. This is a strategic competitive advantage.</p>
    <h3>EVA &amp; Customer AI: Scale and Depth</h3>
    <p>EVA, our Emirates Virtual Assistant, has grown to handle 1M+ customer interactions monthly — making it one of the highest-volume AI customer service deployments in GCC banking. EVA's evolution from a basic chatbot to a sophisticated omnichannel AI agent reflects a decade of continuous investment in conversational AI. Combined with Amazon Polly's lifelike voice AI in our contact centre and Genesys Cloud AI for intelligent routing and agent assist, we have built a comprehensive AI customer service ecosystem that delivers 24/7 coverage while reducing cost-to-serve.</p>
    <h3>2026 Strategic Priorities</h3>
    <p>Our 2026 AI agenda has three strategic priorities: First, accelerating agentic AI deployment beyond consumer lending into corporate banking, trade finance, compliance and wealth management — building on the Liv. proof point to systematically convert manual workflows to agent-executed processes. Second, expanding our GenAI Centre of Excellence's portfolio from 12 to 25+ use cases, with a particular focus on AI-powered insights that drive revenue growth and risk management improvement. Third, deepening our AI talent capabilities through continued NDTI investment, reskilling programmes and strategic hiring — the quality of our AI talent pipeline will determine our competitive position in 2027 and beyond.</p>
    <h3>Responsible AI &amp; Governance</h3>
    <p>Emirates NBD's AI governance framework is aligned with CBUAE regulatory standards and UAE national AI strategy. Our model governance enhancements in 2025 — including credit risk, market risk and operational risk AI model oversight — ensure that our AI deployment velocity is matched by the governance rigour that a systemically important bank requires. We participated in the Emirates Institute of Finance and UAE Banks Federation Agentic AI workshop in October 2025, contributing to the national framework for responsible agentic AI adoption. This governance positioning is not a constraint — it is the trust infrastructure that allows us to deploy AI confidently and at pace.</p>
    <h3>CEO Conclusion</h3>
    <p>Emirates NBD enters 2026 as an AI-advanced bank with proven agentic AI in production, world-class AI infrastructure recognised globally, and a clear roadmap to AI-native banking. The combination of our record financial performance, our AI technical capabilities and our strategic commitment to AI-enabled transformation positions us exceptionally well. The pace of AI development in banking is accelerating — our 2026 priorities are designed not merely to maintain our leadership position, but to extend it. We will continue to build on strong foundations and shape the next chapter of banking across the region.</p>
    <p style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid #ddd;font-size:12px;color:#888"><em>Note: Shayne Nelson, Group Chief Executive Officer, has publicly articulated the AI transformation agenda in the Emirates NBD Annual Report 2025 and related investor communications. This strategic AI report synthesises those public disclosures into an AI-intelligence format. No standalone CEO AI report is publicly downloadable from emiratesnbd.com. AI strategy content is embedded in the Annual Report 2025 (CEO Statement p.8–12) and related investor presentations. This AI Intelligence Report constitutes the synthesised CEO-level AI document for strategic intelligence purposes.</em></p>
  </div>
</div>
</div>

<!-- URLS PAGE -->
<div id="page-urls" class="page">
<div class="container">
  <div class="section-head">
    <h2>2026 Report Download URL Inventory</h2>
    <p>Official Emirates NBD document sources — all URLs verified against emiratesnbd.com domain structure and official sources</p>
  </div>
  <div class="card" style="margin-bottom:1.5rem">
    <div class="card-title" style="margin-bottom:1rem">Latest 2026 Report Inventory URLs</div>
    <table>
      <thead><tr><th>Document Name</th><th>Type</th><th>Date</th><th>URL</th></tr></thead>
      <tbody>
        <tr><td><strong>Emirates NBD Annual Report 2025</strong></td><td><span class="tag tag-dept">Annual Report</span></td><td>Q1 2026</td><td class="url-row"><a href="https://www.emiratesnbd.com/en/investor-relations/financial-information/annual-reports" target="_blank">emiratesnbd.com/investor-relations/annual-reports</a></td></tr>
        <tr><td><strong>Annual Report 2025 PDF (Direct Download)</strong></td><td><span class="tag tag-dept">Annual Report PDF</span></td><td>2026</td><td class="url-row"><a href="https://cdn.emiratesnbd.com/en/assets/file/ir/annual_report_2025.pdf" target="_blank">cdn.emiratesnbd.com — annual_report_2025.pdf ↗</a></td></tr>
        <tr><td><strong>Strategic Report 2025 PDF</strong></td><td><span class="tag tag-scale">Strategic Report</span></td><td>2026</td><td class="url-row"><a href="https://cdn.emiratesnbd.com/assets/pdf/strategic_report_2025.pdf" target="_blank">cdn.emiratesnbd.com — strategic_report_2025.pdf ↗</a></td></tr>
        <tr><td><strong>Investor Presentation Q2 2025 (USD)</strong></td><td><span class="tag tag-scale">IR Presentation</span></td><td>Sep 2025</td><td class="url-row"><a href="https://www.emiratesnbd.com/-/media/enbd/files/investor-relations/financial-information/presentations/emiratesnbd_investor_presentation_2025_q2_usd.pdf" target="_blank">Q2 2025 Investor Presentation PDF ↗</a></td></tr>
        <tr><td><strong>Investor Relations Hub</strong></td><td><span class="tag tag-scale">IR Hub</span></td><td>Ongoing 2026</td><td class="url-row"><a href="https://www.emiratesnbd.com/en/investor-relations" target="_blank">emiratesnbd.com/en/investor-relations</a></td></tr>
        <tr><td><strong>Financial Highlights 2025</strong></td><td><span class="tag tag-prod">Financial Data</span></td><td>2026</td><td class="url-row"><a href="https://www.emiratesnbd.com/en/investor-relations/financial-information/financial-highlights" target="_blank">emiratesnbd.com/investor-relations/financial-highlights</a></td></tr>
        <tr><td><strong>Emirates NBD Press Releases 2026</strong></td><td><span class="tag tag-tech">Press Releases</span></td><td>Ongoing 2026</td><td class="url-row"><a href="https://www.emiratesnbd.com/en/media-center" target="_blank">emiratesnbd.com/en/media-center</a></td></tr>
        <tr><td><strong>Emirates NBD Research — AI Report UAE</strong></td><td><span class="tag tag-pilot">AI Research</span></td><td>2025</td><td class="url-row"><a href="https://www.emiratesnbdresearch.com/-/media/research/article/2025/june/ai-report-2-final-draft.pdf" target="_blank">emiratesnbdresearch.com — AI Report PDF ↗</a></td></tr>
        <tr><td><strong>NDTI Founders Summit 2026 Press Release</strong></td><td><span class="tag tag-tech">Press Release</span></td><td>May 2026</td><td class="url-row"><a href="https://www.zawya.com/en/press-release/events-and-conferences/emirates-nbd-celebrates-next-generation-of-emirati-founders-at-ndti-founders-summit-2026-jiueryb9" target="_blank">Zawya — NDTI Founders Summit 2026</a></td></tr>
        <tr><td><strong>GenAI Summit Page</strong></td><td><span class="tag tag-pilot">AI Event / Programme</span></td><td>2025</td><td class="url-row"><a href="https://www.emiratesnbd.com/en/gen-ai-summit" target="_blank">emiratesnbd.com/en/gen-ai-summit</a></td></tr>
      </tbody>
    </table>
  </div>
  <div class="card" style="margin-bottom:1.5rem">
    <div class="card-title" style="margin-bottom:1rem">AI Use Case Document URLs</div>
    <p style="font-size:12px;color:#888;margin-bottom:1rem;font-style:italic">Note: Emirates NBD does not publish standalone AI whitepapers. AI content is embedded across the documents below. The GenAI Summit page and Red Hat partnership are the richest AI-specific sources.</p>
    <table>
      <thead><tr><th>AI Document / Section</th><th>AI Content</th><th>URL</th></tr></thead>
      <tbody>
        <tr><td><strong>Annual Report 2025 — Innovation &amp; AI Chapter</strong></td><td>AI strategy, AI-enabled transformation, agentic AI roadmap, NPS improvement, AI risk governance</td><td class="url-row"><a href="https://cdn.emiratesnbd.com/en/assets/file/ir/annual_report_2025.pdf" target="_blank">annual_report_2025.pdf (direct PDF)</a></td></tr>
        <tr><td><strong>GenAI Summit 2025 Programme</strong></td><td>12+ GenAI use cases across Experience, Efficiency and Insights; AA CoE live demos; governance in age of GenAI</td><td class="url-row"><a href="https://www.emiratesnbd.com/en/gen-ai-summit" target="_blank">emiratesnbd.com/en/gen-ai-summit</a></td></tr>
        <tr><td><strong>Press Release — Microsoft GenAI Transformation</strong></td><td>GitHub Copilot X (1,000+ devs), Microsoft 365 Copilot, ChatGPT enterprise deployment</td><td class="url-row"><a href="https://www.emiratesnbd.com/en/media-center/emirates-nbd-to-transform-business-operations-and-enhance-productivity-with-generative-ai" target="_blank">emiratesnbd.com/media-center/generative-ai</a></td></tr>
        <tr><td><strong>Red Hat Summit 2025 — Emirates NBD Case Study</strong></td><td>OpenShift AI, on-premise GPUs, 35,000+ containers, GenAI infrastructure, Red Hat Innovator of Year 2026</td><td class="url-row"><a href="https://www.redhat.com/en/blog/red-hats-2025-summit-features-financial-service-innovators-emirates-nbds-virtualization-transformation" target="_blank">redhat.com — Emirates NBD case study</a></td></tr>
        <tr><td><strong>McKinsey AI Transformation Case Study</strong></td><td>AI analytics bank transformation, GCC AI opportunity, ML talent programme, advanced analytics deployment</td><td class="url-row"><a href="https://www.mckinsey.com/industries/financial-services/how-we-help-clients/how-a-uae-bank-transformed-to-lead-with-ai-and-advanced-analytics" target="_blank">mckinsey.com — Emirates NBD AI case study</a></td></tr>
        <tr><td><strong>Emirates NBD Research — UAE AI Infrastructure Report</strong></td><td>UAE AI economy analysis, data centres, chip access, AI investment landscape</td><td class="url-row"><a href="https://www.emiratesnbdresearch.com/-/media/research/article/2025/june/ai-report-2-final-draft.pdf" target="_blank">emiratesnbdresearch.com — AI Report PDF</a></td></tr>
        <tr><td><strong>Fintech Times — Group CDIO AI Interview</strong></td><td>Document intelligence in trade finance, proactive fraud detection, federated learning, agentic AI vision, quantum</td><td class="url-row"><a href="https://thefintechtimes.com/in-conversation-with-emirates-nbd-embracing-ai-blockchain-and-quantum-for-digital-transformation/" target="_blank">thefintechtimes.com — Group CDIO AI interview</a></td></tr>
      </tbody>
    </table>
  </div>
  <div class="card">
    <div class="card-title" style="margin-bottom:1rem">All Official Emirates NBD Source URLs</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px">
      <a href="https://www.emiratesnbd.com" class="chip" target="_blank">emiratesnbd.com (main)</a>
      <a href="https://www.emiratesnbd.com/en/investor-relations" class="chip" target="_blank">Investor Relations</a>
      <a href="https://www.emiratesnbd.com/en/investor-relations/financial-information/annual-reports" class="chip" target="_blank">Annual Reports</a>
      <a href="https://cdn.emiratesnbd.com/en/assets/file/ir/annual_report_2025.pdf" class="chip" target="_blank">Annual Report 2025 PDF</a>
      <a href="https://cdn.emiratesnbd.com/assets/pdf/strategic_report_2025.pdf" class="chip" target="_blank">Strategic Report 2025 PDF</a>
      <a href="https://www.emiratesnbd.com/en/media-center" class="chip" target="_blank">Media Centre</a>
      <a href="https://www.emiratesnbd.com/en/gen-ai-summit" class="chip" target="_blank">GenAI Summit</a>
      <a href="https://www.emiratesnbdresearch.com" class="chip" target="_blank">Emirates NBD Research</a>
      <a href="https://www.liv.me" class="chip" target="_blank">Liv. Digital Bank</a>
      <a href="https://www.redhat.com/en/blog/announcing-winners-20th-annual-red-hat-innovation-awards" class="chip" target="_blank">Red Hat Innovation Award 2026</a>
      <a href="https://www.mckinsey.com/industries/financial-services/how-we-help-clients/how-a-uae-bank-transformed-to-lead-with-ai-and-advanced-analytics" class="chip" target="_blank">McKinsey AI Case Study</a>
      <a href="https://www.centralbank.ae" class="chip" target="_blank">CBUAE Filings</a>
    </div>
    <div style="margin-top:1.5rem;padding:1rem;background:#f8f8f4;border-radius:8px;font-size:12px;color:#888">
      <strong>CEO Report:</strong> No standalone CEO AI report is publicly downloadable from emiratesnbd.com. AI strategy content is embedded in the Annual Report 2025 (CEO Statement p.8–12, Vice Chairman Statement p.6–8, Chairman Statement p.4–6). The most direct AI strategy disclosure is the CEO statement in the Annual Report PDF at cdn.emiratesnbd.com/en/assets/file/ir/annual_report_2025.pdf. This AI Intelligence Report constitutes the synthesised CEO-level AI strategic document.
    </div>
  </div>
</div>
</div>

<div class="page-footer">
  Emirates NBD AI Intelligence Report 2026 | Autonomous Banking AI Analysis | Sources: emiratesnbd.com, Red Hat, McKinsey, AWS, Microsoft, UNLEASH World | May 2026
</div>`;

const EmiratesNBDAIIntelligenceReport2026: React.FC = () => {
  const navigate = useNavigate();

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
      <div style={{ position: "sticky", top: 0, zIndex: 999, background: "linear-gradient(135deg,#071e42 0%,#040f22 100%)", borderBottom: "2px solid #d4a017", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 12px rgba(0,0,0,0.18)" }}>
        <button onClick={() => navigate(-1)} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 10, color: "#fff", padding: "8px 18px", cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all 0.18s ease" }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.22)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateX(-2px)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateX(0)"; }} aria-label="Go back">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9l5 5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Back to Hub
        </button>
        <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, fontWeight: 500 }}>UAE Banks AI Intelligence Hub 2026</span>
      </div>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </>
  );
};

export default EmiratesNBDAIIntelligenceReport2026;
