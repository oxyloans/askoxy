import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Download,
  FileText,
  Lightbulb,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import Logo from "../../assets/img/askoxylogonew.png";
import {
  downloadImprovedResume,
  getImprovementStatus,
  getResumeStatus,
  startImprovement,
  type AtsReport,
  type ResumeStatusResponse,
} from "./atsResumeService";
import "./ResumeAnalysisReport.css";

type LoadState = "loading" | "ready" | "error";
type ImproveState = "idle" | "starting" | "processing" | "ready" | "downloading" | "error";

const cleanCopy = (value: unknown) =>
  String(value ?? "")
    .replace(/ATS-friendly/gi, "screening-friendly")
    .replace(/\bATS\b/gi, "resume screening")
    .replace(/\bfree\b/gi, "");

const labelFor = (key: string) =>
  cleanCopy(key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase()).trim());

const wait = (milliseconds: number) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

const ResumeAnalysisReport: React.FC = () => {
  const { jobId = "" } = useParams<{ jobId: string }>();
  const abortRef = useRef<AbortController | null>(null);
  const improvementAbortRef = useRef<AbortController | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [data, setData] = useState<ResumeStatusResponse | null>(null);
  const [error, setError] = useState("");
  const [improveState, setImproveState] = useState<ImproveState>("idle");
  const [improvementJobId, setImprovementJobId] = useState("");
  const [improvementMessage, setImprovementMessage] = useState("");
  const [improvementChecks, setImprovementChecks] = useState(0);

  const loadReport = useCallback(async () => {
    if (!jobId) {
      setError("This report link is incomplete. Please analyze your resume again.");
      setLoadState("error");
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoadState("loading");
    setError("");
    try {
      for (let attempt = 0; attempt < 60; attempt += 1) {
        const { response, data: result } = await getResumeStatus(jobId, controller.signal);
        if (!response.ok) throw new Error(result.message || result.errorMessage || "We could not load this report.");
        if (result.resumeStatus === "COMPLETED" && result.atsReport) {
          setData(result);
          setLoadState("ready");
          return;
        }
        if (["FAILED", "ERROR", "REJECTED"].includes(result.resumeStatus)) {
          throw new Error(result.message || result.errorMessage || "This resume could not be analyzed.");
        }
        await wait(2000);
      }
      throw new Error("The analysis is taking longer than expected. Please try again.");
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === "AbortError") return;
      setError(cleanCopy(requestError instanceof Error ? requestError.message : "We could not load this report."));
      setLoadState("error");
    }
  }, [jobId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    loadReport();
    return () => {
      abortRef.current?.abort();
      improvementAbortRef.current?.abort();
    };
  }, [loadReport]);

  const report = data?.atsReport;
  const score = Math.max(0, Math.min(100, Number(report?.overallATSScore) || 0));
  const scoreTone = score >= 80 ? "strong" : score >= 60 ? "progress" : "attention";
  const metrics = useMemo(() => {
    if (!report) return [];
    return [
      ["Completeness", report.resumeCompletenessScore],
      ["Professionalism", report.professionalismScore],
      ["Readability", report.readabilityScore],
      ...Object.entries(report.sectionScores || {}).map(([key, value]) => [labelFor(key), value] as [string, number]),
    ] as [string, number][];
  }, [report]);

  const beginImprovement = async () => {
    if (!report || !data?.jobId || !report.eligibleToUseResumeEditor) return;
    improvementAbortRef.current?.abort();
    const controller = new AbortController();
    improvementAbortRef.current = controller;
    setImproveState("starting");
    setImprovementMessage("Preparing your resume for improvement…");
    setImprovementChecks(0);
    try {
      const { response, data: started } = await startImprovement(data.jobId, score, controller.signal);
      if (!response.ok || !started.status || !started.eligible || !started.jobId) {
        throw new Error(started.message || started.errorMessage || `Improvement could not start (${response.status}).`);
      }
      setImprovementJobId(started.jobId);
      setImproveState("processing");
      let checks = 0;
      while (!controller.signal.aborted) {
        checks += 1;
        setImprovementChecks(checks);
        const { response: statusResponse, data: status } = await getImprovementStatus(started.jobId, controller.signal);
        setImprovementMessage(cleanCopy(status.message || status.errorMessage || "Creating your improved resume…"));
        if (status.pdfStatus === "COMPLETED") {
          setImproveState("ready");
          setImprovementMessage("Your improved resume is ready to download.");
          return;
        }
        if (["FAILED", "ERROR", "REJECTED"].includes(status.pdfStatus) && Number(status.retryCount) >= 2) {
          throw new Error(status.message || status.errorMessage || "Resume improvement could not be completed.");
        }
        if (!statusResponse.ok && Number(status.retryCount) >= 2) throw new Error(status.message || status.errorMessage || `Resume improvement failed (${statusResponse.status}).`);
        await wait(2000);
      }
    } catch (improvementError) {
      if (improvementError instanceof DOMException && improvementError.name === "AbortError") return;
      setImproveState("error");
      setImprovementMessage(cleanCopy(improvementError instanceof Error ? improvementError.message : "Please try again."));
    }
  };

  const downloadResume = async () => {
    if (!improvementJobId) return;
    setImproveState("downloading");
    try {
      const { blob, filename } = await downloadImprovedResume(improvementJobId);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setImproveState("ready");
      setImprovementMessage("Your improved resume was downloaded successfully.");
    } catch (downloadError) {
      setImproveState("ready");
      setImprovementMessage(downloadError instanceof Error ? downloadError.message : "Download failed. Please try again.");
    }
  };

  if (loadState !== "ready" || !report) {
    return <ReportState state={loadState} message={error} onRetry={loadReport} />;
  }

  return (
    <div className="report-page">
      <header className="report-header">
        <div className="report-container report-header-inner">
          <Link to="/" aria-label="ASKOXY.AI home"><img src={Logo} alt="ASKOXY.AI" /></Link>
          <Link to="/resume-ai-interview" className="report-back"><ArrowLeft size={17} /> Analyze another resume</Link>
        </div>
      </header>

      <main className="report-container report-main">
        <div className="report-intro">
          <div>
            <span className="report-kicker"><ShieldCheck size={15} /> Analysis complete</span>
            <h1>Your resume analysis is ready</h1>
            <p>Focus on the highest-impact recommendations first, then review every change before applying.</p>
          </div>
        </div>

        <div className="report-layout">
          <aside className="report-sidebar">
            <div className={`report-score-card ${scoreTone}`}>
              <p>Resume score</p>
              <div className="report-score-ring" style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties}>
                <strong>{score}</strong><span>/100</span>
              </div>
              <h2>{cleanCopy(report.atsFriendliness || (score >= 80 ? "Strong resume" : "Room to improve"))}</h2>
              <span className="report-grade">Resume grade {report.atsGrade || "—"}</span>
            </div>
            <nav className="report-nav" aria-label="Report sections">
              {[["overview", "Performance"], ["strengths", "Strengths"], ["improvements", "Improvements"], ["details", "Detailed review"], ["ai-improve", "AI improvement"]].map(([id, label]) => (
                <a key={id} href={`#${id}`}>{label}<ChevronRight size={15} /></a>
              ))}
            </nav>
          </aside>

          <div className="report-content">
            <ReportSection id="overview" icon={<TrendingUp />} title="Resume performance" subtitle="A section-by-section view of your current resume quality.">
              <div className="report-metrics">
                {metrics.map(([label, value], index) => <Metric key={`${label}-${index}`} label={label} value={Number(value) || 0} />)}
              </div>
            </ReportSection>

            <div className="report-two-column">
              <ReportSection id="strengths" icon={<Check />} title="What works well" subtitle="Keep these strengths clear and visible.">
                <InsightList items={report.strengths} tone="positive" />
              </ReportSection>
              <ReportSection id="improvements" icon={<Target />} title="What to improve" subtitle="Start with the items that affect clarity and relevance.">
                <InsightList items={report.weaknesses} tone="warning" />
              </ReportSection>
            </div>

            <ReportSection icon={<Lightbulb />} title="Recommended next steps" subtitle="Practical changes that can strengthen your resume.">
              <InsightList items={report.improvementSuggestions} tone="idea" />
            </ReportSection>

            <ReportSection id="details" icon={<FileText />} title="Detailed review" subtitle="Additional observations from your resume analysis.">
              <div className="report-details">
                {Object.entries(report.analysis || {}).map(([key, value]) => <div key={key}><strong>{labelFor(key)}</strong><p>{cleanCopy(value)}</p></div>)}
              </div>
              <div className="report-final-review"><strong>Final review</strong><p>{cleanCopy(report.finalReview || "Your analysis is complete.")}</p></div>
            </ReportSection>

            {/* <ImprovementPanel report={report} score={score} state={improveState} message={improvementMessage} checks={improvementChecks} onStart={beginImprovement} onDownload={downloadResume} /> */}
          </div>
        </div>
      </main>
    </div>
  );
};

const ReportState = ({ state, message, onRetry }: { state: LoadState; message: string; onRetry: () => void }) => (
  <div className="report-state-page">
    <Link to="/"><img src={Logo} alt="ASKOXY.AI" /></Link>
    <div className="report-state-card" role={state === "error" ? "alert" : "status"} aria-live="polite">
      {state === "loading" ? <><span className="report-loader" /><h1>Preparing your report</h1><p>We’re organizing your resume score, feedback and recommendations.</p></> : <><FileText size={38} /><h1>Report unavailable</h1><p>{message}</p><button type="button" onClick={onRetry}><RefreshCw size={16} /> Try again</button><Link to="/resume-ai-interview">Analyze another resume</Link></>}
    </div>
  </div>
);

const ReportSection = ({ id, icon, title, subtitle, children }: { id?: string; icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode }) => (
  <motion.section id={id} className="report-section" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
    <div className="report-section-heading"><span>{icon}</span><div><h2>{title}</h2><p>{subtitle}</p></div></div>
    {children}
  </motion.section>
);

const Metric = ({ label, value }: { label: string; value: number }) => {
  const percent = Math.min(100, Math.max(0, value <= 10 ? value * 10 : value));
  return <div className="report-metric"><div><strong>{label}</strong><span>{value}{value <= 10 ? "/10" : "%"}</span></div><div className="report-metric-track"><i style={{ width: `${percent}%` }} /></div></div>;
};

const InsightList = ({ items, tone }: { items: string[]; tone: "positive" | "warning" | "idea" }) => (
  <ul className={`report-insights ${tone}`}>{(items?.length ? items : ["No items were reported."]).map((item, index) => <li key={index}><span>{tone === "positive" ? <Check size={15} /> : tone === "warning" ? <Target size={15} /> : <Lightbulb size={15} />}</span>{cleanCopy(item)}</li>)}</ul>
);

// const ImprovementPanel = ({ report, score, state, message, checks, onStart, onDownload }: { report: AtsReport; score: number; state: ImproveState; message: string; checks: number; onStart: () => void; onDownload: () => void }) => (
//   <section id="ai-improve" className="report-improve">
//     <div className="report-improve-top"><span><Sparkles /></span><div><small>AI resume assistant</small><h2>{report.eligibleToUseResumeEditor ? "Improve your resume with AI" : "Your resume is performing strongly"}</h2><p>{cleanCopy(report.resumeEditorReason || (report.eligibleToUseResumeEditor ? "Turn your report recommendations into a polished, downloadable resume." : "Automatic improvement is intended for resumes that need more substantial changes."))}</p></div></div>
//     <div className="report-improve-score"><span>Current score</span><strong>{score}/100</strong></div>
//     {report.eligibleToUseResumeEditor && state === "idle" && <button type="button" className="report-primary-button" onClick={onStart}><Sparkles size={17} /> Improve my resume</button>}
//     {report.eligibleToUseResumeEditor && state !== "idle" && <div className={`report-improve-status ${state}`} role={state === "error" ? "alert" : "status"} aria-live="polite"><div><span className={state === "ready" ? "status-check" : "report-loader small"}>{state === "ready" && <Check size={16} />}</span><div><strong>{state === "ready" ? "Your improved resume is ready" : state === "error" ? "We couldn’t complete the improvement" : state === "downloading" ? "Preparing your download" : "Creating your improved resume"}</strong><p>{message}{state === "processing" && checks ? ` · Status check ${checks}` : ""}</p></div></div>{state === "ready" && <button type="button" onClick={onDownload}><Download size={16} /> Download PDF</button>}{state === "error" && <button type="button" onClick={onStart}><RefreshCw size={16} /> Try again</button>}</div>}
//   </section>
// );

export default ResumeAnalysisReport;
