import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FLOWS = [
  {
    id: "walkin",
    badge: "JULY 11 & 25",
    title: "Walk-in Interview",
    subtitle: "via ASKOXY.AI Landing Page",
    url: "https://www.askoxy.ai/",
    urlLabel: "askoxy.ai",
    color: "#6D28D9",
    bg: "linear-gradient(135deg,#6D28D9 0%,#4C1D95 100%)",
    light: "#F5F3FF",
    border: "#DDD6FE",
    icon: "🏢",
    entryStep: 'Open askoxy.ai in your browser and press Enter.',
    step2Title: 'Click "July 11 & 25 Walk-in Interview" Banner',
    step2Desc: "On the ASKOXY.AI landing page, click the banner to proceed.",
    jobsPage: "Find Your Next Opportunity",
    hasStep2: true,
  },
  {
    id: "wearehiring",
    badge: "WE ARE HIRING",
    title: "We Are Hiring",
    subtitle: "via Direct URL",
    url: "https://www.askoxy.ai/wearehiring",
    urlLabel: "askoxy.ai/wearehiring",
    color: "#0369A1",
    bg: "linear-gradient(135deg,#0369A1 0%,#075985 100%)",
    light: "#EFF6FF",
    border: "#BAE6FD",
    icon: "💼",
    entryStep: 'Open askoxy.ai/wearehiring directly in your browser.',
    step2Title: "",
    step2Desc: "",
    jobsPage: "We Are Hiring at ASKOXY.AI",
    hasStep2: false,
  },
  {
    id: "radhai",
    badge: "RADHAI",
    title: "RadhAI Portal",
    subtitle: "via RadhAI Landing Page",
    url: "https://www.askoxy.ai/radhai",
    urlLabel: "askoxy.ai/radhai",
    color: "#B45309",
    bg: "linear-gradient(135deg,#B45309 0%,#92400E 100%)",
    light: "#FFFBEB",
    border: "#FDE68A",
    icon: "🤖",
    entryStep: 'Open askoxy.ai/radhai in your browser and press Enter.',
    step2Title: 'Click Walk-in Interview Banner or "Visit our Jobs"',
    step2Desc: "On the RadhAI landing page, click the banner or the jobs link in the header.",
    jobsPage: "Jobs Page",
    hasStep2: true,
  },
];

const COMMON_STEPS = [
  { num: 4,  icon: "🔍", label: "Select a Job Opening",        desc: "Choose the role that matches your profile and interests." },
  { num: 5,  icon: "📋", label: "View Job Details",             desc: "Click \"View Job Details\" to review the full description and requirements." },
  { num: 6,  icon: "📤", label: "Apply Now & Upload Resume",    desc: "Click \"Apply Now\" and upload your resume when prompted." },
  { num: 7,  icon: "🤖", label: "ATS Resume Scan",              desc: "The Applicant Tracking System automatically scans your uploaded resume." },
  { num: 8,  icon: "📊", label: "ATS Scorecard Generated",      desc: "Your ATS scorecard is generated along with exam instructions." },
  { num: 9,  icon: "✏️", label: "Start the Exam",               desc: "Read all instructions carefully, then click 'Start Exam' to begin." },
  { num: 10, icon: "✅", label: "Complete & Submit Exam",        desc: "Answer all questions and submit the exam." },
  { num: 11, icon: "🏆", label: "Exam Scorecard",               desc: "Your exam results scorecard is displayed immediately after submission." },
  { num: 12, icon: "🎯", label: "Complete Final Step",           desc: "Click \"Complete Final Step\" to proceed to the cover letter section." },
  { num: 13, icon: "📝", label: "Submit Cover Letter",           desc: "Fill in all required details and click Submit." },
  { num: 14, icon: "🔄", label: "Redirected to My Applications", desc: "You are redirected to the My Job Applications page." },
  { num: 15, icon: "📈", label: "Track Your Application",        desc: "Monitor the status and progress of your application anytime." },
];

const WalkInJourneyPage: React.FC = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("walkin");
  const flow = FLOWS.find((f) => f.id === active)!;

  const uniqueSteps = [
    { num: 1, icon: "🌐", label: "Enter the URL", desc: flow.entryStep },
    ...(flow.hasStep2
      ? [{ num: 2, icon: "👆", label: flow.step2Title, desc: flow.step2Desc }]
      : []),
    {
      num: flow.hasStep2 ? 3 : 2,
      icon: "💡",
      label: "Explore Job Openings",
      desc: `You are redirected to the "${flow.jobsPage}" page — browse all available roles.`,
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', 'DM Sans', sans-serif", background: "#F4F4F6", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── LAYOUT ── */
        .wj-page { max-width: 780px; margin: 0 auto; padding: 20px 16px 60px; }

        /* ── TOPBAR ── */
        .wj-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .wj-back { font-size: 13px; font-weight: 600; color: #374151; background: #fff;
          border: 1px solid #E5E7EB; padding: 7px 14px; border-radius: 8px; cursor: pointer;
          display: inline-flex; align-items: center; gap: 6px; transition: all .15s;
          box-shadow: 0 1px 3px rgba(0,0,0,.06); }
        .wj-back:hover { background: #111; color: #fff; border-color: #111; }

        /* ── HERO ── */
        .wj-hero { background: linear-gradient(135deg,#1E1B4B 0%,#312E81 50%,#4C1D95 100%);
          border-radius: 16px; padding: 28px 24px 24px; margin-bottom: 16px; color: white; text-align: center;
          position: relative; overflow: hidden; }
        .wj-hero::before { content: ''; position: absolute; top: -40px; right: -40px;
          width: 180px; height: 180px; border-radius: 50%;
          background: rgba(255,255,255,.04); pointer-events: none; }
        .wj-hero::after { content: ''; position: absolute; bottom: -30px; left: -30px;
          width: 130px; height: 130px; border-radius: 50%;
          background: rgba(255,255,255,.03); pointer-events: none; }
        .wj-live { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,.12);
          border: 1px solid rgba(255,255,255,.18); border-radius: 100px;
          padding: 4px 12px; font-size: 10px; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; margin-bottom: 12px; }
        .wj-live-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ADE80;
          box-shadow: 0 0 0 3px rgba(74,222,128,.25); animation: wj-pulse 2s infinite; }
        @keyframes wj-pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        .wj-hero-title { font-size: clamp(22px, 4vw, 34px); font-weight: 800; line-height: 1.15;
          letter-spacing: -0.5px; margin-bottom: 8px; }
        .wj-hero-title span { color: #A78BFA; }
        .wj-hero-sub { font-size: 13px; color: rgba(255,255,255,.65); line-height: 1.6;
          max-width: 440px; margin: 0 auto 16px; }
        .wj-hero-btn { display: inline-flex; align-items: center; gap: 7px; font-size: 13px;
          font-weight: 700; color: #1E1B4B; background: white; border: none;
          padding: 10px 22px; border-radius: 8px; cursor: pointer; transition: all .15s;
          box-shadow: 0 4px 14px rgba(0,0,0,.2); }
        .wj-hero-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,.25); }

        /* ── STATS ROW ── */
        .wj-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 16px; }
        .wj-stat { background: white; border: 1px solid #E5E7EB; border-radius: 10px;
          padding: 12px 14px; text-align: center; }
        .wj-stat-val { font-size: 20px; font-weight: 800; color: #111; line-height: 1; margin-bottom: 3px; }
        .wj-stat-lbl { font-size: 10px; color: #9CA3AF; font-weight: 500; text-transform: uppercase; letter-spacing: .06em; }

        /* ── TABS ── */
        .wj-tabs { display: grid; grid-template-columns: repeat(3,1fr); gap: 6px; margin-bottom: 14px; }
        .wj-tab { font-size: 12px; font-weight: 600; padding: 9px 8px; border-radius: 9px;
          border: 1.5px solid #E5E7EB; background: white; color: #6B7280;
          cursor: pointer; transition: all .15s; text-align: center; line-height: 1.3; }
        .wj-tab:hover { border-color: #9CA3AF; color: #111; }
        .wj-tab.on { color: white; border-color: transparent; box-shadow: 0 3px 10px rgba(0,0,0,.15); }
        .wj-tab-icon { font-size: 16px; display: block; margin-bottom: 3px; }

        /* ── FLOW CARD ── */
        .wj-card { background: white; border: 1px solid #E5E7EB; border-radius: 14px;
          overflow: hidden; margin-bottom: 14px; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
        .wj-card-header { padding: 14px 18px 12px; border-bottom: 1px solid #F3F4F6; }
        .wj-card-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
        .wj-flow-badge { font-size: 9px; font-weight: 800; letter-spacing: .12em;
          text-transform: uppercase; padding: 3px 9px; border-radius: 100px; }
        .wj-card-title { font-size: 16px; font-weight: 700; color: #111; }
        .wj-card-sub { font-size: 11px; color: #9CA3AF; }
        .wj-url-pill { display: inline-flex; align-items: center; gap: 5px; font-size: 11px;
          font-weight: 600; text-decoration: none; padding: 4px 10px; border-radius: 6px; }
        .wj-url-pill:hover { opacity: .8; }

        /* ── SECTION LABEL ── */
        .wj-sec-label { font-size: 9px; font-weight: 800; letter-spacing: .14em;
          text-transform: uppercase; color: #9CA3AF; padding: 10px 18px 6px; }

        /* ── STEPS ── */
        .wj-steps { padding: 0 18px 14px; }
        .wj-step { display: flex; gap: 12px; align-items: flex-start; padding: 9px 0;
          border-bottom: 1px solid #F9FAFB; }
        .wj-step:last-child { border-bottom: none; }
        .wj-step-left { display: flex; flex-direction: column; align-items: center; gap: 0; flex-shrink: 0; }
        .wj-step-num-wrap { width: 30px; height: 30px; border-radius: 8px; display: flex;
          align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
        .wj-step-icon { font-size: 13px; margin-top: 2px; }
        .wj-step-body { flex: 1; padding-top: 2px; }
        .wj-step-title { font-size: 13px; font-weight: 600; color: #111; line-height: 1.3; margin-bottom: 2px; }
        .wj-step-desc { font-size: 11px; color: #6B7280; line-height: 1.5; }

        /* ── DIVIDER ── */
        .wj-divider { display: flex; align-items: center; gap: 10px; padding: 8px 18px; }
        .wj-divider-line { flex: 1; height: 1px; background: #F3F4F6; }
        .wj-divider-text { font-size: 9px; font-weight: 700; letter-spacing: .12em;
          text-transform: uppercase; color: #D1D5DB; white-space: nowrap; }

        /* ── CTA CARD ── */
        .wj-cta-card { background: white; border: 1px solid #E5E7EB; border-radius: 14px;
          padding: 20px 18px; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
        .wj-cta-title { font-size: 17px; font-weight: 800; color: #111; margin-bottom: 4px; }
        .wj-cta-sub { font-size: 12px; color: #6B7280; line-height: 1.6; margin-bottom: 14px; }
        .wj-cta-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
        .wj-cta-btn { display: flex; flex-direction: column; align-items: center; gap: 4px;
          padding: 12px 8px; border-radius: 10px; border: 1.5px solid #E5E7EB;
          background: white; text-decoration: none; transition: all .15s; cursor: pointer; }
        .wj-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 14px rgba(0,0,0,.1); }
        .wj-cta-btn-icon { font-size: 18px; }
        .wj-cta-btn-label { font-size: 11px; font-weight: 700; text-align: center; line-height: 1.3; }
        .wj-cta-btn-url { font-size: 9px; color: #9CA3AF; text-align: center; }

        /* ── RESPONSIVE ── */
        @media (max-width: 480px) {
          .wj-page { padding: 14px 12px 50px; }
          .wj-hero { padding: 22px 16px 20px; border-radius: 12px; }
          .wj-stats { gap: 6px; }
          .wj-stat { padding: 10px 10px; }
          .wj-stat-val { font-size: 18px; }
          .wj-tabs { gap: 5px; }
          .wj-tab { font-size: 11px; padding: 8px 6px; }
          .wj-cta-grid { grid-template-columns: 1fr; gap: 6px; }
          .wj-cta-btn { flex-direction: row; justify-content: flex-start; padding: 10px 14px; }
          .wj-cta-btn-icon { font-size: 20px; }
          .wj-cta-btn-label { font-size: 12px; text-align: left; }
          .wj-cta-btn-url { text-align: left; }
        }
      `}</style>

      <div className="wj-page">

        {/* Topbar */}
        <div className="wj-topbar">
          <button className="wj-back" onClick={() => navigate(-1)}>← Back</button>
        </div>

        {/* Hero */}
        <div className="wj-hero">
         
          <div className="wj-hero-title">
            Start Your <span>Interview Journey</span><br />Here — Online
          </div>
          <p className="wj-hero-sub">
            Three entry points. One seamless process. Apply, take the AI exam,
            and track your application — all online.
          </p>
          <button
            className="wj-hero-btn"
            onClick={() => window.open("https://www.askoxy.ai/wearehiring", "_blank")}
          >
            🚀 Start Now
          </button>
        </div>

        {/* Stats */}
        <div className="wj-stats">
          {[
            { val: "3", lbl: "Entry Points" },
            { val: "15", lbl: "Steps to Apply" },
            { val: "AI", lbl: "Powered Exam" },
          ].map((s) => (
            <div className="wj-stat" key={s.lbl}>
              <div className="wj-stat-val">{s.val}</div>
              <div className="wj-stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="wj-tabs">
          {FLOWS.map((f) => (
            <button
              key={f.id}
              className={`wj-tab${active === f.id ? " on" : ""}`}
              style={active === f.id ? { background: f.bg } : {}}
              onClick={() => setActive(f.id)}
            >
              <span className="wj-tab-icon">{f.icon}</span>
              {f.title}
            </button>
          ))}
        </div>

        {/* Flow Card */}
        <div className="wj-card">
          {/* Card Header */}
          <div className="wj-card-header">
            <div className="wj-card-top">
              <div>
                <div className="wj-card-title">{flow.icon} {flow.title}</div>
                <div className="wj-card-sub">{flow.subtitle}</div>
              </div>
              <span
                className="wj-flow-badge"
                style={{ background: flow.light, color: flow.color }}
              >
                {flow.badge}
              </span>
            </div>
            <a
              href={flow.url}
              target="_blank"
              rel="noreferrer"
              className="wj-url-pill"
              style={{ background: flow.light, color: flow.color }}
            >
              🔗 {flow.urlLabel} ↗
            </a>
          </div>

          {/* Unique Steps */}
          <div className="wj-sec-label">Entry Steps — {flow.title}</div>
          <div className="wj-steps">
            {uniqueSteps.map((s) => (
              <div className="wj-step" key={s.num}>
                <div className="wj-step-left">
                  <div
                    className="wj-step-num-wrap"
                    style={{ background: flow.light, color: flow.color }}
                  >
                    {String(s.num).padStart(2, "0")}
                  </div>
                </div>
                <div className="wj-step-body">
                  <div className="wj-step-title">{s.icon} {s.label}</div>
                  <div className="wj-step-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          
         

          {/* Common Steps */}
          <div className="wj-steps">
            {COMMON_STEPS.map((s) => (
              <div className="wj-step" key={s.num}>
                <div className="wj-step-left">
                  <div
                    className="wj-step-num-wrap"
                    style={{ background: "#F3F4F6", color: "#6B7280" }}
                  >
                    {String(s.num).padStart(2, "0")}
                  </div>
                </div>
                <div className="wj-step-body">
                  <div className="wj-step-title">{s.icon} {s.label}</div>
                  <div className="wj-step-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Card */}
        <div className="wj-cta-card">
          <div className="wj-cta-title">Ready to Begin? 🎯</div>
          <p className="wj-cta-sub">
            Pick your preferred entry point and start your walk-in interview journey online right now.
          </p>
          <div className="wj-cta-grid">
            {FLOWS.map((f) => (
              <a
                key={f.id}
                href={f.url}
                target="_blank"
                rel="noreferrer"
                className="wj-cta-btn"
                style={{ borderColor: flow.id === f.id ? f.color : "#E5E7EB" }}
              >
                <span className="wj-cta-btn-icon">{f.icon}</span>
                <div>
                  <div className="wj-cta-btn-label" style={{ color: f.color }}>{f.title}</div>
                  <div className="wj-cta-btn-url">{f.urlLabel}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default WalkInJourneyPage;
