import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import type { NewsFeedItem, Opportunity, PaperclipDetail } from "../types";
import ArticleCard, { isDisplayableArticle } from "../components/ArticleCard";
import OpportunityMeter from "../components/OpportunityMeter";
import { useChatContext } from "../components/ChatContext";

const OPPORTUNITY_LABELS: Record<string, string> = {
  revenue: "Revenue",
  partnership: "Partnership",
  sales: "Sales",
  startup: "Startup",
  ai: "AI",
  investment: "Investment",
  compliance: "Compliance",
  career: "Career",
};

function StarBar({ stars }: { stars: number }) {
  const s = Math.max(0, Math.min(5, stars));
  return (
    <span className="text-gold text-sm tracking-tight shrink-0" aria-label={`${s} of 5`}>
      {"★".repeat(s)}
      <span className="text-ink/15">{"★".repeat(5 - s)}</span>
    </span>
  );
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.4" />
      <path d="M4.5 20c1.2-3.8 4.4-6 7.5-6s6.3 2.2 7.5 6" strokeLinecap="round" />
    </svg>
  );
}

function CompanyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="3.5" width="11" height="17" rx="1" />
      <path d="M15 20V9l5 2v9" />
      <path d="M7.5 7h1.5M7.5 10h1.5M7.5 13h1.5M7.5 16h1.5" strokeLinecap="round" />
    </svg>
  );
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const header = document.querySelector("div.sticky.top-0");
  const headerHeight = header ? header.getBoundingClientRect().height : 0;
  const quickNav = document.querySelector(".article-quick-nav");
  const quickNavHeight = quickNav ? quickNav.getBoundingClientRect().height : 0;
  const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - quickNavHeight - 16;
  window.scrollTo({ top, behavior: "smooth" });
  el.classList.add("scroll-highlight");
  setTimeout(() => el.classList.remove("scroll-highlight"), 1600);
}

function todayDateline() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<PaperclipDetail | null>(null);
  const [related, setRelated] = useState<NewsFeedItem[]>([]);
  const [feedItems, setFeedItems] = useState<NewsFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { openChat } = useChatContext();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    api
      .getPaperclip(id)
      .then(setItem)
      .catch(() => setError("Couldn't load this article."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!item) return;
    api
      .getFeed({ sort: "trending", page: 0, size: 6 })
      .then((res) =>
        setRelated(
          res.content
            .filter((i) => i.paperclipId !== item.paperclipId)
            .filter(isDisplayableArticle)
        )
      )
      .catch(() => setRelated([]));
    // Also fetch a larger slice of the feed so we can compute prev/next navigation.
    api.getFeed({ sort: "latest", page: 0, size: 200 })
      .then((res) => setFeedItems(res.content.filter(isDisplayableArticle)))
      .catch(() => setFeedItems([]));
  }, [item]);

  const navigate = useNavigate();

  function goToArticle(id: string | undefined | null) {
    if (!id) return;
    navigate(`/article/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (loading) {
    return (
      <div className="text-center py-24 text-ink-faint font-mono text-sm tracking-wide">
        Loading article...
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="text-center py-24">
        <p className="font-display text-xl text-plum mb-2">{error || "Article not found"}</p>
        <Link to="/oxynews" className="text-royal underline text-sm">
          Back to the feed
        </Link>
      </div>
    );
  }

  const a = item.analysis;
  const c = a?.classification;
  const s = a?.summary;
  const oa = a?.opportunityAssessment;

  const hasPeople = (a?.people?.length ?? 0) > 0;
  const hasCompanies = (a?.companies?.length ?? 0) > 0;
  const hasPeopleOrCompanies = hasPeople || hasCompanies;

  const opportunityByKey = oa as unknown as Record<string, Opportunity> | undefined;

  const showQuickNav =
    hasPeopleOrCompanies ||
    !!a?.serviceRecommendations?.length ||
    !!a?.stakeholderPerspectives?.length ||
    related.length > 0;

  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 lg:px-0">
      {showQuickNav && (
        <>
          <div
            className="article-quick-nav hidden lg:flex sticky top-[96px] inset-x-0 z-30 mx-auto w-full max-w-6xl items-center justify-between gap-3 rounded-full bg-plum/95 px-4 py-3 shadow-xl ring-1 ring-white/10 backdrop-blur-md"
          >
            {hasPeopleOrCompanies && (
              <button
                type="button"
                onClick={() => scrollToSection("people-companies")}
                className="bg-royal/90 text-paper px-3 py-2 rounded-full shadow-sm font-mono text-xs uppercase tracking-wide hover:bg-royal transition-colors focus-ring"
              >
                People &amp; Companies
              </button>
            )}
            {a?.serviceRecommendations && a.serviceRecommendations.length > 0 && (
              <button
                type="button"
                onClick={() => scrollToSection("services")}
                className="bg-gold text-plum px-3 py-2 rounded shadow font-mono text-xs uppercase tracking-wide hover:bg-gold-soft transition-colors focus-ring"
              >
                OxyGroup recommendations
              </button>
            )}
            {a?.stakeholderPerspectives && a.stakeholderPerspectives.length > 0 && (
              <button
                type="button"
                onClick={() => scrollToSection("stakeholders")}
                className="bg-royal/80 text-paper px-3 py-2 rounded shadow font-mono text-xs uppercase tracking-wide hover:bg-royal transition-colors focus-ring"
              >
                Stakeholder perspectives
              </button>
            )}
            {related.length > 0 && (
              <button
                type="button"
                onClick={() => scrollToSection("related-articles")}
                className="bg-ink/95 text-paper px-3 py-2 rounded shadow font-mono text-xs uppercase tracking-wide hover:bg-ink transition-colors focus-ring"
              >
                Related articles
              </button>
            )}
          </div>
          <div className="hidden lg:block" style={{ height: 32 }} />
        </>
      )}

      <article className="min-w-0 w-full">
        <div className="flex items-center justify-between">
          <Link
            to="/oxynews"
            className="text-xs font-mono uppercase tracking-widest text-royal hover:underline"
          >
            ← Back to the feed
          </Link>

          <div className="flex items-center gap-2">
            {/* Prev / Next buttons */}
            {(() => {
              const idx = feedItems.findIndex((f) => f.paperclipId === item.paperclipId);
              const prev = idx > 0 ? feedItems[idx - 1] : null;
              const next = idx >= 0 && idx < feedItems.length - 1 ? feedItems[idx + 1] : null;
              return (
                <>
                  <button
                    type="button"
                    onClick={() => goToArticle(prev?.paperclipId)}
                    disabled={!prev}
                    className="focus-ring inline-flex items-center gap-2 rounded-full border border-paper/20 bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-plum shadow-sm hover:bg-white disabled:opacity-50"
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => goToArticle(next?.paperclipId)}
                    disabled={!next}
                    className="focus-ring inline-flex items-center gap-2 rounded-full border border-paper/20 bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-plum shadow-sm hover:bg-white disabled:opacity-50"
                  >
                    Next →
                  </button>
                </>
              );
            })()}
          </div>
        </div>

        {/* Masthead strip: section flag + dateline */}
        <div className="mt-4 pb-3 border-b-2 border-ink flex items-end justify-between gap-3 flex-wrap">
          <div className="flex flex-wrap items-center gap-2">
            {c?.domain && c.domain !== "General" && (
              <span className="bg-plum-dark text-paper text-[11px] font-mono uppercase tracking-widest px-2 py-1 rounded">
                {c.domain}
              </span>
            )}
            {c?.subDomain && c.subDomain !== "General" && (
              <span className="text-xs text-ink-faint font-mono uppercase tracking-wide">
                {c.subDomain}
              </span>
            )}
            {c?.category && c.category !== "General" && (
              <span className="bg-royal text-paper text-[11px] font-mono px-2 py-1 rounded">
                {c.category}
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-ink-faint">
            {todayDateline()}
          </span>
        </div>

        <div className="flex items-start justify-between gap-3 mt-4">
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-semibold text-plum-dark leading-[1.05]">
            {a?.articleName || item.fileName || "Untitled article"}
          </h1>
          <button
            type="button"
            onClick={openChat}
            className="focus-ring shrink-0 inline-flex items-center gap-1.5 rounded-full bg-gold text-plum font-semibold text-xs px-3 py-2 shadow hover:bg-gold-soft transition-colors mt-1"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Ask article
          </button>
        </div>

        {c?.topic && c.topic !== "General" && (
          <p className="text-sm text-ink-faint mt-2 font-mono uppercase tracking-wide">{c.topic}</p>
        )}

        {/* Same quick-nav buttons, shown as a grid on mobile with two buttons per row */}
        {showQuickNav && (
          <div className="lg:hidden mt-4 -mx-4 px-4 grid grid-cols-2 gap-2">
            {hasPeopleOrCompanies && (
              <button
                type="button"
                onClick={() => scrollToSection("people-companies")}
                className="bg-royal/90 text-paper px-3 py-2 rounded shadow font-mono text-xs uppercase tracking-wide"
              >
                People &amp; Companies
              </button>
            )}
            {a?.serviceRecommendations && a.serviceRecommendations.length > 0 && (
              <button
                type="button"
                onClick={() => scrollToSection("services")}
                className="bg-gold text-plum px-3 py-2 rounded shadow font-mono text-xs uppercase tracking-wide"
              >
                OxyGroup recommendations
              </button>
            )}
            {a?.stakeholderPerspectives && a.stakeholderPerspectives.length > 0 && (
              <button
                type="button"
                onClick={() => scrollToSection("stakeholders")}
                className="bg-royal/80 text-paper px-3 py-2 rounded shadow font-mono text-xs uppercase tracking-wide"
              >
                Stakeholder perspectives
              </button>
            )}
            {related.length > 0 && (
              <button
                type="button"
                onClick={() => scrollToSection("related-articles")}
                className="bg-ink/95 text-paper px-3 py-2 rounded shadow font-mono text-xs uppercase tracking-wide"
              >
                Related articles
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 mt-5 py-3 border-y border-ink/15 flex-wrap">
          <OpportunityMeter score={oa?.overallScore} size={48} strokeWidth={5} />
          <div className="leading-tight flex-1 min-w-0">
            <div className="text-xs font-mono uppercase tracking-widest text-ink-faint">
              By OxyGroup AI Analysis
            </div>
            <div className="text-sm text-ink-soft">Opportunity signal</div>
          </div>
          {item?.blogUrl && (
            <a
              href={item.blogUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center justify-center gap-1.5 bg-gold text-plum font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-gold-soft transition-colors"
            >
              AskOxyBlog ↗
            </a>
          )}
        </div>

        {c?.tags && c.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {c.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono bg-ink/5 text-ink-soft px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {s?.shortSummary && (
          <p className="mt-6 text-lg lg:text-xl leading-relaxed text-ink-soft font-body first-letter:font-display first-letter:text-6xl first-letter:font-semibold first-letter:text-plum-dark first-letter:float-left first-letter:mr-2 first-letter:leading-[0.85]">
            {s.shortSummary}
          </p>
        )}

        {s?.detailedSummary && (
          <section className="mt-8">
            <h2 className="font-display font-semibold text-plum text-sm uppercase tracking-widest border-b border-ink/20 pb-2 mb-3">
              Executive Analysis
            </h2>
            <p className="text-sm text-ink-soft leading-relaxed whitespace-pre-line lg:columns-3 lg:gap-10 sm:columns-2 sm:gap-8">
              {s.detailedSummary}
            </p>
          </section>
        )}

        {s?.keyPoints && s.keyPoints.length > 0 && (
          <section className="mt-8">
            <h2 className="font-display font-semibold text-plum text-sm uppercase tracking-widest border-b border-ink/20 pb-2 mb-3">
              Key points
            </h2>
            <ul className="space-y-2 border-l-2 border-gold pl-4 lg:columns-2 lg:gap-8">
              {s.keyPoints.map((k, i) => (
                <li key={i} className="text-sm text-ink-soft leading-relaxed break-inside-avoid">
                  {k}
                </li>
              ))}
            </ul>
          </section>
        )}

        {s?.actionItems && s.actionItems.length > 0 && (
          <section className="mt-8 bg-ink/[0.03] rounded-lg p-5 border border-ink/10">
            <h2 className="font-display font-semibold text-plum text-sm uppercase tracking-widest mb-3">
              Recommended next steps
            </h2>
            <ul className="space-y-2 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-2 lg:space-y-0">
              {s.actionItems.map((k, i) => (
                <li key={i} className="text-sm text-ink-soft leading-relaxed flex gap-2">
                  <span className="font-mono text-gold-dim shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  {k}
                </li>
              ))}
            </ul>
          </section>
        )}

        {a?.stakeholderPerspectives && a.stakeholderPerspectives.length > 0 && (
          <section id="stakeholders" className="mt-10">
            <h2 className="font-display text-xl font-semibold text-plum-dark mb-4 border-b-2 border-ink pb-2">
              Stakeholder perspectives
            </h2>
            <div className="bg-white rounded-lg shadow-card p-4 divide-y divide-ink/10">
              {a.stakeholderPerspectives.map((p, i) => (
                <div key={i} className={i === 0 ? "pb-4" : "py-4"}>
                  <h3 className="text-sm font-semibold text-royal uppercase tracking-wide font-mono">
                    {p.stakeholder}
                  </h3>
                  <p className="text-sm text-plum font-medium mt-1">{p.headline}</p>
                  <p className="text-sm text-ink-soft mt-1 leading-relaxed">{p.angle}</p>

                  {p.relevantOpportunities && p.relevantOpportunities.length > 0 && (
                    <div className="grid gap-2 mt-3 sm:grid-cols-2 lg:grid-cols-3">
                      {p.relevantOpportunities.map((key) => {
                        const o = opportunityByKey?.[key];
                        if (!o) return null;
                        return (
                          <div key={key} className="bg-ink/[0.03] border border-ink/10 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-xs font-mono uppercase tracking-widest text-plum">
                                {OPPORTUNITY_LABELS[key] ?? key}
                              </h4>
                              <StarBar stars={o.stars} />
                            </div>
                            {o.reason && (
                              <p className="text-xs text-ink-soft leading-relaxed">{o.reason}</p>
                            )}
                            {o.opportunities?.length > 0 && (
                              <ul className="mt-2 space-y-1">
                                {o.opportunities.map((op, oi) => (
                                  <li key={oi} className="text-xs text-ink-faint">
                                    • {op}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {a?.serviceRecommendations && a.serviceRecommendations.length > 0 && (
          <section id="services" className="mt-10">
            <h2 className="font-display text-xl font-semibold text-plum-dark mb-4 border-b-2 border-ink pb-2">
              OxyGroup service fit
            </h2>
            <div className="bg-white rounded-lg shadow-card p-4 grid lg:grid-cols-2 lg:gap-x-6 divide-y divide-ink/10 lg:divide-y-0">
              {a.serviceRecommendations.map((rec, i) => (
                <div key={i} className={`lg:border-b lg:border-ink/10 lg:pb-4 ${i === 0 ? "pb-4" : "py-4"}`}>
                  <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
                    <h3 className="font-display font-semibold text-plum">{rec.service}</h3>
                    <span className="text-[11px] font-mono uppercase text-ink-faint">
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-xs text-ink-soft mb-2">{rec.businessImpact}</p>
                  <ul className="space-y-1">
                    {rec.actionItems.map((it, j) => (
                      <li key={j} className="text-xs text-ink-faint">
                        • {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {hasPeopleOrCompanies && (
          <section id="people-companies" className="mt-10 mb-16">
            <h2 className="font-display text-xl font-semibold text-plum-dark mb-4 border-b-2 border-ink pb-2">
              People &amp; Companies
            </h2>
            <div
              className={`bg-white rounded-lg shadow-card grid ${
                hasPeople && hasCompanies ? "sm:grid-cols-2 sm:divide-x" : "grid-cols-1"
              } divide-ink/10`}
            >
              {hasPeople && (
                <div className="p-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-ink-faint mb-3">
                    People
                  </h3>
                  <div className="divide-y divide-ink/10 lg:columns-2 lg:gap-8 lg:divide-y-0">
                    {a!.people!.map((p, i) => (
                      <div key={i} className="flex flex-col gap-2 py-3 first:pt-0 sm:flex-row sm:items-start sm:justify-between break-inside-avoid lg:border-b lg:border-ink/10 lg:pb-3">
                        <div className="flex items-start gap-2 min-w-0">
                          <span className="mt-0.5 text-royal shrink-0">
                            <PersonIcon />
                          </span>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-ink-soft truncate">{p.name}</div>
                            <div className="text-xs text-ink-faint truncate">
                              {p.designation && <>{p.designation}{p.company ? ", " : ""}</>}
                              {p.company && <>{p.company}</>}
                            </div>
                          </div>
                        </div>
                        {p.linkedin && (
                          <a
                            href={p.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-royal hover:underline mt-1 sm:mt-0 shrink-0"
                          >
                            LinkedIn ↗
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasCompanies && (
                <div className="p-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-ink-faint mb-3">
                    Companies
                  </h3>
                  <div className="divide-y divide-ink/10 lg:columns-2 lg:gap-8 lg:divide-y-0">
                    {a!.companies!.map((c2, i) => (
                      <div key={i} className="flex flex-col gap-2 py-3 first:pt-0 sm:flex-row sm:items-center sm:justify-between break-inside-avoid lg:border-b lg:border-ink/10 lg:pb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-royal shrink-0">
                            <CompanyIcon />
                          </span>
                          <div className="min-w-0 text-sm font-medium text-ink-soft truncate">{c2.name}</div>
                        </div>
                        {c2.website && (
                          <a
                            href={c2.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-royal hover:underline mt-1 sm:mt-0 shrink-0 break-all"
                          >
                            {c2.website.replace(/^https?:\/\//, "")} ↗
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

        {related.length > 0 && (
          <section id="related-articles" className="mt-10 mb-16">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold text-plum-dark">Related articles</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((rel) => (
                <motion.div
                  key={rel.paperclipId}
                  whileHover={{ y: -4 }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <ArticleCard item={rel} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 flex flex-col gap-3 border-t border-ink/10 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-ink-faint font-mono">Continue reading</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(() => {
                const idx = feedItems.findIndex((f) => f.paperclipId === item.paperclipId);
                const prev = idx > 0 ? feedItems[idx - 1] : null;
                const next = idx >= 0 && idx < feedItems.length - 1 ? feedItems[idx + 1] : null;
                return (
                  <>
                    <button
                      type="button"
                      onClick={() => goToArticle(prev?.paperclipId)}
                      disabled={!prev}
                      className="focus-ring inline-flex items-center gap-2 rounded-full border border-paper/20 bg-white/95 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-plum shadow-sm hover:bg-white disabled:opacity-50"
                    >
                      ← Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => goToArticle(next?.paperclipId)}
                      disabled={!next}
                      className="focus-ring inline-flex items-center gap-2 rounded-full border border-paper/20 bg-white/95 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-plum shadow-sm hover:bg-white disabled:opacity-50"
                    >
                      Next →
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </article>

      {showBackToTop && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-3">
          <button
            type="button"
            onClick={openChat}
            aria-label="Ask about this article"
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold text-plum shadow-2xl shadow-gold/30 transition hover:bg-yellow-300 focus-ring"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 rounded-full bg-royal text-paper px-4 py-3 shadow-2xl shadow-royal/20 transition hover:bg-royal/90 focus-ring"
          >
            ↑ Top
          </button>
        </div>
      )}
    </div>
  );
}