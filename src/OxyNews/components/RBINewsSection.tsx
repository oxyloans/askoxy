import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import type { NewsFeedItem } from "../types";

function isPdfName(name: string | null | undefined): boolean {
  return !!name && /\.pdf$/i.test(name.trim());
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function RBINewsSection() {
  const [items, setItems] = useState<NewsFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .getFeed({ domain: "RBI", sort: "latest", page: 0, size: 20 })
      .then((res) => {
        setItems(res.content.filter((item) => isPdfName(item.fileName)).slice(0, 6));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-6">
      <div className="h-7 w-7 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
    </div>
  );

  if (items.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-semibold text-plum text-lg uppercase tracking-wide">
          RBI Press Releases
        </h2>
        <Link to="/rbi-news" className="text-xs font-semibold text-royal hover:underline">
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item, i) => (
          <motion.div
            key={item.paperclipId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/article/${item.paperclipId}`)}
            className="group flex flex-col rounded-xl border border-slate-200 bg-white shadow-card hover:shadow-lift hover:border-blue-300 transition-all overflow-hidden cursor-pointer"
          >
            <div className="relative h-32 overflow-hidden">
              <img
                src="https://i.ibb.co/xKnPH4Sr/Chat-GPT-Image-Sep-3-2026-11-30-25-AM.png"
                alt="RBI"
                className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <span className="absolute bottom-2 right-2 text-[10px] font-medium text-white/80">
                {formatDate(item.createdAt)}
              </span>
            </div>
            <div className="flex flex-col flex-1 p-3 gap-2">
              <p className="text-sm font-semibold leading-snug text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-3 flex-1">
                {item.articleName || item.fileName || "Untitled"}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                  RBI
                </span>
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
