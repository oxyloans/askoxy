import React, { useEffect, useMemo, useState } from "react";
import "../StudyAbroad.css";
import "../DiwaliPage.css";
import { message, Modal } from "antd";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";
import {

  Sparkles,
  Copy,
  
  CheckCircle2,
  MessageCircle,
  Mail,
  ShieldCheck,
  Users,
  Rocket,
  ChevronRight,
  Star,
  Clock,
  Send,
  Info,
  User,
  
  Zap,
  Globe,
  Award,
  TrendingUp,
  HeartHandshake,
  Lightbulb,
  Users2,
  Briefcase,
  ExternalLink,
  HelpCircle,
} from "lucide-react";
import {
  checkUserInterest,
  submitInterest,
  submitWriteToUsQuery,
} from "../servicesapi";

const MyRotaryServices: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [issuccessOpen, setSuccessOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | undefined>(undefined);
  const [isprofileOpen, setIsprofileOpen] = useState<boolean>(false);
  const [interested, setInterested] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
const GRAND_LAUNCH_TOP_IMAGE = "https://i.ibb.co/G4pYnSWX/rotary-img0.jpg";

  const WHATSAPP_GROUP_GRAND_LAUNCH =
    "https://chat.whatsapp.com/FRIPgqC1cYaGwQ5VbSXBPL?mode=gi_t";


  const WHATSAPP_GROUP_PLATFORM =
    "https://chat.whatsapp.com/DiwjVdXb7p60ywRlgrSFDp?mode=gi_t";

  const EXPLORE_AI_AGENT_LINK = "/rotarydistrict3150AiAgent";
    

  const ROTARY_ROLE = "ROTARIAN_MEMBER";
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const whatsappNumber = localStorage.getItem("whatsappNumber");
  const mobileNumber = localStorage.getItem("mobileNumber");
  const profileData = JSON.parse(localStorage.getItem("profileData") || "{}");
  const email = profileData.customerEmail || null;
  const finalMobileNumber = whatsappNumber || mobileNumber || null;
  const submitclicks = sessionStorage.getItem("submitclicks");

  // Updated high-quality images with better optimization
  const GREETINGS_IMAGE = "https://i.ibb.co/wFzHbgh3/RTN-RADHA1.png";
 


  // Rotary Identity (display)
  const ROTARY_DISTRICT = "RI DISTRICT 3150";
  const ROTARY_HOME_CLUB = "Secunderanbad West";

  const [formData] = useState({
    askOxyOfers: "ROTARIAN",
    userId: userId,
    mobileNumber: finalMobileNumber,
    projectType: "ASKOXY",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    checkMobileView();
    window.addEventListener("resize", checkMobileView);
    return () => window.removeEventListener("resize", checkMobileView);
  }, []);

  useEffect(() => {
    handleLoadOffersAndCheckInterest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkMobileView = () => {
    setIsMobile(window.innerWidth < 768);
  };

  const handleLoadOffersAndCheckInterest = async () => {
    if (!userId) return;
    try {
      const hasInterest = await checkUserInterest(userId, "ROTARIAN");
      setInterested(hasInterest.exists);
      if (submitclicks) {
        if (hasInterest.exists) navigate("/main/dashboard/home");
      }
    } catch (error) {
      console.error("Error while checking interest:", error);
      setInterested(false);
    }
  };

  const openWhatsAppGroupPlatform = () => {
    window.open(WHATSAPP_GROUP_PLATFORM, "_blank", "noopener,noreferrer");
  };

  const openWhatsAppGroupGrandLaunch = () => {
    window.open(WHATSAPP_GROUP_GRAND_LAUNCH, "_blank", "noopener,noreferrer");
  };

  const openWhatsAppGroupAndConfirm = () => {
    openWhatsAppGroupGrandLaunch(); // ✅ Grand Launch group

    const confirmLink =
      "https://wa.me/?text=" + encodeURIComponent("I am attending.");

    Modal.info({
      title: (
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-emerald-600" />
          <span>Confirm Your Attendance</span>
        </div>
      ),
      okText: "Send Message",
      okButtonProps: { className: "bg-emerald-600 hover:bg-emerald-700" },
      content: (
        <div className="py-3">
          <p className="text-gray-700">
            After joining the WhatsApp group, please confirm by sending this
            message:
          </p>

          <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
            I am attending.
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Clicking <b>Send Message</b> will open WhatsApp with the message
            pre-filled. Copy/paste it into the group and send.
          </p>
        </div>
      ),
      onOk: () => window.open(confirmLink, "_blank", "noopener,noreferrer"),
    });
  };

  const handlePlatformClick = (isAlreadyJoined: boolean) => {
    if (!userId) {
      navigate("/whatsappregister");
      sessionStorage.setItem("redirectPath", "/main/services/myrotary");
      message.warning("Please login to open/join the Rotary platform.");
      return;
    }

    if (isAlreadyJoined) {
      navigate("/main/services/myrotary");
      return;
    }

    Modal.confirm({
      title: (
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-blue-600" />
          <span>Join Rotary AI Platform</span>
        </div>
      ),
      okText: "Yes, Join Platform",
      cancelText: "Cancel",
      okButtonProps: { className: "bg-blue-600 hover:bg-blue-700" },
      content: (
        <div className="py-4">
          <p className="text-gray-700 mb-4">
            Are you ready to join this exclusive Rotary AI initiative platform?
          </p>
          {/* <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  AI Commerce Benefit
                </p>
                <p className="text-sm text-gray-600">
                  We will help list your products/services or facilitate bulk
                  purchases within our trusted network.
                </p>
              </div>
            </div>
          </div> */}
        </div>
      ),
      onOk: () => submitInterestHandler(ROTARY_ROLE),
    });
  };

  const copyAttendingText = async () => {
    try {
      await navigator.clipboard.writeText("I am attending.");
      message.success("Copied: I am attending.");
    } catch (e) {
      message.error("Copy failed. Please copy manually.");
    }
  };

  const openExploreAIAgent = () => {
    window.location.href = EXPLORE_AI_AGENT_LINK;
  };

  const submitInterestHandler = async (role: string) => {
    if (isButtonDisabled) return;

    try {
      setIsButtonDisabled(true);

      const success = await submitInterest(
        formData.askOxyOfers,
        formData.mobileNumber,
        formData.userId,
        role,
      );

      if (success) {
        message.success(
          "Welcome! You have successfully joined the Rotary AI Platform.",
        );
        setInterested(true);
        localStorage.setItem("askOxyOfers", formData.askOxyOfers);

        setTimeout(() => {
          navigate("/main/dashboard/home");
        }, 400);
      } else {
        message.error("Failed to submit your interest. Please try again.");
        setInterested(false);
      }
    } catch (error) {
      console.error("Submit Interest Error:", error);
      message.error("Failed to submit your interest. Please try again.");
      setInterested(false);
    } finally {
      setIsButtonDisabled(false);
      sessionStorage.removeItem("submitclicks");
    }
  };

  const handlePopUOk = () => {
    setIsprofileOpen(false);
    navigate("/main/profile");
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
      setQueryError("Please enter your query before submitting.");
      return;
    }

    try {
      setIsLoading(true);
      const success = await submitWriteToUsQuery(
        email,
        finalMobileNumber,
        query,
        "ROTARIAN",
        userId,
      );

      if (success) {
        setSuccessOpen(true);
        setIsOpen(false);
        setQuery("");
        setQueryError(undefined);
      } else {
        message.error("Failed to submit your query. Please try again.");
      }
    } catch (error) {
      console.error("Error sending query:", error);
      message.error("Failed to submit your query. Please try again.");
      setQueryError("Failed to submit your query. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const Pill = useMemo(
    () =>
      function PillInner({
        icon,
        text,
        variant = "default",
      }: {
        icon: React.ReactNode;
        text: string;
        variant?: "default" | "premium" | "success";
      }) {
        const variants = {
          default: "bg-white/90 border-gray-200 text-gray-800 hover:bg-gray-50",
          premium:
            "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-800 hover:from-blue-100 hover:to-purple-100",
          success:
            "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 text-emerald-800 hover:from-emerald-100 hover:to-green-100",
        };

        return (
          <span
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 ${variants[variant]}`}
          >
            {icon}
            {text}
          </span>
        );
      },
    [],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-x-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-r from-blue-100/30 to-emerald-100/30 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-gradient-to-r from-purple-100/20 to-pink-100/20 blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-amber-100/10 to-orange-100/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Professional Header - Only show if user is not logged in */}
        {!userId && (
          <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16 sm:h-20">
                {/* Left: Logo */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center shadow-lg">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 leading-tight">
                      Rotary AI Hub
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                      District 3150
                    </p>
                  </div>
                </div>

                {/* Right: Sign In Button */}
                <button
                  onClick={() => {
                    navigate("/whatsappregister");
                    sessionStorage.setItem(
                      "redirectPath",
                      "/main/services/myrotary",
                    );
                  }}
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold hover:shadow-lg transition-all active:scale-95 text-sm sm:text-base"
                  type="button"
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Sign In</span>
                </button>
              </div>
            </div>
          </header>
        )}

        {/* Enhanced Hero Banner Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6"
        >
          {/* Grand Launch Banner - Hero Style */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200 bg-gradient-to-br from-white via-blue-50/30 to-emerald-50/30 shadow-2xl">
            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-purple-600" />
              <div className="absolute -top-20 -right-20 h-40 w-40 sm:h-64 sm:w-64 rounded-full bg-blue-200/20 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-40 w-40 sm:h-64 sm:w-64 rounded-full bg-emerald-200/20 blur-3xl" />
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {/* Left: Event Details */}
              <div className="p-5 sm:p-7 lg:p-10 flex flex-col justify-center">
                <h3 className="text-1xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-5">
                  <span className="bg-gradient-to-r from-blue-700 to-emerald-600 bg-clip-text text-transparent">
                    Grand Launch of Rotary AI Hub
                  </span>
                </h3>

                <div className="space-y-4 mb-5">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-blue-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">
                        Date & Time
                      </p>
                      <p className="text-base sm:text-lg font-bold text-gray-900">
                        03 March 2026, 6:00 PM IST
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center flex-shrink-0">
                      <Globe className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-emerald-700" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-600 mb-1">
                        Location
                      </p>
                      <a
                        href="https://maps.app.goo.gl/YFfUQNZZf32LdTVG7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-bold text-emerald-600 hover:text-emerald-700 underline decoration-2 underline-offset-2 transition-colors inline-flex items-center gap-1 flex-wrap"
                      >
                        <span>View on Google Maps</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <p className="text-sm font-bold text-gray-900 mt-2">
                        Pillar No. 635, 1st Floor, Entrance D, SE02 Concourse
                      </p>
                      <p className="text-xs sm:text-sm text-gray-700 mt-1">
                        Miyapur Metro Station, Hyderabad, Telangana
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex flex-col gap-2">
                    <p className="text-xs sm:text-sm font-semibold text-gray-700">
                      After joining, please confirm by sending a message in the
                      group:
                    </p>
                    <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-emerald-300 px-3 py-2 font-semibold text-emerald-800 w-fit">
                      <span className="text-xs sm:text-sm">
                        I am attending.
                      </span>
                      <button
                        type="button"
                        onClick={copyAttendingText}
                        className="inline-flex items-center justify-center rounded-md p-1 hover:bg-emerald-100 active:scale-95 transition"
                        aria-label="Copy"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-5">
                  <button
                    onClick={openWhatsAppGroupGrandLaunch}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-green-700 transition-all active:scale-95 whitespace-nowrap"
                    type="button"
                  >
                    <Users className="h-7 w-7" />
                    <span className="hidden sm:inline">Join Group</span>
                    <span className="sm:hidden">Join</span>
                   
                  </button>

                  <button
                    onClick={openExploreAIAgent}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-violet-700 transition-all active:scale-95 whitespace-nowrap"
                    type="button"
                  >
                    <Rocket className="h-7 w-7" />
                    <span className="hidden sm:inline">Explore Rotary District 3150 AI Agent</span>
                    
                    <span className="sm:hidden">Explore AI Agent</span>
                   
                  </button>
                </div>
              </div>

              {/* Right: Event Image */}
              <div className="p-5 sm:p-7 lg:p-10 flex items-center">
                <div className="rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl w-full">
                  <img
                    src={GRAND_LAUNCH_TOP_IMAGE}
                    alt="Rotary AI Hub Grand Launch"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Poster Launch Event - Enhanced */}
          <div className="mt-4 sm:mt-6 rounded-2xl sm:rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
            <div className="p-3 sm:p-4 lg:p-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center flex-shrink-0">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                      Poster Launch Event
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                      22 Feb 2026 • Rotary Leadership Training
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
                  <Clock className="h-3 w-3" />
                  Event Highlights
                </span>
              </div>
            </div>

            <div className="p-3 sm:p-4 lg:p-5 bg-gradient-to-b from-gray-50/50 to-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="group relative overflow-hidden rounded-lg sm:rounded-xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <img
                    src="https://i.ibb.co/CpnDjvm0/pl1.png"
                    alt="Poster Launch Photo 1"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <img
                    src="https://i.ibb.co/bMTVvMyn/pl2.png"
                    alt="Poster Launch Photo 2"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ENHANCED HERO SECTION - Fully Responsive */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6"
        >
          <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-white via-white to-blue-50/30 shadow-2xl">
            {/* Advanced background effects */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-purple-600" />
              <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />
              <div className="absolute top-20 -right-24 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl" />
              <div className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-purple-100/30 blur-3xl" />
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0">
              {/* LEFT CONTENT */}
              <div className="lg:col-span-7 p-6 sm:p-8 lg:p-12">
                {/* Premium Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-sm font-bold shadow-lg">
                  <Sparkles className="h-4 w-4" />
                  Greetings From
                </div>

                {/* Title Section */}
                <div className="mt-6">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    <span className="bg-gradient-to-r from-blue-700 to-emerald-600 bg-clip-text text-transparent">
                      Rtn. Thatavarti Venkata RadhaKrishna Gupta
                    </span>
                  </h1>

                  {/* District + Home Club */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs sm:text-sm font-semibold text-blue-800">
                      <Globe className="h-4 w-4" />
                      <span className="whitespace-nowrap">
                        {ROTARY_DISTRICT}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs sm:text-sm font-semibold text-emerald-800">
                      <Users2 className="h-4 w-4" />
                      <span className="whitespace-nowrap">
                        Home Club : {ROTARY_HOME_CLUB}
                      </span>
                    </span>
                  </div>

                  <div className="mt-6 space-y-3 text-gray-700">
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm sm:text-base">
                        <b>Author</b> —{" "}
                        <span className="font-semibold text-gray-900">
                          AI & GenAI Universe Book
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Rocket className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm sm:text-base">
                        <b>Founder & CEO</b> —{" "}
                        <span className="font-semibold text-gray-900">
                          ASKOXY.AI (AI-Z Marketplace)
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-purple-600 flex-shrink-0" />
                      <span className="text-sm sm:text-base">
                        <b>OxyLoans</b> —{" "}
                        <span className="font-semibold text-gray-900">
                          RBI Approved P2P NBFC
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rotary AI Hub Section */}
                <div className="mt-8">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    Rotary <span className="text-blue-700">AI Hub</span>
                    {/* <span className="text-emerald-600">AI Commerce</span> */}
                  </h2>
                  <p className="mt-3 text-gray-700 leading-relaxed text-sm sm:text-base">
                    With deep respect for Rotary's legacy of leadership and
                    service, I've launched a AI initiative — comprising the{" "}
                    <b className="text-blue-700">Rotary AI Hub</b>
                  </p>
                </div>

                {/* Note Card */}
                {/* <div className="mt-6 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50/60 to-green-50/60 p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="h-5 w-5 text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        AI Commerce Benefit
                      </p>
                      <p className="text-sm text-gray-700">
                        As part of <b>AI Commerce</b>, we will add your products
                        and services to ASKOXY.AI Platform or we will bulk buy.
                      </p>
                    </div>
                  </div>
                </div> */}

                {/* Action Buttons - Compact & Responsive */}
                <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    className={`group flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 border shadow-sm active:scale-95 ${
                      interested
                        ? "bg-gradient-to-r from-blue-700 to-blue-800 text-white hover:opacity-90"
                        : "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:opacity-90"
                    }`}
                    onClick={() => handlePlatformClick(interested)}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {interested ? (
                        <>
                          <Rocket className="h-4 w-4" />
                          <span>Open Platform</span>
                          <ChevronRight className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <Users className="h-4 w-4" />
                          <span>Join Platform</span>
                        </>
                      )}
                    </span>
                  </button>

                  <button
                    className="group flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 border shadow-sm bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white hover:opacity-90 active:scale-95"
                    onClick={openWhatsAppGroupPlatform}
                    type="button"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>WhatsApp Group</span>
                    </span>
                  </button>

                  <button
                    className="group flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 hover:shadow-sm active:scale-95"
                    onClick={handleWriteToUs}
                    type="button"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>Write To Us</span>
                    </span>
                  </button>
                </div>

                {/* Feature Pills - Responsive */}
                <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
                  <Pill
                    icon={<Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />}
                    text="AI Mentorship"
                    variant="premium"
                  />
                  {/* <Pill
                    icon={<ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />}
                    text="Community Commerce"
                    variant="success"
                  /> */}
                  <Pill
                    icon={<Users2 className="h-3 w-3 sm:h-4 sm:w-4" />}
                    text="Rotary Network"
                    variant="default"
                  />
                  <Pill
                    icon={<TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />}
                    text="Business Growth"
                    variant="success"
                  />
                </div>
              </div>

              {/* RIGHT IMAGE SECTION - Responsive (Updated UI, no pills) */}
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-12">
                <div className="space-y-4 sm:space-y-6">
                  {/* Greetings Image */}
                  <div className="relative p-4 sm:p-6">
                    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-lg">
                      <img
                        src={GREETINGS_IMAGE}
                        alt="Rtn. Thatavarti Venkata RadhaKrishna Gupta"
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Platform Overview Card */}
                  {/* <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
                    <div className="p-4 sm:p-5 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-gray-900">
                            Platform Overview
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            Simple, powerful, and Rotary-focused
                          </p>
                        </div>
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                          <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-blue-700" />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4">
                      <div className="rounded-2xl overflow-hidden border border-gray-100">
                        <img
                          src={HERO_IMAGE}
                          alt="Rotary AI Platform Overview"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ENHANCED DOUBLE ENGINE SECTION */}
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 mt-8"
        >
          <section className="rounded-3xl bg-gradient-to-br from-white to-blue-50/30 border border-gray-100 shadow-xl p-6 sm:p-8 lg:p-12">
            {/* Header */}
            <div className="text-center mb-8 sm:mb-10">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                <span className="bg-gradient-to-r from-blue-700 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                  Rotary AI Hub - AI Initiative
                </span>
              </h1>

              <p className="mt-3 sm:mt-4 text-gray-700 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
                Driving{" "}
                <span className="font-semibold text-blue-700">
                  Rotary&apos;s transformation
                </span>{" "}
                through structured{" "}
                <span className="font-semibold text-purple-700">
                  AI education
                </span>{" "}
                and hands-on
                <span className="font-semibold text-emerald-700">
                  {" "}
                  mentorship
                </span>
                .
              </p>
            </div>

            {/* Points in Both Sides */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* LEFT POINTS */}
              <div className="rounded-3xl border border-blue-200 bg-white/70 backdrop-blur p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                      AI Learning
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Build AI capability step-by-step
                    </p>
                  </div>
                </div>

                <ul className="space-y-3">
                  {[
                    "Encourage Rotarians to learn AI and increase revenue",
                    "Live demos + practical real-world use cases",
                    "Learning through real usage (not just theory)",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* RIGHT POINTS */}
              <div className="rounded-3xl border border-purple-200 bg-white/70 backdrop-blur p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                      AI Mentorship
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Support to implement and execute
                    </p>
                  </div>
                </div>

                <ul className="space-y-3">
                  {[
                    "Weekly mentorship sessions",
                    "Hands-on project guidance",
                    "Implementation support and follow-ups",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ENHANCED OBJECTIVE SECTION */}
          <section className="mt-6 sm:mt-8 rounded-3xl bg-gradient-to-br from-white to-gray-50/50 border border-gray-100 shadow-xl p-6 sm:p-8 lg:p-10">
            <div className="mb-6 sm:mb-8 text-center">
              <div className="flex flex-col items-center gap-3 mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                    <span className="bg-gradient-to-r from-purple-700 via-blue-700 to-emerald-700 bg-clip-text text-transparent">
                      Our Mission & Vision
                    </span>
                  </h2>
                  <p className="text-gray-600 mt-2 text-sm sm:text-base font-medium">
                    Building capacity through{" "}
                    <span className="text-purple-600">
                      practical AI adoption
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-emerald-50 rounded-2xl p-5 sm:p-7 border-2 border-transparent bg-clip-padding relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-blue-200 to-emerald-200 opacity-20 blur-xl"></div>
                <p className="relative text-gray-800 leading-relaxed text-sm sm:text-base">
                  Our objective is to build{" "}
                  <span className="font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                    practical awareness
                  </span>
                  ,{" "}
                  <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    confidence
                  </span>
                  , and{" "}
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    hands-on capability
                  </span>{" "}
                  in Artificial Intelligence and Generative AI, enabling
                  Rotarians to apply AI effectively across all dimensions of
                  professional and community life.
                </p>
              </div>
            </div>

            {/* Application Areas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
              {[
                {
                  icon: <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />,
                  title: "Professional Growth",
                  color: "from-blue-100 to-blue-200",
                  textColor: "text-blue-800",
                  bgHover: "group-hover:from-blue-200 group-hover:to-blue-300",
                },
                {
                  icon: <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />,
                  title: "Entrepreneurship",
                  color: "from-emerald-100 to-emerald-200",
                  textColor: "text-emerald-800",
                  bgHover:
                    "group-hover:from-emerald-200 group-hover:to-emerald-300",
                },
                {
                  icon: <HeartHandshake className="h-5 w-5 sm:h-6 sm:w-6" />,
                  title: "Community",
                  color: "from-purple-100 to-purple-200",
                  textColor: "text-purple-800",
                  bgHover:
                    "group-hover:from-purple-200 group-hover:to-purple-300",
                },
                {
                  icon: <Users2 className="h-5 w-5 sm:h-6 sm:w-6" />,
                  title: "Youth Empowerment",
                  color: "from-pink-100 to-pink-200",
                  textColor: "text-pink-800",
                  bgHover: "group-hover:from-pink-200 group-hover:to-pink-300",
                },
              ].map((area, idx) => (
                <div
                  key={idx}
                  className="group bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 hover:shadow-2xl hover:border-gray-300 transition-all duration-300 hover:-translate-y-2 active:scale-95 cursor-pointer"
                >
                  <div
                    className={`h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br ${area.color} ${area.bgHover} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md`}
                  >
                    <div className={area.textColor}>{area.icon}</div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-gray-700 transition-colors">
                    {area.title}
                  </h3>
                </div>
              ))}
            </div>

            {/* Rotary Focus Areas */}
            <div className="mt-6 sm:mt-10">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Alignment with Rotary Focus Areas
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[
                  {
                    title: "Women Empowerment",
                    icon: <Users2 className="h-4 w-4 sm:h-5 sm:w-5" />,
                    color: "from-pink-100 to-rose-100",
                    points: [
                      "AI awareness for women entrepreneurs",
                      "Digital tools for business growth",
                      "Confidence-building through technology",
                      "Networking and mentorship programs",
                    ],
                  },
                  {
                    title: "Youth Empowerment",
                    icon: <Zap className="h-4 w-4 sm:h-5 sm:w-5" />,
                    color: "from-blue-100 to-cyan-100",
                    points: [
                      "Introduction to AI careers",
                      "Hands-on exposure to AI agents",
                      "Focus on ethical AI adoption",
                      "Industry-relevant skill development",
                    ],
                  },
                  {
                    title: "Economic Development",
                    icon: <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />,
                    color: "from-emerald-100 to-green-100",
                    points: [
                      "AI support for MSMEs & startups",
                      "Enhancing Rotary service projects",
                      "Digital transformation guidance",
                      "Sustainable business development",
                    ],
                  },
                ].map((area, idx) => (
                  <div key={idx} className="group">
                    <div
                      className={`rounded-3xl border border-gray-200 bg-gradient-to-b ${area.color} p-4 sm:p-6 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                    >
                      <div className="flex items-center gap-3 mb-3 sm:mb-4">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                          <div className="text-gray-700">{area.icon}</div>
                        </div>
                        <h4 className="text-base sm:text-lg font-bold text-gray-900">
                          {area.title}
                        </h4>
                      </div>
                      <ul className="space-y-2">
                        {area.points.map((point, pointIdx) => (
                          <li key={pointIdx} className="flex items-start gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5 sm:mt-2 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-700">
                              {point}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </motion.main>

        {/* Enhanced Modals - Mobile Responsive */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-700" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        Write To Us
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600">
                        We'll respond within 24 hours
                      </p>
                    </div>
                  </div>
                  <button
                    className="h-8 w-8 sm:h-10 sm:w-10                     rounded-full bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center text-gray-700 font-bold hover:scale-110 active:scale-95"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="text-blue-600">📱</span>
                      Mobile Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        disabled
                        value={finalMobileNumber || ""}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-800 focus:outline-none font-medium text-sm sm:text-base"
                      />
                      <div className="absolute right-3 top-2.5 sm:top-3">
                        <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="text-blue-600">✉️</span>
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        disabled
                        value={email || ""}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-800 focus:outline-none font-medium text-sm sm:text-base"
                      />
                      <div className="absolute right-3 top-2.5 sm:top-3">
                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="text-blue-600">💬</span>
                      Your Query
                      <span className="text-xs font-normal text-gray-500 ml-auto">
                        Required
                      </span>
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition placeholder-gray-400 font-medium text-sm sm:text-base"
                      placeholder="Please describe your query in detail..."
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setQueryError(undefined);
                      }}
                      maxLength={500}
                    />
                    {queryError && (
                      <p className="text-red-500 text-xs sm:text-sm mt-2 flex items-center gap-2">
                        <span>⚠️</span>
                        {queryError}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Character count: {query.length}/500
                    </p>
                  </div>
                </div>

                <button
                  className="mt-4 sm:mt-6 w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 text-sm sm:text-base"
                  onClick={handleWriteToUsSubmitButton}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="h-4 w-4" />
                      Submit Query
                    </span>
                  )}
                </button>

                <p className="text-center text-xs text-gray-500 mt-3 sm:mt-4">
                  We typically respond within 2-4 hours
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ENHANCED PROFILE ALERT MODAL */}
        {isprofileOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 w-full max-w-sm animate-scale-in">
              <div className="text-center mb-3 sm:mb-4">
                <div className="mx-auto h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 flex items-center justify-center mb-3 sm:mb-4">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                    <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Profile Required
                </h2>
                <p className="text-sm text-gray-600 mb-4 sm:mb-6">
                  Please complete your profile details to continue.
                </p>
              </div>

              <div className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 rounded-xl p-3 sm:p-4 border border-amber-100 mb-4 sm:mb-6">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Info className="h-3 w-3 sm:h-4 sm:w-4 text-amber-700" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700">
                    Your profile helps us provide personalized assistance and
                    ensure secure communication.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition active:scale-95 text-sm sm:text-base"
                  onClick={() => setIsprofileOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition shadow-lg hover:shadow-xl active:scale-95 text-sm sm:text-base"
                  onClick={handlePopUOk}
                >
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ENHANCED SUCCESS MODAL */}
        {issuccessOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 w-full max-w-sm text-center animate-scale-in">
              <div className="mx-auto h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 flex items-center justify-center mb-3 sm:mb-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Query Submitted!
              </h2>
              <p className="text-sm text-gray-600 mb-4 sm:mb-6">
                Thank you for reaching out. Our team will get back to you
                shortly.
              </p>

              <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl p-3 sm:p-4 border border-green-100 mb-4 sm:mb-6">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  <p className="text-xs sm:text-sm font-medium text-green-700">
                    Response time: Typically within 2-4 hours
                  </p>
                </div>
              </div>

              <button
                className="w-full px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl active:scale-95 text-sm sm:text-base"
                onClick={() => setSuccessOpen(false)}
              >
                Got it!
              </button>

              <p className="text-xs text-gray-500 mt-3 sm:mt-4">
                You'll also receive a confirmation email
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />

      {/* Animations */}
      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MyRotaryServices;
