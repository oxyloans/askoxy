// src/pages/ExternalArticlePage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { ExternalNewsArticle } from "../types";


function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function hostnameOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function formatLinkText(url: string) {
  const hostname = hostnameOf(url).toLowerCase();
  const companyNames: Record<string, string> = {
    "nytimes.com": "The New York Times",
    "cnn.com": "CNN",
    "bbc.com": "BBC",
    "theguardian.com": "The Guardian",
    "wsj.com": "Wall Street Journal",
    "bloomberg.com": "Bloomberg",
    "washingtonpost.com": "Washington Post",
    "forbes.com": "Forbes",
    "ft.com": "Financial Times",
    "cnbc.com": "CNBC",
    "techcrunch.com": "TechCrunch",
    "reuters.com": "Reuters",
    "wired.com": "Wired",
    "vice.com": "VICE",
    "buzzfeed.com": "BuzzFeed",
  };

  return companyNames[hostname] || hostname.replace(/^www\./, "");
}

function highlightSpecialWords(parts: Array<string | JSX.Element>) {
  const keywords = ["Breaking", "Exclusive", "Update", "Alert", "Report", "Market", "Analysis", "Insight"];
  const regex = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");

  return parts.flatMap((part, index) => {
    if (typeof part !== "string") {
      return part;
    }

    const result: Array<string | JSX.Element> = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(part)) !== null) {
      const start = match.index;
      const word = match[0];
      if (start > lastIndex) {
        result.push(part.slice(lastIndex, start));
      }
      result.push(
        <span key={`${index}-${start}-${word}`} className="text-plum font-semibold">
          {word}
        </span>
      );
      lastIndex = start + word.length;
    }

    if (lastIndex < part.length) {
      result.push(part.slice(lastIndex));
    }

    return result.length ? result : part;
  });
}

function linkifyContent(text: string) {
  // Match markdown [text](url) first, then bare https:// or www. URLs
  // Strip trailing punctuation that isn't part of the URL
  const mdLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  const urlRegex = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/g;

  const parts: Array<string | JSX.Element> = [];
  let lastIndex = 0;

  // First pass: extract markdown links
  const segments: Array<{ start: number; end: number; el: JSX.Element }> = [];
  let m: RegExpExecArray | null;

  mdLinkRegex.lastIndex = 0;
  while ((m = mdLinkRegex.exec(text)) !== null) {
    const linkText = m[1];
    const href = m[2].replace(/[).,;!?]+$/, "");
    segments.push({
      start: m.index,
      end: m.index + m[0].length,
      el: (
        <a key={`md-${m.index}`} href={href} target="_blank" rel="noreferrer"
          className="text-royal underline decoration-2 decoration-royal/50 transition-colors hover:text-plum">
          {linkText}
        </a>
      ),
    });
  }

  // Second pass: bare URLs in the gaps between markdown links
  const allSegments: Array<{ start: number; end: number; el: JSX.Element }> = [...segments];
  const coveredRanges = segments.map(s => [s.start, s.end]);

  urlRegex.lastIndex = 0;
  while ((m = urlRegex.exec(text)) !== null) {
    const start = m.index;
    const rawUrl = m[1];
    const end = start + rawUrl.length;
    // Skip if inside a markdown link
    const inside = coveredRanges.some(([s, e]) => start >= s && end <= e);
    if (inside) continue;
    const href = (rawUrl.startsWith("www.") ? `https://${rawUrl}` : rawUrl).replace(/[).,;!?]+$/, "");
    allSegments.push({
      start,
      end: start + rawUrl.replace(/[).,;!?]+$/, "").length,
      el: (
        <a key={`url-${start}`} href={href} target="_blank" rel="noreferrer"
          className="text-royal underline decoration-2 decoration-royal/50 transition-colors hover:text-plum">
          {formatLinkText(href)}
        </a>
      ),
    });
  }

  allSegments.sort((a, b) => a.start - b.start);

  for (const seg of allSegments) {
    if (seg.start > lastIndex) parts.push(text.slice(lastIndex, seg.start));
    parts.push(seg.el);
    lastIndex = seg.end;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return highlightSpecialWords(parts);
}

function renderArticleContent(text: string) {
  return text
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => {
      if (paragraph.startsWith("## ")) {
        const headingText = paragraph
          .replace(/^##\s*/, "")
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
          .replace(/\[\d+\]/g, "")
          .replace(/\[([^\]]{0,60})\]/g, "$1")
          .trim();
        return (
          <h2
            key={index}
            className="text-xl sm:text-2xl font-semibold text-plum-dark mt-8 mb-4 border-l-4 border-plum pl-4"
          >
            {headingText}
          </h2>
        );
      }

      const sanitized = paragraph
        .replace(/\bdisclos(?:e|ed|ure|ing)?\b/gi, "")
        .replace(/\[\d+\]/g, "")                   // [1] [2] citation brackets → remove
        .replace(/\s{2,}/g, " ")
        .trim();

      return (
        <p key={index} className="text-[15px] leading-[1.85] text-slate-800 font-['Georgia',serif] mb-4 break-words">
          {linkifyContent(sanitized)}
        </p>
      );
    });
}

function ArticleBodyStyles() {
  return (
    <style>{`
      .newspaper-body p { margin-bottom: 1.1em; }
      .newspaper-body h2 { margin-top: 2em; margin-bottom: 0.75em; }
      .newspaper-body a {
        color: #7c3aed;
        font-weight: 600;
        text-decoration: underline;
        text-decoration-color: #c4b5fd;
        text-underline-offset: 2px;
        word-break: break-all;
      }
      .newspaper-body a:hover { color: #6d28d9; }
    `}</style>
  );
}

const ANTHROPIC_FALLBACK_IMG = "https://i.ibb.co/qFrMxbgw/Chat-GPT-Image-Sep-28-2026-05-24-08-PM.png";

export default function ExternalArticlePage() {
  const { sourceName, id } = useParams<{ sourceName: string; id: string }>();
  const [article, setArticle] = useState<ExternalNewsArticle | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [sourceArticles, setSourceArticles] = useState<ExternalNewsArticle[]>([]);
  const [shareOpen, setShareOpen] = useState(false);
  const [linkedinPreviewOpen, setLinkedinPreviewOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const navigate = useNavigate();

  function showToast(msg: string) {
    setCopiedToast(msg);
    setTimeout(() => setCopiedToast(""), 2500);
  }

  useEffect(() => {
    if (!sourceName || !id) return;
    setLoading(true);
    setError(null);
    setContent(null);
    setHeroImage(null);

    api
      .getExternalArticle(sourceName, Number(id))
      .then((found) => {
        setArticle(found);

        if (found.imageUrl) {
          setHeroImage(found.imageUrl);
        } else {
          api
            .getExternalArticleImage(sourceName, Number(id))
            .then((img) => setHeroImage(img))
            .catch(() => setHeroImage(null));
        }

        if (found.content) {
          setContent(found.content);
          return;
        }
        setContentLoading(true);
        return api
          .getExternalArticleContent(sourceName, Number(id))
          .then((body) => setContent(body))
          .catch(() => setContent(null))
          .finally(() => setContentLoading(false));
      })
      .catch(() => setError("Couldn't load this article."))
      .finally(() => setLoading(false));
  }, [sourceName, id]);

  useEffect(() => {
    if (!sourceName) return;
    api
      .getAllExternalNews(sourceName)
      .then((res) => setSourceArticles(res.content))
      .catch(() => setSourceArticles([]));
  }, [sourceName]);

  const canonicalUrl = `https://www.askoxy.ai/news/${sourceName?.toLowerCase()}/${id}`;
  const shareImage = heroImage || ANTHROPIC_FALLBACK_IMG;

  function buildShareContent(platform: "whatsapp" | "linkedin" | "facebook" | "twitter" | "telegram" | "email") {
    const url = canonicalUrl;
    const title = article?.title ?? "OxyNews";
    const rawSummary = article?.content?.replace(/#+\s*/g, "").slice(0, 220) ?? "";
    const trimmed = rawSummary.length > 220 ? rawSummary.slice(0, 220).trim() + "..." : rawSummary;
    const hashtagLine = `#${sourceName} #OxyNews`;
    if (platform === "twitter") {
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title}\n\n${trimmed.slice(0, 140)}\n\nRead More: ${url}\n\n${hashtagLine}`)}`;
    }
    if (platform === "whatsapp") {
      return `https://wa.me/?text=${encodeURIComponent(`*${title}*\n\n${trimmed}\n\nRead More: ${url}\n\n${hashtagLine}`)}`;
    }
    if (platform === "linkedin") {
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    }
    if (platform === "facebook") {
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    }
    if (platform === "telegram") {
      return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`${title}\n\n${trimmed}\n\n${hashtagLine}`)}`;
    }
    if (platform === "email") {
      return `mailto:?subject=${encodeURIComponent(`[OxyNews] ${title}`)}&body=${encodeURIComponent(`${title}\n\n${trimmed}\n\n🔗 Read More: ${url}\n\n${hashtagLine}`)}`;
    }
    return url;
  }

  function getLinkedInPostContent() {
    const title = article?.title ?? "OxyNews";
    const summary = article?.content?.replace(/#+\s*/g, "").slice(0, 300) ?? "";
    return `${title}\n\n${summary}\n\n🔗 Read More: ${canonicalUrl}\n\n#${sourceName} #OxyNews`;
  }

  function handleNativeShare() {
    const title = article?.title ?? "";
    const text = article?.content?.replace(/#+\s*/g, "").slice(0, 220) ?? "";
    if (navigator.share) {
      navigator.share({ title, text, url: canonicalUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(canonicalUrl);
      showToast("✅ Link copied to clipboard!");
    }
  }

  function handleCopyContent() {
    navigator.clipboard.writeText(getLinkedInPostContent());
    setIsCopied(true);
    showToast("✅ Content copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2500);
  }

  function goToExternalArticle(nextId?: number | null) {
    if (!sourceName || !nextId) return;
    navigate(`/news/${sourceName.toLowerCase()}/${nextId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-24 text-ink-faint font-mono text-sm tracking-wide">
        Loading article...
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="text-center py-24">
        <p className="font-display text-xl text-plum mb-2">{error || "Article not found"}</p>
        <button onClick={() => navigate(-1)} className="text-royal underline text-sm">
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-screen-2xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-xs font-mono uppercase tracking-widest text-royal hover:underline"
          >
            ← Back
          </button>

          <div className="flex flex-wrap gap-2 items-center">
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-green-500 text-white text-xs font-semibold px-4 py-2 hover:bg-green-400 transition"
            >
              ↗ Share
            </button>
            {(() => {
              const idx = sourceArticles.findIndex((a) => String(a.id) === String(id));
              const prev = idx > 0 ? sourceArticles[idx - 1] : null;
              const next = idx >= 0 && idx < sourceArticles.length - 1 ? sourceArticles[idx + 1] : null;
              return (
                <>
                  <button
                    type="button"
                    onClick={() => goToExternalArticle(prev?.id ?? null)}
                    disabled={!prev}
                    className="focus-ring inline-flex items-center gap-2 rounded-full border border-paper/20 bg-white/95 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-plum shadow-sm hover:bg-white disabled:opacity-50"
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => goToExternalArticle(next?.id ?? null)}
                    disabled={!next}
                    className="focus-ring inline-flex items-center gap-2 rounded-full border border-paper/20 bg-white/95 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-plum shadow-sm hover:bg-white disabled:opacity-50"
                  >
                    Next →
                  </button>
                </>
              );
            })()}
          </div>
        </div>

        {heroImage && (
          <div className="mt-6 rounded-3xl overflow-hidden border border-ink/10 shadow-sm aspect-[16/9] bg-ink/5">
            <img
              src={heroImage}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={() => setHeroImage(null)}
            />
          </div>
        )}

        <div className="mt-6 border-b border-ink/10 pb-6">
          <div className="grid gap-6 lg:gap-10 lg:grid-cols-[3fr_1fr] items-start">
            <div>
              <a
                href="https://tvradhakrishna.com/"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex flex-col items-center mb-4 rounded-xl overflow-hidden transition-all hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #ede9fe 100%)", border: "1px solid #bae6fd", boxShadow: "0 2px 12px rgba(14,165,233,0.1)" }}
              >
                <div className="w-full flex items-center justify-center py-0.5 px-4" style={{ background: "linear-gradient(90deg, #0ea5e9, #6366f1, #a855f7)" }}>
                  <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-white">Sponsored by</span>
                </div>
                <div className="flex flex-col items-center px-4 py-2 gap-1">
                  <div className="rounded-lg overflow-hidden bg-white" style={{ border: "1px solid #e0f2fe", padding: "3px 8px" }}>
                    <img src="https://i.ibb.co/Rw9zb11/tvrklogo.png" alt="TVRADHAKRISHNA.COM" className="h-6 w-auto object-contain" />
                  </div>
                  <p className="text-xs font-black tracking-tight leading-snug text-center whitespace-nowrap" style={{ color: "#0f172a" }}>
                    Every Journey.{" "}
                    <span style={{ background: "linear-gradient(90deg, #0ea5e9, #6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>One Partner.</span>
                  </p>
                </div>
              </a>

              <div className="flex flex-wrap gap-2 items-center text-xs uppercase tracking-widest">
                <span className="font-bold text-violet-600">{article.sourceName}</span>
                <span className="text-slate-300">•</span>
                <span className="font-semibold text-emerald-600">{article.category || "News"}</span>
                <span className="text-slate-300">•</span>
                <span className="font-medium text-amber-600">{formatDate(article.publishedDate)}</span>
              </div>

              <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-plum-dark mt-4 leading-tight">
                {article.title}
              </h1>
            </div>

            <aside className="rounded-2xl border border-ink/10 bg-white p-4 sm:p-6 shadow-sm self-start">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.35em] text-plum-dark">Source</p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block text-sm font-semibold text-royal hover:text-plum underline decoration-2 decoration-royal/40 break-all"
                >
                  {hostnameOf(article.url)}
                </a>
              </div>

              <div className="mt-6">
                <p className="text-xs font-mono uppercase tracking-[0.35em] text-plum-dark">Category</p>
                <p className="mt-2 text-sm text-ink-soft font-semibold">{article.category || "Uncategorized"}</p>
              </div>

              <div className="mt-6">
                <p className="text-xs font-mono uppercase tracking-[0.35em] text-plum-dark">Date</p>
                <p className="mt-2 text-sm text-ink-soft font-semibold">
                  {article.publishedDate
                    ? formatDate(article.publishedDate)
                    : "Unknown"}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <ArticleBodyStyles />
      <div className="mt-10 max-w-6xl mx-auto">
        <main className="space-y-10">
          <section className="space-y-1 text-ink-soft">
            {contentLoading ? (
              <p className="text-sm font-mono text-ink-faint">Fetching full article…</p>
            ) : content ? (
              <div className="newspaper-body">{renderArticleContent(content)}</div>
            ) : (
              <div className="text-sm text-ink-faint">
                <p>Couldn't load the full text for this article.</p>
                <p className="mt-4">
                  <a href={article.url} target="_blank" rel="noreferrer" className="text-royal underline">
                    Read it on {hostnameOf(article.url)} instead ↗
                  </a>
                </p>
              </div>
            )}
          </section>

        </main>
      </div>



      <div className="mt-12 max-w-6xl mx-auto border-t border-ink/10 pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-xs font-mono uppercase tracking-widest text-royal hover:underline"
          >
            ← Back
          </button>

          <div className="flex flex-wrap gap-2">
            {(() => {
              const idx = sourceArticles.findIndex((a) => String(a.id) === String(id));
              const prev = idx > 0 ? sourceArticles[idx - 1] : null;
              const next = idx >= 0 && idx < sourceArticles.length - 1 ? sourceArticles[idx + 1] : null;
              return (
                <>
                  <button
                    type="button"
                    onClick={() => goToExternalArticle(prev?.id ?? null)}
                    disabled={!prev}
                    className="focus-ring inline-flex items-center gap-2 rounded-full border border-paper/20 bg-white/95 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-plum shadow-sm hover:bg-white disabled:opacity-50"
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => goToExternalArticle(next?.id ?? null)}
                    disabled={!next}
                    className="focus-ring inline-flex items-center gap-2 rounded-full border border-paper/20 bg-white/95 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-plum shadow-sm hover:bg-white disabled:opacity-50"
                  >
                    Next →
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 rounded-full bg-plum text-white p-3 shadow-lg hover:bg-plum-dark transition-colors"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}

      {/* SHARE MODAL */}
      {shareOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-4 sm:pb-0"
          onClick={() => setShareOpen(false)}>
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-slate-900">Share this article</p>
              <button onClick={() => setShareOpen(false)} className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition text-sm font-bold">✕</button>
            </div>
            <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-3 flex gap-3">
              <img src={shareImage} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-4">{article?.title}</p>
                <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 leading-4">{article?.content?.replace(/#+\s*/g, "").slice(0, 100)}...</p>
                <p className="mt-1 text-[10px] text-violet-500 font-semibold truncate">{canonicalUrl}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {([
                { id: "whatsapp",  label: "WhatsApp",    bg: "#25D366", icon: "💬" },
                { id: "linkedin",  label: "LinkedIn",    bg: "#0A66C2", icon: "in" },
                { id: "facebook",  label: "Facebook",    bg: "#1877F2", icon: "f" },
                { id: "twitter",   label: "X / Twitter", bg: "#000000", icon: "𝕏" },
                { id: "telegram",  label: "Telegram",    bg: "#229ED9", icon: "✈" },
                { id: "email",     label: "Email",       bg: "#6B7280", icon: "✉" },
              ] as const).map(({ id: pid, label, bg, icon }) => {
                if (pid === "linkedin") {
                  return (
                    <button key={pid} type="button"
                      onClick={() => { setShareOpen(false); setLinkedinPreviewOpen(true); showToast("Opening LinkedIn preview…"); }}
                      className="flex flex-col items-center gap-1.5 rounded-xl py-3 px-2 text-white text-xs font-semibold transition hover:opacity-90 active:scale-95"
                      style={{ backgroundColor: bg }}>
                      <span className="text-lg leading-none">{icon}</span>
                      <span className="text-[10px] font-bold">{label}</span>
                    </button>
                  );
                }
                return (
                  <a key={pid}
                    href={buildShareContent(pid)}
                    target={pid === "email" ? "_self" : "_blank"}
                    rel="noreferrer"
                    onClick={() => setShareOpen(false)}
                    className="flex flex-col items-center gap-1.5 rounded-xl py-3 px-2 text-white text-xs font-semibold transition hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: bg }}>
                    <span className="text-lg leading-none">{icon}</span>
                    <span className="text-[10px] font-bold">{label}</span>
                  </a>
                );
              })}
            </div>
            <button
              onClick={() => { handleNativeShare(); setShareOpen(false); }}
              className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition">
              ⋯ More / Device Share
            </button>
          </div>
        </div>
      )}

      {/* LINKEDIN PREVIEW */}
      {linkedinPreviewOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={() => setLinkedinPreviewOpen(false)}>
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div>
                <p className="text-base font-bold text-slate-900">LinkedIn Preview</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Check your post before opening LinkedIn</p>
              </div>
              <button type="button" onClick={() => setLinkedinPreviewOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 text-sm font-bold">✕</button>
            </div>
            <div className="p-5">
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="px-4 py-3 flex items-center gap-3 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-[#0A66C2] text-white flex items-center justify-center font-bold text-sm shrink-0">in</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Your LinkedIn Post</p>
                    <p className="text-[11px] text-slate-400">Preview</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm leading-6 text-slate-800 whitespace-pre-line">{getLinkedInPostContent()}</p>
                </div>
                <img src={shareImage} alt="Article preview" className="w-full aspect-[1.91/1] object-cover" />
                <div className="border-t border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">{sourceName}</p>
                  <p className="mt-1 text-sm font-bold text-slate-900 line-clamp-2">{article?.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500 line-clamp-3">{article?.content?.replace(/#+\s*/g, "").slice(0, 200)}</p>
                  <p className="mt-2 text-[11px] text-violet-600 font-semibold truncate">{canonicalUrl}</p>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-blue-50 border border-blue-200 p-3">
                <p className="text-xs leading-5 text-blue-800">
                  <strong>Tip:</strong> Copy the content below, then open LinkedIn and paste it into the composer.
                </p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button type="button"
                  onClick={handleCopyContent}
                  className={`rounded-xl border py-3 text-sm font-semibold transition ${
                    isCopied
                      ? "bg-green-600 text-white border-green-600 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}>
                  {isCopied ? "✅ Copied!" : "📋 Copy Content"}
                </button>
                <button type="button"
                  onClick={() => { window.open(buildShareContent("linkedin"), "_blank", "noopener,noreferrer"); setLinkedinPreviewOpen(false); }}
                  className="rounded-xl bg-[#0A66C2] py-3 text-sm font-bold text-white hover:bg-[#004182] transition">
                  Open LinkedIn →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COPIED TOAST */}
      {copiedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] bg-slate-900/90 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg backdrop-blur-sm animate-fade-in">
          {copiedToast}
        </div>
      )}
    </div>
  );
}