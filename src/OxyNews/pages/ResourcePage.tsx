// src/pages/ResourcePage.tsx
import { Link, useParams } from "react-router-dom";
import { findResource } from "../data/resourceLinks";
import ExternalNewsList from "../components/ExternalNewsList";

function hostnameOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function ResourcePage() {
  const { categoryId, resourceId } = useParams<{ categoryId: string; resourceId: string }>();
  const { category, link } = findResource(categoryId ?? "", resourceId ?? "");

  if (!category || !link) {
    return (
      <div className="max-w-2xl mx-auto text-center py-24">
        <p className="font-display text-xl text-plum mb-2">Resource not found</p>
        <Link to="/oxynews" className="text-royal underline text-sm">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        to="/oxynews"
        className="text-xs font-mono uppercase tracking-widest text-royal hover:underline"
      >
        ← Back to home
      </Link>

      <div className="mt-4 pb-3 border-b-2 border-ink flex items-end justify-between gap-3 flex-wrap">
        <span className="bg-plum-dark text-paper text-[11px] font-mono uppercase tracking-widest px-2 py-1 rounded">
          {category.label}
        </span>
        <span className="text-[11px] font-mono uppercase tracking-widest text-ink-faint">
          {hostnameOf(link.url)}
        </span>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-display text-3xl sm:text-5xl font-semibold text-plum-dark leading-[1.05] max-w-4xl">
          {link.name}
        </h1>

        <a
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="focus-ring shrink-0 inline-flex items-center justify-center gap-1.5 bg-gold text-plum font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-gold-soft transition-colors"
        >
          Visit official site ↗
        </a>
      </div>

      {link.description && (
        <p className="mt-4 text-lg leading-relaxed text-ink-soft font-body">{link.description}</p>
      )}

      {link.newsSource && <ExternalNewsList sourceName={link.newsSource} />}
    </div>
  );
}
