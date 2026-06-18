import React from "react";
import { useNavigate } from "react-router-dom";
import {
  USE_CASE_REGISTRY,
  USE_CASES_BY_FRAMEWORK,
} from "../hooks/useCaseRegistry";
import type { UseCase } from "../type/useCases";
import { engineApi } from "../hooks/engineApi";
import type {
  GenerationSession,
  GenerationStepHistory,
} from "../hooks/engineApi";
import { useState, useEffect } from "react";

// ─── Hero Section ────────────────────────────────────────────────────────────
function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-[100px] pb-20 overflow-hidden">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0, 212, 255, 0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Glow orbs */}
      <div
        className="absolute -top-[100px] left-[10%] w-[400px] h-[400px] rounded-full filter blur-[40px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-[50px] right-[5%] w-[300px] h-[300px] rounded-full filter blur-[40px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,183,0,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6 relative">
        {/* Top badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 p-1.5 px-4 bg-[#00D4FF]/10 border border-[#00D4FF]/30 rounded-full text-[13px] font-semibold text-[#00D4FF] tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse-slow" />
            OXY BFSAI · AI Discovery & Decision Platform
          </span>
        </div>

        <div className="text-center max-w-[860px] mx-auto">
          <h2 className="leading-[1.0] tracking-tight mb-6">
            <span className="text-[34px] sm:text-[44px] md:text-[54px] font-black text-[#F0F4FF]">
              Build Smarter.{" "}
            </span>
            <span className="text-[34px] sm:text-[44px] md:text-[54px] font-black bg-clip-text text-transparent bg-gradient-to-r from-[#00D4FF] via-[#38B6FF] to-[#7B5EA7]">
              Deploy Faster.
            </span>
          </h2>

          <p className="text-[16px] sm:text-[16px] font-semibold tracking-[0.2em] uppercase text-[#00D4FF] mb-3">
            From Use Case to Intelligent Decision Engine
          </p>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-32 bg-gradient-to-r from-transparent to-[#2A3A5C]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] shadow-[0_0_6px_2px_rgba(0,212,255,0.5)]" />
            <div className="h-[1px] w-32 bg-gradient-to-l from-transparent to-[#2A3A5C]" />
          </div>
          <p className="text-[13px] text-[#8B9CC8] max-w-[520px] mx-auto mb-10 leading-[1.7]">
            Build production-ready solutions from use cases using intelligent AI
            orchestration.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex gap-3 justify-center flex-wrap mb-12">
          <button
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full font-sans text-sm font-semibold cursor-pointer border-none transition-all duration-200 whitespace-nowrap bg-gradient-to-r from-[#00D4FF] to-[#0099BB] text-black shadow-[0_4px_16px_rgba(0,212,255,0.3)] hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(0,212,255,0.5)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => navigate("/generate")}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Start Generation
          </button>

          <button
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full font-sans text-sm font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap bg-white/5 text-[#F0F4FF] border border-[#00D4FF]/20 hover:border-[#00D4FF] hover:text-[#00D4FF] hover:bg-[#00D4FF]/5"
            onClick={() => {
              document
                .getElementById("use-cases")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            View 30 Use Cases
          </button>
        </div>

        {/* Stats bar */}
        <div className="flex gap-6 justify-center flex-wrap max-w-[800px] mx-auto">
          {[
            { value: "30+", label: "Use Cases" },
            { value: "3+", label: "Regulatory Frameworks" },
            { value: "13", label: "AI Agents" },
            { value: "100%", label: "Production Ready" },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center px-6 py-4 rounded-2xl bg-white/[0.03] border border-[#00D4FF]/10 hover:border-[#00D4FF]/30 hover:bg-white/[0.05] transition-all duration-200 min-w-[140px]"
            >
              <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#00D4FF] to-[#7B5EA7] leading-none tracking-tight">
                {stat.value}
              </div>
              <div className="text-[10px] text-[#7a7f95] mt-1.5 uppercase tracking-widest font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* <div className="flex items-center justify-center flex-wrap gap-1 mt-8">
          {[
            { label: "Manual Process", color: 0 },
            { label: "AI Discovery", color: 1 },
            { label: "AI Decision", color: 1 },
            { label: "Generated Code", color: 2 },
            { label: "Execute Code", color: 3 },
            { label: "Live Output", color: 3 },
            { label: "Business Outcome", color: 3 },
          ].map((s, i, arr) => (
            <React.Fragment key={s.label}>
              <span
                style={{
                  padding: "7px 14px",
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600,
                  background:
                    s.color === 0
                      ? "rgba(255,255,255,0.07)"
                      : s.color === 3
                        ? "rgba(0,184,148,0.16)"
                        : s.color === 2
                          ? "rgba(225,112,85,0.14)"
                          : "rgba(108,92,231,0.16)",
                  border: `1px solid ${s.color === 0 ? "rgba(255,255,255,0.14)" : s.color === 3 ? "rgba(0,184,148,0.35)" : s.color === 2 ? "rgba(225,112,85,0.3)" : "rgba(108,92,231,0.3)"}`,
                  color:
                    s.color === 0
                      ? "rgba(255,255,255,0.65)"
                      : s.color === 3
                        ? "#00cec9"
                        : s.color === 2
                          ? "#E17055"
                          : "#c4b5fd",
                }}
              >
                {s.label}
              </span>
              {i < arr.length - 1 && (
                <span
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    fontSize: 13,
                    margin: "0 2px",
                  }}
                >
                  →
                </span>
              )}
            </React.Fragment>
          ))}
        </div> */}
      </div>
    </section>
  );
}

// ─── Framework Cards ─────────────────────────────────────────────────────────
const FRAMEWORK_SECTION_CLASSES: Record<
  string,
  { card: string; text: string; stroke: string; badge: string }
> = {
  CBUAE: {
    card: "bg-[#1E6FD9]/5 border-[#1E6FD9]/20 hover:border-[#1E6FD9]/50 hover:shadow-[0_16px_48px_rgba(30,111,217,0.15)]",
    text: "text-[#1E6FD9]",
    stroke: "stroke-[#1E6FD9]",
    badge: "bg-[#1E6FD9]/15 text-[#1E6FD9] border-[#1E6FD9]/30",
  },
  RBI: {
    card: "bg-[#E85D00]/5 border-[#E85D00]/20 hover:border-[#E85D00]/50 hover:shadow-[0_16px_48px_rgba(232,93,0,0.15)]",
    text: "text-[#E85D00]",
    stroke: "stroke-[#E85D00]",
    badge: "bg-[#E85D00]/15 text-[#E85D00] border-[#E85D00]/30",
  },
  SAMA: {
    card: "bg-[#00875A]/5 border-[#00875A]/20 hover:border-[#00875A]/50 hover:shadow-[0_16px_48px_rgba(0,135,90,0.15)]",
    text: "text-[#00875A]",
    stroke: "stroke-[#00875A]",
    badge: "bg-[#00875A]/15 text-[#00875A] border-[#00875A]/30",
  },
};

function FrameworksSection() {
  const frameworks = [
    {
      id: "CBUAE",
      flag: "🇦🇪",
      fullName: "UAE Central Bank",
      useCaseCount: USE_CASES_BY_FRAMEWORK.CBUAE.length,
      features: [
        "AECB Credit Bureau Integration",
        "UAE Pass Digital Identity",
        "CBUAE Open Finance Framework",
        "AML/CFT & goAML Reporting",
        "DBR Compliance (50%/35%)",
        "LTV Caps & Affordability Rules",
      ],
    },
    {
      id: "RBI",
      flag: "🇮🇳",
      fullName: "Reserve Bank of India",
      useCaseCount: USE_CASES_BY_FRAMEWORK.RBI.length,
      features: [
        "CIBIL / Equifax Bureau Integration",
        "Aadhaar e-KYC & V-CIP",
        "NPCI UPI 2.0 & NACH",
        "Account Aggregator Framework",
        "NACH Mandate Management",
        "PSL Classification & Reporting",
      ],
    },
    {
      id: "SAMA",
      flag: "🇸🇦",
      fullName: "Saudi Central Bank",
      useCaseCount: USE_CASES_BY_FRAMEWORK.SAMA.length,
      features: [
        "Simah Credit Bureau Integration",
        "SAMA Open Banking Framework",
        "Shariah-Compliant Products",
        "ZATCA Zakat & VAT Compliance",
        "Saudi Payments / mada Pay",
        "Tadawul Investment Platform",
      ],
    },
  ];

  return (
    <section className="py-[8px]">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#F0F4FF]">
            Regulatory Frameworks
          </h2>
          <p className="mt-2 max-w-[560px] mx-auto text-[#8B9CC8] text-[15px]">
            Each framework has its own compliance rules, APIs, and thresholds —
            all pre-configured.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {frameworks.map((fw) => {
            const fwCls = FRAMEWORK_SECTION_CLASSES[fw.id];
            return (
              <div
                key={fw.id}
                className={`rounded-2xl p-8 transition-all duration-300 border hover:-translate-y-1 ${fwCls.card}`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl">{fw.flag}</span>
                  <div>
                    <div className={`text-lg font-bold ${fwCls.text}`}>
                      {fw.id}
                    </div>
                    <div className="text-xs text-[#8B9CC8]">{fw.fullName}</div>
                  </div>
                  <span
                    className={`ml-auto text-[11px] font-bold px-2.5 py-0.5 rounded-full border tracking-wider uppercase ${fwCls.badge}`}
                  >
                    {fw.useCaseCount} Use Cases
                  </span>
                </div>

                <ul className="list-none flex flex-col gap-2.5">
                  {fw.features.map((feat, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-[#8B9CC8] leading-normal"
                    >
                      <svg
                        className={`mt-0.5 shrink-0 ${fwCls.text}`}
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M20 6L9 17l-5-5"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Use Cases Grid ───────────────────────────────────────────────────────────
const FRAMEWORK_BADGE_CLASSES: Record<string, string> = {
  CBUAE: "text-[#1E6FD9] bg-[#1E6FD9]/10 border border-[#1E6FD9]/20",
  RBI: "text-[#E85D00] bg-[#E85D00]/10 border border-[#E85D00]/20",
  SAMA: "text-[#00875A] bg-[#00875A]/10 border border-[#00875A]/20",
};

const COMPLEXITY_BADGE_CLASSES: Record<string, string> = {
  LOW: "text-[#00E676] bg-[#00E676]/15 border-[#00E676]/30",
  MEDIUM: "text-[#FFB700] bg-[#FFB700]/15 border-[#FFB700]/30",
  HIGH: "text-[#FF9800] bg-[#FF9800]/15 border-[#FF9800]/30",
  VERY_HIGH: "text-[#FF1744] bg-[#FF1744]/15 border-[#FF1744]/30",
};

const COMPLEXITY_LABELS: Record<string, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  VERY_HIGH: "Very High",
};

function FrameworkBadge({ framework }: { framework: string }) {
  const badgeCls =
    FRAMEWORK_BADGE_CLASSES[framework] ??
    "bg-white/5 border border-[#00D4FF]/10 text-[#8B9CC8]";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.2 rounded-full text-[10.5px] font-semibold tracking-wider uppercase ${badgeCls}`}
    >
      {framework}
    </span>
  );
}

function ComplexityBadge({ complexity }: { complexity: string }) {
  const badgeCls =
    COMPLEXITY_BADGE_CLASSES[complexity] ??
    "bg-white/5 border border-[#00D4FF]/10 text-[#8B9CC8]";
  return (
    <span
      className={`text-[10px] font-semibold rounded px-1.5 py-0.2 uppercase border ${badgeCls}`}
    >
      {COMPLEXITY_LABELS[complexity] ?? complexity}
    </span>
  );
}

function UseCaseCard({ uc, onClick }: { uc: UseCase; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white/[0.03] border border-[#00D4FF]/10 rounded-xl p-5 cursor-pointer transition-all duration-200 flex flex-col gap-2.5 hover:border-[#00D4FF]/30 hover:bg-[#00D4FF]/4 hover:-translate-y-0.5"
    >
      {/* Header row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-mono text-[10px] text-[#00D4FF] bg-[#00D4FF]/10 border border-[#00D4FF]/20 rounded px-1.5 py-0.2 shrink-0">
          {uc.id}
        </span>
        <FrameworkBadge framework={uc.framework} />
        <ComplexityBadge complexity={uc.technicalComplexity} />
      </div>

      {/* Name */}
      <h5 className="text-[#F0F4FF] text-[15px] font-semibold leading-snug">
        {uc.name}
      </h5>

      {/* Description */}
      <p className="text-xs text-[#8B9CC8] leading-relaxed line-clamp-2">
        {uc.description}
      </p>

      {/* Category */}
      <span className="text-[10px] text-[#4A5580] uppercase tracking-widest mt-auto">
        {uc.category}
      </span>
    </div>
  );
}

function UseCasesSection() {
  const navigate = useNavigate();

  const groups = [
    {
      key: "CBUAE",
      label: "🇦🇪 CBUAE — UAE Central Bank",
      color: "#1E6FD9",
      cases: USE_CASES_BY_FRAMEWORK.CBUAE,
    },
    {
      key: "RBI",
      label: "🇮🇳 RBI — Reserve Bank of India",
      color: "#E85D00",
      cases: USE_CASES_BY_FRAMEWORK.RBI,
    },
    {
      key: "SAMA",
      label: "🇸🇦 SAMA — Saudi Central Bank",
      color: "#00875A",
      cases: USE_CASES_BY_FRAMEWORK.SAMA,
    },
  ];

  const handleUseCaseClick = (uc: UseCase) => {
    navigate("/generate", { state: { selectedUseCase: uc.id } });
  };

  return (
    <section id="use-cases" className="py-[60px]">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#F0F4FF]">
            30 Banking Use Cases
          </h2>
          <p className="mt-2 max-w-[500px] mx-auto text-[#8B9CC8] text-[15px]">
            Click any use case to start generating production-ready banking
            code.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {groups.map((group) => (
            <div key={group.key}>
              <div
                className="flex items-center gap-3 mb-5 pb-3 border-b border-[#00D4FF]/10"
                style={{ borderBottomColor: `${group.color}25` }}
              >
                <h3 className="text-base font-semibold text-[#F0F4FF]">
                  {group.label}
                </h3>
                <span
                  className="text-xs font-bold px-3 py-0.5 rounded-full border tracking-wide"
                  style={{
                    color: group.color,
                    background: `${group.color}15`,
                    borderColor: `${group.color}30`,
                  }}
                >
                  {group.cases.length} use cases
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {group.cases.map((uc) => (
                  <UseCaseCard
                    key={uc.id}
                    uc={uc}
                    onClick={() => handleUseCaseClick(uc)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works Section ─────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Stage 1 Input",
      desc: "Select use case, framework, bank details, tech stack, and AI provider.",
      icon: "📝",
    },
    {
      num: "02",
      title: "AI Analysis",
      desc: "RequirementsIntelligenceAgent determines what dynamic inputs your specific use case needs.",
      icon: "🧠",
    },
    {
      num: "03",
      title: "Stage 2 Config",
      desc: "Answer AI-generated questions specific to your use case, compliance thresholds, and bank settings.",
      icon: "⚙️",
    },
    {
      num: "04",
      title: "13 AI Agents",
      desc: "A sequenced pipeline of 13 specialized agents generates all code, schemas, tests, and prompts.",
      icon: "🤖",
    },
    {
      num: "05",
      title: "ZIP Download",
      desc: "Download complete production-ready package with backend, frontend, database scripts, and tests.",
      icon: "📦",
    },
  ];

  return (
    <section className="py-[60px] bg-[#0F1525]/50">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#F0F4FF]">How It Works</h2>
          <p className="mt-2 text-[#8B9CC8]">
            Five steps from form to production-ready banking service
          </p>
        </div>

        {/* Pipeline visualization */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-stretch gap-0">
              <div className="flex-1 text-center p-6 py-8 bg-white/[0.03] border border-[#00D4FF]/12 rounded-xl relative">
                <div className="text-3xl mb-3">{step.icon}</div>
                <div className="absolute top-2.5 left-3 font-mono text-[10px] text-[#00D4FF] opacity-60">
                  {step.num}
                </div>
                <h5 className="text-sm font-semibold text-[#F0F4FF] mb-2">
                  {step.title}
                </h5>
                <p className="text-[12px] text-[#8B9CC8] leading-relaxed">
                  {step.desc}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className="px-2 shrink-0 opacity-50">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 18l6-6-6-6"
                      stroke="#00D4FF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Output Section ────────────────────────────────────────────────────────────
function OutputSection() {
  const artifacts = [
    {
      folder: "backend/",
      files: [
        "ApplicationName.java",
        "LoanController.java",
        "LoanService.java",
        "LoanRepository.java",
        "ComplianceEngine.java",
        "AIPromptService.java",
        "...and more",
      ],
    },
    {
      folder: "frontend/",
      files: [
        "App.tsx",
        "LoanApplicationForm.tsx",
        "DecisionResultPage.tsx",
        "ComplianceDashboard.tsx",
        "apiClient.ts",
      ],
    },
    {
      folder: "database/",
      files: [
        "V1__create_schema.sql",
        "V2__seed_compliance_rules.sql",
        "LoanApplication.java (JPA)",
      ],
    },
    {
      folder: "tests/",
      files: [
        "LoanServiceTest.java",
        "ComplianceTest.java",
        "APIIntegrationTest.java",
        "E2ETest.java",
      ],
    },
    {
      folder: "config/",
      files: [
        "application.yml",
        "docker-compose.yml",
        "Dockerfile",
        ".env.example",
      ],
    },
    {
      folder: "docs/",
      files: [
        "README.md",
        "API_SPEC.yaml",
        "COMPLIANCE_GUIDE.md",
        "SETUP_GUIDE.md",
      ],
    },
  ];

  return (
    <section className="py-[60px]">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#F0F4FF]">
            What's in the ZIP Package
          </h2>
          <p className="mt-2 text-[#8B9CC8]">
            A complete, deployable banking service — not boilerplate
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {artifacts.map(({ folder, files }) => (
            <div
              key={folder}
              className="bg-white/5 border border-[#00D4FF]/10 rounded-2xl p-5 px-6 backdrop-blur-md transition-all duration-200 hover:border-[#00D4FF]/30 hover:shadow-card"
            >
              <div className="font-mono text-sm text-[#00D4FF] font-semibold mb-3 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                    stroke="#00D4FF"
                    strokeWidth="1.5"
                  />
                </svg>
                {folder}
              </div>
              <ul className="list-none flex flex-col gap-1.5">
                {files.map((f, i) => (
                  <li
                    key={i}
                    className="font-mono text-xs flex items-center gap-2"
                  >
                    <span className="text-[#00D4FF]/30 text-xs">├</span>
                    <span
                      className={
                        i === files.length - 1
                          ? "text-[#4A5580]"
                          : "text-[#8B9CC8]"
                      }
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Footer Section ────────────────────────────────────────────────────────
function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-8 border-t border-[#00D4FF]/10">
      <div className="max-w-[640px] mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold mb-3 text-[#F0F4FF]">
          Ready to generate your{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00D4FF] to-[#7B5EA7]">
            banking AI use case
          </span>
          ?
        </h2>
        <p className="text-sm text-[#4A5580] mb-8">
          Pick from 30 regulatory-compliant use cases. Generate in minutes.
        </p>

        <button
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-sans text-sm font-semibold cursor-pointer border-none transition-all duration-200 whitespace-nowrap bg-gradient-to-r from-[#00D4FF] to-[#0099BB] text-black shadow-[0_4px_16px_rgba(0,212,255,0.3)] hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(0,212,255,0.5)] active:translate-y-0 mx-auto"
          onClick={() => navigate("/generate")}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          Start Generation
        </button>

        <div className="mt-8 flex gap-x-6 gap-y-2 justify-center flex-wrap">
          {[
            "13 specialized AI agents",
            "Regulatory compliance built-in",
            "Download complete ZIP package",
          ].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 text-xs text-[#4A5580]"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00D4FF"
                strokeWidth="3"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="animate-fade-in flex-1">
      <HeroSection />
      <FrameworksSection />
      <UseCasesSection />
      <HowItWorksSection />
      <OutputSection />
      <CTASection />

      {/* Footer */}
      <footer className="p-6 text-center border-t border-[#00D4FF]/8 text-[#4A5580] text-[13px]">
        OXY BFSAI Engine v3.0 · {USE_CASE_REGISTRY.length} Use Cases · CBUAE ·
        RBI · SAMA
      </footer>
    </div>
  );
}
