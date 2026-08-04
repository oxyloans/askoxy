import React from 'react';
import { BriefcaseBusiness } from 'lucide-react';

const EmployeeJobComingSoon: React.FC = () => {
  return (
    <section
      className="ejcs-card"
      aria-labelledby="employee-jobs-coming-soon-title"
      role="status"
    >
      <style>{comingSoonStyles}</style>

      <div className="ejcs-glow ejcs-glow-bottom" aria-hidden="true" />
      <div className="ejcs-glow ejcs-glow-top" aria-hidden="true" />
      <div className="ejcs-title-halo" aria-hidden="true" />

      <div className="ejcs-dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>

      <div className="ejcs-content">
        <span className="ejcs-icon" aria-hidden="true">
          <BriefcaseBusiness />
        </span>

        <p className="ejcs-caption">Employee Jobs</p>

        <h1 id="employee-jobs-coming-soon-title">
          <span>COMING</span>
          <strong>SOON</strong>
        </h1>

        <p className="ejcs-message">We’re getting things ready for you.</p>
      </div>
    </section>
  );
};

const comingSoonStyles = `
  .ejcs-card,
  .ejcs-card * {
    box-sizing: border-box;
  }

  .ejcs-card {
    position: relative;
    isolation: isolate;
    display: grid;
    place-items: center;
    width: min(100%, 760px);
    min-height: clamp(360px, 61svh, 550px);
    overflow: hidden;
    padding: clamp(40px, 7vw, 70px) clamp(18px, 5vw, 54px);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.17);
    border-radius: clamp(24px, 4vw, 36px);
    background:
      radial-gradient(circle at 88% 6%, rgba(32, 207, 255, 0.12), transparent 30%),
      radial-gradient(circle at 10% 96%, rgba(169, 83, 255, 0.17), transparent 35%),
      linear-gradient(145deg, rgba(24, 35, 78, 0.84), rgba(39, 21, 72, 0.80)),
      rgba(10, 16, 42, 0.84);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.20),
      inset 0 -1px 0 rgba(255, 255, 255, 0.035),
      0 50px 120px rgba(0, 0, 0, 0.50),
      0 22px 54px rgba(88, 65, 221, 0.22),
      0 0 0 1px rgba(117, 133, 255, 0.045);
    text-align: center;
    backdrop-filter: blur(24px) saturate(116%);
    -webkit-backdrop-filter: blur(24px) saturate(116%);
  }

  .ejcs-card::before {
    content: '';
    position: absolute;
    z-index: 0;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(120deg, rgba(255, 255, 255, 0.12), transparent 30%, transparent 72%, rgba(255, 255, 255, 0.035));
  }

  .ejcs-glow {
    position: absolute;
    z-index: 0;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(78px) saturate(138%);
  }

  .ejcs-glow-bottom {
    bottom: -190px;
    width: min(78vw, 520px);
    height: 280px;
    opacity: 0.58;
    background: linear-gradient(90deg, rgba(70, 95, 255, 0.50), rgba(143, 79, 255, 0.50), rgba(255, 73, 201, 0.36));
  }

  .ejcs-glow-top {
    top: -170px;
    right: -130px;
    width: 360px;
    height: 250px;
    opacity: 0.46;
    background: linear-gradient(90deg, rgba(0, 220, 255, 0.34), rgba(120, 92, 255, 0.40), rgba(255, 98, 200, 0.28));
  }

  .ejcs-title-halo {
    position: absolute;
    z-index: 0;
    left: 50%;
    top: 51%;
    width: min(84%, 610px);
    height: 180px;
    border-radius: 50%;
    opacity: 0.72;
    background: linear-gradient(90deg, rgba(0, 213, 255, 0.22), rgba(119, 84, 255, 0.31), rgba(255, 70, 204, 0.23), rgba(255, 204, 92, 0.15));
    filter: blur(54px) saturate(138%);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .ejcs-dots {
    position: absolute;
    z-index: 3;
    top: 20px;
    left: 22px;
    display: flex;
    align-items: center;
    gap: 7px;
    pointer-events: none;
  }

  .ejcs-dots i {
    display: block;
    width: 9px;
    height: 9px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 999px;
  }

  .ejcs-dots i:first-child {
    background: #ff5f57;
    box-shadow: 0 0 12px rgba(255, 95, 87, 0.72);
  }

  .ejcs-dots i:nth-child(2) {
    background: #ffbd2e;
    box-shadow: 0 0 12px rgba(255, 189, 46, 0.70);
  }

  .ejcs-dots i:nth-child(3) {
    background: #28c840;
    box-shadow: 0 0 12px rgba(40, 200, 64, 0.68);
  }

  .ejcs-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-width: 0;
  }

  .ejcs-icon {
    display: grid;
    place-items: center;
    width: clamp(66px, 9vw, 82px);
    height: clamp(66px, 9vw, 82px);
    margin-bottom: 20px;
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.21);
    border-radius: clamp(20px, 3vw, 26px);
    background: linear-gradient(145deg, #536dfe 0%, #775cff 38%, #c34fff 72%, #31d9ff 100%);
    box-shadow:
      0 24px 56px rgba(98, 101, 245, 0.36),
      0 0 34px rgba(55, 213, 255, 0.11),
      inset 0 1px 0 rgba(255, 255, 255, 0.28);
  }

  .ejcs-icon svg {
    width: 38%;
    height: 38%;
    stroke-width: 1.9;
  }

  .ejcs-caption {
    margin: 0;
    color: #bdc5ff;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .ejcs-card h1 {
    position: relative;
    z-index: 2;
    margin: 18px 0 0;
    font-size: clamp(3.5rem, 10vw, 7.2rem);
    font-weight: 900;
    line-height: 0.84;
    letter-spacing: -0.072em;
  }

  .ejcs-card h1 span,
  .ejcs-card h1 strong {
    display: block;
    padding-bottom: 0.07em;
    color: transparent;
    font-weight: inherit;
    -webkit-background-clip: text;
    background-clip: text;
  }

  .ejcs-card h1 span {
    background-image: linear-gradient(105deg, #ffffff 0%, #91e7ff 24%, #9184ff 49%, #ff7bd7 74%, #ffd370 100%);
    filter:
      drop-shadow(0 5px 0 rgba(42, 33, 110, 0.52))
      drop-shadow(0 18px 36px rgba(76, 84, 255, 0.30));
  }

  .ejcs-card h1 strong {
    background-image: linear-gradient(105deg, #70f0c1 0%, #4bd9ff 25%, #887cff 50%, #ff6dcc 75%, #ffd16b 100%);
    filter:
      drop-shadow(0 7px 0 rgba(63, 34, 120, 0.58))
      drop-shadow(0 22px 42px rgba(174, 68, 255, 0.32));
  }

  .ejcs-message {
    max-width: 360px;
    margin: 26px 0 0;
    color: rgba(237, 240, 255, 0.67);
    font-size: clamp(0.92rem, 1.8vw, 1.04rem);
    line-height: 1.6;
  }

  @media (max-width: 520px) {
    .ejcs-card {
      min-height: 420px;
      padding: 40px 16px 36px;
      border-radius: 24px;
    }

    .ejcs-dots {
      top: 17px;
      left: 18px;
    }

    .ejcs-card h1 {
      font-size: clamp(3.2rem, 19vw, 5rem);
      line-height: 0.88;
    }

    .ejcs-message {
      max-width: 290px;
      margin-top: 22px;
    }
  }

  @media (max-width: 340px) {
    .ejcs-card {
      min-height: 390px;
      padding-inline: 12px;
    }

    .ejcs-card h1 {
      font-size: 3rem;
    }
  }

  @media (max-height: 620px) and (min-width: 700px) {
    .ejcs-card {
      min-height: 350px;
      padding-block: 30px;
    }

    .ejcs-icon {
      width: 62px;
      height: 62px;
      margin-bottom: 16px;
    }

    .ejcs-message {
      margin-top: 20px;
    }
  }
`;

export default EmployeeJobComingSoon;
