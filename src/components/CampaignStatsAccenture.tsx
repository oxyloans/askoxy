import React, { useEffect, useRef, useState } from "react";
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
} from "recharts";
import {
  Briefcase,
  MapPin,
  Clock,
  Building,
  AlertCircle,
  Loader2,
  Download,
} from "lucide-react";
import { toPng } from "html-to-image";

// ---- replace these with your real assets ----
import accenturelogo from "../assets/img/download.png";
import globaltechlogo from "../assets/img/global logo.png";

type StatsItem = {
  term: string;
  count: number;
};

type CampaignStatsResponse = {
  locationData: StatsItem[];
  createdAt: number;
  experienceData: StatsItem[];
  companyName: string;
  aoiData: StatsItem[];
  updatedAt: number;
};

type Job = {
  id: string;
  jobTitle: string;
  jobDesignation?: string;
  companyName: string;
  jobLocations: string;
  jobType: string;
  experience: string;
  description: string;
  skills: string;
  qualifications: string;
  companyLogo?: string;
  createdAt: number;
};

const PIE_COLORS = ["#ef2b1c", "#9ee9fa", "#1677ff", "#29a32a", "#ffd400"];

const LOCATION_COLORS = [
  "#27c9c3",
  "#ff5b57",
  "#ffad33",
  "#f2d13e",
  "#d8b82b",
  "#7ed641",
  "#89d748",
  "#7bc943",
  "#49d0e8",
  "#3dbad7",
  "#46d9f6",
];

const AOI_COLORS = [
  "#28c9b6",
  "#ff6256",
  "#c9a227",
  "#d8c13b",
  "#e2b800",
  "#f2cf3a",
  "#88d340",
  "#68cc4c",
  "#7fd64b",
  "#4ec3e8",
  "#4b9af4",
  "#4582f2",
  "#65caea",
  "#5dc4ec",
];

const CampaignStats: React.FC = () => {
  const [stats, setStats] = useState<CampaignStatsResponse | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState("");
  const [showJobs, setShowJobs] = useState(false);

  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      setStatsError("");

      const res = await fetch(
        `${BASE_URL}/marketing-service/campgin/stats/ACCENTURE`,
      );

      if (!res.ok) throw new Error(`Failed to load stats (HTTP ${res.status})`);

      const data: CampaignStatsResponse = await res.json();
      setStats(data);
    } catch (err: any) {
      setStatsError(err.message || "Failed to load campaign statistics");
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      setJobsLoading(true);
      setJobsError("");
      setShowJobs(true);

      const res = await fetch(
        `${BASE_URL}/marketing-service/campgin/all-jobs-by-name?companyName=ACCENTURE`,
      );

      if (!res.ok) throw new Error(`Failed to load jobs (HTTP ${res.status})`);

      const data: Job[] = await res.json();
      setJobs(data);
    } catch (err: any) {
      setJobsError(err.message || "Could not load Accenture jobs");
    } finally {
      setJobsLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
    } catch (error) {
      console.error("Download failed:", error);
      alert("Unable to download board.");
    }
  };

  // Safe total calculation
  const getTotal = (items: StatsItem[]) =>
    items.reduce((sum, item) => sum + (Number(item?.count) || 0), 0);

  const totalExperience = getTotal(stats?.experienceData || []);

  const cleanExpLabel = (term: string) => {
    const clean = term.replace(/exp\s*[:\-]?\s*/i, "").trim();
    return `Exp: ${clean}`;
  };

  // Safe experience data mapping
  const experienceData = (stats?.experienceData || []).map((item) => {
    const safeCount = Number(item?.count) || 0;
    const percent =
      totalExperience > 0
        ? ((safeCount / totalExperience) * 100).toFixed(1)
        : "0.0";
    return {
      ...item,
      count: safeCount,
      label: cleanExpLabel(item.term || "Unknown"),
      percent: `${percent}%`,
    };
  });

  const shortLocation = (term: string) => {
    const map: Record<string, string> = {
      Ahmedabad: "AMD",
      Bengaluru: "BAN",
      Bangalore: "BAN",
      Bhubaneswar: "BBSR",
      Chennai: "CHE",
      Coimbatore: "CBE",
      Gandhinagar: "GAN",
      Gurugram: "GUR",
      Gurgaon: "GUR",
      Hyderabad: "HYD",
      Indore: "IND",
      Jaipur: "JPR",
      Kolkata: "KOL",
      Mumbai: "MUM",
      Pune: "PUNE",
      Others: "OTHERS",
    };
    return map[term] || (term ? term.slice(0, 4).toUpperCase() : "UNK");
  };

  const locationData = (stats?.locationData || []).map((item) => ({
    ...item,
    count: Number(item?.count) || 0,
    short: shortLocation(item.term || "Unknown"),
  }));

  const aoiData = (stats?.aoiData || []).map((item) => ({
    ...item,
    count: Number(item?.count) || 0,
  }));

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-700 font-semibold">
          <Loader2 className="w-6 h-6 animate-spin text-violet-700" />
          Loading campaign statistics...
        </div>
      </div>
    );
  }

  if (statsError || !stats) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-red-100 text-red-600 rounded-3xl p-8 text-center shadow-sm max-w-md">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-semibold">
            {statsError || "Unable to load data"}
          </p>
        </div>
      </div>
    );
  }

  const maxLocation = Math.max(...locationData.map((i) => i.count), 0) || 10;
  const maxAoi = Math.max(...aoiData.map((i) => i.count), 0) || 10;

  return (
    <div className="min-h-screen bg-[#f8f6fa] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1700px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-6">
          <div>
            <p className="text-sm text-slate-600 font-medium">
              Company:{" "}
              <span className="ml-2 text-violet-700 font-bold">
                {stats.companyName || "ACCENTURE"}
              </span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Created: {formatDate(stats.createdAt)} | Updated:{" "}
              {formatDate(stats.updatedAt)}
            </p>
          </div>

          <button
            onClick={downloadBoard}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition"
          >
            <Download className="w-4 h-4" />
            Download Board
          </button>
        </div>

        <div
          ref={boardRef}
          className="overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-xl"
        >
          {/* HEADER */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.65fr_1fr]">
            <div className="bg-gradient-to-r from-violet-700 to-purple-800 px-6 sm:px-10 py-6 border-b xl:border-b-0 xl:border-r border-purple-600/30">
              <h4 className="text-white text-2xl sm:text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight">
                Accenture’s Global Talent Landscape
              </h4>
            </div>

            <div className="bg-white px-6 py-5 flex items-center justify-between gap-6">
              <img
                src={accenturelogo}
                alt="Accenture"
                className="h-12 sm:h-16 object-contain"
              />
              <img
                src={globaltechlogo}
                alt="OXYGLOBAL.TECH"
                className="h-12 sm:h-16 object-contain"
              />
            </div>
          </div>

          {/* BODY */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.18fr_1fr]">
            {/* LEFT – Experience Pie */}
            <div className="bg-gradient-to-b from-purple-50 to-white px-6 sm:px-10 py-6 border-r border-purple-100">
              <div className="flex justify-center mt-4 mb-6">
                <div className="bg-purple-700 text-white rounded-full px-7 py-2.5 text-lg font-semibold shadow-md">
                  Experience vs Job Count
                </div>
              </div>

              <div className="h-[320px] sm:h-[360px] lg:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={experienceData}
                      dataKey="count"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={120}
                      paddingAngle={4}
                      label={({ percent }) => percent}
                      labelLine={false}
                    >
                      {experienceData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                          stroke="#fff"
                          strokeWidth={3}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, _name, props: any) => [
                        `${value} jobs`,
                        props?.payload?.label || "Experience",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs sm:text-sm">
                {experienceData.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-white/80 border border-gray-200 rounded px-2.5 py-1.5 shadow-sm"
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                      }}
                    />
                    <span className="font-medium truncate">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT – Bars */}
            {/* RIGHT – Location + AOI bars */}
            <div className="bg-gray-50 px-6 sm:px-8 lg:px-10 py-6">
              {/* Location Distribution */}
              <div className="mb-8">
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-700 text-white rounded-full px-5 py-2 text-base font-medium shadow">
                    Location Distribution
                  </div>
                </div>

                <div className="h-[220px] sm:h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={locationData}
                      margin={{ top: 5, right: 5, left: 5, bottom: 35 }}
                    >
                      {/* MOVED defs HERE – now visible to this chart */}
                      <defs>
                        {LOCATION_COLORS.map((color, i) => (
                          <linearGradient
                            key={`loc-${i}`}
                            id={`locGradient${i}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={color}
                              stopOpacity={1}
                            />
                            <stop
                              offset="100%"
                              stopColor={color}
                              stopOpacity={0.7}
                            />
                          </linearGradient>
                        ))}
                      </defs>

                      <XAxis
                        dataKey="short"
                        tick={{ fontSize: 11, fontWeight: 600 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis hide domain={[0, maxLocation * 1.18]} />
                      <Tooltip
                        formatter={(val: number) => [`${val} jobs`, "Location"]}
                        labelFormatter={(label) =>
                          locationData.find((d) => d.short === label)?.term ||
                          label
                        }
                      />
                      <Bar dataKey="count" radius={[6, 6, 3, 3]} barSize={28}>
                        {locationData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={`url(#locGradient${i % LOCATION_COLORS.length})`}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Technology Domains */}
              <div>
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-700 text-white rounded-full px-5 py-2 text-base font-medium shadow">
                    Technology Domains
                  </div>
                </div>

                <div className="h-[220px] sm:h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={aoiData}
                      margin={{ top: 5, right: 5, left: 5, bottom: 55 }}
                    >
                      {/* MOVED defs HERE – now visible to this chart */}
                      <defs>
                        {AOI_COLORS.map((color, i) => (
                          <linearGradient
                            key={`aoi-${i}`}
                            id={`aoiGradient${i}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={color}
                              stopOpacity={1}
                            />
                            <stop
                              offset="100%"
                              stopColor={color}
                              stopOpacity={0.75}
                            />
                          </linearGradient>
                        ))}
                      </defs>

                      <XAxis
                        dataKey="term"
                        angle={-35}
                        textAnchor="end"
                        interval={0}
                        height={65}
                        tick={{ fontSize: 10, fontWeight: 600 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis hide domain={[0, maxAoi * 1.15]} />
                      <Tooltip
                        formatter={(val: number) => [`${val} jobs`, "Domain"]}
                      />
                      <Bar dataKey="count" radius={[6, 6, 3, 3]} barSize={24}>
                        {aoiData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={`url(#aoiGradient${i % AOI_COLORS.length})`}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="h-5 bg-gradient-to-r from-violet-700 to-purple-800" />
        </div>

        {/* JOBS BUTTON */}
        <div className="flex justify-center my-10">
          <button
            onClick={fetchJobs}
            disabled={jobsLoading}
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg ${
              jobsLoading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-violet-700 text-white hover:from-indigo-700 hover:to-violet-800 hover:shadow-xl"
            }`}
          >
            {jobsLoading && <Loader2 className="w-6 h-6 animate-spin" />}
            {jobsLoading ? "Loading jobs..." : "View All Accenture Jobs"}
          </button>
        </div>

        {/* JOBS SECTION */}
        {showJobs && (
          <section className="bg-white rounded-3xl shadow border border-gray-200 p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-4">
                <Briefcase className="w-8 h-8 text-indigo-600" />
                Accenture Open Positions
              </h2>
              {!jobsLoading && jobs.length > 0 && (
                <div className="text-lg text-gray-600">
                  Total Jobs:{" "}
                  <span className="font-bold text-gray-900">{jobs.length}</span>
                </div>
              )}
            </div>

            {jobsLoading && (
              <div className="flex justify-center py-20">
                <Loader2 className="w-14 h-14 text-indigo-600 animate-spin" />
              </div>
            )}

            {jobsError && (
              <div className="text-center py-20 text-red-600">
                <AlertCircle className="w-20 h-20 mx-auto mb-6 opacity-80" />
                <p className="text-2xl font-medium">{jobsError}</p>
              </div>
            )}

            {!jobsLoading && !jobsError && jobs.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                <Briefcase className="w-20 h-20 mx-auto mb-6 opacity-60" />
                <p className="text-2xl">
                  No open positions found at the moment.
                </p>
              </div>
            )}

            {jobs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {jobs.map((job) => {
                  const skills = job.skills
                    ? job.skills
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .slice(0, 4)
                    : [];

                  return (
                    <div
                      key={job.id}
                      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-indigo-400 hover:shadow-xl transition-all duration-300 flex flex-col h-full min-h-[460px]"
                    >
                      <div className="p-6 flex-1 flex flex-col items-center text-center">
                        <div className="mb-5">
                          {job.companyLogo ? (
                            <img
                              src={job.companyLogo}
                              alt={job.companyName}
                              className="w-20 h-20 object-contain rounded-xl bg-white border p-2 mx-auto"
                              onError={(e) =>
                                ((e.target as HTMLImageElement).style.display =
                                  "none")
                              }
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto">
                              <Building className="w-10 h-10 text-indigo-600" />
                            </div>
                          )}
                        </div>

                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-indigo-700 transition-colors line-clamp-2 min-h-[3rem] flex items-center">
                          {job.jobTitle ||
                            job.jobDesignation ||
                            "Open Position"}
                        </h3>

                        <p className="text-base text-gray-600 mt-2 font-medium">
                          {job.companyName}
                        </p>

                        <div className="w-full mt-6 space-y-4 text-sm text-gray-700">
                          <div className="flex items-center justify-center gap-3">
                            <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            <span className="line-clamp-1">
                              {job.jobLocations || "—"}
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-3">
                            <Clock className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            <span>{job.experience || "—"}</span>
                          </div>
                          <div className="flex items-center justify-center gap-3">
                            <Briefcase className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            <span className="capitalize">
                              {job.jobType || "—"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-8 w-full">
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-3">
                            Key Skills
                          </p>
                          <div className="grid grid-cols-2 gap-2.5">
                            {skills.length > 0 ? (
                              skills.map((skill, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs rounded-full border border-indigo-100 text-center truncate"
                                >
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <span className="col-span-2 px-4 py-2 bg-gray-100 text-gray-500 text-xs rounded-full border text-center">
                                No skills listed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-600 flex items-center justify-between">
                        <span>Posted: {formatDate(job.createdAt)}</span>
                        <span className="text-indigo-600 font-semibold group-hover:underline">
                          View details →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default CampaignStats;
