import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import type { NewsFeedItem } from "../types";
import { isDisplayableArticle } from "./ArticleCard";

function displayTitle(item: NewsFeedItem): string {
  if (item.articleName && item.articleName.trim()) return item.articleName;
  const parts = [item.domain, item.category].filter(
    (v) => v && v.trim() && v !== "General"
  );
  return parts.length > 0 ? parts.join(" — ") : "Untitled";
}

export default function NewsTicker({ className }: { className?: string }) {
  const [items, setItems] = useState<NewsFeedItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .getFeed({ sort: "latest", page: 0, size: 12 })
      .then((res) => setItems(res.content.filter(isDisplayableArticle)))
      .catch(() => setItems([]));
  }, []);

  if (items.length === 0) return null;

  // Render the strip twice back to back so the marquee loop is seamless
  // (translateX(-50%) lands exactly on the duplicate's start).
  const strip = [...items, ...items];

  return (
    <div className={className ? className + " bg-royal/95 border-b border-gold/20 overflow-hidden" : "bg-royal/95 border-b border-gold/20 overflow-hidden"}>
      <div className="flex items-stretch">
        <span className="shrink-0 flex items-center gap-1.5 bg-gold text-plum text-xs font-mono font-bold uppercase tracking-wide px-3 py-1.5 z-10">
          <span className="text-base leading-none">🤖</span>
          RadhAI News
        </span>
        <div className="flex-1 overflow-hidden">
          <div className="flex w-max animate-ticker py-1.5">
            {strip.map((item, i) => (
              <button
                key={`${item.paperclipId}-${i}`}
                onClick={() => navigate(`/article/${item.paperclipId}`)}
                className="focus-ring shrink-0 flex items-center gap-3 px-5 text-sm text-paper hover:text-gold transition-colors whitespace-nowrap"
              >
                {item.domain && (
                  <span className="text-[11px] font-mono uppercase text-gold font-bold tracking-wide">
                    {item.domain}
                  </span>
                )}
                <span className="font-semibold text-paper">
                  {displayTitle(item)}
                </span>
                <span className="text-gold/70">•</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}