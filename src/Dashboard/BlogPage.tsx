import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCampaigns, Campaign } from "../components/servicesapi";
import { message, Empty, Button, Tooltip } from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  PlusOutlined,
  ArrowRightOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { uploadurlwithId } from "../Config";
const Header1 = React.lazy(() => import("../components/Header"));
const Footer = React.lazy(() => import("../components/Footer"));

type TabKey = "ALL" | "MY" | "ADD";

const BlogsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("ALL");
  const [displayCount, setDisplayCount] = useState(20);

  const navigate = useNavigate();
  const prevTabRef = useRef<TabKey>("ALL");
  const userId =
    localStorage.getItem("userId") ||
    localStorage.getItem("customerId") ||
    localStorage.getItem("user_id") ||
    "";

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const list = await fetchCampaigns();
        const normalized = (list as any[]).map((c: any) => ({
          ...c,
          id: c.campaignId,
        }));
        setCampaigns(normalized as any);
      } catch (err) {
        console.error("Error loading campaigns:", err);
      }
    };
    loadCampaigns();
  }, []);

  const slugify = (text: string) =>
    (text || "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);

  const formatTitle = (title: string) => {
    return (title || "")
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleCampaignClick = (campaign: any) => {
    const url = !userId
      ? `/blog/${campaign.campaignId.slice(-4)}/${slugify(campaign.campaignType)}`
      : `/main/blog/${campaign.campaignId.slice(-4)}/${slugify(campaign.campaignType)}`;
    navigate(url);
  };

  const handleAddBlog = () => {
    if (!userId) {
      message.info("Please login to add your blog");
      sessionStorage.setItem("redirectPath", "/main/addblogs");
      navigate("/whatsapplogin");
    } else {
      navigate("/main/addblogs");
    }
  };

  const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

  const blogCampaigns = useMemo(() => {
    return (campaigns as any[])
      .filter((c: any) => c.campaignStatus !== false && c.campainInputType === "BLOG")
      .sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA; // Latest first
      });
  }, [campaigns]);

  const myBlogs = useMemo(() => {
    return blogCampaigns.filter(
      (c: any) => (c.createdPersonId || "").toString() === (userId || "")
    );
  }, [blogCampaigns, userId]);

  const visibleBlogs = useMemo(() => {
    const blogs = activeTab === "MY" ? myBlogs : blogCampaigns;
    return blogs.slice(0, displayCount);
  }, [activeTab, blogCampaigns, myBlogs, displayCount]);

  const hasMoreBlogs = useMemo(() => {
    const totalBlogs = activeTab === "MY" ? myBlogs.length : blogCampaigns.length;
    return displayCount < totalBlogs;
  }, [activeTab, blogCampaigns.length, myBlogs.length, displayCount]);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 20);
  };

  // ✅ Tabs like screenshot: Add Blog is action-tab
  const onTabClick = (tab: TabKey) => {
    if (tab === "ADD") {
      const backTo = prevTabRef.current || "ALL";
      setActiveTab("ADD");
      handleAddBlog();
      setTimeout(() => setActiveTab(backTo), 150);
      return;
    }
    prevTabRef.current = tab;
    setActiveTab(tab);
  };

  // ✅ 4 Color buttons actions
  const handleShare = (campaign: any) => {
    const shareUrl = window.location.origin + `/blog/${campaign.campaignId.slice(-4)}/${slugify(campaign.campaignType)}`;
    if (navigator.share) {
      navigator.share({ title: campaign.campaignType, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => message.success("Link copied"));
    }
  };

  const handleCopyLink = (campaign: any) => {
    const shareUrl = window.location.origin + `/blog/${campaign.campaignId.slice(-4)}/${slugify(campaign.campaignType)}`;
    navigator.clipboard.writeText(shareUrl).then(() => message.success("Link copied"));
  };

  const handleSave = () => {
    message.success("Saved (demo)");
  };

  const BlogsGrid = ({ list }: { list: any[] }) => {
    if (!list || list.length === 0) {
      return (
        <div className="py-10">
          <Empty description={activeTab === "MY" ? "No blogs in My Blogs." : "No blogs found."} />
        </div>
      );
    }

    return (
      <div className="blogsGridWrap">
        <div className="blogsGrid">
          {list.map((campaign) => {
            const mediaUrl =`${uploadurlwithId}${campaign.imageUrls?.[0]?.imageUrl}`;
            const showImage = !!mediaUrl && isImage(mediaUrl);
            const showVideo = !!mediaUrl && isVideo(mediaUrl);

            return (
              <div key={campaign.campaignId} className="blogCard">
                <div className="blogMedia" onClick={() => handleCampaignClick(campaign)}>
                  {showImage ? (
                    <img
                      src={mediaUrl}
                      alt={campaign.campaignType}
                      loading="lazy"
                      className="blogMediaImg"
                    />
                  ) : showVideo ? (
                    <video
                      src={mediaUrl}
                      className="blogMediaImg"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <div className="blogMediaFallback">No media</div>
                  )}
                </div>

                <div className="blogBody">
                  <h3 className="blogTitle" onClick={() => handleCampaignClick(campaign)}>
                    {formatTitle(campaign.campaignType)}
                  </h3>

                  <p className="blogDesc" onClick={() => handleCampaignClick(campaign)}>
                    {campaign.campaignDescription}
                  </p>

                  {/* ✅ 4 colorful buttons like screenshot */}
                  <div className="blogActions">
                    <Button
                      className="btnOpen"
                      icon={<ArrowRightOutlined />}
                      onClick={() => handleCampaignClick(campaign)}
                    >
                      Read More
                    </Button>

                    <Tooltip title="Share">
                      <Button
                        className="btnShare"
                        shape="circle"
                        icon={<ShareAltOutlined />}
                        onClick={() => handleShare(campaign)}
                      />
                    </Tooltip>
                  </div>


                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="p-2" />}>
        <Header1 />
      </Suspense>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-2 lg:p-4">
          {/* ✅ Single top section (simple text + tabs like screenshot) */}
          <div className="topSection">
            <div className="topHeading">
              <div className="h1">Write Your Blog & Earn Rewards!</div>
              <div className="h2">
               Share your thoughts with the world — <span className="coin">Start earning BMVcoins! 🚀</span>.
              </div>
            </div>

            {/* ✅ Tabs row like image (left aligned) */}
            <div className="tabRow" role="tablist" aria-label="Blog Tabs">
              <button
                className={`tabItem ${activeTab === "ALL" ? "active" : ""}`}
                onClick={() => onTabClick("ALL")}
                type="button"
              >
                <FileTextOutlined />
                <span>All Blogs</span>
              </button>

              <button
                className={`tabItem ${activeTab === "MY" ? "active" : ""}`}
                onClick={() => onTabClick("MY")}
                type="button"
              >
                <UserOutlined />
                <span>My Blogs</span>
              </button>

              <button
                className={`tabItem ${activeTab === "ADD" ? "active" : ""}`}
                onClick={() => onTabClick("ADD")}
                type="button"
              >
                <PlusOutlined />
                <span>Add Blog</span>
              </button>
            </div>
          </div>

          <div className="mt-4">
            <BlogsGrid list={visibleBlogs} />
            {hasMoreBlogs && (
              <div className="loadMoreSection">
                <Button 
                  className="loadMoreBtn" 
                  onClick={handleLoadMore}
                  size="large"
                >
                  Load More Blogs
                </Button>
              </div>
            )}
          </div>

          <div className="footerSection">
            <Suspense fallback={<div className="py-8" />}>
              <Footer />
            </Suspense>
          </div>

          {/* ✅ Professional Blog UI/UX Styles */}
          <style>{`
            /* Clean Container */
            .topSection {
              background: #ffffff;
            
              padding: 24px;
              margin-bottom: 28px;
              
            }
            
            .topHeading {
              text-align: center;
              margin-bottom: 24px;
            }
            .topHeading .h1 {
              font-size: clamp(16px, 5vw, 32px);
              font-weight: 800;
              color: #1e293b;
              line-height: 1.2;
              margin-bottom: 12px;
            }
            .topHeading .h2 {
              font-size: clamp(16px, 3vw, 18px);
              color: #64748b;
              font-weight: 500;
              line-height: 1.5;
            }
            .coin {
              color: #7c3aed;
              font-weight: 700;
            }

            /* Professional Tab Navigation */
            .tabRow {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
            
              padding: 6px;
            }
            
            .tabItem {
              border: none;
              background: transparent;
              padding: 12px 20px;
              border-radius: 8px;
              font-weight: 600;
              color: #64748b;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 8px;
              white-space: nowrap;
              transition: all 0.2s ease;
              font-size: 14px;
            }
            .tabItem:hover {
              background: #e2e8f0;
              color: #1e293b;
            }
            .tabItem.active {
              background: #4f46e5;
              color: #ffffff;
              box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
            }
            .tabItem svg {
              font-size: 16px;
            }

            /* Modern Grid Layout */
            .blogsGridWrap {
              background: #f8fafc;
              border-radius: 20px;
              padding: 24px;
              margin-top: 24px;
            }
            .blogsGrid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 24px;
            }

            /* Professional Blog Cards */
            .blogCard {
              background: #ffffff;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0,0,0,0.05);
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              border: 1px solid #e2e8f0;
              position: relative;
            }
            .blogCard:hover {
              transform: translateY(-8px);
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              border-color: #c7d2fe;
            }
            
            .blogMedia {
              height: 240px;
              background: #f8fafc;
              overflow: hidden;
              cursor: pointer;
              position: relative;
            }
            .blogMediaImg {
              width: 100%;
              height: 100%;
              object-fit: contain;
              transition: transform 0.3s ease;
            }
            .blogCard:hover .blogMediaImg {
              transform: scale(1.02);
            }
            .blogMediaFallback {
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #94a3b8;
              font-weight: 600;
              font-size: 16px;
            }
            
            .blogBody {
              padding: 24px;
              display: flex;
              flex-direction: column;
              gap: 16px;
            }
            .blogTitle {
              margin: 0;
              font-size: 20px;
              font-weight: 700;
              color: #1e293b;
              line-height: 1.3;
              cursor: pointer;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              transition: color 0.2s ease;
            }
            .blogTitle:hover {
              color: #4f46e5;
            }
            .blogDesc {
              margin: 0;
              color: #64748b;
              line-height: 1.6;
              cursor: pointer;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
              font-size: 15px;
            }

            /* Action Buttons */
            .blogActions {
              display: flex;
              align-items: center;
              gap: 12px;
              margin-top: 8px;
            }
            .btnOpen {
              border-radius: 12px !important;
              font-weight: 600 !important;
              background: linear-gradient(135deg, #4f46e5, #7c3aed) !important;
              border: none !important;
              color: #ffffff !important;
              box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3) !important;
              padding: 8px 16px !important;
              height: auto !important;
              transition: all 0.2s ease !important;
            }
            .btnOpen:hover {
              transform: translateY(-1px) !important;
              box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4) !important;
            }
            .btnShare {
              border-radius: 12px !important;
              background: linear-gradient(135deg, #06b6d4, #0891b2) !important;
              border: none !important;
              color: #ffffff !important;
              box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3) !important;
              transition: all 0.2s ease !important;
            }
            .btnShare:hover {
              transform: translateY(-1px) !important;
              box-shadow: 0 6px 16px rgba(6, 182, 212, 0.4) !important;
            }
            
            /* Load More Section */
            .loadMoreSection {
              display: flex;
              justify-content: center;
              padding: 32px 0;
            }
            .loadMoreBtn {
              background: #4f46e5 !important;
              border-color: #4f46e5 !important;
              color: #ffffff !important;
              border-radius: 12px !important;
              font-weight: 600 !important;
              padding: 12px 32px !important;
              height: auto !important;
              box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3) !important;
              transition: all 0.2s ease !important;
            }
            .loadMoreBtn:hover {
              transform: translateY(-2px) !important;
              box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4) !important;
            }

            /* Responsive Design */
            @media (min-width: 640px) {
              .blogsGrid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
              }
              .blogMedia {
                height: 220px;
              }
            }
            
            @media (min-width: 1024px) {
              .blogsGrid {
                grid-template-columns: repeat(3, minmax(0, 1fr));
              }
              .blogMedia {
                height: 240px;
              }
            }
            
            @media (min-width: 1280px) {
              .blogsGrid {
                grid-template-columns: repeat(4, minmax(0, 1fr));
              }
            }

            /* Mobile Optimizations */
            @media (max-width: 639px) {
              .topSection {
                padding: 20px 16px;
                margin-bottom: 16px;
              }
              .tabRow {
                flex-wrap: wrap;
                justify-content: center;
                gap: 4px;
              }
              .tabItem {
                padding: 10px 16px;
                font-size: 13px;
              }
              .blogsGridWrap {
                padding: 16px;
              }
              .blogBody {
                padding: 20px;
              }
              .blogMedia {
                height: 200px;
              }
              .blogTitle {
                font-size: 18px;
              }
              .loadMoreBtn {
                padding: 10px 24px !important;
                font-size: 14px !important;
              }
            }

            /* Loading States */
            .blogCard {
              animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            /* Focus States for Accessibility */
            .tabItem:focus,
            .btnOpen:focus,
            .btnShare:focus {
              outline: 2px solid #4f46e5;
              outline-offset: 2px;
            }
            
            .blogTitle:focus,
            .blogDesc:focus {
              outline: 2px solid #4f46e5;
              outline-offset: 2px;
              border-radius: 4px;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;