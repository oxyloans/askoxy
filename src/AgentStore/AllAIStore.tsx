import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../Config";

interface StoreAgent {
  agentId: string;
  agentName: string;
  agentCreatorName?: string | null;
  agentStatus?: string | null;
  hideAgent?: boolean;
}

interface StoreDetail {
  id: string | null;
  storeName: string;
  description: string;
  storeCreatedBy: string;
  storeId: string;
  status: string | null;
  agentDetailsOnAdUser?: StoreAgent[];
}

interface StoreLocationState {
  storeId?: string;
}

const AllAIStore: React.FC = () => {
  // ✅ Only slug + type in URL (no storeId)
  const { storeSlug, type } = useParams<{ storeSlug: string; type: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const { storeId: storeIdFromState } =
    (location.state as StoreLocationState | null) || {};

  // 👇 This is what we actually use for API
  const effectiveStoreId = storeIdFromState || "";

  const [store, setStore] = useState<StoreDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  // ✅ Same token logic
  const rawToken =
    localStorage.getItem("accessToken") || localStorage.getItem("token") || "";

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

  // ✅ Use FULL storeId in public URL (no slice)
  const buildPublicStoreUrl = (detail: StoreDetail | null): string | null => {
    if (!detail?.storeId) return null;
    const slug = slugify(detail.storeName);
    return `${aiStorePrefix}${detail.storeId}/${slug}`;
  };

  const fetchStoreDetails = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log(
        "AllAIStore → effectiveStoreId from location.state (FULL, no slice):",
        id
      );

      const url = `${BASE_URL}/ai-service/agent/getAllStoreDataByStoreId/${id}`;

      console.log("AllAIStore → FINAL URL:", url);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (rawToken) {
        headers.Authorization = `Bearer ${rawToken}`;
      }

      const res = await fetch(url, {
        method: "GET",
        headers,
      });

      if (!res.ok) {
        throw new Error(`Failed to load store details (status ${res.status})`);
      }

      const json = await res.json();

      let detail: StoreDetail | null = null;

      if (Array.isArray(json)) {
        detail = json[0] || null;
      } else if (json?.data) {
        detail = Array.isArray(json.data) ? json.data[0] : json.data;
      } else {
        detail = json;
      }

      if (!detail || !detail.storeId) {
        throw new Error("Invalid store data");
      }

      setStore(detail);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unable to load this AI Store");
      setStore(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!effectiveStoreId) {
      // No storeId in state → user opened URL directly
      setStore(null);
      setError(
        "Missing Store ID. Please open this AI Store from the All AI Stores page."
      );
      setLoading(false);
      return;
    }

    fetchStoreDetails(effectiveStoreId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveStoreId]);

  

  const visibleAgents = useMemo(() => {
    const list = store?.agentDetailsOnAdUser || [];
    // Bharat AI Store rule: hideAgent = false → show (undefined also show)
    return list.filter(
      (a) => a && (a.hideAgent === undefined || a.hideAgent === false)
    );
  }, [store]);

  const filteredAgents = useMemo(() => {
    if (!search.trim()) return visibleAgents;
    const q = search.toLowerCase();
    return visibleAgents.filter((a) =>
      a.agentName?.toLowerCase().includes(q)
    );
  }, [visibleAgents, search]);

  const publicStoreUrl = buildPublicStoreUrl(store);
  const agentCount = visibleAgents.length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between gap-3">

          {type && (
            <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-slate-400">
              {type}
            </span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
            <p className="mt-3 text-sm text-slate-300">Loading AI Store...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-4 text-sm text-red-100">
            {error}
          </div>
        )}

        {/* Not found */}
        {!loading && !error && !store && (
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-6 text-center text-slate-300">
            AI Store not found.
          </div>
        )}

        {/* Main content */}
        {!loading && !error && store && (
          <>
            {/* Store header */}
            <div className="mb-8 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-950/90 p-5 shadow-xl shadow-black/50">
              <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                <div className="flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-violet-300">
                    Bharat AI Store
                  </p>
                  <h1 className="mt-2 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300 bg-clip-text text-2xl font-semibold text-transparent md:text-3xl">
                    {store.storeName}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm text-slate-200">
                    {store.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                    <span className="rounded-full bg-slate-900/90 px-3 py-1">
                      Created by:{" "}
                      <span className="font-semibold text-slate-50">
                        {store.storeCreatedBy}
                      </span>
                    </span>

                    <span className="rounded-full bg-slate-900/90 px-3 py-1">
                      Store ID:{" "}
                      <span className="font-mono text-slate-100">
                        {store.storeId}
                      </span>
                    </span>

                    <span className="rounded-full bg-slate-900/90 px-3 py-1">
                      {agentCount} Agent{agentCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4">
                  {publicStoreUrl && (
                    <a
                      href={publicStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-amber-300 px-4 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-violet-900/40"
                    >
                      Open Public Store
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Search + stats */}
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <input
                type="text"
                placeholder="Search agents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
              />

              <div className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-300">
                Showing {filteredAgents.length} of {agentCount}
              </div>
            </div>

            {/* Agents grid */}
            {agentCount === 0 ? (
              <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/70 p-8 text-center text-sm text-slate-300">
                No agents added to this store yet.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAgents.map((agent) => {
                  const initials =
                    agent.agentName
                      ?.split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "AI";

                  const isActive = agent.agentStatus === "ACTIVE";

                  return (
                    <div
                      key={agent.agentId}
                      className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-md shadow-black/40 transition hover:-translate-y-1 hover:border-violet-500/70"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white">
                          {initials}
                        </div>

                        <div className="flex-1">
                          <h2 className="text-sm font-semibold text-slate-50 line-clamp-2">
                            {agent.agentName}
                          </h2>
                          <p className="text-[11px] text-slate-400">
                            {agent.agentCreatorName || "AI Agent"}
                          </p>
                        </div>
                      </div>

                      <div className="mb-3 flex items-center justify-between text-[11px] text-slate-400">
                        <span>
                          ID:{" "}
                          <span className="font-mono text-slate-100">
                            {agent.agentId.slice(-6)}
                          </span>
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${
                            isActive
                              ? "bg-emerald-500/15 text-emerald-300"
                              : "bg-slate-700/40 text-slate-300"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isActive ? "bg-emerald-400" : "bg-slate-400"
                            }`}
                          />
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="mt-auto rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-2 text-xs font-semibold text-white shadow-md"
                      >
                        Launch Agent
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllAIStore;
