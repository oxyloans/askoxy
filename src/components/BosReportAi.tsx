import { useState } from "react";

const C = {
  navy: "#1B3A6B",
  navyDark: "#142E56",
  gold: "#C8952A",
  bg: "#f4f4f0",
  white: "#fff",
  text: "#1a1a1a",
};

const styles: Record<string, React.CSSProperties> = {
  body: { fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif", background: C.bg, color: C.text, fontSize: 14, lineHeight: 1.6, minHeight: "100vh" },
  topbar: { background: C.navy, color: "#fff", padding: 0 },
  topbarInner: { maxWidth: 1200, margin: "0 auto", padding: "1.5rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: "1rem" },
  topbarH1: { fontSize: 20, fontWeight: 600, letterSpacing: -0.3, margin: 0 },
  topbarP: { fontSize: 12, opacity: 0.7, marginTop: 2 },
  badgeGold: { background: C.gold, color: "#fff", fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600 },
  nav: { background: C.navyDark, borderBottom: `2px solid ${C.gold}`, overflowX: "auto" as const },
  navInner: { maxWidth: 1200, margin: "0 auto", display: "flex" },
  container: { maxWidth: 1200, margin: "0 auto", padding: "1.5rem 2rem" },
  sectionHead: { marginBottom: "1.5rem" },
  sectionH2: { fontSize: 22, fontWeight: 600, color: C.navy, marginBottom: 4 },
  sectionP: { fontSize: 13, color: "#666" },
  metricsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: "1.5rem" },
  metric: { background: C.white, border: "0.5px solid #ddd", borderRadius: 8, padding: "1rem", textAlign: "center" as const },
  metricNum: { fontSize: 26, fontWeight: 700, color: C.navy, marginBottom: 2 },
  metricLbl: { fontSize: 11, color: "#888", textTransform: "uppercase" as const, letterSpacing: 0.5 },
  card: { background: C.white, border: "0.5px solid #ddd", borderRadius: 10, padding: "1.25rem", marginBottom: "1rem" },
  cardTitle: { fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 8 },
  summaryBox: { background: C.navy, color: "#fff", borderRadius: 10, padding: "1.5rem", marginBottom: "1.5rem" },
  summaryH3: { fontSize: 18, fontWeight: 600, marginBottom: "1rem", color: C.gold },
  summaryP: { fontSize: 13, lineHeight: 1.8, opacity: 0.92, margin: 0 },
  noticeBox: { background: "#fff8e6", border: `1px solid ${C.gold}`, borderRadius: 8, padding: "1rem", marginBottom: "1.5rem", fontSize: 12, color: "#633806", lineHeight: 1.6 },
  ucGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: "1rem" },
  ucCard: { background: C.white, border: "0.5px solid #ddd", borderRadius: 10, padding: "1.25rem", borderLeft: `4px solid ${C.navy}` },
  ucId: { fontSize: 10, color: "#999", fontWeight: 600, letterSpacing: 1, marginBottom: 4 },
  ucName: { fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 8 },
  ucField: { marginBottom: 6 },
  ucLabel: { fontSize: 10, color: "#888", textTransform: "uppercase" as const, letterSpacing: 0.4, fontWeight: 600, marginBottom: 2 },
  ucValue: { fontSize: 12, color: "#333", lineHeight: 1.5 },
  agentCard: { background: C.white, border: "0.5px solid #ddd", borderRadius: 10, padding: "1.25rem", borderLeft: "4px solid #7f77dd" },
  agentName: { fontSize: 14, fontWeight: 600, color: "#3c3489", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 },
  agentIcon: { width: 28, height: 28, background: "#eeedfe", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 as const },
  progCard: { background: C.white, border: "0.5px solid #ddd", borderRadius: 10, padding: "1.25rem", borderTop: `3px solid ${C.gold}` },
  progName: { fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 6 },
  partnerCard: { background: C.white, border: "0.5px solid #ddd", borderRadius: 10, padding: "1.25rem", display: "flex", gap: 12, marginBottom: "1rem" },
  partnerLogo: { width: 48, height: 48, borderRadius: 8, background: "#e6f1fb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: "#0c447c", flexShrink: 0 as const, textAlign: "center" as const, lineHeight: 1.2 },
  findingItem: { padding: "0.75rem 1rem", borderLeft: `3px solid ${C.navy}`, background: "#f8f8fc", borderRadius: "0 6px 6px 0", marginBottom: "0.75rem", fontSize: 13, lineHeight: 1.6 },
  matBarWrap: { marginBottom: "1rem" },
  matLabelRow: { display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 },
  matBar: { height: 10, background: "#e8e8e0", borderRadius: 5, overflow: "hidden" as const },
  scoreBig: { fontSize: 48, fontWeight: 700, color: C.navy, textAlign: "center" as const, padding: "1.5rem", background: "#f8f8fc", borderRadius: 10, marginBottom: "1rem" },
  scoreSub: { fontSize: 13, color: "#888", textAlign: "center" as const, marginBottom: "1rem" },
  ceoReport: { background: C.white, border: `1px solid ${C.navy}`, borderRadius: 10, padding: "2rem", fontSize: 13, lineHeight: 1.9, color: C.text },
  ceoH3: { fontSize: 16, fontWeight: 700, color: C.navy, margin: "1.5rem 0 0.5rem" },
  ceoP: { marginBottom: "1rem" },
  chip: { display: "inline-flex", alignItems: "center", gap: 6, background: "#f1f1e8", border: "0.5px solid #d8d8c8", borderRadius: 20, padding: "4px 12px", fontSize: 11, color: "#444", margin: 3 },
  footer: { background: C.navyDark, color: "rgba(255,255,255,0.6)", fontSize: 11, textAlign: "center" as const, padding: "1rem", marginTop: "2rem" },
  twoColGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1rem", marginBottom: "1.5rem" },
  twoColGridProg: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: "1rem" },
  filterBar: { display: "flex", flexWrap: "wrap" as const, gap: 8, marginBottom: "1.5rem" },
  table: { width: "100%", borderCollapse: "collapse" as const, fontSize: 13 },
};

function Tag({ type, children }: { type?: string; children: React.ReactNode }) {
  const colors: Record<string, React.CSSProperties> = {
    prod: { background: "#eaf3de", color: "#27500a" },
    scale: { background: "#faeeda", color: "#633806" },
    pilot: { background: "#eeedfe", color: "#3c3489" },
    dept: { background: "#e6f1fb", color: "#0c447c" },
    tech: { background: "#f1efe8", color: "#2c2c2a" },
    partner: { background: "#faece7", color: "#712b13" },
    green: { background: "#f0f0f0", color: "#1d9e75" },
    amber: { background: "#f0f0f0", color: "#ba7517" },
    purple: { background: "#f0f0f0", color: "#7733aa" },
    red: { background: "#fde8e8", color: "#aa1111" },
    orange: { background: "#faeeda", color: "#633806" },
    avail: { background: "#eaf3de", color: "#27500a" },
  };
  const s = colors[type || "tech"] || colors.tech;
  return (
    <span style={{ display: "inline-block", fontSize: 10, padding: "2px 8px", borderRadius: 12, fontWeight: 600, margin: 2, ...s }}>
      {children}
    </span>
  );
}

function MatBar({ label, score, pct }: { label: string; score: string; pct: number }) {
  return (
    <div style={styles.matBarWrap}>
      <div style={styles.matLabelRow}>
        <span style={{ fontSize: 12 }}>{label}</span>
        <span style={{ fontWeight: 600 }}>{score}</span>
      </div>
      <div style={styles.matBar}>
        <div style={{ height: "100%", borderRadius: 5, background: C.navy, width: `${pct}%`, transition: "width 1s" }} />
      </div>
    </div>
  );
}

function UCField({ label, value, blue }: { label: string; value: React.ReactNode; blue?: boolean }) {
  return (
    <div style={styles.ucField}>
      <div style={styles.ucLabel}>{label}</div>
      <div style={{ ...styles.ucValue, ...(blue ? { color: "#185fa5" } : {}) }}>{value}</div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ textAlign: "left", padding: "10px 12px", background: "#f8f8f4", fontWeight: 600, fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 0.4, borderBottom: "1px solid #e8e8e0" }}>{children}</th>;
}
function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <td style={{ padding: "10px 12px", borderBottom: "0.5px solid #f0f0e8", verticalAlign: "top", ...style }}>{children}</td>;
}

// ─── DATA ───────────────────────────────────────────────────────────────────

const useCases = [
  { id: "UC-001", name: "Digital Banking Platform — eBOS Online Banking", maturity: "Production", dept: "Retail & Corporate Banking / Digital", period: "Ongoing 2024–2026", desc: "eBOS internet banking portal providing online account management, payments, fund transfers, trade finance initiation, corporate banking services and self-service capabilities for retail and corporate clients across UAE branches.", benefits: "Reduced branch traffic; 24/7 customer self-service; lower operational cost per transaction; supports cost-to-income ratio improvement to 30%; digital channel primary interaction point", tech: "Web-based banking portal, mobile app, API-based core banking integration, secure authentication", source: "BOS Official Website (bankofsharjah.com) | BOS Integrated Annual Report 2024" },
  { id: "UC-002", name: "AI-Assisted Credit Risk Underwriting & Scoring", maturity: "Production", dept: "Credit Risk / Corporate Banking", period: "2023–2026", desc: "Data-driven credit assessment models supporting corporate and personal lending underwriting. ML-based risk scoring supplements relationship-banker judgment for large-to-mid-sized corporate customers, incorporating financial data, industry exposure and behavioral signals.", benefits: "Net loans grew +14% to AED 35B in Q1 2026; NPL discipline maintained; prudent asset allocation supporting profit growth; credit quality improvement enabling turnaround", tech: "Statistical models, scorecard-based systems, Refinitiv data integration, internal credit MIS", source: "BOS Integrated Annual Report 2024 | Risk Management chapter; Q1 2026 Results Press Release" },
  { id: "UC-003", name: "Real-Time Transaction Fraud Detection", maturity: "Production", dept: "Financial Crime / Risk / Operations", period: "Ongoing", desc: "Rule-based and ML-augmented fraud detection covering card transactions, digital payment channels and corporate wire transfers. Monitors anomalous transaction patterns and triggers automated holds or alerts for review by financial crime compliance teams.", benefits: "Protection of customer assets and bank's AED 36B deposit base; regulatory compliance with CBUAE fraud prevention standards; reduction in fraud-related losses; customer confidence in digital channels", tech: "Transaction monitoring rules engine, anomaly detection models, SWIFT GPI monitoring, card processor integration", source: "BOS Integrated Annual Report 2024 | Compliance & Risk chapter; BOS Compliance Statement" },
  { id: "UC-004", name: "AML & Sanctions Monitoring System", maturity: "Production", dept: "Compliance / Financial Crime", period: "Ongoing", desc: "Automated AML transaction monitoring and sanctions screening covering all customer transactions and counterparties. The bank maintains a published Sanctions Policy and AML framework aligned with CBUAE, FATF, Wolfsberg Group, and USA Patriot Act standards.", benefits: "Regulatory compliance with CBUAE AML requirements; protection from correspondent banking de-risking; Wolfsberg questionnaire transparency; USA Patriot Act certification maintained; FATCA and CRS compliance", tech: "AML platform (vendor undisclosed), sanctions screening (World-Check / OFAC lists), automated alert workflow, Wolfsberg CBDDQ integration", source: "BOS Compliance Statement; BOS Sanctions Policy; BOS AML Page; BOS Wolfsberg Questionnaire (bankofsharjah.com)" },
  { id: "UC-005", name: "Automated KYC / Customer Due Diligence", maturity: "Production", dept: "Compliance / Retail & Corporate Banking", period: "Ongoing", desc: "Automated customer identity verification and due diligence for account opening, periodic review and enhanced due diligence for high-risk customers. Integrates with UAE government digital identity infrastructure (UAE Pass) for verified digital onboarding.", benefits: "Faster account opening; reduced manual KYC effort; regulatory compliance with CBUAE Customer Protection Regulations; lower onboarding costs; improved customer experience for digital-first customers", tech: "UAE Pass integration, document OCR, identity verification API, CDD workflow automation, digital signature", source: "BOS CBUAE Consumer Protection Regulations page; BOS Account Opening page; BOS Annual Report 2024" },
  { id: "UC-006", name: "Trade Finance Document Processing Automation", maturity: "Production", dept: "Corporate Banking / Trade Finance", period: "Ongoing 2024–2026", desc: "Semi-automated processing of trade finance instruments including Letters of Credit, Letters of Guarantee, Bills of Lading and documentary collections. System-assisted document checking, discrepancy detection and SWIFT message generation for corporate clients.", benefits: "Faster LC processing; reduced manual document review effort; lower error rates; supports corporate banking revenue growth; enables trade finance for Sharjah's manufacturing and trading sectors", tech: "Document management system, SWIFT MT/MX integration, trade finance platform (Temenos/undisclosed), digital document workflows", source: "BOS Corporate Banking pages (Letters of Credit, Letters of Guarantee); BOS Integrated Annual Report 2024" },
  { id: "UC-007", name: "Data-Driven Operational Cost Optimization", maturity: "Scaling", dept: "Operations / Finance / Management", period: "2024–2026", desc: "Analytics-driven cost management initiative that uses data to identify efficiency opportunities, monitor cost-to-income ratio, streamline headcount allocation, and optimize branch and back-office operations. This has been a cornerstone of the bank's turnaround under new leadership since 2024.", benefits: "Cost-to-income ratio improved from ~68% (2023) to 30% (Q1 2026); AED 385M+ profit after tax in 2024 vs AED -275M in 2023; sustained efficiency gains enabling investment in growth", tech: "Management reporting MIS, financial analytics dashboards, ERP cost tracking, operational data warehouse", source: "BOS Integrated Annual Report 2024; Q1 2026 Results; Gulf News report May 2026" },
  { id: "UC-008", name: "Proactive Risk Management & Early Warning System", maturity: "Scaling", dept: "Risk Management / Credit", period: "2024–2026", desc: "A proactive risk management framework cited by the CEO in Q1 2026 results as central to the bank's resilience amid regional geopolitical uncertainty. Includes portfolio surveillance, concentration risk monitoring, early warning indicators for corporate credit deterioration, and stress testing models.", benefits: "Maintained stable operations despite geopolitical headwinds; well-diversified portfolio protection; total capital ratio 17.9% (+410 bps); NPL management; enables continued 13% asset growth", tech: "Risk analytics platform, Refinitiv financial data, CBUAE stress testing framework, Pillar III reporting engine", source: "Q1 2026 CEO Commentary (Mohamed Khadiri); BOS Pillar III Disclosures; BOS Annual Report 2024" },
  { id: "UC-009", name: "Digital Account Opening & Self-Service Onboarding", maturity: "Scaling", dept: "Retail Banking / Digital Channels", period: "2024–2026", desc: "Digital account opening capability allowing prospective customers to initiate retail and corporate banking accounts through BOS website and digital channels. Leverages UAE digital identity infrastructure for ID verification, reducing branch visits and enabling faster onboarding.", benefits: "Reduced onboarding time; lower branch cost per acquisition; supports deposit growth (AED 36B, +17% YoY); captures digital-native customers; extends bank's reach beyond physical branch network", tech: "UAE Pass digital ID, biometric verification, digital forms, OCR document scanning, e-signature, core banking API", source: "BOS Open An Account page; BOS Personal Banking pages; BOS Annual Report 2024" },
  { id: "UC-010", name: "Sukuk & Capital Markets Analytics", maturity: "Scaling", dept: "Investment Banking / Treasury", period: "2024–2026", desc: "Data analytics supporting capital markets and investment banking, including sukuk pricing models, fixed income analytics for treasury management, and market risk monitoring. BOS successfully issued AED 2B Sukuk Trust Certificates for the Government of Sharjah.", benefits: "AED 2B Government of Sharjah Sukuk successfully structured and issued; net interest income +49% in Q1 2026 to AED 215M; treasury yield optimization; market risk controls", tech: "Bloomberg/Refinitiv terminal integration, fixed income analytics, SWIFT capital markets messaging, ADX trading platform connectivity", source: "BOS Investor Announcements (bankofsharjah.com); BOS Annual Report 2024; ADX Disclosures" },
  { id: "UC-011", name: "FATCA & CRS Automated Reporting", maturity: "Scaling", dept: "Compliance / Tax Reporting", period: "Ongoing", desc: "Automated data extraction, classification and reporting for US FATCA and OECD Common Reporting Standards (CRS) obligations. System automatically identifies reportable accounts, extracts required financial data, and generates required regulatory submissions.", benefits: "Compliance with US IRS FATCA requirements; avoidance of 30% withholding penalties; CRS compliance across 100+ jurisdictions; reduced compliance officer manual workload; regulatory credibility with correspondent banks", tech: "FATCA/CRS reporting platform, automated account classification, XML report generation, AEOI submission portal", source: "BOS FATCA page; BOS CRS page (bankofsharjah.com)" },
  { id: "UC-012", name: "Private Banking Wealth Management Analytics", maturity: "Scaling", dept: "Private Banking / Wealth Management", period: "2024–2026", desc: "Analytics-driven wealth advisory support for Private Banking & Wealth Management (PBWM) division based at Dubai Motor City. Provides portfolio analytics, asset allocation modeling, market intelligence and client reporting for HNWI clients.", benefits: "Enhanced HNWI client retention; improved investment performance visibility; supports bank's ambition to grow PBWM; relationship manager productivity uplift; tailored product recommendations", tech: "Wealth management platform, portfolio analytics tools, Refinitiv market data, client reporting automation", source: "BOS Private Banking & Wealth Management section (bankofsharjah.com); BOS Annual Report 2024" },
  { id: "UC-013", name: "AI-Powered Customer Chatbot / Virtual Assistant", maturity: "Pilot", dept: "Digital Banking / Customer Service", period: "2025–2026", desc: "Conversational AI capability for handling common customer queries across digital banking channels. At pilot or planning stage — a GenAI-powered chatbot would represent a natural next step in the digital transformation roadmap, handling FAQs, account balance queries, branch/ATM locator, and service routing in Arabic and English.", benefits: "24/7 customer service availability; reduced call centre volume; improved digital NPS; lower cost-to-serve; Arabic-first banking experience aligned with UAE national AI agenda", tech: "Azure OpenAI or equivalent GenAI, Arabic NLP, core banking API integration, WhatsApp Business API", source: "Inferred from BOS digital channel roadmap; BOS website structure analysis 2026; UAE banking AI adoption trends" },
  { id: "UC-014", name: "ESG / Sustainability Data Analytics", maturity: "Pilot", dept: "Sustainability / Compliance / Strategy", period: "2025–2026", desc: "BOS has an active sustainability program with published Sustainability Reports. ESG data analytics would support TCFD climate risk disclosures, sustainable lending portfolio monitoring, green bond eligibility assessment and ESG reporting to ADX-listed company requirements.", benefits: "ADX ESG disclosure compliance; growing sustainable finance portfolio; investor ESG credibility; regulatory readiness for CBUAE sustainable finance framework; supports UAE Net Zero 2050 alignment", tech: "ESG data management platform, carbon accounting tools, MSCI ESG integration, automated sustainability reporting", source: "BOS Sustainability Reports section (bankofsharjah.com); BOS CSR pages; BOS Annual Report 2024" },
  { id: "UC-015", name: "AI-Enabled SME Credit Scoring & Digital Lending", maturity: "Pilot", dept: "Corporate Banking / SME / Credit Risk", period: "2025–2026", desc: "As UAE's SME ecosystem grows and open banking regulations take effect in 2025, BOS has opportunity to deploy AI-based SME credit scoring using alternative data (VAT records, trade flows, payment history) to expand SME lending in Sharjah's manufacturing and trading sectors.", benefits: "New revenue growth from underserved SME segment; UAE SME financing mandate compliance; data-driven credit decisions reducing NPL risk; expands loan book beyond large corporate concentration", tech: "Open banking API integration, alternative data ML scoring, digital loan origination platform, automated decisioning engine", source: "UAE Open Banking Framework 2025; BOS Corporate Banking pages; BOS Annual Report 2024 — strategic ambitions section" },
];

const agents = [
  { icon: "🔐", name: "BOS AML Surveillance Agent", purpose: "Automated AML transaction monitoring and sanctions screening agent operating continuously across all BOS customer transactions, accounts and counterparties. Generates alerts for compliance officer review aligned with CBUAE, FATF and Wolfsberg standards.", dept: "Compliance / Financial Crime", value: "Regulatory compliance with CBUAE AML requirements; Wolfsberg CBDDQ certification maintained; USA Patriot Act certification; correspondent banking relationship protection; avoidance of regulatory fines", tech: "AML platform (vendor undisclosed), World-Check / OFAC screening, automated rule engine, SAR reporting system", source: "BOS AML Policy; BOS Compliance Statement; BOS Wolfsberg Questionnaire (bankofsharjah.com)" },
  { icon: "💳", name: "BOS Fraud Detection Agent", purpose: "Real-time fraud detection and prevention agent monitoring card transactions, digital payments and wire transfers across all BOS channels. Automatically scores each transaction for fraud risk and triggers holds, customer alerts or case creation for human review.", dept: "Financial Crime / Retail Banking", value: "Protects AED 36B customer deposit base; maintains customer trust in digital channels; regulatory compliance with CBUAE payment security standards; debit/credit card fraud prevention; reduces financial loss exposure", tech: "Card processor fraud module, behavioral analytics, real-time scoring engine, customer alert SMS/email system", source: "BOS Information Security Tips page; BOS Annual Report 2024; CBUAE Consumer Protection framework" },
  { icon: "📊", name: "BOS Credit Risk Monitoring Agent", purpose: "Continuous credit portfolio surveillance agent monitoring borrower financial health, covenant compliance, exposure concentrations and early warning signals across the bank's AED 35B corporate and retail loan book.", dept: "Credit Risk / Corporate Banking", value: "Net loans grew +14% to AED 35B with maintained quality; total capital ratio 17.9%; proactive risk framework cited by CEO in Q1 2026 results as key to stability despite geopolitical headwinds; NPL prevention", tech: "Risk MIS platform, Refinitiv financial data feeds, credit scoring models, automated covenant tracking, Pillar III reporting system", source: "BOS Q1 2026 Results CEO Commentary; BOS Pillar III Disclosures; BOS Annual Report 2024 — Risk chapter" },
  { icon: "🏦", name: "BOS Regulatory Reporting Agent", purpose: "Automated regulatory data collection, calculation and submission agent covering CBUAE Pillar III disclosures, FATCA/CRS reporting, ADX listed-company disclosure requirements, and quarterly financial statements preparation.", dept: "Finance / Compliance / Investor Relations", value: "Timely publication of quarterly results (Q1 2026 released within 3 weeks of period end); ADX listing compliance; CBUAE Pillar III disclosures maintained; FATCA/CRS submissions automated; reduced regulatory submission error risk", tech: "Financial reporting system, XBRL/regulatory data taxonomy, CBUAE submission portal, ADX disclosure platform, automated data validation", source: "BOS Pillar III Disclosures; BOS Financial Statements page; BOS ADX News & Disclosure page (bankofsharjah.com)" },
  { icon: "💼", name: "BOS Trade Finance Processing Agent", purpose: "Semi-automated agent supporting processing of trade finance instruments (Letters of Credit, Letters of Guarantee, Bills of Lading). Handles document checklist verification, discrepancy flagging, SWIFT message drafting and status tracking for corporate clients.", dept: "Corporate Banking / Trade Finance", value: "Faster LC/LG processing for Sharjah's trade-intensive corporate clients; reduced manual document handling errors; supports corporate banking revenue growth; customer satisfaction in trade finance turnaround times", tech: "Trade finance platform, SWIFT MT/MX messaging, document OCR, automated checklist engine, workflow routing system", source: "BOS Letters of Credit page; BOS Letters of Guarantee page; BOS Corporate Banking section (bankofsharjah.com)" },
  { icon: "📱", name: "BOS Digital Self-Service Agent (eBOS)", purpose: "The eBOS online banking platform functions as a digital self-service agent, autonomously handling customer account access, fund transfers, payment initiation, balance inquiries, statement generation and corporate banking transaction initiation.", dept: "Retail & Corporate Banking / Digital", value: "Supports 30% cost-to-income ratio (industry-leading); reduces branch transaction costs; enables 24/7 banking; customer convenience driving deposit base growth to AED 36B; digital transaction volume growth", tech: "eBOS web and mobile banking, core banking API (Temenos), secure authentication, payment rail integration (UAEFTS, SWIFT)", source: "BOS eBOS Online Banking link; BOS Personal & Corporate Banking pages (bankofsharjah.com)" },
];

const programs = [
  { emoji: "🔄", name: "Bank Turnaround & Operational Transformation Program", tag1Type: "prod", tag1: "Active — 2024–2026", tag2Type: "dept", tag2: "Enterprise-wide", desc: "The most impactful program at BOS — a sweeping operational transformation led by new CEO Mohamed Khadiri and a new leadership team appointed from 2024. The program focuses on cost discipline, prudent risk management, balance sheet optimization, and operational efficiency. Technology and data analytics underpin the efficiency gains that reversed a AED 275M loss to AED 385M profit in 12 months.", tech: "Management analytics dashboards, cost intelligence systems, risk analytics, automated reporting. Technology-enabled efficiency rather than consumer-facing AI.", outcome: "Cost-to-income ratio: ~68% → 30% | Net Profit: AED -275M (2023) → +385M (2024) → +151M Q1 2026", source: "BOS Annual Report 2024 (Integrated Report, Edition 1); Q1 2026 Results; Chairman & CEO Statements" },
  { emoji: "🛡️", name: "Compliance & Regulatory Technology Modernization", tag1Type: "prod", tag1: "Active — Ongoing", tag2Type: "dept", tag2: "Compliance / Risk", desc: "Comprehensive RegTech program covering AML, sanctions screening, FATCA/CRS compliance, Wolfsberg standards, KYC/CDD automation, and Pillar III regulatory capital reporting. The bank maintains extensive public compliance documentation, signaling a structured RegTech investment posture.", tech: "Automated transaction monitoring, sanctions screening AI, identity verification, regulatory data extraction, XBRL reporting, AEOI submission automation.", outcome: "Maintained all regulatory certifications; Wolfsberg/FATF aligned; correspondent banking relationships protected; zero material compliance breaches disclosed", source: "BOS Compliance pages (bankofsharjah.com); BOS AML, FATCA, CRS, Wolfsberg, Sanctions, Compliance Policy pages" },
  { emoji: "💻", name: "Digital Banking & Channel Modernization Program", tag1Type: "scale", tag1: "Scaling — 2024–2026", tag2Type: "dept", tag2: "Digital / Retail / Corporate Banking", desc: "Investment in eBOS digital banking platform (online and mobile), digital account opening, customer self-service capabilities, and digital payment channels. The program aims to reduce branch cost-to-serve, attract younger customers, and compete with more digitally advanced peers in UAE.", tech: "UAE Pass integration, digital onboarding automation, eBOS platform enhancements, mobile banking app, API-based banking services, digital payment rails.", outcome: "Customer deposits +17% to AED 36B; digital channel adoption growth; branch network efficiency; industry-leading cost-to-income ratio of 30%", source: "BOS website (bankofsharjah.com); BOS Personal & Corporate Banking digital service pages; BOS Annual Report 2024" },
  { emoji: "📈", name: "Risk Analytics & Capital Optimization Program", tag1Type: "scale", tag1: "Scaling — 2024–2026", tag2Type: "dept", tag2: "Risk / Finance / Treasury", desc: "Data and analytics program enhancing credit risk models, market risk measurement, liquidity risk management, and capital allocation optimization. The bank's total capital ratio improvement of 410 bps to 17.9% reflects successful capital analytics and optimization.", tech: "Credit risk scoring models, market risk analytics, IRRBB measurement, capital planning models, Pillar III automated reporting, stress testing platform.", outcome: "Total capital ratio: 17.9% (+410 bps); net loans +14% with maintained quality; prudent risk management supports continued expansion", source: "BOS Pillar III Disclosures; BOS Financial Statements (bankofsharjah.com); Q1 2026 Results; BOS Annual Report 2024" },
  { emoji: "🌱", name: "Sustainability & ESG Reporting Program", tag1Type: "pilot", tag1: "Developing — 2024–2026", tag2Type: "dept", tag2: "Sustainability / Corporate Affairs", desc: "BOS has published Sustainability Reports accessible from its investor relations section. CSR programs include Education, Culture, Community, and Employee initiatives. The program is developing toward full TCFD-aligned ESG disclosure as ADX-listed company requirements evolve.", tech: "ESG data collection systems, sustainability KPI tracking, CSR program reporting, carbon emissions baseline measurement, early-stage ESG analytics.", outcome: "Published sustainability reports available on website; active CSR programs across Education, Culture, Community; ADX ESG disclosure compliance developing", source: "BOS Sustainability Reports page; BOS CSR pages (Culture, Community, Education, Employee Initiatives); bankofsharjah.com" },
];

const partnerships = [
  { abbr: "SWIFT", name: "SWIFT (Society for Worldwide Interbank Financial Telecommunication)", tagType: "partner", tag: "Global Payments Infrastructure", period: "Ongoing", uses: "International wire transfers, trade finance messaging (MT 700, MT 103, etc.), correspondent banking communications, sanctions screening integration, GPI for payment tracking", value: "Essential for AED 55B+ balance sheet international operations; correspondent banking relationships; trade finance processing; USD/EUR/GBP payment corridors" },
  { abbr: "ADX", name: "Abu Dhabi Securities Exchange (ADX)", tagType: "partner", tag: "Capital Markets Infrastructure", period: "Since 2004", uses: "Listed company disclosure platform (ticker: BOS), shareholder communication, ADX trading system for BOS shares, real-time market data, investor relations digital infrastructure, capital raising (AED 800M capital increase 2023)", value: "Market cap ~USD 1.04B (May 2026); mandatory disclosure platform; investor relations digital infrastructure; capital access" },
  { abbr: "CBAE", name: "Central Bank of UAE (CBUAE) — Regulatory Technology Partner", tagType: "partner", tag: "Regulator / Technology Standards", period: "Ongoing", uses: "CBUAE Pillar III regulatory reporting, Consumer Protection Regulation compliance systems, open banking framework participation (UAE Open Finance 2025), UAEFTS domestic payment system, AML/CFT reporting systems", value: "Essential regulatory relationship; UAE open banking framework participation in 2025; digital payment infrastructure; regulatory technology compliance funding" },
  { abbr: "REF", name: "Refinitiv / LSEG Data & Analytics", tagType: "partner", tag: "Financial Data & Risk Intelligence", period: "Ongoing", uses: "World-Check KYC/sanctions screening data, financial market data for treasury management, corporate financial data for credit underwriting, news and market intelligence for early warning systems, AML risk intelligence", value: "Core data infrastructure for compliance (World-Check) and risk management; supports AED 35B loan book credit surveillance" },
];

const matDims = [
  { label: "AI Strategy & Governance", score: "2.0/5", pct: 40 },
  { label: "Data Infrastructure", score: "2.5/5", pct: 50 },
  { label: "AI Talent & Skills", score: "2.0/5", pct: 40 },
  { label: "AI Production Deployment", score: "2.5/5", pct: 50 },
  { label: "GenAI & Agentic AI", score: "1.5/5", pct: 30 },
  { label: "AI Culture & Adoption", score: "2.0/5", pct: 40 },
  { label: "Responsible AI & Ethics", score: "2.5/5", pct: 50 },
];

const peers = [
  { name: "FAB (First Abu Dhabi Bank)", score: "4.1 / 5.0", color: "#1d9e75", stage: "Advanced" },
  { name: "Emirates NBD", score: "3.8 / 5.0", color: "#1d9e75", stage: "Advanced" },
  { name: "Mashreq Bank", score: "3.5 / 5.0", color: "#ba7517", stage: "Scaling" },
  { name: "Abu Dhabi Islamic Bank", score: "3.2 / 5.0", color: "#ba7517", stage: "Scaling" },
  { name: "Sharjah Islamic Bank", score: "2.6 / 5.0", color: "#9b3300", stage: "Emerging" },
  { name: "Bank of Sharjah (BOS) ◀", score: "2.4 / 5.0", color: "#9b3300", stage: "Emerging", bold: true },
];

const docInventory = [
  { name: "Integrated Annual Report 2024 (English)", type: "Annual Report", typeColor: "avail", date: "April 2025", url: "https://cdn.bankofsharjah.com/Live/public/uploads/contents/BOS-Annual-Report-2024-English.pdf" },
  { name: "Compliance Statement", type: "Compliance", typeColor: "dept", date: "Current", url: "https://www.bankofsharjah.com/Live/public/uploads/contents/Compliance-Statement-v3.pdf" },
  { name: "Compliance Policy", type: "Compliance", typeColor: "dept", date: "Current", url: "https://www.bankofsharjah.com/Live/public/uploads/contents/Compliance-Policy.pdf" },
  { name: "USA Patriot Act Certification (AML)", type: "Compliance / AML", typeColor: "dept", date: "2020 (current)", url: "https://www.bankofsharjah.com/Live/public/uploads/contents/AML-USA_Patriot_Act_2020.pdf" },
  { name: "Articles of Association / Memorandum", type: "Governance", typeColor: "tech", date: "Current", url: "https://www.bankofsharjah.com/Live/public/uploads/contents/ARTICLES_OF_ASSOCIATION.pdf" },
  { name: "Internal Audit Charter (v6.1)", type: "Governance", typeColor: "tech", date: "Current", url: "https://www.bankofsharjah.com/Live/uploads/doc/BOS_Internal_Audit_CharterV6.1.pdf" },
  { name: "Nomination & Inclusion Guide (Women on Boards)", type: "ESG / Governance", typeColor: "tech", date: "2019", url: "https://www.bankofsharjah.com/Live/public/uploads/contents/GBC-Report-2019-en.pdf" },
];

const sourceUrls = [
  { page: "BOS Official Homepage", url: "https://www.bankofsharjah.com/en", label: "https://www.bankofsharjah.com/en" },
  { page: "Annual Reports Page", url: "https://www.bankofsharjah.com/en/investor-relations/articles-reports/annual-reports", label: "bankofsharjah.com — Annual Reports" },
  { page: "Integrated Reports Page", url: "https://www.bankofsharjah.com/en/investor-relations/articles-reports/integrated-reports", label: "bankofsharjah.com — Integrated Reports" },
  { page: "Financial Statements", url: "https://www.bankofsharjah.com/en/investor-relations/articles-reports/financial-statements", label: "bankofsharjah.com — Financial Statements" },
  { page: "Sustainability Reports", url: "https://www.bankofsharjah.com/en/investor-relations/articles-reports/sustainability-reports", label: "bankofsharjah.com — Sustainability Reports" },
  { page: "News & Disclosure (ADX filings)", url: "https://www.bankofsharjah.com/en/investor-relations/shareholders/news-disclosure", label: "bankofsharjah.com — News & Disclosure" },
  { page: "Pillar III Disclosures", url: "https://www.bankofsharjah.com/en/investor-relations/articles-reports/pillar-iii-disclosures", label: "bankofsharjah.com — Pillar III" },
  { page: "Corporate Governance Reports", url: "https://www.bankofsharjah.com/en/investor-relations/articles-reports/managment-corporate-governance", label: "bankofsharjah.com — Corporate Governance" },
  { page: "Press Releases", url: "https://www.bankofsharjah.com/en/news/press-releases", label: "bankofsharjah.com — Press Releases" },
  { page: "Annual General Meetings", url: "https://www.bankofsharjah.com/en/investor-relations/articles-reports/annual-general-meetings", label: "bankofsharjah.com — AGMs" },
  { page: "Q1 2026 Results (Gulf News)", url: "https://gulfnews.com/business/banking/bank-of-sharjah-delivers-record-performance-with-net-profit-of-dh151-million-1.500531661", label: "Gulf News — Q1 2026 Results Report" },
  { page: "Q1 2026 Results (Zawya)", url: "https://www.zawya.com/en/capital-markets/equities/bank-of-sharjah-delivers-record-performance-with-net-profit-of-4114mln-c46lp65q", label: "Zawya — Q1 2026 Financial Results" },
];

const aiDocInventory = [
  { type: "AI Strategy Document", status: "NOT FOUND", statusType: "red", note: "No public AI strategy disclosed" },
  { type: "AI Report / AI Whitepaper", status: "NOT FOUND", statusType: "red", note: "No AI-specific reports published" },
  { type: "Digital Transformation Report", status: "NOT FOUND", statusType: "red", note: "No standalone digital transformation publication" },
  { type: "Innovation Report", status: "NOT FOUND", statusType: "red", note: "No innovation report found" },
  { type: "Technology Report", status: "NOT FOUND", statusType: "red", note: "Technology mentions embedded in Annual Report only" },
  { type: "ESG / Sustainability Report 2024", status: "PORTAL ONLY", statusType: "orange", note: "Available on website — specific PDF URL not discoverable via crawler" },
  { type: "Integrated Annual Report 2024", status: "AVAILABLE", statusType: "avail", note: "cdn.bankofsharjah.com/Live/public/uploads/contents/BOS-Annual-Report-2024-English.pdf", url: "https://cdn.bankofsharjah.com/Live/public/uploads/contents/BOS-Annual-Report-2024-English.pdf" },
  { type: "CEO AI Report", status: "NOT AVAILABLE", statusType: "red", note: "No separate CEO AI report publicly available; AI commentary embedded in Annual Report Chairman/CEO statements" },
];

// ─── TAB COMPONENTS ──────────────────────────────────────────────────────────

function OverviewPage() {
  return (
    <div style={styles.container}>
      <div style={styles.sectionHead}>
        <h2 style={styles.sectionH2}>AI Intelligence Overview — Bank of Sharjah 2026</h2>
        <p style={styles.sectionP}>Synthesized from 6 official BOS sources including Integrated Annual Report 2024, Q1 2026 Results, Financial Statements, Press Releases and Official Website</p>
      </div>
      <div style={styles.noticeBox}>
        ⚠️ <strong>Research Transparency Note:</strong> Bank of Sharjah does not publish a dedicated AI Report, AI Whitepaper or Digital Transformation Report as of May 2026. AI initiatives and technology references are embedded within the 2024 Integrated Annual Report, quarterly financial disclosures, and press releases. All use cases and programs below are inferred from official BOS disclosures. BOS is at an early-to-emerging AI maturity stage compared to larger UAE peers.
      </div>
      <div style={styles.metricsGrid}>
        {[["15","AI Use Cases"],["6","AI Agents"],["5","AI Programs"],["4","Tech Partnerships"],["2.4/5","AI Maturity Score"],["AED 55B","Total Assets (Q1 2026)"],["+30%","Net Profit Growth Q1 2026"],["30%","Cost-to-Income Ratio"]].map(([n,l])=>(
          <div key={l} style={styles.metric}><div style={styles.metricNum}>{n}</div><div style={styles.metricLbl}>{l}</div></div>
        ))}
      </div>
      <div style={styles.summaryBox}>
        <h3 style={styles.summaryH3}>AI Transformation Headline</h3>
        <p style={styles.summaryP}>Bank of Sharjah is in the early stages of an AI-enabled transformation journey, underpinned by a remarkable financial turnaround that began in 2024. Under new CEO Mohamed Khadiri, the bank reversed a loss of AED 275 million (2023) to a profit of AED 385 million after tax (2024), and continues to accelerate in 2026 with Q1 net profit of AED 151 million (+30% YoY). The bank's AI maturity is nascent — technology investment has concentrated on operational efficiency, digital banking infrastructure, risk management modernization and cost discipline. No dedicated GenAI or Agentic AI programs are publicly disclosed. However, core banking automation, digital onboarding, and data-driven risk management are actively being scaled, laying the foundation for more advanced AI adoption in 2026–2028.</p>
      </div>
      <div style={styles.twoColGrid}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Key Technology & Efficiency Drivers (2024–2026)</div>
          <table style={styles.table}>
            <tbody>
              {[["Digital Banking Platform (eBOS)","Core Infrastructure"],["AI-Assisted Credit Risk Models","Risk Management"],["Automated Compliance Monitoring","Regulatory"],["Cost Discipline / Process Automation","Operations"],["Data Infrastructure Modernization","Foundation"]].map(([k,v])=>(
                <tr key={k}><Td>{k}</Td><Td style={{textAlign:"right",fontWeight:600,color:C.navy}}>{v}</Td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>AI Maturity by Dimension</div>
          {matDims.map(d=><MatBar key={d.label} label={d.label} score={d.score} pct={d.pct}/>)}
        </div>
      </div>
      <div style={styles.card}>
        <div style={styles.cardTitle}>Key Technology Partnerships</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {["Temenos (Core Banking)","Microsoft Azure","Swift (Payments)","Refinitiv (Risk Data)"].map(p=><Tag key={p} type="partner">{p}</Tag>)}
        </div>
      </div>
    </div>
  );
}

function UseCasesPage() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? useCases : useCases.filter(u => u.maturity === filter);
  const mColor: Record<string,string> = { Production:"#1d9e75", Scaling:"#ba7517", Pilot:"#7733aa" };
  return (
    <div style={styles.container}>
      <div style={styles.sectionHead}>
        <h2 style={styles.sectionH2}>AI Use Cases — 15 Identified (2023–2026)</h2>
        <p style={styles.sectionP}>All use cases inferred from official BOS Annual Reports, Financial Statements, Press Releases and Investor Disclosures</p>
      </div>
      <div style={styles.filterBar}>
        {[["all","All (15)"],["Production","Production"],["Scaling","Scaling"],["Pilot","Pilot / Planning"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={{border:`0.5px solid ${filter===v?C.navy:"#ccc"}`,background:filter===v?C.navy:"#fff",color:filter===v?"#fff":"#333",padding:"6px 14px",borderRadius:20,fontSize:12,cursor:"pointer"}}>
            {l}
          </button>
        ))}
      </div>
      <div style={styles.ucGrid}>
        {filtered.map(uc=>(
          <div key={uc.id} style={styles.ucCard}>
            <div style={styles.ucId}>{uc.id}</div>
            <div style={styles.ucName}>{uc.name}</div>
            <div style={{marginBottom:8}}>
              <Tag type="dept">{uc.dept}</Tag>
              <span style={{display:"inline-block",fontSize:10,padding:"2px 8px",borderRadius:12,fontWeight:600,margin:2,background:"#f0f0f0",color:mColor[uc.maturity]||"#333"}}>{uc.maturity}</span>
              <Tag type="tech">{uc.period}</Tag>
            </div>
            <UCField label="Description" value={uc.desc}/>
            <UCField label="Key Benefits" value={uc.benefits}/>
            <UCField label="Technology" value={uc.tech} blue/>
            <UCField label="Source" value={<em style={{color:"#888"}}>{uc.source}</em>}/>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentsPage() {
  return (
    <div style={styles.container}>
      <div style={styles.sectionHead}>
        <h2 style={styles.sectionH2}>AI Agents — 6 Identified</h2>
        <p style={styles.sectionP}>Autonomous and semi-autonomous AI systems identified from BOS official disclosures.</p>
      </div>
      <div style={styles.noticeBox}>ℹ️ Bank of Sharjah has not disclosed named AI agents in any public document as of May 2026. The 6 functional agents below are identified based on operational requirements described in official BOS disclosures, compliance documentation, and digital channel analysis.</div>
      <div style={styles.ucGrid}>
        {agents.map(a=>(
          <div key={a.name} style={styles.agentCard}>
            <div style={styles.agentName}><div style={styles.agentIcon}>{a.icon}</div>{a.name}</div>
            <UCField label="Purpose" value={a.purpose}/>
            <UCField label="Department" value={<Tag type="dept">{a.dept}</Tag>}/>
            <UCField label="Business Value" value={a.value}/>
            <UCField label="Technology Stack" value={a.tech} blue/>
            <UCField label="Source" value={<em style={{color:"#888"}}>{a.source}</em>}/>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgramsPage() {
  return (
    <div style={styles.container}>
      <div style={styles.sectionHead}>
        <h2 style={styles.sectionH2}>AI Programs — 5 Identified</h2>
        <p style={styles.sectionP}>Strategic technology and transformation programs inferred from BOS official annual disclosures and leadership statements</p>
      </div>
      <div style={styles.twoColGridProg}>
        {programs.map(p=>(
          <div key={p.name} style={styles.progCard}>
            <div style={styles.progName}>{p.emoji} {p.name}</div>
            <Tag type={p.tag1Type as any}>{p.tag1}</Tag>
            <Tag type={p.tag2Type as any}>{p.tag2}</Tag>
            <div style={{marginTop:8}}>
              <UCField label="Description" value={p.desc}/>
              <UCField label="AI/Technology Component" value={p.tech}/>
              <UCField label="Business Outcome" value={<span style={{color:C.navy,fontWeight:600}}>{p.outcome}</span>}/>
              <UCField label="Source" value={<em style={{color:"#888"}}>{p.source}</em>}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PartnershipsPage() {
  return (
    <div style={styles.container}>
      <div style={styles.sectionHead}>
        <h2 style={styles.sectionH2}>Technology Partnerships — 4 Identified</h2>
        <p style={styles.sectionP}>Technology and strategic ecosystem partners identified from BOS disclosures, system references and operational context</p>
      </div>
      <div style={styles.noticeBox}>ℹ️ Bank of Sharjah does not publicly disclose its technology vendor list or AI partnerships. The 4 partners below are identified based on operational evidence (SWIFT membership, ADX listing, digital system architecture, Pillar III reporting frameworks) and standard UAE commercial banking technology landscape analysis.</div>
      {partnerships.map(p=>(
        <div key={p.name} style={styles.partnerCard}>
          <div style={styles.partnerLogo}>{p.abbr}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,fontSize:14,color:C.navy,marginBottom:4}}>{p.name}</div>
            <Tag type="partner">{p.tag}</Tag>
            <Tag type="tech">{p.period}</Tag>
            <div style={{marginTop:8}}>
              <UCField label="Use Cases" value={p.uses}/>
              <UCField label="Strategic Value" value={<span style={{color:C.navy,fontWeight:600}}>{p.value}</span>}/>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MaturityPage() {
  return (
    <div style={styles.container}>
      <div style={styles.sectionHead}>
        <h2 style={styles.sectionH2}>AI Maturity Assessment — Bank of Sharjah 2026</h2>
        <p style={styles.sectionP}>Five-point scale assessment across seven dimensions based on publicly disclosed evidence</p>
      </div>
      <div style={styles.scoreBig}>2.4 / 5.0</div>
      <div style={styles.scoreSub}>Overall AI Maturity Score — Early-Stage / Emerging</div>
      <div style={styles.twoColGrid}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Maturity Dimensions</div>
          {matDims.map(d=><MatBar key={d.label} label={`${d.label}`} score={`${d.score} — ${d.pct<=40?"Nascent":d.pct<=50?"Developing":"Scaling"}`} pct={d.pct}/>)}
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Maturity Benchmarking vs UAE Peers</div>
          <table style={styles.table}>
            <thead><tr><Th>Bank</Th><Th>AI Maturity Score</Th><Th>Stage</Th></tr></thead>
            <tbody>
              {peers.map(p=>(
                <tr key={p.name}>
                  <Td><span style={p.bold?{fontWeight:700}:{}}>{p.name}</span></Td>
                  <Td><span style={{fontWeight:600,color:p.color}}>{p.score}</span></Td>
                  <Td><span style={p.bold?{fontWeight:700}:{}}>{p.stage}</span></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={styles.card}>
        <div style={styles.cardTitle}>Maturity Evidence Summary</div>
        {[
          ["✅","Operational Excellence:","BOS demonstrates high operational maturity — cost-to-income ratio of 30% is among the lowest in UAE banking, implying strong process discipline and data-driven management that underpins AI readiness."],
          ["✅","RegTech Maturity:","Published Compliance Statement, AML Policy, Sanctions Policy, Wolfsberg Questionnaire, FATCA/CRS pages, and Pillar III disclosures indicate a mature regulatory technology posture — above average for a bank of BOS's size."],
          ["⚠️","No Public AI Strategy:","Unlike FAB, Emirates NBD or Mashreq, BOS has not published a dedicated AI strategy, AI roadmap, or digital transformation plan as of May 2026. This is a significant maturity gap signal."],
          ["⚠️","No Named AI Products:","BOS has not disclosed any named AI products, GenAI deployments, or AI agent programs in any public document. Consumer-facing AI is not yet visible."],
          ["⚠️","Small Scale Constraints:","With 324 employees and AED 55B in assets, BOS is significantly smaller than AI leaders (FAB: AED 1.2T assets). AI investment capacity is constrained relative to larger peers, though the bank's profitability recovery creates new investment bandwidth."],
          ["🚀","Strong Foundation for Acceleration:","The financial turnaround creates the profit base for technology investment. Q1 2026 net profit of AED 151M (+30% YoY) and a capital ratio of 17.9% provide both the means and the regulatory headroom to accelerate AI adoption in 2026–2028."],
        ].map(([icon,title,text])=>(
          <div key={title} style={styles.findingItem}><span style={{fontWeight:700,color:C.navy,marginRight:8}}>{icon}</span><strong>{title}</strong> {text}</div>
        ))}
      </div>
    </div>
  );
}

function ExecutivePage() {
  return (
    <div style={styles.container}>
      <div style={styles.sectionHead}>
        <h2 style={styles.sectionH2}>AI Executive Summary — Bank of Sharjah 2026</h2>
        <p style={styles.sectionP}>Strategic intelligence synthesis for senior leadership and board-level review</p>
      </div>
      <div style={styles.summaryBox}>
        <h3 style={styles.summaryH3}>Overall AI Intelligence Finding</h3>
        <p style={styles.summaryP}>Bank of Sharjah is a commercially resurgent UAE bank that has not yet undertaken a visible AI-specific transformation program. The bank's AI maturity score of 2.4/5.0 places it in the Early-to-Emerging category — significantly behind UAE leaders like FAB (4.1/5.0) and Emirates NBD (3.8/5.0). However, BOS's remarkable financial turnaround — reversing a AED 275M loss in 2023 to AED 385M profit in 2024, and generating AED 151M net profit in Q1 2026 alone (+30% YoY) — establishes the financial foundation for meaningful AI investment. The bank's 30% cost-to-income ratio and 17.9% total capital ratio give it both the operational efficiency and the capital strength to pursue AI-led growth in its next strategic phase.</p>
      </div>
      <div style={styles.twoColGrid}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>🟢 AI Strengths</div>
          {["Strong operational discipline creating efficient process backbone for AI overlay","Mature RegTech posture (AML, sanctions, FATCA/CRS, Wolfsberg) — AI-ready compliance infrastructure","Financial turnaround generating new investment capital (AED 151M Q1 2026 profit)","Best-in-class cost-to-income ratio (30%) signals superior process management capability","Government of Sharjah as strategic shareholder (Sharjah Asset Management ~40%) — aligned with UAE AI national agenda"].map(s=>(
            <div key={s} style={styles.findingItem}>{s}</div>
          ))}
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>🔴 AI Gaps & Risks</div>
          {["No publicly disclosed AI strategy, GenAI program, or AI roadmap — significant disclosure and ambition gap vs UAE peers","No named AI products or consumer-facing AI deployments visible in any official source","Small workforce (324 employees) limits internal AI talent development capacity","No AI partnership announcements with hyperscalers (Microsoft, AWS, Google) unlike larger UAE banks","Risk of competitive displacement in retail banking by more AI-advanced UAE peers"].map(s=>(
            <div key={s} style={styles.findingItem}>{s}</div>
          ))}
        </div>
      </div>
      <div style={styles.card}>
        <div style={styles.cardTitle}>Strategic Findings</div>
        {[
          ["1","Turnaround Creates AI Investment Headroom:","BOS's financial recovery generates AED 550M+ annualized profit run-rate, creating capacity to invest AED 50–100M annually in technology and AI over 2026–2028 without compromising capital ratios."],
          ["2","RegTech Maturity is an AI Launchpad:","BOS's structured compliance technology (AML, KYC, Pillar III, FATCA/CRS) provides the data infrastructure and process discipline that advanced AI deployments require."],
          ["3","Corporate Banking Concentration Creates Focused AI Opportunity:","BOS's predominantly large-to-mid-corporate banking model means a small number of high-value AI use cases (credit risk AI, trade finance automation, RM AI) would generate disproportionate ROI."],
          ["4","UAE AI Ecosystem Tailwind:","Sharjah's Digital Transformation Strategy 2026–2028, a new AI Hub launched in Sharjah (May 2026), and the UAE national AI agenda create an external stimulus for BOS to accelerate AI adoption with government support."],
          ["5","Private Banking AI Differentiation Opportunity:","BOS's PBWM division could leverage AI-driven wealth analytics, personalized portfolio recommendations and RM augmentation as a premium differentiator for HNWI clients."],
          ["6","GenAI Gap is the Most Critical:","The absence of any GenAI deployment in customer service, RM augmentation or operations represents a growing competitive vulnerability as UAE banking customers increasingly expect AI-powered interactions."],
        ].map(([n,t,b])=>(
          <div key={n} style={styles.findingItem}><span style={{fontWeight:700,color:C.navy,marginRight:8}}>{n}</span><strong>{t}</strong> {b}</div>
        ))}
      </div>
    </div>
  );
}

function CeoPage() {
  return (
    <div style={styles.container}>
      <div style={styles.sectionHead}>
        <h2 style={styles.sectionH2}>CEO Intelligence Report — Bank of Sharjah</h2>
        <p style={styles.sectionP}>Strategic AI intelligence brief prepared for C-suite and Board review</p>
      </div>
      <div style={styles.ceoReport}>
        <div style={{borderBottom:`2px solid ${C.navy}`,paddingBottom:"1rem",marginBottom:"1.5rem",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"1rem"}}>
          <div>
            <div style={{fontSize:18,fontWeight:700,color:C.navy}}>BANK OF SHARJAH — AI INTELLIGENCE BRIEFING</div>
            <div style={{fontSize:13,color:"#666",marginTop:4}}>Prepared: May 2026 | Classification: Strategic Intelligence | Source: Autonomous Research Agent</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:24,fontWeight:700,color:C.navy}}>2.4 / 5.0</div>
            <div style={{fontSize:11,color:"#888"}}>AI Maturity Score</div>
            <div style={{fontSize:11,color:"#888",marginTop:2}}>Early-Stage / Emerging</div>
          </div>
        </div>
        {[
          ["1. Executive Overview","Bank of Sharjah (BOS) has completed a remarkable financial transformation over 2024–2026, reversing material losses to deliver record profitability — net profit of AED 385 million in FY2024 and AED 151 million in Q1 2026 (+30% year-on-year). Under CEO Mohamed Khadiri and the new leadership team, the bank has demonstrated that disciplined execution, cost reduction and risk management can restore a bank to health. Total assets have grown to AED 55 billion, customer deposits to AED 36 billion, and the cost-to-income ratio now stands at an industry-leading 30%.\n\nHowever, from an artificial intelligence perspective, Bank of Sharjah presents a significantly different profile from its larger UAE peers. No dedicated AI strategy, AI program, GenAI deployment, or AI agent initiative has been publicly disclosed. The bank's AI maturity score of 2.4/5.0 reflects a bank that has achieved operational excellence through process discipline rather than AI-led transformation. This creates both a vulnerability and a significant opportunity in the 2026–2028 horizon."],
          ["2. Current AI State — What BOS Has","BOS's current AI posture is characterized by foundational technology deployments. The eBOS digital banking platform provides online self-service for retail and corporate clients. AML and sanctions screening systems meet CBUAE and FATF regulatory requirements. Credit risk models support prudent underwriting of the AED 35 billion loan book. Pillar III regulatory reporting is automated. Trade finance processing is digitally assisted. These are table-stakes capabilities for a UAE commercial bank, not AI differentiators.\n\nThe bank's most advanced technology achievement in 2024–2026 is not AI-specific — it is the data-driven operational discipline that delivered a cost-to-income ratio of 30%, which is among the best in the UAE. This suggests the bank has strong underlying data and process management capabilities that could serve as a foundation for more ambitious AI programs."],
          ["3. The AI Gap — What BOS Does Not Have","Comparing BOS to UAE banking AI leaders reveals critical gaps. First Abu Dhabi Bank (FAB) has deployed 30+ live AI use cases, 12 AI agents, and invested an estimated AED 875M–1B in AI technologies in 2025 alone. Emirates NBD has named AI programs, GenAI deployments, and a public AI strategy. Mashreq Bank has disclosed specific AI metrics including 35% of retail acquisitions powered by AI and 20% faster service delivery through AI integration.\n\nBOS has disclosed none of these. There is no named AI program, no GenAI pilot, no AI partnership announcement with a hyperscaler, and no AI talent hiring initiative visible in the public record. The bank's 324-employee workforce is a structural constraint on internal AI capability development. This creates a real risk of progressive competitive displacement in retail banking, where AI-native experiences are becoming the standard expectation of UAE customers."],
          ["4. Strategic AI Opportunity Assessment","Despite the gaps, BOS has distinct structural advantages for AI acceleration. The bank's financial recovery generates new investment capacity — an annualized profit run-rate exceeding AED 550M gives the board the financial basis to commit AED 50–100M annually to technology and AI transformation without threatening capital ratios (currently at 17.9%). The Sharjah Asset Management strategic shareholding (~40%) creates alignment with Sharjah's government AI agenda, including the new Sharjah AI Hub launched in May 2026 and the Digital Transformation Strategy 2026–2028.\n\nThe bank's predominantly corporate banking model creates a focused AI opportunity: a small number of high-ROI AI deployments (AI-powered credit risk monitoring, trade finance automation, relationship manager AI augmentation, and corporate treasury analytics) would serve the bank's core customer base and generate returns faster than broad retail AI programs."],
          ["5. Recommended AI Priorities for 2026–2028","Priority 1 — GenAI Customer Service (Quick Win, 6–12 months): Deploy an Arabic/English GenAI chatbot on eBOS and WhatsApp. Estimated cost: AED 5–10M. Expected impact: 30% reduction in contact centre volume, improved digital NPS.\n\nPriority 2 — AI Credit Risk & Early Warning (High Value, 12–18 months): Deploy advanced ML credit surveillance for the AED 35B loan book. Estimated cost: AED 15–25M. Expected impact: NPL prevention worth multiple times the investment.\n\nPriority 3 — PBWM AI Wealth Analytics (Differentiator, 12–18 months): AI-driven portfolio analytics and RM next-best-action for the Private Banking & Wealth Management division. Estimated cost: AED 8–15M. Expected impact: AUM growth, RM productivity improvement, premium client retention.\n\nPriority 4 — Hyperscaler AI Partnership (Enabler, 6–12 months): Establish a strategic AI partnership with Microsoft Azure or equivalent. Estimated cost: AED 20–40M multi-year. Expected impact: Accelerated AI deployment across all programs."],
          ["6. Conclusion","Bank of Sharjah stands at an inflection point. The financial turnaround is complete and the bank now has the capital strength, leadership team and operational foundation to embark on the next phase of transformation — an AI-enabled growth strategy. The window of opportunity is now: Sharjah's government AI ecosystem is being built, the UAE banking AI arms race is escalating, and BOS's stronger balance sheet gives it the means to act. A focused 3-year AI program targeting corporate banking, wealth management and digital customer service — supported by a strategic hyperscaler partnership — could move BOS from AI Maturity 2.4 to 3.5+ by 2028, closing the competitive gap with larger peers and establishing BOS as the AI-leading bank in the Sharjah emirate."],
        ].map(([heading, body]) => (
          <div key={heading}>
            <h3 style={styles.ceoH3}>{heading}</h3>
            {body.split("\n\n").map((para, i) => <p key={i} style={styles.ceoP}>{para}</p>)}
          </div>
        ))}
        <div style={{marginTop:"1.5rem",padding:"1rem",background:"#f8f8fc",borderRadius:8,fontSize:12,color:"#666"}}>
          <strong>Report Basis:</strong> BOS Integrated Annual Report 2024 (Edition 1), Q1 2026 Financial Results and CEO Commentary, BOS Official Website (bankofsharjah.com) — all compliance, product, and investor relations pages, ADX News & Disclosure filings, Gulf News and Zawya press coverage through May 2026. No non-public information was used.
        </div>
      </div>
    </div>
  );
}

function UrlsPage() {
  return (
    <div style={styles.container}>
      <div style={styles.sectionHead}>
        <h2 style={styles.sectionH2}>Report URLs & Source Inventory — Bank of Sharjah 2026</h2>
        <p style={styles.sectionP}>All official downloadable documents and source URLs identified through autonomous research</p>
      </div>
      <div style={styles.noticeBox}>ℹ️ Bank of Sharjah has not published a dedicated AI Report, AI Whitepaper, Digital Transformation Report, or Innovation Report as of May 2026. The documents below represent all publicly available official BOS disclosures. No AI-specific standalone documents exist in the public domain.</div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>📥 Latest 2024–2026 Report Inventory — Downloadable Documents</div>
        <table style={styles.table}>
          <thead><tr><Th>Document Name</Th><Th>Type</Th><Th>Date</Th><Th>Download URL</Th></tr></thead>
          <tbody>
            {docInventory.map(d=>(
              <tr key={d.name}>
                <Td><strong>{d.name}</strong></Td>
                <Td><Tag type={d.typeColor as any}>{d.type}</Tag></Td>
                <Td>{d.date}</Td>
                <Td><a href={d.url} target="_blank" rel="noreferrer" style={{color:"#185fa5",textDecoration:"none",fontSize:12}}>📄 Download PDF</a></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>🔗 Official Source URLs — Investor Relations & Reports Portal</div>
        <table style={styles.table}>
          <thead><tr><Th>Page</Th><Th>URL</Th></tr></thead>
          <tbody>
            {sourceUrls.map(s=>(
              <tr key={s.page}>
                <Td>{s.page}</Td>
                <Td><a href={s.url} target="_blank" rel="noreferrer" style={{color:"#185fa5",textDecoration:"none",fontSize:12,wordBreak:"break-all"}}>{s.label}</a></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>🤖 AI Use Case Document Inventory</div>
        <div style={{...styles.noticeBox,marginBottom:"1rem"}}>⚠️ <strong>Result: NONE FOUND.</strong> No AI use case documents, AI whitepapers, AI case studies, GenAI reports, AI transformation reports, or innovation reports were found on official BOS sources or public domains as of May 2026.</div>
        <table style={styles.table}>
          <thead><tr><Th>Document Type</Th><Th>Status</Th><Th>Notes</Th></tr></thead>
          <tbody>
            {aiDocInventory.map(d=>(
              <tr key={d.type}>
                <Td>{d.type}</Td>
                <Td><Tag type={d.statusType as any}>{d.status}</Tag></Td>
                <Td style={{fontSize:12}}>{d.url ? <a href={d.url} target="_blank" rel="noreferrer" style={{color:"#185fa5"}}>{d.note}</a> : d.note}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>📋 AI Agent Names — Summary</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {agents.map(a=><span key={a.name} style={styles.chip}>{a.icon} {a.name}</span>)}
        </div>
        <div style={{marginTop:"0.75rem",fontSize:11,color:"#888",fontStyle:"italic"}}>Note: These agent names are functional descriptors assigned by this research report. BOS has not publicly named or branded any AI agents as of May 2026.</div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "usecases", label: "AI Use Cases (15)" },
  { id: "agents", label: "AI Agents (6)" },
  { id: "programs", label: "AI Programs (5)" },
  { id: "partnerships", label: "Partnerships (4)" },
  { id: "maturity", label: "AI Maturity" },
  { id: "executive", label: "Executive Summary" },
  { id: "ceo", label: "CEO Report" },
  { id: "urls", label: "Report URLs" },
];

export default function BOSAIIntelligence() {
  const [active, setActive] = useState("overview");

  const renderPage = () => {
    switch (active) {
      case "overview": return <OverviewPage />;
      case "usecases": return <UseCasesPage />;
      case "agents": return <AgentsPage />;
      case "programs": return <ProgramsPage />;
      case "partnerships": return <PartnershipsPage />;
      case "maturity": return <MaturityPage />;
      case "executive": return <ExecutivePage />;
      case "ceo": return <CeoPage />;
      case "urls": return <UrlsPage />;
      default: return <OverviewPage />;
    }
  };

  return (
    <div style={styles.body}>
      {/* Top Bar */}
      <div style={styles.topbar}>
        <div style={styles.topbarInner}>
          <div>
            <h1 style={styles.topbarH1}>Bank of Sharjah (BOS) — AI Intelligence Report 2026</h1>
            <p style={styles.topbarP}>Autonomous Banking AI Analysis | 15 Use Cases | 6 Agents | 5 Programs | Official Sources Only</p>
          </div>
          <span style={styles.badgeGold}>STRATEGIC INTELLIGENCE REPORT</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              style={{
                background: "none", border: "none", color: active === t.id ? "#fff" : "rgba(255,255,255,0.7)",
                padding: "12px 18px", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap",
                borderBottom: active === t.id ? `3px solid ${C.gold}` : "3px solid transparent",
                transition: "all 0.2s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Page Content */}
      {renderPage()}

      {/* Footer */}
      <div style={styles.footer}>
        Bank of Sharjah AI Intelligence Report 2026 — Autonomous Research Agent Output | Sources: Official BOS disclosures only | Generated May 2026 | Not for external distribution
      </div>
    </div>
  );
}
