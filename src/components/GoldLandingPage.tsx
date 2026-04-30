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
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo1 from "../assets/img/askoxylogonew.png";

const platformUrl = "https://www.oxygold.ai/";
const platformRedirectPath = "/platform-redirect?target=oxygold";

const logoUrl = "https://i.ibb.co/PGYYDvL9/l4.png";
const headerImageUrl = "https://i.ibb.co/TqcX4h44/gpl-header.png";

const participants = [
  { title: "Gold Miners", desc: "Verified sourcing from trusted mining partners.", icon: Mountain },
  { title: "Refinery", desc: "Certified purification for market-ready gold.", icon: Factory },
  { title: "Import", desc: "Structured cross-border logistics and compliance.", icon: Ship },
  { title: "Jewellery", desc: "Better supply access and ecosystem collaboration.", icon: Gem },
  { title: "Buyer", desc: "Transparent pricing and smarter sourcing decisions.", icon: ShoppingBag },
  { title: "Seller", desc: "Digital demand access and smoother transactions.", icon: BadgeDollarSign },
  { title: "Lease", desc: "Gold-backed leasing unlocking new liquidity.", icon: HandCoins },
];

const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', sans-serif;
  background: #fffaf0;
  color: #20160a;
  overflow-x: hidden;
}

.gold-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(245,211,108,.24), transparent 28%),
    linear-gradient(180deg, #fffaf0 0%, #fff7e6 42%, #ffffff 100%);
}

.gold-page-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  background: rgba(255, 250, 240, 0.9);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(212,175,55,.18);
}

.header-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 14px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-img {
  height: 38px;
  width: auto;
  object-fit: contain;
  cursor: pointer;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.primary-btn {
  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 999px;
  background: linear-gradient(135deg, #d4af37, #f7d976);
  color: #2b1800;
  padding: 12px 22px;
  font-size: 13px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 14px 30px rgba(212,175,55,.25);
  transition: all .25s ease;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 38px rgba(212,175,55,.34);
}

.secondary-btn {
  border: 1px solid rgba(55,37,8,.14);
  background: #fff;
  color: #2d1e07;
  padding: 12px 22px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

.menu-btn {
  display: none;
  border: 1px solid rgba(212,175,55,.28);
  background: #fff;
  color: #3d2700;
  border-radius: 12px;
  padding: 9px;
  cursor: pointer;
}

.mobile-menu {
  padding: 14px 20px 20px;
  border-top: 1px solid rgba(212,175,55,.16);
  background: #fffdf7;
}

.main {
  padding-top: 72px;
}

.hero {
  max-width: 1180px;
  margin: 0 auto;
  padding: 72px 22px 72px;
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 46px;
  align-items: center;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(212,175,55,.14);
  border: 1px solid rgba(212,175,55,.22);
  color: #9a6a00;
  border-radius: 999px;
  padding: 8px 15px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.badge-dot {
  width: 7px;
  height: 7px;
  background: #d4af37;
  border-radius: 50%;
  box-shadow: 0 0 0 5px rgba(212,175,55,.16);
}

.hero-title {
  margin-top: 22px;
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.7rem, 5vw, 5rem);
  line-height: .98;
  letter-spacing: -.04em;
  color: #211300;
}

.hero-title span {
  display: block;
  color: #b98200;
}

.hero-desc {
  margin-top: 22px;
  max-width: 560px;
  font-size: 16px;
  line-height: 1.8;
  color: #78613f;
}

.hero-points {
  margin-top: 26px;
  display: grid;
  gap: 12px;
}

.hero-point {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #4b3411;
  font-size: 14px;
  font-weight: 600;
}

.hero-point svg {
  color: #c9942a;
  flex-shrink: 0;
}

.hero-actions {
  margin-top: 32px;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.hero-image-wrap {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-image {
  width: 100%;
  max-width: 640px;
  height: auto;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 22px 28px rgba(83, 55, 0, 0.16));
}

.stats-row {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 22px 70px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.stat-card {
  background: rgba(255,255,255,.82);
  border: 1px solid rgba(212,175,55,.18);
  border-radius: 22px;
  padding: 22px;
  box-shadow: 0 18px 44px rgba(60,40,5,.06);
}

.stat-number {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  color: #a87400;
  font-weight: 700;
}

.stat-label {
  margin-top: 6px;
  font-size: 13px;
  color: #7c684b;
  line-height: 1.5;
}

.section {
  background: #fff;
  border-top: 1px solid rgba(212,175,55,.15);
}

.section-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 82px 22px;
}

.section-head {
  max-width: 760px;
  margin-bottom: 34px;
}

.section-kicker {
  color: #b98200;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: .12em;
  text-transform: uppercase;
}

.section-title {
  margin-top: 10px;
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 3vw, 3.2rem);
  line-height: 1.08;
  color: #211300;
}

.section-desc {
  margin-top: 14px;
  color: #7b684c;
  font-size: 15px;
  line-height: 1.75;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.card {
  background: linear-gradient(180deg, #fffdf8, #ffffff);
  border: 1px solid rgba(212,175,55,.18);
  border-radius: 24px;
  padding: 22px;
  min-height: 190px;
  transition: all .25s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 45px rgba(74,49,3,.1);
  border-color: rgba(212,175,55,.36);
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(212,175,55,.18), rgba(255,246,216,.9));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b98200;
}

.card-title {
  margin-top: 18px;
  font-size: 16px;
  font-weight: 900;
  color: #241600;
}

.card-desc {
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.65;
  color: #7b684c;
}

.cta {
  background:
    radial-gradient(circle at top right, rgba(212,175,55,.24), transparent 35%),
    linear-gradient(135deg, #2b1800, #7a5300);
  color: #fff;
}

.cta-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 62px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
}

.cta-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 3vw, 3rem);
  line-height: 1.1;
}

.cta-desc {
  margin-top: 10px;
  color: rgba(255,255,255,.74);
  font-size: 14px;
  line-height: 1.7;
  max-width: 620px;
}

.footer {
  background: #fff;
  border-top: 1px solid rgba(212,175,55,.16);
}

.footer-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
}

.footer-logo {
  height: 34px;
}

.copy {
  color: #8b7656;
  font-size: 12px;
}

@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 32px;
    padding-top: 54px;
  }

  .hero-image-wrap {
    order: -1;
  }

  .hero-image {
    max-width: 620px;
  }

  .hero-desc {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-points {
    max-width: 560px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-point {
    justify-content: center;
  }

  .hero-actions {
    justify-content: center;
  }

  .grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-row {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .main {
    padding-top: 64px;
  }

  .header-inner {
    padding: 12px 18px;
  }

  .logo-img {
    height: 31px;
  }

  .desktop-btn {
    display: none;
  }

  .menu-btn {
    display: inline-flex;
  }

  .hero {
    padding: 32px 18px 44px;
    gap: 24px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-desc {
    font-size: 14px;
    line-height: 1.7;
  }

  .hero-image {
    max-width: 100%;
    filter: drop-shadow(0 14px 18px rgba(83, 55, 0, 0.13));
  }

  .stats-row {
    grid-template-columns: 1fr;
    padding: 0 18px 48px;
  }

  .section-inner {
    padding: 58px 18px;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .cta-inner {
    flex-direction: column;
    align-items: flex-start;
    padding: 52px 18px;
  }

  .primary-btn,
  .secondary-btn {
    width: 100%;
  }

  .hero-actions {
    width: 100%;
  }

  .footer-inner {
    flex-direction: column;
    text-align: center;
  }
}
`;

export default function GoldLandingPage() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

const goToLoginFirst = () => {
  const currentPage = window.location.pathname + window.location.search;

  const accessToken =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token");

  const cookieToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="));

  const isLoggedIn = Boolean(accessToken || cookieToken);

  // ✅ If already logged in, go directly to platform
  if (isLoggedIn) {
    window.location.href = platformUrl;
    return;
  }

  // ✅ After login success, go to platform redirect
  sessionStorage.setItem("redirectPath", platformRedirectPath);
  sessionStorage.setItem("platformRedirectUrl", platformUrl);
  localStorage.setItem("platformRedirectUrl", platformUrl);

  // ✅ If login closed, return to current page
  sessionStorage.setItem("loginCloseReturnPath", currentPage);

  navigate("/whatsapplogin", {
    state: {
      from: platformRedirectPath,
      closeReturnPath: currentPage,
    },
  });
};

  return (
    <>
      <style>{S}</style>

      <div className="gold-page">
        <header className="gold-page-header">
          <div className="header-inner">
            <div className="logo-wrap">
              <img
                src={Logo1}
                alt="AskOxy Logo"
                className="logo-img"
                onClick={() => navigate("/")}
              />

              <img
                src={logoUrl}
                alt="OxyGold Logo"
                className="logo-img"
                onClick={goToLoginFirst}
              />
            </div>

            <div className="header-actions">
              <button
                type="button"
                className="primary-btn desktop-btn"
                onClick={goToLoginFirst}
              >
                Get Started <ArrowRight size={15} />
              </button>

              <button
                type="button"
                className="menu-btn"
                onClick={() => setOpen((prev) => !prev)}
                aria-label="Toggle menu"
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {open && (
            <div className="mobile-menu">
              <button
                type="button"
                className="primary-btn"
                onClick={() => {
                  setOpen(false);
                  goToLoginFirst();
                }}
              >
                Get Started <ArrowRight size={15} />
              </button>
            </div>
          )}
        </header>

        <main className="main">
          <section className="hero">
            <div>
              <div className="badge">
                <span className="badge-dot" />
                Trusted Gold Network
              </div>

              <h1 className="hero-title">
                Powering the
                <span>Complete Gold Ecosystem</span>
              </h1>

              <p className="hero-desc">
                OXYGOLD.AI connects miners, refiners, importers, jewellers,
                buyers, sellers, and leasing partners through one trusted
                digital platform built for transparency, traceability, and
                growth.
              </p>

              <div className="hero-points">
                <div className="hero-point">
                  <CheckCircle2 size={18} />
                  Track & trace visibility across the value chain
                </div>
                <div className="hero-point">
                  <CheckCircle2 size={18} />
                  Digital access for buyers, sellers, and jewellers
                </div>
                <div className="hero-point">
                  <CheckCircle2 size={18} />
                  Gold-backed leasing and ecosystem liquidity
                </div>
              </div>

              <div className="hero-actions">
                <button
                  type="button"
                  className="primary-btn"
                  onClick={goToLoginFirst}
                >
                  Explore Platform <ArrowRight size={15} />
                </button>

              </div>
            </div>

            <div className="hero-image-wrap">
              <img
                src={headerImageUrl}
                alt="OXYGOLD.AI Gold Ecosystem"
                className="hero-image"
              />
            </div>
          </section>

          <section className="section">
            <div className="section-inner">
              <div className="section-head">
                <div className="section-kicker">Gold Value Chain</div>

                <h2 className="section-title">
                  Track & Trace Across the Gold Network
                </h2>

                <p className="section-desc">
                  From mine to market, every participant can connect,
                  collaborate, and move with more visibility through a trusted
                  digital gold ecosystem.
                </p>
              </div>

              <div className="grid">
                {participants.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div className="card" key={item.title}>
                      <div className="icon-box">
                        <Icon size={22} />
                      </div>

                      <h3 className="card-title">{item.title}</h3>
                      <p className="card-desc">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="cta">
            <div className="cta-inner">
              <div>
                <h2 className="cta-title">
                  Build Trust. Improve Visibility. Grow with Digital Gold.
                </h2>

                <p className="cta-desc">
                  Join OXYGOLD.AI to connect with the gold ecosystem and unlock
                  smarter sourcing, selling, buying, and leasing opportunities.
                </p>
              </div>

            </div>
          </section>

          <footer className="footer">
            <div className="footer-inner">
              <img src={logoUrl} alt="OxyGold Logo" className="footer-logo" />

              <span className="copy">
                © 2026 OXYGOLD.AI. All rights reserved.
              </span>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}