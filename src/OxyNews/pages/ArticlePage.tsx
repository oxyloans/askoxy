import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { PLATFORMS } from "../components/ResourceNavBar";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import type { NewsFeedItem, Opportunity, PaperclipDetail } from "../types";
import ArticleCard, { isDisplayableArticle } from "../components/ArticleCard";
import { useChatContext } from "../components/ChatContext";

const OPPORTUNITY_LABELS: Record<string, string> = {
  revenue: "Revenue", partnership: "Partnership", sales: "Sales",
  startup: "Startup", ai: "AI", investment: "Investment",
  compliance: "Compliance", career: "Career",
};

// Per-platform: keywords to match against article text, a short tagline, and a "why" insight
// STRICT topic-to-platform mapping per business rules:
// OXYGOLD.AI  → gold, commodities, precious metals
// OXYBRICKS   → real estate, property, construction, housing
// OXYLOANS    → finance, banking, loans, money, economy, RBI, credit, MSME
// ASKOXY.AI   → AI, tech, marketing, startups, digital, automation, software
const PLATFORM_META: Record<string, {
  keywords: string[];
  tagline: string;
  insight: (category: string, title: string) => string;
  accent: { border: string; bg: string; text: string; btn: string; badge: string };
}> = {
  "OXYGOLD.AI": {
    keywords: ["gold","silver","bullion","precious metal","commodity","commodities","mcx","gold price","gold rate","sovereign gold","digital gold","gold bond","gold etf","inflation hedge","safe haven","yellow metal"],
    tagline: "AI-driven gold investment platform",
    insight: (_cat, title) => `"${title.slice(0, 60)}..." — this directly affects gold markets. Track prices and invest smartly with OxyGold.AI.`,
    accent: { border: "border-amber-300", bg: "bg-amber-50", text: "text-amber-700", btn: "bg-amber-500 hover:bg-amber-600", badge: "bg-amber-100 text-amber-700" },
  },
  "OXYBRICKS": {
    keywords: ["real estate","property","realty","land","construction","housing","infrastructure","apartment","flat","plot","commercial space","reit","fractional","proptech","builder","developer","residential","rental","lease","mortgage","home loan","rera"],
    tagline: "Fractional real estate investment",
    insight: (_cat, title) => `"${title.slice(0, 60)}..." — property markets are moving. Invest fractionally in real estate with OxyBricks.`,
    accent: { border: "border-emerald-300", bg: "bg-emerald-50", text: "text-emerald-700", btn: "bg-emerald-600 hover:bg-emerald-700", badge: "bg-emerald-100 text-emerald-700" },
  },
  "OXYLOANS": {
    keywords: ["finance","financial","loan","lending","banking","bank","credit","money","fund","capital","debt","nbfc","rbi","economy","economic","market","stock","trade","business","msme","sme","interest rate","repo rate","monetary","fiscal","budget","tax","gst","revenue","profit","investment","mutual fund","insurance","sebi","nse","bse","sensex","nifty","rupee","dollar","forex","gdp","inflation","recession","startup funding","ipo","venture capital"],
    tagline: "Fast & easy loan solutions",
    insight: (_cat, title) => `"${title.slice(0, 60)}..." — financial shifts like this impact borrowing. Get instant loans with OxyLoans.`,
    accent: { border: "border-blue-300", bg: "bg-blue-50", text: "text-blue-700", btn: "bg-blue-600 hover:bg-blue-700", badge: "bg-blue-100 text-blue-700" },
  },
  "ASKOXY.AI": {
    keywords: ["artificial intelligence","ai "," ai","machine learning","deep learning","automation","tech","technology","software","digital","startup","innovation","saas","cloud","data","algorithm","robot","chatbot","llm","generative","marketing","digital marketing","social media","brand","campaign","seo","content","ecommerce","e-commerce","app","platform","product launch","edtech","healthtech","agritech","cybersecurity","blockchain","web3"],
    tagline: "AI-powered tools & smart solutions",
    insight: (_cat, title) => `"${title.slice(0, 60)}..." — stay ahead of this trend with ASKOXY.AI's smart tools and AI-driven insights.`,
    accent: { border: "border-violet-300", bg: "bg-violet-50", text: "text-violet-700", btn: "bg-violet-600 hover:bg-violet-700", badge: "bg-violet-100 text-violet-700" },
  },
};

const PLATFORM_HASHTAG: Record<string, string> = {
  "ASKOXY.AI":  "bg-violet-100 border-violet-300 text-violet-700 hover:bg-violet-600 hover:text-white",
  "OXYLOANS":   "bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white",
  "OXYBRICKS":  "bg-emerald-100 border-emerald-300 text-emerald-700 hover:bg-emerald-600 hover:text-white",
  "OXYGOLD.AI": "bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-600 hover:text-white",
};

function getBestPlatform(category?: string, domain?: string, tags?: string[], title?: string, summary?: string) {
  const text = ` ${[category, domain, title, summary, ...(tags ?? [])].join(" ").toLowerCase()} `;
  // Priority order: OXYGOLD > OXYBRICKS > OXYLOANS > ASKOXY.AI
  // More specific platforms checked first to avoid generic finance keywords stealing gold/property matches
  const priority = ["OXYGOLD.AI", "OXYBRICKS", "OXYLOANS", "ASKOXY.AI"];
  const scored = PLATFORMS.map((p) => {
    const meta = PLATFORM_META[p.name];
    const score = meta?.keywords.filter((kw) => text.includes(kw)).length ?? 0;
    const priorityBonus = (priority.length - priority.indexOf(p.name)) * 0.1;
    return { ...p, meta, score: score + (score > 0 ? priorityBonus : 0) };
  });
  return scored.sort((a, b) => b.score - a.score)[0];
}

function readTime(s?: { detailedSummary?: string; shortSummary?: string }) {
  return Math.max(2, Math.round(((s?.detailedSummary?.length ?? 0) + (s?.shortSummary?.length ?? 0)) / 900));
}

function relevanceFromStars(stars: number) {
  if (stars >= 4) return { label: "High relevance", color: "text-emerald-600" };
  if (stars >= 2) return { label: "Medium relevance", color: "text-amber-600" };
  return { label: "Low relevance", color: "text-slate-400" };
}

function StarBar({ stars }: { stars: number }) {
  const s = Math.max(0, Math.min(5, stars));
  return (
    <span className="text-amber-400 tracking-tight shrink-0 text-sm">
      {"★".repeat(s)}<span className="text-slate-200">{"★".repeat(5 - s)}</span>
    </span>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="white">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function LinkedInBtn({ href, size = "sm" }: { href: string; size?: "sm" | "md" }) {
  const dim = size === "md" ? "w-8 h-8" : "w-6 h-6";
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title="View on LinkedIn"
      className={`group relative shrink-0 ${dim} rounded-full flex items-center justify-center overflow-hidden shadow-md ring-1 ring-white/30 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:ring-2 hover:ring-[#0A66C2]/40`}
      style={{ background: "linear-gradient(135deg,#0A66C2 0%,#0077B5 60%,#00A0DC 100%)" }}
    >
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: "linear-gradient(135deg,#004182 0%,#0A66C2 100%)" }} />
      <span className="relative z-10"><LinkedInIcon /></span>
    </a>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`w-4 h-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// NEW — styles the entity hyperlinks embedded in shortSummaryHtml / detailedSummaryHtml
function PaperclipLinkStyles() {
  return (
    <style>{`
      .paperclip-linked-text a {
        color: #7c3aed;
        font-weight: 700;
        text-decoration: underline;
        text-decoration-color: #c4b5fd;
        text-underline-offset: 2px;
      }
      .paperclip-linked-text a:hover {
        color: #6d28d9;
      }
      .newspaper-body p { margin-bottom: 1.1em; }
      .newspaper-body ul { list-style: disc; padding-left: 1.4em; margin-bottom: 1em; }
      .newspaper-body ol { list-style: decimal; padding-left: 1.4em; margin-bottom: 1em; }
      .newspaper-body li { margin-bottom: 0.4em; }
      .drop-cap::first-letter {
        float: left;
        font-size: 4.2em;
        line-height: 0.78;
        font-weight: 900;
        margin-right: 0.08em;
        margin-top: 0.05em;
        color: #7c3aed;
        font-family: Georgia, serif;
      }
    `}</style>
  );
}

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const feedImageUrl: string | null = (state as any)?.imageUrl ?? null;
  const [resolvedImageUrl, setResolvedImageUrl] = useState<string | null>(feedImageUrl);

  useEffect(() => {
    setResolvedImageUrl(feedImageUrl);
  }, [id, feedImageUrl]);
  const { openChat } = useChatContext();
  const [item, setItem] = useState<PaperclipDetail | null>(null);
  const [related, setRelated] = useState<NewsFeedItem[]>([]);
  const [feedItems, setFeedItems] = useState<NewsFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [imgPreview, setImgPreview] = useState(false);
  const [activePerspIdx, setActivePerspIdx] = useState(0);
  const [detailedOpen, setDetailedOpen] = useState(false);
  const [nextOpen, setNextOpen] = useState(false);

  useEffect(() => {
    const fn = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true); setError(null); setActivePerspIdx(0);
    api.getPaperclip(id)
      .then(setItem)
      .catch(() => setError("Couldn't load this article."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!item) return;
    api.getFeed({ sort: "trending", page: 0, size: 6 })
      .then(res => setRelated(res.content.filter(i => i.paperclipId !== item.paperclipId).filter(isDisplayableArticle)))
      .catch(() => setRelated([]));
    api.getFeed({ sort: "latest", page: 0, size: 200 })
      .then(res => {
        const items = res.content.filter(isDisplayableArticle);
        setFeedItems(items);
        if (!feedImageUrl) {
          const match = items.find(f => f.paperclipId === item.paperclipId);
          if (match?.imageUrl) setResolvedImageUrl(match.imageUrl);
        }
      })
      .catch(() => setFeedItems([]));
  }, [item]);

  const opportunityEntries = useMemo(() => {
    const oa = item?.analysis?.opportunityAssessment as unknown as Record<string, Opportunity> | undefined;
    if (!oa) return [] as { key: string; o: Opportunity }[];
    return Object.entries(oa)
      .filter(([key, o]) => !!o && key !== "overall")
      .map(([key, o]) => ({ key, o: o as Opportunity }))
      .sort((x, y) => (y.o.stars ?? 0) - (x.o.stars ?? 0));
  }, [item]);

  function goTo(aid?: string | null) {
    if (!aid) return;
    const feedImg = feedItems.find(f => f.paperclipId === aid)?.imageUrl ?? null;
    navigate(`/article/${aid}`, { state: { imageUrl: feedImg } });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    if (!item) return;
    const title = item.analysis?.articleName || item.fileName || "AskOxy News";
    const description = item.analysis?.summary?.shortSummary ?? "";
    const image = resolvedImageUrl || item.blogImageUrl || "";
    const url = window.location.href;
    function setMeta(property: string, content: string, attr = "property") {
      let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${property}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, property); document.head.appendChild(el); }
      el.setAttribute("content", content);
    }
    const prevTitle = document.title;
    document.title = title;
    setMeta("og:title", title);
    setMeta("og:description", description);
    setMeta("og:image", image);
    setMeta("og:url", url);
    setMeta("og:type", "article");
    setMeta("twitter:card", "summary_large_image", "name");
    setMeta("twitter:title", title, "name");
    setMeta("twitter:description", description, "name");
    setMeta("twitter:image", image, "name");
    return () => { document.title = prevTitle; };
  }, [item, resolvedImageUrl]);

  async function handleShare() {
    const url = window.location.href;
    const title = item?.analysis?.articleName || item?.fileName || "";
    const text = item?.analysis?.summary?.shortSummary
      ? `${item.analysis.summary.shortSummary.slice(0, 120)}...`
      : title;
    const image = resolvedImageUrl || item?.blogImageUrl;
    try {
      if (navigator.share) {
        const shareData: ShareData = { title, text, url };
        if (image && navigator.canShare) {
          try {
            const res = await fetch(image);
            const blob = await res.blob();
            const file = new File([blob], "article.jpg", { type: blob.type });
            if (navigator.canShare({ files: [file] })) shareData.files = [file];
          } catch { /* image fetch failed, share without file */ }
        }
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch { /* cancelled */ }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">
      Loading article...
    </div>
  );

  if (error || !item) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <p className="text-lg font-semibold text-slate-800">{error || "Article not found"}</p>
      <Link to="/oxynews" className="text-sm text-violet-600 hover:underline">← Back to feed</Link>
    </div>
  );

  const a = item.analysis;
  const c = a?.classification;
  const s = a?.summary;
  const oa = a?.opportunityAssessment;
  const opportunityByKey = oa as unknown as Record<string, Opportunity> | undefined;
  const hasPeople = (a?.people?.length ?? 0) > 0;
  const hasCompanies = (a?.companies?.length ?? 0) > 0;
  const stakeholders = a?.stakeholderPerspectives ?? [];
  const activeStakeholder = stakeholders[activePerspIdx];
  const topOpps = opportunityEntries.slice(0, 3);
  const idx = feedItems.findIndex(f => f.paperclipId === item.paperclipId);
  const prev = idx > 0 ? feedItems[idx - 1] : null;
  const next = idx >= 0 && idx < feedItems.length - 1 ? feedItems[idx + 1] : null;
  // Smart platform match — uses full article text for best accuracy
  const bestPlatform = getBestPlatform(c?.category, c?.domain, c?.tags, a?.articleName, s?.shortSummary);
  const platformMeta = bestPlatform ? PLATFORM_META[bestPlatform.name] : null;
  const platformAccent = platformMeta?.accent;
  const categoryLabel = c?.category ?? "General";

  const whoShouldCare = stakeholders.map((p) => {
    const stars = (p.relevantOpportunities ?? [])
      .map((k) => opportunityByKey?.[k]?.stars ?? 0)
      .reduce((max, v) => Math.max(max, v), 0);
    return { stakeholder: p.stakeholder, headline: p.headline, ...relevanceFromStars(stars) };
  });

  return (
    <div className="text-slate-900">
      <PaperclipLinkStyles />

      <main className="w-full px-4 sm:px-8 pb-24">

        {/* INLINE TOOLBAR */}
        <div className="flex items-center justify-between gap-2 py-3 mb-2">
          <div className="flex items-center gap-1.5">
            <button onClick={() => goTo(prev?.paperclipId)} disabled={!prev}
              className="min-h-[36px] px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 active:bg-slate-100 transition">← Prev</button>
            <button onClick={() => goTo(next?.paperclipId)} disabled={!next}
              className="min-h-[36px] px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 active:bg-slate-100 transition">Next →</button>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={openChat}
              className="min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-400 text-slate-900 hover:bg-amber-300 active:bg-amber-500 transition">✦ Ask AI</button>
            <button onClick={handleShare}
              className="min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-500 text-white hover:bg-green-400 active:bg-green-600 transition">↗ Share</button>
          </div>
        </div>

        {/* TAGS */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {c?.category && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-violet-600 text-white">{c.category}</span>
          )}
          {c?.domain && c.domain !== "General" && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">{c.domain}</span>
          )}
          {c?.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="px-2.5 py-1 rounded-full text-[11px] bg-amber-50 text-amber-700 border border-amber-200">#{tag}</span>
          ))}
        </div>

        {/* HEADLINE + IMAGE + META + SUMMARY — newspaper layout */}
        <div className="mt-3">
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold leading-[1.25] tracking-tight text-slate-950 mb-3">
            {a?.articleName || item.fileName || "Untitled article"}
          </h1>
          <div className="mt-1">
{(() => {
              const raw = item.s3FileUrl ?? "";
              const name = item.fileName ?? "";
              if (!name.toLowerCase().endsWith(".pdf")) return null;
              const pdfUrl = raw.startsWith("http") ? raw : `https://radha-clone.s3.ap-south-1.amazonaws.com/${raw}`;
              return (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="9" y1="13" x2="15" y2="13" />
                    <line x1="9" y1="17" x2="15" y2="17" />
                  </svg>
                  View Source PDF ↗
                </a>
              );
            })()}

            {/* SPONSOR STRIP — below PDF */}
            <a
              href="https://tvradhakrishna.com/"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between gap-3 w-full mb-4 px-4 py-3 rounded-xl border-l-4 border-amber-400 bg-amber-50 hover:bg-amber-100 shadow-sm transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0 w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center font-black text-[10px] tracking-tight"><span className="text-red-600">TV</span><span className="text-blue-600">RK</span></div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Sponsored by</p>
                  <p className="text-sm font-extrabold text-amber-800 leading-tight">
                    Radhakrishna Thatavarti
                    <span className="ml-1.5 text-xs font-normal text-amber-500">CEO, OxyGroup</span>
                  </p>
                </div>
              </div>
              <a href="https://tvradhakrishna.com/" target="_blank" rel="noreferrer"
                className="shrink-0 text-xs font-bold text-amber-700 underline underline-offset-2 hover:text-amber-900 transition">
                <img src="https://i.ibb.co/Rw9zb11/tvrklogo.png" alt="tvrklogo" className="h-12 w-auto object-contain rounded-lg border-2 border-amber-300 bg-white px-3 py-2 shadow-md" />
              </a>
            </a>
            {(resolvedImageUrl || item.blogImageUrl) && (
              <img
                src={resolvedImageUrl || item.blogImageUrl}
                alt=""
                onClick={() => setImgPreview(true)}
                className="float-right ml-4 mb-2 w-full sm:w-1/2 h-56 sm:h-72 rounded-xl object-cover shadow-sm hover:opacity-90 transition cursor-zoom-in"
              />
            )}
            {/* META */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] sm:text-xs text-slate-500 border-b border-slate-100 pb-3 mb-4">
              <span>📅 {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
              <span>⏱ {readTime(s)} min read</span>
              <span className="font-semibold text-violet-600">✦ RadhAI Analysis</span>
            </div>
            {s?.shortSummary && (
              s.shortSummaryHtml ? (
                <p
                  className="drop-cap paperclip-linked-text text-base sm:text-[17px] leading-8 text-slate-800 font-semibold border-l-4 border-violet-400 pl-4 italic"
                  dangerouslySetInnerHTML={{ __html: s.shortSummaryHtml }}
                />
              ) : (
                <p className="drop-cap text-base sm:text-[17px] leading-8 text-slate-800 font-semibold border-l-4 border-violet-400 pl-4 italic">
                  {s.shortSummary}
                </p>
              )
            )}
            <div className="clear-both" />
          </div>
        </div>

        {/* PLATFORM INSIGHT BANNER */}
        {bestPlatform && platformMeta && platformAccent && (
          <div className={`mt-5 rounded-2xl border-2 ${platformAccent.border} ${platformAccent.bg} p-4 sm:p-5`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Insight for you</p>
                <p className={`text-sm font-extrabold ${platformAccent.text}`}>{bestPlatform.name}</p>
                <p className="mt-1 text-sm leading-6 text-slate-700 line-clamp-3 sm:line-clamp-none">{platformMeta.insight(categoryLabel, a?.articleName ?? "")}</p>
                <p className={`mt-1 text-xs font-semibold ${platformAccent.text}`}>{platformMeta.tagline}</p>
              </div>
              <a href={bestPlatform.url} target="_blank" rel="noreferrer"
                className={`self-start sm:self-auto shrink-0 inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold text-white transition ${platformAccent.btn}`}>
                Explore {bestPlatform.name} ↗
              </a>
            </div>
          </div>
        )}

        {/* TWO-COLUMN LAYOUT */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6 lg:gap-8 items-start">
          <div className="min-w-0 space-y-8">

            {/* FULL ANALYSIS ACCORDION */}
            {s?.detailedSummary && (
              <section>
                <button type="button" onClick={() => setDetailedOpen(v => !v)}
                  className="w-full flex items-center justify-between py-3 border-b-2 border-slate-900 text-left group">
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-violet-700 transition">Full Analysis</h2>
                  <ChevronIcon open={detailedOpen} />
                </button>
                {s.detailedSummaryHtml ? (
                  <div
                    className={`newspaper-body paperclip-linked-text mt-4 text-[15px] leading-[1.85] text-slate-800 font-['Georgia',serif] ${detailedOpen ? "" : "line-clamp-6"}`}
                    dangerouslySetInnerHTML={{ __html: s.detailedSummaryHtml }}
                  />
                ) : (
                  <div className={`newspaper-body mt-4 text-[15px] leading-[1.85] text-slate-800 font-['Georgia',serif] ${detailedOpen ? "" : "line-clamp-6"}`}>
                    {s.detailedSummary}
                  </div>
                )}
                {!detailedOpen && (
                  <button onClick={() => setDetailedOpen(true)} className="mt-2 text-xs font-semibold text-violet-600 hover:underline">
                    Read full analysis ↓
                  </button>
                )}
                <p className="mt-4 text-sm font-bold text-slate-800">
                  Sign up for more information at{" "}
                  <a href="https://www.askoxy.ai" target="_blank" rel="noreferrer"
                    className="text-violet-600 underline underline-offset-2 hover:text-violet-800 transition">
                    ASKOXY.AI ↗
                  </a>
                </p>
              </section>
            )}

            {/* KEY POINTS */}
            {s?.keyPoints && s.keyPoints.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-3 mb-4">Key Points</h2>
                <ul className="space-y-0 divide-y divide-slate-100">
                  {s.keyPoints.map((k, i) => (
                    <li key={i} className="flex gap-3 py-3 text-[15px] leading-[1.8] text-slate-800 font-['Georgia',serif]">
                      <span className="mt-1 w-5 h-5 shrink-0 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                      {k}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* WHAT COULD HAPPEN NEXT */}
            {s?.actionItems && s.actionItems.length > 0 && (
              <section>
                <button type="button" onClick={() => setNextOpen(v => !v)}
                  className="w-full flex items-center justify-between py-3 border-b-2 border-slate-900 text-left group">
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-violet-700 transition">What Could Happen Next</h2>
                  <ChevronIcon open={nextOpen} />
                </button>
                {nextOpen && (
                  <ol className="mt-4 space-y-0 divide-y divide-slate-100">
                    {s.actionItems.map((k, i) => (
                      <li key={i} className="flex gap-3 py-3 text-[15px] leading-[1.8] text-slate-800 font-['Georgia',serif]">
                        <span className="font-bold text-amber-500 shrink-0 w-6 mt-0.5">{String(i + 1).padStart(2, "0")}.</span>
                        {k}
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            )}

            {/* RADHAI IMPACT SCORES */}
            {opportunityEntries.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-3 mb-4">RadhAI Impact Scores</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                  {opportunityEntries.map(({ key, o }, i) => {
                    const score = Math.round((o.stars / 5) * 100);
                    if (isNaN(score)) return null;
                    const palette = [
                      { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", bar: "bg-violet-400" },
                      { bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-700",   bar: "bg-blue-400" },
                      { bg: "bg-emerald-50",border: "border-emerald-200",text: "text-emerald-700",bar: "bg-emerald-400" },
                      { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  bar: "bg-amber-400" },
                      { bg: "bg-rose-50",   border: "border-rose-200",   text: "text-rose-700",   bar: "bg-rose-400" },
                      { bg: "bg-cyan-50",   border: "border-cyan-200",   text: "text-cyan-700",   bar: "bg-cyan-400" },
                      { bg: "bg-fuchsia-50",border: "border-fuchsia-200",text: "text-fuchsia-700",bar: "bg-fuchsia-400" },
                      { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", bar: "bg-orange-400" },
                    ];
                    const p = palette[i % palette.length];
                    return (
                      <div key={key} className={`rounded-lg border ${p.border} ${p.bg} p-2`}>
                        <p className={`text-[9px] font-bold uppercase tracking-wide ${p.text}`}>{OPPORTUNITY_LABELS[key] ?? key}</p>
                        <p className={`mt-0.5 text-lg font-extrabold ${p.text}`}>{score}<span className="text-[10px] font-normal text-slate-400">/100</span></p>
                        <div className="mt-1 h-1 rounded-full bg-white/60 overflow-hidden">
                          <div className={`h-full rounded-full ${p.bar}`} style={{ width: `${score}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* WHO SHOULD CARE */}
            {whoShouldCare.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-3 mb-4">Who Should Care?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {whoShouldCare.slice(0, 4).map((w, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="text-sm font-bold text-slate-800">{w.stakeholder}</p>
                      <p className={`text-xs font-semibold mt-0.5 ${w.color}`}>{w.label}</p>
                      <p className="mt-2 text-xs leading-5 text-slate-600">{w.headline}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* STAKEHOLDER PERSPECTIVES */}
            {stakeholders.length > 0 && (
              <section id="perspectives">
                <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-3 mb-4">Stakeholder Perspectives</h2>
                {/* Horizontal scroll on mobile, wrap on desktop */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible scrollbar-none">
                  {stakeholders.map((p, i) => (
                    <button key={i} type="button" onClick={() => setActivePerspIdx(i)}
                      className={`shrink-0 min-h-[36px] px-4 py-2 rounded-full text-xs font-semibold border transition ${i === activePerspIdx ? "bg-violet-600 text-white border-violet-600" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 active:bg-slate-100"}`}>
                      {p.stakeholder}
                    </button>
                  ))}
                </div>
                {activeStakeholder && (
                  <div className="rounded-xl border-l-4 border-violet-500 bg-violet-50 p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-violet-600 mb-1">{activeStakeholder.stakeholder}</p>
                    <p className="text-base font-bold text-slate-900">{activeStakeholder.headline}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">{activeStakeholder.angle}</p>
                    {activeStakeholder.relevantOpportunities && activeStakeholder.relevantOpportunities.length > 0 && (
                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {activeStakeholder.relevantOpportunities.map(key => {
                          const o = opportunityByKey?.[key];
                          if (!o) return null;
                          return (
                            <div key={key} className="rounded-lg border border-violet-200 bg-white p-3">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-slate-700">{OPPORTUNITY_LABELS[key] ?? key}</p>
                                <StarBar stars={o.stars} />
                              </div>
                              {o.reason && <p className="mt-1 text-xs text-slate-500">{o.reason}</p>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* SERVICE RECOMMENDATIONS */}
            {a?.serviceRecommendations && a.serviceRecommendations.length > 0 && (
              <section id="services">
                <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-3 mb-4">OxyGroup Service Fit</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {a.serviceRecommendations.map((rec, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-slate-800">{rec.service}</h3>
                        <span className="text-[10px] font-semibold uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{rec.priority}</span>
                      </div>
                      <p className="text-xs leading-5 text-slate-600 mb-2">{rec.businessImpact}</p>
                      {rec.actionItems?.length > 0 && (
                        <ul className="space-y-1">{rec.actionItems.map((it, j) => <li key={j} className="text-xs text-slate-500">• {it}</li>)}</ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* PEOPLE & COMPANIES */}
            {(hasPeople || hasCompanies) && (
              <section id="people-companies">
                <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-3 mb-4">People &amp; Organizations</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {hasPeople && (
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">People</h3>
                      <div className="space-y-3">
                        {a!.people!.map((p, i) => (
                          <div key={i} className="flex items-start justify-between gap-2 border-t border-slate-100 pt-3 first:border-0 first:pt-0">
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                              <p className="text-xs text-slate-500">{[p.designation, p.company].filter(Boolean).join(", ")}</p>
                            </div>
                            {p.linkedin && <LinkedInBtn href={p.linkedin} size="md" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {hasCompanies && (
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Organizations</h3>
                      <div className="space-y-3">
                        {a!.companies!.map((c2, i) => (
                          <div key={i} className="border-t border-slate-100 pt-3 first:border-0 first:pt-0">
                            <p className="text-sm font-semibold text-slate-800">{c2.name}</p>
                            {c2.website && (
                              <a href={c2.website} target="_blank" rel="noreferrer"
                                className="inline-flex items-center gap-1.5 mt-0.5 text-xs text-violet-600 hover:text-violet-800 hover:underline transition">
                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                                {c2.website.replace(/^https?:\/\//, "")}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* SIDEBAR — full width on mobile, sticky column on desktop */}
          <aside className="space-y-4 lg:sticky lg:top-4">



            {/* TOP OPPORTUNITIES */}
            {topOpps.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Top Opportunities</h3>
                <div className="space-y-3">
                  {topOpps.map(({ key, o }) => (
                    <div key={key} className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800">{OPPORTUNITY_LABELS[key] ?? key}</p>
                        {o.reason && <p className="text-[11px] text-slate-500 mt-0.5 leading-4 line-clamp-2">{o.reason}</p>}
                      </div>
                      <StarBar stars={o.stars} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PEOPLE SIDEBAR */}
            {hasPeople && (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">People Involved</h3>
                <div className="space-y-2.5">
                  {a!.people!.slice(0, 3).map((p, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-xs font-bold shrink-0">
                        {p.name[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800 truncate">{p.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{p.designation || p.company}</p>
                      </div>
                      {p.linkedin && <LinkedInBtn href={p.linkedin} size="sm" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SPONSORED BY */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Sponsored by</h3>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(p => (
                  <a key={p.name} href={p.url} target="_blank" rel="noreferrer"
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold transition ${PLATFORM_HASHTAG[p.name] ?? "border-slate-200 bg-slate-50 text-slate-600"}`}>
                    #{p.name}
                  </a>
                ))}
              </div>
            </div>

            {item.blogUrl && (
              <a href={item.blogUrl} target="_blank" rel="noreferrer"
                className="block w-full text-center rounded-xl bg-amber-400 text-slate-900 text-xs font-bold py-3 hover:bg-amber-300 transition">
                AskOxyBlog ↗
              </a>
            )}
          </aside>
        </div>

        {/* RELATED ARTICLES */}
        {related.length > 0 && (
          <section className="mt-10 border-t-2 border-slate-900 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map(rel => (
                <motion.div key={rel.paperclipId} whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <ArticleCard item={rel} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* FOOTER NAV */}
        <div className="mt-8 border-t border-slate-200 pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-slate-400 order-last sm:order-first">
            Analysed by <span className="font-semibold text-slate-700">Radh<span className="text-violet-600">AI</span></span>
          </p>
          <div className="flex gap-2">
            <button onClick={() => goTo(prev?.paperclipId)} disabled={!prev}
              className="flex-1 sm:flex-none min-h-[40px] px-4 py-2 text-xs font-semibold border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 active:bg-slate-100">← Previous</button>
            <button onClick={() => goTo(next?.paperclipId)} disabled={!next}
              className="flex-1 sm:flex-none min-h-[40px] px-4 py-2 text-xs font-semibold border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 active:bg-slate-100">Next →</button>
          </div>
        </div>
      </main>

      {/* IMAGE LIGHTBOX */}
      {imgPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setImgPreview(false)}
        >
          <img
            src={resolvedImageUrl || item.blogImageUrl}
            alt=""
            className="max-w-[92vw] max-h-[88vh] rounded-2xl shadow-2xl object-contain"
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setImgPreview(false)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition text-lg font-bold"
          >✕</button>
        </div>
      )}

      {/* FLOATING BUTTONS — always visible */}
      <div className="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-2">
        <button onClick={openChat} aria-label="Ask AI"
          className="w-12 h-12 rounded-full bg-amber-400 text-slate-900 shadow-lg flex items-center justify-center hover:bg-amber-300 active:bg-amber-500 transition">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {showBackToTop && (
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="min-h-[40px] px-4 py-2.5 rounded-lg bg-violet-600 text-white text-xs font-bold shadow-lg hover:bg-violet-700 active:bg-violet-800 transition">↑ Top</button>
        )}
      </div>
    </div>
  );
}