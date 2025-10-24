// src/.../campaignDetails.tsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { message, Modal, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Header1 from "./Header";
import {
  fetchCampaigns,
  submitWriteToUsQuery,
  checkUserInterest,
  submitInterest,
} from "./servicesapi";

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
  campainInputType: "PRODUCT" | "SERVICE" | "BLOG" | string;
  addServiceType?: string | null;
}

const CampaignDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const campaignId = pathParts[pathParts.indexOf("services") + 1];

  const userId = localStorage.getItem("userId");
  const [isLoading, setIsLoading] = useState(true);
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  const [issuccessOpen, setSuccessOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const profileData = JSON.parse(localStorage.getItem("profileData") || "{}");
  const email = profileData.customerEmail || null;
  const accessToken = localStorage.getItem("accessToken");

  const [isprofileOpen, setIsprofileOpen] = useState(false);
  const [commentsError, setCommentsError] = useState<string | undefined>(
    undefined
  );
  const [comments, setComments] = useState("");

  const whatsappNumber = localStorage.getItem("whatsappNumber");
  const mobileNumber = localStorage.getItem("mobileNumber");
  const finalMobileNumber = whatsappNumber || mobileNumber || null;

  const [interested, setInterested] = useState(false);
  const submitclicks = sessionStorage.getItem("submitclicks");

  // Role modal state
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [userRole, setUserRole] = useState<string | undefined>(undefined);

  // Media carousel state — one-slide-per-view
  const mediaScrollRef = useRef<HTMLDivElement | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const loadCampaign = async () => {
      setIsLoading(true);
      try {
        const allCampaigns = await fetchCampaigns();
        const foundCampaign = allCampaigns.find(
          (c: Campaign) => c.campaignId.slice(-4) === campaignId
        );
        if (
          foundCampaign &&
          (foundCampaign.campainInputType === "PRODUCT" ||
            foundCampaign.campainInputType === "SERVICE" ||
            foundCampaign.campainInputType === "BLOG")
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
    if (campaign) handleLoadOffersAndCheckInterest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign]);

  // keep the dot index in sync when the container resizes
  useEffect(() => {
    const onResize = () => {
      if (!mediaScrollRef.current) return;
      scrollToIndex(currentIdx, false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [currentIdx]);

  const slugify = (text: string) =>
    (text || "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50);

  // --- Media helpers ---
  const isVideoUrl = (url: string): boolean => {
    const videoExtensions = [
      ".mp4",
      ".webm",
      ".ogm",
      ".avi",
      ".mov",
      ".wmv",
      ".flv",
      ".m4v",
    ];
    const u = (url || "").toLowerCase();
    return (
      videoExtensions.some((ext) => u.includes(ext)) || u.includes("video")
    );
  };

  // Scroll precisely one full container width per index
  const scrollToIndex = (idx: number, smooth = true) => {
    if (!mediaScrollRef.current) return;
    const container = mediaScrollRef.current;
    const left = idx * container.clientWidth;
    container.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
  };

  const handleCarouselLeft = () => {
    const total = campaign?.imageUrls?.length || 0;
    if (!total) return;
    const next = (currentIdx - 1 + total) % total;
    setCurrentIdx(next);
    scrollToIndex(next);
  };

  const handleCarouselRight = () => {
    const total = campaign?.imageUrls?.length || 0;
    if (!total) return;
    const next = (currentIdx + 1) % total;
    setCurrentIdx(next);
    scrollToIndex(next);
  };

  // compute index from full viewport-width pages
  const onMediaScroll = () => {
    const el = mediaScrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setCurrentIdx(
      Math.max(0, Math.min(idx, (campaign?.imageUrls?.length || 1) - 1))
    );
  };

  // --- CTAs / Modals ---
  const handleWriteToUs = (c: Campaign) => {
    if (!accessToken || !userId) {
      message.warning("Please login to write to us.");
      navigate("/whatsappregister");
      sessionStorage.setItem(
        "redirectPath",
        `/main/services/${c.campaignId.slice(-4)}/${slugify(c.campaignType)}`
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
    if (!comments || comments.trim() === "") {
      setCommentsError("Please enter your comments before submitting.");
      return;
    }
    const success = await submitWriteToUsQuery(
      email,
      finalMobileNumber,
      comments,
      "FREEAI",
      userId
    );
    if (success) {
      setSuccessOpen(true);
      setIsOpen(false);
      setComments("");
    } else {
      message.error("Failed to send comments. Please try again.");
    }
  };

  const handleLoadOffersAndCheckInterest = async () => {
    if (!userId || !campaign?.campaignType) return;
    const result = await checkUserInterest(userId, campaign.campaignType);
    setInterested(!!result?.exists);
    setUserRole(result?.userRole);
    if (submitclicks) setIsRoleModalOpen(true);
  };

  const handleSubmitClick = () => {
    sessionStorage.setItem("submitclicks", "true");
    if (campaign?.campaignType)
      sessionStorage.setItem("campaigntype", campaign.campaignType);

    if (!userId) {
      message.warning("Please login to submit your interest.");
      navigate("/whatsappregister");
      const redirect =
        campaign?.campainInputType === "BLOG"
          ? `/main/blog/${campaign?.campaignId.slice(-4)}/${slugify(
              campaign?.campaignType || ""
            )}`
          : `/main/services/${campaign?.campaignId.slice(-4)}/${slugify(
              campaign?.campaignType || ""
            )}`;
      sessionStorage.setItem("redirectPath", redirect);
      return;
    }

    if (interested) {
      message.warning("You have already participated. Thank you!", 7);
      setTimeout(() => sessionStorage.removeItem("submitclicks"), 7000);
      return;
    }

    setIsRoleModalOpen(true);
  };

  const submitInterestHandler = async (userRoleParam: string) => {
    const campaignType =
      sessionStorage.getItem("campaigntype") || campaign?.campaignType || "";
    const success = await submitInterest(
      campaignType,
      finalMobileNumber,
      userId,
      userRoleParam
    );

    if (success) {
      message.success(
        `Thank you for joining as ${userRoleParam || "no role"} in our ${
          campaign?.campaignType
        } campaign!`
      );
      setInterested(true);
      setIsButtonDisabled(true);
    } else {
      message.error("Failed to submit your interest. Please try again.");
    }
    sessionStorage.removeItem("submitclicks");
    sessionStorage.removeItem("campaigntype");
    setSelectedRole("");
  };

  const handleEmployeeInterest = async () => {
    if (!userId) {
      message.warning("Please login to submit your interest.");
      navigate("/whatsappregister");
      sessionStorage.setItem(
        "redirectPath",
        `/main/services/${campaign?.campaignId.slice(-4)}/${slugify(
          campaign?.campaignType || ""
        )}`
      );
      return;
    }
    if (interested) {
      message.info("You have already participated. Thank you!");
      return;
    }
    if (campaign?.campaignType)
      sessionStorage.setItem("campaigntype", campaign.campaignType);

    Modal.confirm({
      title: "Confirm Participation",
      content: "Are you sure you want to join as Employee for this campaign?",
      okText: "Yes, I'm sure",
      cancelText: "Cancel",
      onOk: async () => {
        await submitInterestHandler("EMPLOYEE");
        setIsRoleModalOpen(false);
      },
    });
  };

  const handleRoleSelection = (roles: string) => {
    Modal.confirm({
      title: "Confirm Participation",
      content: `Are you sure you want to join as ${roles || "no role"}?`,
      okText: "Yes, I'm sure",
      cancelText: "Cancel",
      onOk: async () => {
        await submitInterestHandler(roles);
        setIsRoleModalOpen(false);
      },
    });
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

  // Render
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header (for logged-out) */}
      <div className="px-4 pt-4">{!userId ? <Header1 /> : null}</div>

      {/* Main Content */}
      <main className="flex-1 w-full px-4 pb-6">
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
        ) : !campaign || !campaign.campaignStatus ? (
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
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Title + actions */}
            <div className="flex flex-col mb-6 w-full">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-4">
                {campaign.campaignType}
              </h1>

              <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center justify-end">
                {campaign.campainInputType === "PRODUCT" && (
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                    onClick={handleBuyNow}
                    aria-label="Buy Now"
                    disabled={isButtonDisabled || interested}
                  >
                    Buy Now
                  </button>
                )}

                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  onClick={handleSubmitClick}
                  aria-label="I'm Interested"
                  disabled={isButtonDisabled || interested}
                >
                  {!interested ? "I'm Interested" : "Already Participated"}
                </button>

                <button
                  className="px-4 py-2 bg-[#f9b91a] text-white rounded-lg shadow-lg hover:bg-[#f4a307] transition-all w-full sm:w-auto"
                  aria-label="Write To Us"
                  onClick={() => handleWriteToUs(campaign)}
                >
                  Write To Us
                </button>
              </div>
            </div>

            {/* Two-column: Media (left) + Description (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* LEFT: Media — One-per-view Carousel (Top dots, tight mobile gap, perfectly centered) */}
              <section className="lg:col-span-5 h-full">
                <div className="relative h-full flex flex-col items-center">
                  {/* Dots at top — reduced gap on mobile */}
                  {campaign.imageUrls?.length > 1 && (
                    <div className="flex items-center justify-center mb-2 mt-1 w-full">
                      <div className="flex items-center justify-center gap-[5px] sm:gap-2">
                        {campaign.imageUrls.map((_, i) => (
                          <button
                            key={i}
                            aria-label={`Go to slide ${i + 1}`}
                            onClick={() => {
                              setCurrentIdx(i);
                              scrollToIndex(i);
                            }}
                            className="appearance-none border-none bg-transparent p-0"
                            style={{
                              WebkitTapHighlightColor: "transparent",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <span
                              className={`block rounded-full transition-all duration-200 ease-in-out`}
                              style={{
                                width: currentIdx === i ? 9 : 7,
                                height: currentIdx === i ? 9 : 7,
                                backgroundColor:
                                  currentIdx === i ? "#6b21a8" : "#d1d5db",
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scrollable image area */}
                  <div
                    ref={mediaScrollRef}
                    onScroll={onMediaScroll}
                    className="
        flex flex-nowrap overflow-x-auto snap-x snap-mandatory scroll-smooth
        w-full h-full items-start
        [scrollbar-width:none] [-ms-overflow-style:none]
      "
                    style={{ WebkitOverflowScrolling: "touch" }}
                  >
                    <style>{`div::-webkit-scrollbar { display: none; }`}</style>

                    {campaign.imageUrls.map((image, idx) => (
                      <div
                        key={image.imageId}
                        className="
            snap-center shrink-0 basis-full w-full
            h-full min-h-[260px] sm:min-h-[400px] lg:min-h-[520px]
            flex items-start justify-center
            rounded-xl overflow-hidden
          "
                      >
                        {isVideoUrl(image.imageUrl) ? (
                          <video
                            controls
                            className="max-w-full max-h-full w-auto h-auto self-start"
                            preload="metadata"
                          >
                            <source src={image.imageUrl} type="video/mp4" />
                          </video>
                        ) : (
                          <img
                            src={image.imageUrl}
                            alt={`${campaign.campaignType} - ${idx + 1}`}
                            className="w-full h-auto object-contain sm:object-cover rounded-lg"
                            style={{
                              maxHeight: "full", // keep full viewport usage on mobile
                              display: "block",
                              margin: "0 auto",
                            }}
                            loading="lazy"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* RIGHT: Description & CA link */}
              <section className="lg:col-span-7">
                <div className="bg-white rounded-xl shadow p-5 sm:p-6 h-full lg:max-h-[100vh] lg:overflow-y-auto lg:pr-2">
                  <div className="flex justify-end">
                    {campaign.campaignType === "CA SERVICES" && interested && (
                      <div className="w-full mt-2 mb-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                          <div className="text-center sm:text-left">
                            <h4 className="text-base md:text-lg font-bold text-purple-800 tracking-tight">
                              Explore Our Professional CA Services!
                            </h4>
                            <p className="text-xs sm:text-sm text-purple-600 mt-0.5">
                              Discover comprehensive accounting solutions for
                              your business needs 🚀
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              if (userId) {
                                if (userRole?.includes("PARTNER"))
                                  navigate("/main/ServiceDashboard");
                                else navigate("/main/caserviceitems");
                              } else {
                                navigate("/whatsapplogin");
                                sessionStorage.setItem(
                                  "redirectPath",
                                  "/main/caserviceitems"
                                );
                              }
                            }}
                            aria-label="Explore All CA Services"
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 whitespace-nowrap"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                            {userRole?.includes("PARTNER")
                              ? "Go to partner dashboard"
                              : "Explore All Services"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description formatter */}
                  <Article description={campaign.campaignDescription} />
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      {/* Full-width Footer pinned to bottom */}
      <footer className="mt-auto w-full border-t">
        <Footer />
      </footer>

      {/* Write To Us Modal (Comments only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative bg-white rounded-xl shadow-md p-6 w-[92%] max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-xl leading-none text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              ×
            </button>

            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-blue-800">
              Write To Us
            </h2>

            <LabeledField label="Mobile Number">
              <input
                type="text"
                disabled
                value={finalMobileNumber || ""}
                className="block w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                placeholder="Your mobile number"
              />
            </LabeledField>

            <LabeledField label="Email">
              <input
                type="email"
                value={email || ""}
                disabled
                className="block w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                placeholder="Your email"
              />
            </LabeledField>

            <LabeledField label="Comments">
              <textarea
                rows={4}
                className="block w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                placeholder="Type your comments here…"
                value={comments}
                onChange={(e) => {
                  setComments(e.target.value);
                  if (commentsError) setCommentsError(undefined);
                }}
              />
              {commentsError && (
                <p className="text-red-500 text-sm mt-1">{commentsError}</p>
              )}
            </LabeledField>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all"
                onClick={handleWriteToUsSubmitButton}
              >
                Submit Comments
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile reminder modal */}
      {isprofileOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
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

      {/* Role selection modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-3xl mx-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {campaign?.addServiceType === "WEAREHIRING"
                  ? "Join as Employee"
                  : "Join ASKOXY.AI"}
              </h2>
              <p className="text-gray-600 text-sm">
                {campaign?.addServiceType === "WEAREHIRING"
                  ? "Become part of our AI-first team."
                  : `Choose how you'd like to participate in our ${campaign?.campaignType} offer`}
              </p>
            </div>

            {campaign?.addServiceType === "WEAREHIRING" ? (
              <HiringEmployeeCard
                onConfirm={handleEmployeeInterest}
                disabled={isButtonDisabled || interested}
              />
            ) : (
              <ThreeJoinCards
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
                onCancel={() => {
                  setIsRoleModalOpen(false);
                  setSelectedRole("");
                  sessionStorage.removeItem("submitclicks");
                }}
                onSubmit={() => handleRoleSelection(selectedRole)}
                disabled={selectedRole === "" || isButtonDisabled || interested}
                interested={interested}
              />
            )}
          </div>
        </div>
      )}

      {/* Success modal */}
      {issuccessOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
            <h2 className="text-xl font-semibold text-green-600 mb-4">
              Success!
            </h2>
            <p className="text-gray-700 mb-6">
              Comments submitted successfully!
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
  );
};

/* ---------- Small helpers ---------- */
const LabeledField: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="mb-4">
    <label className="block text-sm text-gray-700 font-semibold mb-1">
      {label}
    </label>
    {children}
  </div>
);

/** Formats headings, bullets, links and paragraphs */
const Article: React.FC<{ description: string }> = ({ description }) => {
  if (!description) return null;
  const lines = description.split("\n").filter((l) => l.trim());

  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return (
    <div>
      {lines.map((line, index) => {
        const t = line.trim();
        if (!t || t === "---") return null;

        const isHeading =
          t.startsWith("###") ||
          t.startsWith("####") ||
          (t.startsWith("**") && t.endsWith("**") && t.length > 4);

        if (isHeading) {
          const clean = t
            .replace(/^#+\s*/, "")
            .replace(/^\*\*|\*\*$/g, "")
            .replace(/\*/g, "")
            .trim();
          return (
            <h3
              key={`h-${index}`}
              className="text-base sm:text-lg font-bold text-gray-800 mt-4 mb-2"
            >
              {clean}
            </h3>
          );
        }

        if (
          t.startsWith("*") ||
          t.startsWith("✅") ||
          t.startsWith("•") ||
          t.startsWith("-")
        ) {
          const bullet = t.replace(/^\*+/, "").replace(/\*/g, "");
          return (
            <div key={`b-${index}`} className="mb-2">
              <span className="text-gray-600 text-sm sm:text-base">
                {bullet}
              </span>
            </div>
          );
        }

        const parts = t.replace(/\*/g, "").split(urlRegex);
        return (
          <p
            key={`p-${index}`}
            className="text-gray-600 mb-2 text-sm sm:text-base leading-relaxed"
          >
            {parts.map((part, i) =>
              urlRegex.test(part) ? (
                <a
                  key={i}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-words"
                >
                  {part}
                </a>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </p>
        );
      })}
    </div>
  );
};

/* Cards extracted for clarity */
const HiringEmployeeCard: React.FC<{
  onConfirm: () => void;
  disabled?: boolean;
}> = ({ onConfirm, disabled }) => (
  <div className="w-full max-w-3xl mx-auto">
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold">
          AI
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
          Join as Employee
        </h3>
      </div>
      <p className="text-gray-700 text-sm sm:text-base mb-4">
        Join our AI team and build the future! Explore exciting roles across
        tech, marketing, operations, and innovation.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 disabled:opacity-50"
          onClick={onConfirm}
          disabled={disabled}
          aria-label="I'm Interested (Employee)"
        >
          I'm Interested
        </button>
      </div>
    </div>
  </div>
);

const ThreeJoinCards: React.FC<{
  selectedRole: string;
  setSelectedRole: (s: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  disabled?: boolean;
  interested?: boolean;
}> = ({
  selectedRole,
  setSelectedRole,
  onSubmit,
  onCancel,
  disabled,
  interested,
}) => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
      <button
        className={`p-4 text-left rounded-xl border transition-all hover:shadow ${
          selectedRole.includes("PARTNER")
            ? "bg-blue-50 border-blue-400"
            : "bg-white border-gray-200"
        }`}
        onClick={() => setSelectedRole("PARTNER")}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center">
            P
          </div>
          <div>
            <div className="font-semibold text-gray-900">Join as Partner</div>
            <div className="text-xs text-gray-600">
              Sell your products & services
            </div>
          </div>
        </div>
      </button>

      <button
        className={`p-4 text-left rounded-xl border transition-all hover:shadow ${
          selectedRole.includes("USER")
            ? "bg-green-50 border-green-400"
            : "bg-white border-gray-200"
        }`}
        onClick={() => setSelectedRole("USER")}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-600 text-white flex items-center justify-center">
            U
          </div>
          <div>
            <div className="font-semibold text-gray-900">Join as User</div>
            <div className="text-xs text-gray-600">
              Buy our products & services
            </div>
          </div>
        </div>
      </button>

      <button
        className={`p-4 text-left rounded-xl border transition-all hover:shadow ${
          selectedRole.includes("FREELANCER")
            ? "bg-purple-50 border-purple-400"
            : "bg-white border-gray-200"
        }`}
        onClick={() => setSelectedRole("FREELANCER")}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center">
            F
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              Join as Freelancer
            </div>
            <div className="text-xs text-gray-600">
              Bring partners/users & earn
            </div>
          </div>
        </div>
      </button>
    </div>

    <div className="flex justify-end gap-2">
      <button
        className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        className={`py-2 px-4 rounded-lg text-white ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        onClick={onSubmit}
        disabled={disabled}
      >
        {interested ? "Already Participated" : "Submit Interest"}
      </button>
    </div>
  </>
);

export default CampaignDetails;
