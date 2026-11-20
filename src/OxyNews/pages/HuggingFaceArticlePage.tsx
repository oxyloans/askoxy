import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api, HFArticle } from "../lib/api";

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

function cleanHtml(html: string): string {
  const div = document.createElement("div");
  div.innerHTML = html;
  div.querySelectorAll("a").forEach(a => {
    if (a.textContent?.trim() === "Back to Articles") a.closest("div")?.remove();
  });
  div.querySelectorAll("div").forEach(d => {
    if (d.textContent?.includes("Upvote") && d.querySelector("ul")) d.remove();
  });
  div.querySelectorAll("div").forEach(d => {
    const imgs = d.querySelectorAll("img");
    const links = d.querySelectorAll("a");
    if (imgs.length >= 2 && links.length >= 2 && (d.textContent?.trim().length ?? 0) < 300) d.remove();
  });
  div.querySelectorAll("figure").forEach(f => {
    if (!f.querySelector("img") && !f.querySelector("video")) f.remove();
  });
  // Remove avatar images (upvoter profile pictures)
  div.querySelectorAll("img[src*='cdn-avatars.huggingface.co']").forEach(img => img.remove());
  div.querySelector("h1")?.remove();
  div.querySelectorAll("div, span").forEach(el => {
    if (/^Published\s+\w+/.test(el.textContent?.trim() || "")) el.remove();
  });
  div.querySelectorAll("a").forEach(a => {
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noreferrer");
  });
  div.querySelectorAll("h1 a, h2 a, h3 a, h4 a").forEach(a => {
    const span = a.querySelector("span:last-child");
    if (span) a.replaceWith(document.createTextNode(span.textContent || ""));
  });
  return div.innerHTML;
}

export default function HuggingFaceArticlePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const url = params.get("url") || "";

  const [article, setArticle] = useState<HFArticle | null>(null);
  const [allArticles, setAllArticles] = useState<HFArticle[]>([]);
  const [allArticlesLoaded, setAllArticlesLoaded] = useState(false);
  const [cleanedHtml, setCleanedHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [imgPreview, setImgPreview] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [linkedinPreviewOpen, setLinkedinPreviewOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [copiedToast, setCopiedToast] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);

  function showToast(msg: string) {
    setCopiedToast(msg);
    setTimeout(() => setCopiedToast(""), 2500);
  }

  useEffect(() => {
    api.getHuggingFaceList(100)
      .then(res => { setAllArticles(res.articles); setAllArticlesLoaded(true); })
      .catch(() => setAllArticlesLoaded(true));
  }, []);

  useEffect(() => {
    if (!url) { setError("No article URL provided."); setLoading(false); return; }
    setLoading(true); setError(null); setImgError(false);
    api.getHuggingFaceArticle(url)
      .then(a => { setArticle(a); if (a.contentHtml) setCleanedHtml(cleanHtml(a.contentHtml)); })
      .catch(err => setError(err?.message || "Failed to load article."))
      .finally(() => setLoading(false));
  }, [url]);

  useEffect(() => {
    const fn = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
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
        <button onClick={() => navigate(-1)} className="text-royal underline text-sm">Back</button>
      </div>
    );
  }

  const showImg = !!article.image && !imgError;
  const canonicalUrl = article.url;
  const idx = allArticlesLoaded ? allArticles.findIndex(a => decodeURIComponent(a.url) === decodeURIComponent(url)) : -1;
  const prev = idx > 0 ? allArticles[idx - 1] : null;
  const next = idx >= 0 && idx < allArticles.length - 1 ? allArticles[idx + 1] : null;

  function goTo(articleUrl: string) {
    setArticle(null);
    setCleanedHtml("");
    setLoading(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/huggingface/article?url=${encodeURIComponent(articleUrl)}`);
  }

  function buildShare(platform: "whatsapp" | "linkedin" | "facebook" | "twitter" | "telegram" | "email") {
    const title = article!.title;
    const summary = article!.description?.slice(0, 220) ?? "";
    const hashtags = "#HuggingFace #OxyNews";
    if (platform === "whatsapp") return `https://wa.me/?text=${encodeURIComponent(`*${title}*\n\n${summary}\n\nRead More: ${canonicalUrl}\n\n${hashtags}`)}`;
    if (platform === "twitter") return `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title}\n\n${summary.slice(0, 140)}\n\n${canonicalUrl}\n\n${hashtags}`)}`;
    if (platform === "linkedin") return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`;
    if (platform === "facebook") return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`;
    if (platform === "telegram") return `https://t.me/share/url?url=${encodeURIComponent(canonicalUrl)}&text=${encodeURIComponent(`${title}\n\n${hashtags}`)}`;
    if (platform === "email") return `mailto:?subject=${encodeURIComponent(`[OxyNews] ${title}`)}&body=${encodeURIComponent(`${title}\n\n${summary}\n\n🔗 ${canonicalUrl}`)}`;
    return canonicalUrl;
  }

  function handleNativeShare() {
    if (navigator.share) {
      navigator.share({ title: article!.title, url: canonicalUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(canonicalUrl);
      showToast("✅ Link copied!");
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-screen-2xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto">

        {/* ── Top nav ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={() => navigate(-1)}
            className="text-xs font-mono uppercase tracking-widest text-royal hover:underline">
            ← Back
          </button>
          <div className="flex flex-wrap gap-2 items-center">
            <button type="button" onClick={() => setShareOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-green-500 text-white text-xs font-semibold px-4 py-2 hover:bg-green-400 transition">
              ↗ Share
            </button>
            <button type="button" onClick={() => prev && goTo(prev.url)} disabled={!prev}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-paper/20 bg-white/95 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-plum shadow-sm hover:bg-white disabled:opacity-50 transition">
              ← Previous
            </button>
            <button type="button" onClick={() => next && goTo(next.url)} disabled={!next}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-paper/20 bg-white/95 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-plum shadow-sm hover:bg-white disabled:opacity-50 transition">
              Next →
            </button>
          </div>
        </div>

        {/* ── Header ── */}
        <div className="mt-6 border-b border-ink/10 pb-6">
          <div className="grid gap-6 lg:gap-10 lg:grid-cols-[3fr_1fr] items-start">
            <div>
              {/* TVRK badge */}
              <a href="https://tvradhakrishna.com/" target="_blank" rel="noreferrer"
                className="group inline-flex flex-col items-center mb-4 rounded-xl overflow-hidden transition-all hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #ede9fe 100%)", border: "1px solid #bae6fd", boxShadow: "0 2px 12px rgba(14,165,233,0.1)" }}>
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

              {/* Meta */}
              <div className="flex flex-wrap gap-2 items-center text-xs uppercase tracking-widest">
                <span className="font-bold text-violet-600">Hugging Face</span>
                <span className="text-slate-300">•</span>
                <span className="font-semibold text-emerald-600">Blog</span>
                {article.publishedAt && (
                  <><span className="text-slate-300">•</span>
                  <span className="font-medium text-amber-600">{formatDate(article.publishedAt)}</span></>
                )}
              </div>

              {/* Image floated right beside title — like RBI ArticlePage */}
              {showImg && (
                <img
                  src={article.image}
                  alt={article.title}
                  onClick={() => setImgPreview(true)}
                  onError={() => setImgError(true)}
                  className="float-right ml-4 mb-2 w-full sm:w-1/2 h-56 sm:h-72 rounded-xl object-cover shadow-sm hover:opacity-90 transition cursor-zoom-in"
                />
              )}

              {/* Title */}
              <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-plum-dark mt-4 leading-tight">
                {article.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] sm:text-xs text-slate-500 border-b border-slate-100 pb-3 mb-4 mt-3">
                {article.author && <span>✍ {article.author}</span>}
                {article.readingTimeMin > 0 && <span>⏱ {article.readingTimeMin} min read</span>}
              </div>

              <div className="clear-both" />
            </div>

            {/* Sidebar card */}
            <aside className="rounded-2xl border border-ink/10 bg-white p-4 sm:p-6 shadow-sm self-start">
              {article.author && (
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.35em] text-plum-dark">Author</p>
                  <p className="mt-2 text-sm font-semibold text-ink-soft">{article.author}</p>
                </div>
              )}
              {article.publishedAt && (
                <div className="mt-6">
                  <p className="text-xs font-mono uppercase tracking-[0.35em] text-plum-dark">Published</p>
                  <p className="mt-2 text-sm font-semibold text-ink-soft">{formatDate(article.publishedAt)}</p>
                </div>
              )}
              {article.readingTimeMin > 0 && (
                <div className="mt-6">
                  <p className="text-xs font-mono uppercase tracking-[0.35em] text-plum-dark">Reading time</p>
                  <p className="mt-2 text-sm font-semibold text-ink-soft">{article.readingTimeMin} min</p>
                </div>
              )}
              <div className="mt-6">
                <p className="text-xs font-mono uppercase tracking-[0.35em] text-plum-dark">Source</p>
                <a href={article.url} target="_blank" rel="noreferrer"
                  className="mt-2 block text-sm font-semibold text-royal hover:text-plum underline decoration-2 decoration-royal/40 break-all">
                  huggingface.co
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="mt-10 max-w-6xl mx-auto">
        <div className="hf-prose">
          {cleanedHtml
            ? <div dangerouslySetInnerHTML={{ __html: cleanedHtml }} />
            : (
              <div className="text-sm text-ink-faint text-center py-12">
                <p>Full content not available.</p>
                <a href={article.url} target="_blank" rel="noreferrer" className="text-royal underline mt-2 block">
                  Read on Hugging Face ↗
                </a>
              </div>
            )
          }
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="mt-12 max-w-6xl mx-auto border-t border-ink/10 pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
          <button type="button" onClick={() => navigate(-1)}
            className="text-xs font-mono uppercase tracking-widest text-royal hover:underline">
            ← Back
          </button>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => prev && goTo(prev.url)} disabled={!prev}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-paper/20 bg-white/95 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-plum shadow-sm hover:bg-white disabled:opacity-50">
              ← Previous
            </button>
            <button type="button" onClick={() => next && goTo(next.url)} disabled={!next}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-paper/20 bg-white/95 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-plum shadow-sm hover:bg-white disabled:opacity-50">
              Next →
            </button>
          </div>
        </div>
      </div>

      {showBackToTop && (
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 rounded-full bg-plum text-white p-3 shadow-lg hover:bg-plum-dark transition-colors">
          ↑
        </button>
      )}

      {/* ── Image lightbox ── */}
      {imgPreview && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
          onClick={() => setImgPreview(false)}>
          <div className="relative w-full max-w-3xl" onClick={e => e.stopPropagation()}>
            <img src={article.image} alt={article.title}
              className="w-full max-h-[80vh] rounded-xl shadow-2xl object-contain" />
            <button onClick={() => setImgPreview(false)}
              className="absolute top-2 right-2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition text-lg font-bold">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ── Share modal ── */}
      {shareOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-4 sm:pb-0"
          onClick={() => setShareOpen(false)}>
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-slate-900">Share this article</p>
              <button onClick={() => setShareOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition text-sm font-bold">✕</button>
            </div>
            <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-3 flex gap-3">
              {showImg && <img src={article.image} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />}
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-4">{article.title}</p>
                <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 leading-4">{article.description?.slice(0, 100)}</p>
                <p className="mt-1 text-[10px] text-violet-500 font-semibold truncate">huggingface.co</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {([
                { id: "whatsapp", label: "WhatsApp", bg: "#25D366", icon: "💬" },
                { id: "linkedin", label: "LinkedIn",  bg: "#0A66C2", icon: "in" },
                { id: "facebook", label: "Facebook",  bg: "#1877F2", icon: "f" },
                { id: "twitter",  label: "X / Twitter",bg: "#000000", icon: "𝕏" },
                { id: "telegram", label: "Telegram",  bg: "#229ED9", icon: "✈" },
                { id: "email",    label: "Email",     bg: "#6B7280", icon: "✉" },
              ] as const).map(({ id, label, bg, icon }) => {
                if (id === "linkedin") {
                  return (
                    <button key={id} type="button"
                      onClick={() => { setShareOpen(false); setLinkedinPreviewOpen(true); showToast("Opening LinkedIn preview…"); }}
                      className="flex flex-col items-center gap-1.5 rounded-xl py-3 px-2 text-white text-xs font-semibold transition hover:opacity-90 active:scale-95"
                      style={{ backgroundColor: bg }}>
                      <span className="text-lg leading-none">{icon}</span>
                      <span className="text-[10px] font-bold">{label}</span>
                    </button>
                  );
                }
                return (
                  <a key={id} href={buildShare(id)} target={id === "email" ? "_self" : "_blank"} rel="noreferrer"
                    onClick={() => setShareOpen(false)}
                    className="flex flex-col items-center gap-1.5 rounded-xl py-3 px-2 text-white text-xs font-semibold transition hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: bg }}>
                    <span className="text-lg leading-none">{icon}</span>
                    <span className="text-[10px] font-bold">{label}</span>
                  </a>
                );
              })}
            </div>
            <button onClick={() => { handleNativeShare(); setShareOpen(false); }}
              className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition">
              ⋯ More / Device Share
            </button>
          </div>
        </div>
      )}

      {/* ── LinkedIn preview ── */}
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
                  <p className="text-sm leading-6 text-slate-800 whitespace-pre-line">{`${article.title}\n\n${article.description?.slice(0, 300) ?? ""}\n\n🔗 ${canonicalUrl}\n\n#HuggingFace #OxyNews`}</p>
                </div>
                {showImg && <img src={article.image} alt="" className="w-full aspect-[1.91/1] object-cover" />}
                <div className="border-t border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">Hugging Face</p>
                  <p className="mt-1 text-sm font-bold text-slate-900 line-clamp-2">{article.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500 line-clamp-3">{article.description}</p>
                  <p className="mt-2 text-[11px] text-violet-600 font-semibold truncate">{canonicalUrl}</p>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-blue-50 border border-blue-200 p-3">
                <p className="text-xs leading-5 text-blue-800"><strong>Tip:</strong> Copy the content below, then open LinkedIn and paste it into the composer.</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button type="button"
                  onClick={() => { navigator.clipboard.writeText(`${article.title}\n\n${article.description?.slice(0, 300) ?? ""}\n\n🔗 ${canonicalUrl}\n\n#HuggingFace #OxyNews`); setIsCopied(true); showToast("✅ Content copied!"); setTimeout(() => setIsCopied(false), 2500); }}
                  className={`rounded-xl border py-3 text-sm font-semibold transition ${ isCopied ? "bg-green-600 text-white border-green-600" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100" }`}>
                  {isCopied ? "✅ Copied!" : "📋 Copy Content"}
                </button>
                <button type="button"
                  onClick={() => { window.open(buildShare("linkedin"), "_blank", "noopener,noreferrer"); setLinkedinPreviewOpen(false); }}
                  className="rounded-xl bg-[#0A66C2] py-3 text-sm font-bold text-white hover:bg-[#004182] transition">
                  Open LinkedIn →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {copiedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] bg-slate-900/90 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg backdrop-blur-sm">
          {copiedToast}
        </div>
      )}

      <style>{`
        .hf-prose { font-size: 15px; line-height: 1.85; color: #1e293b; font-family: Georgia, serif; }
        .hf-prose h2 { font-size: 1.35rem; font-weight: 700; color: #0f172a; margin: 2em 0 0.6em; border-left: 4px solid #7c3aed; padding-left: 1rem; font-family: inherit; }
        .hf-prose h3 { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: 1.5em 0 0.4em; font-family: inherit; }
        .hf-prose h4 { font-size: 0.95rem; font-weight: 600; color: #334155; margin: 1.2em 0 0.3em; font-family: inherit; }
        .hf-prose p { margin-bottom: 1.1em; }
        .hf-prose a { color: #7c3aed; font-weight: 600; text-decoration: underline; text-decoration-color: #c4b5fd; text-underline-offset: 2px; word-break: break-word; }
        .hf-prose a:hover { color: #6d28d9; }
        .hf-prose img { max-width: 100%; max-height: 420px; width: auto; height: auto; border-radius: 10px; margin: 1.4em auto; display: block; border: 1px solid #f1f5f9; object-fit: contain; cursor: default; }
        .hf-prose figure { margin: 1.4em 0; text-align: center; }
        .hf-prose figcaption { font-size: 12px; color: #94a3b8; margin-top: 0.4em; font-style: italic; }
        .hf-prose pre { background: #0f172a; color: #e2e8f0; padding: 1rem 1.2rem; border-radius: 10px; overflow-x: auto; font-size: 13px; margin: 1.2em 0; line-height: 1.65; font-family: monospace; }
        .hf-prose code { background: #f3f4f6; color: #7c3aed; padding: 1px 5px; border-radius: 4px; font-size: 13px; font-family: monospace; }
        .hf-prose pre code { background: transparent; color: inherit; padding: 0; }
        .hf-prose ul, .hf-prose ol { padding-left: 1.4rem; margin-bottom: 1em; }
        .hf-prose li { margin-bottom: 0.4em; }
        .hf-prose table { width: 100%; border-collapse: collapse; margin: 1.4em 0; font-size: 13px; display: block; overflow-x: auto; }
        .hf-prose th { background: #f8fafc; font-weight: 700; padding: 8px 12px; border: 1px solid #e2e8f0; text-align: left; white-space: nowrap; }
        .hf-prose td { padding: 8px 12px; border: 1px solid #e2e8f0; vertical-align: top; }
        .hf-prose blockquote { border-left: 4px solid #7c3aed; padding: 0.5rem 1rem; color: #475569; font-style: italic; margin: 1.2em 0; background: #f5f3ff; border-radius: 0 8px 8px 0; }
        .hf-prose hr { border: none; border-top: 1px solid #f1f5f9; margin: 2em 0; }
        .hf-prose div:empty { display: none; }
      `}</style>
    </div>
  );
}
