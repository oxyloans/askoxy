import React, { useEffect, useRef, useState } from "react";

/**
 * FestiveBackground - Diwali Celebration Theme & Sky Fireworks
 *
 * Requirements:
 * 1. User arrives on dashboard: A bright fire rocket shoots up from the bottom center.
 * 2. It bursts in slow motion into brilliant stars & sparkles, revealing "Happy Diwali" from the explosion!
 * 3. The "Happy Diwali" greeting automatically closes after a few seconds.
 * 4. Background Diwali theme light color increased (warm golden festive ambiance, clean & pleasant).
 * 5. Luminous glowing lighting added to the rockets and their spark trails as they shoot up.
 * 6. Background rockets continue bursting into stars periodically ("akkadakkada").
 * 7. 100% pointer-events-none (no interference with dashboard clicks).
 */

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
  isGrandOpening?: boolean;
}

// Vibrant Diwali celebration palettes
const FESTIVE_PALETTES = [
  // Royal Diwali Gold & Amber
  ["#F59E0B", "#FBBF24", "#FEF08A", "#D97706", "#FFFFFF"],
  // Festive Magenta & Golden Sun
  ["#EC4899", "#F472B6", "#FBBF24", "#FEF08A", "#FFFFFF"],
  // Purple Twilight & Golden Sparkle
  ["#A855F7", "#C084FC", "#FBBF24", "#FEF08A", "#F472B6"],
  // Emerald Green & Warm Gold
  ["#10B981", "#34D399", "#6EE7B7", "#FBBF24", "#FEF08A"],
  // Sparkling Rainbow Festival
  ["#F59E0B", "#EC4899", "#8B5CF6", "#10B981", "#38BDF8", "#FFFFFF"],
];

export const FestiveBackground: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // "Happy Diwali" greeting states
  // Initially false -> triggers right when the grand rocket bursts at apex!
  const [greetingVisible, setGreetingVisible] = useState(false);
  const [isGreetingFading, setIsGreetingFading] = useState(false);
  const [isGreetingMounted, setIsGreetingMounted] = useState(false);

  useEffect(() => {
    if (!greetingVisible) return;

    // Automatic close after 4.2 seconds
    const fadeTimer = setTimeout(() => {
      setIsGreetingFading(true);
    }, 4200);

    const closeTimer = setTimeout(() => {
      setIsGreetingMounted(false);
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(closeTimer);
    };
  }, [greetingVisible]);

  useEffect(() => {
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

    // Helper: Draw authentic 4-pointed sparkle star with luminous halo
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

    // Helper: Burst rocket into slow-motion sparkling stars
    const explodeRocket = (rocket: Rocket) => {
      // If it's the grand opening rocket: trigger the "Happy Diwali" greeting!
      if (rocket.isGrandOpening) {
        setIsGreetingMounted(true);
        // Small delay to synchronize banner appearance with expanding star burst
        setTimeout(() => {
          setGreetingVisible(true);
        }, 80);
      }

      const starCount = rocket.isGrandOpening ? 76 : 52;
      const palette = rocket.palette;

      for (let i = 0; i < starCount; i++) {
        const angle =
          (Math.PI * 2 * i) / starCount + (Math.random() - 0.5) * 0.45;

        // Slow-motion gentle bloom velocity
        const speed = rocket.isGrandOpening
          ? Math.random() * 2.8 + 1.2
          : Math.random() * 2.2 + 0.8;
        const color = palette[Math.floor(Math.random() * palette.length)];

        particles.push({
          x: rocket.x,
          y: rocket.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: Math.random() * 0.0035 + 0.0025, // Lingers for 4-5 seconds
          size: Math.random() * 5.2 + 3.2,
          color,
          isStar: Math.random() > 0.2, // 80% are 4-pointed sparkle stars
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.06,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.06 + 0.04,
        });
      }

      // Bright center burst core flash
      const flashCount = rocket.isGrandOpening ? 16 : 8;
      for (let j = 0; j < flashCount; j++) {
        particles.push({
          x: rocket.x,
          y: rocket.y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          alpha: 1,
          decay: 0.02,
          size: Math.random() * 8 + 5,
          color: "#FFFBEB",
          isStar: true,
          rotation: 0,
          rotationSpeed: 0.02,
          twinklePhase: 0,
          twinkleSpeed: 0.1,
        });
      }
    };

    // Helper: Launch rocket from bottom with glowing light effect
    const launchRocket = (
      customX?: number,
      customTargetY?: number,
      isGrand?: boolean
    ) => {
      let x = customX;
      if (x === undefined) {
        const sideMargin = width * 0.08;
        x =
          Math.random() > 0.5
            ? sideMargin + Math.random() * (width * 0.36)
            : width * 0.56 + Math.random() * (width * 0.36);
      }

      const targetY =
        customTargetY ?? height * (Math.random() * 0.36 + 0.14);

      const palette =
        FESTIVE_PALETTES[Math.floor(Math.random() * FESTIVE_PALETTES.length)];
      const color = isGrand ? "#F59E0B" : palette[0];

      rockets.push({
        x,
        y: height + 10,
        targetY,
        // Smooth slow-motion rising speed
        speed: isGrand ? 3.0 : Math.random() * 0.9 + 2.3,
        trail: [],
        color,
        palette,
        isGrandOpening: isGrand,
      });
    };

    // =========================================================================
    // ENTRANCE SEQUENCE: Grand Rocket Launches from Center Bottom -> Bursts -> Happy Diwali!
    // =========================================================================
    setTimeout(() => {
      // Shoots up directly to the upper center of screen where Happy Diwali will appear!
      launchRocket(width * 0.5, height * 0.22, true);
    }, 250);

    // Flanking celebratory rockets a moment later
    setTimeout(() => launchRocket(width * 0.2, height * 0.26), 900);
    setTimeout(() => launchRocket(width * 0.8, height * 0.26), 1300);

    // Regular cadence afterwards: launches here and there ("akkadakkada")
    let lastLaunch = Date.now();
    let nextLaunchDelay = 2600;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const now = Date.now();
      if (now - lastLaunch > nextLaunchDelay) {
        launchRocket();
        lastLaunch = now;
        nextLaunchDelay = Math.random() * 2200 + 2600; // launches every 2.6s - 4.8s
      }

      // 1. Update & Render Rockets with Glowing Lights
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];

        r.trail.push({
          x: r.x,
          y: r.y,
          alpha: 1,
          size: Math.random() * 2.2 + 1.2,
        });
        if (r.trail.length > 22) r.trail.shift();

        r.y -= r.speed;
        r.speed *= 0.994; // Slow deceleration

        // Draw glowing light sparkler trail behind rocket
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

        // Luminous Rocket Halo Light (glow around rocket head)
        ctx.save();
        const glowGrad = ctx.createRadialGradient(r.x, r.y, 0, r.x, r.y, 18);
        glowGrad.addColorStop(0, "rgba(254, 240, 138, 0.85)");
        glowGrad.addColorStop(0.45, "rgba(245, 158, 11, 0.4)");
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 18, 0, Math.PI * 2);
        ctx.fill();

        // Glowing white-gold core tip
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 14;
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Apex reached -> slow motion burst into sparkling stars!
        if (r.y <= r.targetY || r.speed < 1.1) {
          explodeRocket(r);
          rockets.splice(i, 1);
        }
      }

      // 2. Update & Render Star Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.vx *= 0.982;
        p.vy *= 0.982;
        p.vy += 0.016; // gentle stardust gravity
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

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* High-performance CSS animations for Happy Diwali greeting */}
      <style>{`
        @keyframes diwaliGreetingBloom {
          0% {
            opacity: 0;
            transform: scale(0.65) translateY(12px);
            filter: blur(4px) drop-shadow(0 0 35px rgba(245, 158, 11, 0.9));
          }
          60% {
            opacity: 1;
            transform: scale(1.06) translateY(-2px);
            filter: blur(0px) drop-shadow(0 0 25px rgba(251, 191, 36, 0.8));
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: drop-shadow(0 0 16px rgba(245, 158, 11, 0.4));
          }
        }

        @keyframes diwaliDiyaFlicker {
          0%, 100% {
            transform: scale(1) translateY(0);
          }
          50% {
            transform: scale(1.12, 0.9) translateY(-1.5px);
          }
        }

        .diwali-greeting-bloom {
          animation: diwaliGreetingBloom 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .diwali-diya-flame {
          animation: diwaliDiyaFlicker 1.4s ease-in-out infinite;
          transform-origin: bottom center;
        }
      `}</style>

      {/* ========================================================================= */}
      {/* 1. "HAPPY DIWALI" EMERGES FROM THE ROCKET BURST & CLOSES AUTOMATICALLY     */}
      {/* ========================================================================= */}
      {isGreetingMounted && (
        <div
          className={`fixed top-18 sm:top-24 left-1/2 -translate-x-1/2 pointer-events-none z-30 flex flex-col items-center justify-center transition-all duration-800 ${
            isGreetingFading
              ? "opacity-0 -translate-y-5 scale-90"
              : greetingVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 scale-75"
          }`}
          aria-hidden="true"
        >
          <div className="diwali-greeting-bloom relative px-6 py-3 sm:px-9 sm:py-4 rounded-full bg-white/95 backdrop-blur-md border-2 border-amber-300 shadow-[0_12px_36px_rgba(245,158,11,0.32)] flex items-center gap-3 sm:gap-4.5">
            {/* Left Traditional Diya with Flickering Flame */}
            <div className="relative flex flex-col items-center">
              <div className="diwali-diya-flame w-3 h-4 -mb-0.5">
                <svg viewBox="0 0 12 16" fill="none" className="w-full h-full">
                  <path
                    d="M6 0 C6 0 0 7 0 11 C0 14 2.5 16 6 16 C9.5 16 12 14 12 11 C12 7 6 0 6 0 Z"
                    fill="#F59E0B"
                  />
                  <path
                    d="M6 4 C6 4 2.5 8 2.5 11 C2.5 13 4 14.5 6 14.5 C8 14.5 9.5 13 9.5 11 C9.5 8 6 4 6 4 Z"
                    fill="#FFFBEB"
                  />
                </svg>
              </div>
              <svg viewBox="0 0 24 10" fill="none" className="w-7 h-3">
                <path
                  d="M1 2 C3 8, 21 8, 23 2 C22 9, 16 10, 12 10 C8 10, 2 9, 1 2 Z"
                  fill="#B45309"
                />
                <ellipse cx="12" cy="2" rx="11" ry="2" fill="#78350F" />
              </svg>
            </div>

            {/* Glowing "Happy Diwali" Text */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                <span className="text-amber-500 text-base sm:text-lg">✨</span>
                <span className="text-xl sm:text-3xl font-black tracking-wide bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-xs">
                  Happy Diwali!
                </span>
                <span className="text-amber-500 text-base sm:text-lg">✨</span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-amber-700/85 -mt-0.5">
                Wishing you Light, Joy & Prosperity
              </span>
            </div>

            {/* Right Traditional Diya (Mirrored) */}
            <div className="relative flex flex-col items-center scale-x-[-1]">
              <div
                className="diwali-diya-flame w-3 h-4 -mb-0.5"
                style={{ animationDelay: "0.5s" }}
              >
                <svg viewBox="0 0 12 16" fill="none" className="w-full h-full">
                  <path
                    d="M6 0 C6 0 0 7 0 11 C0 14 2.5 16 6 16 C9.5 16 12 14 12 11 C12 7 6 0 6 0 Z"
                    fill="#F59E0B"
                  />
                  <path
                    d="M6 4 C6 4 2.5 8 2.5 11 C2.5 13 4 14.5 6 14.5 C8 14.5 9.5 13 9.5 11 C9.5 8 6 4 6 4 Z"
                    fill="#FFFBEB"
                  />
                </svg>
              </div>
              <svg viewBox="0 0 24 10" fill="none" className="w-7 h-3">
                <path
                  d="M1 2 C3 8, 21 8, 23 2 C22 9, 16 10, 12 10 C8 10, 2 9, 1 2 Z"
                  fill="#B45309"
                />
                <ellipse cx="12" cy="2" rx="11" ry="2" fill="#78350F" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DIWALI THEME LIGHT BACKGROUND (SUBTLY SOFTENED FESTIVE WARMTH)         */}
      {/* ========================================================================= */}
      <div
        className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
        aria-hidden="true"
      >
        {/* Warm Golden Diwali Celebration Theme Gradient (set to 0.12) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(254, 243, 199, 0.12) 0%, rgba(253, 230, 138, 0.045) 18%, rgba(243, 232, 255, 0.03) 45%, rgba(255, 255, 255, 0) 78%)",
          }}
        />

        {/* Ambient Warm Golden Glow Halo at Top Header Area (set to 0.12) */}
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-full max-w-6xl h-80 rounded-[50%]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 12%, rgba(254, 240, 138, 0.12) 0%, rgba(251, 191, 36, 0.04) 42%, transparent 72%)",
          }}
        />

        {/* Ambient Warm Golden Glow Halo on Left Side (set to 0.12) */}
        <div
          className="absolute top-16 -left-20 w-96 sm:w-[32rem] h-96 sm:h-[32rem] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, rgba(254, 240, 138, 0.12) 0%, rgba(251, 191, 36, 0.04) 45%, transparent 70%)",
          }}
        />

        {/* Ambient Warm Golden Glow Halo on Right Side (set to 0.12) */}
        <div
          className="absolute top-16 -right-20 w-96 sm:w-[32rem] h-96 sm:h-[32rem] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 65% 35%, rgba(254, 240, 138, 0.12) 0%, rgba(251, 191, 36, 0.04) 45%, transparent 70%)",
          }}
        />

        {/* Fireworks Canvas with Bottom-Launched Rockets & Glowing Star Bursts */}
        <canvas ref={canvasRef} className="absolute inset-0" />
      </div>
    </>
  );
};

export default FestiveBackground;
