import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import type { ExternalNewsArticle } from "../types";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const ANTHROPIC_IMG = "https://i.ibb.co/qFrMxbgw/Chat-GPT-Image-Sep-28-2026-05-24-08-PM.png";

export default function ExternalNewsList({ sourceName }: { sourceName: string }) {
  const PAGE_SIZE = 15;
  const [articles, setArticles] = useState<ExternalNewsArticle[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "empty">("loading");
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState<number | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadPage = async (pageIndex: number) => {
      setStatus("loading");
      try {
        const pageResponse = await api.getExternalNews(sourceName, pageIndex, PAGE_SIZE);
        if (cancelled) return;
        setArticles(pageResponse.content);
        setTotal(pageResponse.totalElements);
        setHasMore(!pageResponse.last);
        setPage(pageIndex);
        setStatus(pageResponse.content.length ? "ready" : "empty");
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    loadPage(0);
    return () => {
      cancelled = true;
    };
  }, [sourceName]);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const refreshNews = async () => {
    setRefreshing(true);
    try {
      await api.refreshExternalNews(sourceName);
      const pageResponse = await api.getExternalNews(sourceName, 0, PAGE_SIZE);
      setArticles(pageResponse.content);
      setTotal(pageResponse.totalElements);
      setHasMore(!pageResponse.last);
      setPage(0);
      setStatus(pageResponse.content.length ? "ready" : "empty");
    } catch {
      setStatus("error");
    } finally {
      setRefreshing(false);
    }
  };

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const pageResponse = await api.getExternalNews(sourceName, nextPage, PAGE_SIZE);
      setArticles((prev) => [...prev, ...pageResponse.content]);
      setHasMore(!pageResponse.last);
      setPage(nextPage);
    } catch {
      setStatus("error");
    } finally {
      setLoadingMore(false);
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (status === "loading") {
    return <div className="mt-10 text-sm font-mono text-ink-faint">Loading news…</div>;
  }

  if (status === "error") {
    return <div className="mt-10 text-sm font-mono text-ink-faint">Couldn't load news right now.</div>;
  }

  if (status === "empty") {
    return <div className="mt-10 text-sm font-mono text-ink-faint">No news yet — check back soon.</div>;
  }

  return (
    <div className="mt-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-ink/10">
        <div>
          <h2 className="text-xs font-mono uppercase tracking-widest text-ink-faint">
            Latest news
          </h2>
          <p className="text-xs text-ink mt-2">
            Showing {articles.length} {articles.length === 1 ? "article" : "articles"} from {sourceName}.
          </p>
        </div>

        <button
          type="button"
          onClick={refreshNews}
          disabled={refreshing}
          className="focus-ring inline-flex items-center justify-center h-10 rounded-full bg-royal text-white text-xs font-semibold px-4 hover:bg-plum transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {refreshing ? "Refreshing…" : "Refresh news"}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
        {articles.map((article, i) => {
          const palette = [
            { border: "hover:border-blue-300",   bg: "bg-blue-50",   letter: "text-blue-200",   hover: "group-hover:text-blue-700",   badge: "bg-blue-100 text-blue-700",   icon: "group-hover:text-blue-500" },
            { border: "hover:border-emerald-300", bg: "bg-emerald-50", letter: "text-emerald-200", hover: "group-hover:text-emerald-700", badge: "bg-emerald-100 text-emerald-700", icon: "group-hover:text-emerald-500" },
            { border: "hover:border-violet-300",  bg: "bg-violet-50",  letter: "text-violet-200",  hover: "group-hover:text-violet-700",  badge: "bg-violet-100 text-violet-700",  icon: "group-hover:text-violet-500" },
            { border: "hover:border-rose-300",    bg: "bg-rose-50",    letter: "text-rose-200",    hover: "group-hover:text-rose-700",    badge: "bg-rose-100 text-rose-700",    icon: "group-hover:text-rose-500" },
            { border: "hover:border-amber-300",   bg: "bg-amber-50",   letter: "text-amber-200",   hover: "group-hover:text-amber-700",   badge: "bg-amber-100 text-amber-700",   icon: "group-hover:text-amber-500" },
            { border: "hover:border-teal-300",    bg: "bg-teal-50",    letter: "text-teal-200",    hover: "group-hover:text-teal-700",    badge: "bg-teal-100 text-teal-700",    icon: "group-hover:text-teal-500" },
          ];
          const c = palette[i % palette.length];
          return (
            <Link
              key={article.id}
              to={`/news/${sourceName.toLowerCase()}/${article.id}`}
              className={`group flex flex-col rounded-xl border border-slate-200 bg-white shadow-card hover:shadow-lift ${c.border} transition-all overflow-hidden focus-ring`}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={article.imageUrl || ANTHROPIC_IMG}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = ANTHROPIC_IMG; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className={`absolute top-2 left-2 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow ${c.badge}`}>
                  {article.category || sourceName}
                </span>
                <span className="absolute bottom-2 right-2 text-[10px] font-medium text-white/80">
                  {formatDate(article.publishedDate)}
                </span>
              </div>
              <div className="flex flex-col flex-1 p-3 gap-2">
                <p className={`text-sm font-semibold leading-snug text-slate-800 ${c.hover} transition-colors line-clamp-3 flex-1`}>
                  {article.title}
                </p>
                {article.content && (
                  <p className="text-[11px] leading-relaxed text-slate-500 line-clamp-2">
                    {article.content.replace(/#+\s*/g, "").slice(0, 120)}
                  </p>
                )}
                <div className="flex items-center justify-end pt-2 border-t border-slate-100">
                  <svg
                    viewBox="0 0 24 24"
                    className={`w-3.5 h-3.5 text-slate-300 ${c.icon} transition-colors`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {hasMore && (
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
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 focus-ring inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold text-plum shadow-lg hover:scale-105 transition-transform"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
    </div>
  );
}