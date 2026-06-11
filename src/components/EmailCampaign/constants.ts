import type React from "react";

export const COLOR_PRIMARY = "#008cba";
export const COLOR_PRIMARY_DARK = "#0079a3";
export const COLOR_SUCCESS = "#1ab394";
export const COLOR_TEXT = "#111827";
export const COLOR_MUTED = "#6b7280";
export const COLOR_BORDER = "#e5e7eb";
export const COLOR_BG = "#ffffff";
export const COLOR_SIDEBAR = "#ffffff";
export const COLOR_MENU_SELECTED = "#f9fafb";

export type SectionKey = "upload" | "campaign";

export const SECTION_META: Record<
  SectionKey,
  {
    sidebarLabel: string;
    pageTitle: string;
    pageSubtitle: string;
    cardTitle: string;
    breadcrumb: string;
  }
> = {
  upload: {
    sidebarLabel: "Company Upload Files",
    pageTitle: "Company Upload Files",
    pageSubtitle: "Upload company files for AI email campaigns.",
    cardTitle: "Upload Company Document",
    breadcrumb: "PDF Upload",
  },
  campaign: {
    sidebarLabel: "Email Campaign",
    pageTitle: "Email Campaign",
    pageSubtitle: "Create AI outreach emails for clients.",
    cardTitle: "Client Campaign Details",
    breadcrumb: "Campaign",
  },
};

export const primaryButtonStyle: React.CSSProperties = {
  background: COLOR_PRIMARY,
  borderColor: COLOR_PRIMARY,
  color: "#ffffff",
  fontWeight: 600,
  height: 38,
  borderRadius: 8,
  fontSize: 14,
};

export const successButtonStyle: React.CSSProperties = {
  background: COLOR_SUCCESS,
  borderColor: COLOR_SUCCESS,
  color: "#ffffff",
  fontWeight: 600,
  height: 38,
  borderRadius: 8,
  fontSize: 14,
};

export const cardStyle: React.CSSProperties = {
  borderRadius: 18,
  border: `1px solid ${COLOR_BORDER}`,
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
  overflow: "hidden",
};

export const EXPANDED_SIDEBAR_WIDTH = 250;
