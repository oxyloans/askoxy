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
  const [activeReplyCommentId, setActiveReplyCommentId] = useState<
    string | null
  >(null);

  const [isSpeaking, setIsSpeaking] = useState<Record<string, boolean>>({});
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({});
  const [isDisliked, setIsDisliked] = useState<Record<string, boolean>>({});
  const [likeCount, setLikeCount] = useState<Record<string, number>>({});
  const [dislikeCount, setDislikeCount] = useState<Record<string, number>>({});
  const [isSubscribed, setIsSubscribed] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, CommentItem[]>>({});
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState<
    Record<string, boolean>
  >({});
  const [selectedVotes, setSelectedVotes] = useState<Record<string, string>>(
    {},
  );
  const [currentMediaIndex, setCurrentMediaIndex] = useState<
    Record<string, number>
  >({});

  const [actionLoading, setActionLoading] = useState<
    Record<
      string,
      { like?: boolean; dislike?: boolean; subscribe?: boolean; vote?: boolean }
    >
  >({});

  const [isWriteToUsOpen, setIsWriteToUsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );
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

  const getCampaignId = (campaign: any) =>
    campaign?.campaignId || campaign?.id || "";

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
    return userId
      ? `/main/blog/${id.slice(-4)}/${slug}`
      : `/blog/${id.slice(-4)}/${slug}`;
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
          item.toLowerCase() !== "undefined",
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
    const videoExtensions = [
      ".mp4",
      ".webm",
      ".ogg",
      ".avi",
      ".mov",
      ".wmv",
      ".flv",
      ".m4v",
    ];
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
          (c: any) =>
            c?.campaignStatus === true || c?.campaignStatus === undefined,
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
              const selectedTeam =
                details?.selectedTeam || campaign?.selectedTeam || "";

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
              setIsDisliked((prev) => ({
                ...prev,
                [campaignId]: dislikedState,
              }));
              setIsSubscribed((prev) => ({
                ...prev,
                [campaignId]: subscribedState,
              }));

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
          }),
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
              : item,
          ),
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
          userId,
        );

        if (success) {
          message.success("Reply submitted successfully!");
          const { subComments } = await fetchLikesAndComments(
            campaignId,
            userId,
          );
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
          const { subComments } = await fetchLikesAndComments(
            campaignId,
            userId,
          );
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
    if (!query.trim()) {
      setQueryError("Please enter your message before submitting.");
      return;
    }

    if (!normalizedEmail || !normalizedMobileNumber) {
      message.error(
        "Please update your Email and Phone Number before submitting.",
      );

      setIsWriteToUsOpen(false);

      setTimeout(() => {
        setIsProfileModalOpen(true);
      }, 200); // smooth transition

      return;
    }

    try {
      setIsSubmittingWriteToUs(true);

      const success = await submitWriteToUsQuery(
        normalizedEmail,
        normalizedMobileNumber,
        query.trim(),
        "BLOGS",
        userId,
      );

      if (success) {
        setIsWriteToUsOpen(false);
        setIsSuccessModalOpen(true);
        setQuery("");
        setQueryError("");
      } else {
        message.error("Failed to send query. Please try again.");
      }
    } catch (error) {
      console.error("Write To Us error:", error);
      message.error("Something went wrong. Please try again.");
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
    const campaign = campaigns.find(
      (c: any) => getCampaignId(c) === campaignId,
    );

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
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => message.success("Link copied"));
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

  const renderNotFoundPage = () => (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 mb-4">
          404
        </h1>
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
          typeof img === "string" ? { imageUrl: img } : img,
        )
      : campaign?.imageUrl
        ? [{ imageUrl: campaign.imageUrl }]
        : [];

    const total = imageUrls.length;
    const currentIdx = currentMediaIndex[campaignId] || 0;
    const teams = getValidTeams(campaign);
    const selectedTeam =
      selectedVotes[campaignId] || campaign?.selectedTeam || "";
    const pollExpired = isPollExpired(campaign);
    const isLoadingVote = !!actionLoading[campaignId]?.vote;

    return (
      <div
        key={campaignId}
        className="overflow-hidden rounded-[24px] border border-[#e7eaf3] bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]"
      >
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 bg-[linear-gradient(90deg,#f6f7ff_0%,#fcfcff_100%)] border-b border-[#edf0f7]">
          <div className="flex items-center gap-3 min-w-0">
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
                              currentIdx === idx
                                ? "w-6 bg-white"
                                : "w-2.5 bg-white/60"
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

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleLike(campaignId)}
                className={`flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium ${
                  isLiked[campaignId]
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                {actionLoading[campaignId]?.like ? (
                  <LoadingOutlined />
                ) : isLiked[campaignId] ? (
                  <HeartFilled />
                ) : (
                  <HeartOutlined />
                )}
                <span>{likeCount[campaignId] || 0}</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setIsCommentsModalOpen((prev) => ({
                    ...prev,
                    [campaignId]: true,
                  }))
                }
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700"
              >
                <MessageOutlined />
                <span>{comments[campaignId]?.length || 0}</span>
              </button>

              <button
                type="button"
                onClick={() => handleShare(campaign)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700"
              >
                <ShareAltOutlined />
              </button>

              <button
                type="button"
                onClick={() => handleDislike(campaignId)}
                className={`flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium ${
                  isDisliked[campaignId]
                    ? "border-slate-300 bg-slate-100 text-slate-700"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                {actionLoading[campaignId]?.dislike ? (
                  <LoadingOutlined />
                ) : isDisliked[campaignId] ? (
                  <DislikeFilled />
                ) : (
                  <DislikeOutlined />
                )}
                <span>Dislike</span>
                <span>{dislikeCount[campaignId] || 0}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSpeakDescription(campaignId)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700"
              >
                <SoundOutlined />
                <span>{isSpeaking[campaignId] ? "Stop" : "Listen"}</span>
              </button>
            </div>
          </div>

          <div className="border-t xl:border-t-0 xl:border-l border-[#edf0f7] bg-[#fcfdff] p-4 sm:p-6">
            <div className="h-[260px] sm:h-[420px] xl:h-[420px] overflow-y-auto pr-2 custom-scrollbar">
              {teams.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <TrophyOutlined className="text-amber-600" />
                    <h3 className="m-0 text-[15px] sm:text-[16px] font-semibold text-slate-900">
                      Poll
                    </h3>
                  </div>

                  {selectedTeam ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {teams.map((team) => {
                          const isSelected = selectedTeam === team;
                          return (
                            <button
                              key={team}
                              type="button"
                              disabled
                              className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${
                                isSelected
                                  ? "border-green-500 bg-green-50 text-green-700"
                                  : "border-slate-200 bg-white text-slate-400"
                              } cursor-default`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <span className="font-medium text-[14px]">
                                  {team}
                                </span>
                                {isSelected ? (
                                  <CheckCircleFilled className="text-green-600" />
                                ) : null}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-[13px] sm:text-[14px] text-green-700">
                        Your selected answer:{" "}
                        <span className="font-semibold">{selectedTeam}</span>
                      </div>
                    </>
                  ) : !pollExpired ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {teams.map((team) => (
                        <button
                          key={team}
                          type="button"
                          onClick={() => handleVote(campaign, team)}
                          disabled={isLoadingVote || !!selectedTeam}
                          className="w-full rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-amber-400 hover:bg-amber-50 px-4 py-3 text-left transition-all"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-medium text-[14px]">
                              {team}
                            </span>
                            {isLoadingVote ? <LoadingOutlined /> : null}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl bg-slate-100 px-4 py-3 text-[14px] text-slate-600 flex items-center gap-2">
                      <ClockCircleOutlined />
                      Poll ended
                    </div>
                  )}
                </div>
              )}

              {campaign?.campaignDescription && (
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="m-0 text-[15px] sm:text-[16px] font-semibold text-slate-900">
                      Description
                    </h3>

                    <button
                      type="button"
                      onClick={() => handleSpeakDescription(campaignId)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] sm:text-[13px] text-slate-600 hover:bg-slate-50"
                    >
                      <SoundOutlined />
                      {isSpeaking[campaignId] ? "Stop" : "Listen"}
                    </button>
                  </div>

                  <div className="text-slate-700">
                    {formatCampaignDescription(campaign.campaignDescription)}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={handleAddblog}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg"
              >
                <PlusOutlined />
                Add Blog Post
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading || !pageReady) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex min-h-screen items-center justify-center">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (!featuredCampaign) {
    return (
      <div className="min-h-screen bg-slate-50">
        {!userId && <Header1 />}
        {renderNotFoundPage()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <div className="mb-4 p-2">
        {pageReady && !userId && (
          <div className="mb-4 p-2">
            <Header1 />
          </div>
        )}{" "}
      </div>

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
        `}
      </style>

      <div className="px-3 sm:px-5 lg:px-8 py-5 sm:py-7">
        <div className="mx-auto max-w-[1550px]">
          <div className="mb-6 rounded-[28px] border border-[#eef1f7] bg-gradient-to-r from-white to-[#f8fafc] px-6 sm:px-10 py-6 shadow-[0_15px_40px_rgba(15,23,42,0.06)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* LEFT CONTENT */}
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

            {/* RIGHT BUTTON */}
            <button
              type="button"
              onClick={handleAddblog}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3b82f6] to-[#9333ea] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:scale-105 transition-all duration-300"
            >
              <PlusOutlined />
              Add Blog
            </button>
          </div>

          <div className="space-y-6">
            {orderedCampaigns.map((campaign) => renderCampaignCard(campaign))}
          </div>
        </div>
      </div>

      <ResponsiveModalWrapper
        open={isWriteToUsOpen}
        onClose={closeWriteToUsModal}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white/95 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Write To Us
            </h2>
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
              {selectedCampaign
                ? getCampaignTitle(selectedCampaign)
                : "Selected Blog"}
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

      <ResponsiveModalWrapper
        open={isProfileModalOpen}
        onClose={closeProfileModal}
      >
        <div className="p-6 text-center">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            Complete Your Profile
          </h2>

          {/* 🔥 THIS IS YOUR 4TH POINT */}
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

      <ResponsiveModalWrapper
        open={isSuccessModalOpen}
        onClose={closeSuccessModal}
      >
        <div className="px-5 py-6 sm:px-6 sm:py-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <span className="text-2xl">✓</span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Submitted Successfully
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Your query has been submitted successfully. Our team will contact
            you soon.
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

      {Object.entries(isCommentsModalOpen).map(([campaignId, open]) => {
        if (!open) return null;

        return (
          <ResponsiveModalWrapper
            key={campaignId}
            open={open}
            onClose={() => {
              setIsCommentsModalOpen((prev) => ({
                ...prev,
                [campaignId]: false,
              }));
              setComment("");
              setActiveReplyCommentId(null);
            }}
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white/95 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Comments
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Read comments and add your response.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsCommentsModalOpen((prev) => ({
                    ...prev,
                    [campaignId]: false,
                  }));
                  setComment("");
                  setActiveReplyCommentId(null);
                }}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <span className="text-lg leading-none">×</span>
              </button>
            </div>

            <div className="px-5 py-5 sm:px-6">
              <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
                {(comments[campaignId] || []).length > 0 ? (
                  comments[campaignId].map((item, index) => (
                    <div
                      key={item.mainCommentId || index}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="text-sm text-slate-800 font-medium">
                        {item.mainComment}
                      </p>

                      {item.subComments?.length > 0 && (
                        <div className="mt-3 space-y-2 pl-4 border-l-2 border-slate-200">
                          {item.subComments.map((sub, subIndex) => (
                            <p
                              key={subIndex}
                              className="text-sm text-slate-600"
                            >
                              {sub.comment}
                            </p>
                          ))}
                        </div>
                      )}

                      <button
                        className="mt-3 text-sm font-semibold text-indigo-600"
                        onClick={() =>
                          setActiveReplyCommentId(item.mainCommentId)
                        }
                      >
                        Reply
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No comments yet.</p>
                )}
              </div>

              <div className="mt-5">
                <TextArea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder={
                    activeReplyCommentId
                      ? "Write your reply..."
                      : "Write your comment..."
                  }
                  className="rounded-2xl"
                />

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleOk(campaignId)}
                    className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg"
                  >
                    {activeReplyCommentId ? "Submit Reply" : "Submit Comment"}
                  </button>
                </div>
              </div>
            </div>
          </ResponsiveModalWrapper>
        );
      })}
    </div>
  );
};

export default BlogDetails;