import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Eye,
  FileText,
  LoaderCircle,
  Mail,
  Phone,
  RefreshCw,
  Search,
  UsersRound,
  X,
  XCircle,
} from "lucide-react";

import BASE_URL from "../Config";
import { getEmployeeAuth } from "./employeeAuthCookie";

interface Applicant {
  id: string;
  jobId?: string | null;
  userId?: string | null;
  userName?: string | null;
  mobileNumber?: string | null;
  email?: string | null;
  resumeUrl?: string | null;
  coverLetter?: string | null;
  noticePeriod?: string | null;
  applicationStatus?: string | null;
  appliedAt?: number | string | null;
  atsScoreViewerId?: string | null;
}

interface ApplicantsPage {
  content?: Applicant[];
  totalElements?: number;
  totalPages?: number;
  number?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: boolean;
  success?: boolean;
}

const PAGE_SIZE = 10;

interface AtsHistoryItem {
  id?: string;
  atsScoreViewerId?: string;
  candidateExamStatus?: string;
  totalQuestions?: number;
  createdAt?: number | string | null;
  updatedAt?: number | string | null;
}

interface ExamQuestion {
  question?: string;
  questionType?: string;
  options?: string[];
  openAiAnswer?: string[];
  userAnswer?: string | string[] | null;
}

interface ExamAttempt {
  id?: string;
  score?: number;
  percentage?: number;
  status?: boolean;
  totalQuestions?: number;
  appliedAt?: number | string | null;
  updatedAt?: number | string | null;
  examQuestions?: ExamQuestion[];
}

interface ExamResultsData {
  atsHistory?: AtsHistoryItem[];
  examAttempt?: ExamAttempt | null;
  isEligible?: boolean;
}

interface ResultsModalState {
  applicant: Applicant;
  loading: boolean;
  error: string;
  result: ApiResponse<ExamResultsData> | null;
}

const   EmployeeApplicationsComingSoon: React.FC = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [applicantCount, setApplicantCount] = useState<number | null>(null);
  const [pageData, setPageData] = useState<ApplicantsPage>({});
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [resultsModal, setResultsModal] = useState<ResultsModalState | null>(null);
  const [resumeModal, setResumeModal] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [iframeLoading, setIframeLoading] = useState(true);
  const [resumeError, setResumeError] = useState(false);

  const openResumeModal = (url: string) => {
    setResumeUrl(`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`);
    setIframeLoading(true);
    setResumeError(false);
    setResumeModal(true);
  };

  const loadApplications = useCallback(async (signal?: AbortSignal, isRefresh = false) => {
    const auth = getEmployeeAuth();
    if (!auth) {
      setError("Your employee session has expired. Please sign in again.");
      toast.warning("Your employee session has expired. Please sign in again.", { toastId: "applications-session-expired" });
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const query = `userId=${encodeURIComponent(auth.id)}`;
      const [countResponse, applicantsResponse] = await Promise.all([
        fetch(`${BASE_URL}/marketing-service/campgin/applicants/count?${query}`, {
          headers: { Accept: "application/json" },
          signal,
        }),
        fetch(
          `${BASE_URL}/marketing-service/campgin/applicants-for-users-jobs?${query}&page=${page}&size=${PAGE_SIZE}`,
          { headers: { Accept: "application/json" }, signal }
        ),
      ]);

      const [countResult, applicantsResult] = await Promise.all([
        countResponse.json().catch(() => null),
        applicantsResponse.json().catch(() => null),
      ]);

      if (!applicantsResponse.ok || applicantsResult?.status === false) {
        throw new Error(
          applicantsResult?.message ||
          `Unable to load applications. Server returned ${applicantsResponse.status}.`
        );
      }

      const receivedPage: ApplicantsPage = applicantsResult?.data || {};
      setApplicants(Array.isArray(receivedPage.content) ? receivedPage.content : []);
      setPageData(receivedPage);

      if (countResponse.ok && countResult?.status !== false && typeof countResult?.data === "number") {
        setApplicantCount(countResult.data);
      } else {
        setApplicantCount(typeof receivedPage.totalElements === "number" ? receivedPage.totalElements : null);
      }

      if (isRefresh) toast.success("Applications refreshed successfully.");
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === "AbortError") return;
      setApplicants([]);
      setPageData({});
      setApplicantCount(null);
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to load applications. Please try again.";
      setError(message);
      if (isRefresh) toast.error('Could not refresh applications. Please try again.');
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [page]);

  useEffect(() => {
    const controller = new AbortController();
    loadApplications(controller.signal);
    return () => controller.abort();
  }, [loadApplications]);

  const visibleApplicants = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return applicants;
    return applicants.filter((applicant) =>
      [applicant.userName, applicant.email, applicant.mobileNumber, applicant.applicationStatus]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [applicants, search]);

  const currentPage = (pageData.number ?? page) + 1;
  const totalPages = pageData.totalPages ?? 0;
  const hasResults = (applicant: Applicant) => Boolean(applicant.atsScoreViewerId?.trim());

  const openResultsModal = async (applicant: Applicant) => {
    const atsScoreViewerId = applicant.atsScoreViewerId?.trim();
    if (!atsScoreViewerId) return;

    setResultsModal({ applicant, loading: true, error: "", result: null });

    try {
      const response = await fetch(
        `${BASE_URL}/marketing-service/campgin/answers-info-of-applied-job?atsScoreViewerId=${encodeURIComponent(atsScoreViewerId)}`,
        { headers: { Accept: "application/json" } }
      );
      const result = (await response.json().catch(() => null)) as ApiResponse<ExamResultsData> | null;

      if (!response.ok && !result) {
        throw new Error(`Unable to load results. Server returned ${response.status}.`);
      }

      setResultsModal({ applicant, loading: false, error: "", result });
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to load exam results.";
      setResultsModal({
        applicant,
        loading: false,
        error: message,
        result: null,
      });
      toast.error('Could not load exam results. Please try again.');
    }
  };

  return (
    <section className="eapps-page" aria-labelledby="employee-applications-title">
      <style>{applicationsStyles}</style>

      <header className="eapps-header">
        <div className="eapps-heading">
          <span className="eapps-heading-icon" aria-hidden="true"><UsersRound /></span>
          <div>
            <span className="eapps-eyebrow">Recruitment workspace</span>
            <h1 id="employee-applications-title">Applications</h1>
            <p>Review candidates who applied to the jobs created from your employee account.</p>
          </div>
        </div>
        <button className="eapps-refresh" type="button" onClick={() => loadApplications(undefined, true)} disabled={loading || refreshing}>
          <RefreshCw className={refreshing ? "eapps-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      <div className="eapps-summary" aria-label="Application summary">
        <span className="eapps-summary-icon"><FileText /></span>
        <div><small>Total applications</small><strong>{applicantCount ?? (loading ? "—" : 0)}</strong></div>
        <p>{applicantCount === 1 ? "1 candidate has applied to your jobs." : `${applicantCount ?? 0} candidates have applied to your jobs.`}</p>
      </div>

      <div className="eapps-toolbar">
        <label className="eapps-search" htmlFor="application-search">
          <Search aria-hidden="true" />
          <input id="application-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search this page by candidate, email or phone..." />
        </label>
        {!loading && !error && <span className="eapps-page-note">Showing {visibleApplicants.length} on this page</span>}
      </div>

      {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={() => loadApplications()} /> : visibleApplicants.length === 0 ? (
        <div className="eapps-state"><UsersRound /><h2>{applicants.length ? "No candidates match your search" : "No applications yet"}</h2><p>{applicants.length ? "Try a different candidate name, email or phone number." : "Applications to your posted jobs will appear here."}</p></div>
      ) : (
        <div className="eapps-list">
          {visibleApplicants.map((applicant) => (
            <article className="eapps-card" key={applicant.id}>
              <div className="eapps-avatar" aria-hidden="true">{initials(applicant.userName)}</div>
              <div className="eapps-card-main">
                <div className="eapps-card-top"><div><h2>{applicant.userName || "Unnamed candidate"}</h2><p>Applied {formatDate(applicant.appliedAt)}</p></div><span className="eapps-status">{applicant.applicationStatus || "Applied"}</span></div>
                <div className="eapps-contact">
                  {applicant.email && <span><Mail />{applicant.email}</span>}
                  {applicant.mobileNumber && <span><Phone />{applicant.mobileNumber}</span>}
                  {applicant.noticePeriod && <span><CalendarDays />Notice: {applicant.noticePeriod}</span>}
                </div>
                {applicant.coverLetter && <p className="eapps-cover-letter">{applicant.coverLetter}</p>}
                <div className="eapps-actions">
                  {applicant.resumeUrl
                    ? <button type="button" className="eapps-results" onClick={() => openResumeModal(applicant.resumeUrl!)}><FileText />View resume</button>
                    : <span className="eapps-unavailable">Resume unavailable</span>}
                  {hasResults(applicant) && <button type="button" className="eapps-results" onClick={() => openResultsModal(applicant)}><Eye />View results</button>}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <nav className="eapps-pagination" aria-label="Applications pagination">
          <button type="button" onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={pageData.first ?? page === 0}><ChevronLeft />Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button type="button" onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))} disabled={pageData.last ?? currentPage >= totalPages}>Next<ChevronRight /></button>
        </nav>
      )}

      {resultsModal && (
        <ExamResultsModal
          state={resultsModal}
          onClose={() => setResultsModal(null)}
          onRetry={() => openResultsModal(resultsModal.applicant)}
        />
      )}

      {resumeModal && (
        <div className="eapps-modal" role="dialog" aria-modal="true" aria-labelledby="resume-viewer-title">
          <div className="eapps-modal-card" style={{ display: "flex", flexDirection: "column", height: "88vh" }}>
            <div className="eapps-modal-head">
              <div>
                <span className="eapps-eyebrow">Document viewer</span>
                <h2 id="resume-viewer-title">Resume</h2>
              </div>
              <button type="button" className="eapps-modal-close" onClick={() => { setResumeModal(false); setIframeLoading(true); setResumeError(false); }} aria-label="Close resume">
                <X />
              </button>
            </div>
            <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
              {iframeLoading && !resumeError && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <LoaderCircle className="eapps-spin" style={{ width: 36, height: 36, color: "#9faeff" }} />
                </div>
              )}
              {resumeError && (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: 24 }}>
                  <CircleAlert style={{ width: 32, color: "#fa9cab" }} />
                  <p style={{ color: "rgba(226,231,250,.6)", fontSize: ".8rem" }}>Unable to load resume. The file could not be displayed.</p>
                </div>
              )}
              {!resumeError && (
                <iframe
                  src={resumeUrl}
                  title="Resume Viewer"
                  style={{ width: "100%", height: "100%", border: "none", display: iframeLoading ? "none" : "block" }}
                  onLoad={() => setIframeLoading(false)}
                  onError={() => { setIframeLoading(false); setResumeError(true); }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const LoadingState = () => <div className="eapps-state" role="status"><LoaderCircle className="eapps-spin" /><h2>Loading applications...</h2><p>Retrieving your candidate list.</p></div>;
const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => <div className="eapps-state eapps-error" role="alert"><CircleAlert /><h2>Could not load applications</h2><p>{message}</p><button type="button" onClick={onRetry}><RefreshCw />Try again</button></div>;
const initials = (name?: string | null) => (name || "Candidate").split(" ").filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
const formatDate = (value?: number | string | null) => { if (!value) return "recently"; const date = new Date(typeof value === "number" ? value : value); return Number.isNaN(date.getTime()) ? "recently" : date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }); };



const ExamResultsModal = ({ state, onClose, onRetry }: { state: ResultsModalState; onClose: () => void; onRetry: () => void }) => {
  const data = state.result?.data;
  const attempt = data?.examAttempt ?? null;
  const questions = attempt && Array.isArray(attempt.examQuestions) ? attempt.examQuestions : [];
  const atsHistory = data?.atsHistory ?? []; const isEligible = data?.isEligible === true;
  const questionTotal = attempt?.totalQuestions ?? (questions.length || "-");

  return (
    <div className="eapps-modal" role="dialog" aria-modal="true" aria-labelledby="exam-results-title">
      <div className="eapps-modal-card">
        <div className="eapps-modal-head">
          <div>
            <span className="eapps-eyebrow">Exam results</span>
            <h2 id="exam-results-title">{state.applicant.userName || "Candidate"}</h2>
            <p>{state.applicant.email || state.applicant.mobileNumber || "Applied candidate"}</p>
          </div>
          <button type="button" className="eapps-modal-close" onClick={onClose} aria-label="Close results">
            <X />
          </button>
        </div>

        {state.loading ? (
          <div className="eapps-results-state" role="status">
            <LoaderCircle className="eapps-spin" />
            <h3>Loading exam answers...</h3>
            <p>Fetching the candidate response sheet.</p>
          </div>
        ) : state.error ? (
          <div className="eapps-results-state eapps-error" role="alert">
            <CircleAlert />
            <h3>Could not load results</h3>
            <p>{state.error}</p>
            <button type="button" onClick={onRetry}><RefreshCw />Try again</button>
          </div>
        ) : (
          <>
            <div className={`eapps-result-banner ${isEligible ? "eapps-result-eligible" : "eapps-result-not-eligible"}`}>
              <span>{isEligible ? <CheckCircle2 /> : <CircleAlert />}</span>
              <div>
                <strong>{state.result?.message || (isEligible ? "Candidate is eligible" : "Candidate is not eligible")}</strong>
                <p>
                  {attempt
                    ? `Score: ${formatScore(attempt.score)} / ${questionTotal} questions, ${formatScore(attempt.percentage)}%`
                    : "No completed exam attempt is available for this candidate yet."}
                </p>
              </div>
            </div>

            {attempt && (
              <div className="eapps-result-meta">
                <ResultMetric label="Score" value={formatScore(attempt.score)} />
                <ResultMetric label="Percentage" value={`${formatScore(attempt.percentage)}%`} />
                <ResultMetric label="Questions" value={String(attempt.totalQuestions ?? questions.length)} />
                <ResultMetric label="Submitted" value={formatDate(attempt.updatedAt || attempt.appliedAt)} />
              </div>
            )}

            {questions.length > 0 ? (
              <div className="eapps-question-list">
                {questions.map((question, index) => (
                  <QuestionResult key={`${question.question || "question"}-${index}`} question={question} index={index} />
                ))}
              </div>
            ) : (
              <div className="eapps-results-state">
                <FileText />
                <h3>No answer sheet found</h3>
                <p>The API returned the candidate status, but no exam questions were attached.</p>
              </div>
            )}

            {atsHistory.length > 0 && (
              <div className="eapps-history">
                <strong>Exam history</strong>
                {atsHistory.map((item) => (
                  <div key={item.id || `${item.candidateExamStatus}-${item.updatedAt}`}>
                    <span>{formatStatus(item.candidateExamStatus)}</span>
                    <small>{formatDate(item.updatedAt || item.createdAt)} - {item.totalQuestions ?? "-"} questions</small>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const ResultMetric = ({ label, value }: { label: string; value: string }) => (
  <div>
    <small>{label}</small>
    <strong>{value}</strong>
  </div>
);

const QuestionResult = ({ question, index }: { question: ExamQuestion; index: number }) => {
  const actualAnswers = normalizeAnswers(question.openAiAnswer);
  const userAnswers = normalizeAnswers(question.userAnswer);
  const correct = actualAnswers.length > 0 && userAnswers.length > 0 && actualAnswers.length === userAnswers.length && actualAnswers.every((answer) => userAnswers.includes(answer));

  return (
    <article className={`eapps-question ${correct ? "eapps-question-correct" : "eapps-question-wrong"}`}>
      <div className="eapps-question-head">
        <span>Q{index + 1}</span>
        <strong>{question.questionType === "multiple" ? "Multiple answer" : "Single answer"}</strong>
        <i className={correct ? "eapps-badge-correct" : "eapps-badge-wrong"}>
          {correct ? <CheckCircle2 /> : <XCircle />}
          {correct ? "Correct" : "Incorrect"}
        </i>
      </div>
      <p>{question.question || "Question unavailable"}</p>
      <div className="eapps-options">
        {(question.options || []).map((option) => {
          const optionKey = getOptionKey(option);
          const isActual = actualAnswers.includes(optionKey);
          const isUser = userAnswers.includes(optionKey);
          const state = isActual && isUser ? "hit" : isActual ? "actual" : isUser ? "miss" : "neutral";
          return (
            <div key={option} className={`eapps-option eapps-option-${state}`}>
              <span className="eapps-option-icon">
                {state === "hit" && <CheckCircle2 />}
                {state === "miss" && <XCircle />}
                {state === "actual" && <CheckCircle2 />}
              </span>
              <span className="eapps-option-text">{option}</span>
              <small>
                {state === "hit" && "Correct + selected"}
                {state === "actual" && "Actual answer"}
                {state === "miss" && "Selected (wrong)"}
              </small>
            </div>
          );
        })}
      </div>
      <div className="eapps-answer-row">
        <span className="eapps-answer-chip eapps-answer-actual">Actual: <strong>{actualAnswers.join(", ") || "-"}</strong></span>
        <span className={`eapps-answer-chip ${correct ? "eapps-answer-user-correct" : "eapps-answer-user-wrong"}`}>
          User: <strong>{userAnswers.join(", ") || "-"}</strong>
        </span>
      </div>
    </article>
  );
};

const normalizeAnswers = (value?: string | string[] | null): string[] => {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : String(value).split(",");
  return raw.map((item) => item.trim().replace(/\.$/, "").toUpperCase()).filter(Boolean);
};

const getOptionKey = (option: string) => option.trim().charAt(0).toUpperCase();
const formatScore = (value?: number) => typeof value === "number" ? Number(value.toFixed(2)).toString() : "-";
const formatStatus = (value?: string) => (value || "Unknown").replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

const applicationsStyles = `
  .eapps-page, .eapps-page * { box-sizing: border-box; } .eapps-page { width: 100%; max-width: 1120px; margin: 0 auto; color: #f7f8ff; font-family: Inter, system-ui, sans-serif; }
  .eapps-header, .eapps-heading, .eapps-refresh, .eapps-summary, .eapps-search, .eapps-card, .eapps-card-top, .eapps-contact, .eapps-actions, .eapps-pagination, .eapps-state button { display: flex; align-items: center; } .eapps-header { justify-content: space-between; gap: 18px; margin-bottom: 22px; } .eapps-heading { gap: 14px; } .eapps-heading-icon, .eapps-summary-icon, .eapps-avatar { display: grid; place-items: center; flex: 0 0 auto; } .eapps-heading-icon { width: 48px; height: 48px; border-radius: 16px; background: linear-gradient(145deg,#5d6ef2,#8059ed 55%,#2bbbd9); box-shadow: 0 15px 32px rgba(73,83,218,.28); } .eapps-heading-icon svg { width: 21px; } .eapps-eyebrow { color: #9faeff; font-size: .65rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; } .eapps-heading h1 { margin: 5px 0 0; font-size: clamp(1.8rem,3.2vw,2.5rem); line-height: 1.05; letter-spacing: -.045em; } .eapps-heading p { margin: 7px 0 0; color: rgba(229,234,255,.58); font-size: .82rem; }
  .eapps-refresh, .eapps-pagination button, .eapps-state button { justify-content: center; gap: 8px; min-height: 42px; padding: 0 14px; color: #f7f8ff; border: 1px solid rgba(255,255,255,.14); border-radius: 12px; background: rgba(255,255,255,.06); font: 750 .7rem Inter, sans-serif; cursor: pointer; } .eapps-refresh svg, .eapps-pagination svg, .eapps-state button svg { width: 15px; } button:disabled { opacity: .45; cursor: not-allowed; } .eapps-spin { animation: eapps-spin .8s linear infinite; } @keyframes eapps-spin { to { transform: rotate(360deg); } }
  .eapps-summary { gap: 13px; min-height: 92px; margin-bottom: 18px; padding: 17px 20px; border: 1px solid rgba(132,145,255,.18); border-radius: 18px; background: linear-gradient(120deg,rgba(93,109,242,.17),rgba(31,186,216,.08)); } .eapps-summary-icon { width: 48px; height: 48px; color: #ccd2ff; border-radius: 14px; background: rgba(116,128,255,.18); } .eapps-summary-icon svg { width: 21px; } .eapps-summary small { display: block; color: rgba(226,231,250,.6); font-size: .68rem; } .eapps-summary strong { display: block; margin-top: 3px; font-size: 1.55rem; } .eapps-summary p { margin: 0 0 0 auto; color: rgba(226,231,250,.6); font-size: .75rem; }
  .eapps-toolbar { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 15px; } .eapps-search { flex: 1; gap: 9px; min-height: 44px; padding: 0 13px; border: 1px solid rgba(255,255,255,.1); border-radius: 13px; background: rgba(8,14,34,.54); } .eapps-search svg { width: 17px; color: #99a6ed; } .eapps-search input { width: 100%; color: #f4f6ff; border: 0; outline: 0; background: transparent; font: .76rem Inter, sans-serif; } .eapps-search input::placeholder { color: rgba(224,230,255,.35); } .eapps-page-note { align-self: center; color: rgba(226,231,250,.48); font-size: .67rem; white-space: nowrap; }
  .eapps-list { display: grid; gap: 11px; } .eapps-card { align-items: flex-start; gap: 13px; padding: 17px; border: 1px solid rgba(255,255,255,.1); border-radius: 18px; background: linear-gradient(135deg,rgba(22,30,62,.88),rgba(12,18,39,.9)); box-shadow: inset 0 1px 0 rgba(255,255,255,.045); } .eapps-avatar { width: 42px; height: 42px; color: #fff; border-radius: 13px; background: linear-gradient(145deg,#6576ef,#3badcf); font-size: .74rem; font-weight: 800; } .eapps-card-main { min-width: 0; flex: 1; } .eapps-card-top { justify-content: space-between; gap: 10px; } .eapps-card h2 { margin: 0; font-size: .94rem; } .eapps-card-top p { margin: 4px 0 0; color: rgba(226,231,250,.5); font-size: .65rem; } .eapps-status { flex: 0 0 auto; padding: 5px 8px; color: #9ee9c8; border-radius: 999px; background: rgba(71,194,139,.12); font-size: .59rem; font-weight: 800; text-transform: capitalize; } .eapps-contact { flex-wrap: wrap; gap: 7px 14px; margin-top: 12px; color: rgba(226,231,250,.68); font-size: .68rem; } .eapps-contact span { display: inline-flex; align-items: center; gap: 5px; overflow-wrap: anywhere; } .eapps-contact svg { width: 13px; color: #a9b4f9; } .eapps-cover-letter { display: -webkit-box; overflow: hidden; margin: 12px 0 0; color: rgba(230,235,252,.58); font-size: .7rem; line-height: 1.55; -webkit-box-orient: vertical; -webkit-line-clamp: 2; } .eapps-actions { flex-wrap: wrap; gap: 9px; margin-top: 14px; } .eapps-actions a, .eapps-results { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-height: 34px; padding: 0 10px; color: #dce1ff; border: 1px solid rgba(144,156,255,.24); border-radius: 9px; background: rgba(104,121,255,.1); font: 750 .64rem Inter, sans-serif; text-decoration: none; } .eapps-results { color: #b7caff; cursor: pointer; } .eapps-results:hover { border-color: rgba(144,156,255,.38); background: rgba(104,121,255,.17); } .eapps-actions svg { width: 13px; } .eapps-unavailable { color: rgba(226,231,250,.4); font-size: .66rem; }
  .eapps-state { display: grid; place-items: center; min-height: 310px; padding: 28px; text-align: center; border: 1px solid rgba(255,255,255,.1); border-radius: 19px; background: rgba(16,23,49,.64); } .eapps-state > svg { width: 34px; height: 34px; color: #9aa8f7; } .eapps-state h2 { margin: 13px 0 0; font-size: 1rem; } .eapps-state p { max-width: 430px; margin: 7px 0 0; color: rgba(226,231,250,.55); font-size: .74rem; line-height: 1.55; } .eapps-state button { margin-top: 16px; } .eapps-error > svg { color: #fa9cab; }
  .eapps-pagination { justify-content: center; gap: 14px; margin-top: 18px; } .eapps-pagination span { color: rgba(226,231,250,.6); font-size: .7rem; }

  .eapps-modal { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 18px; background: rgba(2,5,17,.78); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
  .eapps-modal-card { width: min(100%, 980px); max-height: 90vh; overflow-y: auto; color: #f7f8ff; border: 1px solid rgba(255,255,255,.14); border-radius: 22px; background: linear-gradient(150deg, rgba(24,32,69,.98), rgba(14,18,43,.98)); box-shadow: 0 34px 90px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.1); }
  .eapps-modal-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; padding: 22px 24px; border-bottom: 1px solid rgba(255,255,255,.09); } .eapps-modal-head h2 { margin: 5px 0 0; font-size: 1.3rem; } .eapps-modal-head p { margin: 5px 0 0; color: rgba(226,231,250,.55); font-size: .72rem; }
  .eapps-modal-close { display: grid; place-items: center; width: 36px; height: 36px; color: #edf0ff; border: 1px solid rgba(255,255,255,.13); border-radius: 11px; background: rgba(255,255,255,.06); cursor: pointer; } .eapps-modal-close svg { width: 16px; }
  .eapps-results-state { display: grid; place-items: center; min-height: 250px; padding: 26px; text-align: center; } .eapps-results-state > svg { width: 32px; color: #9aa8f7; } .eapps-results-state h3 { margin: 12px 0 0; font-size: 1rem; } .eapps-results-state p { margin: 7px 0 0; color: rgba(226,231,250,.55); font-size: .74rem; } .eapps-results-state button { display: inline-flex; align-items: center; gap: 7px; min-height: 38px; margin-top: 14px; padding: 0 12px; color: #fff; border: 1px solid rgba(255,255,255,.14); border-radius: 10px; background: rgba(255,255,255,.07); cursor: pointer; } .eapps-results-state button svg { width: 14px; }
  .eapps-result-banner { display: flex; align-items: flex-start; gap: 12px; margin: 18px 22px 0; padding: 14px; border-radius: 15px; border: 1px solid rgba(255,255,255,.1); background: rgba(255,255,255,.045); } .eapps-result-banner > span { display: grid; place-items: center; flex: 0 0 auto; width: 38px; height: 38px; border-radius: 12px; } .eapps-result-banner svg { width: 18px; } .eapps-result-banner strong { display: block; font-size: .86rem; } .eapps-result-banner p { margin: 5px 0 0; color: rgba(226,231,250,.58); font-size: .7rem; } .eapps-result-eligible > span { color: #8df0ca; background: rgba(61,213,156,.13); } .eapps-result-not-eligible > span { color: #ffb0c5; background: rgba(237,69,117,.12); }
  .eapps-result-meta { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 9px; margin: 14px 22px 0; } .eapps-result-meta div { min-width: 0; padding: 12px; border: 1px solid rgba(255,255,255,.08); border-radius: 13px; background: rgba(3,7,22,.28); } .eapps-result-meta small { display: block; color: rgba(226,231,250,.42); font-size: .58rem; } .eapps-result-meta strong { display: block; margin-top: 4px; overflow: hidden; color: #fff; font-size: .9rem; text-overflow: ellipsis; white-space: nowrap; }
  .eapps-question-list { display: grid; gap: 11px; padding: 18px 22px 0; } .eapps-question { padding: 15px; border: 1px solid rgba(255,255,255,.09); border-radius: 16px; background: rgba(255,255,255,.035); } .eapps-question-correct { border-color: rgba(95,221,167,.19); } .eapps-question-wrong { border-color: rgba(255,126,161,.19); } .eapps-question-head { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; } .eapps-question-head span { display: grid; place-items: center; min-width: 34px; height: 28px; color: #fff; border-radius: 9px; background: linear-gradient(145deg,#6576ef,#3badcf); font-size: .64rem; font-weight: 800; } .eapps-question-head strong { color: rgba(226,231,250,.58); font-size: .64rem; } .eapps-question-head i { margin-left: auto; color: #fff; border-radius: 999px; padding: 4px 8px; background: rgba(255,255,255,.07); font-size: .58rem; font-style: normal; font-weight: 800; } .eapps-question > p { margin: 0 0 12px; color: rgba(247,248,255,.9); font-size: .82rem; line-height: 1.55; }
 .eapps-question-head i { display: inline-flex; align-items: center; gap: 4px; margin-left: auto; border-radius: 999px; padding: 4px 9px; font-size: .58rem; font-style: normal; font-weight: 800; }
  .eapps-question-head i svg { width: 12px; height: 12px; }
  .eapps-badge-correct { color: #7CF0BE; background: rgba(61,213,156,.16); }
  .eapps-badge-wrong { color: #FF9BB3; background: rgba(237,69,117,.16); }

  .eapps-options { display: grid; gap: 7px; }
  .eapps-option { display: flex; align-items: flex-start; gap: 10px; padding: 9px 10px; border: 1px solid rgba(255,255,255,.075); border-radius: 11px; background: rgba(3,7,22,.22); transition: background .15s ease, border-color .15s ease; }
  .eapps-option-icon { display: grid; place-items: center; flex: 0 0 auto; width: 16px; height: 16px; margin-top: 1px; }
  .eapps-option-icon svg { width: 14px; height: 14px; }
  .eapps-option-text { flex: 1; color: rgba(230,235,252,.76); font-size: .72rem; line-height: 1.45; }
  .eapps-option small { flex: 0 0 auto; align-self: center; color: rgba(226,231,250,.45); font-size: .58rem; font-weight: 800; }

  .eapps-option-neutral .eapps-option-icon { visibility: hidden; }
  .eapps-option-actual { border-color: rgba(95,221,167,.35); background: rgba(71,194,139,.12); }
  .eapps-option-actual .eapps-option-icon { color: #6fe3ad; }
  .eapps-option-actual small { color: #8df0ca; }
  .eapps-option-hit { border-color: rgba(95,221,167,.55); background: rgba(71,194,139,.2); box-shadow: 0 0 0 1px rgba(95,221,167,.25) inset; }
  .eapps-option-hit .eapps-option-icon { color: #8df0ca; }
  .eapps-option-hit small { color: #8df0ca; }
  .eapps-option-miss { border-color: rgba(255,126,161,.45); background: rgba(237,69,117,.16); }
  .eapps-option-miss .eapps-option-icon { color: #ff9bb3; }
  .eapps-option-miss small { color: #ffb0c5; }

  .eapps-answer-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 11px; }
  .eapps-answer-chip { padding: 6px 10px; border-radius: 9px; font-size: .68rem; }
  .eapps-answer-chip strong { margin-left: 2px; }
  .eapps-answer-actual { color: #a8f2cf; background: rgba(71,194,139,.12); border: 1px solid rgba(95,221,167,.22); }
  .eapps-answer-user-correct { color: #a8f2cf; background: rgba(71,194,139,.12); border: 1px solid rgba(95,221,167,.22); }
  .eapps-answer-user-wrong { color: #ffb6c9; background: rgba(237,69,117,.12); border: 1px solid rgba(255,126,161,.28); }

  .eapps-history { display: grid; gap: 7px; margin: 18px 22px 22px; padding: 14px; border: 1px solid rgba(255,255,255,.08); border-radius: 15px; background: rgba(3,7,22,.22); } .eapps-history > strong { font-size: .76rem; } .eapps-history div { display: flex; justify-content: space-between; gap: 10px; color: rgba(226,231,250,.62); font-size: .68rem; } .eapps-history small { color: rgba(226,231,250,.4); }

  @media (max-width: 620px) { .eapps-result-meta { grid-template-columns: repeat(2, minmax(0, 1fr)); } .eapps-modal-card { max-height: 94vh; } .eapps-modal-head { padding: 18px; } .eapps-result-banner, .eapps-result-meta, .eapps-history { margin-left: 16px; margin-right: 16px; } .eapps-question-list { padding-left: 16px; padding-right: 16px; } .eapps-options div { display: block; } .eapps-options small { display: block; margin-top: 5px; } .eapps-header { align-items: flex-start; } .eapps-heading-icon { width: 43px; height: 43px; border-radius: 14px; } .eapps-heading p { font-size: .73rem; line-height: 1.45; } .eapps-refresh { min-width: 42px; padding: 0 11px; font-size: 0; } .eapps-refresh svg { width: 17px; } .eapps-summary { align-items: flex-start; } .eapps-summary p { display: none; } .eapps-toolbar { display: block; } .eapps-page-note { display: block; margin-top: 8px; } .eapps-card { padding: 14px; } .eapps-card-top { align-items: flex-start; } .eapps-contact { gap: 7px 10px; } .eapps-pagination { gap: 8px; } .eapps-pagination button { padding: 0 9px; } } @media (max-width: 380px) { .eapps-heading-icon { display: none; } .eapps-card { gap: 10px; } .eapps-avatar { width: 36px; height: 36px; border-radius: 11px; } .eapps-pagination span { display: none; } }
`;

export default EmployeeApplicationsComingSoon;
