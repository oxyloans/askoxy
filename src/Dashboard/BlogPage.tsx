import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCampaigns,
  fetchAllGames,
  Campaign,
} from "../components/servicesapi";
import { message, Empty, Button, Pagination, Spin, Modal, Input } from "antd";
import axios from "axios";
import {
  FileTextOutlined,
  UserOutlined,
  PlusOutlined,
  TrophyOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { uploadurlwithId } from "../Config";
import axiosInstance from "../utils/axiosInstance";
import BASE_URL from "../Config";

const Header1 = React.lazy(() => import("../components/Header"));
const Footer = React.lazy(() => import("../components/Footer"));

type TabKey = "ALL" | "MY" | "GAMES" | "ADD";

const BlogsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [myBlogs, setMyBlogs] = useState<Campaign[]>([]);
  const [games, setGames] = useState<Campaign[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);
  const [isLoading, setIsLoading] = useState(true);

  // Edit modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editCampaign, setEditCampaign] = useState<Campaign | null>(null);
  const [editDesc, setEditDesc] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [editFileList, setEditFileList] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [imageErrorMessage, setImageErrorMessage] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  const navigate = useNavigate();
  const prevTabRef = useRef<TabKey>("ALL");

  const userId =
    localStorage.getItem("userId") ||
    localStorage.getItem("customerId") ||
    localStorage.getItem("user_id") ||
    "";

  const loadMyBlogs = async () => {
    if (!userId) return;
    try {
      const { data } = await axiosInstance.get(
        `${BASE_URL}/marketing-service/campgin/getAllCampaignDetails?createdPersonId=${userId}`,
      );
      const list = Array.isArray(data) ? data : data?.data || [];
      const normalized = list.map((c: any, index: number) => ({
        ...c,
        campaignId: c.campaignId || c.id || "",
        id: c.id || c.campaignId || "",
        imageUrls: Array.isArray(c.imageUrls)
          ? c.imageUrls
          : c.imageUrl
            ? [{ imageUrl: c.imageUrl, status: true }]
            : [],
        __originalIndex: index,
      }));
      const sorted = normalized
        .filter((c: any) => c.campainInputType === "BLOG")
        .sort(
          (a: any, b: any) =>
            (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0),
        );
      setMyBlogs(sorted as Campaign[]);
    } catch (err) {
      console.error("Error loading my blogs:", err);
    }
  };

  const loadAllBlogsAndGames = async () => {
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
          imageUrls: Array.isArray(c.imageUrls)
            ? c.imageUrls
            : c.imageUrl
              ? [{ imageUrl: c.imageUrl, status: true }]
              : [],
          __originalIndex: index,
        }),
      );

      const normalizedGames = (gameList as any[]).map(
        (c: any, index: number) => ({
          ...c,
          id: c.id || c.campaignId,
          imageUrls: Array.isArray(c.imageUrls)
            ? c.imageUrls
            : c.imageUrl
              ? [{ imageUrl: c.imageUrl, status: true }]
              : [],
          __originalIndex: index,
        }),
      );

      setCampaigns(normalizedCampaigns as Campaign[]);
      setGames(normalizedGames as Campaign[]);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllBlogsAndGames();
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
  const isVideo = (url: string) =>
    /\.(mp4|webm|ogg|mov|m4v|avi|wmv|flv|mkv)$/i.test(url);

  const buildMediaUrl = (url: string) => {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    return `${uploadurlwithId}${url}`;
  };

  const getMediaUrl = (campaign: any) => {
    const firstMedia =
      campaign?.imageUrls?.[0]?.imageUrl ||
      campaign?.imageUrls?.[0] ||
      campaign?.imageUrl ||
      campaign?.images?.[0]?.imageUrl ||
      "";

    if (!firstMedia) return "";
    return buildMediaUrl(firstMedia);
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
      parseDateValue(item?.modifiedAt),
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
    const filteredCampaigns = (campaigns as any[]).filter(
      (c: any) => c.campaignStatus === true && c.campainInputType === "BLOG",
    );

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
      (c: any) => c.campaignStatus === true,
    );
    return sortNewestFirst(filtered);
  }, [games]);

  // myBlogs is now from its own API call (state), not filtered from all campaigns

  const visibleList = useMemo(() => {
    let list: Campaign[] = [];
    if (activeTab === "MY") list = myBlogs;
    else if (activeTab === "GAMES") list = gamesCampaigns;
    else list = blogCampaigns;
    const startIndex = (currentPage - 1) * pageSize;
    return list.slice(startIndex, startIndex + pageSize);
  }, [
    activeTab,
    myBlogs,
    gamesCampaigns,
    blogCampaigns,
    currentPage,
    pageSize,
  ]);

  const totalItems = useMemo(() => {
    if (activeTab === "MY") return myBlogs.length;
    if (activeTab === "GAMES") return gamesCampaigns.length;
    return blogCampaigns.length;
  }, [activeTab, myBlogs.length, gamesCampaigns.length, blogCampaigns.length]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const isLoggedInUser = Boolean(userId);
  const visibleTabs: TabKey[] = isLoggedInUser
    ? ["MY", "ALL", "GAMES"]
    : ["ALL", "GAMES"];

  useEffect(() => {
    if (!isLoggedInUser && activeTab === "MY") {
      setActiveTab("ALL");
      setCurrentPage(1);
    }
  }, [isLoggedInUser, activeTab]);

  const handleStatusToggle = (campaign: Campaign) => {
    Modal.confirm({
      title: "Confirm",
      content: `Are you sure you want to update to ${!campaign.campaignStatus ? "Active" : "Inactive"}?`,
      okText: "Yes",
      onOk: async () => {
        try {
          const response = await axiosInstance.patch(
            `${BASE_URL}/marketing-service/campgin/activate-deactivate-campaign`,
            {
              askOxyCampaignDto: [
                {
                  addServiceType:
                    (campaign as any).addServiceType === "WEAREHIRING"
                      ? "WEAREHIRING"
                      : null,
                  campaignDescription: campaign.campaignDescription,
                  campaignId: campaign.campaignId,
                  campaignStatus: !campaign.campaignStatus,
                  campaignType: campaign.campaignType,
                  campaignTypeAddBy: campaign.campaignTypeAddBy,
                  campainInputType: campaign.campainInputType,
                  createdPersonId: userId,
                  images: (campaign.imageUrls || []).map((img: any) => ({
                    imageId: img.imageId,
                    imageUrl: img.imageUrl,
                    status: img.status,
                  })),
                  socialMediaCaption: campaign.socialMediaCaption,
                },
              ],
            },
          );
          if (response.status === 200) {
            message.success("Status updated successfully.");
            loadMyBlogs();
          } else {
            message.error("Failed to update status.");
          }
        } catch {
          message.error("Error while updating status.");
        }
      },
    });
  };

  const handleEditOpen = (campaign: Campaign) => {
    const existingImages = Array.isArray((campaign as any).imageUrls)
      ? (campaign as any).imageUrls
      : (campaign as any).imageUrl
        ? [{ imageUrl: (campaign as any).imageUrl, status: true }]
        : [];

    setEditCampaign(campaign);
    setEditDesc(campaign.campaignDescription || "");
    setEditCaption(campaign.socialMediaCaption || "");
    setEditFileList(
      existingImages.map((img: any) => ({
        imageId: img.imageId || img.id || "",
        imageUrl: img.imageUrl || img.documentPath || img.url || img,
        status: img.status !== undefined ? img.status : true,
        isNew: false,
      })),
    );
    setImageErrorMessage("");
    setEditModalVisible(true);
  };

  const handleRemoveEditFile = (index: number) => {
    setEditFileList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setImageErrorMessage("");
    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const response = await axios.post(
          "https://meta.oxyloans.com/api/upload-service/upload?id=45880e62-acaf-4645-a83e-d1c8498e923e&fileType=aadhar",
          uploadFormData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );

        if (response.data?.uploadStatus === "UPLOADED") {
          setEditFileList((prev) => [
            ...prev,
            {
              imageUrl: response.data.documentPath,
              status: true,
              uploadId: response.data.id,
              isNew: true,
            },
          ]);
        } else {
          setImageErrorMessage("Failed to upload the file. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setImageErrorMessage("Failed to upload the file. Please try again.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleEditSubmit = async () => {
    if (!editCampaign) return;
    setEditSubmitting(true);
    try {
      const response = await axiosInstance.patch(
        `${BASE_URL}/marketing-service/campgin/addCampaignTypes`,
        {
          askOxyCampaignDto: [
            {
              campaignDescription: editDesc,
              campaignId: editCampaign.campaignId,
              campaignType: editCampaign.campaignType,
              campaignTypeAddBy: editCampaign.campaignTypeAddBy,
              campainInputType: editCampaign.campainInputType,
              socialMediaCaption: editCaption,
              createdPersonId: userId,
              images: editFileList.map((img: any) => {
                const imagePayload: any = {
                  imageUrl: img.imageUrl,
                  status: img.status !== undefined ? img.status : true,
                };

                // Existing campaign images need imageId. Newly uploaded files should be sent
                // like AllCampaignDetail.tsx: imageUrl + status only. Sending upload id as
                // imageId can stop the backend from attaching the new image to the campaign.
                if (!img.isNew && img.imageId) {
                  imagePayload.imageId = img.imageId;
                }

                return imagePayload;
              }),
            },
          ],
        },
      );
      if (response.data) {
        message.success("Blog updated successfully.");
        setEditModalVisible(false);
        setEditFileList([]);
        await Promise.all([loadMyBlogs(), loadAllBlogsAndGames()]);
      } else {
        message.error("Failed to update blog.");
      }
    } catch {
      message.error("Failed to update blog.");
    } finally {
      setEditSubmitting(false);
    }
  };

  const onTabClick = (tab: TabKey) => {
    if (tab === "ADD") {
      const backTo = prevTabRef.current || "ALL";
      setActiveTab("ADD");
      handleAddBlog();
      setTimeout(() => setActiveTab(backTo), 150);
      return;
    }
    if (tab === "MY" && userId) {
      loadMyBlogs();
    }
    prevTabRef.current = tab;
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const getInitials = (text: string) => {
    const words = (text || "").trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return (text || "").substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (text: string) => {
    const colors = [
      "#008cba",
      "#1ab394",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#06b6d4",
    ];
    const index = (text || "").length % colors.length;
    return colors[index];
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
        <div style={{ padding: "60px 0", textAlign: "center" }}>
          <Empty
            description={
              activeTab === "MY"
                ? "No blogs found. Click 'Add Blog' to write your first blog!"
                : activeTab === "GAMES"
                  ? "No IPL blogs found."
                  : "No blogs found."
            }
          />
        </div>
      );
    }

    return (
      <div className="bpCardsGrid">
        {list.map((campaign) => {
          const mediaUrl = getMediaUrl(campaign);
          const showImage = !!mediaUrl && isImage(mediaUrl);
          const showVideo = !!mediaUrl && isVideo(mediaUrl);
          const cId = getCampaignId(campaign);
          const title = formatTitle(getCampaignTitle(campaign));
          const ts = Number(campaign.createdAt) || 0;
          const cDate = ts
            ? new Date(ts).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "";

          return (
            <div
              key={cId}
              className="bpCard"
              onClick={() => handleCampaignClick(campaign)}
            >
              {/* Image area */}
              <div className="bpCardImg">
                {showImage ? (
                  <img src={mediaUrl} alt={title} loading="lazy" />
                ) : showVideo ? (
                  <video src={mediaUrl} autoPlay muted loop playsInline />
                ) : (
                  <div
                    className="bpCardImgFallback"
                    style={{
                      background: getAvatarColor(title),
                    }}
                  >
                    <span className="bpCardInitials">{getInitials(title)}</span>
                  </div>
                )}
                <span className="bpBadge">
                  {activeTab === "GAMES" ? "IPL" : "Blog"}
                </span>
              </div>

              {/* Content area */}
              <div className="bpCardBody">
                {cDate && <span className="bpDate">{cDate}</span>}
                <h3 className="bpCardTitle">{title}</h3>
                <p className="bpCardDesc">
                  {(campaign?.campaignDescription || "").length > 240
                    ? campaign.campaignDescription.substring(0, 240) + "..."
                    : campaign?.campaignDescription || ""}
                </p>
                <div className="bpCardActions">
                  <Button
                    size="middle"
                    type="primary"
                    style={{
                      background: "#2563EB",
                      borderColor: "#2563EB",
                      color: "#fff",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCampaignClick(campaign);
                    }}
                  >
                    Read More
                  </Button>

                  {activeTab === "MY" && (
                    <>
                      <Button
                        size="middle"
                        icon={<EditOutlined />}
                        style={{
                          background: "#008cba",
                          borderColor: "#008cba",
                          color: "#fff",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditOpen(campaign);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        size="middle"
                        style={{
                          background: campaign.campaignStatus
                            ? "#10B981"
                            : "#EF4444",
                          borderColor: campaign.campaignStatus
                            ? "#008cba"
                            : "#EF4444",
                          color: "#fff",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusToggle(campaign);
                        }}
                      >
                        {campaign.campaignStatus ? "Active" : "Inactive"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: "#fff" }}>
      {!userId && (
        <Suspense fallback={null}>
          <Header1 />
        </Suspense>
      )}

      <div className="bpWrap" style={{ paddingTop: isLoggedInUser ? 16 : 80 }}>
        <div className="bpInner">
          {/* ── Row 1: Title left | Add Blog right ── */}
          <div className="bpHeaderRow">
            <div className="bpHeaderText">
              <h1 className="bpTitle">Explore Blogs &amp; Share Your Ideas</h1>
              <p className="bpSubtitle">
                Read trending stories, discover IPL content, and publish your
                own thoughts.
              </p>
            </div>
            <Button
              type="primary"
              size="middle"
              icon={<PlusOutlined />}
              onClick={handleAddBlog}
              style={{
                background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                borderColor: "#2563EB",
                color: "#fff",
                fontWeight: 700,
                borderRadius: "10px",
                minHeight: "42px",
                padding: "0 18px",
                whiteSpace: "nowrap",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
              }}
            >
              Add Blog
            </Button>
          </div>

          {/* ── Row 2: Tabs ── */}
          <div className="bpTabsRow">
            {visibleTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`bpTab ${
                  activeTab === tab
                    ? tab === "MY"
                      ? "bpTabMy"
                      : tab === "ALL"
                        ? "bpTabAll"
                        : "bpTabGames"
                    : ""
                }`}
                onClick={() => onTabClick(tab)}
              >
                {tab === "MY" && <UserOutlined />}
                {tab === "ALL" && <FileTextOutlined />}
                {tab === "GAMES" && <TrophyOutlined />}
                <span>
                  {tab === "MY"
                    ? "My Blogs"
                    : tab === "ALL"
                      ? "All Blogs"
                      : "IPL Blogs"}
                </span>
              </button>
            ))}
          </div>

          {/* ── Content ── */}
          <div style={{ marginTop: 20 }}>
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "60px 0",
                }}
              >
                <Spin size="large" />
              </div>
            ) : (
              <>
                <BlogsGrid list={visibleList} />
                {totalItems > pageSize && (
                  <div className="bpPagination">
                    <Pagination
                      current={currentPage}
                      total={totalItems}
                      pageSize={pageSize}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                      showTotal={(total, range) =>
                        window.innerWidth > 768
                          ? `${range[0]}-${range[1]} of ${total} blogs`
                          : ""
                      }
                      responsive
                    />
                  </div>
                )}
              </>
            )}
          </div>

          <div style={{ marginTop: 24 }}>
            <Suspense fallback={<div style={{ height: 32 }} />}>
              <Footer />
            </Suspense>
          </div>
        </div>
      </div>

      {/* ── Edit Blog Modal ── */}
      <Modal
        title={
          <div
            style={{
              background: "linear-gradient(135deg,#008cba,#1ab394)",
              margin: "-20px -24px 0",
              padding: "18px 24px",
              borderRadius: "8px 8px 0 0",
            }}
          >
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 17 }}>
              <EditOutlined style={{ marginRight: 8 }} />
              Edit Blog
            </span>
          </div>
        }
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditFileList([]);
          setImageErrorMessage("");
        }}
        footer={[
          <Button
            key="cancel"
            size="middle"
            onClick={() => {
              setEditModalVisible(false);
              setEditFileList([]);
              setImageErrorMessage("");
            }}
          >
            Cancel
          </Button>,
          <Button
            key="save"
            size="middle"
            loading={editSubmitting}
            onClick={handleEditSubmit}
            style={{
              background: "#1ab394",
              borderColor: "#1ab394",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            {editSubmitting ? "Saving..." : "Save Changes"}
          </Button>,
        ]}
        width={620}
        styles={{ body: { paddingTop: 24 } }}
      >
        {editCampaign && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label className="bpLabel">Blog Title</label>
              <Input
                value={editCampaign.campaignType}
                onChange={() => {}}
                style={{ borderColor: "#008cba" }}
              />
            </div>
            <div>
              <label className="bpLabel">Description</label>
              <Input.TextArea
                rows={6}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                style={{ borderColor: "#008cba" }}
                placeholder="Write your blog description..."
              />
            </div>
            <div>
              <label className="bpLabel">Social Media Caption</label>
              <Input.TextArea
                rows={3}
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                maxLength={250}
                // showCount
                style={{ borderColor: "#1ab394" }}
                placeholder="Caption for social media sharing..."
              />
            </div>
            <div>
              <label className="bpLabel">Images / Videos</label>

              {editFileList.length > 0 && (
                <div className="bpEditMediaGrid">
                  {editFileList
                    .filter((file: any) => file.status !== false)
                    .map((file: any, index: number) => {
                      const mediaUrl = buildMediaUrl(file.imageUrl || "");
                      const showImage = isImage(mediaUrl);
                      const showVideo = isVideo(mediaUrl);

                      return (
                        <div
                          className="bpEditMediaItem"
                          key={`${file.imageId || file.imageUrl}-${index}`}
                        >
                          {showImage ? (
                            <img
                              src={mediaUrl}
                              alt={`Blog media ${index + 1}`}
                            />
                          ) : showVideo ? (
                            <video src={mediaUrl} controls />
                          ) : (
                            <div className="bpEditMediaFallback">File</div>
                          )}
                          <button
                            type="button"
                            className="bpEditMediaRemove"
                            onClick={() => handleRemoveEditFile(index)}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                </div>
              )}

              <label className="bpUploadLabel">
                <div className="bpUploadButton">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                  <span>Choose Images/Videos</span>
                </div>
                <input
                  type="file"
                  onChange={handleUploadChange}
                  multiple
                  accept=".jpg,.jpeg,.png,.gif,.webp,.mp4,.avi,.mov,.wmv,.flv,.webm,.mkv"
                  className="hidden"
                />
              </label>

              {isUploading && (
                <div className="bpUploadingText">
                  <div className="bpUploadingSpinner"></div>
                  Uploading...
                </div>
              )}

              {imageErrorMessage && (
                <div className="bpImageError">{imageErrorMessage}</div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        .bpWrap { width: 100%; padding-bottom: 40px; }
        .bpInner { max-width: 1200px; margin: 0 auto; padding: 0 16px; }

        /* Header row */
        .bpHeaderRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 0 12px;
          margin-bottom: 10px;
          /* border-bottom: 1px solid #e5e7eb; */
        }
        .bpHeaderText { flex: 1; min-width: 0; }
        .bpTitle {
          font-size: clamp(15px, 2.2vw, 20px);
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 2px;
          line-height: 1.2;
        }
        .bpSubtitle {
          font-size: clamp(12px, 1.4vw, 13px);
          color: #64748b;
          margin: 0;
          line-height: 1.4;
        }

        /* Tabs row */
        .bpTabsRow {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 10px 0 12px;
          margin-bottom: 20px;
          border-bottom: 1px solid #e5e7eb;
        }
        .bpTab {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          border-radius: 6px;
          border: 1.5px solid #e2e8f0;
          background: transparent;
          color: #475569;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.18s ease;
        }
/* MY BLOGS */
.bpTabMy:hover,
.bpTabMy {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: #fff !important;
  border-color: transparent !important;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.35);
}

/* ALL BLOGS */
.bpTabAll:hover,
.bpTabAll {
  background: linear-gradient(135deg, #2563EB, #1D4ED8);
  color: #fff !important;
  border-color: transparent !important;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
}

/* IPL BLOGS */
.bpTabGames:hover,
.bpTabGames {
  background: linear-gradient(135deg, #F59E0B, #D97706);
  color: #fff !important;
  border-color: transparent !important;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
}

        /* 3-col grid */
        .bpCardsGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
          .bpCardImgFallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bpCardInitials {
  font-size: 64px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 3px;
  text-transform: uppercase;
}

        /* Card */
        .bpCard {
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          transition: box-shadow 0.22s, transform 0.22s;
        }
        .bpCard:hover {
          box-shadow: 0 10px 30px rgba(0,140,186,0.14);
          transform: translateY(-4px);
        }

        /* Image box — fixed height, object-contain, no crop */
        .bpCardImg {
          position: relative;
          width: 100%;
          height: 200px;
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          flex-shrink: 0;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bpCardImg img,
        .bpCardImg video {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          transition: transform 0.35s ease;
        }
        .bpCard:hover .bpCardImg img,
        .bpCard:hover .bpCardImg video { transform: scale(1.04); }

        /* Fallback: no image — show title text on gradient bg */
        .bpCardImgFallback {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .bpCardImgTitle {
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          text-align: center;
          line-height: 1.4;
          letter-spacing: 0.3px;
        }

        /* Badge */
        .bpBadge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: linear-gradient(135deg, #008cba, #1ab394);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 20px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          z-index: 1;
        }

        /* Card body */
        .bpCardBody {
          padding: 16px 18px 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .bpDate {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 500;
          margin-bottom: 6px;
          display: block;
        }
        .bpCardTitle {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.4;
          margin: 0 0 8px;
        }
        .bpCard:hover .bpCardTitle { color: #008cba; }
        .bpCardDesc {
          font-size: 12px;
          color: #6b7280;
          line-height: 1.6;
          flex: 1;
          margin: 0 0 14px;
        }
      .bpCardActions {
  display: flex;
  gap: 8px;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
}

.bpCardActions .ant-btn {
  flex: 1;
  height: 40px;
  border-radius: 8px;
  font-weight: 600;
}

        /* Pagination */
        .bpPagination {
          display: flex;
          justify-content: center;
          padding: 32px 0 16px;
        }

        /* Modal label */
        .bpLabel {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 5px;
        }

        .bpEditMediaGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 12px;
        }
        .bpEditMediaItem {
          position: relative;
          height: 105px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
          background: #f8fafc;
        }
        .bpEditMediaItem img,
        .bpEditMediaItem video {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        .bpEditMediaFallback {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
        }
        .bpEditMediaRemove {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 24px;
          height: 24px;
          border: none;
          border-radius: 999px;
          background: #ef4444;
          color: #fff;
          font-size: 18px;
          line-height: 20px;
          cursor: pointer;
        }
        .bpUploadLabel { display: inline-block; }
        .bpUploadButton {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 14px;
          background: #2563eb;
          color: #fff;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s ease;
          font-size: 13px;
          font-weight: 700;
        }
        .bpUploadButton:hover { background: #1d4ed8; }
        .bpUploadButton svg { width: 18px; height: 18px; }
        .hidden { display: none; }
        .bpUploadingText {
          display: flex;
          align-items: center;
          margin-top: 8px;
          font-size: 13px;
          color: #4b5563;
        }
        .bpUploadingSpinner {
          width: 16px;
          height: 16px;
          margin-right: 8px;
          border: 2px solid #e5e7eb;
          border-top-color: #2563eb;
          border-radius: 999px;
          animation: bpSpin 0.8s linear infinite;
        }
        .bpImageError {
          margin-top: 8px;
          color: #dc2626;
          font-size: 12px;
          font-weight: 600;
        }
        @keyframes bpSpin { to { transform: rotate(360deg); } }


        /* Tablet: 2 cols */
        @media (max-width: 1024px) {
          .bpCardsGrid { grid-template-columns: repeat(2, 1fr); gap: 18px; }
        }

        /* Mobile: 1 col */
        @media (max-width: 640px) {
          .bpEditMediaGrid { grid-template-columns: repeat(2, 1fr); }
          .bpHeaderRow { flex-direction: column; align-items: flex-start; padding: 10px 0 8px; }
          .bpHeaderRow .ant-btn { width: 100%; justify-content: center; }
          .bpTabsRow { gap: 6px; }
          .bpTab { flex: 1; justify-content: center; padding: 7px 8px; font-size: 12px; }
          .bpCardsGrid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .bpCardImg { height: 160px; }
          .bpCardTitle { font-size: 13px; }
          .bpCardDesc { font-size: 11px; }
          .bpCardBody { padding: 12px 14px 14px; }
        }
        @media (max-width: 420px) {
          .bpCardsGrid { grid-template-columns: 1fr; }
          .bpCardImg { height: 180px; }
          .bpTab { font-size: 11px; padding: 6px 6px; }
        }
      `}</style>
    </div>
  );
};

export default BlogsPage;
