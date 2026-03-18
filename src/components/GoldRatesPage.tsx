import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ModalContent } from "./ModalSection";

const BASE_URL = "https://meta.oxyloans.com/api";
const REFRESH_MS = 300000;

interface GoldRate {
  id: string;
  companyName: string;
  rate22kt: number | null;
  rate24kt: number | null;
  silverprice: number | null;
  updatedTime: number;
  websiteLink?: string;
  website22kt?: string;
  website24kt?: string;
  websiteSilver?: string;
}

const safeNumber = (v: number | null | undefined) =>
  typeof v === "number" && Number.isFinite(v) ? v : null;

const calcChange = (current: number | null, previous: number | null) => {
  const c = safeNumber(current);
  const p = safeNumber(previous);
  if (c === null || p === null || p === 0) return null;
  const diff = c - p;
  const pct = (diff / p) * 100;
  return { diff, pct };
};

const formatCurrency2 = (price: number | null) => {
  if (price === null || price === undefined) return "—";
  return `₹${price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const fmt = (price: number | null) => {
  if (price === null || price === undefined) return "—";
  return `₹${price.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
};

const avg = (nums: Array<number | null>) => {
  const valid = nums.filter((n): n is number => typeof n === "number" && Number.isFinite(n));
  if (!valid.length) return null;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
};

const GoldRatesPage: React.FC = () => {
  const navigate = useNavigate();

  const buyRef   = useRef<HTMLDivElement>(null);
  const sellRef  = useRef<HTMLDivElement>(null);
  const leaseRef = useRef<HTMLDivElement>(null);

  const [goldRates, setGoldRates] = useState<GoldRate[]>([]);
  const [oneHourAgoRates, setOneHourAgoRates] = useState<GoldRate[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const [selectedKarat, setSelectedKarat] = useState<"22k" | "24k" | null>(null);
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<any>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [activeSection, setActiveSection] = useState<"buy" | "sell" | "lease" | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const lastFetchTimeRef = useRef<number>(Date.now());

  const scrollTo = (ref: React.RefObject<HTMLDivElement>, section: "buy" | "sell" | "lease") => {
    setActiveSection(section);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const calculatePrice = () => {
    const ibjaRate = goldRates.find(r => r.companyName === "IBJA");
    if (!ibjaRate || !weight) return;
    const rate = selectedKarat === "22k" ? ibjaRate.rate22kt : ibjaRate.rate24kt;
    if (!rate) return;
    const weightNum = parseFloat(weight);
    const basePrice = rate * weightNum;
    const making = basePrice * 0.015;
    const gst = (basePrice + making) * 0.03;
    const total = basePrice + making + gst;
    setResult({ basePrice, making, gst, total });
  };

  const calculateSellPrice = () => {
    const ibjaRate = goldRates.find(r => r.companyName === "IBJA");
    if (!ibjaRate || !weight) return;
    const rate = selectedKarat === "22k" ? ibjaRate.rate22kt : ibjaRate.rate24kt;
    if (!rate) return;
    const weightNum = parseFloat(weight);
    const basePrice = rate * weightNum;
    const refining = basePrice * 0.02;
    const payable = basePrice - refining;
    setResult({ basePrice, refining, payable });
  };

  const fetchGoldRates = async (manual = false) => {
    manual ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/product-service/all-different-gold-rates`);
      const list: GoldRate[] = Array.isArray(res.data) ? res.data : [];
      const now = Date.now();
      const minutesSinceLast = (now - lastFetchTimeRef.current) / 60000;
      if (minutesSinceLast >= 50 && goldRates.length > 0) setOneHourAgoRates([...goldRates]);
      setGoldRates(list);
      setLastUpdated(new Date());
      lastFetchTimeRef.current = now;
    } catch (e) {
      setError("Failed to fetch gold rates. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGoldRates(false);
    const interval = setInterval(() => fetchGoldRates(false), REFRESH_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const headline = useMemo(() => {
    const today22 = avg(goldRates.map(r => r.rate22kt));
    const today24 = avg(goldRates.map(r => r.rate24kt));
    const todaySilver = avg(goldRates.map(r => r.silverprice));
    let prev22 = null, prev24 = null, prevSilver = null;
    if (oneHourAgoRates?.length) {
      prev22 = avg(oneHourAgoRates.map(r => r.rate22kt));
      prev24 = avg(oneHourAgoRates.map(r => r.rate24kt));
      prevSilver = avg(oneHourAgoRates.map(r => r.silverprice));
    }
    return {
      today22, today24, todaySilver,
      ch22: calcChange(today22, prev22),
      ch24: calcChange(today24, prev24),
      chSilver: calcChange(todaySilver, prevSilver),
    };
  }, [goldRates, oneHourAgoRates]);

  const formatTime = (timestamp: number) =>
    new Date(timestamp).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const ibjaRate   = goldRates.find(r => r.companyName === "IBJA");
  const tableRates = goldRates.filter(r => r.companyName !== "IBJA");

  const s22Base    = ibjaRate?.rate22kt ?? null;
  const s22Charges = s22Base !== null ? s22Base * 0.02 : null;
  const s22Payable = (s22Base !== null && s22Charges !== null) ? s22Base - s22Charges : null;
  const s24Base    = ibjaRate?.rate24kt ?? null;
  const s24Charges = s24Base !== null ? s24Base * 0.02 : null;
  const s24Payable = (s24Base !== null && s24Charges !== null) ? s24Base - s24Charges : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f7f4",
        fontFamily: "'Inter', -apple-system, sans-serif",
        color: "#1a1a1a",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }

        /* ── Main rates table ── */
        .gr-table { width: 100%; border-collapse: collapse; }
        .gr-table th {
          padding: 11px 18px;
          text-align: left;
          font-size: 11px;
          font-weight: 700;
          color: #9a7a30;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: #fffdf8;
          border-bottom: 1.5px solid #e8e0cc;
        }
        .gr-table td {
          padding: 14px 18px;
          border-bottom: 1px solid #f0ece2;
          font-size: 13.5px;
          vertical-align: middle;
          color: #1a1a1a;
        }
        .gr-table tr:last-child td { border-bottom: none; }
        .gr-table tbody tr:hover td { background: #fffdf8; }
        .gr-price-link { color: #222; text-decoration: none; font-weight: 500; font-variant-numeric: tabular-nums; }
        .gr-price-link:hover { color: #b8861c; text-decoration: underline; }

        /* ── Section tables ── */
        .sec-table { width: 100%; border-collapse: collapse; }
        .sec-table th {
          padding: 11px 18px;
          font-size: 11px;
          font-weight: 700;
          color: #9a7a30;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: #fffdf8;
          border-bottom: 1.5px solid #e8e0cc;
          text-align: left;
        }
        .sec-table td {
          padding: 13px 18px;
          border-bottom: 1px solid #f0ece2;
          font-size: 13.5px;
          color: #1a1a1a;
        }
        .sec-table tr:last-child td { border-bottom: none; }
        .sec-table .td-label { color: #555; font-weight: 400; }
        .sec-table .td-value { font-weight: 500; text-align: right; font-variant-numeric: tabular-nums; color: #1a1a1a; }
        .sec-table .td-total { font-weight: 700; font-size: 15px; text-align: right; color: #b8761c; font-variant-numeric: tabular-nums; }
        .sec-table .td-sub { font-size: 10px; color: #999; font-weight: 400; margin-left: 2px; }

        /* ── Live dot ── */
        .live-dot { width: 6px; height: 6px; border-radius: 50%; background: #16a34a; display: inline-block; animation: pulse 2s infinite; flex-shrink: 0; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.5)} }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Nav buttons ── */
        .nav-btn {
          background: none;
          border: 1px solid transparent;
          border-radius: 6px;
          padding: 6px 14px;
          font-size: 12.5px;
          font-weight: 500;
          color: #555;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .nav-btn:hover { color: #b8761c; background: #fdf5e6; border-color: #e0c88a; }
        .nav-btn.active { color: #b8761c; background: #fdf5e6; border-color: #e0c88a; font-weight: 600; }

        /* ── Card wrapper ── */
        .card { background: #fff; border: 1px solid #e8e0cc; border-radius: 12px; overflow: hidden; }

        /* ── Section label (small caps above heading) ── */
        .section-label {
          display: inline-block;
          font-size: 10.5px;
          font-weight: 700;
          color: #9a7a30;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 5px;
        }

        .section-anchor { scroll-margin-top: 64px; }

        @media (max-width: 768px) {
          .desktop-table { display: none !important; }
          .mobile-cards-list { display: flex !important; }
          .two-col-grid { grid-template-columns: 1fr !important; }
          .header-sub { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-cards-list { display: none !important; }
        }
      `}</style>

      {/* ════════════════ HEADER ════════════════ */}
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #e8e0cc",
          padding: "0 28px",
          height: 58,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              background: "linear-gradient(135deg, #c9993a, #e8b84a)",
              borderRadius: 7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              color: "#fff",
              fontWeight: 700,
            }}
          >
            ✦
          </div>
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: "-0.01em",
              }}
            >
              <span style={{ color: "#810cab" }}>ASKOXY</span>
              <span style={{ color: "#b8761c" }}>.AI</span>
            </div>
            <div
              className="header-sub"
              style={{
                fontSize: 10,
                color: "#888",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginTop: 1,
              }}
            >
              Gold & Silver Rates
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <button
            className={`nav-btn${activeSection === "buy" ? " active" : ""}`}
            onClick={() => scrollTo(buyRef, "buy")}
          >
            Buy Gold
          </button>
          <button
            className={`nav-btn${activeSection === "lease" ? " active" : ""}`}
            onClick={() => scrollTo(leaseRef, "lease")}
          >
            Lease Gold
          </button>
          <button
            className={`nav-btn${activeSection === "sell" ? " active" : ""}`}
            onClick={() => scrollTo(sellRef, "sell")}
          >
            Sell Gold
          </button>
          <div
            style={{
              width: 1,
              height: 18,
              background: "#e8e0cc",
              margin: "0 8px",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="live-dot" />
            <span style={{ fontSize: 11, color: "#555", fontWeight: 500 }}>
              Live
            </span>
          </div>
        </div>
      </header>

      {/* ════════════════ MAIN ════════════════ */}
      <main
        style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 80px" }}
      >
        {/* Error */}
        {error && (
          <div
            style={{
              background: "#fff5f5",
              border: "1px solid #fca5a5",
              borderRadius: 8,
              padding: "11px 16px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ color: "#b91c1c", fontSize: 13 }}>{error}</span>
            <button
              onClick={() => fetchGoldRates(true)}
              style={{
                marginLeft: "auto",
                color: "#b91c1c",
                background: "none",
                border: "1px solid #fca5a5",
                borderRadius: 5,
                cursor: "pointer",
                fontSize: 11,
                padding: "3px 10px",
                fontFamily: "inherit",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && goldRates.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "100px 0",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                border: "2.5px solid #f0e4c8",
                borderTopColor: "#c9993a",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                marginBottom: 14,
              }}
            />
            <p style={{ color: "#777", fontSize: 13 }}>Loading rates…</p>
          </div>
        ) : (
          <>
            {/* ══════════ BUY GOLD ══════════ */}
            <div ref={buyRef} className="section-anchor">
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <div>
                  <span className="section-label">Market Rates</span>
                  <h2
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#111",
                      letterSpacing: "-0.01em",
                      margin: 0,
                    }}
                  >
                    Buy Gold &amp; Silver
                  </h2>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#666",
                      marginTop: 5,
                      lineHeight: 1.5,
                    }}
                  >
                    Live rates from leading jewellery brands. Click a price to
                    visit their site.
                  </p>
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: "#777",
                    textAlign: "right",
                    paddingBottom: 2,
                  }}
                >
                  Updates every 5 min
                  {refreshing && (
                    <div
                      style={{
                        color: "#c9993a",
                        marginTop: 2,
                        fontWeight: 500,
                      }}
                    >
                      Refreshing…
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop table */}
              <div className="desktop-table card">
                <table className="gr-table">
                  <thead>
                    <tr>
                      <th>Brand</th>
                      <th>
                        22K Gold{" "}
                        <span
                          style={{
                            fontWeight: 400,
                            color: "#aaa",
                            textTransform: "none",
                            letterSpacing: 0,
                          }}
                        >
                          /g
                        </span>
                      </th>
                      <th>
                        24K Gold{" "}
                        <span
                          style={{
                            fontWeight: 400,
                            color: "#aaa",
                            textTransform: "none",
                            letterSpacing: 0,
                          }}
                        >
                          /g
                        </span>
                      </th>
                      <th>
                        Silver{" "}
                        <span
                          style={{
                            fontWeight: 400,
                            color: "#aaa",
                            textTransform: "none",
                            letterSpacing: 0,
                          }}
                        >
                          /kg
                        </span>
                      </th>
                      <th>Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRates.map((rate) => (
                      <tr key={rate.id}>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 6,
                                background: "#fdf5e6",
                                border: "1px solid #e8dcc8",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#9a7a30",
                              }}
                            >
                              {rate.companyName[0]}
                            </div>
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: 14,
                                color: "#111",
                              }}
                            >
                              {rate.companyName === "ASKOXY.AI" ? (
                                <>
                                  <span style={{ color: "#810cab" }}>
                                    ASKOXY
                                  </span>
                                  <span style={{ color: "#b8761c" }}>.AI</span>
                                </>
                              ) : (
                                rate.companyName
                              )}
                            </span>
                          </div>
                        </td>
                        <td>
                          <a
                            href={rate.website22kt || rate.websiteLink || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gr-price-link"
                          >
                            {formatCurrency2(rate.rate22kt)}
                          </a>
                        </td>
                        <td>
                          <a
                            href={rate.website24kt || rate.websiteLink || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gr-price-link"
                          >
                            {formatCurrency2(rate.rate24kt)}
                          </a>
                        </td>
                        <td>
                          <a
                            href={rate.websiteSilver || rate.websiteLink || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gr-price-link"
                          >
                            {formatCurrency2(rate.silverprice)}
                          </a>
                        </td>
                        <td style={{ fontSize: 12, color: "#777" }}>
                          {formatTime(rate.updatedTime)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
               
              </div>
 <p>
                  <strong>Note:</strong> All gold rates are excluding GST.
                </p>
              {/* Mobile cards */}
              <div
                className="mobile-cards-list"
                style={{
                  display: "none",
                  flexDirection: "column",
                  gap: 10,
                  marginTop: 14,
                }}
              >
                {tableRates.map((rate) => (
                  <div key={rate.id} className="card">
                    <div
                      style={{
                        padding: "10px 14px",
                        borderBottom: "1px solid #f0ece2",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{ fontWeight: 600, fontSize: 14, color: "#111" }}
                      >
                        {rate.companyName === "ASKOXY.AI" ? (
                          <>
                            <span style={{ color: "#810cab" }}>ASKOXY</span>
                            <span style={{ color: "#b8761c" }}>.AI</span>
                          </>
                        ) : (
                          rate.companyName
                        )}
                      </span>
                      <span style={{ fontSize: 11, color: "#777" }}>
                        {formatTime(rate.updatedTime)}
                      </span>
                    </div>
                    <div
                      style={{
                        padding: "12px 14px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      {[
                        {
                          label: "22K Gold",
                          val: rate.rate22kt,
                          href: rate.website22kt || rate.websiteLink || "#",
                        },
                        {
                          label: "24K Gold",
                          val: rate.rate24kt,
                          href: rate.website24kt || rate.websiteLink || "#",
                        },
                        {
                          label: "Silver",
                          val: rate.silverprice,
                          href: rate.websiteSilver || rate.websiteLink || "#",
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ fontSize: 13, color: "#555" }}>
                            {item.label}
                          </span>
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gr-price-link"
                            style={{ fontSize: 13.5 }}
                          >
                            {formatCurrency2(item.val)}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* end Buy Gold */}

            {/* ══════════ LEASE GOLD ══════════ */}
            <div
              ref={leaseRef}
              className="section-anchor"
              style={{ marginTop: 52 }}
            >
              <div style={{ marginBottom: 14 }}>
                <span className="section-label">Reference Rates</span>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#111",
                    letterSpacing: "-0.01em",
                    margin: 0,
                  }}
                >
                  Lease Gold
                </h2>
                <p style={{ fontSize: 13, color: "#666", marginTop: 5 }}>
                  Lease value referenced against the daily IBJA benchmark.
                </p>
              </div>

              <div
                className="two-col-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div className="card">
                  <table className="sec-table">
                    <thead>
                      <tr>
                        <th colSpan={2}>22 Karat Gold</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="td-label">IBJA Price</td>
                        <td className="td-value">
                          {fmt(ibjaRate?.rate22kt ?? null)}
                          <span className="td-sub">/g</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="card">
                  <table className="sec-table">
                    <thead>
                      <tr>
                        <th colSpan={2}>24 Karat Gold</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="td-label">IBJA Price</td>
                        <td className="td-value">
                          {fmt(ibjaRate?.rate24kt ?? null)}
                          <span className="td-sub">/g</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {ibjaRate?.silverprice && (
                <div className="card" style={{ marginTop: 12 }}>
                  <table className="sec-table">
                    <thead>
                      <tr>
                        <th colSpan={2}>Silver</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="td-label">IBJA Price</td>
                        <td className="td-value">
                          {fmt(ibjaRate.silverprice)}
                          <span className="td-sub">/kg</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {/* end Lease Gold */}

            {/* ══════════ SELL GOLD ══════════ */}
            <div
              ref={sellRef}
              className="section-anchor"
              style={{ marginTop: 52 }}
            >
              <div style={{ marginBottom: 14 }}>
                <span className="section-label">Valuation</span>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#111",
                    letterSpacing: "-0.01em",
                    margin: 0,
                  }}
                >
                  Sell Gold &amp; Silver
                </h2>
                <p style={{ fontSize: 13, color: "#666", marginTop: 5 }}>
                  Sell price based on the daily IBJA rate, minus applicable
                  charges.
                </p>
              </div>

              <div
                className="two-col-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                {/* 22K */}
                <div className="card">
                  <table className="sec-table">
                    <thead>
                      <tr>
                        <th colSpan={2}>22 Karat Gold</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="td-label">IBJA Rate</td>
                        <td className="td-value">
                          {fmt(s22Base)}
                          <span className="td-sub">/g</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="td-label">Trading Charges (2%)</td>
                        <td className="td-value" style={{ color: "#c0392b" }}>
                          − {fmt(s22Charges)}
                          <span className="td-sub">/g</span>
                        </td>
                      </tr>
                      <tr style={{ background: "#fffdf8" }}>
                        <td
                          className="td-label"
                          style={{ fontWeight: 600, color: "#111" }}
                        >
                          You Receive
                        </td>
                        <td className="td-total">
                          {fmt(s22Payable)}
                          <span className="td-sub">/g</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 24K */}
                <div className="card">
                  <table className="sec-table">
                    <thead>
                      <tr>
                        <th colSpan={2}>24 Karat Gold</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="td-label">IBJA Rate</td>
                        <td className="td-value">
                          {fmt(s24Base)}
                          <span className="td-sub">/g</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="td-label">Trading Charges (2%)</td>
                        <td className="td-value" style={{ color: "#c0392b" }}>
                          − {fmt(s24Charges)}
                          <span className="td-sub">/g</span>
                        </td>
                      </tr>
                      <tr style={{ background: "#fffdf8" }}>
                        <td
                          className="td-label"
                          style={{ fontWeight: 600, color: "#111" }}
                        >
                          You Receive
                        </td>
                        <td className="td-total">
                          {fmt(s24Payable)}
                          <span className="td-sub">/g</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Silver */}
              {ibjaRate?.silverprice && (
                <div className="card" style={{ marginTop: 12 }}>
                  <table className="sec-table">
                    <thead>
                      <tr>
                        <th colSpan={2}>Silver</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="td-label">IBJA Rate</td>
                        <td className="td-value">
                          {fmt(ibjaRate.silverprice)}
                          <span className="td-sub">/kg</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="td-label">Refining Charges (5%)</td>
                        <td className="td-value" style={{ color: "#c0392b" }}>
                          − {fmt(ibjaRate.silverprice * 0.05)}
                          <span className="td-sub">/kg</span>
                        </td>
                      </tr>
                      <tr style={{ background: "#fffdf8" }}>
                        <td
                          className="td-label"
                          style={{ fontWeight: 600, color: "#111" }}
                        >
                          You Receive
                        </td>
                        <td className="td-total">
                          {fmt(ibjaRate.silverprice * 0.95)}
                          <span className="td-sub">/kg</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {/* end Sell Gold */}

            {!loading && goldRates.length === 0 && (
              <div style={{ textAlign: "center", padding: "64px 0" }}>
                <p style={{ color: "#777", marginBottom: 16, fontSize: 13 }}>
                  No rates available right now
                </p>
                <button
                  onClick={() => fetchGoldRates(true)}
                  style={{
                    background: "#c9993a",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 22px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 13,
                    fontFamily: "inherit",
                  }}
                >
                  Retry
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <ModalContent
        showModal={showModal}
        setShowModal={setShowModal}
        mode={mode}
        setMode={setMode}
        selectedKarat={selectedKarat}
        setSelectedKarat={setSelectedKarat}
        weight={weight}
        setWeight={setWeight}
        result={result}
        setResult={setResult}
        calculatePrice={calculatePrice}
        calculateSellPrice={calculateSellPrice}
        goldRates={goldRates}
        formatCurrency2={formatCurrency2}
      />

      {showComingSoon && (
        <div
          onClick={() => setShowComingSoon(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: 32,
              maxWidth: 360,
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            }}
          >
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#111",
                marginBottom: 8,
              }}
            >
              Coming Soon
            </h2>
            <p style={{ fontSize: 13.5, color: "#555", lineHeight: 1.6 }}>
              We're working on the best gold experience. Stay tuned!
            </p>
            <button
              onClick={() => setShowComingSoon(false)}
              style={{
                marginTop: 22,
                width: "100%",
                padding: "11px",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 14,
                border: "none",
                cursor: "pointer",
                background: "linear-gradient(135deg,#c9993a,#d4a843)",
                color: "#fff",
                fontFamily: "inherit",
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* ════════ FOOTER ════════ */}
      <footer
        style={{
          borderTop: "1px solid #e8e0cc",
          padding: "22px 20px",
          textAlign: "center",
          background: "#fff",
        }}
      >
        <p style={{ fontSize: 13, color: "#555", fontWeight: 500 }}>
          © {new Date().getFullYear()} ASKOXY.AI — Gold & Silver Rates
        </p>
        <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
          Prices update regularly. Verify with jewellers before transacting.
        </p>
      </footer>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#c9993a,#e8b84a)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 14px rgba(201,153,58,0.35)",
            transition: "all 0.2s",
            zIndex: 40,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          title="Back to top"
        >
          <span style={{ fontSize: 16, color: "#fff", fontWeight: 700 }}>
            ↑
          </span>
        </button>
      )}
    </div>
  );
};

export default GoldRatesPage;