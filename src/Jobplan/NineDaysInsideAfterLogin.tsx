import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import BASE_URL from "../Config";
import { stopTokenRefresh } from "../utils/tokenRefresh";
import {
  NINE_DAYS_CONTEXT_KEY,
  NINE_DAYS_DAY_KEY,
  NINE_DAYS_VIEW_KEY,
  NineDaysUseCaseLink,
} from "../components/NineDaysUseCaseNavigation";

type ModuleKey = "lo-system-9days" | "fm-system-9days" | "cm-system-9days";

export type NineDaysUseCaseItem = {
  id: number;
  day: number;
  path: string;
  title: string;
  description: string;
  module: ModuleKey;
  moduleLabel: "LOS" | "FMS" | "CMS";
};

export type InterestApiResponse = {
  interested?: boolean;
  locked?: boolean;
  message?: string;
  status?: string;
  userId?: string;
  enrollmentId?: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  mobileNumber?: string | null;
  createdAt?: number | null;
};

export type DashboardResponse = {
  enrollmentId?: string;
  status?: string;
  currentDay?: number;
  totalDays?: number;
  daysCompleted?: number;
  programCompleted?: boolean;
  examEligible?: boolean;
  days?: any[];
};

export type StartDayResponse = {
  status?: string;
  message?: string;
  id?: string;
  currentDay?: number;
  data?: {
    id?: string;
    enrollmentId?: string;
    userId?: string;
    dayNumber?: number;
    progress?: number;
    visited?: boolean;
    completed?: boolean;
    visitedAt?: number;
    createdAt?: number;
    updatedAt?: number;
  };
};

export type UpdateUseCaseResponse = {
  status?: string;
  message?: string;
  data?: {
    id?: string;
    enrollmentId?: string;
    userId?: string;
    dayNumber?: number;
    useCaseNumbers?: string;
    progress?: number;
    visited?: boolean;
    completed?: boolean;
    visitedAt?: number;
    createdAt?: number;
    updatedAt?: number;
  };
};

const nineDaysLogo = "https://i.ibb.co/39rQT8TW/9-Days-Job-Program-Logo-1.png";

// SweetAlert2 Toast Mixin
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

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

  // Day 2: 9 - 17 (LOS + FMS)
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

const dayMeta = [
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
    title: "Docker, CI/CD & Cloud Deployment",
    category: "Deployment & DevOps",
    count: "DevOps & Cloud Tools",
    badge: "Docker & Cloud",
    shortBadge: "Docker & Cloud",
  },
  {
    day: 8,
    title: "Production Monitoring, Reliability & Recovery",
    category: "Production Reliability",
    count: "Production Reliability & Recovery",
    badge: "Monitoring & Recovery",
    shortBadge: "Monitoring & Recovery",
  },
  {
    day: 9,
    title: "Technical Interviews & Career Launch",
    category: "Career & Interview",
    count: "51 Use-Case Viva & Assessment",
    badge: "Technical Interviews",
    shortBadge: "Technical Interviews",
  },
];

// Day 7: DevOps & Deployment Tools
const DEPLOYMENT_TOOLS = [
  {
    id: "docker",
    name: "Docker Containerization",
    category: "Containers",
    tag: "Essential",
    whatIsIt:
      "A platform that packages an application and all its dependencies (runtime, system tools, libraries) into a lightweight, portable container that runs consistently on any machine.",
    whyUsed:
      "Eliminates 'it works on my machine' issues. In banking systems, multiple microservices (LOS, FMS, CMS) run isolated without dependency collisions and scale reliably.",
    howToSearch:
      "Search terminal: 'docker --version', 'docker ps', 'docker images'. Search packages: hub.docker.com",
    keyCommands: [
      "docker build -t askoxy-banking:v1 .",
      "docker run -d -p 8080:80 --name oxy-app askoxy-banking:v1",
      "docker ps -a  # Check container status",
      "docker logs -f oxy-app  # Live logs check",
    ],
    docLink: "https://docs.docker.com/get-started/",
  },
  {
    id: "github-actions",
    name: "GitHub Actions CI/CD",
    category: "CI/CD Pipeline",
    tag: "Automation",
    whatIsIt:
      "A continuous integration and continuous delivery (CI/CD) automation platform that builds, tests, and deploys code directly from your GitHub repository upon every push or PR.",
    whyUsed:
      "Ensures zero untested code reaches production. Automatically runs TypeScript linting, unit tests, generates production Docker images, and deploys to servers seamlessly.",
    howToSearch:
      "Check '.github/workflows/*.yml' files in repo root. Search on GitHub Marketplace for pre-built actions.",
    keyCommands: [
      "# In .github/workflows/deploy.yml:",
      "on: [push]",
      "jobs:",
      "  deploy: runs-on: ubuntu-latest",
      "  steps: - uses: actions/checkout@v4",
      "         - run: npm ci && npm run build",
    ],
    docLink: "https://docs.github.com/en/actions",
  },
  {
    id: "aws-ec2",
    name: "AWS Cloud (EC2, S3, RDS)",
    category: "Cloud Hosting",
    tag: "Cloud",
    whatIsIt:
      "Amazon Web Services provides secure cloud virtual machines (EC2), managed databases (RDS Postgres/MySQL), and high-durability object storage for customer KYC documents (S3).",
    whyUsed:
      "Provides enterprise-grade 99.99% uptime, auto-scaling during peak loan application hours, and banking-grade encryption at rest and in transit.",
    howToSearch:
      "Search AWS CLI: 'aws --version', 'aws ec2 describe-instances', 'aws s3 ls'. AWS Web Console: console.aws.amazon.com",
    keyCommands: [
      "ssh -i 'oxy-key.pem' ubuntu@ec2-public-ip.compute.amazonaws.com",
      "aws s3 cp document.pdf s3://oxy-kyc-bucket/",
      "aws sts get-caller-identity  # Verify IAM credentials",
    ],
    docLink: "https://aws.amazon.com/ec2/",
  },
  {
    id: "nginx",
    name: "Nginx Reverse Proxy",
    category: "Web Server & Gateway",
    tag: "Gateway",
    whatIsIt:
      "A fast, open-source HTTP web server and reverse proxy that intercepts client requests and forwards them securely to the underlying application servers.",
    whyUsed:
      "Handles SSL termination, DDoS protection, rate-limiting on sensitive banking endpoints (OTP/login), and load balancing across microservice containers.",
    howToSearch:
      "Verify on server: 'nginx -v', check status: 'systemctl status nginx', config file: '/etc/nginx/sites-available/'",
    keyCommands: [
      "nginx -t  # Test configuration syntax",
      "systemctl restart nginx  # Reload proxy rules",
      "tail -f /var/log/nginx/access.log  # View live incoming traffic",
    ],
    docLink: "https://nginx.org/en/docs/",
  },
  {
    id: "ssl-certbot",
    name: "SSL / TLS & Let's Encrypt Certbot",
    category: "Security",
    tag: "Security",
    whatIsIt:
      "Certbot is an automated agent that issues and renews free, trusted SSL/TLS certificates from Let's Encrypt to enable HTTPS encryption for web applications.",
    whyUsed:
      "Protects sensitive financial data, customer PAN, Aadhaar, and bank account numbers from eavesdropping or man-in-the-middle (MITM) attacks.",
    howToSearch:
      "Check certificate status: 'certbot certificates', test renewal: 'certbot renew --dry-run', verify browser padlock icon.",
    keyCommands: [
      "sudo apt install certbot python3-certbot-nginx",
      "sudo certbot --nginx -d jobplan.askoxy.ai",
      "sudo certbot renew --dry-run  # Automated test renewal",
    ],
    docLink: "https://certbot.eff.org/",
  },
  {
    id: "prometheus-grafana",
    name: "Prometheus & Grafana Monitoring",
    category: "Observability",
    tag: "Monitoring",
    whatIsIt:
      "Prometheus scrapes time-series metrics (CPU, RAM, HTTP latency, 5xx errors), while Grafana visualizes them into intuitive live dashboards.",
    whyUsed:
      "Provides instant alerts when disbursement response time increases or transaction failure rates exceed 0.5%, meeting strict banking regulatory SLAs.",
    howToSearch:
      "Metrics endpoint check: 'curl http://localhost:9090/metrics', verify Grafana at port :3000.",
    keyCommands: [
      "curl http://localhost:9090/-/healthy",
      "# PromQL Query for error rate:",
      "rate(http_requests_total{status=~'5..'}[5m])",
    ],
    docLink: "https://prometheus.io/docs/introduction/overview/",
  },
  {
    id: "sentry-apm",
    name: "Sentry APM & Crash Reporting",
    category: "Error Tracking",
    tag: "APM",
    whatIsIt:
      "Application Performance Monitoring (APM) and real-time error tracking software that captures uncaught exceptions, stack traces, and slow database queries.",
    whyUsed:
      "Alerts engineering teams before users report bugs. Pinpoints exact line of code that failed during a loan sanction or repayment computation.",
    howToSearch:
      "Search npm: '@sentry/react', '@sentry/node'. Check DSN configuration in application environment variables.",
    keyCommands: [
      "npm install @sentry/react",
      "// In src/index.tsx:",
      "Sentry.init({ dsn: 'https://key@sentry.io/123', tracesSampleRate: 1.0 });",
    ],
    docLink: "https://docs.sentry.io/",
  },
  {
    id: "pitr-database",
    name: "PostgreSQL Backups & PITR",
    category: "Database & Recovery",
    tag: "Disaster Recovery",
    whatIsIt:
      "Point-in-Time Recovery (PITR) continuously archives database WAL (Write-Ahead Logging) files, allowing restoration of the financial database to any exact second.",
    whyUsed:
      "Essential for banking compliance. If an unexpected batch job error occurs at 14:32:10, the database can be rolled back to 14:32:09 without data loss.",
    howToSearch:
      "Search tool: 'pg_dump', 'pg_restore', AWS RDS Automated Backups / PITR timeline window.",
    keyCommands: [
      "pg_dump -U postgres -h localhost -d oxylending > backup.sql",
      "pg_restore -U postgres -d oxylending backup.sql",
    ],
    docLink:
      "https://www.postgresql.org/docs/current/continuous-archiving.html",
  },
];

// Day 8: Step-by-Step Deployment Guide
const DEPLOYMENT_STEPS = [
  {
    step: 1,
    title: "Environment Configuration & Secrets Hardening",
    summary:
      "Segregate configurations and protect production API keys & credentials.",
    details:
      "Never commit production secrets into Git repositories. Create an isolated `.env.production` file containing the core banking endpoints, database connection pools, JWT secret keys, and third-party API credentials.",
    commands: [
      "# Create protected env file on host",
      "touch .env.production",
      "chmod 600 .env.production  # Read-write only by root",
      "export NODE_ENV=production",
    ],
    bestPractice:
      "Use AWS Secrets Manager or HashiCorp Vault for rotated production keys.",
  },
  {
    step: 2,
    title: "Multi-Stage Docker Packaging",
    summary: "Build an optimized, secure Docker image with minimal footprint.",
    details:
      "Use a two-stage Dockerfile: Stage 1 compiles TypeScript and runs lint checks using Node.js; Stage 2 copies only the production build artifacts into an ultra-lean Alpine Nginx container.",
    commands: [
      "# Stage 1: Build",
      "FROM node:18-alpine AS build",
      "WORKDIR /app && COPY package*.json ./ && RUN npm ci",
      "COPY . . && RUN npm run build",
      "# Stage 2: Serve",
      "FROM nginx:alpine",
      "COPY --from=build /app/dist /usr/share/nginx/html",
      "EXPOSE 80",
    ],
    bestPractice:
      "Multi-stage builds reduce image size from 1.2 GB to under 35 MB.",
  },
  {
    step: 3,
    title: "CI/CD Pipeline Setup (GitHub Actions)",
    summary:
      "Automate code verification, container building, and deployment triggers.",
    details:
      "Configure a GitHub workflow in `.github/workflows/deploy.yml`. When code is merged into the `main` branch, the workflow automatically runs automated tests, builds the Docker image, tags it with the commit SHA, and pushes to your container registry.",
    commands: [
      "name: Build & Deploy",
      "on: { push: { branches: [main] } }",
      "jobs:",
      "  build:",
      "    runs-on: ubuntu-latest",
      "    steps:",
      "      - uses: actions/checkout@v4",
      "      - run: docker build -t oxybank:${{ github.sha }} .",
      "      - run: docker push oxybank:${{ github.sha }}",
    ],
    bestPractice:
      "Always enforce branch protection rules requiring passing CI checks before merging.",
  },
  {
    step: 4,
    title: "Server Provisioning & Security Group Ingress",
    summary: "Launch cloud compute instances and configure firewall rules.",
    details:
      "Launch an Ubuntu LTS instance on AWS EC2 or your chosen cloud. Configure the Security Group firewall to open only port 80 (HTTP), port 443 (HTTPS), and port 22 (SSH strictly restricted to your management IP).",
    commands: [
      "# SSH into the server securely",
      "ssh -i 'oxy-deploy-key.pem' ubuntu@<your-server-ip>",
      "# Update and install runtime dependencies",
      "sudo apt update && sudo apt upgrade -y",
      "sudo apt install -y docker.io nginx ufw",
      "sudo ufw allow 80/tcp && sudo ufw allow 443/tcp && sudo ufw enable",
    ],
    bestPractice:
      "Never leave port 22 open to 0.0.0.0/0. Use VPN or bastion host.",
  },
  {
    step: 5,
    title: "Nginx Reverse Proxy & Domain Routing",
    summary:
      "Configure Nginx to route traffic to the containerized banking app.",
    details:
      "Create a virtual host configuration in `/etc/nginx/sites-available/banking.conf`. Point your domain DNS A-Record to the server's public Elastic IP and forward HTTP requests to your local container port.",
    commands: [
      "server {",
      "    server_name jobplan.askoxy.ai;",
      "    location / {",
      "        proxy_pass http://localhost:8080;",
      "        proxy_set_header Host $host;",
      "        proxy_set_header X-Real-IP $remote_addr;",
      "        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;",
      "    }",
      "}",
    ],
    bestPractice:
      "Always run `sudo nginx -t` to test syntax before reloading Nginx.",
  },
  {
    step: 6,
    title: "SSL/TLS Hardening via Let's Encrypt",
    summary: "Obtain automated trusted SSL certificates for end-to-end HTTPS.",
    details:
      "Run Certbot with the Nginx plugin. It validates your domain ownership, writes SSL directives into your Nginx configuration, redirects all HTTP traffic to HTTPS, and sets up a cron job for automatic renewal.",
    commands: [
      "sudo apt install -y certbot python3-certbot-nginx",
      "sudo certbot --nginx -d jobplan.askoxy.ai",
      "# Verify renewal timer",
      "sudo systemctl status certbot.timer",
    ],
    bestPractice:
      "Enforce HTTP Strict Transport Security (HSTS) headers for banking applications.",
  },
  {
    step: 7,
    title: "Zero-Downtime Deployment & Health Checks",
    summary:
      "Deploy new app versions without dropping active borrower sessions.",
    details:
      "Use Blue-Green deployment or Docker Compose rolling updates. Start the newly built container on an alternate port, verify its `/health` status endpoint returns HTTP 200 OK, update the Nginx proxy target, and gracefully terminate the legacy container.",
    commands: [
      "# Pull new image",
      "docker pull oxybank:latest",
      "# Run on standby port and probe health",
      "docker run -d --name oxy-green -p 8081:80 oxybank:latest",
      "curl -f http://localhost:8081/health || exit 1",
      "# Switch Nginx target and stop old container",
      "docker stop oxy-blue && docker rm oxy-blue",
    ],
    bestPractice:
      "Never swap traffic before the container passes internal health probes.",
  },
  {
    step: 8,
    title: "Live Monitoring, Log Aggregation & Rollback Plan",
    summary:
      "Verify real-time application health and maintain an emergency rollback plan.",
    details:
      "Confirm Prometheus metrics and Sentry APM are capturing live transactions. Retain the previous container tag so that if an anomaly occurs, an automated or 1-command rollback can be executed within 30 seconds.",
    commands: [
      "# Check container logs in real time",
      "docker logs -f --tail 100 oxy-green",
      "# Quick rollback command if needed:",
      "docker stop oxy-green && docker run -d --name oxy-rollback -p 8080:80 oxybank:previous-stable",
    ],
    bestPractice: "Simulate a rollback drill in staging once every sprint.",
  },
];

// Day 9: Assessment Viva Questions
const VIVA_QUESTIONS = [
  {
    q: "1. Explain the complete Borrower Onboarding and KYC Linking workflow in LOS.",
    answer:
      "The Loan Origination System (LOS) starts with Customer ID Creation, verifying unique national identifiers (PAN/Aadhaar) to prevent deduplication across the Core Banking System (CBS). Next, Co-applicant & Guarantor Linking captures secondary KYC documents, establishing joint legal liability. The Customer ID is then mapped to the loan file, followed by preliminary loan assessment, automated bureau credit scoring (CIBIL/Equifax), and generation of the Sanction Recommendation Letter.",
  },
  {
    q: "2. How does FIFO (First-In, First-Out) knock-off work during loan repayment settlements in FMS?",
    answer:
      "In the Financial Management System (FMS), when a borrower makes an unallocated or partial repayment, the system automatically applies the FIFO principle against outstanding dues. Charges, penalties, and late fees are knocked off first, followed by overdue interest accrued from the earliest unpaid instalment, and finally the principal component. This prevents bad-debt accumulation and maintains clear audit trails.",
  },
  {
    q: "3. What is the fundamental difference between Delinquency Queue (CMS) and NPA Provisioning (FMS)?",
    answer:
      "Delinquency in CMS represents operational distress—cases categorized from DPD 1–30, 31–60, 61–90 days where collection collectors contact borrowers, log Promises-to-Pay (PTP), and execute curing workflows. NPA (Non-Performing Asset) in FMS is a statutory accounting classification triggered when an account breaches 90+ DPD. Once classified as Sub-standard, Doubtful, or Loss, FMS computes mandatory regulatory capital provisioning percentages against the bank balance sheet.",
  },
  {
    q: "4. Explain how Banking Batches (EOD/BOD) handle Interest Accruals and Rescheduling.",
    answer:
      "End-of-Day (EOD) and Beginning-of-Day (BOD) batches run scheduled automated financial jobs: calculating daily interest accruals across live accounts, identifying accounts crossing due-date thresholds, updating delinquency buckets, generating PDC clearing files, and processing approved loan rescheduling modifications (due-date changes, tenure extensions, profit-rate adjustments).",
  },
  {
    q: "5. Defend your End-to-End Cloud Deployment Architecture for this Banking App.",
    answer:
      "The application uses multi-stage Docker containers hosted on AWS EC2 behind an Nginx reverse proxy with TLS 1.3 encryption issued via Let's Encrypt Certbot. Continuous deployment is handled via GitHub Actions CI/CD pipelines enforcing lint and test suites before image publishing. Zero-downtime rolling updates ensure continuous availability, while Prometheus, Grafana, and Sentry APM provide 24/7 observability and automated alerting.",
  },
];

export default function NineDaysInsideAfterLogin() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Selected Day (1..9), defaults from query param or sessionStorage
  const initialDay = useMemo(() => {
    const qDay = searchParams.get("day");
    if (qDay && !isNaN(Number(qDay))) {
      const d = Number(qDay);
      if (d >= 1 && d <= 9) return d;
    }
    const sDay = sessionStorage.getItem(NINE_DAYS_DAY_KEY);
    if (sDay && !isNaN(Number(sDay))) {
      const d = Number(sDay);
      if (d >= 1 && d <= 9) return d;
    }
    return 1;
  }, [searchParams]);

  const [selectedDay, setSelectedDay] = useState<number>(initialDay);
  const [toolSearch, setToolSearch] = useState("");
  const [activeViva, setActiveViva] = useState<number | null>(0);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<
    Record<number, number>
  >({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  // Interest Registration State
  const [isRegisteringInterest, setIsRegisteringInterest] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState<boolean>(
    () => {
      const uid =
        localStorage.getItem("userId") ||
        localStorage.getItem("userid") ||
        localStorage.getItem("customerId") ||
        "";
      return uid
        ? localStorage.getItem(`job_program_registered_${uid}`) === "true"
        : false;
    },
  );

  // Active Enrollment & Day Progression State
  const [enrollmentId, setEnrollmentId] = useState<string>(() => {
    return (
      localStorage.getItem("job_program_enrollment_id") ||
      "304553fb-14cc-4656-a67d-de4a13ee1288"
    );
  });

  const [currentAvailableDay, setCurrentAvailableDay] = useState<number>(() => {
    const saved = localStorage.getItem("job_program_current_day");
    return saved && !isNaN(Number(saved)) ? Number(saved) : 1;
  });

  const [dayProgressId, setDayProgressId] = useState<string>(() => {
    return (
      localStorage.getItem("job_program_day_progress_id") ||
      "006e4f60-ea5d-4777-b6f7-9d3bf1007900"
    );
  });

  // Track completed use case codes (e.g. ["UC-01", "UC-02"]) for current day
  const [completedUseCases, setCompletedUseCases] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(
        `job_program_completed_ucs_day_${initialDay}`,
      );
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isUpdatingUseCase, setIsUpdatingUseCase] = useState<string | null>(
    null,
  );

  // Helper to format use case code: index 0 -> UC-01, index 1 -> UC-02, etc.
  const getUseCaseCode = (indexInDay: number) => {
    const num = indexInDay + 1;
    return `UC-${num < 10 ? "0" + num : num}`;
  };

  // Synchronize completed use cases when selectedDay changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        `job_program_completed_ucs_day_${selectedDay}`,
      );
      setCompletedUseCases(saved ? JSON.parse(saved) : []);
    } catch {
      setCompletedUseCases([]);
    }
  }, [selectedDay]);

  // Check if a use case in the current day is unlocked
  const isUseCaseUnlocked = useCallback(
    (indexInDay: number) => {
      // First use case in any day is always open
      if (indexInDay === 0) return true;
      // Subsequent use case is open only if previous one is completed
      const prevCode = getUseCaseCode(indexInDay - 1);
      return completedUseCases.includes(prevCode);
    },
    [completedUseCases],
  );

  // 1. Fetch Dashboard API
  const fetchDashboard = useCallback(
    async (userIdToUse?: string) => {
      const resolvedUserId =
        userIdToUse ||
        searchParams.get("userId") ||
        searchParams.get("userid") ||
        localStorage.getItem("userId") ||
        localStorage.getItem("userid") ||
        localStorage.getItem("customerId") ||
        sessionStorage.getItem("userId") ||
        sessionStorage.getItem("userid") ||
        "292b5593-d938-42c2-8daa-6494c4096cf1";

      const directUrl = `http://65.0.147.157:9229/api/marketing-service/campgin/job-program/dashboard?userId=${encodeURIComponent(
        resolvedUserId,
      )}`;
      const fallbackUrl = `${BASE_URL}/marketing-service/campgin/job-program/dashboard?userId=${encodeURIComponent(
        resolvedUserId,
      )}`;

      const isHttps =
        typeof window !== "undefined" && window.location.protocol === "https:";
      const urlsToTry = isHttps
        ? [fallbackUrl, directUrl]
        : [directUrl, fallbackUrl];

      for (const targetUrl of urlsToTry) {
        try {
          const res = await axios.get<DashboardResponse>(targetUrl, {
            headers: { Accept: "application/json" },
            timeout: 10000,
          });
          const d = res?.data;
          if (d) {
            if (d.enrollmentId) {
              setEnrollmentId(d.enrollmentId);
              localStorage.setItem("job_program_enrollment_id", d.enrollmentId);
            }
            if (typeof d.currentDay === "number") {
              setCurrentAvailableDay(d.currentDay);
              localStorage.setItem(
                "job_program_current_day",
                String(d.currentDay),
              );
            }
            if (d.status === "ACTIVE" || d.enrollmentId) {
              setIsAlreadyRegistered(true);
              localStorage.setItem(
                `job_program_registered_${resolvedUserId}`,
                "true",
              );
            }
            return d;
          }
        } catch {
          // try next url
        }
      }
      return null;
    },
    [searchParams],
  );

  // 2. Start Day API
  const startDay = useCallback(
    async (dayNum: number, enrollIdToUse?: string, showToast = false) => {
      const eId =
        enrollIdToUse ||
        enrollmentId ||
        localStorage.getItem("job_program_enrollment_id") ||
        "304553fb-14cc-4656-a67d-de4a13ee1288";

      const directUrl = `http://65.0.147.157:9229/api/marketing-service/campgin/job-program/start?dayNumber=${dayNum}&enrollmentId=${encodeURIComponent(
        eId,
      )}`;
      const fallbackUrl = `${BASE_URL}/marketing-service/campgin/job-program/start?dayNumber=${dayNum}&enrollmentId=${encodeURIComponent(
        eId,
      )}`;

      const isHttps =
        typeof window !== "undefined" && window.location.protocol === "https:";
      const urlsToTry = isHttps
        ? [fallbackUrl, directUrl]
        : [directUrl, fallbackUrl];

      for (const targetUrl of urlsToTry) {
        try {
          let resData: any = null;
          try {
            const res = await axios.post<StartDayResponse>(targetUrl, null, {
              headers: { Accept: "application/json" },
              timeout: 10000,
            });
            resData = res?.data;
          } catch (postErr: any) {
            if (postErr?.response?.status === 405) {
              const resGet = await axios.get<StartDayResponse>(targetUrl, {
                headers: { Accept: "application/json" },
                timeout: 10000,
              });
              resData = resGet?.data;
            } else if (postErr?.response?.data) {
              resData = postErr.response.data;
            } else {
              throw postErr;
            }
          }

          if (resData) {
            const newDayId = resData.data?.id || resData.id;
            if (newDayId) {
              setDayProgressId(newDayId);
              localStorage.setItem("job_program_day_progress_id", newDayId);
            }
            if (resData.status === "DAY_LOCKED") {
              Toast.fire({
                icon: "warning",
                title:
                  resData.message ||
                  `Day ${dayNum} is not available. Current day is ${currentAvailableDay}.`,
              });
              return { success: false, ...resData };
            }
            if (showToast && resData.message) {
              Toast.fire({
                icon: "success",
                title: resData.message,
              });
            }
            return { success: true, ...resData };
          }
        } catch (err: any) {
          const serverMsg = err?.response?.data?.message;
          if (serverMsg) {
            Toast.fire({
              icon: "warning",
              title: serverMsg,
            });
            return { success: false, message: serverMsg };
          }
        }
      }
      return { success: false };
    },
    [enrollmentId, currentAvailableDay],
  );

  // Initialize Dashboard and Day 1 on Mount
  useEffect(() => {
    let isMounted = true;
    const initProgression = async () => {
      const d = await fetchDashboard();
      if (isMounted) {
        const cDay = d?.currentDay || currentAvailableDay || 1;
        await startDay(cDay, d?.enrollmentId);
      }
    };
    initProgression();

    return () => {
      isMounted = false;
    };
  }, [fetchDashboard, startDay, currentAvailableDay]);

  // Register Interest API handler
  const handleRegisterInterest = async () => {
    // Resolve user ID from query params, storage, or fallback to test user
    const resolvedUserId =
      searchParams.get("userId") ||
      searchParams.get("userid") ||
      localStorage.getItem("userId") ||
      localStorage.getItem("userid") ||
      localStorage.getItem("customerId") ||
      sessionStorage.getItem("userId") ||
      sessionStorage.getItem("userid") ||
      "292b5593-d938-42c2-8daa-6494c4096cf1";

    setIsRegisteringInterest(true);

    const directUrl = `http://65.0.147.157:9229/api/marketing-service/campgin/job-program/interest?userId=${encodeURIComponent(
      resolvedUserId,
    )}`;
    const fallbackUrl = `${BASE_URL}/marketing-service/campgin/job-program/interest?userId=${encodeURIComponent(
      resolvedUserId,
    )}`;

    // If running in HTTPS, try fallback first to avoid browser mixed-content block, otherwise try direct first
    const isHttps =
      typeof window !== "undefined" && window.location.protocol === "https:";
    const urlsToTry = isHttps
      ? [fallbackUrl, directUrl]
      : [directUrl, fallbackUrl];

    let resultData: InterestApiResponse | null = null;
    let fallbackErrorMessage = "";

    for (const targetUrl of urlsToTry) {
      try {
        try {
          const res = await axios.post<InterestApiResponse>(targetUrl, null, {
            headers: { Accept: "application/json" },
            timeout: 12000,
          });
          if (res && res.data) {
            resultData = res.data;
            break;
          }
        } catch (postErr: any) {
          if (postErr?.response?.status === 405) {
            // Method Not Allowed -> fallback to GET
            const resGet = await axios.get<InterestApiResponse>(targetUrl, {
              headers: { Accept: "application/json" },
              timeout: 12000,
            });
            if (resGet && resGet.data) {
              resultData = resGet.data;
              break;
            }
          } else if (
            postErr?.response?.data &&
            (postErr.response.data.message ||
              postErr.response.data.interested !== undefined)
          ) {
            // Server responded with payload (e.g. 400 or already registered)
            resultData = postErr.response.data;
            break;
          } else {
            throw postErr;
          }
        }
      } catch (err: any) {
        console.warn(`[JobProgram] Error connecting to ${targetUrl}:`, err);
        fallbackErrorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Could not register interest at this time.";
      }
    }

    setIsRegisteringInterest(false);

    if (resultData) {
      const isReg =
        resultData.interested ||
        resultData.locked ||
        (resultData.message &&
          resultData.message.toLowerCase().includes("already registered"));

      // Update state and storage so the button is immediately hidden
      if (isReg) {
        setIsAlreadyRegistered(true);
        localStorage.setItem(
          `job_program_registered_${resolvedUserId}`,
          "true",
        );
      }

      if (resultData.enrollmentId) {
        setEnrollmentId(resultData.enrollmentId);
        localStorage.setItem(
          "job_program_enrollment_id",
          resultData.enrollmentId,
        );
      }

      // Display SweetAlert2 Toast with server message
      Toast.fire({
        icon: resultData.interested ? "success" : "info",
        title:
          resultData.message ||
          (resultData.interested
            ? "Interest registered successfully!"
            : "Interest is already registered."),
      });

      // Immediately fetch dashboard to get currentDay and start Day 1
      const dash = await fetchDashboard(resolvedUserId);
      const cDay = dash?.currentDay || 1;
      await startDay(cDay, resultData.enrollmentId || dash?.enrollmentId, true);
    } else {
      Toast.fire({
        icon: "error",
        title:
          fallbackErrorMessage ||
          "Unable to reach the interest registration service.",
      });
    }
  };

  // 3. Complete Use Case Update API handler
  const handleCompleteUseCase = async (
    uc: NineDaysUseCaseItem,
    indexInDay: number,
  ) => {
    const ucCode = getUseCaseCode(indexInDay);
    setIsUpdatingUseCase(ucCode);

    const activeDayProgressId =
      dayProgressId ||
      localStorage.getItem("job_program_day_progress_id") ||
      "006e4f60-ea5d-4777-b6f7-9d3bf1007900";

    const directUrl = `http://65.0.147.157:9229/api/marketing-service/campgin/job-program/update/${encodeURIComponent(
      activeDayProgressId,
    )}/${encodeURIComponent(ucCode)}`;
    const fallbackUrl = `${BASE_URL}/marketing-service/campgin/job-program/update/${encodeURIComponent(
      activeDayProgressId,
    )}/${encodeURIComponent(ucCode)}`;

    const isHttps =
      typeof window !== "undefined" && window.location.protocol === "https:";
    const urlsToTry = isHttps
      ? [fallbackUrl, directUrl]
      : [directUrl, fallbackUrl];

    let updateSuccess = false;
    let respMsg = "";

    for (const targetUrl of urlsToTry) {
      try {
        let resData: any = null;
        try {
          const res = await axios.post<UpdateUseCaseResponse>(targetUrl, null, {
            headers: { Accept: "application/json" },
            timeout: 10000,
          });
          resData = res?.data;
        } catch (postErr: any) {
          if (postErr?.response?.status === 405) {
            // Try PUT
            try {
              const resPut = await axios.put<UpdateUseCaseResponse>(
                targetUrl,
                null,
                {
                  headers: { Accept: "application/json" },
                  timeout: 10000,
                },
              );
              resData = resPut?.data;
            } catch (putErr: any) {
              if (putErr?.response?.status === 405) {
                // Try GET
                const resGet = await axios.get<UpdateUseCaseResponse>(
                  targetUrl,
                  {
                    headers: { Accept: "application/json" },
                    timeout: 10000,
                  },
                );
                resData = resGet?.data;
              } else {
                throw putErr;
              }
            }
          } else if (postErr?.response?.data) {
            resData = postErr.response.data;
          } else {
            throw postErr;
          }
        }

        if (resData) {
          updateSuccess =
            resData.status === "SUCCESS" ||
            resData.data?.completed ||
            Boolean(resData.data);
          respMsg = resData.message || `${ucCode} completed successfully.`;
          break;
        }
      } catch (err: any) {
        console.warn(`[JobProgram] Error updating ${ucCode}:`, err);
        respMsg =
          err?.response?.data?.message ||
          err?.message ||
          "Could not update use case.";
      }
    }

    setIsUpdatingUseCase(null);

    // If successful or message confirms success
    if (
      updateSuccess ||
      respMsg.toLowerCase().includes("completed") ||
      respMsg.toLowerCase().includes("success")
    ) {
      const updatedList = Array.from(new Set([...completedUseCases, ucCode]));
      setCompletedUseCases(updatedList);
      localStorage.setItem(
        `job_program_completed_ucs_day_${selectedDay}`,
        JSON.stringify(updatedList),
      );

      // SweetAlert2 Toast
      Toast.fire({
        icon: "success",
        title: respMsg || `${ucCode} completed successfully.`,
      });

      // If all use cases in this day are completed, refresh dashboard to advance day
      if (updatedList.length >= currentUseCases.length) {
        const dash = await fetchDashboard();
        if (dash?.currentDay && dash.currentDay > currentAvailableDay) {
          Toast.fire({
            icon: "success",
            title: `All use cases for Day ${selectedDay} completed! Day ${dash.currentDay} is now unlocked!`,
          });
        }
      }
    } else {
      Toast.fire({
        icon: "error",
        title: respMsg || `Failed to complete ${ucCode}. Please try again.`,
      });
    }
  };

  // Sync state with URL & SessionStorage with Day Lock enforcement
  const handleSelectDay = async (day: number) => {
    // If user clicked a locked day
    if (day > currentAvailableDay) {
      const res = await startDay(day, enrollmentId);
      if (!res.success) {
        Toast.fire({
          icon: "warning",
          title:
            res.message ||
            `Day ${day} is not available. Current day is ${currentAvailableDay}.`,
        });
      }
      return;
    }

    setSelectedDay(day);
    sessionStorage.setItem(NINE_DAYS_DAY_KEY, String(day));
    setSearchParams({ day: String(day) });
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Call start day for this available day
    await startDay(day, enrollmentId);
  };

  useEffect(() => {
    sessionStorage.setItem(NINE_DAYS_DAY_KEY, String(selectedDay));
  }, [selectedDay]);

  // Use cases for the selected day (for days 1..6)
  const currentUseCases = useMemo(() => {
    return NINE_DAYS_USE_CASES.filter((uc) => uc.day === selectedDay);
  }, [selectedDay]);

  // Transform all 51 use cases for navigation context
  const allUseCaseLinks = useMemo<NineDaysUseCaseLink[]>(() => {
    return NINE_DAYS_USE_CASES.map((uc) => ({
      day: uc.day,
      useCaseId: uc.path,
      title: uc.title,
      module: uc.module,
    }));
  }, []);

  // Handler to open simulated business or system view
  const handleOpenUseCase = (
    uc: NineDaysUseCaseItem,
    mode: "business" | "system",
  ) => {
    sessionStorage.setItem(NINE_DAYS_DAY_KEY, String(selectedDay));
    sessionStorage.setItem(NINE_DAYS_VIEW_KEY, mode);
    sessionStorage.setItem(
      NINE_DAYS_CONTEXT_KEY,
      JSON.stringify(allUseCaseLinks),
    );

    // Navigates to e.g. /lo-system-9days/customer-id-creation/business
    navigate(`/${uc.module}/${uc.path}/${mode}`);
  };

  const handleLogout = () => {
    try {
      stopTokenRefresh();
    } catch {
      // ignore
    }
    localStorage.clear();
    sessionStorage.clear();
    navigate("/ninedaysjobprogramplan");
  };
  // Filtered tools for Day 7
  const filteredTools = useMemo(() => {
    if (!toolSearch.trim()) return DEPLOYMENT_TOOLS;
    const query = toolSearch.toLowerCase();
    return DEPLOYMENT_TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.whatIsIt.toLowerCase().includes(query) ||
        t.whyUsed.toLowerCase().includes(query),
    );
  }, [toolSearch]);

  const activeMeta = dayMeta[selectedDay - 1] || dayMeta[0];

  return (
    <div className="min-h-screen bg-[#f4faf6] text-slate-900 antialiased font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSelectDay(1)}
              className="flex items-center gap-3"
              aria-label="9-Days Job Program Dashboard"
            >
              <img
                src={nineDaysLogo}
                alt="9-Days Job Program"
                className="h-10 w-auto max-w-[170px] object-contain sm:h-12"
              />
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Show "Register Interest" button ONLY if NOT already registered */}
            {!isAlreadyRegistered && (
              <button
                type="button"
                onClick={handleRegisterInterest}
                disabled={isRegisteringInterest}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:from-emerald-700 hover:to-teal-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 sm:px-4 sm:py-2 sm:text-sm"
                title="Register your interest for the 9-Day Job Program"
              >
                {isRegisteringInterest ? (
                  <>
                    <svg
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <span className="text-amber-300">★</span>
                    <span>Register Interest</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-100 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Hero Welcome Banner */}
      <section className="border-b border-emerald-100 bg-gradient-to-r from-[#e8f6ed] via-[#f7fdf9] to-[#e4f5ea] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex rounded-full bg-emerald-600 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white">
                  Day {selectedDay} of 9
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  {activeMeta.category}
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-[#143d2c] sm:text-3xl lg:text-4xl">
                Day {selectedDay}: {activeMeta.title}
              </h1>
              <p className="mt-1 text-sm text-slate-600 sm:text-base">
                {selectedDay <= 6
                  ? `Interactive simulation for banking use cases (${activeMeta.count}). Click Business or System to explore workflow execution.`
                  : selectedDay === 7
                    ? "Explore all production deployment and DevOps tools required for banking-grade stability."
                    : selectedDay === 8
                      ? "Step-by-step production deployment pipeline from local code to live AWS/Docker URL."
                      : "51 Use-Case Architecture Viva, Mock Interview Checklist, and Final Knowledge Assessment."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9 Days Tab Bar (All 9 Days visible without scrolling) */}
      <nav
        aria-label="9-Days Sprint Progress"
        className="sticky top-[61px] z-30 w-full border-b border-slate-200/90 bg-white shadow-sm"
      >
        <div className="mx-auto max-w-7xl px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-9 gap-1 sm:gap-1.5 md:gap-2 py-2.5">
            {dayMeta.map((dm) => {
              const isActive = selectedDay === dm.day;
              const isLocked = dm.day > currentAvailableDay;

              return (
                <button
                  key={dm.day}
                  type="button"
                  onClick={() => handleSelectDay(dm.day)}
                  className={`group relative flex flex-col items-center justify-center rounded-xl py-2 px-1 sm:py-2.5 sm:px-2 text-center transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-500 ring-offset-1"
                      : isLocked
                        ? "border border-slate-200 bg-slate-100/80 text-slate-400 cursor-not-allowed opacity-65"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-900"
                  }`}
                  title={
                    isLocked
                      ? `Day ${dm.day} is locked. Current available day is ${currentAvailableDay}.`
                      : `${dm.title} - ${dm.count}`
                  }
                >
                  {/* Day Label */}
                  <span
                    className={`flex items-center justify-center gap-1 text-xs sm:text-sm font-black tracking-tight leading-none ${
                      isActive
                        ? "text-white"
                        : isLocked
                          ? "text-slate-400"
                          : "text-slate-900 group-hover:text-emerald-800"
                    }`}
                  >
                    <span>Day {dm.day}</span>
                    {isLocked && <span className="text-[10px]">🔒</span>}
                  </span>

                  {/* Category / Short Badge */}
                  <span
                    className={`mt-1 hidden sm:block text-[9px] md:text-[10px] font-semibold leading-tight truncate w-full max-w-full text-center px-0.5 ${
                      isActive
                        ? "text-emerald-100"
                        : isLocked
                          ? "text-slate-400"
                          : "text-slate-500 group-hover:text-emerald-700"
                    }`}
                  >
                    {isLocked ? "Locked" : dm.shortBadge || dm.badge}
                  </span>

                  {/* Active bottom indicator line */}
                  {isActive && (
                    <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 sm:w-6 h-0.5 rounded-full bg-emerald-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* DAYS 1 - 6: 51 USE CASES */}
        {selectedDay <= 6 && (
          <div>
            {/* <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#153c2c] sm:text-2xl">
                  Day {selectedDay}: {activeMeta.title}
                </h2>
                <p className="text-xs text-slate-600 sm:text-sm">
                  Displaying {currentUseCases.length} core BFSI use cases. Click
                  either <strong className="text-emerald-700">Business</strong>{" "}
                  or <strong className="text-indigo-700">System</strong> to
                  launch the interactive simulation.
                </p>
              </div>

             
            </div> */}

            {/* Grid of Use Cases */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {currentUseCases.map((uc, index) => {
                const ucCode = getUseCaseCode(index);
                const isCompleted = completedUseCases.includes(ucCode);
                const isUnlocked = isUseCaseUnlocked(index);
                const isCurrent = isUnlocked && !isCompleted;

                return (
                  <div
                    key={uc.path}
                    className={`flex flex-col justify-between rounded-2xl border p-5 shadow-sm transition-all duration-200 ${
                      isCompleted
                        ? "border-emerald-200 bg-white hover:border-emerald-300 hover:shadow-md"
                        : isCurrent
                          ? "border-emerald-400 bg-white ring-2 ring-emerald-500/25 hover:-translate-y-1 hover:shadow-lg"
                          : "border-slate-200 bg-slate-50/70 opacity-70"
                    }`}
                  >
                    <div>
                      {/* Top Tag & Number */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`flex items-center gap-1.5 text-xs font-extrabold ${
                            isCompleted
                              ? "text-emerald-700"
                              : isCurrent
                                ? "text-emerald-800"
                                : "text-slate-400"
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-black ${
                              isCompleted
                                ? "bg-emerald-600 text-white"
                                : isCurrent
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-slate-200 text-slate-500"
                            }`}
                          >
                            {isCompleted ? "✓" : index + 1}
                          </span>
                          <span>{ucCode}</span>
                          <span className="font-semibold text-slate-500">
                            (#{uc.id})
                          </span>
                        </span>

                        <div className="flex items-center gap-1.5">
                          {isCompleted && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800 border border-emerald-200">
                              ✓ Completed
                            </span>
                          )}
                          {!isUnlocked && (
                            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                              🔒 Locked
                            </span>
                          )}
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-black tracking-wider uppercase ${
                              uc.moduleLabel === "LOS"
                                ? "bg-sky-50 text-sky-700 border border-sky-200"
                                : uc.moduleLabel === "FMS"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-purple-50 text-purple-700 border border-purple-200"
                            }`}
                          >
                            {uc.moduleLabel}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3
                        className={`mt-3 text-base font-extrabold leading-snug ${
                          isCompleted
                            ? "text-[#173e2e]"
                            : isCurrent
                              ? "text-[#143d2c]"
                              : "text-slate-500"
                        }`}
                      >
                        {uc.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                        {uc.description}
                      </p>
                    </div>

                    {/* Actions: Business & System or Completed or Locked */}
                    <div className="mt-6 border-t border-slate-100 pt-4">
                      {isCompleted ? (
                        /* When completed: Business and System are replaced by Completed */
                        <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 py-2.5 px-3">
                          <span className="flex items-center gap-1.5 text-xs font-black text-emerald-800">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
                              ✓
                            </span>
                            Completed
                          </span>
                          <span className="rounded-md bg-emerald-100/90 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700">
                            Verified
                          </span>
                        </div>
                      ) : isCurrent ? (
                        /* Open / Current: Business, System, and Complete & Unlock Next */
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenUseCase(uc, "business")}
                              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-2.5 text-xs font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-600 hover:text-white"
                              title={`Open Business View for ${uc.title}`}
                            >
                              <span>💼 Business</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenUseCase(uc, "system")}
                              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-indigo-300 bg-indigo-50 px-2.5 text-xs font-bold text-indigo-800 shadow-sm transition hover:bg-indigo-600 hover:text-white"
                              title={`Open System View for ${uc.title}`}
                            >
                              <span>⚙️ System</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCompleteUseCase(uc, index)}
                            disabled={isUpdatingUseCase === ucCode}
                            className="w-full inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1.5 text-xs font-extrabold text-white shadow-sm transition hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60"
                            title={`Complete ${ucCode} and unlock next use case`}
                          >
                            {isUpdatingUseCase === ucCode ? (
                              <>
                                <svg
                                  className="h-3.5 w-3.5 animate-spin text-white"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                  />
                                </svg>
                                <span>Completing {ucCode}...</span>
                              </>
                            ) : (
                              <>
                                <span>✓ Complete & Unlock Next</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        /* Locked State */
                        <div className="flex items-center justify-center rounded-xl bg-slate-100 border border-slate-200 py-2.5 px-3 text-slate-400">
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                            <span>🔒</span>
                            <span>
                              Locked (Complete {getUseCaseCode(index - 1)} first)
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* DAY 7: DOCKER, CI/CD & CLOUD DEPLOYMENT */}
        {selectedDay === 7 && (
          <div className="space-y-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#153c2c] sm:text-2xl">
                  Day 7: {activeMeta.title}
                </h2>
                <p className="text-xs text-slate-600 sm:text-sm">
                  Essential DevOps and production deployment tooling required for
                  banking-grade stability and security.
                </p>
              </div>

              {/* Search Bar for Tools */}
              <div className="w-full sm:w-80">
                <label htmlFor="toolSearch" className="sr-only">
                  Search Tools
                </label>
                <div className="relative">
                  <input
                    id="toolSearch"
                    type="text"
                    placeholder="Search tool (e.g. Docker, Nginx)..."
                    value={toolSearch}
                    onChange={(e) => setToolSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 sm:text-sm"
                  />
                  {toolSearch && (
                    <button
                      onClick={() => setToolSearch("")}
                      className="absolute right-3 top-2 text-xs font-bold text-slate-400 hover:text-slate-600"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  className="flex flex-col justify-between rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                        {tool.category}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {tool.tag}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-black text-[#153c2c]">
                      {tool.name}
                    </h3>

                    {/* What is it */}
                    <div className="mt-3 rounded-xl bg-slate-50 p-3">
                      <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                        What is it?
                      </span>
                      <p className="mt-1 text-xs leading-relaxed text-slate-700 sm:text-sm">
                        {tool.whatIsIt}
                      </p>
                    </div>

                    {/* Why is it used in Banking */}
                    <div className="mt-3 rounded-xl bg-emerald-50/60 p-3 border border-emerald-100">
                      <span className="block text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                        Why is it used in Banking?
                      </span>
                      <p className="mt-1 text-xs leading-relaxed text-emerald-950 sm:text-sm">
                        {tool.whyUsed}
                      </p>
                    </div>

                    {/* How to Search & Verify */}
                    <div className="mt-3">
                      <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                        How to Search & Verify
                      </span>
                      <p className="mt-1 text-xs text-slate-600 font-mono bg-slate-100 px-2.5 py-1.5 rounded-lg">
                        {tool.howToSearch}
                      </p>
                    </div>

                    {/* Key Commands */}
                    <div className="mt-3">
                      <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                        Key CLI Commands & Config
                      </span>
                      <pre className="mt-1 overflow-x-auto rounded-xl bg-slate-900 p-3 text-xs text-emerald-400 font-mono">
                        {tool.keyCommands.join("\n")}
                      </pre>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <a
                      href={tool.docLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900"
                    >
                      Official Documentation & Guides ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DAY 8: PRODUCTION MONITORING, RELIABILITY & RECOVERY */}
        {selectedDay === 8 && (
          <div className="space-y-6">
            <div className="mb-6 border-b border-emerald-100 pb-4">
              <h2 className="text-xl font-extrabold text-[#153c2c] sm:text-2xl">
                Day 8: {activeMeta.title}
              </h2>
              <p className="text-xs text-slate-600 sm:text-sm">
                Step-by-step production deployment pipeline and reliability
                workflow from local code to live AWS/Docker URL.
              </p>
            </div>

            <div className="space-y-5">
              {DEPLOYMENT_STEPS.map((s) => (
                <div
                  key={s.step}
                  className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-base font-black text-white shadow-md shadow-emerald-600/30">
                        {s.step}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-[#153c2c]">
                            {s.title}
                          </h3>
                          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                            {s.summary}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                          {s.details}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Commands / Workflow box */}
                  <div className="mt-4 rounded-xl bg-slate-900 p-4 font-mono text-xs text-emerald-300 overflow-x-auto">
                    {s.commands.join("\n")}
                  </div>

                  {/* Best practice callout */}
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-800">
                    <span>💡 Banking Best Practice:</span>
                    <span className="text-slate-600">{s.bestPractice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DAY 9: TECHNICAL INTERVIEWS & CAREER LAUNCH */}
        {selectedDay === 9 && (
          <div className="space-y-8">
            <div className="mb-6 border-b border-emerald-100 pb-4">
              <h2 className="text-xl font-extrabold text-[#153c2c] sm:text-2xl">
                Day 9: {activeMeta.title}
              </h2>
              <p className="text-xs text-slate-600 sm:text-sm">
                51 Use-Case Architecture Viva, Mock Interview Checklist, and Final Knowledge Assessment.
              </p>
            </div>

            {/* Section 1: Architecture Viva Questions */}
            <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-[#153c2c]">
                    🎓 51 Use-Case Architecture Viva Questions
                  </h3>
                  <p className="text-xs text-slate-500">
                    High-impact interview defense questions asked by technical
                    architects and hiring panels.
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {VIVA_QUESTIONS.map((item, idx) => {
                  const isOpen = activeViva === idx;
                  return (
                    <div
                      key={item.q}
                      className="overflow-hidden rounded-xl border border-slate-200 bg-white transition"
                    >
                      <button
                        onClick={() => setActiveViva(isOpen ? null : idx)}
                        className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-bold text-[#143c2c] hover:bg-emerald-50/50"
                      >
                        <span>{item.q}</span>
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black transition ${
                            isOpen
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="border-t border-slate-100 bg-slate-50/70 p-4 text-xs leading-relaxed text-slate-700 sm:text-sm">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Interactive Assessment Test */}
            <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                  Online Assessment
                </span>
                <h3 className="mt-1 text-lg font-black text-[#153c2c]">
                  📝 Banking Tech Readiness Test (5 Questions)
                </h3>
                <p className="text-xs text-slate-500">
                  Select your answers below and click "Evaluate Score" to assess
                  your technical confidence.
                </p>
              </div>

              <div className="mt-6 space-y-6">
                {[
                  {
                    id: 1,
                    question:
                      "When is an account classified as Non-Performing Asset (NPA) in standard banking regulation?",
                    options: [
                      "Immediately when payment is overdue by 1 day",
                      "When interest or instalment remains overdue for more than 90 days",
                      "Only after a formal legal suit is filed in court",
                      "When borrower net worth falls below loan principal",
                    ],
                    correct: 1,
                  },
                  {
                    id: 2,
                    question:
                      "In FMS loan settlement FIFO knock-off, which element is cleared first from borrower payment?",
                    options: [
                      "Principal balance amount",
                      "Future interest instalments",
                      "Overdue charges, penalties, and unpaid interest",
                      "Legal expense reserves",
                    ],
                    correct: 2,
                  },
                  {
                    id: 3,
                    question:
                      "Why is an Nginx Reverse Proxy placed in front of containerized microservices?",
                    options: [
                      "To execute SQL queries faster",
                      "For SSL termination, load balancing, security, and forwarding port 80/443 traffic",
                      "To compile TypeScript code in production",
                      "To store borrower passport scans permanently",
                    ],
                    correct: 1,
                  },
                  {
                    id: 4,
                    question:
                      "What is the key purpose of Point-in-Time Recovery (PITR) in banking databases?",
                    options: [
                      "To delete expired loan records automatically",
                      "To restore the database to any specific second before an erroneous transaction occurred",
                      "To encrypt PDF sanction letters",
                      "To automatically sanction personal loans",
                    ],
                    correct: 1,
                  },
                  {
                    id: 5,
                    question:
                      "What does Beginning-of-Day (BOD) process execute in the CMS module?",
                    options: [
                      "Deletes all customer profiles",
                      "Initializes and prepares daily delinquent queue allocations for collection agents",
                      "Transfers money directly to borrowers",
                      "Cancels all cheques",
                    ],
                    correct: 1,
                  },
                ].map((q) => (
                  <div
                    key={q.id}
                    className="rounded-xl border border-slate-200 bg-slate-50/50 p-4"
                  >
                    <p className="text-sm font-bold text-slate-900">
                      Q{q.id}. {q.question}
                    </p>
                    <div className="mt-3 space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedQuizAnswers[q.id] === optIdx;
                        const isCorrect = q.correct === optIdx;
                        return (
                          <label
                            key={opt}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-xs sm:text-sm transition ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-50/70 font-semibold text-emerald-950"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                            } ${
                              showQuizResults
                                ? isCorrect
                                  ? "border-emerald-500 bg-emerald-100 text-emerald-900 font-bold"
                                  : isSelected
                                    ? "border-rose-400 bg-rose-50 text-rose-800"
                                    : ""
                                : ""
                            }`}
                          >
                            <input
                              type="radio"
                              name={`quiz-${q.id}`}
                              checked={isSelected}
                              onChange={() =>
                                setSelectedQuizAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: optIdx,
                                }))
                              }
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                <button
                  onClick={() => setShowQuizResults(true)}
                  className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-700 sm:text-sm"
                >
                  Evaluate Assessment
                </button>

                {showQuizResults && (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-800 sm:text-sm">
                    Score:{" "}
                    {
                      [1, 2, 3, 4, 5].filter(
                        (id) =>
                          selectedQuizAnswers[id] ===
                          (id === 1
                            ? 1
                            : id === 2
                              ? 2
                              : id === 3
                                ? 1
                                : id === 4
                                  ? 1
                                  : 1),
                      ).length
                    }{" "}
                    / 5 Correct Answers! Keep revising the viva questions.
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Resume & Interview Checklist */}
            <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-black text-[#153c2c]">
                📄 ATS Resume & Technical Portfolio Checklist
              </h3>
              <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                Ensure your resume highlights the exact practical deliverables
                built during these 9 days:
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-200 p-4">
                  <span className="font-extrabold text-xs uppercase text-emerald-700">
                    Keyword Focus
                  </span>
                  <h4 className="mt-1 font-bold text-slate-900 text-sm">
                    BFSI Lending Workflows
                  </h4>
                  <p className="mt-1 text-xs text-slate-600">
                    LOS Onboarding, KYC deduplication, Credit Appraisal,
                    Sanction Generation, FIFO knock-off, NPA Provisioning, DPD
                    Queues, Delinquency Curing.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <span className="font-extrabold text-xs uppercase text-indigo-700">
                    Engineering Focus
                  </span>
                  <h4 className="mt-1 font-bold text-slate-900 text-sm">
                    Full-Stack & Cloud Architecture
                  </h4>
                  <p className="mt-1 text-xs text-slate-600">
                    React TypeScript, REST API Integration, Docker
                    Containerization, GitHub Actions CI/CD, Nginx Reverse Proxy,
                    AWS EC2, SSL TLS 1.3.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <span className="font-extrabold text-xs uppercase text-amber-700">
                    Interview Focus
                  </span>
                  <h4 className="mt-1 font-bold text-slate-900 text-sm">
                    Architecture Defense
                  </h4>
                  <p className="mt-1 text-xs text-slate-600">
                    Able to walk interviewers through database schema,
                    transaction reconciliation, zero-downtime deployments, and
                    recovery strategies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 w-full border-t border-emerald-100 bg-[#edf7f1] py-8 text-center text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <img
              src={nineDaysLogo}
              alt="9-Days Job Program"
              className="h-8 w-auto object-contain"
            />
            <span>• 9-Days Job Program Portal</span>
          </div>
          <div className="flex gap-4 font-semibold text-slate-600">
            <button
              onClick={() => handleSelectDay(1)}
              className="hover:text-emerald-700"
            >
              Curriculum
            </button>
            <button
              onClick={() => handleSelectDay(7)}
              className="hover:text-emerald-700"
            >
              DevOps
            </button>
            <button
              onClick={() => handleSelectDay(9)}
              className="hover:text-emerald-700"
            >
              Viva & Exam
            </button>
            <a
              href="https://www.askoxy.ai"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-700"
            >
              ASKOXY.AI
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
