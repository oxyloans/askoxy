import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCampaigns,
  fetchAllGames,
  Campaign,
} from "../components/servicesapi";
import { message, Empty, Button, Tooltip, Pagination, Spin } from "antd";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // 6 blogs per page
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const prevTabRef = useRef<TabKey>("ALL");

  const userId =
    localStorage.getItem("userId") ||
    localStorage.getItem("customerId") ||
    localStorage.getItem("user_id") ||
    "";

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
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
    const filteredCampaigns = (campaigns as any[])
      .filter((c: any) => c.campaignStatus === true && c.campainInputType === "BLOG");
    
    // Sort by most recent date first (same logic as AllCampaignDetail.tsx)
    const sortedCampaigns = filteredCampaigns.sort((a: any, b: any) => {
      const dateA = Number(a.createdAt) || 0;
      const dateB = Number(b.createdAt) || 0;
      return dateB - dateA; // Most recent first
    });
    
    return sortedCampaigns;
  }, [campaigns]);

  const gamesCampaigns = useMemo(() => {
    const filtered = (games as any[]).filter(
      (c: any) => c.campaignStatus === true
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

    // Calculate pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return list.slice(startIndex, endIndex);
  }, [activeTab, myBlogs, gamesCampaigns, blogCampaigns, currentPage, pageSize]);

  const totalItems = useMemo(() => {
    if (activeTab === "MY") return myBlogs.length;
    else if (activeTab === "GAMES") return gamesCampaigns.length;
    else return blogCampaigns.length;
  }, [activeTab, myBlogs.length, gamesCampaigns.length, blogCampaigns.length]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    setCurrentPage(1); // Reset to first page when changing tabs
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
          {list.map((campaign, index) => {
            const mediaUrl = getMediaUrl(campaign);
            const showImage = !!mediaUrl && isImage(mediaUrl);
            const showVideo = !!mediaUrl && isVideo(mediaUrl);
            const campaignId = getCampaignId(campaign);
            const createdDate = (() => {
              // Use createdAt timestamp (same logic as AllCampaignDetail.tsx)
              const timestamp = Number(campaign.createdAt) || 0;
              
              if (timestamp === 0) return '';
              
              // Convert timestamp to date
              const date = new Date(timestamp);
              
              // Check if date is valid
              if (isNaN(date.getTime())) return '';
              
              return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
            })();

            return (
              <div key={campaignId} className="blogCard" onClick={() => handleCampaignClick(campaign)}>
                <div className={`blogContent ${index % 2 === 0 ? 'normal' : 'reverse'}`}>
                  <div className="blogBody">
                    <h2 className="blogTitle">
                      {formatTitle(getCampaignTitle(campaign)).toUpperCase()}
                    </h2>

                    {/* <div className="blogMeta">
                      <span className="blogDate">
                        {createdDate}
                      </span>
                      <span className="blogCategory">
                        {activeTab === "GAMES" ? "Agentic AI, Artificial Intelligence" : "Agentic AI, Artificial Intelligence"}
                      </span>
                    </div> */}

                    <p className="blogDesc">
                      {(campaign?.campaignDescription || "Click to read full details.").length > 450
                        ? (campaign?.campaignDescription || "Click to read full details.").substring(0, 450) + "..."
                        : (campaign?.campaignDescription || "Click to read full details.")}
                    </p>

                    <div className="blogActions">
                      <Button
                        className="btnReadMore"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCampaignClick(campaign);
                        }}
                      >
                        Read more
                      </Button>
                    </div>
                  </div>

                  <div className="blogMedia">
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
                      <div className="blogMediaFallback">
                        <FileTextOutlined style={{ fontSize: '48px', color: '#ccc' }} />
                      </div>
                    )}
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
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Spin size="large" />
              </div>
            ) : (
              <>
                <BlogsGrid list={visibleList} />

                {totalItems > pageSize && (
                  <div className="paginationSection">
                    <Pagination
                      current={currentPage}
                      total={totalItems}
                      pageSize={pageSize}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                      showQuickJumper={false}
                      showTotal={(total, range) => 
                        `${range[0]}-${range[1]} of ${total} blogs`
                      }
                      className="customPagination"
                    />
                  </div>
                )}
              </>
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
          max-width: 1200px;
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
          padding: 20px 0;
        }

        .blogsGrid {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .blogCard {
          background: #fff;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          transition: all 0.3s ease;
          margin-bottom: 24px;
          cursor: pointer;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .blogCard:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
          border-color: #d1d5db;
        }

        .blogContent {
          display: flex;
          align-items: stretch;
          min-height: 350px;
          gap: 20px;
        }

        .blogContent.reverse {
          flex-direction: row-reverse;
        }

        .blogContent.normal {
          flex-direction: row;
        }

        .blogBody {
          flex: 1;
          padding: 35px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .blogTitle {
          font-size: 22px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1.4;
          margin: 0 0 18px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: color 0.3s ease;
        }

        .blogCard:hover .blogTitle {
          color: #4f46e5;
        }

        .blogMeta {
          margin-bottom: 20px;
        }

        .blogDate {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #06b6d4;
          margin-bottom: 4px;
        }

        .blogDate::before {
          content: '25cf';
          margin-right: 8px;
          color: #06b6d4;
        }

        .blogCategory {
          font-size: 12px;
          color: #06b6d4;
          text-decoration: none;
        }

        .blogDesc {
          color: #4b5563;
          font-size: 16px;
          line-height: 1.7;
          margin: 0 0 30px 0;
          flex: 1;
          transition: color 0.3s ease;
        }

        .blogCard:hover .blogDesc {
          color: #374151;
        }

        .blogActions {
          margin-top: auto;
        }

        .btnReadMore {
          background: linear-gradient(135deg, #4f46e5, #7c3aed) !important;
          border: 1px solid transparent !important;
          color: #fff !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          padding: 8px 20px !important;
          height: auto !important;
          border-radius: 8px !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3) !important;
        }

        .btnReadMore:hover {
          background: linear-gradient(135deg, #3730a3, #6b21a8) !important;
          color: #fff !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4) !important;
        }

        .blogMedia {
          width: 400px;
          height: 350px;
          flex-shrink: 0;
          cursor: pointer;
          overflow: hidden;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
        }

        .blogMediaImg {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .blogMediaFallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
        }

        .paginationSection {
          display: flex;
          justify-content: center;
          padding: 40px 0 20px;
        }

        .customPagination {
          text-align: center;
        }

        .customPagination .ant-pagination-item {
          border: 1px solid #000;
          margin: 0 4px;
        }

        .customPagination .ant-pagination-item-active {
          background: #000;
          border-color: #000;
        }

        .customPagination .ant-pagination-item-active a {
          color: #fff;
        }

        .customPagination .ant-pagination-prev,
        .customPagination .ant-pagination-next {
          border: 1px solid #000;
        }

        .footerSection {
          margin-top: 20px;
        }

        @media (max-width: 768px) {
          .pageWrap {
            padding: 12px;
          }

          .topSection {
            padding: 18px 14px;
            border-radius: 20px;
          }

          .blogsGridWrap {
            padding: 14px 0;
          }

          .blogContent {
            flex-direction: column !important;
          }

          .blogContent.reverse {
            flex-direction: column !important;
          }

          .blogMedia {
            width: 100%;
            height: 200px;
            order: -1;
          }

          .blogBody {
            padding: 20px;
          }

          .blogTitle {
            font-size: 16px;
          }

          .blogDesc {
            font-size: 13px;
          }

          .tabItem {
            width: calc(50% - 6px);
            justify-content: center;
          }

          .tabItem:last-child {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .blogBody {
            padding: 16px;
          }

          .blogTitle {
            font-size: 15px;
          }

          .blogMedia {
            height: 180px;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogsPage;