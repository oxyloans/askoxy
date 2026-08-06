import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PLATFORMS } from "./ResourceNavBar";

const AD_ROTATE_MS = 4000;

export default function PlatformAdsBanner() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (paused || PLATFORMS.length <= 1) return;

    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % PLATFORMS.length);
    }, AD_ROTATE_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  if (!PLATFORMS.length) return null;

  const current = PLATFORMS[index];

  return (
    <div
      className="w-full mb-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-20 sm:h-24 rounded-lg overflow-hidden shadow-card border border-ink/10">
        <AnimatePresence mode="wait">
          <motion.a
            key={current.name}
            href={current.url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 block"
          >
            <img
              src={current.image}
              alt={current.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-plum/90 via-plum/50 to-transparent" />

            <div className="relative z-10 h-full flex flex-row items-center gap-3 px-10 sm:px-12">
              <span className="shrink-0">
                {current.name === "ASKOXY.AI" ? (
                  <img src="https://www.askoxy.ai/static/media/askoxylogonew.c34f3429a1c63f5f261b.png" className="h-6 object-contain" alt="ASKOXY.AI" />
                ) : current.name === "OXYGOLD.AI" ? (
                  <img src="https://www.oxygold.ai/assets/oxygoldlogo-BhcbXH-W.png" className="h-6 object-contain" alt="OXYGOLD.AI" />
                ) : current.name === "OXYBRICKS" ? (
                  <img src="https://www.oxybricks.world/c257039a9f6a9a4cc609cff03093e6f8.png" className="h-6 object-contain brightness-0" alt="OXYBRICKS" />
                ) : current.name === "OXYLOANS" ? (
                  <img src="https://oxyloans.com/wp-content/themes/oxyloan/oxyloan/_ui/images/logo.png" className="h-6 object-contain brightness-0" alt="OXYLOANS" />
                ) : (
                  <span className="font-display text-sm sm:text-base font-bold text-white leading-none drop-shadow">{current.name}</span>
                )}
              </span>
              <p className="text-[10px] sm:text-xs text-white/85 line-clamp-1 flex-1">
                {current.description}
              </p>
              <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-white text-royal text-xs font-bold px-4 py-2 mr-6 shadow-md">
                Visit ↗
              </span>
            </div>
          </motion.a>
        </AnimatePresence>

        {/* Prev / Next arrows */}
        <button
          onClick={() => setIndex((i) => (i - 1 + PLATFORMS.length) % PLATFORMS.length)}
          className="focus-ring absolute left-1 top-1/2 z-20 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-sm text-plum shadow-md transition hover:bg-white"
          aria-label="Previous ad"
        >
          ‹
        </button>
        <button
          onClick={() => setIndex((i) => (i + 1) % PLATFORMS.length)}
          className="focus-ring absolute right-1 top-1/2 z-20 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-sm text-plum shadow-md transition hover:bg-white"
          aria-label="Next ad"
        >
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-1 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full bg-plum/60 px-2 py-1 backdrop-blur">
          {PLATFORMS.map((p, i) => (
            <button
              key={p.name}
              onClick={() => setIndex(i)}
              className={`focus-ring h-2 rounded-full transition-all ${
                i === index ? "w-5 bg-gold" : "w-2 bg-white/70 hover:bg-white"
              }`}
              aria-label={`Show ${p.name}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}