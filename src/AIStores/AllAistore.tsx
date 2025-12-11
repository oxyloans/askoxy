import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
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
  // 👉 Ref to scroll to agents section when clicking CTA button
  const agentsSectionRef = useRef<HTMLDivElement | null>(null);
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
  // 👉 Helper: identify RBI Master Directions store
  const isRBIStore = store?.storeName === "RBI Master Directions AI Store";

  const handleScrollToAgents = () => {
    if (agentsSectionRef.current) {
      agentsSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
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
            <div className="mb-8">
              {isRBIStore ? (
                <section className="relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 px-4 py-6 sm:px-8 sm:py-8 shadow-sm">
                  {/* Soft gradient glow */}
                  <div className="pointer-events-none absolute inset-0 opacity-60">
                    <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-violet-200 blur-3xl" />
                    <div className="absolute -bottom-10 -right-6 h-40 w-40 rounded-full bg-purple-200 blur-3xl" />
                  </div>

                  <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Left: Text content */}
                    <div className="max-w-3xl text-left">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 mb-3">
                        RBI Master Directions AI Store
                      </h1>

                      <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-3">
                        India’s financial ecosystem includes more than{" "}
                        <span className="font-semibold text-violet-800">
                          15,000 regulated institutions
                        </span>
                        , with around{" "}
                        <span className="font-semibold text-  violet-800">
                          9,000 NBFCs
                        </span>{" "}
                        and nearly{" "}
                        <span className="font-semibold text-violet-800">
                          6,000 banks and cooperative entities
                        </span>
                        . All of these are governed by the Reserve Bank of India
                        through{" "}
                        <span className="font-semibold text-violet-800">
                          243 Master Directions
                        </span>{" "}
                        covering operations, compliance, payments, customer
                        protection, and credit systems.
                      </p>

                      <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-3">
                        This AI Store gives you a{" "}
                        <span className="font-semibold text-violet-800">
                          single intelligent window
                        </span>{" "}
                        to explore and understand all these RBI guidelines with
                        ease.
                      </p>

                      <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                        If you want information specific to a{" "}
                        <span className="font-semibold">commercial bank</span>,
                        you can explore the{" "}
                        <span className="font-semibold text-violet-800">
                          Commercial Bank Master Directions AI
                        </span>
                        ; if your query is about{" "}
                        <span className="font-semibold">
                          credit information
                        </span>
                        , you can rely on the{" "}
                        <span className="font-semibold text-violet-800">
                          CIC Master Directions AI
                        </span>
                        , and so on.
                      </p>

                      {/* CTA row */}
                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/asst_8iVCUHAjQWMjGvoHMy9VtKpC/f25c2f3b-e200-44aa-9e72-d9747db8f423/All%20India%20Financial%20Institutions%20MD%20AI`
                            );
                          }}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-lg hover:from-violet-700 hover:to-purple-700 hover:shadow-xl transition-all"
                        >
                          Explore RBI Master Directions AI
                        </button>
                      </div>
                    </div>

                    {/* Right: Premium Highlight Card (hidden on very small screens) */}
                    <div className="mt-6 lg:mt-0 lg:w-72 xl:w-80 hidden md:block">
                      <div className="relative rounded-2xl backdrop-blur-xl bg-white/60 border border-violet-200 shadow-xl p-5 overflow-hidden">
                        {/* Glow Effects */}
                        <div className="absolute inset-0 pointer-events-none opacity-30">
                          <div className="absolute -top-8 -right-8 h-24 w-24 bg-violet-300 rounded-full blur-3xl"></div>
                          <div className="absolute -bottom-10 -left-10 h-28 w-28 bg-purple-300 rounded-full blur-3xl"></div>
                        </div>

                        {/* Heading */}
                        <p className="relative text-sm font-bold uppercase tracking-wider text-violet-700 mb-3">
                          At a Glance
                        </p>

                        {/* List */}
                        <ul className="relative space-y-3 text-sm text-gray-800 font-medium">
                          <li className="flex items-center gap-2">
                            <span className="text-violet-600 text-lg">📘</span>
                            11 Major Regulatory Focus Areas
                          </li>

                          <li className="flex items-center gap-2">
                            <span className="text-violet-600 text-lg">📜</span>
                            243 RBI Master Directions
                          </li>

                          <li className="flex items-center gap-2">
                            <span className="text-violet-600 text-lg">🏦</span>
                            Banks, NBFCs & Co-operatives Covered
                          </li>

                          <li className="flex items-center gap-2">
                            <span className="text-violet-600 text-lg">🤖</span>
                            AI Agents Answer Your Compliance Queries
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>
              ) : (
                <div className="text-left">
                  <h1 className="text-3xl sm:text-3xl font-black text-gray-900 mb-3">
                    {store.storeName}
                  </h1>
                  {store.description && (
                    <p className="text-lg text-gray-600 max-w-4xl leading-relaxed">
                      {store.description}
                    </p>
                  )}
                </div>
              )}
            </div>

            {visibleAgents.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="text-2xl font-medium">No agents available yet</p>
                <p className="mt-2">Check back soon!</p>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleAgents.map((agent) => {
                  const hasValidImage =
                    agent.imageUrl &&
                    agent.imageUrl.trim() !== "" &&
                    agent.imageUrl !== "null";

                  const hue = getHueFromName(agent.agentName);
                  const bgGradient = `linear-gradient(135deg,
                    hsl(${hue}, 75%, 55%) 0%,
                    hsl(${(hue + 30) % 360}, 75%, 50%) 50%,
                    hsl(${(hue + 60) % 360}, 75%, 45%) 100%)`;

                  return (
                    <div
                      key={agent.agentId}
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        navigate(
                          `/${agent.assistantId}/${agent.agentId}/${agent.agentName}`
                        )
                      }
                      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 border border-gray-100"
                    >
                      {/* Top Section: Gradient + Initials + Optional Image */}
                      <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
                        {/* Always render gradient initials as base */}
                        <div
                          className="absolute inset-0 flex items-center justify-center text-white font-black text-6xl"
                          style={{ background: bgGradient }}
                        >
                          {getInitials(agent.agentName)}
                        </div>

                        {/* Image on top if valid */}
                        {hasValidImage && (
                          <img
                            src={agent.imageUrl!}
                            alt={agent.agentName}
                            className="relative z-10 h-full w-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              (
                                e.currentTarget as HTMLImageElement
                              ).style.display = "none";
                            }}
                          />
                        )}
                      </div>

                      {/* Agent Badge */}
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-20">
                        {getInitials(agent.agentName)} AGENT
                      </div>

                      {/* Card Content */}
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
                          {hasValidImage ? (
                            <img
                              src={agent.imageUrl!}
                              alt={agent.agentName}
                              className="h-10 w-10 rounded-full border-2 border-gray-200 object-cover"
                              loading="lazy"
                              onError={(e) => {
                                (
                                  e.currentTarget as HTMLImageElement
                                ).style.display = "none";
                              }}
                            />
                          ) : (
                            <div
                              className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold border-2 border-gray-200"
                              style={{ background: bgGradient }}
                            >
                              {getInitials(agent.agentName)}
                            </div>
                          )}

                          <span className="text-sm text-gray-700 font-medium truncate">
                            {agent.agentCreatorName || "ASKOXY.AI TEAM"}
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/${agent.assistantId}/${agent.agentId}/${agent.agentName}`
                            );
                          }}
                          className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all shadow-md hover:shadow-xl active:scale-98"
                        >
                          View Agent
                        </button>
                      </div>
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
