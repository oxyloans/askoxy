import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import signinImg from "../assets/img/Freelancer.png";
import logo from "../assets/img/askoxylogonew.png";

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  welcomeTitle?: string;
  welcomeSubtitle?: React.ReactNode;
  formHeading: string;
  backLink?: { to: string; label: string };
  compact?: boolean;
}

const AuthSplitLayout: React.FC<AuthSplitLayoutProps> = ({
  children,
  welcomeTitle = "Welcome to AskOxy",
  welcomeSubtitle,
  formHeading,
  backLink,
  compact = false,
}) => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100 px-3 py-5 sm:px-5 sm:py-7">
      <div className="w-full max-w-[400px] overflow-hidden rounded-xl bg-white shadow-xl shadow-slate-900/10 ring-1 ring-slate-200/80 sm:max-w-[430px] md:h-[520px] md:max-w-[780px]">
        <div className="flex min-h-[inherit] flex-col md:h-full md:min-h-0 md:flex-row">
          {/* Left — 50% marketing panel */}
          <div className="relative hidden w-full overflow-hidden md:flex md:h-full md:w-1/2 md:min-w-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-indigo-900 to-blue-900" />
            <img
              src={signinImg}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover object-center opacity-70"
            />
            <div className="relative z-10 flex h-full w-full flex-col justify-between bg-gradient-to-b from-slate-950/45 via-indigo-950/20 to-slate-950/70 p-5 lg:p-6">
              <div>
                {/* Logo on dark bg — white filter ensures visibility */}
                <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-white/10 px-2.5 py-1.5 backdrop-blur-sm ring-1 ring-white/20">
                  <img
                    src={logo}
                    alt="AskOxy"
                    className="h-7 object-contain brightness-0 invert"
                  />
                </div>

                <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-300">
                  Employer Portal
                </p>
                <h2 className="mt-1.5 text-lg font-bold leading-snug text-white">
                  Hire skilled freelancers
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                  Post requirements, manage projects, and build your dream team — all on AskOxy.
                </p>

                <ul className="mt-3 space-y-1.5">
                  {[
                    "Post job requirements in minutes",
                    "Browse verified freelance talent",
                    "Assign & manage your team easily",
                    "Secure & professional platform",
                  ].map((point) => (
                    <li key={point} className="flex items-center gap-2.5 text-xs text-slate-200">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-[9px] text-white shadow-sm">
                        ✓
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-1.5">
                {["Trusted", "Secure", "Professional"].map((tag, i) => (
                  <React.Fragment key={tag}>
                    <span className="text-[10px] font-medium text-slate-400">{tag}</span>
                    {i < 2 && <span className="text-slate-600">·</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Right — 50% form panel */}
          <div className="flex w-full flex-col justify-center md:h-full md:w-1/2 md:min-w-0 md:overflow-y-auto md:border-l md:border-slate-100">
            <div
              className={`px-4 sm:px-6 ${
                compact ? "py-4 sm:py-5 md:px-6" : "py-5 sm:py-6 md:px-6 lg:px-7"
              }`}
            >
              <div className="mb-4 flex items-center gap-2 md:hidden">
                <img src={logo} alt="AskOxy" className="h-7 object-contain" />
                <span className="text-xs font-medium text-slate-500">
                  Employer Portal
                </span>
              </div>

              <div className={compact ? "mb-2" : "mb-3"}>
                <h1 className="text-base font-bold text-slate-900 sm:text-lg">
                  {welcomeTitle}
                </h1>
                {welcomeSubtitle && (
                  <div className="mt-1 text-xs text-slate-500 sm:text-sm">
                    {welcomeSubtitle}
                  </div>
                )}
              </div>

              <h2
                className={`font-semibold text-slate-800 ${
                  compact ? "mb-2 text-sm" : "mb-3 text-sm"
                }`}
              >
                {formHeading}
              </h2>

              <div
                className={`
                  [&_.ant-form-item-label>label]:h-auto
                  [&_.ant-form-item-label>label]:font-medium
                  [&_.ant-form-item-label>label]:text-slate-700
                  [&_.ant-form-item-explain-error]:text-[11px]
                  [&_.ant-form-item-explain-error]:mt-0.5
                  [&_.ant-input]:rounded-lg
                  [&_.ant-input]:border-slate-300
                  [&_.ant-input-affix-wrapper]:rounded-lg
                  [&_.ant-input-affix-wrapper]:border-slate-300
                  [&_.ant-input-affix-wrapper-focused]:border-indigo-500
                  [&_.ant-input-affix-wrapper-focused]:shadow-[0_0_0_2px_rgba(99,102,241,0.15)]
                  [&_.ant-input:focus]:border-indigo-500
                  [&_.ant-input:focus]:shadow-[0_0_0_2px_rgba(99,102,241,0.15)]
                  ${
                    compact
                      ? "[&_.ant-form-item]:mb-1.5 [&_.ant-form-item-label>label]:text-xs"
                      : "[&_.ant-form-item]:mb-3 [&_.ant-form-item-label>label]:text-sm"
                  }
                `}
              >
                {children}
              </div>

              {backLink && (
                <div className="mt-3 text-center sm:mt-4">
                  <Link
                    to={backLink.to}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-indigo-600"
                  >
                    <ArrowLeftOutlined className="text-[10px]" />
                    {backLink.label}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSplitLayout;
