import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  ChevronLeft,
  ChevronRight,
  FileVideo2,
  HandCoins,
  Landmark,
  Loader2,
  MessageCircle,
  Mic,
  Bot,
  Sparkles,
  ExternalLink,
  Eye,
  Maximize2,
  Pause,
  Play,
  Quote,
  Save,
  LockKeyhole,
  Star,
  Phone,
  PhoneCall,
  ShieldCheck,
  UserRound,
  Users,
  Volume2,
  VolumeX,
  WalletCards,
} from "lucide-react";

import BASE_URL from "../Config";
import { customerApi } from "../utils/axiosInstance";
import RADHAI from "../assets/img/radhai.png";

type MainTab =
  | "callbacks"
  | "testimonials"
  | "ceoai"
  | "oxyloans"
  | "oxybricks";
type ProjectType = "OXYLOANS" | "OXYBRICKS" | "GOLD";

export interface TestimonialVideo {
  id: string;
  title: string;
  customerName: string;
  designation?: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  projectType: ProjectType;
  createdAt?: string;
  views?: number;
}

interface LenderEngagementWorkspaceProps {
  videos?: TestimonialVideo[];
  campaignTitle?: string;
  onBack?: () => void;
}

interface ProfileResponse {
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  whatsappNumber?: string;
}

interface RequestCallBackPayload {
  customerName: string;
  askOxyOffers: string;
  comments: string;
  message: string;
  mobileNumber: string;
  projectType: string;
  status: boolean;
  userId: string;
}

interface RequestCallBackResponse {
  message?: string;
}

interface CallbackRequestItem {
  id: string;
  customerName: string;
  mobileNumber: string;
  message: string;
  comments: string;
  projectType: string;
  status: boolean | string;
  createdAt?: string;
}

const CALLBACK_API = `${BASE_URL}/marketing-service/campgin/request-call-back`;
const USER_CALLBACK_API = `${CALLBACK_API}/user`;
const LENDER_REGISTRATION_URL =
  "https://www.user.oxyloans.com/register?ref=LR1060615";
const CALLBACK_DRAFT_KEY = "oxyloansCallbackProfile";
const PROFILE_API = `${BASE_URL}/user-service/customerProfileDetails`;

const TAB_ITEMS: Array<{
  id: MainTab;
  label: string;
  icon: React.ElementType;
}> = [
  { id: "callbacks", label: "Request Callback", icon: PhoneCall },
  { id: "testimonials", label: "Testimonials", icon: FileVideo2 },
  { id: "ceoai", label: "CEO AI Clone", icon: Bot },
  { id: "oxyloans", label: "OxyLoans", icon: HandCoins },
  { id: "oxybricks", label: "OxyBricks", icon: Building2 },
];

const LenderEngagementWorkspace: React.FC<LenderEngagementWorkspaceProps> = ({
  videos = [],
  campaignTitle = "OxyLoans Lender Experience",
  onBack,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<MainTab>("callbacks");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileMobile, setProfileMobile] = useState("");
  const [profileNameLocked, setProfileNameLocked] = useState(false);
  const [profileMobileLocked, setProfileMobileLocked] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState("");

  const [callbackComments, setCallbackComments] = useState("");
  const [callbackMessage, setCallbackMessage] = useState(
    "I am interested in OxyLoans lending. Please contact me.",
  );
  const [callbackLoading, setCallbackLoading] = useState(false);
  const [callbackSuccess, setCallbackSuccess] = useState("");
  const [callbackError, setCallbackError] = useState("");
  const [callbackRequests, setCallbackRequests] = useState<
    CallbackRequestItem[]
  >([]);
  const [callbackRequestsLoading, setCallbackRequestsLoading] = useState(false);
  const [callbackRequestsError, setCallbackRequestsError] = useState("");

  const currentVideo = videos[currentIndex];

  const getUserId = (): string =>
    localStorage.getItem("userId") || sessionStorage.getItem("userId") || "";

  const getToken = (): string =>
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken") ||
    "";

  const getHeaders = (): Record<string, string> => {
    const token = getToken();

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const normalizePhone = (value?: string): string => {
    const digits = String(value || "").replace(/\D/g, "");
    return digits.length > 10 ? digits.slice(-10) : digits;
  };

  const fetchProfile = useCallback(async (): Promise<void> => {
    const userId = getUserId();

    if (!userId) {
      setProfileLoading(false);
      setProfileError("Please log in to request a callback.");
      return;
    }

    try {
      setProfileLoading(true);
      setProfileError("");

      const response = await customerApi.get<ProfileResponse>(PROFILE_API, {
        params: { customerId: userId },
      });

      const data = response.data || {};
      const apiName = `${data.firstName || ""} ${data.lastName || ""}`.trim();
      const apiMobile =
        normalizePhone(data.mobileNumber) ||
        normalizePhone(data.whatsappNumber);

      let savedName = "";
      let savedMobile = "";
      try {
        const saved = JSON.parse(
          localStorage.getItem(CALLBACK_DRAFT_KEY) || "{}",
        );
        savedName = String(saved?.customerName || "").trim();
        savedMobile = normalizePhone(saved?.mobileNumber);
      } catch {
        localStorage.removeItem(CALLBACK_DRAFT_KEY);
      }

      const fallbackMobile =
        normalizePhone(localStorage.getItem("mobileNumber") || "") ||
        normalizePhone(localStorage.getItem("whatsappNumber") || "");

      setProfileName(apiName || savedName);
      setProfileMobile(apiMobile || savedMobile || fallbackMobile);
      setProfileNameLocked(Boolean(apiName || savedName));
      setProfileMobileLocked(
        Boolean(apiMobile || savedMobile || fallbackMobile),
      );

      if (!apiName || !apiMobile) {
        setProfileError(
          "Complete the missing profile details below. Existing details are locked for your security.",
        );
      }
    } catch {
      try {
        const saved = JSON.parse(
          localStorage.getItem(CALLBACK_DRAFT_KEY) || "{}",
        );
        const savedName = String(saved?.customerName || "").trim();
        const savedMobile = normalizePhone(saved?.mobileNumber);
        setProfileName(savedName);
        setProfileMobile(savedMobile);
        setProfileNameLocked(Boolean(savedName));
        setProfileMobileLocked(Boolean(savedMobile));
      } catch {
        localStorage.removeItem(CALLBACK_DRAFT_KEY);
      }
      setProfileError(
        "Unable to load profile details. You can enter and save missing details below.",
      );
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const saveMissingProfileDetails = (): void => {
    setProfileSaveSuccess("");
    setProfileError("");

    const cleanName = profileName.trim();
    const cleanMobile = normalizePhone(profileMobile);

    if (!cleanName) {
      setProfileError("Please enter your full name.");
      return;
    }
    if (cleanMobile.length !== 10) {
      setProfileError("Please enter a valid 10-digit mobile number.");
      return;
    }

    localStorage.setItem(
      CALLBACK_DRAFT_KEY,
      JSON.stringify({ customerName: cleanName, mobileNumber: cleanMobile }),
    );
    setProfileName(cleanName);
    setProfileMobile(cleanMobile);
    setProfileNameLocked(true);
    setProfileMobileLocked(true);
    setProfileSaveSuccess("Your callback details were saved successfully.");
  };

  const normalizeCallbackRequests = (
    payload: unknown,
  ): CallbackRequestItem[] => {
    const source = payload as any;
    const rows = Array.isArray(source)
      ? source
      : Array.isArray(source?.content)
        ? source.content
        : Array.isArray(source?.data)
          ? source.data
          : Array.isArray(source?.result)
            ? source.result
            : [];

    return rows
      .map((item: any, index: number) => ({
        id: String(item?.id || item?.requestId || `callback-${index}`),
        customerName: String(item?.customerName || item?.name || "Customer"),
        mobileNumber: normalizePhone(item?.mobileNumber || item?.phoneNumber),
        message: String(item?.message || "Callback requested"),
        comments:
          typeof item?.comments === "string"
            ? item.comments
            : item?.comments
              ? JSON.stringify(item.comments)
              : "",
        projectType: String(item?.projectType || "OXYLOANS"),
        status: item?.status ?? "SUBMITTED",
        createdAt: item?.createdAt || item?.requestedAt || item?.updatedAt,
      }))
      .sort((first: CallbackRequestItem, second: CallbackRequestItem) =>
        String(second.createdAt || "").localeCompare(
          String(first.createdAt || ""),
        ),
      );
  };

  const fetchUserCallbackRequests = useCallback(async (): Promise<void> => {
    const userId = getUserId();
    if (!userId) {
      setCallbackRequests([]);
      return;
    }

    try {
      setCallbackRequestsLoading(true);
      setCallbackRequestsError("");
      const response = await axios.get(
        `${USER_CALLBACK_API}/${encodeURIComponent(userId)}`,
        {
          headers: getHeaders(),
        },
      );
      setCallbackRequests(normalizeCallbackRequests(response.data));
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string;
        error?: string;
      }>;
      setCallbackRequests([]);
      setCallbackRequestsError(
        axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          "Unable to load your callback requests.",
      );
    } finally {
      setCallbackRequestsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProfile();
    void fetchUserCallbackRequests();
  }, [fetchProfile, fetchUserCallbackRequests]);

  useEffect(() => {
    if (videos.length > 0 && currentIndex >= videos.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, videos.length]);

  const changeTab = (tab: MainTab): void => {
    setActiveTab(tab);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const goPrevious = (): void => {
    if (!videos.length) return;
    setCurrentIndex((previous) =>
      previous === 0 ? videos.length - 1 : previous - 1,
    );
  };

  const goNext = (): void => {
    if (!videos.length) return;
    setCurrentIndex((previous) =>
      previous === videos.length - 1 ? 0 : previous + 1,
    );
  };

  const openRegistration = (projectType: ProjectType): void => {
    const targetUrl =
      projectType === "OXYLOANS"
        ? LENDER_REGISTRATION_URL
        : "https://www.oxybricks.world/";

    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  const openRadhAI = (interactionMode: "voice" | "chat" = "voice"): void => {
    sessionStorage.setItem("radhAIEntrySource", "lender-workspace");
    sessionStorage.setItem("radhAIPreferredMode", interactionMode);
    navigate("/radhAI", {
      state: {
        from: "/lenderjourney",
        interactionMode,
      },
    });
  };

  const handleCallbackSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const userId = getUserId();
    setCallbackSuccess("");
    setCallbackError("");

    if (!userId) {
      setCallbackError("Please log in before requesting a callback.");
      return;
    }

    if (!profileName.trim()) {
      setCallbackError(
        "Please enter and save your name before requesting a callback.",
      );
      return;
    }

    if (profileMobile.length !== 10) {
      setCallbackError("Please enter and save a valid 10-digit mobile number.");
      return;
    }

    const payload: RequestCallBackPayload = {
      userId,
      customerName: profileName.trim(),
      askOxyOffers: "OxyLoans Lending",
      projectType: "OXYLOANS",
      mobileNumber: profileMobile,
      comments: callbackComments.trim(),
      message:
        callbackMessage.trim() ||
        "I am interested in OxyLoans lending. Please contact me.",
      status: true,
    };

    try {
      setCallbackLoading(true);

      const response = await axios.post<RequestCallBackResponse>(
        CALLBACK_API,
        payload,
        { headers: getHeaders() },
      );

      setCallbackSuccess(
        response.data?.message || "Callback request submitted successfully.",
      );
      setCallbackComments("");
      setCallbackMessage(
        "I am interested in OxyLoans lending. Please contact me.",
      );
      await fetchUserCallbackRequests();
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setCallbackError(
        axiosError.response?.data?.message ||
          "Unable to submit your callback request.",
      );
    } finally {
      setCallbackLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f8fb] text-[#183b56]">
      <header className="relative overflow-hidden border-b border-[#dce7f2] bg-gradient-to-r from-[#f7fbff] via-white to-[#eef9f7]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#008cba]/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-7xl items-center gap-3 px-3 py-3 sm:px-5 sm:py-4 lg:px-8">
          <button
            type="button"
            onClick={onBack || (() => navigate(-1))}
            aria-label="Go back"
            title="Go back"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#cbddea] bg-white text-[#075985] shadow-sm transition hover:border-[#008cba] hover:bg-[#f0faff] focus:outline-none focus:ring-4 focus:ring-sky-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-3">

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#008cba] sm:text-xs">
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                <span>Lender Journey</span>
              </div>
              <h1 className="mt-0.5 truncate text-base font-black tracking-tight text-[#102a43] sm:text-xl lg:text-2xl">
                {campaignTitle}
              </h1>
              <p className="mt-0.5 hidden text-xs text-[#607d8b] lg:block">
                Get support, explore lender services, and connect with radhAI.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openRegistration("OXYLOANS")}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#008cba] px-3 text-xs font-black text-white shadow-sm transition hover:bg-[#007aa3] sm:px-4 sm:text-sm"
          >
            <span className="hidden xs:inline sm:inline">
              Register as a Lender
            </span>
            <span className="sm:hidden">Register</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <nav
        aria-label="Lender journey sections"
        className="relative z-10 w-full border-y border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-0 sm:px-4 lg:px-8">
          <div
            role="tablist"
            aria-label="Oxy customer services"
            className="flex min-w-0 snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-5 lg:overflow-visible"
          >
            {TAB_ITEMS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => changeTab(tab.id)}
                  className={`group relative flex min-h-[56px] min-w-[108px] snap-start shrink-0 flex-col items-center justify-center gap-1 px-3 pb-2 pt-2 text-center transition-colors duration-200 sm:min-h-[60px] sm:min-w-[128px] sm:px-4 lg:min-w-0 ${
                    isActive
                      ? "text-[#008cba]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-[#075985]"
                  }`}
                >
                  <Icon
                    className={`h-[18px] w-[18px] transition-transform duration-200 sm:h-5 sm:w-5 ${
                      isActive
                        ? "stroke-[2.4]"
                        : "stroke-[1.9] group-hover:-translate-y-0.5"
                    }`}
                  />
                  <span
                    className={`max-w-[96px] truncate text-[11px] leading-4 sm:max-w-[118px] sm:text-xs ${
                      isActive ? "font-extrabold" : "font-semibold"
                    }`}
                  >
                    {tab.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full transition-all duration-200 sm:inset-x-5 ${
                      isActive
                        ? "scale-x-100 bg-[#008cba]"
                        : "scale-x-0 bg-transparent"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl scroll-mt-4 px-3 py-4 sm:px-5 sm:py-5 lg:px-8 lg:py-6">
        {activeTab === "callbacks" && (
          <CallbackTab
            profileLoading={profileLoading}
            profileError={profileError}
            profileName={profileName}
            profileMobile={profileMobile}
            callbackMessage={callbackMessage}
            callbackComments={callbackComments}
            callbackLoading={callbackLoading}
            callbackSuccess={callbackSuccess}
            callbackError={callbackError}
            callbackRequests={callbackRequests}
            callbackRequestsLoading={callbackRequestsLoading}
            callbackRequestsError={callbackRequestsError}
            onRefreshRequests={fetchUserCallbackRequests}
            profileNameLocked={profileNameLocked}
            profileMobileLocked={profileMobileLocked}
            profileSaveSuccess={profileSaveSuccess}
            onSaveProfile={saveMissingProfileDetails}
            onNameChange={setProfileName}
            onMobileChange={(value) => setProfileMobile(normalizePhone(value))}
            onMessageChange={setCallbackMessage}
            onCommentsChange={setCallbackComments}
            onSubmit={handleCallbackSubmit}
          />
        )}

        {activeTab === "testimonials" && (
          <TestimonialsTab
            videos={videos}
            currentVideo={currentVideo}
            currentIndex={currentIndex}
            isMuted={isMuted}
            onMute={() => setIsMuted((previous) => !previous)}
            onPrevious={goPrevious}
            onNext={goNext}
            onSelect={setCurrentIndex}
          />
        )}

        {activeTab === "ceoai" && (
          <CEOAITab
            onOpenRadhAI={() => openRadhAI("voice")}
            onOpenChat={() => openRadhAI("chat")}
          />
        )}

        {activeTab === "oxyloans" && (
          <ProductTab
            icon={HandCoins}
            logoAlt="OxyLoans"
            title="OxyLoans for Lenders"
            eyebrow="Lend like a bank"
            description="Register as a lender, participate in available lending opportunities, and manage your lending journey through the OxyLoans digital platform."
            actionLabel="Register as a Lender"
            highlight="Earn up to 1.75% monthly ROI • Up to 24% yearly ROI"
            stats={[
              { icon: Users, value: "3,800+", label: "Customers" },
              {
                icon: HandCoins,
                value: "₹2,000 Cr+",
                label: "Lent through the platform",
              },
              {
                icon: Clock3,
                value: "Since 2016",
                label: "Trusted lending journey",
              },
            ]}
            features={[
              {
                icon: WalletCards,
                title: "Lender-Only Journey",
                description:
                  "This section focuses only on lender registration, lending participation, portfolio access and support.",
              },
              {
                icon: Landmark,
                title: "Lend Like a Bank",
                description:
                  "Participate in peer-to-peer lending opportunities through an RBI-registered NBFC-P2P platform.",
              },
              {
                icon: ShieldCheck,
                title: "Digital Access",
                description:
                  "Register online, review opportunities, participate and track your lending activity from your account.",
              },
            ]}
            onAction={() => openRegistration("OXYLOANS")}
          />
        )}

        {activeTab === "oxybricks" && (
          <ProductTab
            icon={Building2}
            title="OxyBricks Opportunities"
            eyebrow="Fractional ownership ecosystem"
            description="Explore fractional ownership and participation opportunities across selected real-estate deals and gold-linked opportunities through the OXY ecosystem."
            actionLabel="Explore OxyBricks"
            highlight="Real Estate • Fractional Ownership • Deals • Gold"
            features={[
              {
                icon: Building2,
                title: "Fractional Real Estate",
                description:
                  "Participate in selected property opportunities without purchasing the entire asset.",
              },
              {
                icon: Landmark,
                title: "Participate in Deals",
                description:
                  "Review available deal information and choose opportunities that match your participation goals.",
              },
              {
                icon: ShieldCheck,
                title: "Gold Opportunities",
                description:
                  "Explore gold-related participation options available through the connected OXY ecosystem.",
              },
            ]}
            onAction={() => openRegistration("OXYBRICKS")}
          />
        )}
      </main>
    </div>
  );
};

interface CallbackTabProps {
  profileLoading: boolean;
  profileError: string;
  profileName: string;
  profileMobile: string;
  callbackMessage: string;
  callbackComments: string;
  callbackLoading: boolean;
  callbackSuccess: string;
  callbackError: string;
  callbackRequests: CallbackRequestItem[];
  callbackRequestsLoading: boolean;
  callbackRequestsError: string;
  onRefreshRequests: () => Promise<void>;
  profileNameLocked: boolean;
  profileMobileLocked: boolean;
  profileSaveSuccess: string;
  onSaveProfile: () => void;
  onNameChange: (value: string) => void;
  onMobileChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onCommentsChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

const CallbackTab: React.FC<CallbackTabProps> = ({
  profileLoading,
  profileError,
  profileName,
  profileMobile,
  callbackMessage,
  callbackComments,
  callbackLoading,
  callbackSuccess,
  callbackError,
  callbackRequests,
  callbackRequestsLoading,
  callbackRequestsError,
  onRefreshRequests,
  profileNameLocked,
  profileMobileLocked,
  profileSaveSuccess,
  onSaveProfile,
  onNameChange,
  onMobileChange,
  onMessageChange,
  onCommentsChange,
  onSubmit,
}) => {
  const formatDate = (value?: string): string => {
    if (!value) return "Date not available";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="space-y-6">
      <SectionHeading
        icon={PhoneCall}
        title="Request a Callback"
        description="Request a callback, and our team will contact you shortly."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)]">
        <div className="overflow-hidden rounded-[26px] border border-[#d7e5ee] bg-white shadow-[0_18px_55px_-35px_rgba(15,58,86,0.45)]">
          <div className="bg-gradient-to-br from-[#075985] to-[#008cba] p-5 text-white sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="mt-2 text-2xl font-black">How can we help?</h2>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <Phone className="h-6 w-6" />
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            {profileError && (
              <AlertMessage type="error" message={profileError} />
            )}
            {profileSaveSuccess && (
              <AlertMessage type="success" message={profileSaveSuccess} />
            )}
            {callbackSuccess && (
              <AlertMessage type="success" message={callbackSuccess} />
            )}
            {callbackError && (
              <AlertMessage type="error" message={callbackError} />
            )}

            {profileLoading ? (
              <div className="flex min-h-[280px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#008cba]" />
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField
                    label="Customer Name"
                    value={profileName}
                    onChange={onNameChange}
                    placeholder="Enter customer name"
                    icon={UserRound}
                    disabled={profileNameLocked}
                    helperText={
                      profileNameLocked
                        ? "Saved profile name"
                        : "Name is missing—enter and save it"
                    }
                  />
                  <InputField
                    label="Mobile Number"
                    value={profileMobile}
                    onChange={onMobileChange}
                    placeholder="Enter 10-digit mobile number"
                    icon={Phone}
                    inputMode="numeric"
                    maxLength={10}
                    disabled={profileMobileLocked}
                    helperText={
                      profileMobileLocked
                        ? "Saved profile mobile number"
                        : "Mobile is missing—enter and save it"
                    }
                  />
                </div>

                {(!profileNameLocked || !profileMobileLocked) && (
                  <button
                    type="button"
                    onClick={onSaveProfile}
                    disabled={
                      !profileName.trim() || profileMobile.length !== 10
                    }
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#008cba] bg-[#eaf8fc] px-5 py-3 text-sm font-black text-[#007da5] transition hover:bg-[#dff4fa] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    <Save className="h-4 w-4" />
                    Save Missing Details
                  </button>
                )}

                <TextAreaField
                  label="Message"
                  rows={3}
                  value={callbackMessage}
                  onChange={onMessageChange}
                  placeholder="Enter your requirement"
                />

                <TextAreaField
                  label="Additional Comments"
                  rows={3}
                  value={callbackComments}
                  onChange={onCommentsChange}
                  placeholder="Add any additional details"
                />

                <button
                  type="submit"
                  disabled={
                    callbackLoading ||
                    !profileName.trim() ||
                    profileMobile.length !== 10
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#008cba] px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-sky-100 transition hover:bg-[#007aa3] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[230px]"
                >
                  {callbackLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <PhoneCall className="h-5 w-5" />
                      Request Callback
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="rounded-[26px] border border-[#d7e5ee] bg-white p-4 shadow-[0_18px_55px_-35px_rgba(15,58,86,0.45)] sm:p-6">
          <div className="flex items-center justify-between gap-3 border-b border-[#e5eef4] pb-4">
            <div>
              <h2 className="mt-1 text-xl font-black text-[#102a43]">
                My Callback Requests
              </h2>
              <p className="mt-1 text-xs font-semibold text-[#78909c]">
                Loaded from your account callback history
              </p>
            </div>
            <button
              type="button"
              onClick={() => void onRefreshRequests()}
              disabled={callbackRequestsLoading}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#cfe2eb] bg-white px-3 text-xs font-black text-[#007da5] transition hover:bg-[#f0fbfe] disabled:opacity-50"
            >
              {callbackRequestsLoading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {callbackRequestsError && (
            <div className="mt-4">
              <AlertMessage type="error" message={callbackRequestsError} />
            </div>
          )}

          {callbackRequestsLoading ? (
            <div className="flex min-h-[360px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#008cba]" />
            </div>
          ) : callbackRequests.length === 0 ? (
            <div className="flex min-h-[360px] items-center justify-center text-center">
              <div className="max-w-xs">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf8fc] text-[#008cba]">
                  <PhoneCall className="h-7 w-7" />
                </span>
                <h3 className="mt-4 font-black text-[#102a43]">
                  No callback requests yet
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#607d8b]">
                  Submit your first callback request and it will appear here
                  immediately after the server accepts it.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 max-h-[600px] space-y-3 overflow-y-auto pr-1">
              {callbackRequests.map((request, index) => {
                const isActive =
                  request.status === true ||
                  String(request.status).toLowerCase() === "true" ||
                  String(request.status).toUpperCase() === "ACTIVE";
                return (
                  <article
                    key={request.id}
                    className="rounded-2xl border border-[#dfeaf1] bg-[#f9fcfd] p-4 transition hover:border-[#b9dce8] hover:bg-white hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e4f5fa] text-sm font-black text-[#007da5]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-black text-[#183b56]">
                            {request.customerName || "Customer"}
                          </p>
                          <p className="mt-0.5 text-xs font-semibold text-[#607d8b]">
                            {request.mobileNumber || "Mobile unavailable"}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}
                      >
                        {isActive
                          ? "Active"
                          : String(request.status || "Submitted")}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold leading-6 text-[#334e68]">
                      {request.message}
                    </p>
                    {request.comments && (
                      <p className="mt-2 rounded-xl bg-white p-3 text-xs leading-5 text-[#607d8b]">
                        {request.comments}
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-end border-t border-[#e5eef4] pt-3 text-[11px] font-bold text-[#78909c]">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5" />
                        {formatDate(request.createdAt)}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

interface TestimonialsTabProps {
  videos: TestimonialVideo[];
  currentVideo?: TestimonialVideo;
  currentIndex: number;
  isMuted: boolean;
  onMute: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}

const TestimonialsTab: React.FC<TestimonialsTabProps> = ({
  videos,
  currentVideo,
  currentIndex,
  isMuted,
  onMute,
  onPrevious,
  onNext,
  onSelect,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
  }, [currentVideo?.id]);

  const togglePlay = async (): Promise<void> => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
      } catch {
        setIsPlaying(false);
      }
    } else {
      video.pause();
    }
  };

  const handleSeek = (value: number): void => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(value)) return;
    video.currentTime = value;
    setProgress(value);
  };

  const openFullscreen = async (): Promise<void> => {
    const video = videoRef.current;
    if (!video) return;

    try {
      await video.requestFullscreen?.();
    } catch {
      // Native video controls remain available when fullscreen is blocked.
    }
  };

  const formatTime = (seconds: number): string => {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  if (!currentVideo) {
    return (
      <section>
        <SectionHeading
          icon={FileVideo2}
          title="Lender Testimonials"
          description="Real experiences shared by OxyLoans lenders."
        />
        <EmptyState
          icon={FileVideo2}
          title="No testimonials available"
          description="No testimonial videos are available right now."
        />
      </section>
    );
  }

  const customerName =
    currentVideo.customerName?.trim() || `OxyLoans Lender ${currentIndex + 1}`;
  const designation = currentVideo.designation?.trim() || "Verified Lender";
  const title =
    currentVideo.title?.trim() ||
    `${customerName} shares the OxyLoans experience`;
  const description =
    currentVideo.description?.trim() ||
    "Hear directly from an OxyLoans lender about their platform experience and digital lending journey.";

  return (
    <section className="space-y-5 pb-5">
      <div className="overflow-hidden rounded-3xl border border-[#d7e5ee] bg-gradient-to-br from-[#f5fbfd] via-white to-[#eef9f7] p-4 shadow-[0_18px_55px_-38px_rgba(15,58,86,0.45)] sm:p-6">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#008cba]">
              OxyLoans at a glance
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-[#102a43] sm:text-2xl">
              Trusted by lenders since 2016
            </h2>
          </div>
          <p className="text-xs font-semibold text-slate-500 sm:text-right">
            Platform highlights shown before customer stories
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          <article className="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e7f7fb] text-[#008cba]">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <p className="text-2xl font-black leading-none text-[#102a43] sm:text-3xl">
                  3,800+
                </p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                  Happy customers
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <HandCoins className="h-5 w-5" />
              </span>
              <div>
                <p className="text-2xl font-black leading-none text-[#102a43] sm:text-3xl">
                  ₹2,000 Cr+
                </p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                  Lent through the platform
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                <Clock3 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-2xl font-black leading-none text-[#102a43] sm:text-3xl">
                  Since 2016
                </p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                  Trusted lending journey
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_22px_70px_-42px_rgba(15,58,86,0.45)]">
        <div className="grid lg:grid-cols-[minmax(300px,0.82fr)_minmax(0,1.18fr)]">
          <div className="flex items-center justify-center border-b border-slate-200 bg-slate-950 p-4 sm:p-6 lg:min-h-[590px] lg:border-b-0 lg:border-r">
            <div className="relative w-full max-w-[360px] overflow-hidden rounded-[26px] border border-white/10 bg-black shadow-2xl">
              <div className="aspect-[9/16]">
                <video
                  ref={videoRef}
                  key={currentVideo.id}
                  src={currentVideo.videoUrl}
                  poster={currentVideo.thumbnailUrl}
                  muted={isMuted}
                  playsInline
                  preload="metadata"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  onTimeUpdate={(event) =>
                    setProgress(event.currentTarget.currentTime)
                  }
                  onLoadedMetadata={(event) => {
                    setDuration(event.currentTarget.duration || 0);
                    setProgress(event.currentTarget.currentTime || 0);
                  }}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25" />

              <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[11px] font-black text-white backdrop-blur">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
                Verified lender story
              </div>

              {!isPlaying && (
                <button
                  type="button"
                  onClick={togglePlay}
                  className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#075985] shadow-2xl transition hover:scale-105 sm:h-20 sm:w-20"
                  aria-label="Play testimonial"
                >
                  <Play className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" />
                </button>
              )}

              <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4">
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={Math.min(progress, duration || 0)}
                  onChange={(event) => handleSeek(Number(event.target.value))}
                  className="h-1.5 w-full cursor-pointer accent-[#00a7d6]"
                  aria-label="Video progress"
                />

                <div className="mt-2 flex items-center gap-2 text-white">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#075985]"
                    aria-label={
                      isPlaying ? "Pause testimonial" : "Play testimonial"
                    }
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4 fill-current" />
                    ) : (
                      <Play className="ml-0.5 h-4 w-4 fill-current" />
                    )}
                  </button>

                  <span className="min-w-[82px] text-xs font-bold tabular-nums text-white/90">
                    {formatTime(progress)} / {formatTime(duration)}
                  </span>

                  <div className="ml-auto flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={onMute}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur"
                      aria-label={isMuted ? "Unmute video" : "Mute video"}
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={openFullscreen}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur"
                      aria-label="Open fullscreen"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-col bg-white p-5 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-[#007da5]">
                <FileVideo2 className="h-3.5 w-3.5" />
                Happy customer testimonial
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">
                {currentIndex + 1} of {videos.length}
              </span>
            </div>

            <h1 className="mt-5 max-w-3xl text-2xl font-black leading-tight tracking-tight text-[#102a43] sm:text-3xl lg:text-4xl">
              Review the experiences of our happy OxyLoans customers
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              Every testimonial reflects an individual customer experience.
              Watch their stories to better understand the OxyLoans lending
              journey, platform access, and customer support.
            </p>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
              <Quote className="h-8 w-8 text-[#008cba]" />
              <p className="mt-3 text-sm font-semibold italic leading-7 text-slate-700 sm:text-base sm:leading-8">
                “{description}”
              </p>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-4 sm:max-w-xl">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#008cba] text-lg font-black text-white">
                {customerName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate font-black text-[#102a43]">
                  {customerName}
                </p>
                <p className="mt-0.5 truncate text-sm text-slate-500">
                  {designation}
                </p>
              </div>
            </div>

            <div className="mt-auto pt-7">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-t border-slate-200 pt-5 sm:gap-3">
                <button
                  type="button"
                  onClick={onPrevious}
                  disabled={videos.length <= 1}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40 sm:justify-self-start sm:px-4"
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:text-xs">
                    Testimonial
                  </p>
                  <p className="mt-1 whitespace-nowrap text-sm font-black text-[#008cba]">
                    {String(currentIndex + 1).padStart(2, "0")} /{" "}
                    {String(videos.length).padStart(2, "0")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onNext}
                  disabled={videos.length <= 1}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#008cba] px-3 text-sm font-black text-white transition hover:bg-[#007aa3] disabled:cursor-not-allowed disabled:opacity-40 sm:justify-self-end sm:px-4"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-gradient-to-br from-[#f5fbfd] via-white to-[#eef9f7] px-4 py-6 sm:px-7 sm:py-8 lg:px-10">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onPrevious}
              disabled={videos.length <= 1}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex max-w-[calc(100vw-120px)] items-center gap-1.5 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:max-w-none">
              {videos.map((video, index) => {
                const active = index === currentIndex;
                return (
                  <button
                    key={video.id}
                    type="button"
                    onClick={() => onSelect(index)}
                    aria-label={`Open testimonial ${index + 1}`}
                    aria-current={active ? "page" : undefined}
                    className={`h-2.5 shrink-0 rounded-full transition-all duration-200 ${
                      active
                        ? "w-8 bg-[#008cba]"
                        : "w-2.5 bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={onNext}
              disabled={videos.length <= 1}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

interface CEOAITabProps {
  onOpenRadhAI: () => void;
  onOpenChat: () => void;
}

const CEOAITab: React.FC<CEOAITabProps> = ({ onOpenRadhAI, onOpenChat }) => {
  const capabilities = [
    "Jobs and career guidance",
    "AI and technology solutions",
    "OxyLoans platform assistance",
    "Lending and opportunity guidance",
    "Gold and real-estate information",
  ];

  const companyLinks = [
    { label: "ASKOXY.AI", url: "https://www.askoxy.ai/" },
    { label: "OXYLOANS", url: "https://oxyloans.com/" },
    { label: "OXYBRICKS", url: "https://oxybricks.world/" },
    { label: "OXYGOLD.AI", url: "https://www.oxygold.ai/" },
  ];

  return (
    <section>
      <SectionHeading
        icon={Bot}
        title="CEO AI Clone"
        description="Meet radhAI, the AI clone of Radhakrishna Thatavarti, created to provide voice and chat guidance across the OXY ecosystem."
      />

      <div className="overflow-hidden rounded-3xl bg-[#030712] text-white shadow-xl">
        <div className="relative grid items-center gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(34,211,238,0.22),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(163,230,53,0.14),transparent_30%)]" />

          <div className="relative flex min-h-[360px] items-end justify-center overflow-hidden border-b border-white/10 bg-white/[0.04] p-5 lg:min-h-[570px] lg:border-b-0 lg:border-r">
            <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-lime-300/30 bg-black/40 px-3 py-2 text-[11px] font-bold text-lime-300 backdrop-blur sm:text-xs">
              <span className="h-2 w-2 rounded-full bg-lime-300" />
              CEO AI Clone available 24/7
            </div>
            <img
              src={RADHAI}
              alt="radhAI CEO AI clone"
              className="relative z-[1] max-h-[330px] w-full object-contain drop-shadow-[0_0_34px_rgba(34,211,238,0.3)] sm:max-h-[430px] lg:max-h-[535px]"
            />
          </div>

          <div className="relative p-5 sm:p-8 lg:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-300">
              <Sparkles className="h-4 w-4" />
              Meet radhAI
            </div>

            <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
              Talk directly with the CEO AI clone
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
              radhAI is the AI clone of Radhakrishna Thatavarti, CEO and
              Co-Founder of ASKOXY.AI and OxyLoans. Open the complete radhAI
              experience to speak by voice or continue through chat.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {capabilities.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-lime-300" />
                  <span className="text-sm font-semibold text-slate-200">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={onOpenRadhAI}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-lime-300 to-cyan-300 px-5 py-3.5 text-sm font-black text-slate-950 transition hover:scale-[1.01]"
              >
                <Mic className="h-5 w-5" />
                Talk with radhAI
              </button>
              <button
                type="button"
                onClick={onOpenChat}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl border border-cyan-300/35 bg-white/[0.07] px-5 py-3.5 text-sm font-black text-cyan-200 transition hover:bg-white/[0.12]"
              >
                <MessageCircle className="h-5 w-5" />
                Chat with radhAI
              </button>
            </div>

            <div className="mt-7 border-t border-white/10 pt-6">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                OXY Group Platforms
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {companyLinks.map((company) => (
                  <a
                    key={company.label}
                    href={company.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-bold text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-300"
                  >
                    {company.label}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface ProductTabProps {
  icon: React.ElementType;
  logoSrc?: string;
  logoAlt?: string;
  title: string;
  eyebrow: string;
  description: string;
  highlight: string;
  actionLabel: string;
  stats?: Array<{
    icon: React.ElementType;
    value: string;
    label: string;
  }>;
  features: Array<{
    icon: React.ElementType;
    title: string;
    description: string;
  }>;
  onAction: () => void;
}

const ProductTab: React.FC<ProductTabProps> = ({
  icon: Icon,
  logoSrc,
  logoAlt = "Product logo",
  title,
  eyebrow,
  description,
  highlight,
  actionLabel,
  stats = [],
  features,
  onAction,
}) => (
  <section className="space-y-5">
    <div className="relative overflow-hidden rounded-[30px] border border-[#b9dce8] bg-gradient-to-br from-[#075985] via-[#087aa0] to-[#1ab394] px-5 py-8 text-white shadow-[0_25px_70px_-35px_rgba(0,92,124,0.7)] sm:px-8 sm:py-10 lg:px-10">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      <div className="relative max-w-4xl">
        {logoSrc ? (
          <div className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-white px-4 py-2 shadow-lg ring-1 ring-white/30">
            <img
              src={logoSrc}
              alt={logoAlt}
              className="h-9 w-auto max-w-[210px] object-contain sm:h-10"
            />
          </div>
        ) : (
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
            <Icon className="h-7 w-7" />
          </span>
        )}
        <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/85 sm:text-base">
          {description}
        </p>
        <div className="mt-6 inline-flex rounded-2xl border border-white/20 bg-white/12 px-4 py-3 text-sm font-black backdrop-blur sm:text-base">
          {highlight}
        </div>
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-black text-[#075985] shadow-lg transition hover:-translate-y-0.5 hover:bg-sky-50 sm:w-auto"
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>

    {stats.length > 0 && (
      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => {
          const StatIcon = stat.icon;
          return (
            <article
              key={stat.label}
              className="flex items-center gap-3 rounded-2xl border border-[#d7e5ee] bg-white p-4 shadow-sm sm:p-5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e9f7fb] text-[#008cba]">
                <StatIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xl font-black leading-tight text-[#102a43] sm:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.06em] text-[#607d8b]">
                  {stat.label}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    )}

    <div className="grid gap-4 md:grid-cols-3">
      {features.map((feature) => {
        const FeatureIcon = feature.icon;
        return (
          <article
            key={feature.title}
            className="group rounded-2xl border border-[#d7e5ee] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#91cbdc] hover:shadow-lg"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9f7fb] text-[#008cba] transition group-hover:bg-[#008cba] group-hover:text-white">
              <FeatureIcon className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-lg font-black text-[#183b56]">
              {feature.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#607d8b]">
              {feature.description}
            </p>
          </article>
        );
      })}
    </div>

    <div className="flex flex-col gap-4 rounded-2xl border border-[#d7e5ee] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div>
        <h2 className="text-lg font-black text-[#183b56]">
          Continue on the official platform
        </h2>
        <p className="mt-1 text-sm text-[#607d8b]">
          Open the registration or opportunity page in a new secure tab.
        </p>
      </div>
      <button
        type="button"
        onClick={onAction}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#008cba] px-5 py-3.5 text-sm font-black text-white transition hover:bg-[#007aa3] sm:w-auto"
      >
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  </section>
);

const SectionHeading: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
}> = ({ icon: Icon, title, description }) => (
  <div className="mb-5 flex items-start gap-3 sm:mb-7">
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#075985] text-white">
      <Icon className="h-5 w-5" />
    </span>
    <div>
      <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h1>
      <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  </div>
);

const ProfileItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="rounded-xl border border-white/10 bg-white/10 p-4">
    <p className="text-xs font-bold uppercase tracking-wide text-sky-200">
      {label}
    </p>
    <p className="mt-1 break-words text-sm font-black text-white">{value}</p>
  </div>
);

const InputField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ElementType;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  disabled?: boolean;
  helperText?: string;
}> = ({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  inputMode,
  maxLength,
  disabled = false,
  helperText,
}) => (
  <div>
    <label className="mb-2 block text-sm font-bold text-[#334e68]">
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#78909c]" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        disabled={disabled}
        className={`w-full rounded-xl border py-3 pl-10 pr-10 text-sm outline-none transition ${
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-600"
            : "border-[#cfdde6] bg-white text-[#183b56] placeholder:text-[#9fb3c8] focus:border-[#008cba] focus:ring-4 focus:ring-[#dff4fa]"
        }`}
      />
      {disabled && (
        <LockKeyhole className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      )}
    </div>
    {helperText && (
      <p className="mt-1.5 text-xs font-semibold text-slate-500">
        {helperText}
      </p>
    )}
  </div>
);

const TextAreaField: React.FC<{
  label: string;
  rows: number;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}> = ({ label, rows, value, onChange, placeholder }) => (
  <div>
    <label className="mb-2 block text-sm font-bold text-slate-700">
      {label}
    </label>
    <textarea
      rows={rows}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
    />
  </div>
);

const AlertMessage: React.FC<{
  type: "success" | "error";
  message: string;
}> = ({ type, message }) => (
  <div
    className={`mb-5 flex items-start gap-3 rounded-xl border p-4 text-sm ${
      type === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-red-200 bg-red-50 text-red-700"
    }`}
  >
    {type === "success" ? (
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
    ) : (
      <MessageCircle className="mt-0.5 h-5 w-5 shrink-0" />
    )}
    <span>{message}</span>
  </div>
);

const EmptyState: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
}> = ({ icon: Icon, title, description }) => (
  <div className="flex min-h-[340px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm">
    <div className="max-w-sm">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon className="h-7 w-7" />
      </span>
      <h2 className="mt-4 font-black text-slate-800">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  </div>
);

export default LenderEngagementWorkspace;