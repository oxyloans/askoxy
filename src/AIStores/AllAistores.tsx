import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconShare,
  IconSparkles,
  IconSearch,
  IconFilter,
} from "@tabler/icons-react";
import BASE_URL from "../Config";
import axios from "axios";
import { Modal, Radio, Input, Select, Spin, message } from "antd";

interface StoreAgent {
  agentId: string;
  agentName: string;
  agentCreatorName?: string | null;
  agentStatus?: string | null;
}

interface AiStore {
  id: string | null;
  storeName: string;
  description: string;
  storeCreatedBy: string;
  storeId: string;
  status: string | null;
  storeImageUrl?: string | null;
  agentDetailsOnAdUser?: StoreAgent[];
  isCompanyStore?: boolean;
  companyName?: string | null;
}

/** ✅ company-contact response (as per your backend examples) */
type CompanyContactResponse = {
  id?: string | null;
  name?: string | null;
  companyName?: string | null;
  companyEmailId?: string | null;
  userId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  isEmployee?: boolean | null;
  otp?: string | null;
  salt?: string | null;
  emailOtpSession?: string | null;
  personRole?: string | null;
  message?: string | null;
  status?: boolean | null;
};

/** ✅ safe pick helper (matches your profile flow) */
const pick = (obj: any, ...keys: string[]) => {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return "";
};

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem("accessToken");
  return {
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
  };
};

const safeFullName = (first?: string, last?: string) => {
  const f = (first || "").trim();
  const l = (last || "").trim();
  const full = `${f} ${l}`.trim();
  return full || f || "User";
};

const PERSON_ROLES = [
  "Software Engineer / Developer",
  "Frontend Developer",
  "Backend Developer",
  "Full-Stack Developer",
  "Mobile App Developer",
  "DevOps Engineer",
  "Cloud Engineer",
  "System Administrator",
  "Network Engineer",
  "Data Analyst",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "Business Intelligence (BI) Developer",
  "Cybersecurity Analyst",
  "Ethical Hacker / Penetration Tester",
  "QA Engineer / Software Tester",
  "Automation Test Engineer",
  "Project Manager",
  "Product Manager",
  "Scrum Master",
  "Business Analyst",
  "UI/UX Designer",
  "Product Designer",
  "Graphic Designer",
  "IT Support / Helpdesk",
  "Technical Support Engineer",
  "Pre-Sales Engineer",
  "IT Sales / Account Manager",
  "Tech Lead",
  "Engineering Manager",
  "Solution Architect",
  "CTO (Chief Technology Officer)",
  "CIO (Chief Information Officer)",
  "Other",
];

type StoreTab = "ALL" | "COMPANY";

const AllAIStores: React.FC = () => {
  const [stores, setStores] = useState<AiStore[]>([]);
  const [filteredStores, setFilteredStores] = useState<AiStore[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);

  // ✅ NEW: Tabs for store listing page
  const [activeStoreTab, setActiveStoreTab] = useState<StoreTab>("ALL");

  const navigate = useNavigate();

  const baseAiStoreDomain = "https://www.askoxy.ai";
  const aiStorePrefix = `${baseAiStoreDomain}/ai-store/`;

  /** ---------------------------------------------
   * ✅ NEW: Profile + Company Gate States
   * --------------------------------------------- */
  const [customerId, setCustomerId] = useState<string>("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const profileName = useMemo(
    () => safeFullName(firstName, lastName),
    [firstName, lastName]
  );

  // company contact check
  const [companyChecking, setCompanyChecking] = useState(false);
  const [companyContact, setCompanyContact] =
    useState<CompanyContactResponse | null>(null);

  // gate completion
  const [companyGateDone, setCompanyGateDone] = useState(false);

  // otp modal
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [salt, setSalt] = useState("");
  const [emailOtpSession, setEmailOtpSession] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // if user clicks store before completing gate → hold navigation
  const [pendingStoreToOpen, setPendingStoreToOpen] = useState<AiStore | null>(
    null
  );

  /** ---------------------------------------------
   * Existing logic: slugify + public URL
   * --------------------------------------------- */
  const slugify = useCallback(
    (text?: string | null): string =>
      text
        ? text
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
            .replace(/--+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 40)
        : "store",
    []
  );

  const buildPublicStoreUrl = useCallback(
    (store: AiStore): string => {
      const slug = slugify(store.storeName);
      return `${aiStorePrefix}${slug}`;
    },
    [slugify, aiStorePrefix]
  );

  const accessToken = localStorage.getItem("accessToken");

  /** ---------------------------------------------
   * ✅ Fetch stores (your existing function)
   * --------------------------------------------- */
  const fetchStores = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${BASE_URL}/ai-service/agent/getAiStoreAllAgents`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch AI Stores");

      const result = await res.json();

      const active = Array.isArray(result)
        ? result.filter((x: any) => x?.aiStoreStatus === "ACTIVE")
        : Array.isArray(result?.data)
        ? result.data.filter((x: any) => x?.aiStoreStatus === "ACTIVE")
        : [];

      const data = Array.isArray(active) ? active.reverse() : [];
      const validStores = data.filter((s: any) => s && s.storeId);

      setStores(validStores);
      setFilteredStores(validStores);
    } catch (err) {
      setError("Unable to load AI Stores. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ UPDATED: filter by (tab + search)
  useEffect(() => {
    const base =
      activeStoreTab === "COMPANY"
        ? stores.filter((s) => !!s?.isCompanyStore)
        : stores;

    if (!searchQuery.trim()) {
      setFilteredStores(base);
      return;
    }

    const query = searchQuery.toLowerCase();
    setFilteredStores(
      base.filter(
        (store) =>
          store.storeName?.toLowerCase().includes(query) ||
          store.description?.toLowerCase().includes(query) ||
          store.storeCreatedBy?.toLowerCase().includes(query)
      )
    );
  }, [searchQuery, stores, activeStoreTab]);

  /** ---------------------------------------------
   * ✅ NEW: Load customerId from storage (best effort)
   * --------------------------------------------- */
  useEffect(() => {
    const id =
      localStorage.getItem("customerId") ||
      localStorage.getItem("userId") ||
      localStorage.getItem("user_id") ||
      "";
    if (id) setCustomerId(id);
  }, []);

  /** ---------------------------------------------
   * ✅ NEW: Fetch Profile (name + email) from profile API
   * --------------------------------------------- */
  useEffect(() => {
    const run = async () => {
      if (!customerId) return;

      try {
        setProfileLoading(true);

        const response = await axios.get(
          `${BASE_URL}/user-service/customerProfileDetails`,
          {
            params: { customerId },
            headers: { ...getAuthHeaders() },
          }
        );

        const data = response?.data || {};

        const profileData = {
          userFirstName: pick(data, "firstName", "userFirstName"),
          userLastName: pick(data, "lastName", "userLastName"),
          customerEmail: pick(data, "email", "customerEmail"),
        };
        setFirstName(profileData.userFirstName);
        setLastName(profileData.userLastName);
        setEmail(profileData.customerEmail);
      } catch (e: any) {
        // ignore
      } finally {
        setProfileLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);
  const handleLogin1 = () => {
    try {
      setLoading(true);

      const userId = localStorage.getItem("userId");
      const redirectPath = "/main/usercreateaistore";

      if (userId) {
        navigate(redirectPath);
      } else {
        sessionStorage.setItem("redirectPath", redirectPath);
        sessionStorage.setItem("primaryType", "AGENT"); // Set primary type for agents
        // Pass primaryType as query parameter
        window.location.href = "/whatsappregister?primaryType=AGENT";
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setLoading(false);
    }
  };
  /** ---------------------------------------------
   * ✅ Step-1 Check Company Contact
   * --------------------------------------------- */
  const checkCompanyContact = useCallback(async () => {
    if (!customerId) return;

    setCompanyChecking(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/marketing-service/campgin/get-company-contact`,
        {
          params: { userId: customerId },
          headers: { ...getAuthHeaders() },
        }
      );

      const data: CompanyContactResponse = res?.data || {};
      setCompanyContact(data);
      setCompanyGateDone(true);
      setOtpModalOpen(false);
      return true;
    } catch (err: any) {
      const status = err?.response?.status;
      return false;
    } finally {
      setCompanyChecking(false);
    }
  }, [customerId]);

  useEffect(() => {
    if (!customerId) return;
    checkCompanyContact();
  }, [customerId, checkCompanyContact]);

  const saveAsNonEmployee = async () => {
    console.log("saveAsNonEmployee called");
    if (!customerId) return;
    if (sendingOtp) return;

    setSendingOtp(true);
    try {
      const payload = {
        userId: customerId,
        isEmployee: false,
        name: profileName,
      };

      const res = await axios.post(
        `${BASE_URL}/marketing-service/campgin/add-company-info`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }
      );

      message.success(res?.data?.message || "Saved successfully");
      setCompanyGateDone(true);

      await checkCompanyContact();

      if (pendingStoreToOpen) {
        const st = pendingStoreToOpen;
        setPendingStoreToOpen(null);
        const slug = slugify(st.storeName);
        navigate(`/ai-store/${slug}`, { state: { storeId: st.storeId } });
      }
    } catch (e: any) {
      message.error(
        e?.response?.data?.message || "Failed to save. Please try again."
      );
    } finally {
      setSendingOtp(false);
    }
  };

  const handleOpenDetails = useCallback(
    async (store: AiStore) => {
      const slug = slugify(store.storeName);

      // ✅ Company verification is now handled *inside* the AI Store page via a button.
      // So from listing page we always open the store (no login / gate here).
      navigate(`/ai-store/${slug}`, {
        state: { storeId: store.storeId, companyName: store.companyName },
      });
    },
    [navigate, slugify]
  );

  const openWhatsApp = useCallback((shareMessage: string, storeId: string) => {
    try {
      // Use wa.me for better compatibility (works on both mobile and desktop)
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
        shareMessage
      )}`;

      // Try to open in new window/tab
      const newWindow = window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer,width=600,height=600"
      );

      // Check if popup was blocked (simple check)
      if (!newWindow) {
        // Popup blocked or failed to open
        // Copy to clipboard as fallback
        if (navigator.clipboard) {
          navigator.clipboard
            .writeText(shareMessage)
            .then(() => {
              message.success(
                "Link copied to clipboard! You can now share it manually."
              );
            })
            .catch(() => {
              message.warning(
                "Please allow popups for this site to share via WhatsApp."
              );
            });
        } else {
          message.warning(
            "Please allow popups for this site to share via WhatsApp."
          );
        }
      } else {
        // Successfully opened WhatsApp
        setShareSuccess(storeId);
        setTimeout(() => setShareSuccess(null), 1600);
      }
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
      message.error("Unable to open WhatsApp. Please try again.");
    }
  }, []);

  const handleShareStore = useCallback(
    (store: AiStore, e: React.MouseEvent) => {
      e.stopPropagation();
      const publicUrl = buildPublicStoreUrl(store);

      const staticMessage = `
🌟 Explore this AI Store on Bharat AI Store!

🧠 AI Store: ${store.storeName}

This AI Store is curated on ASKOXY.AI — a platform where anyone can build AI Agents, learn skills, and earn money!

🔗 Open the AI Store:
${publicUrl}

Create your own AI Agent today on ASKOXY.AI! 🚀
      `.trim();

      console.log("Sharing message:", staticMessage);
      console.log("Public URL:", publicUrl);

      // Try native share API first (mobile browsers)
      // Some browsers prioritize URL over text, so we'll try both approaches
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        // First try with full message in text field only
        (navigator as any)
          .share({
            title: store.storeName || "AI Store - Bharat AI Store",
            text: staticMessage, // Full message with URL included
          })
          .then(() => {
            console.log("Native share successful with full message");
            setShareSuccess(store.storeId);
            setTimeout(() => setShareSuccess(null), 1600);
          })
          .catch((error: any) => {
            console.log(
              "Native share failed with text only, trying with URL:",
              error
            );
            // If that fails, try with URL only (some browsers work better this way)
            (navigator as any)
              .share({
                title: store.storeName || "AI Store - Bharat AI Store",
                text: staticMessage,
                url: publicUrl,
              })
              .then(() => {
                console.log("Native share successful with URL");
                setShareSuccess(store.storeId);
                setTimeout(() => setShareSuccess(null), 1600);
              })
              .catch((error2: any) => {
                console.log(
                  "All native share attempts failed, falling back to WhatsApp:",
                  error2
                );
                // Fallback to WhatsApp if all native share attempts fail
                openWhatsApp(staticMessage, store.storeId);
              });
          });
        return;
      }

      // Direct fallback to WhatsApp
      openWhatsApp(staticMessage, store.storeId);
    },
    [buildPublicStoreUrl, openWhatsApp]
  );

  const tabClass = (active: boolean) =>
    [
      "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-all",
      active
        ? "border-violet-700 bg-violet-700 text-white"
        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    ].join(" ");

  const headerTitle =
    activeStoreTab === "COMPANY" ? "Company AI Stores" : "All AI Stores";
  const headerDesc =
    activeStoreTab === "COMPANY"
      ? "Explore company-created AI Stores (Jobs + Agents)."
      : "Explore curated collections of AI Agents created by our community.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      {/* ✅ Gate loader (small) */}
      {(profileLoading || companyChecking) && (
        <div className="mx-auto max-w-[1400px] px-4 pt-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
            <Spin size="small" />
            <span>
              Verifying profile & company info…{" "}
              <span className="text-slate-400">
                (required for opening AI Stores)
              </span>
            </span>
          </div>
        </div>
      )}

      {/* ✅ Slightly wider on big screens */}
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {/* Header */}
        <div className="mb-3 sm:mb-6">
          {/* ✅ Row 1: Title/Desc (left) + Search (right) */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            {/* Left: Title + Desc */}
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
                {headerTitle}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                {headerDesc}
              </p>
            </div>

            {/* Right: Search (responsive) */}
            {stores.length > 0 && (
              <div className="w-full sm:w-[420px]">
                <div className="relative">
                  <IconSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder={
                      activeStoreTab === "COMPANY"
                        ? "Search company stores..."
                        : "Search AI stores..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm shadow-sm transition-all placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 sm:text-base"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      aria-label="Clear search"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {searchQuery && (
                  <p className="mt-3 text-sm text-slate-600">
                    Found {filteredStores.length}{" "}
                    {filteredStores.length === 1 ? "store" : "stores"}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ✅ Row 2: Tabs (left) + Create button (right end) */}
          <div className="mt-4 flex w-full items-center justify-between gap-3">
            {/* LEFT: Tabs row (scrollable only for tabs) */}
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                type="button"
                className={tabClass(activeStoreTab === "ALL")}
                onClick={() => setActiveStoreTab("ALL")}
              >
                All AI Stores
              </button>

              <button
                type="button"
                className={tabClass(activeStoreTab === "COMPANY")}
                onClick={() => setActiveStoreTab("COMPANY")}
              >
                Company AI Stores
              </button>

              {stores.length > 0 && (
                <div className="ml-2 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700 whitespace-nowrap">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-violet-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
                  </span>
                  {filteredStores.length}{" "}
                  {filteredStores.length === 1 ? "Store" : "Stores"}
                </div>
              )}
            </div>

            {/* RIGHT: Create Button (ALWAYS at end) */}
            <button
              onClick={handleLogin1}
              className="shrink-0 whitespace-nowrap rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:px-4 sm:text-sm"
            >
              Create AI Store
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24">
            <div className="relative">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600 sm:h-16 sm:w-16" />
              <IconSparkles className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-violet-600 sm:h-8 sm:w-8" />
            </div>
            <span className="mt-4 text-sm font-medium text-slate-600 sm:text-base">
              Loading AI Stores...
            </span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 p-4 text-center sm:p-6">
            <p className="mt-3 text-sm font-medium text-red-800 sm:text-base">
              {error}
            </p>
            <button
              onClick={fetchStores}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 sm:text-base"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredStores.length === 0 && (
          <div className="mx-auto max-w-md rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 text-center sm:p-12">
            <IconFilter className="mx-auto h-12 w-12 text-slate-400 sm:h-16 sm:w-16" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900 sm:text-xl">
              {searchQuery ? "No stores found" : "No AI Stores available"}
            </h3>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Check back soon for new AI Stores"}
            </p>
          </div>
        )}

        {/* ✅ GRID */}
        {!loading && !error && filteredStores.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
            {filteredStores.map((store) => (
              <StoreCard
                key={store.storeId}
                store={store}
                onOpenDetails={handleOpenDetails}
                onShare={handleShareStore}
                isShareSuccess={shareSuccess === store.storeId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StoreCard: React.FC<{
  store: AiStore;
  onOpenDetails: (store: AiStore) => void;
  onShare: (store: AiStore, e: React.MouseEvent) => void;
  isShareSuccess: boolean;
}> = React.memo(({ store, onOpenDetails, onShare, isShareSuccess }) => {
  return (
    <div
      onClick={() => onOpenDetails(store)}
      className="group relative flex cursor-pointer flex-col rounded-3xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100 active:scale-[0.99]"
    >
      <DynamicBanner
        storeName={store.storeName}
        storeImageUrl={store.storeImageUrl}
      />

      <div className="flex flex-1 flex-col px-2 pb-2 pt-3">
        <h3 className="line-clamp-2 text-[15px] font-bold text-slate-900 transition-colors group-hover:text-violet-600">
          {store.storeName}
        </h3>

        <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-600">
          {store.description ||
            "Curated collection of AI Agents crafted for real world use cases."}
        </p>
      </div>

      <div className=" px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          {store.agentDetailsOnAdUser?.length ? (
            <div className="inline-flex h-10 min-w-[96px] items-center justify-center gap-1 rounded-xl bg-violet-100 px-3 text-xs font-semibold text-violet-700">
              <IconSparkles className="h-4 w-4" />
              <span>
                {store.agentDetailsOnAdUser.length}{" "}
                {store.agentDetailsOnAdUser.length === 1 ? "Agent" : "Agents"}
              </span>
            </div>
          ) : (
            <div className="h-10 min-w-[96px]" />
          )}

          <button
            type="button"
            onClick={(e) => onShare(store, e)}
            className="inline-flex h-10 w-[96px] items-center justify-center rounded-xl bg-white shadow-sm transition-all hover:scale-105 hover:bg-violet-50 hover:shadow-md active:scale-95"
            aria-label="Share AI Store"
          >
            {isShareSuccess ? (
              <svg
                className="h-5 w-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <IconShare className="h-5 w-5 text-slate-600 hover:text-violet-600" />
            )}
          </button>
        </div>
      </div>

      <div className="px-2 pb-2 pt-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(store);
          }}
          className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:shadow-violet-200 active:scale-95"
        >
          Explore Store
        </button>
      </div>
    </div>
  );
});

const DynamicBanner: React.FC<{
  storeName: string;
  storeImageUrl?: string | null;
}> = React.memo(({ storeName, storeImageUrl }) => {
  const [imgError, setImgError] = useState(false);

  const initials = useMemo(() => {
    return (
      storeName
        .trim()
        .split(/\s+/)
        .map((w) => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase() || "AI"
    );
  }, [storeName]);

  const hue = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < storeName.length; i++)
      hash = storeName.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash % 360);
  }, [storeName]);

  const gradient = `linear-gradient(135deg, hsl(${hue}, 75%, 55%) 0%, hsl(${hue}, 75%, 45%) 100%)`;

  const isValidImage =
    storeImageUrl &&
    typeof storeImageUrl === "string" &&
    storeImageUrl.trim() !== "" &&
    !storeImageUrl.includes("placehold.co") &&
    !storeImageUrl.includes("placeholder") &&
    storeImageUrl.trim().toLowerCase() !== "null";

  const showImage = Boolean(isValidImage && !imgError);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-100">
      <div className="relative h-40 w-full sm:h-44">
        {showImage ? (
          <img
            src={storeImageUrl as string}
            alt={storeName}
            className="h-full w-full object-contain bg-white"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: gradient }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(45deg, rgba(255,255,255,0.12) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.12) 75%)",
                backgroundSize: "40px 40px",
              }}
            />
            <span className="text-6xl font-black text-white drop-shadow-2xl tracking-wider">
              {initials}
            </span>
          </div>
        )}
      </div>

      <div className="absolute right-3 top-3 rounded-full bg-black/20 px-3 py-1 backdrop-blur-sm">
        <span className="text-xs font-bold text-white">Featured</span>
      </div>
    </div>
  );
});

DynamicBanner.displayName = "DynamicBanner";
StoreCard.displayName = "StoreCard";

export default AllAIStores;
