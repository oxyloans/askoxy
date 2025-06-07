import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";
import { Button, Input, message, Modal } from "antd";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import BASE_URL from "../Config";
import Header1 from "./Header";
const { TextArea } = Input;

interface Image {
  imageId: string;
  imageUrl: string;
  status: boolean;
}

interface Campaign {
  campaignId: string;
  campaignType: string;
  campaignDescription: string;
  imageUrls: Image[];
  campaignTypeAddBy: string;
  campaignStatus: boolean;
  campainInputType: string;
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

const CampaignDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const campaignId = pathParts[pathParts.indexOf("campaign") + 1];
  const userId = localStorage.getItem("userId");
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [issuccessOpen, setSuccessOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const profileData = JSON.parse(localStorage.getItem("profileData") || "{}");
  const email = profileData.customerEmail || null;
  const [isprofileOpen, setIsprofileOpen] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | undefined>(undefined);
  const [query, setQuery] = useState("");
  const whatsappNumber = localStorage.getItem("whatsappNumber");
  const mobileNumber = localStorage.getItem("mobileNumber");
  const [campaign, setCampaign] = useState<Campaign>();
  const finalMobileNumber = whatsappNumber || mobileNumber || null;
  const [interested, setInterested] = useState<boolean>(false);
  const submitclicks = sessionStorage.getItem("submitclicks");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isDisliked, setIsDisliked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [dislikeCount, setDislikeCount] = useState<number>(0);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [subComment, setSubComment] = useState<{ [key: string]: string }>({});
  const [isSubCommentModalOpen, setIsSubCommentModalOpen] = useState<{
    [key: string]: boolean;
  }>({});

  // const createSimpleHash = (text: string): string => {
  //   let hash = 0;
  //   for (let i = 0; i < text.length; i++) {
  //     hash = (hash << 5) - hash + text.charCodeAt(i);
  //     hash = hash & hash;
  //   }
  //   return Math.abs(hash).toString(16).substring(0, 8);
  // };

  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<Campaign[]>(
          `${BASE_URL}/marketing-service/campgin/getAllCampaignDetails`
        );

        const campaignsWithIds = response.data.map((campaign) => ({
          ...campaign,
          campaignId: campaign.campaignId,
        }));

        const foundCampaign = campaignsWithIds.find(
          (c) => c.campaignId.slice(-4) === campaignId
        );

        if (!foundCampaign && campaignId) {
          try {
            const decodedName = decodeURIComponent(campaignId);
            const fallbackCampaign = campaignsWithIds.find(
              (c) =>
                c.campaignType.trim().slice(0, 10) ===
                decodedName.trim().slice(0, 10)
            );

            if (fallbackCampaign) {
              const newUrl = location.pathname.replace(
                campaignId,
                fallbackCampaign.campaignId as string
              );
              window.history.replaceState(null, "", newUrl);
              setCampaign(fallbackCampaign);
            }
          } catch (e) {
            console.error("Error with URL decoding:", e);
          }
        } else {
          setCampaign(foundCampaign);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, [campaignId, location.pathname]);

  useEffect(() => {
    handleLoadOffersAndCheckInterest();
    if (campaign?.campainInputType === "BLOG") {
      fetchLikesAndComments();
    }
  }, [campaign]);

  const fetchLikesAndComments = async () => {
    try {
      const url = `${BASE_URL}/marketing-service/campgin/getcampainlikesandcommentsbycamapignid?campaignId=${campaign?.campaignId}`;

      const finalUrl = userId ? `${url}&userId=${userId}` : url;

      const response = await axios.get(finalUrl, {
        headers: { accept: "*/*" },
      });
      if (response.status === 200) {
        setLikeCount(response.data.likesTotalCount || 0);
        setDislikeCount(response.data.dislikesTotalCount || 0);
        setComments(response.data.subComments || []);
        setIsLiked(
          response.data.subComments.some(
            (comment: Comment) =>
              comment.mainComment === "like" && comment.mainCommentId === userId
          )
        );
        setIsDisliked(
          response.data.subComments.some(
            (comment: Comment) =>
              comment.mainComment === "dislike" &&
              comment.mainCommentId === userId
          )
        );
        setIsSubscribed(
          response.data.subComments.some(
            (comment: Comment) =>
              comment.mainComment === "subscribe" &&
              comment.mainCommentId === userId
          )
        );
      }
    } catch (error) {
      console.error("Error fetching likes and comments:", error);
      message.error("Failed to load comments and likes.");
    }
  };

  const handleWriteToUs = () => {
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

    const campaignType = campaign?.campaignType || "Unknown Service";
    const payload = {
      email,
      mobileNumber: finalMobileNumber,
      queryStatus: "PENDING",
      projectType: "ASKOXY",
      askOxyOfers: campaignType,
      adminDocumentId: "",
      comments: "",
      id: "",
      resolvedBy: "",
      resolvedOn: "",
      status: "",
      userDocumentId: "",
      query,
      userId,
    };

    const accessToken = localStorage.getItem("accessToken");
    const apiUrl = `${BASE_URL}/writetous-service/saveData`;
    const headers = { Authorization: `Bearer ${accessToken}` };

    try {
      const response = await axios.post(apiUrl, payload, { headers });
      if (response.data) {
        setSuccessOpen(true);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error sending the query:", error);
      message.error("Failed to send query. Please try again.");
    }
  };

  const handleLoadOffersAndCheckInterest = async () => {
    if (!userId) return;

    try {
      const response = await axios.post(
        `${BASE_URL}/marketing-service/campgin/allOfferesDetailsForAUser`,
        { userId }
      );

      if (response.status === 200 && Array.isArray(response.data)) {
        const offers = response.data;
        const hasFreeRudrakshaOffer = offers.some(
          (offer: any) => offer.askOxyOfers === campaign?.campaignType
        );

        setInterested(hasFreeRudrakshaOffer);
        if (submitclicks) {
          handleSubmit(hasFreeRudrakshaOffer);
        }
      } else {
        setInterested(false);
      }
    } catch (error) {
      console.error("Error while fetching offers:", error);
      setInterested(false);
    }
  };

  const handleSubmit = (isAlreadyInterested: boolean) => {
    sessionStorage.setItem("submitclicks", "true");
    if (campaign?.campaignType !== undefined) {
      sessionStorage.setItem("campaigntype", campaign.campaignType);
    }

    if (!userId) {
      message.warning("Please login to submit your interest.");
      navigate("/whatsappregister");
      sessionStorage.setItem(
        "redirectPath",
        `/main/services/campaign/${campaignId}`
      );
      return;
    }

    if (isAlreadyInterested) {
      message.warning("You have already participated. Thank you!", 7);
      setTimeout(() => {
        sessionStorage.removeItem("submitclicks");
      }, 7000);
      return;
    }

    setIsRoleModalOpen(true);
  };

  const handleRoleToggle = (role: string) => {
    setSelectedRole((prev) => {
      const roles = prev.split(" ").filter((r) => r !== "");
      if (roles.includes(role)) {
        return roles.filter((r) => r !== role).join(" ");
      }
      return [...roles, role].join(" ");
    });
  };

  const handleRoleSelection = (roles: string) => {
    setIsRoleModalOpen(false);

    Modal.confirm({
      title: "Confirm Participation",
      content: `Are you sure you want to join as ${roles || "no role"}?`,
      okText: "Yes, I'm sure",
      cancelText: "Cancel",
      onOk: () => submitInterest(roles),
      onCancel: () => {
        sessionStorage.removeItem("submitclicks");
        setSelectedRole("");
      },
    });
  };

  const submitInterest = async (userRole: string) => {
    try {
      const campaignType = sessionStorage.getItem("campaigntype");
      const response = await axios.post(
        `${BASE_URL}/marketing-service/campgin/askOxyOfferes`,
        {
          askOxyOfers: campaignType,
          mobileNumber: finalMobileNumber,
          userId,
          projectType: "ASKOXY",
          userRole,
        }
      );
      localStorage.setItem("askOxyOfers", response.data.askOxyOfers);
      message.success(
        `Thank you for joining as ${userRole || "no role"} in our ${
          campaign?.campaignType
        } offer!`
      );
      if (response.status === 200) {
        setInterested(true);
        setIsButtonDisabled(true);
        sessionStorage.removeItem("campaigntype");
      }
    } catch (error) {
      console.error("API Error:", error);
      message.error("Failed to submit your interest. Please try again.");
      setInterested(false);
    } finally {
      sessionStorage.removeItem("submitclicks");
      setSelectedRole("");
    }
  };

  const handleSpeakDescription = () => {
    if (!campaign?.campaignDescription) {
      message.error("No content to read");
      return;
    }

    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
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

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      message.error("Speech synthesis failed");
    };

    speechSynthesis.speak(utterance);
  };

  const handlePopUOk = () => {
    setIsOpen(false);
    navigate("/main/profile");
  };

  const handleBuyNow = () => {
    if (!userId) {
      message.warning("Please login to buy now.");
      navigate("/whatsappregister");
      sessionStorage.setItem("redirectPath", `/main/dashboard/products`);
      return;
    } else {
      navigate("/main/dashboard/products");
    }
  };

  const showModal = () => {
    if (!userId) {
      message.warning("Please login to comment.");
      navigate("/whatsappregister");
      sessionStorage.setItem(
        "redirectPath",
        `/main/services/campaign/${campaignId}`
      );
      return;
    }
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (comment.trim() === "") {
      message.error("Please enter a comment before submitting.");
      return;
    }

    try {
      await submitUserInteraction("comment", comment);
      setIsModalOpen(false);
      setComment("");
      fetchLikesAndComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
      message.error("Failed to submit comment. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setComment("");
  };

  const handleSubComment = async (mainCommentId: string) => {
    if (!userId) {
      message.warning("Please login to add a sub-comment.");
      navigate("/whatsappregister");
      sessionStorage.setItem(
        "redirectPath",
        `/main/services/campaign/${campaignId}`
      );
      return;
    }

    const subCommentText = subComment[mainCommentId]?.trim();
    if (!subCommentText) {
      message.error("Please enter a sub-comment before submitting.");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/marketing-service/campgin/fillusersubinteractioncomments`,
        {
          mainCommentId,
          subComment: subCommentText,
          userId,
        },
        { headers: { accept: "*/*", "Content-Type": "application/json" } }
      );
      message.success("Sub-comment submitted successfully!");
      setSubComment((prev) => ({ ...prev, [mainCommentId]: "" }));
      setIsSubCommentModalOpen((prev) => ({ ...prev, [mainCommentId]: false }));
      fetchLikesAndComments();
    } catch (error) {
      console.error("Error submitting sub-comment:", error);
      message.error("Failed to submit sub-comment. Please try again.");
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
    return (
      videoExtensions.some((ext) => lowercaseUrl.includes(ext)) ||
      lowercaseUrl.includes("video")
    );
  };

  const submitUserInteraction = async (
    action: string,
    commentText: string = ""
  ) => {
    if (!userId) {
      message.warning("Please login to perform this action.");
      navigate("/whatsappregister");
      sessionStorage.setItem(
        "redirectPath",
        `/main/services/campaign/${campaignId}`
      );
      return;
    }

    const payload: any = {
      campaignId: campaign?.campaignId,
      userId,
      likeStatus: action === "like" ? "yes" : action === "dislike" ? "no" : "",
      subscribed: action === "subscribe" ? "yes" : "",
      userComments: action === "comment" ? commentText : "",
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/marketing-service/campgin/filluserinteractions`,
        payload,
        { headers: { accept: "*/*", "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        message.success(
          `${
            action.charAt(0).toUpperCase() + action.slice(1)
          } submitted successfully!`
        );
        if (action === "like") setIsLiked(true);
        if (action === "dislike") setIsDisliked(true);
        if (action === "subscribe") setIsSubscribed(true);
      }
    } catch (error) {
      console.error(`Error submitting ${action}:`, error);
      message.error(`Failed to submit ${action}. Please try again.`);
    }
  };

  const handleLike = async () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
      setIsLiked(false);
      await submitUserInteraction("like"); // Assuming API allows toggling
    } else {
      if (isDisliked) {
        setDislikeCount((prev) => prev - 1);
        setIsDisliked(false);
      }
      setLikeCount((prev) => prev + 1);
      setIsLiked(true);
      await submitUserInteraction("like");
    }
  };

  const handleDislike = async () => {
    if (isDisliked) {
      setDislikeCount((prev) => prev - 1);
      setIsDisliked(false);
      await submitUserInteraction("dislike"); // Assuming API allows toggling
    } else {
      if (isLiked) {
        setLikeCount((prev) => prev - 1);
        setIsLiked(false);
      }
      setDislikeCount((prev) => prev + 1);
      setIsDisliked(true);
      await submitUserInteraction("dislike");
    }
  };

  const handleSubscribe = async () => {
    setIsSubscribed(!isSubscribed);
    await submitUserInteraction("subscribe");
  };

  const handleCopyContent = () => {
    if (campaign?.campaignDescription) {
      navigator.clipboard
        .writeText(campaign.campaignDescription)
        .then(() => message.success("Content copied to clipboard!"))
        .catch(() => message.error("Failed to copy content"));
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: campaign?.campaignType,
          text: campaign?.campaignDescription,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => message.success("Link copied to clipboard!"))
        .catch(() => message.error("Failed to copy link"));
    }
  };

  const renderNotFoundPage = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-10">
        <div className="text-center">
          <div className="mb-6 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="120"
              height="120"
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
          <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Service Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            The service is currently inactive or unavailable.
          </p>
          <button
            onClick={() => navigate("/main")}
            className="px-6 py-3 bg-[#3d2a71] text-white rounded-lg shadow-lg hover:bg-[#2a1d4e] transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-4 p-2">{!userId ? <Header1 /> : null}</div>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
              size="large"
            />
            <p className="mt-4 text-gray-600">Loading service details...</p>
          </div>
        </div>
      ) : !campaign ? (
        renderNotFoundPage()
      ) : !campaign.campaignStatus ? (
        renderNotFoundPage()
      ) : (
        <div>
          <div className="flex flex-col mb-6 w-full">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
              {campaign.campaignType}
            </h1>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-end">
              {campaign.campainInputType === "PRODUCT" && (
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleBuyNow}
                  aria-label="Buy Now"
                  disabled={isButtonDisabled || interested}
                >
                  Buy Now
                </button>
              )}
              {campaign.campainInputType !== "BLOG" && (
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleSubmit(interested)}
                  aria-label="I'm Interested"
                  disabled={isButtonDisabled || interested}
                >
                  {!interested ? "I'm Interested" : "Already Participated"}
                </button>
              )}
              {campaign.campainInputType === "BLOG" && (
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 ${
                    isSubscribed
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                      : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"
                  }`}
                  onClick={handleSubscribe}
                  aria-label={isSubscribed ? "Unsubscribe" : "Subscribe"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span className="font-medium">
                    {isSubscribed ? "Subscribed" : "Subscribe"}
                  </span>
                </button>
              )}
              <button
                className="px-4 py-2 bg-[#f9b91a] text-white rounded-lg shadow-lg hover:bg-[#f4a307] transition-all"
                aria-label="Write To Us"
                onClick={handleWriteToUs}
              >
                Write To Us
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-8 mb-8">
            {campaign.imageUrls && campaign.imageUrls.length > 0 ? (
              campaign.imageUrls.length === 1 ? (
                <div className="flex justify-center px-4 sm:px-6">
                  <div className="relative w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
                    </div>
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      {isVideoUrl(campaign.imageUrls[0].imageUrl) ? (
                        <video
                          controls
                          className="w-full object-contain rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                          onLoadedData={(e) => {
                            const video = e.target as HTMLVideoElement;
                            const container = video.parentElement;
                            if (container) {
                              const spinner = container.previousElementSibling;
                              if (spinner && spinner.parentElement) {
                                spinner.remove();
                              }
                            }
                            video.style.opacity = "1";
                          }}
                          style={{
                            maxHeight: "min(600px, 80vh)",
                            opacity: "0",
                            transition: "opacity 0.3s ease-in-out",
                          }}
                        >
                          <source
                            src={campaign.imageUrls[0].imageUrl}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={campaign.imageUrls[0].imageUrl}
                          alt={campaign.campaignType}
                          className="w-full object-contain rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                          onLoad={(e) => {
                            const img = e.target as HTMLImageElement;
                            const aspectRatio =
                              img.naturalWidth / img.naturalHeight;
                            const container = img.parentElement;

                            if (container) {
                              if (aspectRatio > 1.2) {
                                img.style.maxHeight = "min(480px, 70vh)";
                              } else if (aspectRatio < 0.8) {
                                img.style.maxHeight = "min(600px, 80vh)";
                              } else {
                                img.style.maxHeight = "min(500px, 75vh)";
                              }
                              container.style.height = "auto";
                            }

                            const spinner = container?.previousElementSibling;
                            if (spinner && spinner.parentElement) {
                              spinner.remove();
                            }
                            img.style.opacity = "1";
                          }}
                          style={{
                            opacity: "0",
                            transition: "opacity 0.3s ease-in-out",
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-6">
                  {campaign.imageUrls.map((image, index) => (
                    <div
                      key={image.imageId}
                      className="relative bg-gray-50 rounded-lg overflow-hidden h-auto"
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
                      </div>
                      <div className="bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                        {isVideoUrl(image.imageUrl) ? (
                          <video
                            controls
                            className="w-full object-contain rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                            onLoadedData={(e) => {
                              const video = e.target as HTMLVideoElement;
                              const container = video.parentElement;
                              if (container) {
                                container.style.height = "auto";
                                const spinner =
                                  container.previousElementSibling;
                                if (spinner && spinner.parentElement) {
                                  spinner.remove();
                                }
                              }
                              video.style.opacity = "1";
                            }}
                            style={{
                              maxHeight: "min(400px, 60vh)",
                              opacity: "0",
                              transition: "opacity 0.3s ease-in-out",
                            }}
                          >
                            <source src={image.imageUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img
                            src={image.imageUrl}
                            alt={`${campaign.campaignType} - ${index + 1}`}
                            className="w-full object-contain rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                            onLoad={(e) => {
                              const img = e.target as HTMLImageElement;
                              const aspectRatio =
                                img.naturalWidth / img.naturalHeight;
                              const container = img.parentElement;

                              if (container) {
                                if (aspectRatio > 1.2) {
                                  img.style.maxHeight = "min(320px, 50vh)";
                                } else if (aspectRatio < 0.8) {
                                  img.style.maxHeight = "min(400px, 60vh)";
                                } else {
                                  img.style.maxHeight = "min(360px, 55vh)";
                                }
                                container.style.height = "auto";

                                if (img.naturalWidth < img.offsetWidth) {
                                  img.classList.add("mx-auto");
                                }

                                const spinner =
                                  container.previousElementSibling;
                                if (spinner && spinner.parentElement) {
                                  spinner.remove();
                                }
                              }
                              img.style.opacity = "1";
                            }}
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              const container = img.parentElement;
                              if (container) {
                                container.innerHTML =
                                  '<div class="flex items-center justify-center h-full p-4 text-red-500">Failed to load image</div>';
                              }
                            }}
                            style={{
                              opacity: "0",
                              transition: "opacity 0.3s ease-in-out",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : null}

            <div className="bg-white rounded-lg shadow-lg p-6">
              {campaign.campaignDescription && (
                <div className="prose max-w-none">
                  {campaign.campaignDescription
                    .split("\n")
                    .map((paragraph: string, index: number) => {
                      const renderTextWithLinks = (
                        text: string
                      ): React.ReactNode[] => {
                        const urlRegex = /(https?:\/\/[^\s]+)/g;
                        const parts = text.split(urlRegex);
                        return parts.map((part: string, i: number) => {
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

                      if (paragraph.startsWith("###")) {
                        return (
                          <h2
                            key={index}
                            className="text-xl font-bold text-gray-800 mb-4"
                          >
                            {paragraph.replace("###", "").trim()}
                          </h2>
                        );
                      } else if (paragraph.trim().startsWith("-")) {
                        return (
                          <ul key={index} className="list-disc pl-6 mb-4">
                            <li className="text-gray-600">
                              {renderTextWithLinks(
                                paragraph.replace("-", "").trim()
                              )}
                            </li>
                          </ul>
                        );
                      } else if (paragraph.includes("**")) {
                        return (
                          <p
                            key={index}
                            className="font-bold text-gray-800 mb-4"
                          >
                            {renderTextWithLinks(
                              paragraph.replace(/\*\*/g, "").trim()
                            )}
                          </p>
                        );
                      } else {
                        return (
                          <p key={index} className="text-gray-600 mb-4">
                            {renderTextWithLinks(paragraph.trim())}
                          </p>
                        );
                      }
                    })}
                </div>
              )}

              {campaign.campainInputType === "BLOG" && (
                <div className="flex flex-wrap items-center gap-3 mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg shadow-md">
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 ${
                      isLiked
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600"
                        : "bg-white text-gray-700 hover:bg-red-100 hover:text-red-600 border border-red-200"
                    }`}
                    onClick={handleLike}
                    aria-label={isLiked ? "Unlike" : "Like"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill={isLiked ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span className="font-semibold">
                      {likeCount} {likeCount === 1 ? "Like" : "Likes"}
                    </span>
                  </button>

                  {/* <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 ${
                      isDisliked
                        ? "bg-gradient-to-r from-gray-500 to-gray-700 text-white hover:from-gray-600 hover:to-gray-800"
                        : "bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-800 border border-gray-200"
                    }`} 
                    onClick={handleDislike}
                    aria-label={isDisliked ? "Remove Dislike" : "Dislike"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill={isDisliked ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                      <line x1="2" y1="2" x2="22" y2="22"></line>
                    </svg>
                    <span className="font-semibold">
                      {dislikeCount}{" "}
                      {dislikeCount === 1 ? "Dislike" : "Dislikes"}
                    </span>
                  </button> */}

                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-full shadow-lg hover:bg-blue-100 hover:text-blue-800 border border-blue-200 transition-all duration-300 transform hover:scale-105"
                    onClick={showModal}
                    aria-label="Comment"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    <span className="font-semibold">Comment</span>
                  </button>

                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-white text-green-700 rounded-full shadow-lg hover:bg-green-100 hover:text-green-800 border border-green-200 transition-all duration-300 transform hover:scale-105"
                    onClick={handleShare}
                    aria-label="Share"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                    <span className="font-semibold">Share</span>
                  </button>

                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 ${
                      isSpeaking
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
                        : "bg-white text-orange-700 hover:bg-orange-100 hover:text-orange-800 border border-orange-200"
                    }`}
                    onClick={handleSpeakDescription}
                    aria-label={isSpeaking ? "Stop Speaking" : "Speak Content"}
                  >
                    {isSpeaking ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="11 5,6 9,2 9,2 15,6 15,11 19"></polygon>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                      </svg>
                    )}
                    <span className="font-semibold">
                      {isSpeaking ? "Stop" : "Listen"}
                    </span>
                  </button>
                </div>
              )}
              {campaign.campainInputType === "BLOG" && comments.length > 0 && (
                <div className="mt-6 max-h-[400px] overflow-hidden rounded-lg bg-white shadow-lg">
                  <h3 className="sticky top-0 z-10 bg-gradient-to-r from-blue-50 to-indigo-50 text-lg font-semibold text-blue-900 px-4 py-3 mb-0 border-b border-blue-200">
                    Comments ({comments.length})
                  </h3>

                  <div className="max-h-[360px] overflow-y-auto px-4 pb-4 space-y-2">
                    {comments.map(
                      (comment) =>
                        !["like", "dislike", "subscribe"].includes(
                          comment.mainComment
                        ) && (
                          <div
                            key={comment.mainCommentId}
                            className="p-3 rounded-md border border-gray-200 bg-white hover:bg-indigo-50/50 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <p className="text-base text-gray-900 font-bold mb-2">
                              {comment.mainComment}
                            </p>

                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <button
                                className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition-all duration-150"
                                onClick={() =>
                                  setIsSubCommentModalOpen((prev) => ({
                                    ...prev,
                                    [comment.mainCommentId]: true,
                                  }))
                                }
                              >
                                Reply
                              </button>
                            </div>

                            {/* Sub-comments */}
                            {comment.subComments.length > 0 && (
                              <div className="mt-2 pl-3 border-l-2 border-indigo-300 space-y-1.5">
                                {comment.subComments.map((sub, index) => (
                                  <div
                                    key={index}
                                    className="bg-gray-50 p-2 rounded-sm shadow-sm border border-gray-100 w-[90%] text-sm"
                                  >
                                    <p className="text-gray-700">
                                      <span className="text-purple-600 font-medium">
                                        Reply:
                                      </span>{" "}
                                      {sub.comment}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Reply Modal */}
                            <Modal
                              title={null}
                              open={
                                isSubCommentModalOpen[comment.mainCommentId] ||
                                false
                              }
                              onOk={() =>
                                handleSubComment(comment.mainCommentId)
                              }
                              onCancel={() =>
                                setIsSubCommentModalOpen((prev) => ({
                                  ...prev,
                                  [comment.mainCommentId]: false,
                                }))
                              }
                              okText="Reply"
                              cancelText="Cancel"
                              okButtonProps={{
                                className:
                                  "bg-indigo-600 hover:bg-indigo-700 text-white border-none font-medium rounded-md",
                              }}
                              cancelButtonProps={{
                                className:
                                  "text-gray-600 hover:text-gray-800 border-gray-200 rounded-md",
                              }}
                            >
                              <TextArea
                                rows={2}
                                value={subComment[comment.mainCommentId] || ""}
                                onChange={(e) =>
                                  setSubComment((prev) => ({
                                    ...prev,
                                    [comment.mainCommentId]: e.target.value,
                                  }))
                                }
                                placeholder="Write your reply..."
                                className="resize-none text-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-md"
                              />
                            </Modal>
                          </div>
                        )
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-8">
              <Footer />
            </div>
          </div>
        </div>
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
                <p className="text-red-500 text-sm mt-1">{queryError}</p>
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
              <h2 className="text-2xl font-semibold text-blue-700">Alert!</h2>
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
            <p className="text-gray-700 mb-6">Query submitted successfully!</p>
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
      {isRoleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-3xl mx-4">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  xmlns="http://www.w3.org/2000"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Join ASKOXY.AI
              </h2>
              <p className="text-gray-600 text-sm">
                Choose how you'd like to participate in our{" "}
                {campaign?.campaignType} offer
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <button
                className={`p-3 text-left rounded-lg border transition-all duration-300 hover:scale-105 ${
                  selectedRole.includes("PARTNER")
                    ? "bg-blue-100 border-blue-500"
                    : "bg-gray-50 border-gray-200"
                }`}
                onClick={() => handleRoleToggle("PARTNER")}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mr-2 ${
                      selectedRole.includes("PARTNER")
                        ? "bg-blue-600"
                        : "bg-blue-400"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">
                      Join as Partner
                    </h3>
                    <p className="text-xs text-gray-600">
                      Sell your products and services
                    </p>
                  </div>
                </div>
              </button>
              <button
                className={`p-3 text-left rounded-lg border transition-all duration-300 hover:scale-105 ${
                  selectedRole.includes("USER")
                    ? "bg-green-100 border-green-500"
                    : "bg-gray-50 border-gray-200"
                }`}
                onClick={() => handleRoleToggle("USER")}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mr-2 ${
                      selectedRole.includes("USER")
                        ? "bg-green-600"
                        : "bg-green-400"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">
                      Join as User
                    </h3>
                    <p className="text-xs text-gray-600">
                      Buy my products and services
                    </p>
                  </div>
                </div>
              </button>
              <button
                className={`p-3 text-left rounded-lg border transition-all duration-300 hover-all duration-300 hover:scale-105 ${
                  selectedRole.includes("FREELANCER")
                    ? "bg-purple-100 border-purple-500"
                    : "bg-gray-50 border-gray-200"
                }`}
                onClick={() => handleRoleToggle("FREELANCER")}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mr-2 ${
                      selectedRole.includes("FREELANCER")
                        ? "bg-purple-600"
                        : "bg-purple-400"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5 10-5"></path>
                      <path d="M2 12l10 5 10-5"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">
                      Join as Freelancer
                    </h3>
                    <p className="text-xs text-gray-600">
                      Bring partners and users to earn money
                    </p>
                  </div>
                </div>
              </button>
            </div>
            <div className="flex justify-between">
              <button
                className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                onClick={() => {
                  setIsRoleModalOpen(false);
                  setSelectedRole("");
                  sessionStorage.removeItem("submitclicks");
                }}
              >
                Cancel
              </button>
              <button
                className={`py-2 px-4 rounded-lg text-white ${
                  selectedRole === ""
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={() => handleRoleSelection(selectedRole)}
                disabled={selectedRole === ""}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <span className="text-blue-700 font-semibold">
              💬 Write a Comment
            </span>
            <button
              className={`ml-auto mr-3 px-3 py-1 text-sm rounded-full transition-all duration-300 ${
                isSubscribed
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              onClick={handleSubscribe}
            >
              {isSubscribed ? "✓ Subscribed" : "Subscribe"}
            </button>
          </div>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit Comment"
        cancelText="Cancel"
        okButtonProps={{
          className:
            "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700",
        }}
      >
        <div className="space-y-4">
          <TextArea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Type your comment here..."
            className="resize-none"
          />
          <div className="text-sm text-gray-600">
            Share your thoughts about this content. Your feedback helps us
            improve!
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CampaignDetails;
