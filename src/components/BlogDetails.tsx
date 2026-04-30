import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input, message, Modal, Spin } from "antd";
import {
  DislikeFilled,
  DislikeOutlined,
  HeartFilled,
  HeartOutlined,
  LoadingOutlined,
  UserOutlined,
  TrophyOutlined,
  ShareAltOutlined,
  SoundOutlined,
  LeftOutlined,
  RightOutlined,
  MessageOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import Header1 from "../components/Header";
import {
  fetchCampaigns,
  fetchAllGames,
  fetchLikesAndComments,
  submitUserInteraction,
  submitSubComment,
  submitWriteToUsQuery,
} from "./servicesapi";
import type { Campaign } from "./servicesapi";
import { uploadurlwithId } from "../Config";

const { TextArea } = Input;

interface ImageItem {
  imageId?: string;
  imageUrl: string;
  status?: boolean;
}

interface CommentItem {
  mainComment: string;
  mainCommentId: string;
  subComments: SubComment[];
}

interface SubComment {
  userId: string;
  comment: string;
}

interface ResponsiveModalWrapperProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ResponsiveModalWrapper: React.FC<ResponsiveModalWrapperProps> = ({
  open,
  onClose,
  children,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/55 backdrop-blur-[3px] flex items-center justify-center px-4 py-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg rounded-[24px] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.22)] border border-white/70 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const BlogDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const blogId = pathParts[pathParts.indexOf("blog") + 1];

  const userId =
    localStorage.getItem("userId") ||
    localStorage.getItem("customerId") ||
    localStorage.getItem("user_id") ||
    "";

  const accessToken = localStorage.getItem("accessToken");
  const BLOGS_DASHBOARD_PATH = "/main/blogs";
  const LOGIN_ROUTE = "/whatsappregister";
  const [pageReady, setPageReady] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [comment, setComment] = useState("");
  const [activeReplyCommentId, setActiveReplyCommentId] = useState<string | null>(null);

  const [isSpeaking, setIsSpeaking] = useState<Record<string, boolean>>({});
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({});
  const [isDisliked, setIsDisliked] = useState<Record<string, boolean>>({});
  const [likeCount, setLikeCount] = useState<Record<string, number>>({});
  const [dislikeCount, setDislikeCount] = useState<Record<string, number>>({});
  const [isSubscribed, setIsSubscribed] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, CommentItem[]>>({});
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState<Record<string, boolean>>({});
  const [selectedVotes, setSelectedVotes] = useState<Record<string, string>>({});
  const [currentMediaIndex, setCurrentMediaIndex] = useState<Record<string, number>>({});

  const [actionLoading, setActionLoading] = useState<
    Record<string, { like?: boolean; dislike?: boolean; subscribe?: boolean; vote?: boolean }>
  >({});

  const [isWriteToUsOpen, setIsWriteToUsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [query, setQuery] = useState("");
  const [queryError, setQueryError] = useState("");
  const [isSubmittingWriteToUs, setIsSubmittingWriteToUs] = useState(false);

  const mediaScrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const profileData = JSON.parse(localStorage.getItem("profileData") || "{}");

  const normalizedEmail =
    typeof profileData?.customerEmail === "string" &&
    profileData.customerEmail.trim() !== "" &&
    profileData.customerEmail !== "null" &&
    profileData.customerEmail !== "undefined"
      ? profileData.customerEmail.trim()
      : "";

  const whatsappNumber = localStorage.getItem("whatsappNumber");
  const mobileNumber = localStorage.getItem("mobileNumber");

  const normalizedMobileNumber =
    typeof whatsappNumber === "string" &&
    whatsappNumber.trim() !== "" &&
    whatsappNumber !== "null" &&
    whatsappNumber !== "undefined"
      ? whatsappNumber.trim()
      : typeof mobileNumber === "string" &&
        mobileNumber.trim() !== "" &&
        mobileNumber !== "null" &&
        mobileNumber !== "undefined"
      ? mobileNumber.trim()
      : "";

  const getCampaignId = (campaign: any) => campaign?.campaignId || campaign?.id || "";

  const getCampaignTitle = (campaign: any) =>
    campaign?.campaignTitle || campaign?.campaignType || "Blog";

  const getCampaignAuthor = (campaign: any) =>
    campaign?.authorName ||
    campaign?.campaignAuthor ||
    campaign?.createdBy ||
    campaign?.userName ||
    campaign?.name ||
    "ASKOXY";

  const slugify = (text: string) =>
    (text || "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50);

  const getCampaignPath = (campaign: any) => {
    const id = getCampaignId(campaign);
    const slug = slugify(getCampaignTitle(campaign));
    return userId ? `/main/blog/${id.slice(-4)}/${slug}` : `/blog/${id.slice(-4)}/${slug}`;
  };

  const getValidTeams = (campaign: any): string[] => {
    return [campaign?.team1, campaign?.team2, campaign?.team3, campaign?.team4]
      .filter((item) => item !== null && item !== undefined)
      .map((item) => String(item).trim())
      .filter(
        (item) =>
          item !== "" &&
          item !== "0" &&
          item.toLowerCase() !== "null" &&
          item.toLowerCase() !== "undefined"
      );
  };

  const getPollEndTime = (campaign: any): number => {
    const rawValue =
      campaign?.pollEndTime ?? campaign?.pollendTime ?? campaign?.pollEndDate;
    const parsed = Number(rawValue);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const isPollExpired = (campaign: any): boolean => {
    const pollEnd = getPollEndTime(campaign);
    return pollEnd > 0 && Date.now() > pollEnd;
  };

  const isVideoUrl = (url: string): boolean => {
    const videoExtensions = [".mp4", ".webm", ".ogg", ".avi", ".mov", ".wmv", ".flv", ".m4v"];
    const lower = (url || "").toLowerCase();
    return videoExtensions.some((ext) => lower.includes(ext));
  };

  const getVideoType = (url: string): string => {
    const lower = (url || "").toLowerCase();
    if (lower.endsWith(".mp4") || lower.endsWith(".m4v")) return "video/mp4";
    if (lower.endsWith(".webm")) return "video/webm";
    if (lower.endsWith(".ogg")) return "video/ogg";
    if (lower.endsWith(".mov")) return "video/quicktime";
    if (lower.endsWith(".avi")) return "video/x-msvideo";
    if (lower.endsWith(".wmv")) return "video/x-ms-wmv";
    if (lower.endsWith(".flv")) return "video/x-flv";
    return "video/mp4";
  };

  const buildMediaUrl = (path: string) => {
    if (!path) return "";
    return /^https?:\/\//i.test(path) ? path : `${uploadurlwithId}${path}`;
  };

  const redirectToLogin = (redirectPath: string = BLOGS_DASHBOARD_PATH) => {
    sessionStorage.setItem("redirectPath", redirectPath);
    navigate(LOGIN_ROUTE);
  };

  useEffect(() => {
    const loadCampaignsAndComments = async () => {
      setIsLoading(true);
      setPageReady(false);

      try {
        const [allCampaigns, allGames] = await Promise.all([
          fetchCampaigns(),
          fetchAllGames(),
        ]);

        const merged = [
          ...((allCampaigns as any[]) || []),
          ...((allGames as any[]) || []),
        ];

        const activeItems = merged.filter(
          (c: any) => c?.campaignStatus === true || c?.campaignStatus === undefined
        );

        const campaignsWithDetails = await Promise.all(
          activeItems.map(async (campaign: any) => {
            const campaignId = getCampaignId(campaign);
            if (!campaignId) return campaign;

            try {
              const details = await fetchLikesAndComments(campaignId, userId);

              const likesTotalCount = details?.likesTotalCount || 0;
              const dislikesTotalCount = details?.dislikesTotalCount || 0;
              const subComments = details?.subComments || [];
              const likedState = details?.isLiked || false;
              const dislikedState = details?.isDisliked || false;
              const subscribedState = details?.isSubscribed || false;
              const selectedTeam = details?.selectedTeam || campaign?.selectedTeam || "";

              setLikeCount((prev) => ({
                ...prev,
                [campaignId]: likesTotalCount,
              }));
              setDislikeCount((prev) => ({
                ...prev,
                [campaignId]: dislikesTotalCount,
              }));
              setComments((prev) => ({ ...prev, [campaignId]: subComments }));
              setIsLiked((prev) => ({ ...prev, [campaignId]: likedState }));
              setIsDisliked((prev) => ({ ...prev, [campaignId]: dislikedState }));
              setIsSubscribed((prev) => ({ ...prev, [campaignId]: subscribedState }));

              if (selectedTeam) {
                setSelectedVotes((prev) => ({
                  ...prev,
                  [campaignId]: selectedTeam,
                }));
              }

              return {
                ...campaign,
                likesTotalCount,
                dislikesTotalCount,
                subComments,
                isLiked: likedState,
                isDisliked: dislikedState,
                isSubscribed: subscribedState,
                selectedTeam,
              };
            } catch {
              return campaign;
            }
          })
        );

        setCampaigns(campaignsWithDetails as Campaign[]);
      } catch (error) {
        console.error("Error loading campaigns or comments:", error);
        setCampaigns([]);
      } finally {
        setIsLoading(false);
        setTimeout(() => {
          setPageReady(true);
        }, 100);
      }
    };

    loadCampaignsAndComments();
  }, [userId]);

  useEffect(() => {
    const isAnyModalOpen =
      isWriteToUsOpen || isProfileModalOpen || isSuccessModalOpen;
    document.body.style.overflow = isAnyModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isWriteToUsOpen, isProfileModalOpen, isSuccessModalOpen]);

  const featuredCampaign = useMemo(() => {
    return campaigns.find((campaign: any) => {
      const fullId = getCampaignId(campaign);
      return fullId === blogId || fullId?.slice(-4) === blogId;
    });
  }, [campaigns, blogId]);

  const remainingCampaigns = useMemo(() => {
    return campaigns.filter((campaign: any) => {
      const fullId = getCampaignId(campaign);
      return !(fullId === blogId || fullId?.slice(-4) === blogId);
    });
  }, [campaigns, blogId]);

  const orderedCampaigns = useMemo(() => {
    if (!featuredCampaign) return [];
    return [featuredCampaign, ...remainingCampaigns];
  }, [featuredCampaign, remainingCampaigns]);

  const scrollToIndex = (campaignId: string, idx: number, smooth = true) => {
    const container = mediaScrollRefs.current[campaignId];
    if (!container) return;
    const left = idx * container.clientWidth;
    container.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
  };

  const onMediaScroll = (campaignId: string, total: number) => {
    const el = mediaScrollRefs.current[campaignId];
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    const safeIdx = Math.max(0, Math.min(idx, total - 1));
    setCurrentMediaIndex((prev) => ({ ...prev, [campaignId]: safeIdx }));
  };

  const handleCarouselLeft = (campaignId: string, total: number) => {
    if (!total) return;
    const next = ((currentMediaIndex[campaignId] || 0) - 1 + total) % total;
    setCurrentMediaIndex((prev) => ({ ...prev, [campaignId]: next }));
    scrollToIndex(campaignId, next);
  };

  const handleCarouselRight = (campaignId: string, total: number) => {
    if (!total) return;
    const next = ((currentMediaIndex[campaignId] || 0) + 1) % total;
    setCurrentMediaIndex((prev) => ({ ...prev, [campaignId]: next }));
    scrollToIndex(campaignId, next);
  };

  const handleLike = async (campaignId: string) => {
    if (!accessToken || !userId) {
      message.warning("Please login to like this post.");
      redirectToLogin(BLOGS_DASHBOARD_PATH);
      return;
    }

    setActionLoading((prev) => ({
      ...prev,
      [campaignId]: { ...prev[campaignId], like: true },
    }));

    try {
      const newLikeStatus = isLiked[campaignId] ? "no" : "yes";

      const success = await submitUserInteraction({
        campaignId,
        interavtionType: "LIKEORDISLIKE",
        likeStatus: newLikeStatus,
        userId,
      });

      if (success) {
        setLikeCount((prev) => ({
          ...prev,
          [campaignId]: isLiked[campaignId]
            ? Math.max((prev[campaignId] || 0) - 1, 0)
            : (prev[campaignId] || 0) + 1,
        }));
        setIsLiked((prev) => ({ ...prev, [campaignId]: !prev[campaignId] }));

        if (isDisliked[campaignId]) {
          setDislikeCount((prev) => ({
            ...prev,
            [campaignId]: Math.max((prev[campaignId] || 0) - 1, 0),
          }));
          setIsDisliked((prev) => ({ ...prev, [campaignId]: false }));
        }
      } else {
        message.error("Failed to like the post.");
      }
    } catch {
      message.error("Failed to like the post.");
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [campaignId]: { ...prev[campaignId], like: false },
      }));
    }
  };

  const handleDislike = async (campaignId: string) => {
    if (!accessToken || !userId) {
      message.warning("Please login to dislike this post.");
      redirectToLogin(BLOGS_DASHBOARD_PATH);
      return;
    }

    setActionLoading((prev) => ({
      ...prev,
      [campaignId]: { ...prev[campaignId], dislike: true },
    }));

    try {
      const newLikeStatus = isDisliked[campaignId] ? "yes" : "no";

      const success = await submitUserInteraction({
        campaignId,
        interavtionType: "LIKEORDISLIKE",
        likeStatus: newLikeStatus,
        userId,
      });

      if (success) {
        setDislikeCount((prev) => ({
          ...prev,
          [campaignId]: isDisliked[campaignId]
            ? Math.max((prev[campaignId] || 0) - 1, 0)
            : (prev[campaignId] || 0) + 1,
        }));
        setIsDisliked((prev) => ({ ...prev, [campaignId]: !prev[campaignId] }));

        if (isLiked[campaignId]) {
          setLikeCount((prev) => ({
            ...prev,
            [campaignId]: Math.max((prev[campaignId] || 0) - 1, 0),
          }));
          setIsLiked((prev) => ({ ...prev, [campaignId]: false }));
        }
      } else {
        message.error("Failed to dislike the post.");
      }
    } catch {
      message.error("Failed to dislike the post.");
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [campaignId]: { ...prev[campaignId], dislike: false },
      }));
    }
  };

  const handleSubscribe = async (campaignId: string) => {
    if (!accessToken || !userId) {
      message.warning("Please login to subscribe.");
      redirectToLogin(BLOGS_DASHBOARD_PATH);
      return;
    }

    setActionLoading((prev) => ({
      ...prev,
      [campaignId]: { ...prev[campaignId], subscribe: true },
    }));

    try {
      const newSubscribedStatus = isSubscribed[campaignId] ? "no" : "yes";

      const success = await submitUserInteraction({
        campaignId,
        interavtionType: "SUBSCRIBE",
        subscribed: newSubscribedStatus,
        userId,
      });

      if (success) {
        setIsSubscribed((prev) => ({
          ...prev,
          [campaignId]: !prev[campaignId],
        }));
      } else {
        message.error("Failed to subscribe.");
      }
    } catch {
      message.error("Failed to subscribe.");
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [campaignId]: { ...prev[campaignId], subscribe: false },
      }));
    }
  };

  const submitVote = async (campaign: any, teamName: string) => {
    const campaignId = getCampaignId(campaign);

    try {
      setActionLoading((prev) => ({
        ...prev,
        [campaignId]: { ...prev[campaignId], vote: true },
      }));

      const success = await submitUserInteraction({
        campaignId,
        interavtionType: "POOLING",
        pollAnswer: teamName,
        userId,
      });

      if (success) {
        setSelectedVotes((prev) => ({ ...prev, [campaignId]: teamName }));
        setCampaigns((prev: any) =>
          prev.map((item: any) =>
            getCampaignId(item) === campaignId
              ? { ...item, selectedTeam: teamName }
              : item
          )
        );
        message.success("Vote submitted successfully");

        const details = await fetchLikesAndComments(campaignId, userId);
        if (details?.selectedTeam) {
          setSelectedVotes((prev) => ({
            ...prev,
            [campaignId]: details.selectedTeam,
          }));
        }
      } else {
        message.error("Vote submission failed");
      }
    } catch {
      message.error("Something went wrong while submitting vote");
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [campaignId]: { ...prev[campaignId], vote: false },
      }));
    }
  };

  const handleVote = (campaign: any, teamName: string) => {
    if (!accessToken || !userId) {
      message.info("Please login to vote");
      redirectToLogin(BLOGS_DASHBOARD_PATH);
      return;
    }

    if (isPollExpired(campaign)) {
      message.info("Poll ended");
      return;
    }

    Modal.confirm({
      title: "Are you sure?",
      content: `Do you want to vote for ${teamName}?`,
      okText: "Yes",
      cancelText: "No",
      centered: true,
      onOk: () => submitVote(campaign, teamName),
    });
  };

  const handleOk = async (campaignId: string) => {
    if (!accessToken || !userId) {
      message.warning("Please login to add a comment.");
      redirectToLogin(BLOGS_DASHBOARD_PATH);
      return;
    }

    if (!comment.trim()) {
      message.error("Please enter a comment before submitting.");
      return;
    }

    try {
      if (activeReplyCommentId) {
        const success = await submitSubComment(
          activeReplyCommentId,
          comment.trim(),
          userId
        );

        if (success) {
          message.success("Reply submitted successfully!");
          const { subComments } = await fetchLikesAndComments(campaignId, userId);
          setComments((prev) => ({ ...prev, [campaignId]: subComments || [] }));
        } else {
          message.error("Failed to submit reply. Please try again.");
        }
      } else {
        const success = await submitUserInteraction({
          campaignId,
          interavtionType: "COMMENTS",
          userComments: comment.trim(),
          userId,
        });

        if (success) {
          message.success("Comment submitted successfully!");
          const { subComments } = await fetchLikesAndComments(campaignId, userId);
          setComments((prev) => ({ ...prev, [campaignId]: subComments || [] }));
        } else {
          message.error("Failed to submit comment. Please try again.");
        }
      }
    } catch {
      message.error("Error submitting comment. Please try again.");
    } finally {
      setComment("");
      setActiveReplyCommentId(null);
    }
  };

  const handleWriteToUs = (campaign: Campaign) => {
    if (!accessToken || !userId) {
      message.warning("Please login to write to us.");
      redirectToLogin(BLOGS_DASHBOARD_PATH);
      return;
    }

    setSelectedCampaign(campaign);
    setQuery("");
    setQueryError("");

    if (!normalizedEmail || !normalizedMobileNumber) {
      message.warning("Please fill your Email and Phone Number to continue.");
      setIsProfileModalOpen(true);
      return;
    }

    setIsWriteToUsOpen(true);
  };

const handleWriteToUsSubmitButton = async () => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    setQueryError("Please enter your message before submitting.");
    return;
  }

  if (!normalizedEmail || !normalizedMobileNumber) {
    message.error("Please update your Email and Phone Number before submitting.");
    setIsWriteToUsOpen(false);

    setTimeout(() => {
      setIsProfileModalOpen(true);
    }, 200);

    return;
  }

  if (!userId) {
    message.error("User details not found. Please login again.");
    redirectToLogin(BLOGS_DASHBOARD_PATH);
    return;
  }

  try {
    setIsSubmittingWriteToUs(true);
    setQueryError("");

    const response = await submitWriteToUsQuery(
      normalizedEmail,
      normalizedMobileNumber,
      trimmedQuery,
      "BLOGS",
      userId
    );

    if (response.success) {
      setIsWriteToUsOpen(false);
      setIsSuccessModalOpen(true);
      setQuery("");
      setQueryError("");
      message.success(response.message || "Query submitted successfully.");
    } else {
      message.error(response.message || "Failed to send query. Please try again.");
    }
  } catch (error) {
    console.error("Write To Us error:", error);
    message.error("Something went wrong while submitting your query.");
  } finally {
    setIsSubmittingWriteToUs(false);
  }
};

  const renderInlineFormattedText = (text: string) => {
    if (!text) return null;

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, partIndex) => {
      if (/^https?:\/\//.test(part)) {
        return (
          <a
            key={`url-${partIndex}`}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-words"
          >
            {part}
          </a>
        );
      }

      const boldParts = part.split(/(\*\*.*?\*\*)/g);

      return boldParts.map((segment, segIndex) => {
        if (/^\*\*.*\*\*$/.test(segment)) {
          const boldText = segment.replace(/^\*\*/, "").replace(/\*\*$/, "");
          return (
            <strong
              key={`bold-${partIndex}-${segIndex}`}
              className="font-semibold text-slate-900"
            >
              {boldText}
            </strong>
          );
        }

        return (
          <React.Fragment key={`text-${partIndex}-${segIndex}`}>
            {segment}
          </React.Fragment>
        );
      });
    });
  };

  const formatCampaignDescription = (description: string) => {
    if (!description) return null;

    const lines = description.split("\n").filter((line) => line.trim() !== "");

    return lines.map((line, index) => {
      const trimmed = line.trim();

      if (!trimmed || trimmed === "---") return null;

      const isHeadingLine =
        trimmed.startsWith("### ") ||
        trimmed.startsWith("## ") ||
        trimmed.startsWith("# ");

      if (isHeadingLine) {
        const cleanHeading = trimmed.replace(/^#{1,3}\s*/, "");
        return (
          <h3
            key={`heading-${index}`}
            className="text-[15px] sm:text-[16px] font-bold text-slate-900 mt-4 mb-2"
          >
            {renderInlineFormattedText(cleanHeading)}
          </h3>
        );
      }

      return (
        <p
          key={`para-${index}`}
          className="text-slate-700 mb-2 text-[13px] sm:text-[14px] leading-7"
        >
          {renderInlineFormattedText(trimmed)}
        </p>
      );
    });
  };

  const handleSpeakDescription = (campaignId: string) => {
    const campaign = campaigns.find((c: any) => getCampaignId(c) === campaignId);

    if (!campaign?.campaignDescription) {
      message.error("No content to read");
      return;
    }

    if (isSpeaking[campaignId]) {
      speechSynthesis.cancel();
      setIsSpeaking((prev) => ({ ...prev, [campaignId]: false }));
      return;
    }

    const textToSpeak = campaign.campaignDescription
      .replace(/###/g, "")
      .replace(/\*\*/g, "")
      .replace(/- /g, "")
      .replace(/https?:\/\/[^\s]+/g, "link")
      .trim();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () =>
      setIsSpeaking((prev) => ({ ...prev, [campaignId]: true }));
    utterance.onend = () =>
      setIsSpeaking((prev) => ({ ...prev, [campaignId]: false }));
    utterance.onerror = () => {
      setIsSpeaking((prev) => ({ ...prev, [campaignId]: false }));
      message.error("Speech synthesis stopped");
    };

    speechSynthesis.speak(utterance);
  };

  const handleShare = (campaign: any) => {
    const shareUrl = `${window.location.origin}${getCampaignPath(campaign)}`;
    if (navigator.share) {
      navigator
        .share({ title: getCampaignTitle(campaign), url: shareUrl })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => message.success("Link copied"));
    }
  };

  const handlePopUOk = () => {
    setIsProfileModalOpen(false);
    navigate("/main/profile");
  };

  const handleAddblog = () => {
    if (userId) {
      navigate("/main/addblogs");
    } else {
      message.info("Please Login to add your blog");
      sessionStorage.setItem("redirectPath", "/main/addblogs");
      navigate("/whatsapplogin");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const closeWriteToUsModal = () => {
    setIsWriteToUsOpen(false);
    setQuery("");
    setQueryError("");
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const showCommentsModal = async (campaignId: string) => {
    setIsCommentsModalOpen((prev) => ({ ...prev, [campaignId]: true }));
    try {
      const { subComments } = await fetchLikesAndComments(campaignId, userId);
      setComments((prev) => ({ ...prev, [campaignId]: subComments || [] }));
    } catch (error) {
      console.error("Error fetching comments:", error);
      message.error("Failed to load comments.");
    }
  };

  const renderNotFoundPage = () => (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">
          Blog Not Found
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mb-6">
          The blog is currently inactive or unavailable.
        </p>
        <button
          onClick={() => navigate("/main")}
          className="px-4 py-2 sm:px-6 sm:py-3 bg-[#3d2a71] text-white rounded-xl shadow-lg hover:bg-[#2a1d4e] transition-all"
        >
          Return Home
        </button>
      </div>
    </div>
  );

  const renderCampaignCard = (campaign: any) => {
    const campaignId = getCampaignId(campaign);

    const imageUrls: ImageItem[] = Array.isArray(campaign?.imageUrls)
      ? campaign.imageUrls.map((img: any) =>
          typeof img === "string" ? { imageUrl: img } : img
        )
      : campaign?.imageUrl
      ? [{ imageUrl: campaign.imageUrl }]
      : [];

    const total = imageUrls.length;
    const currentIdx = currentMediaIndex[campaignId] || 0;
    const teams = getValidTeams(campaign);
    const selectedTeam = selectedVotes[campaignId] || campaign?.selectedTeam || "";
    const pollExpired = isPollExpired(campaign);
    const isLoadingVote = !!actionLoading[campaignId]?.vote;

    return (
      <div
        key={campaignId}
        className="overflow-hidden rounded-[24px] border border-[#e7eaf3] bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]"
      >
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 bg-[linear-gradient(90deg,#f6f7ff_0%,#fcfcff_100%)] border-b border-[#edf0f7]">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={handleGoBack}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 shadow-sm hover:shadow-md"
              title="Go back"
            >
              <ArrowLeftOutlined className="text-sm" />
            </button>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef2f9] text-[#6b7280]">
              <UserOutlined />
            </div>
            <div className="min-w-0">
              <p className="m-0 text-[12px] sm:text-[13px] font-semibold uppercase tracking-wide text-slate-500">
                {getCampaignAuthor(campaign)}
              </p>
            </div>
          </div>

          <h1 className="hidden lg:block flex-1 px-4 text-center text-[22px] xl:text-[26px] font-extrabold leading-tight text-[#111827]">
            {getCampaignTitle(campaign)}
          </h1>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleSubscribe(campaignId)}
              className={`inline-flex items-center justify-center rounded-full px-4 sm:px-5 py-2.5 text-[12px] sm:text-[13px] font-semibold text-white transition-all ${
                isSubscribed[campaignId]
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                  : "bg-gradient-to-r from-[#3b82f6] to-[#4f46e5]"
              }`}
            >
              {actionLoading[campaignId]?.subscribe ? (
                <LoadingOutlined />
              ) : isSubscribed[campaignId] ? (
                "Subscribed"
              ) : (
                "Subscribe"
              )}
            </button>

            <button
              type="button"
              onClick={() => handleWriteToUs(campaign)}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#f59e0b] to-[#fb923c] px-4 sm:px-5 py-2.5 text-[12px] sm:text-[13px] font-semibold text-white"
            >
              Write To Us
            </button>
          </div>
        </div>

        <div className="block lg:hidden px-4 sm:px-6 pt-4">
          <h1 className="text-[21px] sm:text-[25px] font-extrabold leading-tight text-[#111827] text-center">
            {getCampaignTitle(campaign)}
          </h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="p-4 sm:p-6">
            <div className="overflow-hidden rounded-[18px] border border-slate-200 bg-white">
              {total > 0 ? (
                <div className="relative">
                  <div
                    ref={(el) => {
                      mediaScrollRefs.current[campaignId] = el;
                    }}
                    onScroll={() => onMediaScroll(campaignId, total)}
                    className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none]"
                  >
                    <style>{`div::-webkit-scrollbar { display: none; }`}</style>
                    {imageUrls.map((media, idx) => {
                      const src = buildMediaUrl(media.imageUrl || "");
                      return (
                        <div
                          key={`${campaignId}-${idx}`}
                          className="min-w-full snap-start bg-slate-100 flex items-center justify-center"
                        >
                          {isVideoUrl(src) ? (
                            <video
                              controls
                              className="w-full h-[260px] sm:h-[420px] object-cover bg-black"
                            >
                              <source src={src} type={getVideoType(src)} />
                            </video>
                          ) : (
                            <img
                              src={src}
                              alt={getCampaignTitle(campaign)}
                              className="w-full h-[260px] sm:h-[420px] object-cover"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {total > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleCarouselLeft(campaignId, total)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md hover:bg-white"
                      >
                        <LeftOutlined />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCarouselRight(campaignId, total)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md hover:bg-white"
                      >
                        <RightOutlined />
                      </button>

                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 backdrop-blur">
                        {imageUrls.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setCurrentMediaIndex((prev) => ({
                                ...prev,
                                [campaignId]: idx,
                              }));
                              scrollToIndex(campaignId, idx);
                            }}
                            className={`h-2.5 rounded-full transition-all ${
                              currentIdx === idx ? "w-6 bg-white" : "w-2.5 bg-white/60"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="h-[260px] sm:h-[420px] flex items-center justify-center bg-slate-100 text-slate-400">
                  No image available
                </div>
              )}
            </div>

            {teams.length > 0 && (
              <div className="mt-4 rounded-[18px] border border-[#eceff5] bg-[#fafbff] p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrophyOutlined className="text-[#f59e0b]" />
                  <h3 className="m-0 text-[15px] sm:text-[16px] font-bold text-slate-800">
                    Vote Now
                  </h3>
                  {pollExpired ? (
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-600">
                      <ClockCircleOutlined />
                      Poll Ended
                    </span>
                  ) : (
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-600">
                      <CheckCircleFilled />
                      Live Poll
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {teams.map((teamName, idx) => {
                    const isSelected = selectedTeam === teamName;
                    return (
                      <button
                        key={`${campaignId}-team-${idx}`}
                        type="button"
                        disabled={pollExpired || isLoadingVote}
                        onClick={() => handleVote(campaign, teamName)}
                        className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                          isSelected
                            ? "border-[#4f46e5] bg-[#eef2ff] text-[#312e81]"
                            : "border-slate-200 bg-white text-slate-700 hover:border-[#c7d2fe]"
                        } ${pollExpired || isLoadingVote ? "opacity-70 cursor-not-allowed" : ""}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-[14px]">{teamName}</span>
                          {isLoadingVote && isSelected ? <LoadingOutlined /> : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleLike(campaignId)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all ${
                  isLiked[campaignId]
                    ? "border-rose-200 bg-rose-50 text-rose-600"
                    : "border-slate-200 bg-white text-slate-700 hover:border-rose-200 hover:text-rose-600"
                }`}
              >
                {actionLoading[campaignId]?.like ? (
                  <Spin indicator={<LoadingOutlined spin />} size="small" />
                ) : isLiked[campaignId] ? (
                  <HeartFilled />
                ) : (
                  <HeartOutlined />
                )}
                <span>{likeCount[campaignId] || 0}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDislike(campaignId)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all ${
                  isDisliked[campaignId]
                    ? "border-blue-200 bg-blue-50 text-blue-600"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-600"
                }`}
              >
                {actionLoading[campaignId]?.dislike ? (
                  <Spin indicator={<LoadingOutlined spin />} size="small" />
                ) : isDisliked[campaignId] ? (
                  <DislikeFilled />
                ) : (
                  <DislikeOutlined />
                )}
                <span>{dislikeCount[campaignId] || 0}</span>
              </button>

              <button
                type="button"
                onClick={() => showCommentsModal(campaignId)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 transition-all hover:border-[#c7d2fe] hover:text-[#4f46e5]"
              >
                <MessageOutlined />
                <span>{comments[campaignId]?.length || 0}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSpeakDescription(campaignId)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all ${
                  isSpeaking[campaignId]
                    ? "border-amber-200 bg-amber-50 text-amber-600"
                    : "border-slate-200 bg-white text-slate-700 hover:border-amber-200 hover:text-amber-600"
                }`}
              >
                <SoundOutlined />
                <span>{isSpeaking[campaignId] ? "Stop" : "Listen"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleShare(campaign)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 transition-all hover:border-[#c7d2fe] hover:text-[#4f46e5]"
              >
                <ShareAltOutlined />
                <span>Share</span>
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 xl:pl-0">
            <div className="rounded-[18px] border border-[#eceff5] bg-white h-full">
              <div className="border-b border-[#edf0f7] px-4 sm:px-5 py-4">
                <h3 className="m-0 text-[16px] sm:text-[18px] font-bold text-slate-900">
                  Description
                </h3>
              </div>

              <div className="px-4 sm:px-5 py-4 max-h-[520px] overflow-y-auto custom-scrollbar">
                {campaign?.campaignDescription ? (
                  <div>{formatCampaignDescription(campaign.campaignDescription)}</div>
                ) : (
                  <p className="text-slate-500 text-sm">No description available.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <Modal
          open={!!isCommentsModalOpen[campaignId]}
          onCancel={() =>
            setIsCommentsModalOpen((prev) => ({ ...prev, [campaignId]: false }))
          }
          footer={null}
          centered
          width={700}
          title={
            <div className="text-[16px] sm:text-[18px] font-bold text-slate-900">
              Comments
            </div>
          }
        >
          <div className="max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
            {(comments[campaignId] || []).length === 0 ? (
              <div className="py-10 text-center text-slate-500 text-sm">
                No comments yet.
              </div>
            ) : (
              <div className="space-y-4">
                {(comments[campaignId] || []).map((item, index) => (
                  <div key={item.mainCommentId || index} className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                    <div className="text-sm text-slate-800">{item.mainComment}</div>

                    <div className="mt-2">
                      <button
                        type="button"
                        className="text-xs font-semibold text-[#4f46e5] hover:underline"
                        onClick={() => setActiveReplyCommentId(item.mainCommentId)}
                      >
                        Reply
                      </button>
                    </div>

                    {item.subComments?.length > 0 && (
                      <div className="mt-3 ml-4 space-y-2 border-l border-slate-200 pl-4">
                        {item.subComments.map((sub, subIndex) => (
                          <div key={subIndex} className="text-xs sm:text-sm text-slate-600">
                            <span className="font-semibold text-slate-800">Reply:</span>{" "}
                            {sub.comment}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 border-t border-slate-200 pt-4">
            {activeReplyCommentId && (
              <div className="mb-2 text-xs sm:text-sm text-slate-600">
                Replying to:{" "}
                {
                  comments[campaignId]?.find(
                    (c) => c.mainCommentId === activeReplyCommentId
                  )?.mainComment
                }
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <TextArea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  activeReplyCommentId ? "Enter your reply..." : "Add a comment..."
                }
                className="flex-1 resize-none"
              />
              <button
                type="button"
                onClick={() => handleOk(campaignId)}
                disabled={!comment.trim()}
                className="rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#4f46e5] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {activeReplyCommentId ? "Post Reply" : "Post"}
              </button>
            </div>

            {activeReplyCommentId && (
              <button
                type="button"
                onClick={() => {
                  setActiveReplyCommentId(null);
                  setComment("");
                }}
                className="mt-3 text-sm font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel Reply
              </button>
            )}
          </div>
        </Modal>
      </div>
    );
  };
  const isLoggedInUser = Boolean(userId);

  if (!isLoading && !featuredCampaign) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
       {!isLoggedInUser && <Header1 />}
        {renderNotFoundPage()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {!isLoggedInUser && <Header1 />}

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.08),transparent_30%)] pointer-events-none" />

        <style>
          {`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #edf2f7;
              border-radius: 999px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 999px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #94a3b8;
            }
            
            @media (max-width: 1024px) {
              .grid.grid-cols-1.xl:grid-cols-\[1\.05fr_0\.95fr\] {
                grid-template-columns: 1fr;
              }
            }
            
            @media (max-width: 768px) {
              .px-4.sm\:px-6 {
                padding-left: 12px;
                padding-right: 12px;
              }
              
              .py-4.sm\:py-7 {
                padding-top: 16px;
                padding-bottom: 16px;
              }
              
              .text-\[26px\].sm\:text-\[34px\] {
                font-size: 22px;
              }
              
              .text-\[15px\].sm\:text-\[16px\] {
                font-size: 14px;
              }
              
              .h-\[260px\].sm\:h-\[420px\] {
                height: 220px;
              }
              
              .text-\[21px\].sm\:text-\[25px\] {
                font-size: 18px;
              }
              
              .text-\[12px\].sm\:text-\[13px\] {
                font-size: 11px;
              }
              
              .px-4.sm\:px-5 {
                padding-left: 12px;
                padding-right: 12px;
              }
              
              .py-2\.5 {
                padding-top: 8px;
                padding-bottom: 8px;
              }
              
              .gap-2.sm\:gap-3 {
                gap: 8px;
              }
              
              .flex-col.sm\:flex-row {
                flex-direction: column;
              }
              
              .items-start.sm\:items-center {
                align-items: flex-start;
              }
            }
            
            @media (max-width: 640px) {
              .px-3.sm\:px-5 {
                padding-left: 8px;
                padding-right: 8px;
              }
              
              .px-6.sm\:px-10 {
                padding-left: 16px;
                padding-right: 16px;
              }
              
              .h-\[260px\].sm\:h-\[420px\] {
                height: 200px;
              }
              
              .text-\[13px\] {
                font-size: 12px;
              }
              
              .rounded-\[24px\] {
                border-radius: 16px;
              }
              
              .rounded-\[18px\] {
                border-radius: 12px;
              }
              
              .p-4.sm\:p-6 {
                padding: 12px;
              }
              
              .px-4.py-2 {
                padding: 6px 12px;
              }
              
              .text-\[14px\] {
                font-size: 12px;
              }
            }
            @media (max-width: 768px) {
  .blogDetailsWrap {
    padding: 12px !important;
  }
}
            @media (max-width: 480px) {
              .text-\[22px\].xl\:text-\[26px\] {
                font-size: 18px;
              }
              
              .h-\[260px\].sm\:h-\[420px\] {
                height: 180px;
              }
              
              .px-4.sm\:px-5.py-2\.5 {
                padding: 6px 10px;
              }
              
              .text-\[12px\].sm\:text-\[13px\] {
                font-size: 10px;
              }
              
              .gap-3 {
                gap: 6px;
              }
              
              .flex-wrap {
                flex-wrap: wrap;
              }
              
              .rounded-full {
                border-radius: 20px;
              }
            }
          `}
        </style>

        <div className="px-3 sm:px-5 lg:px-8 py-2 sm:py-4"  style={{
    padding: isLoggedInUser ? "16px" : "98px",
   
  }}>
          <div className="mx-auto max-w-[1550px] ">
            <div className="mb-6 rounded-[28px] border border-[#eef1f7] bg-gradient-to-r from-white to-[#f8fafc] px-6 sm:px-10 py-6 shadow-[0_15px_40px_rgba(15,23,42,0.06)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <h2 className="text-[26px] sm:text-[34px] font-bold text-[#0f172a] leading-tight">
                  Creator Rewards 🚀
                </h2>

                <p className="mt-2 text-[15px] sm:text-[16px] text-[#475569] leading-relaxed">
                  Write your blog and earn exciting rewards. Share your ideas with
                  the world and start earning{" "}
                  <span className="font-semibold bg-gradient-to-r from-[#f59e0b] to-[#facc15] bg-clip-text text-transparent">
                    BMV Coins 💰
                  </span>
                  .
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddblog}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3b82f6] to-[#9333ea] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:scale-105 transition-all duration-300"
              >
                <PlusOutlined />
                Add Blog
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <Spin size="large" />
              </div>
            ) : (
              <div
                className={`transition-all duration-500 ${
                  pageReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                {featuredCampaign && renderCampaignCard(featuredCampaign)}
              </div>
            )}
          </div>
        </div>
      </div>

      <ResponsiveModalWrapper open={isWriteToUsOpen} onClose={closeWriteToUsModal}>
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white/95 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Write To Us</h2>
            <p className="mt-1 text-sm text-slate-500">
              Share your query and our team will get back to you.
            </p>
          </div>

          <button
            type="button"
            onClick={closeWriteToUsModal}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        </div>

        <div className="px-5 py-5 sm:px-6">
          <div className="mb-4">
            <p className="text-sm font-semibold text-slate-700 mb-2">Blog</p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {selectedCampaign ? getCampaignTitle(selectedCampaign) : "Selected Blog"}
            </div>
          </div>

          <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-sm text-gray-700">
              <b>Email:</b> {normalizedEmail || "Not Available"}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <b>Phone:</b> {normalizedMobileNumber || "Not Available"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Your Message
            </label>
            <TextArea
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (queryError) setQueryError("");
              }}
              rows={5}
              placeholder="Write your message here..."
              className="rounded-2xl"
            />
            {queryError ? (
              <p className="mt-2 text-sm text-red-500">{queryError}</p>
            ) : null}
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={handleWriteToUsSubmitButton}
              disabled={isSubmittingWriteToUs}
              className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg disabled:opacity-60"
            >
              {isSubmittingWriteToUs ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </ResponsiveModalWrapper>

      <ResponsiveModalWrapper open={isProfileModalOpen} onClose={closeProfileModal}>
        <div className="p-6 text-center">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Complete Your Profile</h2>

          <p className="text-sm text-gray-600 mb-5">
            Please update your <b>Email</b> and <b>Phone Number</b> to continue
            using Write To Us.
          </p>

          <button
            onClick={handlePopUOk}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold"
          >
            Update Profile
          </button>
        </div>
      </ResponsiveModalWrapper>

      <ResponsiveModalWrapper open={isSuccessModalOpen} onClose={closeSuccessModal}>
        <div className="px-5 py-6 sm:px-6 sm:py-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <span className="text-2xl">✓</span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Submitted Successfully
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Your query has been submitted successfully. Our team will contact you soon.
          </p>

          <div className="mt-6">
            <button
              type="button"
              onClick={closeSuccessModal}
              className="h-11 rounded-xl bg-green-600 px-6 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Okay
            </button>
          </div>
        </div>
      </ResponsiveModalWrapper>
    </div>
  );
};

export default BlogDetails;