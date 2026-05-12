"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./lib/api";
import { Modal } from "antd";
import logo from '../assets/img/askoxylogonew.png';
import { AttemptStatus } from './AttemptStatus';
import axiosInstance from "../utils/axiosInstance";
import BASE_URL from "../Config";

/* ─── Inline CSS injected once ─── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .theme-light {
    --brand: #2563eb;
    --brand-dark: #1d4ed8;
    --brand-soft: #dbeafe;
    --brand-tint: rgba(37,99,235,.08);
    --accent: #7c3aed;
    --accent-soft: #ede9fe;
    --success: #059669;
    --warning: #d97706;
    --danger: #dc2626;
    --text-primary: #0f172a;
    --text-secondary: #475569;
    --text-muted: #94a3b8;
    --surface: rgba(255,255,255,.92);
    --surface-solid: #ffffff;
    --surface-2: #f8fafc;
    --surface-3: #eef2ff;
    --border: rgba(148,163,184,.28);
    --border-strong: rgba(100,116,139,.34);
    --shadow-sm: 0 8px 24px rgba(15,23,42,.06);
    --shadow-md: 0 16px 45px rgba(15,23,42,.10);
    --shadow-lg: 0 26px 80px rgba(15,23,42,.14);
    --grid: rgba(37,99,235,.08);
    --glow-1: rgba(37,99,235,.16);
    --glow-2: rgba(124,58,237,.13);
    --brand-light: var(--brand-soft);
    --brand-mid: color-mix(in srgb, var(--brand) 22%, transparent);
    --radius-sm: 10px;
    --radius-md: 16px;
    --radius-lg: 22px;
    --radius-xl: 28px;
  }

  .theme-dark {
    --brand: #60a5fa;
    --brand-dark: #93c5fd;
    --brand-soft: rgba(96,165,250,.18);
    --brand-tint: rgba(96,165,250,.13);
    --accent: #a78bfa;
    --accent-soft: rgba(167,139,250,.16);
    --success: #34d399;
    --warning: #fbbf24;
    --danger: #fb7185;
    --text-primary: #f8fafc;
    --text-secondary: #cbd5e1;
    --text-muted: #94a3b8;
    --surface: rgba(15,23,42,.78);
    --surface-solid: #111827;
    --surface-2: #020617;
    --surface-3: rgba(30,41,59,.78);
    --border: rgba(148,163,184,.22);
    --border-strong: rgba(148,163,184,.36);
    --shadow-sm: 0 10px 30px rgba(0,0,0,.18);
    --shadow-md: 0 18px 55px rgba(0,0,0,.28);
    --shadow-lg: 0 30px 90px rgba(0,0,0,.42);
    --grid: rgba(148,163,184,.10);
    --glow-1: rgba(96,165,250,.20);
    --glow-2: rgba(167,139,250,.18);
    --brand-light: var(--brand-soft);
    --brand-mid: color-mix(in srgb, var(--brand) 24%, transparent);
    --radius-sm: 10px;
    --radius-md: 16px;
    --radius-lg: 22px;
    --radius-xl: 28px;
  }

  .ai-bg {
    min-height: 100vh;
    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: var(--text-primary);
    background-color: var(--surface-2);
    background-image:
      radial-gradient(circle at 12% 12%, var(--glow-1), transparent 34%),
      radial-gradient(circle at 88% 4%, var(--glow-2), transparent 30%),
      linear-gradient(var(--grid) 1px, transparent 1px),
      linear-gradient(90deg, var(--grid) 1px, transparent 1px);
    background-size: 100% 100%, 100% 100%, 56px 56px, 56px 56px;
    background-position: center, center, -1px -1px, -1px -1px;
  }

  .ai-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: color-mix(in srgb, var(--surface-solid) 86%, transparent);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--border);
  }
  .ai-header-inner {
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 18px;
    min-height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
  }
  .ai-logo-group { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .ai-logo-divider { width: 1px; height: 30px; background: var(--border-strong); }
  .ai-header-title { font-size: 14px; font-weight: 800; color: var(--text-primary); letter-spacing: .02em; }
  .ai-header-sub { font-size: 12px; color: var(--text-muted); margin-top: 1px; }
  .ai-header-actions { display: flex; align-items: center; gap: 10px; }
  .theme-toggle {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 38px;
    padding: 7px 12px;
    border: 1px solid var(--border);
    border-radius: 999px;
    color: var(--text-primary);
    background: var(--surface);
    cursor: pointer;
    font-size: 12px;
    font-weight: 700;
    box-shadow: var(--shadow-sm);
  }
  .ai-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg,var(--brand),var(--accent)); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 13px; font-weight: 800; }
  .ai-user-chip { display: flex; align-items: center; gap: 8px; padding: 5px 12px 5px 5px; border: 1px solid var(--border); border-radius: 999px; background: var(--surface); box-shadow: var(--shadow-sm); }
  .ai-user-name { font-size: 13px; font-weight: 700; color: var(--text-primary); max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .ai-main { max-width: 1180px; margin: 0 auto; padding: 16px 18px 38px; }

  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 24px; box-shadow: var(--shadow-md); overflow: hidden; }
  .card-header { padding: 18px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; background: linear-gradient(135deg, var(--surface), var(--brand-tint)); }
  .card-body { padding: 20px; }

  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-family: inherit; font-size: 14px; font-weight: 800; border: none; cursor: pointer; transition: all .18s ease; outline: none; }
  .btn:disabled { opacity: .48; cursor: not-allowed; transform: none !important; box-shadow: none !important; }
  .btn-primary { position: relative; overflow: hidden; background: linear-gradient(135deg, #ffffff33 0%, transparent 28%), linear-gradient(135deg, var(--brand), var(--accent)); color: #fff; padding: 11px 22px; border-radius: 14px; border: 1px solid rgba(255,255,255,.32); box-shadow: inset 0 1px 0 rgba(255,255,255,.38), inset 0 -3px 0 rgba(0,0,0,.12), 0 14px 28px color-mix(in srgb, var(--brand) 26%, transparent); }
  .btn-primary::after { content: ''; position: absolute; top: -40%; bottom: -40%; left: -45%; width: 34%; transform: rotate(18deg); background: linear-gradient(90deg, transparent, rgba(255,255,255,.42), transparent); transition: left .65s ease; pointer-events: none; }
  .btn-primary:hover:not(:disabled)::after { left: 120%; }
  .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: inset 0 1px 0 rgba(255,255,255,.42), inset 0 -3px 0 rgba(0,0,0,.12), 0 20px 42px color-mix(in srgb, var(--brand) 34%, transparent); }
  .btn-primary-lg { padding: 13px 30px; font-size: 15px; border-radius: 999px; }
  .btn-outline { background: var(--surface); color: var(--text-secondary); padding: 9px 16px; border: 1px solid var(--border-strong); border-radius: 14px; }
  .btn-outline:hover:not(:disabled) { background: var(--surface-3); color: var(--text-primary); }
  .btn-danger { background: rgba(220,38,38,.10); color: var(--danger); padding: 9px 18px; border: 1px solid rgba(220,38,38,.22); border-radius: 14px; }
  .btn-green { background: linear-gradient(135deg, #16a34a, #059669); color: #fff; padding: 9px 16px; border-radius: 13px; }

  .welcome-hero { text-align: center; padding: 18px 18px 26px; max-width: 860px; margin: 0 auto; }
  .welcome-badge { display: inline-flex; align-items: center; gap: 8px; background: var(--surface); color: var(--brand-dark); font-size: 11px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; padding: 7px 14px; border-radius: 999px; border: 1px solid var(--border); margin-bottom: 12px; box-shadow: var(--shadow-sm); }
  .welcome-badge::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: var(--success); display: inline-block; animation: pulse-dot 1.8s ease-in-out infinite; }
  @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.82)} }
  .welcome-title { font-size: clamp(1.95rem, 5.2vw, 3.75rem); font-weight: 900; letter-spacing: -.055em; line-height: 1; color: var(--text-primary); margin: 0 0 12px; }
  .welcome-title em { font-style: normal; background: linear-gradient(135deg, var(--brand), var(--accent)); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .welcome-sub { font-size: 15px; color: var(--text-secondary); line-height: 1.62; max-width: 610px; margin: 0 auto 18px; }

  .bot-bubble { display: inline-flex; align-items: center; gap: 10px; background: var(--surface); border: 1px solid var(--border); border-radius: 999px; padding: 9px 16px; box-shadow: var(--shadow-md); margin-bottom: 14px; }
  .bot-icon { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg,var(--brand),var(--accent)); display: flex; align-items: center; justify-content: center; font-size: 17px; }
  .bot-text { font-size: 14px; color: var(--text-primary); font-weight: 700; }
  .bot-cursor { display: inline-block; width: 2px; height: 14px; background: var(--brand); margin-left: 2px; vertical-align: middle; animation: blink .7s step-end infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

  .round-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin: 22px 0 20px; }
  .round-card { background: var(--surface); border: 1px solid var(--border); border-radius: 22px; padding: 16px; text-align: left; transition: all .22s ease; position: relative; overflow: hidden; box-shadow: var(--shadow-sm); }
  .round-card::before { content:''; position:absolute; inset:0; background: radial-gradient(circle at 90% 0%, var(--brand-tint), transparent 45%); pointer-events:none; }
  .round-card:hover { border-color: color-mix(in srgb, var(--brand) 44%, var(--border)); transform: translateY(-4px); box-shadow: var(--shadow-md); }
  .round-num { width: 38px; height: 38px; border-radius: 13px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 900; color: #fff; margin-bottom: 12px; box-shadow: 0 10px 25px rgba(15,23,42,.16); }
  .round-name { font-size: 15px; font-weight: 900; color: var(--text-primary); margin-bottom: 5px; }
  .round-meta { display: flex; gap: 8px; font-size: 11px; color: var(--text-muted); font-weight: 700; }
  .round-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.6; margin-top: 10px; }
  .stats-row { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin: 16px 0 0; }
  .stat-item { display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 700; color: var(--text-secondary); background: var(--surface); border: 1px solid var(--border); padding: 8px 12px; border-radius: 999px; }
  .stat-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--brand); }


  .primary-cta-wrap { display: flex; justify-content: center; margin: 4px 0 0; }
  .primary-cta-note { margin-top: 8px; font-size: 12px; font-weight: 700; color: var(--text-muted); }
  .how-works { margin-top: 22px; text-align: left; background: var(--surface); border: 1px solid var(--border); border-radius: 26px; padding: 18px; box-shadow: var(--shadow-md); position: relative; overflow: hidden; }
  .how-works::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 8% 0%, var(--brand-tint), transparent 36%), radial-gradient(circle at 96% 14%, var(--accent-soft), transparent 30%); pointer-events: none; }
  .how-works-head { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
  .how-works-kicker { display: inline-flex; align-items: center; gap: 7px; padding: 7px 12px; border-radius: 999px; background: var(--brand-tint); color: var(--brand-dark); font-size: 11px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
  .how-works-title { margin: 8px 0 0; font-size: 20px; line-height: 1.2; font-weight: 900; color: var(--text-primary); letter-spacing: -.03em; }
  .how-works-grid { position: relative; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
  .how-step { min-height: 136px; background: color-mix(in srgb, var(--surface-solid) 72%, transparent); border: 1px solid var(--border); border-radius: 20px; padding: 14px; box-shadow: var(--shadow-sm); }
  .how-step-icon { width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; border-radius: 14px; margin-bottom: 10px; background: linear-gradient(135deg, var(--brand), var(--accent)); color: white; box-shadow: inset 0 1px 0 rgba(255,255,255,.36), 0 12px 24px color-mix(in srgb, var(--brand) 22%, transparent); }
  .how-step-title { font-size: 13px; font-weight: 900; color: var(--text-primary); margin-bottom: 5px; }
  .how-step-desc { font-size: 12px; line-height: 1.55; color: var(--text-secondary); }
  @media(max-width: 900px){ .how-works-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }

  .dropzone { border: 1.5px dashed var(--border-strong); border-radius: 22px; padding: 36px 24px; text-align: center; cursor: pointer; transition: all .2s; background: var(--surface-2); }
  .dropzone:hover,.dropzone.active { border-color: var(--brand); background: var(--brand-tint); transform: translateY(-1px); }
  .dropzone-title { font-size: 15px; font-weight: 900; color: var(--text-primary); margin-bottom: 4px; word-break: break-word; }
  .dropzone-sub { font-size: 13px; color: var(--text-muted); }

  .analyzing-wrap { display: flex; align-items: center; justify-content: center; min-height: 62vh; }
  .analyzing-card { background: var(--surface); border: 1px solid var(--border); border-radius: 28px; padding: 46px 34px; text-align: center; max-width: 380px; box-shadow: var(--shadow-lg); }
  .spin-bot { width: 74px; height: 74px; border-radius: 24px; background: linear-gradient(135deg,var(--brand),var(--accent)); display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 20px; animation: spin3d 2s linear infinite; }
  @keyframes spin3d { from{transform:rotateY(0)} to{transform:rotateY(360deg)} }
  .progress-steps { text-align: left; margin-top: 20px; }
  .progress-step { display: flex; align-items: center; gap: 10px; padding: 8px 0; font-size: 13px; color: var(--text-secondary); }
  .step-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--brand); flex-shrink: 0; animation: pulse-dot 1.8s infinite; }

  .profile-header { display: flex; align-items: center; gap: 14px; padding: 18px 20px; background: linear-gradient(135deg,var(--brand-tint),var(--accent-soft)); border-bottom: 1px solid var(--border); }
  .profile-avatar { width: 50px; height: 50px; border-radius: 18px; background: linear-gradient(135deg,var(--brand),var(--accent)); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 20px; font-weight: 900; flex-shrink: 0; }
  .profile-name { font-size: 15px; font-weight: 900; color: var(--text-primary); }
  .profile-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 800; color: var(--success); background: color-mix(in srgb, var(--success) 11%, transparent); padding: 3px 9px; border-radius: 999px; margin-top: 4px; }
  .tag { display: inline-flex; align-items: center; padding: 5px 10px; border-radius: 999px; font-size: 12px; font-weight: 800; margin: 3px; }
  .tag-skill { background: color-mix(in srgb, var(--success) 12%, transparent); color: var(--success); border: 1px solid color-mix(in srgb, var(--success) 24%, transparent); }
  .tag-domain { background: var(--brand-soft); color: var(--brand-dark); border: 1px solid color-mix(in srgb, var(--brand) 25%, transparent); }
  .tag-exp { background: color-mix(in srgb, var(--warning) 14%, transparent); color: var(--warning); border: 1px solid color-mix(in srgb, var(--warning) 30%, transparent); }

  .round-row { display: flex; align-items: flex-start; gap: 14px; padding: 15px 0; border-bottom: 1px solid var(--border); }
  .round-row:last-child { border-bottom: none; }
  .round-num-badge { width: 38px; height: 38px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 900; color: #fff; flex-shrink: 0; }
  .round-info-title { font-size: 14px; font-weight: 900; color: var(--text-primary); }
  .round-info-sub { font-size: 12px; color: var(--text-secondary); margin-top: 3px; }
  .round-chips { display: flex; gap: 7px; margin-top: 8px; flex-wrap: wrap; }
  .chip { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 800; border: 1px solid var(--border); color: var(--text-secondary); background: var(--surface-3); }

  .q-header { padding: 16px 20px; background: linear-gradient(135deg, var(--surface), var(--brand-tint)); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .q-round-badge { width: 42px; height: 42px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 900; color: #fff; }
  .timer-chip { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 999px; font-size: 14px; font-weight: 900; border: 1px solid; }
  .timer-normal { background: color-mix(in srgb, var(--warning) 13%, transparent); color: var(--warning); border-color: color-mix(in srgb, var(--warning) 26%, transparent); }
  .timer-urgent { background: color-mix(in srgb, var(--danger) 13%, transparent); color: var(--danger); border-color: color-mix(in srgb, var(--danger) 28%, transparent); animation: timer-pulse .8s ease-in-out infinite; }
  .timer-stopped { background: var(--surface-3); color: var(--text-muted); border-color: var(--border); }
  @keyframes timer-pulse { 0%,100%{opacity:1} 50%{opacity:.66} }

  .q-box { background: var(--surface-solid); border: 1px solid var(--border); border-radius: 18px; padding: 18px; box-shadow: var(--shadow-sm); }
  .q-section { padding: 14px 15px; border-radius: 16px; border-left: 4px solid; margin-bottom: 11px; }
  .q-section-problem { background: var(--brand-tint); border-color: var(--brand); }
  .q-section-function { background: color-mix(in srgb, var(--success) 10%, transparent); border-color: var(--success); }
  .q-section-example { background: var(--accent-soft); border-color: var(--accent); }
  .q-section-constraint { background: color-mix(in srgb, var(--warning) 13%, transparent); border-color: var(--warning); }
  .q-section-label { font-size: 10px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 7px; }

  .mcq-option { display: flex; align-items: flex-start; gap: 10px; padding: 13px 14px; border: 1.5px solid var(--border); border-radius: 16px; cursor: pointer; transition: all .16s; margin-bottom: 9px; background: var(--surface-solid); }
  .mcq-option:hover:not(.disabled) { border-color: var(--brand); background: var(--brand-tint); }
  .mcq-option.selected { border-color: var(--brand); background: var(--brand-tint); box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand) 12%, transparent); }
  .mcq-option.incorrect { border-color: var(--danger); background: color-mix(in srgb, var(--danger) 12%, var(--surface-solid)); box-shadow: 0 0 0 3px color-mix(in srgb, var(--danger) 12%, transparent); }
  .mcq-option.correct { border-color: var(--success); background: color-mix(in srgb, var(--success) 12%, var(--surface-solid)); box-shadow: 0 0 0 3px color-mix(in srgb, var(--success) 12%, transparent); }
  .mcq-option.disabled { cursor: not-allowed; opacity: .92; }
  .mcq-radio { width: 19px; height: 19px; border-radius: 50%; border: 2px solid var(--border-strong); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
  .mcq-option.selected .mcq-radio { border-color: var(--brand); background: var(--brand); }
  .mcq-option.incorrect .mcq-radio { border-color: var(--danger); background: var(--danger); }
  .mcq-option.correct .mcq-radio { border-color: var(--success); background: var(--success); }
  .mcq-option.incorrect .mcq-letter, .mcq-option.incorrect .mcq-text { color: var(--danger); }
  .mcq-option.correct .mcq-letter, .mcq-option.correct .mcq-text { color: var(--success); }
  .clipboard-note { margin-top: 8px; font-size: 12px; line-height: 1.5; color: var(--warning); font-weight: 700; background: color-mix(in srgb, var(--warning) 10%, transparent); border: 1px solid color-mix(in srgb, var(--warning) 25%, transparent); padding: 8px 10px; border-radius: 12px; }
  .mcq-dot { width: 8px; height: 8px; border-radius: 50%; background: white; }
  .mcq-letter { font-size: 12px; font-weight: 900; color: var(--brand-dark); min-width: 16px; }
  .mcq-text { font-size: 13px; color: var(--text-primary); line-height: 1.55; }

  .ai-textarea { width: 100%; padding: 15px 16px; font-family: inherit; font-size: 14px; background: var(--surface-solid); border: 1.5px solid var(--border); border-radius: 18px; color: var(--text-primary); resize: vertical; outline: none; transition: all .16s; line-height: 1.65; }
  .ai-textarea:focus { border-color: var(--brand); box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand) 13%, transparent); }
  .ai-textarea:disabled { opacity: .55; cursor: not-allowed; }
  .ai-textarea.mono { font-family: 'JetBrains Mono','Fira Code',Consolas,monospace; font-size: 13px; }
  .code-output { background: #020617; color: #86efac; padding: 14px 16px; border-radius: 16px; font-family: monospace; font-size: 12px; white-space: pre-wrap; border: 1px solid rgba(148,163,184,.24); }
  .code-error { background: color-mix(in srgb, var(--danger) 12%, transparent); color: var(--danger); padding: 14px 16px; border-radius: 16px; font-family: monospace; font-size: 12px; white-space: pre-wrap; border: 1px solid color-mix(in srgb, var(--danger) 24%, transparent); }
  .feedback-box { background: linear-gradient(135deg, color-mix(in srgb, var(--success) 12%, transparent), var(--surface)); border: 1px solid color-mix(in srgb, var(--success) 26%, transparent); border-radius: 18px; padding: 16px; }
  .feedback-label { font-size: 11px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; color: var(--success); margin-bottom: 8px; }
  .feedback-text { font-size: 13px; color: var(--text-secondary); line-height: 1.7; }

  .ai-modal-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(2,6,23,.56); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 20px; }
  .ai-modal { background: var(--surface-solid); border: 1px solid var(--border); border-radius: 28px; padding: 34px 30px; max-width: 460px; width: 100%; box-shadow: var(--shadow-lg); text-align: center; }
  .ai-modal-icon { font-size: 46px; margin-bottom: 14px; }
  .ai-modal-title { font-size: 22px; font-weight: 900; color: var(--text-primary); margin-bottom: 10px; }
  .ai-modal-msg { font-size: 14px; color: var(--text-secondary); line-height: 1.7; white-space: pre-line; }
  .char-counter { font-size: 12px; font-weight: 900; }
  .char-ok { color: var(--success); }
  .char-warn { color: var(--warning); }
  .section-label { font-size: 12px; font-weight: 900; color: var(--text-muted); letter-spacing: .08em; text-transform: uppercase; margin-bottom: 10px; }
  .two-col { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 20px; align-items: start; }
  .progress-bar-wrap { height: 5px; background: var(--border); border-radius: 999px; overflow: hidden; }
  .progress-bar-fill { height: 100%; background: linear-gradient(90deg,var(--brand),var(--accent)); border-radius: 999px; transition: width .3s ease; }
  @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
  .spinner { animation: spin .8s linear infinite; }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 999px; }

  @media(max-width: 820px){
    .two-col { grid-template-columns: 1fr; }
    .round-grid { grid-template-columns: 1fr; }
    .ai-main { padding: 12px 14px 30px; }
    .welcome-hero { padding: 12px 0 18px; }
    .q-header { align-items: flex-start; }
    .q-header > div:nth-child(2) { order: 3; flex-basis: 100%; max-width: none !important; margin: 4px 0 0 !important; }
  }

  @media(max-width: 560px){
    .ai-header-inner { padding: 8px 12px; min-height: 66px; }
    .ai-header-sub, .ai-user-name { display: none; }
    .ai-logo-divider { display: none; }
    .theme-toggle span { display: none; }
    .theme-toggle { width: 38px; padding: 0; justify-content: center; }
    .card-header, .card-body, .q-header { padding-left: 15px; padding-right: 15px; }
    .welcome-title { letter-spacing: -.045em; }
    .bot-bubble { max-width: 100%; }
    .how-works { padding: 14px; margin-top: 18px; }
    .how-works-grid { grid-template-columns: 1fr; }
    .how-step { min-height: auto; }
  }

  /* ─── Final polish: +15% visual scale and premium How It Works ─── */
  .ai-header-inner { max-width: 1280px; min-height: 72px; padding: 0 22px; }
  .ai-main { max-width: 1280px; padding: 18px 22px 48px; }
  .ai-header-title { font-size: 16px; }
  .ai-header-sub { font-size: 13px; }
  .theme-toggle { min-height: 42px; padding: 8px 15px; font-size: 13px; }
  .ai-avatar { width: 39px; height: 39px; font-size: 15px; }
  .ai-user-chip { padding: 6px 14px 6px 6px; }
  .ai-user-name { font-size: 14px; }

  .welcome-hero { max-width: 980px; padding: 22px 18px 34px; }
  .welcome-badge { font-size: 12.5px; padding: 8px 17px; margin-bottom: 14px; }
  .bot-bubble { padding: 11px 20px; margin-bottom: 16px; }
  .bot-icon { width: 39px; height: 39px; font-size: 19px; }
  .bot-text { font-size: 16px; }
  .welcome-title { font-size: clamp(2.35rem, 5.9vw, 4.35rem); line-height: .98; margin-bottom: 14px; }
  .welcome-sub { font-size: 17px; max-width: 710px; margin-bottom: 20px; }
  .btn { font-size: 16px; }
  .btn-primary-lg { padding: 16px 36px; font-size: 17px; }
  .primary-cta-note { font-size: 13.5px; margin-top: 10px; }
  .stats-row { gap: 12px; margin: 18px 0 0; }
  .stat-item { font-size: 14.5px; padding: 10px 15px; }

  .round-grid { gap: 17px; margin: 24px 0 22px; }
  .round-card { padding: 19px; border-radius: 25px; }
  .round-num { width: 44px; height: 44px; font-size: 18px; border-radius: 15px; }
  .round-name { font-size: 17px; }
  .round-meta { font-size: 12.5px; }
  .round-desc { font-size: 13.5px; }

  .how-works { margin-top: 26px; padding: 0; border-radius: 30px; background: linear-gradient(135deg, color-mix(in srgb, var(--surface-solid) 88%, transparent), color-mix(in srgb, var(--surface) 96%, var(--brand-tint))); box-shadow: var(--shadow-lg); }
  .how-works::before { background: radial-gradient(circle at 6% 0%, color-mix(in srgb, var(--brand) 18%, transparent), transparent 32%), radial-gradient(circle at 96% 12%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 34%); }
  .how-works-head { padding: 24px 26px 0; margin-bottom: 18px; align-items: flex-start; }
  .how-works-kicker { padding: 8px 14px; font-size: 12px; background: color-mix(in srgb, var(--brand) 13%, transparent); border: 1px solid color-mix(in srgb, var(--brand) 22%, transparent); }
  .how-works-title { font-size: clamp(1.55rem, 3vw, 2.35rem); margin-top: 10px; max-width: 650px; }
  .how-works-sub { margin: 10px 0 0; max-width: 700px; font-size: 15px; line-height: 1.7; color: var(--text-secondary); font-weight: 600; }
  .how-works-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0; padding: 0 18px 22px; }
  .how-step { position: relative; min-height: 168px; padding: 21px 17px 18px; border-radius: 24px; border: 1px solid transparent; background: transparent; box-shadow: none; }
  .how-step:not(:last-child)::after { content: ''; position: absolute; top: 38px; right: -8px; width: 18px; height: 18px; border-top: 2px solid color-mix(in srgb, var(--brand) 35%, transparent); border-right: 2px solid color-mix(in srgb, var(--brand) 35%, transparent); transform: rotate(45deg); opacity: .75; }
  .how-step-inner { height: 100%; padding: 18px; border-radius: 24px; border: 1px solid var(--border); background: color-mix(in srgb, var(--surface-solid) 82%, transparent); box-shadow: var(--shadow-sm); transition: all .22s ease; }
  .how-step-inner:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: color-mix(in srgb, var(--brand) 38%, var(--border)); }
  .how-step-top { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .how-step-icon { width: 48px; height: 48px; margin: 0; border-radius: 18px; font-size: 22px; }
  .how-step-number { display: inline-flex; align-items: center; justify-content: center; min-width: 34px; height: 28px; padding: 0 10px; border-radius: 999px; background: var(--brand-tint); color: var(--brand-dark); font-size: 12px; font-weight: 900; border: 1px solid color-mix(in srgb, var(--brand) 24%, transparent); }
  .how-step-title { font-size: 16px; margin-bottom: 7px; }
  .how-step-desc { font-size: 13.5px; line-height: 1.65; }

  .card { border-radius: 28px; }
  .card-header { padding: 21px 23px; }
  .card-body { padding: 23px; }
  .dropzone { padding: 42px 28px; }
  .dropzone-title { font-size: 17px; }
  .dropzone-sub { font-size: 15px; }
  .q-header { padding: 19px 23px; }
  .q-round-badge { width: 48px; height: 48px; font-size: 20px; }
  .timer-chip { font-size: 16px; padding: 10px 18px; }
  .q-box { padding: 21px; }
  .mcq-text, .ai-textarea { font-size: 16px; }

  @media(max-width: 900px){
    .how-works-grid { grid-template-columns: 1fr; gap: 14px; padding: 0 18px 22px; }
    .how-step { min-height: auto; padding: 0; }
    .how-step:not(:last-child)::after { display: none; }
    .how-step-inner { display: block; }
  }

  @media(max-width: 820px){
    .ai-main { padding: 16px 14px 38px; }
    .welcome-hero { padding: 18px 0 28px; }
    .welcome-sub { font-size: 15.5px; }
    .round-grid { gap: 14px; }
    .how-works-head { padding: 20px 18px 0; }
    .how-works-title { font-size: 1.55rem; }
    .how-works-sub { font-size: 14px; }
    .btn-primary-lg { width: 100%; max-width: 340px; }
  }

  @media(max-width: 560px){
    .ai-header-inner { min-height: 68px; padding: 8px 12px; }
    .welcome-title { font-size: clamp(2rem, 12vw, 3.05rem); }
    .welcome-badge { font-size: 11px; }
    .bot-text { font-size: 13.5px; }
    .stat-item { font-size: 13px; padding: 9px 12px; }
    .round-card { padding: 17px; }
    .how-step-inner { padding: 16px; }
    .how-step-icon { width: 44px; height: 44px; }
  }


  /* ─── Final responsive UI fixes: overlap + text clarity ─── */
  .ai-bg, .ai-bg * { -webkit-font-smoothing: antialiased; text-rendering: geometricPrecision; }
  .ai-bg h1, .ai-bg h2, .ai-bg h3, .ai-bg p, .ai-bg span, .ai-bg div, .ai-bg button { text-shadow: none; }
  .welcome-title, .how-works-title, .round-name, .how-step-title { overflow-wrap: anywhere; }
  .welcome-title em { filter: none; }
  .bot-bubble { max-width: min(100%, 720px); white-space: normal; }
  .bot-text { min-width: 0; overflow-wrap: anywhere; }
  .round-card { isolation: isolate; min-width: 0; }
  .round-card > * { position: relative; z-index: 1; }
  .round-meta { flex-wrap: wrap; line-height: 1.4; }
  .stat-item { min-width: 0; }
  .stat-item span { overflow-wrap: anywhere; }

  .how-works-grid { gap: 16px; }
  .how-step { padding: 0; min-width: 0; }
  .how-step:not(:last-child)::after { display: none; }
  .how-step-inner { min-height: 188px; display: flex; flex-direction: column; justify-content: flex-start; }
  .how-step-top { align-items: flex-start; justify-content: space-between; gap: 10px; }
  .how-step-icon { flex: 0 0 auto; }
  .how-step-number { flex: 0 0 auto; white-space: nowrap; }
  .how-step-desc { margin: 0; }

  .card, .round-card, .how-step-inner, .q-box, .mcq-option, .dropzone, .ai-modal { min-width: 0; }
  .profile-name, .round-info-title, .round-info-sub, .chip, .tag { overflow-wrap: anywhere; }
  .q-header { row-gap: 14px; }
  .q-header > div { min-width: 0; }
  .q-section, .q-box, .feedback-text, .mcq-text { overflow-wrap: anywhere; }
  .ai-textarea { min-width: 0; }
  .btn { white-space: normal; text-align: center; line-height: 1.25; }
  .btn-primary { color: #fff; text-shadow: none; }
  .theme-dark .btn-primary { color: #fff; }

  @media(max-width: 1024px){
    .how-works-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .how-step-inner { min-height: 172px; }
  }

  @media(max-width: 820px){
    .ai-header-inner { align-items: center; }
    .ai-logo-group { gap: 9px; flex: 1 1 auto; }
    .ai-header-actions { flex: 0 0 auto; }
    .welcome-hero { max-width: 100%; }
    .round-grid { grid-template-columns: 1fr; }
    .how-works-grid { grid-template-columns: 1fr; gap: 12px; }
    .how-step-inner { min-height: 0; }
    .two-col { gap: 16px; }
  }

  @media(max-width: 560px){
    .ai-header-inner { gap: 8px; }
    .ai-logo-group img { height: 28px !important; max-width: 96px; }
    .ai-header-title { font-size: 13px; letter-spacing: .01em; }
    .ai-header-actions { gap: 6px; }
    .ai-avatar { width: 34px; height: 34px; }
    .ai-user-chip { padding: 4px; }
    .welcome-hero { padding-top: 12px; }
    .welcome-title { line-height: 1.04; margin-bottom: 12px; }
    .welcome-sub { line-height: 1.55; }
    .stats-row { justify-content: stretch; }
    .stat-item { width: 100%; justify-content: center; }
    .how-works-head { display: block; }
    .how-works-title { line-height: 1.18; }
    .how-step-top { align-items: center; }
    .dropzone { padding: 30px 16px; }
    .card-header { align-items: flex-start; }
    .q-header { display: block; }
    .q-header > div { margin-bottom: 12px; }
    .q-header > div:last-child { margin-bottom: 0; }
    .timer-chip { width: 100%; justify-content: center; }
    .mcq-option { padding: 12px; }
    .ai-modal { padding: 26px 18px; border-radius: 22px; }
  }

`;


export default function InterviewPage() {
  const navigate = useNavigate();
  function cryptoRandom() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
    return `sess-${Math.random().toString(36).slice(2)}`;
  }

  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [sessionId] = useState<string>(() => cryptoRandom());
  const [parsed, setParsed] = useState<any>(null);
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(0);
  const [round, setRound] = useState<number | null>(null);
  const [qNo, setQNo] = useState<number>(0);
  const [totalQ, setTotalQ] = useState<number>(0);
  const [question, setQuestion] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [timePerQuestion, setTimePerQuestion] = useState(30);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [showAnalyzing, setShowAnalyzing] = useState(false);
  const [showAnalysisMessage, setShowAnalysisMessage] = useState(false);

  const getTimeLimit = (r: number) => ({ 1: 30, 2: 120, 3: 300 }[r] || 30);
  const getQuestionCount = (r: number) => ({ 1: 12, 2: 5, 3: 3 }[r] || 5);

  const isNonTechnical = (skills: string[], domains: string[]) => {
    const kw = ['hr','human resource','marketing','sales','finance','accounting','business','management','admin','operations','customer service','support'];
    return [...(skills||[]),...(domains||[])].join(' ').toLowerCase().split(' ').some(w => kw.includes(w));
  };

  const [roundType, setRoundType] = useState<string>("");
  const [roundDescription, setRoundDescription] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const answerRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timerStopped, setTimerStopped] = useState(false);
  const questionRef = useRef<HTMLDivElement>(null);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [codeOutput, setCodeOutput] = useState<string>("");
  const [codeError, setCodeError] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("python");
  const [isFrontendQuestion] = useState<boolean>(false);
  const [lineCount, setLineCount] = useState<number>(1);
  const [charCount, setCharCount] = useState<number>(0);
  const [modal, setModal] = useState<{show:boolean;type:'success'|'error';title:string;message:string;onClose?:()=>void}|null>(null);
  const [typingText, setTypingText] = useState("");
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [analysisTypingText, setAnalysisTypingText] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<{score:number;feedback:string;userAnswer:string}|null>(null);
  const [nextQuestionData, setNextQuestionData] = useState<any>(null);
  const [canStartInterview, setCanStartInterview] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("aiInterviewTheme");
    return savedTheme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    localStorage.setItem("aiInterviewTheme", theme);
  }, [theme]);

  // Helper function to handle next question
  const handleNextQuestion = useCallback(async (feedbackData: any) => {
    if (!user || !question) return;
    
    const answer = feedbackData?.userAnswer || currentFeedback?.userAnswer || "No answer provided";
    
    try {
      const data = await api.submitAnswer({
        userId: user.id,
        sessionId,
        domain: parsed?.domains?.[0] || "General",
        question,
        answer,
      });
      
      if (data.advancedTo) {
        setQuestion("");
        const roundNames: { [key: number]: string } = { 1: "Skill Check", 2: "Scenario Round", 3: "Coding Challenge" };
        setModal({
          show: true, 
          type: 'success', 
          title: `Round ${data.doneRound} - ${roundNames[data.doneRound]} Completed`, 
          message: `Pass Criteria: ${data.doneRound === 1 ? '70%' : data.doneRound === 2 ? '60%' : '70%'}\n\nStatus: Qualified\n\nCongratulations!\nYou have met the eligibility criteria and can proceed to the next round.\n\nClick Continue to move forward.`,
          onClose: () => {
            if (data.nextQuestion) {
              setRound(data.advancedTo);
              setQNo(1);
              setTotalQ(data.total_questions || getQuestionCount(data.advancedTo));
              setQuestion(data.nextQuestion);
              setAskedQuestions([data.nextQuestion]);
              const roundTypes = { 1: "Skill Check", 2: "Scenario Round", 3: "Coding Challenge" };
              const roundDescriptions = { 1: "Technical MCQs to evaluate your fundamentals (Need 70% to qualify)", 2: "Real-world scenario questions based on your experience (Need 60% to qualify, min 300 chars)", 3: "Coding challenge with input/output format and constraints (Need 70% to qualify)" };
              setRoundType(roundTypes[data.advancedTo as keyof typeof roundTypes] || "");
              setRoundDescription(roundDescriptions[data.advancedTo as keyof typeof roundDescriptions] || "");
              setTimePerQuestion(getTimeLimit(data.advancedTo));
              setTimeLeft(getTimeLimit(data.advancedTo));
              setTimerStopped(false);
              setSelectedOption("");
              if (answerRef.current) answerRef.current.value = "";
              setStatus("");
            }
          }
        });
        return;
      }
      
      if (data.doneRound && data.passed === false) {
        setQuestion("");
        const roundNames: { [key: number]: string } = { 1: "Skill Check", 2: "Scenario Round", 3: "Coding Challenge" };
        const requiredScores: { [key: number]: string } = { 1: "70%", 2: "60%", 3: "70%" };
        setModal({
          show: true, 
          type: 'success', 
          title: `Round ${data.doneRound} - ${roundNames[data.doneRound]} Completed`, 
          message: `Your Score: ${data.average}%\nMinimum Required: ${requiredScores[data.doneRound]}\n\nRound completed! You can continue to the next round to complete the full assessment.\n\nClick Continue to proceed.`,
          onClose: () => {
            if (data.nextQuestion) {
              setRound(data.advancedTo || data.doneRound + 1);
              setQNo(1);
              setTotalQ(data.total_questions || getQuestionCount(data.advancedTo || data.doneRound + 1));
              setQuestion(data.nextQuestion);
              setAskedQuestions([data.nextQuestion]);
              const roundTypes = { 1: "Skill Check", 2: "Scenario Round", 3: "Coding Challenge" };
              const roundDescriptions = { 1: "Technical MCQs to evaluate your fundamentals (Need 70% to qualify)", 2: "Real-world scenario questions based on your experience (Need 60% to qualify, min 300 chars)", 3: "Coding challenge with input/output format and constraints (Need 70% to qualify)" };
              const nextRound = data.advancedTo || data.doneRound + 1;
              setRoundType(roundTypes[nextRound as keyof typeof roundTypes] || "");
              setRoundDescription(roundDescriptions[nextRound as keyof typeof roundDescriptions] || "");
              setTimePerQuestion(getTimeLimit(nextRound));
              setTimeLeft(getTimeLimit(nextRound));
              setTimerStopped(false);
              setSelectedOption("");
              if (answerRef.current) answerRef.current.value = "";
              setStatus("");
            }
          }
        });
        return;
      }
      
      if (data.question) {
        setQNo(data.question_no);
        setQuestion(data.question);
        setAskedQuestions(prev => [...prev, data.question]);
        setTimePerQuestion(30);
        setTimeLeft(30);
        setTimerStopped(true);
        setSelectedOption("");
        if (answerRef.current) answerRef.current.value = "";
      }
    } catch (err) {
      console.error("Failed to get next question:", err);
    }
  }, [user, question, sessionId, parsed, currentFeedback, getQuestionCount]);

  const aiMessages = ["Welcome to AI Interview! 🤖","Analyzing your resume...","Generating personalized questions...","Evaluating your responses in real-time...","Ready to start your assessment?"];

  useEffect(()=>{const stored=localStorage.getItem("user");if(!stored)handleLogin();else setUser(JSON.parse(stored));},[]);

  useEffect(()=>{
    if(!showWelcome)return;
    const msg=aiMessages[currentMessageIndex];let i=0;setTypingText("");
    const t=setInterval(()=>{if(i<msg.length){setTypingText(msg.slice(0,i+1));i++;}else{clearInterval(t);setTimeout(()=>setCurrentMessageIndex(p=>(p+1)%aiMessages.length),2000);}},80);
    return()=>clearInterval(t);
  },[currentMessageIndex,showWelcome]);

   const handleLogin = async () => {

    const stored = localStorage.getItem("profileData") || localStorage.getItem("user") || localStorage.getItem("whatsappNumber") || localStorage.getItem("mobileNumber") || "";

    console.log("Stored profile data:", stored);

    let userId = "";
    let phone = "";
    let name = "";

    if (stored) {
      const parsedData = JSON.parse(stored);
      console.log("Parsed profile data:", parsedData);
      userId = localStorage.getItem("userId") || "";
      phone = parsedData.mobileNumber || parsedData.whatsappNumber || parsedData ||"";
      name = parsedData.userFirstName && parsedData.userLastName 
        ? `${parsedData.userFirstName} ${parsedData.userLastName}` 
        : parsedData.userName || "";
    }

    if (!userId && !phone) {
        Modal.warning({ title: "Login Required", content: "Please login to continue." });
        sessionStorage.setItem("redirectPath","/interview")
       window.location.href = "/whatsapplogin";
      return;
    }

    setLoading(true);
    try {
      let profileData = null;
      
      if (userId) {
        const profileResponse = await axiosInstance.get(`${BASE_URL}/user-service/getProfile/${userId}`);
        if (profileResponse) {
          profileData = await profileResponse.data;
          console.log('Profile data:', profileData);
          
          if (profileData) {
            phone = profileData.mobileNumber || profileData.whatsappNumber || phone;
            name = profileData.userName || `${profileData.firstName || ''} ${" "} ${profileData.lastName || ''}`|| name;
            
            if (!profileData.mobileVerified && !profileData.whatsappVerified) {
              Modal.warning({ title: "Verification Required", content: "Please verify your mobile or WhatsApp number." });
              setLoading(false);
              return;
            }
          }
        }
      }

      if (!phone) {
        Modal.warning({ title: "Profile Incomplete", content: "Phone number not found. Please update your profile." });
        setLoading(false);
        return;
      }

      if (!name) {
        Modal.warning({ title: "Profile Incomplete", content: "Name not found. Please complete your profile." });
        setLoading(false);
        return;
      }

      const data = await api.login({ phone_number: phone, name });
      console.log('Login response:', data);

      if (data.user && data.user.id) {
        localStorage.setItem("user", JSON.stringify(data.user));
        Modal.success({ title: "Welcome", content: `Welcome, ${data.user.name}!` });
       window.location.href = "/interview";
      } else if (data.error) {
        Modal.error({ title: "Login Failed", content: data.error });
      } else {
        Modal.error({ title: "Login Failed", content: "Please try again." });
      }
    } catch (err) {
      console.error("Login error:", err);
      Modal.error({ title: "Error", content: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };



  useEffect(()=>{
    if(question&&timeLeft>0&&!timerStopped){const t=setTimeout(()=>setTimeLeft(x=>x-1),1000);return()=>clearTimeout(t);}
    else if(question&&timeLeft===0&&!loading&&!submitting&&!showFeedback&&!timerStopped){setTimerStopped(true);submitAnswer();}
  },[timeLeft,question,loading,submitting,showFeedback,round,selectedOption,timerStopped]);

  async function onUploadResume() {
    if (!user || !selectedFile) return;

    // Validate file type
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(fileExtension)) {
      setModal({
        show: true, 
        type: 'error', 
        title: 'Invalid File Type', 
        message: `Please upload a valid resume file.\n\nSupported formats: PDF, DOC, DOCX, TXT\nYour file: ${fileExtension.toUpperCase()}`
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", user.id);

    setShowUpload(false);
    setShowAnalyzing(true);
    setStatus("AI Bot analyzing resume...");

    try {
      const data = await api.uploadResume(formData);
      console.log("Upload response:", data);
      setShowAnalyzing(false);

      if (data?.success && data?.parsed) {
        setParsed(data.parsed);
        // Extract years of experience
        const years = data.parsed.experience || data.parsed.years_of_experience || 0;
        setYearsOfExperience(years);
        setShowAnalyzing(false);
        
        // Show typing animation for analysis complete message
        setShowAnalysisMessage(true);
        const message = "AI analysis complete! We've extracted your details from the resume. Please review and confirm.";
        let charIndex = 0;
        setAnalysisTypingText("");
        
        const typingInterval = setInterval(() => {
          if (charIndex < message.length) {
            setAnalysisTypingText(message.slice(0, charIndex + 1));
            charIndex++;
          } else {
            clearInterval(typingInterval);
            // Show success modal after typing completes
            setTimeout(() => {
              setShowAnalysisMessage(false);
              setModal({show: true, type: 'success', title: 'Resume Analysis Complete', message: 'Resume processed successfully. Please review your extracted profile details.'});
            }, 1500);
          }
        }, 50);
        
      } else if (data?.error) {
        setShowAnalyzing(false);
        setShowUpload(true);
        
        let errorMessage = "Please upload a proper resume file.";
        
        if (data.error.includes("format") || data.error.includes("type")) {
          errorMessage = "Invalid file format. Please upload a PDF, DOC, DOCX, or TXT file.";
        } else if (data.error.includes("size")) {
          errorMessage = "File too large. Please upload a file smaller than 10MB.";
        } else if (data.error.includes("corrupt") || data.error.includes("damaged")) {
          errorMessage = "File appears to be corrupted. Please try uploading a different file.";
        } else if (data.error.includes("content") || data.error.includes("text")) {
          errorMessage = "Unable to extract text from resume. Please ensure your file contains readable text.";
        }
        
        setModal({
          show: true,
          type: 'error',
          title: 'Resume Upload Failed',
          message: errorMessage
        });
        setParsed(null);
      } else {
        setShowAnalyzing(false);
        setShowUpload(true);
        setModal({
          show: true,
          type: 'error',
          title: 'Resume Processing Failed',
          message: 'Resume upload completed but could not extract profile data. Please try uploading a different resume file.'
        });
        setParsed(null);
      }
    } catch (error) {
      setShowAnalyzing(false);
      setShowUpload(true);
      
      let errorMessage = "Please upload a proper resume file.";
      
      if (error instanceof Error) {
        if (error.message.includes("network") || error.message.includes("fetch")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Upload timed out. Please try again with a smaller file.";
        }
      }
      
      setModal({
        show: true,
        type: 'error',
        title: 'Upload Error',
        message: errorMessage
      });
      setParsed(null);
      console.error("Upload error:", error);
    }
  }

  async function startInterview() {
    if (!user) {
      alert("Please log in to start the interview");
      window.location.href = "/login";
      return;
    }

    if (!parsed) {
      alert("Please upload and parse your resume first");
      return; 
    }

    if (!canStartInterview) {
      alert("Maximum attempt limit reached. You have used all your attempts.");
      return;
    }

    if (round === 3) {
      alert("You have already completed all 3 rounds");
      return;
    }

    setLoading(true);
    setStatus("Generating questions...");
    setAskedQuestions([]);

    try {
      const data = await api.startInterview({
        userId: user.id,
        sessionId,
        skills: parsed?.skills || [],
        domain: parsed?.domains?.[0] || "General",
        askedQuestions: askedQuestions,
        yearsOfExperience: yearsOfExperience,
      });

      setLoading(false);

      if (data.error) throw new Error(data.error);

      if (data.finished) {
        
        setStatus("success:" + data.message);
        return;
      }

      if (data.resume) {
        setStatus("Continuing Round " + data.round);

        const contData = await api.startInterview({ 
          userId: user.id, 
          sessionId,
          yearsOfExperience: yearsOfExperience 
        });

        if (contData.question) {
          setRound(contData.round);
          setQNo(contData.question_no);
          setTotalQ(contData.total_questions || getQuestionCount(contData.round));
          setQuestion(contData.question);
          setAskedQuestions(prev => [...prev, contData.question]);
          
          // Set correct round info
          const roundTypes = { 1: "Skill Check", 2: "Scenario Round", 3: "Coding Challenge" };
          const roundDescriptions = {
            1: "Technical MCQs to evaluate your fundamentals",
            2: "Real-world scenario questions based on your experience (Need 60% to qualify)",
            3: "Coding challenge with input/output format and constraints"
          };
          
          setRoundType(roundTypes[contData.round as keyof typeof roundTypes] || "");
          setRoundDescription(roundDescriptions[contData.round as keyof typeof roundDescriptions] || "");
          
          const timeLimit = getTimeLimit(contData.round);
          setTimePerQuestion(timeLimit);
          setTimeLeft(timeLimit);
          setTimerStopped(false);
          setStatus("");
        } else {
          setStatus("warning:Could not fetch question");
        }
        return;
      }

      setRound(data.round);
      setQNo(data.question_no);
      setTotalQ(data.total_questions || getQuestionCount(data.round));
      setQuestion(data.question);
      setAskedQuestions([data.question]); // Reset for new round
      
      // Set correct round type and description
      const roundTypes = {
        1: "Skill Check",
        2: "Scenario Round", 
        3: "Coding Challenge"
      };
      const roundDescriptions = {
        1: "Technical MCQs to evaluate your fundamentals (Need 70% to qualify)",
        2: "Real-world scenario questions based on your experience (Need 60% to qualify, min 300 chars)",
        3: "Coding challenge with input/output format and constraints (Need 70% to qualify)"
      };
      
      setRoundType(roundTypes[data.round as keyof typeof roundTypes] || "");
      setRoundDescription(roundDescriptions[data.round as keyof typeof roundDescriptions] || "");
      

      
      const timeLimit = getTimeLimit(data.round);
      setTimePerQuestion(timeLimit);
      setTimeLeft(timeLimit);
      setTimerStopped(false);
      setStatus("");

      setTimeout(() => {
        questionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    } catch (err: any) {
      console.error("Start interview error:", err);
      setLoading(false);
      alert("Failed to start interview: " + err.message);
    }
  }

  function getTestInput(lang: string) {
    // Keep this lightweight. The backend/code-runner should execute the user's code first;
    // this test input is only a safe fallback and should not force a specific function name.
    switch (lang) {
      case 'python':
        return '';
      case 'javascript':
        return '';
      case 'java':
        return '';
      case 'c':
        return '';
      case 'cpp':
        return '';
      default:
        return '';
    }
  }

  function getPlaceholder(lang: string) {
    switch (lang) {
      case 'python': return 'def function_name():\n    # Write your code here\n    pass';
      case 'java': return 'public static int maxSubarraySum(int[] arr) {\n    // Write your code here\n    return 0;\n}';
      default: return 'def function_name():\n    # Write your code here\n    pass';
    }
  }

  const blockClipboardAction = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setModal({
      show: true,
      type: 'error',
      title: 'Copy/Paste Disabled',
      message: 'Copy and paste are disabled for scenario and coding rounds. Please type your own answer.'
    });
  };

  async function runCode() {
    const code = answerRef.current?.value?.trim() || '';

    if (!code) {
      setCodeError('Please write your code before running.');
      setCodeOutput('');
      return;
    }

    setLoading(true);
    setCodeOutput('');
    setCodeError('');

    const postdata = {
      code,
      language: selectedLanguage,
      testInput: getTestInput(selectedLanguage)
    };

    try {
      const result = await api.codeRunner(postdata);
      console.log('Code Runner Response:', result);

      const output = result?.output || result?.stdout || result?.data?.output || '';
      const errorText = result?.error || result?.stderr || result?.message || result?.data?.error || '';
      const isSuccess = result?.success === true || (!errorText && Boolean(output));

      if (isSuccess) {
        setCodeOutput(output || 'Code executed successfully.');
        setCodeError('');
      } else {
        setCodeOutput('');
        setCodeError(errorText || 'Code execution failed. Please check your syntax and selected language.');
      }
    } catch (error: any) {
      console.error('Code execution error:', error);

      let errorMessage = 'Code runner is not responding. Please check the backend code-runner API and try again.';

      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message?.toLowerCase().includes('timeout')) {
        errorMessage = 'Code execution timed out. Please check for infinite loops or heavy logic.';
      } else if (error?.message?.includes('Failed to fetch') || error?.message?.includes('Network')) {
        errorMessage = 'Network/API error. Please verify the code-runner endpoint is running.';
      } else if (error?.message) {
        errorMessage = error.message;
      }

      setCodeError(errorMessage);
      setCodeOutput('');
    } finally {
      setLoading(false);
    }
  }

  // Show language change notification
  useEffect(() => {
    if (round === 3 && selectedLanguage) {
      const message = `Code will be executed in ${selectedLanguage.toUpperCase()}. Make sure your syntax matches the selected language.`;
      console.log(message);
    }
  }, [selectedLanguage, round]);

  async function submitAnswer() {
    if (!user || !question || submitting) return;

    const isTimeExpired = timeLeft <= 0 || timerStopped;
    let ans = "";
    
    console.log(`Submitting answer - Round: ${round}, TimeLeft: ${timeLeft}, TimerStopped: ${timerStopped}, IsTimeExpired: ${isTimeExpired}`);
    
    if (round === 1) {
      ans = selectedOption || "No option selected";
    } else {
      ans = answerRef.current?.value?.trim() || "No answer provided";
      
      // Round 2 validation - minimum 300 characters (only if time hasn't expired)
      if (round === 2 && ans.length < 300 && !isTimeExpired) {
        alert("Answer too short. Minimum 300 characters required. Current: " + ans.length);
        return;
      }
    }

    // Stop timer immediately when user submits
    setTimerStopped(true);
    
    setSubmitting(true);
    setLoading(true);
    setStatus("Evaluating your answer...");

    try {
      const data = await api.submitAnswer({
        userId: user.id,
        sessionId,
        domain: parsed?.domains?.[0] || "General",
        question,
        answer: ans,
        language: isFrontendQuestion ? selectedLanguage : undefined,
        askedQuestions: askedQuestions,
        currentRound: round,
        currentQuestionNo: qNo,
        totalQuestions: totalQ,
        isTimeExpired: isTimeExpired
      });

      setLoading(false);

      if (data.error) {
        // Ignore character validation errors for Round 1 (MCQ) or when time expired
        if (data.error.includes("Answer too short") && round === 1) {
          console.log("Ignoring character validation for Round 1 MCQ");
          // Don't return, continue processing the response
        } else if (data.error.includes("Answer too short") && round === 2 && timeLeft > 0) {
          alert(data.error);
          setSubmitting(false);
          setTimerStopped(false);
          return;
        } else if (data.error === "Interview not started") {
          console.log("⚠️ Interview state not found, attempting to recover...");
          try {
            const restartData = await api.startInterview({
              userId: user.id,
              sessionId,
              skills: parsed?.skills || [],
              domain: parsed?.domains?.[0] || "General",
              yearsOfExperience: yearsOfExperience
            });
            if (restartData.question) {
              setRound(restartData.round);
              setQNo(restartData.question_no);
              setTotalQ(restartData.total_questions);
              setQuestion(restartData.question);
              setTimeLeft(restartData.timeLimit || getTimeLimit(restartData.round));
              setTimePerQuestion(restartData.timeLimit || getTimeLimit(restartData.round));
              return;
            }
          } catch (restartErr) {
            console.error("Failed to restart interview:", restartErr);
          }
          alert("Interview session lost. Please refresh the page to start a new interview.");
          setQuestion("");
          setRound(null);
          return;
        }
        throw new Error(data.error);
      }

      // Check for round completion first (advancedTo or doneRound)
      if (data.advancedTo) {
        setStatus("success:Passed Round " + data.doneRound);
        setQuestion("");
        
        const roundNames: { [key: number]: string } = { 1: "Skill Check", 2: "Scenario Round", 3: "Coding Challenge" };
        
        setModal({
          show: true, 
          type: 'success', 
          title: `Round ${data.doneRound} - ${roundNames[data.doneRound]} Completed`, 
          message: `Pass Criteria: ${data.doneRound === 1 ? '70%' : data.doneRound === 2 ? '60%' : '70%'}\n\nStatus: Qualified\n\nCongratulations!\nYou have met the eligibility criteria and can proceed to the next round.\n\nClick Continue to move forward.`,
          onClose: () => {
            if (data.nextQuestion) {
              setRound(data.advancedTo);
              setQNo(1);
              setTotalQ(data.total_questions || getQuestionCount(data.advancedTo));
              setQuestion(data.nextQuestion);
              setAskedQuestions([data.nextQuestion]);
              
              const roundTypes = {
                1: "Skill Check",
                2: "Scenario Round", 
                3: "Coding Challenge"
              };
              const roundDescriptions = {
                1: "Technical MCQs to evaluate your fundamentals (Need 70% to qualify)",
                2: "Real-world scenario questions based on your experience (Need 60% to qualify, min 300 chars)",
                3: "Coding challenge with input/output format and constraints (Need 70% to qualify)"
              };
              
              setRoundType(roundTypes[data.advancedTo as keyof typeof roundTypes] || "");
              setRoundDescription(roundDescriptions[data.advancedTo as keyof typeof roundDescriptions] || "");
              
              const timeLimit = getTimeLimit(data.advancedTo);
              setTimePerQuestion(timeLimit);
              setTimeLeft(timeLimit);
              setTimerStopped(false);
              setSelectedOption("");
              if (answerRef.current) answerRef.current.value = "";
              setStatus("");
            }
          }
        });
        return;
      }

      if (data.doneRound && data.passed === false) {
        const roundNames: { [key: number]: string } = { 1: "Skill Check", 2: "Scenario Round", 3: "Coding Challenge" };
        const requiredScores: { [key: number]: string } = { 1: "70%", 2: "60%", 3: "70%" };
        
        setModal({
          show: true, 
          type: 'success', 
          title: `Round ${data.doneRound} - ${roundNames[data.doneRound]} Completed`, 
          message: `Your Score: ${data.average}%\nMinimum Required: ${requiredScores[data.doneRound]}\n\nRound completed! You can continue to the next round to complete the full assessment.\n\nClick Continue to proceed.`,
          onClose: () => {
            if (data.nextQuestion) {
              setRound(data.advancedTo || data.doneRound + 1);
              setQNo(1);
              setTotalQ(data.total_questions || getQuestionCount(data.advancedTo || data.doneRound + 1));
              setQuestion(data.nextQuestion);
              setAskedQuestions([data.nextQuestion]);
              
              const roundTypes = {
                1: "Skill Check",
                2: "Scenario Round", 
                3: "Coding Challenge"
              };
              const roundDescriptions = {
                1: "Technical MCQs to evaluate your fundamentals (Need 70% to qualify)",
                2: "Real-world scenario questions based on your experience (Need 60% to qualify, min 300 chars)",
                3: "Coding challenge with input/output format and constraints (Need 70% to qualify)"
              };
              
              const nextRound = data.advancedTo || data.doneRound + 1;
              setRoundType(roundTypes[nextRound as keyof typeof roundTypes] || "");
              setRoundDescription(roundDescriptions[nextRound as keyof typeof roundDescriptions] || "");
              
              const timeLimit = getTimeLimit(nextRound);
              setTimePerQuestion(timeLimit);
              setTimeLeft(timeLimit);
              setTimerStopped(false);
              setSelectedOption("");
              if (answerRef.current) answerRef.current.value = "";
              setStatus("");
            }
          }
        });
        return;
      }

      if (data.finished) {
        if (data.doneRound === 3) {
          setModal({
            show: true, 
            type: 'success', 
            title: 'Assessment Completed', 
            message: `Your Final Score: ${data.average}%\nStatus: All rounds passed\n\nCongratulations!\nYou have successfully completed the entire technical assessment.`
          });
        }
        setStatus("success:" + data.message);
        setQuestion("");
        return;
      }

      // Only show individual feedback if not a round completion
      if (data.last) {
        setCurrentFeedback({
          score: Number(data.last.score || 0),
          feedback: data.last.feedback || "",
          userAnswer: ans
        });
        setShowFeedback(true);
        if (data.question) {
          setNextQuestionData(data);
        }
        return;
      }

      if (data.question) {
        const expectedCount = getQuestionCount(data.round);
        
        // Only validate if we're staying in the same round
        if (data.round === round && data.question_no > expectedCount) {
          console.log(`Backend sent question ${data.question_no} but round ${data.round} should only have ${expectedCount} questions. Forcing round completion.`);
          
          // Simulate round completion and advance to next round
          if (data.round < 3) {
            setQuestion("");
            alert(`🎉 Round ${data.round} Completed!\n\nAll ${expectedCount} questions answered.\n\nRefresh the page to start Round ${data.round + 1}.`);
          } else {
            setQuestion("");
            alert(`🎉 Assessment Completed!\n\nAll rounds finished successfully!`);
          }
          return;
        }
        
        setRound(data.round);
        setQNo(data.question_no);
        setTotalQ(data.total_questions || expectedCount);
        setQuestion(data.question);
        setAskedQuestions(prev => [...prev, data.question]);
        const timeLimit = getTimeLimit(data.round);
        setTimePerQuestion(timeLimit);
        setTimeLeft(timeLimit);
        setTimerStopped(false);
        setSelectedOption("");
        if (answerRef.current) answerRef.current.value = "";
        setCodeOutput("");
        setCodeError("");
        setStatus("");
      }
    } catch (err: any) {
      console.error("Submit answer error:", err);
      setLoading(false);
      
      // Show proper error modal instead of alert
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (err.message?.includes("Failed to fetch")) {
        errorMessage = "Network connection error. Please check your internet connection and try again.";
      } else if (err.message?.includes("timeout")) {
        errorMessage = "Request timed out. Please try submitting your answer again.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setModal({
        show: true,
        type: 'error',
        title: 'Submission Error',
        message: errorMessage
      });
    } finally {
      setSubmitting(false);
    }
  }

  if(!user) return null;

  const roundColors = ["","#0ea576","#6366f1","#f59e0b"];
  const languageOptions = [{value:"python",label:"Python"},{value:"javascript",label:"JavaScript"},{value:"java",label:"Java"},{value:"c",label:"C"},{value:"cpp",label:"C++"}];

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className={`ai-bg theme-${theme}`}>

        {/* ─── Modal ─── */}
        {modal?.show && (
          <div className="ai-modal-overlay">
            <div className="ai-modal">
              <div className="ai-modal-icon">{modal.type==='success'?'🎉':'⚠️'}</div>
              <h3 className="ai-modal-title">{modal.title}</h3>
              <p className="ai-modal-msg">{modal.message}</p>
              <button className="btn btn-primary btn-primary-lg" style={{marginTop:24,width:'100%'}} onClick={()=>{setModal(null);modal.onClose?.();}}>
                {modal.type==='success'?'Continue →':'Got it'}
              </button>
            </div>
          </div>
        )}

        {/* ─── Header ─── */}
        <header className="ai-header">
          <div className="ai-header-inner">
            <div
              className="ai-logo-group"
              onClick={() => navigate("/jobspremierleague")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate("/jobspremierleague");
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <img src={logo} alt="AskOxy" style={{height:32,objectFit:'contain',width:'auto'}} />
              <div className="ai-logo-divider" />
              <div>
                <div className="ai-header-title">AI INTERVIEW</div>
                <div className="ai-header-sub">Technical Assessment Platform</div>
              </div>
            </div>
            <div className="ai-header-actions">
              <button
                type="button"
                className="theme-toggle"
                onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
                aria-label="Toggle light and dark theme"
              >
                {theme === "light" ? "🌙" : "☀️"}
                <span>{theme === "light" ? "Dark" : "Light"}</span>
              </button>
              {user && (
                <div className="ai-user-chip">
                  <div className="ai-avatar">{user.name.charAt(0).toUpperCase()}</div>
                  <span className="ai-user-name">{user.name}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="ai-main">

          {/* ══════════════ WELCOME SCREEN ══════════════ */}
          {showWelcome && (
            <div style={{paddingTop:0}}>
              <div className="welcome-hero">
                <div className="welcome-badge">AI-Powered Assessment</div>
                <div className="bot-bubble">
                  <div className="bot-icon">🤖</div>
                  <span className="bot-text">{typingText}<span className="bot-cursor"/></span>
                </div>
                <h1 className="welcome-title">
                  Ace Your Next<br/><em>Tech Interview</em>
                </h1>
                <p className="welcome-sub">
                  Upload your resume and take a personalized AI interview designed around your skills, experience, and target role.
                </p>

                <div className="primary-cta-wrap">
                  <button className="btn btn-primary btn-primary-lg" onClick={()=>{setShowWelcome(false);setShowUpload(true);}}>
                    Start AI Interview →
                  </button>
                </div>
                <div className="primary-cta-note">Upload resume → AI interview → Instant feedback</div>

                <div className="stats-row">
                  <div className="stat-item"><div className="stat-dot"/><span>45–60 min total</span></div>
                  <div className="stat-item"><div className="stat-dot"/><span>20 questions</span></div>
                  <div className="stat-item"><div className="stat-dot" style={{background:'#6366f1'}}/><span>Instant AI feedback</span></div>
                </div>

                <div className="round-grid">
                  {[
                    {n:1,name:"Skill Check",qs:"12 questions",time:"30s each",desc:"Technical MCQs to evaluate your core fundamentals and role-based knowledge.",color:"#0ea576"},
                    {n:2,name:"Scenario Round",qs:"5 questions",time:"120s each",desc:"Real-world problem solving to assess your thinking, judgement, and communication.",color:"#6366f1"},
                    {n:3,name:"Coding Challenge",qs:"3 questions",time:"300s each",desc:"Hands-on coding problems with execution, constraints, and validation.",color:"#f59e0b"},
                  ].map(r=>(
                    <div key={r.n} className="round-card">
                      <div className="round-num" style={{background:r.color}}>{r.n}</div>
                      <div className="round-name">{r.name}</div>
                      <div className="round-meta"><span>{r.qs}</span><span>·</span><span>{r.time}</span></div>
                      <p className="round-desc">{r.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="how-works">
                  <div className="how-works-head">
                    <div>
                      <div className="how-works-kicker">✨ How It Works</div>
                      <h2 className="how-works-title">How It Works</h2>
                      <p className="how-works-sub">A simple guided flow that turns your resume into a personalized interview and gives clear performance feedback.</p>
                    </div>
                  </div>
                  <div className="how-works-grid">
                    {[
                      { icon: "📄", step: "Step 01", title: "Upload Resume", desc: "Upload your resume and let AI analyze your technical profile, skills, and experience." },
                      { icon: "🧠", step: "Step 02", title: "Personalized Questions", desc: "AI generates interview questions tailored to your profile, role, and selected skill areas." },
                      { icon: "🎯", step: "Step 03", title: "Timed Interview Rounds", desc: "Complete skill checks, scenario questions, and coding rounds within real interview time limits." },
                      { icon: "📊", step: "Step 04", title: "Instant Feedback", desc: "Get scores, skill insights, and improvement suggestions to improve your interview readiness." },
                    ].map((item) => (
                      <div className="how-step" key={item.title}>
                        <div className="how-step-inner">
                          <div className="how-step-top">
                            <div className="how-step-icon">{item.icon}</div>
                            <span className="how-step-number">{item.step}</span>
                          </div>
                          <div className="how-step-title">{item.title}</div>
                          <p className="how-step-desc">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════ UPLOAD SCREEN ══════════════ */}
          {showUpload && (
            <div style={{maxWidth:480,margin:'20px auto'}}>
              <div className="card">
                <div className="card-header">
                  <button className="btn btn-outline" style={{padding:'5px 12px',fontSize:13}} onClick={()=>{setShowUpload(false);setShowWelcome(true);}}>← Back</button>
                  <div>
                    <div style={{fontSize:15,fontWeight:600,color:'var(--text-primary)'}}>Upload Resume</div>
                    <div style={{fontSize:12,color:'var(--text-muted)'}}>AI will analyse your skills and experience</div>
                  </div>
                </div>
                <div className="card-body">
                  <div
                    className={`dropzone${dragOver?' active':''}`}
                    onClick={()=>fileInputRef.current?.click()}
                    onDragOver={e=>{e.preventDefault();setDragOver(true);}}
                    onDragLeave={()=>setDragOver(false)}
                    onDrop={e=>{e.preventDefault();setDragOver(false);const f=e.dataTransfer.files[0];if(f)setSelectedFile(f);}}
                  >
                    <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{display:'none'}} onChange={e=>setSelectedFile(e.target.files?.[0]||null)}/>
                    {selectedFile ? (
                      <>
                        <div style={{fontSize:36,marginBottom:8}}>📄</div>
                        <div className="dropzone-title">{selectedFile.name}</div>
                        <div className="dropzone-sub" style={{color:'var(--brand)'}}>✓ Selected — click to change</div>
                      </>
                    ):(
                      <>
                        <div style={{fontSize:36,marginBottom:8}}>📁</div>
                        <div className="dropzone-title">Drop your resume here</div>
                        <div className="dropzone-sub">or click to browse — PDF, DOC, DOCX, TXT</div>
                      </>
                    )}
                  </div>
                  <button className="btn btn-primary" style={{width:'100%',marginTop:16}} disabled={!selectedFile} onClick={onUploadResume}>
                    {selectedFile ? 'Analyse Resume →' : 'Select a file to continue'}
                  </button>
                  <div style={{marginTop:16,padding:'12px 14px',background:'var(--brand-light)',borderRadius:'var(--radius-md)',border:'1px solid var(--brand-mid)'}}>
                    <div style={{fontSize:12,fontWeight:600,color:'var(--brand-dark)',marginBottom:6}}>What happens next</div>
                    <div style={{fontSize:12,color:'var(--text-secondary)',lineHeight:1.6}}>
                      • AI extracts your technical skills & experience<br/>
                      • Personalised questions are generated for each round<br/>
                      • You get instant scored feedback on every answer
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════ ANALYSING SCREEN ══════════════ */}
          {(showAnalyzing||showAnalysisMessage) && (
            <div className="analyzing-wrap">
              <div className="analyzing-card">
                <div className="spin-bot">🤖</div>
                {showAnalyzing ? (
                  <>
                    <div style={{fontSize:17,fontWeight:600,marginBottom:6}}>Analysing your resume</div>
                    <div style={{fontSize:13,color:'var(--text-muted)',marginBottom:20}}>AI is processing your profile data…</div>
                    <div className="progress-steps">
                      {['Parsing document structure','Extracting technical skills','Generating question matrix'].map((s,i)=>(
                        <div key={i} className="progress-step">
                          <div className="step-dot" style={{animationDelay:`${i*0.3}s`}}/>
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ):(
                  <>
                    <div style={{fontSize:17,fontWeight:600,marginBottom:12}}>Analysis complete!</div>
                    <div style={{background:'var(--brand-light)',border:'1px solid var(--brand-mid)',borderRadius:'var(--radius-md)',padding:'14px 16px'}}>
                      <p style={{fontSize:13,color:'var(--brand-dark)',lineHeight:1.65}}>
                        {analysisTypingText}<span className="bot-cursor"/>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ══════════════ PRE-INTERVIEW (Resume + Start) ══════════════ */}
          {!showWelcome&&!showUpload&&!showAnalyzing&&!showAnalysisMessage&&!question && (
            <div className="two-col" style={{alignItems:'start'}}>

              {/* Left — Resume panel */}
              <div className="card">
                {!parsed ? (
                  <>
                    <div className="card-header">
                      <div style={{width:32,height:32,borderRadius:8,background:'var(--brand-light)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>📄</div>
                      <div>
                        <div style={{fontSize:14,fontWeight:600}}>Upload Resume</div>
                        <div style={{fontSize:12,color:'var(--text-muted)'}}>Required to start</div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="dropzone" onClick={()=>fileInputRef.current?.click()}>
                        <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{display:'none'}} onChange={e=>setSelectedFile(e.target.files?.[0]||null)}/>
                        <div style={{fontSize:32,marginBottom:8}}>📁</div>
                        {selectedFile?(<><div className="dropzone-title">{selectedFile.name}</div><div className="dropzone-sub" style={{color:'var(--brand)'}}>✓ Click to change</div></>):(<><div className="dropzone-title">Click to upload</div><div className="dropzone-sub">PDF, DOC, DOCX, TXT</div></>)}
                      </div>
                      <div style={{display:'flex',gap:8,marginTop:14}}>
                        <button className="btn btn-primary" style={{flex:1}} disabled={loading||!selectedFile} onClick={onUploadResume}>
                          {loading?<><svg className="spinner" width={14} height={14} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity=".25"/><path fill="currentColor" opacity=".75" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/></svg> Parsing…</>:'Analyse Resume'}
                        </button>
                        {selectedFile&&<button className="btn btn-outline" onClick={()=>{setSelectedFile(null);if(fileInputRef.current)fileInputRef.current.value="";}}>Clear</button>}
                      </div>
                    </div>
                  </>
                ):(
                  <>
                    <div className="profile-header">
                      <div className="profile-avatar">{parsed.name?parsed.name.charAt(0).toUpperCase():'C'}</div>
                      <div>
                        <div className="profile-name">{parsed.name||'Candidate'}</div>
                        <div className="profile-badge">✓ Profile Verified</div>
                      </div>
                    </div>
                    <div className="card-body">
                      {parsed.skills?.length>0&&(<><div className="section-label">Technical Skills</div><div style={{marginBottom:16}}>{parsed.skills.map((s:string,i:number)=><span key={i} className="tag tag-skill">{s}</span>)}</div></>)}
                      {yearsOfExperience>0&&(<><div className="section-label">Experience</div><div style={{marginBottom:16}}><span className="tag tag-exp">⏱ {yearsOfExperience} {yearsOfExperience===1?'year':'years'}</span></div></>)}
                      {parsed.domains?.length>0&&(<><div className="section-label">Domains</div><div style={{marginBottom:16}}>{parsed.domains.map((d:string,i:number)=><span key={i} className="tag tag-domain">{d}</span>)}</div></>)}
                      <div style={{paddingTop:12,borderTop:'1px solid var(--border)'}}>
                        <button className="btn btn-outline" style={{width:'100%'}} onClick={()=>{setParsed(null);setSelectedFile(null);setStatus("");if(fileInputRef.current)fileInputRef.current.value="";}}>
                          ✏️ Edit Resume
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Right — Assessment structure + start */}
              <div className="card">
                <div className="card-header">
                  <div style={{width:32,height:32,borderRadius:8,background:'var(--accent-soft)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🎯</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:600}}>Assessment Structure</div>
                    <div style={{fontSize:12,color:'var(--text-muted)'}}>3 rounds · 20 questions</div>
                  </div>
                </div>
                <div className="card-body">
                  <div>
                    {[
                      {n:1,name:"Skill Check",sub:"Multiple choice questions",qs:"12 questions",time:"30s each",color:"#0ea576"},
                      {n:2,name:"Scenario Round",sub:"Real-world problem solving",qs:"5 questions",time:"120s each",color:"#6366f1"},
                      {n:3,name:parsed&&isNonTechnical(parsed.skills,parsed.domains)?"Professional Assessment":"Coding Challenge",sub:parsed&&isNonTechnical(parsed.skills,parsed.domains)?"Domain-specific questions":"Live coding challenges",qs:"3 questions",time:"300s each",color:"#f59e0b"},
                    ].map(r=>(
                      <div key={r.n} className="round-row">
                        <div className="round-num-badge" style={{background:r.color}}>{r.n}</div>
                        <div style={{flex:1}}>
                          <div className="round-info-title">{r.name}</div>
                          <div className="round-info-sub">{r.sub}</div>
                          <div className="round-chips">
                            <div className="chip">{r.qs}</div>
                            <div className="chip">⏱ {r.time}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{paddingTop:16,borderTop:'1px solid var(--border)',marginTop:8}}>
                    {parsed&&user&&<div style={{marginBottom:12}}><AttemptStatus userId={user.id} onStatusChange={c=>setCanStartInterview(c)}/></div>}
                    {parsed ? (
                      <button className="btn btn-primary btn-primary-lg" style={{width:'100%'}} disabled={loading||round===3||!canStartInterview} onClick={startInterview}>
                        {loading?(<><svg className="spinner" width={16} height={16} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity=".25"/><path fill="currentColor" opacity=".75" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/></svg>Starting…</>):!canStartInterview?'Attempt Limit Reached':round===3?'Assessment Complete ✓':'Start Assessment →'}
                      </button>
                    ):(
                      <div style={{textAlign:'center',fontSize:13,color:'var(--text-muted)',padding:'12px',background:'var(--surface-3)',borderRadius:'var(--radius-md)'}}>
                        Upload your resume to begin
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════ QUESTION VIEW ══════════════ */}
          {question && (
            <div style={{maxWidth:800,margin:'0 auto'}} ref={questionRef}>
              <div className="card">

                {/* Header */}
                <div className="q-header">
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <div className="q-round-badge" style={{background:roundColors[round||1]}}>{round}</div>
                    <div>
                      <div style={{fontSize:15,fontWeight:600,color:'var(--text-primary)'}}>Round {round}: {roundType}</div>
                      <div style={{fontSize:12,color:'var(--text-muted)',marginTop:2}}>Question {qNo} of {totalQ}</div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div style={{flex:1,maxWidth:160,display:'flex',flexDirection:'column',gap:4,margin:'0 16px'}}>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar-fill" style={{width:`${(qNo/totalQ)*100}%`}}/>
                    </div>
                    <div style={{fontSize:11,color:'var(--text-muted)',textAlign:'center'}}>{qNo}/{totalQ}</div>
                  </div>

                  <div className={`timer-chip ${timerStopped?'timer-stopped':timeLeft<=10?'timer-urgent':'timer-normal'}`}>
                    <span>⏱</span>
                    <span>{timerStopped?'Done':timeLeft+'s'}</span>
                  </div>
                </div>

                {roundDescription&&<div style={{padding:'8px 20px',fontSize:12,color:'var(--text-secondary)',background:'var(--surface-3)',borderBottom:'1px solid var(--border)'}}>{roundDescription}</div>}

                <div style={{padding:'20px'}}>

                  {/* Question content */}
                  <div style={{marginBottom:16}}>
                    {round===3 ? (
                      <div className="q-box">
                        {parsed?.skills?.length>0&&<div style={{marginBottom:12,fontSize:12,color:'var(--text-secondary)'}}>💡 Based on: {parsed.skills.slice(0,3).join(', ')}</div>}
                        {(() => {
                          const lines=question.split('\n');let cs='';let sc:string[]=[];const secs:{type:string;content:string[]}[]=[];
                          lines.forEach(line=>{const t=line.trim().replace(/\*+/g,'').trim();if(!t)return;
                            if(t.toLowerCase().startsWith('problem')||t.toLowerCase().startsWith('given')){if(cs)secs.push({type:cs,content:sc});cs='problem';sc=[t.replace(/^(problem|given)[:\s]*/i,'')];}
                            else if(t.toLowerCase().startsWith('function')){if(cs)secs.push({type:cs,content:sc});cs='function';sc=[t];}
                            else if(t.toLowerCase().startsWith('example')){if(cs)secs.push({type:cs,content:sc});cs='example';sc=[];}
                            else if(t.toLowerCase().startsWith('constraint')){if(cs)secs.push({type:cs,content:sc});cs='constraints';sc=[t.replace(/^constraints?[:\s]*/i,'')];}
                            else if(t.toLowerCase().startsWith('notes')){if(cs)secs.push({type:cs,content:sc});cs='notes';sc=[t.replace(/^notes?[:\s]*/i,'')];}
                            else sc.push(t.replace(/^[-#\s]+/,''));
                          });
                          if(cs)secs.push({type:cs,content:sc});
                          return secs.map((s,i)=>{
                            if(s.type==='problem')return<div key={i} className="q-section q-section-problem"><div className="q-section-label" style={{color:'#1d4ed8'}}>Problem</div>{s.content.map((l,j)=><p key={j} style={{fontSize:14,color:'var(--text-primary)',lineHeight:1.65}}>{l}</p>)}</div>;
                            if(s.type==='function')return<div key={i} className="q-section q-section-function"><div className="q-section-label" style={{color:'var(--brand-dark)'}}>Function Signature</div><code style={{fontSize:13,fontFamily:'monospace',color:'var(--text-primary)'}}>{s.content[0]}</code></div>;
                            if(s.type==='example')return<div key={i} className="q-section q-section-example"><div className="q-section-label" style={{color:'#7c3aed'}}>Examples</div>{s.content.map((l,j)=><div key={j} style={{fontSize:13,fontFamily:'monospace',color:l.toLowerCase().includes('input')?'#16a34a':l.toLowerCase().includes('output')?'#1d4ed8':'var(--text-primary)'}}>{l}</div>)}</div>;
                            if(s.type==='constraints')return<div key={i} className="q-section q-section-constraint"><div className="q-section-label" style={{color:'#b45309'}}>Constraints</div>{s.content.map((l,j)=><p key={j} style={{fontSize:13,color:'var(--text-primary)'}}>• {l}</p>)}</div>;
                            return null;
                          });
                        })()}
                      </div>
                    ):round===2?(
                      <div className="q-box">
                        {question.split('\n').map((line,i)=>{const t=line.trim();if(!t)return null;
                          if(t.startsWith('**Situation:**'))return<div key={i} className="q-section q-section-function"><div className="q-section-label" style={{color:'var(--brand-dark)'}}>Situation</div><p style={{fontSize:14,color:'var(--text-primary)',lineHeight:1.65}}>{t.replace('**Situation:**','').trim()}</p></div>;
                          if(t.startsWith('**Question:**'))return<div key={i} className="q-section" style={{background:'#f5f3ff',borderLeft:'4px solid #8b5cf6'}}><div className="q-section-label" style={{color:'#7c3aed'}}>Question</div><p style={{fontSize:14,color:'var(--text-primary)',lineHeight:1.65,fontWeight:500}}>{t.replace('**Question:**','').trim()}</p></div>;
                          return<p key={i} style={{fontSize:14,color:'var(--text-secondary)',marginBottom:6}}>{t}</p>;
                        })}
                      </div>
                    ):(
                      <h3 style={{fontSize:15,fontWeight:500,color:'var(--text-primary)',lineHeight:1.65}}>
                        {question.split(/[ABCD]\)/)[0].replace('Question:','').trim()}
                      </h3>
                    )}
                  </div>

                  {/* MCQ Options */}
                  {round===1&&question.includes("A)")&&(
                    <div style={{marginBottom:16}}>
                      {["A","B","C","D"].map(opt=>{
                        const text=question.split(`${opt})`)[1]?.split(/[\n\r]|[BCD]\)/)[0]?.trim();
                        if(!text)return null;
                        return(
                          <label
                            key={opt}
                            className={`mcq-option${selectedOption===opt?' selected':''}${showFeedback && selectedOption===opt && currentFeedback ? (currentFeedback.score >= 5 ? ' correct' : ' incorrect') : ''}${showFeedback?' disabled':''}`}
                            onClick={()=>!showFeedback&&setSelectedOption(opt)}
                          >
                            <div className="mcq-radio">{selectedOption===opt&&<div className="mcq-dot"/>}</div>
                            <span className="mcq-letter">{opt}.</span>
                            <span className="mcq-text">{text}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Text / Code Answer */}
                  {round!==1&&(
                    <div style={{marginBottom:16}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                        <div style={{fontSize:13,fontWeight:600,color:'var(--text-primary)'}}>{round===3?'Your Code':'Your Answer'}</div>
                        {round===3?<span style={{fontSize:12,color:'var(--text-muted)'}}>Lines: {lineCount}</span>:
                         round===2?<span className={`char-counter ${charCount>=300?'char-ok':'char-warn'}`}>{charCount}/300 min chars</span>:null}
                      </div>
                      <textarea
                        ref={answerRef}
                        disabled={timeLeft<=0||showFeedback}
                        className={`ai-textarea${round===3?' mono':''}`}
                        placeholder={timeLeft<=0?"Time expired — submitted automatically":round===3?getPlaceholder(selectedLanguage):round===2?"Describe your approach:\n\n1. Immediate action:\n2. Reasoning:\n3. Expected outcome:":"Enter your answer…"}
                        style={{minHeight:round===3?280:round===2?220:140}}
                        onChange={e=>{
                          if(round===3){setLineCount(e.target.value.split('\n').length);}
                          if(round===2){setCharCount(e.target.value.length);}
                        }}
                        onPaste={blockClipboardAction}
                        onCopy={blockClipboardAction}
                        onCut={blockClipboardAction}
                        onDrop={(e)=>e.preventDefault()}
                        autoComplete="off"
                        spellCheck={false}
                      />
                      <div className="clipboard-note">Copy, paste, cut and drag-drop are disabled for this round.</div>

                      {/* Code runner */}
                      {round===3&&(
                        <div style={{marginTop:12}}>
                          <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap',marginBottom:10}}>
                            <select value={selectedLanguage} onChange={e=>setSelectedLanguage(e.target.value)} disabled={showFeedback} style={{padding:'6px 10px',fontSize:12,borderRadius:'var(--radius-sm)',border:'1px solid var(--border)',background:'var(--surface)',color:'var(--text-primary)',cursor:'pointer'}}>
                              {languageOptions.map(l=><option key={l.value} value={l.value}>{l.label}</option>)}
                            </select>
                            <button className="btn btn-green" disabled={loading||!answerRef.current?.value.trim()||showFeedback} onClick={runCode}>
                              {loading?'Running…':'▶ Run Code'}
                            </button>
                            <span style={{fontSize:12,color:'var(--text-muted)'}}>Compiled & executed with error checking</span>
                          </div>
                          {codeOutput&&<div className="code-output"><div style={{color:'#6b7280',marginBottom:6,fontSize:11}}>OUTPUT</div>{codeOutput}</div>}
                          {codeError&&<div className="code-error" style={{marginTop:8}}><div style={{fontWeight:600,marginBottom:4}}>RUN ERROR</div>{codeError}</div>}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Feedback */}
                  {showFeedback&&currentFeedback&&(
                    <div className="feedback-box" style={{marginBottom:16}}>
                      <div className="feedback-label">AI Feedback</div>
                      <p className="feedback-text">{currentFeedback.feedback}</p>
                      <div style={{display:'flex',justifyContent:'flex-end',marginTop:12}}>
                        <button className="btn btn-primary" onClick={()=>{
                          if(nextQuestionData?.question){setRound(nextQuestionData.round);setQNo(nextQuestionData.question_no);setTotalQ(nextQuestionData.total_questions||getQuestionCount(nextQuestionData.round));setQuestion(nextQuestionData.question);setAskedQuestions(p=>[...p,nextQuestionData.question]);setTimePerQuestion(getTimeLimit(nextQuestionData.round));setTimeLeft(getTimeLimit(nextQuestionData.round));setSelectedOption("");if(answerRef.current)answerRef.current.value="";setCodeOutput("");setCodeError("");setNextQuestionData(null);}
                          setShowFeedback(false);setCurrentFeedback(null);setTimerStopped(false);setCharCount(0);
                        }}>Next Question →</button>
                      </div>
                    </div>
                  )}

                  {/* Submit */}
                  <div style={{paddingTop:14,borderTop:'1px solid var(--border)'}}>
                    {!showFeedback?(
                      <button className="btn btn-primary btn-primary-lg" style={{width:'100%'}} disabled={loading||submitting||(round===1&&!selectedOption)} onClick={submitAnswer}>
                        {(loading||submitting)?(<><svg className="spinner" width={16} height={16} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity=".25"/><path fill="currentColor" opacity=".75" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/></svg>{submitting?'Submitting…':'Evaluating…'}</>):timeLeft<=0?'Submit Answer (Time Expired)':'Submit Answer →'}
                      </button>
                    ):(
                      <div style={{textAlign:'center',fontSize:13,color:'var(--text-muted)'}}>Click "Next Question" above to continue</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
}