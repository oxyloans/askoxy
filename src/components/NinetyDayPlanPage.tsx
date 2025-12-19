import React, { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

type ModuleKey = "lo-system" | "fm-system" | "cm-system";
type ViewType = "business" | "system";

type UseCase = {
  day: number; // 1..51
  useCaseId: string;
  title: string;
  description: string;
  module: ModuleKey;
};

type PhaseTask = {
  day: number; // 52..90
  title: string;
  description: string;
  tags?: string[];
};

const C1 = "#364d69";
const C2 = "#90b7d7";
const C3 = "#173b63";

const GRAD = "linear-gradient(135deg, #364d69 0%, #90b7d7 52%, #173b63 100%)";
const SOFT_BG =
  "radial-gradient(circle at 18% 18%, rgba(144,183,215,0.22), transparent 55%), radial-gradient(circle at 82% 70%, rgba(23,59,99,0.18), transparent 55%), linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.86))";

const cx = (...classes: Array<string | false | undefined | null>) =>
  classes.filter(Boolean).join(" ");

const Pill = ({ text }: { text: string }) => (
  <span
    className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-white/70"
    style={{ borderColor: `${C2}66`, color: C3 }}
  >
    {text}
  </span>
);

const SoftCard = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={cx(
      "relative overflow-hidden rounded-3xl border bg-white/85 backdrop-blur-sm",
      className
    )}
    style={{
      borderColor: `${C2}66`,
      boxShadow: "0 14px 34px rgba(15, 23, 42, 0.06)",
    }}
  >
    {children}
  </div>
);

const PrimaryBtn = ({
  label,
  onClick,
  className = "",
}: {
  label: string;
  onClick: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={cx(
      "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white",
      "transition hover:opacity-95 active:scale-[0.99]",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      className
    )}
    style={{ background: GRAD }}
  >
    {label}
  </button>
);

const SecondaryBtn = ({
  label,
  onClick,
  className = "",
}: {
  label: string;
  onClick: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={cx(
      "inline-flex items-center justify-center rounded-2xl border bg-white/80 px-5 py-3 text-sm font-semibold",
      "transition hover:bg-white active:scale-[0.99]",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      className
    )}
    style={{ borderColor: `${C2}66`, color: C3 }}
  >
    {label}
  </button>
);

const ToggleBtn = ({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cx(
      "flex-1 rounded-2xl border px-4 py-2 text-sm font-semibold transition",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      active ? "bg-white" : "bg-white/60"
    )}
    style={{
      borderColor: `${C2}66`,
      color: active ? C3 : "#64748b",
    }}
  >
    {label}
  </button>
);

const DayChip = ({
  day,
  active,
  onClick,
}: {
  day: number;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cx(
      "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      active ? "bg-white" : "bg-white/70 hover:bg-white"
    )}
    style={{
      borderColor: active ? `${C3}55` : `${C2}66`,
      color: active ? C3 : "#334155",
      boxShadow: active ? "0 10px 22px rgba(23,59,99,0.12)" : "none",
    }}
    aria-label={`Go to Day ${day}`}
  >
    Day {day}
  </button>
);

const ProgressBar = ({ value, max }: { value: number; max: number }) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span>Progress</span>
        <span className="font-semibold" style={{ color: C3 }}>
          {value}/{max} days
        </span>
      </div>
      <div
        className="mt-2 h-2.5 rounded-full border bg-white overflow-hidden"
        style={{ borderColor: `${C2}66` }}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: GRAD }}
        />
      </div>
    </div>
  );
};

const ModuleTag = ({ module }: { module: ModuleKey }) => {
  const label = module.toUpperCase();
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
      style={{ background: `${C3}14`, color: C3 }}
    >
      {label}
    </span>
  );
};

export default function NinetyDayPlanPage() {
  const navigate = useNavigate();

  // ✅ Your 51 use cases (LOS + FMS + CMS) -> keep exactly like your file, but FIXED module assignment
  const useCases: UseCase[] = useMemo(() => {
    const base: Array<
      Pick<UseCase, "useCaseId" | "title" | "description" | "module">
    > = [
      // LOS
      {
        useCaseId: "customer-id-creation",
        title: "Customer ID Creation",
        description:
          "Generate unique customer ID and link it to the Core Banking System (CBS)",
        module: "lo-system",
      },
      {
        useCaseId: "co-applicant-linking",
        title: "Co-applicant & Guarantor Linking",
        description:
          "Upload and link KYC/supporting documents for co-applicants or guarantors",
        module: "lo-system",
      },
      {
        useCaseId: "customer-id-loan-link",
        title: "Customer ID to Loan Linking",
        description:
          "Map customer ID to the loan application for tracking and verification",
        module: "lo-system",
      },
      {
        useCaseId: "loan-appraisal",
        title: "Loan Appraisal System",
        description: "Perform customer credit scoring and financial appraisal",
        module: "lo-system",
      },
      {
        useCaseId: "loan-assessment",
        title: "Loan Assessment Workflow",
        description: "Capture loan application and perform preliminary checks",
        module: "lo-system",
      },
      {
        useCaseId: "recommendation-workflow",
        title: "Recommendation & Sanction Letter",
        description:
          "Review loan details and generate sanction recommendations",
        module: "lo-system",
      },
      {
        useCaseId: "risk-analysis-upload",
        title: "Risk Analysis Documentation",
        description: "Upload signed agreements and perform risk validation",
        module: "lo-system",
      },
      {
        useCaseId: "sanction-disbursement",
        title: "Sanction & Customer Response Tracking",
        description: "Track sanction status and customer acknowledgments",
        module: "lo-system",
      },
      {
        useCaseId: "loan-repayment-schedule",
        title: "Repayment Schedule Generation",
        description: "Generate EMI schedule and repayment tracking data",
        module: "lo-system",
      },
      {
        useCaseId: "terms-conditions-workflow",
        title: "Terms & Conditions Approval",
        description: "Approve and manage loan terms and condition agreements",
        module: "lo-system",
      },
      {
        useCaseId: "asset-details-capture",
        title: "Asset Details Capture",
        description: "Record asset details offered as collateral or security",
        module: "lo-system",
      },
      {
        useCaseId: "limit-check-profile-update",
        title: "Profile Update & Limit Check",
        description: "Update customer info and check applicable credit limits",
        module: "lo-system",
      },
      {
        useCaseId: "account-closure-process",
        title: "Account Closure & Net Worth Analysis",
        description: "Initiate account closure and analyze party's net worth",
        module: "lo-system",
      },

      // FMS
      {
        useCaseId: "asset-details",
        title: "Asset Details",
        description: "Manage and monitor asset-related case information.",
        module: "fm-system",
      },
      {
        useCaseId: "allocation-contract",
        title: "PDC Printing",
        description: "Automated post-dated cheque processing.",
        module: "fm-system",
      },
      {
        useCaseId: "installment-prepayment",
        title: "WF_ Installment Prepayment",
        description: "Handle early repayments and installment adjustments.",
        module: "fm-system",
      },
      {
        useCaseId: "case-reallocation",
        title: "WF_ NPA Grading",
        description: "Non-performing asset classification system.",
        module: "fm-system",
      },
      {
        useCaseId: "npa-provisioning",
        title: "WF_ NPA Provisioning",
        description: "Process provisioning for non-performing assets.",
        module: "fm-system",
      },
      {
        useCaseId: "settlement-knockoff",
        title: "WF_ Settlements - Knock Off",
        description: "Record settlements and update outstanding balances.",
        module: "fm-system",
      },
      {
        useCaseId: "cheque-processing",
        title: "WF_ Settlements_Cheque(Receipt_Payment) Processing",
        description: "Manage cheque-based settlements and payments.",
        module: "fm-system",
      },
      {
        useCaseId: "settlement-advisory",
        title: "WF_ Settlements_Manual Advise",
        description: "Provide manual advisory for payment settlements.",
        module: "fm-system",
      },
      {
        useCaseId: "foreclosure-management",
        title: "WF_ Termination - Foreclosure - Closure",
        description: "Handle early closure and foreclosure of loans.",
        module: "fm-system",
      },
      {
        useCaseId: "finance-viewer",
        title: "WF_FMS_ Finance Viewer",
        description: "View financial metrics and account overviews.",
        module: "fm-system",
      },
      {
        useCaseId: "floating-review",
        title: "WF_FMS_ Floating Review Process",
        description: "Manage reviews for floating-rate financial products.",
        module: "fm-system",
      },
      {
        useCaseId: "daily-workplan",
        title: "WF_FMS_ Settlements - Receipts",
        description: "Automated receipt settlement processing",
        module: "fm-system",
      },
      {
        useCaseId: "settlements-payment",
        title: "WF_FMS_ Settlements_Payment",
        description: "Track and process all types of settlement payments.",
        module: "fm-system",
      },
      {
        useCaseId: "settlements-waiveoff",
        title: "WF_FMS_ Settlements_Waive Off",
        description: "Manage waived-off cases and financial adjustments.",
        module: "fm-system",
      },
      {
        useCaseId: "eod-bod-process",
        title: "WF_FMS_EOD_ BOD",
        description: "Run end-of-day and beginning-of-day operations.",
        module: "fm-system",
      },
      {
        useCaseId: "account-closure",
        title: "Work Flow Closure_Account Closure",
        description: "Close accounts after settlement or full repayment.",
        module: "fm-system",
      },
      {
        useCaseId: "account-status",
        title: "Work Flow Closure_View Account Status",
        description: "Check and track account lifecycle and changes.",
        module: "fm-system",
      },
      {
        useCaseId: "document-master",
        title: "Work Flow_Document Master",
        description: "Manage and define all finance-related documentation.",
        module: "fm-system",
      },
      {
        useCaseId: "bulk-prepayment",
        title: "Work Flow_Finance Rescheduling_Bulk Prepayment",
        description: "Handle bulk prepayment processing and schedules.",
        module: "fm-system",
      },
      {
        useCaseId: "due-date-change",
        title: "Work Flow_Finance Rescheduling_Due Date Change",
        description: "Edit due dates for finance repayments.",
        module: "fm-system",
      },
      {
        useCaseId: "profit-rate-change",
        title: "Work Flow_Finance Rescheduling_Profit Rate Change",
        description: "Adjust profit rates for financial products.",
        module: "fm-system",
      },
      {
        useCaseId: "tenure-change",
        title: "Work Flow_Finance Rescheduling_Tenure Change",
        description: "Modify loan tenures and repayment terms.",
        module: "fm-system",
      },
      {
        useCaseId: "post-disbursal-edit",
        title: "Work Flow_Post Disbursal Edit",
        description: "Amend disbursed loans for corrections or changes.",
        module: "fm-system",
      },
      {
        useCaseId: "deferral-constitution",
        title: "Work Flow_Repayment Deferral_Constitution Wise Deferral",
        description: "Manage repayment deferrals by constitution types.",
        module: "fm-system",
      },
      {
        useCaseId: "deferral-financewise",
        title: "Work Flow_Repayment Deferral_Finance Wise Deferral",
        description: "Apply deferrals based on finance criteria.",
        module: "fm-system",
      },
      {
        useCaseId: "deferral-portfolio",
        title: "Work Flow_Repayment Deferral_Portfolio Wise Deferral",
        description: "Initiate deferrals across loan portfolios.",
        module: "fm-system",
      },

      // CMS
      {
        useCaseId: "allocation-hold",
        title: "Allocation Hold",
        description:
          "Place delinquent cases on hold based on predefined rules.",
        module: "cm-system",
      },
      {
        useCaseId: "define-allocation-contract",
        title: "Define Allocation Contract",
        description:
          "Upload and manage contracts for delinquent case allocation.",
        module: "cm-system",
      },
      {
        useCaseId: "manual-allocation",
        title: "Manual Allocation",
        description: "Manually assign delinquent cases to collection agents.",
        module: "cm-system",
      },
      {
        useCaseId: "manual-reallocation",
        title: "Manual Reallocation",
        description:
          "Reassign cases based on collector availability and performance.",
        module: "cm-system",
      },
      {
        useCaseId: "bod-process",
        title: "Beginning of Day Process",
        description: "Initialize and prepare daily queue for collections.",
        module: "cm-system",
      },
      {
        useCaseId: "define-queue",
        title: "Define Queue",
        description: "Create and manage delinquent case queues.",
        module: "cm-system",
      },
      {
        useCaseId: "contact-recording",
        title: "Contact Recording",
        description: "Record contact attempts and customer communication logs.",
        module: "cm-system",
      },
      {
        useCaseId: "legal-collections",
        title: "Legal Collections Workflow",
        description: "Initiate and track legal recovery processes.",
        module: "cm-system",
      },
      {
        useCaseId: "prioritize-queue",
        title: "Prioritizing a Queue",
        description: "Set priority for follow-up based on risk and aging.",
        module: "cm-system",
      },
      {
        useCaseId: "communication-mapping",
        title: "Queue Communication Mapping",
        description: "Assign communication templates to specific queues.",
        module: "cm-system",
      },
      {
        useCaseId: "queue-curing",
        title: "Queue Curing",
        description: "Monitor and track cured accounts from delinquency.",
        module: "cm-system",
      },
      {
        useCaseId: "work-plan",
        title: "Collector Work Plan",
        description: "Design and track daily plans for collection agents.",
        module: "cm-system",
      },
    ];

    // ✅ Ensure EXACT 51 days. If base is < 51, repeat; if base > 51, take first 51.
    const finalList: UseCase[] = Array.from({ length: 51 }, (_, idx) => {
      const day = idx + 1;
      const seed = base[idx % base.length];
      return {
        day,
        module: seed.module, // ✅ FIXED (your previous code forced "los")
        useCaseId: seed.useCaseId || `usecase-${day}`,
        title: seed.title || `Use Case #${day}`,
        description:
          seed.description ||
          "Business + System scenario with steps, data, validations, and outputs.",
      };
    });

    return finalList;
  }, []);

  const phaseTasks: PhaseTask[] = useMemo(() => {
    const plan: Array<Omit<PhaseTask, "day">> = [
      {
        title: "Integration Setup",
        description: "Project structure, env, API base, auth tokens.",
        tags: ["setup", "env"],
      },
      {
        title: "API Contracts",
        description: "DTOs, schemas, error patterns.",
        tags: ["api", "contracts"],
      },
      {
        title: "UI Components",
        description: "Reusable components (cards, forms, tables).",
        tags: ["ui"],
      },
      {
        title: "State + Data Layer",
        description: "Query patterns, caching, pagination.",
        tags: ["state"],
      },
      {
        title: "Role-Based Access",
        description: "Protected routes, redirects.",
        tags: ["security"],
      },
      {
        title: "Validation + Edge Cases",
        description: "Input validation, empty states.",
        tags: ["quality"],
      },
      {
        title: "Testing",
        description: "Smoke tests + API mocks.",
        tags: ["tests"],
      },
      {
        title: "Deployment",
        description: "Build, CI/CD, monitoring.",
        tags: ["deploy"],
      },
      {
        title: "Documentation",
        description: "README, API docs, demo flow.",
        tags: ["docs"],
      },
    ];

    const tasks: PhaseTask[] = [];
    for (let d = 52; d <= 90; d++) {
      const p = plan[(d - 52) % plan.length];
      tasks.push({
        day: d,
        title: p.title,
        description: p.description,
        tags: p.tags,
      });
    }
    return tasks;
  }, []);

  const [tab, setTab] = useState<"usecases" | "integration">("usecases");
  const [viewType, setViewType] = useState<ViewType>("business");
  const [query, setQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [moduleFilter, setModuleFilter] = useState<ModuleKey | "all">("all");

  const maxDay = 90;

  const selectedUseCase = useCases.find((u) => u.day === selectedDay);
  const selectedTask = phaseTasks.find((t) => t.day === selectedDay);

  const goPrev = useCallback(
    () => setSelectedDay((d) => Math.max(1, d - 1)),
    []
  );
  const goNext = useCallback(
    () => setSelectedDay((d) => Math.min(maxDay, d + 1)),
    []
  );

  const openSelectedUseCase = useCallback(() => {
    if (!selectedUseCase) return;
    navigate(
      `/${selectedUseCase.module}/${selectedUseCase.useCaseId}/${viewType}`
    );
  }, [navigate, selectedUseCase, viewType]);

  const filteredUseCases = useMemo(() => {
    const q = query.trim().toLowerCase();
    return useCases.filter((u) => {
      const matchesQuery =
        !q ||
        u.title.toLowerCase().includes(q) ||
        u.description.toLowerCase().includes(q) ||
        u.useCaseId.toLowerCase().includes(q);
      const matchesModule =
        moduleFilter === "all" ? true : u.module === moduleFilter;
      return matchesQuery && matchesModule;
    });
  }, [query, useCases, moduleFilter]);

  const dayChips = useMemo(() => {
    // show nearby 15 chips around selected day (better on mobile)
    const start = Math.max(1, selectedDay - 7);
    const end = Math.min(maxDay, start + 14);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [selectedDay]);

  const isUseCaseDay = selectedDay <= 51;
  const handleLogout = useCallback(() => {
    // ✅ clear all stored login/session data
    localStorage.clear();
    sessionStorage.clear();

    // ✅ redirect to same plan page
    window.location.href = "/90dayjobplan";
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#f8fafc" }}>
      {/* HERO */}
      <header className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-8 sm:pt-14">
        <div
          className="relative overflow-hidden rounded-[36px] border bg-white/90 backdrop-blur-sm"
          style={{
            borderColor: `${C2}66`,
            boxShadow: "0 24px 70px rgba(15, 23, 42, 0.08)",
          }}
        >
          <div className="absolute inset-0" style={{ background: SOFT_BG }} />
          <div
            className="absolute -inset-10 opacity-35 blur-3xl"
            style={{ background: "rgba(144,183,215,0.22)" }}
          />

          <div className="relative p-6 sm:p-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <Pill text="90-Day Job Plan" />
                <Pill text="Day 1–51: Use Cases" />
                <Pill text="Day 52–90: Build + Deploy" />
                <Pill text="Daily Discipline" />
              </div>

              {/* ✅ Logout Button (Top Right) */}
              <button
                onClick={handleLogout}
                className="self-start sm:self-auto inline-flex items-center justify-center rounded-2xl border bg-white/80 px-4 py-2 text-sm font-semibold transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ borderColor: `${C2}66`, color: C3 }}
              >
                Log Out
              </button>
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-start">
              {/* Left */}
              <div className="lg:col-span-7 min-w-0">
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                  90 Days → <span style={{ color: C3 }}>Job-Ready</span>
                </h1>
                <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-prose">
                  Days 1–51: Real BFSI workflows (Business + System). Days
                  52–90: Integration, coding, testing, deployment, documentation
                  — and a complete shipped project.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <PrimaryBtn
                    label="Start Day-1 (Customer ID Creation)"
                    onClick={() => {
                      setTab("usecases");
                      setSelectedDay(1);
                    }}
                  />
                  <SecondaryBtn
                    label="Jump to Build Phase (Day-52)"
                    onClick={() => {
                      setTab("integration");
                      setSelectedDay(52);
                    }}
                  />
                </div>

                <div className="mt-6">
                  <ProgressBar value={selectedDay} max={90} />
                </div>

                {/* Day chips */}
                <div className="mt-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500">
                      Quick day jump
                    </p>
                    <p className="text-xs text-slate-500">
                      Selected: Day {selectedDay}
                    </p>
                  </div>
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                    {dayChips.map((d) => (
                      <DayChip
                        key={d}
                        day={d}
                        active={d === selectedDay}
                        onClick={() => setSelectedDay(d)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="lg:col-span-5">
                <SoftCard className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-500">
                        Current Day
                      </p>
                      <p className="text-lg font-extrabold text-slate-900">
                        Day {selectedDay}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {isUseCaseDay ? "Use Case Day" : "Build & Deploy Day"}
                      </p>
                    </div>
                    <span
                      className="shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-2xl border bg-white"
                      style={{ borderColor: `${C2}66`, color: C3 }}
                      aria-hidden="true"
                    >
                      {isUseCaseDay ? "UC" : "BD"}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <ToggleBtn
                      active={viewType === "business"}
                      label="Business"
                      onClick={() => setViewType("business")}
                    />
                    <ToggleBtn
                      active={viewType === "system"}
                      label="System"
                      onClick={() => setViewType("system")}
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <SecondaryBtn
                      label="Previous"
                      onClick={goPrev}
                      className="w-full"
                    />
                    <PrimaryBtn
                      label="Next"
                      onClick={goNext}
                      className="w-full"
                    />
                  </div>

                  <div
                    className="mt-4 rounded-2xl border bg-white/80 p-4"
                    style={{ borderColor: `${C2}66` }}
                  >
                    <p className="text-xs font-semibold text-slate-500">
                      Today’s focus
                    </p>

                    {isUseCaseDay ? (
                      <>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {selectedUseCase?.title || "Use Case"}
                          </p>
                          {selectedUseCase ? (
                            <ModuleTag module={selectedUseCase.module} />
                          ) : null}
                        </div>
                        <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                          {selectedUseCase?.description}
                        </p>
                        <div className="mt-3">
                          <button
                            onClick={openSelectedUseCase}
                            className="w-full rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
                            style={{ background: GRAD }}
                          >
                            Open Day {selectedDay} ({viewType})
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="mt-2 text-sm font-bold text-slate-900 truncate">
                          {selectedTask?.title || "Build & Deploy"}
                        </p>
                        <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                          {selectedTask?.description}
                        </p>
                        {selectedTask?.tags?.length ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {selectedTask.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border bg-white/70 px-3 py-1 text-xs font-semibold"
                                style={{
                                  borderColor: `${C2}66`,
                                  color: "#475569",
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>

                  {/* Tabs */}
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => setTab("usecases")}
                      className={cx(
                        "rounded-2xl border px-5 py-3 text-sm font-semibold transition",
                        tab === "usecases"
                          ? "bg-white"
                          : "bg-white/70 hover:bg-white"
                      )}
                      style={{
                        borderColor: `${C2}66`,
                        color: tab === "usecases" ? C3 : "#64748b",
                      }}
                    >
                      Days 1–51
                    </button>
                    <button
                      onClick={() => setTab("integration")}
                      className={cx(
                        "rounded-2xl border px-5 py-3 text-sm font-semibold transition",
                        tab === "integration"
                          ? "bg-white"
                          : "bg-white/70 hover:bg-white"
                      )}
                      style={{
                        borderColor: `${C2}66`,
                        color: tab === "integration" ? C3 : "#64748b",
                      }}
                    >
                      Days 52–90
                    </button>
                  </div>
                </SoftCard>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* TOOLBAR */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <SoftCard className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900">
                {tab === "usecases"
                  ? "Days 1–51: Use Cases"
                  : "Days 52–90: Build & Deploy"}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">
                {tab === "usecases"
                  ? "Search & open Business/System. Modules: LOS / FMS / CMS"
                  : "39-day build phase: integration, code, tests, deploy, docs."}
              </p>
            </div>

            {tab === "usecases" ? (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search use cases…"
                  className="w-full sm:w-[320px] rounded-2xl border bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ borderColor: `${C2}66` }}
                />

                <select
                  value={moduleFilter}
                  onChange={(e) => setModuleFilter(e.target.value as any)}
                  className="w-full sm:w-[160px] rounded-2xl border bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ borderColor: `${C2}66`, color: "#0f172a" }}
                >
                  <option value="all">All Modules</option>
                  <option value="los">LOS</option>
                  <option value="fms">FMS</option>
                  <option value="cms">CMS</option>
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <SecondaryBtn
                  label="Go Day-51"
                  onClick={() => setSelectedDay(51)}
                />
                <PrimaryBtn
                  label="Go Day-52"
                  onClick={() => setSelectedDay(52)}
                />
              </div>
            )}
          </div>
        </SoftCard>
      </section>

      {/* CONTENT */}
      {tab === "usecases" ? (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10">
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredUseCases.map((u) => {
              const selected = u.day === selectedDay;
              return (
                <div
                  key={u.day}
                  className={cx(
                    "group relative overflow-hidden rounded-3xl border bg-white/90 backdrop-blur-sm transition",
                    "hover:shadow-xl"
                  )}
                  style={{
                    borderColor: selected ? `${C3}55` : `${C2}66`,
                    boxShadow: selected
                      ? "0 22px 60px rgba(23,59,99,0.12)"
                      : "0 14px 34px rgba(15,23,42,0.06)",
                  }}
                  tabIndex={0}
                >
                  <div
                    className="pointer-events-none absolute -inset-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at 30% 20%, ${C2}26, transparent 60%),
                                   radial-gradient(circle at 80% 70%, ${C3}1f, transparent 60%)`,
                    }}
                  />

                  <div className="relative p-5 sm:p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-white"
                        style={{ borderColor: `${C2}66`, color: C3 }}
                      >
                        Day {u.day}
                      </span>
                      <ModuleTag module={u.module} />
                    </div>

                    <h3 className="mt-3 text-base sm:text-lg font-semibold text-slate-900 leading-snug">
                      {u.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {u.description}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setSelectedDay(u.day);
                          navigate(`/${u.module}/${u.useCaseId}/business`);
                        }}
                        className="rounded-2xl border bg-white/80 px-4 py-2 text-sm font-semibold transition hover:bg-white"
                        style={{ borderColor: `${C2}66`, color: C3 }}
                        aria-label={`Open Business for Day ${u.day}`}
                      >
                        Business
                      </button>

                      <button
                        onClick={() => {
                          setSelectedDay(u.day);
                          navigate(`/${u.module}/${u.useCaseId}/system`);
                        }}
                        className="rounded-2xl px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
                        style={{ background: GRAD }}
                        aria-label={`Open System for Day ${u.day}`}
                      >
                        System
                      </button>
                    </div>

                    <button
                      onClick={() => setSelectedDay(u.day)}
                      className="mt-3 w-full rounded-2xl border bg-white/70 px-4 py-2 text-xs font-semibold transition hover:bg-white"
                      style={{
                        borderColor: `${C2}66`,
                        color: selected ? C3 : "#334155",
                      }}
                    >
                      {selected ? "Selected Day" : "Set as Current Day"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bridge card */}
          <div className="mt-8">
            <SoftCard className="p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    After Day-51
                  </p>
                  <p className="text-base font-bold text-slate-900">
                    Days 52–90: Integration + Write Code + Deployment
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    You will combine everything learned and ship an end-to-end
                    project.
                  </p>
                </div>
                <PrimaryBtn
                  label="Go to Day-52"
                  onClick={() => {
                    setTab("integration");
                    setSelectedDay(52);
                  }}
                />
              </div>
            </SoftCard>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10">
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {phaseTasks.map((t) => {
              const selected = t.day === selectedDay;
              return (
                <div
                  key={t.day}
                  className="group relative overflow-hidden rounded-3xl border bg-white/90 backdrop-blur-sm transition hover:shadow-xl"
                  style={{
                    borderColor: selected ? `${C3}55` : `${C2}66`,
                    boxShadow: selected
                      ? "0 22px 60px rgba(23,59,99,0.12)"
                      : "0 14px 34px rgba(15,23,42,0.06)",
                  }}
                >
                  <div
                    className="pointer-events-none absolute -inset-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at 30% 20%, ${C2}26, transparent 60%),
                                   radial-gradient(circle at 80% 70%, ${C3}1f, transparent 60%)`,
                    }}
                  />

                  <div className="relative p-5 sm:p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-white"
                        style={{ borderColor: `${C2}66`, color: C3 }}
                      >
                        Day {t.day}
                      </span>
                      <span
                        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                        style={{ background: `${C3}14`, color: C3 }}
                      >
                        BUILD
                      </span>
                    </div>

                    <h3 className="mt-3 text-base sm:text-lg font-semibold text-slate-900">
                      {t.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {t.description}
                    </p>

                    {t.tags?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {t.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border bg-white/70 px-3 py-1 text-xs font-semibold"
                            style={{ borderColor: `${C2}66`, color: "#475569" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <button
                      onClick={() => setSelectedDay(t.day)}
                      className="mt-auto pt-4 w-full"
                    >
                      <span
                        className="inline-flex w-full items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
                        style={{ background: GRAD }}
                      >
                        {selected ? "Selected Day" : "Set as Current Day"}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <div
              className="relative rounded-[36px] overflow-hidden p-6 sm:p-8"
              style={{ background: GRAD }}
            >
              <div
                className="absolute -inset-10 opacity-35 blur-3xl"
                style={{ background: "rgba(255,255,255,0.20)" }}
              />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-2xl font-extrabold text-white">
                    Day-90: Final Deployment + Demo + Portfolio
                  </h3>
                  <p className="mt-1 text-sm sm:text-base text-white/85">
                    Deploy your app, record a demo, publish documentation, and
                    showcase proof-of-skill.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDay(90)}
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-sm sm:text-base font-semibold transition hover:shadow-xl active:scale-[0.99]"
                  style={{ color: C3 }}
                >
                  Go to Day-90
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              © {new Date().getFullYear()} ASKOXY.AI • 90-Day Job Plan
            </p>
            <div className="flex flex-wrap gap-2">
              <Pill text="Daily" />
              <Pill text="Practical" />
              <Pill text="Proof of Skill" />
            </div>
          </div>
        </div>
      </footer>

      {/* ✅ Mobile Sticky Bottom Bar (BEST UX) */}
      <div className="md:hidden fixed bottom-3 left-0 right-0 z-50 px-4">
        <div
          className="rounded-2xl border bg-white/95 backdrop-blur-md shadow-2xl"
          style={{ borderColor: `${C2}66` }}
        >
          <div className="flex items-center justify-between gap-3 p-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                Day {selectedDay} • {isUseCaseDay ? "Use Case" : "Build"}
              </p>
              <p className="text-[11px] text-slate-600 truncate">
                {isUseCaseDay ? selectedUseCase?.title : selectedTask?.title}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={goPrev}
                className="rounded-xl border px-3 py-2 text-xs font-semibold bg-white"
                style={{ borderColor: `${C2}66`, color: C3 }}
              >
                Prev
              </button>

              <button
                onClick={goNext}
                className="rounded-xl border px-3 py-2 text-xs font-semibold bg-white"
                style={{ borderColor: `${C2}66`, color: C3 }}
              >
                Next
              </button>

              <button
                onClick={() => {
                  if (!isUseCaseDay) return;
                  openSelectedUseCase();
                }}
                className="rounded-xl px-3 py-2 text-xs font-semibold text-white"
                style={{ background: GRAD, opacity: isUseCaseDay ? 1 : 0.6 }}
                disabled={!isUseCaseDay}
              >
                Open
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* spacing for sticky bar */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
