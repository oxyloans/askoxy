import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../Config";

interface StoreAgent {
  agentId: string;
  agentName: string;
  agentCreatorName?: string | null;
  agentStatus?: string | null;
  hideAgent?: boolean;
  imageUrl?: string | null; // ← Added
  assistantId?: string | null;
}

interface StoreDetail {
  id: string | null;
  storeName: string;
  description: string | null;
  storeCreatedBy: string;
  storeId: string;
  status: string | null;
  storeImageUrl?: string | null;
  agentDetailsOnAdUser?: StoreAgent[];
}

interface StoreLocationState {
  storeId?: string;
}

const AllAIStore: React.FC = () => {
  const { storeSlug } = useParams<{ storeSlug: string }>(); // Get slug from URL
  const location = useLocation();
  const storeIdFromState =
    (location.state as StoreLocationState)?.storeId || "";
  const navigate = useNavigate();

const [effectiveStoreId, setEffectiveStoreId] = useState<string>("");
  const [store, setStore] = useState<StoreDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const accessToken = localStorage.getItem("accessToken") || "";
  const resolveStoreIdFromSlug = async (slug: string) => {
    try {
      const res = await fetch(
        `${BASE_URL}/ai-service/agent/getAiStoreAllAgents`,
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch stores");

      const result = await res.json();
      const stores = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
        ? result.data
        : [];

      // Find store where slugified name matches
      const normalizedSlug = slug.toLowerCase().replace(/-/g, " ");
      const foundStore = stores.find((s: any) => {
        const name = s.storeName?.toLowerCase() || "";
        const slugified = name.replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
        return slugified === slug || name.replace(/\s+/g, "-") === slug;
      });

      if (foundStore?.storeId) {
        setEffectiveStoreId(foundStore.storeId);
        return foundStore.storeId;
      } else {
        throw new Error("Store not found");
      }
    } catch (err) {
      setError("Store not found or unavailable");
      setLoading(false);
    }
  };

  // Main effect: Determine storeId
  useEffect(() => {
    if (storeIdFromState) {
      // Fast path: we have storeId from navigation state
      setEffectiveStoreId(storeIdFromState);
    } else if (storeSlug) {
      // Fallback: resolve from slug (shared link / refresh)
      resolveStoreIdFromSlug(storeSlug);
    } else {
      setError("No store specified");
      setLoading(false);
    }
  }, [storeIdFromState, storeSlug]);
  // Get 2-letter initials (first word first letter + second word first letter)
  const getInitials = useCallback((name: string): string => {
    if (!name?.trim()) return "AI";
    const words = name.trim().split(/\s+/);
    const first = words[0]?.[0]?.toUpperCase() || "";
    const second =
      words.length > 1
        ? words[1][0]?.toUpperCase()
        : words[0][1]?.toUpperCase() || first;
    return `${first}${second}`.substring(0, 2) || "AI";
  }, []);

  const getHueFromName = useCallback((name: string): number => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 360);
  }, []);

  // Dynamic Banner – Now supports real image + fallback initials
  const DynamicBanner: React.FC<{
    name: string;
    imageUrl?: string | null;
    size?: "large" | "small";
  }> = React.memo(({ name, imageUrl, size = "large" }) => {
    const initials = getInitials(name);
    const hue = getHueFromName(name);

    const sizeClasses = {
      large: "h-48 sm:h-56 md:h-64 lg:h-72",
      small: "h-36 sm:h-40 md:h-44",
    };

    const gradientStyle = useMemo(
      () => ({
        backgroundImage: `linear-gradient(135deg,
          hsl(${hue}, 75%, 55%) 0%,
          hsl(${(hue + 30) % 360}, 75%, 50%) 50%,
          hsl(${(hue + 60) % 360}, 75%, 45%) 100%)`,
      }),
      [hue]
    );

    // Only show image if imageUrl is valid and not null/empty
    const hasValidImage =
      imageUrl && imageUrl.trim() !== "" && imageUrl !== "null";

    // 🚫 Small Banner → Always show initials (never image)
    if (size === "small") {
      return (
        <div
          className={`relative ${sizeClasses[size]} w-full flex items-center justify-center text-white overflow-hidden rounded-t-xl sm:rounded-t-2xl`}
          style={gradientStyle}
        >
          <div className="text-6xl font-black opacity-40">{initials}</div>
        </div>
      );
    }

    // Large Banner → show image if valid
    if (hasValidImage) {
      return (
        <div
          className={`relative ${sizeClasses[size]} w-full overflow-hidden rounded-t-xl sm:rounded-t-2xl`}
        >
          <img
            src={imageUrl!}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
          <div
            className="hidden absolute inset-0 flex items-center justify-center text-white"
            style={gradientStyle}
          >
            <span className="text-8xl font-black opacity-50">{initials}</span>
          </div>
        </div>
      );
    }

    // Default: Beautiful gradient + initials
    return (
      <div
        className={`relative ${sizeClasses[size]} w-full flex items-center justify-center text-white overflow-hidden rounded-t-xl sm:rounded-t-2xl shadow-xl`}
        style={gradientStyle}
      >
        <div className="absolute inset-0 opacity-25">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        </div>
        <div
          className={
            size === "large"
              ? "text-8xl font-black opacity-40"
              : "text-6xl font-black opacity-40"
          }
        >
          {initials}
        </div>
        {size === "large" && (
          <div className="absolute right-3 top-3 sm:right-6 sm:top-6 rounded-full bg-white/25 backdrop-blur-md px-5 py-2.5 text-sm font-semibold border border-white/30 shadow-lg">
            PREMIUM AI STORE
          </div>
        )}
      </div>
    );
  });

  // Fetch store details once we have effectiveStoreId
  const fetchStoreDetails = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${BASE_URL}/ai-service/agent/getAllStoreDataByStoreId/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to load store");
      const json = await res.json();

      let detail: StoreDetail | null = null;
      if (Array.isArray(json)) detail = json[0];
      else if (json?.data)
        detail = Array.isArray(json.data) ? json.data[0] : json.data;
      else detail = json;

      if (!detail?.storeId) throw new Error("Invalid store data");
      setStore(detail);
    } catch (err: any) {
      setError(err.message || "Failed to load store details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (effectiveStoreId) {
      fetchStoreDetails(effectiveStoreId);
    }
  }, [effectiveStoreId]);

  const visibleAgents = useMemo(() => {
    return (store?.agentDetailsOnAdUser || []).filter((a) => a && !a.hideAgent);
  }, [store]);

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-8">
      <div className="h-64 w-full bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl"></div>
      <div className="space-y-4 text-center">
        <div className="h-10 bg-slate-200 rounded-lg w-2/3 mx-auto"></div>
        <div className="h-6 bg-slate-200 rounded w-3/4 mx-auto"></div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-96 bg-slate-200 rounded-2xl"></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-4 lg:py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/all-ai-stores")}
          className="mb-4 inline-flex items-center gap-3 rounded-full bg-white/90 backdrop-blur-sm px-6 py-3 text-base font-medium text-gray-700 shadow-lg hover:scale-105 transition-all"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          All AI Stores
        </button>

        {loading && <LoadingSkeleton />}

        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-red-600 text-xl font-bold">{error}</p>
            <button
              onClick={() =>
                effectiveStoreId && fetchStoreDetails(effectiveStoreId)
              }
              className="mt-4 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && store && (
          <>
            <div className="text-left mb-8">
              <h1 className="text-3xl sm:text-3xl font-black text-gray-900 mb-4">
                {store.storeName}
              </h1>
              {store.description && (
                <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  {store.description}
                </p>
              )}
            </div>

            {visibleAgents.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="text-2xl font-medium">No agents available yet</p>
                <p className="mt-2">Check back soon!</p>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleAgents.map((agent) => (
                  <div
                    key={agent.agentId}
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      navigate(
                        `/${agent.assistantId}/${agent.agentId}/${agent.agentName}`
                      )
                    }
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 border border-gray-100"
                  >
                    {/* Agent Top Section (Image or Initials) */}
                    <div className="relative h-40 w-full flex items-center justify-center bg-slate-100 overflow-hidden">
                      {agent.imageUrl &&
                      agent.imageUrl.trim() !== "" &&
                      agent.imageUrl !== "null" ? (
                        <img
                          src={agent.imageUrl}
                          alt={agent.agentName}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextElementSibling?.classList.remove(
                              "hidden"
                            );
                          }}
                        />
                      ) : null}

                      {/* Initials fallback only when imageUrl is missing or invalid */}
                      {(!agent.imageUrl ||
                        agent.imageUrl === "null" ||
                        agent.imageUrl.trim() === "") && (
                        <div
                          className="absolute inset-0 flex items-center justify-center text-white font-black text-6xl hidden"
                          style={{
                            background: `linear-gradient(135deg,
          hsl(${getHueFromName(agent.agentName)}, 75%, 55%) 0%,
          hsl(${(getHueFromName(agent.agentName) + 30) % 360}, 75%, 50%) 50%,
          hsl(${(getHueFromName(agent.agentName) + 60) % 360}, 75%, 45%) 100%)`,
                          }}
                        >
                          {getInitials(agent.agentName)}
                        </div>
                      )}
                    </div>

                    <div className="absolute top-4 right-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                      {getInitials(agent.agentName)} AGENT
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {agent.agentName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-6 line-clamp-3">
                        {agent.agentCreatorName
                          ? `Created by ${agent.agentCreatorName}`
                          : "Smart AI assistant built to help you automate tasks."}
                      </p>

                      <div className="flex items-center gap-3 mb-6">
                        {agent.imageUrl ? (
                          <img
                            src={agent.imageUrl}
                            alt={agent.agentName}
                            className="h-10 w-10 rounded-full border-2 border-gray-200 object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div
                            className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold border-2 border-gray-200"
                            style={{
                              background: `linear-gradient(135deg,
          hsl(${getHueFromName(agent.agentName)}, 75%, 55%) 0%,
          hsl(${(getHueFromName(agent.agentName) + 30) % 360}, 75%, 50%) 50%,
          hsl(${(getHueFromName(agent.agentName) + 60) % 360}, 75%, 45%) 100%)`,
                            }}
                          >
                            {getInitials(agent.agentName)}
                          </div>
                        )}

                        <span className="text-sm text-gray-700 font-medium truncate">
                          {agent.agentCreatorName || "ASKOXY.AI TEAM"}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          navigate(
                            `/bharath-aistore/assistant/${agent.assistantId}/${agent.agentId}`
                          )
                        }
                        className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all shadow-md hover:shadow-xl active:scale-98"
                      >
                        View Agent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllAIStore;
