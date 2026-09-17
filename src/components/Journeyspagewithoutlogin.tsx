import React, { Suspense, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import BASE_URL, { uploadurlwithId } from "../Config";
import { Campaign } from "./servicesapi";

const Header1 = React.lazy(() => import("../components/Header"));

type JourneyItem = {
  journeyId: string;
  journeyName: string;
  campaign: Campaign;
};

const JourneysPagewithoutlogin: React.FC = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  const userId =
    localStorage.getItem("userId") ||
    localStorage.getItem("customerId") ||
    localStorage.getItem("user_id") ||
    "";

  const isLoggedInUser = Boolean(userId || accessToken);

  const [journeys, setJourneys] = useState<JourneyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const getCampaignId = (campaign: Campaign) =>
    campaign.campaignId || campaign.id || "";

  const getCampaignTitle = (campaign: Campaign) =>
    campaign.campaignTitle || campaign.campaignType || "Journey";

  const slugify = (text: string) =>
    (text || "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 30);

  const getTimestamp = (value: number | string | undefined) => {
    if (value == null || value === "") return 0;

    const numeric = Number(value);
    if (Number.isFinite(numeric) && numeric > 0) {
      return numeric < 10_000_000_000 ? numeric * 1000 : numeric;
    }

    const parsed = typeof value === "number" ? value : Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const formatPublishedDate = (value: number | string | undefined) => {
    const timestamp = getTimestamp(value);

    return timestamp
      ? new Date(timestamp).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";
  };

  useEffect(() => {
    // This page is only for users who are not logged in.
    // Logged-in users should use the dashboard Journeys page.
    if (isLoggedInUser) {
      navigate("/main/dashboard/leaguejourneys", { replace: true });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [isLoggedInUser, navigate]);

  const getCampaignFirstImage = (campaign: Campaign) => {
    const firstImage =
      typeof campaign.imageUrls?.[0] === "string"
        ? campaign.imageUrls?.[0]
        : campaign.imageUrls?.[0]?.imageUrl ||
          campaign.imageUrl ||
          campaign.images?.[0]?.imageUrl ||
          "";

    if (!firstImage) return "";

    const clean = firstImage.trim();

    if (/^https?:\/\//i.test(clean)) {
      return clean;
    }

    return `${uploadurlwithId}/${clean.replace(/^\//, "")}`;
  };

  useEffect(() => {
    if (isLoggedInUser) return;

    const loadJourneys = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${BASE_URL}/marketing-service/campgin/getOnlyJourneyDetails`
        );

        if (!response.ok) {
          throw new Error(`Failed to load journeys: ${response.status}`);
        }

        const json = await response.json();
        const items: JourneyItem[] = [];

        if (json?.status && Array.isArray(json?.data)) {
          json.data.forEach((journey: any) => {
            (journey?.campaigns || []).forEach((campaign: Campaign) => {
              if (campaign?.campaignStatus === false) return;

              items.push({
                journeyId: String(journey?.journeyId || ""),
                journeyName: String(journey?.journeyName || "Journey"),
                campaign,
              });
            });
          });
        }

        // Remove duplicate campaigns while preserving journey information.
        const unique = new Map<string, JourneyItem>();

        items.forEach((item) => {
          const id = getCampaignId(item.campaign);
          if (!id) return;
          unique.set(id, item);
        });

        setJourneys(
          Array.from(unique.values()).sort(
            (a, b) =>
              getTimestamp(b.campaign.createdAt) -
              getTimestamp(a.campaign.createdAt)
          )
        );
      } catch (err) {
        console.error("Error loading journeys:", err);
        setError("Unable to load journeys right now. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadJourneys();
  }, [isLoggedInUser]);

  const filteredJourneys = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return journeys;

    return journeys.filter(({ journeyName, campaign }) => {
      const title = getCampaignTitle(campaign).toLowerCase();
      const description = String(campaign.campaignDescription || "").toLowerCase();

      return (
        title.includes(term) ||
        journeyName.toLowerCase().includes(term) ||
        description.includes(term)
      );
    });
  }, [journeys, search]);

  const handleCampaignClick = (campaign: Campaign) => {
    const campaignId = getCampaignId(campaign);
    const titleSlug = slugify(getCampaignTitle(campaign));

    if (!campaignId) return;

    if (accessToken) {
      if (
        campaign.campainInputType === "SERVICE" ||
        campaign.campainInputType === "PRODUCT"
      ) {
        navigate(`/main/services/${campaignId.slice(-4)}/${titleSlug}`);
      } else {
        navigate(`/main/blog/${campaignId.slice(-4)}/${titleSlug}`);
      }
      return;
    }

    if (
      campaign.campainInputType === "SERVICE" ||
      campaign.campainInputType === "PRODUCT"
    ) {
      navigate(`/services/${campaignId.slice(-4)}/${titleSlug}`);
    } else {
      navigate(`/blog/${campaignId.slice(-4)}/${titleSlug}`);
    }
  };

  if (isLoggedInUser) {
    return null;
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-white">
      <Suspense fallback={<div className="h-16 bg-white" />}>
        <Header1 />
      </Suspense>

      {/* Journeys hero */}
      <section
        className="border-b border-slate-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50"
        style={{ paddingTop: 64 }}
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <div className="flex flex-col gap-5 md:gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl min-w-0">
              <div className="mb-2.5 inline-flex rounded-full bg-violet-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-700 sm:text-xs sm:tracking-[0.18em]">
                Explore Opportunities
              </div>

              <h1 className="text-[2rem] font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Our{" "}
                <span className="bg-gradient-to-r from-[#4C1D95] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent">
                  Journeys
                </span>
              </h1>

              <p className="mt-2.5 max-w-2xl text-sm leading-6 text-slate-600 sm:mt-3 sm:text-base">
                Explore all available journeys, discover opportunities, and open
                the journey that matches your interests.
              </p>
            </div>

            <div className="w-full lg:max-w-md lg:shrink-0">
              <label htmlFor="journey-search" className="sr-only">
                Search journeys
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                  ⌕
                </span>

                <input
                  id="journey-search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search journeys..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 sm:h-12 sm:rounded-2xl"
                />
              </div>

              {!loading && (
                <p className="mt-2 text-xs font-medium text-slate-500">
                  {filteredJourneys.length}{" "}
                  {filteredJourneys.length === 1 ? "journey" : "journeys"} found
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="h-52 animate-pulse bg-slate-200" />
                <div className="space-y-3 p-4">
                  <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-slate-100" />
                  <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mx-auto max-w-xl rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
            <h2 className="text-lg font-bold text-slate-900">
              Journeys could not be loaded
            </h2>
            <p className="mt-2 text-sm text-slate-600">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-full bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
            >
              Try Again
            </button>
          </div>
        ) : filteredJourneys.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          >
            {filteredJourneys.map(({ journeyId, journeyName, campaign }, index) => {
              const mediaUrl = getCampaignFirstImage(campaign);
              const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
              const title = getCampaignTitle(campaign);
              const publishedDate = formatPublishedDate(campaign.createdAt);

              return (
                <motion.article
                  key={`${journeyId}-${getCampaignId(campaign)}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: Math.min(index * 0.03, 0.24) }}
                  whileHover={{ y: -5 }}
                  onClick={() => handleCampaignClick(campaign)}
                  className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-violet-300 hover:shadow-[0_18px_45px_rgba(79,70,229,0.14)]"
                >
                  <div className="relative h-[190px] overflow-hidden bg-slate-50 sm:h-[210px] lg:h-[220px]">
                    {mediaUrl ? (
                      isVideo ? (
                        <video
                          src={mediaUrl}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          muted
                          loop
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={mediaUrl}
                          alt={title}
                          className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      )
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-700 p-6 text-center text-3xl font-extrabold text-white">
                        {title
                          .split(/\s+/)
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((word) => word.charAt(0).toUpperCase())
                          .join("") || "J"}
                      </div>
                    )}

                    <div className="absolute left-3 top-3">
                      <span className="rounded-full bg-gradient-to-r from-violet-700 to-indigo-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                        Journey
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="line-clamp-1 text-xs font-semibold text-violet-700">
                        {journeyName}
                      </span>

                      {publishedDate && (
                        <span className="shrink-0 text-[11px] font-medium text-slate-400">
                          {publishedDate}
                        </span>
                      )}
                    </div>

                    <h2 className="line-clamp-2 text-[15px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-violet-700 sm:text-base">
                      {title}
                    </h2>

                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-500">
                      {campaign.campaignDescription ||
                        "Explore this journey and discover more opportunities."}
                    </p>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleCampaignClick(campaign);
                      }}
                      className="mt-4 h-10 w-full rounded-xl bg-gradient-to-r from-[#4C1D95] via-[#7C3AED] to-[#A855F7] px-4 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 sm:mt-5 sm:h-11"
                    >
                      Explore Journey
                      <span className="ml-2" aria-hidden="true">
                        →
                      </span>
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        ) : (
          <div className="mx-auto max-w-lg py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-2xl">
              ⌕
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900">
              No journeys found
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Try another search term or clear your search.
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-5 rounded-full border border-violet-200 bg-white px-5 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default JourneysPagewithoutlogin;