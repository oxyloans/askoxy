import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { NewsFeedItem } from "../types";
import OpportunityMeter from "../components/OpportunityMeter";

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
  return hasDisplayTitle(item);
}

export function getCategoryColor(category: string | null): string {
  const colors: Record<string, string> = {
    finance: "bg-emerald-500",
    technology: "bg-blue-500",
    business: "bg-violet-600",
    health: "bg-rose-500",
    sports: "bg-orange-500",
    entertainment: "bg-fuchsia-500",
    science: "bg-sky-500",
    education: "bg-indigo-500",
    politics: "bg-yellow-500",
    environment: "bg-teal-500",
    default: "bg-purple-600",
  };
  const key = (category || "").toLowerCase();
  return colors[key] || colors.default;
}

export function getTextColor(category: string | null): string {
  const colors: Record<string, string> = {
    finance: "text-emerald-500",
    technology: "text-blue-500",
    business: "text-violet-600",
    health: "text-rose-500",
    sports: "text-orange-500",
    entertainment: "text-fuchsia-500",
    science: "text-sky-500",
    education: "text-indigo-500",
    politics: "text-yellow-500",
    environment: "text-teal-500",
    default: "text-purple-600",
  };
  const key = (category || "").toLowerCase();
  return colors[key] || colors.default;
}

export { getCategoryShortForm };

function displayTitle(item: NewsFeedItem): string {
  if (item.articleName && item.articleName.trim()) return item.articleName;
  const parts = [item.domain, item.category].filter(
    (v) => v && v.trim() && v !== "General"
  );
  return parts.length > 0 ? parts.join(" — ") : "Untitled";
}

const FALLBACK_IMG = "https://i.ibb.co/BH6wt6nQ/oxynews1.png";

const LETTER_COLORS = [
  "#7c3aed", "#2563eb", "#059669", "#ea580c", "#6d28d9",
  "#0284c7", "#c026d3", "#b45309", "#0d9488", "#8b5cf6",
  "#db2777", "#4338ca", "#65a30d", "#0891b2", "#f59e0b",
];

// Returns one colour per word in the category (cycles through LETTER_COLORS)
function getWordColors(category: string | null): string[] {
  const words = (category || "XX").trim().split(/\s+/);
  return words.map((_, i) => LETTER_COLORS[i % LETTER_COLORS.length]);
}

// e.g. "Artificial Content Platform" → "#ACP"
function getCategoryShortForm(category: string | null): string {
  if (!category) return "XX";
  return category.trim().split(/\s+/).map(w => w[0].toUpperCase()).join("");
}

// Badge bg = first word colour; kept for the pill badge
function getCategoryBadgeStyle(category: string | null): { bg: string; text: string } {
  const bg = getWordColors(category)[0];
  return { bg, text: "#ffffff" };
}

// Renders "#" + each letter in its own colour span
function CategoryOverlay({ category }: { category: string | null }) {
  const short = getCategoryShortForm(category);
  const letters = short.split("");
  const colors = getWordColors(category);
  return (
    <span className="text-5xl font-black drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] tracking-tight select-none">
      <span style={{ color: "#1e293b" }}>#</span>
      {letters.map((l, i) => (
        <span key={i} style={{ color: colors[i % colors.length] }}>{l}</span>
      ))}
    </span>
  );
}

// Card image area gradient per category
function getCardGradient(category: string | null): string {
  const colors = getWordColors(category);
  if (colors.length === 1) return `linear-gradient(135deg, ${colors[0]}22 0%, ${colors[0]}55 100%)`;
  return `linear-gradient(135deg, ${colors[0]}33 0%, ${colors[1 % colors.length]}44 60%, ${colors[2 % colors.length] ?? colors[0]}22 100%)`;
}

export default function ArticleCard({
  item,
  featured = false,
  small = false,
}: {
  item: NewsFeedItem;
  featured?: boolean;
  small?: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const isPaperImage = hasPagerImage(item);
  const useRealImage = !!item.imageUrl && !isPaperImage && !imgError;
  const showOverlay = !useRealImage;
  const imgSrc = useRealImage ? item.imageUrl! : FALLBACK_IMG;

  return (
    <motion.div
      key={item.paperclipId}
      initial={{ opacity: 0, x: 40, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ willChange: "transform, opacity" }}
      whileHover={{ boxShadow: "0 8px 32px rgba(124,58,237,0.18), 0 2px 8px rgba(0,0,0,0.10)" }}
      className="h-full rounded-xl"
    >
      <Link
        to={`/article/${item.paperclipId}`}
        className="group flex flex-col bg-white rounded-xl shadow-card focus-ring h-full"
        style={{ overflow: "visible" }}
      >
        <div
          className="relative rounded-t-xl"
          style={{ background: getCardGradient(item.category), overflow: "hidden", minHeight: featured ? 140 : 110 }}
        >
          <img
            src={imgSrc}
            alt={displayTitle(item)}
            className={`w-full object-contain group-hover:scale-105 transition-transform duration-500 ${showOverlay ? "opacity-20" : ""}`}
            style={{ maxHeight: featured ? 220 : 180, minHeight: featured ? 140 : 110, width: "100%", display: "block" }}
            onError={() => setImgError(true)}
          />
          {showOverlay && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <CategoryOverlay category={item.category} />
            </div>
          )}
          {item.category && (
            <span
              className="absolute top-2 left-2 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow"
              style={{ backgroundColor: getCategoryBadgeStyle(item.category).bg, color: "#fff" }}
            >
              {item.category}
            </span>
          )}
        </div>

        <div className="flex flex-col flex-1 p-3 rounded-b-xl bg-white">
          <h3 className="font-display font-semibold text-plum leading-snug group-hover:text-royal transition-colors text-sm line-clamp-2">
            {displayTitle(item)}
          </h3>
          {item.shortSummary && (
            <p className="mt-1.5 text-[11px] leading-relaxed line-clamp-2 text-ink-soft flex-1">
              {item.shortSummary}
            </p>
          )}
          <div className="mt-2 flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5">
              <OpportunityMeter score={item.overallScore} size={22} strokeWidth={3} />
              <span className="text-[10px] font-semibold text-plum hidden sm:inline">Opportunities</span>
            </div>
            <span className="text-[10px] text-ink-faint font-mono">{timeAgo(item.createdAt)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}