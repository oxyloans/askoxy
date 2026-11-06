import React, { useEffect, useRef } from "react";
import { X, Sparkles } from "lucide-react";

interface DiwaliWishesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  size: number;
  color: string;
  isStar: boolean;
  rotation: number;
  rotationSpeed: number;
  twinklePhase: number;
  twinkleSpeed: number;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  speed: number;
  trail: { x: number; y: number; alpha: number; size: number }[];
  color: string;
  palette: string[];
}

const FESTIVE_PALETTES = [
  ["#F59E0B", "#FBBF24", "#FEF08A", "#D97706", "#FFFFFF"],
  ["#EC4899", "#F43F5E", "#FBBF24", "#FEF08A", "#FFFFFF"],
  ["#A855F7", "#C084FC", "#FBBF24", "#FEF08A", "#F472B6"],
  ["#10B981", "#34D399", "#6EE7B7", "#FBBF24", "#FEF08A"],
  ["#06B6D4", "#38BDF8", "#FBBF24", "#FEF08A", "#FFFFFF"],
];

const ClayDiya: React.FC<{ size?: "sm" | "md"; className?: string }> = ({
  size = "md",
  className = "",
}) => {
  const isSm = size === "sm";
  return (
    <div
      className={`inline-flex flex-col items-center select-none shrink-0 pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Dancing Oil Flame */}
      <div
        className="diwali-diya-flame -mb-0.5"
        style={{
          width: isSm ? 14 : 20,
          height: isSm ? 18 : 24,
        }}
      >
        <svg
          viewBox="0 0 14 18"
          fill="none"
          className="w-full h-full drop-shadow-[0_0_10px_rgba(251,191,36,0.95)]"
        >
          <path
            d="M7 0 C7 0 0 8 0 12 C0 15.5 3 18 7 18 C11 18 14 15.5 14 12 C14 8 7 0 7 0 Z"
            fill="#F59E0B"
          />
          <path
            d="M7 4 C7 4 2.5 8 2.5 12 C2.5 14.5 4.5 16 7 16 C9.5 16 11.5 14.5 11.5 12 C11.5 8 7 4 7 4 Z"
            fill="#FFFBEB"
          />
        </svg>
      </div>

      {/* Traditional Clay Diya Base */}
      <svg
        viewBox="0 0 28 12"
        fill="none"
        style={{
          width: isSm ? 28 : 38,
          height: isSm ? 11 : 15,
        }}
        className="drop-shadow-md"
      >
        <path
          d="M1 3 C4 10, 24 10, 27 3 C26 11, 18 12, 14 12 C10 12, 2 11, 1 3 Z"
          fill="#B45309"
        />
        <ellipse cx="14" cy="3" rx="13" ry="2.5" fill="#78350F" />
      </svg>
    </div>
  );
};

export const DiwaliWishesModal: React.FC<DiwaliWishesModalProps> = ({
  isOpen,
  onClose,
  userName = "User",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Fireworks Animation - ONLY active while modal is open
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const rockets: Rocket[] = [];
    const particles: SparkleParticle[] = [];

    // Helper: Draw 4-pointed sparkle star with luminous halo
    const drawSparkleStar = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      color: string,
      alpha: number,
      rotation: number
    ) => {
      c.save();
      c.globalAlpha = Math.max(0, Math.min(1, alpha));
      c.translate(x, y);
      c.rotate(rotation);
      c.fillStyle = color;
      c.shadowColor = color;
      c.shadowBlur = radius * 2.5;

      c.beginPath();
      const inner = radius * 0.24;
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const nextAngle = angle + Math.PI / 4;
        if (i === 0) {
          c.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        } else {
          c.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }
        c.lineTo(Math.cos(nextAngle) * inner, Math.sin(nextAngle) * inner);
      }
      c.closePath();
      c.fill();
      c.restore();
    };

    // Helper: Explode rocket into sparkle stars & particles
    const explodeRocket = (rocket: Rocket) => {
      const starCount = 64;
      const palette = rocket.palette;

      for (let i = 0; i < starCount; i++) {
        const angle = (Math.PI * 2 * i) / starCount + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 2.8 + 1.2;
        const color = palette[Math.floor(Math.random() * palette.length)];

        particles.push({
          x: rocket.x,
          y: rocket.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: Math.random() * 0.005 + 0.003,
          size: Math.random() * 5 + 3,
          color,
          isStar: Math.random() > 0.25,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.07,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.08 + 0.04,
        });
      }

      // Bright core flash particles
      for (let j = 0; j < 12; j++) {
        particles.push({
          x: rocket.x,
          y: rocket.y,
          vx: (Math.random() - 0.5) * 1.8,
          vy: (Math.random() - 0.5) * 1.8,
          alpha: 1,
          decay: 0.025,
          size: Math.random() * 8 + 4,
          color: "#FFFBEB",
          isStar: true,
          rotation: 0,
          rotationSpeed: 0.02,
          twinklePhase: 0,
          twinkleSpeed: 0.1,
        });
      }
    };

    // Helper: Launch rocket from bottom with glowing trail
    const launchRocket = (customX?: number, customTargetY?: number) => {
      let x = customX;
      if (x === undefined) {
        const sideMargin = width * 0.06;
        x = sideMargin + Math.random() * (width * 0.88);
      }

      const targetY = customTargetY ?? height * (Math.random() * 0.38 + 0.12);
      const palette = FESTIVE_PALETTES[Math.floor(Math.random() * FESTIVE_PALETTES.length)];
      const color = palette[0];

      rockets.push({
        x,
        y: height + 10,
        targetY,
        speed: Math.random() * 1.2 + 3.2,
        trail: [],
        color,
        palette,
      });
    };

    // Initial festive burst sequence on modal opening
    launchRocket(width * 0.5, height * 0.2);
    const t1 = setTimeout(() => launchRocket(width * 0.2, height * 0.28), 300);
    const t2 = setTimeout(() => launchRocket(width * 0.8, height * 0.28), 650);

    // Continuous rockets bursting periodically while modal is open
    let lastLaunch = Date.now();
    let nextLaunchDelay = 1800;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const now = Date.now();
      if (now - lastLaunch > nextLaunchDelay) {
        launchRocket();
        lastLaunch = now;
        nextLaunchDelay = Math.random() * 1400 + 1400; // launches every 1.4s - 2.8s
      }

      // 1. Update & Render Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];

        r.trail.push({
          x: r.x,
          y: r.y,
          alpha: 1,
          size: Math.random() * 2.2 + 1.2,
        });
        if (r.trail.length > 20) r.trail.shift();

        r.y -= r.speed;
        r.speed *= 0.992; // smooth deceleration

        // Draw sparkler trail
        for (let t = 0; t < r.trail.length; t++) {
          const pt = r.trail[t];
          const trailAlpha = (t / r.trail.length) * 0.85;
          ctx.save();
          ctx.globalAlpha = trailAlpha;
          ctx.fillStyle = "#FDE68A";
          ctx.shadowColor = "#F59E0B";
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(
            pt.x + (Math.random() - 0.5) * 2,
            pt.y + (Math.random() - 0.5) * 2,
            pt.size,
            0,
            Math.PI * 2
          );
          ctx.fill();
          ctx.restore();
        }

        // Luminous Rocket Halo Light
        ctx.save();
        const glowGrad = ctx.createRadialGradient(r.x, r.y, 0, r.x, r.y, 20);
        glowGrad.addColorStop(0, "rgba(254, 240, 138, 0.9)");
        glowGrad.addColorStop(0.45, "rgba(245, 158, 11, 0.45)");
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 20, 0, Math.PI * 2);
        ctx.fill();

        // Glowing white core tip
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 14;
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Burst at target altitude
        if (r.y <= r.targetY || r.speed < 1.2) {
          explodeRocket(r);
          rockets.splice(i, 1);
        }
      }

      // 2. Update & Render Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.vx *= 0.982;
        p.vy *= 0.982;
        p.vy += 0.018; // gentle stardust gravity
        p.x += p.vx;
        p.y += p.vy;

        p.alpha -= p.decay;
        p.rotation += p.rotationSpeed;
        p.twinklePhase += p.twinkleSpeed;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const twinkleFactor = 0.75 + Math.sin(p.twinklePhase) * 0.25;
        const currentSize = p.size * p.alpha * twinkleFactor;

        if (p.isStar) {
          drawSparkleStar(
            ctx,
            p.x,
            p.y,
            currentSize,
            p.color,
            p.alpha * twinkleFactor,
            p.rotation
          );
        } else {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha * twinkleFactor);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize * 0.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // CLEANUP: when modal is closed, everything stops immediately!
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes diwaliDiyaFlicker {
          0%, 100% {
            transform: scale(1) translateY(0);
          }
          50% {
            transform: scale(1.14, 0.9) translateY(-1.5px);
          }
        }
        @keyframes diwaliCardEntrance {
          0% {
            opacity: 0;
            transform: scale(0.85) translateY(18px);
          }
          60% {
            opacity: 1;
            transform: scale(1.02) translateY(-2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .diwali-diya-flame {
          animation: diwaliDiyaFlicker 1.4s ease-in-out infinite;
          transform-origin: bottom center;
        }
        .diwali-modal-card {
          animation: diwaliCardEntrance 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Fullscreen Overlay Container */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="diwali-modal-title"
        onClick={(e) => {
          // Close when clicking the backdrop outside modal card
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Sky Fireworks Canvas - Behind the modal card */}
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-0"
        />

        {/* Modal Card */}
        <div
          className="diwali-modal-card relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border-2 border-amber-400/60 bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/95 p-6 sm:p-8 text-center text-white shadow-[0_20px_70px_rgba(245,158,11,0.35)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle Golden Ambient Aura inside Card */}
          <div
            className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-44 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(251, 191, 36, 0.28) 0%, transparent 70%)",
            }}
          />

          {/* Close 'X' Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Diwali Wishes"
            className="absolute top-4 right-4 rounded-full p-2 text-amber-200/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Top Decorative Diyas & Sparkling Pill */}
          <div className="relative mb-3 flex items-center justify-center gap-3">
            <ClayDiya size="sm" />
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-500/20 px-3.5 py-1 text-xs font-bold tracking-widest text-amber-300 uppercase shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Festival of Lights</span>
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <ClayDiya size="sm" className="scale-x-[-1]" />
          </div>

          {/* Grand Happy Diwali Heading */}
          <h2
            id="diwali-modal-title"
            className="text-3xl font-black tracking-tight sm:text-4xl bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-sm"
          >
            Happy Diwali! 🪔
          </h2>

          {/* Personalized Greeting */}
          <p className="mt-2.5 text-base font-semibold text-amber-200 sm:text-lg">
            Dear <span className="text-white underline decoration-amber-400/60">{userName}</span> & Family,
          </p>

          {/* Heartfelt Wishes Description */}
          <p className="mt-3 text-sm leading-relaxed text-slate-200 sm:text-[15px]">
            May the supreme light of this auspicious festival illuminate your life with infinite joy,
            good health, peace, prosperity, and tremendous success in all your tasks and aspirations!
          </p>

          {/* 3 Festive Pillars Mini Badges */}
          <div className="mt-5 grid grid-cols-3 gap-2.5 text-left">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-2.5 text-center">
              <div className="text-lg">🪔</div>
              <div className="mt-1 text-xs font-bold text-amber-200">Prosperity</div>
              <div className="text-[10px] text-amber-300/70">Wealth & Joy</div>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-2.5 text-center">
              <div className="text-lg">✨</div>
              <div className="mt-1 text-xs font-bold text-amber-200">Happiness</div>
              <div className="text-[10px] text-amber-300/70">Peace & Love</div>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-2.5 text-center">
              <div className="text-lg">🚀</div>
              <div className="mt-1 text-xs font-bold text-amber-200">Success</div>
              <div className="text-[10px] text-amber-300/70">Growth & Career</div>
            </div>
          </div>

          {/* Warm Company Wishes */}
          <p className="mt-4 text-xs font-medium text-amber-300/80">
            Wishing you a sparkling and glorious celebration from the AskOxy Family! ✨
          </p>

          {/* Bottom Action Button */}
          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 py-3.5 px-6 text-sm sm:text-base font-bold text-slate-950 shadow-[0_6px_25px_rgba(245,158,11,0.45)] transition hover:from-amber-300 hover:via-yellow-300 hover:to-amber-400 hover:shadow-[0_8px_30px_rgba(245,158,11,0.6)] hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-amber-300"
          >
            Celebrate Diwali & Continue 🪔
          </button>
        </div>
      </div>
    </>
  );
};

export default DiwaliWishesModal;

