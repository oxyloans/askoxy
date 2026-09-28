import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { IrdaiPressRelease } from "../types";
import { api } from "../lib/api";

const IRDAI_IMG = "https://i.ibb.co/Y4nNP4hS/Chat-GPT-Image-Sep-25-2026-11-20-45-AM.png";

function formatDate(dateArr: number[] | null | undefined): string {
  if (!dateArr || dateArr.length < 3) return "";
  const [year, month, day] = dateArr;
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function SmartImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative h-full w-full bg-slate-100 overflow-hidden">
      {!loaded && !error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-orange-50 via-amber-100/60 to-orange-50 animate-pulse">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-orange-300 border-t-orange-600" />
        </div>
      )}
      {error ? (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-orange-500 via-amber-600 to-orange-600 p-3 text-center text-white">
          <span className="text-[11px] font-bold tracking-wider uppercase">IRDAI Release</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`${className || ""} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}

export default function IRDAINewsSection() {
  const [items, setItems] = useState<IrdaiPressRelease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getIrdaiPressReleases()
      .then((res) => setItems((res.notifications ?? []).slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-6">
        <div className="h-7 w-7 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />
      </div>
    );

  if (items.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-semibold text-plum text-lg uppercase tracking-wide">
          IRDAI Press Releases
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item, i) => (
          <motion.a
            key={item.id}
            href={item.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group flex flex-col rounded-xl border border-slate-200 bg-white shadow-card hover:shadow-lift hover:border-orange-300 transition-all overflow-hidden cursor-pointer"
          >
            <div className="relative h-32 overflow-hidden">
              <SmartImage
                src={IRDAI_IMG}
                alt="IRDAI"
                className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
              <span className="absolute bottom-2 right-2 text-[10px] font-medium text-white/90 z-10">
                {formatDate(item.date)}
              </span>
            </div>
            <div className="flex flex-col flex-1 p-3 gap-2">
              <p className="text-sm font-semibold leading-snug text-slate-800 group-hover:text-orange-700 transition-colors line-clamp-3 flex-1">
                {item.name || "Untitled"}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-700">
                  IRDAI
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5 text-slate-300 group-hover:text-orange-500 transition-colors"
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
          </motion.a>
        ))}
      </div>
    </div>
  );
}
