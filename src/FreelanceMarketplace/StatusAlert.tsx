import React from "react";

type AlertVariant = "success" | "error" | "info";

interface StatusAlertProps {
  message: string;
  variant?: AlertVariant;
  onDismiss?: () => void;
  className?: string;
}

const variantStyles: Record<AlertVariant, { container: string; iconColor: string }> = {
  success: { container: "bg-emerald-50 border-emerald-200 text-emerald-800", iconColor: "text-emerald-500" },
  error:   { container: "bg-red-50 border-red-200 text-red-800",             iconColor: "text-red-500"     },
  info:    { container: "bg-blue-50 border-blue-200 text-blue-800",           iconColor: "text-blue-500"    },
};

const icons: Record<AlertVariant, React.ReactNode> = {
  success: (
    <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  info: (
    <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const StatusAlert: React.FC<StatusAlertProps> = ({
  message,
  variant = "error",
  onDismiss,
  className = "",
}) => {
  const styles = variantStyles[variant];
  return (
    <div
      role="alert"
      className={`mb-4 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${styles.container} ${className}`}
    >
      <span className={`mt-0.5 ${styles.iconColor}`}>{icons[variant]}</span>
      <p className="flex-1 font-medium leading-relaxed">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-md px-1 text-current opacity-60 transition-opacity hover:opacity-100"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default StatusAlert;
