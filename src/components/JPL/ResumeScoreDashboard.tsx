import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import BASE_URL from "../../Config";

type SectionScores = Record<string, number>;

type AtsReport = {
  overallATSScore: number;
  atsGrade: string;
  atsFriendliness: string;
  resumeCompletenessScore: number;
  professionalismScore: number;
  readabilityScore: number;
  sectionScores: SectionScores;
  analysis: Record<string, string>;
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
  finalReview: string;
};

type ResumeRecord = {
  jobId: string;
  status: string;
  originalFilename: string;
  atsReport: AtsReport | null;
  atsErrorMessage: string | null;
  createdAt: number;
  updatedAt: number;
  resumeUrl: string | null;
};

const RESUME_STATUS_API = `${BASE_URL}/marketing-service/campign/status`;

const ScoreBar = ({ label, value }: { label: string; value: number }) => (
  <div className="mb-2">
    <div className="flex justify-between text-xs mb-1">
      <span className="capitalize text-slate-600">{label}</span>
      <span className="font-bold text-slate-800">{value}/10</span>
    </div>
    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
        style={{ width: `${value * 10}%` }}
      />
    </div>
  </div>
);

const gradeColor: Record<string, string> = {
  A: "text-green-700 bg-green-100",
  B: "text-blue-700 bg-blue-100",
  C: "text-amber-700 bg-amber-100",
  D: "text-red-700 bg-red-100",
};

const ResumeScoreDashboard: React.FC = () => {
  const [records, setRecords] = useState<ResumeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const userId = localStorage.getItem("userId");

  const fetchRecords = async () => {
    if (!userId) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${RESUME_STATUS_API}?userId=${userId}`, {
        headers: { accept: "*/*" },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: ResumeRecord[] = await res.json();
      setRecords(data);
    } catch {
      setError("Failed to load resume history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const statusBadge = (status: string) => {
    if (status === "COMPLETED")
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
          <CheckCircle className="h-3 w-3" /> Completed
        </span>
      );
    if (status === "FAILED" || status === "REJECTED")
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
          <AlertCircle className="h-3 w-3" /> {status}
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
        <Clock className="h-3 w-3" /> {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f7f4] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0f172a] sm:text-3xl">
              Resume Score History
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              All your resume ATS analysis results
            </p>
          </div>
          <button
            onClick={fetchRecords}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-[#1d4ed8] shadow-sm transition hover:bg-blue-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-400" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-sm text-red-600">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && records.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-blue-200 bg-white py-20 text-center">
            <FileText className="mb-3 h-12 w-12 text-blue-200" />
            <p className="text-base font-bold text-slate-500">No resumes analyzed yet</p>
            <p className="mt-1 text-sm text-slate-400">
              Upload a resume from the AI Interview page to get started.
            </p>
          </div>
        )}

        {/* Records */}
        {!loading && !error && records.length > 0 && (
          <div className="space-y-4">
            {records.map((rec, idx) => {
              const isOpen = expandedId === rec.jobId;
              const report = rec.atsReport;
              const grade = report?.atsGrade ?? "";

              return (
                <motion.div
                  key={rec.jobId}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="overflow-hidden rounded-2xl border border-white bg-white shadow-sm"
                >
                  {/* Card header */}
                  <button
                    onClick={() => setExpandedId(isOpen ? null : rec.jobId)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                        <FileText className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-800">
                          {rec.originalFilename || "Resume"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(rec.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      {report && (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black text-[#1d4ed8]">
                            {report.overallATSScore}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-extrabold ${
                              gradeColor[grade] ?? "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {grade}
                          </span>
                        </div>
                      )}
                      {statusBadge(rec.status)}
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded detail */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-slate-100 px-5 pb-6 pt-4">
                          {rec.status !== "COMPLETED" || !report ? (
                            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                              <AlertCircle className="h-4 w-4 shrink-0" />
                              {rec.atsErrorMessage || "No ATS report available."}
                            </div>
                          ) : (
                            <div className="space-y-5">
                              {/* Score summary */}
                              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {[
                                  { label: "ATS Score", value: `${report.overallATSScore}/100` },
                                  { label: "Completeness", value: `${report.resumeCompletenessScore}/10` },
                                  { label: "Professionalism", value: `${report.professionalismScore}/10` },
                                  { label: "Readability", value: `${report.readabilityScore}/10` },
                                ].map((s) => (
                                  <div
                                    key={s.label}
                                    className="rounded-xl bg-blue-50 p-3 text-center"
                                  >
                                    <p className="text-lg font-black text-[#1d4ed8]">{s.value}</p>
                                    <p className="text-[10px] font-bold text-slate-500">{s.label}</p>
                                  </div>
                                ))}
                              </div>

                              {/* Friendliness */}
                              <div className="flex items-center gap-2">
                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                                  {report.atsFriendliness}
                                </span>
                              </div>

                              {/* Section scores */}
                              <div>
                                <h4 className="mb-3 text-sm font-extrabold text-slate-700">
                                  Section Scores
                                </h4>
                                {Object.entries(report.sectionScores).map(([k, v]) => (
                                  <ScoreBar key={k} label={k} value={v} />
                                ))}
                              </div>

                              {/* Strengths */}
                              <div className="rounded-2xl bg-green-50 p-4">
                                <h4 className="mb-2 flex items-center gap-1.5 text-sm font-extrabold text-green-700">
                                  <CheckCircle className="h-4 w-4" /> Strengths
                                </h4>
                                <ul className="space-y-1">
                                  {report.strengths.map((s, i) => (
                                    <li key={i} className="text-xs text-green-800">
                                      • {s}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Weaknesses */}
                              <div className="rounded-2xl bg-red-50 p-4">
                                <h4 className="mb-2 flex items-center gap-1.5 text-sm font-extrabold text-red-700">
                                  <AlertCircle className="h-4 w-4" /> Weaknesses
                                </h4>
                                <ul className="space-y-1">
                                  {report.weaknesses.map((w, i) => (
                                    <li key={i} className="text-xs text-red-800">
                                      • {w}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Suggestions */}
                              <div className="rounded-2xl bg-amber-50 p-4">
                                <h4 className="mb-2 text-sm font-extrabold text-amber-700">
                                  Improvement Suggestions
                                </h4>
                                <ul className="space-y-1">
                                  {report.improvementSuggestions.map((s, i) => (
                                    <li key={i} className="text-xs text-amber-800">
                                      • {s}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Final review */}
                              <div className="rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-600">
                                <span className="font-bold text-slate-700">Final Review: </span>
                                {report.finalReview}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeScoreDashboard;
