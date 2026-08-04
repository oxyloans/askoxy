import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import type { NewsFeedItem } from "../types";
import ArticleCard, { isDisplayableArticle } from "../components/ArticleCard";

export default function RadhaiNewsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<NewsFeedItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .getFeed({ sort: "latest", page: 0, size: 24 })
      .then((res) => {
        setItems(res.content);
        setHasMore(!res.last);
      })
      .catch(() => setError("Couldn't reach the feed."))
      .finally(() => setLoading(false));
  }, []);

  function loadMore() {
    const next = page + 1;
    api.getFeed({ sort: "latest", page: next, size: 24 }).then((res) => {
      setItems((prev) => [...prev, ...res.content]);
      setHasMore(!res.last);
      setPage(next);
    }).catch(() => {});
  }

  const visible = items.filter(isDisplayableArticle);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={() => navigate("/oxynews")}
          className="inline-flex items-center gap-1.5 rounded-full border border-plum/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-plum shadow-sm hover:bg-plum hover:text-paper transition-colors focus-ring"
        >
          ← Back
        </button>
        <h2 className="font-display text-2xl font-semibold text-plum-dark">RadhAI News</h2>
      </div>

      {loading && <div className="text-sm font-mono text-ink-faint">Loading articles…</div>}
      {error && <div className="text-sm font-mono text-ink-faint">{error}</div>}

      {!loading && visible.length === 0 && (
        <div className="bg-white border border-ink/10 rounded-lg p-12 text-center">
          <p className="font-display text-xl text-plum">No displayable articles yet</p>
        </div>
      )}

      {!loading && visible.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {visible.map((it) => (
                <motion.div key={it.paperclipId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <ArticleCard item={it} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button onClick={loadMore} className="focus-ring px-6 py-3 rounded-full bg-royal text-white font-semibold">Load more</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
