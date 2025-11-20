import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Config";

interface StoreAgent {
  agentId: string;
  agentName: string;
  agentCreatorName?: string | null;
  agentStatus?: string | null;
}

interface AiStore {
  id: string | null;
  storeName: string;
  description: string;
  storeCreatedBy: string;
  storeId: string;
  status: string | null;
  agentDetailsOnAdUser?: StoreAgent[];
}

const AllAIStores: React.FC = () => {
  const [stores, setStores] = useState<AiStore[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // ✅ Support both keys: "accessToken" (user) or "token" (admin style)
  const rawToken =
    localStorage.getItem("accessToken") || localStorage.getItem("token") || "";

  // Detect sandbox vs prod (same logic as admin page)
  const isSandbox = window.location.href.includes("sandbox");
  const baseAiStoreDomain = isSandbox
    ? "https://www.sandbox.askoxy.ai"
    : "http://www.localhost:3000";

  const aiStorePrefix = `${baseAiStoreDomain}/ai-store/`;

  const slugify = (text?: string | null): string =>
    text
      ? text
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "")
          .replace(/--+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 30) || "store"
      : "store";

  const buildPublicStoreUrl = (store: AiStore): string => {
    const slug = slugify(store.storeName);
    // 🔹 Public URL can still use storeId (backend requirement)
    return `${aiStorePrefix}${store.storeId}/${slug}`;
  };

  const fetchStores = async () => {
    setLoading(true);
    setError(null);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (rawToken) {
        headers.Authorization = `Bearer ${rawToken}`;
      }

      const res = await fetch(
        `${BASE_URL}/ai-service/agent/getAiStoreAllAgents`,
        {
          method: "GET",
          headers,
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch AI Stores");
      }

      const result = await res.json();

      const data = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
        ? result.data
        : result
        ? [result]
        : [];

      const validStores: AiStore[] = (data as AiStore[]).filter(
        (s) => s && s.storeId
      );

      setStores(validStores);
    } catch (err) {
      console.error(err);
      setError("Unable to load AI Stores. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // ✅ Only Store Name in URL, storeId passed via state
  const handleOpenDetails = (store: AiStore) => {
    const slug = slugify(store.storeName);
    navigate(`/ai-store/${slug}/public`, {
      state: { storeId: store.storeId },
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
              Bharat AI Store
            </p>
            <h1 className="mt-2 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300 bg-clip-text text-3xl font-semibold text-transparent md:text-4xl">
              All AI Stores
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Explore curated collections of AI Agents created by our community.
              Tap any store card to view all agents inside that AI Store.
            </p>
          </div>

          <div className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-xs text-slate-300 shadow-md">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
            {stores.length > 0
              ? `${stores.length} AI Stores live`
              : "AI Stores loading..."}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-400 border-t-transparent"></div>
            <span className="ml-3 text-sm text-slate-300">
              Fetching AI Stores...
            </span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && stores.length === 0 && (
          <div className="mt-10 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-center text-slate-300">
            No AI Stores found yet. Please check back later.
          </div>
        )}

        {/* Store Cards – web + mobile responsive */}
        {!loading && !error && stores.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => {
              const agentCount = store.agentDetailsOnAdUser?.length || 0;
              const publicUrl = buildPublicStoreUrl(store);

              return (
                <div
                  key={store.storeId}
                  className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-4 shadow-lg shadow-black/40 transition-transform hover:-translate-y-1 hover:border-violet-500/70 hover:shadow-violet-900/40"
                  onClick={() => handleOpenDetails(store)}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-violet-500 via-fuchsia-400 to-amber-300 opacity-60"></div>

                  <div className="mb-3 flex items-start justify-between gap-2">
                    <h2 className="text-base font-semibold text-slate-50 line-clamp-2">
                      {store.storeName || "Untitled AI Store"}
                    </h2>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300">
                      {store.storeCreatedBy || "Creator"}
                    </span>
                  </div>

                  <p className="mb-4 line-clamp-3 text-xs text-slate-300">
                    {store.description ||
                      "Curated collection of AI Agents crafted for real-world use cases."}
                  </p>

                  <div className="mb-4 flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
                      {agentCount} Agent{agentCount !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                    {/* Hint: card itself opens details */}
                    <span className="text-[10px] text-slate-400">
                      Tap card to view store
                    </span>

                    <a
                      href={publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-[11px] font-medium text-slate-200 hover:border-violet-500 hover:text-violet-200"
                    >
                      Open Public URL
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAIStores;
