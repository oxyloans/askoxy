// src/components/ResourceNavBar.tsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RESOURCE_CATEGORIES } from "../data/resourceLinks";

const ALL_CATEGORIES = [...RESOURCE_CATEGORIES];

export const PLATFORMS = [
  {
    name: "ASKOXY.AI",
    url: "https://www.askoxy.ai/",
    image: "https://i.ibb.co/mrsmW1m0/askoxy.png",
    description: "AI-powered platform for smart solutions",
  },
  {
    name: "OXYLOANS",
    url: "https://oxyloans.com/",
    image: "https://i.ibb.co/gM2sPb26/oxyloans.png",
    description: "Fast & easy loan solutions",
  },
  {
    name: "OXYBRICKS",
    url: "https://www.oxybricks.world/",
    image: "https://i.ibb.co/vCdv7rGf/oxybricks.png",
    description: "Fractional real estate investment",
  },
  {
    name: "OXYGOLD.AI",
    url: "https://www.oxygold.ai/",
    image: "https://i.ibb.co/zVpj6wZj/oxygoldweb.png",
    description: "AI-driven gold investment platform",
  },
];

export default function ResourceNavBar() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [anchorCenter, setAnchorCenter] = useState<number | null>(null);
  const [panelLeft, setPanelLeft] = useState<number | null>(null);
  const [platformsOpen, setPlatformsOpen] = useState(false);
  const [platformsAnchorCenter, setPlatformsAnchorCenter] = useState<number | null>(null);
  const [platformsPanelLeft, setPlatformsPanelLeft] = useState<number | null>(null);
  const platformsPanelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close the dropdown whenever the route changes (e.g. after picking a link).
  useEffect(() => { setOpenId(null); setPlatformsOpen(false); }, [location.pathname]);

  // Close on Escape from anywhere.
  useEffect(() => {
    if (!openId && !platformsOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpenId(null); setPlatformsOpen(false); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openId, platformsOpen]);

  // Position platforms panel
  useLayoutEffect(() => {
    if (!platformsOpen || platformsAnchorCenter === null || !platformsPanelRef.current) {
      setPlatformsPanelLeft(null);
      return;
    }
    const width = platformsPanelRef.current.offsetWidth;
    const margin = 12;
    const left = Math.max(margin, Math.min(platformsAnchorCenter - width / 2, window.innerWidth - width - margin));
    setPlatformsPanelLeft(left);
  }, [platformsOpen, platformsAnchorCenter]);

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
      onPointerLeave={(e) => { if (e.pointerType === "touch") return; setOpenId(null); }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 overflow-x-auto py-2 justify-start lg:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            to="/oxynews"
            className="focus-ring flex min-h-10 shrink-0 items-center rounded-full bg-white px-4 text-sm font-semibold tracking-wide text-plum-dark transition-colors hover:bg-white/90 lg:border lg:border-ink/10"
          >
            Home
          </Link>

          <button
            type="button"
            onPointerEnter={(e) => { if (e.pointerType === "touch") return; setPlatformsOpen(true); setOpenId(null); setPlatformsAnchorCenter(e.currentTarget.getBoundingClientRect().left + e.currentTarget.getBoundingClientRect().width / 2); }}
            onPointerLeave={(e) => { if (e.pointerType === "touch") return; const related = e.relatedTarget as Node; if (!platformsPanelRef.current?.contains(related)) setPlatformsOpen(false); }}
            onClick={(e) => { setPlatformsOpen((o) => !o); setOpenId(null); setPlatformsAnchorCenter(e.currentTarget.getBoundingClientRect().left + e.currentTarget.getBoundingClientRect().width / 2); }}
            aria-expanded={platformsOpen}
            aria-haspopup="menu"
            className={`focus-ring flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 py-2 transition-colors border border-ink/10 ${
              platformsOpen ? "bg-gold text-plum shadow-sm" : "bg-white text-ink-soft hover:bg-white/90"
            }`}
          >
            <span className="font-semibold text-sm tracking-wide">Our Platforms</span>
            <span className={`text-[10px] transition-transform ${platformsOpen ? "rotate-180" : ""}`}>▾</span>
          </button>

          {ALL_CATEGORIES.map((cat) => {
            const isOpen = openId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={(e) => (isOpen ? setOpenId(null) : openFrom(cat.id, e.currentTarget))}
                onPointerEnter={(e) => { if (e.pointerType === "touch") return; openFrom(cat.id, e.currentTarget); setPlatformsOpen(false); }}
                onFocus={(e) => openFrom(cat.id, e.currentTarget)}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                className={`focus-ring flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 py-2 transition-colors ${
                  isOpen
                    ? "bg-white text-plum-dark border border-ink/10 shadow-sm"
                    : "bg-white text-ink-soft border border-ink/10 hover:bg-white/90"
                }`}
              >
                <span className="font-semibold text-sm tracking-wide">{cat.label}</span>
                <span className={`text-[10px] transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
              </button>
            );
          })}
          <Link
            to="/radhai-news"
            className="focus-ring flex min-h-10 shrink-0 items-center rounded-full bg-white px-4 text-sm font-semibold tracking-wide text-plum-dark transition-colors hover:bg-white/90 border border-ink/10"
          >
            RadhAI News
          </Link>
        </div>
      </div>

      {platformsOpen && (
        <div
          ref={platformsPanelRef}
          role="menu"
          className="absolute top-full z-40 w-max max-w-[calc(100vw-24px)] rounded-xl border border-gold/25 bg-white shadow-lift"
          style={{
            left: platformsPanelLeft ?? platformsAnchorCenter ?? 0,
            visibility: platformsPanelLeft === null ? "hidden" : "visible",
          }}
          onPointerLeave={(e) => { if (e.pointerType === "touch") return; setPlatformsOpen(false); }}
        >
          <div className="p-3 grid grid-cols-2 gap-2">
            {PLATFORMS.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                role="menuitem"
                className="focus-ring group block rounded-lg border border-ink/10 hover:border-royal/40 hover:bg-royal/5 transition-colors px-3 py-2.5"
              >
                <div className="text-sm font-semibold text-plum group-hover:text-royal transition-colors">{p.name}</div>
                <div className="text-xs text-ink-faint mt-0.5">{p.description}</div>
              </a>
            ))}
          </div>
        </div>
      )}

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
