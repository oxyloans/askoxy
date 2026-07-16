import React, { useState, useMemo } from "react";
import { useGoogleLogin } from "@react-oauth/google";

const PROPERTY_ID = "462928986";

type Row = { path: string; views: number; users: number; sessions: number; avgTime: string };
type OverviewMetric = { label: string; value: string; color: string };

const DATE_RANGES = [
  { label: "Today", value: "today", start: "today" },
  { label: "Yesterday", value: "yesterday", start: "yesterday" },
  { label: "Last 7 Days", value: "7d", start: "7daysAgo" },
  { label: "Last 30 Days", value: "30d", start: "30daysAgo" },
  { label: "Last 90 Days", value: "90d", start: "90daysAgo" },
];

const GoogleAnalyticsDashboard: React.FC = () => {
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState<OverviewMetric[]>([]);
  const [pages, setPages] = useState<Row[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState("30d");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"views" | "users" | "sessions">("views");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [activeTab, setActiveTab] = useState<"pages" | "sources" | "devices">("pages");

  const selectedRange = DATE_RANGES.find((r) => r.value === dateRange)!;

  const runReport = async (
    accessToken: string,
    dimensions: any[],
    metrics: any[],
    limit = 250,
    startDate = selectedRange.start,
    endDate = "today"
  ) => {
    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateRanges: [{ startDate, endDate }],
          dimensions,
          metrics,
          limit,
          orderBys: metrics[0] ? [{ metric: { metricName: metrics[0].name }, desc: true }] : [],
        }),
      }
    );
    return res.json();
  };

  const fetchAll = async (accessToken: string, start = selectedRange.start) => {
    setLoading(true);
    try {
      const [overviewData, pagesData, sourcesData, devicesData] = await Promise.all([
        runReport(accessToken, [], [
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "newUsers" },
          { name: "bounceRate" },
          { name: "averageSessionDuration" },
        ], 1, start),
        runReport(accessToken, [{ name: "pagePath" }], [
          { name: "screenPageViews" },
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "averageSessionDuration" },
        ], 500, start),
        runReport(accessToken, [{ name: "sessionSource" }], [{ name: "activeUsers" }, { name: "sessions" }], 20, start),
        runReport(accessToken, [{ name: "deviceCategory" }], [{ name: "activeUsers" }, { name: "sessions" }], 10, start),
      ]);

      const mv = overviewData.rows?.[0]?.metricValues || [];
      setOverview([
        { label: "Active Users", value: Number(mv[0]?.value || 0).toLocaleString(), color: "#6366f1" },
        { label: "Sessions", value: Number(mv[1]?.value || 0).toLocaleString(), color: "#8b5cf6" },
        { label: "Page Views", value: Number(mv[2]?.value || 0).toLocaleString(), color: "#06b6d4" },
        { label: "New Users", value: Number(mv[3]?.value || 0).toLocaleString(), color: "#10b981" },
        { label: "Bounce Rate", value: `${(Number(mv[4]?.value || 0) * 100).toFixed(1)}%`, color: "#f59e0b" },
        { label: "Avg Session", value: formatDuration(Number(mv[5]?.value || 0)), color: "#ef4444" },
      ]);

      setPages(
        (pagesData.rows || []).map((row: any) => ({
          path: row.dimensionValues?.[0]?.value || "",
          views: Number(row.metricValues?.[0]?.value || 0),
          users: Number(row.metricValues?.[1]?.value || 0),
          sessions: Number(row.metricValues?.[2]?.value || 0),
          avgTime: formatDuration(Number(row.metricValues?.[3]?.value || 0)),
        }))
      );

      setSources(sourcesData.rows || []);
      setDevices(devicesData.rows || []);
    } catch (e) {
      alert("Failed to fetch analytics data. Please try again.");
    }
    setLoading(false);
  };

  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    onSuccess: async (tokenResponse) => {
      setToken(tokenResponse.access_token);
      await fetchAll(tokenResponse.access_token);
    },
    onError: () => alert("Google login failed"),
  });

  const handleDateChange = async (val: string) => {
    setDateRange(val);
    if (!token) return;
    const range = DATE_RANGES.find((r) => r.value === val)!;
    await fetchAll(token, range.start);
  };

  const toggleSort = (col: "views" | "users" | "sessions") => {
    if (sortBy === col) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortBy(col); setSortDir("desc"); }
  };

  const filteredPages = useMemo(() => {
    const q = search.toLowerCase();
    return pages
      .filter((r) => r.path.toLowerCase().includes(q))
      .sort((a, b) => sortDir === "desc" ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy]);
  }, [pages, search, sortBy, sortDir]);

  const totalViews = pages.reduce((s, r) => s + r.views, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #1e1b4b 100%)", padding: "28px 24px 24px", color: "#fff" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>
                📊 ASKOXY Analytics Dashboard
              </h1>
              <p style={{ margin: "6px 0 0", fontSize: 13, opacity: 0.8 }}>
                All tracked paths · Google Analytics GA4 · Property {PROPERTY_ID}
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              {token && (
                <select
                  value={dateRange}
                  onChange={(e) => handleDateChange(e.target.value)}
                  style={{ padding: "8px 14px", borderRadius: 10, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: "rgba(255,255,255,0.15)", color: "#fff" }}
                >
                  {DATE_RANGES.map((r) => (
                    <option key={r.value} value={r.value} style={{ color: "#1e1b4b" }}>{r.label}</option>
                  ))}
                </select>
              )}
              <button
                onClick={() => login()}
                style={{ padding: "10px 22px", borderRadius: 12, border: "none", background: "#fff", color: "#4f46e5", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
              >
                {token ? "🔄 Reconnect" : "🔗 Connect Analytics"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 16px" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            <p style={{ color: "#64748b", fontSize: 16 }}>Loading analytics data...</p>
          </div>
        )}

        {!loading && overview.length > 0 && (
          <>
            {/* Overview Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
              {overview.map((m) => (
                <div key={m.label} style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", borderTop: `4px solid ${m.color}` }}>
                  <p style={{ margin: 0, fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{m.label}</p>
                  <h2 style={{ margin: "8px 0 0", fontSize: 28, fontWeight: 800, color: "#0f172a" }}>{m.value}</h2>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {(["pages", "sources", "devices"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "8px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13,
                    background: activeTab === tab ? "#4f46e5" : "#fff",
                    color: activeTab === tab ? "#fff" : "#64748b",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                    textTransform: "capitalize",
                  }}
                >
                  {tab === "pages" ? `📄 All Pages (${pages.length})` : tab === "sources" ? "🌐 Sources" : "📱 Devices"}
                </button>
              ))}
            </div>

            {/* Pages Tab */}
            {activeTab === "pages" && (
              <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden" }}>
                <div style={{ padding: "18px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#0f172a", flex: 1 }}>
                    All Tracked Paths
                    <span style={{ marginLeft: 10, fontSize: 13, fontWeight: 500, color: "#64748b" }}>
                      {filteredPages.length} paths · {totalViews.toLocaleString()} total views
                    </span>
                  </h2>
                  <input
                    placeholder="🔍 Search path..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13, width: 220, outline: "none" }}
                  />
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#f8fafc" }}>
                        <th style={{ padding: "12px 16px", textAlign: "left", color: "#64748b", fontWeight: 600, width: 40 }}>#</th>
                        <th style={{ padding: "12px 16px", textAlign: "left", color: "#64748b", fontWeight: 600 }}>Page Path</th>
                        <th style={{ padding: "12px 16px", textAlign: "right", color: "#64748b", fontWeight: 600, cursor: "pointer", userSelect: "none" }} onClick={() => toggleSort("views")}>
                          Views {sortBy === "views" ? (sortDir === "desc" ? "↓" : "↑") : "↕"}
                        </th>
                        <th style={{ padding: "12px 16px", textAlign: "right", color: "#64748b", fontWeight: 600, cursor: "pointer", userSelect: "none" }} onClick={() => toggleSort("users")}>
                          Users {sortBy === "users" ? (sortDir === "desc" ? "↓" : "↑") : "↕"}
                        </th>
                        <th style={{ padding: "12px 16px", textAlign: "right", color: "#64748b", fontWeight: 600, cursor: "pointer", userSelect: "none" }} onClick={() => toggleSort("sessions")}>
                          Sessions {sortBy === "sessions" ? (sortDir === "desc" ? "↓" : "↑") : "↕"}
                        </th>
                        <th style={{ padding: "12px 16px", textAlign: "right", color: "#64748b", fontWeight: 600 }}>Avg Time</th>
                        <th style={{ padding: "12px 16px", textAlign: "right", color: "#64748b", fontWeight: 600 }}>% of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPages.map((row, i) => {
                        const pct = totalViews > 0 ? (row.views / totalViews) * 100 : 0;
                        return (
                          <tr key={row.path} style={{ borderTop: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                            <td style={{ padding: "10px 16px", color: "#94a3b8", fontWeight: 500 }}>{i + 1}</td>
                            <td style={{ padding: "10px 16px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontFamily: "monospace", color: "#1e293b", fontWeight: 500, wordBreak: "break-all" }}>{row.path}</span>
                                <a
                                  href={`https://www.askoxy.ai${row.path}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: "#6366f1", fontSize: 11, textDecoration: "none", flexShrink: 0 }}
                                >
                                  ↗
                                </a>
                              </div>
                              <div style={{ marginTop: 4, height: 3, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${Math.min(pct * 3, 100)}%`, background: "linear-gradient(90deg, #6366f1, #8b5cf6)", borderRadius: 99 }} />
                              </div>
                            </td>
                            <td style={{ padding: "10px 16px", textAlign: "right", fontWeight: 700, color: "#0f172a" }}>{row.views.toLocaleString()}</td>
                            <td style={{ padding: "10px 16px", textAlign: "right", color: "#334155" }}>{row.users.toLocaleString()}</td>
                            <td style={{ padding: "10px 16px", textAlign: "right", color: "#334155" }}>{row.sessions.toLocaleString()}</td>
                            <td style={{ padding: "10px 16px", textAlign: "right", color: "#64748b" }}>{row.avgTime}</td>
                            <td style={{ padding: "10px 16px", textAlign: "right" }}>
                              <span style={{ background: "#ede9fe", color: "#6d28d9", padding: "2px 8px", borderRadius: 99, fontSize: 12, fontWeight: 600 }}>
                                {pct.toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredPages.length === 0 && (
                        <tr>
                          <td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>No paths found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sources Tab */}
            {activeTab === "sources" && (
              <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden" }}>
                <div style={{ padding: "18px 20px", borderBottom: "1px solid #f1f5f9" }}>
                  <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#0f172a" }}>Traffic Sources</h2>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      <th style={{ padding: "12px 20px", textAlign: "left", color: "#64748b", fontWeight: 600 }}>Source</th>
                      <th style={{ padding: "12px 20px", textAlign: "right", color: "#64748b", fontWeight: 600 }}>Users</th>
                      <th style={{ padding: "12px 20px", textAlign: "right", color: "#64748b", fontWeight: 600 }}>Sessions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sources.map((row, i) => (
                      <tr key={i} style={{ borderTop: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "12px 20px", fontWeight: 600, color: "#1e293b" }}>{row.dimensionValues?.[0]?.value || "(direct)"}</td>
                        <td style={{ padding: "12px 20px", textAlign: "right", fontWeight: 700 }}>{Number(row.metricValues?.[0]?.value || 0).toLocaleString()}</td>
                        <td style={{ padding: "12px 20px", textAlign: "right", color: "#64748b" }}>{Number(row.metricValues?.[1]?.value || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Devices Tab */}
            {activeTab === "devices" && (
              <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden" }}>
                <div style={{ padding: "18px 20px", borderBottom: "1px solid #f1f5f9" }}>
                  <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#0f172a" }}>Device Breakdown</h2>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      <th style={{ padding: "12px 20px", textAlign: "left", color: "#64748b", fontWeight: 600 }}>Device</th>
                      <th style={{ padding: "12px 20px", textAlign: "right", color: "#64748b", fontWeight: 600 }}>Users</th>
                      <th style={{ padding: "12px 20px", textAlign: "right", color: "#64748b", fontWeight: 600 }}>Sessions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.map((row, i) => (
                      <tr key={i} style={{ borderTop: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "12px 20px", fontWeight: 600, color: "#1e293b", textTransform: "capitalize" }}>
                          {row.dimensionValues?.[0]?.value === "mobile" ? "📱" : row.dimensionValues?.[0]?.value === "desktop" ? "🖥️" : "📟"} {row.dimensionValues?.[0]?.value}
                        </td>
                        <td style={{ padding: "12px 20px", textAlign: "right", fontWeight: 700 }}>{Number(row.metricValues?.[0]?.value || 0).toLocaleString()}</td>
                        <td style={{ padding: "12px 20px", textAlign: "right", color: "#64748b" }}>{Number(row.metricValues?.[1]?.value || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {!loading && !token && (
          <div style={{ textAlign: "center", padding: 80, background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📊</div>
            <h2 style={{ color: "#1e293b", marginBottom: 8 }}>Connect to Google Analytics</h2>
            <p style={{ color: "#64748b", marginBottom: 24 }}>Click "Connect Analytics" above to view all tracked paths and metrics.</p>
          </div>
        )}
      </div>
    </div>
  );
};

function formatDuration(seconds: number): string {
  if (!seconds || seconds < 1) return "0s";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default GoogleAnalyticsDashboard;
