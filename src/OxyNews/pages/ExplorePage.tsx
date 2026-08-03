import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import type { CategoryCount, NewsFeedItem } from "../types";
import ArticleCard, { isDisplayableArticle } from "../components/ArticleCard";

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const [searchTerm, setSearchTerm] = useState(initialQ);
  const [results, setResults] = useState<NewsFeedItem[]>([]);
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (initialQ) runSearch(initialQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function runSearch(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    api
      .search(q.trim())
      .then((res) => setResults(res.content))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchParams({ q: trimmed });
    runSearch(trimmed);
    setQuery("");
  }

  const visibleResults = results.filter(isDisplayableArticle);

  const grouped = categories.reduce<Record<string, CategoryCount[]>>((acc, c) => {
    const key = c.domain || "General";
    acc[key] = acc[key] ? [...acc[key], c] : [c];
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-plum mb-4">Explore</h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row max-w-xl">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="flex-1 bg-white border border-ink/15 rounded-full px-5 py-2.5 text-sm focus-ring"
          />
          <button
            type="submit"
            className="focus-ring px-6 py-2.5 rounded-full bg-plum text-gold font-medium text-sm hover:bg-plum-dark transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {searched && (
        <section className="mb-10">
          <h2 className="font-display text-lg font-semibold text-plum mb-3">
            {loading ? "Searching..." : `Results for "${searchTerm}"`}
          </h2>
          {!loading && visibleResults.length === 0 && (
            <p className="text-sm text-ink-faint">
              Nothing matched that search. Try a broader term.
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleResults.map((item) => (
              <ArticleCard key={item.paperclipId} item={item} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display text-lg font-semibold text-plum mb-4">
          Browse by domain
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(grouped).map(([domain, cats]) => (
            <div key={domain} className="bg-white rounded-lg shadow-card p-4">
              <h3 className="font-display font-semibold text-plum mb-2">{domain}</h3>
              <div className="flex flex-wrap gap-1.5">
                {cats.map((c) => (
                  <span
                    key={c.category}
                    className="text-xs font-mono bg-royal/8 text-royal px-2 py-1 rounded"
                  >
                    {c.category || "General"} · {c.count}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(grouped).length === 0 && (
            <p className="text-sm text-ink-faint">No categories yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
