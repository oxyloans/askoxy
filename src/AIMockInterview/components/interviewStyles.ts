export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* â”€â”€ Design tokens â”€â”€ */
  .theme-light {
    --brand:          #0F62FE;
    --brand-hover:    #0353E9;
    --brand-subtle:   #EFF4FF;
    --brand-border:   #C6D6FF;
    --accent:         #7B4DFF;
    --accent-subtle:  #F3EEFF;
    --success:        #0F7B3A;
    --success-bg:     #EAFAF1;
    --success-border: #A3DDB9;
    --warning:        #B45309;
    --warning-bg:     #FFFBEB;
    --warning-border: #F4CE85;
    --danger:         #C51D1D;
    --danger-bg:      #FFF0F0;
    --danger-border:  #F4AAAA;
    --text-1:         #0D0D12;
    --text-2:         #3D3D4E;
    --text-3:         #7B7B8F;
    --text-4:         #A8A8BC;
    --surface-0:      #FFFFFF;
    --surface-1:      #F7F8FC;
    --surface-2:      #EEF0F8;
    --surface-3:      #E4E6F4;
    --border-1:       rgba(15,18,40,.07);
    --border-2:       rgba(15,18,40,.12);
    --border-3:       rgba(15,18,40,.18);
    --shadow-xs:      0 1px 3px rgba(15,18,40,.06), 0 1px 2px rgba(15,18,40,.04);
    --shadow-sm:      0 4px 12px rgba(15,18,40,.07), 0 2px 4px rgba(15,18,40,.05);
    --shadow-md:      0 8px 24px rgba(15,18,40,.09), 0 4px 8px rgba(15,18,40,.06);
    --shadow-lg:      0 20px 48px rgba(15,18,40,.12), 0 8px 16px rgba(15,18,40,.07);
    --radius-xs:      6px;
    --radius-sm:      10px;
    --radius-md:      14px;
    --radius-lg:      20px;
    --radius-xl:      28px;
    --header-bg:      rgba(255,255,255,.88);
    --code-bg:        #0D1117;
    --code-text:      #E6EDF3;
    --code-green:     #3FB950;
    --code-red:       #F85149;
    --code-border:    rgba(255,255,255,.08);
  }

  .theme-dark {
    --brand:          #4D8EFF;
    --brand-hover:    #6BA3FF;
    --brand-subtle:   rgba(77,142,255,.12);
    --brand-border:   rgba(77,142,255,.28);
    --accent:         #A07BFF;
    --accent-subtle:  rgba(160,123,255,.12);
    --success:        #34C875;
    --success-bg:     rgba(52,200,117,.1);
    --success-border: rgba(52,200,117,.28);
    --warning:        #FFBA2E;
    --warning-bg:     rgba(255,186,46,.1);
    --warning-border: rgba(255,186,46,.28);
    --danger:         #FF6B6B;
    --danger-bg:      rgba(255,107,107,.1);
    --danger-border:  rgba(255,107,107,.28);
    --text-1:         #F0F2FF;
    --text-2:         #B8BBDA;
    --text-3:         #787A96;
    --text-4:         #4A4C64;
    --surface-0:      #12131E;
    --surface-1:      #0D0E18;
    --surface-2:      #090A12;
    --surface-3:      #1A1B2E;
    --border-1:       rgba(240,242,255,.06);
    --border-2:       rgba(240,242,255,.10);
    --border-3:       rgba(240,242,255,.16);
    --shadow-xs:      0 1px 3px rgba(0,0,0,.25);
    --shadow-sm:      0 4px 12px rgba(0,0,0,.30);
    --shadow-md:      0 8px 24px rgba(0,0,0,.38);
    --shadow-lg:      0 20px 48px rgba(0,0,0,.48);
    --radius-xs:      6px;
    --radius-sm:      10px;
    --radius-md:      14px;
    --radius-lg:      20px;
    --radius-xl:      28px;
    --header-bg:      rgba(13,14,24,.88);
    --code-bg:        #0D1117;
    --code-text:      #E6EDF3;
    --code-green:     #3FB950;
    --code-red:       #F85149;
    --code-border:    rgba(255,255,255,.08);
  }

  /* â”€â”€ Base â”€â”€ */
  .ai-bg {
    min-height: 100vh;
    font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    font-size: 15px;
    line-height: 1.6;
    color: var(--text-1);
    background: var(--surface-1);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    position: relative;
    isolation: isolate;
    text-align: left;

  .ai-bg *, .ai-bg *::before, .ai-bg *::after {
    box-sizing: border-box;
  }

  /* â”€â”€ Header â”€â”€ */
  .ai-header {
    position: sticky;
    top: 0;
    z-index: 9000;
    background: var(--header-bg);
    backdrop-filter: blur(20px) saturate(1.4);
    -webkit-backdrop-filter: blur(20px) saturate(1.4);
    border-bottom: 1px solid var(--border-1);
    box-shadow: var(--shadow-xs);
  }

  .ai-header-inner {
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 24px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .ai-logo-group {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
  }

  .ai-logo-divider {
    width: 1px;
    height: 28px;
    background: var(--border-2);
    flex-shrink: 0;
  }

  .ai-header-label {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }

  .ai-header-title {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: var(--text-1);
    white-space: nowrap;
  }

  .ai-header-sub {
    font-size: 11.5px;
    color: var(--text-3);
    white-space: nowrap;
  }

  .ai-header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .theme-toggle {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    height: 36px;
    padding: 0 14px;
    border: 1px solid var(--border-2);
    border-radius: 999px;
    background: var(--surface-0);
    color: var(--text-2);
    font-family: inherit;
    font-size: 12.5px;
    font-weight: 500;
    cursor: pointer;
    transition: all .15s;
  }

  .theme-toggle:hover {
    border-color: var(--border-3);
    background: var(--surface-2);
    color: var(--text-1);
  }

  .ai-user-chip {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 4px 12px 4px 4px;
    background: var(--surface-0);
    border: 1px solid var(--border-2);
    border-radius: 999px;
    cursor: default;
    transition: border-color .15s;
  }

  .ai-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--brand), var(--accent));
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    flex-shrink: 0;
  }

  .ai-user-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-1);
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* â”€â”€ Layout â”€â”€ */
  .ai-main {
    max-width: 1320px;
    margin: 0 auto;
    padding: 24px 24px 56px;
  }

  /* â”€â”€ Card system â”€â”€ */
  .card {
    background: var(--surface-0);
    border: 1px solid var(--border-1);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 18px 22px;
    border-bottom: 1px solid var(--border-1);
    background: var(--surface-0);
  }

  .card-body {
    padding: 22px;
  }

  /* â”€â”€ Buttons â”€â”€ */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: all .15s;
    outline: none;
    white-space: normal;
    text-align: center;
    line-height: 1.3;
    letter-spacing: .01em;
  }

  .btn:disabled {
    opacity: .45;
    cursor: not-allowed;
    transform: none !important;
  }

  .btn-primary {
    background: var(--brand);
    color: #fff;
    padding: 10px 20px;
    border: 1px solid transparent;
    box-shadow: 0 1px 2px rgba(15,98,254,.3), inset 0 1px 0 rgba(255,255,255,.15);
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--brand-hover);
    box-shadow: 0 4px 12px rgba(15,98,254,.35), inset 0 1px 0 rgba(255,255,255,.15);
    transform: translateY(-1px);
  }

  .btn-primary:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(15,98,254,.2);
  }

  .btn-primary-lg {
    padding: 13px 28px;
    font-size: 15px;
    border-radius: var(--radius-md);
  }

  .btn-outline {
    background: var(--surface-0);
    color: var(--text-2);
    padding: 9px 16px;
    border: 1px solid var(--border-2);
  }

  .btn-outline:hover:not(:disabled) {
    background: var(--surface-2);
    color: var(--text-1);
    border-color: var(--border-3);
  }

  .btn-ghost {
    background: transparent;
    color: var(--text-3);
    padding: 7px 12px;
    border: 1px solid transparent;
  }

  .btn-ghost:hover:not(:disabled) {
    background: var(--surface-2);
    color: var(--text-1);
  }

  .btn-success {
    background: var(--success);
    color: #fff;
    padding: 9px 16px;
    border: 1px solid transparent;
    box-shadow: 0 1px 2px rgba(15,123,58,.25);
  }

  .btn-success:hover:not(:disabled) {
    filter: brightness(1.08);
    transform: translateY(-1px);
  }

  .btn-danger {
    background: var(--danger-bg);
    color: var(--danger);
    padding: 9px 16px;
    border: 1px solid var(--danger-border);
  }

  /* â”€â”€ Welcome hero â”€â”€ */
  .welcome-hero {
    max-width: 960px;
    margin: 0 auto;
    padding: 56px 0 48px;
    text-align: center;
  }

  .welcome-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 999px;
    background: var(--brand-subtle);
    border: 1px solid var(--brand-border);
    color: var(--brand);
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    margin-bottom: 18px;
  }

  .welcome-badge::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--success);
    animation: pulse-live 2s ease-in-out infinite;
  }

  @keyframes pulse-live {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: .5; transform: scale(.8); }
  }

  .ai-typing-bubble {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 18px;
    background: var(--surface-0);
    border: 1px solid var(--border-2);
    border-radius: 999px;
    box-shadow: var(--shadow-sm);
    margin-bottom: 22px;
    max-width: min(100%, 680px);
  }

  .ai-typing-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--brand), var(--accent));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }

  .ai-typing-text {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-1);
    text-align: left;
    overflow-wrap: anywhere;
  }

  .cursor-blink {
    display: inline-block;
    width: 2px;
    height: 14px;
    background: var(--brand);
    margin-left: 2px;
    vertical-align: middle;
    animation: blink-cursor .65s step-end infinite;
  }

  @keyframes blink-cursor {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .welcome-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2.9rem, 6.5vw, 5rem);
    font-weight: 400;
    letter-spacing: -.02em;
    line-height: 1.05;
    color: var(--text-1);
    margin-bottom: 16px;
  }

  .welcome-title em {
    font-style: italic;
    background: linear-gradient(135deg, var(--brand) 0%, var(--accent) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .welcome-sub {
    font-size: 17px;
    color: var(--text-2);
    line-height: 1.7;
    max-width: 560px;
    margin: 0 auto 28px;
  }

  .cta-group {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 10px;
  }

  .cta-note {
    font-size: 12.5px;
    color: var(--text-3);
    margin-top: 10px;
  }

  .stats-strip {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    margin: 24px 0 32px;
  }

  .stat-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: var(--surface-0);
    border: 1px solid var(--border-1);
    border-radius: 999px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-2);
    box-shadow: var(--shadow-sm);
  }

  .stat-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--brand);
    flex-shrink: 0;
  }

  /* â”€â”€ Round cards grid â”€â”€ */
  .round-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin: 0 0 32px;
  }

  .round-card {
    background: var(--surface-0);
    border: 1px solid var(--border-1);
    border-radius: var(--radius-lg);
    padding: 24px;
    text-align: left;
    box-shadow: var(--shadow-sm);
    transition: all .2s;
    position: relative;
    overflow: hidden;
    isolation: isolate;
  }

  .round-card::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: radial-gradient(circle, var(--round-color, rgba(15,98,254,.08)), transparent 72%);
    transform: translate(20%, -20%);
    pointer-events: none;
    z-index: 0;
  }

  .round-card > * { position: relative; z-index: 1; }

  .round-card:hover {
    border-color: var(--border-3);
    box-shadow: var(--shadow-md);
    transform: translateY(-3px);
  }

  .round-icon-badge {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 16px;
    box-shadow: var(--shadow-md);
  }

  .round-card-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-1);
    margin-bottom: 6px;
  }

  .round-card-meta {
    display: flex;
    gap: 6px;
    align-items: center;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-3);
    margin-bottom: 10px;
    flex-wrap: wrap;
  }

  .round-card-desc {
    font-size: 13.5px;
    color: var(--text-2);
    line-height: 1.65;
  }

  /* â”€â”€ How it works â”€â”€ */
  .how-works {
    background: var(--surface-0);
    border: 1px solid var(--border-1);
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow: var(--shadow-md);
  }

  .how-works-head {
    padding: 32px 32px 24px;
    background: linear-gradient(135deg, var(--surface-0) 60%, var(--brand-subtle));
    border-bottom: 1px solid var(--border-1);
  }

  .how-kicker {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border-radius: 999px;
    background: var(--brand-subtle);
    border: 1px solid var(--brand-border);
    color: var(--brand);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .how-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(1.6rem, 3vw, 2.4rem);
    font-weight: 400;
    color: var(--text-1);
    letter-spacing: -.02em;
    margin-bottom: 10px;
    line-height: 1.15;
  }

  .how-sub {
    font-size: 14.5px;
    color: var(--text-2);
    line-height: 1.65;
    max-width: 600px;
  }

  .how-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    background: var(--border-1);
  }

  .how-step {
    background: var(--surface-0);
    padding: 28px 24px;
    position: relative;
    transition: background .18s;
  }

  .how-step:hover {
    background: var(--surface-1);
  }

  .how-step-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: var(--radius-sm);
    background: var(--brand);
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 16px;
    box-shadow: 0 4px 12px rgba(15,98,254,.25);
  }

  .how-step-icon-wrap {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-sm);
    background: linear-gradient(135deg, var(--brand), var(--accent));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    margin-bottom: 14px;
    box-shadow: var(--shadow-sm);
  }

  .how-step-title {
    font-size: 14.5px;
    font-weight: 600;
    color: var(--text-1);
    margin-bottom: 8px;
    line-height: 1.3;
  }

  .how-step-desc {
    font-size: 13px;
    color: var(--text-2);
    line-height: 1.6;
  }

  /* â”€â”€ Upload zone â”€â”€ */
  .dropzone {
    border: 2px dashed var(--border-2);
    border-radius: var(--radius-md);
    padding: 40px 24px;
    text-align: center;
    cursor: pointer;
    transition: all .18s;
    background: var(--surface-1);
  }

  .dropzone:hover, .dropzone.active {
    border-color: var(--brand);
    background: var(--brand-subtle);
  }

  .dropzone-icon {
    width: 52px;
    height: 52px;
    border-radius: var(--radius-md);
    background: var(--surface-2);
    border: 1px solid var(--border-2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin: 0 auto 12px;
  }

  .dropzone-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-1);
    margin-bottom: 4px;
    word-break: break-word;
  }

  .dropzone-sub {
    font-size: 13px;
    color: var(--text-3);
  }

  /* â”€â”€ Analyzing screen â”€â”€ */
  .analyzing-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 62vh;
  }

  .analyzing-card {
    background: var(--surface-0);
    border: 1px solid var(--border-1);
    border-radius: var(--radius-xl);
    padding: 48px 36px;
    text-align: center;
    max-width: 380px;
    width: 100%;
    box-shadow: var(--shadow-lg);
  }

  .spin-bot {
    width: 72px;
    height: 72px;
    border-radius: var(--radius-lg);
    background: linear-gradient(135deg, var(--brand), var(--accent));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    margin: 0 auto 22px;
    animation: spin-y 2.2s linear infinite;
    box-shadow: var(--shadow-md);
  }

  @keyframes spin-y {
    from { transform: rotateY(0deg); }
    to   { transform: rotateY(360deg); }
  }

  .progress-steps { text-align: left; margin-top: 22px; }

  .progress-step {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 9px 0;
    font-size: 13.5px;
    color: var(--text-2);
    border-bottom: 1px solid var(--border-1);
  }

  .progress-step:last-child { border-bottom: none; }

  .progress-step-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--brand);
    flex-shrink: 0;
    animation: pulse-live 1.8s ease-in-out infinite;
  }

  /* â”€â”€ Profile card â”€â”€ */
  .profile-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px 22px;
    background: var(--surface-1);
    border-bottom: 1px solid var(--border-1);
  }

  .profile-avatar-lg {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-md);
    background: linear-gradient(135deg, var(--brand), var(--accent));
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 20px;
    font-weight: 600;
    flex-shrink: 0;
  }

  .profile-name { font-size: 15px; font-weight: 600; color: var(--text-1); }
  .profile-verified {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11.5px;
    font-weight: 500;
    color: var(--success);
    background: var(--success-bg);
    border: 1px solid var(--success-border);
    padding: 2px 8px;
    border-radius: 999px;
    margin-top: 5px;
  }

  /* â”€â”€ Tags â”€â”€ */
  .tag {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 500;
    margin: 3px;
  }

  .tag-skill {
    background: var(--success-bg);
    color: var(--success);
    border: 1px solid var(--success-border);
  }

  .tag-domain {
    background: var(--brand-subtle);
    color: var(--brand);
    border: 1px solid var(--brand-border);
  }

  .tag-exp {
    background: var(--warning-bg);
    color: var(--warning);
    border: 1px solid var(--warning-border);
  }

  /* â”€â”€ Section label â”€â”€ */
  .section-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-bottom: 8px;
  }

  /* â”€â”€ Round row (assessment structure) â”€â”€ */
  .round-row {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 14px 0;
    border-bottom: 1px solid var(--border-1);
  }

  .round-row:last-child { border-bottom: none; }

  .round-num-badge {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
    box-shadow: var(--shadow-xs);
  }

  .round-info-title { font-size: 14px; font-weight: 600; color: var(--text-1); }
  .round-info-sub { font-size: 12.5px; color: var(--text-3); margin-top: 2px; }

  .round-chips {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-top: 7px;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    padding: 3px 9px;
    border-radius: 999px;
    font-size: 11.5px;
    font-weight: 500;
    color: var(--text-2);
    background: var(--surface-2);
    border: 1px solid var(--border-1);
  }

  /* â”€â”€ Question view â”€â”€ */
  .q-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding: 18px 22px;
    border-bottom: 1px solid var(--border-1);
    background: var(--surface-0);
  }

  .q-round-badge {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
    box-shadow: var(--shadow-xs);
  }

  /* â”€â”€ Timer â”€â”€ */
  .timer-chip {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 8px 16px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 700;
    border: 1.5px solid;
    font-variant-numeric: tabular-nums;
    letter-spacing: .01em;
    flex-shrink: 0;
  }

  .timer-normal {
    background: var(--warning-bg);
    color: var(--warning);
    border-color: var(--warning-border);
  }

  .timer-urgent {
    background: var(--danger-bg);
    color: var(--danger);
    border-color: var(--danger-border);
    animation: timer-flash .7s ease-in-out infinite;
  }

  .timer-stopped {
    background: var(--surface-2);
    color: var(--text-3);
    border-color: var(--border-2);
  }

  @keyframes timer-flash {
    0%, 100% { opacity: 1; }
    50%       { opacity: .65; }
  }

  /* â”€â”€ Progress bar â”€â”€ */
  .progress-bar-wrap {
    height: 4px;
    background: var(--surface-3);
    border-radius: 999px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background: var(--brand);
    border-radius: 999px;
    transition: width .35s ease;
  }

  /* â”€â”€ Question box â”€â”€ */
  .q-box {
    background: var(--surface-1);
    border: 1px solid var(--border-1);
    border-radius: var(--radius-md);
    padding: 18px;
    overflow-wrap: anywhere;
  }

  .q-section {
    padding: 12px 14px;
    border-radius: var(--radius-sm);
    border-left: 3px solid;
    margin-bottom: 10px;
  }

  .q-section:last-child { margin-bottom: 0; }
  .q-section-problem { background: var(--brand-subtle); border-color: var(--brand); }
  .q-section-function { background: var(--success-bg); border-color: var(--success); }
  .q-section-example { background: var(--accent-subtle); border-color: var(--accent); }
  .q-section-constraint { background: var(--warning-bg); border-color: var(--warning); }

  .q-section-label {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: .09em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  /* â”€â”€ MCQ â”€â”€ */
  .mcq-option {
    display: flex;
    align-items: flex-start;
    gap: 11px;
    padding: 13px 15px;
    border: 1.5px solid var(--border-2);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all .14s;
    margin-bottom: 9px;
    background: var(--surface-0);
    overflow-wrap: anywhere;
  }

  .mcq-option:hover:not(.disabled) {
    border-color: var(--brand);
    background: var(--brand-subtle);
  }

  .mcq-option.selected {
    border-color: var(--brand);
    background: var(--brand-subtle);
    box-shadow: 0 0 0 3px rgba(15,98,254,.1);
  }

  .mcq-option.correct {
    border-color: var(--success);
    background: var(--success-bg);
    box-shadow: 0 0 0 3px rgba(15,123,58,.1);
  }

  .mcq-option.incorrect {
    border-color: var(--danger);
    background: var(--danger-bg);
    box-shadow: 0 0 0 3px rgba(197,29,29,.1);
  }

  .mcq-option.disabled { cursor: not-allowed; }

  .mcq-radio {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid var(--border-3);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
    transition: all .14s;
  }

  .mcq-option.selected .mcq-radio { border-color: var(--brand); background: var(--brand); }
  .mcq-option.correct .mcq-radio { border-color: var(--success); background: var(--success); }
  .mcq-option.incorrect .mcq-radio { border-color: var(--danger); background: var(--danger); }

  .mcq-dot { width: 7px; height: 7px; border-radius: 50%; background: #fff; }

  .mcq-letter {
    font-size: 12px;
    font-weight: 700;
    color: var(--brand);
    min-width: 16px;
  }

  .mcq-option.correct .mcq-letter,
  .mcq-option.correct .mcq-text { color: var(--success); }

  .mcq-option.incorrect .mcq-letter,
  .mcq-option.incorrect .mcq-text { color: var(--danger); }

  .mcq-text {
    font-size: 14px;
    color: var(--text-1);
    line-height: 1.55;
  }

  /* â”€â”€ Textarea â”€â”€ */
  .ai-textarea {
    width: 100%;
    padding: 14px 16px;
    font-family: inherit;
    font-size: 14.5px;
    line-height: 1.65;
    background: var(--surface-0);
    border: 1.5px solid var(--border-2);
    border-radius: var(--radius-md);
    color: var(--text-1);
    resize: vertical;
    outline: none;
    transition: border-color .15s, box-shadow .15s;
    min-width: 0;
  }

  .ai-textarea:focus {
    border-color: var(--brand);
    box-shadow: 0 0 0 3px rgba(15,98,254,.12);
  }

  .ai-textarea:disabled {
    opacity: .5;
    cursor: not-allowed;
  }

  .ai-textarea.mono {
    font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
    font-size: 13px;
    line-height: 1.7;
  }

  /* â”€â”€ Code terminal â”€â”€ */
  .code-terminal {
    background: var(--code-bg);
    border: 1px solid var(--code-border);
    border-radius: var(--radius-md);
    overflow: hidden;
    margin-top: 10px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12.5px;
  }

  .code-terminal-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 14px;
    background: rgba(255,255,255,.04);
    border-bottom: 1px solid var(--code-border);
  }

  .code-terminal-dots {
    display: flex;
    gap: 6px;
  }

  .code-terminal-dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
  }

  .code-terminal-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .08em;
    text-transform: uppercase;
  }

  .code-terminal-body {
    padding: 14px 16px;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    line-height: 1.65;
  }

  .code-output-text { color: var(--code-green); }
  .code-error-text  { color: var(--code-red); }
  .code-label       { color: rgba(230,237,243,.45); font-size: 11px; margin-bottom: 6px; letter-spacing: .06em; }

  /* â”€â”€ Language selector â”€â”€ */
  .lang-select {
    padding: 7px 11px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    background: var(--surface-0);
    border: 1px solid var(--border-2);
    border-radius: var(--radius-sm);
    color: var(--text-1);
    cursor: pointer;
    outline: none;
    transition: border-color .15s;
  }

  .lang-select:focus { border-color: var(--brand); }

  /* â”€â”€ Feedback box â”€â”€ */
  .feedback-box {
    background: var(--success-bg);
    border: 1px solid var(--success-border);
    border-radius: var(--radius-md);
    padding: 18px;
    margin-bottom: 16px;
  }

  .feedback-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--success);
    margin-bottom: 8px;
  }

  .feedback-text {
    font-size: 13.5px;
    color: var(--text-2);
    line-height: 1.7;
    overflow-wrap: anywhere;
  }

  /* â”€â”€ Char counter â”€â”€ */
  .char-counter { font-size: 12px; font-weight: 600; }
  .char-ok   { color: var(--success); }
  .char-warn { color: var(--warning); }

  .clipboard-note {
    margin-top: 8px;
    font-size: 12px;
    color: var(--warning);
    font-weight: 500;
    background: var(--warning-bg);
    border: 1px solid var(--warning-border);
    padding: 8px 12px;
    border-radius: var(--radius-sm);
    line-height: 1.5;
  }

  /* â”€â”€ Two col layout â”€â”€ */
  .two-col {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 20px;
    align-items: start;
  }

  /* â”€â”€ Camera verification â”€â”€ */
  .camera-verification-wrap {
    max-width: 480px;
    width: 100%;
    
    margin: 0 auto;
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .camera-verification-grid {
    display: grid;
    grid-template-columns: 160px 1fr;
    gap: 16px;
    align-items: center;
    justify-content: center;
  }

  .camera-preview-box {
    position: relative;
    border-radius: 14px;
    overflow: hidden;
    background: #000;
    aspect-ratio: 3 / 4; width: 160px;
  }

  .camera-verification-side {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .camera-complete-wrap {
    max-width: 480px;
    width: 100%;
    
    margin: 0 auto;
    padding: 0 16px;
    display: grid;
    grid-template-columns: 160px 1fr;
    gap: 16px;
    align-content: center;
    align-items: center;
    justify-content: center;
  }

  .camera-complete-header {
    grid-column: 1 / -1;
    text-align: center;
  }

  .camera-complete-preview {
    border-radius: 12px;
    overflow: hidden;
  }

  .camera-complete-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* â”€â”€ Exam proctor camera â”€â”€ */
  .exam-proctor-camera {
    position: fixed;
    top: 76px;
    right: 18px;
    z-index: 9100;
    width: 180px;
    overflow: hidden;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-2);
    background: #000;
    box-shadow: var(--shadow-lg);
  }

  .exam-proctor-video {
    display: block;
    width: 100%;
    aspect-ratio: 3 / 4; width: 160px;
    object-fit: cover;
    transform: scaleX(-1);
  }

  .exam-proctor-status {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 9px;
    background: rgba(13,14,24,.92);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    line-height: 1.3;
  }

  .exam-proctor-status.warning {
    background: rgba(197,29,29,.94);
  }

  .exam-proctor-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--success);
    flex-shrink: 0;
    animation: pulse-live 1.5s ease-in-out infinite;
  }

  .exam-proctor-status.warning .exam-proctor-dot {
    background: #fff;
  }

  /* â”€â”€ Modal overlay â”€â”€ */
  .ai-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 999;
    background: rgba(9,10,18,.6);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .ai-modal {
    background: var(--surface-0);
    border: 1px solid var(--border-2);
    border-radius: var(--radius-xl);
    padding: 36px 32px;
    max-width: 460px;
    width: 100%;
    box-shadow: var(--shadow-lg);
    text-align: center;
  }

  .ai-modal-icon { font-size: 44px; margin-bottom: 16px; }
  .ai-modal-title {
    font-family: 'DM Serif Display', serif;
    font-size: 22px;
    font-weight: 400;
    color: var(--text-1);
    margin-bottom: 10px;
    line-height: 1.25;
  }
  .ai-modal-msg {
    font-size: 14px;
    color: var(--text-2);
    line-height: 1.7;
    white-space: pre-line;
  }

  /* â”€â”€ Purchase modal pricing cards â”€â”€ */
  .price-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 18px;
  }

  .price-card {
    position: relative;
    padding: 16px 12px;
    border-radius: var(--radius-md);
    border: 1.5px solid var(--border-2);
    background: var(--surface-1);
    text-align: center;
    cursor: pointer;
    transition: all .18s;
  }

  .price-card:hover { border-color: var(--border-3); background: var(--surface-0); }
  .price-card.popular { border-color: var(--brand); background: var(--brand-subtle); }

  .price-popular-badge {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--brand);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .06em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 999px;
    white-space: nowrap;
  }

  /* â”€â”€ Result modal â”€â”€ */
  .attempt-card {
    margin-bottom: 10px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-2);
    overflow: hidden;
    background: var(--surface-0);
  }

  .attempt-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    cursor: pointer;
    transition: background .15s;
  }

  .attempt-card-header:hover { background: var(--surface-1); }

  /* â”€â”€ Spinner â”€â”€ */
  @keyframes spin360 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .spinner { animation: spin360 .75s linear infinite; }

  /* â”€â”€ Scrollbar â”€â”€ */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-3); border-radius: 999px; }

  /* â”€â”€ Round description bar â”€â”€ */
  .round-desc-bar {
    padding: 8px 22px;
    font-size: 12px;
    color: var(--text-3);
    background: var(--surface-1);
    border-bottom: 1px solid var(--border-1);
  }

  /* â”€â”€ Info box â”€â”€ */
  .info-box {
    padding: 12px 14px;
    background: var(--brand-subtle);
    border: 1px solid var(--brand-border);
    border-radius: var(--radius-sm);
    font-size: 13px;
    color: var(--text-2);
    line-height: 1.6;
  }

  .info-box-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--brand);
    margin-bottom: 6px;
  }

  /* â”€â”€ Responsive â”€â”€ */
  @media(max-width: 1024px) {
    .how-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media(max-width: 860px) {
    .two-col { grid-template-columns: 1fr; }
    .camera-verification-wrap {
      max-width: 420px;
      min-height: auto;
      margin: 16px auto 0;
      justify-content: flex-start;
    }
    .camera-verification-grid { grid-template-columns: 1fr; }
    .camera-complete-wrap {
      max-width: 420px;
      min-height: auto;
      margin: 16px auto 0;
      grid-template-columns: 1fr;
      align-content: start;
    }
    .round-grid { grid-template-columns: 1fr; }
    .price-grid { grid-template-columns: repeat(3, 1fr); }
    .how-grid { grid-template-columns: repeat(2, 1fr); }
    .ai-main { padding: 16px 16px 40px; }
    .welcome-hero { padding: 12px 0 24px; }
  }

  @media(max-height: 720px) {
    .camera-verification-wrap {
      min-height: auto;
      margin: 12px auto 0;
      justify-content: flex-start;
    }

    .camera-complete-wrap {
      min-height: auto;
      margin: 12px auto 0;
      align-content: start;
    }
  }

  @media(max-width: 640px) {
    .ai-header-inner { padding: 0 14px; height: 58px; }
    .ai-header-sub { display: none; }
    .ai-logo-divider { display: none; }
    .ai-user-name { display: none; }
    .theme-toggle span { display: none; }
    .theme-toggle { width: 36px; padding: 0; justify-content: center; }
    .how-grid { grid-template-columns: 1fr; }
    .q-header { display: block; }
    .q-header > * { margin-bottom: 10px; }
    .q-header > *:last-child { margin-bottom: 0; }
    .timer-chip { width: 100%; justify-content: center; }
    .ai-modal { padding: 28px 20px; }
    .price-grid { grid-template-columns: 1fr; }
    .how-works-head { padding: 20px 18px 0; }
    .how-grid { background: transparent; gap: 10px; padding: 0 14px 18px; }
    .how-step { border-radius: var(--radius-md); border: 1px solid var(--border-1); }
    .welcome-title { font-size: clamp(2.2rem, 12vw, 3rem); }
    .card-header, .card-body { padding: 16px; }
    .q-header { padding: 14px 16px; }
    .q-header-inner > *:nth-child(2) { display: none; }
    .exam-proctor-camera {
      top: 68px;
      right: 10px;
      width: 126px;
      border-radius: var(--radius-sm);
    }
    .exam-proctor-status {
      padding: 5px 7px;
      font-size: 10px;
    }
  }
`;

