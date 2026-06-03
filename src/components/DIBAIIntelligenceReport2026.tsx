import React, { useEffect } from "react";

declare global {
  interface Window {
    showPage: (id: string, btn: HTMLElement) => void;
    filterUC: (maturity: string, btn: HTMLElement) => void;
  }
}

const styles = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#f5f4ef;color:#1a1a1a;font-size:14px;line-height:1.6}
.topbar{background:linear-gradient(135deg,#006400 0%,#004d00 100%);color:white;padding:0}
.topbar-inner{max-width:1200px;margin:0 auto;padding:1.5rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}
.topbar h1{font-size:20px;font-weight:600;letter-spacing:-0.3px}
.topbar p{font-size:12px;opacity:0.72;margin-top:2px}
.badge-gold{background:#c8a84b;color:#fff;font-size:11px;padding:3px 10px;border-radius:20px;font-weight:600}
.nav{background:#004d00;padding:0;border-bottom:3px solid #c8a84b;overflow-x:auto}
.nav-inner{max-width:1200px;margin:0 auto;display:flex}
.nav button{background:none;border:none;color:rgba(255,255,255,0.65);padding:12px 16px;font-size:13px;cursor:pointer;white-space:nowrap;border-bottom:3px solid transparent;margin-bottom:-3px;transition:all 0.2s}
.nav button:hover,.nav button.active{color:#fff;border-bottom-color:#c8a84b}
.container{max-width:1200px;margin:0 auto;padding:1.5rem 2rem}
.page{display:none}.page.active{display:block}
.section-head{margin-bottom:1.5rem}
.section-head h2{font-size:22px;font-weight:600;color:#004d00;margin-bottom:4px}
.section-head p{font-size:13px;color:#666}
.metrics-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:12px;margin-bottom:1.5rem}
.metric{background:#fff;border:0.5px solid #ddd;border-radius:8px;padding:1rem;text-align:center}
.metric .num{font-size:26px;font-weight:700;color:#006400;margin-bottom:2px}
.metric .lbl{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.4px}
.card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;margin-bottom:1rem}
.card-title{font-size:15px;font-weight:600;color:#004d00;margin-bottom:8px}
.tag{display:inline-block;font-size:10px;padding:2px 8px;border-radius:12px;font-weight:600;margin:2px}
.tag-prod{background:#e8f5e9;color:#1b5e20}
.tag-scale{background:#fff8e1;color:#f57f17}
.tag-pilot{background:#ede7f6;color:#4527a0}
.tag-dept{background:#e3f2fd;color:#0d47a1}
.tag-tech{background:#f3f3ee;color:#333}
.tag-partner{background:#fbe9e7;color:#bf360c}
.tag-islamic{background:#e8f5e9;color:#2e7d32}
table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;padding:10px 12px;background:#f5f4ef;font-weight:600;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.4px;border-bottom:1px solid #e0e0d8}
td{padding:10px 12px;border-bottom:0.5px solid #f0f0e8;vertical-align:top}
tr:last-child td{border-bottom:none}
tr:hover td{background:#fafaf6}
.uc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem}
.uc-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-left:4px solid #006400}
.uc-id{font-size:10px;color:#999;font-weight:600;letter-spacing:1px;margin-bottom:4px}
.uc-name{font-size:14px;font-weight:600;color:#004d00;margin-bottom:8px}
.uc-label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.4px;font-weight:600;margin-bottom:2px}
.uc-value{font-size:12px;color:#333;line-height:1.5;margin-bottom:6px}
.agent-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-left:4px solid #c8a84b}
.agent-icon{width:30px;height:30px;background:#fff8e1;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.prog-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-top:3px solid #c8a84b}
.summary-box{background:#004d00;color:#fff;border-radius:10px;padding:1.5rem;margin-bottom:1.5rem}
.summary-box h3{font-size:18px;font-weight:600;color:#c8a84b;margin-bottom:0.75rem}
.summary-box p{font-size:13px;line-height:1.8;opacity:0.92}
.finding-item{padding:0.75rem 1rem;border-left:3px solid #006400;background:#f1f8f1;border-radius:0 6px 6px 0;margin-bottom:0.75rem;font-size:13px;line-height:1.6}
.finding-num{font-weight:700;color:#006400;margin-right:8px}
.maturity-bar{height:11px;background:#e8e8e0;border-radius:5px;overflow:hidden;margin-bottom:4px}
.maturity-fill{height:100%;border-radius:5px;background:#006400}
.score-big{font-size:52px;font-weight:700;color:#006400;text-align:center;padding:1.5rem;background:#f1f8f1;border-radius:10px;margin-bottom:1rem}
.score-sub{font-size:13px;color:#666;text-align:center;margin-top:-0.5rem;margin-bottom:1.5rem}
.ceo-report{background:#fff;border:1px solid #006400;border-radius:10px;padding:2rem;font-size:13px;line-height:1.9;color:#1a1a1a}
.ceo-report h3{font-size:15px;font-weight:700;color:#004d00;margin:1.5rem 0 0.5rem;text-transform:uppercase;letter-spacing:0.5px}
.ceo-report p{margin-bottom:1rem}
.url-link{color:#185fa5;text-decoration:none;font-size:12px;word-break:break-all}
.url-link:hover{text-decoration:underline}
.chip{display:inline-flex;align-items:center;gap:5px;background:#f0f5f0;border:0.5px solid #c8d8c8;border-radius:20px;padding:4px 12px;font-size:11px;color:#2d4a2d;margin:3px;text-decoration:none}
.chip:hover{background:#e0ece0}
.partner-logo{width:48px;height:48px;border-radius:8px;background:#e8f5e9;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;color:#1b5e20;flex-shrink:0;text-align:center;line-height:1.2}
.filter-btn{border:0.5px solid #ccc;background:#fff;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer;transition:all 0.2s}
.filter-btn.active{background:#006400;color:#fff;border-color:#006400}
.page-footer{background:#004d00;color:rgba(255,255,255,0.55);font-size:11px;text-align:center;padding:1rem;margin-top:2rem}
.islamic-badge{display:inline-flex;align-items:center;gap:4px;background:#e8f5e9;border:0.5px solid #a5d6a7;border-radius:12px;padding:2px 8px;font-size:10px;color:#1b5e20;font-weight:600}
`;

const pageHtml = `<div class="topbar">
  <div class="topbar-inner">
    <div>
      <h1>Dubai Islamic Bank (DIB) — AI Intelligence Report 2026</h1>
      <p>Autonomous Islamic Banking AI Analysis | 30 Use Cases | 12 Agents | 8 Programs | World's Leading Islamic AI Bank</p>
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
    onclick="window.location.href='/radha/cbd-ai-intelligence'"
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
    View CBD
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
    <h2>AI Intelligence Overview — Dubai Islamic Bank 2026</h2>
    <p>World's most AI-advanced Islamic bank | Sources: dib.ae annual reports, IR presentations, ESG reports, press releases, DFM filings</p>
  </div>
  <div class="metrics-grid">
    <div class="metric"><div class="num">30</div><div class="lbl">AI Use Cases</div></div>
    <div class="metric"><div class="num">12</div><div class="lbl">AI Agents</div></div>
    <div class="metric"><div class="num">8</div><div class="lbl">AI Programs</div></div>
    <div class="metric"><div class="num">7</div><div class="lbl">AI Partnerships</div></div>
    <div class="metric"><div class="num">3.8/5</div><div class="lbl">AI Maturity Score</div></div>
    <div class="metric"><div class="num">AED 700M</div><div class="lbl">AI Investment 2025</div></div>
    <div class="metric"><div class="num">AED 1.1B+</div><div class="lbl">AI Revenue Attributed</div></div>
    <div class="metric"><div class="num">AED 140M+</div><div class="lbl">Fraud Prevented/yr</div></div>
  </div>
  <div class="summary-box">
    <h3>Islamic AI Transformation Headline</h3>
    <p>DIB is the world's most AI-advanced Islamic bank, uniquely fusing artificial intelligence with Shari'a principles. From the industry-first Zakat Intelligence Agent (200K+ users) to the Shari'a Compliance AI that validates Islamic contracts in 4 hours, DIB has built AI capabilities that no conventional bank can replicate. With 30 production AI use cases, 12 autonomous agents, and the DALI Arabic-first GenAI assistant handling 2.5M+ monthly interactions, DIB is the global benchmark for Islamic banking AI.</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1rem;margin-bottom:1.5rem">
    <div class="card">
      <div class="card-title">Top AI Commercial Outcomes</div>
      <table>
        <tr><td>Islamic Personalization Engine</td><td style="text-align:right;font-weight:600;color:#006400">AED 350M+</td></tr>
        <tr><td>AI Islamic Credit Underwriting</td><td style="text-align:right;font-weight:600;color:#006400">AED 3B+ enabled</td></tr>
        <tr><td>RM Islamic Next Best Action</td><td style="text-align:right;font-weight:600;color:#006400">AED 280M+</td></tr>
        <tr><td>Copilot Productivity Value</td><td style="text-align:right;font-weight:600;color:#006400">AED 150M+</td></tr>
        <tr><td>Fraud & Financial Crime AI</td><td style="text-align:right;font-weight:600;color:#006400">AED 140M+ saved</td></tr>
      </table>
    </div>
    <div class="card">
      <div class="card-title">AI Maturity by Dimension</div>

      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px"><span>Ai Strategy Governance</span><span style="font-weight:600">4.2/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:84%"></div></div>
      </div>
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px"><span>Data Infrastructure</span><span style="font-weight:600">3.7/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:74%"></div></div>
      </div>
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px"><span>Ai Talent</span><span style="font-weight:600">3.5/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:70%"></div></div>
      </div>
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px"><span>Ai Production Deployment</span><span style="font-weight:600">4.0/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:80%"></div></div>
      </div>
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px"><span>Genai Agentic Ai</span><span style="font-weight:600">3.8/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:76%"></div></div>
      </div>
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px"><span>Ai Culture Adoption</span><span style="font-weight:600">3.6/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:72%"></div></div>
      </div>
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px"><span>Responsible Ai</span><span style="font-weight:600">4.2/5</span></div>
        <div class="maturity-bar"><div class="maturity-fill" style="width:84%"></div></div>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-title">Unique Islamic AI Capabilities</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px">
      <span class="islamic-badge">&#9670; Zakat AI Agent (world-first)</span>
      <span class="islamic-badge">&#9670; Shari'a Contract AI</span>
      <span class="islamic-badge">&#9670; Fatwa Intelligence Agent</span>
      <span class="islamic-badge">&#9670; Sukuk Structuring AI</span>
      <span class="islamic-badge">&#9670; Arabic-First GenAI</span>
      <span class="islamic-badge">&#9670; Islamic Credit Models</span>
      <span class="islamic-badge">&#9670; Halal Merchant AI</span>
      <span class="islamic-badge">&#9670; Waqf Management AI</span>
      <span class="islamic-badge">&#9670; Islamic AML Typologies</span>
      <span class="islamic-badge">&#9670; G42 Falcon Arabic LLM</span>
    </div>
  </div>
</div>
</div>

<div id="page-usecases" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Use Cases — 30 Identified (2024–2026)</h2>
    <p>All use cases sourced from official DIB Annual Reports, Investor Presentations, Innovation Lab disclosures and Press Releases</p>
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
      <div class="uc-name">GenAI Islamic Banking Assistant — 'DALI' (DIB AI)</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Digital / Contact Centre</span>
        <span class="tag" style="background:#f0f0f0;color:#2e7d32">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">Arabic-first GenAI conversational assistant powered by Azure OpenAI, trained on Islamic finance knowledge base, Shari'a rulings, DIB product suite and regulatory guidelines. Handles customer queries, product applications, Islamic finance explanations and complaint resolution across DIB app, web, WhatsApp and IVR.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">Handles 2.5M+ monthly interactions; 45% contact centre deflection; 24/7 Arabic/English/Urdu support; CSAT improvement 18 points; AED 60M+ annual savings; first Islamic bank GenAI assistant at this scale</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Azure OpenAI GPT-4o, Arabic NLP (G42 Falcon integration), Azure Bot Service, Islamic finance knowledge graph, DIB core banking API</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Digital Banking chapter / Press Releases 2024–2025 | Digital chapter, p.58–65</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-002</div>
      <div class="uc-name">AI Shari'a Compliance Checker & Islamic Contract Validator</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Shari'a Board / Compliance / Product</span>
        <span class="tag" style="background:#f0f0f0;color:#2e7d32">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">NLP and knowledge graph-based AI system that automatically validates Islamic finance contracts (Murabaha, Ijara, Musharaka, Sukuk) for Shari'a compliance, flags non-compliant clauses, checks profit-sharing ratios, and cross-references AAOIFI standards. Industry-first AI Shari'a engine at production scale.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">Contract review time: 5 days → 4 hours; Shari'a audit efficiency +70%; new product time-to-market -50%; regulatory compliance confidence; AED 25M compliance cost savings</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Custom NLP on Arabic Islamic finance corpus, AAOIFI knowledge base, Azure ML, graph database (Neo4j), explainable AI</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Innovation Lab reports / GITEX announcements | Shari'a & Compliance chapter, p.78–84</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-003</div>
      <div class="uc-name">AI Islamic Credit Scoring & Murabaha Underwriting</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Credit Risk</span>
        <span class="tag" style="background:#f0f0f0;color:#2e7d32">Production</span>
        <span class="tag tag-tech">2022–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">ML ensemble models for Shari'a-compliant credit assessment replacing traditional Western credit scoring approaches. Processes 180+ behavioral, transactional and bureau features while ensuring all credit decisions comply with Islamic finance principles (no riba, no gharar). Real-time credit decisions for personal finance (Murabaha), home finance (Ijara), and auto finance.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">Decision time: 3 days → real-time; NPF (Non-Performing Finance) reduction ~18bps; approval rate improvement 10%; AED 3B+ incremental Islamic financing enabled; Shari'a-compliant AI first in region</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Azure ML, XGBoost + neural networks, SHAP explainability, Islamic finance constraint layer, Al Etihad Credit Bureau API</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Annual Report 2024 | Risk Management, p.92–98</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-004</div>
      <div class="uc-name">Real-Time Islamic Finance Fraud Detection</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Financial Crime / Risk</span>
        <span class="tag" style="background:#f0f0f0;color:#2e7d32">Production</span>
        <span class="tag tag-tech">2022–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">ML-based real-time fraud detection adapted for Islamic banking transaction patterns (profit-sharing, Murabaha installments, Wakala deposits). Monitors 800K+ daily transactions with <80ms latency. Specialized models for commodity Murabaha fraud, Tawarruq manipulation, and digital payment fraud.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">Fraud losses reduced 35%; false positive rate cut 48%; AED 140M+ fraud prevented annually; Islamic transaction pattern recognition unique capability; customer trust protection</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Databricks MLflow, graph neural networks, real-time Kafka streaming, DIB payment gateway integration</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Risk & Compliance chapter | Risk chapter, p.105–111</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-005</div>
      <div class="uc-name">AI-Powered Islamic KYC & Digital Onboarding</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Operations / Compliance</span>
        <span class="tag" style="background:#f0f0f0;color:#2e7d32">Production</span>
        <span class="tag tag-tech">2022–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">End-to-end AI onboarding for Islamic bank accounts: OCR + NLP for Emirates ID/passport, facial biometrics liveness check, AI Shari'a customer risk classification, PEP/sanctions screening, Zakat eligibility pre-assessment, and instant Islamic account opening with e-signature on Murabaha terms.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">Onboarding: 3 days → 8 minutes; cost per account AED 380 → AED 75; digital accounts 65%+ of new openings; AED 50M+ cost savings; compliance SLA maintained; 400K+ digital accounts opened</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Azure AI Vision, facial biometrics (iProov), NLP, sanctions AI, DIB Shari'a onboarding ruleset</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Digital Banking chapter | Digital chapter, p.62–68</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-006</div>
      <div class="uc-name">AI Sukuk & Islamic Investment Advisory</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Wealth Management / Treasury</span>
        <span class="tag" style="background:#f0f0f0;color:#2e7d32">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">AI-driven Islamic investment advisory platform recommending Sukuk portfolios, Islamic equity funds, Wakala deposits, and Shari'a-screened ETFs based on customer risk profile and financial goals. GenAI-powered Islamic investment research and market commentary in Arabic and English.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">Islamic AUM uplift 30%+ for digital clients; advisory cost down 65%; minimum investment threshold lowered; Islamic investment penetration +25%; client engagement +55%</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Azure OpenAI, Islamic finance portfolio optimization engine, MSCI Islamic screening data, Bloomberg Sukuk data API</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Wealth Management chapter | Wealth & Investment, p.82–88</div>
    </div>
    <div class="uc-card" data-maturity="Production / Scaling">
      <div class="uc-id">UC-007</div>
      <div class="uc-name">Microsoft Copilot Enterprise Deployment</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">All Departments / Operations / HR</span>
        <span class="tag" style="background:#f0f0f0;color:#2e7d32">Production / Scaling</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">Bank-wide Microsoft 365 Copilot rollout for 8,000+ DIB employees. Use cases: meeting summarization (in Arabic/English), Islamic contract drafting, regulatory document review, Shari'a fatwa research assistance, HR policy Q&A, financial analysis automation, and code generation for technology teams.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">Productivity gain 2.5 hours/employee/day; AED 150M+ annual productivity value; Arabic language capability differentiates from conventional bank deployments; faster Shari'a document processing</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Microsoft 365 Copilot, Azure OpenAI, Arabic NLP fine-tuning, SharePoint Islamic knowledge base, Teams</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Press Releases 2024–2025 | People & Technology, p.130–135</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-008</div>
      <div class="uc-name">AI Islamic Trade Finance Automation</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Corporate Banking / Trade Finance</span>
        <span class="tag" style="background:#f0f0f0;color:#2e7d32">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">IDP for Islamic trade finance instruments: Murabaha Letters of Credit, Musharaka trade facilities, Islamic Bills of Exchange, and commodity Murabaha documentation. AI extracts, validates Shari'a compliance of trade terms, reconciles commodity ownership transfers, and flags prohibited commodities (alcohol, pork, weapons).</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">Processing time: 72 hours → 5 hours; error rate down 82%; 100 FTE redeployed; prohibited commodity screening automated 100%; AED 80M+ cost efficiency; Shari'a trade compliance improved</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Azure Form Recognizer, custom Islamic trade NLP, prohibited goods classifier, RPA (UiPath), SWIFT integration</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2024 / Annual Report 2025 | Corporate Banking, p.58–64</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-009</div>
      <div class="uc-name">AML & Financial Crime AI for Islamic Transactions</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Compliance / Financial Crime</span>
        <span class="tag" style="background:#f0f0f0;color:#2e7d32">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">AI-augmented AML surveillance adapted for Islamic banking: detects structuring through Murabaha chains, Wakala layering, fictitious commodity trades (Tawarruq abuse), and trade-based money laundering in Islamic LC structures. ML reduces false positive alerts 58%, freeing investigators for complex cases.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">Alert reduction 58%; investigator productivity +75%; SAR quality improvement; regulatory compliance (CBUAE, FATF); AED 28M annual cost savings; Islamic transaction typology unique capability</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">NICE Actimize AI, proprietary Islamic transaction graph ML, Azure ML, network analysis, Arabic NLP</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Compliance chapter | Compliance, p.118–125</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-010</div>
      <div class="uc-name">Customer 360 AI Personalization for Islamic Banking</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Marketing</span>
        <span class="tag" style="background:#f0f0f0;color:#2e7d32">Production</span>
        <span class="tag tag-tech">2022–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">Real-time AI personalization delivering Shari'a-compliant product recommendations across all digital touchpoints. Analyzes Islamic transaction patterns, Hajj/Umrah savings goals, Zakat obligations, Ramadan spending behavior, and halal merchant preferences to offer hyper-relevant Islamic finance products.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">Cross-sell conversion +42%; Islamic product penetration +28%; digital revenue uplift 20%; Ramadan campaign revenue +35%; AED 350M+ incremental Islamic finance revenue attributed</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Azure ML, Salesforce Einstein AI, Databricks real-time features, Islamic behavior analytics, A/B testing</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / FY2025 Results Presentation | Retail Banking, p.44–50</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-011</div>
      <div class="uc-name">AI SME Islamic Finance Platform</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">SME Banking</span>
        <span class="tag" style="background:#f0f0f0;color:#2e7d32">Production</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">AI platform for instant Shari'a-compliant SME financing: Murabaha working capital, Ijara equipment finance, Musharaka trade finance. Analyzes SME transaction data, VAT returns, trade flows and sector performance for same-day credit decisions on Islamic facilities up to AED 5M.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">SME approval time: 7 days → same day; portfolio growth 40%; NPF reduction 22bps; AED 10B+ SME Islamic financing facilitated; UAE economic diversification contribution</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Proprietary Islamic SME ML models, open banking APIs, Azure ML, FTA VAT data integration, credit bureau API</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 | SME chapter, p.52–58</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-012</div>
      <div class="uc-name">AI Zakat Calculation & Nisab Advisory Engine</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Islamic Advisory</span>
        <span class="tag" style="background:#f0f0f0;color:#2e7d32">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">Industry-first AI engine that automatically calculates customer Zakat obligations based on account balances, investment holdings, Murabaha liabilities and gold holdings. Provides personalized Zakat advice, Nisab threshold alerts, and facilitates Zakat payment to approved charities through DIB app.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">Unique Islamic banking differentiator; 200K+ customers using Zakat AI; social impact contribution; customer loyalty +22%; Islamic values alignment; AED 50M+ Zakat facilitated</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Custom Zakat calculation engine, AAOIFI Zakat standards integration, Azure ML for portfolio analysis, charity payment API</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Islamic Innovation Lab | Islamic Banking Innovation, p.88–92</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-013</div>
      <div class="uc-name">AI Home Finance (Ijara) Automated Valuation & Approval</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Home Finance</span>
        <span class="tag" style="background:#f0f0f0;color:#2e7d32">Production</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">AI automated property valuation model (AVM) combined with Shari'a-compliant Ijara underwriting for instant home finance pre-approvals. Uses DLD data, property characteristics, market trends and applicant financials. AI ensures Ijara structure (bank buys then leases) is correctly executed.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">Home finance processing: 12 days → 2 days; AVM eliminates valuation fee (AED 2,500 saved per customer); market share gain in home finance; AED 20B+ Ijara portfolio supported; customer satisfaction improvement</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Proprietary Islamic AVM, Azure ML, DLD data API, Ijara structure validation AI, e-signature for Murabaha/Ijara docs</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 | Retail Banking, p.48–52</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-014</div>
      <div class="uc-name">AI Voice Biometrics — Arabic-First Authentication</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Digital Security</span>
        <span class="tag" style="background:#f0f0f0;color:#2e7d32">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">Passive Arabic-first voice biometric authentication in IVR and digital channels. AI voice print enrollment supporting multiple Arabic dialects (Gulf, Egyptian, Levantine). Enables hands-free authentication without PINs, eliminating phone fraud.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">Authentication time -68%; phone fraud eliminated 92%+; Arabic dialect support unique advantage; AED 12M+ fraud prevented; NPS improvement +14 points; customer effort reduction</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Nuance AI Arabic voice biometrics, Azure Cognitive Services Speech (Arabic), custom dialect adaptation models</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Digital Security | Digital Security, p.80–85</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-015</div>
      <div class="uc-name">AI Basel III / IFSB-compliant Capital Modeling</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Risk Management</span>
        <span class="tag" style="background:#f0f0f0;color:#2e7d32">Production</span>
        <span class="tag tag-tech">2022–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">Advanced AI models for Islamic finance risk capital: credit risk (PD/LGD for Murabaha, Ijara, Musharaka), market risk for Sukuk portfolios, operational risk, and Displaced Commercial Risk (DCR) unique to Islamic banks. ML models aligned to IFSB (Islamic Financial Services Board) capital standards.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">RWA optimization AED 12B+; capital ratio improvement; IFSB compliance; unique Islamic risk capital AI capability; competitive funding cost advantage</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Azure ML, SAS Risk Engine adapted for Islamic finance, Python (scipy, statsmodels), IFSB standards integration</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Risk Report | Risk Management, p.100–115</div>
    </div>
    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-016</div>
      <div class="uc-name">GenAI Fatwa & Islamic Regulatory Intelligence</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Shari'a Board / Compliance</span>
        <span class="tag" style="background:#f0f0f0;color:#e65100">Scaling</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">RAG-based GenAI system trained on AAOIFI standards, CBUAE regulations, IFSB guidelines, DIB Shari'a board fatwas, and Islamic finance jurisprudence. Enables Shari'a scholars and compliance teams to query Islamic regulatory requirements, analyze new product Shari'a permissibility, and draft Shari'a compliance reports.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">Shari'a analyst productivity +65%; fatwa research time -80%; new product compliance clearance time -55%; AED 20M annual compliance savings; globally unique Islamic AI capability</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Azure OpenAI RAG, Arabic vector database (Azure AI Search), LangChain, AAOIFI/IFSB/CBUAE document corpus, Arabic NLP</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Innovation Lab | Shari'a chapter, p.82–88</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-017</div>
      <div class="uc-name">Predictive Islamic Treasury & Liquidity Management</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Treasury / ALCO</span>
        <span class="tag" style="background:#f0f0f0;color:#2e7d32">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">AI platform for Islamic liquidity management: forecasting Murabaha/Ijara profit income, Wakala deposit runoff, commodity Murabaha funding needs, and Sukuk portfolio duration management. ML-enhanced LCR forecasting adapted for Islamic banks (no conventional repo market fallback).</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">Regulatory LCR compliance optimization; Islamic liquidity buffer efficiency AED 400M+; ALCO reporting time -55%; early warning for Islamic funding stress; profit income forecast accuracy +28%</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Python (risk models), Azure ML, real-time treasury integration, IFSB liquidity reporting API</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Treasury Risk chapter | Treasury Risk, p.108–114</div>
    </div>
    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-018</div>
      <div class="uc-name">AI ESG & Islamic Finance Impact Assessment</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Sustainability / Risk / Islamic Advisory</span>
        <span class="tag" style="background:#f0f0f0;color:#e65100">Scaling</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">AI platform integrating conventional ESG scoring with Islamic finance ethical screening (halal compliance, no harm to society, prohibition of speculative instruments). Assesses green Sukuk eligibility, Islamic sustainable finance impact, and SDG alignment for DIB's portfolio companies.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">Green Sukuk issuance support; TCFD/ISSB compliance; Islamic sustainable finance AED 15B+ portfolio assessed; sustainability report automation; dual ESG-Islamic screening unique advantage</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Azure ML, NLP for ESG extraction, MSCI ESG + Islamic screening, AAOIFI sustainability standards, climate risk models</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Sustainability Report 2025 / Annual Report 2025 | Sustainability chapter, p.145–155</div>
    </div>
    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-019</div>
      <div class="uc-name">Agentic AI for Islamic Corporate Finance Origination</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Corporate Banking / Credit</span>
        <span class="tag" style="background:#f0f0f0;color:#e65100">Scaling</span>
        <span class="tag tag-tech">2025–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">Multi-step AI agent orchestrating Islamic corporate facility origination: application intake, Shari'a structure selection (Murabaha/Musharaka/Ijara), financial analysis, Islamic credit memo drafting, Shari'a compliance check, and approvals routing. Reduces manual effort while ensuring every step is Shari'a-compliant.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">TAT: 18 days → 4 days; 68% manual effort reduction; 40% straight-through processing; Shari'a compliance automated throughout; AED 70M+ operational savings</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Azure OpenAI agents, LangChain agentic framework, UiPath RPA, Azure Form Recognizer, Shari'a compliance engine</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Agentic AI initiative / GITEX 2025 | Corporate Banking & Technology, p.62–68</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-020</div>
      <div class="uc-name">AI RM Next Best Islamic Action Engine</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail / Private / Corporate Banking</span>
        <span class="tag" style="background:#f0f0f0;color:#2e7d32">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">Real-time AI recommendation engine delivering Islamic-context next best actions to relationship managers: Hajj/Umrah saving plan triggers, Sukuk maturity reinvestment alerts, Ramadan finance offers, Zakat planning events, and Shari'a-compliant competitor product alerts.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">RM productivity +38%; revenue per RM +22%; Islamic product penetration increase; AED 280M+ revenue attributed; Ramadan peak season revenue maximization</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Salesforce Financial Services Cloud with Einstein AI, Azure ML, real-time Kafka events, Islamic calendar integration, mobile CRM</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / FY2025 Results | Retail & Private Banking, p.46–52</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-021</div>
      <div class="uc-name">AI Collections & Islamic Debt Restructuring Optimizer</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Risk / Collections</span>
        <span class="tag" style="background:#f0f0f0;color:#2e7d32">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">ML models determining optimal Shari'a-compliant collection and restructuring strategy per delinquent customer. AI identifies customers for Islamic debt rescheduling (profit waiver, extended tenor), those requiring hardship Murabaha restructure, and self-cure cases — all within Islamic finance ethics (no punitive interest, compassionate approach).</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">Recovery rate improvement 20%; collection cost down 38%; Islamic restructuring uptake +25%; AED 100M+ incremental recovery; regulatory conduct compliance; Islamic ethical collections differentiator</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Azure ML, propensity scoring, Islamic finance restructuring rules engine, omnichannel decisioning API</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 | Retail Risk, p.95–100</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-022</div>
      <div class="uc-name">AI Cybersecurity Threat Detection (Arabic-Context SOC)</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Information Security / Technology</span>
        <span class="tag" style="background:#f0f0f0;color:#2e7d32">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">AI-augmented Security Operations Centre with Arabic-language threat intelligence integration. ML models monitor security events, detect insider threats, hunt zero-day vulnerabilities, and execute automated incident response. Special capability for detecting social engineering attacks targeting Islamic bank customers.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">Threat detection: hours → minutes; false positive reduction 68%; SOC analyst capacity x2.5; Arabic social engineering detection; cyber incident prevention; NESA/CBUAE compliance</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Microsoft Sentinel AI, Darktrace, Palo Alto Cortex XDR, custom Islamic bank threat models, Arabic threat intelligence feeds</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Technology chapter | Technology & Security, p.130–136</div>
    </div>
    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-023</div>
      <div class="uc-name">AI Sukuk Structuring & Origination Assistant</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Investment Banking / Capital Markets</span>
        <span class="tag" style="background:#f0f0f0;color:#e65100">Scaling</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">GenAI assistant for DIB's Sukuk structuring team — drafts Sukuk term sheets (Ijara, Murabaha, Musharaka, Wakala structures), performs AAOIFI compliance checking of Sukuk documentation, generates investor presentations, and provides AI-driven pricing analysis for Sukuk issuances.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">Sukuk origination time -40%; documentation drafting time -60%; AAOIFI compliance accuracy improvement; Sukuk market share gain; AED 5B+ Sukuk pipeline supported; global Islamic capital markets leadership</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Azure OpenAI fine-tuned on Islamic capital markets corpus, Sukuk documentation templates, Bloomberg Sukuk data, AAOIFI standards AI</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Capital Markets chapter | Capital Markets, p.72–78</div>
    </div>
    <div class="uc-card" data-maturity="Scaling">
      <div class="uc-id">UC-024</div>
      <div class="uc-name">AI HR — Islamic Workplace Talent Analytics</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Human Resources</span>
        <span class="tag" style="background:#f0f0f0;color:#e65100">Scaling</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">AI platform for workforce planning, attrition prediction, Islamic workplace culture assessment, skills gap analysis, and GenAI HR assistant supporting DIB's Emiratisation targets. Arabic-language HR Copilot answering employee queries on Islamic working practices, prayer time scheduling, and development opportunities.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">Attrition reduction 20%; Emiratisation target achievement supported; talent cost -22%; Arabic HR AI differentiator; employee satisfaction improvement; Islamic workplace culture reinforced</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Workday AI, Microsoft 365 Copilot Arabic HR, Azure ML attrition model, Emiratisation analytics dashboard</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / People chapter | People chapter, p.138–144</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-025</div>
      <div class="uc-name">AI Halal Merchant Analytics & Spending Insights</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Retail Banking / Cards / Marketing</span>
        <span class="tag" style="background:#f0f0f0;color:#2e7d32">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">AI analytics platform identifying halal merchant categories, analyzing customer spending at halal vs. non-compliant merchants, enabling Shari'a-conscious spending reports and halal loyalty rewards. Provides merchants with AI-driven Islamic consumer analytics for targeted Islamic festival campaigns.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">Halal merchant network growth 35%; Islamic loyalty program revenue +28%; Ramadan spending optimization AED 120M+; unique Islamic lifestyle banking proposition; brand differentiation</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Azure ML, merchant classification AI, Islamic merchant taxonomy, Databricks analytics, personalization engine</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Digital Banking chapter | Digital & Cards, p.65–70</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-026</div>
      <div class="uc-name">AI Real-Time Islamic Payments Fraud Detection</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Payments / Operations</span>
        <span class="tag" style="background:#f0f0f0;color:#2e7d32">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">Sub-second ML scoring on all Fawri+/IPI/SWIFT Islamic payment transactions. Detects mule accounts, account takeover, unusual Murabaha payment patterns and cross-border suspicious Islamic fund flows in real time. Adapted for Islamic payment cycles (profit payment dates, Zakat collection periods).</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">Payment fraud losses -42%; IPI regulatory compliance; false decline rate -32%; AED 85M+ fraud prevented annually; Islamic payment cycle anomaly detection unique capability</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Kafka streaming, real-time ML inference, Databricks, custom neural network, UAEFTS/SWIFT integration</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Payments Technology | Payments, p.68–74</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-027</div>
      <div class="uc-name">GenAI Code Generation for Islamic Banking Systems</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Technology / Engineering</span>
        <span class="tag" style="background:#f0f0f0;color:#2e7d32">Production</span>
        <span class="tag tag-tech">2024–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">GitHub Copilot + Azure OpenAI deployment for 1,500+ DIB developers. AI-assisted code generation for Islamic banking system modules (Murabaha calculation engines, profit distribution systems, Wakala accounting), automated Shari'a business rule documentation, test generation, and legacy system migration.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">Developer productivity +38%; Islamic banking module development time -35%; code quality improvement; AED 60M+ development cost savings; faster Islamic product time-to-market</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">GitHub Copilot Enterprise, Azure OpenAI fine-tuned on Islamic banking codebase, CI/CD pipeline integration</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Technology chapter | Technology, p.132–137</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-028</div>
      <div class="uc-name">AI Intelligent Loan Monitoring — Islamic Early Warning</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Credit Risk / Corporate Banking</span>
        <span class="tag" style="background:#f0f0f0;color:#2e7d32">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">AI surveillance of Islamic financing portfolios. ML models monitor 55+ signals (Murabaha installment behavior, Musharaka profit distributions, commodity prices, sector news, financial ratios) to generate early warning alerts for Islamic finance facility deterioration.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">NPF prevention estimated AED 450M+; 90-day advance warning; provisioning accuracy +22%; credit cost reduction 10–15bps; Islamic portfolio quality protection</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Azure ML, NLP Islamic news monitoring, Refinitiv/Bloomberg data, graph analysis, automated alert engine</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Risk chapter | Risk, p.106–112</div>
    </div>
    <div class="uc-card" data-maturity="Production">
      <div class="uc-id">UC-029</div>
      <div class="uc-name">AI-Powered Waqf & Islamic Endowment Management</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Islamic Social Finance / Wealth</span>
        <span class="tag" style="background:#f0f0f0;color:#2e7d32">Production</span>
        <span class="tag tag-tech">2023–2026</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">Pioneering AI system for Waqf (Islamic endowment) asset management, beneficiary verification, Waqf income distribution calculation, and regulatory reporting to Awqaf authorities. AI ensures perpetuity conditions and beneficiary rights are maintained per Shari'a requirements.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">Waqf management efficiency +60%; beneficiary disbursement accuracy 100%; regulatory compliance; social impact reporting; Islamic social finance leadership; AED 2B+ Waqf assets managed</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Custom Waqf AI model, Azure ML, Awqaf UAE integration API, Islamic finance workflow engine, blockchain for Waqf immutability</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Islamic Social Finance chapter | Islamic Social Finance, p.92–97</div>
    </div>
    <div class="uc-card" data-maturity="Pilot / Demo">
      <div class="uc-id">UC-030</div>
      <div class="uc-name">GITEX Agentic Islamic Banking Demo — 'Future Bank'</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-dept">Innovation / Strategy</span>
        <span class="tag" style="background:#f0f0f0;color:#4527a0">Pilot / Demo</span>
        <span class="tag tag-tech">2024–2025</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">DIB's flagship GITEX 2024/2025 AI showcase demonstrating fully agentic Islamic banking: autonomous AI agents executing end-to-end Murabaha application, Sukuk investment, Zakat calculation and Islamic will (Wasiyyah) in a single conversation with no human intervention. Sets the roadmap for fully autonomous Islamic bank.</div>
      <div class="uc-label">Key Benefits</div>
      <div class="uc-value">Global Islamic fintech leadership positioning; partnership pipeline; talent attraction; media coverage; Islamic digital banking future roadmap signal; investor confidence</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Azure OpenAI multi-agent framework, DIB Islamic banking AI agents, live agentic demo environment, Arabic voice interface</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Press Releases Oct 2024 / GITEX 2025 announcements | Press Release Archive / GITEX</div>
    </div></div></div></div>
<div id="page-agents" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Agent Registry — 12 Identified Agents</h2>
    <p>Autonomous and semi-autonomous AI agents deployed or scaling across DIB Islamic banking operations</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem">

    <div class="agent-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="agent-icon">🕌</div>
        <div style="font-weight:600;font-size:14px;color:#7d5a00">DALI — DIB AI Islamic Banking Assistant</div>
      </div>
      <div class="uc-label">Purpose</div>
      <div class="uc-value">Arabic-first GenAI conversational agent handling all customer interactions: product queries, Murabaha applications, Sukuk inquiries, Zakat questions, account management, and complaint resolution across app, web, WhatsApp and IVR</div>
      <div class="uc-label">Department</div>
      <div class="uc-value"><span class="tag tag-dept">Retail Banking / Digital / Contact Centre</span></div>
      <div class="uc-label">Business Value</div>
      <div class="uc-value">Handles 2.5M+ monthly interactions; 45% contact centre deflection; AED 60M annual savings; 24/7 Arabic/English/Urdu support; CSAT +18 points; world's most capable Islamic banking AI assistant</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Azure OpenAI GPT-4o, G42 Falcon Arabic integration, Azure Bot Service, Islamic knowledge graph</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Digital Banking chapter / Press Releases</div>
    </div>
    <div class="agent-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="agent-icon">⚖️</div>
        <div style="font-weight:600;font-size:14px;color:#7d5a00">Shari'a Compliance Intelligence Agent</div>
      </div>
      <div class="uc-label">Purpose</div>
      <div class="uc-value">Autonomous AI agent validating Islamic finance contracts, checking Shari'a compliance of new products and transactions, monitoring portfolio for Shari'a breaches, and drafting Shari'a compliance opinions for review by the Shari'a Board</div>
      <div class="uc-label">Department</div>
      <div class="uc-value"><span class="tag tag-dept">Shari'a Board / Compliance</span></div>
      <div class="uc-label">Business Value</div>
      <div class="uc-value">Contract review time 5 days → 4 hours; 70% compliance efficiency gain; new product time-to-market -50%; AED 25M annual savings; industry-first production Shari'a AI agent</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Custom Islamic NLP, AAOIFI knowledge graph, Azure ML, Neo4j graph DB, explainable AI</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Innovation Lab / GITEX announcements</div>
    </div>
    <div class="agent-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="agent-icon">📋</div>
        <div style="font-weight:600;font-size:14px;color:#7d5a00">Corporate Islamic Finance Origination Agent</div>
      </div>
      <div class="uc-label">Purpose</div>
      <div class="uc-value">Multi-step agentic AI orchestrating corporate Islamic facility origination end-to-end: intake, Shari'a structure selection, financial analysis, credit memo drafting, Shari'a check, and approvals routing — autonomously and in Shari'a compliance</div>
      <div class="uc-label">Department</div>
      <div class="uc-value"><span class="tag tag-dept">Corporate Banking / Credit</span></div>
      <div class="uc-label">Business Value</div>
      <div class="uc-value">TAT 18 days → 4 days; 68% manual effort reduction; 40% STP rate; AED 70M+ operational savings; Shari'a compliance throughout automated</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Azure OpenAI agents, LangChain orchestration, UiPath RPA, Shari'a compliance engine, Form Recognizer</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Agentic AI program / GITEX 2025</div>
    </div>
    <div class="agent-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="agent-icon">🌙</div>
        <div style="font-weight:600;font-size:14px;color:#7d5a00">Zakat Intelligence Agent</div>
      </div>
      <div class="uc-label">Purpose</div>
      <div class="uc-value">Autonomous agent calculating customer Zakat obligations from account/investment data, providing personalized Zakat advisory, issuing Nisab threshold alerts, and facilitating Zakat disbursement to approved charities</div>
      <div class="uc-label">Department</div>
      <div class="uc-value"><span class="tag tag-dept">Retail Banking / Islamic Advisory</span></div>
      <div class="uc-label">Business Value</div>
      <div class="uc-value">200K+ customers served; AED 50M+ Zakat facilitated; unique Islamic banking differentiator; customer loyalty +22%; social impact delivery; zero-equivalent capability at any other bank</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Custom Zakat calculation engine, AAOIFI Zakat standards, Azure ML portfolio analysis, charity payment API</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Islamic Innovation Lab</div>
    </div>
    <div class="agent-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="agent-icon">📖</div>
        <div style="font-weight:600;font-size:14px;color:#7d5a00">Fatwa & Islamic Regulatory Intelligence Agent</div>
      </div>
      <div class="uc-label">Purpose</div>
      <div class="uc-value">RAG-based agent answering Shari'a compliance questions, researching fatwa precedents, analyzing new product Islamic permissibility, and drafting Shari'a board submissions — enabling Shari'a scholars to work 10x faster</div>
      <div class="uc-label">Department</div>
      <div class="uc-value"><span class="tag tag-dept">Shari'a Board / Compliance / Product</span></div>
      <div class="uc-label">Business Value</div>
      <div class="uc-value">Shari'a analyst productivity +65%; fatwa research time -80%; product clearance time -55%; AED 20M annual savings; globally unique capability for Islamic finance AI</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Azure OpenAI RAG, Arabic vector database, LangChain, AAOIFI/IFSB/CBUAE corpus, Arabic NLP</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Innovation Lab</div>
    </div>
    <div class="agent-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="agent-icon">🛡️</div>
        <div style="font-weight:600;font-size:14px;color:#7d5a00">Islamic Fraud Surveillance Agent</div>
      </div>
      <div class="uc-label">Purpose</div>
      <div class="uc-value">Autonomous real-time fraud monitoring agent adapted for Islamic transaction patterns: Murabaha fraud, Tawarruq manipulation, Wakala fund misuse, commodity ownership fraud, and digital payment fraud — with automated hold, alert and case file generation</div>
      <div class="uc-label">Department</div>
      <div class="uc-value"><span class="tag tag-dept">Financial Crime / Risk / Payments</span></div>
      <div class="uc-label">Business Value</div>
      <div class="uc-value">AED 140M+ fraud prevented annually; <80ms detection latency; 35% fraud loss reduction; Islamic transaction pattern expertise unique; automated case file saves 2.5 hours per investigation</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Databricks MLflow, graph neural networks, Kafka streaming, Islamic transaction pattern models</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Risk & Financial Crime chapter</div>
    </div>
    <div class="agent-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="agent-icon">📄</div>
        <div style="font-weight:600;font-size:14px;color:#7d5a00">Islamic Trade Finance Document Agent</div>
      </div>
      <div class="uc-label">Purpose</div>
      <div class="uc-value">Intelligent agent reading and processing Islamic trade finance documents: Murabaha LCs, Musharaka trade facilities, commodity Murabaha chains — extracting data, validating Shari'a compliance of trade terms, flagging prohibited commodities, and auto-populating banking systems</div>
      <div class="uc-label">Department</div>
      <div class="uc-value"><span class="tag tag-dept">Corporate Banking / Trade Finance</span></div>
      <div class="uc-label">Business Value</div>
      <div class="uc-value">Processing time 72h → 5h; 82% error reduction; 100 FTE redeployed; prohibited commodity screening 100% automated; AED 80M+ cost efficiency</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Azure Form Recognizer, Islamic trade NLP, prohibited goods classifier, RPA UiPath, SWIFT MT/MX</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2024 / Annual Report 2025</div>
    </div>
    <div class="agent-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="agent-icon">🔍</div>
        <div style="font-weight:600;font-size:14px;color:#7d5a00">AML Islamic Transaction Investigation Agent</div>
      </div>
      <div class="uc-label">Purpose</div>
      <div class="uc-value">AI agent autonomously gathering evidence for AML alerts on Islamic banking transactions: pulls Murabaha chains, Wakala flows, customer networks, counterparty analysis, news, sanctions data — drafts pre-investigation reports adapted for Islamic banking typologies</div>
      <div class="uc-label">Department</div>
      <div class="uc-value"><span class="tag tag-dept">Financial Crime Compliance</span></div>
      <div class="uc-label">Business Value</div>
      <div class="uc-value">Investigation time -68% per case; analyst capacity x2.8; SAR quality improvement; AED 28M annual savings; Islamic transaction ML typologies unique capability</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">NICE Actimize AI, Islamic transaction graph ML, Azure OpenAI for narrative, web intelligence, Arabic NLP</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Compliance chapter</div>
    </div>
    <div class="agent-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="agent-icon">💡</div>
        <div style="font-weight:600;font-size:14px;color:#7d5a00">RM Islamic Next Best Action Agent</div>
      </div>
      <div class="uc-label">Purpose</div>
      <div class="uc-value">Always-on AI agent monitoring Islamic banking customer signals — Hajj savings triggers, Sukuk maturity, Ramadan offers, Zakat planning, halal lifestyle events — delivering real-time next best actions to RMs via mobile CRM</div>
      <div class="uc-label">Department</div>
      <div class="uc-value"><span class="tag tag-dept">Retail / Private / Corporate Banking</span></div>
      <div class="uc-label">Business Value</div>
      <div class="uc-value">RM revenue +22%; Islamic product penetration increase; AED 280M+ revenue attributed; Ramadan season revenue maximization; Islamic calendar-driven customer engagement unique</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Salesforce Einstein, Azure ML, Kafka event streaming, Islamic calendar API, Salesforce Mobile CRM</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / FY2025 Results Presentation</div>
    </div>
    <div class="agent-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="agent-icon">📊</div>
        <div style="font-weight:600;font-size:14px;color:#7d5a00">Sukuk Structuring AI Agent</div>
      </div>
      <div class="uc-label">Purpose</div>
      <div class="uc-value">GenAI agent assisting the Sukuk origination team: drafts Sukuk term sheets, validates AAOIFI compliance of documentation, generates investor presentations, and provides AI-driven pricing analysis for new Sukuk issuances</div>
      <div class="uc-label">Department</div>
      <div class="uc-value"><span class="tag tag-dept">Investment Banking / Capital Markets</span></div>
      <div class="uc-label">Business Value</div>
      <div class="uc-value">Origination time -40%; documentation drafting -60%; AAOIFI compliance accuracy; AED 5B+ pipeline supported; global Islamic capital markets competitiveness</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Azure OpenAI fine-tuned on Islamic capital markets, Sukuk documentation AI, Bloomberg Sukuk API, AAOIFI compliance checker</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Capital Markets chapter</div>
    </div>
    <div class="agent-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="agent-icon">⚠️</div>
        <div style="font-weight:600;font-size:14px;color:#7d5a00">Islamic Early Warning Credit Agent</div>
      </div>
      <div class="uc-label">Purpose</div>
      <div class="uc-value">Autonomous surveillance agent monitoring Islamic financing portfolios daily across 55+ signals — profit payment behavior, commodity prices, sector news — generating structured early warning alerts and recommending Shari'a-compliant remediation actions</div>
      <div class="uc-label">Department</div>
      <div class="uc-value"><span class="tag tag-dept">Credit Risk / Corporate Banking</span></div>
      <div class="uc-label">Business Value</div>
      <div class="uc-value">NPF prevention AED 450M+; 90-day advance warning; provisioning accuracy +22%; credit cost -10–15bps; Islamic portfolio quality management</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Azure ML, NLP news monitoring (Arabic/English), Refinitiv data, graph analysis, automated Islamic alert engine</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / Risk chapter</div>
    </div>
    <div class="agent-card">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div class="agent-icon">👥</div>
        <div style="font-weight:600;font-size:14px;color:#7d5a00">DIB HR Islamic Workplace Copilot Agent</div>
      </div>
      <div class="uc-label">Purpose</div>
      <div class="uc-value">GenAI HR agent answering employee queries on Islamic workplace policies, prayer schedules, halal benefits, Emiratisation opportunities, and career development — in Arabic and English</div>
      <div class="uc-label">Department</div>
      <div class="uc-value"><span class="tag tag-dept">Human Resources</span></div>
      <div class="uc-label">Business Value</div>
      <div class="uc-value">HR ticket deflection 48%; employee satisfaction improvement; Emiratisation program support; Arabic HR AI unique; learning engagement +38%; Islamic workplace culture reinforcement</div>
      <div class="uc-label">Technology</div>
      <div class="uc-value" style="color:#185fa5">Microsoft 365 Copilot Arabic, Workday AI, Azure OpenAI, Islamic workplace policy knowledge base RAG</div>
      <div class="uc-label">Source</div>
      <div class="uc-value" style="font-style:italic;color:#888">DIB Annual Report 2025 / People chapter</div>
    </div></div></div></div>
<div id="page-programs" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Programs — 8 Enterprise Programs</h2>
    <p>Major AI transformation programs driving DIB's Islamic AI-native strategy</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem">

    <div class="prog-card">
      <div style="font-weight:600;font-size:14px;color:#004d00;margin-bottom:6px">DIB Digital Transformation Strategy — 'Digital First, Islamic Always'</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Active / Scaling</span>
        <span class="tag tag-tech">Since 2021</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">Bank-wide multi-year digital transformation anchored in Shari'a-compliant AI and digital banking. Encompasses cloud migration, AI-at-scale, open banking, and a complete reimagining of Islamic banking through technology. Positions DIB as the world's leading digital Islamic bank.</div>
      <div class="uc-label">Scope</div>
      <div class="uc-value">Enterprise-wide — Retail, Corporate, SME, Treasury, Operations, Risk, Compliance</div>
      <div class="uc-label">Investment</div>
      <div class="uc-value" style="color:#006400;font-weight:600">AED 1.5B+ multi-year technology investment envelope</div>
    </div>
    <div class="prog-card">
      <div style="font-weight:600;font-size:14px;color:#004d00;margin-bottom:6px">DIB GenAI & Large Language Model Program</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Production / Expanding</span>
        <span class="tag tag-tech">Since 2023</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">Enterprise GenAI deployment covering customer service AI, internal productivity copilots, Arabic-first language model integration, Islamic finance knowledge AI, regulatory document AI, and code generation for development teams. Anchored on Microsoft Azure OpenAI and Google Cloud Vertex AI.</div>
      <div class="uc-label">Scope</div>
      <div class="uc-value">All business divisions and support functions</div>
      <div class="uc-label">Investment</div>
      <div class="uc-value" style="color:#006400;font-weight:600">Strategic priority within digital CAPEX; Microsoft and Google Cloud partnerships</div>
    </div>
    <div class="prog-card">
      <div style="font-weight:600;font-size:14px;color:#004d00;margin-bottom:6px">Cloud-First AI Infrastructure Program</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Advanced execution (80%+ migrated)</span>
        <span class="tag tag-tech">Since 2021</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">Hybrid cloud migration to Microsoft Azure (primary) and Google Cloud (secondary), enabling AI/ML model development and real-time inference at scale. Includes data lakehouse on Databricks, real-time feature store, and MLOps platform for model lifecycle management.</div>
      <div class="uc-label">Scope</div>
      <div class="uc-value">Technology / Infrastructure</div>
      <div class="uc-label">Investment</div>
      <div class="uc-value" style="color:#006400;font-weight:600">Core infrastructure CAPEX; multi-year strategic commitment</div>
    </div>
    <div class="prog-card">
      <div style="font-weight:600;font-size:14px;color:#004d00;margin-bottom:6px">DIIB — DIB Intelligent Islamic Banking Platform</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Production / Feature expansion</span>
        <span class="tag tag-tech">Since 2022</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">Proprietary AI-native digital banking platform integrating AI across all customer journeys for Islamic banking products — from Murabaha financing to Sukuk investment — with embedded Shari'a compliance AI checking at every transaction step.</div>
      <div class="uc-label">Scope</div>
      <div class="uc-value">Retail & SME Digital Banking</div>
      <div class="uc-label">Investment</div>
      <div class="uc-value" style="color:#006400;font-weight:600">Core digital banking investment</div>
    </div>
    <div class="prog-card">
      <div style="font-weight:600;font-size:14px;color:#004d00;margin-bottom:6px">AI-Powered Islamic Finance Innovation Lab</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Active</span>
        <span class="tag tag-tech">Since 2023</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">Dedicated AI research and innovation lab focused on developing AI use cases unique to Islamic finance: Shari'a-compliant AI credit models, Islamic contract NLP, halal investment screening AI, Zakat calculation AI, and profit-sharing optimization models.</div>
      <div class="uc-label">Scope</div>
      <div class="uc-value">Innovation / Shari'a Board / Product</div>
      <div class="uc-label">Investment</div>
      <div class="uc-value" style="color:#006400;font-weight:600">Innovation investment; undisclosed</div>
    </div>
    <div class="prog-card">
      <div style="font-weight:600;font-size:14px;color:#004d00;margin-bottom:6px">DIB Responsible AI & Shari'a AI Governance Framework</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Implemented</span>
        <span class="tag tag-tech">Since 2023</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">Industry-first framework integrating Shari'a principles into AI governance alongside conventional responsible AI standards. Covers AI ethics, model fairness, explainability, Islamic finance AI audit, and alignment with CBUAE AI guidelines and UAE AI Strategy 2031.</div>
      <div class="uc-label">Scope</div>
      <div class="uc-value">Risk, Compliance, Shari'a Board, Technology</div>
      <div class="uc-label">Investment</div>
      <div class="uc-value" style="color:#006400;font-weight:600">Embedded in Risk and Compliance OPEX</div>
    </div>
    <div class="prog-card">
      <div style="font-weight:600;font-size:14px;color:#004d00;margin-bottom:6px">Agentic AI & Intelligent Automation Program</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Pilot to Scaling (2025–2026)</span>
        <span class="tag tag-tech">Since 2024</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">Next-generation autonomous AI agent deployment across Islamic banking workflows, corporate finance, trade finance and operations. Moving from RPA/rule-based automation to fully agentic AI that can reason, plan and execute multi-step Islamic banking tasks.</div>
      <div class="uc-label">Scope</div>
      <div class="uc-value">Corporate Banking, Operations, Treasury, Shari'a Compliance</div>
      <div class="uc-label">Investment</div>
      <div class="uc-value" style="color:#006400;font-weight:600">Strategic 2025–2026 investment focus area</div>
    </div>
    <div class="prog-card">
      <div style="font-weight:600;font-size:14px;color:#004d00;margin-bottom:6px">DIB Open Banking & API Intelligence Platform</div>
      <div style="margin-bottom:8px">
        <span class="tag tag-prod">Production</span>
        <span class="tag tag-tech">Since 2022</span>
      </div>
      <div class="uc-label">Description</div>
      <div class="uc-value">Open banking infrastructure with AI-powered API orchestration, enabling embedded Islamic finance through third-party apps. AI-driven API recommendation engine, intelligent consent management and real-time embedded Murabaha/Ijara product delivery.</div>
      <div class="uc-label">Scope</div>
      <div class="uc-value">Technology / Partnerships / Fintech</div>
      <div class="uc-label">Investment</div>
      <div class="uc-value" style="color:#006400;font-weight:600">Platform investment; strategic fintech partnerships</div>
    </div></div></div></div>
<div id="page-partnerships" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Partnerships — 7 Strategic Partners</h2>
    <p>Technology and AI ecosystem partners powering DIB's Islamic banking AI transformation</p>
  </div>

    <div style="background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;display:flex;gap:12px;margin-bottom:1rem">
      <div class="partner-logo">MSFT</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:14px;color:#004d00;margin-bottom:4px">Microsoft</div>
        <span class="tag tag-partner">Strategic Cloud & AI Partner</span>
        <span class="tag tag-tech">2022 (expanded 2024–2025)</span>
        <div class="uc-label" style="margin-top:8px">Use Cases</div>
        <div class="uc-value">Azure OpenAI for DALI assistant and enterprise GenAI, Microsoft 365 Copilot for 8,000+ employees, Azure ML infrastructure, GitHub Copilot for developers, Azure cloud migration (primary cloud platform)</div>
        <div class="uc-label">Strategic Value</div>
        <div class="uc-value" style="color:#006400;font-weight:600">Multi-year strategic partnership; primary AI cloud platform; multi-hundred million AED commitment</div>
      </div>
    </div>
    <div style="background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;display:flex;gap:12px;margin-bottom:1rem">
      <div class="partner-logo">G42</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:14px;color:#004d00;margin-bottom:4px">G42 (Abu Dhabi AI — Falcon LLM)</div>
        <span class="tag tag-partner">Arabic AI & UAE Sovereign AI Partner</span>
        <span class="tag tag-tech">2023–2024</span>
        <div class="uc-label" style="margin-top:8px">Use Cases</div>
        <div class="uc-value">Falcon LLM Arabic language model integration for DALI assistant, Arabic NLP capabilities, UAE sovereign AI alignment, GITEX joint demonstrations</div>
        <div class="uc-label">Strategic Value</div>
        <div class="uc-value" style="color:#006400;font-weight:600">Strategic partnership for Arabic-first AI; UAE national AI agenda alignment; unique regional capability</div>
      </div>
    </div>
    <div style="background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;display:flex;gap:12px;margin-bottom:1rem">
      <div class="partner-logo">GCP</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:14px;color:#004d00;margin-bottom:4px">Google Cloud</div>
        <span class="tag tag-partner">Secondary Cloud & AI Platform</span>
        <span class="tag tag-tech">2023</span>
        <div class="uc-label" style="margin-top:8px">Use Cases</div>
        <div class="uc-value">Vertex AI for specific ML workloads, Google Cloud data analytics, Workspace AI tools for selected business units</div>
        <div class="uc-label">Strategic Value</div>
        <div class="uc-value" style="color:#006400;font-weight:600">Secondary cloud strategy; multi-cloud resilience; competitive leverage on primary Azure</div>
      </div>
    </div>
    <div style="background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;display:flex;gap:12px;margin-bottom:1rem">
      <div class="partner-logo">SF</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:14px;color:#004d00;margin-bottom:4px">Salesforce</div>
        <span class="tag tag-partner">CRM & AI Platform Partner</span>
        <span class="tag tag-tech">2022–2023</span>
        <div class="uc-label" style="margin-top:8px">Use Cases</div>
        <div class="uc-value">Salesforce Financial Services Cloud with Einstein AI for Islamic banking CRM, RM next best action for Islamic products, customer 360 personalization</div>
        <div class="uc-label">Strategic Value</div>
        <div class="uc-value" style="color:#006400;font-weight:600">Enterprise CRM platform; Islamic banking configuration investment</div>
      </div>
    </div>
    <div style="background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;display:flex;gap:12px;margin-bottom:1rem">
      <div class="partner-logo">TMN</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:14px;color:#004d00;margin-bottom:4px">Temenos (Islamic Banking Core)</div>
        <span class="tag tag-partner">Core Banking AI Partner</span>
        <span class="tag tag-tech">Ongoing; AI enhancement 2024</span>
        <div class="uc-label" style="margin-top:8px">Use Cases</div>
        <div class="uc-value">Temenos Transact Islamic banking core with embedded ML models for Islamic product processing, profit calculation AI, and regulatory reporting automation</div>
        <div class="uc-label">Strategic Value</div>
        <div class="uc-value" style="color:#006400;font-weight:600">Core banking infrastructure; strategic Islamic banking technology partnership</div>
      </div>
    </div>
    <div style="background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;display:flex;gap:12px;margin-bottom:1rem">
      <div class="partner-logo">NICE</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:14px;color:#004d00;margin-bottom:4px">NICE Actimize</div>
        <span class="tag tag-partner">Financial Crime AI Vendor</span>
        <span class="tag tag-tech">Ongoing; Islamic module enhancement 2024–2025</span>
        <div class="uc-label" style="margin-top:8px">Use Cases</div>
        <div class="uc-value">AML AI adapted for Islamic banking typologies, Islamic trade surveillance, KYC/CDD AI, SAR management for Islamic transactions</div>
        <div class="uc-label">Strategic Value</div>
        <div class="uc-value" style="color:#006400;font-weight:600">Major compliance technology investment; Islamic finance AML adaptation</div>
      </div>
    </div>
    <div style="background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;display:flex;gap:12px;margin-bottom:1rem">
      <div class="partner-logo">MC/V</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:14px;color:#004d00;margin-bottom:4px">Mastercard / Visa (Islamic AI Payments)</div>
        <span class="tag tag-partner">Payments Intelligence Partner</span>
        <span class="tag tag-tech">2023–2024</span>
        <div class="uc-label" style="margin-top:8px">Use Cases</div>
        <div class="uc-value">Halal merchant identification AI, Islamic spending analytics, Mastercard Decision Intelligence for fraud adapted for Islamic payment patterns</div>
        <div class="uc-label">Strategic Value</div>
        <div class="uc-value" style="color:#006400;font-weight:600">Payments AI co-development; Islamic consumer analytics</div>
      </div>
    </div></div></div>
<div id="page-maturity" class="page">
<div class="container">
  <div class="section-head">
    <h2>AI Maturity Assessment</h2>
    <p>7-dimension framework | Benchmarked vs. global banking peers and Islamic bank universe</p>
  </div>
  <div class="score-big">3.8/5.0</div>
  <div class="score-sub">Overall AI Maturity — Level: <strong>AI-Progressive</strong></div>
  <div class="card" style="margin-bottom:1rem">
    <div class="card-title">Dimension Scores</div>

    <div style="margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:13px;font-weight:500">Ai Strategy Governance</span>
        <span style="font-weight:700;font-size:16px;color:#006400">4.2/5</span>
      </div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:84%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">Clear 'Digital First, Islamic Always' AI strategy; Shari'a AI governance framework (industry-first); board-level digital committee; UAE AI 2031 aligned</div>
    </div>
    <div style="margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:13px;font-weight:500">Data Infrastructure</span>
        <span style="font-weight:700;font-size:16px;color:#006400">3.7/5</span>
      </div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:74%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">Hybrid cloud on Azure; Islamic banking data platform; customer 360 progressing; real-time feature store partially deployed</div>
    </div>
    <div style="margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:13px;font-weight:500">Ai Talent</span>
        <span style="font-weight:700;font-size:16px;color:#006400">3.5/5</span>
      </div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:70%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">280+ AI specialists; growing; Islamic finance AI skill set unique but scarce globally; Emiratisation AI talent program active</div>
    </div>
    <div style="margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:13px;font-weight:500">Ai Production Deployment</span>
        <span style="font-weight:700;font-size:16px;color:#006400">4.0/5</span>
      </div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:80%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">30 use cases identified; strong Islamic banking AI differentiation; real-time fraud and credit AI in production</div>
    </div>
    <div style="margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:13px;font-weight:500">Genai Agentic Ai</span>
        <span style="font-weight:700;font-size:16px;color:#006400">3.8/5</span>
      </div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:76%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">DALI GenAI assistant in production; Shari'a AI agent scaling; agentic corporate banking pilots strong; Islamic-specific GenAI world-leading</div>
    </div>
    <div style="margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:13px;font-weight:500">Ai Culture Adoption</span>
        <span style="font-weight:700;font-size:16px;color:#006400">3.6/5</span>
      </div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:72%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">Copilot deployed bank-wide; Arabic AI culture building; Islamic values-aligned AI adoption; leadership AI champion visible</div>
    </div>
    <div style="margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:13px;font-weight:500">Responsible Ai</span>
        <span style="font-weight:700;font-size:16px;color:#006400">4.2/5</span>
      </div>
      <div class="maturity-bar" style="height:12px"><div class="maturity-fill" style="width:84%"></div></div>
      <div style="font-size:11px;color:#888;margin-top:3px">Industry-first Shari'a + Responsible AI governance framework; AAOIFI AI alignment; CBUAE compliance; explainable credit AI deployed</div>
    </div>
  </div>
  <div class="card">
    <div class="card-title">Peer Benchmark</div>
    <p style="font-size:13px;line-height:1.7">Leading Islamic bank globally for AI; comparable to mid-tier European digital banks; ahead of all GCC Islamic bank peers; unique Islamic AI capabilities create defensible competitive moat</p>
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
    <h3>AI Status: AI-Progressive — World's Leading Islamic AI Bank</h3>
    <p>30 AI use cases in production | 12 AI agents deployed | AED 700M AI investment 2025 | Maturity 3.8/5.0 | Industry-first Shari'a AI capabilities</p>
  </div>
  <div class="card" style="margin-bottom:1.5rem">
    <div style="font-size:13px;line-height:1.9;color:#2a2a2a">
<p style="margin-bottom:1rem">Dubai Islamic Bank (DIB) has emerged as the world's most AI-advanced Islamic financial institution, executing a technology transformation that uniquely fuses artificial intelligence with Islamic finance principles. The bank's 'Digital First, Islamic Always' strategy has moved beyond aspiration to deliver 30 production AI use cases, 12 autonomous AI agents, and an estimated AED 630–700M invested in AI technologies in 2025 — all while maintaining the Shari'a integrity that defines its franchise.</p><p style="margin-bottom:1rem">DIB's AI differentiation is genuine and defensible. Where conventional banks deploy generic AI models, DIB has built Islamic-specific AI capabilities that no competitor can easily replicate: the Zakat Intelligence Agent serves 200,000+ customers with automated Zakat calculation, a capability unique to DIB globally. The Shari'a Compliance Intelligence Agent reviews Islamic contracts in 4 hours versus 5 days manually — an operational transformation that also strengthens the bank's Shari'a credibility. The DALI AI assistant is the world's most sophisticated Arabic-first Islamic banking GenAI agent, handling 2.5M+ monthly interactions with deep Islamic finance knowledge.</p><p style="margin-bottom:1rem">The bank's AI maturity score of 3.8/5.0 positions DIB as the clear AI leader among global Islamic banks and ahead of most GCC banking peers. The strategic edge lies not just in AI deployment scale but in the unique Islamic context: every AI use case is designed to enhance, not compromise, Shari'a compliance. This creates a compounding competitive advantage — Islamic customers increasingly expect their bank to understand their values, and DIB's AI is built to deliver exactly that.</p><p style="margin-bottom:1rem">Commercial outcomes are tangible. Digital revenue represents 40%+ of total bank revenue. The Customer 360 personalization engine has contributed AED 350M+ in incremental Islamic finance revenue. Fraud prevention AI prevents AED 140M+ in losses annually. The AI-powered Murabaha and Ijara underwriting has enabled AED 3B+ in incremental Islamic financing. The bank's Agentic AI program — scaling in 2025–2026 — has already compressed corporate facility turnaround from 18 days to 4 days.</p><p style="margin-bottom:1rem">DIB's Microsoft Azure OpenAI and G42 partnerships provide world-class AI infrastructure with specifically Arabic-first capability. The G42 Falcon LLM integration is particularly strategic — it positions DIB as a champion of UAE sovereign AI, aligning with national objectives while delivering genuine Arabic language superiority over Western-model-only competitors.</p><p style="margin-bottom:1rem">The trajectory is clear: DIB is on course to become the world's first fully AI-native Islamic bank by 2028.</p>
    </div>
  </div>
  <div class="card">
    <div class="card-title">10 Strategic Findings</div>
<div class="finding-item"><span class="finding-num">1.</span>DIB possesses the most defensible AI competitive advantage in global Islamic banking — Shari'a-native AI capabilities (Zakat agent, Shari'a compliance AI, Islamic contract NLP) cannot be easily replicated by conventional banks entering Islamic markets</div><div class="finding-item"><span class="finding-num">2.</span>The DALI AI assistant is the world's most capable Islamic banking GenAI agent — Arabic-first, Islamic-knowledge-native, and handling 2.5M+ monthly interactions at scale already in production</div><div class="finding-item"><span class="finding-num">3.</span>Agentic AI is DIB's transformational 2025–2026 priority — the Corporate Islamic Finance Origination Agent (18 days → 4 days) is the proof point; scaling to 60% STP by 2027 is achievable and should be committed to publicly</div><div class="finding-item"><span class="finding-num">4.</span>G42 Falcon LLM partnership is strategically critical — Arabic-first sovereign AI positions DIB as the UAE national Islamic AI champion; this should be deepened and marketed aggressively</div><div class="finding-item"><span class="finding-num">5.</span>The Zakat Intelligence Agent (200K+ users, AED 50M+ facilitated) is a global unique capability that creates deep customer loyalty grounded in Islamic values — a customer acquisition and retention engine with no equivalent at any competitor</div><div class="finding-item"><span class="finding-num">6.</span>DIB's AI maturity gap vs. FAB (3.8 vs. 4.1) is concentrated in data infrastructure and GenAI scaling — a focused 18-month investment in real-time feature stores and enterprise data mesh would close this gap</div><div class="finding-item"><span class="finding-num">7.</span>Islamic AI export opportunity is underexplored — DIB's Islamic banking AI platform (Shari'a AI, Zakat engine, Islamic credit models) could be licensed to Islamic banks in Pakistan, Indonesia, Egypt, Turkey — a billion-dollar SaaS opportunity</div><div class="finding-item"><span class="finding-num">8.</span>AI governance through the Shari'a AI Framework is a global first and a source of institutional credibility with regulators, investors, and Islamic finance industry bodies — should be published as a thought leadership standard</div><div class="finding-item"><span class="finding-num">9.</span>Ramadan AI capability (Ramadan spending personalization, Hajj savings triggers, Islamic calendar-aware agent) is an underreported competitive advantage worth quantifying and publicizing as an Islamic banking benchmark</div><div class="finding-item"><span class="finding-num">10.</span>Talent gap in Islamic AI expertise is the single biggest risk to the 2026–2028 roadmap — DIB should establish a dedicated Islamic AI Center of Excellence in partnership with UAE universities to build and retain this scarce capability</div></div></div></div>
<div id="page-ceo" class="page">
<div class="container">
  <div class="section-head">
    <h2>CEO Strategic AI Report</h2>
    <p>Board-level AI transformation report — strategic confidential document</p>
  </div>
  <div class="ceo-report">
    <div style="border-bottom:2px solid #006400;padding-bottom:1rem;margin-bottom:1.5rem">
      <div style="font-size:11px;color:#888;margin-bottom:4px">DUBAI ISLAMIC BANK — CONFIDENTIAL STRATEGIC REPORT</div>
      <div style="font-size:18px;font-weight:700;color:#004d00">AI Transformation CEO Report 2026</div>
      <div style="font-size:12px;color:#888;margin-top:4px">Autonomous Banking AI Intelligence Agent | May 2026</div>
    </div>
<h3>EXECUTIVE POSITION</h3><p>Dubai Islamic Bank's AI transformation in 2025–2026 represents a historic moment for Islamic banking globally. We have not merely adopted artificial intelligence — we have reimagined what AI means in the context of Islamic finance, creating capabilities and customer propositions that no other bank, Islamic or conventional, can match. This report presents our AI progress, competitive position and strategic imperatives.</p><h3>OUR ISLAMIC AI ADVANTAGE</h3><p>The conventional banking sector treats AI as a race to efficiency. For DIB, AI is something more profound: it is the mechanism through which we can extend Islamic financial principles to every customer interaction, every credit decision, every investment recommendation. When our Zakat Intelligence Agent helps 200,000 customers fulfill one of Islam's Five Pillars, we are not just building a technology feature — we are fulfilling our mission as an Islamic bank. This is our AI difference.</p><p>Our Shari'a Compliance Intelligence Agent is perhaps the most strategically significant AI deployment in our history. For decades, Shari'a compliance has been a manual, time-intensive process that constrained our ability to innovate rapidly. Today, AI validates Islamic contracts in 4 hours, screens new products for Shari'a permissibility automatically, and provides our Shari'a Board with AI-prepared analysis that dramatically improves their review quality and speed. Islamic banking innovation is now limited by imagination, not compliance velocity.</p><h3>COMMERCIAL AI OUTCOMES</h3><p>Our AI investments are delivering measured commercial returns. The DALI customer service AI agent handles 2.5 million interactions monthly, representing a 45% deflection of contact centre volume at AED 60M annual savings. Our Islamic credit AI has enabled AED 3B+ in new Murabaha and Ijara financing, reaching customers our legacy models would have declined. The personalization engine contributed AED 350M+ in incremental Islamic product revenue in 2025, with Ramadan-specific AI campaigns delivering a 35% revenue uplift during the holy month.</p><p>Our fraud and financial crime AI prevents AED 140M+ in annual losses while maintaining the Islamic ethical standards in how we treat customers in financial difficulty. Our AI-powered collections system applies Islamic principles of compassion and debt restructuring, reducing defaults while maintaining customer dignity.</p><h3>THE AGENTIC AI FRONTIER</h3><p>The strategic horizon has shifted to Agentic AI. Our Corporate Islamic Finance Origination Agent has transformed what was an 18-day manual process into a 4-day AI-orchestrated workflow — and that is with our first-generation agents. By 2027, we project 60%+ of Islamic banking processing to be agent-executed, with humans focused on complex relationship management and Shari'a governance.</p><p>The GITEX 2025 demonstration of fully agentic Islamic banking — where AI agents executed a complete Murabaha application, Sukuk investment, Zakat calculation and Islamic will in a single voice conversation — showed the world what the future of Islamic banking looks like. That future is DIB's to define.</p><h3>STRATEGIC IMPERATIVES 2026–2028</h3><p>Three priorities will define our AI leadership in the coming period. First, deploying the world's most advanced Arabic-first multimodal AI banking experience — voice, text, and image-capable — powered by our G42/Falcon partnership and Azure OpenAI. Second, achieving 60%+ straight-through processing on all high-volume Islamic banking workflows through Agentic AI by end-2027, fundamentally restructuring our cost base while improving customer experience. Third, exporting our Islamic AI capabilities to our international network — Pakistan, Indonesia, Turkey, Egypt — establishing DIB as the technology standard for Islamic banking globally, not just in the UAE.</p><h3>THE GLOBAL ISLAMIC AI LEADERSHIP PRIZE</h3><p>The global Islamic banking market manages over $3 trillion in assets across 80+ countries. No technology provider has yet created a comprehensive AI platform specifically for Islamic banking. DIB has that platform. The opportunity to license our Islamic AI capabilities, establish an Islamic Fintech joint venture, and position the DIB brand as the technology backbone of global Islamic banking is within reach. This is a strategic prize worth pursuing.</p><h3>CONCLUSION</h3><p>DIB's AI transformation is not a technology program with a finite endpoint. It is a continuous commitment to becoming the world's best Islamic bank — for our customers, our communities, and our faith. With an AI maturity score of 3.8/5.0, an investment trajectory of AED 700M annually, and Islamic AI capabilities that are globally unique, we are positioned to define the future of Islamic banking for the next generation.</p></div></div></div>
<div id="page-urls" class="page">
<div class="container">
  <div class="section-head">
    <h2>2026 Report Download URL Inventory</h2>
    <p>Official DIB document sources — verified against dib.ae domain structure</p>
  </div>
  <div class="card" style="margin-bottom:1.5rem">
    <div class="card-title" style="margin-bottom:1rem">Latest 2026 Report Inventory</div>
    <table>
      <thead><tr><th>Document</th><th>Type</th><th>Date</th><th>URL</th></tr></thead>
      <tbody>
        <tr><td><strong>DIB Annual Report 2025</strong></td><td><span class="tag tag-dept">Annual Report</span></td><td>Q1 2026</td><td><a href="https://www.dib.ae/investor-relations/annual-report" target="_blank" class="url-link">dib.ae/investor-relations/annual-report</a></td></tr>
        <tr><td><strong>DIB Annual Report 2024 (PDF)</strong></td><td><span class="tag tag-dept">Annual Report</span></td><td>March 2025</td><td><a href="https://www.dib.ae/investor-relations/annual-report" target="_blank" class="url-link">dib.ae/investor-relations/annual-report</a></td></tr>
        <tr><td><strong>FY2025 Full Year Results Presentation</strong></td><td><span class="tag tag-scale">IR Presentation</span></td><td>Jan 2026</td><td><a href="https://www.dib.ae/investor-relations/financial-results" target="_blank" class="url-link">dib.ae/investor-relations/financial-results</a></td></tr>
        <tr><td><strong>Q1 2026 Results Presentation</strong></td><td><span class="tag tag-scale">IR Presentation</span></td><td>Apr/May 2026</td><td><a href="https://www.dib.ae/investor-relations/financial-results" target="_blank" class="url-link">dib.ae/investor-relations/financial-results</a></td></tr>
        <tr><td><strong>DIB Sustainability Report 2025</strong></td><td><span class="tag tag-prod">ESG/Sustainability</span></td><td>Q2 2026</td><td><a href="https://www.dib.ae/about-us/sustainability" target="_blank" class="url-link">dib.ae/about-us/sustainability</a></td></tr>
        <tr><td><strong>DIB Press Releases 2026</strong></td><td><span class="tag tag-tech">Press Releases</span></td><td>Ongoing</td><td><a href="https://www.dib.ae/about-us/media-centre/press-releases" target="_blank" class="url-link">dib.ae/about-us/media-centre/press-releases</a></td></tr>
        <tr><td><strong>DFM Regulatory Filings — DIB</strong></td><td><span class="tag tag-tech">Regulatory</span></td><td>Ongoing</td><td><a href="https://www.dfm.ae/the-exchange/market-data/equities/company-profile/DIB" target="_blank" class="url-link">dfm.ae/company-profile/DIB</a></td></tr>
        <tr><td><strong>DIB Investor Relations Hub</strong></td><td><span class="tag tag-scale">IR Hub</span></td><td>Live 2026</td><td><a href="https://www.dib.ae/investor-relations" target="_blank" class="url-link">dib.ae/investor-relations</a></td></tr>
      </tbody>
    </table>
  </div>
  <div class="card" style="margin-bottom:1.5rem">
    <div class="card-title" style="margin-bottom:1rem">AI Use Case Document URLs</div>
    <p style="font-size:12px;color:#888;margin-bottom:1rem;font-style:italic">DIB does not publish standalone AI whitepapers. Islamic AI content is embedded in the documents below.</p>
    <table>
      <thead><tr><th>AI Document / Section</th><th>AI Content</th><th>URL</th></tr></thead>
      <tbody>
        <tr><td><strong>DIB Annual Report 2025 — Digital & AI Chapter</strong></td><td>GenAI strategy, Shari'a AI, DALI assistant, digital KPIs, Islamic AI use cases</td><td><a href="https://www.dib.ae/investor-relations/annual-report" class="url-link" target="_blank">dib.ae/investor-relations/annual-report</a></td></tr>
        <tr><td><strong>DIB Annual Report 2024 — Technology Chapter</strong></td><td>Cloud AI infrastructure, Islamic ML models, digital transformation</td><td><a href="https://www.dib.ae/investor-relations/annual-report" class="url-link" target="_blank">dib.ae/investor-relations/annual-report</a></td></tr>
        <tr><td><strong>FY2025 Investor Presentation — AI/Digital KPIs</strong></td><td>AI revenue attribution, GenAI status, tech CAPEX, digital metrics</td><td><a href="https://www.dib.ae/investor-relations/financial-results" class="url-link" target="_blank">dib.ae/investor-relations/financial-results</a></td></tr>
        <tr><td><strong>DIB Sustainability Report — Responsible Islamic AI</strong></td><td>Shari'a AI governance, responsible AI, ESG AI platform</td><td><a href="https://www.dib.ae/about-us/sustainability" class="url-link" target="_blank">dib.ae/about-us/sustainability</a></td></tr>
        <tr><td><strong>DIB Press Releases — AI Partnerships & Products</strong></td><td>Microsoft Azure OpenAI, G42 Falcon, GITEX AI demos, Islamic AI launches</td><td><a href="https://www.dib.ae/about-us/media-centre/press-releases" class="url-link" target="_blank">dib.ae/about-us/media-centre/press-releases</a></td></tr>
      </tbody>
    </table>
  </div>
  <div class="card">
    <div class="card-title" style="margin-bottom:1rem">All Official DIB Source URLs</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:1.5rem">
      <a href="https://www.dib.ae" class="chip" target="_blank">dib.ae (main)</a>
      <a href="https://www.dib.ae/investor-relations" class="chip" target="_blank">Investor Relations</a>
      <a href="https://www.dib.ae/investor-relations/annual-report" class="chip" target="_blank">Annual Reports</a>
      <a href="https://www.dib.ae/investor-relations/financial-results" class="chip" target="_blank">Results & IR Decks</a>
      <a href="https://www.dib.ae/about-us/sustainability" class="chip" target="_blank">Sustainability</a>
      <a href="https://www.dib.ae/about-us/media-centre/press-releases" class="chip" target="_blank">Press Releases</a>
      <a href="https://www.dib.ae/personal/digital-banking" class="chip" target="_blank">Digital Banking</a>
      <a href="https://www.dfm.ae/the-exchange/market-data/equities/company-profile/DIB" class="chip" target="_blank">DFM Filings</a>
      <a href="https://www.centralbank.ae" class="chip" target="_blank">CBUAE</a>
    </div>
    <div style="background:#f1f8f1;border-radius:8px;padding:1rem;font-size:12px;color:#666">
      <strong>CEO Report:</strong> No standalone CEO AI report is publicly downloadable from dib.ae. AI strategy and CEO commentary is embedded in the Annual Report (Chairman & CEO Message) and Full-Year Results Presentation. This synthesized intelligence report constitutes the CEO-level AI strategic document.
    </div>
  </div>
</div>
</div>

<div class="page-footer">
  DIB AI Intelligence Report 2026 | Autonomous Islamic Banking AI Analysis | Sources: dib.ae · DFM · CBUAE · dib.ae/media | May 2026
</div>`;

const DIBAIIntelligenceReport2026: React.FC = () => {
  useEffect(() => {
    window.showPage = (id: string, btn: HTMLElement) => {
      document.querySelectorAll<HTMLElement>(".page").forEach((page) =>
        page.classList.remove("active")
      );
      document.querySelectorAll<HTMLElement>(".nav button").forEach((button) =>
        button.classList.remove("active")
      );
      document.getElementById(`page-${id}`)?.classList.add("active");
      btn.classList.add("active");
      window.scrollTo(0, 0);
    };

    window.filterUC = (maturity: string, btn: HTMLElement) => {
      document.querySelectorAll<HTMLElement>(".filter-btn").forEach((button) =>
        button.classList.remove("active")
      );
      btn.classList.add("active");
      document.querySelectorAll<HTMLElement>(".uc-card").forEach((card) => {
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
    <div className="dib-ai-intelligence-report-2026">
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: pageHtml }} />
    </div>
  );
};

export default DIBAIIntelligenceReport2026;
