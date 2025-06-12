import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { Button, Input, message, Modal } from "antd";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Header1 from "./Header";
import {
  fetchCampaigns,
  submitWriteToUsQuery,
  checkUserInterest,
  submitInterest,
} from "./servicesapi";

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

const CampaignDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const campaignId = pathParts[pathParts.indexOf("services") + 1];
  const userId = localStorage.getItem("userId");
  const [isLoading, setIsLoading] = useState(true);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
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
  const finalMobileNumber = whatsappNumber || mobileNumber || null;
  const [interested, setInterested] = useState<boolean>(false);
  const submitclicks = sessionStorage.getItem("submitclicks");
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    const loadCampaign = async () => {
      setIsLoading(true);
      try {
        const allCampaigns = await fetchCampaigns();
        const foundCampaign = allCampaigns.find(
          (c) => c.campaignId.slice(-4) === campaignId
        );
        if (
          foundCampaign &&
          (foundCampaign.campainInputType === "PRODUCT" ||
            foundCampaign.campainInputType === "SERVICE")
        ) {
          setCampaign(foundCampaign);
        } else {
          setCampaign(null);
        }
      } catch (error) {
        console.error("Error loading campaign:", error);
        setCampaign(null);
      }
      setIsLoading(false);
    };

    loadCampaign();
  }, [campaignId]);

  useEffect(() => {
    if (campaign) {
      handleLoadOffersAndCheckInterest();
    }
  }, [campaign]);

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
    } else {
      message.error("Failed to send query. Please try again.");
    }
  };

  const handleLoadOffersAndCheckInterest = async () => {
    if (!userId || !campaign?.campaignType) return;

    const hasInterest = await checkUserInterest(userId, campaign.campaignType);
    setInterested(hasInterest);
    if (submitclicks) {
      handleSubmit(hasInterest);
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
      if (
        campaign?.campaignType === "PRODUCT" ||
        campaign?.campaignType === "PRODUCT"
      ) {
        sessionStorage.setItem(
          "redirectPath",
          `/main/services/${campaign?.campaignId.slice(-4)}/${
            campaign?.campaignType
          }`
        );
      } else {
        sessionStorage.setItem(
          "redirectPath",
          `/main/blog/${campaign?.campaignId.slice(-4)}/${
            campaign?.campaignType
          }`
        );
      }
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
      onOk: () => submitInterestHandler(roles),
      onCancel: () => {
        sessionStorage.removeItem("submitclicks");
        setSelectedRole("");
      },
    });
  };

  const submitInterestHandler = async (userRole: string) => {
    const campaignType = sessionStorage.getItem("campaigntype") || "";
    const success = await submitInterest(
      campaignType,
      finalMobileNumber,
      userId,
      userRole
    );

    if (success) {
      message.success(
        `Thank you for joining as ${userRole || "no role"} in our ${
          campaign?.campaignType
        } offer campaign!`
      );
      setInterested(true);
      setIsButtonDisabled(true);
      sessionStorage.removeItem("campaigntype");
    } else {
      message.error("Failed to submit your interest. Please try again.");
    }
    sessionStorage.removeItem("submitclicks");
    setSelectedRole("");
  };

  const handlePopUOk = () => {
    setIsOpen(false);
    navigate("/main/profile");
  };

  const handleBuyNow = () => {
    if (!userId) {
      message.warning("Please login to buy now.");
      navigate("/whatsappregister");
      sessionStorage.setItem("redirectPath", "/main/dashboard/products");
    } else {
      navigate("/main/dashboard/products");
    }
  };

    const formatCampaignDescription = (description: String) => {
    if (!description) return null;

    const lines = description.split("\n").filter((line) => line.trim());

    return lines
      .map((line, index) => {
        const trimmedLine = line.trim();

        // Skip empty lines and separators
        if (trimmedLine === "" || trimmedLine === "---") {
          return null;
        }

        // More precise heading detection
        const isHeading =
          // Markdown headings (### or ##)
          trimmedLine.startsWith("###") ||
          trimmedLine.startsWith("##") ||
          // Bold headings that start with ** and end with **
          (trimmedLine.startsWith("**") &&
            trimmedLine.endsWith("**") &&
            trimmedLine.length > 4) ||
          // Headings with emoji and bold (like ### 🛒 **What We Offer**)
          (trimmedLine.includes("###") && trimmedLine.includes("**")) ||
          // Headings that start with #### (subheadings)
          trimmedLine.startsWith("####");

        if (isHeading) {
          // Clean heading text more thoroughly
          let cleanText = trimmedLine
            .replace(/^#+\s*/, "") // Remove # symbols
            .replace(/^\*\*|\*\*$/g, "") // Remove ** from start/end
            .replace(/\*\*/g, "") // Remove any remaining **
            .trim();

          return (
            <h3
              key={`heading-${index}`}
              className="text-lg font-bold text-gray-800 mt-4 mb-2"
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
          // Format bullet points
          return (
            <div key={`bullet-${index}`} className="mb-2">
              <span className="text-gray-600">{trimmedLine}</span>
            </div>
          );
        } else {
          // Regular content - render links properly
          const renderTextWithLinks = (text: String) => {
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
            <p key={`para-${index}`} className="text-gray-600 mb-2">
              {renderTextWithLinks(trimmedLine)}
            </p>
          );
        }
      })
      .filter(Boolean); // Remove null entries
  };

  const isVideoUrl = (url: string): boolean => {
    const videoExtensions: string[] = [
      ".mp4",
      ".webm",
      ".ogm",
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
            Campaign Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            The product or service is currently inactive or unavailable.
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
    <div className="w-full lg:max-w-7xl px-4 py-6 h-screen overflow-y-auto">
      <div className="mb-4 p-2">{!userId ? <Header1 /> : null}</div>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
              size="large"
            />
            <p className="mt-4 text-gray-600">Loading campaign details...</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {!campaign || !campaign.campaignStatus ? (
            renderNotFoundPage()
          ) : (
            <div className="p-4">
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
                  <button
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleSubmit(interested)}
                    aria-label="I'm Interested"
                    disabled={isButtonDisabled || interested}
                  >
                    {!interested ? "I'm Interested" : "Already Participated"}
                  </button>
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
                                  const spinner =
                                    container.previousElementSibling;
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

                                const spinner =
                                  container?.previousElementSibling;
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
                                      '<div className="flex items-center justify-center h-full p-4 text-red-500">Failed to load image</div>';
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
                  {formatCampaignDescription(campaign.campaignDescription)}
                </div>
                <div className="mt-8">
                  <Footer />
                </div>
              </div>
            </div>
          )}
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
                className={`p-3 text-left rounded-lg border transition-all duration-300 hover:scale-105 ${
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
                      <path d="M2 17l10 5-7"></path>
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
    </div>
  );
};

export default CampaignDetails;
