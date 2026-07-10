import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header1 from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { fetchCampaigns, Campaign } from "../components/servicesapi";
import { uploadurlwithId } from "../Config";

type CampaignWithId = Campaign & { id: string };

const LeagueJourneysPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<CampaignWithId[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchCampaigns();
        const mapped: CampaignWithId[] = data.map((c: any) => ({
          ...c,
          id: c.campaignId,
        }));
        setCampaigns(mapped);
      } catch (err) {
        console.error("Error loading campaigns:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const leagueCampaigns = useMemo(
    () =>
      campaigns.filter(
        (c) =>
          c.campaignStatus !== false &&
          (c as any).campainInputType !== "BLOG" &&
          c.addServiceType === "LEAGUEJOURNEYS",
      ),
    [campaigns],
  );

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return leagueCampaigns.filter(
      (c: any) =>
        (c.campaignType ?? "").toLowerCase().includes(q) ||
        (c.campaignDescription ?? "").toLowerCase().includes(q),
    );
  }, [leagueCampaigns, searchQuery]);

  const handleClick = (campaign: CampaignWithId) => {
    const c = campaign as any;
    if (c.campainInputType === "SERVICE" || c.campainInputType === "PRODUCT") {
      const slug = (c.campaignType ?? "journey")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .slice(0, 30);
      navigate(`/main/services/${campaign.campaignId.slice(-4)}/${slug}`);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mb-4 p-2">{!userId ? <Header1 /> : null}</div>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-2 lg:p-4">
          {/* Header + Search */}
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-bold text-purple-700">
              League Journeys
              <span className="ml-2 inline-flex items-center justify-center text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                {filtered.length}
              </span>
            </h2>
            <div className="relative w-full md:w-[360px] lg:w-[420px]">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search league journeys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-8">
              <Loader />
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center text-gray-500 py-16">
              No league journey posts yet.
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
              {filtered.map((campaign: any) => (
                <div
                  key={campaign.campaignId}
                  className="group cursor-pointer flex flex-col items-center text-center"
                  onClick={() => handleClick(campaign)}
                >
                  <div className="mb-2">
                    {campaign.imageUrls && campaign.imageUrls.length > 0 && (
                      <img
                        src={`${uploadurlwithId}${campaign.imageUrls[0].imageUrl}`}
                        alt={campaign.campaignType}
                        className="w-80 h-48 object-contain transition-all duration-300 group-hover:border-purple-300 rounded-lg"
                      />
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {campaign.campaignType}
                  </h3>
                </div>
              ))}
            </div>
          )}

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default LeagueJourneysPage;
