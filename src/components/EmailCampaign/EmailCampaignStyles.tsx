import React from "react";
import {
  COLOR_BORDER,
  COLOR_MENU_SELECTED,
  COLOR_MUTED,
  COLOR_PRIMARY,
  COLOR_PRIMARY_DARK,
  COLOR_SUCCESS,
  COLOR_TEXT,
} from "./constants";

const EmailCampaignStyles: React.FC = () => (
  <style>{`
    .ec-mail-layout,
    .ec-mail-layout .ant-layout,
    .ec-mail-layout .ant-layout-content {
      background: #ffffff !important;
    }

    .ec-page-container {
      width: 100%;
      max-width: 1152px;
      margin: 0 auto;
    }

    .ec-top-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }

    .ec-top-row-mobile {
      align-items: flex-start;
      margin-bottom: 18px;
    }

    .ec-top-row-content {
      flex: 1;
      min-width: 260px;
    }

    .ec-upload-title {
      font-weight: 700;
    }

    .ec-mobile-overlay {
      position: fixed;
      inset: 0;
      background: rgba(17, 24, 39, 0.38);
      z-index: 950;
    }

    .ec-sidebar-close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      z-index: 20;
      background: #f3f4f6;
      border: 1px solid ${COLOR_BORDER};
      color: ${COLOR_TEXT};
      width: 32px;
      height: 32px;
      border-radius: 10px;
      cursor: pointer;
      line-height: 1;
      font-size: 18px;
    }

    .ec-footer-brand {
      color: ${COLOR_PRIMARY};
    }

    .ec-sidebar-brand {
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
      padding: 0 18px;
      border-bottom: 1px solid ${COLOR_BORDER};
      background: #ffffff;
    }

    .ec-sidebar-brand.ec-sidebar-brand-collapsed {
      justify-content: center;
      padding: 0;
    }

    .ec-brand-icon {
      width: 38px;
      height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: ${COLOR_PRIMARY};
      flex: 0 0 auto;
    }

    .ec-side-menu .ant-menu-item {
      height: 44px !important;
      line-height: 44px !important;
      border-radius: 12px !important;
      margin: 6px 0 !important;
      color: #4b5563 !important;
      font-weight: 600 !important;
    }

    .ec-side-menu .ant-menu-item .anticon {
      color: #6b7280 !important;
    }

    .ec-side-menu .ant-menu-item:hover {
      background: #f3f4f6 !important;
      color: #111827 !important;
    }

    .ec-side-menu .ant-menu-item:hover .anticon {
      color: ${COLOR_PRIMARY} !important;
    }

    .ec-side-menu .ant-menu-item-selected {
      background: ${COLOR_MENU_SELECTED} !important;
      color: #111827 !important;
    }

    .ec-side-menu .ant-menu-item-selected .anticon {
      color: ${COLOR_PRIMARY} !important;
    }

    .ec-menu-toggle {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      color: ${COLOR_PRIMARY} !important;
      background: rgba(0, 140, 186, 0.08) !important;
      border: 1px solid rgba(0, 140, 186, 0.18) !important;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .ec-form-label {
      font-size: 14px;
      font-weight: 700;
      color: ${COLOR_TEXT};
    }

    .ec-required {
      color: #ef4444;
      margin-left: 2px;
    }

    .ec-form-hint {
      font-size: 12px;
      color: ${COLOR_MUTED};
      line-height: 1.5;
    }

    .ec-form-input,
    .ec-form-input.ant-input-affix-wrapper {
      border-radius: 12px !important;
      border-color: #d1d5db !important;
      min-height: 46px;
      box-shadow: none !important;
    }

    .ec-form-input:hover,
    .ec-form-input.ant-input-affix-wrapper:hover {
      border-color: ${COLOR_PRIMARY} !important;
    }

    .ec-form-input:focus,
    .ec-form-input.ant-input-affix-wrapper-focused {
      border-color: ${COLOR_PRIMARY} !important;
      box-shadow: 0 0 0 3px rgba(0, 140, 186, 0.14) !important;
    }

    .ec-hidden-file-input {
      display: none;
    }

    .ec-upload-dragger.ant-upload-drag {
      border-radius: 16px !important;
      border-color: #d1d5db !important;
      background: #f9fafb !important;
      padding: 22px 16px !important;
    }

    .ec-upload-dragger.ant-upload-drag:hover {
      border-color: ${COLOR_PRIMARY} !important;
      background: rgba(0, 140, 186, 0.08) !important;
    }

    .ec-upload-dragger .ant-upload-text {
      color: ${COLOR_TEXT};
      font-size: 15px;
    }

    .ec-upload-dragger .ant-upload-hint {
      color: ${COLOR_MUTED};
    }

    .ec-primary-btn.ant-btn-primary:not(:disabled) {
      background: ${COLOR_PRIMARY} !important;
      border-color: ${COLOR_PRIMARY} !important;
      color: #ffffff !important;
    }

    .ec-success-btn.ant-btn-primary:not(:disabled) {
      background: ${COLOR_SUCCESS} !important;
      border-color: ${COLOR_SUCCESS} !important;
      color: #ffffff !important;
    }

    .ec-primary-btn.ant-btn-primary:not(:disabled):hover {
      background: ${COLOR_PRIMARY_DARK} !important;
      border-color: ${COLOR_PRIMARY_DARK} !important;
      color: #ffffff !important;
    }

    .ec-success-btn.ant-btn-primary:not(:disabled):hover {
      background: #159b80 !important;
      border-color: #159b80 !important;
      color: #ffffff !important;
    }

    .ec-primary-btn.ant-btn-primary:disabled,
    .ec-success-btn.ant-btn-primary:disabled {
      color: rgba(255, 255, 255, 0.75) !important;
      background: #9ca3af !important;
      border-color: #9ca3af !important;
      box-shadow: none !important;
    }

    .ec-outline-btn.ant-btn {
      height: 44px;
      border-radius: 10px;
      font-weight: 700;
      color: ${COLOR_PRIMARY};
      border-color: rgba(0, 140, 186, 0.28);
      background: #ffffff;
    }

    .ec-outline-btn.ant-btn:hover {
      color: #ffffff !important;
      background: ${COLOR_PRIMARY} !important;
      border-color: ${COLOR_PRIMARY} !important;
    }

    .ec-pro-card .ant-card-head-title {
      padding: 16px 0;
    }

    .ec-campaign-tabs .ant-tabs-nav {
      margin-bottom: 20px;
    }

    .ec-campaign-tabs .ant-tabs-tab {
      font-weight: 600;
      padding: 10px 4px;
    }

    .ec-mail-layout .ant-layout-sider::-webkit-scrollbar {
      width: 6px;
    }

    .ec-mail-layout .ant-layout-sider::-webkit-scrollbar-track {
      background: #ffffff;
    }

    .ec-mail-layout .ant-layout-sider::-webkit-scrollbar-thumb {
      background-color: #d1d5db;
      border-radius: 10px;
    }

    @media (max-width: 768px) {
      .ec-page-container {
        max-width: 100%;
      }

      .ec-top-row .ant-breadcrumb {
        width: 100%;
        overflow-x: auto;
      }

      .ec-sidebar-brand {
        justify-content: flex-start !important;
        padding: 0 18px !important;
      }

      .ec-pro-card {
        border-radius: 14px !important;
      }
    }

    @media (max-width: 480px) {
      .ec-mail-layout .ant-card-head {
        padding: 0 14px !important;
      }

      .ec-mail-layout .ant-card-body {
        padding: 14px !important;
      }

      .ec-upload-dragger.ant-upload-drag {
        padding: 16px 10px !important;
      }
    }
  `}</style>
);

export default EmailCampaignStyles;
