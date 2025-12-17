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
  storeImageUrl?: string | null;
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
            .slice(0, 40)
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

      const active = Array.isArray(result)
        ? result.filter((x: any) => x?.aiStoreStatus === "ACTIVE")
        : Array.isArray(result?.data)
        ? result.data.filter((x: any) => x?.aiStoreStatus === "ACTIVE")
        : [];

      const data = Array.isArray(active) ? active.reverse() : [];
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

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStores(stores);
      return;
    }
    const query = searchQuery.toLowerCase();
    setFilteredStores(
      stores.filter(
        (store) =>
          store.storeName?.toLowerCase().includes(query) ||
          store.description?.toLowerCase().includes(query) ||
          store.storeCreatedBy?.toLowerCase().includes(query)
      )
    );
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
            setTimeout(() => setShareSuccess(null), 1600);
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
        setTimeout(() => setShareSuccess(null), 1600);
      }
    },
    [buildPublicStoreUrl]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      {/* ✅ Slightly wider on big screens */}
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {/* Header */}
        <div className="mb-3 sm:mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
                All AI Stores
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                Explore curated collections of AI Agents created by our
                community.
              </p>
            </div>

            {stores.length > 0 && (
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700 sm:px-6 sm:text-base">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-violet-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
                </span>
                {stores.length} {stores.length === 1 ? "Store" : "Stores"}{" "}
                Available
              </div>
            )}
          </div>

          {/* Search */}
          {stores.length > 0 && (
            <div className="mt-5 sm:mt-7">
              <div className="relative max-w-xl">
                <IconSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 sm:left-4" />
                <input
                  type="text"
                  placeholder="Search AI Stores by name, description, or creator..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm shadow-sm transition-all placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 sm:pl-12 sm:text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Clear search"
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

              {searchQuery && (
                <p className="mt-3 text-sm text-slate-600">
                  Found {filteredStores.length}{" "}
                  {filteredStores.length === 1 ? "store" : "stores"}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24">
            <div className="relative">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600 sm:h-16 sm:w-16" />
              <IconSparkles className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-violet-600 sm:h-8 sm:w-8" />
            </div>
            <span className="mt-4 text-sm font-medium text-slate-600 sm:text-base">
              Loading AI Stores...
            </span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 p-4 text-center sm:p-6">
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

        {/* Empty */}
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
          </div>
        )}

        {/* ✅ GRID: better width + spacing */}
        {!loading && !error && filteredStores.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
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

const StoreCard: React.FC<{
  store: AiStore;
  onOpenDetails: (store: AiStore) => void;
  onShare: (store: AiStore, e: React.MouseEvent) => void;
  isShareSuccess: boolean;
}> = React.memo(({ store, onOpenDetails, onShare, isShareSuccess }) => {
  return (
    <div
      onClick={() => onOpenDetails(store)}
      className="group relative flex cursor-pointer flex-col rounded-3xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100 active:scale-[0.99]"
    >
      {/* ✅ Image inside its own rounded box (ALL 4 corners) */}
      <DynamicBanner
        storeName={store.storeName}
        storeImageUrl={store.storeImageUrl}
      />

      {/* Content */}
      <div className="flex flex-1 flex-col px-2 pb-2 pt-3">
        <h3 className="line-clamp-2 text-[15px] font-bold text-slate-900 transition-colors group-hover:text-violet-600">
          {store.storeName}
        </h3>

        <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-600">
          {store.description ||
            "Curated collection of AI Agents crafted for real world use cases."}
        </p>
      </div>

      {/* Footer */}
      <div className=" px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          {/* ✅ Agent Count (same size as share button) */}
          {store.agentDetailsOnAdUser?.length ? (
            <div className="inline-flex h-10 min-w-[96px] items-center justify-center gap-1 rounded-xl bg-violet-100 px-3 text-xs font-semibold text-violet-700">
              <IconSparkles className="h-4 w-4" />
              <span>
                {store.agentDetailsOnAdUser.length}{" "}
                {store.agentDetailsOnAdUser.length === 1 ? "Agent" : "Agents"}
              </span>
            </div>
          ) : (
            // ✅ keeps layout balanced even when count is not available
            <div className="h-10 min-w-[96px]" />
          )}

          {/* ✅ Share Button (same height + same width) */}
          <button
            type="button"
            onClick={(e) => onShare(store, e)} // ✅ use your prop function
            className="inline-flex h-10 w-[96px] items-center justify-center rounded-xl bg-white shadow-sm transition-all hover:scale-105 hover:bg-violet-50 hover:shadow-md active:scale-95"
            aria-label="Share AI Store"
          >
            {isShareSuccess ? (
              <svg
                className="h-5 w-5 text-green-600"
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
              <IconShare className="h-5 w-5 text-slate-600 hover:text-violet-600" />
            )}
          </button>
        </div>
      </div>

      {/* CTA */}
      <div className="px-2 pb-2 pt-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(store);
          }}
          className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:shadow-violet-200 active:scale-95"
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
    for (let i = 0; i < storeName.length; i++)
      hash = storeName.charCodeAt(i) + ((hash << 5) - hash);
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

  const showImage = Boolean(isValidImage && !imgError);

  return (
    // ✅ rounded on ALL 4 corners + full image visible
    <div className="relative overflow-hidden rounded-2xl bg-slate-100">
      <div className="relative h-40 w-full sm:h-44">
        {showImage ? (
          <img
            src={storeImageUrl as string}
            alt={storeName}
            className="h-full w-full object-contain bg-white" // ✅ FULL image (no crop)
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: gradient }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(45deg, rgba(255,255,255,0.12) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.12) 75%)",
                backgroundSize: "40px 40px",
              }}
            />
            <span className="text-6xl font-black text-white drop-shadow-2xl tracking-wider">
              {initials}
            </span>
          </div>
        )}
      </div>

      {/* badge */}
      <div className="absolute right-3 top-3 rounded-full bg-black/20 px-3 py-1 backdrop-blur-sm">
        <span className="text-xs font-bold text-white">Featured</span>
      </div>
    </div>
  );
});

DynamicBanner.displayName = "DynamicBanner";
StoreCard.displayName = "StoreCard";

export default AllAIStores;
