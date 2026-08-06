import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { NewsFeedItem } from "../types";
import OpportunityMeter from "./OpportunityMeter";

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

// Older/unbackfilled articles have no articleName yet. Rather than a bare
// "Untitled" placeholder, fall back to the classification the AI already
// produced (domain + category) so the card still says something real.
export function hasDisplayTitle(item: NewsFeedItem): boolean {
  if (item.articleName && item.articleName.trim()) return true;
  return [item.domain, item.category].some(
    (v) => v && v.trim() && v !== "General"
  );
}

export function hasPagerImage(item: NewsFeedItem): boolean {
  if (!item.imageUrl) return false;
  const normalized = item.imageUrl.toLowerCase();
  return normalized.includes("/paperclips/") && normalized.includes("whatsapp image");
}

export function hasGeneratedImage(item: NewsFeedItem): boolean {
  if (!item.imageUrl) return false;
  const normalized = item.imageUrl.toLowerCase();
  return normalized.includes("/images/") && !normalized.includes("/paperclips/") && !normalized.includes("whatsapp image");
}

export function isDisplayableArticle(item: NewsFeedItem): boolean {
  return hasDisplayTitle(item) && hasGeneratedImage(item);
}

function displayTitle(item: NewsFeedItem): string {
  if (item.articleName && item.articleName.trim()) return item.articleName;
  const parts = [item.domain, item.category].filter(
    (v) => v && v.trim() && v !== "General"
  );
  return parts.length > 0 ? parts.join(" — ") : "Untitled";
}

export default function ArticleCard({
  item,
  featured = false,
}: {
  item: NewsFeedItem;
  featured?: boolean;
}) {
  return (
    <motion.div
      layout
      layoutId={item.paperclipId}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Link
        to={`/article/${item.paperclipId}`}
        className="group block h-full bg-white rounded-lg shadow-card hover:shadow-lift transition-shadow duration-300 overflow-hidden focus-ring"
      >
        <div
          className={`relative bg-plum-light overflow-hidden ${
            featured ? "aspect-[16/7]" : "aspect-[16/9]"
          }`}
        >
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-display text-gold/40 text-4xl">
              Oxy
            </div>
          )}
          {item.domain && item.domain !== "General" && (
            <span className="absolute top-2 left-2 bg-plum/90 text-gold text-[10px] font-mono uppercase tracking-wide px-1.5 py-0.5 rounded">
              {item.domain}
            </span>
          )}
        </div>

        <div className="p-2">
          <h3
            className={`font-display font-semibold text-plum leading-snug group-hover:text-royal transition-colors ${
              featured ? "text-base sm:text-lg" : "text-xs sm:text-sm"
            }`}
          >
            {displayTitle(item)}
          </h3>
          {featured && item.shortSummary && (
            <p className="mt-1 text-xs text-ink-soft leading-relaxed line-clamp-2">
              {item.shortSummary}
            </p>
          )}
          <div className="mt-1.5 flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5">
              <OpportunityMeter score={item.overallScore} size={20} strokeWidth={3} />
              <span className="text-[10px] font-semibold text-plum hidden sm:inline">Opportunities</span>
            </div>
            <span className="text-[10px] text-ink-faint font-mono">{timeAgo(item.createdAt)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}