import React from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  FolderOpen,
  Mail,
  Lock,
  Sparkles,
  ShieldCheck,
  Clock,
  Search,
  RefreshCw,
  ExternalLink,
  Inbox,
  FileText,
  CheckCircle,
} from "lucide-react";

const SERVICES = [
  {
    title: "Gmail Inbox",
    subtitle: "CEO emails, important conversations, and smart summaries.",
    icon: Mail,
  },
  {
    title: "Google Calendar",
    subtitle: "Meetings, schedules, reminders, and daily agenda view.",
    icon: CalendarDays,
  },
  {
    title: "Google Drive",
    subtitle: "Files, documents, decks, reports, and quick access links.",
    icon: FolderOpen,
  },
];

const DISABLED_ACTIONS = [
  { label: "Connect Google", icon: Lock },
  { label: "Load Gmail", icon: Mail },
  { label: "Load Calendar", icon: CalendarDays },
  { label: "Load Drive", icon: FolderOpen },
  { label: "Refresh All", icon: RefreshCw },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
};

export default function MyGooglePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070A16] px-3 py-3 text-white sm:px-5 lg:px-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(251,146,60,0.15),transparent_30%),radial-gradient(circle_at_86%_18%,rgba(94,221,242,0.10),transparent_32%),radial-gradient(circle_at_50%_92%,rgba(167,139,250,0.13),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#FB923C_1px,transparent_1px),linear-gradient(to_bottom,#FB923C_1px,transparent_1px)] bg-[size:38px_38px]" />

      <motion.main
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.45 }}
        className="relative z-10 mx-auto w-full max-w-[1450px]"
      >
        <section className="mb-4 overflow-hidden rounded-[28px] border border-white/10 bg-[#101827]/90 shadow-xl backdrop-blur-xl">
          <div className="grid gap-0 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-300/20 bg-orange-300/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-orange-200">
                <ShieldCheck size={13} /> Google Workspace Module
              </div>

              <h1 className="max-w-3xl text-2xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Google Workspace
                <span className="block bg-gradient-to-r from-[#FB923C] via-[#FDE68A] to-[#5EDDF2] bg-clip-text text-transparent">
                  Coming Soon
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Gmail, Calendar, and Drive integrations are planned for the radhAI admin dashboard.
                As of now, this page is intentionally kept in disabled mode until final Google API approval and production configuration are completed.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {DISABLED_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      type="button"
                      disabled
                      className="inline-flex cursor-not-allowed items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-bold text-slate-500 opacity-70"
                    >
                      <Icon size={15} /> {action.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative border-t border-white/10 bg-white/[0.025] p-4 sm:p-6 xl:border-l xl:border-t-0">
              <div className="rounded-[24px] border border-orange-300/15 bg-orange-300/[0.06] p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-300/15 text-orange-200">
                  <Clock size={24} />
                </div>
                <h2 className="text-lg font-black text-white">Feature locked for now</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  All buttons, search, account connection, and data loading actions are disabled to avoid accidental API calls before launch.
                </p>
                <div className="mt-5 grid gap-2 text-xs text-slate-300">
                  <StatusLine text="Google login disabled" />
                  <StatusLine text="Gmail API disabled" />
                  <StatusLine text="Calendar API disabled" />
                  <StatusLine text="Drive API disabled" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="rounded-[26px] border border-white/10 bg-[#101827]/85 p-5 shadow-lg backdrop-blur-xl"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] text-orange-200">
                    <Icon size={23} />
                  </div>
                  <span className="rounded-full border border-yellow-300/20 bg-yellow-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-yellow-200">
                    Coming Soon
                  </span>
                </div>
                <h3 className="text-base font-black text-white">{service.title}</h3>
                <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-400">{service.subtitle}</p>

                <div className="mt-5 rounded-2xl border border-white/8 bg-black/20 p-3">
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Search size={14} /> Preview Controls
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <DisabledChip icon={Inbox} label="Inbox" />
                    <DisabledChip icon={FileText} label="Files" />
                    <DisabledChip icon={ExternalLink} label="Open" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </section>

        <section className="mt-4 rounded-[26px] border border-white/10 bg-[#101827]/80 p-5 backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-base font-black text-white">
                <Sparkles size={18} className="text-orange-200" /> Planned Workflow
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Once enabled, this module can show CEO emails, calendar meetings, and Drive documents inside one admin screen.
              </p>
            </div>
            <span className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-bold text-slate-400">
              Disabled Build
            </span>
          </div>
        </section>
      </motion.main>
    </div>
  );
}

function StatusLine({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-black/15 px-3 py-2">
      <Lock size={13} className="text-orange-200" />
      <span>{text}</span>
    </div>
  );
}

function DisabledChip({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <button
      type="button"
      disabled
      className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-bold text-slate-500 opacity-70"
    >
      <Icon size={13} /> {label}
    </button>
  );
}
