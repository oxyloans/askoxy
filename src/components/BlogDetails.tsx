import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Input, message, Modal, Spin } from "antd";
import {
  DislikeFilled,
  DislikeOutlined,
  HeartFilled,
  HeartOutlined,
  LikeFilled,
  LikeOutlined,
  LoadingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Header1 from "./Header";
import {
  fetchCampaigns,
  fetchLikesAndComments,
  submitUserInteraction,
  submitSubComment,
  Campaign,
  submitWriteToUsQuery,
} from "./servicesapi";

const { TextArea } = Input;

interface Image {
  imageId: string;
  imageUrl: string;
  status: boolean;
}

interface Comment {
  mainComment: string;
  mainCommentId: string;
  subComments: SubComment[];
}

interface SubComment {
  userId: string;
  comment: string;
}

const BlogDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const blogId = pathParts[pathParts.indexOf("blog") + 1];
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [comment, setComment] = useState("");
  const [activeReplyCommentId, setActiveReplyCommentId] = useState<
    string | null
  >(null);
  const [isSpeaking, setIsSpeaking] = useState<{ [key: string]: boolean }>({});
  const [isLiked, setIsLiked] = useState<{ [key: string]: boolean }>({});
  const [isDisliked, setIsDisliked] = useState<{ [key: string]: boolean }>({});
  const [likeCount, setLikeCount] = useState<{ [key: string]: number }>({});
  const [dislikeCount, setDislikeCount] = useState<{ [key: string]: number }>(
    {}
  );
  const [isSubscribed, setIsSubscribed] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: string]: number;
  }>({});
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState<{
    [key: string]: boolean;
  }>({});
  const [actionLoading, setActionLoading] = useState<{
    [key: string]: { like?: boolean; dislike?: boolean; subscribe?: boolean };
  }>({});
  const [isOpen, setIsOpen] = useState(false);
  const [isprofileOpen, setIsprofileOpen] = useState(false);
  const [issuccessOpen, setSuccessOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [queryError, setQueryError] = useState("");
  const email = JSON.parse(
    localStorage.getItem("profileData") || "{}"
  ).customerEmail;
  const finalMobileNumber =
    localStorage.getItem("whatsappNumber") ||
    localStorage.getItem("mobileNumber");

  useEffect(() => {
    const loadCampaignsAndComments = async () => {
      setIsLoading(true);
      try {
        const allCampaigns = await fetchCampaigns();
        const activeBlogCampaigns = allCampaigns.filter(
          (c) => c.campainInputType === "BLOG" && c.campaignStatus === true
        );

        const campaignsWithDetails = await Promise.all(
          activeBlogCampaigns.map(async (campaign) => {
            if (campaign.campaignId) {
              const {
                likesTotalCount,
                dislikesTotalCount,
                subComments,
                isLiked,
                isDisliked,
                isSubscribed,
              } = await fetchLikesAndComments(campaign.campaignId, userId);
              setLikeCount((prev) => ({
                ...prev,
                [campaign.campaignId]: likesTotalCount,
              }));
              setDislikeCount((prev) => ({
                ...prev,
                [campaign.campaignId]: dislikesTotalCount,
              }));
              setComments((prev) => ({
                ...prev,
                [campaign.campaignId]: subComments,
              }));
              setIsLiked((prev) => ({
                ...prev,
                [campaign.campaignId]: isLiked,
              }));
              setIsDisliked((prev) => ({
                ...prev,
                [campaign.campaignId]: isDisliked,
              }));
              setIsSubscribed((prev) => ({
                ...prev,
                [campaign.campaignId]: isSubscribed,
              }));
              return {
                ...campaign,
                likesTotalCount,
                dislikesTotalCount,
                subComments,
                isLiked,
                isDisliked,
                isSubscribed,
              };
            }
            return campaign;
          })
        );

        setCampaigns(campaignsWithDetails);
      } catch (error) {
        console.error("Error loading campaigns or comments:", error);
        setCampaigns([]);
      }
      setIsLoading(false);
    };

    loadCampaignsAndComments();
  }, [userId]);

  const featuredCampaign = campaigns.find(
    (campaign) => campaign.campaignId?.slice(-4) === blogId
  );
  const otherCampaigns = campaigns.filter(
    (campaign) => campaign.campaignId?.slice(-4) !== blogId
  );

  const handleLike = async (campaignId: string) => {
    if (!accessToken) {
      message.warning("Please login to like this post.");
      navigate("/whatsappregister");
      sessionStorage.setItem(
        "redirectPath",
        `/main/blog/${campaignId.slice(-4)}/BLOG`
      );
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
            ? (prev[campaignId] || 0) - 1
            : (prev[campaignId] || 0) + 1,
        }));
        setIsLiked((prev) => ({ ...prev, [campaignId]: !prev[campaignId] }));
        if (isDisliked[campaignId]) {
          setDislikeCount((prev) => ({
            ...prev,
            [campaignId]: (prev[campaignId] || 0) - 1,
          }));
          setIsDisliked((prev) => ({ ...prev, [campaignId]: false }));
        }
      } else {
        message.error("Failed to like the post.");
      }
    } catch (error) {
      message.error("Failed to like the post.");
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [campaignId]: { ...prev[campaignId], like: false },
      }));
    }
  };

  const handleDislike = async (campaignId: string) => {
    if (!accessToken) {
      message.warning("Please login to dislike this post.");
      navigate("/whatsappregister");
      sessionStorage.setItem(
        "redirectPath",
        `/main/blog/${campaignId.slice(-4)}/BLOG`
      );
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
            ? (prev[campaignId] || 0) - 1
            : (prev[campaignId] || 0) + 1,
        }));
        setIsDisliked((prev) => ({ ...prev, [campaignId]: !prev[campaignId] }));
        if (isLiked[campaignId]) {
          setLikeCount((prev) => ({
            ...prev,
            [campaignId]: (prev[campaignId] || 0) - 1,
          }));
          setIsLiked((prev) => ({ ...prev, [campaignId]: false }));
        }
      } else {
        message.error("Failed to dislike the post.");
      }
    } catch (error) {
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
      navigate("/whatsappregister");
      sessionStorage.setItem(
        "redirectPath",
        `/main/blog/${campaignId.slice(-4)}/BLOG`
      );
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
    } catch (error) {
      message.error("Failed to subscribe.");
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [campaignId]: { ...prev[campaignId], subscribe: false },
      }));
    }
  };

  const handleOk = async (campaignId: string) => {
    if (!accessToken || !userId) {
      message.warning("Please login to add a comment.");
      navigate("/whatsappregister");
      sessionStorage.setItem(
        "redirectPath",
        `/main/blog/${campaignId.slice(-4)}/BLOG`
      );
      return;
    }

    if (comment.trim() === "") {
      message.error("Please enter a comment before submitting.");
      return;
    }

    try {
      if (activeReplyCommentId) {
        const success = await submitSubComment(
          activeReplyCommentId,
          comment,
          userId
        );
        if (success) {
          message.success("Sub-comment submitted successfully!");
          const { subComments } = await fetchLikesAndComments(
            campaignId,
            userId
          );
          setComments((prev) => ({ ...prev, [campaignId]: subComments }));
        } else {
          message.error("Failed to submit sub-comment. Please try again.");
        }
      } else {
        const success = await submitUserInteraction({
          campaignId,
          interavtionType: "COMMENTS",
          userComments: comment,
          userId,
        });
        if (success) {
          message.success("Comment submitted successfully!");
          const { subComments } = await fetchLikesAndComments(
            campaignId,
            userId
          );
          setComments((prev) => ({ ...prev, [campaignId]: subComments }));
        } else {
          message.error("Failed to submit comment. Please try again.");
        }
      }
    } catch (error) {
      message.error("Error submitting comment. Please try again.");
    } finally {
      setComment("");
      setActiveReplyCommentId(null);
    }
  };

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 30);

  const handleWriteToUs = (campaign: Campaign) => {
    if (!accessToken || !userId) {
      message.warning("Please login to write to us.");
      navigate("/whatsappregister");
      sessionStorage.setItem(
        "redirectPath",
        `/main/blog/${campaign.campaignId.slice(-4)}/${slugify(
          campaign.campaignType
        )}`
      );
      return;
    }

    if (
      !email ||
      email === "null" ||
      !finalMobileNumber ||
      finalMobileNumber === "null"
    ) {
      setIsprofileOpen(true);
    } else {
      setIsOpen(true);
    }
  };

  const handleWriteToUsSubmitButton = async () => {
    if (!query || query.trim() === "") {
      setQueryError("Please enter the query before submitting.");
      return;
    }

    const campaign = campaigns.find((c) => c.campaignId?.slice(-4) === blogId);
    const campaignType = campaign?.campaignType || "Unknown Campaign";
    const success = await submitWriteToUsQuery(
      email,
      finalMobileNumber,
      query,
      campaignType,
      userId
    );

    if (success) {
      setSuccessOpen(true);
      setIsOpen(false);
      setQuery("");
    } else {
      message.error("Failed to send query. Please try again.");
    }
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
    const lowercaseUrl = url.toLowerCase();
    return videoExtensions.some((ext) => lowercaseUrl.endsWith(ext));
  };

  const getVideoType = (url: string): string => {
    const lowercaseUrl = url.toLowerCase();
    if (lowercaseUrl.endsWith(".mp4") || lowercaseUrl.endsWith(".m4v"))
      return "video/mp4";
    if (lowercaseUrl.endsWith(".webm")) return "video/webm";
    if (lowercaseUrl.endsWith(".ogg")) return "video/ogg";
    if (lowercaseUrl.endsWith(".mov")) return "video/quicktime";
    if (lowercaseUrl.endsWith(".avi")) return "video/x-msvideo";
    if (lowercaseUrl.endsWith(".wmv")) return "video/x-ms-wmv";
    if (lowercaseUrl.endsWith(".flv")) return "video/x-flv";
    return "video/mp4";
  };

  const nextImage = (campaignId: string, imageUrls: Image[]) => {
    if (imageUrls && imageUrls.length > 0) {
      setCurrentImageIndex((prev) => ({
        ...prev,
        [campaignId]:
          (prev[campaignId] || 0) === imageUrls.length - 1
            ? 0
            : (prev[campaignId] || 0) + 1,
      }));
    }
  };

  const prevImage = (campaignId: string, imageUrls: Image[]) => {
    if (imageUrls && imageUrls.length > 0) {
      setCurrentImageIndex((prev) => ({
        ...prev,
        [campaignId]:
          (prev[campaignId] || 0) === 0
            ? imageUrls.length - 1
            : (prev[campaignId] || 0) - 1,
      }));
    }
  };

  const formatCampaignDescription = (description: string) => {
    if (!description) return null;

    const lines = description.split("\n").filter((line) => line.trim());

    return lines
      .map((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine === "" || trimmedLine === "---") return null;

        const isHeading =
          trimmedLine.startsWith("###") ||
          trimmedLine.startsWith("##") ||
          (trimmedLine.startsWith("**") &&
            trimmedLine.endsWith("**") &&
            trimmedLine.length > 4) ||
          (trimmedLine.includes("###") && trimmedLine.includes("**")) ||
          trimmedLine.startsWith("####");

        if (isHeading) {
          let cleanText = trimmedLine
            .replace(/^#+\s*/, "")
            .replace(/^\*\*|\*\*$/g, "")
            .replace(/\*/g, "")
            .trim();

          return (
            <h3
              key={`heading-${index}`}
              className="text-base sm:text-lg font-bold text-gray-800 mt-4 mb-2"
            >
              {cleanText}
            </h3>
          );
        } else if (
          trimmedLine.startsWith("*") ||
          trimmedLine.startsWith("✅") ||
          trimmedLine.startsWith("•") ||
          trimmedLine.startsWith("-")
        ) {
          // Remove all * characters except the first one (bullet symbol)
          let cleanBulletText = trimmedLine;
          const firstChar = cleanBulletText.charAt(0);

          if (firstChar === "*") {
            // Keep first * as bullet, remove all other * characters
            cleanBulletText =
              firstChar + cleanBulletText.slice(1).replace(/\*/g, "");
          } else {
            // For other bullet symbols (✅, •, -), remove all * characters
            cleanBulletText = cleanBulletText.replace(/\*/g, "");
          }

          return (
            <div key={`bullet-${index}`} className="mb-2">
              <span className="text-gray-600 text-sm sm:text-base">
                {cleanBulletText}
              </span>
            </div>
          );
        } else {
          // Remove all * characters from regular paragraphs
          const cleanText = trimmedLine.replace(/\*/g, "");

          const renderTextWithLinks = (text: string) => {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const parts = text.split(urlRegex);
            return parts.map((part, i) => {
              if (urlRegex.test(part)) {
                return (
                  <a
                    key={i}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline break-words"
                  >
                    {part}
                  </a>
                );
              }
              return <span key={i}>{part}</span>;
            });
          };

          return (
            <p
              key={`para-${index}`}
              className="text-gray-600 mb-2 text-sm sm:text-base"
            >
              {renderTextWithLinks(cleanText)}
            </p>
          );
        }
      })
      .filter(Boolean);
  };

  const handleSpeakDescription = (campaignId: string) => {
    const campaign = campaigns.find((c) => c.campaignId === campaignId);
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
    utterance.rate = 0.8;
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

  const handleShare = (campaign: Campaign) => {
    if (!campaign) return;

    const shareUrl = `${
      window.location.origin
    }/main/blog/${campaign.campaignId.slice(-4)}/${slugify(
      campaign.campaignType
    )}`;

    if (navigator.share) {
      navigator
        .share({
          title: campaign.campaignType,
          text: campaign.campaignDescription,
          url: shareUrl,
        })
        .catch(console.error);
    } else {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => message.success("Link copied to clipboard!"))
        .catch(() => message.error("Failed to copy link"));
    }
  };

  const showCommentsModal = async (campaignId: string) => {
    setIsCommentsModalOpen((prev) => ({ ...prev, [campaignId]: true }));
    try {
      const { subComments } = await fetchLikesAndComments(campaignId, userId);
      setComments((prev) => ({ ...prev, [campaignId]: subComments }));
    } catch (error) {
      console.error("Error fetching comments:", error);
      message.error("Failed to load comments.");
    }
  };

  const handlePopUOk = () => {
    setIsprofileOpen(false);
    navigate("/main/profile");
  };

  const handleAddblog = () => {
    if (userId) {
      navigate("/main/addblogs");
    } else {
      message.info("please Login to add your blog");
      sessionStorage.setItem("redirectPath", "/main/addblogs");
      navigate("/whatsapplogin");
    }
  };

  const renderCampaign = (campaign: Campaign) => (
    <div
      key={campaign.campaignId}
      className="w-full bg-white rounded-lg shadow-lg overflow-hidden mb-6
           max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl
           mx-auto"
    >
      <div className="p-4 border-b flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-gray-400 rounded-full p-2 flex items-center justify-center">
            <UserOutlined className="text-white text-base sm:text-xl" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-gray-600">
            {campaign.campaignTypeAddBy || "Admin"}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center flex-1">
          {campaign.campaignType}
        </h1>

        <div className="flex gap-2">
          <button
            className={`px-3 py-1 text-xs sm:text-sm rounded-full transition-all flex items-center gap-1 ${
              isSubscribed[campaign.campaignId]
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={() => handleSubscribe(campaign.campaignId)}
            disabled={actionLoading[campaign.campaignId]?.subscribe}
          >
            {actionLoading[campaign.campaignId]?.subscribe ? (
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{ fontSize: 16, color: "white" }}
                    spin
                  />
                }
              />
            ) : isSubscribed[campaign.campaignId] ? (
              "Subscribed"
            ) : (
              "Subscribe"
            )}
          </button>
          <button
            className="px-3 py-1 text-xs sm:text-sm bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-all"
            onClick={() => handleWriteToUs(campaign)}
          >
            Write To Us
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 relative bg-gray-100 flex items-center justify-center">
          {campaign.imageUrls &&
          campaign.imageUrls.length > 0 &&
          campaign.imageUrls[currentImageIndex[campaign.campaignId] ?? 0]
            ?.imageUrl ? (
            <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[400px]">
              <div className="w-full h-full flex items-center justify-center">
                {isVideoUrl(
                  campaign.imageUrls[
                    currentImageIndex[campaign.campaignId] ?? 0
                  ].imageUrl
                ) ? (
                  <video
                    controls
                    autoPlay={false}
                    muted
                    className="w-full h-full object-contain"
                  >
                    <source
                      src={
                        campaign.imageUrls[
                          currentImageIndex[campaign.campaignId] ?? 0
                        ].imageUrl
                      }
                      type={getVideoType(
                        campaign.imageUrls[
                          currentImageIndex[campaign.campaignId] ?? 0
                        ].imageUrl
                      )}
                    />
                    <source
                      src={
                        campaign.imageUrls[
                          currentImageIndex[campaign.campaignId] ?? 0
                        ].imageUrl
                      }
                      type="video/mp4"
                    />
                    <source
                      src={
                        campaign.imageUrls[
                          currentImageIndex[campaign.campaignId] ?? 0
                        ].imageUrl
                      }
                      type="video/webm"
                    />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={
                      campaign.imageUrls[
                        currentImageIndex[campaign.campaignId] ?? 0
                      ].imageUrl
                    }
                    alt={`${campaign.campaignType} - ${
                      (currentImageIndex[campaign.campaignId] ?? 0) + 1
                    }`}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              {campaign.imageUrls.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      prevImage(campaign.campaignId, campaign.imageUrls)
                    }
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="15,18 9,12 15,6"></polyline>
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      nextImage(campaign.campaignId, campaign.imageUrls)
                    }
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="9,18 15,12 9,6"></polyline>
                    </svg>
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {campaign.imageUrls.map((_, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          setCurrentImageIndex((prev) => ({
                            ...prev,
                            [campaign.campaignId]: index,
                          }))
                        }
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index ===
                          (currentImageIndex[campaign.campaignId] ?? 0)
                            ? "bg-white scale-125"
                            : "bg-white bg-opacity-50 hover:bg-opacity-75"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
              {isOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
                  <div className="relative bg-white rounded-lg shadow-md p-6 w-96">
                    <i
                      className="fas fa-times absolute top-3 right-3 text-xl text-gray-700 cursor-pointer hover:text-red-600"
                      onClick={() => setIsOpen(false)}
                      aria-label="Close"
                    />
                    <h2 className="text-xl font-semibold mb-4 text-blue-800">
                      Write To Us
                    </h2>
                    <div className="mb-4">
                      <label
                        className="block text-sm text-gray-700 font-semibold mb-1"
                        htmlFor="phone"
                      >
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        id="phone"
                        disabled={true}
                        value={finalMobileNumber || ""}
                        className="block w-full text-gray-700 px-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Enter your mobile number"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-sm text-gray-700 font-semibold mb-1"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email || ""}
                        disabled={true}
                        className="block w-full text-gray-700 px-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-sm text-gray-700 font-semibold mb-1"
                        htmlFor="query"
                      >
                        Query
                      </label>
                      <textarea
                        id="query"
                        rows={3}
                        className="block w-full text-gray-700 px-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Enter your query"
                        onChange={(e) => setQuery(e.target.value)}
                      />
                      {queryError && (
                        <p className="text-red-500 text-sm mt-1">
                          {queryError}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-center">
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
                        onClick={handleWriteToUsSubmitButton}
                      >
                        Submit Query
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {isprofileOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                  <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-semibold text-blue-700">
                        Alert!
                      </h2>
                      <button
                        className="text-red-600 text-xl font-bold hover:text-red-700"
                        onClick={() => setIsprofileOpen(false)}
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-center text-gray-700 mb-6">
                      Please fill your profile details.
                    </p>
                    <div className="flex justify-center">
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        onClick={handlePopUOk}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {issuccessOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                  <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
                    <h2 className="text-xl font-semibold text-green-600 mb-4">
                      Success!
                    </h2>
                    <p className="text-gray-700 mb-6">
                      Query submitted successfully!
                    </p>
                    <div className="flex justify-center">
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        onClick={() => setSuccessOpen(false)}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[400px] flex items-center justify-center text-gray-500">
              No media available
            </div>
          )}
        </div>

        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto max-h-64 sm:max-h-80 md:max-h-96 lg:max-h-[400px]">
            {campaign.campaignDescription && (
              <div className="prose max-w-none text-sm sm:text-base">
                {formatCampaignDescription(campaign.campaignDescription)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-all duration-200"
            onClick={() => handleLike(campaign.campaignId)}
            disabled={actionLoading[campaign.campaignId]?.like}
          >
            {actionLoading[campaign.campaignId]?.like ? (
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />}
              />
            ) : isLiked[campaign.campaignId] ? (
              <HeartFilled style={{ fontSize: 18, color: "#ef4444" }} />
            ) : (
              <HeartOutlined style={{ fontSize: 18 }} />
            )}
            <span className="text-xs sm:text-sm font-medium">
              {likeCount[campaign.campaignId] || 0}
            </span>
          </button>
          <button
            className={`flex items-center gap-1 transition-all ${
              isDisliked[campaign.campaignId]
                ? "text-blue-500"
                : "text-gray-700 hover:text-blue-500"
            }`}
            onClick={() => handleDislike(campaign.campaignId)}
            disabled={actionLoading[campaign.campaignId]?.dislike}
          >
            {actionLoading[campaign.campaignId]?.dislike ? (
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />}
              />
            ) : isDisliked[campaign.campaignId] ? (
              <DislikeFilled style={{ fontSize: 18 }} />
            ) : (
              <DislikeOutlined style={{ fontSize: 18 }} />
            )}
            <span className="text-xs sm:text-sm">
              {dislikeCount[campaign.campaignId] || 0}
            </span>
          </button>

          <button
            className="flex items-center gap-1 text-gray-700 hover:text-blue-500 transition-all"
            onClick={() => showCommentsModal(campaign.campaignId)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-.9-3.8L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            <span className="text-xs sm:text-sm">
              {comments[campaign.campaignId]?.length || 0}
            </span>
          </button>
          <button
            className="flex items-center gap-1 text-gray-700 hover:text-green-500 transition-all"
            onClick={() => handleShare(campaign)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
        </div>
        <button
          className={`flex items-center gap-1 transition-all ${
            isSpeaking[campaign.campaignId]
              ? "text-orange-500"
              : "text-gray-700 hover:text-orange-500"
          }`}
          onClick={() => handleSpeakDescription(campaign.campaignId)}
        >
          {isSpeaking[campaign.campaignId] ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="11 5,6 9,2 9,2 15,6 15,11 19"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          )}
        </button>
      </div>
    </div>
  );

  const renderNotFoundPage = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-10 px-4">
      <div className="text-center">
        <div className="mb-6 text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
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
          className="px-4 py-2 sm:px-6 sm:py-3 bg-[#3d2a71] text-white rounded-lg shadow-lg hover:bg-[#2a1d4e] transition-all"
        >
          Return Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full overflow-y-auto min-h-screen">
      <div
        className={`p-2 ${
          !userId ? "px-6 sm:px-8 lg:px-10" : "px-4 sm:px-6 lg:px-8"
        }`}
      >
        {!userId && <Header1 />}

        <div className={`flex justify-end ${userId === null ? "mt-8" : ""}`}>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-xs sm:text-sm"
            onClick={() => {
              handleAddblog();
            }}
          >
            Add New Blog
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
              size="large"
            />
            <p className="mt-4 text-gray-600">Loading blog details...</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8 px-2 sm:px-4 lg:px-6 xl:px-8">
          {campaigns.length === 0 || (!featuredCampaign && blogId) ? (
            renderNotFoundPage()
          ) : (
            <>
              {featuredCampaign && renderCampaign(featuredCampaign)}
              {otherCampaigns.length > 0 &&
                otherCampaigns.map((campaign) => renderCampaign(campaign))}
            </>
          )}
        </div>
      )}

      {campaigns.map((campaign) => (
        <Modal
          key={campaign.campaignId}
          title=""
          open={isCommentsModalOpen[campaign.campaignId] || false}
          onCancel={() => {
            setIsCommentsModalOpen((prev) => ({
              ...prev,
              [campaign.campaignId]: false,
            }));
            setActiveReplyCommentId(null);
            setComment("");
          }}
          footer={null}
          width="90%"
          className="comments-modal max-w-3xl"
        >
          <div className="flex flex-col sm:flex-row h-[500px] sm:h-96">
            <div className="w-full sm:w-1/2 bg-gray-100 flex items-center justify-center relative">
              {campaign.imageUrls &&
              campaign.imageUrls.length > 0 &&
              campaign.imageUrls[currentImageIndex[campaign.campaignId] ?? 0]
                ?.imageUrl ? (
                <div className="relative w-full h-64 sm:h-full">
                  <div className="w-full h-full flex items-center justify-center">
                    {isVideoUrl(
                      campaign.imageUrls[
                        currentImageIndex[campaign.campaignId] ?? 0
                      ].imageUrl
                    ) ? (
                      <video
                        controls
                        autoPlay={false}
                        muted
                        className="max-w-full max-h-full object-contain"
                      >
                        <source
                          src={
                            campaign.imageUrls[
                              currentImageIndex[campaign.campaignId] ?? 0
                            ].imageUrl
                          }
                          type={getVideoType(
                            campaign.imageUrls[
                              currentImageIndex[campaign.campaignId] ?? 0
                            ].imageUrl
                          )}
                        />
                        <source
                          src={
                            campaign.imageUrls[
                              currentImageIndex[campaign.campaignId] ?? 0
                            ].imageUrl
                          }
                          type="video/mp4"
                        />
                        <source
                          src={
                            campaign.imageUrls[
                              currentImageIndex[campaign.campaignId] ?? 0
                            ].imageUrl
                          }
                          type="video/webm"
                        />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={
                          campaign.imageUrls[
                            currentImageIndex[campaign.campaignId] ?? 0
                          ].imageUrl
                        }
                        alt={`${campaign.campaignType} - ${
                          (currentImageIndex[campaign.campaignId] ?? 0) + 1
                        }`}
                        className="max-w-full max-h-full object-contain"
                      />
                    )}
                  </div>
                  {campaign.imageUrls.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          prevImage(campaign.campaignId, campaign.imageUrls)
                        }
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <svg
                          className="w-6 h-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="15,18 9,12 15,6"></polyline>
                        </svg>
                      </button>
                      <button
                        onClick={() =>
                          nextImage(campaign.campaignId, campaign.imageUrls)
                        }
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <svg
                          className="w-6 h-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="9,18 15,12 9,6"></polyline>
                        </svg>
                      </button>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {campaign.imageUrls.map((_, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              setCurrentImageIndex((prev) => ({
                                ...prev,
                                [campaign.campaignId]: index,
                              }))
                            }
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                              index ===
                              (currentImageIndex[campaign.campaignId] ?? 0)
                                ? "bg-white scale-125"
                                : "bg-white bg-opacity-50 hover:bg-opacity-75"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No media available
                </div>
              )}
            </div>
            <div className="w-full sm:w-1/2 flex flex-col border-t sm:border-t-0 sm:border-l">
              <div className="p-3 border-b">
                <h3 className="font-semibold text-sm sm:text-base">Comments</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {comments[campaign.campaignId]?.map(
                  (comment) =>
                    !["like", "dislike", "subscribe"].includes(
                      comment.mainComment
                    ) && (
                      <div key={comment.mainCommentId} className="space-y-2">
                        <div className="flex gap-2 items-start">
                          {/* User Icon with gray-400 background */}
                          <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
                            <UserOutlined className="text-white text-sm" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs sm:text-sm font-medium text-gray-900">
                              {comment.mainComment}
                            </p>
                            <button
                              className="text-xs text-gray-500 hover:text-gray-700 mt-1"
                              onClick={() =>
                                setActiveReplyCommentId(comment.mainCommentId)
                              }
                            >
                              Reply
                            </button>
                          </div>
                        </div>

                        {comment.subComments.length > 0 && (
                          <div className="ml-4 space-y-1">
                            {comment.subComments.map((sub, index) => (
                              <div
                                key={index}
                                className="pl-8 text-xs sm:text-sm text-gray-600" // Increased left padding
                              >
                                <span className="font-medium">Reply:</span>{" "}
                                {sub.comment}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                )}
              </div>
              <div className="p-3 border-t">
                {activeReplyCommentId && (
                  <div className="mb-2 text-xs sm:text-sm text-gray-600">
                    Replying to:{" "}
                    {
                      comments[campaign.campaignId]?.find(
                        (c) => c.mainCommentId === activeReplyCommentId
                      )?.mainComment
                    }
                  </div>
                )}
                <div className="flex gap-2">
                  <TextArea
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={
                      activeReplyCommentId
                        ? "Enter your reply..."
                        : "Add a comment..."
                    }
                    className="flex-1 resize-none text-xs sm:text-sm"
                  />
                  <Button
                    type="primary"
                    onClick={() => handleOk(campaign.campaignId)}
                    disabled={!comment.trim()}
                    className="bg-blue-500 hover:bg-blue-600 text-xs sm:text-sm"
                  >
                    {activeReplyCommentId ? "Post Reply" : "Post"}
                  </Button>
                </div>
                {activeReplyCommentId && (
                  <Button
                    onClick={() => {
                      setActiveReplyCommentId(null);
                      setComment("");
                    }}
                    className="mt-2 text-xs sm:text-sm"
                  >
                    Cancel Reply
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      ))}
    </div>
  );
};

export default BlogDetails;
