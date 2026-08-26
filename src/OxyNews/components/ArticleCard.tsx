import { useState } from "react";
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

function getCategoryShortForm(category: string | null): string {
  if (!category) return "OX";
  const words = category.trim().split(/\s+/);
  const l1 = (words[0]?.[0] ?? "O").toUpperCase();
  const l2 = (words[1]?.[0] ?? words[0]?.[1] ?? "X").toUpperCase();
  return l1 + l2;
}

function getCategoryBadgeStyle(category: string | null): { bg: string } {
  const [c1] = getTwoColors(category);
  return { bg: c1 };
}

function CategoryOverlay({ category }: { category: string | null }) {
  const [l1, l2] = getTwoLetters(category);
  const [c1, c2] = getTwoColors(category);
  return (
    <div className="flex items-center justify-center gap-1 select-none">
      <span
        className="text-6xl font-black leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
        style={{ color: c1 }}
      >
        {l1}
      </span>
      <span
        className="text-6xl font-black leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
        style={{ color: c2 }}
      >
        {l2}
      </span>
    </div>
  );
}

function getCardGradient(category: string | null): string {
  const [c1, c2] = getTwoColors(category);
  return `linear-gradient(135deg, ${c1}20 0%, ${c2}35 100%)`;
}

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

// Two colors only — one per word (max 2 words used)
function getTwoColors(category: string | null): [string, string] {
  const words = (category || "News").trim().split(/\s+/);
  const c1 = LETTER_COLORS[0 % LETTER_COLORS.length];
  const c2 = LETTER_COLORS[1 % LETTER_COLORS.length];
  // Pick colors based on first char codes so same category always same colors
  const seed1 = (words[0]?.charCodeAt(0) ?? 0) % LETTER_COLORS.length;
  const seed2 = (words[1]?.charCodeAt(0) ?? 3) % LETTER_COLORS.length;
  return [LETTER_COLORS[seed1], LETTER_COLORS[seed2 === seed1 ? (seed2 + 1) % LETTER_COLORS.length : seed2]];
}

// Exactly 2 letters: first letter of word1 + first letter of word2
function getTwoLetters(category: string | null): [string, string] {
  const words = (category || "OX").trim().split(/\s+/);
  const l1 = (words[0]?.[0] ?? "O").toUpperCase();
  const l2 = (words[1]?.[0] ?? words[0]?.[1] ?? "X").toUpperCase();
  return [l1, l2];
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
  const showOverlay = !item.imageUrl || imgError;

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
          style={{ background: getCardGradient(item.category), overflow: "hidden" }}
        >
          <img
            src={showOverlay ? FALLBACK_IMG : item.imageUrl!}
            alt={displayTitle(item)}
            className={`h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ${showOverlay ? "opacity-20" : ""}`}
            style={{ maxHeight: featured ? 220 : 180, minHeight: featured ? 140 : 110, display: "block" }}
            onError={() => setImgError(true)}
          />
          {showOverlay && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <CategoryOverlay category={item.category} />
            </div>
          )}
          {item.category && (
            <span
              className="absolute left-2 top-2 block max-w-[72%] truncate rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider shadow"
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