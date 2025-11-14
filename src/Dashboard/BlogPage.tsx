import React, { useState, useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";
import Header1 from "../components/Header";
import Footer from "../components/Footer";
import { fetchCampaigns, Campaign } from "../components/servicesapi";
import { PlusIcon } from "lucide-react";
import { message } from "antd";

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
      .slice(0, 50);

  const handleCampaignClick = (campaign: Campaign) => {
    if (!userId) {
      navigate(
        `/blog/${campaign.campaignId.slice(-4)}/${slugify(
          campaign.campaignType
        )}`
      );
    } else {
      navigate(
        `/main/blog/${campaign.campaignId.slice(-4)}/${slugify(
          campaign.campaignType
        )}`
      );
    }
  };

  const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

  const blogCampaigns = campaigns.filter(
    (campaign) =>
      campaign.campaignStatus !== false && campaign.campainInputType === "BLOG"
  );

  const handleAddblog = () => {
    if (!userId) {
      message.info("please login to add your blog");
      navigate("/whatsapplogin");
      sessionStorage.setItem("redirectPath", "/main/addblogs");
    }
    else{
      navigate("/main/addblogs");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mb-4 p-2">{!userId ? <Header1 /> : null}</div>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-2 lg:p-4">
          <div className="w-full rounded-xl bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-purple-100 shadow-sm py-3 px-4 md:px-6">
            <div className="max-w-8xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              {/* Text Section */}
              <div className="text-center sm:text-left">
                <h4 className="text-lg md:text-xl font-extrabold text-purple-800 tracking-tight drop-shadow-sm">
                  Write Your Blog & Earn Rewards!
                </h4>
                <p className="text-sm md:text-base text-purple-600 mt-0.5">
                  Share your thoughts with the world — Start earning
                  <span className="font-semibold text-purple-700">
                    {" "}
                    BMVcoins
                  </span>
                  ! 🚀
                </p>
              </div>

              {/* Button */}
              <button
                onClick={handleAddblog}
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 
        hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 
        text-white px-5 py-2.5 rounded-full 
        text-sm font-semibold transition-all duration-300 
        flex items-center gap-2 
        hover:scale-[1.05] active:scale-[0.97]
        shadow-md hover:shadow-lg whitespace-nowrap"
              >
                <PlusIcon className="w-4 h-4" />
                Add Blog Post
              </button>
            </div>
          </div>

          {blogCampaigns.length > 0 ? (
            <div className="min-h-screen bg-gray-50 p-6">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {blogCampaigns.map((campaign) => {
                    const mediaUrl = campaign.imageUrls?.[0]?.imageUrl;
                    const showImage = mediaUrl && isImage(mediaUrl);
                    const showVideo = mediaUrl && isVideo(mediaUrl);

                    return (
                      <div
                        key={campaign.campaignId}
                        className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col border border-gray-100 hover:animate-pulse"
                        onClick={() => handleCampaignClick(campaign)}
                      >
                        {/* Media Section - Now at the top */}
                        <div className="relative h-48 overflow-hidden bg-gray-50">
                          {showImage ? (
                            <img
                              src={mediaUrl}
                              alt={campaign.campaignType}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              style={{ objectPosition: "center" }}
                            />
                          ) : showVideo ? (
                            <video
                              src={mediaUrl}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              autoPlay
                              muted
                              loop
                              playsInline
                              style={{ objectPosition: "center" }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
                              <div className="text-center">
                                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <svg
                                    className="w-6 h-6 text-gray-500"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                  </svg>
                                </div>
                                <span>No media available</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Content Section - Now below the image */}
                        <div className="p-6 flex-grow flex flex-col">
                          {/* Title */}
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-4 text-center">
                            {campaign.campaignType}
                          </h3>

                          <p className="text-gray-600 text-center leading-relaxed group-hover:text-gray-800 transition-colors line-clamp-3 flex-grow">
                            {campaign.campaignDescription}
                          </p>

                          {/* Read more link */}
                          <div className="mt-4 text-center">
                            <span className="text-sm text-purple-600 font-medium group-hover:text-purple-700 transition-colors">
                              Read more →
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
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
