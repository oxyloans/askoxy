import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

import Header1 from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { fetchCampaigns, Campaign } from "../components/servicesapi";
import { uploadurlwithId } from "../Config";

type CampaignWithId = Campaign & {
  id: string;
  campaignId: string;
  campaignType?: string;
  campaignDescription?: string;
  campaignStatus?: boolean;
  campainInputType?: string;
  addServiceType?: string | null;
  imageUrls?: Array<{
    imageId?: string;
    imageUrl?: string;
  }>;
};

const LeagueJourneysPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<CampaignWithId[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const userId =
    localStorage.getItem("userId") ||
    sessionStorage.getItem("userId") ||
    "";

  useEffect(() => {
    const loadCampaigns = async (): Promise<void> => {
      setLoading(true);

      try {
        const data = await fetchCampaigns();

        const mappedCampaigns: CampaignWithId[] = (data || [])
          .map((campaign: Campaign & { id?: string }) => {
            const campaignId = String(
              campaign.campaignId || campaign.id || "",
            ).trim();

            return {
              ...campaign,
              id: campaignId,
              campaignId,
            } as CampaignWithId;
          })
          .filter((campaign) => Boolean(campaign.campaignId));

        setCampaigns(mappedCampaigns);
      } catch (error) {
        console.error("Error loading campaigns:", error);
        message.error("Unable to load League Journeys.");
      } finally {
        setLoading(false);
      }
    };

    void loadCampaigns();
  }, []);

  const leagueCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const inputType = String(
        campaign.campainInputType || "",
      ).toUpperCase();

      const serviceType = String(
        campaign.addServiceType || "",
      ).toUpperCase();

      return (
        campaign.campaignStatus !== false &&
        inputType !== "BLOG" &&
        serviceType === "LEAGUEJOURNEYS"
      );
    });
  }, [campaigns]);

  const filteredCampaigns = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return leagueCampaigns;
    }

    return leagueCampaigns.filter((campaign) => {
      const title = String(campaign.campaignType || "").toLowerCase();

      const description = String(
        campaign.campaignDescription || "",
      ).toLowerCase();

      return title.includes(query) || description.includes(query);
    });
  }, [leagueCampaigns, searchQuery]);

  const createSlug = (value?: string): string => {
    return String(value || "journey")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 30);
  };

  const getImageUrl = (campaign: CampaignWithId): string => {
    const imagePath = String(
      campaign.imageUrls?.[0]?.imageUrl || "",
    ).trim();

    if (!imagePath) {
      return "";
    }

    if (/^https?:\/\//i.test(imagePath)) {
      return imagePath;
    }

    const separator =
      imagePath.startsWith("/") || uploadurlwithId.endsWith("/") ? "" : "/";

    return `${uploadurlwithId}${separator}${imagePath}`;
  };

  const openCampaignDetails = (campaign: CampaignWithId): void => {
    const inputType = String(
      campaign.campainInputType || "",
    ).toUpperCase();

    if (inputType !== "SERVICE" && inputType !== "PRODUCT") {
      message.warning("This League Journey is currently unavailable.");
      return;
    }

    const campaignSuffix = campaign.campaignId.slice(-4);
    const campaignSlug = createSlug(campaign.campaignType);

    const detailPath = `/main/services/${campaignSuffix}/${campaignSlug}`;

    navigate(detailPath, {
      state: {
        campaignId: campaign.campaignId,
        addServiceType: "LEAGUEJOURNEYS",
        from: "/main/dashboard/leaguejourneys",
      },
    });
  };

  const handleCardKeyDown = (
    event: React.KeyboardEvent<HTMLElement>,
    campaign: CampaignWithId,
  ): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCampaignDetails(campaign);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {!userId && (
        <div className="mb-4 p-2">
          <Header1 />
        </div>
      )}

      <main className="bg-white">
        <div className="p-2 sm:p-3 lg:p-4">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="flex items-center text-xl font-bold text-purple-700 sm:text-2xl">
              League Journeys

              <span className="ml-2 inline-flex min-w-7 items-center justify-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700">
                {filteredCampaigns.length}
              </span>
            </h2>

            <div className="relative w-full md:w-[360px] lg:w-[420px]">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
                aria-hidden="true"
              />

              <input
                type="search"
                placeholder="Search league journeys..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-purple-500 sm:text-base"
                aria-label="Search League Journeys"
              />
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader />
            </div>
          )}

          {!loading && filteredCampaigns.length === 0 && (
            <div className="py-16 text-center text-gray-500">
              No League Journey posts yet.
            </div>
          )}

          {!loading && filteredCampaigns.length > 0 && (
            <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCampaigns.map((campaign) => {
                const imageUrl = getImageUrl(campaign);
                const campaignTitle =
                  campaign.campaignType || "League Journey";

                return (
                  <article
                    key={campaign.campaignId}
                    role="button"
                    tabIndex={0}
                    onClick={() => openCampaignDetails(campaign)}
                    onKeyDown={(event) =>
                      handleCardKeyDown(event, campaign)
                    }
                    aria-label={`Open ${campaignTitle}`}
                    className="flex cursor-pointer flex-col overflow-hidden rounded-xl bg-white outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                  >
                    <div className="flex h-48 items-center justify-center overflow-hidden bg-white p-2 sm:h-52">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={campaignTitle}
                          className="h-full w-full rounded-lg object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-400">
                          Image not available
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col px-4 pb-4 pt-2 text-center">
                      <h3 className="line-clamp-2 min-h-[48px] text-base font-semibold leading-6 text-gray-900">
                        {campaignTitle}
                      </h3>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <Footer />
        </div>
      </main>
    </div>
  );
};

export default LeagueJourneysPage;