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
    <div className="max-w-2xl mx-auto px-1">
      <Link
        to="/oxynews"
        className="text-xs font-mono uppercase tracking-widest text-royal hover:underline"
      >
        ← Back to home
      </Link>

      <div className="mt-4 pb-3 border-b-2 border-ink flex flex-wrap items-end justify-between gap-2">
        <span className="bg-plum-dark text-paper text-[11px] font-mono uppercase tracking-widest px-2 py-1 rounded">
          {category.label}
        </span>
        <span className="text-[11px] font-mono uppercase tracking-widest text-ink-faint">
          {hostnameOf(link.url)}
        </span>
      </div>

      <div className="mt-6">
        <h1 className="font-display text-2xl sm:text-4xl font-semibold text-plum-dark leading-[1.05]">
          {link.name}
        </h1>
      </div>

      {link.description && (
        <p className="mt-4 text-lg leading-relaxed text-ink-soft font-body">{link.description}</p>
      )}

      {link.newsSource && <ExternalNewsList sourceName={link.newsSource} />}
    </div>
  );
}
