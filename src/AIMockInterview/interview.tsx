import React, { useRef, useState, useEffect, useCallback } from "react";
import { api } from "./lib/api";
import { ExamImageType } from "./lib/examImageTypes";
import { Modal } from "antd";
import axiosInstance from "../utils/axiosInstance";
import BASE_URL from "../Config";
import { CameraVerification } from "./components/CameraVerification";
import { SpinnerIcon } from "./components/SpinnerIcon";
import { InterviewHeader } from "./components/InterviewHeader";
import { ExamProctorCamera } from "./components/ExamProctorCamera";
import Round4 from "./Round4";
import Round5 from "./Round5";

const FLOW_STATE_KEY = "aiMockInterviewFlowState";

/* ─── EMBEDDED CSS — Enterprise SaaS Design System ─── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --brand:#2563EB;--brand-hover:#1D4ED8;--brand-subtle:#EFF6FF;--brand-border:#BFDBFE;
  --success:#059669;--success-subtle:#ECFDF5;--success-border:#A7F3D0;
  --warning:#D97706;--warning-subtle:#FFFBEB;--warning-border:#FDE68A;
  --danger:#DC2626;--danger-subtle:#FEF2F2;--danger-border:#FECACA;
  --info:#0891B2;--info-subtle:#ECFEFF;--info-border:#A5F3FC;
  --bg:#F8FAFC;--surface-0:#FFFFFF;--surface-1:#F1F5F9;--surface-2:#E2E8F0;
  --border-1:#E2E8F0;--border-2:#CBD5E1;--border-3:#94A3B8;
  --text-1:#0F172A;--text-2:#334155;--text-3:#64748B;--text-4:#94A3B8;
  --r-xs:4px;--r-sm:6px;--r-md:8px;--r-lg:12px;--r-xl:16px;--r-2xl:20px;--r-full:9999px;
  --shadow-xs:0 1px 2px rgba(15,23,42,.04);
  --shadow-sm:0 1px 3px rgba(15,23,42,.06),0 1px 2px rgba(15,23,42,.04);
  --shadow-md:0 4px 6px rgba(15,23,42,.05),0 2px 4px rgba(15,23,42,.04);
  --shadow-lg:0 10px 15px rgba(15,23,42,.06),0 4px 6px rgba(15,23,42,.04);
  --font-head:'Plus Jakarta Sans',sans-serif;
  --font-body:'Plus Jakarta Sans',sans-serif;
  --font-mono:'JetBrains Mono',monospace;
}

.theme-dark {
  --bg:#0B0F19;--surface-0:#111827;--surface-1:#1A2235;--surface-2:#1F2A3D;
  --border-1:#1E2D45;--border-2:#253552;--border-3:#344769;
  --text-1:#F1F5F9;--text-2:#CBD5E1;--text-3:#94A3B8;--text-4:#64748B;
  --brand-subtle:#172554;--brand-border:#1E40AF;
  --success-subtle:#052E16;--success-border:#14532D;
  --warning-subtle:#1C0A00;--warning-border:#451A03;
  --danger-subtle:#1C0505;--danger-border:#450A0A;
  --info-subtle:#042F2E;--info-border:#134E4A;
  --shadow-xs:0 1px 2px rgba(0,0,0,.2);
  --shadow-sm:0 1px 3px rgba(0,0,0,.25),0 1px 2px rgba(0,0,0,.2);
  --shadow-md:0 4px 6px rgba(0,0,0,.3);
  --shadow-lg:0 10px 15px rgba(0,0,0,.4);
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.ai-bg {
  min-height:100vh;background:var(--bg);font-family:var(--font-body);
  color:var(--text-1);line-height:1.6;-webkit-font-smoothing:antialiased;
}

.btn {
  display:inline-flex;align-items:center;justify-content:center;gap:6px;
  font-family:var(--font-body);font-size:13.5px;font-weight:600;
  border:1px solid transparent;cursor:pointer;border-radius:var(--r-md);
  padding:8px 16px;transition:all .15s ease;white-space:nowrap;line-height:1;letter-spacing:-.01em;
}
.btn:disabled{opacity:.45;cursor:not-allowed;pointer-events:none;}
.btn:focus-visible{outline:2px solid var(--brand);outline-offset:2px;}
.btn-primary{background:var(--brand);color:#fff;border-color:var(--brand);}
.btn-primary:not(:disabled):hover{background:var(--brand-hover);border-color:var(--brand-hover);}
.btn-primary-lg{padding:10px 20px;font-size:14px;border-radius:var(--r-lg);}
.btn-outline{background:var(--surface-0);color:var(--text-2);border-color:var(--border-2);}
.btn-outline:not(:disabled):hover{border-color:var(--brand);color:var(--brand);background:var(--brand-subtle);}
.btn-ghost{background:transparent;color:var(--text-3);border-color:transparent;padding:6px 10px;}
.btn-ghost:hover{background:var(--surface-1);color:var(--text-1);}
.btn-success{background:var(--success);color:#fff;border-color:var(--success);}
.btn-success:not(:disabled):hover{background:#047857;border-color:#047857;}
.btn-icon{padding:7px;border-radius:var(--r-md);background:var(--surface-1);border-color:var(--border-1);color:var(--text-3);font-size:16px;line-height:1;}
.btn-icon:hover{background:var(--surface-2);color:var(--text-1);}

.ai-main{max-width:1080px;margin:0 auto;padding:28px 20px 80px;}

.card{background:var(--surface-0);border:1px solid var(--border-1);border-radius:var(--r-xl);overflow:hidden;}
.card-header{display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid var(--border-1);background:var(--surface-0);}
.card-body{padding:18px;}

.two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start;}
@media(max-width:720px){.two-col{grid-template-columns:1fr;}}

.section-label{font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--text-4);margin-bottom:8px;}
.tag{display:inline-flex;align-items:center;padding:3px 10px;border-radius:var(--r-full);font-size:12px;font-weight:500;margin:2px 3px 2px 0;}
.tag-skill{background:var(--brand-subtle);color:var(--brand);border:1px solid var(--brand-border);}
.tag-domain{background:var(--info-subtle);color:var(--info);border:1px solid var(--info-border);}
.tag-exp{background:var(--success-subtle);color:var(--success);border:1px solid var(--success-border);}
.chip{display:inline-flex;align-items:center;padding:2px 8px;border-radius:var(--r-xs);font-size:11px;font-weight:500;background:var(--surface-1);color:var(--text-3);border:1px solid var(--border-1);}

.dropzone{border:1.5px dashed var(--border-2);border-radius:var(--r-lg);padding:32px 24px;text-align:center;cursor:pointer;transition:all .2s;background:var(--surface-1);}
.dropzone:hover,.dropzone.active{border-color:var(--brand);background:var(--brand-subtle);}
.dropzone-icon{font-size:28px;margin-bottom:10px;line-height:1;}
.dropzone-title{font-size:14px;font-weight:600;color:var(--text-1);margin-bottom:3px;}
.dropzone-sub{font-size:12.5px;color:var(--text-3);}

.info-box{background:var(--brand-subtle);border:1px solid var(--brand-border);border-radius:var(--r-lg);padding:12px 16px;font-size:13px;color:var(--text-2);line-height:1.6;}
.info-box-title{font-weight:700;color:var(--brand);font-size:11px;margin-bottom:4px;text-transform:uppercase;letter-spacing:.06em;}

.progress-bar-wrap{width:100%;height:4px;background:var(--surface-2);border-radius:var(--r-full);overflow:hidden;}
.progress-bar-fill{height:100%;background:var(--brand);border-radius:var(--r-full);transition:width .4s ease;}

.welcome-hero{max-width:1040px;margin:0 auto;}
.welcome-badge{display:flex;align-items:center;gap:6px;width:fit-content;padding:4px 12px;background:var(--brand-subtle);color:var(--brand);border:1px solid var(--brand-border);border-radius:var(--r-full);font-size:11.5px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;margin-bottom:24px;}
.welcome-badge::before{content:'';width:5px;height:5px;background:var(--brand);border-radius:50%;}

.ai-typing-bubble{display:flex;align-items:center;gap:10px;width:fit-content;background:var(--surface-0);border:1px solid var(--border-1);border-radius:var(--r-xl);padding:10px 16px;margin-bottom:24px;box-shadow:var(--shadow-xs);}
.ai-typing-text{font-size:13.5px;color:var(--text-2);font-family:var(--font-mono);}
.cursor-blink{display:inline-block;width:2px;height:13px;background:var(--brand);margin-left:2px;vertical-align:middle;animation:blink .9s step-end infinite;}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}

.welcome-title{font-family:var(--font-head);font-size:clamp(32px,4.5vw,52px);font-weight:700;line-height:1.1;color:var(--text-1);letter-spacing:-1.2px;margin-bottom:14px;}
.welcome-title em{font-style:normal;color:var(--brand);}
.welcome-sub{font-size:16px;color:var(--text-3);line-height:1.7;max-width:520px;margin-bottom:28px;}

.cta-group{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;}
.cta-note{font-size:12px;color:var(--text-4);margin-bottom:36px;}

.stats-strip{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:40px;}
.stat-pill{display:flex;align-items:center;gap:7px;padding:6px 12px;background:var(--surface-0);border:1px solid var(--border-1);border-radius:var(--r-full);font-size:12.5px;color:var(--text-2);font-weight:500;}
.stat-dot{width:6px;height:6px;border-radius:50%;}

.round-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(186px,1fr));gap:12px;margin-bottom:48px;}
.round-card{background:var(--surface-0);border:1px solid var(--border-1);border-radius:var(--r-xl);padding:18px;transition:border-color .15s,box-shadow .15s;position:relative;overflow:hidden;}
.round-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--round-color,var(--brand));}
.round-card:hover{border-color:var(--border-2);box-shadow:var(--shadow-sm);}
.round-icon-badge{width:32px;height:32px;border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;font-family:var(--font-head);font-weight:700;font-size:13px;color:#fff;margin-bottom:12px;}
.round-card-name{font-family:var(--font-head);font-size:14px;font-weight:700;color:var(--text-1);margin-bottom:5px;}
.round-card-meta{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px;}
.round-card-meta span{font-size:11px;font-weight:500;color:var(--text-3);background:var(--surface-1);padding:2px 7px;border-radius:var(--r-xs);}
.round-card-desc{font-size:12px;color:var(--text-3);line-height:1.55;}

.how-works{background:var(--surface-0);border:1px solid var(--border-1);border-radius:var(--r-2xl);padding:32px;}
.how-works-head{margin-bottom:24px;}
.how-kicker{font-size:11px;font-weight:700;letter-spacing:.1em;color:var(--brand);text-transform:uppercase;margin-bottom:6px;}
.how-title{font-family:var(--font-head);font-size:22px;font-weight:700;color:var(--text-1);letter-spacing:-.4px;margin-bottom:6px;}
.how-sub{font-size:13.5px;color:var(--text-3);line-height:1.6;max-width:480px;}
.how-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:16px;}
.how-step{padding:16px;background:var(--surface-1);border:1px solid var(--border-1);border-radius:var(--r-lg);}
.how-step-num{font-family:var(--font-mono);font-size:11px;font-weight:500;color:var(--brand);background:var(--brand-subtle);border:1px solid var(--brand-border);padding:2px 8px;border-radius:var(--r-xs);margin-bottom:10px;display:inline-block;}
.how-step-title{font-family:var(--font-head);font-size:13.5px;font-weight:700;color:var(--text-1);margin-bottom:5px;}
.how-step-desc{font-size:12px;color:var(--text-3);line-height:1.55;}

.round-row{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border-1);}
.round-row:last-child{border-bottom:none;}
.round-num-badge{width:26px;height:26px;flex-shrink:0;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;font-family:var(--font-head);font-weight:700;font-size:11px;color:#fff;margin-top:1px;}
.round-info-title{font-size:13px;font-weight:600;color:var(--text-1);margin-bottom:2px;}
.round-info-sub{font-size:11.5px;color:var(--text-3);margin-bottom:5px;}
.round-chips{display:flex;gap:4px;flex-wrap:wrap;}

.profile-header{display:flex;align-items:center;gap:12px;padding:16px 18px;border-bottom:1px solid var(--border-1);}
.profile-avatar-lg{width:40px;height:40px;border-radius:50%;background:var(--brand);display:flex;align-items:center;justify-content:center;font-family:var(--font-head);font-weight:700;font-size:16px;color:#fff;flex-shrink:0;}
.profile-name{font-family:var(--font-head);font-size:15px;font-weight:700;color:var(--text-1);}
.profile-verified{font-size:11.5px;color:var(--success);margin-top:2px;}

.analyzing-wrap{display:flex;justify-content:center;padding:48px 16px;}
.analyzing-card{background:var(--surface-0);border:1px solid var(--border-1);border-radius:var(--r-2xl);padding:40px 32px;text-align:center;max-width:440px;width:100%;box-shadow:var(--shadow-md);}
.spin-bot{font-size:36px;margin-bottom:16px;animation:float 2.2s ease-in-out infinite;}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
.progress-steps{margin-top:8px;text-align:left;}
.progress-step{display:flex;align-items:center;gap:10px;padding:9px 0;font-size:13px;color:var(--text-2);border-bottom:1px solid var(--border-1);}
.progress-step:last-child{border-bottom:none;}
.progress-step-dot{width:7px;height:7px;border-radius:50%;background:var(--brand);flex-shrink:0;animation:pulse 1.4s ease-in-out infinite;}
@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:.6}}

.camera-complete-wrap{max-width:400px;margin:32px auto;}
.camera-complete-header{text-align:center;margin-bottom:18px;}
.camera-complete-preview{border-radius:var(--r-xl);overflow:hidden;border:1px solid var(--border-1);margin-bottom:14px;}
.camera-complete-actions{display:flex;flex-direction:column;gap:8px;}

.ai-modal-overlay{position:fixed;inset:0;z-index:1000;background:rgba(15,23,42,.5);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .18s ease;}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.ai-modal{background:var(--surface-0);border:1px solid var(--border-1);border-radius:var(--r-2xl);padding:28px 26px;max-width:420px;width:100%;text-align:center;box-shadow:var(--shadow-lg);animation:slideUp .22s ease;}
@keyframes slideUp{from{transform:translateY(12px);opacity:0}to{transform:translateY(0);opacity:1}}
.ai-modal-icon{font-size:32px;margin-bottom:14px;}
.ai-modal-title{font-family:var(--font-head);font-size:18px;font-weight:700;color:var(--text-1);margin-bottom:8px;}
.ai-modal-msg{font-size:13.5px;color:var(--text-3);line-height:1.65;white-space:pre-line;}

.q-header{display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid var(--border-1);background:var(--surface-0);flex-wrap:wrap;}
.q-round-badge{width:32px;height:32px;border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;font-family:var(--font-head);font-weight:700;font-size:13px;color:#fff;flex-shrink:0;}
.round-desc-bar{background:var(--brand-subtle);border-bottom:1px solid var(--brand-border);padding:7px 20px;font-size:12px;color:var(--brand);font-weight:500;}

.timer-chip{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:var(--r-md);font-family:var(--font-mono);font-size:12.5px;font-weight:500;border:1px solid;}
.timer-normal{background:var(--surface-1);border-color:var(--border-1);color:var(--text-2);}
.timer-urgent{background:var(--danger-subtle);border-color:var(--danger-border);color:var(--danger);animation:urgentPulse 1s ease infinite;}
@keyframes urgentPulse{0%,100%{opacity:1}50%{opacity:.7}}
.timer-stopped{background:var(--surface-2);border-color:var(--border-1);color:var(--text-4);}

.q-box{background:var(--surface-1);border:1px solid var(--border-1);border-radius:var(--r-lg);padding:16px 18px;overflow:hidden;}
.q-section{padding:10px 0;border-bottom:1px solid var(--border-1);}
.q-section:last-child{border-bottom:none;padding-bottom:0;}
.q-section:first-child{padding-top:0;}
.q-section-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;margin-bottom:6px;}

.mcq-option{display:flex;align-items:center;gap:10px;padding:10px 13px;border:1px solid var(--border-1);border-radius:var(--r-lg);cursor:pointer;margin-bottom:7px;transition:all .15s;background:var(--surface-0);user-select:none;}
.mcq-option:hover:not(.disabled){border-color:var(--brand);background:var(--brand-subtle);}
.mcq-option.selected{border-color:var(--brand);background:var(--brand-subtle);}
.mcq-option.correct{border-color:var(--success);background:var(--success-subtle);}
.mcq-option.incorrect{border-color:var(--danger);background:var(--danger-subtle);}
.mcq-option.disabled{cursor:not-allowed;}
.mcq-radio{width:16px;height:16px;border-radius:50%;border:1.5px solid var(--border-2);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:border-color .15s;}
.mcq-option.selected .mcq-radio{border-color:var(--brand);}
.mcq-dot{width:7px;height:7px;border-radius:50%;background:var(--brand);}
.mcq-letter{font-family:var(--font-mono);font-size:11.5px;font-weight:500;color:var(--text-3);width:14px;flex-shrink:0;}
.mcq-text{font-size:13.5px;color:var(--text-1);line-height:1.5;}

.ai-textarea{width:100%;background:var(--surface-0);border:1px solid var(--border-2);border-radius:var(--r-lg);padding:12px 14px;font-family:var(--font-body);font-size:13.5px;color:var(--text-1);resize:vertical;transition:border-color .15s,box-shadow .15s;line-height:1.6;}
.ai-textarea:focus{outline:none;border-color:var(--brand);box-shadow:0 0 0 3px rgba(37,99,235,.1);}
.ai-textarea:disabled{background:var(--surface-1);color:var(--text-4);cursor:not-allowed;}
.ai-textarea.mono{font-family:var(--font-mono);font-size:13px;}

.char-counter{font-family:var(--font-mono);font-size:12px;font-weight:500;}
.char-ok{color:var(--success);}
.char-warn{color:var(--warning);}

.lang-select{padding:7px 11px;background:var(--surface-0);color:var(--text-1);border:1px solid var(--border-2);border-radius:var(--r-md);font-family:var(--font-body);font-size:13px;cursor:pointer;}
.lang-select:focus{outline:none;border-color:var(--brand);}

.code-terminal{border:1px solid var(--border-1);border-radius:var(--r-lg);overflow:hidden;}
.code-terminal-bar{display:flex;align-items:center;justify-content:space-between;padding:7px 12px;background:#161B22;border-bottom:1px solid #21262D;}
.code-terminal-dots{display:flex;gap:5px;}
.code-terminal-dot{width:9px;height:9px;border-radius:50%;}
.code-terminal-label{font-family:var(--font-mono);font-size:11px;font-weight:500;}
.code-terminal-body{background:#0D1117;padding:12px 14px;}
.code-label{font-family:var(--font-mono);font-size:10px;font-weight:600;letter-spacing:.1em;color:#6E7681;margin-bottom:5px;}
.code-output-text{font-family:var(--font-mono);font-size:12.5px;color:#3FB950;white-space:pre-wrap;}
.code-error-text{font-family:var(--font-mono);font-size:12.5px;color:#F85149;white-space:pre-wrap;}

.feedback-box{background:var(--success-subtle);border:1px solid var(--success-border);border-radius:var(--r-lg);padding:14px 16px;margin-bottom:14px;}
.feedback-label{font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--success);margin-bottom:6px;}
.feedback-text{font-size:13.5px;color:var(--text-2);line-height:1.65;}

.attempt-card{border:1px solid var(--border-1);border-radius:var(--r-lg);overflow:hidden;margin-bottom:8px;background:var(--surface-0);transition:border-color .15s;}
.attempt-card:hover{border-color:var(--border-2);}
.attempt-card-header{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;cursor:pointer;transition:background .15s;}
.attempt-card-header:hover{background:var(--surface-1);}
.spinner{animation:spin .7s linear infinite;}
@keyframes spin{to{transform:rotate(360deg)}}

.ai-header{position:sticky;top:0;z-index:100;background:var(--surface-0);border-bottom:1px solid var(--border-1);}
.ai-header-inner{max-width:1080px;margin:0 auto;padding:0 20px;height:52px;display:flex;align-items:center;justify-content:space-between;gap:16px;}
.ai-logo-group{display:flex;align-items:center;gap:10px;}
.ai-logo-divider{width:1px;height:20px;background:var(--border-1);}
.ai-header-title{font-family:var(--font-head);font-size:13.5px;font-weight:700;color:var(--text-1);line-height:1.2;}
.ai-header-sub{font-size:11px;color:var(--text-3);line-height:1.2;}
.ai-header-actions{display:flex;align-items:center;gap:8px;}
.theme-toggle{display:inline-flex;align-items:center;gap:5px;padding:5px 10px;background:var(--surface-1);border:1px solid var(--border-1);border-radius:var(--r-md);font-size:12px;font-weight:500;color:var(--text-2);cursor:pointer;transition:all .15s;}
.theme-toggle:hover{background:var(--surface-2);color:var(--text-1);}
.ai-user-chip{display:flex;align-items:center;gap:7px;padding:4px 10px 4px 4px;background:var(--surface-1);border:1px solid var(--border-1);border-radius:var(--r-full);}
.ai-avatar{width:24px;height:24px;border-radius:50%;background:var(--brand);display:flex;align-items:center;justify-content:center;font-family:var(--font-head);font-weight:700;font-size:11px;color:#fff;flex-shrink:0;}
.ai-user-name{font-size:12.5px;font-weight:500;color:var(--text-1);max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}

.exam-proctor-camera{position:fixed;bottom:14px;right:14px;z-index:200;width:128px;border-radius:var(--r-lg);overflow:hidden;box-shadow:var(--shadow-lg);border:1.5px solid var(--border-1);background:#000;}
.exam-proctor-video{width:100%;display:block;aspect-ratio:4/3;object-fit:cover;}
.exam-proctor-status{display:flex;align-items:center;gap:5px;padding:4px 7px;background:rgba(0,0,0,.75);font-size:9.5px;color:#aaa;}
.exam-proctor-status.warning{background:rgba(220,38,38,.85);color:#fff;}
.exam-proctor-dot{width:5px;height:5px;border-radius:50%;background:#22C55E;flex-shrink:0;animation:pulse 1.4s ease-in-out infinite;}
.exam-proctor-status.warning .exam-proctor-dot{background:#fff;}
`;

export default function InterviewPage() {
  function cryptoRandom() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto)
      return crypto.randomUUID();
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

  const [showCameraVerification, setShowCameraVerification] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [sessionStatsId, setSessionStatsId] = useState<string | null>(null);
  const [uploadingExamImage, setUploadingExamImage] = useState(false);

  const getTimeLimit = (r: number) => ({ 1: 30, 2: 120, 3: 300 })[r] || 30;
  const getQuestionCount = (r: number) => ({ 1: 12, 2: 5, 3: 3 })[r] || 5;

  const isNonTechnical = (skills: string[], domains: string[]) => {
    const kw = ["hr","human resource","marketing","sales","finance","accounting","business","management","admin","operations","customer service","support"];
    return [...(skills || []), ...(domains || [])].join(" ").toLowerCase().split(" ").some((w) => kw.includes(w));
  };

  const [roundType, setRoundType] = useState<string>("");
  const [roundDescription, setRoundDescription] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const answerRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(true);
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
  const [modal, setModal] = useState<{
    show: boolean;
    type: "success" | "error";
    title: string;
    message: string;
    onClose?: () => void;
  } | null>(null);
  const [typingText, setTypingText] = useState("");
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [analysisTypingText, setAnalysisTypingText] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<{
    score: number;
    feedback: string;
    userAnswer: string;
  } | null>(null);
  const [nextQuestionData, setNextQuestionData] = useState<any>(null);
  const [dragOver, setDragOver] = useState(false);
  const [candidateResult, setCandidateResult] = useState<any>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultLoading, setResultLoading] = useState(false);
  const [showRound4, setShowRound4] = useState(false);
  const [showRound5, setShowRound5] = useState(false);
  const [round3Done, setRound3Done] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState<number | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("aiInterviewTheme");
    return savedTheme === "dark" ? "dark" : "light";
  });
  const [flowHydrated, setFlowHydrated] = useState(false);

  useEffect(() => { localStorage.setItem("aiInterviewTheme", theme); }, [theme]);

  useEffect(() => {
    try {
      const savedFlow = sessionStorage.getItem(FLOW_STATE_KEY);
      if (!savedFlow) return;
      const data = JSON.parse(savedFlow);
      if (data.parsed) setParsed(data.parsed);
      if (data.candidateId) setCandidateId(data.candidateId);
      if (data.sessionStatsId) setSessionStatsId(data.sessionStatsId);
      if (typeof data.yearsOfExperience === "number") setYearsOfExperience(data.yearsOfExperience);
      if (data.capturedImage) setCapturedImage(data.capturedImage);
      setShowWelcome(Boolean(data.showWelcome));
      setShowUpload(Boolean(data.showUpload));
      setShowAnalyzing(false);
      setShowAnalysisMessage(false);
      setShowCameraVerification(Boolean(data.showCameraVerification) && !data.capturedImage);
    } catch (error) {
      console.error("Unable to restore interview flow:", error);
      sessionStorage.removeItem(FLOW_STATE_KEY);
    } finally {
      setFlowHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!flowHydrated) return;
    const hasFlowProgress = Boolean(parsed || capturedImage || showCameraVerification || showUpload || !showWelcome);
    if (!hasFlowProgress) { sessionStorage.removeItem(FLOW_STATE_KEY); return; }
    sessionStorage.setItem(FLOW_STATE_KEY, JSON.stringify({
      parsed, candidateId, sessionStatsId, yearsOfExperience, capturedImage,
      showWelcome: question ? false : showWelcome,
      showUpload: question ? false : showUpload,
      showCameraVerification: question ? false : showCameraVerification,
    }));
  }, [flowHydrated, parsed, candidateId, sessionStatsId, yearsOfExperience, capturedImage, showWelcome, showUpload, showCameraVerification, question]);

  const handleNextQuestion = useCallback(
    async (feedbackData: any) => {
      if (!user || !question) return;
      const answer = feedbackData?.userAnswer || currentFeedback?.userAnswer || "No answer provided";
      try {
        const data = await api.submitAnswer({ userId: user.id, sessionId, domain: parsed?.domains?.[0] || "General", question, answer });
        if (data.advancedTo) {
          setQuestion("");
          if (data.advancedTo === 4 || data.roundType === 'communication') {
            goToRound4(); return;
          }
          const ntAdv = isNonTechnical(parsed?.skills || [], parsed?.domains || []);
          const roundNames: { [key: number]: string } = { 1: "Skill Check", 2: "Scenario Round", 3: ntAdv ? "Professional Assessment" : "Coding Challenge" };
          setModal({
            show: true, type: "success",
            title: `Round ${data.doneRound} — ${roundNames[data.doneRound]} Completed`,
            message: `Round ${data.doneRound} completed!\n\nProceed to Round ${data.advancedTo} and continue your assessment.`,
            onClose: () => {
              if (data.nextQuestion) {
                setRound(data.advancedTo); setQNo(1);
                setTotalQ(data.total_questions || getQuestionCount(data.advancedTo));
                setQuestion(data.nextQuestion); setAskedQuestions([data.nextQuestion]);
                const nt = isNonTechnical(parsed?.skills || [], parsed?.domains || []);
                const roundTypes = { 1: "Skill Check", 2: "Scenario Round", 3: nt ? "Professional Assessment" : "Coding Challenge" };
                const roundDescriptions = { 1: "Technical MCQs to evaluate your fundamentals (Need 70% to qualify)", 2: "Real-world scenario questions based on your experience (Need 60% to qualify, min 300 chars)", 3: nt ? "Professional assessment questions based on your domain (Need 70% to qualify)" : "Coding challenge with input/output format and constraints (Need 70% to qualify)" };
                setRoundType(roundTypes[data.advancedTo as keyof typeof roundTypes] || "");
                setRoundDescription(roundDescriptions[data.advancedTo as keyof typeof roundDescriptions] || "");
                setTimePerQuestion(getTimeLimit(data.advancedTo)); setTimeLeft(getTimeLimit(data.advancedTo));
                setTimerStopped(false); setSelectedOption("");
                if (answerRef.current) answerRef.current.value = "";
                setCodeOutput(""); setCodeError(""); setLineCount(1); setCharCount(0);
                setStatus("");
              }
            },
          });
          return;
        }
        if (data.doneRound && data.passed === false) {
          setQuestion("");
          const nt2 = isNonTechnical(parsed?.skills || [], parsed?.domains || []);
          const roundNames: { [key: number]: string } = { 1: "Skill Check", 2: "Scenario Round", 3: nt2 ? "Professional Assessment" : "Coding Challenge" };
          setModal({
            show: true, type: "success",
            title: `Round ${data.doneRound} — ${roundNames[data.doneRound]} Completed`,
            message: `Round ${data.doneRound} completed!\n\nProceed to Round ${data.advancedTo || data.doneRound + 1} and continue your assessment.`,
            onClose: () => {
              if (data.nextQuestion) {
                setRound(data.advancedTo || data.doneRound + 1); setQNo(1);
                setTotalQ(data.total_questions || getQuestionCount(data.advancedTo || data.doneRound + 1));
                setQuestion(data.nextQuestion); setAskedQuestions([data.nextQuestion]);
                const nt3 = isNonTechnical(parsed?.skills || [], parsed?.domains || []);
                const roundTypes2 = { 1: "Skill Check", 2: "Scenario Round", 3: nt3 ? "Professional Assessment" : "Coding Challenge" };
                const roundDescriptions2 = { 1: "Technical MCQs to evaluate your fundamentals (Need 70% to qualify)", 2: "Real-world scenario questions based on your experience (Need 60% to qualify, min 300 chars)", 3: nt3 ? "Professional assessment questions based on your domain (Need 70% to qualify)" : "Coding challenge with input/output format and constraints (Need 70% to qualify)" };
                const nextRound = data.advancedTo || data.doneRound + 1;
                setRoundType(roundTypes2[nextRound as keyof typeof roundTypes2] || "");
                setRoundDescription(roundDescriptions2[nextRound as keyof typeof roundDescriptions2] || "");
                setTimePerQuestion(getTimeLimit(nextRound)); setTimeLeft(getTimeLimit(nextRound));
                setTimerStopped(false); setSelectedOption("");
                if (answerRef.current) answerRef.current.value = "";
                setStatus("");
              }
            },
          });
          return;
        }
        if (data.question) {
          setQNo(data.question_no); setQuestion(data.question);
          setAskedQuestions((prev) => [...prev, data.question]);
          setTimePerQuestion(30); setTimeLeft(30); setTimerStopped(true);
          setSelectedOption("");
          if (answerRef.current) answerRef.current.value = "";
          setCodeOutput(""); setCodeError(""); setLineCount(1); setCharCount(0);
        }
      } catch (err) {
        console.error("Failed to get next question:", err);
      }
    },
    [user, question, sessionId, parsed, currentFeedback, getQuestionCount],
  );

  const aiMessages = ["Welcome to AI-Powered Assessment! 🤖","Analyzing your resume...","Generating personalized questions...","Evaluating your responses in real-time...","Ready to start your assessment?"];

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      handleLogin();
      return;
    }
    setUser(JSON.parse(stored));
    setLoginLoading(false);
  }, []);

  useEffect(() => {
    if (!user) return;
    const uid = localStorage.getItem("userId");
    if (!uid) return;
    api.getCandidate(uid).then((data: any) => { if (data?.statistics?.totalQuestions > 0) setCandidateResult(data); }).catch(() => {});
  }, [user]);

  async function openPreviousResults() {
    if (!user) return;
    const uid = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).id : null;
    if (!uid) return;
    setResultLoading(true);
    try {
      const data = await api.getCandidate(uid);
      if (data?.attempts?.length > 0 || data?.summary?.totalAttempts > 0) {
        setCandidateResult(data); setSelectedAttempt(null); setShowResultModal(true);
      } else { alert("No previous interview data found."); }
    } catch (e) { console.error(e); } finally { setResultLoading(false); }
  }

  useEffect(() => {
    if (showWelcome) setCurrentMessageIndex(0);
  }, [showWelcome]);

  useEffect(() => {
    if (!showWelcome) return;
    const msg = aiMessages[currentMessageIndex];
    let i = 0; setTypingText("");
    const t = setInterval(() => {
      if (i < msg.length) { setTypingText(msg.slice(0, i + 1)); i++; }
      else { clearInterval(t); setTimeout(() => setCurrentMessageIndex((p) => (p + 1) % aiMessages.length), 2000); }
    }, 80);
    return () => clearInterval(t);
  }, [currentMessageIndex, showWelcome]);

  const handleLogin = async () => {
    setLoginLoading(true);
    const stored = localStorage.getItem("profileData") || localStorage.getItem("user") || localStorage.getItem("whatsappNumber") || localStorage.getItem("mobileNumber") || "";
    let userId = "", phone = "", name = "";
    if (stored) {
      const parsedData = JSON.parse(stored);
      userId = localStorage.getItem("userId") || "";
      phone = parsedData.mobileNumber || parsedData.whatsappNumber || parsedData || "";
      name = parsedData.userFirstName && parsedData.userLastName ? `${parsedData.userFirstName} ${parsedData.userLastName}` : parsedData.userName || "";
    }
    if (!userId && !phone) {
      Modal.warning({ title: "Login Required", content: "Please login to continue." });
      sessionStorage.setItem("redirectPath", "/interview");
      setLoginLoading(false);
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
          if (profileData) {
            phone = profileData.mobileNumber || profileData.whatsappNumber || phone;
            name = profileData.userName || `${profileData.firstName || ""} ${" "} ${profileData.lastName || ""}` || name;
            if (!profileData.mobileVerified && !profileData.whatsappVerified) {
              Modal.warning({ title: "Verification Required", content: "Please verify your mobile or WhatsApp number." });
              setLoading(false); return;
            }
          }
        }
      }
      if (!phone) { Modal.warning({ title: "Profile Incomplete", content: "Phone number not found. Please update your profile." }); setLoading(false); return; }
      if (!name) { Modal.warning({ title: "Profile Incomplete", content: "Name not found. Please complete your profile." }); setLoading(false); return; }
      const data = await api.login({ phone_number: phone, name });
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        Modal.success({ title: "Welcome", content: `Welcome, ${data.user.name}!` });
        window.location.href = "/interview";
      } else if (data.error) { Modal.error({ title: "Login Failed", content: data.error }); }
      else { Modal.error({ title: "Login Failed", content: "Please try again." }); }
    } catch (err) {
      console.error("Login error:", err);
      Modal.error({ title: "Error", content: "An error occurred. Please try again." });
    } finally { setLoading(false); setLoginLoading(false); }
  };

  useEffect(() => {
    if (question && timeLeft > 0 && !timerStopped) {
      const t = setTimeout(() => setTimeLeft((x) => x - 1), 1000);
      return () => clearTimeout(t);
    } else if (question && timeLeft === 0 && !loading && !submitting && !showFeedback && !timerStopped) {
      setTimerStopped(true); submitAnswer();
    }
  }, [timeLeft, question, loading, submitting, showFeedback, round, selectedOption, timerStopped]);

  async function onUploadResume() {
    if (!user || !selectedFile) return;
    const allowedTypes = [".pdf", ".doc", ".docx", ".txt"];
    const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf("."));
    if (!allowedTypes.includes(fileExtension)) {
      setModal({ show: true, type: "error", title: "Invalid File Type", message: `Please upload a valid resume file.\n\nSupported formats: PDF, DOC, DOCX, TXT\nYour file: ${fileExtension.toUpperCase()}` });
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile); formData.append("userId", user.id);
    setShowUpload(false); setShowAnalyzing(true); setStatus("AI Bot analyzing resume...");
    try {
      const data = await api.uploadResume(formData);
      setShowAnalyzing(false);
      if (data?.success && data?.parsed) {
        setParsed(data.parsed);
        if (data.id) { setCandidateId(data.id); console.log("Candidate ID:", data.id); }
        const years = data.parsed.experience || data.parsed.years_of_experience || 0;
        setYearsOfExperience(years); setShowAnalyzing(false); setShowAnalysisMessage(true);
        const message = "AI analysis complete! We've extracted your details from the resume. Please complete camera verification to continue.";
        let charIndex = 0; setAnalysisTypingText("");
        const typingInterval = setInterval(() => {
          if (charIndex < message.length) { setAnalysisTypingText(message.slice(0, charIndex + 1)); charIndex++; }
          else { clearInterval(typingInterval); setTimeout(() => { setShowAnalysisMessage(false); setShowCameraVerification(true); }, 1500); }
        }, 50);
      } else if (data?.error) {
        setShowAnalyzing(false); setShowUpload(true);
        let errorMessage = "Please upload a proper resume file.";
        if (data.error.includes("format") || data.error.includes("type")) errorMessage = "Invalid file format. Please upload a PDF, DOC, DOCX, or TXT file.";
        else if (data.error.includes("size")) errorMessage = "File too large. Please upload a file smaller than 10MB.";
        else if (data.error.includes("corrupt") || data.error.includes("damaged")) errorMessage = "File appears to be corrupted. Please try uploading a different file.";
        else if (data.error.includes("content") || data.error.includes("text")) errorMessage = "Unable to extract text from resume. Please ensure your file contains readable text.";
        setModal({ show: true, type: "error", title: "Resume Upload Failed", message: errorMessage });
        setParsed(null);
      } else {
        setShowAnalyzing(false); setShowUpload(true);
        setModal({ show: true, type: "error", title: "Resume Processing Failed", message: "Resume upload completed but could not extract profile data. Please try uploading a different resume file." });
        setParsed(null);
      }
    } catch (error) {
      setShowAnalyzing(false); setShowUpload(true);
      let errorMessage = "Please upload a proper resume file.";
      if (error instanceof Error) {
        if (error.message.includes("network") || error.message.includes("fetch")) errorMessage = "Network error. Please check your connection and try again.";
        else if (error.message.includes("timeout")) errorMessage = "Upload timed out. Please try again with a smaller file.";
      }
      setModal({ show: true, type: "error", title: "Upload Error", message: errorMessage });
      setParsed(null); console.error("Upload error:", error);
    }
  }

  function dataUrlToFile(dataUrl: string, filename = "candidate-image.jpg"): File {
    if (!dataUrl.startsWith("data:")) throw new Error("Invalid image data");
    const [header, base64] = dataUrl.split(",");
    if (!base64) throw new Error("Invalid image data");
    const mime = header.match(/:(.*?);/)?.[1] || "image/jpeg";
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new File([bytes], filename, { type: mime });
  }

  async function createExamSession(): Promise<string> {
    if (!candidateId) throw new Error("Please upload your resume again before continuing to the interview.");
    const userId = user?.id || localStorage.getItem("userId") || "";
    if (!userId) throw new Error("Please log in again before continuing.");
    const sessionRes = await api.createSessionStats({ candidateId, userId, status: "started" });
    const id = sessionRes.data?.id;
    if (!id) throw new Error("Failed to create exam session");
    setSessionStatsId(id);
    return id;
  }

  async function continueToInterviewAfterCapture() {
    if (!user || !capturedImage) return;
    setUploadingExamImage(true);
    try {
      const activeSessionStatsId = await createExamSession();
      const imageFile = dataUrlToFile(capturedImage, "candidate-image.jpg");
      const userId = user.id || localStorage.getItem("userId") || "";
      const formData = new FormData();
      formData.append("file", imageFile); formData.append("userId", userId);
      formData.append("sessionStatsId", activeSessionStatsId); formData.append("type", ExamImageType.CANDIDATE_IMAGE);
      await api.uploadExamImage(formData);
      setShowCameraVerification(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload verification image. Please try again.";
      setModal({ show: true, type: "error", title: "Image Upload Failed", message });
    } finally { setUploadingExamImage(false); }
  }

  async function startInterview() {
    if (!user) { alert("Please log in to start the interview"); window.location.href = "/login"; return; }
    if (!parsed) { alert("Please upload and parse your resume first"); return; }
    if (!capturedImage) { alert("Please complete camera verification first"); setShowCameraVerification(true); return; }
    if (showRound4 || showRound5) return;
    if (!sessionStatsId) { alert("Please complete camera verification and click Continue to Interview first."); return; }
    setLoading(true); setAskedQuestions([]); round3DoneRef.current = false;
    try {
      const data = await api.startInterview({ userId: user.id, sessionId, skills: parsed?.skills || [], domain: parsed?.domains?.[0] || "General", askedQuestions: askedQuestions, yearsOfExperience: yearsOfExperience, isNonTechnical: isNonTechnical(parsed?.skills || [], parsed?.domains || []) });
      setLoading(false);
      if (data.error) throw new Error(data.error);
      if (data.finished) { setStatus("success:" + data.message); return; }
      if (data.resume) {
        setStatus("Continuing Round " + data.round);
        const contData = await api.startInterview({ userId: user.id, sessionId, yearsOfExperience: yearsOfExperience });
        if (contData.question) {
          setRound(contData.round); setQNo(contData.question_no);
          setTotalQ(contData.total_questions || getQuestionCount(contData.round));
          setQuestion(contData.question); setAskedQuestions((prev) => [...prev, contData.question]);
          const ntCont = isNonTechnical(parsed?.skills || [], parsed?.domains || []);
          const roundTypes = { 1: "Skill Check", 2: "Scenario Round", 3: ntCont ? "Professional Assessment" : "Coding Challenge" };
          const roundDescriptions = { 1: "Technical MCQs to evaluate your fundamentals", 2: "Real-world scenario questions based on your experience (Need 60% to qualify)", 3: ntCont ? "Professional assessment questions based on your domain (Need 70% to qualify)" : "Coding challenge with input/output format and constraints" };
          setRoundType(roundTypes[contData.round as keyof typeof roundTypes] || "");
          setRoundDescription(roundDescriptions[contData.round as keyof typeof roundDescriptions] || "");
          const timeLimit = getTimeLimit(contData.round);
          setTimePerQuestion(timeLimit); setTimeLeft(timeLimit); setTimerStopped(false); setStatus("");
          if (answerRef.current) answerRef.current.value = "";
          setCodeOutput(""); setCodeError(""); setLineCount(1); setCharCount(0); setSelectedOption("");
        } else { setStatus("warning:Could not fetch question"); }
        return;
      }
      setRound(data.round); setQNo(data.question_no);
      setTotalQ(data.total_questions || getQuestionCount(data.round));
      setQuestion(data.question); setAskedQuestions([data.question]);
      const ntMain = isNonTechnical(parsed?.skills || [], parsed?.domains || []);
      const roundTypes = { 1: "Skill Check", 2: "Scenario Round", 3: ntMain ? "Professional Assessment" : "Coding Challenge" };
      const roundDescriptions = { 1: "Technical MCQs to evaluate your fundamentals (Need 70% to qualify)", 2: "Real-world scenario questions based on your experience (Need 60% to qualify, min 300 chars)", 3: isNonTechnical(parsed?.skills || [], parsed?.domains || []) ? "Professional assessment questions based on your domain (Need 70% to qualify)" : "Coding challenge with input/output format and constraints (Need 70% to qualify)" };
      setRoundType(roundTypes[data.round as keyof typeof roundTypes] || "");
      setRoundDescription(roundDescriptions[data.round as keyof typeof roundDescriptions] || "");
      const timeLimit = getTimeLimit(data.round);
      setTimePerQuestion(timeLimit); setTimeLeft(timeLimit); setTimerStopped(false); setStatus("");
      if (answerRef.current) answerRef.current.value = "";
      setCodeOutput(""); setCodeError(""); setLineCount(1); setCharCount(0); setSelectedOption("");
      setTimeout(() => { questionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 500);
    } catch (err: any) {
      console.error("Start interview error:", err);
      setLoading(false); alert("Failed to start interview: " + err.message);
    }
  }

  function getTestInput(lang: string) { return ""; }

  function getPlaceholder(lang: string) {
    switch (lang) {
      case "python": return "def function_name():\n    # Write your code here\n    pass";
      case "java": return "public static int maxSubarraySum(int[] arr) {\n    // Write your code here\n    return 0;\n}";
      default: return "def function_name():\n    # Write your code here\n    pass";
    }
  }

  const blockClipboardAction = (_e: React.ClipboardEvent<HTMLTextAreaElement>) => {};

  async function runCode() {
    const code = answerRef.current?.value?.trim() || "";
    if (!code) { setCodeError("Please write your code before running."); setCodeOutput(""); return; }
    setLoading(true); setCodeOutput(""); setCodeError("");
    const postdata = { code, language: selectedLanguage, question };
    try {
      const result = await api.codeRunner(postdata);
      const output = result?.output || result?.stdout || result?.data?.output || "";
      const errorText = result?.error || result?.stderr || result?.message || result?.data?.error || "";
      const isSuccess = result?.success === true || (!errorText && Boolean(output));
      if (isSuccess) { setCodeOutput(output || "Code executed successfully."); setCodeError(""); }
      else { setCodeOutput(""); setCodeError(errorText || "Code execution failed. Please check your syntax and selected language."); }
    } catch (error: any) {
      let errorMessage = "Code runner is not responding. Please check the backend code-runner API and try again.";
      if (error?.response?.data?.error) errorMessage = error.response.data.error;
      else if (error?.response?.data?.message) errorMessage = error.response.data.message;
      else if (error?.message?.toLowerCase().includes("timeout")) errorMessage = "Code execution timed out. Please check for infinite loops or heavy logic.";
      else if (error?.message?.includes("Failed to fetch") || error?.message?.includes("Network")) errorMessage = "Network/API error. Please verify the code-runner endpoint is running.";
      else if (error?.message) errorMessage = error.message;
      setCodeError(errorMessage); setCodeOutput("");
    } finally { setLoading(false); }
  }

  useEffect(() => {
    if (question && round === 3) {
      if (answerRef.current) {
        answerRef.current.value = "";
        const event = new Event('input', { bubbles: true });
        answerRef.current.dispatchEvent(event);
      }
      setCodeOutput("");
      setCodeError("");
      setLineCount(1);
      setCharCount(0);
    }
  }, [question, round]);

  useEffect(() => {
    if (round === 3 && selectedLanguage) console.log(`Code will be executed in ${selectedLanguage.toUpperCase()}.`);
  }, [selectedLanguage, round]);

  const round3DoneRef = React.useRef(false);

  function goToRound4() {
    round3DoneRef.current = true;
    setQuestion(""); setRound(null); setStatus("");
    setShowFeedback(false); setCurrentFeedback(null); setNextQuestionData(null);
    setTimerStopped(false); setCharCount(0); setLoading(false); setSubmitting(false);
    setShowWelcome(false); setRound3Done(false);
    setModal({
      show: true, type: "success",
      title: "Round 3 Complete! ",
      message: "Great work finishing Round 3!\n\nNext up: Round 4 — Communication Round (Voice MCQ)",
      onClose: () => { setShowRound4(true); },
    });
  }

  async function submitAnswer() {
    if (!user || !question || submitting) return;
    const isTimeExpired = timeLeft <= 0 || timerStopped;
    let ans = "";
    if (round === 1) { ans = selectedOption || "No option selected"; }
    else {
      ans = answerRef.current?.value?.trim() || "No answer provided";
      if (round === 2 && ans.length < 300 && !isTimeExpired) {
        alert("Answer too short. Minimum 300 characters required. Current: " + ans.length);
        return;
      }
    }
    setTimerStopped(true); setSubmitting(true); setLoading(true); setStatus("Evaluating your answer...");
    try {
      const data = await api.submitAnswer({ userId: user.id, sessionId, domain: parsed?.domains?.[0] || "General", question, answer: ans, language: isFrontendQuestion ? selectedLanguage : undefined, askedQuestions: askedQuestions, currentRound: round, currentQuestionNo: qNo, totalQuestions: totalQ, isTimeExpired: isTimeExpired });
      setLoading(false);
      if (data.error) {
        if (data.error.includes("Answer too short") && round === 1) { /* ignore */ }
        else if (data.error.includes("Answer too short") && round === 2 && timeLeft > 0) { alert(data.error); setSubmitting(false); setTimerStopped(false); return; }
        else if (data.error === "Interview not started") {
          try {
            const restartData = await api.startInterview({ userId: user.id, sessionId, skills: parsed?.skills || [], domain: parsed?.domains?.[0] || "General", yearsOfExperience: yearsOfExperience });
            if (restartData.question) { setRound(restartData.round); setQNo(restartData.question_no); setTotalQ(restartData.total_questions); setQuestion(restartData.question); setTimeLeft(restartData.timeLimit || getTimeLimit(restartData.round)); setTimePerQuestion(restartData.timeLimit || getTimeLimit(restartData.round)); return; }
          } catch (restartErr) { console.error("Failed to restart interview:", restartErr); }
          alert("Interview session lost. Please refresh the page to start a new interview.");
          setQuestion(""); setRound(null); return;
        }
        throw new Error(data.error);
      }
      if (data.advancedTo) {
        setStatus("success:Passed Round " + data.doneRound); setQuestion("");
        if (data.advancedTo === 4 || data.roundType === 'communication') {
          goToRound4(); return;
        }
        const roundNames: { [key: number]: string } = { 1: "Skill Check", 2: "Scenario Round", 3: "Coding Challenge" };
        setModal({
          show: true, type: "success",
          title: `Round ${data.doneRound} — ${roundNames[data.doneRound]} Completed`,
          message: `Round ${data.doneRound} completed!\n\nProceed to Round ${data.advancedTo} and continue your assessment.`,
          onClose: () => {
            if (data.nextQuestion) {
              setRound(data.advancedTo); setQNo(1);
              setTotalQ(data.total_questions || getQuestionCount(data.advancedTo));
              setQuestion(data.nextQuestion); setAskedQuestions([data.nextQuestion]);
              const ntA = isNonTechnical(parsed?.skills || [], parsed?.domains || []);
              const roundTypes = { 1: "Skill Check", 2: "Scenario Round", 3: ntA ? "Professional Assessment" : "Coding Challenge" };
              const roundDescriptions = { 1: "Technical MCQs to evaluate your fundamentals (Need 70% to qualify)", 2: "Real-world scenario questions based on your experience (Need 60% to qualify, min 300 chars)", 3: ntA ? "Professional assessment questions based on your domain (Need 70% to qualify)" : "Coding challenge with input/output format and constraints (Need 70% to qualify)" };
              setRoundType(roundTypes[data.advancedTo as keyof typeof roundTypes] || "");
              setRoundDescription(roundDescriptions[data.advancedTo as keyof typeof roundDescriptions] || "");
              const timeLimit = getTimeLimit(data.advancedTo);
              setTimePerQuestion(timeLimit); setTimeLeft(timeLimit); setTimerStopped(false); setSelectedOption("");
              if (answerRef.current) answerRef.current.value = "";
              setCodeOutput(""); setCodeError(""); setLineCount(1); setCharCount(0);
              setStatus("");
            }
          },
        });
        return;
      }
      if (data.doneRound && data.passed === false) {
        const ntB = isNonTechnical(parsed?.skills || [], parsed?.domains || []);
        const roundNames: { [key: number]: string } = { 1: "Skill Check", 2: "Scenario Round", 3: ntB ? "Professional Assessment" : "Coding Challenge" };
        setModal({
          show: true, type: "success",
          title: `Round ${data.doneRound} — ${roundNames[data.doneRound]} Completed`,
          message: `Round ${data.doneRound} completed!\n\nProceed to Round ${data.advancedTo || data.doneRound + 1} and continue your assessment.`,
          onClose: () => {
            if (data.nextQuestion) {
              setRound(data.advancedTo || data.doneRound + 1); setQNo(1);
              setTotalQ(data.total_questions || getQuestionCount(data.advancedTo || data.doneRound + 1));
              setQuestion(data.nextQuestion); setAskedQuestions([data.nextQuestion]);
              const ntC = isNonTechnical(parsed?.skills || [], parsed?.domains || []);
              const roundTypesB = { 1: "Skill Check", 2: "Scenario Round", 3: ntC ? "Professional Assessment" : "Coding Challenge" };
              const roundDescriptionsB = { 1: "Technical MCQs to evaluate your fundamentals (Need 70% to qualify)", 2: "Real-world scenario questions based on your experience (Need 60% to qualify, min 300 chars)", 3: ntC ? "Professional assessment questions based on your domain (Need 70% to qualify)" : "Coding challenge with input/output format and constraints (Need 70% to qualify)" };
              const nextRound = data.advancedTo || data.doneRound + 1;
              setRoundType(roundTypesB[nextRound as keyof typeof roundTypesB] || "");
              setRoundDescription(roundDescriptionsB[nextRound as keyof typeof roundDescriptionsB] || "");
              const timeLimit = getTimeLimit(nextRound);
              setTimePerQuestion(timeLimit); setTimeLeft(timeLimit); setTimerStopped(false); setSelectedOption("");
              if (answerRef.current) answerRef.current.value = "";
              setCodeOutput(""); setCodeError(""); setLineCount(1); setCharCount(0);
              setStatus("");
            }
          },
        });
        return;
      }
      if (data.finished) {
        if (data.doneRound === 3) { goToRound4(); return; }
        setStatus("success:" + data.message); setQuestion(""); return;
      }
      if (data.last) {
        if (data.doneRound === 3 || (round === 3 && qNo >= totalQ)) { goToRound4(); return; }
        setCurrentFeedback({ score: Number(data.last.score || 0), feedback: data.last.feedback || "", userAnswer: ans });
        setShowFeedback(true);
        if (data.question) { setNextQuestionData(data); }
        return;
      }
      if (data.question) {
        const expectedCount = getQuestionCount(data.round);
        if (data.round === round && data.question_no > expectedCount) {
          if (data.round < 3) { setQuestion(""); alert(`Round ${data.round} Completed!\n\nAll ${expectedCount} questions answered.\n\nRefresh the page to start Round ${data.round + 1}.`); }
          else { setQuestion(""); alert(`Assessment Completed!\n\nAll rounds finished successfully!`); }
          return;
        }
        setRound(data.round); setQNo(data.question_no);
        setTotalQ(data.total_questions || expectedCount);
        setQuestion(data.question); setAskedQuestions((prev) => [...prev, data.question]);
        const timeLimit = getTimeLimit(data.round);
        setTimePerQuestion(timeLimit); setTimeLeft(timeLimit); setTimerStopped(false); setSelectedOption("");
        if (answerRef.current) answerRef.current.value = "";
        setCodeOutput(""); setCodeError(""); setLineCount(1); setCharCount(0); setStatus("");
      }
    } catch (err: any) {
      console.error("Submit answer error:", err);
      setLoading(false);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (err.message?.includes("Failed to fetch")) errorMessage = "Network connection error. Please check your internet connection and try again.";
      else if (err.message?.includes("timeout")) errorMessage = "Request timed out. Please try submitting your answer again.";
      else if (err.message) errorMessage = err.message;
      setModal({ show: true, type: "error", title: "Submission Error", message: errorMessage });
    } finally { if (!round3DoneRef.current) setSubmitting(false); }
  }

  if (!user) {
    if (!loginLoading) return null;
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <div className={`ai-bg theme-${theme}`}>
          <div className="analyzing-wrap" style={{ minHeight: "100vh", alignItems: "center" }}>
            <div className="analyzing-card" style={{ maxWidth: 420 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                <SpinnerIcon />
              </div>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 20, fontWeight: 700, color: "var(--text-1)", marginBottom: 8 }}>
                Logging you in...
              </div>
              <div style={{ fontSize: 13.5, color: "var(--text-3)" }}>
                Verifying your profile and preparing the interview.
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const roundColors = ["", "#0F7B3A", "#0F62FE", "#B45309"];
  const languageOptions = [
    { value: "python", label: "Python" },
    { value: "javascript", label: "JavaScript" },
    { value: "java", label: "Java" },
    { value: "c", label: "C" },
    { value: "cpp", label: "C++" },
  ];
  const nonTechnical = parsed ? isNonTechnical(parsed.skills, parsed.domains) : false;

  if (showRound4) {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <div className={`ai-bg theme-${theme}`}>
          <InterviewHeader theme={theme} user={user} onToggleTheme={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))} />
          {modal?.show && (
            <div className="ai-modal-overlay">
              <div className="ai-modal">
                <div className="ai-modal-icon">{modal.type === "success" ? "✅" : "⚠️"}</div>
                <h3 className="ai-modal-title">{modal.title}</h3>
                <p className="ai-modal-msg">{modal.message}</p>
                <button className="btn btn-primary btn-primary-lg" style={{ marginTop: 24, width: "100%" }} onClick={() => { setModal(null); modal.onClose?.(); }}>{modal.type === "success" ? "Continue →" : "Got it"}</button>
              </div>
            </div>
          )}
          <main className="ai-main">
            <Round4 userId={user.id} sessionId={sessionId} onComplete={() => { setShowRound4(false); setShowRound5(true); }} />
          </main>
        </div>
      </>
    );
  }

  if (showRound5) {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <div className={`ai-bg theme-${theme}`}>
          <InterviewHeader theme={theme} user={user} onToggleTheme={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))} />
          {modal?.show && (
            <div className="ai-modal-overlay">
              <div className="ai-modal">
                <div className="ai-modal-icon">{modal.type === "success" ? "✅" : "⚠️"}</div>
                <h3 className="ai-modal-title">{modal.title}</h3>
                <p className="ai-modal-msg">{modal.message}</p>
                <button className="btn btn-primary btn-primary-lg" style={{ marginTop: 24, width: "100%" }} onClick={() => { setModal(null); modal.onClose?.(); }}>{modal.type === "success" ? "Continue →" : "Got it"}</button>
              </div>
            </div>
          )}
          <main className="ai-main">
            <Round5 userId={user.id} sessionId={sessionId} onComplete={() => {
              setShowRound5(false);
              setModal({ show: true, type: "success", title: "Assessment Completed", message: "🎉 All 5 rounds completed!\n\nThank you for completing the AI Interview assessment." });
            }} />
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className={`ai-bg theme-${theme}`}>

        {/* ── Result Modal ── */}
        {showResultModal && candidateResult && (
          <div className="ai-modal-overlay" onClick={() => { setShowResultModal(false); setSelectedAttempt(null); }}>
            <div className="ai-modal" style={{ maxWidth: 620, textAlign: "left", maxHeight: "88vh", overflowY: "auto", padding: "24px 26px" }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <div style={{ fontFamily: "var(--font-head)", fontSize: 20, fontWeight: 700, color: "var(--text-1)" }}>{candidateResult.name}</div>
                  <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 3 }}>Interview Performance Summary</div>
                </div>
                <button className="btn btn-outline" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => { setShowResultModal(false); setSelectedAttempt(null); }}>Close</button>
              </div>

              {candidateResult.skills?.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div className="section-label">Skills</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {candidateResult.skills.map((s: string, i: number) => <span key={i} className="tag tag-skill" style={{ fontSize: 11 }}>{s}</span>)}
                  </div>
                </div>
              )}
              {candidateResult.domains?.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div className="section-label">Domain</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {candidateResult.domains.map((d: string, i: number) => <span key={i} className="tag tag-domain" style={{ fontSize: 11 }}>{d}</span>)}
                  </div>
                </div>
              )}

              {candidateResult.summary && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 20 }}>
                  {[
                    { label: "Total Attempts", value: candidateResult.summary.totalAttempts, color: "var(--brand)" },
                    { label: "Best Score", value: candidateResult.summary.bestScore + "%", color: "var(--success)" },
                    { label: "Latest Score", value: candidateResult.summary.latestScore + "%", color: "var(--warning)" },
                  ].map((s, i) => (
                    <div key={i} style={{ padding: "12px 14px", borderRadius: "var(--r-lg)", border: "1px solid var(--border-1)", background: "var(--surface-1)", textAlign: "center" }}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 5 }}>{s.label}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="section-label">Attempts</div>
              {(candidateResult.attempts || []).map((attempt: any) => {
                const isOpen = selectedAttempt === attempt.attemptNumber;
                const rN: any = { 1: "Skill Check", 2: "Scenario Round", 3: "Coding / Assessment" };
                const rC: any = { 1: "#0F7B3A", 2: "#0F62FE", 3: "#B45309" };
                const score = parseFloat(attempt.overallScore || "0");
                const scoreColor = score >= 60 ? "var(--success)" : score >= 40 ? "var(--warning)" : "var(--danger)";
                return (
                  <div key={attempt.attemptNumber} className="attempt-card">
                    <div className="attempt-card-header" onClick={() => setSelectedAttempt(isOpen ? null : attempt.attemptNumber)}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "var(--r-md)", background: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>#{attempt.attemptNumber}</div>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-1)" }}>Attempt {attempt.attemptNumber}</div>
                          <div style={{ fontSize: 11.5, color: "var(--text-3)" }}>{new Date(attempt.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} · {attempt.totalQuestions} questions</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: scoreColor }}>{attempt.overallScore}%</div>
                          <div style={{ fontSize: 11, color: "var(--text-3)" }}>{attempt.status}</div>
                        </div>
                        <div style={{ fontSize: 14, color: "var(--text-3)", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▾</div>
                      </div>
                    </div>
                    {isOpen && (
                      <div style={{ padding: "0 16px 16px" }}>
                        <div className="section-label" style={{ marginTop: 4 }}>Round Breakdown</div>
                        {(attempt.roundBreakdown || []).map((rb: any) => (
                          <div key={rb.round} style={{ marginBottom: 8, padding: "12px", borderRadius: "var(--r-md)", border: "1px solid var(--border-1)", background: "var(--surface-1)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 22, height: 22, borderRadius: "var(--r-xs)", background: rC[rb.round], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>{rb.round}</div>
                                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>{rN[rb.round]}</span>
                              </div>
                              <div>
                                <span style={{ fontSize: 14, fontWeight: 700, color: rC[rb.round] }}>{rb.percentage}%</span>
                                <span style={{ fontSize: 11.5, color: "var(--text-3)", marginLeft: 6 }}>{rb.scored}/{rb.maxScore} pts</span>
                              </div>
                            </div>
                            <div className="progress-bar-wrap">
                              <div className="progress-bar-fill" style={{ width: `${Math.min(parseFloat(rb.percentage), 100)}%`, background: rC[rb.round] }} />
                            </div>
                            <div style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 5 }}>{rb.questionsAnswered} questions answered</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Alert Modal ── */}
        {modal?.show && (
          <div className="ai-modal-overlay">
            <div className="ai-modal">
              <div className="ai-modal-icon">{modal.type === "success" ? "✅" : "⚠️"}</div>
              <h3 className="ai-modal-title">{modal.title}</h3>
              <p className="ai-modal-msg">{modal.message}</p>
              <button className="btn btn-primary btn-primary-lg" style={{ marginTop: 24, width: "100%" }} onClick={() => { setModal(null); modal.onClose?.(); }}>
                {modal.type === "success" ? "Continue →" : "Got it"}
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <InterviewHeader
          theme={theme}
          user={user}
          onToggleTheme={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
        />
        <ExamProctorCamera
          active={Boolean(question) && !showRound4 && !showRound5}
          userId={user?.id || localStorage.getItem("userId") || ""}
          sessionStatsId={sessionStatsId || ""}
        />

        <main className="ai-main">

          {/* ══════ CAMERA VERIFICATION ══════ */}
          {showCameraVerification && !capturedImage && (
            <CameraVerification onCapture={(imageData: string) => { setCapturedImage(imageData); }} />
          )}

          {/* Show captured image confirmation */}
          {showCameraVerification && capturedImage && (
            <div className="camera-complete-wrap">
              <div className="camera-complete-header">
                <h2 style={{ fontFamily: "var(--font-head)", fontSize: 21, fontWeight: 700, marginBottom: 6, color: "var(--text-1)" }}>Verification Complete</h2>
                <p style={{ color: "var(--text-3)", fontSize: 14 }}>Your photo has been captured successfully</p>
              </div>
              <div className="camera-complete-preview">
                <img src={capturedImage} alt="Captured" style={{ width: "100%", display: "block" }} />
              </div>
              <div className="camera-complete-actions">
                <button className="btn btn-outline" style={{ width: "100%" }} onClick={() => { setCapturedImage(null); setShowCameraVerification(true); }}>Back to Retake Photo</button>
                <button className="btn btn-primary btn-primary-lg" style={{ width: "100%" }} onClick={continueToInterviewAfterCapture} disabled={uploadingExamImage}>
                  {uploadingExamImage ? (<><svg className="spinner" width={15} height={15} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity=".25" /><path fill="currentColor" opacity=".75" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" /></svg> Uploading image...</>) : ("Continue to Interview →")}
                </button>
              </div>
            </div>
          )}

          {/* ══════ WELCOME ══════ */}
          {showWelcome && !round3Done && !showRound4 && !showRound5 && (
            <div>
              <div className="welcome-hero">
                <div className="welcome-badge">AI-Powered Assessment</div>

                <div className="ai-typing-bubble">
                  <span style={{ fontSize: 18 }}>🤖</span>
                  <span className="ai-typing-text">{typingText}<span className="cursor-blink" /></span>
                </div>

                <h1 className="welcome-title">Ace Your Next<br /><em>Tech Interview</em></h1>
                <p className="welcome-sub">Upload your resume and get a personalised AI-powered interview tailored to your skills, experience, and target role.</p>

                <div className="cta-group">
                  <button className="btn btn-outline btn-primary-lg" onClick={openPreviousResults} disabled={resultLoading}>
                    {resultLoading ? (<><svg className="spinner" width={15} height={15} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity=".25" /><path fill="currentColor" opacity=".75" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" /></svg> Loading</>) : ("View Previous Results")}
                  </button>
                  <button className="btn btn-primary btn-primary-lg" onClick={() => { setShowWelcome(false); setShowUpload(true); }}>Start Interview →</button>
                </div>
                <div className="cta-note">Upload resume &nbsp;·&nbsp; AI-generated questions &nbsp;·&nbsp; Instant scored feedback</div>

                <div className="stats-strip">
                  <div className="stat-pill"><div className="stat-dot" style={{ background: "var(--brand)" }} /><span>45–60 min total</span></div>
                  <div className="stat-pill"><div className="stat-dot" style={{ background: "var(--info)" }} /><span>34 questions</span></div>
                  <div className="stat-pill"><div className="stat-dot" style={{ background: "var(--success)" }} /><span>Instant AI feedback</span></div>
                </div>

                <div className="round-grid">
                  {[
                    { n: 1, name: "Skill Check", qs: "8 questions", time: "30s each", desc: "Multiple-choice questions testing your core technical fundamentals and role knowledge.", color: "#0F7B3A" },
                    { n: 2, name: "Scenario Round", qs: "5 questions", time: "120s each", desc: "Written responses to real-world scenarios that assess judgement, reasoning, and communication.", color: "#0F62FE" },
                    { n: 3, name: "Coding Challenge", qs: "3 questions", time: "300s each", desc: "Live coding problems with execution, input/output validation, and constraint checking.", color: "#B45309" },
                    { n: 4, name: "Communication Round", qs: "8 questions", time: "90s each", desc: "HR & behavioural MCQs read aloud via voice. Listen and select the best answer.", color: "#7B4DFF" },
                    { n: 5, name: "HR Interview", qs: "6 questions", time: "120s each", desc: "Voice-based open-ended HR questions. Speak or type your answer and get AI feedback.", color: "#E91E8C" },
                  ].map((r) => (
                    <div key={r.n} className="round-card" style={{ "--round-color": r.color } as any}>
                      <div className="round-icon-badge" style={{ background: r.color }}>{r.n}</div>
                      <div className="round-card-name">{r.name}</div>
                      <div className="round-card-meta"><span>{r.qs}</span><span>·</span><span>{r.time}</span></div>
                      <p className="round-card-desc">{r.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="how-works">
                  <div className="how-works-head">
                    <div className="how-kicker">How It Works</div>
                    <h2 className="how-title">Five steps to interview-ready</h2>
                    <p className="how-sub">A guided flow that turns your resume into a personalised, scored interview across all 5 rounds.</p>
                  </div>
                  <div className="how-grid">
                    {[
                      { step: "01", title: "Upload Your Resume", desc: "AI parses your technical profile, skills, and years of experience automatically." },
                      { step: "02", title: "Questions Are Generated", desc: "Interview questions are tailored to your exact skill set, domain, and seniority level." },
                      { step: "03", title: "Complete Timed Rounds", desc: "Work through skill checks, scenario questions, and a coding challenge — each with a real time limit." },
                      { step: "04", title: "Get Instant Feedback", desc: "Receive a score, per-answer feedback, and actionable tips to improve before your real interview." },
                    ].map((item) => (
                      <div className="how-step" key={item.title}>
                        <div className="how-step-num">{item.step}</div>
                        <div className="how-step-title">{item.title}</div>
                        <p className="how-step-desc">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════ UPLOAD ══════ */}
          {showUpload && (
            <div style={{ maxWidth: 440, margin: "24px auto" }}>
              <div className="card">
                <div className="card-header">
                  <button className="btn btn-ghost" style={{ padding: "5px 10px", fontSize: 13 }} onClick={() => { setShowUpload(false); setShowWelcome(true); }}>← Back</button>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-1)" }}>Upload Resume</div>
                    <div style={{ fontSize: 12.5, color: "var(--text-3)" }}>AI will analyse your skills and experience</div>
                  </div>
                </div>
                <div className="card-body">
                  <div className={`dropzone${dragOver ? " active" : ""}`} onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) setSelectedFile(f); }}>
                    <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: "none" }} onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                    <div className="dropzone-icon">{selectedFile ? "📄" : "📁"}</div>
                    {selectedFile ? (
                      <><div className="dropzone-title">{selectedFile.name}</div><div className="dropzone-sub" style={{ color: "var(--brand)" }}>✓ Selected — click to change</div></>
                    ) : (
                      <><div className="dropzone-title">Drop your resume here</div><div className="dropzone-sub">or click to browse — PDF, DOC, DOCX, TXT</div></>
                    )}
                  </div>
                  <button className="btn btn-primary btn-primary-lg" style={{ width: "100%", marginTop: 14 }} disabled={!selectedFile} onClick={onUploadResume}>
                    {selectedFile ? "Analyse Resume →" : "Select a file to continue"}
                  </button>
                  <div className="info-box" style={{ marginTop: 14 }}>
                    <div className="info-box-title">What happens next</div>
                    AI extracts your technical skills & experience · Personalised questions are generated · You get instant scored feedback on every answer
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════ ANALYSING ══════ */}
          {(showAnalyzing || showAnalysisMessage) && (
            <div className="analyzing-wrap">
              <div className="analyzing-card">
                <div className="spin-bot">🤖</div>
                {showAnalyzing ? (
                  <>
                    <div style={{ fontSize: 17, fontWeight: 700, fontFamily: "var(--font-head)", color: "var(--text-1)", marginBottom: 6 }}>Analysing your resume</div>
                    <div style={{ fontSize: 13.5, color: "var(--text-3)", marginBottom: 22 }}>AI is processing your profile data…</div>
                    <div className="progress-steps">
                      {["Parsing document structure", "Extracting technical skills", "Generating question matrix"].map((s, i) => (
                        <div key={i} className="progress-step">
                          <div className="progress-step-dot" style={{ animationDelay: `${i * 0.3}s` }} />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 17, fontWeight: 700, fontFamily: "var(--font-head)", color: "var(--text-1)", marginBottom: 14 }}>Analysis complete!</div>
                    <div className="info-box">
                      <p style={{ fontSize: 13.5, color: "var(--brand)", lineHeight: 1.65 }}>
                        {analysisTypingText}<span className="cursor-blink" />
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ══════ PRE-INTERVIEW ══════ */}
          {!showWelcome && !showUpload && !showAnalyzing && !showAnalysisMessage && !showCameraVerification && !showRound4 && !showRound5 && !round3Done && !question && (
            <div className="two-col">
              {/* Left — Resume */}
              <div className="card">
                {!parsed ? (
                  <>
                    <div className="card-header">
                      <div style={{ width: 32, height: 32, borderRadius: "var(--r-md)", background: "var(--brand-subtle)", border: "1px solid var(--brand-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--brand)" }}>CV</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}>Upload Resume</div>
                        <div style={{ fontSize: 12, color: "var(--text-3)" }}>Required to start</div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="dropzone" onClick={() => fileInputRef.current?.click()}>
                        <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: "none" }} onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                        <div className="dropzone-icon">{selectedFile ? "📄" : "📁"}</div>
                        {selectedFile ? (
                          <><div className="dropzone-title">{selectedFile.name}</div><div className="dropzone-sub" style={{ color: "var(--brand)" }}>✓ Click to change</div></>
                        ) : (
                          <><div className="dropzone-title">Click to upload</div><div className="dropzone-sub">PDF, DOC, DOCX, TXT</div></>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                        <button className="btn btn-primary" style={{ flex: 1 }} disabled={loading || !selectedFile} onClick={onUploadResume}>
                          {loading ? (<><SpinnerIcon /> Parsing…</>) : ("Analyse Resume")}
                        </button>
                        {selectedFile && (
                          <button className="btn btn-outline" onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}>Clear</button>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="profile-header">
                      <div className="profile-avatar-lg">{parsed.name ? parsed.name.charAt(0).toUpperCase() : "C"}</div>
                      <div>
                        <div className="profile-name">{parsed.name || "Candidate"}</div>
                        <div className="profile-verified">✓ Profile Extracted</div>
                      </div>
                    </div>
                    <div className="card-body">
                      {parsed.skills?.length > 0 && (
                        <><div className="section-label">Technical Skills</div>
                        <div style={{ marginBottom: 16 }}>{parsed.skills.map((s: string, i: number) => <span key={i} className="tag tag-skill">{s}</span>)}</div></>
                      )}
                      {yearsOfExperience > 0 && (
                        <><div className="section-label">Experience</div>
                        <div style={{ marginBottom: 16 }}><span className="tag tag-exp">{yearsOfExperience} {yearsOfExperience === 1 ? "year" : "years"}</span></div></>
                      )}
                      {parsed.domains?.length > 0 && (
                        <><div className="section-label">Domains</div>
                        <div style={{ marginBottom: 16 }}>{parsed.domains.map((d: string, i: number) => <span key={i} className="tag tag-domain">{d}</span>)}</div></>
                      )}
                      <div style={{ paddingTop: 14, borderTop: "1px solid var(--border-1)" }}>
                        <button className="btn btn-outline" style={{ width: "100%" }} onClick={() => { setParsed(null); setSelectedFile(null); setCapturedImage(null); setShowCameraVerification(false); setStatus(""); sessionStorage.removeItem(FLOW_STATE_KEY); if (fileInputRef.current) fileInputRef.current.value = ""; }}>
                          Edit Resume
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Right — Assessment */}
              <div className="card">
                <div className="card-header">
                  <div style={{ width: 32, height: 32, borderRadius: "var(--r-md)", background: "var(--info-subtle)", border: "1px solid var(--info-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "var(--info)" }}>5</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}>Assessment Structure</div>
                    <div style={{ fontSize: 12, color: "var(--text-3)" }}>5 rounds · 34 questions</div>
                  </div>
                </div>
                <div className="card-body">
                  {[
                    { n: 1, name: "Skill Check", sub: "Multiple choice questions", qs: "8 questions", time: "30s each", color: "#0F7B3A" },
                    { n: 2, name: "Scenario Round", sub: "Real-world problem solving", qs: "5 questions", time: "120s each", color: "#0F62FE" },
                    { n: 3, name: parsed && isNonTechnical(parsed.skills, parsed.domains) ? "Professional Assessment" : "Coding Challenge", sub: parsed && isNonTechnical(parsed.skills, parsed.domains) ? "Domain-specific questions" : "Live coding challenges", qs: "3 questions", time: "300s each", color: "#B45309" },
                    { n: 4, name: "Communication Round", sub: "HR & behavioural MCQs (voice)", qs: "8 questions", time: "90s each", color: "#7B4DFF" },
                    { n: 5, name: "HR Interview", sub: "Open-ended voice answers", qs: "6 questions", time: "120s each", color: "#E91E8C" },
                  ].map((r) => (
                    <div key={r.n} className="round-row">
                      <div className="round-num-badge" style={{ background: r.color }}>{r.n}</div>
                      <div style={{ flex: 1 }}>
                        <div className="round-info-title">{r.name}</div>
                        <div className="round-info-sub">{r.sub}</div>
                        <div className="round-chips"><div className="chip">{r.qs}</div><div className="chip">{r.time}</div></div>
                      </div>
                    </div>
                  ))}

                  <div style={{ paddingTop: 18, borderTop: "1px solid var(--border-1)", marginTop: 6 }}>
                    {parsed ? (
                      <button className="btn btn-primary btn-primary-lg" style={{ width: "100%" }} disabled={loading || showRound4 || showRound5} onClick={startInterview}>
                        {loading ? (<><SpinnerIcon /> Starting…</>) : showRound4 || showRound5 ? "Assessment Complete ✓" : !capturedImage ? "Continue to Verification →" : "Start Assessment →"}
                      </button>
                    ) : (
                      <div style={{ textAlign: "center", fontSize: 13.5, color: "var(--text-3)", padding: "14px", background: "var(--surface-1)", borderRadius: "var(--r-lg)", border: "1px solid var(--border-1)" }}>Upload your resume to begin</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════ ROUND 3 COMPLETE → START ROUND 4 ══════ */}
          {round3Done && !showRound4 && !showRound5 && (
            <div style={{ maxWidth: 460, margin: "60px auto", textAlign: "center" }}>
              <div className="card">
                <div style={{ padding: "48px 36px" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                  <div style={{ fontFamily: "var(--font-head)", fontSize: 22, fontWeight: 700, color: "var(--text-1)", marginBottom: 8 }}>Round 3 Complete!</div>
                  <div style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 32, lineHeight: 1.6 }}>Great work finishing the Coding Challenge.<br />Next up: Round 4 — Communication (Voice MCQ)</div>
                  <button className="btn btn-primary btn-primary-lg" style={{ width: "100%" }} onClick={() => { setRound3Done(false); setShowRound4(true); }}>
                    Start Round 4 — Communication →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══════ QUESTION VIEW ══════ */}
          {question && !showRound4 && !showRound5 && (
            <div style={{ maxWidth: 800, margin: "0 auto" }} ref={questionRef}>
              <div className="card">
                {/* Q Header */}
                <div className="q-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="q-round-badge" style={{ background: roundColors[round || 1] }}>{round}</div>
                    <div>
                      <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--text-1)" }}>Round {round}: {roundType}</div>
                      <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>Question {qNo} of {totalQ}</div>
                    </div>
                  </div>
                  <div style={{ flex: 1, maxWidth: 180, display: "flex", flexDirection: "column", gap: 5, margin: "0 16px" }}>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar-fill" style={{ width: `${(qNo / totalQ) * 100}%` }} />
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-3)", textAlign: "center" }}>{qNo} of {totalQ} complete</div>
                  </div>
                  <div className={`timer-chip ${timerStopped ? "timer-stopped" : timeLeft <= 10 ? "timer-urgent" : "timer-normal"}`}>
                    <span>⏱</span>
                    <span>{timerStopped ? "Done" : timeLeft + "s"}</span>
                  </div>
                </div>

                {roundDescription && <div className="round-desc-bar">{roundDescription}</div>}

                <div style={{ padding: "18px 20px" }}>
                  {/* Question content */}
                  <div style={{ marginBottom: 18 }}>
                    {round === 3 && !nonTechnical ? (
                      <div className="q-box">
                        {parsed?.skills?.length > 0 && (
                          <div style={{ marginBottom: 12, fontSize: 12, color: "var(--text-3)" }}>
                            💡 Based on: {parsed.skills.slice(0, 3).join(", ")}
                          </div>
                        )}
                        {(() => {
                          const lines = question.split("\n");
                          let cs = "", sc: string[] = [];
                          const secs: { type: string; content: string[] }[] = [];
                          lines.forEach((line) => {
                            const t = line.trim().replace(/\*+/g, "").trim();
                            if (!t) return;
                            if (t.toLowerCase().startsWith("problem") || t.toLowerCase().startsWith("given")) { if (cs) secs.push({ type: cs, content: sc }); cs = "problem"; sc = [t.replace(/^(problem|given)[:\s]*/i, "")]; }
                            else if (t.toLowerCase().startsWith("function")) { if (cs) secs.push({ type: cs, content: sc }); cs = "function"; sc = [t]; }
                            else if (t.toLowerCase().startsWith("example")) { if (cs) secs.push({ type: cs, content: sc }); cs = "example"; sc = []; }
                            else if (t.toLowerCase().startsWith("constraint")) { if (cs) secs.push({ type: cs, content: sc }); cs = "constraints"; sc = [t.replace(/^constraints?[:\s]*/i, "")]; }
                            else if (t.toLowerCase().startsWith("notes")) { if (cs) secs.push({ type: cs, content: sc }); cs = "notes"; sc = [t.replace(/^notes?[:\s]*/i, "")]; }
                            else sc.push(t.replace(/^[-#\s]+/, ""));
                          });
                          if (cs) secs.push({ type: cs, content: sc });
                          return secs.map((s, i) => {
                            if (s.type === "problem") return (
                              <div key={i} className="q-section q-section-problem">
                                <div className="q-section-label" style={{ color: "var(--brand)" }}>Problem</div>
                                {s.content.map((l, j) => <p key={j} style={{ fontSize: 14, color: "var(--text-1)", lineHeight: 1.65 }}>{l}</p>)}
                              </div>
                            );
                            if (s.type === "function") return (
                              <div key={i} className="q-section q-section-function">
                                <div className="q-section-label" style={{ color: "var(--success)" }}>Function Signature</div>
                                <code style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--text-1)" }}>{s.content[0]}</code>
                              </div>
                            );
                            if (s.type === "example") return (
                              <div key={i} className="q-section q-section-example">
                                <div className="q-section-label" style={{ color: "var(--info)" }}>Examples</div>
                                {s.content.map((l, j) => (
                                  <div key={j} style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: l.toLowerCase().includes("input") ? "var(--success)" : l.toLowerCase().includes("output") ? "var(--brand)" : "var(--text-1)" }}>{l}</div>
                                ))}
                              </div>
                            );
                            if (s.type === "constraints") return (
                              <div key={i} className="q-section q-section-constraint">
                                <div className="q-section-label" style={{ color: "var(--warning)" }}>Constraints</div>
                                {s.content.map((l, j) => <p key={j} style={{ fontSize: 13, color: "var(--text-1)" }}>• {l}</p>)}
                              </div>
                            );
                            return null;
                          });
                        })()}
                      </div>
                    ) : round === 2 || (round === 3 && nonTechnical) ? (
                      <div className="q-box">
                        {question.split("\n").map((line, i) => {
                          const t = line.trim();
                          if (!t) return null;
                          if (t.startsWith("**Situation:**")) return (
                            <div key={i} className="q-section q-section-function">
                              <div className="q-section-label" style={{ color: "var(--success)" }}>Situation</div>
                              <p style={{ fontSize: 14, color: "var(--text-1)", lineHeight: 1.65 }}>{t.replace("**Situation:**", "").trim()}</p>
                            </div>
                          );
                          if (t.startsWith("**Question:**")) return (
                            <div key={i} className="q-section q-section-example">
                              <div className="q-section-label" style={{ color: "var(--info)" }}>Question</div>
                              <p style={{ fontSize: 14, color: "var(--text-1)", lineHeight: 1.65, fontWeight: 500 }}>{t.replace("**Question:**", "").trim()}</p>
                            </div>
                          );
                          return <p key={i} style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 6 }}>{t}</p>;
                        })}
                      </div>
                    ) : (
                      <h3 style={{ fontSize: 15.5, fontWeight: 500, color: "var(--text-1)", lineHeight: 1.65 }}>
                        {question.split(/[ABCD]\)/)[0].replace("Question:", "").trim()}
                      </h3>
                    )}
                  </div>

                  {/* MCQ */}
                  {round === 1 && question.includes("A)") && (
                    <div style={{ marginBottom: 18 }}>
                      {["A", "B", "C", "D"].map((opt) => {
                        const text = question.split(`${opt})`)[1]?.split(/[\n\r]|[BCD]\)/)[0]?.trim();
                        if (!text) return null;
                        const isSel = selectedOption === opt;
                        const showResult = showFeedback && currentFeedback;
                        const isCorrectOpt = showResult && isSel && (currentFeedback!.score >= 5);
                        const isWrongOpt = showResult && isSel && (currentFeedback!.score < 5);
                        return (
                          <label key={opt}
                            className={`mcq-option${isSel && !showFeedback ? " selected" : ""}${isCorrectOpt ? " correct" : ""}${isWrongOpt ? " incorrect" : ""}${showFeedback ? " disabled" : ""}`}
                            onClick={() => !showFeedback && setSelectedOption(opt)}>
                            <div className="mcq-radio">{isSel && !showFeedback && <div className="mcq-dot" />}</div>
                            <span className="mcq-letter">{opt}.</span>
                            <span className="mcq-text">{text}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Text / Code Answer */}
                  {round !== 1 && (
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-1)" }}>{round === 3 && !nonTechnical ? "Your Code" : "Your Answer"}</div>
                        {round === 3 && !nonTechnical ? (
                          <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>Lines: {lineCount}</span>
                        ) : round === 2 ? (
                          <span className={`char-counter ${charCount >= 300 ? "char-ok" : "char-warn"}`}>{charCount} / 300 min</span>
                        ) : null}
                      </div>
                      <textarea
                        ref={answerRef}
                        disabled={timeLeft <= 0 || showFeedback}
                        className={`ai-textarea${round === 3 && !nonTechnical ? " mono" : ""}`}
                        placeholder={timeLeft <= 0 ? "Time expired — submitted automatically" : round === 3 && !nonTechnical ? getPlaceholder(selectedLanguage) : round === 2 ? "Describe your approach:\n\n1. Immediate action:\n2. Reasoning:\n3. Expected outcome:" : "Enter your answer…"}
                        style={{ minHeight: round === 3 ? 300 : round === 2 ? 230 : 140 }}
                        onChange={(e) => { if (round === 3 && !nonTechnical) setLineCount(e.target.value.split("\n").length); if (round === 2) setCharCount(e.target.value.length); }}
                        onPaste={blockClipboardAction}
                        onCopy={blockClipboardAction}
                        onCut={blockClipboardAction}
                        onDrop={undefined}
                        autoComplete="off"
                        spellCheck={false}
                        key={`question-${qNo}-${round}`}
                        defaultValue=""
                      />

                      {/* Code runner */}
                      {round === 3 && !nonTechnical && (
                        <div style={{ marginTop: 14 }}>
                          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
                            <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} disabled={showFeedback} className="lang-select">
                              {languageOptions.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                            </select>
                            <button className="btn btn-success" style={{ padding: "8px 16px" }} disabled={loading || !answerRef.current?.value.trim() || showFeedback} onClick={runCode}>
                              {loading ? (<><SpinnerIcon /> Running…</>) : ("▶ Run Code")}
                            </button>
                            <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>Compiled & executed server-side</span>
                          </div>

                          {(codeOutput || codeError) && (
                            <div className="code-terminal">
                              <div className="code-terminal-bar">
                                <div className="code-terminal-dots">
                                  <div className="code-terminal-dot" style={{ background: "#FF5F57" }} />
                                  <div className="code-terminal-dot" style={{ background: "#FFBD2E" }} />
                                  <div className="code-terminal-dot" style={{ background: "#28CA41" }} />
                                </div>
                                <div className="code-terminal-label" style={{ color: codeError ? "#F85149" : "#3FB950" }}>{codeError ? "⚠ Runtime Error" : "✓ Output"}</div>
                                <div style={{ width: 60 }} />
                              </div>
                              <div className="code-terminal-body">
                                {codeOutput && (<><div className="code-label">STDOUT</div><div className="code-output-text">{codeOutput}</div></>)}
                                {codeError && (<><div className="code-label">ERROR</div><div className="code-error-text">{codeError}</div></>)}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Feedback — hidden from candidate (real interview mode) */}
                  {showFeedback && currentFeedback && (
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
                      <button className="btn btn-primary" onClick={() => {
                        if (nextQuestionData?.__goToRound4) {
                          setShowFeedback(false); setCurrentFeedback(null); setNextQuestionData(null);
                          setQuestion(""); setTimerStopped(false); setCharCount(0);
                          setShowWelcome(false); setShowRound4(true); return;
                        }
                        if (nextQuestionData?.question) {
                          setRound(nextQuestionData.round); setQNo(nextQuestionData.question_no);
                          setTotalQ(nextQuestionData.total_questions || getQuestionCount(nextQuestionData.round));
                          setQuestion(nextQuestionData.question);
                          setAskedQuestions((p) => [...p, nextQuestionData.question]);
                          setTimePerQuestion(getTimeLimit(nextQuestionData.round)); setTimeLeft(getTimeLimit(nextQuestionData.round));
                          setSelectedOption("");
                          if (answerRef.current) answerRef.current.value = "";
                          setCodeOutput(""); setCodeError(""); setLineCount(1); setCharCount(0); setNextQuestionData(null);
                        }
                        setShowFeedback(false); setCurrentFeedback(null); setTimerStopped(false); setCharCount(0);
                      }}>
                        {nextQuestionData?.__goToRound4 ? "Start Round 4 →" : "Next Question →"}
                      </button>
                    </div>
                  )}

                  {/* Submit */}
                  <div style={{ paddingTop: 16, borderTop: "1px solid var(--border-1)" }}>
                    {!showFeedback ? (
                      <button className="btn btn-primary btn-primary-lg" style={{ width: "100%" }} disabled={loading || submitting || (round === 1 && !selectedOption)} onClick={submitAnswer}>
                        {loading || submitting ? (
                          <><SpinnerIcon /> {submitting ? "Submitting…" : "Evaluating…"}</>
                        ) : timeLeft <= 0 ? "Submit Answer (Time Expired)" : "Submit Answer →"}
                      </button>
                    ) : (
                      <div style={{ textAlign: "center", fontSize: 13, color: "var(--text-3)" }}>Click "Next Question" above to continue</div>
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
