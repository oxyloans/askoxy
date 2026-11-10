import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { stopTokenRefresh } from "../utils/tokenRefresh";

const NINE_DAYS_LOGO = "https://i.ibb.co/39rQT8TW/9-Days-Job-Program-Logo-1.png";
const STORAGE_MOBILE_ROUTE = "nine_days_prereq_mobile_route";
const STORAGE_MASTER_VERIFIED = "nine_days_master_prereq_verified";

// Official Google Drive Setup Guides provided in exact order
export interface SetupGuide {
  id: number;
  title: string;
  url: string;
  category: string;
  description: string;
  iconBg: string;
  badgeColor: string;
}

export const SETUP_GUIDES: SetupGuide[] = [
  {
    id: 1,
    title: "APP ENVIRONMENT SET",
    url: "https://drive.google.com/file/d/1zZ0gUpQdbyo1oTs3mYf9Mh3zHUjAgJbA/view",
    category: "Mobile & App Setup",
    description:
      "Step-by-step instructions to configure mobile development environments, emulator setups, and runtime tools.",
    iconBg: "bg-blue-50 border-blue-200 text-blue-600",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    id: 2,
    title: "WEB UI ENVIRONMENT SETUP",
    url: "https://drive.google.com/file/d/1ZMGEFh1TCfQ0L2Hs8hNbCq9jwq8b_XHU/view",
    category: "Frontend Setup",
    description:
      "Configure Node.js, npm, VS Code extensions, React dependencies, Tailwind CSS, and frontend development servers.",
    iconBg: "bg-emerald-50 border-emerald-200 text-emerald-600",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    id: 3,
    title: "DATA BASE ENVIRONMENT SETUP",
    url: "https://drive.google.com/file/d/1eYAkgOn1AzcZy8c_1tyaEy_4Wt38tJtY/view",
    category: "Database Setup",
    description:
      "Install PostgreSQL, set up pgAdmin, create the BFSI database schema, users, credentials, and connection pools.",
    iconBg: "bg-amber-50 border-amber-200 text-amber-600",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    id: 4,
    title: "API ENVIRONMENT SETUP",
    url: "https://drive.google.com/file/d/1x8UYossgacXWn7gDvGknPlox-C6ccGk9/view",
    category: "Backend Setup",
    description:
      "Install Java JDK, Spring Boot, Maven, configure REST API endpoints, and test requests using Postman collections.",
    iconBg: "bg-purple-50 border-purple-200 text-purple-600",
    badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    id: 5,
    title: "React Project Setup & How to build the project",
    url: "https://drive.google.com/file/d/1Fc3u4K63ag_j8Z9Y3htDRLrlIrtHx1TO/view",
    category: "Full Stack Build",
    description:
      "Folder architecture, linking React components with Spring Boot APIs, PostgreSQL entities, and full project build.",
    iconBg: "bg-indigo-50 border-indigo-200 text-indigo-600",
    badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  {
    id: 6,
    title: "Step-by-Step Guide: Pushing App to Android and iOS using Expo",
    url: "https://drive.google.com/file/d/14181E8p4AelCZuG-CRbB3143fjBNlCZi/view",
    category: "Deployment",
    description:
      "Detailed guide to package, build Android APK and iOS binaries using Expo/EAS and test full-stack live connectivity.",
    iconBg: "bg-rose-50 border-rose-200 text-rose-600",
    badgeColor: "bg-rose-100 text-rose-700 border-rose-200",
  },
];

export default function NineDaysPrerequisites() {
  const navigate = useNavigate();

  // Mobile Route Selection
  const [mobileRoute, setMobileRoute] = useState<"react_native" | "capacitor">(() => {
    return (
      (localStorage.getItem(STORAGE_MOBILE_ROUTE) as "react_native" | "capacitor") ||
      "react_native"
    );
  });

  // Single Master Checkbox for All Environment Setups
  const [isEnvironmentVerified, setIsEnvironmentVerified] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_MASTER_VERIFIED) === "true";
  });

  const handleToggleVerification = (checked: boolean) => {
    setIsEnvironmentVerified(checked);
    localStorage.setItem(STORAGE_MASTER_VERIFIED, checked ? "true" : "false");
  };

  const handleSelectMobileRoute = (route: "react_native" | "capacitor") => {
    setMobileRoute(route);
    localStorage.setItem(STORAGE_MOBILE_ROUTE, route);
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

  const handleStartDay1 = () => {
    if (!isEnvironmentVerified) return;
    navigate("/ninedaysdayworkflow?day=1");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & BRANDING                                                 */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-xs backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/ninedaysjobprogramplan")}
              className="flex items-center gap-2 focus:outline-none transition opacity-95 hover:opacity-100"
              title="Return to 9-Days Job Program overview"
            >
              <img
                src={NINE_DAYS_LOGO}
                alt="9-Days Job Program Logo"
                className="h-9 w-auto max-w-[160px] object-contain sm:h-10"
              />
            </button>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-[#068855]">
              Before Day 1: Prerequisites
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-600 sm:text-xs">
              Phase: <strong className="text-emerald-700 font-extrabold">Day 0 Setup</strong>
            </span>
            <button
              type="button"
              onClick={() => navigate("/ninedaysjobprogramplan")}
              className="hidden md:inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-xs hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 transition"
            >
              Program Overview
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-600 shadow-xs transition hover:border-red-300 hover:bg-red-100 hover:text-red-700"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO: PREREQUISITES OBJECTIVE & LOCK DIRECTIVE                         */}
      {/* ========================================================================= */}
      <section className="border-b border-emerald-100/80 bg-gradient-to-b from-[#eaf6ef] via-[#f7fbf8] to-[#f8fafc] py-7 sm:py-9">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-700 px-3 py-0.5 text-[11px] font-black uppercase tracking-wider text-white shadow-xs">
                  #83GLAI Program Setup
                </span>
                <span className="rounded-full border border-emerald-300 bg-white px-2.5 py-0.5 text-[11px] font-bold text-[#068855]">
                  Mandatory Verification Stage
                </span>
              </div>

              <h1 className="mt-2 text-2xl font-black tracking-tight text-[#143d2c] sm:text-3xl md:text-4xl leading-tight">
                Before Day 1: Prerequisites
              </h1>

              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Welcome to the 9-Days Job Program. To ensure zero setup friction on Day 1, configure your development environment using the 6 guides below, select your mobile route, and confirm verification with the master checkbox below to enable Day 1.
              </p>

              <div className="mt-4 rounded-2xl border-2 border-amber-300 bg-amber-50/95 p-3.5 sm:p-4 shadow-xs">
                <div className="flex items-start gap-3">
                  <span className="text-xl select-none leading-none mt-0.5" aria-hidden="true">
                    ⚠️
                  </span>
                  <div>
                    <h2 className="text-sm font-extrabold text-amber-950 sm:text-base leading-snug">
                      Day 1 stays locked until environment setup is verified.
                    </h2>
                    <p className="mt-0.5 text-xs font-semibold text-amber-900/90 sm:text-sm">
                      Check the verification box at the bottom of this page to enable the &quot;Start Day 1&quot; button.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Start Card */}
            <div className="w-full rounded-2xl border border-emerald-200 bg-white p-5 shadow-xs md:w-[320px] shrink-0">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                Day 1 Unlock Status
              </span>

              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${
                    isEnvironmentVerified
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}
                >
                  {isEnvironmentVerified ? "🔓 Day 1 Unlocked" : "🔒 Day 1 Locked"}
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-500 font-medium leading-relaxed">
                {isEnvironmentVerified
                  ? "All setups confirmed. Click Start Day 1 to open your banking workflows."
                  : "Tick the checkbox below to enable Start Day 1."}
              </p>

              <button
                type="button"
                disabled={!isEnvironmentVerified}
                onClick={handleStartDay1}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-[#00a65d] px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:from-emerald-700 hover:to-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Start Day 1 →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MAIN WORKSPACE                                                        */}
      {/* ========================================================================= */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* ========================================================================= */}
        {/* STEP 1: MOBILE ARCHITECTURE DECISION                                     */}
        {/* ========================================================================= */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-base">
              📱
            </span>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
                Decision 01
              </span>
              <h2 className="text-lg font-black text-[#143d2c] sm:text-xl">
                Choose your mobile route now
              </h2>
            </div>
          </div>

          <p className="mt-2 text-xs font-medium text-slate-600 sm:text-sm leading-relaxed">
            A React web app alone is not an Android or iOS application. Pick React Native or Capacitor before the program starts.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {/* React Native Card */}
            <div
              onClick={() => handleSelectMobileRoute("react_native")}
              className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${
                mobileRoute === "react_native"
                  ? "border-[#00b96e] bg-[#f0fbf5] shadow-xs ring-2 ring-emerald-500/20"
                  : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50/60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-bold text-blue-800">
                    Industry Standard (Recommended)
                  </span>
                  <h3 className="mt-2 text-base font-black text-slate-900 sm:text-lg">
                    React Native (Expo)
                  </h3>
                </div>
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${
                    mobileRoute === "react_native"
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-300"
                  }`}
                >
                  {mobileRoute === "react_native" && <span className="text-xs font-bold">✓</span>}
                </div>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-600 sm:text-sm">
                Native UI components compiled directly to Android (Kotlin) and iOS (Swift) using Expo Application Services (EAS).
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-bold text-slate-500">
                <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5">Native Performance</span>
                <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5">Expo EAS Build</span>
                <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5">Android APK &amp; iOS</span>
              </div>
            </div>

            {/* Capacitor Card */}
            <div
              onClick={() => handleSelectMobileRoute("capacitor")}
              className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${
                mobileRoute === "capacitor"
                  ? "border-[#00b96e] bg-[#f0fbf5] shadow-xs ring-2 ring-emerald-500/20"
                  : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50/60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                    Hybrid Web Wrapper
                  </span>
                  <h3 className="mt-2 text-base font-black text-slate-900 sm:text-lg">
                    Capacitor
                  </h3>
                </div>
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${
                    mobileRoute === "capacitor"
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-300"
                  }`}
                >
                  {mobileRoute === "capacitor" && <span className="text-xs font-bold">✓</span>}
                </div>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-600 sm:text-sm">
                Wraps your existing React web application inside a native WebView container for Android and iOS app stores.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-bold text-slate-500">
                <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5">Shared Web Code</span>
                <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5">Capacitor CLI</span>
                <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5">Fast Setup</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STEP 2: OFFICIAL SETUP GUIDES (6 GOOGLE DRIVE DOCS)                      */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#068855]">
                Official Manuals
              </span>
              <h2 className="text-xl font-black text-[#143d2c] sm:text-2xl">
                Follow the 6 Environment Setup Guides
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500">
              6 Google Drive Manuals
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SETUP_GUIDES.map((guide) => (
              <div
                key={guide.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-emerald-300 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-[11px] font-extrabold border ${guide.badgeColor}`}
                    >
                      Guide 0{guide.id}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      Google Drive PDF
                    </span>
                  </div>

                  <h3 className="mt-3 text-sm font-extrabold leading-snug text-slate-900 sm:text-base">
                    {guide.title}
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-slate-600 font-medium">
                    {guide.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <a
                    href={guide.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700"
                  >
                    <span>Open in Google Drive ↗</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STEP 3: SINGLE MASTER VERIFICATION CHECKBOX & START DAY 1 BUTTON         */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#068855]">
            Final Verification Step
          </span>
          <h2 className="text-xl font-black text-[#143d2c] sm:text-2xl">
            Confirm Environment Verification to Unlock Day 1
          </h2>

          {/* Master Checkbox Card */}
          <div
            onClick={() => handleToggleVerification(!isEnvironmentVerified)}
            className={`cursor-pointer rounded-3xl border-2 p-5 sm:p-6 transition-all ${
              isEnvironmentVerified
                ? "border-emerald-400 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20"
                : "border-slate-300 bg-white hover:border-emerald-300 hover:bg-slate-50/50"
            }`}
          >
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={isEnvironmentVerified}
                onChange={() => {}}
                className="mt-1 h-6 w-6 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    I have completed and verified all environment setups
                  </h3>
                  {isEnvironmentVerified && (
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-black text-emerald-800 border border-emerald-200">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  I confirm that Java JDK (17/21), Node.js &amp; npm, React environment, Spring Boot, PostgreSQL, Git/GitHub, IDE, Postman, Cloud hosting accounts (Vercel, DB, Backend), and my selected mobile route ({mobileRoute === "react_native" ? "React Native Expo" : "Capacitor"}) are installed, verified, and running on my development system.
                </p>
              </div>
            </div>
          </div>

          {/* Start Day 1 Action Card */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#143d2c]">
                {isEnvironmentVerified
                  ? "🎉 Environment Verified & Unlocked!"
                  : "Day 1 is currently locked"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                {isEnvironmentVerified
                  ? "Click the button to open Day 1 banking use cases and start the workflow."
                  : "Tick the checkbox above to enable the Start Day 1 button."}
              </p>
            </div>

            <button
              type="button"
              disabled={!isEnvironmentVerified}
              onClick={handleStartDay1}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-[#00a65d] px-7 py-3.5 text-sm font-black text-white shadow-md transition hover:from-emerald-700 hover:to-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Start Day 1 →</span>
            </button>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* FOOTER                                                                    */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-center sm:flex-row sm:text-left sm:px-6 lg:px-8">
          <p className="text-xs text-slate-500 font-medium">
            © 2026 ASKOXY.AI · #83GLAI 9-Days Job Program. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs font-bold text-[#068855]">
            <button
              onClick={() => navigate("/ninedaysjobprogramplan")}
              className="hover:underline"
            >
              Curriculum Overview
            </button>
            <a
              href="https://www.askoxy.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              ASKOXY.AI
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
