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

export type SectionKey = "upload" | "campaign" | "allpdfs" | "allcampaigns";

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
    sidebarLabel: "Upload Document",
    pageTitle: "Upload Company Document",
    pageSubtitle: "Upload company PDF files to power AI email campaigns.",
    cardTitle: "Upload Company Document",
    breadcrumb: "Upload Document",
  },
  campaign: {
    sidebarLabel: "Send Campaign",
    pageTitle: "Send Email Campaign",
    pageSubtitle: "Generate and dispatch AI-powered outreach emails to clients.",
    cardTitle: "Client Campaign Details",
    breadcrumb: "Send Campaign",
  },
  allpdfs: {
    sidebarLabel: "All Documents",
    pageTitle: "All Uploaded Documents",
    pageSubtitle: "Browse and search all uploaded company PDF files.",
    cardTitle: "All Uploaded Documents",
    breadcrumb: "All Documents",
  },
  allcampaigns: {
    sidebarLabel: "Campaign Manager",
    pageTitle: "Campaign Manager",
    pageSubtitle: "View all campaigns, scorecards and client conversations.",
    cardTitle: "Campaign Manager",
    breadcrumb: "Campaign Manager",
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
