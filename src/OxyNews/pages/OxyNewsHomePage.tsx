import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "../lib/api";
import type { NewsFeedItem, ExternalNewsArticle } from "../types";
import ArticleCard, { isDisplayableArticle } from "../components/ArticleCard";
import NewsBackground3D from "../components/NewsBackground3D";
import PlatformAdsBanner from "../components/PlatformAdsBanner";

const ROTATE_MS = 8000;

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
    transition: { duration, delay, repeat: Infinity, ease: "easeInOut" as const },
  };
}

type UnifiedArticle =
  | { kind: "internal"; item: NewsFeedItem; date: string }
  | { kind: "external"; item: ExternalNewsArticle; date: string };

function timeAgo(iso: string | null) {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const FALLBACK_IMG = "https://i.ibb.co/BH6wt6nQ/oxynews1.png";

const LETTER_COLORS = [
  "#7c3aed", "#2563eb", "#059669", "#ea580c", "#6d28d9",
  "#0284c7", "#c026d3", "#b45309", "#0d9488", "#8b5cf6",
  "#db2777", "#4338ca", "#65a30d", "#0891b2", "#f59e0b",
];

function getWordColors(category: string | null): string[] {
  const words = (category || "XX").trim().split(/\s+/);
  return words.map((_, i) => LETTER_COLORS[i % LETTER_COLORS.length]);
}

function getCategoryShortFormLocal(category: string | null): string {
  if (!category) return "XX";
  return category.trim().split(/\s+/).map(w => w[0].toUpperCase()).join("");
}

function getCardGradient(category: string | null): string {
  const colors = getWordColors(category);
  if (colors.length === 1) return `linear-gradient(135deg, ${colors[0]}22 0%, ${colors[0]}55 100%)`;
  return `linear-gradient(135deg, ${colors[0]}33 0%, ${colors[1 % colors.length]}44 60%, ${colors[2 % colors.length] ?? colors[0]}22 100%)`;
}

function ExternalCategoryOverlay({ category }: { category: string | null }) {
  const short = getCategoryShortFormLocal(category);
  const colors = getWordColors(category);
  return (
    <span className="text-5xl font-black drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] tracking-tight select-none">
      <span style={{ color: "#1e293b" }}>#</span>
      {short.split("").map((l, i) => (
        <span key={i} style={{ color: colors[i % colors.length] }}>{l}</span>
      ))}
    </span>
  );
}

function ExternalCard({
  article,
  featured = false,
  small = false,
}: {
  article: ExternalNewsArticle;
  featured?: boolean;
  small?: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const useRealImage = !!article.imageUrl && !imgError;
  const showOverlay = !useRealImage;

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-white rounded-xl shadow-card hover:shadow-lift transition-shadow duration-300 overflow-hidden h-full"
    >
      <div
        className="relative overflow-hidden"
        style={{ background: getCardGradient(article.category), minHeight: 110 }}
      >
        <img
          src={useRealImage ? article.imageUrl! : FALLBACK_IMG}
          alt={article.title}
          className={`w-full object-contain group-hover:scale-105 transition-transform duration-500 ${showOverlay ? "opacity-20" : ""}`}
          style={{ maxHeight: 180, minHeight: 110, width: "100%", display: "block" }}
          onError={() => setImgError(true)}
        />
        {showOverlay && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <ExternalCategoryOverlay category={article.category} />
          </div>
        )}
        {article.category && (
          <span
            className="absolute top-2 left-2 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow"
            style={{ backgroundColor: getWordColors(article.category)[0], color: "#fff" }}
          >
            {article.category}
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-3">
        <h3 className="font-display font-semibold text-plum leading-snug group-hover:text-royal transition-colors text-sm line-clamp-2">
          {article.title}
        </h3>
        {article.content && (
          <p className="mt-1.5 text-[11px] leading-relaxed line-clamp-2 text-ink-soft flex-1">
            {article.content}
          </p>
        )}
        <div className="mt-2 flex items-center justify-between gap-1">
          <span className="text-[10px] text-ink-faint font-mono">
            {timeAgo(article.publishedDate || article.fetchedAt)}
          </span>
        </div>
      </div>
    </a>
  );
}

export default function OxyNewsHomePage() {
  const [items, setItems] = useState<NewsFeedItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // ── Newsdata.io external cards ────────────────────────────────────────
  const [newsdataItems, setNewsdataItems] = useState<ExternalNewsArticle[]>([]);
  const [newsdataLoading, setNewsdataLoading] = useState(true);
  const [newsdataError, setNewsdataError] = useState<string | null>(null);

  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [trendingIndex, setTrendingIndex] = useState(0);
  const rotateTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const trendingTimer = useRef<ReturnType<typeof setInterval> | null>(null);
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

  // Load Newsdata.io cards once on mount.
  useEffect(() => {
    loadNewsdata();
  }, []);

  function loadNewsdata() {
    setNewsdataLoading(true);
    setNewsdataError(null);
    api
      .getExternalNews("newsdata", 0, 20)
      .then((res) => setNewsdataItems(res.content))
      .catch(() => setNewsdataError("Couldn't load Newsdata.io articles."))
      .finally(() => setNewsdataLoading(false));
  }

  function refreshNewsdata() {
    setNewsdataLoading(true);
    setNewsdataError(null);
    api
      .refreshNewsdataNews() // backend defaults: country=in, language=en
      .then((result) => {
        console.log("Newsdata refresh result:", result); // remove once confirmed working
        if (!result.success) {
          setNewsdataError(result.message);
        } else if (result.saved === 0) {
          setNewsdataError(result.message); // e.g. "fetched N but all duplicates"
        }
        return api.getExternalNews("newsdata", 0, 20);
      })
      .then((res) => setNewsdataItems(res.content))
      .catch(() => setNewsdataError("Refresh failed."))
      .finally(() => setNewsdataLoading(false));
  }

  const visibleItems = items.filter(isDisplayableArticle);

  const internalFeed = useMemo(() => {
    return visibleItems.map((item) => ({
      kind: "internal" as const,
      item,
      date: item.createdAt || "",
    }));
  }, [visibleItems]);

  const externalFeed = useMemo(() => {
    return newsdataItems.map((item) => ({
      kind: "external" as const,
      item,
      date: item.publishedDate || item.fetchedAt || "",
    }));
  }, [newsdataItems]);

  useEffect(() => {
    if (rotateTimer.current) clearInterval(rotateTimer.current);
    if (internalFeed.length <= 1) return;

    rotateTimer.current = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % internalFeed.length);
    }, ROTATE_MS);

    return () => {
      if (rotateTimer.current) clearInterval(rotateTimer.current);
    };
  }, [internalFeed.length]);

  useEffect(() => {
    if (trendingTimer.current) clearInterval(trendingTimer.current);
    if (internalFeed.length <= 3) return;

    trendingTimer.current = setInterval(() => {
      setTrendingIndex((prev) => (prev + 1) % internalFeed.length);
    }, ROTATE_MS);

    return () => {
      if (trendingTimer.current) clearInterval(trendingTimer.current);
    };
  }, [internalFeed.length]);

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

  const [orderedFeed, setOrderedFeed] = useState<typeof internalFeed>([]);
  const dragFrom = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);

  useEffect(() => {
    setOrderedFeed(internalFeed);
  }, [internalFeed]);

  function handleDragStart(idx: number) {
    dragFrom.current = idx;
  }

  function handleDragEnter(idx: number) {
    dragOver.current = idx;
  }

  function handleDrop() {
    const from = dragFrom.current;
    const to = dragOver.current;
    if (from === null || to === null || from === to) return;
    setOrderedFeed(prev => {
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
    dragFrom.current = null;
    dragOver.current = null;
  }

  useEffect(() => {
    if (orderedFeed.length < 2) return;
    const t = setInterval(() => {
      setOrderedFeed(prev => {
        const next = [...prev];
        const i = Math.floor(Math.random() * next.length);
        let j = Math.floor(Math.random() * (next.length - 1));
        if (j >= i) j++;
        [next[i], next[j]] = [next[j], next[i]];
        return next;
      });
    }, 3000);
    return () => clearInterval(t);
  }, [orderedFeed.length]);

  return (
    <>
      <NewsBackground3D />

      <div className="relative z-10 flex flex-col" style={{ minHeight: "calc(100dvh - 120px)" }}>
        <div className="pt-3 shrink-0">
          <PlatformAdsBanner />
        </div>

        <div className="flex flex-1 min-h-0 gap-3">
          <div
            ref={articlesRef}
            className="flex-1 min-w-0 overflow-y-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ overflowX: "visible" }}
          >
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

            {!error && !loading && internalFeed.length === 0 && externalFeed.length === 0 && (
              <div className="bg-white border border-ink/10 rounded-lg p-12 text-center">
                <p className="font-display text-xl text-plum">No displayable articles yet</p>
                <p className="text-sm text-ink-faint mt-1">
                  Articles without a title or classification are hidden until they have a displayable name.
                </p>
              </div>
            )}

            {!error && !loading && internalFeed.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <h2 className="font-display font-semibold text-plum text-lg uppercase tracking-wide">
                    Trending
                  </h2>
                </div>

                {orderedFeed.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 items-stretch" style={{ overflow: "visible" }}>
                    {orderedFeed.slice(0, 3).map((item, colIdx) => (
                      <div
                        key={item.item.paperclipId}
                        className="h-full relative"
                        draggable
                        onDragStart={() => { dragFrom.current = colIdx; }}
                        onDragEnter={() => { dragOver.current = colIdx; }}
                        onDragOver={e => e.preventDefault()}
                        onDrop={handleDrop}
                        style={{ cursor: "grab" }}
                      >
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.div
                            key={item.item.paperclipId}
                            initial={{ opacity: 0, x: 60, scale: 0.97 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -60, scale: 0.97 }}
                            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="h-full"
                          >
                            <ArticleCard item={item.item} featured />
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}

                {orderedFeed.length > 3 && (
                  <div className="grid grid-cols-3 gap-3 mt-2 items-stretch" style={{ overflow: "visible" }}>
                    {orderedFeed.slice(3).map((item, idx) => (
                      <div
                        key={item.item.paperclipId}
                        className="h-full"
                        draggable
                        onDragStart={() => { dragFrom.current = idx + 3; }}
                        onDragEnter={() => { dragOver.current = idx + 3; }}
                        onDragOver={e => e.preventDefault()}
                        onDrop={handleDrop}
                        style={{ cursor: "grab" }}
                      >
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.div
                            key={item.item.paperclipId}
                            initial={{ opacity: 0, x: 40, scale: 0.97 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -40, scale: 0.97 }}
                            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="h-full"
                          >
                            <ArticleCard item={item.item} />
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}

                {hasMore && (
                  <div className="flex justify-center mt-6 mb-4">
                    <button
                      onClick={loadMore}
                      className="focus-ring px-8 py-3 rounded-full bg-royal text-white font-semibold text-sm shadow-lg hover:bg-plum hover:scale-105 transition-all"
                    >
                      Load more articles
                    </button>
                  </div>
                )}
              </div>
            )}



            {showBackToTop && (
              <button
                onClick={() => articlesRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
                className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold text-xl text-plum shadow-lg transition-transform hover:scale-105 focus-ring sm:bottom-6 sm:right-6"
                aria-label="Back to top"
              >
                ↑
              </button>
            )}
          </div>

          {!error && !newsdataLoading && externalFeed.length > 0 && (
            <div className="w-80 shrink-0 overflow-y-auto pb-4 border-l border-ink/10 bg-white/50">
              <div className="flex items-center justify-between px-3 py-2">
                <h2 className="font-display font-semibold text-plum text-sm uppercase tracking-wide">
                  Latest News
                </h2>
                <button
                  onClick={refreshNewsdata}
                  disabled={newsdataLoading}
                  className="focus-ring inline-flex items-center gap-1 rounded-full border border-ink/10 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-royal transition hover:bg-royal hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {newsdataLoading ? "Refreshing..." : "Refresh"}
                </button>
              </div>
              <div className="flex flex-col gap-2 px-2">
                {externalFeed.map((item) => (
                  <ExternalCard key={item.item.id} article={item.item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}