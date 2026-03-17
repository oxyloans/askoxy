import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Config";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { AlertCircle, Loader2, Download, ArrowRight } from "lucide-react";
import { toPng } from "html-to-image";
import Logo from "../assets/img/askoxylogonew.png";
import accenturelogo from "../assets/img/download.png";
import globaltechlogo from "../assets/img/global logo.png";

type StatsItem = { term: string; count: number };
type CampaignStatsResponse = {
  locationData: StatsItem[];
  experienceData: StatsItem[];
  companyName: string;
  aoiData: StatsItem[];
  createdAt: number;
  updatedAt: number;
};

const experienceOrder = [
  "Experience: 0-2 years",
  "Experience: 2-5 years",
  "Experience: 5-10 years",
  "Experience: 10-12 years",
  "Experience: 12-14 years",
];

const PIE_COLORS = ["#87CEEB", "#FFD700", "#FF6B6B", "#32CD32", "#FFB6C1"];
const BAR_COLORS_LOC = [
  "#FF6B6B","#FF8C42","#FFD93D","#6BCB77","#4D96FF",
  "#9D84B7","#FF6B9D","#00D9FF","#FFA502","#C0392B",
  "#1ABC9C","#8E44AD",
];
const BAR_COLORS_AOI = [
  "#9B59B6","#E74C3C","#F39C12","#27AE60","#3498DB",
  "#1ABC9C","#E67E22","#2ECC71","#D35400","#F1C40F",
  "#2980B9","#C0392B",
];

// Custom X-axis tick — no extra whitespace, tight rotation
const CustomXTick = ({ x, y, payload }: any) => (
  <g transform={`translate(${x},${y})`}>
    <text
      x={0}
      y={0}
      dy={10}
      textAnchor="end"
      fill="#444"
      fontSize={10}
      transform="rotate(-40)"
    >
      {payload.value.length > 13 ? payload.value.slice(0, 13) + "…" : payload.value}
    </text>
  </g>
);

const CampaignStats: React.FC = () => {
  const [stats, setStats] = useState<CampaignStatsResponse | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");
  const boardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      setStatsError("");
      const res = await fetch(`${BASE_URL}/marketing-service/campgin/stats/ACCENTURE`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStats(await res.json());
    } catch (err: any) {
      setStatsError(err.message || "Failed to load campaign statistics");
    } finally {
      setStatsLoading(false);
    }
  };

  const downloadBoard = async () => {
    try {
      if (!boardRef.current) return;
      const dataUrl = await toPng(boardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = "accenture-global-talent-landscape.png";
      link.href = dataUrl;
      link.click();
    } catch {
      alert("Unable to download board.");
    }
  };

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" });

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600 font-medium">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
          Loading campaign statistics...
        </div>
      </div>
    );
  }

  if (statsError || !stats) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-8 text-center max-w-md w-full">
          <AlertCircle className="w-10 h-10 mx-auto mb-3" />
          <p className="font-semibold">{statsError || "Unable to load data"}</p>
        </div>
      </div>
    );
  }

  const totalExp = (stats.experienceData || []).reduce(
    (sum, item) => sum + (Number(item?.count) || 0), 0
  );

  const experienceData = [...(stats.experienceData || [])]
    .sort((a, b) => experienceOrder.indexOf(a.term) - experienceOrder.indexOf(b.term))
    .map((item, i) => ({
      name: item.term.replace("Experience: ", ""),
      value: Number(item.count) || 0,
      percent: totalExp > 0 ? ((Number(item.count) / totalExp) * 100).toFixed(1) : "0.0",
      color: PIE_COLORS[i % PIE_COLORS.length],
    }));

  // Top 6 + Others for location
  const locSorted = [...(stats.locationData || [])].sort((a, b) => b.count - a.count);
  const locTop6 = locSorted.slice(0, 6);
  const locOthersCount = locSorted.slice(6).reduce((s, i) => s + (Number(i.count) || 0), 0);
  const locationData = [
    ...locTop6.map((item, i) => ({
      term: item.term,
      count: Number(item.count) || 0,
      color: BAR_COLORS_LOC[i % BAR_COLORS_LOC.length],
    })),
    ...(locOthersCount > 0 ? [{ term: "Others", count: locOthersCount, color: "#94a3b8" }] : []),
  ];

  // Top 6 + Others for AOI
  const aoiSorted = [...(stats.aoiData || [])].sort((a, b) => b.count - a.count);
  const aoiTop6 = aoiSorted.slice(0, 6);
  const aoiOthersCount = aoiSorted.slice(6).reduce((s, i) => s + (Number(i.count) || 0), 0);
  const aoiData = [
    ...aoiTop6.map((item, i) => ({
      term: item.term
        .replace("& Manufacturing", "& Mfg")
        .replace("Technology Platforms", "Tech Platforms")
        .replace("Artificial Intelligence (AI) & Data Science", "AI & Data"),
      count: Number(item.count) || 0,
      color: BAR_COLORS_AOI[i % BAR_COLORS_AOI.length],
    })),
    ...(aoiOthersCount > 0 ? [{ term: "Others", count: aoiOthersCount, color: "#94a3b8" }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* PAGE HEADER */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <img
            src={Logo}
            alt="ASKOXY"
            className="h-10 w-auto object-contain cursor-pointer"
            onClick={() => navigate("/")}
          />
          <button
            onClick={() => navigate("/accenture/jobs")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition shadow-md ring-2 ring-indigo-300"
          >
            View Accenture All Jobs
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* BOARD — download captures this entire div */}
          <div ref={boardRef} className="bg-white overflow-hidden">
            {/* PURPLE HEADER */}
            <div className="bg-gradient-to-r from-[#6b1fad] via-[#6b1fad] to-[#6b1fad] text-white px-6 sm:px-10 py-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <h1 className="text-base sm:text-xl font-bold text-center sm:text-left">
                  Accenture's Global Talent Landscape
                </h1>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <img
                    src={accenturelogo}
                    alt="Accenture"
                    className="h-16 w-48 object-contain rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* MAIN GRID — equal height columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 items-stretch">
              {/* ── LEFT COLUMN ── */}
              <div className="p-6 sm:p-8 bg-gray-50 flex flex-col">
                {/* Tagline — centered, white bg, gradient text, gradient border */}
                <div className="flex justify-center mb-5">
                  <div
                    className="bg-white rounded-full px-6 py-3 shadow-sm"
                    style={{
                      border: "2px solid transparent",
                      backgroundClip: "padding-box",
                      boxShadow: "0 0 0 2px #6366f1",
                    }}
                  >
                    <p
                      className="font-bold text-base sm:text-lg text-center"
                      style={{
                        background: "linear-gradient(90deg,#4f46e5,#06b6d4)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Understanding Demand. Delivering Talent.
                    </p>
                  </div>
                </div>

                {/* OxyGlobal Logo — centered */}
                <div className="flex justify-center mb-5">
                  <img
                    src={globaltechlogo}
                    alt="OXYGLOBAL.TECH"
                    className="h-16 w-48 object-contain rounded-sm"
                  />
                </div>

                {/* Description — centered */}
                <p className="text-sm text-gray-600 leading-relaxed mb-5 text-center">
                  AI-Powered Talent Sourcing &amp; Fulfillment Engine — Fully
                  Automated,
                  <br />
                  Human-in-the-Loop, Zero Discrimination, Talent-Based Hiring.
                </p>

                {/* Experience label — centered */}
                <div className="flex justify-center mb-4">
                  <div
                    className="px-5 py-2 rounded-full"
                    style={{
                      background: "linear-gradient(90deg,#4f46e5,#6366f1)",
                    }}
                  >
                    <p className="text-white text-sm font-semibold">
                      Experience vs Job Count
                    </p>
                  </div>
                </div>

                {/* Pie Chart — flex-1 so it fills remaining height */}
                <div className="bg-white rounded-2xl p-4 shadow-sm flex-1 flex flex-col">
                  <div className="flex-1" style={{ minHeight: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={experienceData}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius="35%"
                          outerRadius="65%"
                          paddingAngle={2}
                          labelLine={false}
                          label={({ value }) =>
                            `${((value / totalExp) * 100).toFixed(1)}%`
                          }
                        >
                          {experienceData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: any) => value.toLocaleString()}
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: 6,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legend */}
                  {/* <div className="mt-3 space-y-1.5">
                    {experienceData.map((item, i) => (
                      <div key={i} className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-gray-700 font-medium text-xs">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 text-xs">{item.percent}%</span>
                          <span className="font-semibold text-gray-800 text-xs tabular-nums">
                            {item.value.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div> */}
                </div>
              </div>

              {/* ── RIGHT COLUMN ── */}
              <div className="p-6 sm:p-8 flex flex-col gap-6">
                {/* Location Chart */}
                <div className="flex flex-col flex-1">
                  {/* Label — centered */}
                  <div className="flex justify-center mb-3">
                    <div
                      className="px-6 py-2 rounded-full font-semibold text-white text-sm"
                      style={{
                        background: "linear-gradient(90deg,#4f46e5,#6366f1)",
                      }}
                    >
                      Accenture Job Listing
                    </div>
                  </div>
                  <div
                    className="bg-white rounded-lg shadow-md p-4 flex-1"
                    style={{ minHeight: 300 }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={locationData}
                        margin={{ top: 16, right: 12, left: 0, bottom: 55 }}
                        barCategoryGap="30%"
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#ececec"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="term"
                          tick={<CustomXTick />}
                          interval={0}
                          height={58}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: "#888", fontSize: 10 }}
                          width={48}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: 6,
                            fontSize: 12,
                          }}
                          formatter={(value: any) => [
                            value.toLocaleString(),
                            "Jobs",
                          ]}
                        />
                        <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                          {locationData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Technology Chart */}
                <div className="flex flex-col flex-1">
                  {/* Label — centered */}
                  <div className="flex justify-center mb-3">
                    <div
                      className="px-6 py-2 rounded-full font-semibold text-white text-sm"
                      style={{
                        background: "linear-gradient(90deg,#4f46e5,#6366f1)",
                      }}
                    >
                      Technology Domains Distribution
                    </div>
                  </div>
                  <div
                    className="bg-white rounded-lg shadow-md p-4 flex-1"
                    style={{ minHeight: 300 }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={aoiData}
                        margin={{ top: 16, right: 12, left: 0, bottom: 55 }}
                        barCategoryGap="30%"
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#ececec"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="term"
                          tick={<CustomXTick />}
                          interval={0}
                          height={58}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: "#888", fontSize: 10 }}
                          width={48}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: 6,
                            fontSize: 12,
                          }}
                          formatter={(value: any) => [
                            value.toLocaleString(),
                            "Jobs",
                          ]}
                        />
                        <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                          {aoiData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER STRIP */}
            <div className="bg-gradient-to-r from-[#6b1fad] to-[#6b1fad] text-white py-4 px-6 sm:px-10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
                <p>
                  Source: Accenture job postings — Data as of{" "}
                  <span className="font-semibold">
                    {formatDate(stats.createdAt)}
                  </span>
                </p>
                <p className="font-semibold">
                  OXYGLOBAL.TECH: India | MENA | USA | UK | Australia | Europe
                </p>
              </div>
            </div>
          </div>
          {/* end BOARD */}

          {/* DOWNLOAD — outside board */}
          <div className="flex justify-end mt-4">
            <button
              onClick={downloadBoard}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
            >
              <Download className="w-4 h-4" />
              Download Board
            </button>
          </div>
        </div>
      </div>
     
    </div>
    
  );
};

export default CampaignStats;
