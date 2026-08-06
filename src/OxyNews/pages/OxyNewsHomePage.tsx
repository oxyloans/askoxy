import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "../lib/api";
import type { NewsFeedItem } from "../types";
import ArticleCard, { isDisplayableArticle } from "../components/ArticleCard";
import NewsBackground3D from "../components/NewsBackground3D";
import PlatformAdsBanner from "../components/PlatformAdsBanner";
import { PLATFORMS } from "../components/ResourceNavBar";

const ROTATE_MS = 8000;

// Gentle, slower floating motion for idle cards.
function floatAnimation(index: number) {
  const col = index % 3;
  const yAmp = 4 + (index % 3) * 1.2;
  const duration = 14 + (index % 3) * 2.5;
  const delay = (index % 4) * 0.8;

  return {
    animate: {
      y: [0, -yAmp, 0],
      x: col === 2 ? [0, 3, -1, 0] : [0, 0, 0, 0],
      rotate: col === 2 ? [0, 0.4, -0.3, 0] : [0, 0, 0, 0],
    },
    transition: {
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };
}

export default function OxyNewsHomePage() {
  const [items, setItems] = useState<NewsFeedItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Which item (by index into `items`) is currently the big/featured card.
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const rotateTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const articlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPage(0);
    setItems([]);
    setFeaturedIndex(0);
    setLoading(true);
    setError(null);
    api
      .getFeed({ sort: "latest", page: 0, size: 12 })
      .then((res) => {
        setItems(res.content);
        setHasMore(!res.last);
      })
      .catch(() => setError("Couldn't reach the feed. Check the backend is running."))
      .finally(() => setLoading(false));
  }, []);

  // Auto-rotate the featured card every 3s.
  useEffect(() => {
    if (rotateTimer.current) clearInterval(rotateTimer.current);
    if (items.length <= 1) return;

    rotateTimer.current = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % items.length);
    }, ROTATE_MS);

    return () => {
      if (rotateTimer.current) clearInterval(rotateTimer.current);
    };
  }, [items.length]);

  function loadMore() {
    const next = page + 1;
    api
      .getFeed({ sort: "latest", page: next, size: 12 })
      .then((res) => {
        setItems((prev) => [...prev, ...res.content]);
        setHasMore(!res.last);
        setPage(next);
      })
      .catch(() => {});
  }

  useEffect(() => {
    const el = articlesRef.current;
    if (!el) return;
    const handleScroll = () => setShowBackToTop(el.scrollTop > 300);
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const visibleItems = items.filter(isDisplayableArticle);
  const safeFeaturedIndex = visibleItems.length ? featuredIndex % visibleItems.length : 0;
  const featured = visibleItems[safeFeaturedIndex];
  const rest = visibleItems.filter((_, i) => i !== safeFeaturedIndex);

  return (
    <>
      <NewsBackground3D />

      <div className="relative z-10 flex flex-col" style={{ height: "calc(100dvh - 160px)" }}>

        {/* Ads banner — fixed above scroll area, never moves */}
        <div className="px-3 sm:px-4 lg:pr-[272px] lg:pl-6 pt-3 shrink-0">
          <PlatformAdsBanner />
        </div>

        <div className="flex flex-1 min-h-0">
          <div ref={articlesRef} className="flex-1 min-w-0 overflow-y-auto px-3 sm:px-4 lg:pr-[272px] lg:pl-6 pb-4
                       [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        {error && (
          <div className="bg-white border border-ink/10 rounded-lg p-8 text-center">
            <p className="font-display text-lg text-plum">{error}</p>
            <p className="text-sm text-ink-faint mt-1 font-mono">
              expected at http://localhost:9041/api/ai-automation
            </p>
          </div>
        )}

        {!error && loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-card overflow-hidden animate-pulse">
                <div className="aspect-[16/10] bg-plum-light/30" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-ink/10 rounded w-3/4" />
                  <div className="h-3 bg-ink/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!error && !loading && visibleItems.length === 0 && (
          <div className="bg-white border border-ink/10 rounded-lg p-12 text-center">
            <p className="font-display text-xl text-plum">No displayable articles yet</p>
            <p className="text-sm text-ink-faint mt-1">
              Articles without a title or classification are hidden until they have a displayable name.
            </p>
          </div>
        )}

        {!error && !loading && visibleItems.length > 0 && (
          <>
            {/* Featured hero card plus 2 secondary cards. */}
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[2fr_1fr]">
              <div className="grid grid-cols-1 gap-3">
                <AnimatePresence mode="wait">
                  {featured && (
                    <motion.div
                      key={featured.paperclipId}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.45, ease: "easeInOut" }}
                      style={{ willChange: "opacity, transform" }}
                    >
                      <div className="relative">
                        <ArticleCard item={featured} featured />

                        {/* Prev / Next controls */}
                        <button
                          onClick={() => setFeaturedIndex((i) => (i - 1 + visibleItems.length) % visibleItems.length)}
                          className="focus-ring absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-plum shadow-md transition hover:bg-white sm:left-3 sm:h-11 sm:w-11"
                          aria-label="Previous featured"
                        >
                          ‹
                        </button>
                        <button
                          onClick={() => setFeaturedIndex((i) => (i + 1) % visibleItems.length)}
                          className="focus-ring absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-plum shadow-md transition hover:bg-white sm:right-3 sm:h-11 sm:w-11"
                          aria-label="Next featured"
                        >
                          ›
                        </button>

                        {/* Dots */}
                        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-plum/70 px-3 py-2 backdrop-blur">
                          {Array.from({ length: Math.min(4, visibleItems.length) }).map((_, idx) => {
                            const dotActive = safeFeaturedIndex === idx;
                            return (
                              <button
                                key={idx}
                                onClick={() =>
                                  setFeaturedIndex((prev) => {
                                    if (!visibleItems.length) return 0;
                                    return idx < visibleItems.length ? idx : idx % visibleItems.length;
                                  })
                                }
                                className={`focus-ring h-2.5 rounded-full transition-all ${dotActive ? "w-6 bg-gold" : "w-2.5 bg-white/70 hover:bg-white"}`}
                                aria-label={`Show featured ${idx + 1}`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {rest.slice(0, 2).map((item, i) => (
                  <motion.div
                    key={item.paperclipId}
                    {...floatAnimation(i + 1)}
                    style={{ willChange: "transform" }}
                  >
                    <ArticleCard item={item} />
                  </motion.div>
                ))}
              </div>
            </div>

            {rest.length > 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-3">
                {rest.slice(2).map((item, i) => (
                  <motion.div
                    key={item.paperclipId}
                    {...floatAnimation(i + 3)}
                    style={{ willChange: "transform" }}
                  >
                    <ArticleCard item={item} />
                  </motion.div>
                ))}
              </div>
            )}

            {hasMore && (
              <div className="flex justify-center mt-8 mb-4">
                <button
                  onClick={loadMore}
                  className="focus-ring px-8 py-3 rounded-full bg-royal text-white font-semibold text-sm shadow-lg hover:bg-plum hover:scale-105 transition-all"
                >
                  Load more articles
                </button>
              </div>
            )}
            {/* Back to top button */}
            {showBackToTop && (
              <button
                onClick={() => articlesRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
                className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold text-xl text-plum shadow-lg transition-transform hover:scale-105 focus-ring sm:bottom-6 sm:right-6"
                aria-label="Back to top"
              >
                ↑
              </button>
            )}
          </>
        )}
        </div>
        </div>

        {/* Platform cards sidebar - fixed to right edge */}
        <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ position: "fixed", top: "160px", right: 0, height: "calc(100dvh - 160px)" }}>
          <div className="bg-white rounded-xl border border-ink/10 shadow-card p-3 flex flex-col gap-3">
            <h2 className="font-display text-sm font-semibold text-plum-dark uppercase tracking-widest border-b border-ink/10 pb-2">Our Platforms</h2>
            {PLATFORMS.map((p) => (
              <div key={p.name} className="rounded-lg border border-ink/10 overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden bg-plum-light">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="px-3 py-2 flex flex-col gap-2 bg-white">
                  {p.name === "ASKOXY.AI" ? (
                    <img src="https://www.askoxy.ai/static/media/askoxylogonew.c34f3429a1c63f5f261b.png" alt="ASKOXY.AI" className="h-6 object-contain" />
                  ) : p.name === "OXYGOLD.AI" ? (
                    <img src="https://www.oxygold.ai/assets/oxygoldlogo-BhcbXH-W.png" alt="OXYGOLD.AI" className="h-6 object-contain" />
                  ) : p.name === "OXYBRICKS" ? (
                    <img src="https://www.oxybricks.world/c257039a9f6a9a4cc609cff03093e6f8.png" alt="OXYBRICKS" className="h-6 object-contain brightness-0" />
                  ) : p.name === "OXYLOANS" ? (
                    <img src="https://oxyloans.com/wp-content/themes/oxyloan/oxyloan/_ui/images/logo.png" alt="OXYLOANS" className="h-6 object-contain brightness-0" />
                  ) : (
                    <span className="font-display font-semibold text-plum text-sm leading-snug">{p.name}</span>
                  )}
                  <p className="text-xs text-ink-faint">{p.description}</p>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1 rounded-full bg-royal text-white text-[11px] font-semibold px-3 py-1.5 hover:bg-plum transition-colors w-full"
                  >
                    Visit ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </aside>
        </div>
      </>
  );
}