import React from 'react';
import { LayoutDashboard, ShieldCheck } from 'lucide-react';
import EmployeeJobComingSoon from './EmployeeJobComingSoon';

const EmployeeJobDashboard: React.FC = () => {
  return (
    <main className="ejd-page">
      <style>{dashboardStyles}</style>

      <div className="ejd-orb ejd-orb-one" aria-hidden="true" />
      <div className="ejd-orb ejd-orb-two" aria-hidden="true" />
      <div className="ejd-mesh ejd-mesh-one" aria-hidden="true" />
      <div className="ejd-mesh ejd-mesh-two" aria-hidden="true" />

      <div className="ejd-shell">
        <header className="ejd-header">
          <div className="ejd-brand">
            <span className="ejd-brand-icon" aria-hidden="true">
              <LayoutDashboard />
            </span>

            <span className="ejd-brand-copy">
              <strong>ASKOXY.AI</strong>
              <small>Employee Workspace</small>
            </span>
          </div>

          <div className="ejd-secure" aria-label="Secure employee workspace">
            <ShieldCheck />
            <span>Secure Workspace</span>
          </div>
        </header>

        <div className="ejd-content">
          <EmployeeJobComingSoon />
        </div>
      </div>
    </main>
  );
};

const dashboardStyles = `
  html,
  body,
  #root {
    width: 100%;
    min-width: 0;
    min-height: 100%;
    margin: 0;
    background: #030612;
  }

  body {
    overflow-x: hidden;
  }

  .ejd-page,
  .ejd-page * {
    box-sizing: border-box;
  }

  .ejd-page {
    position: relative;
    isolation: isolate;
    width: 100%;
    min-height: 100vh;
    min-height: 100svh;
    min-height: 100dvh;
    overflow-x: clip;
    overflow-y: auto;
    color: #ffffff;
    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background:
      radial-gradient(circle at 8% 9%, rgba(72, 100, 255, 0.30), transparent 31%),
      radial-gradient(circle at 92% 14%, rgba(0, 211, 255, 0.14), transparent 28%),
      radial-gradient(circle at 88% 90%, rgba(242, 72, 208, 0.20), transparent 36%),
      radial-gradient(circle at 48% 108%, rgba(126, 79, 255, 0.20), transparent 44%),
      linear-gradient(135deg, #030612 0%, #09122d 45%, #17103a 73%, #071b2d 100%);
  }

  .ejd-page::before {
    content: '';
    position: absolute;
    z-index: 0;
    inset: 0;
    pointer-events: none;
    opacity: 0.11;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
    background-size: 58px 58px;
    mask-image: linear-gradient(to bottom, #000 0%, rgba(0, 0, 0, 0.72) 68%, transparent 100%);
  }

  .ejd-orb,
  .ejd-mesh {
    position: fixed;
    z-index: 0;
    pointer-events: none;
  }

  .ejd-orb {
    width: min(58vw, 500px);
    aspect-ratio: 1;
    border-radius: 50%;
    filter: blur(120px) saturate(135%);
    opacity: 0.56;
  }

  .ejd-orb-one {
    top: -220px;
    left: -185px;
    background: linear-gradient(135deg, #536dfe, #00d9ff 45%, #8a55ff 72%, #ff55c8);
  }

  .ejd-orb-two {
    right: -205px;
    bottom: -235px;
    background: linear-gradient(135deg, #ff55c8, #8c5cff 42%, #00d4ff 72%, #52e7b8);
  }

  .ejd-mesh {
    width: min(38vw, 410px);
    aspect-ratio: 1.5;
    border-radius: 50%;
    opacity: 0.15;
    filter: blur(58px) saturate(130%);
  }

  .ejd-mesh-one {
    top: 25%;
    right: 7%;
    background: linear-gradient(120deg, rgba(0, 213, 255, 0.72), rgba(113, 86, 255, 0.08), rgba(255, 79, 202, 0.58));
  }

  .ejd-mesh-two {
    left: 6%;
    bottom: 8%;
    background: linear-gradient(125deg, rgba(82, 232, 184, 0.48), rgba(126, 84, 255, 0.58), rgba(255, 191, 63, 0.16));
  }

  .ejd-shell {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    width: min(100%, 1240px);
    min-height: 100vh;
    min-height: 100svh;
    min-height: 100dvh;
    margin: 0 auto;
    padding:
      max(18px, env(safe-area-inset-top))
      clamp(14px, 4vw, 52px)
      max(22px, env(safe-area-inset-bottom));
  }

  .ejd-header,
  .ejd-brand,
  .ejd-secure {
    display: flex;
    align-items: center;
  }

  .ejd-header {
    flex: 0 0 auto;
    justify-content: space-between;
    gap: 14px;
    min-width: 0;
  }

  .ejd-brand {
    min-width: 0;
    gap: 11px;
  }

  .ejd-brand-icon {
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    width: 42px;
    height: 42px;
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 14px;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.045));
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.16),
      0 16px 34px rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .ejd-brand-icon svg,
  .ejd-secure svg {
    width: 18px;
    height: 18px;
  }

  .ejd-brand-copy {
    display: flex;
    flex-direction: column;
    min-width: 0;
    line-height: 1;
  }

  .ejd-brand-copy strong {
    overflow: hidden;
    font-size: 0.9rem;
    letter-spacing: 0.12em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ejd-brand-copy small {
    margin-top: 5px;
    overflow: hidden;
    color: rgba(235, 239, 255, 0.58);
    font-size: 0.67rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ejd-secure {
    flex: 0 0 auto;
    gap: 7px;
    padding: 9px 12px;
    color: rgba(239, 242, 255, 0.72);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 999px;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.085), rgba(255, 255, 255, 0.03));
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.09);
    font-size: 0.72rem;
    font-weight: 700;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }

  .ejd-secure svg {
    color: #78e7c5;
  }

  .ejd-content {
    flex: 1 1 auto;
    display: grid;
    place-items: center;
    width: 100%;
    min-width: 0;
    padding: clamp(32px, 6vh, 62px) 0 clamp(18px, 4vh, 32px);
  }

  @media (max-width: 520px) {
    .ejd-shell {
      padding-left: 14px;
      padding-right: 14px;
    }

    .ejd-secure {
      width: 38px;
      height: 38px;
      justify-content: center;
      padding: 0;
      border-radius: 13px;
    }

    .ejd-secure span {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    .ejd-content {
      padding-top: 28px;
    }

    .ejd-orb,
    .ejd-mesh {
      opacity: 0.38;
    }
  }

  @media (max-width: 340px) {
    .ejd-brand-copy small {
      display: none;
    }
  }
`;

export default EmployeeJobDashboard;