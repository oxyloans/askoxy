// NewsBackground3D.tsx
//
// Ambient animated background — light theme. A real world-map photo,
// tinted soft lavender/cream, with drifting ambient orbs. Sits fixed
// behind the whole app.

export default function NewsBackground3D() {
  return (
    <div className="news-bg-3d" aria-hidden="true">
      <div className="news-bg-3d__grid" />

      {/* Real world-map photo, tinted to sit behind the constellation */}
      <div className="news-bg-3d__map" />
      <div className="news-bg-3d__map-tint" />

      {/* Soft ambient orbs — pastel, light-safe */}
      <span className="orb orb--plum" />
      <span className="orb orb--gold" />
      <span className="orb orb--royal" />

      <style>{`
        .news-bg-3d {
          position: fixed;
          inset: 0;
          z-index: -10;
          overflow: hidden;
          /* light cream/lavender, brand-tinted but bright */
          background: radial-gradient(ellipse at 50% 30%, #f0e8f7 0%, #e2d2ee 45%, #cbb3e0 100%);
        }

        .news-bg-3d__grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, rgba(58, 28, 92, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(58, 28, 92, 0.05) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse at center, black 0%, transparent 75%);
          animation: gridDrift 50s linear infinite;
        }

        /* ── Ambient orbs (subtle, light-safe) ───────────────────── */
        .orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(70px);
          will-change: transform;
        }
        .orb--plum {
          width: 30vw;
          height: 30vw;
          top: 5%;
          left: 5%;
          background: radial-gradient(circle at 30% 30%, #d8bdf0, #c79fe6 70%);
          opacity: 0.35;
          animation: floatA 28s ease-in-out infinite;
        }
        .orb--gold {
          width: 20vw;
          height: 20vw;
          top: 58%;
          left: 68%;
          background: radial-gradient(circle at 40% 40%, #f9e8b8, #f3d68f 70%);
          opacity: 0.35;
          animation: floatB 24s ease-in-out infinite;
        }
        .orb--royal {
          width: 24vw;
          height: 24vw;
          top: 32%;
          left: 58%;
          background: radial-gradient(circle at 50% 50%, #c3d0f5, #a9bbec 70%);
          opacity: 0.3;
          animation: floatC 32s ease-in-out infinite;
        }

        /* ── Real world-map background photo ─────────────────────── */
        .news-bg-3d__map {
          position: absolute;
          inset: 0;
          background-image: url("https://assets.bizclikmedia.net/900/3443d437715625359e6d694955900f82:c7faa7546e8efb2512cee829767f9137/gettyimages-1324817452.webp");
          background-size: cover;
          background-position: center;
          opacity: 0.32;
          mix-blend-mode: luminosity;
          filter: saturate(0.6) contrast(1.1);
        }
        .news-bg-3d__map-tint {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 30%, rgba(255, 255, 255, 0.22) 0%, rgba(226, 210, 238, 0.45) 45%, rgba(203, 179, 224, 0.65) 100%);
        }

        @keyframes floatA {
          0%   { transform: translate3d(0, 0, 0); }
          25%  { transform: translate3d(3vw, -4vh, 0); }
          50%  { transform: translate3d(-2vw, 3vh, 0); }
          75%  { transform: translate3d(4vw, 2vh, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes floatB {
          0%   { transform: translate3d(0, 0, 0) scale(1); }
          33%  { transform: translate3d(-4vw, -3vh, 0) scale(1.05); }
          66%  { transform: translate3d(3vw, 4vh, 0) scale(0.97); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }
        @keyframes floatC {
          0%   { transform: translate3d(0, 0, 0); }
          50%  { transform: translate3d(-5vw, 5vh, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes gridDrift {
          0%   { background-position: 0 0; }
          100% { background-position: 96px 96px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .orb, .news-bg-3d__grid {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}