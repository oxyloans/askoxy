import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import Logo from "../../assets/img/askoxylogonew.png";
import "./FreeATSResumeChecker.css";
import {
  ATS_API_BASE,
  getResumeStatus,
  uploadResume,
  type ResumeStatusResponse,
} from "./atsResumeService";
import { AtsInformationSections } from "./AtsInformationSections";

type StatusType = "idle" | "loading" | "success" | "error";
type ProcessingStage = "uploading" | "analyzing";

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

const publicCopy = (value: unknown): string =>
  String(value ?? "")
    .replace(/ATS-friendly/gi, "screening-friendly")
    .replace(/\bATS\b/gi, "resume screening")
    .replace(/\bfree\b/gi, "");

const ATSResumeChecker: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingAbortRef = useRef<AbortController | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileNameText, setFileNameText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [processingStage, setProcessingStage] =
    useState<ProcessingStage>("uploading");
  const [statusCheckCount, setStatusCheckCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<StatusType>("idle");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    clearStaleGuestIds();

    return () => {
      pollingAbortRef.current?.abort();
    };
  }, []);

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
      setFileNameText("Please select a PDF, DOC or DOCX file.");
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
    async (
      jobId: string,
      signal: AbortSignal,
    ): Promise<ResumeStatusResponse> => {
      let attempt = 0;
      while (!signal.aborted) {
        attempt += 1;
        setStatusCheckCount(attempt);
        const { response, data } = await getResumeStatus(jobId, signal);

        if (!response.ok) {
          throw new Error(
            data.message ||
              data.errorMessage ||
              "Unable to retrieve the resume report.",
          );
        }

        if (data.resumeStatus === "COMPLETED") {
          if (!data.atsReport) {
            throw new Error(
              data.errorMessage || "The resume report was not generated.",
            );
          }
          return data;
        }

        if (["REJECTED", "FAILED", "ERROR"].includes(data.resumeStatus)) {
          throw new Error(
            data.message || data.errorMessage || "Resume analysis failed.",
          );
        }

        setStatus(`Analyzing your resume… Status check ${attempt}`, "loading");
        await wait(2000);
      }

      throw new DOMException("Resume analysis was cancelled.", "AbortError");
    },
    [],
  );

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
    setProcessingStage("uploading");
    setStatusCheckCount(0);
    pollingAbortRef.current?.abort();
    const pollingController = new AbortController();
    pollingAbortRef.current = pollingController;

    try {
      setStatus("Uploading your resume securely…", "loading");
      const { response, data: upload } = await uploadResume(
        activeUserId,
        selectedFile,
        pollingController.signal,
      );

      if (
        !response.ok ||
        upload.resumeStatus === "REJECTED" ||
        upload.resumeStatus === "FAILED" ||
        !upload.jobId
      ) {
        throw new Error(
          upload.message ||
            upload.errorMessage ||
            `The upload could not be completed (${response.status}). Please try again.`,
        );
      }

      setStatus(
        upload.resumeStatus === "COMPLETED"
          ? "Preparing your resume report…"
          : "Resume uploaded. Analysis is in progress…",
        "loading",
      );
      setProcessingStage("analyzing");

      const completed = await getStatus(upload.jobId, pollingController.signal);
      setStatus("Resume analyzed successfully.", "success");
      navigate(`/resume-ai-interview/report/${encodeURIComponent(completed.jobId)}`);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      const mixed =
        window.location.protocol === "https:" && ATS_API_BASE.startsWith("http:");
      setStatus(
        mixed
          ? "The browser blocked the HTTP API on this HTTPS website. Configure an HTTPS API domain or reverse proxy."
          : error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        "error",
      );
    } finally {
      if (pollingAbortRef.current === pollingController) {
        pollingAbortRef.current = null;
      }
      setIsChecking(false);
    }
  };

  return (
    <>

      <div className="ats-page min-h-screen bg-white">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-[#e2e8f0] bg-white/95 backdrop-blur-md">
          <nav className="ats-container flex min-h-[76px] items-center justify-between gap-3">
            <Link to="/" className="ats-brand">
              <img src={Logo} alt="ASKOXY.AI home" className="ats-logo" />
            </Link>
            <div className="hidden items-center gap-5 sm:flex">
              <a href="#features" className="ats-nav-link hidden sm:inline">
                What You Get
              </a>
              <a href="#how" className="ats-nav-link hidden sm:inline">
                How It Works
              </a>
              <a href="#resources" className="ats-nav-link hidden md:inline">
                Resume Tips
              </a>
              <a href="#faq" className="ats-nav-link hidden lg:inline">
                FAQs
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
                    ["What You Get", "#features"],
                    ["How It Works", "#how"],
                    ["Resume Tips", "#resources"],
                    ["FAQs", "#faq"],
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
                <span className="ats-eyebrow">Resume Checker</span>
                <h1 className="my-[18px] text-[clamp(34px,5.2vw,64px)] font-black leading-[1.05] tracking-[-1.5px] sm:tracking-[-2.5px]">
                  <span className="ats-score-word">Resume Score</span>
                </h1>
                <p className="ats-hero-tagline">
                  Is your resume good enough?
                </p>
                <p className="mt-0 max-w-[650px] text-lg text-[#64748b]">
                  Upload your resume to receive a score based on structure,
                  readability, completeness and screening compatibility, plus
                  practical recommendations for your next application.
                </p>
                <div className="my-6 flex flex-wrap gap-3.5 text-sm font-semibold text-[#334155] sm:my-7">
                  {[
                    "Clear resume score",
                    "PDF, DOC & DOCX support",
                    "Clear improvement guidance",
                    "Recruiter-ready insights",
                  ].map((point) => (
                    <span key={point}>
                      <span className="mr-1.5 font-black text-[#249a71]">
                        ✓
                      </span>
                      {point}
                    </span>
                  ))}
                </div>
                <p className="m-0 max-w-[600px] text-sm font-medium text-[#64748b]">
                  Understand your resume. Strengthen your story. Apply with
                  greater confidence.
                </p>
              </motion.div>

              <motion.div
                id="uploadBox"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="ats-upload-card w-full max-w-[650px] rounded-[22px] p-[18px] sm:p-[26px] lg:max-w-none"
              >
                {!isChecking && (
                  <motion.div
                    key="resume-upload-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                <h2 className="m-0 mb-1 text-2xl font-extrabold">
                  Upload your resume
                </h2>
                <p className="mb-5 mt-0 text-sm text-[#64748b]">
                  Receive your resume score and focused feedback in just a few moments.
                </p>

                <label
                  id="resume-dropzone"
                  htmlFor="fileInput"
                  aria-disabled={isChecking}
                  aria-describedby="resume-file-help"
                  tabIndex={isChecking ? -1 : 0}
                  onKeyDown={(event) => {
                    if (
                      !isChecking &&
                      (event.key === "Enter" || event.key === " ")
                    ) {
                      event.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  className={`ats-dropzone ${isDragging ? "drag" : ""} ${
                    isChecking ? "pointer-events-none opacity-60" : ""
                  }`}
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
                  <span className="ats-upload-icon" aria-hidden="true">
                    <UploadCloud size={30} strokeWidth={1.9} />
                  </span>
                  <strong className="block">
                    Drop your resume here or choose a file
                  </strong>
                  <small id="resume-file-help" className="text-[#627d98]">
                    PDF, DOC or DOCX · Maximum 5 MB
                  </small>
                </label>

                <input
                  ref={fileInputRef}
                  id="fileInput"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  disabled={isChecking}
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0])}
                />

                <div
                  className={`mt-2.5 min-h-[22px] text-sm font-bold ${
                    fileNameText.startsWith("✓")
                      ? "text-[#249a71]"
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
                    disabled={isChecking}
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
                      <span className="ats-spinner" />
                      {processingStage === "uploading"
                        ? "Uploading Securely…"
                        : "Analyzing Resume…"}
                    </>
                  ) : (
                    "Generate Resume Score"
                  )}
                </button>
                  </motion.div>
                )}

                <AnimatePresence>
                  {isChecking && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="ats-processing-panel"
                      role="status"
                      aria-live="polite"
                      aria-busy="true"
                    >
                      <div className="ats-processing-heading">
                        <div className="relative mt-0.5 h-12 w-12 shrink-0">
                          <span className="absolute inset-0 animate-ping rounded-full bg-[#5f4dc7]/20 opacity-50" />
                          <span className="absolute inset-1 grid place-items-center rounded-full bg-gradient-to-br from-[#5f4dc7] to-[#7868d6] text-lg text-white shadow-md">
                            {processingStage === "uploading" ? "↑" : "✦"}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="m-0 text-base font-extrabold text-slate-900">
                            {processingStage === "uploading"
                              ? "Uploading your resume securely"
                              : "Creating your resume report"}
                          </h3>
                          <p className="mb-0 mt-1 text-sm leading-5 text-slate-600">
                            {processingStage === "uploading"
                              ? "Please keep this page open while we prepare your resume for analysis."
                              : "We’re reviewing structure, skills, readability, formatting and screening compatibility. This may take a few moments."}
                          </p>
                        </div>
                      </div>

                      <div className="ats-processing-file">
                        <span className="ats-processing-file-icon" aria-hidden="true">▣</span>
                        <div>
                          <strong>{selectedFile?.name || "Uploaded resume"}</strong>
                          <small>{selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : "Ready for analysis"}</small>
                        </div>
                        <span className="ats-processing-file-secure">Secure</span>
                      </div>

                      <div
                        className="mt-4 h-2 overflow-hidden rounded-full bg-[#5f4dc7]/10"
                        role="progressbar"
                        aria-label="Resume analysis in progress"
                      >
                        <motion.div
                          className="h-full w-2/5 rounded-full bg-gradient-to-r from-[#5f4dc7] via-[#feb251] to-[#5f4dc7]"
                          animate={{ x: ["-100%", "250%"] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] font-bold sm:text-xs">
                        <span className="rounded-lg bg-[#249a71]/10 px-2 py-2 text-[#249a71]">
                          ✓ Resume selected
                        </span>
                        <span
                          className={`rounded-lg px-2 py-2 ${
                            processingStage === "analyzing"
                              ? "bg-[#249a71]/10 text-[#249a71]"
                              : "bg-[#5f4dc7]/10 text-[#5f4dc7]"
                          }`}
                        >
                          {processingStage === "analyzing" ? "✓ Uploaded" : "Uploading"}
                        </span>
                        <span className="rounded-lg bg-[#5f4dc7]/10 px-2 py-2 text-[#5f4dc7]">
                          {processingStage === "analyzing"
                            ? `Analyzing${statusCheckCount ? ` · ${statusCheckCount}` : ""}`
                            : "Next: Analysis"}
                        </span>
                      </div>

                      <p className="ats-processing-note">
                        Do not refresh or close this page until your report is ready.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {statusType !== "idle" &&
                    statusMessage &&
                    !(isChecking && statusType === "loading") && (
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
                      {publicCopy(statusMessage)}
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="mt-3 text-center text-xs text-[#64748b]">
                  Your resume is securely submitted for analysis.
                </p>
              </motion.div>
            </div>
          </section>


          <AtsInformationSections />
        </main>

        <footer className="ats-hero-bg px-0 pb-6 pt-12 text-[#64748b]">
          <div className="ats-container">
            <div className="grid gap-9 border-b border-[#e7e3f6] pb-10 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-[1.4fr_1fr_1fr]">
              <div className="mx-auto max-w-md sm:mx-0">
                <Link
                  to="/"
                  className="inline-flex rounded-xl"
                  aria-label="Go to ASKOXY.AI home"
                >
                  <img src={Logo} alt="ASKOXY.AI" className="ats-logo" />
                </Link>
                <p className="mb-0 mt-4 text-sm leading-6 text-[#64748b]">
                  ASKOXY.AI helps you understand resume quality, identify
                  high-impact improvements and prepare a stronger application
                  with clear, practical resume guidance.
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-sm font-extrabold uppercase tracking-[0.12em] text-[#242038]">
                  Explore
                </h2>
                <nav
                  className="flex flex-col gap-2.5 text-sm"
                  aria-label="Footer navigation"
                >
                  <a href="#features" className="ats-footer-link">
                    What You Get
                  </a>
                  <a href="#how" className="ats-footer-link">
                    How It Works
                  </a>
                  <a href="#resources" className="ats-footer-link">
                    Resume Tips
                  </a>
                  <a href="#faq" className="ats-footer-link">
                    FAQs
                  </a>
                </nav>
              </div>

              <div>
                <h2 className="mb-3 text-sm font-extrabold uppercase tracking-[0.12em] text-[#242038]">
                  Start with confidence
                </h2>
                <p className="mb-4 mt-0 text-sm leading-6 text-[#64748b]">
                  Upload a PDF, DOC or DOCX file up to 5 MB and receive a clear,
                  personalized report with practical guidance.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-3 pt-6 text-center text-xs sm:flex-row sm:text-left">
              <span>
                © {new Date().getFullYear()} ASKOXY.AI. All rights reserved.
              </span>
              <span>Resume Checker · Secure resume analysis</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ATSResumeChecker;
