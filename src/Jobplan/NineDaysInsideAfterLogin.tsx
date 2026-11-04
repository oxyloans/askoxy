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
import {
  ModuleKey,
  NineDaysUseCaseItem,
  NINE_DAYS_USE_CASES,
  getUseCaseCode,
  parseUseCaseNumbers,
} from "./nineDaysUseCasesData";

export * from "./nineDaysUseCasesData";

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

// Day 7: Suggested Banking Project Details & IDE Setup
export const PROJECT_CONFIG = {
  suggestedName: "OxyBank-Enterprise-Lending",
  altNames: ["FinLend360-Platform", "OxyCore-Lending-Suite"],
  architecture: "Full-Stack Modular Architecture (LOS + FMS + CMS)",
  techStack: {
    frontend: "React 18, TypeScript, Tailwind CSS, Lucide Icons, Axios",
    backend: "Node.js (Express / TypeScript) or Java Spring Boot",
    database: "PostgreSQL (ACID compliance) + Redis Cache",
    apiPattern: "RESTful JSON API with OpenAPI/Swagger contracts",
  },
  runEnvironments: [
    {
      label: "Frontend Web Application",
      url: "http://localhost:3000",
      command: "npm start (or npm run dev)",
      description: "User dashboard, loan application forms, repayment tables, and queue management.",
    },
    {
      label: "Backend REST API Server",
      url: "http://localhost:8080",
      command: "npm run dev (or nodemon src/server.ts)",
      description: "Business logic engine: PAN deduplication, FIFO knock-off calculations, and database CRUD.",
    },
    {
      label: "PostgreSQL Database",
      url: "localhost:5432 / oxylending_db",
      command: "docker run --name pg-bank -p 5432:5432 -e POSTGRES_PASSWORD=secret -d postgres:alpine",
      description: "ACID-compliant storage for customer KYC, loan ledgers, and audit trails.",
    },
  ],
  recommendedIdes: [
    {
      id: "cursor",
      name: "Cursor IDE",
      tag: "Top Recommended",
      badge: "AI-Native Editor",
      icon: "⚡",
      whyUse:
        "Cursor indexes your whole project folder. Its Composer mode (Ctrl+I / Cmd+I) can scaffold multi-file projects, generate backend controllers, and write full React interfaces in minutes.",
      shortcut: "Ctrl + I (Composer) / Ctrl + L (Chat)",
      docLink: "https://www.cursor.com/",
    },
    {
      id: "windsurf",
      name: "Windsurf IDE",
      tag: "AI Cascade Flow",
      badge: "Codeium AI",
      icon: "🌊",
      whyUse:
        "Windsurf features 'Cascade AI' that deeply understands multi-directory project context and executes terminal commands directly while generating code for all 51 use cases.",
      shortcut: "Ctrl + K (Inline AI) / Cascade Panel",
      docLink: "https://codeium.com/windsurf",
    },
    {
      id: "vscode",
      name: "VS Code + Copilot / Claude",
      tag: "Industry Standard",
      badge: "Extensible",
      icon: "💻",
      whyUse:
        "The global developer standard. Pair it with GitHub Copilot Chat, Claude Code CLI, or Antigravity / Gemini Code Assist to generate and test your banking codebase.",
      shortcut: "Ctrl + Shift + P / Copilot Chat Panel",
      docLink: "https://code.visualstudio.com/",
    },
  ],
};

// Day 7: 6-Phase Step-by-Step AI Project Build Workflow
export const DAY7_PROJECT_STEPS = [
  {
    step: 1,
    phase: "Phase 1: Setup & Architecture",
    title: "Project Initialization & Workspace Architecture",
    duration: "45 mins",
    summary:
      "Initialize the repository, setup directory structure, and install essential frontend & backend dependencies in your chosen IDE.",
    folderTree: `oxybank-enterprise-lending/
├── frontend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── los/  # UC 1-13 (Onboarding, KYC, Credit Appraisal, Sanction)
│   │   │   ├── fms/  # UC 14-34 (Disbursement, FIFO Knock-off, NPA, EOD)
│   │   │   └── cms/  # UC 35-51 (DPD Queues, PTP Tracking, Legal Notices)
│   │   ├── components/ # Navigation, Metrics, Status Badges
│   │   ├── types/      # Banking Domain TypeScript Types
│   │   └── services/   # apiClient.ts
├── backend/
│   ├── src/
│   │   ├── controllers/ # losController, fmsController, cmsController
│   │   ├── models/      # Customer, Loan, Ledger, Repayment, Queue
│   │   └── routes/      # losRoutes.ts, fmsRoutes.ts, cmsRoutes.ts
├── package.json
└── README.md`,
    commands: [
      "# 1. Create project root folder",
      "mkdir oxybank-enterprise-lending && cd oxybank-enterprise-lending",
      "",
      "# 2. Scaffold React TypeScript Frontend",
      "npx create-react-app frontend --template typescript",
      "cd frontend && npm install axios lucide-react sweetalert2",
      "npm install -D tailwindcss postcss autoprefixer",
      "npx tailwindcss init -p",
      "",
      "# 3. Scaffold Node.js TypeScript Backend",
      "cd .. && mkdir backend && cd backend",
      "npm init -y",
      "npm install express cors dotenv pg",
      "npm install -D typescript ts-node @types/node @types/express @types/cors",
      "npx tsc --init",
    ],
    bestPractice:
      "Keep banking domain modules (LOS, FMS, CMS) decoupled so each can be migrated to standalone microservices when traffic grows.",
  },
  {
    step: 2,
    phase: "Phase 2: Master AI Scaffold Prompt",
    title: "Master AI Prompt for Full-Stack 51 Use-Case Scaffolding",
    duration: "30 mins",
    summary:
      "Copy and paste this master architecture prompt into Cursor Composer (Ctrl+I) or Claude 3.7 / ChatGPT 4o to scaffold the entire project boilerplate.",
    aiPrompt: `You are an expert BFSI software architect. Scaffold a complete enterprise full-stack banking web app named "OxyBank-Enterprise-Lending" in React 18 (TypeScript, Tailwind CSS) and Node.js Express (TypeScript).

The platform must implement all 51 core banking use cases split into 3 distinct modules:
1. LOS (Loan Origination System - Use Cases 1 to 13):
   - Customer ID creation with national ID deduplication (PAN/Aadhaar)
   - Co-applicant & Guarantor KYC document linking
   - Preliminary loan assessment, CIBIL bureau credit scoring, and Sanction Recommendation Letter generation.
2. FMS (Financial Management System - Use Cases 14 to 34):
   - Loan disbursement ledger & Repayment schedule generation
   - Core FIFO (First-In, First-Out) repayment knock-off engine (clearing penalties -> overdue interest -> principal)
   - EOD/BOD batch interest accruals and 90-day DPD Non-Performing Asset (NPA) classification.
3. CMS (Collection Management System - Use Cases 35 to 51):
   - Delinquency queues segmented by DPD (1-30, 31-60, 61-90 DPD)
   - Promise-to-Pay (PTP) recording and field collector follow-up tracking
   - Automated Legal Notice generator and One-Time Settlement (OTS) waiver approval workflow.

Generate clean TypeScript types, modular mock controllers, and reactive UI navigation connecting all 51 use cases.`,
    bestPractice:
      "Paste this into Cursor's Composer mode (Ctrl+I). Cursor will create the folder hierarchy and write the module interfaces automatically.",
  },
  {
    step: 3,
    phase: "Phase 3: Module 1 Implementation",
    title: "LOS: Borrower Onboarding, KYC & Credit Appraisal (UC 1 to 13)",
    duration: "2 hours",
    summary:
      "Implement customer deduplication, co-applicant KYC linkage, bureau scoring integration, and sanction letter generation.",
    files: [
      "frontend/src/modules/los/CustomerOnboarding.tsx",
      "frontend/src/modules/los/KycDocumentUploader.tsx",
      "frontend/src/modules/los/CreditAppraisalEngine.tsx",
      "frontend/src/modules/los/SanctionLetterModal.tsx",
      "backend/src/controllers/losController.ts",
    ],
    aiPrompt: `Prompt for Cursor/Claude:
"Implement Module 1: LOS (Loan Origination System) for OxyBank.
Create 'CustomerOnboarding.tsx' with PAN/Aadhaar validation and deduplication check against CBS.
Create 'CreditAppraisalEngine.tsx' that accepts income, existing EMI debts, calculates Debt-to-Income (DTI), queries simulated CIBIL score (300-900), and auto-generates a Sanction Recommendation Letter if score >= 700 with approved loan amount and interest rate."`,
    verificationCheck:
      "Open http://localhost:3000/los, fill borrower details, enter PAN, verify deduplication check passes, and view generated Sanction Letter.",
    bestPractice:
      "Enforce strict frontend and backend input validation for National Identifiers (PAN: 10 chars uppercase alphanumeric).",
  },
  {
    step: 4,
    phase: "Phase 4: Module 2 Implementation",
    title: "FMS: Repayment Schedules & FIFO Knock-off Engine (UC 14 to 34)",
    duration: "2.5 hours",
    summary:
      "Build repayment schedule calculators, automated FIFO knock-off for loan payments, and 90-day NPA provisioning.",
    files: [
      "frontend/src/modules/fms/RepaymentSchedule.tsx",
      "frontend/src/modules/fms/PaymentSettlement.tsx",
      "frontend/src/modules/fms/NpaProvisioning.tsx",
      "backend/src/services/FifoKnockOffService.ts",
      "backend/src/controllers/fmsController.ts",
    ],
    aiPrompt: `Prompt for Cursor/Claude:
"Implement Module 2: FMS (Financial Management System) for OxyBank.
Implement 'FifoKnockOffService.ts': When borrower pays an EMI amount, apply strict FIFO knock-off:
1. First clear unpaid late fees and penalties
2. Next clear oldest accrued overdue interest
3. Finally apply remaining balance to principal component.
Also create 'NpaProvisioning.tsx' to categorize loan accounts crossing 90+ DPD into Sub-Standard, Doubtful, or Loss assets."`,
    codeSnippet: {
      filename: "backend/src/services/FifoKnockOffService.ts",
      language: "typescript",
      code: `// Banking Standard FIFO Knock-off Settlement Logic
export function applyFifoKnockOff(
  outstanding: { penalty: number; overdueInterest: number; principal: number },
  paymentAmount: number
) {
  let rem = paymentAmount;

  // 1. Clear Penalty & Charges First
  const clearedPenalty = Math.min(rem, outstanding.penalty);
  rem -= clearedPenalty;

  // 2. Clear Overdue Accrued Interest
  const clearedInterest = Math.min(rem, outstanding.overdueInterest);
  rem -= clearedInterest;

  // 3. Clear Outstanding Principal
  const clearedPrincipal = Math.min(rem, outstanding.principal);
  rem -= clearedPrincipal;

  return {
    clearedPenalty,
    clearedInterest,
    clearedPrincipal,
    unallocatedSurplus: rem,
    remainingBalance: (outstanding.penalty - clearedPenalty) +
                     (outstanding.overdueInterest - clearedInterest) +
                     (outstanding.principal - clearedPrincipal)
  };
}`,
    },
    verificationCheck:
      "Input an EMI payment of ₹25,000 for a loan with ₹3,000 penalty and ₹7,000 interest. Verify penalty and interest are fully knocked off first.",
    bestPractice:
      "Always wrap repayment knock-off in a database transaction (BEGIN ... COMMIT) to prevent race conditions during concurrent settlements.",
  },
  {
    step: 5,
    phase: "Phase 5: Module 3 Implementation",
    title: "CMS: Delinquency Queues, PTP Tracking & Curing (UC 35 to 51)",
    duration: "2 hours",
    summary:
      "Construct DPD bucket queues (1-30, 31-60, 61-90 DPD), Promise-to-Pay (PTP) tracking, field visit logs, and legal notice generation.",
    files: [
      "frontend/src/modules/cms/DelinquencyQueues.tsx",
      "frontend/src/modules/cms/PtpTracker.tsx",
      "frontend/src/modules/cms/LegalNoticeGenerator.tsx",
      "backend/src/controllers/cmsController.ts",
    ],
    aiPrompt: `Prompt for Cursor/Claude:
"Implement Module 3: CMS (Collection Management System) for OxyBank.
Build 'DelinquencyQueues.tsx' with bucket filters (DPD 1-30 Early Delinquency, DPD 31-60 Mid-Stage, DPD 61-90 Severe Default).
For each delinquent account, allow collection officers to log a Promise-to-Pay (PTP) date, record call dispositions, print Legal Recall Notices, or submit a One-Time Settlement (OTS) waiver request."`,
    verificationCheck:
      "Navigate to CMS Delinquency Queue, filter accounts by 'DPD 31-60', log a PTP date for next Monday, and confirm account state updates to 'PTP Logged'.",
    bestPractice:
      "Store all field officer collector notes with immutable audit timestamps for banking regulatory compliance.",
  },
  {
    step: 6,
    phase: "Phase 6: IDE Execution & AI Debugging",
    title: "Multi-Service Execution, Local Testing & AI Debugging",
    duration: "1 hour",
    summary:
      "Launch frontend & backend services simultaneously in your IDE, verify all endpoints, and use AI to fix any compilation errors.",
    commands: [
      "# Open two terminal tabs in Cursor / VS Code:",
      "",
      "# Tab 1: Start Backend API (Port 8080)",
      "cd backend && npm run dev",
      "# => [OxyBank API] listening at http://localhost:8080",
      "",
      "# Tab 2: Start Frontend Web App (Port 3000)",
      "cd frontend && npm start",
      "# => [React App] running at http://localhost:3000",
    ],
    aiPrompt: `AI Debugging Trick in Cursor / VS Code:
Highlight any compilation error in terminal or code editor, press 'Ctrl + L' (Chat) or 'Ctrl + K' (Inline Edit) and ask:
"Fix this TypeScript error in OxyBank without breaking the banking domain types."`,
    verificationCheck:
      "Open http://localhost:3000 in your browser, test customer creation in LOS, inspect network tab verifying requests to http://localhost:8080, and ensure zero console errors.",
    bestPractice:
      "Add a Health Check endpoint (GET /api/health returning { status: 'UP', timestamp: Date.now() }) to ensure your app is ready for Day 8 deployment.",
  },
];

// Day 8: Step-by-Step Production Deployment Guide
export const DEPLOYMENT_STEPS = [
  {
    step: 1,
    title: "Environment Configuration & Production Secrets Hardening",
    summary:
      "Segregate configurations and protect production API keys & database credentials.",
    details:
      "Never commit production secrets into Git repositories. Create an isolated `.env.production` file for OxyBank containing database connection strings, JWT secret keys, and banking service ports.",
    commands: [
      "# Create protected production environment file",
      "touch .env.production",
      "chmod 600 .env.production  # Read-write restricted to owner",
      "cat << 'EOF' > .env.production",
      "PORT=8080",
      "NODE_ENV=production",
      "DATABASE_URL=postgres://oxybank_admin:StrongP@ssw0rd!@postgres:5432/oxybank_prod",
      "JWT_SECRET=super_secret_banking_jwt_token_2026",
      "CORS_ORIGIN=https://jobplan.askoxy.ai",
      "EOF",
    ],
    bestPractice:
      "Use AWS Secrets Manager or HashiCorp Vault for rotated production keys in regulated banking environments.",
  },
  {
    step: 2,
    title: "Multi-Stage Docker Packaging (Frontend & Backend)",
    summary: "Build ultra-lean, secure Docker images with minimal attack surface.",
    details:
      "Use two-stage Dockerfiles. Stage 1 compiles TypeScript and runs lint checks using Node.js; Stage 2 copies only the production build artifacts into an ultra-lean Alpine container.",
    commands: [
      "# --- frontend/Dockerfile ---",
      "FROM node:18-alpine AS build",
      "WORKDIR /app && COPY package*.json ./ && RUN npm ci",
      "COPY . . && RUN npm run build",
      "FROM nginx:alpine",
      "COPY --from=build /app/dist /usr/share/nginx/html",
      "EXPOSE 80",
      "",
      "# --- backend/Dockerfile ---",
      "FROM node:18-alpine AS backend-build",
      "WORKDIR /app && COPY package*.json ./ && RUN npm ci",
      "COPY . . && RUN npm run build",
      "EXPOSE 8080",
      'CMD ["node", "dist/server.js"]',
    ],
    bestPractice:
      "Multi-stage builds reduce image size from 1.2 GB to under 40 MB and eliminate build tool security vulnerabilities.",
  },
  {
    step: 3,
    title: "Multi-Container Docker Compose Stack (App + Postgres + Redis)",
    summary:
      "Orchestrate all banking microservices with isolated internal networking.",
    details:
      "Define `docker-compose.yml` in the project root to launch the frontend, backend API, PostgreSQL database with persistent volume, and Redis cache with automated health checks.",
    commands: [
      "# Run full multi-container stack in background:",
      "docker-compose up -d --build",
      "",
      "# Verify running containers:",
      "docker-compose ps",
      "",
      "# Check live logs for OxyBank API:",
      "docker-compose logs -f backend",
    ],
    bestPractice:
      "Always set up named volumes (`postgres_data:/var/lib/postgresql/data`) to protect financial records across container restarts.",
  },
  {
    step: 4,
    title: "GitHub Repository & Automated CI/CD (GitHub Actions)",
    summary:
      "Automate testing, container building, and deployment upon git push.",
    details:
      "Configure a GitHub workflow in `.github/workflows/deploy.yml`. Whenever code is merged into `main`, GitHub Actions automatically runs tests, builds Docker images, and triggers deployment.",
    commands: [
      "# Initialize Git and push to GitHub",
      "git init && git add .",
      'git commit -m "feat: complete 51 use cases for OxyBank"',
      "git remote add origin https://github.com/your-username/oxybank-enterprise-lending.git",
      "git branch -M main && git push -u origin main",
    ],
    bestPractice:
      "Enforce branch protection rules requiring passing CI checks and at least 1 peer approval before merging into main.",
  },
  {
    step: 5,
    title: "AWS EC2 Cloud Server Provisioning & SSH Access",
    summary: "Launch cloud compute instances and configure firewall rules.",
    details:
      "Launch an Ubuntu 22.04 LTS instance on AWS EC2 (t3.small or t3.medium). Configure the Security Group firewall to open only port 80 (HTTP), port 443 (HTTPS), and port 22 (SSH).",
    commands: [
      "# SSH into the AWS server securely",
      'ssh -i "oxy-deploy-key.pem" ubuntu@<your-ec2-public-ip>',
      "",
      "# Update OS & install Docker + Compose",
      "sudo apt update && sudo apt upgrade -y",
      "sudo apt install -y docker.io docker-compose git ufw",
      "sudo usermod -aG docker ubuntu",
    ],
    bestPractice:
      "Never leave port 22 open to 0.0.0.0/0. Restrict SSH ingress to your office or static VPN IP.",
  },
  {
    step: 6,
    title: "Security Firewall Hardening via UFW",
    summary: "Lock down all unused network ports on the production server.",
    details:
      "Configure Uncomplicated Firewall (UFW) to block all unsolicited incoming connections except HTTP, HTTPS, and SSH.",
    commands: [
      "# Configure UFW firewall rules",
      "sudo ufw default deny incoming",
      "sudo ufw default allow outgoing",
      "sudo ufw allow 22/tcp   # SSH",
      "sudo ufw allow 80/tcp   # HTTP",
      "sudo ufw allow 443/tcp  # HTTPS",
      "sudo ufw enable",
      "sudo ufw status verbose",
    ],
    bestPractice:
      "Enable UFW only after explicitly adding the SSH allow rule to prevent accidental lockout from the cloud instance.",
  },
  {
    step: 7,
    title: "Nginx Reverse Proxy & Custom Domain Routing",
    summary:
      "Route incoming web traffic through Nginx gateway to OxyBank containers.",
    details:
      "Install Nginx on the host and configure `/etc/nginx/sites-available/oxybank.conf`. Forward web traffic to the frontend container on port 80 and API calls to port 8080.",
    commands: [
      "sudo apt install -y nginx",
      "# Create Nginx server configuration",
      "sudo nano /etc/nginx/sites-available/oxybank.conf",
      "# Test Nginx syntax and reload",
      "sudo nginx -t",
      "sudo systemctl restart nginx",
    ],
    bestPractice:
      "Always test configuration syntax with `sudo nginx -t` before restarting Nginx to avoid downtime.",
  },
  {
    step: 8,
    title: "SSL/TLS via Let's Encrypt Certbot & Live URL Verification",
    summary:
      "Obtain automated trusted SSL certificates and verify live production endpoints.",
    details:
      "Run Certbot with the Nginx plugin to issue automated trusted HTTPS certificates. Verify your live domain URL and probe the `/api/health` endpoint.",
    commands: [
      "# Install Certbot and request SSL certificate",
      "sudo apt install -y certbot python3-certbot-nginx",
      "sudo certbot --nginx -d jobplan.askoxy.ai",
      "",
      "# Test auto-renewal timer",
      "sudo certbot renew --dry-run",
      "",
      "# Verify live health check endpoint",
      "curl -f https://jobplan.askoxy.ai/api/health",
    ],
    bestPractice:
      "Enforce HTTP Strict Transport Security (HSTS) and modern TLS 1.3 encryption for all banking endpoints.",
  },
];

export default function NineDaysInsideAfterLogin() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedText(label);
      Toast.fire({
        icon: "success",
        title: `${label} copied to clipboard!`,
      });
      setTimeout(() => setCopiedText(null), 3000);
    } catch (err) {
      Toast.fire({
        icon: "info",
        title: `Copied ${label}`,
      });
    }
  };

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
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<
    Record<number, number>
  >({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  // Interest Registration State
  const [isRegisteringInterest, setIsRegisteringInterest] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState<boolean>(
    () => {
      const uid =
        new URLSearchParams(window.location.search).get("userId") ||
        new URLSearchParams(window.location.search).get("userid") ||
        localStorage.getItem("userId") ||
        localStorage.getItem("userid") ||
        localStorage.getItem("customerId") ||
        sessionStorage.getItem("userId") ||
        sessionStorage.getItem("userid") ||
        "";
      if (
        uid &&
        localStorage.getItem(`job_program_registered_${uid}`) === "true"
      ) {
        return true;
      }
      return localStorage.getItem("job_program_registered") === "true";
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

  // Synchronize completed use cases when selectedDay changes, or when returning to this page (focus / storage)
  useEffect(() => {
    const syncCompleted = () => {
      try {
        const saved = localStorage.getItem(
          `job_program_completed_ucs_day_${selectedDay}`,
        );
        setCompletedUseCases(saved ? JSON.parse(saved) : []);
      } catch {
        setCompletedUseCases([]);
      }
    };

    syncCompleted();
    window.addEventListener("focus", syncCompleted);
    window.addEventListener("storage", syncCompleted);
    return () => {
      window.removeEventListener("focus", syncCompleted);
      window.removeEventListener("storage", syncCompleted);
    };
  }, [selectedDay]);

  // Check if a use case in the current day is unlocked (Day 1 & Use Case 1 unlock only after expressing interest)
  const isUseCaseUnlocked = useCallback(
    (indexInDay: number) => {
      // If user has not registered interest, ALL use cases are disabled/locked
      if (!isAlreadyRegistered) return false;

      // First use case in any day is open once interest is registered
      if (indexInDay === 0) return true;
      // Subsequent use case is open only if previous one is completed
      const prevCode = getUseCaseCode(indexInDay - 1);
      return completedUseCases.includes(prevCode);
    },
    [completedUseCases, isAlreadyRegistered],
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

            // Parse useCaseNumbers string from GET call (e.g. "UC-01,UC-02,UC-03")
            // Separates use cases, marks them as completed, and unlocks next use case
            if (Array.isArray(d.days)) {
              d.days.forEach((dayItem: any) => {
                const dayNum = dayItem?.dayNumber;
                const rawUcs = dayItem?.useCaseNumbers;
                if (dayNum && rawUcs) {
                  const parsed = parseUseCaseNumbers(rawUcs);
                  if (parsed.length > 0) {
                    const existingStr = localStorage.getItem(
                      `job_program_completed_ucs_day_${dayNum}`,
                    );
                    const existing: string[] = existingStr
                      ? JSON.parse(existingStr)
                      : [];
                    const merged = Array.from(
                      new Set([...existing, ...parsed]),
                    );
                    localStorage.setItem(
                      `job_program_completed_ucs_day_${dayNum}`,
                      JSON.stringify(merged),
                    );
                    if (dayNum === selectedDay) {
                      setCompletedUseCases(merged);
                    }
                  }
                }
              });
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

            // Parse useCaseNumbers string from start response (e.g. "UC-01,UC-02,UC-03")
            const rawUcs =
              resData.data?.useCaseNumbers || resData.useCaseNumbers;
            const targetDay =
              resData.data?.dayNumber || resData.dayNumber || dayNum;
            if (targetDay && rawUcs) {
              const parsed = parseUseCaseNumbers(rawUcs);
              if (parsed.length > 0) {
                const existingStr = localStorage.getItem(
                  `job_program_completed_ucs_day_${targetDay}`,
                );
                const existing: string[] = existingStr
                  ? JSON.parse(existingStr)
                  : [];
                const merged = Array.from(new Set([...existing, ...parsed]));
                localStorage.setItem(
                  `job_program_completed_ucs_day_${targetDay}`,
                  JSON.stringify(merged),
                );
                if (targetDay === selectedDay) {
                  setCompletedUseCases(merged);
                }
              }
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
      // Mark as registered and unlock Day 1 & Use Case 1 immediately
      setIsAlreadyRegistered(true);
      localStorage.setItem(`job_program_registered_${resolvedUserId}`, "true");
      localStorage.setItem("job_program_registered", "true");

      if (resultData.enrollmentId) {
        setEnrollmentId(resultData.enrollmentId);
        localStorage.setItem(
          "job_program_enrollment_id",
          resultData.enrollmentId,
        );
      }

      // Display SweetAlert2 Toast with server message
      Toast.fire({
        icon: "success",
        title:
          resultData.message ||
          "Day 1 and Use Case 1 are now unlocked! Happy Learning!",
      });

      // Immediately fetch dashboard to get currentDay and start Day 1
      setCurrentAvailableDay((prev) => (prev < 1 ? 1 : prev));
      localStorage.setItem("job_program_current_day", "1");
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

          // Parse useCaseNumbers string from update response
          const rawUcs = resData.data?.useCaseNumbers || resData.useCaseNumbers;
          if (rawUcs) {
            const parsed = parseUseCaseNumbers(rawUcs);
            if (parsed.length > 0) {
              const existingStr = localStorage.getItem(
                `job_program_completed_ucs_day_${selectedDay}`,
              );
              const existing: string[] = existingStr ? JSON.parse(existingStr) : [];
              const merged = Array.from(new Set([...existing, ...parsed, ucCode]));
              localStorage.setItem(
                `job_program_completed_ucs_day_${selectedDay}`,
                JSON.stringify(merged),
              );
              setCompletedUseCases(merged);
            }
          }
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
    // If user has not registered interest yet
    if (!isAlreadyRegistered) {
      Toast.fire({
        icon: "warning",
        title:
          'Please click "Interested in this program" first to unlock Day 1.',
      });
      return;
    }

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
            {/* Show "Interested in this program" button ONLY if NOT already registered */}
            {!isAlreadyRegistered ? (
              <button
                type="button"
                onClick={handleRegisterInterest}
                disabled={isRegisteringInterest}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:from-emerald-700 hover:to-teal-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 sm:px-4 sm:py-2 sm:text-sm"
                title="Express your interest for the 9-Day Job Program"
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
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span className="text-amber-300">★</span>
                    <span>Interested in this program</span>
                  </>
                )}
              </button>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-extrabold text-emerald-800">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
                  ✓
                </span>
                <span>Enrolled in 9-Days Program</span>
              </span>
            )}

            {/* Dashboard Button */}
            {/* <button
              type="button"
              onClick={() => navigate("/9daysjobprogramdashboard")}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 sm:text-sm"
              title="View 9-Days Job Program Dashboard & Progress"
            >
              <span>📊</span>
              <span>Dashboard</span>
            </button> */}

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
                    ? "Build your own complete banking project covering all 51 use cases using modern AI tools and IDEs."
                    : selectedDay === 8
                      ? "Step-by-step complete guide to deploy your 51 use-case banking application live on cloud servers."
                      : "Final Knowledge Examination and Technical Assessment."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9 Days Tab Bar (All 9 Days visible, touch-scrollable on mobile) */}
      <nav
        aria-label="9-Days Sprint Progress"
        className="sticky top-[61px] z-30 w-full border-b border-slate-200/90 bg-white shadow-sm"
      >
        <div className="mx-auto max-w-7xl px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="overflow-x-auto py-2 sm:py-2.5">
            <div className="grid grid-cols-9 min-w-[540px] sm:min-w-0 gap-1 sm:gap-1.5 md:gap-2">
            {dayMeta.map((dm) => {
              const isActive = selectedDay === dm.day;
              const isLocked =
                !isAlreadyRegistered || dm.day > currentAvailableDay;

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
                      ? !isAlreadyRegistered
                        ? 'Please click "Interested in this program" first to unlock Day 1.'
                        : `Day ${dm.day} is locked. Current available day is ${currentAvailableDay}.`
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

            {/* If not registered, show prompt banner to express interest */}
            {!isAlreadyRegistered && (
              <div className="mb-6 rounded-2xl border-2 border-emerald-300 bg-gradient-to-r from-emerald-50 via-teal-50 to-white p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
                        ★
                      </span>
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                        Interested in the 9-Days Job Program?
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Click below to express your interest and unlock Day 1
                      &amp; Use Case 1 immediately.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRegisterInterest}
                    disabled={isRegisteringInterest}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-md transition hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60"
                  >
                    <span className="text-amber-300">★</span>
                    <span>
                      {isRegisteringInterest
                        ? "Submitting..."
                        : "Interested in this program"}
                    </span>
                  </button>
                </div>
              </div>
            )}

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
                        /* Completed State */
                        <div className="space-y-2">
                          <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 py-2 px-3">
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
                        </div>
                      ) : isCurrent ? (
                        /* Open / Current: Business and System (Complete & Unlock Next moved to route page) */
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
                      ) : (
                        /* Locked State */
                        <div className="flex items-center justify-center rounded-xl bg-slate-100 border border-slate-200 py-2.5 px-3 text-slate-400">
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                            <span>🔒</span>
                            <span>
                              {!isAlreadyRegistered
                                ? 'Locked (Click "Interested in this program" to unlock)'
                                : `Locked (Complete ${getUseCaseCode(index - 1)} first)`}
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

        {/* DAY 7: BUILD 51 USE-CASE BANKING PROJECT WITH AI TOOLS */}
        {selectedDay === 7 && (
          <div className="space-y-8">
            {/* Header & Goal Banner */}
            <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-white via-emerald-50/40 to-emerald-100/30 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
                    <span>⚡</span>
                    <span>Day 7 Capstone Project</span>
                  </span>
                  <h2 className="mt-3 text-2xl font-black tracking-tight text-[#143d2c] sm:text-3xl">
                    Build Your 51 Use-Case Banking Project with AI Tools
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    Build a complete enterprise core lending web app (LOS, FMS, CMS) using AI coding tools (Cursor Composer, Claude 3.7 / ChatGPT 4o, GitHub Copilot). Follow the structured blueprint below to generate, assemble, and run all 51 use cases locally in your IDE.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5 sm:flex-row lg:flex-col shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(DAY7_PROJECT_STEPS[1].aiPrompt || "", "Master AI Prompt")
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95 w-full sm:w-auto"
                  >
                    <span>📋</span>
                    <span>Copy Master AI Prompt</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectDay(8)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-50 w-full sm:w-auto"
                  >
                    <span>Proceed to Day 8 Deploy →</span>
                  </button>
                </div>
              </div>

              {/* Project Specification Meta Cards */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    Suggested Project Name
                  </span>
                  <div className="mt-1 flex items-center justify-between gap-1">
                    <span className="font-mono text-xs sm:text-sm font-black text-emerald-800 break-all sm:break-normal">
                      {PROJECT_CONFIG.suggestedName}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(PROJECT_CONFIG.suggestedName, "Project Name")}
                      className="rounded p-1 text-slate-400 hover:text-emerald-700 shrink-0"
                      title="Copy Project Name"
                    >
                      📋
                    </button>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Alternative: {PROJECT_CONFIG.altNames[0]}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    Core Architecture
                  </span>
                  <p className="mt-1 text-sm font-extrabold text-slate-900">
                    Modular Monolith / Microservices
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    LOS (13) • FMS (21) • CMS (17)
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    Recommended Tech Stack
                  </span>
                  <p className="mt-1 text-sm font-extrabold text-slate-900">
                    React 18 + Node.js (TypeScript)
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    PostgreSQL ACID • Tailwind CSS
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    Where Code Runs
                  </span>
                  <p className="mt-1 text-sm font-extrabold text-slate-900">
                    localhost:3000 &amp; :8080
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Node.js v18/20 LTS runtime
                  </p>
                </div>
              </div>
            </div>

            {/* Recommended IDEs & Environment Section */}
            <div>
              <div className="mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
                  Where to Write &amp; Run Your Code
                </span>
                <h3 className="mt-0.5 text-lg font-black text-[#143d2c] sm:text-xl">
                  Recommended AI-Native IDEs &amp; Local Environments
                </h3>
                <p className="text-xs text-slate-600 sm:text-sm">
                  Use these specialized AI code editors to generate files across the 51 use cases with full context awareness.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {PROJECT_CONFIG.recommendedIdes.map((ide) => (
                  <div
                    key={ide.id}
                    className="flex flex-col justify-between rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{ide.icon}</span>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                          {ide.tag}
                        </span>
                      </div>
                      <h4 className="mt-3 text-base font-extrabold text-slate-900">
                        {ide.name}
                      </h4>
                      <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                        {ide.whyUse}
                      </p>
                      <div className="mt-3 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                          Key AI Shortcut
                        </span>
                        <span className="mt-0.5 block font-mono text-xs font-bold text-emerald-800">
                          {ide.shortcut}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <a
                        href={ide.docLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900"
                      >
                        Visit {ide.name} ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Local Runtime Ports & Endpoints */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-black text-[#143d2c]">
                🌐 Local Execution Architecture (Where the Code Runs)
              </h3>
              <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                When running the project on your machine, three core services communicate locally:
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {PROJECT_CONFIG.runEnvironments.map((env) => (
                  <div
                    key={env.label}
                    className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {env.label}
                    </span>
                    <span className="mt-1 block font-mono text-sm font-extrabold text-emerald-700">
                      {env.url}
                    </span>
                    <p className="mt-1 text-xs text-slate-600">
                      {env.description}
                    </p>
                    <div className="mt-2.5 rounded-lg bg-slate-900 px-2.5 py-1.5 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                      {env.command}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step 6-Phase Build Blueprint */}
            <div>
              <div className="mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
                  Day 7 Step-by-Step Execution
                </span>
                <h3 className="mt-0.5 text-lg font-black text-[#143d2c] sm:text-xl">
                  Step-by-Step AI Build Blueprint (All 51 Use Cases)
                </h3>
                <p className="text-xs text-slate-600 sm:text-sm">
                  Execute these 6 phases during Day 7 to generate the code, implement all 3 banking modules, and verify functionality in your IDE.
                </p>
              </div>

              <div className="space-y-6">
                {DAY7_PROJECT_STEPS.map((s) => (
                  <div
                    key={s.step}
                    className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition hover:border-emerald-300 hover:shadow-md"
                  >
                    <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50/70 via-white to-white p-5 sm:p-6">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-sm font-black text-white shadow-sm">
                            {s.step}
                          </span>
                          <div>
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold uppercase text-emerald-800">
                              {s.phase}
                            </span>
                            <h4 className="mt-0.5 text-base font-black text-slate-900 sm:text-lg">
                              {s.title}
                            </h4>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-500">
                          ⏱ Est. {s.duration}
                        </span>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                        {s.summary}
                      </p>
                    </div>

                    <div className="p-5 sm:p-6 space-y-4">
                      {/* Folder Tree if present */}
                      {s.folderTree && (
                        <div>
                          <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                            Recommended Project Tree
                          </span>
                          <pre className="mt-1.5 overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-xs text-emerald-300">
                            {s.folderTree}
                          </pre>
                        </div>
                      )}

                      {/* Commands if present */}
                      {s.commands && s.commands.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                              Terminal Commands (Run in IDE)
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(s.commands.join("\n"), `Step ${s.step} Commands`)}
                              className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
                            >
                              Copy Commands 📋
                            </button>
                          </div>
                          <pre className="mt-1.5 overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-xs text-emerald-400">
                            {s.commands.join("\n")}
                          </pre>
                        </div>
                      )}

                      {/* AI Prompt if present */}
                      {s.aiPrompt && (
                        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-indigo-900">
                              <span>🤖</span>
                              <span>AI Prompt (Paste into Cursor / Claude / ChatGPT)</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(s.aiPrompt, `Step ${s.step} AI Prompt`)}
                              className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700"
                            >
                              Copy AI Prompt 📋
                            </button>
                          </div>
                          <pre className="mt-2.5 overflow-x-auto whitespace-pre-wrap rounded-lg bg-white p-3 font-mono text-xs text-slate-800 border border-indigo-200">
                            {s.aiPrompt}
                          </pre>
                        </div>
                      )}

                      {/* Files to Create */}
                      {s.files && s.files.length > 0 && (
                        <div>
                          <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                            Key Files to Generate
                          </span>
                          <div className="mt-1.5 flex flex-wrap gap-2">
                            {s.files.map((f) => (
                              <span
                                key={f}
                                className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Code Snippet if present */}
                      {s.codeSnippet && (
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="block font-mono text-xs font-extrabold text-slate-700">
                              📄 {s.codeSnippet.filename}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(s.codeSnippet?.code || "", s.codeSnippet?.filename || "Code")}
                              className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
                            >
                              Copy Code 📋
                            </button>
                          </div>
                          <pre className="mt-1.5 overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-xs text-emerald-300">
                            {s.codeSnippet.code}
                          </pre>
                        </div>
                      )}

                      {/* Verification Check */}
                      {s.verificationCheck && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5">
                          <span className="block text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                            ✓ How to Verify in Your Browser / IDE:
                          </span>
                          <p className="mt-1 text-xs font-semibold text-emerald-950 sm:text-sm">
                            {s.verificationCheck}
                          </p>
                        </div>
                      )}

                      {/* Best Practice */}
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100">
                        <span className="text-emerald-700 font-bold">💡 Best Practice:</span>
                        <span>{s.bestPractice}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DAY 8: PRODUCTION DEPLOYMENT */}
        {selectedDay === 8 && (
          <div className="space-y-8">
            <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-white via-emerald-50/40 to-emerald-100/30 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
                    <span>🚀</span>
                    <span>Day 8 Production Deployment</span>
                  </span>
                  <h2 className="mt-3 text-2xl font-black tracking-tight text-[#143d2c] sm:text-3xl">
                    Deploy Your 51 Use-Case Banking Project
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    Take your <span className="font-mono font-bold text-emerald-800">OxyBank-Enterprise-Lending</span> project built on Day 7 to a live production server. Follow the 8-stage cloud deployment pipeline with Docker, GitHub Actions CI/CD, AWS EC2, Nginx, and free Let's Encrypt SSL.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5 sm:flex-row lg:flex-col shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleSelectDay(9)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95 w-full sm:w-auto"
                  >
                    <span>Proceed to Day 9 Final Exam →</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectDay(7)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-50 w-full sm:w-auto"
                  >
                    <span>← Back to Day 7 AI Build</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
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
                  <div className="mt-4">
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Deployment Script / Config
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(s.commands.join("\n"), `Step ${s.step} Script`)}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
                      >
                        Copy Script 📋
                      </button>
                    </div>
                    <div className="rounded-xl bg-slate-900 p-4 font-mono text-xs text-emerald-300 overflow-x-auto">
                      {s.commands.join("\n")}
                    </div>
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


        {/* DAY 9: FINAL TECHNICAL ASSESSMENT & EXAM */}
        {selectedDay === 9 && (
          <div className="space-y-8">
            <div className="mb-6 border-b border-emerald-100 pb-4">
              <h2 className="text-xl font-extrabold text-[#153c2c] sm:text-2xl">
                Day 9: {activeMeta.title}
              </h2>
              <p className="text-xs text-slate-600 sm:text-sm">
                Final Online Technical Assessment &amp; Certification Exam.
              </p>
            </div>

            {/* Online Technical Assessment */}
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
                  className="w-full sm:w-auto rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-700 sm:text-sm"
                >
                  Evaluate Assessment
                </button>

                {showQuizResults && (
                  <div className="w-full sm:w-auto rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-800 sm:text-sm">
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
                    / 5 Correct Answers! Keep practicing your banking domain
                    knowledge.
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
            {/* <span>• 9-Days Job Program Portal</span> */}
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-4 font-semibold text-slate-600">
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
              AI Project Build
            </button>
            <button
              onClick={() => handleSelectDay(8)}
              className="hover:text-emerald-700"
            >
              Cloud Deployment
            </button>
            <button
              onClick={() => handleSelectDay(9)}
              className="hover:text-emerald-700"
            >
              Final Exam
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
