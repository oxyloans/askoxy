import React from "react";
import {
  Mountain,
  Factory,
  Ship,
  Gem,
  ShoppingBag,
  BadgeDollarSign,
  HandCoins,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo1 from "../assets/img/askoxylogonew.png";

const platformUrl = "https://www.oxygold.ai/";
const platformRedirectPath = "/platform-redirect?target=oxygold";

const participants = [
  {
    title: "Gold Miners",
    desc: "Verified sourcing from trusted mining partners.",
    icon: Mountain,
  },
  {
    title: "Refinery",
    desc: "Certified purification for market-ready gold.",
    icon: Factory,
  },
  {
    title: "Import",
    desc: "Structured cross-border logistics and compliance.",
    icon: Ship,
  },
  {
    title: "Jewellery",
    desc: "Better supply access and ecosystem collaboration.",
    icon: Gem,
  },
  {
    title: "Buyer",
    desc: "Transparent pricing and smarter sourcing decisions.",
    icon: ShoppingBag,
  },
  {
    title: "Seller",
    desc: "Digital demand access and smoother transactions.",
    icon: BadgeDollarSign,
  },
  {
    title: "Lease",
    desc: "Gold-backed leasing unlocking new liquidity.",
    icon: HandCoins,
  },
];

const chainSteps = [
  { label: "Mine", icon: Mountain },
  { label: "Refine", icon: Factory },
  { label: "Import", icon: Ship },
  { label: "Buy & Sell", icon: ShoppingBag },
  { label: "Lease", icon: HandCoins },
];

const chainDesc = [
  "Responsible sourcing from verified mining partners",
  "Certified purification and quality standardization",
  "Structured cross-border logistics and compliance",
  "Digital access for buyers, sellers and jewellers",
  "Gold-backed leasing unlocking fresh liquidity",
];

const logoUrl = "https://i.ibb.co/PGYYDvL9/l4.png";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&family=DM+Sans:wght@300;400;500;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --g:  #C9942A;
    --gl: #E8B84B;
    --gp: #FDF6E7;
    --gm: #F7E8C5;
    --ink: #181410;
    --ink2: #5C5040;
    --ink3: #8A7B69;
    --bg:  #FDFAF4;
    --wh:  #FFFFFF;
    --br:  rgba(201,148,42,.16);
    --brs: rgba(201,148,42,.09);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--ink);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  .serif { font-family: 'Cormorant Garamond', serif; }

  .gold-page-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
    background: rgba(253,250,244,.94);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--br);
  }

  .gold-page-main {
    padding-top: 72px;
  }

  .hdr {
    max-width: 1160px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 24px;
  }

  .logo-combo {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .logo-img {
    height: 38px;
    width: auto;
    object-fit: contain;
    display: block;
    flex-shrink: 0;
  }

  .hdr-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .btn {
    border: none;
    cursor: pointer;
    border-radius: 999px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    letter-spacing: .02em;
    transition: all .2s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .btn-dark {
    background: var(--ink);
    color: #fff;
    padding: 11px 24px;
    font-size: 13px;
  }

  .btn-dark:hover {
    background: var(--g);
    transform: translateY(-1px);
  }

  .btn-gold {
    background: #D4AF37;
    color: #2B0A59;
    padding: 10px 22px;
    font-size: 13px;
    box-shadow: 0 8px 20px rgba(212,175,55,.18);
  }

  .btn-gold:hover {
    opacity: .92;
    transform: translateY(-1px);
  }

  .mob-toggle {
    display: none;
    background: #fff;
    border: 1px solid var(--br);
    border-radius: 12px;
    padding: 8px;
    cursor: pointer;
    color: var(--ink2);
    align-items: center;
    justify-content: center;
  }

  .mob-menu {
    background: var(--wh);
    border-top: 1px solid var(--br);
    padding: 14px 20px 20px;
  }

  .hero {
    max-width: 1160px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr);
    gap: 56px;
    align-items: center;
    padding: 72px 24px 80px;
  }

  .pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: var(--gm);
    border: 1px solid var(--br);
    border-radius: 100px;
    padding: 6px 14px;
    font-size: 11px;
    font-weight: 600;
    color: var(--g);
    letter-spacing: .08em;
    text-transform: uppercase;
  }

  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--gl);
    animation: blink 2s infinite;
  }

  @keyframes blink {
    0%,100% { opacity: 1; }
    50% { opacity: .3; }
  }

  .h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.5rem,4.5vw,4.2rem);
    font-weight: 500;
    line-height: 1.06;
    letter-spacing: -.02em;
    color: var(--ink);
    margin-top: 18px;
  }

  .h1 em {
    font-style: italic;
    color: var(--g);
  }

  .hero-desc {
    margin-top: 18px;
    font-size: 15px;
    line-height: 1.85;
    color: var(--ink3);
    font-weight: 400;
    max-width: 520px;
  }

  .hero-actions {
    display: flex;
    gap: 12px;
    margin-top: 30px;
    flex-wrap: wrap;
  }

  .panel {
    background: var(--wh);
    border: 1px solid var(--br);
    border-radius: 24px;
    padding: 26px 24px;
    box-shadow: 0 10px 30px rgba(0,0,0,.03);
    width: 100%;
    overflow: hidden;
  }

  .panel-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .28em;
    text-transform: uppercase;
    color: var(--g);
    margin-bottom: 20px;
  }

  .chain-row {
    display: flex;
    align-items: center;
    width: 100%;
    overflow-x: auto;
    padding-bottom: 4px;
    scrollbar-width: none;
  }

  .chain-row::-webkit-scrollbar {
    display: none;
  }

  .chain-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    flex-shrink: 0;
  }

  .chain-ico {
    width: 42px;
    height: 42px;
    border-radius: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .4s cubic-bezier(.34,1.56,.64,1);
    border: 1.5px solid #EDE5D4;
    background: #FAFAF7;
  }

  .chain-ico.active {
    background: linear-gradient(135deg,var(--gl),var(--g));
    border-color: transparent;
    box-shadow: 0 6px 20px rgba(201,148,42,.3);
    transform: scale(1.08) translateY(-2px);
  }

  .chain-ico.past {
    background: var(--gp);
    border-color: var(--br);
  }

  .chain-lbl {
    font-size: 10px;
    font-weight: 600;
    color: #B0A090;
    transition: color .3s;
    letter-spacing: .04em;
    text-align: center;
    white-space: nowrap;
  }

  .chain-lbl.active { color: var(--g); }
  .chain-lbl.past { color: #9A7A40; }

  .chain-line {
    flex: 1;
    min-width: 30px;
    height: 1px;
    background: #EDE5D4;
    transition: background .6s;
    margin: 0 8px 18px;
  }

  .chain-line.on {
    background: linear-gradient(to right,var(--gl),var(--g));
  }

  .chain-desc {
    margin-top: 16px;
    background: var(--gp);
    border: 1px solid var(--brs);
    border-radius: 13px;
    padding: 13px 17px;
    min-height: 48px;
    font-size: 13px;
    color: var(--ink2);
    line-height: 1.7;
    font-weight: 400;
  }

  .bd { border-top: 1px solid var(--br); }

  .wrap {
    max-width: 1160px;
    margin: 0 auto;
    padding: 80px 24px;
  }

  .sec-h {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.9rem,3vw,2.6rem);
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: -.01em;
    color: var(--ink);
    margin-top: 8px;
  }

  .sec-desc {
    margin-top: 10px;
    font-size: 14px;
    color: var(--ink3);
    line-height: 1.8;
    max-width: 680px;
  }

  .part-top {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }

  .list {
    border: 1px solid var(--br);
    border-radius: 22px;
    overflow: hidden;
    background: var(--wh);
    box-shadow: 0 10px 30px rgba(0,0,0,.02);
  }

  .li {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 24px;
    border-bottom: 1px solid var(--brs);
    transition: background .18s;
    cursor: default;
  }

  .li:last-child { border-bottom: none; }
  .li:hover { background: var(--gp); }

  .li-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px;
    color: #D0C0A0;
    min-width: 22px;
    flex-shrink: 0;
  }

  .li-ico {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    flex-shrink: 0;
    background: var(--gp);
    border: 1px solid var(--br);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--g);
    transition: transform .2s;
  }

  .li:hover .li-ico { transform: scale(1.08); }

  .li-body { flex: 1; min-width: 0; }

  .li-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--ink);
  }

  .li-desc {
    font-size: 12.5px;
    color: var(--ink3);
    margin-top: 2px;
    line-height: 1.55;
    font-weight: 400;
  }

  .li-arr {
    color: #D8CABB;
    flex-shrink: 0;
    transition: all .2s;
  }

  .li:hover .li-arr {
    color: var(--g);
    transform: translateX(3px);
  }

  footer {
    border-top: 1px solid var(--br);
    background: var(--wh);
  }

  .ftr {
    max-width: 1160px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .ftr-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ftr-logo {
    height: 34px;
    width: auto;
    object-fit: contain;
    display: block;
  }

  .ftr-copy {
    font-size: 12px;
    color: var(--ink3);
  }

  @media (max-width: 992px) {
    .hero {
      grid-template-columns: 1fr;
      gap: 36px;
      padding-top: 56px;
    }

    .hero-desc {
      max-width: 100%;
    }
  }

  @media (max-width: 768px) {
    .gold-page-main {
      padding-top: 64px;
    }

    .hdr {
      padding: 12px 18px;
    }

    .desktop-btn {
      display: none !important;
    }

    .mob-toggle {
      display: flex !important;
    }

    .hero {
      padding: 46px 20px 56px;
      gap: 28px;
    }

    .wrap {
      padding: 56px 20px;
    }

    .part-top {
      flex-direction: column;
      align-items: flex-start;
    }

    .logo-img {
      height: 32px;
    }

    .panel {
      padding: 22px 16px;
    }

    .chain-line {
      min-width: 20px;
      margin: 0 6px 18px;
    }

    .ftr {
      flex-direction: column;
      text-align: center;
    }
  }

  @media (max-width: 480px) {
    .h1 {
      font-size: 2.15rem;
      line-height: 1.08;
    }

    .hero-desc {
      font-size: 14px;
      line-height: 1.75;
    }

    .hero-actions {
      flex-direction: column;
    }

    .hero-actions .btn {
      width: 100%;
    }

    .li {
      padding: 15px 16px;
      gap: 12px;
    }

    .li-title {
      font-size: 13.5px;
    }

    .li-desc {
      font-size: 12px;
    }
  }
`;

export default function GoldLandingPage() {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(0);

  const navigate = useNavigate();

const platformUrl = "https://www.oxygold.ai/";
const platformRedirectPath = "/platform-redirect?target=oxygold";

const goToLoginFirst = () => {
  sessionStorage.setItem("redirectPath", platformRedirectPath);
  sessionStorage.setItem("platformRedirectUrl", platformUrl);
  localStorage.setItem("platformRedirectUrl", platformUrl);

  navigate("/whatsapplogin", {
    state: {
      from: platformRedirectPath,
    },
  });
};

  React.useEffect(() => {
    const t = setInterval(() => {
      setStep((p) => (p + 1) % chainSteps.length);
    }, 1900);

    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{S}</style>

      <header className="gold-page-header">
        <div className="hdr">
          <div className="logo-combo">
            <img
              src={Logo1}
              alt="AskOxy Logo"
              onClick={() => navigate("/")}
              className="logo-img"
              style={{ cursor: "pointer" }}
            />

            <img
              src={logoUrl}
              alt="OxyGold Logo"
              onClick={goToLoginFirst}
              className="logo-img"
              style={{ cursor: "pointer" }}
            />
          </div>

          <div className="hdr-right">
            <button
              type="button"
              onClick={goToLoginFirst}
              className="btn btn-gold desktop-btn"
            >
              Get Started
            </button>

            <button
              className="mob-toggle"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="mob-menu">
            <button
              type="button"
              className="btn btn-gold"
              style={{ width: "100%" }}
              onClick={() => {
                setOpen(false);
                goToLoginFirst();
              }}
            >
              Get Started
            </button>
          </div>
        )}
      </header>

      <main className="gold-page-main">
        <section id="platform">
          <div className="hero">
            <div>
              <div className="pill">
                <span className="dot" />
                Trusted Gold Network
              </div>

              <h1 className="h1 serif">
                Powering the
                <br />
                <em>Complete Gold Ecosystem</em>
              </h1>

              <p className="hero-desc">
                OXYGOLD.AI connects miners, refiners, importers, jewellers,
                buyers, sellers, and leasing partners through one trusted digital
                platform built for transparency, traceability, and growth.
              </p>

              <div className="hero-actions">
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={goToLoginFirst}
                >
                  Explore Platform
                </button>
              </div>
            </div>

            <div className="panel">
              <div className="panel-label">Gold Process</div>

              <div className="chain-row">
                {chainSteps.map((s, i) => {
                  const Icon = s.icon;
                  const isActive = i === step;
                  const isPast = i < step;

                  return (
                    <React.Fragment key={s.label}>
                      <div className="chain-step">
                        <div
                          className={`chain-ico${
                            isActive ? " active" : isPast ? " past" : ""
                          }`}
                        >
                          <Icon
                            size={16}
                            color={
                              isActive ? "#fff" : isPast ? "#C9942A" : "#B0A090"
                            }
                          />
                        </div>

                        <span
                          className={`chain-lbl${
                            isActive ? " active" : isPast ? " past" : ""
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>

                      {i < chainSteps.length - 1 && (
                        <div className={`chain-line${i < step ? " on" : ""}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              <div className="chain-desc">{chainDesc[step]}</div>
            </div>
          </div>
        </section>

        <section
          id="participants"
          className="bd"
          style={{ background: "var(--wh)" }}
        >
          <div className="wrap">
            <div className="part-top">
              <div>
                <h2 className="sec-h serif">
                  Track & Trace Across the Gold Value Chain
                </h2>

                <p className="sec-desc">
                  From mine to market, every participant in the ecosystem can
                  connect, collaborate, and move with more visibility.
                </p>
              </div>
            </div>

            <div className="list">
              {participants.map((item, idx) => {
                const Icon = item.icon;

                return (
                  <div className="li" key={item.title}>
                    <span className="li-num serif">
                      {String(idx + 1).padStart(2, "0")}
                    </span>

                    <div className="li-ico">
                      <Icon size={15} />
                    </div>

                    <div className="li-body">
                      <div className="li-title">{item.title}</div>
                      <div className="li-desc">{item.desc}</div>
                    </div>

                    <ChevronRight size={14} className="li-arr" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <footer>
          <div className="ftr">
            <div className="ftr-left">
              <img src={logoUrl} alt="OxyGold Logo" className="ftr-logo" />
            </div>

            <span className="ftr-copy">
              © 2026 OXYGOLD.AI. All rights reserved.
            </span>
          </div>
        </footer>
      </main>
    </>
  );
}