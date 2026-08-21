import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { ExternalNewsArticle } from "../types";
import { api } from "../lib/api";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ExternalNewsTicker({ sourceName }: { sourceName: string }) {
  const [items, setItems] = useState<ExternalNewsArticle[]>([]);

  useEffect(() => {
    let cancelled = false;
    api
      .getExternalNews(sourceName, 0, 5)
      .then((res) => {
        if (!cancelled) setItems(res.content);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, [sourceName]);

  if (items.length === 0) return null;

  const strip = [...items, ...items];

  return (
    <div className="mt-4 overflow-hidden rounded-3xl border border-ink/10 bg-royal/5 px-4 py-2 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="shrink-0 rounded-full bg-plum-dark px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-paper">
          AI news
        </span>
        <span className="text-xs uppercase tracking-widest text-ink-faint">Latest {items.length} from {sourceName}</span>
      </div>
      <div className="mt-3 overflow-hidden">
        <div className="flex w-max animate-ticker items-center gap-6 py-2">
          {strip.map((article, index) => (
            <Link
              key={`${article.id}-${index}`}
              to={`/news/${sourceName.toLowerCase()}/${article.id}`}
              className="shrink-0 flex items-center gap-2 whitespace-nowrap rounded-full border border-ink/10 bg-white/90 px-3 py-2 text-sm text-ink shadow-sm transition hover:border-plum hover:text-plum"
            >
              {article.imageUrl && (
                <img
                  src={article.imageUrl}
                  alt=""
                  className="w-6 h-6 rounded-full object-cover shrink-0"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <span className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                {formatDate(article.publishedDate)}
              </span>
              <span className="font-semibold">{article.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}