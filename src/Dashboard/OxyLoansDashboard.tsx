import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHandHoldingUsd,
  FaChartLine,
  FaUsers,
  FaExternalLinkAlt,
  FaHistory,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
} from "react-icons/fa";
import BASE_URL from "../Config";
import customerApi from "../utils/axiosInstances";

type OxyRole = "BORROWER" | "LENDER" | "PARTNER";

interface DashboardData {
  borrowerSummary?: {
    activeLoan: number;
    emiPaid: number;
    emiPending: number;
    outstandingLoan: number;
    totalLoan: number;
    totalLoans: number;
  };
  lenderSummary?: {
    activeInvestment: number;
    activeLoans: number;
    interestEarned: number;
    investedAmount: number;
    roi: number;
  };
  partnerSummary?: {
    approvedLoans: number;
    commission: number;
    rejectedLoans: number;
    totalLeads: number;
  };
}

interface UserStatus {
  borrowerRegistered: boolean;
  lenderRegistered: boolean;
  partnerRegistered: boolean;
}

interface TrackingEntry {
  role: string;
  status: string;
  registered: boolean;
  loginCount: number;
  lastLogin: string;
  registrationDate: string;
}

interface ClickEntry {
  role: string;
  source: string;
  browser: string;
  device: string;
  ipAddress: string;
  clickedAt: string;
}

interface ClickHistory {
  content: ClickEntry[];
  totalElements: number;
  totalPages: number;
  number: number;
}

const BASE = `${BASE_URL}/user-service/integration/oxyloans`;

/* ── helpers ── */
const fmt = (n: number) =>
  n >= 1_00_000
    ? `₹${(n / 1_00_000).toFixed(2)}L`
    : n >= 1000
    ? `₹${(n / 1000).toFixed(1)}K`
    : `₹${n}`;

const getBrowser = () => {
  const ua = navigator.userAgent;
  const m = ua.match(/(Edg|Chrome|Firefox|Version)\/(\d+)/);
  if (!m) return navigator.appName || "Unknown";
  const names: Record<string, string> = { Edg: "Edge", Chrome: "Chrome", Firefox: "Firefox", Version: "Safari" };
  return `${names[m[1]] || m[1]} ${m[2]}`;
};

const getDevice = () => {
  const ua = navigator.userAgent;
  const platform = navigator.platform || "Unknown";
  if (/Android/i.test(ua)) {
    const v = ua.match(/Android\s([\d.]+)/)?.[1];
    const model = ua.match(/Android[^;]*;\s*([^;)]+?)(?:\s+Build)?[;)]/)?.[1];
    return [`Android${v ? ` ${v}` : ""}`, model].filter(Boolean).join(" / ");
  }
  if (/iPhone|iPad|iPod/i.test(ua)) return `iOS / ${platform}`;
  return platform;
};

const getPublicIp = async () => {
  try {
    const r = await fetch("https://api.ipify.org?format=json");
    const b = (await r.json()) as { ip?: string };
    return b.ip || "UNKNOWN";
  } catch {
    return "UNKNOWN";
  }
};

const isAllowedRedirect = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname === "oxyloans.com" || url.hostname.endsWith(".oxyloans.com"));
  } catch {
    return false;
  }
};

/* ── sub-components ── */
const StatCard: React.FC<{ label: string; value: string | number; accent?: string }> = ({
  label, value, accent = "text-gray-900",
}) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-1 hover:shadow-md transition-shadow">
    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
    <p className={`text-2xl font-bold ${accent}`}>{value}</p>
  </div>
);

const RegistrationBadge: React.FC<{ ok: boolean; label: string }> = ({ ok, label }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
    ok ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-500 border-gray-200"
  }`}>
    {ok ? <FaCheckCircle size={10} /> : <FaTimesCircle size={10} />}
    {label}
  </span>
);

/* ── main component ── */
const OxyLoansDashboard: React.FC = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId") ?? "";

  const [activeTab, setActiveTab] = useState<OxyRole>("BORROWER");
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [tracking, setTracking] = useState<TrackingEntry[]>([]);
  const [clickHistory, setClickHistory] = useState<ClickHistory | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // per-role redirect state
  const [redirecting, setRedirecting] = useState<OxyRole | null>(null);
  const [redirectError, setRedirectError] = useState("");

  useEffect(() => {
    if (!userId) { navigate("/whatsapplogin"); return; }
    const load = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const [dashRes, statusRes, trackRes] = await Promise.all([
          customerApi.get(`${BASE}/dashboard/${userId}`),
          customerApi.get(`${BASE}/user-status/${userId}`),
          customerApi.get(`${BASE}/tracking/${userId}`),
        ]);
        setDashboard((dashRes.data as any)?.data ?? null);
        setUserStatus((statusRes.data as any)?.data ?? null);
        setTracking((trackRes.data as any)?.data ?? []);
      } catch {
        setFetchError("Failed to load OxyLoans data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [userId, navigate]);

  useEffect(() => {
    if (!userId) return;
    customerApi
      .get(`${BASE}/click-history/${userId}?pageNumber=${page}&pageSize=10`)
      .then((r) => setClickHistory((r.data as any)?.data ?? null))
      .catch(() => {});
  }, [userId, page]);

  const openPortal = useCallback(async (role: OxyRole) => {
    setRedirectError("");
    setRedirecting(role);
    try {
      const ipAddress = await getPublicIp();
      const res = await customerApi.post(
        `${BASE}/click`,
        { askoxyUserId: userId, browser: getBrowser(), device: getDevice(), ipAddress, role },
        { headers: { accept: "*/*", "Content-Type": "application/json" } }
      );
      const result = res.data as { data?: { redirectUrl?: string }; message?: string; success?: boolean };
      const redirectUrl = result.data?.redirectUrl;
      if (!result.success || !redirectUrl) throw new Error(result.message || "Could not open portal.");
      if (!isAllowedRedirect(redirectUrl)) throw new Error("Invalid redirect URL returned.");
      window.open(redirectUrl, "_blank", "noopener,noreferrer");
    } catch (e) {
      setRedirectError(e instanceof Error ? e.message : "Could not open portal. Please try again.");
    } finally {
      setRedirecting(null);
    }
  }, [userId]);

  const registeredMap: Record<OxyRole, boolean> = {
    BORROWER: userStatus?.borrowerRegistered ?? false,
    LENDER: userStatus?.lenderRegistered ?? false,
    PARTNER: userStatus?.partnerRegistered ?? false,
  };

  const tabs: { key: OxyRole; label: string; icon: React.ReactNode; color: string }[] = [
    { key: "BORROWER", label: "Borrower", icon: <FaHandHoldingUsd size={15} />, color: "purple" },
    { key: "LENDER",   label: "Lender",   icon: <FaChartLine size={15} />,      color: "blue"   },
    { key: "PARTNER",  label: "Partner",  icon: <FaUsers size={15} />,           color: "emerald"},
  ];

  const PortalButton: React.FC<{ role: OxyRole; label: string }> = ({ role, label }) => (
    <button
      onClick={() => void openPortal(role)}
      disabled={redirecting === role}
      className="inline-flex items-center gap-2 rounded-lg bg-purple-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-800 disabled:opacity-60 transition-all"
    >
      {redirecting === role ? (
        <><FaSpinner className="animate-spin" size={13} /> Opening…</>
      ) : (
        <>{label} <FaExternalLinkAlt size={12} /></>
      )}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-700 flex-shrink-0">
            <FaHandHoldingUsd size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">OxyLoans</h1>
            <p className="text-sm text-gray-500">Borrower · Lender · Partner dashboard</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["BORROWER", "LENDER", "PARTNER"] as OxyRole[]).map((r) => (
            <RegistrationBadge key={r} ok={registeredMap[r]} label={r} />
          ))}
        </div>
      </div>

      {/* ── Errors ── */}
      {fetchError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{fetchError}</div>
      )}
      {redirectError && (
        <div className="rounded-lg bg-orange-50 border border-orange-200 px-4 py-3 text-sm text-orange-700 flex items-center justify-between">
          <span>{redirectError}</span>
          <button onClick={() => setRedirectError("")} className="ml-4 text-orange-500 hover:text-orange-700 font-bold">✕</button>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === t.key
                ? "bg-white text-purple-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-purple-200 border-t-purple-700" />
          <span className="text-sm">Loading your OxyLoans data…</span>
        </div>
      ) : (
        <>
          {/* ── BORROWER TAB ── */}
          {activeTab === "BORROWER" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <StatCard label="Total Loans"   value={dashboard?.borrowerSummary?.totalLoans ?? 0} />
                <StatCard label="Active Loan"   value={dashboard?.borrowerSummary?.activeLoan ?? 0} accent="text-purple-700" />
                <StatCard label="Outstanding"   value={fmt(dashboard?.borrowerSummary?.outstandingLoan ?? 0)} accent="text-red-600" />
                <StatCard label="Total Amount"  value={fmt(dashboard?.borrowerSummary?.totalLoan ?? 0)} />
                <StatCard label="EMI Paid"      value={dashboard?.borrowerSummary?.emiPaid ?? 0} accent="text-green-600" />
                <StatCard label="EMI Pending"   value={dashboard?.borrowerSummary?.emiPending ?? 0} accent="text-orange-500" />
              </div>
              <div className="rounded-xl bg-purple-50 border border-purple-100 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-semibold text-purple-900 text-sm">Borrower Portal</p>
                  <p className="text-xs text-purple-600 mt-0.5">Apply for loans, track EMIs and manage your borrowings on OxyLoans.</p>
                </div>
                <PortalButton role="BORROWER" label="Open Borrower Portal" />
              </div>
            </div>
          )}

          {/* ── LENDER TAB ── */}
          {activeTab === "LENDER" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <StatCard label="Invested Amount"   value={fmt(dashboard?.lenderSummary?.investedAmount ?? 0)} />
                <StatCard label="Active Investment" value={fmt(dashboard?.lenderSummary?.activeInvestment ?? 0)} accent="text-purple-700" />
                <StatCard label="Active Loans"      value={dashboard?.lenderSummary?.activeLoans ?? 0} />
                <StatCard label="Interest Earned"   value={fmt(dashboard?.lenderSummary?.interestEarned ?? 0)} accent="text-green-600" />
                <StatCard label="ROI"               value={`${dashboard?.lenderSummary?.roi ?? 0}%`} accent="text-blue-600" />
              </div>
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-semibold text-blue-900 text-sm">Lender Portal</p>
                  <p className="text-xs text-blue-600 mt-0.5">Invest, track returns and manage your lending portfolio on OxyLoans.</p>
                </div>
                <PortalButton role="LENDER" label="Open Lender Portal" />
              </div>
            </div>
          )}

          {/* ── PARTNER TAB ── */}
          {activeTab === "PARTNER" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard label="Total Leads"    value={dashboard?.partnerSummary?.totalLeads ?? 0} />
                <StatCard label="Approved Loans" value={dashboard?.partnerSummary?.approvedLoans ?? 0} accent="text-green-600" />
                <StatCard label="Rejected Loans" value={dashboard?.partnerSummary?.rejectedLoans ?? 0} accent="text-red-500" />
                <StatCard label="Commission"     value={fmt(dashboard?.partnerSummary?.commission ?? 0)} accent="text-purple-700" />
              </div>
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-semibold text-emerald-900 text-sm">Partner Portal</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Manage leads, track commissions and grow your partner network on OxyLoans.</p>
                </div>
                <PortalButton role="PARTNER" label="Open Partner Portal" />
              </div>
            </div>
          )}

          {/* ── Registration Tracking ── */}
          {tracking.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <FaHistory size={13} className="text-purple-600" />
                <h2 className="text-sm font-semibold text-gray-800">Registration Tracking</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                    <tr>
                      {["Role", "Status", "Registered", "Logins", "Last Login", "Registered On"].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left font-medium whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {tracking.map((t, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-purple-700">{t.role}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            t.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                          }`}>{t.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          {t.registered
                            ? <FaCheckCircle className="text-green-500" size={15} />
                            : <FaTimesCircle className="text-gray-300" size={15} />}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{t.loginCount}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                          {t.lastLogin ? new Date(t.lastLogin).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                          {t.registrationDate ? new Date(t.registrationDate).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        
          {clickHistory && clickHistory.totalElements > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <FaHistory size={13} className="text-purple-600" />
                <h2 className="text-sm font-semibold text-gray-800">
                  Click History
                  <span className="ml-2 text-xs text-gray-400 font-normal">({clickHistory.totalElements} total)</span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                    <tr>
                      {["Role", "Source", "Browser", "Device", "IP Address", "Clicked At"].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left font-medium whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {clickHistory.content.map((c, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-purple-700">{c.role}</td>
                        <td className="px-4 py-3 text-gray-600">{c.source || "—"}</td>
                        <td className="px-4 py-3 text-gray-600">{c.browser || "—"}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate">{c.device || "—"}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{c.ipAddress || "—"}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                          {c.clickedAt ? new Date(c.clickedAt).toLocaleString() : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {clickHistory.totalPages > 1 && (
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                  <span>Page {clickHistory.number + 1} of {clickHistory.totalPages}</span>
                  <div className="flex gap-2">
                    <button
                      disabled={page === 0}
                      onClick={() => setPage((p) => p - 1)}
                      className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors text-xs font-medium"
                    >← Prev</button>
                    <button
                      disabled={page + 1 >= clickHistory.totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors text-xs font-medium"
                    >Next →</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OxyLoansDashboard;
