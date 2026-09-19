import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import ArticleCard from "../components/ArticleCard";
import type { NewsFeedItem, RbiPressRelease, RbiCampaignPressRelease } from "../types";

type RbiFeedItem = {
  paperclipId: string;
  articleName?: string;
  domain?: string;
  category?: string;
  shortSummary?: string;
  imageUrl?: string;
  overallScore?: number;
  tags?: string[];
  createdAt?: string;
  filename?: string;
};

function toNewsFeedItem(item: RbiFeedItem): NewsFeedItem {
  return {
    paperclipId: item.paperclipId,
    articleName: item.articleName,
    domain: item.domain,
    category: item.category,
    shortSummary: item.shortSummary,
    imageUrl: item.imageUrl,
    overallScore: item.overallScore,
    tags: item.tags,
    createdAt: item.createdAt,
    fileName: item.filename,
  } as NewsFeedItem;
}

type FeedItem = RbiFeedItem;

function formatDate(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateArr(arr: number[] | null | undefined) {
  if (!arr || arr.length < 3) return "";
  const d = new Date(arr[0], arr[1] - 1, arr[2]);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function isPdfName(name: string | null | undefined): boolean {
  return !!name && /\.pdf$/i.test(name.trim());
}

const BADGE_COLORS = [
  "#7c3aed", "#2563eb", "#059669", "#ea580c", "#6d28d9",
  "#0284c7", "#c026d3", "#b45309", "#0d9488", "#db2777",
  "#4338ca", "#65a30d", "#0891b2", "#f59e0b", "#dc2626",
];
function badgeColor(seed: string): string {
  const hash = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return BADGE_COLORS[hash % BADGE_COLORS.length];
}
const RBI_FALLBACK_IMG = "https://i.ibb.co/xKnPH4Sr/Chat-GPT-Image-Sep-3-2026-11-30-25-AM.png";
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 text-slate-300 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export default function RBINewsPage() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [rbiItems, setRbiItems] = useState<RbiPressRelease[]>([]);
  const [campaignItems, setCampaignItems] = useState<RbiCampaignPressRelease[]>([]);
  const [dailyItems, setDailyItems] = useState<RbiCampaignPressRelease[]>([]);
  const [dailyVisible, setDailyVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [showTop, setShowTop] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    function onScroll() { setShowTop(window.scrollY > 300); }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function fetchData(isRefresh = false) {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(false);
    Promise.allSettled([
      api.getRbiFeedItems(),
      api.getRbiPressReleases(0, 100),
      api.getRbiCampaignPressReleases(),
      api.getRbiDailyPressReleases(),
    ]).then(([feedRes, rbiRes, campaignRes, dailyRes]) => {
      if (feedRes.status === "fulfilled") {
        setFeedItems(feedRes.value as FeedItem[]);
      }
      if (rbiRes.status === "fulfilled") setRbiItems(rbiRes.value.content);
      if (campaignRes.status === "fulfilled") setCampaignItems(campaignRes.value.notifications ?? []);
      if (dailyRes.status === "fulfilled" && isRefresh) {
        setDailyItems(dailyRes.value.notifications ?? []);
        setDailyVisible(true);
      }
      if (
        feedRes.status === "rejected" && rbiRes.status === "rejected" &&
        campaignRes.status === "rejected"
      ) setError(true);
    }).finally(() => { setLoading(false); setRefreshing(false); });
  }

  useEffect(() => { fetchData(); }, []);

  const q = search.toLowerCase();
  const filteredFeed = feedItems.filter(item => (item.articleName || "").toLowerCase().includes(q));
  const filteredRbi = rbiItems.filter(item => (item.title || "").toLowerCase().includes(q));
  const filteredCampaign = campaignItems.filter(item => (item.name || "").toLowerCase().includes(q));
  const filteredDaily = dailyItems.filter(item => (item.name || "").toLowerCase().includes(q));
  const totalCount = filteredFeed.length + filteredRbi.length + filteredCampaign.length + (dailyVisible ? filteredDaily.length : 0);

  if (loading) return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      <p className="text-sm text-slate-500">Loading RBI press releases…</p>
    </div>
  );

  if (error) return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center px-4">
      <div className="text-4xl">⚠️</div>
      <p className="text-base font-semibold text-slate-700">Failed to load RBI news</p>
      <p className="text-sm text-slate-500">Please try again later.</p>
    </div>
  );

  return (
    <div className="pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">RBI Press Releases</h1>
          <p className="text-sm text-slate-500 mt-0.5">Reserve Bank of India notifications &amp; AI-analyzed articles</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">{totalCount} articles</span>
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 hover:border-blue-400 hover:text-blue-600 transition disabled:opacity-50"
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
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
        />
      </div>

      {totalCount === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          {search ? <>No results for "<span className="font-semibold">{search}</span>"</> : "No RBI articles yet."}
        </div>
      )}

      {/* AI Analysed — ArticleCard identical to OxyNews home page */}
      {filteredFeed.length > 0 && (
        <>
          <h2 className="font-display font-semibold text-plum text-lg uppercase tracking-wide mb-3">AI Analysed Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {filteredFeed.map((item) => (
              <ArticleCard key={item.paperclipId} item={toNewsFeedItem(item)} />
            ))}
          </div>
        </>
      )}

      {/* Daily Press Releases — only shown after Refresh */}
      {dailyVisible && filteredDaily.length > 0 && (
        <>
          <h2 className="font-display font-semibold text-plum text-lg uppercase tracking-wide mb-3">Daily Press Releases</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {filteredDaily.map((item, i) => (
              <motion.a
                key={item.id}
                href={item.fileUrl}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-orange-400 transition-all overflow-hidden"
              >
                <div className="relative h-32 overflow-hidden">
                  <img src={RBI_FALLBACK_IMG} alt="RBI" className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute bottom-2 right-2 text-[10px] font-medium text-white/80">{formatDateArr(item.date)}</span>
                  <span className="absolute left-2 top-2 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider shadow" style={{ backgroundColor: badgeColor(item.id), color: "#fff" }}>
                    {item.type || "Daily"}
                  </span>
                </div>
                <div className="flex flex-col flex-1 p-3 gap-2">
                  <p className="text-sm font-semibold leading-snug text-slate-800 group-hover:text-orange-700 transition-colors line-clamp-3 flex-1">
                    {item.name || "Untitled"}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-700">Press Release</span>
                    <ArrowIcon />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </>
      )}

      {/* Campaign Press Releases */}
      {filteredCampaign.length > 0 && (
        <>
          <h2 className="font-display font-semibold text-plum text-lg uppercase tracking-wide mb-3">Latest Press Releases</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {filteredCampaign.map((item, i) => (
              <motion.a
                key={item.id}
                href={item.fileUrl}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-blue-400 transition-all overflow-hidden"
              >
                <div className="relative h-32 overflow-hidden">
                  <img src={RBI_FALLBACK_IMG} alt="RBI" className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute bottom-2 right-2 text-[10px] font-medium text-white/80">{formatDateArr(item.date)}</span>
                  <span className="absolute left-2 top-2 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider shadow" style={{ backgroundColor: badgeColor(item.id), color: "#fff" }}>
                    {item.type || "RBI"}
                  </span>
                </div>
                <div className="flex flex-col flex-1 p-3 gap-2">
                  <p className="text-sm font-semibold leading-snug text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-3 flex-1">
                    {item.name || "Untitled"}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700">Press Release</span>
                    <ArrowIcon />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </>
      )}

      {/* From RBI.org.in */}
      {filteredRbi.length > 0 && (
        <>
          <h2 className="font-display font-semibold text-plum text-lg uppercase tracking-wide mb-3">From RBI.org.in</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredRbi.map((item, i) => (
              <motion.a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-blue-400 transition-all overflow-hidden"
              >
                <div className="relative h-32 overflow-hidden">
                  <img src={item.imageUrl || RBI_FALLBACK_IMG} alt="RBI" className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute bottom-2 right-2 text-[10px] font-medium text-white/80">{formatDate(item.publishedDate)}</span>
                  <span className="absolute left-2 top-2 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider shadow" style={{ backgroundColor: badgeColor(String(item.id)), color: "#fff" }}>
                    {item.category || "RBI"}
                  </span>
                </div>
                <div className="flex flex-col flex-1 p-3 gap-2">
                  <p className="text-sm font-semibold leading-snug text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-3 flex-1">
                    {item.title || "Untitled"}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700">RBI.org.in</span>
                    <ArrowIcon />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </>
      )}

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-700"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
