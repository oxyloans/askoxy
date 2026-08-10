import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  FileText,
  Sparkles,
  UsersRound,
} from "lucide-react";

const ALL_JOBS_ROUTE = "/employeedashboard/alljobsbycompanyemployee";

const EmployeeApplicationsComingSoon: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="eja-page" aria-labelledby="eja-title">
      <style>{applicationsStyles}</style>

      <header className="eja-header">
        <span className="eja-header-icon" aria-hidden="true"><FileText /></span>
        <div>
          <span className="eja-eyebrow">Candidate workspace</span>
          <h1 id="eja-title">Applications</h1>
          <p>Candidate review tools are being prepared for your employee workspace.</p>
        </div>
      </header>

      <article className="eja-coming-card">
        <div className="eja-copy">
          <span className="eja-label"><Sparkles /> Coming soon</span>
          <h2>Review every application in one organized workspace.</h2>
          <p>
            Candidate lists, application status updates and shortlisting tools will be
            available here. Your posted jobs remain available from the Jobs page.
          </p>

          <div className="eja-features" aria-label="Planned application tools">
            <div><UsersRound /><span><strong>Candidate review</strong><small>View applicants for each posted role.</small></span></div>
            <div><CheckCircle2 /><span><strong>Status tracking</strong><small>Organize candidate progress clearly.</small></span></div>
            <div><CalendarClock /><span><strong>Interview workflow</strong><small>Continue hiring activity from one place.</small></span></div>
          </div>

          <button type="button" className="eja-jobs-button" onClick={() => navigate(ALL_JOBS_ROUTE)}>
            <BriefcaseBusiness />
            View posted jobs
            <ArrowRight />
          </button>
        </div>

        <div className="eja-visual" aria-hidden="true">
          <div className="eja-window">
            <div className="eja-window-top"><i /><i /><i /><span /></div>
            <div className="eja-window-body">
              <aside><b /><b /><b className="eja-active-line" /><b /></aside>
              <div className="eja-preview-main">
                <span className="eja-title-line" />
                {[0, 1, 2].map((item) => (
                  <div className="eja-person-row" key={item}>
                    <i />
                    <span><b /><small /></span>
                    <em />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <span className="eja-floating-icon"><UsersRound /></span>
        </div>
      </article>
    </section>
  );
};

const applicationsStyles = `
  /* Component-scoped theme: avoid document-level selectors here. */
  .eja-page,
  .eja-page * { box-sizing: border-box; }

  .eja-page {
    width: 100%;
    max-width: 1120px;
    margin: 0 auto;
    color: #f7f8ff;
    color-scheme: dark;
    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .eja-header,
  .eja-header-icon,
  .eja-label,
  .eja-features > div,
  .eja-jobs-button,
  .eja-person-row,
  .eja-person-row > span { display: flex; align-items: center; }

  .eja-header { gap: 14px; margin-bottom: 20px; }
  .eja-header-icon {
    justify-content: center;
    flex: 0 0 auto;
    width: 48px;
    height: 48px;
    color: #fff;
    border: 1px solid rgba(255,255,255,.16);
    border-radius: 16px;
    background: linear-gradient(145deg, #5d6ef2, #8059ed 55%, #2bbbd9);
    box-shadow: 0 15px 32px rgba(73,83,218,.28), inset 0 1px 0 rgba(255,255,255,.23);
  }
  .eja-header-icon svg { width: 20px; }
  .eja-header > div { min-width: 0; }
  .eja-eyebrow { display: block; color: #9faeff; font-size: .65rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
  .eja-header h1 { margin: 5px 0 0; font-size: clamp(1.8rem, 3.2vw, 2.5rem); line-height: 1.05; letter-spacing: -.045em; }
  .eja-header p { margin: 7px 0 0; color: rgba(229,234,255,.56); font-size: .84rem; line-height: 1.5; }

  .eja-coming-card {
    display: grid;
    grid-template-columns: minmax(0, 1.02fr) minmax(340px, .98fr);
    min-height: 560px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 26px;
    background:
      radial-gradient(circle at 88% 8%, rgba(54,199,225,.11), transparent 34%),
      radial-gradient(circle at 15% 105%, rgba(111,88,245,.16), transparent 42%),
      linear-gradient(145deg, rgba(19,28,59,.9), rgba(12,17,37,.94));
    box-shadow: inset 0 1px 0 rgba(255,255,255,.07), 0 26px 62px rgba(0,0,0,.2);
  }

  .eja-copy { align-self: center; padding: clamp(30px, 5vw, 58px); }
  .eja-label {
    width: fit-content;
    gap: 7px;
    min-height: 29px;
    padding: 0 10px;
    color: #b4beff;
    border: 1px solid rgba(145,158,255,.16);
    border-radius: 999px;
    background: rgba(104,121,255,.09);
    font-size: .62rem;
    font-weight: 800;
    letter-spacing: .09em;
    text-transform: uppercase;
  }
  .eja-label svg { width: 13px; }
  .eja-copy h2 { max-width: 620px; margin: 18px 0 0; font-size: clamp(2rem, 4vw, 3.25rem); line-height: 1.02; letter-spacing: -.052em; }
  .eja-copy > p { max-width: 610px; margin: 17px 0 0; color: rgba(226,231,250,.58); font-size: .82rem; line-height: 1.7; }

  .eja-features { display: grid; gap: 9px; margin-top: 24px; }
  .eja-features > div { gap: 11px; padding: 10px; border-radius: 13px; background: rgba(255,255,255,.025); }
  .eja-features > div > svg { flex: 0 0 auto; width: 16px; color: #94a2f5; }
  .eja-features span { display: flex; min-width: 0; flex-direction: column; }
  .eja-features strong { font-size: .69rem; }
  .eja-features small { margin-top: 3px; color: rgba(220,225,246,.42); font-size: .6rem; line-height: 1.4; }

  .eja-jobs-button {
    justify-content: center;
    gap: 8px;
    min-height: 46px;
    margin-top: 25px;
    padding: 0 16px;
    color: #fff;
    border: 1px solid rgba(255,255,255,.15);
    border-radius: 13px;
    background: linear-gradient(135deg, #5d6df2, #7658ed 55%, #2ebada);
    box-shadow: 0 12px 27px rgba(82,91,228,.24);
    font: 750 .72rem Inter, system-ui, sans-serif;
    cursor: pointer;
  }
  .eja-jobs-button svg { width: 15px; }
  .eja-jobs-button svg:last-child { margin-left: 3px; }

  .eja-visual { position: relative; min-width: 0; min-height: 480px; overflow: hidden; }
  .eja-visual::before,
  .eja-visual::after { content: ''; position: absolute; border-radius: 50%; filter: blur(42px); }
  .eja-visual::before { top: 8%; right: -5%; width: 240px; height: 240px; background: rgba(50,190,219,.13); }
  .eja-visual::after { left: 3%; bottom: 3%; width: 220px; height: 220px; background: rgba(112,87,240,.14); }

  .eja-window {
    position: absolute;
    z-index: 2;
    top: 50%;
    left: 49%;
    width: min(92%, 440px);
    overflow: hidden;
    border: 1px solid rgba(255,255,255,.15);
    border-radius: 20px;
    background: rgba(7,12,29,.76);
    box-shadow: 0 32px 70px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.08);
    backdrop-filter: blur(18px);
    transform: translate(-50%,-50%) rotate(2deg);
  }
  .eja-window-top { display: flex; align-items: center; gap: 5px; height: 42px; padding: 0 13px; border-bottom: 1px solid rgba(255,255,255,.08); }
  .eja-window-top i { width: 6px; height: 6px; border-radius: 50%; background: #e76f7e; }
  .eja-window-top i:nth-child(2) { background: #e7ba62; }
  .eja-window-top i:nth-child(3) { background: #5bcfa6; }
  .eja-window-top span { width: 58px; height: 7px; margin-left: auto; border-radius: 4px; background: rgba(255,255,255,.08); }
  .eja-window-body { display: grid; grid-template-columns: 78px 1fr; min-height: 310px; }
  .eja-window-body aside { display: grid; align-content: start; gap: 12px; padding: 18px 12px; border-right: 1px solid rgba(255,255,255,.07); }
  .eja-window-body aside b { width: 100%; height: 8px; border-radius: 5px; background: rgba(255,255,255,.07); }
  .eja-window-body aside .eja-active-line { background: rgba(112,129,255,.34); }
  .eja-preview-main { display: block; padding: 20px 16px; }
  .eja-title-line { display: block; width: 40%; height: 10px; margin-bottom: 18px; border-radius: 6px; background: rgba(255,255,255,.15); }
  .eja-person-row { gap: 10px; margin-top: 9px; padding: 12px; border: 1px solid rgba(255,255,255,.065); border-radius: 12px; background: rgba(255,255,255,.025); }
  .eja-person-row > i { flex: 0 0 auto; width: 28px; height: 28px; border-radius: 9px; background: linear-gradient(145deg, rgba(104,121,255,.42), rgba(49,186,214,.2)); }
  .eja-person-row > span { flex: 1; align-items: flex-start; flex-direction: column; gap: 5px; }
  .eja-person-row b { width: 55%; height: 7px; border-radius: 4px; background: rgba(255,255,255,.13); }
  .eja-person-row small { width: 78%; height: 5px; border-radius: 4px; background: rgba(255,255,255,.065); }
  .eja-person-row em { width: 40px; height: 16px; border-radius: 7px; background: rgba(105,224,181,.1); }
  .eja-floating-icon { position: absolute; z-index: 3; right: 7%; bottom: 15%; display: grid; place-items: center; width: 62px; height: 62px; color: #fff; border: 1px solid rgba(255,255,255,.18); border-radius: 19px; background: linear-gradient(145deg, #6678ff, #785ae8 58%, #35bfd9); box-shadow: 0 18px 40px rgba(60,70,183,.35); }
  .eja-floating-icon svg { width: 24px; }

  @media (max-width: 900px) {
    .eja-coming-card { grid-template-columns: 1fr; }
    .eja-copy { padding-bottom: 20px; }
    .eja-visual { min-height: 390px; }
    .eja-window { width: min(88%, 500px); }
  }

  @media (max-width: 560px) {
    .eja-header { align-items: flex-start; gap: 11px; }
    .eja-header-icon { width: 42px; height: 42px; border-radius: 14px; }
    .eja-header h1 { font-size: 1.7rem; }
    .eja-header p { font-size: .74rem; }
    .eja-coming-card { border-radius: 21px; }
    .eja-copy { padding: 25px 19px 16px; }
    .eja-copy h2 { font-size: 2rem; }
    .eja-copy > p { font-size: .75rem; }
    .eja-features > div { padding: 9px 7px; }
    .eja-features small { font-size: .58rem; }
    .eja-jobs-button { width: 100%; min-height: 49px; }
    .eja-visual { min-height: 320px; }
    .eja-window { left: 50%; width: 92%; }
    .eja-window-body { grid-template-columns: 56px 1fr; min-height: 250px; }
    .eja-window-body aside { padding-inline: 9px; }
    .eja-person-row { padding: 9px; }
    .eja-person-row em { display: none; }
    .eja-floating-icon { right: 4%; bottom: 10%; width: 52px; height: 52px; }
  }

  @media (max-width: 350px) {
    .eja-header-icon { display: none; }
    .eja-copy h2 { font-size: 1.8rem; }
  }
`;

export default EmployeeApplicationsComingSoon;
