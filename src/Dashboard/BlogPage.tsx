import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCampaigns,
  fetchAllGames,
  Campaign,
} from "../components/servicesapi";
import { message, Empty, Button, Tooltip } from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  PlusOutlined,
  ArrowRightOutlined,
  ShareAltOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { uploadurlwithId } from "../Config";

const Header1 = React.lazy(() => import("../components/Header"));
const Footer = React.lazy(() => import("../components/Footer"));

type TabKey = "ALL" | "MY" | "GAMES" | "ADD";

const BlogsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [games, setGames] = useState<Campaign[]>([]);
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
    const loadData = async () => {
      try {
        const [campaignList, gameList] = await Promise.all([
          fetchCampaigns(),
          fetchAllGames(),
        ]);

        const normalizedCampaigns = (campaignList as any[]).map(
          (c: any, index: number) => ({
            ...c,
            id: c.id || c.campaignId,
            __originalIndex: index,
          })
        );

        const normalizedGames = (gameList as any[]).map(
          (c: any, index: number) => ({
            ...c,
            id: c.id || c.campaignId,
            __originalIndex: index,
          })
        );

        setCampaigns(normalizedCampaigns as Campaign[]);
        setGames(normalizedGames as Campaign[]);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    loadData();
  }, []);

  const slugify = (text: string) =>
    (text || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);

  const formatTitle = (title: string) => {
    return (title || "")
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getCampaignTitle = (campaign: any) =>
    campaign?.campaignTitle || campaign?.campaignType || "blog";

  const getCampaignId = (campaign: any) =>
    campaign?.campaignId || campaign?.id || "";

  const getCampaignPath = (campaign: any) => {
    const id = getCampaignId(campaign);
    const slug = slugify(getCampaignTitle(campaign));
    return !userId
      ? `/blog/${id.slice(-4)}/${slug}`
      : `/main/blog/${id.slice(-4)}/${slug}`;
  };

  const handleCampaignClick = (campaign: any) => {
    navigate(getCampaignPath(campaign));
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
  const isVideo = (url: string) => /\.(mp4|webm|ogg|mov|m4v)$/i.test(url);

  const getMediaUrl = (campaign: any) => {
    const firstMedia =
      campaign?.imageUrls?.[0]?.imageUrl ||
      campaign?.imageUrls?.[0] ||
      campaign?.imageUrl ||
      campaign?.images?.[0]?.imageUrl ||
      "";

    if (!firstMedia) return "";
    if (/^https?:\/\//i.test(firstMedia)) return firstMedia;
    return `${uploadurlwithId}${firstMedia}`;
  };

  const parseDateValue = (value: any): number => {
    if (value === null || value === undefined || value === "") return 0;

    if (typeof value === "number") {
      return value < 1000000000000 ? value * 1000 : value;
    }

    if (typeof value === "string") {
      const trimmed = value.trim();

      if (!trimmed) return 0;

      if (/^\d+$/.test(trimmed)) {
        const numeric = Number(trimmed);
        return numeric < 1000000000000 ? numeric * 1000 : numeric;
      }

      const parsed = new Date(trimmed).getTime();
      return Number.isNaN(parsed) ? 0 : parsed;
    }

    return 0;
  };

  const getSortTime = (item: any): number => {
    return Math.max(
      parseDateValue(item?.pollEndTime),
      parseDateValue(item?.updatedAt),
      parseDateValue(item?.createdAt),
      parseDateValue(item?.createdDate),
      parseDateValue(item?.campaignCreatedAt),
      parseDateValue(item?.timestamp),
      parseDateValue(item?.date),
      parseDateValue(item?.modifiedAt)
    );
  };

  const sortNewestFirst = (list: any[]) => {
    return [...list].sort((a: any, b: any) => {
      const timeA = getSortTime(a);
      const timeB = getSortTime(b);

      const hasDateA = timeA > 0;
      const hasDateB = timeB > 0;

      if (hasDateA && !hasDateB) return -1;
      if (!hasDateA && hasDateB) return 1;

      if (timeB !== timeA) return timeB - timeA;

      const indexA =
        typeof a?.__originalIndex === "number" ? a.__originalIndex : 999999;
      const indexB =
        typeof b?.__originalIndex === "number" ? b.__originalIndex : 999999;

      return indexA - indexB;
    });
  };

  const blogCampaigns = useMemo(() => {
    return (campaigns as any[])
      .filter((c: any) => c.campaignStatus !== false && c.campainInputType === "BLOG")
      .sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA; // Latest first
      });
  }, [campaigns]);

  const gamesCampaigns = useMemo(() => {
    const filtered = (games as any[]).filter(
      (c: any) => c.campaignStatus !== false
    );
    return sortNewestFirst(filtered);
  }, [games]);
 
  const myBlogs = useMemo(() => {
    return blogCampaigns.filter(
      (c: any) => (c.createdPersonId || "").toString() === (userId || "")
    );
  }, [blogCampaigns, userId]);

  const visibleList = useMemo(() => {
    let list: Campaign[] = [];

    if (activeTab === "MY") list = myBlogs;
    else if (activeTab === "GAMES") list = gamesCampaigns;
    else list = blogCampaigns;

    return list.slice(0, displayCount);
  }, [activeTab, myBlogs, gamesCampaigns, blogCampaigns, displayCount]);

  const hasMoreItems = useMemo(() => {
    let total = 0;

    if (activeTab === "MY") total = myBlogs.length;
    else if (activeTab === "GAMES") total = gamesCampaigns.length;
    else total = blogCampaigns.length;

    return displayCount < total;
  }, [
    activeTab,
    myBlogs.length,
    gamesCampaigns.length,
    blogCampaigns.length,
    displayCount,
  ]);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 20);
  };

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
    setDisplayCount(20);
  };

  const handleShare = (campaign: any) => {
    const shareUrl = window.location.origin + getCampaignPath(campaign);

    if (navigator.share) {
      navigator
        .share({
          title: getCampaignTitle(campaign),
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        message.success("Link copied");
      });
    }
  };

  const BlogsGrid = ({ list }: { list: any[] }) => {
    if (!list || list.length === 0) {
      return (
        <div className="py-10">
          <Empty
            description={
              activeTab === "MY"
                ? "No blogs in My Blogs."
                : activeTab === "GAMES"
                ? "No IPL blogs found."
                : "No blogs found."
            }
          />
        </div>
      );
    }

    return (
      <div className="blogsGridWrap">
        <div className="blogsGrid">
          {list.map((campaign) => {
            const mediaUrl = getMediaUrl(campaign);
            const showImage = !!mediaUrl && isImage(mediaUrl);
            const showVideo = !!mediaUrl && isVideo(mediaUrl);
            const campaignId = getCampaignId(campaign);

            return (
              <div key={campaignId} className="blogCard">
                <div
                  className="blogMedia"
                  onClick={() => handleCampaignClick(campaign)}
                >
                  {showImage ? (
                    <img
                      src={mediaUrl}
                      alt={getCampaignTitle(campaign)}
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
                  <div className="blogMetaRow">
                    <span className="blogTag">
                      {activeTab === "GAMES" ? <TrophyOutlined /> : <FileTextOutlined />}
                      {activeTab === "GAMES" ? "IPL Blog" : "Blog"}
                    </span>

                    {campaign?.createdPersonName && (
                      <span className="authorTag">
                        <UserOutlined />
                        {campaign.createdPersonName}
                      </span>
                    )}
                  </div>

                  <h3
                    className="blogTitle"
                    onClick={() => handleCampaignClick(campaign)}
                  >
                    {formatTitle(getCampaignTitle(campaign))}
                  </h3>

                  <p
                    className="blogDesc"
                    onClick={() => handleCampaignClick(campaign)}
                  >
                    {campaign?.campaignDescription ||
                      "Click to read full details."}
                  </p>

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
                        icon={<ShareAltOutlined />}
                        onClick={() => handleShare(campaign)}
                      >
                        Share
                      </Button>
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
    <div className="min-h-screen bg-[#f6f8fc]">
         <div className="mb-4 p-2">{!userId ? <Header1 /> : null}</div>

      <div className="pageWrap">
        <div className="pageInner">
          <div className="topSection">
            <div className="topHeading">
              <div className="h1">Explore Blogs & Share Your Ideas</div>
              <div className="h2">
                Read trending stories, discover IPL content, and publish your
                own thoughts.
              </div>
              <div className="h3">
                Newest blogs come first with aligned cards and fixed action buttons.
              </div>
            </div>

            <div className="tabsWrap">
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
                className={`tabItem ${activeTab === "GAMES" ? "active" : ""}`}
                onClick={() => onTabClick("GAMES")}
                type="button"
              >
                <TrophyOutlined />
                <span>IPL Blogs</span>
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
            <BlogsGrid list={visibleList} />

            {hasMoreItems && (
              <div className="loadMoreSection">
                <Button
                  className="loadMoreBtn"
                  onClick={handleLoadMore}
                  size="large"
                >
                  Load More
                </Button>
              </div>
            )}
          </div>

          <div className="footerSection">
            <Suspense fallback={<div className="py-8" />}>
              <Footer />
            </Suspense>
          </div>
        </div>
      </div>

      <style>{`
        .pageWrap {
          width: 100%;
          padding: 16px;
        }

        .pageInner {
          max-width: 1440px;
          margin: 0 auto;
        }

        .topSection {
          background:
            radial-gradient(circle at top right, rgba(99, 102, 241, 0.12), transparent 28%),
            radial-gradient(circle at bottom left, rgba(6, 182, 212, 0.10), transparent 26%),
            linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(245,248,255,0.98) 100%);
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 26px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow:
            0 16px 40px rgba(15, 23, 42, 0.05),
            inset 0 1px 0 rgba(255,255,255,0.8);
          backdrop-filter: blur(12px);
        }

        .topHeading {
          text-align: center;
          margin-bottom: 22px;
        }

        .topHeading .h1 {
          font-size: clamp(26px, 4vw, 38px);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.15;
          margin-bottom: 10px;
        }

        .topHeading .h2 {
          font-size: clamp(15px, 2vw, 18px);
          color: #475569;
          font-weight: 600;
          line-height: 1.65;
          max-width: 860px;
          margin: 0 auto 6px;
        }

        .topHeading .h3 {
          font-size: 14px;
          color: #64748b;
          line-height: 1.7;
        }

        .tabsWrap {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
        }

        .tabItem {
          border: 1px solid #dbe4f0;
          background: rgba(255,255,255,0.88);
          color: #334155;
          border-radius: 16px;
          padding: 12px 18px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 6px 14px rgba(15, 23, 42, 0.04);
        }

        .tabItem:hover {
          transform: translateY(-1px);
          border-color: #a5b4fc;
          color: #4338ca;
        }

        .tabItem.active {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 12px 22px rgba(99, 102, 241, 0.28);
        }

        .blogsGridWrap {
          background:
            linear-gradient(180deg, rgba(255,255,255,0.92), rgba(248,250,255,0.98));
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 26px;
          padding: 20px;
          box-shadow:
            0 18px 40px rgba(15, 23, 42, 0.05),
            inset 0 1px 0 rgba(255,255,255,0.8);
          backdrop-filter: blur(12px);
        }

        .blogsGrid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          align-items: stretch;
        }

        .blogCard {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          border-radius: 24px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.98), rgba(246,249,255,0.98));
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow:
            0 14px 32px rgba(15, 23, 42, 0.06),
            inset 0 1px 0 rgba(255,255,255,0.9);
          transition: transform 0.28s ease, box-shadow 0.28s ease;
        }

        .blogCard:hover {
          transform: translateY(-4px);
          box-shadow:
            0 22px 42px rgba(15, 23, 42, 0.10),
            inset 0 1px 0 rgba(255,255,255,0.95);
        }

        .blogMedia {
          position: relative;
          width: 100%;
          height: 240px;
          overflow: hidden;
          cursor: pointer;
          background: linear-gradient(180deg, #eef4ff, #eaf3fb);
          flex-shrink: 0;
        }

        .blogMediaImg {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .blogMediaFallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-weight: 700;
          font-size: 15px;
        }

        .blogBody {
          padding: 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .blogMetaRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .blogTag,
        .authorTag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 999px;
          padding: 7px 12px;
        }

        .blogTag {
          background: rgba(79, 70, 229, 0.10);
          color: #4338ca;
        }

        .authorTag {
          background: rgba(14, 165, 233, 0.10);
          color: #0369a1;
        }

        .blogTitle {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.35;
          margin: 0 0 10px;
          cursor: pointer;
          min-height: 54px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .blogDesc {
          color: #64748b;
          font-size: 14px;
          line-height: 1.7;
          margin: 0 0 16px;
          cursor: pointer;
          min-height: 72px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .blogActions {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btnOpen {
          flex: 1;
          border-radius: 14px !important;
          height: 46px !important;
          font-weight: 700 !important;
          border: none !important;
          background: linear-gradient(135deg, #4f46e5, #7c3aed) !important;
          color: #fff !important;
          box-shadow: 0 10px 22px rgba(79, 70, 229, 0.22) !important;
        }

        .btnShare {
          border-radius: 14px !important;
          height: 46px !important;
          min-width: 92px !important;
          font-weight: 700 !important;
          border: 1px solid #dbe4f0 !important;
          background: #fff !important;
          color: #334155 !important;
        }

        .loadMoreSection {
          display: flex;
          justify-content: center;
          padding: 28px 0 8px;
        }

        .loadMoreBtn {
          background: linear-gradient(135deg, #4f46e5, #7c3aed) !important;
          border: none !important;
          color: #fff !important;
          border-radius: 14px !important;
          font-weight: 700 !important;
          padding: 12px 28px !important;
          height: auto !important;
          box-shadow: 0 10px 22px rgba(79, 70, 229, 0.22) !important;
        }

        .footerSection {
          margin-top: 20px;
        }

        @media (min-width: 640px) {
          .blogsGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 1024px) {
          .blogsGrid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (min-width: 1280px) {
          .blogsGrid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        @media (max-width: 767px) {
          .pageWrap {
            padding: 12px;
          }

          .topSection {
            padding: 18px 14px;
            border-radius: 20px;
          }

          .blogsGridWrap {
            padding: 14px;
            border-radius: 20px;
          }

          .blogMedia {
            height: 210px;
          }

          .blogBody {
            padding: 16px;
          }

          .blogTitle {
            font-size: 17px;
            min-height: 48px;
          }

          .blogDesc {
            min-height: 68px;
            font-size: 13px;
          }

          .tabItem {
            width: calc(50% - 6px);
            justify-content: center;
          }

          .tabItem:last-child {
            width: 100%;
          }

          .blogActions {
            flex-wrap: nowrap;
            gap: 10px;
          }

          .btnOpen {
            width: calc(100% - 96px);
            height: 44px !important;
            font-size: 13px !important;
          }

          .btnShare {
            width: 86px !important;
            min-width: 86px !important;
            max-width: 86px !important;
            height: 44px !important;
            font-size: 13px !important;
            padding: 0 10px !important;
          }
        }

        @media (max-width: 420px) {
          .blogMedia {
            height: 190px;
          }

          .blogActions {
            gap: 8px;
          }

          .btnOpen {
            width: calc(100% - 84px);
          }

          .btnShare {
            width: 76px !important;
            min-width: 76px !important;
            max-width: 76px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogsPage;