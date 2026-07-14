import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  ArrowRight,
  BriefcaseBusiness,
  ClipboardCheck,
  ExternalLink,
  FileCheck2,
  FileText,
  ListChecks,
  Map,
  X,
} from "lucide-react";

interface WalkInInterviewStepsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActionClick?: () => void;
}

type StepStage = "Exam" | "Post-Exam";

interface StepItem {
  id: string;
  num: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  softColor: string;
  stage?: StepStage;
}

const STEPS_DATA: StepItem[] = [
  {
    id: "choose-company",
    num: "01",
    title: "Choose a Company",
    description:
      "Select your preferred company from the dropdown to view its available job opportunities.",
    icon: Building2,
    color: "from-violet-600 to-indigo-600",
    softColor: "bg-violet-50 text-violet-700 ring-violet-100",
  },
  {
    id: "explore-jobs",
    num: "02",
    title: "Explore Job Opportunities",
    description:
      "Browse available positions, select a role that matches your profile, and review the job description and eligibility criteria.",
    icon: BriefcaseBusiness,
    color: "from-indigo-600 to-blue-600",
    softColor: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  },
  {
    id: "resume-evaluation",
    num: "03",
    title: "Apply and Complete Resume Evaluation",
    description:
      "Upload your resume and apply for the selected position. The ATS evaluates your resume and provides a scorecard with assessment instructions.",
    icon: FileCheck2,
    color: "from-blue-600 to-cyan-600",
    softColor: "bg-blue-50 text-blue-700 ring-blue-100",
  },
  {
    id: "online-assessment",
    num: "04",
    title: "Complete the Online Assessment",
    description:
      "Review the assessment instructions, answer all questions, and submit the assessment successfully.",
    icon: ClipboardCheck,
    color: "from-cyan-600 to-teal-600",
    softColor: "bg-cyan-50 text-cyan-700 ring-cyan-100",
    stage: "Exam",
  },
  {
    id: "review-results",
    num: "05",
    title: "Review Results and Continue",
    description:
      'View your assessment scorecard and click "Complete Final Step" to proceed with your application.',
    icon: ListChecks,
    color: "from-teal-600 to-emerald-600",
    softColor: "bg-teal-50 text-teal-700 ring-teal-100",
    stage: "Post-Exam",
  },
  {
    id: "cover-letter",
    num: "06",
    title: "Submit Your Cover Letter",
    description:
      "Provide the required cover letter details and submit your application for final review.",
    icon: FileText,
    color: "from-emerald-600 to-green-600",
    softColor: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    stage: "Post-Exam",
  },
  {
    id: "track-application",
    num: "07",
    title: "Track Your Application",
    description:
      'Visit "My Job Applications" to monitor your application status and track its progress throughout the recruitment process.',
    icon: Map,
    color: "from-green-600 to-lime-600",
    softColor: "bg-green-50 text-green-700 ring-green-100",
    stage: "Post-Exam",
  },
];

const WalkInInterviewStepsModal: React.FC<WalkInInterviewStepsModalProps> = ({
  isOpen,
  onClose,
  onActionClick,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight")
        setActiveStep((current) =>
          Math.min(current + 1, STEPS_DATA.length - 1),
        );
      if (event.key === "ArrowLeft")
        setActiveStep((current) => Math.max(current - 1, 0));
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleAction = () => {
    if (onActionClick) onActionClick();
    else window.open("https://www.askoxy.ai/", "_blank", "noopener,noreferrer");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[99999] flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(event) =>
          event.target === event.currentTarget && onClose()
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby="application-journey-title"
      >
        <motion.section
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex max-h-[96dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-xl bg-slate-50 shadow-2xl sm:max-h-[92vh] sm:rounded-2xl"
        >
          <header className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-indigo-950 to-violet-950 px-4 py-5 text-white sm:px-7 sm:py-6">
            <div className="absolute -right-16 -top-24 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="relative flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-violet-100">
                  <Map size={14} /> Easy Application Guide
                </div>
              </div>
              <button
                onClick={onClose}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/70"
                aria-label="Close application roadmap"
              >
                <X size={19} />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 lg:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Complete Steps
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                {STEPS_DATA.length} steps
              </span>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS_DATA.map((step, index) => {
                const isActive = activeStep === index;

                return (
                  <div className="relative" key={step.id}>
                    <button
                      onClick={() => setActiveStep(index)}
                      className={`group relative flex h-52 w-full flex-col overflow-y-auto rounded-xl border bg-white px-3 py-3 text-left transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        isActive
                          ? "-translate-y-1 border-indigo-300 shadow-lg shadow-indigo-100 ring-2 ring-indigo-100"
                          : "border-slate-200 shadow-sm shadow-slate-200/60 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
                      }`}
                      aria-current={isActive ? "step" : undefined}
                    >
                      <div className="flex items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                            {step.stage ? (
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                                  step.stage === "Exam"
                                    ? "bg-cyan-50 text-cyan-700"
                                    : "bg-emerald-50 text-emerald-700"
                                }`}
                              >
                                {step.stage}
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                                Step {index + 1}
                              </span>
                            )}
                            <span className="text-[11px] font-semibold text-slate-400">
                              {index + 1} of {STEPS_DATA.length}
                            </span>
                          </div>
                          <span className="block text-[13px] font-bold leading-5 text-slate-900">
                            {step.title}
                          </span>
                          <p className="mt-1.5 text-xs leading-4 text-slate-600">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </button>
                    {index < STEPS_DATA.length - 1 && (
                      <div
                        className={`pointer-events-none absolute z-10 flex items-center justify-center text-indigo-500 ${
                          index % 2 === 1
                            ? "-bottom-6 left-1/2 -translate-x-1/2"
                            : "-bottom-6 left-1/2 -translate-x-1/2 sm:-right-7 sm:bottom-auto sm:left-auto sm:top-1/2 sm:translate-x-0 sm:-translate-y-1/2"
                        } ${
                          index === 3
                            ? "lg:-bottom-6 lg:left-1/2 lg:right-auto lg:top-auto lg:flex lg:-translate-x-1/2 lg:translate-y-0"
                            : index % 2 === 1
                              ? "lg:-right-7 lg:bottom-auto lg:left-auto lg:top-1/2 lg:translate-x-0 lg:-translate-y-1/2"
                              : ""
                        }`}
                        aria-hidden="true"
                      >
                        <ArrowRight
                          className={`h-5 w-5 ${
                            index % 2 === 1
                              ? "rotate-90 lg:rotate-0"
                              : "rotate-90 sm:rotate-0"
                          } ${index === 3 ? "lg:rotate-90" : ""}`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <footer className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <p className="text-center text-xs text-slate-500 sm:text-left">
              Review each step before starting your application.
            </p>
            <div className="grid grid-cols-2 gap-2 sm:flex">
              <button
                onClick={onClose}
                className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={handleAction}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-xs font-bold text-white transition hover:bg-indigo-700"
              >
                Start Applying <ExternalLink size={15} />
              </button>
            </div>
          </footer>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
};

export default WalkInInterviewStepsModal;
