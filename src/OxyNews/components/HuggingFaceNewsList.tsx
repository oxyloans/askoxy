import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, HFArticle } from "../lib/api";

const HF_FALLBACK = "https://huggingface.co/front/assets/huggingface_logo-noborder.svg";

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function sortArticlesByLatest(items: HFArticle[]): HFArticle[] {
  return [...items].sort((a, b) => {
    const timeA = a.publishedAt && !isNaN(Date.parse(a.publishedAt))
      ? Date.parse(a.publishedAt)
      : a.updatedAt && !isNaN(Date.parse(a.updatedAt))
      ? Date.parse(a.updatedAt)
      : 0;
    const timeB = b.publishedAt && !isNaN(Date.parse(b.publishedAt))
      ? Date.parse(b.publishedAt)
      : b.updatedAt && !isNaN(Date.parse(b.updatedAt))
      ? Date.parse(b.updatedAt)
      : 0;
    if (timeA && timeB) return timeB - timeA;
    if (timeB && !timeA) return 1;
    if (timeA && !timeB) return -1;
    return 0;
  });
}

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden animate-pulse shadow-sm">
      <div className="h-40 bg-slate-200/80" />
      <div className="p-3 flex flex-col gap-2.5">
        <div className="h-4 bg-slate-200 rounded w-11/12" />
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2 mt-1" />
      </div>
    </div>
  );
}

const PALETTE = [
  { border: "hover:border-yellow-300", badge: "bg-yellow-100 text-yellow-700", hover: "group-hover:text-yellow-700", icon: "group-hover:text-yellow-500" },
  { border: "hover:border-blue-300",   badge: "bg-blue-100 text-blue-700",     hover: "group-hover:text-blue-700",   icon: "group-hover:text-blue-500" },
  { border: "hover:border-violet-300", badge: "bg-violet-100 text-violet-700", hover: "group-hover:text-violet-700", icon: "group-hover:text-violet-500" },
  { border: "hover:border-emerald-300",badge: "bg-emerald-100 text-emerald-700",hover:"group-hover:text-emerald-700",icon:"group-hover:text-emerald-500"},
  { border: "hover:border-rose-300",   badge: "bg-rose-100 text-rose-700",     hover: "group-hover:text-rose-700",   icon: "group-hover:text-rose-500" },
  { border: "hover:border-amber-300",  badge: "bg-amber-100 text-amber-700",   hover: "group-hover:text-amber-700",  icon: "group-hover:text-amber-500" },
];

export default function HuggingFaceNewsList() {
  const [articles, setArticles] = useState<HFArticle[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [limit, setLimit] = useState(20);
  const [moreAvailable, setMoreAvailable] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    api.getHuggingFaceList(20)
      .then(res => {
        if (cancelled) return;
        setArticles(sortArticlesByLatest(res.articles));
        setMoreAvailable(res.moreAvailable);
        setLimit(20);
        setStatus("ready");
      })
      .catch((err) => {
        if (!cancelled) {
          setErrorMsg(err?.message || "Unknown error");
          setStatus("error");
        }
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const refreshNews = async () => {
    setRefreshing(true);
    try {
      try {
        await api.refreshExternalNews("huggingface");
      } catch {
        // Refresh trigger is best-effort
      }
      const res = await api.getHuggingFaceList(limit);
      setArticles(sortArticlesByLatest(res.articles));
      setMoreAvailable(res.moreAvailable);
      setStatus("ready");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to refresh");
    } finally {
      setRefreshing(false);
    }
  };

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const next = limit + 20;
      const res = await api.getHuggingFaceList(next);
      setArticles(sortArticlesByLatest(res.articles));
      setMoreAvailable(res.moreAvailable);
      setLimit(next);
    } catch {
      // silently fail — keep existing articles
    } finally {
      setLoadingMore(false);
    }
  };

  const q = search.trim().toLowerCase();
  const filtered = q
    ? articles.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
      )
    : articles;

  if (status === "loading") {
    return (
      <div className="mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1,2,3,4,5,6].map(k => <SkeletonCard key={k} />)}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mt-10 p-6 rounded-xl border border-red-100 bg-red-50/50 text-center">
        <p className="text-sm font-semibold text-slate-800 mb-1">Couldn't load Hugging Face news right now.</p>
        {errorMsg && <p className="text-xs text-red-500 mb-4">{errorMsg}</p>}
        <button
          type="button"
          onClick={refreshNews}
          disabled={refreshing}
          className="focus-ring inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-plum text-white text-xs font-semibold hover:bg-royal transition-colors shadow-sm"
        >
          <svg className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
          </svg>
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-10">
      {/* Header + search + refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-ink/10 mb-4">
        <div>
          <h2 className="text-xs font-mono uppercase tracking-widest text-ink-faint">Latest from Hugging Face</h2>
          <p className="text-xs text-ink mt-1">Showing {filtered.length} article{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles…"
              className="pl-8 pr-3 py-2 text-xs rounded-full border border-slate-200 bg-white outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition w-52"
            />
          </div>

          <button
            type="button"
            onClick={refreshNews}
            disabled={refreshing}
            className="focus-ring inline-flex items-center justify-center gap-1.5 h-9 rounded-full bg-plum text-white text-xs font-semibold px-4 hover:bg-royal transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shrink-0"
            title="Refresh latest news"
          >
            <svg
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
            </svg>
            <span>{refreshing ? "Refreshing…" : "Refresh"}</span>
          </button>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-sm text-ink-faint text-center py-12">No articles match "{search}"</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((article, i) => {
          const c = PALETTE[i % PALETTE.length];
          return (
            <button
              key={article.url}
              type="button"
              onClick={() => navigate(`/huggingface/article?url=${encodeURIComponent(article.url)}`)}
              className={`group flex flex-col rounded-xl border border-slate-200 bg-white shadow-card ${c.border} hover:shadow-lift transition-all overflow-hidden text-left focus-ring`}
            >
              {/* Cover image */}
              <div className="relative h-40 overflow-hidden bg-slate-100">
                <img
                  src={article.image || HF_FALLBACK}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={e => { (e.currentTarget as HTMLImageElement).src = HF_FALLBACK; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className={`absolute top-2 left-2 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow ${c.badge}`}>
                  {article.author || "Hugging Face"}
                </span>
                {article.publishedAt && (
                  <span className="absolute bottom-2 right-2 text-[10px] font-medium text-white/80">
                    {formatDate(article.publishedAt)}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 p-3 gap-2">
                <p className={`text-sm font-semibold leading-snug text-slate-800 ${c.hover} transition-colors line-clamp-3 flex-1`}>
                  {article.title}
                </p>
                {article.description && (
                  <p className="text-[11px] leading-relaxed text-slate-500 line-clamp-2">
                    {article.description}
                  </p>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  {article.readingTimeMin > 0 && (
                    <span className="text-[10px] text-slate-400">{article.readingTimeMin} min read</span>
                  )}
                  <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 text-slate-300 ${c.icon} transition-colors ml-auto`} fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {moreAvailable && !search && (
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="focus-ring w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full bg-plum text-white text-sm font-semibold hover:bg-royal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? "Loading more…" : "Load more articles"}
          </button>
        </div>
      )}

      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 focus-ring inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold text-plum shadow-lg hover:scale-105 transition-transform"
          aria-label="Back to top"
        >↑</button>
      )}
    </div>
  );
}
