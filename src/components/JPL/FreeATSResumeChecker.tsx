import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import BASE_URL from "../../Config";
import Logo from "../../assets/img/askoxylogonew.png";
const API_BASE = `${BASE_URL}/marketing-service/campgin`;

type AtsReport = {
  overallATSScore: number;
  atsGrade: string;
  atsFriendliness: string;
  resumeCompletenessScore: number;
  professionalismScore: number;
  readabilityScore: number;
  sectionScores: Record<string, number>;
  analysis: Record<string, string>;
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
  finalReview: string;
};

type ResumeStatusResponse = {
  jobId: string;
  status: string;
  originalFilename: string;
  message?: string;
  atsReport: AtsReport | null;
  atsErrorMessage: string | null;
  createdAt?: number;
  updatedAt?: number;
  resumeUrl?: string | null;
};

type ResumeRecord = ResumeStatusResponse & {
  createdAt: number;
  updatedAt: number;
  resumeUrl: string | null;
};

type ParseResumeResponse = {
  jobId: string | null;
  status: string;
  message: string;
};

type StatusType = "idle" | "loading" | "success" | "error";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isValidUserId = (value: string): boolean => {
  const trimmed = value.trim();
  return (
    !!trimmed && !trimmed.startsWith("guest_") && UUID_PATTERN.test(trimmed)
  );
};

const resolveUserId = (): string => {
  const fromLogin = localStorage.getItem("userId")?.trim() || "";
  if (isValidUserId(fromLogin)) return fromLogin;

  const fromUrl =
    new URLSearchParams(window.location.search).get("userId")?.trim() || "";
  if (isValidUserId(fromUrl)) return fromUrl;

  return "";
};

const clearStaleGuestIds = () => {
  sessionStorage.removeItem("guestUserId");
  sessionStorage.removeItem("atsCheckerUserId");

  const storedUserId = localStorage.getItem("userId")?.trim();
  if (storedUserId?.startsWith("guest_")) {
    localStorage.removeItem("userId");
  }
};

const formatLabel = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();

const ScoreMetric = ({
  label,
  value,
  max = 10,
  delay = 0,
}: {
  label: string;
  value: number;
  max?: number;
  delay?: number;
}) => {
  const numeric = Number(value) || 0;
  const percent = Math.min(100, Math.round((numeric / max) * 100));

  return (
    <motion.div
      className="ats-metric"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="ats-metric-top">
        <span>{label}</span>
        <span>
          {numeric}/{max}
        </span>
      </div>
      <div className="ats-bar">
        <motion.i
          className="block h-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg, #1a56db 0%, #0891b2 55%, #10b981 100%)",
          }}
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: delay + 0.15, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};

const ReportList = ({
  items,
  type,
}: {
  items: string[];
  type: "good" | "warn" | "idea";
}) => (
  <ul className={`ats-list ${type}`}>
    {(items?.length ? items : ["No items reported."]).map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

const ATSResumeChecker: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileNameText, setFileNameText] = useState("");
  const userId = resolveUserId();
  const [isDragging, setIsDragging] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<StatusType>("idle");
  const [reportData, setReportData] = useState<ResumeStatusResponse | null>(
    null,
  );
  const [showResults, setShowResults] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [historyRecords, setHistoryRecords] = useState<ResumeRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  const fetchHistory = useCallback(async (activeUserId: string) => {
    const trimmed = activeUserId.trim();
    if (!trimmed || !isValidUserId(trimmed)) {
      setHistoryRecords([]);
      setHistoryError("");
      return;
    }

    setHistoryLoading(true);
    setHistoryError("");
    try {
      const response = await fetch(
        `${API_BASE}/status?userId=${encodeURIComponent(trimmed)}`,
        { headers: { accept: "*/*" } },
      );
      if (!response.ok)
        throw new Error(`Unable to load history (${response.status})`);
      const data: ResumeRecord[] = await response.json();
      setHistoryRecords(Array.isArray(data) ? data : []);
    } catch {
      setHistoryError("Could not load resume history for this User ID.");
      setHistoryRecords([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    clearStaleGuestIds();
    const initialUserId = resolveUserId();
    if (initialUserId) fetchHistory(initialUserId);

    const onScroll = () => setHeaderScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [fetchHistory]);

  const setStatus = (message: string, type: StatusType) => {
    setStatusMessage(message);
    setStatusType(type);
  };

  const setFile = (file: File | undefined) => {
    setSelectedFile(null);
    setStatus("", "idle");
    if (!file) return;

    const valid = /\.(pdf|doc|docx)$/i.test(file.name);
    if (!valid) {
      setFileNameText("Please select a PDF or DOCX file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileNameText("File must be smaller than 5 MB.");
      return;
    }

    setSelectedFile(file);
    setFileNameText(`✓ ${file.name}`);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileNameText("");
    setStatus("", "idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const getStatus = useCallback(
    async (jobId: string): Promise<ResumeStatusResponse> => {
      for (let attempt = 0; attempt < 30; attempt++) {
        const response = await fetch(
          `${API_BASE}/status/${encodeURIComponent(jobId)}`,
          {
            headers: { accept: "*/*" },
          },
        );
        const data: ResumeStatusResponse = await response.json().catch(() => ({
          jobId,
          status: "ERROR",
          originalFilename: "",
          atsReport: null,
          atsErrorMessage: null,
        }));

        if (!response.ok) {
          throw new Error(
            data.message ||
              data.atsErrorMessage ||
              "Unable to retrieve the ATS report.",
          );
        }

        if (data.status === "COMPLETED") {
          if (!data.atsReport) {
            throw new Error(
              data.atsErrorMessage || "ATS report was not generated.",
            );
          }
          return data;
        }

        if (["REJECTED", "FAILED", "ERROR"].includes(data.status)) {
          throw new Error(
            data.message || data.atsErrorMessage || "Resume analysis failed.",
          );
        }

        setStatus(`Analyzing your resume… ${attempt + 1}/30`, "loading");
        await wait(2000);
      }

      throw new Error(
        "Analysis is taking longer than expected. Please try again shortly.",
      );
    },
    [],
  );

  const viewHistoryReport = (record: ResumeRecord) => {
    if (record.status !== "COMPLETED" || !record.atsReport) {
      setStatus(
        record.atsErrorMessage || "No ATS report available for this resume.",
        "error",
      );
      return;
    }
    setReportData(record);
    setActiveJobId(record.jobId);
    setShowResults(true);
    setStatus("Showing saved ATS report.", "success");
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleCheck = async () => {
    if (!selectedFile) {
      setFileNameText("Please upload your resume first.");
      return;
    }

    const activeUserId = resolveUserId().trim();
    if (!activeUserId) {
      setStatus(
        "Your user session is unavailable. Please return and open Resume AI Interview again.",
        "error",
      );
      return;
    }
    if (!isValidUserId(activeUserId)) {
      setStatus(
        "Your user session is invalid. Please return and open Resume AI Interview again.",
        "error",
      );
      return;
    }

    setIsChecking(true);
    setShowResults(false);
    setReportData(null);
    setActiveJobId(null);

    try {
      const form = new FormData();
      const isPdf = /\.pdf$/i.test(selectedFile.name);
      form.append(
        "resume",
        isPdf
          ? new Blob([selectedFile], { type: "application/pdf" })
          : selectedFile,
        selectedFile.name,
      );

      setStatus("Uploading your resume securely…", "loading");

      const response = await fetch(
        `${API_BASE}/parse-resume?userId=${encodeURIComponent(activeUserId)}`,
        {
          method: "POST",
          headers: { accept: "*/*" },
          body: form,
        },
      );

      const upload: ParseResumeResponse = await response.json().catch(() => ({
        jobId: null,
        status: "FAILED",
        message: "Invalid server response.",
      }));

      if (upload.status === "REJECTED" || !upload.jobId) {
        throw new Error(
          upload.message ||
            "Resume upload was rejected. Please verify your ASKOXY.AI User ID is registered.",
        );
      }

      setStatus(
        upload.status === "COMPLETED"
          ? "Preparing your ATS report…"
          : "Resume uploaded. Analysis is in progress…",
        "loading",
      );

      const completed = await getStatus(upload.jobId);
      setReportData(completed);
      setActiveJobId(completed.jobId);
      setShowResults(true);
      setStatus("Resume analyzed successfully.", "success");
      fetchHistory(activeUserId);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      const mixed =
        window.location.protocol === "https:" && API_BASE.startsWith("http:");
      setStatus(
        mixed
          ? "The browser blocked the HTTP API on this HTTPS website. Configure an HTTPS API domain or reverse proxy."
          : error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        "error",
      );
    } finally {
      setIsChecking(false);
    }
  };

  const report = reportData?.atsReport;
  const score = Math.max(
    0,
    Math.min(100, Number(report?.overallATSScore) || 0),
  );
  const sectionEntries = Object.entries(report?.sectionScores || {});
  const analysisEntries = Object.entries(report?.analysis || {});
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <style>{`
        :root {
          --primary: #1a56db;
          --primary-dark: #1e429f;
          --primary-light: #3b82f6;
          --accent: #0891b2;
          --accent-soft: #06b6d4;
          --dark: #0f172a;
          --dark-soft: #1e293b;
          --green: #059669;
          --green-light: #10b981;
          --muted: #64748b;
          --muted-light: #94a3b8;
          --line: #e2e8f0;
          --soft: #f8fafc;
          --surface: #ffffff;
          --gold: #d97706;
        }
        .ats-page {
          font-family: Inter, "Segoe UI", system-ui, Arial, sans-serif;
          color: var(--dark);
          line-height: 1.55;
          background: var(--surface);
        }
        .ats-container { width: min(1120px, calc(100% - 32px)); margin: auto; }
        html { scroll-behavior: smooth; scroll-padding-top: 84px; }
        .ats-page *, .ats-page *::before, .ats-page *::after { box-sizing: border-box; }
        .ats-btn {
          border: 0;
          border-radius: 12px;
          padding: 12px 20px;
          cursor: pointer;
          font-weight: 700;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
          font-size: inherit;
          letter-spacing: -0.01em;
        }
        .ats-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(26, 86, 219, 0.22);
        }
        .ats-btn:active:not(:disabled) { transform: translateY(0); }
        .ats-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .ats-btn:focus-visible, .ats-nav-link:focus-visible, .ats-dropzone:focus-within,
        .ats-history-item:focus-visible, .ats-faq summary:focus-visible {
          outline: 3px solid rgba(59, 130, 246, 0.35);
          outline-offset: 3px;
        }
        .ats-btn-primary {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: #fff;
          box-shadow: 0 4px 14px rgba(26, 86, 219, 0.28);
        }
        .ats-btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
        }
        .ats-btn-outline {
          background: var(--surface);
          color: var(--primary);
          border: 1.5px solid var(--primary);
        }
        .ats-btn-outline:hover:not(:disabled) {
          background: #eff6ff;
        }
        .ats-brand {
          font-weight: 800;
          font-size: 22px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
        }
        .ats-logo { width: auto; height: 44px; max-width: 190px; object-fit: contain; }
        .ats-footer-link { color: #cbd5e1; text-decoration: none; transition: color .2s ease; }
        .ats-footer-link:hover { color: #67e8f9; }
        .ats-nav-link {
          color: var(--dark-soft);
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          position: relative;
          transition: color 0.2s ease;
        }
        .ats-nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          border-radius: 2px;
          transition: width 0.25s ease;
        }
        .ats-nav-link:hover { color: var(--primary); }
        .ats-nav-link:hover::after { width: 100%; }
        .ats-eyebrow {
          display: inline-block;
          background: linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%);
          color: var(--primary-dark);
          border: 1px solid #bfdbfe;
          border-radius: 99px;
          padding: 7px 14px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .ats-hero-bg {
          background:
            radial-gradient(ellipse 80% 50% at 90% 0%, rgba(59, 130, 246, 0.12) 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 0% 100%, rgba(8, 145, 178, 0.1) 0%, transparent 50%),
            linear-gradient(160deg, #f8fafc 0%, #eff6ff 45%, #f0fdfa 100%);
        }
        .ats-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
          animation: ats-float 8s ease-in-out infinite;
        }
        .ats-orb-1 { width: 280px; height: 280px; top: -80px; right: -60px; background: rgba(59, 130, 246, 0.15); }
        .ats-orb-2 { width: 220px; height: 220px; bottom: 20px; left: -40px; background: rgba(8, 145, 178, 0.12); animation-delay: -3s; }
        @keyframes ats-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(12px, -16px) scale(1.05); }
        }
        .ats-upload-card {
          border: 1px solid var(--line);
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(12px);
          box-shadow: 0 24px 64px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255,255,255,0.8) inset;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        .ats-upload-card:hover {
          box-shadow: 0 32px 72px rgba(26, 86, 219, 0.12), 0 0 0 1px rgba(255,255,255,0.9) inset;
        }
        .ats-dropzone {
          border: 2px dashed #cbd5e1;
          background: linear-gradient(180deg, var(--soft) 0%, #f1f5f9 100%);
          border-radius: 16px;
          padding: 30px 16px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
          display: block;
        }
        .ats-dropzone:hover, .ats-dropzone.drag {
          border-color: var(--primary-light);
          background: linear-gradient(180deg, #eff6ff 0%, #ecfeff 100%);
          transform: scale(1.01);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.12);
        }
        .ats-upload-icon {
          width: 56px;
          height: 56px;
          margin: 0 auto 12px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: linear-gradient(135deg, #dbeafe 0%, #cffafe 100%);
          color: var(--primary);
          font-size: 24px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
          transition: transform 0.3s ease;
        }
        .ats-dropzone:hover .ats-upload-icon, .ats-dropzone.drag .ats-upload-icon {
          transform: translateY(-3px);
        }
        .ats-text-input {
          width: 100%;
          border: 1.5px solid var(--line);
          border-radius: 12px;
          padding: 12px 14px;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .ats-text-input:focus {
          border-color: var(--primary-light);
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
        }
        .ats-status-box {
          margin-top: 14px;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          animation: ats-fade-in 0.35s ease;
        }
        .ats-status-box.loading { color: #1e40af; background: #eff6ff; border: 1px solid #bfdbfe; }
        .ats-status-box.error { color: #b91c1c; background: #fef2f2; border: 1px solid #fecaca; }
        .ats-status-box.success { color: #047857; background: #ecfdf5; border: 1px solid #a7f3d0; }
        .ats-card {
          border: 1px solid var(--line);
          border-radius: 18px;
          background: var(--surface);
          box-shadow: 0 4px 24px rgba(15, 23, 42, 0.06);
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        .ats-card:hover { box-shadow: 0 12px 36px rgba(15, 23, 42, 0.08); }
        .ats-score-ring {
          width: 180px;
          height: 180px;
          margin: 5px auto 18px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          position: relative;
          animation: ats-score-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes ats-score-pop {
          0% { transform: scale(0.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .ats-score-ring::after {
          content: '';
          position: absolute;
          inset: 14px;
          background: #fff;
          border-radius: 50%;
          box-shadow: inset 0 2px 8px rgba(15, 23, 42, 0.04);
        }
        .ats-score-value {
          z-index: 1;
          text-align: center;
          font-size: 46px;
          font-weight: 800;
          background: linear-gradient(135deg, var(--green) 0%, var(--green-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }
        .ats-score-value small {
          display: block;
          font-size: 11px;
          color: var(--muted);
          margin-top: 7px;
          font-weight: 700;
          letter-spacing: 0.08em;
          -webkit-text-fill-color: var(--muted);
        }
        .ats-metric {
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 16px;
          background: linear-gradient(180deg, #fff 0%, var(--soft) 100%);
        }
        .ats-metric-top {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          font-weight: 700;
          font-size: 14px;
          color: var(--dark-soft);
        }
        .ats-metric-top span:last-child { color: var(--primary); font-weight: 800; }
        .ats-bar {
          height: 8px;
          background: #e2e8f0;
          border-radius: 99px;
          margin-top: 12px;
          overflow: hidden;
        }
        .ats-bar i, .ats-bar motion-i { display: block; height: 100%; background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 55%, var(--green-light) 100%); border-radius: inherit; }
        .ats-grade {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 44px;
          height: 32px;
          padding: 0 12px;
          border-radius: 99px;
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          color: #047857;
          font-weight: 800;
          border: 1px solid #a7f3d0;
        }
        .ats-list { margin: 0; padding: 0; list-style: none; }
        .ats-list li {
          position: relative;
          padding: 10px 0 10px 27px;
          border-top: 1px solid #f1f5f9;
          color: var(--dark-soft);
          font-size: 14px;
          animation: ats-fade-in 0.4s ease both;
        }
        .ats-list li:first-child { border-top: 0; }
        .ats-list li::before { position: absolute; left: 0; top: 10px; font-weight: 800; }
        .ats-list.good li::before { content: '✓'; color: var(--green); }
        .ats-list.warn li::before { content: '!'; color: var(--gold); }
        .ats-list.idea li::before { content: '→'; color: var(--primary); }
        .ats-analysis-item {
          border-left: 3px solid var(--primary-light);
          background: linear-gradient(90deg, #f8fafc 0%, #fff 100%);
          border-radius: 0 12px 12px 0;
          padding: 14px 16px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .ats-analysis-item:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
        }
        .ats-analysis-item strong { display: block; text-transform: capitalize; margin-bottom: 4px; color: var(--dark); }
        .ats-analysis-item span { color: var(--muted); font-size: 14px; line-height: 1.6; }
        .ats-feature-card {
          border: 1px solid var(--line);
          border-radius: 16px;
          background: var(--surface);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .ats-feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(26, 86, 219, 0.1);
          border-color: #bfdbfe;
        }
        .ats-step-card {
          border: 1px solid var(--line);
          background: var(--surface);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .ats-step-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(26, 86, 219, 0.1);
          border-color: #bfdbfe;
        }
        .ats-step-num {
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
          box-shadow: 0 4px 12px rgba(26, 86, 219, 0.25);
          color: #fff;
        }
        .ats-cta-panel {
          border: 1px solid #bfdbfe;
          background: linear-gradient(135deg, #eff6ff 0%, #f8fafc 55%, #ecfeff 100%);
          border-radius: 24px;
          box-shadow: 0 16px 48px rgba(26, 86, 219, 0.08);
        }
        .ats-section-title {
          background: linear-gradient(135deg, var(--dark) 0%, var(--primary-dark) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ats-title-accent {
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ats-spinner {
          width: 16px;
          height: 16px;
          display: inline-block;
          border: 2px solid currentColor;
          border-right-color: transparent;
          border-radius: 50%;
          animation: ats-spin 0.7s linear infinite;
        }
        @keyframes ats-spin { to { transform: rotate(360deg); } }
        @keyframes ats-grow { from { width: 0; } }
        @keyframes ats-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .ats-faq {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .ats-faq:hover { border-color: #bfdbfe; }
        .ats-faq[open] {
          box-shadow: 0 8px 24px rgba(26, 86, 219, 0.08);
          border-color: #93c5fd;
        }
        .ats-faq summary span { transition: transform 0.25s ease, color 0.2s ease; color: var(--primary); }
        details[open] .ats-faq summary span { transform: rotate(45deg); color: var(--accent); }
        .ats-white-btn {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: #fff;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          box-shadow: 0 4px 14px rgba(26, 86, 219, 0.28);
        }
        .ats-white-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(26, 86, 219, 0.22);
        }
        .ats-history-item {
          border: 1px solid var(--line);
          border-radius: 14px;
          background: #fff;
          padding: 16px 18px;
          text-align: left;
          width: 100%;
          cursor: pointer;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
        }
        .ats-history-item:hover {
          border-color: #93c5fd;
          box-shadow: 0 8px 24px rgba(26, 86, 219, 0.1);
          transform: translateY(-2px);
        }
        .ats-history-item.active {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
        }
        .ats-user-id-box {
          border: 1px solid #bfdbfe;
          background: linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%);
          border-radius: 12px;
          padding: 10px 12px;
          font-size: 12px;
          color: var(--primary-dark);
          word-break: break-all;
        }
        .ats-header-scrolled {
          box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08);
          border-bottom-color: var(--line) !important;
        }
        .ats-mobile-menu { border-top: 1px solid var(--line); background: rgba(255,255,255,.98); box-shadow: 0 16px 30px rgba(15,23,42,.08); }
        .ats-mobile-link { display: block; padding: 12px 0; color: var(--dark-soft); font-weight: 700; text-decoration: none; border-bottom: 1px solid #f1f5f9; }
        @media (max-width: 639px) {
          .ats-container { width: min(100% - 24px, 1120px); }
          .ats-orb { display: none; }
          .ats-upload-card { border-radius: 18px; }
          .ats-dropzone { padding: 24px 12px; }
          .ats-btn { min-height: 46px; }
          .ats-card { border-radius: 16px; }
          .ats-score-ring { width: 156px; height: 156px; }
          .ats-score-value { font-size: 40px; }
          .ats-analysis-item { padding: 12px 14px; }
          .ats-logo { height: 38px; max-width: 155px; }
        }
        @media print {
          header, footer, #features, #how, #resources, #faq, .ats-cta-panel, #history, #checker, .ats-btn { display: none !important; }
          .ats-page, section { background: #fff !important; }
          .ats-card { break-inside: avoid; box-shadow: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, .ats-orb, .ats-score-ring { animation: none !important; transition: none !important; }
        }
      `}</style>

      <div className="ats-page min-h-screen bg-white">
        {/* Header */}
        <header
          className={`sticky top-0 z-20 border-b border-[#e2e8f0] bg-white/95 backdrop-blur-md transition-shadow duration-300 ${
            headerScrolled ? "ats-header-scrolled" : ""
          }`}
        >
          <nav className="ats-container flex min-h-[76px] items-center justify-between gap-3">
            <Link to="/" className="ats-brand">
              <img src={Logo} alt="ASKOXY.AI home" className="ats-logo" />
            </Link>
            <div className="hidden items-center gap-6 sm:flex">
              <a href="#features" className="ats-nav-link hidden sm:inline">
                Features
              </a>
              <a href="#how" className="ats-nav-link hidden sm:inline">
                How It Works
              </a>
              <a href="#resources" className="ats-nav-link hidden md:inline">
                Resources
              </a>
              <a href="#faq" className="ats-nav-link hidden lg:inline">
                FAQ
              </a>
            </div>
            <div className="flex items-center sm:hidden">
              <button
                type="button"
                className="grid h-11 w-11 place-items-center rounded-xl border border-[#e2e8f0] bg-white text-xl"
                aria-label={
                  mobileMenuOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
                }
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((open) => !open)}
              >
                {mobileMenuOpen ? "×" : "☰"}
              </button>
            </div>
          </nav>
          <AnimatePresence initial={false}>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22 }}
                className="ats-mobile-menu overflow-hidden sm:hidden"
              >
                <div className="ats-container py-2">
                  {[
                    ["Features", "#features"],
                    ["How It Works", "#how"],
                    ["Resources", "#resources"],
                    ["FAQ", "#faq"],
                  ].map(([label, href]) => (
                    <a
                      key={href}
                      href={href}
                      className="ats-mobile-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <main>
          {/* Hero + Upload */}
          <section
            id="checker"
            className="ats-hero-bg relative overflow-hidden px-0 py-12 sm:py-[72px]"
          >
            <div className="ats-orb ats-orb-1" aria-hidden="true" />
            <div className="ats-orb ats-orb-2" aria-hidden="true" />
            <div className="ats-container relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-[52px]">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="ats-eyebrow">Instant Resume Analysis</span>
                <h1 className="my-[18px] text-[clamp(34px,5.2vw,64px)] font-black leading-[1.05] tracking-[-1.5px] sm:tracking-[-2.5px]">
                  Resume <span className="ats-title-accent">AI Interview</span>
                </h1>
                <p className="max-w-[650px] text-lg text-[#64748b]">
                  Understand how well your resume performs before starting your
                  AI interview. Review key sections, identify improvement areas
                  and build a stronger, job-ready profile with clear
                  recommendations.
                </p>
                <div className="my-6 flex flex-wrap gap-3.5 text-sm font-semibold text-[#334155] sm:my-7">
                  {[
                    "Detailed resume score",
                    "PDF & DOCX support",
                    "Clear improvement guidance",
                    "Interview-ready insights",
                  ].map((point) => (
                    <span key={point}>
                      <span className="mr-1.5 font-black text-[#059669]">
                        ✓
                      </span>
                      {point}
                    </span>
                  ))}
                </div>
                <p className="m-0 max-w-[600px] text-sm font-medium text-[#64748b]">
                  Upload your resume securely to receive a structured analysis
                  in just a few moments.
                </p>
              </motion.div>

              <motion.div
                id="uploadBox"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="ats-upload-card w-full max-w-[650px] rounded-[22px] p-[18px] sm:p-[26px] lg:max-w-none"
              >
                <h2 className="m-0 mb-1 text-2xl font-extrabold">
                  Upload your resume
                </h2>
                <p className="mb-5 mt-0 text-sm text-[#64748b]">
                  Upload your resume to receive a complete ASKOXY.AI ATS report.
                </p>

                <label
                  htmlFor="fileInput"
                  className={`ats-dropzone ${isDragging ? "drag" : ""}`}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    setFile(e.dataTransfer.files[0]);
                  }}
                >
                  <span className="ats-upload-icon">⇧</span>
                  <strong className="block">
                    Drag & drop or browse your resume
                  </strong>
                  <small className="text-[#627d98]">
                    PDF or DOCX · Maximum 5 MB
                  </small>
                </label>

                <input
                  ref={fileInputRef}
                  id="fileInput"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0])}
                />

                <div
                  className={`mt-2.5 min-h-[22px] text-sm font-bold ${
                    fileNameText.startsWith("✓")
                      ? "text-[#059669]"
                      : fileNameText
                        ? "text-[#b91c1c]"
                        : ""
                  }`}
                >
                  {fileNameText}
                </div>
                {selectedFile && (
                  <button
                    type="button"
                    onClick={removeFile}
                    className="mt-1 text-sm font-bold text-[#b91c1c] underline underline-offset-2"
                  >
                    Remove file
                  </button>
                )}

                <button
                  type="button"
                  className="ats-btn ats-btn-primary mt-4 w-full"
                  disabled={isChecking || !selectedFile}
                  onClick={handleCheck}
                >
                  {isChecking ? (
                    <>
                      <span className="ats-spinner" /> Uploading Resume
                    </>
                  ) : (
                    "Check ATS Score"
                  )}
                </button>

                <AnimatePresence mode="wait">
                  {statusType !== "idle" && statusMessage && (
                    <motion.div
                      key={`${statusType}-${statusMessage}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className={`ats-status-box ${statusType}`}
                      role="status"
                      aria-live="polite"
                    >
                      {statusType === "loading" && (
                        <span className="ats-spinner mr-2" />
                      )}
                      {statusMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="mt-3 text-center text-xs text-[#64748b]">
                  Your resume is securely submitted for ATS analysis.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Resume History by User ID */}
          {/* {userId.trim() && isValidUserId(userId) && (
            <section
              id="history"
              className="border-t border-[#e2e8f0] bg-white px-0 py-14 sm:py-[78px]"
            >
              <div className="ats-container">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="ats-section-title mb-2 text-[clamp(24px,3.5vw,36px)] font-black tracking-[-1px]">
                      Your Resume History
                    </h2>
                    <p className="m-0 text-sm text-[#64748b]">
                      Review and reopen your previously analyzed resumes.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="ats-btn ats-btn-outline shrink-0"
                    disabled={historyLoading}
                    onClick={() => fetchHistory(userId.trim())}
                  >
                    {historyLoading ? (
                      <>
                        <span className="ats-spinner" /> Loading…
                      </>
                    ) : (
                      "Refresh History"
                    )}
                  </button>
                </div>

                {historyError && (
                  <div className="ats-status-box error mb-4">
                    {historyError}
                  </div>
                )}

                {!historyLoading &&
                  !historyError &&
                  historyRecords.length === 0 && (
                    <div className="ats-card rounded-2xl p-10 text-center">
                      <p className="m-0 font-bold text-[#64748b]">
                        No resume analyses yet for this User ID.
                      </p>
                      <p className="mt-2 text-sm text-[#94a3b8]">
                        Upload a resume above to create your first ATS report.
                      </p>
                    </div>
                  )}

                {historyRecords.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {historyRecords.map((rec, idx) => {
                      const recScore = rec.atsReport?.overallATSScore;
                      const recGrade = rec.atsReport?.atsGrade;
                      const isActive = activeJobId === rec.jobId;

                      return (
                        <motion.button
                          key={rec.jobId}
                          type="button"
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => viewHistoryReport(rec)}
                          className={`ats-history-item ${isActive ? "active" : ""}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 text-left">
                              <p className="truncate text-sm font-extrabold text-[#0f172a]">
                                {rec.originalFilename || "Resume"}
                              </p>
                              <p className="mt-1 text-xs text-[#64748b]">
                                {formatDate(rec.createdAt)}
                              </p>
                            </div>
                            {recScore != null && (
                              <div className="shrink-0 text-right">
                                <p className="text-2xl font-black text-[#1a56db]">
                                  {recScore}
                                </p>
                                {recGrade && (
                                  <span className="ats-grade mt-1 text-xs">
                                    {recGrade}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <p className="mt-3 text-left text-xs font-semibold text-[#64748b]">
                            Status:{" "}
                            <span
                              className={
                                rec.status === "COMPLETED"
                                  ? "text-[#059669]"
                                  : "text-[#d97706]"
                              }
                            >
                              {rec.status}
                            </span>
                          </p>
                          <p className="mt-1 text-left text-xs text-[#1a56db]">
                            View full report →
                          </p>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          )} */}

          {/* Results */}
          <AnimatePresence>
            {showResults && report && (
              <motion.section
                id="results"
                ref={resultsRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                exit={{ opacity: 0, y: -12 }}
                className="bg-[#f8fafc] px-0 py-14 sm:py-[78px]"
              >
                <div className="ats-container">
                  <div className="mx-auto mb-10 max-w-[700px] text-center">
                    <h2 className="ats-section-title mb-2.5 text-[clamp(28px,4vw,40px)] font-black tracking-[-1px]">
                      Your ATS Analysis
                    </h2>
                    <p className="m-0 text-[#64748b]">
                      A clear overview of your resume quality and job
                      compatibility.
                    </p>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="ats-card p-6 text-center"
                    >
                      <div
                        className="ats-score-ring"
                        style={{
                          background: `conic-gradient(#059669 0 ${score}%, #e2e8f0 ${score}% 100%)`,
                        }}
                      >
                        <div className="ats-score-value">
                          {score}
                          <small>ATS SCORE</small>
                        </div>
                      </div>
                      <h3 className="mb-1 text-lg font-extrabold">
                        {report.atsFriendliness || "Resume analyzed"}
                      </h3>
                      <p className="text-sm text-[#64748b]">
                        ATS Grade:{" "}
                        <span className="ats-grade">
                          {report.atsGrade || "—"}
                        </span>
                      </p>
                      <p className="mt-2 break-all text-[13px] text-[#64748b]">
                        {reportData?.originalFilename ||
                          selectedFile?.name ||
                          "Uploaded resume"}
                      </p>
                      <button
                        type="button"
                        className="ats-btn ats-btn-outline mt-4 w-full"
                        onClick={() => window.print()}
                      >
                        Print / Save Report
                      </button>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="ats-card p-6"
                    >
                      <div className="mb-[18px] flex items-center justify-between gap-3.5">
                        <h3 className="m-0 text-lg font-extrabold">
                          Resume Performance
                        </h3>
                        <span className="ats-grade">
                          {report.atsGrade || "—"}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <ScoreMetric
                          label="Completeness"
                          value={report.resumeCompletenessScore}
                          delay={0}
                        />
                        <ScoreMetric
                          label="Professionalism"
                          value={report.professionalismScore}
                          delay={0.05}
                        />
                        <ScoreMetric
                          label="Readability"
                          value={report.readabilityScore}
                          delay={0.1}
                        />
                        {sectionEntries.map(([key, value], idx) => (
                          <ScoreMetric
                            key={key}
                            label={formatLabel(key)}
                            value={value}
                            delay={0.15 + idx * 0.05}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  <div className="mt-6 grid gap-[18px] sm:grid-cols-2">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="ats-card p-6"
                    >
                      <h3 className="mb-3.5 mt-0 text-lg font-extrabold">
                        Resume Strengths
                      </h3>
                      <ReportList items={report.strengths} type="good" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.08 }}
                      className="ats-card p-6"
                    >
                      <h3 className="mb-3.5 mt-0 text-lg font-extrabold">
                        Areas to Improve
                      </h3>
                      <ReportList items={report.weaknesses} type="warn" />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="ats-card mt-[18px] p-6"
                  >
                    <h3 className="mt-0 text-lg font-extrabold">
                      Improvement Suggestions
                    </h3>
                    <ReportList
                      items={report.improvementSuggestions}
                      type="idea"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="ats-card mt-[18px] p-6"
                  >
                    <h3 className="mt-0 text-lg font-extrabold">
                      Detailed ATS Analysis
                    </h3>
                    <div className="mt-3 grid gap-3">
                      {analysisEntries.length ? (
                        analysisEntries.map(([key, value]) => (
                          <div key={key} className="ats-analysis-item">
                            <strong>{formatLabel(key)}</strong>
                            <span>{value}</span>
                          </div>
                        ))
                      ) : (
                        <p className="italic text-[#64748b]">
                          No detailed analysis was returned.
                        </p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="ats-card mt-[18px] border-[#bfdbfe] bg-gradient-to-br from-[#eff6ff] to-[#ecfdf5] p-6"
                  >
                    <h3 className="mt-0 text-lg font-extrabold">
                      Final Review
                    </h3>
                    <p className="m-0 text-[#334155]">
                      {report.finalReview || "Your ATS analysis is complete."}
                    </p>
                  </motion.div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Features */}
          <section id="features" className="px-0 py-14 sm:py-[78px]">
            <div className="ats-container">
              <div className="mx-auto mb-10 max-w-[700px] text-center">
                <h2 className="ats-section-title mb-2.5 text-[clamp(28px,4vw,40px)] font-black tracking-[-1px]">
                  Everything your resume needs
                </h2>
                <p className="m-0 text-[#64748b]">
                  Get a complete view of how effectively your resume
                  communicates your experience, skills and professional value.
                  Each insight helps you identify what is working, what may be
                  missed by screening systems and what you can improve before
                  applying for your next opportunity.
                </p>
              </div>
              <div className="grid gap-[18px] sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    icon: "🎯",
                    title: "ATS Score",
                    desc: "Understand your overall resume compatibility at a glance.",
                  },
                  {
                    icon: "🔑",
                    title: "Keyword Match",
                    desc: "Find important job keywords that are missing from your resume.",
                  },
                  {
                    icon: "🧩",
                    title: "Skills Analysis",
                    desc: "Compare your current skills with the role requirements.",
                  },
                  {
                    icon: "✍️",
                    title: "Smart Suggestions",
                    desc: "Receive clear recommendations for content and formatting.",
                  },
                ].map((f, i) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -4 }}
                    className="ats-feature-card p-6"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#eff6ff] to-[#ecfeff] text-[26px]">
                      {f.icon}
                    </div>
                    <h3 className="mb-2 text-lg font-extrabold">{f.title}</h3>
                    <p className="m-0 text-sm text-[#64748b]">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* How it works */}
          <section id="how" className="bg-[#f8fafc] px-0 py-14 sm:py-[78px]">
            <div className="ats-container">
              <div className="mx-auto mb-10 max-w-[700px] text-center">
                <h2 className="ats-section-title mb-2.5 text-[clamp(28px,4vw,40px)] font-black tracking-[-1px]">
                  How it works
                </h2>
                <p className="m-0 text-[#64748b]">
                  Start by uploading your PDF or DOCX resume. ASKOXY.AI securely
                  analyzes its structure, readability, skills and important
                  sections, then presents a clear score with practical
                  recommendations so you can update your resume and check your
                  progress again.
                </p>
              </div>
              <div className="grid gap-[18px] sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    num: "1",
                    title: "Upload Resume",
                    desc: "Select your PDF or DOCX resume.",
                  },
                  {
                    num: "2",
                    title: "Secure Analysis",
                    desc: "Your resume is submitted to the ASKOXY.AI ATS service.",
                  },
                  {
                    num: "3",
                    title: "Get ATS Score",
                    desc: "Review grade, section scores, strengths and weaknesses.",
                  },
                  {
                    num: "4",
                    title: "Improve Resume",
                    desc: "Apply the suggestions and check again.",
                  },
                ].map((s, i) => (
                  <motion.div
                    key={s.num}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -4 }}
                    className="ats-step-card rounded-2xl p-[22px]"
                  >
                    <div className="ats-step-num mb-4 grid h-9 w-9 place-items-center rounded-[10px] text-sm font-black">
                      {s.num}
                    </div>
                    <h3 className="mb-1.5 text-[17px] font-extrabold text-[#0f172a]">
                      {s.title}
                    </h3>
                    <p className="m-0 text-sm text-[#64748b]">{s.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Score info demo */}
          <section className="bg-[#f8fafc] px-0 py-14 sm:py-[78px]">
            <div className="ats-container grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="ats-eyebrow">YOUR REPORT, EXPLAINED</span>
                <h2 className="ats-section-title my-2 text-[clamp(28px,4vw,36px)] font-black">
                  A clear view of resume quality
                </h2>
                <p className="text-[#64748b]">
                  The report combines broad quality indicators with detailed
                  section checks, helping you understand overall ATS
                  compatibility and specific improvement areas.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="ats-card grid items-center gap-6 p-6 sm:grid-cols-[150px_1fr] sm:p-[25px]"
              >
                <div
                  className="mx-auto grid h-[140px] w-[140px] place-items-center rounded-full text-[38px] font-black text-[#059669]"
                  style={{
                    background:
                      "radial-gradient(circle closest-side,#fff 78%,transparent 80%),conic-gradient(#059669 88%,#e2e8f0 0)",
                  }}
                >
                  88
                </div>
                <div>
                  {[
                    { label: "Completeness", pct: 90 },
                    { label: "Professionalism", pct: 90 },
                    { label: "Readability", pct: 80 },
                  ].map((bar, i) => (
                    <div
                      key={bar.label}
                      className="my-3.5 text-[13px] font-bold"
                    >
                      <span className="flex justify-between text-[#334155]">
                        {bar.label} <b className="text-[#1a56db]">{bar.pct}%</b>
                      </span>
                      <i className="mt-1.5 block h-2 overflow-hidden rounded-full bg-[#e2e8f0] not-italic">
                        <motion.em
                          className="block h-full rounded-full not-italic"
                          style={{
                            background:
                              "linear-gradient(90deg, #1a56db, #0891b2, #10b981)",
                          }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${bar.pct}%` }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 1,
                            delay: i * 0.15,
                            ease: "easeOut",
                          }}
                        />
                      </i>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Resources */}
          <section id="resources" className="bg-white px-0 py-14 sm:py-[78px]">
            <div className="ats-container">
              <div className="mx-auto mb-10 max-w-[700px] text-center">
                <h2 className="ats-section-title mb-2.5 text-[clamp(28px,4vw,40px)] font-black tracking-[-1px]">
                  Resume resources
                </h2>
                <p className="m-0 text-[#64748b]">
                  Explore practical guidance for writing stronger summaries,
                  skills and work experience sections. These focused resources
                  help you use relevant keywords, communicate measurable
                  achievements and maintain a clean format that is easy for both
                  screening systems and recruiters to understand.
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    num: "01",
                    tag: "Resume Guide",
                    title: "How to write an ATS-friendly resume",
                    desc: "Use clear headings, relevant keywords and simple formatting.",
                  },
                  {
                    num: "02",
                    tag: "Skills",
                    title: "Build a stronger skills section",
                    desc: "Prioritize role-relevant capabilities without keyword stuffing.",
                  },
                  {
                    num: "03",
                    tag: "Experience",
                    title: "Turn responsibilities into achievements",
                    desc: "Use action verbs, measurable outcomes and impact-focused bullets.",
                  },
                ].map((r, i) => (
                  <motion.article
                    key={r.num}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -6 }}
                    className="overflow-hidden rounded-[18px] border border-[#e2e8f0] bg-white transition-shadow hover:border-[#bfdbfe] hover:shadow-[0_18px_40px_rgba(26,86,219,0.1)]"
                  >
                    <div className="grid h-[110px] place-items-center bg-gradient-to-br from-[#eff6ff] to-[#ecfeff] text-[64px] font-black text-[#1a56db]/20">
                      {r.num}
                    </div>
                    <div className="p-[23px]">
                      <span className="text-[11px] font-black uppercase tracking-[0.1em] text-[#1a56db]">
                        {r.tag}
                      </span>
                      <h3 className="my-2 text-[19px] font-extrabold">
                        {r.title}
                      </h3>
                      <p className="m-0 text-sm text-[#64748b]">{r.desc}</p>
                      <a
                        href="#checker"
                        className="mt-[17px] inline-block text-[13px] font-extrabold text-[#1a56db] no-underline transition hover:text-[#0891b2]"
                      >
                        Check your resume →
                      </a>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="px-0 py-14 sm:py-[78px]">
            <div className="ats-container">
              <div className="mx-auto mb-10 max-w-[700px] text-center">
                <h2 className="ats-section-title text-[clamp(28px,4vw,40px)] font-black tracking-[-1px]">
                  Frequently asked questions
                </h2>
              </div>
              <div className="mx-auto max-w-[820px]">
                {[
                  {
                    q: "How long does resume analysis take?",
                    a: "Most resumes are analyzed within a few moments. Processing time can vary depending on file size and service availability.",
                  },
                  {
                    q: "Which resume formats are supported?",
                    a: "The upload field accepts PDF, DOC and DOCX files up to 5 MB.",
                  },
                  {
                    q: "What does the ATS report include?",
                    a: "The report includes overall score, grade, friendliness, completeness, professionalism, readability, section scores, strengths, weaknesses and suggestions.",
                  },
                  {
                    q: "How can I improve a low ATS score?",
                    a: "Use clear section headings, add role-relevant skills and keywords, include measurable achievements, and keep the resume format simple and readable.",
                  },
                  {
                    q: "Can I check my updated resume again?",
                    a: "Yes. After applying the recommendations, upload the updated resume again to review your improved score and section results.",
                  },
                ].map((item) => (
                  <details
                    key={item.q}
                    className="ats-faq mb-3 rounded-[13px] border border-[#e2e8f0] bg-white px-[18px]"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between py-[18px] font-extrabold text-[#0f172a] [&::-webkit-details-marker]:hidden">
                      {item.q}
                      <span className="text-[22px]">+</span>
                    </summary>
                    <p className="mb-[18px] mt-0 text-[#64748b]">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="bg-white px-0 py-14 sm:py-[78px]">
            <div className="ats-container">
              <div className="ats-cta-panel flex flex-col items-center justify-between gap-8 p-8 text-center sm:flex-row sm:p-10 sm:text-left">
                <div>
                  <h2 className="ats-section-title mb-2 text-[clamp(26px,4vw,34px)] font-black">
                    Give your resume a stronger start.
                  </h2>
                  <p className="m-0 text-[#64748b]">
                    Understand your ATS performance and apply with greater
                    confidence.
                  </p>
                </div>
                <a
                  href="#checker"
                  className="ats-white-btn whitespace-nowrap rounded-[12px] px-[19px] py-[13px] font-black no-underline"
                >
                  Check ATS Score →
                </a>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-[#1e293b] bg-[#0f172a] px-0 pb-6 pt-12 text-[#94a3b8]">
          <div className="ats-container">
            <div className="grid gap-9 border-b border-[#334155] pb-10 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-[1.4fr_1fr_1fr]">
              <div className="mx-auto max-w-md sm:mx-0">
                <Link
                  to="/"
                  className="inline-flex rounded-xl bg-white px-3 py-2"
                  aria-label="Go to ASKOXY.AI home"
                >
                  <img src={Logo} alt="ASKOXY.AI" className="ats-logo" />
                </Link>
                <p className="mb-0 mt-4 text-sm leading-6 text-[#cbd5e1]">
                  Resume AI Interview helps you understand resume quality,
                  identify improvement areas and prepare a stronger profile
                  before applying for opportunities.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-sm font-extrabold uppercase tracking-[0.12em] text-white">
                  Explore
                </h2>
                <nav
                  className="flex flex-col gap-2.5 text-sm"
                  aria-label="Footer navigation"
                >
                  <a href="#features" className="ats-footer-link">
                    Features
                  </a>
                  <a href="#how" className="ats-footer-link">
                    How It Works
                  </a>
                  <a href="#resources" className="ats-footer-link">
                    Resources
                  </a>
                  <a href="#faq" className="ats-footer-link">
                    Frequently Asked Questions
                  </a>
                </nav>
              </div>

              {/* <div>
                <h2 className="mb-3 text-sm font-extrabold uppercase tracking-[0.12em] text-white">
                  Get Started
                </h2>
                <p className="mb-4 mt-0 text-sm leading-6 text-[#cbd5e1]">
                  Upload your resume and receive clear, actionable feedback in a
                  few moments.
                </p>
                <a
                  href="#uploadBox"
                  className="inline-flex min-h-11 items-center rounded-xl bg-[#1a56db] px-4 py-2.5 text-sm font-extrabold text-white no-underline transition hover:bg-[#2563eb]"
                >
                  Upload Resume →
                </a>
              </div> */}
            </div>

            <div className="flex flex-col items-center justify-between gap-3 pt-6 text-center text-xs sm:flex-row sm:text-left">
              <span>
                © {new Date().getFullYear()} ASKOXY.AI. All rights reserved.
              </span>
              <span>Resume AI Interview · Secure resume analysis</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ATSResumeChecker;
