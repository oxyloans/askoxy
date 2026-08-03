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
      <div className="hidden sm:grid grid-cols-[8rem_12rem_minmax(0,1fr)] gap-4 py-3 text-xs uppercase tracking-widest text-ink font-semibold border-b border-ink/10">
        <span className="text-left">Date</span>
        <span className="text-left">Category</span>
        <span className="text-left">Title</span>
      </div>
      <ul className="divide-y divide-ink/10">
        {articles.map((article) => (
          <li key={article.id}>
            <Link
              to={`/news/${sourceName.toLowerCase()}/${article.id}`}
              className="focus-ring group flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-4"
            >
              <time className="shrink-0 w-28 text-xs font-mono text-ink-dark font-semibold">
                {formatDate(article.publishedDate)}
              </time>
              {article.category && (
                <span className="shrink-0 sm:w-40 text-xs font-mono uppercase tracking-wide text-plum font-semibold">
                  {article.category}
                </span>
              )}
              <span className="font-body text-ink text-sm sm:text-base font-semibold group-hover:text-royal transition-colors">
                {article.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="focus-ring inline-flex items-center justify-center px-6 py-3 rounded-full bg-plum text-white text-sm font-semibold hover:bg-royal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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