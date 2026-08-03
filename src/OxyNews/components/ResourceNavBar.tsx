// src/components/ResourceNavBar.tsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RESOURCE_CATEGORIES } from "../data/resourceLinks";

const EXTRA_CATEGORIES: typeof RESOURCE_CATEGORIES = [
  { id: "jobs", label: "Jobs", links: [] },
  { id: "investments", label: "Investments", links: [] },
];

const ALL_CATEGORIES = [...RESOURCE_CATEGORIES, ...EXTRA_CATEGORIES];

export default function ResourceNavBar() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [anchorCenter, setAnchorCenter] = useState<number | null>(null);
  const [panelLeft, setPanelLeft] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close the dropdown whenever the route changes (e.g. after picking a link).
  useEffect(() => setOpenId(null), [location.pathname]);

  // Close on Escape from anywhere.
  useEffect(() => {
    if (!openId) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenId(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openId]);

  const activeCategory = ALL_CATEGORIES.find((c) => c.id === openId);

  // Position the panel under whichever button opened it, clamped so it never
  // runs off the left/right edge of the viewport. Runs after the panel is
  // rendered so we can measure its real (content-driven) width.
  useLayoutEffect(() => {
    if (!activeCategory || anchorCenter === null || !panelRef.current) {
      setPanelLeft(null);
      return;
    }
    const width = panelRef.current.offsetWidth;
    const margin = 12;
    const left = Math.max(
      margin,
      Math.min(anchorCenter - width / 2, window.innerWidth - width - margin)
    );
    setPanelLeft(left);
  }, [activeCategory, anchorCenter]);

  function openFrom(catId: string, el: HTMLElement) {
    setOpenId(catId);
    const rect = el.getBoundingClientRect();
    setAnchorCenter(rect.left + rect.width / 2);
  }

  const linkCount = activeCategory?.links.length ?? 0;
  const gridCols =
    linkCount > 8 ? "sm:grid-cols-3" : linkCount > 4 ? "sm:grid-cols-2" : "grid-cols-1";

  return (
    <div
      ref={rootRef}
      className="relative bg-plum-dark/95 backdrop-blur-md border-b border-gold/20 shadow-md"
      // Only the OUTER wrapper closes on leave — it contains both the button
      // row and the dropdown panel, so moving from one to the other never
      // triggers this (the panel is a sibling of the row below, not nested
      // inside it, so a onMouseLeave on the row alone fired too early).
      onMouseLeave={() => setOpenId(null)}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            to="/oxynews"
            className="focus-ring flex min-h-10 shrink-0 items-center rounded-full bg-white/10 px-4 text-sm font-semibold tracking-wide text-paper/90 transition-colors hover:bg-white/20"
          >
            Home
          </Link>

          {ALL_CATEGORIES.map((cat) => {
            const isOpen = openId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={(e) => (isOpen ? setOpenId(null) : openFrom(cat.id, e.currentTarget))}
                onMouseEnter={(e) => openFrom(cat.id, e.currentTarget)}
                onFocus={(e) => openFrom(cat.id, e.currentTarget)}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                className={`focus-ring flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 py-2 transition-colors ${
                  isOpen
                    ? "bg-gold text-plum-dark"
                    : "bg-white/10 text-paper/90 hover:bg-white/20"
                }`}
              >
                <span className="font-semibold text-sm tracking-wide">{cat.label}</span>
                <span className={`text-[10px] transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
              </button>
            );
          })}
          <Link
            to="/radhai-news"
            className="focus-ring flex min-h-10 shrink-0 items-center rounded-full bg-white/10 px-4 text-sm font-semibold tracking-wide text-paper/90 transition-colors hover:bg-white/20"
          >
            RadhAI News
          </Link>
        </div>
      </div>

      {activeCategory && (
        <div
          ref={panelRef}
          role="menu"
          className="absolute top-full z-40 w-max max-w-[calc(100vw-24px)] rounded-xl border border-gold/25 bg-white shadow-lift"
          style={{
            left: panelLeft ?? anchorCenter ?? 0,
            visibility: panelLeft === null ? "hidden" : "visible",
          }}
        >
          <div className="p-3">
            {activeCategory.links.length > 0 ? (
              <div className={`grid grid-cols-1 ${gridCols} gap-1`}>
                {activeCategory.links.map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    role="menuitem"
                    onClick={() => navigate(`/resources/${activeCategory.id}/${link.id}`)}
                    className="focus-ring w-64 max-w-full rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-royal/5"
                  >
                    <div className="text-sm font-medium text-royal">{link.name}</div>
                    {link.description && (
                      <div className="text-xs text-ink-faint mt-0.5">{link.description}</div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-faint px-3 py-2 w-64">
                No links added yet for {activeCategory.label} — add them to{" "}
                <code className="font-mono text-xs bg-ink/5 px-1 py-0.5 rounded">src/data/resourceLinks.ts</code>.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
