import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCampaigns, Campaign } from "../components/servicesapi";
import { message, Empty, Button, Tooltip } from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  PlusOutlined,
  ExportOutlined,
  ShareAltOutlined,
  CopyOutlined,
  StarOutlined,
} from "@ant-design/icons";

const Header1 = React.lazy(() => import("../components/Header"));
const Footer = React.lazy(() => import("../components/Footer"));

type TabKey = "ALL" | "MY" | "ADD";

const BlogsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("ALL");

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
    return (campaigns as any[]).filter(
      (c: any) => c.campaignStatus !== false && c.campainInputType === "BLOG"
    );
  }, [campaigns]);

  const myBlogs = useMemo(() => {
    return blogCampaigns.filter(
      (c: any) => (c.createdPersonId || "").toString() === (userId || "")
    );
  }, [blogCampaigns, userId]);

  const visibleBlogs = useMemo(() => {
    if (activeTab === "MY") return myBlogs;
    return blogCampaigns;
  }, [activeTab, blogCampaigns, myBlogs]);

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
            const mediaUrl = campaign.imageUrls?.[0]?.imageUrl;
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
                    {campaign.campaignType}
                  </h3>

                  <p className="blogDesc" onClick={() => handleCampaignClick(campaign)}>
                    {campaign.campaignDescription}
                  </p>

                  {/* ✅ 4 colorful buttons like screenshot */}
                  <div className="blogActions">
                    <Button
                      className="btnOpen"
                      icon={<ExportOutlined />}
                      onClick={() => handleCampaignClick(campaign)}
                    >
                      Open
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

                  {activeTab === "ALL" && (
                    <div className="blogAuthor">Author: {campaign.campaignTypeAddBy || "-"}</div>
                  )}
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
      <div className="mb-3 p-2">
        {!userId ? (
          <Suspense fallback={<div className="p-2" />}>
            <Header1 />
          </Suspense>
        ) : null}
      </div>

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
          </div>

          <Suspense fallback={<div className="py-8" />}>
            <Footer />
          </Suspense>

          {/* ✅ Styles to match screenshot-like tabs + colorful buttons */}
          <style>{`
            .topSection{
              background: #fff;
              border: 1px solid #EEF2FF;
              border-radius: 16px;
              padding: 14px;
              box-shadow: 0 10px 24px rgba(2,6,23,.05);
              display:flex;
              flex-direction: column;
              gap: 12px;
            }
            .topHeading .h1{
              font-size: 28px;
              font-weight: 900;
              color:#0F172A;
              line-height: 1.1;
            }
            .topHeading .h2{
              margin-top: 6px;
              font-size: 14px;
              color:#475569;
              font-weight: 600;
            }
            .coin{ color:#6D28D9; font-weight: 900; }

            /* Tabs like image: active purple pill, others simple */
            .tabRow{
              display:flex;
              align-items:center;
              justify-content:flex-start;
              gap: 10px;
              overflow-x:auto;
              -webkit-overflow-scrolling: touch;
              padding-bottom: 2px;
            }
            .tabRow::-webkit-scrollbar{ height: 6px; }
            .tabRow::-webkit-scrollbar-thumb{ background:#E5E7EB; border-radius:999px; }

            .tabItem{
              border: 1px solid transparent;
              background: transparent;
              padding: 9px 12px;
              border-radius: 10px;
              font-weight: 800;
              color:#0F172A;
              cursor:pointer;
              display:flex;
              align-items:center;
              gap: 8px;
              white-space: nowrap;
              transition: all .16s ease;
            }
            .tabItem:hover{
              background:#F8FAFC;
              border-color:#E2E8F0;
            }
            .tabItem.active{
              background:#7C3AED; /* purple */
              color:#fff;
              border-color:#7C3AED;
              box-shadow: 0 10px 20px rgba(124,58,237,.22);
            }
            .tabItem :where(svg){
              font-size: 16px;
            }

            /* Grid */
            .blogsGridWrap{
              background:#F8FAFC;
              border: 1px solid #EEF2FF;
              border-radius: 16px;
              padding: 12px;
            }
            .blogsGrid{
              display:grid;
              grid-template-columns: 1fr;
              gap: 14px;
            }

            /* Card */
            .blogCard{
              background:#fff;
              border: 1px solid #F1F5F9;
              border-radius: 16px;
              overflow:hidden;
              display:flex;
              flex-direction:column;
              box-shadow: 0 10px 24px rgba(2,6,23,.06);
            }
            .blogMedia{
              height: 170px;
              background:#F1F5F9;
              overflow:hidden;
              cursor:pointer;
            }
            .blogMediaImg{
              width:100%;
              height:100%;
              object-fit:cover;
              transition: transform .2s ease;
            }
            .blogMedia:hover .blogMediaImg{ transform: scale(1.03); }
            .blogMediaFallback{
              height:100%;
              display:flex;
              align-items:center;
              justify-content:center;
              color:#94A3B8;
              font-weight:800;
            }
            .blogBody{
              padding: 14px;
              display:flex;
              flex-direction:column;
              gap: 10px;
              flex: 1;
            }
            .blogTitle{
              margin:0;
              font-size: 18px;
              font-weight: 900;
              color:#0F172A;
              line-height: 1.2;
              cursor:pointer;
              display:-webkit-box;
              -webkit-line-clamp:2;
              -webkit-box-orient:vertical;
              overflow:hidden;
            }
            .blogDesc{
              margin:0;
              color:#475569;
              line-height: 1.5;
              cursor:pointer;
              display:-webkit-box;
              -webkit-line-clamp:3;
              -webkit-box-orient:vertical;
              overflow:hidden;
              flex:1;
            }

            /* 4 colorful buttons */
            .blogActions{
              display:flex;
              align-items:center;
              gap: 10px;
              margin-top: 2px;
            }
            .btnOpen{
              border-radius: 999px !important;
              font-weight: 900 !important;
              background:#7C3AED !important;
              border-color:#7C3AED !important;
              color:#fff !important;
              box-shadow: 0 10px 18px rgba(124,58,237,.22);
            }
            .btnShare{
              border-radius: 999px !important;
              background:#3B82F6 !important; /* blue */
              border-color:#3B82F6 !important;
              color:#fff !important;
            }
            .btnCopy{
              border-radius: 999px !important;
              background:#22C55E !important; /* green */
              border-color:#22C55E !important;
              color:#fff !important;
            }
            .btnSave{
              border-radius: 999px !important;
              background:#F59E0B !important; /* orange */
              border-color:#F59E0B !important;
              color:#fff !important;
            }

            .blogAuthor{
              margin-top: 4px;
              font-size: 12px;
              font-weight: 800;
              color:#64748B;
            }

            @media (min-width: 640px){
              .blogsGrid{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
              .blogMedia{ height: 190px; }
            }
            @media (min-width: 1280px){
              .blogsGrid{ grid-template-columns: repeat(3, minmax(0, 1fr)); }
              .blogMedia{ height: 200px; }
            }

            @media (max-width: 767px){
              .topHeading .h1{ font-size: 24px; }
              .topHeading .h2{ font-size: 13px; }
              .blogMedia{ height: 165px; }
              .tabItem{ padding: 8px 11px; }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;