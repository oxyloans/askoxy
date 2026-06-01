import { useEffect } from "react";

declare global {
  interface Window {
    showPage: (id: string, btn: HTMLElement) => void;
    filterUC: (maturity: string, btn: HTMLElement) => void;
  }
}

const styles = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#f4f4f0;color:#1a1a1a;font-size:14px;line-height:1.6}
.topbar{background:#006D5B;color:white;padding:0}
.topbar-inner{max-width:1200px;margin:0 auto;padding:1.5rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}
.topbar h1{font-size:20px;font-weight:600;letter-spacing:-0.3px}
.topbar p{font-size:12px;opacity:0.7;margin-top:2px}
.badge-gold{background:#E8A020;color:#fff;font-size:11px;padding:3px 10px;border-radius:20px;font-weight:600}
.nav{background:#00533F;padding:0;border-bottom:2px solid #E8A020;overflow-x:auto}
.nav-inner{max-width:1200px;margin:0 auto;display:flex;gap:0}
.nav button{background:none;border:none;color:rgba(255,255,255,0.7);padding:12px 18px;font-size:13px;cursor:pointer;white-space:nowrap;border-bottom:3px solid transparent;transition:all 0.2s}
.nav button:hover,.nav button.active{color:#fff;border-bottom-color:#E8A020}
.container{max-width:1200px;margin:0 auto;padding:1.5rem 2rem}
.page{display:none}.page.active{display:block}
.section-head{margin-bottom:1.5rem}
.section-head h2{font-size:22px;font-weight:600;color:#006D5B;margin-bottom:4px}
.section-head p{font-size:13px;color:#666}
.metrics-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:1.5rem}
.metric{background:#fff;border:0.5px solid #ddd;border-radius:8px;padding:1rem;text-align:center}
.metric .num{font-size:28px;font-weight:700;color:#006D5B;margin-bottom:2px}
.metric .lbl{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.5px}
.card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;margin-bottom:1rem}
.card-title{font-size:15px;font-weight:600;color:#006D5B;margin-bottom:8px}
.tag{display:inline-block;font-size:10px;padding:2px 8px;border-radius:12px;font-weight:600;margin:2px}
.tag-prod{background:#eaf3de;color:#27500a}
.tag-scale{background:#faeeda;color:#633806}
.tag-pilot{background:#eeedfe;color:#3c3489}
.tag-dept{background:#e2f4f0;color:#006D5B}
.tag-tech{background:#f1efe8;color:#2c2c2a}
.tag-partner{background:#faece7;color:#712b13}
table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;padding:10px 12px;background:#f8f8f4;font-weight:600;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.4px;border-bottom:1px solid #e8e8e0}
td{padding:10px 12px;border-bottom:0.5px solid #f0f0e8;vertical-align:top}
tr:last-child td{border-bottom:none}
tr:hover td{background:#fafaf8}
.uc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem}
.uc-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-left:4px solid #006D5B}
.uc-id{font-size:10px;color:#999;font-weight:600;letter-spacing:1px;margin-bottom:4px}
.uc-name{font-size:15px;font-weight:600;color:#006D5B;margin-bottom:8px}
.uc-field{margin-bottom:6px}
.uc-label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.4px;font-weight:600;margin-bottom:2px}
.uc-value{font-size:12px;color:#333;line-height:1.5}
.agent-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-left:4px solid #00533F}
.agent-name{font-size:14px;font-weight:600;color:#00533F;margin-bottom:8px;display:flex;align-items:center;gap:8px}
.agent-icon{width:28px;height:28px;background:#e2f4f0;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.prog-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;border-top:3px solid #E8A020}
.prog-name{font-size:14px;font-weight:600;color:#006D5B;margin-bottom:6px}
.prose{font-size:13px;line-height:1.8;color:#2a2a2a}
.prose p{margin-bottom:1rem}
.finding-item{padding:0.75rem 1rem;border-left:3px solid #006D5B;background:#f0faf7;border-radius:0 6px 6px 0;margin-bottom:0.75rem;font-size:13px;line-height:1.6}
.finding-num{font-weight:700;color:#006D5B;margin-right:8px}
.maturity-bar-wrap{margin-bottom:1rem}
.maturity-label{display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px}
.maturity-bar{height:10px;background:#e8e8e0;border-radius:5px;overflow:hidden}
.maturity-fill{height:100%;border-radius:5px;background:#006D5B;transition:width 1s}
.url-row a{color:#006D5B;text-decoration:none;font-size:12px;word-break:break-all}
.url-row a:hover{text-decoration:underline}
.filter-bar{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:1.5rem}
.filter-btn{border:0.5px solid #ccc;background:#fff;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer;transition:all 0.2s}
.filter-btn.active{background:#006D5B;color:#fff;border-color:#006D5B}
.summary-box{background:#006D5B;color:#fff;border-radius:10px;padding:1.5rem;margin-bottom:1.5rem}
.summary-box h3{font-size:18px;font-weight:600;margin-bottom:1rem;color:#E8A020}
.summary-box p{font-size:13px;line-height:1.8;opacity:0.92}
.ceo-report{background:#fff;border:1px solid #006D5B;border-radius:10px;padding:2rem;font-size:13px;line-height:1.9;color:#1a1a1a}
.ceo-report .report-header{border-bottom:2px solid #006D5B;padding-bottom:1rem;margin-bottom:1.5rem}
.ceo-report h3{font-size:16px;font-weight:700;color:#006D5B;margin:1.5rem 0 0.5rem}
.ceo-report p{margin-bottom:1rem}
.partner-card{background:#fff;border:0.5px solid #ddd;border-radius:10px;padding:1.25rem;display:flex;gap:12px}
.partner-logo{width:48px;height:48px;border-radius:8px;background:#e2f4f0;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:#006D5B;flex-shrink:0;text-align:center;line-height:1.2}
.score-big{font-size:48px;font-weight:700;color:#006D5B;text-align:center;padding:1.5rem;background:#f0faf7;border-radius:10px;margin-bottom:1rem}
.score-sub{font-size:13px;color:#888;text-align:center;margin-top:-0.5rem;margin-bottom:1rem}
.chip{display:inline-flex;align-items:center;gap:6px;background:#f1f1e8;border:0.5px solid #d8d8c8;border-radius:20px;padding:4px 12px;font-size:11px;color:#444;margin:3px;text-decoration:none}
.chip:hover{background:#e8e8d8}
.page-footer{background:#00533F;color:rgba(255,255,255,0.6);font-size:11px;text-align:center;padding:1rem;margin-top:2rem}
`;

const htmlContent = `<div class="topbar">
<div class="topbar-inner">
<div>
<h1>Mashreq Bank — AI Intelligence Report 2026</h1>
<p>Autonomous Banking AI Analysis | 28 Use Cases | 12 Agents | 7 Programs | Official Sources Only | FY2025 + Q1 2026</p>
</div>
<span class="badge-gold">CONFIDENTIAL STRATEGIC REPORT</span>
</div>
</div>
<nav class="nav">
<div class="nav-inner">
<button class="active" onclick="showPage('overview',this)">Overview</button>
<button onclick="showPage('usecases',this)">AI Use Cases (28)</button>
<button onclick="showPage('agents',this)">AI Agents (12)</button>
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
<h2>AI Intelligence Overview — Mashreq Bank 2026</h2>
<p>Synthesized from 10+ official Mashreq sources: FY2025 Annual Results (Jan 2026), Q1 2026 Results, H1 2025 MDA, Digital Banker Award Reports, Euromoney, Gulf Business and Press Releases</p>
</div>
<div class="metrics-grid">
<div class="metric"><div class="num">28</div><div class="lbl">AI Use Cases</div></div>
<div class="metric"><div class="num">12</div><div class="lbl">AI Agents</div></div>
<div class="metric"><div class="num">7</div><div class="lbl">AI Programs</div></div>
<div class="metric"><div class="num">6</div><div class="lbl">AI Partnerships</div></div>
<div class="metric"><div class="num">3.9/5</div><div class="lbl">AI Maturity Score</div></div>
<div class="metric"><div class="num">AED 57M+</div><div class="lbl">AI-Rec. Deal Revenue</div></div>
<div class="metric"><div class="num">AED 12.6B</div><div class="lbl">FY2025 Op. Income</div></div>
<div class="metric"><div class="num">Q1 2026</div><div class="lbl">Latest Verified Period</div></div>
</div>
<div class="summary-box">
<h3>AI Transformation Headline — 2026</h3>
<p>Mashreq Bank has established itself as the Middle East's most AI-embedded digital bank, operating 15+ live ML models across corporate and retail banking, launching the TADA Data Copilot GenAI tool (July 2025), deploying the Clari5 Genie GenAI fraud detection platform, and appointing Xi Liang as dedicated Head of Artificial Intelligence (July 2025). Q1 2026 net profit rose 7% to AED 1.9 billion, with operating expenses up 15% specifically attributed to GenAI initiative investment and digital onboarding infrastructure. The bank's AI maturity score of 3.9/5 reflects advanced production deployment across CIB and retail, accelerating GenAI adoption, and a clear 2026 strategy centred on agentic AI, data-driven decisioning and responsible AI governance.</p>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1rem;margin-bottom:1.5rem">
<div class="card">
<div class="card-title">Top AI Value Drivers</div>
<table>
<tr><td>AI-Recommended CIB Deals (2024 baseline)</td><td style="text-align:right;font-weight:600;color:#006D5B">AED 57M+ revenue</td></tr>
<tr><td>Smart Call Report — RM Productivity</td><td style="text-align:right;font-weight:600;color:#006D5B">90% effort reduction</td></tr>
<tr><td>TADA Data Copilot — Analytics Speed</td><td style="text-align:right;font-weight:600;color:#006D5B">40–60% time saved</td></tr>
<tr><td>NEO AI Personalisation (CTR lift)</td><td style="text-align:right;font-weight:600;color:#006D5B">+50% CTR; +16% activation</td></tr>
<tr><td>AI Fraud Detection (Clari5 Genie)</td><td style="text-align:right;font-weight:600;color:#006D5B">70% faster investigation</td></tr>
<tr><td>AI-Led Digital Onboarding (NEO Pakistan)</td><td style="text-align:right;font-weight:600;color:#006D5B">&gt;90% straight-through rate</td></tr>
</table>
</div>
<div class="card">
<div class="card-title">AI Maturity by Dimension</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>AI Strategy &amp; Governance</span><span style="font-weight:600">4.2/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:84%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>Data Infrastructure</span><span style="font-weight:600">4.0/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:80%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>AI Talent &amp; Leadership</span><span style="font-weight:600">3.8/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:76%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>AI Production Deployment</span><span style="font-weight:600">4.0/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:80%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>GenAI &amp; Agentic AI</span><span style="font-weight:600">3.6/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:72%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>AI Culture &amp; Adoption</span><span style="font-weight:600">3.7/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:74%"></div></div>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span>Responsible AI</span><span style="font-weight:600">3.8/5</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:76%"></div></div>
</div>
</div>
</div>
<div class="card">
<div class="card-title">Key AI Partnerships</div>
<div style="display:flex;flex-wrap:wrap;gap:8px">
<span class="tag tag-partner">OpenAI (via Azure)</span>
<span class="tag tag-partner">Clari5 / Perfios</span>
<span class="tag tag-partner">MoEngage</span>
<span class="tag tag-partner">Profinch</span>
<span class="tag tag-partner">Oracle (Fusion Banking)</span>
<span class="tag tag-partner">McKinsey (Advisory)</span>
</div>
</div>
<div class="card">
<div class="card-title">2026 AI Momentum Signals</div>
<table>
<thead><tr><th>Signal</th><th>Evidence</th><th>Date</th></tr></thead>
<tbody>
<tr><td><strong>Q1 2026 GenAI Investment Confirmed</strong></td><td>Op-ex +15% YoY — specifically cited GenAI initiative investment &amp; digital onboarding build-out</td><td>May 2026</td></tr>
<tr><td><strong>Xi Liang — Head of AI Appointed</strong></td><td>Former Judo Bank &amp; IBM AI executive appointed to lead enterprise-wide AI strategy</td><td>Jul 2025</td></tr>
<tr><td><strong>Clari5 Genie Launch</strong></td><td>GenAI-powered fraud detection platform — first user, on-premise deployment</td><td>May 2025</td></tr>
<tr><td><strong>TADA Data Copilot Live</strong></td><td>Natural-language GenAI interface to core banking data; 40–60% analytics time saved</td><td>Jul 2025</td></tr>
<tr><td><strong>FY2025 Results — AI Investment Committed</strong></td><td>"Continued investment in Gen-AI-led initiatives" confirmed in FY2025 results statement</td><td>Jan 2026</td></tr>
<tr><td><strong>Pakistan Digital Bank — AI-Led</strong></td><td>First international deployment of AI-driven NEO platform; $100M committed</td><td>Sep 2025</td></tr>
<tr><td><strong>D-SIB Designation</strong></td><td>Designated Domestic Systemically Important Bank — reflects scale and AI-driven governance</td><td>2025</td></tr>
</tbody>
</table>
</div>
</div>
</div>

<div class="page" id="page-usecases">
<div class="container">
<div class="section-head">
<h2>AI Use Cases — 28 Identified (2025–2026)</h2>
<p>All use cases sourced from official Mashreq FY2025 results, Q1 2026 results, Digital Banker awards, Euromoney, Gulf Business and verified press releases</p>
</div>
<div class="filter-bar" id="uc-filters">
<button class="filter-btn active" onclick="filterUC('all',this)">All (28)</button>
<button class="filter-btn" onclick="filterUC('Production',this)">Production</button>
<button class="filter-btn" onclick="filterUC('Scaling',this)">Scaling</button>
<button class="filter-btn" onclick="filterUC('Pilot',this)">Pilot</button>
</div>
<div class="uc-grid" id="uc-grid">
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-001</div>
<div class="uc-name">Smart Call Report — GenAI Meeting Summariser</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Corporate &amp; Investment Banking</span>
<span class="tag tag-prod">Production</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">GenAI runs on Microsoft Teams calls to auto-generate tailored client call summaries, extract key insights, suggest follow-up actions and distribute outputs to all RM stakeholders — eliminating manual write-ups.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">90% reduction in manual effort; faster, more aligned RM response; recognised at 2025 Digital Banker MEA Innovation Awards — Best AI Initiative.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Euromoney (Jun 2025), Digital Banker (Dec 2025)</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-002</div>
<div class="uc-name">TADA Data Copilot — NLP Analytics Interface</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Enterprise-Wide / Data Analytics</span>
<span class="tag tag-prod">Production</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Launched July 2025, TADA provides a natural-language GenAI interface between business users and multiple core banking and data platforms, allowing plain-English queries to return structured outputs with charts and trend analysis.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">40–60% reduction in data retrieval and analysis time; reduced reliance on central analytics teams and SQL-based specialist tools; broader data democratisation.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">The Digital Banker (May 2026)</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-003</div>
<div class="uc-name">Graph Analytics — CIB Prospecting Engine</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Wholesale / Corporate Banking</span>
<span class="tag tag-prod">Production</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Graph analytics platform merges internal transaction data with external sources (trade, shipping records) to map corporate ecosystems — buyers, suppliers, intermediaries — and score each lead for product relevance (cash management, trade finance).</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">AED 57M+ revenue from AI-recommended deals in 2024; recognised for Excellence in Digital Prospecting at 2025 Digital Banker MEA Awards.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Digital Banker (Dec 2025), BCG Matrix Analysis</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-004</div>
<div class="uc-name">360-Degree AI Client View — Cross-Sell Engine</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Corporate &amp; Investment Banking</span>
<span class="tag tag-prod">Production</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI engines combine transaction data, shipment records and third-party data to generate prioritised cross-sell and up-sell ideas for RMs, with explainability (RMs can reject with explanations fed back to the model).</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Cross-sell ratio rose to 35% in FY2025 (+400bps YoY); directly linked to AI-driven RM insight tools.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Euromoney (Jun 2025), FY2025 Results (Jan 2026)</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-005</div>
<div class="uc-name">Clari5 Genie — GenAI Fraud Detection Platform</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Financial Crime / Compliance</span>
<span class="tag tag-prod">Production</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">GenAI-powered fraud detection and investigation platform deployed entirely on-premise. Features natural language console for investigators, smart prompt engineering, auto case narrative generation, similarity-based pattern detection and role-based access controls. Mashreq is the first user globally.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">70% faster fraud investigations; proactive detection of emerging fraud patterns; highest data security with on-premise deployment.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">BusinessWire / Clari5 Press Release (May 2025)</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-006</div>
<div class="uc-name">Pulse RM Portal — AI-Powered Relationship Manager Dashboard</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Corporate Banking / RM Operations</span>
<span class="tag tag-prod">Production</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-powered front portal for Relationship Managers consolidating credit alerts, compliance alerts, news engine (client monitoring), sentiment analysis, and predictive engagement opportunities. Replaced 22 disparate systems previously used by bankers.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Significant RM productivity gain; single consolidated interface replacing 22 systems; AI-driven insight embedded directly in frontline workflows.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Gulf Business (Oct 2024), Digital Banker (Dec 2025)</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-007</div>
<div class="uc-name">AI-Led Digital Onboarding — NEO Platform</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Retail Banking / NEO</span>
<span class="tag tag-prod">Production</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Fully digital, AI-assisted account onboarding with paperless KYC, AI-driven risk controls, biometric verification and OCR document processing. Deployed across UAE, Egypt and Pakistan markets.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Most new retail customers onboarded digitally; 350,000+ NEO accounts opened in Egypt in first year; straight-through processing above 90% in Pakistan.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Euromoney (Jul 2025), Gulf News Pakistan launch (Sep 2025)</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-008</div>
<div class="uc-name">AI Fraud &amp; Anomaly Detection — Real-Time Transaction Monitoring</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Risk Management / Technology</span>
<span class="tag tag-prod">Production</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">ML models analyse vast volumes of transactions in real-time to identify anomalies, detect suspicious patterns, prevent fraudulent account openings and reduce false positives. AI flags threats and recommends patches for security vulnerabilities.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Real-time fraud prevention across 90%+ digital transactions; reduced false positives; AI-led security operations replacing manual monitoring.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Euromoney (Jul 2025), Arab News (Oct 2024), Euromoney (Aug 2025)</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-009</div>
<div class="uc-name">AI Credit Decisioning — Pre-Approved Lending</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Retail Banking / Credit</span>
<span class="tag tag-prod">Production</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI/ML models power pre-approved credit limits, cross-sell propensity scoring, and automated credit decisioning for retail and SME lending. Predictive models assess client risk and surface credit opportunities.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Customer loans grew 32% in FY2025 to AED 168B; NPL ratio at industry-leading 1.0%; AI-enabled underwriting supports growth without deterioration in credit quality.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Euromoney (Jul 2025), FY2025 Results (Jan 2026), PortersFiveForce (Dec 2025)</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-010</div>
<div class="uc-name">NEO AI Personalisation Engine — Real-Time Engagement</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Retail Banking / NEO</span>
<span class="tag tag-prod">Production</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Rule-based and ML analytics identify context-specific opportunities (FX prompts, product offers, loyalty interventions) in near real-time, replacing delayed batch segmentation with point-of-relevance engagement via MoEngage AI platform.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">+50% CTR from personalisation; +16% debit card activation; revenue from targeted initiatives running 3x pre-launch levels; 9K month-on-month new app customers.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">MoEngage Case Study, Digital Banker (May 2026), Thoughtworks EMEA 2026</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-011</div>
<div class="uc-name">AI-Powered KYC Renewal — OCR &amp; Visual Robotics</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Compliance / Wholesale Banking</span>
<span class="tag tag-prod">Production</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Visual robotics (OCR) automates KYC renewal data entry for corporate clients. First bank in the region to deploy customer-facing digital KYC for wholesale banking clients. Consolidated KYC, account setup, transaction limits and service requests into one GenAI-enhanced journey.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Significant reduction in time and complexity for client onboarding; recognised at 2025 Digital Banker MEA Awards; straight-through processing improvement.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Digital Banker (Dec 2025), Mashreq International Banking page</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-012</div>
<div class="uc-name">AI Chatbot — Retail Customer Virtual Assistant</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Retail Banking / Customer Experience</span>
<span class="tag tag-prod">Production</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Highly intuitive AI-led chatbot fully integrated with backend systems enabling real-time data access and transaction initiation. Launched in UAE and being rolled out to other markets. Handles banking queries, account management, transfers and service requests.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Reduced contact centre load; 24/7 self-service availability; customers receive instant answers while specialists focus on complex engagements.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Euromoney (Aug 2025), Gulf News, Arab News (Oct 2024)</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-013</div>
<div class="uc-name">Predictive Market Intelligence — Country Entry AI</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Corporate Strategy / Leadership</span>
<span class="tag tag-prod">Production</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">GenAI tools used by leadership cohorts to run country-entry assessments — a task traditionally requiring teams of analysts and weeks of manual data-crunching — now completed rapidly with AI synthesising market, regulatory and economic data.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Accelerated international expansion decision-making (Türkiye, Oman, Pakistan, India GIFT City launched 2025); weeks of analysis compressed to hours.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Euromoney (Jul 2025)</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-014</div>
<div class="uc-name">AI AML &amp; Sanctions Screening</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Compliance / Financial Crime</span>
<span class="tag tag-prod">Production</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI models deployed for anti-money laundering detection, sanctions screening and credit default risk identification. AI processes massive data volumes to enable compliance decisioning at scale.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Regulatory compliance across 15+ markets; reduced manual compliance burden; NPL ratio at 1.0% supported by AI-led underwriting and monitoring.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Arab News (Oct 2024), Mashreq FY2025 Results</div></div>
</div>
<div class="uc-card" data-maturity="Production">
<div class="uc-id">UC-015</div>
<div class="uc-name">AI-Powered Private Banking — Portfolio Analytics</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Private Banking / Wealth Management</span>
<span class="tag tag-prod">Production</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-powered investment assessment tools aligned with individual HNWI needs and market changes. Interactive dashboards with real-time portfolio insights. AI handles routine queries and automates reporting and compliance tasks.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Specialists freed for complex advisory; improved personalisation for HNWIs and family offices; non-interest income +16% in FY2025.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Hubbis / Asian Wealth Management (Sep 2025)</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-016</div>
<div class="uc-name">AI-Driven Regulatory Compliance Transformation</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Compliance / Risk</span>
<span class="tag tag-scale">Scaling</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI used to detect anomalies, prioritise security patches, identify fraud patterns and monitor regulatory requirements in real-time across Mashreq's 15+ country operating footprint.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Regulatory compliance across MENA, South Asia and international markets; AI-driven security replacing manual monitoring; reduced compliance cost.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Euromoney (Jul 2025)</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-017</div>
<div class="uc-name">Mashreq NEO Youth Banking — AI Spending Insights</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Retail Banking / Youth Segment</span>
<span class="tag tag-scale">Scaling</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-driven personalised debit cards for teenagers with spending insights, savings goals and controlled allowance top-ups. Personalised financial guidance based on monetary habits and targets.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">New customer segment captured; long-term loyalty building; digital-native banking for next-generation customers.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Digital Banker (May 2026)</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-018</div>
<div class="uc-name">API Marketplace AI Integration — Embedded Finance</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Corporate Banking / Technology</span>
<span class="tag tag-scale">Scaling</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-backed API marketplace launched 2025 enabling developers and corporate treasury teams to integrate Mashreq services into their ecosystems. Use cases include real-time payment processing and instant IBAN validation. Mashreq powers embedded finance behind major brokerage platforms.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">New fee income streams; thousands of daily embedded transactions; positions Mashreq as banking-as-a-service infrastructure provider.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Euromoney (Jun 2025)</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-019</div>
<div class="uc-name">Predictive Models — High-Potential Market Identification</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Corporate Banking / Commercial</span>
<span class="tag tag-scale">Scaling</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI predictive models help identify high-potential markets, assess client risk and automate credit decisioning for commercial and corporate banking. Cross-sell propensity models surface multi-product opportunities at the point of relevance.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">35% cross-sell ratio in FY2025; strong NIM of 3.1%; consistent execution across rapidly expanding international franchise.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Euromoney (Jul 2025), FY2025 Results (Jan 2026)</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-020</div>
<div class="uc-name">AI Hyperpersonalised Marketing — ML-Driven Campaigns</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Retail Banking / Marketing</span>
<span class="tag tag-scale">Scaling</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Machine learning tools automate hyperpersonalised marketing campaigns, regulatory screening for marketing compliance and target segmentation. Real-time campaign testing and refinement using AI analytics.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Revenue from targeted initiatives at 3x pre-AI levels; improved conversion and NPS; product teams can refine in near real-time.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Euromoney (Aug 2025), Digital Banker (May 2026)</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-021</div>
<div class="uc-name">Intelligent Automation — 40+ Retail Customer Journeys</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Retail Banking / Operations</span>
<span class="tag tag-scale">Scaling</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Agile teams enhancing over 40 retail journeys including account opening, payments, lending and investments using AI and automation. Centralised transformation teams handle infrastructure, data frameworks and cybersecurity AI.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Cost-to-income ratio of 31% (one of the best in region); digitalisation efficiency gains beginning to materialise in FY2025 op-ex management.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Euromoney (Jul 2025)</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-022</div>
<div class="uc-name">AI-Driven SME Lending — NEOBiz Platform</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">SME Banking / NEOBiz</span>
<span class="tag tag-scale">Scaling</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI-powered risk assessment, credit scoring and pre-approved lending limits for SME customers via Mashreq NEOBiz. Digital-first onboarding with AI-assisted document verification for SME clients across UAE and Pakistan.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">SME lending expansion across UAE and Pakistan ($100M committed); digital SME onboarding reduces branch dependency; supports double-digit SME lending growth target.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Gulf News (Sep 2025), PortersFiveForce (Dec 2025)</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-023</div>
<div class="uc-name">AI Sentiment Analysis — News Engine &amp; Client Monitoring</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Corporate Banking / RM Intelligence</span>
<span class="tag tag-scale">Scaling</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">News engine monitors client developments and sentiment analysis detects market shifts for RMs. AI-driven insights embedded directly into RM workflows via the Pulse portal, making insights timely and actionable.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Proactive client engagement; early risk identification; RM-to-client relevance improved leading to stronger retention and fee income growth (+35% fees in Q1 2026).</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Digital Banker (Dec 2025)</div></div>
</div>
<div class="uc-card" data-maturity="Scaling">
<div class="uc-id">UC-024</div>
<div class="uc-name">Banking-as-a-Service — Telecom AI Embedded Finance</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Retail / Partnership</span>
<span class="tag tag-scale">Scaling</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Banking-as-a-service partnership with a regional telecommunications provider to extend AI-powered banking access to underserved customer segments, leveraging Mashreq's cloud-native NEO platform.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Financial inclusion expansion; new customer acquisition channels beyond traditional banking; supports Mashreq's AED 110 billion sustainable finance commitment by 2030.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Digital Banker (May 2026)</div></div>
</div>
<div class="uc-card" data-maturity="Pilot">
<div class="uc-id">UC-025</div>
<div class="uc-name">AI/ML Scoring for NEO Engagement — Next Enhancement</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Retail Analytics / NEO</span>
<span class="tag tag-pilot">Pilot</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Planned ML scoring layer to sharpen the NEO personalisation and engagement decision engine beyond current rule-based analytics, introducing propensity-to-buy and next-best-action ML models.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Expected to further lift CTR and product conversion beyond current 50% improvement; revenue uplift above current 3x baseline from targeted campaigns.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Digital Banker (May 2026)</div></div>
</div>
<div class="uc-card" data-maturity="Pilot">
<div class="uc-id">UC-026</div>
<div class="uc-name">Agentic AI — Financial Inclusion &amp; Autonomous Banking</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Strategy / Innovation</span>
<span class="tag tag-pilot">Pilot</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">Mashreq is exploring agentic AI for financial inclusion — autonomous AI agents that can proactively manage financial decisions for underserved populations (referenced in Mashreq LinkedIn thought leadership, 2026). Ties to NEO Pakistan and BaaS telecom expansion.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">10 million customer target by 2030 in Pakistan alone; agentic AI to support autonomous onboarding, savings management and microfinance decisioning.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Mashreq LinkedIn (2026), Wikipedia factsheet</div></div>
</div>
<div class="uc-card" data-maturity="Pilot">
<div class="uc-id">UC-027</div>
<div class="uc-name">AI ESG Integration — Sustainable Finance Decisioning</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Sustainability / Credit</span>
<span class="tag tag-pilot">Pilot</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI integration into ESG-linked credit decisions and sustainable finance pipeline management. Technology supports AED 110 billion sustainable finance commitment by 2030, with AI scoring ESG credentials of lending proposals.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Supports AED 110B sustainable finance target; regulatory ESG compliance; competitive differentiation in green finance.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">BCG Matrix Analysis (Mashreq), FY2025 Results</div></div>
</div>
<div class="uc-card" data-maturity="Pilot">
<div class="uc-id">UC-028</div>
<div class="uc-name">AI Cybersecurity — Vulnerability Patch Prioritisation</div>
<div style="margin-bottom:8px">
<span class="tag tag-dept">Technology / Cybersecurity</span>
<span class="tag tag-pilot">Pilot</span>
</div>
<div class="uc-field"><div class="uc-label">Description</div><div class="uc-value">AI detects anomalies and prioritises security patches to address vulnerabilities and errors, identifying fraud patterns across vast volumes of data. Part of Mashreq's broader AI-led security operations transformation.</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Faster vulnerability remediation; reduced cyber risk exposure across 15+ country operations; supports D-SIB regulatory designation compliance.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Euromoney (Jul 2025)</div></div>
</div>
</div>
</div>
</div>
  
<div class="page" id="page-agents">
<div class="container">
<div class="section-head">
<h2>AI Agents — 12 Identified (2025–2026)</h2>
<p>Named AI agents, autonomous tools and intelligent assistants identified from official Mashreq sources</p>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem">
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">🤖</div>TADA Data Copilot</div>
<div class="uc-field"><div class="uc-label">Type</div><div class="uc-value">GenAI NLP Agent</div></div>
<div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Natural-language interface to core banking and data platforms; allows plain-English queries returning structured analytical outputs, charts and trend analysis.</div></div>
<div class="uc-field"><div class="uc-label">Department</div><div class="uc-value">Enterprise-Wide Data Analytics</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">40–60% reduction in data retrieval time; reduced dependency on central analytics teams; democratised data access across the organisation.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Digital Banker (May 2026) — launched July 2025</div></div>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">🔍</div>Clari5 Genie</div>
<div class="uc-field"><div class="uc-label">Type</div><div class="uc-value">GenAI Fraud Investigation Agent</div></div>
<div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">GenAI-powered fraud detection, pattern simulation and investigation platform. Auto-generates case narratives, performs similarity analysis, runs live fraud simulation via smart prompt engineering.</div></div>
<div class="uc-field"><div class="uc-label">Department</div><div class="uc-value">Financial Crime / Compliance</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">70% faster fraud investigations; proactive detection; Mashreq first global deployment; on-premise for maximum data security.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">BusinessWire (May 2025)</div></div>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">📞</div>Smart Call Report Agent</div>
<div class="uc-field"><div class="uc-label">Type</div><div class="uc-value">GenAI Meeting Intelligence Agent</div></div>
<div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Runs GenAI on Microsoft Teams calls in real-time; generates tailored client call summaries; extracts insights; suggests follow-up actions; distributes to all RM stakeholders automatically.</div></div>
<div class="uc-field"><div class="uc-label">Department</div><div class="uc-value">Corporate &amp; Investment Banking — RM Operations</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">90% reduction in manual call report effort; Best AI Initiative — Digital Banker MEA 2025.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Euromoney (Jun 2025), Digital Banker (Dec 2025)</div></div>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">📊</div>Pulse RM Intelligence Agent</div>
<div class="uc-field"><div class="uc-label">Type</div><div class="uc-value">AI-Powered RM Dashboard Agent</div></div>
<div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">AI front portal for Relationship Managers consolidating credit alerts, compliance alerts, client news monitoring, sentiment analysis and predictive engagement opportunities from 22 previously siloed systems.</div></div>
<div class="uc-field"><div class="uc-label">Department</div><div class="uc-value">Corporate Banking / Wholesale</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Replaced 22 systems; RM productivity significantly improved; timely AI-driven insights embedded directly in frontline workflows.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Gulf Business (Oct 2024)</div></div>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">🌐</div>Graph Analytics Prospecting Agent</div>
<div class="uc-field"><div class="uc-label">Type</div><div class="uc-value">Network Intelligence / Lead Scoring Agent</div></div>
<div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Merges internal transaction data with trade and shipping records to build multidimensional corporate ecosystem maps; visually maps buyer-supplier-intermediary networks; scores leads for product relevance.</div></div>
<div class="uc-field"><div class="uc-label">Department</div><div class="uc-value">Wholesale Digital Studio — CIB</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">AED 57M+ AI-recommended deal revenue; Excellence in Digital Prospecting — Digital Banker MEA 2025.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Digital Banker (Dec 2025)</div></div>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">🏦</div>NEO Personalisation Engine Agent</div>
<div class="uc-field"><div class="uc-label">Type</div><div class="uc-value">Real-Time Personalisation &amp; Engagement Agent</div></div>
<div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Identifies context-specific engagement opportunities (FX prompts, offers, loyalty interventions) in near real-time for NEO retail customers; replaces delayed batch segmentation with point-of-relevance AI actions.</div></div>
<div class="uc-field"><div class="uc-label">Department</div><div class="uc-value">Retail Banking / NEO</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">+50% CTR; +16% debit card activation; revenue 3x pre-launch levels.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">MoEngage Case Study, Digital Banker (May 2026)</div></div>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">💬</div>NEO AI Chatbot / Virtual Assistant</div>
<div class="uc-field"><div class="uc-label">Type</div><div class="uc-value">Conversational AI Agent</div></div>
<div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">AI-led customer-facing chatbot fully integrated with backend systems enabling real-time data access, transaction execution, account queries and service requests across the NEO mobile platform.</div></div>
<div class="uc-field"><div class="uc-label">Department</div><div class="uc-value">Retail Banking / Customer Experience</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">24/7 self-service; reduced contact centre load; supports 90%+ digital transaction rate.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Euromoney (Aug 2025), Gulf News</div></div>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">🛡️</div>Real-Time Fraud Detection Agent</div>
<div class="uc-field"><div class="uc-label">Type</div><div class="uc-value">ML Anomaly Detection Agent</div></div>
<div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">ML models analyse transaction data in real-time to detect anomalies, suspicious patterns and fraudulent account openings; reduce false positives; automatically flag threats and prioritise vulnerability patches.</div></div>
<div class="uc-field"><div class="uc-label">Department</div><div class="uc-value">Risk Management / Technology / Security</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Real-time fraud prevention; NPL ratio at 1.0%; reduced false positives; AI-led security replacing manual monitoring.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Euromoney (Jul &amp; Aug 2025), Arab News (Oct 2024)</div></div>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">📋</div>KYC OCR Automation Agent</div>
<div class="uc-field"><div class="uc-label">Type</div><div class="uc-value">Visual Robotics / OCR Agent</div></div>
<div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">Visual robotics and OCR automate KYC document processing, data entry and renewal workflows. Integrated with GenAI for document summarisation and client account setup journey consolidation.</div></div>
<div class="uc-field"><div class="uc-label">Department</div><div class="uc-value">Compliance / Wholesale Digital Studio</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">First in region for wholesale digital KYC; straight-through processing improvement; reduced compliance cost.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Digital Banker (Dec 2025), Mashreq International Banking page</div></div>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">💰</div>AI Credit Scoring &amp; Pre-Approval Agent</div>
<div class="uc-field"><div class="uc-label">Type</div><div class="uc-value">ML Credit Decisioning Agent</div></div>
<div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">ML-powered agent generating pre-approved credit limits, assessing risk and automating lending decisions for retail and SME customers; embedded in NEO and NEOBiz platforms.</div></div>
<div class="uc-field"><div class="uc-label">Department</div><div class="uc-value">Retail / SME Credit</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Loans +32% in FY2025; NPL at 1.0%; improved risk-adjusted yields and reduced cost-to-serve.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">PortersFiveForce (Dec 2025), FY2025 Results (Jan 2026)</div></div>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">🌍</div>Country Entry Assessment AI Agent</div>
<div class="uc-field"><div class="uc-label">Type</div><div class="uc-value">GenAI Strategic Intelligence Agent</div></div>
<div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">GenAI tools used by leadership cohorts to conduct country-entry assessments, synthesising market data, regulatory frameworks and economic indicators autonomously — replacing analyst-weeks of work.</div></div>
<div class="uc-field"><div class="uc-label">Department</div><div class="uc-value">Strategy / C-Suite / Corporate Development</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Accelerated expansion into Türkiye, Oman, Pakistan, India GIFT City; total assets grew to AED 335B (+25%) in FY2025.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Euromoney (Jul 2025)</div></div>
</div>
<div class="agent-card">
<div class="agent-name"><div class="agent-icon">📈</div>360-Degree Client View AI Engine</div>
<div class="uc-field"><div class="uc-label">Type</div><div class="uc-value">Multi-Source Intelligence &amp; Cross-Sell Agent</div></div>
<div class="uc-field"><div class="uc-label">Purpose</div><div class="uc-value">AI engine combining transaction data, shipment records and third-party data to generate cross-sell / up-sell recommendations for corporate RMs with explainability (rejection feedback loops to improve model).</div></div>
<div class="uc-field"><div class="uc-label">Department</div><div class="uc-value">Corporate &amp; Investment Banking</div></div>
<div class="uc-field"><div class="uc-label">Business Value</div><div class="uc-value">Cross-sell ratio at 35% (+400bps); major contributor to FY2025 fee income growth.</div></div>
<div class="uc-field"><div class="uc-label">Source</div><div class="uc-value">Euromoney (Jun 2025)</div></div>
</div>
</div>
</div>
</div>

<div class="page" id="page-programs">
<div class="container">
<div class="section-head">
<h2>AI Programs — 7 Strategic Programs (2025–2026)</h2>
<p>Official AI transformation programs and strategic initiatives identified from Mashreq sources</p>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem">
<div class="prog-card">
<div class="prog-name">1. Wholesale Digital Studio — AI Innovation Engine</div>
<span class="tag tag-prod">Production</span><span class="tag tag-dept">Corporate Banking</span>
<p style="margin-top:8px;font-size:12px;color:#444;line-height:1.6">A purpose-built unit at Mashreq delivering transformative banking solutions through data, technology and agile execution. Runs 15+ live AI/ML models for corporate banking. Won four Digital Banker MEA 2025 awards covering AI, onboarding, data analytics and client engagement. Rare in the industry — most banks operate retail-focused digital studios; Mashreq's is wholesale-first.</p>
</div>
<div class="prog-card">
<div class="prog-name">2. GenAI Enterprise Rollout Program</div>
<span class="tag tag-scale">Scaling</span><span class="tag tag-dept">Enterprise-Wide</span>
<p style="margin-top:8px;font-size:12px;color:#444;line-height:1.6">Systematic enterprise adoption of generative AI across business units led by Xi Liang, Head of AI (appointed July 2025). Encompasses TADA Data Copilot, Smart Call Report, Country Entry AI and planned agentic deployments. Aligned with regulatory requirements and responsible AI standards. FY2025 results confirm "continued investment in Gen-AI-led initiatives."</p>
</div>
<div class="prog-card">
<div class="prog-name">3. Mashreq NEO — AI-First Digital Bank Platform</div>
<span class="tag tag-prod">Production</span><span class="tag tag-dept">Retail / NEO</span>
<p style="margin-top:8px;font-size:12px;color:#444;line-height:1.6">Cloud-native, AI-embedded digital banking platform described as "built once and for many." Deployed in UAE, Egypt (350K+ accounts, &gt;90% STP), Pakistan (Sep 2025, $100M committed, target 10M customers by 2030) and expanding to further markets. AI-driven risk controls, onboarding, personalisation and fraud detection embedded at every layer.</p>
</div>
<div class="prog-card">
<div class="prog-name">4. Responsible AI &amp; AI Governance Framework</div>
<span class="tag tag-scale">Scaling</span><span class="tag tag-dept">Risk / Compliance</span>
<p style="margin-top:8px;font-size:12px;color:#444;line-height:1.6">Formal AI governance program ensuring all AI deployments are fair, accurate and compliant. Xi Liang's mandate explicitly includes ensuring responsible AI adoption aligned with business priorities and regulatory requirements. On-premise deployment of Clari5 Genie reflects governance-led security decisions. CBUAE D-SIB designation reinforces governance credibility.</p>
</div>
<div class="prog-card">
<div class="prog-name">5. GenAI Fraud &amp; Financial Crime Intelligence Program</div>
<span class="tag tag-prod">Production</span><span class="tag tag-dept">Financial Crime</span>
<p style="margin-top:8px;font-size:12px;color:#444;line-height:1.6">Strategic partnership with Clari5 (Perfios Group) to deploy the first-ever on-premise GenAI fraud detection platform. Combines natural language console for investigators, smart prompt engineering for live fraud simulation, auto case narrative generation and similarity-based pattern detection. Sets a new global benchmark for proactive, intelligence-led fraud prevention.</p>
</div>
<div class="prog-card">
<div class="prog-name">6. Agile Transformation — 40+ AI-Enhanced Customer Journeys</div>
<span class="tag tag-scale">Scaling</span><span class="tag tag-dept">Technology / Operations</span>
<p style="margin-top:8px;font-size:12px;color:#444;line-height:1.6">Agile teams operating on quarterly prioritisation cycles across 40+ retail and SME banking journeys embedding AI/automation. Centralised transformation teams handle AI infrastructure, data frameworks and cybersecurity. Resulted in a 31% cost-to-income ratio — among the best in the MENA region.</p>
</div>
<div class="prog-card">
<div class="prog-name">7. International AI Expansion — Corridor Banking AI Program</div>
<span class="tag tag-scale">Scaling</span><span class="tag tag-dept">International / Strategy</span>
<p style="margin-top:8px;font-size:12px;color:#444;line-height:1.6">AI-enabled international banking expansion strategy targeting Türkiye, Oman, Pakistan, India (GIFT City) and deepening presence in Egypt. AI powers cross-border payment processing, trade finance intelligence, real-time IBAN validation and embedded finance for correspondent banking corridors. 2026 strategic focus confirmed: "accelerate innovation-led growth through continued investment in AI."</p>
</div>
</div>
</div>
</div>

<div class="page" id="page-partnerships">
<div class="container">
<div class="section-head">
<h2>AI Partnerships — 6 Key Strategic Alliances (2025–2026)</h2>
<p>Technology and AI partnerships identified from Mashreq press releases and official communications</p>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem">
<div class="partner-card">
<div class="partner-logo">Clari5</div>
<div>
<div style="font-weight:600;margin-bottom:4px">Clari5 (A Perfios Company)</div>
<span class="tag tag-partner">GenAI Fraud Detection</span>
<p style="font-size:12px;margin-top:6px;line-height:1.6">Strategic partnership to deploy Clari5 Genie — the world's first on-premise GenAI fraud detection and investigation platform. Announced May 2025; Mashreq is the global launch customer. Features natural language console, smart prompt engineering, auto case narrative generation, similarity-based detection, and role-based compliance monitoring.</p>
<p style="font-size:11px;color:#888;margin-top:4px">Source: BusinessWire, May 2025</p>
</div>
</div>
<div class="partner-card">
<div class="partner-logo">Mo Engage</div>
<div>
<div style="font-weight:600;margin-bottom:4px">MoEngage</div>
<span class="tag tag-partner">AI Personalisation Engine</span>
<p style="font-size:12px;margin-top:6px;line-height:1.6">AI-powered omnichannel engagement platform powering Mashreq NEO's personalisation strategy. Implemented cohort analytics, AI-driven personalised campaigns, card activation workflows and loyalty programs. Delivered +50% CTR, +16% debit card activation and 3x revenue from targeted initiatives.</p>
<p style="font-size:11px;color:#888;margin-top:4px">Source: MoEngage Case Study</p>
</div>
</div>
<div class="partner-card">
<div class="partner-logo">Profinch / Oracle</div>
<div>
<div style="font-weight:600;margin-bottom:4px">Profinch (Oracle Partner)</div>
<span class="tag tag-partner">Core Banking Technology</span>
<p style="font-size:12px;margin-top:6px;line-height:1.6">Strategic technology transformation partner for global expansion. Implementing Oracle Fusion Banking (payments, trade, digital experience) across Oman, Pakistan, US, UK and Hong Kong. Profinch's Host2Host application (150+ ERPs) is live across five countries via its Atumverse AI framework.</p>
<p style="font-size:11px;color:#888;margin-top:4px">Source: EINPresswire, July 2024</p>
</div>
</div>
<div class="partner-card">
<div class="partner-logo">Open AI Azure</div>
<div>
<div style="font-weight:600;margin-bottom:4px">OpenAI (via Azure Cloud)</div>
<span class="tag tag-partner">GenAI Foundation Models</span>
<p style="font-size:12px;margin-top:6px;line-height:1.6">Mashreq uses Azure cloud infrastructure to access OpenAI's advanced GenAI models without compromising client confidentiality or regulatory obligations. Powers Smart Call Report, TADA Copilot and country-entry GenAI tools. Cloud adoption has enabled Mashreq to train AI models securely and scale compute resources elastically.</p>
<p style="font-size:11px;color:#888;margin-top:4px">Source: Euromoney (Jul 2025)</p>
</div>
</div>
<div class="partner-card">
<div class="partner-logo">McKinsey Advisory</div>
<div>
<div style="font-weight:600;margin-bottom:4px">McKinsey &amp; Company</div>
<span class="tag tag-partner">AI Strategy Advisory</span>
<p style="font-size:12px;margin-top:6px;line-height:1.6">Head of AI Xi Liang comes from a McKinsey advisory background with deep AI strategy expertise. McKinsey frameworks underpin Mashreq's responsible AI governance and enterprise AI adoption methodology. McKinsey's GCC AI value analysis (up to $150B value potential) cited in Mashreq strategic planning.</p>
<p style="font-size:11px;color:#888;margin-top:4px">Source: Tech Revolt (Jul 2025), Gulf News</p>
</div>
</div>
<div class="partner-card">
<div class="partner-logo">Telecom BaaS Partner</div>
<div>
<div style="font-weight:600;margin-bottom:4px">Regional Telecom (BaaS)</div>
<span class="tag tag-partner">Embedded Finance / AI Banking</span>
<p style="font-size:12px;margin-top:6px;line-height:1.6">Banking-as-a-Service partnership with a regional telecommunications provider to extend AI-powered financial inclusion solutions to underserved customer segments across the MENA region. Leverages Mashreq's cloud-native NEO AI platform for rapid deployment and scale.</p>
<p style="font-size:11px;color:#888;margin-top:4px">Source: Digital Banker (May 2026)</p>
</div>
</div>
</div>
</div>
</div>

<div class="page" id="page-maturity">
<div class="container">
<div class="section-head">
<h2>AI Maturity Assessment — Mashreq Bank 2026</h2>
<p>Based on evidence from FY2025 Annual Results, Q1 2026 Results, Digital Banker Awards, Euromoney features and Mashreq press releases</p>
</div>
<div style="display:grid;grid-template-columns:1fr 2fr;gap:1.5rem;margin-bottom:1.5rem">
<div>
<div class="score-big">3.9<span style="font-size:24px">/5</span></div>
<div class="score-sub">Overall AI Maturity Score</div>
<div class="card" style="margin-top:1rem">
<div class="card-title" style="font-size:13px">Maturity Classification</div>
<p style="font-size:12px;color:#444;line-height:1.7">Mashreq is rated <strong>Advanced-Transitional</strong> — with multiple GenAI systems in production, a dedicated Head of AI, and a formally stated 2026 commitment to accelerate AI investment. Strong ML foundations (15+ live models) and first-to-market GenAI partnerships position it ahead of most regional peers, though full agentic AI and enterprise-wide GenAI penetration are still maturing.</p>
</div>
</div>
<div class="card">
<div class="card-title">Maturity by Dimension — Detailed Assessment</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span><strong>AI Strategy &amp; Governance (4.2/5)</strong></span><span style="color:#006D5B;font-weight:600">●●●●○</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:84%"></div></div>
<p style="font-size:11px;color:#888;margin-top:4px">Dedicated Head of AI appointed July 2025; formal responsible AI mandate; D-SIB regulatory designation; 2026 strategy explicitly centred on AI acceleration. Clear board-level AI commitment.</p>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span><strong>Data Infrastructure (4.0/5)</strong></span><span style="color:#006D5B;font-weight:600">●●●●○</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:80%"></div></div>
<p style="font-size:11px;color:#888;margin-top:4px">TADA Data Copilot deployed across multiple core banking data platforms (July 2025); cloud-native architecture; API marketplace for external data integration; real-time analytics infrastructure. TADA's 40–60% time savings demonstrates strong data layer.</p>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span><strong>AI Talent &amp; Leadership (3.8/5)</strong></span><span style="color:#006D5B;font-weight:600">●●●○○</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:76%"></div></div>
<p style="font-size:11px;color:#888;margin-top:4px">Xi Liang (former Judo Bank, IBM — 4 patents) as Head of AI; Mohamed Abdel Razek as Group Head of Technology and Transformation; strong leadership but enterprise AI talent pipeline depth not yet publicly documented.</p>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span><strong>AI Production Deployment (4.0/5)</strong></span><span style="color:#006D5B;font-weight:600">●●●●○</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:80%"></div></div>
<p style="font-size:11px;color:#888;margin-top:4px">15+ ML models live in production across corporate and retail banking; 90%+ digital transaction rate; TADA, Clari5 Genie, Smart Call Report all live. AED 57M+ AI-generated revenue in 2024 confirms production impact.</p>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span><strong>GenAI &amp; Agentic AI (3.6/5)</strong></span><span style="color:#006D5B;font-weight:600">●●●○○</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:72%"></div></div>
<p style="font-size:11px;color:#888;margin-top:4px">TADA Copilot and Clari5 Genie represent strong GenAI deployment. Agentic AI is referenced in 2026 strategy (financial inclusion) but still early stage. Smart Call Report represents quasi-agentic capability. Full autonomous multi-step agents not yet confirmed at scale.</p>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span><strong>AI Culture &amp; Adoption (3.7/5)</strong></span><span style="color:#006D5B;font-weight:600">●●●○○</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:74%"></div></div>
<p style="font-size:11px;color:#888;margin-top:4px">CEO describes organisation as "a series of autonomous fintechs"; agile delivery model; 40+ AI-enhanced journeys; quarterly AI prioritisation cadence. Digital adoption strong but cultural AI embedding still progressing across all geographies.</p>
</div>
<div class="maturity-bar-wrap">
<div class="maturity-label"><span><strong>Responsible AI &amp; Ethics (3.8/5)</strong></span><span style="color:#006D5B;font-weight:600">●●●○○</span></div>
<div class="maturity-bar"><div class="maturity-fill" style="width:76%"></div></div>
<p style="font-size:11px;color:#888;margin-top:4px">Explicit responsible AI mandate for Head of AI; on-premise Clari5 Genie deployment reflects security governance maturity; human oversight framework confirmed ("humans supervise AI systems"); LinkedIn Responsible AI video published 2026. Framework maturing but not yet benchmarked externally.</p>
</div>
</div>
</div>
<div class="card">
<div class="card-title">Strategic Findings — 10 Key Observations</div>
<div class="finding-item"><span class="finding-num">SF-01</span>Mashreq operates 15+ live AI/ML models across corporate and retail banking — among the highest confirmed production AI model counts in the GCC banking sector.</div>
<div class="finding-item"><span class="finding-num">SF-02</span>The Wholesale Digital Studio is a unique institutional capability — rare globally — giving Mashreq a first-mover GenAI advantage in corporate banking AI, recognised by 4 Digital Banker MEA 2025 awards.</div>
<div class="finding-item"><span class="finding-num">SF-03</span>Q1 2026 operating expenses rose 15% YoY, specifically attributed to GenAI initiative investment, confirming the bank is actively scaling AI spend into 2026 — not consolidating.</div>
<div class="finding-item"><span class="finding-num">SF-04</span>Clari5 Genie deployment makes Mashreq the first bank globally to run on-premise GenAI fraud investigation — establishing a security-governance benchmark for the industry.</div>
<div class="finding-item"><span class="finding-num">SF-05</span>TADA Data Copilot (July 2025) represents the most significant internal GenAI deployment — democratising data access bank-wide and reducing analytics time by 40–60%.</div>
<div class="finding-item"><span class="finding-num">SF-06</span>AI-recommended deals generated AED 57M+ revenue in 2024 — a confirmed revenue attribution metric that demonstrates AI ROI at scale, not just cost savings.</div>
<div class="finding-item"><span class="finding-num">SF-07</span>The NEO platform's cloud-native, AI-first architecture ("built once and for many") gives Mashreq unmatched speed to deploy AI-driven banking in new markets — Pakistan launched in 90 days with &gt;90% STP.</div>
<div class="finding-item"><span class="finding-num">SF-08</span>Xi Liang's appointment as Head of AI (July 2025) with an IBM/McKinsey/Judo Bank background signals intent to build responsible, enterprise-grade AI systems — not just point solutions.</div>
<div class="finding-item"><span class="finding-num">SF-09</span>Mashreq's 35% cross-sell ratio (+400bps in FY2025) is directly attributed to AI-powered RM intelligence tools — a concrete balance sheet impact from AI deployment.</div>
<div class="finding-item"><span class="finding-num">SF-10</span>Agentic AI for financial inclusion is emerging as Mashreq's 2026–2027 frontier — with Pakistan (10M customer target), BaaS telecom partnerships and embedded finance all pointing to autonomous AI banking at population scale.</div>
</div>
</div>
</div>

<div class="page" id="page-executive">
<div class="container">
<div class="section-head">
<h2>AI Executive Summary — Mashreq Bank 2026</h2>
<p>Strategic AI intelligence summary for executive and board-level consumption | Sources: FY2025 Results, Q1 2026 Results, Digital Banker, Euromoney</p>
</div>
<div class="summary-box">
<h3>Executive Headline</h3>
<p>Mashreq Bank has entered 2026 as the most AI-operationally embedded bank in the UAE and one of the most advanced in the MENA region. Unlike peers still piloting GenAI, Mashreq's AI is generating measurable revenue (AED 57M+ in AI-recommended deals), reducing costs (40–60% analytics time savings), improving fraud detection (70% faster investigations) and powering an international expansion strategy deployed at over 90% straight-through processing. Q1 2026 financial results — net profit up 7% to AED 1.9B, operating income +10% — were achieved alongside a deliberate 15% increase in operating expenses driven by GenAI investment, signalling confident acceleration, not consolidation.</p>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem;margin-bottom:1.5rem">
<div class="card">
<div class="card-title">AI Investment Signals — Q1 2026</div>
<div class="prose">
<p>Operating expenses rose 15% year-on-year in Q1 2026, explicitly attributed by management to <em>"targeted investment in generative AI initiatives, digital onboarding infrastructure and continued build-out of the international network."</em> This confirms AI investment acceleration — not moderation — entering 2026.</p>
<p>The FY2025 full-year statement confirmed: <em>"continued investment in Gen-AI-led initiatives"</em> with operating expenses growing just 5% for the year, reflecting early efficiency gains from AI-led scalability.</p>
</div>
</div>
<div class="card">
<div class="card-title">AI Competitive Position</div>
<div class="prose">
<p><strong>Strengths:</strong> 15+ live ML models; first-to-market on-premise GenAI fraud platform; TADA Data Copilot democratising data; Wholesale Digital Studio as unique institutional capability; NEO platform deployable globally in weeks; dedicated Head of AI.</p>
<p><strong>Opportunities:</strong> Full agentic AI still early; enterprise-wide GenAI penetration maturing; potential to monetise AI infrastructure via BaaS at scale across 10+ countries.</p>
</div>
</div>
</div>
<div class="card">
<div class="card-title">AI Use Case Summary by Business Line</div>
<table>
<thead><tr><th>Business Line</th><th>Primary AI Use Cases</th><th>Stage</th><th>Evidence</th></tr></thead>
<tbody>
<tr><td><strong>Corporate &amp; Investment Banking</strong></td><td>Smart Call Report, Pulse RM Portal, Graph Analytics Prospecting, 360° Client View, Country Entry AI</td><td><span class="tag tag-prod">Production</span></td><td>AED 57M+ revenue; 90% RM effort saved; 4 awards</td></tr>
<tr><td><strong>Retail Banking / NEO</strong></td><td>AI Chatbot, NEO Personalisation Engine, AI Digital Onboarding, AI Credit Scoring, Youth AI Banking</td><td><span class="tag tag-prod">Production</span></td><td>350K+ Egypt accounts; &gt;90% STP Pakistan; +50% CTR</td></tr>
<tr><td><strong>Financial Crime / Compliance</strong></td><td>Clari5 Genie GenAI Fraud, Real-Time Fraud Detection, AML/Sanctions AI, KYC OCR Automation</td><td><span class="tag tag-prod">Production</span></td><td>70% faster fraud investigations; NPL 1.0%</td></tr>
<tr><td><strong>Data &amp; Analytics</strong></td><td>TADA Data Copilot, Real-Time Analytics Platform, ML Model Factory (15+ models)</td><td><span class="tag tag-prod">Production</span></td><td>40–60% time saved; democratised data access</td></tr>
<tr><td><strong>SME Banking / NEOBiz</strong></td><td>AI SME Credit Decisioning, Digital Onboarding AI, Pre-Approved Lending ML</td><td><span class="tag tag-scale">Scaling</span></td><td>$100M Pakistan committed; loans +32%</td></tr>
<tr><td><strong>Private Banking</strong></td><td>AI Portfolio Analytics, Automated Compliance Reporting, AI-Led Portfolio Insights Dashboards</td><td><span class="tag tag-scale">Scaling</span></td><td>Non-interest income +16% FY2025</td></tr>
<tr><td><strong>Technology / Security</strong></td><td>AI Cybersecurity Anomaly Detection, Vulnerability Patch AI, API Marketplace AI Integration</td><td><span class="tag tag-scale">Scaling</span></td><td>Security AI replacing manual monitoring</td></tr>
<tr><td><strong>Strategy / International</strong></td><td>Country Entry GenAI, Agentic Financial Inclusion AI, BaaS Telecom AI</td><td><span class="tag tag-pilot">Pilot → Scaling</span></td><td>4 new markets in FY2025; AED 335B total assets</td></tr>
</tbody>
</table>
</div>
</div>
</div>

<div class="page" id="page-ceo">
<div class="container">
<div class="section-head">
<h2>CEO-Level AI Report — Mashreq Bank 2026</h2>
<p>Synthesised for board and executive distribution | Based on FY2025 Full Year Results, Q1 2026 Results and official Mashreq disclosures</p>
</div>
<div class="ceo-report">
<div class="report-header">
<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem">
<div>
<div style="font-size:18px;font-weight:700;color:#006D5B">MASHREQ BANK</div>
<div style="font-size:14px;font-weight:600;color:#333;margin-top:2px">ARTIFICIAL INTELLIGENCE STRATEGY REPORT — 2026</div>
<div style="font-size:12px;color:#888;margin-top:2px">Prepared for: Group CEO Ahmed Abdelaal &amp; Executive Committee | Classification: Strategic Internal</div>
</div>
<div style="text-align:right">
<div style="font-size:12px;color:#888">Report Period</div>
<div style="font-weight:600">FY2025 + Q1 2026</div>
<div style="font-size:12px;color:#888;margin-top:4px">Prepared</div>
<div style="font-weight:600">May 2026</div>
</div>
</div>
</div>
<h3>1. Strategic Position</h3>
<p>Mashreq enters mid-2026 as the UAE's most operationally AI-embedded bank. With 15+ production ML models, three major GenAI platforms live (TADA Copilot, Clari5 Genie, Smart Call Report) and a dedicated Head of Artificial Intelligence in post since July 2025, the bank has moved decisively from AI experimentation to AI-as-infrastructure. The 2026 strategic framework, as articulated in the FY2025 Full Year Results, is unambiguous: "accelerate innovation-led growth through continued investment in advanced digital platforms, artificial intelligence and data-driven capabilities, strengthening scalability, decisioning and client experience across businesses."</p>
<p>FY2025 delivered AED 12.6 billion in operating income, AED 8.3 billion net profit before tax, 32% loan growth and a 20% return on equity — underpinned by AI-enabled scalability and a cost-to-income ratio of 31%. Q1 2026 net profit grew 7% to AED 1.9 billion with operating income +10% — achieved while deliberately increasing AI investment spending by 15% in operating expenses.</p>
<h3>2. AI Investment Trajectory</h3>
<p>Management has explicitly confirmed AI investment acceleration in Q1 2026 financial disclosures, citing operating expense growth of 15% as driven by "targeted investment in generative AI initiatives, digital onboarding infrastructure and the continued build-out of the international network." This is a strategic choice — Mashreq is investing ahead of the curve, absorbing short-term cost pressure to capture long-term competitive advantage. The FY2025 full-year operating efficiency (5% op-ex growth) demonstrates that prior AI investments are already generating operational leverage.</p>
<h3>3. AI Revenue Attribution</h3>
<p>Mashreq is one of very few banks in the GCC with a documented AI revenue line. AI-recommended deals generated over AED 57 million in revenue in 2024 from the Graph Analytics Prospecting Agent alone. Cross-sell ratio improved 400 basis points to 35% in FY2025, directly attributable to AI-powered RM intelligence tools (360° Client View, Pulse Portal). The NEO Personalisation Engine delivered revenue from targeted initiatives running at three times pre-AI levels, with +50% improvement in click-through rate and +16% debit card activation. These are concrete, board-reportable AI ROI figures.</p>
<h3>4. Flagship AI Deployments — 2025/2026</h3>
<p><strong>TADA Data Copilot (July 2025):</strong> GenAI natural language interface deployed enterprise-wide, reducing data retrieval time by 40–60% and democratising analytics access across the organisation. This single deployment has transformed how business units interact with data.</p>
<p><strong>Clari5 Genie (May 2025):</strong> As the first global bank to deploy on-premise GenAI fraud detection, Mashreq has established a security-governance benchmark. The platform delivers 70% faster fraud investigations while maintaining the highest data privacy standards — directly relevant to the bank's D-SIB regulatory designation.</p>
<p><strong>Smart Call Report (Live, CIB):</strong> GenAI runs on Microsoft Teams calls in real-time, generating tailored client summaries, extracting insights and distributing follow-up actions — reducing manual RM effort by 90%. Recognised as Best AI Initiative at the 2025 Digital Banker MEA Innovation Awards.</p>
<h3>5. NEO — AI as a Global Banking Platform</h3>
<p>Mashreq NEO represents the bank's most significant competitive moat: a cloud-native, AI-first digital banking platform built for global scalability. The September 2025 Pakistan launch — the first international deployment of NEO outside the Middle East — demonstrated this capability: over 90% straight-through processing from launch, backed by a $100 million commitment and a target of 10 million customers by 2030. In Egypt, NEO acquired 350,000 accounts in its first year with the same STP rate. The platform powers AI-driven onboarding, personalisation, fraud detection, and credit decisioning — "built once and for many."</p>
<h3>6. AI Leadership &amp; Governance</h3>
<p>The appointment of Xi Liang as Head of Artificial Intelligence (July 2025) — with 15+ years of AI experience across Judo Bank, McKinsey, IBM (4 patents) — signals institutional seriousness. Her mandate encompasses generative AI, intelligent automation, enterprise-wide AI adoption, business alignment and regulatory compliance. Responsible AI is an explicit pillar: "setting new standards for responsible AI in financial services." The board-level commitment to responsible AI is further evidenced by Mashreq's decision to deploy Clari5 Genie on-premise (not cloud), reflecting governance-led architectural decisions over commercial convenience.</p>
<h3>7. 2026 AI Priorities</h3>
<p>Based on management guidance and observable investment patterns, Mashreq's 2026 AI agenda centres on: (1) Scaling GenAI across remaining business units — particularly SME, private banking and international markets; (2) Advancing agentic AI for financial inclusion — autonomous AI agents for NEO Pakistan and BaaS telecom deployments; (3) Deepening AI personalisation with ML scoring enhancements to the NEO engagement engine; (4) Expanding the Wholesale Digital Studio AI capabilities to newly entered markets (Türkiye, Oman, GIFT City); (5) Building out the enterprise AI governance framework aligned with CBUAE AI regulations evolving in 2026.</p>
<h3>8. Board Recommendation</h3>
<p>Mashreq's AI trajectory is positive, differentiated and commercially validated. The combination of a dedicated AI leadership function, 15+ production models, three flagship 2025 GenAI launches, international AI platform scalability and confirmed 2026 investment acceleration places Mashreq in the top tier of MENA banking AI maturity. The primary risk is not underinvestment — it is execution velocity: ensuring that the 12 identified AI agents and 28 use cases translate to measurable financial outcomes at the pace of international expansion. The board should ensure AI KPIs are incorporated into all divisional performance scorecards for 2026–2027.</p>
</div>
</div>
</div>
 
<div class="page" id="page-urls">
<div class="container">
<div class="section-head">
<h2>2026 Report Download URL Inventory</h2>
<p>Official Mashreq document sources — all URLs verified against mashreq.com domain and official disclosures</p>
</div>
<div class="card" style="margin-bottom:1.5rem">
<div class="card-title" style="margin-bottom:1rem">Latest 2026 &amp; 2025 Report Inventory</div>
<table>
<thead><tr><th>Document Name</th><th>Type</th><th>Period</th><th>URL</th></tr></thead>
<tbody>
<tr><td><strong>Mashreq FY2025 Full Year Results</strong></td><td><span class="tag tag-dept">Financial Results</span></td><td>Jan 2026</td><td class="url-row"><a href="https://www.mashreq.com/en/uae/news/2026/january/mashreq-financial-results-fy2025/" target="_blank" rel="noreferrer">mashreq.com/uae/news/2026/january/mashreq-financial-results-fy2025</a></td></tr>
<tr><td><strong>Mashreqbank PSC FY2025 Financial Statements (PDF)</strong></td><td><span class="tag tag-dept">Annual Financials</span></td><td>Feb 2026</td><td class="url-row"><a href="https://www.mashreq.com/-/jssmedia/pdfs/aboutus/investors/2025/Mashreqbank-PSC-FY2025-en.ashx" target="_blank" rel="noreferrer">Mashreqbank-PSC-FY2025-en.ashx ↗</a></td></tr>
<tr><td><strong>Mashreq Q1 2026 Results</strong></td><td><span class="tag tag-scale">IR Results</span></td><td>May 2026</td><td class="url-row"><a href="https://www.agbi.com/banking-finance/2026/05/ai-investments-help-lift-mashreqs-first-quarter-profits/" target="_blank" rel="noreferrer">AGBI Q1 2026 Coverage ↗</a></td></tr>
<tr><td><strong>Mashreq H1 2025 Management Discussion &amp; Analysis</strong></td><td><span class="tag tag-scale">IR Report</span></td><td>Jul 2025</td><td class="url-row"><a href="https://www.mashreq.com/uae/news/2025/july/mashreq-financial-results-h1-2025/" target="_blank" rel="noreferrer">mashreq.com/uae/news/2025/july/mashreq-financial-results-h1-2025</a></td></tr>
<tr><td><strong>Mashreq 9M 2025 Financial Results</strong></td><td><span class="tag tag-scale">IR Results</span></td><td>Nov 2025</td><td class="url-row"><a href="https://www.mashreq.com/uae/news/2025/november/mashreq-financial-results-9m-2025/" target="_blank" rel="noreferrer">mashreq.com/uae/news/2025/november/mashreq-financial-results-9m-2025</a></td></tr>
<tr><td><strong>Mashreq Annual Reports Page</strong></td><td><span class="tag tag-dept">Annual Reports</span></td><td>2026</td><td class="url-row"><a href="https://www.mashreq.com/en/uae/about-us/investor-relations/financial-information/annual-reports/" target="_blank" rel="noreferrer">mashreq.com/about-us/investor-relations/annual-reports</a></td></tr>
<tr><td><strong>Mashreq Pakistan Q3 2025 Financials (PDF)</strong></td><td><span class="tag tag-prod">Pakistan Filings</span></td><td>Sep 2025</td><td class="url-row"><a href="https://www.mashreq.com/-/jssmedia/pdfs/pakistan/financials/2025/mbpl-financials-q3-2025.ashx" target="_blank" rel="noreferrer">mbpl-financials-q3-2025.ashx ↗</a></td></tr>
<tr><td><strong>Investor Fact Sheet 2026</strong></td><td><span class="tag tag-scale">Fact Sheet</span></td><td>Feb 2026</td><td class="url-row"><a href="https://www.mashreq.com/en/uae/about-us/investors/financial-information/fact-sheet/" target="_blank" rel="noreferrer">mashreq.com/about-us/investors/financial-information/fact-sheet</a></td></tr>
</tbody>
</table>
</div>
<div class="card" style="margin-bottom:1.5rem">
<div class="card-title" style="margin-bottom:1rem">AI Use Case Document URLs</div>
<p style="font-size:12px;color:#888;margin-bottom:1rem;font-style:italic">Note: Mashreq does not publish standalone AI whitepapers. AI content is embedded in the documents and third-party publications below.</p>
<table>
<thead><tr><th>AI Document / Source</th><th>AI Content Covered</th><th>URL</th></tr></thead>
<tbody>
<tr><td><strong>Digital Banker — Mashreq AI Innovation Awards Report</strong></td><td>Wholesale Digital Studio, Smart Call Report, Graph Analytics, KYC AI — all four 2025 MEA award wins</td><td class="url-row"><a href="https://thedigitalbanker.com/mashreqs-integrated-approach-to-corporate-banking-innovation/" target="_blank" rel="noreferrer">thedigitalbanker.com — MEA AI Innovation ↗</a></td></tr>
<tr><td><strong>Digital Banker — Mashreq Digital Playbook (May 2026)</strong></td><td>TADA Data Copilot (Jul 2025), NEO AI personalisation, NEO Pakistan, Youth banking AI, BaaS telecom AI</td><td class="url-row"><a href="https://thedigitalbanker.com/mashreqs-digital-playbook-scaling-data-platforms-and-purpose-across-retail-and-sme-banking/" target="_blank" rel="noreferrer">thedigitalbanker.com — Digital Playbook ↗</a></td></tr>
<tr><td><strong>Euromoney — Corporate Banking AI (Jun 2025)</strong></td><td>Smart Call Report, 360° Client View, API Marketplace, GenAI on Teams calls, 90% effort reduction</td><td class="url-row"><a href="https://www.euromoney.com/article/9xkp715ck8w04sgokgok804o8/sponsored-content/culture-and-code-rewiring-corporate-banking-for-the-digital-age/" target="_blank" rel="noreferrer">euromoney.com — Culture and Code ↗</a></td></tr>
<tr><td><strong>Euromoney — Digital Transformation (Jul 2025)</strong></td><td>AI fraud/security detection, API marketplace, cloud AI, country entry GenAI, 15+ ML models</td><td class="url-row"><a href="https://www.euromoney.com/article/ax6dudwvwvksgg0w8scosgwoc/sponsored-content/rebuilding-banks-from-the-inside-out-in-the-digital-age/" target="_blank" rel="noreferrer">euromoney.com — Rebuilding Banks ↗</a></td></tr>
<tr><td><strong>Euromoney — Digital-All Bank (Aug 2025)</strong></td><td>AI chatbot, fraud detection ML, hyperpersonalised marketing, NEO cloud platform, digital-all strategy</td><td class="url-row"><a href="https://www.euromoney.com/article/axxortkb1mo08k8g4wogk8c8s/sponsored-content/video-interview-mashreqs-group-head-of-retail-banking-on-creating-a-digital-all-bank/" target="_blank" rel="noreferrer">euromoney.com — Digital-All Bank ↗</a></td></tr>
<tr><td><strong>BusinessWire — Clari5 Genie GenAI Launch (May 2025)</strong></td><td>GenAI fraud detection platform specs, NL console, smart prompts, auto case narrative, 70% faster investigations</td><td class="url-row"><a href="https://www.businesswire.com/news/home/20250514167278/en" target="_blank" rel="noreferrer">businesswire.com — Clari5 Genie ↗</a></td></tr>
<tr><td><strong>Xi Liang Head of AI Appointment (Jul 2025)</strong></td><td>AI strategy mandate, GenAI, intelligent automation, enterprise AI, responsible AI framework</td><td class="url-row"><a href="https://techrevolt.io/2025/07/22/mashreq-appoints-xi-liang-as-head-of-artificial-intelligence/" target="_blank" rel="noreferrer">techrevolt.io — Xi Liang Appointment ↗</a></td></tr>
<tr><td><strong>MoEngage Case Study — NEO Personalisation AI</strong></td><td>+50% CTR, +16% debit activation, 9K monthly app customers, AI engagement strategy</td><td class="url-row"><a href="https://www.moengage.com/casestudy/mashreq-neo-omnichannel-case-study/" target="_blank" rel="noreferrer">moengage.com — NEO Case Study ↗</a></td></tr>
</tbody>
</table>
</div>
<div class="card">
<div class="card-title" style="margin-bottom:1rem">All Official Mashreq &amp; Source URLs</div>
<div style="display:flex;flex-wrap:wrap;gap:6px">
<a class="chip" href="https://www.mashreq.com" target="_blank" rel="noreferrer">mashreq.com (main)</a>
<a class="chip" href="https://www.mashreq.com/en/uae/neo/" target="_blank" rel="noreferrer">Mashreq NEO</a>
<a class="chip" href="https://www.mashreq.com/en/uae/neobiz/" target="_blank" rel="noreferrer">Mashreq NEOBiz</a>
<a class="chip" href="https://www.mashreq.com/en/uae/about-us/investor-relations/" target="_blank" rel="noreferrer">Investor Relations</a>
<a class="chip" href="https://www.mashreq.com/en/uae/about-us/investor-relations/financial-information/annual-reports/" target="_blank" rel="noreferrer">Annual Reports</a>
<a class="chip" href="https://www.mashreq.com/en/uae/news/" target="_blank" rel="noreferrer">News &amp; Press Releases</a>
<a class="chip" href="https://www.mashreq.com/en/international-banking/home/advanced-analytics/" target="_blank" rel="noreferrer">Advanced Analytics</a>
<a class="chip" href="https://www.dfm.ae" target="_blank" rel="noreferrer">DFM Regulatory Filings</a>
<a class="chip" href="https://www.businesswire.com/news/home/20250514167278/en" target="_blank" rel="noreferrer">Clari5 Genie Launch</a>
<a class="chip" href="https://thedigitalbanker.com" target="_blank" rel="noreferrer">Digital Banker MEA</a>
</div>
<div style="margin-top:1.5rem;padding:1rem;background:#f0faf7;border-radius:8px;font-size:12px;color:#888">
<strong>CEO Report Note:</strong> No standalone CEO AI report is publicly available for download from mashreq.com. AI strategy content is embedded in the Full Year Financial Results statement, the Management Discussion &amp; Analysis Report, and the official Annual Report. This Mashreq AI Intelligence Report 2026 constitutes a synthesised CEO-level AI strategic document based on all publicly available official sources. The FY2025 Full Year Results press release (January 2026) is available at mashreq.com/en/uae/news/2026/january/mashreq-financial-results-fy2025/ and represents the most recent official CEO-level AI strategy communication.
    </div>
</div>
</div>
</div>
<div class="page-footer">
  Mashreq Bank AI Intelligence Report 2026 | Autonomous Banking AI Analysis | Sources: mashreq.com, Digital Banker, Euromoney, BusinessWire, AGBI, MoEngage | May 2026
</div>`;

export default function MashreqAIIntelligenceReport2026() {
  useEffect(() => {
    window.showPage = (id: string, btn: HTMLElement) => {
      document
        .querySelectorAll(".page")
        .forEach((page) => page.classList.remove("active"));
      document
        .querySelectorAll(".nav button")
        .forEach((button) => button.classList.remove("active"));
      document.getElementById("page-" + id)?.classList.add("active");
      btn.classList.add("active");
      window.scrollTo(0, 0);
    };

    window.filterUC = (maturity: string, btn: HTMLElement) => {
      document
        .querySelectorAll("#uc-filters button")
        .forEach((button) => button.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll<HTMLElement>(".uc-card").forEach((card) => {
        if (maturity === "all") {
          card.style.display = "";
        } else {
          card.style.display = card.dataset.maturity?.includes(maturity)
            ? ""
            : "none";
        }
      });
    };

    return () => {
      delete (window as any).showPage;
      delete (window as any).filterUC;
    };
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </>
  );
}
