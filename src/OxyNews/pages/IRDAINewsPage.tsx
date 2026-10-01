import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../lib/api";
import type { IrdaiPressRelease, NewsFeedItem } from "../types";
import ArticleCard from "../components/ArticleCard";

const IRDAI_IMG = "https://i.ibb.co/Y4nNP4hS/Chat-GPT-Image-Sep-25-2026-11-20-45-AM.png";

const BADGE_COLORS = [
  "#7c3aed", "#2563eb", "#059669", "#ea580c", "#6d28d9",
  "#0284c7", "#c026d3", "#b45309", "#0d9488", "#db2777",
  "#4338ca", "#65a30d", "#0891b2", "#f59e0b", "#dc2626",
];

function badgeColor(seed: string): string {
  const hash = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return BADGE_COLORS[hash % BADGE_COLORS.length];
}

function formatDateArr(arr: number[] | null | undefined) {
  if (!arr || arr.length < 3) return "";
  return new Date(arr[0], arr[1] - 1, arr[2]).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function googleDocsUrl(pdfUrl: string) {
  return `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
}

/* ── Smart Image Component with Skeleton Loader & Fallback ──────────────── */
function SmartImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative h-full w-full bg-slate-100 overflow-hidden">
      {!loaded && !error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-orange-50 via-amber-100/60 to-orange-50 animate-pulse">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-orange-300 border-t-orange-600" />
        </div>
      )}
      {error ? (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-orange-500 via-amber-600 to-orange-600 p-3 text-center text-white">
          <svg className="w-6 h-6 mb-1 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className="text-[11px] font-bold tracking-wider uppercase">IRDAI Release</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`${className || ""} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}

/* ── Skeleton Card Loader Component ────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden animate-pulse shadow-sm">
      <div className="h-32 bg-slate-200/80" />
      <div className="p-3 flex flex-col gap-2.5">
        <div className="h-4 bg-slate-200 rounded w-11/12" />
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
          <div className="h-4 w-20 bg-orange-100/70 rounded-full" />
          <div className="h-4 w-4 bg-slate-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ── PDF Preview Modal ─────────────────────────────────────────────────── */
function PDFModal({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative flex flex-col w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl bg-white"
          style={{ height: "90vh" }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-orange-50 border-b border-orange-100 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{title}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 transition"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Open PDF
              </a>
              <a
                href={url}
                download
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600 transition"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download
              </a>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Loading spinner shown until iframe fires onLoad */}
          {!loaded && (
            <div className="absolute inset-0 top-[52px] flex flex-col items-center justify-center gap-3 bg-white z-10">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
              <p className="text-sm font-medium text-slate-600">Loading PDF document…</p>
            </div>
          )}

          {/* Google Docs viewer renders the PDF cross-origin */}
          <iframe
            key={url}
            src={googleDocsUrl(url)}
            title={title}
            className="flex-1 w-full border-0"
            onLoad={() => setLoaded(true)}
            allow="autoplay"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────── */
export default function IRDAINewsPage() {
  const [items, setItems] = useState<IrdaiPressRelease[]>([]);
  const [feedItems, setFeedItems] = useState<NewsFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [showTop, setShowTop] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [preview, setPreview] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    function onScroll() { setShowTop(window.scrollY > 300); }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function fetchData(isRefresh = false) {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(false);
    Promise.allSettled([
      api.getIrdaiPressReleases(),
      api.getRbiFeedItems(),
    ]).then(([irdaiRes, feedRes]) => {
      if (irdaiRes.status === "fulfilled") {
        const notifications = (irdaiRes.value as any)?.notifications ?? (irdaiRes.value as any)?.data?.notifications ?? [];
        setItems(notifications);
      }
      if (feedRes.status === "fulfilled") {
        const all = feedRes.value as NewsFeedItem[];
        setFeedItems(all.filter(i => (i.category || "").toLowerCase().includes("insur") || (i.domain || "").toLowerCase().includes("insur")));
      }
      if (irdaiRes.status === "rejected") setError(true);
    }).finally(() => { setLoading(false); setRefreshing(false); });
  }

  useEffect(() => { fetchData(); }, []);

  const q = search.toLowerCase();
  const filtered = items.filter(item => (item.name || "").toLowerCase().includes(q));
  const filteredFeed = feedItems.filter(item => (item.articleName || "").toLowerCase().includes(q));

  if (loading) return (
    <div className="pb-12">
      {/* Header Skeleton */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 animate-pulse">
        <div>
          <div className="h-7 w-64 bg-slate-200 rounded-md" />
          <div className="h-4 w-80 bg-slate-200 rounded-md mt-2" />
        </div>
        <div className="h-8 w-28 bg-orange-100/70 rounded-full" />
      </div>

      {/* Search Bar Skeleton */}
      <div className="mb-6 h-11 bg-slate-200/80 rounded-xl animate-pulse" />

      {/* Cards Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((key) => (
          <SkeletonCard key={key} />
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center px-4">
      <div className="text-4xl">⚠️</div>
      <p className="text-base font-semibold text-slate-700">Failed to load IRDAI news</p>
      <p className="text-sm text-slate-500">Please try again later.</p>
    </div>
  );

  return (
    <div className="pb-12">
      {preview && (
        <PDFModal url={preview.url} title={preview.title} onClose={() => setPreview(null)} />
      )}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">IRDAI Press Releases</h1>
          <p className="text-sm text-slate-500 mt-0.5">Insurance Regulatory and Development Authority of India</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">{filtered.length} articles</span>
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 hover:border-orange-400 hover:text-orange-600 transition disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M23 4v6h-6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M1 20v-6h6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </motion.div>

      {/* Search */}
      <div className="mb-6 relative">
        <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search press releases…"
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 shadow-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
        />
      </div>

      {filtered.length === 0 && filteredFeed.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          {search ? <>No results for "<span className="font-semibold">{search}</span>"</> : "No IRDAI articles yet."}
        </div>
      )}

      {/* AI Analysed Articles */}
      {filteredFeed.length > 0 && (
        <>
          <h2 className="font-display font-semibold text-plum text-lg uppercase tracking-wide mb-3">AI Analysed Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {filteredFeed.map((item) => (
              <ArticleCard key={item.paperclipId} item={item} />
            ))}
          </div>
        </>
      )}

      {filtered.length > 0 && (
        <>
          <h2 className="font-display font-semibold text-plum text-lg uppercase tracking-wide mb-3">Latest Press Releases</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setPreview({ url: item.fileUrl, title: item.name || "Untitled" })}
                className="group flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-orange-400 transition-all overflow-hidden cursor-pointer"
              >
                <div className="relative h-32 overflow-hidden">
                  <SmartImage
                    src={IRDAI_IMG}
                    alt="IRDAI"
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                  <span className="absolute bottom-2 right-2 text-[10px] font-medium text-white/90 z-10">
                    {formatDateArr(item.date)}
                  </span>
                </div>
                <div className="flex flex-col flex-1 p-3 gap-2">
                  <p className="text-sm font-semibold leading-snug text-slate-800 group-hover:text-orange-700 transition-colors line-clamp-3 flex-1">
                    {item.name || "Untitled"}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-700">
                      Press Release
                    </span>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-300 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition hover:bg-orange-600"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
