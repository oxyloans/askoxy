export type ModuleKey =
  | "lo-system-9days"
  | "fm-system-9days"
  | "cm-system-9days";

export type NineDaysUseCaseItem = {
  id: number;
  day: number;
  path: string;
  title: string;
  description: string;
  module: ModuleKey;
  moduleLabel: "LOS" | "FMS" | "CMS";
};

// Helper to format use case code: index 0 -> UC-01, index 1 -> UC-02, etc.
export const getUseCaseCode = (indexInDay: number): string => {
  const num = indexInDay + 1;
  return `UC-${num < 10 ? "0" + num : num}`;
};

/**
 * Parse comma-separated or space-separated useCaseNumbers string into clean uppercase array
 * Example: "UC-01,UC-02,UC-03" -> ["UC-01", "UC-02", "UC-03"]
 */
export const parseUseCaseNumbers = (raw?: string | null): string[] => {
  if (!raw || typeof raw !== "string") return [];
  return raw
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)
    .map((s) => {
      const m = s.match(/^UC-(\d+)$/i);
      if (m && m[1].length === 1) {
        return `UC-0${m[1]}`;
      }
      return s;
    });
};

// Exactly 51 Use Cases across 6 Days
export const NINE_DAYS_USE_CASES: NineDaysUseCaseItem[] = [
  // Day 1: 1 - 8 (LOS)
  {
    id: 1,
    day: 1,
    path: "customer-id-creation",
    title: "Customer ID Creation",
    description:
      "Generate unique customer ID and link it to the Core Banking System (CBS)",
    module: "lo-system-9days",
    moduleLabel: "LOS",
  },
  {
    id: 2,
    day: 1,
    path: "co-applicant-linking",
    title: "Co-applicant & Guarantor Linking",
    description:
      "Upload and link KYC/supporting documents for co-applicants or guarantors",
    module: "lo-system-9days",
    moduleLabel: "LOS",
  },
  {
    id: 3,
    day: 1,
    path: "customer-id-loan-link",
    title: "Customer ID to Loan Linking",
    description:
      "Map customer ID to the loan application for tracking and verification",
    module: "lo-system-9days",
    moduleLabel: "LOS",
  },
  {
    id: 4,
    day: 1,
    path: "loan-appraisal",
    title: "Loan Appraisal System",
    description: "Perform customer credit scoring and financial appraisal",
    module: "lo-system-9days",
    moduleLabel: "LOS",
  },
  {
    id: 5,
    day: 1,
    path: "loan-assessment",
    title: "Loan Assessment Workflow",
    description: "Capture loan application and perform preliminary checks",
    module: "lo-system-9days",
    moduleLabel: "LOS",
  },
  {
    id: 6,
    day: 1,
    path: "recommendation-workflow",
    title: "Recommendation & Sanction Letter",
    description: "Review loan details and generate sanction recommendations",
    module: "lo-system-9days",
    moduleLabel: "LOS",
  },
  {
    id: 7,
    day: 1,
    path: "risk-analysis-upload",
    title: "Risk Analysis Documentation",
    description: "Upload signed agreements and perform risk validation",
    module: "lo-system-9days",
    moduleLabel: "LOS",
  },
  {
    id: 8,
    day: 1,
    path: "sanction-disbursement",
    title: "Sanction & Customer Response Tracking",
    description: "Track sanction status and customer acknowledgments",
    module: "lo-system-9days",
    moduleLabel: "LOS",
  },

  
  {
    id: 9,
    day: 2,
    path: "loan-repayment-schedule",
    title: "Repayment Schedule Generation",
    description: "Generate EMI schedule and repayment tracking data",
    module: "lo-system-9days",
    moduleLabel: "LOS",
  },
  {
    id: 10,
    day: 2,
    path: "terms-conditions-workflow",
    title: "Terms & Conditions Approval",
    description: "Approve and manage loan terms and condition agreements",
    module: "lo-system-9days",
    moduleLabel: "LOS",
  },
  {
    id: 11,
    day: 2,
    path: "asset-details-capture",
    title: "Asset Details Capture",
    description: "Record asset details offered as collateral or security",
    module: "lo-system-9days",
    moduleLabel: "LOS",
  },
  {
    id: 12,
    day: 2,
    path: "limit-check-profile-update",
    title: "Profile Update & Limit Check",
    description: "Update customer info and check applicable credit limits",
    module: "lo-system-9days",
    moduleLabel: "LOS",
  },
  {
    id: 13,
    day: 2,
    path: "account-closure-process",
    title: "Account Closure & Net Worth Analysis",
    description: "Initiate account closure and analyze party's net worth",
    module: "lo-system-9days",
    moduleLabel: "LOS",
  },
  {
    id: 14,
    day: 2,
    path: "asset-details",
    title: "Asset Details",
    description: "Manage and monitor asset-related case information.",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },
  {
    id: 15,
    day: 2,
    path: "allocation-contract",
    title: "PDC Printing",
    description: "Automated post-dated cheque processing.",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },
  {
    id: 16,
    day: 2,
    path: "installment-prepayment",
    title: "WF_ Installment Prepayment",
    description: "Handle early repayments and installment adjustments.",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },
  {
    id: 17,
    day: 2,
    path: "case-reallocation",
    title: "WF_ NPA Grading",
    description: "Non-performing asset classification system.",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },

  // Day 3: 18 - 25 (FMS)
  {
    id: 18,
    day: 3,
    path: "npa-provisioning",
    title: "WF_ NPA Provisioning",
    description: "Process provisioning for non-performing assets.",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },
  {
    id: 19,
    day: 3,
    path: "settlement-knockoff",
    title: "WF_ Settlements - Knock Off",
    description: "Record settlements and update outstanding balances.",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },
  {
    id: 20,
    day: 3,
    path: "cheque-processing",
    title: "WF_ Settlements_Cheque(Receipt_Payment) Processing",
    description: "Manage cheque-based settlements and payments.",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },
  {
    id: 21,
    day: 3,
    path: "settlement-advisory",
    title: "WF_ Settlements_Manual Advise",
    description: "Provide manual advisory for payment settlements.",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },
  {
    id: 22,
    day: 3,
    path: "foreclosure-management",
    title: "WF_ Termination - Foreclosure - Closure",
    description: "Handle early closure and foreclosure of loans.",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },
  {
    id: 23,
    day: 3,
    path: "finance-viewer",
    title: "WF_FMS_ Finance Viewer",
    description: "View financial metrics and account overviews.",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },
  {
    id: 24,
    day: 3,
    path: "floating-review",
    title: "WF_FMS_ Floating Review Process",
    description: "Manage reviews for floating-rate financial products.",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },
  {
    id: 25,
    day: 3,
    path: "daily-workplan",
    title: "WF_FMS_ Settlements - Receipts",
    description: "Automated receipt settlement processing",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },

  // Day 4: 26 - 34 (FMS)
  {
    id: 26,
    day: 4,
    path: "settlements-payment",
    title: "WF_FMS_ Settlements_Payment",
    description: "Track and process all types of settlement payments.",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },
  {
    id: 27,
    day: 4,
    path: "settlements-waiveoff",
    title: "WF_FMS_ Settlements_Waive Off",
    description: "Manage waived-off cases and financial adjustments.",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },
  {
    id: 28,
    day: 4,
    path: "eod-bod-process",
    title: "WF_FMS_EOD_ BOD",
    description: "Run end-of-day and beginning-of-day operations.",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },
  {
    id: 29,
    day: 4,
    path: "account-closure",
    title: "Work Flow Closure_Account Closure",
    description: "Close accounts after settlement or full repayment.",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },
  {
    id: 30,
    day: 4,
    path: "account-status",
    title: "Work Flow Closure_View Account Status",
    description: "Check and track account lifecycle and changes.",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },
  {
    id: 31,
    day: 4,
    path: "document-master",
    title: "Work Flow_Document Master",
    description: "Manage and define all finance-related documentation.",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },
  {
    id: 32,
    day: 4,
    path: "bulk-prepayment",
    title: "Work Flow_Finance Rescheduling_Bulk Prepayment",
    description: "Handle bulk prepayment processing and schedules.",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },
  {
    id: 33,
    day: 4,
    path: "due-date-change",
    title: "Work Flow_Finance Rescheduling_Due Date Change",
    description: "Edit due dates for finance repayments.",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },
  {
    id: 34,
    day: 4,
    path: "profit-rate-change",
    title: "Work Flow_Finance Rescheduling_Profit Rate Change",
    description: "Adjust profit rates for financial products.",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },

  // Day 5: 35 - 42 (FMS + CMS)
  {
    id: 35,
    day: 5,
    path: "tenure-change",
    title: "Work Flow_Finance Rescheduling_Tenure Change",
    description: "Modify loan tenures and repayment terms.",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },
  {
    id: 36,
    day: 5,
    path: "post-disbursal-edit",
    title: "Work Flow_Post Disbursal Edit",
    description: "Amend disbursed loans for corrections or changes.",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },
  {
    id: 37,
    day: 5,
    path: "deferral-constitution",
    title: "Work Flow_Repayment Deferral_Constitution Wise Deferral",
    description: "Manage repayment deferrals by constitution types.",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },
  {
    id: 38,
    day: 5,
    path: "deferral-financewise",
    title: "Work Flow_Repayment Deferral_Finance Wise Deferral",
    description: "Apply deferrals based on finance criteria.",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },
  {
    id: 39,
    day: 5,
    path: "deferral-portfolio",
    title: "Work Flow_Repayment Deferral_Portfolio Wise Deferral",
    description: "Initiate deferrals across loan portfolios.",
    module: "fm-system-9days",
    moduleLabel: "FMS",
  },
  {
    id: 40,
    day: 5,
    path: "allocation-hold",
    title: "Allocation of Delinquent Cases_Allocation Hold",
    description: "Place delinquent cases on hold based on predefined rules.",
    module: "cm-system-9days",
    moduleLabel: "CMS",
  },
  {
    id: 41,
    day: 5,
    path: "define-allocation-contract",
    title: "Allocation of Delinquent Cases_Define Allocation contract",
    description: "Upload and manage contracts for delinquent case allocation.",
    module: "cm-system-9days",
    moduleLabel: "CMS",
  },
  {
    id: 42,
    day: 5,
    path: "manual-allocation",
    title: "Allocation of Delinquent Cases_Manual Allocation",
    description: "Manually assign delinquent cases to collection agents.",
    module: "cm-system-9days",
    moduleLabel: "CMS",
  },

  // Day 6: 43 - 51 (CMS)
  {
    id: 43,
    day: 6,
    path: "manual-reallocation",
    title: "Allocation of Delinquent Cases_Manual Reallocation",
    description:
      "Reassign cases based on collector availability and performance.",
    module: "cm-system-9days",
    moduleLabel: "CMS",
  },
  {
    id: 44,
    day: 6,
    path: "bod-process",
    title: "Beginning of Day Process",
    description: "Initialize and prepare daily queue for collections.",
    module: "cm-system-9days",
    moduleLabel: "CMS",
  },
  {
    id: 45,
    day: 6,
    path: "define-queue",
    title: "Classification of Delinquent Cases - Define Queue",
    description: "Create and manage delinquent case queues.",
    module: "cm-system-9days",
    moduleLabel: "CMS",
  },
  {
    id: 46,
    day: 6,
    path: "contact-recording",
    title: "Contact Recording",
    description: "Record contact attempts and customer communication logs.",
    module: "cm-system-9days",
    moduleLabel: "CMS",
  },
  {
    id: 47,
    day: 6,
    path: "legal-collections",
    title: "Legal Collections Workflow",
    description: "Initiate and track legal recovery processes.",
    module: "cm-system-9days",
    moduleLabel: "CMS",
  },
  {
    id: 48,
    day: 6,
    path: "prioritize-queue",
    title: "Prioritizing a Queue",
    description: "Set priority for follow-up based on risk and aging.",
    module: "cm-system-9days",
    moduleLabel: "CMS",
  },
  {
    id: 49,
    day: 6,
    path: "communication-mapping",
    title: "Queue Communication Mapping",
    description: "Assign communication templates to specific queues.",
    module: "cm-system-9days",
    moduleLabel: "CMS",
  },
  {
    id: 50,
    day: 6,
    path: "queue-curing",
    title: "Queue Curing",
    description: "Monitor and track cured accounts from delinquency.",
    module: "cm-system-9days",
    moduleLabel: "CMS",
  },
  {
    id: 51,
    day: 6,
    path: "work-plan",
    title: "Collector Work Plan",
    description: "Design and track daily plans for collection agents.",
    module: "cm-system-9days",
    moduleLabel: "CMS",
  },
];

export type DayMetaItem = {
  day: number;
  title: string;
  category: string;
  count: string;
  badge: string;
  shortBadge: string;
};

export const DAY_META: DayMetaItem[] = [
  {
    day: 1,
    title: "Customer Onboarding & Loan Origination",
    category: "Banking Workflows",
    count: "8 Use Cases (#1–8)",
    badge: "LOS Origination",
    shortBadge: "Onboarding (8)",
  },
  {
    day: 2,
    title: "Loan Servicing, Collateral & Risk Management",
    category: "Banking Workflows",
    count: "9 Use Cases (#9–17)",
    badge: "LOS + FMS Servicing",
    shortBadge: "Servicing (9)",
  },
  {
    day: 3,
    title: "NPA, Settlements & Financial Management",
    category: "Banking Workflows",
    count: "8 Use Cases (#18–25)",
    badge: "FMS Operations",
    shortBadge: "NPA & FMS (8)",
  },
  {
    day: 4,
    title: "Finance Operations, Closure & Rescheduling",
    category: "Banking Workflows",
    count: "9 Use Cases (#26–34)",
    badge: "FMS Lifecycle",
    shortBadge: "Operations (9)",
  },
  {
    day: 5,
    title: "Loan Restructuring, Deferrals & Case Allocation",
    category: "Banking Workflows",
    count: "8 Use Cases (#35–42)",
    badge: "FMS + CMS Delinquency",
    shortBadge: "Restructuring (8)",
  },
  {
    day: 6,
    title: "Collections, Delinquency & Legal Recovery",
    category: "Banking Workflows",
    count: "9 Use Cases (#43–51)",
    badge: "CMS Recovery",
    shortBadge: "Collections (9)",
  },
  {
    day: 7,
    title: "Build 51 Use-Case Banking Project with AI Tools",
    category: "Full-Stack AI Project",
    count: "AI Project Generation & IDE Setup",
    badge: "AI Project Build",
    shortBadge: "AI Build (51 UC)",
  },
  {
    day: 8,
    title: "Production Deployment: Deploying Your Banking Project",
    category: "Cloud & DevOps Deployment",
    count: "End-to-End Live Deployment Guide",
    badge: "Cloud Deployment",
    shortBadge: "Live Deploy",
  },
  {
    day: 9,
    title: "Technical Assessment & Final Exam",
    category: "Assessment & Exam",
    count: "Final Knowledge Exam & Certification",
    badge: "Final Exam",
    shortBadge: "Final Exam",
  },
];

