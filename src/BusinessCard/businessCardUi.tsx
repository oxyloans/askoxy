import React, { ReactNode } from "react";
import { Alert, Button, Descriptions, Empty, Form, Grid, Spin, Tag, Upload } from "antd";
import type { ButtonProps, UploadProps } from "antd";
import { LoadingOutlined, InboxOutlined, CheckCircleOutlined } from "@ant-design/icons";
import askOxyLogo from "../assets/img/askoxylogonew.png";
import BusinessCardThemeProvider from "./BusinessCardThemeProvider";
import { COLOR_PRIMARY, outlineSuccessButtonStyle, successButtonStyle } from "./businessCardTheme";
import "./businessCardAuth.css";

const { useBreakpoint } = Grid;
const { Dragger } = Upload;

export const PAGE_BOTTOM_PADDING = { paddingBottom: 88 };

/** Shared Tailwind classes for Business Card portal */
export const BC_PAGE = "mx-auto w-full max-w-6xl";
export const BC_FORM =
  "[&_.ant-form-item]:!mb-3 [&_.ant-form-item-label>label]:!h-auto [&_.ant-form-item-label>label]:!text-xs [&_.ant-form-item-label>label]:!font-medium [&_.ant-form-item-label>label]:!text-slate-600 sm:[&_.ant-form-item-label>label]:!text-[13px]";
export const BC_INPUT = "!h-9 !rounded-md !text-[13px] !text-slate-800";
export const BC_SELECT =
  "!w-full [&_.ant-select-selector]:!h-9 [&_.ant-select-selector]:!items-center [&_.ant-select-selector]:!rounded-md [&_.ant-select-selector]:!text-[13px]";
export const BC_BTN =
  "!inline-flex !h-9 !items-center !rounded-md !px-3.5 !text-[13px] !font-medium";
export const BC_BTN_PRIMARY = `${BC_BTN} !border-cyan-600 !bg-cyan-600 !text-white hover:!border-cyan-700 hover:!bg-cyan-700`;
export const BC_BTN_OUTLINE = `${BC_BTN} !border-emerald-500 !text-emerald-600 hover:!bg-emerald-50`;
export const BC_BTN_GHOST = `${BC_BTN} !border-slate-200 !text-slate-600 hover:!border-slate-300 hover:!bg-slate-50`;
export const BC_TABLE =
  "[&_.ant-table]:!text-xs [&_.ant-table-thead>tr>th]:!bg-slate-50 [&_.ant-table-thead>tr>th]:!py-2 [&_.ant-table-thead>tr>th]:!text-[11px] [&_.ant-table-thead>tr>th]:!font-semibold [&_.ant-table-thead>tr>th]:!uppercase [&_.ant-table-thead>tr>th]:!tracking-wide [&_.ant-table-thead>tr>th]:!text-slate-500 [&_.ant-table-tbody>tr>td]:!py-2.5 sm:[&_.ant-table]:!text-[13px] sm:[&_.ant-table-thead>tr>th]:!text-xs";

export const PrimaryButton: React.FC<ButtonProps> = ({
  style,
  block,
  className,
  size = "middle",
  ...props
}) => (
  <Button
    type="primary"
    size={size}
    block={block}
    className={[BC_BTN_PRIMARY, block ? "!w-full" : "", className].filter(Boolean).join(" ")}
    style={style}
    {...props}
  />
);

export const SuccessButton: React.FC<ButtonProps> = ({
  style,
  block,
  className,
  size = "middle",
  ...props
}) => (
  <Button
    size={size}
    block={block}
    className={[BC_BTN, block ? "!w-full" : "", className].filter(Boolean).join(" ")}
    style={{ ...successButtonStyle, ...style }}
    {...props}
  />
);

export const OutlineSuccessButton: React.FC<ButtonProps> = ({
  style,
  block,
  className,
  size = "middle",
  ...props
}) => (
  <Button
    size={size}
    block={block}
    className={[BC_BTN_OUTLINE, block ? "!w-full" : "", className].filter(Boolean).join(" ")}
    style={{ ...outlineSuccessButtonStyle, ...style }}
    {...props}
  />
);

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => (
  <header className="mb-4 border-b border-slate-200 pb-4 sm:mb-5">
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-600">
          Business Card
        </p>
        <h1 className="text-base font-semibold leading-snug text-slate-900 sm:text-lg">{title}</h1>
        {subtitle && (
          <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-slate-500 sm:text-[13px]">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex w-full flex-wrap gap-2 lg:w-auto lg:justify-end">{actions}</div>}
    </div>
  </header>
);

interface PageCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerActions?: ReactNode;
  style?: React.CSSProperties;
  noPadding?: boolean;
}

export const PageCard: React.FC<PageCardProps> = ({
  title,
  description,
  children,
  className,
  headerActions,
  style,
  noPadding,
}) => (
  <section
    className={["mb-3 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm sm:mb-4", className]
      .filter(Boolean)
      .join(" ")}
    style={style}
  >
    {(title || headerActions) && (
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/50 px-3 py-2.5 sm:px-4">
        {title && (
          <h2 className="text-[13px] font-semibold text-slate-800 sm:text-sm">{title}</h2>
        )}
        {headerActions && <div className="flex flex-wrap gap-2">{headerActions}</div>}
      </div>
    )}
    <div className={noPadding ? "" : "px-3 py-3 sm:px-4 sm:py-4"}>
      {description && (
        <p className="mb-3 text-xs leading-relaxed text-slate-500 sm:text-[13px]">{description}</p>
      )}
      {children}
    </div>
  </section>
);

interface FieldWrapProps {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export const FieldWrap: React.FC<FieldWrapProps> = ({
  label,
  hint,
  required,
  children,
  className,
}) => (
  <Form.Item
    className={[BC_FORM, className].filter(Boolean).join(" ")}
    label={label}
    required={required}
    tooltip={hint}
  >
    {children}
  </Form.Item>
);

export const Toolbar: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="flex flex-wrap gap-2">{children}</div>
);

export const StatRow: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="mb-3 grid grid-cols-2 gap-2 sm:mb-4 sm:grid-cols-3 sm:gap-3">{children}</div>
);

interface InfoBannerProps {
  variant?: "info" | "success" | "warning";
  children: ReactNode;
  className?: string;
}

export const InfoBanner: React.FC<InfoBannerProps> = ({
  variant = "info",
  children,
  className,
}) => {
  const styles = {
    info: "border-sky-200 bg-sky-50 text-sky-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
  };
  return (
    <div
      className={[
        "flex gap-2 rounded-md border px-3 py-2 text-xs leading-relaxed sm:text-[13px]",
        styles[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
    >
      {children}
    </div>
  );
};

export const LoadingState: React.FC<{ message?: string }> = ({
  message = "Loading...",
}) => (
  <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
    <Spin indicator={<LoadingOutlined spin />} size="default" />
    <p className="mt-3 text-xs text-slate-500 sm:text-[13px]">{message}</p>
  </div>
);

export const StatChip: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div className="h-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 sm:text-[11px]">
      {label}
    </p>
    <p className="mt-0.5 truncate text-sm font-semibold text-slate-800 sm:text-[15px]">{value}</p>
  </div>
);

export const EmptyState: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <div className="flex flex-col items-center py-8 text-center">
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={null} />
    <p className="mt-2 text-[13px] font-medium text-slate-700">{title}</p>
    <p className="mt-1 max-w-xs text-xs text-slate-500">{description}</p>
  </div>
);

interface DetailGridProps {
  items: { label: string; value: ReactNode; fullWidth?: boolean }[];
}

export const DetailGrid: React.FC<DetailGridProps> = ({ items }) => (
  <Descriptions
    column={{ xs: 1, sm: 2 }}
    size="small"
    bordered
    className="!rounded-md [&_.ant-descriptions-item-label]:!w-[38%] [&_.ant-descriptions-item-label]:!bg-slate-50 [&_.ant-descriptions-item-label]:!px-3 [&_.ant-descriptions-item-label]:!py-2 [&_.ant-descriptions-item-label]:!text-[11px] [&_.ant-descriptions-item-label]:!font-medium [&_.ant-descriptions-item-label]:!text-slate-500 sm:[&_.ant-descriptions-item-label]:!text-xs [&_.ant-descriptions-item-content]:!px-3 [&_.ant-descriptions-item-content]:!py-2 [&_.ant-descriptions-item-content]:!text-xs [&_.ant-descriptions-item-content]:!text-slate-800 sm:[&_.ant-descriptions-item-content]:!text-[13px]"
  >
    {items.map((item) => (
      <Descriptions.Item key={item.label} label={item.label} span={item.fullWidth ? 2 : 1}>
        {item.value}
      </Descriptions.Item>
    ))}
  </Descriptions>
);

interface UploadZoneProps {
  label: string;
  hint?: string;
  required?: boolean;
  fileName?: string | null;
  placeholder: string;
  subtext?: string;
  accept: string;
  onChange: (file: File | null) => void;
  icon?: ReactNode;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  label,
  hint,
  required,
  fileName,
  placeholder,
  subtext,
  accept,
  onChange,
  icon,
}) => {
  const uploadProps: UploadProps = {
    accept,
    maxCount: 1,
    showUploadList: false,
    beforeUpload: (file) => {
      onChange(file);
      return false;
    },
    onRemove: () => onChange(null),
  };

  return (
    <FieldWrap label={label} hint={hint} required={required}>
      <Dragger
        {...uploadProps}
        className="!rounded-lg !border-dashed !border-slate-300 !bg-slate-50/60 !px-3 !py-4 hover:!border-cyan-500 hover:!bg-cyan-50/30 [&_.ant-upload-drag-icon]:!mb-1 [&_.ant-upload-hint]:!text-[11px] [&_.ant-upload-hint]:!text-slate-400 [&_.ant-upload-text]:!text-xs [&_.ant-upload-text]:!font-medium [&_.ant-upload-text]:!text-slate-600 sm:[&_.ant-upload-text]:!text-[13px]"
      >
        <p className="ant-upload-drag-icon">
          {icon || <InboxOutlined style={{ color: COLOR_PRIMARY, fontSize: 28 }} />}
        </p>
        <p className="ant-upload-text">{fileName || placeholder}</p>
        {subtext && <p className="ant-upload-hint">{subtext}</p>}
      </Dragger>
    </FieldWrap>
  );
};

export const StickyActions: React.FC<{ children: ReactNode }> = ({ children }) => {
  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  if (!isMobile) {
    return <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">{children}</div>;
  }

  return (
    <div className="fixed bottom-[60px] left-0 right-0 z-20 border-t border-slate-200 bg-white/95 px-3 py-2.5 shadow-[0_-2px_12px_rgba(15,23,42,0.06)] backdrop-blur-sm">
      {children}
    </div>
  );
};

interface AuthShellProps {
  mode: "login" | "register";
  formTitle: string;
  authPrompt: ReactNode;
  children: ReactNode;
}

const AUTH_HERO_CONTENT = {
  login: {
    badge: "Business Card Portal",
    headline: "Manage business cards with ease",
    description:
      "Upload, process, and review card data in one secure AskOxy workspace.",
    features: [
      "Upload and scan business cards quickly",
      "Manage profiles and card details",
      "Secure, professional platform",
    ],
  },
  register: {
    badge: "Business Card Portal",
    headline: "Start your Business Card workspace",
    description:
      "Create your account and manage profiles, uploads, and card processing from anywhere.",
    features: [
      "Quick email-verified registration",
      "Access card tools on any device",
      "Secure, professional platform",
    ],
  },
} as const;

export const AuthShell: React.FC<AuthShellProps> = ({
  mode,
  formTitle,
  authPrompt,
  children,
}) => {
  const content = AUTH_HERO_CONTENT[mode];

  return (
    <BusinessCardThemeProvider>
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-3 sm:p-5">
        <div className="w-full max-w-[720px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 px-4 py-3 text-white md:hidden">
            <img src={askOxyLogo} alt="AskOxy" className="mb-1.5 h-6 w-auto brightness-0 invert" />
            <span className="inline-block rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest">
              {content.badge}
            </span>
            <h2 className="mt-1.5 text-sm font-semibold leading-snug">{content.headline}</h2>
          </div>

          <div className="flex min-h-0 flex-col md:flex-row">
            <aside className="relative hidden w-[42%] shrink-0 flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 px-5 py-5 text-white md:flex">
              <div>
                <img src={askOxyLogo} alt="AskOxy" className="h-7 w-auto brightness-0 invert" />
                <span className="mt-2 inline-block rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest">
                  {content.badge}
                </span>
                <h2 className="mt-2 text-base font-semibold leading-snug">{content.headline}</h2>
                <p className="mt-2 max-w-[240px] text-xs leading-relaxed text-white/80">
                  {content.description}
                </p>
                <ul className="mt-4 hidden flex-col gap-1.5 lg:flex">
                  {content.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-1.5 text-xs text-white/90">
                      <CheckCircleOutlined className="mt-0.5 shrink-0 text-cyan-300 text-[11px]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-4 text-[10px] text-white/45">Trusted · Secure · Professional</p>
            </aside>

            <section className="flex flex-1 flex-col justify-center px-4 py-5 sm:px-6 sm:py-6">
              <div className="mb-3">
                <h1 className="text-base font-semibold text-slate-900 sm:text-lg">Welcome to AskOxy</h1>
                <p className="bc-auth-form-prompt mt-0.5 text-xs text-slate-500 sm:text-[13px]">
                  {authPrompt}
                </p>
              </div>
              <h2 className="mb-3 text-[13px] font-semibold text-slate-700">{formTitle}</h2>
              <div className="bc-auth-form">{children}</div>
            </section>
          </div>
        </div>
      </div>
    </BusinessCardThemeProvider>
  );
};

export const ErrorBanner: React.FC<{ message: string }> = ({ message }) => (
  <Alert
    type="error"
    message={message}
    showIcon
    className="!mb-3 !rounded-md !py-2 !text-xs sm:!text-[13px]"
  />
);

export const StatusTag: React.FC<{ active?: boolean }> = ({ active }) => (
  <span
    className={[
      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide sm:text-[11px]",
      active === true
        ? "bg-emerald-100 text-emerald-700"
        : "bg-slate-100 text-slate-500",
    ].join(" ")}
  >
    {active === true ? "Active" : "Inactive"}
  </span>
);
