import React from "react";

export const pageContainerClass = "mx-auto w-full max-w-7xl";
export const formLabelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-400";

/* ── Loading spinner ── */
export const LoadingCenter: React.FC<{ tip?: string }> = ({ tip = "Loading…" }) => (
  <div className="flex min-h-[40vh] items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-600 border-t-transparent" />
      <p className="text-sm text-gray-400">{tip}</p>
    </div>
  </div>
);

/* ── Status badge ── */
type BadgeVariant = "approved" | "open" | "pending" | "rejected" | "closed" | "hold" | "default";

const badgeMap: Record<BadgeVariant, string> = {
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  open:     "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending:  "bg-amber-50   text-amber-700   border-amber-200",
  rejected: "bg-red-50     text-red-700     border-red-200",
  closed:   "bg-red-50     text-red-700     border-red-200",
  hold:     "bg-amber-50   text-amber-700   border-amber-200",
  default:  "bg-gray-50    text-gray-600    border-gray-200",
};

const getVariant = (status?: string): BadgeVariant => {
  const s = (status || "").toUpperCase();
  if (s === "APPROVED") return "approved";
  if (s === "OPEN")     return "open";
  if (s === "PENDING")  return "pending";
  if (s === "REJECTED") return "rejected";
  if (s === "CLOSED")   return "closed";
  if (s === "ON_HOLD")  return "hold";
  return "default";
};

export const StatusBadge: React.FC<{ status: string; icon?: React.ReactNode }> = ({ status, icon }) => (
  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide sm:text-xs ${badgeMap[getVariant(status)]}`}>
    {icon}{status || "PENDING"}
  </span>
);

/* ── Page header ── */
export const PageHeader: React.FC<{ title: string; subtitle?: string; actions?: React.ReactNode }> = ({ title, subtitle, actions }) => (
  <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
    <div>
      <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h1>
      {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
    </div>
    {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
  </div>
);
