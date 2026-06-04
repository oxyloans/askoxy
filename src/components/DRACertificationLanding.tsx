import React, { useEffect, useRef, useState } from "react";

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="#16a34a" />
    <path
      d="M4.4 8.1l2.2 2.2 5-5"
      stroke="white"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowRight = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path
      d="M3 8h10M9 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const steps = [
  "Check eligibility",
  "Join training institute",
  "Complete training",
  "Get training certificate",
  "Register for exam",
  "Pay exam fee",
  "Write exam",
  "Pass exam",
  "Get DRA certificate",
];

const eligibility = [
  "Minimum age: 18 years",
  "Minimum qualification: 10th pass",
  "Graduates can also apply",
  "Good communication skills required",
];

const training = [
  "Loan recovery process",
  "Customer handling",
  "Legal rules",
  "Ethics and communication",
];

const careers = ["Banks", "NBFCs", "Recovery Agencies", "Financial Companies"];

const guidelines = [
  "No harassment",
  "Respect customer privacy",
  "Follow RBI rules",
  "Maintain professionalism",
];

function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

const Reveal = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `all 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const DRACertificationLanding: React.FC = () => {
  return (
    <div className="dra-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; font-family: 'Inter', sans-serif; }

        .dra-page {
          min-height: 100vh;
          background: #f8fafc;
          color: #0f172a;
          font-family: 'Inter', sans-serif;
        }

        .container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 22px;
        }

        .nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255,255,255,0.94);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid #e2e8f0;
        }

        .nav-inner {
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 20px;
          font-weight: 900;
          color: #075985;
        }

        .logo-box {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #075985, #0891b2);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-links a {
          text-decoration: none;
          color: #334155;
          font-size: 14px;
          font-weight: 700;
        }

        .nav-links a:hover { color: #0891b2; }

        .btn {
          border: none;
          outline: none;
          cursor: pointer;
          border-radius: 999px;
          padding: 13px 24px;
          font-size: 15px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          text-decoration: none;
          transition: 0.25s ease;
          white-space: nowrap;
        }

        .btn-primary {
          background: linear-gradient(135deg, #075985, #0891b2);
          color: white;
          box-shadow: 0 12px 28px rgba(8,145,178,0.22);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 34px rgba(8,145,178,0.32);
        }

        .btn-light {
          background: white;
          color: #075985;
          border: 1px solid #bae6fd;
        }

        .hero {
          background:
            radial-gradient(circle at top left, rgba(14,165,233,0.18), transparent 34%),
            linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
          padding: 86px 0 72px;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          align-items: center;
          gap: 52px;
        }

        .badge {
          display: inline-flex;
          padding: 8px 14px;
          border-radius: 999px;
          background: #e0f2fe;
          color: #0369a1;
          font-size: 13px;
          font-weight: 900;
          margin-bottom: 20px;
        }

        .hero h1 {
          margin: 0;
          font-size: clamp(38px, 5vw, 64px);
          line-height: 1.05;
          letter-spacing: -1.8px;
          font-weight: 900;
          color: #082f49;
        }

        .hero h1 span { color: #0891b2; }

        .hero p {
          margin: 22px 0 0;
          max-width: 640px;
          color: #475569;
          font-size: 18px;
          line-height: 1.8;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 32px;
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-top: 34px;
          max-width: 620px;
        }

        .stat {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 18px;
          box-shadow: 0 12px 34px rgba(15,23,42,0.06);
        }

        .stat strong {
          display: block;
          font-size: 22px;
          color: #075985;
        }

        .stat span {
          display: block;
          margin-top: 5px;
          color: #64748b;
          font-size: 13px;
          font-weight: 700;
        }

        .hero-card {
          background: white;
          border-radius: 30px;
          padding: 28px;
          box-shadow: 0 28px 70px rgba(8,47,73,0.14);
        }

        .certificate-card {
          background: linear-gradient(135deg, #075985, #0891b2);
          border-radius: 26px;
          padding: 28px;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .certificate-title {
          font-size: 27px;
          font-weight: 900;
          line-height: 1.2;
        }

        .certificate-list {
          margin-top: 24px;
          display: grid;
          gap: 14px;
        }

        .certificate-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 16px;
          padding: 14px;
          line-height: 1.5;
        }

        .section { padding: 76px 0; }

        .section-header {
          max-width: 760px;
          margin: 0 auto 42px;
          text-align: center;
        }

        .section-label {
          color: #0891b2;
          font-size: 13px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1.4px;
          margin-bottom: 12px;
        }

        .section-title {
          margin: 0;
          font-size: clamp(30px, 4vw, 44px);
          line-height: 1.15;
          color: #082f49;
          font-weight: 900;
          letter-spacing: -0.9px;
        }

        .section-desc {
          margin: 16px auto 0;
          color: #64748b;
          font-size: 16px;
          line-height: 1.75;
        }

        .grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 22px;
        }

        .info-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 16px 42px rgba(15,23,42,0.06);
          height: 100%;
        }

        .icon-box {
          width: 54px;
          height: 54px;
          border-radius: 18px;
          background: #e0f2fe;
          color: #075985;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          margin-bottom: 18px;
        }

        .info-card h3 {
          margin: 0 0 10px;
          font-size: 19px;
          color: #082f49;
        }

        .info-card p,
        .info-card li {
          color: #64748b;
          font-size: 15px;
          line-height: 1.65;
        }

        .list {
          list-style: none;
          padding: 0;
          margin: 16px 0 0;
          display: grid;
          gap: 12px;
        }

        .list li {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .process-section {
          background: #082f49;
          color: white;
        }

        .process-section .section-title { color: white; }
        .process-section .section-desc { color: #cbd5e1; }

        .timeline {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .step-card {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 24px;
          padding: 24px;
          min-height: 130px;
        }

        .step-number {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #38bdf8;
          color: #082f49;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          margin-bottom: 18px;
        }

        .step-card h3 {
          margin: 0;
          font-size: 18px;
          color: white;
        }

        .fees-highlight {
          background: linear-gradient(135deg, #ecfeff, #f0f9ff);
          border: 1px solid #bae6fd;
          border-radius: 28px;
          padding: 34px;
          margin-top: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .fees-highlight strong {
          font-size: clamp(28px, 4vw, 42px);
          color: #075985;
        }

        .guideline-box {
          background: linear-gradient(135deg, #075985, #0e7490);
          color: white;
          border-radius: 30px;
          padding: 36px;
          box-shadow: 0 26px 60px rgba(8,47,73,0.18);
        }

        .guideline-box h2 {
          margin: 0 0 16px;
          font-size: 32px;
        }

        .guideline-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-top: 28px;
        }

        .guideline-item {
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 18px;
          padding: 18px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .cta {
          background: linear-gradient(135deg, #020617, #082f49);
          color: white;
          text-align: center;
          padding: 84px 0;
        }

        .cta h2 {
          margin: 0;
          font-size: clamp(32px, 5vw, 52px);
          line-height: 1.12;
          font-weight: 900;
        }

        .cta p {
          margin: 18px auto 0;
          max-width: 680px;
          color: #cbd5e1;
          line-height: 1.8;
          font-size: 17px;
        }

        .footer {
          background: #020617;
          color: #94a3b8;
          padding: 28px 0;
          text-align: center;
          font-size: 14px;
        }

        @media (max-width: 980px) {
          .hero-grid,
          .grid-2 {
            grid-template-columns: 1fr;
          }

          .grid-4,
          .grid-3,
          .timeline {
            grid-template-columns: repeat(2, 1fr);
          }

          .nav-links { display: none; }
        }

        @media (max-width: 640px) {
          .container { padding: 0 16px; }

          .nav-inner { height: 64px; }

          .logo { font-size: 16px; }

          .logo-box {
            width: 36px;
            height: 36px;
          }

          .nav .btn {
            padding: 10px 14px;
            font-size: 13px;
          }

          .hero {
            padding: 46px 0 54px;
          }

          .hero h1 {
            font-size: 36px;
            letter-spacing: -1px;
          }

          .hero p { font-size: 16px; }

          .hero-actions {
            flex-direction: column;
          }

          .btn { width: 100%; }

          .hero-stats,
          .grid-4,
          .grid-3,
          .timeline,
          .guideline-list {
            grid-template-columns: 1fr;
          }

          .section { padding: 56px 0; }

          .hero-card,
          .certificate-card,
          .guideline-box,
          .fees-highlight {
            border-radius: 22px;
            padding: 22px;
          }

          .section-header { margin-bottom: 30px; }

          .fees-highlight {
            text-align: center;
            justify-content: center;
          }
        }
      `}</style>

      <nav className="nav">
        <div className="container nav-inner">
          <div className="logo">
            <div className="logo-box">D</div>
            DRA Certification
          </div>

          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#eligibility">Eligibility</a>
            <a href="#process">Process</a>
            <a href="#fees">Fees</a>
            <a href="#career">Career</a>
          </div>

          <a href="#start" className="btn btn-primary">
            Start
          </a>
        </div>
      </nav>

      <section className="hero">
        <div className="container hero-grid">
          <Reveal>
            <div>
              <div className="badge">Debt Recovery Agent Certification</div>

              <h1>
                Become a Certified <span>Debt Recovery Agent</span>
              </h1>

              <p>
                Start your DRA certification journey with clear guidance. Learn
                eligibility, training process, exam fees, study material, and
                certification steps in one place.
              </p>

              <div className="hero-actions">
                <a href="#process" className="btn btn-primary">
                  View Certification Process <ArrowRight />
                </a>
                <a href="#fees" className="btn btn-light">
                  Check Fees
                </a>
              </div>

              <div className="hero-stats">
                <div className="stat">
                  <strong>18+</strong>
                  <span>Minimum Age</span>
                </div>
                <div className="stat">
                  <strong>10th</strong>
                  <span>Minimum Qualification</span>
                </div>
                <div className="stat">
                  <strong>50–100</strong>
                  <span>Training Hours</span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="hero-card">
              <div className="certificate-card">
                <div className="certificate-title">
                  DRA Certification Journey
                </div>

                <div className="certificate-list">
                  <div className="certificate-item">
                    <CheckIcon />
                    <div>
                      <strong>Eligibility</strong>
                      <br />
                      <span>
                        Minimum age 18 years and 10th pass qualification.
                      </span>
                    </div>
                  </div>

                  <div className="certificate-item">
                    <CheckIcon />
                    <div>
                      <strong>Training</strong>
                      <br />
                      <span>
                        100 hours for 10th/12th candidates and 50 hours for
                        graduates.
                      </span>
                    </div>
                  </div>

                  <div className="certificate-item">
                    <CheckIcon />
                    <div>
                      <strong>Certification</strong>
                      <br />
                      <span>
                        Complete training, write exam, pass and get certified.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="about" className="section">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <div className="section-label">What is DRA?</div>
              <h2 className="section-title">Debt Recovery Agent</h2>
              <p className="section-desc">
                A Debt Recovery Agent is a certified professional who helps
                banks, NBFCs, and financial institutions recover overdue loan
                payments in a legal and ethical way.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="eligibility" className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <div className="section-header">
              <div className="section-label">Who can apply?</div>
              <h2 className="section-title">Eligibility Criteria</h2>
            </div>
          </Reveal>

          <div className="grid-4">
            {eligibility.map((item, index) => (
              <Reveal delay={index * 80} key={item}>
                <div className="info-card">
                  <div className="icon-box">✅</div>
                  <h3>{item}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "#ecfeff" }}>
        <div className="container">
          <Reveal>
            <div className="section-header">
              <div className="section-label">Mandatory Training</div>
              <h2 className="section-title">Training Requirement</h2>
              <p className="section-desc">
                Training is mandatory before appearing for the DRA exam.
                Training is available in both online and offline modes.
              </p>
            </div>
          </Reveal>

          <div className="grid-2">
            <Reveal>
              <div className="info-card">
                <div className="icon-box">🎓</div>
                <h3>10th / 12th Pass Candidates</h3>
                <p>
                  Required training duration: <strong>50 hours</strong>
                  <br />
                  Mode: Online / Offline training available
                </p>

                <ul className="list">
                  {training.map((item) => (
                    <li key={item}>
                      <CheckIcon /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="info-card">
                <div className="icon-box">📘</div>
                <h3>Graduate Candidates</h3>
                <p>
                  Required training duration: <strong>50 hours</strong>
                </p>

                <ul className="list">
                  {training.map((item) => (
                    <li key={item}>
                      <CheckIcon /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="process" className="section process-section">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <div className="section-label">Step-by-step</div>
              <h2 className="section-title">Exam & Certification Process</h2>
            </div>
          </Reveal>

          <div className="timeline">
            {steps.map((step, index) => (
              <Reveal delay={index * 60} key={step}>
                <div className="step-card">
                  <div className="step-number">{index + 1}</div>
                  <h3>{step}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="fees" className="section">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <div className="section-label">Fee Details</div>
              <h2 className="section-title">Fees Structure</h2>
            </div>
          </Reveal>

          <div className="grid-3">
            <Reveal>
              <div className="info-card">
                <div className="icon-box">💰</div>
                <h3>Training Fee</h3>
                <p>₹2,500 – ₹4,000</p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="info-card">
                <div className="icon-box">📝</div>
                <h3>Exam Fee</h3>
                <p>₹1,200 + GST</p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="info-card">
                <div className="icon-box">🏅</div>
                <h3>Membership</h3>
                <p>Optional</p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={240}>
            <div className="fees-highlight">
              <div>
                <p style={{ margin: 0, fontWeight: 800, color: "#075985" }}>
                  Total Estimated Cost
                </p>
                <strong>₹4,000 – ₹7,000</strong>
              </div>

              <a href="#start" className="btn btn-primary">
                Start Certification <ArrowRight />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ background: "#f0f9ff" }}>
        <div className="container">
          <Reveal>
            <div className="info-card">
              <div className="icon-box">📚</div>
              <h3>Study Material</h3>
              <p>
                Handbook on Debt Recovery is available in English, Telugu,
                Hindi, and more languages.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="career" className="section">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <div className="section-label">Career Opportunities</div>
              <h2 className="section-title">
                Work Opportunities After DRA Certification
              </h2>
            </div>
          </Reveal>

          <div className="grid-4">
            {careers.map((career, index) => (
              <Reveal delay={index * 80} key={career}>
                <div className="info-card">
                  <div className="icon-box">
                    {index === 0
                      ? "🏦"
                      : index === 1
                        ? "🏢"
                        : index === 2
                          ? "📋"
                          : "💼"}
                  </div>
                  <h3>{career}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <div className="guideline-box">
              <h2>Important Guidelines</h2>
              <p style={{ color: "#dbeafe", lineHeight: 1.7, margin: 0 }}>
                A Debt Recovery Agent must follow legal, ethical, and
                professional recovery practices.
              </p>

              <div className="guideline-list">
                {guidelines.map((item) => (
                  <div className="guideline-item" key={item}>
                    <CheckIcon />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="start" className="cta">
        <div className="container">
          <Reveal>
            <h2>Start Your DRA Certification Journey Today</h2>
            <p>
              Start your certification and build your career in banking recovery
              services.
            </p>

            <div style={{ marginTop: 34 }}>
              <a href="#process" className="btn btn-primary">
                Begin Now <ArrowRight />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="footer">
        <div className="container">© 2026 DRA Certification Guidance.</div>
      </footer>
    </div>
  );
};

export default DRACertificationLanding;
