import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  Search,
  ClipboardList,
  UploadCloud,
  Cpu,
  BarChart3,
  Play,
  CheckSquare,
  Trophy,
  Target,
  FileEdit,
  RefreshCw,
  LineChart,
  X,
  ChevronLeft,
  ChevronRight,
  Compass,
  CheckCircle2,
  RotateCcw,
  ExternalLink,
  BookOpen
} from "lucide-react";

interface WalkInInterviewStepsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActionClick?: () => void;
}

interface StepItem {
  id: string;
  num: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  category: "pre-exam" | "exam" | "post-exam";
}

const STEPS_DATA: StepItem[] = [
  {
    id: "step3",
    num: "01",
    title: "Explore Job Openings",
    description: 'You are redirected to the "Find Your Next Opportunity" page — browse all available roles.',
    icon: Lightbulb,
    color: "from-purple-500 to-pink-500",
    category: "pre-exam",
  },
  {
    id: "step4",
    num: "02",
    title: "Select a Job Opening",
    description: "Choose the role that matches your profile and interests.",
    icon: Search,
    color: "from-pink-500 to-rose-500",
    category: "pre-exam",
  },
  {
    id: "step5",
    num: "03",
    title: "View Job Details",
    description: 'Click "View Job Details" to review the full description and requirements.',
    icon: ClipboardList,
    color: "from-rose-500 to-orange-500",
    category: "pre-exam",
  },
  {
    id: "step6",
    num: "04",
    title: "Apply Now & Upload Resume",
    description: 'Click "Apply Now" and upload your resume when prompted.',
    icon: UploadCloud,
    color: "from-orange-500 to-amber-500",
    category: "pre-exam",
  },
  {
    id: "step7",
    num: "05",
    title: "ATS Resume Scan",
    description: "The Applicant Tracking System automatically scans your uploaded resume.",
    icon: Cpu,
    color: "from-amber-500 to-yellow-500",
    category: "pre-exam",
  },
  {
    id: "step8",
    num: "06",
    title: "ATS Scorecard Generated",
    description: "Your ATS scorecard is generated along with exam instructions.",
    icon: BarChart3,
    color: "from-emerald-500 to-teal-500",
    category: "pre-exam",
  },
  {
    id: "step9",
    num: "07",
    title: "Start the Exam",
    description: "Read all instructions carefully, then click 'Start Exam' to begin.",
    icon: Play,
    color: "from-teal-500 to-cyan-500",
    category: "exam",
  },
  {
    id: "step10",
    num: "08",
    title: "Complete & Submit Exam",
    description: "Answer all questions and submit the exam.",
    icon: CheckSquare,
    color: "from-cyan-500 to-sky-500",
    category: "exam",
  },
  {
    id: "step11",
    num: "09",
    title: "Exam Scorecard",
    description: "Your exam results scorecard is displayed immediately after submission.",
    icon: Trophy,
    color: "from-sky-500 to-blue-500",
    category: "exam",
  },
  {
    id: "step12",
    num: "10",
    title: "Complete Final Step",
    description: 'Click "Complete Final Step" to proceed to the cover letter section.',
    icon: Target,
    color: "from-indigo-600 to-purple-600",
    category: "post-exam",
  },
  {
    id: "step13",
    num: "11",
    title: "Submit Cover Letter",
    description: "Fill in all required details and click Submit.",
    icon: FileEdit,
    color: "from-purple-600 to-pink-600",
    category: "post-exam",
  },
  {
    id: "step14",
    num: "12",
    title: "Redirected to My Applications",
    description: "You are redirected to the My Job Applications page.",
    icon: RefreshCw,
    color: "from-pink-600 to-rose-600",
    category: "post-exam",
  },
  {
    id: "step15",
    num: "13",
    title: "Track Your Application",
    description: "Monitor the status and progress of your application anytime.",
    icon: LineChart,
    color: "from-rose-600 to-violet-700",
    category: "post-exam",
  },
];

const WalkInInterviewStepsModal: React.FC<WalkInInterviewStepsModalProps> = ({
  isOpen,
  onClose,
  onActionClick,
}) => {
  const [viewMode, setViewMode] = useState<"timeline" | "wizard">("timeline");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeWizardIndex, setActiveWizardIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<"all" | "pre-exam" | "exam" | "post-exam">("all");
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Load completed steps from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("walkin_completed_steps");
      if (saved) {
        setCompletedSteps(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load completed steps", e);
    }
  }, []);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const toggleStepCompleted = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...completedSteps, [id]: !completedSteps[id] };
    setCompletedSteps(updated);
    localStorage.setItem("walkin_completed_steps", JSON.stringify(updated));
  };

  const resetProgress = () => {
    setCompletedSteps({});
    localStorage.removeItem("walkin_completed_steps");
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const filteredSteps = STEPS_DATA.filter((step) => {
    const matchesSearch =
      step.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.num.includes(searchQuery);

    const matchesCategory = activeCategory === "all" || step.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const completionCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completionCount / STEPS_DATA.length) * 100);

  // Go to step in wizard from timeline click
  const handleStepClickInTimeline = (originalIndex: number) => {
    setActiveWizardIndex(originalIndex);
    setViewMode("wizard");
  };

  const handleAction = () => {
    if (onActionClick) {
      onActionClick();
    } else {
      window.open("https://www.askoxy.ai/", "_blank");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[99999] flex items-start md:items-center justify-center p-2 sm:p-4 overflow-y-auto bg-slate-950/85 backdrop-blur-md"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-purple-950/20 text-slate-100 flex flex-col max-h-[92vh] md:max-h-[85vh] my-auto"
          ref={modalContentRef}
        >
          {/* Neon Glow Effects */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header Section */}
          <div className="relative z-10 px-6 pt-6 pb-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/20">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></span>
                  July 25 Walk-in Interview
                </span>
                <span className="text-slate-500 text-xs">•</span>
                <span className="text-slate-400 text-xs font-mono">{STEPS_DATA.length} Core Steps</span>
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-purple-300">
                Entry Steps — Walk-in Interview
              </h2>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleAction}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-750 hover:to-indigo-750 text-white flex items-center gap-1.5 shadow-lg shadow-purple-900/20 transition-all hover:translate-y-[-1px] active:scale-95"
              >
                Start Applying <ExternalLink size={13} />
              </button>

              <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex gap-1">
                <button
                  onClick={() => setViewMode("timeline")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    viewMode === "timeline"
                      ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Compass size={14} /> Roadmap
                  </span>
                </button>
                <button
                  onClick={() => setViewMode("wizard")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    viewMode === "wizard"
                      ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={14} /> Wizard
                  </span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Progress Tracker Strip */}
          <div className="relative z-10 bg-slate-950/60 px-6 py-3 border-b border-slate-800/60 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center bg-slate-900 font-mono text-xs font-bold text-purple-400">
                {progressPercent}%
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-300">Your Progress</p>
                <p className="text-[10px] text-slate-500">
                  {completionCount} of {STEPS_DATA.length} steps marked done
                </p>
              </div>
            </div>
            <div className="flex-1 max-w-[200px] md:max-w-xs bg-slate-800 h-2 rounded-full overflow-hidden mx-4">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {completionCount > 0 && (
              <button
                onClick={resetProgress}
                className="text-[10px] text-slate-400 hover:text-rose-400 font-semibold flex items-center gap-1 transition-colors"
              >
                <RotateCcw size={10} /> Reset
              </button>
            )}
          </div>

          {/* Filter Bar (Only visible in Timeline Mode) */}
          {viewMode === "timeline" && (
            <div className="relative z-10 px-6 py-3 border-b border-slate-800/40 bg-slate-900/50 flex flex-col sm:flex-row gap-3 items-center justify-between">
              {/* Categories */}
              <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
                {(["all", "pre-exam", "exam", "post-exam"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${
                      activeCategory === cat
                        ? "bg-slate-100 text-slate-950 border-slate-100"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {cat === "all" ? "All Steps" : cat.replace("-", " ")}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
                <input
                  type="text"
                  placeholder="Search steps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-white"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Modal Main Body Content */}
          <div className="flex-1 overflow-y-auto p-6 relative z-10 bg-slate-900/40 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {viewMode === "timeline" ? (
              /* ===================================================== */
              /* 📋 TIMELINE / ROADMAP VIEW */
              /* ===================================================== */
              <div className="relative">
                {/* Vertical Center Line */}
                <div className="absolute left-6 md:left-8 top-4 bottom-4 w-0.5 bg-slate-800/80 pointer-events-none" />

                {filteredSteps.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-400 font-medium mb-1">No steps match your filters.</p>
                    <p className="text-xs text-slate-600">Try clearing the search or switching filters.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredSteps.map((step) => {
                      const StepIcon = step.icon;
                      const isCompleted = !!completedSteps[step.id];
                      const originalIndex = STEPS_DATA.findIndex((s) => s.id === step.id);

                      return (
                        <motion.div
                          key={step.id}
                          layoutId={step.id}
                          className={`relative flex gap-4 md:gap-6 group items-start p-4 rounded-2xl transition-all duration-200 cursor-pointer ${
                            isCompleted
                              ? "bg-emerald-950/10 border border-emerald-500/10 hover:bg-emerald-950/20 animate-pulse-once"
                              : "bg-slate-950/40 border border-slate-800/30 hover:border-slate-850 hover:bg-slate-950/60"
                          }`}
                          onClick={() => handleStepClickInTimeline(originalIndex)}
                        >
                          {/* Step Badge / Number Icon */}
                          <div className="relative z-10 flex-shrink-0">
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
                                isCompleted
                                  ? "bg-emerald-600 text-white shadow-emerald-900/20"
                                  : `bg-gradient-to-br ${step.color} text-white group-hover:scale-105`
                              }`}
                            >
                              <StepIcon size={20} className="stroke-[2.2]" />
                            </div>

                            {/* Little number bubble */}
                            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400">
                              {step.num}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex items-center justify-between gap-4 mb-1">
                              <h3
                                className={`text-sm md:text-base font-bold truncate transition-colors ${
                                  isCompleted ? "text-emerald-300 line-through opacity-70" : "text-white"
                                }`}
                              >
                                {step.title}
                              </h3>

                              {/* Category pill */}
                              <span
                                className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider border ${
                                  step.category === "exam"
                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                    : step.category === "post-exam"
                                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                    : "bg-slate-800 text-slate-400 border-slate-700/50"
                                }`}
                              >
                                {step.category.replace("-", " ")}
                              </span>
                            </div>

                            <p
                              className={`text-xs leading-relaxed ${
                                isCompleted ? "text-slate-500" : "text-slate-400 group-hover:text-slate-300"
                              }`}
                            >
                              {step.description}
                            </p>
                          </div>

                          {/* Complete Checkbox */}
                          <button
                            onClick={(e) => toggleStepCompleted(step.id, e)}
                            className={`flex-shrink-0 self-center w-8 h-8 rounded-xl flex items-center justify-center transition-all border ${
                              isCompleted
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                                : "bg-slate-900 text-slate-600 border-slate-800 hover:border-slate-700 hover:text-slate-300"
                            }`}
                            title={isCompleted ? "Mark incomplete" : "Mark as completed"}
                          >
                            <CheckCircle2 size={16} className={isCompleted ? "fill-emerald-400/20" : ""} />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* ===================================================== */
              /* 📖 INTERACTIVE WIZARD / SLIDE VIEW */
              /* ===================================================== */
              <div className="flex flex-col items-center justify-center min-h-[320px] max-w-lg mx-auto py-4">
                <AnimatePresence mode="wait">
                  {(() => {
                    const step = STEPS_DATA[activeWizardIndex];
                    const StepIcon = step.icon;
                    const isCompleted = !!completedSteps[step.id];

                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.25 }}
                        className="w-full text-center space-y-6"
                      >
                        {/* Huge animated Icon */}
                        <div className="relative inline-block">
                          <div
                            className={`w-28 h-28 rounded-3xl mx-auto flex items-center justify-center shadow-xl transition-all duration-300 ${
                              isCompleted
                                ? "bg-emerald-600 text-white shadow-emerald-950/30"
                                : `bg-gradient-to-br ${step.color} text-white shadow-purple-950/30`
                            }`}
                          >
                            <StepIcon size={48} className="stroke-[1.8]" />
                          </div>
                          {/* Large Number Overlay */}
                          <div className="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-slate-950 border-2 border-slate-800 flex items-center justify-center font-mono text-base font-extrabold text-purple-400">
                            {step.num}
                          </div>
                        </div>

                        {/* Title and Description */}
                        <div className="space-y-3 px-4">
                          <span className="text-[10px] font-extrabold tracking-widest text-purple-400 uppercase">
                            Step {activeWizardIndex + 1} of {STEPS_DATA.length} • {step.category.replace("-", " ")}
                          </span>
                          <h3 className="text-xl md:text-2xl font-extrabold text-white">
                            {step.title}
                          </h3>
                          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                            {step.description}
                          </p>
                        </div>

                        {/* Checkbox status action */}
                        <div className="flex justify-center pt-2">
                          <button
                            onClick={(e) => toggleStepCompleted(step.id, e)}
                            className={`px-5 py-2.5 rounded-2xl font-semibold text-xs flex items-center gap-2 border transition-all ${
                              isCompleted
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30"
                                : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white"
                            }`}
                          >
                            <CheckCircle2 size={16} />
                            {isCompleted ? "Step Completed!" : "Mark this Step Done"}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>

                {/* Wizard Navigation Buttons */}
                <div className="w-full flex items-center justify-between mt-10 px-4">
                  <button
                    onClick={() => setActiveWizardIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activeWizardIndex === 0}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      activeWizardIndex === 0
                        ? "bg-slate-950/20 text-slate-600 border-slate-800/40 cursor-not-allowed"
                        : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    <ChevronLeft size={16} /> Back
                  </button>

                  {/* Wizard Dot Indicator */}
                  <div className="hidden sm:flex gap-1.5 max-w-[200px] overflow-x-auto py-1">
                    {STEPS_DATA.map((s, idx) => (
                      <button
                        key={s.id}
                        onClick={() => setActiveWizardIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === activeWizardIndex
                            ? "w-6 bg-purple-500"
                            : completedSteps[s.id]
                            ? "w-2 bg-emerald-500"
                            : "w-2 bg-slate-800 hover:bg-slate-700"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setActiveWizardIndex((prev) =>
                        Math.min(STEPS_DATA.length - 1, prev + 1)
                      )
                    }
                    disabled={activeWizardIndex === STEPS_DATA.length - 1}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      activeWizardIndex === STEPS_DATA.length - 1
                        ? "bg-slate-950/20 text-slate-600 border-slate-800/40 cursor-not-allowed"
                        : "bg-purple-600 text-white border-purple-500/20 hover:bg-purple-750"
                    }`}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Section */}
          <div className="relative z-10 px-6 py-4 border-t border-slate-800 bg-slate-950/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">
                {/* Initiative of Oxykart Technologies Pvt Ltd */}
              </span>
              <span className="text-[9px] text-slate-600 block">
                {/* FTCCI Member Company • Registration Number: 12202 */}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
              >
                Close
              </button>
              <button
                onClick={handleAction}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-750 hover:to-indigo-750 text-white flex items-center gap-1.5 shadow-lg shadow-purple-900/30 transition-all hover:translate-y-[-1px]"
              >
                Start Applying Now <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WalkInInterviewStepsModal;
