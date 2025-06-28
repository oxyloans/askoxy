import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header1 from "../components/Header";
import Footer from "../components/Footer";
import { fetchCampaigns, Campaign } from "../components/servicesapi";

const BlogsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const campaigns = await fetchCampaigns();
        const campaignsWithIds = campaigns.map((campaign) => ({
          ...campaign,
          id: campaign.campaignId,
        }));
        setCampaigns(campaignsWithIds);
      } catch (err) {
        console.error("Error loading campaigns:", err);
      }
    };
    loadCampaigns();
  }, []);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 30);

  const handleCampaignClick = (campaign: Campaign) => {
    navigate(
      `/main/blog/${campaign.campaignId.slice(-4)}/${slugify(
        campaign.campaignType
      )}`
    );
  };

  const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

  const blogCampaigns = campaigns.filter(
    (campaign) =>
      campaign.campaignStatus !== false && campaign.campainInputType === "BLOG"
  );

  return (
    <div className="min-h-screen">
      <div className="mb-4 p-2">{!userId ? <Header1 /> : null}</div>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-2 lg:p-4">
          {/* <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] leading-tight">
            Our <span className="text-yellow-500">Blogs</span>
          </h2>
          <div className="w-32 h-2 bg-gradient-to-r from-yellow-500 via-purple-600 to-blue-500 mt-1 mx-auto sm:mx-0 rounded-full"></div> */}

          {blogCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {blogCampaigns.map((campaign) => {
                const mediaUrl = campaign.imageUrls?.[0]?.imageUrl;
                const showImage = mediaUrl && isImage(mediaUrl);
                const showVideo = mediaUrl && isVideo(mediaUrl);

                return (
                  <div
                    key={campaign.campaignId}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col"
                    onClick={() => handleCampaignClick(campaign)}
                  >
                    <div className="relative aspect-video overflow-hidden bg-gray-50">
                      {showImage ? (
                        <img
                          src={mediaUrl}
                          alt={campaign.campaignType}
                          className="w-full h-full object-contain"
                        />
                      ) : showVideo ? (
                        <video
                          src={mediaUrl}
                          className="w-full h-full object-contain"
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                          No media available
                        </div>
                      )}
                      {campaign.campaignType && (
                        <div className="absolute top-0 left-0 w-full p-2 bg-gradient-to-b from-black/50 to-transparent">
                          <span className="px-3 py-1 text-xs font-medium bg-white text-gray-800 rounded-full shadow-sm">
                            {campaign.campaignType.slice(0, 10)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                        {campaign.campaignType}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 group-hover:text-gray-900 transition-colors">
                        {campaign.campaignDescription}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-6">
              No blogs are available.
            </p>
          )}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
