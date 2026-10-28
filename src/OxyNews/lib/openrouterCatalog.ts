import { useEffect, useState } from "react";

/* ────────────────────────────────────────────────────────────────────────────
   Maps the model ids your rankings API returns
   (e.g. "anthropic/claude-opus-5.5-20260921") to the related model in
   OpenRouter's public catalog, so you can show name, description, price,
   context window and release date.

   Catalog:  GET https://openrouter.ai/api/v1/models   (public, no key needed)
   Each catalog entry has:
     id             "anthropic/claude-opus-5.5"            (short id)
     canonical_slug "anthropic/claude-opus-5.5-20260921"   (dated id)
   Your API ids normally match canonical_slug exactly, otherwise id.
   If you would rather not call OpenRouter from the browser, proxy this URL
   through your backend and point CATALOG_URL at that.
──────────────────────────────────────────────────────────────────────────── */

const CATALOG_URL = "https://openrouter.ai/api/v1/models";

export interface OrModel {
  id: string;
  canonical_slug?: string;
  name: string;
  created?: number; // unix seconds
  description?: string;
  context_length?: number;
  pricing?: { prompt?: string; completion?: string }; // USD per token, as strings
  architecture?: { input_modalities?: string[]; output_modalities?: string[] };
  top_provider?: { max_completion_tokens?: number | null };
}

export type Catalog = Map<string, OrModel>;

const norm = (s: string) => s.toLowerCase().trim();
const stripDate = (s: string) => s.replace(/-\d{8}$/, "");
const stripVariant = (s: string) => s.split(":")[0];
const flat = (s: string) => stripDate(stripVariant(norm(s))).replace(/[._]/g, "-");

function buildCatalog(list: OrModel[]): Catalog {
  const m: Catalog = new Map();
  if (Array.isArray(list)) {
    for (const x of list) {
      if (x && x.id) {
        m.set(norm(x.id), x);
        if (x.canonical_slug) m.set(norm(x.canonical_slug), x);
      }
    }
  }
  return m;
}

/** Find the catalog model for an id from your rankings API. Tries, in order:
 *  exact (dated or short) -> without ":variant" -> without date suffix ->
 *  loose match ignoring "." vs "-" (claude-opus-4.5 vs claude-opus-4-5). */
export function resolveModel(catalog: Catalog, raw: string): OrModel | undefined {
  if (!catalog || !raw) return undefined;
  const r = norm(raw);
  const tries = [r, stripVariant(r), stripDate(r), stripDate(stripVariant(r))];
  for (const t of tries) {
    const hit = catalog.get(t);
    if (hit) return hit;
  }
  const f = flat(raw);
  const values = Array.from(catalog.values());
  for (let i = 0; i < values.length; i++) {
    const x = values[i];
    if (flat(x.id) === f || (x.canonical_slug && flat(x.canonical_slug) === f)) {
      return x;
    }
  }
  return undefined;
}

let catalogCache: Promise<Catalog> | null = null;
function loadCatalog(): Promise<Catalog> {
  if (!catalogCache) {
    catalogCache = fetch(CATALOG_URL)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(j => buildCatalog(j.data as OrModel[]))
      .catch(e => { catalogCache = null; throw e; });
  }
  return catalogCache;
}

/** catalog is null while loading or if the call failed (pages should still render). */
export function useModelCatalog() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  useEffect(() => {
    let live = true;
    loadCatalog()
      .then(c => { if (live) setCatalog(c); })
      .catch(() => {});
    return () => { live = false; };
  }, []);
  return { catalog };
}

// ── Formatters ───────────────────────────────────────────────────────────────
export function perMillion(p?: string): string {
  const n = Number(p);
  if (p === undefined || p === "" || !isFinite(n) || n < 0) return "—";
  if (n === 0) return "Free";
  const v = n * 1e6;
  return `$${v >= 10 ? v.toFixed(0) : v.toFixed(2).replace(/\.?0+$/, "")}`;
}

export function fmtContext(n?: number): string {
  if (!n) return "—";
  return n >= 1e6 ? `${+(n / 1e6).toFixed(2)}M` : `${Math.round(n / 1000)}K`;
}

export function fmtDate(sec?: number): string {
  if (!sec) return "—";
  return new Date(sec * 1000).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}


