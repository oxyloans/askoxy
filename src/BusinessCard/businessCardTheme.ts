import type { ThemeConfig } from "antd";
import type React from "react";

export const COLOR_PRIMARY = "#008cba";
export const COLOR_PRIMARY_DARK = "#0079a3";
export const COLOR_SUCCESS = "#1ab394";
export const COLOR_SUCCESS_DARK = "#18a689";

export const primaryButtonStyle: React.CSSProperties = {
  background: COLOR_PRIMARY,
  borderColor: COLOR_PRIMARY,
  color: "#ffffff",
};

export const successButtonStyle: React.CSSProperties = {
  background: COLOR_SUCCESS,
  borderColor: COLOR_SUCCESS,
  color: "#ffffff",
};

export const outlineSuccessButtonStyle: React.CSSProperties = {
  borderColor: COLOR_SUCCESS,
  color: COLOR_SUCCESS,
};

export const BUSINESS_CARD_THEME: ThemeConfig = {
  token: {
    colorPrimary: COLOR_PRIMARY,
    colorSuccess: COLOR_SUCCESS,
    colorLink: COLOR_PRIMARY,
    borderRadius: 6,
    fontSize: 13,
    fontSizeSM: 12,
    fontSizeLG: 14,
    controlHeight: 36,
    controlHeightSM: 28,
    controlHeightLG: 40,
  },
  components: {
    Button: {
      controlHeight: 36,
      fontWeight: 500,
      paddingInline: 14,
    },
    Input: {
      controlHeight: 36,
      fontSize: 13,
    },
    Select: {
      controlHeight: 36,
      fontSize: 13,
    },
    Form: {
      labelFontSize: 12,
      verticalLabelPadding: "0 0 4px",
    },
    Menu: {
      itemHeight: 38,
      fontSize: 13,
      itemSelectedColor: COLOR_PRIMARY,
      itemSelectedBg: "rgba(0, 140, 186, 0.08)",
    },
    Table: {
      fontSize: 13,
      cellPaddingBlock: 10,
      cellPaddingInline: 12,
    },
    Modal: {
      titleFontSize: 15,
    },
  },
};
