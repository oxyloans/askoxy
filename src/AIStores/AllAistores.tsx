import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconShare,
  IconSparkles,
  IconSearch,
  IconFilter,
} from "@tabler/icons-react";
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
  storeImageUrl?: string | null; // ← ADD THIS
  agentDetailsOnAdUser?: StoreAgent[];
}

const AllAIStores: React.FC = () => {
  const [stores, setStores] = useState<AiStore[]>([]);
  const [filteredStores, setFilteredStores] = useState<AiStore[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  const baseAiStoreDomain = "https://www.askoxy.ai";
  const aiStorePrefix = `${baseAiStoreDomain}/ai-store/`;

  const slugify = useCallback(
    (text?: string | null): string =>
      text
        ? text
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
            .replace(/--+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 30)
        : "store",
    []
  );

  const buildPublicStoreUrl = useCallback(
    (store: AiStore): string => {
      const slug = slugify(store.storeName);
      return `${aiStorePrefix}${slug}`;
    },
    [slugify, aiStorePrefix]
  );

  const accessToken = localStorage.getItem("accessToken");

  const fetchStores = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${BASE_URL}/ai-service/agent/getAiStoreAllAgents`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch AI Stores");

      const result = await res.json();

      const data = Array.isArray(result.reverse())
        ? result
        : Array.isArray(result?.data)
        ? result.data
        : result
        ? [result]
        : [];

      const validStores = data.filter((s: any) => s && s.storeId);

      setStores(validStores);
      setFilteredStores(validStores);
    } catch (err) {
      setError("Unable to load AI Stores. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStores(stores);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = stores.filter(
      (store) =>
        store.storeName.toLowerCase().includes(query) ||
        store.description?.toLowerCase().includes(query) ||
        store.storeCreatedBy?.toLowerCase().includes(query)
    );
    setFilteredStores(filtered);
  }, [searchQuery, stores]);

  const handleOpenDetails = useCallback(
    (store: AiStore) => {
      const slug = slugify(store.storeName);
      navigate(`/ai-store/${slug}`, { state: { storeId: store.storeId } });
    },
    [navigate, slugify]
  );

  const handleShareStore = useCallback(
    (store: AiStore, e: React.MouseEvent) => {
      e.stopPropagation();
      const publicUrl = buildPublicStoreUrl(store);

      const staticMessage = `
🌟 Explore this AI Store on Bharat AI Store!

🧠 AI Store: ${store.storeName}

This AI Store is curated on ASKOXY.AI — a platform where anyone can build AI Agents, learn skills, and earn money!

🔗 Open the AI Store:
${publicUrl}

Create your own AI Agent today on ASKOXY.AI! 🚀
      `.trim();

      if (typeof navigator !== "undefined" && (navigator as any).share) {
        (navigator as any)
          .share({
            title: store.storeName || "AI Store - Bharat AI Store",
            text: staticMessage,
          })
          .then(() => {
            setShareSuccess(store.storeId);
            setTimeout(() => setShareSuccess(null), 2000);
          })
          .catch(() => {});
        return;
      }

      const whatsappUrl =
        "https://api.whatsapp.com/send?text=" +
        encodeURIComponent(staticMessage);

      if (typeof window !== "undefined") {
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        setShareSuccess(store.storeId);
        setTimeout(() => setShareSuccess(null), 2000);
      }
    },
    [buildPublicStoreUrl]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {/* Header Section */}
        <div className="mb-2 sm:mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
               
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
                  All AI Stores
                </h1>
              </div>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                Explore curated collections of AI Agents created by our
                community.
              </p>
            </div>

            {/* Stats Badge - Hidden on mobile if no stores */}
            {stores.length > 0 && (
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700 sm:px-6 sm:text-base">
                <span className="flex h-2 w-2">
                  <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500"></span>
                </span>
                {stores.length} {stores.length === 1 ? "Store" : "Stores"}{" "}
                Available
              </div>
            )}
          </div>

          {/* Search Bar */}
          {stores.length > 0 && (
            <div className="mt-6 sm:mt-8">
              <div className="relative max-w-xl">
                <IconSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 sm:left-4" />
                <input
                  type="text"
                  placeholder="Search AI Stores by name, description, or creator..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm shadow-sm transition-all placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 sm:pl-12 sm:text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Search Results Count */}
              {searchQuery && (
                <p className="mt-3 text-sm text-slate-600">
                  Found {filteredStores.length}{" "}
                  {filteredStores.length === 1 ? "store" : "stores"}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24">
            <div className="relative">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600 sm:h-16 sm:w-16"></div>
              <IconSparkles className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-violet-600 sm:h-8 sm:w-8" />
            </div>
            <span className="mt-4 text-sm font-medium text-slate-600 sm:text-base">
              Loading AI Stores...
            </span>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 p-4 text-center sm:p-6">
            <svg
              className="mx-auto h-10 w-10 text-red-500 sm:h-12 sm:w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="mt-3 text-sm font-medium text-red-800 sm:text-base">
              {error}
            </p>
            <button
              onClick={fetchStores}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 sm:text-base"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredStores.length === 0 && (
          <div className="mx-auto max-w-md rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 text-center sm:p-12">
            <IconFilter className="mx-auto h-12 w-12 text-slate-400 sm:h-16 sm:w-16" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900 sm:text-xl">
              {searchQuery ? "No stores found" : "No AI Stores available"}
            </h3>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Check back soon for new AI Stores"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 sm:text-base"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Stores Grid */}
        {!loading && !error && filteredStores.length > 0 && (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
            {filteredStores.map((store) => (
              <StoreCard
                key={store.storeId}
                store={store}
                onOpenDetails={handleOpenDetails}
                onShare={handleShareStore}
                isShareSuccess={shareSuccess === store.storeId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Optimized Store Card Component
const StoreCard: React.FC<{
  store: AiStore;
  onOpenDetails: (store: AiStore) => void;
  onShare: (store: AiStore, e: React.MouseEvent) => void;
  isShareSuccess: boolean;
}> = React.memo(({ store, onOpenDetails, onShare, isShareSuccess }) => {
  return (
    <div
      onClick={() => onOpenDetails(store)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100 active:scale-[0.98] sm:rounded-3xl"
    >
      {/* Banner */}
      <DynamicBanner
        storeName={store.storeName}
        storeImageUrl={store.storeImageUrl}
      />

      {/* Content */}
      <div className="flex flex-1 flex-col px-4 py-4 sm:px-6">
        <h3 className="line-clamp-2 text-base font-bold text-slate-900 transition-colors group-hover:text-violet-600 sm:text-lg">
          {store.storeName}
        </h3>

        <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-600 sm:text-base">
          {store.description ||
            "Curated collection of AI Agents crafted for real world use cases."}
        </p>

        {/* Agent Count Badge */}
        {store.agentDetailsOnAdUser &&
          store.agentDetailsOnAdUser.length > 0 && (
            <div className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
              <IconSparkles className="h-3 w-3" />
              {store.agentDetailsOnAdUser.length}{" "}
              {store.agentDetailsOnAdUser.length === 1 ? "Agent" : "Agents"}
            </div>
          )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Creator Info */}
          <div className="flex items-center gap-2">
            <img
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png"
              className="h-7 w-7 rounded-full ring-2 ring-white sm:h-8 sm:w-8"
              alt="creator"
              loading="lazy"
            />
            <span className="text-xs font-medium text-slate-700 sm:text-sm">
              {store.storeCreatedBy || "Creator"}
            </span>
          </div>

          {/* Share Button */}
          <button
            type="button"
            onClick={(e) => onShare(store, e)}
            className="group/share relative rounded-lg bg-white p-2 shadow-sm transition-all hover:scale-110 hover:bg-violet-50 hover:shadow-md active:scale-95 sm:p-2.5"
            aria-label="Share AI Store"
          >
            {isShareSuccess ? (
              <svg
                className="h-4 w-4 text-green-600 sm:h-5 sm:w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <IconShare className="h-4 w-4 text-slate-600 transition-colors group-hover/share:text-violet-600 sm:h-5 sm:w-5" />
            )}
          </button>
        </div>
      </div>

      {/* CTA Button */}
      <div className="px-4 pb-4 sm:px-6 sm:pb-5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(store);
          }}
          className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:shadow-violet-200 active:scale-95 sm:py-3 sm:text-base"
        >
          Explore Store
        </button>
      </div>
    </div>
  );
});

const DynamicBanner: React.FC<{
  storeName: string;
  storeImageUrl?: string | null;
}> = React.memo(({ storeName, storeImageUrl }) => {
  const [imgError, setImgError] = useState(false);

  const initials = useMemo(() => {
    return (
      storeName
        .trim()
        .split(/\s+/)
        .map((w) => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase() || "AI"
    );
  }, [storeName]);

  const hue = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < storeName.length; i++) {
      hash = storeName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 360);
  }, [storeName]);

  const gradient = `linear-gradient(135deg, hsl(${hue}, 75%, 55%) 0%, hsl(${hue}, 75%, 45%) 100%)`;

  const isValidImage =
    storeImageUrl &&
    typeof storeImageUrl === "string" &&
    storeImageUrl.trim() !== "" &&
    !storeImageUrl.includes("placehold.co") &&
    !storeImageUrl.includes("placeholder") &&
    storeImageUrl.trim().toLowerCase() !== "null";

  const showImage = isValidImage && !imgError;

  return (
    <div className="relative h-48 overflow-hidden rounded-t-3xl bg-gray-200">
      {/* Real Image */}
      {showImage && (
        <img
          src={storeImageUrl}
          alt={storeName}
          className="h-full w-full object-cover transition-opacity duration-700"
          onError={() => setImgError(true)}
        />
      )}

      {/* Fallback Gradient + Initials */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
          showImage ? "opacity-0" : "opacity-100"
        }`}
        style={{ background: gradient }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%)`,
            backgroundSize: "40px 40px",
          }}
        />
        <span className="text-7xl font-black text-white drop-shadow-2xl tracking-wider">
          {initials}
        </span>
      </div>

      {/* Featured Badge */}
      <div className="absolute right-4 top-4 rounded-full bg-white/25 px-4 py-1.5 backdrop-blur-sm">
        <span className="text-sm font-bold text-white">Featured</span>
      </div>
    </div>
  );
});

DynamicBanner.displayName = "DynamicBanner";
StoreCard.displayName = "StoreCard";

export default AllAIStores;
