import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const steps = [
  { num: "01", label: "Attend Interview", desc: "Walk in at Miyapur Metro Station" },
  { num: "02", label: "Login to Dashboard", desc: "Access your candidate portal" },
  { num: "03", label: "Select AI Exam", desc: "Choose your technology track" },
  { num: "04", label: "Write Exam", desc: "Demonstrate your skills" },
  { num: "05", label: "Join 90 Days Plan", desc: "Structured learning begins" },
  { num: "06", label: "Work on Real Projects", desc: "Build portfolio-ready work" },
];

const skills = [
  { title: "AI", sub: "Prompting & Automation", color: "#D97706" },
  { title: "React", sub: "Frontend Development", color: "#2563EB" },
  { title: "Java", sub: "Backend Engineering", color: "#7C3AED" },
  { title: "Python", sub: "AI & ML Scripting", color: "#059669" },
];

const useCases = [
  { id: "01", title: "Customer ID Creation", category: "CAS" },
  { id: "02", title: "Co-applicant & Guarantor Linking", category: "CAS" },
  { id: "03", title: "Customer ID to Loan Linking", category: "CAS" },
  { id: "04", title: "Loan Appraisal System", category: "CAS" },
  { id: "05", title: "Loan Assessment Workflow", category: "CAS" },
  { id: "06", title: "Recommendation & Sanction Letter", category: "CAS" },
  { id: "07", title: "Risk Analysis Documentation", category: "CAS" },
  { id: "08", title: "Sanction & Customer Response Tracking", category: "CAS" },
  { id: "09", title: "Repayment Schedule Generation", category: "CAS" },
  { id: "10", title: "Terms & Conditions Approval", category: "CAS" },
  { id: "11", title: "Asset Details Capture", category: "CAS" },
  { id: "12", title: "Profile Update & Limit Check", category: "CAS" },
  { id: "13", title: "Account Closure & Net Worth Analysis", category: "CAS" },

  { id: "14", title: "Asset Details", category: "FMS" },
  { id: "15", title: "PDC Printing", category: "FMS" },
  { id: "16", title: "WF_ Installment Prepayment", category: "FMS" },
  { id: "17", title: "WF_ NPA Grading", category: "FMS" },
  { id: "18", title: "WF_ NPA Provisioning", category: "FMS" },
  { id: "19", title: "WF_ Settlements - Knock Off", category: "FMS" },
  { id: "20", title: "WF_ Settlements_Cheque(Receipt_Payment) Processing", category: "FMS" },
  { id: "21", title: "WF_ Settlements_Manual Advise", category: "FMS" },
  { id: "22", title: "WF_ Termination - Foreclosure - Closure", category: "FMS" },
  { id: "23", title: "WF_FMS_ Finance Viewer", category: "FMS" },
  { id: "24", title: "WF_FMS_ Floating Review Process", category: "FMS" },
  { id: "25", title: "WF_FMS_ Settlements - Receipts", category: "FMS" },
  { id: "26", title: "WF_FMS_ Settlements_Payment", category: "FMS" },
  { id: "27", title: "WF_FMS_ Settlements_Waive Off", category: "FMS" },
  { id: "28", title: "WF_FMS_EOD_ BOD", category: "FMS" },
  { id: "29", title: "Work Flow Closure_Account Closure", category: "FMS" },
  { id: "30", title: "Work Flow Closure_View Account Status", category: "FMS" },
  { id: "31", title: "Work Flow_Document Master", category: "FMS" },
  { id: "32", title: "Work Flow_Finance Rescheduling_Bulk Prepayment", category: "FMS" },
  { id: "33", title: "Work Flow_Finance Rescheduling_Due Date Change", category: "FMS" },
  { id: "34", title: "Work Flow_Finance Rescheduling_Profit Rate Change", category: "FMS" },
  { id: "35", title: "Work Flow_Finance Rescheduling_Tenure Change", category: "FMS" },
  { id: "36", title: "Work Flow_Post Disbursal Edit", category: "FMS" },
  { id: "37", title: "Work Flow_Repayment Deferral_Constitution Wise Deferral", category: "FMS" },
  { id: "38", title: "Work Flow_Repayment Deferral_Finance Wise Deferral", category: "FMS" },
  { id: "39", title: "Work Flow_Repayment Deferral_Portfolio Wise Deferral", category: "FMS" },

  { id: "40", title: "Allocation of Delinquent Cases_Allocation Hold", category: "Collections" },
  { id: "41", title: "Allocation of Delinquent Cases_Define Allocation Contract", category: "Collections" },
  { id: "42", title: "Allocation of Delinquent Cases_Manual Allocation", category: "Collections" },
  { id: "43", title: "Allocation of Delinquent Cases_Manual Reallocation", category: "Collections" },
  { id: "44", title: "Beginning of Day Process", category: "Collections" },
  { id: "45", title: "Classification of Delinquent Cases - Define Queue", category: "Collections" },
  { id: "46", title: "Contact Recording", category: "Collections" },
  { id: "47", title: "Legal Collections Workflow", category: "Collections" },
  { id: "48", title: "Prioritizing a Queue", category: "Collections" },
  { id: "49", title: "Queue Communication Mapping", category: "Collections" },
  { id: "50", title: "Queue Curing", category: "Collections" },
  { id: "51", title: "Collector Work Plan", category: "Collections" },
];

const categoryColors: Record<string, { bg: string; color: string; dot: string }> = {
  CAS: { bg: "#EFF6FF", color: "#1D4ED8", dot: "#3B82F6" },
  FMS: { bg: "#ECFDF5", color: "#065F46", dot: "#10B981" },
  Collections: { bg: "#FFF7ED", color: "#C2410C", dot: "#F97316" },
};

const categories = ["All", ...Object.keys(categoryColors)];

const HiringLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? useCases
      : useCases.filter((u) => u.category === activeCategory);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F9F8F6", minHeight: "100vh", color: "#111" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          scroll-behavior: smooth;
        }

        .top-back-wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 24px 28px 0;
        }

        .back-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #111;
          background: #fff;
          border: 1px solid #E5E2DB;
          padding: 10px 18px;
          border-radius: 999px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 6px 20px rgba(0,0,0,.04);
          transition: all .15s ease;
        }

        .back-btn:hover {
          background: #111;
          color: #fff;
          transform: translateY(-1px);
        }

        .hero-wrap {
          max-width:1100px;
          margin:0 auto;
          padding:54px 28px 64px;
          display:grid;
          grid-template-columns:1fr 400px;
          gap:56px;
          align-items:center;
        }

        .kicker {
          display:inline-flex;
          align-items:center;
          gap:8px;
          background:white;
          border:1px solid #E5E2DB;
          border-radius:100px;
          padding:5px 14px 5px 8px;
          font-size:11px;
          font-weight:600;
          color:#666;
          letter-spacing:.05em;
          text-transform:uppercase;
          margin-bottom:22px;
        }

        .kicker-badge {
          background:#FEF3C7;
          color:#92400E;
          border-radius:100px;
          padding:2px 9px;
          font-size:10px;
          font-weight:700;
        }

        .h1 {
          font-family:'Instrument Serif',serif;
          font-size:clamp(36px,5vw,62px);
          line-height:1.04;
          letter-spacing:-1px;
          color:#0D0D0D;
          margin-bottom:18px;
        }

        .h1 i {
          font-style:italic;
          color:#D97706;
        }

        .hero-p {
          font-size:16px;
          line-height:1.75;
          color:#666;
          max-width:460px;
          margin-bottom:34px;
        }

        .hero-p strong {
          color:#111;
          font-weight:600;
        }

        .hero-btns {
          display:flex;
          gap:12px;
          flex-wrap:wrap;
        }

        .btn-primary {
          font-family:'DM Sans',sans-serif;
          font-size:15px;
          font-weight:600;
          color:white;
          background:#111;
          border:none;
          padding:13px 26px;
          border-radius:10px;
          cursor:pointer;
          display:flex;
          align-items:center;
          gap:8px;
          transition:transform .15s,background .15s;
        }

        .btn-primary:hover {
          background:#333;
          transform:translateY(-1px);
        }

        .btn-outline {
          font-family:'DM Sans',sans-serif;
          font-size:15px;
          font-weight:500;
          color:#333;
          background:white;
          border:1.5px solid #DDD9D0;
          padding:12px 22px;
          border-radius:10px;
          cursor:pointer;
          transition:border-color .15s;
        }

        .btn-outline:hover {
          border-color:#111;
        }

        .hero-card {
          background:white;
          border:1px solid #E5E2DB;
          border-radius:20px;
          overflow:hidden;
        }

        .card-head {
          background:#111;
          padding:22px 24px;
          display:flex;
          justify-content:space-between;
          align-items:center;
        }

        .card-title {
          font-family:'Instrument Serif',serif;
          font-size:19px;
          color:white;
        }

        .card-sub {
          font-size:11px;
          color:rgba(255,255,255,.45);
          margin-top:2px;
        }

        .skill-grid {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:1px;
          background:#F0EDE6;
        }

        .skill-cell {
          background:white;
          padding:18px 20px;
          transition:background .15s;
        }

        .skill-cell:hover {
          background:#FAFAF8;
        }

        .skill-name {
          font-family:'Instrument Serif',serif;
          font-size:24px;
          margin-bottom:3px;
        }

        .skill-desc {
          font-size:11px;
          color:#999;
          font-weight:500;
        }

        .loc-strip {
          padding:16px 22px;
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:12px;
          border-top:1px solid #F0EDE6;
        }

        .loc-label {
          font-size:9px;
          font-weight:700;
          letter-spacing:.12em;
          text-transform:uppercase;
          color:#BBB;
          margin-bottom:5px;
        }

        .loc-val {
          font-size:12px;
          color:#333;
          font-weight:500;
          line-height:1.5;
        }

        .content {
          max-width:1100px;
          margin:0 auto;
          padding:0 28px 80px;
        }

        .stats {
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:1px;
          background:#E5E2DB;
          border:1px solid #E5E2DB;
          border-radius:16px;
          overflow:hidden;
          margin-bottom:60px;
        }

        .stat {
          background:white;
          padding:26px 22px;
        }

        .stat-val {
          font-family:'Instrument Serif',serif;
          font-size:34px;
          color:#0D0D0D;
          letter-spacing:-1px;
          line-height:1;
          margin-bottom:4px;
        }

        .stat-label {
          font-size:13px;
          color:#888;
        }

        .two-col {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:40px;
          align-items:start;
          margin-bottom:72px;
        }

        .sec-label {
          font-size:10px;
          font-weight:700;
          letter-spacing:.16em;
          text-transform:uppercase;
          color:#AAA;
          margin-bottom:10px;
        }

        .sec-title {
          font-family:'Instrument Serif',serif;
          font-size:clamp(22px,3vw,32px);
          color:#0D0D0D;
          letter-spacing:-.4px;
          line-height:1.15;
          margin-bottom:28px;
        }

        .step-list {
          display:flex;
          flex-direction:column;
        }

        .step-item {
          display:flex;
          gap:16px;
          align-items:flex-start;
          padding:16px 0;
          border-bottom:1px solid #F0EDE6;
        }

        .step-item:last-child {
          border-bottom:none;
        }

        .step-num {
          width:38px;
          height:38px;
          border-radius:9px;
          flex-shrink:0;
          border:1.5px solid #E5E2DB;
          background:white;
          display:flex;
          align-items:center;
          justify-content:center;
          font-family:'Instrument Serif',serif;
          font-size:13px;
          color:#AAA;
        }

        .step-body {
          flex:1;
        }

        .step-title {
          font-size:14px;
          font-weight:600;
          color:#111;
          margin-bottom:2px;
        }

        .step-desc {
          font-size:12px;
          color:#999;
        }

        .venue-card {
          background:white;
          border:1px solid #E5E2DB;
          border-radius:16px;
          padding:26px;
        }

        .venue-row {
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:18px;
          padding:11px 0;
          border-bottom:1px solid #F5F3EF;
        }

        .venue-row:last-child {
          border-bottom:none;
        }

        .venue-key {
          font-size:11px;
          color:#BBB;
          font-weight:600;
          letter-spacing:.06em;
          text-transform:uppercase;
          white-space: nowrap;
        }

        .venue-val {
          font-size:13px;
          color:#111;
          font-weight:500;
          text-align:right;
          line-height: 1.45;
        }

        .filter-bar {
          display:flex;
          gap:7px;
          flex-wrap:wrap;
          margin-bottom:24px;
        }

        .filter-btn {
          font-family:'DM Sans',sans-serif;
          font-size:12px;
          font-weight:500;
          padding:5px 13px;
          border-radius:100px;
          border:1px solid #E5E2DB;
          background:white;
          color:#777;
          cursor:pointer;
          transition:all .15s;
        }

        .filter-btn:hover,
        .filter-btn.on {
          background:#111;
          color:white;
          border-color:#111;
        }

        .uc-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(175px,1fr));
          gap:10px;
        }

        .uc-card {
          background:white;
          border:1px solid #E5E2DB;
          border-radius:12px;
          padding:14px 15px;
          transition:transform .15s,box-shadow .15s;
          cursor:default;
        }

        .uc-card:hover {
          transform:translateY(-2px);
          box-shadow:0 6px 22px rgba(0,0,0,.07);
        }

        .uc-top {
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:8px;
        }

        .uc-id {
          font-size:10px;
          color:#CCC;
          font-weight:600;
        }

        .uc-dot {
          width:6px;
          height:6px;
          border-radius:50%;
        }

        .uc-title {
          font-size:13px;
          font-weight:600;
          color:#111;
          margin-bottom:6px;
          line-height:1.3;
        }

        .uc-cat {
          display:inline-block;
          font-size:10px;
          font-weight:600;
          padding:2px 8px;
          border-radius:100px;
        }

        @media(max-width:900px) {
          .top-back-wrap {
            padding: 20px 20px 0;
          }

          .hero-wrap {
            grid-template-columns:1fr;
            gap:36px;
            padding:40px 20px 40px;
          }

          .two-col {
            grid-template-columns:1fr;
            gap:32px;
          }

          .stats {
            grid-template-columns:1fr 1fr;
          }
        }

        @media(max-width:600px) {
          .top-back-wrap {
            padding: 16px 16px 0;
          }

          .back-btn {
            width: 100%;
            justify-content: center;
          }

          .content {
            padding:0 16px 60px;
          }

          .hero-wrap {
            padding: 34px 16px 38px;
          }

          .hero-btns {
            flex-direction:column;
          }

          .btn-primary,
          .btn-outline {
            width: 100%;
            justify-content: center;
          }

          .stats {
            grid-template-columns:1fr 1fr;
          }

          .stat {
            padding:18px 16px;
          }

          .stat-val {
            font-size:26px;
          }

          .uc-grid {
            grid-template-columns:repeat(auto-fill,minmax(150px,1fr));
          }

          .loc-strip {
            grid-template-columns:1fr;
          }

          .venue-row {
            align-items:flex-start;
            flex-direction:column;
            gap:5px;
          }

          .venue-val {
            text-align:left;
          }
        }
      `}</style>

      <div className="top-back-wrap">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div className="hero-wrap">
        <div>
          <div className="kicker">
            <span className="kicker-badge">NOW OPEN</span>
            Banking & Finance AI Careers
          </div>

          <h1 className="h1">
            We Are Hiring —<br />
            <i>90 Days Job Plan</i>
          </h1>

          <p className="hero-p">
            Interviews open for candidates building careers in{" "}
            <strong>AI, React, Java and Python</strong> with real-world banking &
            financial use cases. Attend the interview, clear the AI exam, and start
            your job-ready journey.
          </p>

          <div className="hero-btns">
            <button className="btn-primary" onClick={() => navigate("/ninetydayplan")}>
              Join 90 Days Plan
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button className="btn-outline" onClick={() => navigate("/jobstreet")}>
              View Job Street
            </button>
          </div>
        </div>

        <div className="hero-card">
          <div className="card-head">
            <div>
              <div className="card-title">Interview AI Exam</div>
              <div className="card-sub">Dashboard-based screening · All tracks</div>
            </div>

            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <circle cx="15" cy="15" r="15" fill="rgba(255,255,255,.08)" />
              <path
                d="M9 15l4 4 8-8"
                stroke="rgba(255,255,255,.5)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="skill-grid">
            {skills.map((sk) => (
              <div className="skill-cell" key={sk.title}>
                <div className="skill-name" style={{ color: sk.color }}>
                  {sk.title}
                </div>
                <div className="skill-desc">{sk.sub}</div>
              </div>
            ))}
          </div>

          <div className="loc-strip">
            <div>
              <div className="loc-label">Location</div>
              <div className="loc-val">Miyapur Metro<br />Entrance D, SE02</div>
            </div>

            <div>
              <div className="loc-label">Starts</div>
              <div
                className="loc-val"
                style={{
                  fontFamily: "'Instrument Serif',serif",
                  fontSize: 18,
                  letterSpacing: "-0.3px",
                }}
              >
                9:30 AM
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="stats">
          {[
            ["51", "CAS, FMS & Collections Use Cases"],
            ["4", "Tech Tracks"],
            ["90", "Days to Job-Ready"],
            ["9:30 AM", "Interview Starts"],
          ].map(([v, l]) => (
            <div className="stat" key={l}>
              <div className="stat-val">{v}</div>
              <div className="stat-label">{l}</div>
            </div>
          ))}
        </div>

        <div className="two-col">
          <div>
            <div className="sec-label">How It Works</div>
            <div className="sec-title">Interview Process</div>

            <div className="step-list">
              {steps.map((s) => (
                <div className="step-item" key={s.num}>
                  <div className="step-num">{s.num}</div>
                  <div className="step-body">
                    <div className="step-title">{s.label}</div>
                    <div className="step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="sec-label">Venue Details</div>
            <div className="sec-title">Where to Come</div>

            <div className="venue-card">
              {[
                ["Center", "AI Research Center"],
                ["Entry Point", "Entrance D, SE02 Concourse"],
                ["Landmark", "Miyapur Metro Station"],
                ["Address", "Hyderabad, Telangana 500049"],
                ["Timings", "Starts at 9:30 AM"],
              ].map(([k, v]) => (
                <div className="venue-row" key={k}>
                  <span className="venue-key">{k}</span>
                  <span className="venue-val">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div className="sec-label">Curriculum</div>
          <div className="sec-title">51 CAS, FMS & Collections Workflow Use Cases</div>

          <p style={{ marginTop: 10, fontSize: 14, color: "#888", maxWidth: 540, lineHeight: 1.65 }}>
            Real-world concepts you will build during the 90 Days Job Plan — covering customer acquisition,
            financial management and collections workflows.
          </p>
        </div>

        <div className="filter-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn${activeCategory === cat ? " on" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="uc-grid">
          {filtered.map((uc) => {
            const c = categoryColors[uc.category];

            return (
              <div className="uc-card" key={uc.id}>
                <div className="uc-top">
                  <span className="uc-id">{uc.id}</span>
                  <span className="uc-dot" style={{ background: c.dot }} />
                </div>

                <div className="uc-title">{uc.title}</div>

                <span className="uc-cat" style={{ background: c.bg, color: c.color }}>
                  {uc.category}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HiringLandingPage;